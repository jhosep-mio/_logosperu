/* eslint-disable no-unneeded-ternary */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Backdrop, CircularProgress, Dialog, DialogContent } from '@mui/material'
import { type Dispatch, type SetStateAction, useState, useEffect, useRef } from 'react'
import { BiTask, BiLabel } from 'react-icons/bi'
import { SlOptions } from 'react-icons/sl'
import { CgDetailsMore } from 'react-icons/cg'
import { IoClose } from 'react-icons/io5'
import { v4 as uuidv4 } from 'uuid'
import { motion, AnimatePresence } from 'framer-motion'
import { RiCheckboxLine, RiLogoutCircleLine, RiTimeLine, RiUser3Line } from 'react-icons/ri'
import axios from 'axios'
import { GrSecure } from 'react-icons/gr'
import { FaRegCalendarCheck } from 'react-icons/fa6'
import { TbClockHour5 } from 'react-icons/tb'
import filarachive from '../../../../../../assets/plataformas/archivo.png'
import { BsFillCloudArrowDownFill, BsFillTrashFill } from 'react-icons/bs'
import { toast } from 'sonner'
import { TiDelete } from 'react-icons/ti'
import { DeleteObjectCommand, GetObjectCommand, S3Client } from '@aws-sdk/client-s3'
import useAuth from '../../../../../../hooks/useAuth'
import { Global } from '../../../../../../helper/Global'
import { LoadingSmall } from '../../../../../shared/LoadingSmall'
import { ModalFecha } from '../fecha/ModalFecha'
import { ModalComentarios } from '../comentarios/ModalComentarios'
import EditorPdfAltas from '../../../../../shared/modals/EditorPdfAltas'
import EditorVisaPrevisa from '../../../../../shared/modals/EditorVisaPrevisa'
import { SubirArchivo } from '../subirarchivo/SubirArchivo'
import { formatFileSize } from '../../../../../shared/functions/QuitarAcerntos'

interface arrayListado {
  id: string
  titulo: string
  check: boolean
}

export const ModalCompartido = ({
  open,
  setOpen,
  contenidoSeleccionado,
  colaboradores,
  getTareas
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  contenidoSeleccionado: any | null
  colaboradores: never[]
  getTareas: any
}): JSX.Element => {
  const [idTablero, setIdContenido] = useState(null)
  const [loading, setLoading] = useState(true)
  const token = localStorage.getItem('token')
  const { auth, setDownloadProgress, setGestorCompartido } = useAuth()
  const [, setContenidoGestor] = useState<any | null>(null)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [suggestions, setSuggestions] = useState<never[]>([])
  const [contexto, setContexto] = useState('')
  const [edicion, setEdicion] = useState(false)
  const [textoLista, setTextoLista] = useState('')
  const [etiqueta, setEtiqueta] = useState(0)
  const [arrayList, setArrayList] = useState<arrayListado[]>([])
  const [openEtiqueta, setOpenEtiqueta] = useState(false)
  const [openEtiquetaOption, setopenEtiquetaOption] = useState(false)
  const [openOptions, setOpenOptions] = useState(false)
  const [openInputList, setopenInputList] = useState(false)
  const textareaRef = useRef(null)
  const [clickItemList, setclickItemList] = useState<string | null>(null)
  const [textoEdicionItemList, settextoEdicionItemList] = useState('')
  const [openChekList, setopenChekList] = useState(false)
  const [openQuestionDelete, setopenQuestionDelete] = useState(false)
  const [textoShare, setTextoShared] = useState('')
  // FALTA AGREGAR AL MOMENTO DE CERRAR
  const [openMiembros, setopenMiembros] = useState(false)
  const [estadoCheck, setEstadoCheck] = useState(false)
  const [validacionShared, setValidacionShared] = useState(false)
  const [colaboradoresSeleccionados, setColaboradoresSeleccionados] = useState([])
  const [openDeleteShared, setOpenDeleteShared] = useState(false)
  const [openfecha, setOpenFecha] = useState(false)
  const [startDate, setStartDate] = useState<Date | null>(null)
  const [openSubi, setOpenSubir] = useState<boolean>(false)
  const [archivosSubidos, setArchivosSubidos] = useState<any>([])
  const [cargandoDescarga, setCargandoDescarga] = useState(false)
  const [comentarios, setComentarios] = useState<any>([])

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
  //   FUNCIONES ITERNAS
  const calcularPorcentaje = (): string => {
    if (arrayList.length === 0) return '0' // Evitar dividir por cero si no hay elementos en la lista
    const countChecked = arrayList.filter((item) => item.check).length
    return ((countChecked / arrayList.length) * 100).toFixed(0)
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
      return words.every((word) => nombres.includes(word))
    })
    const formattedSuggestions = filteredSuggestions
    setSuggestions(formattedSuggestions)
    setShowSuggestions(true)
  }
  function formatFileName (fileName: string): string {
    return fileName.split('_').pop() ?? fileName
  }
  // CREAR CONTENIDO
  // UPDATE DE TODOS LOS CAMPOS
  const updateDatosAction = async (contexto?: string, idEt?: number, checkList?: any, shared?: any, fecha?: any): Promise<string> => {
    setLoading(true)
    const data = new FormData()
    if (contexto) {
      data.append('contexto', contexto)
    }
    if (idEt) {
      data.append('etiqueta', String(idEt))
    }
    if (checkList) {
      data.append('checklist', checkList)
    }
    if (shared != undefined) {
      data.append('shared', shared)
    }
    if (fecha != undefined) {
      data.append('fecha', fecha != 'null' ? JSON.stringify(fecha) : fecha)
    }
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(`${Global.url}/gestorContenido/updateDatos/${idTablero ?? ''}`, data, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      if (respuesta.data.status == 'success') {
        getContenido()
        return 'Actualizacion exitosa'
      } else {
        throw new Error('Error al actualizar')
      }
    } catch (error) {
      console.log(error)
      throw new Error('Error al actualizar')
    } finally {
      setLoading(false)
    }
  }
  const updateDatos = async (contexto?: string, idEt?: number, checkList?: any, shared?: any, fecha?: any): Promise<void> => {
    toast.promise(updateDatosAction(contexto, idEt, checkList, shared, fecha), {
      loading: 'Actualizando...',
      success: (message: any) => message,
      error: (error: any) => error.message
    })
  }
  //   TRAER DATOS DEL CONTENIDO
  const getContenido = async (): Promise<void> => {
    setLoading(true)
    try {
      const { data } = await axios.get(`${Global.url}/gestorContenido/findOneContenido/${contenidoSeleccionado?.contexto.idContexto ?? ''}`, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? `Bearer ${token}` : ''}`
        }
      })
      if (data) {
        setIdContenido(data.id)
        setContenidoGestor(data)
        setContexto(data.contexto)
        setEtiqueta(data.etiqueta)
        setArrayList(data.checklist ? JSON.parse(data.checklist) : [])
        setArchivosSubidos(data.archivos ? JSON.parse(data.archivos) : [])
        setComentarios(data.comentarios ? JSON.parse(data.comentarios) : [])
        setStartDate(data.fecha ? new Date(JSON.parse(data.fecha)) : null)
        setColaboradoresSeleccionados(data.miembros ? JSON.parse(data.miembros) : [])
        setValidacionShared(data.shared === 'true')
      } else {
        toast.warning('Sin contenido')
      }
    } catch (error) {
      console.log(error)
      toast.warning('Sin contenido')
    } finally {
      setLoading(false)
    }
  }
  //   GUARDAR ETIQUETA
  const handleEtiqueta = (idEt: number): void => {
    setEtiqueta(idEt)
    updateDatos(undefined, idEt)
    setOpenEtiqueta(false)
    setOpenOptions(false)
  }
  //   GUARDAR LISTA
  const handleAregarList = (): void => {
    const idUnico = uuidv4()
    const newList = { id: idUnico, titulo: textoLista, check: false }
    updateList(newList)
    setTextoLista('')
    setopenInputList(false)
  }

  const updateListAction = async (newList?: any): Promise<string> => {
    setLoading(true)
    const data = new FormData()
    data.append('newList', JSON.stringify(newList))
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(`${Global.url}/gestorContenido/handleCreateList/${idTablero ?? ''}`, data, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      if (respuesta.data.status == 'success') {
        getContenido()
        return 'Item creando correctamente'
      } else {
        throw new Error('Error al crear item')
      }
    } catch (error) {
      console.log(error)
      throw new Error('Error al crear item')
    } finally {
      setLoading(false)
    }
  }
  const updateList = async (newList?: any): Promise<void> => {
    toast.promise(updateListAction(newList), {
      loading: 'Agregando item...',
      success: (message: any) => message,
      error: (error: any) => error.message
    })
  }
  // ACTUALIZAR CHECKBOX de item lista
  const updateChckBoxListAction = async (id: string, currentCheck: boolean): Promise<string> => {
    setLoading(true)
    const data = new FormData()
    data.append('id', id)
    data.append('check', currentCheck.toString())
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(`${Global.url}/gestorContenido/updateCheck/${idTablero ?? ''}`, data, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      if (respuesta.data.status == 'success') {
        getContenido()
        return 'Actualizado correctamente'
      } else {
        throw new Error('Error al actualizar')
      }
    } catch (error) {
      console.log(error)
      throw new Error('Error al actualizar')
    } finally {
      setLoading(false)
    }
  }
  const updateChckBoxList = async (id: string, currentCheck: boolean): Promise<void> => {
    toast.promise(updateChckBoxListAction(id, currentCheck), {
      loading: 'Actualizando...',
      success: (message: any) => message,
      error: (error: any) => error.message
    })
  }
  // ACTUALIZAR TITULO de item lista
  const handleEditTitleChange = (id: string): void => {
    updateTitleList(id, textoEdicionItemList)
    setclickItemList(null)
    settextoEdicionItemList('')
  }
  const updateTitleListAction = async (id: string, newTitle: string): Promise<string> => {
    setLoading(true)
    const data = new FormData()
    data.append('id', id)
    data.append('newTitle', newTitle)
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(`${Global.url}/gestorContenido/updateTitleFromList/${idTablero ?? ''}`, data, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      if (respuesta.data.status == 'success') {
        getContenido()
        return 'Actualizado correctamente'
      } else {
        throw new Error('Error al actualizar')
      }
    } catch (error) {
      console.log(error)
      throw new Error('Error al actualizar')
    } finally {
      setLoading(false)
    }
  }
  const updateTitleList = async (id: string, newTitle: string): Promise<void> => {
    toast.promise(updateTitleListAction(id, newTitle), {
      loading: 'Actualizando...',
      success: (message: any) => message,
      error: (error: any) => error.message
    })
  }
  //   BORRAR ITEM DE LA LISTA
  const deleteItemListAction = async (itemId: string): Promise<string> => {
    setLoading(true)
    const data = new FormData()
    data.append('id', itemId)
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(`${Global.url}/gestorContenido/deleteItemFromChecklist/${idTablero ?? ''}`, data, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      if (respuesta.data.status == 'success') {
        getContenido()
        return 'Eliminado correctamente'
      } else {
        throw new Error('Error al eliminar')
      }
    } catch (error) {
      console.log(error)
      throw new Error('Error al eliminar')
    } finally {
      setLoading(false)
    }
  }
  const deleteItemList = async (itemId: string): Promise<void> => {
    toast.promise(deleteItemListAction(itemId), {
      loading: 'Eliminando...',
      success: (message: any) => message,
      error: (error: any) => error.message
    })
  }
  // GUARDAR ARCHIVO SUBIDOS
  const guardarArchivoAction = async (newArchivo?: any): Promise<string> => {
    setLoading(true)
    const data = new FormData()
    data.append('newArchivo', JSON.stringify(newArchivo))
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(`${Global.url}/gestorContenido/handleCreateArchivo/${idTablero ?? ''}`, data, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      if (respuesta.data.status == 'success') {
        getContenido()
        return 'Archivo subido correctamente'
      } else {
        throw new Error('Error al subir archivo')
      }
    } catch (error) {
      console.log(error)
      throw new Error('Error al subir archivo')
    } finally {
      setLoading(false)
    }
  }
  const guardarArchivo = async (newArchivo?: any): Promise<void> => {
    toast.promise(guardarArchivoAction(newArchivo), {
      loading: 'Guardando archivo...',
      success: (message: any) => message,
      error: (error: any) => error.message
    })
  }
  //   DESCARGAR ARCHIVO
  const descargarArchivo = async (nombreArchivo: string): Promise<void> => {
    setCargandoDescarga(true)
    try {
      const formData = new FormData()
      formData.append('file_name', nombreArchivo)
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
      const downloadParams = {
        Bucket: data.bucket,
        Key: `gestorArchivos/${nombreArchivo}`
      }
      const response = await s3Client.send(new GetObjectCommand(downloadParams))
      // @ts-expect-error
      const contentLength = parseInt(response.ContentLength, 10)
      let loaded = 0
      // Crear un lector para el stream de datos
      // @ts-expect-error
      const reader = response.Body.getReader()
      const chunks = []
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        chunks.push(value)
        loaded += value.length
        const progress = (loaded / contentLength) * 100
        setDownloadProgress(progress)
      }
      const blob = new Blob(chunks)
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `${formatFileName(nombreArchivo)}`
      document.body.appendChild(a)
      a.click()
      a.remove()
      toast.success('Archivo descargado')
    } catch (error) {
      console.error(error)
      toast.warning('Error al descargar')
    } finally {
      setDownloadProgress(0)
      setCargandoDescarga(false)
    }
  }
  // ELIMINAR ARCHIVOS
  const eliminarArchivo = async (id: string, nombre: string): Promise<string | undefined> => {
    setLoading(true)
    try {
      const formData = new FormData()
      formData.append('file_name', nombre)
      const { data } = await axios.post(`${Global.url}/generateGeneral`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      const s3Client = new S3Client({
        region: data.region,
        credentials: {
          accessKeyId: data.publickey,
          secretAccessKey: data.secretKey
        }
      })
      const response = await s3Client.send(
        new DeleteObjectCommand({
          Bucket: 'mysistemalogosperu', // Cambia esto por tu nombre de bucket
          Key: `gestorArchivos/${nombre}`
        })
      )
      if (response) {
        try {
          const formData2 = new FormData()
          formData2.append('id', id)
          formData2.append('_method', 'PUT')
          const respuesta = await axios.post(`${Global.url}/gestorContenido/deleteItemFromArchivo/${idTablero ?? ''}`, formData2, {
            headers: {
              Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
            }
          })
          if (respuesta.data.status == 'success') {
            getContenido()
            return 'Se elimino el archivo correctamente'
          } else {
            throw new Error('Error al eliminar archivo')
          }
        } catch (error) {
          console.log(error)
          throw new Error('Error al eliminar archivo')
        }
      }
    } catch (error) {
      console.error(error)
      throw new Error('Error eliminando el archivo')
    } finally {
      setLoading(false)
    }
  }
  const preguntarEliminacionArchivo = (id: string, nombre: string): void => {
    toast('¿Deseas eliminar este archivo?', {
      action: {
        label: 'Eliminar',
        onClick: () => {
          toast.promise(eliminarArchivo(id, nombre), {
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
  // GUARDAR COMENTARIOS
  const guardarComentariosAction = async (newComentario?: any): Promise<string> => {
    setLoading(true)
    const data = new FormData()
    data.append('newComentario', JSON.stringify(newComentario))
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(`${Global.url}/gestorContenido/handleCreateComentario/${idTablero ?? ''}`, data, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      if (respuesta.data.status == 'success') {
        getContenido()
        return 'Comentario creando correctamente'
      } else {
        throw new Error('Error al crear comentario')
      }
    } catch (error) {
      console.log(error)
      throw new Error('Error al crear comentario')
    } finally {
      setLoading(false)
    }
  }
  const guardarComentarios = async (newComentario?: any): Promise<void> => {
    toast.promise(guardarComentariosAction(newComentario), {
      loading: 'Agregando comentario...',
      success: (message: any) => message,
      error: (error: any) => error.message
    })
  }
  // ACTUALIZAR TITULO de COMENTARIO
  const editarComentariosAction = async (id: string, newComentario: string): Promise<string> => {
    setLoading(true)
    const data = new FormData()
    data.append('id', id)
    data.append('newComentario', newComentario)
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(`${Global.url}/gestorContenido/updateComentarios/${idTablero ?? ''}`, data, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      if (respuesta.data.status == 'success') {
        getContenido()
        return 'Actualizado correctamente'
      } else {
        throw new Error('Error al actualizar')
      }
    } catch (error) {
      console.log(error)
      throw new Error('Error al actualizar')
    } finally {
      setLoading(false)
    }
  }
  const editarComentario = async (id: string, newComentario: string): Promise<void> => {
    toast.promise(editarComentariosAction(id, newComentario), {
      loading: 'Actualizando...',
      success: (message: any) => message,
      error: (error: any) => error.message
    })
  }
  // AGREGAR MIEMBROS
  const guardarMiembrosAction = async (newMiembro?: any): Promise<string> => {
    setLoading(true)
    const data = new FormData()
    data.append('newMiembro', JSON.stringify(newMiembro))
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(`${Global.url}/gestorContenido/handleCreateMiembros/${idTablero ?? ''}`, data, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      if (respuesta.data.status == 'success') {
        getContenido()
        setShowSuggestions(false)
        setTextoShared('')
        return 'Miembro agregado correctamente'
      } else {
        throw new Error('Error al agregar miembro')
      }
    } catch (error) {
      console.log(error)
      throw new Error('Error al agregar miembro')
    } finally {
      setLoading(false)
    }
  }
  const guardarMiembros = async (newMiembro?: any): Promise<void> => {
    toast.promise(guardarMiembrosAction(newMiembro), {
      loading: 'Agregando miembro...',
      success: (message: any) => message,
      error: (error: any) => error.message
    })
  }
  //   ELIMINAR MIEMBROS
  const eliminarMiembrosAction = async (id?: any): Promise<string> => {
    setLoading(true)
    const data = new FormData()
    data.append('id', id)
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(`${Global.url}/gestorContenido/deleteMiembro/${idTablero ?? ''}`, data, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      if (respuesta.data.status == 'success') {
        getContenido()
        setShowSuggestions(false)
        setTextoShared('')
        return 'Miembro eliminado correctamente'
      } else {
        throw new Error('Error al eliminar miembro')
      }
    } catch (error) {
      console.log(error)
      throw new Error('Error al eliminar miembro')
    } finally {
      setLoading(false)
    }
  }
  const eliminarMiembros = (id: string, nombre: string): void => {
    toast(`¿Deseas eliminar a ${nombre}?`, {
      action: {
        label: 'Eliminar',
        onClick: () => {
          toast.promise(eliminarMiembrosAction(id), {
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
  useEffect(() => {
    if (open && contenidoSeleccionado?.contexto.idContexto) {
      getContenido()
    } else {
      setLoading(false)
    }
  }, [open])
  useEffect(() => {
    if (openInputList && textareaRef.current) {
      // @ts-expect-error
      textareaRef.current.focus()
    }
  }, [openInputList])

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
        setopenChekList(false)
        setopenQuestionDelete(false)
        setValidacionShared(false)
        setEstadoCheck(false)
        setContenidoGestor(null)
        setLoading(true)
        setArchivosSubidos([])
        setContexto('')
        setArrayList([])
        setComentarios([])
        setColaboradoresSeleccionados([])
        getTareas()
        setGestorCompartido()
      }}
      scroll={'body'}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="modal_citas_clientes2"
    >
      <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={loading} className="fondo_backdrop">
        <CircularProgress color="inherit" />
      </Backdrop>

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
                  <div
                    className="absolute w-full z-20 top-full right-0 bg-[#F1F2F4] rounded-lg h-auto shadow-lg mt-3 p-2 ease-in select-none"
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                  >
                    <IoClose
                      className="absolute top-0 -right-0 text-xs transition-colors hover:bg-gray-300/50 p-2 w-8 h-8 rounded-full cursor-pointer"
                      onClick={() => {
                        setopenMiembros(!openMiembros)
                      }}
                    />

                    {validacionShared ? (
                      <>
                        <h2 className="w-full text-center text-gray-700 font-medium text-sm flex items-center gap-1 justify-center">
                          Tarjeta publica
                        </h2>
                        <div className="w-full relative">
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
                              {suggestions
                                .filter((suggestions: any) => suggestions.id != auth.id)
                                .map((suggestion: any) => {
                                  const colb = {
                                    id: suggestion.id,
                                    name: suggestion.name
                                  }
                                  return (
                                    <div
                                      key={suggestion.id}
                                      onClick={() => {
                                        guardarMiembros(colb)
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
                        {!showSuggestions && (
                          <>
                            <p className="text-gray-700 mt-4 text-sm px-2">Miembros del tablero</p>
                            <div className="flex mt-0 flex-col gap-3 p-2">
                              {colaboradoresSeleccionados.map((col: any) => {
                                const colb = {
                                  id: col.id,
                                  name: col.name
                                }
                                return (
                                  <div key={col.id} className="flex bg-gray-300 px-4 py-2 rounded-md line-clamp-1">
                                    <p className="w-full">{colb.name}</p>
                                    <span
                                      className="w-fit hover:text-red-500 transition-colors"
                                      onClick={() => {
                                        eliminarMiembros(colb.id, colb.name)
                                      }}
                                    >
                                      x
                                    </span>
                                  </div>
                                )
                              })}
                            </div>
                            <div
                              className="flex flex-col w-fit justify-center items-center mx-auto gap-3 mt-4"
                              onClick={(e) => {
                                e.stopPropagation()
                              }}
                            >
                              <label
                                className="w-full relative inline-flex items-center  cursor-pointer"
                                onClick={() => {
                                  setOpenDeleteShared(true)
                                }}
                              >
                                <input type="checkbox" disabled={loading} checked={validacionShared} value="" className="sr-only peer w-full" />
                                <div className="group peer ring-0  bg-gradient-to-bl from-neutral-800 via-neutral-700 to-neutral-600  rounded-full outline-none duration-1000 after:duration-300 w-24 h-6  shadow-md  peer-focus:outline-none  after:content-[''] after:rounded-full after:absolute peer-checked:after:rotate-180 after:[background:conic-gradient(from_135deg,_#b2a9a9,_#b2a8a8,_#ffffff,_#d7dbd9_,_#ffffff,_#b2a8a8)]  after:outline-none after:h-4 after:w-4 after:top-1 after:left-1   peer-checked:after:translate-x-[4.5rem] peer-hover:after:scale-95 peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-emerald-900"></div>
                              </label>
                            </div>
                            {openDeleteShared && (
                              <div className="absolute w-[250px] z-20 top-full right-0 bg-[#F1F2F4] rounded-lg h-auto shadow-lg mt-3 p-2 ease-in select-none">
                                <IoClose
                                  className="absolute top-0 -right-0 text-xs transition-colors hover:bg-gray-300/50 p-2 w-8 h-8 rounded-full cursor-pointer"
                                  onClick={() => {
                                    setOpenDeleteShared(false)
                                  }}
                                />
                                <h2 className="w-full text-center text-gray-700 font-medium text-sm">¿Cambiar a privado?</h2>
                                <p className="px-2 mt-3 text-sm">Si cambias el estado, las lista de miembros seran eliminados</p>
                                <div className="flex flex-col w-full gap-3 mt-4">
                                  {!loading ? (
                                    <span
                                      className={
                                        ' px-2 block w-full text-center text-white bg-red-700 hover:bg-red-800 py-1 rounded-md cursor-pointer transition-colors duration-300'
                                      }
                                      onClick={() => {
                                        if (!loading) {
                                          updateDatos(undefined, undefined, undefined, false)
                                        }
                                      }}
                                    >
                                      Cambiar
                                    </span>
                                  ) : (
                                    <LoadingSmall />
                                  )}
                                </div>
                              </div>
                            )}
                          </>
                        )}
                      </>
                    ) : (
                      <>
                        <h2 className="w-full text-center text-gray-700 font-medium text-sm flex items-center gap-1 justify-center">
                          <GrSecure className="text-lg" /> Tarjeta privada
                        </h2>
                        <p className="px-2 mt-3 text-sm">
                          Actualmente la tarjeta se encuentra en estado privado, si necesita compartir la tarea con otros usuarios debe cambiar el
                          estado a publico.
                        </p>
                        <div
                          className="flex flex-col w-fit justify-center items-center mx-auto gap-3 mt-4"
                          onClick={(e) => {
                            e.stopPropagation()
                          }}
                        >
                          <label
                            className="w-full relative inline-flex items-center  cursor-pointer"
                            onClick={() => {
                              updateDatos(undefined, undefined, undefined, true)
                            }}
                          >
                            <input type="checkbox" disabled={loading} checked={estadoCheck} value="" className="sr-only peer w-full" />
                            <div className="group peer ring-0  bg-gradient-to-bl from-neutral-800 via-neutral-700 to-neutral-600  rounded-full outline-none duration-1000 after:duration-300 w-24 h-6  shadow-md  peer-focus:outline-none  after:content-[''] after:rounded-full after:absolute peer-checked:after:rotate-180 after:[background:conic-gradient(from_135deg,_#b2a9a9,_#b2a8a8,_#ffffff,_#d7dbd9_,_#ffffff,_#b2a8a8)]  after:outline-none after:h-4 after:w-4 after:top-1 after:left-1   peer-checked:after:translate-x-[4.5rem] peer-hover:after:scale-95 peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-emerald-900"></div>
                          </label>
                        </div>
                      </>
                    )}
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
                    <h2 className="w-full text-center text-gray-700">Etiquetas</h2>
                    <div className="flex flex-col w-full gap-3 mt-4">
                      <span
                        className={`block w-full text-center  ${
                          etiqueta == 1 ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-500'
                        } py-1 rounded-md cursor-pointer transition-colors duration-300`}
                        onClick={() => {
                          handleEtiqueta(1)
                        }}
                      >
                        Alta
                      </span>
                      <span
                        className={`block w-full text-center  ${
                          etiqueta == 2 ? 'bg-yellow-500  text-white' : 'bg-gray-300 text-gray-500'
                        } py-1 rounded-md cursor-pointer transition-colors duration-300`}
                        onClick={() => {
                          handleEtiqueta(2)
                        }}
                      >
                        Media
                      </span>
                      <span
                        className={`block w-full text-center  ${
                          etiqueta == 3 ? 'bg-green-700  text-white' : 'bg-gray-300 text-gray-500'
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
                  <div
                    onClick={(e) => {
                      e.stopPropagation()
                    }}
                    className=" absolute top-full left-0 right-0 bg-[#F1F2F4] rounded-lg w-full h-auto shadow-lg mt-3 p-2 ease-in select-none"
                  >
                    <IoClose
                      className="absolute top-0 -right-0 text-xs transition-colors hover:bg-gray-300/50 p-2 w-8 h-8 rounded-full cursor-pointer"
                      onClick={() => {
                        setOpenFecha(!openfecha)
                      }}
                    />
                    <h2 className="w-full text-center text-gray-700">Programar fecha de entrega</h2>
                    <div className="flex flex-col w-full gap-3 mt-4">
                      <ModalFecha startDate={startDate} updateDatos={updateDatos} validacionShared={validacionShared} />
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
                    <div
                      className="absolute w-full z-20 top-full right-0 bg-[#F1F2F4] rounded-lg h-auto shadow-lg mt-3 p-2 ease-in select-none"
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                    >
                      <IoClose
                        className="absolute top-0 -right-0 text-xs transition-colors hover:bg-gray-300/50 p-2 w-8 h-8 rounded-full cursor-pointer"
                        onClick={() => {
                          setopenMiembros(!openMiembros)
                        }}
                      />

                      {validacionShared ? (
                        <>
                          <h2 className="w-full text-center text-gray-700 font-medium text-sm flex items-center gap-1 justify-center">
                            Tarjeta publica
                          </h2>
                          <div className="w-full relative">
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
                                {suggestions
                                  .filter((suggestions: any) => suggestions.id != auth.id)
                                  .map((suggestion: any) => {
                                    const colb = {
                                      id: suggestion.id,
                                      name: suggestion.name
                                    }
                                    return (
                                      <div
                                        key={suggestion.id}
                                        onClick={() => {
                                          guardarMiembros(colb)
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
                          {!showSuggestions && (
                            <>
                              <p className="text-gray-700 mt-4 text-sm px-2">Miembros del tablero</p>
                              <div className="flex mt-0 flex-col gap-3 p-2">
                                {colaboradoresSeleccionados.map((col: any) => {
                                  const colb = {
                                    id: col.id,
                                    name: col.name
                                  }
                                  return (
                                    <div key={col.id} className="flex bg-gray-300 px-4 py-2 rounded-md line-clamp-1">
                                      <p className="w-full">{colb.name}</p>
                                      <span
                                        className="w-fit hover:text-red-500 transition-colors"
                                        onClick={() => {
                                          eliminarMiembros(colb.id, colb.name)
                                        }}
                                      >
                                        x
                                      </span>
                                    </div>
                                  )
                                })}
                              </div>
                              <div
                                className="flex flex-col w-fit justify-center items-center mx-auto gap-3 mt-4"
                                onClick={(e) => {
                                  e.stopPropagation()
                                }}
                              >
                                <label
                                  className="w-full relative inline-flex items-center  cursor-pointer"
                                  onClick={() => {
                                    setOpenDeleteShared(true)
                                  }}
                                >
                                  <input type="checkbox" disabled={loading} checked={validacionShared} value="" className="sr-only peer w-full" />
                                  <div className="group peer ring-0  bg-gradient-to-bl from-neutral-800 via-neutral-700 to-neutral-600  rounded-full outline-none duration-1000 after:duration-300 w-24 h-6  shadow-md  peer-focus:outline-none  after:content-[''] after:rounded-full after:absolute peer-checked:after:rotate-180 after:[background:conic-gradient(from_135deg,_#b2a9a9,_#b2a8a8,_#ffffff,_#d7dbd9_,_#ffffff,_#b2a8a8)]  after:outline-none after:h-4 after:w-4 after:top-1 after:left-1   peer-checked:after:translate-x-[4.5rem] peer-hover:after:scale-95 peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-emerald-900"></div>
                                </label>
                              </div>
                              {openDeleteShared && (
                                <div className="absolute w-[250px] z-20 top-full right-0 bg-[#F1F2F4] rounded-lg h-auto shadow-lg mt-3 p-2 ease-in select-none">
                                  <IoClose
                                    className="absolute top-0 -right-0 text-xs transition-colors hover:bg-gray-300/50 p-2 w-8 h-8 rounded-full cursor-pointer"
                                    onClick={() => {
                                      setOpenDeleteShared(false)
                                    }}
                                  />
                                  <h2 className="w-full text-center text-gray-700 font-medium text-sm">¿Cambiar a privado?</h2>
                                  <p className="px-2 mt-3 text-sm">Si cambias el estado, las lista de miembros seran eliminados</p>
                                  <div className="flex flex-col w-full gap-3 mt-4">
                                    {!loading ? (
                                      <span
                                        className={
                                          ' px-2 block w-full text-center text-white bg-red-700 hover:bg-red-800 py-1 rounded-md cursor-pointer transition-colors duration-300'
                                        }
                                        onClick={() => {
                                          if (!loading) {
                                            updateDatos(undefined, undefined, undefined, false)
                                          }
                                        }}
                                      >
                                        Cambiar
                                      </span>
                                    ) : (
                                      <LoadingSmall />
                                    )}
                                  </div>
                                </div>
                              )}
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <h2 className="w-full text-center text-gray-700 font-medium text-sm flex items-center gap-1 justify-center">
                            <GrSecure className="text-lg" /> Tarjeta privada
                          </h2>
                          <p className="px-2 mt-3 text-sm">
                            Actualmente la tarjeta se encuentra en estado privado, si necesita compartir la tarea con otros usuarios debe cambiar el
                            estado a publico.
                          </p>
                          <div
                            className="flex flex-col w-fit justify-center items-center mx-auto gap-3 mt-4"
                            onClick={(e) => {
                              e.stopPropagation()
                            }}
                          >
                            <label
                              className="w-full relative inline-flex items-center  cursor-pointer"
                              onClick={() => {
                                updateDatos(undefined, undefined, undefined, true)
                              }}
                            >
                              <input type="checkbox" disabled={loading} checked={estadoCheck} value="" className="sr-only peer w-full" />
                              <div className="group peer ring-0  bg-gradient-to-bl from-neutral-800 via-neutral-700 to-neutral-600  rounded-full outline-none duration-1000 after:duration-300 w-24 h-6  shadow-md  peer-focus:outline-none  after:content-[''] after:rounded-full after:absolute peer-checked:after:rotate-180 after:[background:conic-gradient(from_135deg,_#b2a9a9,_#b2a8a8,_#ffffff,_#d7dbd9_,_#ffffff,_#b2a8a8)]  after:outline-none after:h-4 after:w-4 after:top-1 after:left-1   peer-checked:after:translate-x-[4.5rem] peer-hover:after:scale-95 peer-checked:bg-gradient-to-r peer-checked:from-emerald-500 peer-checked:to-emerald-900"></div>
                            </label>
                          </div>
                        </>
                      )}
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
                      <h2 className="w-full text-center text-gray-700">Etiquetas</h2>
                      <div className="flex flex-col w-full gap-3 mt-4">
                        <span
                          className={`block w-full text-center  ${
                            etiqueta == 1 ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-500'
                          } py-1 rounded-md cursor-pointer transition-colors duration-300`}
                          onClick={() => {
                            handleEtiqueta(1)
                          }}
                        >
                          Alta
                        </span>
                        <span
                          className={`block w-full text-center  ${
                            etiqueta == 2 ? 'bg-yellow-500  text-white' : 'bg-gray-300 text-gray-500'
                          } py-1 rounded-md cursor-pointer transition-colors duration-300`}
                          onClick={() => {
                            handleEtiqueta(2)
                          }}
                        >
                          Media
                        </span>
                        <span
                          className={`block w-full text-center  ${
                            etiqueta == 3 ? 'bg-green-700  text-white' : 'bg-gray-300 text-gray-500'
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
                    <div
                      onClick={(e) => {
                        e.stopPropagation()
                      }}
                      className=" absolute top-full left-0 right-0 bg-[#F1F2F4] rounded-lg w-full h-auto shadow-lg mt-3 p-2 ease-in select-none"
                    >
                      <IoClose
                        className="absolute top-0 -right-0 text-xs transition-colors hover:bg-gray-300/50 p-2 w-8 h-8 rounded-full cursor-pointer"
                        onClick={() => {
                          setOpenFecha(!openfecha)
                        }}
                      />
                      <h2 className="w-full text-center text-gray-700">Programar fecha de entrega</h2>
                      <div className="flex flex-col w-full gap-3 mt-4">
                        <ModalFecha startDate={startDate} updateDatos={updateDatos} validacionShared={validacionShared} />
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
        <div className="flex justify-between">
          <div className="flex gap-3 items-start w-[95%]">
            <BiTask className="text-2xl mt-1 text-gray-600 w-auto" />
            <div className="flex flex-col gap-2 w-full">
              <h1 className="text-lg text-gray-700 font-medium flex-1">{contenidoSeleccionado?.contexto.titulo}</h1>
              <span className="text-gray-500 text-sm">
                En la lista de <span className="underline">{contenidoSeleccionado?.contexto.titulo}</span>{' '}
              </span>
            </div>
          </div>
          <div className="w-[5%] relative">
            <SlOptions
              className="absolute -top-2 -right-3 text-sm transition-colors hover:bg-gray-300/50 p-2 w-10 h-10 rounded-full cursor-pointer"
              onClick={() => {
                setOpenOptions(!openOptions)
              }}
            />
            <ModalComentarios
              setOpenOptions={setOpenOptions}
              comentarios={comentarios}
              guardarComentarios={guardarComentarios}
              editarComentario={editarComentario}
            />
          </div>
        </div>
        {etiqueta != 0 || startDate != null ? (
          <div className="flex flex-grow w-full pl-8 pt-6 gap-4">
            {etiqueta != 0 && (
              <div className="flex flex-col gap-2 relative">
                <h2 className="text-gray-700 text-sm">Etiqueta</h2>
                <div className="flex gap-2 group">
                  <span
                    className={`w-14 h-8 ${
                      etiqueta == 1 ? 'bg-red-600' : etiqueta == 2 ? 'bg-yellow-500' : etiqueta == 3 ? 'bg-green-700 ' : ''
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
                    <h2 className="w-full text-center text-gray-700">Etiquetas</h2>
                    <div className="flex flex-col w-full gap-3 mt-4">
                      <span
                        className={`block w-full text-center  ${
                          etiqueta == 1 ? 'bg-red-600 text-white' : 'bg-gray-300 text-gray-500'
                        } py-1 rounded-md cursor-pointer transition-colors duration-300`}
                        onClick={() => {
                          handleEtiqueta(1)
                        }}
                      >
                        Alta
                      </span>
                      <span
                        className={`block w-full text-center  ${
                          etiqueta == 2 ? 'bg-yellow-500  text-white' : 'bg-gray-300 text-gray-500'
                        } py-1 rounded-md cursor-pointer transition-colors duration-300`}
                        onClick={() => {
                          handleEtiqueta(2)
                        }}
                      >
                        Media
                      </span>
                      <span
                        className={`block w-full text-center  ${
                          etiqueta == 3 ? 'bg-green-700  text-white' : 'bg-gray-300 text-gray-500'
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
            )}
            {startDate != null && (
              <div className="flex flex-col gap-2 ">
                <h2 className="text-gray-700 text-sm">Vencimiento</h2>
                <div className="group flex items-center gap-2">
                  <div className="flex gap-0 w-fit bg-gray-300 h-8 rounded-md">
                    <div className="w-1/2 flex justify-center gap-0 items-center">
                      <FaRegCalendarCheck className="w-10" />
                      <span className="flex-1 w-fit bg-transparent outline-none p-0">{startDate?.toLocaleDateString()}</span>
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
                      updateDatos(undefined, undefined, undefined, undefined, 'null')
                    }}
                  >
                    x
                  </span>
                </div>
              </div>
            )}
          </div>
        ) : null}

        <div className="flex justify-between mt-6 items-center">
          <div className="flex gap-3 items-start w-[95%]">
            <CgDetailsMore className="text-2xl mt-1 text-gray-600 w-auto" />
            <div className="flex flex-col gap-2 w-full">
              <h1 className="text-lg text-gray-700 font-medium flex-1">Descripción</h1>
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
          {edicion ? (
            <>
              <EditorPdfAltas content={contexto} setContent={setContexto} />
              <div className="flex gap-3 items-center">
                <button
                  className="bg-cyan-600 hover:bg-cyan-700 text-white transition-colors rounded-md px-4 py-2 mt-3"
                  onClick={() => {
                    setEdicion(!edicion)
                    updateDatos(contexto, undefined)
                  }}
                >
                  Guardar
                </button>
              </div>
            </>
          ) : (
            <EditorVisaPrevisa content={contexto} setContent={setContexto} />
          )}
        </div>

        <div className="w-full pl-8 py-4 flex justify-end">
          <button
            className="bg-gray-300 hover:bg-gray-400/60 transition-colors rounded-md px-4 py-2"
            onClick={() => {
              setOpenSubir(!openSubi)
            }}
          >
            Subir archivos
          </button>
          <SubirArchivo open={openSubi} setOpen={setOpenSubir} guardarArchivo={guardarArchivo} />
        </div>
        {archivosSubidos?.length > 0 && (
          <div className="w-full ">
            <div className="bg-white p-4 lg:p-0 w-full relative rounded-xl shadow-md">
              <div className="hidden md:grid grid-cols-1 md:grid-cols-6 gap-4 py-2 text-gray-500  w-full">
                <h5 className="md:text-left pl-4 col-span-2 font-semibold text-sm">Archivo</h5>
                <h5 className="md:text-center col-span-2 font-semibold text-sm">Peso</h5>
                <h5 className="md:text-left col-span-2 font-semibold text-sm"></h5>
              </div>
              {archivosSubidos?.map((archivo: any) => (
                <div
                  key={archivo.id}
                  className="grid grid-cols-1 md:grid-cols-6 gap-4 items-center mb-2 bg-white border rounded-lg shadow-sm hover:bg-gray-100 p-4 transition-all w-full"
                >
                  <div className="flex items-center col-span-3 md:col-span-2">
                    <img src={filarachive} alt="File Icon" className="w-8 h-8 mr-3" />
                    <span className="truncate text-gray-800 text-sm font-medium">{formatFileName(archivo.nombre)}</span>
                  </div>
                  {/* Tamaño del Archivo */}
                  <div className="hidden md:flex justify-center text-gray-600 text-sm col-span-2">{formatFileSize(archivo.tamaño)}</div>
                  {/* Acciones (Descargar y Eliminar) */}
                  <div className="flex justify-end gap-3 col-span-3 md:col-span-2">
                    {!cargandoDescarga ? (
                      <BsFillCloudArrowDownFill
                        className="text-gray-500 text-xl cursor-pointer hover:text-gray-700 transition-colors"
                        onClick={async () => {
                          await descargarArchivo(archivo.nombre)
                        }}
                        title="Descargar archivo"
                      />
                    ) : (
                      <BsFillCloudArrowDownFill className="text-gray-300 text-xl" />
                    )}
                    <BsFillTrashFill
                      className="text-red-500 text-lg mt-[1px] cursor-pointer hover:text-red-700 transition-colors"
                      onClick={() => {
                        preguntarEliminacionArchivo(archivo.id, archivo.nombre)
                      }}
                      title="Eliminar archivo"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {openChekList || arrayList?.length > 0 ? (
          <>
            <div className="flex justify-between mt-6 items-center">
              <div className="flex gap-3 items-start w-[95%]">
                <RiCheckboxLine className="text-2xl mt-1 text-gray-600 w-auto" />
                <div className="flex flex-col gap-2 w-full">
                  <h1 className="text-lg text-gray-700 font-medium flex-1">CheckList</h1>
                </div>
              </div>
              <div className="relative">
                <button
                  className="bg-gray-300 hover:bg-gray-400/60 transition-colors rounded-md px-4 py-2"
                  onClick={() => {
                    setopenQuestionDelete(!openQuestionDelete)
                  }}
                >
                  Eliminar
                </button>
                {openQuestionDelete && (
                  <div className="absolute w-[250px] z-20 top-full right-0 bg-white rounded-lg h-auto shadow-lg mt-3 p-2 ease-in select-none">
                    <IoClose
                      className="absolute top-0 -right-0 text-xs transition-colors hover:bg-gray-300/50 p-2 w-8 h-8 rounded-full cursor-pointer"
                      onClick={() => {
                        setopenQuestionDelete(!openQuestionDelete)
                      }}
                    />
                    <h2 className="w-full text-center text-gray-700 font-medium text-sm">¿Desea eliminar ChekList?</h2>
                    <p className="px-2 mt-3 text-sm">Eliminar una lista de control es una operación permanente y no puede deshacerse.</p>
                    <div className="flex flex-col w-full gap-3 mt-4">
                      <span
                        className={
                          ' px-2 block w-full text-center text-white bg-red-700 hover:bg-red-800 py-1 rounded-md cursor-pointer transition-colors duration-300'
                        }
                        onClick={() => {
                          updateDatos(undefined, undefined, [])
                          setopenQuestionDelete(false)
                          setopenInputList(false)
                          setopenChekList(false)
                        }}
                      >
                        Eliminar
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
            {arrayList?.length > 0 && (
              <div className="w-full pl-1 pt-6 ">
                <div className="flex gap-3 items-center">
                  <span>{calcularPorcentaje()}%</span>
                  <div className="w-full relative">
                    <span className="absolute bg-blue-500 rounded-md h-full inset-0 z-10" style={{ width: `${calcularPorcentaje()}%` }}></span>
                    <span className="block w-full rounded-md bg-gray-300 h-2 relative "></span>
                  </div>
                </div>
              </div>
            )}
            <div className="w-full pl-8 ">
              <div className="mt-3 flex flex-col gap-3">
                {arrayList?.map((lista) => (
                  <div key={lista.id} className="w-full flex justify-between group">
                    <div className={`flex  ${clickItemList == lista.id ? 'items-start' : 'items-center'} gap-4 w-full`}>
                      <input
                        type="checkbox"
                        className="mt-1 w-4 h-4"
                        checked={lista.check}
                        onChange={() => {
                          updateChckBoxList(lista.id, Boolean(!lista.check)) // Asegura que el valor sea booleano
                        }}
                      />
                      <div
                        className={`flex justify-between items-center w-full ${
                          clickItemList == lista.id ? 'bg-gray-200 p-1' : 'group-hover:bg-gray-200 '
                        } transition-colors rounded-md`}
                      >
                        {clickItemList == lista.id ? (
                          <div className="flex flex-col gap-3 w-full">
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
                            <div className="flex gap-1">
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
                                <IoClose />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <p
                            className="w-full text-gray-700 px-2 outline-none mt-1 placeholder:text-gray-700  p-1 bg-transparent rounded-md"
                            onClick={() => {
                              setclickItemList(lista.id)
                              settextoEdicionItemList(lista.titulo)
                            }}
                          >
                            {lista.titulo}
                          </p>
                        )}
                        {clickItemList != lista.id && (
                          <div className="relative">
                            <TiDelete
                              className={
                                ' px-2 block w-full text-left hover:bg-gray-300 hover:text-red-600 py-1 rounded-md cursor-pointer transition-colors duration-300 text-3xl'
                              }
                              onClick={() => {
                                deleteItemList(lista.id)
                              }}
                            />
                          </div>
                        )}
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
        ) : null}
      </DialogContent>
    </Dialog>
  )
}
