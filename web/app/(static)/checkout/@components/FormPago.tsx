/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @next/next/no-img-element */
'use client'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { FaAngleLeft, FaCircleDot } from 'react-icons/fa6'
import { Modal } from './Modal'
import { TiDelete } from 'react-icons/ti'
import { useFormik } from 'formik'
import { SchemaPago } from '@/public/components/shared/Schema'
import axios from 'axios'
import { Global } from '@/helper/Global'
import { Errors } from '@/public/components/web/structure/Errors'
import { Regresar } from './Regresar'
import useAuth from '@/public/components/shared/hooks/useAuth'
import { LoginPago } from '@/public/components/web/structure/headerComponents/LoginPago'
import { ResetPassword } from '@/public/components/web/structure/headerComponents/ResetPassword'
import { Register } from '@/public/components/web/structure/headerComponents/Register'
import { toast, Toaster } from 'sonner'
import { v4 as uuidv4 } from 'uuid'
export const FormPago = () => {
  const [menuMovil, setMenuMovil] = useState(false)
  const [openAdicional, setOpenAdicional] = useState(false)
  const [cart, setCart] = useState([])
  const [adicionales, setAdicionales] = useState([])
  const [loading, setLoading] = useState(false)
  const { auth } = useAuth()
  const [open, setOpen] = useState(false)
  const [openRegister, setOpenRegister] = useState(false)
  const [openPass, setOpenPass] = useState(false)

  useEffect(() => {
    const cartInfo = localStorage.getItem('cart')
    const cartInitial = cartInfo ? JSON.parse(cartInfo) : []
    setCart(cartInitial)
    const adicionalInfo = localStorage.getItem('adicionales')
    const adicionalInitial = adicionalInfo ? JSON.parse(adicionalInfo) : []
    setAdicionales(adicionalInitial)
  }, [])

  useEffect(() => {
    if (auth.id) {
      setValues({
        ...values,
        nombres: auth.name,
        apellidos: auth.lastname,
        email: auth.email,
        celular: auth.celular
      })
    } else {
      resetForm()
    }
  }, [auth])

  const variants = {
    hidden: { height: 0 },
    enter: { height: 'fit-content' },
    exit: { height: 0 }
  }

  const removeAdicional = (id: any) => {
    const updatedAdicionales = adicionales.filter((add: any) => add.id !== id)
    setAdicionales(updatedAdicionales)
    localStorage.setItem('adicionales', JSON.stringify(updatedAdicionales))
  }

  const loadMercadoPago = () => {
    return new Promise((resolve, reject) => {
      if (!document.getElementById('mercado-pago-sdk')) {
        const script = document.createElement('script')
        script.src = 'https://sdk.mercadopago.com/js/v2'
        script.id = 'mercado-pago-sdk'
        script.onload = () => resolve(true)
        script.onerror = () => reject(new Error('No se pudo cargar el SDK de MercadoPago'))
        document.body.appendChild(script)
      } else {
        resolve(true)
      }
    })
  }

  const enviarCorreo = async (): Promise<void> => {
    setLoading(true)
    const formData = new FormData()
    formData.append('email', values.email)
    formData.append('celular', values.celular)
    formData.append('pais', values.pais)
    formData.append('nombres', values.nombres)
    formData.append('apellidos', values.apellidos)
    formData.append('ruc', values.ruc)
    formData.append('dni', values.dni)
    formData.append('conFactura', values.conFactura)
    formData.append('razonSocial', values.razonSocial)
    formData.append('comentarios', values.comentarios)
    formData.append('userid', auth.id)
    formData.append('mensaje', values.mensaje)
    formData.append('igv', (Number(igv) ?? 0).toFixed(2))
    formData.append('domain', 'https://logosperu.com.pe')

    const validatedCart = cart
      .map((cartItem: any) => {
        const precioLimpio = cartItem.precio.replace(/[^\d.]/g, '')
        const item: any = Object.values(data).find((i: any) => i.correlativo == cartItem.correlativo)
        if (item) {
          return {
            id: uuidv4(),
            correlativo: item.correlativo,
            imagen: '',
            nombre: item.name,
            servicio: item.servicio,
            precio: precioLimpio,
            cantidad: cartItem.cantidad
          }
        }
        return null // Si no se encuentra el item, lo ignoramos
      })
      .filter(Boolean) // Eliminar cualquier item que sea `null` (si no se encontró)

    const validatedAdicionales = adicionales
      .map((item: any) => {
        const validatedItem = adicionalesList.find((adicional: any) => adicional.name == item.nombre)
        if (validatedItem) {
          return {
            id: uuidv4(),
            imagen: '',
            elemento: validatedItem.name, // Usar el nombre correcto
            nombre: validatedItem.name, // Usar el nombre correcto
            precio: validatedItem.precio, // Usar el precio correcto
            cantidad: item.cantidad, // Mantener la cantidad ingresada por el usuario
            cantidad_propuestas: item.cantidad_propuestas, // Mantener las propuestas ingresadas por el usuario
            precio_propuestas: validatedItem.precio_propuestas ?? 0 // Usar el precio_propuestas correcto, si existe
          }
        }
        return null // Si no se encuentra el adicional, lo ignoramos
      })
      .filter(Boolean) // Eliminar los adicionales que sean `null`

    const combinedData = [...validatedCart, ...validatedAdicionales]
    formData.append('cart', combinedData ? JSON.stringify(combinedData) : '[]')
    formData.append('adicionales', validatedAdicionales ? JSON.stringify(validatedAdicionales) : '[]')

    try {
      const { data } = await axios.post(`${Global.url}/checkout/createOrdenDes`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      await loadMercadoPago()
      const mercadopago = new window.MercadoPago('APP_USR-b50dd1e9-4ff1-4dad-952e-dd806a1ac161', { locale: 'es-PE' })
      if (mercadopago) {
        mercadopago.checkout({
          preference: {
            id: data.preferenceId
          },
          autoOpen: true
        })
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
      toast.error('Ocurrió un error al procesar tu solicitud. Por favor, intenta nuevamente.')
      setLoading(false)
    }
  }

  const { handleSubmit, handleChange, setValues, resetForm, errors, values, touched, handleBlur } = useFormik({
    initialValues: {
      nombres: '',
      apellidos: '',
      celular: '',
      email: '',
      mensaje: '',
      comentarios: '',
      pais: 'Perú',
      conFactura: 'Sin factura',
      razonSocial: '',
      ruc: '',
      dni: ''
    },
    validationSchema: SchemaPago,
    onSubmit: enviarCorreo
  })

  const updateLocalStorage = (adicionales: any) => {
    localStorage.setItem('adicionales', JSON.stringify(adicionales))
  }

  const handleIncrement = (id: any) => {
    setAdicionales((prevAdicionales: any) => {
      const updatedAdicionales = prevAdicionales.map((item: any) =>
        item.id === id ? { ...item, cantidad_propuestas: item.cantidad_propuestas + 1 } : item
      )
      updateLocalStorage(updatedAdicionales)
      return updatedAdicionales
    })
  }

  const handleDecrement = (id: any) => {
    setAdicionales((prevAdicionales: any) => {
      const updatedAdicionales = prevAdicionales.map((item: any) =>
        item.id === id && item.cantidad_propuestas > 1 ? { ...item, cantidad_propuestas: item.cantidad_propuestas - 1 } : item
      )
      updateLocalStorage(updatedAdicionales)
      return updatedAdicionales
    })
  }

  const handleIncrementCantidad = (id: any) => {
    setAdicionales((prevAdicionales: any) => {
      const updatedAdicionales = prevAdicionales.map((item: any) => (item.id === id ? { ...item, cantidad: item.cantidad + 1 } : item))
      updateLocalStorage(updatedAdicionales)
      return updatedAdicionales
    })
  }

  const handleDecrementCantidad = (id: any) => {
    setAdicionales((prevAdicionales: any) => {
      const updatedAdicionales = prevAdicionales.map((item: any) =>
        item.id === id && item.cantidad > 1 ? { ...item, cantidad: item.cantidad - 1 } : item
      )
      updateLocalStorage(updatedAdicionales)
      return updatedAdicionales
    })
  }

  const data = {
    plan69: {
      name: 'Plan Emprendedor',
      servicio: 'Diseño de logotipo',
      price: 'S/ 2.00',
      correlativo: 'LP69',
      items: [
        '(01) Propuestas de logo - Hasta 3 cambios.',
        'Análisis del Brief o cuestionario técnico para la construcción del Logotipo.',
        'Coordinación directa, con el cliente para el desarrollo del Brief o cuestionario.',
        'Entrega de editables: AI + JPG + PNG + PDF.',
        'Tiempo de entrega : 01 - 02 días Hábiles.',
        'Forma de Trabajo : Bajo Contrato.',
        'Nuestros costos NO incluyen IGV.'
      ],
      sold: false
    },
    planExcepcional: {
      name: 'Plan EXCEPCIONAL',
      servicio: 'Diseño de logotipo',
      correlativo: 'LPEXC',
      price: 'S/ 169.00',
      items: [
        '(02) Propuestas de logo - Hasta 3 cambios del logo escogido.',
        'Análisis del Brief o cuestionario técnico para la construcción del Logotipo.',
        'Coordinación directa, con el cliente para el desarrollo del Brief o cuestionario.',
        'Entrega de editables: AI + JPG + PNG + PDF.',
        'Tiempo de entrega : 01 - 02 días Hábiles.',
        'Forma de Trabajo : Bajo Contrato.',
        'Nuestros costos NO incluyen IGV.'
      ],
      sold: true
    },
    planEstandar: {
      name: 'PLAN STANDART - DISEÑO O REDISEÑO DE LOGO ',
      servicio: 'Diseño de logotipo',
      price: 'S/ 399.00',
      correlativo: 'LPS',
      items: [
        'Brief o Cuestionario de la empresa. (Se realizará un Análisis previo antes de la construcción del Logotipo)',
        'Hasta <strong>03 Propuestas de LOGO</strong>  - Hasta 3 cambios DEL LOGO ESCOGIDO',
        ' Análisis del Brief para la construcción del Logo',
        'Coordinación directa, con el cliente para el desarrollo del Brief o cuestionario.',
        'Entregables : Editables <strong>AI + JPG + PNG + PDF</strong>',
        '<strong>IDENTIDAD VISUAL</strong> (01) PROPUESTAS DE CADA UNO',
        '01 DISEÑO DE Tarjeta de Presentación',
        '01 DISEÑO DE HOJA MEMBRETADA',
        '01 DISEÑO DE PORTADA  PARA FACEBOOK',
        '01 DISEÑO DE PERFIL PARA FACEBOOK - INSTAGRAM - WSP - TIKTOK',
        'ASESORIA EN CREACIÓN DE REDES - OPCIONAL'
      ],
      sold: false,
      verMas: true,
      tiempo: 3,
      igv: true
    },
    planCreativo: {
      name: 'PLAN CREATIVO - DISEÑO o Rediseño DE LOGO',
      servicio: 'Diseño de logotipo',
      correlativo: 'LPC',
      price: 'S/ 579.00',
      items: [
        'Recibirás 04 propuestas creativas de diseño de logo sustentadas.',
        'Envío de brief o cuestionario por mail – WhatsApp.',
        'Análisis del Brief o cuestionario técnico para la construcción del Logotipo.',
        'Coordinación directa, con el cliente para el desarrollo del Brief o cuestionario.',
        '<strong>ENTREGABLES: </strong>',
        'Adobe Ilustrator: Programa original de diseño y donde se elabora las propuestas del logo.',
        'PDF: Lo podrá abrir en cualquier programa de Adobe o Corel Draw.',
        'JPG: Imagen (con fondo blanco)',
        'PNG: Transparencia (sin fondo)',
        '<strong>MANUAL DE DISEÑO DE LOGO:</strong>',
        'Definición de Colores corporativos.',
        'Composición y Construcción del Logo.',
        'Normas para el buen uso del Diseño Logo.',
        '<strong>DISEÑO DE  BROCHURE: Versión DIGITAL - IMPRESIÓN.</strong>',
        ' 01 Diseño de brochure de hasta <strong>2 hojas (4 caras)</strong> ',
        'Hasta 02 Modificaciones',
        'Formato de entrega: ',
        'PDF: Formato de impresión o digital',
        ' JPG: Imagen.  Medidas: según indique el cliente ',
        '<strong>IDENTIDAD VISUAL CORPORATIVA. (01 PROPUESTA DE CADA UNO) </strong>',
        ' 01 Diseño de Hoja Membretada',
        '01 Diseño de Tarjeta Presentación. (1 Nombre)',
        '01 Diseño de Firma para correo (1 Nombre)',
        '01 Diseño de Flyer Digital PARA POST (cliente nos remite sus tema)',
        '<p class="mt-3"><strong>OBSEQUIO: Logo para usar como marca de agua</strong></p>'
      ],
      sold: false,
      verMas: true,
      igv: true,
      tiempo: 4
    },
    planProfesional: {
      name: 'PLAN PROFESIONAL - DISEÑO DE LOGO ',
      servicio: 'Diseño de logotipo',
      correlativo: 'LPP',
      price: 'S/ 1290.00',
      items: [
        'Recibirás <strong>05 propuesta PROFESIONALES</strong> de diseño de logo sustentadas.',
        'Hasta 03 Modificaciones',
        'Envío de brief o cuestionario por mail – WhatsApp.',
        'Coordinación directa, con el cliente para el desarrollo del Brief o cuestionario.',
        '<strong>ENTREGABLES: </strong>',
        'Adobe Ilustrator: Programa original de diseño y donde se elabora las propuestas del logo.',
        'PDF: Lo podrá abrir en cualquier programa de Adobe o Corel Draw.',
        'JPG: Imagen (con fondo blanco)',
        'PNG: Transparencia (sin fondo)',
        '<strong>MANUAL DE DISEÑO DE LOGO:</strong>',
        'Definición de Colores corporativos.',
        'Composición y Construcción del Logo.',
        'Normas para el buen uso del Diseño Logo.',
        '<strong>DISEÑO DE  BROCHURE: Versión DIGITAL - IMPRESIÓN.</strong>',
        ' 01 Diseño de brochure de hasta <strong>3 hojas (6 caras)</strong> ',
        'Hasta 02 Modificaciones',
        'Formato de entrega: ',
        'PDF: Formato de impresión o digital Adobe Ilustrator.',
        ' JPG: Imagen.  Medidas: según indique el cliente ',
        '<strong>IDENTIDAD VISUAL CORPORATIVA. (01 PROPUESTA DE CADA UNO) </strong>',
        ' 01 Diseño de Hoja Membretada',
        '01 Diseño de Folder',
        '01 Diseño de Sobre',
        '01 Diseño de Tarjeta Presentación. (Máx. 2 Nombres)',
        '01 Diseño de Firma para correo (Máx. 02 Nombres)',
        '01 Diseño de Banner o Letrero Publicitario',
        '01 Diseño de Fotocheck (Max. 05 Nombres)',
        '01 Diseño de Uniforme (Polo - Camisa - Gorro - Chaleco)',
        '<strong>REDES SOCIALES: </strong>',
        '01 Diseño de portada Facebook - WSP Bussines',
        '01 Diseño de Perfil (Fan Page - WSP - Instagram - Tiktok)',
        '02 Diseños de Flyers o Post - cliente nos remite los temas',
        'Asesoria en creación de Redes (Opcional)',
        '<strong>IMPRESIÓN DE TARJETA DE PRESENTACIÓN:</strong>',
        '1 millar x 1 nombre.',
        'Tamaño: 9 x 5.5 cm.',
        'Material: Papel couché de 250gr. Mate o brillante (a elección del cliente).',
        'Envío Lima: Gratis',
        'Envío Provincia: Servicio de COLLECT'
      ],
      verMas: true,
      sold: false,
      igv: true,
      tiempo: 7
    },
    planBrochre: {
      name: 'Brcohure 2 hojas',
      price: 'S/ 129.00',
      servicio: 'Diseño de brochure',
      correlativo: 'LPBRO4',
      items: [
        'Diseño de (01) Propuesta de Brochure de (2) hojas - (4) Caras',
        'Entregable : Versión Digital',
        'Diagramación : AsesorÍa en el la posiciones de textos y fotos',
        'Tiempo de Trabajo : 1 - 3 días',
        'Nuestros costos NO incluyen IGV.'
      ]
    },
    planBrochreplan2: {
      name: 'Brochure 3 hojas',
      correlativo: 'LPBRO6',
      servicio: 'Diseño de brochure',
      price: 'S/ 169.00',
      items: [
        'Diseño de (01) Propuesta de Brochure de (3) hojas - (6) Caras',
        'Entregable : Versión Digital e Impresión',
        'Diagramación : AsesorÍa en el la posiciones de textos y fotos',
        'Tiempo de Trabajo : 1 - 3 días',
        'Nuestros costos NO incluyen IGV.'
      ],
      sold: true
    },
    planBrochreplan3: {
      name: 'Brochure 4 hojas',
      correlativo: 'LPBRO8',
      servicio: 'Diseño de brochure',
      price: 'S/ 219.00',
      items: [
        'Diseño de (01) Propuesta de Brochure de (4) hojas - (8) Caras',
        'Entregable : Versión Digital e Impresión',
        'Diagramación : AsesorÍa en el la posiciones de textos y fotos',
        'Tiempo de Trabajo : 1 - 3 días',
        'Nuestros costos NO incluyen IGV.'
      ],
      sold: false
    },
    ManualMarcaplan1: {
      name: 'Plan cobre',
      price: '169.00',
      servicio: 'Diseño de Manual de marca',
      correlativo: 'LPMANUALC',
      items: [
        'Sintesis gráfica (elementos que conforman la marca).',
        'Marca gráfica',
        'Versiones (Posición del logo)',
        'Colores corporativos',
        'Colores complementarios',
        'Tipografía corporativa',
        'Tipografía complementaria',
        'Uso sobre fondo de color e imagen',
        'Uso incorrecto'
      ],
      sold: false,
      extra: ''
    },
    ManualMarcaplan2: {
      name: 'Plan Silver',
      price: '279.00',
      correlativo: 'LPMANUALS',
      servicio: 'Diseño de Manual de marca',
      items: [
        'Historia',
        'Visión y Misión',
        'Valores',
        'Sintesis gráfica (elementos que conforman la marca).',
        'Marca gráfica',
        'Versiones (Posición del logo)',
        'Colores corporativos',
        'Tipografía corporativa',
        'Uso sobre fondo de color e imagen',
        'Uso incorrecto'
      ],
      sold: true,
      extra: ''
    },
    Flyerplan1: {
      name: 'Plan emprendedor',
      price: 'S/ 89.00',
      correlativo: 'LPFLYER',
      servicio: 'Diseño de Flyer',
      items: [
        '3 Disenos de Flyers o Post',
        'Tiempo de entrega: 1 - 3 días o según cronograma.',
        'Incluye cronograma y coordinación de textos para post',
        'Temas para cada flyer - Consulte',
        'Nuestros costos NO incluyen IGV.'
      ],
      sold: false
    },
    Flyerplan2: {
      name: 'Plan silver',
      price: 'S/ 149.00',
      correlativo: 'LPFLYERS',
      servicio: 'Diseño de Flyer',
      items: [
        '6 Disenos de Flyers o Post',
        'Tiempo de entrega: 1 - 3 días o según cronograma.',
        'Incluye cronograma y coordinación de textos para post',
        'Temas para cada flyer - Consulte',
        'Nuestros costos NO incluyen IGV.'
      ],
      sold: true
    },
    Flyerplan3: {
      name: 'Plan golden',
      price: 'S/ 269.00',
      servicio: 'Diseño de Flyer',
      correlativo: 'LPFLYERG',
      items: [
        '12 Disenos de Flyers o Post',
        'Tiempo de entrega: 1 - 3 días o según cronograma.',
        'Incluye cronograma y coordinación de textos para post',
        'Temas para cada flyer - Consulte',
        'Nuestros costos NO incluyen IGV.'
      ],
      sold: false
    },
    WebInformativoplan1: {
      name: 'DISEÑO WEB INFORMATIVO ',
      price: 'S/ 499.00',
      correlativo: 'LPW',
      servicio: 'Desarrollo web',
      items: [
        'Hasta 4 internas, bajo nuestras propuestas <strong>( Plantillas Express )</strong> el cliente elegirá una ',
        'Desarrollamos un Brief',
        'Formularios de Contacto Dinámico. MAIL de repuesta al visitante. ',
        'Ubicación de la empresa o negocio a través de Google Maps. ',
        'NO Utilizamos plantillas o CMS Gratuitos de Internet',
        'WEB desarrollada desde CERO ',
        'Creación de Correos corporativos hasta 03 ',
        'Seguridad Anti Spam',
        'Interacción con Redes Sociales. (WhatsApp – Facebook – YouTube)',
        ' Administración Dominio .com <strong>GRATIS x un AÑO</strong>',
        'Alojamiento Web 1 GB (Sin Cpanel Independiente)  <strong>GRATIS x un AÑO</strong>',
        'Soporte Técnico. Por 01 mes (Solo atendemos incidencias o fallas en nuestro servicio).'
      ],
      sold: false,
      verMas: true,
      igv: true,
      tiempo: 5
    },
    WebInformativoplan3: {
      name: 'DISEÑO WEB INFORMATIVO + DISEÑO DE LOGO ',
      price: 'S/ 549.00',
      servicio: 'Desarrollo web',
      correlativo: 'LPW',
      adicionales: ['LP69'],
      items: [
        'Hasta 4 internas, bajo nuestras propuestas <strong>( Plantillas Express )</strong> el cliente elegirá una ',
        'Desarrollamos un Brief',
        'Formularios de Contacto Dinámico. MAIL de repuesta al visitante. ',
        'Ubicación de la empresa o negocio a través de Google Maps. ',
        'NO Utilizamos plantillas o CMS Gratuitos de Internet',
        'WEB desarrollada desde CERO ',
        'Creación de Correos corporativos hasta 05 ',
        'Seguridad Anti Spam',
        'Interacción con Redes Sociales. (WhatsApp – Facebook – YouTube)',
        ' Administración Dominio .com <strong>GRATIS x un AÑO</strong>',
        'Alojamiento Web 1 GB (Sin Cpanel Independiente)  <strong>GRATIS x un AÑO</strong>',
        'Soporte Técnico. Por 01 mes (Solo atendemos incidencias o fallas en nuestro servicio).',
        '<strong>DISEÑO O REDISEÑO DE LOGO:</strong>',
        '1 PROPUESTA',
        'Entregables: <strong>JPG - PNG - PDF - AI </strong> (editables)',
        'AsesorÍa en el desarrollo de nuestro Brief'
      ],
      sold: false,
      verMas: true,
      igv: true,
      tiempo: 5
    },
    WebInformativoplan2: {
      name: 'DISEÑO WEB INFORMATIVO - GOOGLE  - SEO ',
      price: 'S/ 699.00',
      servicio: 'Desarrollo web',
      correlativo: 'LPW',
      adicionales: ['LPSEO'],
      items: [
        'Hasta 4 internas, bajo nuestras propuestas <strong>( Plantillas Express )</strong> el cliente elegirá una ',
        'Desarrollamos un Brief',
        'Formularios de Contacto Dinámico. MAIL de repuesta al visitante. ',
        'Ubicación de la empresa o negocio a través de Google Maps. ',
        'NO Utilizamos plantillas o CMS Gratuitos de Internet',
        'WEB desarrollada desde CERO ',
        'Creación de Correos corporativos hasta 03 ',
        'Seguridad Anti Spam',
        'Interacción con Redes Sociales. (WhatsApp – Facebook – YouTube)',
        ' Administración Dominio .com <strong>GRATIS x un AÑO</strong>',
        'Alojamiento Web 1 GB (Sin Cpanel Independiente)  <strong>GRATIS x un AÑO</strong>',
        'Soporte Técnico. Por 01 mes (Solo atendemos incidencias o fallas en nuestro servicio).',
        '<strong>ALTA DE GOOGLE:</strong>',
        'Propiedad verificada',
        'Inicio de <strong>SEO</strong>, trabajo con Palabras claves, Script y otras técnicas de Posicionamiento',
        'Ubicación del negocio en <strong>Google MAP</strong>'
      ],
      sold: false,
      verMas: true,
      igv: true,
      tiempo: 6
    },
    WebLandingplan1: {
      name: 'DISEÑO WEB - LANDING PAGE - ADMINISTRABLE',
      price: 'S/ 399.00',
      correlativo: 'LPLANDING-ADM',
      servicio: 'Desarrollo web',
      items: [
        ' 01 interna de Aterrizaje - <strong>LANDING PAGE</strong>, El cliente elegirá una Plantilla ',
        'Formularios de Contacto Dinámico. ',
        'Desarrollo de <strong>Modulo Administrable - 1 sección</strong>',
        'Capación de Uso del modulo administrable',
        'Accesos o credenciales al administrador ',
        'Administración Dominio .com <strong>GRATIS x un AÑO</strong>',
        'Alojamiento Web <strong>500 MB</strong> (Sin Cpanel Independiente)  <strong>GRATIS x un AÑO</strong>',
        'NO Utilizamos plantillas o CMS Gratuitos de Internet',
        'WEB desarrollada desde CERO ',
        'Creación de <strong>03 cuentas de correo</strong>  Manual de Configuración GMAIL - Outloock  ',
        'Seguridad Anti Spam',
        'Interacción con Redes Sociales. (WhatsApp – Facebook – YouTube)',
        'Soporte Técnico. Por 01 mes (Solo atendemos incidencias o fallas en nuestro servicio).',
        '<strong>01 DISEÑO DE LOGO</strong>',
        '1 PROPUESTA',
        'HASTA 3 CAMBIOS'
      ],
      sold: false,
      verMas: true,
      igv: true,
      tiempo: 4
    },
    WebLandingplan2: {
      name: 'DISEÑO WEB - LANDING PAGE - TIENDA VIRTUAL',
      price: 'S/ 599.00',
      correlativo: 'LPLANDING-TV',
      servicio: 'Desarrollo web',
      items: [
        ' 01 interna de Aterrizaje - <strong>LANDING PAGE</strong>, El cliente elegirá una Plantilla ',
        'Formularios de Contacto Dinámico. ',
        'Desarrollo de modulo de administración y actualización de productos - 1 sección',
        'No incluye pasarela de pagos ',
        'Compra a traves de correo o Wsp ',
        'Capación de Uso del modulo administrable',
        'Accesos o credenciales al administrador ',
        'Administración Dominio .com <strong>GRATIS x un AÑO</strong>',
        'Alojamiento Web <strong>1000 MB</strong> (Sin Cpanel Independiente)  <strong>GRATIS x un AÑO</strong>',
        'NO Utilizamos plantillas o CMS Gratuitos de Internet',
        'WEB desarrollada desde CERO ',
        'Creación de <strong>03 cuentas de correo</strong>  Manual de Configuración GMAIL - Outloock  ',
        'Seguridad Anti Spam',
        'Interacción con Redes Sociales. (WhatsApp – Facebook – YouTube)',
        'Soporte Técnico. Por 01 mes (Solo atendemos incidencias o fallas en nuestro servicio).'
      ],
      sold: false,
      verMas: true,
      igv: true,
      tiempo: 5
    },
    WebAdministrableplan1: {
      name: 'DESARROLLO & DISEÑO WEB ADMINISTRABLE - PLAN EXPRESS',
      price: 'S/ 990.00',
      correlativo: 'LPWA',
      servicio: 'Desarrollo web',
      items: [
        'Hasta 4 internas, bajo nuestras propuestas <strong>( Plantillas Express )</strong> el cliente elegirá una ',
        'Desarrollamos un Brief',
        'Formularios de Contacto Dinámico. MAIL de repuesta al visitante. ',
        'Ubicación de la empresa o negocio a través de Google Maps. ',
        'NO Utilizamos plantillas o CMS Gratuitos de Internet',
        ' Administración Dominio .com <strong>GRATIS x un AÑO</strong>',
        'Alojamiento Web 3 GB (Sin Cpanel Independiente)  <strong>GRATIS x un AÑO</strong>',
        'WEB desarrollada desde CERO ',
        'Creación de Correos corporativos hasta 10 - Cliente nos remite sus nombres ',
        'Seguridad Anti Spam',
        'Interacción con Redes Sociales. (WhatsApp – Facebook – YouTube)',
        'Podrá <strong>ADMINISTRAR</strong> hasta <strong>01 Interna.</strong> NOTICIAS o PRODUCTOS o SERVICIOS o SLIDER',
        'Entrega de acceso al administrador.',
        'Manual de Usuario.',
        'Capacitación del sistema (En nuestra Agencia o VIRTUAL).',
        'Soporte Técnico. Por 01 mes (Solo atendemos incidencias o fallas en nuestro servicio + (01) cambio textuales e imágenes).'
      ],
      sold: false,
      verMas: true,
      igv: true,
      tiempo: 5
    },
    WebAdministrableplan2: {
      name: 'DESARROLLO & DISEÑO WEB ADMINISTRABLE - PLAN GOLDEN',
      price: 'S/ 1290.00',
      correlativo: 'LPWAG',
      servicio: 'Desarrollo web',
      items: [
        'Hasta 4 internas, bajo nuestras propuestas <strong>( Plantillas Express )</strong> el cliente elegirá una ',
        'Desarrollamos un Brief',
        'Formularios de Contacto Dinámico. MAIL de repuesta al visitante. ',
        'Ubicación de la empresa o negocio a través de Google Maps. ',
        'NO Utilizamos plantillas o CMS Gratuitos de Internet',
        ' Administración Dominio .com <strong>GRATIS x un AÑO</strong>',
        'Alojamiento Web 5 GB (Sin Cpanel Independiente)  <strong>GRATIS x un AÑO</strong>',
        'NO Utilizamos plantillas o CMS Gratuitos de Internet',
        'WEB desarrollada desde CERO ',
        'Creación de Correos corporativos hasta 15 - Cliente nos remite sus nombres ',
        'Seguridad Anti Spam',
        'Interacción con Redes Sociales. (WhatsApp – Facebook – YouTube)',
        'Podrá <strong>ADMINISTRAR</strong> hasta <strong>02 Interna.</strong> NOTICIAS o PRODUCTOS o SERVICIOS o SLIDER',
        'Entrega de acceso al administrador.',
        'Manual de Usuario.',
        'Capacitación del sistema (En nuestra Agencia o VIRTUAL).',
        'Soporte Técnico. Por 03 mes (Solo atendemos incidencias o fallas en nuestro servicio + (01) cambio textuales e imágenes).'
      ],
      sold: false,
      verMas: true,
      igv: true,
      tiempo: 8
    },
    WebAdministrableplan3: {
      name: 'DESARROLLO & DISEÑO WEB ADMINISTRABLE - PLAN EMPRESA',
      price: 'S/ 2420.00',
      correlativo: 'LPWAE',
      servicio: 'Desarrollo web',
      items: [
        'Hasta <strong>6 internas, A la medida del cliente.</strong> CLIENTE NOS REMITE SU EJEMPLO',
        'Desarrollamos un Brief A MEDIDA ',
        'Formularios de Contacto Dinámico. MAIL de repuesta al visitante. ',
        'Ubicación de la empresa o negocio a través de Google Maps. ',
        'Programación en PHP - Framework Laravel ',
        'Base de Datos Myql ',
        'HTML 5 , Booystrap, CSS3, jQUERY',
        'NO Utilizamos plantillas o CMS Gratuitos de Internet',
        'Creación de Correos corporativos hasta 30 - Cliente nos remite sus nombres ',
        ' Administración Dominio .com <strong>GRATIS x un AÑO</strong>',
        'Alojamiento Web Ilimitado (Cpanel Independiente)  <strong>GRATIS x un AÑO</strong>',
        'Interacción con Redes Sociales. (WhatsApp – Facebook – YouTube)',
        'Podrá <strong>ADMINISTRAR</strong> hasta <strong>04 Internas.</strong> NOTICIAS o PRODUCTOS o SERVICIOS o SLIDER',
        'Entrega de acceso al administrador.',
        'Manual de Usuario.',
        'Capacitación del sistema (En nuestra Agencia o VIRTUAL).',
        'Soporte Técnico. Por 06 mes (Solo atendemos incidencias o fallas en nuestro servicio + (01) cambio textuales e imágenes).',
        'Alta del desarrollo web a los buscadores <strong>GOOGLE</strong> - Inicio posicionamiento <strong>SEO</strong> Indexación de palabras claves - Keywords , coordinación directa con el cliente',
        '<strong> Google Analytics </strong>- Ud podrá medir quien lo visita - Metricas ',
        ' Retoque Fotográfico de Hasta 20'
      ],
      sold: false,
      verMas: true,
      igv: true,
      tiempo: 25
    },
    WebTiendaplan1: {
      name: 'DESARROLLO & DISEÑO de TIENDA VIRTUAL - ECOMMERCE - Plan Express',
      price: 'S/ 990.00',
      correlativo: 'LPTVE',
      servicio: 'Desarrollo web',
      items: [
        'Hasta 5 internas. Bajo Plantillas Pre determinadas (El cliente escoge una) ',
        'Desarrollamos un Brief A MEDIDA',
        'Integración de <strong> Carrito de COMPRAS.</strong>',
        '<strong>EL COSTO POR LA INTEGRACIÓN DEL SERVICIO DE COMERCIO ELECTRÓNICO, ES ASUMIDO POR EL CLIENTE </strong>',
        ' Pasarela de Pago: Mercado Pago: <br/> - Medio de pago: Tarjetas de crédito – Visa, Mastercard, American express y Diners Club.',
        'Registro de pagos en el sistema de mercado pago y en el sistema de la tienda virtual.',
        'Trabajamos nuestra programación y Maquetación desde CERO ',
        'Programación en PHP - Framework',
        'Soporte hasta <strong>100 productos</strong> ',
        'Administración Dominio .com <strong>GRATIS x un AÑO</strong>',
        'Alojamiento Web 3 GB (Sin Cpanel Independiente)  <strong>GRATIS x un AÑO</strong>',
        'Podrá <strong>ADMINISTRAR</strong> hasta <strong>02 Interna.</strong>',
        'NO Utilizamos plantillas o CMS Gratuitos de Internet',
        'WEB desarrollada desde CERO ',
        'Formularios de Contacto Dinámico. MAIL de repuesta al visitante.',
        'Ubicación de la empresa o negocio a través de Google Maps.',
        'Seguridad Anti Spam',
        'Interacción con Redes Sociales. (WhatsApp – Facebook – YouTube)',
        'Creación de hasta <strong>05 Correos Corporativos</strong> (Asesoria en su configuración)',
        'Entrega de acceso al administrador.',
        'Manual de Usuario.',
        'Capacitación del sistema (Vía VIRTUAL).',
        'Soporte Técnico. Por 03 mes (Solo atendemos incidencias o fallas en nuestro servicio + (01) cambio textuales e imágenes).',
        'Técnica de Posicionamiento Web (SEO).',
        ' Retoque Fotográfico de Hasta 15'
      ],
      sold: false,
      verMas: true,
      igv: true,
      tiempo: 10
    },
    WebTiendaplan2: {
      name: 'DESARROLLO & DISEÑO de TIENDA VIRTUAL - ECOMMERCE - Plan SILVER',
      price: 'S/ 1490.00',
      correlativo: 'LPTVS',
      servicio: 'Desarrollo web',
      items: [
        'Hasta 6 internas. Bajo Plantillas Pre determinadas (El cliente escoge una) ',
        'Desarrollamos un Brief A MEDIDA',
        'Integración de <strong> Carrito de COMPRAS.</strong>',
        '<strong>EL COSTO POR LA INTEGRACIÓN DEL SERVICIO DE COMERCIO ELECTRÓNICO, ES ASUMIDO POR EL CLIENTE </strong>',
        ' Pasarela de Pago: Mercado Pago: <br/> - Medio de pago: Tarjetas de crédito – Visa, Mastercard, American express y Diners Club.',
        'Registro de pagos en el sistema de mercado pago y en el sistema de la tienda virtual.',
        'Programación en PHP - Framework',
        'Soporte hasta <strong>300 productos</strong> ',
        'Administración Dominio .com <strong>GRATIS x un AÑO</strong>',
        'Alojamiento Web 8 GB (Sin Cpanel Independiente)  <strong>GRATIS x un AÑO</strong>',
        'Podrá <strong>ADMINISTRAR</strong> hasta <strong>03 Interna.</strong>',
        'NO Utilizamos plantillas o CMS Gratuitos de Internet',
        'WEB desarrollada desde CERO ',
        'Formularios de Contacto Dinámico. MAIL de repuesta al visitante.',
        'Ubicación de la empresa o negocio a través de Google Maps.',
        'Seguridad Anti Spam',
        'Interacción con Redes Sociales. (WhatsApp – Facebook – YouTube)',
        'Creación de hasta <strong>10 Correos Corporativos</strong> (Asesoria en su configuración)',
        'Entrega de acceso al administrador.',
        'Manual de Usuario.',
        'Capacitación del sistema (Vía VIRTUAL).',
        'Soporte Técnico. Por 03 mes (Solo atendemos incidencias o fallas en nuestro servicio + (01) cambio textuales e imágenes).',
        'Técnica de Posicionamiento Web (SEO).',
        ' Retoque Fotográfico de Hasta 15'
      ],
      sold: false,
      verMas: true,
      igv: true,
      tiempo: 15
    },
    WebTiendaplan3: {
      name: ' DESARROLLO & DISEÑO de TIENDA VIRTUAL - ECOMMERCE - Plan GOLDEN',
      price: 'S/ 2290.00',
      correlativo: 'LPTVG',
      servicio: 'Desarrollo web',
      items: [
        'Hasta 8 internas. A medida del cliente - <strong>Remite su ejemplo</strong>',
        'Desarrollamos un Brief A MEDIDA',
        'Integración de <strong> Carrito de COMPRAS.</strong>',
        '<strong>EL COSTO POR LA INTEGRACIÓN DEL SERVICIO DE COMERCIO ELECTRÓNICO, ES ASUMIDO POR EL CLIENTE </strong>',
        '<strong>Pasarela de Pago: CULQUI -  IZI PAY:</strong>',
        'Registro de pagos en el sistema de Culqui/iziPay y en el sistema de la tienda virtual.',
        'Trabajamos nuestra programación y Maquetación desde CERO ',
        'Programación en PHP - Framework',
        'Soporte <strong>Ilimitado de productos</strong> ',
        'Administración Dominio .com <strong>GRATIS x un AÑO</strong>',
        'Alojamiento Web 20 GB (Sin Cpanel Independiente)  <strong>GRATIS x un AÑO</strong>',
        'Podrá <strong>ADMINISTRAR</strong> hasta <strong>04 Interna.</strong>',
        'NO Utilizamos plantillas o CMS Gratuitos de Internet',
        'WEB desarrollada desde CERO ',
        'Formularios de Contacto Dinámico. MAIL de repuesta al visitante.',
        'Ubicación de la empresa o negocio a través de Google Maps.',
        'Seguridad Anti Spam',
        'Medio de pago: Tarjetas de crédito, yape, plin, tunki, pago efectivo, cuotealo.',
        'Mail de notificación al cliente automático.',
        'Mail de notificación al Gmail del negocio.',
        'Comprobante de pagos.',
        'Registro de datos del usuario.',
        'Interacción con Redes Sociales. (WhatsApp – Facebook – YouTube)',
        'Creación de hasta <strong>15 Correos Corporativos</strong> (Asesoria en su configuración)',
        'Indexación del <strong>CERTIFICADO SSL</strong>',
        'Entrega de acceso al administrador.',
        'Manual de Usuario.',
        'Capacitación del sistema (Vía VIRTUAL).',
        'Soporte Técnico. Por 06 mes (Solo atendemos incidencias o fallas en nuestro servicio + (01) cambio textuales e imágenes).',
        'Técnica de Posicionamiento Web (SEO).',
        '<strong>ALTA DE GOOGLE - TIENDA VIRTUAL: </strong>',
        `<ul>
                <li>Propiedad Verificada</li>
                <li>Inicio de <strong>SEO</strong>, trabajo con Palabras claves, Script y otras técnicas de Posicionamiento</li>
                <li>Ubicación del negocio en <strong>Google MAP</strong></li>
                <li>Retoque Fotográfico de Hasta 30</li>
            </ul>`,
        ' Retoque Fotográfico de Hasta 15'
      ],
      sold: false,
      verMas: true,
      igv: true,
      tiempo: 25
    }
  }

  const adicionalesList = [
    {
      name: 'Combo 1',
      precio: 90,
      listado: [{ name: 'TARJETA DE PRESENTACIÓN' }, { name: 'HOJA MEMBRETADA' }, { name: 'FIRMA DE DE CORREO' }]
    },
    {
      name: 'Diseño de portada',
      precio: 35,
      listado: null,
      precio_propuestas: 20,
      cantidad_propuestas: 1,
      estado_propuesta: true
    },
    {
      name: 'Diseño de etiquetas (02 propuestas)',
      precio: 90,
      listado: null
    },
    {
      name: 'Diseño de flyer o Post (01 propuesta)',
      precio: 35,
      listado: null,
      precio_propuestas: 20,
      cantidad_propuestas: 1,
      estado_propuesta: true
    },
    {
      name: 'Diseño de brochure (04 caras - 02 hojas)',
      precio: 129,
      listado: null
    },
    {
      name: 'Diseño de folder (01 propuesta)',
      precio: 60,
      listado: null
    },

    { name: 'Tarjeta de presentación', precio: 35, listado: null, precio_propuestas: 20, cantidad_propuestas: 1, estado_propuesta: true },
    { name: 'Hoja membretada', precio: 35, listado: null, precio_propuestas: 20, cantidad_propuestas: 1, estado_propuesta: true },
    { name: 'Firma de correo', precio: 35, listado: null, precio_propuestas: 20, cantidad_propuestas: 1, estado_propuesta: true }
  ]

  const calculateTotal = () => {
    const cartTotal = cart.reduce((total: number, cartItem: any) => {
      const item: any = Object.values(data).find((i: any) => i.correlativo === cartItem.correlativo)
      if (!item) {
        console.warn(`Producto no encontrado en los datos del servidor: ${cartItem.correlativo}`)
        return total // Ignora productos que no están validados
      }
      const precioValidado = parseFloat(item.price.replace(/[^\d.]/g, '')) || 0
      return total + precioValidado * cartItem.cantidad // Calcula subtotal del producto
    }, 0)
    const adicionalesTotal = adicionales.reduce((total: number, adicionalItem: any) => {
      const validAdicional = adicionalesList.find((a: any) => a.name == adicionalItem.nombre)
      if (!validAdicional) {
        return total
      }
      const precioValidado = validAdicional.precio || 0
      const propuestasCost = validAdicional.precio_propuestas
        ? validAdicional.precio_propuestas * Math.max(0, adicionalItem.cantidad_propuestas - 1) * adicionalItem.cantidad
        : 0
      return total + precioValidado * adicionalItem.cantidad + propuestasCost
    }, 0)
    return Number(cartTotal) + Number(adicionalesTotal)
  }

  const calculateTotalAdicionales = () => {
    const adicionalesTotal = adicionales.reduce((total: number, adicionalItem: any) => {
      const validAdicional = adicionalesList.find((a: any) => a.name == adicionalItem.nombre)
      if (!validAdicional) {
        return total
      }
      const precioValidado = validAdicional.precio || 0
      const propuestasCost = validAdicional.precio_propuestas
        ? validAdicional.precio_propuestas * Math.max(0, adicionalItem.cantidad_propuestas - 1) * adicionalItem.cantidad
        : 0
      return total + precioValidado * adicionalItem.cantidad + propuestasCost
    }, 0)

    return adicionalesTotal
  }
  const subtotal = calculateTotal()
  const igv = values.conFactura == 'Sin factura' ? 0 : calculateTotal() * 0.18
  const totalAdicionales = calculateTotalAdicionales()
  const descuento = 0
  const total = subtotal + igv - descuento

  return (
    <>
      <Toaster position="top-center" richColors />

      <div className="letter_style_products grid grid-cols-1 lg:grid-cols-5 gap-10 px-0 pb-4 lg:pb-4 lg:px-60 overflow-y-auto">
        <div className=" w-full bg-[#e8e6e6] text-black absolute h-[69px] top-0 left-0 right-0 flex lg:hidden items-center justify-center px-4 ">
          <div className="w-full flex items-center justify-between text-sm">
            <div className="flex gap-1 items-center" onClick={() => setMenuMovil(!menuMovil)}>
              <p>{menuMovil ? 'Ocultar resumen del pedido' : 'Mostrar resumen del pedido'}</p>
              <FaAngleLeft className={`text-gray-600 text-sm ${menuMovil ? 'rotate-90' : '-rotate-90'}`} />
            </div>
            <p className="font-bold text-lg">
              {total.toLocaleString('es-PE', {
                style: 'currency',
                currency: 'PEN'
              })}
            </p>
          </div>
        </div>
        <div className="mt-[69px] lg:mt-[0px] w-full lg:col-span-3">
          <AnimatePresence>
            {menuMovil && (
              <motion.div
                variants={variants}
                initial="hidden"
                animate="enter"
                exit="exit"
                transition={{ duration: 0.2 }} // Adjust the duration as needed
                className="flex flex-col lg:hidden pt-3 border-b bg-[#F4F8FF] border-b-gray-300 overflow-hidden"
              >
                <div className="px-4">
                  {cart.length > 0 &&
                    cart.map((cartItem: any, index: number) => {
                      const item: any = Object.values(data).find((i: any) => i.correlativo == cartItem.correlativo)
                      if (!item) return null
                      let imagen = 'https://automaq.pe/img/no_disponible.png'
                      if (item.servicio === 'Diseño de logotipo') {
                        imagen = '/assets/icons/logo.jpg'
                      } else if (item.servicio === 'Desarrollo web') {
                        imagen = '/assets/icons/web.jpg'
                      } else if (item.servicio === 'Diseño de brochure') {
                        imagen = '/assets/icons/brochure.jpg'
                      } else if (item.servicio === 'Diseño de Flyer') {
                        imagen = '/assets/icons/flyers.jpg'
                      } else if (item.servicio === 'Diseño de Manual de marca') {
                        imagen = '/assets/icons/manual_marca.jpg'
                      } else if (item.servicio === 'Capacitaciones') {
                        imagen = '/assets/icons/capacitaciones.jpg'
                      }
                      const precioLimpio = item.price.replace(/[^\d.]/g, '')
                      return (
                        <>
                          {!item ? null : (
                            <div
                              className={`w-full flex gap-6 items-center ${adicionales.length > 0 ? '' : 'border-b border-b-gray-200'} relative  py-2`}
                              key={index}
                            >
                              <div className="relative">
                                <img src={imagen} alt={item.servicio ?? ''} className="w-[60px] h-[60px] object-contain rounded-md" />
                              </div>
                              <div className="flex justify-between items-center w-full">
                                <div className="flex flex-col gap-0 w-auto">
                                  <h3 className="font-base text-base uppercase">{item.name}</h3>
                                  <h3 className="font-base text-sm text-black/60">{item.servicio}</h3>
                                </div>
                                <p className="text-base flex-1 whitespace-nowrap text-right  text-ellipsis font-bold">S/ {precioLimpio}</p>
                              </div>
                            </div>
                          )}
                        </>
                      )
                    })}
                  <p className="font-semibold my-2 text-base">Adicionales</p>

                  <div className="overflow-y-auto scroll_ligth ">
                    <div className="grid grid-cols-9 gap-4 border-b border-b-gray-200 py-2 text-xs text-gray-600">
                      <div className="font-bold col-span-2">Cantidad</div>
                      <div className="font-bold col-span-2">Nombre</div>
                      <div className="font-bold col-span-2">Propuestas</div>
                      <div className="font-bold col-span-2">Precio</div>
                      <div className="font-bold"></div>
                    </div>
                    {adicionales.map((itemProp: any) => {
                      const item: any = adicionalesList.find((a: any) => a.name == itemProp?.nombre)
                      if (!item) {
                        console.warn(`Adicional no encontrado en la lista válida: ${itemProp?.nombre}`)
                        return null
                      }
                      return (
                        <div key={item.id} className="grid grid-cols-9 gap-4 items-center border-b border-b-gray-200 py-2 text-sm group">
                          <div className="flex items-center gap-2 col-span-2">
                            <button
                              onClick={() => handleDecrementCantidad(itemProp.id)}
                              className="bg-gray-200 hover:bg-gray-300 rounded-full w-5 h-5 flex items-center justify-center transition-all "
                            >
                              -
                            </button>
                            <span className="rounded-full  text-black flex items-center justify-center text-xs ">{itemProp.cantidad}</span>
                            <button
                              onClick={() => handleIncrementCantidad(itemProp.id)}
                              className="bg-gray-200 hover:bg-gray-300 rounded-full w-5 h-5 flex items-center justify-center transition-all "
                            >
                              +
                            </button>
                          </div>
                          <div className="px-1 col-span-2">{item.name}</div>
                          <div className="col-span-2">
                            {item.cantidad_propuestas && (
                              <div className="flex items-center gap-2 ">
                                <button
                                  onClick={() => handleDecrement(itemProp.id)}
                                  className="bg-gray-200 hover:bg-gray-300 rounded-full w-5 h-5 flex items-center justify-center transition-all "
                                >
                                  -
                                </button>
                                <p>
                                  <span className="text-center">{String(itemProp.cantidad_propuestas).padStart(2, '0')}</span>
                                </p>
                                <button
                                  onClick={() => handleIncrement(itemProp.id)}
                                  className="bg-gray-200 hover:bg-gray-300 rounded-full w-5 h-5 flex items-center justify-center transition-all "
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="col-span-2">
                            {(
                              item.precio * itemProp.cantidad +
                              (item.precio_propuestas
                                ? Number(item.precio_propuestas) * Math.max(0, Number(itemProp.cantidad_propuestas) - 1) * itemProp.cantidad
                                : 0)
                            ).toLocaleString('es-PE', {
                              style: 'currency',
                              currency: 'PEN'
                            })}
                          </div>

                          <div className="flex justify-center ">
                            <span
                              onClick={() => removeAdicional(itemProp.id)}
                              className="rounded-full w-[20px] h-[20px] text-red-600 flex items-center justify-center text-xl hover:text-red-700 transition-all cursor-pointer hover:scale-110"
                            >
                              <TiDelete />
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </div>
                <div className="w-full mt-2 px-4">
                  <button
                    type="button"
                    onClick={() => setOpenAdicional(!openAdicional)}
                    className="bg-main px-4 py-1 rounded-lg text-white text-sm font-bold hover:bg-darKmain transition-colors"
                  >
                    Agregar más
                  </button>
                </div>
                <div className="w-full py-2 mt-0 text-base px-4">
                  <div className="w-full flex justify-between">
                    <p className=" text-gray-500">Subtotal:</p>
                    <p>
                      {subtotal.toLocaleString('es-PE', {
                        style: 'currency',
                        currency: 'PEN'
                      })}
                    </p>
                  </div>
                  {igv > 0 && (
                    <div className="w-full flex mt-1 justify-between">
                      <p className="text-gray-500">IGV:</p>
                      <p>
                        {igv.toLocaleString('es-PE', {
                          style: 'currency',
                          currency: 'PEN'
                        })}
                      </p>
                    </div>
                  )}
                  {totalAdicionales > 2 && descuento > 0 && (
                    <div className="w-full flex mt-1 justify-between">
                      <p className="text-gray-500">Descuento:</p>
                      <p className=" text-red-600">
                        -
                        {descuento.toLocaleString('es-PE', {
                          style: 'currency',
                          currency: 'PEN'
                        })}
                      </p>
                    </div>
                  )}
                  <div className="w-full flex justify-between text-black font-bold text-lg mt-4 mb-2">
                    <p className="">Total:</p>
                    <p className="flex gap-2 items-end">
                      <span className="text-gray-400 text-sm">PEN</span>
                      {total.toLocaleString('es-PE', {
                        style: 'currency',
                        currency: 'PEN'
                      })}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
          <form onSubmit={handleSubmit} className="w-full lg:pt-[20px]  px-4 lg:px-0">
            <Regresar />
            <div className="w-fit mt-3">
              <h2 className="text-xl font-bold text-black">Contacto</h2>
            </div>
            <div className="flex  flex-col w-full mt-2 gap-3">
              <div className="flex flex-col lg:flex-row gap-3 w-full">
                <div className="w-full relative h-fit">
                  <input
                    type="email"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className={'border border-gray-300 px-4 py-4 rounded-lg text-sm w-full outline-gray-300'}
                    placeholder="Correo electrónico"
                  />
                  <Errors errors={errors.email} touched={touched.email} />
                </div>

                <div className="w-full relative">
                  <input
                    name="celular"
                    type="text"
                    value={values.celular}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="border border-gray-300 px-4 py-4 rounded-lg text-sm w-full outline-gray-300"
                    placeholder="Celular"
                  />
                  <Errors errors={errors.celular} touched={touched.celular} />
                </div>
              </div>
            </div>
            {/* SELECTED */}
            <div className="flex flex-col gap-3 mt-3">
              <div className="flex flex-col w-full border border-gray-300 rounded-lg relative overflow-hidden">
                <div className="w-full relative">
                  <label htmlFor="" className="text-xs text-gray-400 absolute top-2 left-4">
                    Pais/Region
                  </label>
                  <select
                    name="pais"
                    value={values.pais}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full h-full outline-none px-3 pt-5 pb-2 text-black"
                  >
                    <option value="Perú">Perú</option>
                    <option value="Otro">Otro</option>
                  </select>
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="w-full relative h-fit">
                  <input
                    name="nombres"
                    type="text"
                    value={values.nombres}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full h-full border border-gray-300 outline-gray-300 rounded-lg px-4 py-4 text-black"
                    placeholder="Tus nombres"
                  />
                  <Errors errors={errors.nombres} touched={touched.nombres} />
                </div>
                <div className="relative w-full h-fit">
                  <input
                    name="apellidos"
                    type="text"
                    value={values.apellidos}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full h-full border border-gray-300 outline-gray-300 rounded-lg px-4 py-4 text-black"
                    placeholder="Tus Apellidos"
                  />
                  <Errors errors={errors.apellidos} touched={touched.apellidos} />
                </div>
              </div>
              <div className="flex flex-col lg:flex-row gap-3">
                <div className="relative w-full h-fit">
                  <input
                    name="dni"
                    type="text"
                    value={values.dni}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full h-full border border-gray-300 outline-gray-300 rounded-lg px-4 py-4 text-black"
                    placeholder="DNI"
                  />
                  <Errors errors={errors.dni} touched={touched.dni} />
                </div>
                <div className="relative w-full h-fit">
                  <select
                    name="conFactura"
                    value={values.conFactura}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full h-full border border-gray-300 outline-gray-300 rounded-lg px-4 py-4 text-black"
                  >
                    <option value="Sin factura">Sin factura</option>
                    <option value="Con factura">Con factura</option>
                  </select>
                  <Errors errors={errors.conFactura} touched={touched.conFactura} />
                </div>
              </div>
              {values.conFactura == 'Con factura' && (
                <div className="flex flex-col lg:flex-row gap-3">
                  <div className="relative w-full h-fit">
                    <input
                      name="razonSocial"
                      type="text"
                      value={values.razonSocial}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full h-full border border-gray-300 outline-gray-300 rounded-lg px-4 py-4 text-black"
                      placeholder="Razón Social"
                    />
                    <Errors errors={errors.razonSocial} touched={touched.razonSocial} />
                  </div>
                  <div className="relative w-full h-fit">
                    <input
                      name="ruc"
                      type="number"
                      value={values.ruc}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full h-full border border-gray-300 outline-gray-300 rounded-lg px-4 py-4 text-black"
                      placeholder="RUC"
                    />
                    <Errors errors={errors.ruc} touched={touched.ruc} />
                  </div>
                </div>
              )}
              <div className="flex gap-3">
                <div className="w-full relative h-fit">
                  <textarea
                    name="mensaje"
                    value={values.mensaje}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full h-[100px] border resize-none border-gray-300 outline-gray-300 rounded-lg px-4 py-4 text-black"
                    placeholder="Comentarios (opcional)"
                  />
                  <Errors errors={errors.mensaje} touched={touched.mensaje} />
                </div>
              </div>
            </div>
            <div className="w-full mt-6">
              <h2 className="text-xl font-bold text-black">Pago</h2>
              <p className="text-gray-400">Todas las transacciones son seguras y privadas</p>
              <div className="mt-4 w-full">
                <div className="flex gap-3 px-4 py-4 items-center w-full rounded-t-lg roundend-x-lg transition-colors border border-main bg-[#F5F6FB]">
                  <FaCircleDot className="w-[15px] h-[15px] text-main transition-colors" />
                  <div className="w-full flex justify-between">
                    <p className="text-black">Mercado pago</p>
                  </div>
                </div>
                <div className="w-full bg-[#F4F4F4] border-gray-400 rounded-b-lg border-x border-b p-4 ">
                  <div className="flex flex-col gap-4 w-[70%] mx-auto">
                    <img src="/assets/svgPago.svg" alt="" className="text-gray-300 w-[170px] mx-auto" />
                    <p className="text-center">
                      Luego de hacer clic en “Pagar ahora”, serás redirigido a Mercado Pago para completar tu compra de forma segura.
                    </p>
                  </div>
                </div>
                {cart.length > 0 && (
                  <>
                    {auth.id ? (
                      <button
                        type={`${loading ? 'button' : 'submit'}`}
                        disabled={loading}
                        className={`rounded-lg ${!loading ? 'bg-main hover:bg-darKmain' : 'bg-darKmain'} transition-colors text-white font-bold w-full text-center py-3 px-4 mt-10 text-lg`}
                      >
                        {!loading ? 'Pagar ahora' : 'Cargando...'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setOpen(!open)}
                        className={`rounded-lg ${!loading ? 'bg-main hover:bg-darKmain' : 'bg-darKmain'} transition-colors text-white font-bold w-full text-center py-3 px-4 mt-10 text-lg`}
                      >
                        Iniciar sesión
                      </button>
                    )}
                  </>
                )}
              </div>
            </div>
          </form>
        </div>

        <div className="hidden fixed right-0 pt-[20px] pr-56 w-[41%] h-[calc(100vh-109px)] pl-8 lg:flex flex-col gap-2 border-l border-gray-300 bg-white ">
          {cart.length > 0 && (
            <>
              <div className="overflow-y-auto scroll_ligth pr-4">
                {cart.length > 0 &&
                  cart.map((cartItem: any, index: number) => {
                    const item: any = Object.values(data).find((i: any) => i.correlativo == cartItem.correlativo)
                    if (!item) return null
                    let imagen = 'https://automaq.pe/img/no_disponible.png'
                    if (item.servicio === 'Diseño de logotipo') {
                      imagen = '/assets/icons/logo.jpg'
                    } else if (item.servicio === 'Desarrollo web') {
                      imagen = '/assets/icons/web.jpg'
                    } else if (item.servicio === 'Diseño de brochure') {
                      imagen = '/assets/icons/brochure.jpg'
                    } else if (item.servicio === 'Diseño de Flyer') {
                      imagen = '/assets/icons/flyers.jpg'
                    } else if (item.servicio === 'Diseño de Manual de marca') {
                      imagen = '/assets/icons/manual_marca.jpg'
                    } else if (item.servicio === 'Capacitaciones') {
                      imagen = '/assets/icons/capacitaciones.jpg'
                    }
                    const precioLimpio = item.price.replace(/[^\d.]/g, '')
                    return (
                      <>
                        {!item ? null : (
                          <div
                            className={`w-full flex gap-6 items-center ${adicionales.length > 0 ? '' : 'border-b border-b-gray-200'} relative  py-2`}
                            key={index}
                          >
                            <div className="relative">
                              <img src={imagen} alt={item.servicio} className="w-[80px] h-[80px] object-contain rounded-md" />
                            </div>
                            <div className="flex justify-between gap-4 items-center w-full">
                              <div className="flex flex-col gap-0">
                                <h3 className="font-base text-base uppercase">{item.name}</h3>
                                <h3 className="font-base text-sm text-black/60">{item.servicio}</h3>
                              </div>
                              <p className="font-base text-lg whitespace-nowrap font-bold">S/ {precioLimpio}</p>
                            </div>
                          </div>
                        )}
                      </>
                    )
                  })}
                {adicionales.length > 0 && (
                  <>
                    <p className="font-semibold my-2 text-base">Adicionales</p>
                    <div className="grid grid-cols-9 gap-4 border-b border-b-gray-200 py-2 text-xs text-gray-600">
                      <div className="font-bold col-span-2">Cantidad</div>
                      <div className="font-bold col-span-2">Nombre</div>
                      <div className="font-bold col-span-2">Propuestas</div>
                      <div className="font-bold col-span-2">Precio</div>
                      <div className="font-bold"></div>
                    </div>
                    {adicionales.map((itemProp: any) => {
                      const item: any = adicionalesList.find((a: any) => a.name === itemProp?.nombre)
                      if (!item) {
                        return null // Ignorar adicionales no válidos
                      }
                      return (
                        <div key={item.id} className="grid grid-cols-9 gap-4 items-center border-b border-b-gray-200 py-2 text-sm group">
                          <div className="flex items-center gap-2 col-span-2">
                            <button
                              onClick={() => handleDecrementCantidad(itemProp.id)}
                              className="bg-gray-200 hover:bg-gray-300 rounded-full w-5 h-5 flex items-center justify-center transition-all "
                            >
                              -
                            </button>
                            <span className="rounded-full  text-black flex items-center justify-center text-xs ">{itemProp.cantidad}</span>
                            <button
                              onClick={() => handleIncrementCantidad(itemProp.id)}
                              className="bg-gray-200 hover:bg-gray-300 rounded-full w-5 h-5 flex items-center justify-center transition-all "
                            >
                              +
                            </button>
                          </div>
                          <div className="px-1 col-span-2">{item.name}</div>
                          <div className="col-span-2">
                            {itemProp.cantidad_propuestas && (
                              <div className="flex items-center gap-2 ">
                                <button
                                  onClick={() => handleDecrement(itemProp.id)}
                                  className="bg-gray-200 hover:bg-gray-300 rounded-full w-5 h-5 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                >
                                  -
                                </button>
                                <p>
                                  <span className="text-center">{String(itemProp.cantidad_propuestas).padStart(2, '0')}</span>
                                </p>
                                <button
                                  onClick={() => handleIncrement(itemProp.id)}
                                  className="bg-gray-200 hover:bg-gray-300 rounded-full w-5 h-5 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100"
                                >
                                  +
                                </button>
                              </div>
                            )}
                          </div>
                          <div className="col-span-2">
                            {(
                              item.precio * itemProp.cantidad +
                              (item.precio_propuestas
                                ? Number(item.precio_propuestas) * Math.max(0, Number(itemProp.cantidad_propuestas) - 1) * itemProp.cantidad
                                : 0)
                            ).toLocaleString('es-PE', {
                              style: 'currency',
                              currency: 'PEN'
                            })}
                          </div>

                          <div className="flex justify-center ">
                            <span
                              onClick={() => removeAdicional(itemProp.id)}
                              className="rounded-full w-[20px] h-[20px] text-red-600 flex items-center justify-center text-xl hover:text-red-700 transition-all cursor-pointer hover:scale-110"
                            >
                              <TiDelete />
                            </span>
                          </div>
                        </div>
                      )
                    })}
                  </>
                )}
              </div>
              <div className="w-full mt-2">
                <button
                  type="button"
                  onClick={() => setOpenAdicional(!openAdicional)}
                  className="bg-main px-4 py-1 rounded-lg text-white text-sm font-bold hover:bg-darKmain transition-colors"
                >
                  Agregar más
                </button>
              </div>
            </>
          )}

          <div className="w-full py-2 mt-0 text-base pr-4">
            <div className="w-full flex justify-between">
              <p className=" text-gray-500">Subtotal:</p>
              <p>
                {subtotal.toLocaleString('es-PE', {
                  style: 'currency',
                  currency: 'PEN'
                })}
              </p>
            </div>
            {values.conFactura == 'Con factura' && (
              <div className="w-full flex mt-1 justify-between">
                <p className="text-gray-500">IGV:</p>
                <p>
                  {igv.toLocaleString('es-PE', {
                    style: 'currency',
                    currency: 'PEN'
                  })}
                </p>
              </div>
            )}
            {totalAdicionales > 2 && descuento > 0 && (
              <div className="w-full flex mt-1 justify-between">
                <p className="text-gray-500">Descuento:</p>
                <p className=" text-red-600">
                  -
                  {descuento.toLocaleString('es-PE', {
                    style: 'currency',
                    currency: 'PEN'
                  })}
                </p>
              </div>
            )}
            <div className="w-full flex justify-between text-black font-bold text-lg mt-4 mb-2">
              <p className="">Total:</p>
              <p className="flex gap-2 items-end">
                <span className="text-gray-400 text-sm">PEN</span>
                {total.toLocaleString('es-PE', {
                  style: 'currency',
                  currency: 'PEN'
                })}
              </p>
            </div>
          </div>
        </div>
      </div>
      <>
        <Modal open={openAdicional} setOpen={setOpenAdicional} setAdicionales={setAdicionales} />
        <ResetPassword setOpen={setOpenPass} open={openPass} setOpenLogin={setOpen} />
        <LoginPago setOpen={setOpen} open={open} setOpenRegister={setOpenRegister} setOpenPass={setOpenPass} />
        <Register setOpen={setOpenRegister} open={openRegister} setOpenLogin={setOpen} />
      </>
    </>
  )
}
