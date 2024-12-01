import { useEffect, useState } from 'react'
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
  type ValuesPreventaModificate,
  type Ubicacion,
  type GeoData,
  type ValuesVenta,
  type arrayContacto
} from '../../../shared/schemas/Interfaces'
import { SchemeVentas } from '../../../shared/schemas/Schemas'
import { logo } from '../../../shared/Images'
import MapaComponent from './MapaComponent'
import { RiDeleteBin6Line, RiEyeLine, RiEyeOffLine } from 'react-icons/ri'
import { MdAdd } from 'react-icons/md'
import { RegistroContacto } from './modals/RegistroContacto'

export const EditarCliente = (): JSX.Element => {
  const { setTitle } = useAuth()
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const [latitud, setLatitud] = useState<number | null>(null)
  const [longitud, setLongitud] = useState<number | null>(null)
  const [ubicacion, setUbicacion] = useState<Ubicacion | null>(null)
  const [arrayContacto, setarrayConacto] = useState<arrayContacto[]>([])
  const [metricas, setmetricas] = useState({
    country: '',
    department: ''
  })
  const [show, setShow] = useState<boolean>(false)
  const [open, setOpen] = useState(false)
  const [sugerenciaUbi, setSugerenciaUbi] = useState(false)
  const [opcionalempresa, setOpcionalEmpresa] = useState(false)
  const getGeoData = async (lat: number, lng: number): Promise<GeoData> => {
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`

    const response = await fetch(url)
    if (!response.ok) {
      throw new Error('Error al obtener la información geográfica')
    }

    const data = await response.json()

    const country = data.address.country
    const department = data.address.state
    const district =
      data.address.city || data.address.town || data.address.village

    return {
      country,
      department,
      district
    }
  }

  const savePreventa = async (
    values: ValuesPreventaModificate
  ): Promise<void> => {
    setLoading(true)
    const token = localStorage.getItem('token')
    const lat: number = latitud ?? 0
    const lng: number = longitud ?? 0
    console.log(ubicacion)
    const geoData: GeoData = await getGeoData(lat, lng)
    const data = new FormData()
    data.append('nombres', values.nombres)
    data.append('empresa', values.empresa)
    data.append('apellidos', values.apellidos)
    data.append('email', values.email)
    data.append('celular', values.celular)
    data.append('edad', values.edad)
    data.append('sexo', values.sexo)
    data.append('medio_ingreso', values.medio_ingreso)
    data.append('dni_ruc', values.dni_ruc)
    data.append('dni_ruc', values.dni_ruc)
    data.append('arraycontacto', JSON.stringify(arrayContacto))
    data.append('antiguo', values.antiguo)
    data.append('region', JSON.stringify({ longitud, latitud }))
    data.append('metricas', geoData != null ? JSON.stringify(geoData) : '')
    data.append('_method', 'PUT')

    try {
      const respuesta = await axios.post(
        `${Global.url}/updateToVentas/${id ?? ''}`,
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
        navigate('/admin/lista-clientes')
      } else {
        Swal.fire('Error al editar', '', 'error')
      }
    } catch (error) {
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
    isSubmitting,
    setValues
  } = useFormik({
    initialValues: {
      id: 0,
      nombres: '',
      dni_ruc: '',
      id_contrato: '',
      apellidos: '',
      email: '',
      celular: '',
      edad: '',
      sexo: '',
      medio_ingreso: '',
      created_at: '',
      estado: '',
      antiguo: '',
      empresa: '',
      arraycontacto: ''
    },
    validationSchema: SchemeVentas,
    onSubmit: savePreventa
  })

  const getOneBrief = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/getOnePreventa/${id ?? ''}`,
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
      apellidos: request.data.apellidos,
      email: request.data.email,
      celular: request.data.celular,
      edad: request.data.edad,
      sexo: request.data.sexo,
      medio_ingreso: request.data.medio_ingreso,
      dni_ruc: request.data.dni_ruc,
      antiguo: request.data.antiguo,
      empresa: request.data.empresa
    })

    if (request.data.arraycontacto) {
      setarrayConacto(JSON.parse(request.data.arraycontacto))
    }

    const request2 = await axios.get(`${Global.url}/getVentas`, {
      headers: {
        Authorization: `Bearer ${
          token !== null && token !== '' ? `Bearer ${token}` : ''
        }`
      }
    })
    const resultados = request2.data
    const filtrarPorCliente = (): ValuesVenta[] => {
      return resultados.filter(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        (resultado: ValuesVenta) => resultado.id_cliente == id ?? ''
      )
    }
    const resultadosFiltrados = filtrarPorCliente()
    const ultimoResultado = resultadosFiltrados.pop()
    if (!request.data.empresa && ultimoResultado) {
      setValues({
        ...values,
        nombres: request.data.nombres,
        apellidos: request.data.apellidos,
        email: request.data.email,
        celular: request.data.celular,
        edad: request.data.edad,
        sexo: request.data.sexo,
        medio_ingreso: request.data.medio_ingreso,
        dni_ruc: request.data.dni_ruc,
        antiguo: request.data.antiguo,
        empresa: ultimoResultado?.nombre_empresa ?? ''
      })
      setOpcionalEmpresa(true)
    }

    if (request.data.metricas) {
      setmetricas(JSON.parse(request.data.metricas))
    }
    if (request.data.region) {
      let latit = null
      let longi = null
      if (JSON.parse(request.data.region).latitud) {
        latit = JSON.parse(request.data.region).latitud
      } else {
        latit = -12.0463731
        setSugerenciaUbi(true)
      }
      if (JSON.parse(request.data.region).longitud) {
        longi = JSON.parse(request.data.region).longitud
      } else {
        longi = -77.042754
        setSugerenciaUbi(true)
      }
      setLatitud(latit)
      setLongitud(longi)
    } else {
      // CAMBIAR
      setSugerenciaUbi(true)
      setLatitud(-12.0463731)
      setLongitud(-77.042754)
    }

    setLoading(false)
  }

  useEffect(() => {
    setTitle('EDITAR CLIENTE')
    Promise.all([getOneBrief()]).then(() => {
      setLoading(false)
    })
  }, [])

  const eliminarArray = async (id: number | null): Promise<void> => {
    const nuevoArray = arrayContacto.filter((peso) => peso.id !== id)
    setarrayConacto(nuevoArray)
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
              <img
                src={logo}
                alt=""
                className="mx-auto w-[50%] px-4 md:px-0 md:w-48"
              />
              {show
                ? (
                <RiEyeOffLine
                  className="text-main absolute right-0 top-0 m-4 text-4xl cursor-pointer"
                  onClick={() => {
                    setShow(false)
                  }}
                />
                  )
                : (
                <RiEyeLine
                  className="text-main absolute right-0 top-0 m-4 text-4xl cursor-pointer"
                  onClick={() => {
                    setShow(true)
                  }}
                />
                  )}

              <div className="flex w-full mt-5 md:mt-5 flex-col">
                <div className="w-full flex flex-col text-white">
                  <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-end gap-2 lg:gap-5">
                    <div className="w-full flex flex-col gap-3 md:flex-row">
                      <div className="w-full md:w-full lg:relative">
                        <TitleBriefs titulo=" Nombres" />
                        <InputsBriefs
                          name="nombres"
                          type="text"
                          value={values.nombres}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={false}
                        />
                        <Errors
                          errors={errors.nombres}
                          touched={touched.nombres}
                        />
                      </div>
                      <div className="w-full md:w-full lg:relative">
                        <TitleBriefs titulo=" Apellidos" />
                        <InputsBriefs
                          name="apellidos"
                          type="text"
                          value={values.apellidos}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={false}
                        />
                        <Errors
                          errors={errors.apellidos}
                          touched={touched.apellidos}
                        />
                      </div>
                    </div>
                    <div className="w-full flex flex-col gap-3 md:flex-row">
                      <div className="w-full md:w-full relative h-fit">
                        <TitleBriefs titulo="Empresa" />
                        <input
                          //    className="border placeholder-gray-400 focus:outline-none
                          //    focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                          //    border-gray-300 rounded-md transition-all"
                          className={`border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block ${
                                                        opcionalempresa
                                                          ? 'bg-red-400'
                                                          : 'bg-white'
                                                      }
                                                      border-gray-300 rounded-md transition-all `}
                          name="empresa"
                          type="text"
                          value={values.empresa}
                          disabled={false}
                          onChange={(e) => {
                            handleChange(e)
                          }}
                          onBlur={(e) => {
                            handleBlur(e)
                          }}
                        />
                        <Errors
                          errors={errors.empresa}
                          touched={touched.empresa}
                        />
                      </div>
                      <div className="w-full md:w-full relative h-fit">
                        <TitleBriefs titulo=" DNI/RUC" />
                        <input
                          className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                          name="dni_ruc"
                          type="text"
                          value={values.dni_ruc}
                          disabled={false}
                          onChange={(e) => {
                            handleChange(e)
                          }}
                          onBlur={(e) => {
                            handleBlur(e)
                          }}
                        />
                        <Errors
                          errors={errors.dni_ruc}
                          touched={touched.dni_ruc}
                        />
                      </div>
                    </div>
                    <div className="w-full flex flex-col md:flex-row gap-3 lg:gap-5 mt-3 lg:mt-0">
                      <div className="w-full  lg:relative">
                        <TitleBriefs titulo="Celular" />
                        <InputsBriefs
                          name="celular"
                          type="number"
                          value={values.celular}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={false}
                        />
                        <Errors
                          errors={errors.celular}
                          touched={touched.celular}
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
                          disabled={false}
                        />
                        <Errors errors={errors.email} touched={touched.email} />
                      </div>
                    </div>
                  </div>
                  <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col">
                    <div className="flex justify-center w-full items-center">
                      <h2 className="text-black font-bold uppercase w-full">
                        Informacion de contactos
                      </h2>
                      <MdAdd
                        onClick={() => {
                          setOpen(!open)
                        }}
                        className="text-4xl text-main hover:bg-main hover:text-white rounded-full p-2 transition-colors cursor-pointer"
                        title="Registrar nuevo contacto"
                      />
                      <RegistroContacto
                        open={open}
                        setOpen={setOpen}
                        id={id}
                        arrayContacto={arrayContacto}
                        setarrayConacto={setarrayConacto}
                        getOneBrief={getOneBrief}
                        datos={values}
                      />
                    </div>
                    <div className="mt-3">
                      {arrayContacto.length > 0
                        ? <div className="rounded-xl grid grid-cols-2 gap-4">
                          {arrayContacto.map((pro: arrayContacto) => (
                            <div
                              className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center bg-transparent border border-gray-300 p-2 rounded-xl text-black"
                              key={pro.id}
                            >
                              <div className="md:text-center">
                                <h5 className="md:hidden text-center text-black font-bold mb-2">
                                  Contacto/Empresa
                                </h5>
                                <span>{pro.nombres}</span>
                              </div>
                              <div className="md:text-center line-clamp-2">
                                <h5 className="md:hidden text-center text-black font-bold mb-2">
                                  Marca
                                </h5>
                                <span>{pro.marca}</span>
                              </div>
                              <div className="md:text-center">
                                <h5 className="md:hidden text-center text-black font-bold mb-2">
                                  Celular
                                </h5>
                                <span>{pro.celular}</span>
                              </div>
                              <div className="md:text-center line line-clamp-1">
                                <h5 className="md:hidden text-center text-black block font-bold mb-2 break-words">
                                  Correo
                                </h5>
                                <span>{pro.correo}</span>
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
                        : (
                        <p className="text-gray-400 w-full text-center">
                          Sin datos de contacto
                        </p>
                          )}
                    </div>
                  </div>
                  {show && (
                    <>
                      <label className="bg-secondary-150 px-4 text-white py-2 w-fit rounded-t-md mb-5 md:ml-3">
                        Datos para metricas
                      </label>
                      <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-start gap-5 lg:gap-8 text-justify md:text-left">
                        <div className="w-full flex flex-col md:flex-row justify-between items-center gap-3">
                          <div className="w-full lg:relative">
                            <TitleBriefs titulo="Edad" />
                            <InputsBriefs
                              name="edad"
                              type="number"
                              value={values.edad}
                              onChange={handleChange}
                              onBlur={handleBlur}
                              disabled={false}
                            />
                            <Errors
                              errors={errors.edad}
                              touched={touched.edad}
                            />
                          </div>
                          <div className="w-full lg:relative">
                            <TitleBriefs titulo="Genero" />
                            <select
                              className="border placeholder-gray-400 focus:outline-none
                                                        focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                        border-gray-300 rounded-md transition-all"
                              name="sexo"
                              value={values.sexo}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
                              {/* FB GOOGLE, VENTAS, POST VENTA, RECOMENDACION, ISNTAGRAM) */}
                              <option value="">Seleccionar</option>
                              <option value="hombre">Hombre</option>
                              <option value="mujer">Mujer</option>
                              <option value="otro">Otro</option>
                              <option value="otro">No registrado</option>
                            </select>
                            <Errors
                              errors={errors.sexo}
                              touched={touched.sexo}
                            />
                          </div>
                          <div className="w-full lg:relative">
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
                        </div>
                        <div className="w-1/3">
                          <TitleBriefs titulo="Registros antiguos - llenado de información" />
                          <select
                            className="border placeholder-gray-400 focus:outline-none
                            focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                            border-gray-300 rounded-md transition-all"
                            name="antiguo"
                            value={values.antiguo}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          >
                            <option value="0">Nuevo</option>
                            <option value="1">Antiguo</option>
                          </select>
                        </div>
                      </div>
                      <MapaComponent
                        setLatitud={setLatitud}
                        setLongitud={setLongitud}
                        setUbicacion={setUbicacion}
                        latitud={latitud}
                        longitud={longitud}
                        setLoading={setLoading}
                      />
                      <div className="flex gap-5 text-black pl-4">
                        <p className="text-black ">
                          UBICACION:
                          <span
                            className={`${
                              sugerenciaUbi ? 'bg-red-400' : ''
                            } pl-4`}
                          >
                            {latitud}
                            {longitud}
                          </span>
                        </p>
                        <span>/</span>
                        <p>
                          {metricas.country} - {metricas.department}{' '}
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              <div className="flex w-full justify-end gap-3 rounded-md text-black mt-5">
                <Link
                  to="/admin/lista-clientes"
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
