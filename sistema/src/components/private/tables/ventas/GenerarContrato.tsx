/* eslint-disable multiline-ternary */
import { useFormik } from 'formik'
import { SchemaContrato } from '../../../shared/schemas/Schemas'
import { type VluesContrato } from '../../../shared/schemas/Interfaces'
import { Global } from '../../../../helper/Global'
import axios from 'axios'
import { useEffect, useState } from 'react'
import useAuth from '../../../../hooks/useAuth'
import { Loading } from '../../../shared/Loading'
import { useNavigate, useParams } from 'react-router-dom'
import { AiOutlineFilePdf } from 'react-icons/ai'
import { convertirNumeroALetras } from '../../../shared/functions/GenerarTextoEnLetras'
import { getContenido } from '../../../shared/functions/contenidoToContrato'
import { SubirContrato } from '../../../shared/modals/SubirContrato'
import { Errors2 } from '../../../shared/Errors2'
import EditorPdfAltas from '../../../shared/modals/EditorPdfAltas'
import { toast } from 'sonner'
import { cn } from '../../../shared/cn'
import { v4 as uuidv4 } from 'uuid'
import Swal from 'sweetalert2'

export const GenerarContrato = (): JSX.Element => {
  const { setTitle } = useAuth()
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const [contenido, setContenido] = useState('')
  const [formaPago, setFormaPago] = useState('')
  const [openPDF, setOpenPDF] = useState(false)
  const [pdfUrl, setPdfUrl] = useState<any | null>(null)
  const navigate = useNavigate()

  const formatearContrato = (cadena: string): string => {
    const partes = cadena.split('_')
    return partes[0]
  }

  const formatearContrato2 = (cadena: string): string => {
    const numeros = cadena.match(/\d+/g)

    if (numeros && numeros.length >= 2) {
      const numero1 = numeros[0]
      const numero2 = numeros[1]
      const textoFormateado = `${numero1} - ${numero2}`
      return textoFormateado
    } else {
      return cadena
    }
  }

  const generarFecha = (): string => {
    const meses: string[] = [
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

    const fechaActual: Date = new Date()
    const dia: number = fechaActual.getDate()
    const mes: number = fechaActual.getMonth() // Los meses comienzan desde 0
    const año: number = fechaActual.getFullYear()
    const formatearDia = (numero: number): string => {
      return numero < 10 ? `0${numero}` : `${numero}`
    }

    return `${formatearDia(dia)} de ${meses[mes]} del ${año}`
  }

  const SaveContrato = async (values: VluesContrato): Promise<void> => {
    if (contenido) {
      setLoading(true)
      const data = new FormData()
      data.append('nombres_cliente', values?.nombres_cliente)
      data.append('titulo_contrato', values.titulo_contrato)
      data.append('id_contrato', values?.id_contrato)
      data.append('tipo_documento', values.tipo_documento)
      data.append('dni_ruc', values.tipo_documento)
      if (values.tipo_documento == 'DNI') {
        data.append(
          'sexo',
          values.sexo == 'hombre'
            ? 'Sr.'
            : values.sexo == 'mujer'
              ? 'la Sra.'
              : ''
        )
      } else {
        data.append(
          'sexo',
          values.sexo == 'hombre' ? '' : values.sexo == 'mujer' ? '' : ''
        )
      }
      data.append('dni_cliente', values.dni_cliente)
      data.append('codigo', formatearContrato2(values?.id_contrato))
      data.append('codigo1', formatearContrato(values?.id_contrato))
      data.append('servicio', values.servicio)
      data.append('forma_pago', formaPago)
      if (typeof values.precio == 'number') {
        data.append('precio', values.precio.toFixed(2))
      } else {
        data.append('precio', values.precio)
      }
      data.append('fecha', values.fecha)
      data.append(
        'preciotexto',
        convertirNumeroALetras(values.precio).toLowerCase()
      )
      data.append('tiempo', values.tiempo)
      data.append('primero', values.primero)
      data.append('contenido', contenido)
      data.append('_method', 'PUT')

      try {
        const response = await axios.post(
          `${Global.url}/generarContratoPDF`,
          data,
          {
            headers: {
              Authorization: `Bearer ${
                token !== null && token !== '' ? token : ''
              }`
            },
            responseType: 'blob'
          }
        )
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' })
        const pdfUrl = window.URL.createObjectURL(pdfBlob)
        setPdfUrl(pdfUrl) // Guarda la URL del PDF en el estado para mostrarlo en el componente
        toast.success('PDF generado')
      } catch (error) {
        toast.error('Error al generar el PDF')
      } finally {
        setLoading(false)
      }
    } else {
      toast.warning('Por favor coloque el contenido')
    }
  }

  const saveCotizacion = async (): Promise<string | undefined> => {
    try {
      const data = new FormData()
      data.append('correlativo', uuidv4())
      data.append('id_cliente', values.id_cliente)
      data.append('descripcion', 'No descripcion')
      data.append('precio', '0')
      data.append('descuento', '0')
      data.append('pdf', 'sinpdf')
      const request = await axios.post(
        `${Global.url}/registrarCotizacionNone`,
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
        return request.data.id_cotizacion
      }
    } catch (error: any) {
      console.log(error)
    }
  }

  const SaveContrato2 = async (): Promise<void> => {
    if (contenido) {
      setLoading(true)
      const idCotizacion = await saveCotizacion()
      const data = new FormData()
      data.append('id_cotizacion', idCotizacion ?? '')
      data.append('correlativo', values?.id_contrato)
      data.append('medio_ingreso', values?.medio_ingreso)
      data.append('nombres_cliente', values?.nombres_cliente)
      data.append('titulo_contrato', values.titulo_contrato)
      data.append('id_contrato', values?.id_contrato)
      data.append('tipo_documento', values.tipo_documento)
      //   data.append('dni_ruc', values.tipo_documento)
      if (values.tipo_documento == 'DNI') {
        data.append(
          'sexo',
          values.sexo == 'hombre'
            ? 'Sr.'
            : values.sexo == 'mujer'
              ? 'la Sra.'
              : ''
        )
      } else {
        data.append(
          'sexo',
          values.sexo == 'hombre' ? '' : values.sexo == 'mujer' ? '' : ''
        )
      }
      data.append('dni_cliente', values.dni_cliente)
      data.append('codigo', formatearContrato2(values?.id_contrato))
      data.append('codigo1', formatearContrato(values?.id_contrato))
      data.append('servicio', values.servicio)
      data.append('forma_pago', formaPago)
      if (typeof values.precio == 'number') {
        data.append('precio', values.precio.toFixed(2))
      } else {
        data.append('precio', values.precio)
      }
      data.append('fecha', values.fecha)
      data.append(
        'preciotexto',
        convertirNumeroALetras(values.precio).toLowerCase()
      )
      data.append('tiempo', values.tiempo)
      data.append('primero', values.primero)
      data.append('contenido', contenido)

      try {
        const response = await axios.post(
          `${Global.url}/SaveContratoPDF`,
          data,
          {
            headers: {
              Authorization: `Bearer ${
                token !== null && token !== '' ? token : ''
              }`
            }
          }
        )
        if (response.data.status == 'success') {
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          Swal.fire(`${response.data.codigo}`, '', 'success')
          const data2 = new FormData()
          data2.append('idreal_contrato', idCotizacion ?? '')
          data2.append('_method', 'PUT')
          const respuesta3 = await axios.post(
            `${Global.url}/updateProyectoToContrato/${id ?? ''}`,
            data2,
            {
              headers: {
                Authorization: `Bearer ${
                  token !== null && token !== '' ? token : ''
                }`
              }
            }
          )
          if (respuesta3.data.status == 'success') {
            navigate('/admin/lista-contratos')
            toast.success('Contrato generado correctamente')
          }
        } else {
          toast.error('Error al generar contrato')
        }
      } catch (error: unknown) {
        console.log(error)
        if (
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
          error.request.response.includes(
              `Duplicate entry '${values?.id_contrato}' for key 'contratos.correlativo'`
          )
        ) {
          toast.error('Ya existe un contrato para este proyecto')
        } else {
          toast.error('Error al generar contrato')
        }
      } finally {
        setLoading(false)
      }
    } else {
      toast.warning('Por favor coloque el contenido')
    }
  }

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    touched,
    handleBlur,
    setValues,
    isSubmitting
  } = useFormik({
    initialValues: {
      id_contrato: '',
      nombres_cliente: '',
      pdf_contrrato: '',
      tiempo: '',
      sexo: '',
      precio: 0.0,
      fecha: '',
      dni_cliente: '',
      tipo_documento: '',
      titulo_contrato: '',
      servicio: '',
      primero: '',
      id_cliente: '',
      medio_ingreso: ''
    },
    validationSchema: SchemaContrato,
    onSubmit: SaveContrato
  })

  const getOneBrief = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/dataToContrato/${id ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      }
    )
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    setContenido(
      request.data[0].contenido != null
        ? request.data[0].contenido
        : getContenido(formatearContrato(request.data[0].id_contrato))
    )
    setFormaPago(
      request.data[0].forma_pago != null
        ? request.data[0].forma_pago
        : '<ul><li><strong style="color: red;">S/ 00.00&nbsp;</strong><strong>&nbsp;</strong>A la aceptación del presente contrato</li><li><strong>S/ 00.00 </strong>&nbsp;<strong>+&nbsp;IGV</strong>&nbsp;A la los 10 días del proyecto&nbsp;</li><li><strong>S/ 00.00&nbsp;+ IGV a la aprobación del proyecto&nbsp;</strong></li></ul>'
    )
    const request2 = await axios.get(
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      `${Global.url}/showToContrato/${formatearContrato(
        request.data[0].id_contrato
      )}`,
      {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      }
    )
    let descripcionEntrada = ''
    if (formatearContrato(request.data[0].id_contrato) == 'LP69') {
      descripcionEntrada =
            '<p><strong style="background-color: yellow;">DISEÑO DE 01 LOGO:</strong></p><ul><li>Brief o Cuestionario de la empresa. (<strong>BRIEF SISTEMA)</strong></li><li><strong>Hasta (01) de Propuestas de diseño de LOGO</strong></li><li><strong>Análisis el Brief para la construcción del Logotipo.</strong></li><li><strong>Diseño o Rediseño de Logo</strong></li><li><strong>Coordinación directa, con el cliente para el desarrollo del Brief o cuestionario.</strong></li></ul><p>Propuestas:</p><ul><li>Recibirás (01 propuestas) Profesionales</li><li>100 % originales</li><li>1 diseñador dedicado</li><li>Modificaciones (03 cambios en el diseño aprobado). No se otorgarán más cambios según el plan contratado. Entrega del Logotipo (02 días Hábiles.</li><li>Teniendo en cuenta la respuesta inmediata del cliente. Entregables del Logotipo Final: Archivos Editables y sustentación del LOGOTIPO APROBADO: Ilustrador o PSD – PNG – JPG –PDF</li></ul>'
    } else if (formatearContrato(request.data[0].id_contrato).includes('LP69')) {
      descripcionEntrada =
            '<p class="ql-align-justify"><strong>DISEÑO DE&nbsp;</strong><strong style="background-color: yellow;">01 LOGO</strong><strong style="color: red;">:&nbsp;</strong><strong>&nbsp;</strong></p><ul><li class="ql-align-justify"><strong>Brief o Cuestionario de la empresa.&nbsp;</strong><span style="background-color: yellow;">(Se realizará un Análisis previo antes de la construcción del Logotipo)</span></li><li class="ql-align-justify"><strong>Hasta&nbsp;</strong><strong style="background-color: yellow;">(01)</strong><strong>&nbsp;de Propuestas de diseño de LOGO&nbsp;</strong></li><li class="ql-align-justify"><strong>Análisis el Brief para la&nbsp;construcción del Logotipo.</strong></li><li class="ql-align-justify"><strong>Diseño o Rediseño de Logo</strong></li></ul><p class="ql-align-justify">•&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Coordinación directa, con el cliente para el desarrollo del Brief o cuestionario.</p><p class="ql-align-justify"><strong style="background-color: yellow;">Propuestas:</strong></p><ul><li class="ql-align-justify">Recibirás (01 propuestas) Profesionales</li><li class="ql-align-justify">100 % originales</li><li class="ql-align-justify">1 diseñador dedicado</li><li class="ql-align-justify">Modificaciones (<strong style="color: red;">03 cambios en el diseño aprobado</strong>).&nbsp;<strong><u>No se otorgarán más cambios según el plan contratado.</u></strong></li></ul><p class="ql-align-justify">Entrega del Logotipo (<strong>02 días</strong>&nbsp;Hábiles. Teniendo en cuenta la respuesta inmediata del cliente.</p><p class="ql-align-justify">Entregables del Logotipo Final: Archivos Editables y&nbsp;<strong>sustentación del LOGOTIPO APROBADO</strong>:&nbsp;<strong>Ilustrador o PSD – PNG – JPG –PDF</strong></p><p class="ql-align-justify"><br></p><p class="ql-align-justify"><strong style="background-color: yellow;">No incluye adaptación de personaje, ni&nbsp;vectorización.</strong></p><p class="ql-align-justify"><br></p><ul><li class="ql-align-justify">Identidad Visual :</li><li class="ql-align-justify">01 diseño de Hoja Membretada - 1 propuesta</li><li class="ql-align-justify">Hasta dos cambios</li></ul>'
    } else if (formatearContrato(request.data[0].id_contrato) == 'LPEXC') {
      descripcionEntrada =
            '<p>DISEÑO DE 01 LOGO :</p><ul><li>Brief o Cuestionario de la empresa. (<strong>BRIEF - SISTEMA)&nbsp;&nbsp;</strong></li><li><strong style="background-color: yellow;">Hasta (02) de Propuestas de diseño de LOGO</strong></li><li><strong style="background-color: yellow;">Análisis el Brief para la construcción del Logotipo.</strong></li><li><strong>Diseño de Logo – Plan Excepcional</strong></li><li><strong style="background-color: yellow;">Coordinación directa, con el cliente para el desarrollo del Brief o cuestionario.</strong></li></ul><p>Propuestas:</p><ul><li>Recibirás (02 propuestas) Profesionales</li><li>100 % originales</li><li>1 diseñador dedicado</li><li>Modificaciones (03 cambios en el diseño aprobado).</li><li>No se otorgarán más cambios según el plan contratado. Entrega del Logotipo (02 días Hábiles. Teniendo en cuenta la respuesta inmediata del cliente.</li><li>Entregables del Logotipo Final: Archivos Editables y sustentación del LOGOTIPO APROBADO: Ilustrador o PSD – PNG – JPG –PDF</li></ul><p>&nbsp;</p><p>No incluye adaptación de personaje, ni vectorización</p><p>&nbsp;</p><p>Identidad Visual – 1 propuesta de cada uno</p><ul><li>01 Diseño de tarjeta de presentación</li><li>01 Diseño de Hoja Membretada</li><li>01 Diseño de firma de correo</li><li>01 Diseño de flyer o post</li><li> Hasta 2 cambios</li></ul>'
    } else if (formatearContrato(request.data[0].id_contrato).includes('LPEXC')) {
      descripcionEntrada =
              '<p>DISEÑO DE 01 LOGO :</p><ul><li>Brief o Cuestionario de la empresa. (<strong>BRIEF - SISTEMA)&nbsp;&nbsp;</strong></li><li><strong>Hasta (02) de Propuestas de diseño de LOGO</strong></li><li><strong>Análisis el Brief para la construcción del Logotipo.</strong></li><li><strong>Diseño de Logo – Plan Excepcional</strong></li><li><strong>Coordinación directa, con el cliente para el desarrollo del Brief o cuestionario.</strong></li></ul><p><br></p><p>Propuestas:</p><ul><li>Recibirás (02 propuestas) Profesionales</li><li>100 % originales</li><li>1 diseñador dedicado</li><li>Modificaciones (03 cambios en el diseño aprobado).</li><li>No se otorgarán más cambios según el plan contratado. Entrega del Logotipo (02 días Hábiles. Teniendo en cuenta la respuesta inmediata del cliente.</li><li>Entregables del Logotipo Final: Archivos Editables y sustentación del LOGOTIPO APROBADO: Ilustrador o PSD – PNG – JPG –PDF</li></ul><p>&nbsp;</p><p>No incluye adaptación de personaje, ni vectorización</p><p>&nbsp;</p><ul><li>Identidad Visual – 1 propuesta de cada uno</li><li>01 Diseño de Hoja Membretada</li><li>Hasta 2 cambios</li></ul>'
    } else if (formatearContrato(request.data[0].id_contrato) == ('LPPG')) {
      descripcionEntrada =
            '<p><strong>DISEÑO DE PIEZAS GRAFICAS (1 propuesta)</strong></p><ul><li><strong>01 banner para impresión de 0.7 x 2.00 mts – 1 propuesta</strong></li><li><strong>Hasta 3 cambios ENTREGABLES :</strong></li><li><strong>EDITABLES - jpg – png – pdf</strong></li></ul><p><strong>&nbsp;</strong></p><p><strong>El cliente nos remite</strong></p><ul><li><strong>Coordinación directa con el diseñador</strong></li><li><strong>Logo en versión editable</strong></li></ul>'
    } else if (formatearContrato(request.data[0].id_contrato) == ('LPCM')) {
      descripcionEntrada =
            '<p><strong>PLAN COBRE</strong></p><p>✓ Investigación digital</p><p>✓ Análisis de Marketing Digital - DOCUMENTACIÓN - Linea Gráfica&nbsp;</p><p>✓ 03 PUBLICACIONES POR SEMANA (LUNES A SABADO)</p><p>&nbsp;&nbsp;&nbsp;Descripción y post</p><p>✓ DISEÑO DE FLYER O POST - Entregable cronograma</p><p>✓ RESPUESTAS O COMENTARIOS a Potenciales (clientes o seguidores)</p><p>✓ 01 DISEÑO DE PERFIL (facebook - Instagram)</p><p>✓ 01 DISEÑO DE PORTADA facebook - wsp bussines</p><p>✓ Asesoría en creación de redes<strong> (facebook - Instagram)</strong></p><p><strong>CONTRATO MINIMO X 3 MESES</strong></p><p><strong>&nbsp;</strong></p><p><strong>El cliente nos remite:</strong></p><ul><li>Brief o cuestionario Desarrollado.&nbsp;Documento Importante para conocer más sobre la Empresa.</li><li>Logo Editable (en archivo AI, PSD&nbsp;</li></ul>'
    } else if (formatearContrato(request.data[0].id_contrato) == ('LPBRO')) {
      descripcionEntrada =
            '<p><strong style="background-color: yellow;">01 Diseño de Brochure:</strong></p><ul><li>Información requerida (imágenes, datos de contacto, fotos propias)</li><li>Envió de logotipo editable. (Se realizará un Análisis previo antes de la construcción del Brochure)</li><li>Hasta (01) Propuesta de Brochure de&nbsp;<strong>06 CARAS – 03 hojas</strong></li><li><strong>Análisis de la información enviada para la construcción del Brochure.</strong></li><li><strong>Coordinación directa, con el cliente para el desarrollo del Brief o cuestionario.</strong></li></ul><p><br></p><p>Propuestas:</p><ul><li>Recibirás (01 Desarrollo &amp; Diseños de Brochure Digital-impresión) Profesional.&nbsp;<strong>06 CARAS&nbsp;- 3 hojas&nbsp;</strong>&nbsp;</li><li>100 % originales</li><li>1 diseñador dedicado</li><li>Modificaciones (02 cambios en el diseño aprobado). No se otorgarán más cambios según el plan contratado.</li></ul><p><br></p><p>Entrega del Logotipo (02 días hábiles) según la respuesta inmediata del cliente</p><p class="ql-align-justify">Entregables de Brochure Final: Archivos Editables: Ilustrador o PSD // JPG imagen</p>'
    } else if (formatearContrato(request.data[0].id_contrato) == ('LPTV')) {
      descripcionEntrada =
              '<p>DESARROLLO DE TIENDA VIRTUAL :</p><p>&nbsp;</p><ul><li>Hasta 5 internas. Bajo Plantillas Pre determinadas (El cliente escoge una)</li><li>Desarrollamos un Brief A MEDIDA Integración de Carrito de COMPRAS.</li><li>EL COSTO POR LA INTEGRACIÓN DEL SERVICIO DE COMERCIO ELECTRÓNICO, ES ASUMIDO POR EL CLIENTE</li><li>Pasarela de Pago: Mercado Pago:</li><li>Medio de pago: Tarjetas de crédito</li><li class="ql-indent-1">Visa, Mastercard, American express y Diners Club.</li><li class="ql-indent-1">Registro de pagos en el sistema de mercado pago y en el sistema de la tienda virtual.</li><li>Trabajamos nuestra programación y Maquetación desde CERO Programación en PHP</li><li class="ql-indent-1">Framework Base de Datos Myql</li><li>Soporte hasta 100 productos</li><li>Administración Dominio .com GRATIS x un AÑO</li><li>Alojamiento Web 03 GB (Sin Cpanel Independiente) GRATIS x un AÑO</li><li>NO Utilizamos plantillas o CMS Gratuitos de Internet WEB desarrollada desde CERO</li><li>Formularios de Contacto Dinámico.</li><li>MAIL de repuesta al visitante.</li><li>Ubicación de la empresa o negocio a través de Google Maps.</li><li>Seguridad Anti Spam Interacción con Redes Sociales.</li><li>Podrá ADMINISTRAR Hasta 02 Internas.</li><li>Creación de hasta 05 Correos Corporativos (Asesoría en su configuración)</li><li>Entrega de acceso al administrador. Manual de Usuario.</li><li>Capacitación del sistema (vía VIRTUAL). Soporte Técnico.</li><li>Por 03 mes (Solo atendemos incidencias o fallas en nuestro servicio + (01) cambio textuales e imágenes).</li><li>Técnica de Posicionamiento Web (SEO).</li><li>Retoque Fotográfico de Hasta 15</li></ul><p>&nbsp;</p><p><strong>EL CLIENTE NOS REMITE:</strong></p><ul><li>Su logotipo editable (PSD – Ai – CDR).</li><li>Fotos e imágenes en buena resolución.</li><li>Entrega de datos de contacto</li></ul>'
    } else if (formatearContrato(request.data[0].id_contrato) == ('LPREEL')) {
      descripcionEntrada =
                '<p><strong>EDICION DE VIDEO</strong></p><ul><li>01 Desarrollo de Reel o Edición de Video de hasta 10 SEGUNDOS Saludo o presentación de su empresa o negocio</li><li>Cliente nos remite Logo en versión editable, Fotos o Videos Cortos, Logos Perú Edita</li><li>Incluye Efectos y Musicalización</li><li>Desarrollo StoryBoard : Presentación al cliente</li><li><strong style="background-color: yellow;">Locución en Off –</strong><strong>&nbsp;no incluye</strong></li><li>Entregable vía DRIVE</li><li>Tiempo de producción (total): 02 días hábiles Propuestas:</li><li class="ql-indent-2">Recibirás un desarrollo y edición de su video</li><li class="ql-indent-2">100 % originales</li><li class="ql-indent-2">1 profesional dedicado</li><li class="ql-indent-2">Resolución 1920x1080, alta calidad.</li><li class="ql-indent-2">Modificaciones (02 cambios) por Video. No se otorgarán más cambios según el plan contratado.</li></ul><p>&nbsp;</p><p>Entrega del Video en Drive (Descargar)</p>'
    } else if (formatearContrato(request.data[0].id_contrato) == ('LPFLYER')) {
      descripcionEntrada =
                  '<p><strong>SERVICIO de diseño de piezas graficas</strong></p><p><strong>&nbsp;</strong></p><ul><li><strong>03 Diseños de flyer – 01 propuestas – 1 cara Según requerimientos y ejemplos del cliente</strong></li><li><strong>Hasta dos cambios x cada flyer</strong></li><li><strong>ENTREGABLES : JPG – PDF - AI para impresión</strong></li></ul><p>&nbsp;</p><p>El cliente nos remite :</p><ul><li>Coordinación directa con el diseñador</li><li>Logo en versión editable</li></ul>'
    } else if (formatearContrato(request.data[0].id_contrato) == ('LPSEO')) {
      descripcionEntrada =
                    '<p><strong style="color: red;">1.-Propiedad Verificada:</strong></p><p>- Verificación desde Gmail y añadir DNS</p><p>- Verificar Google console search y listo la propiedad es del cliente</p><p>- Realizar solicitud de indexación para que la URL pueda aparecer</p><p>en Google</p><p>Propiedad Verificada</p><p><strong style="color: red;">2.-SEO:</strong></p><p>- Uso de Metadatos para mejorar el posicionamiento del SEO y</p><p>también el rendimiento del SEO con la propiedad del cliente cual</p><p>favorecerá a la carga de la página.</p><p>Cliente remite palabras claves </p><p>Capacitación y documentación&nbsp;</p>'
    } else if (formatearContrato(request.data[0].id_contrato) == ('LPADS')) {
      descripcionEntrada =
                      '<p>1.- Servicio de <strong style="background-color: yellow;">Asesoría de Posicionamiento PAGADO en GOOGLE - Adwords</strong></p><ul><li>Capacitación a distancia - Bajo el medio digital que se acuerde</li><li>Análisis de la web a posicionar</li><li>Recomendaciones</li><li>Configuración de la Cuenta</li><li>Capacitación de Uso de Google SEM</li><li>Manuales de Uso</li><li>Tiempo de Capacitación: Max 3 horas</li><li>Estrategias de pago</li><li>Capacitación en la publicidad pagada por el mismo cliente</li><li>Entrega de Manuales y Material – link grabado </li><li>TIEMPO: 01 día hábil</li></ul>'
    } else if (formatearContrato(request.data[0].id_contrato) == ('LPWA')) {
      descripcionEntrada =
                        '<p>DESARROLLO &amp; DISEÑO WEB ADMINISTRABLE - PLAN  :</p><p>&nbsp;</p><p>✓ Hasta 6 internas, A la medida del cliente. CLIENTE NOS REMITE SU EJEMPLO</p><p>✓ Desarrollamos un Brief A MEDIDA</p><p>✓ Formularios de Contacto Dinámico. MAIL de repuesta al visitante.</p><p>✓ Ubicación de la empresa o negocio a través de Google Maps.</p><p>✓ Programación en PHP - Framework Codeigter</p><p>✓ Base de Datos Myql</p><p>✓ HTML 5 , Booystrap, CSS3, jQUERY</p><p>✓ No usamos plantillas - No trabajamos con CMS</p><p>✓ Seguridad Anti Spam</p><p>✓ Administración Dominio .com <strong style="background-color: yellow;">GRATIS x un AÑO</strong></p><p>✓ Alojamiento Web ilimitado (Cpanel Independiente) <strong style="background-color: yellow;">GRATIS x un AÑO</strong></p><p>✓ Interacción con Redes Sociales. Facebook - Whastapp - INSTAGRAM</p><p>✓ Podrá ADMINISTRAR Hasta 03 Internas. NOTICIAS - PRODUCTOS – SERVICIOS</p><p>✓ Entrega de acceso al administrador.</p><p>✓ Manual de Usuario.</p><p>✓ Capacitación del sistema (En nuestra Agencia o VIRTUAL).</p><p>✓ Soporte Técnico. Por 03 mes (Solo atendemos incidencias o fallas en nuestro servicio + (01) cambio textuales e imágenes).</p><p>✓ Retoque Fotográfico de Hasta 15</p><p>&nbsp;</p><p>• EL CLIENTE NOS REMITE :</p><p>• Su logotipo editable (PSD – Ai – CDR).</p><p>• Fotos e imágenes en buena resolución.</p><p>• Entrega de datos de contacto</p>'
    } else if (formatearContrato(request.data[0].id_contrato) == ('LPW')) {
      descripcionEntrada =
                          '<p>01 DISEÑO WEB INFORMATIVA: </p><ul><li>Hasta 4 internas, bajo nuestras propuestas INGRESAR (Plantillas Express) el cliente elegirá una </li><li>Desarrollamos un Brief </li><li>Formularios de Contacto Dinámico. MAIL de repuesta al visitante. </li><li>Ubicación de la empresa o negocio a través de Google Maps. </li><li>NO Utilizamos plantillas o CMS Gratuitos de Internet </li><li>WEB desarrollada desde CERO </li><li>Seguridad Anti Spam </li><li>Interacción con Redes Sociales. (WhatsApp – Facebook – YouTube) </li><li>Administración Dominio .com <strong style="background-color: yellow;">GRATIS x un AÑO</strong></li><li>Alojamiento Web 1 GB (Sin Cpanel Independiente) <strong>GRATIS x un AÑO</strong></li><li>Soporte Técnico. Por 01 mes (Solo atendemos incidencias o fallas en nuestro servicio). </li></ul><p>&nbsp;</p><p>EL CLIENTE NOS REMITE: </p><p>&nbsp;</p><ul><li>Entrega de textos e imágenes para la página web </li><li>Logotipo en versión editable </li><li>Fotos e imágenes en buena resolución. </li><li>Datos de contacto</li></ul>'
    } else if (formatearContrato(request.data[0].id_contrato) == ('LPMAPS')) {
      descripcionEntrada =
                            '<p><strong style="color: red;">1.-Propiedad Verificada:</strong></p><p>- Verificación desde Gmail y añadir DNS</p><p>- Verificar Google console search y listo la propiedad es del cliente</p><p>- Realizar solicitud de indexación para que la URL pueda aparecer</p><p>en Google</p><p><br></p><p><strong style="color: red;">2. Ubicación del negocio en google maps</strong></p><p><strong style="color: red;">&nbsp;</strong></p><p><strong style="color: red;">CLIENTE NOS RENITE : SUS ACCESOS A SU CUENTA GMAIL&nbsp;</strong></p>'
    }
    setContenido(descripcionEntrada)
    setValues({
      ...values,
      titulo_contrato: request2.data[0].titulo,
      id_contrato: request.data[0].id_contrato,
      servicio: request2.data[0].servicio,
      primero: request2.data[0].primero,
      nombres_cliente: request.data[0].nombre_empresa,
      dni_cliente: request.data[0].dni_ruc,
      precio: request.data[0].precio,
      sexo: request.data[0].sexo,
      tiempo: request.data[0].tiempo,
      medio_ingreso: request.data[0].medio_ingreso,
      id_cliente: request.data[0].id_cliente,
      tipo_documento: request.data[0].tipo_documento,
      pdf_contrrato: request.data[0].pdf_contrato,
      fecha:
        request.data[0].fecha != null ? request.data[0].fecha : generarFecha()
    })

    setLoading(false)
  }

  useEffect(() => {
    if (errors && isSubmitting) {
      const firstErrorKey = Object.keys(errors)[0]
      const firstErrorElement = document.getElementsByName(firstErrorKey)[0]
      if (firstErrorElement) {
        firstErrorElement.focus()
      }
    }
  }, [touched, errors, isSubmitting])

  useEffect(() => {
    getOneBrief()
  }, [])

  useEffect(() => {
    setTitle(`GENERAR CONTRATO - ${values.nombres_cliente} `)
  }, [values.nombres_cliente])

  return (
    <div className={cn('grid h-full', loading ? 'grid-cols-1' : pdfUrl && 'grid-cols-2 gap-3')}>
      {loading ? (
        <Loading />
      ) : (
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
                      value={values?.nombres_cliente}
                      disabled
                    />
                  </div>
                  <div className="w-full px-3  lg:hidden flex items-center justify-center">
                    <button className="bg-red-500 text-white rounded-xl px-5 py-2 mx-auto flex items-center justify-center gap-3 ">
                      <AiOutlineFilePdf /> Visualizar contrato
                    </button>
                  </div>
                </div>
                <div className="w-full flex flex-col lg:flex-row gap-3 lg:gap-5 mt-3 lg:mt-0">
                  <div className="w-full lg:relative pb-5">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="email"
                    >
                      Tipo de documento
                    </label>
                    <select
                      className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                      name="tipo_documento"
                      value={values.tipo_documento}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      {/* FB GOOGLE, VENTAS, POST VENTA, RECOMENDACION, ISNTAGRAM) */}
                      <option value="">Seleccionar</option>
                      <option value="DNI">DNI</option>
                      <option value="RUC">RUC</option>
                    </select>
                    <Errors2
                      errors={errors.tipo_documento}
                      touched={touched.tipo_documento}
                    />
                  </div>
                  <div className="w-full  lg:relative pb-5">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="email"
                    >
                      DNI/RUC del cliente
                    </label>
                    <input
                      className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                      name="dni_cliente"
                      type="number"
                      value={values.dni_cliente}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={false}
                    />
                    <Errors2
                      errors={errors.dni_cliente}
                      touched={touched.dni_cliente}
                    />
                  </div>
                  <div className="w-full px-3  lg:hidden flex items-center justify-center">
                    <button className="bg-red-500 text-white rounded-xl px-5 py-2 mx-auto flex items-center justify-center gap-3 ">
                      <AiOutlineFilePdf /> Visualizar contrato
                    </button>
                  </div>
                  <div className="w-full lg:relative pb-5">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="email"
                    >
                      Fecha de creacion
                    </label>
                    <input
                      className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                      name="fecha"
                      type="text"
                      value={values.fecha}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={false}
                    />
                    <Errors2 errors={errors.fecha} touched={touched.fecha} />
                  </div>
                </div>
                <div className="w-full flex flex-col lg:flex-row gap-3 lg:gap-5 mt-3 lg:mt-0 items-center">
                  <div className="w-full lg:relative pb-5">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="email"
                    >
                      Tiempo estimado
                    </label>
                    <input
                      className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                      name="tiempo"
                      type="number"
                      value={values.tiempo}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={false}
                    />
                    <Errors2 errors={errors.tiempo} touched={touched.tiempo} />
                  </div>
                  <div className="w-full  lg:relative pb-5">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="email"
                    >
                      Precio del servicio
                    </label>
                    <input
                      className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                      name="precio"
                      type="number"
                      step="0.01"
                      value={values.precio}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      disabled={false}
                    />
                    <Errors2 errors={errors.precio} touched={touched.precio} />
                  </div>
                </div>
                <div className="w-full  relative formas_pago">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="email"
                  >
                    Formas de pago
                  </label>
                  <div className="mt-3 w-full">
                    <EditorPdfAltas
                      content={formaPago}
                      setContent={setFormaPago}
                    />
                  </div>
                </div>
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
                  className="bg-secondary-150 px-3 py-2 text-white rounded-md cursor-pointer"
                  value="Previsualizar"
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
              {pdfUrl && (
                <>
                  {!loading ? (
                        <button
                        type="button"
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onClick={async () => { await SaveContrato2() }}
                      className="rounded-md w-[100px] bg-secundario h-fit px-3 text-white py-2 hover:bg-green-700 transition-colors"
                    >
                      Continuar
                    </button>
                  ) : (
                    <button
                      type="button"
                      // eslint-disable-next-line @typescript-eslint/no-misused-promises
                      className="rounded-md w-[100px] bg-secundario h-fit px-3 text-white py-2 hover:bg-green-700 transition-colors"
                    >
                      Validando...
                    </button>
                  )}
                </>
              )}
            </div>
          </div>
        </form>
      )}
       <div className="w-full h-full relative ">
            {loading && pdfUrl ? (
              <Loading />
            ) : (
              !loading &&
              pdfUrl && (
                <>
                  <iframe
                    src={pdfUrl}
                    title="PDF Viewer"
                    className="w-full h-full border-none"
                  />
                </>
              )
            )}
        </div>
      <SubirContrato
        open={openPDF}
        setOpen={setOpenPDF}
        id={id}
        getOneBrief={getOneBrief}
      />
    </div>
  )
}
