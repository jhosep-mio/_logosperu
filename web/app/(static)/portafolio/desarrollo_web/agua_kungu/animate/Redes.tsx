/* eslint-disable @next/next/no-img-element */
'use client'
import { FaFacebookF, FaInstagram, FaWhatsapp } from 'react-icons/fa6'
import { motion } from 'framer-motion'

export const Redes = () => {
  return (
    <>
      <div className="hidden xl:block absolute w-[301px] lg:w-[370px] left-[10%] bottom-[10%] z-[10] h-[500px] lg:h-[700px] bg-[url(/assets/images/portafolio/desarrollo_web/padre_eterno/celular.webp)] bg-no-repeat bg-contain">
        <div className="w-full h-full z-[9] absolute inset-0 overflow-hidden rounded-[50px]">
          <div className="w-[97%] h-[97%] rounded-[50px]">
            <div className="rounded-[50px] absolute left-0 top-0 w-full h-full pt-[39px] lg:pt-[55px] pl-[11.9px] lg:pl-[20px] pr-[66px] lg:pr-[40px] pb-[10px] lg:pb-[18px]">
              <div className="w-full h-full rounded-bl-[29px] rounded-br-[29px] lg:rounded-bl-[34px] lg:rounded-br-[34px] overflow-auto scroll_black">
                <motion.img
                  src="/assets/images/portafolio/desarrollo_web/agua_kungu/capturacel.webp"
                  alt="Screen Capture"
                  className="w-full object-cover "
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full h-full absolute py-12 md:py-0 inset-0 flex flex-col justify-center items-center z-[2]">
        <motion.h2
          initial={{ opacity: 0, transform: 'translateX(-100%)' }}
          whileInView={{ opacity: 1, transform: 'translateX(0%)' }}
          transition={{ duration: 0.3 }}
          className="text-white text_shadow text-[4rem] md:text-[7vh] lg:text-[10vh] font_Atlatis text-center"
        >
          Agua Kungu
        </motion.h2>
        <div className="flex justify-center items-center w-full my-4 gap-4">
          <motion.a
            initial={{ opacity: 0, transform: 'translateY(100%)' }}
            whileInView={{ opacity: 1, transform: 'translateY(0%)' }}
            transition={{ duration: 0.3 }}
            href="https://www.facebook.com/aguakungu"
            target="_blank"
            className={
              'flex items-center group justify-center rounded-full p-2 transition-colors bg-white hover:bg-[#1877F2]'
            }
            rel="noreferrer"
          >
            <FaFacebookF className="text-[2rem] lg:text-[4vh] text-gray-500 group-hover:text-white  cursor-pointer transition-colors" />
          </motion.a>
          <motion.a
            initial={{ opacity: 0, transform: 'translateY(100%)' }}
            whileInView={{ opacity: 1, transform: 'translateY(0%)' }}
            transition={{ duration: 0.5 }}
            href="https://www.instagram.com/aguakungu"
            target="_blank"
            className={
              'flex items-center group justify-center rounded-full p-2 transition-colors bg-white hover:bg-pink-500'
            }
            rel="noreferrer"
          >
            <FaInstagram className="text-[2rem] lg:text-[4vh] text-gray-500 group-hover:text-white  cursor-pointer transition-colors" />
          </motion.a>
          <motion.a
            initial={{ opacity: 0, transform: 'translateY(100%)' }}
            whileInView={{ opacity: 1, transform: 'translateY(0%)' }}
            transition={{ duration: 0.5 }}
            href="https://api.whatsapp.com/send?phone=51953991588"
            target="_blank"
            className={
              'flex items-center group justify-center rounded-full p-2 transition-colors bg-white hover:bg-pink-500'
            }
            rel="noreferrer"
          >
            <FaWhatsapp className="text-[2rem] lg:text-[4vh] text-gray-500 group-hover:text-white  cursor-pointer transition-colors" />
          </motion.a>
        </div>
      </div>
    </>
  )
}
