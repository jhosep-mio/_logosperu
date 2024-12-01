'use client'
/* eslint-disable @next/next/no-img-element */
import {
  MdOutlineComputer,
  MdDesignServices,
  MdOutlinePhoneIphone,
  MdStorage,
  MdOutlinePeopleOutline
} from 'react-icons/md'
import Link from 'next/link'
import React, { useState } from 'react'

export const Servicios = () => {
  const [areaActiva, setAreaActiva] = useState('diseno')

  return (
    <div className=" mx-auto flex flex-col gap-12 text-white text-lg font-ligth  border-t-2 border-gray-100/20 mt-8 py-4 lg:py-8">
      <div className="w-full">
        <ul
          className={
            'w-full lg:min-w-[300px] flex flex-col xl:flex-row justify-center text-lg gap-0 lg:gap-[16px] text-white font-medium relative z-10 '
          }
        >
          <li
            onClick={() => {
              setAreaActiva('diseno')
            }}
            className={`flex cursor-pointer items-center group gap-2 rounded-xl px-3 py-2  ${
              areaActiva === 'diseno'
                ? ' text-azul_serio xl:hover:text-azul_serio bg-main '
                : 'xl:hover:text-main '
            } transition-all`}
          >
            <span
              className={`block p-1 rounded-lg bg-transparent  group-xl:hover:text-main transition-all ${
                areaActiva === 'diseno' ? 'text-azul_serio' : 'text-white'
              } text-xl`}
            >
              <MdDesignServices />
            </span>
            Diseño Gráfico
          </li>
          <li
            onClick={() => {
              setAreaActiva('community')
            }}
            className={`flex cursor-pointer items-center  gap-2 rounded-xl px-3 py-2 group  ${
              areaActiva === 'community'
                ? ' text-azul_serio xlhover:text-azul_serio bg-main'
                : 'xl:hover:text-main'
            } transition-all`}
          >
            <span
              className={`block p-1 rounded-lg bg-transparent  group-xl:hover:text-main transition-all ${
                areaActiva === 'community' ? 'text-azul_serio' : 'text-white'
              } text-xl`}
            >
              <MdOutlinePhoneIphone />
            </span>
            Community Manager
          </li>
          <li
            onClick={() => {
              setAreaActiva('desarrollo')
            }}
            className={`flex cursor-pointer items-center  gap-2 rounded-xl px-3 py-2 group  ${
              areaActiva === 'desarrollo'
                ? ' text-azul_serio xl:hover:text-azul_serio bg-main'
                : 'xl:hover:text-main'
            } transition-all`}
          >
            <span
              className={`block p-1 rounded-lg bg-transparent  group-xl:hover:text-main transition-all ${
                areaActiva === 'desarrollo' ? 'text-azul_serio' : 'text-white'
              } text-xl`}
            >
              <MdOutlineComputer />
            </span>
            Desarrollo web
          </li>
          <li
            onClick={() => {
              setAreaActiva('hosting')
            }}
            className={`flex cursor-pointer items-center  gap-2 rounded-xl px-3 py-2 group  ${
              areaActiva === 'hosting'
                ? ' text-azul_serio xl:hover:text-azul_serio bg-main'
                : 'xl:hover:text-main'
            } transition-all`}
          >
            <span
              className={`block p-1 rounded-lg bg-transparent  group-xl:hover:text-main transition-all ${
                areaActiva === 'hosting' ? 'text-azul_serio' : 'text-white'
              } text-xl`}
            >
              <MdStorage />
            </span>
            Hosting y dominio
          </li>
          <li
            onClick={() => {
              setAreaActiva('capacitaciones')
            }}
            className={`flex cursor-pointer items-center  gap-2 rounded-xl px-3 py-2 group  ${
              areaActiva === 'capacitaciones'
                ? ' text-azul_serio xl:hover:text-azul_serio bg-main'
                : 'xl:hover:text-main'
            } transition-all`}
          >
            <span
              className={`block p-1 rounded-lg bg-transparent  group-xl:hover:text-main transition-all ${
                areaActiva === 'capacitaciones'
                  ? 'text-azul_serio'
                  : 'text-white'
              } text-xl`}
            >
              <MdOutlinePeopleOutline />
            </span>
            Capacitaciones
          </li>
        </ul>
      </div>

      <div className="relative">
        <section
          className={`w-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-3 bg-transparent lg:pb-[30px] transition-all duration-500 ${
            areaActiva === 'diseno'
              ? 'relative z-50 opacity-100 scale-100'
              : 'absolute -z-50 opacity-0 scale-0'
          }`}
        >
          <Link
            href="/portafolio/diseno_grafico/plaza_san_antonio"
            className="w-full h-[300px] md:h-[500px]"
          >
            <img
              src="/assets/images/portafolio/grafico.webp"
              alt="Logos Perú"
              className="block w-full object-cover h-full"
              width={380}
            />
            <div className="name--portafolio"></div>
            <p className="title--portafolio text-center">PLAZA SAN ANTONIO</p>
          </Link>
          <Link
            href="/portafolio/diseno_grafico/moralitos"
            className="w-full h-[300px] md:h-[500px]"
          >
            <img
              src="/assets/images/portafolio/moralitos/recurso1.webp"
              alt="Logos Perú"
              className="block w-full object-cover h-full object-center"
              width={380}
            />
            <div className="name--portafolio"></div>
            <p className="title--portafolio">MORALITOS</p>
          </Link>
          <Link
            href="/portafolio/diseno_grafico/awasu"
            className="w-full h-[300px] md:h-[500px]"
          >
            <img
              src="/assets/images/portafolio/awasu/carta.webp"
              alt="Logos Perú"
              className="block w-full object-cover h-full"
              width={380}
            />
            <div className="name--portafolio"></div>
            <p className="title--portafolio">AWASU</p>
          </Link>
          <Link
            href="/portafolio/diseno_grafico/jackos_bar"
            className="w-full h-[500px] 2xl:col-span-3"
          >
            <img
              src="/assets/images/portafolio/jackos_bar/mockup1.webp"
              alt="Logos Perú"
              className="block w-full object-cover h-full"
              width={380}
            />
            <div className="name--portafolio"></div>
            <p className="title--portafolio">JACKO{"'"}S BAR</p>
          </Link>
        </section>

        <section
          className={`w-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-3 bg-transparent lg:pb-[30px] transition-all duration-500 ${
            areaActiva === 'desarrollo'
              ? ' relative z-50 opacity-100 scale-100'
              : 'absolute -z-50 opacity-0 scale-0'
          }`}
        >
          <Link href="/portafolio/desarrollo_web/padre_eterno" className="">
            <img
              src="/assets/images/portafolio/desarrollo_web/padre_eterno/fondo.webp"
              alt="Logos Perú"
              className="block w-full object-cover h-full"
              width={380}
            />
            <div className="name--portafolio"></div>
            <p className="title--portafolio">PADRE ETERNO</p>
          </Link>
          <Link href="/portafolio/desarrollo_web/medicina_academica" className="bg-white">
            <img
              src="/assets/images/portafolio/desarrollo_web/medicina_academica/mockup1.webp"
              alt="Logos Perú"
              className="block w-full object-cover h-full"
              width={380}
            />
            <div className="name--portafolio"></div>
            <p className="title--portafolio">PADRE ETERNO</p>
          </Link>
          <Link href="portafolio/desarrollo_web/fisiofast" className="bg-white">
            <img
              src="/assets/images/portafolio/desarrollo_web/fisiofast/mockup1.webp"
              alt="Logos Perú"
              className="block w-full object-cover h-full"
              width={380}
            />
            <div className="name--portafolio"></div>
            <p className="title--portafolio">PADRE ETERNO</p>
          </Link>

          <Link href="portafolio/desarrollo_web/rda" className="w-full h-[500px] 2xl:col-span-3 bg-white">
            <img
              src="/assets/images/portafolio/desarrollo_web/rda/mockup1.webp"
              alt="Logos Perú"
              className="block w-full object-cover h-full"
              width={380}
            />
            <div className="name--portafolio"></div>
            <p className="title--portafolio">PADRE ETERNO</p>
          </Link>
        </section>

        <section
          className={`w-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-3 bg-transparent lg:pb-[30px] transition-all duration-500 ${
            areaActiva === 'community'
              ? ' relative z-50 opacity-100 scale-100'
              : 'absolute -z-50 opacity-0 scale-0'
          }`}
        >
          <Link href="/portafolio/community_manager/sisitravels" className="">
            <img
              src="/assets/images/portafolio/community_manager/sisitravels/recurso2.webp"
              alt="Logos Perú"
              className="block w-full object-cover h-full"
              width={380}
            />
            <div className="name--portafolio"></div>
            <p className="title--portafolio">SISTRAVELS</p>
          </Link>
          <Link
            href="/portafolio/community_manager/disa_ingenieros"
            className="w-full h-[300px] md:h-[500px]"
          >
            <img
              src="/assets/images/portafolio/community_manager/disa_ingenieros/slide1.webp"
              alt="Logos Perú"
              className="block w-full object-cover h-full object-center"
              width={380}
            />
            <div className="name--portafolio"></div>
            <p className="title--portafolio">DISA INGENIEROS</p>
          </Link>
          <Link
            href="/portafolio/community_manager/acabados_zendy"
            className="w-full h-[300px] md:h-[500px]"
          >
            <img
              src="/assets/images/portafolio/community_manager/acabados_zendy/slide2.webp"
              alt="Logos Perú"
              className="block w-full object-cover h-full"
              width={380}
            />
            <div className="name--portafolio"></div>
            <p className="title--portafolio">AWASU</p>
          </Link>
          <Link
            href="/portafolio/community_manager/new_fest"
            className="w-full h-[500px] 2xl:col-span-3"
          >
            <img
              src="/assets/images/portafolio/community_manager/new_fest/recurso2.webp"
              alt="Logos Perú"
              className="block w-full object-cover h-full"
              width={380}
            />
            <div className="name--portafolio"></div>
            <p className="title--portafolio">JACKO{"'"}S BAR</p>
          </Link>
        </section>

        <section
          className={`w-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-3 bg-transparent lg:pb-[30px] transition-all duration-500 ${
            areaActiva === 'capacitaciones'
              ? ' relative z-50 opacity-100 scale-100'
              : 'absolute -z-50 opacity-0 scale-0'
          }`}
        >
          <Link href="/portafolio/capacitaciones/corporacion_empaques" className="">
            <img
              src="/assets/images/portafolio/capacitaciones/corporacion_empaques/fondo4.webp"
              alt="Logos Perú"
              className="block w-full object-cover h-full bg-white"
              width={380}
            />
            <div className="name--portafolio"></div>
            <p className="title--portafolio">CORPORACION DE EMPAQUES</p>
          </Link>
          <Link
            href="/portafolio/capacitaciones/lordcru"
            className="w-full h-[300px] md:h-[500px]"
          >
            <img
              src="/assets/images/portafolio/capacitaciones/lordcru/fondo4.webp"
              alt="Logos Perú"
              className="block w-full object-cover h-full object-center bg-white"
              width={380}
            />
            <div className="name--portafolio"></div>
            <p className="title--portafolio">LORDCRU</p>
          </Link>
          <Link
            href="/portafolio/capacitaciones/covercom_block"
            className="w-full h-[300px] md:h-[500px]"
          >
            <img
              src="/assets/images/portafolio/capacitaciones/covercom_block/fondo4.webp"
              alt="Logos Perú"
              className="block w-full object-cover h-full bg-white"
              width={380}
            />
            <div className="name--portafolio"></div>
            <p className="title--portafolio">COVERCOM</p>
          </Link>
          <Link
            href="/portafolio/capacitaciones/centro_medico_oftalmologico"
            className="w-full h-[500px] 2xl:col-span-3"
          >
            <img
              src="/assets/images/portafolio/capacitaciones/centro_medico_oftalmologico/fondo4.webp"
              alt="Logos Perú"
              className="block w-full object-cover h-full"
              width={380}
            />
            <div className="name--portafolio"></div>
            <p className="title--portafolio">JACKO{"'"}S BAR</p>
          </Link>
        </section>

        <section
          className={`w-full grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-3 bg-transparent lg:pb-[30px] transition-all duration-500 ${
            areaActiva === 'hosting'
              ? ' relative z-50 opacity-100 scale-100'
              : 'absolute -z-50 opacity-0 scale-0'
          }`}
        >
          <Link href="/portafolio/hosting/biociencia" className="">
            <img
              src="/assets/images/portafolio/hosting/biociencia/fondo_verde.webp"
              alt="Logos Perú"
              className="block w-full object-cover h-full bg-white"
              width={380}
            />
            <div className="name--portafolio"></div>
            <p className="title--portafolio">BIOCIENCIA</p>
          </Link>
          <Link
            href="/portafolio/hosting/mst_proyectos"
            className="w-full h-[300px] md:h-[500px]"
          >
            <img
              src="/assets/images/portafolio/hosting/mst_proyectos/banner.webp"
              alt="Logos Perú"
              className="block w-full object-cover h-full object-center bg-white"
              width={380}
            />
            <div className="name--portafolio"></div>
            <p className="title--portafolio">MST PROYECTOS</p>
          </Link>
          <Link
            href="/portafolio/hosting/rda"
            className="w-full h-[300px] md:h-[500px]"
          >
            <img
              src="assets/images/portafolio/hosting/rda/banner.webp"
              alt="Logos Perú"
              className="block w-full object-cover h-full bg-white"
              width={380}
            />
            <div className="name--portafolio"></div>
            <p className="title--portafolio">RDA</p>
          </Link>

        </section>
      </div>
    </div>
  )
}
