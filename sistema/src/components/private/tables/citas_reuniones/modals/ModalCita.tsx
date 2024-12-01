/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Dialog } from '@mui/material'
import Slide from '@mui/material/Slide'
import { type TransitionProps } from '@mui/material/transitions'
import { useFormik } from 'formik'
import React, { useState, useEffect } from 'react'
import { SchemaValidateCita } from '../../../../shared/schemas/Schemas'
import { toast } from 'sonner'
import {
  asistentes,
  aviso,
  cancelarinvitacion,
  categorizar,
  eliminar,
  enviar,
  guardar,
  imalta,
  imbaja,
  ocupado,
  privado
} from '../../../../shared/Images'
import { Loading } from '../../../../shared/Loading'
import { cn } from '../../../../shared/cn'
import useAuth from '../../../../../hooks/useAuth'
import { Swiper, SwiperSlide } from 'swiper/react'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import { FaChevronDown } from 'react-icons/fa6'
const Transition = React.forwardRef(function Transition (
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})
export const ModalCita = ({
  open,
  setOpen,
  tipoInitial,
  usuarios,
  getUsuarios
}: any): JSX.Element => {
  const [loading, setLoading] = useState(false)
  const { auth } = useAuth()
  const [showTimeInput, setShowTimeInput] = useState(false)
  const [openCategorizar, setOpenCategorizar] = useState(false)
  const [toEmail, setToEmail] = useState('')
  const [suggestions, setSuggestions] = useState([])

  const handleSelectChange = (event: any): void => {
    if (event.target.value === 'manual') {
      setShowTimeInput(true)
    } else {
      setShowTimeInput(false)
      const selectedValue = event.target.value
      const currentDate = new Date() // Obtener la fecha y hora actuales en UTC
      const utcOffset = -5 * 60 // Convertir horas a minutos (5 horas * 60 minutos/hora)
      const peruDateTime = new Date(currentDate.getTime() + utcOffset * 60000) // Aplicar el ajuste de zona horaria
      let newDateTime: any = null
      switch (selectedValue) {
        case '5 minutos':
          newDateTime = new Date(peruDateTime.getTime() + 5 * 60000) // Sumar 5 minutos (5 * 60000 milisegundos)
          break
        case '10 minutos':
          newDateTime = new Date(peruDateTime.getTime() + 10 * 60000) // Sumar 10 minutos
          break
        case '15 minutos':
          newDateTime = new Date(peruDateTime.getTime() + 15 * 60000) // Sumar 15 minutos
          break
        case '30 minutos':
          newDateTime = new Date(peruDateTime.getTime() + 30 * 60000) // Sumar 30 minutos
          break
        case '1 hora':
          newDateTime = new Date(peruDateTime.getTime() + 60 * 60000) // Sumar 1 hora
          break
        default:
          newDateTime = null // Por defecto, usar la fecha y hora actuales
          break
      }
      if (newDateTime) {
        setValues(() => ({
          ...values,
          dateaviso: newDateTime.toISOString().split('T')[0],
          timeaviso: newDateTime.toISOString().split('T')[1].slice(0, 5)
        }))
      } else {
        setValues(() => ({
          ...values,
          timeaviso: ''
        }))
      }
    }
  }

  const saveCita = async (): Promise<void> => {
    if (values.tipo == 'reunion' && values.miembros.length == 0) {
      toast.warning(
        'No se puede enviar porque la reunion no tiene destinatarios'
      )
      return
    }
    setLoading(true)
    const token = localStorage.getItem('token')
    const data = new FormData()
    const aviso = {
      dateaviso: values.dateaviso,
      timeaviso: values.timeaviso
    }
    const horaInicio = {
      dateinicio: values.dateinicio,
      timeinicio: values.timeinicio
    }
    const horaFinal = {
      datefinal: values.datefinal,
      timefinal: values.timefinal
    }
    data.append('user_id', auth.id)
    data.append('tipo', values.tipo)
    data.append(
      'miembros',
      values.miembros && values.tipo == 'reunion' && values.miembros.length > 0
        ? JSON.stringify(values.miembros)
        : ''
    )
    data.append('estado', values.estado)
    data.append('aviso', JSON.stringify(aviso))
    data.append('asunto', values.asunto)
    data.append('hora_inicio', JSON.stringify(horaInicio))
    data.append('hora_final', JSON.stringify(horaFinal))
    data.append('cuerpo', values.cuerpo)
    data.append('etiqueta', values.etiqueta)
    data.append('categorias', values.categorias && values.categorias.length > 0 ? JSON.stringify(values.categorias) : '')
    try {
      const respuesta = await axios.post(
        `${Global.url}/registerCalendarCita`,
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
        toast.success(`${values.tipo} guardada correctamente`)
        getUsuarios()
      }
    } catch (error) {
      toast.error(`Error al guardar ${values.tipo}`)
      console.log(error)
    } finally {
      limpiarTodo()
      setLoading(false)
    }
  }

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    touched,
    handleBlur,
    isSubmitting,
    setValues,
    resetForm
  } = useFormik({
    initialValues: {
      estado: 'Ocupado',
      tipo: '',
      miembros: [],
      dateinicio: new Date().toISOString().split('T')[0],
      timeinicio: '',
      datefinal: new Date().toISOString().split('T')[0],
      timefinal: '',
      dateaviso: new Date().toISOString().split('T')[0],
      timeaviso: '',
      asunto: '',
      cuerpo: '',
      etiqueta: '',
      categorias: []
    },
    validationSchema: SchemaValidateCita,
    onSubmit: saveCita
  })

  useEffect(() => {
    if (errors && isSubmitting) {
      const firstErrorKey = Object.keys(errors)[0]
      const firstErrorElement = document.getElementsByName(firstErrorKey)[0]
      if (firstErrorElement) {
        firstErrorElement.focus()
      }
    }
  }, [touched, errors, isSubmitting])

  useEffect(() => {
    if (open) {
      setValues({
        ...values,
        tipo: tipoInitial
      })
    }
  }, [open])

  useEffect(() => {
    if (toEmail.length > 0) {
      const filteredSuggestions = usuarios.filter((user: any) => {
        const isNotCurrentAuthUser = user.id != auth.id
        const isMatchingEmail = user.email
          .toLowerCase()
          .includes(toEmail.toLowerCase())
        const isMatchingName = user.name
          .toLowerCase()
          .includes(toEmail.toLowerCase())
        const isNotMember = !values.miembros.some(
          (member: any) => member.email === user.email
        )
        return (
          (isMatchingEmail || isMatchingName) &&
          isNotMember &&
          isNotCurrentAuthUser
        )
      })
      setSuggestions(filteredSuggestions)
    } else {
      setSuggestions([])
    }
  }, [toEmail, usuarios, values.miembros])

  const handleInputChange = (e: any): void => {
    setToEmail(e.target.value)
  }

  const handleSuggestionClick = (suggestion: any): void => {
    if (values.miembros.some((m: any) => m.email === suggestion.email)) {
      toast.warning('Correo duplicado')
    } else {
      setValues((prevValues: any) => ({
        ...prevValues,
        miembros: [
          ...prevValues.miembros,
          {
            id: suggestion.id,
            name: suggestion.name,
            email: suggestion.email,
            type: 'colaborador'
          }
        ]
      }))
      setToEmail('')
      setSuggestions([])
    }
  }

  const isValidEmail = (email: any): any => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const addEmail = (): void => {
    if (toEmail) {
      if (!isValidEmail(toEmail)) {
        toast.error('Correo inválido')
        return
      }
      if (values.miembros.some((m: any) => m.email === toEmail)) {
        toast.warning('Correo duplicado')
      } else if (toEmail == auth.email_alter) {
        toast.warning('No puedes agregarte tu mismo')
      } else {
        setValues((prevValues: any) => ({
          ...prevValues,
          miembros: [
            ...prevValues.miembros,
            {
              id: null,
              name: toEmail,
              email: toEmail,
              type: 'externo'
            }
          ]
        }))
      }
      setToEmail('')
    }
  }

  const blurMail = (email: any): void => {
    setValues((prevValues) => ({
      ...prevValues,
      miembros: prevValues.miembros.filter((m: any) => m.email !== email)
    }))
  }

  const handleRemoveMember = (email: any): void => {
    setValues((prevValues) => ({
      ...prevValues,
      miembros: prevValues.miembros.filter((m: any) => m.email !== email)
    }))
  }

  const handleKeyDown = (e: any): void => {
    if (e.key === 'Enter') {
      e.preventDefault()
      addEmail()
    }
  }

  const limpiarTodo = (): void => {
    resetForm()
    setOpen(false)
  }
  // Función para actualizar dateaviso y timeaviso
  const updateAvisoDateTime = (time: any): void => {
    setValues(() => ({
      ...values,
      timeaviso: time
    }))
  }
  const handleAvisoTimeChange = (e: any): void => {
    const time = e.target.value
    updateAvisoDateTime(time)
  }

  useEffect(() => {
    if (errors && isSubmitting) {
      if (Object.keys(errors).length > 0 && isSubmitting) {
        Object.keys(errors)
          .reverse()
          .forEach((key) => {
            // @ts-expect-error
            toast.warning(`${errors[key]}`)
          })
      }
      const firstErrorKey = Object.keys(errors)[0]
      const firstErrorElement = document.getElementsByName(firstErrorKey)[0]
      if (firstErrorElement) {
        firstErrorElement.focus()
      }
    }
  }, [touched, errors, isSubmitting])

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => setOpen(false)}
      aria-describedby="alert-dialog-slide-description"
      className="moda_registro"
      maxWidth="lg"
    >
      {!loading ? (
        <section className="w-full pt-2 flex flex-col">
          <h1 className="w-full text-center text-gray-600 text-md pb-2">
            {values.asunto == '' ? 'Sin titulo' : values.asunto} -{' '}
            {values.tipo.toUpperCase()}
          </h1>
          <div className="flex items-center w-full bg-white border-y h-[90px] z-[2]">
            <div className="flex items-center border-r border-gray-200 ">
              {values.tipo == 'cita' && (
                <button
                  type="submit"
                  form="yourFormId" // Asigna el ID del formulario aquí
                  className="flex  text-black flex-col items-center gap-1 px-2 py-1 hover:bg-gray-200  transition-colors"
                >
                  <img
                    src={guardar}
                    alt=""
                    className="w-[35px] h-[37px] object-contain"
                  />
                  <div className="flex flex-col gap-0 text-sm">
                    <span className="text-md leading-5">Guardar</span>
                    <span className="text-md leading-5">y cerrar</span>
                  </div>
                </button>
              )}
              <button
                type="button"
                onClick={() => {
                  limpiarTodo()
                }}
                className="flex h-full text-black flex-col items-center gap-1 px-2 py-1 hover:bg-gray-200  transition-colors"
              >
                <img
                  src={eliminar}
                  alt=""
                  className="w-[35px] h-[37px] object-contain"
                />
                <div className="flex flex-col gap-0 text-sm">
                  <span className="text-md leading-5">Eliminar</span>
                  <span className="text-md leading-5 text-white">.</span>
                </div>
              </button>
            </div>
            <div className="flex items-center border-r border-gray-200 ">
              {values.tipo == 'cita' ? (
                <button
                  type="button"
                  onClick={async () =>
                    await setValues({
                      ...values,
                      tipo: 'reunion'
                    })
                  }
                  className="flex  text-black flex-col items-center gap-1 px-2 py-1 hover:bg-gray-200  transition-colors"
                >
                  <img
                    src={asistentes}
                    alt=""
                    className="w-[35px] h-[37px] object-contain"
                  />
                  <div className="flex flex-col gap-0 text-sm">
                    <span className="text-md leading-5">Invitar a los</span>
                    <span className="text-md leading-5">asistentes</span>
                  </div>
                </button>
              ) : (
                <button
                  type="button"
                  onClick={async () =>
                    await setValues({
                      ...values,
                      tipo: 'cita'
                    })
                  }
                  className="flex  text-black flex-col items-center gap-1 px-2 py-1 hover:bg-gray-200  transition-colors"
                >
                  <img
                    src={cancelarinvitacion}
                    alt=""
                    className="w-[35px] h-[37px] object-contain"
                  />
                  <div className="flex flex-col gap-0 text-sm">
                    <span className="text-md leading-5">Cancelar</span>
                    <span className="text-md leading-5">invitación</span>
                  </div>
                </button>
              )}
            </div>
            <div className="flex flex-col gap-4 text-sm h-full justify-center items-center border-r border-gray-200 ">
              <button
                type="button"
                className="flex  text-black items-center gap-1 px-2"
              >
                <div className="flex gap-1">
                  <img src={ocupado} alt="" className="object-contain" />
                  <p>Mostrar como:</p>
                </div>
                <div className="flex items-center border border-gray-400 px-1 rounded-sm  w-[160px]">
                  <span
                    className={cn(
                      'w-[15px] h-[15px]',
                      values.estado == 'Ocupado'
                        ? 'bg-red-300'
                        : values.estado == 'Home office'
                          ? 'bg-yellow-200'
                          : values.estado == 'Disponible'
                            ? 'bg-green-300'
                            : values.estado == 'Provisional'
                              ? 'bg-gray-300'
                              : values.estado == 'Fuera de la oficina'
                                ? 'bg-cyan-200'
                                : ''
                    )}
                  ></span>
                  <select
                    className="outline-none"
                    name="estado"
                    value={values.estado}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="Ocupado" className="bg-red-300">
                      {' '}
                      Ocupado
                    </option>
                    <option value="Home office" className="bg-yellow-200">
                      Home office
                    </option>
                    <option value="Disponible" className="bg-green-300">
                      Disponible
                    </option>
                    <option value="Provisional" className="bg-gray-300">
                      Provisional
                    </option>
                    <option value="Fuera de la oficina" className="bg-cyan-200">
                      Fuera de la oficina
                    </option>
                  </select>
                </div>
              </button>
              <button
                type="button"
                className="flex justify-between w-full text-black items-center gap-1 px-2"
              >
                <div className="flex gap-1">
                  <img src={aviso} alt="" className="object-contain" />
                  <p>Aviso:</p>
                </div>
                <select
                  name="time"
                  id="time"
                  onChange={handleSelectChange}
                  className="border border-gray-400 rounded px-1 w-[160px] outline-none"
                >
                  <option value="">ninguno</option>
                  <option value="10 minutos">10 minutos</option>
                  <option value="15 minutos">15 minutos</option>
                  <option value="30 minutos">30 minutos</option>
                  <option value="1 hora">1 hora</option>
                  <option value="manual">Manualmente</option>
                </select>
              </button>
            </div>
            {showTimeInput && (
              <div className="flex flex-col px-4 gap-2s text-sm h-full justify-start pt-1 items-start border-r border-gray-200 ">
                <h2 className="w-full text-gray-600 text-center">
                  Fecha y hora
                </h2>
                <div className="flex flex-col gap-[2px]">
                  <input
                    type="date"
                    name="dateaviso"
                    value={values.dateaviso}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="border border-gray-400 rounded px-1"
                  />
                  <input
                    type="time"
                    value={values.timeaviso}
                    onChange={handleAvisoTimeChange}
                    className="border border-gray-400 rounded px-1"
                  />
                </div>
              </div>
            )}
            <div className="flex flex-col gap-4 text-sm h-full justify-center relative items-center border-r border-gray-200 ">
              <button
                type="button"
                className="flex flex-col text-black items-center gap-1 px-2 "
                onClick={() => {
                  setOpenCategorizar(!openCategorizar)
                }}
              >
                <img src={categorizar} alt="" className="object-contain" />
                <p className="w-full text-center pt-0">Categorizar</p>
                <FaChevronDown className="text-gray-500 text-xs" />
              </button>
              {openCategorizar && (
                <section className="absolute left-0 top-full w-[200px] bg-white px-4 shadow_class_cita">
                  <div className="flex flex-col gap-2">
                    <div className="flex py-1 flex-wrap gap-1">
                      <div
                        className="flex gap-3 py-0 items-center"
                        onClick={() => {
                          const nuevaCategorias = values.categorias.includes(
                            // @ts-expect-error
                            'Categoria amarilla'
                          )
                            ? values.categorias.filter(
                              (cat) => cat !== 'Categoria amarilla'
                            )
                            : [...values.categorias, 'Categoria amarilla']
                          handleChange({
                            target: {
                              name: 'categorias',
                              value: nuevaCategorias
                            }
                          })
                        }}
                      >
                        <span
                          className={cn(
                            'w-[16px] h-[16px] block bg-yellow-300',
                            // @ts-expect-error
                            values.categorias.includes('Categoria amarilla')
                              ? 'border-2 border-blue-500'
                              : ''
                          )}
                        ></span>
                        <span>Categoria amarilla</span>
                      </div>
                      <div
                        className={`flex gap-3 py-0 items-center ${
                          // @ts-expect-error
                          values.categorias.includes('Categoria azul')
                            ? 'seleccionado'
                            : ''
                        }`}
                        onClick={() => {
                          const nuevaCategorias = values.categorias.includes(
                            // @ts-expect-error
                            'Categoria azul'
                          )
                            ? values.categorias.filter(
                              (cat) => cat !== 'Categoria azul'
                            )
                            : [...values.categorias, 'Categoria azul']
                          handleChange({
                            target: {
                              name: 'categorias',
                              value: nuevaCategorias
                            }
                          })
                        }}
                      >
                        <span
                          className={cn(
                            'w-[16px] h-[16px] block bg-blue-300',
                            // @ts-expect-error
                            values.categorias.includes('Categoria azul')
                              ? 'border-2 border-blue-500'
                              : ''
                          )}
                        ></span>
                        <span>Categoria azul</span>
                      </div>
                      <div
                        className={`flex gap-3 py-0 items-center ${
                          // @ts-expect-error
                          values.categorias.includes('Categoria naranja')
                            ? 'seleccionado'
                            : ''
                        }`}
                        onClick={() => {
                          const nuevaCategorias = values.categorias.includes(
                            // @ts-expect-error
                            'Categoria naranja'
                          )
                            ? values.categorias.filter(
                              (cat) => cat !== 'Categoria naranja'
                            )
                            : [...values.categorias, 'Categoria naranja']
                          handleChange({
                            target: {
                              name: 'categorias',
                              value: nuevaCategorias
                            }
                          })
                        }}
                      >
                        <span
                          className={cn(
                            'w-[16px] h-[16px] block bg-orange-300',
                            // @ts-expect-error
                            values.categorias.includes('Categoria naranja')
                              ? 'border-2 border-blue-500'
                              : ''
                          )}
                        ></span>
                        <span>Categoria naranja</span>
                      </div>
                      <div
                        className={`flex gap-3 py-0 items-center ${
                          // @ts-expect-error
                          values.categorias.includes('Categoria purpura')
                            ? 'seleccionado'
                            : ''
                        }`}
                        onClick={() => {
                          const nuevaCategorias = values.categorias.includes(
                            // @ts-expect-error
                            'Categoria purpura'
                          )
                            ? values.categorias.filter(
                              (cat) => cat !== 'Categoria purpura'
                            )
                            : [...values.categorias, 'Categoria purpura']
                          handleChange({
                            target: {
                              name: 'categorias',
                              value: nuevaCategorias
                            }
                          })
                        }}
                      >
                        <span
                          className={cn(
                            'w-[16px] h-[16px] block bg-violet-300',
                            // @ts-expect-error
                            values.categorias.includes('Categoria purpura')
                              ? 'border-2 border-blue-500'
                              : ''
                          )}
                        ></span>
                        <span>Categoria purpura</span>
                      </div>
                      <div
                        className={`flex gap-3 py-0 items-center ${
                          // @ts-expect-error
                          values.categorias.includes('Categoria roja')
                            ? 'seleccionado'
                            : ''
                        }`}
                        onClick={() => {
                          const nuevaCategorias = values.categorias.includes(
                            // @ts-expect-error
                            'Categoria roja'
                          )
                            ? values.categorias.filter(
                              (cat) => cat !== 'Categoria roja'
                            )
                            : [...values.categorias, 'Categoria roja']
                          handleChange({
                            target: {
                              name: 'categorias',
                              value: nuevaCategorias
                            }
                          })
                        }}
                      >
                        <span
                          className={cn(
                            'w-[16px] h-[16px] block bg-red-300',
                            // @ts-expect-error
                            values.categorias.includes('Categoria roja')
                              ? 'border-2 border-blue-500'
                              : ''
                          )}
                        ></span>
                        <span>Categoria roja</span>
                      </div>
                      <div
                        className={`flex gap-3 py-0 items-center ${
                          // @ts-expect-error
                          values.categorias.includes('Categoria verde')
                            ? 'seleccionado'
                            : ''
                        }`}
                        onClick={() => {
                          const nuevaCategorias = values.categorias.includes(
                            // @ts-expect-error
                            'Categoria verde'
                          )
                            ? values.categorias.filter(
                              (cat) => cat !== 'Categoria verde'
                            )
                            : [...values.categorias, 'Categoria verde']
                          handleChange({
                            target: {
                              name: 'categorias',
                              value: nuevaCategorias
                            }
                          })
                        }}
                      >
                        <span
                          className={cn(
                            'w-[16px] h-[16px] block bg-green-300',
                            // @ts-expect-error
                            values.categorias.includes('Categoria verde')
                              ? 'border-2 border-blue-500'
                              : ''
                          )}
                        ></span>
                        <span>Categoria verde</span>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>
            <div className="flex flex-col gap-0 text-sm h-full justify-center items-start border-r border-gray-200 ">
              <button
                type="button"
                onClick={async () =>
                  await setValues({
                    ...values,
                    etiqueta: values.etiqueta != 'privado' ? 'privado' : ''
                  })
                }
                className={cn(
                  'flex w-full text-black items-center hover:bg-gray-200 gap-1 px-2',
                  values.etiqueta == 'privado' ? 'bg-gray-300' : ''
                )}
              >
                <div className="flex gap-1">
                  <img
                    src={privado}
                    alt=""
                    className="w-[17px] h-[17px] object-contain"
                  />
                </div>
                <p>Privado</p>
              </button>
              <button
                type="button"
                onClick={async () =>
                  await setValues({
                    ...values,
                    etiqueta:
                      values.etiqueta != 'importancia alta'
                        ? 'importancia alta'
                        : ''
                  })
                }
                className={cn(
                  'flex w-full text-black items-center hover:bg-gray-200 gap-1 px-2',
                  values.etiqueta == 'importancia alta' ? 'bg-gray-300' : ''
                )}
              >
                <div className="flex gap-1">
                  <img
                    src={imalta}
                    alt=""
                    className="w-[17px] h-[17px] object-contain"
                  />
                </div>
                <p>Importancia alta</p>
              </button>
              <button
                type="button"
                onClick={async () =>
                  await setValues({
                    ...values,
                    etiqueta:
                      values.etiqueta != 'importancia baja'
                        ? 'importancia baja'
                        : ''
                  })
                }
                className={cn(
                  'flex w-full text-black items-center hover:bg-gray-200 gap-1 px-2',
                  values.etiqueta == 'importancia baja' ? 'bg-gray-300' : ''
                )}
              >
                <div className="flex gap-1">
                  <img
                    src={imbaja}
                    alt=""
                    className="w-[17px] h-[17px] object-contain"
                  />
                </div>
                <p>Importancia baja</p>
              </button>
            </div>
          </div>
          {values.categorias.length > 0 && (
            <div
              className={cn(
                'mt-1 grid gap-1 px-2'
                // `grid-cols-${values.categorias.length}`
              )}
              style={{ gridTemplateColumns: `repeat(${values.categorias.length}, 1fr)` }}
            >
              {values.categorias.map((categoria: any, index: number) => (
                <span
                  key={index}
                  className={cn('w-full text-sm px-2 font-medium', categoria == 'Categoria amarilla' ? 'bg-yellow-300' : categoria == 'Categoria azul' ? 'bg-blue-300' : categoria == 'Categoria naranja' ? 'bg-orange-300' : categoria == 'Categoria purpura' ? 'bg-violet-300' : categoria == 'Categoria roja' ? 'bg-red-300' : categoria == 'Categoria verde' ? 'bg-green-300' : '')}
                >
                  {categoria}
                </span>
              ))}
            </div>
          )}
          <form
            id="yourFormId" // Asigna un ID al formulario
            onSubmit={handleSubmit}
            className="flex flex-col gap-1 w-full px-2 pt-4 pb-2"
          >
            <section className="flex gap-3 w-full">
              {values.tipo == 'reunion' && (
                <button
                  type="submit"
                  className="flex w-[60px] flex-col border border-gray-400 hover:bg-gray-100 transition-colors h-fit px-1 rounded-sm py-2"
                >
                  <img
                    src={enviar}
                    alt=""
                    className="w-[35px] h-[37px] object-contain"
                  />
                  <p>Enviar</p>
                </button>
              )}
              <section
                className={cn(
                  'flex flex-col gap-1 ',
                  values.tipo == 'reunion' ? 'section_citas' : 'w-full'
                )}
              >
                {values.tipo == 'reunion' && (
                  <>
                    <div className="flex text-sm items-center gap-2 w-full">
                      <p className="w-[20%]">De:</p>
                      <p className=" rounded-sm py-0 px-[1px] outline-none w-[80%]">
                        {auth.email_alter}
                      </p>
                    </div>
                    <div className="flex text-sm items-center gap-2 w-full">
                      <p className="w-[20%]">Para:</p>
                      <div className="relative w-[80%] flex gap-2">
                        <input
                          type="text"
                          className="border border-gray-400 rounded-sm py-0 px-[1px] outline-none w-[80%]"
                          value={toEmail}
                          onChange={handleInputChange}
                          onBlur={blurMail}
                          onKeyDown={handleKeyDown}
                        />
                        {suggestions.length > 0 && (
                          <ul className="absolute top-full left-0 right-0 bg-white border border-gray-300 rounded-sm max-h-40 overflow-y-auto z-10">
                            {suggestions.map((suggestion: any) => (
                              <li
                                key={suggestion.id}
                                className="p-1 cursor-pointer hover:bg-gray-200"
                                onClick={() => {
                                  handleSuggestionClick(suggestion)
                                }}
                              >
                                {suggestion.name} ({suggestion.email})
                              </li>
                            ))}
                          </ul>
                        )}
                        <div className="w-[20%] flex justify-center">
                          <button
                            type="button"
                            className=" bg-main hover:bg-main_dark transition-colors text-white rounded-sm w-full"
                            onClick={addEmail}
                          >
                            Añadir
                          </button>
                        </div>
                      </div>
                    </div>
                  </>
                )}
                {values.miembros.length > 0 && values.tipo == 'reunion' && (
                  <div className="flex text-sm items-center gap-2 w-full">
                    <p className="w-[20%]"></p>
                    <Swiper
                      slidesPerView={3}
                      className="w-[80%] swp_citas overflow-hidden"
                      spaceBetween={20}
                      breakpoints={{
                        0: {
                          slidesPerView: 1
                        },
                        576: {
                          slidesPerView: 2
                        },
                        800: {
                          slidesPerView: 3
                        },
                        1200: {
                          slidesPerView: 3
                        },
                        1600: {
                          slidesPerView: 3
                        }
                      }}
                    >
                      {values.miembros.map((miembro: any, index: number) => (
                        <SwiperSlide
                          key={index}
                          className="w-full flex items-center justify-center bg-gray-200 py-1 rounded line-clamp-1"
                        >
                          <span className="w-[85%]">{miembro.email}</span>
                          <button
                            type="button"
                            className="ml-2 text-red-500 text-xl bg-gray-200 w-[15%] "
                            onClick={() => {
                              handleRemoveMember(miembro.email)
                            }}
                          >
                            &times;
                          </button>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  </div>
                )}
                <div className="flex text-sm items-center gap-2 w-full">
                  <p className="w-[20%]">Asunto:</p>
                  <input
                    type="text"
                    name="asunto"
                    value={values.asunto}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="border border-gray-400 rounded-sm py-0 px-[1px] outline-none w-[80%]"
                  />
                </div>
                <div className="flex text-sm items-center gap-2 w-full">
                  <p className="w-[20%]">Hora de inicio:</p>
                  <div className="flex gap-[2px] w-[80%]">
                    <input
                      type="date"
                      className="border border-gray-400 rounded px-1"
                      name="dateinicio"
                      value={values.dateinicio}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <input
                      type="time"
                      className="border border-gray-400 rounded px-1"
                      name="timeinicio"
                      value={values.timeinicio}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>
                <div className="flex text-sm items-center gap-2 w-full">
                  <p className="w-[20%]">Hora de finalización:</p>
                  <div className="flex gap-[2px] w-[80%]">
                    <input
                      type="date"
                      className="border border-gray-400 rounded px-1"
                      name="datefinal"
                      value={values.datefinal}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <input
                      type="time"
                      className="border border-gray-400 rounded px-1"
                      name="timefinal"
                      value={values.timefinal}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                  </div>
                </div>
              </section>
            </section>
            <textarea
              rows={10}
              name="cuerpo"
              value={values.cuerpo}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border border-gray-400 rounded-sm p-[2px] outline-none text-sm resize-none"
            ></textarea>
          </form>
        </section>
      ) : (
        <section className="w-full min-h-[500px]">
          <Loading />
        </section>
      )}
    </Dialog>
  )
}
