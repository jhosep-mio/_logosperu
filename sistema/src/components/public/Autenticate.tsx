/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import useAuth from '../../hooks/useAuth'
import axios from 'axios'
import { Global } from '../../helper/Global'
import useAuthCliente from '../../hooks/useAuthCliente'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-expect-error
import CryptoJS from 'crypto-js'
import { Loading } from '../shared/Loading'
export const Autenticate = (): JSX.Element | undefined => {
  const navigate = useNavigate()
  const { setAuth: setAuthClient } = useAuthCliente()
  const { setAuth: setAuthAdmin } = useAuth()

  useEffect(() => {
    const fetchData = async (): Promise<void> => {
      const urlParams = new URLSearchParams(window.location.search)
      const tokenEncoded = urlParams.get('tk')
      if (tokenEncoded) {
        try {
          const decryptedToken = CryptoJS.AES.decrypt(
            decodeURIComponent(tokenEncoded),
            'secret'
          ).toString(CryptoJS.enc.Utf8)
          const tokenData = JSON.parse(decryptedToken)
          const cleanedToken = tokenData.token
            .replace(/^q16/, '')
            .replace(/90x$/, '')
          const respuesta = await axios.get(`${Global.url}/user-profile`, {
            headers: {
              Authorization: `Bearer ${cleanedToken ?? ''}`
            }
          })

          if (respuesta.data.status == 'success') {
            localStorage.removeItem('token')
            localStorage.removeItem('tokenUser')
            localStorage.removeItem('user')
            localStorage.removeItem('cliente')
            if (
              respuesta.data.user.id_rol == '98' ||
              respuesta.data.user.id_rol == '99'
            ) {
              localStorage.setItem('token', cleanedToken)
              localStorage.setItem(
                'user',
                JSON.stringify({
                  id: respuesta.data.user.id,
                  name: respuesta.data.user.name,
                  email: respuesta.data.user.email,
                  email_alter: respuesta.data.user.email_alter,
                  pass_email: respuesta.data.user.pass_email,
                  firma: respuesta.data.user.firma,
                  id_rol: parseInt(respuesta.data.user.id_rol)
                })
              )
              setAuthAdmin({
                id: respuesta.data.user.id,
                name: respuesta.data.user.name,
                email: respuesta.data.user.email,
                email_alter: respuesta.data.user.email_alter,
                pass_email: respuesta.data.user.pass_email,
                firma: respuesta.data.user.firma,
                id_rol: parseInt(respuesta.data.user.id_rol),
                rol: respuesta.data.user.rol
              })
              setTimeout(() => {
                navigate('/admin', { replace: true })
                window.location.reload()
              }, 800)
            } else if (respuesta.data.user.id) {
              localStorage.setItem('tokenUser', cleanedToken)
              localStorage.setItem(
                'cliente',
                JSON.stringify({
                  id: respuesta.data.user.id,
                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                  name: `${respuesta.data.user.nombres} ${respuesta.data.user.apellidos}`,
                  email: respuesta.data.user.email,
                  email_alter: respuesta.data.user.email_alter,
                  pass_email: respuesta.data.user.pass_email,
                  firma: '',
                  id_rol: 1
                })
              )
              setAuthClient({
                id: respuesta.data.user.id,
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                name: `${respuesta.data.user.nombres} ${respuesta.data.user.apellidos}`,
                email: respuesta.data.user.email,
                email_alter: respuesta.data.user.email_alter,
                pass_email: respuesta.data.user.pass_email,
                firma: '',
                id_rol: 1,
                rol: ''
              })
              setTimeout(() => {
                navigate('/cliente', { replace: true })
                window.location.reload()
              }, 800)
            }
          } else if (respuesta.data.status == 'invalid') {
            window.location.href = 'https://logosperu.com.pe'
          }
        } catch (error) {
          window.location.href = 'https://logosperu.com.pe'
        }
      } else {
        window.location.href = 'https://logosperu.com.pe'
      }
    }
    fetchData()
  }, [])

  return (
    <div className="min-h-screen flex flex-col-reverse md:flex-row items-center justify-between">
      <Loading />
    </div>
  )
}
