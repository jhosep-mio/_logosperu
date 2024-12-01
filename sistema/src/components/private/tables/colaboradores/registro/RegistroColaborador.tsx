import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useFormik } from 'formik'
import Swal from 'sweetalert2'
import axios from 'axios'
import useAuth from '../../../../../hooks/useAuth'
import { type valuesUsuario } from '../../../../shared/schemas/Interfaces'
import { Global } from '../../../../../helper/Global'
import { ShemaUsuarios } from '../../../../shared/schemas/Schemas'
import { Loading } from '../../../../shared/Loading'
import { TitleBriefs } from '../../../../shared/TitleBriefs'
import { Errors } from '../../../../shared/Errors'
import { logo } from '../../../../shared/Images'

export const RegistroColaborador = (): JSX.Element => {
  const { setTitle } = useAuth()
  const [loading, setLoading] = useState(false)

  const savePreventa = async (values: valuesUsuario): Promise<void> => {
    setLoading(true)
    const token = localStorage.getItem('token')

    const data = new FormData()
    data.append('name', values.name)
    data.append('id_rol', '99')
    data.append('email', 'prueba@logosperu.com')
    data.append('password', 'M1sdr3@vus')
    data.append('password_confirmation', 'M1sdr3@vus')
    try {
      const respuesta = await axios.post(`${Global.url}/registerUsersAdmins`, data, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })

      if (respuesta.data.status == 'success') {
        Swal.fire('Agreado correctamente', '', 'success')
      } else {
        Swal.fire('Error al agregar el registro', '', 'error')
      }
    } catch (error) {
      console.log(error)
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
      name: ''
    },
    validationSchema: ShemaUsuarios,
    onSubmit: savePreventa
  })

  useEffect(() => {
    setTitle('REGISTRAR CLIENTE')
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
                      <div className="w-full md:w-full relative h-fit">
                        <TitleBriefs titulo="Nombre" />
                        <input
                          className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                          name="name"
                          type="text"
                          autoComplete="off"
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={false}
                        />
                        <Errors
                          errors={errors.name}
                          touched={touched.name}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-full justify-end gap-3 rounded-md text-black mt-5">
                <Link
                  to="/admin/lista-clientes"
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
