import { useState, useEffect } from 'react'

import { Loading } from '../../../shared/Loading'
import { BsArrowLeftSquareFill } from 'react-icons/bs'
import { Link } from 'react-router-dom'
import { Paginacion } from '../../../shared/Paginacion'
import useAuth from '../../../../hooks/useAuth'
import {
  type ValuesPlanes,
  type ValuesPreventaModificate
} from '../../../shared/schemas/Interfaces'
import { getData2, getDataToPlanes } from '../../../shared/FetchingData'
import { quitarAcentos } from '../../../shared/functions/QuitarAcerntos'
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu'
import { RiFilter2Fill, RiSettings3Fill } from 'react-icons/ri'
import { LuPhoneCall } from 'react-icons/lu'
import { MdCallMade } from 'react-icons/md'
import { AgregarLlamada } from './modal/AgregarLlamada'
import { DeleteItems } from '../../../shared/DeleteItems'
import { EditarLlamada } from './modal/EditarLlamada'
import { GeneracionVentas2 } from '../clientes/GeneracionVentas2'

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
}

export const HistorialLlamadas = (): JSX.Element => {
  const { setTitle } = useAuth()
  const [productos, setProductos] = useState<ValuesPreventaModificate[]>([])
  const [loading, setLoading] = useState(true)
  const [planes, setplanes] = useState<ValuesPlanes[]>([])
  const [, setTotalRegistros] = useState(0)
  const [, setTotalRegistros2] = useState(0)
  const [paginaActual, setpaginaActual] = useState<number>(1)
  const [search, setSearch] = useState('')
  const [cantidadRegistros] = useState(14)
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [open3, setOpen3] = useState(false)
  const [selectedid, setSelectectId] = useState(0)
  const [dato, setDato] = useState<valuesVentasTO>({
    id: 0,
    medio_ingreso: '',
    nombre_empresa: '',
    plan: '',
    id_contrato: '',
    dni_ruc: '',
    id_cliente: '',
    nombre_cliente: '',
    arraycontacto: ''
  })

  useEffect(() => {
    setTitle('Historial de llamadas')
    Promise.all([
      getData2('getHistorial', setProductos, setTotalRegistros),
      getDataToPlanes('getPlanes', setplanes, setTotalRegistros2)
    ]).then(() => {
      setLoading(false)
    })
  }, [])

  const indexOfLastPost = paginaActual * cantidadRegistros
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros
  let totalPosts = productos.length

  const filterDate = (): ValuesPreventaModificate[] => {
    if (search.length === 0) {
      const producto = productos.slice(indexOfFirstPost, indexOfLastPost)
      return producto
    }
    const searchTerm = quitarAcentos(search.toLowerCase())

    const filter = productos.filter((pro) => {
      const fullName = `${pro.nombres} ${pro.apellidos}`.toLowerCase()
      const empresa = `${pro.empresa}`.toLowerCase()
      return (
        quitarAcentos(fullName).includes(searchTerm) ||
        quitarAcentos(empresa).includes(searchTerm) ||
        String(pro.id).includes(searchTerm) ||
        String(pro.celular).includes(searchTerm)
      )
    })

    totalPosts = filter.length
    return filter.slice(indexOfFirstPost, indexOfLastPost)
  }

  const onSeachChange = ({
    target
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setpaginaActual(1)
    setSearch(target.value)
  }
  const token = localStorage.getItem('token')
  const preguntar = (id: number | null): void => {
    DeleteItems({
      ruta: 'destroyHistorial',
      id,
      token,
      totalPosts,
      cantidadRegistros,
      paginaActual,
      setpaginaActual,
      rutaFetch: 'getHistorial',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setData: setProductos,
      setTotalRegistros
    })
  }

  return (
    <div className="w-full h-screen p-4 flex flex-col gap-6 relative">
      {loading
        ? <Loading />
        : (
        <>
          <div className="flex w-full justify-center">
            <div className="w-full">
              <Link
                to="/admin/citas"
                className="w-fit mx-auto text-center rounded-xl py-1 block text-3xl hover:bg-main/80 hover:text-white transition-colors px-10 text-black font-bold font_main uppercase"
              >
                Gestor de Citas
              </Link>
            </div>
            <div className="w-full ">
              <h2 className="text-center mx-auto text-3xl text-white rounded-xl py-1 bg-main/80 px-10 w-fit font-bold font_main uppercase">
                Historial de llamadas
              </h2>
            </div>
          </div>
          <Link
            to="/admin/lista-clientes"
            className="fixed w-fit md:top-[3%] lg:top-[3%] text-3xl  right-4 text-red-500 cursor-pointer"
          >
            <BsArrowLeftSquareFill />
          </Link>
          <div className="w-full h-full App-content">
            <div className="w-full flex mb-3 justify-between">
              <div>
                <h3 className="text-xl text-gray-700 font-bold flex gap-2 items-center">
                  <LuPhoneCall className="text-green-600 text-xl" /> Historial
                  de llamadas
                </h3>
              </div>
              <div className="flex gap-3">
                <div className="w-full md:w-[500px] flex gap-2 items-center h-fit">
                  <button className="bg-white hover:bg-gray-100 w-full md:w-full flex items-center text-black gap-2 py-2 px-4 rounded-lg hover:text-main transition-colors">
                    <RiFilter2Fill />
                    <input
                      placeholder="Buscar por cliente o celular"
                      className="bg-transparent outline-none w-full"
                      value={search}
                      onChange={onSeachChange}
                      type="search"
                    />
                  </button>
                </div>
                <div className="w-full md:w-fit flex flex-col-reverse md:flex-row items-center md:gap-4">
                  <button
                    onClick={() => {
                      setOpen2(true)
                    }}
                    className="w-full md:w-fit inline-block rounded bg-main md:px-6 pb-2 pt-2.5 text-center text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-main-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-main-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-main-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                  >
                    REGISTRO
                  </button>
                </div>
              </div>
            </div>
            <div className="md:bg-[#fff] p-0 md:p-8 rounded-xl">
              <div className="hidden md:grid grid-cols-1 md:grid-cols-7 gap-3 mb-2 md:px-4 md:py-2 text-gray-400 border-y border-gray-300">
                <h5 className="md:text-left text-gray-700 font-medium line-clamp-1">
                  ID
                </h5>
                <h5 className="md:text-left text-gray-700 font-medium line-clamp-1 col-span-2">
                  Cliente
                </h5>
                <h5 className="md:text-left text-gray-700 font-medium line-clamp-1 md:block">
                  Celular
                </h5>
                <h5 className="md:text-left text-gray-700 font-medium line-clamp-1 ">
                  Evento
                </h5>
                <h5 className="md:text-center line-clamp-1 text-gray-700 font-medium">
                  Fecha de creación
                </h5>
                <h5 className="md:text-center line-clamp-1"></h5>
              </div>
              {filterDate().map(
                (orden: ValuesPreventaModificate, index: number) => (
                  <div
                    className={`grid grid-cols-1 md:grid-cols-7 relative gap-3 items-center mb-3 md:mb-0 ${
                      index % 2 == 0 ? 'bg-transparent' : 'bg-gray-200'
                    } md:px-4 md:py-1 rounded-xl relative shadow_class`}
                    key={orden.id}
                  >
                    <div className="flex flex-col gap-3 md:hidden bg-form p-4 rounded-xl">
                      <div className="flex md:hidden items-center gap-2">
                        <h5 className="md:hidden text-black font-bold mb-0 text-sm">
                          ID:
                        </h5>
                        <span className="flex md:justify-left items-center gap-3 font-bold text-black">
                          #{orden.id}
                        </span>
                      </div>
                      <div className="md:hidden flex justify-between gap-3">
                        <div className="md:text-center ">
                          <h5 className="md:hidden text-black font-bold mb-0 text-sm">
                            Cliente
                          </h5>
                          <span className="text-left w-full text-black line-clamp-1">
                            {orden.nombres} {orden.apellidos}
                          </span>
                        </div>
                        <div className="md:text-right ">
                          <h5 className="md:hidden text-black font-bold mb-0 text-sm bg text-right">
                            Celular
                          </h5>
                          <span className="text-right w-full text-black line-clamp-1">
                            {orden.celular}
                          </span>
                        </div>
                      </div>
                      {orden.empresa && (
                        <div className="md:hidden flex justify-between gap-3">
                          <div className="md:text-center ">
                            <h5 className="md:hidden text-black font-bold mb-0 text-sm">
                              Empresa
                            </h5>
                            <span className="text-left w-full text-black line-clamp-1">
                              {orden.empresa}
                            </span>
                          </div>
                        </div>
                      )}
                      <div className="md:hidden flex justify-between gap-3">
                        <div className="md:text-center ">
                          <h5 className="md:hidden text-[#62be6d] font-bold mb-0 text-sm ">
                            Fecha de creación
                          </h5>
                          <span className="text-left block text-[#62be6d]">
                            {new Date(orden.created_at).toLocaleDateString(
                              undefined,
                              {
                                year: 'numeric',
                                month: '2-digit',
                                day: '2-digit'
                              }
                            )}{' '}
                          </span>
                        </div>
                        <div className="md:text-right ">
                          <h5 className="md:hidden text-black font-bold mb-0 text-sm bg text-right">
                            DNI/RUC
                          </h5>
                          <span className="text-right w-full text-black line-clamp-1">
                            {orden.dni_ruc}
                          </span>
                        </div>
                      </div>
                      {orden.email && (
                        <div className="md:hidden flex justify-between gap-3">
                          <div className="md:text-left w-full">
                            <h5 className="md:hidden text-black text-left font-bold mb-0 text-sm ">
                              Email
                            </h5>
                            <span className="text-left w-full text-black line-clamp-1">
                              {orden.email}
                            </span>
                          </div>
                        </div>
                      )}
                    </div>
                    {/* PC */}
                    <div className="hidden md:block md:text-center">
                      <span className="text-left block text-black w-full line-clamp-1">
                        #{orden.id}
                      </span>
                    </div>
                    <div className="hidden md:block md:text-center col-span-2">
                      <div className="line-clamp-1">
                        <span className="text-left block text-black w-full lowercase first-letter:uppercase">
                          {orden.nombres} {orden.apellidos}
                        </span>
                      </div>
                    </div>
                    <div className="hidden md:block md:text-center">
                      <span className="text-left block text-black w-full line-clamp-1">
                        {orden.celular}
                      </span>
                    </div>
                    <div className="hidden md:block md:text-center">
                      <div className="line-clamp-1">
                        <span className="text-left  text-black w-full  flex gap-2 items-center">
                          <MdCallMade className="text-green-600" />
                          {
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-expect-error
                          orden.evento}
                        </span>
                      </div>
                    </div>
                    <div className="hidden md:block md:text-center">
                      <p className="line-clamp-2 text-black">
                      {new Date(orden.created_at).toLocaleString('es-PE', {
                        year: 'numeric',
                        month: '2-digit',
                        day: '2-digit',
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        timeZone: 'America/Lima' // Cambia a la zona horaria de Perú
                      })}
                      </p>
                    </div>
                    <div className="md:text-center md:flex md:justify-center items-center absolute md:relative right-0 top-0">
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
                          <button
                            onClick={() => {
                              setSelectectId(orden.id)
                              setOpen3(true)
                            }}
                            className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                          >
                            Editar
                          </button>
                        </MenuItem>
                        <MenuItem className="p-0 hover:bg-transparent">
                          <button
                            onClick={() => {
                              setOpen(true)
                              setDato({
                                ...dato,
                                id_cliente: String(orden.id),
                                medio_ingreso: orden.medio_ingreso,
                                nombre_empresa: orden.empresa
                                  ? orden.empresa
                                  : `${orden.nombres} ${orden.apellidos}`,
                                dni_ruc: `${
                                  orden.dni_ruc != null ? orden.dni_ruc : ''
                                }`
                              })
                            }}
                            className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                          >
                            Generar Venta
                          </button>
                        </MenuItem>
                        <MenuItem className="p-0 hover:bg-transparent">
                          <Link
                            target="_blank"
                            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                            // @ts-expect-error
                            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                            to={`/admin/lista-clientes/editar/${orden.id_cliente}`}
                            className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                          >
                            Datos
                          </Link>
                        </MenuItem>
                        <MenuItem className="p-0 hover:bg-transparent">
                          <Link
                          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                          // @ts-expect-error
                            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                            to={`/admin/lista-clientes/resumen/${orden.id_cliente}`}
                            className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                          >
                            Reporte
                          </Link>
                        </MenuItem>
                        <MenuItem className="p-0 hover:bg-transparent">
                          <button
                            onClick={() => {
                              preguntar(orden.id)
                            }}
                            className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                          >
                            Eliminar
                          </button>
                        </MenuItem>
                      </Menu>
                    </div>
                  </div>
                )
              )}
              <div className="flex flex-col md:flex-row gap-5 md:gap-0 justify-center md:justify-between content_buttons pt-3 mt-5">
                <p className="text-md ml-1 text-black">
                  {totalPosts} Registros
                </p>
                <Paginacion
                  totalPosts={totalPosts}
                  cantidadRegistros={cantidadRegistros}
                  paginaActual={paginaActual}
                  setpaginaActual={setpaginaActual}
                />
              </div>
            </div>
          </div>
        </>
          )}
      <GeneracionVentas2
        open={open}
        setOpen={setOpen}
        datos={dato}
        planes={planes}
      />
      <AgregarLlamada
        setProductos={setProductos}
        setTotal={setTotalRegistros}
        open={open2}
        setOpen={setOpen2}
      />
      {selectedid != 0 &&
        <EditarLlamada
            setProductos={setProductos}
            setSelectectId={setSelectectId}
            setTotal={setTotalRegistros}
            open={open3}
            setOpen={setOpen3}
            id={selectedid}
        />
      }
    </div>
  )
}
