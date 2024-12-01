import useAuth from '../../../../hooks/useAuth'
import { useEffect } from 'react'

export const IndexNotificaciones = (): JSX.Element => {
  const { setTitle } = useAuth()

  useEffect(() => {
    setTitle('Notificaciones')
  }, [])

  return (
    <div>IndexNotificaciones</div>
  )
}
