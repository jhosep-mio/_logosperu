/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable multiline-ternary */

import { Skeleton } from '@mui/material'
import { pdf, zip } from '../../../../shared/Images'
import { BsFillCloudArrowDownFill } from 'react-icons/bs'
import Swal from 'sweetalert2'
import { LoadingSmall } from '../../../../shared/LoadingSmall'
import espera from './../../../../../assets/logo/espera.svg'
import filarachive from '../../../../../assets/plataformas/archivo.png'
import { format, isAfter, setHours, setMinutes } from 'date-fns'
import { type archivoavancesValues } from '../../../../shared/schemas/Interfaces'

interface values {
  resultado: any
  formatFileName: (fileName: string) => string
  tiempoRestante: number | null
  loading: boolean
  descargarFinal: () => Promise<void>
  descargarPDF: () => Promise<void>
  descargarArchivoZip: (nombre: string) => Promise<void>
  datos: any
}

export const Archivos = ({
  resultado,
  formatFileName,
  tiempoRestante,
  loading,
  descargarFinal,
  descargarPDF,
  descargarArchivoZip,
  datos
}: values): JSX.Element => {
  const formatTime = (ms: number): string => {
    let s = Math.floor(ms / 1000)
    let m = Math.floor(s / 60)
    let h = Math.floor(m / 60)
    const d = Math.floor(h / 24)
    h %= 24
    m %= 60
    s %= 60
    return `${d} días ${h} horas ${m} minutos ${s} segundos`
  }

  const validarFechaAdicional = (): boolean => {
    const fechaActual = new Date() // Fecha y hora actual
    if (datos?.fecha_adicional) {
      let fechaAdicional = new Date(datos.fecha_adicional)
      fechaAdicional = setHours(fechaAdicional, 23) // Establece las horas a las 23 (11 PM)
      fechaAdicional = setMinutes(fechaAdicional, 59) // Establece los minutos a 59 (11:59 PM)
      if (isAfter(fechaAdicional, fechaActual)) {
        return true
      } else {
        return false // La fecha adicional es menor o igual que la fecha actual
      }
    } else {
      return false // La fecha adicional no está definida
    }
  }

  const resultadoValidacion = validarFechaAdicional()

  return (
    <section className="flex flex-col md:items-start gap-y-2 mb-8 md:px-4">
      <div className="flex flex-col gap-0 lg:gap-3 mb-2 lg:mb-6 ">
        <h2 className="text-xl lg:text-2xl font-bold">Archivos</h2>
        <h3 className="font-bold text-base">
          <span className="text-gray-400 text-sm lg:text-base">
            Tiene 30 dias para descargar sus archivos
          </span>{' '}
        </h3>
      </div>

      {resultado.archivos_finales ??
      resultado.propuestas ??
      resultado.archivos_avances ? (
        <>
          {/* MOVIL */}
          {
            // eslint-disable-next-line eqeqeq
            resultado.archivos_finales && (
              <div className="flex flex-col gap-3 md:hidden shadow_class p-4">
                <div className="flex md:hidden gap-4">
                  <img src={zip} alt="" className="w-10 h-10" />
                  <span className="flex md:justify-left items-center gap-3 font-bold">
                    {formatFileName(resultado.archivos_finales)}
                  </span>
                </div>
                <div className="md:hidden flex justify-between gap-3">
                  <div className="md:text-center ">
                    <h5 className="md:hidden text-black font-bold mb-0 text-sm">
                      Tipo de archivo
                    </h5>
                    <span className="text-left block">Editables</span>
                  </div>
                  <div className="md:text-right ">
                    <h5 className="md:hidden text-[#62be6d] font-bold mb-0 text-sm bg">
                      Fecha de creación
                    </h5>
                    <span className="text-right block">
                      {resultado.fecha_fin}
                    </span>
                  </div>
                </div>
                <div className="md:hidden flex justify-between gap-3">
                  <div className="md:text-center ">
                    <h5 className="md:hidden text-black bg-yellow-400 w-fit px-2 font-bold mb-0 text-sm ">
                      Tiempo de expiración
                    </h5>
                    {tiempoRestante != null && tiempoRestante <= 0 && !resultadoValidacion ? (
                      <span className="text-left block text-red-500">
                        Plazo expirado
                      </span>
                    ) : (tiempoRestante != null && tiempoRestante > 0) || resultadoValidacion ? (
                        <span className="text-left flex gap-2 items-center w-fit px-2">
                          {// @ts-expect-error
                           tiempoRestante > 0 ? formatTime(tiempoRestante) : format(setHours(setMinutes(new Date(datos.fecha_adicional), 59), 23), 'dd/MM/yyyy HH:mm')}
                        </span>
                    ) : (
                      <Skeleton
                        variant="rectangular"
                        className="w-[70%] h-full"
                      />
                    )}
                  </div>
                </div>
                <div className="md:hidden flex justify-between gap-3 ">
                  <div className="md:text-center second-stepM">
                    <h5 className="md:hidden text-black font-bold mb-0 text-sm">
                      Descargar
                    </h5>
                    <span className="text-left block ">
                      {tiempoRestante != null && tiempoRestante <= 0 && !resultadoValidacion ? (
                        <BsFillCloudArrowDownFill
                          className=" text-red-800 text-3xl w-fit lg:w-full text-center"
                          onClick={() => {
                            Swal.fire(
                              'Su plazo para descargar sus archivos venció',
                              'Comuniquese con el área de ventas +51 987 038 024',
                              'warning'
                            )
                          }}
                        />
                      ) : !loading ? (
                        <BsFillCloudArrowDownFill
                          className=" text-green-600 text-3xl w-fit lg:w-full text-center cursor-pointer "
                          onClick={() => {
                            descargarFinal()
                          }}
                        />
                      ) : (
                        <LoadingSmall />
                        //   <BsFillCloudArrowDownFill className=" text-green-800 text-3xl w-fit lg:w-full text-center" />
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )
          }
          {
            // eslint-disable-next-line eqeqeq
            resultado.propuestas && (
              <div className="flex flex-col gap-3 md:hidden shadow_class p-4">
                <div className="flex md:hidden gap-4">
                  <img src={pdf} alt="" className="w-10 h-10" />
                  <span className="flex md:justify-left items-center gap-3 font-bold">
                    {formatFileName(resultado.propuestas)}
                  </span>
                </div>
                <div className="md:hidden flex justify-between gap-3">
                  <div className="md:text-center ">
                    <h5 className="md:hidden text-black font-bold mb-0 text-sm">
                      Tipo de archivo
                    </h5>
                    <span className="text-left block">Propuesta</span>
                  </div>
                  <div className="md:text-right ">
                    <h5 className="md:hidden text-[#62be6d] font-bold mb-0 text-sm bg">
                      Fecha de creación
                    </h5>
                    <span className="text-right block">
                      {resultado.fecha_fin}
                    </span>
                  </div>
                </div>
                <div className="md:hidden flex justify-between gap-3">
                  <div className="md:text-center ">
                    <h5 className="md:hidden text-black bg-yellow-400 w-fit px-2 font-bold mb-0 text-sm ">
                      Tiempo de expiración
                    </h5>
                    {tiempoRestante != null && tiempoRestante <= 0 && !resultadoValidacion ? (
                      <span className="text-left block text-red-500">
                        Plazo expirado
                      </span>
                    ) : (tiempoRestante != null && tiempoRestante > 0) || resultadoValidacion ? (
                        <span className="text-left flex gap-2 items-center w-fit px-2">
                          {// @ts-expect-error
                           tiempoRestante > 0 ? formatTime(tiempoRestante) : format(setHours(setMinutes(new Date(datos.fecha_adicional), 59), 23), 'dd/MM/yyyy HH:mm')}
                        </span>
                    ) : (
                      <Skeleton
                        variant="rectangular"
                        className="w-[70%] h-full"
                      />
                    )}
                  </div>
                </div>
                <div className="md:hidden flex justify-between gap-3">
                  <div className="md:text-center ">
                    <h5 className="md:hidden text-black font-bold mb-0 text-sm ">
                      Descargar
                    </h5>
                    <span className="text-left block ">
                      {tiempoRestante != null && tiempoRestante <= 0 && !resultadoValidacion ? (
                        <BsFillCloudArrowDownFill
                          className=" text-red-800 text-3xl w-fit lg:w-full text-center"
                          onClick={() => {
                            Swal.fire(
                              'Su plazo para descargar sus archivos venció',
                              'Comuniquese con el área de ventas +51 987 038 024',
                              'warning'
                            )
                          }}
                        />
                      ) : !loading ? (
                        <BsFillCloudArrowDownFill
                          className=" text-green-600 text-3xl w-fit lg:w-full text-center cursor-pointer"
                          onClick={(e: any) => {
                            e.preventDefault()
                            descargarPDF()
                          }}
                        />
                      ) : (
                        <BsFillCloudArrowDownFill className=" text-green-800 text-3xl w-fit lg:w-full text-center" />
                      )}
                    </span>
                  </div>
                </div>
              </div>
            )
          }

          {resultado.archivos_avances &&
            JSON.parse(resultado.archivos_avances).map(
              (avances: archivoavancesValues) => (
                <div
                  key={avances.id}
                  className="flex flex-col gap-3 md:hidden shadow_class p-4"
                >
                  <div className="flex md:hidden gap-4">
                    <img src={filarachive} alt="" className="w-10 h-10" />
                    <span className="flex md:justify-left items-center gap-3 font-bold">
                      {formatFileName(avances.nombre)}
                    </span>
                  </div>
                  <div className="md:hidden flex justify-between gap-3">
                    <div className="md:text-center ">
                      <h5 className="md:hidden text-black font-bold mb-0 text-sm">
                        Tipo de archivo
                      </h5>
                      <span className="text-left block">Avance</span>
                    </div>
                    <div className="md:text-right ">
                      <h5 className="md:hidden text-[#62be6d] font-bold mb-0 text-sm bg">
                        Fecha de creación
                      </h5>
                      <span className="text-right block">
                        {resultado.fecha_fin}
                      </span>
                    </div>
                  </div>
                  <div className="md:hidden flex justify-between gap-3">
                    <div className="md:text-center ">
                      <h5 className="md:hidden text-black bg-yellow-400 w-fit px-2 font-bold mb-0 text-sm ">
                        Tiempo de expiración
                      </h5>
                      {tiempoRestante == 0 && resultado.fecha_fin == null
                        ? <span className="text-left block text-yellow-700">
                       Sin definir
                     </span>
                        : tiempoRestante != null && tiempoRestante <= 0 && !resultadoValidacion ? (
                        <span className="text-left block text-red-500">
                          Plazo expirado2
                        </span>
                        ) : (tiempoRestante != null && tiempoRestante > 0) || resultadoValidacion ? (
                        <span className="text-left flex gap-2 items-center w-fit px-2">
                          {// @ts-expect-error
                          tiempoRestante > 0 ? formatTime(tiempoRestante) : format(setHours(setMinutes(new Date(datos.fecha_adicional), 59), 23), 'dd/MM/yyyy HH:mm')}
                        </span>
                        ) : (
                        <Skeleton
                          variant="rectangular"
                          className="w-[70%] h-full"
                        />
                        )}
                    </div>
                  </div>
                  <div className="md:hidden flex justify-between gap-3">
                    <div className="md:text-center ">
                      <h5 className="md:hidden text-black font-bold mb-0 text-sm ">
                        Descargar
                      </h5>
                      <span className="text-left block ">
                        {tiempoRestante == 0 && resultado.fecha_fin == null && !loading
                          ? <BsFillCloudArrowDownFill
                        className=" text-green-600 text-3xl w-fit lg:w-full text-center cursor-pointer"
                        onClick={(e: any) => {
                          e.preventDefault()
                          descargarArchivoZip(avances.nombre)
                        }}
                      />
                          : tiempoRestante != null && tiempoRestante <= 0 && !resultadoValidacion ? (
                          <BsFillCloudArrowDownFill
                            className=" text-red-800 text-3xl w-fit lg:w-full text-center"
                            onClick={() => {
                              Swal.fire(
                                'Su plazo para descargar sus archivos venció',
                                'Comuniquese con el área de ventas +51 987 038 024',
                                'warning'
                              )
                            }}
                          />
                          ) : !loading ? (
                          <BsFillCloudArrowDownFill
                            className=" text-green-600 text-3xl w-fit lg:w-full text-center cursor-pointer"
                            onClick={(e: any) => {
                              e.preventDefault()
                              descargarArchivoZip(avances.nombre)
                            }}
                          />
                          ) : (
                          <BsFillCloudArrowDownFill className=" text-green-800 text-3xl w-fit lg:w-full text-center" />
                          )}
                      </span>
                    </div>
                  </div>
                </div>
              )
            )}
          {/* PC */}
          <div className="hidden md:grid grid-cols-1 md:grid-cols-6 gap-4 mb-2 md:px-4 md:py-2 text-gray-400 border-y border-gray-300 w-full">
            <h5 className="md:text-left col-span-2">Archivo </h5>
            <h5 className="md:text-left">Tipo de archivo</h5>
            <h5 className="md:text-left">Fecha de creación </h5>
            <h5 className="md:text-left bg-yellow-500/70 text-black w-fit px-2">
              Tiempo de expiración{' '}
            </h5>
          </div>
          {resultado.archivos_avances &&
            JSON.parse(resultado.archivos_avances).map(
              (avances: archivoavancesValues) => (
                <div
                  key={avances.id}
                  className="hidden lg:grid lg:grid-cols-6 gap-4 relative items-center mb-4 bg-gray-50 p-4 rounded-xl shadow-sm cursor-pointer w-full"
                >
                  <div className="hidden md:block md:text-center col-span-2">
                    <div className="text-left flex gap-3 items-center">
                      <img src={filarachive} alt="" className="w-10 h-10" />
                      <span className="line-clamp-2 text-black">
                        {formatFileName(avances.nombre)}
                      </span>
                    </div>
                  </div>
                  <div className="hidden md:block md:text-center">
                    <span className="text-left flex gap-2 font-bold items-center w-fit px-2 text-white bg-yellow-600">
                      Avance
                    </span>
                  </div>
                  <span className="text-center flex gap-2 items-center w-fit px-2">
                    {resultado.fecha_fin}
                  </span>
                  <div className="hidden md:block md:text-center col-span-2">
                    <span className="text-left flex gap-2 items-center w-fit px-2 text-black">

                      {tiempoRestante == 0 && resultado.fecha_fin == null
                        ? <span className="text-left flex gap-2 items-center w-fit px-2 text-yellow-700">
                          Sin definir
                        </span>
                        : tiempoRestante != null && tiempoRestante <= 0 && !resultadoValidacion ? (
                        <span className="text-left flex gap-2 items-center w-fit px-2 text-red-500">
                          Plazo expirado
                        </span>
                        ) : (tiempoRestante != null && tiempoRestante > 0) || resultadoValidacion ? (
                        <span className="text-left flex gap-2 items-center w-fit px-2">
                          {// @ts-expect-error
                           tiempoRestante > 0 ? formatTime(tiempoRestante) : format(setHours(setMinutes(new Date(datos.fecha_adicional), 59), 23), 'dd/MM/yyyy HH:mm')}
                        </span>
                        ) : (
                        <Skeleton
                          variant="rectangular"
                          className="w-[70%] h-full"
                        />
                        )}
                    </span>
                  </div>
                  <div className="hidden md:flex md:justify-center items-center absolute right-10 top-0 bottom-0">
                    <div className="md:text-center second-stepP">
                      {tiempoRestante == 0 && resultado.fecha_fin == null && !loading
                        ? <BsFillCloudArrowDownFill
                        className=" text-green-600 text-3xl w-fit lg:w-full text-center cursor-pointer"
                        onClick={() => {
                          descargarArchivoZip(avances.nombre)
                        }}
                        />
                        : tiempoRestante != null && tiempoRestante <= 0 && !resultadoValidacion ? (
                        <BsFillCloudArrowDownFill
                          className=" text-red-800 text-3xl w-fit lg:w-full text-center"
                          onClick={() => {
                            Swal.fire(
                              'Su plazo para descargar sus archivos venció',
                              'Comuniquese con el área de ventas +51 987 038 024',
                              'warning'
                            )
                          }}
                        />
                        ) : !loading ? (
                        <BsFillCloudArrowDownFill
                          className=" text-green-600 text-3xl w-fit lg:w-full text-center cursor-pointer"
                          onClick={() => {
                            descargarArchivoZip(avances.nombre)
                          }}
                        />
                        ) : (
                        <LoadingSmall />
                        // <BsFillCloudArrowDownFill className=" text-green-800 text-3xl w-fit lg:w-full text-center" />
                        )}
                    </div>
                  </div>
                </div>
              )
            )}
          {
            // eslint-disable-next-line eqeqeq
            resultado.archivos_finales && (
              <div className="hidden lg:grid grid-cols-1 md:grid-cols-6 gap-3 items-center mb-3 md:mb-0 bg-transparent p-4 rounded-xl relative shadow_class w-full">
                <div className="hidden md:block md:text-center col-span-2">
                  <div className="text-left flex gap-3 items-center">
                    <img src={zip} alt="" className="w-10 h-10" />
                    <span className="line-clamp-2 text-black">
                      {formatFileName(resultado.archivos_finales)}
                    </span>
                  </div>
                </div>
                <div className="hidden md:block md:text-center">
                  <span className="text-left flex gap-2 font-bold items-center w-fit px-2">
                    Editables
                  </span>
                </div>
                <div className="hidden md:block md:text-center">
                  <span className="text-center flex gap-2 items-center w-fit px-2">
                    {resultado.fecha_fin}
                  </span>
                </div>
                <div className="hidden md:block md:text-center col-span-2">
                  {tiempoRestante != null && tiempoRestante <= 0 && !resultadoValidacion ? (
                    <span className="text-left flex gap-2 items-center w-fit px-2 text-red-500">
                      Plazo expirado
                    </span>
                  ) : (tiempoRestante != null && tiempoRestante > 0) || resultadoValidacion ? (
                    <span className="text-left flex gap-2 items-center w-fit px-2">
                      {// @ts-expect-error
                       tiempoRestante > 0 ? formatTime(tiempoRestante) : format(setHours(setMinutes(new Date(datos.fecha_adicional), 59), 23), 'dd/MM/yyyy HH:mm')}
                    </span>
                  ) : (
                    <Skeleton
                      variant="rectangular"
                      className="w-[70%] h-full"
                    />
                  )}
                </div>
                <div className="hidden md:flex md:justify-center items-center absolute right-10 top-0 bottom-0">
                  <div className="md:text-center second-stepP">
                    {tiempoRestante != null && tiempoRestante <= 0 && !resultadoValidacion ? (
                      <BsFillCloudArrowDownFill
                        className=" text-red-800 text-3xl w-fit lg:w-full text-center"
                        onClick={() => {
                          Swal.fire(
                            'Su plazo para descargar sus archivos venció',
                            'Comuniquese con el área de ventas +51 987 038 024',
                            'warning'
                          )
                        }}
                      />
                    ) : !loading ? (
                      <BsFillCloudArrowDownFill
                        className=" text-green-600 text-3xl w-fit lg:w-full text-center cursor-pointer"
                        onClick={() => {
                          descargarFinal()
                        }}
                      />
                    ) : (
                      <LoadingSmall />
                      // <BsFillCloudArrowDownFill className=" text-green-800 text-3xl w-fit lg:w-full text-center" />
                    )}
                  </div>
                </div>
              </div>
            )
          }
          {
            // eslint-disable-next-line eqeqeq
            resultado.propuestas != undefined && resultado.propuestas && (
              <div className="hidden lg:grid grid-cols-1 md:grid-cols-6 gap-3 items-center mb-3 md:mb-0 bg-transparent p-4 rounded-xl relative shadow_class w-full">
                <div className="hidden md:block md:text-center col-span-2">
                  <div className="text-left flex gap-3 items-center">
                    <img src={pdf} alt="" className="w-10 h-10" />
                    <span className="line-clamp-2 text-black">
                      {formatFileName(resultado.propuestas)}
                    </span>
                  </div>
                </div>
                <div className="hidden md:block md:text-center">
                  <span className="text-left flex gap-2 font-bold items-center w-fit px-2">
                    Propuesta
                  </span>
                </div>
                <div className="hidden md:block md:text-center">
                  <span className="text-center flex gap-2 items-center w-fit px-2">
                    {resultado.fecha_fin}
                  </span>
                </div>
                <div className="hidden md:block md:text-center col-span-2">
                  {tiempoRestante != null && tiempoRestante <= 0 && !resultadoValidacion ? (
                    <span className="text-left flex gap-2 items-center w-fit px-2 text-red-500">
                      Plazo expirado
                    </span>
                  ) : (tiempoRestante != null && tiempoRestante > 0) || resultadoValidacion ? (
                    <span className="text-left flex gap-2 items-center w-fit px-2">
                      {// @ts-expect-error
                      tiempoRestante > 0 ? formatTime(tiempoRestante) : format(setHours(setMinutes(new Date(datos.fecha_adicional), 59), 23), 'dd/MM/yyyy HH:mm')}
                    </span>
                  ) : (
                    <Skeleton
                      variant="rectangular"
                      className="w-[70%] h-full"
                    />
                  )}
                </div>
                <div className="hidden md:flex md:justify-center items-center absolute right-10 top-0 bottom-0">
                  <div className="md:text-center">
                    {tiempoRestante != null && tiempoRestante <= 0 && !resultadoValidacion ? (
                      <BsFillCloudArrowDownFill
                        className=" text-red-800 text-3xl w-fit lg:w-full text-center"
                        onClick={() => {
                          Swal.fire(
                            'Su plazo para descargar sus archivos venció',
                            'Comuniquese con el área de ventas +51 987 038 024',
                            'warning'
                          )
                        }}
                      />
                    ) : !loading ? (
                      <BsFillCloudArrowDownFill
                        className=" text-green-600 text-3xl w-fit lg:w-full text-center cursor-pointer"
                        onClick={(e: any) => {
                          e.preventDefault()
                          descargarPDF()
                        }}
                      />
                    ) : (
                      <BsFillCloudArrowDownFill className=" text-green-800 text-3xl w-fit lg:w-full text-center" />
                    )}
                  </div>
                </div>
              </div>
            )
          }
        </>
          ) : (
        <div className="w-full flex flex-col items-center justify-center gap-10 mb-10">
          <p className="text-2xl md:text-2xl text-black font-bold w-full text-center">
            AUN NO SE HAN SUBIDO ARCHIVOS
          </p>
          <img
            src={espera}
            alt=""
            className="w-52 h-fit object-contain animate-pulse"
          />
        </div>
          )}
    </section>
  )
}
