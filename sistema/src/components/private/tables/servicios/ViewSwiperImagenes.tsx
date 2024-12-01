import { type arrayImagenes } from '../../../shared/schemas/Interfaces'
import { RViewer, RViewerTrigger } from 'react-viewerjs'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { Global } from '../../../../helper/Global'

interface values {
  arrayImagenes: arrayImagenes[]
}
export const ViewSwiperImagenes = ({
  arrayImagenes
}: values): JSX.Element => {
  return (
    <>
      <Swiper
        className="swiper-correos w-full  mt-5"
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
            slidesPerView: 3
          }
        }}
      >
        {arrayImagenes.map((imagen: arrayImagenes) => (
          <SwiperSlide
            key={imagen.id}
            className="w-full relative bg-transparent flex ga-2  rounded-xl items-center justify-between group h-52"
          >
            {imagen.imagen1.archivo != null && (
              <RViewer
                imageUrls={`${Global.urlImages}/avances/${imagen.imagen1.archivoName}`}
              >
                <RViewerTrigger>
                  <img
                    src={`${Global.urlImages}/avances/${imagen.imagen1.archivoName}`}
                    className="w-full h-full md:m-auto object-cover cursor-pointer mx-auto"
                  />
                </RViewerTrigger>
              </RViewer>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}
