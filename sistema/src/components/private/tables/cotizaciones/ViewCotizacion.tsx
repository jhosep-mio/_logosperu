import { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import { SchemaCotizacion } from '../../../shared/schemas/Schemas'
import { Global } from '../../../../helper/Global'
import useAuth from '../../../../hooks/useAuth'
import { Loading } from '../../../shared/Loading'
import Editor from './Editor'

export const ViewCotizacion = (): JSX.Element => {
  const { id } = useParams()
  const { setTitle } = useAuth()
  const [context, setContext] = useState('')
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(true)

  const saveCotizacion = async (): Promise<void> => {
  }

  const getCotizacion = async (): Promise<void> => {
    try {
      const request = await axios.get(
        `${Global.url}/getOneCotizacion/${id ?? ''}`,
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
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        nombre_cliente: `${request.data.nombres} ${request.data.apellidos}`,
        id_cliente: request.data.id_cliente,
        nombre_empresa: request.data.empresa,
        precio: request.data.precio,
        descuento: request.data.descuento,
        correlativo: request.data.correlativo,
        pdf: request.data.pdf
      })

      if (request.data.descripcion) {
        setContext(JSON.parse(request.data.descripcion))
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
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
      id_cliente: '',
      nombre_cliente: '',
      nombre_empresa: '',
      precio: '',
      descuento: '0',
      correlativo: '',
      pdf: ''
    },
    validationSchema: SchemaCotizacion,
    onSubmit: saveCotizacion
  })

  useEffect(() => {
    if (errors && isSubmitting) {
      const firstErrorKey = Object.keys(errors)[0]
      const firstErrorElement = document.getElementsByName(firstErrorKey)[0]
      if (firstErrorElement) {
        firstErrorElement.focus()
      }
    }
  }, [touched, errors, isSubmitting])

  const calcularTotal = (): string | number => {
    const precioNumerico = parseFloat(values.precio)
    const descuentoPorcentaje = parseFloat(values.descuento)
    // Verificar que ambos valores sean números válidos
    if (!isNaN(precioNumerico) && !isNaN(descuentoPorcentaje)) {
      // Convertir el porcentaje a un decimal
      const descuentoDecimal = descuentoPorcentaje / 100
      // Calcular el descuento
      const descuentoCalculado = precioNumerico * descuentoDecimal
      // Restar el descuento al precio original para obtener el total
      return precioNumerico - descuentoCalculado
    }
    // En caso de que no se puedan calcular los valores
    return '---'
  }

  useEffect(() => {
    setTitle('VER COTIZACIÓN')
    getCotizacion()
  }, [])

  const total = calcularTotal()

  return (
    <>
      {loading
        ? <Loading />
        : (
        <form className="w-full" onSubmit={handleSubmit}>
          <section className="w-full grid grid-cols-1 lg:grid-cols-3 mt-4 gap-x-4 gap-y-2 text-black">
            <div className="grid gap-2 w-full">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="email"
              >
                Correlativo
              </label>
              <input
                className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                placeholder="Correlativo"
                type="text"
                name="correlativo"
                value={values.correlativo}
                disabled
              />
            </div>
            <div className="grid gap-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="email"
              >
                Cliente
              </label>
              <input
                className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                placeholder="Nombre del cliente"
                type="text"
                disabled
                value={values.nombre_cliente}
              />
            </div>
            <div className="grid gap-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="email"
              >
                Empresa
              </label>
              <input
                className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed "
                placeholder="Nombre de empresa"
                type="text"
                disabled
                value={values.nombre_empresa}
              />
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Precio
                </label>
                <input
                  className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed "
                  placeholder="Precio"
                  name="precio"
                  disabled
                  type="text"
                  value={values.precio}
                />
              </div>
              <div className="relative">
                <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                  Descuento
                </label>
                <input
                  className="flex h-9 w-full rounded-md border border-input border-red-400 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed "
                  placeholder="Descuento"
                  name="descuento"
                  type="text"
                  value={values.descuento}
                  disabled
                />
              </div>
            </div>
            <div className="flex gap-3 items-end">
              <label className="text-sm font-bold h-9 flex items-center mt-1 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Total
              </label>
              <input
                className="flex h-9 w-full rounded-md   py-1 text-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium focus-visible:outline-none  disabled:cursor-not-allowed "
                placeholder="Precio"
                disabled
                name="precio"
                type="text"
                value={`S/. ${total}`}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div>
          </section>
          <section className="mt-4 jodect_editor_cotizacion text-black">
          {/* <div
                className='bg-white w-full rounded-md'
                dangerouslySetInnerHTML={{ __html: context }}
                ></div> */}
            <Editor content={context} setContent={setContext} />
          </section>
          <section className="w-full grid grid-cols-1 justify-center mt-4 gap-x-4 gap-y-4 items-end">
            <div className="flex justify-start gap-4">
              <Link
                to="/admin/lista-cotizaciones"
                className="bg-red-600 px-3 py-2 rounded-md text-white cursor-pointer"
              >
                Regresar
              </Link>
            </div>
          </section>

          <iframe
            src={`${Global.urlImages}/cotizaciones/${values.pdf}.pdf`}
            title="PDF Viewer"
            className="w-full h-[700px] border-none mt-10"
          />
        </form>
          )}
    </>
  )
}
