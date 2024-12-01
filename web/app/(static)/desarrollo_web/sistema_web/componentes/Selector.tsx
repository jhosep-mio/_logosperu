/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { ButtonSelector } from './ButtonSelector'
import { ButtonCotizacion } from './ButtonCotizacion'
export const Selector = () => {
  const [procesoActivo, setProcesoActivo] = useState('Proyectos')

  const procesos: any = {
    Proyectos: {
      title: 'Proyectos a presupuesto cerrado',
      imagen: 'https://sistemasperuweb.com/img/sistemas/presupuesto.jpg'
    },
    Horas: {
      title: 'Horas de desarrollo',
      imagen: 'https://sistemasperuweb.com/img/sistemas/presupuesto.jpg'
    },
    Contratación: {
      title: 'Contratación de recursos',
      imagen: 'https://sistemasperuweb.com/img/sistemas/presupuesto.jpg'
    }
  }

  return (
    <>
      <div className="flex flex-col w-full glass_sistema px-6 py-8">
        <h5 className="text-2xl md:text-3xl text-white font-bold  mb-6">
          Nuestros procesos
        </h5>
        <Swiper
          slidesPerView={3}
          spaceBetween={15}
          breakpoints={{
            0: {
              slidesPerView: 2
            },
            576: {
              slidesPerView: 2
            },
            768: {
              slidesPerView: 2
            },
            992: {
              slidesPerView: 3
            }
          }}
          className="w-full px-8 mb-12"
          loop
        >
          <SwiperSlide>
            <ButtonSelector
              title="Proyectos"
              procesoActivo={procesoActivo}
              setProcesoActivo={setProcesoActivo}
            />
          </SwiperSlide>
          <SwiperSlide>
            <ButtonSelector
              title="Horas"
              procesoActivo={procesoActivo}
              setProcesoActivo={setProcesoActivo}
            />
          </SwiperSlide>
          <SwiperSlide>
            <ButtonSelector
              title="Contratación"
              procesoActivo={procesoActivo}
              setProcesoActivo={setProcesoActivo}
            />
          </SwiperSlide>
          <SwiperSlide>
            <ButtonSelector
              title="Proyectos"
              procesoActivo={procesoActivo}
              setProcesoActivo={setProcesoActivo}
            />
          </SwiperSlide>
          <SwiperSlide>
            <ButtonSelector
              title="Horas"
              procesoActivo={procesoActivo}
              setProcesoActivo={setProcesoActivo}
            />
          </SwiperSlide>
          <SwiperSlide>
            <ButtonSelector
              title="Contratación"
              procesoActivo={procesoActivo}
              setProcesoActivo={setProcesoActivo}
            />
          </SwiperSlide>
        </Swiper>

        <div className="flex flex-col gap-8">
          <span className="circle_sistema block p-4 rounded-full mx-auto  w-fit hover:scale-105 transition-all relative before:absolute before:w-full before:h-full before:top-0 before:left-0 before:border-2 before:border-main before:rounded-full before:border-dashed">
            <img
              src={procesos[procesoActivo].imagen}
              alt=""
              className="w-[110px] md:w-[140px] mx-auto rounded-full overflow-hidden"
            />
          </span>
          <h5 className="text-2xl text-center text-main px-6">
            {procesos[procesoActivo].title}
          </h5>
          <ButtonCotizacion className='bg-main rounded-lg px-12 py-2 text-base md:text-xl font-bold text-nigga mt-2 w-full'/>
        </div>
      </div>
    </>
  )
}
