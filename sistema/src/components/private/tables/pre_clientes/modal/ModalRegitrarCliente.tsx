import { Dialog, DialogContent } from '@mui/material'
import { type Dispatch, type SetStateAction } from 'react'
import { type ValuesPreventaModificate } from '../../../../shared/schemas/Interfaces'
import { RegistrarCliente } from './RegistrarCliente'

export const ModalRegitrarCliente = ({
  open,
  setOpen,
  datos
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  datos: ValuesPreventaModificate
}): JSX.Element => {
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false)
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description "
      className="modal_citas_clientes"
    >
      <DialogContent className="shadow-2xl shadow-slate-950 w-[900px] bg-white overflow-hidden">
        <RegistrarCliente datos={datos} />
      </DialogContent>
    </Dialog>
  )
}
