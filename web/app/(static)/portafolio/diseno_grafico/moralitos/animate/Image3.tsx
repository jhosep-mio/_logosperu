/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'

export const Image3 = () => {
  return (
    <motion.img
      initial={{ opacity: 0, transform: 'translate(-30%, 30%)' }}
      whileInView={{ opacity: 1, transform: 'translate(0%, 0%)' }}
      transition={{ duration: 0.5 }}
      src="/assets/images/portafolio/moralitos/recurso3.webp"
      alt=""
      className="w-[60%] h-full absolute top-0 left-0 right-0 mx-auto z-[10]"
      />
  )
}
