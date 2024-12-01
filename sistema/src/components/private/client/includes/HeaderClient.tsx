import {
  RiArrowDownSLine,
  RiFilter2Fill,
  RiLogoutCircleRLine
} from 'react-icons/ri'
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState, type Dispatch, type SetStateAction } from 'react'
import { IoCloseSharp, IoSearchSharp } from 'react-icons/io5'
import { Global } from '../../../../helper/Global'
import { icono } from '../../../shared/Images'
import useAuthCliente from '../../../../hooks/useAuthCliente'

const HeaderClient = ({
  search,
  setSearch,
  setpaginaActual
}: {
  search: string
  setSearch: Dispatch<SetStateAction<string>>
  setpaginaActual: Dispatch<SetStateAction<number>>
}): JSX.Element => {
  const { auth, setLoading: setLoadingCerr } = useAuthCliente()
  const [open, setOpen] = useState(false)
  const [date, setDate] = useState(new Date())
  const token = localStorage.getItem('tokenUser')

  useEffect(() => {
    const timerID = setInterval(() => {
      setDate(new Date())
    }, 1000)

    return () => {
      clearInterval(timerID)
    }
  }, [])

  const cerrarSession = async (): Promise<void> => {
    setLoadingCerr(true)
    const data = new FormData()
    data.append('_method', 'POST')

    await axios.post(`${Global.url}/logout`, data, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    localStorage.clear()
    window.location.href = '/'
  }

  const onSeachChange = ({
    target
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setpaginaActual(1)
    setSearch(target.value)
  }

  return (
    <header className="h-[7vh] md:h-[8vh] border-b border-gray-100 py-8 px-4 md:p-4 flex items-center justify-between bg-form md:rounded-xl relative">
      <div className="flex items-center justify-between gap-3 md:gap-5 w-full md:w-1/2 mr-3 md:mr-0">
        <h3 className="font-bold text-base">
          <span className="text-black text-lg md:hidden">
            Ultimos servicios
          </span>
        </h3>
        <button className="bg-gray-100 hover:bg-gray-100 w-full hidden md:flex items-center text-black gap-2 py-2 px-4 rounded-lg hover:text-main transition-colors ">
          <RiFilter2Fill />
          <input
            placeholder="Buscar ..."
            className="bg-transparent outline-none w-full"
            value={search}
            onChange={onSeachChange}
            type="search"
          />
        </button>
        <div
          className="p-2"
          onClick={() => {
            setOpen(true)
          }}
        >
          <IoSearchSharp className="text-2xl md:hidden" />
        </div>
        <div className="hidden md:flex gap-3 items-center w-full text-gray-400">
          <p className="">{date.toLocaleDateString()}</p>
          <p>{date.toLocaleTimeString()}</p>
        </div>
      </div>
      <nav className="flex items-center gap-2">
        <Menu
          menuButton={
            <MenuButton className="flex items-center gap-x-2 hover:bg-gray-100 p-2 rounded-lg transition-colors">
              <img
                src={icono}
                className="w-6 h-6 object-contain rounded-full"
              />
              <span className="line-clamp-1 hidden md:block text-black">{auth.name}</span>
              <RiArrowDownSLine />
            </MenuButton>
          }
          align="end"
          arrow
          transition
          menuClassName="bg-gray-100 p-4"
        >
          <MenuItem className="p-0 hover:bg-transparent">
            <Link
              to="/perfil"
              className="rounded-lg transition-colors text-gray-300 hover:bg-gray-300 flex items-center gap-x-4 py-2 px-6 flex-1"
            >
              <img
                src={icono}
                className="w-8 h-8 object-contain rounded-full"
              />
              <div className="flex flex-col text-sm">
                <span className="text-sm text-gray-700">{auth.name}</span>
                <span className="text-xs text-gray-500">{auth.email}</span>
              </div>
            </Link>
          </MenuItem>
          <hr className="my-4 border-gray-500" />
          <MenuItem className="p-0 hover:bg-transparent">
            <Link
              to=""
              onClick={() => {
                void cerrarSession()
              }}
              className="rounded-lg transition-colors text-gray-500 hover:bg-gray-300 flex items-center gap-x-4 py-2 px-6 flex-1"
            >
              <RiLogoutCircleRLine /> Cerrar sesión
            </Link>
          </MenuItem>
        </Menu>
      </nav>
      <div
        className={`${
          !open ? 'search_hidden' : 'search_block'
        } absolute inset-0 bg-white w-full h-full flex items-center justify-center px-4 gap-3 md:hidden`}
      >
        <button className="bg-gray-100 hover:bg-gray-100 w-full flex items-center text-black gap-2 py-2 px-4 rounded-lg hover:text-main transition-colors">
          <RiFilter2Fill />
          <input
            placeholder="Buscar ..."
            className="bg-transparent outline-none w-full"
            value={search}
            onChange={onSeachChange}
            type="search"
          />
        </button>
        <IoCloseSharp
          className="text-2xl"
          onClick={() => {
            setOpen(false)
            setSearch('')
          }}
        />
      </div>
    </header>
  )
}

export default HeaderClient
