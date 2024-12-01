import { type arrayImagenes } from '../../../shared/schemas/Interfaces'
import { type Dispatch, type SetStateAction } from 'react'
// import { RiDeleteBin6Line } from 'react-icons/ri'
import { RViewer, RViewerTrigger } from 'react-viewerjs'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { IoClose } from 'react-icons/io5'
import { zip } from '../../../shared/Images'

interface values {
  arrayImagenes: arrayImagenes[]
  arrayArchivos: arrayImagenes[]
  setArrayImagenes: Dispatch<SetStateAction<arrayImagenes[]>>
  setArrayArchivos: Dispatch<SetStateAction<arrayImagenes[]>>
}
export const SwiperImagenes = ({
  arrayImagenes,
  setArrayImagenes,
  arrayArchivos,
  setArrayArchivos
}: values): JSX.Element => {
  const eliminarImagen = (id: number | null): void => {
    const nuevoArray = arrayImagenes.filter((peso) => peso.id !== id)
    setArrayImagenes(nuevoArray)
  }

  const eliminarArchivo = (id: number | null): void => {
    const nuevoArray = arrayArchivos.filter((peso) => peso.id !== id)
    setArrayArchivos(nuevoArray)
  }
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
            className="w-full relative bg-transparent flex ga-2 rounded-xl items-center justify-between group h-40"
          >
            {imagen.imagen1.archivo != null && (
              <RViewer
                imageUrls={`${URL.createObjectURL(imagen.imagen1.archivo)}`}
              >
                <RViewerTrigger>
                  <img
                    src={`${URL.createObjectURL(imagen.imagen1.archivo)}`}
                    className="w-full h-full md:m-auto object-cover cursor-pointer mx-auto"
                  />
                </RViewerTrigger>
              </RViewer>
            )}
            <IoClose
              className="absolute right-0 top-0 z-10 text-white text-3xl bg-red-600 opacity-0 cursor-pointer group-hover:opacity-100 transition-opacity duration-500"
              onClick={() => {
                eliminarImagen(imagen.id)
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
      {arrayImagenes.length > 0 && arrayArchivos &&
      <hr className='my-6 h-3 border-t-4'/>
      }
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
        {arrayArchivos.map((imagen: arrayImagenes) => (
          <SwiperSlide
            key={imagen.id}
            className="w-fit relative bg-transparent flex ga-2 rounded-xl items-center justify-between group"
          >
            {imagen.imagen1.archivo != null && (
              <div className="w-full flex flex-col gap-2">
                <img
                  src={zip}
                  className="w-20 h-20 md:m-auto object-contain cursor-pointer mx-auto"
                />
                <p className='text-xs text-center'>{imagen.imagen1.archivoName}</p>
              </div>
            )}
            <IoClose
              className="absolute right-0 top-0 z-10 text-white text-3xl bg-red-600 opacity-0 cursor-pointer group-hover:opacity-100 transition-opacity duration-500"
              onClick={() => {
                eliminarArchivo(imagen.id)
              }}
            />
          </SwiperSlide>
        ))}
      </Swiper>
    </>
  )
}
