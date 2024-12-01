'use client'
import { motion } from 'framer-motion'

export const Gatito = () => {
  return (
    <motion.img
      src="/assets/images/portafolio/jackos_bar/gato_frontal.gif"
      alt=""
      animate={{
        y: [0, -20, 0] // Animación de subir y bajar
      }}
      transition={{
        duration: 5, // Duración de un ciclo de animación
        repeat: Infinity, // Repetir indefinidamente
        repeatType: 'loop', // Tipo de repetición
        ease: 'easeInOut' // Suavizado de la animación
      }}
      className="absolute w-[30%] object-bottom lg:w-[20%] z-50 -bottom-12 h-fit object-cover right-0 bg-transparent"
    />
  )
}
