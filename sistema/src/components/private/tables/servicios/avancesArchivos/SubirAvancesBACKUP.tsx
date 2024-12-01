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
    const data = new FormData()
    const file = event.target.files?.[0]
    if (file != undefined) {
      data.append('archivos_avances', file)
    }
    data.append('_method', 'PUT')

    try {
      const respuesta = await axios.post(
        `${Global.url}/uploadAvanceArchivo/${id ?? ''}`,
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
        getOneBrief()
      } else {
        setUpload('error')
        // Swal.fire('Error al agregar el registro', '', 'error');
        console.log('error')
      }
    } catch (error) {
      setUpload('error')
      console.log(error)
    }
    setCargando(false)
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
