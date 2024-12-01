'use client'
import React from 'react'
import { ArcherContainer, ArcherElement } from 'react-archer'

export default function Connect ({
  imagen1,
  imagen2,
  imagen3,
  imagen4,
  imagen5,
  titulo1,
  titulo2,
  titulo3,
  titulo4,
  titulo5
}: {
  imagen1: string;
  imagen2: string;
  imagen3: string;
  imagen4?: string;
  imagen5?: string;
  titulo1: string;
  titulo2: string;
  titulo3: string;
  titulo4?: string;
  titulo5?: string;
}) {
  return (
    <ArcherContainer strokeColor="#06D7A0" strokeWidth={2} endMarker={false}>
      <div className="w-full flex flex-col gap-6 relative z-50">
        {/* Primer picture conectado */}
        <div className="w-full flex mb-8 items-center gap-2 pl-8 relative">
          <ArcherElement
            id="picture1"
            relations={[
              {
                targetId: 'picture2',
                targetAnchor: 'top',
                sourceAnchor: 'bottom'
              }
            ]}
          >
            <picture className="flex flex-col w-fit relative before:absolute before:rounded-full before:border-dashed before:w-[135px] before:h-[135px] before:border-2 before:inset-0 before:-left-2 before:-right-2 before:m-auto before:transition-all before:duration-200 before:border-transparent duration-200 hover:before:border-main hover:before:animate-spin">
              <img src={imagen1} alt="" width={120} />
            </picture>
          </ArcherElement>
          <p className="text-white w-fit text-sm text-center min-w-[120px]">
            {titulo1}
          </p>
        </div>

        {/* Segundo picture conectado */}
        <div className="w-full flex mt-12 items-center pr-10 gap-2 justify-end">
          <p className="text-white w-fit text-sm text-center min-w-[120px]">
            {titulo2}
          </p>
          <ArcherElement
            id="picture2"
            relations={[
              {
                targetId: 'picture3',
                targetAnchor: 'top',
                sourceAnchor: 'bottom'
              }
            ]}
          >
            <picture className="flex flex-col w-fit relative before:absolute before:rounded-full before:border-dashed before:w-[135px] before:h-[135px] before:border-2 before:inset-0 before:-left-2 before:-right-2 before:m-auto before:transition-all before:duration-200 before:border-transparent duration-200 hover:before:border-main hover:before:animate-spin">
              <img src={imagen2} alt="" width={120} />
            </picture>
          </ArcherElement>
        </div>

        {/* Tercer picture conectado */}
        <div className={`w-full flex ${titulo4 ? 'flex-row-reverse justify-center items-center' : 'flex-col items-center justify-center'}   mt-20 sm:mt-6 gap-2 `}>
          <ArcherElement
            id="picture3"
            relations={[
              {
                targetId: 'picture4',
                targetAnchor: 'top',
                sourceAnchor: 'bottom'
              }
            ]}
          >
            <picture className="flex flex-col w-fit relative before:absolute before:rounded-full before:border-dashed before:w-[135px] before:h-[135px] before:border-2 before:inset-0 before:-left-2 before:-right-2 before:m-auto before:transition-all before:duration-200 before:border-transparent duration-200 hover:before:border-main hover:before:animate-spin">
              <img src={imagen3} alt="" width={120} />
            </picture>
          </ArcherElement>
          <p className="text-white w-fit text-sm text-center max-w-[120px]">
            {titulo3}
          </p>
        </div>

        {titulo4 && imagen4 && (
          <div className={`w-full flex ${titulo5 ? 'flex-row items-center' : 'flex-col justify-center'}  mt-20 sm:mt-6 gap-2 `}>
            <ArcherElement
              id="picture4"
              relations={[
                {
                  targetId: 'picture5',
                  targetAnchor: 'top',
                  sourceAnchor: 'bottom'
                }
              ]}
            >
              <picture className="flex flex-col w-fit relative before:absolute before:rounded-full before:border-dashed before:w-[135px] before:h-[135px] before:border-2 before:inset-0 before:-left-2 before:-right-2 before:m-auto before:transition-all before:duration-200 before:border-transparent duration-200 hover:before:border-main hover:before:animate-spin">
                <img src={imagen4} alt="" width={120} />
              </picture>
            </ArcherElement>
            <p className="text-white w-fit text-sm text-center min-w-[120px]">
              {titulo4}
            </p>
          </div>
        )}

        {titulo5 && imagen5 && (
          <div className="w-full flex flex-col items-center mt-20 sm:mt-6 gap-2 justify-center">
            <ArcherElement id="picture5">
              <picture className="flex flex-col w-fit relative before:absolute before:rounded-full before:border-dashed before:w-[135px] before:h-[135px] before:border-2 before:inset-0 before:-left-2 before:-right-2 before:m-auto before:transition-all before:duration-200 before:border-transparent duration-200 hover:before:border-main hover:before:animate-spin">
                <img src={imagen5} alt="" width={120} />
              </picture>
            </ArcherElement>
            <p className="text-white w-fit text-sm text-center min-w-[120px]">
              {titulo5}
            </p>
          </div>
        )}
      </div>
    </ArcherContainer>
  )
}
