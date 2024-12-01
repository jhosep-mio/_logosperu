/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import moment from 'moment'
import { useState, useEffect } from 'react'
import { Loading } from '../../../shared/Loading'
import { PorColaborador } from './graficos/PorColaborador'
import GraficoGeneralRedes from './graficos/GraficoGeneralRedes'
import PromedioRedes from './graficos/PromedioRedes'
import PromedioColaborador from './graficos/PromedioColaborador'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { cn } from '../../../shared/cn'

export const MetricasCm = (): JSX.Element => {
  const token = localStorage.getItem('token')
  const [events, setEvents] = useState<Event[]>([])
  const [eventsTopsVisitas, setEventsTopsVisitas] = useState<Event[]>([])
  const [eventsTopsInteracciones, setEventsTopsInteracciones] = useState<
  Event[]
  >([])

  const [loading, setLoading] = useState(true)
  const [promedioGeneral, setPromedioGeneral] = useState(0)
  const [VFacebook, setVFacebook] = useState(0)
  const [IFacebook, setIFacebook] = useState(0)
  const [VInstagram, setVInstagram] = useState(0)
  const [IInstagram, setIInstagram] = useState(0)
  const [promVFacebook, setPromVFacebook] = useState(0)
  const [promIFacebook, setPromIFacebook] = useState(0)
  const [promVInstragram, setPromVInstragram] = useState(0)
  const [promIInstragram, setPromIInstragram] = useState(0)
  const [displayCount, setDisplayCount] = useState(5) // Initial count set to 5

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
        .filter((event: any) => {
          const eventDate = moment(event.start)
          const yearMatch = selectedDate
            ? eventDate.year() === moment(selectedDate).year()
            : true
          const monthMatch = selectedMonth !== null && selectedMonth !== ''
            ? eventDate.month() === Number(selectedMonth)
            : true
          return yearMatch && monthMatch
        })

      let totalCantidadVistas = 0
      let sumaTotalCantidadVistas = 0
      // NUEVO
      let facebookVisitas = 0
      let facebookInteracciones = 0
      let instagramVisitas = 0
      let instagramInteracciones = 0
      // CONTADORES
      // Conteo de datos válidos
      let countFacebookV = 0
      let countInstagramV = 0
      let countFacebookI = 0
      let countInstagramI = 0
      // Iteramos sobre cada evento
      parsedEvents?.forEach((evento: any) => {
        evento?.descripcion?.arrayArchivos?.forEach((arrayArchivo: any) => {
          arrayArchivo?.arrayColaboradores?.forEach((colaborador: any) => {
            if (
              typeof Number(colaborador?.cantidadVistas) == 'number' &&
              !isNaN(colaborador?.cantidadVistas)
            ) {
              sumaTotalCantidadVistas += Number(colaborador?.cantidadVistas)
              totalCantidadVistas++
            }
          })
        })

        Object.entries(
          evento?.descripcion?.visitasInteracciones?.Facebook || {}
        ).forEach(([key, value]) => {
          if (key === 'visitas') {
            facebookVisitas += Number(value) || 0
            countFacebookV++
          } else if (key === 'interacciones') {
            facebookInteracciones += Number(value) || 0
            countFacebookI++
          }
        })

        Object.entries(
          evento?.descripcion?.visitasInteracciones?.Instagram || {}
        ).forEach(([key, value]) => {
          if (key === 'visitas') {
            instagramVisitas += Number(value) || 0
            countInstagramV++
          } else if (key === 'interacciones') {
            instagramInteracciones += Number(value) || 0
            countInstagramI++
          }
        })
      })

      const eventosConVisitas = parsedEvents
        .map((evento: any) => ({
          ...evento,
          sumaTotalVisitas:
            (Number(
              evento.descripcion?.visitasInteracciones?.Facebook?.visitas
            ) || 0) +
            (Number(
              evento.descripcion?.visitasInteracciones?.Instagram?.visitas
            ) || 0)
        }))
        .filter((evento: any) => evento.sumaTotalVisitas > 0)
      eventosConVisitas.sort(
        (a: any, b: any) => b.sumaTotalVisitas - a.sumaTotalVisitas
      )

      const eventosConInteracciones = parsedEvents
        .map((evento: any) => ({
          ...evento,
          sumaTotalVisitas:
            (Number(
              evento.descripcion?.visitasInteracciones?.Facebook?.interacciones
            ) || 0) +
            (Number(
              evento.descripcion?.visitasInteracciones?.Instagram?.interacciones
            ) || 0)
        }))
        .filter((evento: any) => evento.sumaTotalVisitas > 0)
      eventosConInteracciones.sort(
        (a: any, b: any) => b.sumaTotalVisitas - a.sumaTotalVisitas
      )

      setEventsTopsVisitas(eventosConVisitas)
      setEventsTopsInteracciones(eventosConInteracciones)

      const promedioGeneral2 =
        totalCantidadVistas > 0
          ? sumaTotalCantidadVistas / totalCantidadVistas
          : 0

      //   PROMEDIO VISITAS FACEBOOK
      const promedioFacebookVisitas =
        countFacebookV > 0 ? facebookVisitas / countFacebookV : 0
      setPromVFacebook(promedioFacebookVisitas)
      //   PROMEDIO Interacciones FACEBOOK
      const promedioFacebookInte =
        countFacebookI > 0 ? facebookInteracciones / countFacebookI : 0
      setPromIFacebook(promedioFacebookInte)

      //   PROMEDIO VISITAS INSTRAGRAM
      const promedioInstagramVisitas =
        countInstagramV > 0 ? instagramVisitas / countInstagramV : 0
      setPromVInstragram(promedioInstagramVisitas)
      //   PROMEDIO Interacciones FACEBOOK
      const promedioInstagramInte =
        countInstagramI > 0 ? instagramInteracciones / countInstagramI : 0
      setPromIInstragram(promedioInstagramInte)

      setPromedioGeneral(promedioGeneral2)
      setEvents(parsedEvents)
      setVFacebook(facebookVisitas)
      setVInstagram(instagramVisitas)
      setIFacebook(facebookInteracciones)
      setIInstagram(instagramInteracciones)
    }
    setLoading(false)
  }

  const currentYear = new Date().getFullYear()
  const [selectedDate, setSelectedDate] = useState(new Date(currentYear, 0, 1))
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const handleChange = (date: any): void => {
    setSelectedDate(date)
  }
  const handleChange222 = (e: any): void => {
    const value = e.target.value
    setSelectedMonth(value === '' ? null : value)
  }

  const monthNames2 = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ]

  useEffect(() => {
    getTareas()
  }, [selectedDate, selectedMonth])

  return (
    <section className="w-full h-[100vh] px-0 relative overflow-y-scroll">
      <div className="pt-0 md:p-0 flex flex-col">
        {loading ? (
          <Loading />
        ) : (
          <section className="grid grid-cols-2 w-full h-fit gap-4 px-4 py-4 ">
            <div className="flex justify-end mb-4 col-span-2">
              <div className="flex flex-col gap-1 mr-3">
                <label htmlFor="" className="text-black font-bold">
                  Año
                </label>
                <DatePicker
                  selected={selectedDate}
                  onChange={handleChange}
                  showYearPicker
                  dateFormat="yyyy"
                  yearItemNumber={9}
                  minDate={new Date(2022, 0, 1)}
                  maxDate={new Date(currentYear, 11, 31)}
                  placeholderText="Select a year"
                  className="bg-red-600 px-2 py-1 rounded-md text-white font-bold w-[100px] outline-none"
                />
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-black font-bold">
                  Mes
                </label>
                <select
                  name=""
                  id=""
                  className="bg-green-600 h-full text-white rounded-md"
                  onChange={handleChange222}
                >
                  <option value="">Seleccionar</option>
                  {monthNames2.map((a, index: number) => (
                    <option
                      value={index}
                      className={cn(
                        'md:text-center lowercase first-letter:uppercase',
                        selectedMonth == String(index) ? 'bg-red-600' : ''
                      )}
                      key={index}
                    >
                      {a}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="w-full h-full bg-white p-4 rounded-lg shadow-md">
              <PromedioColaborador valor={promedioGeneral} />
            </div>
            <div className="w-full h-full bg-white p-4 rounded-lg shadow-md">
              <PorColaborador eventos={events} />
            </div>
            <div className="w-full h-full bg-white p-4 rounded-lg shadow-md">
              <GraficoGeneralRedes
                facebookVisitas={VFacebook}
                facebookInteracciones={IFacebook}
                instagramVisitas={VInstagram}
                instagramInteracciones={IInstagram}
              />
            </div>
            <div className="w-full h-full bg-white p-4 rounded-lg shadow-md">
              <PromedioRedes
                promIFacebook={promIFacebook}
                promIInstagram={promIInstragram}
                promVFacebook={promVFacebook}
                promVInstagram={promVInstragram}
              />
            </div>
            <div className="w-full h-full bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between">
                <h1 className="w-full text-left text-gray-600 font-semibold text-xl ">
                  Eventos Ordenados por Visitas
                </h1>
                <select
                  value={displayCount}
                  className="text-black outline-none"
                  onChange={(e) => {
                    setDisplayCount(Number(e.target.value))
                  }}
                >
                  <option value={5}>Mostrar 5 elementos</option>
                  <option value={10}>Mostrar 10 elementos</option>
                  <option value={20}>Mostrar 20 elementos</option>
                </select>
              </div>
              <ul className="divide-y divide-gray-200 mt-4">
                {eventsTopsVisitas
                  .slice(0, displayCount)
                  .map((evento: any, index: number) => (
                    <li key={index} className="py-2">
                      <div className="flex justify-between items-center">
                        <span className="font-normal text-black">
                          {evento.title}
                        </span>
                        <span className="text-gray-500">
                          {evento.sumaTotalVisitas} visitas
                        </span>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
            <div className="w-full h-full bg-white p-4 rounded-lg shadow-md">
              <div className="flex justify-between">
                <h1 className="w-full text-left text-gray-600 font-semibold text-xl ">
                  Eventos Ordenados por Interacciones
                </h1>
                <select
                  value={displayCount}
                  className="text-black outline-none"
                  onChange={(e) => {
                    setDisplayCount(Number(e.target.value))
                  }}
                >
                  <option value={5}>Mostrar 5 elementos</option>
                  <option value={10}>Mostrar 10 elementos</option>
                  <option value={20}>Mostrar 20 elementos</option>
                </select>
              </div>
              <ul className="divide-y divide-gray-200 mt-4">
                {eventsTopsInteracciones
                  .slice(0, displayCount)
                  .map((evento: any, index: number) => (
                    <li key={index} className="py-2">
                      <div className="flex justify-between items-center">
                        <span className="font-normal text-black">
                          {evento.title}
                        </span>
                        <span className="text-gray-500">
                          {evento.sumaTotalVisitas} Interacciones
                        </span>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </section>
        )}
      </div>
    </section>
  )
}
