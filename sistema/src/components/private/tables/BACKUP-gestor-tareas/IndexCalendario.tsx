/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/es'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {
  type errorValues,
  type ValuesPreventaModificate,
  type ValuesPlanes
} from '../../../shared/schemas/Interfaces'
import { getClientes, getDataToPlanes } from '../../../shared/FetchingData'
import { Loading } from '../../../shared/Loading'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import Swal from 'sweetalert2'
import { AnimatePresence } from 'framer-motion'
import { AlertSucess } from '../../../shared/alerts/AlertSucess'
import { Link } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import { ModalClientes } from '../citas/ModalClientes'
import { IoCalendarOutline, IoPersonOutline } from 'react-icons/io5'
import { GrNotification } from 'react-icons/gr'
import { RiFolderSharedLine } from 'react-icons/ri'
import { cn } from '../../../shared/cn'
import { TbCalendarUser } from 'react-icons/tb'
moment.locale('es')
const localizer = momentLocalizer(moment) // Importa el locale español

export const IndexCalendario = (): JSX.Element => {
  const token = localStorage.getItem('token')
  const [, setplanes] = useState<ValuesPlanes[]>([])
  const [loading, setLoading] = useState(true)
  const { auth, setOpenModalShared } = useAuth()
  const [clientes, setclientes] = useState<ValuesPreventaModificate[]>([])
  const [showError, setShowError] = useState<errorValues | null>(null)
  const [, setSelectedClient] = useState<ValuesPreventaModificate | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    start: Date
    end: Date
  } | null>(null)
  const [open, setOpen] = useState(false)
  const [, setTotalRegistros2] = useState(0)
  const [events, setEvents] = useState<Event[]>([])
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
    noEventsInRange: 'No tiene citas agendadas para este día.', // Nuevo mensaje
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    showMore: (total: any) => `+ Ver más (${total})`
  }

  const workDayStart = new Date() // Fecha de inicio para el día de trabajo
  workDayStart.setHours(9, 0, 0, 0)

  const workDayEnd = new Date() // Fecha de fin para el día de trabajo
  workDayEnd.setHours(19, 0, 0, 0)

  const handleClientSelection = (
    selectedClient: ValuesPreventaModificate
  ): void => {
    setSelectedClient(selectedClient)
    let title = window.prompt(
      `${selectedClient.nombres} ${selectedClient.apellidos}:`
    )
    // Si el usuario no ingresó un título, asigna un texto por defecto
    title = `${title ?? ''} - ${selectedClient.nombres} ${
      selectedClient.apellidos
    }`.toUpperCase() // Puedes cambiar esto por el texto que desees
    if (title && selectedTimeSlot) {
      setEvents((prevEvents) => {
        const updatedEvents = [
          ...prevEvents,
          {
            title,
            start: selectedTimeSlot.start,
            end: selectedTimeSlot.end,
            client: selectedClient,
            user: auth
          } as unknown as Event
        ]
        updateCita(updatedEvents)
        return updatedEvents
      })
    }
    setSelectedClient(null)
    setSelectedTimeSlot(null)
    setOpen(false)
  }

  const getCitas = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getTareas/${auth.id}`, {
      headers: {
        Authorization: `Bearer ${
          token !== null && token !== '' ? `Bearer ${token}` : ''
        }`
      }
    })
    if (request.data[0].gestor_tareas) {
      const parsedEvents = JSON.parse(request.data[0].gestor_tareas).map(
        (event: any) => ({
          ...event,
          start: moment(event.start).toDate(),
          end: moment(event.end).toDate()
        })
      )
      setEvents(parsedEvents)
    }
  }

  const calcularPorcentaje = (arrayList: any): string => {
    if (arrayList.length === 0) return '0' // Evitar dividir por cero si no hay elementos en la lista
    const countChecked = arrayList.filter((item: any) => item.check).length
    return ((countChecked / arrayList.length) * 100).toFixed(0)
  }

  const components = {
    event: (props: any) => {
      return (
        <Link
          to={`/admin/gestor-tareas/${auth.id}/view/${props?.event?.id ?? ''}/image/0`}
          target='_blank'
          className="cursor-pointer h-full flex flex-col gap-1 hover:text-black/40 w-full transition-colors outline-none duration-300 break-words  "
          rel="noreferrer"
        >
          {props?.event?.contenido?.map((item: any, index: number) => {
            let porcentajeGeneral: number | null = null
            let totalCheckedItems = 0

            item?.contenido?.map((item: any) => {
              const checklist = item.contexto?.checklist ?? []
              if (checklist.length > 0) {
                const porcentaje = calcularPorcentaje(checklist)
                // @ts-expect-error
                porcentajeGeneral += Number(porcentaje)
                totalCheckedItems++
              }
            })
            let resultadoFinal: number | null = null
            if (totalCheckedItems > 0) {
              // @ts-expect-error
              resultadoFinal = porcentajeGeneral / totalCheckedItems
            }

            return (
            // @ts-expect-error
            <div key={index} className={cn('div_cita px-1 h-full text-white transition-colors rounded-md', resultadoFinal == 100 ? 'bg-green-500' : resultadoFinal > 50 ? 'bg-yellow-500' : resultadoFinal != null ? 'bg-red-500' : 'bg-[#579EB2]')}
            >
                <span className="block lowercase first-letter:uppercase line-clamp-1">{item.titulo}</span>
            </div>
            )
          })}
        </Link>
      )
    }
  }

  const updateCita = async (updatedEvents: Event[]): Promise<void> => {
    const data = new FormData()
    data.append('contenido', JSON.stringify(updatedEvents))
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(`${Global.url}/updateCitas/1`, data, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })

      if (respuesta.data.status == 'success') {
        setShowError({
          estado: 'success',
          texto: 'Evento guardado'
        })
      } else {
        Swal.fire('Error al guardar', '', 'error')
      }
    } catch (error) {
      console.log(error)
      Swal.fire('Error', '', 'error')
    }
  }

  useEffect(() => {
    Promise.all([
      getClientes('getClientes', setclientes),
      getCitas(),
      getDataToPlanes('getPlanes', setplanes, setTotalRegistros2)
    ]).then(() => {
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    moment.updateLocale('es', null) // Limpiar configuraciones previas
    moment.locale('es', {
      months:
        'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split(
          '_'
        ),
      monthsShort: 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_'),
      weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split(
        '_'
      ),
      weekdaysShort: 'dom_lun_mar_mié_jue_vie_sáb'.split('_'),
      weekdaysMin: 'do_lu_ma_mi_ju_vi_sá'.split('_'),
      week: {
        dow: 1, // Monday is the first day of the week
        doy: 4 // The week that contains Jan 4th is the first week of the year
      }
    })
  }, [])

  useEffect(() => {
    setTimeout(() => {
      if (showError != null) {
        setShowError(null)
      }
    }, 3000)
  }, [showError])

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between gap-3 items-center border-b border-gray-300  py-1 md:py-0 lg:h-[10vh] mx-1 md:px-8">
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
        <div className='w-full flex lg:justify-end gap-3'>
            <div className='flex items-center gap-2 bg-white px-2 py-1 rounded-xl'>
                <span className='bg-red-500 w-4 h-4 lg:w-6 lg:h-6 block rounded-full'></span>
                <span className='flex text-black font-medium'> {'< 50%'} </span>
            </div>
            <div className='flex items-center gap-2  bg-white px-2 py-1 rounded-xl'>
                <span className='bg-yellow-500 w-4 h-4 lg:w-6 lg:h-6 block rounded-full'></span>
                <span className='flex text-black font-medium'> {'> 50%'} </span>
            </div>
            <div className='flex items-center gap-2  bg-white px-2 py-1 rounded-xl'>
                <span className='bg-green-500 w-4 h-4 lg:w-6 lg:h-6 block rounded-full'></span>
                <span className='flex text-black font-medium'> {'100%'} </span>
            </div>
        </div>
      </div>
      <section className="w-full h-[90vh] px-4 lg:p-6 relative">
        <div className="w-full flex flex-col-reverse gap-2 pl-6 py-3 lg:py-0 md:gap-0 items-center md:flex-row justify-between">
            <div className="flex gap-4 lg:gap-10">
              <Link to="/admin/gestor-tareas" className="flex items-center gap-3 text-black hover:text-cyan-700 text-base md:text-lg font-semibold cursor-pointer">
                <IoPersonOutline className="text-xl" /> <span className='hidden lg:block'>Tus tableros</span>
              </Link>
              <p
                className="flex items-center gap-3 text-base md:text-lg font-semibold text-cyan-700 transition-colors cursor-pointer"
              >
                <IoCalendarOutline className="text-xl" /> <span className='hidden lg:block'>Calendario</span>
              </p>
              <Link
                to="/admin/gestor-tareas/compartidos"
                className="flex items-center gap-3 text-base md:text-lg font-semibold text-black hover:text-cyan-700 transition-colors cursor-pointer"
              >
                <RiFolderSharedLine className="text-xl" /><span className='hidden lg:block'>Compartidos</span>
              </Link>
              <Link
                to="/admin/gestor-tareas/citas-reuniones"
                className="flex items-center gap-3 text-base md:text-lg font-semibold text-black hover:text-cyan-700 transition-colors cursor-pointer"
              >
                <TbCalendarUser className="text-xl" /> <span className='hidden lg:block'>Citas y Reuniones</span>
              </Link>
              <button
                type="button"
                onClick={() => {
                  setOpenModalShared(true)
                }}
                className="flex items-center gap-3 text-base md:text-lg font-semibold text-black hover:text-cyan-700 transition-colors cursor-pointer"
              >
                <GrNotification className="text-xl" /> <span className='hidden lg:block'>Notificaciones</span>
              </button>
            </div>
        </div>
        {loading
          ? <Loading />
          : (
          <>
            <div className="w-full h-full lg:px-6 mt-3">
              <Calendar
                className="calendario_tareas  text-black"
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                selectable={false}
                messages={messages}
                views={['day', 'week', 'month']}
                defaultView="month"
                min={workDayStart} // Establecer la hora de inicio del día
                max={workDayEnd}
                components={components} // Use the custom event renderer
              />
            </div>
          </>
            )}
        <ModalClientes
          clientes={clientes}
          open={open}
          setOpen={setOpen}
          handleClientSelection={handleClientSelection}
        />

        <AnimatePresence>
          {showError != null && <AlertSucess showError={showError} />}
        </AnimatePresence>
      </section>
    </>
  )
}
