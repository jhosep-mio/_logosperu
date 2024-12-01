/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { SlPencil } from 'react-icons/sl'
import { type DuoContent } from '../../../../shared/schemas/Interfaces'
import { useRef, type Dispatch, type SetStateAction, useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { IoClose } from 'react-icons/io5'
import { cn } from '../../../../shared/cn'
import { toast } from 'sonner'

export const ContenidoTarjeta = ({
  itemCuerpo,
  seccionAbierta,
  tituloContenido,
  setTituloContenido,
  setSeccionAbierta,
  tituloContenidoEdicion,
  settituloContenidoEdicion,
  updateContenido,
  setOpenModal,
  setContenidoSeleccionado,
  updateTitleItemTarjeta,
  contenidos
}: {
  itemCuerpo: any
  seccionAbierta: string | null
  tituloContenido: string | null
  setTituloContenido: Dispatch<SetStateAction<string | null>>
  setSeccionAbierta: Dispatch<SetStateAction<string | null>>
  tituloContenidoEdicion: string | null
  settituloContenidoEdicion: Dispatch<SetStateAction<string | null>>
  updateContenido: any
  setOpenModal: Dispatch<SetStateAction<boolean>>
  setContenidoSeleccionado: Dispatch<SetStateAction<DuoContent | null>>
  updateTitleItemTarjeta: any
  contenidos: any
}): JSX.Element => {
  const textareaRef = useRef(null)

  const handleAgregarTarjeta = (idCuerpo: string): void => {
    if (tituloContenido?.trim()) {
      const idUnico = uuidv4()
      if (itemCuerpo) {
        const updatedContenido = itemCuerpo.contenido
          ? [...itemCuerpo.contenido, { id: idUnico, titulo: tituloContenido, contexto: null }]
          : [{ id: idUnico, titulo: tituloContenido, contexto: null }]

        updateContenido(updatedContenido, idCuerpo)
        setTituloContenido('')
        setSeccionAbierta(null)
      }
    }
  }

  const handleTitleContenido = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setTituloContenido(e.target.value)
    e.target.style.height = '1.7rem'
    // Ajusta la altura del textarea según el contenido
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  const tituloContenidoEdicionTareRef = useRef(null)

  const handleEditarTituloContenido = (idTable: string, idContenido: string, nuevoTitulo: string): void => {
    // Aquí debes implementar la lógica para actualizar el título en tu estado/tablero
    if (nuevoTitulo.length > 3) {
      updateTitleItemTarjeta(idTable, idContenido, nuevoTitulo)
      settituloContenidoEdicion(null)
    } else {
      toast.warning('El titulo debe tener mas de 3 digitos')
    }
  }

  const autoAdjustTextareaHeight = (textarea: HTMLTextAreaElement): void => {
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  useEffect(() => {
    if (tituloContenidoEdicion && tituloContenidoEdicionTareRef.current) {
      // @ts-expect-error
      tituloContenidoEdicionTareRef.current.focus()
      // @ts-expect-error
      tituloContenidoEdicionTareRef.current.setSelectionRange(
        // @ts-expect-error
        tituloContenidoEdicionTareRef.current.value.length,
        // @ts-expect-error
        tituloContenidoEdicionTareRef.current.value.length
      )
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

  const handleTitleContenidoEdicion = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setTituloEdicion(e.target.value)
    e.target.style.height = `${e.target.scrollHeight}px`
    // Ajusta la altura del textarea según el contenido
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  const calcularPorcentaje = (idContexto: string): string => {
    if (contenidos.length > 0) {
      const findContenido = contenidos.find((contenido: any) => contenido.idContexto == idContexto)
      if (findContenido?.checklist) {
        const countChecked = JSON.parse(findContenido?.checklist).filter((item: any) => item.check).length
        return ((countChecked / JSON.parse(findContenido?.checklist).length) * 100).toFixed(0)
      } else {
        return 'none'
      }
    } else {
      return 'none'
    }
  }

  return (
    <>
      {tituloContenidoEdicion != null && <div className="fixed inset-0 bg-black/40 z-20"></div>}

      {(itemCuerpo.contenido && itemCuerpo.contenido?.length > 0) ?? seccionAbierta == itemCuerpo.id ? (
        // eslint-disable-next-line multiline-ternary
        <div className="flex flex-col gap-2 pb-3">
          {itemCuerpo.contenido?.map((contenido: any) => (
            <div key={contenido.id} className={`w-full h-fit relative group  ${contenido.id == tituloContenidoEdicion ? 'z-30' : 'overflow-hidden'}`}>
              {tituloContenidoEdicion == contenido.id ? (
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
                          handleEditarTituloContenido(itemCuerpo.id, contenido.id, e.target.value)
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
                        handleEditarTituloContenido(itemCuerpo.id, contenido.id, tituloEdicion)
                      }
                    }}
                    className="absolute -bottom-10 z-30 flex gap-2 px-2 py-1 w-fit items-center bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer  rounded-md text-white"
                  >
                    Guardar
                  </button>
                </>
              ) : (
                <>
                  <p
                    onClick={() => {
                      setOpenModal(true)
                      setContenidoSeleccionado({
                        contenido,
                        contexto: itemCuerpo
                      })
                    }}
                    className={cn(
                      calcularPorcentaje(contenido?.contexto) == 'none'
                        ? 'border-gray-300/60 group-hover:border-cyan-700'
                        : calcularPorcentaje(contenido?.contexto) == '100'
                          ? 'border-green-500 group-hover:border-green-700'
                          : calcularPorcentaje(contenido?.contexto) >= '50'
                            ? 'border-yellow-500 group-hover:border-yellow-700'
                            : 'border-red-600 group-hover:border-red-800',
                      'group-hover:cursor-pointer transition-colors border z-[2] p-2 w-full text-black rounded-md break-words resize-none flex justify-between items-center'
                    )}
                  >
                    {contenido.titulo ?? ''}
                  </p>
                  <div className="flex flex-col items-center justify-center absolute top-0 my-auto bottom-0 z-[0] -right-10 group-hover:right-1 transition-all ">
                    <span
                      onClick={(e) => {
                        settituloContenidoEdicion(contenido.id)
                        setTituloEdicion(contenido.titulo)
                        e.stopPropagation()
                      }}
                      className="bg-transparent hover:bg-gray-200 rounded-full p-1 cursor-pointer"
                    >
                      <SlPencil className="text-sm text-green-700" />
                    </span>
                  </div>
                </>
              )}
            </div>
          ))}
          {seccionAbierta == itemCuerpo.id && (
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
                        handleAgregarTarjeta(itemCuerpo.id)
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
                      handleAgregarTarjeta(itemCuerpo.id)
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
        </div>
      ) : null}
    </>
  )
}
