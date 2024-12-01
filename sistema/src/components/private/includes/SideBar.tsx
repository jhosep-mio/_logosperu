/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useState, Fragment, useEffect } from 'react'
import { IoDocumentAttach } from 'react-icons/io5'
import { Link } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
// Icons
import { RiLogoutCircleRLine, RiArrowRightSLine, RiMenu3Line, RiCloseLine, RiStackFill } from 'react-icons/ri'
import { MdNotificationsActive, MdDashboard, MdOutlineReduceCapacity, MdArticle } from 'react-icons/md'
import axios from 'axios'
import { Global } from '../../../helper/Global'
import logo from './../../../assets/logo/logo.png'
import { type RolsValues } from '../../shared/schemas/Interfaces'
import { SiGoogletagmanager } from 'react-icons/si'
import { FaBriefcase, FaChartSimple, FaCode, FaMeta, FaRectangleList, FaRegCalendarDays, FaServer, FaUserGroup } from 'react-icons/fa6'
import { BsMotherboardFill, BsPersonVcardFill } from 'react-icons/bs'
import { HiRectangleGroup } from 'react-icons/hi2'
import { FaTasks } from 'react-icons/fa'
import { ModalRegistroLaboral } from '../tables/asistencia_laboral/ModalRegistroLaboral'
import { calcularTiempoTrabajadoActividades } from '../../shared/functions/QuitarAcerntos'
import NotificacionHoras from '../tables/notificacion_horas/NotificacionHoras'

const SideBar = (): JSX.Element => {
  const {
    auth,
    roles,
    setLoading: setLoadingCerr,
    setLoadingComponents,
    setopenNotificacionReuniones,
    openNotificacionReuniones,
    loadingComponents,
    totalNotificaciones,
    downloadProgress,
    notificateToReuniones
  } = useAuth()
  const token = localStorage.getItem('token')
  const [showMenu, setShowMenu] = useState(false)
  const [loading, setLoading] = useState(true)
  const [openRegistro, setopenRegistro] = useState(false)
  const [showSubmenu3, setShowSubmenu3] = useState(false)
  //   const [showSubmenu4, setShowSubmenu4] = useState(false)
  //   const [showSubmenu5, setShowSubmenu5] = useState(false)
  const [showSubmenu6, setShowSubmenu6] = useState(false)
  const [showSubmenu9, setShowSubmenu9] = useState(false)
  const [showSubmenu10, setShowSubmenu10] = useState(false)
  const [showSubmenu11, setShowSubmenu11] = useState(false)
  const [showSubmenu13, setShowSubmenu13] = useState(false)
  const [showSubmenu14, setShowSubmenu14] = useState(false)
  const [showSubmenu15, setShowSubmenu15] = useState(false)

  const [activeItem, setActiveItem] = useState(0)
  const [activeItem2, setActiveItem2] = useState(0)
  //   const [events, setEvents] = useState<Event[]>([])
  const [Event, setEvent] = useState<any | undefined>(undefined)
  const [tiempoTrabajado, setTiempoTrabajado] = useState(0)
  const [idEvent, setIdEvent] = useState(null)

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

  const handleItemClick = (itemId: number): void => {
    setActiveItem(itemId)
  }

  const handleItemClick2 = (itemId: number): void => {
    setActiveItem2(itemId)
  }

  const obtenerSumatoriaTiempoTrabajadoActividades = (Event: any): number => {
    let sumatoriaTiempoTrabajado = 0
    const fechaHoy = new Date() // Obtener la fecha actual

    if (Event.timeRanges) {
      Event.timeRanges.forEach((timeRange: any) => {
        const start = new Date(timeRange.start)
        if (start.getDate() === fechaHoy.getDate() && start.getMonth() === fechaHoy.getMonth() && start.getFullYear() === fechaHoy.getFullYear()) {
          if (Event.detalle) {
            // Iterar sobre las claves en "detalle" (por hora)
            Object.keys(Event.detalle).forEach((hora: string) => {
              const actividadesHoy = Event.detalle[hora].filter((actividad: any) => {
                const actividadDate = new Date(`${start.toDateString()} ${actividad.horaInicio}`)
                return actividadDate.toDateString() === fechaHoy.toDateString()
              })
              const tiempoTrabajado = calcularTiempoTrabajadoActividades(actividadesHoy)
              sumatoriaTiempoTrabajado += tiempoTrabajado
            })
          }
        }
      })
    }

    return sumatoriaTiempoTrabajado
  }

  const getHorarioLaboral = async (): Promise<void> => {
    try {
      const request = await axios.get(`${Global.url}/getOneHorarioLaboral/${auth.id ?? ''}`, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      if (request.data.array_horario) {
        setEvent(JSON.parse(request.data.array_horario))
        setIdEvent(request.data.id)
        setTiempoTrabajado(obtenerSumatoriaTiempoTrabajadoActividades(JSON.parse(request.data.array_horario)))
      }
    } catch (error) {
      console.error('Error al obtener el horario laboral:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getHorarioLaboral()
  }, [])

  return (
    <>
      {auth.id == '108' && <NotificacionHoras />}
      <div
        className={`manejar_Scroll  bannerMain xl:h-[100vh] md:overflow-y-scroll fixed xl:static w-[80%] md:w-[40%] lg:w-[30%] xl:w-auto h-full top-0 bg-[#ffff] shadow-xl py-4 flex flex-col justify-between z-50 ${
          showMenu ? 'left-0' : 'left-full'
        } transition-all`}
      >
        {/* asistencia laboral */}
        {auth.id_rol != 99 && (
          <ModalRegistroLaboral
            Event={Event}
            open={openRegistro}
            idEvent={idEvent}
            setOpen={setopenRegistro}
            // setEvents={setEvents}
            // events={events}
            tiempoTrabajado={tiempoTrabajado}
            setLoading={setLoading}
            loading={loading}
            getHorarioLaboral={getHorarioLaboral}
          />
        )}
        <div>
          <h1 className="text-center text-2xl font-bold pb-5 text-black  relative overflow-hidden">
            <img src={logo} alt="" className="m-auto w-[5.4rem]" />
          </h1>
          <hr className="mb-5 px-4" />
          <ul className="ml-0 p-0 2xl:px-4 text-base md:text-sm 2xl:text-base">
            {auth.id_rol != 99 && (
              <li className="">
                <button
                  className={
                    'flex items-center gap-3 py-2 animate-pulse rounded-lg text-white justify-center text-center bg-main mb-4 transition-colors w-full relative'
                  }
                  onClick={() => {
                    setopenRegistro(!openRegistro)
                  }}
                >
                  {!Event ? 'Registrar asistencia' : 'Registrar actividades'}
                </button>
              </li>
            )}
            <li className="">
              <button
                className={
                  'flex items-center justify-between gap-3 py-2 pl-4 rounded-lg text-black hover:bg-main_2-100 hover:text-main transition-colors w-full relative'
                }
                onClick={() => {
                  setLoadingComponents(!loadingComponents)
                  setopenNotificacionReuniones(false)
                  setShowMenu(false)
                }}
              >
                <span className="flex items-center gap-3">
                  <MdNotificationsActive className="text-main/80 text-2xl" />
                  Notificaciones
                </span>
                <span className="bg-main text-white w-5 h-5 text-xs flex justify-center items-center  rounded-md ">{totalNotificaciones}</span>
              </button>
            </li>
            <li className="">
              <button
                className={
                  'flex items-center justify-between gap-3 py-2 pl-4 rounded-lg text-black hover:bg-main_2-100 hover:text-main transition-colors w-full relative'
                }
                onClick={() => {
                  setopenNotificacionReuniones(!openNotificacionReuniones)
                  setLoadingComponents(false)
                  setShowMenu(false)
                }}
              >
                <span className="flex items-center gap-3">
                  <MdNotificationsActive className="text-yellow-500 text-2xl" />
                  Reuniones
                </span>
                <span className="bg-main text-white w-5 h-5 text-xs flex justify-center items-center  rounded-md ">
                  {notificateToReuniones ? notificateToReuniones.length : 0}
                </span>
              </button>
            </li>
            <li>
              <Link
                to="gestor-tareas"
                className={'flex items-center gap-4 py-2 px-4 rounded-lg text-black hover:bg-main_2-100 hover:text-main transition-colors w-full'}
                onClick={() => {
                  handleItemClick2(1)
                  setShowMenu(false)
                  setLoadingComponents(false)
                  setopenNotificacionReuniones(false)
                }}
              >
                <FaTasks className="text-main/80 text-xl " />
                <span className="line-clamp-1">Gestor de tareas</span>
              </Link>
            </li>
            {auth.id_rol != 99 && (
              <li>
                <button
                  onClick={() => {
                    setShowSubmenu15(!showSubmenu15)
                  }}
                  className="flex items-center gap-4 py-2 px-4 rounded-lg text-black hover:bg-main_2-100 hover:text-main transition-colors w-full"
                >
                  <span className="flex items-center gap-4 w-full">
                    <MdArticle className="text-main/80 text-xl" /> Newsletter
                  </span>
                  <RiArrowRightSLine className={`mt-1 ${showSubmenu15 ? 'rotate-90' : ''} transition-all`} />
                </button>
                <ul className={` ml-0 ${showSubmenu15 ? '' : 'h-0'} overflow-hidden transition-all`}>
                  <li>
                    <Link
                      to="newsletter/categorias"
                      className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                        activeItem == 340002 ? 'before:bg-main' : 'before:bg-gray-500'
                      } hover:text-main transition-colors`}
                      onClick={() => {
                        handleItemClick(340002)
                        setShowMenu(false)
                        setLoadingComponents(false)
                        setopenNotificacionReuniones(false)
                      }}
                    >
                      Categorias
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="newsletter/articulos"
                      className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                        activeItem == 1004222 ? 'before:bg-main' : 'before:bg-gray-500'
                      } hover:text-main transition-colors`}
                      onClick={() => {
                        handleItemClick(1004222)
                        setShowMenu(false)
                        setLoadingComponents(false)
                        setopenNotificacionReuniones(false)
                      }}
                    >
                      Articulos
                    </Link>
                  </li>
                </ul>
              </li>
            )}
            {auth.id_rol != 99 && (
              <li>
                <Link
                  to="/admin/colaboradores/horario-laboral-user"
                  className={'flex items-center gap-4 py-2 px-4 rounded-lg text-black hover:bg-main_2-100 hover:text-main transition-colors w-full'}
                  onClick={() => {
                    handleItemClick2(1)
                    setShowMenu(false)
                    setLoadingComponents(false)
                    setopenNotificacionReuniones(false)
                  }}
                >
                  <FaRegCalendarDays className="text-main/80 text-xl" />
                  <span className="line-clamp-1">Horario Laboral</span>
                </Link>
              </li>
            )}
            {roles.map(
              (role: RolsValues): React.ReactNode =>
                auth.id_rol == role.id &&
                JSON.parse(role.accesos).map((route: { peso: string }) => (
                  <>
                    {route.peso == 'superusuario'
                      ? (
                      <>
                        <li key={230}>
                          <button
                            onClick={() => {
                              setShowSubmenu10(!showSubmenu10)
                            }}
                            className="flex items-center gap-4 py-2 px-4 rounded-lg text-black hover:bg-main_2-100 hover:text-main transition-colors w-full"
                          >
                            <span className="flex items-center gap-4 w-full">
                              <FaRectangleList className="text-main/80 text-xl" /> Preventa
                            </span>
                            <RiArrowRightSLine className={`mt-1 ${showSubmenu10 ? 'rotate-90' : ''} transition-all`} />
                          </button>
                          <ul className={` ml-0 ${showSubmenu10 ? '' : 'h-0'} overflow-hidden transition-all`}>
                            <li>
                              <Link
                                to="lista-preventa"
                                className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                  activeItem == 1001 ? 'before:bg-main' : 'before:bg-gray-500'
                                } hover:text-main transition-colors`}
                                onClick={() => {
                                  handleItemClick(1001)
                                  setShowMenu(false)
                                  setLoadingComponents(false)
                                  setopenNotificacionReuniones(false)
                                }}
                              >
                                Ventas no concluidas
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="lista-cotizaciones"
                                className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                  activeItem == 1002 ? 'before:bg-main' : 'before:bg-gray-500'
                                } hover:text-main transition-colors`}
                                onClick={() => {
                                  handleItemClick(1002)
                                  setShowMenu(false)
                                  setLoadingComponents(false)
                                  setopenNotificacionReuniones(false)
                                }}
                              >
                                Cotizaciones
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="lista-contratos"
                                className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                  activeItem == 1005 ? 'before:bg-main' : 'before:bg-gray-500'
                                } hover:text-main transition-colors`}
                                onClick={() => {
                                  handleItemClick(1005)
                                  setShowMenu(false)
                                  setLoadingComponents(false)
                                  setopenNotificacionReuniones(false)
                                }}
                              >
                                Contratos
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="lista-cupones"
                                className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                  activeItem == 1005 ? 'before:bg-main' : 'before:bg-gray-500'
                                } hover:text-main transition-colors`}
                                onClick={() => {
                                  handleItemClick(1005)
                                  setShowMenu(false)
                                  setLoadingComponents(false)
                                  setopenNotificacionReuniones(false)
                                }}
                              >
                                Cupones
                              </Link>
                            </li>
                            <ul className={` ${showSubmenu10 ? '' : 'h-0'} overflow-hidden transition-all`}>
                              <button
                                onClick={() => {
                                  setShowSubmenu11(!showSubmenu11)
                                  handleItemClick(1003)
                                }}
                                className={`bg-transparent ${
                                  showSubmenu11 ? 'after:absolute after:w-4 after:bg-gray-500 after:h-[1px] after:bottom-0 after:left-0' : ''
                                }  py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                  activeItem == 1003 ? 'before:bg-main' : 'before:bg-gray-500'
                                } hover:text-main transition-colors`}
                              >
                                <span className="flex items-center gap-4 w-full ">Clientes</span>
                                <RiArrowRightSLine className={`mt-1  ${showSubmenu11 ? 'rotate-90' : ''} transition-all`} />
                              </button>
                              <ul className={` ml-4 ${showSubmenu11 ? '' : 'h-0'} overflow-hidden transition-all`}>
                                <li>
                                  <Link
                                    to="lista-clientes"
                                    className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                      activeItem == 399 ? 'before:bg-main' : 'before:bg-gray-500'
                                    } hover:text-main transition-colors`}
                                    onClick={() => {
                                      handleItemClick(399)
                                      setShowMenu(false)
                                      setLoadingComponents(false)
                                      setopenNotificacionReuniones(false)
                                    }}
                                  >
                                    Clientes
                                  </Link>
                                  <Link
                                    to="lista-clientes/conproyectos"
                                    className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                      activeItem == 699 ? 'before:bg-main' : 'before:bg-gray-500'
                                    } hover:text-main transition-colors`}
                                    onClick={() => {
                                      handleItemClick(699)
                                      setShowMenu(false)
                                      setLoadingComponents(false)
                                      setopenNotificacionReuniones(false)
                                    }}
                                  >
                                    Con proyectos
                                  </Link>
                                  <Link
                                    to="lista-preventa/sinproyectos"
                                    className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                      activeItem == 499 ? 'before:bg-main' : 'before:bg-gray-500'
                                    } hover:text-main transition-colors`}
                                    onClick={() => {
                                      handleItemClick(499)
                                      setShowMenu(false)
                                      setLoadingComponents(false)
                                      setopenNotificacionReuniones(false)
                                    }}
                                  >
                                    Sin proyectos
                                  </Link>
                                  <Link
                                    to="lista-pre-clientes"
                                    className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                      activeItem == 339 ? 'before:bg-main' : 'before:bg-gray-500'
                                    } hover:text-main transition-colors`}
                                    onClick={() => {
                                      handleItemClick(339)
                                      setShowMenu(false)
                                      setLoadingComponents(false)
                                      setopenNotificacionReuniones(false)
                                    }}
                                  >
                                    Pre-Clientes
                                  </Link>
                                </li>
                                <ul className={` ${showSubmenu11 ? '' : 'h-0'} overflow-hidden transition-all`}>
                                  <button
                                    onClick={() => {
                                      setShowSubmenu9(!showSubmenu9)
                                      handleItemClick(397)
                                    }}
                                    className={`bg-transparent ${
                                      showSubmenu9 ? 'after:absolute after:w-4 after:bg-gray-500 after:h-[1px] after:bottom-0 after:left-0' : ''
                                    }  py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                      activeItem == 397 ? 'before:bg-main' : 'before:bg-gray-500'
                                    } hover:text-main transition-colors`}
                                  >
                                    <span className="flex items-center gap-4 w-full ">Citas</span>
                                    <RiArrowRightSLine className={`mt-1  ${showSubmenu9 ? 'rotate-90' : ''} transition-all`} />
                                  </button>
                                  <ul className={` ml-4 ${showSubmenu9 ? '' : 'h-0'} overflow-y-hidden transition-all`}>
                                    <li>
                                      <Link
                                        to={'/admin/llamadas-pendientes'}
                                        className={`py-2 px-4 border-l  flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                          activeItem == 375 ? 'before:bg-main' : 'before:bg-gray-500'
                                        } hover:text-main transition-colors`}
                                        onClick={() => {
                                          handleItemClick(375)
                                          setShowMenu(false)
                                          setLoadingComponents(false)
                                          setopenNotificacionReuniones(false)
                                        }}
                                      >
                                        Pendientes
                                      </Link>
                                    </li>
                                    <li>
                                      <Link
                                        to={'/admin/lista-historial'}
                                        className={`py-2 px-4 border-l  flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                          activeItem == 395 ? 'before:bg-main' : 'before:bg-gray-500'
                                        } hover:text-main transition-colors`}
                                        onClick={() => {
                                          handleItemClick(395)
                                          setShowMenu(false)
                                          setLoadingComponents(false)
                                          setopenNotificacionReuniones(false)
                                        }}
                                      >
                                        Historial
                                      </Link>
                                    </li>
                                  </ul>
                                </ul>
                              </ul>
                            </ul>
                          </ul>
                        </li>
                        <li key={24}>
                          <button
                            onClick={() => {
                              setShowSubmenu6(!showSubmenu6)
                            }}
                            className="flex items-center gap-4 py-2 px-4 rounded-lg text-black hover:bg-main_2-100 hover:text-main transition-colors w-full"
                          >
                            <span className="flex items-center gap-4 w-full">
                              <FaChartSimple className="text-main/80 text-xl" /> Proyectos
                            </span>
                            <RiArrowRightSLine className={`mt-1 ${showSubmenu6 ? 'rotate-90' : ''} transition-all`} />
                          </button>
                          <ul className={` ml-0 ${showSubmenu6 ? '' : 'h-0'} overflow-hidden transition-all`}>
                            <ul className={` ${showSubmenu6 ? '' : 'h-0'} overflow-hidden transition-all`}>
                              <Link
                                to="/admin/lista-ventas"
                                className={`bg-transparent  py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                  activeItem == 299 ? 'before:bg-main' : 'before:bg-gray-500'
                                } hover:text-main transition-colors`}
                              >
                                <span className="flex items-center gap-4 w-full ">Proyectos de clientes</span>
                              </Link>
                            </ul>
                            <li>
                              <Link
                                to="lista-hosting"
                                className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                  activeItem == 288 ? 'before:bg-main' : 'before:bg-gray-500'
                                } hover:text-main transition-colors`}
                                onClick={() => {
                                  handleItemClick(288)
                                  setShowMenu(false)
                                  setLoadingComponents(false)
                                  setopenNotificacionReuniones(false)
                                }}
                              >
                                Obsequios Hosting
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="lista-ventas-agencia"
                                className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                  activeItem == 291 ? 'before:bg-main' : 'before:bg-gray-500'
                                } hover:text-main transition-colors`}
                                onClick={() => {
                                  handleItemClick(291)
                                  setShowMenu(false)
                                  setLoadingComponents(false)
                                  setopenNotificacionReuniones(false)
                                }}
                              >
                                Proyectos de agencia
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="lista-planes"
                                className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                  activeItem == 1004 ? 'before:bg-main' : 'before:bg-gray-500'
                                } hover:text-main transition-colors`}
                                onClick={() => {
                                  handleItemClick(1004)
                                  setShowMenu(false)
                                  setLoadingComponents(false)
                                  setopenNotificacionReuniones(false)
                                }}
                              >
                                Planes
                              </Link>
                            </li>
                            <ul className={` ${showSubmenu6 ? '' : 'h-0'} overflow-hidden transition-all`}>
                              <button
                                onClick={() => {
                                  setShowSubmenu3(!showSubmenu3)
                                  handleItemClick(288)
                                }}
                                className={`bg-transparent ${
                                  showSubmenu3 ? 'after:absolute after:w-4 after:bg-gray-500 after:h-[1px] after:bottom-0 after:left-0' : ''
                                }  py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                  activeItem == 288 ? 'before:bg-main' : 'before:bg-gray-500'
                                } hover:text-main transition-colors`}
                              >
                                <span className="flex items-center gap-4 w-full ">Briefs</span>
                                <RiArrowRightSLine className={`mt-1  ${showSubmenu3 ? 'rotate-90' : ''} transition-all`} />
                              </button>
                              <ul className={` ml-4 ${showSubmenu3 ? '' : 'h-0'} overflow-y-hidden transition-all`}>
                                <li>
                                  <ul className={` ${showSubmenu3 ? 'h-[320px]' : 'h-0'} overflow-y-hidden transition-all`}>
                                    {roles.map(
                                      (role: RolsValues): React.ReactNode =>
                                        auth.id_rol == role.id &&
                                        JSON.parse(role.accesos).map((route: { peso: string }, index: number) => (
                                          <>
                                            {route.peso == 'superusuario' || route.peso == 'diseño'
                                              ? (
                                              <Fragment key={index}>
                                                <li>
                                                  <Link
                                                    to="lista-briefs-diseños-new"
                                                    className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                                      activeItem2 == 1 ? 'before:bg-main' : 'before:bg-gray-500'
                                                    } hover:text-main transition-colors`}
                                                    onClick={() => {
                                                      handleItemClick2(1)
                                                      setShowMenu(false)
                                                      setLoadingComponents(false)
                                                    }}
                                                  >
                                                    Logotipo
                                                  </Link>
                                                </li>
                                                <li>
                                                  <Link
                                                    to="lista-briefs-brochure"
                                                    className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                                      activeItem2 == 999 ? 'before:bg-main' : 'before:bg-gray-500'
                                                    } hover:text-main transition-colors`}
                                                    onClick={() => {
                                                      handleItemClick2(999)
                                                      setShowMenu(false)
                                                      setLoadingComponents(false)
                                                    }}
                                                  >
                                                    Brochure
                                                  </Link>
                                                </li>
                                                <li>
                                                  <Link
                                                    to="lista-briefs-flyer"
                                                    className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                                      activeItem2 == 998 ? 'before:bg-main' : 'before:bg-gray-500'
                                                    } hover:text-main transition-colors`}
                                                    onClick={() => {
                                                      handleItemClick2(998)
                                                      setShowMenu(false)
                                                      setLoadingComponents(false)
                                                    }}
                                                  >
                                                    Flyer
                                                  </Link>
                                                </li>
                                                <li>
                                                  <Link
                                                    to="lista-briefs-comunity"
                                                    className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                                      activeItem2 == 997 ? 'before:bg-main' : 'before:bg-gray-500'
                                                    } hover:text-main transition-colors`}
                                                    onClick={() => {
                                                      handleItemClick2(997)
                                                      setShowMenu(false)
                                                      setLoadingComponents(false)
                                                    }}
                                                  >
                                                    Comunity
                                                  </Link>
                                                </li>
                                                <li>
                                                  <Link
                                                    to="lista-briefs-informativas"
                                                    className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                                      activeItem2 == 223 ? 'before:bg-main' : 'before:bg-gray-500'
                                                    } hover:text-main transition-colors`}
                                                    onClick={() => {
                                                      handleItemClick2(223)
                                                      setShowMenu(false)
                                                      setLoadingComponents(false)
                                                    }}
                                                  >
                                                    Informativas
                                                  </Link>
                                                </li>
                                                <li>
                                                  <Link
                                                    to="lista-briefs-administrables"
                                                    className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                                      activeItem2 == 224 ? 'before:bg-main' : 'before:bg-gray-500'
                                                    } hover:text-main transition-colors`}
                                                    onClick={() => {
                                                      handleItemClick2(224)
                                                      setShowMenu(false)
                                                      setLoadingComponents(false)
                                                    }}
                                                  >
                                                    Administrables
                                                  </Link>
                                                </li>
                                                <li>
                                                  <Link
                                                    to="lista-briefs-landing"
                                                    className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                                      activeItem2 == 225 ? 'before:bg-main' : 'before:bg-gray-500'
                                                    } hover:text-main transition-colors`}
                                                    onClick={() => {
                                                      handleItemClick2(225)
                                                      setShowMenu(false)
                                                      setLoadingComponents(false)
                                                    }}
                                                  >
                                                    Landing page
                                                  </Link>
                                                </li>
                                                <li>
                                                  <Link
                                                    to="lista-briefs-tienda"
                                                    className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                                      activeItem2 == 226 ? 'before:bg-main' : 'before:bg-gray-500'
                                                    } hover:text-main transition-colors`}
                                                    onClick={() => {
                                                      handleItemClick2(226)
                                                      setShowMenu(false)
                                                      setLoadingComponents(false)
                                                    }}
                                                  >
                                                    Tienda V.
                                                  </Link>
                                                </li>
                                              </Fragment>
                                                )
                                              : (
                                                  ''
                                                )}
                                          </>
                                        ))
                                    )}
                                  </ul>
                                </li>
                              </ul>
                            </ul>
                            <li>
                              <Link
                                to="lista-ventas-vencidos"
                                className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                  activeItem == 298 ? 'before:bg-main' : 'before:bg-gray-500'
                                } hover:text-main transition-colors`}
                                onClick={() => {
                                  handleItemClick(298)
                                  setShowMenu(false)
                                  setLoadingComponents(false)
                                  setopenNotificacionReuniones(false)
                                }}
                              >
                                Proyectos vencidos
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li key="hosting1">
                          <Link
                            to="lista-community"
                            className={
                              'flex items-center gap-4 py-2 px-4 rounded-lg text-black hover:bg-main_2-100 hover:text-main transition-colors w-full'
                            }
                            onClick={() => {
                              handleItemClick2(999)
                              setShowMenu(false)
                              setLoadingComponents(false)
                              setopenNotificacionReuniones(false)
                            }}
                          >
                            <FaMeta className="text-main/80 text-xl" /> Community
                          </Link>
                        </li>
                        <li key="desarrollo_web">
                          <Link
                            to="lista-desarrollo_web"
                            className={
                              'flex items-center gap-4 py-2 px-4 rounded-lg text-black hover:bg-main_2-100 hover:text-main transition-colors w-full'
                            }
                            onClick={() => {
                              handleItemClick2(999)
                              setShowMenu(false)
                              setLoadingComponents(false)
                              setopenNotificacionReuniones(false)
                            }}
                          >
                            <FaCode className="text-main/80 text-xl" /> <span className="line-clamp-1">Desarrollo web</span>
                          </Link>
                        </li>
                        <li key="hosting2">
                          <Link
                            to="hosting"
                            className={
                              'flex items-center gap-4 py-2 px-4 rounded-lg text-black hover:bg-main_2-100 hover:text-main transition-colors w-full'
                            }
                            onClick={() => {
                              handleItemClick2(999)
                              setShowMenu(false)
                              setLoadingComponents(false)
                              setopenNotificacionReuniones(false)
                            }}
                          >
                            <FaServer className="text-main/80 text-xl" /> Hosting
                          </Link>
                        </li>
                        <li key="capacitaciones">
                          <Link
                            to="capacitaciones"
                            className={
                              'flex items-center gap-4 py-2 px-4 rounded-lg text-black hover:bg-main_2-100 hover:text-main transition-colors w-full'
                            }
                            onClick={() => {
                              handleItemClick2(999)
                              setShowMenu(false)
                              setLoadingComponents(false)
                              setopenNotificacionReuniones(false)
                            }}
                          >
                            <MdOutlineReduceCapacity className="text-main/80 text-xl" /> Capacitaciones
                          </Link>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              setShowSubmenu13(!showSubmenu13)
                            }}
                            className="flex items-center gap-4 py-2 px-4 rounded-lg text-black hover:bg-main_2-100 hover:text-main transition-colors w-full"
                          >
                            <span className="flex items-center gap-4 w-full">
                              <BsPersonVcardFill className="text-main/80 text-xl" /> Colaboradores
                            </span>
                            <RiArrowRightSLine className={`mt-1 ${showSubmenu13 ? 'rotate-90' : ''} transition-all`} />
                          </button>
                          <ul className={` ml-0 ${showSubmenu13 ? '' : 'h-0'} overflow-hidden transition-all`}>
                            <li>
                              <Link
                                to="colaboradores"
                                className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                  activeItem == 344 ? 'before:bg-main' : 'before:bg-gray-500'
                                } hover:text-main transition-colors`}
                                onClick={() => {
                                  handleItemClick(344)
                                  setShowMenu(false)
                                  setLoadingComponents(false)
                                  setopenNotificacionReuniones(false)
                                }}
                              >
                                Colaboradores
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="colaboradores/horario-laboral"
                                className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                  activeItem == 1004 ? 'before:bg-main' : 'before:bg-gray-500'
                                } hover:text-main transition-colors`}
                                onClick={() => {
                                  handleItemClick(1004)
                                  setShowMenu(false)
                                  setLoadingComponents(false)
                                  setopenNotificacionReuniones(false)
                                }}
                              >
                                Horario laboral
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              setShowSubmenu14(!showSubmenu14)
                            }}
                            className="flex items-center gap-4 py-2 px-4 rounded-lg text-black hover:bg-main_2-100 hover:text-main transition-colors w-full"
                          >
                            <span className="flex items-center gap-4 w-full">
                              <BsMotherboardFill className="text-main/80 text-xl" /> Otros
                            </span>
                            <RiArrowRightSLine className={`mt-1 ${showSubmenu14 ? 'rotate-90' : ''} transition-all`} />
                          </button>
                          <ul className={` ml-0 ${showSubmenu14 ? '' : 'h-0'} overflow-hidden transition-all`}>
                            <li className="pl-4" key="clasificados">
                              <Link
                                to="lista-clasificados"
                                className={
                                  'flex items-center gap-4 py-2 px-4 rounded-lg text-black hover:bg-main_2-100 hover:text-main transition-colors w-full'
                                }
                                onClick={() => {
                                  handleItemClick2(25)
                                  setShowMenu(false)
                                  setLoadingComponents(false)
                                  setopenNotificacionReuniones(false)
                                }}
                              >
                                <HiRectangleGroup className="text-main/80 text-xl" /> Clasificados
                              </Link>
                            </li>
                            <li className="pl-4" key={236}>
                              <Link
                                to="dashboard"
                                className={
                                  'flex items-center gap-4 py-2 px-4 rounded-lg text-black hover:bg-main_2-100 hover:text-main transition-colors w-full'
                                }
                                onClick={() => {
                                  handleItemClick2(1)
                                  setShowMenu(false)
                                  setLoadingComponents(false)
                                  setopenNotificacionReuniones(false)
                                }}
                              >
                                <MdDashboard className="text-main/80 text-xl" /> Metricas
                              </Link>
                            </li>
                            <li className="pl-4" key={2336}>
                              <Link
                                to="transacciones-list"
                                className={
                                  'flex items-center gap-4 py-2 px-4 rounded-lg text-black hover:bg-main_2-100 hover:text-main transition-colors w-full'
                                }
                                onClick={() => {
                                  handleItemClick2(1)
                                  setShowMenu(false)
                                  setLoadingComponents(false)
                                  setopenNotificacionReuniones(false)
                                }}
                              >
                                <MdDashboard className="text-main/80 text-xl" /> Transacciones
                              </Link>
                            </li>
                            <li className="pl-4" key={237}>
                              <Link
                                to="carrito-list"
                                className={
                                  'flex items-center gap-4 py-2 px-4 rounded-lg text-black hover:bg-main_2-100 hover:text-main transition-colors w-full'
                                }
                                onClick={() => {
                                  handleItemClick2(444)
                                  setShowMenu(false)
                                  setLoadingComponents(false)
                                  setopenNotificacionReuniones(false)
                                }}
                              >
                                <MdDashboard className="text-main/80 text-xl" /> Carrito
                              </Link>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <button
                            onClick={() => {
                              setShowSubmenu15(!showSubmenu15)
                            }}
                            className="flex items-center gap-4 py-2 px-4 rounded-lg text-black hover:bg-main_2-100 hover:text-main transition-colors w-full"
                          >
                            <span className="flex items-center gap-4 w-full">
                              <MdArticle className="text-main/80 text-xl" /> Newsletter
                            </span>
                            <RiArrowRightSLine className={`mt-1 ${showSubmenu15 ? 'rotate-90' : ''} transition-all`} />
                          </button>
                          <ul className={` ml-0 ${showSubmenu15 ? '' : 'h-0'} overflow-hidden transition-all`}>
                            <li>
                              <Link
                                to="newsletter/categorias"
                                className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                  activeItem == 340002 ? 'before:bg-main' : 'before:bg-gray-500'
                                } hover:text-main transition-colors`}
                                onClick={() => {
                                  handleItemClick(340002)
                                  setShowMenu(false)
                                  setLoadingComponents(false)
                                  setopenNotificacionReuniones(false)
                                }}
                              >
                                Categorias
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="newsletter/articulos"
                                className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                  activeItem == 1004222 ? 'before:bg-main' : 'before:bg-gray-500'
                                } hover:text-main transition-colors`}
                                onClick={() => {
                                  handleItemClick(1004222)
                                  setShowMenu(false)
                                  setLoadingComponents(false)
                                  setopenNotificacionReuniones(false)
                                }}
                              >
                                Articulos
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="newsletter/mails"
                                className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                  activeItem == 1004222 ? 'before:bg-main' : 'before:bg-gray-500'
                                } hover:text-main transition-colors`}
                                onClick={() => {
                                  handleItemClick(1004222)
                                  setShowMenu(false)
                                  setLoadingComponents(false)
                                  setopenNotificacionReuniones(false)
                                }}
                              >
                                Mails
                              </Link>
                            </li>
                          </ul>
                        </li>
                      </>
                        )
                      : (
                          ''
                        )}
                  </>
                ))
            )}
            {roles.map(
              (role: RolsValues): React.ReactNode =>
                auth.id_rol == role.id &&
                JSON.parse(role.accesos).map((route: { peso: string }) => (
                  <>
                    {route.peso != 'superusuario' && (
                      <li key={274}>
                        <button
                          onClick={() => {
                            setShowSubmenu6(!showSubmenu6)
                          }}
                          className="flex items-center gap-4 py-2 px-4 rounded-lg text-black hover:bg-main_2-100 hover:text-main transition-colors w-full"
                        >
                          <span className="flex items-center gap-4 w-full">
                            <FaChartSimple className="text-main/80 text-xl" /> Proyectos
                          </span>
                          <RiArrowRightSLine className={`mt-1 ${showSubmenu6 ? 'rotate-90' : ''} transition-all`} />
                        </button>
                        <ul className={` ml-0 ${showSubmenu6 ? '' : 'h-0'} overflow-hidden transition-all`}>
                          <li>
                            <Link
                              to="lista-servicios"
                              className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                activeItem == 2977 ? 'before:bg-main' : 'before:bg-gray-500'
                              } hover:text-main transition-colors`}
                              onClick={() => {
                                handleItemClick(2977)
                                setShowMenu(false)
                                setLoadingComponents(false)
                                setopenNotificacionReuniones(false)
                              }}
                            >
                              Proyectos de clientes
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="lista-hosting"
                              className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                activeItem == 291 ? 'before:bg-main' : 'before:bg-gray-500'
                              } hover:text-main transition-colors`}
                              onClick={() => {
                                handleItemClick(291)
                                setShowMenu(false)
                                setLoadingComponents(false)
                                setopenNotificacionReuniones(false)
                              }}
                            >
                              Obsequios Hosting
                            </Link>
                          </li>
                          <li>
                            <Link
                              to="lista-servicios-agencia"
                              className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                activeItem == 2911 ? 'before:bg-main' : 'before:bg-gray-500'
                              } hover:text-main transition-colors`}
                              onClick={() => {
                                handleItemClick(2911)
                                setShowMenu(false)
                                setLoadingComponents(false)
                                setopenNotificacionReuniones(false)
                              }}
                            >
                              Proyectos de agencia
                            </Link>
                          </li>
                        </ul>
                        {auth.rol == 'desarrollador'
                          ? (
                          <>
                            <li key="hosting2">
                              <Link
                                to="soporte-hosting"
                                className={
                                  'flex items-center gap-4 py-2 px-4 rounded-lg text-black hover:bg-main_2-100 hover:text-main transition-colors w-full'
                                }
                                onClick={() => {
                                  handleItemClick2(999)
                                  setShowMenu(false)
                                  setLoadingComponents(false)
                                  setopenNotificacionReuniones(false)
                                }}
                              >
                                <FaServer className="text-main/80 text-xl" /> Soporte Hosting
                              </Link>
                            </li>
                            <li key="">
                              <Link
                                to="lista-ventas-vencidos"
                                className={
                                  'flex items-center gap-4 py-2 px-4 rounded-lg text-black hover:bg-main_2-100 hover:text-main transition-colors w-full'
                                }
                                onClick={() => {
                                  handleItemClick2(555)
                                  setShowMenu(false)
                                  setLoadingComponents(false)
                                  setopenNotificacionReuniones(false)
                                }}
                              >
                                <FaServer className="text-main/80 text-xl" /> Proyectos vencidos
                              </Link>
                            </li>
                            <li>
                              <Link
                                to="clientes"
                                className={
                                  'flex items-center gap-4 py-2 px-4 rounded-lg text-black hover:bg-main_2-100 hover:text-main transition-colors w-full'
                                }
                                onClick={() => {
                                  handleItemClick2(1)
                                  setShowMenu(false)
                                  setLoadingComponents(false)
                                  setopenNotificacionReuniones(false)
                                }}
                              >
                                <FaUserGroup className="text-main/80 text-xl" /> Clientes
                              </Link>
                            </li>
                          </>
                            )
                          : null}
                      </li>
                    )}
                  </>
                ))
            )}

            <li>
              <Link
                to="documentos"
                className={'flex items-center gap-4 py-2 px-4 rounded-lg text-black hover:bg-main_2-100 hover:text-main transition-colors w-full'}
                onClick={() => {
                  handleItemClick2(1)
                  setShowMenu(false)
                  setLoadingComponents(false)
                  setopenNotificacionReuniones(false)
                }}
              >
                <IoDocumentAttach className="text-main/80 text-xl" /> Documentos
              </Link>
            </li>

            {auth.id_rol == 99 || auth.rol == 'diseñador'
              ? (
              <li key={234}>
                <Link
                  to="listadocm"
                  className="flex items-center gap-4 py-2 px-4 rounded-lg text-black hover:bg-main_2-100 hover:text-main transition-colors w-full"
                >
                  <span className="flex items-center gap-4 w-full">
                    <SiGoogletagmanager className="text-main/80 text-xl" /> CM
                  </span>
                </Link>
              </li>
                )
              : null}

            {auth.id_rol == 98 && (
              <li>
                <button
                  onClick={() => {
                    setShowSubmenu3(!showSubmenu3)
                  }}
                  className="flex items-center gap-4 py-2 px-4 rounded-lg text-black hover:bg-main_2-100 hover:text-main transition-colors w-full"
                >
                  <span className="flex items-center gap-4 w-full">
                    <FaBriefcase className="text-main/80 text-[1.15rem] ml-1" /> Briefs
                  </span>
                  <RiArrowRightSLine className={`mt-1 ${showSubmenu3 ? 'rotate-90' : ''} transition-all`} />
                </button>
                <ul className={` ${showSubmenu3 ? 'h-[160px]' : 'h-0'} overflow-y-hidden transition-all`}>
                  {roles.map(
                    (role: RolsValues): React.ReactNode =>
                      auth.id_rol == role.id &&
                      JSON.parse(role.accesos).map((route: { peso: string }, index: number) => (
                        <>
                          {route.peso == 'superusuario' || route.peso == 'diseño'
                            ? (
                            <Fragment key={index}>
                              {auth.rol == 'diseñador'
                                ? (
                                <>
                                  <li>
                                    <Link
                                      to="lista-briefs-diseños-new"
                                      className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                        activeItem2 == 1 ? 'before:bg-main' : 'before:bg-gray-500'
                                      } hover:text-main transition-colors`}
                                      onClick={() => {
                                        handleItemClick2(1)
                                        setShowMenu(false)
                                        setLoadingComponents(false)
                                        setopenNotificacionReuniones(false)
                                      }}
                                    >
                                      <RiStackFill className="text-main" /> Logotipo
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      to="lista-briefs-brochure"
                                      className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                        activeItem2 == 999 ? 'before:bg-main' : 'before:bg-gray-500'
                                      } hover:text-main transition-colors`}
                                      onClick={() => {
                                        handleItemClick2(999)
                                        setShowMenu(false)
                                        setLoadingComponents(false)
                                        setopenNotificacionReuniones(false)
                                      }}
                                    >
                                      <RiStackFill className="text-main" /> Brochure
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      to="lista-briefs-flyer"
                                      className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                        activeItem2 == 998 ? 'before:bg-main' : 'before:bg-gray-500'
                                      } hover:text-main transition-colors`}
                                      onClick={() => {
                                        handleItemClick2(998)
                                        setShowMenu(false)
                                        setLoadingComponents(false)
                                        setopenNotificacionReuniones(false)
                                      }}
                                    >
                                      <RiStackFill className="text-main" /> Flyer
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      to="lista-briefs-comunity"
                                      className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                        activeItem2 == 997 ? 'before:bg-main' : 'before:bg-gray-500'
                                      } hover:text-main transition-colors`}
                                      onClick={() => {
                                        handleItemClick2(997)
                                        setShowMenu(false)
                                        setLoadingComponents(false)
                                        setopenNotificacionReuniones(false)
                                      }}
                                    >
                                      <RiStackFill className="text-main" /> Comunity
                                    </Link>
                                  </li>
                                </>
                                  )
                                : (
                                <>
                                  <li>
                                    <Link
                                      to="lista-briefs-informativas"
                                      className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                        activeItem2 == 997 ? 'before:bg-main' : 'before:bg-gray-500'
                                      } hover:text-main transition-colors`}
                                      onClick={() => {
                                        handleItemClick2(997)
                                        setShowMenu(false)
                                        setLoadingComponents(false)
                                        setopenNotificacionReuniones(false)
                                      }}
                                    >
                                      <RiStackFill className="text-main" /> Informativas
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      to="lista-briefs-administrables"
                                      className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                        activeItem2 == 114 ? 'before:bg-main' : 'before:bg-gray-500'
                                      } hover:text-main transition-colors`}
                                      onClick={() => {
                                        handleItemClick2(114)
                                        setShowMenu(false)
                                        setLoadingComponents(false)
                                        setopenNotificacionReuniones(false)
                                      }}
                                    >
                                      <RiStackFill className="text-main" /> Administrables
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      to="lista-briefs-landing"
                                      className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                        activeItem2 == 115 ? 'before:bg-main' : 'before:bg-gray-500'
                                      } hover:text-main transition-colors`}
                                      onClick={() => {
                                        handleItemClick2(115)
                                        setShowMenu(false)
                                        setLoadingComponents(false)
                                        setopenNotificacionReuniones(false)
                                      }}
                                    >
                                      <RiStackFill className="text-main" /> Landing Page
                                    </Link>
                                  </li>
                                  <li>
                                    <Link
                                      to="lista-briefs-tienda"
                                      className={`py-2 px-4 border-l flex items-center gap-3 text-black border-gray-500 ml-6  relative before:w-3 before:h-3 before:absolute before:bg-primary before:rounded-full before:-left-[6.5px] before:top-1/2 before:-translate-y-1/2 before:border-4 ${
                                        activeItem2 == 116 ? 'before:bg-main' : 'before:bg-gray-500'
                                      } hover:text-main transition-colors`}
                                      onClick={() => {
                                        handleItemClick2(116)
                                        setShowMenu(false)
                                        setLoadingComponents(false)
                                        setopenNotificacionReuniones(false)
                                      }}
                                    >
                                      <RiStackFill className="text-main" /> Tienda
                                    </Link>
                                  </li>
                                </>
                                  )}
                            </Fragment>
                              )
                            : (
                                ''
                              )}
                        </>
                      ))
                  )}
                </ul>
              </li>
            )}
          </ul>
        </div>
        <nav>
          <img src="https://logosperu.com.pe/assets/images/footer/gatito_footer.gif" alt="" className="w-full" />
          <Link
            to={''}
            onClick={() => {
              void cerrarSession()
            }}
            className="flex items-center gap-4 py-2 px-4 rounded-lg hover:bg-main_2-100 text-main transition-colors hover:text-main"
          >
            <RiLogoutCircleRLine className="text-main " /> Cerrar sesión
          </Link>
        </nav>
      </div>
      {downloadProgress != 0 && downloadProgress != 100 && (
        <div className="w-full md:w-96 absolute right-0 md:right-3 bottom-0 z-[999999] bg-white  py-3 px-4 rounded-t-lg shadow-black shadow-md">
          <h2 className="text-center w-full text-black font-medium mb-4 text-lg">Descarga de archivos</h2>
          <div className="relative flex items-center justify-center">
            <p className="text-black font-bold absolute inset-0 text-center">Preparando descarga {downloadProgress.toFixed(2)} %</p>
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
      <button
        onClick={() => {
          setShowMenu(!showMenu)
        }}
        className="xl:hidden fixed  bottom-16 left-4 bg-main text-white p-3 rounded-full z-50"
      >
        {showMenu ? <RiCloseLine /> : <RiMenu3Line className="rotate-180" />}
      </button>
    </>
  )
}

export default SideBar
