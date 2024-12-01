import axios from 'axios'
import { useState } from 'react'
import { Global } from '../../../../helper/Global'
import { toast } from 'sonner'
import { type ListcotizacionValues } from '../../../shared/schemas/Interfaces'
import { MenuItem } from '@szhsin/react-menu'
import { limpiarCadena } from '../../../shared/functions/QuitarAcerntos'
import { convertirNumeroALetras } from '../../../shared/functions/GenerarTextoEnLetras'

export const GenerarPdf = ({
  values
}: {
  values: ListcotizacionValues | null
}): JSX.Element => {
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem('token')

  const calcularTotal = (precio: string, descuento: string): string | number => {
    const precioNumerico = parseFloat(precio)
    const descuentoPorcentaje = parseFloat(descuento)
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

  const GenerarContrato = async (): Promise<void> => {
    const fechaActual = new Date()
    const dia = fechaActual.getDate().toString().padStart(2, '0') // Agrega un 0 al principio si el día tiene un solo dígito
    const mes = (fechaActual.getMonth() + 1).toString().padStart(2, '0') // Agrega un 0 al principio si el mes tiene un solo dígito
    const anio = fechaActual.getFullYear()
    const fechaFormateada = `${dia}/${mes}/${anio}`
    setLoading(true)
    const data = new FormData()
    data.append('nombres_cliente', `${values?.nombres ?? ''} ${values?.apellidos ?? ''}`)
    data.append('correlativo', values?.correlativo ?? '')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    data.append('descripcion', JSON.parse(values?.descripcion) ?? '')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    data.append('email', values?.email ?? '')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    data.append('celular', values?.celular ?? '')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    data.append('dni_ruc', values?.dni_ruc ?? '')
    data.append('fecha', fechaFormateada ?? '')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    data.append('codigo', limpiarCadena(values?.correlativo) ?? '')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    data.append('total', `S./ ${calcularTotal(values?.precio, values?.descuento)}`)
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    data.append('preciotexto', convertirNumeroALetras(Number(calcularTotal(values?.precio, values?.descuento))).toLowerCase())

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
      const a = document.createElement('a')
      a.href = pdfUrl
      a.download = `${values?.correlativo ?? ''}.pdf` // Nombre del archivo para descargar
      a.click()
      toast.success('PDF GENERADO')
    } catch (error) {
      console.log(error)
      toast.error('Error al generar el PDF')
    }
    setLoading(false)
  }

  return (
    <MenuItem className="p-0 hover:bg-transparent ">
      {loading
        ? <button
          type="button"
          className="rounded-lg transition-colors text-gray-300 bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
        >
          Generando...
        </button>
        : (
        <button
          type="button"
          // eslint-disable-next-line @typescript-eslint/no-misused-promises
          onClick={async () => {
            await GenerarContrato()
          }}
          className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
        >
          Generar contrato
        </button>
          )}
    </MenuItem>
  )
}
