import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../../../../hooks/useAuth'
import {
  RiBarChartFill,
  RiFilter2Fill,
  RiSettings3Fill
} from 'react-icons/ri'
import { Loading } from '../../../../shared/Loading'
import {
  type arrayContacto,
  type ValuesPlanes,
  type ValuesVenta
} from '../../../../shared/schemas/Interfaces'
import { Paginacion } from '../../../../shared/Paginacion'
import { getDataToPlanes, getDataVentas } from '../../../../shared/FetchingData'
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import Swal from 'sweetalert2'
import {
  limpiarCadena,
  quitarAcentos
} from '../../../../shared/functions/QuitarAcerntos'
import { MdChevronRight } from 'react-icons/md'

interface Filters {
  activeFilter: null
  descargo: null
  nodescargo: null
}

export const ListaVentasVencidos = (): JSX.Element => {
  const { setTitle } = useAuth()
  const token = localStorage.getItem('token')
  const [productos, setProductos] = useState<ValuesVenta[]>([])
  const [loading, setLoading] = useState(true)
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [paginaActual, setpaginaActual] = useState<number>(1)
  const [search, setSearch] = useState('')
  const [cantidadRegistros] = useState(12)
  const navigate = useNavigate()
  const [colaboradores, setColaboradores] = useState([])
  const [filters, setFilters] = useState<Filters>({
    descargo: null,
    activeFilter: null,
    nodescargo: null
  })
  const [planes, setplanes] = useState<ValuesPlanes[]>([])
  const [ordenAscendente, setOrdenAscendente] = useState(false)
  const [ordenDescente, setOrdenDescente] = useState(false)

  const [ordenAscendente2, setOrdenAscendente2] = useState(false)
  const [ordenDescente2, setOrdenDescente2] = useState(false)
  const getColaboradores = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getUsuariosToMatrix`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setColaboradores(request.data)
  }

  useEffect(() => {
    setTitle('Proyectos con archivos vencidos')
    Promise.all([
      getColaboradores(),
      getDataToPlanes('getPlanes', setplanes, setTotalRegistros),
      getDataVentas('indexToVencidos', setProductos, setTotalRegistros)
    ]).then(() => {
      setLoading(false)
    })
  }, [])

  const indexOfLastPost = paginaActual * cantidadRegistros
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros
  let totalPosts = productos.length

  const filterDate = (): ValuesVenta[] => {
    let filteredProductos = productos
    if (filters.descargo == true) {
      filteredProductos = filteredProductos.filter(
        (pro) =>
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
          pro.limitar_archivos != null
      )
    } else if (filters.nodescargo == true) {
      filteredProductos = filteredProductos.filter(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        (pro) => pro.limitar_archivos == null
      )
    }

    const searchTerm = quitarAcentos(search)
    // ... puedes agregar otras condiciones de filtro aquí
    if (search.length > 0) {
      filteredProductos = filteredProductos.filter((pro) => {
        const fullName = `${pro.nombres} ${pro.apellidos}`.toLowerCase()
        const empresa = `${pro.nombre_marca}`.toLowerCase()
        return (
          quitarAcentos(pro.nombre_empresa).includes(searchTerm) ||
          quitarAcentos(empresa).includes(searchTerm) ||
          quitarAcentos(fullName).includes(searchTerm) ||
          String(pro.id).includes(searchTerm) ||
          String(pro.id_contrato).includes(searchTerm)
        )
      })
    }

    totalPosts = filteredProductos.length
    return filteredProductos.slice(indexOfFirstPost, indexOfLastPost)
  }

  useEffect(() => {
    if (ordenAscendente) {
      setLoading(true)
      Promise.all([
        getDataVentas('getVentasAscendenteVencido', setProductos, setTotalRegistros)
      ]).then(() => {
        setLoading(false)
      })
    } else if (ordenDescente) {
      setLoading(true)
      Promise.all([
        getDataVentas('getVentasDescendenteVencido', setProductos, setTotalRegistros)
      ]).then(() => {
        setLoading(false)
      })
    } else if (ordenAscendente2) {
      setLoading(true)
      Promise.all([
        getDataVentas('getVentasAscendente2Vencido', setProductos, setTotalRegistros)
      ]).then(() => {
        setLoading(false)
      })
    } else if (ordenDescente2) {
      setLoading(true)
      Promise.all([
        getDataVentas('getVentasDescendente2Vencido', setProductos, setTotalRegistros)
      ]).then(() => {
        setLoading(false)
      })
    } else {
      setLoading(true)
      Promise.all([
        getDataVentas('indexToVencidos', setProductos, setTotalRegistros)
      ]).then(() => {
        setLoading(false)
      })
    }
  }, [ordenAscendente, ordenDescente, ordenAscendente2, ordenDescente2])

  useEffect(() => {
    setTotalRegistros(totalPosts)
  }, [search, filters])

  const onSeachChange = ({
    target
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setpaginaActual(1)
    setSearch(target.value)
  }

  const preguntar = (id: number): void => {
    Swal.fire({
      title: `¿Estas seguro de cambiar el estado a la venta N° ${id}?`,
      showDenyButton: true,
      confirmButtonText: 'Cambiar',
      denyButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        cambiarEstado(id)
      }
    })
  }

  const preguntarPreventa = (id: number): void => {
    Swal.fire({
      title: `¿Estas seguro de mover la venta N° ${id} a preventa?`,
      showDenyButton: true,
      confirmButtonText: 'Mover',
      denyButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        moverPreventa(id)
      }
    })
  }

  const cambiarEstado = async (id: number): Promise<void> => {
    try {
      const request = await axios.get(`${Global.url}/manejarEstado/${id}`, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })
      if (request.data.status == 'success') {
        Swal.fire('Se cambio el estado', '', 'success')
        setLoading(true)
        Promise.all([
          getDataVentas('getVentas', setProductos, setTotalRegistros)
        ]).then(() => {
          setLoading(false)
        })
      } else {
        Swal.fire('Error', '', 'error')
      }
    } catch (error) {
      console.log(error)
      Swal.fire('Error', '', 'error')
    }
  }

  const moverPreventa = async (id: number): Promise<void> => {
    try {
      const request = await axios.get(`${Global.url}/moverPreventa/${id}`, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })
      if (request.data.status == 'success') {
        Swal.fire('Se movio correctamente', '', 'success')
        setLoading(true)
        navigate('/admin/lista-preventa')
      } else {
        Swal.fire('Error', '', 'error')
      }
    } catch (error) {
      console.log(error)
      Swal.fire('Error', '', 'error')
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const toggleFilter = (type: 'descargo' | 'nodescargo', value: number | boolean) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    setFilters((prev) => {
      if (prev.activeFilter == type) {
        return { ...prev, [type]: null, activeFilter: null } // desactiva el filtro si ya estaba activo
      }
      return {
        descargo: null,
        nodescargo: null,
        [type]: value
      } // activa el filtro seleccionado y desactiva los demás
    })
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-y-4 mb-3 lg:mb-5 gap-2">
        <div className="w-full lg:w-fit flex flex-col lg:flex-row gap-2 items-center h-fit">
          <button className="bg-white hover:bg-gray-100 w-full lg:w-fit flex items-center text-black gap-2 py-2 px-4 rounded-lg hover:text-main transition-colors">
            <RiFilter2Fill />
            <input
              placeholder="Buscar ..."
              className="bg-transparent outline-none"
              value={search}
              onChange={onSeachChange}
              type="search"
            />
          </button>
          <div className="flex gap-2">
            <button
              className={`bg-green-600 text-white px-2 lg:px-4 text-sm lg:text-base py-1 lg:py- rounded-xl line-clamp-1 font-bold ${
                filters.descargo
                  ? 'border-2 border-yellow-500'
                  : 'border-2 border-transparent'
              }`}
              onClick={() => {
                toggleFilter('descargo', !filters.descargo)
              }}
            >
              Descargo
            </button>
            <button
              className={`bg-red-600 text-white px-2 lg:px-4 text-sm lg:text-base py-1 lg:py- rounded-xl line-clamp-1 font-bold ${
                filters.nodescargo
                  ? 'border-2 border-yellow-500'
                  : 'border-2 border-transparent'
              }`}
              onClick={() => {
                toggleFilter('nodescargo', !filters.nodescargo)
              }}
            >
              No descargo
            </button>
          </div>
        </div>
        <div className="w-fit lg:w-fit flex flex-row items-center gap-4">
          <Link to={'metricas'}>
            <RiBarChartFill className="text-main text-2xl lg:text-3xl cursor-pointer" />
          </Link>
        </div>
      </div>
      {loading
        ? <Loading />
        : (
        <div className="lg:bg-[#fff] lg:px-8 lg:py-6 rounded-xl">
          <div
            className={'hidden lg:grid pr-10 lg:pr-4 grid_teplate_ventas gap-4 mb-2 lg:px-4 lg:py-2 text-gray-400 border-y border-gray-300'}
          >
            <h5 className="lg:text-left line-clamp-1 col-span-1">Contrato</h5>
            <h5 className="lg:text-left line-clamp-1 col-span-2 ">Plan</h5>
            <h5 className="lg:text-left line-clamp-1 col-span-2 ">Colaborador</h5>
            <h5 className="lg:text-left col-span-2">Empresa</h5>
            <h5 className="lg:text-left col-span-2">Marca</h5>
            <h5 className="lg:text-center line-clamp-1 col-span-2">
              Medio de ingreso
            </h5>
            <h5 className="lg:text-center col-span-2">Estado</h5>
            <h5 className="lg:text-center line-clamp-1 col-span-2">
                Fecha de Alta
            </h5>
            <h5 className="lg:text-center w-fit flex gap-2 items-center col-span-2">
                Fecha de Inicio
                <div className='flex flex-col'>
                <MdChevronRight
                onClick={() => { setOrdenAscendente(!ordenAscendente); setOrdenAscendente2(false); setOrdenDescente(false); setOrdenDescente2(false) }} className={`${!ordenAscendente ? 'text-gray-400' : 'text-main'} -rotate-90 hover:text-main transition-colors cursor-pointer`} title='Ascendente'/>
                <MdChevronRight onClick={() => { setOrdenDescente(!ordenDescente); setOrdenAscendente(false); setOrdenAscendente2(false); setOrdenDescente2(false) }} className={`${!ordenDescente ? 'text-gray-400' : 'text-main'} rotate-90 hover:text-main transition-colors cursor-pointer`} title='Descendente'/>
                </div>
            </h5>
            <h5 className="lg:text-center w-fit flex gap-2 items-center col-span-2">
                Fecha Final
                <div className='flex flex-col'>
                    <MdChevronRight
                onClick={() => { setOrdenAscendente2(!ordenAscendente2); setOrdenAscendente(false); setOrdenDescente2(false); setOrdenDescente(false) }} className={`${!ordenAscendente2 ? 'text-gray-400' : 'text-main'} -rotate-90 hover:text-main transition-colors cursor-pointer`} title='Ascendente'/>
                    <MdChevronRight onClick={() => { setOrdenDescente2(!ordenDescente2); setOrdenDescente(false); setOrdenAscendente2(false); setOrdenAscendente(false) }} className={`${!ordenDescente2 ? 'text-gray-400' : 'text-main'} rotate-90 hover:text-main transition-colors cursor-pointer`} title='Descendente'/>
                </div>
            </h5>
          </div>
          {filterDate().map((orden: ValuesVenta, index: number) => (
            <div
              className={`grid grid_teplate_ventas 
              md:pr-10 lg:pr-4 relative gap-3 items-center mb-3 lg:mb-0 ${
                index % 2 == 0 ? 'bg-transparent' : 'bg-gray-200'
              } lg:px-4 lg:py-3 rounded-xl relative shadow_class`}
              key={orden.id}
            >
              <div
                // to={`view-servicio/${orden.id}`}
                className="flex flex-col gap-3 lg:hidden bg-form p-4 rounded-xl"
              >
                <div className="flex justify-between">
                  <div className="flex lg:hidden gap-4 items-center">
                    {orden.estado == '1'
                      ? (
                      <span className="flex items-center justify-center bg-red-400 text-red-600  w-8 h-8 rounded-full">
                        A
                      </span>
                        )
                      : orden.fecha_fin != null
                        ? (
                      <span className="flex items-center justify-center bg-[#b3dba1] text-green-700 w-8 h-8 rounded-full">
                        T
                      </span>
                          )
                        : !orden.fecha_inicio && !orden.fecha_alta
                            ? (
                      <span className="flex items-center justify-center bg-yellow-300 text-yellow-600 w-8 h-8 rounded-full">
                        C
                      </span>
                              )
                            : (
                      <span className="flex items-center justify-center bg-gray-300 text-gray-500 w-8 h-8 rounded-full">
                        P
                      </span>
                              )}
                    <span className="flex lg:justify-left items-center gap-3 font-bold text-black">
                      {limpiarCadena(orden.id_contrato)}
                    </span>
                  </div>
                <div className="lg:text-right pr-0">
                    <h5 className="lg:hidden text-gray-500 text-right font-bold mb-0 text-sm">
                    Fecha de alta
                    </h5>
                    <span className="text-right block text-gray-500">
                    {orden.fecha_alta}
                    </span>
                </div>
                </div>
                <div className="lg:hidden flex justify-between gap-3">
                  <div className="lg:text-center ">
                    <h5 className="lg:hidden text-black font-bold mb-0 text-sm">
                      Empresa
                    </h5>
                    {orden.id_contacto
                      ? <>
                  {orden.arraycontacto && JSON.parse(orden.arraycontacto).length > 0 &&
                    JSON.parse(orden.arraycontacto).filter((contacto: arrayContacto) => String(contacto.id ?? '') == orden.id_contacto).map((contacto: arrayContacto) => (
                    <span key={contacto.id} className="text-left w-full text-black line-clamp-1">
                        {contacto.nombres}
                    </span>
                    ))
                    }
                  </>
                      : <span className="text-left w-full text-black line-clamp-1">
                    {orden.nombres} {orden.apellidos}
                </span>
                }
                    <span className="text-left w-full text-black line-clamp-1">
                      {orden.nombre_empresa}
                    </span>
                  </div>
                  <div className="lg:text-right ">
                    <h5 className="lg:hidden text-black font-bold mb-0 text-sm bg text-right">
                      Marca
                    </h5>
                    <span className="text-right w-full text-black line-clamp-1">
                      {orden.nombre_marca
                        ? orden.nombre_marca
                        : 'No registrado'}
                    </span>
                  </div>
                </div>
                <div className="lg:hidden flex justify-between gap-3">
                  <div className="lg:text-center ">
                    <h5 className="lg:hidden text-black font-bold mb-0 text-sm">
                      Plan
                    </h5>
                    <span className="text-left w-full text-black line-clamp-1">
                      {planes.map((plan) =>
                        orden.id_contrato.split('_')[0] == plan.codigo
                          ? plan.nombre
                          : ''
                      )}
                    </span>
                  </div>
                    <div className="lg:text-right ">
                      <h5 className="lg:hidden text-black font-bold mb-0 text-sm bg text-right">
                        Colaborador
                      </h5>
                      <span className="text-right w-full text-black line-clamp-1">
                        {JSON.parse(orden.asignacion)?.map((asignacion: any) =>
                          colaboradores
                            .filter(
                              (colaborador: { id: number, name: string }) =>
                                colaborador.id == asignacion.peso
                            )
                            .map(
                              (colaborador: { name: string }) =>
                                colaborador.name
                            )
                            .join(', ')
                        )}
                      </span>
                    </div>
                </div>
                  <div className="lg:hidden flex justify-between gap-3">
                    <div className="lg:text-center ">
                      <h5 className="lg:hidden text-[#62be6d] font-bold mb-0 text-sm ">
                        Fecha de Inicio
                      </h5>
                      <span className="text-left block text-[#62be6d]">
                        {orden.fecha_inicio}
                      </span>
                    </div>
                      <div className="lg:text-right ">
                        <h5 className="lg:hidden text-red-500 text-right font-bold mb-0 text-sm">
                          Fecha de cierre
                        </h5>
                        <span className="text-right block text-red-500">
                          {orden.fecha_fin}
                        </span>
                      </div>
                  </div>
              </div>
              {/* PC */}
              <div className="hidden lg:block lg:text-center col-span-1">
                <span className="text-left block text-black w-full line-clamp-1">
                  {limpiarCadena(orden.id_contrato)}
                </span>
              </div>
              <div className="hidden lg:block lg:text-center col-span-2 relative h-full">
                <span className="text-left text-black line-clamp-1 transition-all hover:w-[200%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                  {planes.map((plan) =>
                    orden.id_contrato.split('_')[0] == plan.codigo
                      ? plan.nombre
                      : ''
                  )}
                </span>
              </div>
                <>
                  <div className="hidden lg:block lg:text-center col-span-2">
                    <span className="text-left text-black line-clamp-1 w-full">
                      {JSON.parse(orden.asignacion)?.map((asignacion: any) =>
                        colaboradores
                          .filter(
                            (colaborador: { id: number, name: string }) =>
                              colaborador.id == asignacion.peso
                          )
                          .map(
                            (colaborador: { name: string }) => colaborador.name
                          )
                          .join(', ')
                      )}
                    </span>
                  </div>
                </>
              <div className="hidden lg:block lg:text-center col-span-2">
                <div className='line-clamp-1'>
                {orden.id_contacto
                  ? <>
                  {orden.arraycontacto && JSON.parse(orden.arraycontacto).length > 0 &&
                    JSON.parse(orden.arraycontacto).filter((contacto: arrayContacto) => String(contacto.id ?? '') == orden.id_contacto).map((contacto: arrayContacto) => (
                    <span key={contacto.id} className="text-left text-black w-full block lowercase first-letter:uppercase">
                        {contacto.nombres}
                    </span>
                    ))
                    }
                  </>
                  : <span className="text-left text-black w-full block lowercase first-letter:uppercase">
                    {orden.nombres} {orden.apellidos}
                </span>
                }
                </div>
              </div>
              <div className="hidden lg:block lg:text-center  col-span-2">
                <div className='line-clamp-1'>
                  <span className="text-left text-black w-full block lowercase first-letter:uppercase">
                  {orden.nombre_marca ? orden.nombre_marca : 'No registrado'}
                  </span>
                </div>
              </div>
              <div className="hidden lg:block lg:text-center col-span-2">
                <span className="text-center block text-black">
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
              <div
                className={`hidden w-fit mx-auto lg:flex gap-2 lg:px-2 items-center justify-center col-span-2 lg:text-center ${
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                orden.limitar_archivos != null
                    ? ' bg-[#1A5515] text-white'
                    : 'bg-red-600 text-white'
                }`}
              >
                {
                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-expect-error
                orden.limitar_archivos != null
                  ? (
                  <>
                    <span className="text-center  bg-[#1A5515] text-white font-bold w-fit line-clamp-1">
                      Si descargo
                    </span>
                  </>
                    )
                  : <>
                    <span className="text-center bg-red-600 text-white font-bold w-fit line-clamp-1">
                      No descargo
                    </span>
                  </>
                }
              </div>
                  <div className="hidden lg:block lg:text-center col-span-2">
                    <span className="text-cener block text-black">
                      {orden.fecha_alta}
                    </span>
                  </div>
                  <div className="hidden lg:block lg:text-center col-span-2">
                    <span className="text-cener block text-black">
                      {orden.fecha_inicio}
                    </span>
                  </div>
                    <div className="hidden lg:block lg:text-center col-span-2">
                      <span className="text-center block text-black">
                        {orden.fecha_fin}
                      </span>
                    </div>
              <div className="lg:text-center lg:flex lg:justify-center items-center absolute right-0 top-0 bottom-0 my-auto">
                <Menu
                  menuButton={
                    <MenuButton className="block p-1">
                      <RiSettings3Fill className="text-gray-600 text-lg" />
                    </MenuButton>
                  }
                  align="end"
                  arrow
                  transition
                  menuClassName="bg-secondary-100 p-4"
                >
                  <MenuItem className="p-0 hover:bg-transparent">
                    {orden.id != null && (
                      <Link
                        to={`/admin/lista-ventas/view/${orden.id}`}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                      >
                        Ver
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem className="p-0 hover:bg-transparent">
                    {orden.id != null && (
                      <Link
                        to={`/admin/lista-ventas/editar/${orden.id}`}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                      >
                        Editar
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem className="p-0 hover:bg-transparent">
                    {orden.id != null && (
                      <Link
                        to={`/admin/lista-servicios/avances/${orden.id}`}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                      >
                        Seguimiento
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem className="p-0 hover:bg-transparent">
                    {orden.id != null && (
                      <Link
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/ban-ts-comment
                        // @ts-expect-error
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                        to={`/admin/lista-clientes/editar/${orden.id_cliente}`}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                      >
                        Datos de cliente
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem className="p-0 hover:bg-transparent">
                    <Link
                      to={`/admin/lista-ventas/generarContrato/${orden.id}`}
                      className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                    >
                      Generar contrato
                    </Link>
                  </MenuItem>
                  <MenuItem className="p-0 hover:bg-transparent">
                    {orden.id != null && (
                      <Link
                        to={'#'}
                        onClick={() => {
                          preguntarPreventa(orden.id)
                        }}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                      >
                        Mover a preventa
                      </Link>
                    )}
                  </MenuItem>
                  <MenuItem className="p-0 hover:bg-transparent">
                    {orden.id != null && (
                      <Link
                        to={'#'}
                        onClick={() => {
                          preguntar(orden.id)
                        }}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                      >
                        {orden.estado == '1'
                          ? 'Quitar abandono'
                          : 'Marcar como abandono'}
                      </Link>
                    )}
                  </MenuItem>
                </Menu>
              </div>
            </div>
          ))}

          <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 justify-center lg:justify-between content_buttons pt-3 mt-5">
            <p className="text-md ml-1 text-black">
              {totalRegistros} Registros
            </p>
            <Paginacion
              totalPosts={totalPosts}
              cantidadRegistros={cantidadRegistros}
              paginaActual={paginaActual}
              setpaginaActual={setpaginaActual}
            />
          </div>
        </div>
          )}
    </>
  )
}
