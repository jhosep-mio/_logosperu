/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import { type Dispatch, type SetStateAction, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { Global } from '../../../../../../helper/Global'
import { upload } from '../../../../../shared/Images'
import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'

interface values {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  guardarArchivo: any
}

export const SubirArchivo = ({
  open,
  setOpen,
  guardarArchivo
}: values): JSX.Element => {
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
      const token = localStorage.getItem('token')
      try {
        const formData = new FormData()
        formData.append('file_name', archivoConID.nombre)
        const { data } = await axios.post(
          `${Global.url}/generateGeneral`,
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
        const upload = new Upload({
          client: s3Client,
          params: {
            Bucket: data.bucket,
            Key: `gestorArchivos/${archivoConID.nombre}`,
            Body: archivo,
            ContentType: 'multipart/form-data'
          },
          leavePartsOnError: false
        })
        upload.on('httpUploadProgress', (progress: any) => {
          const progressPercentage = Math.round(
            (progress.loaded * 100) / progress.total
          )
          setProgress(progressPercentage)
        })
        const result = await upload.done()
        if (result) {
          setUpload('success')
          guardarArchivo(archivoConID)
        } else {
          setUpload('error')
        }
      } catch (error) {
        setUpload('error')
        console.log(error)
      } finally {
        setCargando(false)
      }
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
        <Button onClick={handleClose}>CERRAR</Button>
      </DialogActions>
    </Dialog>
  )
}
