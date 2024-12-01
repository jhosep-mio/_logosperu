import { DialogTitle } from '@mui/material'
import { icono } from '../../../../../shared/Images'
import { IoMdCloseCircle } from 'react-icons/io'

export const ModalLista = ({
  open,
  setOpen
}: {
  ventas: any[]
  open: any
  setOpen: any
  colaboradores: never[]
}): JSX.Element => {
  return (
    <>
      {open && (
        <div className='modal_citas_clientes99 fixed h-full flex items-center inset-0 bg-white '>
            <IoMdCloseCircle className='absolute top-2 right-2 text-4xl text-red-600 cursor-pointer' onClick={() => setOpen({ estado: false })}/>
            <div className="  items-center h-fit">
            <DialogTitle
                className="w-full"
            >
                <div className={'w-full flex justify-center  items-center'}>
                <img
                    src={icono}
                    alt=""
                    className="w-fit h-[60px] object-contain"
                />
                </div>
            </DialogTitle>
            <div>
                {/* <ListaVentas
                productos={ventas}
                open={open}
                colaboradores={colaboradores}
                /> */}
            </div>
            </div>
        </div>
      )}
    </>
  )
}
