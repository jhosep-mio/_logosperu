/* eslint-disable @next/next/no-img-element */
import React from 'react'
import { Footer } from '@/public/components/web/structure/Footer'
import { Header } from '@/public/components/web/structure/Header'
import { AiOutlineCaretRight } from 'react-icons/ai'
import { GoSearch } from 'react-icons/go'
import Link from 'next/link'
import { FaCaretLeft } from 'react-icons/fa6'
import { generateMetadata } from '@/public/components/seo/SeoList'
export const metadata = generateMetadata()

export default function page () {
  return (
    <>
      <Header />
      <div className="px-5 pt-28 pb-16 bg-azul_serio relative before:absolute before:w-full before:h-full before:top-0 before:left-0 before:bg-[url(/assets/images/portafolio/hosting/biociencia/nubes.webp)] before:bg-contain before:bg-fixed z-10">
        <h2 className="text-4xl lg:text-5xl xl:text-7xl text-white  font-bold text-center text_shadow">
          HOSTING
        </h2>
        <div className="w-full flex justify-center text-white mt-12">
          <div className="flex gap-2 items-center text-white">
            <span className="uppercase font-bold text-xl hidden lg:block lg:text-[3vh] text-white">
              CLIENTE
            </span>
            <AiOutlineCaretRight className="text-4xl hidden lg:block text-main" />
            <h1 className="uppercase font-bold text-white mt-4 lg:mt-0 flex gap-1 lg:gap-0 lg:flex-col text-lg lg:text-[3vh] leading-7 text-center">
              BIOCIENCIA - BIOSCIENCE METROLOGÍA
            </h1>
          </div>
        </div>
      </div>
      <section className="w-full py-20 bg-[url(/assets/images/portafolio/hosting/biociencia/banner.webp)] bg-fixed z-10 relative">
        <h3 className="text-center text-3xl md:text-4xl font-bold text-white text_shadow2 mb-12">
          INNOVACIÓN EN TECNOLOGÍA DE LABORATORIO
        </h3>
        <p className="mx-auto max-w-5xl px-5 text-center text-lg md:text-3xl font-bold text-white text_shadow2">
          En nuestros negocios , nos destacamos como una empresa peruana
          comprometida con el avance científico y la excelencia en los
          laboratorios. Nuestra misión es equipar a los profesionales de la
          investigación con tecnología de vanguardia, y en ese camino,
          encontramos un aliado invaluable en Logos Peru.
        </p>
      </section>
      <section className="relative z-2 bg-[#0054B4] lg:bg-white">
        <img
          src="/assets/images/portafolio/hosting/biociencia/fondo99.webp"
          alt=""
          className="w-full h-full absolute top-0 lg:bottom-0 bg-bottom  left-0 right-0 z-0"
        />
        <section className="px-5 md:px-8 lg:px-12 xl:px-16 2xl:px-20 py-16 pb-0  relative z-2">
          <h5 className="text-center text-white text-3xl lg:text-4xl text_shadow2 uppercase mb-12 font-bold">
            Marcas trabajadas
          </h5>
          <div className="w-full rounded-[4rem] lg:rounded-full px-5 py-5 bg-white">
            <div className="max-w-5xl  flex flex-col lg:flex-row gap-6 justify-center  mx-auto items-center">
              <picture>
                <img
                  src="/assets/images/portafolio/hosting/biociencia/logo1.webp"
                  alt=""
                  className="w-[220px] lg:w-[355px] h-[120px] object-contain"
                />
              </picture>
              <picture>
                <img
                  src="/assets/images/portafolio/hosting/biociencia/logo2.webp"
                  alt=""
                  className="w-[220px] lg:w-[355px] h-[120px] object-contain"
                />
              </picture>
            </div>
          </div>
          <p className="mt-12 pb-16 text-white text-lg md:text-3xl text_shadow2 font-bold text-center px-1 md:px-10">
            La marca se ha desarrollado con Logos Perú, proporcionando un
            servicio web eficiente y rápido gracias a los servicios de hosting y
            dominio ofrecidos por la Agencia
          </p>
        </section>
        <section className="relative z-10">
          {/* <div className="px-5 absolute w-full -z-10 h-[300px] left-0 bottom-0 bg-bottom bg-no-repeat object-bottom bg-[url(/assets/svg/curva_nosotros.svg)] bg-cover"></div> */}
          <p className="text-white text-2xl md:text-3xl lg:text-5xl text_shadow2 font-bold text-center mb-8">
            TE PROPORCIONAMOS UN ESPACIO EN NUESTRO HOSTING
          </p>
          <div className="w-full px-5 max-w-7xl rounded-tr-[5rem] overflow-hidden mx-auto relative h-fit z-20 bg-no-repeat py-12  bg-[url(/assets/images/portafolio/hosting/biociencia/grafico1.webp)] bg-cover">
            <p className="text-center text-2xl md:text-3xl lg:text-5xl font-bold text-[#0054B4] uppercase mb-2">
              ¿No tienes correos corporativos?
            </p>
            <p className="text-center text-2xl md:text-3xl lg:text-5xl font-bold text-[#3AD032] uppercase mb-8">
              NOSOTROS LO CREAMOS
            </p>
            <img
              src="/assets/images/portafolio/hosting/biociencia/correos.webp"
              alt=""
              className="w-[650px] mx-auto block"
            />
          </div>
        </section>
      </section>
      <section className="w-full bg-[#0054B4] z-2 relative h-fit">
        <img
          src="/assets/images/portafolio/hosting/biociencia/fondo3.webp"
          alt=""
          className="absolute z-[0] bg-white object-bottom h-full  w-full top-0 bg-top"
        />
        <div className="relative pt-16 md:pt-24 2xl:pt-24 w-full h-fit px-5">
          <div className="flex flex-col gap-2 lg:gap-6 lg:flex-row max-w-5xl mx-auto">
            <p className="text-white text-center text-base md:text-2xl lg:text-3xl font-bold">
              CAPACITACIÓN Y CREACIÓN DE CORREOS CORPORATIVOS
            </p>
            <p className="text-white text-center text-base md:text-2xl lg:text-3xl font-bold">
              CAPACITACIONES GRABADAS
            </p>
          </div>
          <div className="w-full mt-24 max-w-5xl mx-auto  pb-4 lg:pb-6">
            <p className="text-white text-center text-2xl lg:text-4xl font-bold mb-8">
              TE GUIAMOS EN CADA PASO
            </p>
            <div className="flex flex-col items-center lg:flex-row gap-4 justify-center mb-8">
              <span className="w-fit flex items-center  text-2xl lg:text-4xl text-center text-white font-bold bg-[#0076BF] rounded-2xl px-4 py-1">
                PROCESO REGISTRADO
              </span>
              <span className="w-fit flex items-center text-2xl lg:text-4xl text-center text-white font-bold bg-[#0076BF] rounded-2xl px-4 py-1">
                CAPACITACIONES
              </span>
            </div>
            <img
              src="/assets/images/portafolio/hosting/biociencia/sistema.webp"
              alt=""
            />
          </div>
        </div>
      </section>
      <section className="w-full bg-white relative px-5 md:px-16 lg:px-20 py-10 md:py-20 bg-[url(/assets/images/portafolio/hosting/biociencia/fondo_verde.webp)]">
        <div className="flex w-full flex-col gap-8 xl:flex-row max-w-6xl mx-auto">
          <div className="w-full xl:w-1/2">
            <h5 className="text-3xl lg:text-5xl text-white font-bold mb-4">
              CON UN HOSTING Y DOMINIO PODRÁS ALMACENAR:{' '}
            </h5>
            <ul className="text-xl md:text-2xl text-white list-disc pl-12">
              <li>PÁGINAS WEB</li>
              <li>CORREOS CORPORATIVOS</li>
              <li>Y MÁS</li>
            </ul>
            <div className="flex flex-col gap-4 mt-6">
              <span className="flex text-blue-600 items-center px-4 py-2 max-w-[500px] w-full text-base lg:text-xl gap-2 rounded-full bg-[#E4E6E7]">
                <GoSearch />{' '}
                <a
                  href="https://www.biocienciasac.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  www.biocienciasac.com
                </a>
              </span>
              <span className="flex text-blue-600 items-center px-4 py-2 max-w-[500px] w-full text-base lg:text-xl gap-2 rounded-full bg-[#E4E6E7]">
                <GoSearch />{' '}
                <a
                  href="https://biosciencemetrologiasac.com/"
                  target="_blank"
                  rel="noreferrer"
                >
                  www.biosciencemetrologiasac.com
                </a>
              </span>
            </div>
          </div>
          <div className="w-full xl:w-1/2">
            <img
              src="/assets/images/portafolio/hosting/biociencia/grafico2.webp"
              alt=""
              className="w-[550px] block mx-auto"
            />
          </div>
        </div>
      </section>
      <div className="w-full h-[140px]  lg:h-[300px] flex flex-col justify-center items-center text-gray-300 relative cursor-pointer degraded_main z-1">
        <Link
          href="/portafolio/desarrollo_web/agua_kungu"
          className="absolute left-0 lg:left-4 h-fit top-0 bottom-0 my-auto text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer z-[1]"
        >
          <FaCaretLeft className="text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer" />
        </Link>
        <img
          src="/assets/images/portafolio/hosting/biociencia/foot.webp"
          alt=""
          className="w-full h-full object-cover object-center absolute inset-0 z-0"
        />
        <span className="text-lg lg:text-[4vh] leading-6 lg:leading-[3rem] relative z-1">
          SIGUIENTE
        </span>
        <span className="text-lg lg:text-[4.5vh] font_Archivo_bold z-1 relative leading-6 lg:leading-[3rem]">
          MST PROYECTOS E INVERSIONES S.A.C.
        </span>
        <Link
          href="/portafolio/hosting/mst_proyectos"
          className="absolute right-0 lg:right-4 rotate-180 h-fit top-0 bottom-0 my-auto text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer"
        >
          <FaCaretLeft className="text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer" />
        </Link>
      </div>
      <Footer />
    </>
  )
}
