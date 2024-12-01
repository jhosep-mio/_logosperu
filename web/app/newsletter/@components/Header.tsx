/* eslint-disable jsx-a11y/alt-text */
'use client'
/* eslint-disable @next/next/no-img-element */
import React, { useState } from 'react'
import Link from 'next/link'
import { CgMenuGridR } from 'react-icons/cg'
// import { IoCall } from 'react-icons/io5'
import axios from 'axios'
import { Global } from '@/helper/Global'
import { RiArrowDownSLine, RiLogoutCircleRLine } from 'react-icons/ri'
import { FaUserCircle } from 'react-icons/fa'
import { HiLogin } from 'react-icons/hi'
import { Toaster } from 'sonner'
import useAuth from '@/public/components/shared/hooks/useAuth'
import { Menu } from '@/public/components/web/structure/headerComponents/Menu'
import { ResetPassword } from '@/public/components/web/structure/headerComponents/ResetPassword'
import { Login } from '@/public/components/web/structure/headerComponents/Login'
import { Register } from '@/public/components/web/structure/headerComponents/Register'
import { IoSearchSharp } from 'react-icons/io5'
import { ModalSuscribirse } from './modals/ModalSuscribirse'

export const Header = () => {
  const [showMenu, setShowMenu] = useState(false)
  const [open, setOpen] = useState(false)
  const { openSuscribirse, setOpenSuscribirse } = useAuth()
  const { setAuth, auth } = useAuth()
  const [openRegister, setOpenRegister] = useState(false)
  const [openPass, setOpenPass] = useState(false)
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
      <Toaster position="top-center" richColors />

      <header
        className={
          'fixed left-0 top-0 z-[999] w-full px-2 py-1 transition-all h-24 lg:px-16 bg-white border-b-2 border-b-gris'
        }
      >
        <nav className="flex items-center justify-between h-full">
          <div className="flex items-center gap-20">
            <Link href="/" className="h-fit w-fit">
              <img
                src="/assets/images/logos/logo_verde.png"
                alt="Logos Perú"
                className="h-[70px] w-[90px] object-contain md:w-[140px] lg:h-[100px]"
              />
            </Link>
            <div className="relative hidden lg:block">
              <IoSearchSharp className="absolute left-4 bottom-0 top-0 text-2xl text-[#b1aeae] my-auto" />
              <input
                type="text"
                placeholder="Buscar..."
                className="border-2 border-gris rounded-full pl-12 pr-4 py-2 w-[400px] placeholder:text-gris"
              />
            </div>
          </div>
          <div className="flex items-center gap-0">
            <button
              onClick={() => {
                setOpenSuscribirse(true)
              }}
              className="bg-[#2563EB] hidden text-xs xl:text-sm font-bold justify-center text-white py-3 px-6 rounded-full hover:bg-blue-800 lg:flex items-center gap-2 transition duration-300"
            >
              SUSCRIBETE
            </button>
            {auth.id ? (
              <div
                onClick={toggleDesglose}
                className="flex bg-main hover:bg-darKmain ml-2 lg:ml-3 rounded-full h-8 lg:h-10 flex-col items-center justify-center cursor-pointer"
              >
                <div className="flex items-center relative gap-x-2  group px-2  transition-all duration-300">
                  <img
                    src="/assets/images/logos/logo.webp"
                    className="w-7 h-7 object-contain rounded-full bg-[#000000] p-[3px]"
                  />
                  <span className="hidden md:block text-black  line-clamp-1">
                    {auth.name.substring(0, auth.name.indexOf(' '))}
                  </span>
                  <RiArrowDownSLine className="text-black " />
                  {isOpen && (
                    <div className="absolute w-[220px] overflow-hidden lg:w-[250px] top-full right-0 px-2 mt-4 py-2 rounded-lg bg-white text-gray-700 border-2 border-main">
                      <div className="rounded-lg flex items-center gap-x-4 py-2  transition-colors hover:bg-main_2-100">
                        <img
                          src="/assets/images/logos/logo.webp"
                          className="w-8 h-8 object-contain rounded-full bg-[#000000] p-[3px]"
                        />
                        <div className="flex flex-col text-sm">
                          <span className="text-xs lg:text-sm font-bold ">
                            {auth.name} {auth.lastname}
                          </span>
                          <p className="text-xs text-gray-500 break-words overflow-hidden text-ellipsis whitespace-nowrap">
                            {auth.email}
                          </p>
                        </div>
                      </div>
                      <hr className="border-gray-300 mb-2" />
                      <div className="p-0 lg:px-2">
                        <a
                          className="rounded-lg transition-colors  hover:bg-gray-300 flex items-center px-2 gap-x-4 py-2 flex-1 cursor-pointer"
                          href="https://intranet.logosperu.com.pe/"
                        >
                          <RiLogoutCircleRLine className="text-black" />
                          <span className="text-xs lg:text-sm font-medium ">
                            Intranet
                          </span>
                        </a>
                        <div
                          className="rounded-lg transition-colors  hover:bg-gray-300 flex items-center px-2 gap-x-4 py-2 flex-1 cursor-pointer"
                          onClick={() => {
                            !loadingcerr && cerrarSession()
                          }}
                          // Aquí puedes poner la función de cerrar sesión
                        >
                          <HiLogin className="text-black" />
                          <span className="text-xs lg:text-sm font-medium ">
                            Cerrar sesión
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div>
                <span
                  onClick={() => setOpen(!open)}
                  className={
                    'flex items-center group ml-2 lg:ml-3 cursor-pointer justify-center bg-transparent rounded-full p-0 transition-colors'
                  }
                >
                  <FaUserCircle className="text-4xl lg:text-5xl lg:p-[2px] text-main cursor-pointer transition-colors" />
                </span>
              </div>
            )}
            <button
              aria-label="Botón para abrir el menú lateral"
              type="button"
              onClick={() => {
                setShowMenu(!showMenu)
              }}
            >
              <CgMenuGridR className=" text-main text-5xl p-[2px] lg:text-6xl" />
            </button>
          </div>
          <Menu menu={showMenu} setShowMenu={setShowMenu} setOpen={setOpen} />
        </nav>
      </header>

      <ResetPassword
        setOpen={setOpenPass}
        open={openPass}
        setOpenLogin={setOpen}
      />
      <Login
        setOpen={setOpen}
        open={open}
        setOpenRegister={setOpenRegister}
        setOpenPass={setOpenPass}
      />
      <Register
        setOpen={setOpenRegister}
        open={openRegister}
        setOpenLogin={setOpen}
      />
      <ModalSuscribirse open={openSuscribirse} setOpen={setOpenSuscribirse} />
    </>
  )
}
