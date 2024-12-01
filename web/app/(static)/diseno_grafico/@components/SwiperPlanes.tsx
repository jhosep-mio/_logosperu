'use client'
import React from 'react'
import { CardPlanes } from '@/public/components/servicios/planes/CardPlanes'
import { Autoplay, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
export const SwiperPlanes = ({ planes }: { planes: any }) => {
  return (
    <Swiper
      className={`${Object.values(planes).length > 2 ? 'w-full' : 'max-w-3xl'} flex justify-center items-center `}
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
          slidesPerView: Object.values(planes).length > 2 ? 3 : 2,
          centeredSlides: false
        }
      }}
      modules={[Autoplay, Navigation]}
    >
      {Object.values(planes).map((plan: any, index) => (
        <SwiperSlide key={index}>
          <CardPlanes plan={plan} />
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
