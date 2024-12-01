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
import {
  type ValuesPreventaModificate,
  type Ubicacion,
  type ValuesVenta
} from '../../../shared/schemas/Interfaces'
import { SchemeVentas } from '../../../shared/schemas/Schemas'
import { logo } from '../../../shared/Images'
import { RiEyeLine, RiEyeOffLine } from 'react-icons/ri'
import MapaComponentView from './mapa/MapaComponentView'

export const VerCliente = (): JSX.Element => {
  const { setTitle } = useAuth()
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(true)
  const [latitud, setLatitud] = useState<number | null>(null)
  const [longitud, setLongitud] = useState<number | null>(null)
  const [, setUbicacion] = useState<Ubicacion | null>(null)
  const [metricas, setmetricas] = useState({
    country: '',
    department: ''
  })

  const [show, setShow] = useState<boolean>(false)
  const [sugerenciaUbi, setSugerenciaUbi] = useState(false)
  const [opcionalempresa, setOpcionalEmpresa] = useState(false)

  const savePreventa = async (
    _values: ValuesPreventaModificate
  ): Promise<void> => {
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

    const request2 = await axios.get(
        `${Global.url}/getVentas`,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? `Bearer ${token}` : ''
            }`
          }
        }
    )
    const resultados = request2.data
    const filtrarPorCliente = (): ValuesVenta[] => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      return resultados.filter((resultado: ValuesVenta) => resultado.id_cliente == id ?? '')
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
    } else { // CAMBIAR
      setSugerenciaUbi(true)
      setLatitud(-12.0463731)
      setLongitud(-77.042754)
    }

    setLoading(false)
  }

  useEffect(() => {
    setTitle('EDITAR CLIENTE')
    Promise.all([
      getOneBrief()
    ]).then(() => {
      setLoading(false)
    })
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
                          disabled={true}
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
                          disabled={true}
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
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block ${opcionalempresa ? 'bg-red-400' : 'bg-white'}
                                                      border-gray-300 rounded-md transition-all `}
                          name="empresa"
                          type="text"
                          value={values.empresa}
                          disabled={true}
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
                          disabled={true}
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
                          disabled={true}
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
                          disabled={true}
                        />
                        <Errors errors={errors.email} touched={touched.email} />
                      </div>
                    </div>
                  </div>
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
                              disabled={true}
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
                              disabled
                            >
                              {/* FB GOOGLE, VENTAS, POST VENTA, RECOMENDACION, ISNTAGRAM) */}
                              <option value="">Seleccionar</option>
                              <option value="hombre">Hombre</option>
                              <option value="mujer">Mujer</option>
                              <option value="otro">Otro</option>
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
                            disabled
                          >
                            <option value="0">Nuevo</option>
                            <option value="1">Antiguo</option>
                          </select>
                        </div>
                      </div>
                      <MapaComponentView
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
                          <span className={`${sugerenciaUbi ? 'bg-red-400' : ''} pl-4`}>
                            {latitud}
                            {longitud}
                          </span>
                        </p>
                        <span>/</span>
                        <p >{metricas.country} - {metricas.department}  </p>
                      </div>
                    </>
                </div>
              </div>

              <div className="flex w-full justify-end gap-3 rounded-md text-black mt-5">
                <Link
                  to="/admin/lista-clientes"
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
