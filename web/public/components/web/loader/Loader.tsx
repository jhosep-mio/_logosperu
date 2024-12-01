import React from 'react'
import { motion } from 'framer-motion'

export const Loader = () => {
  return (
    <motion.div className="fixed inset-0 w-full h-screen z-[9999] flex flex-col">
      <div className="w-full h-1/2 relative overflow-hidden">
        <motion.div
          className="absolute w-full h-full bg-black top-0 left-0 right-0"
          initial={{ transform: 'translateY(0%)' }}
          animate={{ transform: 'translateY(-100%)' }}
          transition={{ duration: 0.5, delay: 0.5 }}
        />
      </div>
      <motion.span
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
        className="absolute inset-0 m-auto  bg-white h-[3px]"
      />
      <div className="w-full h-1/2 relative overflow-hidden">
        <motion.div
          className="absolute w-full h-full bg-black bottom-0 left-0 right-0"
          initial={{ transform: 'translateY(0%)' }}
          animate={{ transform: 'translateY(100%)' }}
          transition={{ duration: 0.5, delay: 0.5 }}
        />
      </div>
    </motion.div>
  )
}
