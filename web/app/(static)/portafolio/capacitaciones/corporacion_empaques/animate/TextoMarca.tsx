/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'

export const TextoMarca = () => {
  return (
    <section className="h-full flex flex-col lg:flex-row-reverse gap-3 lg:gap-6 xl:gap-0 lg:items-center max-w-[2000px] mx-auto pt-0 pb-0 lg:py-10 2xl:py-24 px-0 2xl:px-16">
      <div className="w-full relative h-full lg:w-[70%] px-4 lg:my-auto justify-end lg:justify-center flex flex-col lg:gap-5 overflow-hidden items-end lg:items-center">
        <img
          src="/assets/images/portafolio/capacitaciones/corporacion_empaques/nube.webp"
          alt=""
          className="w-full h-full object-contain object-left hidden lg:block"
        />
        <div className="w-full justify-center flex lg:hidden flex-col lg:gap-5 overflow-hidden items-center">
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
            La empresa Corporación de Empaques ofrece soluciones para las
            necesidades de productos y envases de cartón. Querían lograr un
            posicionamiento adecuado en la red, por lo que acudimos a Logos Perú
            para conseguirlo y, al mismo tiempo, crear nuestra identidad.
          </motion.p>
        </div>
      </div>
      <img
        src="/assets/images/portafolio/capacitaciones/corporacion_empaques/gatitoanimado.gif"
        alt=""
        className="w-full h-full lg:w-[30%] object-contain lg:object-right hidden lg:block "
      />
      <motion.img
        animate={{
          y: [0, 40, 0] // Animación de subir y bajar
        }}
        transition={{
          duration: 5, // Duración de un ciclo de animación
          repeat: Infinity, // Repetir indefinidamente
          repeatType: 'loop', // Tipo de repetición
          ease: 'easeInOut' // Suavizado de la animación
        }}
        src="/assets/images/portafolio/jackos_bar/gato_frontal.gif"
        alt=""
        className="w-full h-[50%] object-contain block lg:hidden"
      />
    </section>
  )
}
