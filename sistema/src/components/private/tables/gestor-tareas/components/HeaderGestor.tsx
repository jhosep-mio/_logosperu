/* eslint-disable @typescript-eslint/explicit-function-return-type */
import { GrNotification } from 'react-icons/gr'
import { IoCalendarOutline, IoPersonOutline } from 'react-icons/io5'
import { RiFolderSharedLine } from 'react-icons/ri'
import { TbCalendarUser } from 'react-icons/tb'
import { Link, useLocation } from 'react-router-dom'
import useAuth from '../../../../../hooks/useAuth'

export const HeaderGestor = (): JSX.Element => {
  const { setOpenModalShared } = useAuth()
  const location = useLocation()
  const isActive = (path: string) => location.pathname === path

  const navLinks = [
    { path: '/admin/gestor-tareas', label: 'Tus tableros', Icon: IoPersonOutline },
    { path: '/admin/gestor-tareas/calendario', label: 'Calendario', Icon: IoCalendarOutline },
    { path: '/admin/gestor-tareas/compartidos', label: 'Compartidos', Icon: RiFolderSharedLine },
    { path: '/admin/gestor-tareas/compartidos-antiguos', label: 'Compartidos antiguos', Icon: RiFolderSharedLine },
    { path: '/admin/gestor-tareas/citas-reuniones', label: 'Citas y Reuniones', Icon: TbCalendarUser }
  ]
  return (
    <div className="flex gap-4 lg:gap-4 h-[50px]">
      {navLinks.map(({ path, label, Icon }) => (
        <Link
          key={path}
          to={path}
          className={`flex items-center gap-3 text-base  font-semibold transition-colors cursor-pointer ${
            isActive(path) ? 'text-cyan-700' : 'text-black hover:text-cyan-700'
          }`}
        >
          <Icon className="text-xl" />
          <span className="hidden lg:block">{label}</span>
        </Link>
      ))}
      <button
        type="button"
        onClick={() => {
          setOpenModalShared(true)
        }}
        className="flex items-center gap-3 text-base font-semibold text-black hover:text-cyan-700 transition-colors cursor-pointer"
      >
        <GrNotification className="text-lg" /> <span className="hidden lg:block">Notificaciones</span>
      </button>
    </div>
  )
}
