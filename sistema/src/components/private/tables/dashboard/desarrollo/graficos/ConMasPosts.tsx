/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
import { type ValuesVentaToMetricas } from '../../../../../shared/schemas/Interfaces'
import { type Dispatch, type SetStateAction, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Link } from 'react-router-dom'

export const ConMasPosts = ({
  filtrarVentas
}: {
  filtrarVentas: () => ValuesVentaToMetricas[]
  setSelectedId: Dispatch<SetStateAction<string | null>>
  selectedId: string | null
}): JSX.Element => {
  const ventas = filtrarVentas()
  const contadorPorProyecto: any = {}
  const nombresMarcas: any = {}
  const [hoveredClient, setHoveredClient] = useState<string | null>(null)

  ventas.forEach((venta: any) => {
    // Verificar si el objeto tiene la propiedad `community` y es un array
    if (venta.community) {
      JSON.parse(venta.community).forEach((post: any) => {
        if (post.tipo != 'inicio' && post.tipo != 'solicitud_informacion') {
          if (post?.descripcion?.arrayArchivos?.length > 0) {
            const proyectoId = venta.id
            nombresMarcas[proyectoId] = venta?.nombre_marca ?? 'Sin marca'
            if (contadorPorProyecto[proyectoId]) {
              contadorPorProyecto[proyectoId]++
            } else {
              contadorPorProyecto[proyectoId] = 1
            }
          }
        }
      })
    }
  })
  const [cantidadTop, setCantidadTop] = useState(20)
  const top10Posts = Object.entries(contadorPorProyecto)
    // @ts-expect-error
    .sort(([, cantidadA], [, cantidadB]) => cantidadB - cantidadA)
    .slice(0, cantidadTop)
    .map(([proyectoId, cantidad]) => ({
      proyectoId,
      cantidad,
      nombreMarca: nombresMarcas[proyectoId] // Guarda el nombre de la marca asociado al proyecto
    }))

  const newData = {
    labels: top10Posts.map((post: any) => post.nombreMarca),
    datasets: [
      {
        label: 'Cantidad de Proyectos',
        data: top10Posts.map((post: any) => post.cantidad),
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

  const maxProjects = Math.max(
    ...top10Posts.map((cliente: any) => cliente.cantidad)
  )

  return (
    <>
      <div className="flex flex-col px-4">
         <div className='w-full flex justify-between'>
            <h1 className="w-full text-left text-gray-600 font-semibold text-xl line-clamp-1">
            Con mas POSTS
            </h1>
            <div className="flex justify-between px-4">
            <select
                name=""
                id=""
                onChange={(e) => {
                  setCantidadTop(Number(e.target.value))
                }}
                className="w-fit cursor-pointer outline-none text-left text-gray-600 font-semibold text-xl "
            >
                <option value="20">Top 20</option>
                <option value="200">Todos</option>
            </select>
            </div>
         </div>
        <div className="bg-white rounded-xl p-2 flex flex-col space-y-1 ">
          {newData.labels.map((label: any, index: any) => (
            <div key={index} className="flex items-center space-x-3  relative">
              <Link
                to={`/admin/lista-servicios/avances/${top10Posts[index].proyectoId}`}
                target='_blank'
                className="w-20"
                style={{
                  // @ts-expect-error
                  width: `${(top10Posts[index].cantidad / maxProjects) * 100}%`
                }}
              >
                <div
                  className={'h-3  bg-[#7bc9c9] rounded-full cursor-pointer'}
                  onMouseEnter={() => {
                    setHoveredClient(index)
                  }}
                  onMouseLeave={() => {
                    setHoveredClient(null)
                  }}
                ></div>
                <AnimatePresence>
                  {hoveredClient == index && (
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
                        `${top10Posts[index].cantidad} posts`
                      }</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </Link>
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
