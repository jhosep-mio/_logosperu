/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Fragment, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import Swal, { type SweetAlertResult } from 'sweetalert2'
import { Loading } from '../../../shared/Loading'
import { useFormik } from 'formik'
import { SchemaPropuestas } from '../../../shared/schemas/Schemas'
import { Errors } from '../../../shared/Errors'
import { SwiperAvances } from './SwiperAvances'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { ModalRegistro } from './ModalRegistro'
import { ViewAvance } from './ViewAvance'
import { FiInstagram } from 'react-icons/fi'
import { BsChatRightText, BsFillGiftFill } from 'react-icons/bs'
import { FaWhatsapp, FaFacebookF } from 'react-icons/fa'
import vieweb from '../../../../assets/webView.svg'
import { TfiWorld } from 'react-icons/tfi'
import { motion, useAnimation } from 'framer-motion'
import {
  CiViewTimeline,
  CiPaperplane,
  CiCircleCheck,
  CiGlobe,
  CiMonitor,
  CiEdit
} from 'react-icons/ci'
import { IoSaveOutline } from 'react-icons/io5'
import { PiCheck } from 'react-icons/pi'
import {
  type valuesResumen,
  type FinalValues,
  type arrayCorreos,
  type avanceValues,
  type ValuesPlanes
} from '../../../shared/schemas/Interfaces'
import { ArchivosFinales } from './ArchivosFinales'
import { ViewFinal } from './ViewFinal'
import { ViewActa } from './ViewActa'
// import { Chat } from './Chat'
import { RegistroMarca } from './RegistroMarca'
import { RegistroMail } from './RegistroMail'
import { ModalActaEstado } from './modals/ModalActaEstado'
import { ModalCorreoFinal2 } from './ModalCorreoFinal2'
import { RegistroEmail2 } from './RegistroEmail2'
import { ModalaAvisonNotificacion } from './avisoNotificacion/ModalaAvisonNotificacion'
import { ModalActaAceptacion } from './actaAceptacion/ModalActaAceptacion'
import { IndexComunity } from './community/IndexComunity'
import { ViewAlta } from './modals/ViewAlta'
import { OnlyCalendario } from './community/OnlyCalendario'
import { ModalDescripcion2 } from './community/ModalDescripcion2'
import { ModalObsequios } from './obsequios/ModalObsequios'
import { PlanLogotipo } from './forms/PlanLogotipo'

interface Dataweb {
  dominio: string
  domain_temp: string
  cant_correos: string
  porcentaje_proyecto: string
  procesos: Proceso[]
  domain_owner: string
  hosting_owner: string
}

interface Proceso {
  nombre: string
  fecha: string
  icono: string
}
interface valuesDatos {
  idCliente: string
  nombres: string
  email: string
  marca: string
  celular: string
  id_contrato: string
  comentarios: string
}

interface values {
  nombres: string
  email: string
  correo: string
  celular: string
  fecha: string
  hora_acta: string
  nombre_marca: string
  archivos: string
  id_contrato: string
  fecha_fin: string
  fecha_inicio: string
  observaciones: string
  comunnity: string
}

interface Datadiseno {
  propuestas: boolean
  fecha_propuestas: string
  envio_informacion: boolean
  fecha_informacion: string
}

export const Avances2 = (): JSX.Element => {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const { setTitle, auth } = useAuth()
  const [, setHostingActivo] = useState(false)
  const [loading, setLoading] = useState(true)
  const [plan, setplan] = useState<ValuesPlanes | null>(null)
  const [open, setOpen] = useState(false)
  const [openCorreoActa, setOpenCorreoActa] = useState(false)
  const [openAvisoNotificacion, setOpenAvisoNotificacion] = useState(false)
  const [openActaAceptacion, setOpenActaAceptacion] = useState(false)
  const [, setOpenQuestion] = useState(false)
  const [openObsequio, setOpenObsequio] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [selectIDCLIENTE, setSelectIDCLIENTE] = useState(0)
  const [selectedItem, setSelectedItem] = useState<Event | null>(null)
  const [percentage, setPercentage] = useState(0) // Estado para almacenar el porcentaje
  const [datos, setDatos] = useState<values>({
    nombres: '',
    email: '',
    correo: '',
    celular: '',
    fecha: '',
    hora_acta: '',
    nombre_marca: '',
    archivos: '',
    id_contrato: '',
    fecha_fin: '',
    fecha_inicio: '',
    observaciones: '',
    comunnity: ''
  })
  //   const [openChat, setOpenChat] = useState(false)
  const [openMail, setOpenMail] = useState(false)
  const [usuarios, setUsuarios] = useState<never[]>([])
  const [openCorreoFinal, setOpenCorreoFinal] = useState(false)
  const [arrayAvances, setArrayAvances] = useState([])
  const [arrayAlta, setArrayAlta] = useState<any | null>(null)
  const [arrayFinal, setArrayFinal] = useState([])
  const [arrayActa, setArrayActa] = useState([])
  const [openActa, setOpenActa] = useState(false)
  const [datos2, setDatos2] = useState<valuesDatos | null>(null)
  const [pdfName, setpdfName] = useState<string | undefined>('')
  const [avance, setAvance] = useState<avanceValues>({
    contexto: '',
    imagenes: [],
    archivos: [],
    correos: [],
    asunto: '',
    conclusion: '',
    contacto: '',
    empresa: '',
    fechaacta: '',
    firma: '',
    motivo: '',
    fecha: '',
    hora: ''
  })
  const [final, setfinal] = useState<FinalValues>({
    contexto: '',
    correos: [],
    asunto: '',
    fecha: '',
    hora: '',
    firma: ''
  })
  const [fechaCreacion, setFechaCreacion] = useState<Date | null>(null)
  const [openAvance, setOpenAvance] = useState(false)
  const [, setHosting] = useState<any | null>(null)
  const [, setCapacitacion] = useState<any | null>(null)
  const [openFinal, setOpenFinal] = useState(false)
  const [openAlta, setopenAlta] = useState(false)
  const [openMarca, setOpenMarca] = useState(false)
  const [correos, setCorreos] = useState<arrayCorreos[]>([])
  const [, setResumen] = useState<valuesResumen[]>([])
  const [colaboradores, setColaboradores] = useState([])
  const [colaborador, setColaborador] = useState([])
  const [limite, setLimite] = useState(0)
  const [openMailFinal, setOpenMailFinal] = useState(false)
  const [validateBrief, seValidateBrief] = useState<boolean | null>(null)
  const [events, setEvents] = useState<Event[]>([])
  const [brief, setBrief] = useState<any | null>(null)
  const [communityActivo, setCommunityActivo] = useState('true')

  const updatePropuestas = async (): Promise<void> => {
    setLoading(true)
    const data = new FormData()
    data.append('comentarios', values.comentarios)
    data.append('data_web', JSON.stringify(dataWeb))
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/updatePropuestas/${id ?? ''}`,
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
        Swal.fire('Actualización exitosa', '', 'success')
        getOneBrief2()
      } else {
        Swal.fire('Error al actualizar', '', 'error')
      }
    } catch (error: unknown) {
      Swal.fire('Error', '', 'error')
    }
    setLoading(false)
  }

  // PARA ACTUALIZAR EL ENVIO DE PROPUESTAS EN LA ESTRUCTURA DE DISEÑO
  const updateStructuraDiseno = async (dataDiseno: Datadiseno): Promise<void> => {
    setLoading(true)
    const data = new FormData()
    data.append('comentarios', values.comentarios)
    data.append('data_web', JSON.stringify(dataWeb))
    data.append('data_diseno', JSON.stringify(dataDiseno))

    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/updatePropuestas/${id ?? ''}`,
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
        Swal.fire('Actualización exitosa', '', 'success')
        getOneBrief2()
      } else {
        Swal.fire('Error al actualizar', '', 'error')
      }
    } catch (error: unknown) {
      Swal.fire('Error', '', 'error')
    }
    setLoading(false)
  }

  const parseFecha = (fechaString: string): Date => {
    const [dia, mes, ano] = fechaString.split('/')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return new Date(ano, mes - 1, dia)
  }

  const cards = [
    {
      id: 1,
      title: 'Calendario comunnity'
    }
  ]

  const {
    handleSubmit,
    handleChange,
    setValues,
    errors,
    values,
    touched,
    handleBlur,
    isSubmitting
  } = useFormik({
    initialValues: {
      link_final: '',
      fecha_fin: '',
      comentarios: '',
      propuestas: '',
      archivos_avances: ''
    },
    validationSchema: SchemaPropuestas,
    onSubmit: updatePropuestas
  })
  // dataUpdatedWeb
  const [dataUpdatedWeb, setDataUpdatedWeb] = useState<Dataweb>({
    cant_correos: '',
    domain_temp: '',
    dominio: '',
    porcentaje_proyecto: '',
    procesos: [],
    domain_owner: '',
    hosting_owner: ''
  })

  const getOneBrief = async (): Promise<void> => {
    try {
      const request = await axios.get(`${Global.url}/getVenta/${id ?? ''}`, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      })
      const codContr: string = request.data[0].id_contrato.split('_')[0]
      const requestPlan = await axios.get(
        `${Global.url}/onePlanToNombre/${codContr ?? ''}`,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? `Bearer ${token}` : ''
            }`
          }
        }
      )
      setplan(requestPlan.data[0])
      if (request.data[0].contrato) {
        setBrief({
          codigo: request.data[0].contrato.codigo,
          uso: request.data[0].contrato.uso
        })
      } else {
        setBrief({ codigo: request.data[0].codigo, uso: request.data[0].uso })
      }

      if (request.data[0].hosting) {
        setHosting(JSON.parse(request.data[0].hosting))
      }

      if (request.data[0].capacitacion) {
        setCapacitacion(JSON.parse(request.data[0].capacitacion))
      }

      if (request.data[0].community_activo) {
        setCommunityActivo(request.data[0].community_activo)
      }

      if (request.data[0].activehosting) {
        setHostingActivo(request.data[0].activehosting)
      }

      if (requestPlan.data[0].tipo?.includes('Diseño Logotipo')) {
        const respuesta = await axios.get(
          `${Global.url}/oneBriefDiseñoNewToSeguimiento/${id ?? ''}`,
          {
            headers: {
              Authorization: `Bearer ${
                token !== null && token !== '' ? `Bearer ${token}` : ''
              }`
            }
          }
        )
        if (respuesta.data[0]) {
          seValidateBrief(true)
        } else {
          seValidateBrief(false)
        }
      } else if (codContr == 'LPBRO') {
        const respuesta = await axios.get(
          `${Global.url}/oneBriefBrochureToSeguimiento/${id ?? ''}`,
          {
            headers: {
              Authorization: `Bearer ${
                token !== null && token !== '' ? `Bearer ${token}` : ''
              }`
            }
          }
        )
        if (respuesta.data[0]) {
          seValidateBrief(true)
        } else {
          seValidateBrief(false)
        }
      } else if (codContr == 'LPFLYER') {
        const respuesta = await axios.get(
          `${Global.url}/oneBriefFlyerToSeguimiento/${id ?? ''}`,
          {
            headers: {
              Authorization: `Bearer ${
                token !== null && token !== '' ? `Bearer ${token}` : ''
              }`
            }
          }
        )
        if (respuesta.data[0]) {
          seValidateBrief(true)
        } else {
          seValidateBrief(false)
        }
      } else {
        seValidateBrief(null)
      }
      //   setplanes(requestPlan.data[0])
      if (request.data[0].limitar_archivos) {
        setLimite(request.data[0].limitar_archivos)
      }
      setValues({
        ...values,
        comentarios: request.data[0].comentarios,
        link_final: request.data[0].archivos_finales,
        propuestas: request.data[0].propuestas,
        fecha_fin: request.data[0].fecha_fin,
        archivos_avances: request.data[0].archivos_avances
      })

      setDatos2({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        nombres: `${request.data[0].nombres} ${request.data[0].apellidos}`,
        idCliente: request.data[0].id_cliente,
        celular: request.data[0].celular,
        email: request.data[0].email,
        marca: request.data[0].nombre_marca,
        id_contrato: request.data[0].id_contrato,
        comentarios: request.data[0].comentarios
      })
      if (request.data[0].data_web) {
        setDataUpdatedWeb(JSON.parse(request.data[0].data_web))
      }

      if (request.data[0].data_diseno) {
        setDataUpdatedDiseno(JSON.parse(request.data[0].data_diseno))
      }

      setpdfName(request.data[0].propuestas)
      setColaborador(
        request.data[0].asignacion ? JSON.parse(request.data[0].asignacion) : []
      )
      if (request.data[0].array_avances) {
        setArrayAvances(JSON.parse(request.data[0].array_avances))
      } else {
        setArrayAvances([])
      }
      if (request.data[0].array_final) {
        setArrayFinal(JSON.parse(request.data[0].array_final))
      } else {
        setArrayFinal([])
      }

      if (request.data[0].contenido) {
        setArrayAlta(JSON.parse(request.data[0].contenido))
      }
      if (request.data[0].acta_aceptacion) {
        setArrayActa(JSON.parse(request.data[0].acta_aceptacion))
      } else {
        setArrayActa([])
      }
      if (request.data[0].resumen) {
        setResumen(JSON.parse(request.data[0].resumen))
      } else {
        setResumen([])
      }
      setFechaInicial(request.data[0].fecha_inicio)

      if (request.data[0].fecha_fin) {
        setFechaCreacion(parseFecha(request.data[0].fecha_fin))
      }
      setTitle(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `${request.data[0].nombres} ${request.data[0].apellidos} - ${
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          request.data[0].nombre_marca
            ? request.data[0].nombre_marca
            : 'No registrado'
        }`
      )
      setSelectIDCLIENTE(request.data[0].id_cliente)
      setDatos((prevDatos) => ({
        ...prevDatos,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        nombres: `${request.data[0].nombres} ${request.data[0].apellidos}`,
        nombre_empresa_final: request.data[0].nombre_empresa,
        empresa: request.data[0].nombre_empresa,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        correo: `${request.data[0].email}`,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        email: `${request.data[0].email}`,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        celular: `${request.data[0].celular}`,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        fecha: `${request.data[0].array_final}`,
        hora_acta: `${
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          request.data[0].hora_acta ? request.data[0].hora_acta : ''
        }`,
        nombre_marca: `${
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          request.data[0].nombre_marca ? request.data[0].nombre_marca : ''
        }`,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        archivos: `${request.data[0].acta_aceptacion}`,
        id_contrato: request.data[0].id_contrato,
        brief: request.data[0]?.uso == 1 ? 1 : request.data[0].contrato?.uso == 1 ? 1 : 0,
        fecha_fin: request.data[0].fecha_fin,
        fecha_inicio: request.data[0].fecha_inicio,
        observaciones: request.data[0].observaciones,
        comunnity: request.data[0].community
          ? JSON.parse(request.data[0].community)
          : [],
        aprobacion: request.data[0].aprobacion
          ? JSON.parse(request.data[0].aprobacion)
          : []
      }))
      setEvents(
        request.data[0].community ? JSON.parse(request.data[0].community) : []
      )

      if (request.data[0].email && request.data[0].email != null) {
        setCorreos([
          ...correos,
          { id: Date.now(), correo: request.data[0].email }
        ])
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }
  const [dataUpdatedDiseno, setDataUpdatedDiseno] = useState<Datadiseno>({
    propuestas: false,
    fecha_propuestas: '',
    envio_informacion: false,
    fecha_informacion: ''
  })

  const getOneBrief2 = async (): Promise<void> => {
    setLoading(true)
    try {
      const request = await axios.get(`${Global.url}/getVenta/${id ?? ''}`, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      })
      setValues({
        ...values,
        comentarios: request.data[0].comentarios,
        link_final: request.data[0].archivos_finales,
        propuestas: request.data[0].propuestas,
        fecha_fin: request.data[0].fecha_fin,
        archivos_avances: request.data[0].archivos_avances
      })

      setFechaInicial(request.data[0].fecha_inicio)
      if (request.data[0].data_web) {
        setDataUpdatedWeb(JSON.parse(request.data[0].data_web))
      }
      if (request.data[0].data_diseno) {
        setDataUpdatedDiseno(JSON.parse(request.data[0].data_diseno))
      }

      if (request.data[0].community_activo) {
        console.log(request.data[0].community_activo)
        setCommunityActivo(request.data[0].community_activo)
      }
    } catch (error) {}
    setLoading(false)
  }

  const getColaboradores = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getColaboradores`, {
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
    getColaboradores()
    getUsuarios()
  }, [])

  useEffect(() => {
    setLimite(0)
    getOneBrief()
  }, [id])

  useEffect(() => {
    if (errors && isSubmitting) {
      const firstErrorKey = Object.keys(errors)[0]
      const firstErrorElement = document.getElementsByName(firstErrorKey)[0]
      if (firstErrorElement) {
        firstErrorElement.focus()
      }
    }
  }, [touched, errors, isSubmitting])

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

  useEffect(() => {
    if (values.fecha_fin) {
      setPercentage(100)
    } else {
      setPercentage(0)
    }
  }, [values.fecha_fin])

  const handleInputChange = (event: any): void => {
    // Actualizar el estado del porcentaje cuando cambia el valor del input
    setPercentage(event.target.value)
  }
  const fillAnimation = useAnimation()

  useEffect(() => {
    const circumference = 2 * Math.PI * 50 // Circunferencia del círculo
    let progress = (circumference * percentage) / 100 // Longitud del borde de progreso

    // Ajuste para asegurarse de que el borde se extienda completamente alrededor del círculo
    progress = Math.min(progress, circumference)

    fillAnimation.start({
      strokeDasharray: `${progress} ${circumference}`,
      transition: {
        duration: 1,
        type: 'spring',
        stiffness: 100
      }
    })
  }, [percentage, fillAnimation])

  const calculateX = (percentage: number): number => {
    return 59 + 50 * Math.sin((2 * Math.PI * percentage) / 100)
  }

  // Función para calcular las coordenadas Y de la posición final del arco
  const calculateY = (percentage: number): number => {
    return 60 - 50 * Math.cos((2 * Math.PI * percentage) / 100)
  }
  // const [procesosActivos, setProcesosActivos] = useState<number[]>([])
  // const agregarProceso = (id: number): void => {
  //   const procesosActivosCopy = [...procesosActivos]
  //   procesosActivosCopy.push(id)
  //   setProcesosActivos(procesosActivosCopy)
  // }
  const [openModalProcess, setOpenModalProcess] = useState(false)

  const procesos: Proceso[] = [
    {
      nombre: 'Brief',
      fecha: 'Sin fecha',
      icono: 'br'
    },
    {
      nombre: '1° Avance',
      fecha: 'Sin fecha',
      icono: 'av'
    },
    {
      nombre: '2° Avance',
      fecha: 'Sin fecha',
      icono: 'av'
    },
    {
      nombre: '3° Avance',
      fecha: 'Sin fecha',
      icono: 'av'
    },
    {
      nombre: 'Capacitación',
      fecha: 'Sin fecha',
      icono: 'cap'
    },
    {
      nombre: 'Dominio',
      fecha: 'Sin fecha',
      icono: 'dom'
    },
    {
      nombre: 'Finalizado',
      fecha: 'Sin fecha',
      icono: 'fin'
    },
    {
      nombre: 'Envío indexación',
      fecha: 'Sin fecha',
      icono: 'cap'
    },
    {
      nombre: 'Indexación completa',
      fecha: 'Sin fecha',
      icono: 'cap'
    }
    // Otros procesos...
  ]

  // const procesos = ['Brief', '1° Avance', '2° Avance', '3° Avance', 'Capacitación', 'Dominio', 'Finalizado']

  const [procesosRegistrados, setProcesosRegistrados] = useState<Proceso[]>([])

  const addProcess = (proceso: Proceso): void => {
    if (!procesosRegistrados.some((p) => p.nombre === proceso.nombre)) {
      setProcesosRegistrados((prevProcesos) => [...prevProcesos, proceso])
    } else {
      setProcesosRegistrados((prevProcesos) =>
        prevProcesos.filter((p) => p.nombre !== proceso.nombre)
      )
    }
  }

  const [activePercentage, setActivePercentage] = useState(false)

  const [activeGroup, setActiveGroup] = useState(false)

  const formatDate = (dateString: string): string => {
    // Separar la fecha en día, mes y año

    if (dateString === '' || dateString === null || dateString === undefined) {
      return '--'
    }

    const [day, month] = dateString.split('/')

    // Mapear los nombres de los meses
    const monthNames: Record<string, string> = {
      '01': 'Ene',
      '02': 'Feb',
      '03': 'Mar',
      '04': 'Abr',
      '05': 'May',
      '06': 'Jun',
      '07': 'Jul',
      '08': 'Ago',
      '09': 'Sep',
      10: 'Oct',
      11: 'Nov',
      12: 'Dic'
    }

    // Obtener el nombre del mes abreviado
    const monthAbbreviation = monthNames[month]

    // Retornar la fecha en el formato deseado
    return `${day} ${monthAbbreviation}`
  }

  const [domainTemp, setDomainTemp] = useState('')
  const [domain, setDomain] = useState('Sin dominio')
  const [cantCorreos, setCantCorreos] = useState('3 correos corporativos')
  const [domainOwner, setDomainOwner] = useState('')
  const [hostingOwner, setHostingOwner] = useState('')
  const [activeDomHosOwner, setActiveDomHosOwner] = useState(false)

  const changeDomainTemp = (event: any): void => {
    setDomainTemp(event.target.value)
  }

  const changeDomain = (event: any): void => {
    setDomain(event.target.value)
  }

  const changeCorreos = (event: any): void => {
    setCantCorreos(event.target.value)
  }

  const changeDomainOwner = (event: any): void => {
    setDomainOwner(event.target.value)
  }

  const changeHostingOwner = (event: any): void => {
    setHostingOwner(event.target.value)
  }

  const dataWeb = {
    dominio: domain,
    domain_temp: datos.id_contrato.includes('LPSEP') ? `https://www.google.com/search?q=${domainTemp}` : domainTemp,
    cant_correos: cantCorreos,
    porcentaje_proyecto: percentage,
    procesos: procesosRegistrados,
    domain_owner: domainOwner,
    hosting_owner: hostingOwner
  }

  function limpiarDominio (url: string): string | null {
    // eslint-disable-next-line no-useless-escape
    const patron: RegExp = /^(?:https?:\/\/)?(?:www\.)?([^:\/\n?]+)/g
    // Busca el patrón en la URL
    const coincidencia: RegExpMatchArray | null = url.match(patron)
    if (coincidencia) {
      // Elimina "www." si está presente
      let dominio: string = coincidencia[0].replace('www.', '')
      // Elimina "https://" si está presente
      dominio = dominio.replace('https://', '')
      return dominio
    } else {
      return null
    }
  }

  function obtenerFechaActual (): string {
    const fechaActual: Date = new Date()

    const año: number = fechaActual.getFullYear()
    const mes: string = agregarCeroAlInicio(fechaActual.getMonth() + 1)
    const dia: string = agregarCeroAlInicio(fechaActual.getDate())

    const fechaFormateada: string = `${año}-${mes}-${dia}`
    return fechaFormateada
  }

  function agregarCeroAlInicio (numero: number): string {
    return numero < 10 ? '0' + String(numero) : numero.toString()
  }

  function obtenerDiaMes (fecha: string): string {
    if (fecha === 'Sin fecha') {
      return 'Sin fecha'
    }
    const partesFecha: string[] = fecha.split('-')
    const dia: number = parseInt(partesFecha[2], 10)
    const mes: number = parseInt(partesFecha[1], 10)

    // Nombres de los meses
    const nombresMeses: string[] = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre'
    ]

    const nombreMes: string = nombresMeses[mes - 1]

    return `${dia} de ${nombreMes}`
  }

  const updatedProceso = (id: number): void => {
    procesosRegistrados[id].fecha = obtenerFechaActual().toString()
    updatePropuestas()
  }

  useEffect(() => {
    setPercentage(Number(dataUpdatedWeb.porcentaje_proyecto))
    setDomain(
      dataUpdatedWeb.dominio === '' ? 'Sin dominio' : dataUpdatedWeb.dominio
    )
    setDomainTemp(dataUpdatedWeb.domain_temp)
    setProcesosRegistrados(dataUpdatedWeb.procesos)
    setDomainOwner(dataUpdatedWeb.domain_owner)
    setHostingOwner(dataUpdatedWeb.hosting_owner)
  }, [dataUpdatedWeb])

  //   function obtenerFechasDePago (fechaInicial: any, cantidad: any): any {
  //     const partesFecha = fechaInicial.split('/').map(Number)
  //     const dia = partesFecha[0]
  //     const mes = partesFecha[1] - 1
  //     const año = partesFecha[2]

  //     const fechasDePago = []
  //     const fechaActual = new Date(año, mes, dia)

  //     for (let i = 0; i < cantidad; i++) {
  //       fechaActual.setDate(fechaActual.getDate() + 30)
  //       fechasDePago.push(new Date(fechaActual))
  //     }

  //     return fechasDePago
  //   }

  //   function calcularFechaFinal (_fechaInicial: any, fechasDePago: any, otorgarTresDias: any): any {
  //     const hoy = new Date()
  //     // const fechaPago = new Date(fechaInicial)

  //     // Encontrar la última fecha de pago que ya ha pasado
  //     let fechaVencida = null
  //     for (const fecha of fechasDePago) {
  //       if (fecha < hoy) {
  //         fechaVencida = fecha
  //       } else {
  //         break // Salir del bucle cuando se alcanza una fecha futura
  //       }
  //     }

  //     if (!fechaVencida) {
  //       return 'No hay fechas de pago vencidas'
  //     }

  //     // Calcular la fecha final considerando 3 días adicionales si se habilitan
  //     const fechaFinal = new Date(fechaVencida)
  //     if (otorgarTresDias) {
  //       fechaFinal.setDate(fechaFinal.getDate() + 3)
  //     }

  //     return fechaFinal
  //   }

  //   function diferenciaEnDias (fecha1: any, fecha2: any): any {
  //     const unDia = 1000 * 60 * 60 * 24 // Milisegundos en un día
  //     const diferencia = fecha2.getTime() - fecha1.getTime()
  //     return Math.ceil(diferencia / unDia)
  //   }

  const [, setFechaInicial] = useState('')

  //   // Obtener las fechas de pago
  //   const fechasDePago = obtenerFechasDePago(fechaInicial, 10)

  //   // Determinar si se otorgan 3 días adicionales
  //   const otorgarTresDias = true // Cambiar a true si se otorgan 3 días adicionales

  //   // Calcular la fecha final
  //   const fechaFinal = calcularFechaFinal(fechaInicial, fechasDePago, otorgarTresDias)

  //   // Calcular la diferencia en días entre la fecha final y hoy
  //   const hoy = new Date()

  //   let diferenciaDias

  //   if (fechaFinal !== 'No hay fechas de pago vencidas') {
  //     diferenciaDias = diferenciaEnDias(hoy, fechaFinal)
  //   }

  // console.log('Fecha inicial: ', fechaInicial)
  // console.log('Fechas de pago:', fechasDePago.map(fecha => fecha.toLocaleDateString('es-ES')))
  // console.log('Fecha final:', fechaFinal.toLocaleDateString('es-ES'))
  //   console.log('Diferencia en días entre la fecha final y hoy:', diferenciaDias)

  //   const habilitarProyecto = async (): Promise<void> => {
  //     setLoading(true)
  //     const data = new FormData()
  //     data.append('community_activo', 'true')
  //     data.append('_method', 'PUT')
  //     try {
  //       const respuesta = await axios.post(
  //         `${Global.url}/habilitarProyecto/${id ?? ''}`,
  //         data,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${
  //               token !== null && token !== '' ? token : ''
  //             }`
  //           }
  //         }
  //       )
  //       if (respuesta.data.status == 'success') {
  //         Swal.fire('Actualización exitosa', '', 'success')
  //         getOneBrief2()
  //       } else {
  //         Swal.fire('Error al actualizar', '', 'error')
  //       }
  //     } catch (error: unknown) {
  //       Swal.fire('Error', '', 'error')
  //     }
  //     setLoading(false)
  //   }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {(auth.id_rol == 99 && datos?.id_contrato.split('_')[0] == 'LPTV') ||
          (auth.id_rol == 99 && datos?.id_contrato.split('_')[0] == 'LPWA') ||
          datos?.id_contrato.split('_')[0] == 'LPW' ||
          datos?.id_contrato.split('_')[0] == 'LPLANDING' ? (
            <div className="bg-white px-4 py-4 rounded-lg flex items-center justify-between">
              <div className="flex relative gap-6 items-center text-[#252525]">
                <p className="font-semibold">
                  Dominio:
                  <span className="font-normal">
                    <input
                      type="text"
                      disabled={!activeDomHosOwner}
                      value={domainOwner}
                      onChange={changeDomainOwner}
                      className={'text-center bg-transparent '}
                    />
                  </span>
                </p>
                <p className="font-semibold pr-4">
                  Hosting:
                  <span className="font-normal">
                    <input
                      type="text"
                      disabled={!activeDomHosOwner}
                      value={hostingOwner}
                      onChange={changeHostingOwner}
                      className={'text-center bg-transparent '}
                    />
                  </span>
                </p>
                <button
                  type="button"
                  className="w-fit h-fit absolute top-2 bottom-2 my-auto left-full text-2xl text-black"
                  onClick={() => {
                    setActiveDomHosOwner(!activeDomHosOwner)
                  }}
                >
                  <CiEdit />
                </button>
              </div>
              <BsFillGiftFill
                className="text-2xl  rounded-lg text-main hover:text-main_dark transition-colors cursor-pointer"
                onClick={() => {
                  setOpenObsequio(!openObsequio)
                }}
              />
            </div>
              ) : (
                auth.id_rol == 99 &&
            datos?.id_contrato.split('_')[0] != 'LPHOST' && (
              <BsFillGiftFill
                className="text-2xl mt-3  text-main hover:text-main_dark transition-colors cursor-pointer"
                onClick={() => {
                  setOpenObsequio(!openObsequio)
                }}
              />
                )
              )}

          {auth.id_rol == 99 &&
            datos?.id_contrato.split('_')[0] == 'LPHOST' && (
              <div className="w-full flex justify-end absolute right-6 top-2">
                <BsFillGiftFill
                  className="text-2xl  text-main mt-3 hover:text-main_dark transition-colors cursor-pointer"
                  onClick={() => {
                    setOpenObsequio(!openObsequio)
                  }}
                />
              </div>
          )}
          {openModalProcess && (
            <div
              onClick={() => {
                setOpenModalProcess(false)
              }}
              className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-[990]"
            >
              <div
                className="bg-white rounded-lg shadow-md w-full h-fit max-w-[500px] relative z-[995] p-10"
                onClick={(e) => {
                  e.stopPropagation()
                }}
              >
                <h5 className="text-center text-[#252525] text-xl mb-6">
                  Selecciona los procesos
                </h5>

                <div className="flex flex-col gap-2">
                  {procesos.map((proceso, index) => (
                    <button
                      type="button"
                      key={index}
                      className={`
                        border border-[#cecece] shadow-sm rounded-lg py-1 px-4 text-center text-[#252525]
                        ${
                          procesosRegistrados.some(
                            (p) => p.nombre === proceso.nombre
                          )
                            ? ' border_selected_proceso'
                            : ''
                        }
                      `}
                      onClick={() => {
                        addProcess(proceso)
                      }}
                    >
                      {proceso.nombre}
                    </button>
                  ))}

                  <button
                    type="button"
                    className="bg-green-500 text-white mt-4 rounded-lg py-2"
                    onClick={() => {
                      updatePropuestas()
                      setOpenModalProcess(false)
                    }}
                  >
                    Guardar
                  </button>
                </div>
              </div>
            </div>
          )}
          {(datos?.id_contrato.split('_')[0]).includes('LPCM') ? (
            <form className="mt-5 relative" onSubmit={handleSubmit}>

              {/* {((communityActivo === 'false' && diferenciaDias < 0) || (diferenciaDias < 0)) && (
               <div className="absolute bottom-full right-0 bg-red-500 flex items-center gap-5 px-6 py-2 rounded-xl mb-1">
                 <p className='text-white text-lg'>El proyecto esta deshabilitado</p>
                 <button type="button" className='bg-white rounded-lg px-4 py-2 text-red-500 transition-all hover:bg-gray-100' onClick={() => { habilitarProyecto() }}>Habilitar</button>
                </div>

              )} */}
              <section className="grid grid-cols-2 lg:grid-cols-3 gap-5 mt-1">
                <div className="w-full h-[300px] lg:h-[600px] col-span-2 min-h-[300px] lg:min-h-[600px] bg-white rounded-xl p-4 relative overflow-hidden">
                  {/* {diferenciaDias < 0 && (
                    <div className="absolute top-0 left-0 w-full h-full bg_blureado z-[400] "></div>
                  )} */}
                  <IndexComunity
                    cards={cards}
                    datos={datos}
                    getOneBrief={getOneBrief}
                    events={events}
                    setEvents={setEvents}
                    brief={brief}
                    diferenciaDias={0}
                    communityActivo={communityActivo}
                  />
                </div>
                <div className="h-[600px] flex flex-col gap-3 col-span-2 lg:col-span-1">
                  <div className="bg-white rounded-xl w-full pb-6 h-fit p-4">
                    <h2 className="text-[#129990] font-bold text-center w-full uppercase text-[24px]">
                      Métricas
                    </h2>
                    <div className="w-full bg-[#0861F2] py-3 rounded-lg px-3 mt-6 relative cursor-pointer">
                      <FaFacebookF className="text-2xl text-white" />
                      <span className="absolute inset-0 m-auto w-full h-full text-center flex items-center justify-center text-white text-lg mb-[1px]">
                        Facebook
                      </span>
                    </div>
                    <div className='w-full bg-[url("data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBw0NBw0HDQ0HDQcHBw0HBwcNDQ8NDQcNFREWFhURExMYHSggGBoxGxUTITEhJSkrOjouFx8zODMsNygtLisBCgoKDQ0NDw0NFysZFRkrKysrKysrKysrKystKy0tLS0rKysrKysrLS0rLSsrKysrKysrKystLSsrKysrKysrLf/AABEIAIgBcQMBIgACEQEDEQH/xAAbAAADAQEBAQEAAAAAAAAAAAAAAgQBAwYHBf/EABcQAQEBAQAAAAAAAAAAAAAAAAABAhH/xAAaAQEBAQEBAQEAAAAAAAAAAAACAwEHAAYF/8QAGxEAAwEBAQEBAAAAAAAAAAAAAAECAxESEyH/2gAMAwEAAhEDEQA/APO8Y7XJblVaHXeo5g1yXiis9wAAorMaMDQorC0YGsNWHyAAUVhaAAGrC0AAUVhaAAGrC0YGhRWHyYGsUVh4AANWFoAAaoLkGsBqibg1pWl0k8zWlBdJPMYMDeknmMGAuknmMCtb0k8xgVpdIvM1pWl0k8zWla3pJ5mtKC6SeYwYG9B8ztcluVFyW5cwnU6GqJ7klypuS3K06jVE1yXii5LcrTqNUcA63JLlZaG9Qobxiqs9wAAasLRgaFFYWjA1hqwuQACisPAABqwtAAFFYWjGgKKwuTA0GrC5MACisLkAAasLkAAaoLk0MBpk3ma0rW9JPM1pWl0k8zWlBdIvMYMDeknmMGAuknmMGdBdJPM1pQ90HzP1rklypuS3Lkc6n1qomuS3Ki5LcrzqNUTXJblTckuVp1GqJ7ktyouS3K86jVE1yW5UXJbladRqie5Zx3uS3K06iVHEHuS3Kq0N/DAAqrM4DGg1ZjRgaFFYWjAAasLQABRWHgAA1YWgACisLkGNCisLkwNBqwtGABRWHgAA1YXIAA1QHBoYC6SeYwYC6SeY3R0vWt6SeZrelaXSTzN6GMb0HzPS3JblRcluXFp1P11RPckuVNyS5WnUaonuS3Ki5LcrzqNUTXJblTckuVp1GqJ7klypuS3K06jVE1yW5UXJbledRqia5LcqbklytOo1RPcluVFyW5XnUSon4x3uSXK06D6cwa5ZxVWe4YAFFZjQAA1YXJgaxRWFyAaw1YWgACisLQAA1YWgACisPkGNCisLkwNYasLQABRWFoAAaoLkGsBqgODWlBdJPMbrAG9B8z2dyS5U3JLlwlaGqie5LcqLktytOo1RNcluVNyS5WnUaonuSXKm5LcrTqNUTXJblRcluV51GqJ7klypuSXK06jVE9yW5UXJbledRqia5LcqbklytOolRPckuVNyW5XnUaomuS3Ki5LcrTqNUT3JblRcluV51GqJw63JblVaC6hA3jFVZ7gABRWFoGNBqwtGABRWFoAAaszgABRWFoAAasLkGNCisPkwNCisPDA1hqw8AAKKwtAA1vszye+uS3Ki5LcuEKj8xUT3JblRcluSVDVE9yW5UXJLk1Q1RPcluVFyW5VWg1RPckuVNyW5VnUaomuS3Ki5LcrzqNUTXJblTckuVp1EqJ7ktyouS3K86jVE1yW5U3JLladRqie5JcqbktyvOo1RNcluVFyW5WnUaomuS3Km5JcrzqNUT3JblRcluVp1GqJrlnHe5LcrTqNUcQ6XJblZaG/gobxiis9wwNCisLkwNBqwuTAAorC0AANWFyAAUVhaAAGrC0Y0BRWFyY0AvZnk+lXJblRcluXC1R+AqJ7ktyouS3JqhKie5JcqLktySoaonuS3Ki5LckqGqJ7ktyouS3JKhqie5JcqLktyatjVE9yW5UXJblWdRqia5LcqbklytOolRPckuVNyW5XnUaomuS3Ki5LcrTqNUT3JLlTckuV51GqJ7ktyouS3K06jVE1yW5U3JLledRqie5JcqbktytOo1RNcluVFyW5WnUaonuSXKm5JcrzqNUT2Md7ktytOovRyB7kvFVZv4YAFFZnDA0KKw+TA1hqwuQACisLQAA1YWgABez3D6tcluVFyW5cPVHySonuS3Ki5LcmqGqJrktyouS3JKhqie5LcqLktySoSonuSXKm5JckqGqJ7ktyouS3JKhqie5LcqLktyaoaonuSXKm5JckqGqJ7ktyouS3KisSonuSXKm5LcqzqNUTXJblRcluVp1GqJrktypuSXK86jVE9yW5UXJbladRqia5LcqLktytOo1RPckuVNyW5XnUaomuS3Ki5LcrTqNUTXJblTckuV51GqJ7klypuS3K06jVE1yW5UXJbledRqjhxjtcluVp0F1HMGuS8UVnuAAFFZnAY0KKwtGBrC9mcPsVyW5AcTTPhkxbklyASY0xbktyASY0xbktyAaY0xbkly0EmNMS5LcgEmJMW5LcgEmNMS5LcgGmNMW5LcgEmNMW5LcsBJjTFuS3IBpsSYtyW5AUmmNMS5LcgLzTGmLckuWhaaY0xLktyAvNMaYtyS5AWmmNMW5LcsC80xpi3JbkBaaY0xbkly0LzTGmJcluQFppjTFuSXIC80xpi3JeALTTGmYAFU2aAAL0zD//Z")] bg-cover bg-center py-3 rounded-lg px-3 mt-6 relative cursor-pointer'>
                      <FiInstagram className="text-2xl text-white" />
                      <span className="absolute inset-0 m-auto w-full h-full text-center flex items-center justify-center text-white text-lg mb-[1px]">
                        Instagram
                      </span>
                    </div>
                    <div className="w-full bg-[#0DC143] py-3 rounded-lg px-3 mt-6 relative cursor-pointer">
                      <FaWhatsapp className="text-2xl text-white" />
                      <span className="absolute inset-0 m-auto w-full h-full text-center flex items-center justify-center text-white text-lg mb-[1px]">
                        Whatsapp
                      </span>
                    </div>
                  </div>
                  <div className="bg-white rounded-xl w-full h-full p-4 overflow-hidden">
                    <h2 className="text-[#129990] font-bold text-center w-full uppercase text-[24px]">
                      Últimos eventos
                    </h2>
                    <OnlyCalendario
                      events={events}
                      // @ts-expect-error
                      setSelectedItem={setSelectedItem}
                      setOpen={setOpenModal}
                    />
                  </div>
                </div>
              </section>

              <div className="bg-white p-4 rounded-xl mt-6">
                <div className="w-full flex flex-col justify-start md:items-start gap-y-2 relative">
                  <div className="flex flex-col gap-2 mb-3 ">
                    <h2 className="text-xl lg:text-2xl font-bold text-[#252525]">
                      Seguimiento del proyecto
                    </h2>
                  </div>
                  <span
                    className="w-fit  px-4 py-2 bg-main text-white font-semibold rounded-xl text-xs md:text-base absolute right-2 top-8 lg:top-0 flex gap-2 items-center cursor-pointer transition-all active:scale-90"
                    onClick={() => {
                      if (
                        datos.correo &&
                        datos.correo != 'null' &&
                        datos.correo != null
                      ) {
                        setOpenQuestion(true)
                      } else {
                        Swal.fire({
                          title: 'EL cliente no tiene un email registrado',
                          showDenyButton: true,
                          confirmButtonText: 'Registrar email',
                          denyButtonText: 'Cancelar'
                        }).then(async (result: SweetAlertResult) => {
                          if (result.isConfirmed) {
                            setOpenMail(true)
                          }
                        })
                      }
                    }}
                  >
                    Agregar avance
                  </span>
                  <section className="w-full pt-6">
                    <SwiperAvances
                      arrayAlta={arrayAlta}
                      arrayAvances={arrayAvances}
                      setAvance={setAvance}
                      setOpen={setOpenAvance}
                      setOpenFinal={setOpenFinal}
                      arrayFinal={arrayFinal}
                      setFinal={setfinal}
                      setOpenActa={setOpenActa}
                      arrayActa={arrayActa}
                      datos={datos}
                      setOpenAlta={setopenAlta}
                    />
                  </section>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl mt-6">
                <ArchivosFinales
                  datos={datos}
                  getOneBrief={getOneBrief}
                  values={values}
                  pdfName={pdfName}
                  setpdfName={setpdfName}
                  fechaCreacion={fechaCreacion}
                  limite={limite}
                  plan={plan}
                  validateBrief={validateBrief}
                />
              </div>
              <div className="bg-white p-4 rounded-xl mt-6">
                <div className="flex justify-between gap-2 mb-4">
                  <h2 className="text-base w-full lg:text-2xl font-bold text-black">
                    Comentario general
                  </h2>
                  <div className="flex gap-2 w-full justify-end">
                    <input
                      type="submit"
                      className="bg-main_2-200 text-white hover:bg-primary flex items-center text-sm lg:text-base gap-2 h-fit lg:h-auto py-2 px-4 rounded-lg transition-colors cursor-pointer"
                      value="Grabar comentario"
                    />
                  </div>
                </div>
                <div className="w-full flex justify-center items-center flex-col md:flex-row gap-2 lg:gap-5">
                  <div className="w-full">
                    <textarea
                      cols={30}
                      rows={10}
                      className="border placeholder-gray-400 focus:outline-none
                                                        focus:border-black w-full  pr-4 h-24 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                        border-gray-300 rounded-md transition-all text-black"
                      name="comentarios"
                      value={values.comentarios}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    ></textarea>

                    <Errors
                      errors={errors.comentarios}
                      touched={touched.comentarios}
                    />
                  </div>
                </div>
              </div>
            </form>
          ) : datos?.id_contrato.split('_')[0].includes('LPW') ||
            datos?.id_contrato.split('_')[0].includes('LPTV') ||
            datos?.id_contrato.split('_')[0].includes('LPLANDING') ||
            datos?.id_contrato.split('_')[0].includes('LPSEO') ? (
            <form className="mt-5" onSubmit={handleSubmit}>
              <div className="flex gap-6 justify-between">
                <div className="bg-white px-4 py-6 gap-4 rounded-xl flex justify-between flex-1">
                  <div className="w-full flex flex-1 relative  gap-4 ">
                    <span className="text-left w-1/2 relative shadow-md p-4 px-8 rounded-md flex flex-col  gap-2 md:gap-6 text-black ">
                      <button
                        type="button"
                        className="btn_edit_percentage absolute top-2 right-2 text-2xl text-black"
                        onClick={() => {
                          setActiveGroup(!activeGroup)
                        }}
                      >
                        <CiEdit />
                      </button>
                      <span className="text-sm md:text-base font-bold text-center uppercase text-main">
                        {datos.id_contrato.includes('LPTV') && 'Tienda virtual'}
                        {datos.id_contrato.includes('LPSEO') && 'SEO'}
                        {datos.id_contrato.includes('LPLANDING') &&
                          'Landingpage'}
                        {datos.id_contrato.includes('LPHOSTING') && 'HOSTING'}
                        {datos.id_contrato.slice(0, 4) === 'LPWA' &&
                          'Web Administrable'}
                        {datos.id_contrato.slice(0, 4) === 'LPW' &&
                          'Web Informativa'}
                      </span>
                      <p className="text-[#252525] relative mt-2 font-semibold text-center">
                        <a
                          href={domain}
                          target="_blank"
                          rel="noreferrer"
                          className={`relative text-center  text-blue-500 ${
                            activeGroup ? '-z-50' : 'z-50'
                          }`}
                        >
                          {limpiarDominio(domain)}
                        </a>
                        <input
                          type="text"
                          disabled={!activeGroup}
                          value={domain}
                          onChange={changeDomain}
                          className={`absolute text-center inset-0 m-auto bg-transparent text-blue-500 ${
                            activeGroup ? 'z-50' : '-z-50'
                          }`}
                        />
                      </p>
                      <p className="text-center relative">
                        <input
                          type="text"
                          disabled={!activeGroup}
                          value={cantCorreos}
                          onChange={changeCorreos}
                          className={'text-center bg-transparent '}
                        />
                      </p>
                    </span>
                    <span className="text-left w-1/2 shadow-md p-4 px-8 rounded-md flex flex-col  gap-2  text-black uppercase">
                      <span className="text-sm md:text-base font-bold text-main text-center">
                        COLABORADOR(ES) A CARGO
                      </span>
                      {colaborador?.map((asignacion: any, index: number) => {
                        const assignedCollaborators = colaboradores
                          .filter(
                            (colaborador: { id: number, name: string }) =>
                              colaborador.id == asignacion.peso
                          )
                          .map(
                            (colaborador: { name: string }) => colaborador.name
                          )
                        return (
                          <Fragment key={index}>
                            {assignedCollaborators && (
                              <span className="text-center">
                                {assignedCollaborators}
                              </span>
                            )}
                            {index < colaborador.length - 1}
                          </Fragment>
                        )
                      })}
                    </span>

                    {/* {!values.fecha_fin && (
                       <div className="p-0 bg-yellow-600 hover:bg-yellow-700 rounded-xl">
                         {id != null && values.fecha_fin == null && (
                           <button
                             type="button"
                             onClick={() => {
                               if (datos2?.email && datos2?.comentarios) {
                                 setOpenCorreoFinal(true)
                               } else if (!datos2?.comentarios) {
                                 Swal.fire(
                                   'Debe colocar sus comentarios generales',
                                   '',
                                   'warning'
                                 )
                               } else {
                                 Swal.fire({
                                   title:
                                     'EL cliente no tiene un email registrado',
                                   showDenyButton: true,
                                   confirmButtonText: 'Registrar email',
                                   denyButtonText: 'Cancelar'
                                 }).then(async (result: SweetAlertResult) => {
                                   if (result.isConfirmed) {
                                     setOpenMailFinal(true)
                                   }
                                 })
                               }
                             }}
                             className="text-sm text-center w-full md:text-base transition-colors text-white font-bold flex items-center justify-center gap-x-4 p-2 flex-1 rounded-xl"
                           >
                             Finalizar servicio
                           </button>
                         )}
                       </div>
                     )} */}
                  </div>

                  <div className="flex gap-4">
                    <div className=" shadow-md rounded-lg ">
                      <div className="bg_date_card_avance w-[180px] h-full rounded-lg p-8 px-6 flex flex-col items-center justify-center text-[#202020]">
                        <h6 className="font-bold text-2xl text-[#2fba59]">
                          {formatDate(datos.fecha_inicio)}
                        </h6>

                        <span className="mt-1 text-center">
                          Fecha de inicio
                        </span>
                      </div>
                    </div>

                    <div className=" shadow-md rounded-lg">
                      <div className="bg_date_card_avance w-[180px] h-full rounded-lg p-8 px-6 flex flex-col items-center justify-center text-[#202020]">
                        <h6 className="font-bold text-2xl text-[#ca3a3a]">
                          {formatDate(datos.fecha_fin || '')}
                        </h6>

                        <span className="mt-1 text-center">Fecha final</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-white min-w-[246px]  rounded-xl flex px-6 py-8 pb-4 flex-col justify-center items-center">
                  <div className="relative">
                    <div
                      className={`w-20 h-20 rounded-full bg_neu relative ${
                        Number(percentage) == 100 ? 'bg-complete-view' : ''
                      } shadow-lg`}
                    >
                      {activePercentage && (
                        <button
                          type="button"
                          className="btn_edit_percentage absolute bottom-full left-full text-2xl text-green-500"
                          onClick={() => {
                            setActivePercentage(!activePercentage)
                            updatePropuestas()
                          }}
                        >
                          <IoSaveOutline />
                        </button>
                      )}

                      {!activePercentage && (
                        <button
                          type="button"
                          className="btn_edit_percentage absolute bottom-full left-full text-2xl text-black"
                          onClick={() => {
                            setActivePercentage(!activePercentage)
                          }}
                        >
                          <CiEdit />
                        </button>
                      )}

                      <div className="absolute rounded-full inset-0 m-auto w-full h-full "></div>
                      <div className="absolute inset-0 m-auto svg_porcentaje overflow-hidden">
                        <motion.svg
                          className="w-full h-full"
                          viewBox="0 0 120 120"
                          initial={false}
                          animate={fillAnimation}
                        >
                          <motion.path
                            fill="none"
                            stroke={`${
                              Number(percentage) === 100 ? '#38e36b' : '#09C08F'
                            }`}
                            strokeWidth="10"
                            strokeLinecap="round"
                            d={`M 60,10 A 50,50 0 ${
                              percentage <= 50 ? 0 : 1
                            } 1 ${calculateX(percentage)},${calculateY(
                              percentage
                            )}`}
                          />
                        </motion.svg>
                      </div>
                      <div className="absolute inset-0 flex justify-center items-center text-lg font-bold text-gray-800">
                        <input
                          onChange={handleInputChange}
                          value={`${percentage}`}
                          disabled={activePercentage}
                          className={`text-right outline-none bg-transparent w-[40px] ${
                            Number(percentage) === 100
                              ? 'text-white'
                              : 'text-[#09C08F]'
                          } `}
                        />{' '}
                        <span
                          className={`${
                            Number(percentage) === 100
                              ? 'text-white'
                              : 'text-[#09C08F]'
                          }`}
                        >
                          %
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className="block mt-5 text-[#252525]">
                    {Number(percentage) === 100
                      ? 'Proyecto terminado'
                      : 'Porcentaje del proyecto'}
                  </span>
                </div>
              </div>

              <div className="flex gap-2 justify-between">
                <div className="bg-white p-4 px-4 rounded-xl mt-6 w-[68%] relative">
                  <h5 className="text-[#202020] font-bold text-xl">
                    Procesos completados
                  </h5>

                  {procesosRegistrados.length === 0 ? (
                    <button
                      type="button"
                      onClick={() => {
                        setOpenModalProcess(!openModalProcess)
                      }}
                      className="absolute inset-0 m-auto w-fit h-fit bg-secundario rounded-lg py-2 px-8 text-white text-center transition-all active:scale-90"
                    >
                      Agregar procesos
                    </button>
                  ) : (
                    <Swiper
                      slidesPerView={procesosRegistrados.length < 5 ? procesosRegistrados.length : 5}
                      className="h-[80%] swp_procesos"
                      spaceBetween={20}
                    >
                      {procesosRegistrados.map((proceso, index) => (
                        <SwiperSlide key={index}>
                          <div
                            className="style_icon w-full shadow-lg h-fit flex items-center gap-4 p-4 rounded-xl"
                            key={index}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`p-2 border border-[#4E54C8] cursor-pointer transition-all duration-200 flex rounded-full ${
                                  proceso.fecha !== 'Sin fecha'
                                    ? 'bg-[#4E54C8]'
                                    : ''
                                }`}
                                onClick={() => {
                                  updatedProceso(index)
                                }}
                              >
                                {proceso.fecha !== 'Sin fecha' ? (
                                  <PiCheck className="text-white  text-3xl transition-all duration-200" />
                                ) : (
                                  <>
                                    {proceso.icono === 'br' && (
                                      <CiViewTimeline className="text-[#4E54C8]" />
                                    )}
                                    {proceso.icono === 'av' && (
                                      <CiPaperplane className="text-[#4E54C8]" />
                                    )}
                                    {proceso.icono === 'cap' && (
                                      <CiMonitor className="text-[#4E54C8]" />
                                    )}
                                    {proceso.icono === 'dom' && (
                                      <CiGlobe className="text-[#4E54C8]" />
                                    )}
                                    {proceso.icono === 'fin' && (
                                      <CiCircleCheck className="text-[#4E54C8]" />
                                    )}
                                  </>
                                )}
                              </span>
                              <span>
                                <h5 className="text-[#252525] select-none line-clamp-1 text-lg font-[500]">
                                  {proceso.nombre}
                                </h5>
                                <p className="text-[13px] select-none italic text-[#606060] line-clamp-1">
                                  {obtenerDiaMes(proceso.fecha)}
                                </p>
                              </span>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                    </Swiper>
                  )}
                  {/* <ArchivosFinales
                       getOneBrief={getOneBrief}
                       values={values}
                       pdfName={pdfName}
                       setpdfName={setpdfName}
                       fechaCreacion={fechaCreacion}
                       limite={limite}
                       plan={plan}
                       validateBrief={validateBrief}
                     /> */}
                </div>
                <div className="w-[32%] mt-6 rounded-xl bg_web_client p-4">
                  <div className="flex gap-1 relative justify-between items-start">
                    <input
                      type="text"
                      onChange={changeDomainTemp}
                      className="btn_edit_dom_temp absolute input_glass left-0 -top-2"
                      placeholder="Dominio temporal"
                    />
                    <button
                      type="button"
                      className="btn_edit_dom_temp absolute -top-2 right-0 left-0 mx-auto w-fit text-2xl text-white"
                    >
                      <IoSaveOutline />
                    </button>

                    <div className=" w-[50%]">
                      {/* <div className="flex gap-2 items-center">
                           <img src={ico} alt="" width={22} />
                           <span className="font-[400] text-lg text-white">
                             Logos Perú
                           </span>
                         </div> */}

                      <h6 className="block text-center text-white font-[500] text-2xl mt-7">
                        {datos.nombre_marca}
                      </h6>
                      <a
                        href={`${datos.id_contrato.includes('LPSEO') ? `https://www.google.com/search?q=${domainTemp}` : domainTemp} `}
                        target="_blank"
                        className="btn_vieweb w-fit bg-white relative rounded-full flex items-center gap-2 px-6 py-2 text-center text-black mt-5 mx-auto"
                        rel="noreferrer"
                      >
                        <TfiWorld className="text-main" />
                        {datos.id_contrato.includes('LPSEO') ? 'Ver indexación' : ' Ver web'}
                      </a>
                    </div>
                    <div className="w-[50%]">
                      <img
                        src={vieweb}
                        alt=""
                        className="w-[73%] block mx-auto  imgViewWeb"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl mt-6">
                <div className="w-full flex flex-col justify-start md:items-start gap-y-2 relative">
                  <div className="flex flex-col gap-2 mb-3 ">
                    <h2 className="text-xl lg:text-2xl font-bold text-black ">
                      Seguimiento del proyecto
                    </h2>
                  </div>
                  <span
                    className="w-fit px-4 py-2 bg-main text-white font-semibold rounded-xl absolute right-2 flex gap-2 items-center cursor-pointer transition-all active:scale-90"
                    onClick={() => {
                      if (
                        datos.correo &&
                        datos.correo != 'null' &&
                        datos.correo != null
                      ) {
                        setOpenQuestion(true)
                      } else {
                        Swal.fire({
                          title: 'EL cliente no tiene un email registrado',
                          showDenyButton: true,
                          confirmButtonText: 'Registrar email',
                          denyButtonText: 'Cancelar'
                        }).then(async (result: SweetAlertResult) => {
                          if (result.isConfirmed) {
                            setOpenMail(true)
                          }
                        })
                      }
                    }}
                  >
                    Agregar avance
                  </span>
                  <section className="w-full pt-6">
                    <SwiperAvances
                      arrayAlta={arrayAlta}
                      arrayAvances={arrayAvances}
                      setAvance={setAvance}
                      setOpen={setOpenAvance}
                      setOpenFinal={setOpenFinal}
                      arrayFinal={arrayFinal}
                      setFinal={setfinal}
                      setOpenActa={setOpenActa}
                      arrayActa={arrayActa}
                      datos={datos}
                      setOpenAlta={setopenAlta}
                    />
                  </section>
                </div>
              </div>

              <div className="bg-white p-4 rounded-xl mt-6">
                <div className="flex justify-between gap-2 mb-4">
                  <h2 className="text-xl w-full lg:text-2xl font-bold text-black">
                    Comentario general
                  </h2>
                  <div className="flex gap-2 w-full justify-end">
                    <input
                      type="submit"
                      className="bg-main_2-200 text-white hover:bg-primary flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
                      value="Grabar comentario"
                    />
                  </div>
                </div>
                <div className="w-full flex justify-center items-center flex-col md:flex-row gap-2 lg:gap-5">
                  <div className="w-full">
                    <textarea
                      cols={30}
                      rows={10}
                      className="border placeholder-gray-400 focus:outline-none
                                                         focus:border-black w-full  pr-4 h-24 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                         border-gray-300 rounded-md transition-all text-black"
                      name="comentarios"
                      value={values.comentarios}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    ></textarea>

                    <Errors
                      errors={errors.comentarios}
                      touched={touched.comentarios}
                    />
                  </div>
                </div>
              </div>
            </form>
              ) : datos?.id_contrato.split('_')[0].includes('LPHOST') ? (
                <></>
              ) : datos?.id_contrato.split('_')[0].includes('LPADS') ? (

                <>
                {/* <PlanAds
                arrayActa={arrayActa}
                arrayAlta={arrayAlta}
                arrayAvances={arrayAvances}
                capacitacion={capacitacion}
                setCapacitacion={setCapacitacion}
                arrayFinal={arrayFinal}
                colaborador={colaborador}
                colaboradores={colaboradores}
                datos={datos}
                datos2={datos2}
                errors={errors}
                handleBlur={handleBlur}
                handleChange={handleChange}
                handleSubmit={handleSubmit}
                setAvance={setAvance}
                setOpenActa={setOpenActa}
                setOpenAvance={setOpenAvance}
                setOpenCorreoFinal={setOpenCorreoFinal}
                setOpenFinal={setOpenFinal}
                setOpenMail={setOpenMail}
                setOpenMailFinal={setOpenMailFinal}
                setOpenQuestion={setOpenQuestion}
                setfinal={setfinal}
                setopenAlta={setopenAlta}
                touched={touched}
                values={values}
                getDatos={getOneBrief}
                /> */}
                </>

              ) : (
                <PlanLogotipo
                    piezasGraficas={''}
                    updatePiezas={''}
                    getOneBrief={getOneBrief}
                    dataUpdatedDiseno={dataUpdatedDiseno}
                    id={id}
                    limite={limite}
                    pdfName={pdfName}
                    plan={plan}
                    updateStructuraDiseno={updateStructuraDiseno}
                    validateBrief={validateBrief}
                    fechaCreacion={fechaCreacion}
                    arrayActa={arrayActa}
                    arrayAlta={arrayAlta}
                    arrayAvances={arrayAvances}
                    arrayFinal={arrayFinal}
                    colaborador={colaborador}
                    colaboradores={colaboradores}
                    datos={datos}
                    datos2={datos2}
                    errors={errors}
                    handleBlur={handleBlur}
                    handleChange={handleChange}
                    handleSubmit={handleSubmit}
                    setAvance={setAvance}
                    setOpenActa={setOpenActa}
                    setOpenAvance={setOpenAvance}
                    setOpenCorreoFinal={setOpenCorreoFinal}
                    setOpenFinal={setOpenFinal}
                    setOpenMail={setOpenMail}
                    setOpenMailFinal={setOpenMailFinal}
                    setOpenQuestion={setOpenQuestion}
                    setfinal={setfinal}
                    setopenAlta={setopenAlta}
                    touched={touched}
                    values={values}
                    getDatos={getOneBrief}
                  />
              )}
          {/* <ModalQuestion
            open={openQuestion}
            setOpen={setOpenQuestion}
            openCorreo={setOpen}
            setOpenCorreoActa={setOpenCorreoActa}
            setOpenAvisoNotificacion={setOpenAvisoNotificacion}
            values={values}
            setOpenActaAceptacion={setOpenActaAceptacion}
          /> */}
          <ModalActaEstado
            open={openCorreoActa}
            setOpen={setOpenCorreoActa}
            idVenta={id}
            getOneBrief={getOneBrief}
            datos={datos}
            correos={correos}
            setCorreos={setCorreos}
          />
          <ModalRegistro
            open={open}
            setOpen={setOpen}
            idVenta={id}
            getOneBrief={getOneBrief}
            datos={datos}
            correos={correos}
            setCorreos={setCorreos}
          />

          <ModalaAvisonNotificacion
            open={openAvisoNotificacion}
            setOpen={setOpenAvisoNotificacion}
            idVenta={id}
            getOneBrief={getOneBrief}
            datos={datos}
            correos={correos}
            setCorreos={setCorreos}
          />

          <ModalActaAceptacion
            open={openActaAceptacion}
            setOpen={setOpenActaAceptacion}
            idVenta={id}
            getOneBrief={getOneBrief}
            datos={datos}
            correos={correos}
            setCorreos={setCorreos}
          />
            <ViewAvance
            open={openAvance}
            setOpen={setOpenAvance}
            avance={avance}
            getData={getOneBrief}
            datos={datos}
            arrayAvances={arrayAvances}
            setArrayAvances={setArrayAvances}
          />
          <ViewFinal
            open={openFinal}
            setOpen={setOpenFinal}
            avance={final}
            datos={datos}
          />

          <ViewAlta
            open={openAlta}
            setOpen={setopenAlta}
            avance={arrayAlta}
            datos={datos}
          />

          <ModalCorreoFinal2
            open={openCorreoFinal}
            setOpen={setOpenCorreoFinal}
            correos={correos}
            setCorreos={setCorreos}
            idVenta={id}
            datos={datos2}
            getOneBrief={getOneBrief}
          />

          <RegistroEmail2
            open={openMailFinal}
            setOpen={setOpenMailFinal}
            id={datos2?.idCliente}
            getOneBrief={getOneBrief}
          />
          {datos.hora_acta && (
            <ViewActa open={openActa} setOpen={setOpenActa} datos={datos} />
          )}
          <button
            type="button"
            className="bg-green-700 rounded-full p-4 fixed right-6 bottom-6 "
            onClick={() => {
              if (datos.nombre_marca.length > 0) {
                navigate(`/admin/seguimiento/${id ?? ''}`)
              } else {
                mostrarAlerta()
              }
            }}
          >
            <BsChatRightText className="text-white text-3xl" />
          </button>
        </>
      )}

      <ModalDescripcion2
        eventSelected={selectedItem}
        open={openModal}
        setOpen={setOpenModal}
      />
      <RegistroMarca
        open={openMarca}
        setOpen={setOpenMarca}
        id={id}
        getOneBrief={getOneBrief}
      />
      <RegistroMail
        open={openMail}
        setOpen={setOpenMail}
        id={selectIDCLIENTE}
        getOneBrief={getOneBrief}
      />
      <ModalObsequios
        open={openObsequio}
        setOpen={setOpenObsequio}
        // @ts-expect-error
        datos={datos}
        getClientes={getOneBrief}
        usuarios={usuarios}
      />
    </>
  )
}
