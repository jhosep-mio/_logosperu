/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { useState, useMemo } from 'react'
import {
  ChartContainer,
  ChartTooltip,
  type ChartConfig
} from '../../community_clientes/components/Chart'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../community_clientes/components/Card'
import { Bar, BarChart, CartesianGrid, type TooltipProps, XAxis } from 'recharts'
// import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts'

export const PorTiempoInvertido = ({ chartData, usuarios }: any): JSX.Element => {
  const itemsPerPage = 30
  const [currentPage, setCurrentPage] = useState(1)

  const convertMinutesToHoursAndMinutes = (minutes: any): any => {
    const hours = Math.floor(minutes / 60)
    const remainingMinutes = minutes % 60
    return `${hours}h ${remainingMinutes}m`
  }

  function calcularTiempoInvertidoEnProyecto (
    colaborador: any[],
    proyectoId: number
  ): number {
    let tiempoTotal = 0
    colaborador.forEach((col) => {
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

  const chartConfig = {
    views: {
      label: 'Tiempo Invertido'
    },
    tiempoInvertido: {
      label: 'Tiempo Invertido',
      color: '#7BC9C9'
    }
  } satisfies ChartConfig

  const sortedData = useMemo(() => {
    return [...chartData].sort((a, b) => b.tiempoInvertido - a.tiempoInvertido)
  }, [chartData])

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage
    const end = start + itemsPerPage
    return sortedData.slice(start, end)
  }, [currentPage, sortedData])

  const [activeChart] = useState<keyof typeof chartConfig>('tiempoInvertido')

  const total = useMemo(() => {
    return paginatedData.reduce(
      (acc: any, curr: any) => acc + curr.tiempoInvertido,
      0
    )
  }, [paginatedData])

  const handleBarClick = (data: any): void => {
    window.open(`/admin/lista-servicios/avances/${data.id ?? ''}`, '_blank')
  }

  const CustomTooltip = ({ payload }: TooltipProps<any, any>): JSX.Element | null => {
    if (payload && payload.length) {
      const { id, marca, tiempoInvertido, inicio, fin } = payload[0].payload
      return (
        <div className="grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-white text-black px-2.5 py-1.5 text-xs shadow-xl">
          <p className="text-sm font-semibold">{marca}</p>
          <p className="text-xs font-medium">Tiempo: <span className='font-normal'>{convertMinutesToHoursAndMinutes(tiempoInvertido)}</span></p>
          <p className="text-xs font-medium">F. Inicio: <span className='font-normal'>{inicio}</span></p>
          <p className="text-xs font-medium">F. Final: <span className='font-normal'>{fin || 'En proceso'}</span></p>
          <hr className="mt-2" />
            <div className="grid grid-cols-1 gap-2 w-full">
              {usuarios.map((col: any) => {
                const tiempoInvertido = calcularTiempoInvertidoEnProyecto(
                  [col], id
                )
                if (tiempoInvertido > 0) {
                  let tiempoMostrado = ''
                  const horas = Math.floor(tiempoInvertido / 60)
                  const minutos = tiempoInvertido % 60
                  if (horas > 0) {
                    tiempoMostrado = `${horas} hora${horas > 1 ? 's' : ''} `
                  }
                  tiempoMostrado += `${minutos.toFixed(0)} minutos`
                  return (
                    <div
                      key={col.id}
                      className="bg-white rounded-lg "
                    >
                      <div className="flex justify-between gap-2 items-center">
                        <h3 className="font-semibold text-gray-800">
                          {col.name}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {tiempoMostrado}
                        </p>
                      </div>
                    </div>
                  )
                }
                return null
              })}
            </div>
        </div>
      )
    }
    return null
  }

  const totalPages = Math.ceil(sortedData.length / itemsPerPage)

  return (
    <Card>
      <CardHeader className="flex flex-col items-stretch space-y-0 border-b p-0 sm:flex-row">
        <div className="flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6 text-black">
          <CardTitle>Metrica sobre tiempo invertido</CardTitle>
          <CardDescription>
            El tiempo invertido se base en el horario laboral
          </CardDescription>
        </div>
        <div className="flex">
          <button
            data-active={true}
            className="relative z-30 flex flex-1 flex-col justify-center gap-1 border-t px-6 py-4 text-left bg-[#7BC9C9]/50 even:border-l data-[active=true]:bg-[#7BC9C9] sm:border-l sm:border-t-0 sm:px-8 sm:py-6"
          >
            <span className="text-xs text-white">
              {chartConfig[activeChart].label}
            </span>
            <span className="text-lg text-white font-bold leading-none sm:text-3xl">
              {convertMinutesToHoursAndMinutes(total)}
            </span>
          </button>
        </div>
      </CardHeader>
      <CardContent className="px-2 sm:p-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <BarChart
            accessibilityLayer
            data={paginatedData}
            margin={{
              left: 12,
              right: 12
            }}
            onClick={(e) => {
              handleBarClick(
                // @ts-expect-error
                e?.activePayload[0].payload)
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="id"
              tickLine={false}
              interval={0} // Muestra todas las etiquetas
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
            />
            <ChartTooltip
              content={<CustomTooltip />}
            />
            <Bar dataKey={activeChart} fill="#7BC9C9" />
          </BarChart>
        </ChartContainer>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => { setCurrentPage((prev) => Math.max(prev - 1, 1)) }}
            disabled={currentPage === 1}
            className="px-4 py-1 border rounded bg-[#7BC9C9] hover:bg-[#61a3a3] transition-colors text-white"
          >
            Anterior
          </button>
          <span className="text-sm text-black">
            Página {currentPage} de {totalPages}
          </span>
          <button
            onClick={() => { setCurrentPage((prev) => Math.min(prev + 1, totalPages)) }}
            disabled={currentPage === totalPages}
            className="px-4 py-1 border rounded bg-[#7BC9C9] hover:bg-[#61a3a3] transition-colors text-white"
          >
            Siguiente
          </button>
        </div>
      </CardContent>
    </Card>
  )
}
