// import { BsPencilSquare, BsPerson } from 'react-icons/bs'
// import {
//   type Dispatch,
//   type SetStateAction,
//   type LegacyRef,
//   useState,
//   useEffect
// } from 'react'
// import {
//   type errorValues,
//   type valuesResumen
// } from '../../../../shared/schemas/Interfaces'
// import { chat } from '../../../../shared/Images'
// import { fechaFormateada } from '../../../../shared/functions/GenerarTextoEnLetras'
// import { AlertSucess } from '../../../../shared/alerts/AlertSucess'
// import { AnimatePresence } from 'framer-motion'
// import { FaSave } from 'react-icons/fa'
// import { ModalRespuestaColaborador } from '../modalRespuesta.tsx/ModalRespuestaColaborador'

// export const ListadoComentariosColaboradores = ({
//   id,
//   resumenOrdenado,
//   endOfMessagesRef,
//   resumen,
//   setResumen,
//   permitirEdicion,
//   getOneBrief,
//   idEdicion,
//   setIdEdicion,
//   textoEditado,
//   setTextoEditado,
//   handleUpdateEdit,
//   handleUpdate
// }: {
//   id: string | undefined
//   resumen: valuesResumen[]
//   resumenOrdenado: valuesResumen[]
//   endOfMessagesRef: LegacyRef<HTMLDivElement> | undefined
//   permitirEdicion: (fechaResumen: string) => boolean
//   idEdicion: number | null
//   getOneBrief: () => Promise<void>
//   setIdEdicion: Dispatch<SetStateAction<number | null>>
//   textoEditado: string
//   setResumen: Dispatch<SetStateAction<valuesResumen[]>>
//   setTextoEditado: Dispatch<SetStateAction<string>>
//   handleUpdateEdit: (e: any) => void
//   handleUpdate: (id: number, nuevoTexto: string) => void
// }): JSX.Element => {
//   const [showError, setShowError] = useState<errorValues | null>(null)
//   const [open, setOpen] = useState(false)
//   const [idItem, setIdItem] = useState<number | null>(null)
//   const [fechaadmin, setFechaadmin] = useState<string | null>(null)

//   useEffect(() => {
//     setTimeout(() => {
//       if (showError != null) {
//         setShowError(null)
//       }
//     }, 3000)
//   }, [showError])

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
//                 <div
//                   className="text-justify bg-white p-4 rounded-l-xl relative w-[93%] ml-3
//                     before:bg-white before:absolute before:left-[99%] before:h-full before:w-[7%] before:top-0 before:bottom-0
//                         clip_chat lowercase first-letter:uppercase text-base
//                     "
//                 >
//                   {permitirEdicion(resu.fecha) && idEdicion == resu.id
//                     ? <FaSave
//                       className="text-xl hover:text-green-500 transition-colors cursor-pointer absolute top-2 right-6 z-10"
//                       onClick={() => {
//                         handleUpdate(resu.id, textoEditado)
//                       }}
//                     />
//                     : permitirEdicion(resu.fecha) && (
//                     <BsPencilSquare
//                       className="text-xl hover:text-green-500 transition-colors cursor-pointer absolute top-2 right-6 z-10"
//                       onClick={() => {
//                         setIdEdicion(resu.id)
//                         setTextoEditado(resu.texto)
//                         // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//                         // @ts-expect-error
//                         inputRef.current.focus()
//                       }}
//                     />
//                     )}

//                   <span className="w-full flex justify-start uppercase items-center gap-3 mb-3 font-bold">
//                     <BsPerson className="bg-[#F1F1F1] text-3xl rounded-full p-1" />{' '}
//                     {resu.user}
//                   </span>
//                   {permitirEdicion(resu.fecha) && idEdicion == resu.id
//                     ? (
//                     <textarea
//                       className="w-full h-full pl-4 pr-14 outline-none py-4 resize-none overflow-hidden min-h-[200px]"
//                       rows={1}
//                       onFocus={handleUpdateEdit}
//                       onChange={handleUpdateEdit}
//                       value={textoEditado}
//                     ></textarea>
//                       )
//                     : (
//                     <p>{resu.texto}</p>
//                       )}
//                   <span className="w-full flex justify-end text-gray-400">
//                     {resu.hora}
//                   </span>
//                 </div>
//               </div>

//               {resu?.respuesta?.texto && (
//                 <>
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
//                       {fechaFormateada(resu.respuesta.hora)}
//                     </span>
//                   </div>
//                 </>
//               )}
//               {/* NUEVOS COMENTARIOS */}
//               {resu?.respuestas?.map((respues, index: number) => (
//                 <>
//                 {index === 0 && !resu.respuestas.some(respues => respues.user !== 'Logos Perú') &&
//                     <button onClick={() => { setOpen(true); setIdItem(resu.id); setFechaadmin(resu.fecha) }}
//                     className='bg-red-500 hover:bg-red-700 transition-colors rounded-xl w-fit mx-auto px-4 py-1 text-white font-bold'>Responder</button>
//                 }
//                     <div
//                     key={respues.id}
//                     className={`text-justify ${respues.user == 'Logos Perú' ? 'bg-green-300 before:bg-green-300' : 'bg-white before:bg-white'}  relative w-[89%] ml-8
//                             before:absolute before:right-[99%] before:h-full before:w-[7%] before:top-0 before:bottom-0
//                                 clip_chat2  text-base py-2`}
//                     >
//                     <span className="w-full flex justify-start uppercase items-center gap-3 mb-3 font-bold">
//                         <BsPerson className="bg-[#F1F1F1] text-3xl rounded-full p-1" />{' '}
//                         {respues.user == 'Logos Perú' ? 'ADMINISTRACION' : respues.user}
//                     </span>
//                     <p className={`w-full h-fit pl-4 pr-14 outline-none placeholder:text-black/60 py-4 resize-none overflow-hidden ${respues.user == 'Logos Perú' ? 'bg-green-300' : 'bg-white'} text-black"`}>
//                         {respues.texto}
//                     </p>
//                     <span className="w-full block text-right px-2 text-sm">
//                         {respues.fecha} - {respues.hora}
//                     </span>
//                     </div>
//                 </>
//               ))}

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
//         <ModalRespuestaColaborador open={open} id={id} setOpen={setOpen} setResumen={setResumen} getOneBrief={getOneBrief} resumen={resumen} idIem={idItem} fechaadmin={fechaadmin} setShowError={setShowError}/>
//       <AnimatePresence>
//         {showError != null && <AlertSucess showError={showError} />}
//       </AnimatePresence>
//     </>
//   )
// }
