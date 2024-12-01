import { Footer } from '@/public/components/web/structure/Footer'
import { Header } from '@/public/components/web/structure/Header'
import { ListTerminos } from '@/public/components/web/terminologia/ListTerminos'
import React from 'react'
export default function page ({ params }: any) {
  const { texto } = params
  return (
    <>
      <Header />
      <h2 className="mb-4 text-center text-4xl font-bold text-azul_serio lg:text-5xl">TERMINOLOGÍAS</h2>

      <ListTerminos texto={texto} />
      <Footer />
    </>
  )
}
