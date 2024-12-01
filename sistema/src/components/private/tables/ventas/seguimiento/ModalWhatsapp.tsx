import {
  type Dispatch,
  type SetStateAction,
  useState,
  useEffect,
  useRef
} from 'react'

import { IoIosSend } from 'react-icons/io'
import Swal from 'sweetalert2'
import axios from 'axios'
import { AnimatePresence } from 'framer-motion'
import {
  type ValuesVenta,
  type errorValues,
  type valuesResumen
} from '../../../../shared/schemas/Interfaces'
import useAuth from '../../../../../hooks/useAuth'
import { Global } from '../../../../../helper/Global'
import { AlertSucess } from '../../../../shared/alerts/AlertSucess'
import { DialogComentario } from '../../servicios/comentario/DialogComentario'
import { VistaAdministrador } from '../colaboradores/VistaAdministrador'
import { VistaColaborador } from '../colaboradores/VistaColaborador'

interface values {
  id: string | undefined
  getOneBrief: () => Promise<void>
  resumen: valuesResumen[]
  setResumen: Dispatch<SetStateAction<valuesResumen[]>>
  proyecto: ValuesVenta | null
}

export const ModalWhatsapp = ({
  id,
  getOneBrief,
  resumen,
  proyecto,
  setResumen
}: values): JSX.Element => {
  const { auth } = useAuth()
  const [openComentario, setOpenComentario] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showError, setShowError] = useState<errorValues | null>(null)
  const token = localStorage.getItem('token')
  const [idEdicion, setIdEdicion] = useState<number | null>(null)
  const [textoEditado, setTextoEditado] = useState('')
  const [respuestaAdmin, setRespuestaAdmin] = useState('')
  const [texto, setTexto] = useState('')

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
      try {
        // Obtener la última versión de los datos antes de guardar
        await getOneBrief()
        if (resumen.length > 0) {
          if (auth.id_rol != 99) {
            const ultimaEntrada = resumen[resumen.length - 1]
            const partesDeFecha = ultimaEntrada.fecha.split('/')
            const fechaFormateada = `${partesDeFecha[1]}/${partesDeFecha[0]}/${partesDeFecha[2]}`
            const fechaUltimaEntrada = new Date(fechaFormateada)
            const fechaActual = new Date()
            // Comparar solo las partes de fecha (ignorar la hora)
            const mismasFechas =
                    fechaUltimaEntrada.toDateString() == fechaActual.toDateString()
                    // Verificar si la hora actual es antes de las 6 a.m.
            const antesDeLas6 = fechaActual.getHours() < 9
            if (mismasFechas && !antesDeLas6 && ultimaEntrada.userId == auth.id) {
              setShowError({
                estado: 'warning',
                texto: 'Solo puede registrar un comentario por dia'
              })
              setLoading(false)
              return
            }
          }
        }
        // Crear el nuevo resumen primero
        const nuevoResumen = {
          id: Date.now(),
          fecha: obtenerFecha(),
          hora: obtenerHora(),
          user: auth.name,
          userId: auth.id,
          texto,
          respuesta: null,
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
                setShowError({
                  estado: 'success',
                  texto: 'Resumen subido correctamente'
                })
                getOneBrief()
              } else {
                Swal.fire('Error al subir', '', 'error')
              }
            } catch (error: unknown) {
              console.log(error)
              Swal.fire('Error al subir', '', 'error')
            }
          }
          const enviarNotificacion = async (): Promise<void> => {
            const data = new FormData()
            const currentUrl = window.location.href
            // Utilizar el objeto URL para extraer la ruta
            const urlObject = new URL(currentUrl)
            const pathName = urlObject.pathname
            data.append('id_usuario', auth.id)
            data.append('id_venta', id ?? '')
            data.append('nombre', auth.name)
            data.append('icono', 'comentario')
            data.append('url', pathName)
            data.append('contenido', `Ha subido un nuevo comentario para el proyecto ${proyecto?.nombre_marca ?? ''}  (${proyecto?.nombres ?? ''} ${proyecto?.apellidos ?? ''})`)
            data.append('hidden_users', '')
            try {
              const respuesta = await axios.post(
                    `${Global.url}/nuevaNotificacion`,
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
                setShowError({
                  estado: 'success',
                  texto: 'Notificacion enviada'
                })
                getOneBrief()
              } else {
                Swal.fire('Error al subir', '', 'error')
              }
            } catch (error: unknown) {
              console.log(error)
              Swal.fire('Error al subir', '', 'error')
            }
          }
          enviarNotificacion()
          enviarDatos()
          return nuevosResumenes
        })
        const textarea = document.querySelector('#tuTextArea')
        if (textarea) {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          textarea.style.height = 'auto'
        }
        setTexto('')
        setLoading(false)
      } catch (error) {
        console.error('Error al obtener datos antes de guardar:', error)
        setLoading(false)
      }
    } else {
      Swal.fire('Ingrese su resumen', '', 'warning')
    }
  }
  // saveChat
  const endOfMessagesRef = useRef<null | HTMLDivElement>(null)

  const scrollToBottom = (): void => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [resumen])

  const permitirEdicion = (fechaResumen: string): boolean => {
    const partesDeFecha = fechaResumen.split('/')
    const fechaFormateada = `${partesDeFecha[1]}/${partesDeFecha[0]}/${partesDeFecha[2]}`
    const fechaDelResumen = new Date(fechaFormateada)

    const fechaActual = new Date()

    // Verificar si estamos en el mismo día que el resumen
    const mismoDia =
        fechaDelResumen.toDateString() === fechaActual.toDateString()

    // Verificar si la hora actual es antes de las 11:59 p.m.
    const antesDeMedianoche =
        fechaActual.getHours() < 23 ||
        (fechaActual.getHours() === 23 && fechaActual.getMinutes() < 59)

    return mismoDia && antesDeMedianoche
  }

  const editarResumen = async (
    idIem: number,
    nuevoTexto: string
  ): Promise<void> => {
    setLoading(true)
    setResumen((resumenesPrevios) => {
      const nuevosResumenes = resumenesPrevios.map((resu) => {
        if (resu.id == idIem) {
          return {
            ...resu,
            texto: nuevoTexto
          }
        }
        return resu
      })
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
            setIdEdicion(null)
            setTexto('')
            setShowError({
              estado: 'success',
              texto: 'Resumen editado correctamente'
            })
            getOneBrief()
          } else {
            Swal.fire('Error al editar', '', 'error')
          }
        } catch (error: unknown) {
          Swal.fire('Error al editar', '', 'error')
        }
      }
      enviarDatos()
      return nuevosResumenes
    })

    setLoading(false)
    setIdEdicion(null) // Resetea el idEditando para salir del modo edición
  }

  const handleUpdate = (id: number, nuevoTexto: string): void => {
    editarResumen(id, nuevoTexto)
  }

  const handleTextChange = (e: any): void => {
    setTexto(e.target.value)
    e.target.style.height = 'inherit'
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    e.target.style.height = `${e.target.scrollHeight}px` // Ajusta la altura
  }

  const handleUpdateEdit = (e: any): void => {
    setTextoEditado(e.target.value)
    // Resetear la altura para calcular correctamente la altura basada en el contenido actual
    e.target.style.height = 'inherit'
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  const ordenarPorFecha = (a: valuesResumen, b: valuesResumen): number => {
    // Convierte las fechas a un formato comparable si es necesario
    const fechaA = a.fecha.split('/').reverse().join('-')
    const fechaB = b.fecha.split('/').reverse().join('-')

    return new Date(fechaA).getTime() - new Date(fechaB).getTime()
  }

  const resumenOrdenado = [...resumen].sort(ordenarPorFecha)

  useEffect(() => {
    setTimeout(() => {
      if (showError != null) {
        setShowError(null)
      }
    }, 3000)
  }, [showError])

  return (
      <>
        <section className="w-full flex flex-col justify-between fondo_wsp_s relative min-h-[89vh]">
          <div className="w-full md:px-4 flex flex-col gap-4 h-auto flex-1 pb-[56px]">
            {auth.id_rol == 99
              ? (
              <VistaAdministrador
                getOneBrief={getOneBrief}
                resumen={resumen}
                setResumen={setResumen}
                resumenOrdenado={resumenOrdenado}
                id={id}
                loading={loading}
                textoEditado={textoEditado}
                permitirEdicion={permitirEdicion}
                setTextoEditado={setTextoEditado}
                setRespuestaAdmin={setRespuestaAdmin}
                respuestaAdmin={respuestaAdmin}
                endOfMessagesRef={endOfMessagesRef}
                handleUpdateEdit={handleUpdateEdit}
                showError={showError}
                setShowError={setShowError}
                proyecto={proyecto}
                handleUpdate={handleUpdate}
                idEdicion2={idEdicion}
                setIdEdicion2={setIdEdicion}
              />
                )
              : (
              <VistaColaborador
                setResumen={setResumen}
                getOneBrief={getOneBrief}
                id={id}
                setRespuestaAdmin={setRespuestaAdmin}
                respuestaAdmin={respuestaAdmin}
                resumen={resumen}
                loading={loading}
                handleUpdate={handleUpdate}
                handleUpdateEdit={handleUpdateEdit}
                textoEditado={textoEditado}
                idEdicion={idEdicion}
                permitirEdicion={permitirEdicion}
                setIdEdicion={setIdEdicion}
                setTextoEditado={setTextoEditado}
                resumenOrdenado={resumenOrdenado}
                endOfMessagesRef={endOfMessagesRef}
                showError={showError}
                setShowError={setShowError}
                proyecto={proyecto}
              />
                )}
          </div>
          <div className="h-fit w-full xl:pl-[14%]  left-0 right-0 flex items-end justify-center border border-t-gray-300 fixed bottom-0 z-20">
            <textarea
              placeholder="Escribir resumen"
              className="w-full h-full pl-4 pr-14 outline-none py-4 resize-none overflow-hidden text-black"
              disabled={loading}
              id='tuTextArea'
              rows={1}
              value={texto}
              onChange={handleTextChange}
            ></textarea>
            {(auth.id == '8' || auth.id == '99' || auth.id == '1' || auth.id_rol != 99) && !loading
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
        <AnimatePresence>
          {showError != null && <AlertSucess showError={showError} />}
        </AnimatePresence>

        <DialogComentario
          open={openComentario}
          setOpen={setOpenComentario}
          resumen={resumen}
          setResumen={setResumen}
          id={id}
          getOneBrief={getOneBrief}
        />
      </>
  )
}
