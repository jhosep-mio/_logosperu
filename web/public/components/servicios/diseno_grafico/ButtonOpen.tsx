'use client'
import React, { useState } from 'react'
import { ModalDiseno } from './ModalDiseno'

export const ButtonOpen = ({ servicio } : {servicio: string}) => {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        onClick={() => setOpen(!open)}
        className="bg-azul_serio rounded-xl mx-auto md:mx-0 hover:bg-azul_serio_dark text-xl px-6 py-3 text-center text-white mt-16 w-full md:w-[400px]"
      >
        Ver planes
      </button>
      <ModalDiseno open={open} setOpen={setOpen} servicio={servicio}/>
    </>
  )
}
