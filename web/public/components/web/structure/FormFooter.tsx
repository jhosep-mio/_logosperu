'use client'
import React, { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import { SchemaForm } from '../../shared/Schema'
import { Errors } from './Errors'
import axios from 'axios'
import { Global } from '@/helper/Global'
import Swal from 'sweetalert2'

export const FormFooter = () => {
  const [loadingCorreo, setLoadingCorreo] = useState(false)

  const enviarCorreo = async (): Promise<void> => {
    setLoadingCorreo(true)

    const data = new FormData()
    data.append('nombres', values.nombres)
    data.append('celular', values.celular)
    data.append('mensaje', values.mensaje)
    data.append('email', values.email)

    try {
      const respuesta = await axios.post(
        `${Global.url}/enviarCorreoFooter`,
        data
      )

      if (respuesta.data.status === 'success') {
        Swal.fire('Correo enviado', '', 'success')
        resetForm()
      } else {
        Swal.fire('Error al enviar el correo', '', 'error')
      }
    } catch (error) {
      console.log(error)
      Swal.fire('Error al enviar el correo', '', 'error')
    }
    setLoadingCorreo(false)
  }
  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    touched,
    handleBlur,
    isSubmitting,
    resetForm
  } = useFormik({
    initialValues: {
      nombres: '',
      celular: '',
      email: '',
      mensaje: ''
    },
    validationSchema: SchemaForm,
    onSubmit: enviarCorreo
  })

  useEffect(() => {
    if (errors && isSubmitting) {
      const firstErrorKey = Object.keys(errors)[0]
      const firstErrorElement = document.getElementsByName(firstErrorKey)[0]
      if (firstErrorElement) {
        firstErrorElement.focus()
      }
    }
  }, [touched, errors, isSubmitting])
  return (
    <form onSubmit={handleSubmit} className="w-full z-[10]">
      <div className="flex gap-3 mt-6 w-full">
        <div className="flex h-fit md:w-1/2 flex-col gap-1">
          <input
            type="text"
            name="nombres"
            value={values.nombres}
            onChange={handleChange}
            onBlur={handleBlur}
            placeholder="Nombres"
            className="flex h-fit outline-none bg-transparent p-3 text-gray-300 rounded-3xl border-t border-b-2 border-l-2  border-gray-400 text-[1.5vh] w-full  flex-1"
          />
          <Errors errors={errors.nombres} touched={touched.nombres} />
        </div>
        <div className="flex md:w-1/2 h-fit flex-col gap-1">
          <input
            type="text"
            name="celular"
            placeholder="Celular"
            value={values.celular}
            onChange={handleChange}
            onBlur={handleBlur}
            className="flex h-fit outline-none bg-transparent p-3 text-gray-300 rounded-3xl border-t border-b-2 border-l-2  border-gray-400 text-[1.5vh] w-full flex-1"
          />
          <Errors errors={errors.celular} touched={touched.celular} />
        </div>
      </div>
      <div className="flex gap-0 mt-3 w-full">
        <input
          type="email"
          name="email"
          value={values.email}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Ingresa tu email"
          className="flex h-fit outline-none bg-transparent p-3 text-gray-300 rounded-3xl border-t border-b-2 border-l-2  border-gray-400 text-[1.5vh] w-full flex-1"
        />
      </div>
      <Errors errors={errors.email} touched={touched.email} />

      <div className="flex gap-0 mt-3 w-full">
        <input
          type="text"
          name="mensaje"
          value={values.mensaje}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Escribe tu consulta"
          className=" outline-none bg-transparent p-3 text-gray-300 rounded-l-3xl border-t border-b-2 border-l-2  border-gray-400 text-[1.5vh] w-full flex-1"
        />
        {loadingCorreo ? (
          <button
            type="button"
            className="w-fit block bg-main rounded-r-3xl text-[1.5vh] text-center text-[#252525] font-bold px-6"
          >
            Enviando...
          </button>
        ) : (
          <button
            type="submit"
            className="w-fit block bg-main rounded-r-3xl text-[1.5vh] text-center text-[#252525] font-bold px-6"
          >
           ENVIAR
          </button>
        )}
      </div>
      <Errors errors={errors.mensaje} touched={touched.mensaje} />
    </form>
  )
}
