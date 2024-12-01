/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'

export const ImageMarca = () => {
  return (
    <motion.img
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      src="/assets/images/portafolio/desarrollo_web/medicina_academica/fondo3.webp"
      alt=""
      className="w-full h-full object-cover 2xl:h-[1000px]"
    />
  )
}
