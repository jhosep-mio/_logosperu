/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/naming-convention */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
import axios from 'axios'
import useAuth from '../../../../hooks/useAuth'
import { useEffect, useState } from 'react'
import { Global } from '../../../../helper/Global'
import { Loading } from '../../../shared/Loading'
// @ts-expect-error
import { saveAs } from 'file-saver'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { toast } from 'sonner'
import { S3Client } from '@aws-sdk/client-s3'
import { Upload } from '@aws-sdk/lib-storage'

export const IndexBackupHosting = (): JSX.Element => {
  const { setTitle } = useAuth()
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(true)
  const [quotaInfo, setQuotaInfo] = useState({
    bytes_used: 0,
    byte_limit: 0,
    inodes_used: 0,
    inode_limit: 0
  })
  const [startDate, setStartDate] = useState<any | null>(null)
  const [endDate, setEndDate] = useState<any | null>(null)

  const formatBytes = (bytes: number, decimals = 2): any => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const dm = decimals < 0 ? 0 : decimals
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i]
  }

  const getInformation = async (): Promise<void> => {
    try {
      const request = await axios.get(`${Global.url}/getInformationHosting`, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      })
      const rawResponse = JSON.parse(request.data.raw_response)
      const { byte_limit, bytes_used, inode_limit, inodes_used }: any =
        rawResponse.data
      setQuotaInfo({ bytes_used, byte_limit, inodes_used, inode_limit })
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const handleDownload = async (): Promise<void> => {
    if (startDate && endDate) {
      setLoading(true)
      const formattedStartDate = startDate.toISOString().split('T')[0]
      const formattedEndDate = endDate.toISOString().split('T')[0]
      const data = new FormData()
      data.append('start_date', formattedStartDate)
      data.append('end_date', formattedEndDate)
      try {
        const response = await axios.post(
          `${Global.url}/downloadFilesBackups`,
          data,
          {
            responseType: 'blob', // Asegúrate de recibir el ZIP como un blob
            headers: {
              Authorization: `Bearer ${
                token !== null && token !== '' ? `Bearer ${token}` : ''
              }`
            }
          }
        )

        const zipBlob = new Blob([response.data], { type: 'application/zip' })
        const fileName = `BACKUP_${formattedStartDate}-${formattedEndDate}.zip`
        saveAs(zipBlob, fileName)
      } catch (error) {
        console.error('Error downloading files:', error)
      } finally {
        setLoading(false)
      }
    } else {
      toast.error('Es necesario seleccionar el rango de fechas')
    }
  }

  useEffect(() => {
    setTitle('Información de hosting')
    getInformation()
    // handleDownload()
  }, [])

  const storageUsedPercentage =
    (quotaInfo.bytes_used / quotaInfo.byte_limit) * 100
  const inodeUsedPercentage =
    (quotaInfo.inodes_used / quotaInfo.inode_limit) * 100

  /// AWS
  const [selectedFile, setSelectedFile] = useState(null)

  const s3Client = new S3Client({
    region: 'us-east-1', // Cambia por tu región
    credentials: {
      accessKeyId: 'AKIA6IY352FQDAGXL2D5', // Reemplaza con tu Access Key ID
      secretAccessKey: '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' // Reemplaza con tu Secret Access Key
    }
  })

  const handleFileChange = (event: any): any => {
    setSelectedFile(event.target.files[0])
  }

  const uploadFile = async (file: any): Promise<void> => {
    try {
      const upload = new Upload({
        client: s3Client,
        params: {
          Bucket: 'mysistemalogosperu', // Reemplaza con el nombre de tu bucket
          Key: file.name,
          Body: file,
          ContentType: 'multipart/form-data' // Tipo de contenido
        },
        partSize: 5 * 1024 * 1024, // 5 MB (ajusta si es necesario)
        leavePartsOnError: false
      })

      upload.on('httpUploadProgress', (progress) => {
        console.log(`Progreso: ${progress.loaded} / ${progress.total}`)
      })

      const result = await upload.done()
      console.log('Archivo subido con éxito:', result)
    } catch (err) {
      console.error('Error al subir el archivo:', err)
    }
  }

  const handleUpload = (): void => {
    if (selectedFile) {
      uploadFile(selectedFile)
    } else {
      alert('Selecciona un archivo antes de subir')
    }
  }

  return (
    <div className="min-h-screen py-6">
      <div className="">
        <h1 className="text-4xl font-bold mb-8 text-gray-800">A2 HOSTING</h1>
        {!loading ? (
          <>
            <div className="bg-white shadow-lg rounded-lg p-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-700">
                Información de Almacenamiento
              </h2>

              <div className="mb-6">
                <h3 className="text-xl font-medium text-gray-600">
                  Almacenamiento Utilizado:
                </h3>
                <p className="text-lg text-gray-800">
                  {formatBytes(quotaInfo.bytes_used)} de{' '}
                  {formatBytes(quotaInfo.byte_limit)}
                </p>
                <div className="w-full bg-gray-300 rounded-full h-4 mt-2">
                  <div
                    className="bg-blue-600 h-4 rounded-full"
                    style={{ width: `${storageUsedPercentage}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm text-gray-500">
                  {storageUsedPercentage.toFixed(2)}% utilizado
                </p>
              </div>

              {/* Inodos */}
              <div>
                <h3 className="text-xl font-medium text-gray-600">
                  Inodos Utilizados:
                </h3>
                <p className="text-lg text-gray-800">
                  {quotaInfo.inodes_used} de {quotaInfo.inode_limit}
                </p>
                <div className="w-full bg-gray-300 rounded-full h-4 mt-2">
                  <div
                    className="bg-green-600 h-4 rounded-full"
                    style={{ width: `${inodeUsedPercentage}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm text-gray-500">
                  {inodeUsedPercentage.toFixed(2)}% utilizado
                </p>
              </div>
            </div>
            <div className="bg-white shadow-lg rounded-lg p-8 mt-8">
              <h2 className="text-2xl font-semibold mb-6 text-gray-700">
                Información de backups
              </h2>
              <div className="text-black flex gap-3 flex-col">
                <div className="flex gap-4 items-center">
                  <label className="w-32">Fecha de inicio:</label>
                  <DatePicker
                    selected={startDate}
                    onChange={(date: any) => {
                      setStartDate(date)
                    }}
                    selectsStart
                    startDate={startDate}
                    endDate={endDate}
                    className="border border-gray-400 rounded-md py-2 px-2 flex-1"
                    placeholderText="Selecciona la fecha de inicio"
                  />
                </div>
                <div className="flex gap-4 items-center">
                  <label className="w-32">Fecha de fin:</label>
                  <DatePicker
                    selected={endDate}
                    onChange={(date: any) => {
                      setEndDate(date)
                    }}
                    selectsEnd
                    startDate={startDate}
                    endDate={endDate}
                    minDate={startDate} // Evita seleccionar una fecha de fin anterior a la de inicio
                    className="border border-gray-400 rounded-md py-2 px-2 flex-1"
                    placeholderText="Selecciona la fecha de fin"
                  />
                </div>
                <button
                  className="bg-main rounded-md w-fit px-4 py-2 text-black font-bold uppercase mt-4"
                  type="button"
                  onClick={async () => {
                    await handleDownload()
                  }}
                >
                  Descargar archivos
                </button>
              </div>
            </div>
          </>
        ) : (
          <Loading />
        )}
      </div>
      <div>
        <input type="file" onChange={handleFileChange} />
        <button onClick={handleUpload} className='bg-main'>Subir Archivo</button>
      </div>
    </div>
  )
}
