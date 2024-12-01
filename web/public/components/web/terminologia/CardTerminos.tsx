import React, { ReactNode } from 'react'
interface CardTerminosProps {
    title: string;
    selected: boolean
    children: ReactNode;
    onClick: (title: string, content: string) => void;
  }
export const CardTerminos = ({ title, children, selected, onClick }: CardTerminosProps) => {
  const handleClick = () => {
    // @ts-ignore
    onClick(title, children) // Llama a la función de clic pasando el título y el contenido
  }
  return (

    <>
      <div onClick={handleClick} id={title.toLowerCase()} className={`flex flex-col h-full fondoCards cursor-pointer rounded-md group border-8 overflow-hidden bg-white  hover:border-main transition-all ${selected ? ' border-main' : ''}`}>
          <h5 className={`font_Archivo_bold text-xl line-clamp-1 px-4 py-3 xl:py-4 text-white text-center transition-all group-hover:bg-main  group-hover:text-[#252525]  cursor-pointer ${selected ? 'bg-main' : 'bg-azul_serio'}`}>{title}</h5>
          <p className="font_Archivo text-justify px-4 py-2 text-lg h-full">
              {children}
          </p>
      </div>

    </>
  )
}
