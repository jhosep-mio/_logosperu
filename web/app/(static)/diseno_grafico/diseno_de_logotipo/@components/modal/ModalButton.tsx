/* eslint-disable @next/next/no-img-element */
'use client'
import React, { useState } from 'react'
import { motion } from 'framer-motion'
import confetti from 'canvas-confetti'
import CountUp from 'react-countup'

export const ModalButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [price, setPrice] = useState(89.0) // Estado inicial del precio
  const [animatingPrice, setAnimatingPrice] = useState(false) // Estado para controlar la animación
  const [ofertaDesbloqueada, setOfertaDesbloqueada] = useState(false)

  // Función para lanzar el confeti cuando el modal se abre completamente
  const handleConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 }
    })
  }

  const openModal = () => {
    setOfertaDesbloqueada(true)
    setAnimatingPrice(true) // Comenzar la animación del precio
    setPrice(69.0)
    // Iniciar la animación de cuenta regresiva del precio
    setTimeout(() => {
      // Cambiar el precio a 69.00
      setIsOpen(true) // Abrir el modal después de cambiar el precio
    }, 2500) // Retraso de 1 segundo
  }

  const closeModal = () => {
    setIsOpen(false)
    setAnimatingPrice(false) // Reiniciar animación cuando se cierra el modal
  }

  return (
    <>
      <div className="w-full flex flex-col md:flex-row mt-8 items-center gap-5">
        <div className="w-fit">
          <p className="text-2xl md:text-3xl text-white font_allRound">
            Comencemos con{' '}
            <span
              className={`inline-block text-main ${animatingPrice ? 'scale-110' : ''} transition-all duration-200`}
            >
              S/{' '}
              <CountUp
                start={animatingPrice ? 89.0 : price}
                end={price}
                duration={2.5}
              />
              .00
            </span>
          </p>
        </div>
        <div className="w-fit">
          <div className="flex justify-center items-center">
            {ofertaDesbloqueada ? (
              <button
                onClick={() => {
                  setIsOpen(true)
                }}
                className=" text-main text-xl underline transition"
              >
                Reclamar oferta
              </button>
            ) : (
              <button
                onClick={openModal}
                className=" text-main text-xl underline transition"
              >
                Obtener oferta
              </button>
            )}

            {isOpen && (
              <div className="fixed inset-0 z-[10000] flex items-center justify-center bg-black bg-opacity-50">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0 }}
                  onAnimationComplete={handleConfetti}
                  transition={{ duration: 0.5, type: 'spring' }}
                  className="relative bg-white rounded-lg p-8 max-w-sm w-full text-center shadow-lg"
                >
                  <h2 className="text-2xl font-semibold mb-4">Oferta desbloqueada</h2>

                  <img
                    src="/assets/images/servicios/internas/diseno_logotipo/oferta1.jpeg"
                    alt=""
                  />
                  <button
                    onClick={closeModal}
                    className="px-4 py-2 bg-indigo-500 text-white font-semibold rounded-lg hover:bg-indigo-600 transition"
                  >
                    Cerrar
                  </button>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
