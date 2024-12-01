/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useEffect, useState } from 'react'
import { Loading } from '../../../../shared/Loading'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
// import { toast } from 'sonner'
import useAuth from '../../../../../hooks/useAuth'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle
} from '../components/Card'
import {
  type ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '../components/Chart'
import {
  Bar,
  BarChart,
  CartesianGrid,
  Label,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  XAxis
} from 'recharts'
import InfiniteScrollModal from './components/InfiniteScrollModal'

export const ResultadosMailsGeneral = (): JSX.Element => {
  const { setTitle } = useAuth()
  const token = localStorage.getItem('token')
  const [, setCampana] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [clientes, setClientes] = useState<any>([])
  const [chartData, setchartData] = useState<any>([])
  const [radialData, setRadialData] = useState<any>([])
  const [porcentajeApertura, setPorcentajeApertura] = useState<any>([])
  const [totalEnviados, setTotalEnviados] = useState(0)
  const [totalAbiertos, setTotalAbiertos] = useState(0)
  const [totalClicks, setTotalClicks] = useState(0)
  const [totalData, setTotalData] = useState<any | null>(null)
  const [expandedIndex, setExpandedIndex] = useState<any | null>(null)

  const getAllBriefs = async (): Promise<void> => {
    try {
      const { data: allData } = await axios.get(
        `${Global.url}/newsletter/getCampanasPrivate`,
        {
          headers: {
            Authorization: `Bearer ${token ?? ''}`
          }
        }
      )
      const { data: dataPreventas } = await axios.get(
        `${Global.url}/indexCamapanas`,
        {
          headers: {
            Authorization: `Bearer ${token ?? ''}`
          }
        }
      )

      setTotalData(allData)

      const dataPorHora: Record<
      string,
      { aperturas: number, totalClicks: number }
      > = {}
      let totalCorreosEnviados = 0
      let totalCorreosAbiertos = 0

      // Iterar sobre todas las campañas
      allData.forEach((campana: any) => {
        if (campana.abiertos) {
          totalCorreosEnviados += campana.correos
            ? JSON.parse(campana.correos).length
            : 0

          JSON.parse(campana.abiertos).forEach((correo: any) => {
            totalCorreosAbiertos += 1 // Incrementa por cada correo abierto
            const fecha = new Date(correo.fechaHora)
            const hora = fecha.toLocaleString('en-US', {
              hour: '2-digit',
              hour12: false
            })

            if (!dataPorHora[hora]) {
              dataPorHora[hora] = { aperturas: 0, totalClicks: 0 }
            }
            dataPorHora[hora].aperturas += 1
            dataPorHora[hora].totalClicks += correo.clicks
              ? correo.clicks.length
              : 0
          })
        }
      })

      // Generar datos para gráficos
      const chartDatas = Object.entries(dataPorHora).map(([hora, datos]) => ({
        hora,
        aperturas: datos.aperturas,
        totalClicks: datos.totalClicks
      }))

      const openRate = chartDatas.reduce(
        (sum, data) => sum + data.aperturas,
        0
      )
      const faltantes = totalCorreosEnviados - openRate
      const porcentajeApertura = (openRate / totalCorreosEnviados) * 100

      const totalClicks = allData.reduce(
        (totalClicksAcc: number, campana: any) => {
          const correosAbiertos = campana.abiertos
            ? JSON.parse(campana.abiertos)
            : []

          // Acumular clicks en cada correo abierto de la campaña
          const clicksPorCampana = correosAbiertos.reduce(
            (total: number, correo: any) =>
              total + (correo.clicks ? correo.clicks.length : 0),
            0
          )

          // Acumular el total de clicks por todas las campañas
          return totalClicksAcc + clicksPorCampana
        },
        0
      )

      setTotalClicks(totalClicks)

      setPorcentajeApertura(porcentajeApertura.toFixed(2))
      setRadialData([
        {
          name: 'Aperturas',
          value: openRate,
          abiertos: openRate,
          faltantes
        }
      ])
      setchartData(chartDatas)
      setCampana(allData)
      setClientes(dataPreventas)
      setTotalEnviados(totalCorreosEnviados)
      setTotalAbiertos(totalCorreosAbiertos)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAccordion = (correo: number): void => {
    setExpandedIndex(expandedIndex == correo ? null : correo)
  }

  useEffect(() => {
    setTitle('')
    Promise.all([getAllBriefs()]).then(() => {
      setLoading(false)
    })
  }, [])

  const chartConfig = {
    views: {
      label: 'Page Views'
    },
    abiertos: {
      label: 'abiertos',
      color: 'hsl(var(--chart-1))'
    },
    faltantes: {
      label: 'faltantes',
      color: 'hsl(var(--chart-2))'
    }
  } satisfies ChartConfig

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <section className="w-full h-screen bg-white overflow-y-auto">
          <div className="p-6 grid grid-cols-7 bg-white gap-6">
            <div className="flex w-full gap-4 mt-0 col-span-7 h-fit">
              <Card className="bg-white text-black border shadow-sm w-full h-fit">
                <CardHeader className="py-4">
                  <CardTitle className="text-main text-xl">
                    Nombre campaña
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">Boletines</div>
                  <p className="text-sm text-gray-500">General</p>
                </CardContent>
              </Card>
              <Card className="bg-white text-black border shadow-sm w-full h-fit">
                <CardHeader className="py-4">
                  <CardTitle className="text-main text-xl">
                    Total enviados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalEnviados}</div>
                  <p className="text-sm text-gray-500">-</p>
                </CardContent>
              </Card>
              <Card className="bg-white text-black border shadow-sm w-full h-fit">
                <CardHeader className="py-4">
                  <CardTitle className="text-main text-xl">
                    Total abiertos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalAbiertos}</div>
                  <p className="text-sm text-gray-500">-</p>
                </CardContent>
              </Card>
              <Card className="bg-white text-black border shadow-sm w-full h-fit">
                <CardHeader className="py-4">
                  <CardTitle className="text-main text-xl">
                    Enlaces abiertos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{totalClicks}</div>
                  <p className="text-sm text-gray-500">
                    -
                  </p>
                </CardContent>
              </Card>
            </div>
            <div className="col-span-4 h-fit flex flex-col gap-4">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="text-main">Grafico general</CardTitle>
                </CardHeader>
                <CardContent>
                  <ChartContainer
                    config={chartConfig}
                    className="aspect-auto h-[254px] w-full"
                  >
                    <BarChart
                      accessibilityLayer
                      data={chartData}
                      margin={{
                        left: 12,
                        right: 12
                      }}
                    >
                      <CartesianGrid vertical={false} />
                      <XAxis
                        dataKey="hora"
                        tickLine={false}
                        axisLine={false}
                        tickMargin={8}
                        minTickGap={32}
                      />
                      <ChartTooltip
                        content={
                          <ChartTooltipContent
                            className="w-[150px] bg-white text-black"
                            nameKey="aperturas"
                            labelFormatter={(value) => {
                              return `Hora: ${value}`
                            }}
                          />
                        }
                      />
                      <Bar
                        dataKey="aperturas"
                        fill={'var(--color-aperturas)'}
                      />
                      <Bar dataKey="totalClicks" fill={'var(--color-clicks)'} />
                    </BarChart>
                  </ChartContainer>
                </CardContent>
              </Card>
              <div className="flex gap-10">
                <Card className="flex flex-col relative">
                  <CardHeader className="items-center pb-0">
                    <CardTitle className="text-black">Grafico Radial</CardTitle>
                  </CardHeader>
                  <CardContent className="flex flex-1 items-center pb-0">
                    <ChartContainer
                      config={chartConfig}
                      className="mx-auto aspect-square w-full max-w-[250px] h-[210px]"
                    >
                      <RadialBarChart
                        data={radialData}
                        endAngle={180}
                        innerRadius={80}
                        outerRadius={130}
                      >
                        <ChartTooltip
                          cursor={false}
                          content={<ChartTooltipContent hideLabel />}
                          // @ts-expect-error
                          className="w-[150px] bg-white text-black"
                        />
                        <PolarRadiusAxis
                          tick={false}
                          tickLine={false}
                          axisLine={false}
                        >
                          <Label
                            content={({ viewBox }) => {
                              if (
                                viewBox &&
                                'cx' in viewBox &&
                                'cy' in viewBox
                              ) {
                                return (
                                  <text
                                    x={viewBox.cx}
                                    y={viewBox.cy}
                                    textAnchor="middle"
                                  >
                                    <tspan
                                      x={viewBox.cx}
                                      y={(viewBox.cy ?? 0) - 16}
                                      className="fill-main text-2xl font-bold"
                                    >
                                      {totalEnviados}
                                    </tspan>
                                    <tspan
                                      x={viewBox.cx}
                                      y={(viewBox.cy ?? 0) + 4}
                                      className="fill-black"
                                    >
                                      Enviados
                                    </tspan>
                                  </text>
                                )
                              }
                            }}
                          />
                        </PolarRadiusAxis>
                        <RadialBar
                          dataKey="faltantes"
                          fill="#000000"
                          stackId="a"
                          cornerRadius={5}
                          className="stroke-transparent stroke-2"
                        />
                        <RadialBar
                          dataKey="abiertos"
                          stackId="a"
                          cornerRadius={5}
                          fill="#09C08F"
                          className="stroke-main bg-main  stroke-2"
                        />
                      </RadialBarChart>
                    </ChartContainer>
                  </CardContent>
                  <CardFooter className="flex-col gap-2 text-sm text-black absolute bottom-0 left-0 right-0 mx-auto">
                    <div className="flex items-center justify-center text-center gap-2 font-medium leading-none">
                      Porcetaje de apartura {porcentajeApertura} % para esta
                      camapaña
                    </div>
                  </CardFooter>
                </Card>
              </div>
            </div>
            <div className="w-full col-span-3 ">
              <Card className="">
                <CardHeader className='flex w-full flex-row justify-between items-center'>
                  <CardTitle className="text-main font-semibold leading-none tracking-tight">
                    Ultimos abiertos
                  </CardTitle>
                  <button onClick={() => { setOpen(!open) }} className='text-main_dark'>Ver todos</button>
                </CardHeader>
                <CardContent className="h-[620px] overflow-hidden">
                  <div className="space-y-8">
                    {totalData
                      ?.flatMap((campana: any) =>
                        campana.abiertos ? JSON.parse(campana.abiertos) : []
                      )
                      .filter((correo: any) => correo.email != 'ventas@hostbacon.lat' && correo.email != 'jamiom@ucvvirtual.edu.pe' && correo.email != 'jhmio2002@gmail.com')
                      ?.sort(
                        (a: any, b: any) =>
                          (b.clicks?.length || 0) - (a.clicks?.length || 0)
                      )
                      ?.map(
                        (
                          correo: {
                            email: string
                            fechaHora: string
                            clicks: any
                          },
                          index: number
                        ) => (
                          <div
                            className="flex items-center cursor-pointer"
                            key={index}
                            // @ts-ignore
                            onClick={() => { toggleAccordion(correo) }}
                          >
                            <span className="relative flex shrink-0 overflow-hidden rounded-full h-9 w-9">
                              {clientes
                                .filter(
                                  (cliente: any) =>
                                    cliente.email === correo.email
                                )
                                .map((cliente: any, idx: number) => (
                                  <img
                                    key={idx}
                                    className="aspect-square h-full w-full"
                                    alt="Avatar"
                                    src={
                                      cliente.sexo === 'mujer'
                                        ? 'https://ui.shadcn.com/avatars/01.png'
                                        : 'https://ui.shadcn.com/avatars/02.png'
                                    }
                                  />
                                ))}
                            </span>
                            <div className="ml-4 space-y-1 text-black">
                              <p className="text-sm font-medium leading-none">
                                {clientes
                                  .filter(
                                    (cliente: any) =>
                                      cliente.email === correo.email
                                  )
                                  .map(
                                    (cliente: any) =>
                                      `${cliente.nombres} ${cliente.apellidos}`
                                  )}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {correo.email}
                              </p>
                            </div>
                            <div className="ml-auto font-medium text-green-700">
                              + {correo.clicks ? correo.clicks.length : 0}
                            </div>
                          </div>
                        )
                      )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          {expandedIndex && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]">
              <div className="px-4 py-2 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  Enlaces visitados:
                </h3>
                <ul>
                  {expandedIndex.clicks.map(
                    (click: any, clickIndex: number) => (
                      <li key={clickIndex} className="mb-1">
                        <a
                          href={click.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {click.link}
                        </a>
                        <p className="text-xs text-gray-500">
                          Clickeado el:{' '}
                          {new Date(click.fechaHora).toLocaleString()}
                        </p>
                      </li>
                    )
                  )}
                </ul>
                <button
                  onClick={() => {
                    setExpandedIndex(null)
                  }}
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </section>
      )}
        <InfiniteScrollModal totalData={totalData} clientes={clientes} isOpen={open} setIsOpen={setOpen}/>
    </>
  )
}
