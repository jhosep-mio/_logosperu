/* eslint-disable camelcase */
/* eslint-disable array-callback-return */
/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { Global } from '@/helper/Global'
import { Suspense } from 'react'
import Loading from '../loading'
import { ProductosToCategoria } from '../@components/arituculos/ProductosToCategoria'
import { AnuncioCelBottom } from '../@components/AnuncioCelBottom'
import { AllArticulosOnCategory } from '../@components/arituculos/AllArticulosOnCategory'
import { generateMetadata } from '@/public/components/seo/SeoNesletter'

export const metadata = generateMetadata()

export default async function Newsletter ({ params }: any) {
  const { name_category } = params
  // Realiza la recuperación de datos en el servidor
  const categoriasRes = await fetch(
    `${Global.url}/newsletter/getAllCategoriasPublicOnCategory/${name_category}`,
    { cache: 'no-store' }
  )

  const productosRes = await fetch(
    `${Global.url}/newsletter/getAllArticulosPublicInitialOnCategory/${name_category}`,
    { cache: 'no-store' }
  )

  const getAllArticulosPublicSection = await fetch(
    `${Global.url}/newsletter/getAllArticulosPublicSectionOnCategory/${name_category}`,
    { cache: 'no-store' }
  )

  if (!categoriasRes.ok || !productosRes.ok) {
    return (
      <section className="flex pt-[80px] lg:pt-[110px] relative ">
        <p className="text-black">Error al cargar los datos.</p>
      </section>
    )
  }
  const categorias = await categoriasRes.json()
  const { data: articulosRigth } = await getAllArticulosPublicSection.json()
  const { total, data } = await productosRes.json()

  return (
    <section className="flex pt-24 relative max-w-[1700px] mx-auto">
      <a
        href="https://wa.me//+51987038024?text=Hola, estoy interesado en sus servicios."
        className="w-[140px] 2xl:w-[190px] h-[calc(100vh-6rem)] sticky left-0 top-24 z-[10] hidden lg:block"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src="/assets/images/newsletter/anuncio1.webp"
          alt="Logos Perú"
          className="w-full h-full object-contain object-right-top "
        />
      </a>
      <section className="w-full grid grid-cols-1 lg:grid-cols-8 flex-1 relative bg-white">
        <a
          href="https://wa.me//+51987038024?text=Hola, estoy interesado en sus servicios."
          className="cursor-pointer w-full object-cover lg:hidden"
          target="_blank"
          rel="noreferrer"
        >
          <img
            src="/assets/images/newsletter/anuncio3.webp"
            alt="Logos Perú"
            className="h-[100px] w-full object-cover lg:hidden"
          />
        </a>
        <div className="w-fulll col-span-1 border-r-2 border-l-2 border-gris h-full p-8 2xl:p-10 hidden lg:block">
          <Link
            href="/newsletter"
            className="text-3xl border-b-2 border-b-gray-500 w-fit font-ysobel_regular"
          >
            Todos
          </Link>
          <div className="mt-6 font-ysobel_regular flex flex-col gap-3 text-gray-600">
            {categorias?.map((categoria: any) => (
              <Link
                href={`/newsletter/${categoria.url}`}
                key={categoria.url}
                className="lowercase first-letter:uppercase"
              >
                {categoria.titulo}
              </Link>
            ))}
          </div>
        </div>
        <Suspense fallback={<Loading />}>
          <AllArticulosOnCategory
            initialProductos={data}
            totalProductos={total}
            name_category={name_category}
          />
        </Suspense>
        <ProductosToCategoria articulos={articulosRigth} />
        <AnuncioCelBottom />
      </section>
      <a
        href="https://wa.me//+51987038024?text=Hola, estoy interesado en sus servicios."
        className="w-[140px] 2xl:w-[190px] h-[calc(100vh-6rem)]  sticky right-0 top-24 z-[10] hidden lg:block"
        target="_blank"
        rel="noreferrer"
      >
        <img
          src="/assets/images/newsletter/anuncio2.webp"
          alt="Logos Perú"
          className="w-full h-full object-contain object-left-top"
        />
      </a>
    </section>
  )
}
