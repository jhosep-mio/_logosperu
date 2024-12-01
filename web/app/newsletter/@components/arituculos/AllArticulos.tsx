/* eslint-disable @next/next/no-img-element */
'use client'
/* eslint-disable react-hooks/exhaustive-deps */
import React, { Fragment, useEffect, useRef, useState } from 'react'
import { Skeleton } from '@mui/material'
import { FiDownload } from 'react-icons/fi'
import FormatoFecha from '../generales/FormatFecha'
import { Global } from '@/helper/Global'
import Link from 'next/link'
export const AllArticulos = ({ initialProductos, totalProductos }: any) => {
  const mesesDelAnio = [
    'enero',
    'febrero',
    'marzo',
    'abril',
    'mayo',
    'junio',
    'julio',
    'agosto',
    'septiembre',
    'octubre',
    'noviembre',
    'diciembre'
  ]
  const [productos, setProductos] = useState<any>(initialProductos)
  const [loading, setLoading] = useState(false)
  const hoy = new Date()
  const dia = hoy.toLocaleDateString('es-ES', { weekday: 'long' })
  const mesActual = mesesDelAnio[hoy.getMonth()]
  const diaActual = String(hoy.getDate()).padStart(2, '0')
  const [offset, setOffset] = useState<number>(initialProductos.length)

  const loadMoreProducts = async () => {
    if (loading || offset >= totalProductos) return
    setLoading(true)
    try {
      const response = await fetch(
        `${Global.url}/newsletter/getAllArticulosPublic?offset=${offset}&limit=12`
      )
      if (!response.ok) {
        throw new Error('Network response was not ok')
      }
      const newProducts = await response.json()
      setProductos((prev: any) => [...prev, ...newProducts])
      setOffset((prev) => prev + newProducts.length)
    } catch (error) {
      console.error('Fetch error: ', error)
    } finally {
      setLoading(false)
    }
  }

  const loadMoreRef = useRef<HTMLDivElement | null>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadMoreProducts()
        }
      },
      { threshold: 1.0 }
    )

    const currentRef = loadMoreRef.current
    if (currentRef) {
      observer.observe(currentRef)
    }
    return () => {
      if (currentRef) {
        observer.unobserve(currentRef)
      }
    }
  }, [loadMoreRef, loading, offset])

  return (
    <div
      className={
        'px-0 lg:px-8 pt-4 2xl:px-10 col-span-1 lg:col-span-5 lg:py-10 w-full grid grid-cols-2 lg:grid-cols-3 gap-x-10 lg:border-r-2 border-gris'
      }
    >
      {productos.length === 0 && !loading && (
        <p>No hay artículos disponibles.</p>
      )}
      {productos.map((producto: any, index: number) => {
        const contador = (index % 6) + 1
        if (contador == 1) {
          return (
            <section key={index} className="col-span-2 lg:col-span-3">
              {index != 0 && contador == 1 && (
                <span className="block h-[1px] lg:h-[2px] bg-[#8c8c8c] my-10"></span>
              )}
              {contador == 1 && (
                <>
                  {index == 0 && (
                    <>
                      <div className="w-full flex justify-between items-center px-4 lg:px-0">
                        <h3 className="font-SpartanMedium text-gray-600 text-lg lg:text-xl first-letter:uppercase">
                          {dia},
                        </h3>
                        {/* <button className="flex items-center gap-2 font-SpartanMedium text-gray-600 text-xs border-2 border-gray-600 px-4 py-1 rounded-full">
                          New <FaAngleDown className="text-sm text-gray-600" />
                        </button> */}
                      </div>
                      <div className="mt-4 mb-4 px-4 lg:px-0">
                        <h2 className="text-3xl lg:text-5xl font-ysobel_regular tracking-wider first-letter:uppercase">
                          {mesActual} {diaActual}
                        </h2>
                      </div>
                    </>
                  )}
                  <div className=" w-full relative">
                    <Skeleton
                      variant="rectangular"
                      className="h-full object-cover w-full absolute inset-0"
                    />
                    <img
                      src={`https://mysistemalogosperu.s3.amazonaws.com/articulos/${producto.imagen1}`}
                      alt={producto.titulo}
                      className="object-contain h-full  w-full relative z-30"
                    />
                  </div>
                  <div className="flex items-center mt-4 px-4 lg:px-0">
                    <div className="w-full flex justify-between items-center">
                      <div className="flex items-center gap-3">
                        <div className="bg-white border border-gray-300 p-1 rounded-full h-10 w-10">
                            <img src="/assets/images/logos/logo.webp" alt="" />
                        </div>
                        <h3 className="font-SpartanMedium">Logos Perú</h3>
                      </div>
                      <div className="flex gap-4">
                        <FiDownload className="rotate-180 text-gray-600 text-xl" />
                        <FiDownload className=" text-gray-600 text-xl" />
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-4 text-gray-600 mt-4 text-xs px-4 lg:px-0">
                    <FormatoFecha fechaISO={producto.created_at} />
                  </div>
                  <h2 className="text-black text-3xl lg:text-4xl mt-4 font-semibold px-4 lg:px-0">
                    {producto.titulo}
                  </h2>
                  <div className="mt-4 text-gray-600 px-4 lg:px-0 text-justify lg:text-start">
                    <div
                      className="line-clamp-[9] forzar_letra_newsletter"
                      dangerouslySetInnerHTML={{
                        __html: JSON.parse(producto.contenido)
                      }}
                    />
                  </div>
                  <div className="px-4 lg:px-0">
                    <Link
                      href={`/newsletter/${producto.url_categoria}/${producto.url}`}
                      className="mt-6 block text-center border-2 w-full py-2 px-4 rounded-full border-[#8c8c8c] hover:bg-[#8c8c8c] transition-colors hover:text-white"
                    >
                      Leer más
                    </Link>
                  </div>
                  <span className="block h-[1px] lg:h-[2px] bg-[#8c8c8c] my-10"></span>
                </>
              )}
            </section>
          )
        } else if (contador == 2) {
          return (
            <Link href={`/newsletter/${producto.url_categoria}/${producto.url}`} className="flex w-full flex-col text-xs col-span-2 lg:col-span-1" key={index}>
              <div className="text-xs text-gray-600 px-4 lg:px-0">
                <FormatoFecha fechaISO={producto.created_at} />
                <h3 className="text-black font-semibold text-lg text-justify line-clamp-3">
                  {producto.titulo}{' '}
                </h3>
              </div>
              <img
                src={`https://mysistemalogosperu.s3.amazonaws.com/articulos/${producto.imagen1}`}
                alt={producto.titulo}
                className="h-full object-cover w-full mt-4"
              />
            </Link>
          )
        } else if (contador == 3) {
          return (
            <Link href={`/newsletter/${producto.url_categoria}/${producto.url}`} className="flex w-full flex-col text-xs mt-4 lg:mt-0" key={index}>
              <div className="text-xs text-gray-600 px-4 lg:px-0">
                <FormatoFecha fechaISO={producto.created_at} />
                <h3 className="text-black font-semibold text-lg text-justify line-clamp-3">
                  {producto.titulo}{' '}
                  {/* Assuming the same producto is displayed for both 2 and 3 */}
                </h3>
              </div>
              <img
                src={`https://mysistemalogosperu.s3.amazonaws.com/articulos/${producto.imagen1}`}
                alt={producto.titulo}
                className="h-full object-cover w-full mt-4"
              />
            </Link>
          )
        } else if (contador == 4) {
          return (
            <Link href={`/newsletter/${producto.url_categoria}/${producto.url}`} className="flex w-full flex-col text-xs mt-4 lg:mt-0" key={index}>
              <div className="text-xs text-gray-600 px-4 lg:px-0">
                <FormatoFecha fechaISO={producto.created_at} />
                <h3 className="text-black font-semibold text-lg text-justify line-clamp-3">
                  {producto.titulo}{' '}
                  {/* Assuming the same producto is displayed for both 2 and 3 */}
                </h3>
              </div>
              <img
                src={`https://mysistemalogosperu.s3.amazonaws.com/articulos/${producto.imagen1}`}
                alt={producto.titulo}
                className="h-full object-cover w-full mt-4"
              />
            </Link>
          )
        } else if (contador == 5) {
          return (
            <Fragment key={index}>
              <span className="block h-[1px] lg:h-[2px] bg-[#8c8c8c] col-span-2 lg:col-span-3 mt-10"></span>
              <Link href={`/newsletter/${producto.url_categoria}/${producto.url}`} className="flex w-full mt-6 lg:mt-10 justify-between items-center col-span-2 lg:col-span-3 lg:items-start text-xs px-4 lg:px-0">
                <div className="text-xs text-gray-600 w-2/3 lg:w-1/2">
                  <FormatoFecha fechaISO={producto.created_at} />
                  <h3 className="text-black font-semibold text-lg">
                    {producto.titulo}
                  </h3>
                </div>
                <img
                  src={`https://mysistemalogosperu.s3.amazonaws.com/articulos/${producto.imagen1}`}
                  alt={producto.titulo}
                  className="h-[70px] object-cover object-center w-fit "
                />
              </Link>
            </Fragment>
          )
        } else if (contador == 6) {
          return (
            <Fragment key={index}>
              <Link href={`/newsletter/${producto.url_categoria}/${producto.url}`} className="flex w-full mt-6 lg:mt-10 justify-between items-center col-span-2 lg:col-span-3 lg:items-start text-xs px-4 lg:px-0">
                <div className="text-xs text-gray-600 w-2/3 lg:w-1/2">
                  <FormatoFecha fechaISO={producto.created_at} />
                  <h3 className="text-black font-semibold text-lg">
                    {producto.titulo}
                  </h3>
                </div>
                <img
                  src={`https://mysistemalogosperu.s3.amazonaws.com/articulos/${producto.imagen1}`}
                  alt={producto.titulo}
                  className="h-[70px] object-cover object-center w-fit "
                />
              </Link>
            </Fragment>
          )
        } else return null
      })}
      {loading && (
        <section className="w-full flex justify-center items-center h-[30px] col-span-2">
          <div className="dot-spinner">
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
            <div className="dot-spinner__dot"></div>
          </div>
        </section>
      )}
      <div ref={loadMoreRef} className="" />
    </div>
  )
}
