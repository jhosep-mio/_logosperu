'use client'
import Link from 'next/link'
import React, { useState } from 'react'
import { FaCartShopping, FaHeart, FaXmark } from 'react-icons/fa6'
import { motion, AnimatePresence } from 'framer-motion'
import { GoChevronRight } from 'react-icons/go'
import { Desarrollo } from './areas/Desarrollo'
import { Diseno } from './areas/Diseno'
export const Menu = ({
  menu,
  setShowMenu,
  setOpen
}: {
  menu: any;
  setShowMenu: any;
  setOpen: any;
}) => {
  const [areaActiva, setAreaActiva] = useState<string>('central')
  return (
    <AnimatePresence>
      {menu && (
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowMenu(false)}
          exit={{ opacity: 0 }}
          className={` ${menu ? 'opacity-100 ' : 'hidden -z-[999]'} 
        h-screen bg-black/50 fixed w-full lg:w-screen top-0 left-0 transition-all ease-out`}
        >
          <div className="w-full flex flex-col">
            <div
              onClick={(e) => e.stopPropagation()}
              className={`${
                menu ? 'translate-x-0' : 'translate-x-full'
              } px-4 lg:px-16 py-4 lg:py-12 absolute right-0 bg-nigga h-full min-w-full lg:min-w-[550px] flex items-center justify-center transition-all overflow-hidden ease-out delay-100`}
            >
              <div
                className={`absolute w-full h-full top-0 ${
                  areaActiva === 'central' ? 'left-0' : '-left-full'
                } flex flex-col items-center justify-center transition-all ease-out duration-500`}
              >
                <button
                  type="button"
                  onClick={() => {
                    setShowMenu(false)
                  }}
                  className="text-gris/50 absolute top-8 right-4 md:right-8 text-2xl sm:text-3xl md:text-4xl"
                >
                  <FaXmark />
                </button>
                <div className="flex flex-col h-fit">
                  <h2 className="text-main font-extrabold text-2xl sm:text-3xl md:text-4xl text-center mb-8 font_Montserrat">
                    SERVICIOS
                  </h2>
                  <nav>
                    <ul className="flex flex-col items-center text-gris text-lg sm:text-xl md:text-2xl gap-2 sm:gap-3 font-light">
                      <li className="transition-all hover:text-secondary text-secondary flex items-center ">
                        <Link className="" href={'/nosotros'} type="button">
                          Nosotros
                        </Link>
                      </li>
                      <li className="transition-all hover:text-secondary  flex items-center ">
                        <Link className="" href={'/newsletter'} type="button">
                          Boletín
                        </Link>
                      </li>
                      <li className="transition-all hover:text-secondary flex items-center ">
                        <button
                          className=""
                          type="button"
                          onClick={() => {
                            setAreaActiva('diseno')
                          }}
                        >
                          Diseño Gráfico{' '}
                        </button>
                        <GoChevronRight
                          className="text-3xl text-main cursor-pointer"
                          onClick={() => {
                            setAreaActiva('diseno')
                          }}
                        />

                      </li>
                      <li className="transition-all hover:text-secondary flex items-center">
                        <button
                          type="button"
                          onClick={() => {
                            setAreaActiva('desarrollo')
                          }}
                        >
                          Desarrollo web
                        </button>
                        <GoChevronRight
                          className="text-3xl text-main cursor-pointer"
                          onClick={() => {
                            setAreaActiva('desarrollo')
                          }}
                        />
                      </li>
                      <li className="transition-all hover:text-secondary ">
                        <Link href={'/community_manager'}>
                          Community Manager
                        </Link>
                      </li>
                      <li className="transition-all hover:text-secondary ">
                        <Link href={'/hosting'}>Hosting</Link>
                      </li>
                      <li className="transition-all hover:text-secondary flex items-center">
                        <Link href={'/capacitaciones'}>Capacitaciones</Link>
                      </li>
                      <li
                        onClick={() => setOpen(true)}
                        className="transition-all mt-6 cursor-pointer bg-main rounded-full px-12 md:px-16 lg:px-24 py-2 text-black font-bold uppercase"
                      >
                        <span rel="noreferrer" className="">
                          Intranet
                        </span>
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
                      <Link
                        href={'/checkout'}
                        className="bg-main rounded-full py-2 flex items-center justify-center w-[50px] h-[50px] md:w-[60px] md:h-[60px] text-nigga text-xl md:text-2xl"
                      >
                        <FaCartShopping />
                      </Link>
                    </div>
                  </nav>
                </div>
              </div>

              <Desarrollo
                setShowMenu={setShowMenu}
                setAreaActiva={setAreaActiva}
                areaActiva={areaActiva}
              />
              <Diseno areaActiva={areaActiva} setAreaActiva={setAreaActiva} setShowMenu={setShowMenu}/>
            </div>
          </div>
        </motion.section>
      )}
    </AnimatePresence>
  )
}
