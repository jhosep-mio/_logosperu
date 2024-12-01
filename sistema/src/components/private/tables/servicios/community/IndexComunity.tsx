/* eslint-disable @typescript-eslint/ban-ts-comment */
import { motion } from 'framer-motion'
import { cn } from '../../../../shared/cn'
import { useState, type Dispatch, type SetStateAction } from 'react'
import { IndexCalendarioCm } from './IndexCalendarioCm'
import { TiDelete } from 'react-icons/ti'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/es'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { v4 as uuidv4 } from 'uuid'
import { Global } from '../../../../../helper/Global'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'

interface Card {
  id: number
  title: string
}

interface values {
  nombres: string
  email: string
  correo: string
  celular: string
  fecha: string
  hora_acta: string
  nombre_marca: string
  archivos: string
  id_contrato: string
  fecha_fin: string
  fecha_inicio: string
  observaciones: string
  comunnity: string
}

moment.locale('es')
const localizer = momentLocalizer(moment) // Importa el locale español

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

export const IndexComunity = ({
  cards,
  datos,
  getOneBrief,
  events,
  setEvents,
  brief,
  diferenciaDias,
  communityActivo
}: {
  cards: Card[]
  datos: values
  getOneBrief: () => Promise<void>
  events: Event[]
  setEvents: Dispatch<SetStateAction<Event[]>>
  brief: any | null
  diferenciaDias: any
  communityActivo: any
}): JSX.Element => {
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const [selected, setSelected] = useState<Card | null>(null)
  const [lastSelected, setLastSelected] = useState<Card | null>(null)
  const handleClick = (card: Card): void => {
    setLastSelected(selected)
    setSelected(card)
  }
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
  const workDayStart = new Date() // Fecha de inicio para el día de trabajo
  workDayStart.setHours(9, 0, 0, 0)
  const workDayEnd = new Date() // Fecha de fin para el día de trabajo
  workDayEnd.setHours(19, 0, 0, 0)
  const handleOutsideClick = (): void => {
    setLastSelected(null)
    setSelected(null)
  }

  const components = {
    event: (props: any) => {
      const fechaActual = new Date()
      // Obtener la fecha de vencimiento de props.event
      const fechaVencimiento = new Date(props.event?.fecha_vencimiento)
      return (
        <>
          {props.event?.tipo == 'inicio'
            ? (
            <div
              className="cursor-pointer h-full hover:text-black/40 w-full transition-colors outline-none duration-300 break-words flex "
              rel="noreferrer"
            >
              <div
                className={'div_cita px-1 h-full text-white bg-green-600 transition-colors rounded-t-md'}
              >
                <span className="block text-center">{props.title}</span>
              </div>
            </div>
              )
            : props.event?.tipo == 'solicitud_informacion'
              ? (
            <div
              className="cursor-pointer h-full hover:text-black/40 w-full transition-colors outline-none duration-300 break-words flex "
              rel="noreferrer"
            >
              <div
                className={'div_cita px-1 h-full text-white bg-gray-400 transition-colors rounded-t-md'}
              >
                <span className="block text-center">{props.title}</span>
              </div>
            </div>
                )
              : (
            <div
              className="cursor-pointer h-full hover:text-black/40 w-full transition-colors outline-none duration-300 break-words flex "
              rel="noreferrer"
            >
              <div
                className={`div_cita px-1 h-full text-white 
            ${
                props.event?.publicado || fechaVencimiento < fechaActual ? 'bg-[#129990]' : 'bg-red-600'
            }   transition-colors rounded-t-md`}
              >
                <span className="block  ">{props.title}</span>
              </div>
            </div>
                )}
        </>
      )
    }
  }

  const updateCita = async (updatedEvents: Event[]): Promise<void> => {
    const data = new FormData()
    data.append('community', JSON.stringify(updatedEvents))
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/updateCalendarioComunnityVentas/${id ?? ''}`,
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
        toast.success('Calendario creado')
        getOneBrief()
      } else {
        toast.error('Error al crear')
      }
    } catch (error) {
      console.log(error)
      toast.error('Error al crear')
    }
  }

  const handleCreateEvent = async (): Promise<void> => {
    const parsedDate = moment(datos?.fecha_inicio, 'DD/MM/YYYY').toDate()
    let currentDate = moment()
    if (currentDate.day() === 5) {
      currentDate = currentDate.add(2, 'days') // Agregar dos días para evitar domingo
    } else if (currentDate.day() === 6) {
      currentDate = currentDate.add(1, 'days') // Agregar un día para evitar domingo
    }
    currentDate = currentDate.add(2, 'days')
    currentDate = currentDate.startOf('day').add(12, 'hours')

    const newEvent = {
      title: 'INICIO DE CM',
      start: moment(parsedDate, 'DD/MM/YYYY').toDate(),
      end: moment(parsedDate, 'DD/MM/YYYY').toDate(),
      tipo: 'inicio'
    }

    const newSolicitudEvento = {
      id: uuidv4(),
      title: 'LLENADO DE BRIEF',
      fecha_vencimiento: currentDate.toDate(),
      start: parsedDate,
      end: parsedDate,
      tipo: 'solicitud_informacion'
    }
    const updatedEvents = [...events, newEvent, newSolicitudEvento]
    // @ts-expect-error
    setEvents(updatedEvents)
    // @ts-expect-error
    await updateCita(updatedEvents)
  }

  return (
    <div className="w-full h-full ">
      {cards.map((card, i) => (
        <div key={i} className='w-full h-full'>
          <motion.div
            onClick={() => {
              if (events.length > 0) {
                handleClick(card)
              }
            }}
            className={cn(
              'relative overflow-hidden',
              selected?.id === card.id
                ? 'rounded-lg cursor-pointer fixed inset-0 w-[97%] h-[97%] lg:w-[90%] lg:h-[90%] m-auto z-[120] flex justify-center items-center flex-wrap flex-col'
                : lastSelected?.id === card.id
                  ? 'z-40 bg-white rounded-xl h-full w-full'
                  : 'bg-white rounded-xl h-full w-full'
            )}
            layout
          >
            {selected?.id === card.id && (
              <SelectedCard
                selected={selected}
                datos={datos}
                getOneBrief={getOneBrief}
                events={events}
                setEvents={setEvents}
                brief={brief}
                diferenciaDias={diferenciaDias}
                communityActivo={communityActivo}
              />
            )}
            <section className="w-full h-full relative cursor-pointer">
              <>
                {events.length > 0
                  ? <div className="w-full h-full ">
                  <Calendar
                    className="calendario_cm text-black"
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    selectable={false}
                    messages={messages}
                    views={['month']}
                    defaultView="month"
                    min={workDayStart} // Establecer la hora de inicio del día
                    max={workDayEnd}
                    components={components} // Use the custom event renderer
                  />
                </div>
                  : <div className='w-full p-6 text-gray-600 flex flex-col justify-center items-center h-full'>
                  <p className='w-full text-center'>Este proyecto no cuenta con un calendario</p>
                  <button className='w-fit px-4 py-2 bg-green-600 rounded-md mx-auto mt-6 text-white hover:bg-green-700'
                  type='button'
                  onClick={() => { handleCreateEvent() }}
                  >Crear calendario</button>
              </div>
                }
              </>
            </section>
          </motion.div>
        </div>
      ))}
      <motion.div
        onClick={handleOutsideClick}
        className={cn(
          'fixed h-full w-full inset-0 bg-black opacity-0 z-[100]',
          selected?.id ? 'pointer-events-auto' : 'pointer-events-none'
        )}
        animate={{ opacity: selected?.id ? 1 : 0 }}
      >
        <TiDelete
          onClick={handleOutsideClick}
          className="fixed top-4 right-4 text-4xl text-white cursor-pointer"
        />
      </motion.div>
    </div>
  )
}

const SelectedCard = ({
  selected,
  datos,
  getOneBrief,
  events,
  setEvents,
  brief,
  diferenciaDias,
  communityActivo
}: {
  selected: Card | null
  datos: values
  getOneBrief: () => Promise<void>
  events: Event[]
  setEvents: Dispatch<SetStateAction<Event[]>>
  brief: any | null
  diferenciaDias: any
  communityActivo: any
}): JSX.Element => {
  return (
    <div
      className="relative w-full h-full z-[9999] bg-white"
      key={selected?.id}
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 100
        }}
        animate={{
          opacity: 1,
          y: 0
        }}
        transition={{
          duration: 0.3,
          ease: 'easeInOut'
        }}
        className="relative w-full h-full"
      >
        <IndexCalendarioCm datos={datos} getOneBrief={getOneBrief} events={events} setEvents={setEvents} brief={brief} diferenciasDias={diferenciaDias} communityActivo={communityActivo}/>
      </motion.div>
    </div>
  )
}
