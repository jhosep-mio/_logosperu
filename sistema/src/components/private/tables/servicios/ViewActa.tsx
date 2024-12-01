import * as React from 'react'
import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Slide from '@mui/material/Slide'
import { type TransitionProps } from '@mui/material/transitions'
import { type FinalValues } from '../../../shared/schemas/Interfaces'
import { Global } from '../../../../helper/Global'
import useAuth from '../../../../hooks/useAuth'
import { pdf } from '../../../shared/Images'
import { Link } from 'react-router-dom'

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
  archivos: string
}

interface values {
  open: boolean
  datos: valuesDatos
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const ViewActa = ({ open, setOpen, datos }: values): JSX.Element => {
  const handleClose = (): void => {
    setOpen(false)
  }

  const { auth } = useAuth()

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
      {/* {!loading
        ? ( */}
      <DialogContentText id="alert-dialog-slide-description">
        <h2 className="w-full font-bold text-2xl text-center text-white bg-main/80 py-2">
          ACTA DE ACEPTACIÓN Y CONCLUSIÓN DE PROYECTOS
        </h2>
        <div className="w-full flex flex-col gap-2 items-center justify-center py-2 px-6">
          <h2 className="w-full text-left text-black font-bold text-xl">
            Correos
          </h2>
          {/* <ViewSwiperCorreos correos={correos} /> */}
          <div className="flex w-full gap-4">
            <span>{datos.correo},</span>
            <span>ventas@logosperu.com,</span>
            <span>administracion@logosperu.com</span>
          </div>
        </div>
        <hr className="py-2" />
        <section className="px-6 py-2 flex flex-col gap-4 text-black">
          <div>
            {datos.fecha != '' && datos.fecha != 'null'
              ? JSON.parse(datos.fecha).map(
                (final: FinalValues, index: number) => (
                    <p key={index}>
                      {' '}
                      {determinarSaludo(final.hora)} estimado(a){' '}
                      <strong>{datos.nombres}</strong>
                    </p>
                )
              )
              : ''}
            <br />
            <br />
            <p>
              El presente es para adjuntar una acta de conformidad y conclusión
              del proyecto de la empresa
              <strong>{` "${datos.nombres}"`}</strong>
            </p>
            <p>
              Si tuviera alguna duda o consulta no dude en comunicarse con
              nosotros.
            </p>
            <br />
            <p>
              <strong>Archivos adjuntos:</strong>
            </p>
            <div className="flex gap-4 py-4">
              {JSON.parse(datos.archivos).map((acta: string, index: number) => (
                <Link to={`${Global.urlImages}/actaaceptacion/${acta}`} target='_blank' key={index} className="flex flex-col gap-2 justify-center items-center">
                  <img src={pdf} alt="" className="w-10 h-10 mx-auto" />
                  <span className='line-clamp-1 max-w-[170px] text-sm'> ACTA DE ACEPTACIÓN {datos.nombre_marca} {acta}</span>
                </Link>
              ))}
            </div>
            <br />
            <p>Muchas gracias</p>
            <p>
              <strong>ATTE:</strong>
             <br />
              <img
                src={`${Global.urlImages}/firmas/${auth.firma}`}
                alt="Imagen"
                className='mt-4'
                width="300"
                height="auto"
              />
            </p>
          </div>
        </section>
        <hr className="py-2" />
      </DialogContentText>
      {/* )
        : (
            'cargando ...'
          )} */}
      <DialogActions>
        <Button onClick={handleClose}>CERRAR</Button>
      </DialogActions>
    </Dialog>
  )
}
