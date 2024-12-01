import {
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  type PaperProps
} from '@mui/material'
import { type Dispatch, type SetStateAction } from 'react'
import {
  type ValuesPlanes,
  type openFiltersValues,
  type ValuesVentaToMetricas,
  type openFiltersValuesToId
} from '../../../../../shared/schemas/Interfaces'
import { ListaVentas } from './ListaVentas'
import Draggable from 'react-draggable'
import { icono } from '../../../../../shared/Images'
import person from './../../../../../../assets/modals/person.png'

function PaperComponent (props: PaperProps): any {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
      defaultPosition={{ x: -200, y: 0 }} // Posición inicial
    >
      <Paper {...props} />
    </Draggable>
  )
}

export const ModalVentas = ({
  ventas,
  open,
  setOpen,
  planes,
  colaboradores,
  openVentaId
}: {
  ventas: ValuesVentaToMetricas[]
  open: openFiltersValues
  setOpen: Dispatch<SetStateAction<openFiltersValues>>
  planes: ValuesPlanes[]
  colaboradores: never[]
  openVentaId: openFiltersValuesToId
}): JSX.Element => {
  return (
    <Dialog
      open={open.estado}
      onClose={() => {
        setOpen({ estado: false, fecha: null })
      }}
      //   aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="modal_citas_clientes99"
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title"
    >
      <DialogTitle style={{ cursor: 'move' }} id="draggable-dialog-title" className='w-full'>
         <div className={`w-full flex ${openVentaId.nombre ? 'justify-between' : 'justify-center'}  items-center`}>
            {openVentaId.nombre &&
                <div className="flex items-start gap-x-4">
                <img
                    src={person}
                    className="w-12 h-12 object-cover rounded-full ring-2 ring-gray-300 mt-1"
                />
                <div>
                    <span className="text-gray-900 font-medium">
                    {openVentaId.nombre}
                    </span>
                    <p className="text-main text-sm">{openVentaId.cantidad} proyectos</p>
                </div>
                </div>
            }
            <img src={icono} alt="" className='w-fit h-[60px] object-contain'/>
        </div>
      </DialogTitle>
      <DialogContent>
        <ListaVentas
          productos={ventas}
          open={open}
          planes={planes}
          colaboradores={colaboradores}
          openVentaId={openVentaId}
        />
      </DialogContent>
    </Dialog>
  )
}
