'use client'
import React, { useState } from 'react'
import { SelectorPlan } from '@/public/components/servicios/capacitaciones/planes/SelectorPlan'
import { PlanesFacebook } from '@/public/components/servicios/capacitaciones/planes/PlanesFacebook'
import { PlanesGoogle } from '@/public/components/servicios/capacitaciones/planes/PlanesGoogle'
import { PlanesPasarelas } from './PlanesPasarelas'
import { PlanesRedes } from './PlanesRedes'

export const SwiperPlanes = () => {
  const [planSelected, setPlanSelected] = useState('facebook ads')
  return (
    <section className="max-w-7xl mx-auto relative " id="swiper_button">
      <SelectorPlan selectedPlan={planSelected} setSelectedPlan={setPlanSelected}/>
      <div className="w-full flex flex-col overflow-x-clip lg:flex-row md:items-center gap-y-5 relative py-4 md:py-10 font_Archivo_bold">
        {planSelected === 'facebook ads' && (<PlanesFacebook/>)}
        {planSelected === 'google ads' && (<PlanesGoogle/>)}
        {planSelected === 'pasarelas de pago' && (<PlanesPasarelas/>)}
        {planSelected === 'redes sociales' && (<PlanesRedes/>)}

        {/* <Modals open={open} setOpen={setOpen} selected={selected} /> */}
      </div>
    </section>
  )
}
