/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import Slide from '@mui/material/Slide'
import { type TransitionProps } from '@mui/material/transitions'
import { cn } from '../../../../shared/cn'
import { Link } from 'react-router-dom'
import { limpiarCadena } from '../../../../shared/functions/QuitarAcerntos'
import useAuth from '../../../../../hooks/useAuth'

const Transition = React.forwardRef(function Transition (
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export const VerComentarios = ({
  open,
  setOpen
}: any): JSX.Element => {
  const handleClose = (): void => {
    setOpen(null)
  }
  const { auth } = useAuth()
  return (
    <Dialog
      open={open?.estado ?? false}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      className="moda_registro"
      maxWidth={'lg'}
    >
      <section
        className={cn(
          'w-full grid')}
      >
        <div className="w-full p-4">
            <h2 className='mx-auto w-full text-black font-bold uppercase text-center text-xl mb-4'>Historial de comentarios - {open?.comentarios?.nombres} {open?.comentarios?.apellidos}</h2>
            <div className='grid grid-cols-10 pb-1 mb-3   w-full' >
                <p className='w-full text-center  col-span-1'>Contrato</p>
                <p className='w-full text-center  col-span-1'>Puntuación</p>
                <p className='w-full text-center  col-span-2'>Plan</p>
                <p className='w-full text-center  col-span-2'>Marca</p>
                <p className='pl-4 col-span-4'>Comentario</p>
            </div>
            {open?.comentarios?.comentariototales?.map((comentario: any, index: number) => (
                <div className={cn('grid grid-cols-10 pb-1 py-2 items-center border-t border-gray-300 w-full', index % 2 != 0 ?? 'bg-gray-200')} key={index}>
                    {auth.id_rol == 99
                      ? <Link target='_blank' to={`/admin/lista-servicios/avances/${comentario.id ?? ''}`} className=' hover:text-blue-500 text-center transition-colors'>{limpiarCadena(comentario.id_contrato)}</Link>
                      : <p>{limpiarCadena(comentario.id_contrato)}</p>
                    }
                    <p className='w-full text-center col-span-1'>{comentario?.puntuacion}</p>
                    <p className='w-full text-center col-span-2'>{comentario?.nombre_plan}</p>
                    <p className='w-full text-center col-span-2'>{open?.comentarios?.nombre_marca}</p>
                    <p className='pl-4 col-span-4'>{comentario.comentario}</p>
                </div>
                // <div className='shadow-md rounded-md flex py-3 px-4 bg-gray-200' >
                //
                //     <p className='pl-4'>{comentario.comentario}</p>
                // </div>
            ))}
        </div>
      </section>
    </Dialog>
  )
}
