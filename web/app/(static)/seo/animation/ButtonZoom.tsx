'use client'
import React from 'react'
import { motion } from 'framer-motion'

export const ButtonZoom = () => {
  return (
    <motion.button
      type="button"
      initial={{
        opacity: 0,
        scale: 0.2
      }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 3.1 }}
      className="block mx-auto lg:mx-0 bg-main mt-6 rounded-xl px-8 py-2 text-nigga text-center font-bold text-xl shadow-md"
    >
      Contactar
    </motion.button>
  )
}
