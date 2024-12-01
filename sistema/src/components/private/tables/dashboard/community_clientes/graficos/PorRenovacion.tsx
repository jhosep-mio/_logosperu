/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
import { Bar } from 'react-chartjs-2'
import {
  type ValuesVentaToMetricas
} from '../../../../../shared/schemas/Interfaces'
import { type Dispatch, type SetStateAction, useState } from 'react'
import { limpiarCadena } from '../../../../../shared/functions/QuitarAcerntos'
import { ModalDetalleHorasCol } from '../modals/ModalDetalleHorasCol'

export const PorRenovacion = ({
  filtrarVentas,
  selectedId,
  colaboradores
}: {
  filtrarVentas: () => ValuesVentaToMetricas[]
  setSelectedId: Dispatch<SetStateAction<string | null>>
  selectedId: string | null
  colaboradores: any
}): JSX.Element => {
  const [openModal, setOpenModal] = useState<any>({ estado: false, id_proyecto: null, marca: null, cliente: null })
  const ventas = filtrarVentas()
  const usuarios = colaboradores.filter((col: any) => col.horario_laboral != null)

  const renovacionesPorCliente: any = {}
  const nombresMarcas: any = {}
  const idProyectos: any = {}
  const nombresClientesList: any = {}

  ventas.forEach((venta: any) => {
    if (venta.renovacion) {
      JSON.parse(venta.renovacion).fechas.forEach((_fecha: any) => {
        const cliente = limpiarCadena(venta.id_contrato)
        if (!renovacionesPorCliente[cliente]) {
          renovacionesPorCliente[cliente] = 0
        }
        renovacionesPorCliente[cliente]++
        nombresMarcas[cliente] = venta?.nombre_marca ?? 'Sin marca' // Asigna el nombre del cliente
        idProyectos[cliente] = venta?.id
        nombresClientesList[cliente] = `${venta?.nombres} ${venta?.apellidos}`
      })
    }
  })
  const nombresClientes = Object.keys(renovacionesPorCliente)
  const cantidadRenovaciones = Object.values(renovacionesPorCliente)

  const data = {
    labels: nombresClientes,
    datasets: [
      {
        label: '# de Renovaciones',
        data: cantidadRenovaciones,
        backgroundColor: 'rgba(91, 198, 198, 0.2)',
        borderColor: 'rgba(91, 198, 198, 1)',
        borderWidth: 1
      }
    ]
  }
  let selectedPoint: any = ''

  const options = {
    onClick: () => {
      setOpenModal({ estado: true, id_proyecto: selectedPoint.idProyecto, marca: selectedPoint.cliente, cliente: selectedPoint.nombre })
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
            const cliente = nombresMarcas[nombresClientes[context.dataIndex]]
            const idProyecto = idProyectos[nombresClientes[context.dataIndex]]
            const nombre = nombresClientesList[nombresClientes[context.dataIndex]]
            const renovaciones = context.dataset.data[context.dataIndex]
            let label: any = ''
            if (context.parsed.y !== null) {
              selectedPoint = { idProyecto, cliente, nombre }
              label += `${cliente} - ${renovaciones} renovacion(es)`
            }
            return label
          }
        }
        // callbacks: {
        //     label: function (context: any) {
        //       const cliente = nombresPorCliente[nombresClientes[context.dataIndex]];
        //       const renovaciones = context.dataset.data[context.dataIndex];
        //       return `${cliente}: ${renovaciones} renovaciones`;
        //     }
        //   }
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
        <h1 className="w-full text-left text-gray-600 font-semibold text-xl line-clamp-1">
          Cantidad de renovaciones por contrato
        </h1>
        {/* <div className="w-full flex gap-4 justify-end">
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
        </div> */}
      </div>
      <Bar
        data={data}
        // @ts-expect-error
        options={options}
        className={`m-auto p-4 h-96 object-contain ${
          selectedId == '4' ? 'graficaaszoom2' : 'graficaas'
        }`}
      />

        <ModalDetalleHorasCol setOpen={setOpenModal} open={openModal} usuarios={usuarios}/>
    </>
  )
}
