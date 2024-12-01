/* eslint-disable @typescript-eslint/ban-ts-comment */
import { SlPencil } from 'react-icons/sl'
import {
  type tableroInterface,
  type contenidoInteface,
  type DuoContent
} from '../../../../shared/schemas/Interfaces'
import { useRef, type Dispatch, type SetStateAction, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { IoClose } from 'react-icons/io5'
import { useParams } from 'react-router-dom'
import { cn } from '../../../../shared/cn'

export const ContenidoTarjeta = ({
  table,
  seccionAbierta,
  tituloContenido,
  setTablero,
  setTituloContenido,
  setSeccionAbierta,
  tituloContenidoEdicion,
  settituloContenidoEdicion,
  updateCita,
  events,
  setOpenModal,
  setContenidoSeleccionado
}: {
  table: tableroInterface
  seccionAbierta: string | null
  tituloContenido: string | null
  setTablero: Dispatch<SetStateAction<tableroInterface[]>>
  setTituloContenido: Dispatch<SetStateAction<string | null>>
  setSeccionAbierta: Dispatch<SetStateAction<string | null>>
  tituloContenidoEdicion: string | null
  settituloContenidoEdicion: Dispatch<SetStateAction<string | null>>
  updateCita: (updatedEvents: Event[]) => Promise<void>
  setOpenModal: Dispatch<SetStateAction<boolean>>
  setContenidoSeleccionado: Dispatch<SetStateAction<DuoContent | null>>
  events: Event[]
}): JSX.Element => {
  const textareaRef = useRef(null)
  const { idTablero } = useParams()

  const handleAgregarTarjeta = (tableId: string): void => {
    if (tituloContenido?.trim()) {
      const filteredEvents = events.filter((event: any) => event.id === idTablero)
      const contenidoFiltrado: any = filteredEvents[0]
      const idUnico = uuidv4()
      if (contenidoFiltrado) {
        const updatedEvents = events.map((event: any) =>
          event.id === idTablero
            ? {
                ...event,
                contenido: event.contenido.map((innerContent: any) =>
                  innerContent.id === tableId
                    ? {
                        ...innerContent,
                        contenido: [
                          ...(innerContent.contenido || []),
                          { id: idUnico, titulo: tituloContenido, contexto: null }
                        ]
                      }
                    : innerContent
                )
              }
            : event
        )
        setTablero((prevTablero: any) =>
          prevTablero.map((tarjeta: tableroInterface) =>
            tarjeta.id === tableId
              ? {
                  ...tarjeta,
                  contenido: [
                    ...(tarjeta.contenido ?? []), // Agregar elementos anteriores si existen
                    { id: idUnico, titulo: tituloContenido, contexto: null }
                  ]
                }
              : tarjeta
          )
        )
        updateCita(updatedEvents)
        setTituloContenido('')
        setSeccionAbierta(null)
      }
    }
  }

  const handleTitleContenido = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setTituloContenido(e.target.value)
    e.target.style.height = '1.7rem'
    // Ajusta la altura del textarea según el contenido
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  const tituloContenidoEdicionTareRef = useRef(null)

  const handleEditarTituloContenido = (
    idTable: string,
    idContenido: string,
    nuevoTitulo: string
  ): void => {
    // Aquí debes implementar la lógica para actualizar el título en tu estado/tablero

    const filteredEvents = events.filter((event: any) => event.id === idTablero)
    const contenidoFiltrado: any = filteredEvents[0]
    if (contenidoFiltrado) {
      const updatedEvents = events.map((event: any) =>
        event.id === idTablero
          ? {
              ...event,
              contenido: event.contenido.map((innerContent: any) =>
                innerContent.id === idTable
                  ? {
                      ...innerContent,
                      contenido: innerContent.contenido?.map((contenido: any) =>
                        contenido.id === idContenido
                          ? { ...contenido, titulo: nuevoTitulo }
                          : contenido
                      )
                    }
                  : innerContent
              )
            }
          : event
      )
      updateCita(updatedEvents)
      setTablero((prevTablero: any) =>
        prevTablero.map((tarjeta: tableroInterface) =>
          tarjeta.id === idTable
            ? {
                ...tarjeta,
                contenido: tarjeta.contenido?.map((contenido) =>
                  contenido.id === idContenido
                    ? { ...contenido, titulo: nuevoTitulo }
                    : contenido
                )
              }
            : tarjeta
        )
      )

      settituloContenidoEdicion(null)
    }
  }

  const autoAdjustTextareaHeight = (textarea: HTMLTextAreaElement): void => {
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  useEffect(() => {
    if (tituloContenidoEdicion && tituloContenidoEdicionTareRef.current) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      tituloContenidoEdicionTareRef.current.focus()
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      tituloContenidoEdicionTareRef.current.setSelectionRange(tituloContenidoEdicionTareRef.current.value.length, tituloContenidoEdicionTareRef.current.value.length)
      autoAdjustTextareaHeight(tituloContenidoEdicionTareRef.current)
    }
  }, [tituloContenidoEdicion])

  useEffect(() => {
    if (seccionAbierta && textareaRef.current) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      textareaRef.current?.focus()
    }
  }, [seccionAbierta])

  const [tituloEdicion, setTituloEdicion] = useState('')

  const handleTitleContenidoEdicion = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setTituloEdicion(e.target.value)
    e.target.style.height = `${e.target.scrollHeight}px`
    // Ajusta la altura del textarea según el contenido
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  const calcularPorcentaje = (arrayList: any): string => {
    if (arrayList.length === 0) return '0' // Evitar dividir por cero si no hay elementos en la lista
    const countChecked = arrayList.filter((item: any) => item.check).length
    return ((countChecked / arrayList.length) * 100).toFixed(0)
  }

  return (
    <>
      {tituloContenidoEdicion != null && (
        <div className="fixed inset-0 bg-black/40 z-20"></div>
      )}

      {(table.contenido && table.contenido?.length > 0) ?? seccionAbierta == table.id
        // eslint-disable-next-line multiline-ternary
        ? <div className="flex flex-col gap-2 pb-3">
        {table.contenido?.map((contenido: contenidoInteface) => (
          <div key={contenido.id} className={`w-full h-fit relative group ${contenido.id == tituloContenidoEdicion ? 'z-30' : ''}`}>
            {tituloContenidoEdicion == contenido.id
              ? (
                <>
                    <textarea
                        ref={tituloContenidoEdicionTareRef}
                        name="tareaedicion"
                        rows={1}
                        className={' bg-white p-2 h-auto w-full text-black outline-none rounded-md break-words resize-none'}
                        onKeyDown={(e: any) => {
                          if (e.key === 'Enter') {
                            e.preventDefault() // Previene el salto de línea predeterminado
                            if (tituloEdicion.length > 0) {
                              handleEditarTituloContenido(table.id, contenido.id, e.target.value)
                            }
                          }
                        }}
                        onChange={handleTitleContenidoEdicion}
                        value={tituloEdicion}
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                    ></textarea>
                    <button
                    onClick={(e: any) => {
                      e.stopPropagation()
                      if (tituloEdicion.length > 0) {
                        handleEditarTituloContenido(table.id, contenido.id, tituloEdicion)
                      }
                    }}
                    className='absolute -bottom-10 z-30 flex gap-2 px-2 py-1 w-fit items-center bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer  rounded-md text-white'>Guardar</button>
                </>
                )
              : (
                <>
                    <p
                    onClick={() => { setOpenModal(true); setContenidoSeleccionado({ contenido, contexto: table }) }}
                    className={cn(
                      // @ts-expect-error
                      contenido?.contexto?.checklist.length > 0 ? calcularPorcentaje(contenido?.contexto?.checklist) == '100' ? 'bg-green-500' : calcularPorcentaje(contenido?.contexto?.checklist) > '50' ? 'bg-yellow-500' : 'bg-red-400' : 'bg-gray-300',
                      'group-hover:border-cyan-700 group-hover:cursor-pointer transition-colors border border-transparent z-[2] p-2 w-full text-black rounded-md break-words resize-none flex justify-between items-center')}>
                        {contenido.titulo ?? ''}
                    </p>
                    <span
                    onClick={(e) => {
                      settituloContenidoEdicion(contenido.id)
                      setTituloEdicion(contenido.titulo)
                      e.stopPropagation()
                    }}
                    className="hidden group-hover:block transition-all group-hover:cursor-pointer absolute top-[1px] z-[0] right-[1px] w-fit h-fit bg-gray-300 hover:bg-gray-400 p-2 rounded-full"
                    >
                    <SlPencil className="text-xs text-black" />
                    </span>
                </>
                )}
          </div>
        ))}
        {seccionAbierta == table.id && (
          <>
            <div
              className="w-full h-fit"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <textarea
                ref={textareaRef}
                placeholder="Introduce un titulo para esta tarjeta..."
                name="tarea"
                value={tituloContenido ?? ''}
                rows={1}
                onKeyDown={(e: any) => {
                  if (e.key === 'Enter') {
                    e.preventDefault() // Previene el salto de línea predeterminado
                    if (e.target.value.length > 0) {
                      handleAgregarTarjeta(table.id)
                    }
                  }
                }}
                onChange={handleTitleContenido}
                className="bg-gray-300 p-2 min-h-[40px] w-full text-black  rounded-md break-words resize-none"
              ></textarea>
            </div>
            <div
              className="flex gap-4 items-center"
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <div className="flex gap-2 px-2 py-2 w-fit items-center bg-cyan-700 hover:bg-cyan-600 transition-colors cursor-pointer  rounded-md ">
                <p
                  className="text-white text-sm"
                  onClick={() => {
                    handleAgregarTarjeta(table.id)
                  }}
                >
                  Añadir tarjeta
                </p>
              </div>
              <IoClose
                className="text-black text-xl cursor-pointer"
                onClick={() => {
                  setSeccionAbierta(null)
                }}
              />
            </div>
          </>
        )}
      </div> : null}

    </>
  )
}
