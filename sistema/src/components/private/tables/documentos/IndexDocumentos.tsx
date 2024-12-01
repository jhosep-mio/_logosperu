import useAuth from '../../../../hooks/useAuth'
import { useEffect, useState, type MouseEvent } from 'react'
import Menu from '@mui/material/Menu'
import { FiUpload } from 'react-icons/fi'
import { GoFileDirectory } from 'react-icons/go'
import { v4 as uuidv4 } from 'uuid'
import { ArrayArchivos } from './componets/ArrayArchivos'
import axios from 'axios'
import Swal from 'sweetalert2'
import { type documentosArchivesValues } from '../../../shared/schemas/Interfaces'
import { Global } from '../../../../helper/Global'
import { BreadCrumps } from './componets/BreadCrumps'

interface Folder {
  id: string
  name: string
}

export const IndexDocumentos = (): JSX.Element => {
  const { setTitle, setShowError } = useAuth()
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
  const [arrayImages, setArrayImages] = useState<string[]>([])
  const [archivoSelected, setArchivoSelected] =
    useState<documentosArchivesValues | null>(null)
  const [currentPath, setCurrentPath] = useState<Folder[] | null>(null)
  const [folderName, setFolderName] = useState<string>('')
  const { auth } = useAuth()
  const [openOptions, setOpenOptions] = useState(false)

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

  const handleClose = (): void => {
    setContextMenu(null)
  }

  const getColaboradores = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/indexGestorArchivo`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    // setContextMenu(request.data)
    setArrayDocumentos(JSON.parse(request.data[0].gestor_archivos))
  }

  useEffect(() => {
    setTitle('Documentos')
    getColaboradores()
  }, [])

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

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ): any => {
    const uploadedFiles = event.target.files // Obtiene los archivos subidos
    if (uploadedFiles) {
      const filesArray = Array.from(uploadedFiles)
      const uniqueFileName = uuidv4()
      const newFiles = filesArray.map((file) => ({
        id: uuidv4(),
        folder: currentPath ? currentPath[currentPath.length - 1]?.id : null,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        name: `${uniqueFileName}_${file.name}`,
        creationDate: new Date(), // Fecha de creación actual
        type: file.type,
        size: file.size,
        tipo: 'archivo',
        imagen1: {
          archivo: file,
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          archivoName: `${uniqueFileName}_${file.name}`
        }
      }))
      const documentosToAdd: any = Array.isArray(arrayDocumentos)
        ? [...arrayDocumentos, ...newFiles]
        : [...newFiles]
      const ImagesToAdd: any = Array.isArray(arrayImages)
        ? [...arrayImages, ...newFiles]
        : [...newFiles]

      setArrayImages((prevState: any) => [...prevState, ...newFiles])
      setArrayDocumentos(documentosToAdd)
      updateCita(documentosToAdd, ImagesToAdd)
      setContextMenu(null)
    }
  }

  const updateCita = async (
    updatedEvents: string[],
    ImagesToAdd: string[]
  ): Promise<void> => {
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
        `${Global.url}/updateGestorArchivos/1`,
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
        setShowError({
          estado: 'success',
          texto: 'Evento actualizado'
        })
      } else {
        Swal.fire('Error al actualizar', '', 'error')
      }
    } catch (error) {
      console.log(error)
      Swal.fire('Error', '', 'error')
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
      await axios.get(
        `${Global.url}/deleteArchivoGestor/${name ?? ''}`,
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
      Swal.fire('Error', '', 'error')
    }
  }

  return (
    <div
      className="w-full h-full bg-white p-4 overflow-y-auto"
      onContextMenu={handleContextMenu}
      style={{ cursor: 'context-menu' }}
      onClick={() => {
        setArchivoSelected(null)
        setFolderName('')
      }}
    >
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-black">
            Bienvenido de nuevo!
          </h2>
          <p className="text-muted-foreground text-gray-500">
            Documentos del sistema
          </p>
        </div>
      </div>

      <div className="mt-3 mb-4 lg:mb-0 flex gap-3 justify-between">
        <BreadCrumps
          currentPath={currentPath}
          setCurrentPath={setCurrentPath}
        />
        {auth.id_rol == 99 &&
            <div className="relative">
            <button
                type='button'
                onClick={() => { setOpenOptions(!openOptions) }}
                className="bg-gray-200 rounded-md text-black px-2"
            >
                Opciones
            </button>
                {openOptions &&
                    <div className='absolute z-[20] top-full w-[200px] right-0  mt-4 bg-gray-200 rounded-md '>
                        <div
                        role="menuitem"
                        className="w-full relative text-black flex items-center rounded-md px-2 py-1.5 text-sm outline-none hover:bg-gray-300 cursor-pointer focus:bg-gray-300 focus:text-accent-foreground   pl-3"
                        data-orientation="vertical"
                        data-radix-collection-item=""
                        >
                        <input
                            type="file"
                            name=""
                            id=""
                            className="w-full h-full absolute cursor-pointer inset-0 file:hidden opacity-0"
                            onChange={handleFileUpload}
                        />
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
                }
            </div>
        }
      </div>

      <div className="mt-4 hidden lg:grid grid-cols-1 lg:grid-cols-5 gap-4 mb-2 lg:px-4 lg:py-2 text-gray-600 border border-gray-300 w-full rounded-lg">
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
      {auth.id_rol == 99 && (
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
          >
            <input
              type="file"
              name=""
              id=""
              className="w-full h-full absolute inset-0 file:hidden opacity-0"
              onChange={handleFileUpload}
            />
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
      )}
    </div>
  )
}
