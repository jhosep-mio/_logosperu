import {
  BsPencilSquare,
  BsReplyAllFill,
  BsTrash
} from 'react-icons/bs'
import {
  type Dispatch,
  type SetStateAction,
  type LegacyRef,
  useState
} from 'react'
import { FaSave } from 'react-icons/fa'
import axios from 'axios'
import { type ValuesVenta, type errorValues, type valuesResumen } from '../../../../shared/schemas/Interfaces'
import useAuth from '../../../../../hooks/useAuth'
import { Global } from '../../../../../helper/Global'
import { fechaFormateada } from '../../../../shared/functions/GenerarTextoEnLetras'
import { chat } from '../../../../shared/Images'
import { AnexoRespuesta } from './AnexoRespuesta'
import { RViewer, RViewerTrigger } from 'react-viewerjs'
import { IoDocumentOutline } from 'react-icons/io5'
import { limpiarNombreArchivo } from '../../../../shared/functions/QuitarAcerntos'

export const AnexoAdmin = ({
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
        data.append('resumen', JSON.stringify(nuevosResumenes))
        data.append('_method', 'PUT')
        try {
          const respuesta = await axios.post(
            `${Global.url}/saveResumen/${id ?? ''}`,
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
      enviarDatos()
      return nuevosResumenes
    })
    // Limpiar el estado de edición
    setIdEdicion(null)
  }

  const descargarArchivos = async (nombre: string): Promise<void> => {
    const response = await axios.get(
          `${Global.url}/descargarArchivoToWsp/${nombre ?? ''}`,
          {
            headers: {
              Authorization: `Bearer ${token ?? ''}`
            },
            responseType: 'blob'
          }
    )
    const url = window.URL.createObjectURL(new Blob([response.data]))
    const link = document.createElement('a')
    link.href = url
    const namelimpio = limpiarNombreArchivo(nombre)
    link.setAttribute('download', namelimpio) // Asigna el nombre al archivo descargado
    document.body.appendChild(link)
    link.click()

    // Limpieza después de la descarga
    if (link.parentNode) {
      link.parentNode.removeChild(link)
      window.URL.revokeObjectURL(url)
    }
  }

  const eliminarArchivo = async (nombre: string): Promise<void> => {
    await axios.get(
        `${Global.url}/deleteArchivoWsp/${nombre ?? ''}`,
        {
          headers: {
            Authorization: `Bearer ${token ?? ''}`
          },
          responseType: 'blob'
        }
    )
  }

  const eliminarResumen = async (idResumen: number | null, nombre: string): Promise<void> => {
    if (window.confirm('¿Estás seguro de que deseas eliminar este archivo?')) {
      setResumen((resumenesPrevios) => {
        const nuevosResumenes = resumenesPrevios.filter((resu) => resu.id !== idResumen)
        const enviarDatos = async (): Promise<void> => {
          const data = new FormData()
          data.append('resumen', JSON.stringify(nuevosResumenes))
          data.append('_method', 'PUT')
          try {
            const respuesta = await axios.post(
              `${Global.url}/saveResumen/${id ?? ''}`,
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
                texto: 'Archivo eliminado correctamente'
              })
              eliminarArchivo(nombre)
              getOneBrief()
            } else {
              setShowError({
                estado: 'warning',
                texto: 'Error al eliminar el archivo'
              })
            }
          } catch (error: unknown) {
            setShowError({
              estado: 'warning',
              texto: 'Error al eliminar el archivo'
            })
          }
        }

        enviarDatos() // Asegúrate de llamar a esta función después de actualizar el estado
        return nuevosResumenes
      })
    }
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
              {/* IMAGENES */}
              {// eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                resu.tipo == 'imagen'
                  ? <div className={`relative bg-white w-full md:w-fit max-w-1/2 ${(resu.userId != '1') && (resu.userId != '99') && (resu.userId != '8') ? 'md:ml-[50%]' : ''} rounded-xl group`}>
                <BsReplyAllFill
                  className="text-xl text-transparent group-hover:text-main transition-colors cursor-pointer absolute top-2 right-6 z-10"
                  onClick={() => {
                    setOpen(true)
                    setIdAdd(resu.id)
                  }}
                />
                {resu.userId == auth.id &&
                    <BsTrash
                        className="text-lg text-transparent group-hover:text-main transition-colors cursor-pointer absolute top-2 right-14 z-10"
                        onClick={async () => { await eliminarResumen(resu.id, resu.texto) }}
                    />
                }
                <div
                  className="text-justify bg-white p-2 rounded-xl relative min-w-[250px] w-fit max-w-[93%] ml-3
                    lowercase first-letter:uppercase text-base"
                >
                  <span className="w-full text-lg lowercase first-letter:uppercase items-center gap-3 mb-3 font-bold text-black">
                  {(resu.user == 'Logos Perú')
                    ? 'ADMINISTRACIÓN'
                    : resu.user}
                  </span>
                    <RViewer
                            imageUrls={`${Global.urlImages}/archivosresumen/${resu.texto}`}
                        >
                        <RViewerTrigger>
                            <img src={`${Global.urlImages}/archivosresumen/${resu.texto}`} alt="" className='w-full h-[100px] object-contain mt-2 cursor-pointer'/>
                        </RViewerTrigger>
                    </RViewer>
                  <span className="w-full flex justify-end text-gray-400">
                    {resu.hora}
                  </span>
                </div>
              </div>
                //   DOCUMENTOS
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                  : resu.tipo == 'documento'
                    ? <div className={`relative bg-white w-full md:w-fit max-w-1/2 ${(resu.userId != '1') && (resu.userId != '99') && (resu.userId != '8') ? 'md:ml-[50%]' : ''} rounded-xl group`}>
                <BsReplyAllFill
                className="text-xl text-transparent group-hover:text-main transition-colors cursor-pointer absolute top-2 right-6 z-10"
                onClick={() => {
                  setOpen(true)
                  setIdAdd(resu.id)
                }}
                />
                {resu.userId == auth.id &&
                    <BsTrash
                        className="text-lg mt-1 text-transparent group-hover:text-main transition-colors cursor-pointer absolute top-2 right-14 z-10"
                        onClick={async () => { await eliminarResumen(resu.id, resu.texto) }}
                    />
                }
                <div
                className="text-justify bg-white p-2 rounded-xl relative min-w-[250px] w-fit max-w-[93%] mx-3
                lowercase first-letter:uppercase text-base"
                >
                <span className="w-full text-lg lowercase first-letter:uppercase items-center gap-3 mb-3 font-bold text-black">
                {(resu.user == 'Logos Perú')
                  ? 'ADMINISTRACIÓN'
                  : resu.user}
                </span>
                    <div className='flex gap-3 flex-col mt-4 w-[250px] mb-2'>
                        <div className='flex gap-3 '>
                            <IoDocumentOutline className="text-gray-500  text-2xl w-auto" />
                            <span className='line-clamp-1 flex-1 w-full text-gray-700'>{limpiarNombreArchivo(resu.texto)}</span>
                        </div>
                        <div className='w-full flex gap-2'>
                            <button
                            // eslint-disable-next-line @typescript-eslint/no-misused-promises
                            onClick={async () => { await descargarArchivos(resu.texto) }}
                            type='button' className='w-full bg-gray-400 hover:bg-gray-500 transition-colors rounded-md text-white py-1 mt-2'>Guardar</button>
                        </div>
                    </div>
                    {/* <img src={`${Global.urlImages}/archivosresumen/${resu.texto}`} alt="" className='w-full h-[100px] object-contain mt-3 cursor-pointer'/> */}
                <span className="w-full flex justify-end text-gray-400">
                {resu.hora}
                </span>
                </div>
                </div>
                //   TEXTO
                    : <div className={`relative bg-white w-full md:w-1/2 ${(resu.userId != '1') && (resu.userId != '99') && (resu.userId != '8') ? 'md:ml-[50%]' : ''} rounded-xl group`}>
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
              </div>}
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
      <AnexoRespuesta
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
