/* eslint-disable @typescript-eslint/prefer-optional-chain */
import {
  Bar,
  BarChart,
  CartesianGrid,
  XAxis,
  type TooltipProps
} from 'recharts'
import { Card, CardContent } from '../../community_clientes/components/Card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip
} from '../../community_clientes/components/Chart'
import { cn } from '../../../../../shared/cn'

export const TotalPorMes = ({ proyectos }: any): JSX.Element => {
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
      label: 'Proyectos',
      color: '#7BC9C9'
    }
  } satisfies ChartConfig

  const CustomTooltip = ({
    payload
  }: TooltipProps<any, any>): JSX.Element | null => {
    if (payload && payload.length) {
      const { mes, total } = payload[0].payload
      return (
        <div className="grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-white text-black px-2.5 py-1.5 text-xs shadow-xl">
          <p className="text-sm font-semibold">
            {monthAbbreviationToFullName(mes)}
          </p>
          <div className="flex gap-2 items-center">
            <div
              className={cn(
                'shrink-0 rounded-[2px] border-[--color-border] bg-[#7BC9C9] h-2.5 w-2.5'
              )}
            />
            <p className="text-xs font-medium">
              Proyectos: <span className="font-normal">{total}</span>
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="border-none shadow-none">
      <CardContent className="pb-0">
        <ChartContainer config={chartConfig}>
          <BarChart data={chartData}>
            <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#7BC9C9" stopOpacity={0.9} />
                <stop offset="95%" stopColor="#7BC9C9" stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="mes"
              tickLine={false}
              tickMargin={10}
              axisLine={false}
              tickFormatter={(value) => value.slice(0, 3)} // Mostrar solo las primeras 3 letras del mes
            />
            {/* <YAxis /> */}
            <ChartTooltip cursor={false} content={CustomTooltip} />
            <Bar dataKey="total" fill="url(#fillDesktop)" radius={8} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
