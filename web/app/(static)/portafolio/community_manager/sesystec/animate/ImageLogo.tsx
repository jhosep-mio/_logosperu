/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'

export const ImageLogo = ({ image }: {image: string}) => {
  return (
    <motion.img
    initial={{ scale: 0 }}
    whileInView={{ scale: 1 }}
    transition={{ duration: 0.3, delay: 0.7 }}
    viewport={{ once: true }}
    src={`/assets/images/portafolio/${image}`} alt="" className='w-[80%] mx-auto lg:w-full h-auto lg:h-[250px] object-contain'/>
  )
}