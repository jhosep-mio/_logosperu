'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Autoplay, Navigation } from 'swiper/modules'
import { useEffect } from 'react'
import 'swiper/css/navigation'
import { CardPlanes } from '@/public/components/servicios/planes/CardPlanes'
import { IoChevronForward } from 'react-icons/io5'
const SwiperPlanes = ({ servicio }: { servicio: string }) => {
  useEffect(() => {
    // Selecciona el botón que quieres mover y el contenedor de destino
    const swiperButtonPrev = document.querySelector('.swiper-button-prev')
    const swiperButtonNext = document.querySelector('.swiper-button-next')
    const destinationContainer = document.querySelector('#swiper_button')
    // Mueve el botón al contenedor de destino si ambos elementos existen
    if (swiperButtonPrev && destinationContainer && swiperButtonNext) {
      destinationContainer.appendChild(swiperButtonPrev)
      destinationContainer.appendChild(swiperButtonNext)
    }
  }, [])

  const planesDiseno = {
    plan69: {
      name: 'Plan Emprendedor',
      servicio: 'Diseño de logotipo',
      price: 'S/ 89.00',
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
      extra: (
        <div className="pl-5">
          <ul className="flex text-xs md:text-base flex-col gap-2">
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Amplia Experiencia de trabajos a Distancia. (Fuera de Lima)
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Tiempo de entrega : 03 días
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Forma de Trabajo : Bajo Contrato.
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Nuestros costos NO incluyen IGV
            </li>
          </ul>
        </div>
      ),
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
      extra: (
        <div className="pl-5">
          <ul className="flex text-xs md:text-base flex-col gap-2">
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Tiempo de entrega : 04 días hábiles
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Forma de Trabajo : Bajo Contrato.
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Nuestros costos NO incluyen IGV
            </li>
          </ul>
        </div>
      ),
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
      extra: (
        <div className="pl-5">
          <ul className="flex text-xs md:text-base flex-col gap-2">
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Tiempo de entrega : 04 días hábiles
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Forma de Trabajo : Bajo Contrato.
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Nuestros costos NO incluyen IGV
            </li>
          </ul>
        </div>
      ),
      sold: false,
      igv: true,
      tiempo: 7
    }
  }
  const planesBrochure = {
    plan1: {
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
      ],
      sold: false,
      extra: (
        <div className="pl-5">
          <h5 className="font-extrabold mt-8 mb-5">EL CLIENTE NOS REMITE: </h5>
          <ul className="flex flex-col gap-3">
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-32xl" />
              Logotipo en versión editable.
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-32xl" />
              Textos e imágenes o Fotos en alta resolución.
            </li>
          </ul>
        </div>
      )
    },
    plan2: {
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
      sold: true,
      extra: (
        <div className="pl-5">
          <h5 className="font-extrabold mt-8 mb-5">EL CLIENTE NOS REMITE: </h5>
          <ul className="flex flex-col gap-3">
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-32xl" />
              Logotipo en versión editable.
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-32xl" />
              Textos e imágenes o Fotos en alta resolución.
            </li>
          </ul>
        </div>
      )
    },
    plan3: {
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
      sold: false,
      extra: (
        <div className="pl-5">
          <h5 className="font-extrabold mt-8 mb-5">EL CLIENTE NOS REMITE: </h5>
          <ul className="flex flex-col gap-3">
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-32xl" />
              Logotipo en versión editable.
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-32xl" />
              Textos e imágenes o Fotos en alta resolución.
            </li>
          </ul>
        </div>
      )
    }
  }
  const planesMarca = {
    plan1: {
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
    plan2: {
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
    }
  }
  const planesFlyers = {
    plan1: {
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
      sold: false,
      extra: (
        <div className="pl-5">
          <h5 className="font-extrabold mt-8 mb-5">EL CLIENTE NOS REMITE: </h5>
          <ul className="flex flex-col gap-3">
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-32xl" />
              Logotipo en versión editable.
            </li>
          </ul>
        </div>
      )
    },
    plan2: {
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
      sold: true,
      extra: (
        <div className="pl-5">
          <h5 className="font-extrabold mt-8 mb-5">EL CLIENTE NOS REMITE: </h5>
          <ul className="flex flex-col gap-3">
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-32xl" />
              Logotipo en versión editable.
            </li>
          </ul>
        </div>
      )
    },
    plan3: {
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
      sold: false,
      extra: (
        <div className="pl-5">
          <h5 className="font-extrabold mt-8 mb-5">EL CLIENTE NOS REMITE: </h5>
          <ul className="flex flex-col gap-3">
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-32xl" />
              Logotipo en versión editable.
            </li>
          </ul>
        </div>
      )
    }
  }
  const planesWebInformativo = {
    plan1: {
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
      extra: (
        <div className="pl-5">
          <h5 className="font-extrabold mt-5 text-xs md:text-base mb-5">
            EL CLIENTE NOS REMITE:{' '}
          </h5>
          <ul className="flex text-xs md:text-base flex-col gap-2">
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Su logotipo editable (PSD – Ai – CDR).
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Entrega de textos para la página web.
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Nos remite Fotos e imágenes en buena resolución.
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Entrega de datos de contacto
            </li>
          </ul>
        </div>
      ),
      igv: true,
      tiempo: 5
    },
    plan3: {
      name: 'DISEÑO WEB INFORMATIVO + DISEÑO DE LOGO ',
      price: 'S/ 549.00',
      servicio: 'Desarrollo web',
      correlativo: 'LPW',
      adicionales: [
        'LP69'
      ],
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
      extra: (
        <div className="pl-5">
          <h5 className="font-extrabold mt-5 text-xs md:text-base mb-5">
            EL CLIENTE NOS REMITE:{' '}
          </h5>
          <ul className="flex text-xs md:text-base flex-col gap-2">
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Su logotipo editable (PSD – Ai – CDR).
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Entrega de textos para la página web.
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Nos remite Fotos e imágenes en buena resolución.
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Entrega de datos de contacto
            </li>
          </ul>
        </div>
      ),
      verMas: true,
      igv: true,
      tiempo: 5
    },
    plan2: {
      name: 'DISEÑO WEB INFORMATIVO - GOOGLE  - SEO ',
      price: 'S/ 699.00',
      servicio: 'Desarrollo web',
      correlativo: 'LPW',
      adicionales: [
        'LPSEO'
      ],
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
    }
  }
  const planesWebLanding = {
    plan1: {
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
      extra: (
        <div className="pl-5">
          <h5 className="font-extrabold mt-5 text-xs md:text-base mb-5">
            EL CLIENTE NOS REMITE:{' '}
          </h5>
          <ul className="flex text-xs md:text-base flex-col gap-2">
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Su logotipo editable (PSD – Ai – CDR).
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Entrega de textos para la página web.
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Nos remite Fotos e imágenes en buena resolución.
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Entrega de datos de contacto
            </li>
          </ul>
        </div>
      ),
      igv: true,
      tiempo: 4
    },
    plan2: {
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
      extra: (
        <div className="pl-5">
          <h5 className="font-extrabold mt-5 text-xs md:text-base mb-5">
            EL CLIENTE NOS REMITE:{' '}
          </h5>
          <ul className="flex text-xs md:text-base flex-col gap-2">
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Su logotipo editable (PSD – Ai – CDR).
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Entrega de textos para la página web.
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Nos remite Fotos e imágenes en buena resolución.
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Entrega de datos de contacto
            </li>
          </ul>
        </div>
      ),
      igv: true,
      tiempo: 5
    }
  }
  const planesWebAdministrable = {
    plan1: {
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
      extra: (
        <div className="pl-5">
          <h5 className="font-extrabold mt-5 text-xs md:text-base mb-5">
            EL CLIENTE NOS REMITE:{' '}
          </h5>
          <ul className="flex text-xs md:text-base flex-col gap-2">
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Su logotipo editable (PSD – Ai – CDR).
            </li>

            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Nos remite Fotos e imágenes en buena resolución.
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Entrega de datos de contacto
            </li>
          </ul>
        </div>
      ),
      igv: true,
      tiempo: 5
    },
    plan2: {
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
      extra: (
        <div className="pl-5">
          <h5 className="font-extrabold mt-5 text-xs md:text-base mb-5">
            EL CLIENTE NOS REMITE:{' '}
          </h5>
          <ul className="flex text-xs md:text-base flex-col gap-2">
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Su logotipo editable (PSD – Ai – CDR).
            </li>

            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Nos remite Fotos e imágenes en buena resolución.
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Entrega de datos de contacto
            </li>
          </ul>
        </div>
      ),
      igv: true,
      tiempo: 8
    },
    plan3: {
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
      extra: (
        <div className="pl-5">
          <h5 className="font-extrabold mt-5 text-xs md:text-base mb-5">
            EL CLIENTE NOS REMITE:{' '}
          </h5>
          <ul className="flex text-xs md:text-base flex-col gap-2">
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Su logotipo editable (PSD – Ai – CDR).
            </li>

            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Nos remite Fotos e imágenes en buena resolución.
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Entrega de datos de contacto
            </li>
          </ul>
        </div>
      ),
      igv: true,
      tiempo: 25
    }
  }
  const planesWebTienda = {
    plan1: {
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
      extra: (
        <div className="pl-5">
          <h5 className="font-extrabold mt-5 text-xs md:text-base mb-5">
            EL CLIENTE NOS REMITE:{' '}
          </h5>
          <ul className="flex text-xs md:text-base flex-col gap-2">
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Su logotipo editable (PSD – Ai – CDR).
            </li>

            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Nos remite Fotos e imágenes en buena resolución.
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Entrega de datos de contacto
            </li>
          </ul>
        </div>
      ),
      igv: true,
      tiempo: 10
    },
    plan2: {
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
      extra: (
        <div className="pl-5">
          <h5 className="font-extrabold mt-5 text-xs md:text-base mb-5">
            EL CLIENTE NOS REMITE:{' '}
          </h5>
          <ul className="flex text-xs md:text-base flex-col gap-2">
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Su logotipo editable (PSD – Ai – CDR).
            </li>

            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Nos remite Fotos e imágenes en buena resolución.
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Entrega de datos de contacto
            </li>
          </ul>
        </div>
      ),
      igv: true,
      tiempo: 15
    },
    plan3: {
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
      extra: (
        <div className="pl-5">
          <h5 className="font-extrabold mt-5 text-xs md:text-base mb-5">
            EL CLIENTE NOS REMITE:{' '}
          </h5>
          <ul className="flex text-xs md:text-base flex-col gap-2">
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Su logotipo editable (PSD – Ai – CDR).
            </li>

            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Nos remite Fotos e imágenes en buena resolución.
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Entrega de datos de contacto
            </li>
          </ul>
        </div>
      ),
      igv: true,
      tiempo: 25
    }
  }

  return (
    <section
      className="container relative overflow-hidden h-fit"
      id="swiper_button"
    >
      <div
        className={
          'w-full h-fit  mx-auto flex flex-col overflow-x-clip lg:flex-row md:items-start gap-y-5 relative font_Archivo_bold '
        }
      >
        {Object.values(servicio) && (
          <Swiper
            className="w-full flex justify-center items-center swiper_planes_logo"
            loop
            spaceBetween={30}
            speed={300}
            navigation
            autoplay={{
              delay: 7000,
              reverseDirection: false
            }}
            breakpoints={{
              0: {
                slidesPerView: 1,
                centeredSlides: false
              },
              768: {
                slidesPerView: 2,
                centeredSlides: false
              },
              992: {
                slidesPerView: 2,
                centeredSlides: false
              },
              1200: {
                slidesPerView: servicio === 'Manual de marca' ? 2 : 3,
                centeredSlides: false
              }
            }}
            modules={[Autoplay, Navigation]}
          >
            {Object.values(
              servicio === 'Diseño de logotipo' ? planesDiseno : servicio === 'Diseño de brochure'
                ? planesBrochure
                : servicio === 'Manual de marca'
                  ? planesMarca
                  : servicio === 'Diseño de flyers'
                    ? planesFlyers
                    : servicio === 'Diseño web informativo'
                      ? planesWebInformativo
                      : servicio === 'Desarrollo web landingpage'
                        ? planesWebLanding
                        : servicio === 'Desarrollo web administrable'
                          ? planesWebAdministrable
                          : servicio === 'Desarrollo web tienda'
                            ? planesWebTienda
                            : '').map((plan, index) => (
              <SwiperSlide
                key={index}
                className="w-full h-full my-auto transition-all"
              >
                <CardPlanes plan={plan} />
              </SwiperSlide>
            ))}
            {Object.values(
              servicio === 'Diseño de logotipo'
                ? planesDiseno
                : servicio === 'Diseño de brochure'
                  ? planesBrochure
                  : servicio === 'Manual de marca'
                    ? planesMarca
                    : servicio === 'Diseño de flyers'
                      ? planesFlyers
                      : servicio === 'Diseño web informativo'
                        ? planesWebInformativo
                        : servicio === 'Desarrollo web landingpage'
                          ? planesWebLanding
                          : servicio === 'Desarrollo web administrable'
                            ? planesWebAdministrable
                            : servicio === 'Desarrollo web tienda'
                              ? planesWebTienda
                              : ''
            ).map((plan, index) => (
              <SwiperSlide
                key={index}
                className="w-full h-full my-auto transition-all"
              >
                <CardPlanes plan={plan} />
              </SwiperSlide>
            ))}
          </Swiper>
        )}
      </div>
    </section>
  )
}

export default SwiperPlanes
