import { Line } from 'react-chartjs-2'
import { type openFiltersValues, type ValuesPreventaModificate } from '../../../../../shared/schemas/Interfaces'
import { type Dispatch, type SetStateAction } from 'react'
import { MdOutlineZoomOutMap } from 'react-icons/md'

export const PorCrecimiento = ({
  filtrarClientes,
  setSelectedId,
  selectedId,
  setOpen
}: {
  filtrarClientes: () => ValuesPreventaModificate[]
  setSelectedId: Dispatch<SetStateAction<string | null>>
  selectedId: string | null
  setOpen: Dispatch<SetStateAction<openFiltersValues>>
}): JSX.Element => {
  const clientes = filtrarClientes()

  const formatearFecha = (fecha: string): string => {
    const [año, mes] = fecha.split('-') // Dividir la fecha en año y mes
    return `${año}-${mes.padStart(2, '0')}` // Añadir ceros a la izquierda si el mes es de un solo dígito
  }

  clientes.sort((a, b) => {
    const fechaA: any = new Date(a.created_at)
    const fechaB: any = new Date(b.created_at)
    return fechaA - fechaB
  })
  // Preprocesar los datos para contar el número de nuevos clientes por período de tiempo
  const newData = {
    labels: [],
    datasets: [
      {
        label: 'Nuevos clientes',
        data: [],
        fill: false,
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 2
      }
    ]
  }

  // Agrupar clientes por fecha de creación (por ejemplo, por mes)
  const clientesPorFecha = clientes.reduce(
    (acumulador: any, cliente: ValuesPreventaModificate) => {
      const fechaCreacion = new Date(cliente.created_at)
      const mes = fechaCreacion.getMonth() + 1 // Sumar 1 porque los meses en JavaScript van de 0 a 11
      const año = fechaCreacion.getFullYear()
      const clave = `${año}-${mes}`

      if (!acumulador[clave]) {
        acumulador[clave] = 0
      }

      acumulador[clave]++

      return acumulador
    },
    {}
  )

  Object.entries(clientesPorFecha).forEach(([clave, valor]) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    newData.labels.push(formatearFecha(clave)) // Formatear la fecha antes de agregarla
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    newData.datasets[0].data.push(valor)
  })
  let selectedPoint: any = ''
  const options = {
    onClick: () => {
      setOpen({ estado: true, fecha: selectedPoint.label })
    },
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
        mode: 'index',
        intersect: false,
        position: 'nearest',
        caretSize: 10,
        displayColors: false,
        borderWidth: 1,
        bodySpacing: 10,
        bodyFontSize: 14,
        titleFont: {
          size: 16

        },
        bodyFont: {
          size: 14
        },
        callbacks: {
          label: function (context: any) {
            let label: any = context.label || ''
            if (label) {
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              label += ': '
            }
            if (context.parsed.y !== null) {
              selectedPoint = context
              // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
              label += context.parsed.y.toFixed(2) + ' (' + context.dataset.data[context.dataIndex] + ')'
            }
            return label
          }

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
    <>
      <div className="flex justify-between px-4">
        <h1 className="w-full text-left text-gray-600 font-semibold text-xl ">
          Cantidad de clientes por fechas
        </h1>
        <div className='w-full flex gap-4 justify-end'>
            <button type='button' onClick={() => { setOpen({ estado: true, fecha: null }) }} className='bg-green-600 hover:bg-green-700 transition-colors px-3 text-white rounded-md'>Ver todos</button>
            <MdOutlineZoomOutMap
            className="text-2xl text-gray-600 cursor-pointer hover:text-gray-700 hover:scale-105"
            onClick={() => {
              if (selectedId == '4') {
                setSelectedId(null)
              } else {
                setSelectedId('4')
              }
            }}
            />
        </div>
      </div>

      <Line
        data={newData}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        options={options}
        className={`m-auto p-4 h-96 object-contain ${
          selectedId == '4' ? 'graficaaszoom' : 'graficaasnormal'
        }`}
      />
    </>
  )
}
