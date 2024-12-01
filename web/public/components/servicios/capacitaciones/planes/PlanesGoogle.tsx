'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Autoplay, Navigation } from 'swiper/modules'
import { useEffect } from 'react'
import 'swiper/css/navigation'
import { CardPlanes } from '../../planes/CardPlanes'

export const PlanesGoogle = () => {
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

  const planesCapaGoogle = {
    plan1: {
      name: 'PLAN EMPRENDIMIENTO - CAPACITACIÓN DE GOOGLE ADS ',
      price: 'S/ 99.00',
      correlativo: 'LPFADSE',
      servicio: 'Capacitaciones',
      items: [
        '<strong>Objetivo:</strong> Introducción rápida y ejecución básica de anuncios en Google Ads durante la reunión virtual.',
        'Entrega de un manual de usuario básico sobre Google Ads antes de la reunión.',
        'Introducción a Google Ads',
        'Define tus objetivos publicitarios',
        'Palabras clave.',
        'Establece tu presupuesto y estrategia de puja.',
        'Seguimiento y optimización.',
        'Configura tu cuenta e inicio de campaña en Google Ads.',
        '<strong>Realización de una capacitación en vivo durante la reunión virtual para aprender los conceptos básicos de Google Ads.</strong>',
        'Introducción a la reunión explicando la estructura y objetivos de la capacitación.',
        'Explicación detallada de los elementos de la interfaz de Google Ads.',
        'Panel de control.',
        'Menús y opciones principales.',
        'Herramientas de análisis y seguimiento.',
        'Demostración en vivo de la creación de una campaña publicitaria básica.',
        'Selección de tipo de campaña.',
        'Configuración de presupuesto y segmentación.',
        'Creación de anuncios simples',
        'Configuración de palabras clave.',
        'Preguntas y respuestas para aclarar dudas durante la capacitación.',
        '<strong><em>Ejercicio Práctico: Crear un anuncio simple durante la sesión de capacitación en la reunión virtual utilizando Google Ads.</em></strong>'
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
      name: 'PLAN INTERMEDIO - CAPACITACIÓN DE GOOGLE ADS ',
      price: 'S/ 269.00',
      correlativo: 'LPFADSI',
      servicio: 'Capacitaciones',
      items: [
        '<strong>Objetivo:</strong> Profundizar en el proceso de creación de anuncios en Google Ads con análisis previo y documentación detallada durante la reunión virtual.',
        'Entrega de un manual de usuario básico sobre Google Ads antes de la reunión.',
        'Introducción a Google Ads',
        'Define tus objetivos publicitarios',
        'Palabras clave.',
        'Establece tu presupuesto y estrategia de puja.',
        'Seguimiento y optimización.',
        'Configura tu cuenta e inicio de campaña en Google Ads.',
        '<strong>Análisis previo de audiencia, competencia y objetivos específicos de Google Ads antes de la reunión.</strong>',
        'Investigación de la audiencia objetivo, incluyendo características demográficas, intereses y comportamientos.',
        'Análisis de la competencia para identificar fortalezas, debilidades y oportunidades de diferenciación.',
        'Establecimiento de objetivos claros y medibles para la campaña publicitaria en Google Ads.',
        '<strong>Generación de documento con palabras clave, títulos y contenido para el anuncio antes de la reunión, utilizando herramientas de análisis de Google Ads.</strong>',
        'Investigación y selección de palabras clave relevantes para la audiencia y los objetivos de la campaña.',
        'Creación de títulos atractivos y llamativos para los anuncios.',
        'Desarrollo de contenido persuasivo y relevante para los usuarios que se alinee con los objetivos de la campaña.',
        '<strong>Realización de una capacitación en vivo durante la reunión virtual para aprender los conceptos básicos de Google Ads.</strong>',
        'Introducción a la reunión explicando la estructura y objetivos de la capacitación.',
        'Explicación detallada de los elementos de la interfaz de Google Ads.',
        'Panel de control.',
        'Menús y opciones principales.',
        'Herramientas de análisis y seguimiento.',
        'Demostración en vivo de la creación de una campaña publicitaria básica.',
        'Selección de tipo de campaña.',
        'Configuración de presupuesto y segmentación.',
        'Creación de anuncios simples',
        'Configuración de palabras clave.',
        'Preguntas y respuestas para aclarar dudas durante la capacitación.',
        '<strong><em>Ejercicio Práctico: Realizar un análisis previo y generar un documento con elementos clave específicos de Google Ads antes de la reunión para luego crear y ajustar un anuncio durante la sesión virtual utilizando Google Ads.</em></strong>'
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
      name: 'PLAN FULL - CAPACITACIÓN DE GOOGLE ADS ',
      price: 'S/ 699.00',
      correlativo: 'LPFADSF',
      servicio: 'Capacitaciones',
      items: [
        '<strong>Objetivo:</strong>  Profundizar aún más y realizar seguimiento y mejoras en los anuncios creados en Google Ads durante la reunión virtual.',
        'Entrega de un manual de usuario básico sobre Google Ads antes de la reunión.',
        'Introducción a Google Ads',
        'Define tus objetivos publicitarios',
        'Palabras clave.',
        'Establece tu presupuesto y estrategia de puja.',
        'Seguimiento y optimización.',
        'Configura tu cuenta e inicio de campaña en Google Ads.',
        '<strong>Análisis previo de audiencia, competencia y objetivos específicos de Google Ads antes de la reunión.</strong>',
        'Investigación de la audiencia objetivo, incluyendo características demográficas, intereses y comportamientos.',
        'Análisis de la competencia para identificar fortalezas, debilidades y oportunidades de diferenciación.',
        'Establecimiento de objetivos claros y medibles para la campaña publicitaria en Google Ads.',
        '<strong>Generación de documento con palabras clave, títulos y contenido para el anuncio antes de la reunión, utilizando herramientas de análisis de Google Ads.</strong>',
        'Investigación y selección de palabras clave relevantes para la audiencia y los objetivos de la campaña.',
        'Creación de títulos atractivos y llamativos para los anuncios.',
        'Desarrollo de contenido persuasivo y relevante para los usuarios que se alinee con los objetivos de la campaña.',
        '<strong>Realización de una capacitación en vivo durante la reunión virtual para aprender los conceptos básicos de Google Ads.</strong>',
        'Introducción a la reunión explicando la estructura y objetivos de la capacitación.',
        'Explicación detallada de los elementos de la interfaz de Google Ads.',
        'Panel de control.',
        'Menús y opciones principales.',
        'Herramientas de análisis y seguimiento.',
        'Demostración en vivo de la creación de una campaña publicitaria básica.',
        'Selección de tipo de campaña.',
        'Configuración de presupuesto y segmentación.',
        'Creación de anuncios simples',
        'Configuración de palabras clave.',
        'Preguntas y respuestas para aclarar dudas durante la capacitación.',
        '<strong>Realización de un seguimiento de los anuncios creados en los planes anteriores durante la reunión virtual, utilizando herramientas de análisis de Google Ads.</strong>',
        'Monitoreo y análisis de métricas como CTR, CPC, ROI, etc., de los anuncios creados en los planes anteriores.',
        'Identificación de tendencias y áreas de mejora en el rendimiento de los anuncios.',
        '<strong>Evaluación de métricas y resultados en tiempo real durante la reunión utilizando la plataforma de Google Ads.</strong>',
        'Revisión de métricas clave de rendimiento de los anuncios en tiempo real durante la reunión virtual.',
        'Análisis de los resultados obtenidos y comparación con los objetivos establecidos.',
        '<strong>Implementación de mejoras en los anuncios basadas en la evaluación y el seguimiento durante la reunión virtual.</strong>',
        'Aplicación de ajustes y optimizaciones a los anuncios para mejorar su rendimiento y alcanzar los objetivos establecidos.',
        '<strong><em>Ejercicio Práctico: Analizar métricas de anuncios anteriores en Google Ads, identificar áreas de mejora y aplicar cambios para optimizar el rendimiento durante la reunión virtual.</em></strong>'
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
    <section className="container relative " id="swiper_button">
      <div className="w-full flex flex-col overflow-x-clip lg:flex-row md:items-center gap-y-5 relative h-fit py-4 md:py-10 font_Archivo_bold">
        <Swiper
          className="w-full flex justify-center items-center swiper_planes_hosting"
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
              centeredSlides: true
            }
          }}
          modules={[Autoplay, Navigation]}
        >
          {Object.values(planesCapaGoogle).map((plan, index: number) => (
            <SwiperSlide className="w-full h-full my-auto transition-all" key={index}>
              <CardPlanes plan={plan} />
            </SwiperSlide>
          ))}
          {Object.values(planesCapaGoogle).map((plan, index) => (
            <SwiperSlide className="w-full h-full my-auto transition-all" key={index}>
              <CardPlanes plan={plan} />
            </SwiperSlide>
          ))}
        </Swiper>
        {/* <Modals open={open} setOpen={setOpen} selected={selected} /> */}
      </div>
    </section>
  )
}
