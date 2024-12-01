import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import Slide from '@mui/material/Slide'
import { type TransitionProps } from '@mui/material/transitions'
import {
  type Dispatch,
  type SetStateAction,
  forwardRef,
  type ReactElement,
  type Ref,
  useState
} from 'react'
import { type valuesResumen } from '../../../../shared/schemas/Interfaces'
import { Global } from '../../../../../helper/Global'
import axios from 'axios'
import Swal from 'sweetalert2'
import useAuth from '../../../../../hooks/useAuth'

const Transition = forwardRef(function Transition (
  props: TransitionProps & {
    children: ReactElement<any, any>
  },
  ref: Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />
})

interface values {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  setResumen: Dispatch<SetStateAction<valuesResumen[]>>
  id: string | undefined
  getOneBrief: () => Promise<void>
  resumen: valuesResumen[]
}

export const DialogComentario = ({
  open,
  setOpen,
  setResumen,
  id,
  getOneBrief,
  resumen
}: values): JSX.Element => {
  const handleClose = (): void => {
    setOpen(false)
  }

  const obtenerFecha = (fecha: string): string => {
    const partesFecha = fecha.split('-') // Separar en [YYYY, MM, DD]
    const fechaFormateada = `${partesFecha[2]}/${partesFecha[1]}/${partesFecha[0]}`
    return fechaFormateada
  }

  const obtenerHora = (): string => {
    const fecha = new Date()
    return `${fecha.getHours()}:${fecha
      .getMinutes()
      .toString()
      .padStart(2, '0')}`
  }
  const [fechaNueva, setFechaNueva] = useState('')
  const [respuestaAdmin, setRespuestaAdmin] = useState('')
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem('token')
  const { auth } = useAuth()

  const handleTextAdmin = (e: any): void => {
    setRespuestaAdmin(e.target.value)
    e.target.style.height = 'inherit'
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    e.target.style.height = `${e.target.scrollHeight}px` // Ajusta la altura
  }

  const agregarResumen = async (): Promise<void> => {
    if (respuestaAdmin) {
      const resumenExistente = resumen.find(r => r.fecha == obtenerFecha(fechaNueva))
      if (resumenExistente) {
        Swal.fire('Ya existe un comentario para esta fecha', '', 'warning')
        setLoading(false)
        return
      }
      setLoading(true)
      // Crear el nuevo resumen primero
      const nuevoResumen = {
        id: Date.now(),
        fecha: obtenerFecha(fechaNueva),
        hora: obtenerHora(),
        user: 'Resumen no registrado',
        texto: '',
        userId: auth.id,
        respuesta: {
          hora: new Date(),
          texto: respuestaAdmin
        },
        respuestas: []
      }
      // Actualizar el estado y luego enviar los datos
      setResumen((resumenesPrevios: valuesResumen[]): valuesResumen[] => {
        const nuevosResumenes = [...resumenesPrevios, nuevoResumen]
        const enviarDatos = async (): Promise<void> => {
          const data = new FormData()
          data.append('resumen', JSON.stringify(nuevosResumenes))
          data.append('_method', 'PUT')
          try {
            const respuesta = await axios.post(
              `${Global.url}/saveChat/${id ?? ''}`,
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
              Swal.fire('Comentario subido correctamente', '', 'success')
              getOneBrief()
            } else {
              Swal.fire('Error al subir', '', 'error')
            }
          } catch (error: unknown) {
            Swal.fire('Error al subir', '', 'error')
          }
        }
        enviarDatos()
        return nuevosResumenes
      })
      setOpen(false)
      setRespuestaAdmin('')
      setFechaNueva('')
      setLoading(false)
    } else {
      Swal.fire('Ingrese su resumen', '', 'warning')
    }
  }

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      className="dialog_comentario"
    >
      <DialogContent>
        <section className='flex flex-col justify-center items-center w-[500px]'>
          <h2 className='font-bold mb-10 text-xl w-full'>REGISTRAR  COMENTARIO</h2>
          <input
            type="date"
            value={fechaNueva}
            onChange={(e) => {
              setFechaNueva(e.target.value)
            }}
            className="px-4 py-2 outline-none mb-10 w-full"
          />
           <textarea
            placeholder="Escribir..."
            className="w-full h-fit pl-4 pr-14 outline-none placeholder:text-black/60 py-4 resize-none overflow-hidden bg-gray-300 text-black "
            rows={1}
            value={respuestaAdmin}
            onFocus={handleTextAdmin}
            onChange={handleTextAdmin}
            ></textarea>
          <button type='button' className={`${!loading ? 'bg-green-700' : 'bg-green-700/60'} px-4 py-2 rounded-xl text-white mt-10`}
          onClick={() => {
            if (!loading) {
              agregarResumen()
            }
          }}
          >
            Guardar comentario
          </button>
        </section>
      </DialogContent>
    </Dialog>
  )
}
