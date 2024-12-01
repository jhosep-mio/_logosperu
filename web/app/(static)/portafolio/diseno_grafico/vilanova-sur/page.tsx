/* eslint-disable @next/next/no-img-element */

import { Header } from '@/public/components/web/structure/Header'
import React from 'react'
import { AiOutlineCaretRight } from 'react-icons/ai'
import { ImageLogo } from '../plaza_san_antonio/transiciones/ImageLogo'
import { Subtitle } from '../plaza_san_antonio/transiciones/Subtitle'
import { TitleMarca } from './animate/TitleMarca'
import { ImagenDegradate } from './animate/ImagenDegradate'
import { TextoMarca } from './animate/TextoMarca'
import { Tipografia } from './animate/Tipografia'
import Link from 'next/link'
import { FaCaretLeft } from 'react-icons/fa6'
import { GatitoAnimado } from './animate/GatitoAnimado'
import { PaletaColor } from './animate/PaletaColor'
import { AnimateMockup } from './animate/AnimateMockup'
import { ButtonPlanes } from '../../@componentes/ButtonPlanes'
import { generateMetadata } from '@/public/components/seo/SeoList'

export const metadata = generateMetadata()

export default function page () {
  return (
    <>
      <Header />
      <div className="h-auto w-full relative degradado_villanova">
        <img
          src="/assets/images/portafolio/villanova-sur/fondo.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-right lg:object-center object-cover z-[-2]"
        />
        <div className="pt-[9vh] lg:pt-[10vh] lg:h-fit p-4 lg:pb-0 lg:px-20 xl:px-28 2xl:px-36 ">
          <div className="w-full flex justify-center text-white ">
            <div className="flex gap-2 items-center text-white">
              <span className="uppercase font-bold text-xl hidden lg:block lg:text-[3vh] text-white text_shadow">
                CLIENTE
              </span>
              <AiOutlineCaretRight className="text-4xl hidden lg:block text-[#F4D35F]" />
              <h1 className="uppercase text_shadow font-bold text-white mt-4 lg:mt-0 flex gap-1 lg:gap-0 lg:flex-col text-lg lg:text-[2.4vh] leading-7 text-center">
                VILANOVA SUR <br /> CONDOMINIO
              </h1>
            </div>
          </div>
          {/* LOGO */}
          <div className="w-full py-[3vh] lg:py-[6vh]">
            <ImageLogo image="villanova-sur/logo.webp" />
          </div>
          <Subtitle texto="TU REFUGIO CON VISTA AL MAR" />
        </div>
      </div>
      <div className="w-full relative flex flex-col 2xl:flex-row gap-5 overflow-hidden lg:gap-10 px-4 2xl:h-[180px] py-10  items-center lg:px-40 bg-[#77450c]">
        <TitleMarca texto="Más sobre la marca" />
        <ImagenDegradate />
        <TextoMarca texto="Vilanova sur es una empresa que ofrece lotes en un exclusivo condominio en Chilca, con vistas al mar, rodeados de naturaleza y diseñados para disfrutar de un estilo de vida tranquilo y sostenible." />
      </div>
      <div className="flex flex-col-reverse lg:flex-row w-full relative overflow-hidden">
        <Tipografia />
        <GatitoAnimado />
        <div className="relative w-full h-auto lg:h-auto lg:w-1/2 overflow-hidden bannerMain">
          <img
            src="/assets/images/portafolio/villanova-sur/mockup1.webp"
            alt=""
            className="h-full w-full object-cover"
          />
        </div>
      </div>
      <section className="grid grid_gasolineras w-full h-auto lg:h-fit">
        <div className="w-full  h-full flex flex-col">
          <div className="h-auto xl:min-h-[960px]">
            <AnimateMockup />
          </div>
          <div className="flex bg-[url(/assets/images/portafolio/villanova-sur/mockup4.webp)] w-full h-full bg-center bg-no-repeat bg-cover min-h-[400px] xl:min-h-[960px]"></div>
        </div>
        <div className="w-full flex flex-col">
          <div className="w-full  h-[75%] grid grid-row-1 lg:grid-row-4 relative min-h-[500px] xl:min-h-[750px]">
            <h2 className=" font_Archivo_bold uppercase text-[#a97d51] bg-[#E59532] w-full flex items-center justify-center flex-col gap-0 text-center text-[3vh] md:text-[4vh] lg:text-[6vh] leading-[2rem] lg:py-0 lg:leading-[3.7rem]">
              Paleta de color
            </h2>
            <div className="uppercase bg-gray-600 overflow-hidden z-10 relative py-2 lg:py-0 flex justify-center items-center font_Archivo_bold text-white text-[2vh] md:text-[5vh]">
              <span className="text-[#623E1A]">#E59532</span>
              <PaletaColor color="#E59532" />
            </div>
            <div className="uppercase bg-gray-600 overflow-hidden z-10 relative py-2 lg:py-0 flex justify-center items-center font_Archivo_bold text-white text-[2vh] md:text-[5vh]">
              <span className="text-[#E59532]">#623E1A</span>
              <PaletaColor color="#623E1A" />
            </div>
          </div>
          <div className="flex flex-col">
            <img
              src="/assets/images/portafolio/villanova-sur/moclup3.webp"
              alt=""
              className="block h-auto w-full object-cover"
            />
            <img
              src="/assets/images/portafolio/villanova-sur/mockup5.webp"
              alt=""
              className="block h-auto w-full object-cover"
            />
          </div>
        </div>
      </section>
      <section className="flex w-full h-auto">
        <div className="w-full ">
          <img
            src="/assets/images/portafolio/villanova-sur/mockup6.webp"
            alt=""
            className="object-cover h-full w-full"
          />
        </div>
      </section>
      <div className="w-full h-[140px] lg:h-[300px]  flex flex-col justify-center items-center text-gray-300 relative cursor-pointer degraded_main z-1">
        <img
          src="/assets/images/portafolio/plaza_san_antonio/fondo.webp"
          alt=""
          className="w-full h-full object-cover object-center absolute inset-0 z-0 opacity-45"
        />
        <Link
          href="/portafolio/diseno_grafico/plaza_san_antonio"
          className="absolute left-0 lg:left-4 h-fit top-0 bottom-0 my-auto text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer"
        >
          <FaCaretLeft className="text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer" />
        </Link>
        <span className="text-white text-lg lg:text-[4vh] leading-6 lg:leading-[3rem] relative z-1">
          SIGUIENTE
        </span>
        <span className="text-white text-lg lg:text-[6vh] font_Archivo_bold z-1 relative leading-6 lg:leading-[3rem] mt-3">
            Plaza San Antonio
        </span>
        <Link
          href="/portafolio/diseno_grafico/plaza_san_antonio"
          className="absolute right-0 lg:right-4 rotate-180 h-fit top-0 bottom-0 my-auto text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer"
        >
          <FaCaretLeft className="text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer" />
        </Link>
      </div>
      <ButtonPlanes parametro="Diseño grafico" />
    </>
  )
}
