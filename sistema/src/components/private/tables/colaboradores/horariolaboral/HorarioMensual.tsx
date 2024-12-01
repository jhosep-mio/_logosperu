/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/es'
import { useState, useEffect } from 'react'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { v4 as uuidv4 } from 'uuid'
import { Link, useParams } from 'react-router-dom'
import { cn } from '../../../../shared/cn'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import { toast } from 'sonner'
import { Loading } from '../../../../shared/Loading'

export const HorarioMensual = (): JSX.Element => {
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
    noEventsInRange: 'No tiene eventos.', // Nuevo mensaje
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    showMore: (total: any) => `+ Ver más (${total})`
  }
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')
  const { id } = useParams()
  const localizer = momentLocalizer(moment)
  const [selectedDate, setSelectedDate] = useState<Date | null>()

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
        const horario = JSON.parse(request.data.horario_mensual) ? JSON.parse(request.data.horario_mensual) : []

        const parsedEvents = horario.map((event: any) => ({
          ...event,
          start: new Date(event.start),
          end: new Date(event.end)
        }))
        setEvents(parsedEvents)
      }
    } catch (error) {
      console.error('Error al obtener el horario laboral:', error)
    } finally {
      setLoading(false)
    }
  }

  const updatefestivos = async (updatedEvents: Event[]): Promise<void> => {
    const data = new FormData()
    data.append('horario_mensual', JSON.stringify(updatedEvents))
    data.append('_method', 'PUT')
    try {
      const request = await axios.post(`${Global.url}/updateHorarioMensual/${id ?? ''}`, data, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })
      if (request.data.status == 'success') {
        toast.success('Horario actualizado')
        getHorarioLaboral()
      }
    } catch (error) {
      toast.errror('error al guardar')
    }
  }

  const handleSelectSlot = ({
    start,
    end
  }: {
    start: Date
    end: Date
  }): void => {
    const newEvent = {
      id: uuidv4(),
      user: { id },
      title: 'Horas de trabajo',
      timeRanges: null,
      start,
      end
    }
    // Verificar superposición de eventos
    // Verificar superposición de eventos
    const overlappingEvent = events.some(
      (event: any) =>
        (start >= event.start && start < event.end) || // Superposición por inicio
        (end > event.start && end <= event.end) || // Superposición por fin
        (start <= event.start && end >= event.end) // Evento completamente superpuesto
    )
    if (overlappingEvent) {
      alert('Ya existe un evento registrado en este período de tiempo.')
      return
    }
    const confirmSave = window.confirm(
      '¿Deseas guardar este registro de horas de trabajo?'
    )
    if (confirmSave) {
      const updatedEvents: any = [...events, newEvent]
      updatefestivos(updatedEvents)
    }
  }

  const handleDeleteEvent = (eventId: any): void => {
    const updatedEvents = events.filter((event: any) => event.id != eventId.event.id)
    setEvents(updatedEvents)
  }

  useEffect(() => {
    getHorarioLaboral()
    const currentMonthStart = moment().startOf('month')
    const secondWeekStart = moment(currentMonthStart).add(7, 'days')
    setSelectedDate(secondWeekStart.toDate())
  }, [])

  const formatDate = (): any => {
    return selectedDate ? moment(selectedDate).format('YYYY-MM') : ''
  }

  const components = {
    toolbar: () => null, // Oculta la barra de herramientas
    event: (props: any) => {
      return (
        <div
          className="cursor-pointer w-full group  overflow-hidden relative rounded-md h-full hover:text-black/40 transition-colors outline-none duration-300 break-words flex "
          rel="noreferrer"
        >
          <div
            className={cn(
              'div_cita px-1 z-[1] h-full w-full text-white transition-colors rounded-t-md bg-transparent'
            )}
          >
            <span className="block lowercase first-letter:uppercase text-[12px] md:text-sm font-bold">
              <p className={cn('hidden md:block text-center w-fulltext-white')}>
                {props.title}
              </p>
              <p className="block md:hidden w-full text-center font-bold ">
                {props.title}
              </p>
            </span>
            <button onClick={() => { handleDeleteEvent(props) }} className="text-red-500 mt-4 font-bold opacity-0 group-hover:opacity-100 transition-opacity">Eliminar</button>
          </div>
        </div>
      )
    }
  }

  const handleDateChange = (e: any): void => {
    const { value } = e.target
    const [year, month] = value.split('-').map(Number)
    if (year > 2023) {
      const firstDayOfMonth = moment(`${year}-${month}-01`).toDate()
      const startDayOfWeek = firstDayOfMonth.getDay()
      const startDate = moment(firstDayOfMonth)
        .add(8 - startDayOfWeek, 'days')
        .toDate()
      setSelectedDate(startDate)
    }
  }
  const dayFormat = (date: Date): string => {
    return moment(date).format('dddd') // Solo mostrar el nombre del día
  }
  const formats = {
    dayFormat // Usar la función dayFormat para mostrar solo el nombre del día
  }
  const formattedMonth = moment(selectedDate).format('MMMM')

  return (
    <>
      <section className="flex items-center justify-between bg-white border-b border-gray-300 h-[7%] py-1 md:py-0 lg:h-[8%]  md:px-8">
        <div className="flex gap-3 items-center ">
          <div className="w-10 md:w-12 h-full md:h-12 rounded-md bg-gradient-to-r from-[#54A9DC] to-[#2989c4] flex justify-center text-white text-base md:text-2xl items-center font-extrabold">
            H
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-[#252525] font-bold text-[12px] md:text-lg">
              HORARIO MENSUAL - {formattedMonth.toUpperCase()}
            </h1>
            <div className="flex gap-2 justify-start">
              <span className="hidden md:block text-gray-700 font-medium text-sm">
                Logos Perú
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 justify-end">
          <Link
            to={`/admin/colaboradores/horario-laboral/${id ?? ''}`}
            className="bg-gray-400 hover:bg-main transition-colors cursor-pointer text-white px-2 py-1 rounded-md "
          >
            Horario Laboral
          </Link>
          <input
            type="month"
            value={formatDate()}
            onChange={handleDateChange}
            className="bg-transparent text-black"
            min="2023-01"
            max="2030-12"
          />
        </div>
      </section>

      {loading ? (
        <Loading />
      )
        : <section className=" w-full h-[92%] relative ">
        <Calendar
          className="calendario_cmMensual text-black "
          localizer={localizer}
          events={events}
          endAccessor="end"
          selectable
          components={components}
          formats={formats} // Aplicar el formato personalizado para mostrar solo el nombre del día
          date={selectedDate}
          messages={messages}
          views={['week']}
          defaultView="week"
          onSelectSlot={handleSelectSlot}
        ></Calendar>
      </section>}
    </>
  )
}
