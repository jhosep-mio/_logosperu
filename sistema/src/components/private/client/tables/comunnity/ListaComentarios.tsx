/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable multiline-ternary */
import { useState, type Dispatch, type SetStateAction } from 'react'
import { FaCheckCircle, FaSave } from 'react-icons/fa'
import { MdOutlineEdit } from 'react-icons/md'
import { IoArrowUndoOutline, IoCloseSharp } from 'react-icons/io5'
import { defaultPerfil } from '../../../../shared/Images'
import { toast } from 'sonner'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { Global } from '../../../../../helper/Global'
import Swal from 'sweetalert2'
import { type comentariosValues } from '../../../../shared/schemas/Interfaces'
import useAuthCliente from '../../../../../hooks/useAuthCliente'

export const ListaComentarios = ({
  comentarios,
  getOneBrief,
  setComentarios,
  events,
  setEvents,
  eventSelected,
  setOpen,
  setIdComentario,
  setTexto,
  datos,
  correos
}: {
  comentarios: comentariosValues[]
  getOneBrief: () => Promise<void>
  setComentarios: Dispatch<SetStateAction<comentariosValues[]>>
  events: Event[]
  setEvents: Dispatch<SetStateAction<Event[]>>
  eventSelected: any | null
  setOpen: Dispatch<SetStateAction<boolean>>
  setIdComentario: Dispatch<SetStateAction<string | null>>
  setTexto: Dispatch<SetStateAction<string | null>>
  datos: any
  correos: never[]
}): JSX.Element => {
  const { id } = useParams()
  const [textoEditado, setTextoEditado] = useState('')
  const { auth } = useAuthCliente()
  const [idComentarioAEditar, setIdComentarioAEditar] = useState<number | null>(
    null
  )
  const [modoEdicion, setModoEdicion] = useState(false)
  const token = localStorage.getItem('tokenUser')
  const updateCita = async (updatedEvents: Event[]): Promise<void> => {
    const data = new FormData()
    data.append('community', JSON.stringify(updatedEvents))
    data.append('archivosAEliminar', '')
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/updateCalendarioComunnityVentas/${id ?? ''}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      if (respuesta.data.status == 'success') {
        toast.success('Comentario actualizado')
        getOneBrief()
      } else {
        toast.error('Error')
      }
    } catch (error) {
      toast.error('Error')
    }
  }

  const handleEditarComentario = async (): Promise<void> => {
    if (textoEditado) {
      const comentariosActualizados = comentarios.map((comentario) =>
        comentario.id === idComentarioAEditar
          ? { ...comentario, texto: textoEditado }
          : comentario
      )
      setComentarios(comentariosActualizados)
      const updatedEvents = events.map((event: any) => {
        if (event.id == eventSelected?.event.id) {
          return {
            ...event,
            comentarios: comentariosActualizados
          }
        }
        return event
      })
      getOneBrief()
      updateCita(updatedEvents)
      setEvents(updatedEvents)
      setModoEdicion(false)
      setTextoEditado('')
      setIdComentarioAEditar(null)
    } else {
      toast.warning('Ingrese su comentario')
    }
  }
  const comentariosOriginales = [...comentarios]

  const fechaActual = new Date()
  const fechaVencimiento = new Date(eventSelected?.event?.fecha_vencimiento)

  const mostrarAlerta = (): void => {
    Swal.fire('PLAZO DE CONFIRMACION VENCIDO', '', 'warning')
  }

  const enviarCorreo = async (): Promise<void> => {
    const data = new FormData()
    data.append('nombres', auth.name)
    data.append('contrato', datos.id_contrato)
    data.append('empresa', datos.nombre_marca)
    data.append('id', id?.toString() ?? '')
    data.append('estado', `APROBACION DE POST - ${eventSelected?.event.title}`)
    data.append('correos', JSON.stringify(correos))
    try {
      const respuesta = await axios.post(
        `${Global.url}/notificacionPost`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      if (respuesta.data.status == 'success') {
        Swal.fire(`APROBACION DE POST - ${eventSelected?.event.title} EXITOSA`, '', 'success')
        getOneBrief()
      }
    } catch (error) {
      Swal.fire('Error', '', 'error')
    }
  }

  const Confirmar = (): void => {
    Swal.fire({
      title: '¿Quieres confirmar el POST?',
      icon: 'question',
      showCloseButton: true, // Muestra un botón para cerrar la alerta
      confirmButtonText: 'Confirmar',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        const updatedEvents = events.map((event: any) => {
          if (event.id == eventSelected?.event.id) {
            return {
              ...event,
              publicado: true
            }
          }
          return event
        })
        getOneBrief()
        updateCita(updatedEvents)
        setEvents(updatedEvents)
        enviarCorreo()
      }
    })
  }

  return (
    <>
        <div className="w-full bg-white p-4 rounded-xl h-auto max-h-[475px] overflow-y-auto">
        <h3 className="uppercase text-secondary-70 text-2xl w-full border-b-2 font-bold text-center pb-2 border-secondary-70 mb-6">
            Comentarios
            <span className="text-secondary-10">({comentarios.length})</span>
        </h3>
        {comentarios.length > 0 ? (
          comentariosOriginales.reverse().map((comentario: comentariosValues, index: number) => (
            <div
                className="w-full bg-gray-100 shadow-md  p-2 rounded-xl mb-4 relative"
                key={index}
            >
                {modoEdicion &&
                idComentarioAEditar === comentario.id &&
                auth.id == comentario.idUser &&
                comentario.respuestas == 0 ? (
                <span
                    className="absolute top-2 right-2"
                    onClick={() => {
                      handleEditarComentario()
                    }}
                >
                    <div className="flex gap-2">
                    <IoCloseSharp
                        className="text-main hover:text-main_dark transition-colors text-2xl cursor-pointer"
                        onClick={() => {
                          setModoEdicion(false)
                          setTextoEditado('')
                          setIdComentarioAEditar(null)
                        }}
                    />
                    <FaSave className="text-main hover:text-main_dark transition-colors text-2xl cursor-pointer" />
                    </div>
                </span>
                    ) : (
                      auth.id == comentario.idUser &&
                comentario.respuestas == 0 && (
                    <span
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setModoEdicion(true)
                      setTextoEditado(comentario.texto)
                      setIdComentarioAEditar(comentario.id)
                    }}
                    >
                    <MdOutlineEdit className="text-main text-2xl hover:text-main_dark transition-colors cursor-pointer" />
                    </span>
                      )
                    )}

                <div className="flex flex-col gap-4">
                <div className="flex gap-4 items-center">
                    <div>
                    <img
                        src={defaultPerfil}
                        alt=""
                        className="w-14 h-14 border border-gray-100 object-contain rounded-full"
                    />
                    </div>
                    <div className="flex flex-col gap-0">
                    <span className="text-lg font-medium">{comentario.user}</span>
                    <span className="text-gray-600 ">
                        {comentario.fecha} - {comentario.hora}
                    </span>
                    </div>
                </div>
                <div className="px-4">
                    {modoEdicion && idComentarioAEditar === comentario.id ? (
                    <textarea
                        value={textoEditado}
                        onChange={(e) => {
                          setTextoEditado(e.target.value)
                        }}
                        className="text-lg rounded-md outline-none break-words w-full"
                    />
                    ) : (
                    <p className="text-lg break-words">{comentario.texto}</p>
                    )}
                </div>
                <span
                    className="flex gap-2 text-main hover:text-main_dark transition-colors items-center text-base px-4 cursor-pointer"
                    onClick={() => {
                      setOpen(true)
                      setIdComentario(String(comentario.id))
                      setTexto(comentario.texto)
                    }}
                >
                    <IoArrowUndoOutline /> Responder
                </span>
                </div>
                {comentario.respuestas?.length > 0 && (
                <div className="flex flex-col mt-2">
                    {comentario.respuestas.map(
                      (respuesta: comentariosValues, index: number) => (
                        <div
                        key={index}
                        className="flex flex-col gap-4 pl-14 relative py-4
                    after:absolute after:left-6 after:top-10 after:bottom-0 after:bg-main after:h-[2px] after:w-6
                    before:absolute before:left-6 before:top-0 before:bottom-0 before:bg-main before:h-full before:w-[2px]
                    "
                        >
                        <div className="flex gap-4 items-center">
                            <div>
                            <img
                                src={defaultPerfil}
                                alt=""
                                className="w-12 h-12 object-contain rounded-full"
                            />
                            </div>
                            <div className="flex flex-col gap-0 relative">
                            <span className="text-lg font-medium">{respuesta.user}</span>
                            <span className="text-gray-600 ">
                                {respuesta.fecha} {respuesta.hora}
                            </span>
                            </div>
                        </div>
                        <div className="px-4">
                            <p className="text-lg break-words">
                            {respuesta.texto}
                            </p>
                        </div>
                        </div>
                      )
                    )}
                </div>
                )}
            </div>
          ))
        ) : (
            <span className="block w-full text-center">No hay comentarios</span>
        )}

        </div>
        {eventSelected?.event?.publicado || datos.fecha_fin != null || datos?.community_activo != 'false'
          ? null
          : !eventSelected?.event?.publicado && fechaVencimiento < fechaActual
              ? <div className='w-full flex justify-center mt-3'>
                <button
                onClick={() => { Confirmar() }}
                className='py-2 px-4 text-xl rounded-md bg-main text-white flex items-center gap-2 hover:bg-red-700 transition-colors'> <FaCheckCircle /> CONFIRMAR POST</button>
            </div>
              : fechaVencimiento < fechaActual &&
            <div className='w-full flex justify-center mt-3'>
            <button className='py-2 px-4 text-xl rounded-md bg-yellow-700 text-white flex items-center gap-2 hover:bg-yellow-700 transition-colors'
               onClick={() => { mostrarAlerta() }}
            >  CONFIRMACION VENCIDA</button>
        </div>
        }
    </>
  )
}
