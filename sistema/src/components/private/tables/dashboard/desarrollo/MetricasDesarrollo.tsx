/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable multiline-ternary */
import { useState, useEffect } from 'react'
import { Loading } from '../../../../shared/Loading'
import { getDataToPlanes } from '../../../../shared/FetchingData'
import {
  type openFiltersValuesToId,
  type ValuesVentaToMetricas,
  type openFiltersValues,
  type ValuesPlanes,
  type filtrosValuesVentas
} from '../../../../shared/schemas/Interfaces'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import { ModalVentas } from '../ventas/modals/ModalVentas'
import { PorTiempoInvertido } from './graficos/PorTiempoInvertido'

export const MetricasDesarrollo = (): JSX.Element => {
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')
  const [ventas, setVentas] = useState<ValuesVentaToMetricas[]>([])
  const [colaboradores, setColaboradores] = useState([])
  const [planes, setplanes] = useState<ValuesPlanes[]>([])
  const [filtroSeleccionado] = useState<filtrosValuesVentas | null>(null)
  const [, setTotalRegistros] = useState(0)
  const [openVentaId] = useState<openFiltersValuesToId>({
    estado: false,
    id: null,
    nombre: null,
    cantidad: null
  })
  const [openVenta, setOpenVenta] = useState<openFiltersValues>({
    estado: false,
    fecha: null
  })
  const getColaboradores = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getUsuariosToMatrix`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setColaboradores(request.data)
  }

  function calcularTiempoInvertidoEnProyecto (proyectoId: number): number {
    let tiempoTotal = 0
    colaboradores.forEach((col: any) => {
      if (col?.horario_laboral && JSON.parse(col.horario_laboral).length > 0) {
        JSON.parse(col.horario_laboral).forEach((horario: any) => {
          // Verificar dentro de detalle si hay entradas relacionadas al proyecto
          if (horario.detalle) {
            Object.values(horario.detalle).forEach((arrayDetalle: any): any => {
              arrayDetalle.forEach((detalleItem: any) => {
                if (
                  detalleItem.proyecto &&
                  detalleItem.proyecto.id == proyectoId
                ) {
                  const horaInicio = new Date(
                    `2024-03-18 ${detalleItem.horaInicio}`
                  )
                  const horaFin = new Date(`2024-03-18 ${detalleItem.horaFin}`)
                  if (
                    !isNaN(horaInicio.getTime()) &&
                    !isNaN(horaFin.getTime())
                  ) {
                    let diffMs = horaFin.getTime() - horaInicio.getTime()
                    // Ajustar el tiempo si los minutos terminan en _:59
                    if (detalleItem.horaFin.endsWith(':59')) {
                      diffMs += 60000 // Sumar un minuto en milisegundos
                    }
                    tiempoTotal += diffMs
                  }
                }
              })
            })
          }
        })
      }
    })
    // Convertir el tiempo a horas y minutos
    const horas = Math.floor(tiempoTotal / (1000 * 60 * 60))
    const minutos = Math.floor((tiempoTotal % (1000 * 60 * 60)) / (1000 * 60))
    return horas * 60 + minutos
  }

  const getDataVentasToMetricas = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/indexCapaDesarrollo`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setVentas(request.data)
    setTotalRegistros(request.data.length)
  }

  const proyectosData = ventas
    .map((item) => ({
      id: item.id,
      marca: item.nombre_marca ?? 'Sin marca',
      tiempoInvertido: calcularTiempoInvertidoEnProyecto(item.id),
      inicio: item.fecha_inicio,
      fin: item.fecha_fin
    }))
    .filter((proyecto) => proyecto.tiempoInvertido > 0)

  const filtrarVentas = (): ValuesVentaToMetricas[] => {
    let ventasFiltrados = [...ventas]
    if (openVentaId?.estado && openVentaId.id) {
      ventasFiltrados = ventasFiltrados.filter(
        (venta) => venta.id_cliente == openVentaId.id
      )
    }

    if (filtroSeleccionado?.estado && filtroSeleccionado.estado.length > 0) {
      ventasFiltrados = ventasFiltrados.filter((venta) => {
        const filtroAbandono = filtroSeleccionado.estado.includes('Abandono')
        const filtroFinalizado =
          filtroSeleccionado.estado.includes('Finalizado')
        const filtroProceso = filtroSeleccionado.estado.includes('Proceso')
        if (filtroAbandono && venta.estado === '1') {
          return true
        }
        if (filtroFinalizado && venta.fecha_fin && venta.estado !== '1') {
          return true
        }
        if (filtroProceso && !venta.fecha_fin && venta.estado !== '1') {
          return true
        }
        return filtroSeleccionado.estado.includes(venta.estado)
      })
    }

    if (filtroSeleccionado?.ingreso && filtroSeleccionado.ingreso.length > 0) {
      ventasFiltrados = ventasFiltrados.filter((cliente) => {
        const medioIngreso = cliente?.medio_ingreso
        let codigoMedio = ''
        switch (medioIngreso) {
          case '0':
            codigoMedio = 'Facebook'
            break
          case '1':
            codigoMedio = 'Google'
            break
          case '2':
            codigoMedio = 'Ventas'
            break
          case '3':
            codigoMedio = 'Post Venta'
            break
          case '4':
            codigoMedio = 'Whatsapp'
            break
          case '5':
            codigoMedio = 'Instagram'
            break
          case '6':
            codigoMedio = 'Recomendación'
            break
          // Agrega más casos según sea necesario para otros medios de ingreso
          default:
            codigoMedio = '' // Asigna un valor predeterminado si no hay coincidencia
        }
        return filtroSeleccionado.ingreso.includes(codigoMedio)
      })
    }

    ventasFiltrados = ventasFiltrados.filter(
      (pro) => pro.fecha_inicio && pro.fecha_alta
    )
    // totalPosts = ventasFiltrados.length
    return ventasFiltrados
  }

  useEffect(() => {
    Promise.all([
      //   getDataClientesMetricas('getClientes', setClientes, setPaises, setTotalRegistros)
      getDataVentasToMetricas(),
      getDataToPlanes('getPlanes', setplanes, setTotalRegistros),
      getColaboradores()
    ]).then(() => {
      setLoading(false)
    })
  }, [])

  return (
    <div className="w-full min-h-screen relative ">
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex flex-col px-3 w-full">
            <div className="w-full flex justify-end mt-2">
              <button
                type="button"
                onClick={() => {
                  window.history.back()
                }}
                className="w-fit px-4 py-1 text-white bg-red-600 rounded-md hover:bg-red-700 transition-colors cursor-pointer"
              >
                Regresar
              </button>
            </div>
            <section className={'grid  h-fit gap-4 w-full py-2'}>
              <div className="w-full h-auto bg-white p-4 rounded-lg shadow-md">
                <PorTiempoInvertido chartData={proyectosData} usuarios={colaboradores}/>
              </div>
            </section>
          </div>
          <ModalVentas
            open={openVenta}
            setOpen={setOpenVenta}
            ventas={filtrarVentas()}
            colaboradores={colaboradores}
            planes={planes}
            openVentaId={openVentaId}
          />
        </>
      )}
    </div>
  )
}
