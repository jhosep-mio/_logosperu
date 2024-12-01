'use client'

import React, { useState } from 'react'
import { SelectorInfo } from '@/public/components/servicios/capacitaciones/SelectorInfo'
import { InfoCapacitaciones } from '@/public/components/servicios/capacitaciones/InfoCapacitaciones'

export const SelectorGeneral = () => {
  const [infoSelected, setInfoSelected] = useState('facebook')

  return (
    <>
      <div className="max-w-5xl mx-auto  w-full flex flex-col lg:flex-row items-center gap-8 min-h-[600px]">
        <div className="w-full lg:w-1/2">
          {/* <p className="text-xl text-white mb-6 font-bold">Selecciona un tipo de capacitación para ver que incluye:</p> */}
          <ul className="pl-6 text-white text-4xl font-bold flex flex-col gap-4">
            <SelectorInfo
              selectedInfo={infoSelected}
              setSelectedInfo={setInfoSelected}
            />
          </ul>
        </div>
        <div className="w-full lg:w-1/2 relative  before:absolute before:left-[85%]  before:top-0 before:bottom-0 before:-z-20 before:my-auto before:h-full before:w-[350px] before:bg-[url(/assets/images/home/gatito.gif)] before:bg-contain before:bg-no-repeat espejoBefore before:rotate-[70deg] before:bg-left">
          <InfoCapacitaciones selectedInfo={infoSelected} />
        </div>
      </div>
    </>
  )
}
