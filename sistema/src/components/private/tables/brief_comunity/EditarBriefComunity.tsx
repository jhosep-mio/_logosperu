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
import { type valuesComunity } from '../../../shared/schemas/Interfaces'
import { SchemaBriefComunity } from '../../../shared/schemas/Schemas'
import { logo } from '../../../shared/Images'
import { ListaClientes } from '../../../shared/modals/ListaClientes'

export const EditarBriefComunity = (): JSX.Element => {
  const { setTitle } = useAuth()
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  const [open, setOpen] = useState(false)

  const handleClickOpen = (): void => {
    setOpen(true)
  }

  const handleClose = (): void => {
    setOpen(false)
  }

  const saveBrief = async (values: valuesComunity): Promise<void> => {
    setLoading(true)
    const token = localStorage.getItem('token')

    const data = new FormData()
    data.append('id_venta', values.id_venta)
    data.append('nombre_comercial', values.nombre_comercial)
    data.append('historia_empresa', values.historia_empresa)
    data.append('competidores', values.competidores)
    data.append('propuesta_valor', values.propuesta_valor)
    data.append('objetivos_especificos', values.objetivos_especificos)
    data.append('clientes_ideales', values.clientes_ideales)
    data.append('propuesta_producto', values.propuesta_producto)
    data.append('preferencia_canal', values.preferencia_canal)
    data.append('presupuesto', values.presupuesto)
    data.append('link_recursos', values.link_recursos)
    data.append('fechas_importantes', values.fechas_importantes)
    data.append('directrises_marca', values.directrises_marca)
    data.append('elementos_visuales', values.elementos_visuales)
    data.append('restricciones_legales', values.restricciones_legales)
    data.append('factores_consideracion', values.factores_consideracion)
    data.append('_method', 'PUT')

    try {
      const respuesta = await axios.post(
        `${Global.url}/updateBriefComunity/${id ?? ''}`,
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
        navigate('/admin/lista-briefs-comunity')
      } else {
        Swal.fire('Error', '', 'error')
      }
    } catch (error) {
      Swal.fire('Error', '', 'error')
      // console.log(error.request.response);
    }
    setLoading(false)
  }

  const getFlyer = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/oneBriefComunity/${id ?? ''}`, {
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
      id_venta: request.data[0].id_venta,
      id_contrato: request.data[0].id_contrato,
      id_cliente: request.data[0].id_cliente,
      nombre_comercial: request.data[0].nombre_comercial,
      historia_empresa: request.data[0].historia_empresa,
      competidores: request.data[0].competidores,
      propuesta_valor: request.data[0].propuesta_valor,
      objetivos_especificos: request.data[0].objetivos_especificos,
      clientes_ideales: request.data[0].clientes_ideales,
      propuesta_producto: request.data[0].propuesta_producto,
      preferencia_canal: request.data[0].preferencia_canal,
      presupuesto: request.data[0].presupuesto,
      link_recursos: request.data[0].link_recursos,
      fechas_importantes: request.data[0].fechas_importantes,
      directrises_marca: request.data[0].directrises_marca,
      elementos_visuales: request.data[0].elementos_visuales,
      restricciones_legales: request.data[0].restricciones_legales,
      factores_consideracion: request.data[0].factores_consideracion
    })

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
      nombres: '',
      id_venta: '',
      nombre_comercial: '',
      historia_empresa: '',
      competidores: '',
      propuesta_valor: '',
      objetivos_especificos: '',
      clientes_ideales: '',
      propuesta_producto: '',
      preferencia_canal: '',
      presupuesto: '',
      link_recursos: '',
      fechas_importantes: '',
      directrises_marca: '',
      elementos_visuales: '',
      restricciones_legales: '',
      factores_consideracion: '',
      id_contrato: '',
      id_cliente: ''
    },
    validationSchema: SchemaBriefComunity,
    onSubmit: saveBrief
  })

  useEffect(() => {
    setTitle('EDITAR BRIEF DE COMMUNITY')
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
                    <div className="w-full relative">
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

                    <div className="w-full relative">
                      <TitleBriefs titulo="2. ¿Cuál es la historia de su empresa?" />
                      <textarea
                        className="border placeholder-gray-400 focus:outline-none
                                            focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                            border-gray-300 rounded-md resize-none"
                        name="historia_empresa"
                        rows={5}
                        value={values.historia_empresa}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Errors
                        errors={errors.historia_empresa}
                        touched={touched.historia_empresa}
                      />
                    </div>

                    <div className="w-full relative">
                      <TitleBriefs titulo=" 3. Cuales son los principales competidores de su empresa" />
                      <InputsBriefs
                        name="competidores"
                        type="text"
                        value={values.competidores}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={false}
                      />
                      <Errors
                        errors={errors.competidores}
                        touched={touched.competidores}
                      />
                    </div>

                    <div className="w-full relative">
                      <p
                        className="bg-white pt-0 pr-2 pb-0 lg:pl-2 -mt-3 mr-0 mb-0 ml-1 lg:ml-2 font-medium text-gray-600
                                            lg:absolute"
                      >
                        4 ¿Cuál es la propuesta de valor única de la empresa?
                      </p>
                      <textarea
                        className="border placeholder-gray-400 focus:outline-none
                                            focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                            border-gray-300 rounded-md resize-none"
                        name="propuesta_valor"
                        rows={5}
                        value={values.propuesta_valor}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Errors
                        errors={errors.propuesta_valor}
                        touched={touched.propuesta_valor}
                      />
                    </div>

                    <label className="bg-secondary-150 px-4 text-white py-2 w-fit rounded-t-md mb-5">
                      Objetivos de marketing
                    </label>

                    <div className="w-full relative">
                      <p
                        className="bg-white pt-0 pr-2 pb-0 lg:pl-2 -mt-3 mr-0 mb-0 ml-1 lg:ml-2 font-medium text-gray-600
                                            lg:absolute"
                      >
                        5 ¿Cuál son los objetivos especificos de marketing para
                        este proyecto?
                      </p>
                      <textarea
                        className="border placeholder-gray-400 focus:outline-none
                                            focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                            border-gray-300 rounded-md resize-none"
                        name="objetivos_especificos"
                        rows={5}
                        value={values.objetivos_especificos}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Errors
                        errors={errors.objetivos_especificos}
                        touched={touched.objetivos_especificos}
                      />
                    </div>

                    <label className="bg-secondary-150 px-4 text-white py-2 w-fit rounded-t-md mb-5">
                      AUDIENCIA OBJETIVO
                    </label>

                    <div className="w-full relative">
                      <p
                        className="bg-white pt-0 pr-2 pb-0 lg:pl-2 -mt-3 mr-0 mb-0 ml-1 lg:ml-2 font-medium text-gray-600
                                            lg:absolute"
                      >
                        6 ¿Quiénes son los clientes ideales para este producto o
                        servicio? (Describir edad, genero, ubicación, intereses,
                        comportamiento de compra)
                      </p>
                      <textarea
                        className="border placeholder-gray-400 focus:outline-none
                                            focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                            border-gray-300 rounded-md resize-none"
                        name="clientes_ideales"
                        rows={5}
                        value={values.clientes_ideales}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Errors
                        errors={errors.clientes_ideales}
                        touched={touched.clientes_ideales}
                      />
                    </div>

                    <label className="bg-secondary-150 px-4 text-white py-2 w-fit rounded-t-md mb-5">
                      MENSAJE CLAVE Y PROPUESTA DE VALOR:
                    </label>

                    <div className="w-full relative">
                      <p
                        className="bg-white pt-0 pr-2 pb-0 lg:pl-2 -mt-3 mr-0 mb-0 ml-1 lg:ml-2 font-medium text-gray-600
                                            lg:absolute"
                      >
                        7. ¿Cuál es la propuesta de valor que hace que el
                        producto o servicio sea único o valioso para la
                        audiencia?
                      </p>
                      <textarea
                        className="border placeholder-gray-400 focus:outline-none
                                            focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                            border-gray-300 rounded-md resize-none"
                        name="propuesta_producto"
                        rows={5}
                        value={values.propuesta_producto}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Errors
                        errors={errors.propuesta_producto}
                        touched={touched.propuesta_producto}
                      />
                    </div>

                    <label className="bg-secondary-150 px-4 text-white py-2 w-fit rounded-t-md mb-5">
                      CANAL Y PLATAFORMA DE MARKETING:
                    </label>

                    <div className="w-full relative">
                      <p
                        className="bg-white pt-0 pr-2 pb-0 lg:pl-2 -mt-3 mr-0 mb-0 ml-1 lg:ml-2 font-medium text-gray-600
                                            lg:absolute"
                      >
                        8. ¿Existe una preferencia por un canal o plataforma en
                        particular?
                      </p>
                      <InputsBriefs
                        name="preferencia_canal"
                        type="text"
                        value={values.preferencia_canal}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={false}
                      />
                      <Errors
                        errors={errors.preferencia_canal}
                        touched={touched.preferencia_canal}
                      />
                    </div>

                    <label className="bg-secondary-150 px-4 text-white py-2 w-fit rounded-t-md mb-5">
                      PRESUPUESTO Y RECURSOS:
                    </label>

                    <div className="w-full relative">
                      <p
                        className="bg-white pt-0 pr-2 pb-0 lg:pl-2 -mt-3 mr-0 mb-0 ml-1 lg:ml-2 font-medium text-gray-600
                                            lg:absolute"
                      >
                        9. ¿Cuál es el presupuesto asignado para este proyecto
                        de marketing? (plan cobre, plan silver, plan Golden)
                      </p>
                      <InputsBriefs
                        name="presupuesto"
                        type="text"
                        value={values.presupuesto}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={false}
                      />
                      <Errors
                        errors={errors.presupuesto}
                        touched={touched.presupuesto}
                      />
                    </div>

                    <div className="w-full relative">
                      <p
                        className="bg-white pt-0 pr-2 pb-0 lg:pl-2 -mt-3 mr-0 mb-0 ml-1 lg:ml-2 font-medium text-gray-600
                                            lg:absolute"
                      >
                        10. ¿Qué recursos, como imágenes o videos cuenta para
                        hacer uso de dicho material? (Incluir enlace de Google
                        Drive)
                      </p>
                      <InputsBriefs
                        name="link_recursos"
                        type="text"
                        value={values.link_recursos}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={false}
                      />
                      <Errors
                        errors={errors.link_recursos}
                        touched={touched.link_recursos}
                      />
                    </div>

                    <label className="bg-secondary-150 px-4 text-white py-2 w-fit rounded-t-md mb-5">
                      CRONOGRAMA:
                    </label>

                    <div className="w-full relative">
                      <p
                        className="bg-white pt-0 pr-2 pb-0 lg:pl-2 -mt-3 mr-0 mb-0 ml-1 lg:ml-2 font-medium text-gray-600
                                            lg:absolute"
                      >
                        11. ¿Existen fechas importantes o eventos relacionados
                        con la empresa que deban considerarse?
                      </p>
                      <InputsBriefs
                        name="fechas_importantes"
                        type="text"
                        value={values.fechas_importantes}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={false}
                      />
                      <Errors
                        errors={errors.fechas_importantes}
                        touched={touched.fechas_importantes}
                      />
                    </div>

                    <label className="bg-secondary-150 px-4 text-white py-2 w-fit rounded-t-md mb-5">
                      BRANDING Y GUÍA DE ESTILO:
                    </label>

                    <div className="w-full relative">
                      <p
                        className="bg-white pt-0 pr-2 pb-0 lg:pl-2 -mt-3 mr-0 mb-0 ml-1 lg:ml-2 font-medium text-gray-600
                                            lg:absolute"
                      >
                        12. ¿Existen directrices de marca o una guía de estilo
                        que deban seguirse
                      </p>
                      <InputsBriefs
                        name="directrises_marca"
                        type="text"
                        value={values.directrises_marca}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={false}
                      />
                      <Errors
                        errors={errors.directrises_marca}
                        touched={touched.directrises_marca}
                      />
                    </div>

                    <div className="w-full relative">
                      <p
                        className="bg-white pt-0 pr-2 pb-0 lg:pl-2 -mt-3 mr-0 mb-0 ml-1 lg:ml-2 font-medium text-gray-600
                                            lg:absolute"
                      >
                        13. ¿Hay elementos visuales o de diseño que deban
                        incluirse en la estrategia?
                      </p>
                      <InputsBriefs
                        name="elementos_visuales"
                        type="text"
                        value={values.elementos_visuales}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={false}
                      />
                      <Errors
                        errors={errors.elementos_visuales}
                        touched={touched.elementos_visuales}
                      />
                    </div>

                    <label className="bg-secondary-150 px-4 text-white py-2 w-fit rounded-t-md mb-5">
                      RESTRICCIONES O CONSIDERACIONES ESPECIALES:
                    </label>

                    <div className="w-full relative">
                      <p
                        className="bg-white pt-0 pr-2 pb-0 lg:pl-2 -mt-3 mr-0 mb-0 ml-1 lg:ml-2 font-medium text-gray-600
                                            lg:absolute"
                      >
                        14. ¿Existen restricciones legales o regulatorias que
                        deban tenerse en cuenta?
                      </p>
                      <InputsBriefs
                        name="restricciones_legales"
                        type="text"
                        value={values.restricciones_legales}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={false}
                      />
                      <Errors
                        errors={errors.restricciones_legales}
                        touched={touched.restricciones_legales}
                      />
                    </div>

                    <div className="w-full relative">
                      <p
                        className="bg-white pt-0 pr-2 pb-0 lg:pl-2 -mt-3 mr-0 mb-0 ml-1 lg:ml-2 font-medium text-gray-600
                                            lg:absolute"
                      >
                        15. ¿Hay algún otro factor o consideración importante
                        que deba mencionarse?
                      </p>
                      <InputsBriefs
                        name="factores_consideracion"
                        type="text"
                        value={values.factores_consideracion}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={false}
                      />
                      <Errors
                        errors={errors.factores_consideracion}
                        touched={touched.factores_consideracion}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-full justify-end gap-3 rounded-md text-black mt-5">
                <Link
                  to="/admin/lista-briefs-comunity"
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
