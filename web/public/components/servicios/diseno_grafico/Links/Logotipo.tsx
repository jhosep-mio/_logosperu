'use client'
import Link from 'next/link'
import React from 'react'

export const Logotipo = () => {
  const scrollToCenter = (e: any) => {
    e.preventDefault() // Evita el comportamiento por defecto del enlace
    const element = document.getElementById('logitopo')
    if (element) {
      const elementRect = element.getBoundingClientRect()
      const elementHeight = elementRect.height
      const elementY = window.scrollY + elementRect.top
      const viewportHeight = window.innerHeight
      const scrollToY = elementY - (viewportHeight / 2) + (elementHeight / 2) - 50 // Ajusta con 50 px arriba
      window.scrollTo({
        top: scrollToY,
        behavior: 'smooth'
      })
    }
  }
  return (
    <Link
    href="#logitopo"
    onClick={scrollToCenter}
    className="w-[16.6%] text-white text_shadow hover:underline hover:text-main transition-colors"
  >
    DISEÑO DE LOGOTIPO
  </Link>
  )
}
