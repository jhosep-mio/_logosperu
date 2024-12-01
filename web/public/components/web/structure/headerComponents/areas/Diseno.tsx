import Link from 'next/link'
import React from 'react'
import { FaCartShopping, FaHeart, FaXmark } from 'react-icons/fa6'
import { FaChevronLeft } from 'react-icons/fa'
export const Diseno = ({ setShowMenu, setAreaActiva, areaActiva } : {setShowMenu: any, setAreaActiva: any, areaActiva: string}) => {
  return (
    <div className={`absolute w-full h-full top-0 ${areaActiva === 'diseno' ? 'left-0' : 'left-full'} flex flex-col items-center justify-center overflow-hidden transition-all ease-out duration-500`}>
      <button
        type="button"
        onClick={() => {
          setAreaActiva('central')
        }}
        className="text-gris/50 absolute top-8 left-4 md:left-8 text-3xl md:text-4xl lg:text-5xl"
      >
        <FaChevronLeft />
      </button>
      <button
        type="button"
        onClick={() => {
          setShowMenu(false)
        }}
        className="text-gris/50 absolute top-8 right-4 md:right-8 text-3xl md:text-4xl lg:text-5xl"
      >
        <FaXmark />
      </button>
      <div className="flex flex-col h-fit">
        <h2 className="text-main font-extrabold text-2xl sm:text-3xl md:text-4xl text-center mb-8 font_Montserrat">
          DISEÑO GRÁFICO
        </h2>
        <nav>
          <ul className="flex flex-col items-center text-gris text-lg sm:text-xl md:text-2xl gap-2 sm:gap-3 font-light">
            <li className="transition-all hover:text-secondary text-secondary">
              <Link href={'/diseno_grafico/diseno_de_logotipo'}>Diseño de logotipo</Link>
            </li>
            <li className="transition-all hover:text-secondary ">
              <Link href={'/diseno_grafico/diseno_de_brochure'}>Diseño de brochure</Link>
            </li>
            <li className="transition-all hover:text-secondary ">
              <Link href={'/diseno_grafico/identidad_corporativa'}>Identidad corporativa</Link>
            </li>
            <li className="transition-all hover:text-secondary ">
              <Link href={'/diseno_grafico/manual_de_marca'}>Manual de marca</Link>
            </li>
            <li className="transition-all hover:text-secondary ">
              <Link href={'/diseno_grafico/diseno_de_flyer'}>Diseño de flyer</Link>
            </li>
            <li className="transition-all hover:text-secondary ">
              <Link href={'/diseno_grafico/diseno_de_personaje'}>Diseño de personaje</Link>
            </li>
            <li className="transition-all mt-6 bg-main rounded-full px-12 md:px-16 lg:px-24 py-2 text-black font-bold uppercase">
              <Link
                href={'/portafolio'}
                rel="noreferrer"
              >
                PORTAFOLIO
              </Link>
            </li>
            <li className="transition-all hover:text-secondary text-lg md:text-xl underline ">
              <Link href={'/terminologia'}>Terminología</Link>
            </li>
          </ul>
          <div className="flex items-center justify-center gap-4 mt-8">
            <button
              type="button"
              className="bg-main rounded-full py-2 flex items-center justify-center w-[50px] h-[50px] md:w-[60px] md:h-[60px] text-nigga text-xl md:text-2xl"
            >
              <FaHeart />
            </button>
            <button
              type="button"
              className="bg-main rounded-full py-2 flex items-center justify-center w-[50px] h-[50px] md:w-[60px] md:h-[60px] text-nigga text-xl md:text-2xl"
            >
              <FaCartShopping />
            </button>
          </div>
        </nav>
      </div>
    </div>
  )
}
