/* eslint-disable multiline-ternary */
import { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useFormik } from 'formik'
import { Global } from '../../../../../helper/Global'
import { SchemaRegistroArticuloNewsletter } from '../../../../shared/schemas/Schemas'
import { Loading } from '../../../../shared/Loading'
import { TitleBriefs } from '../../../../shared/TitleBriefs'
import { Errors } from '../../../../shared/Errors'
import useAuth from '../../../../../hooks/useAuth'
import { type ImagenState } from '../../../../shared/schemas/Interfaces'
import { ImageUploader } from '../../../../shared/ImageUploader'
import EditorContexto from '../../servicios/EditorContexto'
import { toast } from 'sonner'
import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'

export const CreatArticulosNewsletter = (): JSX.Element => {
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const { setTitle, setDownloadProgress } = useAuth()
  const [loading, setLoading] = useState(false)
  const [categorias, setCategorias] = useState([])
  const [contenido, setContenido] = useState('')
  const [imagen1, setImagen1] = useState<ImagenState>({
    archivo: null,
    archivoName: ''
  })
  const [boton1, setBoton1] = useState(false)
  const [url1, setUrl1] = useState('')

  const getCategorias = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/newsletter/getAllCategorias`,
      {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      }
    )
    setCategorias(request.data)
    setLoading(false)
  }

  const handleSubirImagen = async (): Promise<void> => {
    const file = imagen1.archivo
    if (!file) {
      return
    }
    const formData = new FormData()
    formData.append('file_name', file.name)
    try {
      const { data } = await axios.post(
        `${Global.url}/generateGeneral`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      const s3Client = new S3Client({
        region: data.region,
        credentials: {
          accessKeyId: data.publickey,
          secretAccessKey: data.secretKey
        }
      })
      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: data.bucket,
          Key: `articulos/${imagen1.archivoName}`,
          Body: file,
          ContentType: 'multipart/form-data',
          ACL: 'public-read'
        },
        leavePartsOnError: false
      })
      upload.on('httpUploadProgress', (progress: any) => {
        const progressPercentage = Math.round(
          (progress.loaded * 100) / progress.total
        )
        setDownloadProgress(progressPercentage)
      })
      const result = await upload.done()
      if (result) {
        Swal.fire('Registro exitoso', '', 'success')
        navigate('/admin/newsletter/articulos')
      }
    } catch (error: any) {
      toast.error('Error al subir imagen')
      console.log(error)
    } finally {
      setDownloadProgress(0)
    }
  }

  const saveCategoria = async (): Promise<void> => {
    if (!imagen1.archivo || !contenido) {
      toast.warning('Completa todos los campos')
      return
    }
    setLoading(true)
    const data = new FormData()
    data.append('titulo', values.titulo)
    data.append('id_categoria', values.id_categoria)
    data.append('autor', values.autor)
    data.append('imagen1', imagen1.archivoName)
    data.append('contenido', JSON.stringify(contenido))
    try {
      const respuesta = await axios.post(
        `${Global.url}/newsletter/createArticulo`,
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
        handleSubirImagen()
      } else {
        Swal.fire('Error al registrar', '', 'error')
      }
    } catch (error: unknown) {
      console.log(error)
      Swal.fire('Error', '', 'error')
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
      id_categoria: '',
      autor: ''
    },
    validationSchema: SchemaRegistroArticuloNewsletter,
    onSubmit: saveCategoria
  })

  useEffect(() => {
    setTitle('Registrar Articulo')
    getCategorias()
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
      {loading ? (
        <Loading />
      ) : (
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
              <div className="w-full">
                <TitleBriefs titulo="Asignar Categoria" />
                <select
                  className="border placeholder-gray-400 focus:outline-none
                  focus:border-black w-full  pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                  border-gray-300 rounded-md transition-all text-black"
                  name="id_categoria"
                  value={values.id_categoria}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {/* FB GOOGLE, VENTAS, POST VENTA, RECOMENDACION, ISNTAGRAM) */}
                  <option value="">Seleccionar</option>
                  {categorias.map((producto: any) => (
                    <option value={producto.id} key={producto.id}>
                      {producto.titulo}
                    </option>
                  ))}
                </select>

                <Errors
                  errors={errors.id_categoria}
                  touched={touched.id_categoria}
                />
              </div>
              <div className="w-full">
                <TitleBriefs titulo="Link de fuente" />
                <input
                  className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full  pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all text-black"
                  name="autor"
                  value={values.autor}
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></input>
                <Errors errors={errors.autor} touched={touched.autor} />
              </div>
            </div>
            <div className="w-full relative mt-4">
              <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                IMAGEN PRINCIPAL
              </p>
              <ImageUploader
                url={url1}
                setUrl={setUrl1}
                boton={boton1}
                setBoton={setBoton1}
                setImagen={setImagen1}
                clase="1"
              />
            </div>
            <div className="w-full mt-4">
              <EditorContexto content={contenido} setContent={setContenido} />
            </div>
          </div>

          <div className="flex gap-2 w-full justify-end">
            <input type="hidden" name="oculto" value="1" />
            <Link
              to="/admin/newsletter/categorias"
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
