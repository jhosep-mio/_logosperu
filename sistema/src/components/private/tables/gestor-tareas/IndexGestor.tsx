/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-unused-expressions */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable multiline-ternary */
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
import useAuth from '../../../../hooks/useAuth'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'
import moment from 'moment'
import Swal from 'sweetalert2'
import { Global } from '../../../../helper/Global'
import axios from 'axios'
import { Loading } from '../../../shared/Loading'
import { toast } from 'sonner'
import { type gestorTareas } from '../../../shared/schemas/Interfaces'
import { FaRegTrashAlt } from 'react-icons/fa'
import { cn } from '../../../shared/cn'
import { HeaderGestor } from './components/HeaderGestor'

export const IndexGestor = (): JSX.Element => {
  const { setTitle, auth } = useAuth()
  const [events, setEvents] = useState<Event[]>([])
  const [gestor, setGestor] = useState<gestorTareas[]>([])
  const [loading, setLoading] = useState(true)
  const [contenidos, setContenidos] = useState<any[]>([])
  const [currentMonth, setCurrentMonth] = useState(new Date().getMonth())
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear())
  const [showAll, setShowAll] = useState(false)
  const [order, setOrder] = useState('desc')

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
  const updateAction = async (item: any): Promise<string> => {
    const data = new FormData()
    data.append('evento', JSON.stringify(item))
    data.append('cuerpo', '')
    data.append('titulo', item.title)
    data.append('id_user', auth.id)

    try {
      const respuesta = await axios.post(`${Global.url}/gestor/register`, data, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })

      if (respuesta.data.status === 'success') {
        getTareas()
        return 'Tablero creado' // Mensaje de éxito
      } else {
        throw new Error('Error al crear tablero')
      }
    } catch (error) {
      throw new Error('Error al crear tablero')
    }
  }
  const updateCita = async (item: any): Promise<void> => {
    toast.promise(updateAction(item), {
      loading: 'Cargando...',
      success: (message: any) => message, // Muestra el mensaje de éxito
      error: (error: any) => error.message // Muestra el mensaje de error
    })
  }
  const deleteGestorRequest = async (id: number): Promise<string> => {
    try {
      const respuesta = await axios.delete(`${Global.url}/gestor/deleteGestor/${id}`, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      if (respuesta.data.status === 'success') {
        getTareas()
        return 'Tablero eliminado' // Mensaje de éxito
      } else {
        throw new Error('Error al eliminar tablero')
      }
    } catch (error) {
      throw new Error('Error al eliminar tablero')
    }
  }
  const deleteGestor = (id: number): void => {
    toast('¿Deseas eliminar este tablero?', {
      action: {
        label: 'Eliminar',
        onClick: () => {
          toast.promise(deleteGestorRequest(id), {
            loading: 'Eliminando...',
            success: (message: any) => message,
            error: (error: any) => error.message
          })
        }
      },
      style: { background: '#f8d7da', color: '#721c24' },
      duration: 5000
    })
  }

  const getTareas = async (): Promise<void> => {
    setLoading(true)
    try {
      const params: Record<string, any> = showAll ? { order } : { year: currentYear, month: currentMonth + 1, order }
      const { data } = await axios.get(`${Global.url}/gestor/findOne/${auth.id}`, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? `Bearer ${token}` : ''}`
        },
        params
      })
      console.log(data)
      const { data: contenidos } = await axios.get(`${Global.url}/gestorContenido/findByDate/${auth.id}`, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? `Bearer ${token}` : ''}`
        },
        params
      })
      setContenidos(contenidos)
      setGestor(data)
      const request = await axios.get(`${Global.url}/getTareas/${auth.id}`, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? `Bearer ${token}` : ''}`
        }
      })

      if (request.data[0].gestor_tareas) {
        const parsedEvents = JSON.parse(request.data[0].gestor_tareas).map((event: any) => ({
          ...event,
          start: moment(event.start).toDate(),
          end: moment(event.end).toDate()
        }))

        // Ordenar tareas basado en el estado de 'order'
        const sortedEvents = [...parsedEvents].sort((a, b) => {
          if (order === 'asc') {
            return new Date(b.start).getTime() - new Date(a.start).getTime()
          } else if (order === 'desc') {
            return new Date(a.start).getTime() - new Date(b.start).getTime()
          }
          return 0 // Orden por defecto
        })

        setEvents(sortedEvents)
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const handleAddEvent = (): void => {
    const currentDate = new Date()
    const hoy = new Date()
    Swal.fire({
      title: 'Nombre del tablero',
      input: 'text',
      inputPlaceholder: 'Nombre del tablero',
      showCancelButton: true,
      confirmButtonText: 'Crear tablero',
      cancelButtonText: 'Cancelar'
    }).then((inputResult) => {
      if (inputResult.isConfirmed && inputResult.value) {
        const newEvent = {
          title: inputResult.value,
          start: currentDate,
          end: currentDate,
          fecha: hoy
        }
        updateCita(newEvent)
      }
    })
  }
  useEffect(() => {
    getTareas()
    setTitle('Logos Perú')
  }, [currentYear, currentMonth, order, showAll])
  const eventos = [...events]
  const calcularPorcentaje = (arrayList: any): string => {
    if (arrayList.length === 0) return '0' // Evitar dividir por cero si no hay elementos en la lista
    const countChecked = arrayList.filter((item: any) => item.check).length
    return ((countChecked / arrayList.length) * 100).toFixed(0)
  }
  const filteredEvents = eventos.filter((event: any) => {
    if (showAll) return true // Si "Mostrar todo" está activo, incluir todos los elementos
    const eventDate = new Date(event.start) // Asegúrate de que `event.start` sea una fecha válida
    return eventDate.getMonth() === currentMonth && eventDate.getFullYear() === currentYear
  })
  const calcularPorcentajeGeneral = (tablero: any): number | null => {
    let porcentajeGeneral: number | null = null
    let totalCheckedItems = 0
    if (tablero.cuerpo) {
      const cuerpo = JSON.parse(tablero?.cuerpo)
      if (Array.isArray(cuerpo)) {
        cuerpo.forEach((itemCuerpo: any) => {
          itemCuerpo?.contenido?.forEach((idContenido: any) => {
            const findContenido = contenidos.find((contenido: any) => contenido.idContexto == idContenido?.contexto)
            if (findContenido?.checklist) {
              totalCheckedItems++
              const countChecked = JSON.parse(findContenido?.checklist).filter((item: any) => item.check).length
              const porcentaje = ((countChecked / JSON.parse(findContenido?.checklist).length) * 100).toFixed(0)
              // @ts-expect-error
              porcentajeGeneral += Number(porcentaje)
            }
          })
        })
      }
    }
    let resultadoFinal: number | null = null
    if (totalCheckedItems > 0) {
      // @ts-expect-error
      resultadoFinal = porcentajeGeneral / totalCheckedItems
    }
    return resultadoFinal
  }
  const years = Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - 5 + i) // Lista de años, 5 atrás y 5 adelante
  const months = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

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
      <section className="w-full h-[90vh] px-4 lg:px-6 relative">
        <div className="pt-0 md:p-6 flex flex-col">
          <div className="flex flex-col-reverse gap-2 md:gap-0 items-center md:flex-row justify-between">
            <HeaderGestor />
            <div className="flex gap-4 items-center">
              <div>
                <label htmlFor="year-select" className="block text-sm font-medium text-gray-700">
                  Año
                </label>
                <select
                  id="year-select"
                  value={currentYear}
                  onChange={(e) => {
                    setCurrentYear(Number(e.target.value))
                  }}
                  className="px-2 py-0 bg-gray-300 text-base text-gray-500 border rounded"
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="month-select" className="block text-sm font-medium text-gray-700">
                  Mes
                </label>
                <select
                  id="month-select"
                  value={currentMonth}
                  onChange={(e) => {
                    setCurrentMonth(Number(e.target.value))
                  }}
                  className="px-2 py-0 bg-gray-300 text-base text-gray-500 border rounded"
                >
                  {months.map((month, index) => (
                    <option key={index} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label htmlFor="order-select" className="block text-sm font-medium text-gray-700">
                  Ordenar
                </label>
                <select
                  id="order-select"
                  value={order}
                  onChange={(e) => {
                    setOrder(e.target.value)
                  }}
                  className="px-2 py-0 bg-gray-300 text-base text-gray-500 border rounded"
                >
                  <option value="desc">Descendente</option>
                  <option value="asc">Ascendente</option>
                </select>
              </div>
              <div>
                <button
                  onClick={() => {
                    setShowAll(!showAll)
                  }} // Activar "Mostrar todo"
                  className={cn('px-4 py-0  rounded mt-4', showAll ? 'bg-blue-500 text-white ' : 'bg-gray-300 text-gray-500')}
                >
                  Mostrar Todo
                </button>
              </div>
            </div>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <section className="mt-4 grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-5 2xl:grid-cols-6 relative">
              <div
                onClick={handleAddEvent}
                className={
                  'w-full h-[100px] md:h-[150px] bg-center overflow-hidden rounded-md p-4 before:bg-black/40 before:inset-0 before:absolute relative  hover:before:bg-black/35 transition-colors before:transition-colors cursor-pointer'
                }
              >
                <p className="text-sm md:text-lg text-white font-bold absolute inset-0 w-full h-full m-auto flex items-center justify-center mb-1">
                  Crear nuevo tablero
                </p>
              </div>
              {gestor?.map((item: gestorTareas, index: number) => {
                const resultadoFinal = calcularPorcentajeGeneral(item)
                return (
                  <Link
                    to={`/admin/gestor-tareas/findOne/${item.id}/image/${index}`}
                    key={item.id}
                    style={{
                      backgroundImage: `url(${getImageUrl(index) ?? ''})`
                    }}
                    className={
                      'w-full h-[100px] overflow-hidden md:h-[150px] bg-center rounded-md p-4 before:bg-black/40 before:inset-0 before:absolute relative hover:before:bg-black/30 transition-colors before:transition-colors cursor-pointer group'
                    }
                  >
                    <FaRegTrashAlt
                      onClick={async (e: any) => {
                        e.preventDefault()
                        deleteGestor(item.id)
                      }}
                      className="top-2 right-2 transition-all absolute opacity-0 group-hover:opacity-100 text-lg hover:text-gray-400"
                    />
                    {resultadoFinal == 100 ? (
                      <span className="bg-green-500 w-6 h-6 absolute top-1 right-1 rounded-full"></span>
                    ) // @ts-expect-error
                      : resultadoFinal >= 50 ? (
                      <span className="bg-yellow-500 w-6 h-6 absolute top-1 right-1 rounded-full"></span>
                      ) : (
                        resultadoFinal != null && <span className="bg-red-500 w-6 h-6 absolute top-1 right-1 rounded-full"></span>
                      )}
                    <p className="text-sm md:text-lg text-white font-bold absolute top-2 left-4">{item.titulo}</p>
                    <span className="absolute bottom-2 right-2 text-md font-bold text-white">{format(new Date(item.created_at), 'd/MM/yyyy')}</span>
                  </Link>
                )
              })}
              {filteredEvents?.reverse().map((producto: any, index: number) => {
                let porcentajeGeneral: number | null = null
                let totalCheckedItems = 0
                producto?.contenido?.forEach((contenidoItem: any) => {
                  contenidoItem?.contenido?.forEach((contenidoItem2: any) => {
                    const checklist = contenidoItem2.contexto?.checklist ?? []
                    if (checklist.length > 0) {
                      const porcentaje = calcularPorcentaje(checklist)
                      // @ts-expect-error
                      porcentajeGeneral += Number(porcentaje)
                      totalCheckedItems++
                    }
                  })
                })
                let resultadoFinal: number | null = null
                if (totalCheckedItems > 0) {
                  // @ts-expect-error
                  resultadoFinal = porcentajeGeneral / totalCheckedItems
                }
                return (
                  <Link
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    to={`${auth.id}/view/${producto.id}/image/${index}`}
                    key={producto.id}
                    style={{
                      backgroundImage: `url(${getImageUrl(index) ?? ''})`
                    }}
                    className={
                      'w-full h-[100px]  overflow-hidden md:h-[150px] bg-center rounded-md p-4 before:z-10 before:bg-black/70 before:inset-0 before:absolute relative hover:before:bg-black/50 transition-colors before:transition-colors cursor-pointer'
                    }
                  >
                    {resultadoFinal == 100 ? (
                      <span className="bg-green-500 w-6 h-6 absolute top-1 right-1 rounded-full"></span>
                    ) // @ts-expect-error
                      : resultadoFinal > 50 ? (
                      <span className="bg-yellow-500 w-6 h-6 absolute top-1 right-1 rounded-full"></span>
                      ) : (
                        resultadoFinal != null && <span className="bg-red-500 w-6 h-6 absolute top-1 right-1 rounded-full"></span>
                      )}
                    <p className="text-sm md:text-lg text-white font-bold absolute">{format(new Date(producto.fecha), 'd/MM/yyyy')}</p>
                    {/* <span className='absolute bottom-2 right-2 text-md font-bold text-white'></span> */}
                  </Link>
                )
              })}
            </section>
          )}
        </div>
      </section>
    </>
  )
}
