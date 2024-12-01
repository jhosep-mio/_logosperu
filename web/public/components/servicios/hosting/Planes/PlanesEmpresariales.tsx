'use client'
import { LuBadgeCheck } from 'react-icons/lu'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Autoplay, Navigation } from 'swiper/modules'
import { useEffect } from 'react'
import 'swiper/css/navigation'
import { ButtonPlan } from '@/app/(static)/hosting/components/ButtonPlan'

export const PlanesEmpresariales = () => {
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
          <SwiperSlide className="w-full h-full my-auto transition-all">
            <div className="w-full border-2 bg-white border-gray-500/30 py-8 px-8 z-10 overflow-hidden rounded-3xl lg:-mr-5 plan transition-all relative group before:absolute before:w-full before:h-full before:top-0 before:left-0 before:bg-[url(/assets/images/servicios/planes/patron.webp)] before:opacity-10 before:bg-contain before:-z-10">
              <div className="mb-8 text-center space-y-2">
                {/* <h4 className="font-semibold text-base text-gray-500 group-hover:text-main/90 transition-all ">
                  PLAN BABY
                </h4> */}
                <h1 className="text-3xl font-extrabold group-hover:text-primary transition-all">
                BÁSICO
                </h1>
                {/* <p className="text-gray-500">Pago unico</p> */}
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-4 font-medium">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Espacio de Disco Duro <strong>(1GB).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4 font-medium">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Transferencia de Ancho de Banda Mensual <strong>(20 GB).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Correos corporativos <strong>(Hasta 10).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Alojamiento  <strong>(Solo 1 dominio).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Base de datos Mysql  <strong>(Solo 1).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Redirección de E-mail <strong>(Ilimitado).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Setup <strong>(Gratis).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Sin Cpanel Independiente.
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  1 Dominio <strong>(Gratis).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Entrega de Contrato <strong>(En Físico).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Manual de Configuración de Correos Corporativos <strong>(POP3).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                    Configuración de Correos Corporativos<strong>(Remoto).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-base w-full flex-1">
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-base w-full flex-1">
                  </span>
                </li>

              </ul>
              <ButtonPlan plan='Plan Básico - Empresarial'/>

              {/* <p className='text-gray-500 text-center'>Its free so why not</p> */}
            </div>
          </SwiperSlide>
          <SwiperSlide className="w-full h-full my-auto transition-all">
            <div className="w-full border-2 bg-white border-gray-500/30 py-8 px-8 z-10 overflow-hidden rounded-3xl lg:-mr-5 plan transition-all relative group before:absolute before:w-full before:h-full before:top-0 before:left-0 before:bg-[url(/assets/images/servicios/planes/patron.webp)] before:opacity-10 before:bg-contain before:-z-10">
              <div className="mb-8 text-center space-y-2">
                {/* <h4 className="font-semibold text-base text-gray-500 group-hover:text-main/90 transition-all ">
                  PLAN BABY
                </h4> */}
                <h1 className="text-3xl font-extrabold group-hover:text-primary transition-all">
                ESTÁNDAR
                </h1>
                {/* <p className="text-gray-500">Pago unico</p> */}
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-4 font-medium">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Espacio de Disco Duro <strong>(3 GB).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4 font-medium">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Transferencia de Ancho de Banda Mensual <strong>(40 GB).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Correos corporativos <strong>(Hasta 20).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Alojamiento  <strong>(Solo 1 dominio).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Base de datos Mysql  <strong>(Solo 1).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Redirección de E-mail <strong>(Ilimitado).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Setup <strong>(Gratis).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Sin Cpanel Independiente.
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  1 Dominio <strong>(Gratis).</strong>
                  </span>
                </li>

                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Manual de Configuración de Correos Corporativos <strong>(POP3).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                    Configuración de Correos Corporativos<strong>(Remoto).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-base w-full flex-1">
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-base w-full flex-1">
                  </span>
                </li>

              </ul>
              <ButtonPlan plan='Plan Estándar - Empresarial'/>
              {/* <p className='text-gray-500 text-center'>Its free so why not</p> */}
            </div>
          </SwiperSlide>
          <SwiperSlide className="w-full h-full my-auto transition-all">
            <div className="w-full border-2 bg-white border-gray-500/30 py-8 px-8 z-10 overflow-hidden rounded-3xl lg:-mr-5 plan transition-all relative group before:absolute before:w-full before:h-full before:top-0 before:left-0 before:bg-[url(/assets/images/servicios/planes/patron.webp)] before:opacity-10 before:bg-contain before:-z-10">
              <div className="mb-8 text-center space-y-2">
                {/* <h4 className="font-semibold text-base text-gray-500 group-hover:text-main/90 transition-all ">
                  PLAN BABY
                </h4> */}
                <h1 className="text-3xl font-extrabold group-hover:text-primary transition-all">
                PROFESIONAL
                </h1>
                {/* <p className="text-gray-500">Pago unico</p> */}
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-4 font-medium">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Espacio de Disco Duro <strong>(5 GB).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4 font-medium">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Transferencia de Ancho de Banda Mensual <strong>(100 GB).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Correos corporativos <strong>(Hasta 30).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Alojamiento  <strong>(Solo 1 dominio).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Base de datos Mysql  <strong>(Solo 2).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Redirección de E-mail <strong>(Ilimitado).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Entrega de Contrato <strong>(En Físico).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Setup <strong>(Gratis).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Sin Cpanel Independiente.
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  1 Dominio <strong>(Gratis).</strong>
                  </span>
                </li>

                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Manual de Configuración de Correos Corporativos <strong>(POP3).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                    Configuración de Correos Corporativos<strong>(Remoto).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-base w-full flex-1">
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-base w-full flex-1">
                  </span>
                </li>

              </ul>
              <ButtonPlan plan='Plan Profesional - Empresarial'/>
              {/* <p className='text-gray-500 text-center'>Its free so why not</p> */}
            </div>
          </SwiperSlide>
          <SwiperSlide className="w-full h-full my-auto transition-all">
            <div className="w-full border-2 bg-white border-gray-500/30 py-8 px-8 z-10 overflow-hidden rounded-3xl lg:-mr-5 plan transition-all relative group before:absolute before:w-full before:h-full before:top-0 before:left-0 before:bg-[url(/assets/images/servicios/planes/patron.webp)] before:opacity-10 before:bg-contain before:-z-10">
              <div className="mb-8 text-center space-y-2">
                {/* <h4 className="font-semibold text-base text-gray-500 group-hover:text-main/90 transition-all ">
                  PLAN BABY
                </h4> */}
                <h1 className="text-3xl font-extrabold group-hover:text-primary transition-all">
                BÁSICO
                </h1>
                {/* <p className="text-gray-500">Pago unico</p> */}
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-4 font-medium">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Espacio de Disco Duro <strong>(1GB).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4 font-medium">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Transferencia de Ancho de Banda Mensual <strong>(20 GB).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Correos corporativos <strong>(Hasta 10).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Alojamiento  <strong>(Solo 1 dominio).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Base de datos Mysql  <strong>(Solo 1).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Redirección de E-mail <strong>(Ilimitado).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Setup <strong>(Gratis).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Sin Cpanel Independiente.
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  1 Dominio <strong>(Gratis).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Entrega de Contrato <strong>(En Físico).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Manual de Configuración de Correos Corporativos <strong>(POP3).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                    Configuración de Correos Corporativos<strong>(Remoto).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-base w-full flex-1">
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-base w-full flex-1">
                  </span>
                </li>

              </ul>
              <ButtonPlan plan='Plan Básico - Empresarial'/>

              {/* <p className='text-gray-500 text-center'>Its free so why not</p> */}
            </div>
          </SwiperSlide>
          <SwiperSlide className="w-full h-full my-auto transition-all">
            <div className="w-full border-2 bg-white border-gray-500/30 py-8 px-8 z-10 overflow-hidden rounded-3xl lg:-mr-5 plan transition-all relative group before:absolute before:w-full before:h-full before:top-0 before:left-0 before:bg-[url(/assets/images/servicios/planes/patron.webp)] before:opacity-10 before:bg-contain before:-z-10">
              <div className="mb-8 text-center space-y-2">
                {/* <h4 className="font-semibold text-base text-gray-500 group-hover:text-main/90 transition-all ">
                  PLAN BABY
                </h4> */}
                <h1 className="text-3xl font-extrabold group-hover:text-primary transition-all">
                ESTÁNDAR
                </h1>
                {/* <p className="text-gray-500">Pago unico</p> */}
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-4 font-medium">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Espacio de Disco Duro <strong>(3 GB).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4 font-medium">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Transferencia de Ancho de Banda Mensual <strong>(40 GB).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Correos corporativos <strong>(Hasta 20).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Alojamiento  <strong>(Solo 1 dominio).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Base de datos Mysql  <strong>(Solo 1).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Redirección de E-mail <strong>(Ilimitado).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Setup <strong>(Gratis).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Sin Cpanel Independiente.
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  1 Dominio <strong>(Gratis).</strong>
                  </span>
                </li>

                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Manual de Configuración de Correos Corporativos <strong>(POP3).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                    Configuración de Correos Corporativos<strong>(Remoto).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-base w-full flex-1">
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-base w-full flex-1">
                  </span>
                </li>

              </ul>
              <ButtonPlan plan='Plan Estándar - Empresarial'/>
              {/* <p className='text-gray-500 text-center'>Its free so why not</p> */}
            </div>
          </SwiperSlide>
          <SwiperSlide className="w-full h-full my-auto transition-all">
            <div className="w-full border-2 bg-white border-gray-500/30 py-8 px-8 z-10 overflow-hidden rounded-3xl lg:-mr-5 plan transition-all relative group before:absolute before:w-full before:h-full before:top-0 before:left-0 before:bg-[url(/assets/images/servicios/planes/patron.webp)] before:opacity-10 before:bg-contain before:-z-10">
              <div className="mb-8 text-center space-y-2">
                {/* <h4 className="font-semibold text-base text-gray-500 group-hover:text-main/90 transition-all ">
                  PLAN BABY
                </h4> */}
                <h1 className="text-3xl font-extrabold group-hover:text-primary transition-all">
                PROFESIONAL
                </h1>
                {/* <p className="text-gray-500">Pago unico</p> */}
              </div>
              <ul className="space-y-3 mb-8">
                <li className="flex items-center gap-4 font-medium">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Espacio de Disco Duro <strong>(5 GB).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4 font-medium">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Transferencia de Ancho de Banda Mensual <strong>(100 GB).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Correos corporativos <strong>(Hasta 30).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Alojamiento  <strong>(Solo 1 dominio).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Base de datos Mysql  <strong>(Solo 2).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Redirección de E-mail <strong>(Ilimitado).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Entrega de Contrato <strong>(En Físico).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Setup <strong>(Gratis).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Sin Cpanel Independiente.
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  1 Dominio <strong>(Gratis).</strong>
                  </span>
                </li>

                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                  Manual de Configuración de Correos Corporativos <strong>(POP3).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <LuBadgeCheck size={20} className="text-base text-main" />
                  <span className="text-base w-full flex-1">
                    Configuración de Correos Corporativos<strong>(Remoto).</strong>
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-base w-full flex-1">
                  </span>
                </li>
                <li className="flex items-center gap-4">
                  <span className="text-base w-full flex-1">
                  </span>
                </li>

              </ul>
              <ButtonPlan plan='Plan Profesional - Empresarial'/>
              {/* <p className='text-gray-500 text-center'>Its free so why not</p> */}
            </div>
          </SwiperSlide>

        </Swiper>
        {/* <Modals open={open} setOpen={setOpen} selected={selected} /> */}
      </div>
    </section>
  )
}
