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
import { getClientes, getDataToPlanes } from '../../../shared/FetchingData'
import { Loading } from '../../../shared/Loading'
import { ModalClientes } from './ModalClientes'
import { ModalOpciones } from './modal/ModalOpciones'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import Swal from 'sweetalert2'
import { AnimatePresence } from 'framer-motion'
import { AlertSucess } from '../../../shared/alerts/AlertSucess'
import { BsArrowLeftSquareFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
moment.locale('es')
const localizer = momentLocalizer(moment) // Importa el locale español

interface values {
  title: string
  start: Date
  end: Date
  client?: ValuesPreventaModificate
  user?: usurioValues
}

export const GestordeCitas = (): JSX.Element => {
  const token = localStorage.getItem('token')
  const [planes, setplanes] = useState<ValuesPlanes[]>([])
  const [loading, setLoading] = useState(true)
  const { auth } = useAuth()
  const [clientes, setclientes] = useState<ValuesPreventaModificate[]>([])
  const [eventoSelected, setEventoSelected] = useState<any | []>([])
  const [showError, setShowError] = useState<errorValues | null>(null)
  const [, setSelectedClient] = useState<ValuesPreventaModificate | null>(null)
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<{
    start: Date
    end: Date
  } | null>(null)
  const [open, setOpen] = useState(false)
  const [, setTotalRegistros2] = useState(0)
  const [open2, setOpen2] = useState(false)
  const [open3, setOpen3] = useState(false)
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
    const request = await axios.get(`${Global.url}/getCita/1`, {
      headers: {
        Authorization: `Bearer ${
          token !== null && token !== '' ? `Bearer ${token}` : ''
        }`
      }
    })
    if (request.data.contenido) {
      const parsedEvents = JSON.parse(request.data.contenido).map(
        (event: any) => ({
          ...event,
          start: moment(event.start).toDate(),
          end: moment(event.end).toDate()
        })
      )
      setEvents(parsedEvents)
    }
  }

  const openClientModal = (timeSlot: { start: Date, end: Date }): void => {
    setOpen(true)
    setSelectedTimeSlot(timeSlot)
  }

  const components = {
    event: (props: values) => {
      return (
        <div
          className="cursor-pointer  h-full hover:text-black/40 w-full transition-colors duration-300 break-words"
          onClick={() => {
            handleEventClick(props)
          }}
          rel="noreferrer"
        >
          <div className=" div_cita px-1 h-full text-white bg-[#09C08F] rounded-t-md">
            <span className="block lowercase">{props.title}</span>
            {props.client && (
              <div className="">
                Cliente: {props.client.nombres} {props.client.apellidos}
              </div>
            )}
          </div>
        </div>
      )
    }
  }

  const handleEventClick = (event: values): void => {
    if (event) {
      setOpen2(true)
      setEventoSelected(event)
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
      Swal.fire('Error', '', 'error')
    }
  }

  const updateCita2 = async (updatedEvents: Event[]): Promise<void> => {
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
          texto: 'Evento eliminado'
        })
      } else {
        Swal.fire('Error al guardar', '', 'error')
      }
    } catch (error) {
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
    <div className="w-full h-screen p-4 flex flex-col gap-10 relative">
      {loading
        ? <Loading />
        : (
        <>
          <div className='flex w-full justify-center'>
          <div className='w-full'>
                <h2 className="text-center mx-auto text-3xl text-white rounded-xl py-1 bg-main/80 px-10 w-fit font-bold font_main uppercase">
                Gestor de Citas
                </h2>
            </div>
            <div className='w-full '>
                <Link to='/admin/historialllamadas' className="w-fit mx-auto text-center rounded-xl py-1 block text-3xl hover:bg-main/80 hover:text-white transition-colors px-10 text-black font-bold font_main uppercase">
                Historial de llamadas
                </Link>
            </div>
          </div>
          <Link
            to="/admin/lista-clientes"
            className="fixed w-fit md:top-[3%] lg:top-[3%] text-3xl  right-4 text-red-500 cursor-pointer"
          >
            <BsArrowLeftSquareFill />
          </Link>
          <div className="w-full h-full App-content">
            <Calendar
              className="calendario_citas text-black"
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              selectable
              onSelectSlot={({ start, end }: values) => {
                openClientModal({ start, end })
              }}
              messages={messages}
              views={['agenda', 'day', 'week', 'month']}
              defaultView="agenda"
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
      <ModalOpciones
        setEvents={setEvents}
        eventoSelected={eventoSelected}
        open={open2}
        setOpen={setOpen2}
        updateCita={updateCita2}
        open3={open3}
        setOpen3={setOpen3}
        planes={planes}
      />

      <AnimatePresence>
        {showError != null && <AlertSucess showError={showError} />}
      </AnimatePresence>
    </div>
  )
}
