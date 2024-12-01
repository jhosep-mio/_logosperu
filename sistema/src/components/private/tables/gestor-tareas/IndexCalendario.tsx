/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useState, useEffect } from 'react'
import { Calendar, momentLocalizer } from 'react-big-calendar'
import moment from 'moment'
import 'moment/locale/es'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { type errorValues, type ValuesPreventaModificate, type ValuesPlanes } from '../../../shared/schemas/Interfaces'
import { getClientes, getDataToPlanes } from '../../../shared/FetchingData'
import { Loading } from '../../../shared/Loading'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import Swal from 'sweetalert2'
import { AnimatePresence } from 'framer-motion'
import { AlertSucess } from '../../../shared/alerts/AlertSucess'
import useAuth from '../../../../hooks/useAuth'
import { ModalClientes } from '../citas/ModalClientes'
import { cn } from '../../../shared/cn'
import { HeaderGestor } from './components/HeaderGestor'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'
import { ModalCitaVistaExterna } from '../citas_reuniones/modals/ModalCitaVistaExterna'
import { ModalCitaView } from '../citas_reuniones/modals/ModalCitaView'
moment.locale('es')
const localizer = momentLocalizer(moment) // Importa el locale español

export const IndexCalendario = (): JSX.Element => {
  const token = localStorage.getItem('token')
  const [, setplanes] = useState<ValuesPlanes[]>([])
  const [loading, setLoading] = useState(true)
  const { auth } = useAuth()
  const [clientes, setclientes] = useState<ValuesPreventaModificate[]>([])
  const [showError, setShowError] = useState<errorValues | null>(null)
  const [tableros, setTableros] = useState<any[]>([])
  const [usuarios, setUsuarios] = useState<never[]>([])
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
  const [currentYear, setCurrentYear] = useState<number>(moment().year()) // Año actual
  const [currentMonth, setCurrentMonth] = useState<number>(moment().month()) // Mes actual
  const [openView, setOpenView] = useState({ estado: false, evento: null })
  const [openVistaPrevia, setOpenVistaPrevia] = useState({ estado: false, evento: null })

  const getFormattedStartTime = (horaInicio: string): string => {
    try {
      const inicioObj = JSON.parse(horaInicio)
      if (inicioObj?.timeinicio) {
        return inicioObj.timeinicio
      }
    } catch (error) {
      console.error('Error al analizar JSON:', error)
    }
    return '' // En caso de error o si no se encuentra la hora de inicio
  }
  const workDayStart = new Date() // Fecha de inicio para el día de trabajo
  workDayStart.setHours(9, 0, 0, 0)

  const workDayEnd = new Date() // Fecha de fin para el día de trabajo
  workDayEnd.setHours(19, 0, 0, 0)

  const handleClientSelection = (selectedClient: ValuesPreventaModificate): void => {
    setSelectedClient(selectedClient)
    let title = window.prompt(`${selectedClient.nombres} ${selectedClient.apellidos}:`)
    // Si el usuario no ingresó un título, asigna un texto por defecto
    title = `${title ?? ''} - ${selectedClient.nombres} ${selectedClient.apellidos}`.toUpperCase() // Puedes cambiar esto por el texto que desees
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
        return updatedEvents
      })
    }
    setSelectedClient(null)
    setSelectedTimeSlot(null)
    setOpen(false)
  }

  const getCitas = async (): Promise<void> => {
    setLoading(true)
    try {
      const request = await axios.get(`${Global.url}/getUsuarios`, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      setUsuarios(request.data)
      const params: Record<string, any> = { year: currentYear, month: currentMonth + 1 }
      const { data: contenidos } = await axios.get(`${Global.url}/gestorContenido/findByDate/${auth.id}`, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? `Bearer ${token}` : ''}`
        },
        params
      })
      const { data: gestor } = await axios.get(`${Global.url}/gestor/findAll/${auth.id}`, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? `Bearer ${token}` : ''}`
        }
      })
      setTableros(gestor)
      const request2 = await axios.get(`${Global.url}/getCalendarCitas/${auth.id ?? ''}`, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      let citas = []
      if (request2.data && request2.data.length > 0) {
        citas = request2.data.map((cita: any) => {
          const startDate = moment(JSON.parse(cita.hora_inicio).dateinicio, 'YYYY-MM-DD').toDate()
          const endDate = moment(JSON.parse(cita.hora_final).datefinal, 'YYYY-MM-DD').toDate()
          return {
            id: cita.id,
            user_id: cita.user_id,
            title: cita.asunto,
            start: startDate,
            end: endDate,
            estado: cita.estado,
            tipo: cita.tipo,
            miembros: cita.miembros,
            orden: cita,
            tipos: 'cita_reunion'
          }
        })
      }
      const transformedEvents = contenidos.map((contenido: any) => {
        const startDate = contenido.created_at ? moment(contenido.created_at).toDate() : new Date()
        return {
          ...contenido,
          id: contenido.id,
          title: contenido.titulo || 'Sin título', // Si tienes un título o descripción
          start: startDate, // Establecer la fecha de inicio
          end: moment(startDate).add(1, 'hour').toDate(),
          tipos: 'gestor'
        }
      })
      const allEvents = [...citas, ...transformedEvents]
      setEvents(allEvents)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const calcularPorcentaje = (checklist: any): string => {
    if (checklist) {
      const countChecked = JSON.parse(checklist).filter((item: any) => item.check).length
      return ((countChecked / JSON.parse(checklist).length) * 100).toFixed(0)
    } else {
      return 'none'
    }
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
        <>
          {props?.event?.tipos == 'gestor' ? (
            <a
              href={`/admin/gestor-tareas/findOne/${props?.event?.idTablero ?? ''}/image/0`}
              target="_blank"
              className="cursor-pointer h-full flex flex-col gap-1 hover:text-black/40 w-full transition-colors outline-none duration-300 break-words  "
              rel="noreferrer"
            >
              <div
                className={cn(
                  'div_cita px-1 h-full text-white transition-colors rounded-md',
                  calcularPorcentaje(props?.event?.checklist) == 'none'
                    ? 'bg-[#579EB2] group-hover:bg-cyan-700'
                    : calcularPorcentaje(props?.event?.checklist) == '100'
                      ? 'bg-green-500 group-hover:bg-green-700'
                      : calcularPorcentaje(props?.event?.checklist) >= '50'
                        ? 'bg-yellow-500 group-hover:bg-yellow-700'
                        : 'bg-red-600 group-hover:bg-red-800'
                )}
              >
                <span className="block lowercase first-letter:uppercase line-clamp-1">{props?.event?.title}</span>
              </div>
              {/* })} */}
            </a>
          ) : (
            <div
              className="cursor-pointer overflow-hidden relative rounded-sm h-full hover:text-black/40 w-full transition-colors outline-none duration-300 break-words flex "
              rel="noreferrer"
              onClick={() => {
                if (props?.event?.user_id == auth.id) {
                  setOpenView({ estado: true, evento: props })
                } else {
                  setOpenVistaPrevia({ estado: true, evento: props })
                }
              }}
            >
              <span className="absolute top-0 w-[200%] h-[200%] block bg-[#0072C6] z-[1]"></span>
              <div className={cn('div_cita  z-[1] h-full flex  text-white transition-colors rounded-t-md bg-transparent')}>
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
                  <div className="flex gap-1 text-[12px] md:text-sm">
                    <p className="hidden md:block">{getFormattedStartTime(props?.event?.orden?.hora_inicio)}</p>
                    <span className="lowercase first-letter:uppercase ">{props.title}</span>
                  </div>
                  {props?.event?.user_id != auth.id && <p className="text-xs text-gray-200">{getNameById(props?.event?.user_id)}</p>}
                </div>
              </div>
            </div>
          )}
        </>
      )
    }
  }

  const updateIDItemTarjetaAction = async (
    idTable: string,
    idContenido: string,
    newCod: string,
    titulo: string,
    idTablero: string,
    startDate: Date
  ): Promise<void> => {
    const data = new FormData()
    data.append('idTable', idTable)
    data.append('idContenido', idContenido)
    data.append('contextoID', newCod)
    data.append('titulo', titulo)
    data.append('idUser', auth.id)
    data.append('startDate', startDate.toISOString())
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(`${Global.url}/gestor/updateIDContenidoFecha/${idTablero ?? ''}`, data, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      if (respuesta.data.status == 'success') {
        getCitas()
        toast.success('Actualizacion exitosa')
      } else {
        toast.error('Error al actualizar')
      }
    } catch (error) {
      console.log(error)
      toast.error('Error al actualizar')
    } finally {
      setLoading(false)
    }
  }

  const updateContenido = async (tituloContenido: any, idTablero: any, startDate: Date): Promise<void> => {
    const idUnico2 = uuidv4()
    const itemCuerpo = { id: idUnico2, titulo: tituloContenido, contenido: null }
    setLoading(true)
    const formData = new FormData()
    formData.append('cuerpo', JSON.stringify(itemCuerpo))
    formData.append('_method', 'PUT')
    const respuesta = await axios.post(`${Global.url}/gestor/update/${idTablero ?? ''}`, formData, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    const idRespuesta = respuesta.data.registro.id
    const respuestaCuerpo = respuesta.data.registro.contenido
    const idUnico = uuidv4()

    const updatedContenido = respuestaCuerpo?.contenido
      ? [...respuestaCuerpo.contenido, { id: idUnico, titulo: tituloContenido, contexto: null }]
      : [{ id: idUnico, titulo: tituloContenido, contexto: null }]

    const data = new FormData()
    data.append('contenido', JSON.stringify(updatedContenido))
    data.append('idCuerpo', idRespuesta)
    data.append('_method', 'PUT')
    try {
      const respuesta2 = await axios.post(`${Global.url}/gestor/updateContenido/${idTablero ?? ''}`, data, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      if (respuesta2.data.status == 'success') {
        const cod = uuidv4()
        updateIDItemTarjetaAction(idRespuesta, respuesta2.data.registro, cod, tituloContenido, idTablero, startDate)
      } else {
        toast.error('Error al crear tablero')
      }
    } catch (error) {
      console.log(error)
      toast.error('Error al crear tablero')
      setLoading(false)
    }
  }

  const handleNavigate = (date: Date): void => {
    const newYear = moment(date).year()
    const newMonth = moment(date).month()
    setCurrentYear(newYear)
    setCurrentMonth(newMonth)
  }

  useEffect(() => {
    Promise.all([getClientes('getClientes', setclientes), getDataToPlanes('getPlanes', setplanes, setTotalRegistros2)]).then(() => {
      setLoading(false)
    })
    moment.updateLocale('es', null) // Limpiar configuraciones previas
    moment.locale('es', {
      months: 'Enero_Febrero_Marzo_Abril_Mayo_Junio_Julio_Agosto_Septiembre_Octubre_Noviembre_Diciembre'.split('_'),
      monthsShort: 'ene_feb_mar_abr_may_jun_jul_ago_sep_oct_nov_dic'.split('_'),
      weekdays: 'domingo_lunes_martes_miércoles_jueves_viernes_sábado'.split('_'),
      weekdaysShort: 'dom_lun_mar_mié_jue_vie_sáb'.split('_'),
      weekdaysMin: 'do_lu_ma_mi_ju_vi_sá'.split('_'),
      week: {
        dow: 1, // Monday is the first day of the week
        doy: 4 // The week that contains Jan 4th is the first week of the year
      }
    })
  }, [])

  useEffect(() => {
    getCitas()
  }, [currentYear, currentMonth])

  useEffect(() => {
    setTimeout(() => {
      if (showError != null) {
        setShowError(null)
      }
    }, 3000)
  }, [showError])

  const handleSelectSlot = async (_slotInfo: { start: Date, end: Date }): Promise<void> => {
    // Obtén la lista de tableros (puede ser desde un estado global, API, etc.)
    if (tableros.length === 0) {
      Swal.fire({
        icon: 'error',
        title: 'No hay tableros disponibles',
        text: 'Por favor, crea un tablero antes de añadir un evento.'
      })
      return
    }
    // Muestra un cuadro de diálogo con el selector de tableros
    const { value: formValues } = await Swal.fire({
      title: 'Crear evento',
      html: `
        <select id="tablero" class="swal2-input">
          ${tableros.map((tablero) => `<option value="${tablero.id}">${tablero.titulo}</option>`).join('')}
        </select>
        <input id="nombreEvento" class="swal2-input" placeholder="Nombre del evento" />
      `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: 'Crear evento',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const tableroId = (document.getElementById('tablero') as HTMLSelectElement)?.value
        const nombreEvento = (document.getElementById('nombreEvento') as HTMLInputElement)?.value
        if (!tableroId || !nombreEvento) {
          Swal.showValidationMessage('Por favor selecciona un tablero y escribe un nombre.')
        }
        return { tableroId, nombreEvento }
      }
    })
    // Si el usuario confirma, crea el evento
    if (formValues) {
      const startDate = _slotInfo.start // Fecha de inicio
      updateContenido(formValues.nombreEvento, formValues.tableroId, startDate)
    }
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between gap-3 items-center border-b border-gray-300  py-1 md:py-0 lg:h-[10vh] mx-1 md:px-8">
        <div className="w-full flex gap-3 items-center">
          <div className="w-12 md:w-14 h-10 md:h-14 rounded-md bg-gradient-to-r from-cyan-500 to-blue-400 flex justify-center text-black text-base md:text-2xl items-center font-extrabold">
            {auth.name.trim() !== '' ? auth.name.charAt(0).toUpperCase() : ''}
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-black font-bold text-sm md:text-lg">Espacio de trabajo de {auth.name.toUpperCase()}</h1>
            <div className="flex gap-2 justify-start">
              <span className="text-gray-600 text-sm">Logos Perú</span>
            </div>
          </div>
        </div>
        <div className="w-full flex lg:justify-end gap-3">
          <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl">
            <span className="bg-red-500 w-4 h-4 lg:w-6 lg:h-6 block rounded-full"></span>
            <span className="flex text-black font-medium"> {'< 50%'} </span>
          </div>
          <div className="flex items-center gap-2  bg-white px-2 py-1 rounded-xl">
            <span className="bg-yellow-500 w-4 h-4 lg:w-6 lg:h-6 block rounded-full"></span>
            <span className="flex text-black font-medium"> {'> 50%'} </span>
          </div>
          <div className="flex items-center gap-2  bg-white px-2 py-1 rounded-xl">
            <span className="bg-green-500 w-4 h-4 lg:w-6 lg:h-6 block rounded-full"></span>
            <span className="flex text-black font-medium"> {'100%'} </span>
          </div>
        </div>
      </div>
      <section className="w-full h-[90vh] px-4 lg:p-6 relative">
        <div className="w-full flex flex-col-reverse gap-2 pl-6 py-3 lg:py-0 md:gap-0 items-center md:flex-row justify-between">
          <HeaderGestor />
        </div>
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="w-full h-full lg:px-6 mt-3">
              <Calendar
                className="calendario_tareas  text-black"
                localizer={localizer}
                events={events}
                startAccessor="start"
                endAccessor="end"
                selectable={true}
                messages={messages}
                views={['day', 'week', 'month']}
                defaultView="month"
                min={workDayStart}
                max={workDayEnd}
                components={components}
                onSelectSlot={handleSelectSlot} // Manejador para crear eventos
                onNavigate={handleNavigate}
                date={moment().set('month', currentMonth).set('year', currentYear).toDate()} // Establece el mes y año en el calendario
              />
            </div>
          </>
        )}
        <ModalClientes clientes={clientes} open={open} setOpen={setOpen} handleClientSelection={handleClientSelection} />
        <ModalCitaView open={openView} setOpen={setOpenView} getUsuarios={getCitas} usuarios={usuarios} />
        <ModalCitaVistaExterna open={openVistaPrevia} setOpen={setOpenVistaPrevia} getUsuarios={getCitas} usuarios={usuarios} />
        <AnimatePresence>{showError != null && <AlertSucess showError={showError} />}</AnimatePresence>
      </section>
    </>
  )
}
