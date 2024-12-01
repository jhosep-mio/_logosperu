// Import Swiper React components
import 'swiper/css'
import 'swiper/css/navigation'
import { IoCloseCircle } from 'react-icons/io5'
import { type Dispatch, type SetStateAction } from 'react'
import { type arrayCorreos } from '../../../../shared/schemas/Interfaces'

interface values {
  correos: arrayCorreos[]
  setCorreos: Dispatch<SetStateAction<arrayCorreos[]>>
}

export const SwiperCorreos = ({ correos, setCorreos }: values): JSX.Element => {
  const eliminarArray = (id: number | null): void => {
    const nuevoArray = correos.filter((peso) => peso.id != id)
    setCorreos(nuevoArray)
  }
  return (
   <div className='w-full grid grid-cols1 md:grid-cols-2 gap-3 p-2'>
      {correos.filter((correo) => correo.id != null).map((correo) => (
        <div key={correo.id} className='w-full relative bg-gray-200 flex ga-2 px-2 py-1 items-center justify-between rounded-md'>
          <span className='block w-full text-center line-clamp-1'>{correo.correo}</span>
          <IoCloseCircle className='text-main/90 text-2xl cursor-pointer' onClick={() => { eliminarArray(correo.id) }}/>
        </div>
      ))}
   </div>
  )
}
