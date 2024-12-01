'use client'
import { Dialog } from '@mui/material'
import { HiOutlineEnvelope } from 'react-icons/hi2'
import React, { SetStateAction, useState } from 'react'
import { IoClose } from 'react-icons/io5'
import { useFormik } from 'formik'
import axios from 'axios'
import { Global } from '@/helper/Global'
import Swal from 'sweetalert2'
import { SchemaBoletin } from '@/public/components/shared/Schema'
import { Errors } from '@/public/components/web/structure/Errors'

export const ModalSuscribirse = ({
  open,
  setOpen
}: {
  open: boolean;
  setOpen: React.Dispatch<SetStateAction<boolean>>;
}) => {
  const [loading, setLoading] = useState(false)
  const enviarCorreo = async (): Promise<void> => {
    setLoading(true)
    const formData = new FormData()
    formData.append('email', values.email)
    formData.append('nombre', values.nombre)
    try {
      setOpen(false)
      const respuesta = await axios.post(`${Global.url}/suscribirse`, formData)

      if (respuesta.data.status === 'success') {
        Swal.fire('Correo enviado', '', 'success')
        resetForm()
      } else {
        Swal.fire('Error al enviar el correo', '', 'error')
      }
    } catch (error) {
      console.log(error)
      Swal.fire('Error al enviar el correo', '', 'error')
      setLoading(false)
    }
  }
  const {
    handleSubmit,
    handleChange,
    resetForm,
    errors,
    values,
    touched,
    handleBlur
  } = useFormik({
    initialValues: {
      nombre: '',
      email: ''
    },
    validationSchema: SchemaBoletin,
    onSubmit: enviarCorreo
  })

  return (
    <>
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        maxWidth="xl"
        className="modal_suscribirse"
      >
        <div className="py-20">
          <div className="w-full max-w-xl rounded-2xl bg-white border-2 border-main px-5 sm:px-8 md:px-12 lg:px-16 py-12 pt-16 relative">
            <span className="absolute text-3xl flex items-center text-azul_serio justify-center w-20 h-20 rounded-full border-main border-2 p-3 left-0 right-0 mx-auto -top-10 bg-main">
              <HiOutlineEnvelope />
            </span>
            <button
              type="button"
              onClick={() => {
                setOpen(false)
              }}
              className="absolute top-4 right-4 text-black/40 text-3xl z-20"
            >
              <IoClose />
            </button>
            <h2 className="text-3xl font-ysobel_regular mb-3 text-center">
              Boletín
            </h2>
            <p className="text-gray-700 text-center">
              Suscríbite para mantenerte actualizado!
            </p>
            <form onSubmit={handleSubmit} className="mt-12">
              <div className="w-full flex flex-col md:flex-row gap-4">
                <div className="w-full md:w-1/2">
                  <input
                    type="text"
                    name="nombre"
                    placeholder="Nombre"
                    value={values.nombre}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full p-2 py-3 rounded-md text-sm outline-none border border-black/20  focus:border-main hover:border-main transition-all duration-200"
                  />
                  <Errors errors={errors.nombre} touched={touched.nombre} />
                </div>
                <div className="w-full md:w-1/2">
                  <input
                    type="email"
                    name="email"
                    placeholder="Email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full p-2 py-3 rounded-md text-sm outline-none border border-black/20 focus:border-main hover:border-main transition-all duration-200"
                  />
                  <Errors errors={errors.email} touched={touched.email} />
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="bg-main py-2  mt-5 rounded-md text-black w-full"
              >
                Suscribirme
              </button>
            </form>
          </div>
        </div>
      </Dialog>
    </>
  )
}
