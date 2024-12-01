import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js'
import { useEffect, useState } from 'react'
import { Bar } from 'react-chartjs-2'
import 'chart.js/auto'
import { getDatas } from '../../../../shared/FetchingData'
import { Loading } from '../../../../shared/Loading'
ChartJS.register(ArcElement, Tooltip, Legend)
// Definimos el tipo para los datos del cliente

const optionsEdad = {
  scales: {
    x: {
      ticks: {
        font: {
          size: 14 // Ajusta el tamaño de las etiquetas del eje x aquí
        }
      }
    },
    y: {
      ticks: {
        font: {
          size: 14 // Ajusta el tamaño de las etiquetas del eje y aquí
        }
      }
    }
  },
  plugins: {
    legend: {
      display: true,
      labels: {
        font: {
          size: 20 // Ajusta el tamaño de las letras aquí
        }
      }
    },
    tooltip: {
      titleFont: {
        size: 18 // Ajusta el tamaño del título del tooltip aquí
      },
      bodyFont: {
        size: 18 // Ajusta el tamaño del cuerpo del tooltip aquí
      }
    }
  },
  elements: {
    bar: {
      borderWidth: 2 // Ajusta el ancho de las barras aquí
    },
    point: {
      radius: 4, // Ajusta el tamaño de los puntos aquí
      borderWidth: 2 // Ajusta el ancho de los puntos aquí
    }
  }
}

// const optionsEdad = {
//   scales: {
//     y: {
//       beginAtZero: true,
//       ticks: {
//         callback: function (value, index, values) {
//           return value + '%'
//         }
//       }
//     }
//   },
//   plugins: {
//     legend: {
//       display: true,
//       title: {
//         display: true,
//         text: 'Personas con descargas de archivos',
//         font: {
//           size: 18 // Ajusta el tamaño del título aquí
//         }
//       },
//       labels: {
//         font: {
//           size: 14 // Ajusta el tamaño de las letras aquí
//         }
//       }
//     }
//   },
//   elements: {
//     bar: {
//       borderWidth: 2 // Ajusta el ancho de las barras aquí
//     },
//     point: {
//       radius: 4, // Ajusta el tamaño de los puntos aquí
//       borderWidth: 2 // Ajusta el ancho de los puntos aquí
//     }
//   },
//   scales: {
//     x: {
//       ticks: {
//         font: {
//           size: 14 // Ajusta el tamaño de las etiquetas del eje x aquí
//         }
//       }
//     },
//     y: {
//       ticks: {
//         font: {
//           size: 14 // Ajusta el tamaño de las etiquetas del eje y aquí
//         }
//       }
//     }
//   }
// }

export default function LinesChart (): JSX.Element {
  const [clientes, setClientes] = useState<never[]>([])
  const [loading, setLoading] = useState(true)
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [dataEdad, setDataEdad] = useState<any>({
    labels: [],
    datasets: [
      {
        label: 'Cantidad de Personas por Rango de Edad',
        data: [],
        backgroundColor: [],
        borderColor: [],
        borderWidth: 1
      }
    ]
  })

  useEffect(() => {
    Promise.all([getDatas('indexToVencidos', setClientes, setTotalRegistros)])
      .then(() => {
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  useEffect(() => {
    todasLasEdades()
  }, [clientes])

  const todasLasEdades = (): void => {
    if (clientes.length > 0) {
      const countByAgeRange: Record<string, number> = {
        'Si-descargo': 0,
        'No-descargo': 0
      }

      clientes.forEach((cliente: { limitar_archivos: number }) => {
        const limite = cliente.limitar_archivos
        if (limite != null) {
          countByAgeRange['Si-descargo']++
        } else {
          countByAgeRange['No-descargo']++
        }
      })

      const total = Object.values(countByAgeRange).reduce((acc, value) => acc + value, 0)
      const sortedKeys = Object.keys(countByAgeRange)
      const sortedData = sortedKeys.map((key) => countByAgeRange[key])
      const percentages = sortedData.map((value) => ((value / total) * 100).toFixed(2))

      const chartData = {
        labels: sortedKeys.map((key, index) => `${key} (${percentages[index]}%)`),
        datasets: [
          {
            label: 'Descargas de archivos',
            data: sortedData,
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',
              'rgba(255, 206, 86, 0.2)',
              'rgba(54, 162, 235, 0.2)',
              'rgba(75, 192, 192, 0.2)',
              'rgba(153, 102, 255, 0.2)',
              'rgba(255, 159, 64, 0.2)'
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',
              'rgba(255, 206, 86, 1)',
              'rgba(54, 162, 235, 1)',
              'rgba(75, 192, 192, 1)',
              'rgba(153, 102, 255, 1)',
              'rgba(255, 159, 64, 1)'
            ],
            borderWidth: 1
          }
        ]
      }

      setDataEdad(chartData)
    }
  }

  return (
    <div className="text-black w-full flex flex-col justify-center items-center">
      {loading && <Loading />}
      <section className="flex justify-between items-center section_metricas">
        <h2 className="text-black font-bold text-xl block w-full inset-0 text-center">
          {totalRegistros} REGISTROS
        </h2>
      </section>
        <>
          <section className="flex flex-row justify-center items-center w-full h-full gap-4 px-4 py-4">
            <div className="w-fit h-fit bg-white rounded-lg">
              <Bar
                data={dataEdad}
                options={optionsEdad}
                className="w-full h-full m-auto p-4 object-contain forzar_alto"
              />
            </div>
          </section>
        </>
    </div>
  )
}
