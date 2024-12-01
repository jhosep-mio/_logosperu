import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import { SchemeVentas } from '../../../../shared/schemas/Schemas'
import { Loading } from '../../../../shared/Loading'
import { TitleBriefs } from '../../../../shared/TitleBriefs'
import { InputsBriefs } from '../../../../shared/InputsBriefs'
import { Errors } from '../../../../shared/Errors'
import { type arrayContacto } from '../../../../shared/schemas/Interfaces'

export const VerCliente = ({ id, idcontacto }: { id: number, idcontacto: number }): JSX.Element => {
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(true)

  const [opcionalempresa] = useState(false)

  const savePreventa = async (): Promise<void> => {}

  const {
    handleChange,
    errors,
    values,
    touched,
    handleBlur,
    isSubmitting,
    setValues
  } = useFormik({
    initialValues: {
      id: 0,
      nombres: '',
      dni_ruc: '',
      id_contrato: '',
      apellidos: '',
      email: '',
      celular: '',
      edad: '',
      sexo: '',
      medio_ingreso: '',
      created_at: '',
      estado: '',
      antiguo: '',
      empresa: '',
      contacto: ''
    },
    validationSchema: SchemeVentas,
    onSubmit: savePreventa
  })

  const getOneBrief = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/getOnePreventa/${id ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      }
    )
    let nombrecontacto = null
    if (idcontacto) {
      JSON.parse(request.data.arraycontacto).filter((contacto: arrayContacto) => contacto.id == idcontacto).map((contacto: arrayContacto) => {
        return (
          nombrecontacto = contacto.nombres
        )
      })
    }
    setValues({
      ...values,
      nombres: request.data.nombres,
      apellidos: request.data.apellidos,
      contacto: nombrecontacto ?? '',
      email: request.data.email,
      celular: request.data.celular,
      edad: request.data.edad,
      sexo: request.data.sexo,
      medio_ingreso: request.data.medio_ingreso,
      dni_ruc: request.data.dni_ruc,
      antiguo: request.data.antiguo,
      empresa: request.data.empresa
    })
    setLoading(false)
  }

  useEffect(() => {
    Promise.all([getOneBrief()]).then(() => {
      setLoading(false)
    })
  }, [id])

  useEffect(() => {
    if (errors && isSubmitting) {
      const firstErrorKey = Object.keys(errors)[0]
      const firstErrorElement = document.getElementsByName(firstErrorKey)[0]
      if (firstErrorElement) {
        firstErrorElement.focus()
      }
    }
  }, [touched, errors, isSubmitting])

  return (
    <>
      <div className="">
        {loading
          ? <div className="w-[400px] h-[300px]">
            <Loading />
          </div>
          : (
          <div className="card">
            <form className="flex flex-col bg-white rounded-md relative min-w-[400px]">
              <div className="flex w-full mt-5 md:mt-5 flex-col">
                <div className="w-full flex flex-col text-white">
                  <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-end gap-2 lg:gap-5">
                    <div className="w-full flex flex-col gap-3 md:flex-row">
                      <div className="w-full md:w-full lg:relative">
                        <TitleBriefs titulo=" Nombres" />
                        <InputsBriefs
                          name="nombres"
                          type="text"
                          value={values.nombres}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={true}
                        />
                        <Errors
                          errors={errors.nombres}
                          touched={touched.nombres}
                        />
                      </div>
                      <div className="w-full md:w-full lg:relative">
                        <TitleBriefs titulo=" Apellidos" />
                        <InputsBriefs
                          name="apellidos"
                          type="text"
                          value={values.apellidos}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={true}
                        />
                        <Errors
                          errors={errors.apellidos}
                          touched={touched.apellidos}
                        />
                      </div>
                    </div>
                    <div className="w-full flex flex-col gap-3">
                      <div className="w-full md:w-full lg:relative">
                        <TitleBriefs titulo=" Persona a cargar del proyecto" />
                        <input
                          className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4  mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all text-black"
                          type="text"
                          value={values.contacto}
                          disabled={true}
                        />
                      </div>
                    </div>
                    <div className="w-full flex flex-col gap-3 md:flex-row">
                      <div className="w-full md:w-full relative h-fit">
                        <TitleBriefs titulo="Empresa" />
                        <input
                          //    className="border placeholder-gray-400 focus:outline-none
                          //    focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                          //    border-gray-300 rounded-md transition-all"
                          className={`border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block ${
                                                        opcionalempresa
                                                          ? 'bg-red-400'
                                                          : 'bg-white'
                                                      }
                                                      border-gray-300 rounded-md transition-all `}
                          name="empresa"
                          type="text"
                          value={values.empresa}
                          disabled={true}
                          onChange={(e) => {
                            handleChange(e)
                          }}
                          onBlur={(e) => {
                            handleBlur(e)
                          }}
                        />
                        <Errors
                          errors={errors.empresa}
                          touched={touched.empresa}
                        />
                      </div>
                      <div className="w-full md:w-full relative h-fit">
                        <TitleBriefs titulo=" DNI/RUC" />
                        <input
                          className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                          name="dni_ruc"
                          type="text"
                          value={values.dni_ruc}
                          disabled={true}
                          onChange={(e) => {
                            handleChange(e)
                          }}
                          onBlur={(e) => {
                            handleBlur(e)
                          }}
                        />
                        <Errors
                          errors={errors.dni_ruc}
                          touched={touched.dni_ruc}
                        />
                      </div>
                    </div>
                    <div className="w-full flex flex-col md:flex-row gap-3 lg:gap-5 mt-3 lg:mt-0">
                      <div className="w-full  lg:relative">
                        <TitleBriefs titulo="Celular" />
                        <InputsBriefs
                          name="celular"
                          type="number"
                          value={values.celular}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={true}
                        />
                        <Errors
                          errors={errors.celular}
                          touched={touched.celular}
                        />
                      </div>
                      <div className="w-full  lg:relative ">
                        <TitleBriefs titulo="Correo electronico" />
                        <InputsBriefs
                          name="email"
                          type="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={true}
                        />
                        <Errors errors={errors.email} touched={touched.email} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </form>
          </div>
            )}
      </div>
    </>
  )
}
