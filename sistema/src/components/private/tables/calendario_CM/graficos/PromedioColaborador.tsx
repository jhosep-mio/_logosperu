import { Pie } from 'react-chartjs-2'

const PromedioColaborador = ({ valor }: { valor: any }): JSX.Element => {
  const data = {
    datasets: [
      {
        data: [valor],
        backgroundColor: ['rgba(123, 201, 201, 0.5)'], // Color del medidor
        borderWidth: 0
      }
    ]
  }

  return (
    <>
      <div className="flex justify-between px-4">
        <h1 className="w-full text-left text-gray-600 font-semibold text-xl ">
          Promedio de visitas de WhastApp
        </h1>
      </div>
      <Pie
        data={data}
        className="m-auto p-4 h-96 object-contain graficaas"
      />
      <span className='block text-center text-black font-bold '>{valor.toFixed(2)}</span>
    </>
  )
}

export default PromedioColaborador
