/* eslint-disable react/react-in-jsx-scope */
'use client'
import { Dialog, DialogContent } from '@mui/material'
import SwiperPlanes from './planes/SwiperPlanes'
import { IoClose } from 'react-icons/io5'

export const ModalDiseno = ({
  open,
  setOpen,
  servicio
}: {
  open: any;
  setOpen: any;
  servicio: string;
}) => {
  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xl"
        className="swiper_planes_logo_modal"
      >
        <button
          type="button"
          onClick={() => setOpen(!open)}
          className="absolute top-2 z-[500] right-4 md:right-2 w-10 h-10 md:w-12 md:h-12 text-white rounded-full bg-main p-2 flex items-center justify-center"
        >
          <IoClose className="text-3xl" />
        </button>
        <DialogContent className="w-full " onClick={(e) => e.stopPropagation()}>
          <SwiperPlanes servicio={servicio} />
        </DialogContent>
      </Dialog>
    </>
  )
}
