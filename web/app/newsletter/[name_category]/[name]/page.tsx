/* eslint-disable camelcase */
/* eslint-disable @next/next/no-img-element */
import { FiDownload } from 'react-icons/fi'
import { Header } from '../../@components/Header'
import { AnuncioCelBottom } from '../../@components/AnuncioCelBottom'
import { Footer } from '@/public/components/web/structure/Footer'
// import { SelectFace } from '../../@components/SelectFace'
import { Global } from '@/helper/Global'
import FormatoFecha from '../../@components/generales/FormatFecha'
import Link from 'next/link'
import { FaLongArrowAltLeft } from 'react-icons/fa'
import { ProductosToCategoriaArticle } from '../../@components/arituculos/ProductosToCategoriaArticle'
import { SeoOneNesletter } from '@/public/components/seo/SeoOneNesletter'

export async function generateMetadata ({ params }: { params: any }) {
  const metadata = await SeoOneNesletter({ params })
  return metadata
}

export default async function Newsletter ({ params }: any) {
  const { name_category, name } = params
  const result: any = await fetch(`${Global.url}/getOneArticuloUrl/${name}`, {
    cache: 'no-store'
  })
  const producto = await result.json()
  const getAllArticulosPublicSection = await fetch(
    `${Global.url}/newsletter/getAllArticulosPublicSectionOnCategoryArticle/${name_category}/${name}`,
    { cache: 'no-store' }
  )
  const { data: articulosRigth } = await getAllArticulosPublicSection.json()
  return (
    <>
      <Header />
      <section className="bg-gray-100 flex pt-24 relative max-w-[1700px] mx-auto">
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
        <section className="w-full grid grid-cols-1 lg:grid-cols-8 flex-1 border-gris border-x-2 relative bg-white">
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
          <div className="px-0 py-4 lg:p-8 2xl:p-10 2xl:pb-6 w-full col-span-8 ">
            <Link
              href={'/newsletter'}
              className="flex px-4 py-3 mb-8 border text-sm  items-center justify-center gap-2 w-fit rounded-full hover:bg-main hover:border-main transition-all duration-200"
            >
              <FaLongArrowAltLeft />
              Regresar
            </Link>
            <h1 className="text-black text-3xl lg:text-4xl font-semibold px-4 lg:px-0">
              {producto[0].titulo}
            </h1>
            <img
              src={`https://mysistemalogosperu.s3.amazonaws.com/articulos/${producto[0].imagen1}`}
              alt={producto.titulo}
              className="h-fit object-contain w-full mt-6"
            />

            <div className="flex items-center mt-4 px-4 lg:px-0">
              <div className="w-full flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-white border border-gray-300 p-1 rounded-full h-12 w-12">
                    <img src="/assets/images/logos/logo.webp" alt="" />
                  </div>
                  <h3 className="font-SpartanMedium text-xl">Logos Perú</h3>
                </div>
                <div className="flex gap-4">
                  <FiDownload className="rotate-180 text-gray-600 text-xl" />
                  <FiDownload className=" text-gray-600 text-xl" />
                </div>
              </div>
            </div>
            <div className="flex gap-4 text-gray-600 mt-2 text-sm px-4 lg:px-0 border-b border-b-gray-300 pb-5">
              <FormatoFecha fechaISO={producto[0].created_at} />
            </div>
            <div className="mt-4 text-gray-600 px-4 lg:px-0 text-justify ">
              <div
                className="forzar_letra_newsletter"
                dangerouslySetInnerHTML={{
                  __html: JSON.parse(producto[0].contenido)
                }}
              />
            </div>
            {producto[0].autor != 'https://logosperu.com.pe/' && (
              <p className="mt-10 text-right text-blue-600 opacity-85">
                {producto[0].autor}
              </p>
            )}
          </div>
          <ProductosToCategoriaArticle articulos={articulosRigth} />
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
      <Footer />
    </>
  )
}
