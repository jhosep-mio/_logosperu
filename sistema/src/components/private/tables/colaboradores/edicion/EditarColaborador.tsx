/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useFormik } from 'formik'
import axios from 'axios'
import useAuth from '../../../../../hooks/useAuth'
import { Global } from '../../../../../helper/Global'
import { ShemaUsuarios } from '../../../../shared/schemas/Schemas'
import { Loading } from '../../../../shared/Loading'
import { toast } from 'sonner'
import { type ImagenState } from '../../../../shared/schemas/Interfaces'
import { ImageUpdate } from './ImageUpdate'

export const EditarColaborador = (): JSX.Element => {
  const { setTitle } = useAuth()
  const token = localStorage.getItem('token')
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const [imagen1, setImagen1] = useState('')
  const [boton1, setBoton1] = useState(false)
  const [url1, setUrl1] = useState('')
  const [imagenNueva1, SetImagenNueva1] = useState<ImagenState>({
    archivo: null,
    archivoName: ''
  })

  const savePreventa = async (values: any): Promise<void> => {
    setLoading(true)
    const token = localStorage.getItem('token')
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
    }
    if (imagenNueva1.archivo != null) {
      data.append('firma', imagenNueva1.archivo)
    }
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/updateUser/${id ?? ''}`,
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
        toast.success('Usuario actualizado correctamente')
        navigate('/admin/colaboradores')
      }
    } catch (error) {
      console.log(error)
      toast.error('Error al actualizar el usuario')
    } finally {
      setLoading(false)
    }
  }

  const getOneBrief = async (): Promise<void> => {
    try {
      const request = await axios.get(`${Global.url}/getUsuario/${id ?? ''}`, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      })
      setValues({
        ...values,
        name: request.data.name,
        genero: request.data.genero,
        id_rol: request.data.id_rol,
        email: request.data.email,
        email_alter: request.data.email_alter,
        pass_email: request.data.pass_email,
        firma: request.data.firma,
        estado: request.data.estado,
        dni: request.data.dni,
        celular: request.data.celular,
        celular_personal: request.data.celular_personal,
        email_personal: request.data.email_personal,
        direccion: request.data.direccion,
        celular_apoderado: request.data.celular_apoderado
      })
      if (request.data.firma) {
        setImagen1(request.data.firma)
      }
    } catch (error) {
      console.log(error)
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
    isSubmitting,
    setValues
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
    validationSchema: ShemaUsuarios,
    onSubmit: savePreventa
  })

  useEffect(() => {
    setTitle('EDITAR COLABORADOR')
    getOneBrief()
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
                    <option value="99">Administrador</option>
                    <option value="98">Colaborador</option>
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
                <div className="w-full relative mt-6">
                  <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                    Adjuntar Firma
                  </p>
                  <ImageUpdate
                    url={url1}
                    setUrl={setUrl1}
                    boton={boton1}
                    setBoton={setBoton1}
                    imagen={imagen1}
                    setImagen={SetImagenNueva1}
                    clase="1"
                    disabled={false}
                  />
                </div>

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
                  value="Actualizar"
                />
              </div>
            </form>
          </div>
            )}
      </div>
    </>
  )
}
