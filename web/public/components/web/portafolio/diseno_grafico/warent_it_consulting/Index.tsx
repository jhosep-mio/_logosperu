'use client'
/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { FaCaretLeft } from 'react-icons/fa6'
import { motion } from 'framer-motion'
import Link from 'next/link'

export const Index = () => {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, transform: 'translateY(50%)' }}
        whileInView={{ opacity: 1, transform: 'translateY(0%)' }}
        viewport={{ once: true }}
        className="w-full flex flex-col lg:flex-row items-center gap-6 lg:h-[500px] "
      >
        <div className="w-full flex flex-col gap-3 lg:gap-6 px-4 pt-8 lg:pt-0 lg:px-40">
          <h2 className="text-lg lg:text-3xl text-white block lg:text-center uppercase">
            Más sobre la marca
          </h2>
          <p className="w-full text-justify text-gray-300 lg:text-white text-sm lg:text-lg">
            La marca Waren IT Consulting irradia modernidad y tecnología en cada
            detalle. Con colores vibrantes y un diseño distintivo, ofrecemos
            soluciones tecnológicas avanzadas de manera clara y atractiva.
          </p>
        </div>
        <div className="w-full h-[200px] overflow-hidden lg:overflow-visible md:h-full relative">
          <img
            src="/assets/images/portafolio/warent_it/patita.png"
            alt=""
            className="absolute -bottom-24 lg:-bottom-0 -right-11 lg:right-0 h-fit w-full lg:w-[800px] object-contain"
          />
        </div>
      </motion.div>

      <div className="w-full flex flex-col lg:flex-row">
        <div className="grid grid-row-1 lg:grid-row-2 flex-1 lg:w-[40%]">
          <div className="bg-[#000000] py-2 lg:py-0 flex justify-center items-center font_Archivo_bold text-white text-[2vh] md:text-[4vh]">
            <span>#000000</span>
          </div>
          <div className="bg-[#164ED8] py-2 lg:py-0 flex justify-center items-center font_Archivo_bold text-white text-[2vh] md:text-[4vh]">
            <span>#164ED8</span>
          </div>
        </div>
        <div className="w-full md:w-[60%] h-full">
          <img src="/assets/images/portafolio/warent_it/recurso10.png" alt="" />
        </div>
      </div>

      <div className="w-full h-fit">
        <motion.img
          initial={{ opacity: 0, transform: 'translateY(20%)' }}
          whileInView={{ opacity: 1, transform: 'translateY(0%)' }}
          viewport={{ once: true }}
          src="/assets/images/portafolio/warent_it/mockups1.jpg"
          alt=""
          className="w-full"
        />
      </div>

      <div className="w-full flex h-[300px] lg:h-[800px]">
        <div className="w-1/2 lg:w-[900px] h-full">
          <img
            src="/assets/images/portafolio/warent_it/mockuppolo.png"
            alt=""
            className="w-full h-full flex-1"
          />
        </div>
        <div className="w-1/2 lg:w-full h-full overflow-hidden bg-no-repeat bg-cover bg-[url(/assets/images/home/degradado.webp)] relative">
          <motion.img
            initial={{ opacity: 0, transform: 'translateY(50%)' }}
            whileInView={{ opacity: 1, transform: 'translateY(0%)' }}
            viewport={{ once: true }}
            src="/assets/images/portafolio/warent_it/fotocheck.png"
            alt=""
            className=" h-full object-contain m-auto hover:brightness-105 relative z-[2]"
          />
          {/* <Recurso1 />
          <Recurso2 />
          <Recurso3 />
          <Recurso4 />
          <Recurso5 />
          <Recurso6 />
          <Recurso7 /> */}
        </div>
      </div>

      <Link
        href="/portafolio/diseno_grafico/jackos_bar"
        className="w-full h-[140px] lg:h-[300px] flex flex-col justify-center items-center text-gray-300 relative before:absolute before:inset-0 before:w-full before:h-full
        before:bg-[url(/assets/images/portafolio/jackos_bar/mockup5.webp)] bg-no-repeat before:opacity-20 before:bg-center cursor-pointer bg-degraded_main"
      >
        <FaCaretLeft className="absolute left-0 lg:left-4 top-0 bottom-0 my-auto text-5xl lg:text-7xl hover:scale-105 transition-all text-white" />
        <span className="text-lg lg:text-3xl ">SIGUIENTE</span>
        <span className="text-2xl lg:text-5xl font_Archivo_bold">MARCA</span>
        <FaCaretLeft className="absolute right-0 lg:right-4 rotate-180 top-0 bottom-0 my-auto text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer" />
      </Link>
    </>
  )
}
