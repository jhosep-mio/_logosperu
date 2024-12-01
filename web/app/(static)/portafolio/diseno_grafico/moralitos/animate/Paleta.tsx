/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'

export const Paleta = () => {
  return (
    <div
      className="flex flex-col h-full z-[2] bg-[#2D73B4]"
    >
      <motion.div className="flex flex-col px-20 items-center justify-center h-full"
        initial={{ opacity: 0, transform: 'translateX(-100%)' }}
        whileInView={{ opacity: 1, transform: 'translateX(0%)' }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-white/30 text-center text-[1.5rem] md:text-3xl lg:text-4.5xl  xl:text-5xl font_Archivo_bold">
          PALETA DE COLOR
        </p>
        <p className="text-white text-center text-[1.5rem] md:text-3xl lg:text-4.5xl xl:text-5xl font_Archivo_bold">
          #2D73B4
        </p>
      </motion.div>
    </div>
  )
}
