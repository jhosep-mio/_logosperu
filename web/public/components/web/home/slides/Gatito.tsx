/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import React, { useEffect, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export const Gatito = () => {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      const randomNumber = Math.floor(Math.random() * 6) + 1 // Genera números aleatorios entre 1 y 6
      setIndex(randomNumber)
    }, 6000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="absolute w-screen h-[542px] lg:h-screen inset-0 overflow-hidden z-[-1]">
       <AnimatePresence>
        {index == 1 && (
          <motion.img
            src="/assets/images/home/gatito.png"
            alt="Orejas de gato"
            className="absolute top-32 -left-4 lg:-left-8 w-[80px] lg:w-[150px] h-auto"
            initial={{
              opacity: 0,
              transform: 'translate(-100%, 0%) rotate(89deg)'
            }}
            animate={{
              opacity: 1,
              transform: 'translate(0%, 0%) rotate(89deg)'
            }}
            exit={{
              opacity: 0,
              transform: 'translate(-100%, 0%) rotate(89deg)'
            }}
            transition={{
              duration: 1.5
            }}
          />
        )}
      </AnimatePresence>
       <AnimatePresence>
        {index == 2 && (
          <motion.img
            src="/assets/images/home/gatito.png"
            alt="Orejas de gato"
            className="absolute bottom-0 -left-5 lg:-left-10 w-[80px] lg:w-[150px] h-auto"
            initial={{
              opacity: 0,
              transform: 'translate(-100%, 0%) rotate(50deg)'
            }}
            animate={{
              opacity: 1,
              transform: 'translate(0%, 0%) rotate(50deg)'
            }}
            exit={{
              opacity: 0,
              transform: 'translate(-100%, 0%) rotate(50deg)'
            }}
            transition={{
              duration: 1.5
            }}
          />
        )}
      </AnimatePresence>
       <AnimatePresence>
        {index == 3 && (
          <motion.img
            src="/assets/images/home/gatito.png"
            alt="Orejas de gato"
            className="absolute -top-4 lg:-top-10 left-0 mx-auto right-0 w-[80px] lg:w-[150px] h-auto"
            initial={{
              opacity: 0,
              transform: 'translate(0%, -100%) rotate(185deg)'
            }}
            animate={{
              opacity: 1,
              transform: 'translate(0%, 0%) rotate(180deg)'
            }}
            exit={{
              opacity: 0,
              transform: 'translate(0%, -100%) rotate(180deg)'
            }}
            transition={{
              duration: 1.5
            }}
          />
        )}
      </AnimatePresence>
       <AnimatePresence>
        {index == 4 && (
          <motion.img
            src="/assets/images/home/gatito.png"
            alt="Orejas de gato"
            className="absolute -bottom-4 lg:-bottom-6 lg:left-0 lg:mx-auto right-0 w-[80px] lg:w-[150px] h-auto"
            initial={{
              opacity: 0,
              transform: 'translate(-0%, 100%) rotate(0deg)'
            }}
            animate={{
              opacity: 1,
              transform: 'translate(0%, 0%) rotate(0deg)'
            }}
            exit={{
              opacity: 0,
              transform: 'translate(-0%, 100%) rotate(0deg)'
            }}
            transition={{
              duration: 1.5
            }}
          />
        )}
      </AnimatePresence>

       <AnimatePresence>
        {index == 5 && (
          <motion.img
            src="/assets/images/home/gatito.png"
            alt="Orejas de gato"
            className="hidden lg:block absolute -bottom-10 right-[300px] w-[150px] h-auto"
            initial={{
              opacity: 0,
              transform: 'translate(100%, 100%) rotate(40deg)'
            }}
            animate={{
              opacity: 1,
              transform: 'translate(0%, 0%) rotate(40deg)'
            }}
            exit={{
              opacity: 0,
              transform: 'translate(100%, 100%) rotate(40deg)'
            }}
            transition={{
              duration: 1.5
            }}
          />
        )}
      </AnimatePresence>
       <AnimatePresence>
        {index == 6 && (
          <motion.img
            src="/assets/images/home/gatito.png"
            alt="Orejas de gato"
            className="absolute top-32 -right-6 lg:-right-8 w-[80px] lg:w-[150px] h-auto"
            initial={{
              opacity: 0,
              transform: 'translate(100%, 100%) rotate(-40deg)'
            }}
            animate={{
              opacity: 1,
              transform: 'translate(0%, 0%) rotate(-40deg)'
            }}
            exit={{
              opacity: 0,
              transform: 'translate(100%, 100%) rotate(-40deg)'
            }}
            transition={{
              duration: 1.5
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
