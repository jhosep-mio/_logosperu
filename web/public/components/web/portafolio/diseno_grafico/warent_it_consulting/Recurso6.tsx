'use client'
/* eslint-disable @next/next/no-img-element */
import React, { useEffect } from 'react'
import { motion, useAnimation } from 'framer-motion'

export const Recurso6 = ({ image }: {image: string}) => {
  const control = useAnimation()

  const randomPosition = () => ({
    x: Math.random() * 100 + '%',
    y: Math.random() * 100 + '%'
  })

  useEffect(() => {
    const interval = setInterval(() => {
      control.start({
        x: randomPosition().x,
        y: randomPosition().y,
        transition: {
          duration: 3,
          ease: 'linear'
        }
      })
    }, 3000) // Cada 10 segundos
    return () => clearInterval(interval)
  }, [control])

  return (
    <motion.div
    className='w-fit h-fit hidden lg:block absolute -top-40 right-0 mx-auto'
    animate={control}
    >
      <img src={`/assets/images/${image}`} alt="" className='w-[250px] object-contain h-[250px]'/>
    </motion.div>
  )
}
