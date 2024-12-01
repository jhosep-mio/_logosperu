import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { type TransitionProps } from '@mui/material/transitions'
import { useFormik } from 'formik'
import axios from 'axios'
import { Global } from '../../../helper/Global'
import Swal from 'sweetalert2'
import { Link, useNavigate } from 'react-router-dom'
import { SchemaValidarVentas } from '../schemas/Schemas'
import { LoadingSmall } from '../LoadingSmall'
import { TitleBriefs } from '../TitleBriefs'
import { Errors } from '../Errors'
import { InputsBriefs } from '../InputsBriefs'
import { type modalVentas } from '../schemas/Interfaces'

const Transition = React.forwardRef(function Transition (
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export const GenerarVenta = ({ open, setOpen, id, medio, nombres }: modalVentas): JSX.Element => {
  const [duplicateCode, setDuplicateCode] = useState<boolean>(false)
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const [loadingValidacion, seLoadingValidation] = useState(false)
  const [abrirPlan, setAbrirPlan] = useState(false)
  const [vermas, setVerMas] = useState(false)

  const handleClose = (): void => {
    setOpen(false)
  }

  const limpiar = (): void => {
    resetForm()
  }

  const generarVenta = async (): Promise<void> => {
    setDuplicateCode(false)
    seLoadingValidation(true)
    try {
      const data = new FormData()
      data.append('id_cliente', values.id_cliente)
      data.append('medio_ingreso', values.medio_ingreso)
      data.append('dni_ruc', values.dni_ruc)
      data.append('nombre_empresa', values.nombre_empresa)
      data.append('id_contrato', values.id_contrato)
      const request = await axios.post(`${Global.url}/generarVenta`, data, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })
      if (request.data.status == 'success') {
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        Swal.fire(`${request.data.codigo}`, '', 'success')
        navigate('/admin/lista-ventas')
      } else if (request.data.message.includes('codigo invalido')) {
        setDuplicateCode(true)
      } else {
        Swal.fire('Error al generar la venta', '', 'error')
      }
    } catch (error: any) {
      if (
        error.request.response.includes(
          `Duplicate entry '${values.id_contrato}' for key 'id_contrato'`
        )
      ) {
        setDuplicateCode(true)
      } else {
        console.log(error)
      }
    }
    seLoadingValidation(false)
  }

  const generarCodigo = async (plan: string): Promise<void> => {
    seLoadingValidation(true)
    setDuplicateCode(false)
    try {
      const data = new FormData()
      data.append('plan', plan)
      const request = await axios.post(`${Global.url}/generarCodigo`, data, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })

      if (request.data.status == 'success') {
        setValues({
          ...values,
          id_contrato: request.data.codigo
        })
      } else {
        Swal.fire('Error al generar la venta', '', 'error')
      }
    } catch (error) {
      console.log(error)
      Swal.fire('Error al generar la venta', '', 'error')
    }
    seLoadingValidation(false)
  }

  useEffect(() => {
    setValues({
      ...values,
      id_cliente: id,
      medio_ingreso: medio,
      nombre_empresa: nombres
    })
  }, [open])

  const {
    handleSubmit,
    handleChange,
    resetForm,
    setValues,
    errors,
    values,
    touched,
    handleBlur
  } = useFormik({
    initialValues: {
      id: 0,
      medio_ingreso: '',
      nombre_empresa: '',
      plan: '',
      id_contrato: '',
      dni_ruc: '',
      id_cliente: ''
    },
    validationSchema: SchemaValidarVentas,
    onSubmit: generarVenta
  })

  return (
    <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        className='w-screen p-0 m-0'
      >
        <DialogTitle className="text-center">{'Generar venta'}</DialogTitle>
        <DialogContent className="w-full md:w-96 p-0">
          {values.id_contrato
            ? <DialogContentText id="alert-dialog-slide-description">
              {loadingValidacion
                ? (
                <LoadingSmall />
                  )
                : (
                <form
                  className="flex flex-col gap-5 w-full"
                  onSubmit={(e) => {
                    generarVenta()
                    e.preventDefault()
                  }}
                >
                  <div className="w-full  lg:relative mt-5">
                    <TitleBriefs titulo="Codigo de contrato" />
                    <InputsBriefs
                      name="id_contrato"
                      type="text"
                      value={values.id_contrato}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={false}
                    />
                    <Errors
                      errors={errors.id_contrato}
                      touched={touched.id_contrato}
                    />
                    {duplicateCode && (
                      <p className="text-md p-0 m-0 mt-0 pl-2">
                        {' '}
                        <span className="text-main">Contrato duplicado</span>
                      </p>
                    )}
                  </div>
                  <div className="flex w-full justify-end gap-3 rounded-md text-black ">
                    <Link
                      to="#"
                      className="bg-red-600 px-3 py-2 rounded-md text-white cursor-pointer"
                      onClick={() => {
                        handleClose()
                        limpiar()
                        setAbrirPlan(false)
                        setVerMas(false)
                      }}
                    >
                      Cancelar
                    </Link>
                    <input
                      type="submit"
                      className="bg-secondary-150 px-3 py-2 text-white rounded-md cursor-pointer"
                      value="Confirmar"
                    />
                  </div>
                </form>
                  )}
            </DialogContentText>
            : (
            <DialogContentText id="alert-dialog-slide-description" className='w-full p-0 m-0'>
              {loadingValidacion
                ? <LoadingSmall />
                : (
                <form className="flex flex-col gap-5 w-full" onSubmit={handleSubmit}>
                    {!abrirPlan
                      ? <>
                            <div className="w-full  lg:relative mt-5">
                                <TitleBriefs titulo=" Nombres/Empresa" />
                                <input
                                    className="border placeholder-gray-400 focus:outline-none
                                    focus:border-black w-full pr-4 h-12 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                    border-gray-300 rounded-md transition-all"
                                    name="nombre_empresa"
                                    type="text"
                                    value={values.nombre_empresa}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={false}
                                />
                                <Errors
                                errors={errors.nombre_empresa}
                                touched={touched.nombre_empresa}
                                />
                            </div>
                            <div className="w-full  lg:relative mt-2">
                                <TitleBriefs titulo="Medio de ingreso" />
                                <select
                                className="border placeholder-gray-400 focus:outline-none
                                                                    focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                                    border-gray-300 rounded-md transition-all"
                                name="medio_ingreso"
                                value={values.medio_ingreso}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                >
                                {/* FB GOOGLE, VENTAS, POST VENTA, RECOMENDACION, ISNTAGRAM) */}
                                <option value="">Seleccionar</option>
                                <option value="0">Facebook</option>
                                <option value="4">Whatsapp</option>
                                <option value="1">Google</option>
                                <option value="5">Instagram</option>
                                <option value="2">Ventas</option>
                                <option value="3">Post Venta</option>
                                <option value="6">Recomendación</option>
                                <option value="7">Logos</option>

                                </select>
                                <Errors
                                errors={errors.medio_ingreso}
                                touched={touched.medio_ingreso}
                                />
                            </div>
                            <div className="w-full  lg:relative mt-2">
                                <TitleBriefs titulo=" DNI/RUC (Opcional)" />
                                <input
                                    className="border placeholder-gray-400 focus:outline-none
                                    focus:border-black w-full pr-4 h-12 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                    border-gray-300 rounded-md transition-all"
                                    name="dni_ruc"
                                    type="text"
                                    value={values.dni_ruc}
                                    onChange={handleChange}
                                    onBlur={handleBlur}
                                    disabled={false}
                                />
                                <Errors
                                errors={errors.dni_ruc}
                                touched={touched.dni_ruc}
                                />
                            </div>
                            <div className="w-full  lg:relative mt-2">
                                <TitleBriefs titulo="Plan"/>
                                <button
                                className="border placeholder-gray-400 focus:outline-none
                                                                    focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                                    border-gray-300 rounded-md transition-all"
                                onClick={() => { setAbrirPlan(true) }}
                                >
                                {values.plan ? values.plan : 'Seleccionar'}
                                </button>
                                {/* <Errors errors={errors.plan} touched={touched.plan} /> */}
                            </div>
                        </>
                      : <div className="w-full lg:relative mt-2 ">
                            <TitleBriefs titulo="Seleecionar plan"/>
                            <div
                                className="grid grid-cols-1 md:grid-cols-1 gap-2 items-center mb-0 p-4 cursor-pointer"
                            >
                                <p className="line-clamp-2 text-black text-center w-full border-2 py-1 rounded-xl" onClick={() => { generarCodigo('LP69') }}>PLAN 69</p>
                                <p className="line-clamp-2 text-black text-center w-full border-2 py-1 rounded-xl"onClick={() => { generarCodigo('LP69AM') }}>PLAN 69 AM</p>
                                <p className="line-clamp-2 text-black text-center w-full border-2 py-1 rounded-xl" onClick={() => { generarCodigo('LP69AM2') }}>PLAN 69 AM2</p>

                                <p className="line-clamp-2 text-black text-center w-full border-2 py-1 rounded-xl" onClick={() => { generarCodigo('LPEXC') }}>PLAN EXCEPCIONAL</p>
                                <p className="line-clamp-2 text-black text-center w-full border-2 py-1 rounded-xl" onClick={() => { generarCodigo('LPEXCAM') }}>PLAN EXCEPCIONAL AM</p>
                                <p className="line-clamp-2 text-black text-center w-full border-2 py-1 rounded-xl" onClick={() => { generarCodigo('LPEXCAM2') }}>PLAN EXCEPCIONAL AM2</p>
                                {vermas &&
                                    <>
                                        <p className="line-clamp-2 text-black text-center w-full border-2 py-1 rounded-xl" onClick={() => { generarCodigo('LPB') }}>PLAN BASICO</p>
                                        <p className="line-clamp-2 text-black text-center w-full border-2 py-1 rounded-xl" onClick={() => { generarCodigo('LPBAM') }}>PLAN BASICO AM</p>
                                        <p className="line-clamp-2 text-black text-center w-full border-2 py-1 rounded-xl" onClick={() => { generarCodigo('LPBAM2') }}>PLAN BASICO AM2</p>
                                        <p className="line-clamp-2 text-black text-center w-full border-2 py-1 rounded-xl" onClick={() => { generarCodigo('LPFLYER') }}>PLAN FLYERS</p>
                                        <p className="line-clamp-2 text-black text-center w-full border-2 py-1 rounded-xl" onClick={() => { generarCodigo('LPPG') }}>PLAN PIEZAS GRAFICAS</p>
                                        <p className="line-clamp-2 text-black text-center w-full border-2 py-1 rounded-xl" onClick={() => { generarCodigo('LPBRO') }}>PLAN BROCHURE</p>
                                        <p className="line-clamp-2 text-black text-center w-full border-2 py-1 rounded-xl" onClick={() => { generarCodigo('LPREDES') }}>PLAN REDES SOCIALES</p>
                                        <p className="line-clamp-2 text-black text-center w-full border-2 py-1 rounded-xl" onClick={() => { generarCodigo('LPREEL') }}>PLAN REEL</p>
                                        <p className="line-clamp-2 text-black text-center w-full border-2 py-1 rounded-xl" onClick={() => { generarCodigo('LPMAPS') }}>PLAN GOOGLE MAPS</p>
                                        <p className="line-clamp-2 text-black text-center w-full border-2 py-1 rounded-xl" onClick={() => { generarCodigo('LPTV') }}>PLAN TIENDA VIRTUAL</p>
                                        <p className="line-clamp-2 text-black text-center w-full border-2 py-1 rounded-xl" onClick={() => { generarCodigo('LPW') }}>PLAN DESARROLLO WEB</p>
                                        <p className="line-clamp-2 text-black text-center w-full border-2 py-1 rounded-xl" onClick={() => { generarCodigo('LPADS') }}>PLAN CAPACITACION GOOGLE ADS</p>
                                        <p className="line-clamp-2 text-black text-center w-full border-2 py-1 rounded-xl" onClick={() => { generarCodigo('LPSEO') }}>PLAN SEO</p>
                                        <p className="line-clamp-2 text-black text-center w-full border-2 py-1 rounded-xl" onClick={() => { generarCodigo('LPLANDING') }}>PLAN LANDING </p>
                                        <p className="line-clamp-2 text-black text-center w-full border-2 py-1 rounded-xl" onClick={() => { generarCodigo('LPANI') }}>PLAN ANIMACION LOGO </p>
                                        <p className="line-clamp-2 text-black text-center w-full border-2 py-1 rounded-xl" onClick={() => { generarCodigo('LPHOST') }}>PLAN HOSTING </p>
                                    </>
                                }
                                {!vermas
                                  ? <span className='w-full text-center cursor-pointer' onClick={() => { setVerMas(true) }}>Ver mas</span>
                                  : <span className='w-full text-center cursor-pointer' onClick={() => { setVerMas(false) }}>Ver menos</span>
                                }
                            </div>
                            {/* <Errors errors={errors.plan} touched={touched.plan} /> */}
                        </div>

                    }
                  <div className="flex w-full justify-end gap-3 rounded-md text-black ">
                    <Link
                      to="#"
                      className="bg-red-600 px-3 py-2 rounded-md text-white cursor-pointer"
                      onClick={() => {
                        handleClose()
                        limpiar()
                        setAbrirPlan(false)
                        setVerMas(false)
                      }}
                    >
                      Cancelar
                    </Link>
                  </div>
                </form>
                  )}
            </DialogContentText>
              )}
        </DialogContent>
      </Dialog>
  )
}
