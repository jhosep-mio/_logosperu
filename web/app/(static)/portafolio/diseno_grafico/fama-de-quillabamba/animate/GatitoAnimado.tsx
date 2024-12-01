/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'

export const GatitoAnimado = () => {
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
    src={'/assets/images/portafolio/jackos_bar/gato_frontal.gif'} alt="" className='absolute bottom-[-40px] object-bottom lg:left-0 right-0 mx-auto z-20 h-[100px] lg:h-[300px] object-contain'/>
  )
}
