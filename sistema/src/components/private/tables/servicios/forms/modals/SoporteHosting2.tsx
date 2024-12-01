import { BiSupport } from 'react-icons/bi'
import { IoEyeSharp } from 'react-icons/io5'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules'
import { cn } from '../../../../../shared/cn'

export const SoporteHosting2 = ({ datos2, setOpenVista }: any): JSX.Element => {
  return (
    <div className="flex flex-col justify-center w-full mt-10">
      <h2 className="text-xl lg:text-2xl font-bold mb-4 lowercase first-letter:uppercase text-black">
        SOPORTE TECNICO
      </h2>
      <Swiper
        pagination={{
          dynamicBullets: true
        }}
        modules={[Pagination]}
        className="mySwiperHosting w-full justify-center"
        spaceBetween={30}
        breakpoints={{
          0: {
            slidesPerView: 2
          },
          576: {
            slidesPerView: 2
          },
          768: {
            slidesPerView: 3
          },
          992: {
            slidesPerView: 4
          },
          1200: {
            slidesPerView: 5
          }
        }}
      >
        {datos2.map((soporte: any) => (
          <SwiperSlide
            className="flex items-center shadow_class_cita cursor-pointer group px-3 py-2 rounded-md gap-x-3 justify-between hover:bg-gray-100 transition-colors"
            key={soporte.id}
            onClick={() => {
              setOpenVista({ estado: true, datos: soporte })
            }}
          >
            <div className="flex items-center gap-x-3">
              <button
                type="button"
                className={cn(
                  'shadow rounded-full p-[0.4rem] flex items-center border border-main justify-center text-main hover:scale-105 transition-all bg-main '
                )}
              >
                <BiSupport className="text-3xl text-white" />
              </button>
              <div className="flex flex-col">
                <p className="text-[#202020] text-sm line-clamp-1">
                  {soporte?.horas} min
                </p>
                <p className="text-[#202020] text-xs line-clamp-1">{soporte?.fecha ?? ''}</p>
              </div>
            </div>
            <IoEyeSharp className="group-hover:text-main transition-colors" />
          </SwiperSlide>
        ))}
      </Swiper>
    </div>
  )
}
