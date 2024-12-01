import { Bar } from 'react-chartjs-2'
import { type ValuesPreventaModificate } from '../../../../../shared/schemas/Interfaces'

export const Top10Clientes = ({ filtrarClientes }: { filtrarClientes: () => ValuesPreventaModificate[] }): JSX.Element => {
  const clientes = filtrarClientes()

  const nombresClientes = clientes.map(cliente => {
    const nombresArray = cliente.nombres.split(' ')
    const primerNombre = nombresArray[0].charAt(0).toUpperCase() + nombresArray[0].slice(1).toLowerCase()
    const apellidosArray = cliente.apellidos.split(' ')
    const primerApellido = apellidosArray[0].charAt(0).toUpperCase() + apellidosArray[0].slice(1).toLowerCase()
    return `${primerNombre} ${primerApellido}`
  })

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const cantidadProyectos = clientes.map(cliente => cliente.cantidad_proyectos)
  const data = {
    labels: nombresClientes,
    datasets: [
      {
        label: 'Cantidad de Proyectos',
        data: cantidadProyectos,
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

  const options = {
    indexAxis: 'y',
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    },
    plugins: {
      legend: {
        display: true,
        labels: {
          font: {
            size: 16 // Ajusta el tamaño de las letras aquí
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

  return (
        <Bar
        data={data}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        options={options}
        className="m-auto p-4 object-contain graficaas"
        />
  )
}
