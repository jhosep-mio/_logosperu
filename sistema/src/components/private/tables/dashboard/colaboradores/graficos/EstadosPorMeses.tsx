// "use client"

// import * as React from "react"
// import { Area, AreaChart, CartesianGrid, XAxis } from "recharts"

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card"
// import {
//   ChartConfig,
//   ChartContainer,
//   ChartLegend,
//   ChartLegendContent,
//   ChartTooltip,
//   ChartTooltipContent,
// } from "@/components/ui/chart"
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select"
// const chartData = [
//   { date: "2024-04-01", desktop: 222, mobile: 150 },
//   { date: "2024-04-02", desktop: 97, mobile: 180 },
//   { date: "2024-04-03", desktop: 167, mobile: 120 },
//   { date: "2024-04-04", desktop: 242, mobile: 260 },
//   { date: "2024-04-05", desktop: 373, mobile: 290 },
//   { date: "2024-04-06", desktop: 301, mobile: 340 },
//   { date: "2024-04-07", desktop: 245, mobile: 180 },
//   { date: "2024-04-08", desktop: 409, mobile: 320 },
//   { date: "2024-04-09", desktop: 59, mobile: 110 },
//   { date: "2024-04-10", desktop: 261, mobile: 190 },
//   { date: "2024-04-11", desktop: 327, mobile: 350 },
//   { date: "2024-04-12", desktop: 292, mobile: 210 },
//   { date: "2024-04-13", desktop: 342, mobile: 380 },
//   { date: "2024-04-14", desktop: 137, mobile: 220 },
//   { date: "2024-04-15", desktop: 120, mobile: 170 },
//   { date: "2024-04-16", desktop: 138, mobile: 190 },
//   { date: "2024-04-17", desktop: 446, mobile: 360 },
//   { date: "2024-04-18", desktop: 364, mobile: 410 },
//   { date: "2024-04-19", desktop: 243, mobile: 180 },
//   { date: "2024-04-20", desktop: 89, mobile: 150 },
//   { date: "2024-04-21", desktop: 137, mobile: 200 },
//   { date: "2024-04-22", desktop: 224, mobile: 170 },
//   { date: "2024-04-23", desktop: 138, mobile: 230 },
//   { date: "2024-04-24", desktop: 387, mobile: 290 },
//   { date: "2024-04-25", desktop: 215, mobile: 250 },
//   { date: "2024-04-26", desktop: 75, mobile: 130 },
//   { date: "2024-04-27", desktop: 383, mobile: 420 },
//   { date: "2024-04-28", desktop: 122, mobile: 180 },
//   { date: "2024-04-29", desktop: 315, mobile: 240 },
//   { date: "2024-04-30", desktop: 454, mobile: 380 },
//   { date: "2024-05-01", desktop: 165, mobile: 220 },
//   { date: "2024-05-02", desktop: 293, mobile: 310 },
//   { date: "2024-05-03", desktop: 247, mobile: 190 },
//   { date: "2024-05-04", desktop: 385, mobile: 420 },
//   { date: "2024-05-05", desktop: 481, mobile: 390 },
//   { date: "2024-05-06", desktop: 498, mobile: 520 },
//   { date: "2024-05-07", desktop: 388, mobile: 300 },
//   { date: "2024-05-08", desktop: 149, mobile: 210 },
//   { date: "2024-05-09", desktop: 227, mobile: 180 },
//   { date: "2024-05-10", desktop: 293, mobile: 330 },
//   { date: "2024-05-11", desktop: 335, mobile: 270 },
//   { date: "2024-05-12", desktop: 197, mobile: 240 },
//   { date: "2024-05-13", desktop: 197, mobile: 160 },
//   { date: "2024-05-14", desktop: 448, mobile: 490 },
//   { date: "2024-05-15", desktop: 473, mobile: 380 },
//   { date: "2024-05-16", desktop: 338, mobile: 400 },
//   { date: "2024-05-17", desktop: 499, mobile: 420 },
//   { date: "2024-05-18", desktop: 315, mobile: 350 },
//   { date: "2024-05-19", desktop: 235, mobile: 180 },
//   { date: "2024-05-20", desktop: 177, mobile: 230 },
//   { date: "2024-05-21", desktop: 82, mobile: 140 },
//   { date: "2024-05-22", desktop: 81, mobile: 120 },
//   { date: "2024-05-23", desktop: 252, mobile: 290 },
//   { date: "2024-05-24", desktop: 294, mobile: 220 },
//   { date: "2024-05-25", desktop: 201, mobile: 250 },
//   { date: "2024-05-26", desktop: 213, mobile: 170 },
//   { date: "2024-05-27", desktop: 420, mobile: 460 },
//   { date: "2024-05-28", desktop: 233, mobile: 190 },
//   { date: "2024-05-29", desktop: 78, mobile: 130 },
//   { date: "2024-05-30", desktop: 340, mobile: 280 },
//   { date: "2024-05-31", desktop: 178, mobile: 230 },
//   { date: "2024-06-01", desktop: 178, mobile: 200 },
//   { date: "2024-06-02", desktop: 470, mobile: 410 },
//   { date: "2024-06-03", desktop: 103, mobile: 160 },
//   { date: "2024-06-04", desktop: 439, mobile: 380 },
//   { date: "2024-06-05", desktop: 88, mobile: 140 },
//   { date: "2024-06-06", desktop: 294, mobile: 250 },
//   { date: "2024-06-07", desktop: 323, mobile: 370 },
//   { date: "2024-06-08", desktop: 385, mobile: 320 },
//   { date: "2024-06-09", desktop: 438, mobile: 480 },
//   { date: "2024-06-10", desktop: 155, mobile: 200 },
//   { date: "2024-06-11", desktop: 92, mobile: 150 },
//   { date: "2024-06-12", desktop: 492, mobile: 420 },
//   { date: "2024-06-13", desktop: 81, mobile: 130 },
//   { date: "2024-06-14", desktop: 426, mobile: 380 },
//   { date: "2024-06-15", desktop: 307, mobile: 350 },
//   { date: "2024-06-16", desktop: 371, mobile: 310 },
//   { date: "2024-06-17", desktop: 475, mobile: 520 },
//   { date: "2024-06-18", desktop: 107, mobile: 170 },
//   { date: "2024-06-19", desktop: 341, mobile: 290 },
//   { date: "2024-06-20", desktop: 408, mobile: 450 },
//   { date: "2024-06-21", desktop: 169, mobile: 210 },
//   { date: "2024-06-22", desktop: 317, mobile: 270 },
//   { date: "2024-06-23", desktop: 480, mobile: 530 },
//   { date: "2024-06-24", desktop: 132, mobile: 180 },
//   { date: "2024-06-25", desktop: 141, mobile: 190 },
//   { date: "2024-06-26", desktop: 434, mobile: 380 },
//   { date: "2024-06-27", desktop: 448, mobile: 490 },
//   { date: "2024-06-28", desktop: 149, mobile: 200 },
//   { date: "2024-06-29", desktop: 103, mobile: 160 },
//   { date: "2024-06-30", desktop: 446, mobile: 400 },
// ]

// const chartConfig = {
//   visitors: {
//     label: "Visitors",
//   },
//   desktop: {
//     label: "Desktop",
//     color: "hsl(var(--chart-1))",
//   },
//   mobile: {
//     label: "Mobile",
//     color: "hsl(var(--chart-2))",
//   },
// } satisfies ChartConfig

// export function Component() {
//   const [timeRange, setTimeRange] = React.useState("90d")

//   const filteredData = chartData.filter((item) => {
//     const date = new Date(item.date)
//     const now = new Date()
//     let daysToSubtract = 90
//     if (timeRange === "30d") {
//       daysToSubtract = 30
//     } else if (timeRange === "7d") {
//       daysToSubtract = 7
//     }
//     now.setDate(now.getDate() - daysToSubtract)
//     return date >= now
//   })

//   return (

//   )
// }

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '../../community_clientes/components/Card'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from '../../community_clientes/components/Chart'

export const EstadosPorMeses = (proyectos: any): JSX.Element => {
  const chartData = proyectos.proyectos

  const chartConfig = {
    finalizado: {
      label: 'finalizado',
      color: '#328B71'
    },
    enProceso: {
      label: 'enProceso',
      color: '#76C4C4'
    },
    abandonado: {
      label: 'abandonado',
      color: '#DC2626'
    },
    deshabilitado: {
      label: 'deshabilitado',
      color: '#62A1A1'
    }

  } satisfies ChartConfig

  return (
    <Card className='shadow-none border-none'>
      <CardHeader className="flex items-center gap-2 space-y-0 border-b py-5 sm:flex-row">
        <div className="grid flex-1 gap-1 text-center sm:text-left">
          <CardTitle className='text-black lowercase first-letter:uppercase '>PROYECTOS POR ESTADO</CardTitle>
        </div>
      </CardHeader>
      <CardContent className="px-2 pt-4 sm:px-6 sm:pt-6">
        <ChartContainer
          config={chartConfig}
          className="aspect-auto h-[350px] w-full"
        >
          <AreaChart data={chartData}>
            <defs>
            <linearGradient id="fillFinal" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#328B71"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#328B71"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#62B0B0"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#62B0B0"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillDesh" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#62A1A1"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#62A1A1"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="#DC2626"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="#DC2626"
                  stopOpacity={0.1}
                />
              </linearGradient>

            </defs>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              interval={0} // Muestra todas las etiquetas
            />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  className='bg-white text-black'
                  indicator="dot"
                />
              }
            />
             <Area
              dataKey="enProceso"
              type="natural"
              fill="url(#fillDesktop)"
              stroke="#76C4C4"
              stackId="a"
            />
             <Area
              dataKey="deshabilitado"
              type="natural"
              fill="url(#fillDesh)"
              stroke="#62A1A1"
              stackId="a"
            />
            <Area
              dataKey="abandonado"
              type="natural"
              fill="url(#fillMobile)"
              stroke="#DC2626"
              stackId="a"
            />
            <Area
              dataKey="finalizado"
              type="natural"
              fill="url(#fillFinal)"
              stroke="#328B71"
              stackId="a"
            />

            <ChartLegend content={<ChartLegendContent className='text-black'/>} />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
    // <Card>
    //   <CardHeader>
    //     <CardTitle>Area Chart - Stacked Expanded</CardTitle>
    //   </CardHeader>
    //   <CardContent >
    //     <ChartContainer config={chartConfig} className='max-h-[350px]'>
    //       <AreaChart
    //         accessibilityLayer
    //         data={chartData}
    //         margin={{
    //           left: 12,
    //           right: 12,
    //           top: 12
    //         }}
    //         stackOffset="expand"
    //       >
    //         <CartesianGrid vertical={false} />
    //         <XAxis
    //           dataKey="month"
    //           tickLine={false}
    //           axisLine={false}
    //           tickMargin={8}
    //           tickFormatter={(value) => value.slice(0, 3)}
    //         />
    //         <ChartTooltip
    //           cursor={false}
    //           content={<ChartTooltipContent indicator="line" className='bg-white text-black'/>}
    //         />
    //         <Area
    //           dataKey="abandonado"
    //           type="natural"
    //           fill="#62B0B0"
    //           fillOpacity={0.1}
    //           stroke="#62B0B0"
    //           stackId="a"
    //         />
    //         <Area
    //           dataKey="enProceso"
    //           type="natural"
    //           fill="#76C4C4"
    //           fillOpacity={0.4}
    //           stroke="#76C4C4"
    //           stackId="a"
    //         />
    //         {/* <Area
    //           dataKey="deshabilitado"
    //           type="natural"
    //           fill="#62A1A1"
    //           fillOpacity={0.4}
    //           stroke="#62A1A1"
    //           stackId="a"
    //         /> */}
    //         <Area
    //           dataKey="finalizado"
    //           type="natural"
    //           fill="#62A1A1"
    //           fillOpacity={0.4}
    //           stroke="#62A1A1"
    //           stackId="a"
    //         />
    //       </AreaChart>
    //     </ChartContainer>
    //   </CardContent>
    // </Card>
  )
}