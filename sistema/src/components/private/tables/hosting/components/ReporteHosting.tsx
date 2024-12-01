/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable multiline-ternary */
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import { type ValuesVenta } from '../../../../shared/schemas/Interfaces'
import { useState, useEffect } from 'react'
import SalesChart from '../graficos/SalesChart'
import { Loading } from '../../../../shared/Loading'
import { Top10Clientes } from '../graficos/Top10Clientes'
import { Link } from 'react-router-dom'
import { ModalVentas } from '../modals/ModalVentas'
import { parseISO } from 'date-fns'
import MetricaSoporte from '../graficos/MetricaSoporte'

export const ReporteHosting = (): JSX.Element => {
  const [productos, setProductos] = useState<ValuesVenta[]>([])
  const [, setTotalRegistros] = useState(0)
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')
  const [totalMontosCobrar, setTotalMontosCobrar] = useState(0)
  const [totalMontosPagar, setTotalMontosPagar] = useState(0)
  const [totalHosting, setTotalHosting] = useState(0)
  const [totalDominio, setTotalDominio] = useState(0)
  const [totalDominioHosting, setTotalDominioHosting] = useState(0)
  const [clientes, setClientes] = useState([])
  const [openList, setOpenList] = useState({ estado: false, fecha: null })
  const [cantidadTop, setCantidadTop] = useState(15)
  const [chartData, setChartData] = useState({})
  const [chartDataSoporte, setChartDataSoporte] = useState({})

  const ultimaFecha = (fechas: any): boolean => {
    let ultimaFecha = null
    // Sort the dates in ascending order by year
    if (fechas && fechas.length > 0) {
      fechas.sort((a: any, b: any) => {
        return (
          new Date(a.fecha).getFullYear() - new Date(b.fecha).getFullYear()
        )
      })
      ultimaFecha = fechas[fechas.length - 1] // Obtener la última fecha del array
    }
    if (ultimaFecha) {
      const anoUltimaFecha = parseInt(ultimaFecha.fecha.split('-')[0])
      const anoActual = new Date().getFullYear()
      if (anoUltimaFecha == anoActual) {
        return true
      } else {
        return false
      }
    }
    return false
  }

  const getDataVentas = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getDatosHostingActivos`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setProductos(request.data)
    setTotalRegistros(request.data.length)
    let totalMontosCobrar = 0 // Inicializa el total como 0
    let totalMontosPagar = 0 // Inicializa el total como 0
    let totalPorHosting = 0 // Inicializa el total como 0
    let totalPorDominio = 0 // Inicializa el total como 0
    let totalPorHostingDominio = 0 // Inicializa el total como 0
    const renewalsByClient: any = {}
    request.data.forEach((orden: any) => {
      const hosting = JSON.parse(orden.hosting) || {} // Si hosting es null o undefined, usa un objeto vacío
      if (hosting?.montoC) {
        totalMontosCobrar += Number(hosting.montoC) // Suma el montoC si existe y es un número válido
      }
      if (hosting?.montoP) {
        totalMontosPagar += Number(hosting.montoP) // Suma el montoC si existe y es un número válido
      }
      if (hosting?.tiposervicio == 'Hosting') {
        totalPorHosting += Number(hosting?.montoC) // Suma el montoC si existe y es un número válido
      }
      if (hosting?.tiposervicio == 'Dominio') {
        totalPorDominio += Number(hosting?.montoC) // Suma el montoC si existe y es un número válido
      }
      if (hosting?.tiposervicio == 'Hosting + Dominio') {
        totalPorHostingDominio += Number(hosting?.montoC) // Suma el montoC si existe y es un número válido
      }
      const renewals = hosting?.fechas?.length || 0 // Obtener el número de renovaciones
      const clientName = `${hosting?.nombres ?? ''} ${hosting?.apellidos ?? ''}` // Concatenar nombres y apellidos del cliente
      renewalsByClient[orden.id] = {
        nombreCompleto: clientName,
        renovaciones: renewals,
        dominio: hosting?.dominio
      }
    })
    const renewalsArray: any = Object.entries(renewalsByClient).map(([idHosting, renewals]) => ({ idHosting, renewals }))
    setClientes(renewalsArray)
    setTotalMontosCobrar(totalMontosCobrar)
    setTotalMontosPagar(totalMontosPagar)
    setTotalHosting(totalPorHosting)
    setTotalDominio(totalPorDominio)
    setTotalDominioHosting(totalPorHostingDominio)
    const months = [
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
    const salesByMonth = Array(12).fill(0)
    request.data?.forEach((sale2: any) => {
      const sale = sale2.hosting ? JSON.parse(sale2.hosting) : {}
      const monthIndex = new Date(parseISO(sale.inicio)).getMonth()
      if (sale.fechas) {
        const lastDate = ultimaFecha(sale.fechas)
        if (lastDate) {
          salesByMonth[monthIndex]++
        }
      }
    })
    setChartData({
      labels: months,
      datasets: [
        {
          label: 'Renovación por Mes',
          data: salesByMonth,
          backgroundColor: 'rgba(75, 192, 192, 0.6)', // Color de las barras
          borderColor: 'rgba(75, 192, 192, 1)', // Borde de las barras
          borderWidth: 1
        }
      ]
    })

    const clientSupportCount: any = {}
    const clientTotalMinutes: any = {}

    request.data?.forEach((item: any) => {
      if (item.soporte) {
        const hosting = item?.hosting ? JSON.parse(item?.hosting) : null
        const soporte = item?.soporte ? JSON.parse(item.soporte) : []
        let totalMinutos = 0
        soporte.forEach((minutos: any) => {
          totalMinutos += minutos.horas // Sumar .horas de cada soporte
        })
        const clientName = `${hosting?.nombres} ${hosting?.apellidos}`
        // Inicializar total de minutos si es la primera vez que se encuentra el cliente
        if (!clientTotalMinutes[clientName]) {
          clientTotalMinutes[clientName] = 0
        }
        clientSupportCount[clientName] = (clientSupportCount[clientName] || 0) + soporte.length
        clientTotalMinutes[clientName] += totalMinutos
      }
    })

    const clientNames = Object.keys(clientSupportCount)
    const supportCounts = Object.keys(clientSupportCount).map((clientName) => ({
      clientName,
      count: clientSupportCount[clientName],
      totalMinutes: clientTotalMinutes[clientName] ?? 0 // Obtener total de minutos o establecer a 0 si no existe
    }))

    setChartDataSoporte({
      labels: clientNames,
      datasets: [
        {
          label: 'Soporte',
          data: supportCounts.map((client) => client.count),
          backgroundColor: 'rgba(75, 192, 192, 0.7)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Total de Minutos',
          data: supportCounts.map((client) => client.totalMinutes),
          backgroundColor: 'rgba(255, 206, 86, 0.5)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1
        }
      ]
    })
  }

  const meses = {
    enero: 0,
    febrero: 1,
    marzo: 2,
    abril: 3,
    mayo: 4,
    junio: 5,
    julio: 6,
    agosto: 7,
    septiembre: 8,
    octubre: 9,
    noviembre: 10,
    diciembre: 11
  }

  const filtrarHostings = (): any => {
    let filteredProductos = productos
    if (openList?.fecha && openList?.fecha != null) {
      // @ts-expect-error
      const mesIndex = meses[openList.fecha.toLowerCase()]
      filteredProductos = filteredProductos.filter((pro: any) => {
        const startDate = new Date(parseISO(JSON.parse(pro.hosting).inicio))
        return startDate.getMonth() == mesIndex
      })
    }

    filteredProductos = filteredProductos.filter((pro: any) => {
      if (JSON.parse(pro.hosting).fechas) {
        const lastDate = ultimaFecha(JSON.parse(pro.hosting).fechas)
        return lastDate
      }
    })

    return filteredProductos
  }

  const filtrarClientes = (): any => {
    const ventasFiltrados = [...clientes]
    return ventasFiltrados
  }

  useEffect(() => {
    Promise.all([getDataVentas()]).then(() => {
      setLoading(false)
    })
  }, [])

  return (
    <>
      {!loading ? (
        <section className="px-3 py-2">
          <div className="flex justify-end items-center pb-0 mb-2">
            <Link to='/admin/hosting' className='px-3 py-1 bg-red-600 hover:text-red-700 transition-colors text-white rounded-md text-sm md:text-lg'>Regresar</Link>
          </div>
          <section className="grid grid-cols-1 md:grid-cols-2 w-full h-fit gap-4 ">
            <div className="w-full h-full bg-white px-0 py-2 md:p-4 rounded-lg shadow-md">
              <div className="flex justify-between px-4">
                <h1 className="w-full text-left text-gray-600 font-bold text-base md:text-xl ">
                  Renovación Anual
                </h1>
              </div>
              <section className="w-full p-4 pt-5">
                <div className="w-full flex items-center gap-2 relative pb-5">
                  <label
                    className="text-sm md:text-base w-[230px]  text-gray-600  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="email"
                  >
                    Ventas totales anuales:
                  </label>
                  <p className="text-sm md:text-base text-black font-bold">
                    {(totalMontosCobrar).toLocaleString(
                      'es-PE',
                      {
                        style: 'currency',
                        currency: 'PEN' // Moneda peruana
                      }
                    )}
                  </p>
                </div>
                <div className="w-full flex items-center gap-2 relative pb-5">
                  <label
                    className="text-sm md:text-base w-[230px]  text-gray-600   leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="email"
                  >
                    Pago total de Dominios y Hostings:
                  </label>
                  <p className="text-sm md:text-base text-black font-bold">
                    {totalMontosPagar.toLocaleString('es-PE', {
                      style: 'currency',
                      currency: 'PEN' // Moneda peruana
                    })}
                  </p>
                </div>
                {/* <div className="w-full flex items-center gap-2 relative pb-5">
                  <label
                    className="text-sm md:text-base w-[230px]  text-gray-600   leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="email"
                  >
                    Pago anual HostGator:
                  </label>
                  <p className="text-sm md:text-base text-black font-bold">
                    {(1800).toLocaleString('es-PE', {
                      style: 'currency',
                      currency: 'PEN' // Moneda peruana
                    })}{' '}
                    (150)
                  </p>
                </div> */}
                <div className="w-full flex items-center gap-2 relative pb-5">
                  <label
                    className="text-sm md:text-base w-[230px]  text-gray-600   leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="email"
                  >
                    Pago anual BlueHosting:
                  </label>
                  <p className="text-sm md:text-base text-black font-bold">
                    {(924).toLocaleString('es-PE', {
                      style: 'currency',
                      currency: 'PEN' // Moneda peruana
                    })}{' '}
                    (77)
                  </p>
                </div>
                <span className='border-b border-gray-300 w-full h-2 block mb-3'></span>
                <div className="w-full flex items-center gap-2 relative pb-3">
                  <label
                    className="text-sm md:text-base w-[230px]  text-gray-600   leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="email"
                  >
                    Total ganancia Anual:
                  </label>
                  <p className="text-main font-bold">
                    {(totalMontosCobrar - (totalMontosPagar + 924)).toLocaleString('es-PE', {
                      style: 'currency',
                      currency: 'PEN' // Moneda peruana
                    }) }
                  </p>
                </div>
                <div className="w-full flex items-center gap-2 relative ">
                  <label
                    className="text-sm md:text-base w-[230px]  text-gray-600   leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="email"
                  >
                    Total ganancia Mensual:
                  </label>
                  <p className="text-main font-bold">
                    {((totalMontosCobrar - (totalMontosPagar + 924)) / 12).toLocaleString('es-PE', {
                      style: 'currency',
                      currency: 'PEN' // Moneda peruana
                    }) }
                  </p>
                </div>
              </section>
            </div>
            <div className="w-full h-full bg-white px-0 py-2 md:p-4 rounded-lg shadow-md">
              <div className="flex justify-between px-4">
                <h1 className="w-full text-left text-gray-600 font-bold text-base md:text-xl ">
                  Ingresos por servicio
                </h1>
              </div>
              <section className="w-full p-4 pt-5">
                <div className="w-full flex items-center gap-2 relative pb-5">
                  <label
                    className="text-sm md:text-base w-[230px]  text-gray-600  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="email"
                  >
                    Ventas totales por hosting:
                  </label>
                  <p className="text-sm md:text-base text-black font-bold">
                    {(totalHosting).toLocaleString(
                      'es-PE',
                      {
                        style: 'currency',
                        currency: 'PEN' // Moneda peruana
                      }
                    )}
                  </p>
                </div>
                <div className="w-full flex items-center gap-2 relative pb-5">
                  <label
                    className="text-base w-[230px]  text-gray-600   leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="email"
                  >
                    Ventas Totales por Hosting + Dominio
                  </label>
                  <p className="text-sm md:text-base text-black font-bold">
                    {(totalDominioHosting).toLocaleString('es-PE', {
                      style: 'currency',
                      currency: 'PEN' // Moneda peruana
                    })}{' '}
                  </p>
                </div>
                <div className="w-full flex items-center gap-2 relative pb-5">
                  <label
                    className="text-base w-[230px]  text-gray-600   leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="email"
                  >
                    Ventas totales por dominio:
                  </label>
                  <p className="text-sm md:text-base text-black font-bold">
                    {totalDominio.toLocaleString('es-PE', {
                      style: 'currency',
                      currency: 'PEN' // Moneda peruana
                    })}
                  </p>
                </div>
                <span className='border-b border-gray-300 w-full h-2 block mb-3'></span>
                <div className="w-full flex items-center gap-2 relative pb-3">
                  <label
                    className="text-base w-[230px]  text-gray-600   leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="email"
                  >
                    Total ventas Anual:
                  </label>
                  <p className="text-main font-bold">
                    {(totalMontosCobrar).toLocaleString('es-PE', {
                      style: 'currency',
                      currency: 'PEN' // Moneda peruana
                    }) }
                  </p>
                </div>
              </section>
            </div>
            <div className="w-full h-full bg-white px-0 py-2 md:p-4 rounded-lg shadow-md">
              <div className="flex justify-between px-4">
                <h1 className="w-full text-left text-gray-600 font-bold text-base md:text-xl ">
                  Renovación por mes
                </h1>
                <div className='w-1/2 flex justify-end'>
                    <button
                    type='button'
                    onClick={() => { setOpenList({ estado: true, fecha: null }) }}
                    className='block w-fit bg-green-600 hover:bg-green-700 transition-colors px-4 py-1 text-white rounded-md'>Ver todos</button>
                </div>
              </div>
              <section className="w-full p-4 pt-5">
                <SalesChart chartData={chartData} setOpenList={setOpenList} />
              </section>
            </div>
            <div className="w-full h-full bg-white px-0 py-2 md:p-4 rounded-lg shadow-md">
              <section className="w-full p-4 pt-5">
              <Top10Clientes
                  filtrarClientes={filtrarClientes}
                  setCantidadTop={setCantidadTop}
                  cantidadTop={cantidadTop}
                />
              </section>
            </div>
            <div className="w-full h-full bg-white px-0 py-2 md:p-4 rounded-lg shadow-md">
              <div className="flex justify-between px-4">
                <h1 className="w-full text-left text-gray-600 font-bold text-base md:text-xl ">
                  Hosting con mas soporte
                </h1>
              </div>
              <section className="w-full p-4 pt-5">
                <MetricaSoporte chartData={chartDataSoporte} />
              </section>
            </div>
          </section>
        </section>
      ) : (
        <Loading />
      )}
      <ModalVentas open={openList} setOpen={setOpenList} hostings={filtrarHostings()} />
    </>
  )
}
