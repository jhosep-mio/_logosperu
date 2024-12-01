/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'
export const AnimateMockup = () => {
  return (
    <motion.img
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      transition={{ duration: 0.3 }}
      src={
        '/assets/images/portafolio/desarrollo_web/zertuming/mockup2.webp'
      }
      alt=""
      className="w-full h-full object-top bg-no-repeat bg-cover animate_vasito object-contain"

    />
  )
}
