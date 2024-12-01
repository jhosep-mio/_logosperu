/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { CgMenuGridR } from 'react-icons/cg'
// import { IoCall } from 'react-icons/io5'
import { FaUserCircle } from 'react-icons/fa'
import { IoSearchSharp } from 'react-icons/io5'

export const HeaderStatic = () => {
  return (
    <>
      <header
        className={
          'fixed left-0 top-0 z-[999] w-full px-2 py-1 transition-all lg:px-16 bg-white border-b-2 border-b-gris'
        }
      >
        <nav className="flex items-center justify-between">
          <div className="flex items-center gap-20">
            <Link href="/" className="h-fit w-fit">
              <img
                src="/assets/images/logos/logo_verde.png"
                alt="Logos Perú"
                className="h-[70px] w-[90px] object-contain md:w-[140px] lg:h-[100px]"
              />
            </Link>
            <div className="relative hidden lg:block">
              <IoSearchSharp className="absolute left-4 bottom-0 top-0 text-2xl text-[#b1aeae] my-auto" />
              <input
                type="text"
                placeholder="Buscar..."
                className="border-2 border-gris rounded-full pl-12 pr-4 py-2 w-[400px] placeholder:text-gris"
              />
            </div>
          </div>

          <div className="flex items-center gap-0">
            <button className="bg-[#2563EB] hidden text-xs xl:text-sm font-bold justify-center text-white py-3 px-6 rounded-full hover:bg-blue-800 lg:flex items-center gap-2 transition duration-300">
              SUSCRIBETE
            </button>
            <div>
              <span
                className={
                  'flex items-center group ml-2 lg:ml-3 cursor-pointer justify-center bg-transparent rounded-full p-0 transition-colors'
                }
              >
                <FaUserCircle className="text-4xl lg:text-5xl lg:p-[2px] text-main cursor-pointer transition-colors" />
              </span>
            </div>
            <button aria-label="Botón para abrir el menú lateral" type="button">
              <CgMenuGridR className=" text-main text-5xl p-[2px] lg:text-6xl" />
            </button>
          </div>
        </nav>
      </header>
    </>
  )
}
