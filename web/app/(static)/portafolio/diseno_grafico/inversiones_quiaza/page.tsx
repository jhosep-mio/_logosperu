/* eslint-disable @next/next/no-img-element */
import { generateMetadata } from '@/public/components/seo/SeoList'
import { Header } from '@/public/components/web/structure/Header'
import Link from 'next/link'
import { AiOutlineCaretRight } from 'react-icons/ai'
import { FaCaretLeft } from 'react-icons/fa6'
import { Tipografia } from '../moralitos/animate/Tipografia'
import { Image1 } from '../moralitos/animate/Image1'
import { ImageLogo } from './animate/ImageLogo'
import { TitleMarca } from './animate/TitleMarca'
import { TextoMarca } from './animate/TextoMarca'
import { CodigoColor } from './animate/CodigoColor'
import { TextoPaleta } from './animate/TextoPaleta'
import { Regresar } from '@/public/components/web/portafolio/general/Regresar'
import { ButtonPlanes } from '../../@componentes/ButtonPlanes'
export const metadata = generateMetadata()

export default function JackosBar () {
  return (
    <section className="relative z-10  bannerMain degraded_main font_Archivo">
      <Header />
      <Regresar />
      <div className="h-auto w-full relative">
        <img
          src="/assets/images/portafolio/awasu/fondo.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-right lg:object-top object-cover z-[-1]"
        />
        <div className="pt-[9vh] lg:pt-[10vh] lg:h-fit p-4 lg:pb-0 lg:px-20 xl:px-28 2xl:px-36 ">
          {/* <span className="flex lg:hidden gap-2 text-sm items-center text-white">
                <MdOutlineArrowCircleLeft className="text-xl" />
                Ver todos los proyectos
            </span> */}
          <div className="w-full flex justify-center text-white ">
            <div className="flex gap-2 items-center text-white">
              <span className="uppercase font-bold text-xl hidden lg:block lg:text-[3vh] text-white text_shadow">
                CLIENTE
              </span>
              <AiOutlineCaretRight className="text-4xl hidden lg:block text-[#F4D35F]" />
              <h1 className="uppercase text_shadow font-bold text-white mt-4 lg:mt-0 flex gap-1 lg:gap-0 lg:flex-col text-lg lg:text-[3vh] leading-7 text-center">
                AWASÚ
              </h1>
            </div>
          </div>
          {/* LOGO */}
          <div className="w-full py-[3vh] lg:py-[10vh]">
            <ImageLogo image="awasu/logo.webp" />
          </div>
        </div>
      </div>

      <div className="w-full relative flex flex-col 2xl:flex-row h-fit 2xl:h-[200px]  bg-white items-center 2xl:pl-10 bannerMain">
        <div className="w-[75%] flex flex-col 2xl:flex-row gap-10 items-center justify-center">
          <TitleMarca texto="Más sobre la marca" />
          <TextoMarca texto="La marca Awasu comunica seguridad y calidad en sus productos mediante su identidad visual. Con colores distintivos del rubro y el amarillo elegido para causar impacto, el conjunto de elementos hace a la marca única en el mercado." />
        </div>
        <img
          src="/assets/images/portafolio/awasu/patita.webp"
          alt=""
          className="w-auto h-[400px] 2xl:h-[500px] object-cover object-right relative 2xl:absolute right-0 bottom-0 z-[10]"
        />
      </div>
      <div className="w-full py-4 lg:py-0 lg:h-[120px] gap-4 lg:gap-0 flex flex-col-reverse lg:flex-row-reverse bg-[#A8D8E2] overflow-x-hidden">
        <div className="w-full lg:w-1/2 h-full flex items-center justify-center">
          <CodigoColor texto="#008CC4" />
        </div>
        <div className="w-full lg:w-1/2 h-full flex items-center justify-center">
          <TextoPaleta texto="PALETA DE COLOR" />
        </div>
      </div>
      <div className="flex flex-col-reverse lg:flex-row w-full">
        <div className="flex flex-col lg:w-1/2 h-auto overflow-hidden">
          <Tipografia image="awasu/tipografia.webp" />
          <img
            src={'/assets/images/portafolio/awasu/chapa.webp'}
            alt=""
            className="h-auto w-full "
          />
        </div>
        <Image1 image="awasu/recurso1.webp" />
      </div>

      <div className="flex flex-col-reverse lg:flex-row w-full">
        <Image1 image="awasu/botella.webp" />
        <div className="flex flex-col lg:w-1/2 h-auto overflow-hidden">
          <Tipografia image="awasu/carta.webp" />
          <img
            src={'/assets/images/portafolio/awasu/cartel.webp'}
            alt=""
            className="h-auto w-full"
          />
        </div>
      </div>

      <div className="w-full h-[140px] lg:h-[300px]  flex flex-col justify-center items-center text-gray-300 relative cursor-pointer degraded_main z-1">
        <img
          src="/assets/images/portafolio/awasu/fondo_bot.webp"
          alt=""
          className="w-full h-full object-cover object-center absolute inset-0 z-0 opacity-65"
        />
        <Link
          href="/portafolio/diseno_grafico/jackos_bar"
          className="absolute left-0 lg:left-4 h-fit top-0 bottom-0 my-auto text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer"
        >
          <FaCaretLeft className="text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer" />
        </Link>
        <span className="text-lg lg:text-[4vh] leading-6 lg:leading-[3rem] relative z-1">
          SIGUIENTE
        </span>
        <span className="text-lg lg:text-[6vh] font_Archivo_bold z-1 relative leading-6 lg:leading-[3rem]">
          GASOLINERAS DEL NORTE
        </span>
        <Link
          href="/portafolio/diseno_grafico/awasu"
          className="absolute right-0 lg:right-4 rotate-180 h-fit top-0 bottom-0 my-auto text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer"
        >
          <FaCaretLeft className="text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer" />
        </Link>
      </div>

      <ButtonPlanes parametro= 'Diseño grafico'/>

    </section>
  )
}
