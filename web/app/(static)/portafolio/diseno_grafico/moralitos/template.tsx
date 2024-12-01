'use client'
import { motion } from 'framer-motion'
import React from 'react'

export default function Template ({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      className="relative z-[999]"
    >
      <motion.div
        id='animate_1'
        className="fixed w-full h-[50vh] bg-black top-0 left-0 right-0 z-[999]"
        initial={{ transform: 'translateY(0%)' }}
        animate={{ transform: 'translateY(-100%)' }}
        transition={{ duration: 0.5, delay: 0.5 }}
        onAnimationComplete={() => {
          const spanElement = document.getElementById('animate_1')
          if (spanElement) {
            // @ts-ignore
            spanElement.parentNode.removeChild(spanElement)
          }
        }}
      />
      <motion.div
        id="span_initial"
        initial={{ width: '0' }}
        animate={{ width: '100%' }}
        transition={{ duration: 0.5 }}
        onAnimationComplete={() => {
          const spanElement = document.getElementById('span_initial')
          if (spanElement) {
            // @ts-ignore
            spanElement.parentNode.removeChild(spanElement)
          }
        }}
        className="fixed inset-0 m-auto  bg-white h-[3px] z-[999]"
      />
      <motion.div
        id='animate_2'
        className="fixed w-full h-[50vh] bg-black bottom-0 left-0 right-0 z-[999]"
        initial={{ transform: 'translateY(0%)' }}
        animate={{ transform: 'translateY(100%)' }}
        transition={{ duration: 0.5, delay: 0.5 }}
        onAnimationComplete={() => {
          const spanElement = document.getElementById('animate_2')
          if (spanElement) {
            // @ts-ignore
            spanElement.parentNode.removeChild(spanElement)
          }
        }}
      />
      {children}
    </motion.div>
  )
}
