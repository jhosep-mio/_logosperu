/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useState, type Dispatch, type SetStateAction } from 'react'
import useAuth from '../../../../../hooks/useAuth'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { IoIosSend } from 'react-icons/io'
import { type comentariosValues } from '../../../../shared/schemas/Interfaces'
import { toast } from 'sonner'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'

interface valuesProps {
  getOneBrief: () => Promise<void>
  setComentarios: Dispatch<SetStateAction<comentariosValues[]>>
  events: Event[]
  setEvents: Dispatch<SetStateAction<Event[]>>
  eventSelected: any | null
  updateCita: any
}

export const CrearComentario = ({
  getOneBrief,
  setComentarios,
  events,
  setEvents,
  eventSelected,
  updateCita
}: valuesProps): JSX.Element => {
  const { auth } = useAuth()
  const [open, setOpen] = useState(false)
  const [texto, setTexto] = useState('')
  const [loading, setLoading] = useState(false)
  const handleClose = (): void => {
    if (!loading) {
      setOpen(false)
    }
  }

  const handleTextChange = (e: any): void => {
    setTexto(e.target.value)
    e.target.style.height = 'inherit'
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    e.target.style.height = `${e.target.scrollHeight}px` // Ajusta la altura
  }

  const obtenerFecha = (): string => {
    const fecha = new Date()
    return `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`
  }

  const obtenerHora = (): string => {
    const fecha = new Date()
    return `${fecha.getHours()}:${fecha
      .getMinutes()
      .toString()
      .padStart(2, '0')}`
  }

  const agregarResumen = async (): Promise<void> => {
    if (texto) {
      setLoading(true)
      const nuevoResumen = {
        id: Date.now(),
        texto,
        fecha: obtenerFecha(),
        hora: obtenerHora(),
        user: auth.name,
        idUser: auth.id,
        respuestas: ''
      }
      setComentarios(
        (resumenesPrevios: comentariosValues[]): comentariosValues[] => {
          const nuevosResumenes = [...resumenesPrevios, nuevoResumen]
          const updatedEvents = events.map((event: any) => {
            if (event.id == eventSelected?.event.id) {
              return {
                ...event,
                comentarios: nuevosResumenes
              }
            }
            return event
          })
          getOneBrief()
          updateCita(updatedEvents)
          setEvents(updatedEvents)
          const token = localStorage.getItem('token')
          const enviarNotificacion = async (): Promise<void> => {
            const data = new FormData()
            // Utilizar el objeto URL para extraer la ruta
            data.append('id_usuario', auth.id)
            data.append('id_venta', '4143')
            data.append('nombre', auth.name)
            data.append('icono', 'correo')
            data.append('url', '/admin/listadocm')
            data.append(
              'contenido',
                  `Ha subido un comentario para el calendario de CM - Logos Peru.  POST: ${
                    eventSelected?.title ?? ''
                  } `
            )
            data.append('hidden_users', '')
            try {
              await axios.post(`${Global.url}/nuevaNotificacion`, data, {
                headers: {
                  Authorization: `Bearer ${
                        token !== null && token !== '' ? token : ''
                      }`
                }
              })
            } catch (error: unknown) {
              console.log(error)
            }
          }
          enviarNotificacion()
          return nuevosResumenes
        }
      )
      setTexto('')
    } else {
      toast.warning('Ingrese su comentario')
    }
  }

  return (
    <>
      <div className="w-full bg-white rounded-xl mb-0 flex justify-end">
        <p className="w-fit">
          <span
            className="cursor-pointer block w-fit text-sm bg-main hover:bg-main_dark transition-colors rounded-md px-2 py-1 text-white"
            onClick={() => {
              setOpen(true)
            }}
          >
            Agregar
          </span>
        </p>
      </div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="dialog_comentarios"
      >
        <DialogContent>
          <section className="flex flex-col gap-10 lg:w-[500px]">
            <div className="h-fit w-full flex items-end justify-center border border-t-gray-300 relative">
              <textarea
                placeholder="Escribir comentario"
                className="w-full h-full pl-4 pr-14 outline-none py-4 text-base resize-none overflow-hidden "
                disabled={loading}
                rows={1}
                value={texto}
                onChange={handleTextChange}
              ></textarea>
              {!loading
                ? (
                <IoIosSend
                  className="absolute bottom-2 right-5 z-10 text-5xl text-main rounded-full p-1 pl-4 cursor-pointer"
                  onClick={() => {
                    agregarResumen()
                  }}
                />
                  )
                : (
                <IoIosSend className="absolute bottom-2 right-5 z-10 text-5xl text-main/60 rounded-full p-1 cursor-pointer" />
                  )}
            </div>
          </section>
        </DialogContent>
      </Dialog>
    </>
  )
}
