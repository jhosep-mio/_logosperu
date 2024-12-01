import { type tableroInterface } from '../../../../shared/schemas/Interfaces'
import { useRef, useEffect, type Dispatch, type SetStateAction, useState } from 'react'
import { SlOptions } from 'react-icons/sl'
import { IoClose } from 'react-icons/io5'
import Swal from 'sweetalert2'
import { useParams } from 'react-router-dom'

export const TItuloTarjeta = ({
  tituloEdicion,
  table,
  setTablero,
  settituloEdicion,
  updateCita,
  events
}: {
  tituloEdicion: string | null
  table: tableroInterface
  setTablero: Dispatch<SetStateAction<tableroInterface[]>>
  settituloEdicion: Dispatch<SetStateAction<string | null>>
  updateCita: (updatedEvents: Event[]) => Promise<void>
  events: Event[]
}): JSX.Element => {
  const tituloEdicionTareRef = useRef(null)
  const { idTablero } = useParams()
  const autoAdjustTextareaHeight = (textarea: HTMLTextAreaElement): void => {
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  useEffect(() => {
    if (tituloEdicion && tituloEdicionTareRef.current) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      tituloEdicionTareRef.current.focus()
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      tituloEdicionTareRef.current.setSelectionRange(tituloEdicionTareRef.current.value.length, tituloEdicionTareRef.current.value.length)
      autoAdjustTextareaHeight(tituloEdicionTareRef.current)
    }
  }, [tituloEdicion])

  const handleEditarTitulo = (id: string, nuevoTitulo: string): void => {
    const filteredEvents = events.filter((event: any) => event.id === idTablero)
    const contenidoFiltrado: any = filteredEvents[0]
    if (contenidoFiltrado) {
      contenidoFiltrado.contenido = contenidoFiltrado.contenido.map((tarjeta: any) =>
        tarjeta.id === id ? { ...tarjeta, titulo: nuevoTitulo } : tarjeta
      )
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      const updatedEvents = events.map((event) => event.id === id ? contenidoFiltrado : event)
      // Aquí debes implementar la lógica para actualizar el título en tu estado/tablero
      setTablero((prevTablero) =>
        prevTablero.map((tarjeta) =>
          tarjeta.id === id ? { ...tarjeta, titulo: nuevoTitulo } : tarjeta
        )
      )
      updateCita(updatedEvents)
      settituloEdicion(null)
    }
    // Desactivar la edición del título
  }

  const [tituloAeditar, setTituloAeditar] = useState('')

  const handleTitleContenidoEdicion = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ): void => {
    setTituloAeditar(e.target.value)
    e.target.style.height = `${e.target.scrollHeight}px`
    // Ajusta la altura del textarea según el contenido
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  const [options, setOptions] = useState<string | null>(null)

  const handleEliminarTarjeta = (id: string): void => {
    Swal.fire({
      title: '¿Estas seguro(a) de eliminar la lista?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        const filteredEvents = events.filter((event: any) => event.id === idTablero)
        const contenidoFiltrado: any = filteredEvents[0]

        if (contenidoFiltrado) {
          const updatedContenido = contenidoFiltrado.contenido.filter((tarjeta: any) => tarjeta.id !== id)
          // Crear una copia del evento excluyendo el objeto con idTablero dentro de contenido
          const updatedEvent = {
            ...contenidoFiltrado,
            contenido: updatedContenido
          }
          const updatedEvents = events.map((event: any) => (event.id === idTablero ? updatedEvent : event))
          updateCita(updatedEvents)
          setTablero((prevTablero) => prevTablero.filter((tarjeta) => tarjeta.id !== id))
        }
      }
    })
  }

  return (
    <div className="py-0 flex">
      {tituloEdicion == table.id
        ? (
        <textarea
            ref={tituloEdicionTareRef}
            name="tareaedicion"
            rows={1}
            className="text-gray-600 rounded-md px-2 h-auto py-1 w-[90%] mb-1 resize-none font-semibold break-words border-2 border-cyan-700 outline-none outline-transparent overflow-hidden"
            onKeyDown={(e: any) => {
              if (e.key === 'Enter') {
                e.preventDefault() // Previene el salto de línea predeterminado
                if (tituloAeditar.length > 0) {
                  handleEditarTitulo(table.id, e.target.value)
                }
              }
            }}
            value={tituloAeditar}
            onChange={handleTitleContenidoEdicion}
            onClick={(e) => {
              e.stopPropagation()
            }}
        ></textarea>

          )
        : (
        <p
          className="text-gray-600 rounded-md px-2 py-1 w-[89%] border-2 border-transparent font-semibold break-words "
          onClick={(e) => {
            settituloEdicion(table.id)
            setTituloAeditar(table.titulo)
            e.stopPropagation()
          }}
        >
          {table.titulo}
        </p>
          )}
        <div className='w-[11%] h-fit relative'>
            <div className='w-full h-fit  py-2 my-1 flex justify-center cursor-pointer rounded-lg items-center hover:bg-gray-300 transition-colors relative' onClick={() => {
              setOptions(table.id)
            } }>
                <SlOptions className='text-black text-sm' />
            </div>
            {options == table.id &&
                <div className='absolute top-full mt-2 left-0 py-2 w-[230px] bg-[#F1F2F4] rounded-lg z-[20] shadow-md'>
                    <span className='absolute right-2 top-1 text-gray-700 text-xl cursor-pointer' onClick={() => { setOptions(null) }}><IoClose/></span>
                    <div className='flex flex-col gap-3 w-full pt-2 mt-2'>
                        <span className='text-gray-700 hover:bg-gray-300 transition-colors px-2 py-1 cursor-pointer' onClick={() => { handleEliminarTarjeta(table.id) }}>Eliminar</span>
                    </div>
                </div>
            }
        </div>
    </div>
  )
}
