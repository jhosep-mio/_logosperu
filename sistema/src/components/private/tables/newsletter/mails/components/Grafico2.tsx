import React from 'react'
import { Doughnut } from 'react-chartjs-2'
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js'

ChartJS.register(ArcElement, Tooltip, Legend)

interface Props {
  totalCorreos: number
  correosConClicks: number
}

const GraficoClicks: React.FC<Props> = ({ totalCorreos, correosConClicks }) => {
  const correosSinClicks = totalCorreos - correosConClicks
  const data = {
    labels: ['Correos con clics', 'Correos sin clics'],
    datasets: [
      {
        data: [correosConClicks, correosSinClicks],
        backgroundColor: ['rgba(54, 162, 235, 0.6)', 'rgba(255, 99, 132, 0.6)']
      }
    ]
  }

  return (
    <div className="my-6 flex flex-col h-full w-full mx-auto">
      <Doughnut data={data} className='mx-auto'/>
      <p className="text-black mt-4 font-bold h-full w-full">
        Correos con clics:{' '}
        {((correosConClicks / totalCorreos) * 100).toFixed(2)} %
      </p>
    </div>
  )
}

export default GraficoClicks
