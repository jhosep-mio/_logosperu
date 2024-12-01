/* eslint-disable @next/next/no-img-element */
import { generateMetadata } from '@/public/components/seo/SeoList'
import { Header } from '@/public/components/web/structure/Header'
import Link from 'next/link'
import { AiOutlineCaretRight } from 'react-icons/ai'
import { FaCaretLeft } from 'react-icons/fa6'
import { ImageLogo } from './animate/ImageLogo'
import { Subtitle } from './animate/Subtitle'
import { ImageMarca } from './animate/ImageMarca'
import { TextoMarca } from './animate/TextoMarca'
import { Regresar } from '@/public/components/web/portafolio/general/Regresar'
import { ButtonPlanes } from '../../@componentes/ButtonPlanes'
export const metadata = generateMetadata()

export default function Capacitaciones () {
  return (
    <section className="relative z-10  bannerMain bg-white font_Archivo">
      <Header />
      <Regresar />
      <div className="h-auto w-full relative">
        <img
          src="/assets/images/portafolio/capacitaciones/corporacion_empaques/fondo.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-right lg:object-center object-cover z-[-1]"
        />
        <div className="pt-[9vh] lg:pt-[10vh] lg:h-fit p-4 lg:pb-0 lg:px-20 xl:px-28 2xl:px-36 ">
          <div className="w-full flex justify-center text-white ">
            <div className="flex gap-2 items-center text-white">
              <span className="uppercase font-bold text-xl hidden lg:block lg:text-[3vh] text-white text_shadow">
                CLIENTE
              </span>
              <AiOutlineCaretRight className="text-4xl hidden lg:block text-main" />
              <h1 className="uppercase text_shadow2 font-bold text-white mt-4 lg:mt-0 flex gap-1 lg:gap-0 lg:flex-col text-lg lg:text-[2.4vh] leading-7 text-center">
                CORPORACIÓN DE <span className="">EMPAQUES</span>
              </h1>
            </div>
          </div>
          {/* LOGO */}
          <div className="w-full py-[3vh] lg:py-[10vh]">
            <ImageLogo image="capacitaciones/corporacion_empaques/logo.webp" />
          </div>
          <Subtitle texto="soluciones en cartón" />
        </div>
      </div>
      <div className="w-full lg:h-fit xl:h-auto relative bg-[#E1FFF3] overflow-hidden ">
        <ImageMarca />
        <div className="w-full h-full  absolute inset-0">
          <TextoMarca />
        </div>
      </div>
      <div className="w-full flex-col bg-white font_Archivo_bold">
        <div className="flex flex-col lg:flex-row gap-4 2xl:gap-10 py-4 lg:pt-0 2xl:pb-8">
          <div className="w-full lg:w-[40%] 2xl:w-1/2 h-full xl:pr-10 xl:pl-24 xl:py-16 m-auto">
            <img
              src="/assets/images/portafolio/capacitaciones/corporacion_empaques/logo.webp"
              alt=""
              className="w-[80%]   block m-auto h-full object-contain "
            />
          </div>
          <div className="w-full lg:w-[60%] 2xl:w-1/2  text-white bg-[#091368] rounded-l-full flex items-center justify-center">
            <div className="w-[90%] m-auto h-fit  items-center justify-center gap-3  flex flex-col pl-10 py-10 lg:pb-10">
              <h2 className="w-full text-left text-2xl md:text-[1.7rem] xl:text-[2.5rem]">
                SOLUCIÓN
              </h2>
              <p className="md:text-[1.2rem] 2xl:text-[1.3rem] text-justify ">
                Logos Perú nos ha acompañado desde el mejoramiento de nuestro
                logotipo, reflejando nuestra actividad. Además, nos ha ayudado a
                posicionarnos en la web mediante el uso de palabras clave para
                las búsquedas en Google.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full z-[2] relative font_Archivo_bold">
          <h3 className="text-[#091368] text-lg lg:text-3xl text-center w-[90%] mx-auto pt-4 pb-4 lg:pb-8">
            Nuestro equipo ofrece una capacitación integral y efectiva al
            cliente, explicando con detalle cada aspecto y propósito del SEO.
          </h3>
          <div className="flex flex-col lg:flex-row-reverse justify-center relative py-4 px-4 lg:pt-0 lg:pb-8 ">
            <div className="w-full lg:w-1/2 h-full">
              <img
                src="/assets/images/portafolio/capacitaciones/corporacion_empaques/capturareunion.webp"
                alt=""
                className="w-full block m-auto h-full object-contain object-left"
              />
            </div>
            <div className="w-full lg:w-[50%] 2xl:w-[40%] flex h-full flex-col my-auto">
              <div className="w-full h-[50%] text-white bg-main rounded-b-full lg:rounded-br-none lg:rounded-l-full flex items-center justify-center">
                <div className="w-[90%] pb-14 h-[170px] md:h-auto 2xl:w-[90%] m-auto items-center justify-center gap-3 flex flex-col lg:pl-10 py-10 lg:pb-10">
                  <h2 className="w-full text-center text-xl md:text-[2.4rem] 2xl:text-[3rem] md:leading-[3rem] 2xl:leading-[3.4rem]">
                    CAPACITACIÓN Y ASESORAMIENTO
                  </h2>
                </div>
              </div>
              <div className="w-[40%] mx-auto py-4 px-4 gap-6 flex justify-center">
                <Link href="https://meet.google.com/" target="_blank">
                  <img
                    src="/assets/images/portafolio/capacitaciones/corporacion_empaques/meet.webp"
                    alt=""
                    className="w-full h-full object-contain mx-auto"
                  />
                </Link>
                <Link href="https://zoom.us/es" target="_blank">
                  <img
                    src="/assets/images/portafolio/capacitaciones/corporacion_empaques/zoom.webp"
                    alt=""
                    className="w-full h-full  object-contain mx-auto"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>

        <div className="w-full flex flex-col  relative z-[2]">
          <img
            src="/assets/images/portafolio/capacitaciones/corporacion_empaques/fondo3.webp"
            alt=""
            className="absolute w-full inset-0 left-0 top-0 right-0 z-0 flex flex-col gap-10"
          />
          <div className="w-full flex flex-col p-8 lg:p-20 z-10">
            <h3 className="text-2xl md:text-[2rem] lg:text-[2.5rem] 2xl:text-[3.2rem] lg:leading-[3.5rem] w-full text-center text-[#F89B1A]">
              PALABRAS CLAVES EN LA BÚSQUEDA
            </h3>
            <div className="flex flex-col lg:flex-row w-full justify-between pt-6 xl:pt-12 gap-3 lg:gap-10">
              <div className="bg-[#F89B1A] w-full lg:w-1/3 rounded-l-full rounded-r-full py-3 md:py-4 px-4 text-xl md:text-[1.5rem] 2xl:text-[1.8rem] text-white text-center 2xl:leading-[2.5rem]">
                <p>
                  EMPAQUES DE <br className="hidden lg:block" /> CARTON
                </p>
              </div>
              <div className="bg-[#F89B1A] w-full lg:w-1/3 rounded-l-full rounded-r-full py-3 md:py-4 px-4 text-xl md:text-[1.5rem] 2xl:text-[1.8rem] text-white text-center 2xl:leading-[2.5rem]">
                <p>
                  CAJAS <br className="hidden lg:block" /> CONVENCIONALES
                </p>
              </div>
              <div className="bg-[#F89B1A] w-full lg:w-1/3  rounded-l-full rounded-r-full py-3 md:py-4 px-4 text-xl md:text-[1.5rem] 2xl:text-[1.8rem] text-white text-center 2xl:leading-[2.5rem]">
                <p>
                  CAJAS <br className="hidden lg:block" /> TROQUELADAS
                </p>
              </div>
            </div>
          </div>
          <div className="w-full h-full relative  z-10">
            <div className="w-full h-full  inset-0 flex flex-col lg:flex-row items-center lg:px-10 ">
              <img
                src="/assets/images/portafolio/capacitaciones/corporacion_empaques/capturaseo.webp"
                alt=""
                className="h-[300px] object-left lg:h-full w-full lg:w-[70%] my-auto object-cover lg:object-contain pr-4"
              />
              <div className="lg:absolute right-0 top-0 bottom-0 lg:my-auto bg-black w-full h-[200px] lg:w-[50%] 2xl:h-[300px] rounded-l-full lg:p-10">
                <p className="md:text-[1.5rem] 2xl:text-[1.9rem] text-white w-[90%] 2xl:w-[70%] pl-4 lg:pl-0 text-justify mx-auto  h-full flex items-center">
                  La página ocupa el cuarto lugar en la búsqueda de Google,
                  después de las páginas patrocinadas.
                </p>
              </div>
            </div>
          </div>
        </div>
        {/* <div className='h-[100px] w-full'>
        </div> */}

        <div className="w-full h-full relative  z-10 overflow-hidden">
          <img
            src="/assets/images/portafolio/capacitaciones/corporacion_empaques/fondo4.webp"
            alt=""
            className="w-full block m-auto object-cover lg:object-fill h-[400px] lg:h-full "
          />
          <div className="bg-white h-[16vh] w-full" />
          <div className="w-full h-full absolute inset-0 flex flex-col gap-3 2xl:gap-6 items-center px-4 lg:px-10 mt-[20%] md:mt-[10%] text-white">
            <h3 className="text-2xl md:text-[2rem] 2xl:text-[3.5rem] text-center">
              TE ACOMPAÑAMOS EN CADA PROCESO
            </h3>
            <p className="text-base md:text-[1rem] lg:text-[1.25rem] 2xl:text-[1.6rem] text-white w-full text-center mx-auto font_Archivo">
              Y TE BRINDAMOS UN CERTIFICADO POR TU PARICIPACIÓN EN LA
              CAPACITACIÓN
            </p>
            <p className="text-sm lg:text-[1.25rem] text-white text-center mx-auto font_Archivo mt-4 2xl:mt-6 bg-[#F89B1A] w-fit px-4 lg:px-16  py-2 rounded-l-full rounded-r-full">
              TODOS LOS ARCHIVOS LO ENCONTRARAS EN NUESTRO SISTEMA
            </p>
            <img
              src="/assets/images/portafolio/capacitaciones/corporacion_empaques/certificado.webp"
              alt=""
              className="h-full w-full md:w-[70%] my-auto object-contain object-top mt-6 lg:mt-0"
            />
          </div>
        </div>
      </div>
      <div className="w-full h-[140px]  lg:h-[300px] flex flex-col justify-center items-center text-gray-300 relative cursor-pointer degraded_main z-1">
        <Link
          href="/portafolio/community_manager/new_fest"
          className="absolute left-0 lg:left-4 h-fit top-0 bottom-0 my-auto text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer z-[1]"
        >
          <FaCaretLeft className="text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer" />
        </Link>
        <img
          src="/assets/images/portafolio/capacitaciones/corporacion_empaques/foot.webp"
          alt=""
          className="w-full h-full object-cover object-center absolute inset-0 z-0"
        />
        <span className="text-lg text-white lg:text-[4vh] leading-6 lg:leading-[3rem] relative z-1">
          SIGUIENTE
        </span>
        <span className="text-lg text-white lg:text-[4.5vh] font_Archivo_bold z-1 relative leading-6 lg:leading-[3rem]">
          LORDCRU
        </span>
        <Link
          href="/portafolio/capacitaciones/lordcru"
          className="absolute right-0 lg:right-4 rotate-180 h-fit top-0 bottom-0 my-auto text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer"
        >
          <FaCaretLeft className="text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer" />
        </Link>
      </div>
      <ButtonPlanes parametro="capacitacion google" />
    </section>
  )
}
