import * as React from 'react'
import { styled } from '@mui/material/styles'
import MuiAccordion, { type AccordionProps } from '@mui/material/Accordion'
import MuiAccordionSummary, {
  type AccordionSummaryProps
} from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import { FaAngleLeft } from 'react-icons/fa6'
import { Link } from 'react-router-dom'
import { type notificacionesValues } from '../../../shared/schemas/Interfaces'
import { IoMdMailOpen } from 'react-icons/io'
import { TbMessage2Check } from 'react-icons/tb'
import useAuth from '../../../../hooks/useAuth'
import { CiTimer } from 'react-icons/ci'

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0
  },
  '&::before': {
    display: 'none'
  }
}))

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary expandIcon={<FaAngleLeft />} {...props} />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)'
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1)
  }
}))

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)'
}))

export const AcordionNotifications = ({
  groupedNotificaciones,
  setLoadingComponents,
  zoom
}: {
  groupedNotificaciones: any
  setLoadingComponents: React.Dispatch<React.SetStateAction<boolean>>
  zoom: boolean
}): JSX.Element => {
  const { estado, notificaciones } = useAuth()

  const [expanded, setExpanded] = React.useState<string | false>(estado != 3
    ? `panel1${Object.keys(groupedNotificaciones)[0]}`
    : 'panel1001' // Establecer el primer panel como abierto
  )

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, newExpanded: boolean) => {
      setExpanded(newExpanded ? panel : false)
    }

  const esHoy = (fechaKey: string): boolean => {
    const fechaActual = new Date()
    const [dia, mes, anio] = fechaKey.split('-').map(Number)
    // Obtener solo la fecha sin la hora para la comparación
    const fechaActualSinHora = new Date(
      fechaActual.getFullYear(),
      fechaActual.getMonth(),
      fechaActual.getDate()
    )
    const fechaSinHora = new Date(anio, mes - 1, dia)
    // Comparar solo las fechas sin la hora
    return fechaSinHora.getTime() === fechaActualSinHora.getTime()
  }

  const calcularDiferenciaDeTiempo = (fechaNotificacion: string): string => {
    const fechaActual = new Date()
    const fechaNotif = new Date(fechaNotificacion)
    const diferenciaMilisegundos: number =
      fechaActual.getTime() - fechaNotif.getTime()
    const diferenciaHoras = Math.floor(
      diferenciaMilisegundos / (60 * 60 * 1000)
    )

    if (diferenciaHoras < 24) {
      if (diferenciaHoras === 0) {
        return 'Hace menos de una hora'
      } else if (diferenciaHoras === 1) {
        return 'Hace 1 hora'
      } else {
        return `Hace ${diferenciaHoras} horas`
      }
    } else {
      // Si han pasado más de 24 horas, mostrar la fecha en formato dd/mm/yyyy
      const hora = fechaNotif.getHours()
      const minutos = fechaNotif.getMinutes()
      return `${hora}:${minutos}`
    }
  }

  function calcularDiasRestantes (fechaObjetivo: string): number | null {
    // Obtén la fecha actual
    const fechaActual = new Date()
    fechaActual.setHours(0, 0, 0, 0) // Establece horas, minutos, segundos y milisegundos a cero
    // Divide la fecha objetivo en día, mes y año
    if (fechaObjetivo) {
      const partesFechaObjetivo = fechaObjetivo.split('/')
      const diaObjetivo = parseInt(partesFechaObjetivo[0])
      const mesObjetivo = parseInt(partesFechaObjetivo[1]) - 1 // Restamos 1 porque los meses en JavaScript van de 0 a 11
      const anioObjetivo = parseInt(partesFechaObjetivo[2])
      // Crea el objeto Date para la fecha objetivo y establece las horas, minutos, segundos y milisegundos a cero
      const fechaObjetivoDate = new Date(anioObjetivo, mesObjetivo, diaObjetivo)
      fechaObjetivoDate.setHours(0, 0, 0, 0)
      return fechaObjetivoDate.getDate() - fechaActual.getDate()
    }
    return null
  }

  return (
    <div className="h-[85%] overflow-y-auto ">
      {estado != 3
        ? Object.keys(groupedNotificaciones).map((fechaKey) => (
          <Accordion
            key={fechaKey}
            expanded={expanded === `panel1${fechaKey}`}
            onChange={handleChange(`panel1${fechaKey}`)}
            className="acordion_notifiacte"
          >
            {!esHoy(fechaKey) && (
              <AccordionSummary
                aria-controls="panel1d-content"
                id="panel1d-header"
                className="styled_tttle"
              >
                <div className="flex gap-3 py-2 px-2">
                  {esHoy(fechaKey)
                    ? (
                    <>
                      <h3 className="text-gray-500">Hoy</h3>
                      <span className="bg_gradiante w-[22px] h-[22px] my-auto flex justify-center text-center items-center text-white rounded-lg text-sm">
                        {groupedNotificaciones[fechaKey].length}
                      </span>
                    </>
                      )
                    : (
                    <>
                      <h3 className="text-gray-500">{fechaKey}</h3>
                      <span className="bg_gradiante w-[22px] h-[22px] my-auto flex justify-center text-center items-center text-white rounded-lg text-sm">
                        {groupedNotificaciones[fechaKey].length}
                      </span>
                    </>
                      )}
                </div>
              </AccordionSummary>
            )}
            <AccordionDetails className="desplegablex">
              <div
                className={`h-full grid ${
                  !zoom ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'
                } gap-3`}
              >
                {groupedNotificaciones[fechaKey].map(
                  (notificacion: notificacionesValues) =>
                    (notificacion.tipo && notificacion.tipo) == 'cliente'
                      ? (
                      <Link
                        to={`/admin/lista-servicios/avances/${notificacion.url}`}
                        onClick={() => {
                          setLoadingComponents(false)
                        }}
                        className="w-full block group relative"
                        key={notificacion.id}
                      >
                        <div className="flex flex-col w-full">
                          <div className="bg-white group-hover:bg-[#e6e6e642] transition-colors  w-full p-3 flex h-[130px] border_inner2 rounded-lg">
                            <div className="w-[50px] h-1/2 flex gap-2">
                              <span className="flex  p-2 rounded-lg">
                                {notificacion.icono == 'comentario'
                                  ? (
                                  <TbMessage2Check className="text-2xl text-main/80" />
                                    )
                                  : (
                                  <IoMdMailOpen className="text-2xl text-main/80" />
                                    )}
                              </span>
                            </div>
                            <div className="w-full h-full px-2">
                              <div>
                                <h1 className="text-black font-bold">
                                  {notificacion.id_general}
                                </h1>
                                <p className="text-sm text-gray-500">
                                  {calcularDiferenciaDeTiempo(
                                    notificacion.created_at
                                  )}
                                </p>
                                <span className="text-black  mt-1 line-clamp-2">
                                  {notificacion.contenido}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                        )
                      : (
                      <Link
                        to={`${notificacion.url}`}
                        onClick={() => {
                          setLoadingComponents(false)
                        }}
                        className="w-full block group relative"
                        key={notificacion.id}
                      >
                        <div className="flex flex-col w-full">
                          <div className="bg-white group-hover:bg-[#e6e6e642] transition-colors  w-full p-3 flex h-[130px] border_inner2 rounded-lg">
                            <div className="w-[50px] h-1/2 flex gap-2">
                              <span className="flex  p-2 rounded-lg">
                                {notificacion.icono == 'comentario'
                                  ? (
                                  <TbMessage2Check className="text-2xl text-main/80" />
                                    )
                                  : (
                                  <IoMdMailOpen className="text-2xl text-main/80" />
                                    )}
                              </span>
                            </div>
                            <div className="w-full h-full px-2">
                              <div>
                                <h1 className="text-black font-bold">
                                  {notificacion.usuario}
                                </h1>
                                <p className="text-sm text-gray-500">
                                  {calcularDiferenciaDeTiempo(
                                    notificacion.created_at
                                  )}
                                </p>
                                <span className="text-black  mt-1 line-clamp-2">
                                  {notificacion.contenido}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                        )
                )}
              </div>
            </AccordionDetails>
          </Accordion>
        ))
        : (
            <Accordion
            expanded={expanded === 'panel001'}
            onChange={handleChange('panel1001')}
            className="acordion_notifiacte"
          >
            <AccordionDetails className="desplegablex">
              <div
                className={`h-full grid ${
                  !zoom ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'
                } gap-3`}
              >
                {notificaciones.map(
                  (notificacion: any) =>
                      <Link
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                        to={`/admin/lista-servicios/avances/${notificacion.id}`}
                        onClick={() => {
                          setLoadingComponents(false)
                        }}
                        className="w-full block group relative"
                        key={notificacion.id}
                      >
                        <div className="flex flex-col w-full">
                          <div className="bg-white group-hover:bg-[#e6e6e642] transition-colors  w-full p-3 flex h-[130px] border_inner2 rounded-lg">
                            <div className="w-[50px] h-1/2 flex gap-2">
                              <span className="flex  p-2 rounded-lg">
                                  <CiTimer className="text-2xl text-main/80" />
                              </span>
                            </div>
                            <div className="w-full h-full px-2 flex flex-col ">
                              <div>
                                <h1 className="text-black font-bold">
                                  {notificacion.nombres} {notificacion.apellidos}
                                </h1>
                                <span className="text-black  mt-1 line-clamp-2">
                                  El proyecto {notificacion.nombre_marca} vence el dia {notificacion.fecha_fin}
                                </span>
                                <p className="text-sm text-gray-500 my-1">
                                  Le quedan {calcularDiasRestantes(notificacion.fecha_fin)} dias para descargar sus archivos
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                )
                }
              </div>
            </AccordionDetails>
          </Accordion>
      // <div
      //   className={`h-full grid ${
      //     !zoom ? 'grid-cols-1' : 'md:grid-cols-2 lg:grid-cols-3'
      //   } gap-3`}
      // >
      //   <Link
      //     to="#"
      //     //   to={`/admin/lista-servicios/avances/${notificacion.url}`}
      //     onClick={() => {
      //       setLoadingComponents(false)
      //     }}
      //     className="w-full block group relative"
      //     //   key={notificacion.id}
      //   >
      //     <div className="flex flex-col w-full">
      //       <div className="bg-white group-hover:bg-[#e6e6e642] transition-colors  w-full p-3 flex h-[130px] border_inner2 rounded-lg">
      //         <div className="w-[50px] h-1/2 flex gap-2">
      //           <span className="flex  p-2 rounded-lg">
      //             {/* {notificacion.icono == 'comentario'
      //                     ? <TbMessage2Check className="text-2xl text-main/80" />
      //                     : <IoMdMailOpen className="text-2xl text-main/80" />
      //                   } */}
      //           </span>
      //         </div>
      //         <div className="w-full h-full px-2">
      //           <div>
      //             <h1 className="text-black font-bold">
      //               {/* {notificacion.id_general} */}
      //             </h1>
      //             <p className="text-sm text-gray-500">
      //               {/* {calcularDiferenciaDeTiempo(
      //                       notificacion.created_at
      //                     )} */}
      //             </p>
      //             <span className="text-black  mt-1 line-clamp-2">
      //               {/* {notificacion.contenido} */}
      //             </span>
      //           </div>
      //         </div>
      //       </div>
      //     </div>
      //   </Link>
      // </div>
          )}
    </div>
  )
}
