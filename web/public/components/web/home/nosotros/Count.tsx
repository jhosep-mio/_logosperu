'use client'
import CountUp from 'react-countup'
import { InView } from 'react-intersection-observer'

export const Count = () => {
  return (
    <div className="w-full xl:w-1/3 xl:ml-32 px-0  xl:px-6 ">
      <div className="flex flex-col min-w-full  lg:min-w-[430px] bg-[#001734] xl:rounded-b-full px-12 w-full xl:w-fit relative z-10 before:-z-10 before:absolute before:w-full before:h-[60%] before:bg-azul_serio before:rounded-b-full before:top-0 before:left-0">
      <div className="flex flex-col lg:flex-row xl:flex-col gap-2 py-10 lg:py-32">
        <div className="px-8 py-4 pt-0 flex flex-col items-center justify-center">
          <span className="flex text-gris text-6xl">
            +
            <InView>
              {({ inView, ref }) => (
                <div ref={ref}>{inView && <CountUp end={14} />} </div>
              )}
            </InView>
          </span>
          <p className="text-gris text-2xl text-center">AÑOS DE EXPERIENCIA</p>
        </div>
        <div className="px-8 py-4 flex flex-col items-center justify-center">
          <span className="flex text-gris text-6xl">
            +
            <InView>
              {({ inView, ref }) => (
                <div ref={ref}>{inView && <CountUp end={2500} />} </div>
              )}
            </InView>
          </span>
          <p className="text-gris text-2xl">PROYECTOS</p>
          <p className="text-gris text-2xl">REALIZADOS</p>
        </div>
        <div className="px-8 py-4 flex flex-col items-center justify-center">
          <span className="flex text-gris text-6xl">
            +
            <InView>
              {({ inView, ref }) => (
                <div ref={ref}>{inView && <CountUp end={2000} />} </div>
              )}
            </InView>
          </span>
          <p className="text-gris text-2xl text-center ">CLIENTES</p>
          <p className="text-gris text-2xl text-center">SATISFECHOS</p>
        </div>
      </div>
    </div>
    </div>
  )
}
