/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'

export const TitleMarca = ({ texto }: {texto: string}) => {
  return (
    <motion.h2
      initial={{ opacity: 0, transform: 'translateX(-50%)' }}
      whileInView={{ opacity: 1, transform: 'translateX(0%)' }}
      transition={{ duration: 0.5 }}
      className="w-full 2xl:w-[45%] font_Archivo_bold uppercase text-[1.3rem] md:[2.2vh] xl:text-[3vh] 2xl:text-[4.5vh] text-black block text-center "
    >
      {texto}
    </motion.h2>
  )
}