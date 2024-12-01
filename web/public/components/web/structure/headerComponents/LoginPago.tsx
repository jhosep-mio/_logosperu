/* eslint-disable @next/next/no-img-element */
import { Global } from '@/helper/Global'
import { Dialog } from '@mui/material'
import axios from 'axios'
import { useFormik } from 'formik'
import { useState } from 'react'
import { toast } from 'sonner'
import * as Yup from 'yup'
import { Errors } from '../Errors'
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri'
import { IoMdCloseCircle } from 'react-icons/io'
// @ts-ignore
import useAuth from '@/public/components/shared/hooks/useAuth'

const Schema = Yup.object().shape({
  email: Yup.string().email('Email invalido').required('Este campo es requerido'),
  password: Yup.string().required('Este campo es requerido').min(1)
})

interface Values {
  email: string;
  password: string;
}

export const LoginPago = ({ open, setOpen, setOpenRegister, setOpenPass }: any) => {
  const openAlerta = () => {
    toast.warning('Metodo no disponible')
  }
  const { setAuth } = useAuth()
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const validar = async (values: Values): Promise<void> => {
    setLoading(true)
    const data = new FormData()
    const email = values.email
    const password = values.password
    data.append('email', email)
    data.append('password', password)
    data.append('_method', 'POST')
    try {
      const respuesta = await axios.post(`${Global.url}/login`, data)
      if (respuesta.data.status == 'success') {
        if (respuesta.data.message == 'Usuario') {
          toast.success('Usuario identificado correctamente')
          localStorage.setItem('tokenUser', respuesta.data.access_token)
          setAuth({
            id: respuesta.data.user.id,
            name: `${respuesta.data.user.nombres}`,
            lastname: `${respuesta.data.user.apellidos}`,
            email: respuesta.data.user.email,
            celular: respuesta.data.user.celular
          })
          setOpen(false)
        } else {
          toast.warning('Este usuario no puede realizar compras')
        }
      } else if (respuesta.data.status == 'invalid') {
        toast.error('Datos incorrectos')
      } else {
        toast.error('Datos incorrectos')
      }
    } catch (error) {
      toast.error('El usuario no existe')
    }
    setLoading(false)
  }

  const { handleSubmit, handleChange, errors, values, touched, handleBlur } = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Schema,
    onSubmit: validar
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
      <div className="w-full rounded-md bg-[#1E1F25] px-6 lg:px-10 py-12 shadow-2xl lg:w-[450px] relative">
        <IoMdCloseCircle className='text-main hover:text-darKmain text-2xl absolute cursor-pointer top-2 right-2'
            onClick={() => setOpen(false)}
        />
        <h1 className="mb-8 text-center text-3xl font-bold uppercase tracking-[5px] text-white">
          Iniciar <span className="text-main">sesión</span>
        </h1>
        <form className="mb-8" onSubmit={(e) => { e.stopPropagation(); handleSubmit(e) }}>
          <button
            onClick={() => openAlerta()}
            type="button"
            className="mb-8 flex w-full items-center justify-center gap-4 rounded-full bg-[#131517] px-4 py-3 text-gray-100"
          >
            <img
              src="https://api.logosperu.com.pe/public/archivosVarios/google_logo.png"
              className="h-4 w-4"
              alt="Ingresa con google"
            />
            Ingresa con google
          </button>
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
                placeholder="Correo electrónico"
              />
            </div>
            <Errors errors={errors.email} touched={touched.email} />
          </div>
          <div className="relative mb-8">
            <div className="relative">
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
                  <path d="M19 10h1a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V11a1 1 0 0 1 1-1h1V9a7 7 0 1 1 14 0v1zM5 12v8h14v-8H5zm6 2h2v4h-2v-4zm6-4V9A5 5 0 0 0 7 9v1h10z"></path>
                </g>
              </svg>
              <input
                type={showPassword ? 'text' : 'password'}
                className="w-full rounded-lg bg-[#131517] px-8 py-3 text-gray-300 outline-none"
                placeholder="Contraseña"
                name="password"
                onBlur={handleBlur}
                value={values.password}
                onChange={handleChange}
              />
              {showPassword
                ? (
                <RiEyeOffLine
                  onClick={() => {
                    setShowPassword(!showPassword)
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-main hover:cursor-pointer"
                />
                  )
                : (
                <RiEyeLine
                  onClick={() => {
                    setShowPassword(!showPassword)
                  }}
                  className="absolute right-2 top-1/2 -translate-y-1/2 text-main hover:cursor-pointer"
                  name="password"
                />
                  )}
            </div>
            <Errors errors={errors.password} touched={touched.password} />
          </div>

          <div>
            <button
              type={loading ? 'button' : 'submit'}
              disabled={loading}
              className="w-full rounded-lg bg-main px-4 py-3 text-sm font-bold uppercase text-black transition-colors hover:bg-darKmain"
            >
              {loading ? 'Validando...' : 'Ingresar'}
            </button>
          </div>
          <div className="mt-3"></div>
        </form>
        <div className="flex flex-col items-center gap-4">
          <button type='button' onClick={() => { setOpenPass(true); setOpen(false) }} className="text-gray-300 transition-colors hover:text-main" >
            ¿Olvidaste tu contraseña?
          </button>
          <span className="flex items-center gap-2 text-gray-300">
            ¿No tienes cuenta?{' '}
            <button type='button' onClick={() => { setOpenRegister(true); setOpen(false) }} className="text-main transition-colors hover:text-gray-100" >
              Registrate
            </button>
          </span>
        </div>
      </div>
    </Dialog>
  )
}
