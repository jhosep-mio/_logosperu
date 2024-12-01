import { Link, useNavigate } from 'react-router-dom'
import { RiLogoutCircleRLine } from 'react-icons/ri'
import axios from 'axios'
import { FaChartSimple, FaMeta, FaPeopleGroup, FaUserGroup } from 'react-icons/fa6'
import useAuth from '../../../../../hooks/useAuth'
import { Global } from '../../../../../helper/Global'
import { HiComputerDesktop } from 'react-icons/hi2'
import { FaAngleLeft } from 'react-icons/fa'
import logo from './../../../../../assets/logo/logo_morado.jpg'
import { SiGoogletagmanager } from 'react-icons/si'

const SideBar = (): JSX.Element => {
  const { setAuth, setLoadingComponents, openSidebar, setOpenSidebar } = useAuth()
  const token = localStorage.getItem('token')

  const navigate = useNavigate()

  const cerrarSession = async (): Promise<void> => {
    const data = new FormData()
    data.append('_method', 'POST')
    await axios.post(`${Global.url}/logout`, data, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    localStorage.clear()
    setAuth({
      id: '',
      name: '',
      email: '',
      email_alter: '',
      firma: '',
      pass_email: '',
      id_rol: 0,
      rol: ''
    })
    navigate('/login')
  }

  return (
    <>
      <div
        className={
          `manejar_Scroll xl:h-[100vh] md:overflow-y-scroll relative  ${openSidebar ? 'w-[5%]' : 'w-[80%] md:w-[40%] lg:w-[15%]'}  h-full top-0 bg-white shadow-xl p-4 flex flex-col justify-between z-50 transition-all`
        }
      >

        <span onClick={() => { setOpenSidebar(!openSidebar) }} className='absolute top-0 right-0 w-7 h-7 hover:bg-gray-200 cursor-pointer transition-colors bg-white shadow-md rounded-full text-black flex items-center justify-center
        '><FaAngleLeft/></span>
        <div>
          <ul className="ml-0 py-0">
          <h1 className="text-center text-2xl font-bold text-black mb-5">
            <img src={logo} alt="" className="m-auto w-[5.4rem] object-contain" />
          </h1>
          <hr className="mb-5" />
            <li>
              <Link
                to="/admin"
                className={
                  'flex items-center gap-4 py-2 px-4 rounded-lg text-black hover:bg-white hover:text-gray-600 transition-colors w-full'
                }
                onClick={() => {
                  setLoadingComponents(false)
                }}
              >
                <HiComputerDesktop className="text-secundario text-xl" /> {!openSidebar && 'Sistema'}
              </Link>
            </li>
            <li>
              <Link
                to="colaboradores"
                className={
                  'flex items-center gap-4 py-2 px-4 rounded-lg text-black hover:bg-gray-100 hover:text-gray-600 transition-colors w-full'
                }
                onClick={() => {
                  setLoadingComponents(false)
                }}
              >
                <FaPeopleGroup className="text-secundario text-xl" /> {!openSidebar && 'Colaboradores'}
              </Link>
            </li>
            <li>
              <Link
                to="clientes"
                className={
                  'flex items-center gap-4 py-2 px-4 rounded-lg text-black hover:bg-gray-100 hover:text-gray-600 transition-colors w-full'
                }
                onClick={() => {
                  setLoadingComponents(false)
                }}
              >
                <FaUserGroup className="text-secundario text-xl" /> {!openSidebar && 'Clientes'}
              </Link>
            </li>
            <li>
              <Link
                to="ventas"
                className={
                  'flex items-center gap-4 py-2 px-4 rounded-lg text-black hover:bg-gray-100 hover:text-gray-600 transition-colors w-full'
                }
                onClick={() => {
                  setLoadingComponents(false)
                }}
              >
                <FaChartSimple className="text-secundario text-xl" /> {!openSidebar && 'Proyectos'}
              </Link>
            </li>
            <li>
              <Link
                to="community"
                className={
                  'flex items-center gap-4 py-2 px-4 rounded-lg text-black hover:bg-gray-100 hover:text-gray-600 transition-colors w-full'
                }
                onClick={() => {
                  setLoadingComponents(false)
                }}
              >
                <SiGoogletagmanager className="text-secundario text-xl" /> {!openSidebar && 'CM Logos Perú'}
              </Link>
            </li>
            <li>
              <Link
                to="community-manager"
                className={
                  'flex items-center gap-4 py-2 px-4 rounded-lg text-black hover:bg-gray-100 hover:text-gray-600 transition-colors w-full'
                }
                onClick={() => {
                  setLoadingComponents(false)
                }}
              >
                <FaMeta className="text-secundario text-xl" /> {!openSidebar && 'Community Manager'}
              </Link>
            </li>
          </ul>
        </div>
        <nav>
          <Link
            to={''}
            onClick={() => {
              void cerrarSession()
            }}
            className= 'flex items-center gap-4 py-2 px-4 rounded-lg text-black hover:bg-white hover:text-gray-600 transition-colors w-full'

          >
            <RiLogoutCircleRLine className="text-secundario " /> {!openSidebar && 'Cerrar sesión'}
          </Link>
        </nav>
      </div>
    </>
  )
}

export default SideBar
