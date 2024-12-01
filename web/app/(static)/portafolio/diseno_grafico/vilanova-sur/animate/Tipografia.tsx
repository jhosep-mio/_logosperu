/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'

export const Tipografia = () => {
  return (
    <motion.img
    initial={{ opacity: 0.4 }}
    whileInView={{ opacity: 1 }}
    transition={{ duration: 0.5 }}
    src="/assets/images/portafolio/villanova-sur/tipografia.webp"
    alt=""
    className="h-auto w-full lg:w-1/2" />
  )
}
