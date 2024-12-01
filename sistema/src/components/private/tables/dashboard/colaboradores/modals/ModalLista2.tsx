import {
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  type PaperProps
} from '@mui/material'
import Draggable from 'react-draggable'
import { icono } from '../../../../../shared/Images'
import { ListaVentas2 } from './ListaVentas2'

function PaperComponent (props: PaperProps): any {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
      defaultPosition={{ x: 0, y: 0 }} // Posición inicial
    >
      <Paper {...props} />
    </Draggable>
  )
}

export const ModalLista2 = ({
  open,
  setOpen,
  colaboradores
}: {
  open: any
  setOpen: any
  colaboradores: any
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
         <div className={'w-full flex justify-center  items-center'}>
            <img src={icono} alt="" className='w-fit h-[60px] object-contain'/>
        </div>
      </DialogTitle>
      <DialogContent>
        {open.estado &&
        <ListaVentas2
          open={open}
          colaboradores={colaboradores}
        />
        }
      </DialogContent>
    </Dialog>
  )
}
