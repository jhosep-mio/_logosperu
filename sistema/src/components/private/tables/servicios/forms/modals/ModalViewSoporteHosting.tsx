import { Dialog } from '@mui/material'
import React from 'react'
import Slide from '@mui/material/Slide'
import { type TransitionProps } from '@mui/material/transitions'

const Transition = React.forwardRef(function Transition (
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export const ModalViewSoporteHosting = ({ open, setOpen, colaboradores }: any): JSX.Element => {
  return (
    <Dialog
    open={open?.estado}
    TransitionComponent={Transition}
    keepMounted
    onClose={() => setOpen({ esatado: false, datos: null })}
    aria-describedby="alert-dialog-slide-description"
    className="moda_registro"
    maxWidth={'md'}
  >
    <div className="bg-white w-full p-6">
        <h2 className='text-black font-bold w-full text-center mb-4 text-lg'>SOPORTE REGISTRADO</h2>
        <div className="w-full  relative pb-5">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="email"
          >
            Persona encargada
          </label>
          <input
            className="flex h-9 w-full rounded-md border border-input border-gray-400 text-black bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
            name="horas"
            value={colaboradores.find((colaborador: any) => colaborador.id == open?.datos?.id_user)?.name || 'Nombre no encontrado'}
            disabled
          />
        </div>
        <div className="w-full  relative pb-5">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="email"
          >
            Tiempo trabajado (En minutos)
          </label>
          <input
            className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
            name="horas"
            type="number"
            step="0.01"
            value={open?.datos?.horas}
            disabled
          />
        </div>
        <div className="w-full  relative pb-5">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="email"
          >
            Detalle del soporte realizado
          </label>
          <textarea
            className="flex w-full resize-none h-[70px] rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
            name="contexto"
            value={open?.datos?.contexto}
            disabled
          ></textarea>
        </div>
      </div>
  </Dialog>
  )
}
