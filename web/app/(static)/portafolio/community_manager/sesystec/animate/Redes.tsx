/* eslint-disable @next/next/no-img-element */
'use client'
import { motion } from 'framer-motion'

export const Redes = () => {
  return (
    <>
      <div className="hidden xl:block absolute w-[301px] lg:w-[370px] right-[10%] bottom-0 top-0 my-auto z-[10] h-[500px] lg:h-[700px] bg-[url(/assets/images/portafolio/desarrollo_web/padre_eterno/celular.webp)] bg-no-repeat bg-contain">
        <div className="w-full h-full z-[9] absolute inset-0 overflow-hidden rounded-[50px]">
          <div className="w-[97%] h-[97%] rounded-[50px]">
            <div className='rounded-[50px] absolute left-0 top-0 w-full h-full pt-[39px] lg:pt-[55px] pl-[11.9px] lg:pl-[19px] pr-[66px] lg:pr-[40px] pb-[10px] lg:pb-[18px]'>
                <div className='w-full h-full rounded-bl-[29px] rounded-br-[29px] lg:rounded-bl-[34px] lg:rounded-br-[34px] overflow-auto scroll_black'>
                    <motion.img
                    src="/assets/images/portafolio/community_manager/sesystec/celular.webp"
                    alt="Screen Capture"
                    className="w-full object-cover "
                    />
                </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
