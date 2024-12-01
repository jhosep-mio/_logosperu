/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import {
  type Dispatch,
  type SetStateAction,
  useState
} from 'react'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { Global } from '../../../../../../helper/Global'
import { upload } from '../../../../../shared/Images'

interface values {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  setArchivosSubidos: any
  archivosSubidos: any
  guardarArchivo: any
}

export const SubirArchivo = ({ open, setOpen, setArchivosSubidos, archivosSubidos, guardarArchivo }: values): JSX.Element => {
  const [progress, setProgress] = useState(0)
  const handleClose = (): void => {
    setOpen(false)
    setUpload('')
  }
  const [cargando, setCargando] = useState(false)
  const [uplo, setUpload] = useState('')

  const handleSubirArchivo = async (
    evento: React.ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    setCargando(true)
    const archivosSeleccionados = evento.target.files // Obtener la lista de archivos seleccionados
    if (archivosSeleccionados && archivosSeleccionados.length > 0) {
      const archivo = archivosSeleccionados[0] // Tomar el primer archivo de la lista
      const idUnico = uuidv4()
      const archivoConID = {
        id: idUnico,
        nombre: `${idUnico}_${archivo.name}`,
        tamaño: archivo.size
      }
      const archivosActualizados = [...archivosSubidos, archivoConID]
      setArchivosSubidos(archivosActualizados)
      const token = localStorage.getItem('token')
      const data = new FormData()
      data.append('archivos_avances', archivo)
      data.append('nombre', archivoConID.nombre)
      try {
        const respuesta = await axios.post(
          `${Global.url}/guardarArchivoGestor`,
          data,
          {
            onUploadProgress: (progressEvent) => {
              if (progressEvent.total != undefined) {
                const progressPercentage = Math.round(
                  (progressEvent.loaded * 100) / progressEvent.total
                )
                setProgress(progressPercentage)
              }
            },
            headers: {
              Authorization: `Bearer ${
                token !== null && token !== '' ? token : ''
              }`
            }
          }
        )
        if (respuesta.data.status == 'success') {
          setUpload('success')
        } else {
          setUpload('error')
          console.log('error')
        }
      } catch (error) {
        setUpload('error')
        console.log(error)
      } finally {
        setCargando(false)
      }
      guardarArchivo(archivosActualizados)
    }
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
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
            {!cargando ? (
              <div className="relative w-full md:w-[600px] lg:w-96 h-fit">
                <input
                  className="w-full h-full absolute inset-0 opacity-0 cursor-pointer"
                  type="file"
                  accept="*"
                  // eslint-disable-next-line @typescript-eslint/no-misused-promises
                  onChange={handleSubirArchivo}
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
              {uplo == 'success'
                ? (
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
                  )
                : uplo == 'error'
                  ? (
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
                    )
                  : (
                      ''
                    )}
            </div>
          </section>
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>CERRAR</Button>
      </DialogActions>
    </Dialog>
  )
}
