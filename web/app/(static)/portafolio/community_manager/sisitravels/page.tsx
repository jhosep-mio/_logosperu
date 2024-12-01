/* eslint-disable @next/next/no-img-element */
import { generateMetadata } from '@/public/components/seo/SeoList'
import { Header } from '@/public/components/web/structure/Header'
import Link from 'next/link'
import { AiOutlineCaretRight } from 'react-icons/ai'
import {
  FaCaretLeft,
  FaFacebookF,
  FaInstagram,
  FaTiktok
} from 'react-icons/fa6'
import { ImageLogo } from './animate/ImageLogo'
import { Subtitle } from './animate/Subtitle'
import { ImageMarca } from './animate/ImageMarca'
import { TextoMarca } from './animate/TextoMarca'
import { Redes } from './animate/Redes'
import { Regresar } from '@/public/components/web/portafolio/general/Regresar'
import { Gatito } from '../../desarrollo_web/medicina_academica/animate/Gatito'
import { ButtonPlanes } from '../../@componentes/ButtonPlanes'
export const metadata = generateMetadata()

export default function Sisitravels () {
  return (
    <section className="relative z-10  bannerMain degraded_main font_Archivo">
      <Header />
      <Regresar />
      <div className="h-auto w-full relative">
        <img
          src="/assets/images/portafolio/community_manager/sisitravels/fondo.webp"
          alt=""
          className="absolute inset-0 w-full h-full object-right lg:object-center object-cover z-[-1]"
        />
        <div className="pt-[9vh] relative overflow-hidden lg:pt-[10vh] lg:h-fit p-4 lg:pb-0 lg:px-20 xl:px-28 2xl:px-36 ">
          <div className="w-full flex justify-center text-[#001D3F] ">
            <div className="flex gap-2 items-center text-[#001D3F]">
              <span className="uppercase font-bold text-xl hidden lg:block lg:text-[3vh] text-[#001D3F] text_shadow">
                CLIENTE
              </span>
              <AiOutlineCaretRight className="text-4xl hidden lg:block text-[#001D3F]" />
              <h1 className="uppercase text_shadow font-bold text-[#001D3F] mt-4 lg:mt-0 flex gap-1 lg:gap-0 lg:flex-col text-lg lg:text-[3vh] leading-7 text-center">
                SISITRAVELS
              </h1>
            </div>
          </div>
            <Gatito/>

          {/* LOGO */}
          <div className="w-full py-[3vh] lg:py-[6vh]">
            <ImageLogo image="community_manager/sisitravels/logo.webp" />
          </div>
          <Subtitle texto="EXPERIENCIA EN VUELO" />
        </div>
      </div>

      <div className="w-full lg:h-fit xl:h-auto relative bg-[#E1FFF3] overflow-hidden ">
        <ImageMarca />
        <img
          src="/assets/images/portafolio/community_manager/sisitravels/fondo5.webp"
          alt=""
          className="absolute top-full w-full h-auto  mt-[-15%]"
        />
        <div className="w-full h-full relative">
          <TextoMarca />
          <div className="w-full h-auto relative lg:py-10 xl:py-24 px-4 flex-col lg:flex-row lg:px-10 flex gap-10 max-w-[2000px] mx-auto">
            <section className="w-full flex xl:hidden items-center justify-center relative h-[520px] lg:h-[730px] bg-no-repeat bg-cover bg-right">
              <div className="absolute top-0 bottom-0 m-auto left-0 right-0 ml-[55px] md:ml-auto w-[301px] lg:w-[370px]  z-[10] h-[500px] lg:h-[700px] bg-[url(/assets/images/portafolio/desarrollo_web/padre_eterno/celular.webp)] bg-no-repeat bg-contain">
                <div className="w-full h-full z-[9] absolute inset-0 overflow-hidden rounded-[50px]">
                  <div className="w-[97%] h-[97%] rounded-[50px]">
                    <div className="rounded-[50px] absolute left-0 top-0 w-full h-full pt-[39px] lg:pt-[55px] pl-[13.1px] lg:pl-[19px] pr-[66px] lg:pr-[41px] pb-[10px] lg:pb-[18px]">
                      <div className="w-full h-full rounded-bl-[29px] rounded-br-[29px] lg:rounded-bl-[34px] lg:rounded-br-[34px] overflow-auto scroll_black">
                        <img
                          src="/assets/images/portafolio/community_manager/sisitravels/celular.webp"
                          alt="Screen Capture"
                          className="w-full object-cover "
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            <div className="flex flex-col justify-center w-full xl:w-[60%]">
              <img
                src="/assets/images/portafolio/community_manager/sisitravels/recurso2.webp"
                alt=""
                className="w-full object-contain "
              />
              <div className="flex flex-wrap xl:flex-nowrap flex-row w-full justify-between gap-x-0 gap-y-3 xl:gap-10 mt-10">
                <Link
                  href="https://www.facebook.com/sisitravels1"
                  className="w-[49%] xl:w-full flex bg-main py-2 lg:py-4 rounded-2xl items-center justify-center font_Archivo_bold gap-2 lg:gap-4 group hover:bg-[#00B75F] transition-colors hover:text-white"
                >
                  <FaFacebookF className="text-3xl lg:text-5xl  cursor-pointer text-white p-2 rounded-full bg-[#001D3F] group-hover:bg-white group-hover:text-[#00B75F]  transition-colors" />
                  FACEBOOK
                </Link>
                <Link
                  href="https://www.instagram.com/sisitravels_/"
                  className=" w-[49%] xl:w-full  flex bg-main py-2 lg:py-4 rounded-2xl items-center justify-center font_Archivo_bold gap-2 lg:gap-4 group hover:bg-[#00B75F] transition-colors hover:text-white"
                >
                  <FaInstagram className="text-3xl lg:text-5xl  cursor-pointer text-white p-2 rounded-full bg-[#001D3F] group-hover:bg-white group-hover:text-[#00B75F]  transition-colors" />
                  INSTAGRAM
                </Link>
                <Link
                  href="https://www.tiktok.com/@sisitravelsperu"
                  className="w-full flex bg-main py-2 lg:py-4 rounded-2xl items-center justify-center font_Archivo_bold gap-2 lg:gap-4 group hover:bg-[#00B75F] transition-colors hover:text-white"
                >
                  <FaTiktok className="text-3xl lg:text-5xl  cursor-pointer text-white p-2 rounded-full bg-[#001D3F] group-hover:bg-white group-hover:text-[#00B75F]  transition-colors" />
                  TIKTOK
                </Link>
              </div>
            </div>
            <Redes />
          </div>
        </div>
      </div>
      <div className="w-full relative z-2">
        <img
          src="/assets/images/portafolio/community_manager/sisitravels/fondo3.webp"
          alt=""
          className="h-[600px] lg:h-auto inset-0 top-0 w-full z-[0]"
        />
        <div className="w-full flex flex-col justify-center lg:flex-row items-center gap-3 lg:gap-10 px-4 lg:px-10 z-1  max-w-[2000px] mx-auto absolute inset-0 top-0  z-[0]">
          <img
            src="/assets/images/portafolio/community_manager/sisitravels/recurso3.webp"
            alt=""
            className="w-full lg:w-[55%] xl:w-[70%] object-contain"
          />
          <div className="h-fit lg:h-full w-full xl:w-[30%] flex flex-col items-center justify-center text-[#001D3F] font_Archivo_bold gap-3 lg:gap-5 xl:gap-10 text-center text-base text-[1.25rem] xl:text-[1.5rem]">
            <p className="">
              SISITRAVELS VISUALIZA EL PROCESO DE LOS POST EN NUESTRO SISTEMA
              DESARROLLADO PARA ELLOS.
            </p>
            <p>PROCESOS COMO:</p>
            <p className="bg-main px-4 py-3 rounded-xl text-white">
              DESARROLLO DE CONTENIDO
            </p>
            <p className="bg-[#001D3F] px-4 py-3 rounded-xl text-white">
              DESARROLLO DE FLYERS Y COPY
            </p>
          </div>
        </div>
      </div>
      <div className="w-full relative z-2 mt-[-30%] lg:mt-[-10%]">
        <img
          src="/assets/images/portafolio/community_manager/sisitravels/fondo4.webp"
          alt=""
          className="w-full h-[500px] md:h-[700px] "
        />
        <div className="w-full md:h-[500px] flex flex-col lg:flex-row items-center gap-10 px-10 z-1 2xl:mb-[0%] left-0 right-0 absolute bottom-0 lg:bottom-[8%] my-auto z-[0] max-w-[2000px] mx-auto">
          <div className="hidden h-full w-full lg:w-[52%] xl:flex flex-col items-center justify-center text-white font_Archivo_bold gap-10 text-center text-base lg:text-[1.7rem] 2xl:text-[3.5rem] lg:leading-[4rem]">
            <p className="">
              ¿NO TIENES REDES SOCIALES? <br />
              LAS CREAMOS NOSOTROS
            </p>
          </div>

          <div className="relative xl:absolute mx-auto right-0 left-0 w-[340px] md:w-[600px] ml-auto mr-auto lg:ml-auto xl:mr-[0%] 2xl:mr-[10%]  h-[340px] md:h-[500px]  bg-[url(/assets/images/portafolio/desarrollo_web/padre_eterno/pc.webp)] bg-contain bg-no-repeat">
            <div className="w-full h-full z-[9] absolute inset-0 overflow-hidden rounded-[50px]">
              <div className="w-full lg:w-[97%] h-full lg:h-[97%] rounded-[50px]">
                <div
                  className="rounded-[50px] absolute left-0 top-0 w-full h-full pl-[22px] md:pl-[37px] pt-[16px] md:pt-[30px] pr-[22px] md:pr-[65px] pb-[154px] md:pb-[188px]
                "
                >
                  <div className="w-full h-full  overflow-auto ">
                    <img
                      src="/assets/images/portafolio/community_manager/sisitravels/pc_desplegable.webp"
                      alt="Screen Capture"
                      className="w-full object-cover "
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* </div> */}
          </div>
        </div>
      </div>

      <div className="w-full h-[140px]  lg:h-[300px] flex flex-col justify-center items-center text-gray-300 relative cursor-pointer degraded_main z-1">
        <img
          src="/assets/images/portafolio/community_manager/sisitravels/foot2.webp"
          alt=""
          className="w-full h-full object-cover object-center absolute inset-0 z-0"
        />
        <span className="text-lg lg:text-[4vh] leading-6 lg:leading-[3rem] relative z-1">
          SIGUIENTE
        </span>
        <span className="text-lg lg:text-[6vh] font_Archivo_bold z-1 relative leading-6 lg:leading-[3rem]">
          DISA INGENIEROS
        </span>
        <Link
          href="/portafolio/community_manager/disa_ingenieros"
          className="absolute right-0 lg:right-4 rotate-180 h-fit top-0 bottom-0 my-auto text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer"
        >
          <FaCaretLeft className="text-5xl lg:text-7xl text-white hover:scale-105 transition-all cursor-pointer" />
        </Link>
      </div>
      <ButtonPlanes parametro= 'Community manager'/>

    </section>
  )
}
