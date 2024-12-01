/* eslint-disable @typescript-eslint/restrict-template-expressions */
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import {
  type Dispatch,
  type SetStateAction,
  useState,
  type ChangeEvent
} from 'react'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import { upload } from '../../../../shared/Images'
import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'
import { toast } from 'sonner'

interface values {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  id: string | undefined
  getOneBrief: any
}

export const SubirAvances = ({
  open,
  setOpen,
  id,
  getOneBrief
}: values): JSX.Element => {
  const [progress, setProgress] = useState(0)
  const handleClose = (): void => {
    setOpen(false)
  }
  const [cargando, setCargando] = useState(false)
  const [uplo, setUpload] = useState('')

  const handleSubirInformes = async (
    event: ChangeEvent<HTMLInputElement>
  ): Promise<void> => {
    event.preventDefault()
    setCargando(true)
    setUpload('')
    const token = localStorage.getItem('token')
    const file = event.target.files?.[0]
    if (!file) {
      setCargando(false)
      return
    }
    const formData = new FormData()
    formData.append('file_name', file.name)

    try {
      const { data } = await axios.post(
        `${Global.url}/generateAuthAvance/${id ?? ''}`,
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
          Key: `archivos_avances/${data.key}`,
          Body: file,
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
        const response = await axios.post(
          `${Global.url}/uploadNameAvances/${id}`,
          {
            fileName: data.key,
            _method: 'PUT'
          },
          {
            headers: {
              Authorization: `Bearer ${
                token !== null && token !== '' ? token : ''
              }`,
              'Content-Type': 'multipart/form-data'
            }
          }
        )
        if (response.data.status !== 'success') {
          setUpload('error')
        } else {
          setUpload('success')
          getOneBrief()
        }
      }
    } catch (error: any) {
      if (
        error?.request?.response &&
        JSON.parse(error.request.response).error ==
          'El nombre de la marca es requerido.'
      ) {
        toast.warning('El nombre de la marca es requerido')
      }
      setUpload('error')
      console.log(error)
    } finally {
      setCargando(false)
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
              SUBIR AVANCE
            </h1>
            {!cargando
              ? <div className="relative w-full md:w-[600px] lg:w-96 h-fit">
                  <input
                    className="w-full h-full absolute inset-0 opacity-0 cursor-pointer"
                    type="file"
                    accept="*"
                    // eslint-disable-next-line @typescript-eslint/no-misused-promises
                    onChange={handleSubirInformes}
                  />
                  <img
                    src={upload}
                    alt=""
                    className="object-contain w-full h-full"
                  />
                </div>
              : (
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
