'use client'
import React from 'react'
import { easeInOut, motion } from 'framer-motion'

interface TextLeftProps {
    time: number,
    duracion: number,
    direction: 'left' | 'right',
    className: string,
    imagen: string
}

export const Manitos: React.FC<TextLeftProps> = ({ className, direction, duracion, time, imagen }) => {
  return (
    <motion.img
      src={imagen}
      className={className}
      initial={{
        left: direction === 'left' ? '-320px' : undefined,
        right: direction === 'right' ? '-320px' : undefined
      }}
      whileInView={{
        left: direction === 'left' ? '-1180px' : undefined,
        right: direction === 'right' ? '-1180px' : undefined
      }}
      transition={{ duration: duracion, delay: time, type: easeInOut }}
    />
  )
}
