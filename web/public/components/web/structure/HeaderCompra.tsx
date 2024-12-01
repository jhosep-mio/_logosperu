/* eslint-disable jsx-a11y/alt-text */
'use client'
/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import Link from 'next/link'
import { Menu } from './headerComponents/Menu'
// import { IoCall } from 'react-icons/io5'
import { Login } from './headerComponents/Login'
import useAuth from '../../shared/hooks/useAuth'
import { RiArrowDownSLine, RiLogoutCircleRLine } from 'react-icons/ri'
import axios from 'axios'
import { Global } from '@/helper/Global'

export const HeaderCompra = () => {
  const [showMenu, setShowMenu] = useState(false)
  const [open, setOpen] = useState(0)
  const { auth, setAuth } = useAuth()
  const [isOpen, setIsOpen] = useState(false)
  const [loadingcerr, setLoadingCerr] = useState(false)

  const toggleDesglose = () => {
    setIsOpen(!isOpen)
  }

  const cerrarSession = async (): Promise<void> => {
    setLoadingCerr(true)
    const token = localStorage.getItem('tokenUser')
    const data = new FormData()
    data.append('_method', 'POST')
    try {
      await axios.post(`${Global.url}/logout`, data, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      setAuth({
        id: '',
        name: '',
        lastname: '',
        email: '',
        celular: ''
      })
      localStorage.setItem('tokenUser', '')
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingCerr(false)
    }
  }

  return (
    <>
      <header
        className={
          'fixed py-1 bg-white border-b border-b-gray-300 left-0 top-0 z-[999] w-full px-2 transition-all lg:px-16'
        }
      >
        <nav className="flex items-center justify-between lg:justify-center relative">
          <Link href="/" className="h-[70px] w-fit lg:h-[100px]">
            <img
              src="/assets/images/logos/logo_verde.png"
              alt="Logos Perú"
              className="h-[70px] w-[90px] object-contain md:w-[140px] lg:h-[100px]"
            />
          </Link>
          <Menu menu={showMenu} setShowMenu={setShowMenu} setOpen={setOpen} />
          <div
            onClick={toggleDesglose}
            className="lg:absolute top-0  bottom-0 my-auto right-0 flex flex-col items-center justify-center cursor-pointer"
          >
            {/* Botón compacto cuando el menú está cerrado */}
            {auth.id && (
              <div className="flex lg:min-w-[250px] items-center relative gap-x-2 hover:bg-[#f1f1f1] group p-2 rounded-lg transition-all duration-300">
                <img
                  src="/assets/images/logos/logo.webp"
                  className="w-7 h-7 object-contain rounded-full bg-[#000000] p-[3px]"
                />
                <span className="block text-black  line-clamp-1">
                  {auth.name} {auth.lastname}
                </span>
                <RiArrowDownSLine className="text-black " />
                {isOpen && (
                  <div className="absolute w-full top-full left-0 right-0 px-2 py-2 rounded-lg bg-[#1E1F25] text-gray-300 ">
                    <div className="rounded-lg flex items-center gap-x-4 py-2  transition-colors hover:bg-main_2-100">
                      <img
                        src="/assets/images/logos/logo.webp"
                        className="w-8 h-8 object-contain rounded-full bg-[#000000] p-[3px]"
                      />
                      <div className="flex flex-col text-sm">
                        <span className="text-sm font-bold ">
                          {auth.name} {auth.lastname}
                        </span>
                        <span className="text-xs  text-gray-500">
                          {auth.email}
                        </span>
                      </div>
                    </div>
                    <hr className="border-gray-300 mb-0" />
                    <div className="p-0 hover:bg-transparent hover:bg-[#2d2e34] px-4">
                      <div
                        className="rounded-lg transition-colors  hover:bg-main_2-100 flex items-center gap-x-4 py-2 flex-1 cursor-pointer"
                        onClick={() => {
                          !loadingcerr && cerrarSession()
                        }}
                        // Aquí puedes poner la función de cerrar sesión
                      >
                        <RiLogoutCircleRLine className="text-gray-300" />
                        <span className="text-sm font-medium ">
                          Cerrar sesión
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </nav>
      </header>
      <Login setOpen={setOpen} open={open} />
    </>
  )
}
