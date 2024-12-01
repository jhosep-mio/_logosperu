'use client'
import React, { useState } from 'react'
import { CiFaceFrown, CiFaceMeh, CiFaceSmile } from 'react-icons/ci'
import { IoHappyOutline } from 'react-icons/io5'

export const SelectFace = () => {
  const [select, setSelect] = useState(0)
  return (
    <>
      <div className="flex gap-4 w-full my-6 text-5xl justify-center">
        <CiFaceFrown
          onClick={() => setSelect(1)}
          className={`${select == 1 ? 'bg-main shadow-md shadow-main' : ''} rounded-full  transition-colors cursor-pointer`}
        />
        <CiFaceMeh
          onClick={() => setSelect(2)}
          className={`${select == 2 ? 'bg-main shadow-md shadow-main' : ''} rounded-full  transition-colors cursor-pointer`}
        />
        <CiFaceSmile
          onClick={() => setSelect(3)}
          className={`${select == 3 ? 'bg-main shadow-md shadow-main' : ''} rounded-full  transition-colors cursor-pointer`}
        />
        <IoHappyOutline
          onClick={() => setSelect(4)}
          className={`${select == 4 ? 'bg-main shadow-md shadow-main' : ''} rounded-full  transition-colors cursor-pointer`}
        />
      </div>
      <div className='flex justify-center '>
        <button className="mt-4 bg-black hover:bg-darKmain text-white py-2 px-4 w-[300px] rounded-full mx-auto transition-colors">
          {' '}
          Calificar{' '}
        </button>
      </div>
    </>
  )
}
