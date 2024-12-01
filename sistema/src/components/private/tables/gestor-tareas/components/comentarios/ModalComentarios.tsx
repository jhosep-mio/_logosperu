import { BsChatDotsFill } from 'react-icons/bs'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTrigger
} from '../../../../../../shadcnui/ui/sheet'
import { CrearComentario } from './CrearComentario'
import { ListaComentarios } from './ListaComentarios'

export const ModalComentarios = ({
  setOpenOptions,
  comentarios,
  guardarComentarios,
  editarComentario
}: any): JSX.Element => {
  return (
    <Sheet>
      <SheetTrigger onClick={() => setOpenOptions(false)}>
        <BsChatDotsFill
          className="absolute -top-2 right-7 text-sm transition-colors hover:bg-gray-300/50 p-2 w-10 h-10 rounded-full cursor-pointer"
          onClick={() => {
            setOpenOptions(false)
          }}
        />
        {comentarios?.length > 0 && (
          <span className="absolute -top-2 right-7 z-10 bg-red-500 w-4 h-4 rounded-full flex items-center justify-center text-white">
            {comentarios?.length}
          </span>
        )}
      </SheetTrigger>
      <SheetContent side="right" className="w-[400px] sm:w-[500px] !max-w-full">
        <SheetHeader>
          <SheetDescription>
            <section className="w-full h-full md:h-fit">
              <CrearComentario guardarComentarios={guardarComentarios} />
              <ListaComentarios
                comentarios={comentarios}
                editarComentario={editarComentario}
              />
            </section>
          </SheetDescription>
        </SheetHeader>
      </SheetContent>
    </Sheet>
  )
}
