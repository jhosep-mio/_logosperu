import React, { useEffect, useState } from 'react'
import useAuth from '../../../../hooks/useAuth'
import { RiFilter2Fill, RiSettings3Fill } from 'react-icons/ri'
import { Loading } from '../../../shared/Loading'
import { type ValuesPlanes } from '../../../shared/schemas/Interfaces'
import { Paginacion } from '../../../shared/Paginacion'
import { getDataToPlanes } from '../../../shared/FetchingData'
import { quitarAcentos } from '../../../shared/functions/QuitarAcerntos'
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu'
import { Link } from 'react-router-dom'

export const ListaPlanes = (): JSX.Element => {
  const { setTitle } = useAuth()

  // const token = localStorage.getItem('token')
  const [productos, setProductos] = useState<ValuesPlanes[]>([])
  const [loading, setLoading] = useState(true)
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [paginaActual, setpaginaActual] = useState<number>(1)
  const [search, setSearch] = useState('')
  const [cantidadRegistros] = useState(4)

  useEffect(() => {
    setTitle('Listado de planes')
    Promise.all([
      getDataToPlanes('getPlanes', setProductos, setTotalRegistros)
    ]).then(() => {
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    setTotalRegistros(totalPosts)
  }, [search])

  const indexOfLastPost = paginaActual * cantidadRegistros
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros
  let totalPosts = productos.length

  const filterDate = (): ValuesPlanes[] => {
    if (search.length === 0) {
      const producto = productos.slice(indexOfFirstPost, indexOfLastPost)
      return producto
    }

    const filter = productos.filter((pro) => {
      return (
        quitarAcentos(pro.nombre.toLowerCase()).includes(quitarAcentos(search.toLowerCase())) ||
        quitarAcentos(pro.codigo.toLowerCase()).includes(quitarAcentos(search.toLowerCase())) ||
        String(pro.id).includes((search))
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

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-y-4 mb-5">
        <div className="flex gap-2 items-center h-fit">
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
        <div className="w-full md:w-fit flex flex-col-reverse md:flex-row items-center md:gap-4">
          <Link
            to={'agregar'}
            className="w-full md:w-fit inline-block rounded bg-main md:px-6 pb-2 pt-2.5 text-center text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-main-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-main-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-main-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
          >
            REGISTRO
          </Link>
        </div>
      </div>
      {loading
        ? (
        <Loading />
          )
        : (
        <div className="md:bg-[#fff] md:p-8 rounded-xl">
          <div className="hidden md:grid grid-cols-1 md:grid-cols-5 gap-4 mb-10 p-4 rounded-md border-b-2 border-solid border-black-50">
            <h5 className="md:text-center text-black">ID</h5>
            <h5 className="md:text-center text-black">NOMBRE</h5>
            <h5 className="md:text-center text-black">CÓDIGO</h5>
            <h5 className="md:text-center text-black">DESCRIPCIÓN</h5>
          </div>
          {filterDate().map((orden: ValuesPlanes) => (
            <div
              className="grid grid-cols-1 relative md:grid-cols-5 gap-4 items-center mb-4 bg-white md:bg-gray-50 p-4 rounded-xl shadow-sm cursor-pointer"
              key={orden.id}
            >
              <div className="md:text-center">
                <h5 className="text-black  md:hidden font-bold mb-2">ID</h5>
                <p className="line-clamp-2 text-black">#{orden.id}</p>
              </div>

              <div className="md:text-center md:flex md:justify-center">
                <h5 className="md:hidden text-black font-bold mb-2">Nombre</h5>
                <p className="line-clamp-2 text-black">
                  {orden.nombre}
                </p>
              </div>

              <div className="md:text-center md:flex md:justify-center">
                <h5 className="md:hidden text-black font-bold mb-2">Codigo</h5>
                <p className="line-clamp-2 text-black">
                  {orden.codigo}
                </p>
              </div>

              <div className="md:text-center md:flex md:justify-center ">
                <h5 className="md:hidden text-black font-bold mb-2">
                  Descripción
                </h5>
                <p className="line-clamp-2 text-black">
                  {orden.descripcion}
                </p>
              </div>

              <div className="md:text-center md:flex md:justify-center items-center absolute md:relative right-0 top-0">
                <Menu
                  menuButton={
                    <MenuButton className="block p-2">
                      <RiSettings3Fill className="text-[#202020] text-2xl" />
                    </MenuButton>
                  }
                  align="end"
                  arrow
                  transition
                  menuClassName="bg-secondary-100 p-4"
                >
                  <MenuItem className="p-0 hover:bg-transparent">
                    <Link
                      to={`editar/${orden.id}`}
                      className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                    >
                      Editar
                    </Link>
                  </MenuItem>
                </Menu>
              </div>
            </div>
          ))}

          <div className="flex flex-col md:flex-row gap-5 md:gap-0 justify-center md:justify-between content_buttons pt-3">
            <p className="text-md ml-1 text-black text-center">
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
