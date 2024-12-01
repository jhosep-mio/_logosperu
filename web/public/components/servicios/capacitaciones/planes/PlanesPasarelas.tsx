'use client'
import { LuBadgeCheck } from 'react-icons/lu'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Autoplay, Navigation } from 'swiper/modules'
import { useEffect } from 'react'
import 'swiper/css/navigation'
import { ButtonPlan } from '@/app/(static)/capacitaciones/components/ButtonPlan'

export const PlanesPasarelas = () => {
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
          <SwiperSlide className="w-full h-full my-auto transition-all">
            <div className="w-full flex flex-col justify-between border-2 h-[850px]  bg-white border-gray-500/30 py-8 px-10 rounded-3xl lg:-mr-5 plan transition-all relative z-10 overflow-hidden group before:absolute before:w-full before:h-full before:top-0 before:left-0 before:bg-[url(/assets/images/servicios/planes/patron.webp)] before:bg-contain before:bg-repeat before:-z-10 before:opacity-10">
              <div className="flex flex-col">
                <div className="mb-8 text-center space-y-2">
                  {/* <h4 className="font-semibold text-base text-gray-500 group-hover:text-main/90 transition-all ">
                  PLAN BABY
                </h4> */}
                  <h1 className="text-3xl font-extrabold group-hover:text-primary transition-all">
                    PLAN BÁSICO
                  </h1>
                  {/* <p className="text-gray-500">Pago unico</p> */}
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex flex-col font-[100] mb-6">
                    <p className="flex items-center gap-4">
                      <LuBadgeCheck size={20} className="text-base text-main" />
                      <strong>Objetivo: </strong>
                    </p>
                    <p className='pl-7 text-justify'>
                    Introducir a los participantes en el uso básico de las
                    pasarelas de pagos Culqi y Mercado Pago.
                    </p>

                  </li>
                  <li className="flex items-center gap-4 font-medium">
                    <LuBadgeCheck size={20} className="text-base text-main" />
                    <span className="text-base w-full flex-1">
                      Presentación de <br /> pasarelas de pago
                    </span>
                  </li>
                  <li className="flex items-center gap-4 font-medium">
                    <LuBadgeCheck size={20} className="text-base text-main" />
                    <span className="text-base w-full flex-1">
                      Creación de cuenta y configuración inicial
                    </span>
                  </li>
                  <li className="flex items-center gap-4">
                    <LuBadgeCheck size={20} className="text-base text-main" />
                    <span className="text-base w-full flex-1">
                      Generación de links de pago
                    </span>
                  </li>
                  <li className="flex items-center gap-4">
                    <LuBadgeCheck size={20} className="text-base text-main" />
                    <span className="text-base w-full flex-1">
                      Proceso de pago y confirmación de transacciones
                    </span>
                  </li>
                  <li className="flex items-center gap-4">
                    <LuBadgeCheck size={20} className="text-base text-main" />
                    <span className="text-base w-full flex-1">Comisiones</span>
                  </li>
                </ul>
              </div>

              <ButtonPlan plan="Plan Básico de Pasarelas de pago" precio='' servicio='' correlativo=''/>

              {/* <p className='text-gray-500 text-center'>Its free so why not</p> */}
            </div>
          </SwiperSlide>
          <SwiperSlide className="w-full h-full my-auto transition-all">
            <div className="w-full flex flex-col justify-between border-2 h-[850px]  bg-white border-gray-500/30 py-8 px-10 rounded-3xl lg:-mr-5 plan transition-all relative z-10 overflow-hidden group before:absolute before:w-full before:h-full before:top-0 before:left-0 before:bg-[url(/assets/images/servicios/planes/patron.webp)] before:bg-contain before:bg-repeat before:-z-10 before:opacity-10">
              <div className="flex flex-col">
                <div className="mb-8 text-center space-y-2">
                  {/* <h4 className="font-semibold text-base text-gray-500 group-hover:text-main/90 transition-all ">
                  PLAN BABY
                </h4> */}
                  <h1 className="text-3xl font-extrabold group-hover:text-primary transition-all">
                    PLAN MEDIO
                  </h1>
                  {/* <p className="text-gray-500">Pago unico</p> */}
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex flex-col font-[100] mb-6">
                    <p className="flex items-center gap-4">
                      <LuBadgeCheck size={20} className="text-base text-main" />
                      <strong>Objetivo: </strong>
                    </p>
                    <p className='pl-7 text-justify'>
                    Profundizar en el uso de Culqi y Mercado Pago, incluyendo la generación de facturas, configuración avanzada de pagos y gestión de usuarios.
                    </p>

                  </li>

                  <li className="flex items-center gap-4">
                    <LuBadgeCheck size={20} className="text-base text-main" />
                    <span className="text-base w-full flex-1">
                      Generación de links de pago
                    </span>
                  </li>
                  <li className="flex items-center gap-4">
                    <LuBadgeCheck size={20} className="text-base text-main" />
                    <span className="text-base w-full flex-1">
                      Proceso de pago y confirmación de transacciones
                    </span>
                  </li>
                  <li className="flex items-center gap-4">
                    <LuBadgeCheck size={20} className="text-base text-main" />
                    <span className="text-base w-full flex-1">Comisiones</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <LuBadgeCheck size={20} className="text-base text-main" />
                    <span className="text-base w-full flex-1">Creación y gestión de usuarios</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <LuBadgeCheck size={20} className="text-base text-main" />
                    <span className="text-base w-full flex-1">Seguimiento y análisis de transacciones</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <LuBadgeCheck size={20} className="text-base text-main" />
                    <span className="text-base w-full flex-1">Análisis de reporte de ventas</span>
                  </li>
                </ul>
              </div>

              <ButtonPlan plan="Plan Medio de Pasarelas de pago" precio='' servicio='' correlativo=''/>

              {/* <p className='text-gray-500 text-center'>Its free so why not</p> */}
            </div>
          </SwiperSlide>
          <SwiperSlide className="w-full h-full my-auto transition-all">
            <div className="w-full flex flex-col justify-between border-2 h-[850px]  bg-white border-gray-500/30 py-8 px-10 rounded-3xl lg:-mr-5 plan transition-all relative z-10 overflow-hidden group before:absolute before:w-full before:h-full before:top-0 before:left-0 before:bg-[url(/assets/images/servicios/planes/patron.webp)] before:bg-contain before:bg-repeat before:-z-10 before:opacity-10">
              <div className="flex flex-col">
                <div className="mb-8 text-center space-y-2">
                  {/* <h4 className="font-semibold text-base text-gray-500 group-hover:text-main/90 transition-all ">
                  PLAN BABY
                </h4> */}
                  <h1 className="text-3xl font-extrabold group-hover:text-primary transition-all">
                    PLAN BÁSICO
                  </h1>
                  {/* <p className="text-gray-500">Pago unico</p> */}
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex flex-col font-[100] mb-6">
                    <p className="flex items-center gap-4">
                      <LuBadgeCheck size={20} className="text-base text-main" />
                      <strong>Objetivo: </strong>
                    </p>
                    <p className='pl-7 text-justify'>
                    Introducir a los participantes en el uso básico de las
                    pasarelas de pagos Culqi y Mercado Pago.
                    </p>

                  </li>
                  <li className="flex items-center gap-4 font-medium">
                    <LuBadgeCheck size={20} className="text-base text-main" />
                    <span className="text-base w-full flex-1">
                      Presentación de <br /> pasarelas de pago
                    </span>
                  </li>
                  <li className="flex items-center gap-4 font-medium">
                    <LuBadgeCheck size={20} className="text-base text-main" />
                    <span className="text-base w-full flex-1">
                      Creación de cuenta y configuración inicial
                    </span>
                  </li>
                  <li className="flex items-center gap-4">
                    <LuBadgeCheck size={20} className="text-base text-main" />
                    <span className="text-base w-full flex-1">
                      Generación de links de pago
                    </span>
                  </li>
                  <li className="flex items-center gap-4">
                    <LuBadgeCheck size={20} className="text-base text-main" />
                    <span className="text-base w-full flex-1">
                      Proceso de pago y confirmación de transacciones
                    </span>
                  </li>
                  <li className="flex items-center gap-4">
                    <LuBadgeCheck size={20} className="text-base text-main" />
                    <span className="text-base w-full flex-1">Comisiones</span>
                  </li>
                </ul>
              </div>

              <ButtonPlan plan="Plan Básico de Pasarelas de pago" precio='' servicio='' correlativo=''/>

              {/* <p className='text-gray-500 text-center'>Its free so why not</p> */}
            </div>
          </SwiperSlide>
          <SwiperSlide className="w-full h-full my-auto transition-all">
            <div className="w-full flex flex-col justify-between border-2 h-[850px]  bg-white border-gray-500/30 py-8 px-10 rounded-3xl lg:-mr-5 plan transition-all relative z-10 overflow-hidden group before:absolute before:w-full before:h-full before:top-0 before:left-0 before:bg-[url(/assets/images/servicios/planes/patron.webp)] before:bg-contain before:bg-repeat before:-z-10 before:opacity-10">
              <div className="flex flex-col">
                <div className="mb-8 text-center space-y-2">
                  {/* <h4 className="font-semibold text-base text-gray-500 group-hover:text-main/90 transition-all ">
                  PLAN BABY
                </h4> */}
                  <h1 className="text-3xl font-extrabold group-hover:text-primary transition-all">
                    PLAN MEDIO
                  </h1>
                  {/* <p className="text-gray-500">Pago unico</p> */}
                </div>
                <ul className="space-y-3 mb-8">
                  <li className="flex flex-col font-[100] mb-6">
                    <p className="flex items-center gap-4">
                      <LuBadgeCheck size={20} className="text-base text-main" />
                      <strong>Objetivo: </strong>
                    </p>
                    <p className='pl-7 text-justify'>
                    Profundizar en el uso de Culqi y Mercado Pago, incluyendo la generación de facturas, configuración avanzada de pagos y gestión de usuarios.
                    </p>

                  </li>

                  <li className="flex items-center gap-4">
                    <LuBadgeCheck size={20} className="text-base text-main" />
                    <span className="text-base w-full flex-1">
                      Generación de links de pago
                    </span>
                  </li>
                  <li className="flex items-center gap-4">
                    <LuBadgeCheck size={20} className="text-base text-main" />
                    <span className="text-base w-full flex-1">
                      Proceso de pago y confirmación de transacciones
                    </span>
                  </li>
                  <li className="flex items-center gap-4">
                    <LuBadgeCheck size={20} className="text-base text-main" />
                    <span className="text-base w-full flex-1">Comisiones</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <LuBadgeCheck size={20} className="text-base text-main" />
                    <span className="text-base w-full flex-1">Creación y gestión de usuarios</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <LuBadgeCheck size={20} className="text-base text-main" />
                    <span className="text-base w-full flex-1">Seguimiento y análisis de transacciones</span>
                  </li>
                  <li className="flex items-center gap-4">
                    <LuBadgeCheck size={20} className="text-base text-main" />
                    <span className="text-base w-full flex-1">Análisis de reporte de ventas</span>
                  </li>
                </ul>
              </div>

              <ButtonPlan plan="Plan Medio de Pasarelas de pago" precio='' servicio='' correlativo=''/>

              {/* <p className='text-gray-500 text-center'>Its free so why not</p> */}
            </div>
          </SwiperSlide>

        </Swiper>
        {/* <Modals open={open} setOpen={setOpen} selected={selected} /> */}
      </div>
    </section>
  )
}
