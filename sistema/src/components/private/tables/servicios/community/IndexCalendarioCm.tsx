/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, type Dispatch, type SetStateAction } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/es'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import axios from 'axios'
import Swal from 'sweetalert2'
import { v4 as uuidv4 } from 'uuid'
import { Global } from '../../../../../helper/Global'
import { ModalDescripcion } from './ModalDescripcion'
import { toast } from 'sonner'
import { useParams } from 'react-router-dom'
import useAuth from '../../../../../hooks/useAuth'
import { ModalInformacion } from './modals/ModalInformacion'
import { IoNotifications } from 'react-icons/io5'
import { ModalCorreoConfirmacion } from './modals/ModalCorreoConfirmacion'
import { cn } from '../../../../shared/cn'

moment.locale('es')
const localizer = momentLocalizer(moment) // Importa el locale español

interface valuesDatos {
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

moment.updateLocale('es', null) // Limpiar configuraciones previas
moment.locale('es', {
  months:
    'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split(
      '_'
    ),
  monthsShort: 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_'),
  weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
  weekdaysShort: 'dom_lun_mar_mié_jue_vie_sáb'.split('_'),
  weekdaysMin: 'do_lu_ma_mi_ju_vi_sá'.split('_'),
  week: {
    dow: 1, // Monday is the first day of the week
    doy: 4 // The week that contains Jan 4th is the first week of the year
  }
})

export const IndexCalendarioCm = ({
  datos,
  getOneBrief,
  events,
  setEvents,
  brief,
  //   diferenciasDias,
  communityActivo
}: {
  datos: valuesDatos
  getOneBrief: () => Promise<void>
  events: Event[]
  setEvents: Dispatch<SetStateAction<Event[]>>
  brief: any | null
  diferenciasDias: any
  communityActivo: any
}): JSX.Element => {
  const { id } = useParams()
  const { auth } = useAuth()
  const token = localStorage.getItem('token')
  const [loadingUpdate, setLoadingUpdate] = useState(false)
  const [disabledDates] = useState([datos?.fecha_inicio]) // Lista de fechas deshabilitadas
  const [open, setOpen] = useState(false)
  const [openHistorial, setOpenHistorial] = useState(false)
  const [openInformacion, setOpenInformacion] = useState(false)
  const [eventSelected, setEventSelected] = useState<any | null>(null)
  const [openConfirmacion, setOpenConfirmacion] = useState(false)
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
  const [selectedDate, setSelectedDate] = useState<Date | null>()

  const handleDateChange = (e: any): void => {
    const { value } = e.target
    const [year, month] = value.split('-').map(Number)
    if (year > 2023) {
      setSelectedDate(new Date(year, month - 1, 1))
    }
  }
  const workDayStart = new Date() // Fecha de inicio para el día de trabajo
  workDayStart.setHours(9, 0, 0, 0)
  const workDayEnd = new Date() // Fecha de fin para el día de trabajo
  workDayEnd.setHours(19, 0, 0, 0)
  // Función para formatear la fecha con el año seleccionado
  const formatDate = (): any => {
    return selectedDate ? moment(selectedDate).format('YYYY-MM') : ''
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
                className={
                  'div_cita px-1 h-full text-white bg-green-600 transition-colors rounded-t-md'
                }
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
              onClick={() => {
                setOpenInformacion(true)
                setEventSelected(props)
              }}
            >
              <div
                className={
                  'div_cita px-1 h-full text-white bg-gray-400 transition-colors rounded-t-md'
                }
              >
                <span className="block text-center">{props.title}</span>
              </div>
            </div>
                )
              : (
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
            ${props.event?.comentarios?.length > 0
? 'bg-yellow-600'
              : props.event?.publicado || fechaVencimiento < fechaActual ? 'bg-[#129990]' : 'bg-red-600'
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
    setLoadingUpdate(true)
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
        toast.success('Evento guardado2')
      } else {
        toast.error('Error al guardar')
      }
    } catch (error) {
      console.log(error)
      toast.error('Error al guardar')
    } finally {
      setLoadingUpdate(false)
      setOpen(false)
    }
  }
  const [view, setView] = useState('month')

  const handleSelectSlot = ({ start }: { start: any }): void => {
    const startEventDate = moment(start).format('DD/MM/YYYY')
    if (disabledDates.includes(startEventDate)) {
      return
    }
    setSelectedDate(start)
    // @ts-expect-error
    Swal.fire({
      title: 'TITULO DEL EVENTO',
      input: 'text',
      showCancelButton: true,
      confirmButtonText: 'Guardar',
      cancelButtonText: 'Cancelar',
      allowOutsideClick: false,
      inputValidator: (value) => {
        if (!value) {
          return '¡Debe ingresar un título!'
        }
      }
    }).then(async (result) => {
      if (result.isConfirmed) {
        const newEvent = {
          id: uuidv4(),
          title: result.value,
          publicado: false,
          start,
          end: start,
          descripcion: null,
          tema: null,
          hora: null,
          user: {
            name: auth.name,
            id: auth.id
          },
          comentarios: null
        }
        const updatedEvents: any = [...events, newEvent]
        setEvents(updatedEvents)
        await updateCita(updatedEvents)
      }
    })
  }

  //   const handleDateChange = (e: any): void => {
  //     const { value } = e.target
  //     const [year, month] = value.split('-').map(Number)
  //     if (year > 2022) {
  //       setSelectedDate(new Date(year, month - 1, 1))
  //     }
  //   }

  return (
    <>
      <section className="flex items-center justify-between border-b border-gray-300 h-[7%] py-1 md:py-0 lg:h-[10%] mx-1 md:px-8">
        <div className="flex gap-3 items-center ">
          <div className="w-12 md:w-14 h-full md:h-14 rounded-md bg-gradient-to-r from-[#129990] to-green-400 flex justify-center text-black text-base md:text-2xl items-center font-extrabold">
            {datos.nombre_marca.trim() !== ''
              ? datos.nombre_marca.charAt(0).toUpperCase()
              : ''}
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-black font-bold text-sm md:text-lg">
              CALENDARIO COMMUNITY MANAGER
            </h1>
            <div className="flex gap-2 justify-start">
              <span className="text-gray-700 font-medium text-sm">
                {datos.nombre_marca}
              </span>
            </div>
          </div>
        </div>
        <div className='flex gap-6 justify-end'>
            <div className='relative'>
                <span className='text-black bg-gray-300 py-1 px-3 rounded-md' onClick={() => { setOpenHistorial(!openHistorial) }}>Historial</span>
                {openHistorial &&
                <div className='absolute bg-gray-200 p-2 shadow-md mt-4 left-0 right-0 text-black w-[400px] z-[999] top-full flex flex-col gap-4'>
                    {// @ts-expect-error
                    datos?.aprobacion.length > 0
                    // @ts-expect-error
                      ? datos.aprobacion.map((apro: any) => (
                            <div key={apro.id} className={cn('flex gap-2', apro.aprobacion == 'false' ? 'bg-red-600' : apro.aprobacion == 'true' ? 'bg-green-700' : '')}>
                                <span>{apro.asunto}</span>
                            </div>
                      ))
                      : 'No existe un historial'
                    }
                </div>}
            </div>
            <div className='pl-4'>
                <IoNotifications className='text-2xl text-red-400' onClick={() => { setOpenConfirmacion(true) }}/>
            </div>
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
      <section className="w-full h-[90%] px-0 lg:px-6 pb-4 relative content_modal">
        <>
          <div className="w-full h-full px-2 lg:px-4">
            <Calendar
              className="calendario_cm text-black"
              localizer={localizer}
              events={events}
              startAccessor={(event: any) => new Date(event.start)}
              endAccessor={(event: any) => new Date(event.end)}
              selectable
              messages={messages}
              view={view}
              views={['agenda', 'month']}
              defaultView="month"
              min={workDayStart}
              max={workDayEnd}
              date={selectedDate}
              components={components}
              onView={(view: any) => { setView(view) }} // Permite cambiar de vista con los botones
              onSelectSlot={communityActivo === 'false' ? '' : handleSelectSlot }
              onShowMore={() => {
                setView('agenda') // Cambia la vista a "Agenda"
              }}
            />
          </div>
        </>
        <ModalDescripcion
          loadingUpdate={loadingUpdate}
          getOneBrief={getOneBrief}
          setEvents={setEvents}
          events={events}
          open={open}
          setOpen={setOpen}
          eventSelected={eventSelected}
          setLoadingUpdate={setLoadingUpdate}
          marca={datos?.nombre_marca}
          nombres={datos?.nombres}
          email={datos?.email}
          communityActivo={communityActivo}
        />
        <ModalInformacion
          loadingUpdate={loadingUpdate}
          getOneBrief={getOneBrief}
          setEvents={setEvents}
          events={events}
          open={openInformacion}
          setOpen={setOpenInformacion}
          eventSelected={eventSelected}
          setLoadingUpdate={setLoadingUpdate}
          brief= {brief}
          datos={datos}
        />
        <ModalCorreoConfirmacion
            loadingUpdate={loadingUpdate}
            getOneBrief={getOneBrief}
            open={openConfirmacion}
            setOpen={setOpenConfirmacion}
            eventSelected={eventSelected}
            setLoadingUpdate={setLoadingUpdate}
            datos={datos}
            setEvents={setEvents}
            events={events}
            updateCita={updateCita}
        />
      </section>
    </>
  )
}
