import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Slide from '@mui/material/Slide'
import { type TransitionProps } from '@mui/material/transitions'
import { type FinalValues } from '../../../../shared/schemas/Interfaces'

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
}

interface values {
  open: boolean
  datos: valuesDatos
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  avance: FinalValues
}

export const ViewFinal = ({
  open,
  setOpen,
  datos,
  avance
}: values): JSX.Element => {
  const handleClose = (): void => {
    setOpen(false)
  }
  const [contexto, setContexto] = React.useState('')
  const [asunto, setAsunto] = React.useState('')
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    setContexto(avance.contexto)
    setAsunto(avance.asunto)
    setLoading(false)
  }, [avance])

  const determinarSaludo = (horaCadena: string): string => {
    // Extraer la hora de la cadena
    const hora = parseInt(horaCadena.split(':')[0], 10)
    let saludo = ''
    // Determinar el saludo basado en la hora
    if (hora < 12) {
      saludo = 'Buenos días'
    } else if (hora >= 12 && hora < 18) {
      saludo = 'Buenas tardes'
    } else {
      saludo = 'Buenas noches'
    }
    return saludo
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
          <hr className="py-2" />
          <section className="px-6 py-2 flex flex-col gap-4 text-black">
            <h2 className="w-full text-left text-black font-bold text-xl">
              Contenido
            </h2>
            <div>
                {// eslint-disable-next-line eqeqeq
                datos.fecha != '' && datos.fecha != 'null'
                  ? JSON.parse(datos.fecha).map((final: FinalValues, index: number) => (
                    <p key={index}>  { determinarSaludo(final.hora) } estimado(a) <strong>{datos.nombres}</strong></p>
                  ))
                  : ''}
              <p>
                De acuerdo a su conformidad se da por finalizado el sevicio -{' '}
                <strong>{datos.nombre_marca}</strong>{' '}
              </p>
              <br />
              <div
                className="descripcion-producto"
                dangerouslySetInnerHTML={{ __html: contexto }}
              ></div>
              <br />
              <p>
                Para la descarga de sus archivos finales le invitamos a acceder
                a nuestro sistema utilizando el siguiente link:{' '}
                <a
                  href="https://logosperu.com.pe/"
                  className="text-blue-700"
                >
                  https://logosperu.com.pe/
                </a>
              </p>
              <p>
                <br />
              </p>
              <p>
                <strong>Le recordamos que sus credenciales son:</strong>
              </p>
              <p>
                <br />
              </p>
              <p>USUARIO: {datos.correo}</p>
              <p>CONTRASEÑA: {datos.celular}</p>
              <p>
                <br />
              </p>
              <p>
                <strong>NOTA:</strong>
              </p>
              <p>
                Por favor descargar y guardar sus archivos. solo estará
                disponible por un plazo <strong>aprox. de 1 mes</strong>{' '}
                cumplido este plazo se eliminará los archivos. luego de ese
                tiempo establecido, la reposición o reenvío de archivos tendrá
                un costo.
              </p>
              <p>
                <br />
              </p>
              <p>Muchas gracias</p>
              <p>
                <br />
              </p>
            </div>
          </section>
          <hr className="py-2" />
        </DialogContentText>
          )
        : (
            'cargando ...'
          )}
      <DialogActions>
        <Button onClick={handleClose}>CERRAR</Button>
      </DialogActions>
    </Dialog>
  )
}
