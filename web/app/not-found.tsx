/* eslint-disable @next/next/no-img-element */
'use client'
import { generateMetadata } from '@/public/components/seo/SeoList'
import { Footer } from '@/public/components/web/structure/Footer'
import { Header } from '@/public/components/web/structure/Header'
import Link from 'next/link'
import React from 'react'
export const metadata = generateMetadata()
export default function notfound () {
  return (
    <>
      <Header />
      <section className="degraded_main relative z-10 h-fit w-full pt-[128px] before:absolute before:left-0 before:top-0 before:-z-10 before:h-full before:w-full before:bg-[url(/assets/images/home/huellitas.gif)] before:bg-cover before:opacity-30 lg:h-screen">
        <div className="altura_header mx-auto flex h-full w-full max-w-7xl flex-col items-center gap-8 pb-5 pt-20 lg:flex-row lg:pb-0">
          <div className="h-fit w-full px-8 lg:w-1/2">
            <h5 className="font_allRound text-center text-5xl font-bold text-white lg:text-left lg:text-6xl xl:text-7xl">
              Página no <span className="text-main">encontrada</span>
            </h5>
            <p className="mt-8 text-center text-lg text-white lg:text-left lg:text-xl">
              No podemos mostrar la página que solicitaste.
            </p>
            <Link
              href={'/'}
              className="mx-auto mt-10 flex w-fit rounded-lg bg-main px-8 py-2 text-center text-lg font-semibold text-azul_serio transition-all hover:bg-darKmain lg:mx-0 lg:text-xl"
            >
              Regresar al inicio
            </Link>
            <ul className="mt-12 flex flex-wrap gap-4">
              <li className="flex w-[30%] justify-center lg:w-fit lg:justify-start">
                <Link className="text-center font-light text-white/90 hover:underline" href={'/'}>
                  Home
                </Link>
              </li>
              <li className="flex w-[30%] justify-center lg:w-fit lg:justify-start">
                <Link className="text-center font-light text-white/90 hover:underline" href={'/diseno_grafico'}>
                  Diseño gráfico
                </Link>
              </li>
              <li className="flex w-[30%] justify-center lg:w-fit lg:justify-start">
                <Link className="text-center text-white/90 hover:underline" href={'/desarrollo_web'}>
                  Desarrollo web
                </Link>
              </li>
              <li className="flex w-[30%] justify-center lg:w-[42%] lg:justify-start">
                <Link className="text-center text-white/90 hover:underline" href={'/comunity_manager'}>
                  Community Manager
                </Link>
              </li>
              <li className="flex w-[30%] justify-center lg:w-fit lg:justify-start">
                <Link className="text-center text-white/90 hover:underline" href={'/hosting'}>
                  Hosting
                </Link>
              </li>
              <li className="flex w-[30%] justify-center lg:w-[32.5%] lg:justify-start">
                <Link className="text-center text-white/90 hover:underline" href={'/capacitaciones'}>
                  Capacitaciones
                </Link>
              </li>
            </ul>
          </div>
          <div className="flex h-fit w-full justify-center lg:w-1/2">
            <img
              src="/assets/images/servicios/diseno_grafico/gatoperfil.gif"
              alt=""
              className="espejo h-[450px] border-b border-white/40"
            />
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
