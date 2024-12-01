// import { BsFillTrash2Fill, BsPencilSquare, BsPerson, BsReplyAllFill } from 'react-icons/bs'
// import { type Dispatch, type SetStateAction, type LegacyRef, useState, useEffect } from 'react'
// import { type errorValues, type valuesResumen } from '../../../../shared/schemas/Interfaces'
// import { chat } from '../../../../shared/Images'
// import { fechaFormateada } from '../../../../shared/functions/GenerarTextoEnLetras'
// import { FaSave } from 'react-icons/fa'
// import { ModalRespuesta } from '../modalRespuesta.tsx/ModalRespuesta'
// import axios from 'axios'
// import { Global } from '../../../../../helper/Global'
// import { AlertSucess } from '../../../../shared/alerts/AlertSucess'
// import { AnimatePresence } from 'framer-motion'
// import Swal from 'sweetalert2'

// export const ListadoComentariosAdmin = ({
//   resumen,
//   setResumen,
//   resumenOrdenado,
//   setRespuestaAdmin,
//   loading,
//   id,
//   respuestaAdmin,
//   getOneBrief,
//   endOfMessagesRef
// }: {
//   resumen: valuesResumen[]
//   setResumen: Dispatch<SetStateAction<valuesResumen[]>>
//   resumenOrdenado: valuesResumen[]
//   setRespuestaAdmin: Dispatch<SetStateAction<string>>
//   loading: boolean
//   id: string | undefined
//   respuestaAdmin: string
//   getOneBrief: () => Promise<void>
//   endOfMessagesRef: LegacyRef<HTMLDivElement> | undefined
// }): JSX.Element => {
//   const handleTextAdmin = (e: any): void => {
//     setRespuestaAdmin(e.target.value)
//     e.target.style.height = 'inherit'
//     // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
//     e.target.style.height = `${e.target.scrollHeight}px` // Ajusta la altura
//   }

//   const [open, setOpen] = useState(false)
//   const [idAdd, setIdAdd] = useState<number | null>(null)
//   const [idEdicion, setIdEdicion] = useState<number | null>(null)
//   const [showError, setShowError] = useState<errorValues | null>(null)
//   const token = localStorage.getItem('token')
//   useEffect(() => {
//     setTimeout(() => {
//       if (showError != null) {
//         setShowError(null)
//       }
//     }, 3000)
//   }, [showError])

//   const editarResumen = async (idResumen: number | null, idRespuesta: number | null, nuevoTexto: string): Promise<void> => {
//     // Crear el nuevo estado de resúmenes con la respuesta editada
//     setResumen((resumenesPrevios) => {
//       const nuevosResumenes = resumenesPrevios.map((resu) => {
//         if (resu.id == idResumen) {
//           const respuestasEditadas = resu.respuestas.map((resp) =>
//             resp.id == idRespuesta
//               ? {
//                   ...resp,
//                   texto: nuevoTexto
//                 }
//               : resp
//           )

//           return {
//             ...resu,
//             respuestas: respuestasEditadas
//           }
//         }
//         return resu
//       })
//       const enviarDatos = async (): Promise<void> => {
//         const data = new FormData()
//         data.append('resumen', JSON.stringify(nuevosResumenes))
//         data.append('_method', 'PUT')
//         try {
//           const respuesta = await axios.post(
//               `${Global.url}/saveChat/${id ?? ''}`,
//               data,
//               {
//                 headers: {
//                   Authorization: `Bearer ${
//                     token !== null && token !== '' ? token : ''
//                   }`
//                 }
//               }
//           )
//           if (respuesta.data.status == 'success') {
//             setRespuestaAdmin('')
//             setShowError({
//               estado: 'success',
//               texto: 'Respuesta actualizada'
//             })
//             getOneBrief()
//           } else {
//             setShowError({
//               estado: 'warning',
//               texto: 'Error al actualizar'
//             })
//           }
//         } catch (error: unknown) {
//           setShowError({
//             estado: 'warning',
//             texto: 'Error al actualizar'
//           })
//         }
//       }
//       enviarDatos()
//       return nuevosResumenes
//     })
//     // Limpiar el estado de edición
//     setIdEdicion(null)
//   }

//   const eliminarResumen = async (idResumen: number | null, idRespuesta: number | null): Promise<void> => {
//     const confirmacion = await Swal.fire({
//       title: '¿Estás seguro?',
//       text: 'La respuesta seleccionada será eliminada.',
//       icon: 'warning',
//       showCancelButton: true,
//       confirmButtonColor: '#3085d6',
//       cancelButtonColor: '#d33',
//       confirmButtonText: 'Sí, eliminar',
//       cancelButtonText: 'Cancelar'
//     })
//     if (!confirmacion.isConfirmed) {
//       // Si el usuario cancela, no hacemos nada
//       return
//     }
//     setResumen((resumenesPrevios) => {
//       const nuevosResumenes = resumenesPrevios.map((resu) => {
//         if (resu.id === idResumen) {
//           const respuestasSinEliminar = resu.respuestas.filter((resp) => resp.id !== idRespuesta)
//           return {
//             ...resu,
//             respuestas: respuestasSinEliminar
//           }
//         }
//         return resu
//       })
//       const enviarDatos = async (): Promise<void> => {
//         const data = new FormData()
//         data.append('resumen', JSON.stringify(nuevosResumenes))
//         data.append('_method', 'PUT')

//         try {
//           const respuesta = await axios.post(
//               `${Global.url}/saveChat/${id ?? ''}`,
//               data,
//               {
//                 headers: {
//                   Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
//                 }
//               }
//           )

//           if (respuesta.data.status === 'success') {
//             setRespuestaAdmin('')
//             setShowError({
//               estado: 'success',
//               texto: 'Comentario eliminado'
//             })
//             getOneBrief()
//           } else {
//             setShowError({
//               estado: 'warning',
//               texto: 'Error al eliminar'
//             })
//           }
//         } catch (error: unknown) {
//           setShowError({
//             estado: 'warning',
//             texto: 'Error al eliminar'
//           })
//         }
//       }
//       enviarDatos()
//       return nuevosResumenes
//     })

//     // Limpiar el estado de edición
//     setIdEdicion(null)
//   }

//   return (
//     <>
//       {resumenOrdenado.length > 0
//         ? resumenOrdenado.map((resu: valuesResumen, index: number) => (
//           <>
//             <div className="flex flex-col gap-2" key={index}>
//               <div className="w-full flex justify-center">
//                 <span className="bg-gray-300 px-4 rounded-xl text-black">
//                   {resu.fecha}
//                 </span>
//               </div>
//               <div className="relative">
//                 {/* USUARIO */}
//                 <BsReplyAllFill
//                   className="text-xl hover:text-green-500 transition-colors cursor-pointer absolute top-2 right-6 z-10"
//                   onClick={() => {
//                     setOpen(true)
//                     setIdAdd(resu.id)
//                   }}
//                 />
//                 <div
//                   className="text-justify bg-white p-4 rounded-l-xl relative w-[93%] ml-3
//                     before:bg-white before:absolute before:left-[99%] before:h-full before:w-[7%] before:top-0 before:bottom-0
//                         clip_chat lowercase first-letter:uppercase text-base
//                     "
//                 >
//                   <span className="w-full flex justify-start uppercase items-center gap-3 mb-3 font-bold">
//                     <BsPerson className="bg-[#F1F1F1] text-3xl rounded-full p-1" />{' '}
//                     {resu.user}
//                   </span>
//                   <p>{resu.texto}</p>
//                   <span className="w-full flex justify-end text-gray-400">
//                     {resu.hora}
//                   </span>
//                 </div>
//                 {/* END- USUARIO */}
//               </div>
//              {resu?.respuesta?.texto &&
//                   <>
//                   <div
//                     className=" text-justify bg-green-300 relative w-[89%] ml-8
//                           before:bg-green-300 before:absolute before:right-[99%] before:h-full before:w-[7%] before:top-0 before:bottom-0
//                               clip_chat2  text-base py-2"
//                   >
//                     <span className="w-full flex justify-start uppercase items-center gap-3 mb-3 font-bold">
//                       <BsPerson className="bg-[#F1F1F1] text-3xl rounded-full p-1" />{' '}
//                       Administración
//                     </span>
//                     <p className="w-full h-fit pl-4 pr-14 outline-none placeholder:text-black/60 py-4 resize-none overflow-hidden bg-green-300 text-black">
//                       {resu.respuesta?.texto}
//                     </p>
//                     <span className="w-full block text-right px-2">
//                         {fechaFormateada(resu.respuesta.hora)}
//                     </span>
//                   </div>
//                 </>}
//                 {/* NUEVOS COMENTARIOS */}
//                 {resu?.respuestas?.map((respues) => (
//                     <div key={respues.id}
//                     className={`text-justify ${respues.user == 'Logos Perú' ? 'bg-green-300 before:bg-green-300' : 'bg-white before:bg-white'}  relative w-[89%] ml-8
//                             before:absolute before:right-[99%] before:h-full before:w-[7%] before:top-0 before:bottom-0
//                                 clip_chat2  text-base py-2`}
//                   >
//                     {idEdicion && idEdicion == respues.id
//                       ? <FaSave
//                         className="text-lg hover:text-green-500 transition-colors cursor-pointer absolute top-2 right-10 z-10"
//                         onClick={() => {
//                           editarResumen(resu.id, respues.id, respuestaAdmin)
//                         }}
//                     />
//                       : <BsPencilSquare
//                       className="text-lg hover:text-green-500 transition-colors cursor-pointer absolute top-2 right-10 z-10"
//                       onClick={() => {
//                         if (respues.texto != null) {
//                           setRespuestaAdmin(respues.texto)
//                         }
//                         setIdEdicion(respues.id)
//                         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//                         // @ts-expect-error
//                         inputRef.current.focus()
//                       }}
//                     />
//                     }

//                     {<BsFillTrash2Fill
//                       className="text-lg hover:text-red-500 transition-colors cursor-pointer absolute top-2 right-3 z-10"
//                       onClick={() => {
//                         eliminarResumen(resu.id, respues.id)
//                       }}
//                     />
//                     }
//                     <span className="w-full flex justify-start uppercase items-center gap-3 mb-3 font-bold">
//                       <BsPerson className="bg-[#F1F1F1] text-3xl rounded-full p-1" />{' '}
//                       {respues.user == 'Logos Perú' ? 'ADMINISTRACION' : respues.user}
//                     </span>
//                     {idEdicion && idEdicion == respues.id
//                       ? <textarea
//                             placeholder="Respuesta..."
//                             className={`w-full h-fit pl-4 pr-14 outline-none placeholder:text-black/60 py-4 resize-none overflow-hidden ${respues.user == 'Logos Perú' ? 'bg-green-300' : 'bg-white'} text-black`}
//                             disabled={loading}
//                             rows={1}
//                             value={respuestaAdmin}
//                             onFocus={handleTextAdmin}
//                             onChange={handleTextAdmin}
//                         ></textarea>
//                       : (
//                     <p className={`w-full h-fit pl-4 pr-14 outline-none placeholder:text-black/60 py-4 resize-none overflow-hidden ${respues.user == 'Logos Perú' ? 'bg-green-300' : 'bg-white'} text-black"`}>
//                       {respues.texto}
//                     </p>)}
//                     <span className="w-full block text-right px-2 text-sm">
//                     {respues.fecha} - {respues.hora}
//                     </span>
//                   </div>
//                 )) }
//             </div>
//             <div ref={endOfMessagesRef} />
//           </>
//         ))
//         : (
//         <div className="w-full flex flex-col gap-4">
//           <p className="text-gray-500 text-center text-xl">
//             No tiene comentarios para este proyecto
//           </p>
//           <img src={chat} alt="" className="w-52 object-contain mx-auto" />
//         </div>
//           )}
//       <AnimatePresence>
//         {showError != null && <AlertSucess showError={showError} />}
//       </AnimatePresence>
//         <ModalRespuesta open={open} setOpen={setOpen} resumen={resumen} setResumen={setResumen} idIem={idAdd} id={id} getOneBrief={getOneBrief} setShowError={setShowError} />
//     </>
//   )
// }
