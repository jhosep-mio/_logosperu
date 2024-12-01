/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState
} from 'react'
import Dialog from '@mui/material/Dialog'
import Slide from '@mui/material/Slide'
import { type TransitionProps } from '@mui/material/transitions'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import {
  type arrayCorreos,
  type arrayAsignacion,
  type ValuesVenta
} from '../../../../shared/schemas/Interfaces'
import { useFormik } from 'formik'
import { SchemaValidarAlta } from '../../../../shared/schemas/Schemas'
import Swal from 'sweetalert2'
import { toast } from 'sonner'
import { Errors } from '../../../../shared/Errors'
import useAuth from '../../../../../hooks/useAuth'
import { v4 as uuidv4 } from 'uuid'
import EditorPdfAltas from '../../../../shared/modals/EditorPdfAltas'
import { ListaUsuarios } from '../../contratos/alta/ListaUsuarios'
import { useNavigate } from 'react-router-dom'

const Transition = React.forwardRef(function Transition (
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

interface valuesInterface {
  open: boolean
  datos: ValuesVenta | null
  setOpen: Dispatch<SetStateAction<boolean>>
  usuarios: never[]
}

export const GenerarAlta = ({
  open,
  datos,
  setOpen,
  usuarios
}: valuesInterface): JSX.Element => {
  const { auth } = useAuth()
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(false)
  const [contenido, setContenido] = useState('')
  const [correos, setCorreos] = useState<arrayCorreos[]>([])
  const [arrayPesos, setarrayPesos] = useState<arrayAsignacion[]>([
    { id: null, peso: '' }
  ])
  const navigate = useNavigate()

  const generarFecha = (): string => {
    const fechaActual: Date = new Date()
    const dia: number = fechaActual.getDate()
    const mes: number = fechaActual.getMonth() + 1 // Los meses comienzan desde 0
    const año: number = fechaActual.getFullYear()
    const formatearNumero = (numero: number): string => {
      return numero < 10 ? `0${numero}` : `${numero}`
    }
    // Formatear día, mes y año
    const diaFormateado = formatearNumero(dia)
    const mesFormateado = formatearNumero(mes)
    return `${diaFormateado}/${mesFormateado}/${año}`
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

  const generarVenta = async (): Promise<void> => {
    if (arrayPesos.length > 0) {
      setLoading(true)
      try {
        const data2 = new FormData()
        // ENVIO DE MAIL
        data2.append('titulo', values.asunto)
        data2.append('contexto', contenido)
        data2.append('email', auth.email)
        data2.append('id_contacto', '')
        data2.append('email_alter', auth.email_alter)
        data2.append('correos', JSON.stringify(correos))
        data2.append('password', auth.pass_email)
        data2.append('firma', auth.firma)
        data2.append('fecha_alta', generarFecha())
        data2.append('fecha_inicio', values.fecha_inicio)
        const { fecha, hora } = obtenerFechaHora()
        const avance = {
          fecha,
          hora,
          asunto: values.asunto,
          correos,
          contexto: contenido,
          firma: auth.firma
        }
        data2.append('array_avances', JSON.stringify(avance))
        data2.append('_method', 'PUT')

        const request = await axios.post(`${Global.url}/storeAlta/${datos?.id ?? ''}`, data2, {
          headers: {
            Authorization: `Bearer ${
                token !== null && token !== '' ? token : ''
              }`
          }
        })
        if (request.data.status == 'success') {
          toast.success('Alta enviada')
          const enviarNotificacion = async (): Promise<void> => {
            const data = new FormData()
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            const pathName = `/admin/lista-servicios/avances/${datos?.id ?? ''}`
            data.append('id_usuario', auth.id)
            data.append('id_venta', String(datos?.id))
            data.append('nombre', auth.name)
            data.append('icono', 'correo')
            data.append('url', pathName)
            data.append(
              'contenido',
                  `Ha enviado una alta para el proyecto ${
                    datos?.nombre_empresa ?? ''
                  }  (${datos?.nombres ?? ''} ${datos?.apellidos ?? ''})`
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
          navigate(`/admin/lista-servicios/avances/${datos?.id ?? ''}`)
        } else if (request.data.message.includes('codigo invalido')) {
          toast.warning('YA EXISTE UN ALTA Y PROYECTO PARA ESTE CONTRATO')
        } else {
          Swal.fire('Error al generar la venta', '', 'error')
        }
      } catch (error: any) {
        console.log(error)
        if (
          error.request.response.includes(
                  `Duplicate entry '${values.id_contrato}' for key 'id_contrato'`
          )
        ) {
          toast.error('YA EXISTE UN ALTA Y PROYECTO PARA ESTE CONTRATO')
        } else if (
          error.request.response.includes(
            'An email must have a'
          )
        ) {
          toast.warning('DEBE REGISTRAR UN EMAIL PARA EL CLIENTE')
        } else {
          toast.error('ERROR')
        }
      } finally {
        setLoading(false)
      }
    } else {
      toast.warning('DEBE ASIGNAR POR LO MENOS UN COLABORADOR')
    }
  }

  const handleClose = (): void => {
    setOpen(false)
    resetForm()
    setCorreos([])
    setarrayPesos([])
    setContenido('')
  }

  const returnIngreso = (id: string): string => {
    if (id == '0') {
      return 'Facebook'
    } else if (id == '1') {
      return 'Google'
    } else if (id == '5') {
      return 'Instagram'
    } else if (id == '2') {
      return 'Ventas'
    } else if (id == '3') {
      return 'Post Venta'
    } else if (id == '4') {
      return 'Whatsapp'
    } else if (id == '6') {
      return 'Recomendación'
    } else if (id == '7') {
      return 'Logos'
    } else {
      return ''
    }
  }

  const {
    handleSubmit,
    setValues,
    resetForm,
    handleChange,
    handleBlur,
    values,
    errors,
    touched
  } = useFormik({
    initialValues: {
      id_contrato: '',
      nombre_cliente: '',
      fecha_inicio: '',
      asunto: ''
    },
    validationSchema: SchemaValidarAlta,
    onSubmit: generarVenta
  })

  const formatearContrato = (cadena: string): string => {
    const partes = cadena.split('_')
    return partes[0]
  }

  let descripcionEntrada = ''
  if (formatearContrato(datos?.id_contrato ?? '') == 'LP69') {
    descripcionEntrada =
            '<p><strong style="background-color: yellow;">DISEÑO DE 01 LOGO:</strong></p><ul><li>Brief o Cuestionario de la empresa. (<strong>BRIEF SISTEMA)</strong></li><li><strong>Hasta (01) de Propuestas de diseño de LOGO</strong></li><li><strong>Análisis el Brief para la construcción del Logotipo.</strong></li><li><strong>Diseño o Rediseño de Logo</strong></li><li><strong>Coordinación directa, con el cliente para el desarrollo del Brief o cuestionario.</strong></li></ul><p>Propuestas:</p><ul><li>Recibirás (01 propuestas) Profesionales</li><li>100 % originales</li><li>1 diseñador dedicado</li><li>Modificaciones (03 cambios en el diseño aprobado). No se otorgarán más cambios según el plan contratado. Entrega del Logotipo (02 días Hábiles.</li><li>Teniendo en cuenta la respuesta inmediata del cliente. Entregables del Logotipo Final: Archivos Editables y sustentación del LOGOTIPO APROBADO: Ilustrador o PSD – PNG – JPG –PDF</li></ul>'
  } else if (formatearContrato(datos?.id_contrato ?? '').includes('LP69')) {
    descripcionEntrada =
            '<p class="ql-align-justify"><strong>DISEÑO DE&nbsp;</strong><strong style="background-color: yellow;">01 LOGO</strong><strong style="color: red;">:&nbsp;</strong><strong>&nbsp;</strong></p><ul><li class="ql-align-justify"><strong>Brief o Cuestionario de la empresa.&nbsp;</strong><span style="background-color: yellow;">(Se realizará un Análisis previo antes de la construcción del Logotipo)</span></li><li class="ql-align-justify"><strong>Hasta&nbsp;</strong><strong style="background-color: yellow;">(01)</strong><strong>&nbsp;de Propuestas de diseño de LOGO&nbsp;</strong></li><li class="ql-align-justify"><strong>Análisis el Brief para la&nbsp;construcción del Logotipo.</strong></li><li class="ql-align-justify"><strong>Diseño o Rediseño de Logo</strong></li></ul><p class="ql-align-justify">•&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Coordinación directa, con el cliente para el desarrollo del Brief o cuestionario.</p><p class="ql-align-justify"><strong style="background-color: yellow;">Propuestas:</strong></p><ul><li class="ql-align-justify">Recibirás (01 propuestas) Profesionales</li><li class="ql-align-justify">100 % originales</li><li class="ql-align-justify">1 diseñador dedicado</li><li class="ql-align-justify">Modificaciones (<strong style="color: red;">03 cambios en el diseño aprobado</strong>).&nbsp;<strong><u>No se otorgarán más cambios según el plan contratado.</u></strong></li></ul><p class="ql-align-justify">Entrega del Logotipo (<strong>02 días</strong>&nbsp;Hábiles. Teniendo en cuenta la respuesta inmediata del cliente.</p><p class="ql-align-justify">Entregables del Logotipo Final: Archivos Editables y&nbsp;<strong>sustentación del LOGOTIPO APROBADO</strong>:&nbsp;<strong>Ilustrador o PSD – PNG – JPG –PDF</strong></p><p class="ql-align-justify"><br></p><p class="ql-align-justify"><strong style="background-color: yellow;">No incluye adaptación de personaje, ni&nbsp;vectorización.</strong></p><p class="ql-align-justify"><br></p><ul><li class="ql-align-justify">Identidad Visual :</li><li class="ql-align-justify">01 diseño de Hoja Membretada - 1 propuesta</li><li class="ql-align-justify">Hasta dos cambios</li></ul>'
  } else if (formatearContrato(datos?.id_contrato ?? '') == 'LPEXC') {
    descripcionEntrada =
            '<p>DISEÑO DE 01 LOGO :</p><ul><li>Brief o Cuestionario de la empresa. (<strong>BRIEF - SISTEMA)&nbsp;&nbsp;</strong></li><li><strong style="background-color: yellow;">Hasta (02) de Propuestas de diseño de LOGO</strong></li><li><strong style="background-color: yellow;">Análisis el Brief para la construcción del Logotipo.</strong></li><li><strong>Diseño de Logo – Plan Excepcional</strong></li><li><strong style="background-color: yellow;">Coordinación directa, con el cliente para el desarrollo del Brief o cuestionario.</strong></li></ul><p>Propuestas:</p><ul><li>Recibirás (02 propuestas) Profesionales</li><li>100 % originales</li><li>1 diseñador dedicado</li><li>Modificaciones (03 cambios en el diseño aprobado).</li><li>No se otorgarán más cambios según el plan contratado. Entrega del Logotipo (02 días Hábiles. Teniendo en cuenta la respuesta inmediata del cliente.</li><li>Entregables del Logotipo Final: Archivos Editables y sustentación del LOGOTIPO APROBADO: Ilustrador o PSD – PNG – JPG –PDF</li></ul><p>&nbsp;</p><p>No incluye adaptación de personaje, ni vectorización</p><p>&nbsp;</p><p>Identidad Visual – 1 propuesta de cada uno</p><ul><li>01 Diseño de tarjeta de presentación</li><li>01 Diseño de Hoja Membretada</li><li>01 Diseño de firma de correo</li><li>01 Diseño de flyer o post</li><li> Hasta 2 cambios</li></ul>'
  } else if (formatearContrato(datos?.id_contrato ?? '').includes('LPEXC')) {
    descripcionEntrada =
              '<p>DISEÑO DE 01 LOGO :</p><ul><li>Brief o Cuestionario de la empresa. (<strong>BRIEF - SISTEMA)&nbsp;&nbsp;</strong></li><li><strong>Hasta (02) de Propuestas de diseño de LOGO</strong></li><li><strong>Análisis el Brief para la construcción del Logotipo.</strong></li><li><strong>Diseño de Logo – Plan Excepcional</strong></li><li><strong>Coordinación directa, con el cliente para el desarrollo del Brief o cuestionario.</strong></li></ul><p><br></p><p>Propuestas:</p><ul><li>Recibirás (02 propuestas) Profesionales</li><li>100 % originales</li><li>1 diseñador dedicado</li><li>Modificaciones (03 cambios en el diseño aprobado).</li><li>No se otorgarán más cambios según el plan contratado. Entrega del Logotipo (02 días Hábiles. Teniendo en cuenta la respuesta inmediata del cliente.</li><li>Entregables del Logotipo Final: Archivos Editables y sustentación del LOGOTIPO APROBADO: Ilustrador o PSD – PNG – JPG –PDF</li></ul><p>&nbsp;</p><p>No incluye adaptación de personaje, ni vectorización</p><p>&nbsp;</p><ul><li>Identidad Visual – 1 propuesta de cada uno</li><li>01 Diseño de Hoja Membretada</li><li>Hasta 2 cambios</li></ul>'
  } else if (formatearContrato(datos?.id_contrato ?? '') == ('LPPG')) {
    descripcionEntrada =
            '<p><strong>DISEÑO DE PIEZAS GRAFICAS (1 propuesta)</strong></p><ul><li><strong>01 banner para impresión de 0.7 x 2.00 mts – 1 propuesta</strong></li><li><strong>Hasta 3 cambios ENTREGABLES :</strong></li><li><strong>EDITABLES - jpg – png – pdf</strong></li></ul><p><strong>&nbsp;</strong></p><p><strong>El cliente nos remite</strong></p><ul><li><strong>Coordinación directa con el diseñador</strong></li><li><strong>Logo en versión editable</strong></li></ul>'
  } else if (formatearContrato(datos?.id_contrato ?? '') == ('LPCME')) {
    descripcionEntrada =
            '<p>PLAN EMPRENDEDOR</p><p>✓ Análisis&nbsp;de Marketing Digital</p><p>✓ 01 PUBLICACIÓN POR SEMANA (LUNES A SABADO)&nbsp;</p><p>&nbsp;&nbsp;Descripción y post&nbsp;</p><p>✓ DISEÑO DE FLYER O POST - Entregable cronograma&nbsp;</p><p>✓ 01 DISEÑO DE PORTADA facebook - wsp bussines x mes&nbsp;</p><p>✓ Asesoría en creación de redes (facebook - Instagram)&nbsp;</p><p>✓ CONTRATO MINIMO X 3 MESES</p>'
  } else if (formatearContrato(datos?.id_contrato ?? '') == ('LPCMC')) {
    descripcionEntrada =
              '<p>&nbsp;PLAN COBRE&nbsp;</p><p>✓ Investigación digital</p><p>✓ Análisis&nbsp;de Marketing Digital - DOCUMENTACIÓN - Linea Gráfica&nbsp;&nbsp;</p><p>✓ 03 PUBLICACIONES POR SEMANA (LUNES A SABADO)&nbsp;</p><p>&nbsp;&nbsp;Descripción y post&nbsp;</p><p>✓ DISEÑO DE FLYER O POST - Entregable cronograma&nbsp;</p><p>✓ 01 DISEÑO DE PERFIL (facebook - Instagram)</p><p>✓ 01 DISEÑO DE PORTADA facebook - wsp bussines&nbsp;</p><p>✓ Asesoría en creación de redes (facebook - Instagram)&nbsp;</p><p>✓ CONTRATO MINIMO X 3 MESES</p>'
  } else if (formatearContrato(datos?.id_contrato ?? '') == ('LPCMS')) {
    descripcionEntrada =
                '<p>PLAN SILVER&nbsp;</p><p>✓ Investigación digital</p><p>✓ Análisis&nbsp;de Marketing Digital - DOCUMENTACIÓN - Linea Gráfica&nbsp;&nbsp;</p><p>✓ 05 PUBLICACIONES POR SEMANA (LUNES A SABADO)</p><p>&nbsp;&nbsp;Descripción y post&nbsp;</p><p>✓ DISEÑO DE FLYER O POST - Entregable cronograma&nbsp;</p><p>✓ RESPUESTAS O COMENTARIOS a Potenciales (clientes o seguidores)&nbsp;</p><p>✓ 01 DISEÑO DE PERFIL (facebook - Instagram - Tiktok)&nbsp;</p><p>✓ 01 DISEÑO DE PORTADA para facebook - wsp bussines&nbsp;</p><p>✓ 01 DESARROLLO DE REEL max 10 segundos (dentro del mes)&nbsp;</p><p>✓ Indexación de fan page al wsp Bussines&nbsp;</p><p>✓ Desarrollo de respuestas automaticas - Fan Page&nbsp;</p><p>✓ Asesoría en creación de redes (facebook - Instagram - Tiktok)&nbsp;</p><p>✓ Reporte de metricas&nbsp;- Quincenal&nbsp;</p><p>✓ CONTRATO MINIMO X 3 MESES</p>'
  } else if (formatearContrato(datos?.id_contrato ?? '') == ('LPCMG')) {
    descripcionEntrada =
                  '<p>PLAN GOLDEN</p><p>✓ Investigación digital</p><p>✓ Análisis&nbsp;de Marketing Digital - DOCUMENTACIÓN&nbsp;- Linea Gráfica&nbsp;</p><p>✓ 08 PUBLICACIÓN POR SEMANA&nbsp;(LUNES A SABADO)&nbsp;</p><p>&nbsp;&nbsp;Descripción y post&nbsp;&nbsp;</p><p>✓ DISEÑO DE FLYER O POST -&nbsp;Incluye (Retoque Fotográfico) - Entregable cronograma&nbsp;</p><p>✓ RESPUESTAS O COMENTARIOS a Potenciales (clientes o seguidores)&nbsp;</p><p>✓ 01 DISEÑO DE PERFIL (facebook - Instagram - Tiktok)&nbsp;</p><p>✓ 01 DISEÑO DE PORTADA para facebook - wsp bussines&nbsp;</p><p>✓ 02 DESARROLLO DE REEL max 20 segundos (dentro del mes)&nbsp;efectos y musicalización&nbsp;</p><p>✓ Indexación de fan page al wsp Bussines&nbsp;</p><p>✓ Desarrollo de respuestas automaticas - Fan Page&nbsp;</p><p>✓ DESARROLLO DE CAMPAÑAS INTERACTIVAS - WEB - REDES&nbsp;</p><p>✓ CAPACITACIÓN DE CAMPAÑA PAGADA - (facebook - Instagram) ADS</p><p>&nbsp;&nbsp;Incluye documentación e interacción con la red social , Listo para pagar</p><p>&nbsp;&nbsp;IMPORTANTE : Inversión de publicidad pagada esta cargo del cliente&nbsp;&nbsp;</p><p>✓ Asesoría en creación de redes (facebook - Instagram - Tiktok)&nbsp;</p><p>✓ Reporte de metricas&nbsp;- Quincenal (metricool)&nbsp;</p><p>✓ CONTRATO MINIMO X 3 MESES</p>'
  } else if (formatearContrato(datos?.id_contrato ?? '') == ('LPBRO6')) {
    descripcionEntrada =
            '<p><strong style="background-color: yellow;">01 Diseño de Brochure:</strong></p><ul><li>Información requerida (imágenes, datos de contacto, fotos propias)</li><li>Envió deL Brochure editable. (Se realizará un Análisis previo antes de la construcción del Brochure)</li><li>Hasta (01) Propuesta de Brochure de&nbsp;<strong>06 CARAS – 03 hojas</strong></li><li><strong>Análisis de la información enviada para la construcción del Brochure.</strong></li><li><strong>Coordinación directa, con el cliente para el desarrollo del Brief o cuestionario.</strong></li></ul><p><br></p><p>Propuestas:</p><ul><li>Recibirás (01 Desarrollo &amp; Diseños de Brochure Digital-impresión) Profesional.&nbsp;<strong>06 CARAS&nbsp;- 3 hojas&nbsp;</strong>&nbsp;</li><li>100 % originales</li><li>1 diseñador dedicado</li><li>Modificaciones (02 cambios en el diseño aprobado). No se otorgarán más cambios según el plan contratado.</li></ul><p><br></p><p>Entrega del Brochure (02 días hábiles) según la respuesta inmediata del cliente</p><p class="ql-align-justify">Entregables de Brochure Final: Archivos Editables: Ilustrador o PSD // JPG imagen</p>'
  } else if (formatearContrato(datos?.id_contrato ?? '') == ('LPBRO4')) {
    descripcionEntrada =
              '<p><strong style="background-color: yellow;">01 Diseño de Brochure:</strong></p><ul><li>Información requerida (imágenes, datos de contacto, fotos propias)</li><li>Envió de brochure editable. (Se realizará un Análisis previo antes de la construcción del Brochure)</li><li>Hasta (01) Propuesta de Brochure de&nbsp;<strong>04 CARAS – 02 hojas</strong></li><li><strong>Análisis de la información enviada para la construcción del Brochure.</strong></li><li><strong>Coordinación directa, con el cliente para el desarrollo del Brief o cuestionario.</strong></li></ul><p><br></p><p>Propuestas:</p><ul><li>Recibirás (01 Desarrollo &amp; Diseños de Brochure Digital-impresión) Profesional.&nbsp;<strong>04 CARAS&nbsp;- 2 hojas&nbsp;</strong>&nbsp;</li><li>100 % originales</li><li>1 diseñador dedicado</li><li>Modificaciones (02 cambios en el diseño aprobado). No se otorgarán más cambios según el plan contratado.</li></ul><p><br></p><p>Entrega del Brochure (02 días hábiles) según la respuesta inmediata del cliente</p><p class="ql-align-justify">Entregables de Brochure Final: Archivos Editables: Ilustrador o PSD // JPG imagen</p>'
  } else if (formatearContrato(datos?.id_contrato ?? '') == ('LPBRO8')) {
    descripcionEntrada =
                '<p><strong style="background-color: yellow;">01 Diseño de Brochure:</strong></p><ul><li>Información requerida (imágenes, datos de contacto, fotos propias)</li><li>Envió de brochure editable. (Se realizará un Análisis previo antes de la construcción del Brochure)</li><li>Hasta (01) Propuesta de Brochure de&nbsp;<strong>08 CARAS – 04 hojas</strong></li><li><strong>Análisis de la información enviada para la construcción del Brochure.</strong></li><li><strong>Coordinación directa, con el cliente para el desarrollo del Brief o cuestionario.</strong></li></ul><p><br></p><p>Propuestas:</p><ul><li>Recibirás (01 Desarrollo &amp; Diseños de Brochure Digital-impresión) Profesional.&nbsp;<strong>08 CARAS&nbsp;- 4 hojas&nbsp;</strong>&nbsp;</li><li>100 % originales</li><li>1 diseñador dedicado</li><li>Modificaciones (02 cambios en el diseño aprobado). No se otorgarán más cambios según el plan contratado.</li></ul><p><br></p><p>Entrega del Brochure (02 días hábiles) según la respuesta inmediata del cliente</p><p class="ql-align-justify">Entregables de Brochure Final: Archivos Editables: Ilustrador o PSD // JPG imagen</p>'
  } else if (formatearContrato(datos?.id_contrato ?? '') == ('LPTV')) {
    descripcionEntrada =
              '<p>DESARROLLO DE TIENDA VIRTUAL :</p><p>&nbsp;</p><ul><li>Hasta 5 internas. Bajo Plantillas Pre determinadas (El cliente escoge una)</li><li>Desarrollamos un Brief A MEDIDA Integración de Carrito de COMPRAS.</li><li>EL COSTO POR LA INTEGRACIÓN DEL SERVICIO DE COMERCIO ELECTRÓNICO, ES ASUMIDO POR EL CLIENTE</li><li>Pasarela de Pago: Mercado Pago:</li><li>Medio de pago: Tarjetas de crédito</li><li class="ql-indent-1">Visa, Mastercard, American express y Diners Club.</li><li class="ql-indent-1">Registro de pagos en el sistema de mercado pago y en el sistema de la tienda virtual.</li><li>Trabajamos nuestra programación y Maquetación desde CERO Programación en PHP</li><li class="ql-indent-1">Framework Base de Datos Myql</li><li>Soporte hasta 100 productos</li><li>Administración Dominio .com GRATIS x un AÑO</li><li>Alojamiento Web 03 GB (Sin Cpanel Independiente) GRATIS x un AÑO</li><li>NO Utilizamos plantillas o CMS Gratuitos de Internet WEB desarrollada desde CERO</li><li>Formularios de Contacto Dinámico.</li><li>MAIL de repuesta al visitante.</li><li>Ubicación de la empresa o negocio a través de Google Maps.</li><li>Seguridad Anti Spam Interacción con Redes Sociales.</li><li>Podrá ADMINISTRAR Hasta 02 Internas.</li><li>Creación de hasta 05 Correos Corporativos (Asesoría en su configuración)</li><li>Entrega de acceso al administrador. Manual de Usuario.</li><li>Capacitación del sistema (vía VIRTUAL). Soporte Técnico.</li><li>Por 03 mes (Solo atendemos incidencias o fallas en nuestro servicio + (01) cambio textuales e imágenes).</li><li>Técnica de Posicionamiento Web (SEO).</li><li>Retoque Fotográfico de Hasta 15</li></ul><p>&nbsp;</p><p><strong>EL CLIENTE NOS REMITE:</strong></p><ul><li>Su logotipo editable (PSD – Ai – CDR).</li><li>Fotos e imágenes en buena resolución.</li><li>Entrega de datos de contacto</li></ul>'
  } else if (formatearContrato(datos?.id_contrato ?? '') == ('LPREEL')) {
    descripcionEntrada =
                '<p><strong>EDICION DE VIDEO</strong></p><ul><li>01 Desarrollo de Reel o Edición de Video de hasta 10 SEGUNDOS Saludo o presentación de su empresa o negocio</li><li>Cliente nos remite Logo en versión editable, Fotos o Videos Cortos, Logos Perú Edita</li><li>Incluye Efectos y Musicalización</li><li>Desarrollo StoryBoard : Presentación al cliente</li><li><strong style="background-color: yellow;">Locución en Off –</strong><strong>&nbsp;no incluye</strong></li><li>Entregable vía DRIVE</li><li>Tiempo de producción (total): 02 días hábiles Propuestas:</li><li class="ql-indent-2">Recibirás un desarrollo y edición de su video</li><li class="ql-indent-2">100 % originales</li><li class="ql-indent-2">1 profesional dedicado</li><li class="ql-indent-2">Resolución 1920x1080, alta calidad.</li><li class="ql-indent-2">Modificaciones (02 cambios) por Video. No se otorgarán más cambios según el plan contratado.</li></ul><p>&nbsp;</p><p>Entrega del Video en Drive (Descargar)</p>'
  } else if (formatearContrato(datos?.id_contrato ?? '') == ('LPFLYER')) {
    descripcionEntrada =
                  '<p><strong>SERVICIO de diseño de piezas graficas</strong></p><p><strong>&nbsp;</strong></p><ul><li><strong>03 Diseños de flyer – 01 propuestas – 1 cara Según requerimientos y ejemplos del cliente</strong></li><li><strong>Hasta dos cambios x cada flyer</strong></li><li><strong>ENTREGABLES : JPG – PDF - AI para impresión</strong></li></ul><p>&nbsp;</p><p>El cliente nos remite :</p><ul><li>Coordinación directa con el diseñador</li><li>Logo en versión editable</li></ul>'
  } else if (formatearContrato(datos?.id_contrato ?? '') == ('LPSEO')) {
    descripcionEntrada =
                    '<p><strong style="color: red;">1.-Propiedad Verificada:</strong></p><p>- Verificación desde Gmail y añadir DNS</p><p>- Verificar Google console search y listo la propiedad es del cliente</p><p>- Realizar solicitud de indexación para que la URL pueda aparecer</p><p>en Google</p><p>Propiedad Verificada</p><p><strong style="color: red;">2.-SEO:</strong></p><p>- Uso de Metadatos para mejorar el posicionamiento del SEO y</p><p>también el rendimiento del SEO con la propiedad del cliente cual</p><p>favorecerá a la carga de la página.</p><p>Cliente remite palabras claves </p><p>Capacitación y documentación&nbsp;</p>'
  } else if (formatearContrato(datos?.id_contrato ?? '') == ('LPADS')) {
    descripcionEntrada =
                      '<p>1.- Servicio de <strong style="background-color: yellow;">Asesoría de Posicionamiento PAGADO en GOOGLE - Adwords</strong></p><ul><li>Capacitación a distancia - Bajo el medio digital que se acuerde</li><li>Análisis de la web a posicionar</li><li>Recomendaciones</li><li>Configuración de la Cuenta</li><li>Capacitación de Uso de Google SEM</li><li>Manuales de Uso</li><li>Tiempo de Capacitación: Max 3 horas</li><li>Estrategias de pago</li><li>Capacitación en la publicidad pagada por el mismo cliente</li><li>Entrega de Manuales y Material – link grabado </li><li>TIEMPO: 01 día hábil</li></ul>'
  } else if (formatearContrato(datos?.id_contrato ?? '') == ('LPWA')) {
    descripcionEntrada =
                        '<p>DESARROLLO &amp; DISEÑO WEB ADMINISTRABLE - PLAN  :</p><p>&nbsp;</p><p>✓ Hasta 6 internas, A la medida del cliente. CLIENTE NOS REMITE SU EJEMPLO</p><p>✓ Desarrollamos un Brief A MEDIDA</p><p>✓ Formularios de Contacto Dinámico. MAIL de repuesta al visitante.</p><p>✓ Ubicación de la empresa o negocio a través de Google Maps.</p><p>✓ Programación en PHP - Framework Codeigter</p><p>✓ Base de Datos Myql</p><p>✓ HTML 5 , Booystrap, CSS3, jQUERY</p><p>✓ No usamos plantillas - No trabajamos con CMS</p><p>✓ Seguridad Anti Spam</p><p>✓ Administración Dominio .com <strong style="background-color: yellow;">GRATIS x un AÑO</strong></p><p>✓ Alojamiento Web ilimitado (Cpanel Independiente) <strong style="background-color: yellow;">GRATIS x un AÑO</strong></p><p>✓ Interacción con Redes Sociales. Facebook - Whastapp - INSTAGRAM</p><p>✓ Podrá ADMINISTRAR Hasta 03 Internas. NOTICIAS - PRODUCTOS – SERVICIOS</p><p>✓ Entrega de acceso al administrador.</p><p>✓ Manual de Usuario.</p><p>✓ Capacitación del sistema (En nuestra Agencia o VIRTUAL).</p><p>✓ Soporte Técnico. Por 03 mes (Solo atendemos incidencias o fallas en nuestro servicio + (01) cambio textuales e imágenes).</p><p>✓ Retoque Fotográfico de Hasta 15</p><p>&nbsp;</p><p>• EL CLIENTE NOS REMITE :</p><p>• Su logotipo editable (PSD – Ai – CDR).</p><p>• Fotos e imágenes en buena resolución.</p><p>• Entrega de datos de contacto</p>'
  } else if (formatearContrato(datos?.id_contrato ?? '') == ('LPW')) {
    descripcionEntrada =
                          '<p>01 DISEÑO WEB INFORMATIVA: </p><ul><li>Hasta 4 internas, bajo nuestras propuestas INGRESAR (Plantillas Express) el cliente elegirá una </li><li>Desarrollamos un Brief </li><li>Formularios de Contacto Dinámico. MAIL de repuesta al visitante. </li><li>Ubicación de la empresa o negocio a través de Google Maps. </li><li>NO Utilizamos plantillas o CMS Gratuitos de Internet </li><li>WEB desarrollada desde CERO </li><li>Seguridad Anti Spam </li><li>Interacción con Redes Sociales. (WhatsApp – Facebook – YouTube) </li><li>Administración Dominio .com <strong style="background-color: yellow;">GRATIS x un AÑO</strong></li><li>Alojamiento Web 1 GB (Sin Cpanel Independiente) <strong>GRATIS x un AÑO</strong></li><li>Soporte Técnico. Por 01 mes (Solo atendemos incidencias o fallas en nuestro servicio). </li></ul><p>&nbsp;</p><p>EL CLIENTE NOS REMITE: </p><p>&nbsp;</p><ul><li>Entrega de textos e imágenes para la página web </li><li>Logotipo en versión editable </li><li>Fotos e imágenes en buena resolución. </li><li>Datos de contacto</li></ul>'
  } else if (formatearContrato(datos?.id_contrato ?? '') == ('LPMAPS')) {
    descripcionEntrada = '<p><strong style="color: red;">1.-Propiedad Verificada:</strong></p><p>- Verificación desde Gmail y añadir DNS</p><p>- Verificar Google console search y listo la propiedad es del cliente</p><p>- Realizar solicitud de indexación para que la URL pueda aparecer</p><p>en Google</p><p><br></p><p><strong style="color: red;">2. Ubicación del negocio en google maps</strong></p><p><strong style="color: red;">&nbsp;</strong></p><p><strong style="color: red;">CLIENTE NOS RENITE : SUS ACCESOS A SU CUENTA GMAIL&nbsp;</strong></p>'
  }

  useEffect(() => {
    if (open) {
      setValues({
        ...values,
        id_contrato: datos?.id_contrato ?? '',
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        nombre_cliente: `${datos?.nombres} ${datos?.apellidos}`,
        fecha_inicio: generarFecha()
      })
      const nombresColaboradores = arrayPesos
        .filter((item: any) => item.nombre) // Filtrar los elementos que tienen un nombre definido
        .map((item: any) => `${item.genero === 'mujer' ? 'Srta.' : ''} ${item.nombre}`)
        .join(' – ')
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands, @typescript-eslint/restrict-template-expressions
      const textoadcional = `<p>Estimados Colaboradores </p><p>&nbsp;</p><p>Le damos la Bienvenida al cliente :&nbsp;<span style="background-color: rgb(249, 250, 251);"> ${datos?.nombre_empresa ?? ''}</span></p><p>&nbsp;</p><ul><li>Persona de contacto : Sr. ${datos?.nombres} ${datos?.apellidos} </li><li>Mail&nbsp;: ${datos?.email ?? ''} </li><li>Móvil&nbsp;: ${datos?.celular ?? ''} </li></ul></p><p>&nbsp;</p>`
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const textofinal = `<p>&nbsp;</p><p>${datos?.id_contrato ?? ''}/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;M1 – ${returnIngreso(datos?.medio_ingreso ?? '')} </p><p>&nbsp;</p><p>COLABORADORES A CARGO: ${nombresColaboradores}</p><p>&nbsp;</p><p>FECHA DE INICIO DEL SERVICIO:&nbsp;${values.fecha_inicio ?? ''}</p><p>&nbsp;</p><p>&nbsp;</p><p>SALUDOS&nbsp;</p>`
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      const contenidoConTextoAdicional = textoadcional + (descripcionEntrada ?? '') + textofinal
      setContenido(contenidoConTextoAdicional)
      const correoPredeterminado = datos?.email
      if (!correos.some((c: any) => c.correo === correoPredeterminado)) {
        // @ts-expect-error
        setCorreos([...correos, { id: uuidv4(), correo: correoPredeterminado }])
      }
    }
  }, [datos, open])

  useEffect(() => {
    if (open) {
      const nombresColaboradores = arrayPesos
        .filter((item: any) => item.nombre) // Filtrar los elementos que tienen un nombre definido
        .map((item: any) => `${item.genero === 'mujer' ? 'Srta.' : ''} ${item.nombre}`)
        .join(' – ')
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands, @typescript-eslint/restrict-template-expressions
      const textoadcional = `<p>Estimados Colaboradores </p><p>&nbsp;</p><p>Le damos la Bienvenida al cliente :&nbsp;<span style="background-color: rgb(249, 250, 251);"> ${datos?.nombre_empresa}</span></p><p>&nbsp;</p><ul><li>Persona de contacto : Sr. ${datos?.nombres} ${datos?.apellidos} </li><li>Mail&nbsp;: ${datos?.email ?? ''} </li><li>Móvil&nbsp;: ${datos?.celular ?? ''} </li></ul></p><p>&nbsp;</p>`
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const textofinal = `<p>&nbsp;</p><p>${datos?.id_contrato ?? ''}/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;M1 – ${returnIngreso(datos?.medio_ingreso ?? '')} </p><p>&nbsp;</p><p>COLABORADORES A CARGO: ${nombresColaboradores}</p><p>&nbsp;</p><p>FECHA DE INICIO DEL SERVICIO:&nbsp;${values.fecha_inicio ?? ''}</p><p>&nbsp;</p><p>&nbsp;</p><p>SALUDOS.&nbsp;</p>`
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      const contenidoConTextoAdicional = textoadcional + (descripcionEntrada ?? '') + textofinal
      setContenido(contenidoConTextoAdicional)
    }
  }, [values.fecha_inicio, arrayPesos])

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        maxWidth={'md'}
        aria-describedby="alert-dialog-slide-description"
        className="w-screen p-0 m-0 modal_dialog_correlativo"
      >
        <section
          className={'grid grid-cols-1 gap-10'}
        >
          <form
            className="flex flex-col bg-white rounded-md relative p-4     "
            onSubmit={handleSubmit}
          >
            <div className="flex w-full flex-col">
              <div className="w-full flex flex-col text-white">
                <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-end gap-2 lg:gap-x-5 lg:gap-y-0">
                  <div className="w-full flex flex-col lg:flex-row gap-3 lg:gap-5 mt-3 lg:mt-0">
                    <div className="w-full lg:relative pb-5">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                      >
                        Contrato
                      </label>
                      <input
                        className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                        value={values?.id_contrato}
                        disabled
                      />
                    </div>
                    <div className="w-full lg:relative pb-5">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                      >
                        Cliente
                      </label>
                      <input
                        className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                        value={values?.nombre_cliente}
                        disabled
                      />
                    </div>
                    <div className="w-full lg:relative pb-5">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                      >
                        Fecha de inicio
                      </label>
                      <input
                        className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                        name='fecha_inicio'
                        value={values.fecha_inicio}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={false}
                      />
                       <Errors
                        errors={errors.fecha_inicio}
                        touched={touched.fecha_inicio}
                    />
                    </div>
                  </div>
                  <div className="w-full flex flex-col lg:flex-row gap-3 lg:gap-5 mt-3 lg:mt-0">
                    <div className="w-full lg:relative pb-5">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                      >
                        Asunto de mail
                      </label>
                      <input
                        className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                        name='asunto'
                        value={values.asunto}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={false}
                      />
                       <Errors
                        errors={errors.asunto}
                        touched={touched.asunto}
                    />
                    </div>
                  </div>
                  <ListaUsuarios
                      arrayPesos={arrayPesos}
                      usuarios={usuarios}
                      setarrayPesos={setarrayPesos}
                      setCorreos={setCorreos}
                      correos={correos}
                    />
                  <div className="w-full relative">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="email"
                    >
                      Detalle del servicio
                    </label>
                    <div className="mt-3">
                      <EditorPdfAltas
                        content={contenido}
                        setContent={setContenido}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="h-fit flex w-full justify-end items-center gap-3 rounded-md text-black ">
              <div className="flex w-fit gap-3 rounded-md text-black ">
                {!loading
                  ? (
                  <input
                    type="submit"
                    className="bg-secondary-150 hover:bg-secondary-150/70 transition-colors px-3 py-2 text-white rounded-md cursor-pointer"
                    value="Generar alta"
                  />
                    )
                  : (
                  <input
                    type="button"
                    disabled
                    className="bg-secondary-150/70 px-3 py-2 text-white rounded-md cursor-pointer"
                    value="Cargando..."
                  />
                    )}
              </div>
            </div>
          </form>
        </section>
      </Dialog>
    </>
  )
}
