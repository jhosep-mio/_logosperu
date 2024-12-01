/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import { toast } from 'sonner'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import { SchemaCotizacion } from '../../../shared/schemas/Schemas'
import { Errors } from '../../../shared/Errors'
import { Global } from '../../../../helper/Global'
import useAuth from '../../../../hooks/useAuth'
import { Loading } from '../../../shared/Loading'
import { convertirNumeroALetras } from '../../../shared/functions/GenerarTextoEnLetras'
import { Errors2 } from '../../../shared/Errors2'
import { type arrayAdicionales } from '../../../shared/schemas/Interfaces'
import { Chip } from '@mui/material'

export const ViewContrato = (): JSX.Element => {
  const { id } = useParams()
  const { setTitle } = useAuth()
  const [formaPago, setFormaPago] = useState('')
  const [contenido, setContenido] = useState('')
  const token = localStorage.getItem('token')
  const [, seLoadingValidation] = useState(false)
  const [loading, setLoading] = useState(true)
  const [pdfUrl, setPdfUrl] = useState('')
  const [arrayAdicionales, setArrayAdicionales] = useState<
  arrayAdicionales[] | null
  >(null)

  const formatearContrato = (cadena: string): string => {
    const partes = cadena.split('_')
    return partes[0]
  }

  const formatearContrato2 = (cadena: string): string => {
    const numeros = cadena.match(/\d+/g)

    if (numeros && numeros.length >= 2) {
      const numero1 = numeros[0]
      const numero2 = numeros[1]
      const textoFormateado = `${numero1} - ${numero2}`
      return textoFormateado
    } else {
      return cadena
    }
  }

  const getCotizacion = async (): Promise<void> => {
    try {
      const request = await axios.get(
        `${Global.url}/getOneContrato/${id ?? ''}`,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? `Bearer ${token}` : ''
            }`
          }
        }
      )

      const request2 = await axios.get(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `${Global.url}/showToContrato/${formatearContrato(
          request.data.correlativo
        )}`,
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
        nombre_empresa: request.data.empresa,
        precio: request.data.precio,
        correlativo: request.data.correlativo,
        dni_cliente: request.data.dni_cliente,
        medio_ingreso: request.data.medio_ingreso,
        tipo_documento: request.data.tipo_documento,
        fecha: request.data.fecha,
        tiempo: request.data.tiempo,
        sexo: request.data.sexo,
        titulo_contrato: request2.data[0].titulo,
        servicio: request2.data[0].servicio,
        primero: request2.data[0].primero
      })

      if (request.data.forma_pago) {
        setFormaPago(request.data.forma_pago)
      }
      if (request.data.contenido) {
        setContenido(request.data.contenido)
      }
      if (request.data.adicionales) {
        setArrayAdicionales(JSON.parse(request.data.adicionales))
      }
      if (request.data.pdf) {
        setPdfUrl(request.data.pdf)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const SaveContrato = async (): Promise<void> => {
    if (contenido) {
      seLoadingValidation(true)
      const data = new FormData()
      data.append('correlativo', values?.correlativo)
      data.append('medio_ingreso', values?.medio_ingreso)
      data.append('nombres_cliente', values?.nombre_cliente)
      data.append('titulo_contrato', values.titulo_contrato)
      data.append('id_contrato', values?.correlativo)
      data.append('tipo_documento', values.tipo_documento)
      //   data.append('dni_ruc', values.tipo_documento)
      if (values.tipo_documento == 'DNI') {
        data.append(
          'sexo',
          values.sexo == 'hombre'
            ? 'Sr.'
            : values.sexo == 'mujer'
              ? 'la Sra.'
              : ''
        )
      } else {
        data.append(
          'sexo',
          values.sexo == 'hombre' ? '' : values.sexo == 'mujer' ? '' : ''
        )
      }
      data.append('dni_cliente', values.dni_cliente)
      data.append('codigo', formatearContrato2(values?.correlativo))
      data.append('codigo1', formatearContrato(values?.correlativo))
      data.append('servicio', values.servicio)
      data.append('forma_pago', formaPago)
      if (typeof values.precio == 'number') {
        data.append('precio', Number(values.precio).toFixed(2))
      } else {
        data.append('precio', values.precio)
      }
      data.append('fecha', values.fecha)
      data.append(
        'preciotexto',
        convertirNumeroALetras(Number(values.precio)).toLowerCase()
      )
      data.append('tiempo', values.tiempo)
      data.append('primero', values.primero)
      data.append('contenido', contenido)
      data.append('_method', 'PUT')
      try {
        const response = await axios.post(
          `${Global.url}/updateContrato/${id ?? ''}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${
                token !== null && token !== '' ? token : ''
              }`
            }
          }
        )
        if (response.data.status == 'success') {
          toast.success('Contrato generado correctamente')
        } else {
          toast.error('Error al generar contrato')
        }
      } catch (error: unknown) {
        if (
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          error.request.response.includes(
            `Duplicate entry '${values?.correlativo}' for key 'contratos.correlativo'`
          )
        ) {
          toast.error('Contrato duplicado')
        } else {
          console.log(error)
          toast.error('Error al generar contrato')
        }
      } finally {
        seLoadingValidation(false)
      }
    } else {
      toast.warning('Por favor coloque el contenido')
    }
  }

  const {
    handleSubmit,
    errors,
    values,
    touched,
    isSubmitting,
    setValues
  } = useFormik({
    initialValues: {
      correlativo: '',
      nombre_cliente: '',
      nombre_empresa: '',
      medio_ingreso: '',
      precio: '',
      dni_cliente: '',
      tipo_documento: '',
      fecha: '',
      tiempo: '',
      titulo_contrato: '',
      servicio: '',
      primero: '',
      sexo: ''
    },
    validationSchema: SchemaCotizacion,
    onSubmit: SaveContrato
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

  useEffect(() => {
    setTitle('VER CONTRATO')
    getCotizacion()
  }, [])

  return (
    <>
      {loading
        ? <Loading />
        : (
        <form className="w-full" onSubmit={handleSubmit}>
          <section className="w-full grid grid-cols-1 lg:grid-cols-4 mt-4 gap-x-4 gap-y-2 text-black">
            <div className="grid gap-2 w-full">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                htmlFor="email"
              >
                Correlativo
              </label>
              <input
                className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-white disabled:bg-gray-100 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                placeholder="Correlativo"
                type="text"
                name="correlativo"
                value={values.correlativo}
                disabled
              />
            </div>
            <div className="grid gap-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                htmlFor="email"
              >
                Cliente
              </label>
              <input
                className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-white disabled:bg-gray-100 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                placeholder="Nombre del cliente"
                type="text"
                disabled
                value={values.nombre_cliente}
              />
            </div>
            <div className="grid gap-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                htmlFor="email"
              >
                Empresa
              </label>
              <input
                className="flex h-9 w-full rounded-md border border-input border-gray-400  bg-white disabled:bg-gray-100 px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed "
                placeholder="Nombre de empresa"
                type="text"
                disabled
                value={values.nombre_empresa}
              />
            </div>
            <div className="grid gap-2">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                htmlFor="email"
              >
                Medio de ingreso
              </label>
              <select
                className="flex h-9 w-full rounded-md border border-input border-gray-400  bg-white px-3 disabled:bg-gray-100 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed "
                name="medio_ingreso"
                value={values.medio_ingreso}
                disabled
              >
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
            </div>
          </section>
          <div className="w-full flex flex-col lg:flex-row gap-3 lg:gap-5 mt-3 ">
            <div className=" w-full relative">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black">
                Precio
              </label>
              <input
                className="flex h-9 w-full rounded-md border border-input border-gray-400 text-black bg-white px-3 disabled:bg-gray-100 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed "
                placeholder="Precio"
                name="precio"
                type="text"
                value={values.precio}
                disabled
              />
              <Errors errors={errors.precio} touched={touched.precio} />
            </div>
            <div className="w-full lg:relative pb-5">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                htmlFor="email"
              >
                Tipo de documento
              </label>
              <select
                className="flex h-9 w-full rounded-md border border-input border-gray-400  bg-white px-3 disabled:bg-gray-100 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed text-black"
                name="tipo_documento"
                value={values.tipo_documento}
                disabled
              >
                {/* FB GOOGLE, VENTAS, POST VENTA, RECOMENDACION, ISNTAGRAM) */}
                <option value="">Seleccionar</option>
                <option value="DNI">DNI</option>
                <option value="RUC">RUC</option>
              </select>
              <Errors2
                errors={errors.tipo_documento}
                touched={touched.tipo_documento}
              />
            </div>
            <div className="w-full  lg:relative pb-5">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                htmlFor="email"
              >
                DNI/RUC del cliente
              </label>
              <input
                className="flex h-9 w-full rounded-md border border-input border-gray-400  bg-white px-3 disabled:bg-gray-100 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed text-black"
                name="dni_cliente"
                type="number"
                value={values.dni_cliente}
                disabled
              />
              <Errors2
                errors={errors.dni_cliente}
                touched={touched.dni_cliente}
              />
            </div>
            <div className="w-full lg:relative pb-5">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                htmlFor="email"
              >
                Fecha de creacion
              </label>
              <input
                className="flex h-9 w-full rounded-md border border-input border-gray-400  bg-white px-3 disabled:bg-gray-100 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed text-black"
                name="fecha"
                type="text"
                value={values.fecha}
                disabled
              />
              <Errors2 errors={errors.fecha} touched={touched.fecha} />
            </div>
          </div>
          <div className="w-full flex flex-col lg:flex-row gap-3 lg:gap-5 mt-3 lg:mt-0 items-center">
            <div className="w-fit lg:relative pb-5">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
                htmlFor="email"
              >
                Tiempo estimado
              </label>
              <input
                className="flex h-9 w-full rounded-md border border-input border-gray-400  bg-white px-3 disabled:bg-gray-100 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-white file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed text-black"
                name="tiempo"
                type="number"
                value={values.tiempo}
                disabled
              />
              <Errors2 errors={errors.tiempo} touched={touched.tiempo} />
            </div>
          </div>
          <div className="w-full  relative formas_pago">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-black"
              htmlFor="email"
            >
              Formas de pago
            </label>
            <div className="mt-3 w-full bg-white border border-gray-200 p-3 rounded-md">
              <div
                className="text-black"
                dangerouslySetInnerHTML={{ __html: formaPago }}
              ></div>
            </div>
          </div>

          {// @ts-expect-error
              arrayAdicionales?.length > 0 &&
              <div className='flex flex-row flex-wrap gap-3 justify-center mt-2'>
                {arrayAdicionales?.map((elemento) => (
                    <Chip
                      key={elemento.id}
                      variant='filled'
                      className='bg-white'
                      label={`${elemento.cantidad} ${elemento.elemento}`}
                      // onClick={handleClick}
                    />
                ))}
              </div>
            }

          <div className="mt-3 w-full bg-white border border-gray-200 p-3 rounded-md">
            <div
              className="text-black"
              dangerouslySetInnerHTML={{ __html: contenido }}
            ></div>
          </div>

          <Link
            to="/admin/lista-contratos/"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            className="rounded-md w-fit mt-4 block bg-main h-fit px-3 text-white py-2 hover:bg-green-700 transition-colors"
          >
            Regresar
          </Link>

          <iframe
            src={`${
              Global.urlImages
            }/contratos/${pdfUrl}?timestamp=${Date.now()}`}
            title="PDF Viewer"
            className="w-full h-[700px] border-none mt-10"
          />
        </form>
          )}
    </>
  )
}
