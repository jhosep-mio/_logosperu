import {
  useState,
  useEffect,
  createContext,
  type ReactNode,
  type Dispatch,
  type SetStateAction
} from 'react'
import { Global } from '../helper/Global'
import axios from 'axios'
import { type UserSchema } from './UserSchema'

export interface AuthContextValue {
  auth: typeof UserSchema
  setAuth: Dispatch<SetStateAction<typeof UserSchema>>
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
  title: string
  setTitle: Dispatch<SetStateAction<string>>
  loadingComponents: boolean
  setLoadingComponents: Dispatch<SetStateAction<boolean>>
  downloadProgress: number
  setDownloadProgress: Dispatch<SetStateAction<number>>
  guia: boolean
  setGuia: Dispatch<SetStateAction<boolean>>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProviderCliente = ({
  children
}: {
  children: ReactNode
}): JSX.Element => {
  const [auth, setAuth] = useState<typeof UserSchema>({
    id: '',
    name: '',
    email: '',
    email_alter: '',
    firma: '',
    pass_email: '',
    id_rol: 0,
    rol: ''
  })
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [loadingComponents, setLoadingComponents] = useState(false)
  const [guia, setGuia] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)

  const authUser = async (): Promise<false | undefined> => {
    const tokenUser = localStorage.getItem('tokenUser')
    const user = localStorage.getItem('cliente')
    if (!tokenUser || !user) {
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
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        name: `${respuesta.data.user.nombres} ${respuesta.data.user.apellidos}`,
        email: respuesta.data.user.email,
        email_alter: respuesta.data.user.email_alter,
        pass_email: respuesta.data.user.pass_email,
        firma: '',
        id_rol: 1,
        rol: respuesta.data.user.rol ?? ''
      })
    } catch (error) {
      console.log(error)
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
        auth,
        setAuth,
        loading,
        setLoading,
        title,
        setTitle,
        loadingComponents,
        setLoadingComponents,
        downloadProgress,
        setDownloadProgress,
        guia,
        setGuia
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export default AuthContext
