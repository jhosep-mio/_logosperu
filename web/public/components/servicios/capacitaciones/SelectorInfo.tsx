import React from 'react'
import {
  FaFacebookF,
  FaGoogle,
  FaMoneyCheckAlt,
} from 'react-icons/fa'
export const SelectorInfo = ({
  selectedInfo,
  setSelectedInfo
}: {
  selectedInfo: string;
  setSelectedInfo: any;
}) => {
  const info = [
    {
      code: 'facebook',
      name: 'Facebook Ads',
      icon: <FaFacebookF />
    },
    {
      code: 'google',
      name: 'Google Ads',
      icon: <FaGoogle />
    },
    {
      code: 'pasarelas',
      name: 'Pasarela de pagos',
      icon: <FaMoneyCheckAlt />
    },

  ]

  return (
    <>
      {info.map((item, index) => (
        <li
          onClick={() => setSelectedInfo(item.code.toLowerCase())}
          className={` ${
            selectedInfo === item.code.toLowerCase() ? 'text-main' : ''
          } text-2xl md:text-3xl cursor-pointer  flex items-center gap-2 transition-all hover:text-main`}
          key={index}
        >
          {item.icon}
          {item.name}
        </li>
      ))}
    </>
  )
}
