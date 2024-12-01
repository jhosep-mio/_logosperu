/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable no-return-assign */
/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Link, useParams } from 'react-router-dom'
import { Errors } from '../../../../shared/Errors'
import { BiRename } from 'react-icons/bi'
import { MdOutlineStorage, MdSecurity } from 'react-icons/md'
import { AiOutlineCloudServer } from 'react-icons/ai'
import { useState } from 'react'
import { FaRegEdit } from 'react-icons/fa'
import { ModalHosting } from './modals/ModalHosting'
import { cn } from '../../../../shared/cn'
import { format, getYear, parseISO, subDays } from 'date-fns'
import { IoAddCircle, IoCloseCircle } from 'react-icons/io5'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import { toast } from 'sonner'
import { Loading } from '../../../../shared/Loading'
import { IoLogoWhatsapp } from 'react-icons/io'
import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import 'swiper/css/pagination'
// import required modules
import { Pagination } from 'swiper/modules'
import { BsFillGiftFill } from 'react-icons/bs'
import { ModalObsequios } from '../../hosting/seguimiento/ModalObsequios'
import { SwiperAvances } from '../../hosting/seguimiento/SwiperAvances'
import { ModalRegistroAvanves } from '../../hosting/components/ModalRegistroAvanves'
import { ModalViewComprobantes } from '../../hosting/seguimiento/ModalViewComprobantes'
import { SubirArchivo } from '../../hosting/components/SubirArchivo'
import { v4 as uuidv4 } from 'uuid'
import { convertirNumeroALetras } from '../../../../shared/functions/GenerarTextoEnLetras'
import { SoporteHosting } from './modals/SoporteHosting'
import { ModalViewSoporteHosting } from './modals/ModalViewSoporteHosting'

export const PlanHosting = ({
  setOpenAntecedemte,
  antecedentes,
  arrayAvances,
  setAvance,
  arrayObsequios,
  handleSubmit,
  hosting,
  values,
  datos,
  handleBlur,
  handleChange,
  errors,
  touched,
  getDatos,
  setHosting,
  hostingactivo,
  idVenta,
  colaboradores,
  datos2,
  setOpenAvance,
  producto,
  usuarios,
  venta
}: {
  producto: any
  arrayAvances: any
  setOpenAvance: any
  setAvance: any
  arrayObsequios: any
  setOpenAntecedemte: any
  antecedentes: any
  handleSubmit: any
  hosting: any
  values: any
  datos: any
  handleBlur: any
  handleChange: any
  errors: any
  touched: any
  getDatos: any
  setHosting: any
  hostingactivo: any
  idVenta: any
  colaboradores: any
  datos2: any
  usuarios: any
  venta: any
}): JSX.Element => {
  const { id } = useParams()
  const [openEdit, setOpenEdit] = useState(false)
  const [addFecha, setAdFecha] = useState(false)
  const today = new Date().toISOString().slice(0, 10)
  const [nuevaFecha, setNuevaFecha] = useState<string>(today)
  const [nuevoPrecio, setNuevoPrecio] = useState('')
  const [montoPrecio, setMontoprecio] = useState('')
  const [factura, setFactura] = useState('')
  const [banco, setBanco] = useState('')
  const [archivosSubido, setArchivosSubido] = useState<any | null>(null)
  const [openComprobantes, setOpenComprobantes] = useState(false)
  const [comprobantes, setComprobantes] = useState<any | null>(null)
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(false)
  const [openObsequio, setOpenObsequio] = useState(false)
  const [openAvanceModal, setOpenAvanceModal] = useState(false)
  const [openArchivo, setOpenArchivo] = useState(false)
  const [openVista, setOpenVista] = useState({ estado: false, datos: null })

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

  const updateHosting = async (
    updatedEvents: any,
    nuevoPrecio: any,
    idUnico: any
  ): Promise<void> => {
    // setLoading(true)
    const data = new FormData()
    const { fecha, hora } = obtenerFechaHora()
    const fechaActual = new Date()
    const fechaFormateada = format(fechaActual, 'dd/MM/yyyy', {
      // @ts-expect-error
      timeZone: 'America/Lima'
    })

    const avance = {
      idUnico,
      fecha,
      hora,
      asunto: `Renovación de ${updatedEvents?.tiposervicio ?? ''}`,
      empresa: updatedEvents?.marca ?? '',
      contacto: `${updatedEvents?.nombres} ${updatedEvents?.apellidos}`,
      motivo: `Renovación de ${updatedEvents?.tiposervicio ?? ''}`,
      fechaacta: fechaFormateada,
      imagenes: [],
      archivos: archivosSubido,
      correos: [{ id: Date.now(), correo: updatedEvents?.email ?? '' }],
      contexto: `<div style=\"font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;\">
      <p>Buenas tardes Estimado(a) ${updatedEvents.nombres} ${updatedEvents.apellidos},</p>
      <p>Es un placer para nosotros comunicarnos contigo para expresar nuestro sincero agradecimiento por haber renovado tu servicio de Alquiler de hosting con Logos Perú. Valoramos profundamente tu confianza en nuestros servicios y nos comprometemos a seguir brindándote el mejor soporte y calidad en cada aspecto de tu experiencia con nosotros.</p>
      <p>Recuerda que estamos aquí para cualquier consulta, solicitud o soporte técnico que requieras. No dudes en contactarnos ante cualquier inquietud o sugerencia.</p>
      <p>Una vez más, ¡gracias por elegirnos como tu proveedor de servicios de Alquiler de hosting!</p>
      <p>¡Saludos cordiales!</p>
  </div>`,
      conclusion: '',
      firma: 'firma_agencia.jpg'
    }
    data.append('idUnico', idUnico)
    data.append('hosting', JSON.stringify(updatedEvents))
    data.append('contrato', producto.correlativo)
    data.append(
      'nombres',
      `${updatedEvents.nombres} ${updatedEvents.apellidos}`
    )
    data.append('email', updatedEvents.email)
    let preciofinal = 0
    let igvfinal = 0
    if (factura == 'Con factura') {
      igvfinal = Number(nuevoPrecio) * 0.18
    } else {
      igvfinal = 0
    }
    preciofinal = Number(nuevoPrecio) + igvfinal
    preciofinal = Number(preciofinal.toFixed(2))

    data.append('precio', Number(nuevoPrecio).toFixed(2))
    data.append('montoCobrado', Number(montoPrecio).toFixed(2))
    data.append('correlativo', producto.correlativo)
    data.append('dni', updatedEvents.celular)
    data.append('nombre_plan', updatedEvents.tiposervicio)
    data.append(
      'title',
      `${updatedEvents.nombres.toUpperCase()} ${updatedEvents.apellidos.toUpperCase()}`
    )
    data.append('fecha_inicio', fecha)

    if (factura == 'Sin factura') {
      data.append(
        'estado',
        `${banco ? `${banco}` : ''}/sf/${
          Number(montoPrecio) >= Number(preciofinal) ? 'ok' : 'sp'
        }`.toLocaleUpperCase()
      )
    } else if (factura == 'Con factura') {
      data.append(
        'estado',
        `${banco ? `${banco}` : ''}/cf/${
          Number(montoPrecio) >= Number(preciofinal) ? 'ok' : 'sp'
        }`.toLocaleUpperCase()
      )
    }

    data.append('factura', factura)
    data.append('adicionales', '')
    if (Number(preciofinal) - Number(montoPrecio) > 0) {
      data.append(
        'pendiente',
        (Number(preciofinal) - Number(montoPrecio)).toFixed(2)
      )
      // ts-ignore
      data.append(
        'pendiente_letras',
        `${convertirNumeroALetras(
          Number(preciofinal) - Number(montoPrecio)
        ).toLocaleLowerCase()}`
      )
    } else {
      // @ts-expect-error
      data.append('pendiente', 0)
    }
    data.append('pendiente_antes', '0')
    data.append('pendiente_antes_letras', '')
    data.append(
      'precio_letras',
      `${convertirNumeroALetras(preciofinal).toLowerCase()}`
    )
    data.append(
      'montoCobrado_letra',
      `${convertirNumeroALetras(Number(montoPrecio)).toLowerCase()}`
    )
    data.append('images2', archivosSubido)
    data.append('array_avances', JSON.stringify(avance))
    data.append('_method', 'PUT')

    try {
      const respuesta = await axios.post(
        `${Global.url}/updateHostingRenovación/${id ?? ''}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      await axios.post(`${Global.url}/subirAvanceHosting/${id ?? ''}`, data, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })

      if (respuesta.data.status == 'success') {
        toast.success('Datos actualizados')
        getDatos()
        setNuevoPrecio('')
        setNuevaFecha(today)
        setMontoprecio('')
        setFactura('')
        setBanco('')
        setAdFecha(false)
        setArchivosSubido(null)
      } else {
        toast.error('Error al actualizar')
      }
    } catch (error) {
      console.log(error)
      toast.error('Error al actualizar')
    } finally {
      setLoading(false)
    }
  }

  const updateHosting2 = async (updatedEvents: Event[]): Promise<void> => {
    setLoading(true)
    const data = new FormData()
    data.append('hosting', JSON.stringify(updatedEvents))
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/updateHostingDatos/${id ?? ''}`,
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
        toast.success('Datos actualizados')
        getDatos()
        setOpenEdit(false)
      } else {
        toast.error('Error al actualizar')
      }
    } catch (error) {
      console.log(error)
      toast.error('Error al actualizar')
    } finally {
      setLoading(false)
    }
  }

  const agregarFecha = async (): Promise<void> => {
    const idUnico = uuidv4()

    if (nuevaFecha && nuevoPrecio) {
      let preciofinal = 0
      let igvfinal = 0

      if (factura === 'Con factura') {
        igvfinal = Number(nuevoPrecio) * 0.18
      } else {
        igvfinal = 0
      }

      preciofinal = Number(nuevoPrecio) + igvfinal
      preciofinal = Number(preciofinal.toFixed(2))

      let pendiente = 0
      if (Number(preciofinal) - Number(montoPrecio) > 0) {
        pendiente = Number(
          (Number(preciofinal) - Number(montoPrecio)).toFixed(2)
        )
      }

      const newFechaEntry = {
        fecha: nuevaFecha,
        precio: nuevoPrecio,
        pendiente,
        archivo_factura:
          archivosSubido && archivosSubido.name
            ? `${idUnico}_${archivosSubido.name}`
            : '',
        comprobante: `${idUnico}_COMPROBANTE DE PAGO - ${hosting?.nombres} ${hosting?.apellidos}`,
        banco,
        factura,
        montoPrecio
      }

      const updatedHosting = {
        ...hosting,
        fechas: hosting?.fechas
          ? [...hosting.fechas, newFechaEntry]
          : [newFechaEntry]
      }
      //   setHosting(updatedHosting)
      setAdFecha(false)
      setNuevaFecha('')
      console.log(updatedHosting)
      updateHosting(updatedHosting, nuevoPrecio, idUnico)
    } else {
      toast.error('Error al agregar fecha o precio')
    }
  }

  const updateEstadoHosting = async (estado: number): Promise<void> => {
    setLoading(true)
    const data = new FormData()
    data.append('activehosting', JSON.stringify(estado))
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/updateEstadohosting/${id ?? ''}`,
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
        toast.success('Estado actualizado')
        getDatos()
        setOpenEdit(false)
      } else {
        toast.error('Error al actualizar')
      }
    } catch (error) {
      console.log(error)
      toast.error('Error al actualizar')
    } finally {
      setLoading(false)
    }
  }

  const eliminarFecha = (index: number): void => {
    const updatedHosting = { ...hosting }
    updatedHosting.fechas = hosting.fechas.filter(
      (_: any, idx: number) => idx !== index
    )
    setHosting(updatedHosting)
    updateHosting2(updatedHosting)
  }

  const exportarEventos = (): void => {
    const fechaVencimiento = hosting?.inicio // Supongamos que hosting?.inicio es '2021-05-07'
    const fechaFormateadaMenosUnDia = subDays(
      new Date(parseISO(fechaVencimiento)),
      1
    )
    // Formatea la fecha final restando un día
    const anoActual = getYear(new Date())
    const fechaFinal = format(fechaFormateadaMenosUnDia, `dd-MM-${anoActual}`)

    const mensajeWsp = `Buenas tardes estimado(a) *${hosting?.nombres ?? ''} ${
      hosting?.apellidos ?? ''
    }*

El motivo del presente correo es para informar que el pago anual de su ${
      hosting?.tiposervicio == 'Dominio'
        ? 'Administración de Dominio'
        : hosting?.tiposervicio == 'Hosting'
        ? 'Alquiler de hosting'
        : 'Administración de Dominio + Alquiler de hosting'
    } esta por llegar a la fecha límite  
    
*Servicio contratado:* ${
      hosting?.tiposervicio == 'Dominio'
        ? 'Administración de Dominio'
        : hosting?.tiposervicio == 'Hosting'
        ? 'Alquiler de hosting'
        : 'Administración de Dominio + Alquiler de hosting'
    }
*Dominio:* ${hosting?.dominio}

*Monto a pagar: S/ ${hosting?.montoC}*
*Los costos NO incluyen IGV*

*Fecha de vencimiento: ${fechaFinal}*


*Deposito a Cuenta*

    *TITULAR: Imágenes & Eventos CAFER SAC/ RUC: 20562927566*

    *BANCO BBVA*
        Soles: 0011 0319 0100014984
        Interbancaria: 01131900010001498417

*Deposito a Cuenta*

    *TITULAR: Paul Guillermo Chapilliquen Roque (Gerente General)*

    *Banco Crédito del Perú - BCP*
        Soles: 1918873501021
        Interbancaria: 00219100887350102152

    *BBVA: CUENTA FÁCIL*
        Soles: 0011 0319 0200175837
        Interbancaria: 011 319 000200175837 10

    *YAPE*: 987038024

    
PD : Pasada la fecha de RENOVACIÓN el servicio será interrumpido

Agradecemos su pronta respuesta.
    

Logos Perú
Equipo de Soporte de Hosting y Administración de dominios `

    const mensajeWspEncoded = encodeURIComponent(mensajeWsp)
    const numeroCelular = hosting.celular
    const urlWhatsApp = `https://api.whatsapp.com/send?phone=${numeroCelular}&text=${mensajeWspEncoded}`
    window.open(urlWhatsApp, '_blank')
  }

  const limiarCampos = (): void => {
    setNuevoPrecio('')
    setNuevaFecha(today)
    setAdFecha(false)
    setMontoprecio('')
    setFactura('')
    setBanco('')
    setArchivosSubido(null)
  }

  return (
    <form
      className={cn(
        'fixed inset-0 lg:w-[86%] lg:ml-[14%] h-full bg-white flex',
        openEdit ? 'flex gap-10 pr-4' : ''
      )}
      onSubmit={handleSubmit}
    >
      <div
        className={cn(
          'h-full transition-all duration-300 overflow-y-auto p-4 lg:p-8 ',
          openEdit ? 'w-full lg:w-[70%]' : 'w-full'
        )}
      >
        <section className="w-full flex flex-col lg:flex-row justify-between lg:items-center group">
          <div className="w-fit flex gap-2 lg:gap-4 items-center">
            <div className="w-full flex flex-col">
              <h2 className="font-bold text-2xl text-black">Hosting Web</h2>
              <span className="text-gray-500 lg:mt-3">
                Panel administrativo
              </span>
            </div>
            <FaRegEdit
              onClick={() => {
                setOpenEdit(!openEdit)
              }}
              className="text-main text-3xl hover:text-main_dark cursor-pointer group-hover:opacity-100 opacity-0 transition-all"
            />
          </div>
          <div className="flex items-center mt-4 lg:mt-0 justify-between">
            <Link
              to="/admin/hosting"
              className="px-3 py-[2px] bg-yellow-500 text-white rounded-md mr-4 lg:text-lg"
            >
              Regresar
            </Link>
            <div
              className="flex gap-3 bg-main px-3 py-1 mr-2 rounded-md cursor-pointer hover:bg-main_dark"
              onClick={() => {
                setOpenObsequio(!openObsequio)
              }}
            >
              <span className="text-white">Adicionales</span>
              <BsFillGiftFill className="text-2xl  rounded-lg text-white  transition-colors cursor-pointer" />
            </div>
            {hostingactivo == 1 ? (
              <p
                className="bg-green-600 text-white px-4 py-1 rounded-md lg:w-[300px] text-center hover:bg-green-800 transition-colors cursor-pointer"
                onClick={async () => {
                  await updateEstadoHosting(0)
                }}
              >
                Hosting activo
              </p>
            ) : (
              <p
                onClick={async () => {
                  await updateEstadoHosting(1)
                }}
                className="bg-red-600 text-white px-4 py-1 rounded-md w-[300px] text-center hover:bg-red-800 transition-colors cursor-pointer"
              >
                Hosting inactivo
              </p>
            )}
            <IoLogoWhatsapp
              onClick={() => {
                exportarEventos()
              }}
              className="text-green-600 text-3xl lg:text-5xl mr-4 cursor-pointer hover:scale-105 transition-all"
            />
          </div>
        </section>
        {hosting && !loading ? (
          <section className="w-full mt-6">
            {hosting?.fechas && (hosting?.fechas).length > 0 ? (
              <>
                {hosting?.fechas[hosting.fechas.length - 1].pendiente &&
                hosting?.fechas[hosting.fechas.length - 1].pendiente != 0 ? (
                  <p className="pb-2 flex justify-end text-black font-bold w-1/2 pr-16 text-lg">
                    Saldo pendiente:{' '}
                    <span className="text-red-500 ml-2">
                      {' '}
                      S/{hosting?.fechas[hosting.fechas.length - 1].pendiente}
                    </span>
                  </p>
                    ) : null}
              </>
            ) : null}
            <section
              className={cn(
                'grid w-full ',
                openEdit
                  ? 'grid-cols-1 gap-3'
                  : 'grid-cols-1 lg:grid-cols-2 gap-4 2xl:gap-20'
              )}
            >
              <div className="w-full shadow_hosting_grafico bg-white rounded-2xl p-3 lg:p-6 flex  flex-col  relative">
                {!addFecha ? (
                  <>
                    <IoAddCircle
                      className="absolute top-2 right-2 text-main text-2xl  transition-all cursor-pointer"
                      onClick={() => {
                        setAdFecha(!addFecha)
                      }}
                    />
                    <div className="flex justify-between text-[#3c70a6] w-full m-0 p-0">
                      <div className="font-bold text-base lg:text-xl uppercase">
                        PLAN {hosting.tiposervicio ?? ''}
                      </div>
                    </div>
                    <div className="lg:mx-auto w-full flex flex-row flex-1 space-x-3 space-y-3 md:space-y-0">
                      {hosting?.inicio && (
                        <div className="flex flex-col items-center space-y-2 md:justify-start gap-x-2 md:gap-x-0">
                          <div className="w-5 order-1 md:order-none mt-2 bg-gradient-to-t from-[#3c70a6] to-[#7aade3] cursor-pointer hover:w-6 transition-all h-32 rounded-full"></div>
                          <div className="text-black">
                            <h5 className="text-[11px] font-bold">
                              {format(hosting?.inicio, 'MM/yyyy')}
                            </h5>
                          </div>
                        </div>
                      )}
                      {hosting?.fechas && (
                        <Swiper
                          breakpoints={{
                            0: {
                              slidesPerView: 4
                            },
                            576: {
                              slidesPerView:
                                (hosting?.fechas).length <= 7
                                  ? (hosting?.fechas).length
                                  : 7
                            },
                            768: {
                              slidesPerView:
                                (hosting?.fechas).length <= 12
                                  ? (hosting?.fechas).length
                                  : 12
                            },
                            1024: {
                              slidesPerView: 5
                            },
                            1200: {
                              slidesPerView: 7
                            },
                            1600: {
                              slidesPerView:
                                (hosting?.fechas).length <= 10
                                  ? (hosting?.fechas).length
                                  : 10
                            }
                          }}
                          pagination={{
                            dynamicBullets: true
                          }}
                          modules={[Pagination]}
                          className="w-[93%]"
                        >
                          {hosting?.fechas
                            ?.sort(
                              (a: any, b: any) =>
                                // @ts-expect-error
                                new Date(a.fecha) - new Date(b.fecha)
                            ) // Ordenar por fecha ascendente
                            .map((fecha: any, index: number) => (
                              <SwiperSlide
                                key={index}
                                onClick={() => {
                                  setOpenComprobantes(true)
                                  setComprobantes(fecha)
                                }}
                                className="w-full flex group flex-col items-center space-y-2 justify-start gap-x-0"
                              >
                                <div className="w-5 order-1 md:order-none mt-2 bg-gradient-to-t from-[#3c70a6] to-[#7aade3] cursor-pointer hover:w-6 transition-all h-32 rounded-full"></div>
                                <div className="text-black relative ">
                                  <h5 className="text-[11px] font-bold text-center flex gap-1">
                                    {format(parseISO(fecha.fecha), 'MM/yyyy')}
                                    <span
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        eliminarFecha(index)
                                      }}
                                      className="opacity-0 group-hover:opacity-100 cursor-pointer text-main"
                                    >
                                      x
                                    </span>
                                  </h5>
                                  <h6 className="group-hover:opacity-100 opacity-0 transition-opacity text-[12px] text-main font-bold text-center absolute left-0 right-0">
                                    S/ {fecha.precio}
                                  </h6>
                                </div>
                                {/* </div> */}
                              </SwiperSlide>
                            ))}
                        </Swiper>
                      )}
                    </div>
                  </>
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center group relative text-black ">
                    <IoCloseCircle
                      className="absolute top-2 right-2 text-main text-2xl opacity-0 group-hover:opacity-100 transition-all cursor-pointer z-10"
                      onClick={() => {
                        limiarCampos()
                      }}
                    />
                    <h3 className="mb-4 text-black font-bold ">RENOVACIÓN</h3>
                    <section className="w-full flex gap-3 items-center">
                      <div className="w-full lg:relative ">
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="email"
                        >
                          Fecha
                        </label>
                        <input
                          className="h-9 w-full text-black rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                          name="inicio"
                          type="date"
                          value={nuevaFecha}
                          onChange={(e) => {
                            setNuevaFecha(e.target.value)
                          }}
                        />
                      </div>
                      <div className="w-full lg:relative ">
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="email"
                        >
                          Precio total
                        </label>
                        <input
                          className="h-9 w-full  text-black rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                          name="precio"
                          type="number"
                          value={nuevoPrecio}
                          onChange={(e) => {
                            setNuevoPrecio(e.target.value)
                          }}
                        />
                      </div>
                      <div className="w-full lg:relative ">
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="email"
                        >
                          Monto cobrado
                        </label>
                        <input
                          className="h-9 w-full  text-black rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                          name="precio"
                          type="number"
                          value={montoPrecio}
                          onChange={(e) => {
                            setMontoprecio(e.target.value)
                          }}
                        />
                      </div>
                    </section>
                    <section className="w-full flex gap-3 mt-4">
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
                          value={factura}
                          onChange={(e) => {
                            setFactura(e.target.value)
                          }}
                          disabled={false}
                        >
                          <option value="">Seleccionar</option>
                          <option value="Con factura">Con factura</option>
                          <option value="Sin factura">Sin factura</option>
                        </select>
                      </div>
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
                          value={banco}
                          onChange={(e) => {
                            setBanco(e.target.value)
                          }}
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
                      </div>
                    </section>

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
                        {archivosSubido.name}{' '}
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

                    <SubirArchivo
                      open={openArchivo}
                      setOpen={setOpenArchivo}
                      setArchivosSubido={setArchivosSubido}
                      archivosSubido={archivosSubido}
                    />

                    <input
                      type="button"
                      disabled={loading}
                      className={cn(
                        'px-3 py-2 mt-4 text-white rounded-md cursor-pointer hover:bg-secundario_dark transition-colors',
                        loading ? 'bg-secundario_dark' : 'bg-secondary-150 '
                      )}
                      value={`${!loading ? 'Guardar' : 'Guardando...'}`}
                      // eslint-disable-next-line @typescript-eslint/no-misused-promises
                      onClick={async () => {
                        await agregarFecha()
                      }}
                    />
                  </div>
                )}
              </div>

              <section className="w-full grid grid-cols1 lg:grid-cols-2 gap-6">
                <div className="w-full shadow_hosting bg-[#3c70a6] rounded-2xl p-6 flex flex-col space-y-5">
                  <div className="flex justify-between text-white w-full">
                    <div className="font-bold text-xl uppercase">Balance</div>
                  </div>
                  <div className="flex gap-0 flex-col">
                    <span className="text-white text-3xl font-bold">
                      S/ {hosting?.montoC}
                    </span>
                    <span className="text-gray-300">Pago anual</span>
                  </div>
                  <div className="flex gap-3 flex-col">
                    <span className="text-white font-bold">
                      Estado:{' '}
                      <span className="text-green-400 text-lg font-medium">
                        Vigente
                      </span>
                    </span>
                    <span className="text-white font-bold">
                      F. Inicio:{' '}
                      <span className="text-yellow-500 font-medium">
                        {hosting?.inicio}
                      </span>
                    </span>
                  </div>
                </div>

                {/* VISTA CLIENTE */}
                {/* <div className="w-full shadow_hosting bg-[#3c70a6]  rounded-2xl p-6 flex flex-col space-y-5">
                  <div className="flex justify-between text-white w-full">
                    <div className="font-bold uppercase text-xl">Soporte</div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div>
                      <BiSupport className="text-5xl text-white bg-[#5B87B4] p-2 rounded-full" />
                    </div>
                    <div className="flex flex-col">
                      <span className="text-white font-medium">
                        +51 982 408 652
                      </span>
                      <span className="text-gray-300 text-sm">
                        Numero de contacto
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3 flex-col">
                    <span className="text-white font-bold">
                      ID: <span className="text-yellow-500">5492</span>
                    </span>
                    <span className="text-white font-bold">
                      Horario de atencion:
                    </span>
                    <span className="text-white">9:00 - 6:00pm</span>
                  </div>
                </div> */}

                <div className="w-full shadow_hosting bg-[#3c70a6]  rounded-2xl p-6 flex flex-col space-y-5">
                  <div className="flex justify-between text-white w-full">
                    <div className="font-bold uppercase text-xl">
                      DATOS DE CLIENTE
                    </div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="flex flex-col">
                      <span className="text-white font-medium">
                        {hosting?.celular}
                      </span>
                      <span className="text-gray-300 text-sm">
                        Numero de contacto
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-3 flex-col">
                    <span className="text-yellow-500 font-bold ">
                      Nombres:{' '}
                      <span className="text-white">
                        {hosting?.nombres} {hosting?.apellidos}
                      </span>
                    </span>
                    <span className="text-yellow-500 font-bold">
                      Email:{' '}
                      <span className="lowercase text-white">
                        {hosting?.email}
                      </span>
                    </span>
                  </div>
                </div>
              </section>
            </section>

            <section
              className={cn(
                'grid w-full',
                openEdit
                  ? 'grid-cols-1 gap-3  mt-3'
                  : 'grid-cols-1 2xl:grid-cols-2 gap-5 2xl:gap-20  mt-6 '
              )}
            >
              <section className="grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-6 ">
                <div className="w-full shadow_hosting bg-[#3c70a6] rounded-2xl p-6 flex flex-col space-y-5">
                  <div className="flex gap-3 items-center text-white w-full">
                    <MdOutlineStorage className="text-4xl bg-white rounded-full p-2 text-[#3c70a6]" />
                    <div className="font-medium text-xl">Espacio</div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="flex flex-col w-full">
                      <div className="flex gap-3 items-center text-white w-full">
                        <BiRename className="text-4xl opacity-0 bg-white rounded-full p-2 text-[#3c70a6]" />
                        <div className="text-lg">
                          {' '}
                          {hosting?.tiposervicio == 'Hosting' ||
                          hosting?.tiposervicio == 'Hosting + Dominio'
                            ? hosting?.plan
                            : 'No registrado'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full shadow_hosting bg-[#3c70a6] rounded-2xl p-6 flex flex-col space-y-5">
                  <div className="flex gap-3 items-center text-white w-full">
                    <MdOutlineStorage className="text-4xl bg-white rounded-full p-2 text-[#3c70a6]" />
                    <div className="font-medium text-xl">Hosting</div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="flex flex-col w-full">
                      <div className="flex gap-3 items-center text-white w-full">
                        <AiOutlineCloudServer className="text-4xl opacity-0 bg-white rounded-full p-2 text-[#3c70a6]" />
                        <div className="text-lg">
                          {hosting?.tiposervicio == 'Hosting' ||
                          hosting?.tiposervicio == 'Hosting + Dominio'
                            ? hosting?.phosting
                            : 'No registrado'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full shadow_hosting bg-[#3c70a6] rounded-2xl p-6 flex flex-col space-y-5">
                  <div className="flex gap-3 items-center text-white w-full">
                    <MdOutlineStorage className="text-4xl bg-white rounded-full p-2 text-[#3c70a6]" />
                    <div className="font-medium text-xl">Dominio</div>
                  </div>
                  <div className="flex gap-3 items-center">
                    <div className="flex flex-col w-full">
                      <div className="flex gap-3 items-center text-white w-full">
                        <AiOutlineCloudServer className="text-4xl opacity-0 bg-white rounded-full p-2 text-[#3c70a6]" />
                        <div className="text-lg">
                          {hosting?.tiposervicio == 'Dominio' ||
                          hosting?.tiposervicio == 'Hosting + Dominio'
                            ? hosting?.pdominio
                            : 'No registrado'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
              <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="w-full shadow_hosting bg-[#3c70a6] rounded-2xl p-6 flex flex-col space-y-5">
                  <div className="relative">
                    <h2 className="bg-[#5B87B4] rounded-md px-2 py-1 text-white font-bold uppercase">
                      {datos?.nombre_marca
                        ? datos?.nombre_marca
                        : 'No registrado'}
                    </h2>
                    <span className="absolute h-5 border-2 border-dashed  w-1 top-10 left-5 before:w-4 before:h-4 before:absolute before:-bottom-5 before:border-2 before:border-white before:rounded-full before:-left-2"></span>
                    <div className="flex gap-7 items-center mt-6 pl-10">
                      <div className="flex flex-col items-center text-lg">
                        <Link
                          to="https://www.gic.pe/"
                          target="_black"
                          className="text-white font-medium flex gap-3 items-center"
                        >
                          {hosting?.dominio}
                        </Link>
                      </div>
                      <div className="text-green-400 flex gap-1 text-lg items-center">
                        <MdSecurity />
                        <span>SSL</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full shadow_hosting bg-[#3c70a6] rounded-2xl p-6 flex flex-col space-y-5">
                  <div className="relative">
                    <h2 className="bg-[#5B87B4] rounded-md px-2 py-1 text-white font-bold uppercase">
                      Accesos
                    </h2>
                    <div className="flex gap-7 items-center mt-3 ">
                      <div className="flex flex-col text-lg">
                        <p className="text-white  flex gap-3 items-center">
                          <span className="font-bold">Usuario:</span>{' '}
                          {hosting?.usuario}
                        </p>
                        <p className="text-white  flex gap-3 items-center">
                          <span className="font-bold">Contraseña:</span>{' '}
                          {hosting?.password}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </section>
          </section>
        ) : (
          hosting &&
          loading && (
            <div className="w-full h-full min-h-[400px] relative">
              <Loading />
            </div>
          )
        )}

        {datos2.soporte && datos2.soporte.length > 0 && (
          <SoporteHosting datos2={datos2} setOpenVista={setOpenVista} />
        )}

        <div className="bg-white  rounded-xl mt-10">
          <div className="w-full flex flex-col justify-start md:items-start gap-y-2 relative">
            <div className="w-full flex justify-between">
              <div className="flex flex-col gap-2 mb-3 ">
                <h2 className="text-xl lg:text-2xl font-bold text-black">
                  Correos registrados
                </h2>
              </div>
              <button
                className="px-4 py-2 rounded-xl bg-main hover:bg-main_dark transition-colors h-fit text-white"
                type="button"
                onClick={() => {
                  setOpenEdit(true)
                }}
              >
                AGREGAR
              </button>
            </div>
            <section className="w-full quitar_padding_bottom flex flex-col lg:flex-row gap-4">
              {venta?.map((ven: any) => {
                const dataUpdatedWeb = ven.data_web
                  ? JSON.parse(ven.data_web)
                  : null
                return (
                  dataUpdatedWeb?.arrayCorreos &&
                  dataUpdatedWeb?.arrayCorreos.length > 0 && (
                    <div className="py-2 bg-[#3c70a6] w-1/2 shadow_hosting rounded-2xl pb-2 h-full justify-between flex flex-col space-y-2">
                      <div className="h-full flex flex-col px-4  gap-3 items-center max-h-[220px]  overflow-y-auto">
                        {(dataUpdatedWeb?.arrayCorreos).map(
                          (fechaData: any, index: number) => (
                            <div className="flex flex-col w-full" key={index}>
                              <span
                                rel="noreferrer"
                                className="text-white font-medium line-clamp-1"
                              >
                                {fechaData.correo}
                              </span>
                              <span className="text-gray-300 text-sm line-clamp-1">
                                {fechaData.contraseña}
                              </span>
                            </div>
                          )
                        )}
                      </div>
                    </div>
                  )
                )
              })}
              {hosting?.arrayCorreos && hosting?.arrayCorreos.length > 0 && (
                <div className="w-1/2 py-2 bg-[#3c70a6] shadow_hosting rounded-2xl pb-2 h-full justify-between flex flex-col space-y-2">
                  <div className="h-full flex flex-col px-4  gap-3 items-center max-h-[220px]  overflow-y-auto">
                    {(hosting?.arrayCorreos).map(
                      (fechaData: any, index: number) => (
                        <div className="flex flex-col w-full" key={index}>
                          <span
                            rel="noreferrer"
                            className="text-white font-medium line-clamp-1"
                          >
                            {fechaData.correo}
                          </span>
                          <span className="text-gray-300 text-sm line-clamp-1">
                            {fechaData.contraseña}
                          </span>
                        </div>
                      )
                    )}
                  </div>
                </div>
              )}
            </section>
          </div>
        </div>

        <div className="bg-white  rounded-xl mt-10">
          <div className="w-full flex flex-col justify-start md:items-start gap-y-2 relative">
            <div className="w-full flex justify-between">
              <div className="flex flex-col gap-2 mb-3 ">
                <h2 className="text-xl lg:text-2xl font-bold text-black">
                  Antecedentes
                </h2>
                <h3 className="font-bold text-base">
                  <span className="text-gray-400 text-sm lg:text-base">
                    Correos recibidos
                  </span>{' '}
                </h3>
              </div>
              <button
                className="px-4 py-2 rounded-xl bg-main hover:bg-main_dark transition-colors h-fit text-white"
                type="button"
                onClick={() => {
                  setOpenAvanceModal(true)
                }}
              >
                AGREGAR
              </button>
            </div>
            <section className="w-full quitar_padding_bottom">
              <SwiperAvances
                setOpen={setOpenAvance}
                arrayObsequios={arrayObsequios}
                setAvance={setAvance}
                antecedentes={antecedentes}
                arrayAvances={arrayAvances}
                setOpenAntecedemte={setOpenAntecedemte}
              />
            </section>
          </div>
        </div>

        {idVenta && (
          <>
            <div className="bg-white  rounded-xl mt-6">
              <div className="flex justify-between gap-2 mb-4">
                <h2 className="text-xl w-full lg:text-2xl font-bold text-black">
                  Comentario general
                </h2>
              </div>
              <div className="w-full flex justify-center items-center flex-col md:flex-row gap-2 lg:gap-5">
                <div className="w-full">
                  <textarea
                    cols={30}
                    rows={10}
                    className="border placeholder-gray-400 focus:outline-none
                                                                            focus:border-black w-full  pr-4 h-24 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                                            border-gray-300 rounded-md transition-all text-black"
                    name="comentarios"
                    value={values.comentarios}
                    onChange={handleChange}
                    onBlur={handleBlur}
                  ></textarea>

                  <Errors
                    errors={errors.comentarios}
                    touched={touched.comentarios}
                  />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      <ModalViewSoporteHosting
        open={openVista}
        setOpen={setOpenVista}
        colaboradores={usuarios}
      />

      <ModalRegistroAvanves
        open={openAvanceModal}
        setOpen={setOpenAvanceModal}
        getOneBrief={getDatos}
      />

      <ModalHosting
        open={openEdit}
        setOpen={setOpenEdit}
        hosting={hosting}
        getDatos={getDatos}
        updateHosting={updateHosting2}
        loading={loading}
        idVenta={idVenta}
      />
      <ModalObsequios
        open={openObsequio}
        setOpen={setOpenObsequio}
        datos={hosting}
        datos2={datos2}
        getClientes={getDatos}
        usuarios={colaboradores}
      />
      <ModalViewComprobantes
        hosting={hosting}
        datos={datos2}
        open={openComprobantes}
        setOpen={setOpenComprobantes}
        comprobantes={comprobantes}
      />
    </form>
  )
}
