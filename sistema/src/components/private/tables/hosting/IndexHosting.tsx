/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu'
import axios from 'axios'
import { MdLabelOutline } from 'react-icons/md'
import { Global } from '../../../../helper/Global'
import {
  type arrayContacto,
  type ValuesVenta
} from '../../../shared/schemas/Interfaces'
import { getDataVentas } from '../../../shared/FetchingData'
import {
  limpiarCadena,
  quitarAcentos
} from '../../../shared/functions/QuitarAcerntos'
import { Loading } from '../../../shared/Loading'
import { FaAngleDown } from 'react-icons/fa6'
import { IoIosSearch } from 'react-icons/io'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '../../../shared/cn'
import { addHours, format, parseISO } from 'date-fns'
import { FiltorsHosting } from './filtros/FiltorsHosting'
import { Chip } from '@mui/material'
import { toast } from 'sonner'
import { ModalRenovacion } from './components/ModalRenovacion'
import { RiSettings3Fill } from 'react-icons/ri'
import { Swiper, SwiperSlide } from 'swiper/react'
import { v4 as uuidv4 } from 'uuid'

import 'swiper/css'
import 'swiper/css/pagination'
// import required modules
import { Pagination } from 'swiper/modules'
import Swal, { type SweetAlertResult } from 'sweetalert2'
import { convertirNumeroALetras } from '../../../shared/functions/GenerarTextoEnLetras'
// import { GeneradorExcel } from '../../../../shared/EXCEL/GeneradorExcel'
interface Filters {
  estado?: number | null
  enCola?: boolean | null
  fechaFin?: boolean | null
  activeFilter: null
  sinFechaFinYNo1: boolean | null
}

export const IndexHosting = (): JSX.Element => {
  //   FILTROS
  const currentDate = new Date()
  const [selectedDate, setSelectedDate] = useState<Date | null>(currentDate)
  const [selectPrecio, setSelectPrecio] = useState<string | null>(null)
  const [selectAntiguo, setSelectAntiguo] = useState<string | null>(null)
  const token = localStorage.getItem('token')
  const [openEstado, setOpenEstado] = useState(false)
  const [loading, setLoading] = useState(false)
  const [openList, setOpenList] = useState({ id: null, estado: false })
  const [productos, setProductos] = useState<ValuesVenta[]>([])
  const [, setProductosActivos] = useState<ValuesVenta[]>([])
  const [, setProductosInActivos] = useState<ValuesVenta[]>([])
  const [selecctionEstado] = useState('todos')
  const [, setTotalRegistros] = useState(0)
  const [, setTotalRegistrosActivos] = useState(0)
  const [, setTotalRegistrosInActivos] = useState(0)
  const [search, setSearch] = useState('')
  const [estado, setEstado] = useState(1)
  const [filters, setFilters] = useState<Filters>({
    estado: null,
    fechaFin: null,
    enCola: null,
    activeFilter: null,
    sinFechaFinYNo1: null
  })

  const getDataVentas2 = async (ruta: string, setDatos: any): Promise<void> => {
    const request = await axios.get(`${Global.url}/${ruta}`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setDatos(request.data)
  }

  useEffect(() => {
    Promise.all([
      getDataVentas('getDatosHosting', setProductos, setTotalRegistros),
      getDataVentas(
        'getDatosHostingActivos',
        setProductosActivos,
        setTotalRegistrosActivos
      ),
      getDataVentas(
        'getDatosHostingInActivos',
        setProductosInActivos,
        setTotalRegistrosInActivos
      )
    ]).then(() => {
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getDataVentas2(
        selecctionEstado == 'todos'
          ? 'getDatosHosting'
          : selecctionEstado == 'activos' ? 'getDatosHostingActivos' : 'getDatosHostingInActivos',
        setProductos
      )
    ]).then(() => {
      setLoading(false)
    })
  }, [selecctionEstado])

  let totalPosts = 0

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
    } else if (
      filters.activeFilter == 'sinFechaFinYNo1' &&
      filters.sinFechaFinYNo1 !== null
    ) {
      filteredProductos = filteredProductos.filter(
        (pro) =>
          (pro.fecha_fin == null || pro.fecha_fin == '') &&
          pro.fecha_inicio &&
          pro.estado != '1'
      )
    }
    // FILTROS ESPECIFICOS
    if (selectedDate && search.length <= 2) {
      filteredProductos = filteredProductos.filter((pro: any) => {
        const startDate = new Date(parseISO(JSON.parse(pro.hosting).inicio))
        return startDate.getMonth() === selectedDate.getMonth()
      })
    }

    if (estado == 1) {
      filteredProductos = filteredProductos.filter((pro: any) => {
        return pro.activehosting == 1
      })
    }

    if (selectPrecio && selectPrecio == 'MAYOR PRECIO') {
      filteredProductos = filteredProductos.sort((a: any, b: any) => {
        const precioA = parseFloat(JSON.parse(a.hosting).montoC)
        const precioB = parseFloat(JSON.parse(b.hosting).montoC)
        return precioB - precioA // Orden de mayor a menor precio
      })
    } else if (selectPrecio && selectPrecio == 'MENOR PRECIO') {
      filteredProductos = filteredProductos.sort((a: any, b: any) => {
        const precioA = parseFloat(JSON.parse(a.hosting).montoC)
        const precioB = parseFloat(JSON.parse(b.hosting).montoC)
        return precioA - precioB // Orden de menor a mayor precio
      })
    } else {
      filteredProductos = filteredProductos.sort((a: any, b: any) => {
        const correlativoA = limpiarCadena(a.correlativo)
        const correlativoB = limpiarCadena(b.correlativo)
        return correlativoB.localeCompare(correlativoA) // Ordenar alfabéticamente descendente
      })
    }

    if (selectAntiguo === 'MAS ANTIGUOS') {
      // Ordenar por fecha de inicio de hosting de más antiguo a más nuevo
      filteredProductos = filteredProductos.sort((a: any, b: any) => {
        const dateA = new Date(JSON.parse(a.hosting).inicio)
        const dateB = new Date(JSON.parse(b.hosting).inicio)
        return dateA.getTime() - dateB.getTime()
      })
    } else if (selectAntiguo === 'MAS NUEVOS') {
      // Ordenar por fecha de inicio de hosting de más nuevo a más antiguo
      filteredProductos = filteredProductos.sort((a: any, b: any) => {
        const dateA = new Date(JSON.parse(a.hosting).inicio)
        const dateB = new Date(JSON.parse(b.hosting).inicio)
        return dateB.getTime() - dateA.getTime()
      })
    }
    const searchTerm = quitarAcentos(search)
    // ... puedes agregar otras condiciones de filtro aquí
    if (search.length > 0) {
      filteredProductos = filteredProductos.filter((pro: any) => {
        const hosting = JSON.parse(pro.hosting)
        const fullName = `${hosting.nombres} ${hosting.apellidos}`.toLowerCase()
        const fullEmpresa = hosting?.marca && `${hosting.marca}`.toLowerCase()
        const dominio = hosting.dominio
        return (
          quitarAcentos(fullEmpresa).includes(searchTerm) ||
          quitarAcentos(dominio).includes(searchTerm) ||
          quitarAcentos(fullName).includes(searchTerm)
          //   String(pro.id).includes(searchTerm)
        )
      })
    }
    totalPosts = filteredProductos.length
    return filteredProductos
  }

  const onSeachChange = ({
    target
  }: React.ChangeEvent<HTMLInputElement>): void => {
    // setpaginaActual(1)
    setSearch(target.value)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const toggleFilter = (
    type: 'estado' | 'fechaFin' | 'sinFechaFinYNo1' | 'enCola',
    value: number | boolean
  ) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    setFilters((prev) => {
      if (prev.activeFilter == type) {
        return { ...prev, [type]: null, activeFilter: null } // desactiva el filtro si ya estaba activo
      }
      return {
        estado: null,
        fechaFin: null,
        enCola: null,
        sinFechaFinYNo1: null,
        [type]: value,
        activeFilter: type
      } // activa el filtro seleccionado y desactiva los demás
    })
  }

  const monthNames = [
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

  const getMonthName = (date: Date): string => {
    return monthNames[date?.getMonth()]
  }

  let totalCobrar = 0
  let totalPagar = 0
  const today = new Date().toISOString().slice(0, 10) // Obtener la fecha de hoy en formato 'yyyy-mm-dd'

  const [nuevaFecha, setNuevaFecha] = useState<string>(today)
  const [nuevoPrecio, setNuevoPrecio] = useState('')
  const [montoPrecio, setMontoprecio] = useState('')
  const [factura, setFactura] = useState('')
  const [banco, setBanco] = useState('')
  const [archivosSubido, setArchivosSubido] = useState<any | null>(null)
  const [agregarRenovacion, setAgregarRenovacion] = useState({
    estado: false,
    id: null,
    hosting: null,
    orden: null
  })

  const obtenerFechaHora = (): { fecha: string, hora: string } => {
    const ahora = new Date()
    const opcionesFecha = { year: 'numeric', month: '2-digit', day: '2-digit' }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const fecha = ahora.toLocaleDateString('es-PE', opcionesFecha)
    const opcionesHora = { hour: '2-digit', minute: '2-digit' }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const hora = ahora.toLocaleTimeString('es-PE', opcionesHora)
    return { fecha, hora }
  }
  const updateHosting = async (
    updatedEvents: any,
    id: string,
    orden: any,
    nuevoPrecio: any,
    idUnico: any
  ): Promise<void> => {
    setLoading(true)
    const data = new FormData()
    const { fecha, hora } = obtenerFechaHora()
    const fechaActual = new Date()
    const fechaFormateada = format(fechaActual, 'dd/MM/yyyy', {
      // @ts-expect-error
      timeZone: 'America/Lima'
    })
    // Formatea la fecha final restando un día
    const avance = {
      idUnico,
      fecha,
      hora,
      asunto: `Renovación de ${updatedEvents?.tiposervicio ?? ''}`,
      empresa: updatedEvents?.marca ?? '',
      contacto: `${updatedEvents?.nombres} ${updatedEvents?.apellidos}`,
      motivo: `Renovación de ${updatedEvents?.tiposervicio ?? ''}`,
      fechaacta: fechaFormateada,
      imagenes: [],
      archivos: archivosSubido,
      correos: [{ id: Date.now(), correo: updatedEvents?.email ?? '' }],
      contexto: `<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\">
      <p>Buenas tardes Estimado(a) ${updatedEvents.nombres} ${updatedEvents.apellidos},</p>
      <p>Es un placer para nosotros comunicarnos contigo para expresar nuestro sincero agradecimiento por haber renovado tu servicio de Alquiler de hosting con Logos Perú. Valoramos profundamente tu confianza en nuestros servicios y nos comprometemos a seguir brindándote el mejor soporte y calidad en cada aspecto de tu experiencia con nosotros.</p>
      <p>Recuerda que estamos aquí para cualquier consulta, solicitud o soporte técnico que requieras. No dudes en contactarnos ante cualquier inquietud o sugerencia.</p>
      <p>Una vez más, ¡gracias por elegirnos como tu proveedor de servicios de Alquiler de hosting!</p>
      <p>¡Saludos cordiales!</p>
  </div>`,
      conclusion: '',
      firma: 'firma_agencia.jpg'
    }
    data.append('idUnico', idUnico)
    data.append('hosting', JSON.stringify(updatedEvents))
    data.append('contrato', orden.correlativo)
    data.append(
      'nombres',
      `${updatedEvents.nombres} ${updatedEvents.apellidos}`
    )
    data.append('email', updatedEvents.email)
    let preciofinal = 0
    let igvfinal = 0
    if (factura == 'Con factura') {
      igvfinal = Number(nuevoPrecio) * 0.18
    } else {
      igvfinal = 0
    }
    preciofinal = Number(nuevoPrecio) + igvfinal
    preciofinal = Number(preciofinal.toFixed(2))

    data.append('precio', Number(nuevoPrecio).toFixed(2))
    data.append('montoCobrado', Number(montoPrecio).toFixed(2))
    data.append('correlativo', orden.correlativo)
    data.append('dni', updatedEvents.celular)
    data.append('nombre_plan', updatedEvents.tiposervicio)
    data.append(
      'title',
      `${updatedEvents.nombres.toUpperCase()} ${updatedEvents.apellidos.toUpperCase()}`
    )
    data.append('fecha_inicio', fecha)
    if (factura == 'Sin factura') {
      data.append(
        'estado',
        `${banco ? `${banco}` : ''}/sf/${
          Number(montoPrecio) >= Number(preciofinal) ? 'ok' : 'sp'
        }`.toLocaleUpperCase()
      )
    } else if (factura == 'Con factura') {
      data.append(
        'estado',
        `${banco ? `${banco}` : ''}/cf/${
          Number(montoPrecio) >= Number(preciofinal) ? 'ok' : 'sp'
        }`.toLocaleUpperCase()
      )
    }
    data.append('factura', factura)
    data.append('adicionales', '')
    if (Number(preciofinal) - Number(montoPrecio) > 0) {
      data.append(
        'pendiente',
        (Number(preciofinal) - Number(montoPrecio)).toFixed(2)
      )
      // ts-ignore
      data.append(
        'pendiente_letras',
        `${convertirNumeroALetras(
          Number(preciofinal) - Number(montoPrecio)
        ).toLocaleLowerCase()}`
      )
    } else {
      // @ts-expect-error
      data.append('pendiente', 0)
    }
    data.append('pendiente_antes', '0')
    data.append('pendiente_antes_letras', '')
    data.append(
      'precio_letras',
      `${convertirNumeroALetras(preciofinal).toLowerCase()}`
    )
    data.append(
      'montoCobrado_letra',
      `${convertirNumeroALetras(Number(montoPrecio)).toLowerCase()}`
    )
    data.append('images2', archivosSubido)
    data.append('array_avances', JSON.stringify(avance))
    data.append('_method', 'PUT')

    try {
      const respuesta = await axios.post(
        `${Global.url}/updateHostingRenovación/${id ?? ''}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      await axios.post(`${Global.url}/subirAvanceHosting/${id ?? ''}`, data, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })

      if (respuesta.data.status == 'success') {
        toast.success('Datos actualizados')
        getDataVentas('getDatosHosting', setProductos, setTotalRegistros)
        getDataVentas(
          'getDatosHostingActivos',
          setProductosActivos,
          setTotalRegistrosActivos
        )
        getDataVentas(
          'getDatosHostingInActivos',
          setProductosInActivos,
          setTotalRegistrosInActivos
        )
        setNuevoPrecio('')
        setNuevaFecha(today)
        setMontoprecio('')
        setFactura('')
        setBanco('')
        setAgregarRenovacion({
          estado: false,
          id: null,
          hosting: null,
          orden: null
        })
        setArchivosSubido(null)
      } else {
        toast.error('Error al actualizar')
      }
    } catch (error) {
      console.log(error)
      toast.error('Error al actualizar')
    } finally {
      setLoading(false)
    }
  }

  const agregarFecha = async (
    id: string,
    hosting: any,
    orden: any
  ): Promise<void> => {
    const idUnico = uuidv4()
    if (nuevaFecha && nuevoPrecio) {
      let preciofinal = 0
      let igvfinal = 0
      if (factura == 'Con factura') {
        igvfinal = Number(nuevoPrecio) * 0.18
      } else {
        igvfinal = 0
      }
      preciofinal = Number(nuevoPrecio) + igvfinal
      preciofinal = Number(preciofinal.toFixed(2))
      let pendiente = 0
      if (Number(preciofinal) - Number(montoPrecio) > 0) {
        pendiente = Number(
          (Number(preciofinal) - Number(montoPrecio)).toFixed(2)
        )
      }
      // Actualizar el estado localmente
      const updatedHosting = { ...hosting }
      updatedHosting.fechas = hosting.fechas
        ? [
            ...hosting.fechas,
            {
              fecha: nuevaFecha,
              precio: nuevoPrecio,
              pendiente,
              archivo_factura:
                archivosSubido && archivosSubido.name
                  ? `${idUnico}_${archivosSubido.name}`
                  : '',
              comprobante: `${idUnico}_COMPROBANTE DE PAGO - ${hosting?.nombres} ${hosting?.apellidos}`,
              banco,
              factura,
              montoPrecio
            }
          ]
        : [
            {
              fecha: nuevaFecha,
              precio: nuevoPrecio,
              pendiente,
              archivo_factura:
                archivosSubido && archivosSubido.name
                  ? `${idUnico}_${archivosSubido.name}`
                  : '',
              comprobante: `${idUnico}_COMPROBANTE DE PAGO - ${hosting?.nombres} ${hosting?.apellidos}`,
              banco,
              factura,
              montoPrecio
            }
          ]
      updateHosting(updatedHosting, id, orden, nuevoPrecio, idUnico)
    } else {
      toast.error('Error al agregar fecha o precio')
    }
  }

  const ultimaFecha = (fechas: any): boolean => {
    let ultimaFecha = null
    // Sort the dates in ascending order by year
    if (fechas && fechas.length > 0) {
      fechas.sort((a: any, b: any) => {
        return new Date(a.fecha).getFullYear() - new Date(b.fecha).getFullYear()
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

  const DeleteItemsNew = ({ ruta, id, token }: any): void => {
    Swal.fire({
      title: `¿Estas seguro de eliminar al registro N° ${id ?? ''}?`,
      showDenyButton: true,
      confirmButtonText: 'Eliminar',
      denyButtonText: 'Cancelar'
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        try {
          const resultado = await axios.delete(
            `${Global.url}/${ruta}/${id ?? ''}`,
            {
              headers: {
                Authorization: `Bearer ${
                  token !== null && token !== '' ? token : ''
                }`
              }
            }
          )

          if (resultado.data.status == 'success') {
            Swal.fire('Registro eliminado correctamente', '', 'success')
            getDataVentas('getDatosHosting', setProductos, setTotalRegistros)
          } else {
            Swal.fire('Error al eliminar el registro', '', 'error')
          }
        } catch (error) {
          Swal.fire('Error al eliminar el registro', '', 'error')
          console.log(error)
        }
      }
    })
  }

  const preguntar = (id: number | null): void => {
    DeleteItemsNew({
      ruta: 'deleteHosting',
      id,
      token
    })
  }

  return (
    <>
      <section className="px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2 pb-2">
          <h1 className="font-bold text-lg lg:text-3xl text-black">Hosting</h1>
          <div className="flex gap-3 w-full lg:w-fit justify-between lg:justify-start">
            <Link
              to="reporte"
              className="bg-main hover:bg-main_dark transition-colors text-sm lg:text-base h-fit py-1 text-white px-2 rounded-xl flex gap-2 items-center"
            >
              Reporte
            </Link>
            <Link
              to="registro"
              className="bg-secundario line-clamp-1 hover:bg-secundario_dark transition-colors text-sm lg:text-base h-fit py-1 text-white px-2 rounded-xl "
            >
              Crear Hosting
            </Link>

            <div
              className="flex lg:hidden gap-2 z-20 cursor-pointer text-black items-center h-full lg:h-9 bg-white border border-secundario rounded-xl px-4 py-1"
              onClick={() => {
                setOpenEstado(!openEstado)
              }}
            >
              <MdLabelOutline className="text-xl font-semibold text-secundario" />
              <span className="font-semibold text-sm lg:text-base ">
                Filtros
              </span>
              <FaAngleDown
                className={cn(
                  'text-xs mt-1 ml-2 text-secundario transition-all',
                  openEstado ? 'rotate-90' : ''
                )}
              />
            </div>
          </div>
        </div>
        <div className="flex mt-2 lg:mt-4 flex-col lg:flex-row items-center justify-between gap-y-4 mb-0 lg:mb-5 gap-2">
          <div className="w-full flex flex-col justify-between lg:flex-row gap-2 items-center h-fit">
            <button className="bg-white hover:bg-gray-100 w-full lg:w-[400px] flex items-center text-black gap-2 py-1 lg:py-2 px-4 rounded-lg hover:text-main transition-colors">
              <IoIosSearch className="text-xl" />
              <input
                placeholder="Buscar ..."
                className="bg-transparent outline-none"
                value={search}
                onChange={onSeachChange}
                type="search"
              />
            </button>
            <div className="flex gap-3 overflow-hidden">
              <div className="flex gap-3items-center">
                {selectPrecio && (
                  <Chip
                    label={selectPrecio}
                    onClick={() => {
                      setSelectPrecio(null)
                    }}
                    onDelete={() => {
                      setSelectPrecio(null)
                    }}
                  />
                )}
                {selectAntiguo && (
                  <Chip
                    label={selectAntiguo}
                    onClick={() => {
                      setSelectAntiguo(null)
                    }}
                    onDelete={() => {
                      setSelectAntiguo(null)
                    }}
                  />
                )}
                <div className="flex gap-3 items-center">
                  <button
                    onClick={() => setEstado(estado == 1 ? 0 : 1)}
                    className={cn(
                      'px-4 py-2 text-center text-white rounded-full',
                      estado == 1 ? 'bg-green-600' : 'bg-gray-600'
                    )}
                  >
                    Activos
                  </button>
                  <div
                    className="hidden lg:flex gap-2 z-20 cursor-pointer text-black items-center h-full lg:h-9 bg-white border border-secundario rounded-xl px-4 py-1"
                    onClick={() => {
                      setOpenEstado(!openEstado)
                    }}
                  >
                    <MdLabelOutline className="text-xl font-semibold text-secundario" />
                    <span className="font-semibold text-sm lg:text-base ">
                      Filtros
                    </span>
                    <FaAngleDown
                      className={cn(
                        'text-xs mt-1 ml-2 text-secundario transition-all',
                        openEstado ? 'rotate-90' : ''
                      )}
                    />
                  </div>
                </div>
              </div>

              <FiltorsHosting
                open={openEstado}
                setOpen={setOpenEstado}
                filters={filters}
                toggleFilter={toggleFilter}
                selectedDate={selectedDate}
                setSelectedDate={setSelectedDate}
                selectPrecio={selectPrecio}
                setSelectPrecio={setSelectPrecio}
                selectAntiguo={selectAntiguo}
                setSelectAntiguo={setSelectAntiguo}
              />
            </div>
          </div>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <div className="lg:bg-[#fff] lg:px-4 lg:py-4 lg:pt-2 rounded-xl">
            <div className="border-b w-full h-fit flex ">
              <Swiper
                breakpoints={{
                  0: {
                    slidesPerView: 4
                  },
                  576: {
                    slidesPerView: 6
                  },
                  768: {
                    slidesPerView: 8
                  },
                  992: {
                    slidesPerView: 9
                  },
                  1200: {
                    slidesPerView: 12
                  }
                }}
                pagination={{
                  dynamicBullets: true
                }}
                modules={[Pagination]}
                className="w-full"
              >
                {monthNames.map((a, index: number) => (
                  <SwiperSlide key={index} className="overflow-hidden">
                    <span
                      className={cn(
                        ' w-full font-bold px-4 py-2 block cursor-pointer text-center',
                        selectedDate?.getMonth() == index
                          ? 'text-secundario border-b-2 border-secundario '
                          : 'text-gray-500 border-b'
                      )}
                      onClick={() => {
                        const currentYear = new Date().getFullYear() // Obtiene el año actual
                        const selectedMonth = new Date(currentYear, index, 1) // Crea la fecha con el año actual y el índice del mes
                        setSelectedDate(selectedMonth)
                        //   setSelectedDate(selectedMonth)
                      }}
                    >
                      {a}
                    </span>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
            <div
              className={
                'hidden lg:grid pr-10 lg:pr-4 items-center grid-cols-19 gap-4 mb-2 lg:px-4 lg:py-2 text-gray-800 rounded-xl mt-3 bg-gray-100'
              }
            >
              <h5 className="lg:text-left line-clamp-1 col-span-1"></h5>
              <h5 className="lg:text-left line-clamp-1 col-span-1">ID</h5>
              <h5 className="lg:text-left line-clamp-1 col-span-2 ">Cliente</h5>
              <h5 className="lg:text-left col-span-2">Dominio</h5>
              <h5 className="lg:text-center col-span-2">Estado</h5>
              <h5 className="lg:text-center line-clamp-1 col-span-2">
                Servicio
              </h5>
              <h5 className="lg:text-center col-span-2 line-clamp-1">
                Plan contratado
              </h5>
              <h5 className="lg:text-center col-span-2 line-clamp-1">
                Fecha de Inicio
              </h5>
              <h5 className="lg:text-center ">M.Cobrar</h5>
              <h5 className="lg:text-center ">M.Pagar</h5>
              <h5 className="lg:text-center ">Ganancia</h5>
              <h5 className="lg:text-center ">Renovación</h5>
              <h5 className="lg:text-center"></h5>
            </div>
            {filterDate().map((orden: any, index: number) => {
              const hosting = JSON.parse(orden.hosting)
                ? JSON.parse(orden.hosting)
                : []
              if (orden.activehosting == '1') {
                if (hosting?.montoC) {
                  totalCobrar += Number(hosting.montoC)
                }
                if (hosting?.montoP) {
                  totalPagar += Number(hosting.montoP)
                }
              }
              return (
                <>
                  <div
                    // to={`view-servicio/${orden.id}`}
                    className="flex flex-col gap-3 lg:hidden bg-form p-4 rounded-xl"
                  >
                    <div className="flex justify-between">
                      <div className="flex lg:hidden gap-4 items-center">
                        {orden.activehosting == '0' ? (
                          <span className="flex items-center justify-center bg-red-400 text-red-600  w-8 h-8 rounded-full">
                            I
                          </span>
                        ) : (
                          <span className="flex items-center justify-center bg-[#b3dba1] text-green-700 w-8 h-8 rounded-full">
                            A
                          </span>
                        )}
                        <span className="flex lg:justify-left items-center gap-3 font-bold text-black">
                          {orden.correlativo
                            ? limpiarCadena(orden.correlativo)
                            : ''}
                        </span>
                      </div>
                      <div className="lg:text-right pr-0">
                        <h5 className="lg:hidden text-gray-500 text-right font-bold mb-0 text-sm">
                          Fecha de inicio
                        </h5>
                        <span className="text-right block text-gray-500">
                          {format(
                            addHours(new Date(hosting.inicio), +5),
                            'dd/MM/yyyy'
                          )}
                        </span>
                      </div>
                    </div>
                    <div className="lg:hidden flex justify-between gap-3">
                      <div className="lg:text-center ">
                        <h5 className="lg:hidden text-black font-bold mb-0 text-sm">
                          Dominio
                        </h5>
                        {hosting?.dominio ? (
                          <Link
                            to={`https://${hosting?.dominio}`}
                            target="_blank"
                            className="text-left lowercase text-blue-500 hover:underline font-semibold line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10"
                          >
                            {hosting?.dominio}
                          </Link>
                        ) : (
                          <span className="text-left text-gray-500 font-semibold line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                            {'No registrado'}
                          </span>
                        )}
                      </div>
                      <div className="lg:text-right ">
                        <h5 className="lg:hidden text-black font-bold mb-0 text-sm bg text-right">
                          Renovación
                        </h5>
                        <span
                          className={cn(
                            'text-white text-center block rounded-md',
                            ultimaFecha(hosting?.fechas)
                              ? 'bg-green-500'
                              : 'bg-red-400'
                          )}
                        >
                          {ultimaFecha(hosting?.fechas) ? 'Si' : 'NO'}
                        </span>
                      </div>
                    </div>
                    <div className="lg:hidden flex items-center justify-between gap-3">
                      <div className="lg:text-center ">
                        <h5 className="lg:hidden text-black font-bold mb-0 text-sm">
                          Cliente
                        </h5>
                        <span className="text-left text-gray-500 font-semibold line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                          {orden.nombres ?? hosting.nombres}{' '}
                          {orden.apellidos ?? hosting.apellidos}
                        </span>
                      </div>
                      <div className="block lg:text-center">
                        <Menu
                          menuButton={
                            <MenuButton className="">
                              <RiSettings3Fill className="text-gray-500 text-lg" />
                            </MenuButton>
                          }
                          align="end"
                          arrow
                          transition
                          menuClassName="bg-secondary-100 p-4"
                        >
                          <MenuItem className="p-0 hover:bg-transparent">
                            {orden.id != null && (
                              <button
                                onClick={() => {
                                  setAgregarRenovacion({
                                    estado: true,
                                    id: orden.id,
                                    hosting,
                                    orden
                                  })
                                  setNuevoPrecio(hosting?.montoC)
                                }}
                                className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                              >
                                Renovación
                              </button>
                            )}
                          </MenuItem>
                          <MenuItem className="p-0 hover:bg-transparent">
                            {orden.id != null && (
                              <Link
                                to={`/admin/hosting/avances/${orden.id}`}
                                className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                              >
                                Seguimiento
                              </Link>
                            )}
                          </MenuItem>
                          {orden.id_cliente && (
                            <>
                              <MenuItem className="p-0 hover:bg-transparent">
                                {orden.id != null && (
                                  <Link
                                    to={`/admin/lista-clientes/ver/${orden.id_cliente}`}
                                    className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                                  >
                                    Ver
                                  </Link>
                                )}
                              </MenuItem>
                              <MenuItem className="p-0 hover:bg-transparent">
                                {orden.id != null && (
                                  <Link
                                    to={`/admin/lista-clientes/editar/${orden.id_cliente}`}
                                    className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                                  >
                                    Editar
                                  </Link>
                                )}
                              </MenuItem>
                              <MenuItem className="p-0 hover:bg-transparent">
                                {orden.id != null && (
                                  <Link
                                    to={`/admin/seguimiento/${orden.id_cliente}`}
                                    className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                                  >
                                    Reporte
                                  </Link>
                                )}
                              </MenuItem>
                              <MenuItem className="p-0 hover:bg-transparent">
                                {orden.id != null && (
                                  <Link
                                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/ban-ts-comment
                                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                    to={`/admin/lista-clientes/editar/${orden.id_cliente}`}
                                    className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                                  >
                                    Datos de cliente
                                  </Link>
                                )}
                              </MenuItem>
                            </>
                          )}
                        </Menu>
                      </div>
                    </div>
                    <div className="lg:hidden flex justify-between gap-3">
                      <div className="lg:text-center ">
                        <h5 className="lg:hidden text-black font-bold mb-0 text-sm">
                          Servicio
                        </h5>
                        <span className="text-left text-gray-500 font-semibold line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                          {hosting?.tiposervicio}
                        </span>
                      </div>
                      <div className="lg:text-right ">
                        <h5 className="lg:hidden text-black font-bold mb-0 text-sm bg text-right">
                          Monto a C.
                        </h5>
                        <span className="text-center text-red-500 font-bold line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                          S/.{hosting?.montoC}
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* PC */}
                  <div
                    className={`grid grid-cols-19 transition-all lg:pr-4 relative gap-3 items-center mb-3 lg:mb-0 ${
                      index % 2 == 0 ? 'bg-transparent' : 'bg-transparent'
                    } lg:px-4 lg:py-3 rounded-xl relative shadow_class`}
                    key={orden.id}
                  >
                    <div className="hidden lg:block lg:text-center col-span-1">
                      <span className="text-center block text-black w-full line-clamp-1 cursor-pointer">
                        <FaAngleDown
                          className="text-gray-600 mx-auto"
                          onClick={() => {
                            if (orden.id == openList.id) {
                              setOpenList({
                                id: orden.id,
                                estado: !openList.estado
                              })
                            } else {
                              setOpenList({
                                id: orden.id,
                                estado: true
                              })
                            }
                          }}
                        />
                      </span>
                    </div>
                    <div className="hidden lg:block lg:text-center col-span-1">
                      <span className="text-left block text-black w-full line-clamp-1">
                        {orden.correlativo
                          ? limpiarCadena(orden.correlativo)
                          : ''}
                      </span>
                    </div>
                    <div className="hidden lg:block lg:text-center col-span-2 relative h-6">
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
                                  className="text-left text-black font-semibold line-clamp-1  transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10"
                                >
                                  {contacto.nombres}
                                </span>
                              ))}
                        </>
                      ) : (
                        <span className="text-left text-black font-semibold line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                          {orden.nombres ?? hosting.nombres}{' '}
                          {orden.apellidos ?? hosting.apellidos}
                        </span>
                      )}
                    </div>
                    <div className="hidden lg:block lg:text-center col-span-2 relative h-full">
                      {hosting?.dominio ? (
                        <Link
                          to={`https://${hosting?.dominio}`}
                          target="_blank"
                          className="text-left lowercase text-blue-500 hover:underline font-semibold line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10"
                        >
                          {hosting?.dominio}
                        </Link>
                      ) : (
                        <span className="text-left text-gray-500 font-semibold line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                          {'No registrado'}
                        </span>
                      )}
                    </div>
                    <div
                      className={`hidden w-20 rounded-xl mx-auto lg:flex gap-2 lg:px-2 items-center justify-center col-span-2 lg:text-center ${
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
                    <div className="hidden lg:block lg:text-center col-span-2 line-clamp-1 relative h-full">
                      <span className="text-left text-black  transition-all line-clamp-1  w-full h-full z-10 ">
                        {hosting?.tiposervicio}
                      </span>
                    </div>
                    <div className="hidden lg:block lg:text-center col-span-2">
                      <span className="text-left  text-black line-clamp-1">
                        {hosting?.tiposervicio == 'Hosting' ||
                        hosting?.tiposervicio == 'Hosting + Dominio'
                          ? hosting?.plan
                          : 'No registrado'}
                      </span>
                    </div>
                    <div className="hidden lg:block lg:text-center col-span-2">
                      <span className="text-cener block text-black">
                        {/* {hosting.inicio} */}
                        {format(
                          addHours(new Date(hosting.inicio), +5),
                          'dd/MM/yyyy'
                        )}
                      </span>
                    </div>
                    <div className="hidden lg:block lg:text-center ">
                      {hosting?.montoC ? (
                        <span className="text-cener block text-black ">
                          S/ {hosting?.montoC}
                        </span>
                      ) : (
                        <span className="text-cener block text-black">
                          No registrado
                        </span>
                      )}
                    </div>
                    <div className="hidden lg:block lg:text-center ">
                      {hosting?.montoP ? (
                        <span className="text-cener block text-black ">
                          S/ {hosting?.montoP}
                        </span>
                      ) : (
                        <span className="text-cener block text-black">
                          No registrado
                        </span>
                      )}
                    </div>
                    <div className="hidden lg:block lg:text-center ">
                      {hosting?.montoC && hosting?.montoP ? (
                        <span className="text-cener block text-black font-bold">
                          S/ {hosting?.montoC - hosting?.montoP}
                        </span>
                      ) : (
                        <span className="text-cener block text-black">
                          No registrado
                        </span>
                      )}
                    </div>
                    <div className="hidden lg:block lg:text-center ">
                      <span
                        className={cn(
                          'text-white block rounded-md',
                          ultimaFecha(hosting?.fechas)
                            ? 'bg-green-400'
                            : 'bg-red-400'
                        )}
                      >
                        {ultimaFecha(hosting?.fechas) ? 'Si' : 'NO'}
                      </span>
                    </div>
                    <div className="hidden lg:block lg:text-center">
                      <Menu
                        menuButton={
                          <MenuButton className="">
                            <RiSettings3Fill className="text-gray-500 text-lg" />
                          </MenuButton>
                        }
                        align="end"
                        arrow
                        transition
                        menuClassName="bg-secondary-100 p-4"
                      >
                        <MenuItem className="p-0 hover:bg-transparent">
                          {orden.id != null && (
                            <button
                              onClick={() => {
                                setAgregarRenovacion({
                                  estado: true,
                                  id: orden.id,
                                  hosting,
                                  orden
                                })
                                setNuevoPrecio(hosting?.montoC)
                              }}
                              className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                            >
                              Renovación
                            </button>
                          )}
                        </MenuItem>
                        <MenuItem className="p-0 hover:bg-transparent">
                          {orden.id != null && (
                            <Link
                              to={`/admin/hosting/avances/${orden.id}`}
                              className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                            >
                              Seguimiento
                            </Link>
                          )}
                        </MenuItem>
                        {orden.id_cliente && (
                          <>
                            <MenuItem className="p-0 hover:bg-transparent">
                              {orden.id != null && (
                                <Link
                                  to={`/admin/lista-clientes/ver/${orden.id_cliente}`}
                                  className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                                >
                                  Ver
                                </Link>
                              )}
                            </MenuItem>
                            <MenuItem className="p-0 hover:bg-transparent">
                              {orden.id != null && (
                                <Link
                                  to={`/admin/lista-clientes/editar/${orden.id_cliente}`}
                                  className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                                >
                                  Editar
                                </Link>
                              )}
                            </MenuItem>
                            <MenuItem className="p-0 hover:bg-transparent">
                              {orden.id != null && (
                                <Link
                                  to={`/admin/seguimiento/${orden.id_cliente}`}
                                  className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                                >
                                  Reporte
                                </Link>
                              )}
                            </MenuItem>
                            <MenuItem className="p-0 hover:bg-transparent">
                              {orden.id != null && (
                                <Link
                                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/ban-ts-comment
                                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                  to={`/admin/lista-clientes/editar/${orden.id_cliente}`}
                                  className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                                >
                                  Datos de cliente
                                </Link>
                              )}
                            </MenuItem>
                          </>
                        )}
                        <MenuItem className="p-0 hover:bg-transparent">
                          {orden.id != null && (
                            <button
                              onClick={() => {
                                preguntar(orden.id)
                              }}
                              className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                            >
                              Eliminar
                            </button>
                          )}
                        </MenuItem>
                      </Menu>
                    </div>
                  </div>
                  <AnimatePresence>
                    {openList.estado && openList.id == orden.id && (
                      <motion.div
                        initial={{
                          translateY: '-100%',
                          opacity: 0
                        }}
                        animate={{
                          translateY: '0%',
                          opacity: 100
                        }}
                        exit={{ translateY: '-50%', opacity: 0 }}
                        className="w-full"
                      >
                        <div
                          className={
                            'hidden lg:grid font-medium items-center grid-cols-19 mb-2  text-gray-800 mt-3'
                          }
                        >
                          <h5 className="lg:text-left line-clamp-1 col-span-1"></h5>
                          <h5 className="lg:text-left line-clamp-1 col-span-2  border-b border-gray-300 lg:py-2 px-2">
                            P. Hosting
                          </h5>
                          <h5 className="lg:text-left line-clamp-1 col-span-2 border-b border-gray-300 lg:py-2 px-2 ">
                            P. Dominio
                          </h5>
                          <h5 className="lg:text-left col-span-2 border-b border-gray-300 lg:py-2 px-2">
                            Usuario
                          </h5>
                          <h5 className="lg:text-left col-span-2 border-b border-gray-300 lg:py-2 px-2">
                            Contraseña
                          </h5>
                          <h5 className="lg:text-left col-span-2 border-b border-gray-300 lg:py-2 px-2">
                            Marca
                          </h5>
                          <h5 className="lg:text-left col-span-2 border-b border-gray-300 lg:py-2 px-2">
                            Celular
                          </h5>
                          <h5 className="lg:text-left col-span-2 border-b border-gray-300 lg:py-2 px-2">
                            Correo
                          </h5>
                          <h5 className="lg:text-left line-clamp-1 col-span-2 border-b border-gray-300 lg:py-2 px-2">
                            Estado Proyecto
                          </h5>
                          <h5 className="lg:text-left col-span-2"></h5>
                        </div>
                        <div
                          className={`grid grid-cols-19 lg:pr-4 relative gap-3 items-center mb-3 lg:mb-0 ${
                            index % 2 == 0 ? 'bg-transparent' : 'bg-transparent'
                          } lg:px-4 lg:pb-4 lg:pt-1 rounded-xl relative shadow_class`}
                          key={orden.id}
                        >
                          <div className="hidden lg:block lg:text-center col-span-1"></div>
                          <div className="hidden lg:block lg:text-center col-span-2">
                            <span className="text-left block text-black w-full line-clamp-1">
                              {hosting?.tiposervicio == 'Hosting' ||
                              hosting?.tiposervicio == 'Hosting + Dominio'
                                ? hosting?.phosting
                                : 'No registrado'}
                            </span>
                          </div>
                          <div className="hidden lg:block lg:text-center col-span-2">
                            <span className="text-left block text-black w-full line-clamp-1">
                              {hosting?.tiposervicio == 'Dominio' ||
                              hosting?.tiposervicio == 'Hosting + Dominio'
                                ? hosting?.pdominio
                                : 'No registrado'}
                            </span>
                          </div>
                          <div className="hidden lg:block lg:text-center col-span-2">
                            <span className="text-left block text-black w-full line-clamp-1">
                              {hosting?.usuario
                                ? hosting?.usuario
                                : 'No registrado'}
                            </span>
                          </div>
                          <div className="hidden lg:block lg:text-center col-span-2">
                            <span className="text-left block text-black w-full line-clamp-1">
                              {hosting?.password
                                ? hosting?.password
                                : 'No registrado'}
                            </span>
                          </div>
                          <div className="hidden lg:block lg:text-center col-span-2">
                            <span className="text-left  text-black w-full line-clamp-1">
                              {orden?.nombre_marca
                                ? orden?.nombre_marca
                                : hosting?.marca ? hosting?.marca : 'No registrado'}
                            </span>
                          </div>
                          <div className="hidden lg:block lg:text-center col-span-2">
                            <span className="text-left block text-black w-full line-clamp-1">
                              {orden?.celular ?? hosting?.celular ?? ''}
                            </span>
                          </div>
                          <div className="hidden lg:block lg:text-center col-span-2">
                            <span className="text-left block text-black w-full line-clamp-1">
                              {orden?.email ?? hosting.email ?? ''}
                            </span>
                          </div>
                          <div className="hidden lg:block lg:text-center col-span-2">
                            {orden.estado == '1' ? (
                              <>
                                {/* <BsCheckCircle className="hidden lg:block" /> */}
                                <span className="text-center bg-red-600 text-white font-bold w-fit px-4 mx-auto rounded-md line-clamp-1">
                                  Abandono
                                </span>
                              </>
                            ) : orden.fecha_fin != null ? (
                              <>
                                {/* <BsCheckCircle className="hidden lg:block" /> */}
                                <span className="text-center bg-[#1A5515] text-white font-bold w-fit px-4 mx-auto rounded-md line-clamp-1">
                                  Finalizado
                                </span>
                              </>
                            ) : !orden.fecha_inicio && !orden.fecha_alta ? (
                              <>
                                {/* <BsGraphUp className="hidden lg:block" /> */}
                                <span className="text-center gap-2 font-bold px-2 line-clamp-1 text-gray-500">
                                  Sin proyecto
                                </span>
                              </>
                            ) : (
                              <>
                                {/* <BsGraphUp className="hidden lg:block" /> */}
                                <span className="text-center gap-2 font-bold w-fit px-4 mx-auto rounded-md line-clamp-1">
                                  En proceso
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )
            })}
            <div className="grid border-t border-gray-300 items-center grid-cols-19 gap-6 lg:gap-0  content_buttons pt-2 mt-3">
              <span className="col-span-12 text-black text-center">
                Pago general del mes de{' '}
                {selectedDate && getMonthName(selectedDate).toUpperCase()}{' '}
              </span>
              <span className="col-span-2"></span>
              <div className="hidden lg:block lg:text-center ">
                <span className="text-cener block text-black font-bold">
                  S/ {totalCobrar}
                </span>
              </div>
              <div className="hidden lg:block lg:text-center ">
                <span className="text-cener block text-black font-bold">
                  S/ {totalPagar}
                </span>
              </div>
              <div className="hidden lg:block lg:text-center ">
                <span className="text-cener block text-red-700 font-bold">
                  S/ {totalCobrar - totalPagar}
                </span>
              </div>
            </div>
            <div className="grid border-t border-gray-300  items-center grid-cols-3 gap-6 lg:gap-0  content_buttons pt-2 mt-3">
              <p className="text-md ml-1 w-fit text-black font-bold bg-yellow-400">
                {totalPosts} Registros
              </p>
            </div>
          </div>
        )}
      </section>
      <ModalRenovacion
        loading={loading}
        montoPrecio={montoPrecio}
        setMontoprecio={setMontoprecio}
        factura={factura}
        banco={banco}
        setBanco={setBanco}
        setFactura={setFactura}
        open={agregarRenovacion}
        setOpen={setAgregarRenovacion}
        archivosSubido={archivosSubido}
        setArchivosSubido={setArchivosSubido}
        nuevaFecha={nuevaFecha}
        setNuevaFecha={setNuevaFecha}
        nuevoPrecio={nuevoPrecio}
        setNuevoPrecio={setNuevoPrecio}
        agregarFecha={agregarFecha}
      />
    </>
  )
}
