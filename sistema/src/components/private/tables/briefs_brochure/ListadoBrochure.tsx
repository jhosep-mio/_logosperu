import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu'
import { RiFilter2Fill } from 'react-icons/ri'
import { Loading } from '../../../shared/Loading'
import {
  type RolsValues,
  type interfaceListaDiseñoNew
} from '../../../shared/schemas/Interfaces'
import { Paginacion } from '../../../shared/Paginacion'
import { getDataNew } from '../../../shared/FetchingData'
// import { DeleteItemsNew } from '../../../shared/DeleteItemsNew'
import { quitarAcentos } from '../../../shared/functions/QuitarAcerntos'

export const ListadoBrochure = (): JSX.Element => {
  const { auth, setTitle, roles } = useAuth()

  // const token = localStorage.getItem('token')
  const [productos, setProductos] = useState<interfaceListaDiseñoNew[]>([])
  const [loading, setLoading] = useState(true)
  const [, setTotalRegistros] = useState(0)
  const [paginaActual, setpaginaActual] = useState<number>(1)
  const [search, setSearch] = useState('')
  const [cantidadRegistros] = useState(4)

  useEffect(() => {
    setTitle('Listado de Briefs - Brochure')
    roles.map(
      (rol: RolsValues): void =>
        rol.id == auth.id_rol &&
        JSON.parse(rol.accesos).map(
          async (route: { peso: string }): Promise<void> => {
            if (route.peso == 'superusuario') {
              await Promise.all([
                getDataNew('getBriefBrochure', setProductos, setTotalRegistros)
              ]).then(() => {
                setLoading(false)
              })
            } else {
              await Promise.all([
                getDataNew(
                  `getBrochueresAsignaciom/${auth.id}`,
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
  let totalPosts = productos.length

  const onSeachChange = ({
    target
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setpaginaActual(1)
    setSearch(target.value)
  }

  const filterDate = (): interfaceListaDiseñoNew[] => {
    if (search.length === 0) {
      const producto = productos.slice(indexOfFirstPost, indexOfLastPost)
      return producto
    }

    const filter = productos.filter((pro) => {
      const fullName = `${pro.nombres} ${pro.apellidos}`.toLowerCase()
      const searchTerm = quitarAcentos(search.toLowerCase())

      return (
        quitarAcentos(fullName).includes(searchTerm) ||
        quitarAcentos(pro.nombre_empresa.toLowerCase()).includes(quitarAcentos(search.toLowerCase())) ||
        String(pro.id).includes((search)) ||
        String(pro.celular).includes((search)) ||
        String(pro.email).includes((search)) ||
        String(pro.id_contrato.toLowerCase()).includes((search.toLowerCase()))
      )
    })

    totalPosts = filter.length
    return filter.slice(indexOfFirstPost, indexOfLastPost)
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
        </div>
        <div className="w-full md:w-fit flex flex-col-reverse md:flex-row items-center gap-4">
          <Link
            to={'agregar'}
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
        <div className="md:bg-[#fff] md:p-8 rounded-xl">
          <div className="hidden md:grid grid-cols-1 md:grid-cols-8 gap-4 mb-10 p-4 items-center rounded-md border-b-2 border-solid border-black-50">
            <h5 className="md:text-center text-black">ID</h5>
            <h5 className="md:text-center text-black">CD. Contrato</h5>
            <h5 className="md:text-center text-black">Cliente</h5>
            <h5 className="md:text-center text-black">Celular</h5>
            <h5 className="md:text-center text-black">Correo</h5>
            <h5 className="md:text-center text-black">Empresa</h5>
            <h5 className="md:text-center text-black">Fecha de creacion</h5>
            <h5 className="md:text-center text-black">Opciones</h5>
          </div>
          {filterDate().map((orden: interfaceListaDiseñoNew) => (
            <div
              className="grid grid-cols-1 md:grid-cols-8 gap-4 items-center mb-4 bg-white md:bg-gray-50 p-4 rounded-xl shadow-sm cursor-pointer"
              key={orden.id}
            >
              <div className="md:text-center">
                <h5 className="text-black  md:hidden font-bold mb-2">ID</h5>
                <p className="line-clamp-2 text-black">#{orden.id}</p>
              </div>
              <div className="md:text-center md:flex md:justify-center">
                <h5 className="md:hidden text-black font-bold mb-2">
                  CD. Contrato
                </h5>
                <p className="line-clamp-2 text-black">{orden.id_contrato}</p>
              </div>
              <div className="md:text-center md:flex md:justify-center">
                <h5 className="md:hidden text-black font-bold mb-2">Cliente</h5>
                <p className="line-clamp-2 text-black">
                  {orden.nombres} {orden.apellidos}
                </p>
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
                        to={`/admin/lista-briefs-brochure/view/${orden.id}`}
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
                                  to={`/admin/lista-briefs-brochure/asignar/${orden.id}`}
                                  className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center gap-x-4 p-2 flex-1"
                                >
                                  Asignar Diseñador
                                </Link>
                              </MenuItem>
                              <MenuItem className="p-0 hover:bg-transparent">
                                <Link
                                  to={`/admin/lista-briefs-brochure/editar/${orden.id}`}
                                  className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center gap-x-4 p-2 flex-1"
                                >
                                  Editar
                                </Link>
                              </MenuItem>
                              {/* <MenuItem className="p-0 hover:bg-transparent">
                                <Link
                                  to=""
                                  onClick={() => {
                                    preguntar(orden.id)
                                  }}
                                  className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center gap-x-4 p-2 flex-1"
                                >
                                  Eliminar
                                </Link>
                              </MenuItem> */}
                            </>
                          )
                      )
                  )}
                </Menu>
              </div>
            </div>
          ))}

          <div className="flex flex-col md:flex-row gap-5 md:gap-0 justify-center md:justify-between content_buttons pt-3">
            <p className="text-md ml-1 text-black text-center">
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
