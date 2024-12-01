/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import { Loading } from '../../../shared/Loading'
import { TitleBriefs } from '../../../shared/TitleBriefs'
import { InputsBriefs } from '../../../shared/InputsBriefs'
import { useFormik } from 'formik'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { Errors } from '../../../shared/Errors'
import { SchemaEditarVentas } from '../../../shared/schemas/Schemas'
import { logo } from '../../../shared/Images'
import { convertirFecha } from '../../../shared/functions/QuitarAcerntos'
import { type arrayContacto } from '../../../shared/schemas/Interfaces'
type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

export const ViewServicio = (): JSX.Element => {
  const { setTitle } = useAuth()
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(true)
  const [dateInicio, setDateInicio] = useState<Value>(null)
  const [fechaAlta, setFechaAlta] = useState<Value>(null)
  const [dateFin, setDateFin] = useState<Value>(null)
  const savePreventa = async (): Promise<void> => {
  }
  const [datosContacto, setDatosContacto] = useState<arrayContacto | null>(
    null
  )
  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    touched,
    handleBlur,
    isSubmitting,
    setValues
  } = useFormik({
    initialValues: {
      medio_ingreso: '',
      nombre_empresa: '',
      id_contrato: '',
      dni_ruc: '',
      nombres: '',
      nombre_marca: '',
      apellidos: '',
      codigo: '',
      observaciones: '',
      comentarios: '',
      uso: 0,
      arraycontrato: ''
    },
    validationSchema: SchemaEditarVentas,
    onSubmit: savePreventa
  })

  const getOneBrief = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getVenta/${id ?? ''}`, {
      headers: {
        Authorization: `Bearer ${
          token !== null && token !== '' ? `Bearer ${token}` : ''
        }`
      }
    })

    let personacontacto = null
    if (request.data[0].id_contacto) {
      JSON.parse(request.data[0].arraycontacto).forEach(
        (element: arrayContacto) => {
          if (element.id == request.data[0].id_contacto) {
            personacontacto = element.marca
            setDatosContacto(element)
          }
        }
      )
    }
    setValues({
      ...values,
      id_contrato: request.data[0].id_contrato,
      nombres: request.data[0].nombres,
      medio_ingreso: request.data[0].medio_ingreso,
      nombre_empresa:
      personacontacto &&
        request.data[0].empresa_cliente
        ? request.data[0].empresa_cliente
        : personacontacto
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          ? `${request.data[0].nombres} ${request.data[0].apellidos}`
          : request.data[0].nombre_empresa,
      nombre_marca: request.data[0].nombre_marca,
      apellidos: request.data[0].apellidos,
      dni_ruc: request.data[0].dni_ruc,
      codigo: request.data[0].codigo,
      observaciones: request.data[0].observaciones,
      comentarios: request.data[0].comentarios,
      uso: request.data[0].uso,
      arraycontrato: request.data[0].contrato ? request.data[0].contrato : []
    })

    if (request.data[0].fecha_alta) {
      setFechaAlta(convertirFecha(request.data[0].fecha_alta))
    }

    if (request.data[0].fecha_inicio) {
      setDateInicio(convertirFecha(request.data[0].fecha_inicio))
    }
    if (request.data[0].fecha_fin) {
      setDateFin(convertirFecha(request.data[0].fecha_fin))
    }
    setLoading(false)
  }

  useEffect(() => {
    setTitle('VISUALIZAR SERVICIO')
    getOneBrief()
  }, [])

  useEffect(() => {
    getOneBrief()
  }, [id])

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
              <div className="w-full flex gap-5">
                <img
                  src={logo}
                  alt=""
                  className="mx-auto w-[50%] px-4 md:px-0 md:w-48 object-contain"
                />
                 {// @ts-expect-error
                 values.arraycontrato.codigo && (
                  <div
                    className={`md:absolute w-fit text-white font-bold text-xl mx-auto rounded-lg md:ml-3 my-5 px-5 py-3 text-center ${
                      // @ts-expect-error
                        values.arraycontrato.uso == 0
                        ? 'bg-green-600'
                        : values.uso == 1
                        ? 'bg-red-600'
                        : 'hidden'
                    } `}
                  >
                    {// @ts-expect-error
                    values.arraycontrato.codigo}
                  </div>
                 )}
                {values.codigo && (
                  <div
                    className={`md:absolute w-fit text-white font-bold text-xl mx-auto rounded-lg md:ml-3 my-5 px-5 py-3 text-center ${
                      values.uso == 0
                        ? 'bg-green-600'
                        : values.uso == 1
                        ? 'bg-red-600'
                        : 'hidden'
                    } `}
                  >
                    {values.codigo}
                  </div>
                )}
              </div>

              <div className="flex w-full mt-5 md:mt-5 flex-col">
                <div className="w-full flex flex-col text-white">
                  <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-end gap-2 lg:gap-5">
                    <div className="w-full flex flex-col gap-3 md:flex-row">
                      <div className="w-full md:w-1/3 lg:relative">
                        <TitleBriefs titulo=" Cod. Contrato" />
                        <InputsBriefs
                          name="id_contrato"
                          type="text"
                          value={values.id_contrato}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={true}
                        />
                        <Errors
                          errors={errors.id_contrato}
                          touched={touched.id_contrato}
                        />
                      </div>
                      <div className="w-full md:w-1/3 lg:relative">
                        <TitleBriefs titulo="Cliente" />
                        <InputsBriefs
                          name="nombres"
                          type="text"
                          value={`${values.nombres} ${values.apellidos}`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={true}
                        />
                      </div>
                      <div className="w-full md:w-1/3 lg:relative">
                        <TitleBriefs titulo="DNI/RUC" />
                        <InputsBriefs
                          name="dni_ruc"
                          type="text"
                          value={`${values.dni_ruc}`}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={true}
                        />
                        <Errors
                          errors={errors.dni_ruc}
                          touched={touched.dni_ruc}
                        />
                      </div>
                    </div>
                    <div className="w-full flex flex-col gap-3 md:flex-row">
                      <div className="w-full md:w-1/3 lg:relative">
                        <TitleBriefs titulo="Nombre/Empresa" />
                        <InputsBriefs
                          name="nombre_empresa"
                          type="text"
                          value={values.nombre_empresa}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={true}
                        />
                        <Errors
                          errors={errors.nombre_empresa}
                          touched={touched.nombre_empresa}
                        />
                      </div>
                      <div className="w-full md:w-1/3 lg:relative">
                        <TitleBriefs titulo="Persona de contacto/cargo" />
                        <InputsBriefs
                          name="nombre_empresa"
                          type="text"
                          value={values.nombre_empresa}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={true}
                        />
                        <Errors
                          errors={errors.nombre_empresa}
                          touched={touched.nombre_empresa}
                        />
                      </div>
                      <div className="w-full md:w-1/3  lg:relative mt-2">
                        <TitleBriefs titulo="Medio de ingreso" />
                        <select
                          className="border placeholder-gray-400 focus:outline-none
                                                                    focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                                    border-gray-300 rounded-md transition-all"
                          name="medio_ingreso"
                          value={values.medio_ingreso}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled
                        >
                          {/* FB GOOGLE, VENTAS, POST VENTA, RECOMENDACION, ISNTAGRAM) */}
                          <option value="">Seleccionar</option>
                          <option value="0">Facebook</option>
                          <option value="4">Whatsapp</option>
                          <option value="1">Google</option>
                          <option value="5">Instagram</option>
                          <option value="2">Ventas</option>
                          <option value="3">Post Venta</option>
                          <option value="6">Recomendación</option>
                          <option value="7">Logos</option>
                        </select>
                        <Errors
                          errors={errors.medio_ingreso}
                          touched={touched.medio_ingreso}
                        />
                      </div>
                      <div className="w-full md:w-1/3 lg:relative">
                        <TitleBriefs titulo="Marca/Logo" />
                        <InputsBriefs
                          name="nombre_marca"
                          type="text"
                          value={values.nombre_marca}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={true}
                        />
                      </div>
                    </div>
                    {datosContacto && (
                        <>
                        <h2 className="px-3 pt-4 text-gray-700 font-bold w-full text-left">
                            PERSONA A CARGO DEL PROYECTO
                        </h2>
                        <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-end gap-2 lg:gap-5">
                            <div className="w-full flex flex-col gap-3 md:flex-row">
                                <div className="w-full md:w-1/4 lg:relative">
                                <TitleBriefs titulo="Nombres" />
                                <input
                                    className="border placeholder-gray-400 focus:outline-none
                                                                                    focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                                                    border-gray-300 rounded-md transition-all text-black"
                                    type='text'
                                    disabled
                                    value={datosContacto.nombres}
                                />
                                </div>
                                <div className="w-full md:w-1/4 lg:relative">
                                    <TitleBriefs titulo="Correo" />
                                    <input
                                        className="border placeholder-gray-400 focus:outline-none
                                                                                        focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                                                        border-gray-300 rounded-md transition-all text-black"
                                        type='text'
                                        disabled
                                        value={datosContacto.correo}
                                    />
                                </div>
                                <div className="w-full md:w-1/4 lg:relative">
                                <TitleBriefs titulo="Celular" />
                                <input
                                    className="border placeholder-gray-400 focus:outline-none
                                                                                    focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                                                    border-gray-300 rounded-md transition-all text-black"
                                    type='text'
                                    disabled
                                    value={datosContacto.celular}
                                />
                                </div>
                                <div className="w-full md:w-1/4 lg:relative">
                                <TitleBriefs titulo="Marca" />
                                <input
                                    className="border placeholder-gray-400 focus:outline-none
                                                                                    focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                                                    border-gray-300 rounded-md transition-all text-black"
                                    type='text'
                                    disabled
                                    value={datosContacto.marca}
                                />
                                </div>
                            </div>
                        </div>
                        </>
                    )}
                    <div className="w-full">
                      <div className="w-full relative">
                        <TitleBriefs titulo="Observaciones" />
                        <textarea
                          className="border placeholder-gray-400 focus:outline-none
                                            focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                            border-gray-300 rounded-md resize-none text-black"
                          name="observaciones"
                          disabled
                          rows={5}
                          value={values.observaciones}
                        />
                      </div>
                    </div>
                    <div className="w-full">
                      <div className="w-full relative">
                        <TitleBriefs titulo="Comentarios generales" />
                        <textarea
                          className="border placeholder-gray-400 focus:outline-none
                                            focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                            border-gray-300 rounded-md resize-none text-black"
                          name="comentarios"
                          rows={5}
                          disabled
                          value={values.comentarios}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="w-full flex gap-5 px-3 justify-center mb-10 mt-3">
                <div className="w-full contenido_calendario relative">
                  <TitleBriefs titulo="Fecha del Alta" />
                  <input
                    type="date"
                    disabled
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    value={fechaAlta ? fechaAlta.toISOString().substr(0, 10) : ''}
                    className="border placeholder-gray-400 focus:outline-none
                    focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                    border-gray-300 rounded-md transition-all text-black text-center cursor-pointer"
                  />
                </div>
              </div>

              <div className="w-full flex gap-5 px-3 mt-0">
                <div className="w-full contenido_calendario relative">
                  <TitleBriefs titulo="Fecha de inicio" />
                  <input
                    type="date"
                    disabled
                    value={
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      dateInicio ? dateInicio.toISOString().substr(0, 10) : ''
                    }
                    className="border placeholder-gray-400 focus:outline-none
                    focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                    border-gray-300 rounded-md transition-all text-black text-center"
                  />
                </div>
                <div className="w-full contenido_calendario relative">
                  <TitleBriefs titulo="Fecha de culminación" />
                  <input
                    type="date"
                    disabled
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    value={dateFin ? dateFin.toISOString().substr(0, 10) : ''}
                    className="border placeholder-gray-400 focus:outline-none
                    focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                    border-gray-300 rounded-md transition-all text-black text-center cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex w-full justify-end gap-3 rounded-md text-black mt-5">
                <Link
                  to="/admin/lista-servicios"
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
