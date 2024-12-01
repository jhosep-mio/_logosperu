/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'
import React from 'react'
export const Gatito = () => {
  return (
    <motion.img
    animate={{
      y: [0, -40, 0] // Animación de subir y bajar
    }}
      transition={{
        duration: 5, // Duración de un ciclo de animación
        repeat: Infinity, // Repetir indefinidamente
        repeatType: 'loop', // Tipo de repetición
        ease: 'easeInOut' // Suavizado de la animación
      }}
      src="/assets/images/servicios/community/gatito.png"
      alt=""
      className=" left-4 md:left-10 lg:left-0 lg:right-0 mx-auto absolute -bottom-32 h-[220px] md:h-[300px] z-20"
    />
  )
}
