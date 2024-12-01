// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { type arrayCorreos } from '../../../shared/schemas/Interfaces'
import { IoCloseCircle } from 'react-icons/io5'
import { type Dispatch, type SetStateAction } from 'react'

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
    <Swiper
      className="swiper-correos w-full h-full overflow-hidden"
      spaceBetween={10}
      breakpoints={{
        0: {
          slidesPerView: 1
        },
        576: {
          slidesPerView: 2
        },
        768: {
          slidesPerView: 2
        },
        992: {
          slidesPerView: 2
        },
        1200: {
          slidesPerView: 2
        }
      }}
    >
      {correos.filter((correo) => correo.id != null).map((correo) => (
        <SwiperSlide key={correo.id} className='w-full relative bg-gray-200 flex ga-2 px-2 py-1 rounded-xl items-center justify-between'>
          <span className='block w-full text-center line-clamp-1'>{correo.correo}</span>
          <IoCloseCircle className='text-main/90 text-2xl cursor-pointer' onClick={() => { eliminarArray(correo.id) }}/>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
