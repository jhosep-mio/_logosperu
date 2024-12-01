/* eslint-disable @next/next/no-img-element */
'use client'
import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'

export const Portafolio = () => {
  return (
    <section className="portafolio--main bg-[#dcdcdc] lg:pb-[30px] pt-4">
      <Link
        href="/portafolio/diseno_grafico/casa-quimuk"
        className="portafolio--item1"
      >
        <motion.img
          src="/assets/images/portafolio/grafico.webp"
          alt="Logos Perú"
          className="block w-full object-cover h-full"
          width={380}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        />
        <div className="name--portafolio"></div>
        <p className="title--portafolio">DISEÑO GRÁFICO</p>
      </Link>
      <Link
        href="/portafolio/desarrollo_web/padre_eterno"
        className="portafolio--item2"
      >
        <motion.img
          src="/assets/images/portafolio/web.webp"
          alt="Logos Perú"
          className="block w-full object-cover h-full"
          width={380}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        />
        <div className="name--portafolio"></div>
        <p className="title--portafolio">DESARROLLO WEB</p>
      </Link>
      <Link href='/portafolio/hosting/biociencia' className="portafolio--item3">
        <motion.img
          src="/assets/images/portafolio/hosting.webp"
          alt="Logos Perú"
          className="block w-full object-cover h-full"
          width={380}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        />
        <div className="name--portafolio"></div>
        <p className="title--portafolio">HOSTING</p>
      </Link>
      <Link
        href="/portafolio/community_manager/sisitravels"
        className="portafolio--item4"
      >
        <motion.img
          src="/assets/images/portafolio/community.webp"
          alt="Logos Perú"
          className="block w-full object-cover object-left lg:object-center h-full"
          width={380}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
        <div className="name--portafolio"></div>
        <p className="title--portafolio">COMMUNITY MANAGER</p>
      </Link>
      <Link
        href="/portafolio/capacitaciones/corporacion_empaques"
        className="portafolio--item5"
      >
        <motion.img
          src="/assets/images/portafolio/capacitaciones.webp"
          alt="Logos Perú"
          className="block w-full object-cover h-full"
          width={380}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.7 }}
        />
        <div className="name--portafolio"></div>
        <p className="title--portafolio">CAPACITACIONES</p>
      </Link>
    </section>
  )
}
