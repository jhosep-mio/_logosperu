/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useState } from 'react'

import { Link } from 'react-router-dom'
// Icons
import {
  RiMenu3Line,
  RiCloseLine,
  RiStackFill,
  RiRadioButtonLine
} from 'react-icons/ri'
import { MdHelpCenter } from 'react-icons/md'
import { IoNotifications } from 'react-icons/io5'
import Swal from 'sweetalert2'
import { Toaster } from 'sonner'
import { icono } from '../../../shared/Images'
import useAuthCliente from '../../../../hooks/useAuthCliente'

const SideBarClient = (): JSX.Element => {
  const { auth, setGuia, downloadProgress } = useAuthCliente()
  const [showMenu, setShowMenu] = useState(false)
  const generarAlerta = (): void => {
    Swal.fire('No tiene notificaciones pendientes', '', 'warning')
  }

  return (
    <>
      <Toaster position="top-center" richColors />
      {downloadProgress != 0 && downloadProgress != 100 && (
        <div className="w-full md:w-96 absolute right-0 md:right-3 bottom-0 z-[9999999] bg-white  py-3 px-4 rounded-t-lg shadow-black shadow-md">
          <h2 className="text-center w-full text-black font-medium mb-4 text-lg">
            Descarga de archivos
          </h2>
          <div className="relative flex items-center justify-center">
            <p className="text-black font-bold absolute inset-0 text-center">
              Preparando descarga {downloadProgress.toFixed(2)} %
            </p>
            <div className="rounded-lg bg-gray-400 w-full">
              <div
                className="rounded-lg bg-green-700"
                style={{
                  width: `${downloadProgress}%`,
                  height: '25px',
                  transition: 'width 0.3s ease'
                }}
              ></div>
            </div>
          </div>
        </div>
      )}
      <div
        className={`xl:h-[96vh] fixed xl:static w-[70%] md:w-[40%] lg:w-[30%] xl:w-auto h-full lg:ml-4 top-0 my-auto lg:rounded-2xl bg-[#F0F3F4] shadow-xl px-4 pb-4 pt-2 flex flex-col justify-between z-50 ${
          showMenu ? 'left-0' : '-left-full'
        } transition-all`}
      >
        <div>
          <nav className="py-4">
            <div className="relative w-fit mx-auto mb-4">
              <img
                src={icono}
                alt=""
                className="w-20 mx-auto border-white rounded-full border-2 p-2"
              />
              <span className="text-green-500 absolute bottom-0 text-xl right-0 animate-pulse">
                <RiRadioButtonLine />
              </span>
            </div>
            <h2 className="text-center text-black font-bold text-sm">
              {auth.name}
            </h2>
            <h2 className="text-center text-gray-500 text-xs">{auth.email}</h2>
          </nav>
          <hr className="mb-5 bg-gray-300 h-[2px]" />
          <ul className="ml-0 p-0">
            <li className="group">
              <Link
                to="/cliente"
                onClick={() => {
                  setShowMenu(false)
                }}
                className="flex items-center gap-4 py-2 px-4 rounded-lg text-black group-hover:bg-main group-hover:text-white transition-colors"
              >
                <RiStackFill className="text-main group-hover:text-white transition-colors" />{' '}
                Servicios
              </Link>
            </li>
            <li className="group">
              <Link
                to="#"
                onClick={() => {
                  generarAlerta()
                  setShowMenu(false)
                }}
                className="flex items-center gap-4 py-2 px-4 rounded-lg text-black group-hover:bg-main group-hover:text-white transition-colors"
              >
                <IoNotifications className="text-main group-hover:text-white transition-colors" />{' '}
                Notificaciones
              </Link>
            </li>
            <li className="group">
              <Link
                to="#"
                onClick={() => {
                  setGuia(true)
                  setShowMenu(false)
                }}
                className="flex items-center gap-4 py-2 px-4 rounded-lg text-black group-hover:bg-main group-hover:text-white transition-colors"
              >
                <MdHelpCenter className="text-main group-hover:text-white transition-colors" />{' '}
                Guia de descarga
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <button
        onClick={() => {
          setShowMenu(!showMenu)
        }}
        className="xl:hidden fixed bottom-4 right-4 bg-main text-white p-3 rounded-full z-50"
      >
        {showMenu ? <RiCloseLine /> : <RiMenu3Line />}
      </button>
    </>
  )
}

export default SideBarClient
