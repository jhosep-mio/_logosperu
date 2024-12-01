/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { type tableroInterface } from '../../../../shared/schemas/Interfaces'
import {
  useRef,
  useEffect,
  type Dispatch,
  type SetStateAction,
  useState
} from 'react'
import { SlOptions } from 'react-icons/sl'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger
} from '../../../../../shadcnui/ui/dropdown-menu'
import { Trash2 } from 'lucide-react'

export const TItuloTarjeta = ({
  tituloEdicion,
  itemCuerpo,
  settituloEdicion,
  updateTitleTarjeta,
  deleteTarjeta
}: {
  tituloEdicion: string | null
  itemCuerpo: tableroInterface
  settituloEdicion: Dispatch<SetStateAction<string | null>>
  updateTitleTarjeta: any
  deleteTarjeta: any
}): JSX.Element => {
  const tituloEdicionTareRef = useRef(null)

  const autoAdjustTextareaHeight = (textarea: HTMLTextAreaElement): void => {
    textarea.style.height = 'auto'
    textarea.style.height = `${textarea.scrollHeight}px`
  }

  useEffect(() => {
    if (tituloEdicion && tituloEdicionTareRef.current) {
      // @ts-expect-error
      tituloEdicionTareRef.current.focus()
      // @ts-expect-error
      tituloEdicionTareRef.current.setSelectionRange(
        // @ts-expect-error
        tituloEdicionTareRef.current.value.length,
        // @ts-expect-error
        tituloEdicionTareRef.current.value.length
      )
      autoAdjustTextareaHeight(tituloEdicionTareRef.current)
    }
  }, [tituloEdicion])

  const handleEditarTitulo = (id: string, nuevoTitulo: string): void => {
    if (itemCuerpo) {
      if (tituloAeditar.length > 0) {
        updateTitleTarjeta(id, nuevoTitulo)
        settituloEdicion(null)
      } else {
        toast.warning('El titulo no puede registrarse vacio')
      }
    }
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

  return (
    <div className="py-0 flex">
      {tituloEdicion == itemCuerpo.id ? (
        <textarea
          ref={tituloEdicionTareRef}
          name="tareaedicion"
          rows={1}
          className="text-gray-600 rounded-md px-2 h-auto py-1 w-[90%] mb-1 resize-none font-semibold break-words border-2 border-cyan-700 outline-none outline-transparent overflow-hidden"
          onKeyDown={(e: any) => {
            if (e.key === 'Enter') {
              e.preventDefault() // Previene el salto de línea predeterminado
              if (tituloAeditar.length > 0) {
                handleEditarTitulo(itemCuerpo.id, e.target.value)
              }
            }
          }}
          value={tituloAeditar}
          onChange={handleTitleContenidoEdicion}
          onClick={(e) => {
            e.stopPropagation()
          }}
        ></textarea>
      ) : (
        <p
          className="text-gray-600 rounded-md px-2 py-1 w-[89%] border-2 border-transparent font-semibold break-words "
          onClick={(e) => {
            settituloEdicion(itemCuerpo.id)
            setTituloAeditar(itemCuerpo.titulo)
            e.stopPropagation()
          }}
        >
          {itemCuerpo.titulo}
        </p>
      )}
      <DropdownMenu>
        <div className="w-[11%] h-fit relative">
          <DropdownMenuTrigger asChild>
            <div className="w-full h-fit  py-2 my-1 flex justify-center cursor-pointer rounded-lg items-center hover:bg-gray-300 transition-colors relative">
              <SlOptions className="text-black text-sm" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56 bg-zinc-100">
            <DropdownMenuItem
              className="cursor-pointer "
              onClick={() => {
                deleteTarjeta(itemCuerpo.id)
              }}
            >
              Eliminar
              <DropdownMenuShortcut>
                <Trash2 className="w-5" />
              </DropdownMenuShortcut>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </div>
      </DropdownMenu>
    </div>
  )
}
