'use client'
import React from 'react'
import { FaArrowLeft } from 'react-icons/fa6'

export const Regresar = () => {
  const handleBack = () => {
    window.history.back()
  }

  return (
    <button
    type='button'
    onClick={handleBack} className="w-fit px-4 bg-main hover:bg-darKmain transition-colors flex gap-2 items-center rounded-md py-1 text-white font-bold mt-4 lg:mt-0">
      <FaArrowLeft />
      Seguir comprando
    </button>
  )
}
