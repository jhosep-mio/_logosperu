/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useParams } from 'react-router-dom'
import Swal, { type SweetAlertResult } from 'sweetalert2'
import { SwiperAvances } from '../SwiperAvances'
import { Errors } from '../../../../shared/Errors'
import { Fragment, useState } from 'react'
import { FaRegEdit } from 'react-icons/fa'
import { ModalAds } from './modals/ModalAds'
import { cn } from '../../../../shared/cn'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { es } from 'date-fns/locale'
import { IoCloseCircle } from 'react-icons/io5'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import { toast } from 'sonner'
import { Loading } from '../../../../shared/Loading'
import { CardCapacitacion } from './cards/CardCapacitacion'
import { ArchivosFinales } from '../ArchivosFinales'
import useAuth from '../../../../../hooks/useAuth'
import { format, parseISO } from 'date-fns'
import { BsFillGiftFill } from 'react-icons/bs'
import { AiFillCloseCircle, AiTwotoneCalendar } from 'react-icons/ai'
import { ButtonHabilitate } from '../funciones/ButtonHabilitate'
export const PlanAdsCapaCitaciones = ({
  handleSubmit,
  colaborador,
  colaboradores,
  capacitacion,
  values,
  datos,
  setOpenQuestion,
  setOpenMail,
  arrayAlta,
  arrayAvances,
  setAvance,
  setOpenAvance,
  setOpenFinal,
  arrayFinal,
  setfinal,
  setOpenActa,
  arrayActa,
  setopenAlta,
  handleBlur,
  handleChange,
  errors,
  touched,
  getDatos,
  setCapacitacion,
  pdfName,
  fechaCreacion,
  limite,
  plan,
  validateBrief,
  communityActivo,
  getOneBrief,
  openObsequio,
  setOpenObsequio
}: {
  communityActivo: any
  openObsequio: any
  setOpenObsequio: any
  handleSubmit: any
  colaborador: never[]
  colaboradores: never[]
  values: any
  datos2: any
  capacitacion: any | null
  setOpenCorreoFinal: any
  setOpenMailFinal: any
  datos: any
  setOpenQuestion: any
  setOpenMail: any
  arrayAlta: any
  arrayAvances: any
  setAvance: any
  setOpenAvance: any
  setOpenFinal: any
  arrayFinal: any
  setfinal: any
  setOpenActa: any
  arrayActa: any
  setopenAlta: any
  handleBlur: any
  handleChange: any
  errors: any
  touched: any
  getDatos: any
  setCapacitacion: any
  pdfName: any
  fechaCreacion: any
  limite: any
  plan: any
  validateBrief: any
  getOneBrief: any
}): JSX.Element => {
  const { id } = useParams()
  const [openEdit, setOpenEdit] = useState(false)
  //   const [fechas, setFechas] = useState<any>([])
  const [addFecha, setAdFecha] = useState(false)
  const [nuevaFecha, setNuevaFecha] = useState<string>('')
  const token = localStorage.getItem('token')
  const { auth } = useAuth()
  const [loading, setLoading] = useState(false)
  const [mostrarSelector, setMostrarSelector] = useState(false)
  const [fechaSeleccionada, setFechaSeleccionada] = useState(null)
  const handleFechaSeleccionada = (date: any): void => {
    setFechaSeleccionada(date)
  }
  const updateCapacitacion = async (updatedEvents: any): Promise<void> => {
    setLoading(true)
    const data = new FormData()
    data.append('capacitacion', JSON.stringify(updatedEvents))
    data.append('nombres', datos?.nombres)
    data.append('colaborador', updatedEvents?.colaborador)
    const formattedDate = format(parseISO(updatedEvents.fecha_capacitacion), 'dd/MM/yyyy', { locale: es })
    data.append('fecha_capacitacion', formattedDate)
    data.append('tipo_capacitacion', updatedEvents?.tipo_capacitacion)
    data.append('id', id ?? '')
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/updateCapacitacionDatos/${id ?? ''}`,
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
    if (nuevaFecha) {
      // Actualizar el estado localmente
      const updatedCapacitacion = { ...capacitacion }
      updatedCapacitacion.fechas = capacitacion.fechas
        ? [...capacitacion.fechas, nuevaFecha]
        : [nuevaFecha]
      setCapacitacion(updatedCapacitacion)
      updateCapacitacion(updatedCapacitacion)
      setAdFecha(false)
      setNuevaFecha('')
    } else {
      toast.error('Error al agregar fecha ')
    }
  }

  const [loadingReenvio, setLoadingReenvio] = useState(false)

  const reenviarArchivos = async (): Promise<void> => {
    if (fechaSeleccionada) {
      setLoadingReenvio(true)
      const data = new FormData()
      data.append('fecha_adicional', fechaSeleccionada)
      data.append('marca', datos?.nombre_marca)
      data.append('nombres', datos?.nombres)
      data.append('email', datos?.email)
      data.append('pass', datos?.celular)
      data.append(
        'fecha',
        format(
          // @ts-expect-error
          setHours(setMinutes(new Date(datos.fecha_adicional), 59), 23),
          'dd/MM/yyyy HH:mm'
        )
      )

      try {
        const respuesta = await axios.post(
          `${Global.url}/reenviarArchivos/${id ?? ''}`,
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
          toast.success('Correo enviado')
          setFechaSeleccionada(null)
          setMostrarSelector(false)
          getOneBrief()
        }
      } catch (error: unknown) {
        console.log(error)
        toast.error('Error')
      } finally {
        setLoadingReenvio(false)
      }
    } else {
      toast.warning('Debe seleccionar una fecha')
    }
  }

  const reenviarArchivos2 = async (): Promise<void> => {
    setLoadingReenvio(true)
    const data = new FormData()
    data.append('fecha_adicional', '')
    try {
      const respuesta = await axios.post(
        `${Global.url}/reenviarArchivos2/${id ?? ''}`,
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
        toast.success('Fecha eliminada')
        getOneBrief()
        setMostrarSelector(false)
      }
    } catch (error: unknown) {
      console.log(error)
      toast.error('Error')
    } finally {
      setLoadingReenvio(false)
    }
  }

  const retiroAdministradorCM = (): void => {
    toast('¿Seguro de finalizar el servicio?', {
      className: 'toast_style',
      duration: 20000,
      action: {
        label: 'SI',
        onClick: async (): Promise<void> => {
          setLoadingReenvio(true)
          const data = new FormData()
          data.append('marca', datos?.nombre_marca)
          data.append('nombres', datos?.nombres)
          data.append('plan', datos?.nombre_plan)
          data.append('firma', auth.firma)
          try {
            const respuesta = await axios.post(
              `${Global.url}/retiroAdministradorCM/${id ?? ''}`,
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
              enviarCorreoFinal()
            }
          } catch (error: unknown) {
            console.log(error)
            toast.error('Error')
          } finally {
            setLoadingReenvio(false)
          }
        }
      }
    })
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

  const enviarCorreoFinal = async (): Promise<void> => {
    const { fecha, hora } = obtenerFechaHora()
    const avance = {
      fecha,
      hora,
      asunto: 'SERVICIO FINALIZADO',
      correos: [
        { id: '1598753', correo: 'diseno2@logosperu.com' },
        { id: '123456', correo: 'diseno4@logosperu.com' },
        { id: '123123123', correo: datos?.email }
      ],
      contexto: `<p>Estimado(a)&nbsp;<strong>${datos?.nombres}</strong></p><p><br></p><p>Queremos expresar nuestro sincero agradecimiento por permitirnos colaborar como su servicio de Community Manager para el proyecto&nbsp;<strong>${datos?.nombre_marca}</strong>&nbsp;durante este tiempo. Ha sido un honor trabajar en la gestión de su presencia en línea y ayudar a fortalecer la conexión con su comunidad de seguidores.&nbsp;</p><p><br></p><p>Como parte de este proceso,&nbsp;<strong>procederemos a retirar la administración de su FAN PAGE desde nuestra cuenta de Facebook</strong>. Esto garantizará una transición adecuada y la continuidad de la gestión de su presencia en línea.&nbsp;</p><p><br></p><p>¡Les deseamos mucho éxito en todos sus proyectos!&nbsp;&nbsp;</p>`,
      firma: auth.firma
    }
    const data = new FormData()
    const today = new Date()
    const formattedDate = `${String(today.getDate()).padStart(2, '0')}/${String(
      today.getMonth() + 1
    ).padStart(2, '0')}/${today.getFullYear()}`
    data.append('fecha_fin', formattedDate)
    data.append('nombre_marca', datos?.nombre_marca)
    data.append('array_final', JSON.stringify(avance))
    data.append('_method', 'PUT')
    try {
      await axios.post(`${Global.url}/subirFinal/${id ?? ''}`, data, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })
      toast.success('SERVICIO FINALIZADO')
      getOneBrief()
      const enviarNotificacion = async (): Promise<void> => {
        const data = new FormData()
        const currentUrl = window.location.href
        // Utilizar el objeto URL para extraer la ruta
        const urlObject = new URL(currentUrl)
        const pathName = urlObject.pathname
        data.append('id_usuario', auth.id)
        data.append('id_venta', String(id))
        data.append('nombre', auth.name)
        data.append('icono', 'correo')
        data.append('url', pathName)
        data.append(
          'contenido',
          `Ha enviado el corrreo final del proyecto ${
            datos?.nombre_marca ?? ''
          }  (${datos?.nombres ?? ''})`
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
        }
      }
      enviarNotificacion()
    } catch (error: unknown) {
      console.log(error)
    }
  }

  return (
    <form
      className={cn(
        'fixed inset-0 w-full xl:w-[86%] ml-0 xl:ml-[14%] h-full bg-white flex',
        openEdit ? 'flex gap-10 pr-4' : ''
      )}
      onSubmit={handleSubmit}
    >
      <div
        className={cn(
          'h-full transition-all duration-300 overflow-y-auto p-8 ',
          openEdit ? 'w-full lg:w-[70%]' : 'w-full'
        )}
      >
        <section className="w-full flex justify-between items-center group">
          <div className="w-full flex gap-4 items-center">
            <div className="w-ful">
              <h2 className="font-bold text-2xl text-black">Capacitaciones</h2>
              <span className="text-gray-500 mt-3">Panel administrativo</span>
            </div>
            <FaRegEdit
              onClick={() => {
                setOpenEdit(!openEdit)
              }}
              className="text-main text-3xl hover:text-main_dark cursor-pointer group-hover:opacity-100 opacity-0 transition-all"
            />
          </div>
          <div className="w-full flex justify-end items-center">
            <span className="text-left flex flex-col md:flex-row gap-2 md:gap-6 text-black uppercase">
              <span className="text-sm md:text-base font-bold text-[#3c70a6]">
                COLABORADOR(ES) A CARGO:
              </span>
              {colaborador?.map((asignacion: any, index: number) => {
                const assignedCollaborators = colaboradores
                  .filter(
                    (colaborador: { id: number, name: string }) =>
                      colaborador.id == asignacion.peso
                  )
                  .map((colaborador: { name: string }) => colaborador.name)
                return (
                  <Fragment key={index}>
                    {assignedCollaborators && (
                      <span>{assignedCollaborators}</span>
                    )}
                    {index < colaborador.length - 1}
                  </Fragment>
                )
              })}
            </span>
          </div>
        </section>
        <div className="flex flex-col lg:flex-row gap-3 items-center mt-4 mb-2 justify-between relative z-[2] w-fit min-w-[600px]">
              <div className="flex gap-3 items-center justify-between lg:justify-start w-full">
                <div
                  className="flex gap-3 bg-main px-3 py-1 rounded-md cursor-pointer hover:bg-main_dark"
                  onClick={() => {
                    setOpenObsequio(!openObsequio)
                  }}
                >
                  <span className="text-white">Adicionales</span>
                  <BsFillGiftFill className="text-2xl  rounded-lg text-white  transition-colors cursor-pointer" />
                </div>
                <div className="w-fit  relative z-[11]">
                  <div
                    className="w-full  px-3 py-1 items-center rounded-md bg-green-600 hover:bg-green-700 transition-colors cursor-pointer flex gap-3"
                    onClick={() => {
                      setMostrarSelector(!mostrarSelector)
                    }}
                  >
                    <span className="text-white">Reenviar archivos</span>
                    <AiTwotoneCalendar className="text-2xl  text-white transition-colors " />
                  </div>
                  {mostrarSelector && (
                    <div className="absolute top-full w-fit shadow-md flex flex-col bg-white p-4 rounded-md mt-2 left-0 right-0 z-[11]">
                      <DatePicker
                        selected={fechaSeleccionada}
                        onChange={handleFechaSeleccionada}
                        dateFormat="dd/MM/yyyy"
                        className="text-black border px-3 py-1 border-gray-300 rounded-md"
                      />
                      <button
                        disabled={loadingReenvio}
                        className="bg-secondary-150 px-2 py-1 w-fit rounded-md text-white mt-3"
                        type="button"
                        onClick={async () => {
                          await reenviarArchivos()
                        }}
                      >
                        Guardar
                      </button>
                    </div>
                  )}
                </div>
                {
                  datos?.fecha_adicional && (
                    <div className="flex gap-3 items-center bg-white rounded-md px-2 py-1">
                      <span className="text-black h-full flex items-center">
                        {
                          format(new Date(datos?.fecha_adicional), 'dd/MM/yyyy')
                        }
                      </span>
                      <AiFillCloseCircle
                        className="text-2xl text-main cursor-pointer"
                        onClick={async () => {
                          if (!loadingReenvio) {
                            await reenviarArchivos2()
                          }
                        }}
                      />
                    </div>
                  )
                }
                {datos?.fecha_fin == null && (
                  <div
                    className="flex gap-3 bg-secundario px-3 py-1 rounded-md cursor-pointer hover:bg-secundario_dark transition-colors"
                    onClick={() => {
                      retiroAdministradorCM()
                    }}
                  >
                    <span className="text-white">Finalizar servicio</span>
                  </div>
                )}
              </div>
              {datos?.fecha_fin == null && (
              <div className="w-full flex justify-end">
                  <ButtonHabilitate
                    communityActivo={communityActivo}
                    datos={datos}
                    id={id}
                    setLoading={setLoading}
                    token={token}
                    getOneBrief={getOneBrief}
                    plan={plan}
                  />
              </div>
              )}
        </div>
        {capacitacion && !loading
          ? (
          <>
            <section
              className={cn(
                'grid w-full mt-6',
                openEdit ? 'grid-cols-1 gap-3' : 'grid-cols-1 xl:grid-cols-2 gap-10'
              )}
            >
              <div className="w-full shadow_hosting_grafico max-h-[330px] bg-white rounded-2xl overflow-hidden flex group flex-col space-y-5 relative">
                {!addFecha
                  ? (
                  <>
                    <div className="mx-auto h-full select-none relative flex flex-col md:flex-row flex-1 group before:absolute before:w-full before:h-full before:top-0 before:left-0 before:bg-black before:opacity-0 hover:before:opacity-50 before:transition-all transition-all">
                     <a href={`https://api.logosperu.com.pe/public/cerificados/${id ?? ''}_${datos?.nombres ?? ''}.pdf`} target='_blank' rel="noreferrer" className='block w-full'>
                      <img src="https://api.logosperu.com.pe/public/archivosVarios/certi3.jpg" alt="" className='block w-full h-full object-cover'/>
                      </a>
                      <a href={`https://api.logosperu.com.pe/public/certificados/${id ?? ''}_${datos?.nombres ?? ''}.pdf`} target='_blank' type="button" className='select-none w-fit h-fit flex absolute inset-0 m-auto bg-secundario text-white px-4 opacity-0 group-hover:z-[20] group-hover:opacity-100 py-2 rounded-lg transition-all' rel="noreferrer">Ver certificado</a>
                    </div>
                  </>
                    )
                  : (
                  <div className="w-full h-full flex flex-col items-center justify-center relative">
                    <IoCloseCircle
                      className="absolute top-2 right-2 text-main text-2xl opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
                      onClick={() => {
                        setAdFecha(!addFecha)
                      }}
                    />
                    <input
                      className="h-9 w-full text-black rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                      name="inicio"
                      type="date"
                      value={nuevaFecha}
                      onChange={(e) => {
                        setNuevaFecha(e.target.value)
                      }}
                    />
                    <input
                      type="button"
                      className="bg-secondary-150 px-3 py-2 mt-4 text-white rounded-md cursor-pointer"
                      value="Grabar"
                      onClick={agregarFecha}
                    />
                  </div>
                    )}
              </div>

              <section className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                        <CardCapacitacion subtitulo='Colaborador a cargo' titulo={capacitacion.colaborador} color='#EE0606' icono='user'/>
                        <CardCapacitacion subtitulo='Tipo de capacitación' titulo={capacitacion.tipo_capacitacion} color='#18D691' icono={capacitacion?.tipo_capacitacion}/>
                        <CardCapacitacion subtitulo='Duración de capacitación' titulo={capacitacion.duracion} color='#21ACD5' icono='duracion'/>
                        <CardCapacitacion subtitulo='Fecha de capacitación' titulo={capacitacion.fecha_capacitacion} color='#6635D8' icono='fecha'/>
              </section>
            </section>

          </>
            )
          : (
              capacitacion &&
          loading && (
            <div className="w-full h-full min-h-[400px] relative">
              <Loading />
            </div>
              )
            )}

        <div className="bg-white p-4 rounded-xl mt-10">
          <ArchivosFinales
            datos={datos}
            getOneBrief={getDatos}
            values={values}
            pdfName={pdfName}
            setpdfName={pdfName}
            fechaCreacion={fechaCreacion}
            limite={limite}
            plan={plan}
            validateBrief={validateBrief}
          />
        </div>

        <div className="bg-white  rounded-xl mt-10">
          <div className="w-full flex flex-col justify-start md:items-start gap-y-2 relative">
            <div className="flex flex-col gap-2 mb-3 ">
              <h2 className="text-xl lg:text-2xl font-bold text-black">
                Seguimiento del proyecto
              </h2>
              <h3 className="font-bold text-base">
                <span className="text-gray-400 text-sm lg:text-base">
                  Correos recibidos
                </span>{' '}
              </h3>
            </div>
            <span
              className="w-fit px-4 py-2 bg-main text-white font-bold rounded-xl absolute right-2 flex gap-2 items-center cursor-pointer"
              onClick={() => {
                if (
                  datos.correo &&
                  datos.correo != 'null' &&
                  datos.correo != null
                ) {
                  setOpenQuestion(true)
                } else {
                  Swal.fire({
                    title: 'EL cliente no tiene un email registrado',
                    showDenyButton: true,
                    confirmButtonText: 'Registrar email',
                    denyButtonText: 'Cancelar'
                  }).then(async (result: SweetAlertResult) => {
                    if (result.isConfirmed) {
                      setOpenMail(true)
                    }
                  })
                }
              }}
            >
              Agregar avance
            </span>
            <section className="w-full quitar_padding_bottom">
              <SwiperAvances
                arrayAlta={arrayAlta}
                arrayAvances={arrayAvances}
                setAvance={setAvance}
                setOpen={setOpenAvance}
                setOpenFinal={setOpenFinal}
                arrayFinal={arrayFinal}
                setFinal={setfinal}
                setOpenActa={setOpenActa}
                arrayActa={arrayActa}
                datos={datos}
                setOpenAlta={setopenAlta}
              />
            </section>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl mt-6">
            <div className="flex justify-between gap-2 mb-4">
                <div className="flex gap-2 w-full justify-end">
                    <input
                        type="submit"
                        className="bg-main_2-200 text-white hover:bg-primary flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
                        value="Grabar comentario"
                    />
                </div>
            </div>
            <div className='text-black mb-4'>
                <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="email"
                >
                    PUNTUACION DEL CLIENTE
                </label>
                    <select
                    className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                    name='puntuacion'
                    value={values.puntuacion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={false}
                >
                    <option value="">Seleccionar</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                <Errors
                    errors={errors.puntuacion}
                    touched={touched.puntuacion}
                />
            </div>
            <label
                className="text-sm text-black font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="email"
            >
                COMENTARIO GENERAL
            </label>
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
      </div>
      <ModalAds
        open={openEdit}
        setOpen={setOpenEdit}
        capacitacion={capacitacion}
        getDatos={getDatos}
        updateCapacitacion={updateCapacitacion}
        loading={loading}
      />
    </form>
  )
}
