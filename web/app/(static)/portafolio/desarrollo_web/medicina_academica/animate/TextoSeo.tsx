/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'

export const TextoSeo = () => {
  return (
    <>
      <motion.img
        initial={{ opacity: 0, transform: 'translate(-50%, 50%)' }}
        whileInView={{ opacity: 1, transform: 'translate(0%, 0%)' }}
        transition={{ duration: 0.3 }}
        src="/assets/images/portafolio/desarrollo_web/medicina_academica/recurso3.webp"
        alt=""
        className="h-auto w-full mt-10 md:mt-0 lg:w-1/2 z-[2] object-contain block mx-auto"
      />
      <div className="justify-center flex flex-col gap-5 overflow-hidden items-center lg:pl-16 z-[2] ">
        <motion.h2
          initial={{ opacity: 0, transform: 'translateX(50%)' }}
          whileInView={{ opacity: 1, transform: 'translateX(0%)' }}
          transition={{ duration: 0.3 }}
          className="w-full  font_Archivo_bold text-[1.3rem] lg:text-[4.2vh] text-white block text-center uppercase"
        >
          BÚSQUEDA EN GOOGLE
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, transform: 'translateX(50%)' }}
          whileInView={{ opacity: 1, transform: 'translateX(0%)' }}
          transition={{ duration: 0.5 }}
          className="w-full font_Archivo_bold  text-white text-base lg:text-[2.4vh] leading-6 lg:leading-[3vh] text-justify"
        >
          Nuestro equipo trabajó estrechamente para crear una plataforma intuitiva y eficiente, diseñada para satisfacer las necesidades de los estudiantes y profesionales de la salud. Se ha logrado ocupar el tercer lugar en las búsquedas de Google, lo que demuestra el éxito de nuestra colaboración.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, transform: 'translateX(50%)' }}
          whileInView={{ opacity: 1, transform: 'translateX(0%)' }}
          transition={{ duration: 0.7 }}
          className="text-white font_Archivo_bold text-[3vh] md:text-[4vh] text-center mt-10 text_shadow"
        >
          MEDICINA GENERAL OCUPA EL 3ER LUGAR EN BÚSQUEDA DE GOOGLE
        </motion.p>
      </div>
    </>
  )
}
