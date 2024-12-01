import { Dialog, DialogContent } from '@mui/material'
import { type Dispatch, type SetStateAction, useState } from 'react'
import axios from 'axios'
import { useDropzone } from 'react-dropzone'
import imagenload from './../../../../../assets/images/cargaarchivo/cargarArchivo.svg'
import excel from './../../../../../assets/images/cargaarchivo/sobresalir.png'
import useAuth from '../../../../../hooks/useAuth'
import { FaWindowClose } from 'react-icons/fa'
import { Global } from '../../../../../helper/Global'
import { type ValuesPreventaModificate } from '../../../../shared/schemas/Interfaces'
import { getData2 } from '../../../../shared/FetchingData'

export const ModalCargarArchivo = ({
  open,
  setOpen,
  setProductos,
  setTotalRegistros
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  setProductos: Dispatch<SetStateAction<ValuesPreventaModificate[]>>
  setTotalRegistros: Dispatch<SetStateAction<number>>
}): JSX.Element => {
  const [file, setFile] = useState<File | null>(null)
  const { setShowError } = useAuth()
  const [loading, setLoading] = useState(false)

  const onDrop = (acceptedFiles: any): void => {
    const acceptedFile = acceptedFiles[0]
    if (
      acceptedFile.type === 'application/vnd.ms-excel' ||
      acceptedFile.type ===
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ) {
      setFile(acceptedFile)
    } else {
      setShowError({
        estado: 'warning',
        texto: 'Solo se aceptan archivos excel'
      })
    }
  }

  const onSubmit = async (): Promise<void> => {
    setLoading(true)
    const formData = new FormData()
    formData.append('archivo', file ?? '')
    const token = localStorage.getItem('token')
    try {
      const response = await axios.post(
        `${Global.url}/importarExcel`,
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
      if (response.data.mensaje == 'Datos importados correctamente') {
        setShowError({
          estado: 'success',
          texto: 'Archivos importados'
        })
        getData2('getPreClientes', setProductos, setTotalRegistros)
        setFile(null)
        setOpen(false)
      } else {
        setShowError({
          estado: 'error',
          texto: 'Error al importar datos'
        })
      }
    } catch (error) {
      setShowError({
        estado: 'error',
        texto: 'Error al importar datos'
      })
    }
    setLoading(false)
  }

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    accept: '.xls, .xlsx', // Aceptar solo archivos Excel
    maxFiles: 1 // Limitar a un solo archivo
  })

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false)
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description "
      className="dialog_fecha_inicio"
    >
      <DialogContent className="shadow-2xl shadow-slate-950 w-full bg-white overflow-hidden">
        <div {...getRootProps()} className="cursor-pointer">
          <input {...getInputProps()} />
          <p className="text-gray-700 w-full text-2xl text-center mb-6">
            Arrastra o haz clic para seleccionar un archivo
          </p>
          {file
            ? (
            <img
              src={excel}
              alt=""
              className="w-64 h-52 object-contain p-4 mx-auto my-10"
            />
              )
            : (
            <img
              src={imagenload}
              alt=""
              className="w-64 h-52 object-contain mx-auto my-10"
            />
              )}
        </div>
        {file && (
          <div className="flex gap-4 items-center justify-center">
            <p className="text-gray-700 mt-0 text-center">{file?.name}</p>
            <FaWindowClose
              className="text-red-600 hover:text-red-700 transition-colors cursor-pointer text-lg"
              onClick={() => {
                setFile(null)
              }}
            />
          </div>
        )}
        <div className="w-full flex justify-center mt-10">
            {!loading
              ? <button
              type='button'
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={onSubmit}
            className="mx-auto bg-green-600 hover:bg-green-700 transition-colors text-white rounded-md px-4 py-2 "
          >
            Importar archivo
          </button>
              : <button
                type='button'
                disabled
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                className="mx-auto bg-green-700 transition-colors text-white rounded-md px-4 py-2 "
        >
          Validando...
        </button>
          }
        </div>
      </DialogContent>
    </Dialog>
  )
}
