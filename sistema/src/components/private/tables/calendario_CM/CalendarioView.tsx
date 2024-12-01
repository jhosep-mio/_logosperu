// import { useEffect, useState } from 'react'
// import useAuth from '../../../../hooks/useAuth'
// import { useParams } from 'react-router-dom'
// import moment from 'moment'
// import { Global } from '../../../../helper/Global'
// import axios from 'axios'
// import { Loading } from '../../../shared/Loading'
// import Editor from './Editor'
// import Swal from 'sweetalert2'

// export const CalendarioView = (): JSX.Element => {
//   const { setTitle, auth } = useAuth()
//   const { id, idContenido } = useParams()
//   const [eventsGeneral, setEventsGeneral] = useState<Event[]>([])
//   const [, setEvents] = useState<Event[]>([])
//   const [loading, setLoading] = useState(true)
//   const [contexto, setContexto] = useState('')
//   const token = localStorage.getItem('token')

//   const updateCita = async (updatedEvents: Event[]): Promise<void> => {
//     const data = new FormData()
//     data.append('community', JSON.stringify(updatedEvents))
//     data.append('_method', 'PUT')
//     try {
//       const respuesta = await axios.post(
//         `${Global.url}/updateGestorComunnity/${auth.id}`,
//         data,
//         {
//           headers: {
//             Authorization: `Bearer ${
//               token !== null && token !== '' ? token : ''
//             }`
//           }
//         }
//       )

//       if (respuesta.data.status == 'success') {
//         getTareas()
//         Swal.fire('Grabado correctamente', '', 'success')
//       } else {
//         Swal.fire('Error al guardar', '', 'error')
//       }
//     } catch (error) {
//       Swal.fire('Error', '', 'error')
//     }
//   }

//   const getTareas = async (): Promise<void> => {
//     const request = await axios.get(`${Global.url}/getGestorComunnity/1`, {
//       headers: {
//         Authorization: `Bearer ${
//           token !== null && token !== '' ? `Bearer ${token}` : ''
//         }`
//       }
//     })
//     if (request.data[0].community) {
//       const parsedEvents = JSON.parse(request.data[0].community).map(
//         (event: any) => ({
//           ...event,
//           start: moment(event.start).toDate(),
//           end: moment(event.end).toDate()
//         })
//       )
//       setEventsGeneral(parsedEvents)
//       const filteredEvents = parsedEvents.filter(
//         (event: any) => event.id === id
//       )
//       if (filteredEvents[0].contenido) {
//         const filterCalendario = filteredEvents[0].contenido.filter(
//           (event: any) => event.id === idContenido
//         )
//         setContexto(filterCalendario[0].calendario)
//       } else {
//         setEvents([])
//       }
//     }
//     setLoading(false)
//   }

//   const handleShardTasks = (): void => {
//     const actualizado = eventsGeneral.map((event: any) =>
//       // eslint-disable-next-line multiline-ternary
//       event.id === id ? {
//         ...event,
//         contenido: event.contenido?.map((contenido: any) =>
//           contenido.id === idContenido
//             ? { ...contenido, calendario: contexto } // Actualizar el campo 'contexto' del contenido
//             : contenido)
//       } : event
//     )
//     updateCita(actualizado)
//   }

//   useEffect(() => {
//     getTareas()
//     setTitle('CALENDARIO COMUNNITY MANAGER')
//   }, [])

//   return (
//     <>
//       <section className="w-full h-[75vh] mt-4 px-0 relative">
//         <div className="pt-0 md:p-0 flex flex-col h-full">
//           {loading
//             ? <Loading />
//             : (
//                 <>
//                     <section className="w-full h-full jodecct_sss text-black">
//                         <button className='bg-green-800 px-4 py-2 mb-3 text-white rounded-md' onClick={() => { handleShardTasks() }}>Guardar</button>
//                         <Editor content={contexto} setContent={setContexto} />
//                     </section>
//                 </>
//               )}
//         </div>
//       </section>
//     </>
//   )
// }
