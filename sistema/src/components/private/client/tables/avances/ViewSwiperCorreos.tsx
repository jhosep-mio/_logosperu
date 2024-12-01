// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { type arrayCorreos } from '../../../../shared/schemas/Interfaces'

interface values {
  correos: arrayCorreos[]
}

export const ViewSwiperCorreos = ({ correos }: values): JSX.Element => {
  return (
    <Swiper
      className="swiper-correos w-full h-full"
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
      {correos?.filter((correo) => correo.id != null).map((correo) => (
        <SwiperSlide key={correo.id} className='w-full relative bg-gray-200 flex ga-2 px-2 py-1 rounded-xl items-center justify-between'>
          <span className='block w-full text-center'>{correo.correo}</span>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
