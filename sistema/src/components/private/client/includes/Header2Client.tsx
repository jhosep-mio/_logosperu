import {
  RiArrowDownSLine,
  RiLogoutCircleRLine
} from 'react-icons/ri'
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { useEffect, useState } from 'react'
import { Global } from '../../../../helper/Global'
import { icono } from '../../../shared/Images'
import useAuthCliente from '../../../../hooks/useAuthCliente'

const Header2Client = (): JSX.Element => {
  const { auth, setLoading } = useAuthCliente()
  const token = localStorage.getItem('tokenUser')
  const [date, setDate] = useState(new Date())

  useEffect(() => {
    const timerID = setInterval(() => {
      setDate(new Date())
    }, 1000)

    return () => {
      clearInterval(timerID)
    }
  }, [])

  const cerrarSession = async (): Promise<void> => {
    setLoading(true)
    const data = new FormData()
    data.append('_method', 'POST')

    await axios.post(`${Global.url}/logout`, data, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    localStorage.clear()
    window.location.href = '/login'
    setLoading(false)
  }

  return (
    <header className="h-[7vh] md:h-[8vh] border-b text-black border-gray-100 py-8 px-4 md:p-4 flex items-center justify-between bg-form md:rounded-xl relative">
      <div className="flex items-center gap-3 md:gap-5 w-full md:w-1/2 mr-3 md:mr-0">
        <div className="flex gap-3 items-center w-full text-gray-400">
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
              <span className="line-clamp-1 hidden md:block">{auth.name}</span>
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
    </header>
  )
}

export default Header2Client
