/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'

export const Image1 = ({ image } : {image : string}) => {
  return (
    <motion.img
      initial={{ opacity: 0, transform: 'translateY(10%)' }}
      whileInView={{ opacity: 1, transform: 'translateY(0%)' }}
      transition={{ duration: 0.3 }}
      src={`/assets/images/portafolio/${image}`}
      alt=""
      className="h-auto w-full "
    />
  )
}
