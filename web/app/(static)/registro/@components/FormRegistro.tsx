'use client'
import React, { useState } from 'react'
/* eslint-disable @next/next/no-img-element */
import { Global } from '@/helper/Global'
import axios from 'axios'
import { useFormik } from 'formik'

import { Toaster, toast } from 'sonner'
import * as Yup from 'yup'
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri'
// @ts-ignore
import { LuUser2 } from 'react-icons/lu'
import { MdLocalPhone, MdOutlineDocumentScanner } from 'react-icons/md'
import { Errors } from '@/public/components/web/structure/Errors'
import Link from 'next/link'
const Schema = Yup.object().shape({
  nombres: Yup.string()
    .required('Este campo es requerido')
    .min(3, 'Minimo 3 letras'),
  apellidos: Yup.string()
    .required('Este campo es requerido')
    .min(3, 'Minimo 3 letras'),
  email: Yup.string()
    .email('Email invalido')
    .required('Este campo es requerido'),
  dni: Yup.string()
    .required('Este campo es requerido')
    .min(8, 'Minimo 8 digitos'),
  celular: Yup.string()
    .required('Este campo es requerido')
    .min(7, 'Minimo 7 digitos'),
  password: Yup.string().required('Este campo es requerido').min(1)
})

export const FormRegistro = () => {
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [openCode, setOpenCode] = useState(false)

  const sendVerificationCode = async (values: any): Promise<void> => {
    setLoading(true)
    const data = new FormData()
    data.append('nombres', values.nombres)
    data.append('apellidos', values.apellidos)
    data.append('dni_ruc', values.dni)
    data.append('celular', values.celular)
    data.append('email', values.email)
    data.append('password', values.password)
    data.append('observaciones', values.observaciones)
    data.append('verification_code', values.code)
    try {
      const respuesta = await axios.post(
        `${Global.url}/sendVerificationCode`,
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
        if (errors.dni_ruc) {
          toast.warning('Ya existe un usuario registrado con este DNI o RUC.')
        }
        if (errors.email) {
          toast.warning('Ya existe un usuario registrado con este email.')
        }
      } else {
        toast.error('Error al validar')
      }
    } finally {
      setLoading(false)
    }
  }

  const validateCodeAndRegister = async (values: any): Promise<void> => {
    if (values.code.length == 6) {
      setLoading(true)
      const data = new FormData()
      data.append('nombres', values.nombres)
      data.append('apellidos', values.apellidos)
      data.append('dni_ruc', values.dni)
      data.append('celular', values.celular)
      data.append('email', values.email)
      data.append('password', values.password)
      data.append('observaciones', values.observaciones)
      data.append('verification_code', values.code)
      try {
        const respuesta = await axios.post(
          `${Global.url}/regiterClientesWeb`,
          data
        )
        if (respuesta.data.status == 'success') {
          toast.success('Registro exitoso')
          resetForm()
          setOpenCode(false)
        } else if (
          respuesta.data.status == 'error' &&
          respuesta.data.message == 'Código de verificación inválido o expirado'
        ) {
          toast.error('Código de verificación inválido o expirado')
        }
      } catch (error: any) {
        console.log(error)
        if (error.response && error.response.data.errors) {
          const errors = error.response.data.errors
          if (errors.dni_ruc) {
            toast.warning(
              'Ya existe un usuario registrado con este DNI o RUC.'
            )
          }
          if (errors.email) {
            toast.warning('Ya existe un usuario registrado con este email.')
          }
        } else {
          toast.error('Error al registrar')
        }
      } finally {
        setLoading(false)
      }
    } else {
      toast.warning('El codigo debe teber 6 digitos')
    }
  }

  const {
    handleSubmit,
    handleChange,
    setValues,
    resetForm,
    errors,
    values,
    touched,
    handleBlur
  } = useFormik({
    initialValues: {
      nombres: '',
      apellidos: '',
      email: '',
      password: '',
      dni: '',
      observaciones: '',
      celular: '',
      code: '' // Para manejar el código de verificación
    },
    validationSchema: Schema,
    onSubmit: !openCode ? sendVerificationCode : validateCodeAndRegister
  })

  return (
    <>
      <Toaster position="top-center" richColors />
      <div className="w-full rounded-md bg-[#1E1F25] px-6 lg:px-10 py-12 shadow-2xl lg:w-[650px] relative">
        <h1 className="mb-8 text-center text-3xl font-bold uppercase tracking-[5px] text-white">
          Regis<span className="text-main">trate</span>
        </h1>
        <form
          className="mb-8"
          onSubmit={(e) => {
            e.stopPropagation()
            handleSubmit(e)
          }}
        >
          {!openCode ? (
            <>
              <div className="flex gap-4">
                <div className="relative mb-4">
                  <div className="relative flex items-center">
                    <LuUser2 className="absolute left-2 top-1/2 -translate-y-1/2 text-main" />
                    <input
                      type="text"
                      name="nombres"
                      value={values.nombres}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full rounded-lg bg-[#131517] py-3 pl-8 pr-4 text-gray-300 outline-none"
                      placeholder="Nombres"
                    />
                  </div>
                  <Errors errors={errors.nombres} touched={touched.nombres} />
                </div>
                <div className="relative mb-4">
                  <div className="relative flex items-center">
                    <LuUser2 className="absolute left-2 top-1/2 -translate-y-1/2 text-main" />
                    <input
                      type="text"
                      name="apellidos"
                      value={values.apellidos}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full rounded-lg bg-[#131517] py-3 pl-8 pr-4 text-gray-300 outline-none"
                      placeholder="Apellidos"
                    />
                  </div>
                  <Errors
                    errors={errors.apellidos}
                    touched={touched.apellidos}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <div className="relative mb-4">
                  <div className="relative flex items-center">
                    <MdOutlineDocumentScanner className="absolute left-2 top-1/2 -translate-y-1/2 text-main" />
                    <input
                      type="number"
                      name="dni"
                      value={values.dni}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full rounded-lg bg-[#131517] py-3 pl-8 pr-4 text-gray-300 outline-none  appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-moz-appearance]:textfield"
                      placeholder="DNI"
                    />
                  </div>
                  <Errors errors={errors.dni} touched={touched.dni} />
                </div>
                <div className="relative mb-4">
                  <div className="relative flex items-center">
                    <MdLocalPhone className="absolute left-2 top-1/2 -translate-y-1/2 text-main" />
                    <input
                      type="number"
                      name="celular"
                      value={values.celular}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full rounded-lg bg-[#131517] py-3 pl-8 pr-4 text-gray-300 outline-none  appearance-none [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none [&::-moz-appearance]:textfield"
                      placeholder="Celular"
                    />
                  </div>
                  <Errors errors={errors.celular} touched={touched.celular} />
                </div>
              </div>
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
              <div className="relative mb-4">
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
                  {showPassword ? (
                    <RiEyeOffLine
                      onClick={() => {
                        setShowPassword(!showPassword)
                      }}
                      className="absolute right-2 top-1/2 -translate-y-1/2 text-main hover:cursor-pointer"
                    />
                  ) : (
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
              <div className="relative mb-8">
                <textarea
                  className="w-full rounded-lg bg-[#131517] px-4 py-3 text-gray-300 outline-none resize-none"
                  placeholder="Observaciones"
                  name="observaciones"
                  onBlur={handleBlur}
                  value={values.observaciones}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div>
                <button
                  type={loading ? 'button' : 'submit'}
                  disabled={loading}
                  className="w-full rounded-lg bg-main px-4 py-3 text-sm font-bold uppercase text-black transition-colors hover:bg-darKmain"
                >
                  {loading ? 'Validando...' : 'Registrar'}
                </button>
              </div>
            </>
          ) : (
            <>
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
                    type="text"
                    name="code"
                    value={values.code}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="w-full rounded-lg bg-[#131517] py-3 pl-8 pr-4 text-gray-300 outline-none"
                    placeholder="Código de verificación"
                  />
                </div>
                <Errors errors={errors.code} touched={touched.code} />
              </div>
              <div>
                <button
                  type={loading ? 'button' : 'submit'}
                  disabled={loading}
                  className="w-full rounded-lg bg-main px-4 py-3 text-sm font-bold uppercase text-black transition-colors hover:bg-darKmain"
                >
                  {loading ? 'Validando...' : 'Registrar'}
                </button>
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => {
                    setOpenCode(false)
                    setValues({ ...values, code: '' })
                  }}
                  className="w-full rounded-lg  mt-3 px-4 py-1 text-sm font-bold uppercase text-red-600 transition-colors "
                >
                  {loading ? 'Cargando...' : 'Regresar'}
                </button>
              </div>
            </>
          )}
          <div className="mt-3"></div>
        </form>
        <div className="flex flex-col items-center gap-4">
          {/* <a
            className="text-gray-300 transition-colors hover:text-main"
            href="https://wa.me//+51987038024"
            target="_blank"
            rel="noreferrer"
          >
            ¿Olvidaste tu contraseña?
          </a> */}
          <span className="flex items-center gap-2 text-gray-300">
            ¿Ya tienes una cuenta?{' '}
            <Link
              href={'/login'}
              className="text-main transition-colors hover:text-gray-100"
            >
              Inicia Sesión
            </Link>
          </span>
        </div>
      </div>
    </>
  )
}
