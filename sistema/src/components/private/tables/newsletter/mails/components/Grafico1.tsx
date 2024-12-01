import React from 'react'
import { Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
)

interface Props {
  totalCorreos: number
  correosAbiertos: number
}

const Grafico1: React.FC<Props> = ({ totalCorreos, correosAbiertos }) => {
  // Calcular el porcentaje de correos abiertos
  const porcentajeAbiertos =
    totalCorreos > 0 ? (correosAbiertos / totalCorreos) * 100 : 0

  const data = {
    labels: ['Total Correos', 'Correos Abiertos'],
    datasets: [
      {
        label: 'Correos',
        data: [totalCorreos, correosAbiertos],
        backgroundColor: [
          'rgba(75, 192, 192, 0.6)', // color para Total Correos
          'rgba(153, 102, 255, 0.6)' // color para Correos Abiertos
        ]
      }
    ]
  }

  const options = {
    plugins: {
      legend: {
        display: true
      },
      // Configuración del plugin de etiquetas de datos
      datalabels: {
        anchor: 'end',
        align: 'end',
        formatter: (value: number, context: any) => {
          // Mostrar el número y el porcentaje
          const total = context.chart.data.datasets[0].data.reduce(
            (a: number, b: number) => a + b,
            0
          )
          const percentage = total > 0 ? ((value / total) * 100).toFixed(1) : 0
          return `${value} (${percentage}%)`
        },
        color: '#000' // Color de las etiquetas
      }
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  }

  return (
    <div className="my-6 flex flex-col">
      <Bar data={data} options={options} />
      <p className="text-black mt-4 font-bold ">
        Porcetaje: {porcentajeAbiertos.toFixed(2)} %
      </p>
    </div>
  )
}

export default Grafico1
