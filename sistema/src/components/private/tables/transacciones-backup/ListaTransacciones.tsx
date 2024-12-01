import React, { useEffect, useState } from 'react'
import useAuth from '../../../../hooks/useAuth'
import { RiFilter2Fill } from 'react-icons/ri'
import { Loading } from '../../../shared/Loading'
import { type valuesTransaccion } from '../../../shared/schemas/Interfaces'
import { Paginacion } from '../../../shared/Paginacion'
import { getDataTransacciones } from '../../../shared/FetchingData'
import yape from './../../../../assets/pago/yape.png'
import { quitarAcentos } from '../../../shared/functions/QuitarAcerntos'
// import { GeneradorExcel } from '../../../shared/EXCEL/GeneradorExcel'

interface Filters {
  estado?: number | null
  enCola?: boolean | null
  fechaFin?: boolean | null
  activeFilter: null
  sinFechaFinYNo1: boolean | null
}

export const ListaTransacciones = (): JSX.Element => {
  const { setTitle } = useAuth()
  const [productos, setProductos] = useState<valuesTransaccion[]>([])
  const [loading, setLoading] = useState(true)
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [paginaActual, setpaginaActual] = useState<number>(1)
  const [search, setSearch] = useState('')
  const [cantidadRegistros] = useState(12)
  const [filters] = useState<Filters>({
    estado: null,
    fechaFin: null,
    enCola: null,
    activeFilter: null,
    sinFechaFinYNo1: null
  })
  // FUNCIONES
  useEffect(() => {
    setTitle('Listado de transacciones')
    Promise.all([
      getDataTransacciones('getTransacciones', setProductos, setTotalRegistros)
    ]).then(() => {
      setLoading(false)
    })
  }, [])

  const indexOfLastPost = paginaActual * cantidadRegistros
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros
  let totalPosts = productos.length

  const filterDate = (): valuesTransaccion[] => {
    let filteredProductos = productos
    const searchTerm = quitarAcentos(search)
    // ... puedes agregar otras condiciones de filtro aquí
    if (search.length > 0) {
      filteredProductos = filteredProductos.filter((pro) => {
        const fullName = `${pro.nombres} ${pro.apellidos}`.toLowerCase()
        return (
          quitarAcentos(fullName).includes(searchTerm) ||
          String(pro.id).includes(searchTerm)
        )
      })
    }

    totalPosts = filteredProductos.length
    return filteredProductos.slice(indexOfFirstPost, indexOfLastPost)
  }

  useEffect(() => {
    setTotalRegistros(totalPosts)
  }, [search, filters])

  const onSeachChange = ({
    target
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setpaginaActual(1)
    setSearch(target.value)
  }

  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-between gap-y-4 mb-3 md:mb-5 gap-2">
        <div className="w-full md:w-fit flex flex-col md:flex-row gap-2 items-center h-fit">
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
      {loading
        ? <Loading />
        : (
        <div className="md:bg-[#fff] md:px-8 md:py-6 rounded-xl">
          <div
            className={
              'hidden md:grid pr-10 lg:pr-4 items-center grid_cols_15 gap-4 mb-2 md:px-4 md:py-2 text-gray-400 border-y border-gray-300'
            }
          >
            <h5 className="md:text-left line-clamp-1 col-span-1">Monto</h5>
            <h5 className="md:text-left line-clamp-1  col-span-2">ID/Referencia</h5>
            <h5 className="md:text-center col-span-1">Marca</h5>
            <h5 className="md:text-left col-span-3">Nombres</h5>
            <h5 className="md:text-left line-clamp-1 col-span-2">
              Correo
            </h5>
            <h5 className="md:text-center col-span-2">Estado</h5>
            <h5 className="md:text-center col-span-2">Estado</h5>
          </div>
          {filterDate().map((orden: valuesTransaccion, index: number) => (
            <div
              className={`grid grid_cols_15 
              md:pr-10 lg:pr-4 relative gap-5 items-center mb-3 md:mb-0 ${
                index % 2 == 0 ? 'bg-transparent' : 'bg-gray-200'
              } md:px-4 md:py-3 rounded-xl relative shadow_class`}
              key={orden.id}
            >
              {/* PC */}
              <div className="hidden md:block md:text-center">
                <span className="text-left block text-black w-full line-clamp-1">
                  S/. {parseFloat(orden.total_pago) / 100}
                </span>
              </div>
              <div className="hidden md:block md:text-center relative h-full col-span-2">
                <span className="text-left text-black line-clamp-2  transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                  {orden.id_transaccion}
                </span>
              </div>
              <div className="hidden md:block md:text-center relative h-full col-span-1">
                <span className="text-left text-black line-clamp-1">
                  {(JSON.parse(orden.tipo).id).split('_')[0] == 'ype'
                    ? <img src={yape} alt="" className='w-8 h-8 object-contain mx-auto'/>
                    : null}
                </span>
              </div>
              <div className="hidden md:block md:text-center relative h-full col-span-3">
                <span className="text-left text-black line-clamp-1 ">
                  {orden.nombres} {orden.apellidos}
                </span>
              </div>
              <div className="hidden md:block md:text-center col-span-2">
                <span className="text-center block text-black">{orden.email}</span>
              </div>
              <div
                className={'hidden w-fit mx-auto md:flex gap-2 lg:px-2 items-center justify-center col-span-2 md:text-center bg-[#1A5515]'}
              >
                <span className="text-center gap-2 font-bold px-2 line-clamp-1 text-white">
                 Exitosa
                </span>
              </div>
              <div className="hidden md:block md:text-center col-span-2">
                <span className="text-center block text-black"> {new Date(orden.created_at).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: '2-digit',
                  day: '2-digit'
                })}{' '}
                    {new Date(orden.created_at).toLocaleTimeString()}</span>
              </div>
              {/* <div className="md:text-center md:flex md:justify-center items-center absolute right-0 top-0 bottom-0 my-auto">
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
                        to={`view/${orden.id}`}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                      >
                        Ver
                      </Link>
                    )}
                  </MenuItem>
                </Menu>
              </div> */}
            </div>
          ))}
          <div className="flex flex-col md:flex-row gap-6 md:gap-0 justify-center md:justify-between content_buttons pt-3 mt-5">
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
