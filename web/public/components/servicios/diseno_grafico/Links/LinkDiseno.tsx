/* eslint-disable react-hooks/exhaustive-deps */
'use client'
import Link from 'next/link'
import React, { useEffect } from 'react'

export const LinkDiseno = ({ id, texto }: { id: string; texto: string }) => {
  // Función para realizar scroll hacia el centro
  const scrollToCenter = (element: HTMLElement) => {
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

  // Escuchar cuando la página se carga y tiene un hash
  useEffect(() => {
    const hash = window.location.hash
    if (hash) {
      const element = document.getElementById(hash.substring(1)) // Quitamos el '#' del hash
      if (element) {
        scrollToCenter(element)
      }
    }
  }, []) // Solo se ejecuta una vez cuando el componente se monta
  // Función que maneja el click del enlace
  const handleClick = (e: any) => {
    e.preventDefault() // Evita el comportamiento por defecto del enlace
    const element = document.getElementById(`${id}`)
    if (element) {
      scrollToCenter(element)
    }
  }

  return (
    <Link
      href={`#${id}`}
      onClick={handleClick}
      className="w-full sm:w-[50%] md:w-[30%] lg:w-[15%] mr-2 mb-4 text-white text_shadow text-center hover:underline hover:underline-main transition-colors"
    >
      {texto}
    </Link>
  )
}
