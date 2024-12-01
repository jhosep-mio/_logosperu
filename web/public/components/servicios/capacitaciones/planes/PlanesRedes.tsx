'use client'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Autoplay, Navigation } from 'swiper/modules'
import { useEffect } from 'react'
import 'swiper/css/navigation'
import { CardPlanes } from '../../planes/CardPlanes'
import { IoChevronForward } from 'react-icons/io5'

export const PlanesRedes = () => {
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

  const planesCapaRedes = {
    plan1: {
      name: 'Capacitación - Plan Básico - Manejo de Redes Sociales',
      price: 'S/ 199.00',
      servicio: 'Capacitaciones',
      correlativo: 'LPAREDESB',
      items: [
        'Enlazar Instagram con Facebook ',
        'Configuración de la información del perfil (Agregar teléfono, correo, web, redes sociales, horarios)',
        'Conectar más números de WhatsApp',
        'Administración de la fan page a más colaboradores',
        'Planificador de publicaciones ',
        'Planificador de Historias',
        'Estadísticas desde meta (Explicación para ver las métricas) '
      ],
      sold: false,
      verMas: true,
      unique: true,
      igv: false,
      tiempo: 2,
      plan: '',
      vendido: false,
      extra: (
        <div className="pl-5">
          <ul className="flex text-xs md:text-base flex-col gap-2">
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Contamos con <strong>Certificado de Participación</strong>
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />A Cargo de personal calificado
            </li>
          </ul>
        </div>
      ),
      capacitacion: true
    },
    plan2: {
      name: 'Capacitación - Plan Avanzado  - Manejo de Redes Sociales',
      price: 'S/ 299.00',
      servicio: 'Capacitaciones',
      correlativo: 'LPAREDESA',
      items: [
        'Enlazar Instagram con Facebook ',
        'Configuración de la información del perfil (Agregar teléfono, correo, web, redes sociales, horarios)',
        'Conectar más números de WhatsApp',
        'Administración de la fan page a más colaboradores',
        'Planificador de publicaciones ',
        'Planificador de Historias',
        'Estadísticas desde meta (Explicación para ver las métricas) ',
        'Mensajes automatizados',
        'Configuración de TikTok a cuenta de empresa',
        'Planificador de publicaciones en TikTok',
        'Estadísticas desde suite de TikTok (Explicación para ver las métricas)'
      ],
      sold: false,
      verMas: true,
      unique: true,
      igv: false,
      tiempo: 4,
      plan: '',
      vendido: false,
      extra: (
        <div className="pl-5">
          <ul className="flex text-xs md:text-base flex-col gap-2">
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              Contamos con <strong>Certificado de Participación</strong>
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />A Cargo de personal calificado
            </li>
          </ul>
        </div>
      ),
      capacitacion: true
    },
    plan3: {
      name: 'Asesoría de Campaña pagada en Meta Business (Facebook - Instagram) - PLAN BASICO ',
      price: 'S/ 299.00',
      correlativo: 'LPACPB',
      servicio: 'Capacitaciones',
      items: [
        '<strong>Desarrollamos tu campaña pagada en Meta Business</strong>',
        'Creación y configuración de la campaña publicitaria.',
        'Selección de objetivos de campaña adecuados a tus necesidades.',
        'Configuración de la segmentación de audiencia para alcanzar a tu público objetivo.',
        '<strong>Aumenta tu presencia en Redes Sociales</strong>',
        'Optimización de anuncios para aumentar la visibilidad en Facebook e Instagram.',
        'Estrategias para mejorar la interacción con tus publicaciones.',
        '<strong>Respuesta a Potenciales Clientes</strong>',
        'Asistencia en la configuración de respuestas automáticas a consultas de clientes.',
        'Sugerencias para mejorar la interacción con clientes potenciales.',
        '<strong>Destaca ante tu competencia</strong>',
        'Análisis básico de competidores y recomendaciones para sobresalir.',
        'Creación de contenido atractivo y relevante.',
        '<strong>Incluye :  01 Diseño de Post -  cliente remite el tema a publicitar</strong>',
        'Diseño gráfico para publicaciones atractivas.',
        'Creación y edición de <strong>Reels 10 segundos</strong> para mejorar la interacción y alcance.'
      ],
      sold: false,
      verMas: true,
      unique: true,
      igv: false,
      tiempo: 2,
      plan: '',
      vendido: false,
      extra: (
        <div className="pl-5">
          <ul className="flex text-xs md:text-base flex-col gap-2">
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              -1ER DIA: <strong>ARMAR ANÁLISIS Y PREPARAR LOS RECURSOS.</strong>
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />A -2DO DIA: <strong>ARMAR Y PUBLICAR CAMPAÑA.</strong>
            </li>
          </ul>
        </div>
      ),
      capacitacion: false
    },
    plan4: {
      name: 'Asesoría de Campaña pagada en Meta Business (Facebook - Instagram) - PLAN AVANZADO ',
      price: 'S/ 499.00',
      correlativo: 'LPACPA',
      servicio: 'Capacitaciones',
      items: [
        '<strong>Desarrollamos tu campaña pagada en Meta Business</strong>',
        'Creación y configuración de la campaña publicitaria.',
        'Selección de objetivos de campaña adecuados a tus necesidades.',
        'Configuración de la segmentación de audiencia para alcanzar a tu público objetivo.',
        '<strong>Aumenta tu presencia en Redes Sociales</strong>',
        'Optimización de anuncios para aumentar la visibilidad en Facebook e Instagram.',
        'Estrategias para mejorar la interacción con tus publicaciones.',
        '<strong>Respuesta a Potenciales Clientes</strong>',
        'Configuración avanzada de respuestas automáticas y personalizadas a consultas de clientes.',
        'Estrategias de engagement para convertir consultas en ventas.',
        '<strong>Destaca ante tu competencia</strong>',
        'Análisis detallado de competidores y estrategias para superarlos.',
        'Desarrollo de contenido altamente atractivo y relevante para destacar.',
        '<strong>Seguimiento de tu campaña</strong>',
        'Monitoreo continuo del rendimiento de la campaña.',
        'Informes con análisis detallado y recomendaciones.',
        'Ajustes y optimizaciones en tiempo real para mejorar resultados.',
        '<strong>Incluye :  01 Diseño de Post -  cliente remite el tema a publicitar</strong>',
        'Diseño gráfico profesional para publicaciones altamente atractivas.',
        'Creación y edición de <strong>Reels de 10 segundos</strong> con estrategias para aumentar la visibilidad y engagement.'
      ],
      sold: false,
      verMas: true,
      unique: true,
      igv: false,
      tiempo: 7,
      plan: '',
      vendido: false,
      extra: (
        <div className="pl-5">
          <ul className="flex text-xs md:text-base flex-col gap-2">
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              -1ER DIA: <strong>ARMAR ANÁLISIS Y PREPARAR LOS RECURSOS.</strong>
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />A -2DO DIA: <strong>ARMAR Y PUBLICAR CAMPAÑA.</strong>
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />A -5TO DIA: <strong>SEGUIMIENTO Y AJUSTES.</strong>
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />A -7TO DIA:{' '}
              <strong>EVALUCIÓN DE RENDIMIENTO, CONVERSACIÓN SOBRE RESULTADOS.</strong>
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />A A cargo de personal calificado
            </li>
          </ul>
        </div>
      ),
      capacitacion: false
    },
    plan5: {
      name: 'Asesoría de Campaña pagada en Meta Business (Facebook - Instagram) - PLAN GOLDEN ',
      price: 'S/ 599.00',
      correlativo: 'LPACPA',
      servicio: 'Capacitaciones',
      items: [
        '<strong>Desarrollamos tu campaña pagada en Meta Business</strong>',
        'Creación y configuración de la campaña publicitaria.',
        'Selección de objetivos de campaña adecuados a tus necesidades.',
        'Configuración de la segmentación de audiencia para alcanzar a tu público objetivo.',
        '<strong>Aumenta tu presencia en Redes Sociales</strong>',
        'Optimización de anuncios para aumentar la visibilidad en Facebook e Instagram.',
        'Estrategias para mejorar la interacción con tus publicaciones.',
        '<strong>Respuesta a Potenciales Clientes</strong>',
        'Configuración avanzada de respuestas automáticas y personalizadas a consultas de clientes.',
        'Estrategias de engagement para convertir consultas en ventas.',
        '<strong>Destaca ante tu competencia</strong>',
        'Análisis detallado de competidores y estrategias para superarlos.',
        'Desarrollo de contenido altamente atractivo y relevante para destacar.',
        '<strong>Seguimiento de tu campaña</strong>',
        'Monitoreo continuo del rendimiento de la campaña.',
        'Informes con análisis detallado y recomendaciones.',
        'Ajustes y optimizaciones en tiempo real para mejorar resultados.',
        '<strong>Incluye :  01 Diseño de Post -  cliente remite el tema a publicitar</strong>',
        'Diseño gráfico profesional para publicaciones altamente atractivas.',
        'Creación y edición de <strong>Reels de 10 segundos</strong> con estrategias para aumentar la visibilidad y engagement.',
        '<strong>Manejo de Pagos:</strong>',
        'Nos encargamos de todos los pagos relacionados con la campaña publicitaria en <strong>Meta Business.</strong>',
        'Esto incluye la gestión y administración del presupuesto destinado a los anuncios.',
        'Por este servicio, cobramos una comisión adicional del <strong>20% sobre el monto total invertido en la campaña.</strong>',
        'Este cargo cubre la conveniencia de centralizar todos los pagos a través de nuestro servicio, asegurando una gestión eficiente y sin complicaciones para nuestros clientes.'
      ],
      sold: false,
      verMas: true,
      unique: true,
      igv: false,
      tiempo: 7,
      plan: '',
      vendido: false,
      extra: (
        <div className="pl-5">
          <ul className="flex text-xs md:text-base flex-col gap-2">
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />
              -1ER DIA: <strong>ARMAR ANÁLISIS Y PREPARAR LOS RECURSOS.</strong>
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />A -2DO DIA: <strong>ARMAR Y PUBLICAR CAMPAÑA.</strong>
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />A -5TO DIA: <strong>SEGUIMIENTO Y AJUSTES.</strong>
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />A -7TO DIA:{' '}
              <strong>EVALUCIÓN DE RENDIMIENTO, CONVERSACIÓN SOBRE RESULTADOS.</strong>
            </li>
            <li className="flex gap-2 items-center ">
              <IoChevronForward className="text-main text-xl md:text-3xl" />A A cargo de personal calificado
            </li>
          </ul>
        </div>
      ),
      capacitacion: false
    }
  }

  return (
    <section className="container relative " id="swiper_button">
      <div className="w-full flex flex-col overflow-x-clip lg:flex-row md:items-center gap-y-5 relative h-fit py-4 md:py-10 font_Archivo_bold">
        <Swiper
          className="w-full flex justify-center items-center swiper_planes_hosting px-3"
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
          {Object.values(planesCapaRedes).map((plan, index: number) => (
            <SwiperSlide className="w-full h-full my-auto transition-all" key={index}>
              <CardPlanes plan={plan} />
            </SwiperSlide>
          ))}
          {Object.values(planesCapaRedes).map((plan, index: number) => (
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
