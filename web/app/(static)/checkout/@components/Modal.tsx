/* eslint-disable @next/next/no-img-element */

import React from 'react'
import Dialog from '@mui/material/Dialog'
import { v4 as uuidv4 } from 'uuid'
import { MdDiscount } from 'react-icons/md'
import { FiDelete } from 'react-icons/fi'

export const Modal = ({ open, setOpen, setAdicionales }: any) => {
  const addAdicionales = (add: any) => {
    // Obtener los adicionales existentes del localStorage
    const storedAdicionales = localStorage.getItem('adicionales')
    const adicionalesArray = storedAdicionales ? JSON.parse(storedAdicionales) : []
    const existingAdicionalIndex = adicionalesArray.findIndex((item: any) => item.nombre === add.name)
    if (existingAdicionalIndex !== -1) {
      adicionalesArray[existingAdicionalIndex].cantidad += 1
    } else {
      const newItem = {
        id: uuidv4(),
        nombre: add.name,
        cantidad: 1,
        precio: Number(add.precio),
        imagen1: 'default',
        precio_propuestas: add?.precio_propuestas ?? null,
        estado_propuesta: add?.estado_propuesta ?? null,
        cantidad_propuestas: add?.cantidad_propuestas ?? null
      }
      adicionalesArray.push(newItem)
    }
    localStorage.setItem('adicionales', JSON.stringify(adicionalesArray))
    setAdicionales(adicionalesArray)
    setOpen(false)
  }

  const adicionalesList = [
    {
      name: 'Combo 1',
      precio: 90,
      listado: [{ name: 'TARJETA DE PRESENTACIÓN' }, { name: 'HOJA MEMBRETADA' }, { name: 'FIRMA DE DE CORREO' }]
    },
    {
      name: 'Diseño de portada',
      precio: 35,
      listado: null,
      precio_propuestas: 20,
      cantidad_propuestas: 1,
      estado_propuesta: true
    },
    {
      name: 'Diseño de etiquetas (02 propuestas)',
      precio: 90,
      listado: null
    },
    {
      name: 'Diseño de flyer o Post (01 propuesta)',
      precio: 35,
      listado: null,
      precio_propuestas: 20,
      cantidad_propuestas: 1,
      estado_propuesta: true
    },
    {
      name: 'Diseño de brochure (04 caras - 02 hojas)',
      precio: 129,
      listado: null
    },
    {
      name: 'Diseño de folder (01 propuesta)',
      precio: 60,
      listado: null
    },

    { name: 'Tarjeta de presentación', precio: 35, listado: null, precio_propuestas: 20, cantidad_propuestas: 1, estado_propuesta: true },
    { name: 'Hoja membretada', precio: 35, listado: null, precio_propuestas: 20, cantidad_propuestas: 1, estado_propuesta: true },
    { name: 'Firma de correo', precio: 35, listado: null, precio_propuestas: 20, cantidad_propuestas: 1, estado_propuesta: true }
  ]

  return (
    <Dialog open={open} onClose={() => setOpen(false)} aria-labelledby="alert-dialog-title" aria-describedby="alert-dialog-description" maxWidth="xl">
      <div className="flex flex-col w-full lg:w-[800px] py-8 px-6 relative">
        <FiDelete className="text-lg text-red-600 hover:text-red-800 transition-colors absolute top-2 right-2" />
        <h2 className="text-center w-full font-bold uppercase text-xl mb-3">Adicionales</h2>
        <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
          {adicionalesList.map((add: any, index: number) => (
            <div
              className={`flex gap-3 px-3 py-2 items-center w-full cursor-pointer rounded-lg border  hover:bg-white transition-colors bg-[#F5F6FB] ${add.listado != null ? 'lg:col-span-2 border-main' : 'border-[#cbccd0] hover:border-main'}`}
              key={index}
              onClick={() => addAdicionales(add)}
            >
              {add.listado == null ? (
                <div className="group w-full flex justify-between gap-3 items-center">
                  <img
                    src="https://intranet.logosperu.com.pe//assets/icono-9506ee97.png"
                    alt=""
                    className="w-[22px] bg-black rounded-full p-[2px] h-[22px] text-gray-400 group-hover:text-main transition-colors"
                  />
                  <div className="w-full flex justify-between gap-6 items-center">
                    <p className="text-black w-full text-sm lg:text-base lowercase first-letter:uppercase">{add.name}</p>
                    <p className="font-bold flex-1 whitespace-nowrap">S/ {Number(add.precio).toFixed(2)}</p>
                  </div>
                </div>
              ) : (
                <>
                  <div className="w-full flex flex-col gap-0 group py-1">
                    <div className="w-full flex justify-between gap-6 items-center">
                      <div className="w-fit flex items-center gap-2">
                        <img
                          src="https://intranet.logosperu.com.pe//assets/icono-9506ee97.png"
                          alt=""
                          className="w-[22px] bg-black rounded-full p-[2px] h-[22px] text-gray-400 group-hover:text-main transition-colors"
                        />
                        <p className="text-black w-fit text-base text-left lg:text-base uppercase font-bold">OFERTA {add.name}</p>
                      </div>
                      <p className="font-extrabold text-xl mt-2 mr-1">S/ {Number(add.precio).toFixed(2)}</p>
                    </div>
                    <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-3">
                      {add.listado.map((list: any, index: number) => (
                        <div className=" flex justify-between items-center gap-3" key={index}>
                          <MdDiscount className="w-[15px] h-[15px] text-gray-400 transition-colors group-hover:text-main" />
                          <div className="w-full flex justify-between">
                            <p className="text-black text-sm lg:text-base lowercase first-letter:uppercase">{list.name}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </Dialog>
  )
}
