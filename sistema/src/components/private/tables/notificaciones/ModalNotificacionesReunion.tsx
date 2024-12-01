/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable multiline-ternary */
import { Link } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import { motion, AnimatePresence } from 'framer-motion'
import { calendario, calendarioReunion } from '../../../shared/Images'
import { format, parseISO } from 'date-fns'
import { cn } from '../../../shared/cn'
export const ModalNotificacionesReunion = ({
  colaboradores
}: {
  colaboradores: never[]
}): JSX.Element => {
  const {
    notificateToReuniones,
    openNotificacionReuniones,
    setopenNotificacionReuniones
  } = useAuth()

  const getNameById = (searchId: number): string | undefined => {
    try {
      const foundObj: any = colaboradores.find((obj: any) => obj.id == searchId)
      if (foundObj) {
        return foundObj.name
      }
    } catch (error) {
      console.error('Error al analizar JSON:', error)
    }
    return undefined // Retornar undefined si no se encuentra el id en el arreglo
  }

  return (
    <AnimatePresence>
      {openNotificacionReuniones && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="w-full fixed h-full inset-0 bg-black/50 flex items-center z-30"
              onClick={() => {
                setopenNotificacionReuniones(false)
              }}
            >
              <motion.div
                className="bg-white h-[97vh] lg:ml-[15%] my-auto mx-auto lg:mx-0 block rounded-lg overflow-hidden"
                onClick={(e) => {
                  e.preventDefault()
                  e.stopPropagation() // Evita que el evento se propague al contenedor padre
                }}
              >
                <div className="w-full flex items-center justify-between">
                  <h1 className="text-black font-bold text-2xl p-5">
                    Citas y Reuniones
                  </h1>
                </div>
                <div className="flex flex-col gap-y-3 w-full relative px-5 min-w-[540px]">
                    {notificateToReuniones && notificateToReuniones.length > 0 && notificateToReuniones.map((notificacion: any) => (
                        <Link
                        to={`/admin/gestor-tareas/citas-reuniones/${notificacion.id ?? ''}`}
                        className="w-[540px] block group relative"
                        key={notificacion.id}
                        onClick={() => setopenNotificacionReuniones(false)}
                      >
                        <div className="flex flex-col w-full">
                          <div className="bg-white group-hover:bg-[#e6e6e642] transition-colors  w-full p-3 flex h-fit border_inner2 rounded-lg">
                            <div className="w-[50px] h-1/2 flex gap-2">
                              <span className="flex p-1 rounded-lg">
                                {notificacion.tipo == 'cita'
                                  ? (
                                    <img src={calendario} alt="" className='object-contain object-top'/>
                                    )
                                  : (
                                    <img src={calendarioReunion} alt="" className='object-contain object-top'/>
                                    )}
                              </span>
                            </div>
                            <div className="w-full h-full px-2">
                              <div>
                                <h1 className="text-black font-bold">
                                  {notificacion.asunto}
                                </h1>
                                <span className='text-gray-600'>{getNameById(notificacion.user_id)}</span>
                                <div className='flex gap-2 items-center'>
                                    <span
                                        className={cn(
                                          'w-[15px] h-[15px]',
                                          notificacion.estado == 'Ocupado'
                                            ? 'bg-red-300'
                                            : notificacion.estado == 'Home office'
                                              ? 'bg-yellow-200'
                                              : notificacion.estado == 'Disponible'
                                                ? 'bg-green-300'
                                                : notificacion.estado == 'Provisional'
                                                  ? 'bg-gray-300'
                                                  : notificacion.estado == 'Fuera de la oficina'
                                                    ? 'bg-cyan-200'
                                                    : ''
                                        )}
                                    ></span>
                                    <span className='text-gray-600'>{notificacion.estado}</span>
                                </div>
                                <section className='grid-cols-2 grid mt-2'>
                                    <div className='flex gap-2  items-center text-black'>
                                        <p className='font-bold'>Inicio:</p>
                                        <p className="text-black   line-clamp-2">
                                            {format(parseISO(JSON.parse(notificacion.hora_inicio).dateinicio), 'dd-MM-yyyy')}
                                        </p >
                                        <p className="text-black   line-clamp-2">{JSON.parse(notificacion.hora_inicio).timeinicio}</p>
                                    </div>
                                    <div className='flex gap-2  items-center text-black'>
                                        <p className='font-bold'>Final:</p>
                                        <p className="text-black   line-clamp-2">
                                            {format(parseISO(JSON.parse(notificacion.hora_final).datefinal), 'dd-MM-yyyy')}
                                        </p >
                                        <p className="text-black   line-clamp-2">{JSON.parse(notificacion.hora_final).timefinal}</p>
                                    </div>
                                </section>
                              </div>
                            </div>
                          </div>
                        </div>
                      </Link>
                    ))}
                </div>
              </motion.div>
            </motion.div>
      )}
    </AnimatePresence>
  )
}
