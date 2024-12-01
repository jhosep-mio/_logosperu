/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useRef, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  imagen1,
  imagen10,
  imagen11,
  imagen12,
  imagen13,
  imagen14,
  imagen15,
  imagen16,
  imagen17,
  imagen18,
  imagen19,
  imagen2,
  imagen20,
  imagen21,
  imagen22,
  imagen23,
  imagen3,
  imagen4,
  imagen5,
  imagen6,
  imagen7,
  imagen8,
  imagen9
} from '../../../../shared/Images'
import { FiPlus } from 'react-icons/fi'
import { v4 as uuidv4 } from 'uuid'
import { IoClose } from 'react-icons/io5'
import axios from 'axios'
import { Backdrop, CircularProgress } from '@mui/material'
import { Global } from '../../../../../helper/Global'
import useAuth from '../../../../../hooks/useAuth'
import { type tableroInterface } from '../../../../shared/schemas/Interfaces'
import { TItuloTarjeta } from '../components/TItuloTarjeta'
import { ContenidoTarjeta } from '../components/ContenidoTarjeta'
import { ModalContenido } from '../components/ModalContenido'
import { toast } from 'sonner'

export const ViewOneGestor = (): JSX.Element => {
  const { auth, getContenidoCompartido } = useAuth()
  const { index, idTablero } = useParams()
  const totalImages = 23
  const getImageUrl = (): string => {
    // Asegúrate de tener todas las imágenes importadas
    const images = [
      imagen1,
      imagen2,
      imagen3,
      imagen4,
      imagen5,
      imagen6,
      imagen7,
      imagen8,
      imagen9,
      imagen10,
      imagen11,
      imagen12,
      imagen13,
      imagen14,
      imagen15,
      imagen16,
      imagen17,
      imagen18,
      imagen19,
      imagen20,
      imagen21,
      imagen22,
      imagen23
    ]
    // Calcula el índice basado en la longitud de las imágenes
    const indexfinal: number = Number(index) ?? 0
    const calculatedIndex = indexfinal % totalImages
    // Devuelve la URL de la imagen correspondiente
    return images[calculatedIndex]
  }
  const [cuerpo, setCuerpo] = useState<tableroInterface[]>([])
  const [tarea, setTarea] = useState<string | null>(null)
  const [tituloContenido, setTituloContenido] = useState<string | null>(null)
  const [agregar, setAgregar] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [fecha, setFecha] = useState('')
  const token = localStorage.getItem('token')
  const [contenidos, setContenidos] = useState<any[]>([])
  const [colaboradores, setColaboradores] = useState<never[]>([])
  const [loadingComponent, setLoadingComponent] = useState(false)
  const [loading, setLoading] = useState(true)
  const [contenidoSeleccionado, setContenidoSeleccionado] = useState<any | null>(null)
  const [seccionAbierta, setSeccionAbierta] = useState<string | null>(null)
  const textareaRef = useRef(null)
  const tareaTareRef = useRef(null)

  // AGREGAR TARJETAS
  const updateAction = async (cuerpo: any): Promise<string> => {
    const data = new FormData()
    data.append('cuerpo', JSON.stringify(cuerpo))
    data.append('_method', 'PUT')
    try {
      setLoadingComponent(true)
      const respuesta = await axios.post(`${Global.url}/gestor/update/${idTablero ?? ''}`, data, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      if (respuesta.data.status == 'success') {
        getTareas()
        return 'Actualizacion exitosa'
      } else {
        throw new Error('Error al crear tablero')
      }
    } catch (error) {
      console.log(error)
      throw new Error('Error al crear tablero')
    }
  }

  const updateCita = async (item: any): Promise<void> => {
    toast.promise(updateAction(item), {
      loading: 'Cargando...',
      success: (message: any) => message,
      error: (error: any) => error.message
    })
  }

  const handleAgregarTarea = (): void => {
    if (tarea) {
      const idUnico = uuidv4()
      const nuevaTarea = { id: idUnico, titulo: tarea, contenido: null }
      updateCita(nuevaTarea)
      setTarea('')
      setAgregar(false)
    }
  }
  //   ACTUALIZAR TITULO DE TARJETA
  const updateTitleTarjetaAction = async (idTable: string, nuevoTitulo: string): Promise<string> => {
    const data = new FormData()
    data.append('idTable', idTable)
    data.append('nuevoTitulo', nuevoTitulo)
    data.append('_method', 'PUT')
    try {
      setLoadingComponent(true)
      const respuesta = await axios.post(`${Global.url}/gestor/updateTitleTarjeta/${idTablero ?? ''}`, data, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      if (respuesta.data.status == 'success') {
        getTareas()
        return 'Actualizacion exitosa'
      } else {
        throw new Error('Error al crear tablero')
      }
    } catch (error) {
      console.log(error)
      throw new Error('Error al crear tablero')
    }
  }
  const updateTitleTarjeta = async (idTable: string, nuevoTitulo: string): Promise<void> => {
    toast.promise(updateTitleTarjetaAction(idTable, nuevoTitulo), {
      loading: 'Actualizando...',
      success: (message: any) => message,
      error: (error: any) => error.message
    })
  }
  //   AGREGAR ITEM DENTRO DE TARJETA
  const updateContenidoAction = async (itemCuerpo: any, idCuerpo: any): Promise<string> => {
    const data = new FormData()
    data.append('contenido', JSON.stringify(itemCuerpo))
    data.append('idCuerpo', idCuerpo)
    data.append('_method', 'PUT')
    try {
      setLoadingComponent(true)
      const respuesta = await axios.post(`${Global.url}/gestor/updateContenido/${idTablero ?? ''}`, data, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      if (respuesta.data.status == 'success') {
        getTareas()
        return 'Actualizacion exitosa'
      } else {
        throw new Error('Error al crear tablero')
      }
    } catch (error) {
      console.log(error)
      throw new Error('Error al crear tablero')
    }
  }
  const updateContenido = async (item: any, idCuerpo: any): Promise<void> => {
    toast.promise(updateContenidoAction(item, idCuerpo), {
      loading: 'Cargando...',
      success: (message: any) => message,
      error: (error: any) => error.message
    })
  }
  //  ELIMINAR TARJETAS
  const deleteTarjetaRequest = async (id: string): Promise<string> => {
    try {
      const data = new FormData()
      data.append('eliminar_id', id)
      data.append('_method', 'PUT')
      console.log(id)
      const respuesta = await axios.post(`${Global.url}/gestor/deleteTarjeta/${idTablero ?? ''}`, data, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      if (respuesta.data.status === 'success') {
        getTareas()
        return 'Tarjeta eliminada' // Mensaje de éxito
      } else {
        throw new Error('Error al eliminar tarjeta')
      }
    } catch (error) {
      console.log(error)
      throw new Error('Error al eliminar tarjeta')
    }
  }
  const deleteTarjeta = (id: string): void => {
    toast('¿Deseas eliminar esta tarjeta?', {
      action: {
        label: 'Eliminar',
        onClick: () => {
          toast.promise(deleteTarjetaRequest(id), {
            loading: 'Eliminando...',
            success: (message: any) => message,
            error: (error: any) => error.message
          })
        }
      },
      style: { background: '#f8d7da', color: '#721c24' },
      duration: 5000
    })
  }
  //   ACTUALIZAR TITULO DEL ITEM DE TARJETA
  const updateTitleItemTarjetaAction = async (idTable: string, idContenido: string, nuevoTitulo: string): Promise<string> => {
    const data = new FormData()
    data.append('idTable', idTable)
    data.append('idContenido', idContenido)
    data.append('nuevoTitulo', nuevoTitulo)
    data.append('_method', 'PUT')
    try {
      setLoadingComponent(true)
      const respuesta = await axios.post(`${Global.url}/gestor/updateTitleContenido/${idTablero ?? ''}`, data, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      await axios.post(`${Global.url}/gestorContenido/updateTitulo/${idContenido ?? ''}`, { titulo: nuevoTitulo, _method: 'PUT' }, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      //   updateTitulo
      if (respuesta.data.status == 'success') {
        getTareas()
        return 'Actualizacion exitosa'
      } else {
        throw new Error('Error al crear tablero')
      }
    } catch (error) {
      console.log(error)
      throw new Error('Error al crear tablero')
    }
  }
  const updateTitleItemTarjeta = async (idTable: string, idContenido: string, nuevoTitulo: string): Promise<void> => {
    toast.promise(updateTitleItemTarjetaAction(idTable, idContenido, nuevoTitulo), {
      loading: 'Actualizando...',
      success: (message: any) => message,
      error: (error: any) => error.message
    })
  }

  //   ACTUALIZAR ID DEL CUERPO DEL ITEM DE TARJETA
  const updateIDItemTarjetaAction = async (idTable: string, idContenido: string, newCod: string, titulo: string): Promise<string> => {
    const data = new FormData()
    data.append('idTable', idTable)
    data.append('idContenido', idContenido)
    data.append('contextoID', newCod)
    data.append('titulo', titulo)
    data.append('idUser', auth.id)
    data.append('_method', 'PUT')
    try {
      setLoadingComponent(true)
      const respuesta = await axios.post(`${Global.url}/gestor/updateIDContenido/${idTablero ?? ''}`, data, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      if (respuesta.data.status == 'success') {
        getTareas()
        setOpenModal(false)
        return 'Actualizacion exitosa'
      } else {
        throw new Error('Error al crear tablero')
      }
    } catch (error) {
      console.log(error)
      throw new Error('Error al crear tablero')
    }
  }

  const updateIDItemTarjeta = async (idTarjeta: string, idCuerpo: string, newCod: string, titulo: string): Promise<void> => {
    toast.promise(updateIDItemTarjetaAction(idTarjeta, idCuerpo, newCod, titulo), {
      loading: 'Creando...',
      success: (message: any) => message,
      error: (error: any) => error.message
    })
  }
  //   TRAER INFORMACION
  const getColaboradores = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/indexAllToGestor`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setColaboradores(request.data)
  }
  const getTareas = async (): Promise<void> => {
    getContenidoCompartido()
    const { data } = await axios.get(`${Global.url}/gestor/findOnetTablero/${idTablero ?? ''}`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? `Bearer ${token}` : ''}`
      }
    })
    const { data: contenidos } = await axios.get(`${Global.url}/gestorContenido/findByTablero/${idTablero ?? ''}`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? `Bearer ${token}` : ''}`
      }
    })
    setContenidos(contenidos)
    if (data) {
      setCuerpo(data.cuerpo ? JSON.parse(data.cuerpo) : null)
      const opcionesDeFormato = {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit'
      }
      const fecha = new Date(data.created_at)
      const fechaFormateada = fecha.toLocaleDateString(
        'es-ES',
        // @ts-expect-error
        opcionesDeFormato
      )
      setFecha(fechaFormateada)
      //   setEvents(parsedEvents)
    }
    setLoading(false)
  }
  const handleTextAdmin = (e: React.ChangeEvent<HTMLTextAreaElement>): void => {
    setTarea(e.target.value)
    e.target.style.height = '1.7rem'
    // Ajusta la altura del textarea según el contenido
    e.target.style.height = `${e.target.scrollHeight}px`
  }
  useEffect(() => {
    if (seccionAbierta && textareaRef.current) {
      // @ts-expect-error
      textareaRef.current?.focus()
    }
  }, [seccionAbierta])
  useEffect(() => {
    if (agregar && tareaTareRef.current) {
      // @ts-expect-error
      tareaTareRef.current?.focus()
    }
  }, [agregar])
  //   EDITAR TITULOSECCION
  const [tituloEdicion, settituloEdicion] = useState<string | null>(null)
  const [tituloContenidoEdicion, settituloContenidoEdicion] = useState<string | null>(null)

  useEffect(() => {
    getColaboradores()
    getTareas()
  }, [])

  useEffect(() => {
    const handleBeforeUnload = (event: BeforeUnloadEvent): void => {
      if (loadingComponent) {
        // Mostrar alerta si se intenta cerrar la página mientras se está cargando
        event.preventDefault()
        event.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload)
    }
  }, [loadingComponent])

  return (
    <>
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading} className="fondo_backdrop">
        <CircularProgress color="inherit" />
      </Backdrop>

      <div className="flex gap-3 items-center border-b border-gray-300 h-[7vh] py-1 md:py-0 lg:h-[10vh] mx-1 md:px-8 fixed w-full z-20 ">
        <div className="w-12 md:w-14 h-full md:h-14 rounded-md bg-gradient-to-r from-cyan-500 to-blue-400 flex justify-center text-white text-base md:text-2xl items-center font-extrabold">
          {auth.name.trim() !== '' ? auth.name.charAt(0).toUpperCase() : ''}
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-white font-bold text-sm md:text-lg">Espacio de trabajo de {auth.name.toUpperCase()}</h1>
          <div className="flex gap-2 justify-start">
            <span className="text-white text-sm">{fecha}</span>
          </div>
        </div>
      </div>
      <section
        className="w-full h-full  inset-0 p-8 bg-no-repeat bg-center bg-cover before:bg-[#00000051] before:inset-0 before:absolute"
        style={{ backgroundImage: `url(${getImageUrl() ?? ''})` }}
        onClick={() => {
          setAgregar(false)
          setSeccionAbierta(null)
          setTituloContenido(null)
          settituloEdicion(null)
          setTarea(null)
          settituloContenidoEdicion(null)
        }}
      >
        <div className="w-full h-[93%] overflow-y-auto relative flex gap-3 mt-[8vh] scroll_transparent">
          {cuerpo?.length > 0 &&
            cuerpo.map((itemCuerpo) => (
              <div key={itemCuerpo.id} className="bg-[#ffffff] w-[300px] pt-1 pb-2 h-fit px-2 rounded-xl">
                <TItuloTarjeta
                  settituloEdicion={settituloEdicion}
                  itemCuerpo={itemCuerpo}
                  tituloEdicion={tituloEdicion}
                  updateTitleTarjeta={updateTitleTarjeta}
                  deleteTarjeta={deleteTarjeta}
                />
                {/* CONTENIDO */}
                <ContenidoTarjeta
                  settituloContenidoEdicion={settituloContenidoEdicion}
                  tituloContenidoEdicion={tituloContenidoEdicion}
                  seccionAbierta={seccionAbierta}
                  setSeccionAbierta={setSeccionAbierta}
                  setTituloContenido={setTituloContenido}
                  setContenidoSeleccionado={setContenidoSeleccionado}
                  itemCuerpo={itemCuerpo}
                  tituloContenido={tituloContenido}
                  updateContenido={updateContenido}
                  setOpenModal={setOpenModal}
                  updateTitleItemTarjeta={updateTitleItemTarjeta}
                  contenidos={contenidos}
                />
                {/* AÑADIR TARJETA */}
                {seccionAbierta != itemCuerpo.id && (
                  <div
                    className="flex gap-2 px-2 py-1 items-center hover:bg-gray-300 cursor-pointer transition-colors rounded-md"
                    onClick={(e) => {
                      setSeccionAbierta(itemCuerpo.id)
                      e.stopPropagation()
                    }}
                  >
                    <FiPlus className="text-gray-600" />
                    <p className="text-gray-600">Añadir una tarjeta</p>
                  </div>
                )}
              </div>
            ))}
          {!agregar
            ? (
            <div
              className="bg-[#ffffff] w-[300px] h-fit rounded-xl z-10"
              onClick={(e) => {
                setAgregar(true)
                e.stopPropagation()
              }}
            >
              <div className="flex gap-2 items-center p-2 hover:bg-gray-300 cursor-pointer transition-colors rounded-xl">
                <FiPlus className="text-gray-600" />
                <p className="text-gray-600">Añadir una tarjeta</p>
              </div>
            </div>
              )
            : (
            <div
              className="bg-[#ffffff] w-[300px] pb-2 h-fit px-2 rounded-xl z-10 "
              onClick={(e) => {
                e.stopPropagation()
              }}
            >
              <div className="min-h-[40px] py-2">
                <textarea
                  placeholder="Introduce el titulo de la lista..."
                  name="tarea"
                  onChange={handleTextAdmin}
                  ref={tareaTareRef}
                  onKeyDown={(e: any) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      if (e.target.value.length > 0) {
                        handleAgregarTarea()
                      }
                    }
                  }}
                  className="text-black font-semibold w-full px-1 outline-cyan-700 resize-none h-7"
                >
                  {tarea}
                </textarea>
              </div>
              <div className="flex gap-4 items-center">
                <div className="flex gap-2 px-2 py-2 w-fit items-center bg-cyan-700 hover:bg-cyan-600 transition-colors cursor-pointer  rounded-md ">
                  <p
                    className="text-white text-sm"
                    onClick={() => {
                      handleAgregarTarea()
                    }}
                  >
                    Añadir lista
                  </p>
                </div>
                <IoClose
                  className="text-black text-xl cursor-pointer"
                  onClick={() => {
                    setAgregar(false)
                  }}
                />
              </div>
            </div>
              )}
        </div>
      </section>

      <ModalContenido
        colaboradores={colaboradores}
        open={openModal}
        setOpen={setOpenModal}
        contenidoSeleccionado={contenidoSeleccionado}
        updateIDItemTarjeta={updateIDItemTarjeta}
        getTareas={getTareas}
      />
    </>
  )
}
