/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
import { Bar, BarChart, CartesianGrid, type TooltipProps, XAxis, YAxis } from 'recharts'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../community_clientes/components/Card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip
} from '../../community_clientes/components/Chart'
import { cn } from '../../../../../shared/cn'
import { getYear } from 'date-fns'

export const GananciaPorMes = ({ proyectos, selectedDate }: any): JSX.Element => {
  const monthAbbreviationToFullName = (abbreviation: string): string | null => {
    const monthNamesFull = [
      'Enero',
      'Febrero',
      'Marzo',
      'Abril',
      'Mayo',
      'Junio',
      'Julio',
      'Agosto',
      'Septiembre',
      'Octubre',
      'Noviembre',
      'Diciembre'
    ]
    const monthAbbreviations = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic'
    ]
    const index = monthAbbreviations.indexOf(abbreviation)
    if (index !== -1) {
      return monthNamesFull[index]
    } else {
      return null // or you can return an appropriate message or throw an error
    }
  }

  const chartData = proyectos

  const chartConfig = {
    desktop: {
      label: 'cantidad',
      color: '#7BC9C9'
    },
    mobile: {
      label: 'totalPrecio',
      color: '#62a1a1'
    }
  } satisfies ChartConfig

  const CustomTooltip = ({
    payload
  }: TooltipProps<any, any>): JSX.Element | null => {
    if (payload && payload.length) {
      const { mes, cantidad, totalPrecio } = payload[0].payload
      return (
        <div className="grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-white text-black px-2.5 py-1.5 text-xs shadow-xl">
          <p className="text-sm font-semibold">
            {monthAbbreviationToFullName(mes)}
          </p>
          <div className='flex gap-2 items-center'>
            <div
                className={cn(
                  'shrink-0 rounded-[2px] border-[--color-border] bg-[#7BC9C9] h-2.5 w-2.5'
                )}
            />
            <p className="text-xs font-medium">
                Proyectos: <span className="font-normal">{cantidad}</span>
            </p>
          </div>
          <div className='flex gap-2 items-center'>
            <div
                className={cn(
                  'shrink-0 rounded-[2px] border-[--color-border] bg-[#62a1a1] h-2.5 w-2.5'
                )}
            />
            <p className="text-xs font-medium">
                Generado: <span className="font-normal"> S/ {(totalPrecio).toFixed(2)}</span>
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="border-none shadow-none">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-black ">Monto Generado por mes</CardTitle>
        <CardDescription className="text-black/80">{getYear(selectedDate)}</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px] w-full"
        >
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="mes"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              yAxisId="left"
              orientation="left"
              tickFormatter={(value) => value.toFixed(0)}
              axisLine={false}
              tickLine={false}
              tickMargin={10}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tickFormatter={(value) => `S/${value.toFixed(0)}`}
              axisLine={false}
              tickLine={false}
              tickMargin={10}
            />
            <ChartTooltip
              cursor={false}
              content={CustomTooltip}
            />
            <Bar
              yAxisId="left"
              dataKey="cantidad"
              fill="#7BC9C9"
              radius={4}
            />
            <Bar
              yAxisId="right"
              dataKey="totalPrecio"
              fill="#62a1a1"
              radius={4}
            />

          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
