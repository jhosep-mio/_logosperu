import { useEffect, useState } from 'react'
import {
  imagen1,
  imagen10,
  imagen11,
  imagen12,
  imagen13,
  imagen14,
  imagen15,
  imagen16,
  imagen17,
  imagen18,
  imagen19,
  imagen2,
  imagen20,
  imagen21,
  imagen22,
  imagen23,
  imagen3,
  imagen4,
  imagen5,
  imagen6,
  imagen7,
  imagen8,
  imagen9
} from '../../../shared/Images'
import { IoCalendarOutline, IoPersonOutline } from 'react-icons/io5'
import useAuth from '../../../../hooks/useAuth'
import { Link, useParams } from 'react-router-dom'
import { format } from 'date-fns'
import moment from 'moment'
import { es } from 'date-fns/locale'
import { Global } from '../../../../helper/Global'
import axios from 'axios'
import { Loading } from '../../../shared/Loading'

export const IndexGestorColaborador = (): JSX.Element => {
  const { idCol, nameCol } = useParams()
  const { setTitle } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const totalImages = 23
  const getImageUrl = (index: number): string => {
    // Asegúrate de tener todas las imágenes importadas
    const images = [
      imagen1,
      imagen2,
      imagen3,
      imagen4,
      imagen5,
      imagen6,
      imagen7,
      imagen8,
      imagen9,
      imagen10,
      imagen11,
      imagen12,
      imagen13,
      imagen14,
      imagen15,
      imagen16,
      imagen17,
      imagen18,
      imagen19,
      imagen20,
      imagen21,
      imagen22,
      imagen23
    ]
    // Calcula el índice basado en la longitud de las imágenes
    const calculatedIndex = index % totalImages
    // Devuelve la URL de la imagen correspondiente
    return images[calculatedIndex]
  }

  const token = localStorage.getItem('token')

  const getTareas = async (): Promise<void> => {
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
    setLoading(false)
  }

  const fechaActual = new Date() // Tu variable que contiene la fecha actual

  useEffect(() => {
    getTareas()
    setTitle('Logos Perú')
  }, [])

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
      <section className="w-full h-[90vh] px-6 relative">
        <div className="pt-0 md:p-6 flex flex-col">
          <div className="flex flex-col-reverse gap-2 md:gap-0 items-center md:flex-row justify-between">
            <div className="flex gap-10">
              <p className="flex items-center gap-3 text-base md:text-lg font-semibold text-cyan-700 cursor-pointer">
                <IoPersonOutline className="text-xl" /> Tus tableros
              </p>
              <Link
                to={`/admin/colaboradores/gestor_tareas/${idCol ?? ''}/${nameCol ?? ''}/calendario`}
                className="flex items-center gap-3 text-base md:text-lg font-semibold text-black hover:text-cyan-700 transition-colors cursor-pointer"
              >
                <IoCalendarOutline className="text-xl" /> Calendario
              </Link>
            </div>
            <p className="text-mds first-letter:uppercase md:text-lg font-semibold text-gray-400 transition-colors cursor-pointer">
              {format(fechaActual, 'MMMM-yyyy', { locale: es })}
            </p>
          </div>

          {loading
            ? <Loading />

            : (
            <section className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6 relative">
              {events?.map((producto: any, index: number) => (
                <Link
                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                  to={`/admin/colaboradores/gestor_tareas/${idCol ?? ''}/${nameCol ?? ''}/${idCol ?? ''}/view/${producto.id}/image/${index}`}
                  key={producto.id}
                  style={{
                    backgroundImage: `url(${getImageUrl(index) ?? ''})`
                  }}
                  className={
                    'w-full h-[100px] overflow-hidden md:h-[150px] bg-center rounded-md p-4 before:bg-black/30 before:inset-0 before:absolute relative  hover:before:bg-black/10 transition-colors before:transition-colors cursor-pointer'
                  }
                >
                  <p className="text-sm md:text-lg text-white font-bold absolute">
                    {format(new Date(producto.fecha), 'd/MM/yyyy')}
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
