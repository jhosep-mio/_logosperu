/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Dialog } from '@mui/material'
export const DetallePermiso = ({
  open,
  setOpen
}: {
  open: any
  setOpen: any
}): JSX.Element => {
  return (
    <Dialog
      open={open.estado}
      onClose={() => {
        setOpen({ estado: false, titulo: '', description: '' })
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className=""
      maxWidth={'md'}
    >
        <div className="bg-white w-[800px]  p-4 overflow-hidden group rounded-none  shadow hover:shadow-lg transition-all hover:cursor-pointer overflow-y-auto">
            <h2 className='w-full text-center uppercase text-main text-2xl font-bold'>{open?.titulo}</h2>
            <p className='mt-4 text-justify w-full'>{open?.description}</p>
        </div>
    </Dialog>
  )
}
