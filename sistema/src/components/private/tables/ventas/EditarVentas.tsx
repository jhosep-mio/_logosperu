/* eslint-disable multiline-ternary */
import { useEffect, useState, type ChangeEvent } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import { Loading } from '../../../shared/Loading'
import { TitleBriefs } from '../../../shared/TitleBriefs'
import { InputsBriefs } from '../../../shared/InputsBriefs'
import { useFormik } from 'formik'
import Swal from 'sweetalert2'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { Errors } from '../../../shared/Errors'
import {
  type arrayContacto,
  type arrayAsignacion,
  type ValuesVentasEdit
} from '../../../shared/schemas/Interfaces'
import { SchemaEditarVentas } from '../../../shared/schemas/Schemas'
import { logo } from '../../../shared/Images'
import Calendar from 'react-calendar'
import {
  convertirFecha,
  formatDate
} from '../../../shared/functions/QuitarAcerntos'
import { IoCloseCircle } from 'react-icons/io5'
import { ListaColaboradores } from './ListaColaboradores'
type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

export const EditarVentas = (): JSX.Element => {
  const { setTitle } = useAuth()
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const [datosContacto, setDatosContacto] = useState<arrayContacto | null>(
    null
  )
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [dateInicio, setDateInicio] = useState<Value>(null)
  const [fechaAlta, setFechaAlta] = useState<Value>(null)
  const [dateFin, setDateFin] = useState<Value>(null)
  const [arrayPesos, setarrayPesos] = useState<arrayAsignacion[]>([
    { id: null, peso: '' }
  ])
  const [usuarios, setUsuarios] = useState([])

  const handleInputChangeInicio = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    try {
      const dateValue = event.target.value // obtienes la fecha como una cadena YYYY-MM-DD

      if (dateValue) {
        // Asegurarse de que la fecha ingresada mantenga la zona horaria local
        const localDate = new Date(dateValue + 'T00:00:00')

        if (!isNaN(localDate.getTime())) {
          setDateInicio(localDate)
        }
      }
    } catch (error) {
      console.error('Fecha inválida', error)
    }
  }

  const getUsuarios = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getUsuariosToMatrix`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setUsuarios(request.data)
  }

  const handleInputChangeFin = (event: ChangeEvent<HTMLInputElement>): void => {
    try {
      const dateValue = event.target.value // obtienes la fecha como una cadena YYYY-MM-DD
      if (dateValue) {
        // Asegurarse de que la fecha ingresada mantenga la zona horaria local
        const localDate = new Date(dateValue + 'T00:00:00')
        if (!isNaN(localDate.getTime())) {
          setDateFin(localDate)
        }
      }
    } catch (error) {
      console.error('Fecha inválida', error)
    }
  }

  const handleInputChangeFechaAlta = (
    event: ChangeEvent<HTMLInputElement>
  ): void => {
    try {
      const dateValue = event.target.value // obtienes la fecha como una cadena YYYY-MM-DD
      if (dateValue) {
        // Asegurarse de que la fecha ingresada mantenga la zona horaria local
        const localDate = new Date(dateValue + 'T00:00:00')
        if (!isNaN(localDate.getTime())) {
          setFechaAlta(localDate)
        }
      }
    } catch (error) {
      console.error('Fecha inválida', error)
    }
  }

  const savePreventa = async (values: ValuesVentasEdit): Promise<void> => {
    setLoading(true)
    const token = localStorage.getItem('token')
    const data = new FormData()
    data.append('medio_ingreso', values.medio_ingreso)
    data.append('dni_ruc', values.dni_ruc)
    data.append('nombre_empresa', values.nombre_empresa)
    data.append('id_contrato', values.id_contrato)
    data.append('nombre_marca', values.nombre_marca)
    data.append('observaciones', values.observaciones)
    data.append('asignacion', JSON.stringify(arrayPesos))
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    data.append('fecha_alta', fechaAlta ? formatDate(fechaAlta) : null)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    data.append('fecha_inicio', dateInicio ? formatDate(dateInicio) : null)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    data.append('fecha_fin', dateFin ? formatDate(dateFin) : null)
    data.append('_method', 'PUT')

    try {
      const respuesta = await axios.post(
        `${Global.url}/updateVenta/${id ?? ''}`,
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
        Swal.fire('Actualizado correctamente', '', 'success')
        navigate('/admin/lista-ventas')
      } else {
        Swal.fire('Error al editar', '', 'error')
      }
    } catch (error) {
      Swal.fire('Error', '', 'error')
      console.log(error)
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
    isSubmitting,
    setValues
  } = useFormik({
    initialValues: {
      medio_ingreso: '',
      nombre_empresa: '',
      id_contrato: '',
      dni_ruc: '',
      observaciones: '',
      nombres: '',
      nombre_marca: '',
      apellidos: '',
      observaciones2: ''
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
      dni_ruc: request.data[0].dni_ruc != null ? request.data[0].dni_ruc : '',
      observaciones: request.data[0].contrato?.adicionales ?? '',
      observaciones2: request.data[0].observaciones ?? ''
    })
    if (request.data[0].asignacion) {
      setarrayPesos(JSON.parse(request.data[0].asignacion))
    } else {
      setarrayPesos([])
    }
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
    setTitle('EDITAR VENTA')
    getUsuarios()
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

  return (
    <>
      <div className="">
        {loading
          ? <Loading />
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
                    <div className="w-full flex flex-col gap-3 md:flex-row">
                      <div className="w-full md:w-1/3 lg:relative">
                        <TitleBriefs titulo=" Cod. Contrato" />
                        <InputsBriefs
                          name="id_contrato"
                          type="text"
                          value={values.id_contrato}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={false}
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
                          disabled={false}
                        />
                        <Errors
                          errors={errors.dni_ruc}
                          touched={touched.dni_ruc}
                        />
                      </div>
                    </div>
                    <div className="w-full flex flex-col gap-3 md:flex-row mt-3 lg:mt-0">
                      <div className="w-full md:w-1/3 lg:relative">
                        <TitleBriefs titulo="Nombre/Empresa" />
                        <InputsBriefs
                          name="nombre_empresa"
                          type="text"
                          value={values.nombre_empresa}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={false}
                        />
                        <Errors
                          errors={errors.nombre_empresa}
                          touched={touched.nombre_empresa}
                        />
                      </div>
                      {/* <div className="w-full md:w-1/3 lg:relative">
                        <TitleBriefs titulo="Persona de contacto/cargo" />
                        <InputsBriefs
                          name="nombre_empresa"
                          type="text"
                          value={values.nombre_empresa}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={false}
                        />
                        <Errors
                          errors={errors.nombre_empresa}
                          touched={touched.nombre_empresa}
                        />
                      </div> */}
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
                          disabled={false}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {datosContacto && (
                <>
                  <h2 className="px-3 py-4 text-gray-700 font-bold">
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

              <div className="px-0 lg:px-3 mb-4">
                <div className="w-full relative">
                  <TitleBriefs titulo="Observaciones" />
                  <div
                          className="text-black border placeholder-gray-400 focus:outline-none
                        focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                        border-gray-300 rounded-md resize-none min-h-[80px]"
                        >
                          {values.observaciones && JSON.parse(values.observaciones).length > 0 ? (
                            <ul>
                              {JSON.parse(values.observaciones).map(
                                (item: any, index: any) => (
                                  <li
                                    key={index}
                                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                  >{ `• ${item.cantidad} ${item.elemento}`}</li>
                                )
                              )}
                            </ul>
                          ) : values.observaciones2}
                        </div>
                </div>
              </div>

              <div className="w-full flex gap-5 lg:px-3 justify-center mb-4 lg:mb-10">
                <div className="w-full contenido_calendario relative">
                  <TitleBriefs titulo="Fecha del Alta" />
                  <input
                    type="date"
                    value={
                        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                      fechaAlta ? fechaAlta.toISOString().substr(0, 10) : ''
                    }
                    onChange={handleInputChangeFechaAlta}
                    className="border placeholder-gray-400 focus:outline-none
                    focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                    border-gray-300 rounded-md transition-all text-black text-center cursor-pointer"
                  />
                  {fechaAlta && (
                    <IoCloseCircle
                      className="absolute right-5 top-5 bottom-0 text-red-500 text-2xl z-50 cursor-pointer"
                      onClick={() => {
                        setFechaAlta(null)
                      }}
                    />
                  )}
                </div>
              </div>

              <div className="w-full flex flex-col lg:flex-row gap-5 lg:px-3">
                <div className="w-full contenido_calendario relative">
                  <TitleBriefs titulo="Fecha de inicio" />
                  <input
                    type="date"
                    value={
                      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                      // @ts-expect-error
                      dateInicio ? dateInicio.toISOString().substr(0, 10) : ''
                    }
                    onChange={handleInputChangeInicio}
                    className="border placeholder-gray-400 focus:outline-none
                    focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                    border-gray-300 rounded-md transition-all text-black text-center"
                  />
                  {dateInicio && (
                    <IoCloseCircle
                      className="absolute right-5 top-5 bottom-0 text-red-500 text-2xl z-50 cursor-pointer"
                      onClick={() => {
                        setDateInicio(null)
                      }}
                    />
                  )}
                  <Calendar
                    onChange={(value) => {
                      if (value && value instanceof Date) {
                        setDateInicio(
                          new Date(
                            value.toISOString().split('T')[0] + 'T00:00:00'
                          )
                        )
                      }
                    }}
                    value={dateInicio ?? null}
                    className="w-full px-10 shadow-md shadow-green-500 p-4"
                  />
                </div>
                <div className="w-full contenido_calendario relative">
                  <TitleBriefs titulo="Fecha de culminación" />
                  <input
                    type="date"
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    value={dateFin ? dateFin.toISOString().substr(0, 10) : ''}
                    onChange={handleInputChangeFin}
                    className="border placeholder-gray-400 focus:outline-none
                    focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                    border-gray-300 rounded-md transition-all text-black text-center cursor-pointer"
                  />
                  {dateFin && (
                    <IoCloseCircle
                      className="absolute right-5 top-5 bottom-0 text-red-500 text-2xl z-50"
                      onClick={() => {
                        setDateFin(null)
                      }}
                    />
                  )}
                  <Calendar
                    onChange={setDateFin}
                    value={
                      dateFin
                        ? new Date(
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-expect-error
                          // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                          dateFin.getTime() +
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-expect-error
                              dateFin.getTimezoneOffset() * 60000
                        )
                        : null
                    }
                    className="w-full px-10 shadow-md shadow-red-500 p-4"
                  />
                </div>
              </div>
              <section className="w-full px-4 mt-6">
                <ListaColaboradores
                  arrayPesos={arrayPesos}
                  setarrayPesos={setarrayPesos}
                  usuarios={usuarios}
                />
              </section>

              <div className="flex w-full justify-end gap-3 rounded-md text-black mt-5">
                <Link
                  to="/admin/lista-ventas"
                  className="bg-red-600 px-3 py-2 rounded-md text-white cursor-pointer"
                >
                  Cancelar
                </Link>
                <input
                  type="submit"
                  className="bg-secondary-150 px-3 py-2 text-white rounded-md cursor-pointer"
                  value="Editar"
                />
              </div>
            </form>
          </div>
            )}
      </div>
    </>
  )
}
