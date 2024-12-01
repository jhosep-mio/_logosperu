/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
import { Pie } from 'react-chartjs-2'
import { type ValuesVentaToMetricas } from '../../../../../shared/schemas/Interfaces'
import { type Dispatch, type SetStateAction, useState } from 'react'

export const ConMasComentarios = ({
  filtrarVentas,
  selectedId
}: {
  filtrarVentas: () => ValuesVentaToMetricas[]
  setSelectedId: Dispatch<SetStateAction<string | null>>
  selectedId: string | null
}): JSX.Element => {
  const ventas = filtrarVentas()
  const [cantidadTop, setCantidadTop] = useState(5)
  const contadorComentariosPorProyecto: any = {}
  const nombresMarcas: any = {}
  const idProyectos: any = {}
  const nombresClientesList: any = {}

  ventas.forEach((venta: any) => {
    // Verificar si el objeto tiene la propiedad `community` y es un array
    if (venta.community) {
      JSON.parse(venta.community).forEach((post: any) => {
        if (post.comentarios != null && post.comentarios.length > 0) {
          const proyectoId = venta.id
          nombresMarcas[proyectoId] = venta?.nombre_marca ?? 'Sin marca'
          idProyectos[proyectoId] = venta?.id
          nombresClientesList[
            proyectoId
          ] = `${venta?.nombres} ${venta?.apellidos}`
          const cantidadComentarios = post.comentarios.length
          if (contadorComentariosPorProyecto[proyectoId]) {
            contadorComentariosPorProyecto[proyectoId] += cantidadComentarios
          } else {
            contadorComentariosPorProyecto[proyectoId] = cantidadComentarios
          }
        }
      })
    }
  })

  const proyectosOrdenados = Object.keys(contadorComentariosPorProyecto)
    .sort(
      (a, b) =>
        contadorComentariosPorProyecto[b] - contadorComentariosPorProyecto[a]
    )
    .slice(0, cantidadTop)

  const data = {
    labels: proyectosOrdenados.map((id) => nombresMarcas[id]),
    datasets: [
      {
        label: '# de Renovaciones',
        data: proyectosOrdenados.map(
          (id) => contadorComentariosPorProyecto[id]
        ),
        backgroundColor: [
          'rgba(255, 99, 132, 0.3)',
          'rgba(54, 162, 235, 0.3)',
          'rgba(255, 206, 86, 0.3)',
          'rgba(75, 192, 192, 0.3)',
          'rgba(153, 102, 255, 0.3)',
          'rgba(255, 159, 64, 0.3)',
          'rgba(255, 69, 0, 0.3)', // Naranja oscuro
          'rgba(0, 128, 0, 0.3)', // Verde oscuro
          'rgba(128, 0, 128, 0.3)', // Púrpura oscuro
          'rgba(255, 140, 0, 0.3)', // Naranja oscuro
          'rgba(218, 112, 214, 0.3)', // Orquídea oscura
          'rgba(70, 130, 180, 0.3)', // Azul acero claro
          'rgba(176, 196, 222, 0.3)' // Azul acero claro
        ],
        borderColor: [
          'rgba(255, 99, 132, 0.8)',
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
          'rgba(255, 69, 0, 0.8)', // Naranja oscuro
          'rgba(0, 128, 0, 0.8)', // Verde oscuro
          'rgba(128, 0, 128, 0.8)', // Púrpura oscuro
          'rgba(255, 140, 0, 0.8)', // Naranja oscuro
          'rgba(218, 112, 214, 0.8)', // Orquídea oscura
          'rgba(70, 130, 180, 0.8)', // Azul acero claro
          'rgba(176, 196, 222, 0.8)' // Azul acero claro
        ],
        borderWidth: 1
      }
    ]
  }
  let selectedPoint: any = ''

  const options = {
    onClick: () => {
      console.log(selectedPoint)
      window.open(`/admin/lista-servicios/avances/${selectedPoint}`, '_blank')
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
            const cliente = nombresMarcas[proyectosOrdenados[context.dataIndex]]
            const idProyecto = idProyectos[proyectosOrdenados[context.dataIndex]]
            const renovaciones = context.dataset.data[context.dataIndex]
            let label: any = ''
            if (context.parsed.y !== null) {
              selectedPoint = idProyecto
              label += `${cliente} - ${renovaciones} interacciones`
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
      <div className="h-full flex flex-col px-4">
        <div className="w-full flex justify-between">
          <h1 className="w-full text-left text-gray-600 font-semibold text-xl line-clamp-1">
            Con mas interacciones
          </h1>
          <div className="flex justify-between px-4">
            <select
              name=""
              id=""
              onChange={(e) => {
                setCantidadTop(Number(e.target.value))
              }}
              className="w-fit cursor-pointer outline-none text-left text-gray-600 font-semibold text-xl "
            >
              <option value="5">Top 5</option>
              <option value="10">Top 10</option>
              <option value="20">Top 20</option>
              <option value="200">Todos</option>
            </select>
          </div>
        </div>
        <div className="h-full bg-white rounded-xl p-2 flex flex-col items-center space-y-1 ">
          <Pie
            data={data}
            // @ts-expect-error
            options={options}
            className={`m-auto p-4 h-96 object-contain ${
              selectedId == '4' ? 'graficaaszoom2' : 'graficaas'
            }`}
          />
        </div>
      </div>
    </>
  )
}
