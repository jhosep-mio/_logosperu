/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable multiline-ternary */
import { FaRegFile } from 'react-icons/fa6'
import { GoFileDirectoryFill } from 'react-icons/go'
import { useState } from 'react'
import { MdDownload } from 'react-icons/md'
import { Global } from '../../../../../helper/Global'
import axios from 'axios'
import { IoEyeSharp } from 'react-icons/io5'
import useAuth from '../../../../../hooks/useAuth'
import { ModalWord } from './ModalWord'
import {
  GetObjectCommand,
  S3Client
} from '@aws-sdk/client-s3'

function formatFileName (fileName: string): string {
  return fileName.split('_').pop() ?? fileName
}

export const ArrayArchivos = ({
  arrayDocumentos,
  setArchivoSelected,
  archivoSelected,
  setContextMenu2,
  handleContextMenu2,
  currentPath,
  setCurrentPath,
  folderName,
  setFolderName
}: any): JSX.Element => {
  const formatDateTime = (dateTimeString: string): string => {
    const dateTime = new Date(dateTimeString)
    const options: any = {
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: false // Formato de 24 horas
    }
    return dateTime.toLocaleString(undefined, options)
  }
  const [documento, setDocumento] = useState<any | null>(null)
  const [open, setOpen] = useState(false)
  const { setDownloadProgress } = useAuth()

  const handleFolderClick = (folderId: string, folderName: string): void => {
    if (currentPath === null) {
      setCurrentPath([{ id: folderId, name: folderName }])
    } else {
      setCurrentPath([...currentPath, { id: folderId, name: folderName }])
    }
  }

  const token = localStorage.getItem('token')
  const formatSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  // Manejar los cambios en el nombre de la carpeta
  const handleNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setFolderName(event.target.value)
  }
  // Manejar la finalización de la edición y guardar los cambios
  const finishEditing = (_folderId: string): void => {
    setArchivoSelected(null)
    setFolderName('')
  }

  const cleanName = (name: string): string => {
    if (name.includes('__')) {
      const parts = name.split('__')
      const finalPart = parts[parts.length - 1]
      return finalPart
    }
    return name
  }

  const descargarArchivo = async (name: string): Promise<void> => {
    setContextMenu2(null)
    try {
      const formData = new FormData()
      formData.append('file_name', 'none')
      const { data } = await axios.post(
        `${Global.url}/getFileGeneral`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      const s3Client = new S3Client({
        region: data.region,
        credentials: {
          accessKeyId: data.publickey, // Reemplaza con tu Access Key ID
          secretAccessKey: data.secretKey // Reemplaza con tu Secret Access Key
        }
      })
      const downloadParams = {
        Bucket: data.bucket,
        Key: `archivosProyectos/${name}`
      }
      const response = await s3Client.send(
        new GetObjectCommand(downloadParams)
      )
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
      a.download = `${formatFileName(name)}` // Extraer el nombre del archivo
      document.body.appendChild(a)
      a.click()
      a.remove()
    } catch (error) {
      console.error(error)
    }
  }

  const avancesReverse = [...arrayDocumentos].reverse()

  return (
    <>
      {avancesReverse
        ?.sort((a: any, b: any) => {
          if (a.type === 'carpeta' && b.type === 'carpeta') {
            // Ordenar carpetas alfabéticamente
            return a.name.localeCompare(b.name)
          } else {
            // Colocar carpetas antes que archivos
            return a.type === 'carpeta' ? -1 : 1
          }
        })
        .filter((documento: any) => {
          if (currentPath) {
            return documento.folder === currentPath[currentPath.length - 1]?.id
          } else {
            return !documento.folder
          }
        })
        .map((documento: any) => (
          <div
            key={documento.id}
            onClick={(e) => {
              e.stopPropagation()
              if (documento.id == archivoSelected?.id) {
                setArchivoSelected(null)
              } else {
                setArchivoSelected(documento)
              }
            }}
            onDoubleClick={() => {
              if (documento.type == 'carpeta') {
                handleFolderClick(documento.id, documento.name)
              }
            }} // Agrega el manejador de doble clic aquí
            onContextMenu={(e: any) => {
              if (documento.id == archivoSelected?.id) {
                handleContextMenu2(e)
              }
            }}
            style={{ cursor: 'context-menu' }}
            className={`${
              documento.id == archivoSelected?.id ? 'bg-gray-200' : ''
            } grid grid-cols-1 lg:grid-cols-5 gap-4 lg:px-4 items-center select-none mb-2 relative  p-2 rounded-xl cursor-pointer w-full`}
          >
            <div className=" lg:block lg:text-center col-span-2">
              {documento.tipo == 'archivo' ? (
                <div className="text-left flex gap-3 items-center line-clamp-1">
                  <FaRegFile className="text-black lowercase" />
                  <span className="text-black  line-clamp-1">
                    {cleanName(documento.name)}
                  </span>
                </div>
              ) : (
                <div className="text-left flex gap-3 items-center line-clamp-2">
                  {
                    // eslint-disable-next-line multiline-ternary
                    documento.type == 'carpeta' &&
                    archivoSelected?.id == documento.id &&
                    folderName.length > 0 ? (
                      // Renderizar un campo de entrada para editar el nombre de la carpeta si está en modo de edición
                      <input
                        type="text"
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                        value={folderName}
                        className="flex gap-3 items-center text-black  first-letter:uppercase"
                        onChange={handleNameChange}
                        onKeyDown={(e) => {
                          if (e.key == 'Enter' && folderName.length > 0) {
                            finishEditing(documento.id)
                          }
                        }}
                        autoFocus
                      />
                        ) : (
                      <span className="flex gap-3 items-center text-black  first-letter:uppercase">
                        <GoFileDirectoryFill /> {documento.name}
                      </span>
                        )
                  }
                </div>
              )}
            </div>
            <div className="hidden lg:block lg:text-left">
              <div className="text-left flex gap-3 items-center line-clamp-2">
                {/* <img src={filarachive} alt="" className="w-10 h-10" /> */}
                <span className="flex gap-3 items-center text-gray-500">
                  {formatDateTime(documento.creationDate)}{' '}
                </span>
              </div>
            </div>
            <div className="hidden lg:flex lg:justify-left items-center gap-4 ">
              {documento.tipo == 'archivo' ? (
                <span className=" text-gray-500 line-clamp-1">
                  {documento.type}
                </span>
              ) : (
                <span className=" text-gray-500 line-clamp-1">
                  Carpeta de archivos
                </span>
              )}
            </div>
            <div className="hidden lg:flex lg:justify-left items-center gap-4 ">
              <span className="flex gap-3 items-left text-gray-500">
                {formatSize(documento.size) == '0 Bytes'
                  ? ''
                  : formatSize(documento.size)}
              </span>
            </div>
            {documento?.tipo == 'archivo' && (
              <div className="flex lg:justify-left items-center gap-4 absolute right-2">
                <span
                  className="ml-auto text-xs tracking-widest text-muted-foreground cursor-pointer"
                  onClick={() => {
                    setDocumento(documento?.name)
                    setOpen(true)
                  }}
                >
                  <IoEyeSharp className="text-base text-secundario" />
                </span>
                <span
                  className="ml-auto text-xs tracking-widest text-muted-foreground cursor-pointer"
                  onClick={async () => {
                    await descargarArchivo(documento?.name)
                  }}
                >
                  <MdDownload className="text-base text-gray-600" />
                </span>
              </div>
            )}
          </div>
        ))}

      <ModalWord open={open} setOpen={setOpen} documento={documento} />
    </>
  )
}
