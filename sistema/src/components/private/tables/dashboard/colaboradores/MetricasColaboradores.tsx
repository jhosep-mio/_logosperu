/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable multiline-ternary */
/* eslint-disable no-return-assign */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import { useState, useEffect } from 'react'
import { Loading } from '../../../../shared/Loading'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { getYear, parse } from 'date-fns'
import { cn } from '../../../../shared/cn'
import { FaLeftLong } from 'react-icons/fa6'
// import { ModalLista2 } from './modals/ModalLista2'
import { TotalPorMes } from './graficos/TotalPorMes'
import { TotalPorColaborador } from './graficos/TotalPorColaborador'
// import { GananciaPorColaborador } from './graficos/GananciaPorColaborador'
import { GananciaPorMes } from './graficos/GananciaPorMes'
import { EstadosPorMeses } from './graficos/EstadosPorMeses'
import { GrficoPorTipodeIngreso } from './graficos/GrficoPorTipodeIngreso'
import { Link } from 'react-router-dom'

export const MetricasColaboradores = (): JSX.Element => {
  const [loading, setLoading] = useState(true)
  const [colaboradores, setColaboradores] = useState([])
  const [ventas, setVentas] = useState([])
  const [community, setCommunity] = useState([])
  const [hosting, setHosting] = useState([])
  const currentYear = new Date().getFullYear()
  const [selectedDate, setSelectedDate] = useState(new Date(currentYear, 0, 1))
  const [selectedMonth, setSelectedMonth] = useState<string | null>(null)
  const [filtroTipo, setFiltroTipo] = useState('clientes')
  const [filtroManejo, setFiltroManejo] = useState('todos')

  const getColaboradores = async (): Promise<void> => {
    try {
      const token = localStorage.getItem('token')
      const request = await axios.get(`${Global.url}/indexToProductividad`, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })
      setColaboradores(request.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getColaboradoresYear = async (): Promise<void> => {
    setLoading(true)
    try {
      const token = localStorage.getItem('token')
      const year = new Date(selectedDate).getFullYear() // Extrae el año
      const requestVentas = await axios.get(`${Global.url}/indexCapaTotalMetr/${year}`, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })
      const requestCommunity = await axios.get(`${Global.url}/indexCapaTotalMetrCM/${year}`, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })
      const requestHosting = await axios.get(`${Global.url}/indexMetricas`, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })
      setHosting(requestHosting.data)
      setVentas(requestVentas.data)
      setCommunity(requestCommunity.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const monthNames = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic'
  ]

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

  const monthMap: Record<string, number> = {
    Ene: 1,
    Feb: 2,
    Mar: 3,
    Abr: 4,
    May: 5,
    Jun: 6,
    Jul: 7,
    Ago: 8,
    Sep: 9,
    Oct: 10,
    Nov: 11,
    Dic: 12
  }

  const filterDateAbandonos = (idUser?: any, tipoList?: any): any => {
    let filteredProductos: any = ventas
    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false
      // Verifica asignaciones de usuario
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )

      if (!userAssigned) return false
      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth == null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false

      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }

      // Filtra según filtroTipo
      if (filtroTipo == 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo == 'agencia' && pro.id_cliente != 2298) return false
      // Filtra según tipoList
      if (tipoList == 'abandono' && pro.estado != '1') return false
      return true
    })

    const totalPorMes: Record<string, number> = {}
    const proyectosPorMes: Record<string, any[]> = {}

    monthNames.forEach((month) => {
      totalPorMes[month] = 0
      proyectosPorMes[month] = []
    })

    filteredProductos.forEach((pro: any) => {
      const fechaParts = pro.fecha_inicio.split('/')
      if (fechaParts.length === 3) {
        const mes = parseInt(fechaParts[1], 10)
        if (!isNaN(mes) && mes >= 1 && mes <= 12) {
          const nombreMes = monthNames[mes - 1]
          totalPorMes[nombreMes]++
          // Agrega el proyecto a la lista
          proyectosPorMes[nombreMes].push({
            id: pro.id,
            community_activo: pro.community_activo,
            nombres: pro.nombres || 'Desconocido',
            estado: pro.estado || 'Desconocido',
            apellidos: pro.apellidos || 'Desconocido',
            created_at: pro.created_at || 'N/A',
            fecha_alta: pro.fecha_alta || 'N/A',
            fecha_fin: pro.fecha_fin || 'N/A',
            fecha_inicio: pro.fecha_inicio || 'N/A',
            id_cliente: pro.id_cliente || 'Desconocido',
            comprobante: pro.comprobante || 'N/A',
            medio_ingreso: pro.medio_ingreso || 'Desconocido',
            id_contrato: pro.id_contrato || 'Desconocido',
            nombre_plan: pro.nombre_plan || 'Desconocido',
            nombre_marca: pro.nombre_marca || 'Desconocido',
            asignacion: pro.asignacion || 'N/A',
            contrato: pro?.contrato
              ? {
                  id: pro.contrato.id || 'Desconocido',
                  precio: pro.contrato.precio || 0
                }
              : null
          })
        }
      }
    })

    return { totalPorMes, proyectosPorMes }
  }

  const filterDateTotalAbandonos = (idUser?: any, tipoList?: any): any => {
    let filteredProductos: any = ventas
    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false
      // Verifica asignaciones de usuario
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )

      if (!userAssigned) return false
      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth === null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false

      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }
      // Filtra según filtroTipo
      if (filtroTipo === 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo === 'agencia' && pro.id_cliente != 2298) return false

      // Filtra según tipoList
      if (tipoList === 'abandono' && pro.estado != '1') return false
      // Si pasa todas las condiciones, mantén el elemento
      return true
    })
    return filteredProductos.length
  }

  const filterDate = (idUser?: any, tipoList?: any): Record<string, number> => {
    let filteredProductos: any = ventas
    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false
      // Verifica asignaciones de usuario
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )

      if (!userAssigned) return false
      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth == null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false

      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }
      // Filtra según filtroTipo
      if (filtroTipo == 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo == 'agencia' && pro.id_cliente != 2298) return false
      // Filtra según tipoList
      if (tipoList == 'abandono' && pro.estado != '1') return false

      if (
        tipoList == 'proceso' &&
          ((pro.fecha_fin != null && pro.fecha_fin != '') ||
            !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList == 'finalizado' &&
          (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList == 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList != undefined && pro.estado == '1') return false

      // Si pasa todas las condiciones, mantén el elemento
      return true
    })

    const proyectosPorMes: Record<string, number> = {}
    monthNames.forEach((month) => {
      proyectosPorMes[month] = 0
    })
    filteredProductos.forEach((pro: any) => {
      const fechaParts = pro.fecha_inicio.split('/')
      if (fechaParts.length === 3) {
        const mes = parseInt(fechaParts[1], 10)
        if (!isNaN(mes) && mes >= 1 && mes <= 12) {
          const nombreMes = monthNames[mes - 1]
          proyectosPorMes[nombreMes]++
        }
      }
    })
    return proyectosPorMes
  }

  const filterDateCM = (idUser?: any, tipoList?: any): Record<string, number> => {
    let filteredProductos: any = community
    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false
      // Verifica asignaciones de usuario
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )

      if (!userAssigned) return false
      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth == null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false

      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }
      // Filtra según filtroTipo
      if (filtroTipo == 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo == 'agencia' && pro.id_cliente != 2298) return false
      // Filtra según tipoList
      if (tipoList == 'abandono' && pro.estado != '1') return false

      if (
        tipoList == 'proceso' &&
          ((pro.fecha_fin != null && pro.fecha_fin != '') ||
            !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList == 'finalizado' &&
          (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList == 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList != undefined && pro.estado == '1') return false

      // Si pasa todas las condiciones, mantén el elemento
      return true
    })

    const proyectosPorMes: Record<string, number> = {}
    monthNames.forEach((month) => {
      proyectosPorMes[month] = 0
    })
    filteredProductos.forEach((pro: any) => {
      const fechaParts = pro.fecha_inicio.split('/')
      if (fechaParts.length === 3) {
        const mes = parseInt(fechaParts[1], 10)
        if (!isNaN(mes) && mes >= 1 && mes <= 12) {
          const nombreMes = monthNames[mes - 1]
          proyectosPorMes[nombreMes]++
        }
      }
    })
    return proyectosPorMes
  }

  const filterDateConPrecio = (
    idUser?: any,
    tipoList?: any
  ): Record<string, number> => {
    let filteredProductos: any = ventas
    const proyectosPorMes: Record<string, number> = {}
    monthNames.forEach((month) => {
      proyectosPorMes[month] = 0
    })
    filteredProductos = filteredProductos.filter((pro: any) => {
      if (!pro.fecha_inicio || !pro.asignacion) return false
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )
      if (!userAssigned) return false
      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth === null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false

      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }

      // Filtra según filtroTipo
      if (filtroTipo === 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo === 'agencia' && pro.id_cliente != 2298) return false

      // Filtra según tipoList
      if (tipoList === 'abandono' && pro.estado != '1') return false
      if (
        tipoList === 'proceso' &&
          ((pro.fecha_fin != null && pro.fecha_fin != '') ||
            !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList === 'finalizado' &&
          (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList === 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList !== undefined && pro.estado == '1') return false

      // Si pasa todas las condiciones, mantén el elemento
      return true
    })

    filteredProductos.forEach((pro: any) => {
      const fechaParts = pro.fecha_inicio.split('/')
      if (fechaParts.length === 3) {
        const mes = parseInt(fechaParts[1], 10)
        if (!isNaN(mes) && mes >= 1 && mes <= 12) {
          const nombreMes = monthNames[mes - 1]
          const precio = parseFloat(pro?.contrato?.precio) || 0
          const tiempoPorColaborador = pro.array_colaboradores[idUser]
          const tiempoTotal = pro.horas_totales

          const porcentajeParticipacion = tiempoTotal > 0
            ? (tiempoPorColaborador?.horas_trabajadas / tiempoTotal) * 100
            : 0
          if (!tiempoPorColaborador) return
          const precioFinal = (porcentajeParticipacion / 100) * precio
          proyectosPorMes[nombreMes] += Number(precioFinal)
        }
      }
    })
    return proyectosPorMes
  }

  const filterDateConPrecioSinUser = (
    idUser?: any,
    tipoList?: any
  ): Record<string, number> => {
    let filteredProductos: any = ventas
    const proyectosPorMes: Record<string, number> = {}
    monthNames.forEach((month) => {
      proyectosPorMes[month] = 0
    })
    filteredProductos = filteredProductos.filter((pro: any) => {
      if (!pro.fecha_inicio || !pro.asignacion) return false
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )
      if (!userAssigned) return false
      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth === null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false

      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }

      // Filtra según filtroTipo
      if (filtroTipo === 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo === 'agencia' && pro.id_cliente != 2298) return false

      // Filtra según tipoList
      if (tipoList === 'abandono' && pro.estado != '1') return false
      if (
        tipoList === 'proceso' &&
          ((pro.fecha_fin != null && pro.fecha_fin != '') ||
            !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList === 'finalizado' &&
          (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList === 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList !== undefined && pro.estado == '1') return false

      // Si pasa todas las condiciones, mantén el elemento
      return true
    })

    filteredProductos.forEach((pro: any) => {
      const fechaParts = pro.fecha_inicio.split('/')
      if (fechaParts.length === 3) {
        const mes = parseInt(fechaParts[1], 10)
        if (!isNaN(mes) && mes >= 1 && mes <= 12) {
          const nombreMes = monthNames[mes - 1]
          const precio = parseFloat(pro?.contrato?.precio) || 0
          proyectosPorMes[nombreMes] += Number(precio)
        }
      }
    })
    return proyectosPorMes
  }

  const filterDateConPrecioCM = (
    idUser?: any,
    tipoList?: any
  ): Record<string, number> => {
    let filteredProductos: any = community

    const proyectosPorMes: Record<string, number> = {}
    monthNames.forEach((month) => {
      proyectosPorMes[month] = 0
    })

    filteredProductos = filteredProductos.filter((pro: any) => {
      if (!pro.fecha_inicio || !pro.asignacion) return false
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )
      if (!userAssigned) return false
      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth === null || month == Number(selectedMonth)
      if (!(yearMatches && monthMatches)) return false
      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }

      // Filtra según filtroTipo
      if (filtroTipo === 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo === 'agencia' && pro.id_cliente != 2298) return false

      // Filtra según tipoList
      if (tipoList === 'abandono' && pro.estado != '1') return false
      if (
        tipoList === 'proceso' &&
          ((pro.fecha_fin != null && pro.fecha_fin != '') ||
            !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList === 'finalizado' &&
          (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList === 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList !== undefined && pro.estado == '1') return false

      // Si pasa todas las condiciones, mantén el elemento
      return true
    })

    filteredProductos.forEach((pro: any) => {
      const fechaParts = pro.fecha_inicio.split('/')
      if (fechaParts.length === 3) {
        const mes = parseInt(fechaParts[1], 10)
        if (!isNaN(mes) && mes >= 1 && mes <= 12) {
          const nombreMes = monthNames[mes - 1]
          const precio = parseFloat(pro?.contrato?.precio) || 0
          const tiempoPorColaborador = pro.array_colaboradores[idUser]
          const tiempoTotal = pro.horas_totales

          const porcentajeParticipacion = tiempoTotal > 0
            ? (tiempoPorColaborador?.horas_trabajadas / tiempoTotal) * 100
            : 0

          if (!tiempoPorColaborador) return

          const precioFinal = (porcentajeParticipacion / 100) * precio
          proyectosPorMes[nombreMes] += Number(precioFinal)
        }
      }
      if (pro.renovacion) {
        JSON.parse(pro.renovacion).fechas?.forEach((renovacion: any) => {
          const fechaRenovacionParts = renovacion.fecha.split('-')
          if (fechaRenovacionParts.length == 3) {
            const mesRenovacion = parseInt(fechaRenovacionParts[1], 10)
            if (!isNaN(mesRenovacion) && mesRenovacion >= 1 && mesRenovacion <= 12) {
              const nombreMesRenovacion = monthNames[mesRenovacion - 1]
              const precioRenovacion = parseFloat(renovacion.montoPrecio) || 0

              const tiempoPorColaborador = pro.array_colaboradores[idUser]
              const tiempoTotal = pro.horas_totales

              const porcentajeParticipacion = tiempoTotal > 0
                ? (tiempoPorColaborador?.horas_trabajadas / tiempoTotal) * 100
                : 0

              if (!tiempoPorColaborador) return

              const precioFinal = (porcentajeParticipacion / 100) * precioRenovacion
              proyectosPorMes[nombreMesRenovacion] += Number(precioFinal)
            }
          }
        })
      }
    })

    return proyectosPorMes
  }

  const filterDateConPrecioSinUserCM = (
    idUser?: any,
    tipoList?: any
  ): Record<string, number> => {
    let filteredProductos: any = community

    const proyectosPorMes: Record<string, number> = {}
    monthNames.forEach((month) => {
      proyectosPorMes[month] = 0
    })

    filteredProductos = filteredProductos.filter((pro: any) => {
      if (!pro.fecha_inicio || !pro.asignacion) return false
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )
      if (!userAssigned) return false
      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth === null || month == Number(selectedMonth)
      if (!(yearMatches && monthMatches)) return false
      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }

      // Filtra según filtroTipo
      if (filtroTipo === 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo === 'agencia' && pro.id_cliente != 2298) return false

      // Filtra según tipoList
      if (tipoList === 'abandono' && pro.estado != '1') return false
      if (
        tipoList === 'proceso' &&
          ((pro.fecha_fin != null && pro.fecha_fin != '') ||
            !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList === 'finalizado' &&
          (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList === 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList !== undefined && pro.estado == '1') return false

      // Si pasa todas las condiciones, mantén el elemento
      return true
    })

    filteredProductos.forEach((pro: any) => {
      const fechaParts = pro.fecha_inicio.split('/')
      if (fechaParts.length === 3) {
        const mes = parseInt(fechaParts[1], 10)
        if (!isNaN(mes) && mes >= 1 && mes <= 12) {
          const nombreMes = monthNames[mes - 1]
          const precio = parseFloat(pro?.contrato?.precio) || 0
          proyectosPorMes[nombreMes] += Number(precio)
        }
      }
      if (pro.renovacion) {
        JSON.parse(pro.renovacion).fechas?.forEach((renovacion: any) => {
          const fechaRenovacionParts = renovacion.fecha.split('-')
          if (fechaRenovacionParts.length == 3) {
            const mesRenovacion = parseInt(fechaRenovacionParts[1], 10)
            if (!isNaN(mesRenovacion) && mesRenovacion >= 1 && mesRenovacion <= 12) {
              const nombreMesRenovacion = monthNames[mesRenovacion - 1]
              const precioRenovacion = parseFloat(renovacion.montoPrecio) || 0

              proyectosPorMes[nombreMesRenovacion] += Number(precioRenovacion)
            }
          }
        })
      }
    })

    return proyectosPorMes
  }

  const filterDateConPrecioDatos = (
    idUser?: any,
    tipoList?: any,
    // @ts-expect-error
    messs: any
  ): Record<string, number> => {
    let filteredProductos: any = ventas
    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false
      // Verifica asignaciones de usuario
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )

      if (!userAssigned) return false
      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth == null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false

      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }
      // Filtra según filtroTipo
      if (filtroTipo == 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo == 'agencia' && pro.id_cliente != 2298) return false

      // Filtra según tipoList
      if (tipoList == 'abandono' && pro.estado != '1') return false

      if (
        tipoList == 'proceso' &&
            ((pro.fecha_fin != null && pro.fecha_fin != '') ||
              !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList == 'finalizado' &&
            (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList == 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList != undefined && pro.estado == '1') return false

      // Si pasa todas las condiciones, mantén el elemento
      return true
    })

    if (messs && messs in monthMap) {
      const monthIndex = monthMap[messs]
      filteredProductos = filteredProductos.filter((pro: any) => {
        const fechaParts = pro.fecha_inicio.split('/')
        if (fechaParts.length === 3) {
          const mes = parseInt(fechaParts[1], 10)
          return mes === monthIndex
        }
        return false
      })
    }
    return filteredProductos.filter((pro: any) => pro?.contrato && pro.contrato.precio > 0).map((pro: any) => ({
      id: pro.id,
      community_activo: pro.community_activo,
      estado: pro.estado || 'Desconocido',
      nombres: pro.nombres,
      apellidos: pro.apellidos,
      created_at: pro.created_at,
      fecha_alta: pro.fecha_alta,
      fecha_fin: pro.fecha_fin,
      fecha_inicio: pro.fecha_inicio,
      id_cliente: pro.id_cliente,
      medio_ingreso: pro.medio_ingreso,
      id_contrato: pro.id_contrato,
      nombre_plan: pro.nombre_plan,
      nombre_marca: pro.nombre_marca,
      asignacion: pro.asignacion,
      contrato: pro?.contrato
        ? {
            id: pro?.contrato.id,
            precio: pro?.contrato.precio
          } : null
    }))
  }

  const filterDateConPrecioDatosCM = (
    idUser?: any,
    tipoList?: any,
    // @ts-expect-error
    messs: any
  ): Record<string, number> => {
    let filteredProductos: any = community
    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false
      // Verifica asignaciones de usuario
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )

      if (!userAssigned) return false
      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth == null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false

      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }
      // Filtra según filtroTipo
      if (filtroTipo == 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo == 'agencia' && pro.id_cliente != 2298) return false
      // Filtra según tipoList
      if (tipoList == 'abandono' && pro.estado != '1') return false
      if (
        tipoList == 'proceso' &&
            ((pro.fecha_fin != null && pro.fecha_fin != '') ||
              !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList == 'finalizado' &&
            (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList == 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList != undefined && pro.estado == '1') return false

      // Si pasa todas las condiciones, mantén el elemento
      return true
    })

    if (messs && messs in monthMap) {
      const monthIndex = monthMap[messs]
      filteredProductos = filteredProductos.filter((pro: any) => {
        // Verificar si el mes coincide con el mes de la fecha de inicio
        const fechaParts = pro.fecha_inicio.split('/')
        let matchFound = false

        if (fechaParts.length === 3) {
          const mesInicio = parseInt(fechaParts[1], 10)
          if (mesInicio === monthIndex) {
            matchFound = true
          }
        }
        if (pro.renovacion) {
          JSON.parse(pro.renovacion).fechas?.forEach((renovacion: any) => {
            const fechaRenovacionParts = renovacion.fecha.split('-')
            if (fechaRenovacionParts.length === 3) {
              const mesRenovacion = parseInt(fechaRenovacionParts[1], 10)
              if (mesRenovacion === monthIndex) {
                matchFound = true
              }
            }
          })
        }
        return matchFound
      })
    }

    return filteredProductos.filter((pro: any) => pro?.contrato && pro.contrato.precio > 0).map((pro: any) => ({
      id: pro.id,
      community_activo: pro.community_activo,
      estado: pro.estado || 'Desconocido',
      nombres: pro.nombres,
      apellidos: pro.apellidos,
      created_at: pro.created_at,
      fecha_alta: pro.fecha_alta,
      fecha_fin: pro.fecha_fin,
      fecha_inicio: pro.fecha_inicio,
      id_cliente: pro.id_cliente,
      medio_ingreso: pro.medio_ingreso,
      id_contrato: pro.id_contrato,
      nombre_plan: pro.nombre_plan,
      nombre_marca: pro.nombre_marca,
      asignacion: pro.asignacion,
      contrato: pro?.contrato
        ? {
            id: pro?.contrato.id,
            precio: pro?.contrato.precio
          } : null
    }))
  }

  const filterDateConPerdida = (
    idUser?: any,
    _tipoList?: any
  ): any => {
    let filteredProductos: any = ventas

    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false
      // Verifica asignaciones de usuario
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )

      if (!userAssigned) return false
      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth == null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false

      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }
      // Filtra según filtroTipo
      if (filtroTipo == 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo == 'agencia' && pro.id_cliente != 2298) return false
      // Si pasa todas las condiciones, mantén el elemento
      return true
    })

    filteredProductos = filteredProductos.filter((pro: any) => {
      return pro.estado == '1'
    })

    const proyectosPorMes: Record<string, { total: number, proyectos: Array<{ id: any, nombres: string, apellidos: string, created_at: string, fecha_alta: string, fecha_fin: string, fecha_inicio: string, id_cliente: any, comprobante: any, medio_ingreso: string, community_activo: string, id_contrato: any, estado: string, nombre_plan: string, nombre_marca: string, asignacion: any, contrato: { id: any, precio: number } | null }> }> = {}
    monthNames.forEach((month) => {
      proyectosPorMes[month] = { total: 0, proyectos: [] }
    })

    filteredProductos.forEach((pro: any) => {
      const fechaParts = pro.fecha_inicio.split('/')
      if (fechaParts.length === 3) {
        const mes = parseInt(fechaParts[1], 10)
        if (!isNaN(mes) && mes >= 1 && mes <= 12) {
          if (pro?.comprobante) {
            try {
              const nombreMes = monthNames[mes - 1]
              const comprobante = JSON.parse(pro.comprobante)
              if (comprobante.pendiente > 0) {
                const precio = parseFloat(comprobante.pendiente) || 0
                proyectosPorMes[nombreMes].total += precio
                proyectosPorMes[nombreMes].proyectos.push({
                  id: pro.id,
                  community_activo: pro.community_activo,
                  estado: pro.estado || 'Desconocido',
                  nombres: pro.nombres || 'Desconocido',
                  apellidos: pro.apellidos || 'Desconocido',
                  created_at: pro.created_at || 'N/A',
                  fecha_alta: pro.fecha_alta || 'N/A',
                  fecha_fin: pro.fecha_fin || 'N/A',
                  fecha_inicio: pro.fecha_inicio || 'N/A',
                  id_cliente: pro.id_cliente || 'Desconocido',
                  comprobante: pro.comprobante || 'N/A',
                  medio_ingreso: pro.medio_ingreso || 'Desconocido',
                  id_contrato: pro.id_contrato || 'Desconocido',
                  nombre_plan: pro.nombre_plan || 'Desconocido',
                  nombre_marca: pro.nombre_marca || 'Desconocido',
                  asignacion: pro.asignacion || 'N/A',
                  contrato: pro?.contrato
                    ? {
                        id: pro.contrato.id || 'Desconocido',
                        precio: pro.contrato.precio || 0
                      }
                    : null
                })
              }
            } catch (error) {
              console.error('Error parsing JSON in comprobante:', error)
            }
          }
        }
      }
    })
    return proyectosPorMes
  }

  const filterDateConPerdidaCM = (
    idUser?: any,
    _tipoList?: any
  ): any => {
    let filteredProductos: any = community

    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false
      // Verifica asignaciones de usuario
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )

      if (!userAssigned) return false
      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth == null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false

      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }
      // Filtra según filtroTipo
      if (filtroTipo == 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo == 'agencia' && pro.id_cliente != 2298) return false
      // Si pasa todas las condiciones, mantén el elemento
      return true
    })

    filteredProductos = filteredProductos.filter((pro: any) => {
      return pro.estado == '1'
    })

    const proyectosPorMes: Record<string, { total: number, proyectos: Array<{ id: any, nombres: string, apellidos: string, created_at: string, fecha_alta: string, fecha_fin: string, fecha_inicio: string, id_cliente: any, comprobante: any, medio_ingreso: string, community_activo: string, id_contrato: any, estado: string, nombre_plan: string, nombre_marca: string, asignacion: any, contrato: { id: any, precio: number } | null }> }> = {}
    monthNames.forEach((month) => {
      proyectosPorMes[month] = { total: 0, proyectos: [] }
    })

    filteredProductos.forEach((pro: any) => {
      const fechaParts = pro.fecha_inicio.split('/')
      if (fechaParts.length === 3) {
        const mes = parseInt(fechaParts[1], 10)
        if (!isNaN(mes) && mes >= 1 && mes <= 12) {
          if (pro?.comprobante) {
            try {
              const nombreMes = monthNames[mes - 1]
              const comprobante = JSON.parse(pro.comprobante)
              if (comprobante.pendiente > 0) {
                const precio = parseFloat(comprobante.pendiente) || 0
                proyectosPorMes[nombreMes].total += precio
                proyectosPorMes[nombreMes].proyectos.push({
                  id: pro.id,
                  community_activo: pro.community_activo,
                  estado: pro.estado || 'Desconocido',
                  nombres: pro.nombres || 'Desconocido',
                  apellidos: pro.apellidos || 'Desconocido',
                  created_at: pro.created_at || 'N/A',
                  fecha_alta: pro.fecha_alta || 'N/A',
                  fecha_fin: pro.fecha_fin || 'N/A',
                  fecha_inicio: pro.fecha_inicio || 'N/A',
                  id_cliente: pro.id_cliente || 'Desconocido',
                  comprobante: pro.comprobante || 'N/A',
                  medio_ingreso: pro.medio_ingreso || 'Desconocido',
                  id_contrato: pro.id_contrato || 'Desconocido',
                  nombre_plan: pro.nombre_plan || 'Desconocido',
                  nombre_marca: pro.nombre_marca || 'Desconocido',
                  asignacion: pro.asignacion || 'N/A',
                  contrato: pro?.contrato
                    ? {
                        id: pro.contrato.id || 'Desconocido',
                        precio: pro.contrato.precio || 0
                      }
                    : null
                })
              }
            } catch (error) {
              console.error('Error parsing JSON in comprobante:', error)
            }
          }
        }
      }
    })
    return proyectosPorMes
  }

  const filterDateTotalConPerdida = (idUser?: any): any => {
    let filteredProductos: any = ventas
    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false
      // Verifica asignaciones de usuario
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )

      if (!userAssigned) return false
      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth == null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false

      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }
      // Filtra según filtroTipo
      if (filtroTipo == 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo == 'agencia' && pro.id_cliente != 2298) return false
      // Si pasa todas las condiciones, mantén el elemento
      return true
    })

    filteredProductos = filteredProductos.filter((pro: any) => {
      return pro.estado == '1'
    })
    let totalPrecio = 0
    const proyectos: any[] = []

    filteredProductos.forEach((pro: any) => {
      const fechaParts = pro.fecha_inicio.split('/')
      if (fechaParts.length === 3) {
        const mes = parseInt(fechaParts[1], 10)
        if (!isNaN(mes) && mes >= 1 && mes <= 12) {
          if (pro?.comprobante) {
            try {
              const comprobante = JSON.parse(pro.comprobante)
              if (comprobante.pendiente > 0) {
                const precio = parseFloat(comprobante.pendiente) || 0
                totalPrecio += precio

                // Agrega el proyecto a la lista
                proyectos.push({
                  id: pro.id,
                  community_activo: pro.community_activo,
                  estado: pro.estado || 'Desconocido',
                  nombres: pro.nombres || 'Desconocido',
                  apellidos: pro.apellidos || 'Desconocido',
                  created_at: pro.created_at || 'N/A',
                  fecha_alta: pro.fecha_alta || 'N/A',
                  fecha_fin: pro.fecha_fin || 'N/A',
                  fecha_inicio: pro.fecha_inicio || 'N/A',
                  id_cliente: pro.id_cliente || 'Desconocido',
                  comprobante: pro.comprobante || 'N/A',
                  medio_ingreso: pro.medio_ingreso || 'Desconocido',
                  id_contrato: pro.id_contrato || 'Desconocido',
                  nombre_plan: pro.nombre_plan || 'Desconocido',
                  nombre_marca: pro.nombre_marca || 'Desconocido',
                  asignacion: pro.asignacion || 'N/A',
                  contrato: pro?.contrato
                    ? {
                        id: pro.contrato.id || 'Desconocido',
                        precio: pro.contrato.precio || 0
                      }
                    : null
                })
              }
            } catch (error) {
              console.error('Error parsing JSON in comprobante:', error)
            }
          }
        }
      }
    })
    return { total: totalPrecio, proyectos }
  }

  const filterDateTotalConPerdidaCM = (idUser?: any): any => {
    let filteredProductos: any = community
    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false
      // Verifica asignaciones de usuario
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )

      if (!userAssigned) return false
      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth == null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false

      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }
      // Filtra según filtroTipo
      if (filtroTipo == 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo == 'agencia' && pro.id_cliente != 2298) return false
      // Si pasa todas las condiciones, mantén el elemento
      return true
    })

    filteredProductos = filteredProductos.filter((pro: any) => {
      return pro.estado == '1'
    })
    let totalPrecio = 0
    const proyectos: any[] = []

    filteredProductos.forEach((pro: any) => {
      const fechaParts = pro.fecha_inicio.split('/')
      if (fechaParts.length === 3) {
        const mes = parseInt(fechaParts[1], 10)
        if (!isNaN(mes) && mes >= 1 && mes <= 12) {
          if (pro?.comprobante) {
            try {
              const comprobante = JSON.parse(pro.comprobante)
              if (comprobante.pendiente > 0) {
                const precio = parseFloat(comprobante.pendiente) || 0
                totalPrecio += precio

                // Agrega el proyecto a la lista
                proyectos.push({
                  id: pro.id,
                  community_activo: pro.community_activo,
                  estado: pro.estado || 'Desconocido',
                  nombres: pro.nombres || 'Desconocido',
                  apellidos: pro.apellidos || 'Desconocido',
                  created_at: pro.created_at || 'N/A',
                  fecha_alta: pro.fecha_alta || 'N/A',
                  fecha_fin: pro.fecha_fin || 'N/A',
                  fecha_inicio: pro.fecha_inicio || 'N/A',
                  id_cliente: pro.id_cliente || 'Desconocido',
                  comprobante: pro.comprobante || 'N/A',
                  medio_ingreso: pro.medio_ingreso || 'Desconocido',
                  id_contrato: pro.id_contrato || 'Desconocido',
                  nombre_plan: pro.nombre_plan || 'Desconocido',
                  nombre_marca: pro.nombre_marca || 'Desconocido',
                  asignacion: pro.asignacion || 'N/A',
                  contrato: pro?.contrato
                    ? {
                        id: pro.contrato.id || 'Desconocido',
                        precio: pro.contrato.precio || 0
                      }
                    : null
                })
              }
            } catch (error) {
              console.error('Error parsing JSON in comprobante:', error)
            }
          }
        }
      }
    })
    return { total: totalPrecio, proyectos }
  }

  const filterDatePostVenta = (
    idUser?: any,
    tipoList?: any
  ): Record<string, number> => {
    let filteredProductos: any = ventas
    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false
      // Verifica asignaciones de usuario
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )

      if (!userAssigned) return false

      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth === null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false
      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }
      // Filtra según filtroTipo
      if (filtroTipo === 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo === 'agencia' && pro.id_cliente != 2298) return false

      // Filtra según tipoList
      if (tipoList === 'abandono' && pro.estado != '1') return false
      if (
        tipoList === 'proceso' &&
            ((pro.fecha_fin != null && pro.fecha_fin != '') ||
              !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList === 'finalizado' &&
            (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList === 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList !== undefined && pro.estado == '1') return false

      // Si pasa todas las condiciones, mantén el elemento
      return true
    })
    filteredProductos = filteredProductos.filter((pro: any) => {
      return pro.medio_ingreso == 3
    })

    const proyectosPorMes: Record<string, number> = {}
    monthNames.forEach((month) => {
      proyectosPorMes[month] = 0
    })
    filteredProductos.forEach((pro: any) => {
      const fechaParts = pro.fecha_inicio.split('/')
      if (fechaParts.length === 3) {
        const mes = parseInt(fechaParts[1], 10)
        if (!isNaN(mes) && mes >= 1 && mes <= 12) {
          const nombreMes = monthNames[mes - 1]
          proyectosPorMes[nombreMes]++
        }
      }
    })
    return proyectosPorMes
  }

  const filterDatePostVentaDatos = (
    idUser?: any,
    tipoList?: any,
    // @ts-expect-error
    messs: any
  ): Record<string, number> => {
    let filteredProductos: any = ventas

    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false
      // Verifica asignaciones de usuario
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )

      if (!userAssigned) return false

      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth === null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false
      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }
      // Filtra según filtroTipo
      if (filtroTipo === 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo === 'agencia' && pro.id_cliente != 2298) return false

      // Filtra según tipoList
      if (tipoList === 'abandono' && pro.estado != '1') return false
      if (
        tipoList === 'proceso' &&
            ((pro.fecha_fin != null && pro.fecha_fin != '') ||
              !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList === 'finalizado' &&
            (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList === 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList !== undefined && pro.estado == '1') return false

      // Si pasa todas las condiciones, mantén el elemento
      return true
    })

    filteredProductos = filteredProductos.filter((pro: any) => {
      return pro.medio_ingreso == 3
    })

    if (messs && messs in monthMap) {
      const monthIndex = monthMap[messs]
      filteredProductos = filteredProductos.filter((pro: any) => {
        const fechaParts = pro.fecha_inicio.split('/')
        if (fechaParts.length === 3) {
          const mes = parseInt(fechaParts[1], 10)
          return mes === monthIndex
        }
        return false
      })
    }
    return filteredProductos
  }

  const filterDateTotalPostVenta = (idUser?: any, tipoList?: any): any => {
    let filteredProductos: any = ventas
    filteredProductos = filteredProductos.filter((pro: any) => {
      return pro.medio_ingreso == 3
    })
    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false
      // Verifica asignaciones de usuario
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )

      if (!userAssigned) return false

      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth === null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false
      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }
      // Filtra según filtroTipo
      if (filtroTipo === 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo === 'agencia' && pro.id_cliente != 2298) return false

      // Filtra según tipoList
      if (tipoList === 'abandono' && pro.estado != '1') return false
      if (
        tipoList === 'proceso' &&
          ((pro.fecha_fin != null && pro.fecha_fin != '') ||
            !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList === 'finalizado' &&
          (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList === 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList !== undefined && pro.estado == '1') return false

      // Si pasa todas las condiciones, mantén el elemento
      return true
    })

    return filteredProductos
  }

  const filterDateDatos = (
    idUser?: any,
    tipoList?: any,
    // @ts-expect-error
    messs: any
  ): Record<string, number> => {
    let filteredProductos: any = ventas
    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false
      // Verifica asignaciones de usuario
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )

      if (!userAssigned) return false

      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth === null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false
      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }
      // Filtra según filtroTipo
      if (filtroTipo === 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo === 'agencia' && pro.id_cliente != 2298) return false

      // Filtra según tipoList
      if (tipoList === 'abandono' && pro.estado != '1') return false
      if (
        tipoList === 'proceso' &&
          ((pro.fecha_fin != null && pro.fecha_fin != '') ||
            !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList === 'finalizado' &&
          (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList === 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList !== undefined && pro.estado == '1') return false

      // Si pasa todas las condiciones, mantén el elemento
      return true
    })
    if (messs && messs in monthMap) {
      const monthIndex = monthMap[messs]
      filteredProductos = filteredProductos.filter((pro: any) => {
        const fechaParts = pro.fecha_inicio.split('/')
        if (fechaParts.length === 3) {
          const mes = parseInt(fechaParts[1], 10)
          return mes === monthIndex
        }
        return false
      })
    }
    return filteredProductos.map((pro: any) => ({
      id: pro.id,
      community_activo: pro.community_activo,
      nombres: pro.nombres,
      apellidos: pro.apellidos,
      estado: pro.estado || 'Desconocido',
      created_at: pro.created_at,
      fecha_alta: pro.fecha_alta,
      fecha_fin: pro.fecha_fin,
      fecha_inicio: pro.fecha_inicio,
      id_cliente: pro.id_cliente,
      medio_ingreso: pro.medio_ingreso,
      id_contrato: pro.id_contrato,
      nombre_plan: pro.nombre_plan,
      nombre_marca: pro.nombre_marca,
      asignacion: pro.asignacion,
      contrato: pro?.contrato
        ? {
            id: pro?.contrato.id,
            precio: pro?.contrato.precio
          } : null
    }))
  }

  const filterDateDatosCM = (
    idUser?: any,
    tipoList?: any,
    // @ts-expect-error
    messs: any
  ): Record<string, number> => {
    let filteredProductos: any = community
    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false
      // Verifica asignaciones de usuario
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )

      if (!userAssigned) return false

      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth === null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false
      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }
      // Filtra según filtroTipo
      if (filtroTipo === 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo === 'agencia' && pro.id_cliente != 2298) return false

      // Filtra según tipoList
      if (tipoList === 'abandono' && pro.estado != '1') return false
      if (
        tipoList === 'proceso' &&
          ((pro.fecha_fin != null && pro.fecha_fin != '') ||
            !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList === 'finalizado' &&
          (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList === 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList !== undefined && pro.estado == '1') return false

      // Si pasa todas las condiciones, mantén el elemento
      return true
    })
    if (messs && messs in monthMap) {
      const monthIndex = monthMap[messs]
      filteredProductos = filteredProductos.filter((pro: any) => {
        const fechaParts = pro.fecha_inicio.split('/')
        if (fechaParts.length === 3) {
          const mes = parseInt(fechaParts[1], 10)
          return mes === monthIndex
        }
        return false
      })
    }
    return filteredProductos.map((pro: any) => ({
      id: pro.id,
      community_activo: pro.community_activo,
      nombres: pro.nombres,
      apellidos: pro.apellidos,
      estado: pro.estado || 'Desconocido',
      created_at: pro.created_at,
      fecha_alta: pro.fecha_alta,
      fecha_fin: pro.fecha_fin,
      fecha_inicio: pro.fecha_inicio,
      id_cliente: pro.id_cliente,
      medio_ingreso: pro.medio_ingreso,
      id_contrato: pro.id_contrato,
      nombre_plan: pro.nombre_plan,
      nombre_marca: pro.nombre_marca,
      asignacion: pro.asignacion,
      contrato: pro?.contrato
        ? {
            id: pro?.contrato.id,
            precio: pro?.contrato.precio
          } : null
    }))
  }

  const filterDateTotal = (idUser?: any, tipoList?: any): any => {
    let filteredProductos: any = ventas
    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false
      // Verifica asignaciones de usuario
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )

      if (!userAssigned) return false

      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth === null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false

      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }

      // Filtra según filtroTipo
      if (filtroTipo === 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo === 'agencia' && pro.id_cliente != 2298) return false

      // Filtra según tipoList
      if (tipoList === 'abandono' && pro.estado != '1') return false
      if (
        tipoList === 'proceso' &&
          ((pro.fecha_fin != null && pro.fecha_fin != '') ||
            !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList === 'finalizado' &&
          (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList === 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList !== undefined && pro.estado == '1') return false

      // Si pasa todas las condiciones, mantén el elemento
      return true
    })
    return filteredProductos.length
  }

  const filterDateTotalCM = (idUser?: any, tipoList?: any): any => {
    let filteredProductos: any = community
    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false
      // Verifica asignaciones de usuario
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )

      if (!userAssigned) return false

      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth === null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false

      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }

      // Filtra según filtroTipo
      if (filtroTipo === 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo === 'agencia' && pro.id_cliente != 2298) return false

      // Filtra según tipoList
      if (tipoList === 'abandono' && pro.estado != '1') return false
      if (
        tipoList === 'proceso' &&
          ((pro.fecha_fin != null && pro.fecha_fin != '') ||
            !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList === 'finalizado' &&
          (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList === 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList !== undefined && pro.estado == '1') return false

      // Si pasa todas las condiciones, mantén el elemento
      return true
    })
    return filteredProductos.length
  }

  const filterDateTotalDatos = (idUser?: any, tipoList?: any): any => {
    let filteredProductos: any = ventas
    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false
      // Verifica asignaciones de usuario
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )

      if (!userAssigned) return false

      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth === null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false

      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }

      // Filtra según filtroTipo
      if (filtroTipo === 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo === 'agencia' && pro.id_cliente != 2298) return false

      // Filtra según tipoList
      if (tipoList === 'abandono' && pro.estado != '1') return false
      if (
        tipoList === 'proceso' &&
          ((pro.fecha_fin != null && pro.fecha_fin != '') ||
            !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList === 'finalizado' &&
          (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList === 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList !== undefined && pro.estado == '1') return false

      // Si pasa todas las condiciones, mantén el elemento
      return true
    })
    return filteredProductos.map((pro: any) => ({
      id: pro.id,
      community_activo: pro.community_activo,
      nombres: pro.nombres,
      estado: pro.estado || 'Desconocido',
      apellidos: pro.apellidos,
      created_at: pro.created_at,
      fecha_alta: pro.fecha_alta,
      fecha_fin: pro.fecha_fin,
      fecha_inicio: pro.fecha_inicio,
      id_cliente: pro.id_cliente,
      medio_ingreso: pro.medio_ingreso,
      id_contrato: pro.id_contrato,
      nombre_plan: pro.nombre_plan,
      nombre_marca: pro.nombre_marca,
      asignacion: pro.asignacion,
      contrato: pro?.contrato
        ? {
            id: pro?.contrato.id,
            precio: pro?.contrato.precio
          } : null
    }))
  }

  const filterDateTotalDatosCM = (idUser?: any, tipoList?: any): any => {
    let filteredProductos: any = community
    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false
      // Verifica asignaciones de usuario
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )

      if (!userAssigned) return false

      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth === null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false

      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }

      // Filtra según filtroTipo
      if (filtroTipo === 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo === 'agencia' && pro.id_cliente != 2298) return false

      // Filtra según tipoList
      if (tipoList === 'abandono' && pro.estado != '1') return false
      if (
        tipoList === 'proceso' &&
          ((pro.fecha_fin != null && pro.fecha_fin != '') ||
            !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList === 'finalizado' &&
          (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList === 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList !== undefined && pro.estado == '1') return false

      // Si pasa todas las condiciones, mantén el elemento
      return true
    })
    return filteredProductos.map((pro: any) => ({
      id: pro.id,
      community_activo: pro.community_activo,
      nombres: pro.nombres,
      estado: pro.estado || 'Desconocido',
      apellidos: pro.apellidos,
      created_at: pro.created_at,
      fecha_alta: pro.fecha_alta,
      fecha_fin: pro.fecha_fin,
      fecha_inicio: pro.fecha_inicio,
      id_cliente: pro.id_cliente,
      medio_ingreso: pro.medio_ingreso,
      id_contrato: pro.id_contrato,
      nombre_plan: pro.nombre_plan,
      nombre_marca: pro.nombre_marca,
      asignacion: pro.asignacion,
      contrato: pro?.contrato
        ? {
            id: pro?.contrato.id,
            precio: pro?.contrato.precio
          } : null
    }))
  }

  const filterDateTotalConPrecio = (idUser?: any, tipoList?: any): { total: number, proyectos: any[] } => {
    let filteredProductos: any = ventas
    // Filtra los productos según las condiciones dadas
    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false

      // Verifica asignaciones de usuario
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )

      if (!userAssigned) return false

      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth === null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false

      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }

      // Filtra según filtroTipo
      if (filtroTipo === 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo === 'agencia' && pro.id_cliente != 2298) return false

      // Filtra según tipoList
      if (tipoList === 'abandono' && pro.estado != '1') return false
      if (
        tipoList === 'proceso' &&
          ((pro.fecha_fin != null && pro.fecha_fin != '') ||
            !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList === 'finalizado' &&
          (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList === 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList !== undefined && pro.estado == '1') return false

      // Si pasa todas las condiciones, mantén el elemento
      return true
    })
    // Calcula el total y la lista de proyectos
    const result = filteredProductos.map((pro: any) => {
      const fechaParts = pro.fecha_inicio.split('/')
      if (fechaParts.length === 3) {
        const mes = parseInt(fechaParts[1], 10)
        if (!isNaN(mes) && mes >= 1 && mes <= 12) {
          const precio = parseFloat(pro?.contrato?.precio) || 0

          const tiempoPorColaborador = pro.array_colaboradores[idUser]
          const tiempoTotal = pro.horas_totales

          const porcentajeParticipacion = tiempoTotal > 0
            ? (tiempoPorColaborador?.horas_trabajadas / tiempoTotal) * 100
            : 0

          const precioFinal = tiempoPorColaborador ? (porcentajeParticipacion / 100) * precio : 0

          return {
            id: pro.id,
            community_activo: pro.community_activo,
            nombres: pro.nombres,
            apellidos: pro.apellidos,
            created_at: pro.created_at,
            estado: pro.estado || 'Desconocido',
            fecha_alta: pro.fecha_alta,
            fecha_fin: pro.fecha_fin,
            fecha_inicio: pro.fecha_inicio,
            id_cliente: pro.id_cliente,
            medio_ingreso: pro.medio_ingreso,
            id_contrato: pro.id_contrato,
            nombre_plan: pro.nombre_plan,
            nombre_marca: pro.nombre_marca,
            asignacion: pro.asignacion,
            contrato: pro?.contrato
              ? {
                  id: pro?.contrato.id,
                  precio: pro?.contrato.precio
                } : null,
            precioFinal
          }
        }
      }
      return null
    }).filter((pro: any) => pro !== null) // Elimina elementos nulos

    // Calcula el total sumado
    const total = result.reduce((total: number, pro: any) => total + pro.precioFinal, 0)
    const proyectos = result.filter((pro: any) => pro.precioFinal > 0)
    return { total, proyectos }
  }

  const filterDateTotalConPrecioCM = (idUser?: any, tipoList?: any): { total: number, proyectos: any[] } => {
    let filteredProductos: any = community
    // Filtra los productos según las condiciones dadas
    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false

      // Verifica asignaciones de usuario
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )

      if (!userAssigned) return false

      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth === null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false

      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }

      // Filtra según filtroTipo
      if (filtroTipo === 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo === 'agencia' && pro.id_cliente != 2298) return false

      // Filtra según tipoList
      if (tipoList === 'abandono' && pro.estado != '1') return false
      if (
        tipoList === 'proceso' &&
          ((pro.fecha_fin != null && pro.fecha_fin != '') ||
            !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList === 'finalizado' &&
          (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList === 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList !== undefined && pro.estado == '1') return false

      // Si pasa todas las condiciones, mantén el elemento
      return true
    })
    // Calcula el total y la lista de proyectos
    const result = filteredProductos.map((pro: any) => {
      const fechaParts = pro.fecha_inicio.split('/')
      if (fechaParts.length === 3) {
        const mes = parseInt(fechaParts[1], 10)
        if (!isNaN(mes) && mes >= 1 && mes <= 12) {
          const precio = parseFloat(pro?.contrato?.precio) || 0

          const tiempoPorColaborador = pro.array_colaboradores[idUser]
          const tiempoTotal = pro.horas_totales

          const porcentajeParticipacion = tiempoTotal > 0
            ? (tiempoPorColaborador?.horas_trabajadas / tiempoTotal) * 100
            : 0

          const precioFinal = tiempoPorColaborador ? (porcentajeParticipacion / 100) * precio : 0

          return {
            id: pro.id,
            community_activo: pro.community_activo,
            nombres: pro.nombres,
            apellidos: pro.apellidos,
            created_at: pro.created_at,
            estado: pro.estado || 'Desconocido',
            fecha_alta: pro.fecha_alta,
            fecha_fin: pro.fecha_fin,
            fecha_inicio: pro.fecha_inicio,
            id_cliente: pro.id_cliente,
            medio_ingreso: pro.medio_ingreso,
            id_contrato: pro.id_contrato,
            nombre_plan: pro.nombre_plan,
            nombre_marca: pro.nombre_marca,
            asignacion: pro.asignacion,
            contrato: pro?.contrato
              ? {
                  id: pro?.contrato.id,
                  precio: pro?.contrato.precio
                } : null,
            precioFinal
          }
        }
        if (pro.renovacion) {
          JSON.parse(pro.renovacion).fechas?.forEach((renovacion: any) => {
            const fechaRenovacionParts = renovacion.fecha.split('-')
            if (fechaRenovacionParts.length == 3) {
              const mesRenovacion = parseInt(fechaRenovacionParts[1], 10)
              if (!isNaN(mesRenovacion) && mesRenovacion >= 1 && mesRenovacion <= 12) {
                const precioRenovacion = parseFloat(renovacion.montoPrecio) || 0

                const tiempoPorColaborador = pro.array_colaboradores[idUser]
                const tiempoTotal = pro.horas_totales

                const porcentajeParticipacion = tiempoTotal > 0
                  ? (tiempoPorColaborador?.horas_trabajadas / tiempoTotal) * 100
                  : 0

                const precioFinal = tiempoPorColaborador ? (porcentajeParticipacion / 100) * precioRenovacion : 0

                return {
                  id: pro.id,
                  community_activo: pro.community_activo,
                  nombres: pro.nombres,
                  apellidos: pro.apellidos,
                  created_at: pro.created_at,
                  estado: pro.estado || 'Desconocido',
                  fecha_alta: pro.fecha_alta,
                  fecha_fin: pro.fecha_fin,
                  fecha_inicio: pro.fecha_inicio,
                  id_cliente: pro.id_cliente,
                  medio_ingreso: pro.medio_ingreso,
                  id_contrato: pro.id_contrato,
                  nombre_plan: pro.nombre_plan,
                  nombre_marca: pro.nombre_marca,
                  asignacion: pro.asignacion,
                  contrato: pro?.contrato
                    ? {
                        id: pro?.contrato.id,
                        precio: pro?.contrato.precio
                      } : null,
                  precioFinal
                }
              }
            }
          })
        }
      }
      return null
    }).filter((pro: any) => pro !== null) // Elimina elementos nulos

    // Calcula el total sumado
    const total = result.reduce((total: number, pro: any) => total + pro.precioFinal, 0)
    const proyectos = result.filter((pro: any) => pro.precioFinal > 0)
    return { total, proyectos }
  }

  const filterDateTotalFinalConPrecio = (tipoList?: any): any => {
    let filteredProductos: any = ventas
    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false
      // Verifica asignaciones de usuario
      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth === null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false

      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)

      const isIndividual = asignacionFilter.length == 1
      const isShared = asignacionFilter.length > 1
      if (filtroManejo == 'individual' && !isIndividual) return false
      if (filtroManejo == 'compartidos' && !isShared) return false
      // Filtra según filtroTipo

      if (filtroTipo === 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo === 'agencia' && pro.id_cliente != 2298) return false

      // Filtra según tipoList
      if (tipoList === 'abandono' && pro.estado != '1') return false
      if (
        tipoList === 'proceso' &&
          ((pro.fecha_fin != null && pro.fecha_fin != '') ||
            !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList === 'finalizado' &&
          (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList === 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList !== undefined && pro.estado == '1') return false

      // Si pasa todas las condiciones, mantén el elemento
      return true
    })

    const totalPrecio = filteredProductos.reduce((total: any, pro: any) => {
      const fechaParts = pro.fecha_inicio.split('/')
      if (fechaParts.length === 3) {
        const mes = parseInt(fechaParts[1], 10)
        if (!isNaN(mes) && mes >= 1 && mes <= 12) {
          const precio = parseFloat(pro?.contrato?.precio) || 0

          total += precio
        }
      }
      return total
    }, 0)

    return totalPrecio
  }

  const filterDateTotalFinalConPrecioCM = (tipoList?: any): any => {
    let filteredProductos: any = ventas
    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false
      // Verifica asignaciones de usuario
      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth === null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false

      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)

      const isIndividual = asignacionFilter.length == 1
      const isShared = asignacionFilter.length > 1
      if (filtroManejo == 'individual' && !isIndividual) return false
      if (filtroManejo == 'compartidos' && !isShared) return false
      // Filtra según filtroTipo

      if (filtroTipo === 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo === 'agencia' && pro.id_cliente != 2298) return false

      // Filtra según tipoList
      if (tipoList === 'abandono' && pro.estado != '1') return false
      if (
        tipoList === 'proceso' &&
          ((pro.fecha_fin != null && pro.fecha_fin != '') ||
            !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList === 'finalizado' &&
          (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList === 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList !== undefined && pro.estado == '1') return false

      // Si pasa todas las condiciones, mantén el elemento
      return true
    })

    const totalPrecio = filteredProductos.reduce((total: any, pro: any) => {
      const fechaParts = pro.fecha_inicio.split('/')
      if (fechaParts.length === 3) {
        const mes = parseInt(fechaParts[1], 10)
        if (!isNaN(mes) && mes >= 1 && mes <= 12) {
          const precio = parseFloat(pro?.contrato?.precio) || 0

          total += precio
        }
      }
      return total
    }, 0)

    return totalPrecio
  }

  const filterDateConIGV = (
    idUser?: any,
    tipoList?: any
  ): Record<string, number> => {
    let filteredProductos: any = ventas
    const proyectosPorMes: Record<string, number> = {}
    monthNames.forEach((month) => {
      proyectosPorMes[month] = 0
    })
    filteredProductos = filteredProductos.filter((pro: any) => {
      if (!pro.fecha_inicio || !pro.asignacion) return false
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )
      if (!userAssigned) return false
      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth === null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false

      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }
      if (filtroTipo === 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo === 'agencia' && pro.id_cliente != 2298) return false
      // Filtra según tipoList
      if (tipoList === 'abandono' && pro.estado != '1') return false
      if (
        tipoList === 'proceso' &&
          ((pro.fecha_fin != null && pro.fecha_fin != '') ||
            !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList === 'finalizado' &&
          (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList === 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList !== undefined && pro.estado == '1') return false

      // Si pasa todas las condiciones, mantén el elemento
      return true
    })
    filteredProductos.forEach((pro: any) => {
      const fechaParts = pro.fecha_inicio.split('/')
      if (fechaParts.length === 3) {
        const mes = parseInt(fechaParts[1], 10)
        if (!isNaN(mes) && mes >= 1 && mes <= 12) {
          const nombreMes = monthNames[mes - 1]
          const precio = parseFloat(pro?.contrato?.precio) || 0
          if (pro?.comprobante) {
            try {
              const comprobante = JSON.parse(pro.comprobante)
              if (comprobante.factura === 'Con factura') {
                const igv = precio * 0.18 // Calcular el 18% de IGV
                proyectosPorMes[nombreMes] += igv // Sumar el IGV al mes correspondiente
              }
            } catch (error) {
              console.error('Error parsing JSON in comprobante:', error)
            }
          }
        }
      }
    })
    return proyectosPorMes
  }

  const filterDateConCM = (
    idUser?: any,
    tipoList?: any
  ): Record<string, number> => {
    let filteredProductos: any = community
    const proyectosPorMes: Record<string, number> = {}
    monthNames.forEach((month) => {
      proyectosPorMes[month] = 0
    })
    filteredProductos = filteredProductos.filter((pro: any) => {
      if (!pro.fecha_inicio || !pro.asignacion) return false
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )
      if (!userAssigned) return false
      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth === null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false

      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }
      if (filtroTipo === 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo === 'agencia' && pro.id_cliente != 2298) return false
      // Filtra según tipoList
      if (tipoList === 'abandono' && pro.estado != '1') return false
      if (
        tipoList === 'proceso' &&
          ((pro.fecha_fin != null && pro.fecha_fin != '') ||
            !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList === 'finalizado' &&
          (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList === 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList !== undefined && pro.estado == '1') return false

      // Si pasa todas las condiciones, mantén el elemento
      return true
    })
    filteredProductos.forEach((pro: any) => {
      const fechaParts = pro.fecha_inicio.split('/')
      if (fechaParts.length === 3) {
        const mes = parseInt(fechaParts[1], 10)
        if (!isNaN(mes) && mes >= 1 && mes <= 12) {
          const nombreMes = monthNames[mes - 1]
          const precio = parseFloat(pro?.contrato?.precio) || 0
          if (pro?.comprobante) {
            try {
              const comprobante = JSON.parse(pro.comprobante)
              if (comprobante.factura === 'Con factura') {
                const igv = precio * 0.18 // Calcular el 18% de IGV
                proyectosPorMes[nombreMes] += igv // Sumar el IGV al mes correspondiente
              }
            } catch (error) {
              console.error('Error parsing JSON in comprobante:', error)
            }
          }
        }
      }
    })
    return proyectosPorMes
  }

  const filterDateConIGVDatos = (
    idUser?: any,
    tipoList?: any,
    // @ts-expect-error
    messs: any
  ): Record<string, number> => {
    let filteredProductos: any = ventas
    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false
      // Verifica asignaciones de usuario
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )

      if (!userAssigned) return false
      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth == null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false

      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }
      // Filtra según filtroTipo
      if (filtroTipo == 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo == 'agencia' && pro.id_cliente != 2298) return false

      // Filtra según tipoList
      if (tipoList == 'abandono' && pro.estado != '1') return false

      if (
        tipoList == 'proceso' &&
            ((pro.fecha_fin != null && pro.fecha_fin != '') ||
              !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList == 'finalizado' &&
            (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList == 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList != undefined && pro.estado == '1') return false

      // Si pasa todas las condiciones, mantén el elemento
      return true
    })

    if (messs && messs in monthMap) {
      const monthIndex = monthMap[messs]
      filteredProductos = filteredProductos.filter((pro: any) => {
        const fechaParts = pro.fecha_inicio.split('/')
        if (fechaParts.length === 3) {
          const mes = parseInt(fechaParts[1], 10)
          return mes === monthIndex
        }
        return false
      })
    }

    return filteredProductos.filter((pro: any) => pro?.comprobante && JSON.parse(pro.comprobante).factura == 'Con factura').map((pro: any) => ({
      id: pro.id,
      community_activo: pro.community_activo,
      estado: pro.estado || 'Desconocido',
      nombres: pro.nombres,
      apellidos: pro.apellidos,
      created_at: pro.created_at,
      fecha_alta: pro.fecha_alta,
      fecha_fin: pro.fecha_fin,
      fecha_inicio: pro.fecha_inicio,
      id_cliente: pro.id_cliente,
      medio_ingreso: pro.medio_ingreso,
      id_contrato: pro.id_contrato,
      nombre_plan: pro.nombre_plan,
      nombre_marca: pro.nombre_marca,
      asignacion: pro.asignacion,
      contrato: pro?.contrato
        ? {
            id: pro?.contrato.id,
            precio: pro?.contrato.precio
          } : null
    }))
  }

  const filterDateConIGVDatosCM = (
    idUser?: any,
    tipoList?: any,
    // @ts-expect-error
    messs: any
  ): Record<string, number> => {
    let filteredProductos: any = community
    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false
      // Verifica asignaciones de usuario
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )

      if (!userAssigned) return false
      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth == null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false

      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }
      // Filtra según filtroTipo
      if (filtroTipo == 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo == 'agencia' && pro.id_cliente != 2298) return false

      // Filtra según tipoList
      if (tipoList == 'abandono' && pro.estado != '1') return false

      if (
        tipoList == 'proceso' &&
            ((pro.fecha_fin != null && pro.fecha_fin != '') ||
              !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList == 'finalizado' &&
            (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList == 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList != undefined && pro.estado == '1') return false

      // Si pasa todas las condiciones, mantén el elemento
      return true
    })

    if (messs && messs in monthMap) {
      const monthIndex = monthMap[messs]
      filteredProductos = filteredProductos.filter((pro: any) => {
        const fechaParts = pro.fecha_inicio.split('/')
        if (fechaParts.length === 3) {
          const mes = parseInt(fechaParts[1], 10)
          return mes === monthIndex
        }
        return false
      })
    }

    return filteredProductos.filter((pro: any) => pro?.comprobante && JSON.parse(pro.comprobante).factura == 'Con factura').map((pro: any) => ({
      id: pro.id,
      community_activo: pro.community_activo,
      estado: pro.estado || 'Desconocido',
      nombres: pro.nombres,
      apellidos: pro.apellidos,
      created_at: pro.created_at,
      fecha_alta: pro.fecha_alta,
      fecha_fin: pro.fecha_fin,
      fecha_inicio: pro.fecha_inicio,
      id_cliente: pro.id_cliente,
      medio_ingreso: pro.medio_ingreso,
      id_contrato: pro.id_contrato,
      nombre_plan: pro.nombre_plan,
      nombre_marca: pro.nombre_marca,
      asignacion: pro.asignacion,
      contrato: pro?.contrato
        ? {
            id: pro?.contrato.id,
            precio: pro?.contrato.precio
          } : null
    }))
  }

  const filterDateTotalConIGV = (idUser?: any, tipoList?: any): any => {
    let filteredProductos: any = ventas
    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false
      // Verifica asignaciones de usuario
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )

      if (!userAssigned) return false

      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth === null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false
      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }
      // Filtra según filtroTipo
      if (filtroTipo === 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo === 'agencia' && pro.id_cliente != 2298) return false

      // Filtra según tipoList
      if (tipoList === 'abandono' && pro.estado != '1') return false
      if (
        tipoList === 'proceso' &&
          ((pro.fecha_fin != null && pro.fecha_fin != '') ||
            !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList === 'finalizado' &&
          (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList === 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList !== undefined && pro.estado == '1') return false

      // Si pasa todas las condiciones, mantén el elemento
      return true
    })
    const totalPrecioConIGV = filteredProductos.reduce((total: number, pro: any) => {
      // Verificar si el comprobante existe
      if (pro?.comprobante) {
        try {
          const comprobante = JSON.parse(pro.comprobante)
          // Sumar el IGV si tiene factura
          if (comprobante.factura == 'Con factura') {
            total += parseFloat(pro?.contrato?.precio) * 0.18 // Calcular el IGV (18%)
          }
        } catch (error) {
          console.error('Error parsing JSON in comprobante:', error)
        }
      }
      return total
    }, 0)
    return totalPrecioConIGV
  }

  const filterDateTotalConIGVCM = (idUser?: any, tipoList?: any): any => {
    let filteredProductos: any = community
    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false
      // Verifica asignaciones de usuario
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )

      if (!userAssigned) return false

      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth === null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false
      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }
      // Filtra según filtroTipo
      if (filtroTipo === 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo === 'agencia' && pro.id_cliente != 2298) return false

      // Filtra según tipoList
      if (tipoList === 'abandono' && pro.estado != '1') return false
      if (
        tipoList === 'proceso' &&
          ((pro.fecha_fin != null && pro.fecha_fin != '') ||
            !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList === 'finalizado' &&
          (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList === 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList !== undefined && pro.estado == '1') return false

      // Si pasa todas las condiciones, mantén el elemento
      return true
    })
    const totalPrecioConIGV = filteredProductos.reduce((total: number, pro: any) => {
      // Verificar si el comprobante existe
      if (pro?.comprobante) {
        try {
          const comprobante = JSON.parse(pro.comprobante)
          // Sumar el IGV si tiene factura
          if (comprobante.factura == 'Con factura') {
            total += parseFloat(pro?.contrato?.precio) * 0.18 // Calcular el IGV (18%)
          }
        } catch (error) {
          console.error('Error parsing JSON in comprobante:', error)
        }
      }
      return total
    }, 0)
    return totalPrecioConIGV
  }

  const filterDateTotalConSaldoPendiente = (
    idUser?: any,
    tipoList?: any
  ): any => {
    let filteredProductos: any = ventas
    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false
      // Verifica asignaciones de usuario
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )

      if (!userAssigned) return false

      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth === null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false
      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }
      // Filtra según filtroTipo
      if (filtroTipo === 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo === 'agencia' && pro.id_cliente != 2298) return false

      // Filtra según tipoList
      if (tipoList === 'abandono' && pro.estado != '1') return false
      if (
        tipoList === 'proceso' &&
          ((pro.fecha_fin != null && pro.fecha_fin != '') ||
            !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList === 'finalizado' &&
          (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList === 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList !== undefined && pro.estado == '1') return false

      if (pro?.comprobante) {
        try {
          const comprobante = JSON.parse(pro.comprobante)
          if (comprobante.pendiente > 0) {
            return true
          } else {
            return false
          }
        } catch (error) {
          return false
        }
      }
      return false
    })

    const totalPrecio = filteredProductos.reduce((total: number, pro: any) => {
      const fechaParts = pro.fecha_inicio.split('/')
      if (fechaParts.length === 3) {
        const mes = parseInt(fechaParts[1], 10)
        if (!isNaN(mes) && mes >= 1 && mes <= 12) {
          // Verificar si el comprobante existe
          if (pro?.comprobante) {
            try {
              const comprobante = JSON.parse(pro.comprobante)
              // Verificar si comprobante tiene el campo pendiente y es mayor que 0
              if (comprobante.pendiente > 0) {
                total += Number(comprobante.pendiente)
              }
            } catch (error) {
              console.error('Error parsing JSON in comprobante:', error)
            }
          }
        }
      }
      return total
    }, 0)

    return { filteredProductos, totalPrecio }
  }

  const filterDateTotalMetricas = (idUser: any, tipoList?: any): any => {
    let filteredProductos: any = ventas
    filteredProductos = filteredProductos.filter((pro: any) => {
      if (!pro.fecha_inicio || !pro.asignacion) return false
      const asignacion = JSON.parse(pro.asignacion)
      if (idUser) {
        return asignacion.some((user: any) => user.peso == idUser)
      } else {
        return asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )
      }
    })
    filteredProductos = filteredProductos.filter((pro: any) => {
      const fechaInicio = pro.fecha_inicio
      if (!fechaInicio) {
        return false
      }
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth === null || month == Number(selectedMonth)
      return yearMatches && monthMatches
    })

    if (filtroManejo == 'individual') {
      filteredProductos = filteredProductos.filter((pro: any) => {
        const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser

        if (!isIndividual && idUser) {
          return false
        } else {
          return true
        }
      })
    }
    if (filtroManejo == 'compartidos') {
      filteredProductos = filteredProductos.filter((pro: any) => {
        const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
        const isShared = asignacionFilter.length > 1
        if (!isShared && idUser) {
          return false
        } else {
          return true
        }
      })
    }

    if (filtroTipo == 'clientes') {
      filteredProductos = filteredProductos.filter((pro: any) => {
        return pro.id_cliente != 2298
      })
    }
    if (filtroTipo == 'agencia') {
      filteredProductos = filteredProductos.filter((pro: any) => {
        return pro.id_cliente == 2298
      })
    }
    if (tipoList == 'abandono') {
      filteredProductos = filteredProductos.filter((pro: any) => {
        return pro.estado == '1'
      })
    } else if (tipoList == 'proceso') {
      filteredProductos = filteredProductos.filter(
        (pro: any) =>
          (pro.fecha_fin == null || pro.fecha_fin == '') &&
          pro.fecha_inicio &&
          pro.estado != '1' &&
          pro.community_activo != 'false'
      )
    } else if (tipoList == 'finalizado') {
      filteredProductos = filteredProductos.filter(
        (pro: any) =>
          pro.fecha_fin != null && pro.fecha_fin != '' && pro.estado != '1'
      )
    } else if (tipoList == 'deshabilitado') {
      filteredProductos = filteredProductos.filter(
        (pro: any) => pro.community_activo == 'false' && pro.fecha_fin == null
      )
    } else if (tipoList != undefined) {
      filteredProductos = filteredProductos.filter((pro: any) => {
        return pro.estado != '1'
      })
    }
    return filteredProductos.length
  }

  const filterDateTotalMetricasCM = (idUser: any, tipoList?: any): any => {
    let filteredProductos: any = community
    filteredProductos = filteredProductos.filter((pro: any) => {
      if (!pro.fecha_inicio || !pro.asignacion) return false
      const asignacion = JSON.parse(pro.asignacion)
      if (idUser) {
        return asignacion.some((user: any) => user.peso == idUser)
      } else {
        return asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )
      }
    })
    filteredProductos = filteredProductos.filter((pro: any) => {
      const fechaInicio = pro.fecha_inicio
      if (!fechaInicio) {
        return false
      }
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth === null || month == Number(selectedMonth)
      return yearMatches && monthMatches
    })

    if (filtroManejo == 'individual') {
      filteredProductos = filteredProductos.filter((pro: any) => {
        const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser

        if (!isIndividual && idUser) {
          return false
        } else {
          return true
        }
      })
    }
    if (filtroManejo == 'compartidos') {
      filteredProductos = filteredProductos.filter((pro: any) => {
        const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
        const isShared = asignacionFilter.length > 1
        if (!isShared && idUser) {
          return false
        } else {
          return true
        }
      })
    }

    if (filtroTipo == 'clientes') {
      filteredProductos = filteredProductos.filter((pro: any) => {
        return pro.id_cliente != 2298
      })
    }
    if (filtroTipo == 'agencia') {
      filteredProductos = filteredProductos.filter((pro: any) => {
        return pro.id_cliente == 2298
      })
    }
    if (tipoList == 'abandono') {
      filteredProductos = filteredProductos.filter((pro: any) => {
        return pro.estado == '1'
      })
    } else if (tipoList == 'proceso') {
      filteredProductos = filteredProductos.filter(
        (pro: any) =>
          (pro.fecha_fin == null || pro.fecha_fin == '') &&
          pro.fecha_inicio &&
          pro.estado != '1' &&
          pro.community_activo != 'false'
      )
    } else if (tipoList == 'finalizado') {
      filteredProductos = filteredProductos.filter(
        (pro: any) =>
          pro.fecha_fin != null && pro.fecha_fin != '' && pro.estado != '1'
      )
    } else if (tipoList == 'deshabilitado') {
      filteredProductos = filteredProductos.filter(
        (pro: any) => pro.community_activo == 'false' && pro.fecha_fin == null
      )
    } else if (tipoList != undefined) {
      filteredProductos = filteredProductos.filter((pro: any) => {
        return pro.estado != '1'
      })
    }
    return filteredProductos.length
  }

  function calcularTiempoInvertidoEnProyecto (horario_laboral: any): number {
    let tiempoTotal = 0
    if (horario_laboral && JSON.parse(horario_laboral).length > 0) {
      JSON.parse(horario_laboral).forEach((horario: any) => {
        const startDate = new Date(horario?.start)
        const isInSelectedMonth = selectedMonth === null || (startDate.getMonth() == Number(selectedMonth))
        if (isInSelectedMonth && horario.detalle && getYear(horario.start) == getYear(selectedDate)) {
          Object.values(horario.detalle).forEach((arrayDetalle: any): any => {
            arrayDetalle.forEach((detalleItem: any) => {
              if (detalleItem.proyecto) {
                const fechaInicio = new Date(`2024-03-18 ${detalleItem.horaInicio}`)
                const fechaFin = new Date(`2024-03-18 ${detalleItem.horaFin}`)
                if (!isNaN(fechaInicio.getTime()) && !isNaN(fechaFin.getTime())) {
                  let diffMs = fechaFin.getTime() - fechaInicio.getTime()
                  // Adjust the time if the minutes end in _:59
                  if (detalleItem.horaFin.endsWith(':59')) {
                    diffMs += 60000 // Add one minute in milliseconds
                  }

                  tiempoTotal += diffMs
                }
              }
            })
          })
        }
      })
    }
    const horas = Math.floor(tiempoTotal / (1000 * 60 * 60))
    const minutos = Math.floor((tiempoTotal % (1000 * 60 * 60)) / (1000 * 60))
    return horas * 60 + minutos
  }

  const formatearContrato = (cadena: string): string => {
    const partes = cadena.split('_')
    return partes[0]
  }

  function calcularTiempoInvertidoEnProyectoCommunity (horario_laboral: any): number {
    let tiempoTotal = 0
    if (horario_laboral && JSON.parse(horario_laboral).length > 0) {
      JSON.parse(horario_laboral).forEach((horario: any) => {
        const startDate = new Date(horario?.start)
        const isInSelectedMonth = selectedMonth === null || (startDate.getMonth() == Number(selectedMonth))
        if (isInSelectedMonth && horario.detalle && getYear(horario.start) == getYear(selectedDate)) {
          Object.values(horario.detalle).forEach((arrayDetalle: any): any => {
            arrayDetalle.forEach((detalleItem: any) => {
              if (detalleItem.proyecto) {
                const finalFormat = formatearContrato(detalleItem.proyecto.contrato)
                if (finalFormat == 'LPCME' || finalFormat == 'LPCMC' || finalFormat == 'LPCMS' || finalFormat == 'LPCMG') {
                  const fechaInicio = new Date(`2024-03-18 ${detalleItem.horaInicio}`)
                  const fechaFin = new Date(`2024-03-18 ${detalleItem.horaFin}`)
                  if (!isNaN(fechaInicio.getTime()) && !isNaN(fechaFin.getTime())) {
                    let diffMs = fechaFin.getTime() - fechaInicio.getTime()
                    // Adjust the time if the minutes end in _:59
                    if (detalleItem.horaFin.endsWith(':59')) {
                      diffMs += 60000 // Add one minute in milliseconds
                    }

                    tiempoTotal += diffMs
                  }
                }
              }
            })
          })
        }
      })
    }
    const horas = Math.floor(tiempoTotal / (1000 * 60 * 60))
    const minutos = Math.floor((tiempoTotal % (1000 * 60 * 60)) / (1000 * 60))
    return horas * 60 + minutos
  }

  const TiempoAHoras = (tiempoInvertido: any): string => {
    const horas = Math.floor(tiempoInvertido / 60)
    return `${horas}`
  }

  const handleChange = (date: any): void => {
    setSelectedDate(date)
  }

  const TiempoADias = (totalHoras: number): number => {
    const horasEquivalentes = 60
    return totalHoras / (horasEquivalentes / 6)
  }

  //   ULTIMO
  const calcularProductividadColaboradores = (): any => {
    return colaboradores.map((colaborador: any) => {
      const totalHorasTrabajadas = TiempoAHoras(
        calcularTiempoInvertidoEnProyecto(colaborador.horario_laboral)
      )
      const totalDias = TiempoADias(Number(totalHorasTrabajadas))
      const Proyectos = filterDateTotal(colaborador.id, 'todos')
      const totalProyectosMetricas = filterDateTotalMetricas(colaborador.id)

      let Productividad = 0
      if (totalDias > 0) {
        Productividad = (totalProyectosMetricas / Number(totalDias)) * 100
      }
      const primerNombre = colaborador.name.split(' ')[0]
      return {
        nombre: primerNombre,
        Proyectos,
        Productividad
      }
    })
  }

  // MTETRICAS
  const filterDateGrafico = (idUser?: any, tipoList?: any): any => {
    let filteredProductos: any = ventas
    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false
      // Verifica asignaciones de usuario
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )

      if (!userAssigned) return false

      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth === null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false

      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }
      // Filtra según filtroTipo
      if (filtroTipo === 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo === 'agencia' && pro.id_cliente != 2298) return false

      // Filtra según tipoList
      if (tipoList === 'abandono' && pro.estado != '1') return false
      if (
        tipoList === 'proceso' &&
          ((pro.fecha_fin != null && pro.fecha_fin != '') ||
            !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList === 'finalizado' &&
          (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList === 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList !== undefined && pro.estado == '1') return false

      // Si pasa todas las condiciones, mantén el elemento
      return true
    })
    const proyectosPorMes = monthNames.map((month) => ({
      mes: month,
      total: 0
    }))
    filteredProductos.forEach((pro: any) => {
      const fechaParts = pro.fecha_inicio.split('/')
      if (fechaParts.length === 3) {
        const mes = parseInt(fechaParts[1], 10)
        if (!isNaN(mes) && mes >= 1 && mes <= 12) {
          const nombreMes = monthNames[mes - 1]
          const mesIndex = proyectosPorMes.findIndex(
            (entry) => entry.mes === nombreMes
          )
          if (mesIndex !== -1) {
            proyectosPorMes[mesIndex].total++
          }
        }
      }
    })
    return proyectosPorMes
  }

  const filterDateConPrecioGrafico = (idUser?: any, tipoList?: any): any => {
    let filteredProductos: any = ventas
    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false
      // Verifica asignaciones de usuario
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )

      if (!userAssigned) return false

      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth === null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false
      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }
      // Filtra según filtroTipo
      if (filtroTipo === 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo === 'agencia' && pro.id_cliente != 2298) return false

      // Filtra según tipoList
      if (tipoList === 'abandono' && pro.estado != '1') return false
      if (
        tipoList === 'proceso' &&
          ((pro.fecha_fin != null && pro.fecha_fin != '') ||
            !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList === 'finalizado' &&
          (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList === 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList !== undefined && pro.estado == '1') return false

      // Si pasa todas las condiciones, mantén el elemento
      return true
    })
    const proyectosPorMes: Record<
    string,
    { cantidad: number, totalPrecio: number }
    > = {}
    monthNames.forEach((month) => {
      proyectosPorMes[month] = { cantidad: 0, totalPrecio: 0 }
    })
    // Procesar los proyectos filtrados
    filteredProductos.forEach((pro: any) => {
      const fechaParts = pro.fecha_inicio.split('/')
      if (fechaParts.length === 3) {
        const mes = parseInt(fechaParts[1], 10)
        if (!isNaN(mes) && mes >= 1 && mes <= 12) {
          const nombreMes = monthNames[mes - 1]
          const precio = parseFloat(pro?.contrato?.precio) || 0
          proyectosPorMes[nombreMes].cantidad += 1
          proyectosPorMes[nombreMes].totalPrecio += precio
        }
      }
    })
    // Convertir el objeto a un array
    const resultado = Object.keys(proyectosPorMes).map((mes) => ({
      mes,
      cantidad: proyectosPorMes[mes].cantidad,
      totalPrecio: proyectosPorMes[mes].totalPrecio
    }))

    return resultado
  }

  const filterDatePorEstadosGrafico = (
    idUser?: any,
    _tipoList?: any
  ): Array<{
    month: string
    abandonado: number
    enProceso: number
    finalizado: number
    deshabilitado: number
  }> => {
    let filteredProductos: any = ventas
    filteredProductos = filteredProductos.filter((pro: any) => {
      if (!pro.fecha_inicio || !pro.asignacion) return false
      const asignacion = JSON.parse(pro.asignacion)
      if (idUser) {
        return asignacion.some((user: any) => user.peso == idUser)
      } else {
        return asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )
      }
    })
    if (filtroManejo == 'individual') {
      filteredProductos = filteredProductos.filter((pro: any) => {
        const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        if (!isIndividual && idUser) {
          return false
        } else {
          return true
        }
      })
    }
    if (filtroManejo == 'compartidos') {
      filteredProductos = filteredProductos.filter((pro: any) => {
        const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
        const isShared = asignacionFilter.length > 1
        if (!isShared && idUser) {
          return false
        } else {
          return true
        }
      })
    }

    filteredProductos = filteredProductos.filter((pro: any) => {
      const fechaInicio = pro.fecha_inicio
      if (!fechaInicio) {
        return false
      }
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth === null || month == Number(selectedMonth)
      return yearMatches && monthMatches
    })
    if (filtroTipo == 'clientes') {
      filteredProductos = filteredProductos.filter((pro: any) => {
        return pro.id_cliente != 2298
      })
    }
    if (filtroTipo == 'agencia') {
      filteredProductos = filteredProductos.filter((pro: any) => {
        return pro.id_cliente == 2298
      })
    }
    const proyectosPorMes: Record<
    string,
    {
      abandonado: number
      enProceso: number
      finalizado: number
      deshabilitado: number
    }
    > = {}
    monthNames.forEach((month) => {
      proyectosPorMes[month] = {
        abandonado: 0,
        enProceso: 0,
        finalizado: 0,
        deshabilitado: 0
      }
    })

    filteredProductos.forEach((pro: any) => {
      const fechaParts = pro.fecha_inicio.split('/')
      if (fechaParts.length === 3) {
        const mes = parseInt(fechaParts[1], 10)
        if (!isNaN(mes) && mes >= 1 && mes <= 12) {
          const nombreMes = monthNames[mes - 1]
          if (pro.estado == '1') {
            proyectosPorMes[nombreMes].abandonado++
          } else if (
            (pro.fecha_fin == null || pro.fecha_fin == '') &&
            pro.fecha_inicio &&
            pro.estado != '1' &&
            pro.community_activo != 'false'
          ) {
            proyectosPorMes[nombreMes].enProceso++
          } else if (
            pro.fecha_fin != null &&
            pro.fecha_fin != '' &&
            pro.estado != '1'
          ) {
            proyectosPorMes[nombreMes].finalizado++
          } else if (pro.community_activo == 'false' && pro.fecha_fin == null) {
            proyectosPorMes[nombreMes].deshabilitado++
          }
        }
      }
    })
    const resultado = Object.keys(proyectosPorMes).map((mes) => ({
      month: mes,
      ...proyectosPorMes[mes]
    }))
    return resultado
  }

  const filterDateTotalPostVentaGrafico = (
    idUser?: any,
    tipoList?: any
  ): any => {
    let filteredProductos: any = ventas
    filteredProductos = filteredProductos.filter((pro: any) => {
      // Verifica la existencia de fecha_inicio y asignacion
      if (!pro.fecha_inicio || !pro.asignacion) return false
      // Verifica asignaciones de usuario
      const asignacion = JSON.parse(pro.asignacion)
      const userAssigned = idUser
        ? asignacion.some((user: any) => user.peso == idUser)
        : asignacion.some((user: any) =>
          colaboradores.some((col: any) => col.id == user.peso)
        )

      if (!userAssigned) return false

      // Verifica fechas
      const fechaInicio = pro.fecha_inicio
      const date = parse(fechaInicio, 'dd/MM/yyyy', new Date())
      const year = date.getFullYear()
      const month = date.getMonth()
      const yearMatches = year == getYear(selectedDate)
      const monthMatches = selectedMonth === null || month == Number(selectedMonth)

      if (!(yearMatches && monthMatches)) return false
      const asignacionFilter = JSON.parse(pro.asignacion).filter((user: any) => user.id != null)
      if (idUser) {
        const isIndividual = asignacionFilter.length == 1 && asignacionFilter[0].peso == idUser
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      } else {
        const isIndividual = asignacionFilter.length == 1
        const isShared = asignacionFilter.length > 1
        if (filtroManejo == 'individual' && !isIndividual) return false
        if (filtroManejo == 'compartidos' && !isShared) return false
      }
      // Filtra según filtroTipo
      if (filtroTipo === 'clientes' && pro.id_cliente == 2298) return false
      if (filtroTipo === 'agencia' && pro.id_cliente != 2298) return false

      // Filtra según tipoList
      if (tipoList === 'abandono' && pro.estado != '1') return false
      if (
        tipoList === 'proceso' &&
          ((pro.fecha_fin != null && pro.fecha_fin != '') ||
            !pro.fecha_inicio || pro.estado == '1' || pro.community_activo == 'false')
      ) return false
      if (
        tipoList === 'finalizado' &&
          (pro.fecha_fin == null || pro.fecha_fin == '' || pro.estado == '1')
      ) return false
      if (tipoList === 'deshabilitado' && (pro.community_activo != 'false' || pro.fecha_fin != null)) return false
      if (tipoList !== undefined && pro.estado == '1') return false

      // Si pasa todas las condiciones, mantén el elemento
      return true
    })
    const mediosCount: Record<number, number> = {}
    filteredProductos.forEach((pro: any) => {
      if (pro.medio_ingreso != null) {
        if (!mediosCount[pro.medio_ingreso]) {
          mediosCount[pro.medio_ingreso] = 0
        }
        mediosCount[pro.medio_ingreso]++
      }
    })

    const coloresPastelOscuros: string[] = [
      'rgba(255, 99, 132, 0.5)',
      'rgba(255, 206, 86, 0.5)',
      'rgba(54, 162, 235, 0.5)',
      'rgba(75, 192, 192, 0.5)',
      'rgba(153, 102, 255, 0.5)',
      'rgba(255, 159, 64, 0.5)'
    ]

    const mediosDeIngreso = Object.keys(mediosCount).map(
      (medio: any, index) => ({
        medio_ingreso: parseInt(medio, 10),
        cantidad: mediosCount[medio],
        fill: coloresPastelOscuros[index]
      })
    )
    return {
      total: filteredProductos.length,
      mediosDeIngreso
    }
  }

  useEffect(() => {
    getColaboradores()
  }, [])

  useEffect(() => {
    getColaboradoresYear()
  }, [selectedDate])

  const handleChange222 = (e: any): void => {
    const value = e.target.value
    setSelectedMonth(value === '' ? null : (value))
  }

  /// HOSTING

  function calcularTiempoTotalInvertidoPorHosting (idColaborador: string): number {
    let minutosTotales = 0
    hosting.forEach((host: any) => {
      const soporte = host.soporte ? JSON.parse(host.soporte) : null // Analizamos el string JSON
      if (soporte) {
        soporte.forEach((item: any) => {
          if (item.id_user == idColaborador) {
            const minutosSoporte = Number(item.horas) || 0
            minutosTotales += minutosSoporte // Sumamos los minutos al total
          }
        })
      }
    })
    return minutosTotales // Retornamos el total de minutos
  }

  const filterDateHosting = (idUser?: any): Record<string, number> => {
    let filteredProductos: any = hosting
    filteredProductos = filteredProductos.filter((pro: any) => {
      const asignacion = pro.soporte ? JSON.parse(pro.soporte) : null // Analizamos el string JSON
      // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
      return asignacion && asignacion.some((user: any) => user.id_user == idUser)
    })
    const proyectosPorMes: Record<string, number> = {}
    monthNames.forEach((month) => {
      proyectosPorMes[month] = 0
    })
    filteredProductos.forEach((pro: any) => {
      const asignacion = pro.soporte ? JSON.parse(pro.soporte) : null // Obtener soporte
      if (asignacion) {
        asignacion.forEach((soporteItem: any) => {
          if (soporteItem.id_user == idUser) {
            const fechaParts = soporteItem.fecha.split('/') // Partir la fecha
            if (fechaParts.length == 3) {
              const mes = parseInt(fechaParts[1], 10) // Obtener el mes
              if (!isNaN(mes) && mes >= 1 && mes <= 12) {
                const nombreMes = monthNames[mes - 1] // Obtener el nombre del mes
                proyectosPorMes[nombreMes]++ // Incrementar el contador para el mes correspondiente
              }
            }
          }
        })
      }
    })
    return proyectosPorMes
  }

  const filterDateHostingConDatos = (idUser?: any, mes?: any): { proyectos: any[], total: number } => {
    let filteredProductos: any = hosting
    filteredProductos = filteredProductos.filter((pro: any) => {
      const asignacion = pro.soporte ? JSON.parse(pro.soporte) : null // Analizamos el string JSON
      return asignacion && asignacion.some((user: any) => user.id_user == idUser)
    })

    if (mes && mes in monthMap) {
      const monthIndex = monthMap[mes]
      filteredProductos = filteredProductos.filter((pro: any) => {
        const asignacion = pro.soporte ? JSON.parse(pro.soporte) : null // Obtener soporte
        if (asignacion) {
          return asignacion.some((soporteItem: any) => {
            if (soporteItem.id_user == idUser) {
              const fechaParts = soporteItem.fecha.split('/') // Partir la fecha
              if (fechaParts.length == 3) {
                const mesItem = parseInt(fechaParts[1], 10) // Obtener el mes
                return mesItem === monthIndex // Compara el mes
              }
            }
            return false
          })
        }
        return false
      })
    }

    const proyectosFiltrados = filteredProductos.map((pro: any) => ({
      id: pro.id,
      correlativo: pro.correlativo,
      id_venta: pro.id_venta,
      id_cliente: pro.id_cliente,
      hosting: pro.hosting,
      activehosting: pro.activehosting,
      correos: pro.correos,
      obsequios: pro.obsequios,
      soporte: pro.soporte,
      created_at: pro.created_at,
      updated_at: pro.updated_at
    }))

    return { proyectos: proyectosFiltrados, total: proyectosFiltrados.length } // Retorna la lista y el total
  }

  const filterDateHostinTotal = (idUser?: any): number => {
    let filteredProductos: any = hosting
    let totalSoportes = 0 // Variable para contar el total de soportes
    filteredProductos = filteredProductos.filter((pro: any) => {
      const asignacion = pro.soporte ? JSON.parse(pro.soporte) : null // Analizamos el string JSON
      // eslint-disable-next-line @typescript-eslint/prefer-optional-chain
      return asignacion && asignacion.some((user: any) => user.id_user == idUser)
    })
    filteredProductos.forEach((pro: any) => {
      const asignacion = pro.soporte ? JSON.parse(pro.soporte) : null // Obtener soporte
      if (asignacion) {
        asignacion.forEach((soporteItem: any) => {
          if (soporteItem.id_user == idUser) {
            totalSoportes++ // Incrementar el contador total de soportes
          }
        })
      }
    })
    return totalSoportes
  }

  const filterDateHostinTotalConDatos = (idUser?: any): any[] => {
    let filteredProductos: any = hosting // Mantener la referencia a los productos
    filteredProductos = filteredProductos.filter((pro: any) => {
      const asignacion = pro.soporte ? JSON.parse(pro.soporte) : null // Analizamos el string JSON
      return asignacion && asignacion.some((user: any) => user.id_user == idUser) // Filtramos por usuario
    })

    // Retornamos todos los proyectos que cumplen el filtro
    return filteredProductos.map((pro: any) => ({
      id: pro.id,
      correlativo: pro.correlativo,
      id_venta: pro.id_venta,
      id_cliente: pro.id_cliente,
      hosting: pro.hosting,
      activehosting: pro.activehosting,
      correos: pro.correos,
      obsequios: pro.obsequios,
      soporte: pro.soporte,
      created_at: pro.created_at,
      updated_at: pro.updated_at
    }))
  }

  const filterDateHostingTotal = (): Record<string, number> => {
    const filteredProductos: any = hosting

    const proyectosPorMes: Record<string, number> = {}
    monthNames.forEach((month) => {
      proyectosPorMes[month] = 0
    })

    filteredProductos.forEach((pro: any) => {
      const asignacion = pro.soporte ? JSON.parse(pro.soporte) : null // Obtener soporte
      if (asignacion) {
        asignacion.forEach((soporteItem: any) => {
          const fechaParts = soporteItem.fecha.split('/') // Partir la fecha
          if (fechaParts.length == 3) {
            const mes = parseInt(fechaParts[1], 10) // Obtener el mes
            if (!isNaN(mes) && mes >= 1 && mes <= 12) {
              const nombreMes = monthNames[mes - 1] // Obtener el nombre del mes
              proyectosPorMes[nombreMes]++ // Incrementar el contador para el mes correspondiente
            }
          }
        })
      }
    })

    return proyectosPorMes
  }

  const filterDateHostingConDatosTotal = (mes?: any): { proyectos: any[], total: number } => {
    let filteredProductos: any = hosting

    if (mes && mes in monthMap) {
      const monthIndex = monthMap[mes]
      filteredProductos = filteredProductos.filter((pro: any) => {
        const asignacion = pro.soporte ? JSON.parse(pro.soporte) : null // Obtener soporte
        if (asignacion) {
          return asignacion.some((soporteItem: any) => {
            const fechaParts = soporteItem.fecha.split('/') // Partir la fecha
            if (fechaParts.length == 3) {
              const mesItem = parseInt(fechaParts[1], 10) // Obtener el mes
              return mesItem === monthIndex // Compara el mes
            }
            return false
          })
        }
        return false
      })
    }

    const proyectosFiltrados = filteredProductos.map((pro: any) => ({
      id: pro.id,
      correlativo: pro.correlativo,
      id_venta: pro.id_venta,
      id_cliente: pro.id_cliente,
      hosting: pro.hosting,
      activehosting: pro.activehosting,
      correos: pro.correos,
      obsequios: pro.obsequios,
      soporte: pro.soporte,
      created_at: pro.created_at,
      updated_at: pro.updated_at
    }))

    return { proyectos: proyectosFiltrados, total: proyectosFiltrados.length } // Retorna la lista y el total
  }

  const filterDateHostinTotalConDatosFinal = (): any[] => {
    const filteredProductos: any = hosting // Mantener la referencia a los productos
    // Retornamos todos los proyectos que cumplen el filtro
    return filteredProductos.map((pro: any) => ({
      id: pro.id,
      correlativo: pro.correlativo,
      id_venta: pro.id_venta,
      id_cliente: pro.id_cliente,
      hosting: pro.hosting,
      activehosting: pro.activehosting,
      correos: pro.correos,
      obsequios: pro.obsequios,
      soporte: pro.soporte,
      created_at: pro.created_at,
      updated_at: pro.updated_at
    }))
  }

  //   const filterDateHostingConPrecio = (idUser?: any): Record<string, number> => {
  //     let filteredProductos: any = hosting
  //     filteredProductos = filteredProductos.filter((pro: any) => {
  //       const asignacion = pro.soporte ? JSON.parse(pro.soporte) : null // Analizamos el string JSON
  //       return asignacion && asignacion.some((user: any) => user.id_user == idUser) // Filtramos por usuario
  //     })

  //     const proyectosPorMes: Record<string, { cantidad: number, totalPrecio: number }> = {}
  //     monthNames.forEach((month) => {
  //       proyectosPorMes[month] = { cantidad: 0, totalPrecio: 0 } // Inicializamos contador y totalPrecio
  //     })

  //     // Inicializar un objeto para almacenar el tiempo total

  //     // Primero, recorremos todos los productos filtrados para calcular el tiempo total
  //     // filteredProductos.forEach((pro: any) => {
  //     //   const asignacion = pro.soporte ? JSON.parse(pro.soporte) : null // Obtener soporte
  //     //   if (asignacion) {
  //     //     asignacion.forEach((soporteItem: any) => {
  //     //       tiempoTotal += soporteItem.horas // Sumar todas las horas de todos los colaboradores
  //     //     })
  //     //   }
  //     // })

  //     filteredProductos.forEach((pro: any) => {
  //       const asignacion = pro.soporte ? JSON.parse(pro.soporte) : null // Obtener soporte
  //       const hosting = pro.hosting ? JSON.parse(pro.hosting) : null
  //       if (asignacion) {
  //         asignacion.forEach((soporteItem: any) => {
  //           let tiempoTotal = 0
  //           tiempoTotal += soporteItem.horas // Sumar todas las horas de todos los colaboradores
  //           if (soporteItem.id_user == idUser) {
  //             const fechaParts = soporteItem.fecha.split('/') // Partir la fecha
  //             if (fechaParts.length == 3) {
  //               const mes = parseInt(fechaParts[1], 10) // Obtener el mes
  //               if (!isNaN(mes) && mes >= 1 && mes <= 12) {
  //                 const nombreMes = monthNames[mes - 1] // Obtener el nombre del mes
  //                 let precioReferencia = (Number(hosting.montoC) - Number(hosting.montoP))
  //                 const fechas = hosting.fechas || [] // Obtener fechas
  //                 if (fechas.length > 0) {
  //                   const ultimaFecha = fechas[fechas.length - 1]
  //                   const tiempoPorColaborador = soporteItem.horas
  //                   console.log('id' + pro.id)
  //                   console.log(tiempoPorColaborador)
  //                   console.log(tiempoTotal)
  //                   const porcentajeParticipacion = tiempoTotal > 0
  //                     ? (tiempoPorColaborador / tiempoTotal) * 100
  //                     : 0
  //                   precioReferencia = (Number(ultimaFecha.precio) - Number(hosting.montoP)) * (porcentajeParticipacion / 100)
  //                 }
  //                 proyectosPorMes[nombreMes].totalPrecio += precioReferencia
  //               }
  //             }
  //           }
  //         })
  //       }
  //     })
  //     const resultadosFinales: Record<string, number> = {}
  //     for (const mes in proyectosPorMes) {
  //       resultadosFinales[mes] = proyectosPorMes[mes].totalPrecio // Solo guardar el total
  //     }
  //     return resultadosFinales // Retornar los resultados finales
  //   }

  //   const filterDateHostingConPrecioTotal = (idUser?: any): { totalPrecio: number, proyectos: any[] } => {
  //     let filteredProductos: any = hosting
  //     filteredProductos = filteredProductos.filter((pro: any) => {
  //       const asignacion = pro.soporte ? JSON.parse(pro.soporte) : null // Analizar el string JSON
  //       return asignacion && asignacion.some((user: any) => user.id_user == idUser) // Filtrar por usuario
  //     })

  //     let totalPrecio = 0

  //     filteredProductos.forEach((pro: any) => {
  //       const asignacion = pro.soporte ? JSON.parse(pro.soporte) : null
  //       const hosting = pro.hosting ? JSON.parse(pro.hosting) : null

  //       if (asignacion) {
  //         let tiempoTotal = 0
  //         asignacion.forEach((soporteItem: any) => {
  //           tiempoTotal += soporteItem.horas // Sumar todas las horas de todos los colaboradores
  //         })

  //         asignacion.forEach((soporteItem: any) => {
  //           if (soporteItem.id_user == idUser) {
  //             let precioReferencia = (Number(hosting.montoC) - Number(hosting.montoP))
  //             const fechas = hosting.fechas || [] // Obtener fechas

  //             if (fechas.length > 0) {
  //               const ultimaFecha = fechas[fechas.length - 1]
  //               const tiempoPorColaborador = soporteItem.horas
  //               const porcentajeParticipacion = tiempoTotal > 0
  //                 ? (tiempoPorColaborador / tiempoTotal) * 100
  //                 : 0
  //               precioReferencia = (Number(ultimaFecha.precio) - Number(hosting.montoP)) * (porcentajeParticipacion / 100)
  //             }

  //             totalPrecio += precioReferencia
  //           }
  //         })
  //       }
  //     })

  //     return {
  //       totalPrecio,
  //       proyectos: filteredProductos // Retornar el array de proyectos filtrados
  //     }
  //   }

  //   const filterDateHostingConPrecioTotalPerMes = (): Record<string, number> => {
  //     const filteredProductos: any = hosting

  //     const proyectosPorMes: Record<string, { cantidad: number, totalPrecio: number }> = {}
  //     monthNames.forEach((month) => {
  //       proyectosPorMes[month] = { cantidad: 0, totalPrecio: 0 } // Inicializamos contador y totalPrecio
  //     })

  //     filteredProductos.forEach((pro: any) => {
  //       const asignacion = pro.soporte ? JSON.parse(pro.soporte) : null // Obtener soporte
  //       const hosting = pro.hosting ? JSON.parse(pro.hosting) : null
  //       if (asignacion) {
  //         asignacion.forEach((soporteItem: any) => {
  //           let tiempoTotal = 0
  //           tiempoTotal += soporteItem.horas // Sumar todas las horas de todos los colaboradores
  //           const fechaParts = soporteItem.fecha.split('/') // Partir la fecha
  //           if (fechaParts.length == 3) {
  //             const mes = parseInt(fechaParts[1], 10) // Obtener el mes
  //             if (!isNaN(mes) && mes >= 1 && mes <= 12) {
  //               const nombreMes = monthNames[mes - 1] // Obtener el nombre del mes
  //               let precioReferencia = (Number(hosting.montoC) - Number(hosting.montoP))
  //               const fechas = hosting.fechas || [] // Obtener fechas
  //               if (fechas.length > 0) {
  //                 const ultimaFecha = fechas[fechas.length - 1]
  //                 const tiempoPorColaborador = soporteItem.horas
  //                 console.log('id' + pro.id)
  //                 console.log(tiempoPorColaborador)
  //                 console.log(tiempoTotal)
  //                 const porcentajeParticipacion = tiempoTotal > 0
  //                   ? (tiempoPorColaborador / tiempoTotal) * 100
  //                   : 0
  //                 precioReferencia = (Number(ultimaFecha.precio) - Number(hosting.montoP)) * (porcentajeParticipacion / 100)
  //               }
  //               proyectosPorMes[nombreMes].totalPrecio += precioReferencia
  //             }
  //           }
  //         })
  //       }
  //     })
  //     const resultadosFinales: Record<string, number> = {}
  //     for (const mes in proyectosPorMes) {
  //       resultadosFinales[mes] = proyectosPorMes[mes].totalPrecio // Solo guardar el total
  //     }
  //     return resultadosFinales // Retornar los resultados finales
  //   }

  return (
    <>
      <section className="w-full h-screen relative overflow-x-hidden overflow-y-auto bg-gray-100 p-6">
        {!loading ? (
          <>
            {/* PRIMER CUADRO */}
            <div className="flex justify-end mb-4">
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-black font-bold">
                  Manejo de clientes
                </label>
                <select
                  className="bg-gray-400 mr-3 h-full rounded-md px-2 text-white font-bold"
                  value={filtroManejo}
                  onChange={(e) => {
                    setFiltroManejo(e.target.value)
                  }}
                >
                  <option value="todos">Todos</option>
                  <option value="individual">Individual</option>
                  <option value="compartidos">Compartidos</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <label htmlFor="" className="text-black font-bold">
                  Tipo
                </label>
                <select
                  className="bg-gray-400 mr-3 h-full rounded-md px-2 text-white font-bold"
                  value={filtroTipo}
                  onChange={(e) => {
                    setFiltroTipo(e.target.value)
                  }}
                >
                  <option value="clientes">Clientes</option>
                  <option value="agencia">Agencia</option>
                  <option value="todos">Todos</option>
                </select>
              </div>
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
                <select name="" id=""
                className='bg-green-600 h-full text-white rounded-md'
                onChange={handleChange222}
                >
                    <option value="">Seleccionar</option>
                    {monthNames2.map((a, index: number) => (
                    <option
                        value={index}
                        className={cn('md:text-center lowercase first-letter:uppercase', selectedMonth == String(index) ? 'bg-red-600' : '')}
                        key={index}
                    >
                        {a}
                    </option>
                    ))}
                </select>
              </div>
            </div>
            <div className="md:bg-[#1482AB]  rounded-md">
              <div className="hidden md:grid grid-cols-19 items-center  md:py-2 text-white font-bold">
                <h5 className="md:text-center lowercase first-letter:uppercase col-span-2">
                  COLABORADOR
                </h5>
                <h5 className="md:text-center lowercase first-letter:uppercase">
                  HORAS TRABAJADAS
                </h5>
                {monthNames.map((a, index: number) => (
                  <h5
                    className={cn('md:text-center lowercase first-letter:uppercase', selectedMonth == String(index) ? 'bg-red-600' : '')}
                    key={index}
                  >
                    {a}
                  </h5>
                ))}
                <h5 className="md:text-center lowercase first-letter:uppercase">
                  TOTAL PROYECTOS
                </h5>
                <h5 className="md:text-center lowercase first-letter:uppercase">
                  ESCALA DE EFECTIVIDAD
                </h5>
                <h5 className="md:text-center lowercase first-letter:uppercase col-span-2">
                  PRODUCTIVIDAD %
                </h5>
              </div>
            </div>
            <div className="md:bg-[#F2F2F2] my-1 rounded-md">
              {colaboradores
                // .slice() // Hacer una copia del array original para no modificarlo directamente
                .sort((a: any, b: any) => {
                  const productividadA =
                    (filterDateTotalMetricas(a.id) /
                      TiempoADias(
                        Number(
                          TiempoAHoras(
                            calcularTiempoInvertidoEnProyecto(a.horario_laboral)
                          )
                        )
                      )) *
                    100
                  const productividadB =
                    (filterDateTotalMetricas(b.id) /
                      TiempoADias(
                        Number(
                          TiempoAHoras(
                            calcularTiempoInvertidoEnProyecto(b.horario_laboral)
                          )
                        )
                      )) *
                    100

                  return productividadB - productividadA
                })
                .map((colaborador: any, index: any) => {
                  const totalHorasTrabajadas2 = TiempoAHoras(
                    calcularTiempoInvertidoEnProyecto(
                      colaborador.horario_laboral
                    )
                  )
                  const totalHorasTrabajadas1 = TiempoAHoras(
                    calcularTiempoTotalInvertidoPorHosting(
                      colaborador.id
                    )
                  )
                  const totalHorasTrabajadas = Number(totalHorasTrabajadas2) + Number(totalHorasTrabajadas1)
                  const totalDias = TiempoADias(Number(totalHorasTrabajadas))
                  const totalProyectos = filterDateTotal(
                    colaborador.id,
                    'todos'
                  )
                  // CUENTA APARTIR DE MARZO DEL 2024 QUE FUE CUANDO EMPEZO EL HORARIO LABORAL
                  const totalProyectosMetricas = filterDateTotalMetricas(
                    colaborador.id
                  )
                  let productividadCalculada = 0
                  if (totalDias > 0) {
                    productividadCalculada =
                      (totalProyectosMetricas / Number(totalDias)) * 100
                  }
                  return (
                    <div
                      key={colaborador.id}
                      className="hidden md:grid grid-cols-19 my-1 items-center border border-black rounded-md overflow-hidden text-black "
                    >
                      <div className="lowercase bg-[#9FC0D5] w-full h-full flex items-center col-span-2 font-bold px-2">
                        <span className="first-letter:uppercase">
                          {colaborador.name}
                        </span>
                      </div>
                      <div className="lowercase bg-[#77CDEE] w-full h-full flex items-center justify-center font-bold px-2">
                        <span className="first-letter:uppercase ">
                          {totalHorasTrabajadas} H
                        </span>
                      </div>
                      {monthNames.map((mes, index: number) => (
                        <Link to='/admin/dashboard/colaboradores-result'
                          target='_blank'
                          className={cn(
                            'md:text-center  lowercase first-letter:uppercase  transition-colors cursor-pointer font-medium h-full flex items-center justify-center',
                            filterDate(colaborador.id, 'todos')[mes] != 0
                              ? 'bg-[#D0E7F7] hover:bg-[#b0c4d2]'
                              : ''
                          )}
                          key={index}
                          onClick={() => {
                            const prefix = 'metricasColaboradores_chunk_'
                            Object.keys(localStorage).forEach(key => {
                              if (key.startsWith(prefix)) {
                                localStorage.removeItem(key)
                              }
                            })
                            const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                            const estadoFinal = {
                              estado: true,
                              ventas: filterDateDatos(colaborador.id, 'todos', mes),
                              filteredColaboradores,
                              precios: 'no'
                            }
                            const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                            const estadoFinalString = JSON.stringify(estadoFinal)
                            for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                              const chunk = estadoFinalString.slice(i, i + chunkSize)
                              localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                            }
                          }}
                        >
                          {filterDate(colaborador.id, 'todos')[mes] || null}
                        </Link>
                      ))}
                      <Link to='/admin/dashboard/colaboradores-result' target='_blank' className={`md:text-center lowercase first-letter:uppercase bg-[#74B5E4] h-full flex items-center justify-center font-medium  transition-colors cursor-pointer ${filterDateTotalDatos(colaborador.id, 'todos').length > 0 ? 'hover:bg-[#1482AB]' : ''}`}
                      onClick={() => {
                        const prefix = 'metricasColaboradores_chunk_'
                        Object.keys(localStorage).forEach(key => {
                          if (key.startsWith(prefix)) {
                            localStorage.removeItem(key)
                          }
                        })
                        const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                        const estadoFinal = {
                          estado: true,
                          ventas: filterDateTotalDatos(colaborador.id, 'todos'),
                          filteredColaboradores,
                          precios: 'no'
                        }
                        const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                        const estadoFinalString = JSON.stringify(estadoFinal)
                        for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                          const chunk = estadoFinalString.slice(i, i + chunkSize)
                          localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                        }
                      }}
                      >
                        {totalProyectos}
                      </Link>
                      <h5
                        className={cn(
                          'md:text-center lowercase first-letter:uppercase bg-[#FFFF99] py-2 h-full flex items-center justify-center font-medium',
                          index + 1 <= 3 ? 'text-red-600 text-lg' : ''
                        )}
                      >
                        {index + 1}
                      </h5>
                      <div className="md:text-center lowercase first-letter:uppercase col-span-2 gap-2 bg-[#9FC8C6] h-full flex items-center justify-center font-medium">
                        {productividadCalculada > 110 ? (
                          <FaLeftLong className="text-green-700 rotate-90" />
                        ) : productividadCalculada < 60 ? (
                          <FaLeftLong className="text-red-700 -rotate-90" />
                        ) : (
                          <FaLeftLong className="text-yellow-600 rotate-180" />
                        )}
                        <span>{productividadCalculada.toFixed(2)} %</span>
                      </div>
                    </div>
                  )
                })}
              <div className="hidden md:grid grid-cols-19 items-center border border-black rounded-md overflow-hidden text-black ">
                <div className="lowercase bg-[#328B71] w-full h-full flex items-center col-span-3 font-bold px-2">
                  <span className="first-letter:uppercase text-white text-lg">
                    TOTAL PROYECTOS
                  </span>
                </div>
                {monthNames.map((mes, index: number) => (
                  <Link to='/admin/dashboard/colaboradores-result'
                    target='_blank'
                    className={cn(
                      'md:text-center lowercase first-letter:uppercase bg-[#8CD7C0]  transition-colors cursor-pointer font-medium h-full flex items-center justify-center',
                      filterDateDatos(null, 'todos', mes).length > 0 ? 'hover:bg-[#328B71]' : ''
                    )}
                    key={index}
                    onClick={() => {
                      const prefix = 'metricasColaboradores_chunk_'
                      Object.keys(localStorage).forEach(key => {
                        if (key.startsWith(prefix)) {
                          localStorage.removeItem(key)
                        }
                      })
                      const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                      const estadoFinal = {
                        estado: true,
                        ventas: filterDateDatos(null, 'todos', mes),
                        filteredColaboradores,
                        precios: 'no'
                      }
                      const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                      const estadoFinalString = JSON.stringify(estadoFinal)
                      for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                        const chunk = estadoFinalString.slice(i, i + chunkSize)
                        localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                      }
                    }}
                      >
                        {filterDate(null, 'todos')[mes] || null}
                      </Link>
                ))}
                <h5
                  className={cn(
                    'md:text-center lowercase first-letter:uppercase bg-[#FFC000] hover:bg-[#AA8000] transition-colors cursor-pointer font-medium h-full flex items-center justify-center'
                  )}
                  onClick={() => {
                    const prefix = 'metricasColaboradores_chunk_'
                    Object.keys(localStorage).forEach(key => {
                      if (key.startsWith(prefix)) {
                        localStorage.removeItem(key)
                      }
                    })
                    const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                    const estadoFinal = {
                      estado: true,
                      ventas: filterDateTotalDatos(null, 'todos'),
                      filteredColaboradores,
                      precios: 'no'
                    }
                    const chunkSize = 5000
                    const estadoFinalString = JSON.stringify(estadoFinal)
                    for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                      const chunk = estadoFinalString.slice(i, i + chunkSize)
                      localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                    }
                  }}
                >
                  {filterDateTotal(null, 'todos')}
                </h5>
              </div>
            </div>
            {/* SEGUNDO CUADRO */}
            <div className="mt-10">
              <div className="grid grid-cols-19">
                <div className="hidden col-span-16 bg-[#1482AB] rounded-md rounded-r-none md:grid grid-cols-16 items-center  md:py-2 text-white font-bold">
                  <h5 className="md:text-center lowercase first-letter:uppercase col-span-2">
                    Colaborador
                  </h5>
                  <h5 className="md:text-center lowercase first-letter:uppercase">
                    Horas Trabajadas
                  </h5>
                  {monthNames.map((a, index: number) => (
                    <h5
                      className="md:text-center lowercase first-letter:uppercase"
                      key={index}
                    >
                      {a}
                    </h5>
                  ))}
                  <h5 className="md:text-center lowercase first-letter:uppercase">
                    TOTAL S/.
                  </h5>
                </div>
                <div className="col-span-3 grid grid-cols-3">
                  <h5 className="md:text-center h-full flex bg-[#1482AB] rounded-r-md text-white font-bold items-center justify-center col-span-1">
                    Saldo pendiente
                  </h5>
                  <h5 className="col-span-2"></h5>
                </div>
              </div>
            </div>
            <div className="mt-0">
              <div className="grid grid-cols-19">
                <div className="md:bg-[#F2F2F2] col-span-17 my-1 rounded-md">
                  {colaboradores
                    .slice() // Hacer una copia del array original para no modificarlo directamente
                    .sort((a: any, b: any) => {
                      const productividadA =
                          (filterDateTotalMetricas(a.id) /
                            TiempoADias(
                              Number(
                                TiempoAHoras(
                                  calcularTiempoInvertidoEnProyecto(a.horario_laboral)
                                )
                              )
                            )) *
                          100
                      const productividadB =
                          (filterDateTotalMetricas(b.id) /
                            TiempoADias(
                              Number(
                                TiempoAHoras(
                                  calcularTiempoInvertidoEnProyecto(b.horario_laboral)
                                )
                              )
                            )) *
                          100

                      return productividadB - productividadA
                    })
                    .map((colaborador: any, _index: any) => {
                      const totalHorasTrabajadas2 = TiempoAHoras(
                        calcularTiempoInvertidoEnProyecto(
                          colaborador.horario_laboral
                        )
                      )
                      const totalHorasTrabajadas1 = TiempoAHoras(
                        calcularTiempoTotalInvertidoPorHosting(
                          colaborador.id
                        )
                      )
                      const totalHorasTrabajadas = Number(totalHorasTrabajadas2) + Number(totalHorasTrabajadas1)
                      return (
                        <div
                          key={colaborador.id}
                          className="hidden md:grid grid-cols-17 my-1 items-center border border-black rounded-md overflow-hidden text-black "
                        >
                          <div className="lowercase bg-[#9FC0D5] w-full h-full flex items-center col-span-2 font-bold px-2">
                            <span className="first-letter:uppercase">
                              {colaborador.name}
                            </span>
                          </div>
                          <div className="lowercase bg-[#77CDEE] w-full h-full flex items-center justify-center font-bold px-2">
                            <span className="first-letter:uppercase ">
                              {totalHorasTrabajadas} H
                            </span>
                          </div>
                          {monthNames.map((mes, index: number) => (
                            <Link to='/admin/dashboard/colaboradores-result'
                              target='_blank'
                              className={cn(
                                'md:text-center  py-2 transition-colors text-sm cursor-pointer font-medium h-full flex items-center justify-center',
                                filterDateConPrecio(colaborador.id, 'todos')[
                                  mes
                                ] != 0
                                  ? 'bg-[#D0E7F7] hover:bg-[#1482AB]'
                                  : ''
                              )}
                              key={index}
                              onClick={() => {
                                const prefix = 'metricasColaboradores_chunk_'
                                Object.keys(localStorage).forEach(key => {
                                  if (key.startsWith(prefix)) {
                                    localStorage.removeItem(key)
                                  }
                                })
                                const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                                const estadoFinal = {
                                  estado: true,
                                  ventas: filterDateConPrecioDatos(colaborador.id, 'todos', mes),
                                  filteredColaboradores,
                                  precios: 'si'
                                }
                                const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                                const estadoFinalString = JSON.stringify(estadoFinal)
                                for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                                  const chunk = estadoFinalString.slice(i, i + chunkSize)
                                  localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                                }
                              }}
                            >
                              {filterDateConPrecio(colaborador.id, 'todos')[
                                mes
                              ] || null
                                ? `S/ ${
                                    (filterDateConPrecio(
                                      colaborador.id,
                                      'todos'
                                    )[mes] || null)?.toFixed(2)
                                  }`
                                : null}
                            </Link>
                          ))}
                          <Link to='/admin/dashboard/colaboradores-result' target='_blank' className={cn('md:text-center bg-[#74B5E4] py-2 text-sm h-full flex items-center justify-center font-medium transition-colors cursor-pointer', (filterDateTotalConPrecio(
                            colaborador.id,
                            'todos'
                          ) || 0).proyectos.length > 0 ? 'hover:bg-[#1482AB]' : '')}
                            onClick={() => {
                              const prefix = 'metricasColaboradores_chunk_'
                              Object.keys(localStorage).forEach(key => {
                                if (key.startsWith(prefix)) {
                                  localStorage.removeItem(key)
                                }
                              })
                              const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                              const estadoFinal = {
                                estado: true,
                                ventas: filterDateTotalConPrecio(
                                  colaborador.id,
                                  'todos'
                                ).proyectos,
                                filteredColaboradores,
                                precios: 'si'
                              }
                              const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                              const estadoFinalString = JSON.stringify(estadoFinal)
                              for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                                const chunk = estadoFinalString.slice(i, i + chunkSize)
                                localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                              }
                            }}
                            >
                            S/{' '}
                            {(filterDateTotalConPrecio(
                              colaborador.id,
                              'todos'
                            ) || 0).total.toFixed(2)}
                          </Link>
                          <Link to='/admin/dashboard/colaboradores-result' target='_blank' className={cn('md:text-center bg-[#D0E7F7] py-2 text-sm h-full flex items-center transition-colors justify-center font-medium', (filterDateTotalConSaldoPendiente(
                            colaborador.id,
                            'todos'
                          ) || 0).filteredProductos.length > 0 ? 'hover:bg-[#77CDEE]' : '')}

                           onClick={() => {
                             const prefix = 'metricasColaboradores_chunk_'
                             Object.keys(localStorage).forEach(key => {
                               if (key.startsWith(prefix)) {
                                 localStorage.removeItem(key)
                               }
                             })
                             const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                             const estadoFinal = {
                               estado: true,
                               ventas: (filterDateTotalConSaldoPendiente(
                                 colaborador.id,
                                 'todos'
                               ) || 0).filteredProductos,
                               filteredColaboradores,
                               precios: 'pendiente'
                             }
                             const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                             const estadoFinalString = JSON.stringify(estadoFinal)
                             for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                               const chunk = estadoFinalString.slice(i, i + chunkSize)
                               localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                             }
                           }}
                          >
                            S/{' '}
                            {(filterDateTotalConSaldoPendiente(
                              colaborador.id,
                              'todos'
                            ) || 0).totalPrecio.toFixed(2)}
                          </Link>
                        </div>
                      )
                    })}
                  <div className="hidden md:grid grid-cols-17 items-center border border-black rounded-md overflow-hidden text-black ">
                    <div className=" bg-[#9FC0D5] w-full h-full flex items-center col-span-3 font-bold px-2">
                      <span className=" text-red-600 text-sm py-2">IGV</span>
                    </div>
                    {monthNames.map((mes, index: number) => (
                        <Link to='/admin/dashboard/colaboradores-result'
                            target='_blank'
                            className={cn(
                              'md:text-center  bg-[#8CD7C0] text-red-600 py-2 transition-colors text-sm cursor-pointer font-medium h-full flex items-center justify-center')}
                            key={index}
                            onClick={() => {
                              const prefix = 'metricasColaboradores_chunk_'
                              Object.keys(localStorage).forEach(key => {
                                if (key.startsWith(prefix)) {
                                  localStorage.removeItem(key)
                                }
                              })
                              const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                              const estadoFinal = {
                                estado: true,
                                ventas: filterDateConIGVDatos(null, 'todos', mes),
                                filteredColaboradores,
                                precios: 'si'
                              }
                              const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                              const estadoFinalString = JSON.stringify(estadoFinal)
                              for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                                const chunk = estadoFinalString.slice(i, i + chunkSize)
                                localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                              }
                            }}
                        >
                            {filterDateConIGV(null, 'todos')[
                              mes
                            ] || null
                              ? `S/ ${
                                (filterDateConIGV(
                                    null,
                                    'todos'
                                )[mes] || null)?.toFixed(2)
                                }`
                              : null}
                        </Link>
                    ))}
                    <h5
                      className={cn(
                        'md:text-center bg-[#74B5E4] text-red-600 transition-colors cursor-pointer font-medium h-full flex items-center justify-center'
                      )}
                    >
                      {' '}
                      {filterDateTotalConIGV(null, 'todos') || 0
                        ? `S/ ${(
                            filterDateTotalConIGV(null, 'todos') || 0
                          ).toFixed(2)}`
                        : null}
                    </h5>
                    <h5
                      className={cn(
                        'md:text-center lowercase first-letter:uppercase bg-[#FFC000] transition-colors cursor-pointer font-medium h-full flex items-center justify-center'
                      )}
                    ></h5>
                  </div>
                  <div className="hidden md:grid grid-cols-17 items-center border border-black rounded-md overflow-hidden text-black mt-1">
                    <div className="lowercase bg-[#9FC0D5] w-full h-full flex items-center col-span-3 font-bold px-2">
                      <span className="first-letter:uppercase text-red-600 text-sm py-2">
                        Perdida por abandono
                      </span>
                    </div>
                    {monthNames.map((mes, index: number) => (
                      <Link
                        to='/admin/dashboard/colaboradores-result'
                        target='_blank'
                        className={`md:text-center bg-[#8CD7C0] text-sm transition-colors cursor-pointer font-medium h-full flex items-center justify-center ${(filterDateConPerdida(null, 'todos')[mes]).total ? 'hover:bg-[#328B71]' : ''}`}
                        key={index}
                        onClick={() => {
                          const prefix = 'metricasColaboradores_chunk_'
                          Object.keys(localStorage).forEach(key => {
                            if (key.startsWith(prefix)) {
                              localStorage.removeItem(key)
                            }
                          })
                          const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                          const estadoFinal = {
                            estado: true,
                            ventas: (filterDateConPerdida(null, 'todos')[mes]).proyectos,
                            filteredColaboradores,
                            precios: 'pendiente'
                          }
                          const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                          const estadoFinalString = JSON.stringify(estadoFinal)
                          for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                            const chunk = estadoFinalString.slice(i, i + chunkSize)
                            localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                          }
                        }}
                      >
                        {(filterDateConPerdida(null, 'todos')[mes]).total || null
                          ? `S/ ${
                            (filterDateConPerdida(null, 'todos')[mes]).total || null
                            } `
                          : null}
                      </Link>
                    ))}
                    <Link
                      to='/admin/dashboard/colaboradores-result'
                      target='_blank'
                      className={cn(
                        'md:text-center bg-[#74B5E4] transition-colors cursor-pointer font-medium h-full text-red-500 flex items-center justify-center', filterDateTotalConPerdida(null).proyectos ? 'hover:bg-[#1482AB] hover:text-white' : ''
                      )}
                      onClick={() => {
                        const prefix = 'metricasColaboradores_chunk_'
                        Object.keys(localStorage).forEach(key => {
                          if (key.startsWith(prefix)) {
                            localStorage.removeItem(key)
                          }
                        })
                        const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                        const estadoFinal = {
                          estado: true,
                          ventas: filterDateTotalConPerdida(null).proyectos,
                          filteredColaboradores,
                          precios: 'pendiente'
                        }
                        const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                        const estadoFinalString = JSON.stringify(estadoFinal)
                        for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                          const chunk = estadoFinalString.slice(i, i + chunkSize)
                          localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                        }
                      }}
                    >
                      {filterDateTotalConPerdida(null).total
                        ? `S/ ${filterDateTotalConPerdida(null).total.toFixed(2)}`
                        : 'S/ 0.00'}
                    </Link>
                    <h5
                      className={cn(
                        'md:text-center lowercase first-letter:uppercase bg-[#FFC000] transition-colors cursor-pointer font-medium h-full flex items-center justify-center'
                      )}
                    ></h5>
                  </div>
                  <div className="hidden md:grid grid-cols-17 mt-1 items-center border border-black rounded-md overflow-hidden text-black ">
                    <div className="lowercase bg-[#1482AB] w-full h-full flex items-center col-span-3 font-bold px-2">
                      <span className="first-letter:uppercase text-black text-lg">
                        TOTAL
                      </span>
                    </div>
                    {monthNames.map((mes, index: number) => (
                        <Link to='/admin/dashboard/colaboradores-result'
                            target='_blank'
                            className={cn(
                              'md:text-center  py-2 transition-colors bg-[#8CD7C0] text-sm cursor-pointer font-medium h-full flex items-center justify-center')}
                            key={index}
                            onClick={() => {
                              const prefix = 'metricasColaboradores_chunk_'
                              Object.keys(localStorage).forEach(key => {
                                if (key.startsWith(prefix)) {
                                  localStorage.removeItem(key)
                                }
                              })
                              const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                              const estadoFinal = {
                                estado: true,
                                ventas: filterDateConPrecioDatos(null, 'todos', mes),
                                filteredColaboradores,
                                precios: 'si'
                              }
                              const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                              const estadoFinalString = JSON.stringify(estadoFinal)
                              for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                                const chunk = estadoFinalString.slice(i, i + chunkSize)
                                localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                              }
                            }}
                        >
                            {filterDateConPrecioSinUser(null, 'todos')[
                              mes
                            ] || null
                              ? `S/ ${
                                (filterDateConPrecioSinUser(
                                    null,
                                    'todos'
                                )[mes] || null)?.toFixed(2)
                                }`
                              : null}
                        </Link>
                    ))}
                    <h5
                      className={cn(
                        'md:text-center  bg-[#74B5E4] transition-colors py-2 cursor-pointer font-medium h-full flex items-center justify-center text-sm'
                      )}
                    >
                      S/{' '}
                      {(
                        (filterDateTotalFinalConPrecio('todos') || 0) -
                        (filterDateTotalConIGV(null, 'todos') || 0) +
                        filterDateTotalConPerdida(null).total
                      ).toFixed(2)}
                    </h5>
                    <h5
                      className={cn(
                        'md:text-center  bg-[#FFC000] transition-colors py-2 cursor-pointer font-medium h-full flex items-center justify-center text-sm'
                      )}
                    >
                      S/ {filterDateTotalConSaldoPendiente(null, 'todos').totalPrecio || 0}
                    </h5>
                  </div>
                </div>
                <div className="col-span-3 grid grid-cols-">
                  <h5 className="md:text-center h-full text-black flex items-center justify-center col-span-1"></h5>
                  <h5 className="col-span-2"></h5>
                </div>
              </div>
            </div>
            {/* TERCER CUADRO */}
            <div className="mt-10">
              <div className="grid grid-cols-19">
                <div className="hidden col-span-16 bg-[#1482AB] rounded-md md:grid grid-cols-16 items-center  md:py-2 text-white font-bold">
                  <h5 className="md:text-center lowercase first-letter:uppercase col-span-2"></h5>
                  <h5 className="md:text-center lowercase first-letter:uppercase"></h5>
                  {monthNames.map((a, index: number) => (
                    <h5
                      className="md:text-center lowercase first-letter:uppercase"
                      key={index}
                    >
                      {a}
                    </h5>
                  ))}
                  <h5 className="md:text-center lowercase first-letter:uppercase">
                    TOTAL PROYECTOS
                  </h5>
                </div>
                <div className="col-span-3"></div>
              </div>
            </div>
            <div className="md:bg-[#F2F2F2] my-1 rounded-md ">
              <div className="grid grid-cols-19 border border-black rounded-md overflow-hidden mb-1">
                <div className="hidden col-span-16 md:grid grid-cols-16 items-center text-black ">
                  <div className="lowercase bg-[#9FC0D5] w-full h-full flex items-center justify-center col-span-3 font-bold px-2">
                    <span className="uppercase">ABANDONO</span>
                  </div>
                  {monthNames.map((mes, index: number) => {
                    const { totalPorMes, proyectosPorMes } = filterDateAbandonos(null, 'abandono')
                    const totalProyectos = totalPorMes[mes] || ''
                    const proyectosList = proyectosPorMes[mes] || ''
                    return (
                    <Link
                      to='/admin/dashboard/colaboradores-result'
                      target='_blank'
                      className={cn(
                        'md:text-center lowercase first-letter:uppercase py-2 bg-[#F2F2F2] transition-colors cursor-pointer font-medium h-full flex items-center justify-center',
                        totalProyectos ? 'hover:bg-[#D0E7F7]' : ''
                      )}
                      key={index}
                      onClick={() => {
                        const prefix = 'metricasColaboradores_chunk_'
                        Object.keys(localStorage).forEach(key => {
                          if (key.startsWith(prefix)) {
                            localStorage.removeItem(key)
                          }
                        })
                        const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                        const estadoFinal = {
                          estado: true,
                          ventas: proyectosList,
                          filteredColaboradores,
                          precios: 'no'
                        }
                        const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                        const estadoFinalString = JSON.stringify(estadoFinal)
                        for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                          const chunk = estadoFinalString.slice(i, i + chunkSize)
                          localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                        }
                      }}
                    >
                      {totalProyectos}
                    </Link>
                    )
                  })}
                  <Link
                    to='/admin/dashboard/colaboradores-result'
                    target='_blank'
                    className={'md:text-center lowercase  first-letter:uppercase bg-[#FFC000] h-full flex items-center justify-center transition-colors font-medium hover:bg-[#AA8000]'}
                    onClick={() => {
                      const prefix = 'metricasColaboradores_chunk_'
                      Object.keys(localStorage).forEach(key => {
                        if (key.startsWith(prefix)) {
                          localStorage.removeItem(key)
                        }
                      })
                      const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                      const estadoFinal = {
                        estado: true,
                        ventas: filterDateTotalDatos(null, 'abandono') || null,
                        filteredColaboradores,
                        precios: 'no'
                      }
                      const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                      const estadoFinalString = JSON.stringify(estadoFinal)
                      for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                        const chunk = estadoFinalString.slice(i, i + chunkSize)
                        localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                      }
                    }}>
                    {filterDateTotalAbandonos(null, 'abandono')}
                  </Link>
                </div>
                <div className="col-span-1 bg-[#FFFF00] flex items-center justify-center text-black border-transparent font-bold text-sm ">
                  <h2>{((filterDateTotal(null, 'proceso') || 0) /
                      filterDateTotal(null, undefined) || 0) *
                      100 >
                    0
                    ? `${(
                          ((filterDateTotal(null, 'proceso') || 0) /
                            filterDateTotal(null, undefined) || 0) * 100
                        ).toFixed(2)}%`
                    : null}</h2>
                </div>
                <div className="col-span-2 bg-[#FFFF00] flex items-center justify-center text-black border-transparent font-bold text-xl ">
                  <h2></h2>
                </div>
              </div>
              <div className="grid grid-cols-19 border border-black rounded-md my-1 overflow-hidden ">
                <div className="hidden col-span-16 md:grid grid-cols-16 items-center text-black ">
                  <div className="lowercase bg-[#9FC0D5] w-full h-full flex items-center justify-center col-span-3 font-bold px-2">
                    <span className="uppercase">EN PROCESO</span>
                  </div>
                  {monthNames.map((mes, index: number) => (
                    <Link
                      to='/admin/dashboard/colaboradores-result'
                      target='_blank'
                      className={cn(
                        'md:text-center lowercase first-letter:uppercase py-2 bg-[#F2F2F2] transition-colors cursor-pointer font-medium h-full flex items-center justify-center',
                        filterDateDatos(null, 'proceso', mes).length > 0 ? 'hover:bg-[#D0E7F7]' : ''
                      )}
                      key={index}
                      onClick={() => {
                        const prefix = 'metricasColaboradores_chunk_'
                        Object.keys(localStorage).forEach(key => {
                          if (key.startsWith(prefix)) {
                            localStorage.removeItem(key)
                          }
                        })
                        const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                        const estadoFinal = {
                          estado: true,
                          ventas: filterDateDatos(null, 'proceso', mes) || null,
                          filteredColaboradores,
                          precios: 'no'
                        }
                        const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                        const estadoFinalString = JSON.stringify(estadoFinal)
                        for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                          const chunk = estadoFinalString.slice(i, i + chunkSize)
                          localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                        }
                      }}
                    >
                      {filterDate(null, 'proceso')[mes] || null}
                    </Link>
                  ))}
                  <Link
                    to='/admin/dashboard/colaboradores-result'
                    target='_blank'
                    className={`md:text-center lowercase first-letter:uppercase py-2 bg-[#FFC000] h-full flex items-center justify-center transition-colors font-medium ${filterDateTotalDatos(null, 'proceso').length > 0 ? 'hover:bg-[#AA8000]' : ''}`}
                    onClick={() => {
                      const prefix = 'metricasColaboradores_chunk_'
                      Object.keys(localStorage).forEach(key => {
                        if (key.startsWith(prefix)) {
                          localStorage.removeItem(key)
                        }
                      })
                      const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                      const estadoFinal = {
                        estado: true,
                        ventas: filterDateTotalDatos(null, 'proceso') || null,
                        filteredColaboradores,
                        precios: 'no'
                      }
                      const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                      const estadoFinalString = JSON.stringify(estadoFinal)
                      for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                        const chunk = estadoFinalString.slice(i, i + chunkSize)
                        localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                      }
                    }}
                    >
                    {filterDateTotal(null, 'proceso')}
                  </Link>
                </div>
                <div className="col-span-1 bg-[#FFFF00] flex items-center justify-center text-black border-transparent font-bold text-base ">
                  <h2>{((filterDateTotal(null, 'proceso') || 0) /
                      filterDateTotal(null, undefined) || 0) *
                      100 >
                    0
                    ? `${(
                          ((filterDateTotal(null, 'proceso') || 0) /
                            filterDateTotal(null, undefined) || 0) * 100
                        ).toFixed(2)}%`
                    : null}</h2>
                </div>
                <div className="col-span-2 bg-[#FFFF00] flex items-center justify-center text-black border-transparent font-bold text-xl ">
                  <h2></h2>
                </div>
              </div>
              <div className="grid grid-cols-19 border border-black rounded-md overflow-hidden my-1 ">
                <div className="hidden col-span-16 md:grid grid-cols-16  items-center text-black ">
                  <div className="lowercase bg-[#9FC0D5] w-full h-full flex items-center justify-center col-span-3 font-bold px-2">
                    <span className="uppercase">DESHABILITADOS</span>
                  </div>
                  {monthNames.map((mes, index: number) => (
                    <Link
                    to='/admin/dashboard/colaboradores-result'
                    target='_blank'
                    className={cn(
                      'md:text-center lowercase first-letter:uppercase py-2 bg-[#F2F2F2] transition-colors cursor-pointer font-medium h-full flex items-center justify-center',
                      filterDateDatos(null, 'deshabilitado', mes).length > 0 ? 'hover:bg-[#D0E7F7]' : ''
                    )}
                    onClick={() => {
                      const prefix = 'metricasColaboradores_chunk_'
                      Object.keys(localStorage).forEach(key => {
                        if (key.startsWith(prefix)) {
                          localStorage.removeItem(key)
                        }
                      })
                      const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                      const estadoFinal = {
                        estado: true,
                        ventas: filterDateDatos(null, 'deshabilitado', mes) || null,
                        filteredColaboradores,
                        precios: 'no'
                      }
                      const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                      const estadoFinalString = JSON.stringify(estadoFinal)
                      for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                        const chunk = estadoFinalString.slice(i, i + chunkSize)
                        localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                      }
                    }}
                      key={index}
                    >
                      {filterDate(null, 'deshabilitado')[mes] || null}
                    </Link>
                  ))}
                  <Link
                    to='/admin/dashboard/colaboradores-result'
                    target='_blank'
                    className={`md:text-center lowercase first-letter:uppercase bg-[#FFC000] h-full flex items-center justify-center transition-colors font-medium ${filterDateTotalDatos(null, 'deshabilitado').length > 0 ? 'hover:bg-[#AA8000]' : ''}`}
                    onClick={() => {
                      const prefix = 'metricasColaboradores_chunk_'
                      Object.keys(localStorage).forEach(key => {
                        if (key.startsWith(prefix)) {
                          localStorage.removeItem(key)
                        }
                      })
                      const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                      const estadoFinal = {
                        estado: true,
                        ventas: filterDateTotalDatos(null, 'deshabilitado') || null,
                        filteredColaboradores,
                        precios: 'no'
                      }
                      const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                      const estadoFinalString = JSON.stringify(estadoFinal)
                      for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                        const chunk = estadoFinalString.slice(i, i + chunkSize)
                        localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                      }
                    }}
                    >
                    {filterDateTotal(null, 'deshabilitado')}
                  </Link>
                </div>
                <div className="col-span-1 bg-[#FFFF00] flex items-center justify-center text-black border-transparent font-bold text-base ">
                  <h2>{((filterDateTotal(null, 'deshabilitado') || 0) /
                      filterDateTotal(null, undefined) || 0) *
                      100 >
                    0
                    ? `${(
                          ((filterDateTotal(null, 'deshabilitado') || 0) /
                            filterDateTotal(null, undefined) || 0) * 100
                        ).toFixed(2)}%`
                    : null}</h2>
                </div>
                <div className="col-span-2 bg-[#FFFF00] flex items-center justify-center text-black border-transparent font-bold text-xl ">
                  <h2></h2>
                </div>
              </div>
              <div className="grid grid-cols-19 border border-black rounded-md overflow-hidden  ">
                <div className="hidden col-span-16 text-red-600 md:grid  grid-cols-16 items-center  ">
                  <div className="lowercase bg-red-600 w-full h-full flex items-center justify-center col-span-3 font-bold px-2">
                    <span className="uppercase text-black">FINALIZADO</span>
                  </div>
                  {monthNames.map((mes, index: number) => (
                    <Link
                    to='/admin/dashboard/colaboradores-result'
                    target='_blank'
                    className={cn(
                      'md:text-center lowercase first-letter:uppercase bg-[#D0E7F7] transition-colors cursor-pointer font-medium h-full flex items-center justify-center',
                      filterDateDatos(null, 'finalizado', mes).length > 0 ? 'hover:bg-[#77CDEE]' : ''
                    )}
                    onClick={() => {
                      const prefix = 'metricasColaboradores_chunk_'
                      Object.keys(localStorage).forEach(key => {
                        if (key.startsWith(prefix)) {
                          localStorage.removeItem(key)
                        }
                      })
                      const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                      const estadoFinal = {
                        estado: true,
                        ventas: filterDateDatos(null, 'finalizado', mes) || null,
                        filteredColaboradores,
                        precios: 'no'
                      }
                      const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                      const estadoFinalString = JSON.stringify(estadoFinal)
                      for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                        const chunk = estadoFinalString.slice(i, i + chunkSize)
                        localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                      }
                    }}
                      key={index}
                    >
                      {filterDate(null, 'finalizado')[mes] || null}
                    </Link>
                  ))}
                  <Link
                    to='/admin/dashboard/colaboradores-result'
                    target='_blank'
                    className={`md:text-center lowercase first-letter:uppercase  py-2 bg-[#FFC000] h-full flex items-center justify-center transition-colors font-medium ${filterDateTotalDatos(null, 'finalizado').length > 0 ? 'hover:bg-[#AA8000]' : ''}`}
                    onClick={() => {
                      const prefix = 'metricasColaboradores_chunk_'
                      Object.keys(localStorage).forEach(key => {
                        if (key.startsWith(prefix)) {
                          localStorage.removeItem(key)
                        }
                      })
                      const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                      const estadoFinal = {
                        estado: true,
                        ventas: filterDateTotalDatos(null, 'finalizado') || null,
                        filteredColaboradores,
                        precios: 'no'
                      }
                      const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                      const estadoFinalString = JSON.stringify(estadoFinal)
                      for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                        const chunk = estadoFinalString.slice(i, i + chunkSize)
                        localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                      }
                    }}
                    >
                    {filterDateTotal(null, 'finalizado')}
                  </Link>
                </div>
                <div className="col-span-1 bg-[#FFFF00] flex items-center justify-center text-black border-transparent font-bold text-base ">
                  <h2>{((filterDateTotal(null, 'finalizado') || 0) /
                      filterDateTotal(null, undefined) || 0) *
                      100 >
                    0
                    ? `${(
                          ((filterDateTotal(null, 'finalizado') || 0) /
                            filterDateTotal(null, undefined) || 0) * 100
                        ).toFixed(2)}%`
                    : null}</h2>
                </div>
                <div className="col-span-2 bg-[#FFFF00] flex items-center justify-center text-black border-transparent font-bold text-xl ">
                  <h2></h2>
                </div>
              </div>
              <div className="grid grid-cols-19 my-1 ">
                <div className="hidden col-span-16 md:grid grid-cols-16 items-center border border-black rounded-md overflow-hidden text-black ">
                  <div className="lowercase bg-[#1482AB] w-full h-full flex items-center justify-center col-span-3 font-bold px-2">
                    <span className="uppercase">TOTAL</span>
                  </div>
                  {monthNames.map((mes, index: number) => (
                    <Link
                    to='/admin/dashboard/colaboradores-result'
                    target='_blank'
                    className={cn(
                      'md:text-center lowercase first-letter:uppercase bg-[#8CD7C0] py-2 transition-colors cursor-pointer font-medium h-full flex items-center justify-center',
                      filterDateDatos(null, undefined, mes).length > 0 ? 'hover:bg-[#328B71]' : ''
                    )}
                    onClick={() => {
                      const prefix = 'metricasColaboradores_chunk_'
                      Object.keys(localStorage).forEach(key => {
                        if (key.startsWith(prefix)) {
                          localStorage.removeItem(key)
                        }
                      })
                      const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                      const estadoFinal = {
                        estado: true,
                        ventas: filterDateDatos(null, undefined, mes) || null,
                        filteredColaboradores,
                        precios: 'no'
                      }
                      const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                      const estadoFinalString = JSON.stringify(estadoFinal)
                      for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                        const chunk = estadoFinalString.slice(i, i + chunkSize)
                        localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                      }
                    }}
                      key={index}
                    >
                      {filterDate()[mes] || null}
                    </Link>
                  ))}
                  <Link
                    to='/admin/dashboard/colaboradores-result'
                    target='_blank'
                    className={`md:text-center lowercase first-letter:uppercase bg-[#FFC000] h-full flex items-center justify-center transition-colors font-medium ${filterDateTotalDatos(null, undefined).length > 0 ? 'hover:bg-[#AA8000]' : ''}`}
                    onClick={() => {
                      const prefix = 'metricasColaboradores_chunk_'
                      Object.keys(localStorage).forEach(key => {
                        if (key.startsWith(prefix)) {
                          localStorage.removeItem(key)
                        }
                      })
                      const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                      const estadoFinal = {
                        estado: true,
                        ventas: filterDateTotalDatos(null, undefined) || null,
                        filteredColaboradores,
                        precios: 'no'
                      }
                      const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                      const estadoFinalString = JSON.stringify(estadoFinal)
                      for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                        const chunk = estadoFinalString.slice(i, i + chunkSize)
                        localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                      }
                    }}
                    >
                    {filterDateTotal(null, undefined)}
                  </Link>
                </div>
                <div className="col-span-3"></div>
              </div>
              <div className="grid grid-cols-19 my-1">
                <div className="hidden col-span-16 md:grid grid-cols-16  items-center border border-black rounded-md overflow-hidden text-black ">
                  <div className="lowercase bg-red-600 w-full h-full flex items-center justify-center col-span-3 font-bold px-2">
                    <span className="uppercase">POST VENTA</span>
                  </div>
                  {monthNames.map((mes, index: number) => (
                    <Link to='/admin/dashboard/colaboradores-result'
                      target='_blank'
                      className={cn(
                        'md:text-center lowercase first-letter:uppercase py-2 bg-[#D0E7F7] transition-colors cursor-pointer font-medium h-full flex items-center justify-center',
                        filterDatePostVentaDatos(null, 'todos', mes).length > 0 ? 'hover:bg-[#77CDEE]' : ''
                      )}
                      key={index}
                      onClick={() => {
                        const prefix = 'metricasColaboradores_chunk_'
                        Object.keys(localStorage).forEach(key => {
                          if (key.startsWith(prefix)) {
                            localStorage.removeItem(key)
                          }
                        })
                        const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                        const estadoFinal = {
                          estado: true,
                          ventas: filterDatePostVentaDatos(null, 'todos', mes),
                          filteredColaboradores,
                          precios: 'no'
                        }
                        const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                        const estadoFinalString = JSON.stringify(estadoFinal)
                        for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                          const chunk = estadoFinalString.slice(i, i + chunkSize)
                          localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                        }
                      }}
                    >
                      {filterDatePostVenta(null, 'todos')[mes] || null}
                    </Link>
                  ))}
                  <Link
                    to='/admin/dashboard/colaboradores-result'
                    target='_blank'
                    className={`md:text-center lowercase first-letter:uppercase bg-[#FFC000] h-full flex items-center justify-center transition-colors font-medium ${filterDateTotalDatos(null, undefined).length > 0 ? 'hover:bg-[#AA8000]' : ''}`}
                    onClick={() => {
                      const prefix = 'metricasColaboradores_chunk_'
                      Object.keys(localStorage).forEach(key => {
                        if (key.startsWith(prefix)) {
                          localStorage.removeItem(key)
                        }
                      })
                      const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                      const estadoFinal = {
                        estado: true,
                        ventas: filterDateTotalPostVenta(null, 'todos') || null,
                        filteredColaboradores,
                        precios: 'no'
                      }
                      const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                      const estadoFinalString = JSON.stringify(estadoFinal)
                      for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                        const chunk = estadoFinalString.slice(i, i + chunkSize)
                        localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                      }
                    }}
                    >
                    {filterDateTotalPostVenta(null, 'todos').length}
                  </Link>
                </div>
                <div className="col-span-3"></div>
              </div>
              <div className="grid grid-cols-19 border overflow-hidden border-black rounded-md my-1">
                <div className="hidden col-span-16 md:grid grid-cols-16  items-center overflow-hidden text-black ">
                  <div className="lowercase bg-[#1D6194] w-full h-full flex items-center justify-center col-span-3 font-bold px-2">
                    <span className="uppercase">PORCENTAJE DE POST VENTA</span>
                  </div>
                  {monthNames.map((mes, index: number) => (
                    <Link to='/admin/dashboard/colaboradores-result'
                    target='_blank'
                    className={cn(
                      'md:text-center lowercase first-letter:uppercase bg-[#A3CDED] transition-colors cursor-pointer font-medium h-full flex items-center justify-center',
                      filterDatePostVentaDatos(null, 'todos', mes).length > 0 ? 'hover:bg-[#1482AB]' : ''
                    )}
                    key={index}
                    onClick={() => {
                      const prefix = 'metricasColaboradores_chunk_'
                      Object.keys(localStorage).forEach(key => {
                        if (key.startsWith(prefix)) {
                          localStorage.removeItem(key)
                        }
                      })
                      const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                      const estadoFinal = {
                        estado: true,
                        ventas: filterDatePostVentaDatos(null, 'todos', mes),
                        filteredColaboradores,
                        precios: 'no'
                      }
                      const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                      const estadoFinalString = JSON.stringify(estadoFinal)
                      for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                        const chunk = estadoFinalString.slice(i, i + chunkSize)
                        localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                      }
                    }}
                  >
                   {((filterDatePostVenta(null, 'todos')[mes] || 0) /
                        filterDate()[mes] || 0) *
                        100 >
                      0
                     ? `${(
                            ((filterDatePostVenta(null, 'todos')[mes] || 0) /
                              filterDate()[mes] || 0) * 100
                          ).toFixed(2)}%`
                     : null}
                  </Link>
                  ))}
                   <Link
                    to='/admin/dashboard/colaboradores-result'
                    target='_blank'
                    className={`md:text-center lowercase first-letter:uppercase bg-[#FFC000] h-full flex items-center justify-center transition-colors font-medium ${filterDateTotalDatos(null, undefined).length > 0 ? 'hover:bg-[#AA8000]' : ''}`}
                    onClick={() => {
                      const prefix = 'metricasColaboradores_chunk_'
                      Object.keys(localStorage).forEach(key => {
                        if (key.startsWith(prefix)) {
                          localStorage.removeItem(key)
                        }
                      })
                      const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                      const estadoFinal = {
                        estado: true,
                        ventas: filterDateTotalPostVenta(null, 'todos') || null,
                        filteredColaboradores,
                        precios: 'no'
                      }
                      const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                      const estadoFinalString = JSON.stringify(estadoFinal)
                      for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                        const chunk = estadoFinalString.slice(i, i + chunkSize)
                        localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                      }
                    }}
                    >
                    {((filterDateTotalPostVenta(null, 'todos') || 0).length /
                      filterDateTotal(null, undefined) || 0) *
                      100 >
                    0
                      ? `${(
                          ((filterDateTotalPostVenta(null, 'todos') || 0).length /
                            filterDateTotal(null, undefined) || 0) * 100
                        ).toFixed(2)}%`
                      : null}
                  </Link>
                </div>
                <div className="col-span-1 bg-[#FFFF00] flex items-center justify-center text-black border-transparent font-bold text-xl ">
                  <h2>50%</h2>
                </div>
                <div className="col-span-2 bg-[#FFFF00] flex items-center justify-center text-black border-transparent font-bold text-xl ">
                  <h2>MEDIA</h2>
                </div>
              </div>
            </div>
            {/* COMMUNITY MANAGER */}

           <h2 className='my-10 text-black font-bold uppercase text-3xl'>COMMUNITY MANAGER</h2>
            {/* PRIMER CUADRO */}
            <div className="md:bg-[#1482AB]  rounded-md">
              <div className="hidden md:grid grid-cols-19 items-center  md:py-2 text-white font-bold">
                <h5 className="md:text-center lowercase first-letter:uppercase col-span-2">
                  COLABORADOR
                </h5>
                <h5 className="md:text-center lowercase first-letter:uppercase">
                  HORAS TRABAJADAS
                </h5>
                {monthNames.map((a, index: number) => (
                  <h5
                    className={cn('md:text-center lowercase first-letter:uppercase', selectedMonth == String(index) ? 'bg-red-600' : '')}
                    key={index}
                  >
                    {a}
                  </h5>
                ))}
                <h5 className="md:text-center lowercase first-letter:uppercase">
                  TOTAL PROYECTOS
                </h5>
                <h5 className="md:text-center lowercase first-letter:uppercase">
                  ESCALA DE EFECTIVIDAD
                </h5>
                <h5 className="md:text-center lowercase first-letter:uppercase col-span-2">
                  PRODUCTIVIDAD %
                </h5>
              </div>
            </div>
            <div className="md:bg-[#F2F2F2] my-1 rounded-md">
              {colaboradores
                // .slice() // Hacer una copia del array original para no modificarlo directamente
                .sort((a: any, b: any) => {
                  const productividadA =
                    (filterDateTotalMetricas(a.id) /
                      TiempoADias(
                        Number(
                          TiempoAHoras(
                            calcularTiempoInvertidoEnProyectoCommunity(a.horario_laboral)
                          )
                        )
                      )) *
                    100
                  const productividadB =
                    (filterDateTotalMetricas(b.id) /
                      TiempoADias(
                        Number(
                          TiempoAHoras(
                            calcularTiempoInvertidoEnProyectoCommunity(b.horario_laboral)
                          )
                        )
                      )) *
                    100

                  return productividadB - productividadA
                })
                .map((colaborador: any, index: any) => {
                  const totalHorasTrabajadas = TiempoAHoras(
                    calcularTiempoInvertidoEnProyectoCommunity(
                      colaborador.horario_laboral
                    )
                  )
                  const totalDias = TiempoADias(Number(totalHorasTrabajadas))
                  const totalProyectos = filterDateTotalCM(
                    colaborador.id,
                    'todos'
                  )
                  // CUENTA APARTIR DE MARZO DEL 2024 QUE FUE CUANDO EMPEZO EL HORARIO LABORAL
                  const totalProyectosMetricas = filterDateTotalMetricasCM(
                    colaborador.id
                  )
                  let productividadCalculada = 0
                  if (totalDias > 0) {
                    productividadCalculada =
                      (totalProyectosMetricas / Number(totalDias)) * 100
                  }
                  return (
                    <div
                      key={colaborador.id}
                      className="hidden md:grid grid-cols-19 my-1 items-center border border-black rounded-md overflow-hidden text-black "
                    >
                      <div className="lowercase bg-[#9FC0D5] w-full h-full flex items-center col-span-2 font-bold px-2">
                        <span className="first-letter:uppercase">
                          {colaborador.name}
                        </span>
                      </div>
                      <div className="lowercase bg-[#77CDEE] w-full h-full flex items-center justify-center font-bold px-2">
                        <span className="first-letter:uppercase ">
                          {totalHorasTrabajadas} H
                        </span>
                      </div>
                      {monthNames.map((mes, index: number) => (
                        <Link to='/admin/dashboard/colaboradores-result'
                          target='_blank'
                          className={cn(
                            'md:text-center  lowercase first-letter:uppercase  transition-colors cursor-pointer font-medium h-full flex items-center justify-center',
                            filterDateCM(colaborador.id, 'todos')[mes] != 0
                              ? 'bg-[#D0E7F7] hover:bg-[#b0c4d2]'
                              : ''
                          )}
                          key={index}
                          onClick={() => {
                            const prefix = 'metricasColaboradores_chunk_'
                            Object.keys(localStorage).forEach(key => {
                              if (key.startsWith(prefix)) {
                                localStorage.removeItem(key)
                              }
                            })
                            const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                            const estadoFinal = {
                              estado: true,
                              ventas: filterDateDatosCM(colaborador.id, 'todos', mes),
                              filteredColaboradores,
                              precios: 'no'
                            }
                            const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                            const estadoFinalString = JSON.stringify(estadoFinal)
                            for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                              const chunk = estadoFinalString.slice(i, i + chunkSize)
                              localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                            }
                          }}
                        >
                          {filterDateCM(colaborador.id, 'todos')[mes] || null}
                        </Link>
                      ))}
                      <Link to='/admin/dashboard/colaboradores-result' target='_blank' className={`md:text-center lowercase first-letter:uppercase bg-[#74B5E4] h-full flex items-center justify-center font-medium  transition-colors cursor-pointer ${filterDateTotalDatosCM(colaborador.id, 'todos').length > 0 ? 'hover:bg-[#1482AB]' : ''}`}
                      onClick={() => {
                        const prefix = 'metricasColaboradores_chunk_'
                        Object.keys(localStorage).forEach(key => {
                          if (key.startsWith(prefix)) {
                            localStorage.removeItem(key)
                          }
                        })
                        const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                        const estadoFinal = {
                          estado: true,
                          ventas: filterDateTotalDatosCM(colaborador.id, 'todos'),
                          filteredColaboradores,
                          precios: 'no'
                        }
                        const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                        const estadoFinalString = JSON.stringify(estadoFinal)
                        for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                          const chunk = estadoFinalString.slice(i, i + chunkSize)
                          localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                        }
                      }}
                      >
                        {totalProyectos}
                      </Link>
                      <h5
                        className={cn(
                          'md:text-center lowercase first-letter:uppercase bg-[#FFFF99] py-2 h-full flex items-center justify-center font-medium',
                          index + 1 <= 3 ? 'text-red-600 text-lg' : ''
                        )}
                      >
                        {index + 1}
                      </h5>
                      <div className="md:text-center lowercase first-letter:uppercase col-span-2 gap-2 bg-[#9FC8C6] h-full flex items-center justify-center font-medium">
                        {productividadCalculada > 110 ? (
                          <FaLeftLong className="text-green-700 rotate-90" />
                        ) : productividadCalculada < 60 ? (
                          <FaLeftLong className="text-red-700 -rotate-90" />
                        ) : (
                          <FaLeftLong className="text-yellow-600 rotate-180" />
                        )}
                        <span>{productividadCalculada.toFixed(2)} %</span>
                      </div>
                    </div>
                  )
                })}
              <div className="hidden md:grid grid-cols-19 items-center border border-black rounded-md overflow-hidden text-black ">
                <div className="lowercase bg-[#328B71] w-full h-full flex items-center col-span-3 font-bold px-2">
                  <span className="first-letter:uppercase text-white text-lg">
                    TOTAL PROYECTOS
                  </span>
                </div>
                {monthNames.map((mes, index: number) => (
                  <Link to='/admin/dashboard/colaboradores-result'
                    target='_blank'
                    className={cn(
                      'md:text-center lowercase first-letter:uppercase bg-[#8CD7C0]  transition-colors cursor-pointer font-medium h-full flex items-center justify-center',
                      filterDateDatosCM(null, 'todos', mes).length > 0 ? 'hover:bg-[#328B71]' : ''
                    )}
                    key={index}
                    onClick={() => {
                      const prefix = 'metricasColaboradores_chunk_'
                      Object.keys(localStorage).forEach(key => {
                        if (key.startsWith(prefix)) {
                          localStorage.removeItem(key)
                        }
                      })
                      const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                      const estadoFinal = {
                        estado: true,
                        ventas: filterDateDatosCM(null, 'todos', mes),
                        filteredColaboradores,
                        precios: 'no'
                      }
                      const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                      const estadoFinalString = JSON.stringify(estadoFinal)
                      for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                        const chunk = estadoFinalString.slice(i, i + chunkSize)
                        localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                      }
                    }}
                      >
                        {filterDateCM(null, 'todos')[mes] || null}
                      </Link>
                ))}
                <h5
                  className={cn(
                    'md:text-center lowercase first-letter:uppercase bg-[#FFC000] hover:bg-[#AA8000] transition-colors cursor-pointer font-medium h-full flex items-center justify-center'
                  )}
                  onClick={() => {
                    const prefix = 'metricasColaboradores_chunk_'
                    Object.keys(localStorage).forEach(key => {
                      if (key.startsWith(prefix)) {
                        localStorage.removeItem(key)
                      }
                    })
                    const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                    const estadoFinal = {
                      estado: true,
                      ventas: filterDateTotalDatosCM(null, 'todos'),
                      filteredColaboradores,
                      precios: 'no'
                    }
                    const chunkSize = 5000
                    const estadoFinalString = JSON.stringify(estadoFinal)
                    for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                      const chunk = estadoFinalString.slice(i, i + chunkSize)
                      localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                    }
                  }}
                >
                  {filterDateTotalCM(null, 'todos')}
                </h5>
              </div>
            </div>
            {/* SEGUNDO CUADRO */}
            <div className="mt-6">
              <div className="grid grid-cols-19">
                <div className="hidden col-span-16 bg-[#1482AB] rounded-md rounded-r-none md:grid grid-cols-16 items-center  md:py-2 text-white font-bold">
                  <h5 className="md:text-center lowercase first-letter:uppercase col-span-2">
                    Colaborador
                  </h5>
                  <h5 className="md:text-center lowercase first-letter:uppercase">
                    Horas Trabajadas
                  </h5>
                  {monthNames.map((a, index: number) => (
                    <h5
                      className="md:text-center lowercase first-letter:uppercase"
                      key={index}
                    >
                      {a}
                    </h5>
                  ))}
                  <h5 className="md:text-center lowercase first-letter:uppercase">
                    TOTAL S/.
                  </h5>
                </div>
                <div className="col-span-3 grid grid-cols-3">
                  <h5 className="md:text-center h-full flex bg-[#1482AB] rounded-r-md text-white font-bold items-center justify-center col-span-1">
                    Saldo pendiente
                  </h5>
                  <h5 className="col-span-2"></h5>
                </div>
              </div>
            </div>
             <div className="mt-0">
              <div className="grid grid-cols-19">
                <div className="md:bg-[#F2F2F2] col-span-17 my-1 rounded-md">
                  {colaboradores
                    .slice()
                    .sort((a: any, b: any) => {
                      const productividadA =
                          (filterDateTotalMetricas(a.id) /
                            TiempoADias(
                              Number(
                                TiempoAHoras(
                                  calcularTiempoInvertidoEnProyectoCommunity(a.horario_laboral)
                                )
                              )
                            )) *
                          100
                      const productividadB =
                          (filterDateTotalMetricas(b.id) /
                            TiempoADias(
                              Number(
                                TiempoAHoras(
                                  calcularTiempoInvertidoEnProyectoCommunity(b.horario_laboral)
                                )
                              )
                            )) *
                          100

                      return productividadB - productividadA
                    })
                    .map((colaborador: any, _index: any) => {
                      const totalHorasTrabajadas = TiempoAHoras(
                        calcularTiempoInvertidoEnProyectoCommunity(
                          colaborador.horario_laboral
                        )
                      )
                      return (
                        <div
                          key={colaborador.id}
                          className="hidden md:grid grid-cols-17 my-1 items-center border border-black rounded-md overflow-hidden text-black "
                        >
                          <div className="lowercase bg-[#9FC0D5] w-full h-full flex items-center col-span-2 font-bold px-2">
                            <span className="first-letter:uppercase">
                              {colaborador.name}
                            </span>
                          </div>
                          <div className="lowercase bg-[#77CDEE] w-full h-full flex items-center justify-center font-bold px-2">
                            <span className="first-letter:uppercase ">
                              {totalHorasTrabajadas} H
                            </span>
                          </div>
                          {monthNames.map((mes, index: number) => (
                            <Link to='/admin/dashboard/colaboradores-result'
                              target='_blank'
                              className={cn(
                                'md:text-center  py-2 transition-colors text-sm cursor-pointer font-medium h-full flex items-center justify-center',
                                filterDateConPrecioCM(colaborador.id, 'todos')[
                                  mes
                                ] != 0
                                  ? 'bg-[#D0E7F7] hover:bg-[#1482AB]'
                                  : ''
                              )}
                              key={index}
                              onClick={() => {
                                const prefix = 'metricasColaboradores_chunk_'
                                Object.keys(localStorage).forEach(key => {
                                  if (key.startsWith(prefix)) {
                                    localStorage.removeItem(key)
                                  }
                                })
                                const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                                const estadoFinal = {
                                  estado: true,
                                  ventas: filterDateConPrecioDatosCM(colaborador.id, 'todos', mes),
                                  filteredColaboradores,
                                  precios: 'si'
                                }
                                const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                                const estadoFinalString = JSON.stringify(estadoFinal)
                                for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                                  const chunk = estadoFinalString.slice(i, i + chunkSize)
                                  localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                                }
                              }}
                            >
                              {filterDateConPrecioCM(colaborador.id, 'todos')[
                                mes
                              ] || null
                                ? `S/ ${
                                    (filterDateConPrecioCM(
                                      colaborador.id,
                                      'todos'
                                    )[mes] || null)?.toFixed(2)
                                  }`
                                : null}
                            </Link>
                          ))}
                          <Link to='/admin/dashboard/colaboradores-result' target='_blank' className={cn('md:text-center bg-[#74B5E4] py-2 text-sm h-full flex items-center justify-center font-medium transition-colors cursor-pointer', (filterDateTotalConPrecioCM(
                            colaborador.id,
                            'todos'
                          ) || 0).proyectos.length > 0 ? 'hover:bg-[#1482AB]' : '')}
                            onClick={() => {
                              const prefix = 'metricasColaboradores_chunk_'
                              Object.keys(localStorage).forEach(key => {
                                if (key.startsWith(prefix)) {
                                  localStorage.removeItem(key)
                                }
                              })
                              const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                              const estadoFinal = {
                                estado: true,
                                ventas: filterDateTotalConPrecioCM(
                                  colaborador.id,
                                  'todos'
                                ).proyectos,
                                filteredColaboradores,
                                precios: 'si'
                              }
                              const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                              const estadoFinalString = JSON.stringify(estadoFinal)
                              for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                                const chunk = estadoFinalString.slice(i, i + chunkSize)
                                localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                              }
                            }}
                            >
                            S/{' '}
                            {(filterDateTotalConPrecioCM(
                              colaborador.id,
                              'todos'
                            ) || 0).total.toFixed(2)}
                          </Link>
                        </div>
                      )
                    })}
                  <div className="hidden md:grid grid-cols-17 items-center border border-black rounded-md overflow-hidden text-black ">
                    <div className=" bg-[#9FC0D5] w-full h-full flex items-center col-span-3 font-bold px-2">
                      <span className=" text-red-600 text-sm py-2">IGV</span>
                    </div>
                    {monthNames.map((mes, index: number) => (
                        <Link to='/admin/dashboard/colaboradores-result'
                            target='_blank'
                            className={cn(
                              'md:text-center  bg-[#8CD7C0] text-red-600 py-2 transition-colors text-sm cursor-pointer font-medium h-full flex items-center justify-center')}
                            key={index}
                            onClick={() => {
                              const prefix = 'metricasColaboradores_chunk_'
                              Object.keys(localStorage).forEach(key => {
                                if (key.startsWith(prefix)) {
                                  localStorage.removeItem(key)
                                }
                              })
                              const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                              const estadoFinal = {
                                estado: true,
                                ventas: filterDateConIGVDatosCM(null, 'todos', mes),
                                filteredColaboradores,
                                precios: 'si'
                              }
                              const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                              const estadoFinalString = JSON.stringify(estadoFinal)
                              for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                                const chunk = estadoFinalString.slice(i, i + chunkSize)
                                localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                              }
                            }}
                        >
                            {filterDateConCM(null, 'todos')[
                              mes
                            ] || null
                              ? `S/ ${
                                (filterDateConCM(
                                    null,
                                    'todos'
                                )[mes] || null)?.toFixed(2)
                                }`
                              : null}
                        </Link>
                    ))}
                    <h5
                      className={cn(
                        'md:text-center bg-[#74B5E4] text-red-600 transition-colors cursor-pointer font-medium h-full flex items-center justify-center'
                      )}
                    >
                      {' '}
                      {filterDateTotalConIGVCM(null, 'todos') || 0
                        ? `S/ ${(
                            filterDateTotalConIGVCM(null, 'todos') || 0
                          ).toFixed(2)}`
                        : null}
                    </h5>
                    <h5
                      className={cn(
                        'md:text-center lowercase first-letter:uppercase bg-[#FFC000] transition-colors cursor-pointer font-medium h-full flex items-center justify-center'
                      )}
                    ></h5>
                  </div>
                  <div className="hidden md:grid grid-cols-17 items-center border border-black rounded-md overflow-hidden text-black mt-1">
                    <div className="lowercase bg-[#9FC0D5] w-full h-full flex items-center col-span-3 font-bold px-2">
                      <span className="first-letter:uppercase text-red-600 text-sm py-2">
                        Perdida por abandono
                      </span>
                    </div>
                    {monthNames.map((mes, index: number) => (
                      <Link
                        to='/admin/dashboard/colaboradores-result'
                        target='_blank'
                        className={`md:text-center bg-[#8CD7C0] text-sm transition-colors cursor-pointer font-medium h-full flex items-center justify-center ${(filterDateConPerdidaCM(null, 'todos')[mes]).total ? 'hover:bg-[#328B71]' : ''}`}
                        key={index}
                        onClick={() => {
                          const prefix = 'metricasColaboradores_chunk_'
                          Object.keys(localStorage).forEach(key => {
                            if (key.startsWith(prefix)) {
                              localStorage.removeItem(key)
                            }
                          })
                          const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                          const estadoFinal = {
                            estado: true,
                            ventas: (filterDateConPerdidaCM(null, 'todos')[mes]).proyectos,
                            filteredColaboradores,
                            precios: 'pendiente'
                          }
                          const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                          const estadoFinalString = JSON.stringify(estadoFinal)
                          for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                            const chunk = estadoFinalString.slice(i, i + chunkSize)
                            localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                          }
                        }}
                      >
                        {(filterDateConPerdidaCM(null, 'todos')[mes]).total || null
                          ? `S/ ${
                            (filterDateConPerdidaCM(null, 'todos')[mes]).total || null
                            } `
                          : null}
                      </Link>
                    ))}
                    <Link
                      to='/admin/dashboard/colaboradores-result'
                      target='_blank'
                      className={cn(
                        'md:text-center bg-[#74B5E4] transition-colors cursor-pointer font-medium h-full text-red-500 flex items-center justify-center', filterDateTotalConPerdidaCM(null).proyectos ? 'hover:bg-[#1482AB] hover:text-white' : ''
                      )}
                      onClick={() => {
                        const prefix = 'metricasColaboradores_chunk_'
                        Object.keys(localStorage).forEach(key => {
                          if (key.startsWith(prefix)) {
                            localStorage.removeItem(key)
                          }
                        })
                        const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                        const estadoFinal = {
                          estado: true,
                          ventas: filterDateTotalConPerdidaCM(null).proyectos,
                          filteredColaboradores,
                          precios: 'pendiente'
                        }
                        const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                        const estadoFinalString = JSON.stringify(estadoFinal)
                        for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                          const chunk = estadoFinalString.slice(i, i + chunkSize)
                          localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                        }
                      }}
                    >
                      {filterDateTotalConPerdidaCM(null).total
                        ? `S/ ${filterDateTotalConPerdidaCM(null).total.toFixed(2)}`
                        : 'S/ 0.00'}
                    </Link>
                    <h5
                      className={cn(
                        'md:text-center lowercase first-letter:uppercase bg-[#FFC000] transition-colors cursor-pointer font-medium h-full flex items-center justify-center'
                      )}
                    ></h5>
                  </div>
                  <div className="hidden md:grid grid-cols-17 mt-1 items-center border border-black rounded-md overflow-hidden text-black ">
                    <div className="lowercase bg-[#1482AB] w-full h-full flex items-center col-span-3 font-bold px-2">
                      <span className="first-letter:uppercase text-black text-lg">
                        TOTAL
                      </span>
                    </div>
                    {monthNames.map((mes, index: number) => (
                        <Link to='/admin/dashboard/colaboradores-result'
                            target='_blank'
                            className={cn(
                              'md:text-center  py-2 transition-colors bg-[#8CD7C0] text-sm cursor-pointer font-medium h-full flex items-center justify-center')}
                            key={index}
                            onClick={() => {
                              const prefix = 'metricasColaboradores_chunk_'
                              Object.keys(localStorage).forEach(key => {
                                if (key.startsWith(prefix)) {
                                  localStorage.removeItem(key)
                                }
                              })
                              const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                              const estadoFinal = {
                                estado: true,
                                ventas: filterDateConPrecioDatosCM(null, 'todos', mes),
                                filteredColaboradores,
                                precios: 'si'
                              }
                              const chunkSize = 5000
                              const estadoFinalString = JSON.stringify(estadoFinal)
                              for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                                const chunk = estadoFinalString.slice(i, i + chunkSize)
                                localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                              }
                            }}
                        >
                            {filterDateConPrecioSinUserCM(null, 'todos')[
                              mes
                            ] || null
                              ? `S/ ${
                                (filterDateConPrecioSinUserCM(
                                    null,
                                    'todos'
                                )[mes] || null)?.toFixed(2)
                                }`
                              : null}
                        </Link>
                    ))}
                    <h5
                      className={cn(
                        'md:text-center  bg-[#74B5E4] transition-colors py-2 cursor-pointer font-medium h-full flex items-center justify-center text-sm'
                      )}
                    >
                      S/{' '}
                      {filterDateTotalFinalConPrecioCM('todos')}
                    </h5>
                    <h5
                      className={cn(
                        'md:text-center  bg-[#FFC000] transition-colors py-2 cursor-pointer font-medium h-full flex items-center justify-center text-sm'
                      )}
                    >
                    </h5>
                  </div>
                </div>
                <div className="col-span-3 grid grid-cols-">
                  <h5 className="md:text-center h-full text-black flex items-center justify-center col-span-1"></h5>
                  <h5 className="col-span-2"></h5>
                </div>
              </div>
            </div>

            {/* HOSTING */}
            <h2 className='my-10 text-black font-bold uppercase text-3xl'>HOSTING</h2>
            {/* PRIMER CUADRO */}
            <div className="md:bg-[#1482AB]  rounded-md">
              <div className="hidden md:grid grid-cols-17 items-center  md:py-2 text-white font-bold">
                <h5 className="md:text-center lowercase first-letter:uppercase col-span-2">
                  COLABORADOR
                </h5>
                <h5 className="md:text-center lowercase first-letter:uppercase">
                  HORAS TRABAJADAS
                </h5>
                {monthNames.map((a, index: number) => (
                  <h5
                    className={cn('md:text-center lowercase first-letter:uppercase', selectedMonth == String(index) ? 'bg-red-600' : '')}
                    key={index}
                  >
                    {a}
                  </h5>
                ))}
                <h5 className="md:text-center lowercase first-letter:uppercase">
                  TOTAL SOPORTES
                </h5>
                <h5 className="md:text-center lowercase first-letter:uppercase">
                  ESCALA DE EFECTIVIDAD
                </h5>
                {/* <h5 className="md:text-center lowercase first-letter:uppercase col-span-2">
                  PRODUCTIVIDAD %
                </h5> */}
              </div>
            </div>
            <div className="md:bg-[#F2F2F2] my-1 rounded-md">
            {colaboradores
              .filter((colaborador: any) => {
                return calcularTiempoTotalInvertidoPorHosting(colaborador.id) > 0
              })
              .map((colaborador: any, index: any) => {
                const totalHorasTrabajadas = TiempoAHoras(
                  calcularTiempoTotalInvertidoPorHosting(
                    colaborador.id
                  )
                )
                const totalProyectos = filterDateHostinTotal(
                  colaborador.id)
                // CUENTA APARTIR DE MARZO DEL 2024 QUE FUE CUANDO EMPEZO EL HORARIO LABORAL
                return (
                    <div
                      key={colaborador.id}
                      className="hidden md:grid grid-cols-17 my-1 items-center border border-black rounded-md overflow-hidden text-black "
                    >
                      <div className="lowercase bg-[#9FC0D5] w-full h-full flex items-center col-span-2 font-bold px-2">
                        <span className="first-letter:uppercase">
                          {colaborador.name}
                        </span>
                      </div>
                      <div className="lowercase bg-[#77CDEE] w-full h-full flex items-center justify-center font-bold px-2">
                        <span className="first-letter:uppercase ">
                          {totalHorasTrabajadas} H
                        </span>
                      </div>
                       {monthNames.map((mes, index: number) => (
                        <Link to='/admin/dashboard/colaboradores-result-hosting'
                          target='_blank'
                          className={cn(
                            'md:text-center  lowercase first-letter:uppercase  transition-colors cursor-pointer font-medium h-full flex items-center justify-center',
                            filterDateHosting(colaborador.id)[mes] != 0
                              ? 'bg-[#D0E7F7] hover:bg-[#b0c4d2]'
                              : ''
                          )}
                          key={index}
                          onClick={() => {
                            const prefix = 'metricasColaboradores_chunk_'
                            Object.keys(localStorage).forEach(key => {
                              if (key.startsWith(prefix)) {
                                localStorage.removeItem(key)
                              }
                            })
                            const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                            const estadoFinal = {
                              estado: true,
                              ventas: filterDateHostingConDatos(colaborador.id, mes).proyectos,
                              filteredColaboradores,
                              precios: 'no'
                            }
                            const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                            const estadoFinalString = JSON.stringify(estadoFinal)
                            for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                              const chunk = estadoFinalString.slice(i, i + chunkSize)
                              localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                            }
                          }}
                        >
                          {filterDateHosting(colaborador.id)[mes] || null}
                        </Link>
                       ))}
                      <Link to='/admin/dashboard/colaboradores-result-hosting' target='_blank' className={`md:text-center lowercase first-letter:uppercase bg-[#74B5E4] h-full flex items-center justify-center font-medium  transition-colors cursor-pointer ${filterDateTotalDatosCM(colaborador.id, 'todos').length > 0 ? 'hover:bg-[#1482AB]' : ''}`}
                      onClick={() => {
                        const prefix = 'metricasColaboradores_chunk_'
                        Object.keys(localStorage).forEach(key => {
                          if (key.startsWith(prefix)) {
                            localStorage.removeItem(key)
                          }
                        })
                        const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                        const estadoFinal = {
                          estado: true,
                          ventas: filterDateHostinTotalConDatos(colaborador.id),
                          filteredColaboradores,
                          precios: 'no'
                        }
                        const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                        const estadoFinalString = JSON.stringify(estadoFinal)
                        for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                          const chunk = estadoFinalString.slice(i, i + chunkSize)
                          localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                        }
                      }}
                      >
                        {totalProyectos}
                      </Link>
                      <h5
                        className={cn(
                          'md:text-center lowercase first-letter:uppercase bg-[#FFFF99] py-2 h-full flex items-center justify-center font-medium',
                          index + 1 <= 3 ? 'text-red-600 text-lg' : ''
                        )}
                      >
                        {index + 1}
                      </h5>
                      {/* <div className="md:text-center lowercase first-letter:uppercase col-span-2 gap-2 bg-[#9FC8C6] h-full flex items-center justify-center font-medium">
                        {productividadCalculada > 110 ? (
                          <FaLeftLong className="text-green-700 rotate-90" />
                        ) : productividadCalculada < 60 ? (
                          <FaLeftLong className="text-red-700 -rotate-90" />
                        ) : (
                          <FaLeftLong className="text-yellow-600 rotate-180" />
                        )}
                        <span>{productividadCalculada.toFixed(2)} %</span>
                      </div> */}
                    </div>
                )
              })}
               <div className="hidden md:grid grid-cols-17 items-center border border-black rounded-md overflow-hidden text-black ">
                <div className="lowercase bg-[#328B71] w-full h-full flex items-center col-span-3 font-bold px-2">
                  <span className="first-letter:uppercase text-white text-lg">
                    TOTAL SOPORTES
                  </span>
                </div>
                {monthNames.map((mes, index: number) => (
                  <Link to='/admin/dashboard/colaboradores-result-hosting'
                    target='_blank'
                    className={cn(
                      'md:text-center lowercase first-letter:uppercase bg-[#8CD7C0]  transition-colors cursor-pointer font-medium h-full flex items-center justify-center',
                      filterDateHostingConDatosTotal(mes).total > 0 ? 'hover:bg-[#328B71]' : ''
                    )}
                    key={index}
                    onClick={() => {
                      const prefix = 'metricasColaboradores_chunk_'
                      Object.keys(localStorage).forEach(key => {
                        if (key.startsWith(prefix)) {
                          localStorage.removeItem(key)
                        }
                      })
                      const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                      const estadoFinal = {
                        estado: true,
                        ventas: filterDateHostingConDatosTotal(mes).proyectos,
                        filteredColaboradores,
                        precios: 'no'
                      }
                      const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                      const estadoFinalString = JSON.stringify(estadoFinal)
                      for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                        const chunk = estadoFinalString.slice(i, i + chunkSize)
                        localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                      }
                    }}
                      >
                        {filterDateHostingTotal()[mes] || null}
                      </Link>
                ))}
                <Link
                target='_blank'
                  to='/admin/dashboard/colaboradores-result-hosting'
                  className={cn(
                    'md:text-center lowercase first-letter:uppercase bg-[#FFC000] hover:bg-[#AA8000] transition-colors cursor-pointer font-medium h-full flex items-center justify-center'
                  )}
                  onClick={() => {
                    const prefix = 'metricasColaboradores_chunk_'
                    Object.keys(localStorage).forEach(key => {
                      if (key.startsWith(prefix)) {
                        localStorage.removeItem(key)
                      }
                    })
                    const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                    const estadoFinal = {
                      estado: true,
                      ventas: filterDateHostinTotalConDatosFinal(),
                      filteredColaboradores,
                      precios: 'no'
                    }
                    const chunkSize = 5000
                    const estadoFinalString = JSON.stringify(estadoFinal)
                    for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                      const chunk = estadoFinalString.slice(i, i + chunkSize)
                      localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                    }
                  }}
                >
                  {filterDateHostinTotalConDatosFinal().length}
                </Link>
              </div>
            </div>
            {/* SEGUNDO CUADRO */}
            {/* <div className="mt-6">
              <div className="grid grid-cols-19">
                <div className="hidden col-span-16 bg-[#1482AB] rounded-md rounded-r-none md:grid grid-cols-16 items-center  md:py-2 text-white font-bold">
                  <h5 className="md:text-center lowercase first-letter:uppercase col-span-2">
                    Colaborador
                  </h5>
                  <h5 className="md:text-center lowercase first-letter:uppercase">
                    Horas Trabajadas
                  </h5>
                  {monthNames.map((a, index: number) => (
                    <h5
                      className="md:text-center lowercase first-letter:uppercase"
                      key={index}
                    >
                      {a}
                    </h5>
                  ))}
                  <h5 className="md:text-center lowercase first-letter:uppercase">
                    TOTAL S/.
                  </h5>
                </div>
                <div className="col-span-3 grid grid-cols-3">
                  <h5 className="col-span-2"></h5>
                </div>
              </div>
            </div>
             <div className="mt-0">
              <div className="grid grid-cols-19">
                <div className="md:bg-[#F2F2F2] col-span-17 my-1 rounded-md">
                  {colaboradores
                    .filter((colaborador: any) => {
                      return calcularTiempoTotalInvertidoPorHosting(colaborador.id) > 0
                    })
                    .map((colaborador: any, _index: any) => {
                      const totalHorasTrabajadas = TiempoAHoras(
                        calcularTiempoTotalInvertidoPorHosting(
                          colaborador.id
                        )
                      )
                      return (
                        <div
                          key={colaborador.id}
                          className="hidden md:grid grid-cols-17 my-1 items-center border border-black rounded-md overflow-hidden text-black "
                        >
                          <div className="lowercase bg-[#9FC0D5] w-full h-full flex items-center col-span-2 font-bold px-2">
                            <span className="first-letter:uppercase">
                              {colaborador.name}
                            </span>
                          </div>
                          <div className="lowercase bg-[#77CDEE] w-full h-full flex items-center justify-center font-bold px-2">
                            <span className="first-letter:uppercase ">
                              {totalHorasTrabajadas} H
                            </span>
                          </div>
                          {monthNames.map((mes, index: number) => (
                            <Link to='/admin/dashboard/colaboradores-result-hosting'
                              target='_blank'
                              className={cn(
                                'md:text-center  py-2 transition-colors text-sm cursor-pointer font-medium h-full flex items-center justify-center',
                                filterDateHostingConPrecio(colaborador.id)[
                                  mes
                                ] != 0
                                  ? 'bg-[#D0E7F7] hover:bg-[#1482AB]'
                                  : ''
                              )}
                              key={index}
                              onClick={() => {
                                const prefix = 'metricasColaboradores_chunk_'
                                Object.keys(localStorage).forEach(key => {
                                  if (key.startsWith(prefix)) {
                                    localStorage.removeItem(key)
                                  }
                                })
                                const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                                const estadoFinal = {
                                  estado: true,
                                  ventas: filterDateHostingConDatos(colaborador.id, mes).proyectos,
                                  filteredColaboradores,
                                  precios: 'si'
                                }
                                const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                                const estadoFinalString = JSON.stringify(estadoFinal)
                                for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                                  const chunk = estadoFinalString.slice(i, i + chunkSize)
                                  localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                                }
                              }}
                            >
                              {filterDateHostingConPrecio(colaborador.id)[mes] ? `S/  ${(filterDateHostingConPrecio(colaborador.id)[mes]).toFixed(2)}` : null}
                            </Link>
                          ))}
                          <Link to='/admin/dashboard/colaboradores-result-hosting' target='_blank' className={cn('md:text-center bg-[#74B5E4] py-2 text-sm h-full flex items-center justify-center font-medium transition-colors cursor-pointer', (filterDateTotalConPrecioCM(
                            colaborador.id,
                            'todos'
                          ) || 0).proyectos.length > 0 ? 'hover:bg-[#1482AB]' : '')}
                            onClick={() => {
                              const prefix = 'metricasColaboradores_chunk_'
                              Object.keys(localStorage).forEach(key => {
                                if (key.startsWith(prefix)) {
                                  localStorage.removeItem(key)
                                }
                              })
                              const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                              const estadoFinal = {
                                estado: true,
                                ventas: filterDateHostingConPrecioTotal(
                                  colaborador.id
                                ).proyectos,
                                filteredColaboradores,
                                precios: 'si'
                              }
                              const chunkSize = 5000 // Tamaño máximo en caracteres para cada segmento
                              const estadoFinalString = JSON.stringify(estadoFinal)
                              for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                                const chunk = estadoFinalString.slice(i, i + chunkSize)
                                localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                              }
                            }}
                            >
                            S/{' '}
                            {(filterDateHostingConPrecioTotal(
                              colaborador.id
                            ) || 0).totalPrecio.toFixed(2)}
                          </Link>
                        </div>
                      )
                    })}
                  <div className="hidden md:grid grid-cols-17 mt-1 items-center border border-black rounded-md overflow-hidden text-black ">
                    <div className="lowercase bg-[#1482AB] w-full h-full flex items-center col-span-3 font-bold px-2">
                      <span className="first-letter:uppercase text-black text-lg">
                        TOTAL
                      </span>
                    </div>
                    {monthNames.map((mes, index: number) => (
                        <Link to='/admin/dashboard/colaboradores-result-hosting'
                            target='_blank'
                            className={cn(
                              'md:text-center  py-2 transition-colors bg-[#8CD7C0] text-sm cursor-pointer font-medium h-full flex items-center justify-center')}
                            key={index}
                            onClick={() => {
                              const prefix = 'metricasColaboradores_chunk_'
                              Object.keys(localStorage).forEach(key => {
                                if (key.startsWith(prefix)) {
                                  localStorage.removeItem(key)
                                }
                              })
                              const filteredColaboradores = colaboradores.map(({ id, name }) => ({ id, name }))
                              const estadoFinal = {
                                estado: true,
                                ventas: filterDateConPrecioDatosCM(null, 'todos', mes),
                                filteredColaboradores,
                                precios: 'si'
                              }
                              const chunkSize = 5000
                              const estadoFinalString = JSON.stringify(estadoFinal)
                              for (let i = 0; i < estadoFinalString.length; i += chunkSize) {
                                const chunk = estadoFinalString.slice(i, i + chunkSize)
                                localStorage.setItem(`${prefix}${i / chunkSize}`, chunk)
                              }
                            }}
                        >
                            {filterDateHostingConPrecioTotalPerMes()[
                              mes
                            ] || null
                              ? `S/ ${
                                (filterDateHostingConPrecioTotalPerMes()[mes] || null)?.toFixed(2)
                                }`
                              : null}
                        </Link>
                    ))}
                    <h5
                      className={cn(
                        'md:text-center  bg-[#74B5E4] transition-colors py-2 cursor-pointer font-medium h-full flex items-center justify-center text-sm'
                      )}
                    >
                      S/{' '} {filterDateTotalFinalConPrecioCM('todos')}
                    </h5>
                    <h5
                      className={cn(
                        'md:text-center  bg-[#FFC000] transition-colors py-2 cursor-pointer font-medium h-full flex items-center justify-center text-sm'
                      )}
                    >
                    </h5>
                  </div>
                </div>
                <div className="col-span-3 grid grid-cols-">
                  <h5 className="md:text-center h-full text-black flex items-center justify-center col-span-1"></h5>
                  <h5 className="col-span-2"></h5>
                </div>
              </div>
            </div> */}
            {/* GRAFICO 1 */}
            <div className="w-full grid grid-cols-2 my-4">
              <TotalPorMes
                proyectos={filterDateGrafico(null, 'todos') || null}
              />
              <TotalPorColaborador
                colaboradores={calcularProductividadColaboradores()}
              />
            </div>
            {/* GRAFICO 2 */}
            <div className="w-full grid grid-cols-3 my-4">
              <div className="col-span-2">
                <GananciaPorMes
                  proyectos={filterDateConPrecioGrafico(null, 'todos')}
                  selectedDate={selectedDate}
                />
              </div>
              {/* <div className="col-span-1">
                <GananciaPorColaborador
                  colaboradores={filterDateTotalConPrecioPorColaborador(
                    null,
                    'todos'
                  )}
                  total={(
                    (filterDateTotalConPrecio(null, 'todos') || 0) -
                    (filterDateTotalConIGV(null, 'todos') || 0) +
                    filterDateTotalConPerdida(null)
                  ).toFixed(2)}
                  selectedDate={selectedDate}
                />
              </div> */}
            </div>
            {/* GRAFICO 3 */}
            <div className="w-full grid grid-cols-3 my-4">
              <div className="col-span-1">
                <GrficoPorTipodeIngreso
                  colaboradores={filterDateTotalPostVentaGrafico(null, 'todos')}
                  selectedDate={selectedDate}
                />
              </div>
              <div className="col-span-2">
                <EstadosPorMeses proyectos={filterDatePorEstadosGrafico()} />
              </div>
            </div>
          </>
        ) : (
          <Loading />
        )}
      </section>
      {/* <ModalLista2
        open={open2}
        setOpen={setOpen2}
        colaboradores={colaboradores}
      /> */}
    </>
  )
}
