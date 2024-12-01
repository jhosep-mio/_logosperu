import { useContext } from 'react'
import AuthContext, { type AuthContextValue } from '../context/AuthProvider'

const useAuth = (): AuthContextValue => {
  return useContext(AuthContext) as AuthContextValue
}

export default useAuth
