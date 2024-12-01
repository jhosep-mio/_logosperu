import {
  useState,
  useEffect,
  createContext,
  type ReactNode,
  type Dispatch,
  type SetStateAction
} from 'react'
import { type UserSchema } from './UserSchema'
import CryptoJS from 'crypto-js'
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { Global } from '../helper/Global'
import { type errorValues, type carrito } from '../components/shared/interface'

export interface AuthContextValue {
  auth: typeof UserSchema
  setAuth: Dispatch<SetStateAction<typeof UserSchema>>
  loading: boolean
  setLoading: Dispatch<SetStateAction<boolean>>
  title: string
  setTitle: Dispatch<SetStateAction<string>>
  cart: carrito[]
  setCart: Dispatch<SetStateAction<carrito[]>>
  token: string
  setShowError: React.Dispatch<React.SetStateAction<errorValues | null>>
  showError: errorValues | null
}

const AuthContext = createContext<AuthContextValue | null>(null)

export const AuthProvider = ({
  children
}: {
  children: ReactNode
}): JSX.Element => {
  const [auth, setAuth] = useState<typeof UserSchema>({
    id: '',
    name: '',
    onlyname: '',
    lastname: '',
    email: '',
    idRol: null,
    foto: '',
    portada: ''
  })
  const [loading, setLoading] = useState(true)
  const [title, setTitle] = useState('')
  const [cart, setCart] = useState<carrito[]>([])
  const navigate = useNavigate()
  const [token, setToken] = useState('')
  const [showError, setShowError] = useState<errorValues | null>(null)

  useEffect(() => {
    // Recuperar el carrito del almacenamiento local cuando la página se cargue
    const storedCart = localStorage.getItem('cart')
    authUser()
    if (storedCart) {
      const parsedCart = JSON.parse(storedCart)
      setCart(parsedCart)
    }
    const encryptionKey = 'qwerasd159'
    const encryptedData = localStorage.getItem('data')
    if (encryptedData && encryptedData != null) {
      const guardarData = async (): Promise<void> => {
        const decryptedData = CryptoJS.AES.decrypt(
          encryptedData,
          encryptionKey
        ).toString(CryptoJS.enc.Utf8)

        const values = JSON.parse(decryptedData)
        const paymentId: string = values[0].id_unique

        const request = await axios.post(
                `${Global.url}/oneTransaccion/${paymentId}`
        )
        if (request.data.length > 0 && request.data[0].status != 'rejected') {
          localStorage.removeItem('cart')
          localStorage.removeItem('data')
          setCart([])
          navigate(`/success/${paymentId}`)
        }
      }
      guardarData()
    }
  }, [])

  const authUser = async (): Promise<false | undefined> => {
    // SACAR DATOS DEL USUARIO IDENTIFICADO DEL LOCALSTORAGE
    const tokenUser = localStorage.getItem('tokenUser')
    const user = localStorage.getItem('estudiante')
    // COMPROBRAR SI TENGO EL tokenUser Y EL USER
    if (!tokenUser || !user) {
      setLoading(false)
      return false
    }
    const respuesta = await axios.get(`${Global.url}/perfilEstudiante`, {
      headers: {
        Authorization: `Bearer ${tokenUser}`
      }
    })
    // SETEAR LOS DATOS
    setAuth(
      {
        id: respuesta.data.user.id,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        name: `${respuesta.data.user.nombres} ${respuesta.data.user.apellidos}`,
        onlyname: respuesta.data.user.nombres,
        lastname: respuesta.data.user.apellidos,
        email: respuesta.data.user.email,
        idRol: respuesta.data.user.id_rol,
        foto: respuesta.data.user.imagen1,
        portada: respuesta.data.user.imagen2
      }
    )
    setToken(tokenUser)
    setLoading(false)
  }

  return (
        <AuthContext.Provider
          value={{
            token,
            auth,
            setAuth,
            loading,
            setLoading,
            title,
            setTitle,
            cart,
            setCart,
            showError,
            setShowError
          }}
        >
          {children}
        </AuthContext.Provider>
  )
}

export default AuthContext
