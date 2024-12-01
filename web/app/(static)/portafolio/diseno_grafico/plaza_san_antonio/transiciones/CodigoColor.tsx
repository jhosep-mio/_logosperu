/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'

export const CodigoColor = ({ texto }: { texto: string }) => {
  return (
    <motion.span
      initial={{ opacity: 0, transform: 'translateX(50%)' }}
      whileInView={{ opacity: 1, transform: 'translateX(0%)' }}
      transition={{ duration: 0.5 }}
      className="text-white text-xl lg:text-3xl xl:text-[3vh] 2xl:text-[6vh] font_Archivo_bold"
    >
      {texto}
    </motion.span>
  )
}
