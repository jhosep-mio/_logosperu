/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
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
  type validateClientes,
  type ValuesPreventa
} from '../../../shared/schemas/Interfaces'
import { SchemePreventas } from '../../../shared/schemas/Schemas'
import { logo } from '../../../shared/Images'
import { GenerarVenta } from '../../../shared/modals/GenerarVenta'

export const RegistrarCliente = (): JSX.Element => {
  const [open, setOpen] = useState(false)
  const { setTitle } = useAuth()
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [suggestions, setSuggestions] = useState<validateClientes[]>([])
  const [clientes, setClientes] = useState<validateClientes[]>([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [showSuggestions2, setShowSuggestions2] = useState(false)

  const [idCliente, setIdCliente] = useState('')
  const [medio, setMedioIngreso] = useState('')
  const [nombres, setNombres] = useState('')

  const handleClickOpen = (): void => {
    setOpen(true)
  }

  const getDatas = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getClientes`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setClientes(request.data)
  }

  const savePreventa = async (values: ValuesPreventa): Promise<void> => {
    setLoading(true)
    const token = localStorage.getItem('token')

    const data = new FormData()
    data.append('nombres', values.nombres)
    data.append('empresa', values.empresa)
    data.append('apellidos', values.apellidos)
    data.append('celular', values.celular)
    data.append('dni_ruc', values.dni_ruc)
    data.append('sexo', values.sexo)
    // @ts-expect-error
    data.append('email', values.email)
    data.append('medio_ingreso', values.medio_ingreso)

    try {
      const respuesta = await axios.post(`${Global.url}/savePreventa`, data, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })

      if (respuesta.data.status == 'success') {
        Swal.fire('Agreado correctamente', '', 'success')
        navigate('/admin/lista-clientes')
      } else {
        Swal.fire('Error al agregar el registro', '', 'error')
        setLoading(true)
      }
    } catch (error) {
      Swal.fire('Error al agregar el registro', '', 'error')
      setLoading(true)
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
    isSubmitting
  } = useFormik({
    initialValues: {
      nombres: '',
      apellidos: '',
      celular: '',
      dni_ruc: '',
      sexo: '',
      medio_ingreso: '',
      empresa: '',
      email: ''
    },
    validationSchema: SchemePreventas,
    onSubmit: savePreventa
  })

  const normalizeString = (str: string): string => {
    return str
      .toLowerCase() // Convertir todo a minúsculas
      .normalize('NFD') // Eliminar tildes y diacríticos
      .replace(/[\u0300-\u036f]/g, '')
  }

  useEffect(() => {
    setTitle('REGISTRAR CLIENTE')
    getDatas()
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

  const fetchSuggestions = (text: string): void => {
    if (text.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }

    const normalizedText = normalizeString(text)
    const words = normalizedText.split(' ')

    const filteredSuggestions = clientes.filter((cliente) => {
      const nombres = normalizeString(cliente.nombres)
      const apellidos = normalizeString(cliente.apellidos)

      return words.every(
        (word) => nombres.includes(word) || apellidos.includes(word)
      )
    })

    const formattedSuggestions: validateClientes[] = filteredSuggestions

    setSuggestions(formattedSuggestions)
    setShowSuggestions(true)
  }

  const fetchSuggestions2 = (text: string): void => {
    if (text.length < 2) {
      setSuggestions([])
      setShowSuggestions2(false)
      return
    }

    const normalizedText = normalizeString(text)
    const words = normalizedText.split(' ')

    const filteredSuggestions = clientes.filter((cliente) => {
      const nombres = normalizeString(cliente.nombres)
      const apellidos = normalizeString(cliente.apellidos)

      return words.every(
        (word) => nombres.includes(word) || apellidos.includes(word)
      )
    })

    const formattedSuggestions: validateClientes[] = filteredSuggestions

    setSuggestions(formattedSuggestions)
    setShowSuggestions2(true)
  }

  const handleClientSelection = (cliente: validateClientes): void => {
    setIdCliente(cliente.id)
    setMedioIngreso(cliente.medio_ingreso)
    setNombres(`${cliente.nombres} ${cliente.apellidos}`)
    handleClickOpen()
  }

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
                            fetchSuggestions(e.target.value)
                          }}
                          onFocus={() => {
                            setShowSuggestions(true)
                          }}
                          onBlur={(e) => {
                            handleBlur(e)
                            setTimeout(() => {
                              setShowSuggestions(false)
                            }, 400)
                          }}
                          disabled={false}
                        />
                        <Errors
                          errors={errors.nombres}
                          touched={touched.nombres}
                        />
                        {showSuggestions && suggestions.length > 0 && (
                          <div className="suggestions absolute top-full right-0 left-0 z-20 bg-white rounded-b-lg shadow-sm shadow-black ">
                            {suggestions.map((suggestion) => (
                              <div
                                key={suggestion.id}
                                onClick={() => {
                                  handleClientSelection(suggestion)
                                }}
                                className="cursor-pointer hover:bg-[#f1f1f1] w-full px-4 py-2"
                              >
                                {suggestion.nombres} {suggestion.apellidos}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="w-full md:w-full relative h-fit">
                        <TitleBriefs titulo=" Apellidos" />
                        {/* <InputsBriefs
                          name="apellidos"
                          type="text"
                          value={values.apellidos}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={false}
                        /> */}
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
                            fetchSuggestions2(e.target.value)
                          }}
                          onFocus={() => {
                            setShowSuggestions2(true)
                          }}
                          onBlur={(e) => {
                            handleBlur(e)
                            setTimeout(() => {
                              setShowSuggestions2(false)
                            }, 400)
                          }}
                        />
                        <Errors
                          errors={errors.apellidos}
                          touched={touched.apellidos}
                        />
                        {showSuggestions2 && suggestions.length > 0 && (
                          <div className="suggestions absolute top-full right-0 left-0 z-20 bg-white rounded-b-lg shadow-sm shadow-black ">
                            {suggestions.map((suggestion) => (
                              <div
                                key={suggestion.id}
                                onClick={() => {
                                  handleClientSelection(suggestion)
                                }}
                                className="cursor-pointer hover:bg-[#f1f1f1] w-full px-4 py-2"
                              >
                                {suggestion.nombres} {suggestion.apellidos}
                              </div>
                            ))}
                          </div>
                        )}
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
                      <div className="w-full md:w-full relative h-fit">
                        <TitleBriefs titulo=" DNI/RUC" />
                        <input
                          className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                          name="dni_ruc"
                          type="text"
                          value={values.dni_ruc}
                          disabled={false}
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
                      <div className="w-full md:w-full relative h-fit">
                        <TitleBriefs titulo="Email" />
                        <input
                          className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                          name="email"
                          type="email"
                          value={values.email}
                          disabled={false}
                          onChange={(e) => {
                            handleChange(e)
                          }}
                          onBlur={(e) => {
                            handleBlur(e)
                          }}
                        />
                        <Errors
                          errors={errors.email}
                          touched={touched.email}
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
                          disabled={false}
                        />
                        <Errors
                          errors={errors.celular}
                          touched={touched.celular}
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
                  to="/admin/lista-clientes"
                  className="bg-red-600 px-3 py-2 rounded-md text-white cursor-pointer"
                >
                  Cancelar
                </Link>
                <input
                  type="submit"
                  className="bg-secondary-150 px-3 py-2 text-white rounded-md cursor-pointer"
                  value="Registrar"
                />
              </div>
            </form>
          </div>
            )}
      </div>
      <GenerarVenta
        open={open}
        setOpen={setOpen}
        id={idCliente}
        medio={medio}
        nombres={nombres}
      />
    </>
  )
}
