/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'

export const TextoMarca = ({ texto }: {texto: string}) => {
  return (
    <motion.p
      initial={{ opacity: 0, transform: 'translateX(50%)' }}
      whileInView={{ opacity: 1, transform: 'translateX(0%)' }}
      transition={{ duration: 0.5 }}
      className="w-full 2xl:w-[55%]  text-gray-300 lg:text-white text-base   lg:text-[1.6vh] xl:text-[2.2vh] leading-2 md:leading-5 lg:leading-7 text-justify"
    >
     {texto}
    </motion.p>
  )
}
