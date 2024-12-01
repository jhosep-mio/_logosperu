/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable multiline-ternary */
import { useState, type MouseEvent, useEffect } from 'react'
import Menu from '@mui/material/Menu'
import { FiUpload } from 'react-icons/fi'
import { GoFileDirectory } from 'react-icons/go'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import Swal from 'sweetalert2'
import { BreadCrumps2 } from './BreadCrumps2'
import { Global } from '../../../../../helper/Global'
import { type documentosArchivesValues } from '../../../../shared/schemas/Interfaces'
import { useParams } from 'react-router-dom'
import { toast } from 'sonner'
import { Loading } from '../../../../shared/Loading'
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText
} from '@mui/material'
import { upload } from '../../../../shared/Images'
import { Button } from 'react-bootstrap'
import { ArrayArchivos } from './ArrayArchivos'

interface Folder {
  id: string
  name: string
}

export const IndexDocumentosFinales = ({
  datos,
  openFolder
}: any): JSX.Element => {
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const [contextMenu, setContextMenu] = useState<{
    mouseX: number
    mouseY: number
  } | null>(null)
  const token = localStorage.getItem('token')
  const [contextMenu2, setContextMenu2] = useState<{
    mouseX: number
    mouseY: number
  } | null>(null)
  const [arrayDocumentos, setArrayDocumentos] = useState<string[]>([])
  const [, setArrayImages] = useState<string[]>([])
  const [archivoSelected, setArchivoSelected] =
    useState<documentosArchivesValues | null>(null)
  const [currentPath, setCurrentPath] = useState<Folder[] | null>(null)
  const [folderName, setFolderName] = useState<string>('')
  const [openOptions, setOpenOptions] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uplo, setUpload] = useState('')
  const [loadingProgress, setLoadingProgress] = useState(false)

  const handleContextMenu = (event: MouseEvent): void => {
    event.preventDefault()
    setArchivoSelected(null)
    setContextMenu2(null)
    setContextMenu(
      contextMenu === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6
          }
        : null
    )
  }

  const getColaboradores = async (): Promise<void> => {
    try {
      const request = await axios.get(
        `${Global.url}/getArchivosProyectos/${id ?? ''}`,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      if (request.data.gestor_archivos) {
        setArrayDocumentos(JSON.parse(request.data.gestor_archivos))
      }
    } catch (error) {
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (openFolder) {
      getColaboradores()
    }
  }, [openFolder])

  const handleClose = (): void => {
    setContextMenu(null)
  }

  const createFolder = (event: React.MouseEvent): void => {
    event.preventDefault()
    const folderName = prompt('Ingrese el nombre de la carpeta:')
    if (folderName) {
      const newFolder = {
        id: uuidv4(),
        folder: currentPath ? currentPath[currentPath.length - 1]?.id : null,
        name: folderName,
        archives: null,
        creationDate: new Date(),
        type: 'carpeta',
        size: 0 // El tamaño de la carpeta se puede establecer en 0 o en cualquier otro valor predeterminado
      }
      const documentosToAdd: any = Array.isArray(arrayDocumentos)
        ? [...arrayDocumentos, newFolder]
        : [newFolder]
      setArrayDocumentos(documentosToAdd)
      updateCita(documentosToAdd, [])
    }
    setContextMenu(null)
  }

  const updateCita = async (
    updatedEvents: string[],
    ImagesToAdd: string[]
  ): Promise<void> => {
    setLoading(true)
    const data = new FormData()
    ImagesToAdd.forEach((image1, index1) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      if (image1.imagen1.archivo) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        data.append(`images1[${index1}]`, image1.imagen1.archivo)
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        data.append(`names1[${index1}]`, image1.imagen1.archivoName)
      }
    })
    data.append('gestor_archivos', JSON.stringify(updatedEvents))
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/archivosProyectos/${id ?? ''}`,
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
        toast.success('Evento actualizado')
        getColaboradores()
      } else {
        toast.error('Error')
      }
    } catch (error) {
      console.log(error)
      toast.error('Error')
    }
  }

  const handleContextMenu2 = (event: MouseEvent): void => {
    event.preventDefault()
    event.stopPropagation()
    handleClose()
    setContextMenu2(
      contextMenu2 === null
        ? {
            mouseX: event.clientX + 2,
            mouseY: event.clientY - 6
          }
        : null
    )
  }

  const deleteDocumento = (id: string | undefined): void => {
    const updatedDocumentos = arrayDocumentos.filter(
      (documento: any) => documento.id !== id
    )
    setArrayDocumentos(updatedDocumentos)
    updateCita(updatedDocumentos, [])
    setContextMenu(null)
    setContextMenu2(null)
  }

  const deleteArchivo = async (
    id: string | undefined,
    name: string | undefined
  ): Promise<void> => {
    const updatedDocumentos = arrayDocumentos.filter(
      (documento: any) => documento.id !== id
    )
    setArrayDocumentos(updatedDocumentos)
    updateCita(updatedDocumentos, [])
    setContextMenu(null)
    setContextMenu2(null)
    try {
      await axios.get(`${Global.url}/deleteArchivoGestor/${name ?? ''}`, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })
    } catch (error) {
      console.log(error)
      Swal.fire('Error', '', 'error')
    }
  }

  const handleFileUpload2 = (
    event: React.ChangeEvent<HTMLInputElement>
  ): void => {
    const uploadedFiles = event.target.files // Obtiene los archivos subidos
    if (uploadedFiles) {
      const filesArray = Array.from(uploadedFiles)
      const newFiles = filesArray.map((file) => {
        const uniqueFileName = `${uuidv4()}_${file.name}`
        return {
          id: uuidv4(),
          folder: currentPath ? currentPath[currentPath.length - 1]?.id : null,
          name: uniqueFileName,
          creationDate: new Date(), // Fecha de creación actual
          type: file.type,
          size: file.size,
          tipo: 'archivo',
          imagen1: {
            archivo: file,
            archivoName: uniqueFileName
          }
        }
      })

      const documentosToAdd = Array.isArray(arrayDocumentos)
        ? [...arrayDocumentos, ...newFiles]
        : [...newFiles]
      // @ts-expect-error
      setArrayImages((prevState) => [...prevState, ...newFiles])
      // @ts-expect-error
      setArrayDocumentos(documentosToAdd)
      updateCitaMultipleFiles(documentosToAdd, filesArray)
      setContextMenu(null)
    }
  }

  const updateCitaMultipleFiles = async (
    updatedEvents: any[],
    filesArray: File[]
  ): Promise<void> => {
    setLoadingProgress(true)
    const progressUpdates: Record<string, number> = {}
    const uploadStatusUpdates: Record<string, 'success' | 'error' | ''> = {}
    const uploadPromises = filesArray.map(async (file, index) => {
      const fileData = new FormData()
      fileData.append(`images1[${index}]`, file)
      // Utilizamos el nombre que ya fue generado y almacenado en updatedEvents
      const matchingFile = updatedEvents.find(
        (event: any) => event.imagen1?.archivo === file
      )
      if (matchingFile && matchingFile.imagen1) {
        const uniqueFileName = matchingFile.imagen1.archivoName
        fileData.append(`names1[${index}]`, uniqueFileName)
      }
      fileData.append('gestor_archivos', JSON.stringify(updatedEvents))
      fileData.append('_method', 'PUT')

      await axios
        .post(`${Global.url}/archivosProyectos/${id ?? ''}`, fileData, {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`,
            'Content-Type': 'multipart/form-data'
          },
          onUploadProgress: (progressEvent) => {
            console.log(progressEvent)
            const loaded = progressEvent.loaded ?? 0
            const total = progressEvent.total ?? 0
            const percentCompleted = total > 0 ? Math.round((loaded * 100) / total) : 0
            progressUpdates[file.name] = percentCompleted
            setProgress(percentCompleted)
          }
        })
        .then((response) => {
          if (response.data.status === 'success') {
            uploadStatusUpdates[file.name] = 'success'
            setUpload('success')
          } else {
            uploadStatusUpdates[file.name] = 'error'
            setUpload('error')
          }
        })
        .catch((error) => {
          console.error(error)
          uploadStatusUpdates[file.name] = 'error'
          setUpload('error')
        })
    })

    try {
      await Promise.all(uploadPromises)
      toast.success('Archivos subidos correctamente')
      getColaboradores()
    } catch (error) {
      console.log(error)
      toast.error('Error al subir archivos')
    } finally {
      setLoadingProgress(false)
    }
  }

  return (
    <div
      className="w-full h-full min-h-[150px] bg-white p-0 overflow-y-auto relative"
      onContextMenu={handleContextMenu}
      style={{ cursor: 'context-menu' }}
      onClick={() => {
        setArchivoSelected(null)
        setFolderName('')
      }}
    >
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="mt-0 mb-4 lg:mb-0 flex gap-3 justify-between">
            <BreadCrumps2
              currentPath={currentPath}
              setCurrentPath={setCurrentPath}
              marca={datos.nombre_marca ?? ''}
            />
            <div className="relative">
              <button
                type="button"
                onClick={() => {
                  setOpenOptions(!openOptions)
                }}
                className="bg-gray-200 rounded-md text-black px-2"
              >
                Opciones
              </button>
              {openOptions && (
                <div className="absolute z-[20] top-full w-[200px] right-0  mt-4 bg-gray-200 rounded-md ">
                  <div
                    role="menuitem"
                    className="w-full relative text-black flex items-center rounded-md px-2 py-1.5 text-sm outline-none hover:bg-gray-300 cursor-pointer focus:bg-gray-300 focus:text-accent-foreground   pl-3"
                    data-orientation="vertical"
                    data-radix-collection-item=""
                    onClick={() => {
                      setOpenModal(true)
                    }}
                  >
                    Subir Archivo
                    <span className="ml-auto text-xs tracking-widest text-muted-foreground">
                      <FiUpload className="text-base text-black" />
                    </span>
                  </div>
                  <div
                    role="menuitem"
                    className="w-full relative text-black flex items-center rounded-md px-2 py-1.5 text-sm outline-none hover:bg-gray-300 cursor-pointer focus:bg-gray-300 focus:text-accent-foreground   pl-3"
                    data-orientation="vertical"
                    data-radix-collection-item=""
                    onClick={createFolder}
                  >
                    Crear Carpeta
                    <span className="ml-auto text-xs tracking-widest text-muted-foreground">
                      <GoFileDirectory className="text-base text-black" />
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="mt-4 hidden lg:grid grid-cols-1 lg:grid-cols-5 gap-4 mb-2 lg:px-4 lg:py-2 text-gray-600 border-y border-gray-300 w-full ">
            <h5 className="md:text-left col-span-2">Archivo </h5>
            <h5 className="md:text-left">Fecha de creación</h5>
            <h5 className="md:text-left">Tipo</h5>
            <h5 className="md:text-left">Peso</h5>
          </div>
          <ArrayArchivos
            handleContextMenu2={handleContextMenu2}
            setContextMenu2={setContextMenu2}
            contextMenu2={contextMenu2}
            arrayDocumentos={arrayDocumentos}
            archivoSelected={archivoSelected}
            setArchivoSelected={setArchivoSelected}
            setArrayDocumentos={setArrayDocumentos}
            deleteDocumento={deleteDocumento}
            updateCita={updateCita}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            deleteArchivo={deleteArchivo}
            currentPath={currentPath}
            setCurrentPath={setCurrentPath}
            folderName={folderName}
            setFolderName={setFolderName}
          />
          <Menu
            open={contextMenu !== null}
            onClose={handleClose}
            anchorReference="anchorPosition"
            className="fondo_documentos"
            anchorPosition={
              contextMenu !== null
                ? { top: contextMenu.mouseY, left: contextMenu.mouseX }
                : undefined
            }
          >
            <div
              role="menuitem"
              className="w-[200px] relative flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none hover:bg-gray-200 focus:bg-gray-200 focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 pl-3"
              data-orientation="vertical"
              data-radix-collection-item=""
              onClick={() => {
                setOpenModal(true)
              }}
            >
              Subir Archivo
              <span className="ml-auto text-xs tracking-widest text-muted-foreground">
                <FiUpload className="text-base text-gray-600" />
              </span>
            </div>
            <div
              role="menuitem"
              className="w-[200px] relative flex cursor-default select-none items-center rounded-md px-2 py-1.5 text-sm outline-none hover:bg-gray-200 focus:bg-gray-200 focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 pl-3"
              data-orientation="vertical"
              data-radix-collection-item=""
              onClick={createFolder}
            >
              Crear Carpeta
              <span className="ml-auto text-xs tracking-widest text-muted-foreground">
                <GoFileDirectory className="text-base text-gray-600" />
              </span>
            </div>
          </Menu>
          <Dialog
            open={openModal}
            onClose={() => {
              setOpenModal(false)
            }}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
            className="modal_archivos_finales"
          >
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                <section className="w-full lg:w-96 min-h-[300px] flex flex-col justify-between">
                  <h1 className="bg-main w-full text-center text-white font-bold px-4 py-2 text-xl">
                    SUBIR ARCHIVO
                  </h1>
                  {!loadingProgress ? (
                    <div className="relative w-full md:w-[600px] lg:w-96 h-fit">
                      <input
                        className="w-full h-full absolute inset-0 opacity-0 cursor-pointer"
                        type="file"
                        accept="*"
                        multiple
                        // eslint-disable-next-line @typescript-eslint/no-misused-promises
                        onChange={handleFileUpload2}
                      />
                      <img
                        src={upload}
                        alt=""
                        className="object-contain w-full h-full"
                      />
                    </div>
                  ) : (
                    <section className="w-full md:w-[600px] lg:w-96 h-full flex justify-center items-center">
                      <div className="progressbar mx-auto">
                        <p>
                          <span>{progress}</span>%
                        </p>
                        <span
                          className="progressbar__up"
                          style={{ height: `${progress}%` }}
                        ></span>
                      </div>
                    </section>
                  )}
                  <div
                    className="px-4"
                    style={
                      uplo == 'success' || uplo == 'error'
                        ? { justifyContent: 'space-between' }
                        : { justifyContent: 'flex-end' }
                    }
                  >
                    {uplo == 'success' ? (
                      <p
                        style={{
                          color: 'green',
                          fontWeight: 'bold',
                          fontSize: '18px',
                          textAlign: 'center'
                        }}
                      >
                        Se subieron correctamente los archivos
                      </p>
                    ) : uplo == 'error' ? (
                      <p
                        style={{
                          color: 'red',
                          fontWeight: 'bold',
                          fontSize: '18px',
                          textAlign: 'center'
                        }}
                      >
                        Error al subir los archivos
                      </p>
                    ) : (
                      ''
                    )}
                  </div>
                </section>
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={() => {
                  setOpenModal(false)
                }}
              >
                CERRAR
              </Button>
            </DialogActions>
          </Dialog>
        </>
      )}
    </div>
  )
}
