import React from 'react'

export const Titulon = ({ letra }: { letra: string }) => {
  return (
    <span
      className={`block cursor-default select-none transition-all ease-out duration-200 hover:-translate-y-4 ${
        letra === '.' ? 'text-transparent' : ''
      }`}
    >
      {letra}
    </span>
  )
}
