import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Slide from '@mui/material/Slide'
import { type TransitionProps } from '@mui/material/transitions'
import EditorContexto from './EditorContexto'
import { AgregarCorreos } from './AgregarCorreos'
import {
  type arrayImagenes,
  type arrayCorreos
} from '../../../shared/schemas/Interfaces'
import { SwiperCorreos } from './SwiperCorreos'
import { AgregarImagenes } from './AgregarImagenes'
import { SwiperImagenes } from './SwiperImagenes'
import { Global } from '../../../../helper/Global'
import axios from 'axios'
import Swal, { type SweetAlertResult } from 'sweetalert2'
import useAuth from '../../../../hooks/useAuth'

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
  nombre_marca: string
}

interface values {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  idVenta: string | undefined
  getOneBrief: () => Promise<any>
  datos: valuesDatos
  correos: arrayCorreos[]
  setCorreos: React.Dispatch<React.SetStateAction<arrayCorreos[]>>
}

export const ModalRegistro = ({
  open,
  setOpen,
  idVenta,
  getOneBrief,
  datos,
  correos,
  setCorreos
}: values): JSX.Element => {
  const handleClose = (): void => {
    setOpen(false)
  }
  const { auth } = useAuth()
  const token = localStorage.getItem('token')
  const [arrayImagenes, setArrayImagenes] = React.useState<arrayImagenes[]>([])
  const [arrayArchivos, setArrayArchivos] = React.useState<arrayImagenes[]>([])

  const [contexto, setContexto] = React.useState('')
  const [asunto, setAsunto] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  const guardarAvance = async (): Promise<void> => {
    if (correos.length > 0 && contexto.length > 20) {
      if (arrayImagenes.length > 0 || arrayArchivos.length > 0) {
        setLoading(true)
        const data = new FormData()
        data.append('titulo', asunto)
        data.append('nombres', datos.nombres)
        data.append('contexto', contexto)
        data.append('email', auth.email)
        data.append('email_alter', auth.email_alter)
        data.append('correos', JSON.stringify(correos))
        data.append('password', auth.pass_email)
        data.append('firma', auth.firma)
        const { fecha, hora } = obtenerFechaHora()
        const avance = {
          fecha,
          hora,
          asunto,
          imagenes: arrayImagenes,
          archivos: arrayArchivos,
          correos,
          contexto,
          firma: auth.firma
        }
        avance.imagenes.forEach((image1, index1) => {
          if (image1.imagen1.archivo) {
            const fileExtension = image1.imagen1.archivo.name.split('.').pop()
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            const uniqueFilename = `${new Date().getTime()}_${index1}.${fileExtension}`
            image1.imagen1.archivoName = uniqueFilename
            data.append(`images1[${index1}]`, image1.imagen1.archivo, uniqueFilename)
            data.append(`names1[${index1}]`, uniqueFilename)
          }
        })

        avance.archivos.forEach((image1, index1) => {
          if (image1.imagen1.archivo) {
            const originalFilename = image1.imagen1.archivo.name
            data.append(`images2[${index1}]`, image1.imagen1.archivo, originalFilename)
            data.append(`names2[${index1}]`, originalFilename)
          }
        })
        try {
          const respuesta = await axios.post(
              `${Global.url}/enviarAvances`,
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
            const data = new FormData()
            data.append('array_avances', JSON.stringify(avance))

            avance.imagenes.forEach((image1, index1) => {
              if (image1.imagen1.archivo) {
                data.append(`images1[${index1}]`, image1.imagen1.archivo)
                data.append(`names1[${index1}]`, image1.imagen1.archivoName)
              }
            })

            avance.archivos.forEach((image1, index1) => {
              if (image1.imagen1.archivo) {
                data.append(`images2[${index1}]`, image1.imagen1.archivo)
                data.append(`names2[${index1}]`, image1.imagen1.archivo)
              }
            })

            data.append('_method', 'PUT')
            try {
              const respuesta = await axios.post(
                  `${Global.url}/subirAvances/${idVenta ?? ''}`,
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
                Swal.fire('Se subio el avance correctamente', '', 'success')
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
                        `Ha enviado un correo para el proyecto ${
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
                setArrayImagenes([])
                setArrayArchivos([])
                setAsunto('')
                setContexto('')
                setCorreos([])
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
        question()
      }
    } else {
      Swal.fire('Complete todos los datos', '', 'warning')
    }
  }

  const question = async (): Promise<void> => {
    Swal.fire({
      title: 'No estas adjuntando ningun archivo,¿Deseas enviarlo?',
      showDenyButton: true,
      confirmButtonText: 'Si',
      denyButtonText: 'Cancelar'
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        setLoading(true)
        const data = new FormData()
        data.append('titulo', asunto)
        data.append('nombres', datos.nombres)
        data.append('contexto', contexto)
        data.append('email', auth.email)
        data.append('email_alter', auth.email_alter)
        data.append('correos', JSON.stringify(correos))
        data.append('password', auth.pass_email)
        data.append('firma', auth.firma)
        const { fecha, hora } = obtenerFechaHora()
        const avance = {
          fecha,
          hora,
          asunto,
          imagenes: arrayImagenes,
          archivos: arrayArchivos,
          correos,
          contexto,
          firma: auth.firma
        }
        avance.imagenes.forEach((image1, index1) => {
          if (image1.imagen1.archivo) {
            const fileExtension = image1.imagen1.archivo.name.split('.').pop()
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            const uniqueFilename = `${new Date().getTime()}_${index1}.${fileExtension}`
            image1.imagen1.archivoName = uniqueFilename
            data.append(`images1[${index1}]`, image1.imagen1.archivo, uniqueFilename)
            data.append(`names1[${index1}]`, uniqueFilename)
          }
        })
        avance.archivos.forEach((image1, index1) => {
          if (image1.imagen1.archivo) {
            const originalFilename = image1.imagen1.archivo.name
            data.append(`images2[${index1}]`, image1.imagen1.archivo, originalFilename)
            data.append(`names2[${index1}]`, originalFilename)
          }
        })
        try {
          const respuesta = await axios.post(
              `${Global.url}/enviarAvances`,
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
            const data = new FormData()
            data.append('array_avances', JSON.stringify(avance))
            avance.imagenes.forEach((image1, index1) => {
              if (image1.imagen1.archivo) {
                data.append(`images1[${index1}]`, image1.imagen1.archivo)
                data.append(`names1[${index1}]`, image1.imagen1.archivoName)
              }
            })
            avance.archivos.forEach((image1, index1) => {
              if (image1.imagen1.archivo) {
                data.append(`images2[${index1}]`, image1.imagen1.archivo)
                data.append(`names2[${index1}]`, image1.imagen1.archivo)
              }
            })
            data.append('_method', 'PUT')
            try {
              const respuesta = await axios.post(
                  `${Global.url}/subirAvances/${idVenta ?? ''}`,
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
                Swal.fire('Se subio el avance correctamente', '', 'success')
                setArrayImagenes([])
                setArrayArchivos([])
                setAsunto('')
                setContexto('')
                setCorreos([])
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
      }
    })
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
          SUBIR AVANCES
        </h2>
        <div className="w-full flex gap-2 items-center justify-center">
          <AgregarCorreos correos={correos} setCorreos={setCorreos} />
          <SwiperCorreos correos={correos} setCorreos={setCorreos} />
        </div>
        <input
          type="text"
          placeholder="ASUNTO"
          className="text-black outline-none px-4 py-3 border border-b-gray-400 w-full"
          value={asunto}
          onChange={(e) => {
            setAsunto(e.target.value)
          }}
        />
        <section className="px-0 py-2 flex flex-col gap-4">
          <EditorContexto content={contexto} setContent={setContexto} />
        </section>
        <section className="px-2">
          <AgregarImagenes
            arrayImagenes={arrayImagenes}
            arrayArchivos={arrayArchivos}
            setArrayImagenes={setArrayImagenes}
            setArrayArchivos={setArrayArchivos}
          />
          <SwiperImagenes
              arrayImagenes={arrayImagenes}
              arrayArchivos={arrayArchivos}
              setArrayImagenes={setArrayImagenes}
              setArrayArchivos={setArrayArchivos}
          />
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
            SUBIR AVANCE
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
