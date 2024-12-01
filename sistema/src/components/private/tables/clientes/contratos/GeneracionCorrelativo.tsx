/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable multiline-ternary */
import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState
} from 'react'
import { Link } from 'react-router-dom'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { type TransitionProps } from '@mui/material/transitions'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import {
  type ValuesPlanes,
  type arrayContacto
} from '../../../../shared/schemas/Interfaces'
import { useFormik } from 'formik'
import { SchemaValidarVentas } from '../../../../shared/schemas/Schemas'
import { LoadingSmall } from '../../../../shared/LoadingSmall'
import { TitleBriefs } from '../../../../shared/TitleBriefs'
import { Errors } from '../../../../shared/Errors'
import { ModalContratos } from './ModalContratos'
import { Loading } from '../../../../shared/Loading'
import { toast } from 'sonner'
import { cn } from '../../../../shared/cn'
import { quitarAcentos } from '../../../../shared/functions/QuitarAcerntos'
import { RiFilter2Fill } from 'react-icons/ri'

const Transition = React.forwardRef(function Transition (
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

interface valuesVentasTO {
  id: number
  nombres: string
  apellidos: string
  medio_ingreso: string
  nombre_empresa: string
  empresa: string
  plan: string
  id_contrato: string
  dni_ruc: string
  id_cliente: string
  nombre_cliente: string
  arraycontacto: string
}

interface valuesInterface {
  open: boolean
  datos: valuesVentasTO
  planes: ValuesPlanes[]
  setOpen: Dispatch<SetStateAction<boolean>>
}

export const GeneracionCorrelativo = ({
  open,
  datos,
  planes,
  setOpen
}: valuesInterface): JSX.Element => {
  const token = localStorage.getItem('token')
  const [loadingValidacion, seLoadingValidation] = useState(false)
  const [abrirPlan, setAbrirPlan] = useState(false)
  const [arrayContacto, setarrayConacto] = useState<arrayContacto[]>([])
  const [loading, setLoading] = useState(false)
  const [personContact, setpersonContact] = useState<string | null>(null)
  const [, setDuplicateCode] = useState<boolean>(false)
  const limpiar = (): void => {
    resetForm()
  }
  const [pdfUrl, setPdfUrl] = useState<any | null>(null)

  const generarVenta = async (): Promise<void> => {}

  const handleClose = (): void => {
    setOpen(false)
    setPdfUrl(null)
    resetForm()
    setAbrirPlan(false)
  }
  const formatearContrato = (cadena: string): string => {
    const partes = cadena.split('_')
    return partes[0]
  }

  const generarCodigo = async (plan: string): Promise<void> => {
    seLoadingValidation(true)
    setDuplicateCode(false)
    try {
      const data = new FormData()
      data.append('plan', plan)
      const request = await axios.post(
        `${Global.url}/generarCodigoToContrato`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      if (request.data.status == 'success') {
        let descripcionEntrada = ''
        let descripcionPago = ''
        if (
          formatearContrato(request.data.codigo) == 'LPDOMINIO' ||
          formatearContrato(request.data.codigo) == 'LPHOST400MB' ||
          formatearContrato(request.data.codigo) == 'LPHOST1000MB' ||
          formatearContrato(request.data.codigo) == 'LPHOST3000MB' ||
          formatearContrato(request.data.codigo) == 'LPHOST10000MB' ||
          formatearContrato(request.data.codigo) == 'LPHOST10000MBCP' ||
          formatearContrato(request.data.codigo) == 'LPHOSTILIM' ||
          formatearContrato(request.data.codigo) == 'LPHOSTILIMCP'
        ) {
          descripcionPago =
            '<ul><li><strong style="color: red;">S/ 00.00&nbsp;</strong><strong>+&nbsp;IGV&nbsp;</strong>A la aceptación del presente contrato</li><li><strong>S/ 00.00 </strong>&nbsp;<strong>+&nbsp;IGV</strong>&nbsp;A la los 2 días del proyecto&nbsp;</li></ul>'
        } else if (
          formatearContrato(request.data.codigo) == 'LPMGDOM' ||
          formatearContrato(request.data.codigo) == 'LPSID'
        ) {
          descripcionPago =
            '<ul><li><strong style="color: red;">S/ 00.00&nbsp;</strong><strong>+&nbsp;IGV&nbsp;</strong>A la aceptación del presente contrato</li></ul>'
        } else if (
          formatearContrato(request.data.codigo) == 'LPACTW' ||
          formatearContrato(request.data.codigo) == 'LPACTWE' ||
          formatearContrato(request.data.codigo) == 'LPCPPB' ||
          formatearContrato(request.data.codigo) == 'LPCPPM' ||
          formatearContrato(request.data.codigo) == 'LPIPP'
        ) {
          descripcionPago =
            '<ul><li><strong style="color: red;">S/ 00.00&nbsp;</strong><strong>+&nbsp;IGV&nbsp;</strong>A la aceptación del presente contrato</li><li><strong>S/ 00.00&nbsp;+ IGV a la aprobación del proyecto&nbsp;</strong></li></ul>'
        } else {
          descripcionPago =
            '<ul><li><strong style="color: red;">S/ 00.00&nbsp;</strong><strong>+&nbsp;IGV</strong><strong>&nbsp;</strong>A la aceptación del presente contrato</li><li><strong>S/ 00.00 </strong>&nbsp;<strong>+&nbsp;IGV</strong>&nbsp;A la los 10 días del proyecto&nbsp;</li><li><strong>S/ 00.00&nbsp;+ IGV a la aprobación del proyecto&nbsp;</strong></li></ul>'
        }
        if (formatearContrato(request.data.codigo) == 'LP69') {
          descripcionEntrada =
            '<p><strong style="background-color: yellow;">DISEÑO DE 01 LOGO:</strong></p><ul><li>Brief o Cuestionario de la empresa. (<strong>BRIEF SISTEMA)</strong></li><li><strong>Hasta (01) de Propuestas de diseño de LOGO</strong></li><li><strong>Análisis el Brief para la construcción del Logotipo.</strong></li><li><strong>Diseño o Rediseño de Logo</strong></li><li><strong>Coordinación directa, con el cliente para el desarrollo del Brief o cuestionario.</strong></li></ul><p>Propuestas:</p><ul><li>Recibirás (01 propuestas) Profesionales</li><li>100 % originales</li><li>1 diseñador dedicado</li><li>Modificaciones (03 cambios en el diseño aprobado). No se otorgarán más cambios según el plan contratado. Entrega del Logotipo (02 días Hábiles.</li></ul> </ul><p><br></p><p>Teniendo en cuenta la respuesta inmediata del cliente. Entregables del Logotipo Final: Archivos Editables y sustentación del LOGOTIPO APROBADO: <strong>Ilustrador o PSD – PNG – JPG –PDF</strong></p><p><br></p><p class="ql-align-center"><strong style="background-color: yellow;">No incluye adaptación de personaje, ni&nbsp;vectorización.</strong></p>'
        } else if (formatearContrato(request.data.codigo).includes('LP69')) {
          descripcionEntrada =
            '<p class="ql-align-justify"><strong>DISEÑO DE&nbsp;</strong><strong style="background-color: yellow;">01 LOGO</strong><strong style="color: red;">:&nbsp;</strong><strong>&nbsp;</strong></p><ul><li class="ql-align-justify"><strong>Brief o Cuestionario de la empresa.&nbsp;</strong><span style="background-color: yellow;">(Se realizará un Análisis previo antes de la construcción del Logotipo)</span></li><li class="ql-align-justify"><strong>Hasta&nbsp;</strong><strong style="background-color: yellow;">(01)</strong><strong>&nbsp;de Propuestas de diseño de LOGO&nbsp;</strong></li><li class="ql-align-justify"><strong>Análisis el Brief para la&nbsp;construcción del Logotipo.</strong></li><li class="ql-align-justify"><strong>Diseño o Rediseño de Logo</strong></li></ul><p class="ql-align-justify">•&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Coordinación directa, con el cliente para el desarrollo del Brief o cuestionario.</p><p class="ql-align-justify"><strong style="background-color: yellow;">Propuestas:</strong></p><ul><li class="ql-align-justify">Recibirás (01 propuestas) Profesionales</li><li class="ql-align-justify">100 % originales</li><li class="ql-align-justify">1 diseñador dedicado</li><li class="ql-align-justify">Modificaciones (<strong style="color: red;">03 cambios en el diseño aprobado</strong>).&nbsp;<strong><u>No se otorgarán más cambios según el plan contratado.</u></strong></li></ul><p class="ql-align-justify">Entrega del Logotipo (<strong>02 días</strong>&nbsp;Hábiles. Teniendo en cuenta la respuesta inmediata del cliente.</p><p class="ql-align-justify">Entregables del Logotipo Final: Archivos Editables y&nbsp;<strong>sustentación del LOGOTIPO APROBADO</strong>:&nbsp;<strong>Ilustrador o PSD – PNG – JPG –PDF</strong></p><p class="ql-align-justify"><br></p><p class="ql-align-justify"><strong style="background-color: yellow;">No incluye adaptación de personaje, ni&nbsp;vectorización.</strong></p><p class="ql-align-justify"><br></p><ul><li class="ql-align-justify">Identidad Visual :</li><li class="ql-align-justify">01 diseño de Hoja Membretada - 1 propuesta</li><li class="ql-align-justify">Hasta dos cambios</li></ul>'
        } else if (formatearContrato(request.data.codigo) == 'LPEXC') {
          descripcionEntrada =
            '<p>DISEÑO DE 01 LOGO :</p><ul><li>Brief o Cuestionario de la empresa. (<strong>BRIEF - SISTEMA)&nbsp;&nbsp;</strong></li><li><strong style="background-color: yellow;">Hasta (02) de Propuestas de diseño de LOGO</strong></li><li><strong style="background-color: yellow;">Análisis el Brief para la construcción del Logotipo.</strong></li><li><strong>Diseño de Logo – Plan Excepcional</strong></li><li><strong style="background-color: yellow;">Coordinación directa, con el cliente para el desarrollo del Brief o cuestionario.</strong></li></ul><p>Propuestas:</p><ul><li>Recibirás (02 propuestas) Profesionales</li><li>100 % originales</li><li>1 diseñador dedicado</li><li>Modificaciones (03 cambios en el diseño aprobado).</li><li>No se otorgarán más cambios según el plan contratado. Entrega del Logotipo (02 días Hábiles. Teniendo en cuenta la respuesta inmediata del cliente.</li><li>Entregables del Logotipo Final: Archivos Editables y sustentación del LOGOTIPO APROBADO: Ilustrador o PSD – PNG – JPG –PDF</li></ul><p>&nbsp;</p><p>No incluye adaptación de personaje, ni vectorización</p><p>&nbsp;</p><p>Identidad Visual – 1 propuesta de cada uno</p><ul><li>01 Diseño de tarjeta de presentación</li><li>01 Diseño de Hoja Membretada</li><li>01 Diseño de firma de correo</li><li>01 Diseño de flyer o post</li><li> Hasta 2 cambios</li></ul>'
        } else if (formatearContrato(request.data.codigo).includes('LPEXC')) {
          descripcionEntrada =
            '<p>DISEÑO DE 01 LOGO :</p><ul><li>Brief o Cuestionario de la empresa. (<strong>BRIEF - SISTEMA)&nbsp;&nbsp;</strong></li><li><strong>Hasta (02) de Propuestas de diseño de LOGO</strong></li><li><strong>Análisis el Brief para la construcción del Logotipo.</strong></li><li><strong>Diseño de Logo – Plan Excepcional</strong></li><li><strong>Coordinación directa, con el cliente para el desarrollo del Brief o cuestionario.</strong></li></ul><p><br></p><p>Propuestas:</p><ul><li>Recibirás (02 propuestas) Profesionales</li><li>100 % originales</li><li>1 diseñador dedicado</li><li>Modificaciones (03 cambios en el diseño aprobado).</li><li>No se otorgarán más cambios según el plan contratado. Entrega del Logotipo (02 días Hábiles. Teniendo en cuenta la respuesta inmediata del cliente.</li><li>Entregables del Logotipo Final: Archivos Editables y sustentación del LOGOTIPO APROBADO: Ilustrador o PSD – PNG – JPG –PDF</li></ul><p>&nbsp;</p><p>No incluye adaptación de personaje, ni vectorización</p><p>&nbsp;</p><ul><li>Identidad Visual – 1 propuesta de cada uno</li><li>01 Diseño de Hoja Membretada</li><li>Hasta 2 cambios</li></ul>'
        } else if (formatearContrato(request.data.codigo) == 'LPPG') {
          descripcionEntrada =
            '<p><strong>DISEÑO DE PIEZAS GRAFICAS (1 propuesta)</strong></p><ul><li><strong>01 banner para impresión de 0.7 x 2.00 mts – 1 propuesta</strong></li><li><strong>Hasta 3 cambios ENTREGABLES :</strong></li><li><strong>EDITABLES - jpg – png – pdf</strong></li></ul><p><strong>&nbsp;</strong></p><p><strong>El cliente nos remite</strong></p><ul><li><strong>Coordinación directa con el diseñador</strong></li><li><strong>Logo en versión editable</strong></li></ul>'
        } else if (formatearContrato(request.data.codigo) == 'LPCME') {
          descripcionEntrada =
            '<p><strong>PLAN EMPRENDEDOR</strong></p><p><br></p><p>✓ Análisis&nbsp;de Marketing Digital</p><p>✓ 01 PUBLICACIONES POR SEMANA (LUNES A SABADO)&nbsp;</p><ul><li>&nbsp;&nbsp;Dividido :&nbsp;01 DISEÑO DE FLYER O POST / 02 DESARROLLO DE REEL Max 10 segundos (EFECTOS Y MUSICALIZACIÓN - SIN LOCUCIÓN EN OFF) - Entregable Cronograma&nbsp;</li></ul><p>✓ 01 DISEÑO DE PORTADA y Perfil Facebook - WSP Bussines x MES</p><p>✓ Asesoría en creación de redes (Facebook - Instagram - TIKTOK)&nbsp;</p><p>✓ CONTRATO MINIMO X 90 días&nbsp;</p><p>&nbsp;</p>'
        } else if (formatearContrato(request.data.codigo) == 'LPCMC') {
          descripcionEntrada =
            '<p><strong>&nbsp;PLAN COBRE&nbsp;</strong></p><p><br></p><p>✓ Investigación digital</p><p>✓ Análisis&nbsp;de Marketing Digital - DOCUMENTACIÓN - Linea Gráfica&nbsp;</p><p>✓ 04 PUBLICACIONES POR SEMANA (LUNES A SABADO)&nbsp;</p><p>&nbsp;&nbsp;Dividido :&nbsp;</p><p>✓ 02 DISEÑO DE FLYER O POST&nbsp;&nbsp;</p><p>✓ 02 DESARROLLO DE REEL Max 10 segundos x MES (EFECTOS Y MUSICALIZACIÓN - SIN LOCUCIÓN EN OFF) - Entregable Cronograma&nbsp;</p><p>✓ 01 DISEÑO DE PERFIL (facebook - Instagram)</p><p>✓ 01 DISEÑO DE PORTADA facebook - wsp bussines&nbsp;X MES&nbsp;</p><p>✓ Asesoría en creación de redes (facebook - Instagram - TIKTOK)&nbsp;</p><p>✓ CONTRATO MINIMO X 90 días</p>'
        } else if (formatearContrato(request.data.codigo) == 'LPCMS') {
          descripcionEntrada =
            '<p><strong>PLAN SILVER&nbsp;</strong></p><p><br></p><p>✓ Investigación digital</p><p>✓ Análisis&nbsp;de Marketing Digital - DOCUMENTACIÓN - Linea Gráfica&nbsp;&nbsp;</p><p>✓ 06 PUBLICACIONES POR SEMANA (LUNES A SABADO)</p><ul><li>&nbsp;&nbsp;&nbsp;Dividido :&nbsp;03 DISEÑO DE FLYER O POST / 03 DESARROLLO DE REEL Max 10 segundos&nbsp;(EFECTOS Y MUSICALIZACIÓN - EFECTOS Y MUSICALIZACIÓN - SIN LOCUCIÓN EN OFF)&nbsp;&nbsp;- Entregable Cronograma&nbsp;&nbsp;</li></ul><p>✓ RESPUESTAS O COMENTARIOS a Potenciales (clientes o seguidores) MSN&nbsp;META BUSSINESS</p><p>✓ 01 DISEÑO DE PERFIL (Facebook - Instagram - Tiktok)&nbsp;</p><p>✓ 01 DISEÑO DE PORTADA para Facebook - WSP Bussines X MES&nbsp;</p><p>✓ Indexación de fan page al WSP Bussines&nbsp;</p><p>✓ Desarrollo de respuestas automáticas - Fan Page&nbsp;</p><p>✓ Asesoría en creación de redes (Facebook - Instagram - Tiktok)&nbsp;</p><p>✓ Reporte de métricas&nbsp;- Quincenal&nbsp;</p><p>✓ CONTRATO MINIMO X 90 días&nbsp;</p>'
        } else if (formatearContrato(request.data.codigo) == 'LPCMG') {
          descripcionEntrada =
            '<p><strong>PLAN GOLDEN</strong></p><p><br></p><p>✓ Investigación digital</p><p>✓ Análisis&nbsp;de Marketing Digital - DOCUMENTACIÓN&nbsp;- Linea Gráfica&nbsp;</p><p>✓ 09 PUBLICACIONES POR SEMANA&nbsp;(LUNES A SABADO)&nbsp;</p><ul><li>&nbsp;&nbsp;Dividido :&nbsp;05 DISEÑO DE FLYER O POST / 04 DESARROLLO DE REEL Max 10 segundos&nbsp;(EFECTOS Y MUSICALIZACIÓN - EFECTOS Y MUSICALIZACIÓN - SIN LOCUCIÓN EN OFF)&nbsp;&nbsp;- Entregable Cronograma&nbsp;&nbsp;</li></ul><p>✓ DISEÑO DE FLYER O POST -&nbsp;Incluye (Retoque Fotográfico) - Entregable cronograma&nbsp;</p><p>✓ RESPUESTAS O COMENTARIOS a Potenciales (clientes o seguidores) MSN&nbsp;META BUSSINESS</p><p>✓ 01 DISEÑO DE PERFIL (facebook - Instagram - Tiktok)&nbsp;</p><p>✓ 01 DISEÑO DE PORTADA para facebook - wsp bussines X MES&nbsp;</p><p>✓ Indexación de fan page al wsp Bussines&nbsp;</p><p>✓ Desarrollo de respuestas automáticas - Fan Page&nbsp;</p><p>✓ DESARROLLO DE CAMPAÑAS INTERACTIVAS - WEB - REDES&nbsp;</p><p>✓ CAPACITACIÓN DE CAMPAÑA PAGADA - (facebook - Instagram) ADS</p><ul><li>&nbsp;&nbsp;Incluye documentación e interacción con la red social , Listo para pagar</li><li>&nbsp;&nbsp;IMPORTANTE : Inversión de publicidad pagada esta cargo del cliente&nbsp;&nbsp;</li></ul><p>✓ Asesoría en creación de redes (Facebook - Instagram - Tiktok)&nbsp;</p><p>✓ Reporte de métricas&nbsp;- Quincenal&nbsp;&nbsp;</p><p>✓ CONTRATO MINIMO X 90 días</p>'
        } else if (formatearContrato(request.data.codigo) == 'LPBRO6') {
          descripcionEntrada =
            '<p><strong style="background-color: yellow;">01 Diseño de Brochure:</strong></p><ul><li>Información requerida (imágenes, datos de contacto, fotos propias)</li><li>Envió deL Brochure editable. (Se realizará un Análisis previo antes de la construcción del Brochure)</li><li>Hasta (01) Propuesta de Brochure de&nbsp;<strong>06 CARAS – 03 hojas</strong></li><li><strong>Análisis de la información enviada para la construcción del Brochure.</strong></li><li><strong>Coordinación directa, con el cliente para el desarrollo del Brief o cuestionario.</strong></li></ul><p><br></p><p>Propuestas:</p><ul><li>Recibirás (01 Desarrollo &amp; Diseños de Brochure Digital-impresión) Profesional.&nbsp;<strong>06 CARAS&nbsp;- 3 hojas&nbsp;</strong>&nbsp;</li><li>100 % originales</li><li>1 diseñador dedicado</li><li>Modificaciones (02 cambios en el diseño aprobado). No se otorgarán más cambios según el plan contratado.</li></ul><p><br></p><p>Entrega del Brochure (02 días hábiles) según la respuesta inmediata del cliente</p><p class="ql-align-justify">Entregables de Brochure Final: Archivos Editables: Ilustrador o PSD // JPG imagen</p>'
        } else if (formatearContrato(request.data.codigo) == 'LPBRO4') {
          descripcionEntrada =
            '<p><strong style="background-color: yellow;">01 Diseño de Brochure:</strong></p><ul><li>Información requerida (imágenes, datos de contacto, fotos propias)</li><li>Envió de brochure editable. (Se realizará un Análisis previo antes de la construcción del Brochure)</li><li>Hasta (01) Propuesta de Brochure de&nbsp;<strong>04 CARAS – 02 hojas</strong></li><li><strong>Análisis de la información enviada para la construcción del Brochure.</strong></li><li><strong>Coordinación directa, con el cliente para el desarrollo del Brief o cuestionario.</strong></li></ul><p><br></p><p>Propuestas:</p><ul><li>Recibirás (01 Desarrollo &amp; Diseños de Brochure Digital-impresión) Profesional.&nbsp;<strong>04 CARAS&nbsp;- 2 hojas&nbsp;</strong>&nbsp;</li><li>100 % originales</li><li>1 diseñador dedicado</li><li>Modificaciones (02 cambios en el diseño aprobado). No se otorgarán más cambios según el plan contratado.</li></ul><p><br></p><p>Entrega del Brochure (02 días hábiles) según la respuesta inmediata del cliente</p><p class="ql-align-justify">Entregables de Brochure Final: Archivos Editables: Ilustrador o PSD // JPG imagen</p>'
        } else if (formatearContrato(request.data.codigo) == 'LPBRO8') {
          descripcionEntrada =
            '<p><strong style="background-color: yellow;">01 Diseño de Brochure:</strong></p><ul><li>Información requerida (imágenes, datos de contacto, fotos propias)</li><li>Envió de brochure editable. (Se realizará un Análisis previo antes de la construcción del Brochure)</li><li>Hasta (01) Propuesta de Brochure de&nbsp;<strong>08 CARAS – 04 hojas</strong></li><li><strong>Análisis de la información enviada para la construcción del Brochure.</strong></li><li><strong>Coordinación directa, con el cliente para el desarrollo del Brief o cuestionario.</strong></li></ul><p><br></p><p>Propuestas:</p><ul><li>Recibirás (01 Desarrollo &amp; Diseños de Brochure Digital-impresión) Profesional.&nbsp;<strong>08 CARAS&nbsp;- 4 hojas&nbsp;</strong>&nbsp;</li><li>100 % originales</li><li>1 diseñador dedicado</li><li>Modificaciones (02 cambios en el diseño aprobado). No se otorgarán más cambios según el plan contratado.</li></ul><p><br></p><p>Entrega del Brochure (02 días hábiles) según la respuesta inmediata del cliente</p><p class="ql-align-justify">Entregables de Brochure Final: Archivos Editables: Ilustrador o PSD // JPG imagen</p>'
        } else if (formatearContrato(request.data.codigo) == 'LPTV') {
          descripcionEntrada =
            '<p>DESARROLLO DE TIENDA VIRTUAL :</p><p>&nbsp;</p><ul><li>Hasta 5 internas. Bajo Plantillas Pre determinadas (El cliente escoge una)</li><li>Desarrollamos un Brief A MEDIDA Integración de Carrito de COMPRAS.</li><li>EL COSTO POR LA INTEGRACIÓN DEL SERVICIO DE COMERCIO ELECTRÓNICO, ES ASUMIDO POR EL CLIENTE</li><li>Pasarela de Pago: Mercado Pago:</li><li>Medio de pago: Tarjetas de crédito</li><li class="ql-indent-1">Visa, Mastercard, American express y Diners Club.</li><li class="ql-indent-1">Registro de pagos en el sistema de mercado pago y en el sistema de la tienda virtual.</li><li>Trabajamos nuestra programación y Maquetación desde CERO Programación en PHP</li><li class="ql-indent-1">Framework Base de Datos Myql</li><li>Soporte hasta 100 productos</li><li>Administración Dominio .com GRATIS x un AÑO</li><li>Alojamiento Web 03 GB (Sin Cpanel Independiente) GRATIS x un AÑO</li><li>NO Utilizamos plantillas o CMS Gratuitos de Internet WEB desarrollada desde CERO</li><li>Formularios de Contacto Dinámico.</li><li>MAIL de repuesta al visitante.</li><li>Ubicación de la empresa o negocio a través de Google Maps.</li><li>Seguridad Anti Spam Interacción con Redes Sociales.</li><li>Podrá ADMINISTRAR Hasta 02 Internas.</li><li>Creación de hasta 05 Correos Corporativos (Asesoría en su configuración)</li><li>Entrega de acceso al administrador. Manual de Usuario.</li><li>Capacitación del sistema (vía VIRTUAL). Soporte Técnico.</li><li>Por 03 mes (Solo atendemos incidencias o fallas en nuestro servicio + (01) cambio textuales e imágenes).</li><li>Técnica de Posicionamiento Web (SEO).</li><li>Retoque Fotográfico de Hasta 15</li></ul><p>&nbsp;</p><p><strong>EL CLIENTE NOS REMITE:</strong></p><ul><li>Su logotipo editable (PSD – Ai – CDR).</li><li>Fotos e imágenes en buena resolución.</li><li>Entrega de datos de contacto</li></ul>'
        } else if (formatearContrato(request.data.codigo) == 'LPREEL') {
          descripcionEntrada =
            '<p><strong>EDICION DE VIDEO</strong></p><ul><li>01 Desarrollo de Reel o Edición de Video de hasta 10 SEGUNDOS Saludo o presentación de su empresa o negocio</li><li>Cliente nos remite Logo en versión editable, Fotos o Videos Cortos, Logos Perú Edita</li><li>Incluye Efectos y Musicalización</li><li>Desarrollo StoryBoard : Presentación al cliente</li><li><strong style="background-color: yellow;">Locución en Off –</strong><strong>&nbsp;no incluye</strong></li><li>Entregable vía DRIVE</li><li>Tiempo de producción (total): 02 días hábiles Propuestas:</li><li class="ql-indent-2">Recibirás un desarrollo y edición de su video</li><li class="ql-indent-2">100 % originales</li><li class="ql-indent-2">1 profesional dedicado</li><li class="ql-indent-2">Resolución 1920x1080, alta calidad.</li><li class="ql-indent-2">Modificaciones (02 cambios) por Video. No se otorgarán más cambios según el plan contratado.</li></ul><p>&nbsp;</p><p>Entrega del Video en Drive (Descargar)</p>'
        } else if (formatearContrato(request.data.codigo) == 'LPFLYER') {
          descripcionEntrada =
            '<p><strong>SERVICIO de diseño de piezas graficas</strong></p><p><strong>&nbsp;</strong></p><ul><li><strong>03 Diseños de flyer – 01 propuestas – 1 cara Según requerimientos y ejemplos del cliente</strong></li><li><strong>Hasta dos cambios x cada flyer</strong></li><li><strong>ENTREGABLES : JPG – PDF - AI para impresión</strong></li></ul><p>&nbsp;</p><p>El cliente nos remite :</p><ul><li>Coordinación directa con el diseñador</li><li>Logo en versión editable</li></ul>'
        } else if (formatearContrato(request.data.codigo) == 'LPSEO') {
          descripcionEntrada =
            '<p><strong style="color: red;">1.-Propiedad Verificada:</strong></p><p>- Verificación desde Gmail y añadir DNS</p><p>- Verificar Google console search y listo la propiedad es del cliente</p><p>- Realizar solicitud de indexación para que la URL pueda aparecer</p><p>en Google</p><p>Propiedad Verificada</p><p><strong style="color: red;">2.-SEO:</strong></p><p>- Uso de Metadatos para mejorar el posicionamiento del SEO y</p><p>también el rendimiento del SEO con la propiedad del cliente cual</p><p>favorecerá a la carga de la página.</p><p>Cliente remite palabras claves </p><p>Capacitación y documentación&nbsp;</p>'
        } else if (formatearContrato(request.data.codigo) == 'LPADS') {
          descripcionEntrada =
            '<p>1.- Servicio de <strong style="background-color: yellow;">Asesoría de Posicionamiento PAGADO en GOOGLE - Adwords</strong></p><ul><li>Capacitación a distancia - Bajo el medio digital que se acuerde</li><li>Análisis de la web a posicionar</li><li>Recomendaciones</li><li>Configuración de la Cuenta</li><li>Capacitación de Uso de Google SEM</li><li>Manuales de Uso</li><li>Tiempo de Capacitación: Max 3 horas</li><li>Estrategias de pago</li><li>Capacitación en la publicidad pagada por el mismo cliente</li><li>Entrega de Manuales y Material – link grabado </li><li>TIEMPO: 01 día hábil</li></ul>'
        } else if (formatearContrato(request.data.codigo) == 'LPWAE') {
          descripcionEntrada =
            '<p>DESARROLLO WEB ADMINISTRABLE - PLAN EMPRESA</p><p><br></p><p>✓ Hasta 6 internas y Sub Internas&nbsp;A la medida del cliente.</p><p>✓ Formularios de Contacto Dinámico. MAIL de repuesta al visitante.</p><p>✓ Ubicación de la empresa o negocio a través de Google Maps.</p><p>✓ Programación en PHP - Framework Laravel - React</p><p>✓ Base de Datos Myql&nbsp;</p><p>✓ HTML 5 , Booystrap, CSS3, jQUERY</p><p>✓ No usamos plantillas - No trabajamos con CMS&nbsp;</p><p>✓ Seguridad Anti Spam</p><p>✓ Interacción con Redes Sociales. Facebook - Whastapp - INSTAGRAM&nbsp;</p><p>✓ Podrá administrar Hasta 04 Internas. TEXTOS E IMAGENES&nbsp;&nbsp;</p><p>✓ Entrega de acceso al administrador.</p><p>✓ Manual de Usuario.</p><p>✓ Capacitación del sistema (En nuestra Agencia o VIRTUAL).</p><p>✓ Soporte Técnico. Por 03 mes (Solo atendemos incidencias o fallas en nuestro servicio + (01) cambio textuales e imágenes).</p><p>✓ Técnica de Posicionamiento Web (SEO). Alta del desarrollo web a los buscadores GOOGLE</p><p>Indexación de palabras claves - Keywords , coordinación directa con el cliente&nbsp;</p><p>✓ Retoque Fotográfico de Hasta 25</p><p><br></p><p>EL CLIENTE NOS REMITE :</p><p>✓ Su logotipo editable (PSD – Ai – CDR).</p><p>✓ Fotos e imágenes en buena resolución.</p><p>✓ Entrega de datos de contacto</p><p><br></p><p>✓ Tiempo de Trabajo :&nbsp;25 días HABILES&nbsp;</p><p>✓ Forma de Trabajo : Bajo contrato.</p><p>✓ Nuestros Costos NO incluyen IGV</p>'
        } else if (formatearContrato(request.data.codigo) == 'LPWAG') {
          descripcionEntrada =
            '<p>DESARROLLO WEB ADMINISTRABLE - PLAN GOLDEN</p><p><br></p><p>✓ Hasta 5 internas, a la medida del cliente. (Plantillas Express) el cliente elegirá una&nbsp;</p><p>✓ Formularios de Contacto Dinámico. MAIL de repuesta al visitante.</p><p>✓ Ubicación de la empresa o negocio a través de Google Maps.</p><p>✓ Programación en PHP - Framework Laravel - React</p><p>✓ Administración Dominio .com GRATIS x un AÑO</p><p>✓ Alojamiento Web 5 GB (Sin Cpanel Independiente</p><p>✓ Creación de Correos corporativos hasta 10 - Cliente nos remite sus nombres&nbsp;</p><p>✓ Seguridad Anti Spam</p><p>✓ Interacción con Redes Sociales.</p><p>✓ Podrá administrar Hasta 02 Internas.</p><p>✓ Entrega de acceso al administrador.</p><p>✓ Manual de Usuario.</p><p>✓ Capacitación del sistema (En nuestra Agencia o VIRTUAL).</p><p>✓ Soporte Técnico. Por 01 mes (Solo atendemos incidencias o fallas en nuestro servicio + (01) cambio textuales e imágenes).</p><p><br></p><p><br></p><p>EL CLIENTE NOS REMITE :</p><p>✓ Su logotipo editable (PSD – Ai – CDR).</p><p>✓ Fotos e imágenes en buena resolución.</p><p>✓ Entrega de datos de contacto</p><p><br></p><p>✓ Tiempo de Trabajo :&nbsp;08 días&nbsp;</p><p>✓ Forma de Trabajo : Bajo contrato.</p><p>✓ Nuestros Costos NO incluyen IGV</p><p>&nbsp;</p>'
        } else if (formatearContrato(request.data.codigo) == 'LPW') {
          descripcionEntrada =
            '<p>01 DISEÑO WEB INFORMATIVA: </p><ul><li>Hasta 4 internas, bajo nuestras propuestas INGRESAR (Plantillas Express) el cliente elegirá una </li><li>Desarrollamos un Brief </li><li>Formularios de Contacto Dinámico. MAIL de repuesta al visitante. </li><li>Ubicación de la empresa o negocio a través de Google Maps. </li><li>NO Utilizamos plantillas o CMS Gratuitos de Internet </li><li>WEB desarrollada desde CERO </li><li>Seguridad Anti Spam </li><li>Interacción con Redes Sociales. (WhatsApp – Facebook – YouTube) </li><li>Administración Dominio .com <strong style="background-color: yellow;">GRATIS x un AÑO</strong></li><li>Alojamiento Web 1 GB (Sin Cpanel Independiente) <strong>GRATIS x un AÑO</strong></li><li>Soporte Técnico. Por 01 mes (Solo atendemos incidencias o fallas en nuestro servicio). </li></ul><p>&nbsp;</p><p>EL CLIENTE NOS REMITE: </p><p>&nbsp;</p><ul><li>Entrega de textos e imágenes para la página web </li><li>Logotipo en versión editable </li><li>Fotos e imágenes en buena resolución. </li><li>Datos de contacto</li></ul>'
        } else if (formatearContrato(request.data.codigo) == 'LPMAPS') {
          descripcionEntrada =
            '<p><strong style="color: red;">1.-Propiedad Verificada:</strong></p><p>- Verificación desde Gmail y añadir DNS</p><p>- Verificar Google console search y listo la propiedad es del cliente</p><p>- Realizar solicitud de indexación para que la URL pueda aparecer</p><p>en Google</p><p><br></p><p><strong style="color: red;">2. Ubicación del negocio en google maps</strong></p><p><strong style="color: red;">&nbsp;</strong></p><p><strong style="color: red;">CLIENTE NOS RENITE : SUS ACCESOS A SU CUENTA GMAIL&nbsp;</strong></p>'
        } else if (formatearContrato(request.data.codigo) == 'LPHOST') {
          descripcionEntrada =
            '<p><strong>Plan COBRE:</strong></p><p><strong>&#xFEFF;</strong></p><p>✓ Administracion de dominio .com .pe</p><p>✓ Alojamiento solo para correos</p><p>✓ Sin Cpanel Independiente</p><p>✓ Creación hasta 04 correos</p><p>✓ Manual de Configuración GMAIL - Outlokk</p><p>✓Pago ANUAL</p><p>✓ Trabajamos bajo contrato</p><p><br></p><p>Tiempo de entrega 48 - 72 Horas</p>'
        } else if (formatearContrato(request.data.codigo) == 'LPLANDING-ADM') {
          descripcionEntrada =
            '<p><strong style="background-color: yellow; color: rgb(50, 50, 50);">01 DISEÑO WEB LANDING PAGE - ADMINISTRABLE :</strong><strong style="color: rgb(50, 50, 50);"> </strong></p><ul><li>01 interna de Aterrizaje - LANDING PAGE, El cliente elegirá una Plantilla </li><li>&nbsp;Formulario de Contacto Dinámico. </li><li><strong>Desarrollo de Modulo Administrable - 1 sección</strong></li><li>Capación de Uso del módulo administrable</li><li>Accesos o credenciales al administrador </li><li>NO Utilizamos plantillas o CMS Gratuitos de Internet</li><li>WEB desarrollada desde CERO </li><li>Seguridad Anti Spam </li><li>Interacción con Redes Sociales. (WhatsApp – Facebook – YouTube)</li><li>Soporte Técnico. Por 01 mes (Solo atendemos incidencias o fallas en nuestro servicio).</li></ul>'
        } else if (formatearContrato(request.data.codigo) == 'LPLANDING-TV') {
          descripcionEntrada =
            '<p>&nbsp;<strong style="background-color: yellow; color: rgb(50, 50, 50);">01 DISEÑO WEB LANDING PAGE – TIENDA VIRTUAL&nbsp;:</strong><strong style="color: rgb(50, 50, 50);"> </strong></p><ul><li>01 interna de Aterrizaje - LANDING PAGE, El cliente elegirá una Plantilla </li><li>Formulario de Contacto Dinámico. </li><li>Desarrollo de modulo de administración y actualización de productos - 1 sección</li><li>No incluye pasarela de pagos </li><li>Compra a traves de correo o Wsp </li><li>Capación de Uso del modulo administrable</li><li>Accesos o credenciales al administrador </li><li>Administración Dominio .com <strong>GRATIS x un AÑO</strong></li><li>Alojamiento Web Hasta 1000 MB (Sin Cpanel Independiente) <strong>GRATIS x un AÑO</strong></li><li>NO Utilizamos plantillas o CMS Gratuitos de Internet</li><li>WEB desarrollada desde CERO </li><li>Creación de 03 cuenta de correo&nbsp;Manual de Configuración GMAIL - Outloock </li><li>Seguridad Anti Spam </li><li>Interacción con Redes Sociales. (WhatsApp – Facebook – YouTube)</li><li>Soporte Técnico. Por 01 mes (Solo atendemos incidencias o fallas en nuestro servicio).&nbsp;&nbsp;</li></ul>'
        } else if (
          formatearContrato(request.data.codigo) == 'LPB' ||
          formatearContrato(request.data.codigo) == 'LPBAM' ||
          formatearContrato(request.data.codigo) == 'LPBAM2'
        ) {
          descripcionEntrada =
            '<ul><li><strong>Brief o Cuestionario de la empresa.&nbsp;</strong><span style="background-color: yellow;">(Se realizará un Análisis previo antes de la construcción del Logotipo)</span></li><li>Hasta <strong style="background-color: yellow;">(03)</strong><strong> Propuestas de LOGOTIPO</strong></li><li class="ql-align-justify"><strong>DISEÑO o REDISEÑO DE LOGOTIPO </strong><strong style="color: red;">PLAN Inicio de Creación de Marca&nbsp;</strong></li><li class="ql-align-justify">Análisis del Brief para la <strong>construcción del Logotipo.</strong></li></ul><p>•&nbsp;&nbsp;Coordinación directa, con el cliente para el desarrollo del Brief o cuestionario.</p><p><strong style="background-color: yellow;">Propuestas:</strong></p><ul><li>Recibirás (03 propuestas) Profesionales</li><li>100 % originales</li><li>1 diseñador dedicado</li><li>Modificaciones (<strong style="color: red;">02 cambios en el diseño aprobado</strong>). <strong><u>No se otorgarán más cambios según el plan contratado.</u></strong></li></ul><p><br></p><p>Teniendo en cuenta la respuesta inmediata del cliente. Entregables del Logotipo Final: Archivos Editables y sustentación del LOGOTIPO APROBADO: <strong>Ilustrador o PSD – PNG – JPG –PDF</strong></p><p><br></p><p class="ql-align-center"><strong style="background-color: yellow;">No incluye adaptación de personaje, ni&nbsp;vectorización.</strong></p>'
        } else if (formatearContrato(request.data.codigo) == 'LPHOST400MB') {
          descripcionEntrada =
            '<p><strong>Plan Hosting 400 MB:</strong></p><p><br></p><p><strong>&#xFEFF;</strong>Tiempo de entrega 48 - 72 Horas</p><p><br></p><ul><li>Alojamiento solo para correos</li><li>Sin Cpanel Independiente</li><li>Creación hasta 03 correos</li><li>Manual de Configuración GMAIL - Outlokk</li><li>Pago ANUAL</li><li>Trabajamos bajo contrato</li><li>Hosting Linux</li><li>Soporte técnico</li><li>Seguridad avanzada</li><li>Anti spam</li><li>Ultimas versiones de PHP.</li></ul>'
        } else if (formatearContrato(request.data.codigo) == 'LPHOST1000MB') {
          descripcionEntrada =
            '<p><strong>Plan Hosting 1000 MB:</strong></p><p><br></p><p><strong>&#xFEFF;</strong>Tiempo de entrega 48 - 72 Horas</p><p><br></p><ul><li>Alojamiento solo para correos</li><li>Sin Cpanel Independiente</li><li>Creación hasta 10 correos</li><li>Manual de Configuración GMAIL - Outlokk</li><li>Pago ANUAL</li><li>Trabajamos bajo contrato</li><li>Hosting Linux</li><li>Soporte técnico</li><li>Seguridad avanzada</li><li>Anti spam</li><li>Ultimas versiones de PHP.</li></ul>'
        } else if (formatearContrato(request.data.codigo) == 'LPHOST3000MB') {
          descripcionEntrada =
            '<p><strong>Plan Hosting 3000 MB:</strong></p><p><br></p><p><strong>&#xFEFF;</strong>Tiempo de entrega 48 - 72 Horas</p><p><br></p><ul><li>Alojamiento solo para correos</li><li>Sin Cpanel Independiente</li><li>Hosting Linux</li><li>Creación de correos ilimitados</li><li>Manual de Configuración GMAIL - Outlokk</li><li>Pago ANUAL</li><li>Trabajamos bajo contrato</li><li>Soporte técnico</li><li>Seguridad avanzada</li><li>Anti spam</li><li>Ultimas versiones de PHP.</li></ul>'
        } else if (formatearContrato(request.data.codigo) == 'LPHOST10000MB') {
          descripcionEntrada =
            '<p><strong>Plan Hosting 10000 MB:</strong></p><p><br></p><p><strong>&#xFEFF;</strong>Tiempo de entrega 48 - 72 Horas</p><p><br></p><ul><li>Alojamiento solo para correos</li><li>Sin Cpanel Independiente</li><li>Hosting Linux</li><li>Creación de correos ilimitados</li><li>Manual de Configuración GMAIL - Outlokk</li><li>Pago ANUAL</li><li>Trabajamos bajo contrato</li><li>Soporte técnico</li><li>Seguridad avanzada</li><li>Anti spam</li><li>Ultimas versiones de PHP.</li></ul>'
        } else if (
          formatearContrato(request.data.codigo) == 'LPHOST10000MBCP'
        ) {
          descripcionEntrada =
            '<p><strong>Plan Hosting 10000 MB con CPANEL:</strong></p><p><br></p><p><strong>&#xFEFF;</strong>Tiempo de entrega 48 - 72 Horas</p><p><br></p><ul><li>Alojamiento solo para correos</li><li>Con Cpanel Independiente</li><li>Hosting Linux</li><li>Creación de correos ilimitados</li><li>Manual de Configuración GMAIL - Outlokk</li><li>Pago ANUAL</li><li>Trabajamos bajo contrato</li><li>Soporte técnico</li><li>Seguridad avanzada</li><li>Anti spam</li><li>Gestor de base de datos MYSQL</li><li>Ultimas versiones de PHP.</li></ul>'
        } else if (formatearContrato(request.data.codigo) == 'LPHOSTILIM') {
          descripcionEntrada =
            '<p><strong>Plan Hosting Ilimitado sin CPANEL:</strong></p><p><br></p><p><strong>&#xFEFF;</strong>Tiempo de entrega 48 - 72 Horas</p><p><br></p><ul><li>Alojamiento solo para correos</li><li>Sin Cpanel Independiente</li><li>Hosting Linux</li><li>Creación de correos ilimitados</li><li>Manual de Configuración GMAIL - Outlokk</li><li>Pago ANUAL</li><li>Trabajamos bajo contrato</li><li>Soporte técnico</li><li>Seguridad avanzada</li><li>Anti spam</li><li>Ultimas versiones de PHP.</li></ul>'
        } else if (formatearContrato(request.data.codigo) == 'LPHOSTILIMCP') {
          descripcionEntrada =
            '<p><strong>Plan Hosting Ilimitado con CPANEL:</strong></p><p><br></p><p><strong>&#xFEFF;</strong>Tiempo de entrega 48 - 72 Horas</p><p><br></p><ul><li>Alojamiento solo para correos</li><li>Con Cpanel Independiente</li><li>Hosting Linux</li><li>Creación de correos ilimitados</li><li>Manual de Configuración GMAIL - Outlokk</li><li>Pago ANUAL</li><li>Trabajamos bajo contrato</li><li>Soporte técnico</li><li>Seguridad avanzada</li><li>Anti spam</li><li>Ultimas versiones de PHP.</li></ul>'
        } else if (formatearContrato(request.data.codigo) == 'LPDOMINIO') {
          descripcionEntrada =
            '<p><strong>Plan administración de dominio:</strong></p><p><br></p><p><strong>&#xFEFF;</strong>Tiempo de entrega 48 - 72 Horas</p><p><br></p><ul><li>Pago ANUAL</li><li>Trabajamos bajo contrato</li><li>Soporte técnico</li></ul>'
        } else if (formatearContrato(request.data.codigo) == 'LPMANUALC') {
          descripcionEntrada =
            '<p><strong style="background-color: rgb(255, 255, 0);">&nbsp;PLAN COBRE</strong></p><p><br></p><p><strong>1. Introducción</strong></p><p><strong>2. Índice</strong></p><p><strong>3. La Marca</strong></p><ul><li>&nbsp;&nbsp;Síntesis (elementos que conforman la marca)</li><li>&nbsp;&nbsp;Marca Gráfica (Depende del logo)</li><li>&nbsp;&nbsp;Versiones (posición del logo)</li><li>&nbsp;&nbsp;Retícula de construcción</li><li>&nbsp;&nbsp;Área de seguridad</li></ul><p><strong>4. Color</strong></p><ul><li>&nbsp;Colores corporativos</li><li>&nbsp;Colores complementarios</li></ul><p><strong>5. Tipografía</strong></p><ul><li>&nbsp;&nbsp;Tipografía corporativa</li><li>&nbsp;&nbsp;Tipografía complementaria</li></ul><p><strong>6. Uso del Logo</strong></p><ul><li>&nbsp;&nbsp;Uso sobre fondo de color e imágenes&nbsp;</li><li>&nbsp;&nbsp;Uso Incorrecto</li></ul><p><br></p><p><br></p><p><strong style="background-color: rgb(255, 255, 0);">TIEMPO DE TRABAJO : 1 DIA&nbsp;</strong></p>'
        } else if (formatearContrato(request.data.codigo) == 'LPMANUALS') {
          descripcionEntrada =
            '<p><strong style="background-color: rgb(255, 255, 0);">&nbsp;PLAN SILVER</strong></p><p><br></p><p><strong>1. Introducción</strong></p><p><strong>2. Índice</strong></p><p><strong>3. Presentación</strong></p><ul><li>Historia</li><li>&nbsp;Visión y Misión</li><li>&nbsp;Valores</li></ul><p><strong>4. La Marca</strong></p><ul><li>&nbsp;&nbsp;Síntesis (elementos que conforman la marca)</li><li>&nbsp;&nbsp;Marca Gráfica (Depende del logo)</li><li>&nbsp;&nbsp;Versiones (posición del logo)</li><li>&nbsp;&nbsp;Retícula de construcción</li><li>&nbsp;&nbsp;Área de seguridad</li><li>&nbsp;&nbsp;Tamaño minimo (digital e impreso)</li></ul><p><strong>5. Color</strong></p><ul><li>&nbsp;Colores corporativos</li><li>&nbsp;Colores complementarios</li></ul><p><strong>6. Tipografía</strong></p><ul><li>&nbsp;&nbsp;Tipografía corporativa</li><li>&nbsp;&nbsp;Tipografía complementaria</li></ul><p><strong>7. Uso del Logo</strong></p><ul><li>&nbsp;&nbsp;Uso sobre fondo de color e imágenes&nbsp;</li><li>&nbsp;&nbsp;Uso Incorrecto</li><li>  Textura</li></ul><p><strong>8. Aplicaciones</strong></p><ul><li>&nbsp;&nbsp;Papelería (Hoja membretada, Tarjeta de presentación, Folder)</li><li>&nbsp;&nbsp;Merchandising (Polo, Calendario, Taza)</li><li>&nbsp;&nbsp;Página Web (Mockup)</li></ul><p>&nbsp;&nbsp;Espacio físico (interior y exterior)</p><p><br></p><p><br></p><p><strong style="background-color: rgb(255, 255, 0);">TIEMPO DE TRABAJO : 2 DIAS&nbsp;</strong></p>'
        } else if (formatearContrato(request.data.codigo) == 'LPADSE') {
          descripcionEntrada =
            '<p><strong style="background-color: rgb(255, 255, 0);">PLAN EMPRENDIMIENTO</strong></p><p><br></p><p class="ql-align-justify"><strong>Entrega de un manual de usuario básico sobre Google Ads antes de la reunión:</strong></p><ul><li>Introducción a Google Ads.</li><li>Define tus objetivos publicitarios.</li><li>Palabras clave.</li><li>Establece tu presupuesto y estrategia de puja.</li><li>Seguimiento y optimización.</li><li>Configura tu cuenta e inicio de campaña en Google Ads.</li></ul><p>&nbsp;</p><p><strong>Realización de una capacitación en vivo durante la reunión virtual para aprender los conceptos básicos de Google Ads.</strong></p><ul><li>Introducción a la reunión explicando la estructura y objetivos de la capacitación.</li><li>Explicación detallada de los elementos de la interfaz de Google Ads:</li><li>Panel de control.</li><li>Menús y opciones principales.</li><li>Herramientas de análisis y seguimiento.</li><li>Demostración en vivo de la creación de una campaña publicitaria básica:</li><li>Selección de tipo de campaña.</li><li>Configuración de presupuesto y segmentación.</li><li>Creación de anuncios simples.</li><li>Configuración de palabras clave.</li><li>Preguntas y respuestas para aclarar dudas durante la capacitación.</li></ul>'
        } else if (formatearContrato(request.data.codigo) == 'LPADSI') {
          descripcionEntrada =
            '<p><strong style="background-color: rgb(255, 255, 0);">PLAN INTERMEDIO</strong></p><p><br></p><p class="ql-align-justify"><strong>Entrega de un manual de usuario básico sobre Google Ads antes de la reunión:</strong></p><ul><li>Introducción a Google Ads.</li><li>Define tus objetivos publicitarios.</li><li>Palabras clave.</li><li>Establece tu presupuesto y estrategia de puja.</li><li>Seguimiento y optimización.</li><li>Configura tu cuenta e inicio de campaña en Google Ads.</li></ul><p>&nbsp;</p><p><strong>Análisis previo de audiencia, competencia y objetivos específicos de Google Ads antes de la reunión.</strong></p><ul><li>Investigación de la audiencia objetivo, incluyendo características demográficas, intereses y comportamientos.</li><li>Análisis de la competencia para identificar fortalezas, debilidades y oportunidades de diferenciación.</li><li>Establecimiento de objetivos claros y medibles para la campaña publicitaria en Google Ads.</li></ul><p>&nbsp;</p><p><strong>Generación de documento con palabras clave, títulos y contenido para el anuncio antes de la reunión, utilizando herramientas de análisis de Google Ads.</strong></p><ul><li>Investigación y selección de palabras clave relevantes para la audiencia y los objetivos de la campaña.</li><li>Creación de títulos atractivos y llamativos para los anuncios.</li><li>Desarrollo de contenido persuasivo y relevante para los usuarios que se alinee con los objetivos de la campaña.</li></ul><p><br></p><p><strong>Realización de una capacitación en vivo durante la reunión virtual para aprender los conceptos básicos de Google Ads.</strong></p><ul><li>Introducción a la reunión explicando la estructura y objetivos de la capacitación.</li><li>Explicación detallada de los elementos de la interfaz de Google Ads:</li><li>Panel de control.</li><li>Menús y opciones principales.</li><li>Herramientas de análisis y seguimiento.</li><li>Demostración en vivo de la creación de una campaña publicitaria básica:</li><li>Selección de tipo de campaña.</li><li>Configuración de presupuesto y segmentación.</li><li>Creación de anuncios simples.</li><li>Configuración de palabras clave.</li><li>Preguntas y respuestas para aclarar dudas durante la capacitación.</li></ul>'
        } else if (formatearContrato(request.data.codigo) == 'LPADSF') {
          descripcionEntrada =
            '<p><strong style="background-color: rgb(255, 255, 0);">PLAN FULL</strong></p><p><br></p><p class="ql-align-justify"><strong>Entrega de un manual de usuario básico sobre Google Ads antes de la reunión:</strong></p><ul><li>Introducción a Google Ads.</li><li>Define tus objetivos publicitarios.</li><li>Palabras clave.</li><li>Establece tu presupuesto y estrategia de puja.</li><li>Seguimiento y optimización.</li><li>Configura tu cuenta e inicio de campaña en Google Ads.</li></ul><p>&nbsp;</p><p><strong>Análisis previo de audiencia, competencia y objetivos específicos de Google Ads antes de la reunión.</strong></p><ul><li>Investigación de la audiencia objetivo, incluyendo características demográficas, intereses y comportamientos.</li><li>Análisis de la competencia para identificar fortalezas, debilidades y oportunidades de diferenciación.</li><li>Establecimiento de objetivos claros y medibles para la campaña publicitaria en Google Ads.</li></ul><p>&nbsp;</p><p><strong>Generación de documento con palabras clave, títulos y contenido para el anuncio antes de la reunión, utilizando herramientas de análisis de Google Ads.</strong></p><ul><li>Investigación y selección de palabras clave relevantes para la audiencia y los objetivos de la campaña.</li><li>Creación de títulos atractivos y llamativos para los anuncios.</li><li>Desarrollo de contenido persuasivo y relevante para los usuarios que se alinee con los objetivos de la campaña.</li></ul><p><br></p><p><strong>Realización de una capacitación en vivo durante la reunión virtual para aprender los conceptos básicos de Google Ads.</strong></p><ul><li>Introducción a la reunión explicando la estructura y objetivos de la capacitación.</li><li>Explicación detallada de los elementos de la interfaz de Google Ads:</li><li>Panel de control.</li><li>Menús y opciones principales.</li><li>Herramientas de análisis y seguimiento.</li><li>Demostración en vivo de la creación de una campaña publicitaria básica:</li><li>Selección de tipo de campaña.</li><li>Configuración de presupuesto y segmentación.</li><li>Creación de anuncios simples.</li><li>Configuración de palabras clave.</li><li>Preguntas y respuestas para aclarar dudas durante la capacitación.</li></ul><p><br></p><p><strong>Realización de un seguimiento de los anuncios creados en los planes anteriores durante la reunión virtual, utilizando herramientas de análisis de Google Ads.</strong></p><p><strong>&nbsp;</strong></p><ul><li>Monitoreo y análisis de métricas como CTR, CPC, ROI, etc., de los anuncios creados en los planes anteriores.</li><li>Identificación de tendencias y áreas de mejora en el rendimiento de los anuncios.</li></ul><p>&nbsp;</p><p><strong>Evaluación de métricas y resultados en tiempo real durante la reunión utilizando la plataforma de Google Ads.</strong></p><p><strong>&nbsp;</strong></p><ul><li>Revisión de métricas clave de rendimiento de los anuncios en tiempo real durante la reunión virtual.</li><li>Análisis de los resultados obtenidos y comparación con los objetivos establecidos.</li></ul><p><strong>&nbsp;</strong></p><p><strong>Implementación de mejoras en los anuncios basadas en la evaluación y el seguimiento durante la reunión virtual.</strong></p><p><strong>&nbsp;</strong></p><ul><li>Aplicación de ajustes y optimizaciones a los anuncios para mejorar su rendimiento y alcanzar los objetivos establecidos.</li></ul><p>&nbsp;</p>'
        } else if (formatearContrato(request.data.codigo) == 'LPFADSE') {
          descripcionEntrada =
            '<p><strong style="background-color: rgb(255, 255, 0);">PLAN EMPRENDIMIENTO</strong></p><p><br></p><p><strong>Entrega de un manual de usuario básico sobre Facebook Ads antes de la reunión.</strong></p><ul><li>Introducción a Facebook Ads</li><li>Promocionar Publicación</li><li>Administrador de Anuncios</li><li>Campaña de Ventas</li><li>Segmentación Detallada</li><li>Anuncios de Video</li><li>Públicos Personalizados</li><li>Métricas Claves en Facebook Ads</li><li>Errores Comunes en Facebook Ads</li></ul><p>&nbsp;</p><p><strong>Realización de una capacitación en vivo durante la reunión virtual para aprender los conceptos básicos de Facebook Ads.</strong></p><ul><li>Introducción explicando la estructura y objetivos de la capacitación.</li><li>Explicación detallada de los elementos de la interfaz de Facebook Ads:</li><li>Panel de control.</li><li>Menús y opciones principales.</li><li>Herramientas de análisis y seguimiento.</li><li>Identificación del objetivo del anuncio (por ejemplo, promocionar un producto o servicio específico).</li><li>Selección de tipo de campaña.</li><li>Configuración de presupuesto y segmentación.</li><li>Configuración de públicos objetivo.</li><li>Revisión y publicación del anuncio en tiempo real.</li></ul><p>&nbsp;</p'
        } else if (formatearContrato(request.data.codigo) == 'LPFADSI') {
          descripcionEntrada =
            '<p><strong style="background-color: rgb(255, 255, 0);">PLAN INTERMEDIO</strong></p><p><br></p><p><strong>Entrega de un manual de usuario básico sobre Facebook Ads antes de la reunión.</strong></p><ul><li>Introducción a Facebook Ads</li><li>Promocionar Publicación</li><li>Administrador de Anuncios</li><li>Campaña de Ventas</li><li>Segmentación Detallada</li><li>Anuncios de Video</li><li>Públicos Personalizados</li><li>Métricas Claves en Facebook Ads</li><li>Errores Comunes en Facebook Ads</li></ul><p><br></p><p><strong>Análisis previo de audiencia, competencia y objetivos específicos de Facebook Ads</strong></p><ul><li>Investigación de la audiencia objetivo, incluyendo características demográficas, intereses y comportamientos.</li><li>Análisis de la competencia para identificar fortalezas, debilidades y oportunidades de diferenciación.</li><li>Establecimiento de objetivos claros y medibles para la campaña publicitaria en Facebook Ads.</li></ul><p><br></p><p><strong>Generación de Documento de Contenido:</strong></p><ul><li>Creación de títulos atractivos y llamativos para los anuncios en Facebook que capten la atención y generen interés entre la audiencia objetivo.</li><li>Desarrollo de contenido persuasivo y relevante para los usuarios de Facebook, asegurando que se alinee con los objetivos de la campaña y utilice de manera efectiva los elementos identificados en la investigación previa.</li></ul><p><br></p><p><strong>Creación y ajuste del anuncio en tiempo real durante la reunión virtual basado en el análisis y la documentación.</strong></p><ul><li>Introducción explicando la estructura y objetivos de la capacitación.</li><li>Explicación detallada de los elementos de la interfaz de Facebook Ads:</li><li>Panel de control.</li><li>Menús y opciones principales.</li><li>Herramientas de análisis y seguimiento.</li><li>Identificación del objetivo del anuncio (por ejemplo, promocionar un producto o servicio específico).</li><li>Selección de tipo de campaña.</li><li>Configuración de presupuesto y segmentación.</li><li>Configuración de públicos objetivo.</li><li>Revisión y publicación del anuncio en tiempo real.</li></ul>'
        } else if (formatearContrato(request.data.codigo) == 'LPFADSF') {
          descripcionEntrada =
            '<p><strong style="background-color: rgb(255, 255, 0);">PLAN FULL</strong></p><p><br></p><p><strong>Entrega de un manual de usuario básico sobre Facebook Ads antes de la reunión.</strong></p><ul><li>Introducción a Facebook Ads</li><li>Promocionar Publicación</li><li>Administrador de Anuncios</li><li>Campaña de Ventas</li><li>Segmentación Detallada</li><li>Anuncios de Video</li><li>Públicos Personalizados</li><li>Métricas Claves en Facebook Ads</li><li>Errores Comunes en Facebook Ads</li></ul><p><br></p><p><strong>Análisis previo de audiencia, competencia y objetivos específicos de Facebook Ads:</strong></p><ul><li>Investigación de la audiencia objetivo, incluyendo características demográficas, intereses y comportamientos.</li><li>Análisis de la competencia para identificar fortalezas, debilidades y oportunidades de diferenciación.</li><li>Establecimiento de objetivos claros y medibles para la campaña publicitaria en Facebook Ads.</li></ul><p><br></p><p><strong>Generación de Documento de Contenido:</strong></p><ul><li>Creación de títulos atractivos y llamativos para los anuncios en Facebook que capten la atención y generen interés entre la audiencia objetivo.</li><li>Desarrollo de contenido persuasivo y relevante para los usuarios de Facebook, asegurando que se alinee con los objetivos de la campaña y utilice de manera efectiva los elementos identificados en la investigación previa.</li></ul><p><br></p><p><strong>Creación y ajuste del anuncio en tiempo real durante la reunión virtual basado en el análisis y la documentación.</strong></p><ul><li>Introducción explicando la estructura y objetivos de la capacitación.</li><li>Explicación detallada de los elementos de la interfaz de Facebook Ads:</li><li>Panel de control.</li><li>Menús y opciones principales.</li><li>Herramientas de análisis y seguimiento.</li><li>Identificación del objetivo del anuncio (por ejemplo, promocionar un producto o servicio específico).</li><li>Selección de tipo de campaña.</li><li>Configuración de presupuesto y segmentación.</li><li>Configuración de públicos objetivo.</li><li>Revisión y publicación del anuncio en tiempo real.</li></ul><p><br></p><p><strong>Seguimiento de Anuncios Anteriores:</strong></p><ul><li>Realización de un seguimiento de los anuncios creados en los planes anteriores durante la reunión virtual, utilizando herramientas de análisis de Facebook Ads.</li><li>Revisión de los datos y resultados obtenidos hasta el momento para identificar áreas de mejora y oportunidades de optimización.</li></ul><p><br></p><p><strong>Evaluación de Métricas y Resultados en Tiempo Real:</strong></p><ul><li>Evaluación de métricas y resultados en tiempo real durante la reunión utilizando la plataforma de Facebook Ads.</li><li>Análisis detallado de métricas clave como CTR, CPC, ROAS, alcance, frecuencia, y conversiones para comprender el rendimiento de los anuncios.</li></ul><p><br></p><p><strong>Implementación de Mejoras:</strong></p><ul><li>Identificación de áreas de mejora basadas en la evaluación y el seguimiento durante la reunión virtual.</li><li>Implementación de mejoras en los anuncios, incluyendo ajustes en el contenido, segmentación, estrategias de oferta, y optimización de conversiones.</li><li>Demostración de cómo realizar cambios en tiempo real en la plataforma de Facebook Ads y revisar los efectos de las mejoras implementadas.</li></ul>'
        } else if (formatearContrato(request.data.codigo) == 'LPACPB') {
          descripcionEntrada =
            '<p><strong style="background-color: rgb(255, 255, 0);">Asesoría de Campaña pagada en Meta Business (Facebook - Instagram) - PLAN BASICO&nbsp;</strong></p><p><br></p><p><strong>Desarrollamos tu campaña pagada en Meta Business</strong></p><ul><li>Creación y configuración de la campaña publicitaria.</li><li>Selección de objetivos de campaña adecuados a tus necesidades.</li><li>Configuración de la segmentación de audiencia para alcanzar a tu público objetivo.</li></ul><p><br></p><p><strong>Aumenta tu presencia en Redes Sociales</strong></p><ul><li>Optimización de anuncios para aumentar la visibilidad en Facebook e Instagram.</li><li>Estrategias para mejorar la interacción con tus publicaciones.</li></ul><p><br></p><p><strong>Respuesta a Potenciales Clientes</strong></p><ul><li>Asistencia en la configuración de respuestas automáticas a consultas de clientes.</li><li>Sugerencias para mejorar la interacción con clientes potenciales.</li></ul><p><br></p><p><strong>Destaca ante tu competencia</strong></p><ul><li>Análisis básico de competidores y recomendaciones para sobresalir.</li><li>Creación de contenido atractivo y relevante.</li></ul><p><br></p><p><strong>Incluye Diseño de Post - Desarrollo de Reel</strong></p><ul><li>Diseño gráfico para publicaciones atractivas.</li><li>Creación y edición de Reels 10 segundos para mejorar la interacción y alcance.</li></ul><p><br></p><p><br></p><p>✓TIEMPO 2 DIAS.</p><ul><li>1ER DIA: ARMAR ANALISIS Y PREPARAR LOS RECURSOS.</li><li>2DO DIA: ARMAR Y PUBLIR CAMPAÑA.</li></ul><p><span style="background-color: rgb(255, 255, 0);">✓Nuestros costos NO incluyen IGV</span></p><p>✓A cargo de personal calificado&nbsp;</p><p>&nbsp;</p>'
        } else if (formatearContrato(request.data.codigo) == 'LPACPA') {
          descripcionEntrada =
            '<p><strong style="background-color: rgb(255, 255, 0);">Asesoría de Campaña pagada en Meta Business (Facebook - Instagram) - PLAN AVANZADO&nbsp;</strong></p><p><br></p><p><strong>Desarrollamos tu campaña pagada en Meta Business</strong></p><ul><li>Creación y configuración avanzada de la campaña publicitaria.</li><li>Selección y ajuste de objetivos de campaña específicos.</li><li>Configuración detallada de la segmentación de audiencia para maximizar el alcance y efectividad.</li></ul><p><strong>Aumenta tu presencia en Redes Sociales</strong></p><ul><li>Optimización avanzada de anuncios para una mayor visibilidad en Facebook e Instagram.</li><li>Estrategias avanzadas para mejorar la interacción con tus publicaciones y aumentar seguidores.</li></ul><p><strong>Respuesta a Potenciales Clientes</strong></p><ul><li>Configuración avanzada de respuestas automáticas y personalizadas a consultas de clientes.</li><li>Estrategias de engagement para convertir consultas en ventas.</li></ul><p><strong>Destaca ante tu competencia</strong></p><ul><li>Análisis detallado de competidores y estrategias para superarlos.</li><li>Desarrollo de contenido altamente atractivo y relevante para destacar.</li></ul><p><strong>Seguimiento de tu campaña</strong></p><ul><li>Monitoreo continuo del rendimiento de la campaña.</li><li>Informes con análisis detallado y recomendaciones.</li><li>Ajustes y optimizaciones en tiempo real para mejorar resultados.</li></ul><p><strong>Incluye Diseño de Post - Desarrollo de Reel</strong></p><ul><li>Diseño gráfico profesional para publicaciones altamente atractivas.</li><li>Creación y edición de Reels con estrategias para aumentar la visibilidad y engagement.</li></ul><p><br></p><p><br></p><p>✓TIEMPO DE TRABAJO : 7 DIAS HÁBILES .</p><ul><li>1ER DIA: ARMAR ANALISIS Y PREPARAR LOS RECURSOS.</li><li>2DO DIA: ARMAR Y PUBLIR CAMPAÑA.</li><li>5TO DIA: SEGUIMIENTO Y AJUSTES.</li><li>7MO DIA: EVALUCION DE RENDIMIENTO, DISCUCION DE RESULTADOS.</li></ul><p><span style="background-color: rgb(255, 255, 0);">✓ Nuestros costos NO incluyen IGV</span></p><p>✓A cargo de personal calificado</p>'
        } else if (formatearContrato(request.data.codigo) == 'LPACPG') {
          descripcionEntrada =
            '<p><strong style="background-color: rgb(255, 255, 0);">Asesoría de Campaña pagada en Meta Business (Facebook - Instagram) - PLAN GOLDEN</strong></p><p><br></p><p><strong>Desarrollamos tu campaña pagada en Meta Business</strong></p><ul><li>Creación y configuración avanzada de la campaña publicitaria.</li><li>Selección y ajuste de objetivos de campaña específicos.</li><li>Configuración detallada de la segmentación de audiencia para maximizar el alcance y efectividad.</li></ul><p><strong>Aumenta tu presencia en Redes Sociales</strong></p><ul><li>Optimización avanzada de anuncios para una mayor visibilidad en Facebook e Instagram.</li><li>Estrategias avanzadas para mejorar la interacción con tus publicaciones y aumentar seguidores.</li></ul><p><strong>Respuesta a Potenciales Clientes</strong></p><ul><li>Configuración avanzada de respuestas automáticas y personalizadas a consultas de clientes.</li><li>Estrategias de engagement para convertir consultas en ventas.</li></ul><p><strong>Destaca ante tu competencia</strong></p><ul><li>Análisis detallado de competidores y estrategias para superarlos.</li><li>Desarrollo de contenido altamente atractivo y relevante para destacar.</li></ul><p><strong>Seguimiento de tu campaña</strong></p><ul><li>Monitoreo continuo del rendimiento de la campaña.</li><li>Informes con análisis detallado y recomendaciones.</li><li>Ajustes y optimizaciones en tiempo real para mejorar resultados.</li></ul><p><strong>Incluye Diseño de Post - Desarrollo de Reel</strong></p><ul><li>Diseño gráfico profesional para publicaciones altamente atractivas.</li><li>Creación y edición de Reels con estrategias para aumentar la visibilidad y engagement.</li></ul><p><strong>Manejo de Pagos</strong></p><ul><li>Nos encargamos de todos los pagos relacionados con la campaña publicitaria en Meta Business.</li><li>Esto incluye la gestión y administración del presupuesto destinado a los anuncios.</li><li>Por este servicio, cobramos una comisión adicional del 10% sobre el monto total invertido en la campaña.</li><li>Este cargo cubre la conveniencia de centralizar todos los pagos a través de nuestro servicio, asegurando una gestión eficiente y sin complicaciones para nuestros clientes.</li></ul><p><br></p><p><br></p><p>✓TIEMPO DE TRABAJO : 7 DIAS HÁBILES .</p><ul><li>1ER DIA: ARMAR ANALISIS Y PREPARAR LOS RECURSOS.</li><li>2DO DIA: ARMAR Y PUBLIR CAMPAÑA.</li><li>5TO DIA: SEGUIMIENTO Y AJUSTES.</li><li>7MO DIA: EVALUCION DE RENDIMIENTO, DISCUCION DE RESULTADOS.</li></ul><p><span style="background-color: rgb(255, 255, 0);">✓ Nuestros costos NO incluyen IGV</span></p><p>✓A cargo de personal calificado</p><p>&nbsp;</p>'
        } else if (formatearContrato(request.data.codigo) == 'LPAREDESB') {
          descripcionEntrada =
            '<p><strong style="background-color: rgb(255, 255, 0);">PLAN BASICO</strong></p><p><br></p><ol><li>Enlazar Instagram con Facebook </li><li>Configuración de la información del perfil (Agregar teléfono, correo, web, redes sociales, horarios)</li><li>Conectar más números de WhatsApp</li><li>Administración de la fan page a más colaboradores</li><li>Planificador de publicaciones </li><li>Planificador de Historias</li><li>Estadísticas desde meta (Explicación para ver las métricas)&nbsp;</li></ol>'
        } else if (formatearContrato(request.data.codigo) == 'LPAREDESA') {
          descripcionEntrada =
            '<p><strong style="background-color: rgb(255, 255, 0);">PLAN AVANZADO</strong></p><p><br></p><ol><li>Enlazar Instagram con Facebook </li><li>Configuración de la información del perfil (Agregar teléfono, correo, web, redes sociales, horarios)</li><li>Conectar más números de WhatsApp</li><li>Administración de la fan page a más colaboradores</li><li>Planificador de publicaciones </li><li>Planificador de Historias</li><li>Estadísticas desde meta (Explicación para ver las métricas) </li><li>Mensajes automatizados </li><li>Configuración de TikTok a cuenta de empresa</li><li>Planificador de publicaciones en TikTok</li><li>Estadísticas desde suite de TikTok (Explicación para ver las métricas)&nbsp;</li></ol>'
        } else if (formatearContrato(request.data.codigo) == 'LPTVE') {
          descripcionEntrada =
            '<p><strong style="background-color: rgb(255, 255, 0);">&nbsp;DESARROLLO &amp; DISEÑO de TIENDA VIRTUAL - ECOMMERCE - Plan Express</strong></p><p><br></p><p>✓ Hasta 5 internas. Bajo Plantillas Pre determinadas (El cliente escoge una)&nbsp;</p><p>✓ Desarrollamos un Brief A MEDIDA</p><p>✓ Integración de Carrito de COMPRAS.</p><p>✓ EL COSTO POR LA INTEGRACIÓN DEL SERVICIO DE COMERCIO ELECTRÓNICO, ES ASUMIDO POR EL CLIENTE&nbsp;</p><p>✓ Pasarela de Pago: Mercado Pago:</p><p>- Medio de pago: Tarjetas de crédito – Visa, Mastercard, American express y Diners Club.</p><p>- Registro de pagos en el sistema de mercado pago y en el sistema de la tienda virtual.</p><p>✓ Trabajamos nuestra programación y Maquetación desde CERO&nbsp;</p><p>✓ Programación en PHP - Framework&nbsp;</p><p>✓ Base de Datos Myql&nbsp;</p><p>✓ Soporte hasta 100 productos&nbsp;</p><p>✓ Administración Dominio .com GRATIS x un AÑO</p><p>✓ Alojamiento Web 03 GB (Sin Cpanel Independiente) GRATIS x un AÑO</p><p>✓ NO Utilizamos plantillas o CMS Gratuitos de Internet</p><p>✓ WEB desarrollada desde CERO&nbsp;</p><p>✓ Formularios de Contacto Dinámico. MAIL de repuesta al visitante.</p><p>✓ Ubicación de la empresa o negocio a través de Google Maps.</p><p>✓ Seguridad Anti Spam</p><p>✓ Interacción con Redes Sociales.</p><p>✓ Podrá ADMINISTRAR Hasta 02 Internas.</p><p>✓ Creación de hasta 05 Correos Corporativos (Asesoria en su configuración)</p><p>✓ Entrega de acceso al administrador.</p><p>✓ Manual de Usuario.</p><p>✓ Capacitación del sistema (vía&nbsp;VIRTUAL).</p><p>✓ Soporte Técnico. Por 03 mes (Solo atendemos incidencias o fallas en nuestro servicio + (01) cambio textuales e imágenes).</p><p>✓ Técnica de Posicionamiento Web (SEO).</p><p>✓ Retoque Fotográfico de Hasta 15</p><p><br></p><p>EL CLIENTE NOS REMITE:</p><p>✓ Logotipo editable (PSD – Ai – CDR).</p><p>✓ Fotos e imágenes en buena resolución.</p><p>✓ Entrega de datos de contacto</p>'
        } else if (formatearContrato(request.data.codigo) == 'LPTVS') {
          descripcionEntrada =
            '<p><strong style="background-color: rgb(255, 255, 0);">&nbsp;DESARROLLO &amp; DISEÑO de TIENDA VIRTUAL - ECOMMERCE - Plan SILVER</strong></p><p><br></p><p>✓ Hasta 06 internas. Bajo Plantillas Pre determinadas (El cliente escoge una)&nbsp;</p><p>✓ Desarrollamos un Brief A MEDIDA</p><p>✓ Integración de Carrito de COMPRAS.</p><p>✓ EL COSTO POR LA INTEGRACIÓN DEL SERVICIO DE COMERCIO ELECTRÓNICO, ES ASUMIDO POR EL CLIENTE&nbsp;</p><p>✓ Pasarela de Pago: Mercado Pago:</p><p>- Medio de pago: Tarjetas de crédito – Visa, Mastercard, American express y Diners Club.</p><p>- Registro de pagos en el sistema de mercado pago y en el sistema de la tienda virtual.</p><p>✓ Trabajamos nuestra programación y Maquetación desde CERO&nbsp;</p><p>✓ Programación en PHP - Framework&nbsp;</p><p>✓ Base de Datos Myql&nbsp;</p><p>✓ Soporte hasta 300 productos&nbsp;</p><p>✓ Administración Dominio .com GRATIS x un AÑO</p><p>✓ Alojamiento Web de Hasta 08 GB (Sin Cpanel Independiente) GRATIS x un AÑO</p><p>✓ NO Utilizamos plantillas o CMS Gratuitos de Internet</p><p>✓ WEB desarrollada desde CERO&nbsp;</p><p>✓ Formularios de Contacto Dinámico. MAIL de repuesta al visitante.</p><p>✓ Ubicación de la empresa o negocio a través de Google Maps.</p><p>✓ Seguridad Anti Spam</p><p>✓ Interacción con Redes Sociales.</p><p>✓ Podrá ADMINISTRAR Hasta 03 Internas.</p><p>✓ Creación de hasta 10 Correos Corporativos (Asesoria en su configuración)</p><p>✓ Entrega de acceso al administrador.</p><p>✓ Manual de Usuario.</p><p>✓ Capacitación del sistema (vía&nbsp;VIRTUAL).</p><p>✓ Soporte Técnico. Por 03 mes (Solo atendemos incidencias o fallas en nuestro servicio + (01) cambio textuales e imágenes).</p><p>✓ Técnica de Posicionamiento Web (SEO).</p><p>✓ Retoque Fotográfico de Hasta 15</p><p><br></p><p>EL CLIENTE NOS REMITE:</p><p>✓ Logotipo editable (PSD – Ai – CDR).</p><p>✓ Fotos e imágenes en buena resolución.</p><p>✓ Entrega de datos de contacto</p>'
        } else if (formatearContrato(request.data.codigo) == 'LPTVG') {
          descripcionEntrada =
            '<p><strong style="background-color: rgb(255, 255, 0);">DESARROLLO &amp; DISEÑO de TIENDA VIRTUAL - ECOMMERCE - Plan GOLDEN</strong></p><p><br></p><p>✓ Hasta 8 internas. A medida del cliente - Remite su ejemplo</p><p>✓ Desarrollamos un Brief A MEDIDA</p><p>✓ Integración de Carrito de COMPRAS.</p><p>✓ EL COSTO POR LA INTEGRACIÓN DEL SERVICIO DE COMERCIO ELECTRÓNICO, ES ASUMIDO POR EL CLIENTE&nbsp;</p><p>✓ Pasarela de Pago: CULQUI -&nbsp;IZI PAY:</p><p>- Medio de pago: Tarjetas de crédito, yape, plin, tunki, pago efectivo, cuatalo.</p><p>- Registro de pagos en el sistema de Culqui/iziPay y en el sistema de la tienda virtual.</p><p>- Mail de notificación al cliente automático.</p><p>- Mail de notificación al Gmail del negocio.</p><p>- Comprobante de pagos.</p><p>- Registro de datos del usuario.</p><p><br></p><p>✓ Trabajamos nuestra programación y Maquetación desde CERO&nbsp;</p><p>✓ Programación en PHP - Framework&nbsp;</p><p>✓ Base de Datos Myql&nbsp;</p><p>✓ Soporte Ilimtados de productos&nbsp;</p><p>✓ Administración Dominio .com GRATIS x un AÑO</p><p>✓ Alojamiento Web hasta 20 GB (Cpanel Independiente) GRATIS x un AÑO</p><p>✓ NO Utilizamos plantillas o CMS Gratuitos de Internet</p><p>✓ WEB desarrollada desde CERO&nbsp;</p><p>✓ Formularios de Contacto Dinámico. MAIL de repuesta al visitante.</p><p>✓ Ubicación de la empresa o negocio a través de Google Maps.</p><p>✓ Seguridad Anti Spam</p><p>✓ Interacción con Redes Sociales.</p><p>✓ Podrá ADMINISTRAR Hasta 4 Internas.</p><p>✓ Creación de hasta 15 Correos Corporativos (Asesoria en su configuración)</p><p>✓ Indexación del CERTIFICADO SSL</p><p>✓ Entrega de acceso al administrador.</p><p>✓ Manual de Usuario.</p><p>✓ Capacitación del sistema (vía&nbsp;VIRTUAL).</p><p>✓ Soporte Técnico. Por 06 mes (Solo atendemos incidencias o fallas en nuestro servicio + (01) cambio textuales e imágenes).</p><p>✓ Técnica de Posicionamiento Web (SEO).</p><p>ALTA DE GOOGLE - TIENDA VIRTUAL :</p><p>✓ Propiedad Verificada</p><p>✓ Inicio de SEO, trabajo con Palabras claves, Script y otras técnicas de Posicionamiento</p><p>✓ Ubicación del negocio en Google MAP</p><p>✓ Retoque Fotográfico de Hasta 30</p><p><br></p><p>EL CLIENTE NOS REMITE:</p><p>✓ Logotipo editable (PSD – Ai – CDR).</p><p>✓ Fotos e imágenes en buena resolución.</p><p>✓ Entrega de datos de contacto</p>'
        } else if (formatearContrato(request.data.codigo) == 'LPCONC') {
          descripcionEntrada =
            '<p><strong style="background-color: rgb(255, 255, 0);">Configuración remota para configuración de correos&nbsp;</strong></p><ul><li>1 pc o laptop&nbsp;</li><li>Incluye asesoría y Manual de uso</li></ul>'
        } else if (formatearContrato(request.data.codigo) == 'LPACTW') {
          descripcionEntrada =
            '<p><strong style="background-color: rgb(255, 255, 0);">Mantenimiento o Actualización web</strong></p><ul><li>Textos</li><li>Imagenes</li><li>Google Maps</li><li>Teléfono</li><li>Dirección</li></ul>'
        } else if (formatearContrato(request.data.codigo) == 'LPACTWE') {
          descripcionEntrada =
            '<p><strong style="background-color: rgb(255, 255, 0);">Mantenimiento o Rediseño de la estructura web</strong></p><ul><li>Coordinación con el cliente</li><li>Eliminación o creación de internas</li><li>Cambio de formularios de contacto</li><li>Mejora del sistema administrador</li><li>Optimización de rendimiento</li><li>Actualización de tecnologías</li><li>Corrección de errores en responsive</li><li>Mejoras en UX/UI</li></ul>'
        } else if (formatearContrato(request.data.codigo) == 'LPCPPB') {
          descripcionEntrada =
            '<p><strong>Presentación de las pasarelas de pago:</strong></p><ul><li>Descripción general de las pasarelas de pago, destacando sus características principales y beneficios.</li><li>Demostración de la interfaz de usuario genérica y las secciones clave que suelen estar presentes en las pasarelas de pago.</li></ul><p><br></p><p><strong>Creación de cuenta y configuración inicial:</strong></p><ul><li>Guía paso a paso para crear una cuenta en una pasarela de pago genérica, incluyendo la verificación de datos y la configuración inicial.</li><li>Configuración de métodos de pago, opciones de seguridad y otros ajustes básicos que son comunes en las pasarelas de pago.</li></ul><p><br></p><p><strong>Generación de links de pago:</strong></p><ul><li>Explicación detallada sobre cómo generar un link de pago en una pasarela de pago genérica para recibir pagos de clientes.</li><li>Demostración de las opciones de personalización disponibles para los links de pago, como descripción, monto, moneda, etc.</li></ul><p><br></p><p><strong>Proceso de pago y confirmación de transacciones:</strong></p><ul><li>Demostración del proceso completo de pago desde el envío del link de pago al cliente hasta la confirmación de la transacción.</li><li>Explicación de los diferentes métodos de pago aceptados por las pasarelas de pago genéricas y cómo funcionan en el proceso de pago.</li></ul>'
        } else if (formatearContrato(request.data.codigo) == 'LPCPPM') {
          descripcionEntrada =
            '<p>&nbsp;<strong>Presentación de las pasarelas de pago:</strong></p><ul><li>Descripción general de las pasarelas de pago, destacando sus características principales y beneficios.</li><li>Demostración de la interfaz de usuario genérica y las secciones clave que suelen estar presentes en las pasarelas de pago.</li></ul><p><br></p><p><strong>Creación de cuenta y configuración inicial:</strong></p><ul><li>Guía paso a paso para crear una cuenta en una pasarela de pago genérica, incluyendo la verificación de datos y la configuración inicial.</li><li>Configuración de métodos de pago, opciones de seguridad y otros ajustes básicos que son comunes en las pasarelas de pago.</li></ul><p><br></p><p><strong>Generación de links de pago:</strong></p><ul><li>Explicación detallada sobre cómo generar un link de pago en una pasarela de pago genérica para recibir pagos de clientes.</li><li>Demostración de las opciones de personalización disponibles para los links de pago, como descripción, monto, moneda, etc.</li></ul><p><br></p><p><strong>Proceso de pago y confirmación de transacciones:</strong></p><ul><li>Demostración del proceso completo de pago desde el envío del link de pago al cliente hasta la confirmación de la transacción.</li><li>Explicación de los diferentes métodos de pago aceptados por las pasarelas de pago genéricas y cómo funcionan en el proceso de pago.</li></ul><p><br></p><p><strong>Comisiones:</strong></p><ul><li>Explicación de los conceptos generales sobre las comisiones aplicadas en las transacciones por las pasarelas de pago y cómo se calculan de manera estándar</li></ul><p><br></p><p><strong>Creación y gestión de usuarios:</strong></p><ul><li>Guía sobre cómo crear y gestionar usuarios en la plataforma de pago, incluyendo la asignación de roles y permisos.</li><li>Demostración de las herramientas disponibles para la gestión eficiente de usuarios en la plataforma.</li></ul><p><br></p><p><strong>Seguimiento y análisis de transacciones:</strong></p><ul><li>Explicación detallada sobre cómo realizar un seguimiento adecuado de las transacciones realizadas por los usuarios.</li><li>Análisis de las métricas clave relacionadas con las transacciones, como volumen de ventas, tasas de conversión, etc.</li></ul><p><br></p><p><strong>Análisis de reporte de ventas:</strong></p><ul><li>Introducción al análisis de reportes de ventas para evaluar el desempeño de las transacciones y la plataforma en general.</li><li>Interpretación de los datos del reporte para identificar tendencias, oportunidades de mejora y áreas de enfoque para optimizar el proceso de ventas.</li></ul>'
        } else if (formatearContrato(request.data.codigo) == 'LPIPP') {
          descripcionEntrada =
            '<p><strong style="background-color: rgb(255, 255, 0);">&nbsp;Implementación de pasarela de pagos</strong></p><ul><li>EL COSTO POR LA INTEGRACIÓN DEL SERVICIO DE COMERCIO ELECTRÓNICO, ES ASUMIDO POR EL CLIENTE&nbsp;</li><li>Pasarela de Pago: CULQUI -&nbsp;IZI PAY - MERCADO PAGO - STRIPE </li><li>Medio de pago: Tarjetas de crédito, yape, plin, tunki, pago efectivo.</li><li>Registro de pagos en el sistema de la pasarela y de la tienda virtual.</li><li>Mail de notificación al cliente automático.</li><li>Mail de notificación al Gmail del negocio.</li><li>Comprobante de pagos.</li><li>Registro de datos del usuario.</li></ul>'
        } else if (formatearContrato(request.data.codigo) == 'LPMGDOM') {
          descripcionEntrada =
            '<p><strong style="background-color: rgb(255, 255, 0);">&nbsp;Migración de dominio</strong></p><ul><li>Cambio de administrador de dominio bajo acuerdos con el cliente</li><li>El cliente nos remite credenciales y datos para su migración</li></ul>'
        } else if (formatearContrato(request.data.codigo) == 'LPSID') {
          descripcionEntrada =
            '<ul><li>Impresiones&nbsp;varias - Papel Couche 250 gr</li></ul>'
        } else if (formatearContrato(request.data.codigo) == 'LPTIKTOKADS') {
          descripcionEntrada =
            '<p><strong style="background-color: rgb(255, 255, 0);">TIKTOK ADS</strong></p><p><br></p><p><strong>Introducción a la Capacitación</strong></p><ul><li>Objetivos y estructura de la sesión.</li></ul><p><strong>Exploración de la Interfaz de TikTok Ads</strong></p><ul><li>Panel de control.</li><li>Menús y opciones principales.</li><li>Herramientas de análisis y seguimiento.</li></ul><p><strong>Configuración de la Campaña Publicitaria</strong></p><ul><li>Identificación del objetivo del anuncio.</li><li>Selección del tipo de campaña.</li><li>Configuración de presupuesto y segmentación.</li><li>Configuración de públicos objetivo.</li></ul><p><strong>Creación y Publicación del Anuncio</strong></p><ul><li>Revisión del anuncio.</li><li>Publicación en tiempo real.</li></ul><p><strong>Conclusión y Preguntas</strong></p><ul><li>Resumen y espacio para preguntas.</li></ul>'
        } else if (formatearContrato(request.data.codigo) == 'LPS') {
          descripcionEntrada =
            '<p><strong style="background-color: rgb(255, 255, 0);">DISEÑO DE 01 LOGO :</strong></p><ul><li>Brief o Cuestionario de la empresa. (Se realizará un Análisis previo antes de la construcción del Logotipo)</li><li>Hasta 03 Propuestas de LOGO - Hasta 3 cambios DEL LOGO ESCOGIDO</li><li>Análisis del Brief para la construcción del Logo</li><li>Coordinación directa, con el cliente para el desarrollo del Brief o cuestionario.</li><li>Entregables: Editables AI + JPG + PNG + PDF</li></ul><p><br></p><p><span style="background-color: rgb(255, 255, 0);">IDENTIDAD VISUAL (01) PROPUESTA DE CADA UNO</span></p><p><br></p><ul><li>01 DISEÑO DE Tarjeta de Presentación</li><li>01 DISEÑO DE HOJA MEMBRETADA</li><li>01 DISEÑO DE PORTADA PARA FACEBOOK</li><li>01 DISEÑO DE PERFIL PARA FACEBOOK - INSTAGRAM - WSP - TIKTOK</li><li>ASESORIA EN CREACIÓN DE REDES - OPCIONAL</li></ul>'
        } else if (formatearContrato(request.data.codigo) == 'LPC') {
          descripcionEntrada =
            '<p><strong style="background-color: rgb(255, 255, 0);">&nbsp;PLAN CREATIVO - DISEÑO o Rediseño DE LOGO</strong></p><ul><li>Recibirás 04 propuesta CREATIVAS de diseño de logo sustentadas.</li><li>Envío de brief o cuestionario por mail – WhatsApp.</li><li>Análisis del Brief o cuestionario técnico para la construcción del Logotipo.</li><li>Coordinación directa, con el cliente para el desarrollo del Brief o cuestionario.</li></ul><p><br></p><p>ENTREGABLES :&nbsp;</p><ul><li>Adobe Ilustrator: Programa original de diseño y donde se elabora las propuestas del logo.</li><li>PDF: Lo podrá abrir en cualquier programa de Adobe o Corel Draw.</li><li>JPG: Imagen (con fondo blanco)</li><li>PNG: Transparencia (sin fondo</li></ul><p><br></p><p>MANUAL DE DISEÑO DE LOGO:</p><ul><li>Elementos que lo conforman:</li><li>Definición de Colores corporativos.</li><li>Composición y Construcción del Logo.</li><li>Normas para el buen uso del Diseño Logo.</li></ul><p><br></p><p>DISEÑO DE&nbsp;BROCHURE: Versión DIGITAL - IMPRESIÓN.&nbsp;</p><p>Descripción:</p><ul><li>01 Diseño de brochure de hasta 2 hojas (4 caras)&nbsp;</li><li>Hasta 02 Modificaciones</li><li>Formato de entrega:</li><li>PDF: Formato de impresión o digital</li><li>Adobe Ilustrator.</li><li>JPG: Imagen.&nbsp;Medidas: según indique el cliente&nbsp;</li></ul><p><br></p><p>IDENTIDAD VISUAL CORPORATIVA. (01 PROPUESTA DE CADA UNO)&nbsp;</p><ul><li>01 Diseño de Hoja Membretada 01 Diseño de Tarjeta Presentación. (1 Nombre)</li><li>01 Diseño de Firma para correo (1 Nombre)</li><li>01 Diseño de Flyer Digital PARA POST (cliente nos remite sus tema)</li><li><br></li></ul><p>OBSEQUIO&nbsp;:</p><ul><li>Logo para usar como marca de agua.</li></ul>'
        } else if (formatearContrato(request.data.codigo) == 'LPP') {
          descripcionEntrada =
            '<p><strong>&nbsp;PLAN PROFESIONAL - DISEÑO DE LOGO&nbsp;</strong></p><p>• Recibirás 05 propuesta PROFESIONALES de diseño de logo sustentadas.</p><p>• Hasta 03 Modificaciones</p><p>• Envío de brief o cuestionario por mail – WhatsApp.</p><p>• Coordinación directa, con el cliente para el desarrollo del Brief o cuestionario.</p><p><br></p><p>ENTREGABLES :&nbsp;</p><p>• Adobe Ilustrator: Programa original de diseño y donde se elabora las propuestas del logo.</p><p>• PDF: Lo podrá abrir en cualquier programa de Adobe o Corel Draw.</p><p>• JPG: Imagen (con fondo blanco)</p><p>• PNG: Transparencia (sin fondo)</p><p><br></p><p>MANUAL DE DISEÑO DE LOGO:</p><p>Elementos que lo conforman:</p><p>• Definición de Colores corporativos.</p><p>• Composición y Construcción del Logo.</p><p>• Normas para el buen uso del Diseño Logo.</p><p><br></p><p>DISEÑO DE BROCHURE: Versión DIGITAL - IMPRESIÓN.&nbsp;</p><p>Descripción:</p><p>• 01 Diseño de brochure de hasta 3 hojas (6 caras)</p><p>• Hasta 02 Modificaciones</p><p>Formato de entrega:</p><p>• PDF: Formato de impresión o digital Adobe Ilustrator.</p><p>• JPG: Imagen.&nbsp;Medidas: según indique el cliente&nbsp;</p><p><br></p><p>IDENTIDAD VISUAL CORPORATIVA. (01 PROPUESTAS DE CADA UNA)</p><p>• 01 Diseño de Hoja Membretada</p><p>• 01 Diseño de Folder</p><p>• 01 Diseño de Sobre</p><p>• 01 Diseño de Tarjeta Presentación. (Max. 02 Nombres)</p><p>• 01 Diseño de Firma para correo (Max. 02 Nombres)</p><p>• 01 Diseño de Banner o Letrero Publicitario</p><p>• 01 Diseño de Fotocheck (Max. 05 Nombres)&nbsp;</p><p>• 01 Diseño de Uniforme (Polo - Camisa - Gorro - Chaleco)&nbsp;</p><p><br></p><p>REDES SOCIALES&nbsp;</p><p>• 01 Diseño de portada Facebook - WSP Bussines&nbsp;</p><p>• 01 Diseño de Perfil (Fan Page - WSP - Instagram - Tiktok)</p><p>• 02 Diseños de Flyers o Post - cliente nos remite los temas&nbsp;&nbsp;</p><p>• Asesoria en creación de Redes (Opcional)</p><p><br></p><p>IMPRESIÓN DE TARJETA DE PRESENTACIÓN:</p><p>Descripción:</p><p>• 1 millar x 1 nombre.&nbsp;</p><p>• Tamaño: 9 x 5.5 cm.</p><p>• Material: Papel couché de 250gr. Mate o brillante (a elección del cliente).</p><p>• Envío Lima: Gratis&nbsp;&nbsp;</p><p>• Envío Provincia: Servicio de COLLECT</p>'
        }
        setValues({
          ...values,
          id_contrato: request.data.codigo,
          descripcion: descripcionEntrada,
          descripcionPago
        })
      } else {
        toast.error('Error al generar correlativo')
      }
    } catch (error) {
      console.log(error)
      toast.error('Error al generar correlativo')
    }
    seLoadingValidation(false)
  }

  const {
    handleSubmit,
    handleChange,
    setValues,
    resetForm,
    errors,
    values,
    touched,
    handleBlur
  } = useFormik({
    initialValues: {
      id: 0,
      medio_ingreso: '',
      nombre_empresa: '',
      plan: '',
      id_contrato: '',
      dni_ruc: '',
      id_cliente: '',
      nombre_cliente: '',
      descripcion: '',
      descripcionPago: ''
    },
    validationSchema: SchemaValidarVentas,
    onSubmit: generarVenta
  })

  useEffect(() => {
    setValues({
      ...values,
      id: datos?.id,
      medio_ingreso: datos?.medio_ingreso,
      nombre_empresa: datos?.nombre_empresa,
      plan: datos?.plan,
      id_contrato: datos?.id_contrato,
      dni_ruc: datos?.dni_ruc,
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      nombre_cliente: datos?.nombre_cliente,
      id_cliente: datos?.id_cliente,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      descripcion: datos?.descripcion ?? '',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      precio: datos?.precio ?? '',
      // @ts-expect-error
      sexo: datos?.sexo
    })
    setarrayConacto(
      datos?.arraycontacto ? JSON.parse(datos?.arraycontacto) : []
    )
  }, [open])
  const [search, setSearch] = useState('')

  const filterDate = (): any[] => {
    let filteredProductos = planes

    // Aplicar filtro según el tipo seleccionado
    const searchTerm = quitarAcentos(search.toLowerCase())
    if (search.length > 0) {
      filteredProductos = filteredProductos.filter((pro) => {
        const fullName = `${pro.nombre}`.toLowerCase()
        return quitarAcentos(fullName).includes(searchTerm)
      })
    }
    return filteredProductos
  }

  const onSeachChange = ({
    target
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setSearch(target.value)
  }

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        scroll="body"
        maxWidth={'xl'}
        aria-describedby="alert-dialog-slide-description"
        className="w-screen p-0 m-0 modal_dialog_correlativo"
      >
        <section
          className={`grid ${
            pdfUrl ? 'grid-cols-1 md:grid-cols-2' : 'grid-cols-1'
          }  `}
        >
          {values.id_contrato ? (
            <ModalContratos
              datos={values}
              setPdfUrl={setPdfUrl}
              pdfUrl={pdfUrl}
              setLoading={setLoading}
              loading={loading}
              personContact={personContact}
            />
          ) : (
            <div className="w-full">
              <DialogTitle className="text-center">
                {'CREAR CONTRATO'}
              </DialogTitle>
              <DialogContent
                className={cn(
                  'w-full max-h-[500px] p-0',
                  abrirPlan ? 'md:w-[850px]' : 'md:w-96 '
                )}
              >
                <DialogContentText
                  id="alert-dialog-slide-description"
                  className="w-full p-0 m-0"
                >
                  {loadingValidacion ? (
                    <LoadingSmall />
                  ) : (
                    <form
                      className="flex h-full  min-h-[490px] flex-col gap-5 w-full justify-between"
                      onSubmit={handleSubmit}
                    >
                      {!abrirPlan ? (
                        <>
                          <div className="w-full  lg:relative pt-5">
                            <TitleBriefs titulo=" Nombres/Empresa" />
                            <select
                              className="border placeholder-gray-400 max-w-full focus:outline-none overflow-hidden
                                                focus:border-black w-full pr-4 h-12 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                border-gray-300 rounded-md transition-all outline-none"
                              name="nombre_empresa"
                              value={values.nombre_empresa}
                              onChange={(e) => {
                                if (arrayContacto && arrayContacto.length > 0) {
                                  const selectedContact = arrayContacto.find(
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-expect-error
                                    (contacto: ListcontactoClientes) =>
                                      contacto.marca == e.target.value
                                  )
                                  setpersonContact(
                                    selectedContact
                                      ? {
                                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                          // @ts-expect-error
                                          id: selectedContact.id,
                                          nombre: `${selectedContact.nombres}`,
                                          tipo_documento:
                                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                            // @ts-expect-error
                                            selectedContact.tipo_documento,
                                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                          // @ts-expect-error
                                          dni_ruc: selectedContact.dni_ruc
                                        }
                                      : null
                                  )
                                }
                                handleChange(e)
                              }}
                              onBlur={handleBlur}
                              disabled={false}
                            >
                              <option value="">----SELECCIONAR ----</option>
                              {datos?.nombre_empresa && (
                                <option value={datos?.nombre_empresa}>
                                  {datos?.nombre_empresa}
                                </option>
                              )}
                              {datos?.nombre_cliente && (
                                <option value={datos?.nombre_cliente}>
                                  {datos?.nombre_cliente}
                                </option>
                              )}
                              {arrayContacto &&
                                arrayContacto.length > 0 &&
                                arrayContacto.map(
                                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                  // @ts-expect-error
                                  (contacto: ListcontactoClientes) => (
                                    <option
                                      value={contacto.marca}
                                      key={contacto.id}
                                    >
                                      {contacto.marca}
                                    </option>
                                  )
                                )}
                            </select>
                            <Errors
                              errors={errors.nombre_empresa}
                              touched={touched.nombre_empresa}
                            />
                          </div>
                          <div className="w-full  lg:relative mt-2">
                            <TitleBriefs titulo="Medio de ingreso" />
                            <select
                              className="border placeholder-gray-400 focus:outline-none
                                                                                focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                                                border-gray-300 rounded-md transition-all"
                              name="medio_ingreso"
                              value={values.medio_ingreso}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
                              {/* FB GOOGLE, VENTAS, POST VENTA, RECOMENDACION, ISNTAGRAM) */}
                              <option value="">Seleccionar</option>
                              <option value="0">Facebook</option>
                              <option value="4">Whatsapp</option>
                              <option value="1">Google</option>
                              <option value="5">Instagram</option>
                              {/* <option value="2">Ventas</option> */}
                              <option value="3">Post Venta</option>
                              <option value="6">Recomendación</option>
                              <option value="7">Logos</option>
                            </select>
                            <Errors
                              errors={errors.medio_ingreso}
                              touched={touched.medio_ingreso}
                            />
                          </div>
                          <div className="w-full  lg:relative mt-2">
                            <TitleBriefs titulo=" DNI/RUC (Opcional)" />
                            <input
                              className="border placeholder-gray-400 focus:outline-none
                                                focus:border-black w-full pr-4 h-12 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                border-gray-300 rounded-md transition-all"
                              name="dni_ruc"
                              type="text"
                              value={values.dni_ruc}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              disabled={false}
                            />
                            <Errors
                              errors={errors.dni_ruc}
                              touched={touched.dni_ruc}
                            />
                          </div>
                          <div className="w-full  lg:relative mt-2">
                            <TitleBriefs titulo="Plan" />
                            <button
                              className="border placeholder-gray-400 focus:outline-none
                                                                                focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                                                border-gray-300 rounded-md transition-all"
                              onClick={() => {
                                if (
                                  values.medio_ingreso &&
                                  values.nombre_empresa &&
                                  values.dni_ruc
                                ) {
                                  setAbrirPlan(true)
                                } else {
                                  toast.warning('Complete todos los datos')
                                }
                              }}
                            >
                              {values.plan ? values.plan : 'Seleccionar'}
                            </button>
                            {/* <Errors errors={errors.plan} touched={touched.plan} /> */}
                          </div>
                        </>
                      ) : (
                        <div className="w-full lg:relative mt-2 ">
                          {/* <TitleBriefs titulo="Seleecionar plan" /> */}
                          <button className="bg-gray-200 w-full md:w-full flex items-center text-black gap-2 py-2 px-4 rounded-lg hover:text-main transition-colors">
                            <RiFilter2Fill />
                            <input
                              placeholder="BUSCAR PLAN..."
                              className="bg-transparent outline-none"
                              value={search}
                              onChange={onSeachChange}
                              type="search"
                            />
                          </button>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2 items-center mb-0 p-4 cursor-pointer">
                            {filterDate().map((plan) => (
                              <p
                                key={plan.id}
                                className="line-clamp-2 text-black text-center w-full border-2 py-1 rounded-xl"
                                onClick={() => {
                                  generarCodigo(plan.codigo)
                                }}
                              >
                                {plan.nombre}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                      <div className="flex w-full justify-end gap-3 rounded-md text-black ">
                        <Link
                          to="#"
                          className="bg-red-600 px-3 py-2 rounded-md text-white cursor-pointer"
                          onClick={() => {
                            handleClose()
                            limpiar()
                            setAbrirPlan(false)
                          }}
                        >
                          Cancelar
                        </Link>
                      </div>
                    </form>
                  )}
                </DialogContentText>
              </DialogContent>
            </div>
          )}
          <div className="w-full h-full relative">
            {loading && pdfUrl ? (
              <Loading />
            ) : (
              !loading &&
              pdfUrl && (
                <>
                  <iframe
                    src={pdfUrl}
                    title="PDF Viewer"
                    className="w-full h-full border-none hidden md:block"
                  />
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="md:hidden block w-full text-center py-3 uppercase underline text-main_dark font-bold"
                  >
                    Abrir PDF
                  </a>
                </>
              )
            )}
          </div>
        </section>
      </Dialog>
    </>
  )
}
