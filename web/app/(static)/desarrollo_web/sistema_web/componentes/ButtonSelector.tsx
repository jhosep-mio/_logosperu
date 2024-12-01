import React from 'react'

export const ButtonSelector = ({
  title,
  procesoActivo,
  setProcesoActivo
}: {
  title: string;
  procesoActivo: string;
  setProcesoActivo: any;
}) => {
  return (
    <button
      type="button"
      id={procesoActivo}
      onClick={() => {
        setProcesoActivo(title)
      }}
      className={`w-full px-3 py-1 border ${
        procesoActivo === title
          ? 'bg-main text-nigga border-main'
          : ' border-white text-white'
      }  rounded-md  text-base transition-all hover:border-main `}
    >
      {title}
    </button>
  )
}
