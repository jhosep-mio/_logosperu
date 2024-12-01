// import { Bar } from 'react-chartjs-2'
// import {
//   type filtrosValues,
//   type ValuesVentaToMetricas
// } from '../../../../../shared/schemas/Interfaces'
// import { MdOutlineZoomOutMap } from 'react-icons/md'
// import { type Dispatch, type SetStateAction } from 'react'

// const options = {
//   indexAxis: 'y',
//   scales: {
//     y: {
//       beginAtZero: true,
//       ticks: {
//         stepSize: 1
//       }
//     }
//   },
//   plugins: {
//     legend: {
//       display: true,
//       labels: {
//         font: {
//           size: 16 // Ajusta el tamaño de las letras aquí
//         }
//       }
//     },
//     tooltip: {
//       titleFont: {
//         size: 18 // Ajusta el tamaño del título del tooltip aquí
//       },
//       bodyFont: {
//         size: 18 // Ajusta el tamaño del cuerpo del tooltip aquí
//       }
//     }
//   },
//   elements: {
//     bar: {
//       borderWidth: 2, // Ajusta el ancho de las barras aquí,
//       barThickness: 50 // Ajusta la altura de las barras aquí (en píxeles)
//     },
//     point: {
//       radius: 4, // Ajusta el tamaño de los puntos aquí
//       borderWidth: 2 // Ajusta el ancho de los puntos aquí
//     }
//   }
// }

// export const Top10Ventas = ({
//   filtrarVentas,
//   setSelectedId,
//   selectedId
// }: {
//   filtrarVentas: () => ValuesVentaToMetricas[]
//   setSelectedId: Dispatch<SetStateAction<string | null>>
//   selectedId: string | null
//   filtroSeleccionado: filtrosValues | null
//   setFiltroSeleccionado: Dispatch<SetStateAction<filtrosValues | null>>
// }): JSX.Element => {
//   const ventas = filtrarVentas()

//   // Crear un mapeo de ID de cliente a nombre y apellido de cliente
//   const idToNombreApellido: Record<string, string> = {}
//   ventas.forEach((venta) => {
//     const nombresArray = venta.nombres.split(' ')
//     const apellidosArray = venta.apellidos.split(' ')
//     const primerNombre =
//       nombresArray[0].charAt(0).toUpperCase() +
//       nombresArray[0].slice(1).toLowerCase()
//     const primerApellido =
//       apellidosArray[0].charAt(0).toUpperCase() +
//       apellidosArray[0].slice(1).toLowerCase()
//     idToNombreApellido[venta.id_cliente] = `${primerNombre} ${primerApellido}`
//   })

//   // Agrupar proyectos por cliente
//   const proyectosPorCliente = ventas.reduce(
//     (acumulador: any, venta: ValuesVentaToMetricas) => {
//       const idCliente = venta.id_cliente
//       const nombreApellidoCliente = idToNombreApellido[idCliente]
//       if (!acumulador[idCliente]) {
//         acumulador[idCliente] = {
//           nombreApellido: nombreApellidoCliente,
//           cantidad: 0
//         }
//       }
//       acumulador[idCliente].cantidad++
//       return acumulador
//     },
//     {}
//   )

//   // Obtener el top 10 de clientes con más proyectos
//   const top10Clientes: any = Object.values(proyectosPorCliente)
//     .sort(
//       (clienteA: any, clienteB: any) => clienteB.cantidad - clienteA.cantidad
//     )
//     .slice(0, 100)

//   const maxProjects = Math.max(
//     ...top10Clientes.map((cliente: any) => cliente.cantidad)
//   )

//   // Convertir los datos agrupados en un formato adecuado para el gráfico
//   const newData = {
//     labels: top10Clientes.map((cliente: any) => cliente.nombreApellido),
//     datasets: [
//       {
//         label: 'Cantidad de Proyectos',
//         data: top10Clientes.map((cliente: any) => cliente.cantidad),
//         fill: false,
//         backgroundColor: [
//           'rgba(255, 99, 132, 0.2)',
//           'rgba(255, 206, 86, 0.2)',
//           'rgba(54, 162, 235, 0.2)',
//           'rgba(75, 192, 192, 0.2)',
//           'rgba(153, 102, 255, 0.2)',
//           'rgba(255, 159, 64, 0.2)'
//         ],
//         borderColor: [
//           'rgba(255, 99, 132, 1)',
//           'rgba(255, 206, 86, 1)',
//           'rgba(54, 162, 235, 1)',
//           'rgba(75, 192, 192, 1)',
//           'rgba(153, 102, 255, 1)',
//           'rgba(255, 159, 64, 1)'
//         ],
//         borderWidth: 2
//       }
//     ]
//   }

//   return (
//     <>
//       <div className="flex justify-between px-4">
//         <h1 className="w-full text-left text-gray-600 font-semibold text-xl ">
//           Top 100 clientes
//         </h1>
//         <MdOutlineZoomOutMap
//           className="text-2xl text-gray-600 cursor-pointer hover:text-gray-700 hover:scale-105"
//           onClick={() => {
//             if (selectedId == '1') {
//               setSelectedId(null)
//             } else {
//               setSelectedId('1')
//             }
//           }}
//         />
//       </div>
//       {/* <Bar
//         data={newData}
//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         // @ts-expect-error
//         options={options}
//         className="m-auto p-4 object-contain graficaas"
//         /> */}
//       <div className="relative py-3 w-full md:w-auto">
//         <div className="bg-white rounded-xl p-2 flex flex-col space-y-1 ">
//           {newData.labels.map((label: any, index: any) => (
//             <div key={index} className="flex items-center space-x-3">
//               <div
//                 className="w-20"
//                 style={{
//                   width: `${
//                     (top10Clientes[index].cantidad / maxProjects) * 100
//                   }%`
//                 }}
//               >
//                 <div className="h-3 bg-[#7bc9c9] rounded-full"></div>
//               </div>
//               <div className="text-black text-sm font-bold line-clamp-1">{label}</div>
//             </div>
//           ))}
//         </div>
//       </div>
//     </>
//   )
// }
