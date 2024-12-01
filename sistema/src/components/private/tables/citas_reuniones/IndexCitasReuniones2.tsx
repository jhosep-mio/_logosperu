/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable multiline-ternary */
import { Calendar, momentLocalizer } from 'react-big-calendar'
import {
  calendario,
  calendariohoy,
  calendarioReunion,
  mes,
  programacion,
  semana,
  sietedias
} from '../../../shared/Images'
import { useState, useEffect } from 'react'
import moment from 'moment'
import 'moment/locale/es'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { ModalCita } from './modals/ModalCita'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { Loading } from '../../../shared/Loading'
import useAuth from '../../../../hooks/useAuth'
import { cn } from '../../../shared/cn'
import { ModalCitaView } from './modals/ModalCitaView'
import { ModalCitaVistaExterna } from './modals/ModalCitaVistaExterna'
import { IoCalendarOutline, IoPersonOutline } from 'react-icons/io5'
import { Link, useParams } from 'react-router-dom'
import { RiFolderSharedLine } from 'react-icons/ri'
import { TbCalendarUser } from 'react-icons/tb'
import { GrNotification } from 'react-icons/gr'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'

export const IndexCitasReuniones2 = (): JSX.Element => {
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState('month')
  const [date, setDate] = useState(new Date())
  const [openCita, setOpenCita] = useState(false)
  const [openVistaPrevia, setOpenVistaPrevia] = useState({ estado: false, evento: null })
  const [openView, setOpenView] = useState({ estado: false, evento: null })
  const [tipo, setTipo] = useState('')
  const localizer = momentLocalizer(moment)
  const [events, setEvents] = useState<Event[]>([])
  const token = localStorage.getItem('token')
  const { auth } = useAuth()
  const [usuarios, setUsuarios] = useState<never[]>([])
  const { id } = useParams()

  const getUsuarios = async (): Promise<void> => {
    setLoading(true)
    try {
      const request = await axios.get(`${Global.url}/getUsuarios`, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })
      const request2 = await axios.get(
        `${Global.url}/getCalendarCitas/${auth.id ?? ''}`,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      if (request2.data && request2.data.length > 0) {
        const citas = request2.data.map((cita: any) => {
          // Asegúrate de que hora_inicio.dateinicio y hora_final.datefinal sean parseados correctamente
          const startDate = moment(
            JSON.parse(cita.hora_inicio).dateinicio,
            'YYYY-MM-DD'
          ).toDate()
          const endDate = moment(
            JSON.parse(cita.hora_final).datefinal,
            'YYYY-MM-DD'
          ).toDate()
          return {
            id: cita.id,
            user_id: cita.user_id,
            title: cita.asunto,
            start: startDate,
            end: endDate,
            estado: cita.estado,
            tipo: cita.tipo,
            miembros: cita.miembros,
            orden: cita
          }
        })
        setEvents(citas)
        if (id) {
          const reunion = citas.find((cita: any) => cita.id == id)
          const arrray = {
            title: reunion.title,
            event: reunion
          }
          // @ts-expect-error
          setOpenVistaPrevia({ estado: true, evento: arrray })
        }
      }
      setUsuarios(request.data)
    } catch (error) {
      console.error(error)
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
    showMore: (total: any) => `+ Ver más (${total})`
  }

  const handleNextWeek = (): void => {
    setDate(moment(date).add(1, 'week').toDate())
    setView('week')
  }

  useEffect(() => {
    getUsuarios()
  }, [id])

  const getFormattedStartTime = (horaInicio: string): string => {
    try {
      const inicioObj = JSON.parse(horaInicio)
      if (inicioObj && inicioObj.timeinicio) {
        return inicioObj.timeinicio
      }
    } catch (error) {
      console.error('Error al analizar JSON:', error)
    }
    return '' // En caso de error o si no se encuentra la hora de inicio
  }

  const getNameById = (searchId: number): string | undefined => {
    try {
      const foundObj: any = usuarios.find((obj: any) => obj.id == searchId)
      if (foundObj) {
        return foundObj.name
      }
    } catch (error) {
      console.error('Error al analizar JSON:', error)
    }
    return undefined // Retornar undefined si no se encuentra el id en el arreglo
  }

  const components = {
    event: (props: any) => {
      return (
        <div
          className="cursor-pointer overflow-hidden relative rounded-sm h-full hover:text-black/40 w-full transition-colors outline-none duration-300 break-words flex "
          rel="noreferrer"
          onClick={() => {
            console.log(props)
            if (props?.event?.user_id == auth.id) {
              setOpenView({ estado: true, evento: props })
            } else {
              setOpenVistaPrevia({ estado: true, evento: props })
            }
          }}
        >
          <span className="absolute top-0 w-[200%] h-[200%] block bg-[#0072C6] z-[1]"></span>
          <div
            className={cn(
              'div_cita  z-[1] h-full flex  text-white transition-colors rounded-t-md bg-transparent'
            )}
          >
            <span
              className={cn(
                'block w-[7px] h-auto',
                props.event.estado == 'Ocupado'
                  ? 'bg-red-500'
                  : props.event.estado == 'Home office'
                    ? 'bg-yellow-500'
                    : props.event.estado == 'Disponible'
                      ? 'bg-green-500'
                      : props.event.estado == 'Provisional'
                        ? 'bg-gray-500'
                        : props.event.estado == 'Fuera de la oficina'
                          ? 'bg-cyan-500'
                          : ''
              )}
            ></span>
            <div className="pl-[6px] flex flex-col gap-0 text-[12px] md:text-sm">
                <div className='flex gap-1 text-[12px] md:text-sm'>
                    <p className="hidden md:block">
                        {getFormattedStartTime(props?.event?.orden?.hora_inicio)}
                    </p>
                    <span className="lowercase first-letter:uppercase ">
                        {props.title}
                    </span>
                </div>
                {props?.event?.user_id != auth.id &&
                   <p className='text-xs text-gray-200'>{getNameById(props?.event?.user_id)}</p>
                }
            </div>
          </div>
        </div>
      )
    }
  }
  const fechaActual = new Date()

  return (
    <section className="w-full flex flex-col h-full">

      <div className="flex flex-col lg:flex-row justify-between gap-3 items-center border-b border-gray-300  py-1 md:py-0 lg:min-h-[10vh] mx-1 md:px-8">
        <div className='w-full flex gap-3 items-center'>
            <div className="w-12 md:w-14 h-10 md:h-14 rounded-md bg-gradient-to-r from-cyan-500 to-blue-400 flex justify-center text-black text-base md:text-2xl items-center font-extrabold">
            {auth.name.trim() !== '' ? auth.name.charAt(0).toUpperCase() : ''}
            </div>
            <div className="flex flex-col justify-center">
            <h1 className="text-black font-bold text-sm md:text-lg">
                Espacio de trabajo de {auth.name.toUpperCase()}
            </h1>
            <div className="flex gap-2 justify-start">
                <span className="text-gray-600 text-sm">Logos Perú</span>
            </div>
            </div>
        </div>
      </div>
      <section className="w-full h-[90vh] px-4 lg:px-6 relative">
        <div className="md:px-6 pt-6 flex flex-col">
            <div className="flex flex-col-reverse gap-2 md:gap-0 items-center md:flex-row justify-between">
                    <div className="flex gap-4 lg:gap-10">
                    <Link
                    to='/admin/gestor-tareas'
                    className="flex items-center gap-3 text-base md:text-lg font-semibold text-black hover:text-cyan-700 cursor-pointer">
                        <IoPersonOutline className="text-xl" /> <span className='hidden lg:block'>Tus tableros</span>
                    </Link>
                    <Link
                        to="/admin/gestor-tareas/calendario"
                        className="flex items-center gap-3 text-base md:text-lg font-semibold text-black hover:text-cyan-700 transition-colors cursor-pointer"
                    >
                        <IoCalendarOutline className="text-xl" /> <span className='hidden lg:block'>Calendario</span>
                    </Link>
                    <Link
                        to="/admin/gestor-tareas/compartidos"
                        className="flex items-center gap-3 text-base md:text-lg font-semibold text-black hover:text-cyan-700 transition-colors cursor-pointer"
                    >
                        <RiFolderSharedLine className="text-xl" /> <span className='hidden lg:block'>Compartidos</span>
                    </Link>
                    <p
                        className="flex items-center gap-3 text-base md:text-lg font-semibold text-cyan-700 transition-colors cursor-pointer"
                    >
                        <TbCalendarUser className="text-xl" /> <span className='hidden lg:block'>Citas y Reuniones</span>
                    </p>
                    <button
                        type="button"
                        // onClick={() => {
                        //   setOpenModalShared(true)
                        // }}
                        className="flex items-center gap-3 text-base md:text-lg font-semibold text-black hover:text-cyan-700 transition-colors cursor-pointer"
                    >
                        <GrNotification className="text-xl" /> <span className='hidden lg:block'>Notificaciones</span>
                    </button>
                    </div>
                    <p className="text-mds first-letter:uppercase md:text-lg font-semibold text-gray-400 transition-colors cursor-pointer">
                    {format(fechaActual, 'MMMM-yyyy', { locale: es })}
                    </p>
            </div>
            <div className="flex items-center w-full mt-3 bg-white shadow h-[90px] z-[2] rounded-t-md">
                <div className="flex items-center border-r border-gray-200 ">
                <button
                    onClick={() => {
                      setOpenCita(true)
                      setTipo('cita')
                    }}
                    className="flex text-black flex-col items-center gap-1 px-2 py-1 hover:bg-gray-200  transition-colors"
                >
                    <img src={calendario} alt="" className="w-[35px] object-contain" />
                    <div className="flex flex-col gap-0 text-sm">
                    <span className="text-md leading-5">Nueva</span>
                    <span className="text-md leading-5">cita</span>
                    </div>
                </button>
                <button
                    onClick={() => {
                      setOpenCita(true)
                      setTipo('reunion')
                    }}
                    className="flex text-black flex-col items-center gap-1 px-2 py-1 hover:bg-gray-200  transition-colors"
                >
                    <img
                    src={calendarioReunion}
                    alt=""
                    className="w-[35px] object-contain"
                    />
                    <div className="flex flex-col gap-0 text-sm">
                    <span className="text-md leading-5">Nueva</span>
                    <span className="text-md leading-5">reunión</span>
                    </div>
                </button>
                </div>
                <div className="flex items-center border-r border-gray-200 ">
                <button
                    onClick={() => {
                      setView('day')
                    }}
                    className="flex h-full text-black flex-col items-center gap-1 px-2 py-1 hover:bg-gray-200  transition-colors"
                >
                    <img
                    src={calendariohoy}
                    alt=""
                    className="w-[35px] h-[32.5px] object-contain"
                    />
                    <div className="flex h-full flex-col gap-0 text-sm">
                    <span className="text-md leading-5">Hoy</span>
                    <span className="text-md leading-5 text-white">.</span>
                    </div>
                </button>
                <button
                    onClick={handleNextWeek}
                    className="flex h-full text-black flex-col items-center gap-1 px-2 py-1 hover:bg-gray-200  transition-colors"
                >
                    <img
                    src={sietedias}
                    alt=""
                    className="w-[35px] h-[32.5px] object-contain"
                    />
                    <div className="flex h-full flex-col gap-0 text-sm">
                    <span className="text-md leading-5">Siguientes</span>
                    <span className="text-md leading-5">7 dias</span>
                    </div>
                </button>
                </div>
                <div className="flex items-center border-r border-gray-200 ">
                <button
                    onClick={() => {
                      setView('week')
                    }}
                    className="flex h-full text-black flex-col items-center gap-1 px-2 py-1 hover:bg-gray-200  transition-colors"
                >
                    <img
                    src={semana}
                    alt=""
                    className="w-[35px] h-[32.5px] object-contain"
                    />
                    <div className="flex h-full flex-col gap-0 text-sm">
                    <span className="text-md leading-5">Semana</span>
                    <span className="text-md leading-5 text-white">.</span>
                    </div>
                </button>
                <button
                    onClick={() => {
                      setView('month')
                    }}
                    className="flex h-full text-black flex-col items-center gap-1 px-2 py-1 hover:bg-gray-200  transition-colors"
                >
                    <img
                    src={mes}
                    alt=""
                    className="w-[35px] h-[32.5px] object-contain"
                    />
                    <div className="flex h-full flex-col gap-0 text-sm">
                    <span className="text-md leading-5">Mes</span>
                    <span className="text-md leading-5 text-white">.</span>
                    </div>
                </button>
                <button
                    onClick={() => {
                      setView('agenda')
                    }}
                    className="flex h-full text-black flex-col items-center gap-1 px-2 py-1 hover:bg-gray-200  transition-colors"
                >
                    <img
                    src={programacion}
                    alt=""
                    className="w-[35px] h-[32.5px] object-contain"
                    />
                    <div className="flex h-full flex-col gap-0 text-sm">
                    <span className="text-md leading-5">Agenda</span>
                    <span className="text-md leading-5 text-white">.</span>
                    </div>
                </button>
                </div>
            </div>
        </div>
        <div className="w-full h-full relative px-6">
            {/* <input
            className=" absolute top-4 right-3 rounded-md w-[300px] text-black outline-none border-2 px-2 border-gray-300"
            placeholder="Buscar en calendario"
            /> */}
            {loading ? (
            <Loading />
            ) : (
            <Calendar
                className={'text-black calendario_citas'}
                localizer={localizer}
                events={events}
                startAccessor={(event: any) => {
                  return new Date(event.start)
                }}
                endAccessor="end"
                selectable
                messages={messages}
                views={['day', 'week', 'month', 'agenda']}
                view={view}
                onView={(newView: any) => {
                  setView(newView)
                }}
                date={date}
                defaultView="month"
                components={components}
                //   components={components}
                //   onSelectSlot={handleSelectSlot}
            ></Calendar>
            )}
        </div>
      </section>

      <ModalCita
        open={openCita}
        setOpen={setOpenCita}
        getUsuarios={getUsuarios}
        tipoInitial={tipo}
        usuarios={usuarios}
      />
      <ModalCitaView
        open={openView}
        setOpen={setOpenView}
        getUsuarios={getUsuarios}
        usuarios={usuarios}
      />
      <ModalCitaVistaExterna
        open={openVistaPrevia}
        setOpen={setOpenVistaPrevia}
        getUsuarios={getUsuarios}
        usuarios={usuarios}
      />
    </section>
  )
}
