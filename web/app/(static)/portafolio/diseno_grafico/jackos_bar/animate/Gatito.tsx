'use client'
import { motion } from 'framer-motion'

export const Gatito = () => {
  return (
    <motion.img
      src="/assets/images/portafolio/jackos_bar/gato_frontal.gif"
      alt=""
      animate={{
        y: [0, -40, 0] // Animación de subir y bajar
      }}
      transition={{
        duration: 5, // Duración de un ciclo de animación
        repeat: Infinity, // Repetir indefinidamente
        repeatType: 'loop', // Tipo de repetición
        ease: 'easeInOut' // Suavizado de la animación
      }}
      className="absolute w-[30%] lg:w-[20%] top-0 bottom-[190px] lg:bottom-[270px] my-auto  h-auto object-cover right-[0px] z-[-1] bg-transparent"
    />
  )
}
