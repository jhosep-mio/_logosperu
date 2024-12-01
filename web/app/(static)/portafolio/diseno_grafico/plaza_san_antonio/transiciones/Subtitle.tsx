/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'

export const Subtitle = ({ texto }: {texto: string}) => {
  return (
    <motion.h2
    initial={{ scale: 0 }}
    whileInView={{ scale: 1 }}
    transition={{ duration: 0.5, delay: 1 }}
    onAnimationComplete={() => {
      const spanElement = document.getElementById('letter_sp')
      if (spanElement) {
        // @ts-ignore
        spanElement.classList.add('text_spacing')
      }
    }}
    viewport={{ once: true }}
    className='uppercase text-base block lg:text-[4vh] text-white text_shadow  text-center py-4 lg:pt-[3vh]
    lg:pb-[7vh]'
    id='letter_sp'
    >{texto}</motion.h2>
  )
}
