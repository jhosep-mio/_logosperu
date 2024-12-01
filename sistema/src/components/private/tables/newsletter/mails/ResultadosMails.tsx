/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Loading } from '../../../../shared/Loading'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
// import { toast } from 'sonner'
import useAuth from '../../../../../hooks/useAuth'
import {
  Card,
  CardContent,
  CardDescription,
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

export const ResultadosMails = (): JSX.Element => {
  const { id } = useParams()
  const { setTitle } = useAuth()
  const token = localStorage.getItem('token')
  const [camapana, setCampana] = useState<any>([])
  const [loading, setLoading] = useState(true)
  const [clientes, setClientes] = useState<any>([])
  const [chartData, setchartData] = useState<any>([])
  const [radialData, setRadialData] = useState<any>([])
  const [porcentajeApertura, setPorcentajeApertura] = useState<any>([])

  //   const [expandedIndex, setExpandedIndex] = useState<number | null>(null)

  //   const toggleAccordion = (index: number): void => {
  //     setExpandedIndex(expandedIndex == index ? null : index)
  //   }

  const [expandedIndex, setExpandedIndex] = useState<any | null>(null)

  const getOneBrief = async (): Promise<void> => {
    try {
      const { data } = await axios.get(
        `${Global.url}/newsletter/getOneCamapanaPrivate/${id ?? ''}`,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? `Bearer ${token}` : ''
            }`
          }
        }
      )
      const { data: dataPreventas } = await axios.get(
        `${Global.url}/indexCamapanas`,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? `Bearer ${token}` : ''
            }`
          }
        }
      )
      const dataPorHora: any = {}
      let totalCorreosEnviados = 0 // Asumiendo que obtienes esto de otro lugar
      //   const totalRebotes = 0
      //   const totalCancelaciones = 0
      //   const totalConversiones = 0
      //   const totalClics = 0
      //   const totalRespuestas = 0

      if (data?.abiertos) {
        totalCorreosEnviados = data?.correos
          ? JSON.parse(data?.correos)?.length
          : 0
        JSON.parse(data?.abiertos).forEach((correo: any) => {
          // Extraer la hora (en formato 24 horas)
          const fecha = new Date(correo.fechaHora)
          const hora = fecha.toLocaleString('en-US', {
            hour: '2-digit',
            hour12: false
          })
          if (!dataPorHora[hora]) {
            dataPorHora[hora] = { aperturas: 0, totalClicks: 0 }
          }
          dataPorHora[hora].aperturas += 1
          dataPorHora[hora].totalClicks += correo?.clicks
            ? correo?.clicks?.length
            : 0
        })
      }
      const chartDatas = Object.entries(dataPorHora).map(
        ([hora, datos]: any) => ({
          hora,
          aperturas: datos.aperturas,
          totalClicks: datos.totalClicks
        })
      )
      const openRate = chartDatas.reduce(
        (sum, data) => sum + data.aperturas,
        0
      )
      const faltantes = totalCorreosEnviados - openRate
      const porcentajeApertura = (openRate / totalCorreosEnviados) * 100
      setPorcentajeApertura(porcentajeApertura.toFixed(2))

      const radialData = [
        {
          name: 'Aperturas',
          value: openRate,
          abiertos: openRate,
          faltantes
        }
        // {
        //   name: 'Faltantes',
        //   value: faltantes,
        //   desktop: faltantes,
        //   mobile: faltantes
        // }
      ]
      setRadialData(radialData)
      setchartData(chartDatas)
      setCampana(data)
      setClientes(dataPreventas)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const toggleAccordion = (correo: number): void => {
    setExpandedIndex(expandedIndex == correo ? null : correo)
  }

  //   const consultarCliente = async (correo: string): Promise<void> => {
  //     setLoading(true)
  //     try {
  //       const { data } = await axios.get(
  //         `${Global.url}/showClienteWhereEmail/${correo ?? ''}`,
  //         {
  //           headers: {
  //             Authorization: `Bearer ${
  //               token !== null && token !== '' ? `Bearer ${token}` : ''
  //             }`
  //           }
  //         }
  //       )
  //       window.open(`/admin/lista-clientes/ver/${data.id}`, '_blank')
  //     } catch (error) {
  //       toast.error('Error al consultar cliente')
  //       console.log(error)
  //     } finally {
  //       setLoading(false)
  //     }
  //   }

  useEffect(() => {
    setTitle('')
    Promise.all([getOneBrief()]).then(() => {
      setLoading(false)
    })
  }, [])

  const correosAbiertos = camapana.abiertos
    ? JSON.parse(camapana.abiertos)
    : []

  function formatDate (dateString: any): string {
    const date = new Date(dateString)
    const options = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZone: 'UTC'
    }
    // @ts-expect-error
    return date.toLocaleString('es-PE', options)
  }

  // Contar cuántos correos tienen clics
  //   const correosConClicks = correosAbiertos.filter(
  //     (correo: { clicks: any[] }) => correo.clicks && correo.clicks.length > 0
  //   ).length

  const totalClicks = correosAbiertos.reduce(
    (total: any, correo: any) =>
      total + (correo.clicks ? correo.clicks.length : 0),
    0
  )

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

  //   // Convertir el objeto en un arreglo para el gráfico
  //   const chartData = Object.entries(dataPorHora).map(([hora, datos]) => ({
  //     hora,
  //     aperturas: datos.aperturas,
  //     totalClicks: datos.totalClicks
  //   }))

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
                  <div className="text-3xl font-bold">{camapana.nombre}</div>
                  <p className="text-sm text-gray-500">#{camapana.id}</p>
                </CardContent>
              </Card>
              <Card className="bg-white text-black border shadow-sm w-full h-fit">
                <CardHeader className="py-4">
                  <CardTitle className="text-main text-xl">
                    Total enviados
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {camapana?.correos
                      ? JSON.parse(camapana?.correos)?.length
                      : 0}
                  </div>
                  <p className="text-sm text-gray-500">
                    +5 % respecto al mes anterior
                  </p>
                </CardContent>
              </Card>
              <Card className="bg-white text-black border shadow-sm w-full h-fit">
                <CardHeader className="py-4">
                  <CardTitle className="text-main text-xl">
                    Total abiertos
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">
                    {camapana?.abiertos
                      ? JSON.parse(camapana?.abiertos)?.length
                      : 0}
                  </div>
                  <p className="text-sm text-gray-500">
                    -20 % respecto al mes anterior
                  </p>
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
                    +20 % respecto al mes anterior
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
                    <CardDescription className="text-black">
                      {formatDate(camapana.created_at)}
                    </CardDescription>
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
                                      {camapana?.correos
                                        ? JSON.parse(camapana?.correos)?.length
                                        : 0}
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
                <CardHeader>
                  <CardTitle className="text-main font-semibold leading-none tracking-tight">
                    Ultimos abiertos
                  </CardTitle>
                  <p className="text-sm text-gray-400">
                    Se abrieron{' '}
                    {camapana?.abiertos
                      ? JSON.parse(camapana?.abiertos)?.length
                      : 0}{' '}
                    correos para esta campaña
                  </p>
                </CardHeader>
                <CardContent className="h-[620px] overflow-hidden">
                  <div className="space-y-8">
                    {camapana.abiertos &&
                      JSON.parse(camapana.abiertos)
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
                              onClick={() => {
                                // @ts-expect-error
                                toggleAccordion(correo)
                              }}
                            >
                              <span className="relative flex shrink-0 overflow-hidden rounded-full h-9 w-9">
                                {clientes
                                  .filter(
                                    (cliente: any) =>
                                      cliente.email == correo.email
                                  )
                                  .map((cliente: any, index: number) => {
                                    if (cliente.sexo == 'mujer') {
                                      return (
                                        <img
                                          key={index}
                                          className="aspect-square h-full w-full"
                                          alt="Avatar"
                                          src="https://ui.shadcn.com/avatars/01.png"
                                        />
                                      )
                                    }
                                    return (
                                      <img
                                        key={index}
                                        className="aspect-square h-full w-full"
                                        alt="Avatar"
                                        src="https://ui.shadcn.com/avatars/02.png"
                                      />
                                    )
                                  })}
                              </span>
                              <div className="ml-4 space-y-1 text-black">
                                <p className="text-sm font-medium leading-none">
                                  {clientes
                                    .filter(
                                      (cliente: any) =>
                                        cliente.email == correo.email
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
                                + {correo?.clicks ? correo.clicks?.length : 0}
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
                  onClick={() => { setExpandedIndex(null) }}
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </>
  )
}
