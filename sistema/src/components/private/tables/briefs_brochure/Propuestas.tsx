import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import Swal from 'sweetalert2'
import { Loading } from '../../../shared/Loading'
import { TitleBriefs } from '../../../shared/TitleBriefs'
import { useFormik } from 'formik'
import { SchemaPropuestas } from '../../../shared/schemas/Schemas'
import { Errors } from '../../../shared/Errors'
import { IoCloseCircleSharp } from 'react-icons/io5'

export const Propuestas = (): JSX.Element => {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const { setTitle } = useAuth()
  const [loading, setLoading] = useState(true)
  const [pdfUrl, setPdfUrl] = useState<string | null>(null)
  const [propuestas, setpropuestas] = useState('')
  const [pdfName, setpdfName] = useState<string | undefined>('')

  const updatePropuestas = async (): Promise<void> => {
    if (propuestas || pdfName) {
      setLoading(true)
      const data = new FormData()
      data.append('comentarios', values.comentarios)
      data.append('archivos_finales', values.link_final)
      if (pdfName === '') {
        data.append('propuestas', propuestas)
      }

      data.append('_method', 'PUT')
      try {
        const respuesta = await axios.post(
          `${Global.url}/updatePropuestas/${id ?? ''}`,
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
          Swal.fire('Propuestas actualizadas', '', 'success')
          navigate('/admin/lista-briefs-diseños-new')
        } else {
          Swal.fire('Error al actualizar', '', 'error')
        }
      } catch (error: unknown) {
        console.log(error)
        Swal.fire('Error', '', 'error')
      }
      setLoading(false)
    } else {
      Swal.fire('Es necesario que suba su propuesta', '', 'warning')
    }
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
      link_final: '',
      comentarios: ''
    },
    validationSchema: SchemaPropuestas,
    onSubmit: updatePropuestas
  })

  const getOneBrief = async (): Promise<void> => {
    try {
      const request = await axios.get(
        `${Global.url}/oneBriefDiseñoNew/${id ?? ''}`,
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
        comentarios: request.data[0].comentarios,
        link_final: request.data[0].archivos_finales
      })
      setpdfName(request.data[0].propuestas)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    setTitle('Propuestas')
    getOneBrief()
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

  const touchedFile = (): void => {
    const pdf = document.querySelector('#pdf_file') as HTMLInputElement
    if (pdf) {
      pdf.value = ''
      setPdfUrl(null)
      setpropuestas('')
    }
  }

  // Cuando se carga el archivo, crea una URL local y actualiza el estado
  const handleFileChange = (event: any): void => {
    const file = event.target.files[0]
    setpropuestas(file)
    const pdfUrl = URL.createObjectURL(file)
    setPdfUrl(pdfUrl)
    setpdfName('')
  }

  return (
    <>
      {loading
        ? (
        <Loading />
          )
        : (
        <form className="bg-white p-8 rounded-xl mt-5" onSubmit={handleSubmit}>
          <div className="w-full flex flex-col md:items-center gap-y-2 mb-10">
            <div className="w-full flex justify-center items-center flex-col md:flex-row gap-2 lg:gap-5">
              <div className="w-full">
                <TitleBriefs titulo="Comentarios" />
                <textarea
                  cols={30}
                  rows={10}
                  className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full  pr-4 h-24 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all text-black"
                  name="comentarios"
                  value={values.comentarios}
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></textarea>

                <Errors
                  errors={errors.comentarios}
                  touched={touched.comentarios}
                />
              </div>
            </div>
            <div className="w-full flex justify-center items-center flex-col md:flex-row gap-2 lg:gap-5 mt-5">
              <div className="w-full">
                <TitleBriefs titulo="Link de archivos finales" />
                <input
                  className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full  pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all text-black"
                  name="link_final"
                  value={values.link_final}
                  onChange={handleChange}
                  onBlur={handleBlur}
                ></input>

                <Errors
                  errors={errors.link_final}
                  touched={touched.link_final}
                />
              </div>
            </div>
          </div>
          <div className="w-full flex flex-col md:items-start gap-y-2 mb-10">
            <div className="relative">
              <span className="text-black text-center text-sm w-full block">
                {pdfName}
              </span>
              <input
                id="pdf_file"
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="block w-full text-sm text-slate-500
                file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0
                file:text-sm file:font-semibold
                file:bg-violet-50 file:text-violet-700
                file:cursor-pointer
                hover:file:bg-violet-100
              "
              />
              {pdfUrl && (
                <IoCloseCircleSharp
                  className="absolute top-0 bottom-0 right-[-25px] my-auto cursor-pointer"
                  onClick={() => {
                    touchedFile()
                  }}
                />
              )}
            </div>
          </div>
          {pdfName
            ? (
            <iframe
              src={`${Global.urlImages}/propuestas/${pdfName}`}
              title="PDF Viewer"
              width="100%"
              height="500px"
              className="mb-10"
            ></iframe>
              )
            : pdfUrl
              ? (
            <iframe
              src={pdfUrl}
              title="PDF Viewer"
              width="100%"
              height="500px"
              className="mb-10"
            >
              Tu navegador no soporta la visualización de PDFs. Puedes descargar
              el PDF
              <a href={pdfUrl}>aquí</a>.
            </iframe>
                )
              : (
                  ''
                )}

          <div className="flex gap-2 w-full justify-end">
            <input type="hidden" name="oculto" value="1" />
            <Link
              to="/admin/lista-briefs-diseños-new"
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
