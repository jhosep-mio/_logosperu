'use client'
import React, { useState } from 'react'
import {
  MdOutlineComputer,
  MdDesignServices,
  MdOutlinePhoneIphone,
  MdStorage,
  MdOutlinePeopleOutline
} from 'react-icons/md'
import { ListTerminos2 } from '@/public/components/web/terminologia/ListTerminos2'
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/pagination'
// import required modules
import { Grid, Pagination } from 'swiper/modules'

export const FilterTerminos = () => {
  const [areaActiva, setAreaActiva] = useState('diseno')

  return (
    <>
    <h2 className="text-center text-4xl lg:text-5xl font-bold mb-4 text-azul_serio">TERMINOLOGÍAS</h2>
      <section className="px-4 lg:px-24 xl:px-56">
        <Swiper
          spaceBetween={30}
          pagination={{
            clickable: true
          }}
          breakpoints={{
            0: {
              grid: {
                rows: 2,
                fill: 'row'
              },
              slidesPerView: 1,
              spaceBetween: 10
            },
            768: {
              grid: {
                rows: 2,
                fill: 'row'
              },
              slidesPerView: 2,
              spaceBetween: 10
            },
            992: {
              grid: {
                rows: 2,
                fill: 'row'
              },
              slidesPerView: 3,
              spaceBetween: 10
            },
            1200: {
              grid: {
                rows: 1,
                fill: 'row'
              },
              slidesPerView: 5,
              spaceBetween: 50
            }
          }}
          modules={[Grid, Pagination]}
          className="fondoTerminologia  swp_terminos2 "
        >
          <SwiperSlide className="h-full text-white font-medium">
            <li
              onClick={() => {
                setAreaActiva('diseno')
              }}
              className={` flex cursor-pointer items-center justify-center group gap-2 rounded-xl h-[48px] lg:h-auto px-3 py-2  ${
                areaActiva === 'diseno'
                  ? ' text-azul_serio hover:text-azul_serio bg-main'
                  : 'bg-azul_serio'
              } transition-all`}
            >
              <span
                className={`block p-1 rounded-lg bg-azul_serio  group-hover:text-main transition-all ${
                  areaActiva === 'diseno' ? 'text-main' : 'text-white'
                } text-base lg:text-2xl`}
              >
                <MdDesignServices />
              </span>
              <p className='line-clamp-1'>Diseño Gráfico</p>
            </li>
          </SwiperSlide>
          <SwiperSlide className="h-full text-white font-medium">
            <li
              onClick={() => {
                setAreaActiva('community')
              }}
              className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl h-[48px] lg:h-auto px-3 py-2 group  ${
                areaActiva === 'community'
                  ? ' text-azul_serio hover:text-azul_serio bg-main'
                  : 'bg-azul_serio'
              } transition-all`}
            >
              <span
                className={`block p-1 rounded-lg bg-azul_serio  group-hover:text-main transition-all ${
                  areaActiva === 'community' ? 'text-main' : 'text-white'
                } text-base lg:text-2xl`}
              >
                <MdOutlinePhoneIphone />
              </span>
              <p className='line-clamp-1'>Community Manager</p>
            </li>
          </SwiperSlide>
          <SwiperSlide className="h-full text-white font-medium">
            <li
              onClick={() => {
                setAreaActiva('desarrollo')
              }}
              className={`flex cursor-pointer items-center justify-center  gap-2 rounded-xl h-[48px] lg:h-auto px-3 py-2 group  ${
                areaActiva === 'desarrollo'
                  ? ' text-azul_serio hover:text-azul_serio bg-main'
                  : 'bg-azul_serio'
              } transition-all`}
            >
              <span
                className={`block p-1 rounded-lg bg-azul_serio  group-hover:text-main transition-all ${
                  areaActiva === 'desarrollo' ? 'text-main' : 'text-white'
                } text-base lg:text-2xl`}
              >
                <MdOutlineComputer />
              </span>
              <p className='line-clamp-1'>Desarrollo web</p>
            </li>
          </SwiperSlide>
          <SwiperSlide className="h-full text-white font-medium">
            <li
              onClick={() => {
                setAreaActiva('hosting')
              }}
              className={`flex cursor-pointer items-center justify-center  gap-2 rounded-xl h-[48px] lg:h-auto px-3 py-2 group  ${
                areaActiva === 'hosting'
                  ? ' text-azul_serio hover:text-azul_serio bg-main'
                  : 'bg-azul_serio'
              } transition-all`}
            >
              <span
                className={`block p-1 rounded-lg bg-azul_serio  group-hover:text-main transition-all ${
                  areaActiva === 'hosting' ? 'text-main' : 'text-white'
                } text-2xl`}
              >
                <MdStorage />
              </span>
              <p className='line-clamp-1'>Hosting y dominio</p>
            </li>
          </SwiperSlide>
          <SwiperSlide className="h-full text-white font-medium">
            <li
              onClick={() => {
                setAreaActiva('capacitaciones')
              }}
              className={`flex cursor-pointer items-center justify-center  gap-2 rounded-xl h-[48px] lg:h-auto px-3 py-2 group  ${
                areaActiva === 'capacitaciones'
                  ? ' text-azul_serio hover:text-azul_serio bg-main'
                  : 'bg-azul_serio'
              } transition-all`}
            >
              <span
                className={`block p-1 rounded-lg bg-azul_serio  group-hover:text-main transition-all ${
                  areaActiva === 'capacitaciones' ? 'text-main' : 'text-white'
                } text-2xl`}
              >
                <MdOutlinePeopleOutline />
              </span>
              <p className='line-clamp-1'>Capacitaciones</p>
            </li>
          </SwiperSlide>
        </Swiper>
      </section>
      <ListTerminos2 area={areaActiva} />
    </>
  )
}
