import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import Swal from 'sweetalert2'
import useAuth from '../../../../hooks/useAuth'
import { Loading } from '../../../shared/Loading'
import { RiCheckDoubleFill, RiNotification4Line } from 'react-icons/ri'
import { Errors } from '../../../shared/Errors'
import { CSSTransition } from 'react-transition-group'
import { type Values } from '../../../shared/schemas/Interfaces'
import { useFormik } from 'formik'
import { SchemaBrief } from '../../../shared/schemas/Schemas'
import { TitleBriefs } from '../../../shared/TitleBriefs'
import { InputsBriefs } from '../../../shared/InputsBriefs'
import {
  imagotipo1,
  imagotipo2,
  imagotipo3,
  integrado1,
  integrado2,
  integrado3,
  logo,
  sintetisado1,
  sintetisado2,
  sintetisado3,
  tipografico1,
  tipografico2,
  tipografico3
} from '../../../shared/Images'
import html2canvas from 'html2canvas'
import { LoadingSmall } from '../../../shared/LoadingSmall'

export const ViewBriefDiseño = (): JSX.Element => {
  const { id } = useParams()
  const token = localStorage.getItem('token')

  const { setTitle } = useAuth()
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [loadingCorreo, setLoadingCorreo] = useState(false)
  const [captureRef, setCaptureRef] = useState<HTMLDivElement | null>(null)

  const [sintetisado, setSintetisado] = useState(false)
  const [integrado, setIntegrado] = useState(false)
  const [imagotipo, setImagotipo] = useState(false)
  const [tipografico, setTipoGrafico] = useState(false)

  const [imagen1, setImagen1] = useState('')

  const [imagen2, setImagen2] = useState('')

  const [imagen3, setImagen3] = useState('')

  const [imagen4, setImagen4] = useState('')

  const [imagen5, setImagen5] = useState('')

  const [option1Checked, setOption1Checked] = useState(false)
  const [option2Checked, setOption2Checked] = useState(false)

  const getOneBrief = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/oneBriefDiseño/${id ?? ''}`,
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
      nombres: request.data.nombres,
      celular: request.data.celular,
      email: request.data.email,
      base_proyecto: request.data.tipo,
      nombre_empresa: request.data.nombre_empresa,
      historia_empresa: request.data.historia_empresa,
      principales_servicios: request.data.principales_servicios,
      colores: request.data.colores,
      referencias: request.data.referencias,
      transmitir: request.data.transmitir
    })

    setSintetisado(request.data.estilo1 == 1)
    setIntegrado(request.data.estilo2 == 1)
    setImagotipo(request.data.estilo3 == 1)
    setTipoGrafico(request.data.estilo4 == 1)
    setImagen1(request.data.logo_referencia)
    setImagen2(request.data.refe1)
    setImagen3(request.data.refe2)
    setImagen4(request.data.refe3)
    setImagen5(request.data.refe4)

    setOption1Checked(request.data.medios == 'true')
    setOption2Checked(request.data.medios2 == 'true')

    setLoading(false)
  }

  const updateBrief = async (values: Values): Promise<void> => {
    if (!option1Checked && !option2Checked) {
      Swal.fire(
        '',
        'Debes seleccionar al menos un medio para el cual se utilizara su logo en la pregunta 5',
        'warning'
      )
    } else {
      setLoading(true)
      const token = localStorage.getItem('token')

      const data = new FormData()
      data.append('nombres', values.nombres)
      data.append('celular', values.celular)
      data.append('email', values.email)
      data.append('tipo', values.base_proyecto)

      data.append('transmitir', values.transmitir)

      data.append('estilo1', sintetisado ? '1' : '0')

      data.append('estilo2', integrado ? '1' : '0')
      data.append('estilo3', imagotipo ? '1' : '0')
      data.append('estilo4', tipografico ? '1' : '0')

      data.append('_method', 'PUT')

      const authorizationHeader =
        token !== null && token !== '' ? `Bearer ${token}` : ''

      try {
        const respuesta = await axios.post(
          `${Global.url}/updateDiseno/${id ?? ''}`,
          data,
          {
            headers: {
              Authorization: authorizationHeader
            }
          }
        )

        if (respuesta.data.status == 'success') {
          Swal.fire('Actualizado correctamente', '', 'success')
          navigate('/admin/lista-briefs-diseños')
        } else {
          Swal.fire('Error3', '', 'error')
          setLoading(true)
        }
      } catch (error) {
        Swal.fire('Error3', '', 'error')
        setLoading(true)
      }
    }
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
        imagen1 ? `${Global.urlImages}/brief_diseno/${imagen1}` : null,
        imagen2 ? `${Global.urlImages}/brief_diseno/${imagen2}` : null,
        imagen3 ? `${Global.urlImages}/brief_diseno/${imagen3}` : null
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

  const { handleChange, errors, values, touched, handleBlur, setValues } =
    useFormik({
      initialValues: {
        nombres: '',
        celular: '',
        email: '',
        base_proyecto: '',
        nombre_empresa: '',
        historia_empresa: '',
        principales_servicios: '',
        colores: '',
        referencias: '',
        transmitir: ''
      },
      validationSchema: SchemaBrief,
      onSubmit: updateBrief
    })

  useEffect(() => {
    setTitle('BRIEF DE DISEÑO')
    getOneBrief()
  }, [])

  return (
    <>
      <div className="">
        {loading
          ? (
          <Loading />
            )
          : (
          <div className="card" ref={setCaptureRef}>
            <form className="flex flex-col bg-white rounded-md mt-4 p-4 md:p-10 relative">
              <img
                src={logo}
                alt=""
                className="mx-auto w-[50%] px-4 md:px-0 md:w-48"
              />
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
              <div className="flex w-full mt-5 md:mt-5 flex-col">
                <div className="w-full flex flex-col text-white">
                  <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-end gap-2 lg:gap-5">
                    <div className="w-full lg:relative">
                      <TitleBriefs titulo=" Nombres completos del cliente" />
                      <InputsBriefs
                        name="nombres"
                        type="text"
                        value={values.nombres}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={true}
                      />
                    </div>
                    <div className="w-full flex flex-col md:flex-row gap-2 lg:gap-5">
                      <div className="w-full  lg:relative">
                        <TitleBriefs titulo="Celular" />
                        <InputsBriefs
                          name="celular"
                          type="number"
                          value={values.celular}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={true}
                        />
                      </div>
                      <div className="w-full  lg:relative ">
                        <TitleBriefs titulo="Correo electronico" />
                        <InputsBriefs
                          name="email"
                          type="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={true}
                        />
                      </div>
                    </div>
                  </div>
                  <label className="bg-secondary-150 px-4 text-white py-2 w-fit rounded-t-md mb-5 ">
                    Informacion de la empresa
                  </label>
                  <div className="mb-3 md:mb-8 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-start gap-5 lg:gap-8 text-justify md:text-left">
                    <div className="w-full flex flex-col md:flex-row justify-between items-center gap-2">
                      <div className="w-full lg:relative">
                        <TitleBriefs titulo="1. Base para dar avance con su proyecto" />

                        <select
                          className="border placeholder-gray-400 focus:outline-none
                                                        focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                        border-gray-300 rounded-md transition-all"
                          name="base_proyecto"
                          value={values.base_proyecto}
                          onBlur={handleBlur}
                          disabled
                        >
                          <option value="">Seleccionar</option>
                          <option value="0">Diseño desde 0</option>
                          <option value="1">Rediseño</option>
                        </select>
                        <Errors
                          errors={errors.base_proyecto}
                          touched={touched.base_proyecto}
                        />
                      </div>
                      <CSSTransition
                        in={values.base_proyecto == '1'}
                        timeout={300}
                        classNames="fade"
                        unmountOnExit
                      >
                        <div className="w-full relative">
                          <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                            Adjuntar logo (Opcional)
                          </p>
                          {imagen1 && (
                            <img
                              className="img-thumbnail"
                              id={'img-preview1'}
                              src={`${Global.urlImages}/brief_diseno/${imagen1}`}
                              alt="imagen1"
                            />
                          )}
                        </div>
                      </CSSTransition>
                    </div>

                    <div className="w-full lg:relative">
                      <TitleBriefs
                        titulo="2. ¿Cuál es el nombre comercial de la empresa con el que
                        se realizará el Diseño de Logo?"
                      />
                      <InputsBriefs
                        name="nombre_empresa"
                        type="text"
                        value={values.nombre_empresa}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={true}
                      />
                    </div>

                    <div className="w-full lg:relative">
                      <TitleBriefs titulo="3. ¿Cuál es la historia de su empresa?" />
                      <textarea
                        className="border placeholder-gray-400 focus:outline-none
                                            focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                            border-gray-300 rounded-md resize-none"
                        name="historia_empresa"
                        value={values.historia_empresa}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={true}
                      />
                      <Errors
                        errors={errors.historia_empresa}
                        touched={touched.historia_empresa}
                      />
                    </div>

                    <div className="w-full lg:relative">
                      <TitleBriefs
                        titulo="4. ¿Cuáles son los principales servicios o productos que
                        brinda al público?"
                      />
                      <InputsBriefs
                        name="principales_servicios"
                        type="text"
                        value={values.principales_servicios}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={true}
                      />
                      <Errors
                        errors={errors.principales_servicios}
                        touched={touched.principales_servicios}
                      />
                    </div>

                    <div className="w-full lg:relative">
                      <TitleBriefs titulo="5. ¿Para qué medios se utilizará el logotipo?" />

                      <div className="input2">
                        <div className="radio-container">
                          <div className="radio-wrapper">
                            <label className="radio-button">
                              <input
                                type="checkbox"
                                id="medio1"
                                checked={option1Checked}
                                name="medios"
                                disabled={true}
                              />
                              <span className="radio-checkmark"></span>
                              <span className="radio-label">
                                Digital <br />
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
                                disabled={true}
                              />
                              <span className="radio-checkmark"></span>
                              <span className="radio-label">
                                Impreso <br />
                              </span>
                            </label>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full lg:relative">
                      <TitleBriefs titulo="6. ¿Tiene colores de preferencia para su logotipo?" />
                      <InputsBriefs
                        name="colores"
                        type="text"
                        value={values.colores}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={true}
                      />
                      <Errors
                        errors={errors.colores}
                        touched={touched.colores}
                      />
                    </div>

                    <div className="w-full lg:relative">
                      <TitleBriefs
                        titulo=" 7. ¿Tiene referencias de cómo desea sus propuestas de
                        logotipo?"
                      />
                      <InputsBriefs
                        name="referencias"
                        type="text"
                        value={values.referencias}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={true}
                      />
                      <Errors
                        errors={errors.referencias}
                        touched={touched.referencias}
                      />
                    </div>

                    <div className="w-full lg:relative">
                      <p
                        className="bg-white pt-0 pr-2 pb-0 lg:pl-2 -mt-3 mr-0 mb-0 ml-1 lg:ml-2 font-medium text-gray-600
                                            lg:absolute"
                      >
                        Adjuntar imagenes de referencia (Opcional)
                      </p>
                      <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-8 border">
                        <div className="flex-1 flex flex-col md:flex-row items-center md:gap-4 p-4">
                          <div className="w-1/4">
                            {imagen2 && (
                              <img
                                className="img-thumbnail"
                                id="img-preview2"
                                src={`${Global.urlImages}/brief_diseno/${imagen2}`}
                                alt="imagen2"
                              />
                            )}
                          </div>
                          <div className="w-1/4">
                            {imagen3 && (
                              <img
                                className="img-thumbnail"
                                id={'img-preview3'}
                                src={`${Global.urlImages}/brief_diseno/${imagen3}`}
                              />
                            )}
                          </div>
                          <div className="w-1/4">
                            {imagen4 && (
                              <img
                                className="img-thumbnail"
                                id={'img-preview4'}
                                src={`${Global.urlImages}/brief_diseno/${imagen4}`}
                              />
                            )}
                          </div>
                          <div className="w-1/4">
                            {imagen5 && (
                              <img
                                className="img-thumbnail"
                                id={'img-preview5'}
                                src={`${Global.urlImages}/brief_diseno/${imagen5}`}
                              />
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full lg:relative">
                      <TitleBriefs titulo=" 8. ¿Qué desea transmitir con su logotipo?" />
                      <InputsBriefs
                        name="transmitir"
                        type="text"
                        value={values.transmitir}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={true}
                      />
                      <Errors
                        errors={errors.transmitir}
                        touched={touched.transmitir}
                      />
                    </div>
                  </div>
                </div>

                <div className="w-full flex flex-col text-white">
                  <label className="bg-secondary-150 px-4 text-white py-2 w-fit rounded-t-md mb-5">
                    Estilos de diseño de logotipo
                  </label>
                  <div className="flex flex-col md:flex-row w-full mt-5 gap-5">
                    <div
                      className={`w-full md:w-1/2  flex justify-center flex-col items-center cursor-pointer relative ${
                        sintetisado ? 'border border-green-400' : 'border'
                      }`}
                    >
                      {sintetisado && (
                        <RiCheckDoubleFill className="text-green-600  absolute top-0 right-0 text-5xl mx-4" />
                      )}
                      <h3 className="bg-white w-fit pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 text-center text-lg">
                        1. Diseño Sintetizado
                      </h3>
                      <div className="w-full flex flex-col items-center select-none">
                        <img
                          src={sintetisado1}
                          alt=""
                          className="w-32 h-32 object-contain"
                        />
                        <img
                          src={sintetisado2}
                          alt=""
                          className="w-32 h-32 object-contain"
                        />
                        <img
                          src={sintetisado3}
                          alt=""
                          className="w-32 h-32 object-contain"
                        />
                      </div>
                    </div>

                    <div
                      className={`w-full md:w-1/2  flex justify-center flex-col items-center cursor-pointer relative ${
                        integrado ? 'border border-green-400' : 'border'
                      }`}
                    >
                      {integrado && (
                        <RiCheckDoubleFill className="text-green-600  absolute top-0 right-0 text-5xl mx-4" />
                      )}
                      <h3 className="bg-white w-fit pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 text-center text-lg">
                        2. Diseño Integrado
                      </h3>
                      <div className="w-full flex flex-col items-center select-none">
                        <img
                          src={integrado1}
                          alt=""
                          className="w-32 h-32 object-contain"
                        />
                        <img
                          src={integrado2}
                          alt=""
                          className="w-32 h-32 object-contain"
                        />
                        <img
                          src={integrado3}
                          alt=""
                          className="w-32 h-32 object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row w-full mt-5 gap-5">
                    <div
                      className={`w-full md:w-1/2  flex justify-center flex-col items-center cursor-pointer relative ${
                        imagotipo ? 'border border-green-400' : 'border'
                      }`}
                    >
                      {imagotipo && (
                        <RiCheckDoubleFill className="text-green-600  absolute top-0 right-0 text-5xl mx-4" />
                      )}
                      <h3 className="bg-white w-fit pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 text-center text-lg">
                        3. Diseño Imagotipo
                      </h3>
                      <div className="w-full flex flex-col items-center select-none">
                        <img
                          src={imagotipo1}
                          alt=""
                          className="w-32 h-32 object-contain"
                        />
                        <img
                          src={imagotipo2}
                          alt=""
                          className="w-32 h-32 object-contain"
                        />
                        <img
                          src={imagotipo3}
                          alt=""
                          className="w-32 h-32 object-contain"
                        />
                      </div>
                    </div>
                    <div
                      className={`w-full md:w-1/2  flex justify-center flex-col items-center cursor-pointer relative ${
                        tipografico ? 'border border-green-400' : 'border'
                      }`}
                    >
                      {tipografico && (
                        <RiCheckDoubleFill className="text-green-600  absolute top-0 right-0 text-5xl mx-4" />
                      )}
                      <h3 className="bg-white w-fit pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 text-center text-lg">
                        1. Diseño Tipografico
                      </h3>
                      <div className="w-full flex flex-col items-center">
                        <img
                          src={tipografico1}
                          alt=""
                          className="w-32 h-32 object-contain"
                        />
                        <img
                          src={tipografico2}
                          alt=""
                          className="w-32 h-32 object-contain"
                        />
                        <img
                          src={tipografico3}
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
                  to="/admin/lista-briefs-diseños"
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
