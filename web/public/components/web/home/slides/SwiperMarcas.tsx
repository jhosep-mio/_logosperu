'use client'
/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import { Autoplay } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { Dialog, DialogContent } from '@mui/material'
export const SwiperMarcas = () => {
  const [open, setOpen] = useState({ estado: false, marca: '' })

  return (
    <>
      <section className="bg-gris px-5 xl:px-20 py-12 relative ">
        <Swiper
          slidesPerView={6}
          spaceBetween={60}
          className="swp_marcas"
          modules={[Autoplay]}
          autoplay={{
            delay: 3500,
            disableOnInteraction: false
          }}
          breakpoints={{
            0: {
              slidesPerView: 1
            },
            576: {
              slidesPerView: 1
            },
            768: {
              slidesPerView: 2
            },
            992: {
              slidesPerView: 3
            },
            1200: {
              slidesPerView: 5
            },
            1400: {
              slidesPerView: 6
            }
          }}
        >
          <SwiperSlide className=' group'>
            <div className="flex justify-center">
              <img
                className="grayscale transition-all hover:grayscale-0 object-contain w-full h-full group-hover:scale-105"
                src="/assets/images/home/ayn.png"
                alt=""
              />
            </div>
          </SwiperSlide>
          <SwiperSlide className=' group'>
            <div className="flex justify-center">
              <img
                className="grayscale transition-all hover:grayscale-0 object-contain w-full h-full group-hover:scale-105"
                src="/assets/images/home/disa.png"
                alt=""
              />
            </div>
          </SwiperSlide>
          <SwiperSlide className=' group'>
            <div className="flex justify-center">
              <img
                className="grayscale transition-all hover:grayscale-0 object-contain w-full h-full group-hover:scale-105"
                src="/assets/images/home/fastmarket.png"
                alt=""
              />
            </div>
          </SwiperSlide>
          <SwiperSlide className=' group'>
            <div className="flex justify-center">
              <img
                className="grayscale transition-all hover:grayscale-0 object-contain w-full h-full group-hover:scale-105"
                src="/assets/images/home/geomap.png"
                alt=""
              />
            </div>
          </SwiperSlide>
          <SwiperSlide className=' group'>
            <div className="flex justify-center">
              <img
                className="grayscale transition-all hover:grayscale-0 object-contain w-full h-full group-hover:scale-105"
                src="/assets/images/home/modular.png"
                alt=""
              />
            </div>
          </SwiperSlide>
          <SwiperSlide className=' group'>
            <div className="flex justify-center">
              <img
                className="grayscale transition-all hover:grayscale-0 object-contain w-full h-full group-hover:scale-105"
                src="/assets/images/home/piegrande.png"
                alt=""
              />
            </div>
          </SwiperSlide>
        </Swiper>
        <Dialog
          open={open.estado}
          onClose={() => setOpen({ estado: false, marca: '' })}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          maxWidth="lg"
        >
          <DialogContent className="w-full">
            <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-5">
              <img
                src="/assets/images/portafolio/grafico.webp"
                alt="Logos Perú"
                className="block w-full object-cover h-[250px]"
              />
              <img
                src="/assets/images/portafolio/web.webp"
                alt="Logos Perú"
                className="block w-full object-cover h-[250px]"
              />
              <img
                src="/assets/images/portafolio/hosting.webp"
                alt="Logos Perú"
                className="block w-full object-cover h-[250px]"
              />
              <img
                src="/assets/images/portafolio/community.webp"
                alt="Logos Perú"
                className="block w-full object-cover h-[250px]"
              />
            </div>
          </DialogContent>
        </Dialog>
      </section>
    </>
  )
}
