/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import Swal from 'sweetalert2'
import { Loading } from '../../../shared/Loading'
import { useFormik } from 'formik'
import { TitleBriefs } from '../../../shared/TitleBriefs'
// import { InputsBriefs } from '../../../shared/InputsBriefs'
import { Errors } from '../../../shared/Errors'
import { type valuesTransaccionlist } from '../../../shared/schemas/Interfaces'
import { SchemaTransacciones } from '../../../shared/schemas/Schemas'

export const EditarTransaccion = (): JSX.Element => {
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const { setTitle } = useAuth()
  const [loadingComponents, setLoadingComponents] = useState(true)

  const updateTransaccion = async (
    values: valuesTransaccionlist
  ): Promise<void> => {
    setLoadingComponents(true)
    const token = localStorage.getItem('token')
    try {
      const { data } = await axios.post(
        `${Global.url}/checkout/update/${id ?? ''}`,
        { estado: String(values.estado) },
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      if (data.message) {
        Swal.fire('Actualizado correctamente', '', 'success')
        navigate('/admin/transacciones-list')
      }
    } catch (error) {
      console.log(error)
      Swal.fire('Error', '', 'error')
    } finally {
      setLoadingComponents(false)
    }
  }

  const getTransacciones = async (): Promise<void> => {
    try {
      const { data } = await axios.get(
        `${Global.url}/checkout/find/${id ?? ''}`,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? `${token}` : ''
            }`
          }
        }
      )
      console.log(data.message)
      setValues({
        ...values,
        paymentId: data.message.paymentId,
        formulario: JSON.parse(data.message.detalle_form),
        tarjeta: JSON.parse(data.message.detalle_tarjeta),
        status: data.message.status,
        estado: data.message.estado,
        comprador: JSON.parse(data.message.detalle_comprador),
        transactionAmount: data.message.transactionAmount
      })
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingComponents(false)
    }
  }

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    touched,
    handleBlur,
    setValues
  } = useFormik({
    initialValues: {
      id: 0,
      paymentId: '0',
      formulario: {
        nombres: '',
        apellidos: '',
        email: '',
        celular: '',
        mensaje: '',
        cart: [],
        igv: ''
      },
      comprador: {
        email: '',
        identificationNumber: '',
        identificationType: ''
      },
      tarjeta: {
        cardholderName: '',
        cardCountry: '',
        firstSixDigits: '',
        dateCreated: ''
      },
      status: '',
      estado: 0,
      transactionAmount: ''
    },
    validationSchema: SchemaTransacciones,
    onSubmit: updateTransaccion
  })

  useEffect(() => {
    setTitle('Transsación')
    getTransacciones()
  }, [])

  const formatearDatos = (data: any): any => {
    const date = new Date(data)
    const formattedDate = date.toISOString().split('T')[0]
    const time = date.toTimeString().split(' ')[0]
    return {
      date: formattedDate,
      time
    }
  }

  return (
    <>
      {loadingComponents ? (
        <Loading />
      ) : (
        <form className="" onSubmit={handleSubmit}>
          <div className="bg-secondary-100 p-8 rounded-xl mt-4">
            <h2 className="text-white text-lg lg:text-2xl font-bold mb-10 text-left w-full">
              DATOS DEL FORMULARIO
            </h2>
            <div className="w-full lg:relative mb-5 flex flex-col lg:flex-row justify-between gap-2">
              <div className="w-full lg:w-1/3">
                <TitleBriefs titulo="Nombres" />
                <input
                  disabled
                  className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                  name="nombres"
                  type="text"
                  value={values.formulario?.nombres}
                />
              </div>
              <div className="w-full lg:w-1/3">
                <TitleBriefs titulo="Apellidos" />
                <input
                  disabled
                  className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                  name="apellidos"
                  type="text"
                  value={values.formulario?.apellidos}
                />
              </div>
              <div className="w-full lg:w-1/3">
                <TitleBriefs titulo="Email" />
                <input
                  disabled
                  className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                  name="email"
                  type="text"
                  value={values.formulario?.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>

            <div className="w-full lg:relative mb-5 flex flex-col lg:flex-row justify-between gap-2">
              <div className="w-full lg:w-1/3">
                <TitleBriefs titulo="Celular" />
                <input
                  disabled
                  className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                  name="celular"
                  type="text"
                  value={values.formulario?.celular}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div className="w-full lg:w-2/3">
                <TitleBriefs titulo="ESTADO DE ATENCION" />
                <select
                  className={`border border-black  placeholder-gray-400 outline-none focus:outline-none
                focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                rounded-md transition-all ${
                  values.estado == 0
                    ? 'text-green-400'
                    : values.estado == 1
                    ? 'text-main'
                    : ''
                }`}
                  name="estado"
                  value={values.estado}
                  autoComplete="off"
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  <option value="0" className="text-green-400">
                    PENDIENTE
                  </option>
                  <option value="1" className="text-main">
                    TERMINADO
                  </option>
                </select>
                <Errors errors={errors.estado} touched={touched.estado} />
              </div>
            </div>

            <div className="w-full lg:relative mb-5 flex flex-col lg:flex-row justify-between gap-2">
              <div className="w-full">
                <TitleBriefs titulo="Comentario" />
                <input
                  disabled
                  className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                  name="comentario"
                  type="text"
                  value={values.formulario?.mensaje}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>
          </div>

          <div className="bg-secondary-100 p-8 rounded-xl mt-10">
            <h2 className="text-white text-lg lg:text-2xl font-bold w-full text-left">
              DATOS DE LA TRANSACCIÓN
            </h2>
            <div className="w-full lg:relative mb-5 flex flex-col lg:flex-row justify-between gap-2 mt-10">
              <div className="w-full lg:w-1/3">
                <TitleBriefs titulo="Nombres" />
                <input
                  disabled
                  className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                  name="nombres"
                  type="text"
                  value={values.tarjeta?.cardholderName}
                />
              </div>
              <div className="w-full lg:w-1/3">
                <TitleBriefs titulo="Pais" />
                <input
                  disabled
                  className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                  name="apellidos"
                  type="text"
                  value={values.tarjeta?.cardCountry}
                />
              </div>
              <div className="w-full lg:w-1/3">
                <TitleBriefs titulo="6 digitos de tarjeta" />
                <input
                  disabled
                  className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                  name="email"
                  type="text"
                  value={values.tarjeta?.firstSixDigits}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              <div className="w-full lg:w-1/3">
                <TitleBriefs titulo="Creacion del pago" />
                <input
                  disabled
                  className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                  name="email"
                  type="text"
                  value={`${
                    formatearDatos(values.tarjeta?.dateCreated).date
                  } - ${formatearDatos(values.tarjeta?.dateCreated).time}`}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>
            <div className="w-full lg:relative mb-5 flex flex-col lg:flex-row justify-between gap-2 mt-4">
              <div className="w-full lg:w-1/3">
                <TitleBriefs titulo="Email" />
                <input
                  disabled
                  className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                  name="email"
                  type="text"
                  value={values.comprador?.email}
                />
              </div>
              <div className="w-full lg:w-1/3">
                <TitleBriefs titulo="Tipo de documento" />
                <input
                  disabled
                  className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                  name="nombres"
                  type="text"
                  value={values.comprador?.identificationType}
                />
              </div>
              <div className="w-full lg:w-1/3">
                <TitleBriefs titulo="Documento" />
                <input
                  disabled
                  className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                  name="apellidos"
                  type="text"
                  value={values.comprador?.identificationNumber}
                />
              </div>
              <div className="w-1/3">
                <TitleBriefs titulo="6 digitos de tarjeta" />
                <input
                  disabled
                  className="border border-black  placeholder-gray-400 outline-none focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-secondary-900
                                                      rounded-md transition-all"
                  name="email"
                  type="text"
                  value={values.tarjeta?.firstSixDigits}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
            </div>
          </div>

          <div className="bg-secondary-100 p-8 rounded-xl mt-10">
            <h2 className="text-white text-2xl font-bold text-left w-full">
              LISTADO DE COMRPAS
            </h2>
            <div className="hidden md:grid grid-cols-1 md:grid-cols-5 gap-4 mb-2 p-4">
              <h5 className="md:text-center">ID producto</h5>
              <h5 className="md:text-center">Nombre</h5>
              <h5 className="md:text-center">Cantidad</h5>
              <h5 className="md:text-center">Precio U</h5>
              <h5 className="md:text-center">Subtotal</h5>
            </div>
            {values.formulario?.cart &&
              // @ts-expect-error
              JSON.parse(values.formulario?.cart).map((pro: any) => (
                <div
                  className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center mb-4 bg-secondary-900 p-4 rounded-xl"
                  key={pro.id}
                >
                  <div className="md:text-center">
                    <h5 className="md:hidden text-white font-bold mb-2">
                      ID producto
                    </h5>
                    <span>{pro.id}</span>
                  </div>
                  <div className="md:text-center">
                    <h5 className="md:hidden text-white font-bold mb-2">
                      Nombre
                    </h5>
                    <span>{pro.nombre}</span>
                  </div>
                  <div className="md:text-center">
                    <h5 className="md:hidden text-white font-bold mb-2">
                      Cantidad
                    </h5>
                    <span>{pro.cantidad}</span>
                  </div>
                  <div className="md:text-center">
                    <h5 className="md:hidden text-white font-bold mb-2">
                      Precio
                    </h5>
                    <span>S./ {pro.precio}</span>
                  </div>
                  <div className="md:text-center">
                    <h5 className="md:hidden text-white font-bold mb-2">
                      Subtotal
                    </h5>
                    <span>
                      S./ {(parseFloat(pro.precio) * pro.cantidad).toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            <div className="w-full lg:relative mb-5 flex flex-col  justify-between gap-2 lg:gap-4">
              {values.formulario?.igv &&
                Number(values.formulario?.igv) > 0 && (
                  <div className="flex flex-col w-full lg:w-1/2">
                    <div className="flex w-96">
                      <strong className="w-full lg:w-1/2">igv :</strong>
                      <p className="w-full lg:w-1/2">
                        S./ {values.formulario?.igv}
                      </p>
                    </div>
                  </div>
              )}
              <div className="flex flex-col w-full lg:w-1/2">
                <div className="flex w-96">
                  <strong className="w-full lg:w-1/2">Pago final :</strong>
                  <p className="w-full lg:w-1/2">
                    S./ {Number(values.transactionAmount) + Number(values.formulario?.igv)}
                  </p>
                </div>
              </div>
              <div className="w-full lg:w-1/2 flex items-center justify-left text-gray-500 text-sm">
                <strong>
                  Verificar el pago final con el monto abonado en mercado pago,
                  puede indentificarlo con el ID de la transaccion
                </strong>
              </div>
            </div>
          </div>

          <div className="flex gap-2 w-full justify-end mt-4">
            <Link
              to="/admin/transacciones-list"
              className="bg-red-500 px-4 py-2 rounded-md text-white"
            >
              Cancelar
            </Link>
            {/* <input
              type="submit"
              className="bg-green-500 text-black hover:bg-green-600 flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
              value="GRABAR"
            /> */}
          </div>
        </form>
      )}
    </>
  )
}
