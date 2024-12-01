/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'

export const Patita = () => {
  return (
    <motion.img
      initial={{ opacity: 0, right: '-100%', bottom: '-30%' }}
      whileInView={{ opacity: 1, right: '0%', bottom: '0%' }}
      transition={{ duration: 0.7 }}
      src="/assets/images/portafolio/plaza_san_antonio/tarjeta.webp"
      alt=""
      className="w-full lg:w-[110%] h-[100%] absolute bottom-0 z-[2] object-contain"
    />
  )
}
