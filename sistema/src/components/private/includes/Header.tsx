/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-unmodified-loop-condition */
import { RiArrowDownSLine, RiLogoutCircleRLine } from 'react-icons/ri'
import { useState, useEffect, useRef } from 'react'
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu'
import '@szhsin/react-menu/dist/index.css'
import '@szhsin/react-menu/dist/transitions/slide.css'
import { Link } from 'react-router-dom'
import useAuth from '../../../hooks/useAuth'
import icono from './../../../assets/logo/icono.png'
import axios from 'axios'
import { Global } from '../../../helper/Global'
import { ModalNotificaciones } from '../tables/notificaciones/ModalNotificaciones'
import { AnimatePresence } from 'framer-motion'
import { AlertSucess } from '../../shared/alerts/AlertSucess'
import { ModalNoti } from '../tables/gestor-tareas/components/notificaciones/ModalNoti'
import { Toaster } from 'sonner'
import { PiDevicesDuotone } from 'react-icons/pi'
import { ModalNotificacionesReunion } from '../tables/notificaciones/ModalNotificacionesReunion'
// import NotificacionHoras from '../tables/notificacion_horas/NotificacionHoras'

const Header = (): JSX.Element => {
  const {
    auth,
    title,
    showError,
    setShowError,
    setLoading: setLoadingCerr,
    notificacionesDesarrollo
  } = useAuth()
  const [colaboradores, setColaboradores] = useState([])
  const [openNoti, setOpenNoti] = useState(false)

  const cerrarSession = async (): Promise<void> => {
    setLoadingCerr(true)
    const token = localStorage.getItem('token')
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

  const token = localStorage.getItem('token')

  const getColaboradores = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getUsuarios`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setColaboradores(request.data)
  }

  const currentPath = window.location.pathname

  useEffect(() => {
    getColaboradores()
  }, [])

  useEffect(() => {
    setTimeout(() => {
      if (showError != null) {
        setShowError(null)
      }
    }, 3000)
  }, [setShowError, showError])

  function obtenerDiasParaMantenimiento (orden: any): number | string {
    const arrayMantenimiento = orden.mantenimientoWeb
      ? JSON.parse(orden.mantenimientoWeb)
      : []
    const fechaInicial = orden.fecha_fin
    if (arrayMantenimiento.length == 12) {
      return 'T'
    }
    if (!fechaInicial) {
      return 0 // Or any other appropriate action
    }
    if (orden.estado == '1' || orden.community_activo == 'false') {
      return '-'
    }
    const partesFecha = fechaInicial.split('/').map(Number)
    const dia = partesFecha[0]
    const mes = partesFecha[1] - 1 // Mes en formato de 0 a 11
    const año = partesFecha[2]
    const fechaInicialDate = new Date(año, mes, dia)
    const fechaActual = new Date(fechaInicialDate)
    const hoy = new Date()
    // Calcular todas las fechas de pago
    while (fechaActual < hoy) {
      fechaActual.setMonth(fechaActual.getMonth() + 1)
    }
    const diasRestantes = Math.ceil(
      (fechaActual.getTime() - hoy.getTime()) / (1000 * 3600 * 24)
    )
    return diasRestantes
  }

  const ref = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event: any): void => {
      // @ts-expect-error
      if (ref.current && !ref.current.contains(event.target)) {
        setOpenNoti(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [ref, setOpenNoti])

  return (
    <>
      <ModalNoti />
      <Toaster position="top-center" richColors />
      <ModalNotificaciones colaboradores={colaboradores} />
      <ModalNotificacionesReunion colaboradores={colaboradores} />

      {!currentPath.includes('admin/gestor-tareas') &&
        !currentPath.includes('admin/colaboradores/gestor_tareas') &&
        !currentPath.includes('admin/listadocm') &&
        !currentPath.includes('admin/documentos') &&
        !currentPath.includes('/admin/colaboradores/horario-laboral') &&
        !currentPath.includes('/admin/colaboradores/horario-mensual') &&
        !currentPath.includes('/admin/colaboradores/horario-reporte') &&
        !currentPath.includes('/admin/hosting') &&
        !currentPath.includes('/admin/citas_reuniones') &&
        !currentPath.includes('/admin/lista-community/metricas') &&
        !currentPath.includes('/admin/newsletter/mails/resultados') &&
        !currentPath.includes('/admin/lista-desarrollo_web/metricas') && !currentPath.includes('/admin/backup') && (
          <>
            <header className="h-[7vh] lg:h-[10vh] border-b border-gray-100 shadow-sm px-4 py-8 md:p-8 flex items-center justify-between bg-white z-10">
              <div className="flex gap-3 md:gap-5">
                <p className="font-bold text-black  text-base md:text-xl">
                  {title}
                </p>
              </div>
              <nav className="flex items-center gap-2">
                <div className="relative cursor-pointer">
                  <span className="absolute -top-2 -right-2 bg-main_two w-[20px] text-sm p-1 h-[20px] rounded-full flex items-center justify-center">
                    {notificacionesDesarrollo.length ?? 0}
                  </span>
                  <PiDevicesDuotone
                    className="text-main text-3xl"
                    onClick={() => {
                      setOpenNoti(true)
                    }}
                  />
                  {openNoti && (
                    <div ref={ref} className="bg-white w-96 pt-6 rounded-lg shadow-lg absolute top-full right-full z-[999]">
                      <button
                        className="absolute top-2 right-2 text-gray-400 hover:text-white transition-colors hover:bg-red-300 rounded-full h-[20px] w-[22px] flex items-center justify-center "
                        onClick={() => {
                          setOpenNoti(false)
                        }}
                      >
                        &times;
                      </button>
                      <h2 className="text-xl font-semibold px-6 mb-4 text-black">
                        Notificaciones
                      </h2>
                      <div className="max-h-[350px] px-6 pb-6 overflow-y-auto flex flex-col ">
                        {notificacionesDesarrollo.length > 0
                          ? notificacionesDesarrollo?.map((notification: any) => (
                          <Link to={`/admin/lista-servicios/avances/${notification.id}`} key={notification.id} className="mb-2"
                          onClick={() => { setOpenNoti(false) }}
                          >
                            <div className="bg-white hover:bg-gray-100 transition-colors border_inner2 px-4 py-2 text-sm flex justify-between gap-2 rounded-lg">
                              <p className="text-black line-clamp-1">
                                {notification.nombre_marca}
                              </p>
                              <p className='text-black'>{obtenerDiasParaMantenimiento(notification) == 0 ? 'Hoy' : `${obtenerDiasParaMantenimiento(notification)} d`}</p>
                            </div>
                          </Link>
                          ))
                          : <p className='text-gray-500'>Sin notificaciones</p>
                        }
                      </div>
                    </div>
                  )}
                </div>
                <Menu
                  menuButton={
                    <MenuButton className="flex items-center gap-x-2 hover:bg-[#f1f1f1] group p-2 rounded-lg transition-colors">
                      <img
                        src={icono}
                        className="w-7 h-7 object-contain rounded-full bg-[#000000] p-[3px]"
                      />
                      <span className="hidden md:block text-black group-hover:text-main line-clamp-1">
                        {auth.name}
                      </span>
                      <RiArrowDownSLine />
                    </MenuButton>
                  }
                  align="end"
                  arrow
                  transition
                  menuClassName="bg-secondary-100 p-4 "
                >
                  <MenuItem className="p-0 hover:bg-transparent group">
                    <Link
                      to="/perfil"
                      className="rounded-lg transition-colors text-gray-300 hover:bg-main_2-100 flex items-center gap-x-4 py-2 px-6 flex-1"
                    >
                      <img
                        src={icono}
                        className="w-8 h-8 object-contain rounded-full bg-[#000000] p-[3px]"
                      />
                      <div className="flex flex-col text-sm ">
                        <span className="text-sm group-hover:text-black">
                          {auth.name}
                        </span>
                        <span className="text-xs group-hover:text-black">
                          {auth.email_alter}
                        </span>
                      </div>
                    </Link>
                  </MenuItem>
                  <hr className="my-4 border-gray-500" />
                  <MenuItem className="p-0 hover:bg-transparent group">
                    <Link
                      to={''}
                      onClick={() => {
                        void cerrarSession()
                      }}
                      className="rounded-lg transition-colors text-gray-300 group-hover:text-black hover:bg-main_2-100 flex items-center gap-x-4 py-2 px-6 flex-1"
                    >
                      <RiLogoutCircleRLine /> Cerrar sesión
                    </Link>
                  </MenuItem>
                </Menu>
              </nav>
              {/* <ModalNotificaciones colaboradores={colaboradores} /> */}
            </header>
            <AnimatePresence>
              {showError != null && <AlertSucess showError={showError} />}
            </AnimatePresence>
          </>
      )}
    </>
  )
}

export default Header
