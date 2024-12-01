/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'

export const PaletaColor = ({ color }: {color: string}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0 }}
      whileInView={{ opacity: 1, scale: 3.5 }}
      transition={{
        duration: 0.8,
        ease: 'easeOut'
      }}
      style={{ background: `${color}` }}
      className="absolute w-96 h-96 inset-0 m-auto -z-10 rounded-full"
    >

    </motion.div>
  )
}
