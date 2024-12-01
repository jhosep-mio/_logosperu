/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Bar } from 'react-chartjs-2'

const SalesChart = ({ chartData, setOpenList }: any): JSX.Element => {
  let selectedPoint: any = ''
  return (
    <div>
      <Bar
        className='m-auto p-4 h-60 md:h-96 object-contain graficaas'
        data={chartData}
        options={{
          onClick: () => {
            setOpenList({ estado: true, fecha: selectedPoint.label })
          },
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Cantidad de Renovaciones'
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
                label: function (context: any) {
                  let label: any = ''
                  if (label) {
                    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                    label += ': '
                  }
                  if (context.parsed.y !== null) {
                    selectedPoint = context
                    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                    label +=
                      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
                        context.parsed.y + ' Renovaciones'
                  }
                  return label
                }
              }
              // callbacks: {
              //     label: function (context: any) {
              //       const cliente = nombresPorCliente[nombresClientes[context.dataIndex]];
              //       const renovaciones = context.dataset.data[context.dataIndex];
              //       return `${cliente}: ${renovaciones} renovaciones`;
              //     }
              //   }
            }
          }
        }}
      />
    </div>
  )
}

export default SalesChart
