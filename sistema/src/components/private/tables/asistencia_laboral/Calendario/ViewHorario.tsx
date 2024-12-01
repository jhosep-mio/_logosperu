/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Dialog } from '@mui/material'
import { useState } from 'react'
import { cn } from '../../../../shared/cn'
import { icono } from '../../../../shared/Images'
import { IoCloseCircleSharp } from 'react-icons/io5'
import { Link } from 'react-router-dom'

interface values {
  estado: boolean
  proyecto: any
}

export const ViewHorario = ({
  open,
  setOpen
}: {
  open: any
  setOpen: any
}): JSX.Element => {
  const [openProyectos] = useState(false)
  const [proyectoSeleccionado, setProyectoSeleccionado] = useState<values>({
    estado: false,
    proyecto: null
  })

  return (
    <Dialog
      open={open.estado}
      onClose={() => {
        setOpen({ estado: false, evento: null })
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className=""
      maxWidth={!openProyectos ? 'md' : 'lg'}
    >
        {open?.evento?.event && proyectoSeleccionado.proyecto == null ? (
        <div className="bg-white w-[800px]  p-4 overflow-hidden group rounded-none  shadow hover:shadow-lg transition-all hover:cursor-pointer overflow-y-auto">
            <section className="w-full flex h-[50px]">
              <div className="flex w-full h-full gap-3 items-center ">
                <div className="flex justify-center ">
                  <img
                    src={icono}
                    alt="JT Devs"
                    className="rounded-full w-14 h-14 object-cover ring-4 p-1 ring-gray-300"
                  />
                </div>
                <div className="flex flex-col items-start justify-center gap-0 p-4">
                  <h3 className="font-semibold text-xl transition-all">
                    {open?.evento?.event.user.name}
                  </h3>
                  <span>
                    {new Date(open?.evento?.event.start).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <div className="h-full flex items-center"></div>
            </section>
            <section className="flex flex-col justify-between gap-6 mt-4 ">
              <div className="w-full h-full">
                {open?.evento?.event.timeRanges.map(
                  (timeRange: any, index: number) => (
                    <section key={index} className="py-4">
                      {timeRange.start || timeRange.end ? (
                        <div className="w-full flex justify-between px-1">
                          {timeRange.start && (
                            <span className="text-green-700 py-2 font-bold">
                              INICIO:{' '}
                              {new Date(timeRange.start).toLocaleTimeString()}{' '}
                            </span>
                          )}
                          {timeRange.end && (
                            <span className="text-red-700 py-2 font-bold">
                              FIN:{' '}
                              {new Date(timeRange.end).toLocaleTimeString()}{' '}
                            </span>
                          )}
                        </div>
                      ) : null}
                      <div className="grid grid-cols-7 gap-3 border-y border-gray-300  py-2">
                        <div className="w-full">
                          <p className="w-full text-center font-semibold">
                            Hora
                          </p>
                        </div>
                        <div className="w-full ">
                          <p className="w-full text-left font-semibold">
                            Tiempo
                          </p>
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
                      {open?.evento?.event?.detalle && Object.keys(open?.evento?.event?.detalle).map(
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
                                  hourIndex % 2 != 0 ? 'bg-gray-200' : ''
                                )}
                              >
                                {open?.evento?.event.detalle[hourKey] &&
                                  open?.evento?.event.detalle[hourKey].map(
                                    (
                                      actividad: any,
                                      actividadIndex: number
                                    ) => (
                                      <div
                                        key={actividadIndex}
                                        className="grid grid-cols-7 gap-3 py-2 rounded-md relative"
                                        onClick={() => {
                                          setProyectoSeleccionado({
                                            estado: true,
                                            proyecto: actividad
                                          })
                                        }}
                                      >
                                        <div className="w-full h-full flex items-center justify-center">
                                          <p className="text-center flex items-center justify-center hover:bg-main w-fit px-3 hover:text-white transition-colors rounded-md">
                                            {hourKey}
                                          </p>
                                        </div>
                                        <div className="col-span-6 grid grid-cols-6 gap-4">
                                          <p className="col-span-1">
                                            {actividad.horaInicio} -{' '}
                                            {actividad.horaFin}
                                          </p>
                                          <p className="col-span-3 w-full line-clamp-1 ">
                                            {actividad?.proyecto?.nombre}
                                          </p>
                                          <p className="w-full col-span-2 break-words line-clamp-1 pr-6">
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
        ) : open?.estado && (
        <div className="bg-white w-[800px]  p-4 overflow-hidden group rounded-none  shadow hover:shadow-lg transition-all hover:cursor-pointer overflow-y-auto">
            <section className="w-full flex h-[50px]">
              <div className="flex w-full h-full gap-3 items-center ">
                <div className="flex justify-center ">
                  <img
                    src={icono}
                    alt="JT Devs"
                    className="rounded-full w-14 h-14 object-cover ring-4 p-1 ring-gray-300"
                  />
                </div>
                <div className="flex flex-col items-start justify-center gap-0 p-4">
                  <h3 className="font-semibold text-xl transition-all">
                    {open?.evento?.event.user.name}
                  </h3>
                  <span>
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
                className="absolute top-0 right-0 text-gray-600 text-3xl hover:text-black hover:scale-105 transition-all"
              />

              <div className="w-full h-full flex flex-col justify-center items-center pt-4">
                <div className="w-full flex flex-col gap-2">
                  <div className="flex gap-3 items-center mt-6">
                    <label
                      htmlFor="horaInicio"
                      className="text-black font-bold uppercase text-lg "
                    >
                      Cliente:{' '}
                    </label>
                    <p className="text-gray-600 text-lg uppercase">
                      {proyectoSeleccionado.proyecto?.proyecto.nombreCliente}
                    </p>
                  </div>
                  <div className="flex gap-3 items-center mt-0">
                    <label
                      htmlFor="horaInicio"
                      className="text-black font-bold uppercase text-lg "
                    >
                      PROYECTO:{' '}
                    </label>
                    <Link
                     to={`/admin/lista-servicios/avances/${
                        proyectoSeleccionado.proyecto?.proyecto?.id ?? ''
                      }`}
                      target="_blank"
                    className="text-gray-600 text-lg uppercase hover:text-blue-600 transition-colors">
                      {proyectoSeleccionado.proyecto?.proyecto.nombre}
                    </Link>
                  </div>
                  <div className="flex gap-3 items-center mt-0">
                    <label
                      htmlFor="horaInicio"
                      className="text-black font-bold uppercase text-lg "
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
                      className="text-black font-bold uppercase text-lg "
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
                      className="text-black font-bold uppercase text-lg "
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
              </div>
            </section>
        </div>
        )}
    </Dialog>
  )
}
