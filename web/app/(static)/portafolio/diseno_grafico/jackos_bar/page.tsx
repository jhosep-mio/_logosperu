/* eslint-disable @next/next/no-img-element */
import { generateMetadata } from '@/public/components/seo/SeoList'
import { AiOutlineCaretRight } from 'react-icons/ai'
import { Header } from '@/public/components/web/structure/Header'
import { FaCaretLeft } from 'react-icons/fa6'
import Link from 'next/link'
import { Subtitle } from '../plaza_san_antonio/transiciones/Subtitle'
import { ImageLogo } from './animate/ImageLogo'
import { Gatito } from './animate/Gatito'
import { Regresar } from '@/public/components/web/portafolio/general/Regresar'
import { ButtonPlanes } from '../../@componentes/ButtonPlanes'
export const metadata = generateMetadata()

export default function JackosBar () {
  return (
    <section className="relative z-10 degraded_main bannerMain">
      <Header />
      <Regresar/>
      <section className=" w-full h-fit ">
        <div className="h-auto w-full relative z-[2] 2xl:pb-[80px]">
          <img
            src="/assets/images/portafolio/jackos_bar/fondo_1.webp"
            alt=""
            className="absolute inset-0 w-full h-full object-right lg:object-center object-cover z-[-1]"
          />
          <div className="pt-[9vh] lg:pt-[10vh] lg:h-fit p-4 lg:pb-0 lg:px-20 xl:px-28 2xl:px-36 ">
            <div className="w-full flex justify-center text-white ">
              <div className="flex gap-2 items-center text-white">
                <span className="uppercase font-bold text-xl hidden lg:block lg:text-[3vh] text-white text_shadow">
                  CLIENTE
                </span>
                <AiOutlineCaretRight className="text-4xl hidden lg:block text-[#F4D35F]" />
                <h1 className="uppercase text_shadow font-bold text-white mt-4 lg:mt-0 flex gap-1 lg:gap-0 lg:flex-col text-lg lg:text-[3vh] leading-7 text-center">
                  {"JACKO'S"} BAR
                </h1>
              </div>
            </div>
            {/* LOGO */}
            <div className="w-full py-[3vh] lg:py-[10vh]">
              <ImageLogo image="jackos_bar/logo1.webp" />
            </div>
            <Subtitle texto="SIENTE LA MAGIA DE LA NOCHE EN UN SOLO LUGAR" />
          </div>
        </div>

        <section className="relative z-[2] h-[500px] -mt-[140px]">
          <img
            src="/assets/images/portafolio/jackos_bar/wave1.svg"
            alt=""
            className="absolute top-0 bottom-[200px] my-auto w-full h-auto object-cover left-0 right-0 z-[1] bg-transparent"
          />
          <Gatito/>
          <div className="w-full h-full flex items-end justify-center flex-col gap-0 lg:gap-6   z-[2] relative">
            <div className="w-full h-fit  bg-[#F18608] px-4 lg:px-[10vh] flex flex-col justify-center lg:mt-4 text-justify text-[#5B210F] font_Archivo_bold text-sm lg:text-[3vh] lg:leading-[4vh] relative ">
              <h2 className="text-base md:text-lg py-2 lg:pt-0 lg:text-[5vh] uppercase font_Archivo_bold text-[#5B210F] block lg:text-left  bottom-full md:mb-[1vh] lg:mb-[3vh]">
                MÁS SOBRE LA MARCA
              </h2>
              <p className="text-sm md:text-base lg:text-2xl">
                Nuestra marca es una sinfonía de tipografía detallada en tonos
                cálidos de marrón y naranja, evocando la calidez y el sabor de
                la noche. Sumérgete en una experiencia única en nuestro bar,
                donde cada sorbo es una aventura y cada momento es una
                celebración.
              </p>
            </div>
          </div>
          <img
            src="/assets/images/portafolio/jackos_bar/wave2.svg"
            alt=""
            className="absolute top-[275px] xl:top-[220px] 2xl:top-[200px] my-auto w-full h-auto object-cover left-0 right-0 z-[0] "
          />
        </section>

        <section className="flex flex-col lg:flex-row gap-0 w-full h-auto lg:h-[80vh] relative overflow-hidden -mt-[180px] sm:-mt-[150px] md:-mt-[120px] lg:-mt-[90px]">
          <img
            src="/assets/images/portafolio/jackos_bar/recurso6.webp"
            alt=""
            className="w-fit h-full"
          />
          <img
            src="/assets/images/portafolio/jackos_bar/mockup1.webp"
            alt=""
            className="w-full h-full object-center object-cover"
          />
        </section>

        <section className="flex flex-col lg:flex-row-reverse gap-0 w-full h-auto lg:h-[80vh]">
          <div className="w-full lg:w-[40%] h-full grid grid-row-1 lg:grid-row-4 relative ">
            <h2 className="gradiant_jackos font_Archivo_bold uppercase text-[#5B210F]/40 w-full flex items-center justify-center flex-col gap-0 text-center text-[3vh] md:text-[4vh] lg:text-[7vh] leading-[2rem] py-2 lg:py-0 lg:leading-[3.7rem]">
              Paleta <span>de colores</span>
            </h2>
            <div className="uppercase bg-[#F18508] py-2 lg:py-0 flex justify-center items-center font_Archivo_bold text-white text-[2vh] md:text-[4vh]">
              <span>#F18508</span>
            </div>
            <div className="uppercase bg-[#f9b10f] py-2 lg:py-0 flex justify-center items-center font_Archivo_bold text-white text-[2vh] md:text-[4vh]">
              <span>#f9b10f</span>
            </div>
            <div className="uppercase bg-[#571d0e] py-2 lg:py-0 flex justify-center items-center font_Archivo_bold text-white text-[2vh] md:text-[4vh]">
              <span>#571d0e</span>
            </div>
          </div>
          <div className="w-full lg:w-[60%] h-full bg-center  bg-no-repeat bg-cover bg-[url(/assets/images/portafolio/jackos_bar/mockup2.webp)]"></div>
        </section>
        <section className="grid grid-cols-1 lg:grid-cols-2 h-fit">
          <div className="bg-[#F6A010] h-[300px] lg:h-full flex items-center justify-center relative">
            <img
              src="/assets/images/portafolio/jackos_bar/tipografia.webp"
              alt=""
              className="w-full h-full object-contain py-3 lg:py-[5vh] object-center absolute inset-0"
            />
          </div>
          <img
            src="/assets/images/portafolio/jackos_bar/mockup4.webp"
            alt=""
            className="w-full h-full object-contain"
          />
        </section>
        <div className="w-full h-[140px] lg:h-[300px]  flex flex-col justify-center items-center text-gray-300 relative cursor-pointer degraded_main z-1">
          <img
            src="/assets/images/portafolio/awasu/carta.webp"
            alt=""
            className="w-full h-full object-cover object-center absolute inset-0 z-0 opacity-25"
          />
          <Link
            href="/portafolio/diseno_grafico/moralitos"
            className="absolute left-0 lg:left-4 h-fit top-0 bottom-0 my-auto text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer"
          >
            <FaCaretLeft className="text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer" />
          </Link>
          <span className="text-lg lg:text-[4vh] leading-6 lg:leading-[3rem] relative z-1">
            SIGUIENTE
          </span>
          <span className="text-lg lg:text-[6vh] font_Archivo_bold z-1 relative leading-6 lg:leading-[3rem]">
            AWASÚ
          </span>
          <Link
            href="/portafolio/diseno_grafico/awasu"
            className="absolute right-0 lg:right-4 rotate-180 h-fit top-0 bottom-0 my-auto text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer"
          >
            <FaCaretLeft className="text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer" />
          </Link>
        </div>
      </section>
      <ButtonPlanes parametro= 'Diseño grafico'/>

    </section>
  )
}
