import axios from 'axios'
import moment from 'moment'
import { useState, useEffect } from 'react'
import { Global } from '../../../../../helper/Global'
import { Loading } from '../../../../shared/Loading'
import { PorColaborador } from '../../calendario_CM/graficos/PorColaborador'

export const MetricasCm = (): JSX.Element => {
  const token = localStorage.getItem('token')
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const [promedioGeneral, setPromedioGeneral] = useState(0)
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
      let totalCantidadVistas = 0
      let sumaTotalCantidadVistas = 0
      // Iteramos sobre cada evento
      parsedEvents.forEach((evento: any) => {
        // Iteramos sobre cada arrayArchivo dentro del evento
        evento?.descripcion?.arrayArchivos?.forEach((arrayArchivo: any) => {
          // Iteramos sobre cada colaborador dentro del arrayArchivo
          arrayArchivo?.arrayColaboradores?.forEach((colaborador: any) => {
            // Sumamos la cantidadVistas si es un número válido
            if (colaborador.cantidadVistas) {
              sumaTotalCantidadVistas += Number(colaborador.cantidadVistas)
              totalCantidadVistas++
            }
          })
        })
      })
      // Calculamos el promedio
      const promedioGeneral2 =
        totalCantidadVistas > 0
          ? sumaTotalCantidadVistas / totalCantidadVistas
          : 0
      setPromedioGeneral(promedioGeneral2)

      setEvents(parsedEvents)
    }
    setLoading(false)
  }

  useEffect(() => {
    getTareas()
  }, [])

  return (
    <section className="w-full h-[90vh] px-0 relative">
      <div className="pt-0 md:p-0 flex flex-col">
        {loading
          ? <Loading />
          : (
          <section className="grid grid-cols-2 w-full h-fit gap-4 px-4 py-4 ">
            <div className="w-full h-full bg-white p-4 rounded-lg shadow-md">
              <div className="rounded-xl w-fit text-black border bg-white shadow">
                <div className="px-6 py-3 flex flex-row items-center justify-between space-y-0 pb-2">
                  <h3 className="tracking-tight text-sm font-medium">
                    Promedio de vistas por estado
                  </h3>
                </div>
                <div className="p-6 pt-0">
                  <div className="text-2xl font-bold">
                    {promedioGeneral.toFixed(2)}
                  </div>
                </div>
              </div>
            </div>
            <div className="w-full h-full bg-white p-4 rounded-lg shadow-md">
             <PorColaborador eventos={events}/>
            </div>
          </section>
            )}
      </div>
    </section>
  )
}
