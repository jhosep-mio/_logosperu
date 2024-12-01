'use client'
import React from 'react'

export const ButtonPlan = ({ plan }:{plan: string}) => {
  const sendWhatsAppMessage = () => {
    const message = `Hola!. Estoy interesado en el ${plan} del servicio de Hosting`

    const phoneNumber = '+51987038024' // Reemplaza con el número de teléfono adecuado
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(
              message
            )}`
    window.open(url, '_blank')
  }
  return (
    <button
    type="button"
    onClick={() => { sendWhatsAppMessage() }}
    className="w-full border-2 border-main py-4 rounded-full my-5 hover:bg-main hover:text-white transition-colors duration-300"
  >
    Comprar
  </button>
  )
}
