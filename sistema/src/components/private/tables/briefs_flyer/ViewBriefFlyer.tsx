import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import { Loading } from '../../../shared/Loading'
import { RiCheckDoubleFill, RiEyeLine, RiNotification4Line } from 'react-icons/ri'
import { CSSTransition } from 'react-transition-group'
import { TitleBriefs } from '../../../shared/TitleBriefs'
import { InputsBriefs } from '../../../shared/InputsBriefs'
import { useFormik } from 'formik'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { Errors } from '../../../shared/Errors'
import {
  type ImagenState,
  type RolsValues
} from '../../../shared/schemas/Interfaces'
import { SchemaBriefFlyer } from '../../../shared/schemas/Schemas'
import { estil1, estil2, logo } from '../../../shared/Images'
import { ImageUpdateGeneral } from '../../../shared/imagenes-videos/ImageUpdateGeneral'
import html2canvas from 'html2canvas'
import Swal from 'sweetalert2'
import { LoadingSmall } from '../../../shared/LoadingSmall'
import { ViewCliente } from '../../../shared/modals/ViewCliente'

export const ViewBriefFlyer = (): JSX.Element => {
  const { setTitle, roles, auth } = useAuth()
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(true)
  const [captureRef, setCaptureRef] = useState<HTMLDivElement | null>(null)

  const [tipo1, setTipo1] = useState(true)
  const [tipo2, setTipo2] = useState(false)

  const [open, setOpen] = useState(false)

  const handleClickOpen = (): void => {
    setOpen(true)
  }

  const handleClose = (): void => {
    setOpen(false)
  }

  const [imagen1, setImagen1] = useState('')
  const [boton1, setBoton1] = useState(false)
  const [url1, setUrl1] = useState('')
  const [, SetImagenNueva1] = useState<ImagenState>({
    archivo: null,
    archivoName: ''
  })
  const [loadingCorreo, setLoadingCorreo] = useState(false)
  const [option1Checked, setOption1Checked] = useState(false)
  const [option2Checked, setOption2Checked] = useState(false)
  const [option3Checked, setOption3Checked] = useState(false)
  const [option4Checked, setOption4Checked] = useState(false)
  const [option5Checked, setOption5Checked] = useState(false)
  const [option6Checked, setOption6Checked] = useState(false)

  const saveBrief = async (): Promise<void> => {}

  const getFlyer = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/oneBriefFlyer/${id ?? ''}`, {
      headers: {
        Authorization: `Bearer ${
          token !== null && token !== '' ? `Bearer ${token}` : ''
        }`
      }
    })
    setValues({
      ...values,
      nombres:
        String(request.data[0].nombres) +
        ' ' +
        String(request.data[0].apellidos),
      email: request.data[0].email,
      id_venta: request.data[0].id_venta,
      nombre_comercial: request.data[0].nombre_comercial,
      medida1: request.data[0].medida1 == 'null' ? '' : request.data[0].medida1,
      medida2: request.data[0].medida2 == 'null' ? '' : request.data[0].medida2,
      categoria: request.data[0].categoria,
      titular: request.data[0].titular,
      descripcion: request.data[0].descripcion,
      enlace: request.data[0].enlace,
      colores: request.data[0].colores,
      id_cliente: request.data[0].id_cliente,
      id_contrato: request.data[0].id_contrato
    })

    setImagen1(request.data[0].logo_referencia)
    setOption1Checked(request.data[0].medios1 == 'true')
    setOption2Checked(request.data[0].medios2 == 'true')
    setOption3Checked(request.data[0].medios3 == 'true')
    setOption4Checked(request.data[0].medios4 == 'true')
    setOption5Checked(request.data[0].medios5 == 'true')
    setOption6Checked(request.data[0].medios6 == 'true')
    setTipo1(request.data[0].estilo1 == 1)
    setTipo2(request.data[0].estilo2 == 1)
    setLoading(false)
  }

  const enviarCorreo = async (): Promise<void> => {
    setLoadingCorreo(true)
    const captureOptions = {
      useCORS: true // Permitir imágenes de origen cruzado
    }
    if (captureRef !== null) {
      const canvas = await html2canvas(captureRef, captureOptions)
      const imageBase64 = canvas.toDataURL('image/png')
      const byteCharacters = atob(imageBase64.split(',')[1]) // Obtener los caracteres de bytes de la cadena base64
      const byteArrays = []

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512) // Obtener una porción de 512 caracteres
        const byteNumbers = new Array(slice.length)

        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }

        const byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
      }

      const file = new File(byteArrays, 'captura.png', { type: 'image/png' }) // Crear un objeto de archivo a partir de los bytes
      const dataCoreo = new FormData()
      dataCoreo.append('nombres', values.nombres)
      dataCoreo.append('email', values.email)
      dataCoreo.append('captura', file)
      const imagenes = [
        imagen1 ? `${Global.urlImages}/brief_flyer/${imagen1}` : null
      ].filter((ruta) => ruta !== null)

      if (imagenes.length === 0) {
        imagenes.push('No subio ninguna imagen de referencia')
      }
      dataCoreo.append('images', JSON.stringify(imagenes))
      try {
        const respuestaCorreo = await axios.post(
          `${Global.url}/enviarCorreo`,
          dataCoreo
        )
        if (respuestaCorreo.data.status == 'success') {
          Swal.fire(
            'Se envio una copia de las respuestas a los correos',
            '',
            'success'
          )
        }
      } catch (error) {
        console.log(error)
        Swal.fire('Error', '', 'error')
      }
    }
    setLoadingCorreo(false)
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
      nombres: '',
      id_venta: '',
      nombre_comercial: '',
      medida1: '',
      medida2: '',
      categoria: '',
      titular: '',
      descripcion: '',
      enlace: '',
      colores: '',
      email: '',
      id_cliente: '',
      id_contrato: ''
    },
    validationSchema: SchemaBriefFlyer,
    onSubmit: saveBrief
  })

  useEffect(() => {
    setTitle('BRIEF - FLYER')
    getFlyer()
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
          ? (
          <Loading />
            )
          : (
          <div className="card" ref={setCaptureRef}>
            <form
              className="flex flex-col bg-white rounded-md mt-4 p-4 md:p-10 relative"
              onSubmit={handleSubmit}
            >
              <img
                src={logo}
                alt=""
                className="mx-auto w-[50%] px-4 md:px-0 md:w-48"
              />

              {roles.map(
                (role: RolsValues): React.ReactNode =>
                  auth.id_rol == role.id &&
                  JSON.parse(role.accesos).map(
                    (route: { peso: string }) =>
                      route.peso == 'superusuario' && (
                        <>
                          {!loadingCorreo
                            ? (
                            <RiNotification4Line
                              className="absolute right-0 top-0 text-4xl text-main m-4 cursor-pointer"
                              onClick={enviarCorreo}
                            />
                              )
                            : (
                            <LoadingSmall />
                              )}
                        </>
                      )
                  )
              )}

              <div className="flex w-full mt-5 md:mt-5 flex-col">
                <div className="w-full flex flex-col text-white">
                  <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-end gap-2 lg:gap-5">
                    <div className="w-full flex flex-col md:flex-row gap-2 lg:gap-5">
                      <div className="w-full md:w-3/4">
                        <TitleBriefs titulo="Cliente" />
                        <input
                          className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all text-center"
                          name="nombres"
                          type="text"
                          value={values.nombres}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={true}
                        />

                        <Errors
                          errors={errors.id_venta}
                          touched={touched.id_venta}
                        />
                      </div>
                      <div className="w-fit md:w-1/4 flex items-center justify-center">
                        <button
                          type="button"
                          className="w-fit px-10 bg-main py-2 text-white rounded-lg"
                          onClick={() => {
                            handleClickOpen()
                          }}
                        >
                          <RiEyeLine />
                        </button>
                      </div>
                    </div>
                  </div>
                  <ViewCliente
                    handleClose={handleClose}
                    open={open}
                    id={values.id_cliente}
                    id_contrato={values.id_contrato}
                  />

                  <label className="bg-secondary-150 px-4 text-white py-2 w-fit rounded-t-md mb-5 md:ml-3">
                    Informacion de la empresa{' '}
                  </label>
                  <div className="mb-3 md:mb-8 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-start gap-5 lg:gap-8 text-justify md:text-left">
                    <div className="w-full lg:relative">
                      <TitleBriefs titulo="1. ¿Cuál es el nombre comercial de la marca?" />
                      <InputsBriefs
                        name="nombre_comercial"
                        type="text"
                        value={values.nombre_comercial}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={true}
                      />
                      <Errors
                        errors={errors.nombre_comercial}
                        touched={touched.nombre_comercial}
                      />
                    </div>

                    <div className="w-full lg:relative">
                      <p
                        className="bg-white pt-0 pr-2 pb-0 lg:pl-2 -mt-3 mr-0 mb-0 ml-1 lg:ml-2 font-medium text-gray-600
                                            lg:absolute"
                      >
                        2. Adjunta tu logotipo (Adjunta solo la imagen, si tienes
                        tu logo en formato por favor enviarlo por Whatsapp)
                      </p>
                      <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-8 border">
                        <div className="flex-1 flex flex-col md:flex-row items-center md:gap-4 p-4">
                          <div className="w-1/4">
                            <ImageUpdateGeneral
                              carpeta="brief_flyer"
                              url={url1}
                              setUrl={setUrl1}
                              boton={boton1}
                              setBoton={setBoton1}
                              imagen={imagen1}
                              setImagen={SetImagenNueva1}
                              clase="1"
                              disabled={true}
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full lg:relative">
                      <TitleBriefs titulo="3. ¿Medias que desea para su flyer?" />
                      <div className="input2">
                        <div className="radio-container">
                          <div className="radio-wrapper">
                            <label className="radio-button">
                              <input
                                type="checkbox"
                                id="medio1"
                                checked={option1Checked}
                                name="medios1"
                              />
                              <span className="radio-checkmark"></span>
                              <span className="radio-label">
                                1080 * 1080
                                <br />
                              </span>
                            </label>
                          </div>
                          <div className="radio-wrapper">
                            <label className="radio-button">
                              <input
                                type="checkbox"
                                id="medio2"
                                checked={option2Checked}
                                name="medios2"
                              />
                              <span className="radio-checkmark"></span>
                              <span className="radio-label">
                                A medida <br />
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <CSSTransition
                      in={option2Checked}
                      timeout={300}
                      classNames="fade"
                      unmountOnExit
                    >
                      <div className="w-full">
                        <p className=" pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 bg-transparent text-[1.6rem] md:text-[1.8rem] lg:text-[2.2rem] ">
                          Incluir medida
                        </p>
                        <div className="w-full border p-4 flex flex-col gap-1 ">
                          <label
                            htmlFor="ancho"
                            id="icon-ancho"
                            className="btn btn-primary col-md-12 text-black mb-2 flex items-center gap-1"
                          >
                            Ancho{' '}
                            <input
                              type="text"
                              className="input"
                              placeholder="Medidas en píxeles"
                              name="medida1"
                              value={values.medida1}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              disabled={true}
                            />
                          </label>

                          <label
                            htmlFor="ancho"
                            id="icon-ancho"
                            className="btn btn-primary col-md-12 text-black mb-2 flex items-center gap-1"
                          >
                            Alto{' '}
                            <input
                              type="text"
                              className="input"
                              name="medida2"
                              placeholder="Medidas en píxeles"
                              value={values.medida2}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              disabled={true}
                            />
                          </label>
                        </div>
                      </div>
                    </CSSTransition>

                    <div className="w-full lg:relative">
                      <TitleBriefs titulo="4. Rubro de la empresa:" />
                      <InputsBriefs
                        name="categoria"
                        type="text"
                        value={values.categoria}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={true}
                      />
                      <Errors
                        errors={errors.categoria}
                        touched={touched.categoria}
                      />
                    </div>

                    <div className="w-full lg:relative">
                      <TitleBriefs titulo="5. Tipos de Flyer (*)" />
                      <div className="input2">
                        <div className="radio-container">
                          <div className="radio-wrapper">
                            <label className="radio-button">
                              <input
                                type="checkbox"
                                id="medio3"
                                checked={option3Checked}
                                name="medios"
                              />
                              <span className="radio-checkmark"></span>
                              <span className="radio-label">
                                Informativo <br />
                              </span>
                            </label>
                          </div>
                          <div className="radio-wrapper">
                            <label className="radio-button">
                              <input
                                type="checkbox"
                                id="medio4"
                                checked={option4Checked}
                                name="medios4"
                              />
                              <span className="radio-checkmark"></span>
                              <span className="radio-label">
                              Promocional <br />
                              </span>
                            </label>
                          </div>
                          <div className="radio-wrapper">
                            <label className="radio-button">
                              <input
                                type="checkbox"
                                id="medio5"
                                checked={option5Checked}
                                name="medios5"
                              />
                              <span className="radio-checkmark"></span>
                              <span className="radio-label">
                                Descriptivo <br />
                              </span>
                            </label>
                          </div>
                          <div className="radio-wrapper">
                            <label className="radio-button">
                              <input
                                type="checkbox"
                                id="medio6"
                                checked={option6Checked}
                                name="medios6"
                              />
                              <span className="radio-checkmark"></span>
                              <span className="radio-label">
                                Orientativo <br />
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full lg:relative">
                      <TitleBriefs titulo=" 6. Titulo para el flyer" />
                      <InputsBriefs
                        name="titular"
                        type="text"
                        value={values.titular}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={true}
                      />
                      <Errors
                        errors={errors.titular}
                        touched={touched.titular}
                      />
                    </div>

                    <div className="w-full lg:relative">
                      <TitleBriefs titulo=" 7. Descripción (textos de información importante que se mostrarán en el flyer)" />
                      <textarea
                        className="border placeholder-gray-400 focus:outline-none
                                            focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                            border-gray-300 rounded-md resize-none"
                        name="descripcion"
                        value={values.descripcion}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Errors
                        errors={errors.descripcion}
                        touched={touched.descripcion}
                      />
                    </div>

                    <div className="w-full lg:relative">
                      <TitleBriefs titulo="8. Adjunta un enlace de Google Drive que contenga las imágenes que desear mostrar en tu brochure" />
                      <InputsBriefs
                        name="enlace"
                        type="text"
                        value={values.enlace}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={true}
                      />
                      <Errors errors={errors.enlace} touched={touched.enlace} />
                    </div>

                    <div className="w-full lg:relative">
                      <TitleBriefs titulo=" 9. Indicar colores de preferencia en el flyer" />
                      <textarea
                        className="border placeholder-gray-400 focus:outline-none
                                            focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                            border-gray-300 rounded-md resize-none"
                        name="colores"
                        value={values.colores}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Errors
                        errors={errors.colores}
                        touched={touched.colores}
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full flex flex-col text-white">
                  <label className="bg-secondary-150 px-4 text-white py-2 w-fit rounded-t-md mb-5">
                    Estilos para el flyer
                  </label>
                  <div className="flex flex-col md:flex-row w-full mt-5 gap-5">
                    <div
                      className={`w-full md:w-1/2  flex justify-center flex-col items-center cursor-pointer relative ${
                        tipo1 ? 'border border-green-400' : 'border'
                      }`}
                    >
                      {tipo1 && (
                        <RiCheckDoubleFill className="text-green-600  absolute top-0 right-0 text-5xl mx-4" />
                      )}
                      <h3 className="bg-white w-fit pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 text-center text-lg">
                        1. Minimalista
                      </h3>
                      <div className="w-full flex flex-col items-center select-none">
                        <img
                          src={estil1}
                          alt=""
                          className="w-32 h-32 object-contain"
                        />
                      </div>
                    </div>

                    <div
                      className={`w-full md:w-1/2  flex justify-center flex-col items-center cursor-pointer relative ${
                        tipo2 ? 'border border-green-400' : 'border'
                      }`}
                    >
                      {tipo2 && (
                        <RiCheckDoubleFill className="text-green-600  absolute top-0 right-0 text-5xl mx-4" />
                      )}
                      <h3 className="bg-white w-fit pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 text-center text-lg">
                        2. Integrado
                      </h3>
                      <div className="w-full flex flex-col items-center select-none">
                        <img
                          src={estil2}
                          alt=""
                          className="w-32 h-32 object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-full justify-end gap-3 rounded-md text-black mt-5">
                <Link
                  to="/admin/lista-briefs-flyer"
                  className="bg-red-600 px-3 py-2 rounded-md text-white cursor-pointer"
                >
                  Regresar
                </Link>
              </div>
            </form>
          </div>
            )}
      </div>
    </>
  )
}
