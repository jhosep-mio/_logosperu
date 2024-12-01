/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'
import Link from 'next/link'

export const TextoMarca = () => {
  return (
    <section className="absolute h-full top-0 right-0 left-0 lg:inset-0 flex flex-col xl:flex-row gap-0 lg:items-center max-w-[2000px] mx-auto">
      <div className="w-full xl:w-[50%] 2xl:w-[37%] my-auto justify-center flex flex-col lg:gap-5 overflow-hidden items-center px-5 md:px-16 text-white">
        <motion.h2
          initial={{ opacity: 0, transform: 'translateX(-50%)' }}
          whileInView={{ opacity: 1, transform: 'translateX(0%)' }}
          transition={{ duration: 0.3 }}
          className="w-full  font_Archivo_bold text-[1.5rem] lg:text-[2.5rem] 2xl:text-[2.5rem] block text-center uppercase text-white"
        >
          Más sobre la marca
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, transform: 'translateX(-50%)' }}
          whileInView={{ opacity: 1, transform: 'translateX(0%)' }}
          transition={{ duration: 0.5 }}
          className="w-full font_Archivo_bold mt-4 lg:mt-0 text-base lg:text-[2vh] 2xl:text-[1.5rem] leading-[2.5vh] lg:leading-[3vh] 2xl:leading-[2rem] text-justify text-white"
        >
          En Radiología Dental, cada estudio radiológico se complementa con servicios y prestaciones que añaden un valor notable, convirtiéndonos en un referente indiscutible en nuestro campo.
        </motion.p>
        <motion.div
          initial={{ opacity: 0, transform: 'translateX(-50%)' }}
          whileInView={{ opacity: 1, transform: 'translateX(0%)' }}
          transition={{ duration: 0.7 }}
          className=" w-full mt-10"
        >
          <Link
            href="https://rda.pe"
            target="_blank"
            className="text-[2.5vh] lg:text-[1.8rem]  text-center font_Archivo_bold block border-4 border-white rounded-3xl underline hover:text-blue-600 transition-colors cursor-pointer"
          >
            www.rda.pe
          </Link>
        </motion.div>
      </div>
      {/* <div className="relative w-[340px] md:w-[600px] lg:w-fit h-[340px] md:h-[500px] xl:h-auto ml-auto mr-auto lg:ml-auto lg:mr-[initial] xl:absolute bottom-0 top-0 right-0 left-0"> */}
      <div className="relative xl:absolute mx-auto right-0 left-0 w-[340px] md:w-[600px] ml-auto mr-auto lg:ml-auto xl:mr-[initial] 2xl:w-[1000px] h-[340px] md:h-[500px] 2xl:h-[800px] bg-[url(/assets/images/portafolio/desarrollo_web/padre_eterno/pc.webp)] bg-contain bg-no-repeat">
        <div className="w-full h-full z-[9] absolute inset-0 overflow-hidden rounded-[50px]">
          <div className="w-full lg:w-[97%] h-full lg:h-[97%] rounded-[50px]">
            <div className="rounded-[50px] absolute left-0 top-0 w-full h-full pl-[22px] md:pl-[37px] pt-[16px] md:pt-[30px] pr-[22px] md:pr-[65px] pb-[154px] md:pb-[188px] 2xl:pl-[60px] 2xl:pr-[145px] 2xl:pt-[48px] 2xl:pb-[302px]">
              <div className="w-full h-full  overflow-auto ">
                <img
                  src="/assets/images/portafolio/desarrollo_web/rda/pc_desplegable.webp"
                  alt="Screen Capture"
                  className="w-full object-cover "
                />
              </div>
            </div>
          </div>
        </div>
        {/* </div> */}
      </div>
    </section>
  )
}
