import { useContext } from 'react'
import AuthContext, { type AuthContextValue } from '../context/AuthProviderCliente'

const useAuthCliente = (): AuthContextValue => {
  return useContext(AuthContext) as AuthContextValue
}

export default useAuthCliente
