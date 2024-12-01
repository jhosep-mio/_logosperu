/* eslint-disable react/react-in-jsx-scope */
'use client'
import { Dialog, DialogContent } from '@mui/material'
import { CardPlanes, planesItems } from './CardPlanes'

export const TotalPlan = ({ fullPlan, setFullPlan, plan }: { fullPlan: any; setFullPlan: any, plan: planesItems }) => {
  return (
    <Dialog
        open={fullPlan}
        onClose={() => setFullPlan(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xl"
        className='swiper_planes_logo_modal'
      >
        <DialogContent className="w-full " onClick={(e) => e.stopPropagation()}>
          <CardPlanes plan={plan} desactiveFullPlan/>
        </DialogContent>
      </Dialog>
  )
}
