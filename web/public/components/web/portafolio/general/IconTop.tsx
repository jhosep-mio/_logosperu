'use client'
import React from 'react'
import { FaAngleLeft } from 'react-icons/fa6'

export const IconTop = () => {
  const top = () => {
    window.scrollTo(0, 0)
  }
  return (
    <p
      onClick={() => top()}
      className="fixed z-[999] flex  items-center justify-center gap-2 bottom-3 md:bottom-6 left-4 w-[50px] h-[50px] md:left-6 bg-yellow-400 text-azul_serio font-light rounded-full uppercase transition-all hover:bg-main shadow font_Archivo_bold"
      rel="noreferrer"
    >
      <FaAngleLeft className="text-2xl lg:text-xl rotate-90" />
    </p>
  )
}
