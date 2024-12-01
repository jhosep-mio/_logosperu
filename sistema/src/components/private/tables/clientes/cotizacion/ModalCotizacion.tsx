/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable multiline-ternary */
import { useState, useEffect, type Dispatch, type SetStateAction } from 'react'
import { useFormik } from 'formik'
import { SchemaCotizacion } from '../../../../shared/schemas/Schemas'
import { Errors } from '../../../../shared/Errors'
import { toast } from 'sonner'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import { LoadingSmall } from '../../../../shared/LoadingSmall'
// import { useNavigate } from 'react-router-dom'
import { limpiarCadena } from '../../../../shared/functions/QuitarAcerntos'
import { convertirNumeroALetras } from '../../../../shared/functions/GenerarTextoEnLetras'
import EditorPdfAltas from '../../../../shared/modals/EditorPdfAltas'
import { v4 as uuidv4 } from 'uuid'
import { IoCloseCircleOutline } from 'react-icons/io5'
import { Chip } from '@mui/material'
import { Errors2 } from '../../../../shared/Errors2'
import { useNavigate } from 'react-router-dom'
import { ListaAdicionalesPrecio } from '../../contratos/adicionales/ListaAdicionalesPrecio'

export const ModalCotizacion = ({
  datos,
  setPdfUrl,
  setLoading,
  loading,
  pdfUrl
}: //   personContact
{
  datos: any
  setPdfUrl: Dispatch<SetStateAction<any | null>>
  setLoading: Dispatch<SetStateAction<boolean>>
  loading: boolean
  pdfUrl: any | null
  personContact: string | null
}): JSX.Element => {
  const initialEvent = datos?.descripcion
  const initialEvent2 = datos?.descripcionPago
  const [context, setContext] = useState(initialEvent)
  const token = localStorage.getItem('token')
  const [loadingValidacion, seLoadingValidation] = useState(false)
  const [openAdicional, setOpenAdicional] = useState(false)
  const [arrayAdicionales, setArrayAdicionales] = useState<any | null>(null)
  const navigate = useNavigate()
  const [formaPago, setFormaPago] = useState(initialEvent2)

  const saveCotizacion = async (): Promise<void> => {
    try {
      seLoadingValidation(true)
      const data = new FormData()
      data.append('id_cliente', datos.id_cliente)
      data.append('descripcion', context ?? '')
      data.append('precio', Number(values.precio).toFixed(2))
      data.append('descuento', values.descuento)
      data.append('pdf', `${datos?.id_contrato}_${datos.nombre_cliente}.pdf`)
      const fechaActual = new Date()
      const dia = fechaActual.getDate().toString().padStart(2, '0') // Agrega un 0 al principio si el día tiene un solo dígito
      const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0') // Agrega un 0 al principio si el mes tiene un solo dígito
      const anio = fechaActual.getFullYear()
      const fechaFormateada = `${dia}/${mes}/${anio}`
      data.append('nombres_cliente', datos.nombre_cliente ?? '')
      data.append('correlativo', datos?.id_contrato ?? '')
      data.append('correlativo_simple', datos?.correlativo_simple ?? '')
      data.append(
        'adicionales',
        arrayAdicionales ? JSON.stringify(arrayAdicionales ?? '') : ''
      )
      data.append('forma_pago', formaPago)
      data.append('descripcion', context ?? '')
      data.append('descripcioncorta', datos?.nombre_plan ?? '')
      data.append('email', datos?.email ?? '')
      data.append('celular', datos?.celular ?? '')
      data.append('dni_ruc', datos?.dni_ruc ?? '')
      data.append('fecha', fechaFormateada ?? '')
      data.append('codigo', limpiarCadena(datos?.id_contrato) ?? '')
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
        nombres_cliente: datos.nombre_cliente ?? '',
        nombre_empresa: datos.nombre_empresa ?? '',
        correlativo: datos?.id_contrato ?? '',
        correlativo_simple: datos?.correlativo_simple ?? '',
        adicionales: arrayAdicionales,
        forma_pago: formaPago,
        descripcion: context,
        descripcioncorta: datos?.nombre_plan ?? '',
        email: datos?.email,
        celular: datos?.celular,
        dni_ruc: datos?.dni_ruc,
        tipo: values.tipo,
        fecha: fechaFormateada,
        codigo: limpiarCadena(datos?.id_contrato),
        nombre_plan: datos?.nombre_plan,
        id_contrato: datos?.id_contrato,
        autorizacion: values.autorizado ?? '',
        precio: Number(values.precio).toFixed(2),
        subtotal: Number(subtotal).toFixed(2),
        total: Number(totalSinIGV).toFixed(2),
        descuento: Number(descuentoFinal).toFixed(2),
        totaligv: totalConIGV.toFixed(2)
      }
      data.append('cotizacion', JSON.stringify(cotizacion))

      const request = await axios.post(
        `${Global.url}/registrarCotizacion`,
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
        toast.success('Cotización creada')
        navigate('/admin/lista-cotizaciones')
      } else if (request.data.message.includes('codigo invalido')) {
        toast.warning('El codigo correlativo esta duplicado')
      } else {
        toast.error('Error al generar la cotizacion')
      }
    } catch (error: any) {
      console.log(error)
      if (
        error.request.response.includes(
          `Duplicate entry '${datos?.id_contrato}' for key 'correlativo'`
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

  const GenerarContrato = async (): Promise<void> => {
    setLoading(true)
    const fechaActual = new Date()
    const dia = fechaActual.getDate().toString().padStart(2, '0') // Agrega un 0 al principio si el día tiene un solo dígito
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0') // Agrega un 0 al principio si el mes tiene un solo dígito
    const anio = fechaActual.getFullYear()
    const fechaFormateada = `${dia}/${mes}/${anio}`
    const data = new FormData()
    data.append('nombres_cliente', datos.nombre_cliente ?? '')
    data.append('correlativo', datos?.id_contrato ?? '')
    data.append('correlativo_simple', datos?.correlativo_simple ?? '')
    data.append(
      'adicionales',
      arrayAdicionales ? JSON.stringify(arrayAdicionales ?? '') : ''
    )
    data.append('forma_pago', formaPago)
    data.append('descripcion', context ?? '')
    data.append('descripcioncorta', datos?.nombre_plan ?? '')
    data.append('email', datos?.email ?? '')
    data.append('celular', datos?.celular ?? '')
    data.append('dni_ruc', datos?.dni_ruc ?? '')
    data.append('fecha', fechaFormateada ?? '')
    data.append('codigo', limpiarCadena(datos?.id_contrato) ?? '')
    data.append('precio', `${Number(values.precio).toFixed(2)}`)
    const totalAdicional = arrayAdicionales
      ? sumarPreciosTotales(arrayAdicionales)
      : 0
    const subtotal = Number(values.precio) + Number(totalAdicional)
    const { total: totalSinIGV, descuento: descuentoFinal } =
      calcularTotal2(subtotal)
    data.append('subtotal', `${Number(subtotal).toFixed(2)}`)
    data.append('total', `${Number(totalSinIGV).toFixed(2)}`)
    data.append('descuento', values.descuento)
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

    try {
      const response = await axios.post(
        `${Global.url}/generarPDFCotizacion`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          },
          responseType: 'blob'
        }
      )
      const pdfBlob = new Blob([response.data], { type: 'application/pdf' })
      const pdfUrl = window.URL.createObjectURL(pdfBlob)
      setPdfUrl(pdfUrl) // Guarda la URL del PDF en el estado para mostrarlo en el componente
      toast.success('PDF generado')
    } catch (error) {
      console.log(error)
      toast.error('Error al generar el PDF')
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
    // resetForm,
    setValues
  } = useFormik({
    initialValues: {
      precio: '',
      descuento: '0',
      tipo: '',
      autorizado: ''
    },
    validationSchema: SchemaCotizacion,
    onSubmit: GenerarContrato
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
    const descuentoPorcentaje = parseFloat(values.descuento ?? 0)
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

  useEffect(() => {
    const ul = document.createElement('ul') // Create a ul element

    // Iterate over arrayAdicionales and create a li for each element
    arrayAdicionales?.forEach((item: any) => {
      const li = document.createElement('li') // Create a li element
      const ul2 = document.createElement('ol') // Create a nested ul element

      if (item.elemento === 'Impresión de tarjeta de presentación') {
        // Generate specific HTML for 'Impresión de tarjeta de presentación'
        li.innerHTML = `
          <p>IMPRESIÓN DE TARJETA DE PRESENTACIÓN:</p>
          <p>Descripción:</p>
          <p>1 millar x 1 nombre.&nbsp;</p>
          <p>Tamaño: 9 x 5.5 cm.</p>
          <p>Material: Papel couché de 250gr. Mate o brillante (a elección del cliente).</p>
          <p>Envío Lima: Gratis&nbsp;&nbsp;</p>
          <p>Envío Provincia: Servicio de COLLECT</p>
        `
      } else {
        const cantidadFormateada = item.cantidad.toString().padStart(2, '0')
        // Set textContent for li
        li.innerHTML = `<strong>${cantidadFormateada} ${item.elemento}</strong>`
        // Set innerHTML for ul2
        ul2.innerHTML = item.html
        // Append ul2 to li
        li.appendChild(ul2)
      }

      ul.appendChild(li) // Append the li to the ul
    })

    // Get the HTML of the ul and set it as content
    const nombresColaboradores = ul.outerHTML
    const textofinal = '<p>&nbsp;</p>'
    const contenidoConTextoAdicional = (datos?.descripcion ?? '') + textofinal + nombresColaboradores
    setContext(contenidoConTextoAdicional)
  }, [arrayAdicionales])

  const total = calcularTotal()

  useEffect(() => {
    if (datos) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      if (datos?.descripcion) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        setContext(datos?.descripcion)
        setValues({
          ...values,
          precio: datos?.precio
        })
      } else {
        setContext('')
      }
    }
  }, [datos])

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

  const sumarPreciosTotales = (adicionales: any): string => {
    let total = 0
    adicionales.forEach((item: any) => {
      total += parseFloat(item.total)
    })
    return total.toFixed(2)
  }

  const eliminarArray = (id: number | null): void => {
    const usuarioEliminado = arrayAdicionales?.find(
      (peso: any) => peso.id === id
    )
    if (!usuarioEliminado) return // Salir si no se encuentra el usuario
    const nuevoArrayPesos = arrayAdicionales?.filter(
      (peso: any) => peso.id !== id
    )
    setArrayAdicionales(nuevoArrayPesos)
  }

  return (
    <form className={'w-full  p-6'} onSubmit={handleSubmit}>
      <div className="w-full">
        <h2 className="w-full text-xl font-bold text-center uppercase underline">
          Generar cotizacion
        </h2>
        <section className="w-full grid grid-cols-1 lg:grid-cols-3 mt-4 gap-x-4 gap-y-2">
          <div className="grid gap-2 w-full">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="email"
            >
              Correlativo
            </label>
            <input
              className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
              placeholder="Correlativo"
              type="text"
              name="correlativo"
              value={datos?.id_contrato}
              onChange={handleChange}
              onBlur={handleBlur}
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
              className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
              placeholder="Nombre del cliente"
              type="text"
              disabled
              value={datos.nombre_cliente}
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
              className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed "
              placeholder="Nombre de empresa"
              type="text"
              disabled
              value={datos.nombre_empresa}
            />
          </div>
          <div className="grid grid-cols-2 gap-2 col-span-2">
            <div className="relative">
              <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Precio
              </label>
              <input
                className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed "
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
                Descuento (%)
              </label>
              <input
                className="flex h-9 w-full rounded-md border border-input border-red-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed "
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
          <div className="w-full  relative ">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="email"
            >
              Tipo
            </label>
            <select
              className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
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
          <div className="flex gap-3 items-end pb-2">
            <label className="text-sm font-bold h-9 flex items-center mt-1 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-main_dark">
              Total
            </label>
            <input
              className="flex h-9 w-full rounded-md bg-transparent  py-1 text-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none  disabled:cursor-not-allowed "
              placeholder="Precio"
              disabled
              name="precio"
              type="text"
              value={`S/ ${total}`}
              onChange={handleChange}
              onBlur={handleBlur}
            />
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
                className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
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
          {/* <div className="w-full flex flex-col lg:flex-row gap-0 lg:gap-5 mt-0 lg:mt-0 items-center">
          </div> */}
        </section>
        <div className="w-full  relative formas_pago">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="email"
          >
            Formas de pago
          </label>
          <div className="mt-3 w-full">
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
        <div className="flex justify-end mt-4 items-center">
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
        {arrayAdicionales?.length > 0 && (
          <div className="flex flex-row flex-wrap gap-3 justify-center mt-2">
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
        <section className="mt-4 jodect_editor_cotizacion">
          <EditorPdfAltas content={context} setContent={setContext} />
        </section>
        <section className="mt-4 px-1 flex justify-end items-center">
          {!loading ? (
            <div className="flex gap-3">
              <button
                type="submit"
                className="rounded-md w-[130px] bg-green-600 h-fit px-3 text-white py-2 hover:bg-green-700 transition-colors"
              >
                Previzualizar
              </button>
              {pdfUrl && (
                <>
                  {!loadingValidacion ? (
                    <button
                      type="button"
                      // eslint-disable-next-line @typescript-eslint/no-misused-promises
                      onClick={async () => {
                        await saveCotizacion()
                      }}
                      className="rounded-md w-[100px] bg-secundario h-fit px-3 text-white py-2 hover:bg-green-700 transition-colors"
                    >
                      Continuar
                    </button>
                  ) : (
                    <button
                      type="button"
                      // eslint-disable-next-line @typescript-eslint/no-misused-promises
                      className="rounded-md w-[100px] bg-secundario h-fit px-3 text-white py-2 hover:bg-green-700 transition-colors"
                    >
                      Validando...
                    </button>
                  )}
                </>
              )}
            </div>
          ) : (
            <button
              className="rounded-md w-[200px] bg-green-700 h-fit px-3 text-white py-2"
              type="button"
              disabled
            >
              <LoadingSmall />
            </button>
          )}
        </section>
      </div>
    </form>
  )
}
