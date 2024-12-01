import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Slide from '@mui/material/Slide'
import { type TransitionProps } from '@mui/material/transitions'
import { AgregarCorreos } from './AgregarCorreos'
import {
  type arrayCorreos
} from '../../../shared/schemas/Interfaces'
import { SwiperCorreos } from './SwiperCorreos'
import { Global } from '../../../../helper/Global'
import axios from 'axios'
import Swal from 'sweetalert2'
import useAuth from '../../../../hooks/useAuth'
import EditorContexto from './EditorContexto'

const Transition = React.forwardRef(function Transition (
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

interface valuesDatos {
  nombres: string
  email: string
  marca: string
  celular: string
  id_contrato: string
}

interface values {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  idVenta: string | undefined
  datos: valuesDatos | null
  correos: arrayCorreos[]
  setCorreos: React.Dispatch<React.SetStateAction<arrayCorreos[]>>
  getOneBrief: () => Promise<void>
}

export const ModalCorreoFinal2 = ({
  open,
  setOpen,
  idVenta,
  datos,
  correos,
  setCorreos,
  getOneBrief
}: values): JSX.Element => {
  const handleClose = (): void => {
    setOpen(false)
  }
  const { auth } = useAuth()
  const token = localStorage.getItem('token')
  const [asunto, setAsunto] = React.useState('')
  const [marca, setmarca] = React.useState('')
  const [contexto, setContexto] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const guardarAvance = async (): Promise<void> => {
    if (
      correos.length > 0 &&
      asunto.length > 0 &&
      marca.length > 0 &&
      contexto.length > 20
    ) {
      setLoading(true)
      const data = new FormData()
      data.append('titulo', asunto)
      if (datos != null) {
        data.append('nombres', datos.nombres)
        data.append('contrato', datos.id_contrato)
        data.append('marca', marca)
        data.append('contexto', contexto)
        data.append('email', auth.email)
        data.append('email_cliente', datos.email)
        data.append('celular_cliente', datos.celular)
        data.append('email_alter', auth.email_alter)
        data.append('correos', JSON.stringify(correos))
        data.append('password', auth.pass_email)
        data.append('firma', auth.firma)
      }

      const { fecha, hora } = obtenerFechaHora()
      const avance = {
        fecha,
        hora,
        asunto,
        correos,
        contexto,
        firma: auth.firma
      }
      try {
        const respuesta = await axios.post(`${Global.url}/enviarFinal`, data, {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        })

        if (respuesta.data.status == 'success') {
          const data = new FormData()
          const today = new Date()
          const formattedDate = `${String(today.getDate()).padStart(
            2,
            '0'
          )}/${String(today.getMonth() + 1).padStart(
            2,
            '0'
          )}/${today.getFullYear()}`
          data.append('fecha_fin', formattedDate)
          data.append('nombre_marca', marca)
          data.append('array_final', JSON.stringify(avance))
          data.append('_method', 'PUT')
          try {
            const respuesta = await axios.post(
              `${Global.url}/subirFinal/${idVenta ?? ''}`,
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
              Swal.fire('SERVICIO TERMINADO', '', 'success')
              const enviarNotificacion = async (): Promise<void> => {
                const data = new FormData()
                const currentUrl = window.location.href
                // Utilizar el objeto URL para extraer la ruta
                const urlObject = new URL(currentUrl)
                const pathName = urlObject.pathname
                data.append('id_usuario', auth.id)
                data.append('id_venta', String(idVenta))
                data.append('nombre', auth.name)
                data.append('icono', 'correo')
                data.append('url', pathName)
                data.append(
                  'contenido',
                  `Ha enviado el corrreo final del proyecto ${
                    marca ?? ''
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
              setAsunto('')
              setContexto('')
              getOneBrief()
              setOpen(false)
            } else {
              Swal.fire('Error al registrar', '', 'error')
            }
          } catch (error: unknown) {
            console.log(error)
            Swal.fire('Error', '', 'error')
          }
        } else {
          Swal.fire('Error al registrar', '', 'error')
        }
      } catch (error: unknown) {
        console.log(error)
        Swal.fire('Error', '', 'error')
      }
      setLoading(false)
    } else {
      Swal.fire('Complete todos los campos', '', 'warning')
    }
  }

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

  React.useEffect(() => {
    if (datos != null) {
      if (datos.marca != null && datos.marca !== '') {
        setmarca(datos.marca)
        setAsunto(`CORREO FINAL - ${datos.marca}`)
      } else {
        setmarca('')
        setAsunto('CORREO FINAL -')
      }
    }
  }, [open, datos])

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      className="moda_registro"
    >
      <DialogContentText id="alert-dialog-slide-description">
        <h2 className="w-full font-bold text-2xl text-center text-white bg-main/80 py-2">
          CULMINAR PROYECTO
        </h2>
        <div className="w-full flex flex-col gap-2 items-start justify-center p-4">
          <AgregarCorreos correos={correos} setCorreos={setCorreos} />
          <SwiperCorreos correos={correos} setCorreos={setCorreos} />
        </div>
        <div>
          <input
            type="text"
            placeholder="ASUNTO"
            className="text-black outline-none px-4 py-3 border border-b-gray-400 w-full"
            value={asunto}
            onChange={(e) => {
              setAsunto(e.target.value)
            }}
          />
          <input
            type="text"
            placeholder="Nombre de la marca/empresa"
            className="text-black outline-none px-4 py-3 border border-b-gray-400 w-full"
            value={marca}
            onChange={(e) => {
              setmarca(e.target.value)
            }}
          />
        </div>
        <section className="px-0 py-2 flex flex-col gap-4">
          <EditorContexto content={contexto} setContent={setContexto} />
        </section>
      </DialogContentText>
      <DialogActions>
        <Button onClick={handleClose}>CERRAR</Button>
        {!loading
          ? <button
            className="w-fit px-3 py-1 bg-secondary-150 text-white font-bold rounded-xl"
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={async () => {
              await guardarAvance()
            }}
          >
            ENVIAR
          </button>
          : (
          <button className="w-fit px-3 py-1 bg-[#4E4263] text-white font-bold rounded-xl">
            Enviando...
          </button>
            )}
      </DialogActions>
    </Dialog>
  )
}
