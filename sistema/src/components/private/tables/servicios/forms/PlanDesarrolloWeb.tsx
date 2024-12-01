/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {
  CiCircleCheck,
  CiGlobe,
  CiMonitor,
  CiPaperplane,
  CiViewTimeline
} from 'react-icons/ci'
import { IoExtensionPuzzleOutline } from 'react-icons/io5'
import vieweb from '../../../../../assets/webView.svg'
import { TfiWorld } from 'react-icons/tfi'
import { motion } from 'framer-motion'
import { Fragment, useState } from 'react'
import Swal, { type SweetAlertResult } from 'sweetalert2'
import { addMonths, differenceInDays, format, parse } from 'date-fns'
import { Swiper, SwiperSlide } from 'swiper/react'
import { PiCheck } from 'react-icons/pi'
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import { Pagination } from 'swiper/modules'
import { cn } from '../../../../shared/cn'
import { ArchivosFinales } from '../ArchivosFinales'
import { SwiperAvances } from '../SwiperAvances'
import { Errors } from '../../../../shared/Errors'
import { MdOutlineStorage } from 'react-icons/md'
import { BiRename } from 'react-icons/bi'
import { ModalEditDesarrolloWeb } from '../modals/ModalEditDesarrolloWeb'
import { FaRegEdit } from 'react-icons/fa'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import { useParams } from 'react-router-dom'
import { TiDelete, TiPlus } from 'react-icons/ti'
import { FaCirclePlus } from 'react-icons/fa6'
import { ListaHosting } from './modals/ListaHosting'
import { RiCloseCircleFill } from 'react-icons/ri'
import { SoporteHosting2 } from './modals/SoporteHosting2'
import { ModalViewSoporteHosting } from './modals/ModalViewSoporteHosting'

interface Proceso {
  nombre: string
  fecha: string
  icono: string
}

export const PlanDesarrolloWeb = ({
  oneHost,
  dataUpdatedWeb,
  handleSubmit,
  datos,
  colaborador,
  colaboradores,
  fillAnimation,
  setseguimientoRegistrado,
  seguimientoRegistrado,
  actualizarSeguimientoBD,
  getOneBrief,
  values,
  pdfName,
  setpdfName,
  fechaCreacion,
  limite,
  plan,
  validateBrief,
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
  handleChange,
  handleBlur,
  errors,
  touched,
  setLoading
}: any): JSX.Element => {
  // SEGUIMIENTO TIENDA virtual
  const [openEdit, setOpenEdit] = useState(false)
  const [openModalProcess, setOpenModalProcess] = useState(false)
  const { id } = useParams()
  const [openListHosting, setOpenListHosting] = useState(false)
  const [openVista, setOpenVista] = useState({ estado: false, datos: null })

  const mantenimientoWeb: any = [
    {
      nombre: '1° Seguimiento',
      fecha: 'Sin fecha',
      icono: 'br'
    },
    {
      nombre: '2° Seguimiento',
      fecha: 'Sin fecha',
      icono: 'br'
    },
    {
      nombre: '3° Seguimiento',
      fecha: 'Sin fecha',
      icono: 'av'
    },
    {
      nombre: '4° Seguimiento',
      fecha: 'Sin fecha',
      icono: 'av'
    },
    {
      nombre: '5° Seguimiento',
      fecha: 'Sin fecha',
      icono: 'av'
    },
    {
      nombre: '6° Seguimiento',
      fecha: 'Sin fecha',
      icono: 'cap'
    },
    {
      nombre: '7° Seguimiento',
      fecha: 'Sin fecha',
      icono: 'dom'
    },
    {
      nombre: '8° Seguimiento',
      fecha: 'Sin fecha',
      icono: 'fin'
    },
    {
      nombre: '9° Seguimiento',
      fecha: 'Sin fecha',
      icono: 'fin'
    },
    {
      nombre: '10° Seguimiento',
      fecha: 'Sin fecha',
      icono: 'fin'
    },
    {
      nombre: '11° Seguimiento',
      fecha: 'Sin fecha',
      icono: 'fin'
    },
    {
      nombre: '12° Seguimiento',
      fecha: 'Sin fecha',
      icono: 'fin'
    }
  ]

  function limpiarDominio (url: string): string | null {
    // eslint-disable-next-line no-useless-escape
    const patron: RegExp = /^(?:https?:\/\/)?(?:www\.)?([^:\/\n?]+)/g
    // Busca el patrón en la URL
    const coincidencia: RegExpMatchArray | null = url.match(patron)
    if (coincidencia) {
      // Elimina "www." si está presente
      let dominio: string = coincidencia[0].replace('www.', '')
      // Elimina "https://" si está presente
      dominio = dominio.replace('https://', '')
      return dominio
    } else {
      return null
    }
  }

  const calculateX = (percentage: number): number => {
    return 59 + 50 * Math.sin((2 * Math.PI * percentage) / 100)
  }

  const calculateY = (percentage: number): number => {
    return 60 - 50 * Math.cos((2 * Math.PI * percentage) / 100)
  }

  function obtenerDiaMes (fecha: string): string {
    if (fecha === 'Sin fecha') {
      return 'Sin fecha'
    }
    const partesFecha: string[] = fecha.split('-')
    const dia: number = parseInt(partesFecha[2], 10)
    const mes: number = parseInt(partesFecha[1], 10)

    // Nombres de los meses
    const nombresMeses: string[] = [
      'enero',
      'febrero',
      'marzo',
      'abril',
      'mayo',
      'junio',
      'julio',
      'agosto',
      'septiembre',
      'octubre',
      'noviembre',
      'diciembre'
    ]

    const nombreMes: string = nombresMeses[mes - 1]

    return `${dia} de ${nombreMes}`
  }

  function agregarCeroAlInicio (numero: number): string {
    return numero < 10 ? '0' + String(numero) : numero.toString()
  }

  function obtenerFechaActual (): string {
    const fechaActual: Date = new Date()
    const año: number = fechaActual.getFullYear()
    const mes: string = agregarCeroAlInicio(fechaActual.getMonth() + 1)
    const dia: string = agregarCeroAlInicio(fechaActual.getDate())
    const fechaFormateada: string = `${año}-${mes}-${dia}`
    return fechaFormateada
  }

  const addSeguimiento = (proceso: Proceso): void => {
    Swal.fire({
      title: `¿Estas marcar el ° ${proceso.nombre ?? ''} como completado?`,
      html: 'Ya no se podra revertir esta Accion',
      showDenyButton: true,
      confirmButtonText: 'Confirmar',
      denyButtonText: 'Cancelar'
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        const updatedProceso = {
          ...proceso,
          fecha: format(new Date(), 'dd/MM/yyyy')
        }
        setseguimientoRegistrado((prevProcesos: any) => {
          const updatedArray = [...prevProcesos, updatedProceso]
          actualizarSeguimientoBD(updatedArray)
          return updatedArray
        })
      }
    })
  }

  const calcularTiempoRestante = (numeroMeses: any, fecha: any): any => {
    if (fecha) {
      const fechaParsed = parse(fecha, 'dd/MM/yyyy', new Date())
      const fechaFutura = addMonths(fechaParsed, numeroMeses)
      const diferenciaDias = differenceInDays(fechaFutura, new Date())
      return diferenciaDias
    }
    return 0
  }

  const procesosWeb: Proceso[] = [
    {
      nombre: 'Brief',
      fecha: 'Sin fecha',
      icono: 'br'
    },
    {
      nombre: 'Diseño',
      fecha: 'Sin fecha',
      icono: 'br'
    },
    {
      nombre: '1° Avance',
      fecha: 'Sin fecha',
      icono: 'av'
    },
    {
      nombre: '2° Avance',
      fecha: 'Sin fecha',
      icono: 'av'
    },
    {
      nombre: '3° Avance',
      fecha: 'Sin fecha',
      icono: 'av'
    },
    {
      nombre: 'Capacitación',
      fecha: 'Sin fecha',
      icono: 'cap'
    },
    {
      nombre: 'Dominio',
      fecha: 'Sin fecha',
      icono: 'dom'
    },
    {
      nombre: 'Manuales de uso',
      fecha: 'Sin fecha',
      icono: 'fin'
    },
    {
      nombre: 'Finalizado',
      fecha: 'Sin fecha',
      icono: 'fin'
    }

    // Otros procesos...
  ]

  const configCorreos: Proceso[] = [
    {
      nombre: 'Manuales de uso',
      fecha: 'Sin fecha',
      icono: 'fin'
    }
  ]

  const procesosMantenimientoWeb: Proceso[] = [
    {
      nombre: 'Capacitación',
      fecha: 'Sin fecha',
      icono: 'cap'
    },
    {
      nombre: 'Manuales de uso',
      fecha: 'Sin fecha',
      icono: 'fin'
    },
    {
      nombre: 'Finalizado',
      fecha: 'Sin fecha',
      icono: 'fin'
    }
  ]

  const addProcess = (proceso: Proceso): void => {
    proceso.fecha = obtenerFechaActual().toString()
    const procesoExiste = dataUpdatedWeb.procesos.some(
      (p: any) => p.nombre === proceso.nombre
    )
    if (procesoExiste) {
      dataUpdatedWeb.procesos = dataUpdatedWeb.procesos.filter(
        (p: any) => p.nombre !== proceso.nombre
      )
    } else {
      dataUpdatedWeb.procesos = [...dataUpdatedWeb.procesos, proceso]
    }
    SaveContrato()
  }

  const SaveContrato = async (): Promise<void> => {
    setLoading(true)
    const token = localStorage.getItem('token')
    const data = new FormData()
    data.append('data_web', JSON.stringify(dataUpdatedWeb))
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/updateDataWeb/${id ?? ''}`,
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
        Swal.fire('Actualización exitosa', '', 'success')
        getOneBrief()
        setOpenModalProcess(false)
      } else {
        Swal.fire('Error al actualizar', '', 'error')
      }
    } catch (error: unknown) {
      Swal.fire('Error', '', 'error')
    } finally {
      setLoading(false)
    }
  }

  const SaveContrato2 = async (dataUpdatedWeb: any): Promise<void> => {
    setLoading(true)
    const token = localStorage.getItem('token')
    const data = new FormData()
    data.append('data_web', JSON.stringify(dataUpdatedWeb))
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/updateDataWeb/${id ?? ''}`,
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
        Swal.fire('Actualización exitosa', '', 'success')
        getOneBrief()
      } else {
        Swal.fire('Error al actualizar', '', 'error')
      }
    } catch (error: unknown) {
      Swal.fire('Error', '', 'error')
    } finally {
      setLoading(false)
    }
  }

  const deleteProcess = (nombreProceso: string): void => {
    dataUpdatedWeb.procesos = dataUpdatedWeb.procesos.filter(
      (p: any) => p.nombre !== nombreProceso
    )
    SaveContrato()
  }

  const handleClick = (): void => {
    const updatedData = {
      ...dataUpdatedWeb,
      id_hosting: ''
    }
    SaveContrato2(updatedData)
  }

  return (
    <>
      <form className="mt-5" onSubmit={handleSubmit}>
        {/* {datos?.id_contrato.split('_')[0] != 'LPCONC' && */}
        <section
          className={cn(
            'w-full grid grid-cols1  items-center h-full gap-6 mb-4',
            dataUpdatedWeb?.arrayCorreos &&
              dataUpdatedWeb?.arrayCorreos.length > 0
              ? 'lg:grid-cols-6'
              : 'lg:grid-cols-5'
          )}
        >
          <div className="w-full shadow_desarrollo bg_svg_secondary group col-span-2 h-full justify-center relative rounded-2xl p-6 flex flex-col ">
            <FaRegEdit
              onClick={() => {
                setOpenEdit(!openEdit)
              }}
              className="text-main text-3xl absolute top-2 right-2 hover:text-main_dark cursor-pointer group-hover:opacity-100 opacity-0 transition-all"
            />
            <div className="flex justify-between text-white w-full mb-3">
              <div className="font-bold text-xl uppercase underline">
                COLABORADORES A CARGO
              </div>
            </div>
            <div className="flex gap-0 flex-col mt-3 mb-6">
              {colaborador?.map((asignacion: any, index: number) => {
                const assignedCollaborators = colaboradores
                  .filter(
                    (colaborador: { id: number, name: string }) =>
                      colaborador.id == asignacion.peso &&
                      colaborador.name != null
                  )
                  .map((colaborador: { name: string }) => colaborador.name)
                return (
                  <Fragment key={index}>
                    {assignedCollaborators.length > 0 && (
                      <span className="text-white text-lg font-bold">
                        * {assignedCollaborators.join(', ')}
                      </span>
                    )}
                  </Fragment>
                )
              })}
            </div>
            <div className="flex gap-3 flex-col justify-center">
              <span className="text-white font-bold flex gap-3">
                Fecha de Alta:
                <span className="text-yellow-500 font-medium">
                  {datos.fecha_alta}
                </span>
              </span>
              <span className="text-white font-bold flex gap-3">
                Fecha de Inicio:
                <span className="text-green-400 font-medium">
                  {datos.fecha_inicio}
                </span>
              </span>
              <span className="text-white font-bold flex gap-3">
                Fecha final:
                <span className="text-red-500 font-medium">
                  {datos.fecha_fin}
                </span>
              </span>
            </div>
          </div>
          <div className="w-full shadow_desarrollo bg_svg_secondary col-span-2 rounded-2xl h-full p-6 justify-center flex flex-col space-y-5">
            <div className="flex justify-between text-white w-full">
              <div className="font-bold uppercase text-xl underline">
                {datos.id_contrato.includes('LPTV') && 'Tienda virtual'}
                {datos.id_contrato.includes('LPSEO') && 'SEO'}
                {datos.id_contrato.includes('LPLANDING') && 'Landingpage'}
                {datos.id_contrato.includes('LPHOSTING') && 'HOSTING'}
                {datos?.id_contrato.split('_')[0] === 'LPWA' &&
                  'Web Administrable'}
                {datos?.id_contrato.split('_')[0] === 'LPW' &&
                  'Web Informativa'}
                {datos?.id_contrato.split('_')[0] === 'LPWM' &&
                  'Web ADMINISTRABLE A MEDIDA'}
                {datos?.id_contrato.split('_')[0] === 'LPSISTEMA' &&
                  'SISTEMA WEB'}
                {datos?.id_contrato.split('_')[0] === 'LPCONC' &&
                  'CONFIGURACIÓN DE CORREOS'}
                {datos?.id_contrato.split('_')[0] === 'LPMGDOM' &&
                  'MIGRACIÓN DE DOMINIO'}
                {(datos?.id_contrato.split('_')[0].includes('LPACTW') ||
              datos?.id_contrato.split('_')[0].includes('LPACTWE')) &&
                  'ACTUALIZACIÓN WEB'}
              </div>
            </div>
            <div className="h-full flex gap-3 items-center">
              <div className="flex flex-col">
                <a
                  href={dataUpdatedWeb?.dominio}
                  target="_blank"
                  rel="noreferrer"
                  className="text-white font-medium"
                >
                  {limpiarDominio(dataUpdatedWeb?.dominio)}
                </a>
                <span className="text-gray-300 text-sm">Dominio actual</span>
              </div>
            </div>
            {dataUpdatedWeb?.cant_correos &&
                <div className="h-full flex gap-3 items-center">
                <div className="flex flex-col">
                    <span className="text-white font-medium">
                    {dataUpdatedWeb?.cant_correos} correos corporativos
                    </span>
                </div>
                </div>
            }
            <div className="flex gap-3 flex-col">
              <span className="text-yellow-500 font-bold ">
                Nombres:{' '}
                <span className="text-white">
                  {datos?.nombres} {datos?.apellidos}
                </span>
              </span>
              <span className="text-yellow-500 font-bold">
                Celular:{' '}
                <span className="lowercase text-white">{datos?.celular}</span>
              </span>
              <span className="text-yellow-500 font-bold">
                Email:{' '}
                <span className="lowercase text-white">{datos?.email}</span>
              </span>
            </div>
          </div>
          {dataUpdatedWeb?.arrayCorreos &&
            dataUpdatedWeb?.arrayCorreos.length > 0 && (
              <div className="w-full shadow_desarrollo bg_svg_secondary rounded-2xl pb-2 h-full justify-between flex flex-col space-y-2">
                <div className="flex justify-between px-6 pt-6 text-white w-full">
                  <div className="font-bold uppercase text-xl underline">
                    LISTA DE CORREOS
                  </div>
                </div>
                <div className="h-full flex flex-col px-4 scrolly_desarrollo gap-3 items-center max-h-[220px]  overflow-y-auto">
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
          )}
          {datos.categoria_plan == 'administrable' ||
          datos.categoria_plan == 'tienda' ||
          datos.categoria_plan == 'informativa' ||
          datos.categoria_plan == 'landing' ||
          datos?.id_contrato.split('_')[0].includes('LPACTW') ||
          datos?.id_contrato.split('_')[0].includes('LPACTWE') ? (
            <div className="shadow_desarrollo bg_svg_secondary h-full rounded-xl flex px-6 py-8 pb-4 flex-col justify-center items-center">
              <div className="relative">
                <div
                  className={`w-20 h-20 rounded-full bg_neu relative ${
                    Number(dataUpdatedWeb?.porcentaje_proyecto) == 100
                      ? 'bg-complete-view'
                      : ''
                  } shadow-lg`}
                >
                  <div className="absolute rounded-full inset-0 m-auto w-full h-full "></div>
                  <div className="absolute inset-0 m-auto svg_porcentaje overflow-hidden">
                    <motion.svg
                      className="w-full h-full"
                      viewBox="0 0 120 120"
                      initial={false}
                      animate={fillAnimation}
                    >
                      <motion.path
                        fill="none"
                        stroke={`${
                          Number(dataUpdatedWeb?.porcentaje_proyecto) === 100
                            ? '#38e36b'
                            : '#09C08F'
                        }`}
                        strokeWidth="10"
                        strokeLinecap="round"
                        d={`M 60,10 A 50,50 0 ${
                          dataUpdatedWeb?.porcentaje_proyecto <= 50 ? 0 : 1
                        } 1 ${calculateX(
                          dataUpdatedWeb?.porcentaje_proyecto
                        )},${calculateY(dataUpdatedWeb?.porcentaje_proyecto)}`}
                      />
                    </motion.svg>
                  </div>
                  <div className="absolute inset-0 flex justify-center items-center text-lg font-bold text-gray-800">
                    <input
                      value={`${dataUpdatedWeb?.porcentaje_proyecto}`}
                      disabled
                      className={`text-right outline-none bg-transparent w-[40px] ${
                        Number(dataUpdatedWeb?.porcentaje_proyecto) === 100
                          ? 'text-white'
                          : 'text-[#09C08F]'
                      } `}
                    />{' '}
                    <span
                      className={`${
                        Number(dataUpdatedWeb?.porcentaje_proyecto) === 100
                          ? 'text-white'
                          : 'text-[#09C08F]'
                      }`}
                    >
                      %
                    </span>
                  </div>
                </div>
              </div>
              <span className="block mt-5 text-white font-bold">
                {Number(dataUpdatedWeb?.porcentaje_proyecto) === 100
                  ? 'Proyecto terminado'
                  : 'Porcentaje del proyecto'}
              </span>
            </div>
              ) : (
            <div className="flex flex-col gap-4 h-full justify-between">
              <div className="w-full shadow_desarrollo degraded_main relative rounded-2xl h-full px-6 py-4 flex flex-col space-y-3">
              {oneHost && dataUpdatedWeb.id_hosting != ''
                ? <RiCloseCircleFill className='absolute top-2 right-2 text-xl cursor-pointer'
                     onClick={handleClick}
                 />
                : <FaCirclePlus className='absolute top-2 right-2 text-xl cursor-pointer'
                        onClick={() => { setOpenListHosting(true) }}
                    />
                }
                <div className="flex gap-3 items-center text-white w-full relative">
                  <MdOutlineStorage className="text-4xl bg-white rounded-full p-2 text-[#3c70a6]" />
                  <div className="font-medium text-xl">Hosting</div>
                </div>
                <div className="h-full flex gap-3 items-center">
                  <div className="flex flex-col w-full">
                    <div className="flex gap-3 items-center text-white w-full">
                      <BiRename className="text-4xl opacity-0 bg-white rounded-full p-2 text-[#3c70a6]" />
                      <div className="text-lg">
                        {dataUpdatedWeb?.hosting_owner ?? ''}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full shadow_desarrollo degraded_main rounded-2xl h-full px-6 py-4 flex flex-col space-y-3">
                <div className="flex gap-3 items-center text-white w-full">
                  <MdOutlineStorage className="text-4xl bg-white rounded-full p-2 text-[#3c70a6]" />
                  <div className="font-medium text-xl">Dominio</div>
                </div>
                <div className="h-full flex gap-3 items-center">
                  <div className="flex flex-col w-full">
                    <div className="flex gap-3 items-center text-white w-full">
                      <BiRename className="text-4xl opacity-0 bg-white rounded-full p-2 text-[#3c70a6]" />
                      <div className="text-lg">
                        {dataUpdatedWeb?.domain_owner ?? ''}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
              )}
        </section>
        {(datos.categoria_plan == 'administrable' ||
          datos.categoria_plan == 'tienda' ||
          datos.categoria_plan == 'informativa' ||
          datos.categoria_plan == 'landing' ||
          datos?.id_contrato.split('_')[0].includes('LPACTW') ||
          datos?.id_contrato.split('_')[0].includes('LPACTWE')) && (
          <>
            <section
              className={cn(
                'grid grid-cols-1  gap-2 lg:gap-6 mb-4',
                datos.categoria_plan == 'administrable' ||
                  datos.categoria_plan == 'tienda'
                  ? 'lg:grid-cols-6'
                  : datos?.id_contrato.split('_')[0].includes('LPACTW') ||
                  datos?.id_contrato.split('_')[0].includes('LPACTWE')
                    ? 'lg:grid-cols-4'
                    : 'lg:grid-cols-5'
              )}
            >
              <div className="w-full shadow_desarrollo degraded_main rounded-2xl h-full px-6 py-4 flex flex-col space-y-3">
                <div className="flex gap-3 items-center text-white w-full">
                  <MdOutlineStorage className="text-4xl bg-white rounded-full p-2 text-[#3c70a6]" />
                  <div className="font-medium text-xl">Dominio</div>
                </div>
                <div className="h-full flex gap-3 items-center">
                  <div className="flex flex-col w-full">
                    <div className="flex gap-3 items-center text-white w-full">
                      <BiRename className="text-4xl opacity-0 bg-white rounded-full p-2 text-[#3c70a6]" />
                      <div className="text-lg">
                        {dataUpdatedWeb?.domain_owner ?? ''}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full relative shadow_desarrollo degraded_main rounded-2xl h-full px-6 py-4 flex flex-col space-y-3">
                {oneHost && dataUpdatedWeb.id_hosting != ''
                  ? <RiCloseCircleFill className='absolute top-2 right-2 text-xl cursor-pointer'
                     onClick={handleClick}
                 />
                  : <FaCirclePlus className='absolute top-2 right-2 text-xl cursor-pointer'
                        onClick={() => { setOpenListHosting(true) }}
                    />
                }
                <div className="flex gap-3 items-center text-white w-full relative">
                  <MdOutlineStorage className="text-4xl bg-white rounded-full p-2 text-[#3c70a6]" />
                  <div className="font-medium text-xl">Hosting</div>
                </div>
                <div className="h-full flex gap-3 items-center">
                  <div className="flex flex-col w-full">
                    <div className="flex gap-3 items-center text-white w-full">
                      <BiRename className="text-4xl opacity-0 bg-white rounded-full p-2 text-[#3c70a6]" />
                      <div className="text-lg">
                        {dataUpdatedWeb?.hosting_owner ?? ''}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {datos?.id_contrato.split('_')[0].includes('LPACTW') ||
              datos?.id_contrato.split('_')[0].includes('LPACTWE') ? null : (
                <div className="w-full shadow_desarrollo degraded_main rounded-2xl h-full px-6 py-4 flex flex-col space-y-3">
                  <div className="flex gap-3 items-center text-white w-full">
                    <MdOutlineStorage className="text-4xl bg-white rounded-full p-2 text-[#3c70a6]" />
                    <div className="font-medium text-xl">Internas</div>
                  </div>
                  <div className="flex gap-3 items-center h-full">
                    <div className="flex flex-col w-full">
                      <div className="flex gap-3 items-center text-white w-full">
                        <BiRename className="text-4xl opacity-0 bg-white rounded-full p-2 text-[#3c70a6]" />
                        <div className="text-lg">
                          {dataUpdatedWeb?.internas ?? ''}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                )}
              {(datos.categoria_plan == 'administrable' ||
                datos.categoria_plan == 'tienda') && (
                <div className="w-full shadow_desarrollo degraded_main rounded-2xl h-full px-6 py-4 flex flex-col space-y-3">
                  <div className="flex gap-3 items-center text-white w-full">
                    <MdOutlineStorage className="text-4xl bg-white rounded-full p-2 text-[#3c70a6]" />
                    <div className="font-medium text-xl line-clamp-1">
                      Modulos Adm.
                    </div>
                  </div>
                  <div className="h-full flex gap-3 items-center">
                    <div className="flex flex-col w-full">
                      <div className="flex gap-3 items-center text-white w-full">
                        <BiRename className="text-4xl opacity-0 bg-white rounded-full p-2 text-[#3c70a6]" />
                        <div className="text-lg">
                          {dataUpdatedWeb?.modulos ?? ''}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              <div className="w-full shadow_desarrollo degraded_main rounded-2xl h-full px-6 py-4 flex flex-col space-y-3">
                <div className="flex gap-3 items-center text-white w-full">
                  <MdOutlineStorage className="text-4xl bg-white rounded-full p-2 text-[#3c70a6]" />
                  <div className="font-medium text-xl">V. PHP</div>
                </div>
                <div className="h-full flex gap-3 items-center">
                  <div className="flex flex-col w-full">
                    <div className="flex gap-3 items-center text-white w-full">
                      <BiRename className="text-4xl opacity-0 bg-white rounded-full p-2 text-[#3c70a6]" />
                      <div className="text-lg">{dataUpdatedWeb?.php ?? ''}</div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-full shadow_desarrollo degraded_main rounded-2xl h-full px-6 py-4 flex flex-col space-y-3">
                <div className="flex gap-3 items-center text-white w-full">
                  <MdOutlineStorage className="text-4xl bg-white rounded-full p-2 text-[#3c70a6]" />
                  <div className="font-medium text-xl">V. REACT</div>
                </div>
                <div className="h-full flex gap-3 items-center">
                  <div className="flex flex-col w-full">
                    <div className="flex gap-3 items-center text-white w-full">
                      <BiRename className="text-4xl opacity-0 bg-white rounded-full p-2 text-[#3c70a6]" />
                      <div className="text-lg">
                        {dataUpdatedWeb?.react ?? ''}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
            {oneHost && dataUpdatedWeb.id_hosting != '' &&
                <section
                className={cn(
                  'grid  gap-2 lg:gap-6 my-4 grid-cols-4')}
                >
                <div className="w-full shadow_desarrollo degraded_main rounded-2xl h-full px-6 py-4 flex flex-col space-y-3">
                    <div className="flex gap-3 items-center text-white w-full">
                    <MdOutlineStorage className="text-4xl bg-white rounded-full p-2 text-[#3c70a6]" />
                    <div className="font-medium text-xl">Espacio</div>
                    </div>
                    <div className="h-full flex gap-3 items-center">
                    <div className="flex flex-col w-full">
                        <div className="flex gap-3 items-center text-white w-full">
                        <BiRename className="text-4xl opacity-0 bg-white rounded-full p-2 text-[#3c70a6]" />
                        <div className="text-lg">
                            {JSON.parse(oneHost.hosting).plan ?? ''}
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="w-full shadow_desarrollo degraded_main rounded-2xl h-full px-6 py-4 flex flex-col space-y-3">
                    <div className="flex gap-3 items-center text-white w-full">
                    <MdOutlineStorage className="text-4xl bg-white rounded-full p-2 text-[#3c70a6]" />
                    <div className="font-medium text-xl">Tipo de servicio</div>
                    </div>
                    <div className="h-full flex gap-3 items-center">
                    <div className="flex flex-col w-full">
                        <div className="flex gap-3 items-center text-white w-full">
                        <BiRename className="text-4xl opacity-0 bg-white rounded-full p-2 text-[#3c70a6]" />
                        <div className="text-lg">
                            {JSON.parse(oneHost.hosting).tiposervicio ?? ''}
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="w-full shadow_desarrollo degraded_main rounded-2xl h-full px-6 py-4 flex flex-col space-y-3">
                    <div className="flex gap-3 items-center text-white w-full">
                    <MdOutlineStorage className="text-4xl bg-white rounded-full p-2 text-[#3c70a6]" />
                    <div className="font-medium text-xl">Estado</div>
                    </div>
                    <div className="h-full flex gap-3 items-center">
                    <div className="flex flex-col w-full">
                        <div className="flex gap-3 items-center text-white w-full">
                        <BiRename className="text-4xl opacity-0 bg-white rounded-full p-2 text-[#3c70a6]" />
                        <div className="text-lg">
                            {oneHost.activehosting == 1 ? 'Activo' : 'Inactivo'}
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                <div className="w-full shadow_desarrollo degraded_main rounded-2xl h-full px-6 py-4 flex flex-col space-y-3">
                    <div className="flex gap-3 items-center text-white w-full">
                    <MdOutlineStorage className="text-4xl bg-white rounded-full p-2 text-[#3c70a6]" />
                    <div className="font-medium text-xl">Inicio de hosting</div>
                    </div>
                    <div className="h-full flex gap-3 items-center">
                    <div className="flex flex-col w-full">
                        <div className="flex gap-3 items-center text-white w-full">
                        <BiRename className="text-4xl opacity-0 bg-white rounded-full p-2 text-[#3c70a6]" />
                        <div className="text-lg">
                            {JSON.parse(oneHost.hosting).inicio ?? ''}
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
                </section>
            }
            <div
              className={cn(
                'grid gap-4',
                datos.categoria_plan == 'tienda '
                  ? 'grid-cols-2 '
                  : 'grid-cols-1'
              )}
            >
              {datos.categoria_plan == 'tienda ' && (
                <div className="w-full shadow_desarrollo degraded_main rounded-2xl h-full px-6 py-3 flex flex-col ">
                  <div className="flex gap-3 items-center text-white w-full pt-3">
                    <MdOutlineStorage className="text-4xl bg-white rounded-full p-2 text-[#3c70a6]" />
                    <div className="font-medium text-xl">Pasarela de pago</div>
                  </div>
                  <div className="h-full flex gap-3 items-center justify-center mb-3">
                    <div className="flex flex-col w-full">
                      <div className="flex gap-3 items-center text-white w-full">
                        <div className="text-lg w-full text-center">
                          {dataUpdatedWeb?.pasarela}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}
              {datos?.id_contrato.split('_')[0].includes('LPACTW') ||
              datos?.id_contrato.split('_')[0].includes('LPACTWE') ? null : (
                <div className="w-full shadow_desarrollo degraded_main rounded-2xl h-full px-6 py-3 flex flex-col ">
                  <div className="flex gap-3 items-center text-white w-full pt-3">
                    <MdOutlineStorage className="text-4xl bg-white rounded-full p-2 text-[#3c70a6]" />
                    <div className="font-medium text-xl">Soporte tecnico</div>
                  </div>
                  <div className="h-full flex gap-3 items-center justify-center mb-3">
                    <div className="flex flex-col w-full">
                      <div className="flex gap-3 items-center text-white w-full">
                        <div className="text-lg w-full text-center">
                          {calcularTiempoRestante(
                            dataUpdatedWeb.soporte,
                            datos?.fecha_fin
                          ) > 0
                            ? `${calcularTiempoRestante(
                                dataUpdatedWeb.soporte,
                                datos?.fecha_fin
                              )} dias restantes`
                            : 'SIN SOPORTE TECNICO'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                )}
            </div>

            {oneHost && dataUpdatedWeb.id_hosting && oneHost.soporte && JSON.parse(oneHost.soporte).length > 0 && (
                <SoporteHosting2 datos2={JSON.parse(oneHost.soporte)} setOpenVista={setOpenVista}/>
            )}

            <div className="flex flex-col md:flex-row gap-2 justify-between">
              <div className="bg-white p-4 px-4 rounded-xl mt-3 lg:mt-6 w-full md:w-[68%] min-h-[150px] relative">
                <h5 className="text-[#202020] font-bold text-xl">
                  Procesos completados
                </h5>
                {dataUpdatedWeb?.procesos.length > 0 &&
                  datos?.fecha_fin == null && (
                    <button
                      type="button"
                      onClick={() => {
                        setOpenModalProcess(!openModalProcess)
                      }}
                      className="absolute top-2 right-2 rounded-full bg-red-600 w-[25px] h-[25px] flex items-center justify-center font-bold text-xl"
                    >
                      <TiPlus />
                    </button>
                )}
                {dataUpdatedWeb?.procesos.length === 0 ? (
                  <button
                    type="button"
                    onClick={() => {
                    //   if (datos?.fecha_fin == null) {
                      setOpenModalProcess(!openModalProcess)
                    //   }
                    }}
                    className={`absolute inset-0 m-auto w-fit h-fit bg-secundario ${
                      datos?.fecha_fin == null ? 'opacity-100' : 'opacity-80'
                    } rounded-lg py-2 px-8 text-white text-center transition-all active:scale-90`}
                  >
                    Agregar procesos
                  </button>
                ) : (
                  <Swiper
                    slidesPerView={
                      dataUpdatedWeb?.procesos.length < 5
                        ? dataUpdatedWeb?.procesos.length
                        : 5
                    }
                    className="h-[80%] swp_procesos"
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
                        slidesPerView: 4
                      },
                      1600: {
                        slidesPerView:
                          dataUpdatedWeb?.procesos.length < 5
                            ? dataUpdatedWeb?.procesos.length
                            : 5
                      }
                    }}
                  >
                    {dataUpdatedWeb?.procesos.map(
                      (proceso: any, index: number) => (
                        <SwiperSlide key={index}>
                          <div
                            className=" w-full shadow-lg h-fit flex items-center gap-4 p-4 rounded-xl group"
                            key={index}
                          >
                            <div className="flex items-center justify-between gap-2">
                              <span
                                className={`style_icon p-2 border border-main  transition-all duration-200 flex rounded-full ${
                                  proceso.fecha !== 'Sin fecha' ? 'bg-main' : ''
                                }`}
                              >
                                {proceso.fecha !== 'Sin fecha' ? (
                                  <PiCheck className="text-white  text-3xl transition-all duration-200" />
                                ) : (
                                  <>
                                    {proceso.icono === 'br' && (
                                      <CiViewTimeline className="text-main" />
                                    )}
                                    {proceso.icono === 'av' && (
                                      <CiPaperplane className="text-main" />
                                    )}
                                    {proceso.icono === 'cap' && (
                                      <CiMonitor className="text-main" />
                                    )}
                                    {proceso.icono === 'dom' && (
                                      <CiGlobe className="text-main" />
                                    )}
                                    {proceso.icono === 'fin' && (
                                      <CiCircleCheck className="text-main" />
                                    )}
                                  </>
                                )}
                              </span>
                              <span>
                                <h5 className="text-[#252525] select-none line-clamp-1 text-lg font-[500]">
                                  {proceso.nombre}
                                </h5>
                                <div className="flex gap-1">
                                  <p className="text-[13px] select-none italic text-[#606060] line-clamp-1">
                                    {obtenerDiaMes(proceso.fecha)}
                                  </p>
                                  <TiDelete
                                    onClick={() => {
                                      deleteProcess(proceso.nombre)
                                    }}
                                    className="hidden group-hover:block text-red-600 hover:text-red-800 transition-colors cursor-pointer text-xl"
                                  />
                                </div>
                              </span>
                            </div>
                          </div>
                        </SwiperSlide>
                      )
                    )}
                  </Swiper>
                )}
              </div>
              <div className="w-full md:w-[32%] mt-3 lg:mt-6 rounded-xl bg_web_client p-4">
                <div className="flex gap-1 relative justify-between items-start">
                  <div className="w-full md:w-[50%]">
                    <h6 className="block text-center text-white font-[500] text-2xl mt-7">
                      {datos.nombre_marca}
                    </h6>
                    <a
                      href={`${
                        datos.id_contrato.includes('LPSEO')
                          ? `https://www.google.com/search?q=${dataUpdatedWeb?.domain_temp}`
                          : dataUpdatedWeb?.dominio
                          ? dataUpdatedWeb?.dominio
                          : dataUpdatedWeb?.domain_temp
                      } `}
                      target="_blank"
                      className="btn_vieweb w-fit bg-white relative rounded-full flex items-center gap-2 px-6 py-2 text-center text-black mt-5 mx-auto"
                      rel="noreferrer"
                    >
                      <TfiWorld className="text-main" />
                      {datos.id_contrato.includes('LPSEO')
                        ? 'Ver indexación'
                        : ' Ver web'}
                    </a>
                  </div>
                  <div className="w-[50%]">
                    <img
                      src={vieweb}
                      alt=""
                      className="w-[73%] block mx-auto  imgViewWeb"
                    />
                  </div>
                </div>
              </div>
            </div>

          </>
        )}

        {datos?.fecha_fin != null &&
          (datos?.id_contrato.split('_')[0] == 'LPTV' ||
            datos?.id_contrato.split('_')[0] == 'LPTVE' ||
            datos?.id_contrato.split('_')[0] == 'LPTVS' ||
            datos?.id_contrato.split('_')[0] == 'LPTVG' ||
            datos?.id_contrato.split('_')[0] == 'LPWA' ||
            datos?.id_contrato.split('_')[0] == 'LPW' ||
            datos?.id_contrato.split('_')[0] == 'LPMC' ||
            datos?.id_contrato.split('_')[0] == 'LPLANDING-ADM' ||
            datos?.id_contrato.split('_')[0] == 'LPLANDING' ||
            datos?.id_contrato.split('_')[0] == 'LPLANDING-TV') && (
            <div className="w-full relative mt-4 rounded-2xl overflow-hidden px-3 md:px-6 py-3 bg-white">
              <h5 className="text-[#202020] font-bold text-xl">
                Seguimiento de servicio
              </h5>
              <Swiper
                breakpoints={{
                  0: {
                    slidesPerView: 3
                  },
                  576: {
                    slidesPerView: 5
                  },
                  700: {
                    slidesPerView: 6
                  },
                  1200: {
                    slidesPerView: 10
                  },
                  1600: {
                    slidesPerView: 12
                  }
                }}
                pagination={{
                  dynamicBullets: true
                }}
                modules={[Pagination]}
                className="w-full py-4"
              >
                {mantenimientoWeb.map((web: any, index: number) => {
                  const matchedProceso = seguimientoRegistrado.find(
                    (p: any) => p.nombre == web.nombre
                  )
                  return (
                    <SwiperSlide key={index} className="overflow-hidden">
                      <div
                        key={index}
                        className="flex flex-col items-center justify-start"
                      >
                        <button
                          onClick={() => {
                            addSeguimiento(web)
                          }}
                          type="button"
                          className={cn(
                            'shadow rounded-full p-2 flex items-center border border-main justify-center text-main hover:scale-105 transition-all',
                            matchedProceso
                              ? 'bg-main text-white'
                              : 'text-main  bg-transparent'
                          )}
                        >
                          <IoExtensionPuzzleOutline className="text-3xl" />
                        </button>
                        <p className="text-[#202020] text-sm">{web?.nombre}</p>
                        {seguimientoRegistrado.filter(
                          (p: any) => p.nombre == web.nombre
                        ).length > 0 && (
                          <p className="text-[#202020] text-xs">
                            {matchedProceso?.fecha ?? ''}
                          </p>
                        )}
                      </div>
                    </SwiperSlide>
                  )
                })}
              </Swiper>
            </div>
        )}

        <div className="bg-white p-4 rounded-xl mt-6">
          <ArchivosFinales
            datos={datos}
            getOneBrief={getOneBrief}
            values={values}
            pdfName={pdfName}
            setpdfName={setpdfName}
            fechaCreacion={fechaCreacion}
            limite={limite}
            plan={plan}
            validateBrief={validateBrief}
          />
        </div>

        <div className="bg-white p-4 rounded-xl mt-6">
          <div className="w-full flex flex-col justify-start md:items-start gap-y-2 relative">
            <div className="flex flex-col gap-2 mb-3 ">
              <h2 className="text-xl lg:text-2xl font-bold text-black ">
                Seguimiento del proyecto
              </h2>
            </div>
            <span
              className="w-fit px-4 py-2 bg-main text-white font-semibold rounded-xl absolute right-2 flex gap-2 items-center cursor-pointer transition-all active:scale-90"
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
            <section className="w-full pt-6">
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
          <div className="text-black mb-4">
            <label
              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="email"
            >
              PUNTUACION DEL CLIENTE
            </label>
            <select
              className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
              name="puntuacion"
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
            <Errors errors={errors.puntuacion} touched={touched.puntuacion} />
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
      </form>
      {openEdit && (
        <ModalEditDesarrolloWeb
          getOneBrief={getOneBrief}
          open={openEdit}
          setOpen={setOpenEdit}
          dataUpdatedWeb={dataUpdatedWeb}
          datos={datos}
        />
      )}
      {openModalProcess && (
        <div
          onClick={() => {
            setOpenModalProcess(false)
          }}
          className="fixed top-0 left-0 w-full h-full bg-black/50 flex items-center justify-center z-[990]"
        >
          <div className="bg-white rounded-lg shadow-md w-full h-fit max-w-[500px] relative z-[10] p-10">
            <h5 className="text-center text-[#252525] text-xl mb-6">
              Selecciona los procesos
            </h5>
            {datos?.id_contrato.split('_')[0].includes('LPACTW') ||
              datos?.id_contrato.split('_')[0].includes('LPACTWE')
              ? <div className="flex flex-col gap-2">
                {procesosMantenimientoWeb.map((proceso, index) => (
                  <button
                    type="button"
                    key={index}
                    className={`
                       border border-[#cecece] shadow-sm rounded-lg py-1 px-4 text-center text-[#252525] 
                       ${
                         dataUpdatedWeb?.procesos.some(
                           (p: any) => p.nombre == proceso.nombre
                         )
                           ? ' border_selected_proceso'
                           : ''
                       }
                     `}
                    onClick={() => {
                      addProcess(proceso)
                    }}
                  >
                    {proceso.nombre}
                  </button>
                ))}
              </div>
              : datos?.id_contrato.split('_')[0] == 'LPCONC' ? (
              <div className="flex flex-col gap-2">
                {configCorreos.map((proceso, index) => (
                  <button
                    type="button"
                    key={index}
                    className={`
                       border border-[#cecece] shadow-sm rounded-lg py-1 px-4 text-center text-[#252525] 
                       ${
                         dataUpdatedWeb?.procesos.some(
                           (p: any) => p.nombre == proceso.nombre
                         )
                           ? ' border_selected_proceso'
                           : ''
                       }
                     `}
                    onClick={() => {
                      addProcess(proceso)
                    }}
                  >
                    {proceso.nombre}
                  </button>
                ))}
              </div>
              ) : (
              <div className="flex flex-col gap-2">
                {procesosWeb.map((proceso, index) => (
                  <button
                    type="button"
                    key={index}
                    className={`
                        border border-[#cecece] shadow-sm rounded-lg py-1 px-4 text-center text-[#252525] 
                        ${
                          dataUpdatedWeb?.procesos.some(
                            (p: any) => p.nombre == proceso.nombre
                          )
                            ? ' border_selected_proceso'
                            : ''
                        }
                      `}
                    onClick={() => {
                      addProcess(proceso)
                    }}
                  >
                    {proceso.nombre}
                  </button>
                ))}
              </div>
              )}
          </div>
        </div>
      )}
      <ModalViewSoporteHosting open={openVista} setOpen={setOpenVista} colaboradores={colaboradores}/>
      <ListaHosting open={openListHosting} setOpen={setOpenListHosting} SaveContrato2={SaveContrato2} dataUpdatedWeb={dataUpdatedWeb} />
    </>
  )
}
