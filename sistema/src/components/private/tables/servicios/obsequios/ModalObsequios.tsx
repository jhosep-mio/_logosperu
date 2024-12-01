/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable multiline-ternary */
import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState
} from 'react'
import { useParams } from 'react-router-dom'
import Dialog from '@mui/material/Dialog'
import DialogContentText from '@mui/material/DialogContentText'
import Slide from '@mui/material/Slide'
import { type TransitionProps } from '@mui/material/transitions'
import { useFormik } from 'formik'
import axios from 'axios'
import Swal from 'sweetalert2'
import {
  type arrayAdicionales,
  type arrayAsignacion,
  type arrayContacto,
  type arrayCorreos
} from '../../../../shared/schemas/Interfaces'
import useAuth from '../../../../../hooks/useAuth'
import { SchemaValidarObsequio } from '../../../../shared/schemas/Schemas'
import { Global } from '../../../../../helper/Global'
import { LoadingSmall } from '../../../../shared/LoadingSmall'
import { Errors } from '../../../../shared/Errors'
import { RegistroContacto2 } from '../../clientes/modals/RegistroContacto2'
import { v4 as uuidv4 } from 'uuid'
import { IoCloseCircleOutline } from 'react-icons/io5'
import EditorPdfAltas from '../../../../shared/modals/EditorPdfAltas'
import { Chip } from '@mui/material'
import { ListaUsuarios } from './ListaUsuarios'
import { toast } from 'sonner'
import { convertirNumeroALetras } from '../../../../shared/functions/GenerarTextoEnLetras'
import { limpiarCadena } from '../../../../shared/functions/QuitarAcerntos'
import { SubirArchivo } from '../../hosting/components/SubirArchivo'

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
  empresa: string
  plan: string
  id_contrato: string
  dni_ruc: string
  id_cliente: string
  nombres: string
  arraycontacto: string
  celular: string
  email: string
}

interface valuesInterface {
  open: boolean
  datos: valuesVentasTO
  setOpen: Dispatch<SetStateAction<boolean>>
  getClientes: () => Promise<void>
  usuarios: never[]
}

export const ModalObsequios = ({
  open,
  datos,
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
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const [loadingValidacion] = useState(false)
  const [loading, setLoading] = useState(false)
  const [openArchivo, setOpenArchivo] = useState(false)
  const [contenido, setContenido] = useState('')
  const [openAdicional, setOpenAdicional] = useState(false)
  const { auth } = useAuth()
  const [correos, setCorreos] = useState<arrayCorreos[]>([])
  const [arrayContacto, setarrayConacto] = useState<arrayContacto[]>([])
  const [openContacto, setopenContacto] = useState<boolean>(false)
  const [archivosSubido, setArchivosSubido] = useState<any | null>(null)
  const [arrayPesos, setarrayPesos] = useState<arrayAsignacion[]>([
    { id: null, peso: '' }
  ])
  const [arrayAdicionales, setArrayAdicionales] = useState<
  arrayAdicionales[] | null
  >(null)

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

  function obtenerDigitosAntesDeGuionBajo (cadena: string): string {
    const posicionGuionBajo = cadena.indexOf('_')
    if (posicionGuionBajo !== -1) {
      return cadena.substring(0, posicionGuionBajo)
    } else {
      return ''
    }
  }

  const guardarAvance = async (): Promise<void> => {
    // @ts-expect-error
    if (correos.length > 0 && arrayAdicionales?.length > 0) {
      //   setLoading(true)
      const idUnico = uuidv4()
      const data = new FormData()
      data.append('titulo', values.asunto)
      data.append('nombres', values.nombre_cliente)
      data.append('contexto', contenido)
      data.append('email', auth.email)
      data.append('email_alter', auth.email_alter)
      data.append('correos', JSON.stringify(correos))
      data.append('password', auth.pass_email)
      data.append('firma', auth.firma)
      data.append('obsequio', 'hola')
      data.append('archivosSubido', archivosSubido)
      data.append('images3', archivosSubido)

      const { fecha, hora } = obtenerFechaHora()
      const avance = {
        fecha,
        hora,
        asunto: values.asunto,
        imagenes: [],
        archivos: [],
        correos,
        contexto: contenido,
        firma: auth.firma,
        razon: values.razon,
        precio: values.precio
      }

      // COMPROBANTE
      data.append('nombres', `${datos?.nombres}`)
      data.append('dni', `${datos?.dni_ruc}`)
      data.append('email', `${datos?.email}`)
      data.append('fecha_inicio', values.fecha_inicio)
      data.append('pendiente_antes', '0')
      data.append('pendiente_antes_letras', '')
      data.append('precio', `${Number(values?.precio).toFixed(2)}`)
      if (values.factura == 'Con factura') {
        const igv = Number(values?.precio) * 0.18
        data.append(
          'precio_letras',
          `${convertirNumeroALetras(
            Number(values?.precio) + igv
          ).toLowerCase()}`
        )
      } else {
        data.append(
          'precio_letras',
          `${convertirNumeroALetras(Number(values?.precio)).toLowerCase()}`
        )
      }

      data.append('correlativo', datos?.id_contrato ?? '')
      data.append('title', limpiarCadena(datos?.id_contrato ?? ''))
      data.append(
        'contrato',
        obtenerDigitosAntesDeGuionBajo(datos?.id_contrato ?? '')
      )

      let preciofinal = 0
      let igvfinal = 0
      if (values.factura == 'Con factura') {
        igvfinal = Number(values?.precio) * 0.18
      } else {
        igvfinal = 0
      }
      preciofinal = Number(values?.precio) + igvfinal
      preciofinal = Number(preciofinal.toFixed(2))

      if (Number(preciofinal) - Number(values.montoCobrado) > 0) {
        data.append(
          'pendiente',
          (Number(preciofinal) - Number(values.montoCobrado)).toFixed(2)
        )
        // ts-ignore
        data.append(
          'pendiente_letras',
          `${convertirNumeroALetras(
            Number(preciofinal) - Number(values.montoCobrado)
          ).toLocaleLowerCase()}`
        )
      } else {
        // @ts-expect-error
        data.append('pendiente', 0)
      }

      const comprobante = {
        id: uuidv4(),
        montoCobrado: Number(values.montoCobrado ?? 0).toFixed(2),
        banco: values.banco,
        factura: values.factura,
        precio: Number(values?.precio).toFixed(2),
        archivo_factura:
          archivosSubido && archivosSubido.name
            ? `${idUnico}_${archivosSubido.name}`
            : '',
        pdf: `${idUnico}_COMPROBANTE DE PAGO - ${datos?.nombres}.pdf`,
        pendiente: (Number(preciofinal) - Number(values.montoCobrado)).toFixed(
          2
        ),
        arrayAdicionales,
        arrayPesos,
        fecha: `${fecha}, ${hora}`
      }

      const comprobante2 = {
        id: uuidv4(),
        montoCobrado: 0,
        banco: '',
        factura: '',
        precio: 0,
        archivo_factura: '',
        pdf: '',
        pendiente: '',
        tipo: 'sin costo',
        arrayAdicionales,
        arrayPesos,
        fecha: `${fecha}, ${hora}`
      }

      data.append('idUnico', idUnico)
      data.append('comprobanteadicional', JSON.stringify([comprobante]))
      data.append('comprobanteadicionalgratis', JSON.stringify([comprobante2]))
      data.append('asignacion', JSON.stringify(arrayPesos))
      data.append('adicionales', JSON.stringify(arrayAdicionales))
      data.append('banco', values.banco)
      data.append('factura', values.factura)
      data.append('montoCobrado', Number(values.montoCobrado ?? 0).toFixed(2))
      data.append(
        'montoCobrado_letra',
        convertirNumeroALetras(Number(values.montoCobrado)).toLocaleLowerCase()
      )
      if (values.factura == 'Sin factura') {
        data.append(
          'estado',
          `${values.banco ? `${values.banco}` : ''}/sf/${
            Number(values.montoCobrado) >= Number(preciofinal) ? 'ok' : 'sp'
          }`.toLocaleUpperCase()
        )
      } else if (values.factura == 'Con factura') {
        data.append(
          'estado',
          `${values.banco ? `${values.banco}` : ''}/cf/${
            Number(values.montoCobrado) >= Number(preciofinal) ? 'ok' : 'sp'
          }`.toLocaleUpperCase()
        )
      }

      try {
        if (values.tipo == 'Con costo') {
          const respuesta = await axios.post(
            `${Global.url}/enviarAvancesObsequio/${id}`,
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
            data.append('_method', 'PUT')
            try {
              const respuesta = await axios.post(
                  `${Global.url}/subirAvances/${id ?? ''}`,
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
                toast.success('Se subio el alta correctamente')
                const enviarNotificacion = async (): Promise<void> => {
                  const data = new FormData()
                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                  const pathName = `/admin/lista-servicios/avances/${id ?? ''}`
                  data.append('id_usuario', auth.id)
                  data.append('id_venta', String(id))
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
                setCorreos([])
                resetForm()
                getClientes()
                setOpen(false)
              } else {
                toast.error('Error')
              }
            } catch (error: unknown) {
              console.log(error)
              Swal.fire('Error', '', 'error')
            }
          } else {
            Swal.fire('Error al registrar', '', 'error')
          }
        } else {
          const respuesta = await axios.post(
            `${Global.url}/enviarAvancesObsequio2/${id}`,
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
            data.append('_method', 'PUT')
            try {
              const respuesta = await axios.post(
                `${Global.url}/subirAvances/${id ?? ''}`,
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
                toast.success('Se subio el alta correctamente')
                const enviarNotificacion = async (): Promise<void> => {
                  const data = new FormData()
                  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                  const pathName = `/admin/lista-servicios/avances/${id ?? ''}`
                  data.append('id_usuario', auth.id)
                  data.append('id_venta', String(id))
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
                setCorreos([])
                resetForm()
                getClientes()
                setOpen(false)
              } else {
                toast.error('Error')
              }
            } catch (error: unknown) {
              console.log(error)
              Swal.fire('Error', '', 'error')
            }
          } else {
            Swal.fire('Error al registrar', '', 'error')
          }
        }
      } catch (error: unknown) {
        console.log(error)
        toast.error('Error')
      } finally {
        setArchivosSubido(null)
        setLoading(false)
      }
    } else {
      toast.warning('Complete todos los datos')
    }
  }

  const agregarArrayPesos = (elemento: string): void => {
    let encontrado = false
    const id = uuidv4()
    // Inicializar arrayAdicionales como un array vacío si es undefined
    const nuevosAdicionales = arrayAdicionales ? [...arrayAdicionales] : []
    // Iterar sobre nuevosAdicionales para buscar el elemento
    nuevosAdicionales.forEach((item: any) => {
      if (item.elemento === elemento) {
        encontrado = true
        // Si el elemento ya existe, incrementar su contador
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        item.cantidad += 1
      }
    })
    // Si el elemento no fue encontrado, agregarlo con contador 1
    if (!encontrado) {
      nuevosAdicionales.push({ id, elemento, cantidad: 1 })
    }
    setArrayAdicionales(nuevosAdicionales)
  }

  const {
    handleSubmit,
    handleChange,
    setValues,
    errors,
    values,
    resetForm,
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
      email: '',
      razon: '',
      precio: '',
      tipo: '',
      banco: '',
      factura: '',
      montoCobrado: ''
    },
    validationSchema: SchemaValidarObsequio,
    onSubmit: guardarAvance
  })

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
        nombre_empresa: datos.empresa,
        plan: datos.plan,
        id_contrato: datos.id_contrato,
        dni_ruc: datos.dni_ruc,
        nombre_cliente: datos.nombres,
        id_cliente: datos.id_cliente,
        celular: datos?.celular,
        email: datos.email,
        fecha_inicio: generarFecha()
      })
      setarrayConacto(
        datos.arraycontacto ? JSON.parse(datos.arraycontacto) : []
      )
      const correoPredeterminado = datos?.email
      if (!correos.some((c: any) => c.correo == correoPredeterminado)) {
        setCorreos([
          ...correos,
          { id: uuidv4(), correo: correoPredeterminado }
        ])
      }
    }
  }, [open])

  useEffect(() => {
    if (open) {
      let nombresColaboradores = ''
      let preciofinal = 0
      let igvfinal = 0
      if (values.factura == 'Con factura') {
        igvfinal = Number(values?.precio) * 0.18
      } else {
        igvfinal = 0
      }
      preciofinal = Number(values?.precio) + igvfinal
      preciofinal = Number(preciofinal.toFixed(2))

      nombresColaboradores = arrayPesos
        .filter((item: any) => item.nombre) // Filtrar los elementos que tienen un nombre definido
        .map(
          (item: any) =>
            `${item.genero === 'mujer' ? 'Srta.' : ''} ${item.nombre}`
        )
        .join(' – ')
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands, @typescript-eslint/restrict-template-expressions
      const textoadcional = `<p>Estimados Colaboradores </p><p>&nbsp;</p><p>Le damos la Bienvenida al cliente :&nbsp;<span style="background-color: rgb(249, 250, 251);"> ${
        datos.empresa
      }</span></p><p>&nbsp;</p><ul><li>Persona de contacto : Sr. ${
        values?.nombre_cliente
      } </li><li>Mail&nbsp;: ${values.email ?? ''} </li><li>Móvil&nbsp;: ${
        values.celular ?? ''
      } </li></ul></p><p>&nbsp;</p>`
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      const textofinal = `<p>&nbsp;</p><p>${datos?.id_contrato ?? ''}${
        values.banco ? `/${values.banco}` : ''
      }//${
        values.factura == 'Con factura'
          ? 'cf'
          : values.factura == 'Sin factura'
          ? 'sf'
          : ' '
      }/${
        Number(values.montoCobrado) >= Number(preciofinal) ? 'ok' : 'sp'
      } &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;M1 – ${returnIngreso(
        datos?.medio_ingreso ?? ''
      )} </p><p>&nbsp;</p><p>COLABORADORES A CARGO: <p></p> ${nombresColaboradores}</p><p>&nbsp;</p><p>&nbsp;</p><p>FECHA DE INICIO DEL SERVICIO:&nbsp;${
        values.fecha_inicio ?? ''
      }</p><p>&nbsp;</p><p>&nbsp;</p><p>SALUDOS.&nbsp;</p>`
      // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
      const contenidoConTextoAdicional = textoadcional + '' + textofinal
      setContenido(contenidoConTextoAdicional)
    }
  }, [
    values.fecha_inicio,
    arrayPesos,
    values.factura,
    values.montoCobrado,
    values.banco
  ])

  useEffect(() => {
    if (errors && isSubmitting) {
      const firstErrorKey = Object.keys(errors)[0]
      const firstErrorElement = document.getElementsByName(firstErrorKey)[0]
      if (firstErrorElement) {
        firstErrorElement.focus()
      }
    }
  }, [touched, errors, isSubmitting])

  const eliminarArray = (id: number | null): void => {
    const usuarioEliminado = arrayAdicionales?.find((peso) => peso.id === id)
    if (!usuarioEliminado) return // Salir si no se encuentra el usuario
    const nuevoArrayPesos = arrayAdicionales?.filter((peso) => peso.id !== id)
    // @ts-expect-error
    setArrayAdicionales(nuevoArrayPesos)
  }

  useEffect(() => {
    const ul = document.createElement('ul') // Crear un elemento ul
    // Iterar sobre arrayAdicionales y crear un li para cada elemento
    arrayAdicionales?.forEach((item: any) => {
      const li = document.createElement('li') // Crear un elemento li
      if (item.elemento === 'Impresión de tarjeta de presentación') {
        // Generar el HTML específico para 'Impresión de tarjeta de presentación'
        li.innerHTML = `
          <p>IMPRESIÓN DE TARJETA DE PRESENTACIÓN:</p>
          <p>Descripción:</p>
          <p>1 millar x 1 nombre.&nbsp;</p>
          <p>Tamaño: 9 x 5.5 cm.</p>
          <p>Material: Papel couché de 250gr. Mate o brillante (a elección del cliente).</p>
          <p>Envío Lima: Gratis&nbsp;&nbsp;</p>
          <p>Envío Provincia: Servicio de COLLECT</p>
        `
      } else {
        const cantidadFormateada = item.cantidad.toString().padStart(2, '0')
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        li.textContent = `${cantidadFormateada} ${item.elemento}`
      }
      ul.appendChild(li) // Agregar el li al ul
    })
    // Obtener el HTML del ul y establecerlo como contenido
    const adicionalesArray = ul.outerHTML
    const nombresColaboradores = arrayPesos
      .filter((item: any) => item.nombre) // Filtrar los elementos que tienen un nombre definido
      .map(
        (item: any) =>
          `${item.genero === 'mujer' ? 'Srta.' : ''} ${item.nombre}`
      )
      .join(' – ')
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands, @typescript-eslint/restrict-template-expressions
    const textoadcional = `<p>Estimados Colaboradores </p><p>&nbsp;</p><p>Le damos la Bienvenida al cliente :&nbsp;<span style="background-color: rgb(249, 250, 251);"> ${
      datos.empresa
    }</span></p><p>&nbsp;</p><ul><li>Persona de contacto : Sr. ${
      values?.nombre_cliente
    } </li><li>Mail&nbsp;: ${values.email ?? ''} </li><li>Móvil&nbsp;: ${
      values.celular ?? ''
    } </li></ul></p><p>&nbsp;</p>`
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const textofinal = `<p>&nbsp;</p><p>${
      values?.id_contrato ?? ''
    }/&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;M1 – ${returnIngreso(
      values.medio_ingreso ?? ''
    )} </p><p>&nbsp;</p><p>COLABORADORES A CARGO: ${nombresColaboradores}</p><p>&nbsp;</p><p>FECHA DE INICIO DEL SERVICIO:&nbsp;${
      values.fecha_inicio ?? ''
    }</p><p>&nbsp;</p><p>&nbsp;</p><p>SALUDOS.&nbsp;</p>`
    // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
    const contenidoConTextoAdicional =
      textoadcional + adicionalesArray + textofinal
    setContenido(contenidoConTextoAdicional)
  }, [arrayAdicionales])

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
        <DialogContentText id="alert-dialog-slide-description">
          {loadingValidacion ? (
            <LoadingSmall />
          ) : (
            <form
              className="flex flex-col w-[600px]  bg-white rounded-md relative p-4     "
              onSubmit={handleSubmit}
            >
              <div className="flex w-full flex-col">
                <div className="w-full flex flex-col text-white">
                  <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-end gap-2 lg:gap-x-5 lg:gap-y-0">
                    <div className="w-full flex flex-col lg:flex-row gap-3 lg:gap-5 mt-3 lg:mt-0">
                      <div className="w-full lg:relative pb-5">
                        <select
                          name="tipo"
                          value={values.tipo}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                        >
                          <option value="">Seleccionar tipo de correo</option>
                          <option value="Obsequio">Obsequio</option>
                          <option value="Con costo">Con costo</option>
                        </select>
                        <Errors errors={errors.tipo} touched={touched.tipo} />
                      </div>
                    </div>
                    <div className="w-full flex flex-col lg:flex-row gap-3 lg:gap-5 mt-3 lg:mt-0">
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
                    <div className="w-full flex flex-col lg:flex-row gap-3 lg:gap-5 mt-3 lg:mt-0">
                      {values.tipo == 'Obsequio' ? (
                        <div className="w-full lg:relative pb-5">
                          <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="email"
                          >
                            Razon de obsequio
                          </label>
                          <input
                            className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                            name="razon"
                            value={values.razon}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={false}
                          />
                          <Errors
                            errors={errors.razon}
                            touched={touched.razon}
                          />
                        </div>
                      ) : (
                        values.tipo == 'Con costo' && (
                          <>
                            <div className="w-full lg:relative pb-5">
                              <label
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                htmlFor="email"
                              >
                                Precio
                              </label>
                              <input
                                className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                                name="precio"
                                type="number"
                                value={values.precio}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={false}
                              />
                              <Errors
                                errors={errors.precio}
                                touched={touched.precio}
                              />
                            </div>

                            <div className="w-full lg:relative pb-5">
                              <label
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                                htmlFor="email"
                              >
                                Monto cobrado
                              </label>
                              <input
                                className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                                name="montoCobrado"
                                value={values?.montoCobrado}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={false}
                              />
                              <Errors
                                errors={errors.montoCobrado}
                                touched={touched.montoCobrado}
                              />
                            </div>
                          </>
                        )
                      )}
                    </div>
                    {values.tipo == 'Con costo' && (
                      <div className="w-full flex flex-col lg:flex-row gap-3 lg:gap-5 mt-3 lg:mt-0">
                        <div className="w-full lg:relative pb-5">
                          <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="email"
                          >
                            Entidad bancaria
                          </label>
                          <select
                            className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                            name="banco"
                            value={values?.banco}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={false}
                          >
                            <option value="">Seleccionar</option>
                            <option value="BCP">BCP</option>
                            <option value="BBVA">BBVA</option>
                            <option value="YAPE">YAPE</option>
                            <option value="PLIN">PLIN</option>
                            <option value="XOOM">XOOM</option>
                            <option value="MONEY GRAM">MONEY GRAM</option>
                            <option value="WESTER UNION">WESTER UNION</option>
                            <option value="PLIN">PLIN</option>
                            <option value="TARJETA DE CREDITO">
                              TARJETA DE CREDITO
                            </option>
                            <option value="MERCADO PAGO">MERCADO PAGO</option>
                            <option value="OTROS">OTROS</option>
                          </select>
                          <Errors
                            errors={errors.banco}
                            touched={touched.banco}
                          />
                        </div>
                        <div className="w-full lg:relative pb-5">
                          <label
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="email"
                          >
                            Comprobante
                          </label>
                          <select
                            className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                            name="factura"
                            value={values?.factura}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            disabled={false}
                          >
                            <option value="">Seleccionar</option>
                            <option value="Con factura">Con factura</option>
                            <option value="Sin factura">Sin factura</option>
                          </select>
                          <Errors
                            errors={errors.factura}
                            touched={touched.factura}
                          />
                        </div>
                      </div>
                    )}
                    {values.tipo == 'Con costo' && (
                      <div className='w-full flex justify-center mb-4'>
                        {!archivosSubido ? (
                          <button
                            className="mt-3 border-b-2 border-blue-500 hover:text-blue-500 transition-colors"
                            type="button"
                            onClick={() => {
                              setOpenArchivo(true)
                            }}
                          >
                            CARGAR DOCUMENTO
                          </button>
                        ) : (
                          <span className="mt-1 flex gap-1 items-center">
                            {archivosSubido?.name}{' '}
                            <span
                              className="text-red-500 text-2xl cursor-pointer font-bold"
                              onClick={() => {
                                setArchivosSubido(null)
                              }}
                            >
                              x
                            </span>{' '}
                          </span>
                        )}
                      </div>
                    )}

                    <ListaUsuarios
                      arrayPesos={arrayPesos}
                      usuarios={usuarios}
                      setarrayPesos={setarrayPesos}
                      setCorreos={setCorreos}
                      correos={correos}
                    />
                    <div className="w-full relative mt-3">
                      <div className="flex justify-between items-center">
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="email"
                        >
                          Detalle del obsequio
                        </label>
                        <button
                          type="button"
                          onClick={() => {
                            setOpenAdicional(true)
                          }}
                          className="bg-red-600 px-2 py-1 rounded-md text-white hover:bg-red-700 transition-colors text-sm"
                        >
                          Adicionales
                        </button>
                      </div>
                      {
                        // @ts-expect-error
                        arrayAdicionales?.length > 0 && (
                          <div className="flex flex-row flex-wrap gap-3 justify-center mt-2">
                            {arrayAdicionales?.map((elemento) => (
                              <Chip
                                key={elemento.id}
                                label={`${elemento.cantidad} ${elemento.elemento}`}
                                variant="outlined"
                                // onClick={handleClick}
                                onDelete={() => {
                                  eliminarArray(elemento.id)
                                }}
                              />
                            ))}
                          </div>
                        )
                      }
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
                  {!loading ? (
                    <input
                      type="submit"
                      className="bg-secondary-150 hover:bg-secondary-150/70 transition-colors px-3 py-2 text-white rounded-md cursor-pointer"
                      value="Generar alta"
                    />
                  ) : (
                    <input
                      type="button"
                      disabled
                      className="bg-secondary-150/70 px-3 py-2 text-white rounded-md cursor-pointer"
                      value="Cargando..."
                    />
                  )}
                </div>
              </div>
              {openAdicional && (
                <div className="w-[70%] h-full overflow-y-auto bg-white p-2 absolute right-0 top-0 bottom-0 shadow-md border rounded-md border-gray-300 z-10">
                  <IoCloseCircleOutline
                    className="absolute top-2 right-2 text-2xl cursor-pointer"
                    onClick={() => {
                      setOpenAdicional(false)
                    }}
                  />
                  <h2 className="text-center w-full uppercase font-bold">
                    Adicionales
                  </h2>
                  <div className="flex flex-col gap-1 mt-3">
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Animación de Logo(s)')
                      }}
                    >
                      Animación de Logo
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Animación de Personaje(s)')
                      }}
                    >
                      Animación de Personaje
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos(
                          'Asesoria en creación de Redes Sociales'
                        )
                      }}
                    >
                      Asesoria en creación de Redes Sociales
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Administracion de dominio .com')
                      }}
                    >
                      Administracion de dominio .com
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Administracion de dominio .pe')
                      }}
                    >
                      Administracion de dominio .pe
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Actualizacion de logo')
                      }}
                    >
                      Actualizacion de logo
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Capacitación de Tiktok Ads - 45 minutos')
                      }}
                    >
                      Capacitación de Tiktok Ads - 45 minutos
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos(
                          'Capacitación facebook ads (plan basico)'
                        )
                      }}
                    >
                      Capacitación facebook ads (plan basico)
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos(
                          'Capacitación facebook ads (plan intermedio)'
                        )
                      }}
                    >
                      Capacitación facebook ads (plan intermedio)
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos(
                          'Capacitación facebook ads (plan full)'
                        )
                      }}
                    >
                      Capacitación facebook ads (plan full)
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos(
                          'Capacitación google ads (plan basico)'
                        )
                      }}
                    >
                      Capacitación google ads (plan basico)
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos(
                          'Capacitación google ads (plan intermedio)'
                        )
                      }}
                    >
                      Capacitación google ads (plan intermedio)
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos(
                          'Capacitación google ads (plan full)'
                        )
                      }}
                    >
                      Capacitación google ads (plan full)
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos(
                          'Capacitación en redes Sociales (plan basico)'
                        )
                      }}
                    >
                      Capacitación en redes Sociales (plan basico)
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos(
                          'Capacitación en redes Sociales (plan avanzado)'
                        )
                      }}
                    >
                      Capacitación en redes Sociales (plan avanzado)
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Creacion de Reel 10s')
                      }}
                    >
                      Creacion de Reel 10s
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Creacion de Reel 20s')
                      }}
                    >
                      Creacion de Reel 20s
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Creacion de Reel 30s')
                      }}
                    >
                      Creacion de Reel 30s
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos(
                          'Desarrollo de Manual de Marca(s) Cobre'
                        )
                      }}
                    >
                      Desarrollo de Manual de Marca Cobre
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos(
                          'Desarrollo de Manual de Marca(s) Silver'
                        )
                      }}
                    >
                      Desarrollo de Manual de Marca Silver
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Diseño de pieza(s) grafica(s)')
                      }}
                    >
                      Diseño de pieza grafica
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Diseño de gorra(s)')
                      }}
                    >
                      Diseño de gorra
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Diseño de logo 1 propuesta')
                      }}
                    >
                      Diseño de logo 1 propuesta
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Diseño de logo 2 propuestas')
                      }}
                    >
                      Diseño de logo 2 propuestas
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Diseño de Firma(s) de correo(s)')
                      }}
                    >
                      Diseño de Firma de correo
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Diseño de Packing(s)')
                      }}
                    >
                      Diseño de Packing
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Diseño de Portada(s)')
                      }}
                    >
                      Diseño de Portada
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Diseño de Perfil(es)')
                      }}
                    >
                      Diseño de Perfil
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos(
                          'Diseño de Tarjeta(s) de presentación'
                        )
                      }}
                    >
                      Diseño de Tarjeta de presentación
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Diseño de Hoja(s) membretada(s)')
                      }}
                    >
                      Diseño de Hoja membretada
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Diseño de Flyer(s)')
                      }}
                    >
                      Diseño de Flyer
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Diseño de Brochure 04 caras')
                      }}
                    >
                      Diseño de Brochure 04 caras
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Diseño de Brochure 06 caras')
                      }}
                    >
                      Diseño de Brochure 06 caras
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Diseño de Brochure 08 caras')
                      }}
                    >
                      Diseño de Brochure 08 caras
                    </p>
                    <p
                  className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                  onClick={() => {
                    agregarArrayPesos('Diseño de Catalogo 04 caras')
                  }}
                >
                  Diseño de Catalogo 04 caras
                </p>
                <p
                  className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                  onClick={() => {
                    agregarArrayPesos('Diseño de Catalogo 06 caras')
                  }}
                >
                  Diseño de Catalogo 06 caras
                </p>
                <p
                  className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                  onClick={() => {
                    agregarArrayPesos('Diseño de Catalogo 08 caras')
                  }}
                >
                  Diseño de Catalogo 08 caras
                </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos(
                          'Diseño de Fotocheck(s) o uniforme(s)'
                        )
                      }}
                    >
                      Diseño de Fotocheck o uniforme
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Diseño de Etiqueta(s)')
                      }}
                    >
                      Diseño de Etiqueta
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Diseño de Montaje(s)')
                      }}
                    >
                      Diseño de Montaje
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Diseño de Personaje(s)')
                      }}
                    >
                      Diseño de Personaje
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Diseño de Letrero(s)')
                      }}
                    >
                      Diseño de Letrero
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Diseño de Sticker(s)')
                      }}
                    >
                      Diseño de sticker
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Diseño de Banner(s)')
                      }}
                    >
                      Diseño de Banner
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Diseño de Volante(s)')
                      }}
                    >
                      Diseño de Volante
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Diseño de Sobre(s)')
                      }}
                    >
                      Diseño de Sobre
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Diseño de Folder(s)')
                      }}
                    >
                      Diseño de Folder
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Diseño de Bolsa(s)')
                      }}
                    >
                      Diseño de Bolsa
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Diseño de Calendario(s)')
                      }}
                    >
                      Diseño de Calendario
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos(
                          'Desarrollo de interna web Informativa'
                        )
                      }}
                    >
                      Desarrollo de interna web Informativa
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos(
                          'Desarrollo de interna web Administrable'
                        )
                      }}
                    >
                      Desarrollo de interna web Administrable
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Fotográfico retoque')
                      }}
                    >
                      Fotográfico retoque
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Fotográfico sesión')
                      }}
                    >
                      Fotográfico sesión
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos(
                          'Mantenimiento o actualización web (Textos, Imagenes, Google maps , teléfono y dirección)'
                        )
                      }}
                    >
                      Mantenimiento o actualización web (Textos, Imagenes,
                      Google maps , teléfono y dirección)
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Reenvio de archivos finales')
                      }}
                    >
                      Reenvio de archivos finales
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Revisión de servicios de terceros')
                      }}
                    >
                      Revisión de servicios de terceros
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Plantillas de PPT')
                      }}
                    >
                      Plantillas de PPT
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos(
                          'Servicio de Impresión - Diversos (terceros)'
                        )
                      }}
                    >
                      Servicio de Impresión - Diversos (terceros)
                    </p>
                    <p
                      className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
                      onClick={() => {
                        agregarArrayPesos('Vectorización de logo(s)')
                      }}
                    >
                      Vectorización de logo
                    </p>
                  </div>
                </div>
              )}
            </form>
          )}
        </DialogContentText>
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
        <SubirArchivo
          open={openArchivo}
          setOpen={setOpenArchivo}
          setArchivosSubido={setArchivosSubido}
          archivosSubido={archivosSubido}
        />
      </div>
    </>
  )
}
