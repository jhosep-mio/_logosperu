/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Dialog, DialogContent } from '@mui/material'
import { type Dispatch, type SetStateAction } from 'react'
import { Link } from 'react-router-dom'

export const ModalDetalleHorasCol = ({
  open,
  setOpen,
  usuarios
}: {
  open: any
  setOpen: Dispatch<SetStateAction<any>>
  usuarios: any
}): JSX.Element => {
  function calcularTiempoInvertidoEnProyecto (
    colaborador: any[],
    proyectoId: number
  ): number {
    let tiempoTotal = 0
    colaborador.forEach((col) => {
      if (col?.horario_laboral && JSON.parse(col.horario_laboral).length > 0) {
        JSON.parse(col.horario_laboral).forEach((horario: any) => {
          // Verificar dentro de detalle si hay entradas relacionadas al proyecto
          if (horario.detalle) {
            Object.values(horario.detalle).forEach((arrayDetalle: any): any => {
              arrayDetalle.forEach((detalleItem: any) => {
                if (
                  detalleItem.proyecto &&
                  detalleItem.proyecto.id == proyectoId
                ) {
                  const horaInicio = new Date(
                    `2024-03-18 ${detalleItem.horaInicio}`
                  )
                  const horaFin = new Date(`2024-03-18 ${detalleItem.horaFin}`)
                  if (
                    !isNaN(horaInicio.getTime()) &&
                    !isNaN(horaFin.getTime())
                  ) {
                    let diffMs = horaFin.getTime() - horaInicio.getTime()
                    // Ajustar el tiempo si los minutos terminan en _:59
                    if (detalleItem.horaFin.endsWith(':59')) {
                      diffMs += 60000 // Sumar un minuto en milisegundos
                    }
                    tiempoTotal += diffMs
                  }
                }
              })
            })
          }
        })
      }
    })
    // Convertir el tiempo a horas y minutos
    const horas = Math.floor(tiempoTotal / (1000 * 60 * 60))
    const minutos = Math.floor((tiempoTotal % (1000 * 60 * 60)) / (1000 * 60))
    return horas * 60 + minutos
  }
  // APLICAR FILTROS
  return (
    <div>
      <Dialog
        open={open?.estado}
        onClose={() => {
          setOpen({ estado: false, id_proyecto: null })
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className=""
      >
        <DialogContent className="w-[400px] ">
          <h2 className="text-gray-600 font-bold text-xl underline w-full text-center uppercase">
            TIEMPO  por colaborador
          </h2>
          <div className="pt-4 px-2">
            <Link to={`/admin/lista-servicios/avances/${open.id_proyecto}`}
            target='_blank'
            className="text-gray-700 hover:text-blue-600 transition-colors">
              <span className="font-semibold">Marca:</span> {open?.marca}
            </Link>
            <p className="text-gray-700">
              <span className="font-semibold">Cliente:</span> {open?.cliente}
            </p>
          </div>
          <hr className="my-3" />
          <div className="grid grid-cols-1 gap-4 w-full">
            {usuarios.map((col: any) => {
              const tiempoInvertido = calcularTiempoInvertidoEnProyecto(
                [col],
                open?.id_proyecto
              )
              if (tiempoInvertido > 0) {
                let tiempoMostrado = ''
                const horas = Math.floor(tiempoInvertido / 60)
                const minutos = tiempoInvertido % 60
                if (horas > 0) {
                  tiempoMostrado = `${horas} hora${horas > 1 ? 's' : ''} `
                }
                tiempoMostrado += `${minutos.toFixed(0)} minutos`
                return (
                  <div
                    key={col.id}
                    className="bg-white rounded-lg shadow-md p-4"
                  >
                    <div className="flex justify-between items-center">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {col.name}
                      </h3>
                      <p className="text-sm text-gray-600">{tiempoMostrado}</p>
                    </div>
                  </div>
                )
              }
              return null
            })}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
