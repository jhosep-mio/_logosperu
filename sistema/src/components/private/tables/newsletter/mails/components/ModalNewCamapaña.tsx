/* eslint-disable @typescript-eslint/no-misused-promises */
import { Dialog } from '@mui/material'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Slide from '@mui/material/Slide'
import { type TransitionProps } from '@mui/material/transitions'
import React, { useState } from 'react'
import { useFormik } from 'formik'
import { SchemaNewCampana } from '../../../../../shared/schemas/Schemas'
import { Loading } from '../../../../../shared/Loading'
import axios from 'axios'

const Transition = React.forwardRef(function Transition (
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export const ModalNewCamapaña = ({ open, setOpen }: any): JSX.Element => {
  const [loading] = useState(false)

  const enviarMail = async (): Promise<void> => {
    console.log('entro')
    const data = new FormData()
    const token = localStorage.getItem('token')
    data.append('tipo', 'cliente')
    try {
      const result = await axios.post('http://localhost:4001/api/boletin/enviarBoletin', data, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })
      console.log(result)
    } catch (error: unknown) {
      console.log(error)
    }
  }

  const {
    handleSubmit
    // handleChange,
    // errors,
    // values,
    // touched,
    // handleBlur,
    // setValues
  } = useFormik({
    initialValues: {
      nombres: 'ssss'
    },
    validationSchema: SchemaNewCampana,
    onSubmit: enviarMail
  })

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => setOpen(false)}
      aria-describedby="alert-dialog-slide-description"
      className="moda_registro"
      maxWidth={'md'}
    >
      <section className="w-full">
        <div className="w-full">
          {!loading
            ? (
            <DialogContentText id="alert-dialog-slide-description">
              <h2 className="w-full font-bold text-2xl text-center text-white bg-main/80 py-2">
                hola
              </h2>
              <hr className="py-2" />
              <form action="" onSubmit={handleSubmit}>
                <button type='button' onClick={async () => { await enviarMail() }}>Enviar</button>
              </form>
            </DialogContentText>
              )
            : (
            <DialogContentText
              id="alert-dialog-slide-description"
              className="min-h-96"
            >
              <Loading />
            </DialogContentText>
              )}
          <DialogActions className="relative">
            <button
              className="bg-red-600 hover:bg-red-800 text-white px-4 text-lg rounded-md"
              onClick={() => setOpen(false)}
            >
              Cerrar
            </button>
          </DialogActions>
        </div>
      </section>
    </Dialog>
  )
}
