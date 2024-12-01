import { Navigate, Outlet } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import SideBar from './estructura/SideBar'

export const LayoutDashboard = (): JSX.Element => {
  const { auth, loading } = useAuth()

  if (loading && auth) {
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
  } else {
    return (
      <section className='flex'>
          <SideBar />
          {auth.id != '' ? <Outlet /> : <Navigate to="/login" />}
      </section>
    )
  }
}
