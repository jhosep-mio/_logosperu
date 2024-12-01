/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import { Menu, MenuItem, MenuButton } from '@szhsin/react-menu'
import { RiFilter2Fill, RiSettings3Fill } from 'react-icons/ri'
import { Loading } from '../../../shared/Loading'
import { type ValuesPreventaModificate } from '../../../shared/schemas/Interfaces'
import { Paginacion } from '../../../shared/Paginacion'
import { quitarAcentos } from '../../../shared/functions/QuitarAcerntos'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { DeleteItemsNew } from '../../../shared/DeleteItemsNew'
import { cn } from '../../../shared/cn'
import { format } from 'date-fns'

export const ListaCupones = (): JSX.Element => {
  const { setTitle } = useAuth()
  const [loading, setLoading] = useState(true)
  const [cupones, setCupones] = useState<ValuesPreventaModificate[]>([])
  const token = localStorage.getItem('token')
  const [paginaActual, setpaginaActual] = useState<number>(1)
  const [cantidadRegistros] = useState(18)
  const [search, setSearch] = useState('')
  const [, setTotalRegistros] = useState(0)

  const getCupones = async (): Promise<void> => {
    try {
      const request = await axios.get(`${Global.url}/cuponesWebs/indexAll`, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      setCupones(request.data)
      console.log(request.data)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setTitle('Listado de cúpones')
    getCupones()
  }, [])

  const indexOfLastPost = paginaActual * cantidadRegistros
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros
  let totalPosts = cupones.length

  const filterDate = (): ValuesPreventaModificate[] => {
    let filteredProductos = cupones
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

  const preguntar = (id: number | null): void => {
    DeleteItemsNew({
      ruta: 'cuponesWebs/deleteOne',
      id,
      token,
      totalPosts,
      cantidadRegistros,
      paginaActual,
      setpaginaActual,
      rutaFetch: 'cuponesWebs/indexAll',
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setData: setCupones,
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
          </div>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className="lg:bg-[#fff] lg:px-8 lg:py-6 rounded-xl">
          <div className={'hidden lg:grid pr-10 lg:pr-4 items-center grid-cols-7 gap-4 mb-2 lg:px-4 lg:py-2 text-gray-400 border-y border-gray-300'}>
            <h5 className="lg:text-left line-clamp-1 col-span-1 ">ID</h5>
            <h5 className="lg:text-left col-span-1">Descuento</h5>
            <h5 className="lg:text-left col-span-1">COD. CÚPON</h5>
            <h5 className="lg:text-left col-span-1">Cliente</h5>
            <h5 className="lg:text-left col-span-1">Empresa</h5>
            <h5 className="lg:text-left line-clamp-1 ">Fecha de expiración</h5>
            <h5 className="lg:text-left line-clamp-1">Fecha de creacion</h5>
          </div>
          {filterDate().map((orden: any, index: number) => (
            <>
              <div
                className={`grid grid-cols-1 lg:grid-cols-7 lg:pr-4 relative gap-3 items-center mb-3 lg:mb-0 ${
                  index % 2 == 0 ? 'bg-transparent' : 'bg-gray-200'
                } lg:px-4 lg:py-3 rounded-xl relative shadow_class`}
                key={orden.id}
              >
                <div className="flex flex-col gap-3 lg:hidden bg-form p-4 rounded-xl">
                  <div className="lg:hidden flex justify-between gap-3">
                    <div className="lg:text-center ">
                      <h5 className="lg:hidden text-black font-bold mb-0 text-sm">ID</h5>
                      <span className="text-black">{orden.id}</span>
                    </div>
                    <div className="lg:text-right ">
                      <h5 className="lg:hidden text-black font-bold mb-0 text-sm bg text-right">COD. CÚPON</h5>
                      <span className="text-right w-full text-black line-clamp-1">{orden.codigo}</span>
                    </div>
                  </div>
                  <div className="lg:hidden flex justify-between gap-3">
                    <div className="lg:text-left">
                      <h5 className="lg:hidden text-black font-bold mb-0 text-sm bg text-left">Codigo</h5>
                      <span className="text-left block  w-fit px-2 rounded-md text-white">{orden.codigo}</span>
                    </div>
                    <div className="lg:text-right ">
                      <h5 className="lg:hidden text-black font-bold mb-0 text-sm bg text-right">Cliente</h5>
                      <span className="text-left w-full text-black line-clamp-1">
                        {orden.nombres} {orden.apellidos}
                      </span>
                    </div>
                  </div>
                  <div className="lg:hidden flex justify-between gap-3">
                    <div className="lg:text-left">
                      <h5 className="lg:hidden text-black font-bold mb-0 text-sm bg text-left">Empresa</h5>
                      <span className="text-left w-full text-black line-clamp-1">{orden.empresa}</span>
                    </div>
                    <div className="lg:text-right ">
                      <h5 className="lg:hidden text-black font-bold mb-0 text-sm bg text-right">Tiempo</h5>
                      <span className="text-right w-full text-black line-clamp-1">{orden.tiempo} días</span>
                    </div>
                  </div>
                </div>
                {/* PC */}
                <div className="hidden lg:block lg:text-center">
                  <span className="text-left block text-black w-full line-clamp-1">{orden.id}</span>
                </div>
                <div className="hidden lg:block lg:text-center">
                  <span className="text-left block text-black w-full line-clamp-1">S/ {orden.descuento}</span>
                </div>
                <div className="hidden lg:flex items-center lg:text-center relative h-full group">
                  <span
                    className={cn(
                      'text-left w-fit text-white line-clamp-1 transition-all px-2 rounded-lg h-full z-10',
                      orden.estado == 0 ? 'bg-green-600' : 'bg-red-600'
                    )}
                  >
                    {orden.codigo}
                  </span>
                </div>
                <Link to={`/admin/lista-clientes/editar/${orden.id}`} className="hidden lg:block lg:text-left  group" target="_blank">
                  <span className="text-left block  w-fit px-2 rounded-md text-black group-hover:text-blue-600 transition-colors">
                    {orden.nombres} {orden.apellidos}
                  </span>
                </Link>
                <div className="hidden lg:block lg:text-center relative h-full">
                  <span className="text-left text-black line-clamp-1 transition-all  hover:bg-white hover:absolute hover:w-[150%] hover:inset-0 w-full h-fit z-10">
                    {orden.empresa}
                  </span>
                </div>
                <div className="hidden lg:block lg:text-center relative h-full">
                  <span className="text-left text-black line-clamp-1 transition-all  hover:bg-white hover:absolute hover:w-[150%] hover:inset-0 w-full h-fit z-10">
                    {orden.fecha}
                  </span>
                </div>
                <div className="hidden lg:block lg:text-center relative h-full">
                  <span className="text-left text-black line-clamp-1 transition-all w-full h-fit z-10">
                    {format(new Date(orden.created_at), 'yyyy-MM-dd HH:mm:ss')}
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
                          to={`editar/${orden.id}`}
                          className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                        >
                          Editar
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem className="p-0 hover:bg-transparent">
                      <button
                        type="button"
                        onClick={() => {
                          preguntar(Number(orden.id))
                        }}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                      >
                        Eliminar cupón
                      </button>
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            </>
          ))}
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 justify-center lg:justify-between content_buttons pt-3 mt-5">
            <p className="text-md ml-1 text-black text-center">{totalPosts} Registros</p>
            <Paginacion totalPosts={totalPosts} cantidadRegistros={cantidadRegistros} paginaActual={paginaActual} setpaginaActual={setpaginaActual} />
          </div>
        </div>
      )}
    </>
  )
}
