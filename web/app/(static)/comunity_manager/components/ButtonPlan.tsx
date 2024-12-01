'use client'
import { useRouter } from 'next/navigation'
import React from 'react'
import { v4 as uuidv4 } from 'uuid'

export const ButtonPlan = ({ plan, precio, servicio, correlativo }:{plan: string, precio: string, servicio: string, correlativo: string}) => {
  const router = useRouter()
  const sendWhatsAppMessage = () => {
    const precioLimpio = precio.replace(/[^\d.]/g, '')
    const newItem = {
      id: uuidv4(),
      nombre: plan,
      servicio,
      cantidad: 1,
      precio: precioLimpio,
      imagen1: 'default',
      correlativo
    }
    localStorage.setItem('cart', JSON.stringify([newItem]))
    router.push('/checkout')
  }
  return (
    <button
    type="button"
    onClick={() => { sendWhatsAppMessage() }}
    className="bg-main rounded-lg px-4 py-2 mt-4 font-bold uppercase "
  >
    Comprar
  </button>
  )
}
