/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable multiline-ternary */
import { Dialog } from '@mui/material'
import { type Dispatch, type SetStateAction, useState, useEffect } from 'react'
import { icono } from '../../../shared/Images'
import useAuth from '../../../../hooks/useAuth'
import { v4 as uuidv4 } from 'uuid'
import { format } from 'date-fns'
import { Loading } from '../../../shared/Loading'
import { cn } from '../../../shared/cn'
import { ModalProyectos } from './ModalProyectos'
import { Link } from 'react-router-dom'
import { MdDelete, MdEdit } from 'react-icons/md'
import { FaWhatsapp } from 'react-icons/fa'
import { ModalEdicion } from './ModalEdicion'
import { toast } from 'sonner'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { RiFolderSharedFill } from 'react-icons/ri'
import { LoadingSmall } from '../../../shared/LoadingSmall'
import Swal from 'sweetalert2'

export const ModalRegistroLaboral = ({
  open,
  setOpen,
  //   events,
  //   setEvents,
  Event,
  loading,
  setLoading,
  getHorarioLaboral,
  tiempoTrabajado,
  idEvent
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  //   events: Event[]
  //   setEvents: Dispatch<SetStateAction<Event[]>>
  Event: any | undefined
  loading: boolean
  setLoading: any
  getHorarioLaboral: any
  tiempoTrabajado: any
  idEvent: any
}): JSX.Element => {
  const { auth } = useAuth()
  const token = localStorage.getItem('token')
  //   const [tiempoTrabajado, setTiempoTrabajado] = useState(0)
  const [currentTime, setCurrentTime] = useState('0')
  //   const [loading, setLoading] = useState(true)
  const [tipoTrabajo, setTipoTrabajo] = useState('')
  const [loadingBoton, setLoadingBoton] = useState(false)
  const [openProyectos, setOpenProyectos] = useState(false)
  const [openProyectosEdicion, setOpenProyectosEdicion] = useState(false)
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<any | null>(
    null
  )
  const [actividadEditando, setActividadEditando] = useState<any | null>(null)

  const getCurrentTime = (): string => {
    const now = new Date()
    const hours = now.getHours().toString().padStart(2, '0')
    const minutes = now.getMinutes().toString().padStart(2, '0')
    return `${hours}:${minutes}`
  }

  const handleEditActividad = (hour: string, actividadId: string): void => {
    const actividad = Event?.detalle[hour.toString()].find(
      (a: any) => a.id == actividadId
    )
    if (actividad) {
      setActividadEditando({ hora: hour, actividad })
      setOpenProyectosEdicion(true)
    }
  }

  useEffect(() => {
    const intervalId = setInterval(() => {
      setCurrentTime(getCurrentTime())
    }, 1000)
    return () => {
      clearInterval(intervalId)
    }
  }, [])

  const enviarDatos = async (
    newEvent: any,
    formattedCurrentTime: any
  ): Promise<void> => {
    setLoading(true)
    const data = new FormData()
    data.append('array_horario', JSON.stringify(newEvent))
    data.append('id_user', auth.id)
    data.append('start', formattedCurrentTime)
    try {
      const respuesta = await axios.post(
        `${Global.url}/registerHorarioLaboralNew`,
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
        toast.success('CONTENIDO ENVIADA CORRECTAMENTE')
        getHorarioLaboral()
        // const enviarNotificacion = async (): Promise<void> => {
        //   const data = new FormData()
        //   data.append('id_usuario', auth.id)
        //   data.append('id_venta', id ?? '')
        //   data.append('nombre', auth.name)
        //   data.append('icono', 'comentario')
        //   data.append('url', `/admin/seguimiento/${id ?? ''}`)
        //   data.append(
        //     'contenido',
        //     `Ha subido un nuevo comentario para el proyecto ${
        //       nombreMarca ?? ''
        //     }  (${nombreCliente ?? ''})`
        //   )
        //   data.append('hidden_users', '')
        //   try {
        //     await axios.post(`${Global.url}/nuevaNotificacion`, data, {
        //       headers: {
        //         Authorization: `Bearer ${
        //           token !== null && token !== '' ? token : ''
        //         }`
        //       }
        //     })
        //   } catch (error: unknown) {
        //     console.log(error)
        //     Swal.fire('Error al subir', '', 'error')
        //   }
        // }
        // enviarNotificacion()
        // setOpen(false)
      }
    } catch (error: unknown) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleSelectSlot = (): void => {
    if (tipoTrabajo) {
      const currentDateTime = new Date()
      const formattedCurrentTime = format(
        currentDateTime,
        'yyyy-MM-dd HH:mm:ss'
      )
      const newEvent = {
        id: uuidv4(),
        modalidad: tipoTrabajo,
        user: { name: auth.name, id: auth.id },
        title: auth.name,
        timeRanges: [{ start: formattedCurrentTime, end: null }], // Array de objetos con hora de inicio y fin inicialmente iguales
        start: formattedCurrentTime,
        end: formattedCurrentTime,
        detalle: null
      }
      enviarDatos(newEvent, formattedCurrentTime)
    } else {
      toast.warning('Debe seleccionar la modalidad de trabajo')
    }
  }

  const handleAddTimeRange = (): void => {
    const currentDateTime = new Date()
    const formattedCurrentTime = format(currentDateTime, 'yyyy-MM-dd HH:mm:ss')
    // Verificar si la hora de inicio del nuevo rango ya existe en los rangos actuales
    const startTimeExists = Event.timeRanges.some((timeRange: any) => {
      const startTime = new Date(timeRange.start)
      const newTime = new Date(formattedCurrentTime)
      return startTime.getHours() === newTime.getHours()
    })
    if (!startTimeExists) {
      if (Event.id) {
        const newTimeRange = { start: formattedCurrentTime, end: null }
        const updatedTimeRanges = [...Event.timeRanges, newTimeRange]
        actualizarHorariLaboral({ ...Event, timeRanges: updatedTimeRanges })
      }
    } else {
      toast.warning('Hora actual ya registrada')
    }
  }

  const handleFinishWork = (index: number): void => {
    const currentDateTime = new Date()
    const formattedCurrentTime = format(currentDateTime, 'yyyy-MM-dd HH:mm:ss')
    if (Event.id) {
      const updatedTimeRanges = Event.timeRanges.map(
        (timeRange: any, i: number) => {
          if (i == index) {
            return { ...timeRange, end: formattedCurrentTime }
          }
          return timeRange
        }
      )
      actualizarHorariLaboral({ ...Event, timeRanges: updatedTimeRanges })
      setOpen(false)
    }
  }

  const handleDeleteActividad = (hour: string, actividadId: string): void => {
    // Filtra el detalle actualizado para eliminar la actividad especificada
    const updatedDetalle = {
      ...Event.detalle,
      [hour.toString()]: Event.detalle[hour.toString()].filter(
        (actividad: any) => actividad.id !== actividadId
      )
    }
    actualizarHorariLaboral({ ...Event, detalle: updatedDetalle })
    // Actualiza el array de eventos con el evento actualizado
    // const updatedEvents = events.map((event: any) => {
    //   if (event.id === updatedEvent.id) {
    //     return updatedEvent
    //   }
    //   return event
    // })
    // setEvents(updatedEvents)
    // setEvent(updatedEvent)
  }

  const retornarFecha = (evento: string): string => {
    const fechaInicio = new Date(evento).toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    })
    return fechaInicio
  }

  const exportarEventos = (): void => {
    let mensajeWsp = ''
    const fechaActual = new Date() // Obtener la fecha actual
    const fechaEvento = new Date(Event.start)
    const proyectos: Record<string, string> = {} // Objeto para agrupar las actividades por proyecto

    if (
      fechaEvento.getDate() === fechaActual.getDate() &&
      fechaEvento.getMonth() === fechaActual.getMonth() &&
      fechaEvento.getFullYear() === fechaActual.getFullYear()
    ) {
      mensajeWsp += `RESUMEN ${Event.user.name.toUpperCase()} / ${retornarFecha(
        Event.start
      )} \n\n`
      Object.keys(Event.detalle).forEach((hora: string) => {
        const actividades = Event.detalle[hora]
        // Agrupar actividades por proyecto
        actividades.forEach((actividad: any) => {
          const nombreProyecto = `${actividad.proyecto.nombre} (${actividad.proyecto.nombreCliente})`
          if (!proyectos[nombreProyecto]) {
            proyectos[nombreProyecto] = ''
          }
          proyectos[
            nombreProyecto
          ] += `${actividad.horaInicio} - ${actividad.horaFin}: ${actividad.descripcion}  \n`
        })
      })
      // Construir el mensaje para WhatsApp con la información agrupada por proyecto
      Object.keys(proyectos).forEach((proyecto: string) => {
        mensajeWsp += `${proyecto}\n${proyectos[proyecto]}\n\n`
      })
    }
    if (mensajeWsp === '') {
      alert('No hay eventos para exportar hoy.')
      return
    }
    const mensajeWspEncoded = encodeURIComponent(mensajeWsp)
    const urlWhatsApp = `https://web.whatsapp.com/send?text=${mensajeWspEncoded}`
    window.open(urlWhatsApp, '_blank')
  }

  const obtenerFecha = (): string => {
    const fecha = new Date()
    return `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`
  }

  const obtenerHora = (): string => {
    const fecha = new Date()
    return `${fecha.getHours()}:${fecha
      .getMinutes()
      .toString()
      .padStart(2, '0')}`
  }

  const exportarProyectos = (): void => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción exportará los proyectos. ¿Deseas continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, exportar',
      cancelButtonText: 'Cancelar'
    }).then((result: any) => {
      if (result.isConfirmed) {
        exportarProyectos2()
      }
    })
  }

  const exportarProyectos2 = (): void => {
    const fechaActual = new Date()
    const fechaEvento = new Date(Event.start)
    if (
      fechaEvento.getDate() === fechaActual.getDate() &&
      fechaEvento.getMonth() === fechaActual.getMonth() &&
      fechaEvento.getFullYear() === fechaActual.getFullYear()
    ) {
      const proyectos: Record<
      string,
      {
        id: string
        actividades: string
        nombreCliente: string
        nombre: string
      }
      > = {} // Objeto para agrupar las actividades por proyecto y almacenar su ID
      // Iterar sobre las actividades de cada evento y agruparlas por proyecto
      Object.keys(Event.detalle).forEach((hora: string) => {
        const actividades = Event.detalle[hora]
        actividades.forEach((actividad: any) => {
          const nombreProyecto = `${actividad.proyecto.nombre} (${actividad.proyecto.nombreCliente})`
          const idProyecto = actividad.proyecto.id // Obtener el ID del proyecto desde la actividad actual
          if (!proyectos[nombreProyecto]) {
            proyectos[nombreProyecto] = {
              id: idProyecto,
              actividades: '',
              nombreCliente: actividad.proyecto.nombreCliente,
              nombre: actividad.proyecto.nombre
            }
          }
          proyectos[
            nombreProyecto
          ].actividades += `${actividad.horaInicio} - ${actividad.horaFin}: ${actividad.descripcion}  \n`
        })
      })
      // Agregar cada proyecto y sus actividades al resumen
      Object.keys(proyectos).forEach((proyectoNombre: string) => {
        const {
          id: idProyecto,
          actividades,
          nombreCliente,
          nombre
        } = proyectos[proyectoNombre]
        agregarResumen(actividades, idProyecto, nombreCliente, nombre)
      })
    }
  }

  const agregarResumen = async (
    texto: string,
    id: string,
    nombreCliente: string,
    nombreMarca: string
  ): Promise<void> => {
    setLoadingBoton(true)
    // Crear el nuevo resumen primero
    const nuevoResumen = {
      id: Date.now(),
      fecha: obtenerFecha(),
      hora: obtenerHora(),
      user: auth.name,
      userId: auth.id,
      texto,
      respuesta: null,
      respuestas: []
    }
    const enviarDatos = async (): Promise<void> => {
      const data = new FormData()
      data.append('resumen', JSON.stringify(nuevoResumen))
      data.append('_method', 'PUT')
      try {
        const respuesta = await axios.post(
          `${Global.url}/saveHorarioUser/${id ?? ''}`,
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
          toast.success('CONTENIDO ENVIADA CORRECTAMENTE')
          const enviarNotificacion = async (): Promise<void> => {
            const data = new FormData()
            data.append('id_usuario', auth.id)
            data.append('id_venta', id ?? '')
            data.append('nombre', auth.name)
            data.append('icono', 'comentario')
            data.append('url', `/admin/seguimiento/${id ?? ''}`)
            data.append(
              'contenido',
              `Ha subido un nuevo comentario para el proyecto ${
                nombreMarca ?? ''
              }  (${nombreCliente ?? ''})`
            )
            data.append('hidden_users', '')
            try {
              await axios.post(`${Global.url}/nuevaNotificacion`, data, {
                headers: {
                  Authorization: `Bearer ${
                    token !== null && token !== '' ? token : ''
                  }`
                }
              })
            } catch (error: unknown) {
              console.log(error)
              Swal.fire('Error al subir', '', 'error')
            }
          }
          enviarNotificacion()
          setOpen(false)
        }
      } catch (error: unknown) {
        console.log(error)
      } finally {
        setLoadingBoton(false)
      }
    }
    enviarDatos()
  }

  const formatTiempoTrabajado = (tiempoTrabajado: number): string => {
    let horas = Math.floor(tiempoTrabajado / 60) // Convertir minutos a horas
    let minutos = tiempoTrabajado % 60 // Obtener los minutos restantes

    // Redondear hacia arriba si los minutos son mayores o iguales a 30
    if (minutos == 60) {
      horas++
      minutos = 0
    }
    // Formatear el resultado en el formato deseado
    const horasFormateadas = horas.toString().padStart(2, '0')
    const minutosFormateados = minutos.toString().padStart(2, '0')
    return `${horasFormateadas}:${minutosFormateados}`
  }

  const actualizarHorariLaboral = async (Event: Event[]): Promise<void> => {
    setLoading(true)
    const data = new FormData()
    data.append('array_horario', JSON.stringify(Event))
    data.append('_method', 'PUT')
    console.log(idEvent)
    try {
      const request = await axios.post(
        `${Global.url}/updateHorarioLaboralNew/${idEvent}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      if (request.data.status == 'success') {
        toast.success('Guardado correctamente')
        getHorarioLaboral()
      }
    } catch (error) {
      console.log(error)
      toast.error('Error al guardar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false)
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="dialog_index"
      maxWidth={!openProyectos ? 'md' : 'lg'}
    >
      {loading ? (
        <div className="bg-white w-[400px] h-[400px] ">
          <Loading />
        </div>
      ) : !Event ? (
        <div className="bg-white w-[400px] h-[400px]: overflow-hidden group rounded-none  shadow hover:shadow-lg transition-all hover:cursor-pointer">
          <div className="flex justify-center pt-6">
            <img
              src={icono}
              alt="JT Devs"
              className="rounded-full w-28 h-28 object-cover ring-4 p-3 ring-gray-300"
            />
          </div>
          <div className="flex flex-col items-center gap-0 p-4">
            <h3 className="font-semibold text-xl transition-all">
              {auth.name}
            </h3>
            <p className="text-gray-600 ">{currentTime}</p>
          </div>
          <div className="px-4">
            <select
              className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
              name="tipo_documento"
              value={tipoTrabajo}
              onChange={(e) => {
                setTipoTrabajo(e.target.value)
              }}
            >
              {/* FB GOOGLE, VENTAS, POST VENTA, RECOMENDACION, ISNTAGRAM) */}
              <option value="">Seleccionar modalidad de trabajo</option>
              <option value="Presencial">Presencial</option>
              <option value="Home office">Home office</option>
            </select>
          </div>
          <div className="w-full py-3 flex justify-center">
            <button
              onClick={() => {
                handleSelectSlot()
              }}
              className="bg-main hover:bg-main_dark transition-colors rounded-md text-white text-center px-4 py-2"
            >
              Registrar asistencia
            </button>
          </div>
        </div>
      ) : (
        <div className="bg-white w-[900px] h-[700px] p-4 overflow-hidden group rounded-none  shadow hover:shadow-lg transition-all hover:cursor-pointer overflow-y-auto">
          <section className="w-full flex h-[50px]">
            <div className="w-full flex flex-col gap-3">
              <div className="flex w-full h-full gap-3 items-center ">
                <div className="flex justify-center ">
                  <img
                    src={icono}
                    alt="JT Devs"
                    className="rounded-full w-14 h-14 object-cover ring-4 p-1 ring-gray-300"
                  />
                </div>
                <div className="flex flex-col items-start justify-center gap-0 p-4">
                  <h3 className="font-semibold text-xl transition-all">
                    {auth.name}
                  </h3>
                  <span>{new Date(Event.start).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="font-bold pl-1 ">
                Horas trabajadas :{' '}
                {tiempoTrabajado && formatTiempoTrabajado(tiempoTrabajado)}
              </div>
            </div>
            <div className="h-full flex gap-3 items-center">
              {!loadingBoton ? (
                <RiFolderSharedFill
                  className="text-2xl text-red-600 hover:text-red-700 transition-colors hover:scale-110"
                  onClick={() => {
                    exportarProyectos()
                  }}
                />
              ) : (
                <span>
                  <LoadingSmall />
                </span>
              )}

              <FaWhatsapp
                className="text-2xl text-green-600 hover:text-green-700 transition-colors hover:scale-110"
                onClick={() => {
                  exportarEventos()
                }}
              />
            </div>
          </section>
          {Event && (
            <section className="flex flex-col justify-between gap-6 mt-4 ">
              <div className="w-full h-full">
                {Event.timeRanges.map((timeRange: any, index: number) => {
                  const currentHour = new Date().getHours()
                  const firstHour = new Date(timeRange.start).getHours()
                  let lastHour = currentHour
                  if (timeRange.end) {
                    lastHour = new Date(timeRange.end).getHours()
                  }
                  const hoursInRange = Array.from(
                    { length: lastHour - firstHour + 1 },
                    (_, i) => i + firstHour
                  )
                  return (
                    <section key={index} className="py-4">
                      {timeRange.start || timeRange.end ? (
                        <div className="w-full flex justify-between px-1">
                          {timeRange.start && (
                            <span className="text-green-700 py-2 font-bold">
                              INICIO:{' '}
                              {new Date(timeRange.start).toLocaleTimeString()}{' '}
                            </span>
                          )}
                          {timeRange.end && (
                            <span className="text-red-700 py-2 font-bold">
                              FIN:{' '}
                              {new Date(timeRange.end).toLocaleTimeString()}
                            </span>
                          )}
                        </div>
                      ) : null}
                      <div className="grid grid-cols-7 gap-3 border-y border-gray-300  py-2">
                        <div className="w-full">
                          <p className="w-full text-center font-semibold">
                            Hora
                          </p>
                        </div>
                        <div className="w-full ">
                          <p className="w-full text-center font-semibold">
                            Tiempo
                          </p>
                        </div>
                        <div className="w-full col-span-2">
                          <p className="w-full text-center font-semibold">
                            Proyecto
                          </p>
                        </div>
                        <div className="w-full col-span-3">
                          <p className="w-full text-center font-semibold">
                            Actividades
                          </p>
                        </div>
                      </div>
                      {hoursInRange.map((hour, indexHour: number) => (
                        <div
                          className={cn(
                            'grid grid-cols-7 gap-3 py-2 rounded-md relative',
                            indexHour % 2 != 0 ? 'bg-gray-200' : ''
                          )}
                          key={hour}
                        >
                          <div className="w-full h-full flex items-center justify-center">
                            <p
                              className="text-center flex items-center justify-center hover:bg-main w-fit px-3 hover:text-white transition-colors rounded-md"
                              onClick={() => {
                                setOpenProyectos(!openProyectos)
                                setProyectoSeleccionado({
                                  hora: hour,
                                  proyecto: null,
                                  timeRange
                                })
                              }}
                            >
                              {hour}
                            </p>
                          </div>
                          {Event?.detalle &&
                            Event?.detalle[hour.toString()] && (
                              <div className="col-span-6 ">
                                {Event.detalle[hour.toString()]
                                  .sort((a: any, b: any) =>
                                    a.horaInicio.localeCompare(b.horaInicio)
                                  )
                                  .map((actividad: any) => (
                                    <div
                                      key={actividad.id}
                                      className="grid grid-cols-6 gap-4"
                                    >
                                      <p className="col-span-1">
                                        {actividad.horaInicio} -{' '}
                                        {actividad.horaFin}
                                      </p>
                                      <Link
                                        to={`/admin/lista-servicios/avances/${
                                          actividad?.proyecto?.id ?? ''
                                        }`}
                                        target="_blank"
                                        className="col-span-2 w-full text-center line-clamp-1 hover:text-blue-600"
                                      >
                                        {actividad?.proyecto?.nombre}
                                      </Link>
                                      <div className="flex gap-2 col-span-3 ">
                                        <p className="w-full break-words line-clamp-1 pr-6">
                                          {actividad.descripcion}
                                        </p>
                                        <button
                                          onClick={() => {
                                            handleEditActividad(
                                              hour.toString(),
                                              actividad.id
                                            )
                                          }}
                                          className=" text-blue-500 hover:text-blue-700  text-lg"
                                        >
                                          <MdEdit />
                                        </button>
                                        <button
                                          onClick={() => {
                                            handleDeleteActividad(
                                              hour.toString(),
                                              actividad.id
                                            )
                                          }}
                                          className=" text-red-500 hover:text-red-700"
                                        >
                                          <MdDelete />
                                        </button>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                          )}
                          <div className="w-full h-full flex items-center">
                            <p className="w-full text-center"></p>
                          </div>
                          <div className="w-full col-span-2">
                            <p className="w-full text-center"> </p>
                          </div>
                        </div>
                      ))}
                      {timeRange.start && !timeRange.end ? (
                        <div className="w-full h-fit flex justify-center mt-4">
                          <button
                            className=" bg-main hover:bg-main_dark transition-colors text-white rounded-md text-lg py-1 px-4 w-fit"
                            onClick={() => {
                              handleFinishWork(index)
                            }}
                          >
                            Terminar horario
                          </button>
                        </div>
                      ) : (
                        Event.timeRanges.length == index + 1 && (
                          <div className="w-full h-fit flex justify-center mt-4">
                            <button
                              className=" bg-main hover:bg-main_dark transition-colors text-white rounded-md text-lg py-1 px-4 w-fit"
                              onClick={() => {
                                handleAddTimeRange()
                              }}
                            >
                              Retomar Actividades
                            </button>
                          </div>
                        )
                      )}
                    </section>
                  )
                })}
              </div>
            </section>
          )}
        </div>
      )}
      {openProyectos && (
        <ModalProyectos
          Event={Event}
          setOpen={setOpenProyectos}
          proyectoSeleccionado={proyectoSeleccionado}
          setProyectoSeleccionado={setProyectoSeleccionado}
          actualizarHorariLaboral={actualizarHorariLaboral}
        />
      )}
      {openProyectosEdicion && (
        <ModalEdicion
          Event={Event}
          setOpen={setOpenProyectosEdicion}
          proyectoSeleccionado={actividadEditando}
          setProyectoSeleccionado={setActividadEditando}
          actualizarHorariLaboral={actualizarHorariLaboral}
        />
      )}
    </Dialog>
  )
}
