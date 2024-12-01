'use client'
import React from 'react'
import { motion } from 'framer-motion'

export const VideoOpacity = () => {
  return (
    <motion.video
      initial={{
        opacity: 0,
        scale: 0.2
      }}
      whileInView={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4, delay: 0 }}
      controls
      autoPlay
      className="mx-auto w-full max-w-xl overflow-hidden rounded-2xl shadow-md"
    >
      <source src="/assets/images/servicios/seo/video.mp4" type="video/mp4" className="w-full object-contain" />
      Tu navegador no soporta la reproducción de videos.
    </motion.video>
  )
}
