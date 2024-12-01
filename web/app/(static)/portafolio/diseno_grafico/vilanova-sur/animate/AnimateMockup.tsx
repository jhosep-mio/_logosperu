/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'
export const AnimateMockup = () => {
  return (
    <motion.img
    id=''
      initial={{ scale: 0 }}
      whileInView={{ scale: 1 }}
      transition={{ duration: 0.3 }}
      src={
        '/assets/images/portafolio/villanova-sur/mockup2.webp'
      }
      alt=""
      className="w-full h-full bg-center bg-no-repeat bg-cover animate_vasito object-cover"
      onAnimationComplete={() => {
        const spanElement = document.getElementById('mockupVasito')
        if (spanElement) {
          // @ts-ignore
          spanElement.classList.add('animate_vasito')
        }
      }}
    />
  )
}
