/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-unmodified-loop-condition */
import {
  useState,
  useEffect,
  createContext,
  type ReactNode,
  type Dispatch,
  type SetStateAction
} from 'react'
import { Global } from '../helper/Global'
import axios from 'axios'
import { type UserSchema } from './UserSchema'
import { useNavigate } from 'react-router-dom'
import { type errorValues, type notificacionesValues, type RolsValues } from '../components/shared/schemas/Interfaces'
import io from 'socket.io-client'
import { getVentas } from '../components/shared/FetchingData'

export interface AuthContextValue {
  auth: typeof UserSchema
  roles: RolsValues[]
  setRoles: Dispatch<SetStateAction<RolsValues[]>>
  setAuth: Dispatch<SetStateAction<typeof UserSchema>>
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
  title: string
  setTitle: Dispatch<SetStateAction<string>>
  loadingComponents: boolean
  setLoadingComponents: Dispatch<SetStateAction<boolean>>
  setNotificaciones: Dispatch<SetStateAction<notificacionesValues[]>>
  notificaciones: notificacionesValues[]
  setEstado: Dispatch<SetStateAction<number>>
  estado: number
  totalNotificaciones: number
  loadingNotifi: boolean
  totalNotiClientes: number
  totalNotificaciones3: number
  setShowError: Dispatch<SetStateAction<errorValues | null>>
  showError: errorValues | null
  openModalShared: boolean
  setOpenModalShared: Dispatch<SetStateAction<boolean>>
  tasks: never[]
  getContenidoCompartido: any
  openSidebar: boolean
  setOpenSidebar: Dispatch<SetStateAction<boolean>>
  downloadProgress: number
  setDownloadProgress: Dispatch<SetStateAction<number>>
  notificacionesDesarrollo: any
  notificateToReuniones: any
  setopenNotificacionReuniones: any
  openNotificacionReuniones: any
  gestorCompartido: any | null
  setGestorCompartido: any
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({
  children
}: {
  children: ReactNode
}): JSX.Element => {
  const [loading, setLoading] = useState(true)
  const [auth, setAuth] = useState<typeof UserSchema>({
    id: '',
    name: '',
    email: '',
    email_alter: '',
    firma: '',
    pass_email: '',
    id_rol: 0,
    rol: ''
  })
  const [roles, setRoles] = useState<RolsValues[]>([
    { id: 0, slug: '', accesos: '', created_at: '', updated_at: '' }
  ])
  const navigate = useNavigate()
  const [gestorCompartido, setGestorCompartido] = useState<any | null>(null)
  const [title, setTitle] = useState('')
  const [openSidebar, setOpenSidebar] = useState(false)
  const [showError, setShowError] = useState<errorValues | null>(null)
  const [estado, setEstado] = useState(0)
  const [loadingComponents, setLoadingComponents] = useState(false)
  const [openNotificacionReuniones, setopenNotificacionReuniones] = useState(false)
  const [openModalShared, setOpenModalShared] = useState(false)
  const token = localStorage.getItem('token')
  const user = localStorage.getItem('user')
  const [loadingNotifi, setLoadingNotifi] = useState(true)
  const [, setTotalRegistros] = useState(0)
  const [totalNotiClientes, setTotalNotiClientes] = useState(0)
  const [totalNotificaciones, setTotalRegistros2] = useState(0)
  const [totalNotificaciones3, setTotalRegistros3] = useState(0)
  const [notificacionesDesarrollo, setNotificacionesDesarrollo] = useState(0)
  const [notificaciones, setNotificaciones] = useState<notificacionesValues[]>(
    []
  )
  const [notificateToReuniones, setNotificacteToReuniones] = useState<any | null>(null)
  const [downloadProgress, setDownloadProgress] = useState(0)
  const [tasks, setTasks] = useState([])

  const showNotification = (nombre: string, contenido: string): void => {
    // Verificar si las notificaciones son compatibles con el navegador
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          // Configuración de la notificación
          const options: NotificationOptions = {
            body: contenido,
            icon: 'https://logosperu.com.pe/assets/images/logos/logo.webp', // Puedes proporcionar una URL de imagen
            silent: true
          }

          // Crear y mostrar la notificación
          const notification = new Notification(nombre, options)
          // Manejar clics en la notificación
          notification.onclick = () => {
            // Puedes agregar lógica para manejar el clic aquí
          }
        }
      })
    }
  }

  const showNotification2 = (nombre: string, contenido: string, id: any): void => {
    if ('Notification' in window) {
      Notification.requestPermission().then((permission) => {
        if (permission === 'granted') {
          const options: NotificationOptions = {
            body: contenido,
            icon: 'https://logosperu.com.pe/assets/images/logos/logo.webp',
            silent: true
          }
          const notification = new Notification(nombre, options)
          notification.onclick = () => {
            navigate(`/admin/gestor-tareas/citas-reuniones/${id ?? ''}`)
          }
        }
      })
    }
  }

  const authUser = async (): Promise<false | undefined> => {
    if (!token || !user) {
      setLoading(false)
      return false
    }
    try {
      const respuesta = await axios.get(`${Global.url}/user-profile`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      })
      const request2 = await axios.get(
        `${Global.url}/getNotificacionesReuniones/${respuesta.data.user.id ?? ''}`,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      setNotificacteToReuniones(request2.data)
      // Ensure this is called only once
      // @ts-expect-error
      if (request2.data && !window.notificationsConfigured) {
        configurarNotificaciones(request2.data)
        // @ts-expect-error
        window.notificationsConfigured = true
      }
      setAuth(respuesta.data.user)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const configurarNotificaciones = (reuniones: any[]): void => {
    const idsNotificados = new Set()
    reuniones.forEach((reunion: any) => {
      const reunionId = reunion.id
      if (!idsNotificados.has(reunionId)) {
        const horaInicio = JSON.parse(reunion.hora_inicio).timeinicio
        const fechaInicio = JSON.parse(reunion.hora_inicio).dateinicio
        const fechaHoraInicio = new Date(`${fechaInicio}T${horaInicio}`)
        const now = new Date()
        const tiempoHastaInicio = fechaHoraInicio.getTime() - now.getTime()
        const quinceMinutosAntes = fechaHoraInicio.getTime() - 15 * 60 * 1000 - now.getTime()
        const cincoMinutosAntes = fechaHoraInicio.getTime() - 5 * 60 * 1000 - now.getTime()
        if (quinceMinutosAntes > 0) {
          setTimeout(() => {
            const cuerpoQuinceMin = `La ${reunion.tipo} empieza en 15 minutos.`
            showNotification2(reunion.asunto, cuerpoQuinceMin, reunion.idContenido)
          }, quinceMinutosAntes)
        }
        if (cincoMinutosAntes > 0) {
          setTimeout(() => {
            const cuerpoCincoMin = `La ${reunion.tipo} empieza en 5 minutos.`
            showNotification2(reunion.asunto, cuerpoCincoMin, reunion.id)
          }, cincoMinutosAntes)
        }
        if (tiempoHastaInicio > 0) {
          setTimeout(() => {
            const cuerpoInicio = `La ${reunion.tipo} empieza ahora.`
            showNotification2(reunion.asunto, cuerpoInicio, reunion.id)
          }, tiempoHastaInicio)
          idsNotificados.add(reunionId)
        }
      }
    })
  }

  const getRoles = async (): Promise<void> => {
    try {
      const request = await axios.get(`${Global.url}/getRoles`, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })
      setRoles(request.data)
    } catch (error: any) {
      if (
        typeof error.request?.response == 'string' &&
        error.request.response.includes('Unauthenticated')
      ) {
        localStorage.clear()
        setAuth({ id: '', name: '', email: '', email_alter: '', pass_email: '', firma: '', id_rol: 0, rol: '' })
        navigate('/login')
      }
    }
  }

  const getDataGeneral = async (): Promise<void> => {
    const today = new Date() // Obtiene la fecha actual
    let dateOne = new Date(today.getFullYear(), today.getMonth(), today.getDate()) // Mismo día del mes actual
    let dateTwo = new Date(today.getFullYear(), today.getMonth(), today.getDate()) // Mismo día del mes actual
    dateOne.setMonth(dateOne.getMonth() - 1) // Ajusta al mes anterior
    dateTwo.setMonth(dateTwo.getMonth() - 1) // Ajusta al mes anterior
    // Si estamos en enero, ajusta al mismo día del mes anterior del año pasado
    if (today.getMonth() === 0) {
      dateOne = new Date(today.getFullYear() - 1, 11, today.getDate())
      dateTwo = new Date(today.getFullYear() - 1, 11, today.getDate())
    }
    // Agrega un día a la primera fecha
    dateOne.setDate(dateOne.getDate() + 1)
    // Agrega tres días a la segunda fecha
    dateTwo.setDate(dateTwo.getDate() + 3)
    // Formatea las fechas en el formato deseado (dd/mm/yyyy)
    const formattedFechaInicio = `${dateOne.getDate()}/${dateOne.getMonth() + 1}/${dateOne.getFullYear()}`
    const formattedFechaFin = `${dateTwo.getDate()}/${dateTwo.getMonth() + 1}/${dateTwo.getFullYear()}`
    const data = new FormData()
    data.append('fechaInicio', formattedFechaInicio)
    data.append('fechaFin', formattedFechaFin)

    const request = await axios.post(`${Global.url}/indexToPorVencer`, data, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setNotificaciones(request.data)
    setTotalRegistros3(request.data.length)
  }

  const getContenidoCompartido = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/gestorContenido/findByMiembros/${auth.id}`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? `Bearer ${token}` : ''}`
      }
    })
    setTasks(request.data)
  }

  useEffect(() => {
    if (!token || !user) {
      return
    }
    const socket = io('https://prueba.logosperu.com.pe', {
      transports: ['websocket']
    })
    socket.on('connect', () => {
    //   console.log('Conexión WebSocket establecida con éxito')
    })
    if (!loading) {
      // PROYECTOS DE AGENCIA
      socket.on('mensaje', (data) => {
        const filteredNotifications = JSON.parse(data.asignacion).filter((item: any) => item.peso == auth.id)
        if (data.id_usuario != auth.id) {
          if (auth.id_rol == 99) {
            showNotification(data.nombre, data.contenido)
          } else if ((filteredNotifications.length > 0) || data.id_venta == auth.id) {
            showNotification(data.nombre, data.contenido)
          }
        }
        if (estado == 0) {
          Promise.all([
            getVentas(`getNotificaciones/${auth.id}/${auth.id_rol}`, setNotificaciones, setTotalRegistros2)
          ]).then(() => {
            // setLoading(false)
          })
        } else {
          Promise.all([
            getVentas(`getNotificacionesAll/${auth.id}/${auth.id_rol}`, setNotificaciones, setTotalRegistros)
          ]).then(() => {
            // setLoading(false)
          })
        }
      })
      //   DESCARGA DE ARCHIVOS
      socket.on('mensaje2', (data) => {
        if (auth.id == '8') {
          showNotification(data.nombre, data.contenido)
        }
        if (estado == 2) {
          Promise.all([
            getVentas('getNotificacionesToClientes', setNotificaciones, setTotalNotiClientes)
          ]).then(() => {
            setLoadingNotifi(false)
          })
        }
      })

      socket.on('mensaje3', (data) => {
        console.log(data.asignacion)
        const filteredNotifications = JSON.parse(data.asignacion).filter((item: any) => item.peso == auth.id)
        if (data.id_usuario != auth.id) {
          if (auth.id_rol == 99) {
            showNotification(data.nombre, data.contenido)
          } else if ((filteredNotifications.length > 0) || data.id_venta == auth.id) {
            showNotification(data.nombre, data.contenido)
          }
        }
        if (estado == 0) {
          Promise.all([
            getVentas(`getNotificaciones/${auth.id}/${auth.id_rol}`, setNotificaciones, setTotalRegistros2)
          ]).then(() => {
            // setLoading(false)
          })
        } else {
          Promise.all([
            getVentas(`getNotificacionesAll/${auth.id}/${auth.id_rol}`, setNotificaciones, setTotalRegistros)
          ]).then(() => {
            // setLoading(false)
          })
        }
      })
    }
    socket.on('disconnect', (_reason) => {
    //   console.log('Conexión WebSocket cerrada:', reason)
    })
    socket.on('error', (error) => {
      console.error('Error en la conexión WebSocket:', error)
    })
    return () => {
      socket.disconnect()
    }
  }, [loading])

  useEffect(() => {
    setLoadingNotifi(true)
    if (!token || !user) {
      return
    }
    if (!loading) {
      getContenidoCompartido()
      if (estado == 0) {
        Promise.all([
          getVentas(`getNotificaciones/${auth.id}/${auth.id_rol}`, setNotificaciones, setTotalRegistros2)
        ]).then(() => {
          setLoadingNotifi(false)
        })
      } else if (estado == 1) {
        Promise.all([
          getVentas(`getNotificacionesAll/${auth.id}/${auth.id_rol}`, setNotificaciones, setTotalRegistros)

        ]).then(() => {
          setLoadingNotifi(false)
        })
      } else if (estado == 2) {
        Promise.all([
          getVentas('getNotificacionesToClientes', setNotificaciones, setTotalNotiClientes)
        ]).then(() => {
          setLoadingNotifi(false)
        })
      } else if (estado == 3) {
        Promise.all([
          getDataGeneral()
        ]).then(() => {
          setLoadingNotifi(false)
        })
      }
    }
  }, [estado, loading])

  const getData = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getNotificacionesToClientes`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setTotalNotiClientes(request.data.length)
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

  const getDataDesarrollo = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/notificacionesDesarrollo`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    const registrosFiltrados = request.data
      .filter((registro: any) => {
        const diasRestantes = obtenerDiasParaMantenimiento(registro)
        return typeof diasRestantes === 'number' && diasRestantes < 3
      })
      .sort((a: any, b: any) => {
        const diasA = obtenerDiasParaMantenimiento(a) as number
        const diasB = obtenerDiasParaMantenimiento(b) as number
        return diasA - diasB
      })
    setNotificacionesDesarrollo(registrosFiltrados)
  }

  useEffect(() => {
    setLoadingNotifi(true)
    if (!token || !user) {
      setLoading(false)
      return
    }
    Promise.all([authUser(), getRoles(), getData(), getDataGeneral(), getDataDesarrollo()]).then(() => {
      setLoading(false)
      if (!loading) {
        if (estado == 0) {
          Promise.all([
            getVentas(`getNotificaciones/${auth.id}/${auth.id_rol}`, setNotificaciones, setTotalRegistros2)
          ]).then(() => {
            setLoadingNotifi(false)
          })
        } else if (estado == 1) {
          Promise.all([
            getVentas(`getNotificacionesAll/${auth.id}/${auth.id_rol}`, setNotificaciones, setTotalRegistros)
          ]).then(() => {
            setLoadingNotifi(false)
          })
        } else if (estado == 2) {
          Promise.all([
            getVentas('getNotificacionesToClientes', setNotificaciones, setTotalNotiClientes)
          ]).then(() => {
            setLoadingNotifi(false)
          })
        } else if (estado == 3) {
          Promise.all([
            getDataGeneral()
          ]).then(() => {
            setLoadingNotifi(false)
          })
        }
      }
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        openNotificacionReuniones,
        setopenNotificacionReuniones,
        notificateToReuniones,
        auth,
        setAuth,
        loading,
        setLoading,
        title,
        roles,
        setRoles,
        setTitle,
        loadingComponents,
        setLoadingComponents,
        setNotificaciones,
        notificaciones,
        estado,
        setEstado,
        totalNotificaciones,
        loadingNotifi,
        totalNotiClientes,
        totalNotificaciones3,
        showError,
        setShowError,
        openModalShared,
        setOpenModalShared,
        tasks,
        getContenidoCompartido,
        openSidebar,
        setOpenSidebar,
        downloadProgress,
        setDownloadProgress,
        notificacionesDesarrollo,
        gestorCompartido,
        setGestorCompartido
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
