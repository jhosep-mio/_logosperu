/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import {
  type Dispatch,
  type SetStateAction
} from 'react'
import { upload } from '../../../../shared/Images'

interface values {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  setArchivosSubido: any
  archivosSubido: any
}

export const SubirArchivo = ({ open, setOpen, setArchivosSubido }: values): JSX.Element => {
  const handleClose = (): void => {
    setOpen(false)
  }

  const handleSubirArchivo = async (evento: React.ChangeEvent<HTMLInputElement>): Promise<void> => {
    const archivosSeleccionados = evento.target.files
    if (archivosSeleccionados) {
      const primerArchivo = archivosSeleccionados[0]
      setArchivosSubido(primerArchivo)
    }
    setOpen(false)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="modal_archivos_finales"
    >
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          <section className="w-full lg:w-96 min-h-[300px] flex flex-col justify-between">
            <h1 className="bg-main w-full text-center text-white font-bold px-4 py-2 text-xl">
              SUBIR ARCHIVO
            </h1>
              <div className="relative w-full md:w-[600px] lg:w-96 h-fit">
                <input
                  className="w-full h-full absolute inset-0 opacity-0 cursor-pointer"
                  type="file"
                  accept="*"
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onChange={handleSubirArchivo}
                />
                <img
                  src={upload}
                  alt=""
                  className="object-contain w-full h-full"
                />
              </div>
          </section>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>CERRAR</Button>
      </DialogActions>
    </Dialog>
  )
}
