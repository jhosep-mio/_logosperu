/* eslint-disable @next/next/no-img-element */
'use client'
import SwiperPlanes from '@/public/components/servicios/diseno_grafico/planes/SwiperPlanes'
import React from 'react'

export const PlanesPage = () => {
  return (
    <section className="bg-[#EDEDED] py-[30px] px-4 lg:py-[40px] flex flex-col gap-3 lg:gap-4 justify-center items-center">
        <div className='mb-4 flex flex-col gap-4 lg:py-6'>
            <h2 className='text-azul_serio text-center text-3xl 2xl:text-5xl font_Archivo_bold'>¿Qué tipo de <span className='text-main'>logotipo</span> necesitas?</h2>
            <p className='text-sm lg:text-lg text-azul_serio text-center'>Explora una amplia variedad de estilos con un logotipo único que represente tu marca.</p>
        </div>
        <SwiperPlanes servicio='Diseño de logotipo' />
    </section>
  )
}
