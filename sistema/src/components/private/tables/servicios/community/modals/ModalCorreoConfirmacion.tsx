/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable multiline-ternary */
import { Dialog, DialogContent } from '@mui/material'
import { type Dispatch, type SetStateAction, useState } from 'react'
import axios from 'axios'
import { Global } from '../../../../../../helper/Global'
import { toast } from 'sonner'
import { IoMdCloseCircle } from 'react-icons/io'
import moment from 'moment'
import useAuth from '../../../../../../hooks/useAuth'
import { useParams } from 'react-router-dom'
import { v4 as uuidv4 } from 'uuid'

interface valuesDatos {
  nombres: string
  email: string
  correo: string
  celular: string
  fecha: string
  hora_acta: string
  nombre_marca: string
  archivos: string
  id_contrato: string
  fecha_fin: string
  fecha_inicio: string
  observaciones: string
  comunnity: string
}

export const ModalCorreoConfirmacion = ({
  open,
  setOpen,
  loadingUpdate,
  datos,
  setLoadingUpdate,
  getOneBrief
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  eventSelected: any | null
  loadingUpdate: boolean
  setLoadingUpdate: Dispatch<SetStateAction<boolean>>
  getOneBrief: () => Promise<void>
  datos: valuesDatos
  events: Event []
  setEvents: Dispatch<SetStateAction<Event []>>
  updateCita: (updatedEvents: Event[]) => Promise<void>
}): JSX.Element => {
  const token = localStorage.getItem('token')
  const { id } = useParams()
  const { auth } = useAuth()
  const marca = datos?.nombre_marca
  const [asunto, setAsunto] = useState(`CONFIRMACION DE CALENDARIO ${(marca).toUpperCase()} -`)

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

  const enviarCorreo = async (): Promise<void> => {
    setLoadingUpdate(true)
    if (datos?.email) {
      try {
        let currentDate = moment()
        if (currentDate.day() === 5) {
          currentDate = currentDate.add(2, 'days')
        } else if (currentDate.day() === 6) {
          currentDate = currentDate.add(1, 'days')
        }
        currentDate = currentDate.add(2, 'days')
        currentDate = currentDate.startOf('day').add(12, 'hours')
        const formattedDate = currentDate.format('DD/MM/YYYY')
        const { fecha, hora } = obtenerFechaHora()

        const aprobacion = {
          id: uuidv4(),
          fecha,
          vencimiento: formattedDate,
          hora,
          asunto,
          aprobacion: null
        }

        const correos = [
          { id: uuidv4(), correo: datos?.email },
          { id: uuidv4(), correo: auth.email }
        ]
        const avance = {
          fecha,
          hora,
          asunto,
          imagenes: [],
          archivos: [],
          correos,
          contexto: `<p>Buenas tardes estimado(a)&nbsp;<strong>${datos.nombres}</strong>, el motivo de este correo es para informarle lo siguiente: El llenado del contenido de Community Manager se ha completado en su totalidad en nuestro sistema.</p><p><br></p><p class="ql-align-justify">Requerimos su revisión a la brevedad posible, le hacemos recordar que tenemos una fecha limite para poder programar el cronograma según su alta.</p><p><br></p><p class="ql-align-justify"><strong>FECHA LIMITE: ${formattedDate}</strong></p><p><br></p><p><strong>Recuerde que es importante su confirmación para poder culminar el proyecto con éxito, en caso no pueda responder en la fecha limite se proseguirá en confirmar el contenido en base a lo enviado.</strong></p><p><br></p><p class="ql-align-justify">Para visualizar el contenido de Community Manager puede ingresar a nuestro sistema utilizando el siguiente link:&nbsp;<a href="https://logosperu.com.pe/" rel="noopener noreferrer" target="_blank" style="color: rgb(17, 85, 204);">https://logosperu.com.pe/</a>.</p><p><br></p><p><strong>Le recordamos que sus credenciales son:</strong></p><p><br></p><p class="ql-align-justify">USUARIO: ${datos?.email}</p><p class="ql-align-justify">CONTRASEÑA: ${datos?.celular}</p><p><br></p><p><br></p><p class="ql-align-justify">Muchas gracias</p>`,
          firma: auth.firma
        }
        const data = new FormData()
        data.append('titulo', asunto)
        data.append('nombres', datos.nombres)
        data.append('fecha', formattedDate)
        data.append('firma', auth.firma)
        data.append('email_cliente', datos?.email)
        data.append('celular_cliente', datos?.celular)
        data.append('array_avances', JSON.stringify(avance))
        data.append('aprobacion', JSON.stringify(aprobacion))
        data.append('correos', JSON.stringify(correos))
        data.append('_method', 'PUT')
        const respuesta = await axios.post(`${Global.url}/confirmacionCalendario/${id ?? ''}`, data,
          {
            headers: {
              Authorization: `Bearer ${
                  token !== null && token !== '' ? token : ''
                }`
            }
          }
        )
        if (respuesta.data.status == 'success') {
          toast.success('Correo enviado')
          setOpen(false)
          getOneBrief()
        }
      } catch (error) {
        console.log(error)
      } finally {
        setLoadingUpdate(false)
      }
    } else {
      toast.warning('El cliente no tiene un correo registrado')
    }
  }

  return (
    <>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false)
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className=""
      >
        <DialogContent className="w-[600px] h-fit bg-transparent quitaR_padding relative">
        <IoMdCloseCircle className='absolute top-2 right-6 text-3xl z-10 cursor-pointer' onClick={() => { setOpen(false) }}/>
          <section className="w-full h-fit bg-white p-4 mt-3 rounded-md flex flex-col justify-between overflow-y-auto">
          <input
            type="text"
            placeholder="ASUNTO"
            className="text-black outline-none px-4 py-3 border border-gray-400 w-full"
            value={asunto}
            onChange={(e) => {
              setAsunto(e.target.value)
            }}
          />
           <div className="w-full flex justify-center mt-10">
              {loadingUpdate ? (
                <button
                  disabled
                  className="w-fit mx-auto px-5 py-2 rounded-md bg-green-700 transition-colors text-white"
                >
                  Validando...
                </button>
              ) : (
                <button
                  className="w-fit mx-auto px-5 py-2 rounded-md bg-green-600 hover:bg-green-700 transition-colors text-white"
                  onClick={() => {
                    enviarCorreo()
                  }}
                >
                  Enviar confirmación
                </button>
              )}
            </div>
          </section>
        </DialogContent>
      </Dialog>
    </>
  )
}
