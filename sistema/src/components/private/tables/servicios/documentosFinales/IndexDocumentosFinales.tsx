/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable multiline-ternary */
import { useState, type MouseEvent, useEffect } from 'react'
import axios from 'axios'
import { BreadCrumps2 } from './BreadCrumps2'
import { Global } from '../../../../../helper/Global'
import { type documentosArchivesValues } from '../../../../shared/schemas/Interfaces'
import { useParams } from 'react-router-dom'
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
  const [, setArchivoSelected] =
    useState<documentosArchivesValues | null>(null)
  const [currentPath, setCurrentPath] = useState<Folder[] | null>(null)
  const [folderName, setFolderName] = useState<string>('')
  const [openOptions, setOpenOptions] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [progress] = useState(0)
  const [uplo] = useState('')
  const [loadingProgress] = useState(false)

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
              {/* {openOptions && (
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
              )} */}
            </div>
          </div>
          <div className="mt-4 hidden lg:grid grid-cols-1 lg:grid-cols-5 gap-4 mb-2 lg:px-4 lg:py-2 text-gray-600 border-y border-gray-300 w-full ">
            <h5 className="md:text-left col-span-2">Archivo </h5>
            <h5 className="md:text-left">Fecha de creación</h5>
            <h5 className="md:text-left">Tipo</h5>
            <h5 className="md:text-left">Peso</h5>
          </div>
          <ArrayArchivos
            arrayDocumentos={arrayDocumentos}
            setArchivoSelected={setArchivoSelected}
            setContextMenu2={setContextMenu2}
            contextMenu2={contextMenu2}
            setArrayDocumentos={setArrayDocumentos}
            currentPath={currentPath}
            setCurrentPath={setCurrentPath}
            folderName={folderName}
            setFolderName={setFolderName}
            handleContextMenu2={handleContextMenu2}
          />
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
                        // onChange={handleFileUpload2}
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
