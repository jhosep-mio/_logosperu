/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-unmodified-loop-condition */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable multiline-ternary */
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import { RiBarChartFill, RiFilter2Fill, RiSettings3Fill } from 'react-icons/ri'
import { Loading } from '../../../shared/Loading'
import {
  type arrayContacto,
  type ValuesPlanes,
  type ValuesVenta
} from '../../../shared/schemas/Interfaces'
import { Paginacion } from '../../../shared/Paginacion'
import { getDataToPlanes, getDataVentas } from '../../../shared/FetchingData'
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import Swal from 'sweetalert2'
import {
  limpiarCadena,
  quitarAcentos
} from '../../../shared/functions/QuitarAcerntos'
import { MdLabelOutline } from 'react-icons/md'
import { AnimatePresence, motion } from 'framer-motion'
import { FaAngleDown } from 'react-icons/fa6'
import { cn } from '../../../shared/cn'
import SelectFilterAllColaborador from '../ventas/filtros/SelectFilterAllColaborador'
import { GenerarAlta } from '../ventas/alta/GenerarAlta'
import { ModalRenovacion } from './ModalRenovacion'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'
import { addDays, differenceInDays, format, isAfter, isBefore, isEqual, startOfDay } from 'date-fns'
import { convertirNumeroALetras } from '../../../shared/functions/GenerarTextoEnLetras'

interface Filters {
  estado?: number | null
  enCola?: boolean | null
  fechaFin?: boolean | null
  activeFilter: null | string
  sinFechaFinYNo1: boolean | null
  deshabilitado: boolean | null
}

export const ListaCommunity = (): JSX.Element => {
  const [agregarRenovacion, setAgregarRenovacion] = useState<any>({
    estado: false,
    id: null,
    hosting: null,
    orden: null
  })
  const { setTitle } = useAuth()
  const token = localStorage.getItem('token')
  const [productos, setProductos] = useState<ValuesVenta[]>([])
  const [proyecto, setProyecto] = useState<ValuesVenta | null>(null)
  const [OpenAlta, setOpenAlta] = useState(false)
  const [openEstado, setOpenEstado] = useState(false)
  const [loading, setLoading] = useState(true)
  const [, setTotalRegistros] = useState(0)
  const [paginaActual, setpaginaActual] = useState<number>(1)
  const [search, setSearch] = useState('')
  const [cantidadRegistros] = useState(100)
  const navigate = useNavigate()
  const [colaboradores, setColaboradores] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [filters, setFilters] = useState<Filters>({
    estado: null,
    fechaFin: null,
    enCola: null,
    activeFilter: 'sinFechaFinYNo1',
    sinFechaFinYNo1: true,
    deshabilitado: null
  })
  const [area] = useState('community')
  const [selectColaborador, setSelectColaborador] = useState('Todos')
  const [planes, setplanes] = useState<ValuesPlanes[]>([])
  const { auth } = useAuth()

  // FUNCIONES
  const getColaboradores = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getUsuariosToMatrix`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setColaboradores(request.data)
  }

  const getUsuarios = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getUsuarios`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setUsuarios(request.data)
  }

  useEffect(() => {
    setTitle('Listado de Community Manager')
    Promise.all([
      getColaboradores(),
      getUsuarios(),
      getDataToPlanes('getPlanes', setplanes, setTotalRegistros),
      getDataVentas('indexCapaCommunity', setProductos, setTotalRegistros)
    ]).then(() => {
      setLoading(false)
    })
  }, [])

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

    if (selectColaborador !== 'Todos') {
      filteredProductos = filteredProductos.filter(
        (registro: any) =>
          registro?.asignacion &&
          JSON.parse(registro?.asignacion).some(
            (user: any) => user.peso == selectColaborador
          )
      )
    }

    const searchTerm = quitarAcentos(search)
    // ... puedes agregar otras condiciones de filtro aquí
    if (search.length > 0) {
      filteredProductos = filteredProductos.filter((pro) => {
        const fullName = `${pro.nombres} ${pro.apellidos}`.toLowerCase()
        const empresa = `${pro.nombre_marca}`.toLowerCase()
        return (
          quitarAcentos(pro.nombre_empresa).includes(searchTerm) ||
          quitarAcentos(empresa).includes(searchTerm) ||
          quitarAcentos(fullName).includes(searchTerm) ||
          String(pro.id).includes(searchTerm) ||
          String(pro.id_contrato).includes(searchTerm)
        )
      })
    }

    totalPosts = filteredProductos.length
    return filteredProductos.slice(indexOfFirstPost, indexOfLastPost)
  }

  const onSeachChange = ({
    target
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setpaginaActual(1)
    setSearch(target.value)
  }

  const preguntar = (orden: any): void => {
    Swal.fire({
      title: `¿Estas seguro de cambiar el estado a la venta N° ${orden.id}?`,
      showDenyButton: true,
      confirmButtonText: 'Cambiar',
      denyButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        cambiarEstado(orden)
      }
    })
  }

  const preguntarPreventa = (id: number): void => {
    Swal.fire({
      title: `¿Estas seguro de mover la venta N° ${id} a preventa?`,
      showDenyButton: true,
      confirmButtonText: 'Mover',
      denyButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        moverPreventa(id)
      }
    })
  }

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

  const cambiarEstado = async (orden: any): Promise<void> => {
    try {
      const request = await axios.get(
        `${Global.url}/manejarEstado/${orden.id ?? ''}`,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      if (orden.estado == 0) {
        const data = new FormData()
        const { fecha, hora } = obtenerFechaHora()
        data.append(
          'titulo',
          `CONCLUIDO POR ABANDONO - ${orden.nombre_marca ?? ''}`
        )
        data.append('nombres', `${orden.nombres} ${orden.apellidos}`)
        data.append(
          'contexto',
          `<p>Por el presente debemos informarle sobre el aviso notificación enviado y recibido.</p><p>El cual el área Administrativa Remite hacia su persona.</p><p><br></p><p>En el presente</p><p>Según lo acordado con Área Diseño, Área Desarrollo, Área administrativa y Gerencia llegado a la fecha límite:</p><p><br></p><p>SE DARA POR CONCLUIDO EL PROYECTO <span style="background-color: yellow;">${orden.nombre_marca}.</span></p>`
        )
        data.append('email', auth.email)
        data.append('email_alter', auth.email_alter)
        data.append(
          'correos',
          JSON.stringify([{ id: '123123123', correo: orden?.email }])
        )
        data.append('password', auth.pass_email)
        data.append('firma', auth.firma)
        const avance = {
          fecha,
          hora,
          asunto: `CONCLUIDO POR ABANDONO - ${orden.nombre_marca ?? ''}`,
          imagenes: [],
          archivos: [],
          correos: [{ id: '123123123', correo: orden?.email }],
          contexto: `<p>Por el presente debemos informarle sobre el aviso notificación enviado y recibido.</p><p>El cual el área Administrativa Remite hacia su persona.</p><p><br></p><p>En el presente</p><p>Según lo acordado con Área Diseño, Área Desarrollo, Área administrativa y Gerencia llegado a la fecha límite:</p><p><br></p><p>SE DARA POR CONCLUIDO EL PROYECTO <span style="background-color: yellow;">${orden.nombre_marca}.</span></p>`,
          firma: auth.firma
        }
        try {
          const respuesta = await axios.post(
            `${Global.url}/enviarAvances`,
            data,
            {
              headers: {
                Authorization: `Bearer ${
                  token !== null && token !== '' ? token : ''
                }`
              }
            }
          )

          if (respuesta.data.status == 'success') {
            data.append('array_avances', JSON.stringify(avance))
            data.append('_method', 'PUT')
            try {
              const respuesta = await axios.post(
                `${Global.url}/subirAvances/${orden.id ?? ''}`,
                data,
                {
                  headers: {
                    Authorization: `Bearer ${
                      token !== null && token !== '' ? token : ''
                    }`
                  }
                }
              )
              if (respuesta.data.status == 'success') {
                getDataVentas('getVentas', setProductos, setTotalRegistros)
                const enviarNotificacion = async (): Promise<void> => {
                  const data = new FormData()
                  data.append('id_usuario', auth.id)
                  data.append('id_venta', String(orden.id))
                  data.append('nombre', auth.name)
                  data.append('icono', 'correo')
                  data.append(
                    'url',
                    `/admin/lista-servicios/avances/${orden.id}`
                  )
                  data.append(
                    'contenido',
                    `Ha marcado como abandono el proyecto ${
                      orden.nombre_marca ?? ''
                    }  (${`${orden.nombres} ${orden.apellidos}`})`
                  )
                  data.append('hidden_users', '')
                  try {
                    await axios.post(`${Global.url}/nuevaNotificacion`, data, {
                      headers: {
                        Authorization: `Bearer ${
                          token !== null && token !== '' ? token : ''
                        }`
                      }
                    })
                  } catch (error: unknown) {
                    console.log(error)
                    Swal.fire('Error al subir', '', 'error')
                  }
                }
                enviarNotificacion()
              } else {
                Swal.fire('Error al registrar', '', 'error')
              }
            } catch (error: unknown) {
              console.log(error)
              Swal.fire('Error', '', 'error')
            }
          } else {
            Swal.fire('Error al registrar', '', 'error')
          }
        } catch (error: unknown) {
          console.log(error)
          Swal.fire('Error', '', 'error')
        }
      }
      if (request.data.status == 'success') {
        Swal.fire('Se cambio el estado', '', 'success')
        setLoading(true)
        Promise.all([
          getDataVentas('getVentas', setProductos, setTotalRegistros)
        ]).then(() => {
          setLoading(false)
        })
      } else {
        Swal.fire('Error', '', 'error')
      }
    } catch (error) {
      console.log(error)
      Swal.fire('Error', '', 'error')
    }
  }

  const moverPreventa = async (id: number): Promise<void> => {
    try {
      const request = await axios.get(`${Global.url}/moverPreventa/${id}`, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })
      if (request.data.status == 'success') {
        Swal.fire('Se movio correctamente', '', 'success')
        setLoading(true)
        navigate('/admin/lista-preventa')
      } else {
        Swal.fire('Error', '', 'error')
      }
    } catch (error) {
      console.log(error)
      Swal.fire('Error', '', 'error')
    }
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

  function obtenerDiasParaPrimerPago (fechaInicial: string): number {
    if (!fechaInicial) {
      // Handle the case where fechaInicial is null or undefined
      return 0 // Or any other appropriate action
    }
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

  const ultimaFecha = (fechas2: any, orden: any): boolean => {
    const fechas = fechas2 ? JSON.parse(fechas2).fechas : []
    // Sort the dates in ascending order by date
    if (fechas && fechas.length > 0) {
      // @ts-expect-error
      fechas.sort((a: any, b: any) => new Date(a.fecha) - new Date(b.fecha))
      // Get the last date and the previous one, if available
      const ultimaFecha = fechas.length > 0 ? fechas[fechas.length - 1].fecha : null
      const penultimaFecha = fechas.length > 1 ? fechas[fechas.length - 2].fecha : null
      // If there's only one date, use orden.fecha_inicio as the reference
      const referenciaFecha = penultimaFecha || orden.fecha_inicio

      if (ultimaFecha && referenciaFecha) {
        const fechaUltima = new Date(ultimaFecha)
        const partesFecha = referenciaFecha.split('/')
        const fechaISO = `${partesFecha[2]}-${partesFecha[1]}-${partesFecha[0]}` // Convertir a formato ISO "yyyy-mm-dd"
        const fechaReferencia = new Date(fechaISO)
        const diferenciaDias = (fechaUltima.getTime() - fechaReferencia.getTime()) / (1000 * 3600 * 24)
        return diferenciaDias <= 30
      }
    }
    return false
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
    // Calcular todas las fechas de pago
    while (fechaActual < hoy) {
      fechaActual.setMonth(fechaActual.getMonth() + 1)
    }
    const diasRestantes = Math.ceil(
      (fechaActual.getTime() - hoy.getTime()) / (1000 * 3600 * 24)
    )
    return diasRestantes
  }

  const today = new Date().toISOString().slice(0, 10) // Obtener la fecha de hoy en formato 'yyyy-mm-dd'
  const [nuevaFecha, setNuevaFecha] = useState<string>(today)
  const [nuevoPrecio, setNuevoPrecio] = useState('')
  const [montoPrecio, setMontoprecio] = useState('')
  const [factura, setFactura] = useState('')
  const [banco, setBanco] = useState('')
  const [archivosSubido, setArchivosSubido] = useState<any | null>(null)

  const updateHosting = async (
    renovacion: any,
    id: string,
    orden: any,
    nuevoPrecio: any,
    idUnico: any,
    plan: any
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
      asunto: `RENOVACIÓN DE ${plan.nombre ?? ''}`,
      empresa: orden?.marca ?? '',
      contacto: `${orden?.nombres} ${orden?.apellidos}`,
      motivo: `RENOVACIÓN DE ${plan.nombre ?? ''}`,
      fechaacta: fechaFormateada,
      imagenes: [],
      archivos: archivosSubido,
      correos: [{ id: Date.now(), correo: orden?.email ?? '' }],
      contexto: `<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\">
      <p>Buenas tardes Estimado(a) ${orden.nombres} ${orden.apellidos},</p>
      <p>Es un placer para nosotros comunicarnos contigo para expresar nuestro sincero agradecimiento por haber renovado tu servicio de Alquiler de hosting con Logos Perú. Valoramos profundamente tu confianza en nuestros servicios y nos comprometemos a seguir brindándote el mejor soporte y calidad en cada aspecto de tu experiencia con nosotros.</p>
      <p>Recuerda que estamos aquí para cualquier consulta, solicitud o soporte técnico que requieras. No dudes en contactarnos ante cualquier inquietud o sugerencia.</p>
      <p>Una vez más, ¡gracias por elegirnos como tu proveedor de servicios de Alquiler de hosting!</p>
      <p>¡Saludos cordiales!</p>
  </div>`,
      conclusion: '',
      firma: 'firma_agencia.jpg'
    }

    data.append('idUnico', idUnico)
    data.append('renovacion', JSON.stringify(renovacion))
    data.append('contrato', orden.id_contrato)
    data.append(
      'nombres',
      `${orden.nombres} ${orden.apellidos}`
    )
    data.append('email', orden.email)
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
    data.append('correlativo', orden.id_contrato)
    data.append('dni', orden?.dni_ruc)
    data.append('nombre_plan', plan.nombre)
    if (orden?.id_contacto && orden?.arraycontacto && JSON.parse(orden?.arraycontacto).length > 0) {
      const contactosArray = JSON.parse(orden?.arraycontacto)
      const contactoSeleccionado = contactosArray.find(
        (contacto: any) => String(contacto.id ?? '') == orden?.id_contacto
      )
      if (contactoSeleccionado) {
        const { nombres, marca } = contactoSeleccionado
        data.append('nombre_contacto', nombres)
        data.append('empresa', marca)
      } else {
        data.append('nombre_contacto', '')
        if (orden?.empresa != `${orden?.nombres} ${orden?.apellidos}`) {
          data.append('empresa', orden?.empresa)
        } else {
          data.append('empresa', '')
        }
      }
    } else {
      data.append('nombre_contacto', '')
      if (orden?.empresa != `${orden?.nombres} ${orden?.apellidos}`) {
        data.append('empresa', orden?.empresa ?? '')
      } else {
        data.append('empresa', '')
      }
    }

    data.append(
      'title',
      `${orden.nombres.toUpperCase()} ${orden.apellidos.toUpperCase()}`
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
    data.append('adicionales', orden?.contrato ? orden?.contrato?.adicionales ?? '' : null)
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
        `${Global.url}/updateCmRenovacion/${id ?? ''}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      //   await axios.post(`${Global.url}/subirAvanceHosting/${id ?? ''}`, data, {
      //     headers: {
      //       Authorization: `Bearer ${
      //         token !== null && token !== '' ? token : ''
      //       }`
      //     }
      //   })

      if (respuesta.data.status == 'success') {
        toast.success('Datos actualizados')
        getDataVentas('getCapas', setProductos, setTotalRegistros)
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
    orden: any,
    plan: any
  ): Promise<void> => {
    const idUnico = uuidv4()
    if (nuevaFecha && nuevoPrecio && factura && montoPrecio && factura && banco) {
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
      const renovacion = orden.renovacion ? JSON.parse(orden.renovacion) : null
      // Actualizar el estado localmente
      const updatedHosting = { ...renovacion }
      updatedHosting.fechas = renovacion?.fechas
        ? [
            ...renovacion.fechas,
            {
              fecha: nuevaFecha,
              precio: nuevoPrecio,
              pendiente,
              archivo_factura: archivosSubido && archivosSubido.name ? `${idUnico}_${archivosSubido.name}` : '',
              comprobante: `${idUnico}_COMPROBANTE DE PAGO - ${orden?.nombres} ${orden?.apellidos}`,
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
              archivo_factura: archivosSubido && archivosSubido.name ? `${idUnico}_${archivosSubido.name}` : '',
              comprobante: `${idUnico}_COMPROBANTE DE PAGO - ${orden?.nombres} ${orden?.apellidos}`,
              banco,
              factura,
              montoPrecio
            }
          ]
      updateHosting(updatedHosting, id, orden, nuevoPrecio, idUnico, plan)
    } else {
      toast.warning('Complete todos los campos')
    }
  }

  function parseDateFromString (dateString: string): Date | null {
    const [day, month, year] = dateString.split('/').map(Number)
    if (!day || !month || !year) {
      return null
    }
    return new Date(year, month - 1, day)
  }

  function checkDate (cantidadDias: number, fechaInicio: string): string {
    const fechaInicioParsed = parseDateFromString(fechaInicio)
    if (!fechaInicioParsed) {
      return 'Inválida'
    }
    const fechaLimite = addDays(fechaInicioParsed, cantidadDias - 1) // Restamos 1 día porque addDays cuenta desde el día actual
    const fechaActual = startOfDay(new Date())
    if (isBefore(fechaActual, fechaLimite)) {
      const diasRestantes = differenceInDays(fechaLimite, fechaActual)
      return `${diasRestantes} días`
    } else if (isAfter(fechaActual, fechaLimite)) {
      return 'Vencido'
    } else if (isEqual(fechaActual, fechaLimite)) {
      return 'Vence hoy'
    } else {
      return '--'
    }
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-y-4 mb-3 lg:mb-5 gap-2">
        <div className="w-full flex flex-col lg:flex-row gap-2 items-center h-fit">
          <button className="bg-white hover:bg-gray-100 w-full lg:w-fit flex items-center text-black gap-2 py-2 px-4 rounded-lg hover:text-main transition-colors">
            <RiFilter2Fill />
            <input
              placeholder="Buscar ..."
              className="bg-transparent outline-none"
              value={search}
              onChange={onSeachChange}
              type="search"
            />
          </button>
          <div className="w-full flex gap-3">
            <SelectFilterAllColaborador
              selectColaborador={selectColaborador}
              setSelectColaborador={setSelectColaborador}
              usuarios={usuarios}
            />
          </div>
        </div>
        <div className='flex gap-5 ml-4 mt-2 items-center'>
            <Link to='metricas'>
                <RiBarChartFill className='text-3xl text-main cursor-pointer' />
            </Link>
        </div>
        <div className="w-fit lg:w-fit flex flex-row items-center gap-4">
          <div className="flex flex-col-reverse gap-3 relative">
            <AnimatePresence>
              {openEstado && (
                <motion.div className="flex flex-col gap-2 h-40  rounded-xl z-10 absolute mt-3 top-full inset-0">
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
                        : 'border border-gray-400 text-black bg-white'
                    }`}
                    onClick={() => {
                      toggleFilter('sinFechaFinYNo1', true)
                    }}
                  >
                    Proceso
                  </button>
                  <button
                    className={` px-2 md:px-4 text-sm md:text-base py-1 lg:py- rounded-xl line-clamp-1 font-bold ${
                      filters.activeFilter == 'fechaFin'
                        ? 'border border-transparent bg-green-600 text-white '
                        : 'border border-gray-400 bg-transparent text-black bg-white'
                    }`}
                    onClick={() => {
                      toggleFilter('fechaFin', true)
                    }}
                  >
                    Finalizados
                  </button>
                  <button
                    className={` border px-2 md:px-4 py-1 lg:py- rounded-xl line-clamp-1 font-bold ${
                      filters.activeFilter == 'estado'
                        ? 'bg-red-500 text-white '
                        : 'bg-transparent border-gray-400 text-black bg-white'
                    }`}
                    onClick={() => {
                      toggleFilter('estado', 1)
                    }}
                  >
                    Abandono
                  </button>
                  <button
                    className={` border px-2 md:px-4 py-1 lg:py- rounded-xl line-clamp-1 font-bold ${
                      filters.activeFilter == 'deshabilitado'
                        ? 'bg-yellow-500 text-white '
                        : 'bg-transparent border-gray-400 text-black bg-white'
                    }`}
                    onClick={() => {
                      toggleFilter('deshabilitado', true)
                    }}
                  >
                    Deshabilitados
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
        <div className="lg:bg-[#fff] lg:px-8 lg:py-6 rounded-xl">
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
                ? 'grid_community_activo_with_proceso'
                : ''
            } 
            ${
              filters.sinFechaFinYNo1 ? 'grid_teplate_ventas_pendientes' : ''
            }  gap-4 mb-2 lg:px-4 lg:py-2 text-gray-400 border-y border-gray-300`}
          >
            <h5 className="lg:text-left line-clamp-1 col-span-1">Contrato</h5>
            <h5 className="lg:text-center line-clamp-1 col-span-2">Saldo</h5>
            <h5 className="lg:text-left line-clamp-1 col-span-2 ">Plan</h5>
            {!filters.enCola && (
              <>
                <h5 className="lg:text-left line-clamp-1 col-span-2">
                  Colaborador
                </h5>
              </>
            )}
            <h5 className="lg:text-left col-span-2">Cliente</h5>
            <h5 className="lg:text-left col-span-2">Marca</h5>
            <h5 className={`lg:text-left ${!filters.sinFechaFinYNo1 ? 'col-span-1' : 'col-span-2'}`}>Estado</h5>
            {!filters.enCola && (
              <>
                <h5 className="lg:text-left line-clamp-1 ">F. Alta</h5>
                <h5 className="lg:text-left w-full line-clamp-1">F. Inicio</h5>
                {!filters.sinFechaFinYNo1 && (
                  <h5 className="lg:text-center w-full col-span-2 line-clamp-1">
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
                  <h5 className="lg:text-center ">Dias {filters.estado}</h5>
                </>
            )}
            <h5 className="lg:text-center">Renovación</h5>
            <h5 className="lg:text-center col-span-2">Exp. Con</h5>
          </div>
          {filterDate().map((orden: ValuesVenta, index: number) => (
            <div
              className={`grid grid_teplate_ventas ${
                filters.enCola ? 'grid_teplate_ventas_encola' : ''
              } 
              ${
                filters.sinFechaFinYNo1 ? 'grid_teplate_ventas_pendientes' : ''
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
                  ? 'grid_community_activo_with_proceso'
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
              md:pr-10 lg:pr-4 relative gap-3 items-center mb-3 lg:mb-0 
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
                  {!filters.enCola && (
                    <div className="lg:text-right ">
                      <h5 className="lg:hidden text-black font-bold mb-0 text-sm bg text-right">
                        Colaborador
                      </h5>
                      <span className="text-right w-full text-black line-clamp-1">
                        {JSON.parse(orden.asignacion)?.map((asignacion: any) =>
                          colaboradores
                            .filter(
                              (colaborador: { id: number, name: string }) =>
                                colaborador.id == asignacion.peso
                            )
                            .map(
                              (colaborador: { name: string }) =>
                                colaborador.name
                            )
                            .join(', ')
                        )}
                      </span>
                    </div>
                  )}
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
                <div className="flex justify-between">
                  {
                    // @ts-expect-error
                    orden.contrato ? (
                      <div className="block text-left col-span-2 w-fit mx-auto ">
                        <span className="text-left text-black line-clamp-1 transition-all group-hover:w-[150%] group-hover:bg-white group-hover:absolute group-hover:inset-0 w-full h-full z-10">
                          {
                            // @ts-expect-error
                            (orden?.contrato?.tipo).toLowerCase() ==
                            'sin costo' ? (
                              <span className="bg-orange-200 text-orange-500 font-bold w-full px-4 mx-auto line-clamp-1 rounded-[1rem] text-center block">
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
                                          <span className="bg-green-200 text-[#3EBA94] font-bold w-full px-4 mx-auto line-clamp-1 rounded-[1rem] text-center block ">
                                            OK
                                          </span>
                                        )
                                      } else {
                                        return (
                                          <button
                                            type="button"
                                            className="bg-[#FDD4D4] text-[#F53061] font-bold w-full px-4 mx-auto line-clamp-1 rounded-[1rem] text-center block"
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
                </div>
              </div>
              {/* PC */}
              <div className="hidden lg:block lg:text-center col-span-1">
                <span className="text-center block text-black w-full line-clamp-1">
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
              {!filters.enCola && (
                <>
                  <div className="hidden lg:block lg:text-center col-span-2">
                    <span className="text-left text-black line-clamp-1 w-full">
                      {JSON.parse(orden.asignacion)?.map((asignacion: any) =>
                        colaboradores
                          .filter(
                            (colaborador: { id: number, name: string }) =>
                              colaborador.id == asignacion.peso
                          )
                          .map(
                            (colaborador: { name: string }) => colaborador.name
                          )
                          .join(', ')
                      )}
                    </span>
                  </div>
                </>
              )}
              <div className="hidden lg:block lg:text-center col-span-2 relative h-full">
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
              <div className="hidden lg:block lg:text-center col-span-2 relative h-full">
                <span className="text-left text-black line-clamp-1 transition-all hover:w-[200%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                  {orden.nombre_marca ? orden.nombre_marca : 'No registrado'}
                </span>
              </div>
              <div
                className={`hidden w-fit mx-auto lg:flex gap-2 lg:px-2 items-center justify-center  lg:text-center 
                    ${!filters.sinFechaFinYNo1 ? 'col-span-1' : 'col-span-2'}
                    ${orden.estado == '1'
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
                      Proceso
                    </span>
                  </>
                  )}
              </div>
              {!filters.enCola && (
                <>
                  <div className="hidden lg:block lg:text-center ">
                    <span className="text-cener block text-black">
                      {orden.fecha_alta}
                    </span>
                  </div>
                  <div className="hidden lg:block lg:text-center ">
                    <span className="text-cener block text-black">
                      {orden.fecha_inicio}
                    </span>
                  </div>
                  {!filters.sinFechaFinYNo1 && (
                    <div className="hidden lg:block lg:text-center col-span-2">
                      <span className="text-center block text-black">
                        {orden.fecha_fin}
                      </span>
                    </div>
                  )}
                </>
              )}
              {area === 'community' &&
                filters.fechaFin == null &&
                area === 'community' &&
                filters.estado !== 1 && (
                  <div className="flex justify-center ">
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
                  <div className="flex justify-center ">
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

              {orden.fecha_fin == null ? (
                <div className="hidden lg:block lg:text-center">
                  {
                    // @ts-expect-error
                    ultimaFecha(orden?.renovacion, orden) ? (
                      <span
                        className={cn(
                          'text-white block rounded-md text-sm w-fit px-3 mx-auto bg-green-400'
                        )}
                      >
                        SI
                      </span>
                    ) : (
                      <span
                        onClick={() => {
                          setAgregarRenovacion({
                            estado: true,
                            id: Number(orden.id) ?? 0,
                            orden,
                            plan: planes.find(plan => orden.id_contrato.split('_')[0] == plan.codigo)
                          })
                          // @ts-expect-error
                          setNuevoPrecio(orden?.contrato.precio)
                        }}
                        className={cn(
                          'text-white block cursor-pointer rounded-md text-sm w-fit px-3 mx-auto bg-red-400'
                        )}
                      >
                        NO
                      </span>
                    )
                  }
                </div>
              ) : '-'}
              {/* {console.log(orden?.contrato?.tiempo)} */}
              {/* {console.log(orden?.fecha_inicio)} */}
               <div className="hidden lg:block lg:text-center col-span-2">
                    <span className="text-center block text-black font-bold">
                        {// @ts-expect-error
                        checkDate(orden?.contrato?.tiempo, orden.fecha_inicio)}
                    </span>
                </div>

              <div className="lg:text-center lg:flex lg:justify-center items-center absolute right-0 top-0 bottom-0 my-auto">
                <Menu
                  menuButton={
                    <MenuButton className="block p-1">
                      <RiSettings3Fill className="text-gray-600 text-lg" />
                    </MenuButton>
                  }
                  align="end"
                  arrow
                  transition
                  menuClassName="bg-secondary-100 p-4"
                >
                  {orden.id != null && !orden.fecha_alta && (
                    <MenuItem className="p-0 hover:bg-transparent">
                      <button
                        onClick={() => {
                          setProyecto(orden)
                          setOpenAlta(true)
                        }}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                      >
                        Generar alta
                      </button>
                    </MenuItem>
                  )}
                  <MenuItem className="p-0 hover:bg-transparent">
                    {orden.id != null && (
                      <Link
                        to={`/admin/lista-ventas/view/${orden.id}`}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                      >
                        Ver
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem className="p-0 hover:bg-transparent">
                    {orden.id != null && (
                      <Link
                        to={`/admin/lista-ventas/editar/${orden.id}`}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                      >
                        Editar
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem className="p-0 hover:bg-transparent">
                    {orden.id != null && (
                      <Link
                        to={`/admin/lista-servicios/avances/${orden.id}`}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                      >
                        Seguimiento
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem className="p-0 hover:bg-transparent">
                    {orden.id != null && (
                      <Link
                        to={`/admin/seguimiento/${orden.id}`}
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
                        // @ts-expect-error
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                        to={`/admin/lista-clientes/editar/${orden.id_cliente}`}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                      >
                        Datos de cliente
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem className="p-0 hover:bg-transparent">
                    <Link
                      to={`generarContrato/${orden.id}`}
                      className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                    >
                      Generar contrato
                    </Link>
                  </MenuItem>
                  <MenuItem className="p-0 hover:bg-transparent">
                    {orden.id != null && (
                      <Link
                        to={'#'}
                        onClick={() => {
                          preguntarPreventa(orden.id)
                        }}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                      >
                        Mover a preventa
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem className="p-0 hover:bg-transparent">
                    {orden.id != null && (
                      <Link
                        to={'#'}
                        onClick={() => {
                          preguntar(orden)
                        }}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                      >
                        {orden.estado == '1'
                          ? 'Quitar abandono'
                          : 'Marcar como abandono'}
                      </Link>
                    )}
                  </MenuItem>
                </Menu>
              </div>
            </div>
          ))}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 justify-center lg:justify-between content_buttons pt-3 mt-5">
            <p className="text-md ml-1 text-black text-center">
              {totalPosts} Registros
            </p>
            <Paginacion
              totalPosts={totalPosts}
              cantidadRegistros={cantidadRegistros}
              paginaActual={paginaActual}
              setpaginaActual={setpaginaActual}
            />
          </div>
          <GenerarAlta
            datos={proyecto}
            open={OpenAlta}
            setOpen={setOpenAlta}
            usuarios={usuarios}
          />
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
        </div>
      )}
    </>
  )
}
