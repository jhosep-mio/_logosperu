/* eslint-disable multiline-ternary */
import { Dialog, DialogContent } from '@mui/material'
import { type Dispatch, type SetStateAction, useState, useEffect } from 'react'
import { CrearComentario } from './CrearComentario'
import { ListaComentarios } from './ListaComentarios'
import { ResponderComentario } from './ResponderComentario'
import icono from './../../../../../assets/logo/icono.png'
import { cn } from '../../../../shared/cn'
import { IoMdCloseCircle } from 'react-icons/io'
import { type comentariosValues, type arrayCategoriasToPortafolio, type bannersValues } from '../../../../shared/schemas/Interfaces'

export const ModalDescripcion = ({
  open,
  setOpen,
  eventSelected,
  events,
  setEvents,
  getOneBrief,
  datos,
  correos
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  eventSelected: any | null
  events: Event[]
  setEvents: Dispatch<SetStateAction<Event[]>>
  getOneBrief: () => Promise<void>
  datos: bannersValues
  correos: never[]
}): JSX.Element => {
  const [contexto, setContexto] = useState('')
  const [arrayArchivos, setArrayArchivos] = useState<
  arrayCategoriasToPortafolio[]
  >([])
  const [comentarios, setComentarios] = useState<comentariosValues[]>([])
  const [openResponder, setOpenResponder] = useState(false)
  const [idComentario, setIdComentario] = useState<string | null>('')
  const [texto, setTexto] = useState<string | null>('')
  const [tema, setTema] = useState('')
  const [hora, setHora] = useState('')

  const isVideo = (fileName: string): boolean => {
    const videoExtensions = ['.mp4', '.avi', '.mov'] // Agregar más extensiones de video si es necesario
    const fileExtension = fileName
      .substr(fileName.lastIndexOf('.'))
      .toLowerCase()
    return videoExtensions.includes(fileExtension)
  }

  useEffect(() => {
    if (eventSelected?.event) {
      if (eventSelected?.event?.descripcion?.contexto) {
        setContexto(eventSelected?.event?.descripcion?.contexto)
      } else {
        setContexto('')
      }
      if (eventSelected?.event?.descripcion?.hora) {
        setHora(eventSelected?.event?.descripcion?.hora)
      } else {
        setHora('')
      }
      if (eventSelected?.event?.descripcion?.tema) {
        setTema(eventSelected?.event?.descripcion?.tema)
      } else {
        setTema('')
      }
      if (eventSelected?.event?.descripcion?.arrayArchivos) {
        setArrayArchivos(eventSelected?.event?.descripcion?.arrayArchivos)
      } else {
        setArrayArchivos([])
      }

      if (eventSelected?.event?.comentarios) {
        setComentarios(eventSelected?.event?.comentarios)
      } else {
        setComentarios([])
      }
    }
  }, [eventSelected, open])

  const obtenerFecha = (fechaActual: string): string => {
    const fecha = new Date(fechaActual)
    // Verificar si la fecha es válida
    if (isNaN(fecha.getTime())) {
      return '' // O puedes manejar este caso de otra manera según tu lógica
    }
    const dia = fecha.getDate()
    const mes = fecha.getMonth() + 1
    const año = fecha.getFullYear()
    // Asegúrate de agregar ceros a la izquierda si es necesario para mantener el formato
    const diaFormateado = dia < 10 ? `0${dia}` : `${dia}`
    const mesFormateado = mes < 10 ? `0${mes}` : `${mes}`
    // Formatear la fecha en el formato deseado (dd/mm/yyyy)
    return `${diaFormateado}/${mesFormateado}/${año}`
  }

  const obtenerURLCodificada = (archivoName: string): string => {
    const nombreCodificado = encodeURIComponent(archivoName)
      .replace(/%20/g, '+') // Reemplaza los espacios codificados por '+'
    return nombreCodificado
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false)
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="modal_community_clientes"
      >
        <DialogContent className="w-full h-full grid grid-cols-1 lg:grid-cols-2 gap-3 lg:gap-10 bg-transparent quitaR_padding scroll_movil">
          <section className="w-full relative h-full lg:h-fit rounded-md  flex flex-col justify-between overflow-y-auto bg-white ">
           <IoMdCloseCircle className='absolute top-2 right-2 text-3xl z-10 cursor-pointer' onClick={() => { setOpen(false) }}/>
            <div className="w-full ">
              <div className="bg-white w-full min-h-[400px] mx-auto p-4 rounded-md relative">
                <div className="w-full flex gap-3 items-center">
                  <img
                    src={icono}
                    alt=""
                    className="object-contain w-14 h-14 bg-white rounded-full p-2 border-2 border-main"
                  />
                  <div className="flex flex-col gap-0">
                    <span className="text-black font-semibold text-lg">
                      {datos?.nombre_marca}
                    </span>
                    <span className="text-gray-500 font-medium">
                      {obtenerFecha(eventSelected?.event?.start)}  {hora && `: ${hora}`}
                    </span>
                  </div>
                </div>
                {tema &&
                    <div className="w-full mt-6">
                    <p>
                        <strong>Tema: {tema}</strong>
                    </p>
                    </div>
                }
                <div className="w-full mt-6">
                  <div
                    className=""
                    dangerouslySetInnerHTML={{ __html: contexto }}
                  ></div>
                </div>
                <div
                  className="w-full mt-6 grid gap-3 justify-start"
                  style={{
                    gridTemplateColumns: `repeat(${arrayArchivos.length}, 1fr)`
                  }}
                >
                  {arrayArchivos?.map((pro: any) => (
                    <div
                      className={cn('flex gap-4 justify-center')}
                      key={pro.id}
                    >
                      <div className="group relative w-full">
                        {pro.imagen1.archivo && (
                          <div className="w-full">
                            {isVideo(pro.imagen1.archivoName) ? (
                              <video
                                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                src={`https://mysistemalogosperu.s3.us-east-1.amazonaws.com/archivosComunnity/${obtenerURLCodificada(pro.imagen1.archivoName)}`}
                                muted
                                autoPlay
                                loop
                                className="w-full h-[200px] lg:h-[400px] object-contain bg-gray-100 shadow-md"
                              />
                            ) : (
                              <img
                                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                src={`https://mysistemalogosperu.s3.us-east-1.amazonaws.com/archivosComunnity/${obtenerURLCodificada(pro.imagen1.archivoName)}`}
                                className="w-full h-[200px] lg:h-[400px] object-contain cursor-pointer bg-gray-100 shadow-md"
                              />
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
          <section className="w-full ">
            <CrearComentario
              setComentarios={setComentarios}
              getOneBrief={getOneBrief}
              events={events}
              setEvents={setEvents}
              eventSelected={eventSelected}
              datos={datos}
            />
            <ListaComentarios
              setIdComentario={setIdComentario}
              setOpen={setOpenResponder}
              setTexto={setTexto}
              comentarios={comentarios}
              setComentarios={setComentarios}
              getOneBrief={getOneBrief}
              events={events}
              setEvents={setEvents}
              eventSelected={eventSelected}
              datos={datos}
              correos={correos}
            />
            <ResponderComentario
              comentarios={comentarios}
              getComentarios={getOneBrief}
              idComentario={idComentario}
              open={openResponder}
              setComentarios={setComentarios}
              setIdComentario={setIdComentario}
              setOpen={setOpenResponder}
              textoComentario={texto}
              eventSelected={eventSelected}
              events={events}
              setEvents={setEvents}
            />
          </section>
        </DialogContent>
      </Dialog>
    </>
  )
}
