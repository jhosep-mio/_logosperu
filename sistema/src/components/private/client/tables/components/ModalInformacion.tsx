/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable multiline-ternary */
import { Dialog, DialogContent } from '@mui/material'
import { type Dispatch, type SetStateAction } from 'react'
import { IoMdCloseCircle } from 'react-icons/io'

export const ModalInformacion = ({
  open,
  setOpen,
  eventSelected,
  brief
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  eventSelected: any | null
  brief: any | null
}): JSX.Element => {
  const fechaActual = new Date()
  const fechaVencimiento = new Date(eventSelected?.fecha_vencimiento)

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false)
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className=""
      >
        <DialogContent className="w-full h-fit bg-transparent quitaR_padding relative">
        <IoMdCloseCircle className='absolute top-2 right-6 text-3xl z-10 cursor-pointer' onClick={() => { setOpen(false) }}/>
          <section className="w-full h-fit bg-white p-4 rounded-md flex flex-col justify-between overflow-y-auto">
            <div className="w-full ">
              <div className="w-full relative">
                <h1 className="w-full uppercase text-center font-bold text-2xl">
                  {eventSelected?.title}
                </h1>
              </div>
              <div className="mt-6">
                {fechaVencimiento < fechaActual && brief.uso == '0'
                  ? <span className='text-red-700 text-xl'>PLAZO DE ENVIO DE INFORMACIÓN VENCIDO</span>
                  : brief.uso == '0' ? <span className='text-gray-700 text-xl'>El cliente aun no completo el brief </span>
                    : <span className='text-gray-700 text-xl'>El cliente ya completo el llenado de brief </span>
                }
              </div>
            </div>
          </section>
        </DialogContent>
      </Dialog>
    </>
  )
}
