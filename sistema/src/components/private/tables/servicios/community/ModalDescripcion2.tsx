/* eslint-disable multiline-ternary */
import { Dialog, DialogContent } from '@mui/material'
import { type Dispatch, type SetStateAction, useState, useEffect } from 'react'
import {
  type comentariosValues,
  type arrayCategoriasToPortafolio
} from '../../../../shared/schemas/Interfaces'
import { RViewer, RViewerTrigger } from 'react-viewerjs'
import { Global } from '../../../../../helper/Global'
import Editor from '../../clientes/cotizacion/Editor'
import { ListaComentarios2 } from './ListaComentarios2'

export const ModalDescripcion2 = ({
  open,
  setOpen,
  eventSelected
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  eventSelected: any | null
}): JSX.Element => {
  const [contexto, setContexto] = useState('')
  const [arrayArchivos, setArrayArchivos] = useState<
  arrayCategoriasToPortafolio[]
  >([])
  const [comentarios, setComentarios] = useState<comentariosValues[]>([])
  const isVideo = (fileName: string): boolean => {
    const videoExtensions = ['.mp4', '.avi', '.mov'] // Agregar más extensiones de video si es necesario
    const fileExtension = fileName
      .substr(fileName.lastIndexOf('.'))
      .toLowerCase()
    return videoExtensions.includes(fileExtension)
  }

  useEffect(() => {
    if (eventSelected) {
      if (eventSelected?.descripcion?.contexto) {
        setContexto(eventSelected?.descripcion?.contexto)
      } else {
        setContexto('')
      }
      if (eventSelected?.descripcion?.arrayArchivos) {
        setArrayArchivos(eventSelected?.descripcion?.arrayArchivos)
      } else {
        setArrayArchivos([])
      }
      if (eventSelected?.comentarios) {
        setComentarios(eventSelected?.comentarios)
      } else {
        setComentarios([])
      }
    }
  }, [eventSelected, open])

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
        {eventSelected?.tipo != 'solicitud_informacion' ? (
          <DialogContent className="w-full h-[550px] grid grid-cols-2 gap-10 bg-transparent quitaR_padding">
            <section className="w-full h-[550px] bg-white p-4 rounded-md flex flex-col justify-between overflow-y-auto">
              <div className="w-full ">
                <div className="w-full relative">
                  <h1 className="w-full uppercase text-center font-bold text-2xl">
                    {eventSelected?.title}
                  </h1>
                </div>
                <div className="mt-6">
                  <Editor content={contexto} setContent={setContexto} />
                </div>
                <div className="w-full mt-4 flex items-center justify-between gap-3">
                  <p className="uppercase text-gray-600">
                    Creado por:{' '}
                    <span className="font-bold">
                      {eventSelected?.user?.name}
                    </span>
                  </p>
                </div>
                <div className="w-full grid grid-cols-2 mt-6 gap-6 justify-center flex-grow ">
                  {arrayArchivos?.map((pro: any) => (
                    <div className="flex gap-4 justify-center" key={pro.id}>
                      <div className="group relative">
                        {pro.imagen1.archivo != null &&
                        pro.imagen1.archivo.size > 0 ? (
                              pro.imagen1.archivo.type.includes('image') ? (
                            <RViewer
                              imageUrls={`${URL.createObjectURL(
                                pro.imagen1.archivo
                              )}`}
                            >
                              <RViewerTrigger>
                                <img
                                  src={`${URL.createObjectURL(
                                    pro.imagen1.archivo
                                  )}`}
                                  className="w-[120px] h-[120px] object-contain cursor-pointer bg-gray-100 shadow-md"
                                />
                              </RViewerTrigger>
                            </RViewer>
                              ) : (
                            <video
                              src={`${URL.createObjectURL(
                                pro.imagen1.archivo
                              )}`}
                              muted
                              autoPlay
                              loop
                              className="w-[120px] h-[120px] object-contain bg-gray-100 shadow-md"
                            />
                              )
                            ) : (
                              pro.imagen1.archivo && (
                            <div className="w-full">
                              {isVideo(pro.imagen1.archivoName) ? (
                                <video
                                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                  src={`${Global.urlImages}/archivosComunnity/${pro.imagen1.archivoName}`}
                                  muted
                                  autoPlay
                                  loop
                                  className="w-[120px] h-[120px] object-contain bg-gray-100 shadow-md"
                                />
                              ) : (
                                <img
                                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                  src={`${Global.urlImages}/archivosComunnity/${pro.imagen1.archivoName}`}
                                  alt=""
                                  className="w-[120px] h-[120px]  object-contain bg-gray-100 shadow-md"
                                />
                              )}
                            </div>
                              )
                            )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
            <section className="w-full ">
              <ListaComentarios2 comentarios={comentarios} />
            </section>
          </DialogContent>
        ) : (
          <DialogContent className="w-full h-[550px] bg-transparent quitaR_padding">
            <section className="w-full h-[550px] bg-white p-4 rounded-md flex flex-col justify-between overflow-y-auto">
              <div className="w-full ">
                <div className="w-full relative">
                  <h1 className="w-full uppercase text-center font-bold text-2xl">
                    {eventSelected?.title}
                  </h1>
                </div>
                <div className="mt-6">
                  <Editor content={contexto} setContent={setContexto} />
                </div>
                <div className="w-full mt-4 flex items-center justify-between gap-3">
                  <p className="uppercase text-gray-600">
                    Creado por:{' '}
                    <span className="font-bold">
                      {eventSelected?.user?.name}
                    </span>
                  </p>
                </div>
                <div className="w-full grid grid-cols-2 mt-6 gap-6 justify-center flex-grow ">
                  {arrayArchivos?.map((pro: any) => (
                    <div className="flex gap-4 justify-center" key={pro.id}>
                      <div className="group relative">
                        {pro.imagen1.archivo != null &&
                        pro.imagen1.archivo.size > 0 ? (
                              pro.imagen1.archivo.type.includes('image') ? (
                            <RViewer
                              imageUrls={`${URL.createObjectURL(
                                pro.imagen1.archivo
                              )}`}
                            >
                              <RViewerTrigger>
                                <img
                                  src={`${URL.createObjectURL(
                                    pro.imagen1.archivo
                                  )}`}
                                  className="w-[120px] h-[120px] object-contain cursor-pointer bg-gray-100 shadow-md"
                                />
                              </RViewerTrigger>
                            </RViewer>
                              ) : (
                            <video
                              src={`${URL.createObjectURL(
                                pro.imagen1.archivo
                              )}`}
                              muted
                              autoPlay
                              loop
                              className="w-[120px] h-[120px] object-contain bg-gray-100 shadow-md"
                            />
                              )
                            ) : (
                              pro.imagen1.archivo && (
                            <div className="w-full">
                              {isVideo(pro.imagen1.archivoName) ? (
                                <video
                                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                  src={`${Global.urlImages}/archivosComunnity/${pro.imagen1.archivoName}`}
                                  muted
                                  autoPlay
                                  loop
                                  className="w-[120px] h-[120px] object-contain bg-gray-100 shadow-md"
                                />
                              ) : (
                                <img
                                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                  src={`${Global.urlImages}/archivosComunnity/${pro.imagen1.archivoName}`}
                                  alt=""
                                  className="w-[120px] h-[120px]  object-contain bg-gray-100 shadow-md"
                                />
                              )}
                            </div>
                              )
                            )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </DialogContent>
        )}
      </Dialog>
    </>
  )
}
