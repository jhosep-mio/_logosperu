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
        src="/assets/images/portafolio/desarrollo_web/padre_eterno/recurso3.webp"
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
          POSICIONAMIENTO SEO
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, transform: 'translateX(50%)' }}
          whileInView={{ opacity: 1, transform: 'translateX(0%)' }}
          transition={{ duration: 0.5 }}
          className="w-full font_Archivo_bold  text-white text-base lg:text-[2.4vh] leading-6 lg:leading-[3vh] text-justify"
        >
          Padre Eterno, una destacada florería, ha logrado un excelente
          posicionamiento SEO. Gracias a nuestas estrategias de optimización y
          contenido de calidad, se ha posicionado en los primeros lugares de los
          motores de búsqueda, permitiendo que sus clientes encuentren
          fácilmente sus hermosos arreglos florales y servicios personalizados.
        </motion.p>
        <motion.p
          initial={{ opacity: 0, transform: 'translateX(50%)' }}
          whileInView={{ opacity: 1, transform: 'translateX(0%)' }}
          transition={{ duration: 0.7 }}
          className="text-white font_Archivo_bold text-[3vh] md:text-[4vh] text-center mt-10 text_shadow"
        >
          PADRE ETERNO OCUPA EL 4TO LUGAR EN LOS BUSCADORES DE GOOGLE
        </motion.p>
      </div>
    </>
  )
}
