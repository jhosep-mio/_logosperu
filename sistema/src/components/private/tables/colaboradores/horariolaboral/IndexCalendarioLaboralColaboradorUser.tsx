/* eslint-disable no-unmodified-loop-condition */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/es'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { cn } from '../../../../shared/cn'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import { Loading } from '../../../../shared/Loading'
import { SlSizeFullscreen, SlSizeActual } from 'react-icons/sl'
import { Link } from 'react-router-dom'
import useAuth from '../../../../../hooks/useAuth'
import { ViewHorario2 } from './ViewHorario2'
import Vacaciones from './Vacaciones'
import { eachDayOfInterval } from 'date-fns'
import { toast } from 'sonner'
import { DetallePermiso } from '../modals/DetallePermiso'
import { motion, AnimatePresence } from 'framer-motion'
import { RiBarChart2Fill } from 'react-icons/ri'
import { PopUpVerMas } from './popup/PopUpVerMas'
moment.locale('es')
export const IndexCalendarioLaboralColaboradorUser = (): JSX.Element => {
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(true)
  const { auth } = useAuth()
  const id = auth.id
  const [activeDescription, setActiveDescription] = useState(false)
  const [festivos, setFestivos] = useState<Event[]>([])
  const [vacacionesEvents, setVacacionesEvents] = useState<Event[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [openDiasFestivos, setOpenDiasFestivos] = useState(false)
  const [vacaciones, setVacaciones] = useState(false)
  const [permisos, setPermisos] = useState<Event[]>([])
  const [recuperacion, setrecuperacion] = useState<Event[]>([])
  const [openPermiso, setOpenPermiso] = useState<any>({
    estado: false,
    titulo: '',
    description: ''
  })
  const [recurso, setRecurso] = useState<any>({
    estado: false,
    recurso: ''
  })
  const localizer = momentLocalizer(moment)

  const getHorarioLaboral = async (): Promise<void> => {
    try {
      const request = await axios.get(
        `${Global.url}/indexHorarioLaboral/${id ?? ''}`,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      if (request.data) {
        const horario = JSON.parse(request.data.horario_laboral)
          ? JSON.parse(request.data.horario_laboral)
          : []
        const horariofestivos = JSON.parse(request.data.festivos)
          ? JSON.parse(request.data.festivos)
          : []
        const horariovacaciones = JSON.parse(request.data.vacaciones)
          ? JSON.parse(request.data.vacaciones)
          : []
        const horariopermisos = JSON.parse(request.data.permisos)
          ? JSON.parse(request.data.permisos)
          : []
        const horariorecuperacion = JSON.parse(request.data.recuperacion)
          ? JSON.parse(request.data.recuperacion)
          : []
        const total = [
          ...horario,
          ...horariofestivos,
          ...horariovacaciones,
          ...horariopermisos,
          ...horariorecuperacion
        ]
        setEvents(total)
        setFestivos(horariofestivos)
        setVacacionesEvents(horariovacaciones)
        setPermisos(horariopermisos)
        setrecuperacion(horariorecuperacion)
      }
    } catch (error) {
      console.error('Error al obtener el horario laboral:', error)
    } finally {
      setLoading(false)
    }
  }

  const messages = {
    allDay: 'Todo el día',
    previous: '<',
    next: '>',
    today: 'Hoy',
    month: 'Mes',
    week: 'Semana',
    day: 'Día',
    agenda: 'Agenda',
    date: 'Fecha',
    time: 'Hora',
    event: 'Evento',
    noEventsInRange: 'No tiene eventos.', // Nuevo mensaje
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    showMore: (total: any) => `+ Ver más (${total})`,

    customView: {
      buttonText: 'Acción Personalizada',
      click: function () {
        // Aquí ejecutas la acción que deseas al hacer clic en el botón "Acción Personalizada"
        console.log('Ejecutar acción personalizada')
      }
    }
  }

  const [open, setOpen] = useState({ estado: false, evento: null })
  const [selectedDate, setSelectedDate] = useState<Date | null>()

  const handleDateChange = (e: any): void => {
    const { value } = e.target
    const [year, month] = value.split('-').map(Number)
    if (year > 2023) {
      setSelectedDate(new Date(year, month - 1, 1))
    }
  }

  useEffect(() => {
    getHorarioLaboral()
  }, [])

  const formatDate = (): any => {
    return selectedDate ? moment(selectedDate).format('YYYY-MM') : ''
  }
  const [fullView, setFullView] = useState(false)

  function onlyName (name: string): string {
    const primerEspacioIndex = name.indexOf(' ')
    if (primerEspacioIndex !== -1) {
      return name.substring(0, primerEspacioIndex)
    } else {
      return name
    }
  }

  const components = {
    event: (props: any) => {
      return (
        <div
          className="cursor-pointer w-full  overflow-hidden relative rounded-md h-full hover:text-black/40 transition-colors outline-none duration-300 break-words flex "
          rel="noreferrer"
          onClick={() => {
            if (
              props.event.modalidad == 'Presencial' ||
              props.event.modalidad == 'Home office'
            ) {
              setOpen({ estado: true, evento: props })
              setActiveDescription(true)
              setOpenDiasFestivos(false)
            } else if (props.event.modalidad == 'Permisos') {
              setOpenPermiso({
                estado: true,
                titulo: props?.event.title,
                description: props?.event?.detalle
              })
            }
          }}
        >
          <span
            className={cn(
              'absolute top-0 w-[200%] h-[200%] block  z-[1]',
              props.event.modalidad == 'Presencial'
                ? 'bg-yellow-500'
                : props.event.modalidad == 'Home office'
                  ? 'bg-green-600'
                  : props.event.modalidad == 'Dia festivo'
                    ? 'bg-red-500'
                    : props.event.modalidad == 'Vacaciones'
                      ? 'bg-[#e8e888] text-black'
                      : props.event.modalidad == 'Permisos'
                        ? 'bg-[#be98ce]'
                        : props.event.modalidad == 'Recuperación'
                          ? 'bg-[#808080]'
                          : 'bg-[#54A9DC]'
            )}
          ></span>
          <div
            className={cn(
              'div_cita px-1 z-[1] h-full w-full text-white transition-colors rounded-t-md bg-transparent'
            )}
          >
            <span className="block lowercase first-letter:uppercase text-[12px] md:text-sm">
              <p
                className={cn(
                  'hidden md:block text-center w-full',
                  props.event.modalidad == 'Vacaciones'
                    ? 'text-black'
                    : 'text-white'
                )}
              >
                {props.title}
              </p>
              <p className="block md:hidden">{onlyName(props.title)}</p>
            </span>
          </div>
        </div>
      )
    }
  }

  const vacionessDates = vacacionesEvents.flatMap((feriado: any) => {
    const startDate = new Date(feriado.start)
    const endDate = new Date(feriado.end)
    const dates = eachDayOfInterval({ start: startDate, end: endDate }) // Reducir un día al final
    return dates
  })

  const festivosDates = festivos.flatMap((feriado: any) => {
    const startDate = new Date(feriado.start)
    const endDate = new Date(feriado.end)
    const dates = eachDayOfInterval({ start: startDate, end: endDate }) // Sin restar un día al final
    return dates
  })

  const permisosDates = permisos.flatMap((feriado: any) => {
    const startDate = new Date(feriado.start)
    const endDate = new Date(feriado.end)
    const dates = eachDayOfInterval({ start: startDate, end: endDate }) // Sin restar un día al final
    return dates
  })

  const recuperacionDates = recuperacion.flatMap((feriado: any) => {
    const startDate = new Date(feriado.start)
    const endDate = new Date(feriado.end)
    const dates = eachDayOfInterval({ start: startDate, end: endDate }) // Sin restar un día al final
    return dates
  })

  const customDayPropGetter = (date: Date): any => {
    const isVacation = vacionessDates.some((vacation) => {
      return (
        date.getTime() >= vacation.getTime() &&
        date.getTime() <= vacation.getTime()
      )
    })
    const isPermisos = permisosDates.some((vacation) => {
      return (
        date.getTime() >= vacation.getTime() &&
        date.getTime() <= vacation.getTime()
      )
    })
    const isHoliday = festivosDates.some((holiday) => {
      return (
        date.getTime() >= holiday.getTime() &&
        date.getTime() <= holiday.getTime()
      )
    })
    const isRecuperacion = recuperacionDates.some((holiday) => {
      return (
        date.getTime() >= holiday.getTime() &&
        date.getTime() <= holiday.getTime()
      )
    })
    if (isVacation) {
      return {
        className: 'bg-[#FDFD96]' // Estilo para vacaciones
      }
    } else if (isHoliday) {
      return {
        className: 'bg-red-500/80' // Estilo para días festivos
      }
    } else if (isPermisos) {
      return {
        className: 'bg-[#d4b5e1]' // Estilo para días festivos
      }
    } else if (isRecuperacion) {
      return {
        className: 'bg-[#9b9999]' // Estilo para días festivos
      }
    } else {
      return {} // No aplicar estilos especiales
    }
  }

  const updatefestivos = async (updatedEvents: Event[]): Promise<void> => {
    const data = new FormData()
    data.append('festivos', JSON.stringify(updatedEvents))
    data.append('_method', 'PUT')
    try {
      const request = await axios.post(
        `${Global.url}/updatefestivos/${id ?? ''}`,
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
        toast.success('Horario actualizado')
        getHorarioLaboral()
      }
    } catch (error) {
      toast.errror('error al guardar')
    }
  }

  const [mostrarIndicadores, setMostrarIndicadores] = useState(false)

  const toggleIndicadores = (): void => {
    setMostrarIndicadores(!mostrarIndicadores)
  }

  const handleShowMore = (total: any): void => {
    const modifiedTotal = total.map((item: any) => {
      return {
        event: {
          detalle: item?.detalle,
          end: item?.end,
          id: item?.id,
          modalidad: item?.modalidad,
          start: item?.start,
          timeRanges: item?.timeRanges,
          title: item?.title,
          user: item?.user
        }
      }
    })
    setRecurso({ estado: true, recurso: modifiedTotal })
  }

  return (
    <>
      <section className="flex  items-center justify-between bg-white border-b border-gray-300 h-[7%] py-1 md:py-0 lg:h-[8%]  md:px-8">
        <div className="flex gap-3 items-center ">
          <div className="w-10 md:w-12 h-full md:h-12 rounded-md bg-gradient-to-r from-[#54A9DC] to-[#2989c4] flex justify-center text-white text-base md:text-2xl items-center font-extrabold">
            H
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="hidden xl:flex text-[#252525] font-bold text-[12px] md:text-lg">
              HORARIO LABORAL
            </h1>
            <div className="flex gap-2 justify-start">
              <span className="hidden md:block text-gray-700 font-medium text-sm">
                Logos Perú
              </span>
            </div>
          </div>
          <div className='hidden 2xl:flex'>
            <span className="bg-yellow-500 text-white px-2 py-1 rounded-md ml-4">
              Presencial
            </span>
            <span className="bg-green-600 text-white px-2 py-1 rounded-md ml-4">
              Home Office
            </span>
            <span className="bg-[#FDFD96] text-black px-2 py-1 rounded-md ml-4">
              Vacaciones
            </span>
            <span className="bg-[#d4b5e1] text-white px-2 py-1 rounded-md ml-4">
              Permisos
            </span>
          </div>
        </div>
        <input
            type="month"
            value={formatDate()}
            onChange={handleDateChange}
            className="min-w-[150px] bg-transparent text-black"
            min="2023-01"
            max="2030-12"
          />
      </section>

      <DetallePermiso open={openPermiso} setOpen={setOpenPermiso} />

      <PopUpVerMas recurso={recurso} setRecurso={setRecurso} setOpen={setOpen} setActiveDescription={setActiveDescription} setOpenDiasFestivos={setOpenDiasFestivos} setOpenPermiso={setOpenPermiso}/>

      {loading ? (
        <Loading />
      ) : (
        <>
          {!vacaciones ? (
            <section className=" w-full h-[90%] relative">

              <Calendar
                className={`calendario_cm2 calendario_colaboradores text-black calendario_horario_laboral ${
                  activeDescription || openDiasFestivos
                    ? 'activeDescription'
                    : ''
                } ${fullView ? 'fullCalendar' : ''}`}
                localizer={localizer}
                events={events}
                startAccessor={(event: any) => {
                  return new Date(event.start)
                }}
                endAccessor="end"
                selectable
                messages={messages}
                views={['month']}
                defaultView="month"
                dayPropGetter={customDayPropGetter}
                date={selectedDate}
                components={components}
                onShowMore={handleShowMore}
              ></Calendar>
              <button
                type="button"
                className={`absolute w-12 h-12 flex items-center justify-center shadow-lg bottom-[40px] lg:top-[20px] bg-white rounded-full p-2 right-[20px] lg:left-[10px] text-xl mb-2 text-[#54A9DC] ${
                  fullView ? 'block' : 'hidden'
                }`}
                onClick={() => {
                  setFullView(false)
                }}
              >
                <SlSizeActual />
              </button>
              <button
                type="button"
                className={`absolute w-12 h-12 flex items-center justify-center shadow-lg bottom-[40px] lg:top-[65px] bg-white rounded-full p-2 right-[20px] lg:left-[40px] text-xl mb-2 text-[#54A9DC] ${
                  fullView ? 'hidden' : 'block'
                }`}
                onClick={() => {
                  setFullView(true)
                }}
              >
                <SlSizeFullscreen />
              </button>

              <ViewHorario2
                open={open}
                openFestivo={openDiasFestivos}
                festivos={festivos}
                setFestivos={setFestivos}
                setOpen={setOpen}
                activeDescription={activeDescription}
                setActiveDescription={setActiveDescription}
                fullScreen={fullView}
                updatefestivos={updatefestivos}
              />
            </section>
          ) : (
            <section className=" w-full h-[92%] relative ">
              <>
              <div>
                <button
                  className="bg-blue-500 rounded-full fixed 2xl:hidden right-4 bottom-16 z-[140] hover:bg-blue-700 text-white font-bold p-3 "
                  onClick={toggleIndicadores}
                >
                  <RiBarChart2Fill/>
                </button>
                <AnimatePresence>
                  {mostrarIndicadores && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.5 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.5 }}
                      transition={{ duration: 0.3 }}
                      className="fixed 2xl:hidden z-[150] bottom-28 right-4 bg-white p-6 rounded-lg shadow-lg"
                      onClick={toggleIndicadores}
                    >
                      <h2 className="text-lg font-bold mb-4 text-[#252525] text-center">Indicadores</h2>
                      <div className="grid grid-cols-2 gap-4">
                      <span className="bg-yellow-500 text-white px-2 py-1 rounded-md ml-4">
                        Presencial
                      </span>
                      <span className="bg-green-600 text-white px-2 py-1 rounded-md ml-4">
                        Home Office
                      </span>
                      <span className="bg-[#FDFD96] text-black px-2 py-1 rounded-md ml-4">
                        Vacaciones
                      </span>
                      <span className="bg-[#d4b5e1] text-white px-2 py-1 rounded-md ml-4">
                        Permisos
                      </span>

                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

                <div className=" flex justify-center 2xl:hidden  mt-8 bg-white  mx-2 md:mx-8 rounded-xl">
                  <div className='w-fit place-items-center grid grid-cols-2 md:grid-cols-4 gap-4 justify-center py-2 '>

                    <Link
                      to={`/admin/colaboradores/horario-reporte/${id ?? ''}`}
                      className="text-center block w-fit h-fit bg-gray-400 hover:bg-main transition-colors cursor-pointer text-white px-2 py-1 rounded-md "
                    >
                      Reporte
                    </Link>
                    <Link
                      to={`/admin/colaboradores/horario-mensual/${id ?? ''}`}
                      className="text-center block w-fit h-fit bg-gray-400 hover:bg-main transition-colors cursor-pointer text-white px-2 py-1 rounded-md "
                    >
                      Horario
                    </Link>
                    <span
                      onClick={() => {
                        setVacaciones(!vacaciones)
                        setActiveDescription(false)
                        setOpenDiasFestivos(false)
                      }}
                      className={cn(
                        'text-center block w-fit h-fit bg-gray-400 hover:bg-main transition-colors cursor-pointer text-white px-2 py-1 rounded-md',
                        vacaciones ? 'bg-main' : ''
                      )}
                    >
                      Vacaciones
                    </span>
                    <span
                      onClick={() => {
                        setOpenDiasFestivos(!openDiasFestivos)
                        setActiveDescription(false)
                        setVacaciones(false)
                      }}
                      className={cn(
                        'text-center block w-fit h-fit bg-gray-400 hover:bg-main transition-colors cursor-pointer text-white px-2 py-1 rounded-md',
                        openDiasFestivos ? 'bg-main' : ''
                      )}
                    >
                      Dias festivos
                    </span>
                  </div>

                </div>
                <Vacaciones
                  setVacacionesEvents={setVacacionesEvents}
                  vacacionesEvents={vacacionesEvents}
                  setPermisos={setPermisos}
                  permisos={permisos}
                  recuperacion={recuperacion}
                  setrecuperacion={setrecuperacion}
                  setOpen={setVacaciones}
                  getHorarioLaboral={getHorarioLaboral}
                />
              </>
            </section>
          )}
        </>
      )}
    </>
  )
}
