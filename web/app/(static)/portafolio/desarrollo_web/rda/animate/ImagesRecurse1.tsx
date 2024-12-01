/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'

export const ImagesRecurse1 = () => {
  return (
    <div className="w-full flex flex-col lg:flex-row py-6 lg:py-16 px-4 lg:px-10 overflow-hidden">
      <motion.img
        initial={{ opacity: 0, transform: 'translateX(-100%)' }}
        whileInView={{ opacity: 1, transform: 'translateX(0%)' }}
        transition={{ duration: 0.5 }}
        src="/assets/images/portafolio/desarrollo_web/rda/mockup1.webp"
        alt=""
        className="h-auto w-full lg:w-2/3 z-[2]"
      />
      <motion.img
        initial={{ opacity: 0, transform: 'translateX(100%)' }}
        whileInView={{ opacity: 1, transform: 'translateX(0%)' }}
        transition={{ duration: 0.5 }}
        src="/assets/images/portafolio/desarrollo_web/rda/recurso2.webp"
        alt=""
        className="h-auto w-[80%] mx-auto lg:w-1/3 z-[2] object-contain"
      />
    </div>
  )
}
