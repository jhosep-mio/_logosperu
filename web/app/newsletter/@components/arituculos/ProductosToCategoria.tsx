/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import React, { Fragment } from 'react'
import FormatoFecha from '../generales/FormatFecha'
export const ProductosToCategoria = ({ articulos }: any) => {
  return (
    <>
      <div className="col-span-2 p-8 2xl:p-10 hidden lg:block border-r-2 border-gris">
        {articulos?.map((categoria: any) => (
          <Fragment key={categoria.id}>
            <div className="w-full flex justify-between items-center">
              <h3 className="font-SpartanMedium text-gray-600 text-xl lowercase first-letter:uppercase">
                {categoria.categoria}
              </h3>
              <Link
                href={`/newsletter/${categoria.url_categoria}`}
                className="flex items-center gap-2 font-SpartanMedium text-gray-600 text-xs border-2 border-gray-600 px-4 py-1 rounded-full"
              >
                Ver todo
              </Link>
            </div>
            {categoria?.articulos?.map((articulo: any) => (
              <Fragment key={articulo.id}>
                <Link
                  href={`/newsletter/${categoria.url_categoria}/${articulo.url}`}
                  className="flex w-full flex-col gap-2 mt-10"
                >
                  <h3 className="text-black font-semibold text-lg leading-5 line-clamp-3">
                    {articulo.titulo}
                  </h3>
                  <p className='text-sm'>
                    <FormatoFecha fechaISO={articulo.created_at} />
                  </p>
                </Link>
                <span className="block h-[2px] bg-[#8c8c8c] my-6"></span>
              </Fragment>
            ))}
            <a
              href="https://wa.me//+51987038024?text=Hola, estoy interesado en sus servicios."
              target="_blank"
              rel="noreferrer"
            >
              <img
                src="/assets/images/newsletter/anuncio5.webp"
                alt="Logos Perú"
                className="my-6"
              />
            </a>
          </Fragment>
        ))}
      </div>
    </>
  )
}
