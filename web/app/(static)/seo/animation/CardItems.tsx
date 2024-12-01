/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'
import React from 'react'

export const CardItems = ({ animation, title, text, icon } : {animation: string, title: string, text: string, icon: string}) => {
  return (
    <motion.div
      initial={{ opacity: 0, translateX: animation === 'right' ? '100%' : '-100%' }}
      whileInView={{ opacity: 1, translateX: 0 }}
      transition={{ duration: 0.7 }}
      className="flex flex-col rounded-[1.2rem] effect-glass p-6 group transition-all duration-300 hover:scale-105"
    >
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="w-full lg:w-1/5 flex flex-row lg:flex-col h-full justify-between">
          <img
            src={icon}
            alt=""
            width={70}
            className="block mx-0 lg:mx-auto"
          />
          <img
            src="/assets/images/servicios/seo/iconos/gatito.png"
            alt=""
            width={40}
            className="block mx-0 lg:mx-auto object-contain -rotate-45 transition-all group-hover:scale-125 duration-500 group-hover:rotate-0"
          />
        </div>
        <div className="w-full lg:w-4/5 flex flex-col">
          <h5 className="font-bold text-2xl text-main mb-3">
            {title}
          </h5>
          <p className="text-white leading-7 text-justify text-base lg:pr-6">
            {text}
          </p>
        </div>
      </div>
    </motion.div>
  )
}
