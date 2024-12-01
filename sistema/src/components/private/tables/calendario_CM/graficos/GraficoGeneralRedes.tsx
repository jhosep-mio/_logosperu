import { Bar } from 'react-chartjs-2'

const GraficoGeneralRedes = ({
  facebookVisitas,
  facebookInteracciones,
  instagramVisitas,
  instagramInteracciones
}: {
  facebookVisitas: any
  facebookInteracciones: any
  instagramVisitas: any
  instagramInteracciones: any
}): JSX.Element => {
  const data = {
    labels: ['Visitas', 'Interacciones'],
    datasets: [
      {
        label: 'Facebook',
        backgroundColor: '#7BC9C9',
        borderColor: '#7BC9C9',
        borderWidth: 1,
        hoverBackgroundColor: '#7BC9C9',
        hoverBorderColor: '#7BC9C9',
        data: [facebookVisitas, facebookInteracciones]
      },
      {
        label: 'Instagram',
        backgroundColor: '#62A1A1',
        borderColor: '#62A1A1',
        borderWidth: 1,
        hoverBackgroundColor: '#62A1A1',
        hoverBorderColor: '#62A1A1',
        data: [instagramVisitas, instagramInteracciones]
      }
    ]
  }

  return (
    <div className="w-full">
      <h1 className="w-full text-left text-gray-600 font-semibold text-xl ">
        Gráfico de Visitas e Interacciones por Red Social
      </h1>
      <Bar data={data} />
    </div>
  )
}

export default GraficoGeneralRedes
