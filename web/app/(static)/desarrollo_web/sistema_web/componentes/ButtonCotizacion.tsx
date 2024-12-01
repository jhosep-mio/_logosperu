'use client'
import React from 'react'

export const ButtonCotizacion = ({ className }: { className: string }) => {
  const sendWhatsAppMessage = () => {
    const message = 'Hola!. Estoy interesado en el servicio de Desarrollo de sistemas. Desearía saber mas detalles.'

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
      className={className}
    >
      Solicitar cotización
    </button>
  )
}
