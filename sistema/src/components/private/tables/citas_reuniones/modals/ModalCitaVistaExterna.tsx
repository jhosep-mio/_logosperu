/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Dialog } from '@mui/material'
import Slide from '@mui/material/Slide'
import { type TransitionProps } from '@mui/material/transitions'
import { useFormik } from 'formik'
import React, { useState, useEffect } from 'react'
import { SchemaValidateCita } from '../../../../shared/schemas/Schemas'
import { toast } from 'sonner'
import {
  aviso,
  imalta,
  imbaja,
  ocupado,
  privado
} from '../../../../shared/Images'
import { Loading } from '../../../../shared/Loading'
import { cn } from '../../../../shared/cn'
import useAuth from '../../../../../hooks/useAuth'
import { Swiper, SwiperSlide } from 'swiper/react'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import { AiOutlineMessage } from 'react-icons/ai'
import { FaWindowClose } from 'react-icons/fa'
import EditorPdfAltas from '../../../../shared/modals/EditorPdfAltas'
const Transition = React.forwardRef(function Transition (
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})
export const ModalCitaVistaExterna = ({
  open,
  setOpen,
  getUsuarios
}: any): JSX.Element => {
  const [loading, setLoading] = useState(false)
  const { auth } = useAuth()
  const [showTimeInput] = useState(false)
  const [openNotas, setOpenNotas] = useState(false)
  const [contenido, setContenido] = useState('')

  const saveCita = async (): Promise<void> => {
    setLoading(true)
    const token = localStorage.getItem('token')
    const data = new FormData()
    data.append('notas', JSON.stringify(contenido))
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/updateNotas/${open?.evento?.event?.orden?.id}`,
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
        toast.success(`${values.tipo} actualizada correctamente`)
        getUsuarios()
      }
    } catch (error) {
      toast.error(`Error al guardar ${values.tipo}`)
      console.log(error)
    } finally {
      limpiarTodo()
      setOpenNotas(false)
      setLoading(false)
    }
  }

  const {
    handleSubmit,
    errors,
    values,
    touched,
    isSubmitting,
    setValues,
    resetForm
  } = useFormik({
    initialValues: {
      estado: 'Ocupado',
      tipo: '',
      miembros: [],
      dateinicio: new Date().toISOString().split('T')[0],
      timeinicio: '',
      datefinal: new Date().toISOString().split('T')[0],
      timefinal: '',
      dateaviso: new Date().toISOString().split('T')[0],
      timeaviso: '',
      asunto: '',
      cuerpo: '',
      etiqueta: '',
      categorias: [],
      notas: ''
    },
    validationSchema: SchemaValidateCita,
    onSubmit: saveCita
  })

  useEffect(() => {
    if (errors && isSubmitting) {
      const firstErrorKey = Object.keys(errors)[0]
      const firstErrorElement = document.getElementsByName(firstErrorKey)[0]
      if (firstErrorElement) {
        firstErrorElement.focus()
      }
    }
  }, [touched, errors, isSubmitting])

  useEffect(() => {
    if (open.evento) {
      const datos = open?.evento?.event.orden
      setValues({
        ...values,
        estado: datos?.estado,
        tipo: datos?.tipo,
        miembros: datos?.miembros ? JSON.parse(datos?.miembros) : [],
        dateinicio: JSON.parse(datos?.hora_inicio).dateinicio,
        timeinicio: JSON.parse(datos?.hora_inicio).timeinicio,
        datefinal: JSON.parse(datos?.hora_final).datefinal,
        timefinal: JSON.parse(datos?.hora_final).timefinal,
        dateaviso: JSON.parse(datos?.aviso).dateaviso,
        timeaviso: JSON.parse(datos?.aviso).timeaviso,
        asunto: datos?.asunto,
        cuerpo: datos?.cuerpo,
        etiqueta: datos?.etiqueta ?? '',
        categorias: datos?.categorias ? JSON.parse(datos?.categorias) : []
      })
      setContenido(datos?.notas ? JSON.parse(datos?.notas) : '')
    }
  }, [open])

  const limpiarTodo = (): void => {
    resetForm()
    setOpen(false)
  }

  useEffect(() => {
    if (errors && isSubmitting) {
      if (Object.keys(errors).length > 0 && isSubmitting) {
        Object.keys(errors)
          .reverse()
          .forEach((key) => {
            // @ts-expect-error
            toast.warning(`${errors[key]}`)
          })
      }
      const firstErrorKey = Object.keys(errors)[0]
      const firstErrorElement = document.getElementsByName(firstErrorKey)[0]
      if (firstErrorElement) {
        firstErrorElement.focus()
      }
    }
  }, [touched, errors, isSubmitting])

  return (
    <Dialog
      open={open?.estado}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => setOpen({ estado: false, evento: null })}
      aria-describedby="alert-dialog-slide-description"
      className="moda_registro"
      maxWidth="lg"
    >
      {!loading ? (
        <section className="w-full pt-2 flex flex-col relative">
            {openNotas &&
                <div className='absolute w-[40%] h-full z-[10] py-3 right-0 top-0 bottom-0 bg-white shadow_class_cita'>
                    <FaWindowClose
                    onClick={() => { setOpenNotas(false) }}
                    className='absolute top-2 right-2 text-xl hover:bg-red-500 cursor-pointer'/>
                    <h2 className='font-bold text-black w-full text-center'>Notas</h2>
                    <EditorPdfAltas content={contenido} setContent={setContenido} />
                    <div className='flex justify-center'>
                        <button
                        type='submit'
                        form='yourFormId3'
                        className='w-fit mx-auto bg-main hover:bg-main_dark transition-colors mt-3 px-3 py-1 rounded-md text-white'>Guardar</button>
                    </div>
                </div>
            }
          <div className="absolute top-2 right-2 cursor-pointer"
          onClick={() => { setOpenNotas(true) }}
          >
            <span className="absolute -top-1 p-1 -right-1 w-[16px] h-[16px] text-sm text-white bg-main rounded-full flex items-center justify-center">
              {contenido.length > 0 ? 1 : ''}
            </span>
            <AiOutlineMessage className="text-2xl" />
          </div>
          <h1 className="w-full text-center text-gray-600 text-md pb-2">
            {values.asunto == '' ? 'Sin titulo' : values.asunto} -{' '}
            {values.tipo.toUpperCase()}
          </h1>
          <div className="flex items-center w-full bg-white border-y h-[90px] z-[2]">
            <div className="flex flex-col gap-4 text-sm h-full justify-center items-center border-r border-gray-200 ">
              <button
                type="button"
                className="flex  text-black items-center gap-1 px-2"
              >
                <div className="flex gap-1">
                  <img src={ocupado} alt="" className="object-contain" />
                  <p>Mostrar como:</p>
                </div>
                <div className="flex items-center border border-gray-400 px-1 rounded-sm  w-[160px]">
                  <span
                    className={cn(
                      'w-[15px] h-[15px]',
                      values.estado == 'Ocupado'
                        ? 'bg-red-300'
                        : values.estado == 'Home office'
                          ? 'bg-yellow-200'
                          : values.estado == 'Disponible'
                            ? 'bg-green-300'
                            : values.estado == 'Provisional'
                              ? 'bg-gray-300'
                              : values.estado == 'Fuera de la oficina'
                                ? 'bg-cyan-200'
                                : ''
                    )}
                  ></span>
                  <select
                    className="outline-none"
                    name="estado"
                    value={values.estado}
                    disabled
                  >
                    <option value="Ocupado" className="bg-red-300">
                      {' '}
                      Ocupado
                    </option>
                    <option value="Home office" className="bg-yellow-200">
                      Home office
                    </option>
                    <option value="Disponible" className="bg-green-300">
                      Disponible
                    </option>
                    <option value="Provisional" className="bg-gray-300">
                      Provisional
                    </option>
                    <option value="Fuera de la oficina" className="bg-cyan-200">
                      Fuera de la oficina
                    </option>
                  </select>
                </div>
              </button>
              <button
                type="button"
                className="flex justify-between w-full text-black items-center gap-1 px-2"
              >
                <div className="flex gap-1">
                  <img src={aviso} alt="" className="object-contain" />
                  <p>Aviso:</p>
                </div>
                <select
                  name="time"
                  id="time"
                  disabled
                  className="border border-gray-400 rounded px-1 w-[160px] outline-none"
                >
                  <option value="">ninguno</option>
                  <option value="10 minutos">10 minutos</option>
                  <option value="15 minutos">15 minutos</option>
                  <option value="30 minutos">30 minutos</option>
                  <option value="1 hora">1 hora</option>
                  <option value="manual">Manualmente</option>
                </select>
              </button>
            </div>
            {showTimeInput && (
              <div className="flex flex-col px-4 gap-2s text-sm h-full justify-start pt-1 items-start border-r border-gray-200 ">
                <h2 className="w-full text-gray-600 text-center">
                  Fecha y hora
                </h2>
                <div className="flex flex-col gap-[2px]">
                  <input
                    type="date"
                    name="dateaviso"
                    value={values.dateaviso}
                    disabled
                    className="border border-gray-400 rounded px-1"
                  />
                  <input
                    type="time"
                    value={values.timeaviso}
                    disabled
                    className="border border-gray-400 rounded px-1"
                  />
                </div>
              </div>
            )}
            <div className="flex flex-col gap-0 text-sm h-full justify-center items-start border-r border-gray-200 ">
              <button
                type="button"
                disabled
                className={cn(
                  'flex w-full text-black items-center  gap-1 px-2',
                  values.etiqueta == 'privado' ? 'bg-gray-300' : ''
                )}
              >
                <div className="flex gap-1">
                  <img
                    src={privado}
                    alt=""
                    className="w-[17px] h-[17px] object-contain"
                  />
                </div>
                <p>Privado</p>
              </button>
              <button
                type="button"
                disabled
                className={cn(
                  'flex w-full text-black items-center  gap-1 px-2',
                  values.etiqueta == 'importancia alta' ? 'bg-gray-300' : ''
                )}
              >
                <div className="flex gap-1">
                  <img
                    src={imalta}
                    alt=""
                    className="w-[17px] h-[17px] object-contain"
                  />
                </div>
                <p>Importancia alta</p>
              </button>
              <button
                disabled
                type="button"
                className={cn(
                  'flex w-full text-black items-center  gap-1 px-2',
                  values.etiqueta == 'importancia baja' ? 'bg-gray-300' : ''
                )}
              >
                <div className="flex gap-1">
                  <img
                    src={imbaja}
                    alt=""
                    className="w-[17px] h-[17px] object-contain"
                  />
                </div>
                <p>Importancia baja</p>
              </button>
            </div>
          </div>
          {values.categorias.length > 0 && (
            <div
              className={cn(
                'mt-1 grid gap-1 px-2'
                // `grid-cols-${values.categorias.length}`
              )}
              style={{
                gridTemplateColumns: `repeat(${values.categorias.length}, 1fr)`
              }}
            >
              {values.categorias.map((categoria: any, index: number) => (
                <span
                  key={index}
                  className={cn(
                    'w-full text-sm px-2 font-medium',
                    categoria == 'Categoria amarilla'
                      ? 'bg-yellow-300'
                      : categoria == 'Categoria azul'
                        ? 'bg-blue-300'
                        : categoria == 'Categoria naranja'
                          ? 'bg-orange-300'
                          : categoria == 'Categoria purpura'
                            ? 'bg-violet-300'
                            : categoria == 'Categoria roja'
                              ? 'bg-red-300'
                              : categoria == 'Categoria verde'
                                ? 'bg-green-300'
                                : ''
                  )}
                >
                  {categoria}
                </span>
              ))}
            </div>
          )}
          <form
            id="yourFormId3" // Asigna un ID al formulario
            onSubmit={handleSubmit}
            className="flex flex-col gap-1 w-full px-2 pt-4 pb-2"
          >
            <section className="flex gap-3 w-full">
              <section
                className={cn(
                  'flex flex-col gap-1 ',
                  values.tipo == 'reunion' ? 'section_citas' : 'w-full'
                )}
              >
                {values.tipo == 'reunion' && (
                  <>
                    <div className="flex text-sm items-center gap-2 w-full">
                      <p className="w-[20%]">De:</p>
                      <p className=" rounded-sm py-0 px-[1px] outline-none w-[80%]">
                        {auth.email_alter}
                      </p>
                    </div>
                    <div className="flex text-sm items-center gap-2 w-full">
                      <p className="w-[20%]">Para:</p>
                      <div className="relative w-[80%] flex gap-2">
                        {values.miembros.length > 0 &&
                          values.tipo == 'reunion' && (
                            <Swiper
                              slidesPerView={3}
                              className="w-full swp_citas overflow-hidden"
                              spaceBetween={20}
                              breakpoints={{
                                0: {
                                  slidesPerView: 1
                                },
                                576: {
                                  slidesPerView: 2
                                },
                                800: {
                                  slidesPerView: 3
                                },
                                1200: {
                                  slidesPerView: 3
                                },
                                1600: {
                                  slidesPerView: 3
                                }
                              }}
                            >
                              {values.miembros.map(
                                (miembro: any, index: number) => (
                                  <SwiperSlide
                                    key={index}
                                    className="w-full flex items-center justify-center py-1 rounded line-clamp-1"
                                  >
                                    <span className="w-full">
                                      {miembro.email};
                                    </span>
                                  </SwiperSlide>
                                )
                              )}
                            </Swiper>
                        )}
                      </div>
                    </div>
                  </>
                )}

                <div className="flex text-sm items-center gap-2 w-full">
                  <p className="w-[20%]">Asunto:</p>
                  <input
                    type="text"
                    name="asunto"
                    value={values.asunto}
                    disabled
                    className="rounded-sm py-0 px-[1px] bg-transparent outline-none w-[80%]"
                  />
                </div>
                <div className="flex text-sm items-center gap-2 w-full">
                  <p className="w-[20%]">Hora de inicio:</p>
                  <div className="flex gap-[2px] w-[80%]">
                    <input
                      type="date"
                      className="rounded px-1 bg-transparent"
                      name="dateinicio"
                      disabled
                      value={values.dateinicio}
                    />
                    <input
                      type="time"
                      className="rounded px-1 bg-transparent"
                      name="timeinicio"
                      disabled
                      value={values.timeinicio}
                    />
                  </div>
                </div>
                <div className="flex text-sm items-center gap-2 w-full">
                  <p className="w-[20%]">Hora de finalización:</p>
                  <div className="flex gap-[2px] w-[80%]">
                    <input
                      type="date"
                      className=" rounded px-1 bg-transparent"
                      name="datefinal"
                      disabled
                      value={values.datefinal}
                    />
                    <input
                      type="time"
                      className=" rounded px-1 bg-transparent"
                      name="timefinal"
                      disabled
                      value={values.timefinal}
                    />
                  </div>
                </div>
              </section>
            </section>
            <textarea
              rows={10}
              name="cuerpo"
              value={values.cuerpo}
              disabled
              className="w-full border border-gray-400 rounded-sm p-[2px] outline-none text-sm resize-none"
            ></textarea>
          </form>
        </section>
      ) : (
        <section className="w-full min-h-[500px]">
          <Loading />
        </section>
      )}
    </Dialog>
  )
}
