'use client'
import { motion } from 'framer-motion'
import { FaFacebookF, FaInstagram, FaPhone, FaYoutube } from 'react-icons/fa6'
import Link from 'next/link'

export const Main = () => {
  return (
    <>
      <div className="hidden lg:flex items-center gap-4 absolute bottom-12 left-24">
        <motion.a
          target="_blank"
          href="https://www.youtube.com/@logosperu476"
          aria-label="Youtube - Logos Perú"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{
            ease: 'linear',
            duration: 0.5,
            delay: 0.5,
            x: { duration: 0.5 }
          }}
          className={
            'flex items-center group justify-center bg-main hover:bg-[#FF0000] rounded-full p-2 transition-colors'
          }
        >
          <FaYoutube className="text-4xl text-azul_serio cursor-pointer group-hover:text-white transition-colors" />
        </motion.a>
        <motion.a
          target="_blank"
          href="https://www.instagram.com/dlogosperu/?hl=es"
          initial={{ scale: 0 }}
          aria-label="Instagram - Logos Perú"
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{
            ease: 'linear',
            duration: 0.5,
            delay: 0.5,
            x: { duration: 0.5 }
          }}
          className={
            'flex items-center group justify-center bg-main hover:bg-gradient-to-br from-purple-600 to-pink-500 rounded-full p-2 transition-colors'
          }
        >
          <FaInstagram className="text-4xl text-azul_serio cursor-pointer group-hover:text-white transition-colors" />
        </motion.a>
        <motion.a
          target="_blank"
          aria-label="Facebook - Logos Perú"
          href="https://www.facebook.com/DLogosPeru/?locale=es_LA"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
          transition={{
            ease: 'linear',
            duration: 0.5,
            delay: 0.5,
            x: { duration: 0.5 }
          }}
          className={
            'flex items-center group justify-center bg-main hover:bg-[#1877F2] rounded-full p-2 transition-colors'
          }
        >
          <FaFacebookF className="text-4xl text-azul_serio cursor-pointer group-hover:text-white transition-colors" />
        </motion.a>
        <a
          href="tel:+51987038024"
          target="_blank"
          className="flex gap-0 items-center group"
          rel="noreferrer"
        >
          <motion.span
            aria-label="Facebook - Logos Perú"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{
              ease: 'linear',
              duration: 0.5,
              delay: 0.5,
              x: { duration: 0.5 }
            }}
            className={
              'flex items-center group justify-center group-hover:bg-darKmain bg-main rounded-full p-2 transition-colors'
            }
          >
            <FaPhone className="text-4xl p-[3px] text-azul_serio cursor-pointer transition-colors" />
          </motion.span>
          <motion.span
            aria-label="Facebook - Logos Perú"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            transition={{
              ease: 'linear',
              duration: 0.5,
              delay: 0.5,
              x: { duration: 0.5 }
            }}
            className="font_Archivo_bold flex h-full py-1 items-center rounded-md px-3 text-sm text-main transition-colors group-hover:text-darKmain md:text-lg"
            rel="noreferrer"
          >
            987 038 024
          </motion.span>
        </a>
      </div>

      <div className="w-full 2xl:w-1/2 flex flex-col justify-center p-4 lg:p-0 xl:pb-10">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            ease: 'linear',
            duration: 0.5,
            delay: 1,
            x: { duration: 0.5 }
          }}
        >
          <h1 className="w-full text-center 2xl:text-start 2xl:w-fit flex flex-col font_allRound text-gris text-[6vh] md:text-[8vh] lg:text-[12vh] leading-[6vh] md:leading-[10vh] xl:leading-[23vh] 2xl:leading-[26vh] xl:text-[14vh] 2xl:text-[19vh] 2xl:-mt-[164px]">
            AGENCIA
            <p className="text-main xl:text-center block xl:-mt-20 title-color">
              DIGITAL
            </p>
          </h1>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, transform: 'translateX(-150%)' }}
          animate={{ opacity: 1, transform: 'translateX(0%)' }}
          exit={{ opacity: 0, transform: 'translateX(-150%)' }}
          transition={{
            ease: 'linear',
            duration: 0.5,
            delay: 1,
            x: { duration: 0.5 }
          }}
          className="flex justify-center"
        >
          <p className="w-full md:w-fit subtitle-banner text-[16px] mt-6 lg:mt-0 lg:text-[5vh]  2xl:text-[6.5vh] letter-spacing-3 text-gris text-center">
            TU ÉXITO EN CADA{' '}
            <Link href="#" className="font-bold animate_link">
              CLIC
            </Link>
          </p>

        </motion.div>

      </div>
    </>
  )
}
