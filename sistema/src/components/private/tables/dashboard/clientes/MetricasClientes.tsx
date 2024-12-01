/* eslint-disable multiline-ternary */
import { useState, useEffect } from 'react'
import { Loading } from '../../../../shared/Loading'
import { IoOptionsSharp } from 'react-icons/io5'
import {
  getData2,
  getDataClientesMetricas
} from '../../../../shared/FetchingData'
import {
  type openFiltersValues,
  type filtrosValues,
  type ValuesPreventaModificate
} from '../../../../shared/schemas/Interfaces'
import { PorEdad } from './graficos/PorEdad'
import { PorGenero } from './graficos/PorGenero'
import { MdOutlineZoomOutMap } from 'react-icons/md'
import { AnimatePresence, motion } from 'framer-motion'
import { PorMedioDeIngreso } from './graficos/PorMedioDeIngreso'
import { PorCrecimiento } from './graficos/PorCrecimiento'
import { Top10Clientes } from './graficos/Top10Clientes'
import { ModalOptions } from './modals/ModalOptions'
import { IoMdCloseCircle } from 'react-icons/io'
import { ModalClientes } from './modals/ModalClientes'

export const MetricasClientes = (): JSX.Element => {
  const [loading, setLoading] = useState(true)
  const [clientes, setClientes] = useState<ValuesPreventaModificate[]>([])
  const [paises, setPaises] = useState<Record<string, number>>({})
  const [departamentos, setDepartamentos] = useState<Record<string, Record<string, number>>>({})
  const [distritos, setDistritos] = useState<Record<string, Record<string, Record<string, number>>>>({})
  const [openClientes, setOpenClientes] = useState<openFiltersValues>({ estado: false, fecha: null })
  const [top10, setTop10] = useState<ValuesPreventaModificate[]>([])
  const [open, setOpen] = useState(false)
  const [filtroSeleccionado, setFiltroSeleccionado] =
    useState<filtrosValues | null>(null)
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [, setTotalRegistros2] = useState(0)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [selectedMonths, setSelectedMonths] = useState<number[]>([])
  // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
  const years = [
    ...new Set(
      clientes.map((cliente) => new Date(cliente.created_at).getFullYear())
    )
  ].sort()
  // Estado para el año seleccionado
  const [selectedYear, setSelectedYear] = useState<number | null>(null)
  // Estado para los meses del año seleccionado
  const [monthsOfYear, setMonthsOfYear] = useState<number[]>([])
  // Función para manejar el cambio de año seleccionado
  const handleYearChange = (year: number): void => {
    setSelectedYear(year)
    const filteredByYear = clientes.filter(
      (cliente) => new Date(cliente.created_at).getFullYear() === year
    )
    // eslint-disable-next-line @typescript-eslint/require-array-sort-compare
    const months = [
      ...new Set(
        filteredByYear.map(
          (cliente) => new Date(cliente.created_at).getMonth() + 1
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

  useEffect(() => {
    Promise.all([
      getDataClientesMetricas(
        'getClientes',
        setClientes,
        setDepartamentos,
        setDistritos,
        setPaises,
        setTotalRegistros
      ),
      getData2('top10', setTop10, setTotalRegistros2)
    ]).then(() => {
      setLoading(false)
    })
  }, [])

  let totalPosts = clientes.length

  const filtrarClientes = (): ValuesPreventaModificate[] => {
    let clientesFiltrados = [...clientes] // Copia de los clientes originales
    // Aplicar filtros
    if (filtroSeleccionado?.estado) {
      clientesFiltrados = clientesFiltrados.filter(
        (cliente) => cliente.antiguo == filtroSeleccionado?.estado
      )
    }
    if (filtroSeleccionado?.pais) {
      clientesFiltrados = clientesFiltrados.filter((cliente) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const metricas = cliente?.metricas
        if (metricas) {
          try {
            const metricasJSON = JSON.parse(metricas)
            if (filtroSeleccionado?.departamento && filtroSeleccionado.pais && filtroSeleccionado?.distrito) {
              return (
                metricasJSON.country == filtroSeleccionado.pais &&
                    metricasJSON.department == filtroSeleccionado.departamento &&
                    metricasJSON.district == filtroSeleccionado.distrito
              )
            } else if (filtroSeleccionado?.departamento && filtroSeleccionado.pais) {
              // Si se seleccionó un departamento, filtramos por país y departamento
              return (
                metricasJSON.country == filtroSeleccionado.pais &&
                  metricasJSON.department == filtroSeleccionado.departamento
              )
            } else {
              // Si solo se seleccionó un país, filtramos solo por país
              return metricasJSON.country == filtroSeleccionado.pais
            }
          } catch (error) {
            console.error('Error parsing metricas JSON:', error)
            return false // No filtrar si hay un error al parsear el JSON
          }
        } else {
          return false
        }
      })
    }

    if (filtroSeleccionado?.edad && filtroSeleccionado.edad.length > 0) {
      clientesFiltrados = clientesFiltrados.filter((cliente) => {
        const edad = Number(cliente.edad)
        if (filtroSeleccionado.edad.includes('No Registrado')) {
          return edad == null || !edad
        } else if (filtroSeleccionado.edad.includes('51+')) {
          return edad >= 51
        } else {
          const edadRanges = filtroSeleccionado.edad.map((range) => {
            const [min, max] = range.split('-').map(Number)
            return { min, max }
          })
          // Verifica si la edad se encuentra en alguno de los rangos
          return edadRanges.some(({ min, max }) => edad >= min && edad <= max)
        }
      })
    }
    if (filtroSeleccionado?.genero && filtroSeleccionado.genero.length > 0) {
      clientesFiltrados = clientesFiltrados.filter((cliente) => {
        const sexo = cliente.sexo?.toLowerCase().trim() // Limpiamos espacios adicionales
        if (sexo === 'hombre' || sexo === 'mujer' || sexo === 'otro') {
          return filtroSeleccionado.genero.includes(sexo)
        } else {
          return filtroSeleccionado.genero.includes('NoRegistrado')
        }
      })
    }
    if (filtroSeleccionado?.ingreso && filtroSeleccionado.ingreso.length > 0) {
      clientesFiltrados = clientesFiltrados.filter((cliente) => {
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
      clientesFiltrados = clientesFiltrados.filter((cliente) => {
        const clienteYear = new Date(cliente.created_at).getFullYear()
        const clienteMonth = new Date(cliente.created_at).getMonth() + 1 // Se suma 1 porque los meses en JavaScript van de 0 a 11
        const isMatchingYear = clienteYear === selectedYear
        const isMatchingMonth = selectedMonths.length === 0 || selectedMonths.includes(clienteMonth)
        return isMatchingYear && isMatchingMonth
      })
    }

    // Agregar más filtros según sea necesario
    totalPosts = clientesFiltrados.length
    return clientesFiltrados
  }

  const filtrarTop10 = (): ValuesPreventaModificate[] => {
    let clientesFiltrados = [...top10] // Copia de los clientes originales
    // Aplicar filtros
    if (filtroSeleccionado?.estado == 'nuevos') {
      clientesFiltrados = clientesFiltrados.filter(
        (cliente) => cliente.antiguo == '0'
      )
    } else if (filtroSeleccionado?.estado == 'antiguos') {
      clientesFiltrados = clientesFiltrados.filter(
        (cliente) => cliente.antiguo == '1'
      )
    }
    return clientesFiltrados
  }

  useEffect(() => {
    setTotalRegistros(totalPosts)
  }, [filtroSeleccionado, selectedYear, selectedMonths])

  return (
    <div className="w-full h-screen relative overflow-x-hidden overflow-y-auto bg-gray-100">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex flex-col p-4 w-full h-full">
            <div className="w-full flex justify-between">
              <h1 className="w-full text-left text-gray-600 px-4 text-2xl uppercase font-bold">
                Clientes ({totalRegistros}){' '}
              </h1>
              <div className="flex gap-3 px-4 w-full justify-end">
                {filtroSeleccionado && (
                    <div className='flex gap-3 w-full justify-end items-center'>
                        {filtroSeleccionado?.estado && <p className='bg-secundario rounded-xl text-white w-fit px-2 py-1 h-fit flex items-center gap-2 hover:bg-secundario/90 select-none transition-colors'>{filtroSeleccionado.estado == '0' ? 'Nuevos' : filtroSeleccionado.estado == '1' ? 'Antiguos' : ''} <IoMdCloseCircle onClick={() => { setFiltroSeleccionado((prev: any) => ({ ...prev, estado: null })) }} className='text-xl mt-[0.5px] cursor-pointer'/> </p> }
                        {filtroSeleccionado?.pais && <p className='bg-secundario rounded-xl text-white w-fit px-2 py-1 h-fit flex items-center gap-2 hover:bg-secundario/90 select-none transition-colors'>{filtroSeleccionado.pais} <IoMdCloseCircle onClick={() => { setFiltroSeleccionado((prev: any) => ({ ...prev, pais: null })) }} className='text-xl mt-[0.5px] cursor-pointer'/></p> }
                        {filtroSeleccionado?.departamento && <p className='bg-secundario rounded-xl text-white w-fit px-2 py-1 h-fit flex items-center gap-2 hover:bg-secundario/90 select-none transition-colors'>{filtroSeleccionado.departamento} <IoMdCloseCircle onClick={() => { setFiltroSeleccionado((prev: any) => ({ ...prev, departamento: null })) }} className='text-xl mt-[0.5px] cursor-pointer'/></p> }
                        {filtroSeleccionado?.distrito && <p className='bg-secundario rounded-xl text-white w-fit px-2 py-1 h-fit flex items-center gap-2 hover:bg-secundario/90 select-none transition-colors'>{filtroSeleccionado.distrito} <IoMdCloseCircle onClick={() => { setFiltroSeleccionado((prev: any) => ({ ...prev, distrito: null })) }} className='text-xl mt-[0.5px] cursor-pointer'/></p> }
                    </div>
                )}
                <IoOptionsSharp
                  onClick={() => {
                    setOpen(true)
                  }}
                  className="text-3xl text-black bg-transparent transition-colors cursor-pointer hover:bg-gray-300 p-1 rounded-md w-10 h-10"
                />
              </div>
            </div>
            {/* GRAFICOS */}
            <section className="grid grid-cols-2 w-full h-fit gap-4 px-4 py-4 ">
              <div className="w-full h-full bg-white p-4 rounded-lg shadow-md">
                <PorEdad
                  setSelectedId={setSelectedId}
                  selectedId={selectedId}
                  filtroSeleccionado={filtroSeleccionado}
                  setFiltroSeleccionado={setFiltroSeleccionado}
                  filtrarClientes={filtrarClientes}
                />
              </div>
              <div className="w-full h-full bg-white p-4 rounded-lg shadow-md">
                <PorCrecimiento
                  filtrarClientes={filtrarClientes}
                  setSelectedId={setSelectedId}
                  selectedId={selectedId}
                  setOpen={setOpenClientes}
                />
              </div>
            </section>
            <section className="grid grid-cols-2 w-full h-hit gap-4 px-4 py-4 ">
              <div className="w-full h-full bg-white p-4 rounded-lg shadow-md">
                <PorMedioDeIngreso
                  setSelectedId={setSelectedId}
                  selectedId={selectedId}
                  filtroSeleccionado={filtroSeleccionado}
                  setFiltroSeleccionado={setFiltroSeleccionado}
                  filtrarClientes={filtrarClientes}
                />
              </div>
              <div className="w-full h-full bg-white p-4 rounded-lg shadow-md">
                <PorGenero
                  filtrarClientes={filtrarClientes}
                  setSelectedId={setSelectedId}
                  selectedId={selectedId}
                  filtroSeleccionado={filtroSeleccionado}
                  setFiltroSeleccionado={setFiltroSeleccionado}
                />
              </div>
            </section>
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
                {selectedId == '1' ? (
                  <motion.div
                    initial={{ opacity: 0 }} // Inicialmente invisible
                    animate={{ opacity: 1 }} // Animación de entrada
                    exit={{ opacity: 0 }} // Animación de salida
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    className="w-[70%] h-[70%] bg-white p-4 rounded-lg shadow-md z-10"
                  >
                    <PorEdad
                      setSelectedId={setSelectedId}
                      selectedId={selectedId}
                      filtroSeleccionado={filtroSeleccionado}
                      setFiltroSeleccionado={setFiltroSeleccionado}
                      filtrarClientes={filtrarClientes}
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
                    className="w-[70%] h-[70%] bg-white p-4 rounded-lg shadow-md z-10"
                  >
                    <PorGenero
                      filtrarClientes={filtrarClientes}
                      setSelectedId={setSelectedId}
                      selectedId={selectedId}
                      filtroSeleccionado={filtroSeleccionado}
                      setFiltroSeleccionado={setFiltroSeleccionado}
                    />
                  </motion.div>
                ) : selectedId == '4' ? (
                  <motion.div
                    initial={{ opacity: 0 }} // Inicialmente invisible
                    animate={{ opacity: 1 }} // Animación de entrada
                    exit={{ opacity: 0 }} // Animación de salida
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    className="w-[70%] h-[70%] bg-white p-4 rounded-lg shadow-md z-10"
                  >
                    <PorCrecimiento
                      filtrarClientes={filtrarClientes}
                      setSelectedId={setSelectedId}
                      selectedId={selectedId}
                      setOpen={setOpenClientes}
                    />
                  </motion.div>
                ) : selectedId == '3' ? (
                  <motion.div
                    initial={{ opacity: 0 }} // Inicialmente invisible
                    animate={{ opacity: 1 }} // Animación de entrada
                    exit={{ opacity: 0 }} // Animación de salida
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    className="w-[70%] h-[70%] bg-white p-4 rounded-lg shadow-md z-10"
                  >
                    <PorMedioDeIngreso
                      setSelectedId={setSelectedId}
                      selectedId={selectedId}
                      filtroSeleccionado={filtroSeleccionado}
                      setFiltroSeleccionado={setFiltroSeleccionado}
                      filtrarClientes={filtrarClientes}
                    />
                  </motion.div>
                ) : selectedId == '5' ? (
                  <motion.div
                    initial={{ opacity: 0 }} // Inicialmente invisible
                    animate={{ opacity: 1 }} // Animación de entrada
                    exit={{ opacity: 0 }} // Animación de salida
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    className="w-[70%] h-[70%] bg-white p-4 rounded-lg shadow-md z-10"
                  >
                    <div className="flex justify-between px-4">
                      <h1 className="w-full text-left text-gray-600 font-semibold text-xl ">
                        Top 10 clientes con mas proyectos
                      </h1>
                      <MdOutlineZoomOutMap
                        className="text-2xl text-gray-600 cursor-pointer hover:text-gray-700 hover:scale-105"
                        onClick={() => {
                          setSelectedId(null)
                        }}
                      />
                    </div>
                    <Top10Clientes filtrarClientes={filtrarTop10} />
                  </motion.div>
                ) : null}
              </motion.div>
            )}
          </AnimatePresence>
          <ModalOptions
            open={open}
            setOpen={setOpen}
            filtroSeleccionado={filtroSeleccionado}
            years={years}
            setFiltroSeleccionado={setFiltroSeleccionado}
            paises={paises}
            selectedYear={selectedYear}
            handleYearChange={handleYearChange}
            monthsOfYear={monthsOfYear}
            setSelectedYear={setSelectedYear}
            setMonthsOfYear={setMonthsOfYear}
            selectedMonths={selectedMonths}
            handleMonthChange={handleMonthChange}
            departamentos={departamentos}
            distritos={distritos}
          />
          <ModalClientes clientes={filtrarClientes()} open={openClientes} setOpen={setOpenClientes}/>
        </>
      )}
    </div>
  )
}
