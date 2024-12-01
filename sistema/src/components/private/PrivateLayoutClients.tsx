import { Navigate, Outlet } from 'react-router-dom'
import SideBarClient from './client/includes/SideBarClient'
import { AccesDenied } from './AccesDenied'
import useAuthCliente from '../../hooks/useAuthCliente'

export const PrivateLayoutClients = (): JSX.Element => {
  const { auth, loading } = useAuthCliente()
  const token = localStorage.getItem('tokenUser')

  if (!token) {
    return <AccesDenied />
  }

  if (loading) {
    return (
      <div className="centrarclase_do_spinner">
        <div className="dot-spinner">
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
          <div className="dot-spinner__dot"></div>
        </div>
      </div>
    )
  }
  return (
    <div className="min-h-screen grid grid-cols-1 xl:grid-cols-6 bg-[#B2BFC7]">
      <SideBarClient />
      <div className="xl:col-span-5 h-full md:h-[96vh] my-auto">
        <div className="h-full md:h-[96vh] overflow-y-auto md:pt-1 md:px-4 relative overflow-x-hidden">
          {auth.id ? <Outlet /> : <Navigate to="/login" />}
        </div>
      </div>
    </div>
  )
}
