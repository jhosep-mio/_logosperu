/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable multiline-ternary */
import React, { useState, type Dispatch, type SetStateAction } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogContentText from '@mui/material/DialogContentText'
import Slide from '@mui/material/Slide'
import { type TransitionProps } from '@mui/material/transitions'
import Swal from 'sweetalert2'
import { format } from 'date-fns'
import { v4 as uuidv4 } from 'uuid'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'sonner'
import useAuth from '../../../../hooks/useAuth'
import { convertirNumeroALetras } from '../../../shared/functions/GenerarTextoEnLetras'
import { Global } from '../../../../helper/Global'

const Transition = React.forwardRef(function Transition (
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

interface valuesInterface {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  datos: any
  comprobante: any
  getDatos: any
}

export const ModalViewComprobantes = ({
  open,
  setOpen,
  datos,
  comprobante,
  getDatos
}: valuesInterface): JSX.Element => {
  const [loading, setLoading] = useState(false)
  const { auth } = useAuth()
  const token = localStorage.getItem('token')
  const { id } = useParams()
  const handleClose = (): void => {
    setOpen(false)
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

  const generarComprobante = async (): Promise<void> => {
    let archivo: any = null
    const confirmar = await Swal.fire({
      title: '¿Está seguro?',
      html: `
          <p>¿Desea actualizar el comprobante de pago?</p>
          <input type="file" id="fileInput" class="swal2-input text-sm cursor-pointer " style="width: auto;"/>
        `,
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, generar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const fileInput = (Swal.getPopup() as HTMLElement).querySelector('#fileInput') as HTMLInputElement
        archivo = fileInput?.files?.[0] ?? null
        return archivo
      }
    })
    if (confirmar.isConfirmed) {
    //   setLoading(true)
      const data = new FormData()
      const { fecha, hora } = obtenerFechaHora()
      const fechaActual = new Date()
      const fechaFormateada = format(fechaActual, 'dd/MM/yyyy', {
        // @ts-expect-error
        timeZone: 'America/Lima'
      })

      const mensajeWsp = `<strong>Estimado/a ${datos?.nombres},</strong><p><br></p><p>Nos complace informarle que hemos recibido el pago completo de su <strong>saldo pendiente</strong>. Agradecemos su pronta atención y cumplimiento.</p><p><br></p><p>Adjunto a este correo encontrará el <strong>comprobante de pago</strong> correspondiente. Este documento confirma el pago de la totalidad de su servicio.</p>`
      const idUnico = uuidv4()
      const index = datos?.renovacion.fechas.findIndex(
        (fecha: any) => fecha.comprobante == comprobante?.comprobante
      )

      const updatedFechas = [...datos?.renovacion.fechas]
      updatedFechas[index] = {
        ...updatedFechas[index],
        comprobante2: `${idUnico}_COMPROBANTE DE PAGO - ${datos?.nombres}`,
        pendiente: 0,
        archivo_factura2: archivo && archivo?.name ? `${idUnico}_${archivo?.name}` : ''
      }

      const comprobanteFinal = {
        fechas: updatedFechas
      }

      const avance = {
        idUnico,
        fecha,
        hora,
        asunto: `COMPROBANTE DE PAGO - ${datos?.nombres ?? ''}`,
        empresa: datos?.nombres ?? '',
        contacto: `${datos?.nombres}`,
        motivo: `COMPROBANTE DE PAGO - ${datos?.nombres ?? ''}`,
        fechaacta: fechaFormateada,
        imagenes: [],
        archivos: archivo,
        correos: [{ id: Date.now(), correo: datos?.email ?? '' }],
        contexto: mensajeWsp,
        conclusion: '',
        firma: 'firma_agencia.jpg'
      }
      data.append(
        'contexto',
        `<strong>Estimado/a ${datos?.nombres},</strong><p><br></p><p>Nos complace informarle que hemos recibido el pago completo de su <strong>saldo pendiente</strong>. Agradecemos su pronta atención y cumplimiento.</p><p><br></p><p>Adjunto a este correo encontrará el <strong>comprobante de pago</strong> correspondiente. Este documento confirma el pago de la totalidad de su servicio.</p>`
      )
      data.append('idUnico', idUnico)
      data.append('renovacion', JSON.stringify(comprobanteFinal))
      data.append('contrato', datos?.id_contrato)
      data.append('nombres', `${datos?.nombres ?? ''}`)
      data.append('email', datos?.email)
      let preciofinal = 0
      let igvfinal = 0
      if (comprobante.factura == 'Con factura') {
        igvfinal = Number(comprobante.precio) * 0.18
      } else {
        igvfinal = 0
      }
      preciofinal = Number(comprobante.precio) + igvfinal
      preciofinal = Number(preciofinal.toFixed(2))

      data.append('precio', Number(comprobante.precio).toFixed(2))
      data.append('montoCobrado', Number(preciofinal).toFixed(2))
      data.append('correlativo', datos.id_contrato)
      data.append('dni', datos?.celular)
      data.append('nombre_plan', datos?.nombre_plan)
      data.append(
        'title',
        `${datos.nombres.toUpperCase()}`
      )
      data.append('fecha_inicio', fecha)

      if (comprobante?.factura == 'Sin factura') {
        data.append(
          'estado',
          `${comprobante?.banco ? `${comprobante?.banco}` : ''}/sf/ok`.toLocaleUpperCase()
        )
      } else if (comprobante?.factura == 'Con factura') {
        data.append(
          'estado',
          `${comprobante.banco ? `${comprobante.banco}` : ''}/cf/ok`.toLocaleUpperCase()
        )
      }
      data.append('factura', comprobante.factura)
      data.append('adicionales', '')
      data.append('pendiente', '0')
      if (Number(preciofinal) - Number(comprobante?.montoPrecio) > 0) {
        data.append(
          'pendiente_antes',
          (Number(preciofinal) - Number(comprobante?.montoPrecio)).toFixed(2)
        )
        // ts-ignore
        data.append(
          'pendiente_antes_letras',
          `${convertirNumeroALetras(
            Number(preciofinal) - Number(comprobante?.montoPrecio)
          ).toLocaleLowerCase()}`
        )
      } else {
        // @ts-expect-error
        data.append('pendiente_antes', 0)
      }
      data.append(
        'precio_letras',
        `${convertirNumeroALetras(preciofinal).toLowerCase()}`
      )
      data.append(
        'montoCobrado_letra',
        `${convertirNumeroALetras(Number(preciofinal)).toLowerCase()}`
      )
      data.append('images2', archivo)
      data.append('array_avances', JSON.stringify(avance))
      data.append('firma', auth.firma)
      data.append('_method', 'PUT')
      try {
        const respuesta = await axios.post(
            `${Global.url}/actualizarRenovacionCm/${id ?? ''}`,
            data,
            {
              headers: {
                Authorization: `Bearer ${
                  token !== null && token !== '' ? token : ''
                }`
              }
            }
        )
        await axios.post(`${Global.url}/subirAvancesComprobante/${id ?? ''}`, data, {
          headers: {
            Authorization: `Bearer ${
                token !== null && token !== '' ? token : ''
              }`
          }
        })
        if (respuesta.data) {
          toast.success('Comprobante enviado')
          getDatos()
          setOpen(false)
          archivo = null
        } else {
          Swal.fire('Error al actualizar', '', 'error')
        }
      } catch (error: unknown) {
        Swal.fire('Error', '', 'error')
        console.log(error)
      } finally {
        setLoading(false)
      }
    }
  }

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        maxWidth={'md'}
        aria-describedby="alert-dialog-slide-description"
        className="ww-screen p-0 m-0 modal_dialog_correlativo zindex_999"
      >
        <DialogContentText id="alert-dialog-slide-description">
          <div className="p-10 flex flex-col w-[500px]">
            <h2 className="w-full text-black font-bold uppercase text-2xl text-center mb-4">
              Historial
            </h2>
            <div className="">
              <div className="flex gap-2 mb-3 border-b border-gray-300 pb-1">
                <p className="w-[70%] text-gray-600 text-base text-center">
                  Comprobantes
                </p>
                <p className="w-[30%] text-gray-600 text-base text-center">
                  Estado
                </p>
              </div>
              <section className="flex flex-col gap-2">
                <div className="flex ">
                  <section className="w-[70%] flex flex-col gap-2">
                    {comprobante?.comprobante && (
                      <div className="flex gap-2 px-2">
                        <a
                          target="_blank"
                          href={`https://api.logosperu.com.pe/public/comprobantesCM/${
                            comprobante?.comprobante ?? ''
                          }.pdf`}
                          className="relative group cursor-pointer py-2 rounded-md bg-main w-full block text-center text-white font-bold"
                          rel="noreferrer"
                        >
                          Comprobante de pago
                        </a>
                      </div>
                    )}
                    {comprobante?.archivo_factura && (
                      <div className="flex gap-2 px-2">
                        <a
                          target="_blank"
                          href={`https://api.logosperu.com.pe/public/avances/${
                            comprobante?.archivo_factura ?? ''
                          }`}
                          className="relative group cursor-pointer py-2 rounded-md bg-green-600 w-full block text-center text-white font-bold"
                          rel="noreferrer"
                        >
                          Factura
                        </a>
                      </div>
                    )}
                  </section>
                  <div className="w-[30%] flex items-center">
                    {comprobante?.pendiente <= 0 ? (
                      <button
                        type="button"
                        disabled
                        className="font-bold w-full text-green-700"
                      >
                        OK
                      </button>
                    ) : (
                      <button
                      type='button'
                      disabled={loading}
                      onClick={async () => { await generarComprobante() }}
                      className="font-bold w-fit mx-auto px-3 rounded-md text-red-700 hover:text-white hover:bg-main transition-colors cursor-pointer">
                        {loading ? 'Cargando...' : `S/ ${comprobante?.pendiente}`}
                      </button>
                    )}
                  </div>
                </div>
                {comprobante?.comprobante2 &&
                    <div className="flex border-t border-gray-300 pt-3">
                    <section className='w-[70%] flex flex-col gap-2'>
                        {comprobante?.comprobante2 && (
                        <div className="flex gap-2 px-2">
                            <a
                            target="_blank"
                            href={`https://api.logosperu.com.pe/public/comprobantesCM/${
                                comprobante?.comprobante2 ?? ''
                            }.pdf`}
                            className="relative group cursor-pointer py-2 rounded-md bg-main w-full block text-center text-white font-bold"
                            rel="noreferrer"
                            >
                            Comprobante de pago final
                            </a>
                        </div>
                        )}
                        {comprobante?.archivo_factura2 && (
                        <div className="flex gap-2 px-2">
                            <a
                            target="_blank"
                            href={`https://api.logosperu.com.pe/public/avances/${
                                comprobante?.archivo_factura2 ?? ''
                            }`}
                            className="relative group cursor-pointer py-2 rounded-md bg-green-600 w-full block text-center text-white font-bold"
                            rel="noreferrer"
                            >
                            Factura final
                            </a>
                        </div>
                        )}
                    </section>
                    <div className='w-[30%] flex items-center'>
                        <button className="font-bold w-full text-green-700">
                            OK
                        </button>
                    </div>
                    </div>
                }
              </section>
            </div>
          </div>
        </DialogContentText>
      </Dialog>
    </>
  )
}
