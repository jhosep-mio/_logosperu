/* eslint-disable @next/next/no-img-element */
import { generateMetadata } from '@/public/components/seo/SeoList'
import { Header } from '@/public/components/web/structure/Header'
import Link from 'next/link'
import { AiOutlineCaretRight } from 'react-icons/ai'
import { FaCaretLeft } from 'react-icons/fa6'
import { ImageLogo } from './transiciones/ImageLogo'
import { Subtitle } from './transiciones/Subtitle'
import { TitleMarca } from './transiciones/TitleMarca'
import { TextoMarca } from './transiciones/TextoMarca'
import { ImagenDegradate } from './transiciones/ImagenDegradate'
import { TextoPaleta } from './transiciones/TextoPaleta'
import { CodigoColor } from './transiciones/CodigoColor'
import { Tipografia } from './transiciones/Tipografia'
import { Patita } from './transiciones/Patita'
import { Images } from './transiciones/Images'
import { Recurso1 } from '@/public/components/web/portafolio/diseno_grafico/warent_it_consulting/Recurso1'
import { Recurso2 } from '@/public/components/web/portafolio/diseno_grafico/warent_it_consulting/Recurso2'
import { Recurso3 } from '@/public/components/web/portafolio/diseno_grafico/warent_it_consulting/Recurso3'
import { Recurso4 } from '@/public/components/web/portafolio/diseno_grafico/warent_it_consulting/Recurso4'
import { Recurso5 } from '@/public/components/web/portafolio/diseno_grafico/warent_it_consulting/Recurso5'
import { Recurso6 } from '@/public/components/web/portafolio/diseno_grafico/warent_it_consulting/Recurso6'
import { Recurso7 } from '@/public/components/web/portafolio/diseno_grafico/warent_it_consulting/Recurso7'
import { Regresar } from '@/public/components/web/portafolio/general/Regresar'
import { ButtonPlanes } from '../../@componentes/ButtonPlanes'
// import { ButtonPlanes } from '@/public/components/servicios/general/ButtonPlanes'
export const metadata = generateMetadata()

export default function JackosBar () {
  return (
    <section className="relative z-10  bannerMain degraded_main font_Archivo">
      <Header />
      <div className="h-auto w-full relative">
        <img
          src="/assets/images/portafolio/plaza_san_antonio/fondo.webp"
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
              <h1 className="uppercase text_shadow font-bold text-white mt-4 lg:mt-0 flex gap-1 lg:gap-0 lg:flex-col text-lg lg:text-[2.4vh] leading-7 text-center">
                PLAZA SAN <span className="">ANTONIO</span>
              </h1>
            </div>
          </div>
          {/* LOGO */}
          <div className="w-full py-[3vh] lg:py-[10vh]">
            <ImageLogo image="plaza_san_antonio/logo.webp" />
          </div>
          <Subtitle texto="ENCANTO Y CONFORT" />
        </div>
        <Regresar/>
        {/* <ButtonPlanes/> */}
      </div>
      <div className="w-full relative flex flex-col 2xl:flex-row gap-5 overflow-hidden lg:gap-10 px-4 2xl:h-[180px] py-6  items-center lg:px-40 bannerMain">
        <TitleMarca texto="Más sobre la marca" />
        <ImagenDegradate />
        <TextoMarca texto="Somos un hotel ubicado en Arequipa, en una zona muy transitada. Con el paso de los años, hemos crecido hasta convertirnos en el mejor hotel de la ciudad. Nos visitan desde artistas hasta turistas extranjeros que buscan conocer más de nuestro país." />
      </div>
      <div className="w-full py-4 lg:py-0 lg:h-[120px] gap-4 lg:gap-0 flex flex-col-reverse lg:flex-row-reverse bg-[#E8522A]">
        <div className="w-full lg:w-1/2 h-full flex  items-center justify-center">
          <CodigoColor texto="#E8522A" />
        </div>
        <div className="w-full lg:w-1/2 h-full flex items-center justify-center">
          <TextoPaleta texto="PALETA DE COLOR" />
        </div>
      </div>
      <div className="flex flex-col-reverse lg:flex-row w-full ">
        <Tipografia />
        <div className="relative w-full h-[200px] lg:h-auto lg:w-1/2 overflow-hidden bannerMain">
          <Patita />
          <Recurso1 image="portafolio/plaza_san_antonio/animate.webp" />
          <Recurso2 image="portafolio/plaza_san_antonio/animate.webp" />
          <Recurso3 image="portafolio/plaza_san_antonio/animate.webp" />
          <Recurso4 image="portafolio/plaza_san_antonio/animate.webp" />
          <Recurso5 image="portafolio/plaza_san_antonio/animate.webp" />
          <Recurso6 image="portafolio/plaza_san_antonio/animate.webp" />
          <Recurso7 image="portafolio/plaza_san_antonio/animate.webp" />
        </div>
      </div>

      <Images />

      <div className="w-full h-[140px]  lg:h-[300px]  flex flex-col justify-center items-center text-gray-300 relative cursor-pointer degraded_main z-1">
        <img
          src="/assets/images/portafolio/moralitos/fondo.webp"
          alt=""
          className="w-full h-full object-cover object-center absolute inset-0 z-0"
        />
        <span className="text-lg lg:text-[4vh] leading-6 lg:leading-[3rem] relative z-1">
          SIGUIENTE
        </span>
        <span className="text-lg lg:text-[6vh] font_Archivo_bold z-1 relative leading-6 lg:leading-[3rem]">
          BOTICAS MORALITOS FARMA
        </span>
        <Link
          href="/portafolio/diseno_grafico/moralitos"
          className="absolute right-0 lg:right-4 rotate-180 h-fit top-0 bottom-0 my-auto text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer"
        >
          <FaCaretLeft className="text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer" />
        </Link>
      </div>
      <ButtonPlanes parametro= 'Diseño grafico'/>
    </section>
  )
}
