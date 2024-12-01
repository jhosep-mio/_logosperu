'use client'
import React, { useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { ButtonPlan } from './ButtonPlan'
import { Autoplay, Navigation } from 'swiper/modules'
import 'swiper/css/navigation'
import { PlanModal } from './PlanModal'
export const Planes = () => {
  const [open, setOpen] = useState(false)
  const [plan, setPlan] = useState('')

  const abrirModal = (plan: string) => {
    setPlan(plan)
    setOpen(true)
  }
  return (
    <>
      <Swiper
        loop
        slidesPerView={3}
        spaceBetween={20}
        navigation
        className="mt-12 swp_planes_comunity"
        autoplay={{
          delay: 7000,
          reverseDirection: false
        }}
        modules={[Autoplay, Navigation]}
        breakpoints={{
          0: {
            slidesPerView: 1
          },
          576: {
            slidesPerView: 1
          },
          768: {
            slidesPerView: 2
          },
          992: {
            slidesPerView: 3
          }
        }}
      >
        <SwiperSlide>
          <div className="flex h-[730px] flex-col justify-between  border-2 border-main px-4 md:px-8 py-8 bg-white z-10 rounded-[1.5rem] transition-all duration-300  relative before:absolute before:w-full before:h-full before:top-0 before:left-0 before:bg-[url(/assets/images/servicios/planes/patron.webp)] before:opacity-15 before:bg-contain before:-z-10">
            <div className="flex flex-col">
              <h5 className="text-3xl text-center font-bold mb-4">
                PLAN <span className="text-main"> EMPRENDEDOR</span>
              </h5>
              <h5 className="text-3xl text-center font-bold mb-4">
                <span className="text-black"> S/ 159.00</span>
              </h5>
              <ul className="text-[16px] flex flex-col gap-2 list-disc pl-6 list-disc-main">
                <li>Análisis de Marketing Digital</li>
                <li className="font-semibold  rounded-lg mb-2">
                  1 Publicaciones por semana <strong>(Lunes a Sábado)</strong>
                  <ul className="">
                    <li>
                      Dividido:{' '}
                      <strong>
                        01 DISEÑO DE FLYER O POST
                      </strong>
                    </li>

                  </ul>
                </li>
                <li>
                  <strong>02 Desarrollo de Reel o Videos cortos. </strong> Máx. 10 segundos x Mes{' '}

                  (EFECTOS Y MUSICALIZACIÓN - SIN LOCUCIÓN EN OFF) -{' '}
                    <strong>Entregable Cronograma</strong>

                </li>
                <li>
                  01 Diseño de Portada y Perfil Facebook - WSP Bussines x MES{' '}
                </li>
                <li>
                  Asesorían en creación de redes (facebook - instagram - TIKTOK)
                </li>
              </ul>
            </div>
            <ButtonPlan plan="Plan Emprendedor" servicio='Community Manager' precio='159.00' correlativo='LPCME'/>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex h-[730px] flex-col justify-between border-2 border-main px-4 md:px-8 py-8 bg-white z-10 rounded-[1.5rem] transition-all duration-300  relative before:absolute before:w-full before:h-full before:top-0 before:left-0 before:bg-[url(/assets/images/servicios/planes/patron.webp)] before:opacity-15 before:bg-contain before:-z-10">
            <div className="flex flex-col">
              <h5 className="text-3xl text-center font-bold mb-4">
                PLAN <span className="text-main"> COBRE</span>
              </h5>
              <h5 className="text-3xl text-center font-bold mb-4">
                <span className="text-black"> S/ 319.00</span>
              </h5>
              <ul className="text-[16px] flex flex-col gap-2 list-disc pl-6 list-disc-main">
                <li>Investigación digital</li>
                <li>
                  Análisis de Marketing Digital - DOCUMENTACIÓN - Linea Gráfica
                </li>
                <li className="font-semibold  rounded-lg mb-2">
                  4 Publicaciones por semana <strong>(Lunes a Sábado)</strong>
                  <ul className="">
                    <li>
                      Dividido:{' '}
                      <strong>
                        02 DISEÑO DE FLYER O POST / 02 DESARROLLO DE REEL O VIDEOS CORTOS.
                      </strong>{' '}
                      Máx. 10 segundos
                    </li>
                    <li>
                      (EFECTOS Y MUSICALIZACIÓN - SIN LOCUCIÓN EN OFF) -{' '}
                      <strong>Entregable Cronograma</strong>
                    </li>
                  </ul>
                </li>
                <li>01 Diseño de Perfil (Facebook - Instagram - TikTok)</li>
                <li>01 Diseño de Perfil (Facebook - WSP Bussines) X MES</li>
                <li>
                  Asesoría en creación de redes (Facebook - Instagram - TIKTOK)
                </li>
              </ul>
            </div>
            <ButtonPlan plan="Plan Cobre" servicio='Community Manager' precio='319.00' correlativo='LPCMC'/>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex h-[730px] flex-col justify-between border-2 border-main px-4 md:px-8 py-8 bg-white z-10 rounded-[1.5rem] transition-all duration-300  relative before:absolute before:w-full before:h-full before:top-0 before:left-0 before:bg-[url(/assets/images/servicios/planes/patron.webp)] before:opacity-15 before:bg-contain before:-z-10">
            <div className="flex flex-col">
              <h5 className="text-3xl text-center font-bold mb-4">
                PLAN <span className="text-main"> SILVER</span>
              </h5>
              <h5 className="text-3xl text-center font-bold mb-4">
                <span className="text-black"> S/ 499.00</span>
              </h5>
              <ul className="text-[16px] flex flex-col gap-2 list-disc pl-6 list-disc-main">
                <li>Investigación digital</li>
                <li>
                  Análisis de Marketing Digital - DOCUMENTACIÓN - Linea Gráfica
                </li>
                <li className="font-semibold  rounded-lg mb-2">
                  6 Publicaciones por semana <strong>(Lunes a Sábado)</strong>
                  <ul className="">
                    <li>
                      Dividido:{' '}
                      <strong>
                        03 DISEÑO DE FLYER O POST / 03 DESARROLLO DE REEL O VIDEOS CORTOS
                      </strong>{' '}
                      Máx. 10 segundos
                    </li>
                    <li>
                      (EFECTOS Y MUSICALIZACIÓN - CON LOCUCIÓN EN OFF) -{' '}
                      <strong>Entregable Cronograma</strong>
                    </li>
                  </ul>
                </li>
                <li>
                  RESPUESTAS O COMENTARIOS a Potenciales (clientes o seguidores)
                  MSN META BUSSINESS
                </li>
                <li>01 Diseño de Perfil (Facebook - Instagram - Tiktok)</li>
                <li>01 Diseño de Portada para Facebook - WSP Bussines X MES</li>
                <li>Indexación de fan page al wsp Bussines </li>
                <li>Desarrollo de respuestas automáticas - Fan Page</li>

                <button
                  type="button"
                  onClick={() => {
                    abrirModal('Plan Silver')
                  }}
                  className="text-center underline text-main font-bold mt-4"
                >
                  Ver más
                </button>
              </ul>
            </div>
            <ButtonPlan plan="Plan Silver" servicio='Community Manager' precio='499.00' correlativo='LPCMS'/>
          </div>
        </SwiperSlide>
        <SwiperSlide>
          <div className="flex h-[730px] flex-col justify-between border-2 border-main px-4 md:px-8 py-8 bg-white z-10 rounded-[1.5rem] transition-all duration-300  relative before:absolute before:w-full before:h-full before:top-0 before:left-0 before:bg-[url(/assets/images/servicios/planes/patron.webp)] before:opacity-15 before:bg-contain before:-z-10">
            <div className="flex flex-col">
              <h5 className="text-3xl text-center font-bold mb-6">
                PLAN <span className="text-main"> GOLDEN</span>
              </h5>
              <h5 className="text-3xl text-center font-bold mb-4">
                <span className="text-black"> S/ 699.00</span>
              </h5>
              <ul className="text-[16px] flex flex-col gap-2 list-disc pl-6 list-disc-main">
                <li>Investigación digital</li>
                <li>
                  Análisis de Marketing Digital - DOCUMENTACIÓN - Linea Gráfica
                </li>
                <li className="font-semibold  rounded-lg mb-2">
                  9 Publicaciones por semana <strong>(Lunes a Sábado)</strong>
                  <ul className="">
                    <li>
                      Dividido:{' '}
                      <strong>
                        05 DISEÑO DE FLYER O POST / 04 DESARROLLO DE REEL
                      </strong>{' '}
                      Máx. 10 segundos
                    </li>
                    <li>
                      (EFECTOS Y MUSICALIZACIÓN - CON LOCUCIÓN EN OFF) -{' '}
                      <strong>Entregable Cronograma</strong>
                    </li>
                  </ul>
                </li>
                <li>
                  Diseño de Flyer o Post - Incluye (Retoque Fotográfico) -
                  Entregable cronograma.
                </li>
                <li>
                  Capacitación de campaña pagada (Facebook - Instagram) ADS
                  <ul>
                    <li>
                      Incluye documentación e interacción con la red social.
                      Listo para pagar
                    </li>
                    <li>
                      <strong>IMPORTANTE: </strong>Inversión de publicidad
                      pagada esta cargo del cliente.
                    </li>
                  </ul>
                </li>
                <button
                  type="button"
                  onClick={() => {
                    abrirModal('Plan Golden')
                  }}
                  className="text-center underline text-main font-bold mt-4"
                >
                  Ver más
                </button>
              </ul>
            </div>
            <ButtonPlan plan="Plan Golden" servicio='Community Manager' precio='699.00' correlativo='LPCMG'/>
          </div>
        </SwiperSlide>
      </Swiper>

      <PlanModal open={open} plan={plan} setOpen={setOpen} />
    </>
  )
}
