/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable multiline-ternary */
import { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import { toast } from 'sonner'
import axios from 'axios'
import { Link, useParams } from 'react-router-dom'
import { SchemaCotizacion } from '../../../shared/schemas/Schemas'
import { LoadingSmall } from '../../../shared/LoadingSmall'
import { Errors } from '../../../shared/Errors'
import { Global } from '../../../../helper/Global'
import useAuth from '../../../../hooks/useAuth'
import { Loading } from '../../../shared/Loading'
import { limpiarCadena } from '../../../shared/functions/QuitarAcerntos'
import { convertirNumeroALetras } from '../../../shared/functions/GenerarTextoEnLetras'
import { Errors2 } from '../../../shared/Errors2'
import EditorPdfAltas from '../../../shared/modals/EditorPdfAltas'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { v4 as uuidv4 } from 'uuid'
import { Chip } from '@mui/material'
import { ListaAdicionalesPrecio } from '../contratos/adicionales/ListaAdicionalesPrecio'

export const EditarCotizacion = (): JSX.Element => {
  const { id } = useParams()
  const { setTitle } = useAuth()
  const [context, setContext] = useState('')
  const [formaPago, setFormaPago] = useState('')
  const token = localStorage.getItem('token')
  const [loadingValidacion, seLoadingValidation] = useState(false)
  const [loading, setLoading] = useState(true)
  const [todocontenido, setTodoContenido] = useState<any | null>(null)
  const [openAdicional, setOpenAdicional] = useState(false)
  const [arrayAdicionales, setArrayAdicionales] = useState<
  any | null
  >(null)

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

      if (request.data.descripcion) {
        setContext(request.data.descripcion)
      }

      if (request.data.cotizacion) {
        const arraycotizacion = JSON.parse(request.data.cotizacion)
        setFormaPago(arraycotizacion.forma_pago)
        setValues({
          ...values,
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          nombre_cliente: arraycotizacion.nombres_cliente,
          id_cliente: request.data.id_cliente,
          nombre_empresa: arraycotizacion.nombre_empresa,
          precio: request.data.precio,
          descuento: request.data.descuento,
          correlativo: request.data.correlativo,
          pdf: request.data.pdf,
          email: request.data.email,
          dni_ruc: request.data.dni_ruc,
          celular: request.data.celular,
          tipo: arraycotizacion.tipo ?? 'sin igv',
          descripcion: request.data.descripcion,
          autorizado: arraycotizacion.autorizacion
        })
        setTodoContenido(arraycotizacion)
        setArrayAdicionales(arraycotizacion.adicionales)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const saveCotizacion = async (): Promise<void> => {
    try {
      seLoadingValidation(true)
      const data = new FormData()
      data.append('id_cliente', values.id_cliente)
      data.append('descripcion', context ?? '')
      data.append('precio', Number(values.precio).toFixed(2))
      data.append('descuento', values.descuento)
      data.append('pdf', `${todocontenido?.id_contrato}_${todocontenido.nombres_cliente}.pdf`)
      const fechaActual = new Date()
      const dia = fechaActual.getDate().toString().padStart(2, '0') // Agrega un 0 al principio si el día tiene un solo dígito
      const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0') // Agrega un 0 al principio si el mes tiene un solo dígito
      const anio = fechaActual.getFullYear()
      const fechaFormateada = `${dia}/${mes}/${anio}`
      data.append('nombres_cliente', todocontenido.nombres_cliente ?? '')
      data.append('correlativo', todocontenido?.id_contrato ?? '')
      data.append('correlativo_simple', todocontenido?.correlativo_simple ?? '')
      data.append(
        'adicionales',
        arrayAdicionales ? JSON.stringify(arrayAdicionales ?? '') : ''
      )
      data.append('forma_pago', formaPago)
      data.append('descripcion', context ?? '')
      data.append('descripcioncorta', todocontenido?.nombre_plan ?? '')
      data.append('email', todocontenido?.email ?? '')
      data.append('celular', todocontenido?.celular ?? '')
      data.append('dni_ruc', todocontenido?.dni_ruc ?? '')
      data.append('fecha', fechaFormateada ?? '')
      data.append('codigo', limpiarCadena(todocontenido?.id_contrato) ?? '')
      data.append('precio', `${Number(values.precio).toFixed(2)}`)
      const totalAdicional = arrayAdicionales
        ? sumarPreciosTotales(arrayAdicionales)
        : 0
      const subtotal = Number(values.precio) + Number(totalAdicional)
      const { total: totalSinIGV, descuento: descuentoFinal } =
        calcularTotal2(subtotal)
      data.append('subtotal', `${Number(subtotal).toFixed(2)}`)
      data.append('total', `${Number(totalSinIGV).toFixed(2)}`)
      data.append('descuento2', `${Number(descuentoFinal).toFixed(2)}`)
      let igv = 0
      if (values.tipo == 'con igv') {
        igv = Number(totalSinIGV) * 0.18
      }
      data.append('igv', `${igv.toFixed(2)}`)
      const totalConIGV = Number(totalSinIGV) + igv
      data.append('totaligv', `S/ ${totalConIGV.toFixed(2)}`)
      data.append(
        'preciotexto',
        convertirNumeroALetras(Number(totalConIGV.toFixed(2))).toLowerCase()
      )

      const cotizacion = {
        ...todocontenido,
        nombres_cliente: todocontenido.nombres_cliente ?? '',
        nombre_empresa: todocontenido.nombre_empresa ?? '',
        correlativo: todocontenido?.id_contrato ?? '',
        correlativo_simple: todocontenido?.correlativo_simple ?? '',
        adicionales: arrayAdicionales,
        forma_pago: formaPago,
        descripcion: context,
        descripcioncorta: todocontenido?.nombre_plan ?? '',
        email: todocontenido?.email,
        celular: todocontenido?.celular,
        dni_ruc: todocontenido?.dni_ruc,
        tipo: values.tipo,
        fecha: fechaFormateada,
        codigo: limpiarCadena(todocontenido?.id_contrato),
        nombre_plan: todocontenido?.nombre_plan,
        id_contrato: todocontenido?.id_contrato,
        autorizacion: values.autorizado ?? '',
        precio: Number(values.precio).toFixed(2),
        subtotal: Number(subtotal).toFixed(2),
        total: Number(totalSinIGV).toFixed(2),
        descuento: Number(descuentoFinal).toFixed(2),
        totaligv: totalConIGV.toFixed(2)
      }
      data.append('cotizacion', JSON.stringify(cotizacion))
      data.append('_method', 'PUT')

      const request = await axios.post(
        `${Global.url}/updateCotizacion/${id ?? ''}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      if (request.data.status == 'success') {
        toast.success('Cotización actualizada')
        // navigate('/admin/lista-cotizaciones')
      } else if (request.data.message.includes('codigo invalido')) {
        toast.warning('El codigo correlativo esta duplicado')
      } else {
        toast.error('Error al generar la cotizacion')
      }
    } catch (error: any) {
      console.log(error)
      if (
        error.request.response.includes(
          `Duplicate entry '${todocontenido?.id_contrato ?? ''}' for key 'correlativo'`
        )
      ) {
        toast.warning('El codigo correlativo esta duplicado')
      } else {
        toast.error('Error al generar la cotizacion')
      }
    } finally {
      seLoadingValidation(false)
    }
  }

  const calcularTotal2 = (
    entradaPrecio: number
  ): { total: string | number, descuento: string | number } => {
    const precioNumerico = Number(entradaPrecio)
    const descuentoPorcentaje = parseFloat(values.descuento ?? 0)
    let total: string | number = '---'
    let descuentoCalculado: string | number = '---'

    // Verificar que ambos valores sean números válidos
    if (!isNaN(precioNumerico) && !isNaN(descuentoPorcentaje)) {
      // Convertir el porcentaje a un decimal
      const descuentoDecimal = descuentoPorcentaje / 100
      // Calcular el descuento
      descuentoCalculado = precioNumerico * descuentoDecimal
      // Calcular el total restando el descuento al precio original
      total = precioNumerico - descuentoCalculado
    }

    return { total, descuento: descuentoCalculado }
  }

  const sumarPreciosTotales = (adicionales: any): string => {
    let total = 0
    adicionales.forEach((item: any) => {
      total += parseFloat(item.total)
    })
    return total.toFixed(2)
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
      email: '',
      dni_ruc: '',
      celular: '',
      precio: '',
      descuento: '0',
      correlativo: '',
      pdf: '',
      tipo: '',
      descripcion: '',
      autorizado: ''
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

  useEffect(() => {
    setTitle('EDITAR COTIZACIÓN')
    getCotizacion()
  }, [])

  const agregarArrayPesos = async (elemento: string, html: string): Promise<void> => {
    const id = uuidv4()
    const nuevosAdicionales = arrayAdicionales ? [...arrayAdicionales] : []

    // Buscar el adicional existente en la lista
    const adicionalExistente = nuevosAdicionales.find(
      (item) => item.elemento === elemento
    )

    if (adicionalExistente) {
      // Si el adicional ya existe, incrementar la cantidad en 1 y actualizar el total
      adicionalExistente.cantidad += 1
      adicionalExistente.total = (
        parseFloat(adicionalExistente.precio) * adicionalExistente.cantidad
      ).toFixed(2)
      toast.success('Adicional actualizado')
    } else {
      // Si el adicional no existe, solicitar el precio y agregarlo con cantidad 1
      const precioString = prompt('Ingrese el precio del adicional:')
      if (precioString !== null && precioString.trim() !== '') {
        const precio = parseFloat(precioString.trim())
        if (!isNaN(precio)) {
          const total = (precio * 1).toFixed(2) // Inicialmente el total es precio * cantidad
          nuevosAdicionales.push({
            id,
            elemento,
            cantidad: 1,
            precio: precio.toFixed(2),
            total,
            html
          })
          toast.success('Adicional agregado')
        } else {
          alert('Debe ingresar un precio válido.')
        }
      } else {
        alert('Debe ingresar un precio válido.')
      }
    }

    setArrayAdicionales(nuevosAdicionales)
  }

  const eliminarArray = (id: number | null): void => {
    const usuarioEliminado = arrayAdicionales?.find((peso: any) => peso.id === id)
    if (!usuarioEliminado) return // Salir si no se encuentra el usuario
    const nuevoArrayPesos = arrayAdicionales?.filter((peso: any) => peso.id !== id)
    setArrayAdicionales(nuevoArrayPesos)
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
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
                  type="text"
                  value={values.precio}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Errors errors={errors.precio} touched={touched.precio} />
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
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
                <Errors errors={errors.descuento} touched={touched.descuento} />
              </div>
            </div>
            {Number(values.descuento) > 0 && (
            <div className="w-full  relative ">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="email"
              >
                Autorizado por
              </label>
              <select
                className="flex bg-white h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                name="autorizado"
                value={values.autorizado}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={false}
              >
                <option value="">Seleccionar</option>
                <option value="Paul Chapilliquen">Paul Chapilliquen</option>
                <option value="Maria Elena Beltran">Maria Elena Beltran</option>
              </select>
              <Errors2
                errors={errors.autorizado}
                touched={touched.autorizado}
              />
            </div>
            )}
            {/* <div className="flex gap-3 text-base font-bold items-end w-full justify-center">
              <label className="font-bold h-9 flex items-center mt-1 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Total
              </label>
              <input
                className="flex h-9 w-fit rounded-md py-1  transition-colors file:border-0 file:bg-white file:text-sm file:font-medium focus-visible:outline-none  disabled:cursor-not-allowed "
                placeholder="Precio"
                disabled
                name="precio"
                type="text"
                value={`S/. ${total}`}
                onChange={handleChange}
                onBlur={handleBlur}
              />
            </div> */}
            <div className="w-full  relative ">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="email"
              >
                Tipo
              </label>
              <select
                className="flex h-9 w-full bg-white rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                name="tipo"
                value={values.tipo}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={false}
              >
                <option value="">Seleccionar</option>
                <option value="sin igv">SIN IGV</option>
                <option value="con igv">CON IGV</option>
              </select>
              <Errors2 errors={errors.tipo} touched={touched.tipo} />
            </div>
            <div className="flex justify-center mt-4 items-center">
              <button
                type="button"
                onClick={() => {
                  setOpenAdicional(true)
                }}
                className="bg-red-600 px-2 py-1 rounded-md text-white hover:bg-red-700 transition-colors text-sm"
              >
                Adicionales
              </button>
            </div>
            <div className="w-full  relative formas_pago ">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="email"
              >
                Formas de pago
              </label>
              <div className="mt-3 w-full bg-white">
                <EditorPdfAltas content={formaPago} setContent={setFormaPago} />
              </div>
            </div>
            {openAdicional && (
            <div className="w-[70%] h-full overflow-y-auto bg-white p-2 absolute right-0 top-0 bottom-0 shadow-md border rounded-md border-gray-300 z-10">
                <IoCloseCircleOutline
                className="absolute top-2 right-2 text-2xl cursor-pointer"
                onClick={() => {
                  setOpenAdicional(false)
                }}
                />
                <h2 className="text-center w-full uppercase font-bold">
                Adicionales
                </h2>
                <ListaAdicionalesPrecio agregarArrayPesos={agregarArrayPesos} />
            </div>
            )}
             <div>
                <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="email"
                >
                    Lista de adicionales
                </label>
                <div className='bg-white border border-gray-300  mt-3'>
                { arrayAdicionales?.length > 0 && (
                    <div className="flex flex-row flex-wrap gap-3 justify-center my-4">
                        {arrayAdicionales?.map((elemento: any) => (
                        <Chip
                            key={elemento.id}
                            label={`${elemento.cantidad} ${elemento.elemento} - (S/ ${elemento.total})`}
                            variant="outlined"
                            // onClick={handleClick}
                            onDelete={() => {
                              eliminarArray(elemento.id)
                            }}
                        />
                        ))}
                    </div>
                )}
                </div>
            </div>

          </section>

          <section className="mt-4 jodect_editor_cotizacion text-black bg-white">
            <EditorPdfAltas content={context} setContent={setContext} />
          </section>

          <section className="w-full grid grid-cols-1 justify-center mt-4 gap-x-4 gap-y-4 items-end">
            <div className="flex justify-start gap-4">
              {!loadingValidacion ? (
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                <button
                  type="submit"
                  className="rounded-md w-[200px] bg-green-600 h-fit px-3 text-white py-2 hover:bg-green-700 transition-colors"
                >
                  Grabar cotización
                </button>
              ) : (
                <button
                  className="rounded-md w-[200px] bg-green-700 h-fit px-3 text-white py-2"
                  type="button"
                  disabled
                >
                  <LoadingSmall />
                </button>
              )}
              <Link
                to="/admin/lista-cotizaciones"
                className="bg-red-600 px-3 py-2 rounded-md text-white cursor-pointer"
              >
                Cancelar
              </Link>
            </div>
          </section>

          <iframe
            src={`${Global.urlImages}/cotizaciones/${values.pdf}?timestamp=${Date.now()}`}
            title="PDF Viewer"
            className="w-full h-[700px] border-none mt-10"
          />
        </form>
      )}
    </>
  )
}
