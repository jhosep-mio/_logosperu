import { useState, type Dispatch, type SetStateAction } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { IoIosSend } from 'react-icons/io'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Global } from '../../../../../../helper/Global'
import useAuthCliente from '../../../../../../hooks/useAuthCliente'
import { type comentariosValues } from '../../../../../shared/schemas/Interfaces'

interface valuesProps {
  comentarios: comentariosValues[]
  getComentarios: () => Promise<void>
  open: boolean
  idComentario: string | null
  setIdComentario: Dispatch<SetStateAction<string | null>>
  setOpen: Dispatch<SetStateAction<boolean>>
  textoComentario: string | null
  setComentarios: Dispatch<SetStateAction<comentariosValues[]>>
  events: Event[]
  setEvents: Dispatch<SetStateAction<Event[]>>
  eventSelected: any | null
}

export const ResponderComentario = ({
  getComentarios,
  open,
  setOpen,
  textoComentario,
  setComentarios,
  idComentario,
  events,
  setEvents,
  eventSelected
}: valuesProps): JSX.Element => {
  const { id } = useParams()
  const [texto, setTexto] = useState('')
  const [loading, setLoading] = useState(false)
  const handleClose = (): void => {
    setOpen(false)
  }
  const { auth } = useAuthCliente()
  const token = localStorage.getItem('tokenUser')
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

  const updateCita = async (updatedEvents: Event[]): Promise<void> => {
    const data = new FormData()
    data.append('array_avances', JSON.stringify(updatedEvents))
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/updateAvancesToComentarios/${id ?? ''}`,
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
        toast.success('Comentario enviado')
        getComentarios()
        setOpen(false)
      } else {
        toast.error('Error')
      }
    } catch (error) {
      toast.error('Error')
    } finally {
      setOpen(false)
      setLoading(false)
    }
  }

  const agregarResumen = async (): Promise<void> => {
    if (texto) {
      setLoading(true)
      setComentarios((resumenesPrevios) => {
        const nuevosResumenes = resumenesPrevios.map((resu) => {
          if (String(resu.id) == idComentario) {
            const nuevaRespuesta = {
              id: Date.now(),
              texto,
              fecha: obtenerFecha(),
              hora: obtenerHora(),
              user: auth.name
            }
            // Asegurarse de que 'respuestas' sea un array
            const respuestasActualizadas = resu.respuestas
              ? [...resu.respuestas, nuevaRespuesta]
              : [nuevaRespuesta]
            return {
              ...resu,
              respuestas: respuestasActualizadas
            }
          }
          return resu
        })
        const updatedEvents = events.map((event: any) => {
          if (event.razon == eventSelected?.razon &&
            event.asunto == eventSelected?.asunto) {
            return {
              ...event,
              comentarios: nuevosResumenes
            }
          }
          return event
        })
        getComentarios()
        updateCita(updatedEvents)
        setEvents(updatedEvents)
        return nuevosResumenes
      })
      setTexto('')
      setLoading(false)
    } else {
      toast.warning('Ingrese su comentario')
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="dialog_comentarios"
      >
        <DialogContent>
          <section className="flex flex-col gap-4 lg:w-[500px]">
            <h2 className="text-2xl font-bold text-black w-full text-center">
              Escribe tu respuesta
            </h2>
            <div className="border-2 rounded-xl py-2 px-2">
              <p className="text-black text-lg break-words text-center">
                {textoComentario}
              </p>
            </div>
            <div className="h-fit w-full flex items-end justify-center border border-t-gray-300 relative">
              <textarea
                placeholder="Respuesta..."
                className="w-full h-full pl-4 pr-14 outline-none py-4 resize-none overflow-hidden text-lg text-gray-700"
                disabled={loading}
                rows={1}
                value={texto}
                onChange={handleTextChange}
              ></textarea>
              {!loading
                ? (
                <IoIosSend
                  className="absolute bottom-2 right-5 z-10 text-4xl text-main rounded-full p-1 cursor-pointer"
                  onClick={() => {
                    agregarResumen()
                  }}
                />
                  )
                : (
                <IoIosSend className="absolute bottom-2 right-5 z-10 text-4xl text-main/60 rounded-full p-1 cursor-pointer" />
                  )}
            </div>
          </section>
        </DialogContent>
      </Dialog>
    </>
  )
}
