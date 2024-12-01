'use client'

import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState
} from 'react'
import { UserSchema } from './UserSchema'
import axios from 'axios'
import { Global } from '@/helper/Global'

export interface AuthContextValue {
  loading: boolean;
  setLoading: Dispatch<SetStateAction<boolean>>;
  auth: typeof UserSchema
  setAuth: Dispatch<SetStateAction<typeof UserSchema>>
  openSuscribirse: boolean;
  setOpenSuscribirse: Dispatch<SetStateAction<boolean>>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [loading, setLoading] = useState(true)
  const [openSuscribirse, setOpenSuscribirse] = useState(false)

  const [auth, setAuth] = useState<typeof UserSchema>({
    id: '',
    name: '',
    lastname: '',
    email: '',
    celular: ''
  })

  const authUser = async (): Promise<false | undefined> => {
    const tokenUser = localStorage.getItem('tokenUser')
    if (!tokenUser) {
      setLoading(false)
      return false
    }
    try {
      const respuesta = await axios.get(`${Global.url}/user-profile`, {
        headers: {
          Authorization: `Bearer ${tokenUser}`
        }
      })
      setAuth({
        id: respuesta.data.user.id,
        name: `${respuesta.data.user.nombres} `,
        lastname: `${respuesta.data.user.apellidos}`,
        email: respuesta.data.user.email,
        celular: respuesta.data.user.celular
      })
    } catch (error) {
    //   console.log(error)
    }
  }

  useEffect(() => {
    Promise.all([authUser()]).then(() => {
      setLoading(false)
    })
  }, [])

  return (
    <AuthContext.Provider
      value={{
        loading,
        setLoading,
        auth,
        setAuth,
        openSuscribirse,
        setOpenSuscribirse
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
