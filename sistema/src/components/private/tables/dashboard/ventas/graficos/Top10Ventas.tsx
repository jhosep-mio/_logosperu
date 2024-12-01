import {
  type openFiltersValuesToId,
  type ValuesVentaToMetricas
} from '../../../../../shared/schemas/Interfaces'
import { type Dispatch, type SetStateAction, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'

export const Top10Ventas = ({
  filtrarVentas,
  openVentaId,
  setOpenVentaId,
  cantidadTop,
  setCantidadTop
}: {
  filtrarVentas: () => ValuesVentaToMetricas[]
  openVentaId: openFiltersValuesToId
  setOpenVentaId: Dispatch<SetStateAction<openFiltersValuesToId>>
  setCantidadTop: Dispatch<SetStateAction<number>>
  cantidadTop: number
}): JSX.Element => {
  const ventas = filtrarVentas()
  const [hoveredClient, setHoveredClient] = useState<string | null>(null)
  // Crear un mapeo de ID de cliente a nombre y apellido de cliente
  const idToNombreApellido: Record<string, string> = {}
  ventas.forEach((venta) => {
    const nombresArray = venta.nombres.split(' ')
    const apellidosArray = venta.apellidos.split(' ')
    const primerNombre =
      nombresArray[0].charAt(0).toUpperCase() +
      nombresArray[0].slice(1).toLowerCase()
    const primerApellido =
      apellidosArray[0].charAt(0).toUpperCase() +
      apellidosArray[0].slice(1).toLowerCase()
    idToNombreApellido[venta.id_cliente] = `${primerNombre} ${primerApellido}`
  })

  // Agrupar proyectos por cliente
  const proyectosPorCliente = ventas.reduce(
    (acumulador: any, venta: ValuesVentaToMetricas) => {
      const idCliente = venta.id_cliente
      const nombreApellidoCliente = idToNombreApellido[idCliente]
      if (!acumulador[idCliente]) {
        acumulador[idCliente] = {
          id: idCliente, // Agregar el ID
          nombreApellido: nombreApellidoCliente,
          nombreCompleto: `${venta.nombres} ${venta.apellidos}`,
          cantidad: 0
        }
      }
      acumulador[idCliente].cantidad++
      return acumulador
    },
    {}
  )

  // Obtener el top 10 de clientes con más proyectos
  const top10Clientes: any = Object.values(proyectosPorCliente)
    .sort(
      (clienteA: any, clienteB: any) => clienteB.cantidad - clienteA.cantidad
    )
    .slice(0, cantidadTop)
    .map((cliente: any) => ({
      id: cliente.id, // Agregar el ID
      nombreApellido: cliente.nombreApellido,
      cantidad: cliente.cantidad,
      nombreCompleto: cliente.nombreCompleto
    }))

  const maxProjects = Math.max(
    ...top10Clientes.map((cliente: any) => cliente.cantidad)
  )

  const newData = {
    labels: top10Clientes.map((cliente: any) => cliente.nombreApellido),
    datasets: [
      {
        label: 'Cantidad de Proyectos',
        data: top10Clientes.map((cliente: any) => cliente.cantidad),
        fill: false,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 2
      }
    ]
  }

  return (
    <>
      <div className="flex justify-between px-4">
        <select name="" id="" onChange={(e) => { setCantidadTop(Number(e.target.value)) }} className="w-fit cursor-pointer outline-none text-left text-gray-600 font-semibold text-xl ">
            <option value="10">Top 10 clientes</option>
            <option value="100">Top 100 clientes</option>
            <option value="500">Top 500 clientes</option>
            <option value="1000">Top 1000 clientes</option>
        </select>
      </div>
      <div className="relative py-3 w-full md:w-auto ">
        <div className="bg-white rounded-xl p-2 flex flex-col space-y-1 ">
          {newData.labels.map((label: any, index: any) => (
            <div key={index} className="flex items-center space-x-3  relative">
              <div
                className="w-20"
                style={{
                  width: `${
                    (top10Clientes[index].cantidad / maxProjects) * 100
                  }%`
                }}
              >
                <div
                  className={`h-3 ${
                    openVentaId.id == top10Clientes[index].id
                      ? 'bg-main'
                      : 'bg-[#7bc9c9]'
                  }   rounded-full cursor-pointer`}
                  onMouseEnter={() => {
                    setHoveredClient(label)
                  }}
                  onMouseLeave={() => {
                    setHoveredClient(null)
                  }}
                  onClick={() => {
                    if (openVentaId.id != top10Clientes[index].id) {
                      setOpenVentaId({
                        estado: true,
                        id: top10Clientes[index].id,
                        nombre: top10Clientes[index].nombreCompleto,
                        cantidad: top10Clientes[index].cantidad
                      })
                    } else {
                      setOpenVentaId({
                        estado: false,
                        id: null,
                        nombre: null,
                        cantidad: null
                      })
                    }
                  }}
                ></div>
                <AnimatePresence>
                  {hoveredClient === label && (
                    <motion.div
                      initial={{ opacity: 0 }} // Ocultar y escalar el cuadro de información inicialmente
                      animate={{ opacity: 1 }} // Mostrar y escalar el cuadro de información cuando se hace hover
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }} // Duración de la animación en segundos
                      className="absolute flex gap-2 duration-75 top-full z-10 left-0 p-2 bg-black/80 shadow-lg rounded-md text-sm"
                    >
                      <div className="text-white font-bold uppercase">
                        {label}
                      </div>
                      <div className="text-white">{
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                        `${top10Clientes[index].cantidad} proyectos`
                      }</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <div className="text-black text-sm font-bold line-clamp-1 ">
                {label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
