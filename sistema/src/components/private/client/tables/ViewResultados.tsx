/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable multiline-ternary */
import { Fragment, useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import Swal from 'sweetalert2'
import { Loading } from '../../../shared/Loading'
import { motion, useAnimation } from 'framer-motion'
import { Viewer, Worker } from '@react-pdf-viewer/core'
import '@react-pdf-viewer/core/lib/styles/index.css'
// URL del worker de PDF compatible con la versión 2.10.1 del API
import { SwiperAvances } from './avances/SwiperAvances'
import { ViewFinal } from './avances/ViewFinal'
import Tour from 'reactour'
import { Archivos } from './components/Archivos'
import { IndexComunity } from './comunnity/IndexComunity'
import { FaFacebookF, FaTiktok } from 'react-icons/fa'
import { FiInstagram } from 'react-icons/fi'
import { v4 as uuidv4 } from 'uuid'
import { ViewAvance } from './avances/ViewAvance'
import { Swiper, SwiperSlide } from 'swiper/react'
import { PiCheck } from 'react-icons/pi'
import { CiViewTimeline, CiPaperplane, CiCircleCheck, CiGlobe, CiMonitor } from 'react-icons/ci'
import { TfiWorld } from 'react-icons/tfi'
import vieweb from '../../../../assets/webView.svg'
import { type FinalValues, type avanceValues, type bannersValues } from '../../../shared/schemas/Interfaces'
import Header2Client from '../includes/Header2Client'
import useAuthCliente from '../../../../hooks/useAuthCliente'
import {
  GetObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'

interface values {
  nombres: string
  email: string
  correo: string
  celular: string
  fecha: string
  nombre_marca: string
}

interface selectorType {
  selector: string
  content: string
}

const useResponsiveTour = (): any => {
  const [steps, setSteps] = useState<selectorType[]>([])
  useEffect(() => {
    const handleResize = (): void => {
      const stepsMovil = [
        {
          selector: '.first-stepP',
          content:
            'Tenemos el siguiente apartado donde podra descargar sus archivos finales'
        },
        {
          selector: '.second-stepM',
          content: 'Con este boton prodra realizar la descarga'
        },
        {
          selector: '.tercer-stepM',
          content:
            'Aqui podra ver el seguimiento del proyecto, como correos adjuntos. Puede presionar sobre cada tarjeta y presionar click en ver más'
        }
      ]
      const stepsPC = [
        {
          selector: '.first-stepP',
          content:
            'Tenemos el siguiente apartado donde podra descargar sus archivos finales'
        },
        {
          selector: '.second-stepP',
          content: 'Con este boton prodra realizar la descarga'
        },
        {
          selector: '.tercer-stepP',
          content:
            'Aqui podra ver el seguimiento del proyecto, como correos adjuntos. Puede pasar el mouse por cada tarjeta y presionar click en ver más'
        }
      ]
      if (window.innerWidth < 769) {
        setSteps(stepsMovil)
      } else {
        setSteps(stepsPC)
      }
    }
    window.addEventListener('resize', handleResize)
    handleResize()
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])
  return { steps }
}

export const ViewResultados = (): JSX.Element => {
  const workerUrl = 'https://intranet.logosperu.com.pe/script/pdf.worker.js'
  const { steps } = useResponsiveTour()
  const { id } = useParams()
  const token = localStorage.getItem('tokenUser')
  const { guia, setGuia, auth, setDownloadProgress, setTitle } = useAuthCliente()
  const [limite, setLimite] = useState(0)
  const [loading, setLoading] = useState(false)
  const [pdfurl, setpdfurl] = useState('')
  const [correos, setCorreos] = useState([])
  const [loadingComponents, setLoadingComponents] = useState(true)
  const [resultado, setresultado] = useState<bannersValues>({
    id: 0,
    id_contrato: '',
    nombre_marca: '',
    id_ventas: 0,
    nombre_empresa: '',
    archivos_finales: '',
    imagen1: '',
    pdf_contrato: '',
    propuestas: '',
    fecha_fin: '',
    fecha_inicio: '',
    limitar_descarga: 0,
    asignacion: '',
    created_at: '',
    updated_at: '',
    community: ''
  })
  const [brief, setBrief] = useState<any | null>(null)
  const [arrayAvances, setArrayAvances] = useState([])
  const [arrayFinal, setArrayFinal] = useState([])
  const [events, setEvents] = useState<Event[]>([])
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
  const [datos, setDatos] = useState<values>({
    nombres: '',
    email: '',
    correo: '',
    celular: '',
    fecha: '',
    nombre_marca: ''
  })
  const [final, setfinal] = useState<FinalValues>({
    contexto: '',
    correos: [],
    asunto: '',
    fecha: '',
    hora: '',
    firma: ''
  })
  const [openAvance, setOpenAvance] = useState(false)
  const [openFinal, setOpenFinal] = useState(false)
  const [dataWeb, setDataWeb] = useState<any | null>(null)
  const [fechaCreacion, setFechaCreacion] = useState<Date | null>(null)
  const plazo = 30 * 24 * 60 * 60 * 1000 // 30 días en milisegundos
  const [tiempoRestante, setTiempoRestante] = useState<number | null>(0)
  const [colaborador, setColaborador] = useState([])
  const [colaboradores, setColaboradores] = useState([])
  const [percentage, setPercentage] = useState(0) // Estado para almacenar el porcentaje

  function formatFileName (fileName: string): string {
    return fileName.split('_').pop() ?? fileName
  }

  const parseFecha = (fechaString: string): Date => {
    const [dia, mes, ano] = fechaString.split('/')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return new Date(ano, mes - 1, dia)
  }

  const getBanner = async (): Promise<void> => {
    let url = ''
    try {
      const requestColabordador = await axios.get(`${Global.url}/getColaboradores`, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      const request = await axios.get(
          `${Global.url}/showToResultados/${id ?? ''}`,
          {
            headers: {
              mode: 'no-cors',
              Authorization: `Bearer ${
                token !== null && token !== '' ? `Bearer ${token}` : ''
              }`
            }
          }
      )

      if (request.data[0].fecha_fin) {
        setPercentage(100)
      } else {
        setPercentage(0)
      }
      setColaborador(request.data[0].asignacion ? JSON.parse(request.data[0].asignacion) : [])
      setColaboradores(requestColabordador.data)

      if (request.data[0].asignacion && requestColabordador.data) {
        const asignaciones = JSON.parse(request.data[0].asignacion)
        const correos2: any = []
        asignaciones.forEach((asignacion: any) => {
          // Buscar el colaborador cuyo ID coincide con el peso de la asignación
          const colaborador = requestColabordador.data.find((colaborador: any) => colaborador.id == asignacion.peso)
          if (colaborador) {
            correos2.push({ id: uuidv4(), correo: colaborador.email })
          }
        })
        setCorreos(correos2)
      }
      if (request.data[0].propuestas) {
        url = request.data[0].propuestas
      }
      if (request.data[0].contrato) {
        setBrief({ codigo: request.data[0].contrato.codigo, uso: request.data[0].contrato.uso })
      } else {
        setBrief({ codigo: request.data[0].codigo, uso: request.data[0].uso })
      }
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      setTitle(`${request.data[0].id_contrato}`)
      setresultado(request.data[0])
      setFechaCreacion(
        request.data[0].fecha_fin ? parseFecha(request.data[0].fecha_fin) : null
      )
      setEvents(
        request.data[0].community ? JSON.parse(request.data[0].community) : []
      )
      setLimite(request.data[0].limitar_descarga)
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
      setDatos((prevDatos) => ({
        ...prevDatos,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        nombres: `${request.data[0].nombres} ${request.data[0].apellidos}`,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        correo: `${request.data[0].email}`,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        celular: `${request.data[0].celular}`,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        fecha: `${request.data[0].array_final}`,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        nombre_marca: `${request.data[0].nombre_marca}`,
        aprobacion: request.data[0].aprobacion
          ? JSON.parse(request.data[0].aprobacion)
          : [],
        fecha_adicional: request.data[0].fecha_adicional ? request.data[0].fecha_adicional : null,
        community_activo: request.data[0].community_activo
      }))
      if (request.data[0].data_web) {
        const datawebData = JSON.parse(request.data[0].data_web)
        setDataWeb(datawebData)
        setPercentage(Number(datawebData.porcentaje_proyecto))
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingComponents(false)
      if (url) {
        await axios
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          .get(`${Global.url}/pdf/${url}`, {
            headers: {
              mode: 'no-cors',
              Authorization: `Bearer ${
                  token !== null && token !== '' ? `Bearer ${token}` : ''
                }`
            },
            responseType: 'arraybuffer'
          })
          .then((response) => {
            const pdfData = new Uint8Array(response.data) // Convierte el contenido binario en un array de bytes
            const pdfBlob = new Blob([pdfData], { type: 'application/pdf' })

            // Convierte el blob en una URL del PDF
            const pdfUrl = URL.createObjectURL(pdfBlob)
            setpdfurl(pdfUrl)
          })
          .catch((error) => {
            console.error('Error al cargar el PDF:', error)
          })
      }
    }
  }

  const getData2 = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/showToResultados/${id ?? ''}`,
      {
        headers: {
          mode: 'no-cors',
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      }
    )
    setresultado(request.data[0])
  }

  const formatearNombre = (fileName: string): string => {
    const prefixIndex = fileName.indexOf('_')
    if (prefixIndex !== -1) {
      return fileName.substring(prefixIndex + 1)
    }
    return fileName
  }

  const descargarPDF = async (): Promise<void> => {
    if (resultado.limitar_descarga <= 3 && limite <= 2) {
      setLoading(true)
      try {
        const response = await axios({
          method: 'get',
          url: `${Global.url}/descargarPDF/${id ?? ''}`,
          responseType: 'blob', // Indicar que la respuesta es un blob (archivo)
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? `Bearer ${token}` : ''
            }`
          },
          onDownloadProgress: (e) => {
            const loaded = e.loaded
            const total = e.total
            if (total) {
              setDownloadProgress((loaded / total) * 100)
            }
          }
        })
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const a = document.createElement('a')
        a.href = url
        a.download = `Sustentacion_de_propuesta_${formatearNombre(
          resultado.propuestas
        )}` // Cambiar por el nombre real del archivo
        document.body.appendChild(a)
        a.click()
        a.remove()
        const resultadoDes = await axios.get(
          `${Global.url}/actualizarLimite/${id ?? ''}`,
          {
            headers: {
              mode: 'no-cors',
              Authorization: `Bearer ${
                token !== null && token !== '' ? `Bearer ${token}` : ''
              }`
            }
          }
        )
        if (resultadoDes.data.mensaje) {
          setLimite(resultadoDes.data.mensaje)
          Swal.fire(
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `Va ${resultadoDes.data.mensaje} de 3 descargas como maximo`,
            '',
            'warning'
          )
        }
      } catch (error) {
        console.error(error)
      }
      setLoading(false)
    } else {
      Swal.fire(
        'Ya agoto el maximo de descargas para este archivo',
        '',
        'warning'
      )
    }
  }

  const enviarNotificacion = async (): Promise<void> => {
    const data = new FormData()
    // Utilizar el objeto URL para extraer la ruta
    data.append('id_general', auth.name)
    data.append('tipo', 'cliente')
    data.append('nombre', auth.name)
    data.append('icono', 'descarga')
    data.append('url', id ?? '')
    data.append(
      'contenido',
      `Ha descargado sus archivos finales del proyecto ${
        datos.nombre_marca ?? ''
      }  (${datos?.nombres ?? ''} )`
    )
    try {
      await axios.post(`${Global.url}/storeNotiGeneral`, data, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })
    } catch (error: unknown) {}
  }

  const descargarFinal = async (): Promise<void> => {
    if (resultado.limitar_descarga <= 3 && limite <= 2) {
      setLoading(true)
      try {
        const response = await axios({
          method: 'get',
          url: `${Global.url}/descargarZIP/${id ?? ''}`,
          responseType: 'blob', // Indicar que la respuesta es un blob (archivo)
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? `Bearer ${token}` : ''
            }`
          },
          onDownloadProgress: (e) => {
            const loaded = e.loaded
            const total = e.total
            if (total) {
              setDownloadProgress((loaded / total) * 100)
            }
          }
        })
        const url = window.URL.createObjectURL(new Blob([response.data]))
        const a = document.createElement('a')
        a.href = url
        a.download = `${formatFileName(resultado.archivos_finales)}` // Cambiar por el nombre real del archivo
        document.body.appendChild(a)
        a.click()
        a.remove()
        const resultadoDes = await axios.get(
          `${Global.url}/actualizarLimiteDescarga/${id ?? ''}`,
          {
            headers: {
              mode: 'no-cors',
              Authorization: `Bearer ${
                token !== null && token !== '' ? `Bearer ${token}` : ''
              }`
            }
          }
        )
        if (resultadoDes.data.mensaje) {
          if (resultado.limitar_descarga <= 1 && limite < 1) {
            enviarNotificacion()
          }
          setLimite(resultadoDes.data.mensaje)
          Swal.fire(
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            `Va ${resultadoDes.data.mensaje} de 3 descargas como maximo`,
            '',
            'warning'
          )
        }
      } catch (error) {
        console.log(error)
        try {
          const formData = new FormData()
          formData.append('file_name', 'none')
          const { data } = await axios.post(
              `${Global.url}/getFileAuth/${id ?? ''}`,
              formData,
              {
                headers: {
                  'Content-Type': 'multipart/form-data',
                  Authorization: `Bearer ${
                    token !== null && token !== '' ? token : ''
                  }`
                }
              }
          )
          const s3Client = new S3Client({
            region: data.region,
            credentials: {
              accessKeyId: data.publickey, // Reemplaza con tu Access Key ID
              secretAccessKey: data.secretKey // Reemplaza con tu Secret Access Key
            }
          })
          const downloadParams = {
            Bucket: data.bucket,
            Key: `archivos_finales/${data.key}`
          }
          const response = await s3Client.send(
            new GetObjectCommand(downloadParams)
          )
          // @ts-expect-error
          const contentLength = parseInt(response.ContentLength, 10)
          let loaded = 0
          // Crear un lector para el stream de datos
          // @ts-expect-error
          const reader = response.Body.getReader()
          const chunks = []
          while (true) {
            const { done, value } = await reader.read()
            if (done) break
            chunks.push(value)
            loaded += value.length
            const progress = (loaded / contentLength) * 100
            setDownloadProgress(progress)
          }
          const blob = new Blob(chunks)
          const url = window.URL.createObjectURL(blob)
          const a = document.createElement('a')
          a.href = url
          a.download = `${formatFileName(data.key)}`
          document.body.appendChild(a)
          a.click()
          a.remove()
        } catch (error) {
          console.error(error)
        }
      }
      setLoading(false)
    } else {
      Swal.fire(
        'Ya agoto el maximo de descargas para este archivo',
        '',
        'warning'
      )
    }
  }

  const descargarArchivoZip = async (nombre: string): Promise<void> => {
    setLoading(true)
    try {
      const responseCheck = await axios({
        method: 'get',
        url: `${Global.url}/descargarArchivosAvances/${nombre ?? ''}`,
        headers: {
          Authorization: token ? `Bearer ${token}` : ''
        },
        responseType: 'json' // Pedimos JSON primero para manejar posibles errores
      })
      if (responseCheck.data.status === 'error') {
        throw new Error(responseCheck.data.message) // Lanza el error con el mensaje del servidor
      }
      const response = await axios({
        method: 'get',
        url: `${Global.url}/descargarArchivosAvances/${nombre ?? ''}`,
        responseType: 'blob', // Indicar que la respuesta es un blob (archivo)
        headers: {
          Authorization: token ? `Bearer ${token}` : '' // Solo incluir "Bearer" una vez
        },
        onDownloadProgress: (e) => {
          const loaded = e.loaded
          const total = e.total
          if (total) {
            setDownloadProgress((loaded / total) * 100)
          }
        }
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `${formatFileName(nombre)}` // Cambiar por el nombre real del archivo
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (error) {
      try {
        const formData = new FormData()
        formData.append('nombre', nombre)
        const { data } = await axios.post(
            `${Global.url}/getFileAuthAvance/${id}`,
            formData,
            {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${
                  token !== null && token !== '' ? token : ''
                }`
              }
            }
        )
        const s3Client = new S3Client({
          region: data.region,
          credentials: {
            accessKeyId: data.publickey, // Reemplaza con tu Access Key ID
            secretAccessKey: data.secretKey // Reemplaza con tu Secret Access Key
          }
        })
        const downloadParams = {
          Bucket: data.bucket,
          Key: `archivos_avances/${data.key}`
        }
        const response = await s3Client.send(
          new GetObjectCommand(downloadParams)
        )
        // @ts-expect-error
        const contentLength = parseInt(response.ContentLength, 10)
        let loaded = 0
        // Crear un lector para el stream de datos
        // @ts-expect-error
        const reader = response.Body.getReader()
        const chunks = []
        while (true) {
          const { done, value } = await reader.read()
          if (done) break
          chunks.push(value)
          loaded += value.length
          const progress = (loaded / contentLength) * 100
          setDownloadProgress(progress)
        }
        const blob = new Blob(chunks)
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement('a')
        a.href = url
        a.download = `${formatFileName(data.key)}`
        document.body.appendChild(a)
        a.click()
        a.remove()
      } catch (error) {
        console.error(error)
      }
    } finally {
      setDownloadProgress(0)
    }
    setLoading(false)
  }

  useEffect(() => {
    getBanner()
  }, [])

  useEffect(() => {
    if (fechaCreacion) {
      const actualizarTiempoRestante = (): void => {
        const ahora = new Date()
        const creacion = new Date(fechaCreacion)
        creacion.setHours(23, 59, 60, 60) // Establecer la hora a las 23:59
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        const tiempoTranscurrido = ahora - creacion
        const restante = plazo - tiempoTranscurrido
        if (restante <= 0) {
          setTiempoRestante(0)
        } else {
          setTiempoRestante(restante)
        }
      }
      const intervalId = setInterval(actualizarTiempoRestante, 1000)
      return () => {
        clearInterval(intervalId)
      }
    }
  }, [fechaCreacion, plazo])

  const handleClose = (): void => {
    setGuia(false)
  }

  const cards = [
    {
      id: 1,
      title: 'Calendario comunnity'
    }
  ]

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
  const fillAnimation = useAnimation()

  const calculateX = (percentage: number): number => {
    return 59 + 50 * Math.sin((2 * Math.PI * percentage) / 100)
  }

  const calculateY = (percentage: number): number => {
    return 60 - 50 * Math.cos((2 * Math.PI * percentage) / 100)
  }

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

  function obtenerDiaMes (fecha: string): string {
    if (fecha === 'Sin fecha') {
      return 'Sin fecha'
    }
    const partesFecha: string[] = fecha.split('-')
    const dia: number = parseInt(partesFecha[2], 10)
    const mes: number = parseInt(partesFecha[1], 10)

    // Nombres de los meses
    const nombresMeses: string[] = [
      'enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio',
      'julio', 'agosto', 'septiembre', 'octubre', 'noviembre', 'diciembre'
    ]

    const nombreMes: string = nombresMeses[mes - 1]

    return `${dia} de ${nombreMes}`
  }

  return (
    <>
      <Header2Client />
      {loadingComponents
        ? <Loading />
        : <>
          <Tour steps={steps} isOpen={guia} onRequestClose={handleClose} />
          {(resultado?.id_contrato.split('_')[0]).includes('LPCM') &&
            <section className="grid grid-cols-2 lg:grid-cols-3 lg:gap-5 mt-4 text-black">
              <div className="w-full h-[400px] lg:h-[600px] col-span-2 min-h-[300px] lg:min-h-[600px] bg-white rounded-xl p-4">
                <IndexComunity
                  cards={cards}
                  datos={resultado}
                  getOneBrief={getData2}
                  events={events}
                  brief={brief}
                  correos={correos}
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
                    <FaTiktok className="text-2xl text-white" />
                    <span className="absolute inset-0 m-auto w-full h-full text-center flex items-center justify-center text-white text-lg mb-[1px]">
                      TikTok
                    </span>
                  </div>
                </div>
                <div className="bg-white rounded-xl w-full h-full p-4 overflow-hidden">
                  <h2 className="text-[#129990] font-bold text-center w-full uppercase text-[24px]">
                    Últimos eventos
                  </h2>
                  {/* <OnlyCalendario
                    events={events}
                    // @ts-expect-error
                    setSelectedItem={setSelectedItem}
                    setOpen={setOpenModal}
                  /> */}
                </div>
              </div>
            </section>
          }

            {((resultado?.id_contrato.split('_')[0]).includes('LPW') || (resultado?.id_contrato.split('_')[0]).includes('LPTV') || resultado?.id_contrato.split('_')[0].includes('LPSISTEMA ') || (resultado?.id_contrato.split('_')[0]).includes('LPLANDING') || (resultado?.id_contrato.split('_')[0]).includes('LPSEO')) &&
                <>
                    <div className="flex flex-col 2xl:flex-row gap-3 lg:gap-6 justify-between mt-4">
                        <div className="bg-white px-4 py-6 gap-4 rounded-xl flex flex-col lg:flex-row justify-between flex-1">
                            <div className="w-full flex flex-col md:flex-row relative  gap-4 ">
                                <span className="text-left w-full md:w-1/2 relative shadow-md p-4 px-8 rounded-md flex flex-col  gap-2 md:gap-6 text-black ">
                                    <span className="text-sm md:text-base font-bold text-center uppercase text-main">
                                        {(resultado?.id_contrato.split('_')[0]).includes('LPTV') && 'Tienda virtual'}
                                        {(resultado?.id_contrato.split('_')[0]).includes('LPSEO') && 'SEO'}
                                        {(resultado?.id_contrato.split('_')[0]).includes('LPLANDING') &&
                                        'Landingpage'}
                                        {(resultado?.id_contrato.split('_')[0]).includes('LPHOSTING') && 'HOSTING'}
                                        {(resultado?.id_contrato.split('_')[0]) === 'LPWA' &&
                                        'Web Administrable'}
                                        {(resultado?.id_contrato.split('_')[0]) === 'LPW' &&
                                        'Web Informativa'}
                                         {(resultado?.id_contrato.split('_')[0]) === 'LPWM' &&
                                        'Web ADMINISTRABLE A MEDIDA'}
                                        {(resultado?.id_contrato.split('_')[0]) === 'LPSISTEMA' && 'SISTEMA WEB'}
                                    </span>
                                    <p className="text-[#252525] relative mt-2 font-semibold text-center">
                                        <a
                                        href={dataWeb?.dominio}
                                        target="_blank"
                                        rel="noreferrer"
                                        className={'relative text-center  text-blue-500 '}
                                        >
                                        {dataWeb?.dominio ? limpiarDominio(dataWeb?.dominio) : 'Sin dominio'}
                                        </a>
                                    </p>
                                    <p className="text-center relative">
                                        {dataWeb?.cant_correos}
                                    </p>
                                </span>
                                <span className="text-left w-full md:w-1/2 shadow-md p-4 px-8 rounded-md flex flex-col  gap-2  text-black uppercase">
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
                            </div>
                            <div className="flex flex-col md:flex-row w-full justify-center gap-4">
                                <div className=" shadow-md rounded-lg w-full">
                                <div className="bg_date_card_avance w-full  h-full rounded-lg p-8 px-6 flex flex-col items-center justify-center text-[#202020]">
                                    <h6 className="font-bold text-2xl text-[#2fba59]">
                                    {formatDate(resultado?.fecha_inicio)}
                                    </h6>

                                    <span className="mt-1 text-center">
                                    Fecha de inicio
                                    </span>
                                </div>
                                </div>

                                <div className=" shadow-md rounded-lg w-full">
                                <div className="bg_date_card_avance w-full  h-full rounded-lg p-8 px-6 flex flex-col items-center justify-center text-[#202020]">
                                    <h6 className="font-bold text-2xl text-[#ca3a3a]">
                                    {formatDate(resultado?.fecha_fin || '')}
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
                                    value={`${percentage}`}
                                    disabled={false}
                                    className={`text-right outline-none bg-transparent w-[40px] ${
                                        Number(percentage) === 100
                                        ? 'text-black'
                                        : 'text-[#09C08F]'
                                    } `}
                                    />{' '}
                                    <span
                                    className={`${
                                        Number(percentage) === 100
                                        ? 'text-black'
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

                    <div className="flex flex-col md:flex-row gap-2 justify-between">
                    <div className="bg-white p-4 px-4 rounded-xl mt-3 lg:mt-6 w-full md:w-[68%] min-h-[150px] relative">
                    <h5 className="text-[#202020] font-bold text-xl">
                        Procesos completados
                    </h5>
                    {dataWeb?.procesos.length === 0 ? (
                        <button
                        type="button"
                        disabled
                        className={`absolute inset-0 m-auto w-fit h-fit bg-[#4E54C8] ${resultado?.fecha_fin == null ? 'opacity-100' : 'opacity-80'} rounded-lg py-2 px-8 text-white text-center transition-all active:scale-90`}
                        >
                        Sin procesos
                        </button>
                    ) : (
                        <Swiper
                        slidesPerView={dataWeb?.procesos.length < 5 ? dataWeb?.procesos.length : 5}
                        className="h-[80%] swp_procesos"
                        spaceBetween={20}
                        breakpoints={{
                          0: {
                            slidesPerView: 1
                          },
                          576: {
                            slidesPerView: 2
                          },
                          800: {
                            slidesPerView: 3
                          },
                          1200: {
                            slidesPerView: 4
                          },
                          1600: {
                            slidesPerView: dataWeb?.procesos.length < 5 ? dataWeb?.procesos.length : 5
                          }
                        }}
                        >
                        {dataWeb?.procesos.map((proceso: any, index: number) => (
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
                    </div>
                    <div className="w-full md:w-[32%] mt-3 lg:mt-6 rounded-xl bg_web_client p-4">
                    <div className="flex gap-1 relative justify-between items-start">
                        <div className="w-full md:w-[50%]">
                        <h6 className="block text-center text-white font-[500] text-2xl mt-7">
                            {resultado.nombre_marca}
                        </h6>
                        <a
                            href={`${(resultado.id_contrato).includes('LPSEO') ? `https://www.google.com/search?q=${dataWeb?.domainTemp}` : dataWeb?.domainTemp} `}
                            target="_blank"
                            className="btn_vieweb w-fit bg-white relative rounded-full flex items-center gap-2 px-6 py-2 text-center text-black mt-5 mx-auto"
                            rel="noreferrer"
                        >
                            <TfiWorld className="text-main" />
                            {resultado?.id_contrato.includes('LPSEO') ? 'Ver indexación' : ' Ver web'}
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
                </>
            }

          <form className="bg-form p-3 md:p-8 rounded-xl mt-0 lg:mt-4 mb-4 first-stepP text-black">
            <Archivos
              resultado={resultado}
              formatFileName={formatFileName}
              tiempoRestante={tiempoRestante}
              loading={loading}
              descargarFinal={descargarFinal}
              descargarPDF={descargarPDF}
              datos={datos}
              descargarArchivoZip={descargarArchivoZip}
            />

            <div className="flex gap-2 w-full justify-end">
              <input type="hidden" name="oculto" value="1" />
              <Link
                to="/cliente"
                className="bg-green-700 px-4 py-2 rounded-md text-white"
              >
                Regresar
              </Link>
            </div>
          </form>
          {arrayAvances.length > 0 && (
            <div className="bg-form p-3 md:p-8 rounded-xl mt-4 mb-4 w-full tercer-stepP tercer-stepM text-black">
              <div className="flex flex-col gap-3 mb-6 ">
                <h2 className="text-xl lg:text-2xl font-bold">
                  Seguimiento del proyecto
                </h2>
                <h3 className="font-bold text-base">
                  <span className="text-gray-400 text-sm lg:text-base">
                    Correos recibidos
                  </span>{' '}
                </h3>
              </div>
              <div className="flex flex-col gap-3 w-full">
                <SwiperAvances
                  arrayAvances={arrayAvances}
                  setAvance={setAvance}
                  setOpen={setOpenAvance}
                  setOpenFinal={setOpenFinal}
                  arrayFinal={arrayFinal}
                  setFinal={setfinal}
                />
              </div>
            </div>
          )}
          <ViewFinal
            open={openFinal}
            setOpen={setOpenFinal}
            avance={final}
            datos={datos}
          />

           <ViewAvance
            open={openAvance}
            setOpen={setOpenAvance}
            avance={avance}
            getData={getBanner}
            datos={datos}
            arrayAvances={arrayAvances}
            setArrayAvances={setArrayAvances}
          />

          {resultado.propuestas != undefined && resultado.propuestas && (
            <div className="bg-white rounded-xl py-4">
              <div className="flex flex-col md:items-center gap-y-4 mb-10 md:mb-0 justify-center">
                <div className="w-full px-8">
                  <p className="font-bold text-black text-center text-lg lg:text-2xl">
                    <span></span> VISUALIZACIÓN DE PROPUESTAS
                  </p>
                </div>
                <div className="w-full md:w-[80%] max-h-[700px] overflow-y-scroll mx-auto agregar_scroll">
                {pdfurl &&
                // @ts-expect-error
                    <Worker workerUrl={workerUrl}>
                        <Viewer
                            fileUrl={pdfurl}
                        />
                    </Worker>
                }
                </div>
              </div>
            </div>
          )}
        </>}
    </>
  )
}
