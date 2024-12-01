import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu'
import { RiFilter2Fill, RiSettings3Fill } from 'react-icons/ri'
import useAuth from '../../../../../hooks/useAuth'
import { type ValuesCategoriasPortafolio } from '../../../../shared/schemas/Interfaces'
import { getDataCategoriasToPortafolio } from '../../../../shared/FetchingData'
import { quitarAcentos } from '../../../../shared/functions/QuitarAcerntos'
import { Loading } from '../../../../shared/Loading'
import { Paginacion } from '../../../../shared/Paginacion'
import { DeleteItemsCategoriasToPortafolio } from '../../../../shared/functions/DeleteItemsCategoriasToPortafolio'

export const ListaCategoriasPortafolio = (): JSX.Element => {
  const { setTitle } = useAuth()
  const [productos, setProductos] = useState<ValuesCategoriasPortafolio[]>([])
  const [loading, setLoading] = useState(true)
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [paginaActual, setpaginaActual] = useState<number>(1)
  const [search, setSearch] = useState('')
  const [cantidadRegistros] = useState(4)

  useEffect(() => {
    setTitle('Listado de Categorias - Portafolio')
    Promise.all([
      getDataCategoriasToPortafolio(
        'getCategoriasToPortafolio',
        setProductos,
        setTotalRegistros
      )
    ]).then(() => {
      setLoading(false)
    })
  }, [])

  const indexOfLastPost = paginaActual * cantidadRegistros
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros
  let totalPosts = productos.length

  const filterDate = (): ValuesCategoriasPortafolio[] => {
    if (search.length === 0) {
      const producto = productos.slice(indexOfFirstPost, indexOfLastPost)
      return producto
    }

    const filter = productos.filter((pro) => {
      return quitarAcentos(pro.titulo.toLowerCase()).includes(
        quitarAcentos(search.toLocaleLowerCase())
      )
    })

    totalPosts = filter.length
    return filter.slice(indexOfFirstPost, indexOfLastPost)
  }

  useEffect(() => {
    setTotalRegistros(totalPosts)
  }, [search])

  const onSeachChange = ({
    target
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setpaginaActual(1)
    setSearch(target.value)
  }

  const preguntar = (id: number): void => {
    const token = localStorage.getItem('token')
    DeleteItemsCategoriasToPortafolio({
      ruta: 'deleteCategoriaToPortafolio',
      id,
      token,
      totalPosts,
      cantidadRegistros,
      paginaActual,
      setpaginaActual,
      rutaFetch: 'getCategoriasToPortafolio',
      setData: setProductos,
      setTotalRegistros
    })
  }

  return (
    <>
      <div
        className="w-full flex flex-col md:flex-row items-center justify-between gap-y-4 gap-2 md:gap-0 mb-5"
        id="pdf-content"
      >
        <div className="w-full md:w-fit flex gap-2 items-center h-fit">
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
        <div className="bg-[#fff] p-3 md:p-8 rounded-xl">
          <div className="hidden md:grid grid-cols-1 md:grid-cols-4 gap-4 mb-10 p-4 rounded-md border-b-2 border-solid border-black-50">
            <h5 className="md:text-center text-black">ID</h5>
            <h5 className="md:text-center text-black">Titulo</h5>
            <h5 className="md:text-center text-black">URL</h5>
            <h5 className="md:text-center text-black">Opciones</h5>
          </div>
          {filterDate().map((orden: ValuesCategoriasPortafolio) => (
            <div
              className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4 items-center mb-4 bg-gray-50 p-4 rounded-xl shadow-sm cursor-pointer relative"
              key={orden.id}
            >
              <div className="md:text-center">
                <h5 className="text-black  md:hidden font-bold mb-2">ID</h5>
                <p className="line-clamp-2 text-black">#{orden.id}</p>
              </div>

              <div className="md:text-center md:flex md:justify-center">
                <h5 className="md:hidden text-black font-bold mb-2">Titulo</h5>
                <p className="line-clamp-2 text-black">{orden.titulo}</p>
              </div>

              <div className="md:text-center md:flex md:justify-center">
                <h5 className="md:hidden text-black font-bold mb-2">URL</h5>
                <p className="line-clamp-2 text-black">{orden.url}</p>
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
                  <MenuItem className="p-0 hover:bg-transparent">
                    <Link
                      to={'#'}
                      onClick={() => { preguntar(orden.id) }}
                      className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                    >
                      Eliminar
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
