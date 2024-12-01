import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import Swal, { type SweetAlertResult } from 'sweetalert2'
import { Loading } from '../../../shared/Loading'
import { TitleBriefs } from '../../../shared/TitleBriefs'
import { useFormik } from 'formik'
import { SchemaPropuestas } from '../../../shared/schemas/Schemas'
import { Errors } from '../../../shared/Errors'
import { SubirArchivosFinales } from '../../../shared/modals/SubirArchivosFinales'
import { BsFillCloudArrowDownFill, BsFillTrashFill } from 'react-icons/bs'
import { SubirArchivosPDF } from '../../../shared/modals/SubirArchivosPDF'
export const Propuestas = (): JSX.Element => {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const { setTitle } = useAuth()
  const [loading, setLoading] = useState(true)
  const [loadingDescarga, setLoadingDescarga] = useState(false)
  const [pdfName, setpdfName] = useState<string | undefined>('')
  const [open, setOpen] = useState(false)
  const [openPDF, setOpenPDF] = useState(false)

  const updatePropuestas = async (): Promise<void> => {
    setLoading(true)
    const data = new FormData()
    data.append('comentarios', values.comentarios)
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
      comentarios: '',
      propuestas: ''
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
        link_final: request.data[0].archivos_finales,
        propuestas: request.data[0].propuestas
      })
      setpdfName(request.data[0].propuestas)
      setLoading(false)
    } catch (error) {
      console.log(error)
    }
  }

  function formatFileName (fileName: string): string {
    return fileName.split('_').pop() ?? fileName
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

  const descargarPDF = async (): Promise<void> => {
    setLoadingDescarga(true)
    try {
      const response = await axios({
        method: 'get',
        url: `${Global.url}/descargarPDF/${id ?? ''}`,
        responseType: 'blob', // Indicar que la respuesta es un blob (archivo)
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `${formatFileName(values.propuestas)}` // Cambiar por el nombre real del archivo
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (error) {
      console.error(error)
    }
    setLoadingDescarga(false)
  }

  const descargarZIP = async (): Promise<void> => {
    setLoadingDescarga(true)
    try {
      const response = await axios({
        method: 'get',
        url: `${Global.url}/descargarZIP/${id ?? ''}`,
        responseType: 'blob', // Indicar que la respuesta es un blob (archivo)
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `${formatFileName(values.link_final)}` // Cambiar por el nombre real del archivo
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (error) {
      console.error(error)
    }
    setLoadingDescarga(false)
  }

  const eliminarPDF = async (): Promise<void> => {
    const data = new FormData()
    data.append('propuestas', values.propuestas)
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/eliminarPDF/${id ?? ''}`,
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
        Swal.fire('Se elimino el archivo correctamente', '', 'success')
        getOneBrief()
        setpdfName('')
      }
    } catch (error) {
      Swal.fire('Error al eliminar el PDF', '', 'success')
      console.log(error)
    }
  }

  const eliminarZIP = async (): Promise<void> => {
    const data = new FormData()
    data.append('archivos_finales', values.link_final)
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/eliminarZIP/${id ?? ''}`,
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
        Swal.fire('Se elimino el archivo correctamente', '', 'success')
        getOneBrief()
      }
    } catch (error) {
      Swal.fire('Error al eliminar el PDF', '', 'success')
      console.log(error)
    }
  }

  const preguntarPDF = (): void => {
    Swal.fire({
      title: '¿Estas seguro de eliminar el PDF?',
      showDenyButton: true,
      confirmButtonText: 'Eliminar',
      denyButtonText: 'Cancelar'
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        eliminarPDF()
      }
    })
  }

  const preguntarZIP = (): void => {
    Swal.fire({
      title: '¿Estas seguro de eliminar el archivo final?',
      showDenyButton: true,
      confirmButtonText: 'Eliminar',
      denyButtonText: 'Cancelar'
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        eliminarZIP()
      }
    })
  }

  return (
    <>
      {loading
        ? (
        <Loading />
          )
        : (
        <form className="bg-white p-8 rounded-xl mt-5" onSubmit={handleSubmit}>
          <div className="w-full flex flex-col md:items-center gap-y-2 mb-5 lg:mb-10">
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
          </div>
          <section className="mb-4 flex flex-col lg:flex-row gap-3">
            <div className="w-full lg:w-1/3 flex justify-center items-center flex-col  gap-2 lg:gap-5 mt-5">
              <button
                type="button"
                className="w-full lg:w-48 bg-green-600 rounded-xl font-bold text-white px-4 py-2"
                onClick={() => {
                  setOpen(true)
                }}
              >
                Subir archivo final
              </button>
              <div className="w-full lg:w-48 relative cursor-pointer">
                <button
                  type="button"
                  className="w-full bg-main rounded-xl font-bold text-white px-4 py-2 cursor-pointer"
                  onClick={() => {
                    setOpenPDF(true)
                  }}
                >
                  Subir propuesta
                </button>
              </div>
            </div>
            <div className="bg-[#fff] p-0 lg:p-8 rounded-xl w-full lg:w-2/3">
              <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 p-4 items-center rounded-md border-b-2 border-solid border-black-50 bg-main/60">
                <h5 className="md:text-center text-white font-extrabold text-lg">
                  ARCHIVOS
                </h5>
                <h5 className="md:text-center text-white font-extrabold text-lg">
                  Descarga
                </h5>
                <h5 className="md:text-center text-white font-extrabold text-lg">
                  Eliminar
                </h5>
              </div>
              {values.link_final && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-4 bg-gray-50 p-4 rounded-xl shadow-sm cursor-pointer">
                  <div className="md:text-center">
                    <h5 className="text-black  md:hidden font-bold mb-2">
                      Archivos
                    </h5>
                    <p className="line-clamp-2 text-black">
                      {formatFileName(values.link_final)}
                    </p>
                  </div>
                  <div className="md:text-center">
                    <h5 className="md:hidden text-black font-bold mb-2">
                      Descarga
                    </h5>
                    {!loadingDescarga
                      ? (
                      <BsFillCloudArrowDownFill
                        className=" text-green-600 text-3xl w-fit lg:w-full text-center"
                        onClick={() => {
                          descargarZIP()
                        }}
                      />
                        )
                      : (
                      <BsFillCloudArrowDownFill className=" text-green-800 text-3xl w-fit lg:w-full text-center" />
                        )}
                  </div>
                  <div className="md:text-center md:flex md:justify-center items-center">
                    <h5 className="md:hidden text-black font-bold mb-2">
                      Eliminar
                    </h5>
                    <BsFillTrashFill
                      className=" text-red-600 text-2xl w-fit lg:w-full text-center"
                      onClick={() => {
                        preguntarZIP()
                      }}
                    />
                  </div>
                </div>
              )}
              {pdfName != undefined && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-4 bg-gray-50 p-4 rounded-xl shadow-sm cursor-pointer">
                  <div className="md:text-center">
                    <h5 className="text-black  md:hidden font-bold mb-2">
                      Archivos
                    </h5>
                    <p className="line-clamp-2 text-black">
                      {formatFileName(pdfName)}
                    </p>
                  </div>
                  <div className="md:text-center">
                    <h5 className="md:hidden text-black font-bold mb-2">
                      Descarga
                    </h5>
                    {!loadingDescarga
                      ? (
                      <BsFillCloudArrowDownFill
                        className=" text-green-600 text-3xl w-fit lg:w-full text-center"
                        onClick={() => {
                          descargarPDF()
                        }}
                      />
                        )
                      : (
                      <BsFillCloudArrowDownFill className=" text-green-800 text-3xl w-fit lg:w-full text-center" />
                        )}
                  </div>
                  <div className="md:text-center md:flex justify-start md:justify-center items-center">
                    <h5 className="md:hidden text-black font-bold mb-2">
                      Eliminar
                    </h5>
                    <BsFillTrashFill
                      className=" text-red-600 text-2xl w-fit lg:w-full text-left"
                      onClick={() => {
                        preguntarPDF()
                      }}
                    />
                  </div>
                </div>
              )}
            </div>
          </section>
          <SubirArchivosFinales
            open={open}
            setOpen={setOpen}
            id={id}
            getOneBrief={getOneBrief}
          />
          <SubirArchivosPDF
            open={openPDF}
            setOpen={setOpenPDF}
            id={id}
            getOneBrief={getOneBrief}
          />
          {pdfName && (
            <iframe
              src={`${Global.urlImages}/propuestas/${pdfName}`}
              title="PDF Viewer"
              width="100%"
              height="500px"
              className="hidden md:block mb-10"
            ></iframe>
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
