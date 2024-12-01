/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Link, useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { Global } from '../../../../../helper/Global'
import axios from 'axios'
import { toast } from 'sonner'
import moment from 'moment'
import { IoIosArrowRoundBack } from 'react-icons/io'
export const Reporte = (): JSX.Element => {
  const { id } = useParams()
  const [events, setEvents] = useState<Event[]>([])
  const token = localStorage.getItem('token')
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [horasTrabajadas, setHorasTrabajadas] = useState(0)
  const [horasTrabajadasPorSemana, setHorasTrabajadasPorSemana] = useState([])

  const getHorarioLaboral = async (): Promise<void> => {
    try {
      const request = await axios.get(
        `${Global.url}/indexHorarioLaboral/${id ?? ''}`,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      if (request.data) {
        const horario = JSON.parse(request.data.horario_laboral)
          ? JSON.parse(request.data.horario_laboral)
          : []
        setEvents(horario)
      }
    } catch (error) {
      console.error('Error al obtener el horario laboral:', error)
    } finally {
    //   setLoading(false)
    }
  }

  const calcularTiempoTrabajadoActividades = (actividades: any[]): number => {
    let tiempoTrabajado = 0
    actividades.forEach((actividad: any) => {
      if (actividad.horaInicio && actividad.horaFin) {
        const horaInicio = new Date(`2024-03-18 ${actividad.horaInicio}`)
        const horaFin = new Date(`2024-03-18 ${actividad.horaFin}`)

        if (!isNaN(horaInicio.getTime()) && !isNaN(horaFin.getTime())) {
          let diffMs = horaFin.getTime() - horaInicio.getTime()

          // Ajustar el tiempo si los minutos terminan en _:59
          if (actividad.horaFin.endsWith(':59')) {
            diffMs += 60000 // Sumar un minuto en milisegundos
          }

          tiempoTrabajado += diffMs
        }
      }
    })

    // Convertir el tiempo a horas y minutos
    const horas = Math.floor(tiempoTrabajado / (1000 * 60 * 60))
    const minutos = Math.floor(
      (tiempoTrabajado % (1000 * 60 * 60)) / (1000 * 60)
    )

    // Puedes devolver el tiempo en el formato que necesites, como un objeto { horas, minutos }
    // o simplemente la cantidad total de minutos, dependiendo de tus necesidades
    return horas * 60 + minutos
  }

  const calcularSemanaDelMes = (fecha: moment.Moment): number => {
    const primerDiaMes = fecha.clone().startOf('month')
    const primerDiaSemana = primerDiaMes.clone().startOf('week')
    const diffDias = fecha.diff(primerDiaSemana, 'days')
    return Math.ceil((diffDias + 1) / 7)
  }

  const [activeData, setActiveData] = useState(false)

  const obtenerSumatoriaTiempoTrabajadoActividades = (): void => {
    setActiveData(true)
    if (selectedDate) {
      const fechaSeleccionada = moment(selectedDate)
      const mesActual = fechaSeleccionada.month()
      const añoActual = fechaSeleccionada.year()
      const semanas = Array.from({ length: 5 }, (_, index) => index + 1)
      const horasPorSemana = semanas.map((semana) => {
        let sumatoriaTiempoTrabajado = 0
        const eventosProcesados = new Set()
        events.forEach((event: any) => {
          if (event.timeRanges) {
            event.timeRanges.forEach((timeRange: any) => {
              const start = moment(timeRange.start)
              const eventId = event.id
              if (!eventosProcesados.has(eventId)) {
                eventosProcesados.add(eventId)
                if (
                  start.month() === mesActual &&
                  start.year() === añoActual &&
                  calcularSemanaDelMes(start) === semana
                ) {
                  if (event.detalle) {
                    Object.values(event.detalle).forEach((detalle: any) => {
                      const actividadesSemana = detalle.filter(
                        (actividad: any) => {
                          const actividadDate = moment(
                            `${start.format('YYYY-MM-DD')} ${
                              actividad.horaInicio
                            }`
                          )
                          return (
                            actividadDate.month() === mesActual &&
                            actividadDate.year() === añoActual &&
                            calcularSemanaDelMes(actividadDate) === semana
                          )
                        }
                      )
                      const tiempoTrabajado =
                        calcularTiempoTrabajadoActividades(actividadesSemana)
                      sumatoriaTiempoTrabajado += tiempoTrabajado
                    })
                  }
                }
              }
            })
          }
        })
        return sumatoriaTiempoTrabajado
      })
      // @ts-expect-error
      setHorasTrabajadasPorSemana(horasPorSemana)

      setHorasTrabajadas(
        horasPorSemana.reduce((total, horas) => total + horas, 0)
      )
    } else {
      toast.warning('Seleccione una fecha')
    }

    setActiveData(false)
  }

  useEffect(() => {
    getHorarioLaboral()
  }, [])

  const formatTiempoTrabajado = (tiempoTrabajado: number): string => {
    let horas = Math.floor(tiempoTrabajado / 60) // Convertir minutos a horas
    let minutos = tiempoTrabajado % 60 // Obtener los minutos restantes

    // Redondear hacia arriba si los minutos son mayores o iguales a 30
    if (minutos == 60) {
      horas++
      minutos = 0
    }
    // Formatear el resultado en el formato deseado
    const horasFormateadas = horas.toString().padStart(2, '0')
    const minutosFormateados = minutos.toString().padStart(2, '0')
    return `${horasFormateadas}:${minutosFormateados}`
  }

  const formatDate = (): any => {
    return selectedDate ? moment(selectedDate).format('YYYY-MM') : ''
  }

  const handleDateChange = (e: any): void => {
    const { value } = e.target
    const [year, month] = value.split('-').map(Number)
    if (year > 2023) {
      setSelectedDate(new Date(year, month - 1, 1))
    }
  }

  return (
    <>
      <section className="flex  items-center justify-between bg-white border-b border-gray-300 h-[7%] py-1 md:py-0 lg:h-[8%]  md:px-8">
        <div className="flex gap-3 items-center ">
          <div className="w-10 md:w-12 h-full md:h-12 rounded-md bg-gradient-to-r from-[#54A9DC] to-[#2989c4] flex justify-center text-white text-base md:text-2xl items-center font-extrabold">
            R
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-[#252525] font-bold text-[12px] md:text-lg">
              REPORTE MENSUAL
            </h1>
            <div className="flex gap-2 justify-start">
              <span className="hidden md:block text-gray-700 font-medium text-sm">
                Logos Perú
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-4 justify-end">
          <Link
            to={`/admin/colaboradores/horario-laboral/${id ?? ''}`}
            className="bg-gray-400 hover:bg-main transition-colors cursor-pointer text-white px-2 py-1 rounded-md "
          >
            Horario laboral
          </Link>
        </div>
      </section>

      <section className="flex flex-col md:flex-row justify-between mt-12">
        <section className="w-full flex justify-center md:justify-start gap-6 p-8">
          <input
            type="month"
            value={formatDate()}
            onChange={handleDateChange}
            className="bg-white rounded-md px-4 text-black"
            min="2023-01"
            max="2030-12"
          />{' '}
          <button
            className="bg-green-600 px-4 py-2 rounded-md text-white  hover:bg-green-700 active:scale-90 transition-all"
            onClick={() => {
              obtenerSumatoriaTiempoTrabajadoActividades()
            }}
          >
            Generar reporte
          </button>
        </section>

        <section className="w-full p-8 px-4 pt-0 md:p-8 flex flex-col md:flex-row items-center justify-center md:justify-end">
          {horasTrabajadas > 0 && (

            <>
            <span className="text-black uppercase bg-white rounded-lg px-4 py-2">
              Horas trabajadas en el mes:{' '}

            </span>
            <span className='font-bold w-fit mt-2 mx-auto justify-center text-center text-white bg-green-500 px-4 py-1 rounded-full flex items-center'>
              {formatTiempoTrabajado(horasTrabajadas)} H.
          </span>

            </>
          )}
        </section>

      </section>

      {horasTrabajadasPorSemana.length > 0 &&
        <section className="w-full px-8">
            <div className="bg-white rounded-2xl flex flex-row md:flex-col overflow-hidden">
              <section className="w-1/2 md:w-full grid justify-center grid-cols-1 md:grid-cols-5 rounded-none md:rounded-tl-2xl md:rounded-tr-2xl overflow-hidden">
                  <div className="w-full flex justify-center px-2 md:px-5 py-4 md:py-6 bg-[#7FB3D5]">
                    <span className="text-center text-white text-xl font-semibold flex items-center justify-center">Semana 1</span>
                  </div>
                  <div className="w-full flex justify-center px-2 md:px-5 py-4 md:py-6 bg-[#7FB3D5]">
                    <span className="text-center text-white text-xl font-semibold flex items-center justify-center">Semana 2</span>
                  </div>
                  <div className="w-full flex justify-center px-2 md:px-5 py-4 md:py-6 bg-[#7FB3D5]">
                    <span className="text-center text-white text-xl font-semibold flex items-center justify-center">Semana 3</span>
                  </div>
                  <div className="w-full flex justify-center px-2 md:px-5 py-4 md:py-6 bg-[#7FB3D5]">
                    <span className="text-center text-white text-xl font-semibold flex items-center justify-center">Semana 4</span>
                  </div>
                  <div className="w-full flex justify-center px-2 md:px-5 py-4 md:py-6 bg-[#7FB3D5]">
                    <span className="text-center text-white text-xl font-semibold flex items-center justify-center">Semana 5</span>
                  </div>
              </section>
              <section className="w-1/2 md:w-full grid grid-cols-1 md:grid-cols-5 justify-center">

                  {horasTrabajadasPorSemana.map((horasSemana, index) => (
                  <div className="w-full flex justify-center py-4" key={index}>

                  {activeData ? (<div>hola</div>) : <span className='text-black'>{formatTiempoTrabajado(horasSemana)} H.</span>}

                  </div>
                  ))}
              </section>
            </div>
        </section>
      }

      <section className='flex justify-center py-12'>
      <Link
            to={`/admin/colaboradores/horario-laboral/${id ?? ''}`}
            className="bg-main hover:bg-main flex items-center transition-all cursor-pointer text-white px-2 py-1 rounded-md gap-1 active:scale-90"
          >
            <IoIosArrowRoundBack className="text-2xl"/>Regresar
          </Link>
      </section>
    </>
  )
}
