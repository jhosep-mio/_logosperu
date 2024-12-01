/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable multiline-ternary */
import { FaRegFile } from 'react-icons/fa6'
import { GoFileDirectoryFill } from 'react-icons/go'
import {
  type Dispatch,
  type SetStateAction,
  type MouseEvent,
  useState
} from 'react'
import { Menu } from '@mui/material'
import { MdDelete, MdDownload } from 'react-icons/md'
import { AiFillEdit } from 'react-icons/ai'
import { type documentosArchivesValues } from '../../../../shared/schemas/Interfaces'
import { Global } from '../../../../../helper/Global'
import axios from 'axios'
import Swal from 'sweetalert2'
import { IoEyeSharp } from 'react-icons/io5'
import { ModalWord } from './ModalWord'
import useAuth from '../../../../../hooks/useAuth'

interface Folder {
  id: string
  name: string
}

export const ArrayArchivos = ({
  arrayDocumentos,
  setArchivoSelected,
  archivoSelected,
  handleContextMenu2,
  setContextMenu2,
  contextMenu2,
  setArrayDocumentos,
  deleteDocumento,
  updateCita,
  deleteArchivo,
  currentPath,
  setCurrentPath,
  folderName,
  setFolderName
}: {
  arrayDocumentos: string[]
  setArchivoSelected: Dispatch<SetStateAction<documentosArchivesValues | null>>
  archivoSelected: documentosArchivesValues | null
  setContextMenu2: Dispatch<
  SetStateAction<{
    mouseX: number
    mouseY: number
  } | null>
  >
  contextMenu2: {
    mouseX: number
    mouseY: number
  } | null
  handleContextMenu2: (event: MouseEvent) => void
  setArrayDocumentos: Dispatch<SetStateAction<string[]>>
  deleteDocumento: (id: string | undefined) => void
  updateCita: (updatedEvents: string[], ImagesToAdd: string[]) => Promise<void>
  deleteArchivo: (
    id: string | undefined,
    name: string | undefined
  ) => Promise<void>
  currentPath: Folder[] | null
  setCurrentPath: Dispatch<SetStateAction<Folder[] | null>>
  folderName: string
  setFolderName: Dispatch<SetStateAction<string>>
}): JSX.Element => {
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
  const { auth } = useAuth()
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

  // Manejar el inicio de la edición
  const startEditing = (): void => {
    setFolderName(archivoSelected?.name ?? '')
    setContextMenu2(null)
  }

  // Manejar los cambios en el nombre de la carpeta
  const handleNameChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    setFolderName(event.target.value)
  }

  // Manejar la finalización de la edición y guardar los cambios
  const finishEditing = (folderId: string): void => {
    const updatedArrayDocumentos = arrayDocumentos.map((documento: any) => {
      if (documento.id == folderId && documento.type == 'carpeta') {
        return { ...documento, name: folderName }
      }
      return documento
    })
    setArrayDocumentos(updatedArrayDocumentos)
    updateCita(updatedArrayDocumentos, [])
    setArchivoSelected(null)
    setFolderName('')
  }

  const cleanName = (name: string): string => {
    // Dividir el nombre del archivo en partes separadas por el caracter "_"
    const parts = name.split('_')
    // Obtener la última parte del nombre del archivo
    const finalPart = parts[parts.length - 1]
    return finalPart
  }

  const descargarArchivo = async (name: string | undefined): Promise<void> => {
    setContextMenu2(null)
    try {
      const response = await axios.get(
        `${Global.url}/downloadArchivoGestor/${name ?? ''}`,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          },
          responseType: 'blob' // Configuración para recibir una respuesta binaria (archivo)
        }
      )

      // Crear un objeto URL para el blob
      const blob = new Blob([response.data])
      const url = window.URL.createObjectURL(blob)

      // Crear un enlace para iniciar la descarga
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', cleanName(name ?? '')) // Establecer el nombre de descarga
      document.body.appendChild(link)
      link.click()

      // Limpiar el objeto URL y el enlace
      window.URL.revokeObjectURL(url)
      document.body.removeChild(link)
    } catch (error) {
      console.log(error)
      Swal.fire('Error', '', 'error')
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
              {documento.tipo == 'archivo'
                ? (
                <span className=" text-gray-500 line-clamp-1">
                  {documento.type}
                </span>
                  )
                : (
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
            {documento?.tipo == 'archivo' &&
            <div className="flex lg:justify-left items-center gap-4 absolute right-2">
                <span className="ml-auto text-xs tracking-widest text-muted-foreground cursor-pointer"
                onClick={() => {
                  setDocumento(documento?.name)
                  setOpen(true)
                }}
                >
                    <IoEyeSharp className="text-base text-secundario" />
                </span>
                <span className="ml-auto text-xs tracking-widest text-muted-foreground cursor-pointer"
                onClick={async () => {
                  await descargarArchivo(documento?.name)
                }}
                >
                <MdDownload className="text-base text-gray-600" />
                </span>
            </div>}
          </div>
        ))}
      {auth.id_rol == 99 &&
      <Menu
        open={contextMenu2 !== null}
        onClose={() => {
          setContextMenu2(null)
        }}
        anchorReference="anchorPosition"
        className="fondo_documentos"
        anchorPosition={
          contextMenu2 !== null
            ? { top: contextMenu2.mouseY, left: contextMenu2.mouseX }
            : undefined
        }
      >
        {archivoSelected?.type != 'carpeta' ? (
          <div
            role="menuitem"
            className="w-[200px] relative flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none hover:bg-gray-200 focus:bg-gray-200 focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 pl-3"
            data-orientation="vertical"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={async () => {
              await descargarArchivo(archivoSelected?.name)
            }}
            data-radix-collection-item=""
          >
            Descargar
            <span className="ml-auto text-xs tracking-widest text-muted-foreground">
              <MdDownload className="text-base text-gray-600" />
            </span>
          </div>
        ) : (
          <div
            role="menuitem"
            className="w-[200px] relative flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none hover:bg-gray-200 focus:bg-gray-200 focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 pl-3"
            data-orientation="vertical"
            data-radix-collection-item=""
            onClick={(e) => {
              e.stopPropagation()
              startEditing()
            }}
          >
            Editar
            <span className="ml-auto text-xs tracking-widest text-muted-foreground">
              <AiFillEdit className="text-base text-gray-600 " />
            </span>
          </div>
        )}
        {archivoSelected?.type != 'carpeta'
          ? (
          <>
            <div
              role="menuitem"
              className="w-[200px] relative flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none hover:bg-gray-200 focus:bg-gray-200 focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 pl-3"
              data-orientation="vertical"
              data-radix-collection-item=""
              onClick={() => {
                setDocumento(archivoSelected?.name)
                setOpen(true)
              }}
            >
              Ver
              <span className="ml-auto text-xs tracking-widest text-muted-foreground">
                <IoEyeSharp className="text-base text-gray-600" />
              </span>
            </div>
            <div
              role="menuitem"
              className="w-[200px] relative flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none hover:bg-gray-200 focus:bg-gray-200 focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 pl-3"
              data-orientation="vertical"
              data-radix-collection-item=""
              onClick={() => {
                deleteArchivo(archivoSelected?.id, archivoSelected?.name)
              }}
            >
              Eliminar
              <span className="ml-auto text-xs tracking-widest text-muted-foreground">
                <MdDelete className="text-base text-gray-600" />
              </span>
            </div>
          </>
            )
          : (
          <div
            role="menuitem"
            className="w-[200px] relative flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none hover:bg-gray-200 focus:bg-gray-200 focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 pl-3"
            data-orientation="vertical"
            data-radix-collection-item=""
            onClick={() => {
              deleteDocumento(archivoSelected?.id)
            }}
          >
            Eliminar
            <span className="ml-auto text-xs tracking-widest text-muted-foreground">
              <MdDelete className="text-base text-gray-600" />
            </span>
          </div>
            )}
      </Menu>}

      <ModalWord open={open} setOpen={setOpen} documento={documento}/>
    </>
  )
}
