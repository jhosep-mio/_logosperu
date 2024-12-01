/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-unmodified-loop-condition */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { RiFilter2Fill, RiSettings3Fill } from 'react-icons/ri'
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu'
// import { GeneradorExcel } from '../../../shared/EXCEL/GeneradorExcel'
import useAuth from '../../../../hooks/useAuth'
import { type arrayContacto, type errorValues, type ValuesVenta } from '../../../shared/schemas/Interfaces'
import { limpiarCadena, quitarAcentos } from '../../../shared/functions/QuitarAcerntos'
import { Loading } from '../../../shared/Loading'
import { Paginacion } from '../../../shared/Paginacion'
import { ModalRegistro } from './ModalRegistro'
import axios from 'axios'
import { Global } from '../../../../helper/Global'

export const ListaSoporteHosting = (): JSX.Element => {
  const { setTitle } = useAuth()
  const [productos, setProductos] = useState<ValuesVenta[]>([])
  const [loading, setLoading] = useState(true)
  const [, setTotalRegistros] = useState(0)
  const [paginaActual, setpaginaActual] = useState<number>(1)
  const [search, setSearch] = useState('')
  const [cantidadRegistros] = useState(12)
  const [showError, setShowError] = useState<errorValues | null>(null)
  const [open, setOpen] = useState<any>({ estado: false, id: null, nombre_cliente: null, nombre_empresa: null, email: null })
  const token = localStorage.getItem('token')

  const getSoporteHosting = async (): Promise<void> => {
    try {
      setLoading(true)
      const request = await axios.get(`${Global.url}/indexToSoporte`, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      setProductos(request.data)
      setTotalRegistros(request.data.length)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setTitle('Listado de hosting')
    getSoporteHosting()
  }, [])

  const indexOfLastPost = paginaActual * cantidadRegistros
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros
  let totalPosts = productos.length

  const filterDate = (): ValuesVenta[] => {
    let filteredProductos = productos
    // ... puedes agregar otras condiciones de filtro aquí
    if (search.length > 0) {
      filteredProductos = filteredProductos.filter((pro: any) => {
        const host = pro.hosting ? JSON.parse(pro.hosting) : ''
        return (
          quitarAcentos(pro.nombres.toLowerCase()).includes(
            quitarAcentos(search.toLowerCase())
          ) ||
          quitarAcentos((host?.marca ? host?.marca : '').toLowerCase()).includes(
            quitarAcentos(search.toLowerCase())
          ) ||
          quitarAcentos(pro.apellidos.toLowerCase()).includes(
            quitarAcentos(search.toLowerCase())
          ) ||
          String(host?.dominio).includes(
            quitarAcentos(search.toLowerCase())
          ) ||
          String(pro.id).includes(search)
        )
      })
    }

    totalPosts = filteredProductos.length
    return filteredProductos.slice(indexOfFirstPost, indexOfLastPost)
  }

  useEffect(() => {
    setTotalRegistros(totalPosts)
  }, [search, productos])

  const onSeachChange = ({
    target
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setpaginaActual(1)
    setSearch(target.value)
  }

  useEffect(() => {
    setTimeout(() => {
      if (showError != null) {
        setShowError(null)
      }
    }, 3000)
  }, [showError])

  return (
    <>
      <div className="flex flex-row items-center justify-between gap-y-4 mb-3 md:mb-5 gap-2">
        <div className="w-full md:w-full flex flex-col md:flex-row gap-2 items-center h-fit">
          <button className="bg-white hover:bg-gray-100 w-full md:w-fit flex items-center text-black gap-2 py-2 px-4 rounded-lg hover:text-main transition-colors">
            <RiFilter2Fill />
            <input
              placeholder="Buscar ..."
              className="bg-transparent outline-none"
              value={search}
              onChange={onSeachChange}
              type="search"
            />
          </button>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className="lg:bg-[#fff] md:p-8 rounded-xl">
          <div
            className={`hidden lg:grid pr-10 lg:pr-4 items-center grid-cols-16 
              gap-4 mb-2 lg:px-4 lg:py-2 text-gray-400 border-y border-gray-300`}
          >
            <h5 className="lg:text-left line-clamp-1 col-span-1">Contrato</h5>
            <h5 className="lg:text-left line-clamp-1 col-span-2 ">Plan</h5>
            <h5 className="lg:text-left col-span-3">Cliente</h5>
            <h5 className="lg:text-left col-span-3">Marca</h5>
            <h5 className="lg:text-center line-clamp-1 col-span-2">Dominio</h5>
            <h5 className="lg:text-center col-span-2">Estado</h5>
            <h5 className="lg:text-center col-span-2">Fecha de inicio</h5>
          </div>
          {filterDate().map((orden: any, index: number) => (
            <div
              className={`grid grid-cols-16 
           md:pr-10 lg:pr-4 relative gap-3 items-center mb-3 lg:mb-0 ${
             index % 2 == 0 ? 'bg-transparent' : 'bg-gray-200'
           } lg:px-4 lg:py-3 rounded-xl  shadow_class
           md:pr-0 lg:pr-4 relative gap-3 items-center mb-3 lg:mb-0 
           `}
              key={orden.id}
            >
              <div
                // to={`view-servicio/${orden.id}`}
                className="flex flex-col gap-3 lg:hidden bg-form p-4 rounded-xl"
              >
                <div className="flex justify-between">
                  <div className="flex lg:hidden gap-4 items-center">
                    {orden.estado == '1' ? (
                      <span className="flex items-center justify-center bg-red-400 text-red-600  w-8 h-8 rounded-full">
                        A
                      </span>
                    ) : orden.fecha_fin != null ? (
                      <span className="flex items-center justify-center bg-[#b3dba1] text-green-700 w-8 h-8 rounded-full">
                        T
                      </span>
                    ) : !orden.fecha_inicio && !orden.fecha_alta ? (
                      <span className="flex items-center justify-center bg-yellow-300 text-yellow-600 w-8 h-8 rounded-full">
                        C
                      </span>
                    ) : (
                      <span className="flex items-center justify-center bg-gray-300 text-gray-500 w-8 h-8 rounded-full">
                        P
                      </span>
                    )}
                    <span className="flex lg:justify-left items-center gap-3 font-bold text-black">
                      {limpiarCadena(orden.correlativo)}
                    </span>
                  </div>
                </div>
                <div className="lg:hidden flex justify-between gap-3">
                  <div className="lg:text-center ">
                    <h5 className="lg:hidden text-black font-bold mb-0 text-sm">
                      Cliente
                    </h5>
                    {orden.id_contacto ? (
                      <>
                        {orden.arraycontacto &&
                          JSON.parse(orden.arraycontacto).length > 0 &&
                          JSON.parse(orden.arraycontacto)
                            .filter(
                              (contacto: arrayContacto) =>
                                String(contacto.id ?? '') == orden.id_contacto
                            )
                            .map((contacto: arrayContacto) => (
                              <span
                                key={contacto.id}
                                className="text-left w-full text-black line-clamp-1"
                              >
                                {contacto.nombres}
                              </span>
                            ))}
                      </>
                    ) : (
                      <span className="text-left w-full text-black line-clamp-1">
                        {orden.nombres} {orden.apellidos}
                      </span>
                    )}
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
                      {'HOSTING'}
                    </span>
                  </div>
                </div>
              </div>
              {/* PC */}
              <div className="hidden lg:block md:text-center col-span-1">
                <span className="text-left block text-black w-full line-clamp-1">
                  {limpiarCadena(orden.correlativo)}
                </span>
              </div>
              <div className="hidden lg:block lg:text-center col-span-2 relative h-full">
                <span className="text-left text-black line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                  {JSON.parse(orden.hosting).tiposervicio}
                </span>
              </div>
              <div className="hidden lg:block lg:text-center col-span-3 relative h-full">
                <span className="text-left text-black line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                  {orden.nombres} {orden.apellidos}
                </span>
              </div>
              <div className="hidden lg:block lg:text-center col-span-3 relative h-full">
                <span className="text-left text-black line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                  {JSON.parse(orden.hosting).marca}
                </span>
              </div>
              <div className="hidden lg:block md:text-center col-span-2">
                <a
                  href={`https://${JSON.parse(orden.hosting).dominio}`}
                  target="_blank"
                  className="text-center  text-blue-600 transition-colors line-clamp-1"
                  rel="noreferrer"
                >
                  {JSON.parse(orden.hosting).dominio}
                </a>
              </div>
              <div
                className={`hidden mx-auto lg:flex w-[80%] gap-2 lg:px-2 items-center justify-center col-span-2 lg:text-center ${
                  orden.activehosting != '1'
                    ? 'bg-[#FDD4D4] text-white'
                    : 'bg-[#D1FAEF] text-white'
                }`}
              >
                {orden.activehosting != '1' ? (
                  <>
                    {/* <BsCheckCircle className="hidden lg:block" /> */}
                    <span className="text-center  text-[#F53031] font-medium  line-clamp-1">
                      Inactivo
                    </span>
                  </>
                ) : (
                  <>
                    {/* <BsCheckCircle className="hidden lg:block" /> */}
                    <span className="text-center text-[#1BBA94] font-medium  line-clamp-1">
                      Activo
                    </span>
                  </>
                )}
              </div>
              <div className="hidden lg:block md:text-center col-span-2">
                <span className="text-cener block text-black">
                  {JSON.parse(orden.hosting).inicio}
                </span>
              </div>

              <div className="md:text-center md:flex md:justify-center items-center absolute right-0 top-0 bottom-0 my-auto">
                <Menu
                  menuButton={
                    <MenuButton className="block p-2">
                      <RiSettings3Fill className="text-[#202020bc] text-lg" />
                    </MenuButton>
                  }
                  align="end"
                  arrow
                  transition
                  menuClassName="bg-secondary-100 p-4"
                >
                  <MenuItem className="p-0 hover:bg-transparent">
                    {orden.id != null && (
                      <button
                        onClick={() => { setOpen({ estado: true, id: orden.id, nombre_cliente: `${JSON.parse(orden.hosting).nombres} ${JSON.parse(orden.hosting).apellidos}`, nombre_empresa: JSON.parse(orden.hosting).marca, email: JSON.parse(orden.hosting).email}) }}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                      >
                        Registrar soporte

                      </button>
                    )}
                  </MenuItem>
                  <MenuItem className="p-0 hover:bg-transparent">
                      <Link
                        to={`/admin/lista-hosting/avances/${orden.id ?? ''}`}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                      >
                        Detalle Hosting
                      </Link>
                  </MenuItem>
                </Menu>
              </div>
            </div>
          ))}

          <div className="flex flex-col md:flex-row gap-5 md:gap-0 justify-center md:justify-between content_buttons pt-3">
            <p className="text-md ml-1 text-black">{totalPosts} Registros</p>
            <Paginacion
              totalPosts={totalPosts}
              cantidadRegistros={cantidadRegistros}
              paginaActual={paginaActual}
              setpaginaActual={setpaginaActual}
            />
          </div>
        </div>
      )}
      <ModalRegistro open={open} setOpen={setOpen} getSoporteHosting={getSoporteHosting}/>
    </>
  )
}
