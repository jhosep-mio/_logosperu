'use client'
/* eslint-disable @next/next/no-img-element */
import React from 'react'
import {
  FaFacebookF,
  FaInstagram,
  FaWhatsapp,
  FaYoutube
} from 'react-icons/fa6'
import { FormFooter } from './FormFooter'
import Link from 'next/link'
import useAuth from '../../shared/hooks/useAuth'

export const Footer = () => {
  const { setOpenSuscribirse } = useAuth()
  return (
    <>
      <div className=" py-8 px-4 md:px-8 bg-azul_serio">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          {/* Título y llamado a la acción */}
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h2 className="text-2xl font-bold text-main">
              Suscríbete a nuestro Boletín
            </h2>
            <p className="text-gray-300">
              Recibe las últimas novedades y ofertas especiales directamente en
              tu correo.
            </p>
          </div>

          {/* Formulario de suscripción */}
          <div className="flex flex-col md:flex-row items-center space-y-4 md:space-y-0 md:space-x-4">
            <button
              onClick={() => {
                setOpenSuscribirse(true)
              }}
              className="bg-main rounded-full text-azul_serio font-bold px-10 py-2 hover:bg-darKmain transition-colors"
            >
              Suscribirse
            </button>
          </div>
        </div>
      </div>
      <footer className="degraded_main flex flex-col  z-10 justify-center items-center py-6 lg:py-10 relative overflow-hidden">
        <img
          src="/assets/images/footer/gatito_footer.gif"
          alt=""
          className="block absolute -z-10 my-auto top-[80px] lg:top-[inherit] bottom-0 right-0 left-0 h-[40%] lg:h-fit object-cover lg:object-contain w-[100%] opacity-50"
        />
        <div className=" h-full flex flex-col justify-center items-center w-full px-4 lg:py-0 xl:w-[40%]  mx-auto">
          <h2 className="text-white font_Archivo_bold text-[3vh] lg:text-[3.5vh] text-center">
            ÚNETE A NUESTRA LISTA DE CORREOS
          </h2>
          {/* <span className="text-gray-300 text-center text-[1.5vh] mt-4 lg:mt-0">
            Lorem ipsum, dolor sit amet consectetur adipisicing elit consectetur
            adipisicing elit.
          </span> */}
          <FormFooter />
          <span className="w-full h-[2px] my-10 block poligon1 gradiant_footer" />
          <div className="grid grid-cols-3 md:grid-cols-5 w-full justify-center">
            <Link
              href={'/'}
              className="text-gray-400 block text-center text-[1.7vh] uppercase"
            >
              Home
            </Link>
            {/* <span className="text-gray-400 block text-center text-[1.7vh] uppercase">
              Home
            </span> */}
            <Link
              href={'/mixelito'}
              className="text-gray-400 block text-center text-[1.7vh] uppercase"
            >
              Mixelito
            </Link>
            <Link
              href="/nosotros"
              className="text-gray-400 block text-center text-[1.7vh] uppercase"
            >
              Nosotros
            </Link>
            <Link
              href={'/portafolio'}
              className="text-gray-400 block text-center text-[1.7vh] uppercase"
            >
              Portafolio
            </Link>
            <Link
              href={'/terminologia'}
              className="text-gray-400 block text-center text-[1.7vh] uppercase"
            >
              Terminología
            </Link>
          </div>
          <div className="flex justify-center items-center w-full my-4">
            <Link
              href={'https://www.youtube.com/@logosperu476'}
              target="_blank"
              className={
                'flex items-center group justify-center  rounded-full p-2 transition-colors'
              }
            >
              <FaYoutube className="text-[3vh] text-main hover:text-[#FF0000] cursor-pointer transition-colors" />
            </Link>
            <Link
              href={'https://www.instagram.com/dlogosperu/?hl=es'}
              target="_blank"
              className={
                'flex items-center group justify-center rounded-full p-2 transition-colors'
              }
            >
              <FaInstagram className="text-[3vh] text-main hover:text-pink-500 cursor-pointer transition-colors" />
            </Link>
            <Link
              href={'https://www.facebook.com/DLogosPeru/?locale=es_LA'}
              target="_blank"
              className={
                'flex items-center group justify-center  rounded-full p-2 transition-colors'
              }
            >
              <FaFacebookF className="text-[3vh] text-main hover:text-[#1877F2] cursor-pointer transition-colors" />
            </Link>
          </div>
          <div className="w-full py-2  text-gray-400 text-[1.5vh] justify-center items-center">
            <p className="w-fit mx-auto text-center block text-gray-400 text-[1.5vh]">
              © Copyright 2016-2024 - Todos los derechos reservados Design by
              Logos Perú
            </p>
            <p className="w-full text-center">
              Agencia de Diseño Gráfico & Desarrollo Web
            </p>
          </div>
        </div>
      </footer>
      <a
        href="https://wa.me//+51987038024"
        target="_blank"
        className="fixed z-[999] flex  items-center justify-center gap-2 bottom-3 md:bottom-6 right-4 w-[50px] h-[50px] lg:h-fit lg:w-fit md:left-auto md:right-6  bg-[#00853D] text-white font-light px-2 lg:px-6 py-2 rounded-full uppercase transition-all hover:bg-[#00a64d] shadow"
        rel="noreferrer"
      >
        <FaWhatsapp className="text-3xl" />{' '}
        <span className="hidden lg:block"> Chatea con nosotros</span>
      </a>
    </>
  )
}
