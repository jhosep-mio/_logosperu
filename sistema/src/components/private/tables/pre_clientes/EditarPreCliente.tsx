import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import { Loading } from '../../../shared/Loading'
import { TitleBriefs } from '../../../shared/TitleBriefs'
import { InputsBriefs } from '../../../shared/InputsBriefs'
import { useFormik } from 'formik'
import Swal from 'sweetalert2'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { Errors } from '../../../shared/Errors'
import {
  type preclientesValues
} from '../../../shared/schemas/Interfaces'
import { logo } from '../../../shared/Images'
import { SchemePreClientes } from '../../../shared/schemas/Schemas'

export const EditarPreCliente = (): JSX.Element => {
  const { setTitle } = useAuth()
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const savePreventa = async (values: preclientesValues): Promise<void> => {
    setLoading(true)
    const token = localStorage.getItem('token')
    const data = new FormData()
    data.append('nombres', values.nombres)
    data.append('empresa', values.empresa)
    data.append('apellidos', values.apellidos)
    data.append('celular', values.celular)
    data.append('sexo', values.sexo)
    data.append('medio_ingreso', values.medio_ingreso)
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/updatePreCliente/${id ?? ''}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )

      if (respuesta.data.status == 'success') {
        Swal.fire('Actualizado correctamente', '', 'success')
        navigate('/admin/lista-pre-clientes')
      } else {
        Swal.fire('Error al editar', '', 'error')
      }
    } catch (error) {
      console.log(error)
      Swal.fire('Error', '', 'error')
    }
    setLoading(false)
  }

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    touched,
    handleBlur,
    isSubmitting,
    setValues
  } = useFormik({
    initialValues: {
      nombres: '',
      apellidos: '',
      celular: '',
      sexo: '',
      medio_ingreso: '',
      empresa: ''
    },
    validationSchema: SchemePreClientes,
    onSubmit: savePreventa
  })

  const getOneBrief = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/getOnePreCliente/${id ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      }
    )
    setValues({
      ...values,
      nombres: request.data.nombres,
      apellidos: request.data.apellidos,
      celular: request.data.celular,
      sexo: request.data.sexo,
      medio_ingreso: request.data.medio_ingreso,
      empresa: request.data.empresa
    })
    setLoading(false)
  }

  useEffect(() => {
    setTitle('EDITAR PRE-CLIENTE')
    Promise.all([getOneBrief()]).then(() => {
      setLoading(false)
    })
  }, [])

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
          ? <Loading />
          : (
          <div className="card">
            <form
              className="flex flex-col bg-white rounded-md mt-4 p-4 md:p-10 relative"
              onSubmit={handleSubmit}
            >
              <img
                src={logo}
                alt=""
                className="mx-auto w-[50%] px-4 md:px-0 md:w-48"
              />
              <div className="flex w-full mt-5 md:mt-5 flex-col">
                <div className="w-full flex flex-col text-white">
                  <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-end gap-2 lg:gap-5">
                    <div className="w-full flex flex-col gap-3 md:flex-row">
                      <div className="w-full md:w-full relative h-fit">
                        <TitleBriefs titulo=" Nombres" />
                        <input
                          className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                          name="nombres"
                          type="text"
                          autoComplete="off"
                          value={values.nombres}
                          onChange={(e) => {
                            handleChange(e)
                          }}
                          onBlur={(e) => {
                            handleBlur(e)
                          }}
                          disabled={false}
                        />
                        <Errors
                          errors={errors.nombres}
                          touched={touched.nombres}
                        />
                      </div>
                      <div className="w-full md:w-full relative h-fit">
                        <TitleBriefs titulo=" Apellidos" />
                        <input
                          className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                          name="apellidos"
                          type="text"
                          value={values.apellidos}
                          disabled={false}
                          onChange={(e) => {
                            handleChange(e)
                          }}
                          onBlur={(e) => {
                            handleBlur(e)
                          }}
                        />
                        <Errors
                          errors={errors.apellidos}
                          touched={touched.apellidos}
                        />
                      </div>
                      <div className="w-full  lg:relative">
                        <TitleBriefs titulo="Celular" />
                        <InputsBriefs
                          name="celular"
                          type="number"
                          value={values.celular}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={false}
                        />
                        <Errors
                          errors={errors.celular}
                          touched={touched.celular}
                        />
                      </div>
                    </div>
                    <div className="w-full flex flex-col gap-3 md:flex-row">
                      <div className="w-full md:w-full relative h-fit">
                        <TitleBriefs titulo="Empresa" />
                        <input
                          className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                          name="empresa"
                          type="text"
                          value={values.empresa}
                          disabled={false}
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
                      <div className="w-full lg:relative">
                        <TitleBriefs titulo="Genero" />
                        <select
                          className="border placeholder-gray-400 focus:outline-none
                                                        focus:border-black w-full pt-4 pr-4 pb-6 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                        border-gray-300 rounded-md transition-all"
                          name="sexo"
                          value={values.sexo}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          {/* FB GOOGLE, VENTAS, POST VENTA, RECOMENDACION, ISNTAGRAM) */}
                          <option value="">Seleccionar</option>
                          <option value="hombre">Hombre</option>
                          <option value="mujer">Mujer</option>
                        </select>
                        <Errors errors={errors.sexo} touched={touched.sexo} />
                      </div>
                      <div className="w-full lg:relative">
                        <TitleBriefs titulo="Medio de ingreso" />
                        <select
                          className="border placeholder-gray-400 focus:outline-none
                                                        focus:border-black w-full pt-4 pr-4 pb-6 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
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
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-full justify-end gap-3 rounded-md text-black mt-5">
                <Link
                  to="/admin/lista-pre-clientes"
                  className="bg-red-600 px-3 py-2 rounded-md text-white cursor-pointer"
                >
                  Cancelar
                </Link>
                <input
                  type="submit"
                  className="bg-secondary-150 px-3 py-2 text-white rounded-md cursor-pointer"
                  value="Editar"
                />
              </div>
            </form>
          </div>
            )}
      </div>
    </>
  )
}
