import { useNavigate } from 'react-router-dom'
import useAuth from '../../hooks/useAuth'
import useAuthCliente from '../../hooks/useAuthCliente'
import { Loading } from '../shared/Loading'
import { useEffect } from 'react'

export const Login = (): JSX.Element | undefined => {
  const navigate = useNavigate()
  const { auth: authClient, loading: loadingCliente } = useAuthCliente()
  const { auth: authAdmin, loading: loadingAdmin } = useAuth()

  useEffect(() => {
    if (authAdmin.id !== '') {
      navigate('/admin', { replace: true })
    } else if (authClient.id !== '') {
      navigate('/cliente', { replace: true })
    } else if (!loadingAdmin && !loadingCliente) {
      window.location.href = 'https://logosperu.com.pe/'
    }
  }, [authAdmin.id, authClient.id, loadingAdmin, loadingCliente, navigate])

  return (
    <div className="min-h-screen flex flex-col-reverse md:flex-row items-center justify-between">
      <Loading />
    </div>
  )
}
