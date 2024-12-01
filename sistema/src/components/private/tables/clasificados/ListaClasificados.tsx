import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu'
import { RiFilter2Fill, RiSettings3Fill } from 'react-icons/ri'
import { Loading } from '../../../shared/Loading'
import {
  type clasificadosValues
} from '../../../shared/schemas/Interfaces'
import { Paginacion } from '../../../shared/Paginacion'
import { getClasificados } from '../../../shared/FetchingData'
import { quitarAcentos } from '../../../shared/functions/QuitarAcerntos'
import { Global } from '../../../../helper/Global'

export const ListaClasificados = (): JSX.Element => {
  const { setTitle } = useAuth()
  const [productos, setProductos] = useState<clasificadosValues[]>([])
  const [loading, setLoading] = useState(true)
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [paginaActual, setpaginaActual] = useState<number>(1)
  const [search, setSearch] = useState('')
  const [cantidadRegistros] = useState(14)

  useEffect(() => {
    setTitle('Listado de clasificados')
    Promise.all([
      getClasificados('getClasificados', setProductos, setTotalRegistros)
    ]).then(() => {
      setLoading(false)
    })
  }, [])

  const indexOfLastPost = paginaActual * cantidadRegistros
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros
  let totalPosts = productos.length

  const filterDate = (): clasificadosValues[] => {
    if (search.length === 0) {
      const producto = productos.slice(indexOfFirstPost, indexOfLastPost)
      return producto
    }
    const searchTerm = quitarAcentos(search.toLowerCase())

    const filter = productos.filter((pro) => {
      return (
        String(pro.id).includes(searchTerm)
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

  return (
    <>
      <div
        className="w-full flex flex-row items-center justify-between gap-y-4 gap-2 md:gap-0 mb-5"
        id="pdf-content"
      >
        <div className="w-full md:w-fit flex gap-2 items-center h-fit">
          <button className="bg-white hover:bg-gray-100 w-full md:w-[500px] flex items-center text-black gap-2 py-2 px-4 rounded-lg hover:text-main transition-colors">
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
            to={'registro'}
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
        <div className="md:bg-[#fff] p-0 md:p-8 rounded-xl">
          <div className="hidden md:grid grid-cols-1 md:grid-cols-8 gap-3 mb-2 md:px-4 md:py-2 text-gray-400 border-y border-gray-300">
            <h5 className="md:text-left line-clamp-1">ID</h5>
            <h5 className="md:text-left line-clamp-1 ">Nombre</h5>
            <h5 className="md:text-left line-clamp-1 w-full">Logo</h5>
            <h5 className="md:text-left line-clamp-1 ">Correo</h5>
            <h5 className="md:text-center line-clamp-1 md:block">Celular</h5>
            <h5 className="md:text-center line-clamp-1 md:block">Contraseña</h5>
            <h5 className="md:text-center line-clamp-1">Fecha de creación</h5>
            <h5 className="md:text-center line-clamp-1"></h5>
          </div>
          {filterDate().map(
            (orden: clasificadosValues, index: number) => (
              <div
                className={`grid grid-cols-1 md:grid-cols-8 relative gap-3 items-center mb-3 md:mb-0 ${
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

                      </span>
                    </div>
                    <div className="md:text-right ">
                      <h5 className="md:hidden text-black font-bold mb-0 text-sm bg text-right">
                        Celular
                      </h5>
                      <span className="text-right w-full text-black line-clamp-1">
                      </span>
                    </div>
                  </div>
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
                      </span>
                    </div>
                  </div>
                </div>
                <div className="hidden md:block md:text-center">
                  <span className="text-left block text-black w-full line-clamp-1">
                    #{orden.id}
                  </span>
                </div>
                <div className="hidden md:block md:text-center col-span-1">
                  <div className="line-clamp-1">
                    <span className="text-left block text-black w-full lowercase first-letter:uppercase">
                      {(JSON.parse(orden.pagina_web)).configuracion.nombre}
                    </span>
                  </div>
                </div>
                <div className="hidden md:block md:text-center">
                  <div className="line-clamp-1">
                    <span className="text-left block text-black w-full lowercase first-letter:uppercase">
                        {(JSON.parse(orden.pagina_web)).configuracion?.logo &&
                        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                        <img src={`${Global.urlImages}/clasificados/${JSON.parse(orden.pagina_web).configuracion?.logo}`}
                        className ='w-[100px] h-[50px] object-contain'
                        alt="" />
                        }
                    </span>
                  </div>
                </div>
                <div className="hidden md:block md:text-center">
                  <span className="text-left block text-black w-full line-clamp-1">
                    {(JSON.parse(orden.pagina_web)).configuracion.correo}
                  </span>
                </div>
                <div className="hidden md:block md:text-center">
                  <span className="text-center block text-black w-full line-clamp-1">
                    {(JSON.parse(orden.pagina_web)).configuracion.celular}
                  </span>
                </div>
                <div className="hidden md:block md:text-center">
                  <span className="text-center block text-black w-full line-clamp-1">
                    {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-expect-error
                    orden.password}
                  </span>
                </div>
                <div className="hidden md:block md:text-center">
                  <p className="line-clamp-2 text-black">
                    {new Date(orden.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })}{' '}
                    {new Date(orden.created_at).toLocaleTimeString()}
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
                      <Link
                        to={`editar/${orden.id}`}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                      >
                        Editar
                      </Link>
                    </MenuItem>
                    <MenuItem className="p-0 hover:bg-transparent">
                      <Link
                        target='_blank'
                        to={`https://clasificados.logosperu.com.pe/${orden.id}`}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                      >
                        Visitar web
                      </Link>
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            )
          )}
          <div className="flex flex-col md:flex-row gap-5 md:gap-0 justify-center md:justify-between content_buttons pt-3 mt-5">
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
