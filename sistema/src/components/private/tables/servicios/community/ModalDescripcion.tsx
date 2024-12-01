/* eslint-disable @typescript-eslint/no-base-to-string */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable multiline-ternary */
import { Dialog, DialogContent } from '@mui/material'
import { type Dispatch, type SetStateAction, useState, useEffect } from 'react'
import { type usurioValues, type arrayCategoriasToPortafolio, type comentariosValues } from '../../../../shared/schemas/Interfaces'
import { RViewer, RViewerTrigger } from 'react-viewerjs'
import { Global } from '../../../../../helper/Global'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { IoImageOutline } from 'react-icons/io5'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import useAuth from '../../../../../hooks/useAuth'
import Swal from 'sweetalert2'
import { v4 as uuidv4 } from 'uuid'
import { useParams } from 'react-router-dom'
import { ListaComentarios } from './ListaComentarios'
import { CrearComentario } from './CrearComentario'
import { ResponderComentario } from './ResponderComentario'
import moment from 'moment'
import EditorComunnity from './modals/EditorComunnity'
import { FaEdit, FaSave } from 'react-icons/fa'
import { cn } from '../../../../shared/cn'
import { icono } from '../../../../shared/Images'
import { FaCheckDouble, FaEyeLowVision } from 'react-icons/fa6'
import { toast } from 'sonner'

import { S3Client, DeleteObjectCommand } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'

export const ModalDescripcion = ({
  open,
  setOpen,
  eventSelected,
  events,
  setEvents,
  loadingUpdate,
  setLoadingUpdate,
  getOneBrief,
  marca,
  nombres,
  email,
  communityActivo
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  eventSelected: any | null
  events: Event[]
  setEvents: Dispatch<SetStateAction<Event[]>>
  loadingUpdate: boolean
  setLoadingUpdate: Dispatch<SetStateAction<boolean>>
  getOneBrief: () => Promise<void>
  marca: string
  nombres: string
  email: string
  communityActivo: any
}): JSX.Element => {
  const { id } = useParams()
  const { auth } = useAuth()
  const [contexto, setContexto] = useState('')
  const [tema, setTema] = useState('')
  const [hora, setHora] = useState('')
  const [arrayArchivos, setArrayArchivos] = useState<arrayCategoriasToPortafolio[]>([])
  const [comentarios, setComentarios] = useState<comentariosValues[]>([])
  const { setShowError, setDownloadProgress } = useAuth()
  const token = localStorage.getItem('token')
  const [selectedUser] = useState<usurioValues | null>(null)
  const [cantidadVistas, setCantidadVistas] = useState<string>('')
  const [openRegistro, setOpenRegistro] = useState(false)
  const [edicion, setEdicion] = useState(true)
  const [selectedArchivo] = useState<string>('')
  const [archivosAEliminar, setarchivosAEliminar] = useState<arrayCategoriasToPortafolio[] | undefined>([])
  const [nuevoTitulo, setNuevoTitulo] = useState(eventSelected?.title || '')

  const [openResponder, setOpenResponder] = useState(false)
  const [idComentario, setIdComentario] = useState<string | null>('')
  const [texto, setTexto] = useState<string | null>('')

  const enviarCorreo = async (): Promise<void> => {
    let currentDate = moment()
    if (currentDate.day() === 5) {
      currentDate = currentDate.add(2, 'days')
    } else if (currentDate.day() === 6) {
      currentDate = currentDate.add(1, 'days')
    }
    currentDate = currentDate.add(2, 'days')
    currentDate = currentDate.startOf('day').add(12, 'hours')
    const formattedDate = currentDate.format('DD/MM/YYYY')
    const correos = [
      { id: uuidv4(), correo: email },
      { id: uuidv4(), correo: auth.email }
    ]
    try {
      const data = new FormData()
      data.append('titulo', `CONFIRMACION DE POST - ${(eventSelected?.event?.title).toUpperCase()}`)
      data.append('nombres', nombres)
      data.append('post', (eventSelected?.event?.title).toUpperCase())
      data.append('fecha', formattedDate)
      data.append('firma', auth.firma)
      data.append('correos', JSON.stringify(correos))

      await axios.post(`${Global.url}/enviarCorreoInfoCommunity`, data, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
    } catch (error) {
      console.log(error)
    }
  }

  function formatFileName (fileName: string): string {
    return fileName
      .normalize('NFD') // Descompone caracteres compuestos (ej: á -> a´)
      .replace(/[\u0300-\u036f]/g, '') // Remueve diacríticos
      .replace(/\s+/g, '-') // Reemplaza espacios por guiones
      .toLowerCase() // Convierte todo a minúsculas
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault()
    const file = e.target.files?.[0]
    if (file) {
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const uniqueFileName = `${uuidv4()}_${formatFileName(file.name)}`
      setArrayArchivos((prevState) => [
        ...prevState,
        {
          id: uuidv4(),
          imagen1: {
            archivo: file,
            archivoName: uniqueFileName
          }
        }
      ])
      const updatedEvents = events.map((event: any) => {
        if (event.id == eventSelected?.event.id) {
          // Obtener la fecha actual
          let currentDate = moment()
          // Asegurarse de que el evento no venza en domingo
          if (currentDate.day() === 5) {
            // Si es sábado
            currentDate = currentDate.add(2, 'days') // Agregar dos días para evitar domingo
          } else if (currentDate.day() === 6) {
            // Si es domingo
            currentDate = currentDate.add(1, 'days') // Agregar un día para evitar domingo
          }
          // Agregar dos días al día actual
          currentDate = currentDate.add(2, 'days')
          // Establecer la hora a las 12 de la noche
          currentDate = currentDate.startOf('day').add(12, 'hours')
          return {
            ...event,
            fecha_vencimiento: currentDate.toDate()
          }
        }
        return event
      })
      setEvents(updatedEvents)
    }
    e.target.value = ''
  }

  const isVideo = (fileName: string): boolean => {
    const videoExtensions = ['.mp4', '.avi', '.mov'] // Agregar más extensiones de video si es necesario
    const fileExtension = fileName.substr(fileName.lastIndexOf('.')).toLowerCase()
    return videoExtensions.includes(fileExtension)
  }

  const eliminarArray = (id: number | null): void => {
    const imagenEliminada = arrayArchivos.find((imagen) => imagen.id === id)
    if (imagenEliminada) {
      setarchivosAEliminar((prevArchivosAEliminar) => [
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        ...prevArchivosAEliminar,
        imagenEliminada.imagen1.archivoName
      ])
    }
    const nuevoArray = arrayArchivos.filter((peso) => peso.id !== id)
    setArrayArchivos(nuevoArray)
  }

  const updateCantidadVistas = (): void => {
    if (selectedUser && selectedArchivo) {
      setArrayArchivos((prevState) => {
        return prevState.map((archivo: any) => {
          if (archivo.id == selectedArchivo) {
            return {
              ...archivo,
              arrayColaboradores: archivo.arrayColaboradores.map((col: any) => {
                if (col.usuario.id == selectedUser.id) {
                  return {
                    ...col,
                    cantidadVistas
                  }
                }
                return col
              })
            }
          }
          return archivo
        })
      })
      setOpenRegistro(false) // Cerrar el modal después de grabar
    }
  }

  const updateEventDescriptionById = (): void => {
    const updatedEvents = events.map((event: any) => {
      if (event.id == eventSelected?.event.id) {
        return {
          ...event,
          title: nuevoTitulo,
          descripcion: {
            contexto,
            arrayArchivos,
            tema,
            hora
          }
        }
      }
      return event
    })
    updateCita(updatedEvents)
    setEvents(updatedEvents)
  }

  useEffect(() => {
    if (eventSelected?.event) {
      if (eventSelected?.event?.descripcion?.contexto) {
        setContexto(eventSelected?.event?.descripcion?.contexto)
      } else {
        setContexto('')
      }
      if (eventSelected?.title) {
        setNuevoTitulo(eventSelected?.title)
      } else {
        setNuevoTitulo('')
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

      setarchivosAEliminar([])
    }
  }, [eventSelected, open])

  const updateCita = async (updatedEvents: Event[]): Promise<void> => {
    console.log(arrayArchivos)
    if (communityActivo != 'false') {
      setLoadingUpdate(true)
      const data = new FormData()
      data.append('community', JSON.stringify(updatedEvents))
      data.append('archivosAEliminar', JSON.stringify(archivosAEliminar))
      data.append('_method', 'PUT')
      if (arrayArchivos[0]?.imagen1?.archivo && Object.keys(arrayArchivos[0].imagen1.archivo).length > 0) {
        enviarCorreo()
      }
      try {
        const respuesta = await axios.post(`${Global.url}/updateCalendarioComunnityVentas/${id ?? ''}`, data, {
          headers: {
            Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
          }
        })

        if (respuesta.data.status == 'success') {
          const formData = new FormData()
          formData.append('file_name', 'entrada_de_prueba')
          const { data } = await axios.post(`${Global.url}/generateGeneral`, formData, {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
            }
          })
          const s3Client = new S3Client({
            region: data.region,
            credentials: {
              accessKeyId: data.publickey, // Reemplaza con tu Access Key ID
              secretAccessKey: data.secretKey // Reemplaza con tu Secret Access Key
            }
          })
          if (archivosAEliminar && archivosAEliminar.length > 0) {
            for (const archivoName of archivosAEliminar) {
              await s3Client.send(
                new DeleteObjectCommand({
                  Bucket: 'mysistemalogosperu',
                  Key: `archivosComunnity/${archivoName}`
                })
              )
            }
          }
          // IMAGENES A SUBIR
          if (arrayArchivos[0]?.imagen1?.archivo && Object.keys(arrayArchivos[0].imagen1.archivo).length > 0) {
            const upload = new Upload({
              client: s3Client,
              params: {
                Bucket: data.bucket,
                Key: `archivosComunnity/${arrayArchivos[0].imagen1.archivoName}`,
                Body: arrayArchivos[0].imagen1.archivo ?? '',
                ContentType: 'multipart/form-data',
                ACL: 'public-read'
              },
              leavePartsOnError: false
            })
            upload.on('httpUploadProgress', (progress: any) => {
              const progressPercentage = Math.round((progress.loaded * 100) / progress.total)
              setDownloadProgress(progressPercentage)
            })
            await upload.done()
          }
          setShowError({
            estado: 'success',
            texto: 'Evento actualizado'
          })
          setEdicion(true)
        } else {
          Swal.fire('Error al actualizar', '', 'error')
        }
      } catch (error) {
        console.log(error)
        Swal.fire('Error', '', 'error')
      } finally {
        setLoadingUpdate(false)
        setOpen(false)
      }
    } else {
      toast.warning('El proyecto esta deshabilitado')
    }
  }

  const updateEstadoById = (): void => {
    const updatedEvents = events.map((event: any) => {
      if (event.id == eventSelected?.event.id) {
        return {
          ...event,
          publicado: !event.publicado
        }
      }
      return event
    })
    updateCita(updatedEvents)
    setEvents(updatedEvents)
  }

  const eliminarRegistro = (): void => {
    if (arrayArchivos.length == 0) {
      const updatedEvents = events.filter((event: any) => event.id != eventSelected?.event.id)
      setEvents(updatedEvents)
      updateCita(updatedEvents)
    } else {
      Swal.fire('Los archivos deben ser eliminados.', '', 'warning')
    }
  }

  const handleDeleteClick = (): void => {
    Swal.fire({
      title: '¿Estás seguro?',
      text: 'Esta acción eliminará el registro. ¿Deseas continuar?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        // Si el usuario confirma la eliminación, ejecuta la acción de eliminación aquí
        eliminarRegistro() // Función para eliminar el registro
      }
    })
  }

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
          {!edicion && (
            <>
              <FaSave
                className="absolute top-3 left-3 text-main text-2xl cursor-pointer z-10"
                onClick={() => {
                  setEdicion(!edicion)
                }}
              />
              {eventSelected?.event?.publicado ? (
                <FaCheckDouble className="absolute z-10 top-3 left-12 text-2xl text-green-500 cursor-pointer my-auto" onClick={updateEstadoById} />
              ) : (
                <FaEyeLowVision className="absolute z-10 top-3 left-12 text-2xl text-red-500 cursor-pointer my-auto " onClick={updateEstadoById} />
              )}
            </>
          )}

          <section
            className={cn(
              'w-full h-full lg:h-fit rounded-md  flex flex-col justify-between overflow-y-auto',
              edicion ? 'bg-transparent' : 'bg-white p-4 '
            )}
          >
            {!edicion ? (
              <>
                <div className="w-full ">
                  <div className="w-full px-8 relative">
                    <input
                      type="text"
                      value={nuevoTitulo}
                      onChange={(e) => {
                        setNuevoTitulo(e.target.value)
                      }}
                      className="w-full text-center focus:border border-gray-300 rounded-md px-4 py-2 outline-none"
                      placeholder="Nuevo título"
                    />
                    {comentarios.length == 0 && !eventSelected?.event?.publicado && (
                      <RiDeleteBin6Line
                        className="absolute right-0 text-2xl text-red-500 top-0 bottom-0 cursor-pointer my-auto"
                        onClick={handleDeleteClick}
                      />
                    )}
                  </div>
                  <div className="mt-4">
                    <div className="w-full flex gap-3">
                      <div className="w-full relative pb-0 md:pb-3">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                          Descripción
                        </label>
                        <input
                          className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                          value={tema}
                          onChange={(e) => {
                            setTema(e.target.value)
                          }}
                        />
                      </div>
                      <div className="w-24 relative pb-0 md:pb-3">
                        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                          Hora
                        </label>
                        <select
                          id="hora"
                          name="hora"
                          className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                          value={hora}
                          onChange={(e) => {
                            setHora(e.target.value)
                          }}
                        >
                          {Array.from({ length: 10 }, (_, i) => i + 9).map((hour) => (
                            <option key={hour} value={`${hour}:00`}>{`${hour}:00`}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                  </div>
                  <div className="mt-0 rounded-md overflow-hidden relative">
                    <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70" htmlFor="email">
                      Copy
                    </label>
                    <EditorComunnity content={contexto} setContent={setContexto} />
                  </div>
                  <div className="w-full mt-4 flex items-center justify-between flex-col-reverse lg:flex-row gap-3">
                    <div className="relative w-fit">
                      <button type="button" className="bg-red-500 text-white px-4 text-lg rounded-lg flex gap-3 items-center">
                        <IoImageOutline className="text-xl" />
                        Adjuntar archivo
                      </button>
                      <input
                        className="absolute inset-0 file:hidden opacity-0 cursor-pointer"
                        type="file"
                        accept="image/*, video/*" // Aquí se aceptan tanto imágenes como videos
                        onChange={handleImageChange}
                      />
                    </div>
                    <p className="uppercase text-gray-600">
                      Creado por: <span className="font-bold">{eventSelected?.event?.user?.name}</span>
                    </p>
                  </div>
                  <div className="w-full grid grid-cols-2 mt-6 gap-6 justify-center flex-grow ">
                    {arrayArchivos?.map((pro: any) => (
                      <div className="flex gap-4 justify-center" key={pro.id}>
                        <div className="group relative">
                          {pro.imagen1.archivo != null && pro.imagen1.archivo.size > 0 ? (
                            pro.imagen1.archivo.type.includes('image') ? (
                              <RViewer imageUrls={`${URL.createObjectURL(pro.imagen1.archivo)}`}>
                                <RViewerTrigger>
                                  <img
                                    src={`${URL.createObjectURL(pro.imagen1.archivo)}`}
                                    className="w-[200px] h-[200px] object-contain cursor-pointer bg-gray-100 shadow-md"
                                  />
                                </RViewerTrigger>
                              </RViewer>
                            ) : (
                              <video
                                src={`${URL.createObjectURL(pro.imagen1.archivo)}`}
                                muted
                                autoPlay
                                loop
                                className="w-[200px] h-[200px] object-contain bg-gray-100 shadow-md"
                              />
                            )
                          ) : (
                            pro.imagen1.archivo && (
                              <div className="w-full">
                                {isVideo(pro.imagen1.archivoName) ? (
                                  <video
                                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                    src={`https://mysistemalogosperu.s3.us-east-1.amazonaws.com/archivosComunnity/${pro.imagen1.archivoName}`}
                                    muted
                                    autoPlay
                                    loop
                                    className="w-[200px] h-[200px] object-contain bg-gray-100 shadow-md"
                                  />
                                ) : (
                                  <RViewer
                                    imageUrls={`https://mysistemalogosperu.s3.us-east-1.amazonaws.com/archivosComunnity/${pro.imagen1.archivoName}`}
                                  >
                                    <RViewerTrigger>
                                      <img
                                        src={`https://mysistemalogosperu.s3.us-east-1.amazonaws.com/archivosComunnity/${pro.imagen1.archivoName}`}
                                        className="w-[200px] h-[200px] object-contain cursor-pointer bg-gray-100 shadow-md"
                                      />
                                    </RViewerTrigger>
                                  </RViewer>
                                )}
                              </div>
                            )
                          )}
                          <RiDeleteBin6Line
                            className="cursor-pointer text-center opacity-0 text-main transition-opacity group-hover:opacity-100 absolute right-1 top-1 text-2xl z-10"
                            onClick={() => {
                              eliminarArray(pro.id)
                            }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-full flex justify-center mb-3">
                  {loadingUpdate ? (
                    <button disabled className="w-fit mx-auto px-5 py-2 rounded-md bg-green-700 transition-colors text-white">
                      Validando...
                    </button>
                  ) : (
                    <button
                      className="w-fit mx-auto px-5 py-2 rounded-md bg-green-600 hover:bg-green-700 transition-colors text-white"
                      onClick={() => {
                        updateEventDescriptionById()
                      }}
                    >
                      Grabar
                    </button>
                  )}
                </div>
              </>
            ) : (
              <div className="w-full ">
                <div className="bg-white w-full min-h-[400px] mx-auto p-4 rounded-md relative">
                  <FaEdit
                    className="absolute top-3 right-3 text-main text-2xl cursor-pointer z-10"
                    onClick={() => {
                      setEdicion(!edicion)
                    }}
                  />

                  <div className="w-full flex gap-3 items-center">
                    <img src={icono} alt="" className="object-contain w-14 h-14 bg-white rounded-full p-2 border-2 border-main" />
                    <div className="flex flex-col gap-0">
                      <span className="text-black font-semibold text-lg">{marca}</span>
                      <span className="text-gray-500 font-medium">
                        {obtenerFecha(eventSelected?.event?.start)} : {hora}
                      </span>
                    </div>
                  </div>
                  <div className="w-full mt-6">
                    <p className="mb-2">
                      <strong>Titulo: </strong>
                      {eventSelected?.event?.title}
                    </p>
                    <p>
                      <strong>Tema: </strong>
                      {tema}
                    </p>
                  </div>
                  <div className="w-full mt-6">
                    <div className="" dangerouslySetInnerHTML={{ __html: contexto }}></div>
                  </div>
                  <div
                    className="w-full mt-6 grid gap-3 justify-start"
                    style={{
                      gridTemplateColumns: `repeat(${arrayArchivos.length}, 1fr)`
                    }}
                  >
                    {arrayArchivos?.map((pro: any) => (
                      <div className={cn('flex gap-4 justify-center')} key={pro.id}>
                        <div className="group relative w-full">
                          {pro.imagen1.archivo && (
                            <div className="w-full">
                              {isVideo(pro.imagen1.archivoName) ? (
                                <video
                                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                  src={`https://mysistemalogosperu.s3.us-east-1.amazonaws.com/archivosComunnity/${pro.imagen1.archivoName}`}
                                  muted
                                  autoPlay
                                  loop
                                  className="w-full h-[200px] lg:h-[400px] object-contain bg-gray-100 shadow-md"
                                />
                              ) : (
                                <RViewer
                                  imageUrls={`https://mysistemalogosperu.s3.us-east-1.amazonaws.com/archivosComunnity/${pro.imagen1.archivoName}`}
                                >
                                  <RViewerTrigger>
                                    <img
                                      src={`https://mysistemalogosperu.s3.us-east-1.amazonaws.com/archivosComunnity/${pro.imagen1.archivoName}`}
                                      className="w-full h-[200px] lg:h-[400px] object-contain cursor-pointer bg-gray-100 shadow-md"
                                    />
                                  </RViewerTrigger>
                                </RViewer>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </section>

          <section className="w-full h-full md:h-fit">
            <CrearComentario
              setComentarios={setComentarios}
              getOneBrief={getOneBrief}
              events={events}
              setEvents={setEvents}
              eventSelected={eventSelected}
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
        <AnimatePresence>
          {openRegistro && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className=" fixed inset-0 m-auto z-[999999999999] w-full h-full bg-black/30 flex items-center justify-center"
            >
              <div className="w-[400px] h-fit p-6 bg-white rounded-lg shadow-md relative">
                <span
                  onClick={() => {
                    setOpenRegistro(false)
                  }}
                  className="text-main text-lg absolute top-0 right-2 cursor-pointer hover:text-red-900 hover:scale-125 transition-all"
                >
                  x
                </span>
                <h2 className="text-xl uppercase mb-4 text-black w-full text-center font-bold">Editar visitas</h2>
                <input
                  id="cantidadVistas"
                  className="swal2-input w-full border border-gray-300 rounded-md px-4 py-2"
                  placeholder="Cantidad de vistas"
                  value={cantidadVistas}
                  onChange={(e) => {
                    setCantidadVistas(e.target.value)
                  }}
                />
                <div className="w-full flex">
                  <button
                    type="button"
                    onClick={updateCantidadVistas}
                    className="mx-auto bg-red-500 rounded-lg px-5 py-1 mt-4 w-fit text-center text-white"
                  >
                    Grabar
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </Dialog>
    </>
  )
}
