import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useFormik } from 'formik'
import { Global } from '../../../../../helper/Global'
import { SchemaSubCategoriasToPortafolio } from '../../../../shared/schemas/Schemas'
import { Loading } from '../../../../shared/Loading'
import { TitleBriefs } from '../../../../shared/TitleBriefs'
import { Errors } from '../../../../shared/Errors'
import useAuth from '../../../../../hooks/useAuth'
import { type ValuesCategoriasPortafolio } from '../../../../shared/schemas/Interfaces'
import { getDataCategoriasToPortafolio } from '../../../../shared/FetchingData'

export const EditarSubCategoriasToPortafolio = (): JSX.Element => {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const { setTitle } = useAuth()
  const [loading, setLoading] = useState(true)
  const [productos, setProductos] = useState<ValuesCategoriasPortafolio[]>([])
  const [, setTotalRegistros] = useState(0)

  const updatePropuestas = async (): Promise<void> => {
    setLoading(true)
    const data = new FormData()

    data.append('titulo', values.titulo)
    data.append('url', values.url)
    data.append('id_categoria', values.idCategoria)

    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/updateSubCategoriaToPortafolio/${id ?? ''}`,
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
        Swal.fire('Actualizacion exitosa', '', 'success')
        navigate('/admin/subcategorias-portafolio')
      } else {
        Swal.fire('Error al actualizar', '', 'error')
      }
    } catch (error: any) {
      console.log(error)
      Swal.fire('Error', '', 'error')
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
    setValues,
    isSubmitting
  } = useFormik({
    initialValues: {
      titulo: '',
      idCategoria: '',
      url: ''
    },
    validationSchema: SchemaSubCategoriasToPortafolio,
    onSubmit: updatePropuestas
  })

  const getOneBrief = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/oneSubCategoriaToPortafolio/${id ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      }
    )
    setValues({
      ...values,
      titulo: request.data.titulo,
      url: request.data.url,
      idCategoria: request.data.id_categoria
    })
    setLoading(false)
  }

  useEffect(() => {
    setTitle('EDITAR SUBCATEGORIA')
    getOneBrief()
    Promise.all([
      getDataCategoriasToPortafolio(
        'getCategoriasToPortafolio',
        setProductos,
        setTotalRegistros
      )
    ]).then(() => {
      setLoading(false)
    })
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
      {loading
        ? <Loading />
        : (
        <form className="bg-white p-8 rounded-xl mt-5" onSubmit={handleSubmit}>
          <div className="w-full flex flex-col md:items-center gap-y-2 mb-10">
            <div className="w-full flex justify-center items-center flex-col md:flex-row gap-2 lg:gap-5 mt-5">
              <div className="w-full">
                <TitleBriefs titulo="Titulo" />
                <input
                  className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full  pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all text-black"
                  name="titulo"
                  value={values.titulo}
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></input>

                <Errors errors={errors.titulo} touched={touched.titulo} />
              </div>
            </div>
          </div>

          <div className="w-full flex flex-col md:items-center gap-y-2 mb-10">
            <div className="w-full flex justify-center items-center flex-col md:flex-row gap-2 lg:gap-5 mt-5">
              <div className="w-full">
                <TitleBriefs titulo="Asignar Categoria" />
                <select
                  className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full  pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md transition-all text-black"
                  name="idCategoria"
                  value={values.idCategoria}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {/* FB GOOGLE, VENTAS, POST VENTA, RECOMENDACION, ISNTAGRAM) */}
                  <option value="">Seleccionar</option>
                  {productos.map((producto) => (
                    <option value={producto.id} key={producto.id}>
                      {producto.titulo}
                    </option>
                  ))}
                </select>

                <Errors
                  errors={errors.idCategoria}
                  touched={touched.idCategoria}
                />
              </div>
              <div className="w-full">
                <TitleBriefs titulo="URL DE LA WEB" />
                <input
                  className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full  pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all text-black"
                  name="url"
                  value={values.url}
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></input>
                <Errors errors={errors.url} touched={touched.url} />
              </div>
            </div>
          </div>

          <div className="flex gap-2 w-full justify-end">
            <input type="hidden" name="oculto" value="1" />
            <Link
              to="/admin/subcategorias-portafolio"
              className="bg-red-500 px-4 py-2 rounded-md text-white"
            >
              Regresar
            </Link>
            <input
              type="submit"
              className="bg-main_2-200 text-white hover:bg-primary flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
              value="Grabar"
            />
          </div>
        </form>
          )}
    </>
  )
}
