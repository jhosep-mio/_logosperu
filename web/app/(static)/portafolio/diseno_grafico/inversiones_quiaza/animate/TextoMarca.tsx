/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'

export const TextoMarca = ({ texto }: {texto: string}) => {
  return (
    <motion.p
      initial={{ opacity: 0, transform: 'translateX(50%)' }}
      whileInView={{ opacity: 1, transform: 'translateX(0%)' }}
      transition={{ duration: 0.5 }}
      className="w-full 2xl:w-[55%] font_Archivo_bold  text-[#008CC4] text-base  lg:text-[2vh] xl:text-[2.4vh] leading-6 md:leading-8 lg:leading-[2rem] xl:leading-[3vh] text-justify"
    >
     {texto}
    </motion.p>
  )
}
