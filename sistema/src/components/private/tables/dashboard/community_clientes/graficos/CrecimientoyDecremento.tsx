/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import {
  type openFiltersValues,
  type ValuesVentaToMetricas
} from '../../../../../shared/schemas/Interfaces'
import { type Dispatch, type SetStateAction } from 'react'
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig
} from '../components/Chart'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '../components/Card'
import { CartesianGrid, Line, LineChart, XAxis } from 'recharts'

export const CrecimientoyDecremento = ({
  filtrarVentas,
  setOpen
}: {
  filtrarVentas: () => ValuesVentaToMetricas[]
  setSelectedId: Dispatch<SetStateAction<string | null>>
  selectedId: string | null
  setOpen: Dispatch<SetStateAction<openFiltersValues>>
}): JSX.Element => {
  const ventas = filtrarVentas()
  const chartConfig = {
    desktop: {
      label: 'Desktop',
      color: 'hsl(var(--chart-1))'
    },
    mobile: {
      label: 'Mobile',
      color: 'hsl(var(--chart-2))'
    }
  } satisfies ChartConfig

  const agruparPorMesYAño = (ventas: ValuesVentaToMetricas[], tipoFecha: 'fecha_inicio' | 'fecha_fin') => {
    return ventas.reduce((acumulador: Record<string, number>, venta: ValuesVentaToMetricas) => {
      const fecha = venta[tipoFecha]
      if (!fecha) return acumulador // Salir de la iteración si la fecha es null o undefined

      const [, mes, año] = fecha.split('/')
      const clave = `${año}-${mes}`
      if (!acumulador[clave]) {
        acumulador[clave] = 0
      }
      acumulador[clave]++
      return acumulador
    }, {})
  }

  const clientesEntrando = agruparPorMesYAño(ventas, 'fecha_inicio')
  const clientesSaliendo = agruparPorMesYAño(ventas, 'fecha_fin')
  const chartData = Object.keys(clientesEntrando)
    .map(mesAnio => ({
      month: mesAnio,
      Entraron: clientesEntrando[mesAnio] || 0,
      Salieron: clientesSaliendo[mesAnio] || 0
    }))
    .sort((a, b) => {
      const [aYear, aMonth] = a.month.split('-').map(Number)
      const [bYear, bMonth] = b.month.split('-').map(Number)
      return aYear === bYear ? aMonth - bMonth : aYear - bYear
    })

  const handleBarClick = (e: any): void => {
    setOpen({ estado: true, fecha: e.month })
  }

  return (
      <>
        <Card>
          <CardHeader>
            <CardTitle className='text-black'>Proyectos de Community Manager</CardTitle>
            {/* <CardDescription>January - June 2024</CardDescription> */}
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig}>
              <LineChart
                accessibilityLayer
                data={chartData}
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
                  dataKey="month"
                  tickLine={false}
                  axisLine={false}
                  tickMargin={8}
                  interval={0} // Muestra todas las etiquetas
                  // tickFormatter={(value) => value.slice(0, 3)}
                />
                <ChartTooltip cursor={false} content={<ChartTooltipContent className='text-black bg-white'/>} />
                <Line
                  dataKey="Entraron"
                  type="monotone"
                  stroke="#7BC9C9"
                  strokeWidth={2}
                  dot={false}
                />
                <Line
                  dataKey="Salieron"
                  type="monotone"
                  stroke="#E1356F"
                  strokeWidth={2}
                  dot={false}
                />
              </LineChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </>
  )
}
