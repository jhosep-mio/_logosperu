'use client'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { LuBadgeCheck } from 'react-icons/lu'
import { v4 as uuidv4 } from 'uuid'
import { TotalPlan } from './TotalPlan'
import axios from 'axios'
import { Global } from '@/helper/Global'
import { toast } from 'sonner'
export interface planesItems {
  plan: string;
  name: string;
  price: string;
  unique: boolean;
  items: string[];
  vendido: boolean;
  extra: any;
  servicio: string;
  verMas: boolean;
  igv: boolean;
  tiempo: number;
  capacitacion: boolean;
  correlativo: string
}

export const CardPlanes = ({
  plan,
  desactiveFullPlan
}: {
  plan: planesItems;
  desactiveFullPlan?: boolean;
}) => {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const sendWhatsAppMessage = async (
    plan: string,
    precio: string,
    servicio: string,
    correlativo: string
  ) => {
    const precioLimpio = precio.replace(/[^\d.]/g, '')
    const newItem = {
      id: uuidv4(),
      nombre: plan,
      servicio,
      cantidad: 1,
      precio: precioLimpio,
      imagen1: 'default',
      correlativo
    }
    localStorage.setItem('cart', JSON.stringify([newItem]))
    const formData = new FormData()
    formData.append('servicio', servicio)
    formData.append('plan', plan)

    try {
      setLoading(true)
      const { data } = await axios.post(
        `${Global.url}/registerCarritoCompras`,
        formData,
        {
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      if (data.status == 'success') {
        router.push('/checkout')
      } else {
        toast.error('Error al agregar servicio')
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
      setLoading(false)

      toast.error('Error al agregar servicio')
    }
  }
  const [fullPlan, setFullPlan] = useState(false)

  return (
    <>
      <div
        className={`div_quitar_m max-w-5xl mx-auto min-h-[570px] lg:min-h-full h-fit ${desactiveFullPlan ? 'lg:h-fit' : 'lg:h-[830px]'} select-none w-full border-4 bg-white  border-gray-500/30 hover:border-main py-8 z-10 px-5 md:px-10 rounded-3xl lg:-mr-5 plan transition-all relative group before:absolute before:w-full before:h-full before:top-0 before:left-0 before:bg-[url(/assets/images/servicios/planes/patron.webp)] before:bg-contain before:bg-repeat before:-z-10 before:opacity-10`}
      >
        {plan.vendido && (
          <div className="absolute -top-8 left-0 right-0 mx-auto w-fit bg-main text-white text-center py-3 px-8 text-3xl rounded-xl z-10">
            <span>Más vendido</span>
          </div>
        )}
        <div className="flex flex-col justify-between h-full">
          <div className="flex flex-col">
            <div className="mb-8 text-center space-y-3">
              <h4 className="font-semibold uppercase text-base text-gray-500 group-hover:text-main/90 transition-all ">
                {plan.name}
              </h4>
              <h1 className="text-2xl md:text-3xl font-extrabold group-hover:text-primary transition-all">
                {plan.price}
              </h1>
              {plan.unique && <p className="text-gray-500">Pago único</p>}
              {plan.igv && <p className="text-gray-500">No incluye IGV</p>}
            </div>
            <ul className="space-y-3 text-sm md:text-base mb-8 ">
              {plan.items.map(
                (item: string, index: number) =>
                  index < (desactiveFullPlan ? 60 : 6) && (
                    <li
                      className="flex items-center gap-4 font-medium "
                      key={index}
                    >
                      <LuBadgeCheck size={20} className="text-base text-main" />
                      <span
                        className="text-xs md:text-base w-full flex-1 line-clamp-2"
                        dangerouslySetInnerHTML={{ __html: item }}
                      ></span>
                    </li>
                  )
              )}

              {plan.extra && desactiveFullPlan && plan.extra}
              {desactiveFullPlan && (
                <div className="pl-5 text-xs md:text-base space-y-2 md:space-y-3">
                  <p className="mt-8 ">
                    Tiempo de trabajo: {plan.tiempo}{' '}
                    {plan.capacitacion ? 'horas' : 'días'}
                  </p>
                  <p>Forma de Trabajo : Bajo contrato.</p>
                  {plan.servicio === 'Desarrollo web' && (
                    <p>
                      Administración de dominio .com.pe o .pe se cotiza aparte
                    </p>
                  )}
                  <p>
                    Nuestros Costos <strong>NO incluyen IGV</strong>
                  </p>
                </div>
              )}
              {plan.verMas && !desactiveFullPlan && (
                <li
                  className="text-center mt-10 text-main underline text-base md:text-lg cursor-pointer"
                  onClick={() => {
                    setFullPlan(true)
                  }}
                >
                  Ver más
                </li>
              )}
            </ul>
          </div>

          <button
            type="button"
            disabled={loading}
            onClick={() =>
              sendWhatsAppMessage(plan.name, plan.price, plan.servicio, plan.correlativo)
            }
            className={`w-full border-2 border-main ${!loading ? 'bg-transparent' : 'bg-main'} text-sm md:text-base py-2 md:py-4 rounded-full my-5 hover:bg-main hover:text-white transition-colors duration-300`}
          >
            {!loading ? 'Comprar' : 'Cargando...'}
          </button>
        </div>

        {/* <p className='text-gray-500 text-center'>Its free so why not</p> */}
      </div>

      <TotalPlan fullPlan={fullPlan} plan={plan} setFullPlan={setFullPlan} />
    </>
  )
}
