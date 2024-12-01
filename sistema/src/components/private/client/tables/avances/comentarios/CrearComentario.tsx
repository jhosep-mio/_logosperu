import { useState, type Dispatch, type SetStateAction } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { IoIosSend } from 'react-icons/io'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import { Global } from '../../../../../../helper/Global'
import { defaultPerfil } from '../../../../../shared/Images'
import { AiFillCloseCircle } from 'react-icons/ai'
import useAuthCliente from '../../../../../../hooks/useAuthCliente'
import { type comentariosValues } from '../../../../../shared/schemas/Interfaces'

interface valuesProps {
  getOneBrief: () => Promise<void>
  setComentarios: Dispatch<SetStateAction<comentariosValues[]>>
  events: Event[]
  setEvents: Dispatch<SetStateAction<Event[]>>
  eventSelected: any | null
}

export const CrearComentario = ({
  getOneBrief,
  setComentarios,
  events,
  setEvents,
  eventSelected
}: valuesProps): JSX.Element => {
  const { id } = useParams()
  const { auth } = useAuthCliente()
  const [open, setOpen] = useState(false)
  const [texto, setTexto] = useState('')
  const [loading, setLoading] = useState(false)
  const handleClose = (): void => {
    if (!loading) {
      setOpen(false)
    }
  }
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
        getOneBrief()
        setOpen(false)
      }

      console.log(respuesta)
    } catch (error: unknown) {
      console.log(error)
      toast.error('Error2')
    } finally {
      setLoading(false)
    }
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
            if (
              event.razon == eventSelected?.razon &&
              event.asunto == eventSelected?.asunto
            ) {
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
      <div className="w-full bg-white p-2 rounded-xl mb-3 ">
        <p className="w-full h-16 rounded-xl bg-white border border-gray-400 p-2 text-gray-600 flex items-center gap-4">
          <img
            src={defaultPerfil}
            alt=""
            className="w-10 h-10 object-contain rounded-full"
          />
          <span
            className="cursor-pointer block w-full"
            onClick={() => {
              setOpen(true)
            }}
          >
            Escribe tu aporte o pregunta
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
            <AiFillCloseCircle className='absolute top-2 right-2 text-black text-xl z-10 cursor-pointer'
                onClick={() => { setOpen(false) }}
            />
        <DialogContent>
          <section className="flex flex-col gap-10 lg:w-[500px] relative">
            <div className="h-fit w-full flex items-end justify-center border border-t-gray-300 relative">
              <textarea
                placeholder="Escribir comentario"
                className="w-full h-full pl-4 pr-14 outline-none py-4 resize-none overflow-hidden text-lg"
                disabled={loading}
                rows={3}
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
