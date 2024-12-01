/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'

export const TextoMarca = () => {
  return (
    <section className="h-full flex flex-col lg:flex-row-reverse gap-3 lg:gap-6 xl:gap-0 lg:items-center max-w-[2000px] mx-auto pt-0 pb-0 lg:py-10 2xl:py-24 px-0 2xl:px-16">
      <div className="w-full relative h-full lg:w-[50%] mx-auto px-4 lg:my-auto justify-center flex flex-col lg:gap-5 overflow-hidden items-center ">
        <div className="w-full justify-center flex flex-col lg:gap-5 overflow-hidden items-center">
          <motion.h2
            initial={{ opacity: 0, transform: 'translateX(-50%)' }}
            whileInView={{ opacity: 1, transform: 'translateX(0%)' }}
            transition={{ duration: 0.3 }}
            className="w-full  font_Archivo_bold text-[1.5rem] md:text-[2.5rem] 2xl:text-[2.5rem] text-white block text-center uppercase"
          >
            MISIÓN
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, transform: 'translateX(-50%)' }}
            whileInView={{ opacity: 1, transform: 'translateX(0%)' }}
            transition={{ duration: 0.5 }}
            className="w-full font_Archivo_bold mt-4 lg:mt-0 text-white text-base md:text-[1.25rem] 2xl:text-[1.5rem] leading-[2.5vh] lg:leading-[3vh] 2xl:leading-[2rem] text-justify"
          >
            En el Centro Médico Oftalmológico, nuestra misión era clara: aumentar la visibilidad de nuestros servicios especializados y atraer a más pacientes a nuestras instalaciones a través de campañas publicitarias efectivas en Facebook Ads. Con la creciente importancia de las redes sociales en la vida cotidiana, reconocimos la necesidad de utilizar estas plataformas para comunicarnos de manera más directa y efectiva con nuestro público objetivo.
          </motion.p>
        </div>
      </div>
    </section>
  )
}
