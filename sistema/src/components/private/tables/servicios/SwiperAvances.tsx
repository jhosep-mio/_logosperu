// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/navigation'
import { Navigation } from 'swiper/modules'
import { type Dispatch, type SetStateAction } from 'react'
import {
  type FinalValues,
  type avanceValues
} from '../../../shared/schemas/Interfaces'

interface valuesDatos {
  nombres: string
  correo: string
  celular: string
  fecha: string
  hora_acta: string
}

export const SwiperAvances = ({
  arrayAvances,
  arrayFinal,
  setAvance,
  setFinal,
  setOpenFinal,
  datos,
  setOpen,
  setOpenActa,
  arrayActa,
  arrayAlta,
  setOpenAlta
}: {
  arrayAvances: never[]
  arrayFinal: never[]
  setAvance: Dispatch<SetStateAction<avanceValues>>
  setFinal: Dispatch<SetStateAction<FinalValues>>
  setOpenFinal: Dispatch<SetStateAction<boolean>>
  setOpen: Dispatch<SetStateAction<boolean>>
  setOpenActa: Dispatch<SetStateAction<boolean>>
  arrayActa: never[]
  datos: valuesDatos
  arrayAlta: any
  setOpenAlta: Dispatch<SetStateAction<boolean>>
}): JSX.Element => {
  const avancesReverse = [...arrayAvances].reverse()
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

     {arrayAlta && (
            <SwiperSlide
            className=""
            onClick={() => {
              setOpenAlta(true)
            }}
            >
            <div
                className="w-full h-[230px] bg-white p-4 px-6 border-2 shadowCard border-main/50 rounded-xl relative duration-300 transition-all ease-out group overflow-visible hover:border-main/70
                hover:shadow-md "
            >
                <div className="h-full flex justify-between flex-col gap-2 text-black ">
                <p className="text-base font-bold text-center">
                    {arrayAlta?.asunto}
                </p>
                <div className="w-full flex flex-col justify-center">
                    <p className="text-gray-400 w-full text-center">
                    {arrayAlta?.fecha}
                    </p>
                    <p className="text-gray-400 w-full text-center">
                    {arrayAlta?.hora}
                    </p>
                </div>
                </div>
                <button
                type="button"
                className="absolute -bottom-20 ease-out transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:-bottom-0 left-0 right-0 w-fit mx-auto rounded-lg bg-main/80 text-white px-4 py-2 hover:bg-main"
                onClick={() => {
                  setOpenAlta(true)
                }}
                >
                Ver más
                </button>
            </div>
            </SwiperSlide>
     )}
    {arrayActa.length > 0 && (
<SwiperSlide className="">
    <div
    className="w-full h-64 bg-form p-4 border-2 border-main rounded-xl relative duration-300 transition-all ease-out group overflow-visible hover:border-main
hover:shadow-md hover:shadow-main "
    >
    <div className="h-full flex justify-between flex-col gap-2 text-black ">
        <p className="text-base font-bold text-center">
        ACTA DE ACEPTACIÓN
        </p>
        <div className="w-full flex flex-col justify-center">
        <p className="text-gray-400 w-full text-center">
            {datos.hora_acta && JSON.parse(datos.hora_acta).fecha} <br />
            {datos.hora_acta && JSON.parse(datos.hora_acta).hora}
        </p>
        </div>
    </div>
    <button
        type="button"
        className="absolute -bottom-20 ease-out transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:-bottom-5 left-0 right-0 w-fit mx-auto rounded-lg bg-main/80 text-white px-4 py-2 hover:bg-main"
        onClick={() => {
        // setFinal(final)
          setOpenActa(true)
        }}
    >
        Ver más
    </button>
    </div>
</SwiperSlide>
    )}

      {arrayFinal.map((final: FinalValues, index: number) => (
        <SwiperSlide className="" key={index}>
          <div
            className="w-full h-[230px] cursor-pointer bg-white p-5 px-6 border-2 shadowCard border-main/50 rounded-xl relative duration-300 transition-all ease-out group overflow-visible hover:border-main/70 hover:shadow-md hover:shadow-main "
          >
            <div className="h-full flex justify-between flex-col gap-2 text-black ">
              <p className="text-base font-bold text-center">{final.asunto}</p>
              <div className="w-full flex flex-col justify-center">
                <p className="text-gray-400 w-full text-center">
                  {final.fecha}
                </p>
                <p className="text-gray-400 w-full text-center">{final.hora}</p>
              </div>
            </div>
            <button
              type="button"
              className="absolute -bottom-20 ease-out transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:-bottom-5 left-0 right-0 w-fit mx-auto rounded-lg bg-main/80 text-white px-4 py-2 hover:bg-main"
              onClick={() => {
                setFinal(final)
                setOpenFinal(true)
              }}
            >
              Ver más
            </button>
          </div>
        </SwiperSlide>
      ))}

      {avancesReverse.map((avance: avanceValues, index: number) => (
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
