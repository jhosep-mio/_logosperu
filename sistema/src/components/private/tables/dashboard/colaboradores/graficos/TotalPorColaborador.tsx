/* eslint-disable @typescript-eslint/prefer-optional-chain */
import { Bar, BarChart, CartesianGrid, Legend, Tooltip as ChartTooltip, XAxis, YAxis, type TooltipProps } from 'recharts'
import { Card, CardContent } from '../../community_clientes/components/Card'
import { ChartContainer, type ChartConfig } from '../../community_clientes/components/Chart'
import { cn } from '../../../../../shared/cn'

export const TotalPorColaborador = ({ colaboradores }: any): JSX.Element => {
  const chartData = colaboradores
  const chartConfig = {
    visitors: {
      label: 'Colaboradores'
    },
    desktop: {
      label: 'Proyectos',
      color: '#7BC9C9'
    },
    mobile: {
      label: 'Productividad',
      color: '#62a1a1'
    }
  } satisfies ChartConfig

  const CustomTooltip = ({
    payload
  }: TooltipProps<any, any>): JSX.Element | null => {
    if (payload && payload.length) {
      const { nombre, Proyectos, Productividad } = payload[0].payload
      return (
        <div className="grid min-w-[10rem] items-start gap-1.5 rounded-lg border border-border/50 bg-white text-black px-2.5 py-1.5 text-xs shadow-xl">
          <p className="text-sm font-semibold">
            {nombre}
          </p>
          <div className='flex gap-2 items-center'>
            <div
                className={cn(
                  'shrink-0 rounded-[2px] border-[--color-border] bg-[#7BC9C9] h-2.5 w-2.5'
                )}
            />
            <p className="text-xs font-medium">
                Proyectos: <span className="font-normal">{Proyectos}</span>
            </p>
          </div>
          <div className='flex gap-2 items-center'>
            <div
                className={cn(
                  'shrink-0 rounded-[2px] border-[--color-border] bg-[#62a1a1] h-2.5 w-2.5'
                )}
            />
            <p className="text-xs font-medium">
                Productividad: <span className="font-normal">{(Productividad).toFixed(2)} % </span>
            </p>
          </div>
        </div>
      )
    }
    return null
  }

  return (
    <Card className='shadow-none border-none w-full'>
      <CardContent className="">
        <ChartContainer
          config={chartConfig}
        >
          <BarChart
            data={chartData}
            layout="vertical" // Cambia el diseño a horizontal
            width={800}
            height={400}
            margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              type="number"
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              type="category"
              dataKey="nombre"
              tickLine={false}
              axisLine={false}
              width={150} // Ajusta el ancho del eje Y para mayor espacio
            />
            <ChartTooltip
              cursor={false}
              content={CustomTooltip}
            />
            <Bar
              dataKey="Proyectos"
              fill="#7BC9C9"
              barSize={20} // Ajusta el tamaño de las barras
            />
            <Bar
              dataKey="Productividad"
              fill="#62a1a1"
              barSize={20} // Ajusta el tamaño de las barras
            />
            <Legend />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
