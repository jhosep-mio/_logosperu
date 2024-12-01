/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'

export const Paleta2 = () => {
  return (
    <div className="flex flex-col justify-center bg-[#DF040B] px-20 py-10 lg:h-[176px]">
      <motion.p
        className="text-white text-center text-[1.5rem] md:text-3xl lg:text-4.5xl xl:text-5xl font_Archivo_bold"
        initial={{ opacity: 0, transform: 'translateX(-100%)' }}
        whileInView={{ opacity: 1, transform: 'translateX(0%)' }}
        transition={{ duration: 0.5 }}
      >
        #DF040B
      </motion.p>
    </div>
  )
}
