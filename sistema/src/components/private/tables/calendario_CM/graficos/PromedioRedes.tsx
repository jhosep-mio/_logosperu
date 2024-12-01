import { Bar } from 'react-chartjs-2'

const PromedioRedes = ({
  promVFacebook,
  promIFacebook,
  promVInstagram,
  promIInstagram
}: {
  promVFacebook: any
  promIFacebook: any
  promVInstagram: any
  promIInstagram: any
}): JSX.Element => {
  const data = {
    labels: ['Facebook', 'Instagram'],
    datasets: [
      {
        label: 'Promedio de Visitas',
        backgroundColor: '#7BC9C9',
        borderColor: '#7BC9C9',
        borderWidth: 1,
        hoverBackgroundColor: '#7BC9C9',
        hoverBorderColor: '#7BC9C9',
        data: [promVFacebook, promVInstagram]
      },
      {
        label: 'Promedio de Interacciones',
        backgroundColor: '#62A1A1',
        borderColor: '#62A1A1',
        borderWidth: 1,
        hoverBackgroundColor: '#62A1A1',
        hoverBorderColor: '#62A1A1',
        data: [promIFacebook, promIInstagram]
      }
    ]
  }

  return (
    <div>
      <h1 className="w-full text-left text-gray-600 font-semibold text-xl ">
        Promedio de Visitas e Interacciones por Red Social
      </h1>
      <Bar data={data} />
    </div>
  )
}

export default PromedioRedes
