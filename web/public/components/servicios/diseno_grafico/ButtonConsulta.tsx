'use client'
import React from 'react'

export const ButtonConsulta = ({
  servicio,
  className
}: {
  servicio: string;
  className?: string;
}) => {
  const sendWhatsAppMessage = () => {
    const message = `Hola!. Estoy interesado en el servicio de ${servicio}.`

    const phoneNumber = '+51987038024' // Reemplaza con el número de teléfono adecuado
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
      message
    )}`
    window.open(url, '_blank')
  }
  return (
    <button
      type="button"
      onClick={() => {
        sendWhatsAppMessage()
      }}
      className={` ${className || 'bg-azul_serio rounded-xl mx-auto md:mx-0 hover:bg-azul_serio_dark text-xl px-6 py-3 text-center text-white mt-16 w-full md:w-[400px]'}`}
    >
      Contactar
    </button>
  )
}
