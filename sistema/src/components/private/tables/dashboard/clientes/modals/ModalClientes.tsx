import { Dialog, DialogContent } from '@mui/material'
import { type Dispatch, type SetStateAction } from 'react'
import { type openFiltersValues, type ValuesPreventaModificate } from '../../../../../shared/schemas/Interfaces'
import { ListaClientes } from './ListaClientes'
export const ModalClientes = ({
  clientes,
  open,
  setOpen
}: {
  clientes: ValuesPreventaModificate[]
  open: openFiltersValues
  setOpen: Dispatch<SetStateAction<openFiltersValues>>
}): JSX.Element => {
  return (
    <Dialog
      open={open.estado}
      onClose={() => { setOpen({ estado: false, fecha: null }) }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className='modal_citas_clientes3'
    >
      <DialogContent>
            <ListaClientes productos={clientes} open={open}/>
      </DialogContent>
    </Dialog>
  )
}
