'use client'
/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import { motion } from 'framer-motion'

export const Celular = ({
  fondo,
  mockup,
  direction
}: {
  fondo: string;
  mockup: string;
  direction: string;
}) => {
  const [activeMockup, setActiveMockup] = useState(false)
  return (
    <section className="w-full  mx-auto flex items-center justify-center relative h-[420px] lg:h-[630px] bg-no-repeat bg-cover bg-right">
      <motion.div
        onMouseEnter={() => {
          setActiveMockup(true)
        }}
        onMouseLeave={() => {
          setActiveMockup(false)
        }}
        className="absolute  top-0 bottom-0 m-auto left-0 right-0  ml-0 sm:ml-[55px] md:ml-auto w-[301px] lg:w-[370px]  z-[10] h-[400px] lg:h-[600px] bg-[url(/assets/images/portafolio/desarrollo_web/padre_eterno/celular.webp)] bg-no-repeat bg-contain"
      >
        <div className="w-full h-full z-[9] absolute right-0 lg:inset-0 overflow-hidden rounded-[50px]">
          <div className="w-[97%] h-[97%] rounded-[50px]">
            <div className="rounded-[50px] absolute left-0 sm:left-[50px] md:left-[110px] lg:left-0 top-0 w-full h-full pt-[32px] lg:pt-[48px] pl-[10.1px] lg:pl-[16px] pr-[110px] lg:pr-[85px] pb-[10px] lg:pb-[18px]">
              <div className="w-full h-full rounded-bl-[29px] rounded-br-[29px] lg:rounded-bl-[34px] lg:rounded-br-[34px] overflow-auto scroll_black">
                <img
                  src={fondo}
                  alt="Screen Capture"
                  className="w-full object-cover "
                />
              </div>
            </div>
          </div>
        </div>
        <img
          src={mockup}
          alt=""
          className={`w-full h-full hidden lg:block object-contain absolute   top-0 ${
            activeMockup
              ? `opacity-100 scale-100 ${
                  direction === 'left' ? 'left-[289px]' : ''
                } ${
                    direction === 'right' ? 'right-[354px]' : ''
                  } `
              : `opacity-0  ${direction === 'right' ? 'right-[89px]' : ''}`
          } transition-all`}
        />
      </motion.div>
    </section>
  )
}
