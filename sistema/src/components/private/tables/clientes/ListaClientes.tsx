/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu'
import { RiFilter2Fill, RiSettings3Fill, RiFileExcel2Fill } from 'react-icons/ri'
import { Loading } from '../../../shared/Loading'
import { type ListcontactoClientes, type ValuesPlanes, type ValuesPreventaModificate } from '../../../shared/schemas/Interfaces'
import { Paginacion } from '../../../shared/Paginacion'
import { getDataToPlanes } from '../../../shared/FetchingData'
import { useFormik } from 'formik'
import { SchemaValidarVentas } from '../../../shared/schemas/Schemas'
import { quitarAcentos } from '../../../shared/functions/QuitarAcerntos'
import { GeneracionVentas } from './GeneracionVentas'
import { IoCalendarOutline } from 'react-icons/io5'
import { motion, AnimatePresence } from 'framer-motion'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { DeleteItemsNew } from '../../../shared/DeleteItemsNew'
import { GeneracionCorrelativo } from './contratos/GeneracionCorrelativo'
import { ModalPreviaCotizacion } from './cotizacion/ModalPreviaCotizacion'
import { VerComentarios } from './modals/VerComentarios'
import { RegistroCupones } from './cupones/RegistroCupones'

export const ListaClientes = (): JSX.Element => {
  const { setTitle } = useAuth()
  const [productos, setProductos] = useState<ValuesPreventaModificate[]>([])
  const [loading, setLoading] = useState(true)
  const [onWeb, setOnWeb] = useState(0)
  const [, setTotalRegistros] = useState(0)
  const [, setTotalRegistros2] = useState(0)
  const [paginaActual, setpaginaActual] = useState<number>(1)
  const [search, setSearch] = useState('')
  const [cantidadRegistros] = useState(18)
  const [expandedContact, setExpandedContact] = useState<number | null>(null)
  const [filters, setFilters] = useState({ filtro: '' })
  const [planes, setplanes] = useState<ValuesPlanes[]>([])
  const [openCotizacion, setOpenCotizacion] = useState(false)
  const [openContrato, setOpenContrato] = useState(false)
  const token = localStorage.getItem('token')
  const [usuarios, setUsuarios] = useState<never[]>([])
  const [openComentarios, setOpenComentarios] = useState<any | null>({
    open: false,
    comentario: null
  })

  const getUsuarios = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getUsuarios`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setUsuarios(request.data)
  }

  const handleClickOpen = (): void => {
    setOpen(true)
  }
  const [open, setOpen] = useState(false)

  const getClientes = async (texto: string): Promise<void> => {
    const request = await axios.get(`${Global.url}/${texto}`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setProductos(request.data)
    setTotalRegistros(request.data.length)
  }

  useEffect(() => {
    setTitle('Listado de clientes')
    Promise.all([getClientes('getClientes'), getDataToPlanes('getPlanes2', setplanes, setTotalRegistros2), getUsuarios()]).then(() => {
      setLoading(false)
    })
  }, [])

  const generarVenta = async (): Promise<void> => {}

  const { setValues, values } = useFormik({
    initialValues: {
      id: 0,
      medio_ingreso: '',
      nombre_empresa: '',
      plan: '',
      id_contrato: '',
      dni_ruc: '',
      nombre_cliente: '',
      arraycontacto: '',
      id_cliente: '',
      email: '',
      celular: '',
      sexo: ''
    },
    validationSchema: SchemaValidarVentas,
    onSubmit: generarVenta
  })

  const indexOfLastPost = paginaActual * cantidadRegistros
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros
  let totalPosts = productos.length

  const filterDate = (): ValuesPreventaModificate[] => {
    let filteredProductos = productos
    filteredProductos = filteredProductos.filter((user: any) => (onWeb == 1 ? user.registro == 1 : user.registro == 0))
    // Aplicar filtro según el tipo seleccionado
    if (filters.filtro === 'antiguo') {
      filteredProductos = filteredProductos.filter((pro) => pro.antiguo == '1')
    } else if (filters.filtro === 'nuevo') {
      filteredProductos = filteredProductos.filter((pro) => pro.antiguo == '0')
    }
    // Realizar búsqueda
    const searchTerm = quitarAcentos(search.toLowerCase())
    if (search.length > 0) {
      filteredProductos = filteredProductos.filter((pro) => {
        const fullName = `${pro.nombres} ${pro.apellidos}`.toLowerCase()
        const empresa = `${pro.empresa}`.toLowerCase()
        return (
          quitarAcentos(fullName).includes(searchTerm) ||
          quitarAcentos(empresa).includes(searchTerm) ||
          String(pro.id).includes(searchTerm) ||
          String(pro.celular).includes(searchTerm) ||
          String(pro.dni_ruc).includes(searchTerm)
        )
      })
    }
    totalPosts = filteredProductos.length
    return filteredProductos.slice(indexOfFirstPost, indexOfLastPost)
  }

  const onSeachChange = ({ target }: React.ChangeEvent<HTMLInputElement>): void => {
    setpaginaActual(1)
    setSearch(target.value)
  }

  const toggleFilter = (type: string): void => {
    setFilters({ filtro: type })
  }

  const exportExcel = (): void => {
    localStorage.setItem('TableCliente', JSON.stringify(productos))
    localStorage.setItem('filtro', filters.filtro)
    window.open('/admin/lista-clientes/status', '_blank')
  }

  const preguntar = (id: number | null): void => {
    DeleteItemsNew({
      ruta: 'deleteCliente',
      id,
      token,
      totalPosts,
      cantidadRegistros,
      paginaActual,
      setpaginaActual,
      rutaFetch: 'getClientes',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setData: setProductos,
      setTotalRegistros
    })
  }

  return (
    <>
      <div className="w-full flex flex-row items-center justify-between gap-y-4 gap-2 md:gap-0 mb-5" id="pdf-content">
        <div className="w-full flex justify-between flex-col md:flex-row gap-3 items-center">
          <div className="w-full md:w-fit flex gap-2 items-center h-fit">
            <button className="bg-white hover:bg-gray-100 w-full md:w-fit flex items-center text-black gap-2 py-2 px-4 rounded-lg hover:text-main transition-colors">
              <RiFilter2Fill />
              <input placeholder="Buscar ..." className="bg-transparent outline-none" value={search} onChange={onSeachChange} type="search" />
            </button>
            <Link to="/admin/citas">
              <IoCalendarOutline className="text-4xl text-main" title="Calendario de citas" />
            </Link>
          </div>
          <div className="w-full md:w-fit flex flex-col-reverse md:flex-row items-center md:gap-4">
            <div className="flex gap-3 flex-row-reverse md:flex-row w-full">
              <div className="flex gap-5 mt-2 items-center">
                <RiFileExcel2Fill
                  className="text-3xl text-green-700 cursor-pointer"
                  onClick={() => {
                    exportExcel()
                  }}
                />
              </div>
              <select
                name=""
                id=""
                value={onWeb}
                onChange={(e: any) => {
                  setOnWeb(e.target.value)
                }}
                className="px-4 text-black w-full md:w-fit mt-2 md:mt-0 py-2 shadow-md rounded-md select-none"
              >
                <option value="0" className="select-none">
                  Sistema
                </option>
                <option value="1" className="select-none">
                  Pag. Web
                </option>
              </select>
              <select
                name=""
                id=""
                value={filters.filtro}
                onChange={(e) => {
                  toggleFilter(e.target.value)
                }}
                className="px-4 text-black w-full md:w-fit mt-2 md:mt-0 py-2 shadow-md rounded-md select-none"
              >
                <option value="" className="select-none">
                  Todos
                </option>
                <option value="nuevo" className="select-none">
                  Nuevos
                </option>
                <option value="antiguo" className="select-none">
                  Antiguos
                </option>
              </select>
            </div>
            <Link
              to={'agregar'}
              className="w-full md:w-fit inline-block rounded bg-main md:px-6 pb-2 pt-2.5 text-center text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-main-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-main-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-main-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
            >
              REGISTRO
            </Link>
          </div>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className="md:bg-[#fff] p-0 md:p-8 rounded-xl">
          <div className="hidden md:grid grid-cols-1 md:grid-cols-9 gap-3 mb-2 md:px-4 md:py-2 text-gray-400 border-y border-gray-300">
            <h5 className="md:text-left line-clamp-1">ID</h5>
            <h5 className="md:text-left line-clamp-1 col-span-2">Cliente</h5>
            <h5 className="md:text-left line-clamp-1 ">Empresa</h5>
            <h5 className="md:text-left line-clamp-1 md:block">Celular</h5>
            <h5 className="md:text-left line-clamp-1 w-full">DNI/RUC</h5>
            <h5 className="md:text-left line-clamp-1 w-full">Medio de ingreso</h5>
            <h5 className="md:text-center line-clamp-1">Fecha de creación</h5>
            <h5 className="md:text-center line-clamp-1">Punt.</h5>
          </div>
          {filterDate().map((orden: ValuesPreventaModificate, index: number) => (
            <>
              <div
                className={`grid grid-cols-1 md:grid-cols-9 relative gap-3 items-center  mb-3 md:mb-0 ${
                  index % 2 == 0 ? 'bg-transparent' : 'bg-gray-200'
                } md:px-4 md:py-1 rounded-xl relative shadow_class`}
                key={orden.id}
              >
                <div className="flex flex-col gap-3 md:hidden bg-form p-4 rounded-xl">
                  <div className="flex md:hidden items-center gap-2">
                    <h5 className="md:hidden text-black font-bold mb-0 text-sm">ID:</h5>
                    <span className="flex md:justify-left items-center gap-3 font-bold text-black">#{orden.id}</span>
                    {orden.arraycontacto && JSON.parse(orden.arraycontacto).length > 0 && (
                      <div className="flex w-fit ">
                        <p
                          onClick={() => {
                            if (expandedContact == orden.id) {
                              setExpandedContact(null)
                            } else {
                              setExpandedContact(orden.id)
                            }
                          }}
                          className="text-sm text-blue-500 hover:underline cursor-pointer transition-all ml-4"
                        >
                          +{JSON.parse(orden.arraycontacto).length} contactos
                        </p>
                      </div>
                    )}
                  </div>
                  <div className="md:hidden flex justify-between gap-3">
                    <div className="md:text-center ">
                      <h5 className="md:hidden text-black font-bold mb-0 text-sm">Cliente</h5>
                      <span className="text-left w-full text-black line-clamp-1">
                        {orden.nombres} {orden.apellidos}
                      </span>
                    </div>
                    <div className="md:text-right ">
                      <h5 className="md:hidden text-black font-bold mb-0 text-sm bg text-right">Celular</h5>
                      <span className="text-right w-full text-black line-clamp-1">{orden.celular}</span>
                    </div>
                  </div>
                  {orden.empresa && (
                    <div className="md:hidden flex justify-between gap-3">
                      <div className="md:text-center ">
                        <h5 className="md:hidden text-black font-bold mb-0 text-sm">Empresa</h5>
                        <span className="text-left w-full text-black line-clamp-1">{orden.empresa}</span>
                      </div>
                    </div>
                  )}
                  <div className="md:hidden flex justify-between gap-3">
                    <div className="md:text-center ">
                      <h5 className="md:hidden text-[#62be6d] font-bold mb-0 text-sm ">Fecha de creación</h5>
                      <span className="text-left block text-[#62be6d]">
                        {new Date(orden.created_at).toLocaleDateString(undefined, {
                          year: 'numeric',
                          month: '2-digit',
                          day: '2-digit'
                        })}{' '}
                      </span>
                    </div>
                    <div className="md:text-right ">
                      <h5 className="md:hidden text-black font-bold mb-0 text-sm bg text-right">DNI/RUC</h5>
                      <span className="text-right w-full text-black line-clamp-1">{orden.dni_ruc}</span>
                    </div>
                  </div>
                  {orden.email && (
                    <div className="md:hidden flex items-center justify-between gap-3">
                      <div className="md:text-left w-full">
                        <h5 className="md:hidden text-black text-left font-bold mb-0 text-sm ">Email</h5>
                        <span className="text-left w-full text-black line-clamp-1">{orden.email}</span>
                      </div>
                      <div className="block md:text-center">
                        {
                          // @ts-expect-error
                          orden?.puntuacionpromedio ? (
                            <button
                              onClick={() => {
                                setOpenComentarios({
                                  estado: true,
                                  comentarios: orden
                                })
                              }}
                              className="text-center text-white bg-green-600 text-sm rounded-full w-[20px] justify-center h-[20px] flex items-center m-auto"
                            >
                              {
                                // @ts-expect-error
                                orden.puntuacionpromedio
                              }
                            </button>
                          ) : (
                            <span className="text-center text-white "></span>
                          )
                        }
                      </div>
                    </div>
                  )}
                </div>
                <div className="hidden md:block md:text-center">
                  <span className="text-left block text-black w-full line-clamp-1">#{orden.id}</span>
                </div>
                <div className="hidden md:block md:text-center col-span-2">
                  <div className="relative">
                    <div className="line-clamp-1 ">
                      <span className="text-left block text-black w-full lowercase first-letter:uppercase">
                        {orden.nombres} {orden.apellidos}
                      </span>
                    </div>
                    {orden.arraycontacto && JSON.parse(orden.arraycontacto).length > 0 && (
                      <div className="flex w-fit">
                        <p
                          onClick={() => {
                            if (expandedContact == orden.id) {
                              setExpandedContact(null)
                            } else {
                              setExpandedContact(orden.id)
                            }
                          }}
                          className="text-xs text-blue-500 hover:underline cursor-pointer transition-all"
                        >
                          +{JSON.parse(orden.arraycontacto).length} contactos
                        </p>
                      </div>
                    )}
                  </div>
                </div>
                <div className="hidden md:block md:text-center">
                  <div className="line-clamp-1">
                    <span className="text-left block text-black w-full lowercase first-letter:uppercase">{orden.empresa}</span>
                  </div>
                </div>
                <div className="hidden md:block md:text-center">
                  <span className="text-left block text-black w-full line-clamp-1">{orden.celular}</span>
                </div>
                <div className="hidden md:block md:text-center">
                  <span className="text-left block text-black w-full line-clamp-1">{orden.dni_ruc}</span>
                </div>
                <div className="hidden md:block md:text-center">
                  <span className="text-left block text-black w-full line-clamp-1">
                    {orden.medio_ingreso == '0'
                      ? 'Facebook'
                      : orden.medio_ingreso == '1'
                        ? 'Google'
                        : orden.medio_ingreso == '5'
                          ? 'Instagram'
                          : orden.medio_ingreso == '2'
                            ? 'Ventas'
                            : orden.medio_ingreso == '3'
                              ? 'Post Venta'
                              : orden.medio_ingreso == '4'
                                ? 'Whatsapp'
                                : orden.medio_ingreso == '6'
                                  ? 'Recomendación'
                                  : orden.medio_ingreso == '7'
                                    ? 'Logos'
                                    : ''}
                  </span>
                </div>
                <div className="hidden md:block md:text-center">
                  <p className="line-clamp-2 text-black">
                    {new Date(orden.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })}{' '}
                    {/* new Date(orden.created_at).toLocaleTimeString() */}
                  </p>
                </div>
                <div className="hidden md:block md:text-center">
                  {
                    // @ts-expect-error
                    orden?.puntuacionpromedio ? (
                      <button
                        onClick={() => {
                          setOpenComentarios({
                            estado: true,
                            comentarios: orden
                          })
                        }}
                        className="text-center text-white bg-green-600 text-sm rounded-full w-[20px] justify-center h-[20px] flex items-center m-auto"
                      >
                        {
                          // @ts-expect-error
                          orden.puntuacionpromedio.toFixed(0)
                        }
                      </button>
                    ) : (
                      <span className="text-center text-white "></span>
                    )
                  }
                </div>
                <div className="md:text-center md:flex md:justify-center items-center absolute right-0 top-0">
                  <Menu
                    menuButton={
                      <MenuButton className="block p-2">
                        <RiSettings3Fill className="text-gray-500 text-lg" />
                      </MenuButton>
                    }
                    align="end"
                    arrow
                    transition
                    menuClassName="bg-secondary-100 p-4"
                  >
                    <MenuItem className="p-0 hover:bg-transparent">
                      <Link
                        to={`ver/${orden.id}`}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                      >
                        Ver
                      </Link>
                    </MenuItem>
                    <MenuItem className="p-0 hover:bg-transparent">
                      <Link
                        to={`editar/${orden.id}`}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                      >
                        Editar
                      </Link>
                    </MenuItem>
                    <MenuItem className="p-0 hover:bg-transparent">
                      <Link
                        to={`resumen/${orden.id}`}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                      >
                        Reporte
                      </Link>
                    </MenuItem>
                    <MenuItem className="p-0 hover:bg-transparent">
                      <Link
                        to=""
                        onClick={() => {
                          handleClickOpen()
                          setValues({
                            ...values,
                            id_cliente: String(orden.id),
                            medio_ingreso: orden.medio_ingreso,
                            nombre_empresa: orden.empresa ?? '',
                            nombre_cliente: `${orden.nombres} ${orden.apellidos}`,
                            arraycontacto: orden.arraycontacto,
                            celular: orden.celular,
                            email: orden.email,
                            dni_ruc: `${orden.dni_ruc != null ? orden.dni_ruc : ''}`
                          })
                        }}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex justify-center items-center gap-x-4 p-2 flex-1"
                      >
                        Crear alta
                      </Link>
                    </MenuItem>
                    <MenuItem className="p-0 hover:bg-transparent">
                      <Link
                        to=""
                        onClick={() => {
                          setOpenContrato(true)
                          setValues({
                            ...values,
                            id_cliente: String(orden.id),
                            medio_ingreso: orden.medio_ingreso,
                            email: orden.email,
                            nombre_empresa: orden.empresa ?? '',
                            nombre_cliente: `${orden.nombres} ${orden.apellidos}`,
                            arraycontacto: orden.arraycontacto,
                            celular: orden.celular,
                            dni_ruc: `${orden.dni_ruc != null ? orden.dni_ruc : ''}`,
                            sexo: orden.sexo
                          })
                        }}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex justify-center items-center gap-x-4 p-2 flex-1"
                      >
                        Crear contrato
                      </Link>
                    </MenuItem>
                    <MenuItem className="p-0 hover:bg-transparent">
                      <Link
                        to=""
                        onClick={() => {
                          setOpenCotizacion(true)
                          setValues({
                            ...values,
                            id_cliente: String(orden.id),
                            medio_ingreso: orden.medio_ingreso,
                            email: orden.email,
                            nombre_empresa: orden.empresa ?? '',
                            nombre_cliente: `${orden.nombres} ${orden.apellidos}`,
                            arraycontacto: orden.arraycontacto,
                            celular: orden.celular,
                            dni_ruc: `${orden.dni_ruc != null ? orden.dni_ruc : ''}`
                          })
                        }}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex justify-center items-center gap-x-4 p-2 flex-1"
                      >
                        Crear cotización
                      </Link>
                    </MenuItem>
                    <MenuItem className="p-0 hover:bg-transparent">
                    <RegistroCupones id_cliente={orden.id} />
                    </MenuItem>
                    <MenuItem className="p-0 hover:bg-transparent">
                      <Link
                        to={`proyectos/${orden.id}`}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                      >
                        Ver Proyectos
                      </Link>
                    </MenuItem>
                    <MenuItem className="p-0 hover:bg-transparent">
                      <button
                        onClick={() => {
                          preguntar(orden.id)
                        }}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex justify-center items-center gap-x-4 p-2 flex-1"
                      >
                        Eliminar cliente
                      </button>
                    </MenuItem>
                  </Menu>
                </div>
              </div>
              {
                <AnimatePresence>
                  {orden.arraycontacto &&
                    JSON.parse(orden.arraycontacto).length > 0 &&
                    expandedContact &&
                    expandedContact == orden.id &&
                    JSON.parse(orden.arraycontacto).map((contacto: ListcontactoClientes, indexcol: number) => (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className={
                          'grid grid-cols-1 md:grid-cols-9  gap-3 items-center mb-3 md:mb-0 md:px-4 bg-transparent rounded-xl relative shadow_class'
                        }
                        key={contacto.id}
                      >
                        <div className="flex flex-col gap-3 md:hidden bg-gray-100 p-4 rounded-xl relative before:w-[2px] before:h-3 before:bottom-full before:left-0 before:right-0 before:mx-auto before:bg-gray-600 before:absolute">
                          <div className="md:hidden flex justify-between gap-3">
                            <div className="md:text-center ">
                              <h5 className="md:hidden text-black font-bold mb-0 text-sm">Cliente</h5>
                              <span className="text-left w-full text-black line-clamp-1">{contacto.nombres}</span>
                            </div>
                            <div className="md:text-right ">
                              <h5 className="md:hidden text-black font-bold mb-0 text-sm bg text-right">Celular</h5>
                              <span className="text-right w-full text-black line-clamp-1">{contacto.celular}</span>
                            </div>
                          </div>
                          <div className="md:hidden flex justify-between gap-3">
                            <div className="md:text-center ">
                              <h5 className="md:hidden text-black font-bold mb-0 text-sm">Empresa</h5>
                              <span className="text-left w-full text-black line-clamp-1">{contacto.marca}</span>
                            </div>
                            <div className="md:text-right ">
                              <h5 className="md:hidden text-[#62be6d] font-bold mb-0 text-sm line-clamp-1">Fecha de creación</h5>
                              <span className="text-right block text-[#62be6d]">
                                {new Date(orden.created_at).toLocaleDateString(undefined, {
                                  year: 'numeric',
                                  month: '2-digit',
                                  day: '2-digit'
                                })}{' '}
                              </span>
                            </div>
                          </div>
                          <div className="md:hidden flex justify-between gap-3">
                            <div className="md:text-left ">
                              <h5 className="md:hidden text-black font-bold mb-0 text-sm bg text-left">Correo</h5>
                              <span className="text-left w-full text-black line-clamp-1">{contacto.correo}</span>
                            </div>
                          </div>
                        </div>
                        <div
                          className={`hidden md:block h-full md:text-center relative ${
                            indexcol == 0 ? 'before:h-[80%] -top-0 after:bottom-5' : 'before:h-[95%] -top-4 after:bottom-0'
                          } before:mt-0 before:w-[2px] before:bg-gray-200 before:absolute before:left-0 before:ml-5
                                    after:h-[2px] after:w-[90%] after:ml-5 after:bg-gray-200 after:absolute  after:left-0`}
                        >
                          <span className="text-left block text-black w-full line-clamp-1 h-[2px] py-2"></span>
                        </div>
                        <div className="hidden md:block md:text-center col-span-2  py-2">
                          <div className="line-clamp-1">
                            <span className="text-left block text-black w-full lowercase first-letter:uppercase">{contacto.nombres}</span>
                          </div>
                        </div>
                        <div className="hidden md:block md:text-center">
                          <div className="line-clamp-1">
                            <span className="text-left block text-black w-full lowercase first-letter:uppercase">{contacto.marca}</span>
                          </div>
                        </div>
                        <div className="hidden md:block md:text-center">
                          <span className="text-left block text-black w-full line-clamp-1">{contacto.celular}</span>
                        </div>
                        <div className="hidden md:block md:text-center">
                          <span className="text-left block text-black w-full line-clamp-1">{orden.dni_ruc}</span>
                        </div>
                        <div className="hidden md:block md:text-center">
                          <span className="text-left block text-black w-full line-clamp-1">Post venta</span>
                        </div>
                        <div className="hidden md:block md:text-center">
                          <p className="line-clamp-2 text-black">
                            {new Date(contacto.created_at).toLocaleDateString(undefined, {
                              year: 'numeric',
                              month: '2-digit',
                              day: '2-digit'
                            })}{' '}
                          </p>
                        </div>
                        <div className="md:text-center md:flex md:justify-center items-center absolute md:relative right-0 top-0"></div>
                      </motion.div>
                    ))}
                </AnimatePresence>
              }
            </>
          ))}

          <GeneracionVentas open={open} setOpen={setOpen} datos={values} planes={planes} getClientes={getClientes} usuarios={usuarios} />
          {/* <GenerarAlta
            datos={values}
            planes={planes}
            open={open}
            setOpen={setOpen}
            usuarios={usuarios}
          /> */}

          <GeneracionCorrelativo
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            datos={values}
            open={openContrato}
            setOpen={setOpenContrato}
            planes={planes}
          />

          <ModalPreviaCotizacion
            open={openCotizacion}
            setOpen={setOpenCotizacion}
            planes={planes}
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-expect-error
            datos={values}
          />

          <div className="flex flex-col md:flex-row gap-5 md:gap-0 justify-center md:justify-between content_buttons pt-3 mt-5">
            <p className="text-md ml-1 text-black text-center">{totalPosts} Registros</p>
            <Paginacion totalPosts={totalPosts} cantidadRegistros={cantidadRegistros} paginaActual={paginaActual} setpaginaActual={setpaginaActual} />
          </div>
        </div>
      )}
      <VerComentarios open={openComentarios} setOpen={setOpenComentarios} />
    </>
  )
}
