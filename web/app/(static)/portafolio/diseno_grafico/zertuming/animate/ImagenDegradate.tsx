/* eslint-disable @next/next/no-img-element */
/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'

export const ImagenDegradate = () => {
  return (
    <motion.img
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      src="/assets/images/portafolio/desarrollo_web/zertuming/separacion.webp"
      alt=""
      className="hidden 2xl:block h-full object-contain"
    />
  )
}
