/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Dialog, DialogContent } from '@mui/material'
import { type Dispatch, type SetStateAction, useState, useEffect, useRef } from 'react'
import { BiTask, BiLabel } from 'react-icons/bi'
import { type DuoContent } from '../../../../shared/schemas/Interfaces'
import { SlOptions } from 'react-icons/sl'
import { CgDetailsMore } from 'react-icons/cg'
import { useParams } from 'react-router-dom'
import { IoClose } from 'react-icons/io5'
import { v4 as uuidv4 } from 'uuid'
import { motion, AnimatePresence } from 'framer-motion'
import {
  RiCheckboxLine,
  RiLogoutCircleLine,
  RiTimeLine,
  RiUser3Line
} from 'react-icons/ri'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import { GrSecure } from 'react-icons/gr'
import useAuth from '../../../../../hooks/useAuth'
import { LoadingSmall } from '../../../../shared/LoadingSmall'
import { ModalFecha } from './fecha/ModalFecha'
import { FaRegCalendarCheck } from 'react-icons/fa6'
import { TbClockHour5 } from 'react-icons/tb'
import EditorPdfAltas from '../../../../shared/modals/EditorPdfAltas'
import { SubirArchivo } from './subirarchivo/SubirArchivo'
import filarachive from '../../../../../assets/plataformas/archivo.png'
import { BsChatDotsFill, BsFillCloudArrowDownFill, BsFillTrashFill } from 'react-icons/bs'
import { CrearComentario } from './comentarios/CrearComentario'
import { ListaComentarios } from './comentarios/ListaComentarios'
import { ResponderComentario } from './comentarios/ResponderComentario'
import EditorVisaPrevisa from '../../../../shared/modals/EditorVisaPrevisa'

interface arrayListado {
  id: string
  titulo: string
  check: boolean
}

export const ModalContenido = ({
  open,
  setOpen,
  contenidoSeleccionado,
  events,
  updateCita,
  colaboradores
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  contenidoSeleccionado: DuoContent | null
  events: []
  updateCita: (updatedEvents: Event[]) => Promise<void>
  colaboradores: never[]
}): JSX.Element => {
  const token = localStorage.getItem('token')
  const { auth } = useAuth()
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<never[]>([])
  const [contexto, setContexto] = useState('')
  const [edicion, setEdicion] = useState(false)
  const [textoLista, setTextoLista] = useState('')
  const [etiqueta, setEtiqueta] = useState(0)
  const [arrayList, setArrayList] = useState<arrayListado[]>([])
  const { idTablero } = useParams()
  const [openEtiqueta, setOpenEtiqueta] = useState(false)
  const [openEtiquetaOption, setopenEtiquetaOption] = useState(false)
  const [openOptions, setOpenOptions] = useState(false)
  const [openInputList, setopenInputList] = useState(false)
  const textareaRef = useRef(null)
  const [clickItemList, setclickItemList] = useState<string | null>(null)
  const [textoEdicionItemList, settextoEdicionItemList] = useState('')
  const [openChekList, setopenChekList] = useState(false)
  const [openOptionsItemList, setOpenOptionsItemList] = useState<string | null>(null)
  const [openQuestionDelete, setopenQuestionDelete] = useState(false)
  const [textoShare, setTextoShared] = useState('')
  const [idShared, setIdShared] = useState<string | null>(null)
  // FALTA AGREGAR AL MOMENTO DE CERRAR
  const [openMiembros, setopenMiembros] = useState(false)
  const [estadoCheck, setEstadoCheck] = useState(false)
  const [validacionShared, setValidacionShared] = useState(false)
  const [loadingShared, setLoadingShared] = useState(false)
  const [colaboradoresSeleccionados, setColaboradoresSeleccionados] = useState([])
  const [openDeleteShared, setOpenDeleteShared] = useState(false)
  const [loadignDelete, setloadignDelete] = useState(false)
  const [openfecha, setOpenFecha] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [openSubi, setOpenSubir] = useState<boolean>(false)
  const [archivosSubidos, setArchivosSubidos] = useState<any>([])
  const [cargandoDescarga, setCargandoDescarga] = useState(false)
  const [comentarios, setComentarios] = useState<any>([])
  const [openResponder, setOpenResponder] = useState(false)
  const [idComentario, setIdComentario] = useState<string | null>('')
  const [texto, setTexto] = useState<string | null>('')
  const [openChat, setOpenChat] = useState(false)

  const guardarContenido = (): void => {
    const detalleContexto = {
      etiqueta,
      descripcion: contexto,
      checklist: arrayList,
      comentarios,
      archivos: archivosSubidos,
      shared: idShared,
      miembros: colaboradoresSeleccionados,
      fecha: startDate
    }
    // Aquí debes implementar la lógica para actualizar el título en tu estado/tablero
    const filteredEvents = events.filter(
      (event: any) => event.id === idTablero
    )
    const contenidoFiltrado: any = filteredEvents[0]
    if (contenidoFiltrado) {
      const updatedEvents = events.map((event: any) =>
        event.id === idTablero
          ? {
              ...event,
              contenido: event.contenido.map((innerContent: any) =>
                innerContent.id === contenidoSeleccionado?.contexto?.id
                  ? {
                      ...innerContent,
                      contenido: innerContent.contenido?.map((contenido: any) =>
                        contenido.id === contenidoSeleccionado?.contenido.id
                          ? { ...contenido, contexto: detalleContexto }
                          : contenido
                      )
                    }
                  : innerContent
              )
            }
          : event
      )
      updateCita(updatedEvents)
    }
  }

  const guardarEtiqueta = (idEt: number): void => {
    const detalleContexto = {
      etiqueta: idEt,
      descripcion: contexto,
      checklist: arrayList,
      comentarios,
      archivos: archivosSubidos,
      shared: idShared,
      miembros: colaboradoresSeleccionados,
      fecha: startDate
    }
    // Aquí debes implementar la lógica para actualizar el título en tu estado/tablero
    const filteredEvents = events.filter(
      (event: any) => event.id === idTablero
    )
    const contenidoFiltrado: any = filteredEvents[0]
    if (contenidoFiltrado) {
      const updatedEvents = events.map((event: any) =>
        event.id === idTablero
          ? {
              ...event,
              contenido: event.contenido.map((innerContent: any) =>
                innerContent.id === contenidoSeleccionado?.contexto?.id
                  ? {
                      ...innerContent,
                      contenido: innerContent.contenido?.map((contenido: any) =>
                        contenido.id === contenidoSeleccionado?.contenido.id
                          ? { ...contenido, contexto: detalleContexto }
                          : contenido
                      )
                    }
                  : innerContent
              )
            }
          : event
      )
      updateCita(updatedEvents)
    }
  }

  const guardarLista = (arrayList: any): void => {
    const detalleContexto = {
      etiqueta,
      descripcion: contexto,
      checklist: arrayList,
      comentarios,
      archivos: archivosSubidos,
      shared: idShared,
      miembros: colaboradoresSeleccionados,
      fecha: startDate
    }

    // Aquí debes implementar la lógica para actualizar el título en tu estado/tablero
    const filteredEvents = events.filter(
      (event: any) => event.id === idTablero
    )
    const contenidoFiltrado: any = filteredEvents[0]
    if (contenidoFiltrado) {
      const updatedEvents = events.map((event: any) =>
        event.id === idTablero
          ? {
              ...event,
              contenido: event.contenido.map((innerContent: any) =>
                innerContent.id === contenidoSeleccionado?.contexto?.id
                  ? {
                      ...innerContent,
                      contenido: innerContent.contenido?.map((contenido: any) =>
                        contenido.id === contenidoSeleccionado?.contenido.id
                          ? { ...contenido, contexto: detalleContexto }
                          : contenido
                      )
                    }
                  : innerContent
              )
            }
          : event
      )
      updateCita(updatedEvents)
    }
  }

  const handleEtiqueta = (idEt: number): void => {
    setEtiqueta(idEt)
    guardarEtiqueta(idEt)
    setOpenEtiqueta(false)
    setOpenOptions(false)
  }

  useEffect(() => {
    if (contenidoSeleccionado) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (contenidoSeleccionado?.contenido?.contexto?.descripcion) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setContexto(contenidoSeleccionado?.contenido?.contexto?.descripcion)
      } else {
        setContexto('')
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (contenidoSeleccionado?.contenido?.contexto?.etiqueta) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setEtiqueta(contenidoSeleccionado?.contenido?.contexto?.etiqueta)
      } else {
        setEtiqueta(0)
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (contenidoSeleccionado?.contenido?.contexto?.checklist) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setArrayList(contenidoSeleccionado?.contenido?.contexto?.checklist)
      } else {
        setArrayList([])
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (contenidoSeleccionado?.contenido?.contexto?.archivos) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setArchivosSubidos(contenidoSeleccionado?.contenido?.contexto?.archivos)
      } else {
        setArchivosSubidos([])
      }
      // @ts-expect-error
      if (contenidoSeleccionado?.contenido?.contexto?.comentarios) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setComentarios(contenidoSeleccionado?.contenido?.contexto?.comentarios)
      } else {
        setComentarios([])
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (contenidoSeleccionado?.contenido?.contexto?.shared) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        setIdShared(contenidoSeleccionado?.contenido?.contexto?.shared)
        setValidacionShared(true)
        setEstadoCheck(true)
      } else {
        setValidacionShared(false)
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (contenidoSeleccionado?.contenido?.contexto?.miembros) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
        setColaboradoresSeleccionados(contenidoSeleccionado?.contenido?.contexto?.miembros)
      } else {
        setColaboradoresSeleccionados([])
      }
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (contenidoSeleccionado?.contenido?.contexto?.fecha) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
        setStartDate(new Date(contenidoSeleccionado?.contenido?.contexto?.fecha))
      } else {
        setStartDate(null)
      }
    }
  }, [contenidoSeleccionado])

  const variants = {
    open: {
      clipPath: 'circle(124% at 53% 45%)',
      transition: {
        type: 'spring',
        stiffness: 40,
        restDelta: 2
      }
    },
    closed: {
      clipPath: 'circle(0% at 100% 0)',
      transition: {
        type: 'spring',
        stiffness: 400,
        damping: 40
      }
    }
  }

  const handleAregarList = (): void => {
    const idUnico = uuidv4()
    setArrayList((prevTablero) => {
      const newTarjeta = { id: idUnico, titulo: textoLista, check: false }
      const updatedTablero = Array.isArray(prevTablero)
        ? [...prevTablero, newTarjeta]
        : [newTarjeta]
      guardarLista(updatedTablero) // Llama a guardarLista con la lista actualizada
      return updatedTablero
    })
    setTextoLista('')
    setopenInputList(false)
  }

  const guardarArchivo = (arrayArchivos: any): void => {
    const detalleContexto = {
      etiqueta,
      descripcion: contexto,
      checklist: arrayList,
      comentarios,
      archivos: arrayArchivos,
      shared: idShared,
      miembros: colaboradoresSeleccionados,
      fecha: startDate
    }

    // Aquí debes implementar la lógica para actualizar el título en tu estado/tablero
    const filteredEvents = events.filter(
      (event: any) => event.id === idTablero
    )
    const contenidoFiltrado: any = filteredEvents[0]
    if (contenidoFiltrado) {
      const updatedEvents = events.map((event: any) =>
        event.id === idTablero
          ? {
              ...event,
              contenido: event.contenido.map((innerContent: any) =>
                innerContent.id === contenidoSeleccionado?.contexto?.id
                  ? {
                      ...innerContent,
                      contenido: innerContent.contenido?.map((contenido: any) =>
                        contenido.id === contenidoSeleccionado?.contenido.id
                          ? { ...contenido, contexto: detalleContexto }
                          : contenido
                      )
                    }
                  : innerContent
              )
            }
          : event
      )
      updateCita(updatedEvents)
    }
  }

  const guardarComentarios = (arrayComentarios: any): void => {
    const detalleContexto = {
      etiqueta,
      descripcion: contexto,
      checklist: arrayList,
      archivos: archivosSubidos,
      comentarios: arrayComentarios,
      shared: idShared,
      miembros: colaboradoresSeleccionados,
      fecha: startDate
    }

    // Aquí debes implementar la lógica para actualizar el título en tu estado/tablero
    const filteredEvents = events.filter(
      (event: any) => event.id === idTablero
    )
    const contenidoFiltrado: any = filteredEvents[0]
    if (contenidoFiltrado) {
      const updatedEvents = events.map((event: any) =>
        event.id === idTablero
          ? {
              ...event,
              contenido: event.contenido.map((innerContent: any) =>
                innerContent.id === contenidoSeleccionado?.contexto?.id
                  ? {
                      ...innerContent,
                      contenido: innerContent.contenido?.map((contenido: any) =>
                        contenido.id === contenidoSeleccionado?.contenido.id
                          ? { ...contenido, contexto: detalleContexto }
                          : contenido
                      )
                    }
                  : innerContent
              )
            }
          : event
      )
      updateCita(updatedEvents)
    }
  }

  const handleCheckboxChange = (id: string): void => {
    setArrayList((prevList) => {
      const updatedList = prevList.map((item) => {
        if (item.id === id) {
          return { ...item, check: !item.check } // Cambia el valor de check a su opuesto
        }
        return item
      })
      guardarLista(updatedList) // Llama a guardarLista con la lista actualizada
      return updatedList
    })
  }

  const calcularPorcentaje = (): string => {
    if (arrayList.length === 0) return '0' // Evitar dividir por cero si no hay elementos en la lista
    const countChecked = arrayList.filter((item) => item.check).length
    return ((countChecked / arrayList.length) * 100).toFixed(0)
  }

  const handleEditTitleChange = (id: string): void => {
    setArrayList((prevList) => {
      const updatedList = prevList.map((item) => {
        if (item.id === id) {
          return { ...item, titulo: textoEdicionItemList }
        }
        return item
      })
      guardarLista(updatedList)
      return updatedList
    })
    setclickItemList(null)
    settextoEdicionItemList('')
  }

  const handleEliminarItem = (itemId: string): void => {
    const updatedList = arrayList.filter(item => item.id !== itemId)
    setArrayList(updatedList)
    guardarLista(updatedList)
    setOpenOptionsItemList(null)
  }

  const descargarArchivo = async (nombreArchivo: string): Promise<void> => {
    setCargandoDescarga(true)
    try {
      const response = await axios.get(`${Global.url}/descargarArchivoGestor/${nombreArchivo}`, {
        responseType: 'blob', // Especifica el tipo de respuesta como un objeto blob
        headers: {
          Authorization: `Bearer ${token}` // Si es necesario enviar un token de autorización
        }
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', formatFileName(nombreArchivo))
      document.body.appendChild(link)
      link.click()
      link?.parentNode?.removeChild(link)
    } catch (error) {
      console.error('Error al descargar el archivo:', error)
    } finally {
      setCargandoDescarga(false)
    }
  }

  const eliminarArchivo = async (nombreArchivo: string): Promise<void> => {
    try {
      await axios.delete(`${Global.url}/eliminarArchivoGestor`, {
        data: { nombre: nombreArchivo }, // Enviar el nombre del archivo a eliminar en el cuerpo de la solicitud
        headers: {
          Authorization: `Bearer ${token}` // Si es necesario enviar un token de autorización
        }
      })
    } catch (error) {
      console.error('Error al comunicarse con el servidor:', error)
    }
  }

  const handleEliminarArchivo = (archivoId: string, nombre: string): void => {
    const archivosActualizados = archivosSubidos.filter((archivo: any) => archivo.id !== archivoId)
    setArchivosSubidos(archivosActualizados)
    eliminarArchivo(nombre)
    guardarArchivo(archivosActualizados) // Si necesitas guardar la lista actualizada en algún lugar
  }

  const handleEliminarCheckList = (): void => {
    setArrayList([])
    guardarLista([])
    setOpenOptionsItemList(null)
  }

  useEffect(() => {
    if (openInputList && textareaRef.current) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      textareaRef.current.focus()
    }
  }, [openInputList])

  const handleSharedMiembros = (): void => {
    if (!estadoCheck) {
      setEstadoCheck(!estadoCheck)
      sharedTasks()
    } else {
      setEstadoCheck(!estadoCheck)
    }
  }

  const handleShardTasks = (idTaskDb: string): void => {
    const detalleContexto = {
      etiqueta,
      descripcion: contexto,
      checklist: arrayList,
      comentarios,
      archivos: archivosSubidos,
      shared: idTaskDb,
      miembros: colaboradoresSeleccionados,
      fecha: startDate
    }

    // Aquí debes implementar la lógica para actualizar el título en tu estado/tablero
    const filteredEvents = events.filter(
      (event: any) => event.id === idTablero
    )
    const contenidoFiltrado: any = filteredEvents[0]
    if (contenidoFiltrado) {
      const updatedEvents = events.map((event: any) =>
        event.id === idTablero
          ? {
              ...event,
              contenido: event.contenido.map((innerContent: any) =>
                innerContent.id === contenidoSeleccionado?.contexto?.id
                  ? {
                      ...innerContent,
                      contenido: innerContent.contenido?.map((contenido: any) =>
                        contenido.id === contenidoSeleccionado?.contenido.id
                          ? { ...contenido, contexto: detalleContexto }
                          : contenido
                      )
                    }
                  : innerContent
              )
            }
          : event
      )
      updateCita(updatedEvents)
    }
  }

  const sharedTasks = async (): Promise<void> => {
    setLoadingShared(true)
    const data = new FormData()
    const taskShared = {
      authId: auth.id,
      authName: auth.name,
      idTablero,
      idTarjeta: contenidoSeleccionado?.contenido?.id
    }
    data.append('task', JSON.stringify(taskShared))
    data.append('users', '')
    try {
      const respuesta = await axios.post(
        `${Global.url}/sharedTasks`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      if (respuesta.data.status == 'success') {
        setEstadoCheck(true)
        handleShardTasks(respuesta.data.message)
        setIdShared(respuesta.data.message)
        setValidacionShared(true)
      }
    } catch (error) {
      setEstadoCheck(false)
      setLoadingShared(false)
      console.log(error)
    }
  }

  const normalizeString = (str: string): string => {
    return str
      .toLowerCase() // Convertir todo a minúsculas
      .normalize('NFD') // Eliminar tildes y diacríticos
      .replace(/[\u0300-\u036f]/g, '')
  }

  const fetchSuggestions = (text: string): void => {
    if (text.length < 2) {
      setSuggestions([])
      setShowSuggestions(false)
      return
    }
    const normalizedText = normalizeString(text)
    const words = normalizedText.split(' ')
    const filteredSuggestions = colaboradores.filter((cliente: any) => {
      const nombres = normalizeString(cliente.name)
      return words.every(
        (word) => nombres.includes(word)
      )
    })
    const formattedSuggestions = filteredSuggestions
    setSuggestions(formattedSuggestions)
    setShowSuggestions(true)
  }

  const UpdatesharedTasks = async (members: never[]): Promise<void> => {
    setLoadingShared(true)
    const data = new FormData()
    data.append('users', JSON.stringify(members))
    data.append('_method', 'PUT')
    try {
      await axios.post(
        `${Global.url}/sharedTasksUpdate/${idShared ?? ''}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
    } catch (error) {
      console.log(error)
    }
  }

  const handleClientSelection = (suggestion: any): void => {
    // Verificar si el colaborador ya está presente en la lista
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const isAlreadySelected = colaboradoresSeleccionados.some((col) => col.id === suggestion.id)

    if (!isAlreadySelected) {
      // Crear una nueva variable con el nuevo estado
      const nuevoEstadoColaboradores: any[] = [...colaboradoresSeleccionados, suggestion]
      // Actualizar el estado con el nuevo estado
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setColaboradoresSeleccionados(nuevoEstadoColaboradores)
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      UpdatesharedTasks(nuevoEstadoColaboradores)
      // Llamar a la función con el nuevo estado
      addMembersToBD(nuevoEstadoColaboradores)
    }
    setShowSuggestions(false)
    setTextoShared('')
  }

  const addMembersToBD = (miembros: any[]): void => {
    const detalleContexto = {
      etiqueta,
      descripcion: contexto,
      checklist: arrayList,
      comentarios,
      archivos: archivosSubidos,
      shared: idShared,
      miembros,
      fecha: startDate
    }
    const filteredEvents = events.filter(
      (event: any) => event.id === idTablero
    )
    const contenidoFiltrado: any = filteredEvents[0]
    if (contenidoFiltrado) {
      const updatedEvents = events.map((event: any) =>
        event.id === idTablero
          ? {
              ...event,
              contenido: event.contenido.map((innerContent: any) =>
                innerContent.id === contenidoSeleccionado?.contexto?.id
                  ? {
                      ...innerContent,
                      contenido: innerContent.contenido?.map((contenido: any) =>
                        contenido.id === contenidoSeleccionado?.contenido.id
                          ? { ...contenido, contexto: detalleContexto }
                          : contenido
                      )
                    }
                  : innerContent
              )
            }
          : event
      )
      updateCita(updatedEvents)
    }
  }

  const handleClientSelectionDelete = (suggestion: any): void => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const nuevaLista = colaboradoresSeleccionados.filter((col) => col.id !== suggestion.id)
    setColaboradoresSeleccionados(nuevaLista)
    // Llamar a la función con la nueva lista
    addMembersToBD(nuevaLista)
    UpdatesharedTasks(nuevaLista)
    setShowSuggestions(false)
    setTextoShared('')
  }

  const handleShardTasksDelete = (): void => {
    const detalleContexto = {
      etiqueta,
      descripcion: contexto,
      checklist: arrayList,
      comentarios,
      archivos: archivosSubidos,
      shared: null,
      miembros: null,
      fecha: null
    }
    // Aquí debes implementar la lógica para actualizar el título en tu estado/tablero
    const filteredEvents = events.filter(
      (event: any) => event.id === idTablero
    )
    const contenidoFiltrado: any = filteredEvents[0]
    if (contenidoFiltrado) {
      const updatedEvents = events.map((event: any) =>
        event.id === idTablero
          ? {
              ...event,
              contenido: event.contenido.map((innerContent: any) =>
                innerContent.id === contenidoSeleccionado?.contexto?.id
                  ? {
                      ...innerContent,
                      contenido: innerContent.contenido?.map((contenido: any) =>
                        contenido.id === contenidoSeleccionado?.contenido.id
                          ? { ...contenido, contexto: detalleContexto }
                          : contenido
                      )
                    }
                  : innerContent
              )
            }
          : event
      )
      updateCita(updatedEvents)
    }
  }

  const deleteSharedTasks = async (): Promise<void> => {
    setloadignDelete(true)
    try {
      const data = new FormData()
      data.append('_method', 'DELETE')
      const result = await axios.post(
        `${Global.url}/destroySharedTasks/${idShared ?? ''}`, data, {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      if (result.data.status) {
        handleShardTasksDelete()
        setEstadoCheck(false)
        setIdShared(null)
        setValidacionShared(false)
      }
    } catch (error) {
      console.log(error)
      console.log(error)
    }
    setloadignDelete(false)
  }

  const UpdatesharedTasksFecha = async (date: Date | null): Promise<void> => {
    setLoadingShared(true)
    const data = new FormData()
    data.append('users', JSON.stringify(colaboradoresSeleccionados))
    data.append('fecha', JSON.stringify(date ?? ''))
    data.append('_method', 'PUT')
    try {
      await axios.post(
        `${Global.url}/sharedTasksUpdate/${idShared ?? ''}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
    } catch (error) {
      console.log(error)
    }
  }

  const addNotifiacte = (date: Date | null): void => {
    const detalleContexto = {
      etiqueta,
      descripcion: contexto,
      checklist: arrayList,
      comentarios,
      archivos: archivosSubidos,
      shared: idShared,
      miembros: colaboradoresSeleccionados,
      fecha: date
    }
    const filteredEvents = events.filter(
      (event: any) => event.id === idTablero
    )
    const contenidoFiltrado: any = filteredEvents[0]
    if (contenidoFiltrado) {
      const updatedEvents = events.map((event: any) =>
        event.id === idTablero
          ? {
              ...event,
              contenido: event.contenido.map((innerContent: any) =>
                innerContent.id === contenidoSeleccionado?.contexto?.id
                  ? {
                      ...innerContent,
                      contenido: innerContent.contenido?.map((contenido: any) =>
                        contenido.id === contenidoSeleccionado?.contenido.id
                          ? { ...contenido, contexto: detalleContexto }
                          : contenido
                      )
                    }
                  : innerContent
              )
            }
          : event
      )
      updateCita(updatedEvents)
    }
  }

  const handleDateChangeDalete = (): void => {
    setStartDate(null)
    addNotifiacte(null)
  }

  function formatFileName (fileName: string): string {
    return fileName.split('_').pop() ?? fileName
  }

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false)
        setEdicion(false)
        setEtiqueta(0)
        setOpenEtiqueta(false)
        setopenEtiquetaOption(false)
        setOpenOptions(false)
        setOpenChat(false)
        setopenChekList(false)
        setOpenOptionsItemList(null)
        setopenQuestionDelete(false)
        setValidacionShared(false)
        setIdShared(null)
        setEstadoCheck(false)
      }}
      scroll={'body'}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="modal_citas_clientes2"
    >
      <DialogContent className="w-full min-h-[600px] bg-[#F1F2F4] overflow-hidden">
        <AnimatePresence>
          {openOptions && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => {
                setOpenOptions(false)
              }}
              className="absolute w-full bg-black/30 h-full inset-0 z-10"
            />
          )}
        </AnimatePresence>
        <motion.div
          animate={openOptions ? 'open' : 'closed'}
          variants={variants}
          className="absolute right-0 top-0 bottom-0 bg-white shadow-md w-[300px] rounded-l-lg z-20 overflow-y-auto"
        >
          <div className="w-full p-4">
            <IoClose
              className="absolute top-1 right-1 text-sm transition-colors hover:bg-gray-300/50 p-2 w-10 h-10 rounded-full cursor-pointer"
              onClick={() => {
                setOpenOptions(!openOptions)
              }}
            />
            <h2 className="text-gray-600">Añadir a la tarjeta</h2>
            <div className="flex flex-col gap-3 mt-4">

              <span
                className={
                  'relative w-full text-left px-3 bg-gray-200 py-1 text-gray-700 rounded-md cursor-pointer transition-colors duration-300 flex gap-3 items-center'
                }
                onClick={() => {
                  setopenMiembros(!openMiembros)
                }}
              >
                <RiUser3Line className="text-gray-700 text-xl" /> Miembros
                {openMiembros && (
                    <div className="absolute w-full z-20 top-full right-0 bg-[#F1F2F4] rounded-lg h-auto shadow-lg mt-3 p-2 ease-in select-none" onClick={(e) => { e.stopPropagation() }}>
                    <IoClose
                      className="absolute top-0 -right-0 text-xs transition-colors hover:bg-gray-300/50 p-2 w-8 h-8 rounded-full cursor-pointer"
                      onClick={() => {
                        setopenMiembros(!openMiembros)
                      }}
                    />

                    {validacionShared && idShared
                      ? <>
                        <h2 className="w-full text-center text-gray-700 font-medium text-sm flex items-center gap-1 justify-center">
                            Tarjeta publica
                        </h2>
                        <div className='w-full relative'>
                            <input
                                type="text"
                                value={textoShare}
                                onChange={(e) => {
                                  setTextoShared(e.target.value)
                                  fetchSuggestions(e.target.value)
                                }}
                                onFocus={() => {
                                  setShowSuggestions(true)
                                }}
                                onBlur={() => {
                                  setTimeout(() => {
                                    setShowSuggestions(false)
                                  }, 400)
                                }}
                                placeholder="Buscar miembros"
                                className="w-full mt-3 text-gray-700 px-2 text-sm outline-none placeholder:text-gray-700 border-2 p-2 bg-white border-blue-500 rounded-md"
                            />
                            {showSuggestions && suggestions.length > 0 && (
                            <div className="suggestions absolute top-full right-0 left-0 z-20 bg-white rounded-b-lg shadow-sm shadow-black ">
                                {suggestions.filter((suggestions: any) => suggestions.id != auth.id).map((suggestion: any) => {
                                  const colb = {
                                    id: suggestion.id,
                                    name: suggestion.name
                                  }
                                  return (
                                <div
                                    key={suggestion.id}
                                    onClick={() => {
                                      handleClientSelection(colb)
                                    }}
                                    className="cursor-pointer hover:bg-[#f1f1f1] w-full px-4 py-2"
                                >
                                    {suggestion.name}
                                </div>
                                  )
                                })}
                            </div>
                            )}
                        </div>
                        {!showSuggestions &&
                            <>
                                <p className='text-gray-700 mt-4 text-sm px-2'>Miembros del tablero</p>
                                <div className='flex mt-0 flex-col gap-3 p-2'>
                                    {colaboradoresSeleccionados.map((col: any) => {
                                      const colb = {
                                        id: col.id,
                                        name: col.name
                                      }
                                      return (
                                        <div key={col.id} className='flex bg-gray-300 px-4 py-2 rounded-md line-clamp-1'>
                                            <p className='w-full' >{colb.name}</p>
                                            <span className='w-fit hover:text-red-500 transition-colors' onClick={() => { handleClientSelectionDelete(colb) }}>x</span>
                                        </div>
                                      )
                                    })}
                                </div>
                                <div className="flex flex-col w-fit justify-center items-center mx-auto gap-3 mt-4" onClick={(e) => { e.stopPropagation() }}>
                                    <label className="w-full relative inline-flex items-center  cursor-pointer" onClick={() => { setOpenDeleteShared(true) }}>
                                            <input type="checkbox" disabled={loadingShared} checked={estadoCheck} value="" className="sr-only peer w-full"/>
                                            <div className="group peer ring-0  bg-gradient-to-bl from-neutral-800 via-neutral-700 to-neutral-600  rounded-full outline-none duration-1000 after:duration-300 w-24 h-6  shadow-md  peer-focus:outline-none  after:content-[''] after:rounded-full after:absolute peer-checked:after:rotate-180 after:[background:conic-gradient(from_135deg,_#b2a9a9,_#b2a8a8,_#ffffff,_#d7dbd9_,_#ffffff,_#b2a8a8)]  after:outline-none after:h-4 after:w-4 after:top-1 after:left-1   peer-checked:after:translate-x-[4.5rem] peer-hover:after:scale-95 peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-emerald-900">
                                            </div>
                                    </label>
                                </div>
                                {openDeleteShared &&
                                    <div className="absolute w-[250px] z-20 top-full right-0 bg-[#F1F2F4] rounded-lg h-auto shadow-lg mt-3 p-2 ease-in select-none">
                                        <IoClose
                                        className="absolute top-0 -right-0 text-xs transition-colors hover:bg-gray-300/50 p-2 w-8 h-8 rounded-full cursor-pointer"
                                        onClick={() => {
                                          setOpenDeleteShared(false)
                                        }}
                                        />
                                        <h2 className="w-full text-center text-gray-700 font-medium text-sm">
                                        ¿Cambiar a privado?
                                        </h2>
                                        <p className='px-2 mt-3 text-sm'>Si cambias el estado, las lista de miembros seran eliminados</p>
                                        <div className="flex flex-col w-full gap-3 mt-4">
                                            {!loadignDelete
                                              ? <span
                                                    className={' px-2 block w-full text-center text-white bg-red-700 hover:bg-red-800 py-1 rounded-md cursor-pointer transition-colors duration-300'}
                                                    onClick={() => {
                                                      if (!loadignDelete) {
                                                        deleteSharedTasks()
                                                      }
                                                    }}
                                                >
                                                    Cambiar
                                                </span>
                                              : <LoadingSmall/>
                                            }
                                        </div>
                                    </div>
                                }
                            </>
                        }
                      </>
                      : <>
                        <h2 className="w-full text-center text-gray-700 font-medium text-sm flex items-center gap-1 justify-center">
                            <GrSecure className='text-lg'/> Tarjeta privada
                        </h2>
                        <p className='px-2 mt-3 text-sm'>Actualmente la tarjeta se encuentra en estado privado, si necesita compartir la tarea con otros usuarios debe cambiar el estado a publico.</p>
                        <div className="flex flex-col w-fit justify-center items-center mx-auto gap-3 mt-4" onClick={(e) => { e.stopPropagation() }}>
                            <label className="w-full relative inline-flex items-center  cursor-pointer" onClick={() => { handleSharedMiembros() }}>
                                <input type="checkbox" disabled={loadingShared} checked={estadoCheck} value="" className="sr-only peer w-full"/>
                                <div className="group peer ring-0  bg-gradient-to-bl from-neutral-800 via-neutral-700 to-neutral-600  rounded-full outline-none duration-1000 after:duration-300 w-24 h-6  shadow-md  peer-focus:outline-none  after:content-[''] after:rounded-full after:absolute peer-checked:after:rotate-180 after:[background:conic-gradient(from_135deg,_#b2a9a9,_#b2a8a8,_#ffffff,_#d7dbd9_,_#ffffff,_#b2a8a8)]  after:outline-none after:h-4 after:w-4 after:top-1 after:left-1   peer-checked:after:translate-x-[4.5rem] peer-hover:after:scale-95 peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-emerald-900">
                                </div>
                            </label>
                        </div>
                      </>
                    }
                  </div>
                )}
              </span>

              <span
                className={
                  'w-full text-left px-3 relative bg-gray-200 py-1 text-gray-700 rounded-md cursor-pointer transition-colors duration-300 flex gap-3 items-center'
                }
                onClick={() => {
                  setopenEtiquetaOption(!openEtiquetaOption)
                }}
              >
                <BiLabel className="text-gray-700 text-xl" /> Etiquetas
                {openEtiquetaOption && (
                  <div className="absolute z-20 top-full left-0 right-0 bg-[#F1F2F4] rounded-lg w-full h-auto shadow-lg mt-3 p-2 ease-in select-none">
                    <IoClose
                      className="absolute top-0 -right-0 text-xs transition-colors hover:bg-gray-300/50 p-2 w-8 h-8 rounded-full cursor-pointer"
                      onClick={() => {
                        setOpenEtiqueta(false)
                      }}
                    />
                    <h2 className="w-full text-center text-gray-700">
                      Etiquetas
                    </h2>
                    <div className="flex flex-col w-full gap-3 mt-4">
                      <span
                        className={`block w-full text-center  ${
                          etiqueta == 1
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-300 text-gray-500'
                        } py-1 rounded-md cursor-pointer transition-colors duration-300`}
                        onClick={() => {
                          handleEtiqueta(1)
                        }}
                      >
                        Alta
                      </span>
                      <span
                        className={`block w-full text-center  ${
                          etiqueta == 2
                            ? 'bg-yellow-500  text-white'
                            : 'bg-gray-300 text-gray-500'
                        } py-1 rounded-md cursor-pointer transition-colors duration-300`}
                        onClick={() => {
                          handleEtiqueta(2)
                        }}
                      >
                        Media
                      </span>
                      <span
                        className={`block w-full text-center  ${
                          etiqueta == 3
                            ? 'bg-green-700  text-white'
                            : 'bg-gray-300 text-gray-500'
                        } py-1 rounded-md cursor-pointer transition-colors duration-300`}
                        onClick={() => {
                          handleEtiqueta(3)
                        }}
                      >
                        Baja
                      </span>
                    </div>
                  </div>
                )}
              </span>

              <span
                className={
                  'w-full text-left px-3 bg-gray-200 py-1 text-gray-700 rounded-md cursor-pointer transition-colors duration-300 flex gap-3 items-center'
                }
                onClick={() => {
                  setopenChekList(true)
                  setOpenOptions(false)
                  setopenInputList(true)
                }}
              >
                <RiCheckboxLine className="text-gray-700 text-xl" /> CheckList
              </span>

              <span
                className={
                  'w-full relative text-left px-3 bg-gray-200 py-1 text-gray-700 rounded-md cursor-pointer transition-colors duration-300 flex gap-3 items-center'
                }
                onClick={() => {
                  setOpenFecha(!openfecha)
                }}
              >
                <RiTimeLine className="text-gray-700 text-xl" /> Fechas
                {openfecha && (
                    <div onClick={(e) => { e.stopPropagation() }} className=" absolute top-full left-0 right-0 bg-[#F1F2F4] rounded-lg w-full h-auto shadow-lg mt-3 p-2 ease-in select-none">
                        <IoClose
                        className="absolute top-0 -right-0 text-xs transition-colors hover:bg-gray-300/50 p-2 w-8 h-8 rounded-full cursor-pointer"
                        onClick={() => {
                          setOpenFecha(!openfecha)
                        }}
                        />
                        <h2 className="w-full text-center text-gray-700">
                        Programar fecha de entrega
                        </h2>
                        <div className="flex flex-col w-full gap-3 mt-4">
                        <ModalFecha setStartDate={setStartDate} startDate={startDate} addNotifiacte={addNotifiacte} UpdatesharedTasksFecha={UpdatesharedTasksFecha} idShared={idShared}/>
                        </div>
                    </div>
                )}
              </span>

              <span
                className={
                  'w-full text-left px-3 bg-gray-200 py-1 text-gray-700 rounded-md cursor-pointer transition-colors duration-300 flex gap-3 items-center'
                }
                onClick={() => {
                  setOpen(false)
                  setEdicion(false)
                  setEtiqueta(0)
                  setOpenEtiqueta(false)
                  setopenEtiquetaOption(false)
                  setOpenOptions(false)
                }}
              >
                <RiLogoutCircleLine className="text-gray-700 text-xl" /> Cerrar
              </span>
            </div>
          </div><motion.div
          animate={openOptions ? 'open' : 'closed'}
          variants={variants}
          className="absolute right-0 top-0 bottom-0 bg-white shadow-md w-[300px] rounded-l-lg z-20 overflow-y-auto"
        >
          <div className="w-full p-4">
            <IoClose
              className="absolute top-1 right-1 text-sm transition-colors hover:bg-gray-300/50 p-2 w-10 h-10 rounded-full cursor-pointer"
              onClick={() => {
                setOpenOptions(!openOptions)
              }}
            />
            <h2 className="text-gray-600">Añadir a la tarjeta</h2>
            <div className="flex flex-col gap-3 mt-4">

              <span
                className={
                  'relative w-full text-left px-3 bg-gray-200 py-1 text-gray-700 rounded-md cursor-pointer transition-colors duration-300 flex gap-3 items-center'
                }
                onClick={() => {
                  setopenMiembros(!openMiembros)
                }}
              >
                <RiUser3Line className="text-gray-700 text-xl" /> Miembros
                {openMiembros && (
                    <div className="absolute w-full z-20 top-full right-0 bg-[#F1F2F4] rounded-lg h-auto shadow-lg mt-3 p-2 ease-in select-none" onClick={(e) => { e.stopPropagation() }}>
                    <IoClose
                      className="absolute top-0 -right-0 text-xs transition-colors hover:bg-gray-300/50 p-2 w-8 h-8 rounded-full cursor-pointer"
                      onClick={() => {
                        setopenMiembros(!openMiembros)
                      }}
                    />

                    {validacionShared && idShared
                      ? <>
                        <h2 className="w-full text-center text-gray-700 font-medium text-sm flex items-center gap-1 justify-center">
                            Tarjeta publica
                        </h2>
                        <div className='w-full relative'>
                            <input
                                type="text"
                                value={textoShare}
                                onChange={(e) => {
                                  setTextoShared(e.target.value)
                                  fetchSuggestions(e.target.value)
                                }}
                                onFocus={() => {
                                  setShowSuggestions(true)
                                }}
                                onBlur={() => {
                                  setTimeout(() => {
                                    setShowSuggestions(false)
                                  }, 400)
                                }}
                                placeholder="Buscar miembros"
                                className="w-full mt-3 text-gray-700 px-2 text-sm outline-none placeholder:text-gray-700 border-2 p-2 bg-white border-blue-500 rounded-md"
                            />
                            {showSuggestions && suggestions.length > 0 && (
                            <div className="suggestions absolute top-full right-0 left-0 z-20 bg-white rounded-b-lg shadow-sm shadow-black ">
                                {suggestions.filter((suggestions: any) => suggestions.id != auth.id).map((suggestion: any) => {
                                  const colb = {
                                    id: suggestion.id,
                                    name: suggestion.name
                                  }
                                  return (
                                <div
                                    key={suggestion.id}
                                    onClick={() => {
                                      handleClientSelection(colb)
                                    }}
                                    className="cursor-pointer hover:bg-[#f1f1f1] w-full px-4 py-2"
                                >
                                    {suggestion.name}
                                </div>
                                  )
                                })}
                            </div>
                            )}
                        </div>
                        {!showSuggestions &&
                            <>
                                <p className='text-gray-700 mt-4 text-sm px-2'>Miembros del tablero</p>
                                <div className='flex mt-0 flex-col gap-3 p-2'>
                                    {colaboradoresSeleccionados.map((col: any) => {
                                      const colb = {
                                        id: col.id,
                                        name: col.name
                                      }
                                      return (
                                        <div key={col.id} className='flex bg-gray-300 px-4 py-2 rounded-md line-clamp-1'>
                                            <p className='w-full' >{colb.name}</p>
                                            <span className='w-fit hover:text-red-500 transition-colors' onClick={() => { handleClientSelectionDelete(colb) }}>x</span>
                                        </div>
                                      )
                                    })}
                                </div>
                                <div className="flex flex-col w-fit justify-center items-center mx-auto gap-3 mt-4" onClick={(e) => { e.stopPropagation() }}>
                                    <label className="w-full relative inline-flex items-center  cursor-pointer" onClick={() => { setOpenDeleteShared(true) }}>
                                            <input type="checkbox" disabled={loadingShared} checked={estadoCheck} value="" className="sr-only peer w-full"/>
                                            <div className="group peer ring-0  bg-gradient-to-bl from-neutral-800 via-neutral-700 to-neutral-600  rounded-full outline-none duration-1000 after:duration-300 w-24 h-6  shadow-md  peer-focus:outline-none  after:content-[''] after:rounded-full after:absolute peer-checked:after:rotate-180 after:[background:conic-gradient(from_135deg,_#b2a9a9,_#b2a8a8,_#ffffff,_#d7dbd9_,_#ffffff,_#b2a8a8)]  after:outline-none after:h-4 after:w-4 after:top-1 after:left-1   peer-checked:after:translate-x-[4.5rem] peer-hover:after:scale-95 peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-emerald-900">
                                            </div>
                                    </label>
                                </div>
                                {openDeleteShared &&
                                    <div className="absolute w-[250px] z-20 top-full right-0 bg-[#F1F2F4] rounded-lg h-auto shadow-lg mt-3 p-2 ease-in select-none">
                                        <IoClose
                                        className="absolute top-0 -right-0 text-xs transition-colors hover:bg-gray-300/50 p-2 w-8 h-8 rounded-full cursor-pointer"
                                        onClick={() => {
                                          setOpenDeleteShared(false)
                                        }}
                                        />
                                        <h2 className="w-full text-center text-gray-700 font-medium text-sm">
                                        ¿Cambiar a privado?
                                        </h2>
                                        <p className='px-2 mt-3 text-sm'>Si cambias el estado, las lista de miembros seran eliminados</p>
                                        <div className="flex flex-col w-full gap-3 mt-4">
                                            {!loadignDelete
                                              ? <span
                                                    className={' px-2 block w-full text-center text-white bg-red-700 hover:bg-red-800 py-1 rounded-md cursor-pointer transition-colors duration-300'}
                                                    onClick={() => {
                                                      if (!loadignDelete) {
                                                        deleteSharedTasks()
                                                      }
                                                    }}
                                                >
                                                    Cambiar
                                                </span>
                                              : <LoadingSmall/>
                                            }
                                        </div>
                                    </div>
                                }
                            </>
                        }
                      </>
                      : <>
                        <h2 className="w-full text-center text-gray-700 font-medium text-sm flex items-center gap-1 justify-center">
                            <GrSecure className='text-lg'/> Tarjeta privada
                        </h2>
                        <p className='px-2 mt-3 text-sm'>Actualmente la tarjeta se encuentra en estado privado, si necesita compartir la tarea con otros usuarios debe cambiar el estado a publico.</p>
                        <div className="flex flex-col w-fit justify-center items-center mx-auto gap-3 mt-4" onClick={(e) => { e.stopPropagation() }}>
                            <label className="w-full relative inline-flex items-center  cursor-pointer" onClick={() => { handleSharedMiembros() }}>
                                <input type="checkbox" disabled={loadingShared} checked={estadoCheck} value="" className="sr-only peer w-full"/>
                                <div className="group peer ring-0  bg-gradient-to-bl from-neutral-800 via-neutral-700 to-neutral-600  rounded-full outline-none duration-1000 after:duration-300 w-24 h-6  shadow-md  peer-focus:outline-none  after:content-[''] after:rounded-full after:absolute peer-checked:after:rotate-180 after:[background:conic-gradient(from_135deg,_#b2a9a9,_#b2a8a8,_#ffffff,_#d7dbd9_,_#ffffff,_#b2a8a8)]  after:outline-none after:h-4 after:w-4 after:top-1 after:left-1   peer-checked:after:translate-x-[4.5rem] peer-hover:after:scale-95 peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-emerald-900">
                                </div>
                            </label>
                        </div>
                      </>
                    }
                  </div>
                )}
              </span>

              <span
                className={
                  'w-full text-left px-3 relative bg-gray-200 py-1 text-gray-700 rounded-md cursor-pointer transition-colors duration-300 flex gap-3 items-center'
                }
                onClick={() => {
                  setopenEtiquetaOption(!openEtiquetaOption)
                }}
              >
                <BiLabel className="text-gray-700 text-xl" /> Etiquetas
                {openEtiquetaOption && (
                  <div className="absolute z-20 top-full left-0 right-0 bg-[#F1F2F4] rounded-lg w-full h-auto shadow-lg mt-3 p-2 ease-in select-none">
                    <IoClose
                      className="absolute top-0 -right-0 text-xs transition-colors hover:bg-gray-300/50 p-2 w-8 h-8 rounded-full cursor-pointer"
                      onClick={() => {
                        setOpenEtiqueta(false)
                      }}
                    />
                    <h2 className="w-full text-center text-gray-700">
                      Etiquetas
                    </h2>
                    <div className="flex flex-col w-full gap-3 mt-4">
                      <span
                        className={`block w-full text-center  ${
                          etiqueta == 1
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-300 text-gray-500'
                        } py-1 rounded-md cursor-pointer transition-colors duration-300`}
                        onClick={() => {
                          handleEtiqueta(1)
                        }}
                      >
                        Alta
                      </span>
                      <span
                        className={`block w-full text-center  ${
                          etiqueta == 2
                            ? 'bg-yellow-500  text-white'
                            : 'bg-gray-300 text-gray-500'
                        } py-1 rounded-md cursor-pointer transition-colors duration-300`}
                        onClick={() => {
                          handleEtiqueta(2)
                        }}
                      >
                        Media
                      </span>
                      <span
                        className={`block w-full text-center  ${
                          etiqueta == 3
                            ? 'bg-green-700  text-white'
                            : 'bg-gray-300 text-gray-500'
                        } py-1 rounded-md cursor-pointer transition-colors duration-300`}
                        onClick={() => {
                          handleEtiqueta(3)
                        }}
                      >
                        Baja
                      </span>
                    </div>
                  </div>
                )}
              </span>

              <span
                className={
                  'w-full text-left px-3 bg-gray-200 py-1 text-gray-700 rounded-md cursor-pointer transition-colors duration-300 flex gap-3 items-center'
                }
                onClick={() => {
                  setopenChekList(true)
                  setOpenOptions(false)
                  setopenInputList(true)
                }}
              >
                <RiCheckboxLine className="text-gray-700 text-xl" /> CheckList
              </span>

              <span
                className={
                  'w-full relative text-left px-3 bg-gray-200 py-1 text-gray-700 rounded-md cursor-pointer transition-colors duration-300 flex gap-3 items-center'
                }
                onClick={() => {
                  setOpenFecha(!openfecha)
                }}
              >
                <RiTimeLine className="text-gray-700 text-xl" /> Fechas
                {openfecha && (
                    <div onClick={(e) => { e.stopPropagation() }} className=" absolute top-full left-0 right-0 bg-[#F1F2F4] rounded-lg w-full h-auto shadow-lg mt-3 p-2 ease-in select-none">
                        <IoClose
                        className="absolute top-0 -right-0 text-xs transition-colors hover:bg-gray-300/50 p-2 w-8 h-8 rounded-full cursor-pointer"
                        onClick={() => {
                          setOpenFecha(!openfecha)
                        }}
                        />
                        <h2 className="w-full text-center text-gray-700">
                        Programar fecha de entrega
                        </h2>
                        <div className="flex flex-col w-full gap-3 mt-4">
                        <ModalFecha setStartDate={setStartDate} startDate={startDate} addNotifiacte={addNotifiacte} UpdatesharedTasksFecha={UpdatesharedTasksFecha} idShared={idShared}/>
                        </div>
                    </div>
                )}
              </span>

              <span
                className={
                  'w-full text-left px-3 bg-gray-200 py-1 text-gray-700 rounded-md cursor-pointer transition-colors duration-300 flex gap-3 items-center'
                }
                onClick={() => {
                  setOpen(false)
                  setEdicion(false)
                  setEtiqueta(0)
                  setOpenEtiqueta(false)
                  setopenEtiquetaOption(false)
                  setOpenOptions(false)
                }}
              >
                <RiLogoutCircleLine className="text-gray-700 text-xl" /> Cerrar
              </span>
            </div>
          </div>
        </motion.div>
        </motion.div>

        <motion.div
          animate={openChat ? 'open' : 'closed'}
          variants={variants}
          className="absolute right-0 top-0 bottom-0 bg-white shadow-md w-[500px] rounded-l-lg z-20 overflow-y-auto"
        >
          <div className="w-full p-4">
            <IoClose
              className="absolute top-1 right-1 text-sm transition-colors hover:bg-gray-300/50 p-2 w-10 h-10 rounded-full cursor-pointer"
              onClick={() => {
                setOpenChat(!openChat)
              }}
            />
             <section className="w-full h-full md:h-fit">
                <CrearComentario
                setComentarios={setComentarios}
                guardarComentarios={guardarComentarios}
                />
                <ListaComentarios
                setComentarios={setComentarios}
                comentarios={comentarios}
                setOpen={setOpenResponder}
                setIdComentario={setIdComentario}
                setTexto={setTexto}
                guardarComentarios={guardarComentarios}
                />
                <ResponderComentario
                comentarios={comentarios}
                idComentario={idComentario}
                open={openResponder}
                setComentarios={setComentarios}
                setIdComentario={setIdComentario}
                setOpen={setOpenResponder}
                textoComentario={texto}
                guardarComentarios={guardarComentarios}
                />
            </section>
          </div>
        </motion.div>

        <div className="flex justify-between">
          <div className="flex gap-3 items-start w-[95%]">
            <BiTask className="text-2xl mt-1 text-gray-600 w-auto" />
            <div className="flex flex-col gap-2 w-full">
              <h1 className="text-lg text-gray-700 font-medium flex-1">
                {contenidoSeleccionado?.contenido.titulo}
              </h1>
              <span className="text-gray-500 text-sm">
                En la lista de{' '}
                <span className="underline">
                  {contenidoSeleccionado?.contexto?.titulo}
                </span>{' '}
              </span>
            </div>
          </div>
          <div className="w-[5%] relative">
            <SlOptions
              className="absolute -top-2 -right-3 text-sm transition-colors hover:bg-gray-300/50 p-2 w-10 h-10 rounded-full cursor-pointer"
              onClick={() => {
                setOpenOptions(!openOptions)
                setOpenChat(false)
              }}
            />
            <BsChatDotsFill
              className="absolute -top-2 right-7 text-sm transition-colors hover:bg-gray-300/50 p-2 w-10 h-10 rounded-full cursor-pointer"
              onClick={() => {
                setOpenChat(!openChat)
                setOpenOptions(false)
              }}
            />
            {comentarios.length > 0 &&
                <span className='absolute -top-2 right-7 z-10 bg-red-500 w-4 h-4 rounded-full flex items-center justify-center text-white'>{comentarios.length}</span>
            }
          </div>
        </div>
        {etiqueta != 0 || startDate != null
          ? <div className="flex flex-grow w-full pl-8 pt-6 gap-4">
            {etiqueta != 0 &&
                <div className="flex flex-col gap-2 relative">
                <h2 className="text-gray-700 text-sm">Etiqueta</h2>
                <div className="flex gap-2 group">
                    <span
                    className={`w-14 h-8 ${
                        etiqueta == 1
                        ? 'bg-red-600'
                        : etiqueta == 2
                        ? 'bg-yellow-500'
                        : etiqueta == 3
                        ? 'bg-green-700 '
                        : ''
                    } cursor-pointer block rounded-md`}
                    onClick={() => {
                      setOpenEtiqueta(!openEtiqueta)
                    }}
                    ></span>
                    <span
                    className="group-hover:block hidden hover:text-red-500 cursor-pointer text-xl transition-all"
                    onClick={() => {
                      handleEtiqueta(0)
                    }}
                    >
                    x
                    </span>
                </div>
                {openEtiqueta && (
                    <div className="absolute top-full left-full bg-white rounded-lg w-[200px] h-auto shadow-lg mt-3 p-2 ease-in select-none">
                    <IoClose
                        className="absolute top-0 -right-0 text-xs transition-colors hover:bg-gray-300/50 p-2 w-8 h-8 rounded-full cursor-pointer"
                        onClick={() => {
                          setOpenEtiqueta(false)
                        }}
                    />
                    <h2 className="w-full text-center text-gray-700">
                        Etiquetas
                    </h2>
                    <div className="flex flex-col w-full gap-3 mt-4">
                        <span
                        className={`block w-full text-center  ${
                            etiqueta == 1
                            ? 'bg-red-600 text-white'
                            : 'bg-gray-300 text-gray-500'
                        } py-1 rounded-md cursor-pointer transition-colors duration-300`}
                        onClick={() => {
                          handleEtiqueta(1)
                        }}
                        >
                        Alta
                        </span>
                        <span
                        className={`block w-full text-center  ${
                            etiqueta == 2
                            ? 'bg-yellow-500  text-white'
                            : 'bg-gray-300 text-gray-500'
                        } py-1 rounded-md cursor-pointer transition-colors duration-300`}
                        onClick={() => {
                          handleEtiqueta(2)
                        }}
                        >
                        Media
                        </span>
                        <span
                        className={`block w-full text-center  ${
                            etiqueta == 3
                            ? 'bg-green-700  text-white'
                            : 'bg-gray-300 text-gray-500'
                        } py-1 rounded-md cursor-pointer transition-colors duration-300`}
                        onClick={() => {
                          handleEtiqueta(3)
                        }}
                        >
                        Baja
                        </span>
                    </div>
                    </div>
                )}
                </div>
            }
            {startDate != null &&
                <div className="flex flex-col gap-2 ">
                    <h2 className="text-gray-700 text-sm">Vencimiento</h2>
                    <div className='group flex items-center gap-2'>
                        <div className='flex gap-0 w-fit bg-gray-300 h-8 rounded-md'>
                            <div className="w-1/2 flex justify-center gap-0 items-center">
                                <FaRegCalendarCheck className="w-10" />
                                <span className="flex-1 w-fit bg-transparent outline-none p-0">
                                {startDate?.toLocaleDateString()}
                                </span>
                            </div>
                            <div className="w-1/2 flex justify-center gap-0 items-center">
                                <TbClockHour5 className="w-10" />
                                <span className="flex-1 w-fit bg-transparent text-left outline-none p-0">
                                {startDate?.toLocaleTimeString([], {
                                  hour: '2-digit',
                                  minute: '2-digit'
                                })}
                                </span>
                            </div>
                        </div>
                        <span
                        className="group-hover:block hidden hover:text-red-500 cursor-pointer text-xl transition-all"
                        onClick={() => {
                          handleDateChangeDalete()
                        }}
                        >
                            x
                        </span>
                    </div>
                </div>
            }
          </div>
          : null}

        <div className="flex justify-between mt-6 items-center">
          <div className="flex gap-3 items-start w-[95%]">
            <CgDetailsMore className="text-2xl mt-1 text-gray-600 w-auto" />
            <div className="flex flex-col gap-2 w-full">
              <h1 className="text-lg text-gray-700 font-medium flex-1">
                Descripción
              </h1>
            </div>
          </div>
          {!edicion && (
            <button
              className="bg-gray-300 hover:bg-gray-400/60 transition-colors rounded-md px-4 py-2"
              onClick={() => {
                setEdicion(!edicion)
              }}
            >
              Editar
            </button>
          )}
        </div>
        <div className="w-full pl-8 pt-6 mb-4">
          {edicion
            ? (
            <>
              <EditorPdfAltas content={contexto} setContent={setContexto} />
              <div className='flex gap-3 items-center'>
                <button
                    className="bg-cyan-600 hover:bg-cyan-700 text-white transition-colors rounded-md px-4 py-2 mt-3"
                    onClick={() => {
                      setEdicion(!edicion)
                      guardarContenido()
                    }}
                >
                    Guardar
                </button>
              </div>
            </>
              )
            : (
                <EditorVisaPrevisa content={contexto} setContent={setContexto}/>
          // <div dangerouslySetInnerHTML={{ __html: contexto }}></div>
              )}
        </div>

        <div className="w-full pl-8 py-4 flex justify-end">
            <button
              className="bg-gray-300 hover:bg-gray-400/60 transition-colors rounded-md px-4 py-2"
              onClick={() => { setOpenSubir(!openSubi) }}
            >
              Subir archivos
            </button>
            <SubirArchivo open={openSubi} setOpen={setOpenSubir} setArchivosSubidos={setArchivosSubidos } archivosSubidos={archivosSubidos} guardarArchivo={guardarArchivo}/>
        </div>
        {archivosSubidos?.length > 0 &&
            <div className='w-full pl-8'>
                <div className="bg-[#fff] p-0 lg:p-0 w-full lg:w-full relative">
                    <div className="hidden md:grid grid-cols-1 md:grid-cols-6 gap-4 mb-2 md:px-4 md:py-2 text-gray-400 border-y border-gray-300 w-full">
                    <h5 className="md:text-center col-span-2">Archivo </h5>
                    <h5 className="md:text-center col-span-2">Peso</h5>
                    <h5 className="md:text-left col-span-2"></h5>
                    </div>
                    {archivosSubidos?.map((archivo: any) => (
                        <div
                            key={archivo.id}
                            className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center mb-4 bg-gray-50 p-4 rounded-xl shadow-sm cursor-pointer w-full"
                        >
                            <div className="hidden md:block md:text-center col-span-2">
                            <div className="text-left flex gap-3 items-center">
                                <img src={filarachive} alt="" className="w-10 h-10" />
                                <span className="line-clamp-2 text-black">
                                {formatFileName(archivo.nombre)}
                                </span>
                            </div>
                            </div>
                            <div className="hidden md:block md:text-center col-span-2 ">
                                <span className="w-full block text-center px-2 text-black">
                                    {archivo.tamaño}
                                </span>
                            </div>
                            <div className="hidden md:flex md:justify-end items-center gap-4 ">
                            {!cargandoDescarga
                              ? (
                                <BsFillCloudArrowDownFill
                                className=" text-green-600 text-3xl w-fit lg:w-fit text-center"
                                onClick={() => {
                                  descargarArchivo(archivo.nombre)
                                }}
                                />
                                )
                              : (
                                <BsFillCloudArrowDownFill className=" text-green-800 text-3xl w-fit lg:w-fit text-center" />
                                )}
                            <BsFillTrashFill
                                className=" text-red-600 text-2xl w-fit lg:w-fit text-center"
                                onClick={() => {
                                  handleEliminarArchivo(archivo.id, archivo.nombre)
                                }}
                            />
                            </div>
                        </div>
                    )
                    )}
                </div>
            </div>
         }

        {openChekList || arrayList.length > 0
          ? <>
            <div className="flex justify-between mt-6 items-center">
              <div className="flex gap-3 items-start w-[95%]">
                <RiCheckboxLine className="text-2xl mt-1 text-gray-600 w-auto" />
                <div className="flex flex-col gap-2 w-full">
                  <h1 className="text-lg text-gray-700 font-medium flex-1">
                    CheckList
                  </h1>
                </div>
              </div>
              <div className='relative'>
                <button
                  className="bg-gray-300 hover:bg-gray-400/60 transition-colors rounded-md px-4 py-2"
                  onClick={() => {
                    setopenQuestionDelete(!openQuestionDelete)
                  }}
                >
                  Eliminar
                </button>
                {openQuestionDelete &&
                 <div className="absolute w-[250px] z-20 top-full right-0 bg-white rounded-lg h-auto shadow-lg mt-3 p-2 ease-in select-none">
                 <IoClose
                   className="absolute top-0 -right-0 text-xs transition-colors hover:bg-gray-300/50 p-2 w-8 h-8 rounded-full cursor-pointer"
                   onClick={() => {
                     setopenQuestionDelete(!openQuestionDelete)
                   }}
                 />
                 <h2 className="w-full text-center text-gray-700 font-medium text-sm">
                   ¿Desea eliminar ChekList?
                 </h2>
                 <p className='px-2 mt-3 text-sm'>Eliminar una lista de control es una operación permanente y no puede deshacerse.</p>
                 <div className="flex flex-col w-full gap-3 mt-4">
                   <span
                     className={' px-2 block w-full text-center text-white bg-red-700 hover:bg-red-800 py-1 rounded-md cursor-pointer transition-colors duration-300'}
                     onClick={() => {
                       handleEliminarCheckList()
                       setopenQuestionDelete(false)
                       setopenInputList(false)
                       setopenChekList(false)
                     }}
                   >
                     Eliminar
                   </span>
                 </div>
               </div>
                }
              </div>
            </div>
            {arrayList?.length > 0 &&
            <div className="w-full pl-1 pt-6 ">
              <div className="flex gap-3 items-center">
                <span>{calcularPorcentaje()}%</span>
                <div className="w-full relative">
                  <span
                    className="absolute bg-blue-500 rounded-md h-full inset-0 z-10"
                    style={{ width: `${calcularPorcentaje()}%` }}
                  ></span>
                  <span className="block w-full rounded-md bg-gray-300 h-2 relative "></span>
                </div>
              </div>
            </div>}
            <div className="w-full pl-8 ">
              <div className="mt-3 flex flex-col gap-3">
                {arrayList?.map((lista) => (
                    <div key={lista.id} className='w-full flex justify-between group'>
                        <div className={`flex  ${clickItemList == lista.id ? 'items-start' : 'items-center'} gap-4 w-full`}>
                            <input
                            type="checkbox"
                            className="mt-1 w-4 h-4"
                            checked={lista.check}
                            onChange={() => {
                              handleCheckboxChange(lista.id)
                            }}
                            />
                            <div className={`flex justify-between items-center w-full ${clickItemList == lista.id ? 'bg-gray-200 p-1' : 'group-hover:bg-gray-200 '} transition-colors rounded-md`}>
                            {clickItemList == lista.id
                              ? (
                                <div className='flex flex-col gap-3 w-full'>
                                    <input
                                        type="text"
                                        value={textoEdicionItemList}
                                        onChange={(e) => {
                                          settextoEdicionItemList(e.target.value)
                                        }}
                                        // ref={textareaRef}
                                        onKeyDown={(e: any) => {
                                          if (e.key === 'Enter') {
                                            e.preventDefault() // Previene el salto de línea predeterminado
                                            if (e.target.value.length > 0) {
                                              handleEditTitleChange(lista.id)
                                            }
                                          }
                                        }}
                                        placeholder="Añada un elemento"
                                        className="w-full text-gray-700 px-2 outline-none placeholder:text-gray-700 border-2 p-1 bg-white border-blue-500 rounded-md"
                                    />
                                    <div className='flex gap-1'>
                                    <button
                                        className="bg-blue-500 hover:bg-blue-600 transition-colors w-fit px-3 text-sm py-2 text-white rounded-md"
                                        onClick={() => {
                                          if (textoEdicionItemList.length > 0) {
                                            handleEditTitleChange(lista.id)
                                          }
                                        }}
                                        >
                                        Guardar
                                    </button>
                                    <button
                                        className="bg-transparent transition-colors w-fit px-3 text-xl py-2 text-black rounded-md"
                                        onClick={() => {
                                          settextoEdicionItemList('')
                                          setclickItemList(null)
                                        }}
                                        >
                                        <IoClose/>
                                    </button>
                                    </div>
                                </div>
                                )
                              : (
                            <p
                                className="w-full text-gray-700 px-2 outline-none mt-1 placeholder:text-gray-700  p-1 bg-transparent rounded-md"
                                onClick={() => { setclickItemList(lista.id); settextoEdicionItemList(lista.titulo) }}
                            >
                                {lista.titulo}
                            </p>
                                )}
                                {clickItemList != lista.id &&
                                <div className='relative'>
                                    <SlOptions
                                        className="transition-colors opacity-0 group-hover:opacity-100 text-gray-700 hover:bg-gray-300/50 p-2 w-8 h-8 rounded-full cursor-pointer"
                                        onClick={() => {
                                          setOpenOptionsItemList(lista.id)
                                        }}
                                        />
                                     {openOptionsItemList == lista.id && (
                                         <div className="absolute w-[250px] z-10 top-full right-0 bg-[#F1F2F4] rounded-lg h-auto shadow-lg mt-3 p-2 ease-in select-none">
                                         <IoClose
                                           className="absolute top-0 -right-0 text-xs transition-colors hover:bg-gray-300/50 p-2 w-8 h-8 rounded-full cursor-pointer"
                                           onClick={() => {
                                             setOpenOptionsItemList(null)
                                           }}
                                         />
                                         <h2 className="w-full text-center text-gray-700">
                                           Acciones del elemento
                                         </h2>
                                         <div className="flex flex-col w-full gap-3 mt-4">
                                           <span
                                             className={' px-2 block w-full text-left hover:bg-gray-300 py-1 rounded-md cursor-pointer transition-colors duration-300'}
                                             onClick={() => {
                                               handleEliminarItem(lista.id)
                                             }}
                                           >
                                             Eliminar
                                           </span>
                                         </div>
                                       </div>
                                     )}
                                </div>}
                            </div>
                        </div>
                    </div>
                ))}
              </div>
              {openInputList && (
                <div className="mt-3 flex flex-col gap-3">
                  <input
                    type="text"
                    value={textoLista}
                    onChange={(e) => {
                      setTextoLista(e.target.value)
                    }}
                    ref={textareaRef}
                    onKeyDown={(e: any) => {
                      if (e.key === 'Enter') {
                        e.preventDefault() // Previene el salto de línea predeterminado
                        if (e.target.value.length > 0) {
                          handleAregarList()
                        }
                      }
                    }}
                    placeholder="Añada un elemento"
                    className="w-full text-gray-700 px-2 outline-none placeholder:text-gray-700 border-2 p-1 bg-white border-blue-500 rounded-md"
                  />
                  <div className="flex gap-3">
                    <button
                      className="bg-blue-500 hover:bg-blue-600 transition-colors w-fit px-3 text-sm py-2 text-white rounded-md"
                      onClick={() => {
                        if (textoLista.length > 0) {
                          handleAregarList()
                        }
                      }}
                    >
                      Añadir
                    </button>
                    <button
                      className="bg-transparent w-fit px-3 text-sm py-2 text-black rounded-md"
                      onClick={() => {
                        setopenInputList(false)
                        setTextoLista('')
                      }}
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              )}

              {!openInputList && (
                <div className="mt-4">
                  <button
                    className="bg-gray-300 px-3 text-sm py-2 text-gray-700 rounded-md"
                    onClick={() => {
                      setopenInputList(true)
                    }}
                  >
                    Añada un elemento
                  </button>
                </div>
              )}
            </div>
          </>
          : null}
      </DialogContent>
    </Dialog>
  )
}
