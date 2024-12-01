// /* eslint-disable multiline-ternary */
// /* eslint-disable @typescript-eslint/no-misused-promises */
// /* eslint-disable @typescript-eslint/restrict-template-expressions */
// import { useEffect, useState } from 'react'
// import { Link, useParams } from 'react-router-dom'
// import { Loading } from '../../../../shared/Loading'
// import axios from 'axios'
// import { Global } from '../../../../../helper/Global'
// import Grafico1 from './components/Grafico1'
// // import { toast } from 'sonner'
// import useAuth from '../../../../../hooks/useAuth'
// import GraficoClicks from './components/Grafico2'

// export const ResultadosMails = (): JSX.Element => {
//   const { id } = useParams()
//   const { setTitle } = useAuth()
//   const token = localStorage.getItem('token')
//   const [camapana, setCampana] = useState<any>([])
//   const [loading, setLoading] = useState(true)
//   const [clientes, setClientes] = useState<any>([])

//   const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

//   const toggleAccordion = (index: number): void => {
//     setExpandedIndex(expandedIndex == index ? null : index)
//   }

//   const getOneBrief = async (): Promise<void> => {
//     try {
//       const { data } = await axios.get(
//         `${Global.url}/newsletter/getOneCamapanaPrivate/${id ?? ''}`,
//         {
//           headers: {
//             Authorization: `Bearer ${
//               token !== null && token !== '' ? `Bearer ${token}` : ''
//             }`
//           }
//         }
//       )
//       const { data: dataPreventas } = await axios.get(
//         `${Global.url}/indexCamapanas`,
//         {
//           headers: {
//             Authorization: `Bearer ${
//               token !== null && token !== '' ? `Bearer ${token}` : ''
//             }`
//           }
//         }
//       )
//       setCampana(data)
//       setClientes(dataPreventas)
//     } catch (error) {
//       console.log(error)
//     } finally {
//       setLoading(false)
//     }
//   }

//   //   const consultarCliente = async (correo: string): Promise<void> => {
//   //     setLoading(true)
//   //     try {
//   //       const { data } = await axios.get(
//   //         `${Global.url}/showClienteWhereEmail/${correo ?? ''}`,
//   //         {
//   //           headers: {
//   //             Authorization: `Bearer ${
//   //               token !== null && token !== '' ? `Bearer ${token}` : ''
//   //             }`
//   //           }
//   //         }
//   //       )
//   //       window.open(`/admin/lista-clientes/ver/${data.id}`, '_blank')
//   //     } catch (error) {
//   //       toast.error('Error al consultar cliente')
//   //       console.log(error)
//   //     } finally {
//   //       setLoading(false)
//   //     }
//   //   }

//   useEffect(() => {
//     setTitle('')
//     Promise.all([getOneBrief()]).then(() => {
//       setLoading(false)
//     })
//   }, [])

//   const correosAbiertos = camapana.abiertos
//     ? JSON.parse(camapana.abiertos)
//     : []

//   // Contar cuántos correos tienen clics
//   const correosConClicks = correosAbiertos.filter(
//     (correo: { clicks: any[] }) => correo.clicks && correo.clicks.length > 0
//   ).length

//   // Total de correos
//   const totalCorreos = camapana.correos
//     ? JSON.parse(camapana.correos).length
//     : 0

//   return (
//     <>
//       {loading ? (
//         <Loading />
//       ) : (
//         <div className="rounded-xl grid grid-cols-2">
//           <div className="col-span-2 flex justify-end">
//             <Link
//               to="/admin/newsletter/mails"
//               className="px-4 py-1 text-white rounded-md bg-red-600 hover:bg-red-800 transition-colors"
//             >
//               Regresar
//             </Link>
//           </div>
//           <div className="container mx-auto p-4">
//             <h1 className="text-2xl font-bold text-gray-800 mb-4">
//               Correos abiertos
//             </h1>
//             <div className="bg-white shadow-md rounded-lg overflow-hidden">
//               {camapana.abiertos &&
//                 JSON.parse(camapana.abiertos)
//                   ?.sort(
//                     (a: any, b: any) =>
//                       (b.clicks?.length || 0) - (a.clicks?.length || 0)
//                   )
//                   ?.map(
//                     (
//                       correo: { email: string, fechaHora: string, clicks: any },
//                       index: number
//                     ) => (
//                       <div key={index}>
//                         <div
//                           // onClick={async () => {
//                           //   await consultarCliente(correo.email)
//                           // }}
//                           onClick={() => {
//                             toggleAccordion(index)
//                           }}
//                           className="flex justify-between items-center border-b cursor-pointer border-gray-200 px-4 py-3 hover:bg-gray-100"
//                         >
//                           <div>
//                             <p className="text-gray-700 text-sm">
//                               {clientes
//                                 .filter(
//                                   (cliente: any) =>
//                                     cliente.email == correo.email
//                                 )
//                                 .map(
//                                   (cliente: any) =>
//                                     `${cliente.nombres} ${cliente.apellidos}`
//                                 )}
//                             </p>
//                             <p className="text-gray-500 text-xs">
//                               {new Date(correo.fechaHora).toLocaleString()}
//                             </p>
//                           </div>
//                           <span className="text-green-500 font-semibold text-sm">
//                             Abierto
//                           </span>
//                         </div>
//                         {expandedIndex === index && correo.clicks && (
//                           <div className="px-4 py-2 bg-gray-50">
//                             <h3 className="text-sm font-semibold text-gray-800 mb-2">
//                               Enlaces visitados:
//                             </h3>
//                             <ul>
//                               {correo.clicks.map(
//                                 (click: any, clickIndex: number) => (
//                                   <li key={clickIndex} className="mb-1">
//                                     <a
//                                       href={click.link}
//                                       target="_blank"
//                                       rel="noopener noreferrer"
//                                       className="text-blue-600 hover:underline"
//                                     >
//                                       {click.link}
//                                     </a>
//                                     <p className="text-xs text-gray-500">
//                                       Clickeado el:{' '}
//                                       {new Date(
//                                         click.fechaHora
//                                       ).toLocaleString()}
//                                     </p>
//                                   </li>
//                                 )
//                               )}
//                             </ul>
//                           </div>
//                         )}
//                       </div>
//                     )
//                   )}
//             </div>
//           </div>
//           <div className="w-full flex flex-col gap-10">
//             <div className="container mx-auto p-4">
//               <h1 className="text-2xl font-bold text-gray-800 mb-4">
//                 Grafico 1
//               </h1>
//               <Grafico1
//                 totalCorreos={
//                   camapana.correos ? JSON.parse(camapana.correos).length : 0
//                 }
//                 correosAbiertos={
//                   camapana.abiertos ? JSON.parse(camapana.abiertos).length : 0
//                 }
//               />
//             </div>
//             <div className="container mx-auto p-4 h-[450px]">
//               <h1 className="text-2xl font-bold text-gray-800 mb-4">
//                 Grafico 2
//               </h1>
//               <GraficoClicks
//                 totalCorreos={totalCorreos}
//                 correosConClicks={correosConClicks}
//               />
//             </div>
//           </div>
//         </div>
//       )}
//     </>
//   )
// }
