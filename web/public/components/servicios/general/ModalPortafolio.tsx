/* eslint-disable @next/next/no-img-element */
/* eslint-disable react/jsx-key */
'use client'

import React from 'react'
import { Dialog, DialogContent } from '@mui/material'

type Image = {
  src: string;
  title: string;
};

type ModalPortafolioProps = {
  servicio: string;
  open: boolean;
  setOpen: (open: boolean) => void;
};

export const ModalPortafolio: React.FC<ModalPortafolioProps> = ({
  servicio,
  open,
  setOpen
}) => {
  const imagesDiseno: Image[] = [
    { src: '/assets/images/portafolio/grafico.webp', title: '' },
    { src: '/assets/images/portafolio/grafico.webp', title: '' },
    { src: '/assets/images/portafolio/grafico.webp', title: '' }
  ]

  const imagesBrochure: Image[] = [
    { src: '/assets/images/servicios/brochure/brochure1.webp', title: '' },
    { src: '/assets/images/servicios/brochure/brochure2.webp', title: '' },
    { src: '/assets/images/servicios/brochure/brochure3.webp', title: '' }
  ]

  const imagesIdentidad: Image[] = [
    {
      src: '/assets/images/servicios/identidad/identidad1.webp',
      title: 'Folder corporativo'
    },
    {
      src: '/assets/images/servicios/identidad/identidad2.webp',
      title: 'Tarjeta de presentacion'
    },
    {
      src: '/assets/images/servicios/identidad/identidad3.webp',
      title: 'Fotocheck'
    }
  ]

  const imagesManual: Image[] = [
    { src: '/assets/images/portafolio/community.webp', title: '' },
    { src: '/assets/images/portafolio/community.webp', title: '' },
    { src: '/assets/images/portafolio/community.webp', title: '' }
  ]

  const imagesFlyer: Image[] = [
    { src: '/assets/images/portafolio/hosting.webp', title: '' },
    { src: '/assets/images/portafolio/hosting.webp', title: '' },
    { src: '/assets/images/portafolio/hosting.webp', title: '' }
  ]

  const imagesPersonaje: Image[] = [
    {
      src: '/assets/images/servicios/diseno_personajes/personaje1.jpg',
      title: ''
    },
    {
      src: '/assets/images/servicios/diseno_personajes/personaje2.jpg',
      title: ''
    }
  ]

  const imageMap: { [key: string]: Image[] } = {
    diseno: imagesDiseno,
    brochure: imagesBrochure,
    identidad: imagesIdentidad,
    manual: imagesManual,
    flyer: imagesFlyer,
    personaje: imagesPersonaje
  }

  const titleMap: { [key: string]: string } = {
    diseno: 'Diseño de Logotipos',
    brochure: 'Diseño de Brochure',
    identidad: 'Identidad Corporativa',
    manual: 'Manual de Marca',
    flyer: 'Diseño de Flyer',
    personaje: 'Diseño de personaje'
  }
  const imagenesPortafolio: Image[] = imageMap[servicio] || []
  const title: string = titleMap[servicio] || ''

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="xl"
      className="swiper_planes_logo_modal"
    >
      <DialogContent className="w-full " onClick={(e) => e.stopPropagation()}>
        <div className="w-full relative">
          <h2 className="text-3xl md:text-4xl lg:text-5xl mb-5 text-center text-main shadow-lg font-bold uppercase">
            {title}
          </h2>
          <button onClick={() => { setOpen(false) }} type="button" className='text-xl underline absolute right-6 top-0 bottom-0 my-auto text-white'>Cerrar</button>

        </div>
        <hr className="rounded-2xl bg-main h-[8px] w-[200px] mb-10 block mx-auto" />
        <div
          className={`bg-white p-6  rounded-xl w-full grid grid-cols-1 md:grid-cols-2 lg:${servicio === 'personaje' ? 'grid-cols-2' : 'grid-cols-3'} gap-5`}
        >
          {imagenesPortafolio.map((image, index) => (
            <div className={`flex flex-col ${image.title ? 'mb-3' : ''}`}>
              {image.title && (
                <h5 className="mt-4 mb-8 font-bold text-center text-2xl text-main ">
                  {image.title}
                </h5>
              )}

              <img
                src={image.src}
                key={index}
                alt="Logos Perú"
                className={`block w-full object-top object-contain ${servicio === 'personaje' ? 'h-[250px] md:h-[450px]' : ''}`}
              />
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
