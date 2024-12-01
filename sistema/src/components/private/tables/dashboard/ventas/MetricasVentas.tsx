/* eslint-disable multiline-ternary */
import { useState, useEffect } from 'react'
import { Loading } from '../../../../shared/Loading'
import { IoOptionsSharp } from 'react-icons/io5'
import {
  getDataToPlanes,
  getDataVentasToMetricas
} from '../../../../shared/FetchingData'
import {
  type openFiltersValuesToId,
  type ValuesVentaToMetricas,
  type openFiltersValues,
  type ValuesPlanes,
  type filtrosValuesVentas
} from '../../../../shared/schemas/Interfaces'
import { AnimatePresence, motion } from 'framer-motion'
import { PorCrecimiento } from './graficos/PorCrecimiento'
import { Top10Ventas } from './graficos/Top10Ventas'
import { ModalVentas } from './modals/ModalVentas'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import { PorEstado } from './graficos/PorEstado'
import useAuth from '../../../../../hooks/useAuth'
import { PorIngreso } from './graficos/PorIngreso'
import { ModalOptions } from './modals/ModalOptions'

export const MetricasVentas = (): JSX.Element => {
  const { openSidebar } = useAuth()
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const token = localStorage.getItem('token')
  const [ventas, setVentas] = useState<ValuesVentaToMetricas[]>([])
  const [colaboradores, setColaboradores] = useState([])
  const [planes, setplanes] = useState<ValuesPlanes[]>([])
  const [filtroSeleccionado, setFiltroSeleccionado] =
    useState<filtrosValuesVentas | null>(null)
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [openVentaId, setOpenVentaId] = useState<openFiltersValuesToId>({
    estado: false,
    id: null,
    nombre: null,
    cantidad: null
  })
  const [openVenta, setOpenVenta] = useState<openFiltersValues>({
    estado: false,
    fecha: null
  })
  const [selectedMonths, setSelectedMonths] = useState<number[]>([])
  // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
  const years = [
    ...new Set(
      ventas.map((venta) => {
        const fechaInicio = venta.fecha_inicio
        const year = fechaInicio.split('/')[2] // Extraer el año de la cadena de fecha
        return parseInt(year) // Convertir el año a un número entero
      })
    )
  ].sort()
  // Estado para el año seleccionado
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  // Estado para los meses del año seleccionado
  const [monthsOfYear, setMonthsOfYear] = useState<number[]>([])
  // Función para manejar el cambio de año seleccionado
  const handleYearChange = (year: number): void => {
    setSelectedYear(year)
    const filteredByYear = ventas.filter(
      (venta) => {
        const ventaYear = parseInt(venta.fecha_inicio.split('/')[2])
        return ventaYear === year
      }
    )
    // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
    const months = [
      ...new Set(
        filteredByYear.map(
          (venta) => parseInt(venta.fecha_inicio.split('/')[1])
        )
      )
    ].sort()
    setSelectedMonths([]) // Limpiar los meses seleccionados al cambiar el año
    setMonthsOfYear(months)
  }

  const handleMonthChange = (selectedMonth: number): void => {
    if (selectedMonths.includes(selectedMonth)) {
      // Si el mes ya está seleccionado, quitarlo de la lista
      setSelectedMonths(
        selectedMonths.filter((month) => month !== selectedMonth)
      )
    } else {
      // Si el mes no está seleccionado, agregarlo a la lista
      setSelectedMonths([...selectedMonths, selectedMonth])
    }
  }

  const [cantidadTop, setCantidadTop] = useState(10)

  const getColaboradores = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getUsuariosToMatrix`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setColaboradores(request.data)
  }
  useEffect(() => {
    Promise.all([
      //   getDataClientesMetricas('getClientes', setClientes, setPaises, setTotalRegistros)
      getDataVentasToMetricas('indexAllVentas', setVentas, setTotalRegistros),
      getDataToPlanes('getPlanes', setplanes, setTotalRegistros),
      getColaboradores()
    ]).then(() => {
      setLoading(false)
    })
  }, [])

  let totalPosts = ventas.length

  const filtrarVentas = (): ValuesVentaToMetricas[] => {
    let ventasFiltrados = [...ventas]
    if (openVentaId?.estado && openVentaId.id) {
      ventasFiltrados = ventasFiltrados.filter(
        (venta) => venta.id_cliente == openVentaId.id
      )
    }

    if (filtroSeleccionado?.estado && filtroSeleccionado.estado.length > 0) {
      ventasFiltrados = ventasFiltrados.filter((venta) => {
        const filtroAbandono = filtroSeleccionado.estado.includes('Abandono')
        const filtroFinalizado = filtroSeleccionado.estado.includes('Finalizado')
        const filtroProceso = filtroSeleccionado.estado.includes('Proceso')
        if (filtroAbandono && venta.estado === '1') {
          return true
        }
        if (filtroFinalizado && venta.fecha_fin && venta.estado !== '1') {
          return true
        }
        if (filtroProceso && !venta.fecha_fin && venta.estado !== '1') {
          return true
        }
        return filtroSeleccionado.estado.includes(venta.estado)
      })
    }

    if (filtroSeleccionado?.ingreso && filtroSeleccionado.ingreso.length > 0) {
      ventasFiltrados = ventasFiltrados.filter((cliente) => {
        const medioIngreso = cliente?.medio_ingreso
        let codigoMedio = ''
        switch (medioIngreso) {
          case '0':
            codigoMedio = 'Facebook'
            break
          case '1':
            codigoMedio = 'Google'
            break
          case '2':
            codigoMedio = 'Ventas'
            break
          case '3':
            codigoMedio = 'Post Venta'
            break
          case '4':
            codigoMedio = 'Whatsapp'
            break
          case '5':
            codigoMedio = 'Instagram'
            break
          case '6':
            codigoMedio = 'Recomendación'
            break
            // Agrega más casos según sea necesario para otros medios de ingreso
          default:
            codigoMedio = '' // Asigna un valor predeterminado si no hay coincidencia
        }
        return filtroSeleccionado.ingreso.includes(codigoMedio)
      })
    }

    if (selectedYear !== null) {
      ventasFiltrados = ventasFiltrados.filter((cliente) => {
        const clienteYear = parseInt(cliente.fecha_inicio.split('/')[2])
        const clienteMonth = parseInt(cliente.fecha_inicio.split('/')[1])
        const isMatchingYear = clienteYear === selectedYear
        const isMatchingMonth =
            selectedMonths.length === 0 || selectedMonths.includes(clienteMonth)
        return isMatchingYear && isMatchingMonth
      })
    }

    ventasFiltrados = ventasFiltrados.filter(
      (pro) => pro.fecha_inicio && pro.fecha_alta
    )
    totalPosts = ventasFiltrados.length
    return ventasFiltrados
  }

  const filtrarVentas2 = (): ValuesVentaToMetricas[] => {
    let ventasFiltrados2 = [...ventas]

    if (selectedYear !== null) {
      ventasFiltrados2 = ventasFiltrados2.filter((cliente) => {
        const clienteYear = parseInt(cliente.fecha_inicio.split('/')[2])
        const clienteMonth = parseInt(cliente.fecha_inicio.split('/')[1])
        const isMatchingYear = clienteYear === selectedYear
        const isMatchingMonth =
              selectedMonths.length === 0 || selectedMonths.includes(clienteMonth)
        return isMatchingYear && isMatchingMonth
      })
    }

    return ventasFiltrados2
  }

  useEffect(() => {
    setTotalRegistros(totalPosts)
  }, [filtroSeleccionado, openVentaId, selectedYear, selectedMonths])

  return (
    <div className="w-full h-screen relative overflow-x-hidden overflow-y-auto bg-gray-100">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex flex-col p-4 w-full h-full">
            <div className="bg-[#F3F4F6] flex justify-between fixed top-0 right-0 p-4 left-[13%] ">
              <h1 className="w-1/2 text-left text-gray-600 px-4 text-2xl uppercase font-bold">
                PROYECTOS ({totalRegistros}){' '}
              </h1>
              <div className="w-1/2 flex gap-3 px-4  justify-end">
                {/* {filtroSeleccionado && (
                  <div className="flex gap-3 w-full justify-end items-center">
                    {filtroSeleccionado?.estado && (
                      <p className="bg-secundario rounded-xl text-white w-fit px-2 py-1 h-fit flex items-center gap-2 hover:bg-secundario/90 select-none transition-colors">
                        {filtroSeleccionado.estado == '0'
                          ? 'Nuevos'
                          : filtroSeleccionado.estado == '1'
                            ? 'Antiguos'
                            : ''}{' '}
                        <IoMdCloseCircle
                          onClick={() => {
                            setFiltroSeleccionado((prev: any) => ({
                              ...prev,
                              estado: null
                            }))
                          }}
                          className="text-xl mt-[0.5px] cursor-pointer"
                        />{' '}
                      </p>
                    )}
                  </div>
                )} */}
                <IoOptionsSharp
                  onClick={() => { setOpen(true) }}
                  className="text-3xl text-black bg-transparent transition-colors cursor-pointer hover:bg-gray-300 p-1 rounded-md w-10 h-10"
                />
              </div>
            </div>
            {/* GRAFICOS */}
            {/* <section className="flex w-full h-fit gap-4 px-4 py-4 "> */}
              <section className={`grid grid-cols-1 h-fit gap-4 pt-[57px] ${openSidebar ? 'w-[68%]' : 'w-[65%]'} py-3`} >
                <div className="w-full h-auto bg-white p-4 rounded-lg shadow-md">
                  <PorCrecimiento
                    filtrarVentas={filtrarVentas}
                    selectedId={selectedId}
                    setOpen={setOpenVenta}
                    setSelectedId={setSelectedId}
                  />
                </div>
                <section className='grid grid-cols-2 gap-5'>
                    <div className="w-full h-auto bg-white p-4 rounded-lg shadow-md">
                    <PorEstado
                        filtrarVentas={filtrarVentas}
                        setSelectedId={setSelectedId}
                        selectedId={selectedId}
                        filtroSeleccionado={filtroSeleccionado}
                        setFiltroSeleccionado={setFiltroSeleccionado}
                    />
                    </div>
                    <div className="w-full h-auto bg-white p-4 rounded-lg shadow-md">
                    <PorIngreso
                        filtrarVentas={filtrarVentas}
                        setSelectedId={setSelectedId}
                        selectedId={selectedId}
                        filtroSeleccionado={filtroSeleccionado}
                        setFiltroSeleccionado={setFiltroSeleccionado}
                    />
                    </div>
                </section>
              </section>
              <div className={`w-[29%] ${openVenta.estado ? 'z-[999]' : ''}  h-fit  rounded-md  bg-white p-4 shadow-md overflow-y-auto fixed mr-[1.2%] right-0 ${openVenta.estado ? 'top-[18px] h_screen_metricas_ventas2' : 'top-[72px] h_screen_metricas_ventas'} `}>
                <Top10Ventas
                  filtrarVentas={filtrarVentas2}
                  openVentaId={openVentaId}
                  setOpenVentaId={setOpenVentaId}
                  setCantidadTop={setCantidadTop}
                  cantidadTop={cantidadTop}
                />
              </div>
            {/* </section> */}
          </div>
          <AnimatePresence>
            {selectedId != null && (
              <motion.div
                layoutId={selectedId}
                initial={{ opacity: 0, scale: 0.5 }} // Ajusta la escala inicial
                animate={{ opacity: 1, scale: 1 }} // Ajusta la escala final
                exit={{ opacity: 0, scale: 0.8 }} // Ajusta la escala al salir
                onClick={() => {
                  setSelectedId(null)
                }}
                className="fixed pl-[15%] w-full h-full inset-0 flex justify-center items-center before:bg-black/60 before:w-full before:absolute before:inset-0 overflow-hidden"
              >
                {selectedId == '4' ? (
                  <motion.div
                    initial={{ opacity: 0 }} // Inicialmente invisible
                    animate={{ opacity: 1 }} // Animación de entrada
                    exit={{ opacity: 0 }} // Animación de salida
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    className="w-[70%] h-[auto] bg-white p-4 rounded-lg shadow-md z-10"
                  >
                    <PorCrecimiento
                      filtrarVentas={filtrarVentas}
                      selectedId={selectedId}
                      setOpen={setOpenVenta}
                      setSelectedId={setSelectedId}
                    />
                  </motion.div>
                ) : selectedId == '1' ? (
                  <motion.div
                    initial={{ opacity: 0 }} // Inicialmente invisible
                    animate={{ opacity: 1 }} // Animación de entrada
                    exit={{ opacity: 0 }} // Animación de salida
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    className="w-[70%] h-[auto] bg-white p-4 rounded-lg shadow-md z-10"
                  >
                    <PorEstado
                      filtrarVentas={filtrarVentas}
                      setSelectedId={setSelectedId}
                      selectedId={selectedId}
                      filtroSeleccionado={filtroSeleccionado}
                      setFiltroSeleccionado={setFiltroSeleccionado}
                    />
                  </motion.div>
                ) : selectedId == '2' ? (
                    <motion.div
                      initial={{ opacity: 0 }} // Inicialmente invisible
                      animate={{ opacity: 1 }} // Animación de entrada
                      exit={{ opacity: 0 }} // Animación de salida
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                      className="w-[70%] h-auto bg-white p-4 rounded-lg shadow-md z-10"
                    >
                      <PorIngreso
                        filtrarVentas={filtrarVentas}
                        setSelectedId={setSelectedId}
                        selectedId={selectedId}
                        filtroSeleccionado={filtroSeleccionado}
                        setFiltroSeleccionado={setFiltroSeleccionado}
                      />
                    </motion.div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
          <ModalVentas
            open={openVenta}
            setOpen={setOpenVenta}
            ventas={filtrarVentas()}
            colaboradores={colaboradores}
            planes={planes}
            openVentaId={openVentaId}
          />

          <ModalOptions
            open={open}
            setOpen={setOpen}
            years={years}
            selectedYear={selectedYear}
            handleYearChange={handleYearChange}
            monthsOfYear={monthsOfYear}
            setSelectedYear={setSelectedYear}
            setMonthsOfYear={setMonthsOfYear}
            selectedMonths={selectedMonths}
            handleMonthChange={handleMonthChange}
          />

          {/* <ModalOptions open={open} setOpen={setOpen} filtroSeleccionado={filtroSeleccionado} setFiltroSeleccionado={setFiltroSeleccionado} paises={paises}/> */}
        </>
      )}
    </div>
  )
}
