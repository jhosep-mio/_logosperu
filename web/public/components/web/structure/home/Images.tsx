'use client'
/* eslint-disable @next/next/no-img-element */
import { AnimatePresence, motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import { FaPhone } from 'react-icons/fa6'

const Images = () => {
  const [showDiv, setShowDiv] = useState(false)
  const handleImageTransitionEnd = () => {
    setTimeout(() => {
      setShowDiv(true)
    }, 10000)
  }

  return (
    <>
      <div className="w-full 2xl:w-1/2 flex flex-1 h-1/2 lg:h-full justify-center 2xl:justify-end lg:overflow-hidden ">
        <AnimatePresence>
          {!showDiv && (
            <motion.img
              src="/assets/images/home/gatito.gif"
              id="image-id"
              alt="Descripción de la primera imagen"
              className="absolute lg:relative bottom-0 right-0 w-[280px] md:w-[400px] lg:w-fit object-contain"
              initial={{ opacity: 0, transform: 'translate(150%, 150%)' }} // Inicialmente fuera de la pantalla, desde la esquina inferior derecha
              animate={{
                opacity: 1,
                transform: 'translate(0%, 0%)'
              }} // Animación de entrada y salida
              transition={{ duration: 1 }} // Duración de la transición de la imagen
              exit={{ opacity: 0, transform: 'translate(150%, 150%)' }} // Inicialmente fuera de la pantalla, desde la esquina inferior derecha
              onAnimationComplete={() => {
                handleImageTransitionEnd()
              }}
            />
          )}
        </AnimatePresence>
        <AnimatePresence>
          {showDiv && (
            <motion.div
              initial={{ opacity: 0, position: 'absolute', inset: 0 }}
              animate={{ opacity: 1, position: 'relative' }}
              exit={{ opacity: 0, scale: 0 }}
              className=""
              transition={{ delay: 1, duration: 1 }} // Duración de la transición del div
            >
              <Link href="/mixelito">
                <img
                  src="/assets/images/home/gatito_mockup.gif"
                  alt="Gatito Logos Perú"
                  width={800}
                  height={100}
                  className="w-full lg:w-[90%] h-full lg:h-[90%] m-auto block object-contain z-[2] "
                />
              </Link>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      <a
        href="tel:+51987038024"
        target="_blank"
        className="flex lg:hidden gap-0 items-center group px-4"
        rel="noreferrer"
      >
        <motion.span
          aria-label="Facebook - Logos Perú"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{
            ease: 'linear',
            duration: 0.5,
            delay: 0.5,
            x: { duration: 0.5 }
          }}
          className={
            'flex items-center group justify-center group-hover:bg-darKmain bg-main rounded-full p-1 transition-colors'
          }
        >
          <FaPhone className="text-2xl p-[2px] text-azul_serio cursor-pointer transition-colors" />
        </motion.span>
        <motion.span
          aria-label="Facebook - Logos Perú"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{
            ease: 'linear',
            duration: 0.5,
            delay: 0.5,
            x: { duration: 0.5 }
          }}
          className="font_Archivo_bold flex h-full py-1 items-center rounded-md px-3 text-sm text-main transition-colors group-hover:text-darKmain md:text-lg"
          rel="noreferrer"
        >
          987 038 024
        </motion.span>
      </a>
    </>
  )
}

export default Images
