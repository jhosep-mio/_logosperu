/* eslint-disable @next/next/no-img-element */
'use client'
import { PlanesFacebook } from '@/public/components/servicios/capacitaciones/planes/PlanesFacebook'
import { PlanesGoogle } from '@/public/components/servicios/capacitaciones/planes/PlanesGoogle'
import { PlanesPasarelas } from '@/public/components/servicios/capacitaciones/planes/PlanesPasarelas'
import SwiperPlanes from '@/public/components/servicios/diseno_grafico/planes/SwiperPlanes'
import Dialog from '@mui/material/Dialog'
import React, { useEffect, useState } from 'react'
import { Planes } from '../../community_manager/components/Planes'

export const ButtonPlanes = ({ parametro }: any) => {
  const [open, setOpen] = useState(false)
  const [servicio, setServicio] = useState('')
  useEffect(() => {
    if (parametro === 'Diseño grafico') {
      setServicio('Diseño de logotipo')
    } else if (parametro == 'Desarrollo web') {
      setServicio('Diseño web informativo')
    } else {
      setServicio('')
    }
  }, [parametro])
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="fixed z-[999] flex  items-center justify-center gap-2 bottom-3 md:bottom-6 right-4 w-[50px] h-[50px] lg:h-fit lg:w-fit md:left-auto md:right-6  bg-[#06D7A0]  text-white font-light px-2 lg:px-6 py-2 rounded-full uppercase transition-all hover:bg-[#06d79fc5] shadow shadow-[#06D7A0]"
        rel="noreferrer"
      >
        <img
          src="https://intranet.logosperu.com.pe//assets/icono-9506ee97.png"
          alt=""
          className="w-[24px] bg-black rounded-full p-[2px] h-[24px] text-gray-400 group-hover:text-main transition-colors"
        />
        <span className="hidden lg:block text-black font-bold">
          {parametro == 'Diseño grafico'
            ? 'Planes de diseño'
            : parametro == 'Community manager'
              ? 'Planes de Community Manager'
              : parametro == 'capacitacion pasarela de pago'
                ? 'Planes de capacitacion Pasarela de pago'
                : parametro == 'capacitacion google'
                  ? 'Planes de capacitacion Google Ads'
                  : parametro == 'capacitacion facebook'
                    ? 'Planes de capacitacion Facebook Ads'
                    : parametro == 'Desarrollo web'
                      ? 'Planes de desarrollo'
                      : ''}
        </span>
      </button>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xl"
        className="swiper_planes_logo_modal"
      >
        <div className="w-full flex flex-col">
          {parametro === 'Diseño grafico' ? (
            <div className="w-full px-4 flex justify-center items-center gap-4">
              <button
                className="w-fit px-4 bg-main my-2 py-2 rounded-xl font-bold text-black"
                type="button"
                onClick={() => setServicio('Diseño de logotipo')}
              >
                Diseño de logotipo
              </button>
              <button
                className="w-fit px-4 bg-main my-2 py-2 rounded-xl font-bold text-black"
                type="button"
                onClick={() => setServicio('Diseño de brochure')}
              >
                Diseño de brochure
              </button>
              <button
                className="w-fit px-4 bg-main my-2 py-2 rounded-xl font-bold text-black"
                type="button"
                onClick={() => setServicio('Manual de marca')}
              >
                Manual de marca
              </button>
              <button
                type="button"
                onClick={() => setServicio('Diseño de flyers')}
                className="w-fit px-4 bg-main my-2 py-2 rounded-xl font-bold text-black"
              >
                Diseño de flyers
              </button>
            </div>
          ) : (
            parametro === 'Desarrollo web' && (
              <div className="w-full px-4 flex justify-center items-center gap-4">
                <button
                  className="w-fit px-4 bg-main my-2 py-2 rounded-xl font-bold text-black"
                  type="button"
                  onClick={() => setServicio('Diseño web informativo')}
                >
                  Desarrollo web Informativo
                </button>
                <button
                  className="w-fit px-4 bg-main my-2 py-2 rounded-xl font-bold text-black"
                  type="button"
                  onClick={() => setServicio('Desarrollo web administrable')}
                >
                  Desarrollo web administrable
                </button>
                <button
                  className="w-fit px-4 bg-main my-2 py-2 rounded-xl font-bold text-black"
                  type="button"
                  onClick={() => setServicio('Desarrollo web landingpage')}
                >
                  Desarrollo web Landing Page
                </button>
              </div>
            )
          )}

          {parametro == 'Community manager' ? (
            <section className="w-full ">
              <Planes />
            </section>
          ) : parametro == 'capacitacion google' ? (
            <PlanesGoogle />
          ) : parametro == 'capacitacion pasarela de pago' ? (
            <PlanesPasarelas />
          ) : parametro == 'capacitacion facebook' ? (
            <PlanesFacebook />
          ) : (
            <SwiperPlanes servicio={servicio} />
          )}
        </div>
      </Dialog>
    </>
  )
}
