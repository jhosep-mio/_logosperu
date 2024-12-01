/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFormik } from 'formik'
import axios from 'axios'
import useAuth from '../../../../../hooks/useAuth'
import { Global } from '../../../../../helper/Global'
import { ShemaUsuariosRegister } from '../../../../shared/schemas/Schemas'
import { Loading } from '../../../../shared/Loading'
import { toast } from 'sonner'

export const RegisterColaborador = (): JSX.Element => {
  const { setTitle } = useAuth()
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const savePreventa = async (values: any): Promise<void> => {
    setLoading(true)
    const data = new FormData()
    data.append('name', values.name)
    data.append('genero', values.genero)
    data.append('id_rol', values.id_rol)
    data.append('email', values.email)
    data.append('email_alter', values.email_alter)
    data.append('pass_email', values.pass_email)
    data.append('estado', values.estado)
    data.append('celular', values.celular)
    data.append('dni', values.dni)
    data.append('email_personal', values.email_personal)
    data.append('direccion', values.direccion)
    data.append('celular_personal', values.celular_personal)
    data.append('celular_apoderado', values.celular_apoderado)
    if (values.password.length > 0) {
      data.append('password', values.password)
      data.append('password_confirmation', values.password)
    }
    try {
      const respuesta = await axios.post(
        `${Global.url}/registerUsersAdmins`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )

      if (respuesta.data.status == 'success') {
        toast.success('Usuario creado correctamente')
        navigate('/admin/colaboradores')
      }
    } catch (error) {
      console.log(error)
      toast.error('Error al crear el usuario')
    } finally {
      setLoading(false)
    }
  }

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    touched,
    handleBlur,
    isSubmitting
  } = useFormik({
    initialValues: {
      name: '',
      genero: '',
      id_rol: '',
      email: '',
      email_alter: '',
      pass_email: '',
      firma: '',
      password: '',
      estado: '',
      dni: '',
      celular: '',
      celular_personal: '',
      email_personal: '',
      direccion: '',
      celular_apoderado: ''
    },
    validationSchema: ShemaUsuariosRegister,
    onSubmit: savePreventa
  })

  useEffect(() => {
    setTitle('REGISTRAR COLABORADOR')
  }, [])

  useEffect(() => {
    if (errors && isSubmitting) {
      if (Object.keys(errors).length > 0 && isSubmitting) {
        Object.keys(errors)
          .reverse()
          .forEach((key) => {
            // @ts-expect-error
            toast.warning(`${errors[key]}`)
          })
      }
      const firstErrorKey = Object.keys(errors)[0]
      const firstErrorElement = document.getElementsByName(firstErrorKey)[0]
      if (firstErrorElement) {
        firstErrorElement.focus()
      }
    }
  }, [touched, errors, isSubmitting])

  return (
    <>
      <div className="">
        {loading
          ? (
          <Loading />
            )
          : (
          <div className="card">
            <form
              className="flex flex-col bg-white rounded-md mt-4 p-4 md:p-4 relative"
              onSubmit={handleSubmit}
            >
              <section className="w-full grid grid-cols-1 lg:grid-cols-4 mt-4 gap-x-4 gap-y-8 text-black">
                <div className="grid gap-2 w-full">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    htmlFor="email"
                  >
                    Nombres y apellidos
                  </label>
                  <input
                    className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-white disabled:bg-gray-100 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring "
                    placeholder="Nombres"
                    type="text"
                    name="name"
                    value={values.name}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    htmlFor="email"
                  >
                    Genero
                  </label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input border-gray-400  bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring "
                    name="genero"
                    value={values.genero}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Seleccionar</option>
                    <option value="hombre">Hombre</option>
                    <option value="mujer">Mujer</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    htmlFor="email"
                  >
                    Rol en el sistema
                  </label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input border-gray-400  bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring "
                    name="id_rol"
                    value={values.id_rol}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Seleccionar</option>
                    <option value="98">Colaborador</option>
                    <option value="99">Administrador</option>
                  </select>
                </div>
                <div className="grid gap-2 w-full">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    htmlFor="email"
                  >
                    Correo de recepcion e inicio de sesión
                  </label>
                  <input
                    className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-white disabled:bg-gray-100 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring "
                    placeholder="Correo"
                    type="text"
                    name="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="grid gap-2 w-full">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    htmlFor="email"
                  >
                    Correo para envio de información
                  </label>
                  <input
                    className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-white disabled:bg-gray-100 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring "
                    placeholder="Correo"
                    type="text"
                    name="email_alter"
                    value={values.email_alter}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="grid gap-2 w-full">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    htmlFor="email"
                  >
                    Contraseña para correo de envio
                  </label>
                  <input
                    className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-white disabled:bg-gray-100 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring "
                    placeholder="Correo"
                    type="text"
                    name="pass_email"
                    value={values.pass_email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    htmlFor="email"
                  >
                    Estado
                  </label>
                  <select
                    className="flex h-9 w-full rounded-md border border-input border-gray-400  bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring "
                    name="estado"
                    value={values.estado}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  >
                    <option value="">Seleccionar</option>
                    <option value="1">Habilitado</option>
                    <option value="2">En prueba</option>
                    <option value="0">Deshabilitado</option>
                  </select>
                </div>
                <div className="grid gap-2">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    htmlFor="email"
                  >
                    Celular de la agencia
                  </label>
                  <input
                    className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-white disabled:bg-gray-100 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring "
                    placeholder="Celular"
                    type="number"
                    name="celular"
                    value={values.celular}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    htmlFor="email"
                  >
                    DNI
                  </label>
                  <input
                    className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-white disabled:bg-gray-100 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring "
                    placeholder="DNI"
                    type="number"
                    name="dni"
                    value={values.dni}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    htmlFor="email"
                  >
                    Celular personal
                  </label>
                  <input
                    className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-white disabled:bg-gray-100 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring "
                    type="number"
                    name="celular_personal"
                    value={values.celular_personal}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    htmlFor="email"
                  >
                    Correo personal
                  </label>
                  <input
                    className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-white disabled:bg-gray-100 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring "
                    type="text"
                    name="email_personal"
                    value={values.email_personal}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    htmlFor="email"
                  >
                    Dirección
                  </label>
                  <input
                    className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-white disabled:bg-gray-100 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring "
                    type="text"
                    name="direccion"
                    value={values.direccion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    htmlFor="email"
                  >
                    Celular o telefono del apoderado
                  </label>
                  <input
                    className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-white disabled:bg-gray-100 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring "
                    type="number"
                    name="celular_apoderado"
                    value={values.celular_apoderado}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
                <div className="grid gap-2">
                  <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                    htmlFor="email"
                  >
                    Contraseña para el sistema
                  </label>
                  <input
                    className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-white disabled:bg-gray-100 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring "
                    placeholder="Contraseña"
                    type="text"
                    name="password"
                    value={values.password}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  />
                </div>
              </section>

              <div className="flex w-full justify-end gap-3 rounded-md text-black mt-5">
                <Link
                  to="/admin/colaboradores"
                  className="bg-red-600 px-3 py-2 rounded-md text-white cursor-pointer"
                >
                  Cancelar
                </Link>
                <input
                  type="submit"
                  className="bg-secondary-150 px-3 py-2 text-white rounded-md cursor-pointer"
                  value="Registrar"
                />
              </div>
            </form>
          </div>
            )}
      </div>
    </>
  )
}
