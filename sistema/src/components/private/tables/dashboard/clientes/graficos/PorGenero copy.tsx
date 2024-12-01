import { Pie } from 'react-chartjs-2'
import { type filtrosValues, type ValuesPreventaModificate } from '../../../../../shared/schemas/Interfaces'
import { useState, type Dispatch, type SetStateAction } from 'react'
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

export const PorGenero = ({
  filtrarClientes,
  setSelectedId,
  zoom,
  selectedId
}: {
  filtrarClientes: () => ValuesPreventaModificate[]
  setSelectedId: Dispatch<SetStateAction<string | null>>
  zoom: boolean
  selectedId: string | null
  filtroSeleccionado: filtrosValues | null
}): JSX.Element => {
  const clientes = filtrarClientes()

  const countByGender: Record<string, number> = {
    Hombres: 0,
    Mujeres: 0,
    Otros: 0,
    NoRegistrado: 0
  }

  clientes.forEach((cliente: ValuesPreventaModificate) => {
    const sexo = cliente.sexo
    // Aquí debes implementar la lógica para contar la cantidad de personas por género
    if (sexo == 'hombre') {
      countByGender.Hombres++
    } else if (sexo == 'mujer') {
      countByGender.Mujeres++
    } else if (sexo == 'otro') {
      countByGender.Otros++
    } else {
      countByGender.NoRegistrado++
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
  const [selectedGenders, setSelectedGenders] = useState<string[]>([])

  const handleLegendClick = (legend: string): void => {
    if (selectedGenders.includes(legend)) {
      setSelectedGenders(selectedGenders.filter((gender) => gender !== legend))
    } else {
      setSelectedGenders([...selectedGenders, legend])
    }
  }

  const chartData = {
    labels: sortedKeys.map(
      (key, index) =>
          `${key} (${
            selectedGenders.includes(key) ? percentages[index] : '0.00'
          }%)`
    ),
    datasets: [
      {
        label: 'Todo',
        data: sortedData.map((value, index) =>
          selectedGenders.length === 0 || selectedGenders.includes(sortedKeys[index]) ? value : 0
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
          Por genero
        </h1>
        <MdOutlineZoomOutMap
          className="text-2xl text-gray-600 cursor-pointer hover:text-gray-700 hover:scale-105"
          onClick={() => {
            if (selectedId == '2') {
              setSelectedId(null)
            } else {
              setSelectedId('2')
            }
          }}
        />
      </div>
      <div className="flex w-full justify-center gap-4 text-black mt-3">
        {sortedKeys.map((key, index) => (
          <span
            className={'px-1 cursor-pointer rounded-md bg-gray-200'}
            key={index}
            style={{
              backgroundColor: selectedGenders.length > 0 && !selectedGenders.includes(key) ? 'rgb(229 231 235)' : chartData.datasets[0].backgroundColor[index],
              border: selectedGenders.length > 0 && !selectedGenders.includes(key) ? '1px solid rgb(229 231 235)' : `1px solid ${chartData.datasets[0].borderColor[index]}` // Agrega un borde con el mismo color que el borde del gráfico
            }}
            onClick={() => {
              handleLegendClick(key)
            }}
          >
            {key} ({percentages[index]}%)
          </span>
        ))}
      </div>
      <Pie
        data={chartData}
        options={options}
        className={`m-auto p-4 h-96 object-contain ${zoom ? 'graficaaszoom' : 'graficaas'}`}
      />
    </>
  )
}
