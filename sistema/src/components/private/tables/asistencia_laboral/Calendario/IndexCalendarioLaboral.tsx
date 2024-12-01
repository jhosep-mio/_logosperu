/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/es'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { ViewHorario2 } from './ViewHorario2'
import { cn } from '../../../../shared/cn'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import { Loading } from '../../../../shared/Loading'
import { SlSizeFullscreen, SlSizeActual } from 'react-icons/sl'

moment.locale('es')

export const IndexCalendarioLaboral = (): JSX.Element => {
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(true)
  const [activeDescription, setActiveDescription] = useState(false)
  const [view, setView] = useState('month') // Estado para controlar la vista
  const getHorarioLaboral = async (): Promise<void> => {
    try {
      const request = await axios.get(`${Global.url}/allHorarioLaboral`, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })
      if (request.data.length > 0) {
        // Verificar si hay datos en la respuesta
        const eventosCombinados = request.data.reduce(
          (accumulator: any, usuario: any) => {
            const eventosUsuario = JSON.parse(usuario.horario_laboral)
            return accumulator.concat(eventosUsuario)
          },
          []
        )
        setEvents(eventosCombinados)
      } else {
        console.log('No se encontraron registros de horario laboral')
      }
    } catch (error) {
      console.error('Error al obtener el horario laboral:', error)
    } finally {
      setLoading(false)
    }
  }
  const localizer = momentLocalizer(moment)

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
  const [events, setEvents] = useState<Event[]>([])
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
          className="cursor-pointer overflow-hidden relative rounded-md h-full hover:text-black/40 w-fit transition-colors outline-none duration-300 break-words flex "
          rel="noreferrer"
          onClick={() => {
            setOpen({ estado: true, evento: props })
          }}
        >
          <span
            className={cn(
              'absolute top-0 w-[200%] h-[200%] block bg-red-800 z-[1]',
              props.event.modalidad == 'Presencial'
                ? 'bg-yellow-500'
                : props.event.modalidad == 'Home office'
                  ? 'bg-green-600'
                  : 'bg-[#54A9DC]'
            )}
          ></span>
          <div
            className={cn(
              'div_cita px-1 z-[1] h-full text-white transition-colors rounded-t-md bg-transparent'
            )}
          >
            <span
              className="block lowercase first-letter:uppercase text-[12px] md:text-sm"
              onClick={() => {
                setActiveDescription(true)
              }}
            >
              <p className="hidden md:block">{props.title}</p>
              <p className="block md:hidden">{onlyName(props.title)}</p>
            </span>
          </div>
        </div>
      )
    }
  }

  const handleDrillDown = (date: any): void => {
    setSelectedDate(date)
    setView('day')
  }

  const handleViewChange = (newView: any): void => {
    setView(newView)
  }

  return (
    <>
      <section className="flex gap-1 items-center justify-between bg-white border-b border-gray-300 h-[7%] py-1 md:py-0 lg:h-[8%] px-1 md:px-8">
        <div className="flex gap-0 md:gap-3 items-center w-fit">
          <div className="w-10 h-10 md:w-12  md:h-12 rounded-md bg-gradient-to-r from-[#54A9DC] to-[#2989c4] flex justify-center text-white text-base md:text-2xl items-center font-extrabold">
            H
          </div>
          <div className="hidden md:flex md:min-w-[200px] flex-col justify-center">
            <h1 className="text-[#252525] font-bold text-[12px] md:text-lg">
              HORARIO LABORAL
            </h1>
            <div className="flex gap-2 justify-start">
              <span className="hidden md:block text-gray-700 font-medium text-sm">
                Logos Perú
              </span>
            </div>
          </div>
          <div className="w-3/4 flex flex-col md:flex-row gap-[2px] md:gap-0">
            <span className="inline-block text-center h-fit bg-yellow-500 text-white px-2 py-0 md:py-1 rounded-md ml-4 text-sm md:text-base">
              Presencial
            </span>
            <span className="inline-block text-center h-fit bg-green-600 text-white px-2 py-0 md:py-1 rounded-md ml-4 text-sm md:text-base">
              Home Office
            </span>
          </div>
        </div>
        <div className="flex gap-2 md:gap-6 justify-end">
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
      ) : (
        <section className=" w-full h-[90%] relative">
          <Calendar
            className={`calendario_cm2 text-black calendario_horario_laboral ${
              activeDescription ? 'activeDescription' : ''
            } ${fullView ? 'fullCalendar' : ''}`}
            localizer={localizer}
            events={events}
            startAccessor={(event: any) => {
              return new Date(event.start)
            }}
            endAccessor="end"
            selectable
            messages={messages}
            views={['day', 'month', 'agenda']}
            view={view}
            defaultView="month"
            date={selectedDate}
            components={components}
            onDrillDown={handleDrillDown}
            onView={handleViewChange} // Cambia la vista
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
            setOpen={setOpen}
            activeDescription={activeDescription}
            setActiveDescription={setActiveDescription}
            fullScreen={fullView}
          />
        </section>
      )}
    </>
  )
}
