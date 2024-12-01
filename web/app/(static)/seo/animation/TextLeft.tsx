'use client'
import React, { ReactNode } from 'react'
import { motion } from 'framer-motion'

interface TextLeftProps {
  children: ReactNode;
  time: number,
  duracion: number,
  direction: string
}

export const TextLeft: React.FC<TextLeftProps> = ({ children, time, duracion, direction }) => {
  return (
    <>
      <motion.span
        initial={{
          opacity: 0,
          transform: direction === 'left' ? 'translateX(-100%)' : 'translateX(100%)'
        }}
        whileInView={{ opacity: 1, transform: 'translateX(0%)' }}
        transition={{ duration: duracion, delay: time }}
        className='block'
      >
        {children}
      </motion.span>
    </>
  )
}
