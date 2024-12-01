/* eslint-disable @typescript-eslint/ban-ts-comment */
import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContentText from '@mui/material/DialogContentText'
import Slide from '@mui/material/Slide'
import { type TransitionProps } from '@mui/material/transitions'
import { cn } from '../../../../shared/cn'
import { Loading } from '../../../../shared/Loading'
import { ViewSwiperCorreos } from './ViewSwiperCorreos'
import { ViewSwiperImagenes } from './ViewSwiperImagenes'
import { ViewSwiperArchivos } from './ViewSwiperArchivos'
import { CrearComentario } from './comentarios/CrearComentario'
import { ListaComentarios } from './comentarios/ListaComentarios'
import { ResponderComentario } from './comentarios/ResponderComentario'
import { type arrayCorreos, type arrayImagenes, type comentariosValues } from '../../../../shared/schemas/Interfaces'

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
  avance: any
  datos: valuesDatos
  getData: any
  setArrayAvances: any
  arrayAvances: any
}

export const ViewAvance = ({
  open,
  setOpen,
  avance,
  getData,
  arrayAvances,
  setArrayAvances
}: values): JSX.Element => {
  const handleClose = (): void => {
    setOpen(false)
  }
  const [correos, setCorreos] = React.useState<arrayCorreos[]>([])
  const [arrayImagenes, setArrayImagenes] = React.useState<arrayImagenes[]>([])
  const [arrayArchivos, setArrayArchivos] = React.useState<arrayImagenes[]>([])
  const [contexto, setContexto] = React.useState('')
  const [comentarios, setComentarios] = React.useState<comentariosValues[]>([])
  const [asunto, setAsunto] = React.useState('')
  const [razon, setrazon] = React.useState('')
  const [precio, setprecio] = React.useState('')
  const [empresa, setEmpresa] = React.useState('')
  const [contacto, setContacto] = React.useState('')
  const [motivo, setMotivo] = React.useState('')
  const [fechaacta, setFecha] = React.useState('')
  const [conclusion, setConclusion] = React.useState('')
  const [firma, setFirma] = React.useState('')
  const [loading, setLoading] = React.useState(true)
  const [openResponder, setOpenResponder] = React.useState(false)
  const [idComentario, setIdComentario] = React.useState<string | null>('')
  const [texto, setTexto] = React.useState<string | null>('')

  React.useEffect(() => {
    if (avance.contexto) {
      setContexto(avance.contexto)
    } else {
      setContexto('')
    }
    if (avance.comentarios) {
      setComentarios(avance.comentarios)
    } else {
      setComentarios([])
    }
    if (avance.razon) {
      setrazon(avance.razon)
    } else {
      setrazon('')
    }
    if (avance.precio) {
      setprecio(avance.precio)
    } else {
      setprecio('')
    }
    if (avance.imagenes) {
      setArrayImagenes(avance.imagenes)
    } else {
      setArrayImagenes([])
    }
    if (avance.archivos) {
      setArrayArchivos(avance.archivos)
    } else {
      setArrayArchivos([])
    }
    if (avance.correos) {
      setCorreos(avance.correos)
    } else {
      setCorreos([])
    }
    if (avance.asunto) {
      setAsunto(avance.asunto)
    } else {
      setAsunto('')
    }
    if (avance.empresa) {
      setEmpresa(avance.empresa)
    } else {
      setEmpresa('')
    }
    if (avance.motivo) {
      setMotivo(avance.motivo)
    } else {
      setMotivo('')
    }
    if (avance.contacto) {
      setContacto(avance.contacto)
    } else {
      setContacto('')
    }
    if (avance.fechaacta) {
      setFecha(avance.fechaacta)
    } else {
      setFecha('')
    }
    if (avance.conclusion) {
      setConclusion(avance.conclusion)
    } else {
      setConclusion('')
    }
    if (avance.firma) {
      setFirma(avance.firma)
    } else {
      setFirma('')
    }
    setLoading(false)
  }, [avance])

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={handleClose}
      aria-describedby="alert-dialog-slide-description"
      className="moda_registro"
      maxWidth={avance.razon ? 'lg' : 'md'}
    >
      <section
        className={cn(
          'w-full grid',
          avance.razon ? ' grid-cols-2' : 'grid-cols-1'
        )}
      >
        <div className="w-full">
          {!loading
            ? <DialogContentText id="alert-dialog-slide-description">
              <h2 className="w-full font-bold text-2xl text-center text-white bg-main/80 py-2">
                {asunto}
              </h2>
              <div className="w-full flex flex-col gap-2 items-center justify-center py-2 px-6">
                <h2 className="w-full text-left text-black font-bold text-xl">
                  Correos
                </h2>
                <ViewSwiperCorreos correos={correos} />
              </div>
              {razon && (
                <div className="flex items-center  border border-b-gray-400">
                  <p className="block h-full py-3 px-4 border-r border-r-gray-400 text-black font-bold w-[150px]">
                    RAZON DE OBSEQUIO:
                  </p>
                  <input
                    type="text"
                    className="uppercase text-black outline-none px-4 py-3 w-full"
                    value={razon}
                    disabled
                  />
                </div>
              )}
              {precio && (
                <div className="flex items-center  border border-b-gray-400">
                  <p className="block h-full py-3 px-4 border-r border-r-gray-400 text-black font-bold w-[150px]">
                    PRECIO:
                  </p>
                  <input
                    type="text"
                    className="uppercase text-black outline-none px-4 py-3 w-full"
                    value={precio}
                    disabled
                  />
                </div>
              )}
              {empresa && (
                <div className="flex items-center  border border-b-gray-400">
                  <p className="block h-full py-3 px-4 border-r border-r-gray-400 text-black font-bold w-[150px]">
                    EMPRESA:
                  </p>
                  <input
                    type="text"
                    className="uppercase text-black outline-none px-4 py-3 w-full"
                    value={empresa}
                    disabled
                  />
                </div>
              )}
              {contacto && (
                <div className="flex items-center  border border-b-gray-400">
                  <p className="block h-full py-3 px-4 border-r border-r-gray-400 text-black font-bold w-[150px]">
                    CONTACTO:
                  </p>
                  <input
                    type="text"
                    className="uppercase text-black outline-none px-4 py-3 w-full"
                    value={contacto}
                  />
                </div>
              )}
              {motivo && (
                <div className="flex items-center  border border-b-gray-400">
                  <p className="block h-full py-3 px-4 border-r border-r-gray-400 text-gray-500 font-bold w-[150px]">
                    MOTIVO:
                  </p>
                  <input
                    type="text"
                    className="uppercase text-gray-500 outline-none px-4 py-3 w-full"
                    value={motivo}
                    disabled
                  />
                </div>
              )}
              {fechaacta && (
                <>
                  <div className="flex items-center  border border-b-gray-400">
                    <p className="block h-full py-3 px-4 border-r border-r-gray-400 text-black font-bold w-[150px]">
                      FECHA:
                    </p>
                    <input
                      type="text"
                      className="uppercase text-black outline-none px-4 py-3 w-full"
                      value={fechaacta}
                    />
                  </div>
                  <div className="flex items-center  border border-b-gray-400">
                    <p className="block h-full py-3 px-4 border-r border-r-gray-400 text-gray-500 font-bold w-[150px]">
                      ASUNTO:
                    </p>
                    <input
                      type="text"
                      className="uppercase text-gray-500 outline-none px-4 py-3 w-full"
                      value={asunto}
                      disabled
                    />
                  </div>
                </>
              )}
              <hr className="py-2" />
              <section className="px-6 py-2 flex flex-col gap-4 overflow-hidden">
                <h2 className="w-full text-left text-black font-bold text-xl">
                  Contenido
                </h2>
                <div
                  className="descripcion-producto"
                  dangerouslySetInnerHTML={{ __html: contexto }}
                ></div>
              </section>
              {/* <hr className="py-2" /> */}
              {arrayImagenes.length > 0 && (
                <section className="px-6">
                  <h2 className="w-full text-left text-black font-bold text-xl">
                    Imagenes adjuntas
                  </h2>
                  <ViewSwiperImagenes arrayImagenes={arrayImagenes} />
                </section>
              )}
              {arrayArchivos.length > 0 && (
                <section className="px-6">
                  <h2 className="w-full text-left text-black font-bold text-xl">
                    Archivos adjuntos
                  </h2>
                  <ViewSwiperArchivos arrayImagenes={arrayArchivos} />
                </section>
              )}
              {conclusion.length > 10 && (
                <section className="px-6 py-2 flex flex-col gap-4">
                  <h2 className="w-full text-left text-black font-bold text-xl">
                    Conclusión
                  </h2>
                  <div
                    className="descripcion-producto"
                    dangerouslySetInnerHTML={{ __html: conclusion }}
                  ></div>
                </section>
              )}
              {firma && (
                <div className="flex items-start flex-col px-4">
                  <p className="block h-full py-3 px-4 text-black font-bold w-[150px]">
                    ATTE:
                  </p>
                  <img
                    src={`https://api.logosperu.com.pe/public/firmas/${firma}`}
                    alt=""
                    className="w-[350px]"
                  />
                </div>
              )}
            </DialogContentText>
            : (
            <DialogContentText
              id="alert-dialog-slide-description"
              className="min-h-96"
            >
              <Loading />
            </DialogContentText>
              )}
          <DialogActions className="relative">
            <button
              className="bg-red-600 hover:bg-red-800 text-white px-4 text-lg rounded-md"
              onClick={handleClose}
            >
              Cerrar
            </button>
          </DialogActions>
        </div>
        <div>
          <section className="w-full h-full ">
            <CrearComentario
              setComentarios={setComentarios}
              getOneBrief={getData}
              events={arrayAvances}
              setEvents={setArrayAvances}
              eventSelected={avance}
            />
            <ListaComentarios
              setIdComentario={setIdComentario}
              setOpen={setOpenResponder}
              setTexto={setTexto}
              comentarios={comentarios}
              setComentarios={setComentarios}
              getOneBrief={getData}
              events={arrayAvances}
              setEvents={setArrayAvances}
              eventSelected={avance}
            />
             <ResponderComentario
              comentarios={comentarios}
              getComentarios={getData}
              idComentario={idComentario}
              open={openResponder}
              setComentarios={setComentarios}
              setIdComentario={setIdComentario}
              setOpen={setOpenResponder}
              textoComentario={texto}
              eventSelected={avance}
              events={arrayAvances}
              setEvents={setArrayAvances}
            />
          </section>
        </div>
      </section>
    </Dialog>
  )
}
