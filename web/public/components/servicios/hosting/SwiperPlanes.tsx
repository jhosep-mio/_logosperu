'use client'
import React, { useState } from 'react'
import { SelectorPlan } from '@/public/components/servicios/hosting/SelectorPlan'
import { PlanesEmpresariales } from '@/public/components/servicios/hosting/Planes/PlanesEmpresariales'
import { PlanesPersonales } from './Planes/PlanesPersonales'
import { PlanesCorporativos } from './Planes/PlanesCorporativos'

export const SwiperPlanes = () => {
  const [planSelected, setPlanSelected] = useState('personal')
  return (
    <section className="max-w-6xl mx-auto relative " id="swiper_button">
      <SelectorPlan selectedPlan={planSelected} setSelectedPlan={setPlanSelected}/>
      <div className="w-full flex flex-col overflow-x-clip lg:flex-row md:items-center gap-y-5 relative py-4 md:py-10 font_Archivo_bold">
        {planSelected === 'personal' && (<PlanesPersonales/>)}
        {planSelected === 'empresarial' && (<PlanesEmpresariales/>)}
        {planSelected === 'corporativo' && (<PlanesCorporativos/>)}

        {/* <Modals open={open} setOpen={setOpen} selected={selected} /> */}
      </div>
    </section>
  )
}
