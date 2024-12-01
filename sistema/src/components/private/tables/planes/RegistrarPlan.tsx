import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import { Loading } from '../../../shared/Loading'
import { TitleBriefs } from '../../../shared/TitleBriefs'
import { InputsBriefs } from '../../../shared/InputsBriefs'
import { useFormik } from 'formik'
import Swal from 'sweetalert2'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { Errors } from '../../../shared/Errors'
import {
  type ValuesPlanes
} from '../../../shared/schemas/Interfaces'
import { SchemaPlanes } from '../../../shared/schemas/Schemas'
import { logo } from '../../../shared/Images'

export const RegistrarPlan = (): JSX.Element => {
  const { setTitle } = useAuth()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const savePreventa = async (values: ValuesPlanes): Promise<void> => {
    setLoading(true)
    const token = localStorage.getItem('token')

    const data = new FormData()
    data.append('nombre', values.nombre)
    data.append('codigo', values.codigo)
    data.append('descripcion', values.descripcion)

    try {
      const respuesta = await axios.post(`${Global.url}/registrarPlan`, data, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })

      if (respuesta.data.status == 'success') {
        Swal.fire('Agreado correctamente', '', 'success')
        navigate('/admin/lista-planes')
      } else {
        Swal.fire('Error al agregar el registro', '', 'error')
        setLoading(true)
      }
    } catch (error) {
      Swal.fire('Error al agregar el registro', '', 'error')
      setLoading(true)
    }
    setLoading(false)
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
      id: 0,
      nombre: '',
      codigo: '',
      descripcion: '',
      tipo: ''
    },
    validationSchema: SchemaPlanes,
    onSubmit: savePreventa
  })

  useEffect(() => {
    setTitle('REGISTRAR PLAN')
  }, [])

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
    <>
      <div className="">
        {loading
          ? <Loading />
          : (
          <div className="card">
            <form
              className="flex flex-col bg-white rounded-md mt-4 p-4 md:p-10 relative"
              onSubmit={handleSubmit}
            >
              <img
                src={logo}
                alt=""
                className="mx-auto w-[50%] px-4 md:px-0 md:w-48"
              />

              <div className="flex w-full mt-5 md:mt-5 flex-col">
                <div className="w-full flex flex-col text-white">
                  <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-end gap-2 lg:gap-5">
                    <div className="w-full flex flex-col gap-3 md:flex-row">
                      <div className="w-full md:w-1/2 relative h-fit">
                        <TitleBriefs titulo=" Nombre" />
                        <input
                          className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                          name="nombre"
                          type="text"
                          autoComplete="off"
                          value={values.nombre}
                          disabled={false}
                          onChange={(e) => {
                            handleChange(e)
                          }}
                          onBlur={(e) => {
                            handleBlur(e)
                          }}
                        />
                        <Errors
                          errors={errors.nombre}
                          touched={touched.nombre}
                        />

                      </div>
                      <div className="w-full md:w-1/2 relative h-fit">
                        <TitleBriefs titulo="Codigo" />
                        <input
                          className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                          name="codigo"
                          type="text"
                          value={values.codigo}
                          disabled={false}
                          onChange={(e) => {
                            handleChange(e)
                          }}
                          onBlur={(e) => {
                            handleBlur(e)
                          }}
                        />
                        <Errors
                          errors={errors.codigo}
                          touched={touched.codigo}
                        />
                      </div>
                    </div>
                    <div className="w-full flex flex-col md:flex-row gap-3 lg:gap-5 mt-3 lg:mt-0">
                      <div className="w-full  lg:relative">
                        <TitleBriefs titulo="descripcion" />
                        <InputsBriefs
                          name="descripcion"
                          type="text"
                          value={values.descripcion}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={false}
                        />
                        <Errors
                          errors={errors.descripcion}
                          touched={touched.descripcion}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-full justify-end gap-3 rounded-md text-black mt-5">
                <Link
                  to="/admin/lista-planes"
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
