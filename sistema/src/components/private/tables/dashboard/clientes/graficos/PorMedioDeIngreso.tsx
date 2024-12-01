import { Bar } from 'react-chartjs-2'
import {
  type filtrosValues,
  type ValuesPreventaModificate
} from '../../../../../shared/schemas/Interfaces'
import { type Dispatch, type SetStateAction } from 'react'
import { MdOutlineZoomOutMap } from 'react-icons/md'

const options = {
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
      borderWidth: 1,
      bodySpacing: 10,
      bodyFontSize: 14,
      titleFont: {
        size: 16
      },
      bodyFont: {
        size: 14
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

export const PorMedioDeIngreso = ({
  filtrarClientes,
  setSelectedId,
  selectedId,
  filtroSeleccionado,
  setFiltroSeleccionado
}: {
  filtrarClientes: () => ValuesPreventaModificate[]
  setSelectedId: Dispatch<SetStateAction<string | null>>
  selectedId: string | null
  filtroSeleccionado: filtrosValues | null
  setFiltroSeleccionado: Dispatch<SetStateAction<filtrosValues | null>>
}): JSX.Element => {
  const clientes = filtrarClientes()

  const countByMedio: Record<string, number> = {
    Facebook: 0,
    Google: 0,
    Instagram: 0,
    Ventas: 0,
    'Post Venta': 0,
    Whatsapp: 0,
    Recomendación: 0
  }

  clientes.forEach((cliente: ValuesPreventaModificate) => {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const medio_ingreso = String(cliente.medio_ingreso)
    // Mapear el valor de medio_ingreso a la cadena correspondiente
    const medio =
      medio_ingreso == '0'
        ? 'Facebook'
        : medio_ingreso == '1'
          ? 'Google'
          : medio_ingreso == '2'
            ? 'Ventas'
            : medio_ingreso == '3'
              ? 'Post Venta'
              : medio_ingreso == '4'
                ? 'Whatsapp'
                : medio_ingreso == '5'
                  ? 'Instagram'
                  : medio_ingreso == '6'
                    ? 'Recomendación'
                    : ''

    // Incrementar el contador para el medio de ingreso correspondiente
    if (medio in countByMedio) {
      countByMedio[medio]++
    }
  })

  const total = Object.values(countByMedio).reduce(
    (acc, value) => acc + value,
    0
  )
  const sortedKeys = Object.keys(countByMedio)
  const sortedData = sortedKeys.map((key) => countByMedio[key])
  const percentages = sortedData.map((value) =>
    ((value / total) * 100).toFixed(2)
  )

  const handleLegendClick = (legend: string): void => {
    if (filtroSeleccionado?.ingreso?.includes(legend)) {
      setFiltroSeleccionado((prev: any) => ({
        ...prev,
        ingreso: prev.ingreso.filter((age: any) => age !== legend)
      }))
    } else {
      setFiltroSeleccionado((prev: any) => {
        const updatedEdades =
          prev?.ingreso === null ? [legend] : [...(prev?.ingreso || []), legend]
        return {
          ...prev,
          ingreso: updatedEdades
        }
      })
    }
  }

  const chartData = {
    labels: sortedKeys.map(
      (key, index) =>
        `${key} (${
          filtroSeleccionado?.ingreso?.includes(key) ? percentages[index] : '0.00'
        }%)`
    ),
    datasets: [
      {
        label: 'Medio de ingreso',
        data: sortedData.map((value, index) =>
          !filtroSeleccionado?.ingreso || filtroSeleccionado.ingreso.length === 0
            ? value
            : filtroSeleccionado.ingreso.includes(sortedKeys[index])
              ? value
              : 0
        ),
        backgroundColor: [
          'rgba(203, 109, 81, 0.2)',
          'rgba(255, 99, 132, 0.2)',
          'rgba(255, 206, 86, 0.2)',
          'rgba(54, 162, 235, 0.2)',
          'rgba(75, 192, 192, 0.2)',
          'rgba(153, 102, 255, 0.2)',
          'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
          'rgba(203, 109, 81, 1)',
          'rgba(255, 99, 132, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)',
          'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 2
      }
    ]
  }

  return (
    <>
      <div className="flex justify-between px-4">
        <h1 className="w-full text-left text-gray-600 font-semibold text-xl ">
          Por Medio de ingreso
        </h1>
        <MdOutlineZoomOutMap
          className="text-2xl text-gray-600 cursor-pointer hover:text-gray-700 hover:scale-105"
          onClick={() => {
            if (selectedId == '3') {
              setSelectedId(null)
            } else {
              setSelectedId('3')
            }
          }}
        />
      </div>
      <div className="flex flex-wrap w-full justify-center gap-4 text-black mt-3">
        {sortedKeys.map((key, index) => (
          <span
            className={'px-1 cursor-pointer rounded-md bg-gray-200'}
            key={index}
            style={{
              backgroundColor:
                filtroSeleccionado?.ingreso?.length &&
                filtroSeleccionado?.ingreso?.length > 0 &&
                !filtroSeleccionado?.ingreso?.includes(key)
                  ? 'rgb(229 231 235)'
                  : chartData.datasets[0].backgroundColor[index],
              border:
                filtroSeleccionado?.ingreso?.length &&
                filtroSeleccionado?.ingreso?.length > 0 &&
                !filtroSeleccionado?.ingreso?.includes(key)
                  ? '1px solid rgb(229 231 235)'
                  : `1px solid ${chartData.datasets[0].borderColor[index]}` // Agrega un borde con el mismo color que el borde del gráfico
            }}
            onClick={() => {
              handleLegendClick(key)
            }}
          >
            {key} ({percentages[index]}%)
          </span>
        ))}
      </div>
      <Bar
        data={chartData}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        options={options}
        className={`m-auto p-4 h-96 object-contain ${
            selectedId == '3' ? 'graficaaszoom' : 'graficaas'
        }`}
      />
    </>
  )
}
