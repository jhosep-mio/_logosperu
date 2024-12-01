/* eslint-disable no-unmodified-loop-condition */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import { RiFilter2Fill, RiSettings3Fill } from 'react-icons/ri'
import { Loading } from '../../../shared/Loading'
import {
  type valuesResumen,
  type arrayCorreos,
  type ValuesVenta,
  type errorValues,
  type ValuesPlanes,
  type arrayContacto
} from '../../../shared/schemas/Interfaces'
import { Paginacion } from '../../../shared/Paginacion'
import { getDataToPlanes, getDataVentas } from '../../../shared/FetchingData'
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu'
import {
  limpiarCadena,
  quitarAcentos
} from '../../../shared/functions/QuitarAcerntos'
import { ModalFechaInicio } from './ModalFechaInicio'
import { ModalCorreoFinal } from './ModalCorreoFinal'
import Swal, { type SweetAlertResult } from 'sweetalert2'
import { RegistroEmail } from './RegistroEmail'
import { ResumenAdicional } from './ResumenAdicional'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { AlertSucess } from '../../../shared/alerts/AlertSucess'
// import { GeneradorExcel } from '../../../shared/EXCEL/GeneradorExcel'
import { AnimatePresence, motion } from 'framer-motion'
import { ModalFechaAlta } from './modals/ModalFechaAlta'
import { RegistroMarcaList } from './modals/RegistroMarcaList'
import { ModalCliente } from './ModalClientes/ModalCliente'
import SelectFilter from '../ventas/filtros/SelectFilter'
import { MdLabelOutline } from 'react-icons/md'
import { FaAngleDown } from 'react-icons/fa6'
import { cn } from '../../../shared/cn'
import { VerComentarios } from '../ventas/modals/VerComentarios'
import { format, parse } from 'date-fns'

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

export const ListaServicios = (): JSX.Element => {
  const { setTitle, auth } = useAuth()
  const [openChat, setOpenChat] = useState(false)

  const [openCliente, setOpenCliente] = useState(false)
  const [openMarca, setOpenMarca] = useState(false)
  const [planes, setplanes] = useState<ValuesPlanes[]>([])
  const [resumen, setResumen] = useState<valuesResumen[]>([])
  const [productos, setProductos] = useState<ValuesVenta[]>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [openAlta, setOpenAlta] = useState(false)
  const [openFinal, setOpenFinal] = useState(false)
  const [openEmail, setOpenEmail] = useState(false)
  const [, setTotalRegistros] = useState(0)
  const [, setTotalRegistros2] = useState(0)

  const [paginaActual, setpaginaActual] = useState<number>(1)
  const [search, setSearch] = useState('')
  const [cantidadRegistros] = useState(12)
  const token = localStorage.getItem('token')
  const [dateInicio, setDateInicio] = useState<Value>(null)
  const [selectID, setSelectID] = useState(0)
  const [selectIDCLIENTE, setSelectIDCLIENTE] = useState(0)
  const [idcontacto, setIdContacto] = useState(0)
  const [openComentarios, setOpenComentarios] = useState<any | null>({ estado: false, comentarios: null })
  const [correos, setCorreos] = useState<arrayCorreos[]>([])
  const [openEstado, setOpenEstado] = useState(false)
  const [datos, setDatos] = useState<valuesDatos | null>(null)
  const navigate = useNavigate()
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
    setTitle('Listado de proyectos')
    Promise.all([
      getDataVentas(
        `indexToColaboradores3/${auth.id}`,
        setProductos,
        setTotalRegistros
      ),
      getDataToPlanes('getPlanes', setplanes, setTotalRegistros2),
      getResumen()
    ]).then(() => {
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    setTitle('Listado de proyectos')
    Promise.all([
      getDataVentas(
        `indexToColaboradores3/${auth.id}`,
        setProductos,
        setTotalRegistros
      ),
      getDataToPlanes('getPlanes', setplanes, setTotalRegistros2),
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

    if (filters.activeFilter == 'estado' && filters.estado !== null) {
      filteredProductos = filteredProductos.filter(
        (pro) => pro.estado == String(filters.estado)
      )
    } else if (
      filters.activeFilter == 'fechaFin' &&
      filters.fechaFin !== null
    ) {
      filteredProductos = filteredProductos.filter(
        (pro) =>
          pro.fecha_fin !== null && pro.fecha_fin !== '' && pro.estado != '1'
      )
    } else if (filters.activeFilter == 'deshabilitado') {
      filteredProductos = filteredProductos.filter(
        // @ts-expect-error
        (pro) => pro.community_activo == 'false' && pro.fecha_fin == null
      )
    } else if (
      filters.activeFilter == 'sinFechaFinYNo1' &&
      filters.sinFechaFinYNo1 !== null
    ) {
      filteredProductos = filteredProductos.filter(
        (pro) =>
          (pro.fecha_fin == null || pro.fecha_fin == '') &&
          pro.fecha_inicio &&
          pro.estado != '1' &&
          // @ts-expect-error
          pro.community_activo != 'false'
      )
    }

    if (area != 'Todos') {
      filteredProductos = filteredProductos.filter(
        (pro) =>
          // @ts-expect-error
          pro.categoria_plan == area
      )
    }

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

  const mostrarAlerta = (): void => {
    Swal.fire({
      title: 'Aun no cuenta con una marca registrada',
      showDenyButton: true,
      confirmButtonText: 'Registrar marca',
      denyButtonText: 'Cancelar'
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        setOpenMarca(true)
      }
    })
  }

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

  const parseCustomDate = (dateString: any): any => {
    try {
      const parsedDate = parse(dateString, 'dd/MM/yyyy, hh:mm a', new Date())
      return parsedDate
    } catch (error) {
      console.error('Error parsing date:', error)
      return null // Devuelve null en caso de error para identificar el problema
    }
  }

  const parseCustomDate2 = (dateString: any): any => {
    try {
      const parsedDate = parse(dateString, 'dd/MM/yyyy, hh:mm a', new Date())
      const formattedDate = format(parsedDate, 'dd/MM/yyyy')
      return formattedDate
    } catch (error) {
      console.error('Error parsing date:', error)
      return null
    }
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
          {/* <Link
            type="button"
            to={`/admin/colaboradores/reporte/${auth.id}`}
          >
            <BsCardChecklist className="text-main text-3xl cursor-pointer" />
          </Link> */}
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
            <h5 className="lg:text-center line-clamp-1 col-span-2">
              Saldo
            </h5>
            <h5 className="lg:text-left line-clamp-1 col-span-2 ">Plan</h5>
            <h5 className="lg:text-left col-span-3">Cliente</h5>
            <h5 className="lg:text-left col-span-3">Marca</h5>
            <h5 className="lg:text-left col-span-2 pl-3">Estado</h5>
            {!filters.enCola && (
              <>
                <h5 className="lg:text-center line-clamp-1 ">
                  F. Alta
                </h5>
                <h5 className="lg:text-center w-full justify-center flex gap-2 items-center">
                  F. Inicio
                </h5>
                {!filters.sinFechaFinYNo1 && (
                  <h5 className="lg:text-center w-full justify-center flex gap-2 items-center col-span-2">
                    F. Final
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
            <h5 className="lg:text-left w-fit flex gap-2 items-center ">
                Pnt
            </h5>
            <h5 className="lg:text-left w-fit flex gap-2 items-center ">
                Pnt
            </h5>
          </div>
          {filterDate().map((orden: ValuesVenta, index: number) => (
            <>
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
                        {limpiarCadena(orden.id_contrato)}
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
                        {planes.map((plan) =>
                          orden.id_contrato.split('_')[0] == plan.codigo
                            ? plan.nombre
                            : ''
                        )}
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
                    {limpiarCadena(orden.id_contrato)}
                    </span>
                </div>
                {
                    // @ts-expect-error
                    orden.contrato ? (
                    <div className="hidden lg:block text-left col-span-2">
                        <span className="text-left text-black line-clamp-1 transition-all group-hover:w-[150%] group-hover:bg-white group-hover:absolute group-hover:inset-0 w-full h-full z-10">
                        {
                            // @ts-expect-error
                            (orden?.contrato?.tipo).toLowerCase() == 'sin costo' ? (
                            <span className="bg-orange-200 text-orange-500 font-bold w-[80%] mx-auto line-clamp-1 rounded-[1rem] text-center block">
                                Sin costo
                            </span>
                            ) : (
                            // @ts-expect-error
                              orden?.comprobante &&
                            // @ts-expect-error
                            orden?.comprobante != null && (
                                <>
                                {(() => {
                                  try {
                                    const comprobante = JSON.parse(
                                      // @ts-expect-error
                                      orden?.comprobante
                                    )
                                    if (comprobante.pendiente <= 0) {
                                      return (
                                        <span className="bg-green-200 text-[#3EBA94] font-bold w-[80%] mx-auto line-clamp-1 rounded-[1rem] text-center block ">
                                            OK
                                        </span>
                                      )
                                    } else {
                                      return (
                                        <button
                                            type="button"
                                            className="bg-[#FDD4D4] text-[#F53061] font-bold w-[80%] mx-auto line-clamp-1 rounded-[1rem] text-center block"
                                        >
                                            S/{comprobante.pendiente}
                                        </button>
                                      )
                                    }
                                  } catch (error) {
                                    console.error(
                                      'Invalid JSON in orden.comprobante:',
                                      error
                                    )
                                    return (
                                        <span className="text-red-700 font-bold">
                                        Invalid Data
                                        </span>
                                    )
                                  }
                                })()}
                                </>
                              )
                            )
                        }
                        </span>
                    </div>
                    ) : (
                    <div className="hidden lg:block text-left col-span-2">
                        <span className="text-left text-black line-clamp-1 transition-all group-hover:w-[150%] group-hover:bg-white group-hover:absolute group-hover:inset-0 w-full h-full z-10"></span>
                    </div>
                    )
                }
                <div className="hidden lg:block lg:text-center col-span-2 relative h-full">
                    <span className="text-left text-black line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                    {planes.map((plan) =>
                      orden.id_contrato.split('_')[0] == plan.codigo
                        ? plan.nombre
                        : ''
                    )}
                    </span>
                </div>
                <div className="hidden lg:block lg:text-center col-span-3 relative h-full">
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
                                className="text-left text-black line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10"
                            >
                                {contacto.nombres}
                            </span>
                          ))}
                    </>
                    ) : (
                    <span className="text-left text-black line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                        {orden.nombres} {orden.apellidos}
                    </span>
                    )}
                </div>
                <div className="hidden lg:block lg:text-center col-span-3 relative h-full">
                    <span className="text-left text-black line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                        {orden.nombre_marca}
                    </span>
                </div>
                <div
                    className={`hidden w-fit mx-auto lg:flex gap-2 lg:px-2 items-center justify-center col-span-2 lg:text-center ${
                    orden.estado == '1'
                        ? 'bg-red-600 text-white'
                        : orden.fecha_fin != null
                        ? 'bg-[#1A5515] text-white'
                        // @ts-expect-error
                        : orden.community_activo == 'false'
                        ? 'bg-yellow-500 text-white'
                        : !orden.fecha_inicio && !orden.fecha_alta
                        ? 'bg-yellow-500 text-white'
                        : 'bg-gray-300 text-gray-500'
                    }`}
                >
                    {orden.estado == '1' ? (
                    <>
                        {/* <BsCheckCircle className="hidden lg:block" /> */}
                        <span className="text-center bg-red-600 text-white font-bold w-fit line-clamp-1">
                        Abandono
                        </span>
                    </>
                    ) : orden.fecha_fin != null ? (
                    <>
                        {/* <BsCheckCircle className="hidden lg:block" /> */}
                        <span className="text-center bg-[#1A5515] text-white font-bold w-fit line-clamp-1">
                        Finalizado
                        </span>
                    </>
                    ) // @ts-expect-error
                      : orden.community_activo == 'false' ? (
                    <>
                        {/* <BsCheckCircle className="hidden lg:block" /> */}
                        <span className="text-center  text-white font-bold w-fit line-clamp-1">
                        Deshabilitado
                        </span>
                    </>
                      ) : !orden.fecha_inicio && !orden.fecha_alta ? (
                    <>
                        {/* <BsGraphUp className="hidden lg:block" /> */}
                        <span className="text-center gap-2 font-bold px-2 line-clamp-1 ">
                        En cola
                        </span>
                    </>
                      ) : (
                    <>
                        {/* <BsGraphUp className="hidden lg:block" /> */}
                        <span className="text-center gap-2 font-bold w-fit line-clamp-1">
                        En proceso
                        </span>
                    </>
                      )}
                </div>
                <div className="hidden lg:block md:text-center ">
                    <span className="text-cener block text-black">
                    {orden.fecha_alta}
                    </span>
                </div>
                <div className="hidden lg:block md:text-center col-span-2">
                    <span className="text-cener block text-black">
                    {orden.fecha_inicio}
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

                {(area == 'tienda' ||
                    area == 'landing' ||
                    area == 'administrable') &&
                    filters.fechaFin == null &&
                    (area == 'tienda' ||
                    area == 'landing' ||
                    area == 'administrable') &&
                    filters.estado !== 1 && (
                    <div className="flex justify-start ">
                        {orden.fecha_fin != null ? (
                        <span
                            className={`${
                            obtenerDiasParaMantenimiento(orden) != 'T'
                                ? 'text-black'
                                : 'text-green-600'
                            } font-bold`}
                        >
                            {obtenerDiasParaMantenimiento(orden)}
                        </span>
                        ) : (
                        <span className="text-[#252525]">{'-'} </span>
                        )}
                    </div>
                )}
                <div className="hidden lg:flex justify-start lg:text-center w-full">
                        {// @ts-expect-error
                        orden.puntuacionpromedio
                          ? <button
                            onClick={() => {
                              setOpenComentarios({ estado: true, comentarios: orden })
                            }
                            }
                            className="text-center text-white bg-green-600 text-sm rounded-full w-[20px] justify-center h-[20px] flex items-center ">
                                {// @ts-expect-error
                                orden.puntuacionpromedio}
                            </button>
                          : <span className="text-center text-white ">
                                --
                            </span>
                        }
                </div>

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
                            to={`view/${orden.id}`}
                            className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                        >
                            Ver
                        </Link>
                        )}
                    </MenuItem>
                    <MenuItem className="p-0 hover:bg-transparent">
                        {orden.id != null && (
                        <Link
                            to=""
                            onClick={() => {
                              setOpenCliente(!openCliente)
                              // @ts-expect-error-error
                              setSelectIDCLIENTE(orden.id_cliente)
                              // @ts-expect-error-error
                              setIdContacto(orden.id_contacto)
                            }}
                            className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                        >
                            Datos del cliente
                        </Link>
                        )}
                    </MenuItem>
                    <MenuItem className="p-0 hover:bg-transparent">
                        {orden.id != null && (
                        <button
                            onClick={() => {
                              if (
                                orden.nombre_marca &&
                                orden.nombre_marca.length > 0
                              ) {
                                navigate(`/admin/seguimiento/${orden.id}`)
                              } else {
                                setSelectID(orden.id)
                                mostrarAlerta()
                              }
                            }}
                            className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                        >
                            Reporte
                        </button>
                        )}
                    </MenuItem>
                    <MenuItem className="p-0 hover:bg-transparent">
                        {orden.id != null && (
                        <button
                            onClick={() => {
                              if (!orden.fecha_alta) {
                                setShowError({
                                  estado: 'warning',
                                  texto: 'Debe elegir la fecha de del alta'
                                })
                              } else if (!orden.fecha_inicio) {
                                setShowError({
                                  estado: 'warning',
                                  texto:
                                    'Debe elegir la fecha del inicio del proyecto'
                                })
                              } else {
                                navigate(
                                `/admin/lista-servicios/avances/${orden.id}`
                                )
                              }
                            }}
                            className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                        >
                            Avances
                        </button>
                        )}
                    </MenuItem>
                    <MenuItem className="p-0 hover:bg-transparent">
                        {orden.id != null && (
                        <button
                            onClick={() => {
                              setOpenMarca(true)
                              setSelectID(orden.id)
                            }}
                            className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                        >
                            Editar Marca
                        </button>
                        )}
                    </MenuItem>

                    {orden.fecha_alta == null && (
                        <MenuItem className="p-0 bg-yellow-600 hover:bg-yellow-700">
                        <button
                            onClick={() => {
                              setSelectID(orden.id)
                              setOpenAlta(true)
                            }}
                            className="rounded-lg transition-colors text-gray-300 flex items-center justify-center gap-x-4 p-2 flex-1"
                        >
                            Fecha del alta
                        </button>
                        </MenuItem>
                    )}
                    {orden.fecha_inicio == null && (
                        <MenuItem className="p-0 bg-green-600 hover:bg-green-700">
                        <button
                            onClick={() => {
                              setSelectID(orden.id)
                              setOpen(true)
                            }}
                            className="rounded-lg transition-colors text-gray-300 flex items-center justify-center gap-x-4 p-2 flex-1"
                        >
                            Fecha inicio
                        </button>
                        </MenuItem>
                    )}
                    {
                    // @ts-expect-error
                    orden.categoria_plan != 'community' &&
                        <MenuItem className="p-0 bg-red-600 hover:bg-red-700">
                            {orden.id != null && orden.fecha_fin == null && (
                            <button
                                onClick={() => {
                                  setDatos(null)
                                  if (orden.email && orden.comentarios) {
                                    setSelectID(orden.id)
                                    setCorreos([
                                      { id: Date.now(), correo: orden.email }
                                    ])
                                    setDatos({
                                      nombres: `${orden.nombres} ${orden.apellidos}`,
                                      email: orden.email,
                                      marca: orden.nombre_marca,
                                      celular: orden.celular,
                                      id_contrato: orden.id_contrato
                                    })
                                    setOpenFinal(true)
                                  } else if (!orden.comentarios) {
                                    Swal.fire(
                                      'Debe colocar sus comentarios generales',
                                      '',
                                      'warning'
                                    )
                                  } else {
                                    Swal.fire({
                                      title: 'EL cliente no tiene un email registrado',
                                      showDenyButton: true,
                                      confirmButtonText: 'Registrar email',
                                      denyButtonText: 'Cancelar'
                                    }).then(async (result: SweetAlertResult) => {
                                      if (result.isConfirmed) {
                                        // @ts-expect-error-error
                                        setSelectIDCLIENTE(orden.id_cliente)
                                        setOpenEmail(true)
                                      }
                                    })
                                  }
                                }}
                                className="rounded-lg transition-colors text-gray-300 flex items-center justify-center gap-x-4 p-2 flex-1"
                            >
                                Finalizar servicio
                            </button>
                            )}
                        </MenuItem>
                    }
                    </Menu>
                </div>
                </div>
                <div className="w-full">
                {
                  // @ts-expect-error
                  (orden.comprobanteadicional ||
                    // @ts-expect-error
                    orden.comprobanteadicionalgratis) &&
                    // @ts-expect-error
                    (JSON.parse(orden.comprobanteadicional).length > 0 ||
                      // @ts-expect-error
                      JSON.parse(orden.comprobanteadicionalgratis).length >
                        0) && (
                      <>
                        {[
                          // @ts-expect-error
                          ...(JSON.parse(orden.comprobanteadicional) ?? []),
                          // @ts-expect-error
                          ...(JSON.parse(orden.comprobanteadicionalgratis) ?? [])
                        ]
                          .sort((a, b) => {
                            const dateA = parseCustomDate(a.fecha)
                            const dateB = parseCustomDate(b.fecha)
                            return dateB - dateA // Ordenar de más reciente a más antiguo
                          })
                          .map((adicional: any) => (
                            <div className="w-full" key={adicional.id}>
                                {adicional.arrayPesos?.some((asignacion: any) => asignacion.peso == auth.id) &&
                              <div
                                className={`grid grid_teplate_ventas ${
                                  filters.enCola
                                    ? 'grid_teplate_ventas_encola'
                                    : ''
                                } 
                                        ${
                                          filters.sinFechaFinYNo1
                                            ? 'grid_teplate_ventas_pendientes'
                                            : ''
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
                                          filters.activeFilter ===
                                            'sinFechaFinYNo1'
                                            ? 'grid_community_activo_with_proceso'
                                            : ''
                                        } 
                                        md:pr-10 lg:pr-4 relative gap-3 items-center mb-3 lg:mb-0 lg:px-4 lg:py-3 rounded-xl  shadow_class
                                        ${
                                          obtenerDiasParaPrimerPago(
                                            orden.fecha_inicio
                                          ) > 0 &&
                                          obtenerDiasParaPrimerPago(
                                            orden.fecha_inicio
                                          ) <= 2 &&
                                          area === 'community' &&
                                          orden.fecha_fin == null
                                            ? 'casi_vencimiento_community'
                                            : `${
                                                obtenerDiasParaPrimerPago(
                                                  orden.fecha_inicio
                                                ) == 0 &&
                                                area === 'community' &&
                                                orden.fecha_fin == null
                                                  ? 'vencimiento_community'
                                                  : ''
                                              }`
                                        }
                                        ${
                                          // @ts-expect-error
                                          obtenerDiasParaMantenimiento(orden) >
                                            0 &&
                                          // @ts-expect-error
                                          obtenerDiasParaMantenimiento(orden) <=
                                            2 &&
                                          (area == 'tienda' ||
                                            area == 'landing' ||
                                            area == 'administrable') &&
                                          orden.fecha_fin != null
                                            ? 'casi_vencimiento_community'
                                            : `${
                                                obtenerDiasParaMantenimiento(
                                                  orden
                                                ) == 0 &&
                                                (area == 'tienda' ||
                                                  area == 'landing' ||
                                                  area == 'administrable') &&
                                                orden.fecha_fin != null
                                                  ? 'vencimiento_community'
                                                  : ''
                                              }`
                                        }
                                        md:pr-10 lg:pr-4 relative gap-3 items-center mb-3 lg:mb-0 
                                        `}
                                key={orden.id}
                              >
                                <div className="hidden lg:block lg:text-center col-span-1 relative h-full">
                                  <span className="text-left text-black block line-clamp-1 transition-all  w-full h-full z-10 relative">
                                    <p className="absolute h-1/2 w-[3px] bg-gray-300 ml-4 "></p>
                                    <p className="bg-gray-300 absolute w-full h-[3px] bottom-0 top-0 my-auto left-4"></p>
                                  </span>
                                </div>
                                <div className="hidden lg:block lg:text-center col-span-2 relative h-full">
                                  <span className="text-left text-black line-clamp-1 transition-all group-hover:w-[150%] group-hover:bg-white group-hover:absolute group-hover:inset-0 w-full h-full z-10">
                                    {adicional?.tipo == 'sin costo' ? (
                                      <span className="bg-orange-200 text-orange-500 font-bold w-[80%] mx-auto line-clamp-1 rounded-[1rem] text-center block ">
                                        Sin costo
                                      </span>
                                    ) : (
                                      <>
                                        {(() => {
                                          try {
                                            if (adicional.pendiente <= 0) {
                                              return (
                                                <span className="bg-green-200 text-[#3EBA94] font-bold w-[80%] mx-auto line-clamp-1 rounded-[1rem] text-center block">
                                                  OK
                                                </span>
                                              )
                                            } else {
                                              return (
                                                <span
                                                  className="bg-[#FDD4D4] text-[#F53061] font-bold w-[80%] mx-auto line-clamp-1 rounded-[1rem] text-center block"
                                                >
                                                  S/
                                                  {adicional.pendiente}
                                                </span>
                                              )
                                            }
                                          } catch (error) {
                                            console.error(
                                              'Invalid JSON in orden.comprobante:',
                                              error
                                            )
                                            return (
                                              <span className="text-red-700 font-bold">
                                                Invalid Data
                                              </span>
                                            )
                                          }
                                        })()}
                                      </>
                                    )}
                                  </span>
                                </div>
                                <div className="hidden lg:block lg:text-center col-span-2 relative h-full">
                                  <span className="text-left uppercase text-black line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                                    {adicional.arrayAdicionales?.map(
                                      (colaborador: any) =>
                                        colaborador.elemento
                                    )}
                                  </span>
                                </div>
                                <div className="hidden lg:block lg:text-center col-span-3 relative h-full">
                                  {orden.id_contacto ? (
                                    <>
                                      {orden.arraycontacto &&
                                        JSON.parse(orden.arraycontacto).length >
                                          0 &&
                                        JSON.parse(orden.arraycontacto)
                                          .filter(
                                            (contacto: arrayContacto) =>
                                              String(contacto.id ?? '') ==
                                              orden.id_contacto
                                          )
                                          .map((contacto: arrayContacto) => (
                                            <span
                                              key={contacto.id}
                                              className="text-left text-black line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10"
                                            >
                                              {contacto.nombres}
                                            </span>
                                          ))}
                                    </>
                                  ) : (
                                    <span className="text-left text-black line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                                      {orden.nombres} {orden.apellidos}
                                    </span>
                                  )}
                                </div>
                                <div className="hidden lg:block lg:text-center col-span-3 relative h-full">
                                  <span className="text-left text-black line-clamp-1 transition-all hover:w-[200%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                                    {orden.nombre_marca
                                      ? orden.nombre_marca
                                      : 'No registrado'}
                                  </span>
                                </div>
                                <div className="hidden lg:block lg:text-center col-span-2 relative h-full">
                                  <span className="text-center text-black line-clamp-1 transition-all  w-full h-full z-10">
                                    ---
                                  </span>
                                </div>
                                <div className="hidden lg:block lg:text-center relative h-full">
                                  <span className="text-center text-black line-clamp-1 transition-all w-full h-full z-10">
                                    {parseCustomDate2(adicional.fecha)}
                                  </span>
                                </div>
                              </div>
                                }
                            </div>
                          ))}
                      </>
                  )
                }
              </div>
            </>
          ))}

          <div className="flex flex-col md:flex-row gap-5 md:gap-0 justify-center md:justify-between content_buttons pt-3">
            <p className="text-md ml-1 text-black">
              {totalPosts} Registros
            </p>
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
      <VerComentarios
          open={openComentarios}
          setOpen={setOpenComentarios}
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
