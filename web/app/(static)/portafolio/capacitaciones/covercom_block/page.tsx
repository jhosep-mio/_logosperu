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
import { Gatito } from '../../diseno_grafico/moralitos/animate/Gatito'
import { ButtonPlanes } from '../../@componentes/ButtonPlanes'
export const metadata = generateMetadata()

export default function Capacitaciones () {
  return (
    <section className="relative z-10  bannerMain bg-white font_Archivo">
      <Header />
      <Regresar />
      <div className="h-auto w-full relative">
        <img
          src="/assets/images/portafolio/capacitaciones/covercom_block/fondo.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-top lg:object-center object-cover z-[-1]"
        />
        <div className="pt-[9vh] relative overflow-hidden lg:pt-[10vh] lg:h-fit p-4 lg:pb-0 lg:px-20 xl:px-28 2xl:px-36 ">
          <div className="w-full flex justify-center text-[#252525] ">
            <div className="flex gap-2 items-center text-[#252525]">
              <span className="uppercase font-bold text-xl hidden lg:block lg:text-[3vh] text-[#252525] text_shadow">
                CLIENTE
              </span>
              <AiOutlineCaretRight className="text-4xl hidden lg:block text-main" />
              <h1 className="uppercase text_shadow font-bold text-[#252525] mt-4 lg:mt-0 flex gap-1 lg:gap-0 lg:flex-col text-lg lg:text-[2.4vh] leading-7 text-center">
                COVERCOM BLOCK SAC
              </h1>
            </div>
          </div>

          <Gatito/>

          {/* LOGO */}
          <div className="w-full py-[3vh] lg:py-[10vh]">
            <ImageLogo image="capacitaciones/covercom_block/logo.webp" />
          </div>
          <Subtitle texto="Visibilidad en Línea" />
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
              src="/assets/images/portafolio/capacitaciones/covercom_block/logo2.webp"
              alt=""
              className="w-[80%]   block m-auto h-full object-contain "
            />
          </div>
          <div className="w-full lg:w-[60%] 2xl:w-1/2  text-white bg-[#35373B] rounded-l-full flex items-center justify-center">
            <div className="w-[90%] m-auto h-fit  items-center justify-center gap-3  flex flex-col pl-10 py-10 lg:pb-10">
              <h2 className="w-full text-left text-2xl md:text-[1.7rem] xl:text-[2.5rem]">
                SOLUCIÓN
              </h2>
              <p className="md:text-[1.2rem] 2xl:text-[1.3rem] text-justify ">
                Nuestro equipo de especialistas trabajó de la mano con Covercom
                para crear y ejecutar campañas publicitarias altamente
                segmentadas que destacaran las características y beneficios de
                los productos.
              </p>
            </div>
          </div>
        </div>

        <div className="w-full z-[2] relative font_Archivo_bold">
          <h3 className="text-[#302E31] text-lg lg:text-3xl text-center w-[90%] mx-auto pt-4 pb-4 lg:pb-8">
            La capacidad de gestionar y optimizar sus campañas de Google Ads
            internamente permitió a Covercom mantener una ventaja competitiva en
            el mercado y continuar creciendo de manera sostenible.
          </h3>
          <div className="flex flex-col lg:flex-row-reverse justify-center relative py-4 px-4 lg:pt-0 lg:pb-8 ">
            <div className="w-full lg:w-1/2 h-full">
              <img
                src="/assets/images/portafolio/capacitaciones/covercom_block/capturareunion.webp"
                alt=""
                className="w-full block m-auto h-full object-contain object-left"
              />
            </div>
            <div className="w-full lg:w-[50%] 2xl:w-[40%] flex h-full flex-col my-auto">
              <div className="w-full h-[50%] text-white bg-[#302E31] rounded-b-full lg:rounded-br-none lg:rounded-l-full flex items-center justify-center">
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

        <div className="w-full flex flex-col p-4 lg:p-10 relative z-[2] bg-[#F89B1A] lg:bg-transparent">
          <img
            src="/assets/images/portafolio/capacitaciones/covercom_block/fondo3.webp"
            alt=""
            className="hidden lg:block absolute w-full inset-0 left-0 top-0 right-0 z-0"
          />
          <div className="flex flex-col-reverse lg:flex-row gap-10 required: z-[2] w-full lg:w-[80%] mx-auto py-6 lg:py-32">
            <div className="w-full lg:w-[50%]">
              <video controls className="w-full object-contain">
                <source
                  src="/assets/images/portafolio/capacitaciones/covercom_block/google.mp4"
                  type="video/mp4"
                  className="w-full object-contain"
                />
                Tu navegador no soporta la reproducción de videos.
              </video>
            </div>
            <div className="w-full lg:w-1/2">
              <div className="w-[90%] h-full mx-auto flex flex-col justify-center gap-3 lg:gap-10 text-white font_Archivo_bold">
                <h3 className="text-3xl lg:text-5xl text-center w-full uppercase">
                  ¿QUÉ INCLUYÓ LA <br /> CAPACITACIÓN?
                </h3>
                <div className="w-full flex flex-col gap-2 lg:gap-6">
                  <p className="text-lg lg:text-2xl w-full text-[#F89B1A] lg:text-white bg-white lg:bg-[#F89B1A] py-4 px-4 text-center rounded-xl">
                    Introducción a Google Ads
                  </p>
                  <p className="text-lg lg:text-2xl w-full text-[#F89B1A] lg:text-white bg-white lg:bg-[#F89B1A] py-4 px-4 text-center rounded-xl">
                    Investigación y Selección de Keywords
                  </p>
                  <p className="text-lg lg:text-2xl w-full text-[#F89B1A] lg:text-white bg-white lg:bg-[#F89B1A] py-4 px-4 text-center rounded-xl">
                    Creación de Anuncios
                  </p>
                  <p className="text-lg lg:text-2xl w-full text-[#F89B1A] lg:text-white bg-white lg:bg-[#F89B1A] py-4 px-4 text-center rounded-xl">
                    Optimización y Gestión de Campañas
                  </p>
                  <p className="text-lg lg:text-2xl w-full text-[#F89B1A] lg:text-white bg-white lg:bg-[#F89B1A] py-4 px-4 text-center rounded-xl">
                    Medición de Resultados
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* <div className='h-[100px] w-full'>
        </div> */}

        <div className="w-full h-full relative -mt-[8%] md:-mt-[5%]  lg:-mt-[3%] z-10 overflow-hidden">
          <img
            src="/assets/images/portafolio/capacitaciones/covercom_block/fondo4.webp"
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
              src="/assets/images/portafolio/capacitaciones/covercom_block/certificado.webp"
              alt=""
              className="h-full w-full md:w-[70%] my-auto object-contain object-top mt-6 lg:mt-0"
            />
          </div>
        </div>
      </div>
      <div className="w-full h-[140px]  lg:h-[300px] flex flex-col justify-center items-center text-gray-300 relative cursor-pointer degraded_main z-1">
        <Link
          href="/portafolio/capacitaciones/lordcru"
          className="absolute left-0 z-[2] lg:left-4  h-fit top-0 bottom-0 my-auto text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer"
        >
          <FaCaretLeft className="text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer" />
        </Link>
        <img
          src="/assets/images/portafolio/capacitaciones/covercom_block/foot.webp"
          alt=""
          className="w-full h-full object-cover object-center absolute inset-0 z-0"
        />
        <span className="text-lg text-white lg:text-[4vh] leading-6 lg:leading-[3rem] relative z-1">
          SIGUIENTE
        </span>
        <span className="text-lg text-white lg:text-[4.5vh] font_Archivo_bold z-1 relative leading-6 lg:leading-[3rem]">
          CENTRO MÉDICO OFTALMOLÓGICO
        </span>
        <Link
          href="/portafolio/capacitaciones/centro_medico_oftalmologico"
          className="absolute right-0 lg:right-4 rotate-180 h-fit top-0 bottom-0 my-auto text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer"
        >
          <FaCaretLeft className="text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer" />
        </Link>
      </div>
      <ButtonPlanes parametro= 'capacitacion google'/>
    </section>
  )
}
