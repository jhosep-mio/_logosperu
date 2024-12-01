/* eslint-disable @typescript-eslint/restrict-template-expressions */
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import { cn } from '../../../../shared/cn'
import Swal from 'sweetalert2'
import { toast } from 'sonner'
import useAuth from '../../../../../hooks/useAuth'
import { limpiarCadena } from '../../../../shared/functions/QuitarAcerntos'

export const ButtonHabilitate = ({ communityActivo, setLoading, id, token, datos, getOneBrief, plan }: { communityActivo: any, setLoading: any, id: string | undefined, token: string | null, datos: any, getOneBrief: any, plan: any }): JSX.Element => {
  const { auth } = useAuth()

  const obtenerFechaHora = (): { fecha: string, hora: string } => {
    const ahora = new Date()
    const opcionesFecha = { year: 'numeric', month: '2-digit', day: '2-digit' }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const fecha = ahora.toLocaleDateString('es-PE', opcionesFecha)
    const opcionesHora = { hour: '2-digit', minute: '2-digit' }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const hora = ahora.toLocaleTimeString('es-PE', opcionesHora)
    return { fecha, hora }
  }

  const correoDesactivateCM = async (nombres: string, email: string): Promise<void> => {
    const data = new FormData()
    data.append('nombres', nombres)
    data.append('email', email)
    data.append('plan', plan.nombre)
    data.append('contrato', (limpiarCadena(datos?.id_contrato)))
    try {
      await axios.post(
              `${Global.url}/correoDesactivateGeneral`,
              data,
              {
                headers: {
                  Authorization: `Bearer ${
                    token !== null && token !== '' ? token : ''
                  }`
                }
              }
      )
    } catch (error: unknown) {
      console.log(error)
      toast.error('Error')
    }
  }

  const correoActivateCM = async (nombres: string, email: string): Promise<void> => {
    const data = new FormData()
    data.append('nombres', nombres)
    data.append('email', email)
    data.append('plan', plan.nombre)
    data.append('contrato', (limpiarCadena(datos?.id_contrato)))

    try {
      await axios.post(
              `${Global.url}/correoActivateGeneral`,
              data,
              {
                headers: {
                  Authorization: `Bearer ${
                    token !== null && token !== '' ? token : ''
                  }`
                }
              }
      )
    } catch (error: unknown) {
      console.log(error)
      toast.error('Error')
    }
  }

  const enviarCorreoAvanceActivate = async (): Promise<void> => {
    const { fecha, hora } = obtenerFechaHora()
    const avance = {
      fecha,
      hora,
      asunto: 'PROYECTO HABILITADO',
      correos: [{ id: '1598753', correo: 'diseno2@logosperu.com' }, { id: '123456', correo: 'diseno4@logosperu.com' }, { id: '123123123', correo: datos?.email }],
      contexto: `<p>Estimado(a) ${datos?.nombres ?? ''}</p><p><br></p><p>Nos complace informarle que hemos reactivado nuestro servicio de  <strong>${plan.nombre} (${limpiarCadena(datos?.id_contrato)})</strong> para usted. Estamos emocionados de seguir trabajando juntos y apoyarlo en todas tus necesidades digitales.&nbsp;</p><p><br></p><p>Durante este tiempo, hemos realizado mejoras significativas para ofrecerle un servicio aún más excepcional. Estamos comprometidos a brindarte resultados impactantes y a ser parte clave de tu estrategia digital.&nbsp;</p><p><br></p><p>Agradecemos sinceramente su confianza en nosotros y estamos listos para ayudarlo(a) en todo lo que necesite. No dude en contactarnos si tiene alguna pregunta o si desea explorar nuevas oportunidades para su negocio.&nbsp;</p>`,
      firma: auth.firma
    }
    const data = new FormData()
    data.append('array_avances', JSON.stringify(avance))
    data.append('_method', 'PUT')
    try {
      await axios.post(
        `${Global.url}/subirAvances/${id ?? ''}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      toast.success('PROYECTO HABILITADO')
      getOneBrief()
      const enviarNotificacion = async (): Promise<void> => {
        const data = new FormData()
        const currentUrl = window.location.href
        // Utilizar el objeto URL para extraer la ruta
        const urlObject = new URL(currentUrl)
        const pathName = urlObject.pathname
        data.append('id_usuario', auth.id)
        data.append('id_venta', String(id))
        data.append('nombre', auth.name)
        data.append('icono', 'correo')
        data.append('url', pathName)
        data.append(
          'contenido',
                `Habilito el proyecto ${
                  datos.nombre_marca ?? ''
                }  (${datos?.nombres ?? ''})`
        )
        data.append('hidden_users', '')
        try {
          await axios.post(`${Global.url}/nuevaNotificacion`, data, {
            headers: {
              Authorization: `Bearer ${
                      token !== null && token !== '' ? token : ''
                    }`
            }
          })
        } catch (error: unknown) {
          console.log(error)
          Swal.fire('Error al subir', '', 'error')
        }
      }
      enviarNotificacion()
    } catch (error: unknown) {
      console.log(error)
    }
  }

  const enviarCorreoAvanceDesactivate = async (): Promise<void> => {
    const { fecha, hora } = obtenerFechaHora()
    const avance = {
      fecha,
      hora,
      asunto: 'PROYECTO DESHABILITADO',
      correos: [{ id: '1598753', correo: 'diseno2@logosperu.com' }, { id: '123456', correo: 'diseno4@logosperu.com' }, { id: '123123123', correo: datos?.email }],
      contexto: `<p>Estimado(a) ${datos?.nombres}</p><p><br></p><p>Queremos informarte que hemos deshabilitado temporalmente nuestro servicio de <strong>${plan.nombre} (${limpiarCadena(datos?.id_contrato)})</strong> para usted. Entendemos que pueden surgir diferentes razones y necesidades en tu negocio, y estamos aquí para apoyarte en cualquier momento que decidas regresar.&nbsp;</p><p><br></p><p>Queremos agradecerte por confiar en nosotros y permitirnos ser parte de tu estrategia digital. Durante este tiempo, estaremos trabajando en mejoras y actualizaciones para ofrecerte un servicio aún más excepcional cuando vuelvas.&nbsp;</p><p><br></p><p>Te esperamos pronto y estaremos gustosamente de atenderte. No dudes en ponerte en contacto con nosotros si necesitas cualquier tipo de asistencia o información adicional.&nbsp;</p>`,
      firma: auth.firma
    }

    const data = new FormData()
    data.append('array_avances', JSON.stringify(avance))
    data.append('_method', 'PUT')
    try {
      await axios.post(
        `${Global.url}/subirAvances/${id ?? ''}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      toast.success('PROYECTO DESHABILITADO')
      getOneBrief()
      const enviarNotificacion = async (): Promise<void> => {
        const data = new FormData()
        const currentUrl = window.location.href
        // Utilizar el objeto URL para extraer la ruta
        const urlObject = new URL(currentUrl)
        const pathName = urlObject.pathname
        data.append('id_usuario', auth.id)
        data.append('id_venta', String(id))
        data.append('nombre', auth.name)
        data.append('icono', 'correo')
        data.append('url', pathName)
        data.append(
          'contenido',
                `Ha deshabilitado el proyecto ${
                  datos.nombre_marca ?? ''
                }  (${datos?.nombres ?? ''})`
        )
        data.append('hidden_users', '')
        try {
          await axios.post(`${Global.url}/nuevaNotificacion`, data, {
            headers: {
              Authorization: `Bearer ${
                      token !== null && token !== '' ? token : ''
                    }`
            }
          })
        } catch (error: unknown) {
          console.log(error)
          Swal.fire('Error al subir', '', 'error')
        }
      }
      enviarNotificacion()
    } catch (error: unknown) {
      console.log(error)
    }
  }

  const habilitarProyectoGeneral = async (): Promise<void> => {
    console.log(datos.email)
    setLoading(true)
    const data = new FormData()
    data.append('community_activo', communityActivo == 'false' ? 'true' : 'false')
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
                `${Global.url}/habilitarProyecto/${id ?? ''}`,
                data,
                {
                  headers: {
                    Authorization: `Bearer ${
                      token !== null && token !== '' ? token : ''
                    }`
                  }
                }
      )
      if (respuesta.data.status == 'success') {
        if (datos.email == 'sistema@logosperu.com') {
          toast.success('PROYECTO ACTUALIZADO')
        } else if (communityActivo == 'false') {
          enviarCorreoAvanceActivate()
          correoActivateCM(datos?.nombres, datos.email)
        } else {
          correoDesactivateCM(datos?.nombres, datos.email)
          enviarCorreoAvanceDesactivate()
        }
      } else {
        Swal.fire('Error al actualizar', '', 'error')
      }
    } catch (error: unknown) {
      Swal.fire('Error', '', 'error')
    }
    setLoading(false)
  }

  return (
    <div
      className={cn(
        'w-full lg:w-fit flex items-center gap-5 px-6 py-2 rounded-xl',
        communityActivo == 'false' ? 'bg-red-500 ' : 'bg-green-600'
      )}
    >
      <p className="text-white text-sm lg:text-lg">
        El proyecto esta{' '}
        {communityActivo == 'false' ? 'deshabilitado' : 'habilitado'}
      </p>
      <button
        type="button"
        className="bg-white rounded-lg text-sm lg:text-base px-3 text-red-500 text-justify transition-all hover:bg-gray-100"
        onClick={() => {
          habilitarProyectoGeneral()
        }}
      >
        {' '}
        {communityActivo == 'false' ? 'Habilitar' : 'Deshabilitar'}{' '}
      </button>
    </div>
  )
}
