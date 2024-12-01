import { Doughnut } from 'react-chartjs-2'
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

export const PorEdad = ({
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

  const countByAgeRange: Record<string, number> = {
    '11-20': 0,
    '21-30': 0,
    '31-40': 0,
    '41-50': 0,
    '51+': 0,
    'No Registrado': 0
  }

  clientes.forEach((cliente: ValuesPreventaModificate) => {
    const edad = Number(cliente.edad)
    if (edad >= 11 && edad <= 20) {
      countByAgeRange['11-20']++
    } else if (edad >= 21 && edad <= 30) {
      countByAgeRange['21-30']++
    } else if (edad >= 31 && edad <= 40) {
      countByAgeRange['31-40']++
    } else if (edad >= 41 && edad <= 50) {
      countByAgeRange['41-50']++
    } else if (edad >= 51) {
      countByAgeRange['51+']++
    } else if (edad == null || !edad) {
      countByAgeRange['No Registrado']++
    }
  })

  const total = Object.values(countByAgeRange).reduce(
    (acc, value) => acc + value,
    0
  )
  const sortedKeys = Object.keys(countByAgeRange)
  const sortedData = sortedKeys.map((key) => countByAgeRange[key])
  const percentages = sortedData.map((value) =>
    ((value / total) * 100).toFixed(2)
  )

  const handleLegendClick = (legend: string): void => {
    if (filtroSeleccionado?.edad?.includes(legend)) {
      setFiltroSeleccionado((prev: any) => ({
        ...prev,
        edad: prev.edad.filter((age: any) => age !== legend)
      }))
    } else {
      setFiltroSeleccionado((prev: any) => {
        const updatedEdades =
          prev?.edad === null ? [legend] : [...(prev?.edad || []), legend]
        return {
          ...prev,
          edad: updatedEdades
        }
      })
    }
  }

  const chartData = {
    labels: sortedKeys.map(
      (key, index) =>
            `${key} (${
              filtroSeleccionado?.edad?.includes(key) ? percentages[index] : '0.00'
            }%)`
    ),
    datasets: [
      {
        label: 'Todo',
        data: sortedData.map((value, index) =>
          !filtroSeleccionado?.edad || filtroSeleccionado.edad.length === 0
            ? value
            : filtroSeleccionado.edad.includes(sortedKeys[index]) ? value : 0
        ),
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
        borderWidth: 2
      }
    ]
  }

  return (
    <>
      <div className="flex justify-between px-4">
        <h1 className="w-full text-left text-gray-600 font-semibold text-xl ">
          Por Edad
        </h1>
        <MdOutlineZoomOutMap
          className="text-2xl text-gray-600 cursor-pointer hover:text-gray-700 hover:scale-105"
          onClick={() => {
            if (selectedId == '1') {
              setSelectedId(null)
            } else {
              setSelectedId('1')
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
                filtroSeleccionado?.edad?.length &&
                filtroSeleccionado?.edad?.length > 0 &&
                !filtroSeleccionado?.edad?.includes(key)
                  ? 'rgb(229 231 235)'
                  : chartData.datasets[0].backgroundColor[index],
              border:
                filtroSeleccionado?.edad?.length &&
                filtroSeleccionado?.edad?.length > 0 &&
                !filtroSeleccionado?.edad?.includes(key)
                  ? '1px solid rgb(229 231 235)'
                  : `1px solid ${chartData.datasets[0].borderColor[index]}` // Agrega un borde con el mismo color que el borde del gráfico
            }}
            onClick={() => {
              handleLegendClick(key)
            }}
          >
            {key}{' '}
            ({percentages[index]}%)
          </span>
        ))}
      </div>
      <Doughnut
        data={chartData}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        options={options}
        className={`m-auto p-4 h-96 object-contain ${
            selectedId == '1' ? 'graficaaszoom' : 'graficaas'
        }`}
      />
    </>
  )
}
