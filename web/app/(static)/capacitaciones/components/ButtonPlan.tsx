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
    className="bg-white w-full border-2 border-main py-4 rounded-full my-5 hover:bg-main hover:text-white transition-colors duration-300"
  >
    Comprar
  </button>
  )
}
