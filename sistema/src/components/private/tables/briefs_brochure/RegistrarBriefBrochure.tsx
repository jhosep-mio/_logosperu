import { type ChangeEvent, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import { Loading } from '../../../shared/Loading'
import { RiCheckDoubleFill } from 'react-icons/ri'
import { CSSTransition } from 'react-transition-group'
import { ImageUploader } from '../../../shared/ImageUploader'
import { TitleBriefs } from '../../../shared/TitleBriefs'
import { InputsBriefs } from '../../../shared/InputsBriefs'
import { useFormik } from 'formik'
import Swal from 'sweetalert2'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { Errors } from '../../../shared/Errors'
import {
  type ImagenState,
  type ValuesBrochure
} from '../../../shared/schemas/Interfaces'
import { SchemaBriefBrochure } from '../../../shared/schemas/Schemas'
import {
  bro1,
  bro2,
  bro3,
  logo,
  tipo11,
  tipo22,
  tipo33,
  tipo44
} from '../../../shared/Images'
import { ListaClientes } from '../../../shared/modals/ListaClientes'

export const RegistrarBriefBrochure = (): JSX.Element => {
  const { setTitle } = useAuth()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const [tipo1, setTipo1] = useState(true)
  const [tipo2, setTipo2] = useState(false)
  const [tipo3, setTipo3] = useState(false)
  const [tipo4, setTipo4] = useState(false)
  const [tipo5, setTipo5] = useState(true)
  const [tipo6, setTipo6] = useState(false)
  const [tipo7, setTipo7] = useState(false)

  const [open, setOpen] = useState(false)

  const handleClickOpen = (): void => {
    setOpen(true)
  }

  const handleClose = (): void => {
    setOpen(false)
  }

  const [imagen1, setImagen1] = useState<ImagenState>({
    archivo: null,
    archivoName: ''
  })
  const [boton1, setBoton1] = useState(false)
  const [url1, setUrl1] = useState('')

  const [option1Checked, setOption1Checked] = useState(false)
  const [option2Checked, setOption2Checked] = useState(false)
  const [option3Checked, setOption3Checked] = useState(false)
  const [option4Checked, setOption4Checked] = useState(false)

  const handleOption1Change = (event: ChangeEvent<HTMLInputElement>): void => {
    setOption1Checked(event.target.checked)
    setOption2Checked(false)
  }

  const handleOption2Change = (event: ChangeEvent<HTMLInputElement>): void => {
    setOption2Checked(event.target.checked)
    setOption1Checked(false)
  }

  const handleOption3Change = (event: ChangeEvent<HTMLInputElement>): void => {
    setOption3Checked(event.target.checked)
    setOption4Checked(false)
  }

  const handleOption4Change = (event: ChangeEvent<HTMLInputElement>): void => {
    setOption4Checked(event.target.checked)
    setOption3Checked(false)
  }

  const saveBrief = async (values: ValuesBrochure): Promise<void> => {
    if (!option1Checked && !option2Checked) {
      Swal.fire(
        '',
        'Debes seleccionar al menos un medio para el cual se utilizara el brochure',
        'warning'
      )
    } else if (!option3Checked && !option4Checked) {
      Swal.fire('', 'Debe seleccionar las medidas para el brochure', 'warning')
    } else if (
      (option4Checked && values.medida1.length == 0) ||
      (option4Checked && values.medida2.length == 0)
    ) {
      Swal.fire(
        '',
        'Debe colocar las medidas personalizas en la pregunta 3',
        'warning'
      )
    } else {
      setLoading(true)
      const token = localStorage.getItem('token')

      const data = new FormData()
      data.append('id_venta', values.id_venta)
      data.append('nombre_comercial', values.nombre_comercial)
      data.append('medios1', option1Checked.toString())
      data.append('medios2', option2Checked.toString())
      data.append('medios3', option3Checked.toString())
      data.append('medios4', option4Checked.toString())

      data.append('medida1', values.medida1)
      data.append('medida2', values.medida2)

      if (imagen1.archivo != null) {
        data.append('logo_referencia', imagen1.archivo)
      }
      data.append('datoscontacto', values.datoscontacto)
      data.append('historia', values.historia)
      data.append('objetivo', values.objetivo)
      data.append('servicios', values.servicios)
      data.append('enlace', values.enlace)

      data.append('estilo1', tipo1 ? '1' : '0')
      data.append('estilo2', tipo2 ? '1' : '0')
      data.append('estilo3', tipo3 ? '1' : '0')
      data.append('estilo4', tipo4 ? '1' : '0')
      data.append('estilo5', tipo5 ? '1' : '0')
      data.append('estilo6', tipo6 ? '1' : '0')
      data.append('estilo7', tipo7 ? '1' : '0')

      try {
        const respuesta = await axios.post(
          `${Global.url}/saveBriefBrochure`,
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
          Swal.fire('Agreado correctamente', '', 'success')
          navigate('/admin/lista-briefs-brochure')
        } else {
          Swal.fire('Error al agregar el registro', '', 'error')
          setLoading(true)
        }
      } catch (error) {
        Swal.fire('Error al agregar el registro', '', 'error')
        // console.log(error.request.response);
        setLoading(true)
      }
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
      nombres: '',
      id_venta: '',
      nombre_comercial: '',
      medida1: '',
      medida2: '',
      datoscontacto: '',
      historia: '',
      objetivo: '',
      servicios: '',
      enlace: ''
    },
    validationSchema: SchemaBriefBrochure,
    onSubmit: saveBrief
  })

  useEffect(() => {
    setTitle('REGISTRAR BRIEF DE BROCHURE')
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
          <div className="card">
            <form
              className="flex flex-col bg-white rounded-md mt-4 p-4 md:p-10"
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
                      <div className="w-full md:w-1/4 flex items-center justify-center">
                        <button
                          type="button"
                          className="w-fit px-10 bg-main py-2 text-white rounded-lg"
                          onClick={handleClickOpen}
                        >
                          Buscar
                        </button>
                      </div>
                    </div>
                  </div>
                  <ListaClientes
                    handleClose={handleClose}
                    open={open}
                    setValues={setValues}
                    values={values}
                  />

                  <label className="bg-secondary-150 px-4 text-white py-2 w-fit rounded-t-md mb-5 md:ml-3">
                    Informacion de la empresa{' '}
                  </label>
                  <div className="mb-3 md:mb-8 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-start gap-5 lg:gap-8 text-justify md:text-left">
                    <div className="w-full lg:relative">
                      <TitleBriefs titulo="1. ¿Cuál es el nombre comercial de la empresa?" />
                      <InputsBriefs
                        name="nombre_comercial"
                        type="text"
                        value={values.nombre_comercial}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={false}
                      />
                      <Errors
                        errors={errors.nombre_comercial}
                        touched={touched.nombre_comercial}
                      />
                    </div>

                    <div className="w-full lg:relative">
                      <TitleBriefs titulo="2. ¿Para qué medios se utilizará el brochure?" />
                      <div className="input2">
                        <div className="radio-container">
                          <div className="radio-wrapper">
                            <label className="radio-button">
                              <input
                                type="checkbox"
                                id="medio1"
                                checked={option1Checked}
                                onChange={handleOption1Change}
                                name="medios"
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
                                onChange={handleOption2Change}
                                name="medios2"
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
                      <TitleBriefs titulo="3. Medidas para el brochure" />
                      <div className="input2">
                        <div className="radio-container">
                          <div className="radio-wrapper">
                            <label className="radio-button">
                              <input
                                type="checkbox"
                                id="medio3"
                                checked={option3Checked}
                                onChange={handleOption3Change}
                                name="medios3"
                              />
                              <span className="radio-checkmark"></span>
                              <span className="radio-label">
                                A4 <br />
                              </span>
                            </label>
                          </div>
                          <div className="radio-wrapper">
                            <label className="radio-button">
                              <input
                                type="checkbox"
                                id="medio4"
                                checked={option4Checked}
                                onChange={handleOption4Change}
                                name="medios4"
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
                      in={option4Checked}
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
                              disabled={false}
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
                              disabled={false}
                            />
                          </label>
                        </div>
                      </div>
                    </CSSTransition>
                    <div className="w-full lg:relative">
                      <p
                        className="bg-white pt-0 pr-2 pb-0 lg:pl-2 -mt-3 mr-0 mb-0 ml-1 lg:ml-2 font-medium text-gray-600
                                            lg:absolute"
                      >
                        4 Adjunta tu logotipo (Adjunta solo la imagen, si tienes
                        tu logo en formato por favor enviarlo por Whatsapp)
                      </p>
                      <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-8 border">
                        <div className="flex-1 flex flex-col md:flex-row items-center md:gap-4 p-4">
                          <div className="w-1/4">
                            <ImageUploader
                              url={url1}
                              setUrl={setUrl1}
                              boton={boton1}
                              setBoton={setBoton1}
                              setImagen={setImagen1}
                              clase="1"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="w-full lg:relative">
                      <TitleBriefs titulo=" 5. DATOS DE CONTACTO" />
                      <textarea
                        className="border placeholder-gray-400 focus:outline-none
                                            focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                            border-gray-300 rounded-md resize-none"
                        name="datoscontacto"
                        value={values.datoscontacto}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Errors
                        errors={errors.datoscontacto}
                        touched={touched.datoscontacto}
                      />
                    </div>

                    <div className="w-full lg:relative">
                      <TitleBriefs titulo=" 6. Historia de la marca:" />
                      <textarea
                        className="border placeholder-gray-400 focus:outline-none
                                            focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                            border-gray-300 rounded-md resize-none"
                        name="historia"
                        value={values.historia}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Errors
                        errors={errors.historia}
                        touched={touched.historia}
                      />
                    </div>

                    <div className="w-full lg:relative">
                      <TitleBriefs titulo=" 7. Objetivo de la marca:" />
                      <textarea
                        className="border placeholder-gray-400 focus:outline-none
                                            focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                            border-gray-300 rounded-md resize-none"
                        name="objetivo"
                        value={values.objetivo}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Errors
                        errors={errors.objetivo}
                        touched={touched.objetivo}
                      />
                    </div>

                    <div className="w-full lg:relative">
                      <TitleBriefs titulo=" 8. Servicios y/o productos:" />
                      <textarea
                        className="border placeholder-gray-400 focus:outline-none
                                            focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                            border-gray-300 rounded-md resize-none"
                        name="servicios"
                        value={values.servicios}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Errors
                        errors={errors.servicios}
                        touched={touched.servicios}
                      />
                    </div>

                    <div className="w-full lg:relative">
                      <TitleBriefs titulo="9. Adjunta un enlace de Google Drive que contenga las imágenes que desear mostrar en tu brochure" />
                      <InputsBriefs
                        name="enlace"
                        type="text"
                        value={values.enlace}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={false}
                      />
                      <Errors errors={errors.enlace} touched={touched.enlace} />
                    </div>
                  </div>
                </div>

                <div className="w-full flex flex-col text-white">
                  <label className="bg-secondary-150 px-4 text-white py-2 w-fit rounded-t-md mb-5">
                    Estilo de tipografia
                  </label>
                  <div className="flex flex-col md:flex-row w-full mt-5 gap-5">
                    <div
                      className={`w-full md:w-1/2  flex justify-center flex-col items-center cursor-pointer relative ${
                        tipo1 ? 'border border-green-400' : 'border'
                      }`}
                      onClick={() => {
                        setTipo1(!tipo1)
                      }}
                    >
                      {tipo1 && (
                        <RiCheckDoubleFill className="text-green-600  absolute top-0 right-0 text-5xl mx-4" />
                      )}
                      <h3 className="bg-white w-fit pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 text-center text-lg">
                        1. Manuscrito
                      </h3>
                      <div className="w-full flex flex-col items-center select-none">
                        <img
                          src={tipo11}
                          alt=""
                          className="w-32 h-32 object-contain"
                        />
                      </div>
                    </div>

                    <div
                      className={`w-full md:w-1/2  flex justify-center flex-col items-center cursor-pointer relative ${
                        tipo2 ? 'border border-green-400' : 'border'
                      }`}
                      onClick={() => {
                        setTipo2(!tipo2)
                      }}
                    >
                      {tipo2 && (
                        <RiCheckDoubleFill className="text-green-600  absolute top-0 right-0 text-5xl mx-4" />
                      )}
                      <h3 className="bg-white w-fit pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 text-center text-lg">
                        2. Elegante
                      </h3>
                      <div className="w-full flex flex-col items-center select-none">
                        <img
                          src={tipo22}
                          alt=""
                          className="w-32 h-32 object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row w-full mt-5 gap-5">
                    <div
                      className={`w-full md:w-1/2  flex justify-center flex-col items-center cursor-pointer relative ${
                        tipo3 ? 'border border-green-400' : 'border'
                      }`}
                      onClick={() => {
                        setTipo3(!tipo3)
                      }}
                    >
                      {tipo3 && (
                        <RiCheckDoubleFill className="text-green-600  absolute top-0 right-0 text-5xl mx-4" />
                      )}
                      <h3 className="bg-white w-fit pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 text-center text-lg">
                        3. Simple
                      </h3>
                      <div className="w-full flex flex-col items-center select-none">
                        <img
                          src={tipo33}
                          alt=""
                          className="w-32 h-32 object-contain"
                        />
                      </div>
                    </div>
                    <div
                      className={`w-full md:w-1/2  flex justify-center flex-col items-center cursor-pointer relative ${
                        tipo4 ? 'border border-green-400' : 'border'
                      }`}
                      onClick={() => {
                        setTipo4(!tipo4)
                      }}
                    >
                      {tipo4 && (
                        <RiCheckDoubleFill className="text-green-600  absolute top-0 right-0 text-5xl mx-4" />
                      )}
                      <h3 className="bg-white w-fit pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 text-center text-lg">
                        1. Fuerte
                      </h3>
                      <div className="w-full flex flex-col items-center">
                        <img
                          src={tipo44}
                          alt=""
                          className="w-32 h-32 object-contain"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="w-full flex flex-col text-white mt-10">
                  <label className="bg-secondary-150 px-4 text-white py-2 w-fit rounded-t-md mb-5">
                    Estilo de Brochure
                  </label>
                  <div className="flex flex-col md:flex-row w-full mt-5 gap-5">
                    <div
                      className={`w-full md:w-1/2  flex justify-center flex-col items-center cursor-pointer relative ${
                        tipo5 ? 'border border-green-400' : 'border'
                      }`}
                      onClick={() => {
                        setTipo5(!tipo5)
                      }}
                    >
                      {tipo5 && (
                        <RiCheckDoubleFill className="text-green-600  absolute top-0 right-0 text-5xl mx-4" />
                      )}
                      <h3 className="bg-white w-fit pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 text-center text-lg">
                        1. Minimalista
                      </h3>
                      <div className="w-full flex flex-col items-center select-none">
                        <img
                          src={bro1}
                          alt=""
                          className="w-32 h-32 object-contain"
                        />
                      </div>
                    </div>
                    <div
                      className={`w-full md:w-1/2  flex justify-center flex-col items-center cursor-pointer relative ${
                        tipo6 ? 'border border-green-400' : 'border'
                      }`}
                      onClick={() => {
                        setTipo6(!tipo6)
                      }}
                    >
                      {tipo6 && (
                        <RiCheckDoubleFill className="text-green-600  absolute top-0 right-0 text-5xl mx-4" />
                      )}
                      <h3 className="bg-white w-fit pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 text-center text-lg">
                        2. Integrado
                      </h3>
                      <div className="w-full flex flex-col items-center select-none">
                        <img
                          src={bro2}
                          alt=""
                          className="w-32 h-32 object-contain"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col md:flex-row w-full mt-5 gap-5">
                    <div
                      className={`w-full md:w-1/2  flex justify-center flex-col items-center cursor-pointer relative ${
                        tipo7 ? 'border border-green-400' : 'border'
                      }`}
                      onClick={() => {
                        setTipo7(!tipo7)
                      }}
                    >
                      {tipo7 && (
                        <RiCheckDoubleFill className="text-green-600  absolute top-0 right-0 text-5xl mx-4" />
                      )}
                      <h3 className="bg-white w-fit pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 text-center text-lg">
                        3. Geometrico
                      </h3>
                      <div className="w-full flex flex-col items-center">
                        <img
                          src={bro3}
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
                  to="/admin/lista-briefs-brochure"
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
