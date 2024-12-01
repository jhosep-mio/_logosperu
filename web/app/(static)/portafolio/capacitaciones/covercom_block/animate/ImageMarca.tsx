/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'

export const ImageMarca = () => {
  return (
    <motion.img
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      src="/assets/images/portafolio/capacitaciones/covercom_block/fondo2.webp"
      alt=""
      className="w-full h-[470px] lg:h-auto object-cover object-top"
    />
  )
}
