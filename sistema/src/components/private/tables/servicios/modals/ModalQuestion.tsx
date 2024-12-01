import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material'
import { type Dispatch, type SetStateAction, useState } from 'react'
import useAuth from '../../../../../hooks/useAuth'

interface valuesData {
  link_final: string
  fecha_fin: string
  comentarios: string
  propuestas: string
}

export const ModalQuestion = ({
  open,
  setOpen,
  openCorreo,
  setOpenCorreoActa,
  setOpenAvisoNotificacion,
  setOpenActaAceptacion,
  values,
  setOpenFeErratas,
  arrayAvances
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  openCorreo: Dispatch<SetStateAction<boolean>>
  setOpenCorreoActa: Dispatch<SetStateAction<boolean>>
  setOpenAvisoNotificacion: Dispatch<SetStateAction<boolean>>
  setOpenActaAceptacion: Dispatch<SetStateAction<boolean>>
  setOpenFeErratas: Dispatch<SetStateAction<boolean>>
  arrayAvances: any
  values: valuesData
}): JSX.Element => {
  const { auth } = useAuth()
  const [tipo, setTipo] = useState('')
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false)
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="dialog_fecha_inicio"
    >
      <DialogTitle id="alert-dialog-title" className="text-center w-full">
        {'SELECCIONAR TIPO DE CORREO'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
        //   className="min-h-[200px]"
        >
          <>
            <select name="" id="" value={tipo} onChange={(e) => { setTipo(e.target.value) }} className='bg-gray-300 px-4 py-2 rounded-xl text-center w-full outline-none'>
                <option value="">Seleccionar</option>
                <option value="correo">Correo de avance/entrega</option>
                <option value="acta">Acta de estado de proyecto</option>
                {arrayAvances.length > 0 &&
                    <option value="fedeerratas">Fe de erratas</option>
                }
                {auth.id == '1' &&
                    <option value="aviso">Aviso de notificación</option>
                }
                {auth.id == '1' && values.fecha_fin &&
                    <option value="actaaceptacion">Acta de conformidad y conclusión</option>
                }
            </select>
          </>
        </DialogContentText>
      </DialogContent>
      <DialogActions className="flex items-center">
        <button
          className="bg-gray-600 text-white font-bold text-sm px-3 py-2 rounded-xl"
          onClick={() => {
            setOpen(false)
          }}
        >
          CERRAR
        </button>
        <button
          className="bg-green-600 text-white font-bold text-sm px-3 py-2 rounded-xl"
          onClick={() => {
            if (tipo == 'correo') {
              setOpen(false)
              openCorreo(true)
            } else if (tipo == 'acta') {
              setOpen(false)
              setOpenCorreoActa(true)
            } else if (tipo == 'aviso') {
              setOpen(false)
              setOpenAvisoNotificacion(true)
            } else if (tipo == 'actaaceptacion') {
              setOpen(false)
              setOpenActaAceptacion(true)
            } else if (tipo == 'fedeerratas') {
              setOpen(false)
              setOpenFeErratas(true)
            }
          }}
        >
          CONTINUAR
        </button>
      </DialogActions>
    </Dialog>
  )
}
