import { Dialog, DialogContent } from '@mui/material'
import { type ValuesPreventaModificate } from '../../../shared/schemas/Interfaces'
import { type Dispatch, type SetStateAction } from 'react'
import { ListaClientes } from './modal/ListaClientes'
export const ModalClientes = ({
  clientes,
  open,
  setOpen,
  handleClientSelection
}: {
  clientes: ValuesPreventaModificate[]
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  handleClientSelection: (selectedClient: ValuesPreventaModificate) => void
}): JSX.Element => {
  return (
    <Dialog
      open={open}
      onClose={() => { setOpen(false) }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className='modal_citas_clientes'
    >
      <DialogContent>
            <ListaClientes productos={clientes} handleClientSelection={handleClientSelection} setOpen={setOpen}/>
      </DialogContent>
    </Dialog>
  )
}
