'use client'
import React, { useEffect, useState } from 'react'
import { FaFacebookF, FaInstagram, FaYoutube } from 'react-icons/fa6'
import { AnimatePresence, motion } from 'framer-motion'

export const Redes = () => {
  const [scroll, setScroll] = useState(0)

  const [activeIcon, setActiveIcon] = useState(0) // Estado para controlar el ícono activo

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIcon((prev) => (prev + 1) % 3) // Cambiar al siguiente ícono cada 3 segundos
    }, 4000)

    return () => clearInterval(interval) // Limpiar el intervalo cuando el componente se desmonta
  }, [])

  useEffect(() => {
    const handleScroll = (): void => {
      setScroll(window.scrollY)
    }
    window.addEventListener('scroll', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  const headerClass = scroll > 0 ? 'opacity-100' : 'lg:opacity-0'

  return (
    <>
      <motion.div
        className={
          'flex flex-col fixed lg:hidden z-[800] right-4 bottom-[4.3rem] lg:bottom-4 gap-3 transition-opacity'
        }
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          className={
            'flex items-center group justify-center  rounded-full p-2 transition-colors w-[50px] h-[50px] relative overflow-hidden'
          }
        >
          <AnimatePresence>
            {activeIcon == 0 && (
              <motion.a
                href="https://www.youtube.com/@logosperu476"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                aria-label="Ir al canal de Youtube de Logos Perú"
                className="absolute inset-0 flex bg-[#FF0000] items-center justify-center"
                transition={{
                  ease: 'linear',
                  duration: 0.5,
                  x: { duration: 0.5 }
                }}
              >
                <FaYoutube className="text-3xl  cursor-pointer text-white transition-colors" />
              </motion.a>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {activeIcon == 1 && (
              <motion.a
                href="https://www.instagram.com/dlogosperu/?hl=es"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                aria-label="Ir al Perfil de Instagram de Logos Perú"
                className="absolute inset-0  bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center"
                transition={{
                  ease: 'linear',
                  duration: 0.5,
                  x: { duration: 0.5 }
                }}
              >
                <FaInstagram className="text-3xl  cursor-pointer text-white transition-colors" />
              </motion.a>
            )}
          </AnimatePresence>
          <AnimatePresence>
            {activeIcon == 2 && (
              <motion.a
                href="https://www.facebook.com/DLogosPeru/?locale=es_LA"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                aria-label="Ir al Perfil de Facebook de Logos Perú"
                className="absolute inset-0 flex bg-[#1877F2] items-center justify-center"
                exit={{ scale: 0 }}
                transition={{
                  ease: 'linear',
                  duration: 0.5,
                  x: { duration: 0.5 }
                }}
              >
                <FaFacebookF className="text-3xl cursor-pointer text-white transition-colors" />
              </motion.a>
            )}
          </AnimatePresence>

        </motion.div>
      </motion.div>

      <motion.div
        className={`${headerClass} hidden lg:flex flex-col fixed z-[800] left-4 bottom-20 lg:bottom-4 gap-3 transition-opacity`}
      >
        <motion.a
          target="_blank"
          href="https://www.youtube.com/@logosperu476"
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
            'flex items-center group justify-center bg-main hover:bg-[#FF0000] rounded-full p-2 transition-colors'
          }
        >
          <FaYoutube className="text-3xl text-azul_serio group-hover:text-white transition-colors" />
        </motion.a>
        <motion.a
          target="_blank"
          href="https://www.instagram.com/dlogosperu/?hl=es"
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
            'flex items-center group justify-center bg-main hover:bg-gradient-to-br from-purple-600 to-pink-500 rounded-full p-2 transition-colors'
          }
        >
          <FaInstagram className="text-3xl text-azul_serio group-hover:text-white transition-colors" />
        </motion.a>
        <motion.a
          target="_blank"
          href="https://www.facebook.com/DLogosPeru/?locale=es_LA"
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
            'flex items-center group justify-center bg-main hover:bg-[#1877F2] rounded-full p-2 transition-colors'
          }
        >
          <FaFacebookF className="text-3xl text-azul_serio group-hover:text-white transition-colors" />
        </motion.a>
      </motion.div>
    </>
  )
}
