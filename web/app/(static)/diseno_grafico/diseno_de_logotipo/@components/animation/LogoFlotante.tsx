'use client'
import { motion } from 'framer-motion'

const LogoFlotante = () => {
  const images = [1, 2, 3]
  return (
    <div className="absolute w-[250px] right-0 bottom-0 h-[1200px] overflow-hidden">
      {images.map((_, index) => (
        <motion.img
          key={index}
          src="/assets/images/logos/logo.webp"
          alt=""
          className="w-[120px] block mx-auto img_transicion"
          initial={{ y: 1200, x: 0 }}
          animate={{
            y: 0,
            x: [
              0,
              -50,
              30,
              -30,
              20,
              -20,
              0,
              10,
              -10,
              15,
              -15,
              25,
              -25,
              0
            ]
          }}
          transition={{
            duration: 45,
            ease: [0.5, 0.05, 0.2, 0.9],
            loop: Infinity,
            delay: index * 4.5, // Añade un retraso en cada imagen
            repeatType: 'loop'
          }}
        />
      ))}
    </div>
  )
}

export default LogoFlotante
