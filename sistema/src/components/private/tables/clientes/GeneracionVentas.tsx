/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable multiline-ternary */
import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState
} from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { TitleBriefs } from '../../../shared/TitleBriefs'
import { Errors } from '../../../shared/Errors'
import Slide from '@mui/material/Slide'
import { type TransitionProps } from '@mui/material/transitions'
import { LoadingSmall } from '../../../shared/LoadingSmall'
import { useFormik } from 'formik'
import { SchemaValidarVentas } from '../../../shared/schemas/Schemas'
import { Global } from '../../../../helper/Global'
import axios from 'axios'
import Swal from 'sweetalert2'
import {
  type ListcontactoClientes,
  type arrayAsignacion,
  type ValuesPlanes,
  type arrayContacto,
  type arrayCorreos
} from '../../../shared/schemas/Interfaces'
import { RegistroContacto2 } from './modals/RegistroContacto2'
import EditorPdfAltas from '../../../shared/modals/EditorPdfAltas'
import useAuth from '../../../../hooks/useAuth'
import { ListaUsuarios } from './alta/ListaUsuarios'

const Transition = React.forwardRef(function Transition (
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

interface valuesVentasTO {
  id: number
  medio_ingreso: string
  nombre_empresa: string
  plan: string
  id_contrato: string
  dni_ruc: string
  id_cliente: string
  nombre_cliente: string
  arraycontacto: string
  celular: string
  email: string
}

interface valuesInterface {
  open: boolean
  datos: valuesVentasTO
  planes: ValuesPlanes[]
  setOpen: Dispatch<SetStateAction<boolean>>
  getClientes: (texto: string) => Promise<void>
  usuarios: never[]
}

export const GeneracionVentas = ({
  open,
  datos,
  planes,
  setOpen,
  getClientes,
  usuarios
}: valuesInterface): JSX.Element => {
  const handleClose = (): void => {
    setOpen(false)
    setContenido('')
    setCorreos([])
    setarrayPesos([])
  }
  const token = localStorage.getItem('token')
  const [loadingValidacion, seLoadingValidation] = useState(false)
  const [loading, setLoading] = useState(false)
  const [abrirPlan, setAbrirPlan] = useState(false)
  const [contenido, setContenido] = useState('')
  const { auth } = useAuth()
  const [correos, setCorreos] = useState<arrayCorreos[]>([])
  const [arrayContacto, setarrayConacto] = useState<arrayContacto[]>([])
  const [personContact, setpersonContact] = useState<string | null>(null)
  const [openContacto, setopenContacto] = useState<boolean>(false)
  const [arrayPesos, setarrayPesos] = useState<arrayAsignacion[]>([
    { id: null, peso: '' }
  ])
  const navigate = useNavigate()
  const limpiar = (): void => {
    resetForm()
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

  const generarVenta = async (): Promise<void> => {
    setLoading(true)
    try {
      const data = new FormData()
      data.append('id_cliente', values.id_cliente)
      data.append('medio_ingreso', values.medio_ingreso)
      data.append('dni_ruc', values.dni_ruc)
      data.append('nombre_empresa', values.nombre_empresa)
      data.append('id_contrato', values.id_contrato)
      data.append('id_contacto', personContact ?? '')
      data.append('asignacion', JSON.stringify(arrayPesos))
      data.append('fecha_alta', generarFecha())
      data.append('fecha_inicio', values.fecha_inicio)
      data.append('titulo', values.asunto)
      data.append('contexto', contenido)
      data.append('email', auth.email)
      data.append('email_alter', auth.email_alter)
      data.append('nombre_marca', values.asunto)
      data.append('correos', JSON.stringify(correos))
      data.append('password', auth.pass_email)
      data.append('firma', auth.firma)
      const { fecha, hora } = obtenerFechaHora()
      const avance = {
        fecha,
        hora,
        asunto: values.asunto,
        correos,
        contexto: contenido,
        firma: auth.firma
      }
      data.append('contenido', JSON.stringify(avance))
      const request = await axios.post(`${Global.url}/generarVenta2`, data, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })
      if (request.data.status == 'success') {
        const enviarNotificacion = async (): Promise<void> => {
          const data = new FormData()
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          const pathName = `/admin/lista-servicios/avances/${request.data.id_venta ?? ''}`
          data.append('id_usuario', auth.id)
          data.append('id_venta', String(request.data.id_venta))
          data.append('nombre', auth.name)
          data.append('icono', 'correo')
          data.append('url', pathName)
          data.append(
            'contenido',
                  `Ha enviado una alta para el proyecto ${
                    values?.nombre_empresa ?? ''
                  }  (${values?.nombre_cliente ?? ''})`
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
        navigate('/admin/lista-ventas-agencia')
      } else {
        Swal.fire('Error al generar la venta', '', 'error')
      }
    } catch (error: any) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const {
    handleSubmit,
    handleChange,
    setValues,
    resetForm,
    errors,
    values,
    touched,
    isSubmitting,
    handleBlur
  } = useFormik({
    initialValues: {
      id: 0,
      medio_ingreso: '',
      nombre_empresa: '',
      plan: '',
      id_contrato: '',
      dni_ruc: '',
      id_cliente: '',
      nombre_cliente: '',
      asunto: '',
      fecha_inicio: '',
      celular: '',
      email: ''
    },
    validationSchema: SchemaValidarVentas,
    onSubmit: generarVenta
  })

  const generarCodigo = async (plan: string): Promise<void> => {
    seLoadingValidation(true)
    try {
      const data = new FormData()
      data.append('plan', plan)
      const request = await axios.post(
        `${Global.url}/generarCodigo`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      if (request.data.status == 'success') {
        setValues({
          ...values,
          id_contrato: request.data.codigo
        })
      } else {
        Swal.fire('Error al generar la venta', '', 'error')
      }
    } catch (error) {
      console.log(error)
      Swal.fire('Error al generar la venta', '', 'error')
    }
    seLoadingValidation(false)
  }

  const returnIngreso = (id: string): string => {
    if (id == '0') {
      return 'Facebook'
    } else if (id == '1') {
      return 'Google'
    } else if (id == '5') {
      return 'Instagram'
    } else if (id == '2') {
      return 'Ventas'
    } else if (id == '3') {
      return 'Post Venta'
    } else if (id == '4') {
      return 'Whatsapp'
    } else if (id == '6') {
      return 'Recomendación'
    } else if (id == '7') {
      return 'Logos'
    } else {
      return ''
    }
  }

  const generarFecha = (): string => {
    const fechaActual: Date = new Date()
    const dia: number = fechaActual.getDate()
    const mes: number = fechaActual.getMonth() + 1 // Los meses comienzan desde 0
    const año: number = fechaActual.getFullYear()
    const formatearNumero = (numero: number): string => {
      return numero < 10 ? `0${numero}` : `${numero}`
    }
    // Formatear día, mes y año
    const diaFormateado = formatearNumero(dia)
    const mesFormateado = formatearNumero(mes)
    return `${diaFormateado}/${mesFormateado}/${año}`
  }

  useEffect(() => {
    if (open) {
      setValues({
        ...values,
        id: datos.id,
        medio_ingreso: datos.medio_ingreso,
        nombre_empresa: datos.nombre_empresa,
        plan: datos.plan,
        id_contrato: datos.id_contrato,
        dni_ruc: datos.dni_ruc,
        nombre_cliente: datos.nombre_cliente,
        id_cliente: datos.id_cliente,
        celular: datos?.celular,
        email: datos.email,
        fecha_inicio: generarFecha()
      })
      setarrayConacto(datos.arraycontacto ? JSON.parse(datos.arraycontacto) : [])
    }
  }, [open])

  useEffect(() => {
    if (open) {
      const nombresColaboradores = arrayPesos
        .filter((item: any) => item.nombre) // Filtrar los elementos que tienen un nombre definido
        .map((item: any) => `${item.genero === 'mujer' ? 'Srta.' : ''} ${item.nombre}`)
        .join(' – ')
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands, @typescript-eslint/restrict-template-expressions
      const textoadcional = `<p>Estimados Colaboradores </p><p>&nbsp;</p><p>Le damos la Bienvenida al cliente :&nbsp;<span style="background-color: rgb(249, 250, 251);"> ${values.nombre_empresa}</span></p><p>&nbsp;</p><ul><li>Persona de contacto : Sr. ${values?.nombre_cliente} </li><li>Mail&nbsp;: ${values.email ?? ''} </li><li>Móvil&nbsp;: ${values.celular ?? ''} </li></ul></p><p>&nbsp;</p>`
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const textofinal = `<p>&nbsp;</p><p>${values?.id_contrato ?? ''}/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;M1 – ${returnIngreso(values.medio_ingreso ?? '')} </p><p>&nbsp;</p><p>COLABORADORES A CARGO: ${nombresColaboradores}</p><p>&nbsp;</p><p>FECHA DE INICIO DEL SERVICIO:&nbsp;${values.fecha_inicio ?? ''}</p><p>&nbsp;</p><p>&nbsp;</p><p>SALUDOS.&nbsp;</p>`
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      const contenidoConTextoAdicional = textoadcional + ('') + textofinal
      setContenido(contenidoConTextoAdicional)
    }
  }, [values.fecha_inicio, arrayPesos])

  useEffect(() => {
    if (errors && isSubmitting) {
      const firstErrorKey = Object.keys(errors)[0]
      const firstErrorElement = document.getElementsByName(firstErrorKey)[0]
      if (firstErrorElement) {
        firstErrorElement.focus()
      }
    }
  }, [touched, errors, isSubmitting])

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        maxWidth={'md'}
        aria-describedby="alert-dialog-slide-description"
        className="ww-screen p-0 m-0 modal_dialog_correlativo"
      >
        {values.id_contrato ? (
          <DialogContentText id="alert-dialog-slide-description">
            {loadingValidacion
              ? (
              <LoadingSmall />
                )
              : (
              <form
                className="flex flex-col bg-white rounded-md relative p-4     "
                onSubmit={handleSubmit}
              >
                <div className="flex w-full flex-col">
                  <div className="w-full flex flex-col text-white">
                    <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-end gap-2 lg:gap-x-5 lg:gap-y-0">
                      <div className="w-full flex flex-col lg:flex-row gap-3 lg:gap-5 mt-3 lg:mt-0">
                        <div className="w-full lg:relative pb-5">
                          <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="email"
                          >
                            Contrato
                          </label>
                          <input
                            className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                            value={values?.id_contrato}
                            disabled
                          />
                        </div>
                        <div className="w-full lg:relative pb-5">
                          <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="email"
                          >
                            Cliente
                          </label>
                          <input
                            className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                            value={values?.nombre_cliente}
                            disabled
                          />
                        </div>
                        <div className="w-full lg:relative pb-5">
                          <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="email"
                          >
                            Fecha de inicio
                          </label>
                          <input
                            className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                            name="fecha_inicio"
                            value={values.fecha_inicio}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={false}
                          />
                          <Errors
                            errors={errors.fecha_inicio}
                            touched={touched.fecha_inicio}
                          />
                        </div>
                      </div>
                      <div className="w-full flex flex-col lg:flex-row gap-3 lg:gap-5 mt-3 lg:mt-0">
                        <div className="w-full lg:relative pb-5">
                          <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="email"
                          >
                            Asunto de mail
                          </label>
                          <input
                            className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                            name="asunto"
                            value={values.asunto}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={false}
                          />
                          <Errors
                            errors={errors.asunto}
                            touched={touched.asunto}
                          />
                        </div>
                      </div>
                      <ListaUsuarios
                        arrayPesos={arrayPesos}
                        usuarios={usuarios}
                        setarrayPesos={setarrayPesos}
                        setCorreos={setCorreos}
                        correos={correos}
                      />
                      <div className="w-full relative">
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="email"
                        >
                          Detalle del servicio
                        </label>
                        <div className="mt-3">
                          <EditorPdfAltas
                            content={contenido}
                            setContent={setContenido}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="h-fit flex w-full justify-end items-center gap-3 rounded-md text-black ">
                  <div className="flex w-fit gap-3 rounded-md text-black ">
                    {!loading
                      ? (
                      <input
                        type="submit"
                        className="bg-secondary-150 hover:bg-secondary-150/70 transition-colors px-3 py-2 text-white rounded-md cursor-pointer"
                        value="Generar alta"
                      />
                        )
                      : (
                      <input
                        type="button"
                        disabled
                        className="bg-secondary-150/70 px-3 py-2 text-white rounded-md cursor-pointer"
                        value="Cargando..."
                      />
                        )}
                  </div>
                </div>
              </form>
                )}
          </DialogContentText>
        ) : (
            <>
         <DialogTitle className="text-center">{'Generar Alta'}</DialogTitle>
          <DialogContent className="w-full md:w-96 max-h-[500px] p-0">
            <DialogContentText
              id="alert-dialog-slide-description"
              className="w-full p-0 m-0"
            >
              {loadingValidacion ? (
                <LoadingSmall />
              ) : (
                <form
                  className="flex flex-col gap-5 w-full"
                  onSubmit={handleSubmit}
                >
                  {!abrirPlan ? (
                    <>
                      {/* <div className="w-full  lg:relative mt-5">
                        <TitleBriefs titulo=" Nombres/Empresa" />
                        <input
                            className="border placeholder-gray-400 focus:outline-none
                                        focus:border-black w-full pr-4 h-12 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                        border-gray-300 rounded-md transition-all"
                            name="nombre_empresa"
                            type="text"
                            value={values.nombre_empresa}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={false}
                        />
                        <Errors
                            errors={errors.nombre_empresa}
                            touched={touched.nombre_empresa}
                        />
                        </div> */}
                      <div className="w-full  lg:relative pt-5">
                        <button
                          onClick={() => {
                            setopenContacto(true)
                          }}
                          className="w-fit top-0 right-0 hover:bg-green-700 transition-colors cursor-pointer z-100 px-2 rounded-md text-white text-sm bg-green-600 absolute"
                        >
                          Nuevo contacto
                        </button>
                        <TitleBriefs titulo=" Nombres/Empresa" />
                        <select
                          className="border placeholder-gray-400 max-w-full focus:outline-none overflow-hidden
                                        focus:border-black w-full pr-4 h-12 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                        border-gray-300 rounded-md transition-all outline-none"
                          name="nombre_empresa"
                          value={values.nombre_empresa}
                          onChange={(e) => {
                            if (arrayContacto && arrayContacto.length > 0) {
                              const selectedContact = arrayContacto.find(
                                // @ts-expect-error
                                (contacto: ListcontactoClientes) =>
                                  contacto.nombres === e.target.value
                              )
                              setpersonContact(
                                // @ts-expect-error
                                selectedContact ? selectedContact.id : null
                              )
                            }
                            handleChange(e)
                          }}
                          onBlur={handleBlur}
                          disabled={false}
                        >
                          {datos.nombre_empresa && (
                            <option value={datos.nombre_empresa}>
                              {datos.nombre_empresa}
                            </option>
                          )}
                          {datos.nombre_cliente && (
                            <option value={datos.nombre_cliente}>
                              {datos.nombre_cliente}
                            </option>
                          )}
                          {arrayContacto &&
                            arrayContacto.length > 0 &&
                            arrayContacto.map(
                              // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                              // @ts-expect-error
                              (contacto: ListcontactoClientes) => (
                                <option
                                  value={contacto.nombres}
                                  key={contacto.id}
                                >
                                  {contacto.nombres} - {contacto.marca}
                                </option>
                              )
                            )}
                        </select>
                        <Errors
                          errors={errors.nombre_empresa}
                          touched={touched.nombre_empresa}
                        />
                      </div>
                      <div className="w-full  lg:relative mt-2">
                        <TitleBriefs titulo="Medio de ingreso" />
                        <select
                          className="border placeholder-gray-400 focus:outline-none
                                                                        focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                                        border-gray-300 rounded-md transition-all"
                          name="medio_ingreso"
                          value={values.medio_ingreso}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          {/* FB GOOGLE, VENTAS, POST VENTA, RECOMENDACION, ISNTAGRAM) */}
                          <option value="">Seleccionar</option>
                          <option value="0">Facebook</option>
                          <option value="4">Whatsapp</option>
                          <option value="1">Google</option>
                          <option value="5">Instagram</option>
                          {/* <option value="2">Ventas</option> */}
                          <option value="3">Post Venta</option>
                          <option value="6">Recomendación</option>
                          <option value="7">Logos</option>
                        </select>
                        <Errors
                          errors={errors.medio_ingreso}
                          touched={touched.medio_ingreso}
                        />
                      </div>
                      <div className="w-full  lg:relative mt-2">
                        <TitleBriefs titulo=" DNI/RUC (Opcional)" />
                        <input
                          className="border placeholder-gray-400 focus:outline-none
                                        focus:border-black w-full pr-4 h-12 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                        border-gray-300 rounded-md transition-all"
                          name="dni_ruc"
                          type="text"
                          value={values.dni_ruc}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={false}
                        />
                        <Errors
                          errors={errors.dni_ruc}
                          touched={touched.dni_ruc}
                        />
                      </div>
                      <div className="w-full  lg:relative mt-2">
                        <TitleBriefs titulo="Plan" />
                        <button
                          className="border placeholder-gray-400 focus:outline-none
                                                                        focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                                        border-gray-300 rounded-md transition-all"
                          onClick={() => {
                            setAbrirPlan(true)
                          }}
                        >
                          {values.plan ? values.plan : 'Seleccionar'}
                        </button>
                        {/* <Errors errors={errors.plan} touched={touched.plan} /> */}
                      </div>
                    </>
                  ) : (
                    <div className="w-full lg:relative mt-2 ">
                      <TitleBriefs titulo="Seleecionar plan" />
                      <div className="grid grid-cols-1 md:grid-cols-1 gap-2 items-center mb-0 p-4 cursor-pointer">
                        {planes.map((plan) => (
                          <p
                            key={plan.id}
                            className="line-clamp-2 text-black text-center w-full border-2 py-1 rounded-xl"
                            onClick={() => {
                              generarCodigo(plan.codigo)
                            }}
                          >
                            {plan.nombre}
                          </p>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex w-full justify-end gap-3 rounded-md text-black ">
                    <Link
                      to="#"
                      className="bg-red-600 px-3 py-2 rounded-md text-white cursor-pointer"
                      onClick={() => {
                        handleClose()
                        limpiar()
                        setAbrirPlan(false)
                      }}
                    >
                      Cancelar
                    </Link>
                  </div>
                </form>
              )}
            </DialogContentText>
          </DialogContent>
          </>

        )}
      </Dialog>
      <div>
        <RegistroContacto2
          open={openContacto}
          setOpen={setopenContacto}
          id={datos.id_cliente}
          arrayContacto={arrayContacto}
          setarrayConacto={setarrayConacto}
          getOneBrief={getClientes}
          datos={datos}
        />
      </div>
    </>
  )
}
