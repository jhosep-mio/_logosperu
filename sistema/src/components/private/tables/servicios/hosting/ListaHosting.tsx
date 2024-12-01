/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-unmodified-loop-condition */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RiFilter2Fill, RiSettings3Fill } from 'react-icons/ri'
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu'
import axios from 'axios'
// import { GeneradorExcel } from '../../../shared/EXCEL/GeneradorExcel'
import { AnimatePresence, motion } from 'framer-motion'
import { MdLabelOutline } from 'react-icons/md'
import { FaAngleDown } from 'react-icons/fa6'
import useAuth from '../../../../../hooks/useAuth'
import {
  type arrayContacto,
  type ValuesVenta,
  type arrayCorreos,
  type errorValues,
  type valuesResumen
} from '../../../../shared/schemas/Interfaces'
import { getDataVentas } from '../../../../shared/FetchingData'
import { Global } from '../../../../../helper/Global'
import {
  limpiarCadena,
  quitarAcentos
} from '../../../../shared/functions/QuitarAcerntos'
import SelectFilter from '../../ventas/filtros/SelectFilter'
import { cn } from '../../../../shared/cn'
import { Loading } from '../../../../shared/Loading'
import { Paginacion } from '../../../../shared/Paginacion'
import { ModalFechaInicio } from '../ModalFechaInicio'
import { ModalFechaAlta } from '../modals/ModalFechaAlta'
import { ModalCorreoFinal } from '../ModalCorreoFinal'
import { RegistroEmail } from '../RegistroEmail'
import { ResumenAdicional } from '../ResumenAdicional'
import { RegistroMarcaList } from '../modals/RegistroMarcaList'
import { ModalCliente } from '../ModalClientes/ModalCliente'
import { AlertSucess } from '../../../../shared/alerts/AlertSucess'

interface Filters {
  estado?: number | null
  enCola?: boolean | null
  fechaFin?: boolean | null
  activeFilter: null | string
  sinFechaFinYNo1: boolean | null
  deshabilitado: boolean | null
}

interface valuesDatos {
  nombres: string
  email: string
  marca: string
  celular: string
  id_contrato: string
}

type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

export const ListaHosting = (): JSX.Element => {
  const { setTitle, auth } = useAuth()
  const [openChat, setOpenChat] = useState(false)
  const [openCliente, setOpenCliente] = useState(false)
  const [openMarca, setOpenMarca] = useState(false)
  const [resumen, setResumen] = useState<valuesResumen[]>([])
  const [productos, setProductos] = useState<ValuesVenta[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [openAlta, setOpenAlta] = useState(false)
  const [openFinal, setOpenFinal] = useState(false)
  const [openEmail, setOpenEmail] = useState(false)
  const [, setTotalRegistros] = useState(0)

  const [paginaActual, setpaginaActual] = useState<number>(1)
  const [search, setSearch] = useState('')
  const [cantidadRegistros] = useState(12)
  const token = localStorage.getItem('token')
  const [dateInicio, setDateInicio] = useState<Value>(null)
  const [selectID] = useState(0)
  const [selectIDCLIENTE] = useState(0)
  const [idcontacto] = useState(0)
  const [correos, setCorreos] = useState<arrayCorreos[]>([])
  const [openEstado, setOpenEstado] = useState(false)
  const [datos] = useState<valuesDatos | null>(null)
  const [showError, setShowError] = useState<errorValues | null>(null)
  const [filters, setFilters] = useState<Filters>({
    estado: null,
    fechaFin: null,
    enCola: null,
    activeFilter: 'sinFechaFinYNo1',
    sinFechaFinYNo1: true,
    deshabilitado: null
  })

  const [area, setArea] = useState('Todos')
  const handleChangeArea = (event: any): void => {
    setArea(event.target.value)
  }

  useEffect(() => {
    setTitle('Listado de hosting')
    Promise.all([
      getDataVentas(
        'indexHostingToColaboradores',
        setProductos,
        setTotalRegistros
      ),
      getResumen()
    ]).then(() => {
      setLoading(false)
    })
  }, [])

  const getResumen = async (): Promise<void> => {
    try {
      const request = await axios.get(`${Global.url}/indexShow/${auth.id}`, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      })
      if (JSON.parse(request.data[0].resumen_adicional).length > 0) {
        setResumen(JSON.parse(request.data[0].resumen_adicional))
      }
    } catch (error) {
      console.log(error)
    }
  }

  const indexOfLastPost = paginaActual * cantidadRegistros
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros
  let totalPosts = productos.length

  const filterDate = (): ValuesVenta[] => {
    let filteredProductos = productos
    // ... puedes agregar otras condiciones de filtro aquí
    if (search.length > 0) {
      filteredProductos = filteredProductos.filter((pro) => {
        return (
          quitarAcentos(pro.nombre_empresa.toLowerCase()).includes(
            quitarAcentos(search.toLowerCase())
          ) ||
          String(pro.id).includes(search) ||
          String(pro.id_contrato.toLowerCase()).includes(search.toLowerCase())
        )
      })
    }

    totalPosts = filteredProductos.length
    return filteredProductos.slice(indexOfFirstPost, indexOfLastPost)
  }

  useEffect(() => {
    setTotalRegistros(totalPosts)
  }, [search, filters, productos])

  const onSeachChange = ({
    target
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setpaginaActual(1)
    setSearch(target.value)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const toggleFilter = (
    type:
    | 'estado'
    | 'fechaFin'
    | 'sinFechaFinYNo1'
    | 'enCola'
    | 'deshabilitado',
    value: number | boolean
  ) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    setFilters((prev) => {
      if (prev.activeFilter == type) {
        return { ...prev, [type]: null, activeFilter: null } // desactiva el filtro si ya estaba activo
      }
      setOpenEstado(false)
      return {
        estado: null,
        fechaFin: null,
        enCola: null,
        sinFechaFinYNo1: null,
        deshabilitado: null,
        [type]: value,
        activeFilter: type
      } // activa el filtro seleccionado y desactiva los demás
    })
  }

  useEffect(() => {
    setTimeout(() => {
      if (showError != null) {
        setShowError(null)
      }
    }, 3000)
  }, [showError])

  function obtenerDiasParaPrimerPago (fechaInicial: string): number {
    if (area === 'community') {
      const partesFecha = fechaInicial.split('/').map(Number)
      const dia = partesFecha[0]
      const mes = partesFecha[1] - 1
      const año = partesFecha[2]

      // Calcular todas las fechas de pago
      const fechaActual = new Date(año, mes, dia)

      while (fechaActual < new Date()) {
        fechaActual.setDate(fechaActual.getDate() + 30)
      }

      const hoy = new Date()
      const diasRestantes = Math.ceil(
        (fechaActual.getTime() - hoy.getTime()) / (1000 * 3600 * 24)
      )

      return diasRestantes
    }

    return 0
  }

  function obtenerDiasParaMantenimiento (orden: any): number | string {
    const arrayMantenimiento = orden.mantenimientoWeb
      ? JSON.parse(orden.mantenimientoWeb)
      : []
    const fechaInicial = orden.fecha_fin
    if (arrayMantenimiento.length == 12) {
      return 'T'
    }
    if (!fechaInicial) {
      return 0 // Or any other appropriate action
    }
    if (orden.estado == '1' || orden.community_activo == 'false') {
      return '-'
    }
    const partesFecha = fechaInicial.split('/').map(Number)
    const dia = partesFecha[0]
    const mes = partesFecha[1] - 1 // Mes en formato de 0 a 11
    const año = partesFecha[2]
    const fechaInicialDate = new Date(año, mes, dia)
    const fechaActual = new Date(fechaInicialDate)
    const hoy = new Date()
    while (fechaActual < hoy) {
      fechaActual.setMonth(fechaActual.getMonth() + 1)
    }
    const diasRestantes = Math.ceil(
      (fechaActual.getTime() - hoy.getTime()) / (1000 * 3600 * 24)
    )
    return diasRestantes
  }

  return (
    <>
      <div className="flex flex-row items-center justify-between gap-y-4 mb-3 md:mb-5 gap-2">
        <div className="w-full md:w-full flex flex-col md:flex-row gap-2 items-center h-fit">
          <button className="bg-white hover:bg-gray-100 w-full md:w-fit flex items-center text-black gap-2 py-2 px-4 rounded-lg hover:text-main transition-colors">
            <RiFilter2Fill />
            <input
              placeholder="Buscar ..."
              className="bg-transparent outline-none"
              value={search}
              onChange={onSeachChange}
              type="search"
            />
          </button>
          <div className="select_areas">
            <SelectFilter
              area={area}
              setArea={setArea}
              handleChangeArea={handleChangeArea}
            />
          </div>
        </div>
        <div className="hidden w-fit md:w-full lg:flex flex-col-reverse md:flex-row items-center md:justify-end gap-4">
          <div className="flex gap-3 overflow-hidden">
            <AnimatePresence>
              {openEstado && (
                <motion.div
                  initial={{
                    translateX: '100%',
                    opacity: 0,
                    userSelect: 'none'
                  }}
                  animate={{
                    translateX: '0%',
                    opacity: 100,
                    userSelect: 'initial'
                  }}
                  exit={{ translateX: '100%', opacity: 0 }}
                  className="flex gap-2 h-9 z-10"
                >
                  <button
                    className={`bg-yellow-500 text-white md:hidden px-2 md:px-4 text-sm md:text-base py-0 lg:py- rounded-xl line-clamp-1 font-bold ${
                      filters.activeFilter == 'enCola'
                        ? 'border-2 border-yellow-600'
                        : 'border-2 border-transparent'
                    }`}
                    onClick={() => {
                      toggleFilter('enCola', true)
                    }}
                  >
                    Cola
                  </button>
                  <button
                    className={`  px-2 md:px-4 text-sm md:text-base py-1 lg:py- rounded-xl line-clamp-1 font-bold ${
                      filters.activeFilter == 'sinFechaFinYNo1'
                        ? 'border border-transparent bg-gray-400 text-white'
                        : 'border border-gray-400 text-black'
                    }`}
                    onClick={() => {
                      toggleFilter('sinFechaFinYNo1', true)
                    }}
                  >
                    En proceso
                  </button>
                  <button
                    className={` border px-2 md:px-4 py-1 lg:py- rounded-xl line-clamp-1 font-bold ${
                      filters.activeFilter == 'deshabilitado'
                        ? 'bg-yellow-500 text-white '
                        : 'border border-gray-400 bg-transparent text-black '
                    }`}
                    onClick={() => {
                      toggleFilter('deshabilitado', true)
                    }}
                  >
                    Deshabilitados
                  </button>
                  <button
                    className={` px-2 md:px-4 text-sm md:text-base py-1 lg:py- rounded-xl line-clamp-1 font-bold ${
                      filters.activeFilter == 'fechaFin'
                        ? 'border border-transparent bg-green-600 text-white '
                        : 'border border-gray-400 bg-transparent text-black '
                    }`}
                    onClick={() => {
                      toggleFilter('fechaFin', true)
                    }}
                  >
                    Finalizados
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <div
              className="flex gap-2 z-20 cursor-pointer text-black items-center h-9 bg-white border border-secundario rounded-xl px-4 py-1"
              onClick={() => {
                setOpenEstado(!openEstado)
              }}
            >
              <MdLabelOutline className="text-xl font-semibold text-secundario" />
              <span className="font-semibold ">Estado</span>
              <FaAngleDown
                className={cn(
                  'text-xs mt-1 ml-2 text-secundario transition-all',
                  openEstado ? 'rotate-90' : ''
                )}
              />
            </div>
            {/* DESPLEGABLE */}
          </div>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className="lg:bg-[#fff] md:p-8 rounded-xl">
          <div
            className={`hidden lg:grid pr-10 lg:pr-4 items-center grid_teplate_ventas ${
              filters.enCola ? 'grid_teplate_ventas_encola' : ''
            } 
            ${
              (area === 'community' ||
                area == 'tienda' ||
                area == 'landing' ||
                area == 'administrable') &&
              filters.fechaFin == null
                ? 'grid_community_activo'
                : ''
            } 
            ${
              (area === 'community' ||
                area == 'tienda' ||
                area == 'landing' ||
                area == 'administrable') &&
              filters.estado != null
                ? 'grid_community_activo_with_abandono'
                : ''
            } 
            ${
              (area === 'community' ||
                area == 'tienda' ||
                area == 'landing' ||
                area == 'administrable') &&
              filters.activeFilter === 'sinFechaFinYNo1'
                ? 'grid_community_activo_with_proceso2'
                : ''
            } 
            ${
              filters.sinFechaFinYNo1 ? 'grid_teplate_ventas_pendientes' : ''
            }  gap-4 mb-2 lg:px-4 lg:py-2 text-gray-400 border-y border-gray-300`}
          >
            <h5 className="lg:text-left line-clamp-1 col-span-1">Contrato</h5>
            <h5 className="lg:text-left line-clamp-1 col-span-2 ">Plan</h5>
            <h5 className="lg:text-left col-span-3">Cliente</h5>
            <h5 className="lg:text-left col-span-3">Marca</h5>
            <h5 className="lg:text-center line-clamp-1 col-span-2">Dominio</h5>
            <h5 className="lg:text-center col-span-2">Estado</h5>
            {!filters.enCola && (
              <>
                <h5 className="lg:text-center line-clamp-1 col-span-2">
                  Fc. de Alta
                </h5>
                <h5 className="lg:text-center w-fit flex gap-2 items-center col-span-2">
                  Fc. de Inicio
                </h5>
                {!filters.sinFechaFinYNo1 && (
                  <h5 className="lg:text-center w-fit flex gap-2 items-center col-span-2">
                    Fc. Final
                  </h5>
                )}
              </>
            )}
            {(area === 'community' ||
              area == 'tienda' ||
              area == 'landing' ||
              area == 'administrable') &&
              filters.fechaFin == null &&
              (area === 'community' ||
                area == 'tienda' ||
                area == 'landing' ||
                area == 'administrable') &&
              filters.estado !== 1 && (
                <>
                  <h5 className="lg:text-left ">Dias {filters.estado}</h5>
                </>
            )}
          </div>
          {filterDate().map((orden: any, index: number) => (
            <div
              className={`grid grid_teplate_ventas ${
                filters.enCola ? 'grid_teplate_ventas_encola' : ''
              } 
           ${filters.sinFechaFinYNo1 ? 'grid_teplate_ventas_pendientes' : ''} 
           ${
             (area === 'community' ||
               area == 'tienda' ||
               area == 'landing' ||
               area == 'administrable') &&
             filters.fechaFin == null
               ? 'grid_community_activo'
               : ''
           } 
           ${
             (area === 'community' ||
               area == 'tienda' ||
               area == 'landing' ||
               area == 'administrable') &&
             filters.estado != null
               ? 'grid_community_activo_with_abandono'
               : ''
           } 
           ${
             (area === 'community' ||
               area == 'tienda' ||
               area == 'landing' ||
               area == 'administrable') &&
             filters.activeFilter === 'sinFechaFinYNo1'
               ? 'grid_community_activo_with_proceso2'
               : ''
           } 
           md:pr-10 lg:pr-4 relative gap-3 items-center mb-3 lg:mb-0 ${
             index % 2 == 0 ? 'bg-transparent' : 'bg-gray-200'
           } lg:px-4 lg:py-3 rounded-xl relative shadow_class
           ${
             obtenerDiasParaPrimerPago(orden.fecha_inicio) > 0 &&
             obtenerDiasParaPrimerPago(orden.fecha_inicio) <= 2 &&
             area === 'community' &&
             orden.fecha_fin == null
               ? 'casi_vencimiento_community'
               : `${
                   obtenerDiasParaPrimerPago(orden.fecha_inicio) == 0 &&
                   area === 'community' &&
                   orden.fecha_fin == null
                     ? 'vencimiento_community'
                     : ''
                 }`
           }
           ${
             // @ts-expect-error
             obtenerDiasParaMantenimiento(orden) > 0 &&
             // @ts-expect-error
             obtenerDiasParaMantenimiento(orden) <= 2 &&
             (area == 'tienda' ||
               area == 'landing' ||
               area == 'administrable') &&
             orden.fecha_fin != null
               ? 'casi_vencimiento_community'
               : `${
                   obtenerDiasParaMantenimiento(orden) == 0 &&
                   (area == 'tienda' ||
                     area == 'landing' ||
                     area == 'administrable') &&
                   orden.fecha_fin != null
                     ? 'vencimiento_community'
                     : ''
                 }`
           }
           md:pr-0 lg:pr-4 relative gap-3 items-center mb-3 lg:mb-0 
           `}
              key={orden.id}
            >
              <div
                // to={`view-servicio/${orden.id}`}
                className="flex flex-col gap-3 lg:hidden bg-form p-4 rounded-xl"
              >
                <div className="flex justify-between">
                  <div className="flex lg:hidden gap-4 items-center">
                    {orden.estado == '1' ? (
                      <span className="flex items-center justify-center bg-red-400 text-red-600  w-8 h-8 rounded-full">
                        A
                      </span>
                    ) : orden.fecha_fin != null ? (
                      <span className="flex items-center justify-center bg-[#b3dba1] text-green-700 w-8 h-8 rounded-full">
                        T
                      </span>
                    ) : !orden.fecha_inicio && !orden.fecha_alta ? (
                      <span className="flex items-center justify-center bg-yellow-300 text-yellow-600 w-8 h-8 rounded-full">
                        C
                      </span>
                    ) : (
                      <span className="flex items-center justify-center bg-gray-300 text-gray-500 w-8 h-8 rounded-full">
                        P
                      </span>
                    )}
                    <span className="flex lg:justify-left items-center gap-3 font-bold text-black">
                      {limpiarCadena(orden.correlativo)}
                    </span>
                  </div>
                  {!filters.enCola && !filters.sinFechaFinYNo1 && (
                    <div className="lg:text-right pr-0">
                      <h5 className="lg:hidden text-gray-500 text-right font-bold mb-0 text-sm">
                        Fecha de alta
                      </h5>
                      <span className="text-right block text-gray-500">
                        {orden.fecha_alta}
                      </span>
                    </div>
                  )}
                </div>
                <div className="lg:hidden flex justify-between gap-3">
                  <div className="lg:text-center ">
                    <h5 className="lg:hidden text-black font-bold mb-0 text-sm">
                      Cliente
                    </h5>
                    {orden.id_contacto ? (
                      <>
                        {orden.arraycontacto &&
                          JSON.parse(orden.arraycontacto).length > 0 &&
                          JSON.parse(orden.arraycontacto)
                            .filter(
                              (contacto: arrayContacto) =>
                                String(contacto.id ?? '') == orden.id_contacto
                            )
                            .map((contacto: arrayContacto) => (
                              <span
                                key={contacto.id}
                                className="text-left w-full text-black line-clamp-1"
                              >
                                {contacto.nombres}
                              </span>
                            ))}
                      </>
                    ) : (
                      <span className="text-left w-full text-black line-clamp-1">
                        {orden.nombres} {orden.apellidos}
                      </span>
                    )}
                  </div>
                  <div className="lg:text-right ">
                    <h5 className="lg:hidden text-black font-bold mb-0 text-sm bg text-right">
                      Marca
                    </h5>
                    <span className="text-right w-full text-black line-clamp-1">
                      {orden.nombre_marca
                        ? orden.nombre_marca
                        : 'No registrado'}
                    </span>
                  </div>
                </div>
                <div className="lg:hidden flex justify-between gap-3">
                  <div className="lg:text-center ">
                    <h5 className="lg:hidden text-black font-bold mb-0 text-sm">
                      Plan
                    </h5>
                    <span className="text-left w-full text-black line-clamp-1">
                      {'HOSTING'}
                    </span>
                  </div>
                </div>
                {!filters.enCola && (
                  <div className="lg:hidden flex justify-between gap-3">
                    <div className="lg:text-center ">
                      <h5 className="lg:hidden text-[#62be6d] font-bold mb-0 text-sm ">
                        Fecha de Inicio
                      </h5>
                      <span className="text-left block text-[#62be6d]">
                        {orden.fecha_inicio}
                      </span>
                    </div>
                    {!filters.sinFechaFinYNo1 ? (
                      <div className="lg:text-right ">
                        <h5 className="lg:hidden text-red-500 text-right font-bold mb-0 text-sm">
                          Fecha de cierre
                        </h5>
                        <span className="text-right block text-red-500">
                          {orden.fecha_fin}
                        </span>
                      </div>
                    ) : (
                      <div className="lg:text-right ">
                        <h5 className="lg:hidden text-gray-500 text-right font-bold mb-0 text-sm">
                          Fecha de alta
                        </h5>
                        <span className="text-right block text-gray-500">
                          {orden.fecha_alta}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
              {/* PC */}
              <div className="hidden lg:block md:text-center col-span-1">
                <span className="text-left block text-black w-full line-clamp-1">
                  {limpiarCadena(orden.correlativo)}
                </span>
              </div>
              <div className="hidden lg:block lg:text-center col-span-2 relative h-full">
                <span className="text-left text-black line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                  {JSON.parse(orden.hosting).tiposervicio}
                </span>
              </div>
              <div className="hidden lg:block lg:text-center col-span-3 relative h-full">
                <span className="text-left text-black line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                  {orden.nombres} {orden.apellidos}
                </span>
              </div>
              <div className="hidden lg:block lg:text-center col-span-3 relative h-full">
                <span className="text-left text-black line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                  {JSON.parse(orden.hosting).marca}
                </span>
              </div>
              <div className="hidden lg:block md:text-center col-span-2">
                <a
                  href={`https://${JSON.parse(orden.hosting).dominio}`}
                  target="_blank"
                  className="text-center block text-blue-600 transition-colors"
                  rel="noreferrer"
                >
                  {JSON.parse(orden.hosting).dominio}
                </a>
              </div>
              <div
                className={`hidden w-fit mx-auto lg:flex gap-2 lg:px-2 items-center justify-center col-span-2 lg:text-center ${
                  orden.activehosting != '1'
                    ? 'bg-[#FDD4D4] text-white'
                    : 'bg-[#D1FAEF] text-white'
                }`}
              >
                {orden.activehosting != '1' ? (
                  <>
                    {/* <BsCheckCircle className="hidden lg:block" /> */}
                    <span className="text-center  text-[#F53031] font-medium  line-clamp-1">
                      Inactivo
                    </span>
                  </>
                ) : (
                  <>
                    {/* <BsCheckCircle className="hidden lg:block" /> */}
                    <span className="text-center text-[#1BBA94] font-medium  line-clamp-1">
                      Activo
                    </span>
                  </>
                )}
              </div>
              <div className="hidden lg:block md:text-center col-span-2">
                <span className="text-cener block text-black">
                  {JSON.parse(orden.hosting).inicio}
                </span>
              </div>
              <div className="hidden lg:block md:text-center col-span-2">
                <span className="text-cener block text-black">
                  {JSON.parse(orden.hosting).inicio}
                </span>
              </div>
              {!filters.sinFechaFinYNo1 && (
                <div className="hidden lg:block md:text-center col-span-2">
                  <span className="text-center block text-black">
                    {orden.fecha_fin}
                  </span>
                </div>
              )}

              {area === 'community' &&
                filters.fechaFin == null &&
                area === 'community' &&
                filters.estado !== 1 && (
                  <div className="flex justify-start ">
                    <span className="text-[#252525]">
                      {orden.fecha_fin == null
                        ? obtenerDiasParaPrimerPago(orden.fecha_inicio)
                        : '-'}{' '}
                    </span>
                  </div>
              )}

              <div className="md:text-center md:flex md:justify-center items-center absolute right-0 top-0 bottom-0 my-auto">
                <Menu
                  menuButton={
                    <MenuButton className="block p-2">
                      <RiSettings3Fill className="text-[#202020bc] text-lg" />
                    </MenuButton>
                  }
                  align="end"
                  arrow
                  transition
                  menuClassName="bg-secondary-100 p-4"
                >
                  <MenuItem className="p-0 hover:bg-transparent">
                    {orden.id != null && (
                      <Link
                        to={`avances/${orden.id ?? ''}`}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                      >
                        Detalle Hosting
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem className="p-0 hover:bg-transparent">
                    {orden.venta && (
                      <Link
                        to={`/admin/lista-servicios/avances/${
                          orden.venta.id ?? ''
                        }`}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                      >
                        Seguimiento
                      </Link>
                    )}
                  </MenuItem>
                </Menu>
              </div>
            </div>
          ))}

          <div className="flex flex-col md:flex-row gap-5 md:gap-0 justify-center md:justify-between content_buttons pt-3">
            <p className="text-md ml-1 text-black">{totalPosts} Registros</p>
            <Paginacion
              totalPosts={totalPosts}
              cantidadRegistros={cantidadRegistros}
              paginaActual={paginaActual}
              setpaginaActual={setpaginaActual}
            />
          </div>
        </div>
      )}
      <ModalFechaInicio
        open={open}
        setOpen={setOpen}
        dateInicio={dateInicio}
        setDateInicio={setDateInicio}
        id={selectID}
        setProductos={setProductos}
      />

      <ModalFechaAlta
        open={openAlta}
        setOpen={setOpenAlta}
        dateInicio={dateInicio}
        setDateInicio={setDateInicio}
        id={selectID}
        setProductos={setProductos}
      />

      <ModalCorreoFinal
        open={openFinal}
        setOpen={setOpenFinal}
        correos={correos}
        setCorreos={setCorreos}
        idVenta={selectID}
        datos={datos}
        setProductos={setProductos}
      />
      <RegistroEmail
        open={openEmail}
        setOpen={setOpenEmail}
        id={selectIDCLIENTE}
        setProductos={setProductos}
        setTotalRegistros={setTotalRegistros}
      />
      <ResumenAdicional
        open={openChat}
        setOpen={setOpenChat}
        id={auth.id}
        resumen={resumen}
        setResumen={setResumen}
      />

      <RegistroMarcaList
        open={openMarca}
        setOpen={setOpenMarca}
        id={selectID}
        setProductos={setProductos}
        setTotalRegistros={setTotalRegistros}
      />

      <ModalCliente
        open={openCliente}
        setOpen={setOpenCliente}
        id={selectIDCLIENTE}
        idcontacto={idcontacto}
      />

      <AnimatePresence>
        {showError != null && <AlertSucess showError={showError} />}
      </AnimatePresence>
    </>
  )
}
