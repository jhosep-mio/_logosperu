/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Pie } from 'react-chartjs-2'

const MetricaSoporte = ({ chartData }: any): JSX.Element => {
//   const selectedPoint: any = ''
  return (
    <div>
      <Pie
        className='m-auto p-4 h-60 md:h-96 object-contain graficaas'
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Cantidad de Soportes'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Meses'
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
              mode: 'index',
              intersect: false,
              position: 'nearest',
              caretSize: 10,
              displayColors: false,
              borderWidth: 1,
              bodySpacing: 10,
              titleFont: {
                size: 16
              },
              bodyFont: {
                size: 14
              },
              callbacks: {
                label: function (context) {
                  let label = ''
                  if (context.datasetIndex == 0) {
                    label = `${context.parsed} Soportes`
                  } else if (context.datasetIndex == 1) {
                    label = `${context.parsed} Minutos`
                  }
                  return label
                }
              }
            }
          }
        }}
      />
    </div>
  )
}

export default MetricaSoporte
