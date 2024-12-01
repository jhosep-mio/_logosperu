import { HeaderCompra } from '@/public/components/web/structure/HeaderCompra'
import React from 'react'
import { FormPago } from './@components/FormPago'
import { generateMetadata } from '@/public/components/seo/SeoList'
export const metadata = generateMetadata()

export default function page () {
  return (
    <>
      <HeaderCompra />
      <section className="bg-white relative overflow-hidden pt-[79px] lg:pt-[109px] text-black ">
        <div className="w-full px-0 lg:px-10 lg:pb-8  relative overflow-hidden ">
          <FormPago />
        </div>
      </section>
    </>
  )
}
