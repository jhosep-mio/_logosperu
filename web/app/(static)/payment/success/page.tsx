/* eslint-disable @next/next/no-img-element */
import Link from 'next/link'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { VlidationCarrito } from './@validationCarrito/VlidationCarrito'
import { notFound } from 'next/navigation'
import { Global } from '@/helper/Global'
import { Header } from '@/public/components/web/structure/Header'
import { Footer } from '@/public/components/web/structure/Footer'

async function getServerSidePropsSerach (url: string) {
  try {
    const res = await fetch(`${Global.url}/${url}`, { cache: 'no-store' })
    if (!res.ok) {
      notFound()
    }
    const dataNotMessage = await res.json()
    if (
      dataNotMessage.estado == false &&
      dataNotMessage.message == 'Error server'
    ) {
      notFound()
    }
    return dataNotMessage
  } catch (error) {
    notFound()
  }
}

export default async function SuccesPage ({ searchParams }: any) {
  const { message } = await getServerSidePropsSerach(
    `checkout/findByTransaction/${searchParams.payment_id}`
  )
  return (
    <>
      <section className="relative z-10">
        <Header />
        <section className="degraded_main bannerMain relative overflow-hidden">
          <section className="overflow-hidden pt-[84px] lg:pt-[120px] lg:pb-[40px]">
            <div className="py-8 px-4 sm:px-6 lg:px-8">
              <div className="max-w-lg bg-white rounded-xl px-8 py-10 mx-auto">
                <div className="text-center">
                  <img
                    src="/assets/payment/check.jpg"
                    alt=""
                    className="mx-auto w-[70px]"
                  />
                  <h1 className="text-2xl  font-bold text-gray-900 mt-4">
                    ¡Gracias por tu compra!
                  </h1>
                  <p className="mt-4 text-base text-gray-600">
                    Tu pedido ha sido recibido con éxito. Te enviaremos un
                    correo con los detalles de tu compra.
                  </p>
                </div>

                <div className="mt-8 border-t border-gray-200 pt-5">
                  <div className="flex justify-between text-gray-600 text-sm ">
                    <span className="font-medium">Número de pedido:</span>
                    <span className="text-black font-bold">
                      #{message?.paymentId}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 mt-2">
                    <span className="font-medium">Fecha:</span>
                    <span className="text-black font-bold">
                      {' '}
                      {format(
                        parseISO(message?.paymentDate),
                        "dd 'de' MMMM 'de' yyyy",
                        { locale: es }
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 mt-2">
                    <span className="font-medium">Hora:</span>
                    <span className="text-black font-bold">
                      {' '}
                      {format(parseISO(message?.paymentDate), 'HH:mm', {
                        locale: es
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between text-gray-600 mt-2">
                    <span className="font-medium">Total:</span>
                    <span className="text-black font-bold">
                      {(
                        Number(message?.transactionAmount) +
                        Number(message?.igv)
                      ).toLocaleString('es-PE', {
                        style: 'currency',
                        currency: 'PEN'
                      })}
                    </span>
                  </div>
                </div>
                <div className="mt-8 flex justify-center">
                  <Link
                    href="/"
                    className="inline-block bg-main text-white font-semibold text-sm  py-3 px-6 rounded-lg shadow hover:bg-main_dark transition duration-300"
                  >
                    Volver a la tienda
                  </Link>
                </div>
                <p className="text-gray-500 text-xs text-center max-w-lg mt-4 ">
                  Puedes comunicarte con nosotros por whatsapp para acelear el
                  proceso.
                  <a
                    href="https://wa.me/+51994181726"
                    target="_blank"
                    className="text-blue-500 ml-2"
                    rel="noreferrer"
                  >
                    Aqui
                  </a>
                </p>
              </div>
            </div>
            <VlidationCarrito message={message} />
          </section>
        </section>
        <Footer />
      </section>
    </>
  )
}
