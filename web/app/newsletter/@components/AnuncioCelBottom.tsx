/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useState } from 'react'
import { IoCloseCircleSharp } from 'react-icons/io5'
import { motion, AnimatePresence } from 'framer-motion'

export const AnuncioCelBottom = () => {
  const [show, setShow] = useState(true)

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed bottom-0 left-0 right-0 mx-auto h-[100px] object-contain object-bottom w-[90%] lg:hidden"
          initial={{ opacity: 0, bottom: '-20%' }}
          animate={{ opacity: 1, bottom: '0' }}
          exit={{ opacity: 0, bottom: '-20%' }}
        >
          <img
            src="/assets/images/newsletter/anuncio4.webp"
            alt=""
            className="object-contain object-bottom w-full h-full"
          />
          <IoCloseCircleSharp
            className="absolute -top-2 -right-2 text-3xl cursor-pointer"
            onClick={() => setShow(!show)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}
