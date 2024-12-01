'use client'
import React, { useState } from 'react'
import { ModalPortafolio } from './ModalPortafolio'

export const ButtonPortafolio = ({ servicio, className }: {servicio: string, className?: string}) => {
  const [openModal, setOpenModal] = useState(false)
  return (
    <>
        <button type="button" onClick={() => { setOpenModal(true) }} className={`${className || 'bg-main rounded-xl mx-auto md:mx-0 hover:bg-azul_serio_dark text-azul_serio h-fit text-xl px-6 py-3 text-center  mt-2 lg:mt-16 w-full md:w-[400px] transition-all hover:text-white'}`}>Ver portafolio</button>
        <ModalPortafolio open={openModal} setOpen={setOpenModal} servicio={servicio}/>
    </>

  )
}
