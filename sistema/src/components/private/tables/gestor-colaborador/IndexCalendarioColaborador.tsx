import { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/es'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import {
  type usurioValues,
  type errorValues,
  type ValuesPreventaModificate,
  type ValuesPlanes
} from '../../../shared/schemas/Interfaces'
import { getDataToPlanes } from '../../../shared/FetchingData'
import { Loading } from '../../../shared/Loading'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { AnimatePresence } from 'framer-motion'
import { AlertSucess } from '../../../shared/alerts/AlertSucess'
import { Link, useParams } from 'react-router-dom'
import { IoCalendarOutline, IoPersonOutline } from 'react-icons/io5'
moment.locale('es')
const localizer = momentLocalizer(moment) // Importa el locale español

interface values {
  title: string
  start: Date
  end: Date
  client?: ValuesPreventaModificate
  user?: usurioValues
}

export const IndexCalendarioColaborador = (): JSX.Element => {
  const { idCol, nameCol } = useParams()
  const token = localStorage.getItem('token')
  const [, setplanes] = useState<ValuesPlanes[]>([])
  const [loading, setLoading] = useState(true)
  const [showError, setShowError] = useState<errorValues | null>(null)

  const [, setTotalRegistros2] = useState(0)
  const [events, setEvents] = useState<Event[]>([])
  const messages = {
    allDay: 'Todo el día',
    previous: 'Anterior',
    next: 'Siguiente',
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

  const getCitas = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getTareas/${idCol ?? ''}`, {
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

  const components = {
    event: (props: values) => {
      return (
        <Link
        to=''
        // to={`/admin/colaboradores/gestor_tareas/${idCol ?? ''}/${nameCol ?? ''}/${idCol ?? ''}/view/${producto.id}/image/${index}`}
        target='_blank'
          className="cursor-pointer h-full hover:text-black/40 w-full transition-colors outline-none duration-300 break-words flex "
          rel="noreferrer"
        >
          <div className="div_cita px-1 h-full text-white bg-[#579EB2]  transition-colors rounded-t-md">
            <span className="block lowercase first-letter:uppercase">{props.title}</span>
          </div>
        </Link>
      )
    }
  }

  useEffect(() => {
    Promise.all([
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
      <div className="flex gap-3 items-center border-b border-gray-300 h-[7vh] py-1 md:py-0 lg:h-[10vh] mx-1 md:px-8">
        <div className="w-12 md:w-14 h-full md:h-14 rounded-md bg-gradient-to-r from-cyan-500 to-blue-400 flex justify-center text-black text-base md:text-2xl items-center font-extrabold">
          {nameCol?.trim() !== '' ? nameCol?.charAt(0).toUpperCase() : ''}
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-black font-bold text-sm md:text-lg">
            Espacio de trabajo de {nameCol?.toUpperCase()}
          </h1>
          <div className="flex gap-2 justify-start">
            <span className="text-gray-600 text-sm">Logos Perú</span>
          </div>
        </div>
      </div>
      <section className="w-full h-[90vh] p-6 relative">
        <div className="absolute flex flex-col-reverse px-6 gap-2 md:gap-0 items-center md:flex-row justify-between">
          <div className="flex gap-10">
           <Link
              to={`/admin/colaboradores/gestor_tareas/${idCol ?? ''}/${nameCol ?? ''}`}
              className="flex items-center gap-3 text-base md:text-lg font-semibold text-black hover:text-cyan-700 transition-colors cursor-pointer"
            >
              <IoPersonOutline className="text-xl" /> Tus tableros
            </Link>
            <Link
              to=""
              className="flex items-center gap-3 text-base md:text-lg font-semibold text-cyan-700 transition-colors cursor-pointer"
            >
              <IoCalendarOutline className="text-xl" /> Calendario
            </Link>
          </div>
        </div>
        {loading
          ? <Loading />
          : (
          <>
            <div className="w-full h-full px-4">
              <Calendar
                className="calendario_tareas text-black"
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

        <AnimatePresence>
          {showError != null && <AlertSucess showError={showError} />}
        </AnimatePresence>
      </section>
    </>
  )
}
