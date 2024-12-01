import Link from 'next/link'
import React from 'react'
import { FaCartShopping, FaHeart, FaXmark } from 'react-icons/fa6'
import { FaChevronLeft } from 'react-icons/fa'
export const Desarrollo = ({ setShowMenu, setAreaActiva, areaActiva } : {setShowMenu: any, setAreaActiva: any, areaActiva: string}) => {
  return (
    <div className={`absolute w-full h-full top-0 ${areaActiva === 'desarrollo' ? 'left-0' : 'left-full'} flex flex-col items-center justify-center overflow-hidden transition-all ease-out duration-500`}>
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
          DESARROLLO WEB
        </h2>
        <nav>
          <ul className="flex flex-col items-center text-gris text-lg sm:text-xl md:text-2xl gap-2 sm:gap-3 font-light ">
            <li className="transition-all hover:text-secondary text-secondary">
              <Link href={'/desarrollo_web/web_informativa'}>Web Informativa</Link>
            </li>
            <li className="transition-all hover:text-secondary ">
              <Link href={'/desarrollo_web/web_administrable'}>Web Administrable</Link>
            </li>
            <li className="transition-all hover:text-secondary ">
              <Link href={'/desarrollo_web/landingpage'}>Landingpage</Link>
            </li>
            <li className="transition-all hover:text-secondary ">
              <Link href={'/desarrollo_web/tienda_virtual'}>Tienda virtual</Link>
            </li>
            <li className="transition-all hover:text-secondary ">
              <Link href={'/desarrollo_web/sistema_web'}>Sistemas web</Link>
            </li>
            <li className="transition-all hover:text-secondary ">
              <Link href={'/seo'}>SEO</Link>
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
