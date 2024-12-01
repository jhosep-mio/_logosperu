'use client'
/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'

export const Gatitos = () => {
  const [positionGatito, setPositionGatito] = useState(0)
  const gatitos = ['/assets/images/mixelito/mixelito1.png', '/assets/images/mixelito/mixelito2.png', '/assets/images/mixelito/mixelito3.png']
  return (
    <button className='mx-auto' onClick={() => { setPositionGatito(positionGatito === 2 ? 0 : positionGatito + 1) }}>
        <img src={gatitos[positionGatito]} alt="" className='object-contain object-bottom block mx-auto w-full md:w-[400px] h-[400px] transition-all' />

    </button>
  )
}
