/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'

export const CodigoColor = ({ texto }: { texto: string }) => {
  return (
    <div className="flex flex-col h-full lg:flex-row w-full">
      <motion.span
        initial={{ opacity: 0, transform: 'translateX(50%)' }}
        whileInView={{ opacity: 1, transform: 'translateX(0%)' }}
        transition={{ duration: 0.5 }}
        className="text-white bg-[#008CC4] w-full h-full text-xl flex gap-5 items-center justify-center lg:text-3xl xl:text-[3vh] 2xl:text-[6vh] font_Archivo_bold"
      >
        {texto}
      </motion.span>
      <motion.span
        initial={{ opacity: 0, transform: 'translateX(50%)' }}
        whileInView={{ opacity: 1, transform: 'translateX(0%)' }}
        transition={{ duration: 0.5 }}
        className="text-white bg-[#00488B]  w-full text-xl flex gap-5 items-center justify-center lg:text-3xl xl:text-[3vh] 2xl:text-[6vh] font_Archivo_bold"
      >
        {texto}
      </motion.span>
      <motion.span
        initial={{ opacity: 0, transform: 'translateX(50%)' }}
        whileInView={{ opacity: 1, transform: 'translateX(0%)' }}
        transition={{ duration: 0.5 }}
        className="text-white bg-[#F0D51B]   w-full text-xl flex gap-5 items-center justify-center lg:text-3xl xl:text-[3vh] 2xl:text-[6vh] font_Archivo_bold"
      >
        {texto}
      </motion.span>
    </div>
  )
}
