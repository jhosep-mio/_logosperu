/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/es'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { type errorValues } from '../../../shared/schemas/Interfaces'
import { Loading } from '../../../shared/Loading'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import Swal from 'sweetalert2'
import { AnimatePresence } from 'framer-motion'
import { AlertSucess } from '../../../shared/alerts/AlertSucess'
import { ModalDescripcion } from './modals/ModalDescripcion'
import { v4 as uuidv4 } from 'uuid'

moment.locale('es')
const localizer = momentLocalizer(moment) // Importa el locale español

export const IndexCalendarioCm = (): JSX.Element => {
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(true)
  const [loadingUpdate, setLoadingUpdate] = useState(false)
  const [open, setOpen] = useState(false)
  const [showError, setShowError] = useState<errorValues | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [eventSelected, setEventSelected] = useState<any | null>(null)
  const [colaboradores, setColaboradores] = useState([])
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
  const workDayStart = new Date() // Fecha de inicio para el día de trabajo
  workDayStart.setHours(9, 0, 0, 0)
  const workDayEnd = new Date() // Fecha de fin para el día de trabajo
  workDayEnd.setHours(19, 0, 0, 0)

  const getColaboradores = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getUsuarios`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setColaboradores(request.data)
  }
  // Función para formatear la fecha con el año seleccionado

  const getCitas = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getGestorComunnity/1`, {
      headers: {
        Authorization: `Bearer ${
          token !== null && token !== '' ? `Bearer ${token}` : ''
        }`
      }
    })
    if (request.data[0].community) {
      const parsedEvents = JSON.parse(request.data[0].community).map(
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
    event: (props: any) => {
      const selectedContacts = props.event.descripcion?.selectedContacts
        ? props.event.descripcion?.selectedContacts
        : []
      const getBackgroundColor = (type: string): string => {
        switch (type) {
          case 'Facebook':
            return 'bg-facebook' // Color azul para Facebook
          case 'Instagram':
            return 'bg-instragram' // Color rosa para Instagram
          default:
            return 'bg-whatsap' // Otros tipos de contacto
        }
      }

      const getBackgroundStyle = (): string => {
        const types = selectedContacts.map((contact: any) => contact.type)
        if (types.includes('Facebook') && types.includes('Instagram')) {
          return 'bg-gradient-to-br from-blue-500 to-pink-500' // Degradado azul a rosa
        } else {
          return getBackgroundColor(types[0]) || 'bg-[##129990]' // Color sólido según el primer tipo de contacto
        }
      }

      return (
        <div
          className="cursor-pointer h-full hover:text-black/40 w-full transition-colors outline-none duration-300 break-words flex "
          rel="noreferrer"
          onClick={() => {
            setOpen(true)
            setEventSelected(props)
          }}
        >
          <div
            className={`div_cita px-1 h-full text-white 
          ${
            // eslint-disable-next-line react/prop-types
            props.event?.comentarios?.length > 0
              ? `bg-gradient-to-br ${
                  props.event?.publicado ? 'from-[#129990]' : 'from-red-500'
                } to-yellow-600`
              : props.event?.publicado
              ? `${getBackgroundStyle()}`
              : 'bg-red-600'
          }   transition-colors rounded-t-md`}
          >
            <span className="block lowercase first-letter:uppercase text-[12px] md:text-sm">
              {props.title}
            </span>
          </div>
        </div>
      )
    }
  }

  const updateCita = async (updatedEvents: Event[]): Promise<void> => {
    setLoadingUpdate(true)
    const data = new FormData()
    data.append('community', JSON.stringify(updatedEvents))
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/updateGestorComunnity/1`,
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
    } finally {
      setLoadingUpdate(false)
      setOpen(false)
    }
  }

  const handleSelectSlot = ({ start }: { start: any }): void => {
    Swal.fire({
      title: 'TITULO DEL EVENTO',
      html: `
        <input id="event-title" class="w-full py-2 px-4 text-sm mt-3" placeholder="Título">
        <select id="event-status" class="w-full py-2 px-4 text-sm mt-3" >
          <option value="">Seleccionar estado</option>
          <option value="whatsapp">Estados - Whatsapp</option>
          <option value="publicaciones">Publicaciones FB</option>
          <option value="history">History FB</option>
          <option value="tiktok">TikTok</option>
        </select>
      `,
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
      preConfirm: () => {
        const title = (
          document.getElementById('event-title') as HTMLInputElement
        ).value
        const status = (
          document.getElementById('event-status') as HTMLSelectElement
        ).value
        if (!title) {
          Swal.showValidationMessage('¡Debe ingresar un título!')
          return
        }
        if (!status) {
          Swal.showValidationMessage('¡Debe seleccionar un estado!')
          return
        }
        return { title, status }
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newEvent = {
          id: uuidv4(),
          title: result.value?.title,
          estado: result.value?.status,
          publicado: false,
          start,
          end: start,
          descripcion: null
        }
        // Agregar el nuevo evento al array de eventos
        const updatedEvents: any = [...events, newEvent]
        setEvents(updatedEvents)
        // Actualizar la base de datos con el array de eventos actualizado
        await updateCita(updatedEvents)
      }
    })
  }

  useEffect(() => {
    Promise.all([getCitas(), getColaboradores()]).then(() => {
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

  const [filter, setFilter] = useState('') // Estado del filtro
  const filteredEvents = events.filter((event: any) => {
    if (filter == 'whatsapp') {
      return !event.estado || event.estado === filter
    }
    return !filter || event.estado === filter
  })
  // Función para cambiar el filtro
  const handleFilterChange = (estado: any): void => {
    setFilter(estado)
  }

  return (
    <>
      <section className="flex w-full items-center bg-white justify-between border-b border-gray-300 h-[7vh] min-h-[7vh] py-1 md:py-0 lg:h-[10vh] px-2 md:px-8">
        <div className="w-full h-full flex gap-3 items-center ">
          <div className="flex w-12 md:w-14 h-full md:h-14 rounded-md bg-gradient-to-r from-[#129990] to-green-400  justify-center text-black text-base md:text-2xl items-center font-extrabold">
            C
          </div>
          <div className="hidden md:flex flex-col justify-center">
            <h1 className="text-black font-bold text-sm xl:text-lg">
              <span className="hidden lg:block">
                CALENDARIO COMMUNITY MANAGER
              </span>
              <span className="block lg:hidden">CALENDARIO CM</span>
            </h1>
            <div className="flex gap-2 justify-start">
              <span className="text-gray-600 text-sm">Logos Perú</span>
            </div>
          </div>
        </div>
        <div className="w-full h-full flex items-center justify-end gap-3">
          <div
            className={`flex items-center gap-2 h-fit px-2 py-1 rounded-xl shadow cursor-pointer ${
              filter == '' ? 'bg-main' : 'bg-white'
            }`}
            onClick={() => { handleFilterChange('') }}
          >
            <span className="text-black font-medium text-[12px] md:text-sm">
              Todos
            </span>
          </div>
          <div
            className={`flex items-center gap-2 h-fit px-2 py-1 rounded-xl shadow cursor-pointer ${
              filter == 'whatsapp' ? 'bg-main' : 'bg-white'
            }`}
            onClick={() => { handleFilterChange('whatsapp') }}
          >
            <span className="hidden md:flex text-black font-medium text-[12px] md:text-sm">
              Estados
            </span>
          </div>
          <div
            className={`flex items-center gap-2 md:min-w-[128px] max-h-[32px] line-clamp-1 overflow-hidden h-fit px-2 py-1 rounded-xl shadow cursor-pointer ${
              filter == 'publicaciones' ? 'bg-main' : 'bg-white'
            }`}
            onClick={() => { handleFilterChange('publicaciones') }}
          >
            <span className="hidden md:flex text-black font-medium text-[12px] md:text-sm">
              Publicaciones FB
            </span>
          </div>
          <div
            className={`flex items-center gap-2 max-h-[32px] line-clamp-1 overflow-hidden h-fit px-2 py-1 rounded-xl shadow cursor-pointer ${
              filter == 'history' ? 'bg-main' : 'bg-white'
            }`}
            onClick={() => { handleFilterChange('history') }}
          >
            <span className="hidden md:flex text-black font-medium text-[12px] md:text-sm">
              History FB
            </span>
          </div>
          <div
            className={`flex items-center gap-2 max-h-[32px] line-clamp-1 overflow-hidden h-fit px-2 py-1 rounded-xl shadow cursor-pointer ${
              filter == 'tiktok' ? 'bg-main' : 'bg-white'
            }`}
            onClick={() => { handleFilterChange('tiktok') }}
          >
            <span className="hidden md:flex text-center justify-center w-full text-black font-medium text-[12px] md:text-sm">
              TikTok
            </span>
          </div>
        </div>
      </section>
      <section className="w-full h-[90vh] px-2 md:px-6 pb-4 relative bg-white">
        {loading
          ? (
          <Loading />
            )
          : (
          <>
            <div className="w-full h-full px-0 lg:px-4">
              <Calendar
                className="calendario_cm calendario_cm3 text-black bg_calendar_cm"
                localizer={localizer}
                events={filteredEvents}
                startAccessor="start"
                endAccessor="end"
                selectable
                messages={messages}
                views={['day', 'agenda', 'month']}
                defaultView="month"
                min={workDayStart}
                max={workDayEnd}
                components={components}
                onSelectSlot={handleSelectSlot}
              />
            </div>
          </>
            )}
        <ModalDescripcion
          getCitas={getCitas}
          loadingUpdate={loadingUpdate}
          setEvents={setEvents}
          events={events}
          open={open}
          setOpen={setOpen}
          eventSelected={eventSelected}
          colaboradores={colaboradores}
          setLoadingUpdate={setLoadingUpdate}
        />
        <AnimatePresence>
          {showError != null && <AlertSucess showError={showError} />}
        </AnimatePresence>
      </section>
    </>
  )
}
