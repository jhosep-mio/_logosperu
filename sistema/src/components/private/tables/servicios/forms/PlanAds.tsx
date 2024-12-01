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
import { es } from 'date-fns/locale'
import { cn } from '../../../../shared/cn'
// import { format } from 'date-fns'
import { IoCloseCircle } from 'react-icons/io5'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import { toast } from 'sonner'
import { Loading } from '../../../../shared/Loading'
import { CardCapacitacion } from './cards/CardCapacitacion'
import { ArchivosFinales } from '../ArchivosFinales'
import { format, parseISO } from 'date-fns'
export const PlanAds = ({
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
  validateBrief
}: {
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
}): JSX.Element => {
  const { id } = useParams()
  const [openEdit, setOpenEdit] = useState(false)
  //   const [fechas, setFechas] = useState<any>([])
  const [addFecha, setAdFecha] = useState(false)
  const [nuevaFecha, setNuevaFecha] = useState<string>('')
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(false)

  const updateCapacitacion = async (updatedEvents: Event[]): Promise<void> => {
    setLoading(true)
    const data = new FormData()
    data.append('capacitacion', JSON.stringify(updatedEvents))
    data.append('nombres', datos?.nombres)
    // @ts-expect-error
    data.append('colaborador', updatedEvents?.colaborador)
    // @ts-expect-error
    const formattedDate = format(parseISO(updatedEvents.fecha_capacitacion), 'dd/MM/yyyy', { locale: es })
    data.append('fecha_capacitacion', formattedDate)
    // @ts-expect-error
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
                     <a href={`https://api.logosperu.com.pe/public/certificados/${id ?? ''}_${datos?.nombres ?? ''}.pdf`} target='_blank' rel="noreferrer" className='block w-full'>
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
                        <CardCapacitacion subtitulo='Tipo de capacitación' titulo={capacitacion.tipo_capacitacion} color='#18D691' icono="facebook"/>
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

        <div className="bg-white p-4 rounded-xl mt-6">
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

        <div className="bg-white  rounded-xl mt-6">
          <div className="flex justify-between gap-2 mb-4">
            <h2 className="text-xl w-full lg:text-2xl font-bold text-black">
              Comentario general
            </h2>
            <div className="flex gap-2 w-full justify-end">
              <input
                type="submit"
                className="bg-main_2-200 text-white hover:bg-primary flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
                value="Grabar comentario"
              />
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
