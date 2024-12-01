import { BsPencilSquare, BsReplyAllFill } from 'react-icons/bs'
import {
  type Dispatch,
  type SetStateAction,
  type LegacyRef,
  useState
} from 'react'
import { type ValuesVenta, type errorValues, type valuesResumen } from '../../../shared/schemas/Interfaces'
import useAuth from '../../../../hooks/useAuth'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { FaSave } from 'react-icons/fa'
import { fechaFormateada } from '../../../shared/functions/GenerarTextoEnLetras'
import { chat } from '../../../shared/Images'
import { ModalRespuestaColaboradorToColaborador } from './ModalRespuestaColaboradorToColaborador'

export const VistaColaboradorToColaborador = ({
  id,
  resumenOrdenado,
  endOfMessagesRef,
  resumen,
  setResumen,
  permitirEdicion,
  getOneBrief,
  idEdicion,
  setIdEdicion,
  textoEditado,
  setTextoEditado,
  loading,
  handleUpdateEdit,
  handleUpdate,
  setRespuestaAdmin,
  respuestaAdmin,
  setShowError,
  proyecto
}: {
  id: string | undefined
  resumen: valuesResumen[]
  resumenOrdenado: valuesResumen[]
  endOfMessagesRef: LegacyRef<HTMLDivElement> | undefined
  permitirEdicion: (fechaResumen: string) => boolean
  idEdicion: number | null
  getOneBrief: () => Promise<void>
  setIdEdicion: Dispatch<SetStateAction<number | null>>
  textoEditado: string
  setResumen: Dispatch<SetStateAction<valuesResumen[]>>
  setTextoEditado: Dispatch<SetStateAction<string>>
  handleUpdateEdit: (e: any) => void
  loading: boolean
  handleUpdate: (id: number, nuevoTexto: string) => void
  setRespuestaAdmin: Dispatch<SetStateAction<string>>
  respuestaAdmin: string
  showError: errorValues | null
  setShowError: Dispatch<SetStateAction<errorValues | null>>
  proyecto: ValuesVenta | null
}): JSX.Element => {
  const [open, setOpen] = useState(false)
  const token = localStorage.getItem('token')
  const [idItem, setIdItem] = useState<number | null>(null)
  const [fechaadmin, setFechaadmin] = useState<string | null>(null)
  const { auth } = useAuth()

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
      enviarDatos()
      return nuevosResumenes
    })
    // Limpiar el estado de edición
    setIdEdicion(null)
  }

  const handleTextAdmin = (e: any): void => {
    setRespuestaAdmin(e.target.value)
    e.target.style.height = 'inherit'
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    e.target.style.height = `${e.target.scrollHeight}px` // Ajusta la altura
  }

  const esFechaValida = (fecha: string): boolean => {
    // Dividir la cadena de fecha en día, mes y año
    const [dia, mes, año] = fecha.split('/')
    // Crear una nueva fecha con los componentes divididos
    const fechaComentario = new Date(`${mes}/${dia}/${año}`)
    const fechaActual = new Date()
    const diferenciaDias = Math.floor((fechaActual.getTime() - fechaComentario.getTime()) / (1000 * 3600 * 24))
    return diferenciaDias <= 4
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
            <div className="flex flex-col gap-2" key={index}>
            {fechaElement}
            <div className={`relative bg-white w-full md:w-1/2 ${(resu.userId != '1') && (resu.userId != '99') && (resu.userId != '8') ? 'md:ml-[50%]' : ''} rounded-xl group`}>
                <div
                  className="text-justify bg-white p-4 rounded-xl relative  w-full
                     lowercase first-letter:uppercase text-base "
                >
                    {(resu.userId == '8' || resu.userId == '99') &&
                    <>
                    {esFechaValida(resu.fecha) && (
                        <BsReplyAllFill
                        className="text-xl text-transparent group-hover:text-main transition-colors cursor-pointer absolute top-2 right-6 z-10"
                        onClick={() => {
                          setOpen(true)
                          setIdItem(resu.id)
                          setFechaadmin(resu.fecha)
                        }}
                        />
                    )}
                    </>
                    }
                  {permitirEdicion(resu.fecha) &&
                  idEdicion == resu.id &&
                  resu.userId == auth.id
                    ? <FaSave
                      className="text-xl hover:text-green-500 transition-colors cursor-pointer absolute top-2 right-6 z-10"
                      onClick={() => {
                        handleUpdate(resu.id, textoEditado)
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

                  <span className="w-full flex text-base uppercase first-letter:uppercase items-center gap-3 mb-0 font-bold text-black">
                    {resu.user}
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
                  <span className="w-full flex justify-end text-black">
                    {resu.hora}
                  </span>
                </div>
              </div>
              {resu?.respuesta?.texto && (
                <>
                  <div
                    className={
                      'relative bg-white w-full md:w-1/2  rounded-xl group p-4 group'
                    }
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
              {resu?.respuestas?.map((respues, index: number) => (
                <>
                   {index === 0 && (
                     esFechaValida(resu.fecha) && (
                        <button
                          onClick={() => {
                            setOpen(true)
                            setIdItem(resu.id)
                            setFechaadmin(resu.fecha)
                          }}
                          className="bg-red-500 hover:bg-red-700 transition-colors rounded-xl w-fit mr-auto ml-0 px-4 py-1 text-white font-bold"
                        >
                          Responder
                        </button>
                     )
                   )}
                  <div
                    key={respues.id}
                    className={`relative bg-white w-1/2 ${respues.user == 'Logos Perú' || respues.user == 'Administración' ? '' : 'ml-[50%]'} rounded-xl group p-4 group`}
                  >
                    <span className="w-full flex justify-start uppercase items-center gap-3 mb-3 font-bold pl-4 text-black">
                      {respues.user == 'Logos Perú'
                        ? 'ADMINISTRACIÓN'
                        : respues.user}
                    </span>
                    {idEdicion && idEdicion == respues.id && respues.userId == auth.id
                      ? <FaSave
                      className="text-lg text-transparent group-hover:text-green-500 transition-colors cursor-pointer absolute top-2 right-3 z-10"
                      onClick={() => {
                        editarResumen(resu.id, respues.id, respuestaAdmin)
                      }}
                    />
                      : respues.userId == auth.id && (
                    <BsPencilSquare
                      className="text-lg text-transparent group-hover:text-green-500 transition-colors cursor-pointer absolute top-2 right-3 z-10"
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
                </>
              ))}
            </div>
            <div ref={endOfMessagesRef} />
          </>
          )
        })
        : (
        <div className="w-full flex flex-col gap-4">
          <p className="text-gray-500 text-center text-xl">
            No tiene comentarios para este proyecto
          </p>
          <img src={chat} alt="" className="w-52 object-contain mx-auto" />
        </div>
          )}
      <ModalRespuestaColaboradorToColaborador
        open={open}
        id={id}
        setOpen={setOpen}
        setResumen={setResumen}
        getOneBrief={getOneBrief}
        resumen={resumen}
        idIem={idItem}
        fechaadmin={fechaadmin}
        setShowError={setShowError}
        proyecto={proyecto}
      />
    </>
  )
}
