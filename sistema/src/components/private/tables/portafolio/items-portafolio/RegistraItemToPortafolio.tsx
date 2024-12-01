import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { useFormik } from 'formik'
import { RViewer, RViewerTrigger } from 'react-viewerjs'
import {
  type ImagenState,
  type arrayCategoriasToPortafolio,
  type ValuesSubCategoriasPortafolio
} from '../../../../shared/schemas/Interfaces'
import { Global } from '../../../../../helper/Global'
import { SchemaItemsToPortafolio } from '../../../../shared/schemas/Schemas'
import { Loading } from '../../../../shared/Loading'
import { TitleBriefs } from '../../../../shared/TitleBriefs'
import { Errors } from '../../../../shared/Errors'
import useAuth from '../../../../../hooks/useAuth'
import { ImageVideoUploader } from '../../../../shared/imagenes-videos/ImageVideoUploader'
import { getDataSubCategoriasToPortafolio } from '../../../../shared/FetchingData'

export const RegistraItemToPortafolio = (): JSX.Element => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const { setTitle } = useAuth()
  const [loading, setLoading] = useState(false)
  const [productos, setProductos] = useState<ValuesSubCategoriasPortafolio[]>([])

  const [arrayPesos, setarrayPesos] = useState<arrayCategoriasToPortafolio[]>(
    []
  )
  const [, setTotalRegistros] = useState(0)
  const [imagen1, setImagen1] = useState<ImagenState>({
    archivo: null,
    archivoName: ''
  })

  const [boton1, setBoton1] = useState(false)
  const [url1, setUrl1] = useState('')

  const agregarArrayPesos = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault()
    if (imagen1.archivo) {
      setarrayPesos([...arrayPesos, { id: Date.now(), imagen1 }])
      setImagen1({
        archivo: null,
        archivoName: ''
      })
      const imgPreview = document.getElementById(
        `img-preview${1}`
      ) as HTMLImageElement

      const videoPreview = document.getElementById(
        `video-preview${1}`
      ) as HTMLImageElement
      const iconImage = document.getElementById(`icon-image${1}`)
      const imagen = document.getElementById(`imagen${1}`) as HTMLInputElement

      if (
        (imgPreview !== null || videoPreview != null) &&
        iconImage != null &&
        imagen !== null
      ) {
        iconImage.classList.remove('d-none')
        videoPreview.classList.add('d-none')
        imgPreview.classList.add('d-none')
        imagen.value = ''
      }
      setBoton1(false)
    } else {
      Swal.fire('Complete todos los campos', '', 'error')
    }
  }

  const eliminarArray = (id: number | null): void => {
    const nuevoArray = arrayPesos.filter((peso) => peso.id !== id)
    setarrayPesos(nuevoArray)
  }

  const saveCategoria = async (): Promise<void> => {
    if (arrayPesos.length == 0) {
      Swal.fire(
        'No se puede registrar una categorias sin imagenes/videos',
        '',
        'warning'
      )
    } else {
      setLoading(true)
      const data = new FormData()

      data.append('titulo', values.titulo)
      data.append('id_subcategoria', values.idSubcategoria)
      data.append('array', JSON.stringify(arrayPesos))
      arrayPesos.forEach((image1, index1) => {
        if (image1.imagen1.archivo) {
          data.append(`images1[${index1}]`, image1.imagen1.archivo)
          data.append(`names1[${index1}]`, image1.imagen1.archivoName)
        }
      })

      try {
        const respuesta = await axios.post(
          `${Global.url}/registrarItemToPortafolio`,
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
          Swal.fire('Registro exitoso', '', 'success')
          navigate('/admin/items-portafolio')
        } else {
          Swal.fire('Error al registrar', '', 'error')
        }
      } catch (error: unknown) {
        console.log(error)
        Swal.fire('Error', '', 'error')
      }
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
      titulo: '',
      imagen1: '',
      idSubcategoria: ''
    },
    validationSchema: SchemaItemsToPortafolio,
    onSubmit: saveCategoria
  })

  useEffect(() => {
    setTitle('Registrar ITEM')
    Promise.all([
      getDataSubCategoriasToPortafolio(
        'getSubCategoriasToPortafolio',
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
          <div className="w-full flex flex-col md:items-center gap-y-2 mb-3">
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
              <div className="w-full">
                <TitleBriefs titulo="Asignar Subcategoria" />
                <select
                  className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full  pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md transition-all text-black max-h-72 overflow-y-scroll"
                  name="idSubcategoria"
                  value={values.idSubcategoria}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {/* FB GOOGLE, VENTAS, POST VENTA, RECOMENDACION, ISNTAGRAM) */}
                  <option value="">Seleccionar</option>
                  {productos.map((producto) => (
                    <option value={producto.id} key={producto.id}>{producto.titulo}</option>
                  ))}
                </select>

                <Errors
                  errors={errors.idSubcategoria}
                  touched={touched.idSubcategoria}
                />
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col md:flex-row md:items-center gap-y-2 mb-10">
            <div className="w-full flex justify-center items-center flex-col md:flex-row gap-2 lg:gap-5">
              <div className="w-full lg:w-2/6">
                <TitleBriefs titulo="Imagen / Video " />
                <ImageVideoUploader
                  url={url1}
                  setUrl={setUrl1}
                  boton={boton1}
                  setBoton={setBoton1}
                  setImagen={setImagen1}
                  clase="1"
                />
              </div>
              <div className="w-full  md:w-1/6">
                <button
                  className="w-full bg-main text-white hover:bg-primary justify-center flex items-center gap-2 py-2 px-4 rounded-lg transition-colors"
                  onClick={agregarArrayPesos}
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>

          <div className="bg-gray-100 py-4 md:p-8 rounded-xl mb-10">
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-4 mb-5 p-4 text-black">
              <h5 className="md:text-center">Imagen / Video</h5>
              <h5 className="md:text-center">Eliminar</h5>
            </div>
            {arrayPesos.map((pro: arrayCategoriasToPortafolio) => (
              <div
                className="mx-5 md:mx-0 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-4 items-center mb-4 bg-white p-4 rounded-xl text-black"
                key={pro.id}
              >
                <div className="md:text-center">
                  <h5 className="md:hidden text-center text-black font-bold mb-2">
                    Iamgen/ Video
                  </h5>
                  {pro.imagen1.archivo != null &&
                  pro.imagen1.archivo.size > 0
                    ? (
                        pro.imagen1.archivo.type.includes('image')
                          ? (
                      <RViewer
                        imageUrls={`${URL.createObjectURL(
                          pro.imagen1.archivo
                        )}`}
                      >
                        <RViewerTrigger>
                          <img
                            src={`${URL.createObjectURL(pro.imagen1.archivo)}`}
                            className="w-20 h-20 md:m-auto object-contain cursor-pointer mx-auto"
                          />
                        </RViewerTrigger>
                      </RViewer>
                            )
                          : (
                      <video
                        src={`${URL.createObjectURL(pro.imagen1.archivo)}`}
                        muted
                        autoPlay
                        loop
                        className="w-20 h-20 md:m-auto object-contain"
                      />
                            )
                      )
                    : (
                        pro.imagen1.archivo && (
                      <div className="w-full">
                        {pro.imagen1.archivo.type.includes('image')
                          ? (
                          <img
                            src={`${Global.urlImages}/propuestas/${pro.imagen1.archivoName}`}
                            alt=""
                            className="w-12 h-12 md:m-auto object-contain"
                          />
                            )
                          : (
                          <video
                            src={`${Global.urlImages}/propuestas/${pro.imagen1.archivoName}`}
                            muted
                            autoPlay
                            loop
                            className="w-12 h-12 md:m-auto object-contain"
                          />
                            )}
                      </div>
                        )
                      )}
                </div>
                <div className="md:text-center flex flex-col items-center justify-center">
                  <RiDeleteBin6Line
                    className="cursor-pointer text-center"
                    onClick={() => {
                      eliminarArray(pro.id)
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 w-full justify-end">
            <input type="hidden" name="oculto" value="1" />
            <Link
              to="/admin/items-portafolio"
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
