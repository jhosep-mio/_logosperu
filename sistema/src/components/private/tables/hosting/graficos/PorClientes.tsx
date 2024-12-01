import { Bar } from 'react-chartjs-2'

const PorClientes = ({ chartData }: any): JSX.Element => {
  return (
    <div>
      <Bar
        className='m-auto p-4 h-96 object-contain graficaas'
        data={chartData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: 'Cantidad de Ventas'
              }
            },
            x: {
              title: {
                display: true,
                text: 'Meses'
              }
            }
          }
        }}
      />
    </div>
  )
}

export default PorClientes
