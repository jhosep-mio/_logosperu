import { IoDocumentTextOutline, IoImageOutline } from 'react-icons/io5'
import { type arrayImagenes } from '../../../shared/schemas/Interfaces'
import { type Dispatch, type SetStateAction } from 'react'

interface values {
  arrayImagenes: arrayImagenes[]
  setArrayImagenes: Dispatch<SetStateAction<arrayImagenes[]>>
  arrayArchivos: arrayImagenes[]
  setArrayArchivos: Dispatch<SetStateAction<arrayImagenes[]>>
}

export const AgregarImagenes = ({ setArrayImagenes, setArrayArchivos }: values): JSX.Element => {
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault()
    const file = e.target.files?.[0]
    if (file) {
      setArrayImagenes((prevState) => [
        ...prevState,
        {
          id: Date.now(),
          imagen1: {
            archivo: file,
            archivoName: file.name
          }
        }
      ])
    }
    e.target.value = ''
  }

  const handleArchivoChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    e.preventDefault()
    const file = e.target.files?.[0]
    if (file) {
      setArrayArchivos((prevState) => [
        ...prevState,
        {
          id: Date.now(),
          imagen1: {
            archivo: file,
            archivoName: file.name
          }
        }
      ])
    }
    e.target.value = ''
  }

  return (
    <div className="w-full flex justify-between">
      <div className="relative">
        <button
          type="button"
          className="bg-red-500 text-white px-4 text-lg rounded-lg flex gap-3 items-center"
        >
          <IoImageOutline className="text-xl" />
          Adjuntar Imagenes
        </button>
        <input
          className="absolute inset-0 file:hidden opacity-0 cursor-pointer"
          type="file"
          accept="image/*"
          onChange={handleImageChange}
        />
      </div>
      <div className="relative">
        <button
          type="button"
          className="bg-green-700 text-white px-4 text-lg rounded-lg flex gap-3 items-center"
        >
          <IoDocumentTextOutline />
          Adjuntar archivos
        </button>
        <input
          className="absolute inset-0 file:hidden opacity-0 cursor-pointer"
          type="file"
          accept=".doc,.docx,.pdf,.zip"
          onChange={handleArchivoChange}
        />
      </div>
    </div>
  )
}
