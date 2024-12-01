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
import { limpiarCadena, quitarAcentos } from '../../../shared/functions/QuitarAcerntos'
import { ModalFechaInicio } from './ModalFechaInicio'
import { ModalCorreoFinal } from './ModalCorreoFinal'
import Swal, { type SweetAlertResult } from 'sweetalert2'
import { IoShareSocialSharp } from 'react-icons/io5'
import { RegistroEmail } from './RegistroEmail'
import { BsCardChecklist } from 'react-icons/bs'
import { ResumenAdicional } from './ResumenAdicional'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { AlertSucess } from '../../../shared/alerts/AlertSucess'
// import { GeneradorExcel } from '../../../shared/EXCEL/GeneradorExcel'
import { AnimatePresence, motion } from 'framer-motion'
import { ModalFechaAlta } from './modals/ModalFechaAlta'
import { RegistroMarcaList } from './modals/RegistroMarcaList'
import { ModalCliente } from './ModalClientes/ModalCliente'
import { MdLabelOutline } from 'react-icons/md'
import { FaAngleDown } from 'react-icons/fa6'
import { cn } from '../../../shared/cn'

interface Filters {
  estado?: number | null
  fechaFin?: boolean | null
  activeFilter: string | null
  sinFechaFinYNo1: boolean | null
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

export const ListaServicios2 = (): JSX.Element => {
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
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [, setTotalRegistros2] = useState(0)
  const [openEstado, setOpenEstado] = useState(false)
  const [paginaActual, setpaginaActual] = useState<number>(1)
  const [search, setSearch] = useState('')
  const [cantidadRegistros] = useState(12)
  const token = localStorage.getItem('token')
  const [dateInicio, setDateInicio] = useState<Value>(null)
  const [selectID, setSelectID] = useState(0)
  const [selectIDCLIENTE, setSelectIDCLIENTE] = useState(0)
  const [idcontacto, setIdContacto] = useState(0)
  const [correos, setCorreos] = useState<arrayCorreos[]>([])
  const [datos, setDatos] = useState<valuesDatos | null>(null)
  const navigate = useNavigate()
  const [showError, setShowError] = useState<errorValues | null>(null)
  const [filters, setFilters] = useState<Filters>({
    estado: null,
    fechaFin: null,
    activeFilter: 'sinFechaFinYNo1',
    sinFechaFinYNo1: true
  })

  const [area] = useState('Todos')

  useEffect(() => {
    setTitle('Listado de proyectos')
    Promise.all([
      getDataVentas(
        `indexToColaboradores2/${auth.id}`,
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
        `indexToColaboradores2/${auth.id}`,
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

    if (filters.activeFilter == 'enCola') {
      filteredProductos = filteredProductos.filter(
        (pro) =>
          !pro.fecha_alta &&
            !pro.fecha_inicio &&
            !pro.fecha_fin &&
            pro.estado != '1'
      )
    } else if (filters.activeFilter == 'fechaFin' && filters.fechaFin !== null) {
      filteredProductos = filteredProductos.filter(
        (pro) =>
          pro.fecha_fin !== null && pro.fecha_fin !== '' && pro.estado != '1'
      )
    } else if (
      filters.activeFilter == 'sinFechaFinYNo1' &&
      filters.sinFechaFinYNo1 !== null
    ) {
      filteredProductos = filteredProductos.filter(
        (pro) =>
          (pro.fecha_fin == null || pro.fecha_fin == '') && pro.estado != '1'
      )
    }

    if (area != 'Todos') {
      filteredProductos = filteredProductos.filter(
        (pro) =>
        // @ts-expect-error
          ((pro.categoria_plan) == (area))
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
    type: 'estado' | 'fechaFin' | 'sinFechaFinYNo1' | 'enCola',
    value: number | boolean
  ) => {
    setFilters((prev) => {
      if (prev.activeFilter === type) {
        if (type === 'fechaFin') {
          // Si desactivas el filtro fechaFin, desactiva el filtro enCola y activa automáticamente el filtro sinFechaFinYNo1
          return {
            ...prev,
            fechaFin: null,
            sinFechaFinYNo1: true,
            enCola: null,
            activeFilter: 'sinFechaFinYNo1'
          }
        } else if (type === 'enCola') {
          // Si desactivas el filtro enCola, activa automáticamente el filtro sinFechaFinYNo1
          return {
            ...prev,
            fechaFin: null,
            sinFechaFinYNo1: true,
            enCola: null,
            activeFilter: 'sinFechaFinYNo1'
          }
        } else {
          // Desactiva el filtro si ya estaba activo
          return { ...prev, [type]: null, activeFilter: null }
        }
      }
      // Activa el filtro seleccionado y desactiva los demás
      return {
        estado: null,
        fechaFin: null,
        enCola: null,
        sinFechaFinYNo1: null,
        [type]: value,
        activeFilter: type
      }
    })
  }

  const exportarWsp = (): void => {
    const fechaActual = new Date().toLocaleDateString('es-ES', {
      day: 'numeric',
      month: 'numeric',
      year: 'numeric'
    })
    // Filtra los comentarios del día actual
    const comentarios = productos.flatMap((producto) => {
      if (!producto.resumen) {
        // Verifica si resumen es null o undefined
        return []
      }
      return JSON.parse(producto.resumen)
        .filter((comentario: valuesResumen) => (comentario.fecha == fechaActual && comentario.userId == auth.id))
        .map((comentario: valuesResumen) => ({
          ...comentario,
          cliente: `${producto.nombre_marca} (${producto.nombres} ${producto.apellidos})`
        }))
    })
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    let mensajeWsp = `RESUMEN ${auth.name} / ${fechaActual.replace(
      /\//g,
      '-'
    )}\n\n`

    // eslint-disable-next-line @typescript-eslint/no-confusing-void-expression
    comentarios.forEach((comentario: valuesResumen, index: number) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      mensajeWsp += `- ${comentario.cliente.toUpperCase()}: ${comentario.texto.toUpperCase()}`
      if (index < comentarios.length - 1) {
        mensajeWsp += '\n\n' // Añadir salto de línea doble si no es el último comentario
      }
    })

    resumen
      .filter((comentario: valuesResumen) => (comentario.fecha == fechaActual && comentario.userId == auth.id))
      .forEach((comentario: valuesResumen) => {
        if (comentarios.length > 0) {
          mensajeWsp += '\n\n'
        }
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        mensajeWsp += `- AGENCIA: ${comentario.texto.toUpperCase()}`
      })

    const mensajeWspEncoded = encodeURIComponent(mensajeWsp)
    const urlWhatsApp = `https://web.whatsapp.com/send?text=${mensajeWspEncoded}`
    // Abrir WhatsApp con el mensaje predefinido en una nueva ventana o pestaña
    window.open(urlWhatsApp, '_blank')
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
      const diasRestantes = Math.ceil((fechaActual.getTime() - hoy.getTime()) / (1000 * 3600 * 24))

      return diasRestantes
    }

    return 0
  }

  return (
    <>
      <div className="flex flex-row items-center justify-between gap-y-4 mb-3 md:mb-4 gap-2">
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
          <Link
            type="button"
            to={`/admin/colaboradores/reporte/${auth.id}`}
          >
            <BsCardChecklist className="text-main text-3xl cursor-pointer" />
          </Link>
          <button
            type="button"
            onClick={() => {
              exportarWsp()
            }}
          >
            <IoShareSocialSharp className="text-main text-3xl cursor-pointer" />
          </button>
        </div>
      </div>
      {loading
        ? <Loading />
        : (
        <div className="md:bg-[#fff] md:p-8 rounded-xl">
          <div
            className={`hidden md:grid md:pr-10 lg:pr-4 grid-cols-1 md:grid-cols-6 
            ${!filters.sinFechaFinYNo1 ? 'lg:grid-cols-9' : 'lg:grid-cols-8'} 
            gap-4 mb-2 md:px-4 md:py-2 text-gray-400 border-y border-gray-300
            ${area === 'community' && filters.activeFilter === 'sinFechaFinYNo1' ? 'lg:grid-cols-9' : ''}`}
          >
            <h5 className="md:text-left line-clamp-1">Contrato</h5>
            <h5 className="md:text-left line-clamp-1 md:col-span-2 lg:col-span-1">
              Plan
            </h5>
            <h5 className="md:text-left line-clamp-1 md:hidden lg:block">
              Cliente
            </h5>
            <h5 className="md:text-left line-clamp-1 md:col-span-2 lg:col-span-1">
              Marca
            </h5>
            <h5 className="md:text-center line-clamp-1 md:hidden lg:block">
              Medio de ingreso
            </h5>
            <h5 className="md:text-center">Estado</h5>
            <h5 className="md:text-center line-clamp-1">Fecha de Alta</h5>
            <h5 className="md:text-center line-clamp-1">Fecha de Inicio</h5>
            {!filters.sinFechaFinYNo1
              ? (
              <h5 className="md:text-center line-clamp-1">Fecha Final</h5>
                )
              : null}

            {((area === 'community' && filters.fechaFin == null) && (area === 'community' && filters.activeFilter === 'sinFechaFinYNo1')) && (
              <h5 className="text-center ">Dias</h5>
            )}
          </div>
          {filterDate().map((orden: ValuesVenta, index: number) => (
            <div
              className={`grid grid-cols-1 md:grid-cols-6 ${
                !filters.sinFechaFinYNo1 ? 'lg:grid-cols-9' : 'lg:grid-cols-8'
              } md:pr-10 lg:pr-4 relative gap-3 items-center mb-3 md:mb-3 ${
                index % 2 == 0 ? 'bg-transparent' : 'bg-gray-200'
              } md:px-4 md:py-2 rounded-xl relative shadow_class
              ${area === 'community' && filters.activeFilter === 'sinFechaFinYNo1' ? 'lg:grid-cols-9' : ''}
              ${area === 'community' && obtenerDiasParaPrimerPago(orden.fecha_inicio) > 0 && obtenerDiasParaPrimerPago(orden.fecha_inicio) <= 2 ? 'casi_vencimiento_community' : `${obtenerDiasParaPrimerPago(orden.fecha_inicio) == 0 && area === 'community' ? 'vencimiento_community' : ''}`}
              ${area === 'community' && obtenerDiasParaPrimerPago(orden.fecha_inicio) == 0 ? 'vencimiento_community' : ''}
              `}
              key={orden.id}
            >
              <div
                // to={`view-servicio/${orden.id}`}
                className="flex flex-col gap-3 md:hidden bg-form p-4 rounded-xl"
              >
                <div className="flex md:hidden gap-4">
                  {orden.estado == '1'
                    ? (
                    <span className="flex items-center justify-center bg-red-400 text-red-600  w-8 h-8 rounded-full">
                      A
                    </span>
                      )
                    : orden.fecha_fin != null
                      ? (
                    <span className="flex items-center justify-center bg-[#b3dba1] text-green-700 w-8 h-8 rounded-full">
                      T
                    </span>
                        )
                      : (
                    <span className="flex items-center justify-center bg-gray-300 text-gray-500 w-8 h-8 rounded-full">
                      P
                    </span>
                        )}
                  <span className="flex md:justify-left items-center gap-3 font-bold text-black">
                    {limpiarCadena(orden.id_contrato)}
                  </span>
                </div>
                <div className="md:hidden flex justify-between gap-3">
                  <div className="md:text-center ">
                    <h5 className="md:hidden text-black font-bold mb-0 text-sm">
                      Empresa
                    </h5>

                    <span className="text-left w-full text-black line-clamp-1">
                      {orden.nombre_empresa}
                    </span>
                  </div>
                  <div className="md:text-right ">
                    <h5 className="md:hidden text-black font-bold mb-0 text-sm bg text-right">
                      Cliente
                    </h5>
                    {orden.id_contacto
                      ? <>
                  {orden.arraycontacto && JSON.parse(orden.arraycontacto).length > 0 &&
                    JSON.parse(orden.arraycontacto).filter((contacto: arrayContacto) => String(contacto.id ?? '') == orden.id_contacto).map((contacto: arrayContacto) => (
                    <span key={contacto.id} className="text-left w-full text-black line-clamp-1">
                        {contacto.nombres}
                    </span>
                    ))
                    }
                  </>
                      : <span className="text-left w-full text-black line-clamp-1">
                    {orden.nombres} {orden.apellidos}
                </span>
                }
                  </div>
                </div>
                <div className="md:hidden flex justify-between gap-3">
                  <div className="md:text-center ">
                    <h5 className="md:hidden text-[#62be6d] font-bold mb-0 text-sm ">
                      Fecha de Alta
                    </h5>
                    <span className="text-left block text-[#62be6d]">
                      {orden.fecha_alta}
                    </span>
                  </div>
                  <div className="md:text-center ">
                    <h5 className="md:hidden text-[#62be6d] font-bold mb-0 text-sm ">
                      Fecha de Inicio
                    </h5>
                    <span className="text-left block text-[#62be6d]">
                      {orden.fecha_inicio}
                    </span>
                  </div>
                  {!filters.sinFechaFinYNo1 && (
                    <div className="md:text-right ">
                      <h5 className="md:hidden text-red-500 text-right font-bold mb-0 text-sm">
                        Fecha de cierre
                      </h5>
                      <span className="text-right block text-red-500">
                        {orden.fecha_fin}
                      </span>
                    </div>
                  )}
                </div>
              </div>
              {/* PC */}
              <div className="hidden md:block md:text-center">
                <span className="text-left block text-black w-full line-clamp-1">
                  {limpiarCadena(orden.id_contrato)}
                </span>
              </div>
              <div className="hidden md:block md:text-center col-span-1 relative h-full">
                <span className="text-left text-black line-clamp-1 transition-all hover:w-[150%] hover:bg-inherit hover:text-[#252525] hover:absolute hover:inset-0 w-full h-full z-10">
                  {planes.map((plan) =>
                    orden.id_contrato.split('_')[0] == plan.codigo
                      ? plan.nombre
                      : ''
                  )}
                </span>
              </div>
              <div className="hidden md:block md:text-center col-span-1 relative h-full">
                {orden.id_contacto
                  ? <>
                  {orden.arraycontacto && JSON.parse(orden.arraycontacto).length > 0 &&
                    JSON.parse(orden.arraycontacto).filter((contacto: arrayContacto) => String(contacto.id ?? '') == orden.id_contacto).map((contacto: arrayContacto) => (
                    <span key={contacto.id} className="text-left text-black line-clamp-1 transition-all hover:w-[150%] hover:bg-inherit hover:absolute hover:inset-0 w-full h-full z-10">
                        {contacto.nombres}
                    </span>
                    ))
                    }
                  </>
                  : <span className="text-left text-black line-clamp-1 transition-all hover:w-[150%] hover:bg-inherit hover:absolute hover:inset-0 w-full h-full z-10">
                    {orden.nombres} {orden.apellidos}
                </span>
                }
              </div>
              <div className="hidden md:block md:text-center md:col-span-2 lg:col-span-1">
                <span className="text-left text-black line-clamp-1 w-full">
                  {orden.nombre_marca}
                </span>
              </div>
              <div className="hidden md:hidden lg:block md:text-center ">
                <span className="text-center block text-black">
                  {orden.medio_ingreso == '0'
                    ? 'Facebook'
                    : orden.medio_ingreso == '1'
                      ? 'Google'
                      : orden.medio_ingreso == '5'
                        ? 'Instagram'
                        : orden.medio_ingreso == '2'
                          ? 'Ventas'
                          : orden.medio_ingreso == '3'
                            ? 'Post Venta'
                            : orden.medio_ingreso == '4'
                              ? 'Whatsapp'
                              : orden.medio_ingreso == '6'
                                ? 'Recomendación'
                                : orden.medio_ingreso == '7'
                                  ? 'Logos'
                                  : ''}
                </span>
              </div>
              <div
                className={`hidden w-fit mx-auto md:flex gap-2 px-2 items-center justify-center md:text-center ${
                orden.estado == '1'
                    ? 'bg-red-600 text-white'
                    : orden.fecha_fin != null
                    ? 'bg-[#1A5515] text-white'
                    : !orden.fecha_inicio && !orden.fecha_alta
                    ? 'bg-yellow-500 text-white'
                    : 'bg-gray-300 text-gray-500'
                }`}
              >
                {orden.estado == '1'
                  ? (
                  <>
                    {/* <BsCheckCircle className="hidden lg:block" /> */}
                    <span className="text-center bg-red-600 text-white font-bold w-fit line-clamp-1">
                      Abandono
                    </span>
                  </>
                    )
                  : orden.fecha_fin != null
                    ? (
                  <>
                    {/* <BsCheckCircle className="hidden lg:block" /> */}
                    <span className="text-center bg-[#1A5515] text-white font-bold w-fit line-clamp-1">
                      Finalizado
                    </span>
                  </>
                      )
                    : !orden.fecha_inicio && !orden.fecha_alta
                        ? (
                  <>
                    {/* <BsGraphUp className="hidden lg:block" /> */}
                    <span className="text-center gap-2 font-bold px-2 line-clamp-1 ">
                      En cola
                    </span>
                  </>
                          )
                        : (
                  <>
                    {/* <BsGraphUp className="hidden lg:block" /> */}
                    <span className="text-center gap-2 font-bold w-fit line-clamp-1">
                      En proceso
                    </span>
                  </>
                          )}
              </div>
              <div className="hidden md:block md:text-center">
                <span className="text-cener block text-black">
                  {orden.fecha_alta}
                </span>
              </div>
              <div className="hidden md:block md:text-center">
                <span className="text-cener block text-black">
                  {orden.fecha_inicio}
                </span>
              </div>
              {!filters.sinFechaFinYNo1 && (
                <div className="hidden md:block md:text-center">
                  <span className="text-center block text-black">
                    {orden.fecha_fin}
                  </span>
                </div>
              )}

              {((area === 'community' && filters.fechaFin == null) && (area === 'community' && filters.estado !== 1)) && (
                <div className="flex justify-center">
                  <span className='text-[#252525]'>{obtenerDiasParaPrimerPago(orden.fecha_inicio)} </span>
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
                        to=''
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
                          if (orden.nombre_marca && orden.nombre_marca.length > 0) {
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
                            Swal.fire('Debe colocar sus comentarios generales', '', 'warning')
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
                </Menu>
              </div>
            </div>
          ))}

          <div className="flex flex-col md:flex-row gap-5 md:gap-0 justify-center md:justify-between content_buttons pt-3">
            <p className="text-md ml-1 text-black">
              {totalRegistros} Registros
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

      <ModalCliente open={openCliente} setOpen={setOpenCliente} id={selectIDCLIENTE} idcontacto={idcontacto}/>

      <AnimatePresence>
        {showError != null && <AlertSucess showError={showError} />}
      </AnimatePresence>
    </>
  )
}
