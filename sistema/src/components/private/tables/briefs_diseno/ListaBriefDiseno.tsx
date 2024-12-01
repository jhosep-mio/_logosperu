import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu'
import { RiFilter2Fill } from 'react-icons/ri'
import { Loading } from '../../../shared/Loading'
import {
  type RolsValues,
  type interfaceListaDiseño
} from '../../../shared/schemas/Interfaces'
import { Paginacion } from '../../../shared/Paginacion'
import { getData, getDataBuscar } from '../../../shared/FetchingData'
import { DeleteItems } from '../../../shared/DeleteItems'

export const ListaBriefDiseño = (): JSX.Element => {
  const { auth, setTitle, roles } = useAuth()

  const token = localStorage.getItem('token')
  const [productos, setProductos] = useState<interfaceListaDiseño[]>([])
  const [loading, setLoading] = useState(true)
  const [, setTotalRegistros] = useState(0)
  const [paginaActual, setpaginaActual] = useState<number>(1)
  const [search, setSearch] = useState('')
  const [cantidadRegistros] = useState(4)

  const preguntar = (id: number | null): void => {
    DeleteItems({
      ruta: 'deleteBriefDiseno',
      id,
      token,
      totalPosts,
      cantidadRegistros,
      paginaActual,
      setpaginaActual,
      rutaFetch: 'getBriefs',
      setData: setProductos,
      setTotalRegistros
    })
  }

  const getAllBriefs = async (): Promise<void> => {
    setLoading(true)
    roles.map(
      (rol: RolsValues): void =>
        rol.id == auth.id_rol &&
        JSON.parse(rol.accesos).map(
          async (route: { peso: string }): Promise<void> => {
            if (route.peso == 'superusuario') {
              await Promise.all([
                getDataBuscar('getBriefsBuscar', setProductos, setTotalRegistros, search)
              ]).then(() => {
                setLoading(false)
              })
            } else {
              await Promise.all([
                getDataBuscar(
                  `getBriefsBuscarAsignacion/${auth.id}`,
                  setProductos,
                  setTotalRegistros,
                  search
                )
              ]).then(() => {
                setLoading(false)
              })
            }
          }
        )
    )
  }

  useEffect(() => {
    setTitle('Lista de Briefs Antiguos')
    roles.map(
      (rol: RolsValues): void =>
        rol.id == auth.id_rol &&
        JSON.parse(rol.accesos).map(
          async (route: { peso: string }): Promise<void> => {
            if (route.peso == 'superusuario') {
              await Promise.all([
                getData('getBriefs', setProductos, setTotalRegistros)
              ]).then(() => {
                setLoading(false)
              })
            } else {
              await Promise.all([
                getData(
                  `getBriefsAsignacion/${auth.id}`,
                  setProductos,
                  setTotalRegistros
                )
              ]).then(() => {
                setLoading(false)
              })
            }
          }
        )
    )
  }, [])

  const indexOfLastPost = paginaActual * cantidadRegistros
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros
  const totalPosts = productos.length

  const filterDate = (): interfaceListaDiseño[] => {
    return productos.slice(indexOfFirstPost, indexOfLastPost)
  }

  const onSeachChange = ({
    target
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setpaginaActual(1)
    setSearch(target.value)
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-y-4 mb-5">
        <div className="flex gap-2 items-center h-fit">
          <button className="bg-white hover:bg-gray-100 w-full md:w-fit flex items-center text-black gap-2 py-2 px-4 rounded-lg hover:text-main transition-colors">
            <RiFilter2Fill />{' '}
            <input
              placeholder="Buscar ..."
              className="bg-transparent outline-none"
              value={search}
              onChange={onSeachChange}
              type="search"
            />
          </button>
          <button className="bg-main h-full w-fit text-white px-4 py-2 rounded-md"
          onClick={() => { !loading && getAllBriefs() }}
          >
            Buscar
          </button>
        </div>
        <div className="w-full md:w-fit flex flex-col-reverse md:flex-row items-center gap-4">
          <Link
            to={'/admin/lista-briefs-diseños/agregar'}
            className="w-full md:w-fit inline-block rounded bg-main px-6 pb-2 pt-2.5 text-center text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-main-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-main-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-main-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
          >
            CREAR BRIEF
          </Link>
        </div>
      </div>
      {loading
        ? (
        <Loading />
          )
        : (
        <div className="bg-[#fff] p-8 rounded-xl">
          <div className="hidden md:grid grid-cols-1 md:grid-cols-7 gap-4 mb-10 p-4 rounded-md border-b-2 border-solid border-black-50">
            <h5 className="md:text-center text-black">ID</h5>
            <h5 className="md:text-center text-black">Cliente</h5>
            <h5 className="md:text-center text-black">Celular</h5>
            <h5 className="md:text-center text-black">Correo</h5>
            <h5 className="md:text-center text-black">Empresa</h5>
            <h5 className="md:text-center text-black">Fecha de creacion</h5>
            <h5 className="md:text-center text-black">Opciones</h5>
          </div>
          {filterDate().map((orden: interfaceListaDiseño) => (
            <div
              className="grid grid-cols-1 md:grid-cols-7 gap-4 items-center mb-4 bg-gray-50 p-4 rounded-xl shadow-sm cursor-pointer"
              key={orden.id}
            >
              <div className="md:text-center">
                <h5 className="text-black  md:hidden font-bold mb-2">ID</h5>
                <p className="line-clamp-2 text-black">#{orden.id}</p>
              </div>
              <div className="md:text-center md:flex md:justify-center">
                <h5 className="md:hidden text-black font-bold mb-2">Cliente</h5>
                <p className="line-clamp-2 text-black">{orden.nombres}</p>
              </div>
              <div className="md:text-center md:flex md:justify-center ">
                <h5 className="md:hidden text-black font-bold mb-2">Celular</h5>
                <p className="line-clamp-2 text-black">{orden.celular}</p>
              </div>

              <div className="md:text-center md:flex md:justify-center ">
                <h5 className="md:hidden text-black font-bold mb-2">Correo</h5>
                <p className="line-clamp-2 text-black">{orden.email}</p>
              </div>

              <div className="md:text-center md:flex md:justify-center ">
                <h5 className="md:hidden text-black font-bold mb-2">Empresa</h5>
                <p className="line-clamp-2 text-black">
                  {orden.nombre_empresa}
                </p>
              </div>

              <div className="md:text-center">
                <h5 className="md:hidden text-black font-bold mb-2">
                  Fecha de Creacion
                </h5>
                <span className="text-black">
                  {new Date(orden.created_at).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: '2-digit',
                    day: '2-digit'
                  })}{' '}
                  {new Date(orden.created_at).toLocaleTimeString()}
                </span>
              </div>

              <div className="md:text-center md:flex md:justify-center items-center">
                <h5 className="md:hidden text-white font-bold mb-2">
                  Acciones
                </h5>
                <Menu
                  menuButton={
                    <MenuButton className="flex items-center gap-x-2 bg-secondary-100 p-2 rounded-lg transition-colors">
                      Acciones
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
                        to={`/admin/lista-briefs-diseños/view/${orden.id}`}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center gap-x-4 p-2 flex-1"
                      >
                        Ver Brief
                      </Link>
                    )}
                  </MenuItem>

                  {roles.map(
                    (role: RolsValues): React.ReactNode =>
                      auth.id_rol == role.id &&
                      JSON.parse(role.accesos).map(
                        (route: { peso: string }) =>
                          route.peso == 'superusuario' &&
                          orden.id !== null && (
                            <>
                              <MenuItem className="p-0 hover:bg-transparent">
                                <Link
                                  to={`/admin/lista-briefs-diseños/asignar/${orden.id}`}
                                  className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center gap-x-4 p-2 flex-1"
                                >
                                  Asignar Diseñador
                                </Link>
                              </MenuItem>
                              <MenuItem className="p-0 hover:bg-transparent">
                                <Link
                                  to={`/admin/lista-briefs-diseños/editar/${orden.id}`}
                                  className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center gap-x-4 p-2 flex-1"
                                >
                                  Editar
                                </Link>
                              </MenuItem>
                              <MenuItem className="p-0 hover:bg-transparent">
                                <Link
                                  to=""
                                  onClick={() => {
                                    preguntar(orden.id)
                                  }}
                                  className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center gap-x-4 p-2 flex-1"
                                >
                                  Eliminar
                                </Link>
                              </MenuItem>
                            </>
                          )
                      )
                  )}
                </Menu>
              </div>
            </div>
          ))}

<div className="flex flex-col md:flex-row gap-5 md:gap-0 justify-center md:justify-between content_buttons pt-3">
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
          )}
    </>
  )
}
