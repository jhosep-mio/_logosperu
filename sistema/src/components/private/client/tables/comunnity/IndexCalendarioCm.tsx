/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/es'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { ModalDescripcion } from './ModalDescripcion'
import { ModalInformacion } from '../components/ModalInformacion'
import { cn } from '../../../../shared/cn'
import Swal from 'sweetalert2'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import { useParams } from 'react-router-dom'
import useAuthCliente from '../../../../../hooks/useAuthCliente'
import { type bannersValues } from '../../../../shared/schemas/Interfaces'

moment.locale('es')
const localizer = momentLocalizer(moment) // Importa el locale español

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
  brief,
  correos
}: {
  datos: bannersValues
  getOneBrief: () => Promise<void>
  brief: any | null
  correos: never[]
}): JSX.Element => {
  const [open, setOpen] = useState(false)
  const { id } = useParams()
  const { auth } = useAuthCliente()
  const token = localStorage.getItem('tokenUser')
  const initialEvents: any = JSON.parse(datos.community) ?? []
  const [events, setEvents] = useState<Event[]>(initialEvents)
  const [openInformacion, setOpenInformacion] = useState(false)
  const [openHistorial, setOpenHistorial] = useState(false)
  const [eventSelected, setEventSelected] = useState<any | null>(null)
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
  //   const [selectedDate, setSelectedDate] = useState<Date | null>(Date.now())
  const workDayStart = new Date() // Fecha de inicio para el día de trabajo
  workDayStart.setHours(9, 0, 0, 0)
  const workDayEnd = new Date() // Fecha de fin para el día de trabajo
  workDayEnd.setHours(19, 0, 0, 0)
  // Función para formatear la fecha con el año seleccionado
  //   const formatDate = (): any => {
  //     return selectedDate ? moment(selectedDate).format('YYYY-MM') : ''
  //   }

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
                <span className="block text-center text-xs lg:text-base">
                  {props.title}
                </span>
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
                <span className="block text-center text-xs lg:text-base">
                  {props.title}
                </span>
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
            ${
              props.event?.publicado || fechaVencimiento < fechaActual
                ? 'bg-[#129990]'
                : 'bg-red-600'
            }   transition-colors rounded-t-md`}
              >
                <span className="block text-xs lg:text-base">
                  {props.title}
                </span>
              </div>
            </div>
                )}
        </>
      )
    }
  }

  //   const handleDateChange = (e: any): void => {
  //     const { value } = e.target
  //     const [year, month] = value.split('-').map(Number)
  //     if (year > 2023) {
  //       setSelectedDate(new Date(year, month - 1, 1))
  //     }
  //   }

  const updateCita = async (
    updatedEvents: any,
    estado: string
  ): Promise<void> => {
    const data = new FormData()

    data.append('nombres', auth.name)
    data.append('contrato', datos.id_contrato)
    data.append('empresa', datos.nombre_marca)
    data.append('id', id?.toString() ?? '')
    data.append('estado', `SOLICITUD DE CALENDARIO ${estado}`)
    data.append('aprobacion', JSON.stringify(updatedEvents))
    data.append('correos', JSON.stringify(correos))
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/actualizarConfirmacion/${id ?? ''}`,
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
        Swal.fire(`Solicitud ${estado}`, '', 'success')
        getOneBrief()
      }
    } catch (error) {
      Swal.fire('Error', '', 'error')
    }
  }
  const fechaActual = new Date()

  const mostrarAlerta = (aprobacion: any): void => {
    const fechaParts = aprobacion.vencimiento.split('/')
    // Extraer los componentes de la fecha
    const year = parseInt(fechaParts[2], 10)
    const month = parseInt(fechaParts[1], 10) - 1 // Los meses en JavaScript se indexan desde 0
    const day = parseInt(fechaParts[0], 10)
    // Crear un objeto Date con los componentes de la fecha y hora
    const fechaVencimiento = new Date(year, month, day, 22, 0, 0) // 17 es para las 5 p. m.
    if (fechaVencimiento < fechaActual) {
      Swal.fire('PLAZO DE CONFIRMACION VENCIDO', '', 'warning')
    } else {
      Swal.fire({
        title: aprobacion.asunto,
        text: '¿Quieres confirmar o rechazar esta solicitud?',
        icon: 'question',
        showCloseButton: true, // Muestra un botón para cerrar la alerta
        showCancelButton: true,
        confirmButtonText: 'Confirmar',
        cancelButtonText: 'Rechazar',
        cancelButtonColor: '#d33',
        buttonsStyling: false, // Desactiva el estilo predeterminado de los botones
        customClass: {
          confirmButton: 'swal2-confirm-first', // Clase para el botón de confirmar
          cancelButton: 'swal2-cancel-second' // Clase para el botón de rechazar
        }
      }).then((result) => {
        if (result.isConfirmed) {
          // @ts-expect-error
          const updatedAprobaciones = JSON.parse(datos.aprobacion).map(
            (item: any) =>
              item.id == aprobacion.id ? { ...item, aprobacion: true } : item
          )
          updateCita(updatedAprobaciones, 'APROBADA')
        } else if (result.dismiss === Swal.DismissReason.cancel) {
          // @ts-expect-error

          const updatedAprobaciones = JSON.parse(datos.aprobacion).map(
            (item: any) =>
              item.id == aprobacion.id ? { ...item, aprobacion: false } : item
          )
          updateCita(updatedAprobaciones, 'RECHAZADA')
        }
      })
    }
  }

  const [view, setView] = useState('month')

  return (
    <>
      <section className="flex items-center justify-between border-b border-gray-300 h-[7%] py-1 md:py-0 lg:h-[10%] mx-1 md:px-8">
        <div className="flex h-full md:h-fit gap-3 items-center ">
          <div className="w-12 md:w-14 h-full md:h-14 rounded-md bg-gradient-to-r from-[#129990] to-green-400 flex justify-center text-black text-base md:text-2xl items-center font-extrabold">
            {datos.nombre_marca.trim() !== ''
              ? datos.nombre_marca.charAt(0).toUpperCase()
              : ''}
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-black font-bold text-sm line-clamp-1 md:text-lg">
              CALENDARIO COMMUNITY MANAGER
            </h1>
            <div className="flex gap-2 justify-start">
              <span className="text-gray-700 font-medium text-sm">
                {datos.nombre_marca}
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-6 justify-end">
          <div className="relative">
            <div className="relative">
              <span
                className="text-white bg-[#129990] py-1 px-3 rounded-md"
                onClick={() => {
                  setOpenHistorial(!openHistorial)
                }}
              >
                Notificaciones
              </span>
              {// @ts-expect-error
              datos?.aprobacion && JSON.parse(datos?.aprobacion).filter(
                (apro: any) => apro.aprobacion === null
              ).length > 0 &&
              <span className="absolute -top-4 -right-2 bg-red-600 w-6 h-6 rounded-full flex items-center justify-center text-white text-sm">
                {// @ts-expect-error
                  datos?.aprobacion && JSON.parse(datos?.aprobacion).filter(
                    (apro: any) => apro.aprobacion === null
                  ).length
                }
              </span>}
            </div>
            {openHistorial && (
              <div className="absolute bg-gray-100 shadow-md mt-4 right-0 text-black w-[400px] z-[999] top-full flex flex-col gap-0">
                {
                  // @ts-expect-error
                  datos?.aprobacion && datos?.aprobacion.length > 0 // @ts-expect-error
                    ? JSON.parse(datos.aprobacion).map((apro: any) => {
                      const fechaParts = apro.vencimiento.split('/')
                      // Extraer los componentes de la fecha
                      const year = parseInt(fechaParts[2], 10)
                      const month = parseInt(fechaParts[1], 10) - 1 // Los meses en JavaScript se indexan desde 0
                      const day = parseInt(fechaParts[0], 10)
                      // Crear un objeto Date con los componentes de la fecha y hora
                      const fechaVencimiento = new Date(year, month, day, 22, 0, 0) // 17 es para las 5 p. m.

                      return (
                        <div
                          key={apro.id}
                          onClick={() => {
                            // @ts-expect-error
                            if (apro.aprobacion == null && datos.fecha_fin == null && datos?.community_activo != 'false') {
                              mostrarAlerta(apro)
                            }
                          }}
                          className={cn(
                            'flex gap-2 transition-colors p-2',
                            apro.aprobacion
                              ? 'bg-green-700 text-white'
                              : !apro.aprobacion && apro.aprobacion != null
                                  ? 'bg-red-600 text-white'
                                  : apro.aprobacion == null && fechaVencimiento < fechaActual
                                    ? 'bg-yellow-600 text-white'
                                    : 'hover:bg-gray-400'
                          )}
                        >
                          <span>{apro.asunto} {apro.aprobacion == null && fechaVencimiento < fechaActual && '(VENCIDO)'}</span>
                        </div>
                      )
                    })
                    : 'No existe un historial'
                }
              </div>
            )}
          </div>
          {/* <input
            type="month"
            value={formatDate()}
            onChange={handleDateChange}
            className="bg-transparent text-black opacity-0"
            min="2023-01"
            max="2030-12"
          /> */}
        </div>
      </section>
      <section className="w-full h-[500px] lg:h-[90%] px-0 lg:px-6 lg:pb-4 relative content_modal">
        <>
          <div className="w-full h-full md:px-4">
            <Calendar
              className="calendario_cm text-black calendario_cm3"
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              selectable
              messages={messages}
              views={['month', 'agenda']}
              view={view}
              onView={(view: any) => { setView(view) }} // Permite cambiar de vista con los botones
              defaultView="month"
              min={workDayStart} // Establecer la hora de inicio del día
              max={workDayEnd}
              onShowMore={() => {
                setView('agenda') // Cambia la vista a "Agenda"
              }}
              components={components} // Use the custom event renderer
            />
          </div>
        </>
        <ModalDescripcion
          datos={datos}
          getOneBrief={getOneBrief}
          setEvents={setEvents}
          events={events}
          open={open}
          setOpen={setOpen}
          eventSelected={eventSelected}
          correos={correos}
        />
        <ModalInformacion
          brief={brief}
          eventSelected={eventSelected}
          open={openInformacion}
          setOpen={setOpenInformacion}
        />
      </section>
    </>
  )
}
