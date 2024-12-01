import {
//   BsFillTrash2Fill,
  BsPencilSquare,
  BsReplyAllFill
} from 'react-icons/bs'
import {
  type Dispatch,
  type SetStateAction,
  type LegacyRef,
  useState
} from 'react'
import { FaSave } from 'react-icons/fa'
import axios from 'axios'
import { type ValuesVenta, type errorValues, type valuesResumen } from '../../../shared/schemas/Interfaces'
import useAuth from '../../../../hooks/useAuth'
import { Global } from '../../../../helper/Global'
import { fechaFormateada } from '../../../shared/functions/GenerarTextoEnLetras'
import { chat } from '../../../shared/Images'
import { ModalRespuestaAdministrador } from './ModalRespuestaAdministrador'
// import Swal from 'sweetalert2'

export const VistaAdministradorToColaborador = ({
  resumen,
  setResumen,
  resumenOrdenado,
  setRespuestaAdmin,
  respuestaAdmin,
  loading,
  id,
  getOneBrief,
  endOfMessagesRef,
  setShowError,
  proyecto,
  permitirEdicion,
  handleUpdate,
  textoEditado,
  setTextoEditado,
  handleUpdateEdit
}: {
  resumen: valuesResumen[]
  setResumen: Dispatch<SetStateAction<valuesResumen[]>>
  resumenOrdenado: valuesResumen[]
  permitirEdicion: (fechaResumen: string) => boolean
  loading: boolean
  handleUpdate: (id: number, nuevoTexto: string) => void
  id: string | undefined
  setRespuestaAdmin: Dispatch<SetStateAction<string>>
  respuestaAdmin: string
  getOneBrief: () => Promise<void>
  endOfMessagesRef: LegacyRef<HTMLDivElement> | undefined
  showError: errorValues | null
  setShowError: Dispatch<SetStateAction<errorValues | null>>
  textoEditado: string
  proyecto: ValuesVenta | null
  setTextoEditado: Dispatch<SetStateAction<string>>
  handleUpdateEdit: (e: any) => void
}): JSX.Element => {
  const handleTextAdmin = (e: any): void => {
    setRespuestaAdmin(e.target.value)
    e.target.style.height = 'inherit'
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    e.target.style.height = `${e.target.scrollHeight}px` // Ajusta la altura
  }
  const { auth } = useAuth()
  const [open, setOpen] = useState(false)
  const [idAdd, setIdAdd] = useState<number | null>(null)
  const [idEdicion, setIdEdicion] = useState<number | null>(null)
  const token = localStorage.getItem('token')

  const editarResumen = async (
    idResumen: number | null,
    idRespuesta: number | null,
    nuevoTexto: string
  ): Promise<void> => {
    // Crear el nuevo estado de resúmenes con la respuesta editada
    setResumen((resumenesPrevios) => {
      const nuevosResumenes = resumenesPrevios.map((resu) => {
        if (resu.id == idResumen) {
          const respuestasEditadas = resu.respuestas.map((resp) =>
            resp.id == idRespuesta
              ? {
                  ...resp,
                  texto: nuevoTexto
                }
              : resp
          )

          return {
            ...resu,
            respuestas: respuestasEditadas
          }
        }
        return resu
      })
      const enviarDatos = async (): Promise<void> => {
        const data = new FormData()
        data.append('resumen_adicional', JSON.stringify(nuevosResumenes))
        data.append('_method', 'PUT')
        try {
          const respuesta = await axios.post(
            `${Global.url}/saveResumenAdicional/${id ?? ''}`,
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
            setRespuestaAdmin('')
            setShowError({
              estado: 'success',
              texto: 'Respuesta actualizada'
            })
            getOneBrief()
          } else {
            setShowError({
              estado: 'warning',
              texto: 'Error al actualizar'
            })
          }
        } catch (error: unknown) {
          setShowError({
            estado: 'warning',
            texto: 'Error al actualizar'
          })
        }
      }
      //   const enviarNotificacion = async (): Promise<void> => {
      //     const data = new FormData()
      //     const currentUrl = window.location.href
      //     // Utilizar el objeto URL para extraer la ruta
      //     const urlObject = new URL(currentUrl)
      //     const pathName = urlObject.pathname
      //     data.append('id_usuario', auth.id)
      //     data.append('id_venta', id ?? '')
      //     data.append('nombre', auth.name)
      //     data.append('icono', 'comentario')
      //     data.append('url', pathName)
      //     data.append('contenido', `Ha subido un nuevo comentario para el Reporte General de ${proyecto?.apellidos ?? ''}`)
      //     data.append('hidden_users', '')
      //     try {
      //       const respuesta = await axios.post(
      //                 `${Global.url}/nuevaNotificacion`,
      //                 data,
      //                 {
      //                   headers: {
      //                     Authorization: `Bearer ${
      //                       token !== null && token !== '' ? token : ''
      //                     }`
      //                   }
      //                 }
      //       )
      //       if (respuesta.data.status == 'success') {
      //         setShowError({
      //           estado: 'success',
      //           texto: 'Notificacion enviada'
      //         })
      //         getOneBrief()
      //       } else {
      //         Swal.fire('Error al subir', '', 'error')
      //       }
      //     } catch (error: unknown) {
      //       console.log(error)
      //       Swal.fire('Error al subir', '', 'error')
      //     }
      //   }
      //   enviarNotificacion()
      enviarDatos()
      return nuevosResumenes
    })
    // Limpiar el estado de edición
    setIdEdicion(null)
  }

  return (
    <>
      {resumenOrdenado.length > 0
        ? resumenOrdenado.map((resu: valuesResumen, index: number) => {
          const fechaActual = resu.fecha
          // Verificar si la fecha actual es diferente de la anterior
          const mostrarFecha =
                index === 0 || fechaActual !== resumenOrdenado[index - 1].fecha
          // Mostrar la fecha solo en el primer comentario de cada fecha
          const fechaElement = mostrarFecha && (
                <div key={`fecha-${index}`} className="w-full flex justify-center py-4">
                  <span className="bg-white px-4 rounded-xl text-black">
                    {fechaActual}
                  </span>
                </div>
          )
          return (
          <>
            <div className="flex flex-col gap-2 " key={index}>
              {fechaElement}
              <div className={`relative bg-white w-full md:w-1/2 ${(resu.userId != '1') && (resu.userId != '99') && (resu.userId != '8') ? 'md:ml-[50%]' : ''} rounded-xl group`}>
                {/* USUARIO */}
                <BsReplyAllFill
                  className="text-xl text-transparent group-hover:text-main transition-colors cursor-pointer absolute top-2 right-6 z-10"
                  onClick={() => {
                    setOpen(true)
                    setIdAdd(resu.id)
                  }}
                />
                <div
                  className="text-justify bg-white p-4 rounded-l-xl relative w-[93%] ml-3
                    lowercase first-letter:uppercase text-base"
                >
                     {permitirEdicion(resu.fecha) &&
                  idEdicion == resu.id &&
                  resu.userId == auth.id
                       ? <FaSave
                      className="text-xl hover:text-green-500 transition-colors cursor-pointer absolute top-2 right-6 z-10"
                      onClick={() => {
                        handleUpdate(resu.id, textoEditado)
                        setIdEdicion(null)
                      }}
                    />
                       : (
                           permitirEdicion(resu.fecha) &&
                    resu.userId == auth.id && (
                      <BsPencilSquare
                        className="text-xl hover:text-green-500 transition-colors cursor-pointer absolute top-2 right-6 z-10"
                        onClick={() => {
                          setIdEdicion(resu.id)
                          setTextoEditado(resu.texto)
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-expect-error
                          inputRef.current.focus()
                        }}
                      />
                           )
                         )}
                  <span className="w-full text-lg lowercase first-letter:uppercase items-center gap-3 mb-3 font-bold text-black">
                  {(resu.user == 'Logos Perú')
                    ? 'ADMINISTRACIÓN'
                    : resu.user}
                  </span>
                  {permitirEdicion(resu.fecha) && idEdicion == resu.id
                    ? (
                    <textarea
                      className="w-full h-full pl-4 pr-14 outline-none py-4 resize-none overflow-hidden text-black"
                      rows={1}
                      onFocus={handleUpdateEdit}
                      onChange={handleUpdateEdit}
                      value={textoEditado}
                    ></textarea>
                      )
                    : (
                    <p className="text-black pt-4 break-words">{resu.texto}</p>
                      )}
                  <span className="w-full flex justify-end text-gray-400">
                    {resu.hora}
                  </span>
                </div>
                {/* END- USUARIO */}
              </div>
              {resu?.respuesta?.texto && (
                <>
                  <div
                    className={'relative bg-white w-full md:w-1/2 rounded-xl group p-4 group'}
                  >
                    <span className="w-full flex justify-start uppercase items-center gap-3 mb-3 font-bold text-black pl-4">
                      Administración
                    </span>
                    <p className="w-full h-fit pl-4 pr-14 outline-none placeholder:text-black/60 py-4 resize-none overflow-hidden text-black break-words">
                      {resu.respuesta?.texto}
                    </p>
                    <span className="w-full block text-right px-2 text-black">
                      {fechaFormateada(resu.respuesta.hora)}
                    </span>
                  </div>
                </>
              )}
              {/* NUEVOS COMENTARIOS */}
              {resu?.respuestas?.map((respues) => (
                <div
                  key={respues.id}
                  className={`relative bg-white w-1/2  ${respues.user == 'Logos Perú' || respues.user == 'Administración' ? '' : 'ml-[50%]'}  rounded-xl group p-4 group`}
                >
                  {idEdicion && idEdicion == respues.id && respues.userId == auth.id
                    ? <FaSave
                      className="text-lg text-transparent group-hover:text-green-500 transition-colors cursor-pointer absolute top-2 right-10 z-10"
                      onClick={() => {
                        editarResumen(resu.id, respues.id, respuestaAdmin)
                      }}
                    />
                    : respues.userId == auth.id && (
                    <BsPencilSquare
                      className="text-lg text-transparent group-hover:text-green-500 transition-colors cursor-pointer absolute top-2 right-10 z-10"
                      onClick={() => {
                        if (respues.texto != null) {
                          setRespuestaAdmin(respues.texto)
                        }
                        setIdEdicion(respues.id)
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        inputRef.current.focus()
                      }}
                    />
                    )}

                  <span className="w-full flex justify-start uppercase items-center gap-3 mb-3 font-bold pl-4 text-black">
                    {(respues.user == 'Logos Perú')
                      ? 'ADMINISTRACIÓN'
                      : respues.user}
                  </span>
                  {idEdicion && idEdicion == respues.id
                    ? (
                    <textarea
                      placeholder="Respuesta..."
                      className={'w-full h-fit pl-4 pr-14 outline-none placeholder:text-black/60 py-4 resize-none overflow-hidden text-black'}
                      disabled={loading}
                      rows={1}
                      value={respuestaAdmin}
                      onFocus={handleTextAdmin}
                      onChange={handleTextAdmin}
                    ></textarea>
                      )
                    : (
                    <p
                      className={'w-full h-fit pl-4 pr-14 outline-none placeholder:text-black/60 text-black py-4 resize-none overflow-hidden break-words'}
                    >
                      {respues.texto}
                    </p>
                      )}
                  <span className="w-full block text-right px-2 text-sm text-black">
                    {respues.fecha} - {respues.hora}
                  </span>
                </div>
              ))}
            </div>
            <div ref={endOfMessagesRef} />
          </>
          )
        })
        : (
        <div className="w-full flex flex-col gap-4">
          <p className="text-gray-500 text-center text-xl">
            No hay comentarios para este proyeto
          </p>
          <img src={chat} alt="" className="w-52 object-contain mx-auto" />
        </div>
          )}
      <ModalRespuestaAdministrador
        open={open}
        setOpen={setOpen}
        resumen={resumen}
        setResumen={setResumen}
        idIem={idAdd}
        id={id}
        getOneBrief={getOneBrief}
        setShowError={setShowError}
        proyecto={proyecto}
      />
    </>
  )
}
