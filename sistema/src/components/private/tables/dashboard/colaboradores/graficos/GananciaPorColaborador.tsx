/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip
} from '../../community_clientes/components/Chart'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '../../community_clientes/components/Card'
import { Cell, Label, Pie, PieChart, type TooltipProps } from 'recharts'
import { cn } from '../../../../../shared/cn'
import { getYear } from 'date-fns'
export const GananciaPorColaborador = ({ colaboradores, total, selectedDate }: any): JSX.Element => {
  const chartData = colaboradores
  const chartConfig: any = {
    visitors: {
      label: 'Visitors'
    },
    // Configuración dinámica basada en colaboradores
    ...Object.fromEntries(
      colaboradores.map((colaborador: any) => [
        colaborador.nombre, // Solo el primer nombre
        {
          label: colaborador.nombre,
          color: colaborador.fill
        }
      ])
    )
  } satisfies ChartConfig

  const CustomTooltip = ({
    payload
  }: TooltipProps<any, any>): JSX.Element | null => {
    if (payload && payload.length) {
      const { nombre, totalPrecio } = payload[0].payload
      return (
        <div className="grid min-w-[8rem] items-start gap-1.5 rounded-lg border border-border/50 bg-white text-black px-2.5 py-1.5 text-xs shadow-xl">
          <p className="text-sm font-semibold">
            {nombre}
          </p>
          <div className="flex gap-2 items-center">
            <div
              className={cn(
                'shrink-0 rounded-[2px] border-[--color-border] bg-[#7BC9C9] h-2.5 w-2.5'
              )}
            />
            <p className="text-xs font-medium">
              Total Generado: <span className="font-normal">S/ {totalPrecio}</span>
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="flex flex-col border-none shadow-none">
      <CardHeader className="items-center pb-0">
        <CardTitle className="text-black ">Total Generado</CardTitle>
        <CardDescription className="text-black/80">{getYear(selectedDate)}</CardDescription>
      </CardHeader>
      <CardContent className="flex-1 pb-0">
        <ChartContainer
          config={chartConfig}
          className="mx-auto aspect-square max-h-[350px]"
        >
          <PieChart>
            <ChartTooltip
              cursor={false}
              content={CustomTooltip}
            />
            <Pie
              data={chartData}
              dataKey="totalPrecio" // Usa el campo correcto
              nameKey="nombre" // Usa el campo correcto
              innerRadius={60}
              strokeWidth={5}
              labelLine={false}
              label={({
                cx,
                cy,
                midAngle,
                innerRadius,
                outerRadius
              }: any) => {
                const radius = innerRadius + (outerRadius - innerRadius) / 2
                const x = cx + radius * Math.cos((-midAngle * Math.PI) / 180)
                const y = cy + radius * Math.sin((-midAngle * Math.PI) / 180)
                return (
                  <text
                    x={x}
                    y={y}
                    fill="white"
                    textAnchor={x > cx ? 'start' : 'end'}
                    dominantBaseline="central"
                  >
                  </text>
                )
              }}
            >
              {chartData.map((entry: any) => (
                <Cell key={entry.nombre} fill={entry.fill} />
              ))}
              <Label
                content={({ viewBox }) => {
                  if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                    return (
                      <text
                        x={viewBox.cx}
                        y={viewBox.cy}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill="black"
                        fontSize={20}
                        fontWeight="bold"
                      >
                        <tspan x={viewBox.cx} y={viewBox.cy}>
                         S/ {total.toLocaleString()}
                        </tspan>
                        <tspan x={viewBox.cx} dy="1.2em" fontSize={14}>
                          Monto Total
                        </tspan>
                      </text>
                    )
                  }
                  return null
                }}
              />
            </Pie>
          </PieChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}