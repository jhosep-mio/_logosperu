/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import { useEffect } from 'react'

export const VlidationCarrito = ({ message }: any) => {
  useEffect(() => {
    if (message.paymentId) {
      localStorage.removeItem('cart')
    }
  }, [])
  return null
}
