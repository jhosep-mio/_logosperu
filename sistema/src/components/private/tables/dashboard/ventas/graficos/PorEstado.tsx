import { Pie } from 'react-chartjs-2'
import { type filtrosValuesVentas, type ValuesVentaToMetricas } from '../../../../../shared/schemas/Interfaces'
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
      intersect: true,
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

export const PorEstado = ({
  filtrarVentas,
  setSelectedId,
  selectedId,
  filtroSeleccionado,
  setFiltroSeleccionado
}: {
  filtrarVentas: () => ValuesVentaToMetricas[]
  setSelectedId: Dispatch<SetStateAction<string | null>>
  selectedId: string | null
  filtroSeleccionado: filtrosValuesVentas | null
  setFiltroSeleccionado: Dispatch<SetStateAction<filtrosValuesVentas | null>>
}): JSX.Element => {
  const ventas = filtrarVentas()

  const countByGender: Record<string, number> = {
    Abandono: 0,
    Proceso: 0,
    Finalizado: 0
  }

  ventas.forEach((venta: ValuesVentaToMetricas) => {
    // Aquí debes implementar la lógica para contar la cantidad de personas por género
    if (venta.estado == '1') {
      countByGender.Abandono++
    } else if (venta.fecha_fin) {
      countByGender.Finalizado++
    } else {
      countByGender.Proceso++
    }
  })
  const total = Object.values(countByGender).reduce(
    (acc, value) => acc + value,
    0
  )
  const sortedKeys = Object.keys(countByGender)
  const sortedData = sortedKeys.map((key) => countByGender[key])
  const percentages = sortedData.map((value) =>
    ((value / total) * 100).toFixed(2)
  )

  const handleLegendClick = (legend: string): void => {
    if (filtroSeleccionado?.estado?.includes(legend)) {
      setFiltroSeleccionado((prev: any) => ({
        ...prev,
        estado: prev.estado.filter((gender: any) => gender !== legend)
      }))
    } else {
      setFiltroSeleccionado((prev: any) => {
        const updatedGeneros = prev?.estado === null ? [legend] : [...(prev?.estado || []), legend]
        return {
          ...prev,
          estado: updatedGeneros
        }
      })
    }
  }

  const chartData = {
    labels: sortedKeys.map(
      (key) =>
          `${key}`
    ),
    datasets: [
      {
        label: 'Todo',
        data: sortedData.map((value, index) =>
          !filtroSeleccionado?.estado || filtroSeleccionado.estado.length === 0
            ? value
            : filtroSeleccionado.estado.includes(sortedKeys[index]) ? value : 0
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
          Por Estado
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
                filtroSeleccionado?.estado?.length &&
                filtroSeleccionado?.estado?.length > 0 &&
                !filtroSeleccionado?.estado?.includes(key)
                  ? 'rgb(229 231 235)'
                  : chartData.datasets[0].backgroundColor[index],
              border:
                filtroSeleccionado?.estado?.length &&
                filtroSeleccionado?.estado?.length > 0 &&
                !filtroSeleccionado?.estado?.includes(key)
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
      {/* <div className="flex flex-wrap w-full justify-center gap-4 text-black mt-3">
        {sortedKeys.map((key, index) => (
          <span
            className={'px-1 cursor-pointer rounded-md bg-gray-200'}
            key={index}
            style={{
              backgroundColor: filtroSeleccionado?.estado?.length && filtroSeleccionado?.estado?.length > 0 && !filtroSeleccionado?.estado?.includes(key) ? 'rgb(229 231 235)' : chartData.datasets[0].backgroundColor[index],
              border: filtroSeleccionado?.estado?.length && filtroSeleccionado?.estado?.length > 0 && !filtroSeleccionado?.estado?.includes(key) ? '1px solid rgb(229 231 235)' : `1px solid ${chartData.datasets[0].borderColor[index]}` // Agrega un borde con el mismo color que el borde del gráfico
            }}
            onClick={() => {
              handleLegendClick(key)
            }}
          >
            {key } ({percentages[index]}%)
          </span>
        ))}
      </div> */}
      <Pie
        data={chartData}
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        options={options}
        className={`m-auto p-4 h-96 object-contain ${
            selectedId == '1' ? 'graficaaszoom2' : 'graficaas22'
          }`}
      />
    </>
  )
}
