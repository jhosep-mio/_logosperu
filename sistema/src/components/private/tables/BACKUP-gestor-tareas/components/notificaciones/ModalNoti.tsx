// import 'moment/locale/es'
// import 'react-big-calendar/lib/css/react-big-calendar.css'
// import useAuth from '../../../../../../hooks/useAuth'
// import { Dialog, DialogContent } from '@mui/material'
// import Swal from 'sweetalert2'
// import { useEffect, useState } from 'react'
// import musica from './../../../../../../assets/sonido/notificate.mp3'
// import { Howl } from 'howler'
// import ListadoNoti from './ListadoNoti'

// export const ModalNoti = (): JSX.Element => {
//   const { openModalShared, setOpenModalShared, tasks, allTareas } = useAuth()
//   const [isTaskNotified, setIsTaskNotified] = useState(false)
//   const [isTaskNotified2, setIsTaskNotified2] = useState(false)
//   const [mas, setMas] = useState('15')

//   useEffect(() => {
//     tasks?.forEach((task) => {
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-expect-error
//       const idTask = JSON.parse(task.task).idTablero
//       // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//       // @ts-expect-error
//       const idContenido = JSON.parse(task.task).idTarjeta
//       if (!isTaskNotified) {
//         let tareasFiltradas = {}
//         let gestorTareas = []
//         allTareas.forEach((objeto: any) => {
//           if (objeto) {
//             gestorTareas = JSON.parse(objeto.gestor_tareas)
//             gestorTareas.forEach((tarea: any) => {
//               if (tarea.id === idTask) {
//                 tarea?.contenido?.forEach((contenido: any) => {
//                   contenido?.contenido?.forEach((contenidoFinal: any) => {
//                     if (contenidoFinal.id == idContenido) {
//                       tareasFiltradas = contenidoFinal
//                     }
//                   })
//                 })
//               }
//             })
//           }
//         })
//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         // @ts-expect-error
//         if (!tareasFiltradas?.contexto?.fecha) {
//           return null
//         }
//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         // @ts-expect-error
//         const taskDeadline = new Date(tareasFiltradas?.contexto?.fecha)
//         const currentDate = new Date()
//         const timeDifference = taskDeadline.getTime() - currentDate.getTime()
//         const hoursDifference = timeDifference / (1000 * 60 * 60)
//         let notificationMessage = { estado: '', texto: '' }
//         if (hoursDifference <= 0) {
//           notificationMessage = { estado: 'vencio', texto: 'La tarea vencio' }
//         } else if (hoursDifference <= 1) {
//           notificationMessage = {
//             estado: 'pendiente',
//             texto: 'La tarea vence en menos de 1 hora.'
//           }
//         }
//         if (notificationMessage.estado === 'pendiente') {
//           Swal.fire({
//             icon: 'warning',
//             title: 'Tareas por vencer',
//             confirmButtonColor: '#3085d6',
//             confirmButtonText: 'Revisar'
//           }).then((result) => {
//             if (result.isConfirmed) {
//               setOpenModalShared(true)
//             }
//           })
//         }
//         setIsTaskNotified(true)
//       }
//     })
//   }, [tasks, allTareas, isTaskNotified])

//   useEffect(() => {
//     const interval = setInterval(() => {
//       tasks?.forEach((task) => {
//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         // @ts-expect-error
//         const idTask = JSON.parse(task.task).idTablero
//         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//         // @ts-expect-error
//         const idContenido = JSON.parse(task.task).idTarjeta
//         if (!isTaskNotified2) {
//           let tareasFiltradas = {}
//           let gestorTareas = []
//           allTareas.forEach((objeto: any) => {
//             if (objeto) {
//               gestorTareas = JSON.parse(objeto.gestor_tareas)
//               gestorTareas.forEach((tarea: any) => {
//                 if (tarea.id === idTask) {
//                   tarea?.contenido?.forEach((contenido: any) => {
//                     contenido?.contenido?.forEach((contenidoFinal: any) => {
//                       if (contenidoFinal.id == idContenido) {
//                         tareasFiltradas = contenidoFinal
//                       }
//                     })
//                   })
//                 }
//               })
//             }
//           })
//           // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//           // @ts-expect-error
//           if (!tareasFiltradas?.contexto?.fecha) {
//             return null
//           }
//           // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//           // @ts-expect-error
//           const taskDeadline = new Date(tareasFiltradas?.contexto?.fecha)
//           const currentDate = new Date()
//           if (
//             taskDeadline.getFullYear() === currentDate.getFullYear() &&
//             taskDeadline.getMonth() === currentDate.getMonth() &&
//             taskDeadline.getDate() === currentDate.getDate() &&
//             taskDeadline.getHours() === currentDate.getHours() &&
//             taskDeadline.getMinutes() === currentDate.getMinutes()
//           ) {
//             showNotification()
//             setIsTaskNotified2(true)
//           }

//           const oneHourBeforeDeadline = new Date(
//             taskDeadline.getTime() - 60 * 60 * 1000
//           ) // Restar una hora en milisegundos
//           if (
//             oneHourBeforeDeadline.getFullYear() === currentDate.getFullYear() &&
//             oneHourBeforeDeadline.getMonth() === currentDate.getMonth() &&
//             oneHourBeforeDeadline.getDate() === currentDate.getDate() &&
//             oneHourBeforeDeadline.getHours() === currentDate.getHours() &&
//             oneHourBeforeDeadline.getMinutes() === currentDate.getMinutes()
//           ) {
//             setIsTaskNotified2(true)
//             Swal.fire({
//               icon: 'success',
//               title: 'Tareas por vencer',
//               confirmButtonColor: '#3085d6',
//               confirmButtonText: 'Revisar'
//             }).then((result) => {
//               if (result.isConfirmed) {
//                 setOpenModalShared(true)
//               }
//             })
//           }
//         }
//       })
//     }, 10000) // Verificar cada 60 segundos
//     return () => {
//       clearInterval(interval)
//     } // Limpiar el temporizador al desmontar el componente
//   }, [tasks, allTareas, isTaskNotified2])

//   const showNotification = (): void => {
//     const sound = new Howl({
//       src: [musica]
//     })
//     sound.play()
//     // Mostrar la notificación
//     Swal.fire({
//       icon: 'success',
//       title: 'Es hora de la tarea',
//       confirmButtonColor: '#3085d6',
//       confirmButtonText: 'Revisar'
//     }).then((result) => {
//       if (result.isConfirmed) {
//         setOpenModalShared(true)
//         sound.stop()
//       }
//     })
//   }

//   return (
//     <Dialog
//       open={openModalShared}
//       scroll={'body'}
//       onClose={() => {
//         setOpenModalShared(false)
//       }}
//       aria-labelledby="alert-dialog-title"
//       aria-describedby="alert-dialog-description"
//       className="modal_citas_clientes2"
//     >
//       <DialogContent className="w-full min-h-[600px] bg-[#F1F2F4] relative overflow-hidden">
//         <span
//           className="absolute top-2 right-2 text-2xl text-main"
//         >
//           X
//         </span>
//         <div className="flex gap-3 items-center border-b border-gray-300 py-1 pb-4">
//           <div className="flex flex-col justify-center">
//             <h1 className="text-black font-bold text-sm md:text-lg">
//               Notificaciones 2
//             </h1>
//             <div className="flex gap-2 justify-start">
//               <span className="text-gray-600 text-sm">Logos Perú</span>
//             </div>
//           </div>
//         </div>
//         <section className="w-full p-0 relative">
//           <div className="w-full h-full pt-4">
//             <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
//               <ListadoNoti
//                 allTareas={allTareas}
//                 tasks={tasks}
//                 mas={mas}
//                 setMas={setMas}
//                 setOpenModalShared={setOpenModalShared}
//               />
//             </div>
//             <span
//               className="block w-full text-center mt-4 font-semibold text-blue-500 hover:underline transition-all cursor-pointer"
//               onClick={() => {
//                 setMas(mas == '15' ? '100' : '15')
//               }}
//             >
//               {mas == '15' ? 'Ver mas' : 'Ver menos'}
//             </span>
//           </div>
//         </section>
//       </DialogContent>
//     </Dialog>
//   )
// }
