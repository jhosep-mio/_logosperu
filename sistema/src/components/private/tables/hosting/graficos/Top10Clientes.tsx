/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { type Dispatch, type SetStateAction, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export const Top10Clientes = ({
  filtrarClientes,
  cantidadTop,
  setCantidadTop
}: {
  filtrarClientes: any
  setCantidadTop: Dispatch<SetStateAction<number>>
  cantidadTop: number
}): JSX.Element => {
  const clientes = filtrarClientes()
  const [hoveredClient, setHoveredClient] = useState<string | null>(null)
  // Ordenar clientes por número de renovaciones de mayor a menor
  const top10Clientes = clientes
    .filter((cliente: any) => cliente.renewals.renovaciones > 0) // Filtrar clientes con renovaciones mayores a 0
    .sort((clienteA: any, clienteB: any) => clienteB.renewals.renovaciones - clienteA.renewals.renovaciones)
    .slice(0, cantidadTop)

  const maxRenovaciones = Math.max(...top10Clientes.map((cliente: any) => cliente.renewals.renovaciones))

  return (
      <>
        <div className="flex justify-between px-4">
          <select name="" id="" onChange={(e) => { setCantidadTop(Number(e.target.value)) }} className="w-fit cursor-pointer outline-none text-left text-gray-600 font-semibold text-xl ">
              <option value="15">Top 15 clientes</option>
              <option value="100">Top 100 clientes</option>
              <option value="500">Top 500 clientes</option>
              <option value="1000">Top 1000 clientes</option>
          </select>
        </div>
        <div className="relative py-3 w-full md:w-auto ">
        <div className="bg-white rounded-xl p-2 flex flex-col space-y-1 ">
          {top10Clientes.map((cliente: any, index: number) => (
            <Link
            to={`/admin/hosting/avances/${cliente.idHosting}`}
            target='_blank'
            key={index} className="flex justify-between items-center space-x-3  relative">
              <div
                className="w-20"
                style={{
                  width: `${(cliente.renewals.renovaciones / maxRenovaciones) * 100}%`
                }}
              >
                <div
                  className={'h-3 bg-[#7bc9c9] rounded-full cursor-pointer'}
                  onMouseEnter={() => {
                    setHoveredClient(cliente.idHosting)
                  }}
                  onMouseLeave={() => {
                    setHoveredClient(null)
                  }}
                ></div>
                <AnimatePresence>
                  {hoveredClient === cliente.idHosting && (
                    <motion.div
                      initial={{ opacity: 0 }} // Ocultar y escalar el cuadro de información inicialmente
                      animate={{ opacity: 1 }} // Mostrar y escalar el cuadro de información cuando se hace hover
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }} // Duración de la animación en segundos
                      className="absolute flex gap-2 duration-75 top-full z-10 left-0 p-2 bg-black/80 shadow-lg rounded-md text-sm"
                    >
                      <div className="text-white font-bold lowercase">{cliente.renewals.dominio}</div>
                      <div className="text-white">{`${cliente.renewals.renovaciones} renovaciones`}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="text-black text-sm font-bold line-clamp-1 ">{cliente.renewals.nombreCompleto}</div>
            </Link>
          ))}
        </div>
      </div>
      </>
  )
}
