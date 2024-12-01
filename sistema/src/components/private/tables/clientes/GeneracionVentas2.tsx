import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState
} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { TitleBriefs } from '../../../shared/TitleBriefs'
import { Errors } from '../../../shared/Errors'
import Slide from '@mui/material/Slide'
import { type TransitionProps } from '@mui/material/transitions'
import { LoadingSmall } from '../../../shared/LoadingSmall'
import { InputsBriefs } from '../../../shared/InputsBriefs'
import { useFormik } from 'formik'
import { SchemaValidarVentas } from '../../../shared/schemas/Schemas'
import { Global } from '../../../../helper/Global'
import axios from 'axios'
import Swal from 'sweetalert2'
import {
  type ListcontactoClientes,
  type arrayAsignacion,
  type ValuesPlanes,
  type arrayContacto
} from '../../../shared/schemas/Interfaces'
import { ListaUsuarios } from './ListaUsuarios'

const Transition = React.forwardRef(function Transition (
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

interface valuesVentasTO {
  id: number
  medio_ingreso: string
  nombre_empresa: string
  plan: string
  id_contrato: string
  dni_ruc: string
  id_cliente: string
  nombre_cliente: string
  arraycontacto: string
}

interface valuesInterface {
  open: boolean
  datos: valuesVentasTO
  planes: ValuesPlanes[]
  setOpen: Dispatch<SetStateAction<boolean>>
}

export const GeneracionVentas2 = ({
  open,
  datos,
  planes,
  setOpen
}: valuesInterface): JSX.Element => {
  const handleClose = (): void => {
    setOpen(false)
  }
  const token = localStorage.getItem('token')
  const [loadingValidacion, seLoadingValidation] = useState(false)
  const [abrirPlan, setAbrirPlan] = useState(false)
  const [arrayContacto, setarrayConacto] = useState<arrayContacto[]>([])
  const [personContact, setpersonContact] = useState<string | null>(null)
  const [duplicateCode, setDuplicateCode] = useState<boolean>(false)
  const [usuarios, setUsuarios] = useState<never[]>([])
  const [arrayPesos, setarrayPesos] = useState<arrayAsignacion[]>([
    { id: null, peso: '' }
  ])
  const navigate = useNavigate()
  const limpiar = (): void => {
    resetForm()
  }

  const getUsuarios = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getUsuarios`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setUsuarios(request.data)
  }

  const generarVenta = async (): Promise<void> => {
    setDuplicateCode(false)
    try {
      const data = new FormData()
      data.append('id_cliente', values.id_cliente)
      data.append('medio_ingreso', values.medio_ingreso)
      data.append('dni_ruc', values.dni_ruc)
      data.append('nombre_empresa', values.nombre_empresa)
      data.append('id_contrato', values.id_contrato)
      data.append('id_contacto', personContact ?? '')
      data.append('asignacion', JSON.stringify(arrayPesos))
      const request = await axios.post(`${Global.url}/generarVenta2`, data, {
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
  }

  const {
    handleSubmit,
    handleChange,
    setValues,
    resetForm,
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
      id_cliente: '',
      nombre_cliente: ''
    },
    validationSchema: SchemaValidarVentas,
    onSubmit: generarVenta
  })

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
      id: datos.id,
      medio_ingreso: datos.medio_ingreso,
      nombre_empresa: datos.nombre_empresa,
      plan: datos.plan,
      id_contrato: datos.id_contrato,
      dni_ruc: datos.dni_ruc,
      nombre_cliente: datos.nombre_cliente,
      id_cliente: datos.id_cliente
    })
    setarrayConacto(datos.arraycontacto ? JSON.parse(datos.arraycontacto) : [])
    getUsuarios()
  }, [open])

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        className="w-screen p-0 m-0"
      >
        <DialogTitle className="text-center">{'Generar venta'}</DialogTitle>
        <DialogContent className="w-full md:w-96 max-h-[500px] p-0">
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
                    <ListaUsuarios
                      arrayPesos={arrayPesos}
                      usuarios={usuarios}
                      setarrayPesos={setarrayPesos}
                    />
                  </div>
                  <div className="flex w-full justify-end gap-3 rounded-md text-black ">
                    <Link
                      to="#"
                      className="bg-red-600 px-3 py-2 rounded-md text-white cursor-pointer"
                      onClick={() => {
                        handleClose()
                        limpiar()
                        setAbrirPlan(false)
                        setarrayPesos([])
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
            <DialogContentText
              id="alert-dialog-slide-description"
              className="w-full p-0 m-0"
            >
              {loadingValidacion
                ? <LoadingSmall />
                : (
                <form
                  className="flex flex-col gap-5 w-full"
                  onSubmit={handleSubmit}
                >
                  {!abrirPlan
                    ? <>
                      {/* <div className="w-full  lg:relative mt-5">
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
                        </div> */}
                      <div className="w-full  lg:relative pt-5">
                        <TitleBriefs titulo=" Nombres/Empresa" />
                        <select
                          className="border placeholder-gray-400 max-w-full focus:outline-none overflow-hidden
                                        focus:border-black w-full pr-4 h-12 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                        border-gray-300 rounded-md transition-all outline-none"
                          name="nombre_empresa"
                          value={values.nombre_empresa}
                          onChange={(e) => {
                            if (arrayContacto && arrayContacto.length > 0
                            ) {
                              const selectedContact = arrayContacto.find(
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-expect-error
                                (contacto: ListcontactoClientes) =>
                                  contacto.nombres === e.target.value
                              )
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-expect-error
                              setpersonContact(selectedContact ? selectedContact.id : null)
                            }
                            handleChange(e)
                          }}
                          onBlur={handleBlur}
                          disabled={false}
                        >
                          {datos.nombre_empresa && (
                            <option value={datos.nombre_empresa}>
                              {datos.nombre_empresa}
                            </option>
                          )}
                          {datos.nombre_cliente && (
                            <option value={datos.nombre_cliente}>
                              {datos.nombre_cliente}
                            </option>
                          )}
                          {arrayContacto &&
                            arrayContacto.length > 0 &&
                            arrayContacto.map(
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-expect-error
                              (contacto: ListcontactoClientes) => (
                                <option
                                  value={contacto.nombres}
                                  key={contacto.id}
                                >
                                  {contacto.nombres} - {contacto.marca}
                                </option>
                              )
                            )}
                        </select>
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
                          {/* <option value="2">Ventas</option> */}
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
                        <TitleBriefs titulo="Plan" />
                        <button
                          className="border placeholder-gray-400 focus:outline-none
                                                                        focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                                        border-gray-300 rounded-md transition-all"
                          onClick={() => {
                            setAbrirPlan(true)
                          }}
                        >
                          {values.plan ? values.plan : 'Seleccionar'}
                        </button>
                        {/* <Errors errors={errors.plan} touched={touched.plan} /> */}
                      </div>
                    </>
                    : (
                    <div className="w-full lg:relative mt-2 ">
                      <TitleBriefs titulo="Seleecionar plan" />
                      <div className="grid grid-cols-1 md:grid-cols-1 gap-2 items-center mb-0 p-4 cursor-pointer">
                        {planes.map((plan) => (
                          <p
                            key={plan.id}
                            className="line-clamp-2 text-black text-center w-full border-2 py-1 rounded-xl"
                            onClick={() => {
                              generarCodigo(plan.codigo)
                            }}
                          >
                            {plan.nombre}
                          </p>
                        ))}
                      </div>
                    </div>
                      )}
                  <div className="flex w-full justify-end gap-3 rounded-md text-black ">
                    <Link
                      to="#"
                      className="bg-red-600 px-3 py-2 rounded-md text-white cursor-pointer"
                      onClick={() => {
                        handleClose()
                        limpiar()
                        setAbrirPlan(false)
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
      <div>
      </div>
    </>
  )
}
