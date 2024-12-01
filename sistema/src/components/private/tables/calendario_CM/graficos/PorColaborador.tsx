import { Doughnut } from 'react-chartjs-2'
import { useState, useEffect } from 'react'
import { MdOutlineZoomOutMap } from 'react-icons/md'

const options = {
  responsive: true,
  maintainAspectRatio: false,
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
      display: false,
      labels: {
        font: {
          size: 16 // Ajusta el tamaño de las letras aquí
        }
      }
    },
    tooltip: {
      caretSize: 10,
      borderWidth: 1,
      bodySpacing: 10,
      bodyFontSize: 14,
      titleFont: {
        size: 16
      },
      bodyFont: {
        size: 14
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

export const PorColaborador = ({
  eventos
}: {
  eventos: any[]
}): JSX.Element => {
  const [promedioVistas, setPromedioVistas] = useState<any>([])

  // Calcular el promedio de vistas por colaborador
  const calcularPromedioVistas = (): void => {
    const sumaVistasPorColaborador: any = {}
    const totalColaboradores: any = {}

    eventos?.forEach((evento: any) => {
      evento?.descripcion?.arrayArchivos?.forEach((arrayArchivo: any) => {
        arrayArchivo?.arrayColaboradores?.forEach((colaborador: any) => {
          if (colaborador.cantidadVistas) {
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            sumaVistasPorColaborador[colaborador.usuario.name] = (sumaVistasPorColaborador[colaborador.usuario.name] || 0) +
              Number(colaborador.cantidadVistas)
            // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
            totalColaboradores[colaborador.usuario.name] = (totalColaboradores[colaborador.usuario.name] || 0) + 1
          }
        })
      })
    })

    const promedios = []
    for (const [colaborador, sumaVistas] of Object.entries(
      sumaVistasPorColaborador
    )) {
      const total = totalColaboradores[colaborador]
      const promedio = Number(sumaVistas) / total
      promedios.push({ nombre: colaborador, promedio })
    }

    setPromedioVistas(promedios)
  }

  // Llamar a la función de cálculo al montar el componente
  useEffect(() => {
    calcularPromedioVistas()
  }, [eventos])

  const nombresColaboradores = promedioVistas.map((item: any) => item.nombre)
  const promediosVistas = promedioVistas.map((item: any) =>
    item.promedio.toFixed(2)
  )

  const chartData = {
    labels: nombresColaboradores,
    datasets: [
      {
        label: 'Promedio de Vistas por Colaborador',
        data: promediosVistas,
        backgroundColor: [
          'rgba(255, 99, 132, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
      }
    ]
  }

  return (
    <>
      <div className="flex justify-between px-4">
        <h1 className="w-full text-left text-gray-600 font-semibold text-xl ">
          Por Colaborador
        </h1>
        <MdOutlineZoomOutMap
          className="text-2xl text-gray-600 cursor-pointer hover:text-gray-700 hover:scale-105"
        />
      </div>
      <div className="flex flex-wrap w-full justify-center gap-4 text-black mt-3">
        {nombresColaboradores.map((key: string, index: number) => (
          <span
            className={'px-1 cursor-pointer rounded-md bg-gray-200'}
            key={index}
          >
            {key}
          </span>
        ))}
      </div>
      <Doughnut data={chartData} options={options} className='m-auto p-4 h-96 object-contain graficaas'/>
    </>
  )
}
