/* eslint-disable @next/next/no-img-element */
import { generateMetadata } from '@/public/components/seo/SeoList'
import { Header } from '@/public/components/web/structure/Header'
import Link from 'next/link'
import { AiOutlineCaretRight } from 'react-icons/ai'
import { FaCaretLeft } from 'react-icons/fa6'
import { ImageLogo } from '../../diseno_grafico/plaza_san_antonio/transiciones/ImageLogo'
import { TextoMarca } from './animate/TextoMarca'
import { ImageMarca } from './animate/ImageMarca'
import { ImagesRecurse1 } from './animate/ImagesRecurse1'
import { TextoSeo } from './animate/TextoSeo'
import { Redes } from './animate/Redes'
import { Regresar } from '@/public/components/web/portafolio/general/Regresar'
import { Subtitle } from './animate/Subtitle'
import { Gatito } from '../medicina_academica/animate/Gatito'
import { ButtonPlanes } from '../../@componentes/ButtonPlanes'
export const metadata = generateMetadata()

export default function JackosBar () {
  return (
    <section className="relative z-10  bannerMain degraded_main font_Archivo">
      <Regresar />
      <Header />
      <div className="h-auto w-full relative">
        <img
          src="/assets/images/portafolio/desarrollo_web/rda/fondo2.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-right lg:object-center object-cover z-[-1]"
        />
        <div className="pt-[9vh] relative overflow-hidden lg:pt-[10vh] lg:h-fit p-4 lg:pb-0 lg:px-20 xl:px-28 2xl:px-36 ">
          <div className="w-full flex justify-center text-white ">
            <div className="flex gap-2 items-center text-white">
              <span className="uppercase font-bold text-xl hidden lg:block lg:text-[3vh] text-white text_shadow">
                CLIENTE
              </span>
              <AiOutlineCaretRight className="text-4xl hidden lg:block text-[#F4D35F]" />
              <h1 className="uppercase text_shadow font-bold text-white mt-4 lg:mt-0 flex gap-1 lg:gap-0 lg:flex-col text-lg lg:text-[2.4vh] leading-7 text-center">
                RADIOLOGÍA DENTAL <span className="">AVANZADA</span>
              </h1>
            </div>
          </div>
          <Gatito/>

          {/* LOGO */}
          <div className="w-full py-[3vh] lg:py-[10vh]">
            <ImageLogo image="desarrollo_web/rda/logo.webp" />
          </div>
          <Subtitle texto="ESTUDIOS RADIOLÓGICOS" />
        </div>
      </div>

      <div className="w-full h-[700px] md:h-[800px] lg:h-[920px] xl:h-auto relative bg-[#E1FFF3]">
        <ImageMarca />
        <TextoMarca />
      </div>

      <div className="flex flex-col w-full relative overflow-hidden bg-white  h-auto">
        <img
          src="/assets/images/portafolio/desarrollo_web/rda/fondo_2.webp"
          alt=""
          className="h-auto w-full absolute top-0 left-0 right-0 object-contain"
        />
        <ImagesRecurse1 />
        <div className="w-full relative py-16">
          <img
            src="/assets/images/portafolio/desarrollo_web/rda/fondo.webp"
            alt=""
            className="w-full h-full absolute top-0 left-0 right-0 z-[1] object-cover object-top "
          />
          <div className="w-full md:w-[80%] flex md:gap-5 lg:gap-0 flex-col-reverse lg:flex-row p-5 md:p-10 relative mx-auto overflow-hidden">
            <TextoSeo />
          </div>
        </div>
      </div>

      <section className="w-full flex xl:hidden items-center justify-center relative h-[520px] lg:h-[730px] bg-[url(/assets/images/portafolio/desarrollo_web/padre_eterno/marca.webp)] bg-no-repeat bg-cover bg-right">
        <div className="absolute top-0 bottom-0 m-auto left-0 right-0 ml-[66px] md:ml-auto w-[301px] lg:w-[370px]  z-[10] h-[500px] lg:h-[700px] bg-[url(/assets/images/portafolio/desarrollo_web/padre_eterno/celular.webp)] bg-no-repeat bg-contain">
          <div className="w-full h-full z-[9] absolute inset-0 overflow-hidden rounded-[50px]">
            <div className="w-[97%] h-[97%] rounded-[50px]">
              <div className="rounded-[50px] absolute left-0 top-0 w-full h-full pt-[39px] lg:pt-[55px] pl-[13.1px] lg:pl-[19px] pr-[66px] lg:pr-[41px] pb-[10px] lg:pb-[18px]">
                <div className="w-full h-full rounded-bl-[29px] rounded-br-[29px] lg:rounded-bl-[34px] lg:rounded-br-[34px] overflow-auto scroll_black">
                  <img
                    src="/assets/images/portafolio/desarrollo_web/rda/capturacel.webp"
                    alt="Screen Capture"
                    className="w-full object-cover "
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-[200px] md:h-[300px] lg:h-auto relative">
        <img
          src="/assets/images/portafolio/desarrollo_web/rda/recurso4.webp"
          alt=""
          className="h-full lg:h-auto w-full object-cover object-left lg:object-center"
        />
        <Redes />
      </div>

      <div className="w-full flex flex-col p-4 py-10 lg:p-10 relative z-2 font_Archivo_bold">
        <img
          src="/assets/images/portafolio/desarrollo_web/rda/fondo5.webp"
          alt=""
          className="w-full h-full absolute inset-0 object-cover z-[-1]"
        />
        <h3 className="text-xl md:text-[2rem] lg:text-[2.5rem] text_shadow 2xl:text-[3.2rem] lg:leading-[3.5rem] w-full text-center text-white">
          REGISTRAMOS TODO EL PROCESO EN NUESTROS SISTEMA
        </h3>
        <div className="flex flex-col lg:flex-row lg:flex-wrap 2xl:flex-nowrap w-full lg:w-[80%] mx-auto justify-between pt-6 xl:pt-12 gap-3 lg:gap-10 ">
          <div className="bg-main w-full flex items-center justify-center lg:w-[45%] lg:h-[100px] 2xl:h-auto 2xl:w-full rounded-l-full rounded-r-full py-3 md:py-4 px-4 text-[1.1rem] md:text-[1.5rem] 2xl:text-[1.8rem] text-white text-center 2xl:leading-[2rem]">
            <p>COMPLETAR EL CUESTIONARIO</p>
          </div>
          <div className="bg-main w-full flex items-center justify-center lg:w-[45%] lg:h-[100px] 2xl:h-auto 2xl:w-full rounded-l-full rounded-r-full py-3 md:py-4 px-4 text-[1.1rem] md:text-[1.5rem] 2xl:text-[1.8rem] text-white text-center 2xl:leading-[2rem]">
            <p>AVANCES</p>
          </div>
          <div className="bg-main w-full flex items-center justify-center lg:w-[45%] lg:h-[100px] 2xl:h-auto 2xl:w-full  rounded-l-full rounded-r-full py-3 md:py-4 px-4 text-[1.1rem] md:text-[1.5rem] 2xl:text-[1.8rem] text-white text-center 2xl:leading-[2rem]">
            <p>CAPACITACIONES</p>
          </div>
          <div className="bg-main w-full flex items-center justify-center lg:w-[45%] lg:h-[100px] 2xl:h-auto 2xl:w-full  rounded-l-full rounded-r-full py-3 md:py-4 px-4 text-[1.1rem] md:text-[1.5rem] 2xl:text-[1.8rem] text-white text-center 2xl:leading-[2rem]">
            <p>ARCHIVOS FINALIZADOS</p>
          </div>
        </div>
        <img
          src="/assets/images/portafolio/desarrollo_web/rda/captura_sistema.webp"
          alt=""
          className="mt-10 object-contain w-full lg:w-[80%] mx-auto h-auto"
        />
      </div>

      <div className="w-full h-[140px]  lg:h-[300px] flex flex-col justify-center items-center text-gray-300 relative cursor-pointer degraded_main z-1">
        <img
          src="/assets/images/portafolio/desarrollo_web/rda/foot_1.webp"
          alt=""
          className="w-full h-full object-cover object-center absolute inset-0 z-0"
        />
         <Link
          href="/portafolio/desarrollo_web/fisiofast"
          className="absolute left-0 lg:left-4  h-fit top-0 bottom-0 my-auto text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer"
        >
          <FaCaretLeft className="text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer" />
        </Link>
        <span className="text-lg lg:text-[4vh] leading-6 lg:leading-[3rem] relative z-1">
          SIGUIENTE
        </span>
        <span className="text-lg lg:text-[6vh] font_Archivo_bold z-1 relative leading-6 lg:leading-[3rem]">
          INACONS
        </span>
        <Link
          href="/portafolio/desarrollo_web/inacons"
          className="absolute right-0 lg:right-4 rotate-180 h-fit top-0 bottom-0 my-auto text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer"
        >
          <FaCaretLeft className="text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer" />
        </Link>
      </div>

      <ButtonPlanes parametro= 'Desarrollo web'/>

    </section>
  )
}
