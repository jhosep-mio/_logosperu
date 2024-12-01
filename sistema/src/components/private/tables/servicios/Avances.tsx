/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Fragment, useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
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
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules'
import { ModalRegistro } from './ModalRegistro'
import { ViewAvance } from './ViewAvance'
import { FiInstagram } from 'react-icons/fi'
import { BsChatRightText, BsFillGiftFill } from 'react-icons/bs'
import { FaWhatsapp, FaFacebookF } from 'react-icons/fa'
import { useAnimation } from 'framer-motion'
import { IoAddCircle, IoCloseCircle } from 'react-icons/io5'
import DatePicker from 'react-datepicker'
import { v4 as uuidv4 } from 'uuid'
import 'react-datepicker/dist/react-datepicker.css'
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
import { ModalQuestion } from './modals/ModalQuestion'
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
import { cn } from '../../../shared/cn'
import { toast } from 'sonner'
import { PlanAds } from './forms/PlanAds'
import { AiFillCloseCircle, AiTwotoneCalendar } from 'react-icons/ai'
import { format, parseISO, setHours, setMinutes } from 'date-fns'
import { ButtonHabilitate } from './funciones/ButtonHabilitate'
import { ModalFeErratas } from './modals/ModalFeErratas'
import { ModalViewComprobantes } from '../community/ModalViewComprobantes'
import { SubirArchivo } from '../hosting/components/SubirArchivo'
import { convertirNumeroALetras } from '../../../shared/functions/GenerarTextoEnLetras'
import { PlanDesarrolloWeb } from './forms/PlanDesarrolloWeb'

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
  [x: string]: any
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

export const Avances = (): JSX.Element => {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const { setTitle, auth } = useAuth()
  const [loading, setLoading] = useState(true)
  const [, setHostingActivo] = useState(false)
  const [plan, setplan] = useState<ValuesPlanes | null>(null)
  const [open, setOpen] = useState(false)
  const [openCorreoActa, setOpenCorreoActa] = useState(false)
  const [openFeErratas, setOpenFeErratas] = useState(false)
  const [openAvisoNotificacion, setOpenAvisoNotificacion] = useState(false)
  const [openActaAceptacion, setOpenActaAceptacion] = useState(false)
  const [openQuestion, setOpenQuestion] = useState(false)
  const [openObsequio, setOpenObsequio] = useState(false)
  const [mostrarSelector, setMostrarSelector] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [selectIDCLIENTE, setSelectIDCLIENTE] = useState(0)
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null)
  const [selectedItem, setSelectedItem] = useState<Event | null>(null)
  const [percentage, setPercentage] = useState(0) // Estado para almacenar el porcentaje
  const [openComprobantes, setOpenComprobantes] = useState(false)
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
  const [capacitacion, setCapacitacion] = useState<any | null>(null)
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
  const [oneHost, setOneHost] = useState<any | null>(null)
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
  const [comprobante, setComprobante] = useState<any | null>(null)

  const handleFechaSeleccionada = (date: any): void => {
    setFechaSeleccionada(date)
  }

  const updatePropuestas = async (): Promise<void> => {
    setLoading(true)
    const data = new FormData()
    data.append('comentarios', values.comentarios)
    data.append('puntuacion', values.puntuacion)
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
    data.append('data_diseno', JSON.stringify(dataDiseno))

    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/updateDataDiseno/${id ?? ''}`,
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

  const updatePiezas = async (dataPiezas: any): Promise<void> => {
    setLoading(true)
    const data = new FormData()
    data.append('data_piezas', JSON.stringify(dataPiezas))
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/updatePiezas/${id ?? ''}`,
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
        const request = await axios.get(`${Global.url}/getVenta/${id ?? ''}`, {
          headers: {
            Authorization: `Bearer ${
                token !== null && token !== '' ? `Bearer ${token}` : ''
              }`
          }
        })
        if (request.data[0].data_piezas) {
          setPiezasGraficas(request.data[0].data_piezas)
        }
        toast.success('Actualización exitosa')
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
      archivos_avances: '',
      puntuacion: ''
    },
    validationSchema: SchemaPropuestas,
    onSubmit: updatePropuestas
  })
  // dataUpdatedWeb
  const [dataUpdatedWeb, setDataUpdatedWeb] = useState<Dataweb>({
    dominio: '',
    domain_temp: '',
    cant_correos: '',
    porcentaje_proyecto: '',
    procesos: [],
    domain_owner: '',
    hosting_owner: ''
  })

  const [dataUpdatedDiseno, setDataUpdatedDiseno] = useState<Datadiseno>({
    propuestas: false,
    fecha_propuestas: '',
    envio_informacion: false,
    fecha_informacion: ''
  })

  const [piezasGraficas, setPiezasGraficas] = useState({})
  const getOneBrief = async (): Promise<void> => {
    setLoading(true)
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
          uso: request.data[0].contrato.uso,
          id: request.data[0].contrato.id
        })
      } else {
        setBrief({ codigo: request.data[0].codigo, uso: request.data[0].uso })
      }

      if (request.data[0].hosting) {
        setHosting(JSON.parse(request.data[0].hosting))
      }
      if (request.data[0].community_activo) {
        setCommunityActivo(request.data[0].community_activo)
      }
      if (request.data[0].activehosting) {
        setHostingActivo(request.data[0].activehosting)
      }
      if (request.data[0].data_piezas) {
        setPiezasGraficas(request.data[0].data_piezas)
      }
      if (request.data[0].capacitacion) {
        setCapacitacion(JSON.parse(request.data[0].capacitacion))
      }
      if (request.data[0].mantenimientoWeb) {
        setseguimientoRegistrado(JSON.parse(request.data[0].mantenimientoWeb))
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
        archivos_avances: request.data[0].archivos_avances,
        puntuacion: request.data[0].puntuacion
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
        if (JSON.parse(request.data[0].data_web).id_hosting) {
          const request33 = await axios.get(`${Global.url}/getOneHost/${JSON.parse(request.data[0].data_web).id_hosting ?? ''}`, {
            headers: {
              Authorization: `Bearer ${
                      token !== null && token !== '' ? `Bearer ${token}` : ''
                    }`
            }
          })
          setOneHost(request33.data[0])
        }
      } else {
        setOneHost(null)
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
        dni_ruc: request.data[0].dni_ruc,
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
        fecha_fin: request.data[0].fecha_fin,
        fecha_alta: request.data[0].fecha_alta,
        fecha_inicio: request.data[0].fecha_inicio,
        observaciones: request.data[0].observaciones,
        brief: request.data[0]?.uso == 1 ? 1 : request.data[0].contrato?.uso == 1 ? 1 : 0,
        comunnity: request.data[0].community
          ? JSON.parse(request.data[0].community)
          : [],
        aprobacion: request.data[0].aprobacion
          ? JSON.parse(request.data[0].aprobacion)
          : [],
        tienehosting: request.data[0].hosting_id,
        fecha_adicional: request.data[0].fecha_adicional ? request.data[0].fecha_adicional : null,
        solicitud_manual: request.data[0].solicitud_manual,
        nombre_plan: request.data[0].nombre_plan,
        renovacion: request.data[0].renovacion ? JSON.parse(request.data[0].renovacion) : [],
        categoria_plan: request.data[0].categoria_plan ?? ''
      }))

      console.log(request.data[0].renovacion ? JSON.parse(request.data[0].renovacion) : [])
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
      if (request.data[0].data_web) {
        setDataUpdatedWeb(JSON.parse(request.data[0].data_web))
      }
      if (request.data[0].data_diseno) {
        setDataUpdatedDiseno(JSON.parse(request.data[0].data_diseno))
      }
      if (request.data[0].community_activo) {
        setCommunityActivo(request.data[0].community_activo)
      }
      if (request.data[0].data_piezas) {
        setPiezasGraficas(request.data[0].data_piezas)
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

  const [activeDomHosOwner, setActiveDomHosOwner] = useState(false)

  useEffect(() => {
    setPercentage(Number(dataUpdatedWeb.porcentaje_proyecto))
  }, [dataUpdatedWeb])

  let diferenciaDias

  const enviarCorreoAvanceActivate = async (): Promise<void> => {
    const { fecha, hora } = obtenerFechaHora()
    const avance = {
      fecha,
      hora,
      asunto: 'PROYECTO HABILITADO',
      correos: [{ id: '1598753', correo: 'diseno2@logosperu.com' }, { id: '123456', correo: 'diseno4@logosperu.com' }, { id: '123123123', correo: datos?.email }],
      contexto: `<p>Estimado(a) ${datos?.nombres}</p><p><br></p><p>Nos complace informarle que hemos reactivado nuestro servicio de Community Manager para usted. Estamos emocionados de seguir trabajando juntos y apoyarlo en todas tus necesidades digitales.&nbsp;</p><p><br></p><p>Durante este tiempo, hemos realizado mejoras significativas para ofrecerle un servicio aún más excepcional. Estamos comprometidos a brindarte resultados impactantes y a ser parte clave de tu estrategia digital.&nbsp;</p><p><br></p><p>Agradecemos sinceramente su confianza en nosotros y estamos listos para ayudarlo(a) en todo lo que necesite. No dude en contactarnos si tiene alguna pregunta o si desea explorar nuevas oportunidades para su negocio.&nbsp;</p>`,
      firma: auth.firma
    }

    const data = new FormData()
    data.append('array_avances', JSON.stringify(avance))
    data.append('_method', 'PUT')
    try {
      await axios.post(
        `${Global.url}/subirAvances/${id ?? ''}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      toast.success('PROYECTO HABILITADO')
      getOneBrief()
      const enviarNotificacion = async (): Promise<void> => {
        const data = new FormData()
        const currentUrl = window.location.href
        // Utilizar el objeto URL para extraer la ruta
        const urlObject = new URL(currentUrl)
        const pathName = urlObject.pathname
        data.append('id_usuario', auth.id)
        data.append('id_venta', String(id))
        data.append('nombre', auth.name)
        data.append('icono', 'correo')
        data.append('url', pathName)
        data.append(
          'contenido',
                `Habilito el proyecto ${
                  datos.nombre_marca ?? ''
                }  (${datos?.nombres ?? ''})`
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
    } catch (error: unknown) {
      console.log(error)
    }
  }

  const enviarCorreoAvanceDesactivate = async (): Promise<void> => {
    const { fecha, hora } = obtenerFechaHora()
    const avance = {
      fecha,
      hora,
      asunto: 'PROYECTO DESHABILITADO',
      correos: [{ id: '1598753', correo: 'diseno2@logosperu.com' }, { id: '123456', correo: 'diseno4@logosperu.com' }, { id: '123123123', correo: datos?.email }],
      contexto: `<p>Estimado(a) ${datos?.nombres}</p><p><br></p><p>Queremos informarte que hemos deshabilitado temporalmente nuestro servicio de community manager para usted. Entendemos que pueden surgir diferentes razones y necesidades en tu negocio, y estamos aquí para apoyarte en cualquier momento que decidas regresar.&nbsp;</p><p><br></p><p>Queremos agradecerte por confiar en nosotros y permitirnos ser parte de tu estrategia digital. Durante este tiempo, estaremos trabajando en mejoras y actualizaciones para ofrecerte un servicio aún más excepcional cuando vuelvas.&nbsp;</p><p><br></p><p>Te esperamos pronto y estaremos gustosamente de atenderte. No dudes en ponerte en contacto con nosotros si necesitas cualquier tipo de asistencia o información adicional.&nbsp;</p>`,
      firma: auth.firma
    }

    const data = new FormData()
    data.append('array_avances', JSON.stringify(avance))
    data.append('_method', 'PUT')
    try {
      await axios.post(
        `${Global.url}/subirAvances/${id ?? ''}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      toast.success('PROYECTO DESHABILITADO')
      getOneBrief()
      const enviarNotificacion = async (): Promise<void> => {
        const data = new FormData()
        const currentUrl = window.location.href
        // Utilizar el objeto URL para extraer la ruta
        const urlObject = new URL(currentUrl)
        const pathName = urlObject.pathname
        data.append('id_usuario', auth.id)
        data.append('id_venta', String(id))
        data.append('nombre', auth.name)
        data.append('icono', 'correo')
        data.append('url', pathName)
        data.append(
          'contenido',
                `Ha deshabilitado el proyecto ${
                  datos.nombre_marca ?? ''
                }  (${datos?.nombres ?? ''})`
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
    } catch (error: unknown) {
      console.log(error)
    }
  }

  const habilitarProyecto = async (): Promise<void> => {
    setLoading(true)
    const data = new FormData()
    data.append('community_activo', communityActivo == 'false' ? 'true' : 'false')
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
          `${Global.url}/habilitarProyecto/${id ?? ''}`,
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
        if (communityActivo == 'false') {
          enviarCorreoAvanceActivate()
          correoActivateCM(datos?.nombres, datos.email)
        } else {
          correoDesactivateCM(datos?.nombres, datos.email)
          enviarCorreoAvanceDesactivate()
        }
      } else {
        Swal.fire('Error al actualizar', '', 'error')
      }
    } catch (error: unknown) {
      Swal.fire('Error', '', 'error')
    }
    setLoading(false)
  }

  const correoDesactivateCM = async (nombres: string, email: string): Promise<void> => {
    const data = new FormData()
    data.append('nombres', nombres)
    data.append('email', email)
    try {
      await axios.post(
          `${Global.url}/correoDesactivateCM`,
          data,
          {
            headers: {
              Authorization: `Bearer ${
                token !== null && token !== '' ? token : ''
              }`
            }
          }
      )
    } catch (error: unknown) {
      console.log(error)
      toast.error('Error')
    }
  }

  const correoActivateCM = async (nombres: string, email: string): Promise<void> => {
    const data = new FormData()
    data.append('nombres', nombres)
    data.append('email', email)
    try {
      await axios.post(
          `${Global.url}/correoActivateCM`,
          data,
          {
            headers: {
              Authorization: `Bearer ${
                token !== null && token !== '' ? token : ''
              }`
            }
          }
      )
    } catch (error: unknown) {
      console.log(error)
      toast.error('Error')
    }
  }

  const [loadingReenvio, setLoadingReenvio] = useState(false)

  const reenviarArchivos = async (): Promise<void> => {
    if (fechaSeleccionada) {
      setLoadingReenvio(true)
      const data = new FormData()
      data.append('fecha_adicional', fechaSeleccionada)
      data.append('marca', datos?.nombre_marca)
      data.append('nombres', datos?.nombres)
      data.append('email', datos?.email)
      data.append('pass', datos?.celular)
      data.append('fecha',
        format(setHours(setMinutes(new Date(fechaSeleccionada), 59), 23), 'dd/MM/yyyy HH:mm'))

      try {
        const respuesta = await axios.post(
              `${Global.url}/reenviarArchivos/${id ?? ''}`,
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
          toast.success('Correo enviado')
          setFechaSeleccionada(null)
          setMostrarSelector(false)
          getOneBrief()
        }
      } catch (error: unknown) {
        console.log(error)
        toast.error('Error')
      } finally {
        setLoadingReenvio(false)
      }
    } else {
      toast.warning('Debe seleccionar una fecha')
    }
  }

  const reenviarArchivos2 = async (): Promise<void> => {
    setLoadingReenvio(true)
    const data = new FormData()
    data.append('fecha_adicional', '')
    try {
      const respuesta = await axios.post(
              `${Global.url}/reenviarArchivos2/${id ?? ''}`,
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
        toast.success('Fecha eliminada')
        getOneBrief()
        setMostrarSelector(false)
      }
    } catch (error: unknown) {
      console.log(error)
      toast.error('Error')
    } finally {
      setLoadingReenvio(false)
    }
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

  const enviarCorreoFinal = async (): Promise<void> => {
    const { fecha, hora } = obtenerFechaHora()
    const avance = {
      fecha,
      hora,
      asunto: 'SERVICIO FINALIZADO',
      correos: [{ id: '1598753', correo: 'diseno2@logosperu.com' }, { id: '123456', correo: 'diseno4@logosperu.com' }, { id: '123123123', correo: datos?.email }],
      contexto: `<p>Estimado(a)&nbsp;<strong>${datos?.nombres}</strong></p><p><br></p><p>Queremos expresar nuestro sincero agradecimiento por permitirnos colaborar como su servicio de ${
        datos?.nombre_plan} para el proyecto&nbsp;<strong>${datos?.nombre_marca}</strong>&nbsp;durante este tiempo. Ha sido un honor trabajar en la gestión de su presencia en línea y ayudar a fortalecer la conexión con su comunidad de seguidores.&nbsp;</p><p><br></p><p>Como parte de este proceso,&nbsp;<strong>en los proximos 3 dias procederemos a retirar la administración de su FAN PAGE desde nuestra cuenta de Facebook</strong>. Esto garantizará una transición adecuada y la continuidad de la gestión de su presencia en línea.&nbsp;</p><p><br></p><p>¡Les deseamos mucho éxito en todos sus proyectos!&nbsp;&nbsp;</p>`,
      firma: auth.firma
    }
    const data = new FormData()
    const today = new Date()
    const formattedDate = `${String(today.getDate()).padStart(
      2,
      '0'
    )}/${String(today.getMonth() + 1).padStart(
      2,
      '0'
    )}/${today.getFullYear()}`
    data.append('fecha_fin', formattedDate)
    data.append('nombre_marca', datos?.nombre_marca)
    data.append('array_final', JSON.stringify(avance))
    data.append('_method', 'PUT')
    try {
      await axios.post(
        `${Global.url}/subirFinal/${id ?? ''}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      toast.success('SERVICIO FINALIZADO')
      getOneBrief()
      const enviarNotificacion = async (): Promise<void> => {
        const data = new FormData()
        const currentUrl = window.location.href
        // Utilizar el objeto URL para extraer la ruta
        const urlObject = new URL(currentUrl)
        const pathName = urlObject.pathname
        data.append('id_usuario', auth.id)
        data.append('id_venta', String(id))
        data.append('nombre', auth.name)
        data.append('icono', 'correo')
        data.append('url', pathName)
        data.append(
          'contenido',
          `Ha enviado el corrreo final del proyecto ${
            datos?.nombre_marca ?? ''
          }  (${datos?.nombres ?? ''})`
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
        }
      }
      enviarNotificacion()
    } catch (error: unknown) {
      console.log(error)
    }
  }

  const retiroAdministradorCM = (): void => {
    toast('¿Seguro de finalizar el servicio?', {
      className: 'toast_style',
      duration: 20000,
      action: {
        label: 'SI',
        onClick: async (): Promise<void> => {
          setLoadingReenvio(true)
          const data = new FormData()
          data.append('marca', datos?.nombre_marca)
          data.append('nombres', datos?.nombres)
          data.append('plan', datos?.nombre_plan)
          data.append('email', datos?.email)
          data.append('firma', auth.firma)
          try {
            const respuesta = await axios.post(
              `${Global.url}/retiroAdministradorCM/${id ?? ''}`,
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
              enviarCorreoFinal()
            }
          } catch (error: unknown) {
            console.log(error)
            toast.error('Error')
          } finally {
            setLoadingReenvio(false)
          }
        }
      }
    })
  }

  const [seguimientoRegistrado, setseguimientoRegistrado] = useState<Proceso[]>([])

  const actualizarSeguimientoBD = async (procesos: any): Promise<void> => {
    const data = new FormData()
    data.append('mantenimientoWeb', JSON.stringify(procesos))
    data.append('_method', 'PUT')
    try {
      const result = await axios.post(
          `${Global.url}/actualizarMantenimiento/${id ?? ''}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${
                token !== null && token !== '' ? token : ''
              }`
            }
          }
      )
      if (result.data.status == 'success') {
        toast.success('Seguimiento actualizado')
        getOneBrief()
      }
    } catch (error: unknown) {
      console.log(error)
      toast.error('Error')
    }
  }

  const [addFecha, setAdFecha] = useState(false)
  const today = new Date().toISOString().slice(0, 10)
  const [nuevaFecha, setNuevaFecha] = useState<string>(today)
  const [nuevoPrecio, setNuevoPrecio] = useState('')
  const [montoPrecio, setMontoprecio] = useState('')
  const [factura, setFactura] = useState('')
  const [banco, setBanco] = useState('')
  const [archivosSubido, setArchivosSubido] = useState<any | null>(null)
  const [openArchivo, setOpenArchivo] = useState(false)

  const limiarCampos = (): void => {
    setNuevoPrecio('')
    setNuevaFecha(today)
    setAdFecha(false)
    setMontoprecio('')
    setFactura('')
    setBanco('')
    setArchivosSubido(null)
  }

  const updateHosting2 = async (updatedEvents: any): Promise<void> => {
    setLoading(true)
    const data = new FormData()
    data.append('renovacion', JSON.stringify(updatedEvents))
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/deleteRenovacion/${id ?? ''}`,
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
        toast.success('Renovación eliminada')
        getOneBrief()
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

  const eliminarFecha = (index: number): void => {
    const updatedFechas = datos?.renovacion.fechas.filter(
      (_: any, idx: number) => idx != index
    )

    const updatedHosting = {
      fechas: updatedFechas
    }
    updateHosting2(updatedHosting)
  }

  const updateHosting = async (
    updatedEvents: any,
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
    const avance = {
      idUnico,
      fecha,
      hora,
      asunto: `RENOVACIÓN DE ${datos?.nombre_plan ?? ''}`,
      empresa: datos?.marca ?? '',
      contacto: `${datos?.nombres}`,
      motivo: `RENOVACIÓN DE ${datos?.nombre_plan ?? ''}`,
      fechaacta: fechaFormateada,
      imagenes: [],
      archivos: archivosSubido,
      correos: [{ id: Date.now(), correo: datos?.email ?? '' }],
      // eslint-disable-next-line no-useless-escape
      contexto: `<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\">
        <p>Buenas tardes Estimado(a) ${datos.nombres},</p>
        <p>Es un placer para nosotros comunicarnos contigo para expresar nuestro sincero agradecimiento por haber renovado tu servicio de Alquiler de hosting con Logos Perú. Valoramos profundamente tu confianza en nuestros servicios y nos comprometemos a seguir brindándote el mejor soporte y calidad en cada aspecto de tu experiencia con nosotros.</p>
        <p>Recuerda que estamos aquí para cualquier consulta, solicitud o soporte técnico que requieras. No dudes en contactarnos ante cualquier inquietud o sugerencia.</p>
        <p>Una vez más, ¡gracias por elegirnos como tu proveedor de servicios de Alquiler de hosting!</p>
        <p>¡Saludos cordiales!</p>
    </div>`,
      conclusion: '',
      firma: 'firma_agencia.jpg'
    }
    data.append('idUnico', idUnico)
    data.append('renovacion', JSON.stringify(updatedEvents))
    data.append('contrato', datos?.id_contrato)
    data.append(
      'nombres',
        `${datos.nombres}`
    )
    data.append('email', datos?.email)
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
    data.append('correlativo', datos?.id_contrato)
    data.append('dni', datos.celular)
    data.append('nombre_plan', datos?.nombre_plan ?? '')
    data.append(
      'title',
        `${datos.nombres.toUpperCase()}`
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
      await axios.post(`${Global.url}/subirAvancesComprobante/${id ?? ''}`, data, {
        headers: {
          Authorization: `Bearer ${
                token !== null && token !== '' ? token : ''
              }`
        }
      })

      if (respuesta.data.status == 'success') {
        toast.success('Datos actualizados')
        getOneBrief()
        setNuevoPrecio('')
        setNuevaFecha(today)
        setMontoprecio('')
        setFactura('')
        setBanco('')
        setAdFecha(false)
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

  const agregarFecha = async (): Promise<void> => {
    const idUnico = uuidv4()

    if (nuevaFecha && nuevoPrecio) {
      let preciofinal = 0
      let igvfinal = 0

      if (factura === 'Con factura') {
        igvfinal = Number(nuevoPrecio) * 0.18
      } else {
        igvfinal = 0
      }

      preciofinal = Number(nuevoPrecio) + igvfinal
      preciofinal = Number(preciofinal.toFixed(2))

      let pendiente = 0
      if (Number(preciofinal) - Number(montoPrecio) > 0) {
        pendiente = Number((Number(preciofinal) - Number(montoPrecio)).toFixed(2))
      }

      const newFechaEntry = {
        fecha: nuevaFecha,
        precio: nuevoPrecio,
        pendiente,
        archivo_factura: archivosSubido && archivosSubido.name ? `${idUnico}_${archivosSubido.name}` : '',
        comprobante: `${idUnico}_COMPROBANTE DE PAGO - ${datos?.nombres}`,
        banco,
        factura,
        montoPrecio
      }

      const updatedHosting = {
        fechas: datos?.renovacion.fechas ? [...datos?.renovacion.fechas, newFechaEntry] : [newFechaEntry]
      }
      setAdFecha(false)
      setNuevaFecha('')
      updateHosting(updatedHosting, nuevoPrecio, idUnico)
    } else {
      toast.error('Error al agregar fecha o precio')
    }
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
        {auth.id_rol == 99 &&
            <div className='flex flex-col lg:flex-row gap-3 items-center mb-2 justify-between'>
                <div className='flex gap-3 items-center justify-between lg:justify-start w-full'>
                    <div className='flex gap-3 bg-main px-3 py-1 rounded-md cursor-pointer hover:bg-main_dark' onClick={() => { setOpenObsequio(!openObsequio) } }>
                                <span className='text-white'>Adicionales</span>
                                <BsFillGiftFill className='text-2xl  rounded-lg text-white  transition-colors cursor-pointer' />
                    </div>
                    <div className='w-fit  relative z-[11]'>
                        <div className='w-full  px-3 py-1 items-center rounded-md bg-green-600 hover:bg-green-700 transition-colors cursor-pointer flex gap-3' onClick={() => { setMostrarSelector(!mostrarSelector) }}>
                            <span className='text-white'>Reenviar archivos</span>
                            <AiTwotoneCalendar className='text-2xl  text-white transition-colors ' />
                        </div>
                        {mostrarSelector && (
                            <div className='absolute top-full w-fit shadow-md flex flex-col bg-white p-4 rounded-md mt-2 left-0 right-0 z-[11]'>
                                <DatePicker
                                    selected={fechaSeleccionada}
                                    onChange={handleFechaSeleccionada}
                                    dateFormat="dd/MM/yyyy"
                                    className='text-black border px-3 py-1 border-gray-300 rounded-md'

                                />
                                <button disabled={loadingReenvio} className='bg-secondary-150 px-2 py-1 w-fit rounded-md text-white mt-3' type='button'
                                onClick={async () => { await reenviarArchivos() }}
                                >Guardar</button>
                            </div>
                        )}
                    </div>
                    {
                    datos?.fecha_adicional &&
                        <div className='flex gap-3 items-center bg-white rounded-md px-2 py-1'>
                            <span className='text-black h-full flex items-center'>{
                            format(new Date(datos?.fecha_adicional), 'dd/MM/yyyy')}</span>
                            <AiFillCloseCircle className='text-2xl text-main cursor-pointer'
                                onClick={async () => { if (!loadingReenvio) { await reenviarArchivos2() } }}
                            />
                        </div>
                    }
                    {(datos?.id_contrato.split('_')[0]).includes('LPCM') && datos?.fecha_fin == null &&
                        <div className='flex gap-3 bg-secundario px-3 py-1 rounded-md cursor-pointer hover:bg-secundario_dark transition-colors' onClick={() => { retiroAdministradorCM() } }>
                            <span className='text-white'>Finalizar servicio</span>
                        </div>
                    }
                </div>
                <div className='w-full flex justify-end'>
                    {!(datos?.id_contrato.split('_')[0]).includes('LPCM') && datos?.fecha_fin == null &&
                        <ButtonHabilitate communityActivo={communityActivo} datos={datos} id={id} setLoading={setLoading} token={token} getOneBrief={getOneBrief} plan={plan}/>
                        }
                </div>
            </div>
            }

            {auth.id == '2' &&
            <div className='flex flex-col lg:flex-row gap-3 items-center mb-2 justify-between'>
                <div className='flex gap-3 items-center justify-between lg:justify-start w-full'>
                    {(datos?.id_contrato.split('_')[0]).includes('LPCM') && datos?.fecha_fin == null &&
                        <div className='flex gap-3 bg-secundario px-3 py-1 rounded-md cursor-pointer hover:bg-secundario_dark transition-colors' onClick={() => { retiroAdministradorCM() } }>
                            <span className='text-white'>Finalizar servicio</span>
                        </div>
                    }
                </div>
            </div>
            }

           {(datos?.id_contrato.split('_')[0]).includes('LPCM')
             ? <form className="mt-5 relative" onSubmit={handleSubmit}>
              {(auth.id_rol == 99 || auth.id == '2') && datos?.fecha_fin == null &&
              <div className={cn(' bottom-full absolute right-0 flex items-center gap-5 px-6 py-2 rounded-xl mb-2', communityActivo == 'false' ? 'bg-red-500 ' : 'bg-green-600')}>
                <p className='text-white text-lg'>El proyecto esta {communityActivo == 'false' ? 'deshabilitado' : 'habilitado'}</p>
                <button type="button" className='bg-white rounded-lg px-3 text-red-500 transition-all hover:bg-gray-100' onClick={() => { habilitarProyecto() }}> {communityActivo == 'false' ? 'Habilitar' : 'Deshabilitar'} </button>
               </div>
              }
              {/* <button type='button' onClick={async (e) => { await correoDesactivateCM(); e.preventDefault() }}>Enviar correo</button> */}

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
                   diferenciaDias={diferenciaDias}
                   communityActivo={communityActivo}
                 />
               </div>
               <Link to={`/admin/lista-servicios/avances/metricas-cm/${id ?? ''}`} className="h-[600px] flex flex-col gap-3 col-span-2 lg:col-span-1">
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
               </Link>
             </section>

             {auth.id_rol == 99 || auth.id == '2'
               ? <div className="w-full shadow_hosting_grafico bg-white rounded-2xl p-3 lg:p-6 flex  flex-col  relative mt-4">
                    {!addFecha ? (
                    <>
                        <IoAddCircle
                        className="absolute top-2 right-2 text-main text-2xl  transition-all cursor-pointer"
                        onClick={() => {
                          setAdFecha(!addFecha)
                        }}
                        />
                        <div className="flex justify-between text-[#3c70a6] w-full m-0 p-0">
                        <div className="font-bold text-base lg:text-xl uppercase">
                            PLAN {
                            datos?.nombre_plan ?? ''}
                        </div>
                        </div>
                        <div className="lg:mx-auto w-full flex flex-row flex-1 space-x-3 space-y-3 md:space-y-0">

                        {datos?.renovacion && (
                            <Swiper
                            breakpoints={{
                              0: {
                                slidesPerView: 4
                              },
                              576: {
                                slidesPerView:
                                    (datos?.renovacion).length <= 7
                                      ? (datos?.renovacion).length
                                      : 7
                              },
                              768: {
                                slidesPerView:
                                    (datos?.renovacion).length <= 12
                                      ? (datos?.renovacion).length
                                      : 12
                              },
                              1024: {
                                slidesPerView: 5
                              },
                              1200: {
                                slidesPerView: 7
                              },
                              1600: {
                                slidesPerView:
                                    (datos?.renovacion).length <= 10
                                      ? (datos?.renovacion).length
                                      : 10
                              }
                            }}
                            pagination={{
                              dynamicBullets: true
                            }}
                            modules={[Pagination]}
                            className="w-full"
                            >
                            {datos?.renovacion.fechas
                              ?.sort(
                                (a: any, b: any) =>
                                // @ts-expect-error
                                  new Date(a.fecha) - new Date(b.fecha)
                              )
                              .map((fecha: any, index: number) => (
                                <SwiperSlide
                                    key={index}
                                    onClick={() => {
                                      setOpenComprobantes(true)
                                      setComprobante(fecha)
                                    }}
                                    className="w-full flex group flex-col items-center space-y-2 justify-start gap-x-0"
                                >
                                    <div className="w-5 order-1 md:order-none mt-2 bg-gradient-to-t from-[#3c70a6] to-[#7aade3] cursor-pointer hover:w-6 transition-all h-32 rounded-full"></div>
                                    <div className="text-black relative w-full">
                                    <h5 className="text-[11px] font-bold text-center w-full flex justify-center items-center gap-1">
                                        {format(parseISO(fecha.fecha), 'MM/yyyy')}
                                        <span
                                        onClick={(e) => {
                                          e.stopPropagation()
                                          eliminarFecha(index)
                                        }}
                                        className="opacity-0 group-hover:opacity-100 cursor-pointer text-main"
                                        >
                                        x
                                        </span>
                                    </h5>
                                    <h6 className="group-hover:opacity-100 opacity-0 transition-opacity text-[12px] text-main font-bold text-center absolute left-0 right-0">
                                        S/ {fecha.precio}
                                    </h6>
                                    </div>
                                </SwiperSlide>
                              ))}
                            </Swiper>
                        )}
                        </div>
                    </>
                    ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center group relative text-black ">
                            <IoCloseCircle
                            className="absolute top-2 right-2 text-main text-2xl opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10"
                            onClick={() => { limiarCampos() }}
                            />
                            <h3 className="mb-4 text-black font-bold ">RENOVACIÓN</h3>
                            <section className="w-full flex gap-3 items-center">
                            <div className="w-full lg:relative ">
                                <label
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                htmlFor="email"
                                >
                                Fecha
                                </label>
                                <input
                                className="h-9 w-full text-black rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                                name="inicio"
                                type="date"
                                value={nuevaFecha}
                                onChange={(e) => {
                                  setNuevaFecha(e.target.value)
                                }}
                                />
                            </div>
                            <div className="w-full lg:relative ">
                                <label
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                htmlFor="email"
                                >
                                Precio total
                                </label>
                                <input
                                className="h-9 w-full  text-black rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                                name="precio"
                                type="number"
                                value={nuevoPrecio}
                                onChange={(e) => {
                                  setNuevoPrecio(e.target.value)
                                }}
                                />
                            </div>
                            <div className="w-full lg:relative ">
                                <label
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                htmlFor="email"
                                >
                                Monto cobrado
                                </label>
                                <input
                                className="h-9 w-full  text-black rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                                name="precio"
                                type="number"
                                value={montoPrecio}
                                onChange={(e) => {
                                  setMontoprecio(e.target.value)
                                }}
                                />
                            </div>
                            </section>
                            <section className="w-full flex gap-3 mt-4">
                            <div className="w-full lg:relative pb-5">
                                <label
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                htmlFor="email"
                                >
                                Comprobante
                                </label>
                                <select
                                className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                                name="factura"
                                value={factura}
                                onChange={(e) => {
                                  setFactura(e.target.value)
                                }}
                                disabled={false}
                                >
                                <option value="">Seleccionar</option>
                                <option value="Con factura">Con factura</option>
                                <option value="Sin factura">Sin factura</option>
                                </select>
                            </div>
                            <div className="w-full lg:relative pb-5">
                                <label
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                htmlFor="email"
                                >
                                Entidad bancaria
                                </label>
                                <select
                                className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                                name="banco"
                                value={banco}
                                onChange={(e) => {
                                  setBanco(e.target.value)
                                }}
                                disabled={false}
                                >
                                <option value="">Seleccionar</option>
                                <option value="BCP">BCP</option>
                                <option value="BBVA">BBVA</option>
                                <option value="YAPE">YAPE</option>
                                <option value="PLIN">PLIN</option>
                                <option value="XOOM">XOOM</option>
                                <option value="MONEY GRAM">MONEY GRAM</option>
                                <option value="WESTER UNION">WESTER UNION</option>
                                <option value="PLIN">PLIN</option>
                                <option value="TARJETA DE CREDITO">TARJETA DE CREDITO</option>
                                <option value="MERCADO PAGO">MERCADO PAGO</option>
                                <option value="OTROS">OTROS</option>
                                </select>
                            </div>
                            </section>
                            {!archivosSubido
                              ? (
                            <button
                                className="mt-3 border-b-2 border-blue-500 hover:text-blue-500 transition-colors"
                                type="button"
                                onClick={() => {
                                  setOpenArchivo(true)
                                }}
                            >
                                CARGAR DOCUMENTO
                            </button>
                                )
                              : (
                            <span className="mt-1 flex gap-1 items-center">
                                {archivosSubido.name}{' '}
                                <span
                                className="text-red-500 text-2xl cursor-pointer font-bold"
                                onClick={() => { setArchivosSubido(null) }}
                                >
                                x
                                </span>{' '}
                            </span>
                                )}

                            <SubirArchivo
                                open={openArchivo}
                                setOpen={setOpenArchivo}
                                setArchivosSubido={setArchivosSubido}
                                archivosSubido={archivosSubido}
                            />

                            <input
                            type="button"
                            disabled={loading}
                            className={cn('px-3 py-2 mt-4 text-white rounded-md cursor-pointer hover:bg-secundario_dark transition-colors', loading ? 'bg-secundario_dark' : 'bg-secondary-150 ')}
                            value={`${!loading ? 'Guardar' : 'Guardando...'}`}
                            onClick={async () => {
                              await agregarFecha()
                            }}
                            />
                    </div>
                    )}
                </div>
               : <div className="w-full shadow_hosting_grafico bg-white rounded-2xl p-3 lg:p-6 flex  flex-col  relative mt-4">
                    <>
                        <div className="flex justify-between text-[#3c70a6] w-full m-0 p-0">
                        <div className="font-bold text-base lg:text-xl uppercase">
                            PLAN {
                            datos?.nombre_plan ?? ''}
                        </div>
                        </div>
                        <div className="lg:mx-auto w-full flex flex-row flex-1 space-x-3 space-y-3 md:space-y-0">
                        {datos?.renovacion && (
                            <Swiper
                            breakpoints={{
                              0: {
                                slidesPerView: 4
                              },
                              576: {
                                slidesPerView:
                                    (datos?.renovacion).length <= 7
                                      ? (datos?.renovacion).length
                                      : 7
                              },
                              768: {
                                slidesPerView:
                                    (datos?.renovacion).length <= 12
                                      ? (datos?.renovacion).length
                                      : 12
                              },
                              1024: {
                                slidesPerView: 5
                              },
                              1200: {
                                slidesPerView: 7
                              },
                              1600: {
                                slidesPerView:
                                    (datos?.renovacion).length <= 10
                                      ? (datos?.renovacion).length
                                      : 10
                              }
                            }}
                            pagination={{
                              dynamicBullets: true
                            }}
                            modules={[Pagination]}
                            className="w-full"
                            >
                            {datos?.renovacion.fechas
                              ?.sort(
                                (a: any, b: any) =>
                                // @ts-expect-error
                                  new Date(a.fecha) - new Date(b.fecha)
                              )
                              .map((fecha: any, index: number) => (
                                <SwiperSlide
                                    key={index}
                                    className="w-full flex group flex-col items-center space-y-2 justify-start gap-x-0"
                                >
                                    <div className="w-5 order-1 md:order-none mt-2 bg-gradient-to-t from-[#3c70a6] to-[#7aade3] cursor-pointer hover:w-6 transition-all h-32 rounded-full"></div>
                                    <div className="text-black relative w-full">
                                    <h5 className="text-[11px] font-bold text-center w-full flex justify-center items-center gap-1">
                                        {format(parseISO(fecha.fecha), 'MM/yyyy')}
                                    </h5>
                                    </div>
                                </SwiperSlide>
                              ))}
                            </Swiper>
                        )}
                        </div>
                    </>
                </div>
             }

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
                    <div className="flex gap-2 w-full justify-end">
                        <input
                            type="submit"
                            className="bg-main_2-200 text-white hover:bg-primary flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
                            value="Grabar comentario"
                        />
                    </div>
                </div>
                <div className='text-black mb-4'>
                    <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                    >
                        PUNTUACION DEL CLIENTE
                    </label>
                        <select
                        className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                        name='puntuacion'
                        value={values.puntuacion}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={false}
                    >
                        <option value="">Seleccionar</option>
                            <option value="1">1</option>
                            <option value="2">2</option>
                            <option value="3">3</option>
                            <option value="4">4</option>
                            <option value="5">5</option>
                            <option value="6">6</option>
                            <option value="7">7</option>
                            <option value="8">8</option>
                            <option value="9">9</option>
                            <option value="10">10</option>
                        </select>
                    <Errors
                        errors={errors.puntuacion}
                        touched={touched.puntuacion}
                    />
                </div>
                <label
                    className="text-sm text-black font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="email"
                >
                    COMENTARIO GENERAL
                </label>
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
             : (datos?.id_contrato.split('_')[0].includes('LPW') ||
             datos?.id_contrato.split('_')[0].includes('LPTV') ||
             datos?.id_contrato.split('_')[0].includes('LPSISTEMA') ||
             datos?.id_contrato.split('_')[0].includes('LPLANDING') ||
             datos?.id_contrato.split('_')[0].includes('LPSEO') ||
             datos?.id_contrato.split('_')[0].includes('LPCONC') ||
             datos?.id_contrato.split('_')[0].includes('LPACTW') ||
             datos?.id_contrato.split('_')[0].includes('LPACTWE') ||
             datos?.id_contrato.split('_')[0].includes('LPMGDOM'))
                 ? <PlanDesarrolloWeb
                 oneHost={oneHost}
                 handleSubmit={handleSubmit}
                 setDataUpdatedWeb={setDataUpdatedWeb}
                 datos={datos}
                 dataUpdatedWeb={dataUpdatedWeb}
                 colaborador={colaborador}
                 colaboradores={colaboradores}
                 setPercentage={setPercentage}
                 percentage={percentage}
                 updatePropuestas={updatePropuestas}
                 fillAnimation={fillAnimation}
                 setseguimientoRegistrado={setseguimientoRegistrado}
                 seguimientoRegistrado={seguimientoRegistrado}
                 actualizarSeguimientoBD={actualizarSeguimientoBD}
                 getOneBrief={getOneBrief}
                 getOneBrief2={getOneBrief2}
                 values={values}
                 pdfName={pdfName}
                 setpdfName={setpdfName}
                 fechaCreacion={fechaCreacion}
                 limite={limite}
                 plan={plan}
                 validateBrief={validateBrief}
                 setOpenQuestion={setOpenQuestion}
                 setOpenMail={setOpenMail}
                 arrayAlta={arrayAlta}
                 arrayAvances={arrayAvances}
                 setAvance={setAvance}
                 setOpenAvance={setOpenAvance}
                 setOpenFinal={setOpenFinal}
                 arrayFinal={arrayFinal}
                 setfinal={setfinal}
                 setOpenActa={setOpenActa}
                 arrayActa={arrayActa}
                 setopenAlta={setopenAlta}
                 handleChange={handleChange}
                 handleBlur={handleBlur}
                 errors={errors}
                 touched={touched}
                 activeDomHosOwner={activeDomHosOwner}
                  setActiveDomHosOwner={setActiveDomHosOwner}
                  setLoading={setLoading}
                  loading = {loading}
                 />

                 : datos?.id_contrato.split('_')[0].includes('LPADS')
                   ? <PlanAds
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
                    pdfName={pdfName}
                    fechaCreacion={fechaCreacion}
                    limite={limite}
                    plan={plan}
                    validateBrief={validateBrief}
                    />
                   : (datos.id_contrato.includes('LP69') || ((datos.id_contrato).toUpperCase()).includes('LPMANUAL') || (datos.id_contrato.includes('LP79') || datos.id_contrato.includes('LP89') || (datos.id_contrato.includes('LPPG')) || (datos.id_contrato.includes('LPFL')) || (datos.id_contrato.includes('LPEXC')) || (datos.id_contrato.includes('LPB'))))
                       ? (
                    <PlanLogotipo
                    piezasGraficas={piezasGraficas}
                    getOneBrief={getOneBrief}
                    dataUpdatedDiseno={dataUpdatedDiseno}
                    id={id}
                    limite={limite}
                    brief={brief}
                    pdfName={pdfName}
                    plan={plan}
                    updateStructuraDiseno={updateStructuraDiseno}
                    updatePiezas={updatePiezas}
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
                    setLoading={setLoading}
                    loading = {loading}
                  />
                         ) : (
                        <form className="mt-5" onSubmit={handleSubmit}>
                          <div className="bg-white p-4 rounded-xl mt-6">
                              <div className="flex flex-col md:flex-row justify-between md:items-center gap-4 md:gap-0">
                                  <span className="text-left flex flex-col md:flex-row gap-2 md:gap-6 text-black uppercase">
                                      <span className="text-sm md:text-base font-bold">
                                          COLABORADOR(ES) A CARGO:
                                      </span>
                                      {colaborador?.map((asignacion: any, index: number) => {
                                        const assignedCollaborators = colaboradores
                                          .filter(
                                            (colaborador: { id: number, name: string }) =>
                                              colaborador.id == asignacion.peso
                                          )
                                          .map((colaborador: { name: string }) => colaborador.name)
                                        return (
                                              <Fragment key={index}>
                                                  {assignedCollaborators && (
                                                      <span>{assignedCollaborators}</span>
                                                  )}
                                                  {index < colaborador.length - 1}
                                              </Fragment>
                                        )
                                      })}
                                  </span>
                                  {!values.fecha_fin && (
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
                                                        title: 'EL cliente no tiene un email registrado',
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
                                  )}
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
                              <div className="w-full flex flex-col justify-start md:items-start gap-y-2 relative">
                                  <div className="flex flex-col gap-2 mb-3 ">
                                      <h2 className="text-xl lg:text-2xl font-bold text-black">Seguimiento del proyecto</h2>
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
                                  <div className="flex gap-2 w-full justify-end">
                                      <input
                                          type="submit"
                                          className="bg-main_2-200 text-white hover:bg-primary flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
                                          value="Grabar comentario"
                                      />
                                  </div>
                              </div>
                                <div className='text-black mb-4'>
                                    <label
                                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                        htmlFor="email"
                                    >
                                        PUNTUACION DEL CLIENTE
                                    </label>
                                        <select
                                        className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                                        name='puntuacion'
                                        value={values.puntuacion}
                                        onChange={handleChange}
                                        onBlur={handleBlur}
                                        disabled={false}
                                    >
                                        <option value="">Seleccionar</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                            <option value="7">7</option>
                                            <option value="8">8</option>
                                            <option value="9">9</option>
                                            <option value="10">10</option>
                                        </select>
                                    <Errors
                                        errors={errors.puntuacion}
                                        touched={touched.puntuacion}
                                    />
                                </div>
                                <label
                                    className="text-sm text-black font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                    htmlFor="email"
                                >
                                    COMENTARIO GENERAL
                                </label>
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
                         )}
          <ModalQuestion
            open={openQuestion}
            setOpen={setOpenQuestion}
            arrayAvances={arrayAvances}
            openCorreo={setOpen}
            setOpenCorreoActa={setOpenCorreoActa}
            setOpenAvisoNotificacion={setOpenAvisoNotificacion}
            setOpenFeErratas={setOpenFeErratas}
            values={values}
            setOpenActaAceptacion={setOpenActaAceptacion}
          />
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

          <ModalFeErratas
            open={openFeErratas}
            setOpen={setOpenFeErratas}
            arrayAvances={arrayAvances}
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
          type='button'
            className="bg-green-700 rounded-full p-4 fixed right-6 bottom-6 z-50"
            onClick={() => {
              if ((datos.nombre_marca.length > 0 || auth.id_rol == 99)) {
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

     <ModalViewComprobantes
        datos={datos}
        getDatos={getOneBrief}
        open={openComprobantes}
        setOpen={setOpenComprobantes}
        comprobante={comprobante}
      />

    </>
  )
}
