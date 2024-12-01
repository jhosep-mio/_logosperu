import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Slide from '@mui/material/Slide'
import { type TransitionProps } from '@mui/material/transitions'
import axios from 'axios'
import Swal from 'sweetalert2'
import { type arrayCorreos } from '../../../../shared/schemas/Interfaces'
import useAuth from '../../../../../hooks/useAuth'
import { Global } from '../../../../../helper/Global'
import { ViewSwiperCorreos } from '../ViewSwiperCorreos'
import { Loading } from '../../../../shared/Loading'
import { AnimatePresence, motion } from 'framer-motion'
import { AgregarCorreos } from '../reenvioCorreos/AgregarCorreos'
import { SwiperCorreos } from '../reenvioCorreos/SwiperCorreos'

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
  correo: string
  celular: string
  fecha: string
  nombre_marca: string
  id_contrato: string
}

interface values {
  open: boolean
  datos: valuesDatos
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  avance: any
}

export const ViewAlta = ({
  open,
  setOpen,
  datos,
  avance
}: values): JSX.Element => {
  const handleClose = (): void => {
    setOpen(false)
  }
  const [correos, setCorreos] = React.useState<arrayCorreos[]>([])
  const [correosReenvio, setCorreosReenvio] = React.useState<arrayCorreos[]>([])
  const [contexto, setContexto] = React.useState('')
  const [firma, setfirma] = React.useState('')
  const [asunto, setAsunto] = React.useState('')
  const [loading, setLoading] = React.useState(false)
  const { auth } = useAuth()
  const [openReenvio, setOpenReenvio] = React.useState(false)

  React.useEffect(() => {
    if (avance) {
      setContexto(avance.contexto)
      setCorreos(avance.correos)
      setAsunto(avance.asunto)
      setfirma(avance.firma)
      setLoading(false)
    }
  }, [avance])

  const reenviarCorreo = async (): Promise<void> => {
    if (correosReenvio.length > 0) {
      const token = localStorage.getItem('token')
      setLoading(true)
      const data = new FormData()
      data.append('titulo', `RE:${asunto}`)
      data.append('nombres', datos.nombres)
      data.append('contrato', datos.id_contrato)
      data.append('marca', datos.nombre_marca)
      data.append('contexto', contexto)
      data.append('email', auth.email)
      data.append('email_cliente', datos.correo)
      data.append('celular_cliente', datos.celular)
      data.append('email_alter', auth.email_alter)
      data.append('correos', JSON.stringify(correosReenvio))
      data.append('password', auth.pass_email)
      if (firma) {
        data.append('firma', firma)
      } else {
        data.append('firma', auth.firma)
      }
      try {
        const respuesta = await axios.post(
              `${Global.url}/reenviarcorreoFinal`,
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
          Swal.fire('Correo reenviado', '', 'success')
          setOpenReenvio(false)
          setCorreosReenvio([])
        } else {
          Swal.fire('Error al registrar', '', 'error')
        }
      } catch (error: unknown) {
        console.log(error)
        Swal.fire('Error', '', 'error')
      }
      setLoading(false)
    } else {
      Swal.fire('Debe colocar almenos un corrreo', '', 'warning')
    }
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
      {!loading
        ? (
        <DialogContentText id="alert-dialog-slide-description">
          <h2 className="w-full font-bold text-2xl text-center text-white bg-main/80 py-2">
            {asunto}
          </h2>
          <div className="w-full flex flex-col gap-2 items-center justify-center py-2 px-6">
            <h2 className="w-full text-left text-black font-bold text-xl">
              Correos
            </h2>
            <ViewSwiperCorreos correos={correos} />
          </div>
          <hr className="py-2" />
          <section className="px-6 py-2 flex flex-col gap-4 text-black">
            <div>
              <div
                className="descripcion-producto"
                dangerouslySetInnerHTML={{ __html: contexto }}
              ></div>
              <br />
              <p>
                <br />
              </p>
              {firma &&
              <p>
                <strong>ATTE:</strong>
                <img
                  src={`${Global.urlImages}/firmas/${firma}`}
                  alt="Imagen"
                  width="300"
                  height="auto"
                />
              </p>
              }
            </div>
          </section>
          <hr className="py-2" />
        </DialogContentText>
          )
        : (
            <DialogContentText id="alert-dialog-slide-description" className='min-h-96 '>
            <Loading/>
          </DialogContentText>
          )}
      <DialogActions className='relative'>
        <AnimatePresence>
            {openReenvio && !loading &&
                <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className='rounded-xl bg-white shadow-lg shadow-black w-full md:w-[80%] h-fit left-0 ml-auto right-0 absolute bottom-full overflow-hidden'>
                    <div className="w-full flex-col items-center justify-center gap-6 pb-4 md:pb-0">
                        <div className='flex flex-col md:flex-row justify-between gap-2 md:gap-6 items-center md:pr-4'>
                            <AgregarCorreos correos={correosReenvio} setCorreos={setCorreosReenvio} />
                            <button
                            disabled={loading}
                            // eslint-disable-next-line @typescript-eslint/no-misused-promises
                            onClick={ async () => { await reenviarCorreo() }}
                            className='bg-blue-600 hover:bg-blue-800 text-white h-fit px-4 text-lg rounded-md'>Continuar</button>
                        </div>
                        {correosReenvio.length > 0 &&
                            <SwiperCorreos correos={correosReenvio} setCorreos={setCorreosReenvio} />
                        }
                    </div>
                </motion.div>
            }
        </AnimatePresence>
        <button className='bg-red-600 hover:bg-red-800 text-white px-4 text-lg rounded-md' onClick={handleClose}>Cerrar</button>
        <button className='bg-green-600 hover:bg-green-800 text-white px-4 text-lg rounded-md' onClick={() => { setOpenReenvio(!openReenvio) }}>Reenviar</button>
      </DialogActions>
    </Dialog>
  )
}
