// import {
//   type Dispatch,
//   type SetStateAction,
//   forwardRef,
//   type ReactElement,
//   type Ref,
//   useState,
//   useEffect,
//   useRef
// } from 'react'

// import Dialog from '@mui/material/Dialog'
// import DialogContent from '@mui/material/DialogContent'
// import Slide from '@mui/material/Slide'
// import { type TransitionProps } from '@mui/material/transitions'
// import {
//   BsCaretLeft,
//   BsPlusCircle
// } from 'react-icons/bs'
// import { IoIosSend } from 'react-icons/io'
// import Swal from 'sweetalert2'
// import useAuth from '../../../../hooks/useAuth'
// import axios from 'axios'
// import { Global } from '../../../../helper/Global'
// import { AlertSucess } from '../../../shared/alerts/AlertSucess'
// import { AnimatePresence } from 'framer-motion'
// import {
//   type valuesResumen,
//   type errorValues
// } from '../../../shared/schemas/Interfaces'
// import { DialogComentario } from './comentario/DialogComentario'
// // import { ListadoComentariosAdmin } from './comentario/ListadoComentariosAdmin'
// // import { ListadoComentariosColaboradores } from './comentario/ListadoComentariosColaboradores'

// interface values {
//   open: boolean
//   setOpen: Dispatch<SetStateAction<boolean>>
//   id: string | undefined
//   getOneBrief: () => Promise<void>
//   resumen: valuesResumen[]
//   setResumen: Dispatch<SetStateAction<valuesResumen[]>>
// }

// const Transition = forwardRef(function Transition (
//   props: TransitionProps & {
//     children: ReactElement<any, any>
//   },
//   ref: Ref<unknown>
// ) {
//   return <Slide direction="left" ref={ref} {...props} />
// })

// export const Chat = ({
//   open,
//   setOpen,
//   id,
//   getOneBrief,
//   resumen,
//   setResumen
// }: values): JSX.Element => {
//   const handleClose = (): void => {
//     setOpen(false)
//   }
//   const { auth } = useAuth()
//   const [openComentario, setOpenComentario] = useState(false)
//   const [loading, setLoading] = useState(false)
//   const [showError, setShowError] = useState<errorValues | null>(null)
//   const token = localStorage.getItem('token')
//   const [idEdicion, setIdEdicion] = useState<number | null>(null)
//   const [textoEditado, setTextoEditado] = useState('')
//   const [respuestaAdmin, setRespuestaAdmin] = useState('')
//   const [texto, setTexto] = useState('')

//   const obtenerFecha = (): string => {
//     const fecha = new Date()
//     return `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`
//   }

//   const obtenerHora = (): string => {
//     const fecha = new Date()
//     return `${fecha.getHours()}:${fecha
//       .getMinutes()
//       .toString()
//       .padStart(2, '0')}`
//   }

//   const agregarResumen = async (): Promise<void> => {
//     if (texto) {
//       setLoading(true)

//       if (resumen.length > 0) {
//         const ultimaEntrada = resumen[resumen.length - 1]

//         const partesDeFecha = ultimaEntrada.fecha.split('/')
//         const fechaFormateada = `${partesDeFecha[1]}/${partesDeFecha[0]}/${partesDeFecha[2]}`
//         const fechaUltimaEntrada = new Date(fechaFormateada)
//         const fechaActual = new Date()
//         // Comparar solo las partes de fecha (ignorar la hora)
//         const mismasFechas =
//           fechaUltimaEntrada.toDateString() == fechaActual.toDateString()
//         // Verificar si la hora actual es antes de las 6 a.m.
//         const antesDeLas6 = fechaActual.getHours() < 9
//         if (mismasFechas && !antesDeLas6) {
//           setShowError({
//             estado: 'warning',
//             texto: 'Solo puede registrar un resumen por dia'
//           })
//           setLoading(false)
//           return
//         }
//       }
//       // Crear el nuevo resumen primero
//       const nuevoResumen = {
//         id: Date.now(),
//         fecha: obtenerFecha(),
//         hora: obtenerHora(),
//         user: auth.name,
//         userId: auth.id,
//         texto,
//         respuesta: null,
//         respuestas: []
//       }

//       // Actualizar el estado y luego enviar los datos
//       setResumen((resumenesPrevios: valuesResumen[]): valuesResumen[] => {
//         const nuevosResumenes = [...resumenesPrevios, nuevoResumen]

//         const enviarDatos = async (): Promise<void> => {
//           const data = new FormData()
//           data.append('resumen', JSON.stringify(nuevosResumenes))
//           data.append('_method', 'PUT')
//           try {
//             const respuesta = await axios.post(
//               `${Global.url}/saveChat/${id ?? ''}`,
//               data,
//               {
//                 headers: {
//                   Authorization: `Bearer ${
//                     token !== null && token !== '' ? token : ''
//                   }`
//                 }
//               }
//             )

//             if (respuesta.data.status == 'success') {
//               setShowError({
//                 estado: 'success',
//                 texto: 'Resumen subido correctamente'
//               })
//               getOneBrief()
//             } else {
//               Swal.fire('Error al subir', '', 'error')
//             }
//           } catch (error: unknown) {
//             Swal.fire('Error al subir', '', 'error')
//           }
//         }

//         enviarDatos()
//         return nuevosResumenes
//       })
//       setTexto('')
//       setLoading(false)
//     } else {
//       Swal.fire('Ingrese su resumen', '', 'warning')
//     }
//   }
//   //   saveChat
//   const endOfMessagesRef = useRef<null | HTMLDivElement>(null)

//   const scrollToBottom = (): void => {
//     endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
//   }

//   useEffect(() => {
//     scrollToBottom()
//   }, [resumen]) // Esto se ejecutará cada vez que `resumen` cambie

//   useEffect(() => {
//     setTimeout(() => {
//       if (showError != null) {
//         setShowError(null)
//       }
//     }, 3000)
//   }, [showError])

//   const permitirEdicion = (fechaResumen: string): boolean => {
//     const partesDeFecha = fechaResumen.split('/')
//     const fechaFormateada = `${partesDeFecha[1]}/${partesDeFecha[0]}/${partesDeFecha[2]}`
//     const fechaDelResumen = new Date(fechaFormateada)

//     const fechaActual = new Date()

//     // Verificar si estamos en el mismo día que el resumen
//     const mismoDia =
//       fechaDelResumen.toDateString() === fechaActual.toDateString()

//     // Verificar si la hora actual es antes de las 11:59 p.m.
//     const antesDeMedianoche =
//       fechaActual.getHours() < 23 ||
//       (fechaActual.getHours() === 23 && fechaActual.getMinutes() < 59)

//     return mismoDia && antesDeMedianoche
//   }

//   const editarResumen = async (
//     idIem: number,
//     nuevoTexto: string
//   ): Promise<void> => {
//     setLoading(true)
//     setResumen((resumenesPrevios) => {
//       const nuevosResumenes = resumenesPrevios.map((resu) => {
//         if (resu.id == idIem) {
//           return {
//             ...resu,
//             texto: nuevoTexto
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
//             `${Global.url}/saveChat/${id ?? ''}`,
//             data,
//             {
//               headers: {
//                 Authorization: `Bearer ${
//                   token !== null && token !== '' ? token : ''
//                 }`
//               }
//             }
//           )

//           if (respuesta.data.status == 'success') {
//             setTexto('')
//             setShowError({
//               estado: 'success',
//               texto: 'Resumen editado correctamente'
//             })
//             getOneBrief()
//           } else {
//             Swal.fire('Error al editar', '', 'error')
//           }
//         } catch (error: unknown) {
//           Swal.fire('Error al editar', '', 'error')
//         }
//       }

//       enviarDatos()
//       return nuevosResumenes
//     })

//     setLoading(false)
//     setIdEdicion(null) // Resetea el idEditando para salir del modo edición
//   }

//   const handleUpdate = (id: number, nuevoTexto: string): void => {
//     editarResumen(id, nuevoTexto)
//   }

//   const handleTextChange = (e: any): void => {
//     setTexto(e.target.value)
//     e.target.style.height = 'inherit'
//     // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
//     e.target.style.height = `${e.target.scrollHeight}px` // Ajusta la altura
//   }

//   const handleUpdateEdit = (e: any): void => {
//     setTextoEditado(e.target.value)
//     // Resetear la altura para calcular correctamente la altura basada en el contenido actual
//     e.target.style.height = 'inherit'
//     // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
//     e.target.style.height = `${e.target.scrollHeight}px`
//   }

//   const ordenarPorFecha = (a: valuesResumen, b: valuesResumen): number => {
//     // Convierte las fechas a un formato comparable si es necesario
//     const fechaA = a.fecha.split('/').reverse().join('-')
//     const fechaB = b.fecha.split('/').reverse().join('-')

//     return new Date(fechaA).getTime() - new Date(fechaB).getTime()
//   }

//   const resumenOrdenado = [...resumen].sort(ordenarPorFecha)

//   return (
//     <>
//       <Dialog
//         open={open}
//         TransitionComponent={Transition}
//         keepMounted
//         onClose={handleClose}
//         aria-describedby="alert-dialog-slide-description"
//         className="dialog_chat"
//       >
//         <DialogContent>
//           <section className="w-full h-screen flex flex-col justify-between">
//             <header className="flex items-center w-full bg-main px-4 py-2 h-fit relative">
//               <BsCaretLeft
//                 className="text-white text-3xl absolute left-3 top-0 bottom-0 my-auto cursor-pointer"
//                 onClick={handleClose}
//               />
//               <h2 className="text-center text-white font-bold w-full text-xl">
//                 RESUMEN DIARIO
//               </h2>
//               <BsPlusCircle
//                 className="text-white text-2xl absolute right-3 top-0 bottom-0 my-auto cursor-pointer"
//                 onClick={() => {
//                   setOpenComentario(true)
//                 }}
//               />
//             </header>
//             {/* <div className="w-full px-4 my-4 flex flex-col gap-4 h-auto overflow-y-auto flex-1">
//                 {auth.id_rol == 99
//                   ? <ListadoComentariosAdmin getOneBrief={getOneBrief} resumen={resumen} setResumen={setResumen} resumenOrdenado={resumenOrdenado} id={id} setRespuestaAdmin={setRespuestaAdmin} loading={loading} respuestaAdmin={respuestaAdmin} endOfMessagesRef={endOfMessagesRef}/>
//                   : <ListadoComentariosColaboradores setResumen={setResumen} getOneBrief={getOneBrief} id={id} resumen={resumen}
//                   handleUpdate={handleUpdate} handleUpdateEdit={handleUpdateEdit} textoEditado={textoEditado} idEdicion={idEdicion} permitirEdicion={permitirEdicion} setIdEdicion={setIdEdicion} setTextoEditado={setTextoEditado} resumenOrdenado={resumenOrdenado} endOfMessagesRef={endOfMessagesRef}/> }
//             </div> */}
//             <div className="h-fit w-full flex items-end justify-center border border-t-gray-300 relative">
//               <textarea
//                 placeholder="Escribir resumen"
//                 className="w-full h-full pl-4 pr-14 outline-none py-4 resize-none overflow-hidden"
//                 disabled={loading}
//                 rows={1}
//                 value={texto}
//                 onChange={handleTextChange}
//               ></textarea>
//               {(auth.id == '8' || auth.id_rol != 99) && !loading
//                 ? (
//                 <IoIosSend
//                   className="absolute bottom-2 right-5 z-10 text-4xl text-main rounded-full p-1 cursor-pointer"
//                   onClick={() => {
//                     agregarResumen()
//                   }}
//                 />
//                   )
//                 : (
//                 <IoIosSend className="absolute bottom-2 right-5 z-10 text-4xl text-main/60 rounded-full p-1 cursor-pointer" />
//                   )}
//             </div>
//           </section>
//         </DialogContent>
//       </Dialog>
//       <AnimatePresence>
//         {showError != null && <AlertSucess showError={showError} />}
//       </AnimatePresence>

//       <DialogComentario
//         open={openComentario}
//         setOpen={setOpenComentario}
//         resumen={resumen}
//         setResumen={setResumen}
//         id={id}
//         getOneBrief={getOneBrief}
//       />
//     </>
//   )
// }
