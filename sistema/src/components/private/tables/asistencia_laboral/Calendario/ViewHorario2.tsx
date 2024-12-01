/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
// import { Dialog } from '@mui/material'
import { useState, useEffect } from 'react'
import { cn } from '../../../../shared/cn'
import { icono } from '../../../../shared/Images'
import { IoCloseCircleSharp } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import { IoMdClose } from 'react-icons/io'
interface values {
  estado: boolean
  proyecto: any
}

export const ViewHorario2 = ({
  open,
  activeDescription,
  fullScreen,
  setActiveDescription
}: {
  open: any
  setOpen: any
  activeDescription: boolean
  setActiveDescription: any
  fullScreen: boolean
}): JSX.Element => {
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<values>({
    estado: false,
    proyecto: null
  })
  const [tiempoTrabajado, setTiempoTrabajado] = useState(0)

  const calcularTiempoTrabajadoActividades = (actividades: any[]): number => {
    let tiempoTrabajado = 0
    actividades.forEach((actividad: any) => {
      if (actividad.horaInicio && actividad.horaFin) {
        const horaInicio = new Date(`2024-03-18 ${actividad.horaInicio}`)
        const horaFin = new Date(`2024-03-18 ${actividad.horaFin}`)

        if (!isNaN(horaInicio.getTime()) && !isNaN(horaFin.getTime())) {
          let diffMs = horaFin.getTime() - horaInicio.getTime()

          // Ajustar el tiempo si los minutos terminan en _:59
          if (actividad.horaFin.endsWith(':59')) {
            diffMs += 60000 // Sumar un minuto en milisegundos
          }

          tiempoTrabajado += diffMs
        }
      }
    })

    // Convertir el tiempo a horas y minutos
    const horas = Math.floor(tiempoTrabajado / (1000 * 60 * 60))
    const minutos = Math.floor((tiempoTrabajado % (1000 * 60 * 60)) / (1000 * 60))

    // Puedes devolver el tiempo en el formato que necesites, como un objeto { horas, minutos }
    // o simplemente la cantidad total de minutos, dependiendo de tus necesidades
    return horas * 60 + minutos
  }

  const obtenerSumatoriaTiempoTrabajadoActividades = (): number => {
    let sumatoriaTiempoTrabajado = 0
    const fechaHoy = new Date(open?.evento?.event.start) // Obtener la fecha actual
    if (open?.evento?.event.timeRanges) {
      open?.evento?.event.timeRanges.forEach((timeRange: any) => {
        const start = new Date(timeRange.start)
        if (
          start.getDate() === fechaHoy.getDate() &&
            start.getMonth() === fechaHoy.getMonth() &&
            start.getFullYear() === fechaHoy.getFullYear()
        ) {
          if (open?.evento?.event.detalle) {
            // @ts-expect-error
            Object.values(open?.evento?.event.detalle).forEach((detalle: any[]) => {
              const actividadesHoy = detalle.filter((actividad) => {
                const actividadDate = new Date(
                      `${start.toDateString()} ${actividad.horaInicio}`
                )
                return actividadDate.toDateString() === fechaHoy.toDateString()
              })
              const tiempoTrabajado =
                    calcularTiempoTrabajadoActividades(actividadesHoy)
              sumatoriaTiempoTrabajado += tiempoTrabajado
            })
          }
        }
      })
    }
    return sumatoriaTiempoTrabajado
  }

  const formatTiempoTrabajado = (tiempoTrabajado: number): string => {
    let horas = Math.floor(tiempoTrabajado / 60) // Convertir minutos a horas
    let minutos = tiempoTrabajado % 60 // Obtener los minutos restantes

    // Redondear hacia arriba si los minutos son mayores o iguales a 30
    if (minutos == 60) {
      horas++
      minutos = 0
    }
    // Formatear el resultado en el formato deseado
    const horasFormateadas = horas.toString().padStart(2, '0')
    const minutosFormateados = minutos.toString().padStart(2, '0')
    return `${horasFormateadas}:${minutosFormateados}`
  }

  useEffect(() => {
    if (open) {
      setTiempoTrabajado(obtenerSumatoriaTiempoTrabajadoActividades())
    }
  }, [open])

  return (
    <div
      className={`${
        activeDescription ? 'w-[97%] md:w-3/4 xl:w-[42%]' : 'w-0'
      } overflow-hidden shadow-md absolute ${
        fullScreen ? 'top-[10px] h-[93%]' : 'top-[10px] xl:top-[143px]'
      }  right-[10px] xl:right-[40px] transition-all ease-out duration-300`}
    >
      {open?.evento?.event && proyectoSeleccionado.proyecto == null ? (
        <div className="bg-white relative z-50 shadow-md w-full  py-4 px-2 md:p-4  overflow-hidden group rounded-none h-full  hover:shadow-lg transition-all hover:cursor-pointer overflow-y-auto">
          <section className="w-full flex  h-fit items-center">
            <div className='flex flex-col w-full gap-0'>
                <div className="flex w-full h-full gap-1 md:gap-3 items-center ">
                <div className="flex justify-center min-w-[60px]">
                    <img
                    src={icono}
                    alt={open?.evento?.event.user.name}
                    className="rounded-full w-14 h-14 object-cover ring-4 p-1 ring-gray-300"
                    />
                </div>
                <div className="flex flex-col items-start justify-center gap-0 p-2 md:p-4">
                    <h3 className="font-semibold text-lg md:text-xl transition-all text-[#252525]">
                    {open?.evento?.event.user.name}
                    </h3>
                    <span className="text-[#808080] text-sm md:text-base">
                    {new Date(open?.evento?.event.start).toLocaleDateString()}
                    </span>
                </div>
                </div>
                <div className='font-bold pl-1 text-black mt-2'>Horas trabajadas : {tiempoTrabajado && formatTiempoTrabajado(tiempoTrabajado)}</div>
            </div>

            {open?.evento?.event.timeRanges.map(
              (timeRange: any, index: number) => (
                <section key={index} className="py-0 md:py-4">
                  {timeRange.start || timeRange.end ? (
                    <div className="w-full flex flex-col md:flex-row justify-between px-1 gap-1 md:gap-4">
                      {timeRange.start && (
                        <span className="text-green-700 py-0 md:py-2 font-bold text-center">
                          Inicio{' '}
                          {new Date(timeRange.start).toLocaleTimeString()}{' '}
                        </span>
                      )}
                      {timeRange.end && (
                        <span className="text-red-700 py-0 md:py-2 font-bold text-center">
                          Fin {new Date(timeRange.end).toLocaleTimeString()}{' '}
                        </span>
                      )}
                    </div>
                  ) : null}
                </section>
              )
            )}

            <button
              type="button"
              className="text-[#252525] ml-2 md:ml-8 text-2xl"
              onClick={() => {
                setActiveDescription(false)
              }}
            >
              <IoMdClose />
            </button>
          </section>
          <section className="flex flex-col justify-between gap-6 mt-0 h-[87%]">
            <div className="w-full h-full">
              {open?.evento?.event.timeRanges.map(
                (timeRange: any, index: number) => (
                  <section
                    key={index}
                    className={`py-4 ${
                      fullScreen ? 'max-h-full' : 'max-h-[450px]'
                    } h-full  overflow-auto`}
                  >
                    <div className="grid grid-cols-7 gap-3 border rounded-lg shadow-md border-gray-300  py-2 text-[#252525]">
                      <div className="w-full col-span-2">
                        <p className="w-full text-center font-semibold">Hora</p>
                      </div>
                      <div className="w-full col-span-2">
                        <p className="w-full text-left font-semibold">
                          Proyecto
                        </p>
                      </div>
                      <div className="w-full col-span-3">
                        <p className="w-full text-center font-semibold">
                          Actividades
                        </p>
                      </div>
                    </div>
                    {open?.evento?.event?.detalle &&
                      Object.keys(open?.evento?.event?.detalle).map(
                        (hourKey: string, hourIndex: number) => {
                          const hour = parseInt(hourKey, 10)
                          if (
                            hour >= new Date(timeRange.start).getHours() &&
                            hour <= new Date(timeRange.end).getHours()
                          ) {
                            return (
                              <div
                                key={hourIndex}
                                className={cn(
                                  hourIndex % 2 != 0 ? 'bg-[#54a9dc29]' : ''
                                )}
                              >
                                {open?.evento?.event.detalle[hourKey] &&
                                  open?.evento?.event.detalle[hourKey]
                                    .sort((a: any, b: any) =>
                                      a.horaInicio.localeCompare(b.horaInicio)
                                    )
                                    .map(
                                      (
                                        actividad: any,
                                        actividadIndex: number
                                      ) => (
                                      <div
                                        key={actividadIndex}
                                        className="grid grid-cols-7 gap-3 py-2 rounded-md relative text-[#404040]"
                                        onClick={() => {
                                          setProyectoSeleccionado({
                                            estado: true,
                                            proyecto: actividad
                                          })
                                        }}
                                      >
                                        <div className="w-full h-full flex items-center justify-center col-span-2">
                                          <p className="text-center flex items-center justify-center hover:bg-[#54A9DC] w-fit px-3 hover:text-white transition-colors rounded-md">
                                            {actividad.horaInicio} -{' '}
                                            {actividad.horaFin}
                                          </p>
                                        </div>
                                        <div className="col-span-5 grid grid-cols-6 gap-4">
                                          <p className="col-span-2 w-full lowercase  ">
                                            <span className="line-clamp-1 first:uppercase">
                                              {actividad?.proyecto?.nombre}
                                            </span>
                                          </p>
                                          <p className="w-full col-span-4 break-words line-clamp-1 pr-6">
                                            {actividad.descripcion}
                                          </p>
                                        </div>
                                      </div>
                                      )
                                    )}
                              </div>
                            )
                          } else {
                            return null // No mostrar el detalle si no está en el rango de horas
                          }
                        }
                      )}
                  </section>
                )
              )}
            </div>
          </section>
        </div>
      ) : (
        open?.estado && (
          <div className="bg-white w-full relative z-[300]  p-4 overflow-hidden group rounded-none  shadow hover:shadow-lg transition-all hover:cursor-pointer overflow-y-auto">
            <section className="w-full flex h-[50px]">
              <div className="flex w-full h-full gap-3 items-center ">
                <div className="flex w-1/5 justify-center ">
                  <img
                    src={icono}
                    alt={open?.evento?.event.user.name}
                    className="rounded-full w-14 h-14 object-cover ring-4 p-1 ring-gray-300"
                  />
                </div>
                <div className="flex flex-col items-start justify-center gap-0 p-4">
                  <h3 className="font-semibold text-xl transition-all text-[#252525]">
                    {open?.evento?.event.user.name}
                  </h3>
                  <span className="text-[#808080]">
                    {new Date(open?.evento?.event.start).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="h-full flex items-center"></div>
            </section>
            <section className="w-full relative">
              <IoCloseCircleSharp
                onClick={() => {
                  setProyectoSeleccionado({ estado: false, proyecto: null })
                }}
                className="absolute -top-8 right-0 text-gray-600 text-3xl hover:text-black hover:scale-105 transition-all"
              />

              <div className="w-full h-full flex flex-col justify-center items-center pt-4">
                <div className="w-full flex flex-col gap-2">
                  <div className="flex gap-3 items-center mt-6">
                    <label
                      htmlFor="horaInicio"
                      className=" font-bold lowercase first-letter:uppercase text-lg text-[#303030] "
                    >
                      Cliente:{' '}
                    </label>
                    <p className="text-gray-600 text-lg lowercase first-letter:uppercase">
                      {proyectoSeleccionado.proyecto?.proyecto.nombreCliente}
                    </p>
                  </div>
                  <div className="flex gap-3 items-center mt-0">
                    <label
                      htmlFor="horaInicio"
                      className="font-bold lowercase first-letter:uppercase text-lg text-[#303030] "
                    >
                      PROYECTO:{' '}
                    </label>
                    <Link
                      to={`/admin/lista-servicios/avances/${
                        proyectoSeleccionado.proyecto?.proyecto?.id ?? ''
                      }`}
                      target="_blank"
                      className="text-gray-600 text-lg line-clamp-2 hover:text-blue-600 transition-colors"
                    >
                      {proyectoSeleccionado.proyecto?.proyecto.nombre}
                    </Link>
                  </div>
                  <div className="flex gap-3 items-center mt-0">
                    <label
                      htmlFor="horaInicio"
                      className="font-bold lowercase first-letter:uppercase text-lg text-[#303030] "
                    >
                      INICIO:{' '}
                    </label>
                    <p className="text-gray-600 text-lg uppercase">
                      {proyectoSeleccionado?.proyecto?.horaInicio}
                    </p>
                  </div>
                  <div className="flex gap-3 items-center mt-0">
                    <label
                      htmlFor="horaInicio"
                      className="font-bold lowercase first-letter:uppercase text-lg text-[#303030] "
                    >
                      FIN:{' '}
                    </label>
                    <p className="text-gray-600 text-lg uppercase">
                      {proyectoSeleccionado?.proyecto?.horaFin}
                    </p>
                  </div>
                  <div className="flex flex-col gap-3 mt-4">
                    <label
                      htmlFor="horaInicio"
                      className="font-bold lowercase first-letter:uppercase text-lg text-[#303030] "
                    >
                      DETALLE :
                    </label>
                    <p
                      className="w-full h-full outline-none p-0 resize-none overflow-hidden text-black"
                      id="tuTextArea"
                    >
                      {proyectoSeleccionado?.proyecto?.descripcion}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/admin/lista-servicios/avances/${
                    proyectoSeleccionado.proyecto?.proyecto?.id ?? ''
                  }`}
                  target="_blank"
                  className="text-white px-8 py-2 bg-[#54A9DC] mt-6 rounded-lg text-lg  hover:bg-[#4182ab] transition-colors"
                >
                  Ver proyecto
                </Link>
              </div>
            </section>
          </div>
        )
      )}
    </div>
  )
}
