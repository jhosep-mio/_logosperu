import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Slide from '@mui/material/Slide'
import { type TransitionProps } from '@mui/material/transitions'
import axios from 'axios'
import Swal from 'sweetalert2'
import { type arrayImagenes, type arrayCorreos } from '../../../../shared/schemas/Interfaces'
import useAuth from '../../../../../hooks/useAuth'
import { Global } from '../../../../../helper/Global'
import { AgregarCorreos } from '../AgregarCorreos'
import { SwiperCorreos } from '../SwiperCorreos'
import { TitleBriefs } from '../../../../shared/TitleBriefs'
import Editor from '../../../../shared/modals/ModalPDF'
import EditorContexto from '../EditorContexto'
import { formatAPIdate } from '../../../../shared/functions/QuitarAcerntos'
import { v4 as uuidv4 } from 'uuid'

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
  id_contrato: string
  fecha_fin: string
  fecha_inicio: string
  observaciones: string
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

export const ModalActaAceptacion = ({
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
  const [, setArrayArchivos] = React.useState<arrayImagenes[]>([])
  const [contexto, setContexto] = React.useState('')
  const [contenido, setContenido] = React.useState('')
  const [tipoServicio, setTipoServicio] = React.useState('')
  const [asunto, setAsunto] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const [observaciones, setobservaciones] = React.useState('')

  const guardarAvance = async (): Promise<void> => {
    if (correos.length > 0 && contexto.length > 20) {
      if (tipoServicio && tipoServicio && contenido.length > 10) {
        setLoading(true)
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        const archive = `${datos.id_contrato}_ACTA DE CONFORMIDAD Y CONCLUSION - ${datos.nombre_marca}`
        const arrayArch = [
          {
            id: uuidv4(),
            imagen1: {
              archivo: 'acta_aceptacion',
              archivoName: archive
            }
          }
        ]
        const data = new FormData()
        data.append('titulo', asunto)
        data.append('nombres', datos.nombres)
        data.append('contexto', contexto)
        data.append('email', auth.email)
        data.append('email_alter', auth.email_alter)
        data.append('correos', JSON.stringify(correos))
        data.append('password', auth.pass_email)
        data.append('firma', auth.firma)
        // ACTA
        data.append('nombre_marca', datos.nombre_marca)
        data.append('archive', archive)
        data.append('entregables', contenido)
        data.append('observaciones', observaciones)
        data.append('tipoServicio', tipoServicio)
        data.append(
          'prefijo',
          tipoServicio == 'LPW'
            ? 'DESA'
            : tipoServicio == 'LPWA'
              ? 'DESA'
              : 'DISE'
        )
        data.append('contrato', datos.id_contrato)
        data.append('nombres_cliente', datos.nombres)
        data.append('fecha_inicio', formatAPIdate(datos.fecha_inicio))
        data.append('fecha_fin', formatAPIdate(datos.fecha_fin))

        const { fecha, hora } = obtenerFechaHora()
        const avance = {
          fecha,
          hora,
          asunto,
          imagenes: arrayImagenes,
          archivos: arrayArch,
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

        try {
          const respuesta = await axios.post(
              `${Global.url}/generarActa`,
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
                setArrayImagenes([])
                setArrayArchivos([])
                setAsunto('')
                setTipoServicio('')
                setobservaciones('')
                setContenido('')
                setContexto('')
                setCorreos([])
                getOneBrief()
                setOpen(false)
                Swal.fire('Acta de conformidad enviada', '', 'success')
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
        Swal.fire('Debe completar todos los campos', '', 'warning')
      }
    } else {
      Swal.fire('Complete todos los datos', '', 'warning')
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
    setAsunto(`ACTA DE CONFORMIDAD Y CONCLUSIÓN DE PROYECTOS - ${datos.nombre_marca}`)
    setContexto(`<p><span style="color: rgb(34, 34, 34);">El presente es para adjuntar una acta de conformidad y conclusión de proyecto de la empresa </span><strong style="background-color: yellow;"> "${datos.nombre_marca ?? ''}" </strong><strong> </strong></p><p><span style="color: rgb(34, 34, 34);">Si tuviera alguna duda o consulta no dude en comunicarse con nosotros.</span></p>`)
  }, [datos])

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
          ACTA DE CONFORMIDAD Y CONCLUSIÓN
        </h2>
        <div className="w-full flex gap-2 items-center justify-center">
          <AgregarCorreos correos={correos} setCorreos={setCorreos} />
          <SwiperCorreos correos={correos} setCorreos={setCorreos} />
        </div>
        <input
          type="text"
          disabled
          placeholder="ASUNTO"
          className="text-black outline-none px-4 py-3 border border-b-gray-400 w-full bg-gray-200"
          value={asunto}
        />

        <section className="px-0 py-2 flex flex-col gap-4 content_acta_Acaptacion">
          <EditorContexto content={contexto} setContent={setContexto} />
        </section>

        <select
              className="border placeholder-gray-400 focus:outline-none outline-none w-full pt-4 pr-4 pb-6 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                        border-gray-300 rounded-md transition-all text-black"
              name="tipoServicio"
              value={tipoServicio}
              onChange={(e) => {
                setTipoServicio(e.target.value)
              }}
            >
              {/* FB GOOGLE, VENTAS, POST VENTA, RECOMENDACION, ISNTAGRAM) */}
              <option value="">Seleccionar acta</option>
              <option value="LP69">DISEÑO GRAFICO</option>
              <option value="LPW">WEB INFORMATIVA</option>
              <option value="LPWA">WEB ADMINISTRABLE</option>
        </select>

        {tipoServicio == 'LPW'
          ? (
              <>
                <h2 className="text-center w-full text-black text-2xl mt-5 font-bold">
                  ACTA PARA DESARROLLO WEB - INFORMATIVA
                </h2>
                <div className="flex w-full mt-5 md:mt-5 flex-col">
                  <div className="w-full flex flex-col text-white">
                    <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-end gap-2 lg:gap-5">
                      <div className="w-full relative">
                        <TitleBriefs titulo="ENTREGABLES" />
                        <div className="mt-3">
                          <Editor
                            content={contenido}
                            setContent={setContenido}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-6 text-black flex flex-col items-end gap-2 lg:gap-5 border-red-500 border">
                      <div className="w-full relative">
                        <TitleBriefs titulo="OBSERVACIONES" />
                        <div className="mt-3">
                          <Editor
                            content={observaciones}
                            setContent={setobservaciones}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )
          : tipoServicio == 'LPWA'
            ? (
              <>
                <h2 className="text-center w-full text-black text-2xl mt-5 font-bold">
                  ACTA PARA DESARROLLO WEB - ADMINISTRABLE
                </h2>
                <div className="flex w-full mt-5 md:mt-5 flex-col">
                  <div className="w-full flex flex-col text-white">
                    <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-end gap-2 lg:gap-5">
                      <div className="w-full relative">
                        <TitleBriefs titulo="ENTREGABLES" />
                        <div className="mt-3">
                          <Editor
                            content={contenido}
                            setContent={setContenido}
                          />
                        </div>
                      </div>
                    </div>
                    <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-6 text-black flex flex-col items-end gap-2 lg:gap-5 border-red-500 border">
                      <div className="w-full relative">
                        <TitleBriefs titulo="OBSERVACIONES" />
                        <div className="mt-3">
                          <Editor
                            content={observaciones}
                            setContent={setobservaciones}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
              )
            : tipoServicio == 'LP69'
              ? (
              <>
                <h2 className="text-center w-full text-black text-2xl mt-5 font-bold">
                  ACTA PARA DISEÑO GRAFICO
                </h2>
                <div className="flex w-full mt-5 md:mt-5 flex-col">
                  <div className="w-full flex flex-col text-white">
                    <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-end gap-2 lg:gap-5">
                      <div className="w-full relative">
                        <TitleBriefs titulo="ENTREGABLES" />
                        <div className="mt-3">
                          <Editor
                            content={contenido}
                            setContent={setContenido}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
                )
              : null}

        {/* <ActaAceptacion id={idVenta} /> */}
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
            ENVIAR NOTIFICACIÓN
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
