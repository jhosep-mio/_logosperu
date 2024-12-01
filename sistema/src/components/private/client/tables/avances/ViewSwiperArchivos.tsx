// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { Global } from '../../../../../helper/Global'
import { pdf, zip } from '../../../../shared/Images'
import axios from 'axios'
import useAuth from '../../../../../hooks/useAuth'
import { type arrayImagenes } from '../../../../shared/schemas/Interfaces'

interface values {
  arrayImagenes: arrayImagenes[]
}
export const ViewSwiperArchivos = ({ arrayImagenes }: values): JSX.Element => {
  const token = localStorage.getItem('tokenUser')
  const { setDownloadProgress } = useAuth()
  const descargarArchivos = async (nombre: string): Promise<void> => {
    try {
      const response = await axios.get(
        `${Global.url}/descargarArchivos/${nombre ?? ''}`,
        {
          headers: {
            Authorization: `Bearer ${token ?? ''}`
          },
          onDownloadProgress: (e) => {
            const loaded = e.loaded
            const total = e.total
            if (total) {
              setDownloadProgress((loaded / total) * 100)
            }
          },
          responseType: 'blob'
        }
      )
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', nombre) // Asigna el nombre al archivo descargado
      document.body.appendChild(link)
      link.click()
      // Limpieza después de la descarga
      if (link.parentNode) {
        link.parentNode.removeChild(link)
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      // Manejar el error aquí, por ejemplo:
      console.error('Error al descargar archivos:', error)
      // Puedes agregar lógica adicional para manejar el error según tus necesidades
    }
  }

  const descargarActaAceptacion = async (nombre: string): Promise<void> => {
    try {
      const nombrecompleto = `${nombre}.pdf`
      const response = await axios.get(
          `${Global.url}/descargarArchivosActa/${nombrecompleto ?? ''}`,
          {
            headers: {
              Authorization: `Bearer ${token ?? ''}`
            },
            onDownloadProgress: (e) => {
              const loaded = e.loaded
              const total = e.total
              if (total) {
                setDownloadProgress((loaded / total) * 100)
              }
            },
            responseType: 'blob'
          }
      )
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', nombrecompleto) // Asigna el nombre al archivo descargado
      document.body.appendChild(link)
      link.click()

      // Limpieza después de la descarga
      if (link.parentNode) {
        link.parentNode.removeChild(link)
        window.URL.revokeObjectURL(url)
      }
    } catch (error) {
      console.log(error)
    } finally {
      setDownloadProgress(0)
    }
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
            <>
           {
           // eslint-disable-next-line @typescript-eslint/ban-ts-comment
           // @ts-expect-error
           imagen.imagen1.archivo == 'acta_aceptacion'
             ? <SwiperSlide
            key={imagen.id}
            className="w-full relative bg-transparent flex ga-2  rounded-xl items-center justify-between group h-20"
          >
            {imagen.imagen1.archivo != null && (
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              <div className="relative group cursor-pointer" onClick={
                async () => { await descargarActaAceptacion(imagen.imagen1.archivoName) }}>
                <img
                  src={pdf}
                  className="w-20 h-20 md:m-auto object-contain cursor-pointer mx-auto group-hover:opacity-0 transition-opacity"
                />
                <p className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 w-full h-20 flex items-center justify-center text-center text-black font-bold">
                  Descargar
                </p>
              </div>
            )}
          </SwiperSlide>
             : <SwiperSlide
            key={imagen.id}
            className="w-full relative bg-transparent flex ga-2  rounded-xl items-center justify-between group h-20"
          >
            {imagen.imagen1.archivo != null && (
              // eslint-disable-next-line @typescript-eslint/no-misused-promises
              <div className="relative group cursor-pointer" onClick={
                async () => { await descargarArchivos(imagen.imagen1.archivoName) }}>
                <img
                  src={zip}
                  className="w-20 h-20 md:m-auto object-contain cursor-pointer mx-auto group-hover:opacity-0 transition-opacity"
                />
                <p className="opacity-0 group-hover:opacity-100 transition-opacity absolute inset-0 w-full h-20 flex items-center justify-center text-center text-black font-bold">
                  Descargar
                </p>
              </div>
            )}
          </SwiperSlide>}
            </>

        ))}
      </Swiper>
    </>
  )
}
