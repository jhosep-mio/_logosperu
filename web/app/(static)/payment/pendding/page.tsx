/* eslint-disable @next/next/no-img-element */
import { Footer } from '@/public/components/web/structure/Footer'
import { Header } from '@/public/components/web/structure/Header'
import Link from 'next/link'
import { MdError } from 'react-icons/md'

export default async function Pendding ({ searchParams }: any) {
  return (
    <section className="relative z-10">
      <Header />
      <section className="degraded_main bannerMain relative overflow-hidden">
        <section className="overflow-hidden pt-[84px] lg:pt-[120px] lg:pb-[40px]">
          <div className="py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg bg-white rounded-xl px-8 py-10 mx-auto">
              <div className="text-center">
                <MdError className="mx-auto text-5xl text-red-600" />
                <h1 className="text-2xl font-bold text-black mt-4">
                  ¡Lo sentimos, hubo un problema con tu pago!
                </h1>
                <p className="mt-4 text-base text-gray-600">
                  No pudimos procesar tu pago. Por favor, revisa la información
                  de tu medio de pago e inténtalo de nuevo.
                </p>
              </div>

              <div className="mt-8 border-t border-gray-200 pt-5">
                <div className="flex justify-between text-gray-600 text-sm ">
                  <span className="font-medium">Número de pedido:</span>
                  <span className="text-black font-bold">
                    #{searchParams.preference_id}
                  </span>
                </div>
              </div>

              <div className="mt-8 flex justify-center">
                <Link
                  href="/checkout"
                  className="inline-block bg-red-600 text-white font-semibold text-sm py-3 px-6 rounded-lg shadow hover:bg-red-500 transition duration-300"
                >
                  Intentar de nuevo
                </Link>
              </div>

              <p className="text-gray-500 text-xs text-center max-w-lg mt-4">
                Si el problema persiste, comunícate con nosotros por WhatsApp
                para recibir ayuda.
                <a
                  href="https://wa.me/+51994181726"
                  target="_blank"
                  className="text-blue-500 ml-2"
                  rel="noreferrer"
                >
                  Aquí
                </a>
              </p>
            </div>
          </div>
        </section>
      </section>
      <Footer />
    </section>
  )
}
