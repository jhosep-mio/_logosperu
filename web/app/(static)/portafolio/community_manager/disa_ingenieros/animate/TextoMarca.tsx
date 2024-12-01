/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/effect-cards'
import { EffectCards } from 'swiper/modules'

export const TextoMarca = () => {
  return (
    <section className="h-full flex flex-col xl:flex-row gap-4 lg:gap-6 xl:gap-0 lg:items-center max-w-[2000px] mx-auto pt-8 pb-4 lg:py-10 2xl:py-24 px-5 md:px-16 ">
      <div className="w-full  my-auto justify-center flex flex-col lg:gap-5 overflow-hidden items-center relative">
        <motion.h2
          initial={{ opacity: 0, transform: 'translateX(-50%)' }}
          whileInView={{ opacity: 1, transform: 'translateX(0%)' }}
          transition={{ duration: 0.3 }}
          className="w-full  font_Archivo_bold text-[1.5rem] lg:text-[2.5rem] 2xl:text-[2.5rem] text-[#001D3F] block text-center uppercase"
        >
          Más sobre la marca
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, transform: 'translateX(-50%)' }}
          whileInView={{ opacity: 1, transform: 'translateX(0%)' }}
          transition={{ duration: 0.5 }}
          className="w-full font_Archivo_bold mt-4 lg:mt-0 text-[#001D3F] text-base lg:text-[2.5vh] 2xl:text-[1.5rem] leading-[2.5vh] lg:leading-[3vh] 2xl:leading-[2rem] text-justify"
        >
          DISA Ingenieros ofrece servicios integrales de mantenimiento, reparación e instalación HVAC, asegurando un funcionamiento óptimo de los sistemas de calefacción, ventilación y aire acondicionado.
        </motion.p>
      </div>
      {/* <img src="/assets/images/portafolio/community_manager/disa_ingenieros/recurso1.webp" alt="" className='w-full lg:w-[60%] 2xl:w-full object-contain lg:pl-10'/> */}
      <div className="w-full lg:w-[60%] h-full lg:pl-10">
        <Swiper
          effect={'cards'}
          grabCursor={true}
          modules={[EffectCards]}
          className="swiper_card"
        >
          <SwiperSlide className="w-full h-full">
            <img
              src="/assets/images/portafolio/community_manager/disa_ingenieros/slide1.webp"
              alt=""
              className="w-full h-full  object-contain "
            />
          </SwiperSlide>
          <SwiperSlide className="w-full h-full">
            <img
              src="/assets/images/portafolio/community_manager/disa_ingenieros/slide2.webp"
              alt=""
              className="w-full h-full  object-contain "
            />
          </SwiperSlide>
          <SwiperSlide className="w-full h-full">
            <img
              src="/assets/images/portafolio/community_manager/disa_ingenieros/slide3.webp"
              alt=""
              className="w-full h-full  object-contain "
            />
          </SwiperSlide>
          <SwiperSlide className="w-full h-full">
            <img
              src="/assets/images/portafolio/community_manager/disa_ingenieros/slide4.png"
              alt=""
              className="w-full h-full  object-contain "
            />
          </SwiperSlide>
        </Swiper>
      </div>
    </section>
  )
}
