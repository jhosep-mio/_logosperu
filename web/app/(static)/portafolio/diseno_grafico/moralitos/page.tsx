/* eslint-disable @next/next/no-img-element */
import { generateMetadata } from '@/public/components/seo/SeoList'
import { Recurso1 } from '@/public/components/web/portafolio/diseno_grafico/warent_it_consulting/Recurso1'
import { Recurso2 } from '@/public/components/web/portafolio/diseno_grafico/warent_it_consulting/Recurso2'
import { Recurso3 } from '@/public/components/web/portafolio/diseno_grafico/warent_it_consulting/Recurso3'
import { Recurso4 } from '@/public/components/web/portafolio/diseno_grafico/warent_it_consulting/Recurso4'
import { Recurso5 } from '@/public/components/web/portafolio/diseno_grafico/warent_it_consulting/Recurso5'
import { Recurso6 } from '@/public/components/web/portafolio/diseno_grafico/warent_it_consulting/Recurso6'
import { Recurso7 } from '@/public/components/web/portafolio/diseno_grafico/warent_it_consulting/Recurso7'
import { Header } from '@/public/components/web/structure/Header'
import Link from 'next/link'
import { AiOutlineCaretRight } from 'react-icons/ai'
import { FaCaretLeft } from 'react-icons/fa6'
import { ImageLogo } from '../plaza_san_antonio/transiciones/ImageLogo'
import { Subtitle } from '../plaza_san_antonio/transiciones/Subtitle'
import { TitleMarca } from '../plaza_san_antonio/transiciones/TitleMarca'
import { ImagenDegradate } from '../plaza_san_antonio/transiciones/ImagenDegradate'
import { TextoMarca } from '../plaza_san_antonio/transiciones/TextoMarca'
import { Tipografia } from './animate/Tipografia'
import { Paleta } from './animate/Paleta'
import { Paleta2 } from './animate/Paleta2'
import { Image1 } from './animate/Image1'
import { Image3 } from './animate/Image3'
import { Regresar } from '@/public/components/web/portafolio/general/Regresar'
import { Gatito } from './animate/Gatito'
import { ButtonPlanes } from '../../@componentes/ButtonPlanes'
// import { Gatito } from './animate/Gatito'
export const metadata = generateMetadata()

export default function JackosBar () {
  return (
    <section className="relative z-10  bannerMain degraded_main font_Archivo">
      <Header />
      <Regresar/>

      <div className="h-auto w-full relative">
        <img
          src="/assets/images/portafolio/moralitos/fondo.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-right lg:object-center object-cover z-[-1]"
        />
        <div className="pt-[9vh] lg:pt-[10vh] lg:h-fit relative overflow-hidden p-4 lg:pb-0 lg:px-20 xl:px-28 2xl:px-36 ">
          {/* <span className="flex lg:hidden gap-2 text-sm items-center text-white">
                <MdOutlineArrowCircleLeft className="text-xl" />
                Ver todos los proyectos
            </span> */}
            <Gatito/>

          <div className="w-full flex justify-center text-white ">
            <div className="flex gap-2 items-center text-white">
              <span className="uppercase font-bold text-xl hidden lg:block lg:text-[3vh] text-white text_shadow">
                CLIENTE
              </span>
              <AiOutlineCaretRight className="text-4xl hidden lg:block text-[#F4D35F]" />
              <h1 className="uppercase text_shadow font-bold text-white mt-4 lg:mt-0 flex gap-1 lg:gap-0 lg:flex-col text-lg lg:text-[3vh] leading-7 text-center">
                MORALITOS
              </h1>
            </div>
          </div>
          {/* LOGO */}
          <div className="w-full relative py-[3vh] lg:py-[10vh]">

            <ImageLogo image="moralitos/logo.webp" />
          </div>
          <Subtitle texto="COMPROMISO Y BIENESTAR" />
        </div>
      </div>

      <div className="w-full relative overflow-hidden flex flex-col lg:flex-row gap-5 overflow-x-clip overflow-y-visible lg:gap-10 px-4 h-[250px] py-6  degraded_main items-center lg:px-40 bannerMain z-10">

        <TitleMarca texto="Más sobre la marca" />
        {/* <Gatito/> */}
        <ImagenDegradate />
        <TextoMarca texto="MoralitosFarma ha brindado una excelente calidad de trabajo desde el año 2020. Nos hemos enfocado en ofrecer un servicio especializado para el bienestar de nuestros clientes, manteniendo siempre una imagen de confianza y compromiso." />
      </div>

      <div className="flex flex-col-reverse lg:flex-row w-full">
        <div className="flex flex-col lg:w-1/2 h-auto overflow-hidden">
          <Tipografia image='moralitos/tipofrafia.webp'/>
          <Paleta/>
        </div>
        <Image1 image='moralitos/recurso1.webp'/>
      </div>

      <div className="flex flex-col-reverse lg:flex-row w-full overflow-hidden">
        <div className='w-full lg:w-1/2 flex flex-col'>
            <Paleta2/>
            <div className="w-full bg-[#1D548A] flex items-center justify-center bannerMain h-full relative overflow-hidden z-[10]">
                <Recurso1 image="portafolio/moralitos/animate.webp" />
                <Recurso2 image="portafolio/moralitos/animate.webp" />
                <Recurso3 image="portafolio/moralitos/animate.webp" />
                <Recurso4 image="portafolio/moralitos/animate.webp" />
                <Recurso5 image="portafolio/moralitos/animate.webp" />
                <Recurso6 image="portafolio/moralitos/animate.webp" />
                <Recurso7 image="portafolio/moralitos/animate.webp" />
                <Image3/>
            </div>
        </div>
        <Image1 image='moralitos/recurso2.webp'/>
      </div>
      <div className="w-full overflow-hidden">
        <Tipografia image='moralitos/recurso5.webp'/>
      </div>
      <div
        className="w-full h-[140px] lg:h-[300px]  flex flex-col justify-center items-center text-gray-300 relative cursor-pointer degraded_main z-1"
      >
        <img
          src="/assets/images/portafolio/jackos_bar/mockup1.webp"
          alt=""
          className="w-full h-full object-cover absolute inset-0 z-0 opacity-35"
        />
         <Link
          href="/portafolio/diseno_grafico/plaza_san_antonio"
          className="absolute left-0 lg:left-4 h-fit top-0 bottom-0 my-auto text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer"
        >
          <FaCaretLeft className="text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer" />
        </Link>
        <span className="text-lg lg:text-[4vh] leading-6 lg:leading-[3rem] relative z-1">
          SIGUIENTE
        </span>
        <span className="text-lg lg:text-[6vh] font_Archivo_bold z-1 relative leading-6 lg:leading-[3rem]">
          {"JACKO'S"} BAR
        </span>
        <Link
          href="/portafolio/diseno_grafico/jackos_bar"
          className="absolute right-0 lg:right-4 rotate-180 h-fit top-0 bottom-0 my-auto text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer"
        >
          <FaCaretLeft className="text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer" />
        </Link>
      </div>
      <ButtonPlanes parametro= 'Diseño grafico'/>
    </section>
  )
}
