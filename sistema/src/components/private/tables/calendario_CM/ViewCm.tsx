import { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import carpeta from './../../../../assets/community/calendario.jpg'
import useAuth from '../../../../hooks/useAuth'
import { Link, useParams } from 'react-router-dom'
import moment from 'moment'
import Swal from 'sweetalert2'
import { Global } from '../../../../helper/Global'
import axios from 'axios'
import { Loading } from '../../../shared/Loading'

export const ViewCm = (): JSX.Element => {
  const { setTitle, auth } = useAuth()
  const { id } = useParams()
  const [eventsGeneral, setEventsGeneral] = useState<Event[]>([])
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')

  const updateCita = async (updatedEvents: Event[]): Promise<void> => {
    const data = new FormData()
    data.append('community', JSON.stringify(updatedEvents))
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/updateGestorComunnity/${auth.id}`,
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
        getTareas()
      } else {
        Swal.fire('Error al guardar', '', 'error')
      }
    } catch (error) {
      Swal.fire('Error', '', 'error')
    }
  }

  const getTareas = async (): Promise<void> => {
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
      setEventsGeneral(parsedEvents)
      const filteredEvents = parsedEvents.filter(
        (event: any) => event.id === id
      )
      if (filteredEvents[0].contenido) {
        setEvents(filteredEvents[0].contenido)
      } else {
        setEvents([])
      }
    }
    setLoading(false)
  }

  const handleAddEvent = (): void => {
    Swal.fire({
      title: 'Ingrese un titulo',
      input: 'text',
      inputPlaceholder: 'Titulo',
      showCancelButton: true,
      confirmButtonText: 'Registrar',
      cancelButtonText: 'Cancelar',
      preConfirm: (name) => {
        if (!name) {
          Swal.showValidationMessage('Por favor ingrese su nombre')
        }
        return name
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const currentDate = new Date()
        const hoy = new Date()
        currentDate.setHours(9, 0, 0, 0)
        // Verificar si ya hay un evento con la misma fecha
        setEvents((prevEvents) => {
          const updatedEvents = [
            ...prevEvents,
            {
              id: uuidv4(),
              title: result.value,
              start: currentDate,
              end: currentDate,
              fecha: hoy,
              calendario: null
            } as unknown as Event
          ]
          handleShardTasks(updatedEvents)
          return updatedEvents
        })
      }
    })
  }

  const handleShardTasks = (contenidoFiltrado: any): void => {
    const actualizado = eventsGeneral.map((event: any) =>
      event.id === id ? { ...event, contenido: contenidoFiltrado } : event
    )
    updateCita(actualizado)
  }

  useEffect(() => {
    getTareas()
    setTitle('CALENDARIO COMUNNITY MANAGER')
  }, [])

  return (
    <>
      <section className="w-full h-[90vh] px-0 relative">
        <div className="pt-0 md:p-0 flex flex-col">
          {loading
            ? <Loading />

            : (
            <section className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6 relative">
              <div
                onClick={handleAddEvent}
                className={
                  'w-full h-[100px] md:h-[200px] bg-center overflow-hidden rounded-md p-4 before:bg-black/40 before:inset-0 before:absolute relative  hover:before:bg-black/35 transition-colors before:transition-colors cursor-pointer'
                }
              >
                <p className="text-sm md:text-lg text-white font-bold absolute inset-0 w-full h-full m-auto flex items-center justify-center mb-1">
                  Crear carpeta
                </p>
              </div>
              {events?.map((producto: any) => (
                <Link
                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                  to={`calendario/${producto.id}`}
                  key={producto.id}
                  style={{
                    backgroundImage: `url(${carpeta})`
                  }}
                  className={
                    'w-full h-[100px] overflow-hidden md:h-[200px] bg-contain bg-center rounded-md p-4 before:bg-black/30 before:inset-0 before:absolute relative  hover:before:bg-black/20 transition-colors before:transition-colors cursor-pointer'
                  }
                >
                  <p className="text-sm md:text-2xl text-white font-bold absolute inset-0 w-full h-full flex justify-center items-center">
                    {producto.title}
                  </p>
                </Link>
              ))}
            </section>
              )}
        </div>
      </section>
    </>
  )
}
