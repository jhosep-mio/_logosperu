/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'

export const Images = () => {
  return (
    <>
      <div className="flex flex-col lg:flex-row w-full overflow-hidden">
        <motion.img
          initial={{ opacity: 0, transform: 'translateY(10%)' }}
          whileInView={{ opacity: 1, transform: 'translateY(0%)' }}
          transition={{ duration: 0.3 }}
          src="/assets/images/portafolio/plaza_san_antonio/recurso2.webp"
          alt=""
          className="h-auto w-full lg:w-1/2"
        />
        <motion.img
          initial={{ opacity: 0, transform: 'translateY(10%)' }}
          whileInView={{ opacity: 1, transform: 'translateY(0%)' }}
          transition={{ duration: 0.3 }}
          src="/assets/images/portafolio/plaza_san_antonio/recurso1.webp"
          alt=""
          className="h-auto w-full lg:w-1/2"
        />
      </div>
      <div className="flex flex-col-reverse lg:flex-row w-full  overflow-hidden">
        <motion.img
          initial={{ opacity: 0, transform: 'translateY(10%)' }}
          whileInView={{ opacity: 1, transform: 'translateY(0%)' }}
          transition={{ duration: 0.3 }}
          src="/assets/images/portafolio/plaza_san_antonio/recurso3.webp"
          alt=""
          className="h-auto w-full lg:w-1/2"
        />
        <div className="w-full lg:w-1/2 h-auto flex flex-col  overflow-hidden">
          <motion.img
            initial={{ opacity: 0, transform: 'translateY(10%)' }}
            whileInView={{ opacity: 1, transform: 'translateY(0%)' }}
            transition={{ duration: 0.3 }}
            src="/assets/images/portafolio/plaza_san_antonio/recurso4.webp"
            alt=""
            className="h-auto w-full"
          />
          <motion.img
            initial={{ opacity: 0, transform: 'translateY(10%)' }}
            whileInView={{ opacity: 1, transform: 'translateY(0%)' }}
            transition={{ duration: 0.3 }}
            src="/assets/images/portafolio/plaza_san_antonio/recurso5.webp"
            alt=""
            className="h-auto w-full"
          />
        </div>
      </div>
    </>
  )
}
