'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Autoplay, Navigation } from 'swiper/modules'
import { useEffect } from 'react'
import 'swiper/css/navigation'
import { CardPlanes } from '../../planes/CardPlanes'

export const PlanesFacebook = () => {
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

  const planesCapaFacebook = {
    plan1: {
      name: 'PLAN EMPRENDIMIENTO - CAPACITACIÓN DE FACEBOOK ADS ',
      price: 'S/ 99.00',
      correlativo: 'LPFADSE',
      servicio: 'Capacitaciones',
      items: [
        '<strong>Objetivo:</strong> Introducción rápida y ejecución básica de anuncios en Facebook Ads durante la reunión virtual.',
        'Entrega de un manual de usuario básico sobre Facebook Ads antes de la reunión.',
        'Introducción a Facebook Ads',
        'Promocionar Publicación',
        'Administrador de Anuncios',
        'Campaña de Ventas',
        'Segmentación Detallada',
        'Anuncios de Video',
        'Públicos Personalizados',
        'Métricas Claves en Facebook Ads',
        'Errores Comunes en Facebook Ads',
        '<strong>Realización de una capacitación en vivo durante la reunión virtual para aprender los conceptos básicos de Facebook Ads.</strong>',
        'Introducción explicando la estructura y objetivos de la capacitación.',
        'Explicación detallada de los elementos de la interfaz de Facebook Ads.',
        'Panel de control.',
        'Menús y opciones principales.',
        'Herramientas de análisis y seguimiento.',
        'Identificación del objetivo del anuncio (por ejemplo, promocionar un producto o servicio específico).',
        'Selección de tipo de campaña.',
        'Configuración de presupuesto y segmentación.',
        'Configuración de públicos objetivo.',
        'Revisión y publicación del anuncio en tiempo real.',
        '<strong><em>Ejercicio Práctico: Crear un anuncio simple durante la sesión de capacitación en la reunión virtual utilizando Facebook Ads.</em></strong>'
      ],
      sold: false,
      verMas: true,
      unique: true,
      igv: false,
      tiempo: 1,
      plan: '',
      vendido: false,
      extra: '',
      capacitacion: true

    },
    plan2: {
      name: 'PLAN INTERMEDIO- CAPACITACIÓN DE FACEBOOK ADS ',
      price: 'S/ 269.00',
      correlativo: 'LPFADSI',
      servicio: 'Capacitaciones',
      items: [
        '<strong>Objetivo:</strong> Introducción rápida y ejecución básica de anuncios en Facebook Ads durante la reunión virtual.',
        'Entrega de un manual de usuario básico sobre Facebook Ads antes de la reunión.',
        'Introducción a Facebook Ads',
        'Promocionar Publicación',
        'Administrador de Anuncios',
        'Campaña de Ventas',
        'Segmentación Detallada',
        'Anuncios de Video',
        'Públicos Personalizados',
        'Métricas Claves en Facebook Ads',
        'Errores Comunes en Facebook Ads',
        '<strong>Análisis previo de audiencia, competencia y objetivos específicos de Facebook Ads:</strong>',
        'Investigación de la audiencia objetivo, incluyendo características demográficas, intereses y comportamientos.',
        'Análisis de la competencia para identificar fortalezas, debilidades y oportunidades de diferenciación.',
        'Establecimiento de objetivos claros y medibles para la campaña publicitaria en Facebook Ads.',
        '<strong>Generación de Documento de Contenido:</strong>',
        'Creación de títulos atractivos y llamativos para los anuncios en Facebook que capten la atención y generen interés entre la audiencia objetivo.',
        'Desarrollo de contenido persuasivo y relevante para los usuarios de Facebook, asegurando que se alinee con los objetivos de la campaña y utilice de manera efectiva los elementos identificados en la investigación previa.',
        '<strong>Creación y ajuste del anuncio en tiempo real durante la reunión virtual basado en el análisis y la documentación.</strong>',
        'Introducción explicando la estructura y objetivos de la capacitación.',
        'Panel de control.',
        'Menús y opciones principales.',
        'Herramientas de análisis y seguimiento.',
        'Identificación del objetivo del anuncio (por ejemplo, promocionar un producto o servicio específico).',
        'Selección de tipo de campaña.',
        'Configuración de presupuesto y segmentación.',
        'Configuración de públicos objetivo.',
        'Revisión y publicación del anuncio en tiempo real.',
        '<strong><em>Ejercicio Práctico: Realizar un análisis previo y generar contenido relevante para un anuncio específico antes de la reunión para luego crear y ajustar un anuncio durante la sesión virtual utilizando Facebook Ads.</em></strong>'
      ],
      sold: false,
      verMas: true,
      unique: true,
      igv: false,
      tiempo: 3,
      plan: '',
      vendido: false,
      extra: '',
      capacitacion: true

    },
    plan3: {
      name: 'PLAN FULL - CAPACITACIÓN DE FACEBOOK ADS',
      price: 'S/ 699.00',
      correlativo: 'LPFADSF',
      servicio: 'Capacitaciones',
      items: [
        '<strong>Objetivo:</strong> Profundizar aún más y realizar seguimiento y mejoras en los anuncios creados en Facebook Ads durante la reunión virtual.',
        'Entrega de un manual de usuario básico sobre Facebook Ads antes de la reunión.',
        'Introducción a Facebook Ads',
        'Promocionar Publicación',
        'Administrador de Anuncios',
        'Campaña de Ventas',
        'Segmentación Detallada',
        'Anuncios de Video',
        'Públicos Personalizados',
        'Métricas Claves en Facebook Ads',
        'Errores Comunes en Facebook Ads',
        '<strong>Análisis previo de audiencia, competencia y objetivos específicos de Facebook Ads:</strong>',
        'Investigación de la audiencia objetivo, incluyendo características demográficas, intereses y comportamientos.',
        'Análisis de la competencia para identificar fortalezas, debilidades y oportunidades de diferenciación.',
        'Establecimiento de objetivos claros y medibles para la campaña publicitaria en Facebook Ads.',
        '<strong>Generación de Documento de Contenido:</strong>',
        'Creación de títulos atractivos y llamativos para los anuncios en Facebook que capten la atención y generen interés entre la audiencia objetivo.',
        'Desarrollo de contenido persuasivo y relevante para los usuarios de Facebook, asegurando que se alinee con los objetivos de la campaña y utilice de manera efectiva los elementos identificados en la investigación previa.',
        '<strong>Creación y ajuste del anuncio en tiempo real durante la reunión virtual basado en el análisis y la documentación.</strong>',
        'Introducción explicando la estructura y objetivos de la capacitación.',
        'Panel de control.',
        'Menús y opciones principales.',
        'Herramientas de análisis y seguimiento.',
        'Identificación del objetivo del anuncio (por ejemplo, promocionar un producto o servicio específico).',
        'Selección de tipo de campaña.',
        'Configuración de presupuesto y segmentación.',
        'Configuración de públicos objetivo.',
        'Revisión y publicación del anuncio en tiempo real.',
        '<strong>Seguimiento de Anuncios Anteriores:</strong>',
        'Realización de un seguimiento de los anuncios creados en los planes anteriores durante la reunión virtual, utilizando herramientas de análisis de Facebook Ads.',
        'Revisión de los datos y resultados obtenidos hasta el momento para identificar áreas de mejora y oportunidades de optimización.',
        '<strong>Evaluación de Métricas y Resultados en Tiempo Real:</strong>',
        'Evaluación de métricas y resultados en tiempo real durante la reunión utilizando la plataforma de Facebook Ads.',
        'Análisis detallado de métricas clave como CTR, CPC, ROAS, alcance, frecuencia, y conversiones para comprender el rendimiento de los anuncios.',
        '<strong>Implementación de Mejoras: </strong>',
        'Identificación de áreas de mejora basadas en la evaluación y el seguimiento durante la reunión virtual.',
        'Implementación de mejoras en los anuncios, incluyendo ajustes en el contenido, segmentación, estrategias de oferta, y optimización de conversiones.',
        'Demostración de cómo realizar cambios en tiempo real en la plataforma de Facebook Ads y revisar los efectos de las mejoras implementadas.',
        '<strong><em>Ejercicio Práctico: Analizar métricas de anuncios anteriores en Facebook Ads, identificar áreas de mejora y aplicar cambios para optimizar el rendimiento durante la reunión virtual.</em></strong>'
      ],
      sold: false,
      verMas: true,
      unique: true,
      igv: false,
      tiempo: 2,
      plan: '',
      vendido: false,
      extra: '',
      capacitacion: true
    }
  }
  return (
    <section className="container relative" id="swiper_button">
      <div className="w-full flex flex-col overflow-x-clip lg:flex-row md:items-center gap-y-5 relative h-fit py-4 md:py-10 font_Archivo_bold">
        <Swiper
          className="w-full flex justify-center items-center  px-3"
          loop
          spaceBetween={30}
          speed={300}
          navigation
          autoplay={{
            delay: 4000,
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
              slidesPerView: 3,
              centeredSlides: false
            }
          }}
          modules={[Autoplay, Navigation]}
        >
          {Object.values(planesCapaFacebook).map((plan, index) => (
            <SwiperSlide className="w-full h-full my-auto transition-all" key={index}>
              <CardPlanes plan={plan} />
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  )
}
