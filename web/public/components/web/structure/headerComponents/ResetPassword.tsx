/* eslint-disable @next/next/no-img-element */
import { Global } from '@/helper/Global'
import { Dialog } from '@mui/material'
import axios from 'axios'
import { useFormik } from 'formik'
import { useState } from 'react'
import { Toaster, toast } from 'sonner'
import * as Yup from 'yup'
import { Errors } from '../Errors'
import { IoMdCloseCircle } from 'react-icons/io'

const Schema = Yup.object().shape({
  email: Yup.string()
    .email('Email invalido')
    .required('Este campo es requerido')
})

export const ResetPassword = ({ open, setOpen, setOpenLogin }: any) => {
  const [loading, setLoading] = useState(false)
  const [, setOpenCode] = useState(false)

  const sendVerificationCode = async (values: any): Promise<void> => {
    setLoading(true)
    const data = new FormData()
    data.append('email', values.email)
    try {
      const respuesta = await axios.post(
        `${Global.url}/verificacionPassword`,
        data
      )
      if (respuesta.data.status == 'success') {
        setOpenCode(true)
        toast.success(
          'Código de verificación enviado. Por favor, ingrésalo para completar el registro.'
        )
      } else {
        toast.error('Datos incorrectos')
      }
    } catch (error: any) {
      console.log(error)
      if (error.response && error.response.data.errors) {
        const errors = error.response.data.errors
        if (errors.email) {
          toast.warning('No existe ningun usuario con este correo')
        }
      } else {
        toast.error('Error al validar')
      }
    } finally {
      setLoading(false)
    }
  }

  const { handleSubmit, handleChange, errors, values, touched, handleBlur } =
    useFormik({
      initialValues: {
        email: ''
      },
      validationSchema: Schema,
      onSubmit: sendVerificationCode
    })

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="lg"
      className="dialog_login"
    >
      <Toaster position="top-center" richColors />
      <div className="w-full rounded-md bg-[#1E1F25] px-6 lg:px-10 py-12 shadow-2xl lg:w-[450px] relative">
        <IoMdCloseCircle
          className="text-main hover:text-darKmain text-2xl absolute cursor-pointer top-2 right-2"
          onClick={() => setOpen(false)}
        />
        <h1 className="mb-8 text-center text-3xl font-bold uppercase tracking-[5px] text-white">
          Recuperar <span className="text-main">Contraseña</span>
        </h1>
        <form
          className="mb-8"
          onSubmit={(e) => {
            e.stopPropagation()
            handleSubmit(e)
          }}
        >
          <div className="relative mb-4">
            <div className="relative flex items-center">
              <svg
                stroke="currentColor"
                fill="currentColor"
                strokeWidth="0"
                viewBox="0 0 24 24"
                className="absolute left-2 top-1/2 -translate-y-1/2 text-main"
                height="1em"
                width="1em"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g>
                  <path fill="none" d="M0 0h24v24H0z"></path>
                  <path d="M3 3h18a1 1 0 0 1 1 1v16a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1zm17 4.238l-7.928 7.1L4 7.216V19h16V7.238zM4.511 5l7.55 6.662L19.502 5H4.511z"></path>
                </g>
              </svg>
              <input
                type="email"
                name="email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className="w-full rounded-lg bg-[#131517] py-3 pl-8 pr-4 text-gray-300 outline-none"
                placeholder="Ingresa tu correo electronico"
              />
            </div>
            <Errors errors={errors.email} touched={touched.email} />
          </div>
          <div>
            <button
              type={loading ? 'button' : 'submit'}
              disabled={loading}
              className="w-full rounded-lg bg-main px-4 py-3 text-sm font-bold uppercase text-black transition-colors hover:bg-darKmain"
            >
              {loading ? 'Validando...' : 'Enviar'}
            </button>
          </div>
          <div className="mt-3"></div>
        </form>
        <div className="flex flex-col items-center gap-4">
          <span className="flex items-center gap-2 text-gray-300">
            ¿Ya tienes cuenta?{' '}
            <button
              type="button"
              onClick={() => {
                setOpenLogin(true)
                setOpen(false)
              }}
              className="text-main transition-colors hover:text-gray-100"
            >
              Inicia Sessión
            </button>
          </span>
        </div>
      </div>
    </Dialog>
  )
}
