// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
import { format } from 'date-fns'
import { type avanceValues } from '../../../../shared/schemas/Interfaces'

export const SwiperAvances = ({
  antecedentes,
  setOpenAntecedemte,
  arrayObsequios,
  setAvance,
  setOpen,
  arrayAvances
}: {
  antecedentes: any
  setOpenAntecedemte: any
  arrayObsequios: any
  setAvance: any
  setOpen: any
  arrayAvances: any
}): JSX.Element => {
  const obsequiosReverse = [...arrayObsequios].reverse()
  const arrayAvancesReverse = [...arrayAvances].reverse()

  return (
    <Swiper
      navigation={true}
      modules={[Navigation]}
      className="mySwiper"
      spaceBetween={30}
      breakpoints={{
        0: {
          slidesPerView: 1
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
      {antecedentes.map((avance: any, index: number) => (
        <SwiperSlide
          className=""
          key={index}
          onClick={() => {
            setOpenAntecedemte({ estado: true, antecedente: avance })
          }}
        >
          <div className="w-full h-[230px] cursor-pointer bg-white p-5 px-6 shadowCard border-2 border-[#cecece] rounded-xl relative duration-300 transition-all ease-out group overflow-visible hover:border-main/70">
            <div className="h-full flex justify-between flex-col gap-2 text-black ">
              <p className=" font-bold text-center text-[#353535] text-base">
                ANTECEDENTE {antecedentes.length - index}
              </p>
              <div className="w-full flex flex-col justify-center ">
                <p className="text-gray-500 w-full text-center">
                  {format(avance.created_at, 'dd/MM/yyyy')}
                </p>
                <p className="text-gray-500 w-full text-center">
                  {format(avance.created_at, 'HH:mm')}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="absolute -bottom-20 ease-out transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:-bottom-5 left-0 right-0 w-fit mx-auto rounded-lg bg-main/80 text-white px-4 py-2 hover:bg-main"
              onClick={() => {
                setOpenAntecedemte({ estado: true, antecedente: avance })
              }}
            >
              Ver más
            </button>
          </div>
        </SwiperSlide>
      ))}
      {obsequiosReverse.map((avance: avanceValues, index: number) => (
        <SwiperSlide
          className=""
          key={index}
          onClick={() => {
            setAvance(avance)
            setOpen(true)
          }}
        >
          <div className="w-full h-[230px] cursor-pointer bg-white p-5 px-6 shadowCard border-2 border-[#cecece] rounded-xl relative duration-300 transition-all ease-out group overflow-visible hover:border-main/70">
            <div className="h-full flex justify-between flex-col gap-2 text-black ">
              <p className=" font-bold text-center text-[#353535] text-base">
                {avance.asunto}
              </p>
              <div className="w-full flex flex-col justify-center ">
                <p className="text-gray-500 w-full text-center">
                  {avance.fecha}
                </p>
                <p className="text-gray-500 w-full text-center">
                  {avance.hora}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="absolute -bottom-20 ease-out transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:-bottom-5 left-0 right-0 w-fit mx-auto rounded-lg bg-main/80 text-white px-4 py-2 hover:bg-main"
              onClick={() => {
                setAvance(avance)
                setOpen(true)
              }}
            >
              Ver más
            </button>
          </div>
        </SwiperSlide>
      ))}
      {arrayAvancesReverse.map((avance: avanceValues, index: number) => (
        <SwiperSlide
          className=""
          key={index}
          onClick={() => {
            setAvance(avance)
            setOpen(true)
          }}
        >
          <div className="w-full h-[230px] cursor-pointer bg-white p-5 px-6 shadowCard border-2 border-[#cecece] rounded-xl relative duration-300 transition-all ease-out group overflow-visible hover:border-main/70">
            <div className="h-full flex justify-between flex-col gap-2 text-black ">
              <p className=" font-bold text-center text-[#353535] text-base">
                {avance.asunto}
              </p>
              <div className="w-full flex flex-col justify-center ">
                <p className="text-gray-500 w-full text-center">
                  {avance.fecha}
                </p>
                <p className="text-gray-500 w-full text-center">
                  {avance.hora}
                </p>
              </div>
            </div>
            <button
              type="button"
              className="absolute -bottom-20 ease-out transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:-bottom-5 left-0 right-0 w-fit mx-auto rounded-lg bg-main/80 text-white px-4 py-2 hover:bg-main"
              onClick={() => {
                setAvance(avance)
                setOpen(true)
              }}
            >
              Ver más
            </button>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}
