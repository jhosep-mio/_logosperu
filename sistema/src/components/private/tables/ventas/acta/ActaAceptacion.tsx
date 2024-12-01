import { useFormik } from 'formik'
import useAuth from '../../../../../hooks/useAuth'
import { useState, useEffect } from 'react'
import { type ValuesActa } from '../../../../shared/schemas/Interfaces'
import { Global } from '../../../../../helper/Global'
import axios from 'axios'
import Swal, { type SweetAlertResult } from 'sweetalert2'
import { SchemaGenerarActa } from '../../../../shared/schemas/Schemas'
import { Loading } from '../../../../shared/Loading'
import { pdf } from '../../../../shared/Images'
import { TitleBriefs } from '../../../../shared/TitleBriefs'
import Editor from '../../../../shared/modals/ModalPDF'
import { formatAPIdate } from '../../../../shared/functions/QuitarAcerntos'
import { BsFillCloudArrowDownFill } from 'react-icons/bs'
import { IoCloseSharp, IoEyeSharp } from 'react-icons/io5'

export const ActaAceptacion = ({ id }: { id: string | undefined }): JSX.Element => {
  const { setTitle } = useAuth()
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(false)
  const [contenido, setContenido] = useState('')
  const [observaciones, setobservaciones] = useState('')
  const [alta, setalta] = useState('')
  const [tipoServicio, setTipoServicio] = useState('')

  const GenerarContrato = async (values: ValuesActa): Promise<void> => {
    if (contenido) {
      setLoading(true)
      const data = new FormData()
      data.append('nombre_marca', values.nombre_marca)
      data.append('entregables', contenido)
      data.append('alta', alta)
      data.append('observaciones', observaciones)
      data.append('tipoServicio', tipoServicio)
      data.append(
        'prefijo',
        tipoServicio == 'LPW'
          ? 'DESA'
          : tipoServicio == 'LPWA'
            ? 'DESA'
            : 'DISE'
      )
      data.append('contrato', values.id_contrato)
      data.append('nombres_cliente', values.nombres_cliente)
      data.append('fecha_inicio', formatAPIdate(values.fecha_inicio))
      data.append('fecha_fin', formatAPIdate(values.fecha_fin))
      try {
        const response = await axios.post(
          `${Global.url}/generarActa/${id ?? ''}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${
                token !== null && token !== '' ? token : ''
              }`
            },
            responseType: 'blob' // Indicamos que esperamos una respuesta Blob (archivo binario)
          }
        )
        const pdfBlob = new Blob([response.data], { type: 'application/pdf' })
        if (pdfBlob) {
          setTipoServicio('')
          setalta('')
          setobservaciones('')
          getOneBrief()
          Swal.fire('Acta de aceptación creada', '', 'success')
        }
      } catch (error) {
        console.log(error)
        Swal.fire('Error al generar el PDF:', '', 'error')
      }
      setLoading(false)
    } else {
      Swal.fire('El contenido no puede estar vacio', '', 'warning')
    }
  }

  const { handleSubmit, errors, values, touched, setValues, isSubmitting } =
    useFormik({
      initialValues: {
        id_contrato: '',
        nombres_cliente: '',
        nombre_marca: '',
        acta_aceptacion: '',
        fecha_inicio: '',
        fecha_fin: '',
        email_cliente: ''
      },
      validationSchema: SchemaGenerarActa,
      onSubmit: GenerarContrato
    })

  const getOneBrief = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/dataToContrato/${id ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      }
    )
    setContenido(JSON.parse(request.data[0].array_final)[0].contexto)
    // setTipoServicio(formatearContrato(request.data[0].id_contrato))
    // setTipoServicio('LPWA')
    setValues({
      ...values,
      id_contrato: request.data[0].id_contrato,
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      nombres_cliente: `${request.data[0].nombres} ${request.data[0].apellidos}`,
      nombre_marca: request.data[0].nombre_marca,
      fecha_inicio: request.data[0].fecha_inicio,
      acta_aceptacion: request.data[0].acta_aceptacion,
      fecha_fin: request.data[0].fecha_fin,
      email_cliente: request.data[0].email_cliente
    })
    setLoading(false)
  }

  useEffect(() => {
    if (errors && isSubmitting) {
      const firstErrorKey = Object.keys(errors)[0]
      const firstErrorElement = document.getElementsByName(firstErrorKey)[0]
      if (firstErrorElement) {
        firstErrorElement.focus()
      }
    }
  }, [touched, errors, isSubmitting])

  useEffect(() => {
    getOneBrief()
  }, [])

  useEffect(() => {
    setTitle(`ACTA DE ACEPTACIÓN - ${values.nombre_marca} `)
  }, [values.nombre_marca])

  const deleteActa = async (nombre: string): Promise<void> => {
    setLoading(true)
    try {
      const response = await axios.delete(
        `${Global.url}/deleteActa/${id ?? ''}/${nombre}`,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      if (response.data.status == '200') {
        Swal.fire('Archivo eliminado', '', 'success')
        getOneBrief()
      } else {
        Swal.fire('Error al eliminar el archivo', '', 'error')
      }
    } catch (error) {
      console.log(error)
      Swal.fire('Error al eliminar el archivo', '', 'error')
    }
    setLoading(false)
  }

  function extractCode (fileName: string): string {
    const regex = /-(.*?)\./
    const result = fileName.match(regex) // Esto aplicará el regex al nombre del archivo
    if (result?.[1]) {
      return result[1] // Retorna el contenido capturado por los paréntesis en el regex
    } else {
      return 'Formato no reconocido' // Retorna un mensaje de error si no hay coincidencia
    }
  }

  const descargarActa = async (nombre: string): Promise<void> => {
    setLoading(true)
    try {
      const response = await axios.get(
        `${Global.url}/downloadActa/${id ?? ''}/${nombre}`,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          },
          responseType: 'blob'
        }
      )
      // Crea una URL para el archivo y inicia la descarga
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' })
      const pdfUrl = URL.createObjectURL(pdfBlob)

      const downloadLink = document.createElement('a')
      downloadLink.href = pdfUrl
      downloadLink.download = `ACTA DE ACEPTACIÓN ${values.nombre_marca} ${
        extractCode(nombre) == 'LPW' || extractCode(nombre) == 'LPWA'
          ? 'DESA'
          : 'DISE'
      }` // Cambiar el nombre de archivo si es necesario
      document.body.appendChild(downloadLink)
      downloadLink.click()
      document.body.removeChild(downloadLink)
    } catch (error) {
      console.log(error)
      Swal.fire('Error al eliminar el archivo', '', 'error')
    }
    setLoading(false)
  }

  const preguntarActa = (name: string): void => {
    Swal.fire({
      title: '¿Estas seguro de eliminar el PDF?',
      showDenyButton: true,
      confirmButtonText: 'Eliminar',
      denyButtonText: 'Cancelar'
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        deleteActa(name)
      }
    })
  }

  return (
    <div className="">
      {loading
        ? <Loading />
        : (
        <div className="card">

          <form
            className="flex flex-col bg-white rounded-md  relative"
            onSubmit={handleSubmit}
          >
            <select
              className="border placeholder-gray-400 focus:outline-none outline-none w-full pt-4 pr-4 pb-6 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                        border-gray-300 rounded-md transition-all text-black"
              name="tipoServicio"
              value={tipoServicio}
              onChange={(e) => {
                setTipoServicio(e.target.value)
              }}
            >
              {/* FB GOOGLE, VENTAS, POST VENTA, RECOMENDACION, ISNTAGRAM) */}
              <option value="">Seleccionar acta</option>
              <option value="LP69">DISEÑO GRAFICO</option>
              <option value="LPW">WEB INFORMATIVA</option>
              <option value="LPWA">WEB ADMINISTRABLE</option>
            </select>

            {tipoServicio == 'LPW'
              ? (
              <>
                <h2 className="text-center w-full text-black text-2xl mt-5 font-bold">
                  ACTA PARA DESARROLLO WEB - INFORMATIVA
                </h2>
                <div className="flex w-full mt-5 md:mt-5 flex-col">
                  <div className="w-full flex flex-col text-white">
                    <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-end gap-2 lg:gap-5">
                      <div className="w-full relative">
                        <TitleBriefs titulo="ENTREGABLES" />
                        <div className="mt-3">
                          <Editor
                            content={contenido}
                            setContent={setContenido}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-end gap-2 lg:gap-5">
                      <div className="w-full relative">
                        <TitleBriefs titulo="CONTENIDO DEL ALTA" />
                        <div className="mt-3">
                          <Editor content={alta} setContent={setalta} />
                        </div>
                      </div>
                    </div>
                    <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-6 text-black flex flex-col items-end gap-2 lg:gap-5 border-red-500 border">
                      <div className="w-full relative">
                        <TitleBriefs titulo="OBSERVACIONES" />
                        <div className="mt-3">
                          <Editor
                            content={observaciones}
                            setContent={setobservaciones}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex w-full justify-end gap-3 rounded-md text-black mt-5 mb-10">
                  <button
                    type="button"
                    onClick={() => {
                      setTipoServicio('')
                    }}
                    className="bg-red-600 px-3 py-2 rounded-md text-white cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <input
                    type="submit"
                    className="bg-secondary-150 px-3 py-2 text-white rounded-md cursor-pointer"
                    value="Generar"
                  />
                </div>
              </>
                )
              : tipoServicio == 'LPWA'
                ? (
              <>
                <h2 className="text-center w-full text-black text-2xl mt-5 font-bold">
                  ACTA PARA DESARROLLO WEB - ADMINISTRABLE
                </h2>
                <div className="flex w-full mt-5 md:mt-5 flex-col">
                  <div className="w-full flex flex-col text-white">
                    <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-end gap-2 lg:gap-5">
                      <div className="w-full relative">
                        <TitleBriefs titulo="ENTREGABLES" />
                        <div className="mt-3">
                          <Editor
                            content={contenido}
                            setContent={setContenido}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-end gap-2 lg:gap-5">
                      <div className="w-full relative">
                        <TitleBriefs titulo="CONTENIDO DEL ALTA" />
                        <div className="mt-3">
                          <Editor content={alta} setContent={setalta} />
                        </div>
                      </div>
                    </div>
                    <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-6 text-black flex flex-col items-end gap-2 lg:gap-5 border-red-500 border">
                      <div className="w-full relative">
                        <TitleBriefs titulo="OBSERVACIONES" />
                        <div className="mt-3">
                          <Editor
                            content={observaciones}
                            setContent={setobservaciones}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex w-full justify-end gap-3 rounded-md text-black mt-5 mb-10 px-4">
                  <button
                    type="button"
                    onClick={() => {
                      setTipoServicio('')
                    }}
                    className="bg-red-600 px-3 py-2 rounded-md text-white cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <input
                    type="submit"
                    className="bg-secondary-150 px-3 py-2 text-white rounded-md cursor-pointer"
                    value="Generar"
                  />
                </div>
              </>
                  )
                : tipoServicio == 'LP69'
                  ? (
              <>
                <h2 className="text-center w-full text-black text-2xl mt-5 font-bold">
                  ACTA PARA DISEÑO GRAFICO
                </h2>
                <div className="flex w-full mt-5 md:mt-5 flex-col">
                  <div className="w-full flex flex-col text-white">
                    <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-end gap-2 lg:gap-5">
                      <div className="w-full relative">
                        <TitleBriefs titulo="ENTREGABLES" />
                        <div className="mt-3">
                          <Editor
                            content={contenido}
                            setContent={setContenido}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-end gap-2 lg:gap-5">
                      <div className="w-full relative">
                        <TitleBriefs titulo="CONTENIDO DEL ALTA" />
                        <div className="mt-3">
                          <Editor content={alta} setContent={setalta} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex w-full justify-end gap-3 rounded-md text-black mt-5 mb-10 px-4">
                  <button
                    type="button"
                    onClick={() => {
                      setTipoServicio('')
                    }}
                    className="bg-red-600 px-3 py-2 rounded-md text-white cursor-pointer"
                  >
                    Cancelar
                  </button>
                  <input
                    type="submit"
                    className="bg-secondary-150 px-3 py-2 text-white rounded-md cursor-pointer"
                    value="Generar"
                  />
                </div>
              </>
                    )
                  : null}
          </form>

          <section className="flex flex-col bg-white rounded-md relative py-2 px-2">
            {values.acta_aceptacion && JSON.parse(values.acta_aceptacion).length > 0 && (
              <>
                <div className="hidden md:grid grid-cols-1 md:grid-cols-5 gap-4 mb-2 md:px-4 md:py-2 text-gray-400 border-y border-gray-300 w-full ">
                  <h5 className="md:text-left col-span-3 text-black">
                    Archivo{' '}
                  </h5>
                  <h5 className="md:text-left text-black">Tipo de archivo</h5>
                  <h5 className="md:text-left text-black">Visualizar</h5>
                </div>
                {JSON.parse(values.acta_aceptacion).map(
                  (acta: string, index: number) => (
                    <div
                      className="hidden lg:grid grid-cols-1 md:grid-cols-5 gap-3 items-center mb-3 md:mb-0 bg-transparent p-4 rounded-xl relative shadow_class w-full"
                      key={index}
                    >
                      <div className="hidden md:block md:text-center col-span-3">
                        <div className="text-left flex gap-3 items-center">
                          <img src={pdf} alt="" className="w-10 h-10" />
                          <span className="line-clamp-2 text-black">
                            ACTA DE ACEPTACIÓN - {values.nombre_marca} -{' '}
                            <strong>
                              {acta.includes('LPW') ? 'DESA' : 'DISE'}
                            </strong>
                          </span>
                        </div>
                      </div>
                      <div className="hidden md:block md:text-center">
                        <span className="text-left flex gap-2 items-center w-fit px-2 text-black">
                          Acta de aceptación
                        </span>
                      </div>
                      <div className="hidden md:block md:text-center">
                        <a
                          href={`${Global.urlImages}/actaaceptacion/${acta}`}
                          target="_blank"
                          className="text-center flex gap-2 items-center w-fit px-2 justify-center"
                          rel="noreferrer"
                        >
                          <IoEyeSharp className="text-3xl text-center text-violet-500 hover:text-violet-700 transition-colors cursor-pointer" />
                        </a>
                      </div>
                      <div className="hidden md:block md:text-center col-span-2"></div>
                      <div className="hidden md:flex md:justify-center items-center absolute right-10 top-0 bottom-0">
                        <div className="md:text-center flex gap-2">
                          {!loading
                            ? (
                            <>
                              <IoCloseSharp
                                className=" text-red-500 hover:text-red-700 text-3xl w-fit lg:w-full text-center cursor-pointer"
                                onClick={() => {
                                  preguntarActa(acta)
                                }}
                              />
                              <BsFillCloudArrowDownFill
                                className=" text-green-600 hover:text-green-700 text-3xl w-fit lg:w-full text-center cursor-pointer"
                                onClick={() => {
                                  descargarActa(acta)
                                }}
                              />
                            </>
                              )
                            : (
                            <BsFillCloudArrowDownFill className=" text-green-800 text-3xl w-fit lg:w-full text-center" />
                              )}
                        </div>
                      </div>
                    </div>
                  )
                )}
              </>
            )}
          </section>
        </div>
          )}
    </div>
  )
}
