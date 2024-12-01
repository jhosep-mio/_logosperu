import React, { useEffect, useState } from 'react'
import useAuth from '../../../../hooks/useAuth'
import { RiFileExcel2Fill, RiFilter2Fill, RiSettings3Fill } from 'react-icons/ri'
import { Loading } from '../../../shared/Loading'
import { type ValuesVenta } from '../../../shared/schemas/Interfaces'
import { Paginacion } from '../../../shared/Paginacion'
import { quitarAcentos } from '../../../shared/functions/QuitarAcerntos'
import { getDataVentas } from '../../../shared/FetchingData'
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu'
import { Link, useNavigate } from 'react-router-dom'
import Swal from 'sweetalert2'
import axios from 'axios'
import { Global } from '../../../../helper/Global'

export const ListaVentasPre = (): JSX.Element => {
  const { setTitle } = useAuth()

  const token = localStorage.getItem('token')
  const [productos, setProductos] = useState<ValuesVenta[]>([])
  const [loading, setLoading] = useState(true)
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [paginaActual, setpaginaActual] = useState<number>(1)
  const [search, setSearch] = useState('')
  const [cantidadRegistros] = useState(4)
  const navigate = useNavigate()

  useEffect(() => {
    setTitle('Listado de Preventas')
    Promise.all([
      getDataVentas('getVentasPre', setProductos, setTotalRegistros)
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

  const filterDate = (): ValuesVenta[] => {
    if (search.length === 0) {
      const producto = productos.slice(indexOfFirstPost, indexOfLastPost)
      return producto
    }

    const filter = productos.filter((pro) => {
      return (
        quitarAcentos(pro.nombres.toLowerCase()).includes(quitarAcentos(search.toLowerCase())) ||
        quitarAcentos(pro.apellidos.toLowerCase()).includes(quitarAcentos(search.toLowerCase())) ||
        String(pro.id).includes((search)) ||
        String(pro.celular).includes((search))
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

  const preguntarPreventa = (id: number): void => {
    Swal.fire({
      title: '¿Estas seguro de mover el registro a ventas?',
      showDenyButton: true,
      confirmButtonText: 'Mover',
      denyButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed) {
        moverPreventa(id)
      }
    })
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
        navigate('/admin/lista-ventas')
      } else {
        Swal.fire('Error', '', 'error')
      }
    } catch (error) {
      console.log(error)
      Swal.fire('Error', '', 'error')
    }
  }

  const exportExcel = (): void => {
    localStorage.setItem('TableCliente', JSON.stringify(productos))
    window.open('/admin/lista-preventa/status', '_blank')
  }

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-y-4 mb-5">
        <div className="flex flex-col-reverse md:flex-row gap-2 items-center h-fit w-full justify-between">
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
           <div className='flex gap-3 items-center'>
                <RiFileExcel2Fill className='text-3xl text-green-700 cursor-pointer' onClick={() => { exportExcel() }}/>
                <h2 className='text-black font-bold'>VENTAS NO CONCLUIDAS</h2>
           </div>
        </div>
      </div>
      {loading
        ? (
        <Loading />
          )
        : (
        <div className="md:bg-[#fff] py-0 md:p-8 rounded-xl">
          <div className="hidden md:grid grid-cols-1 md:grid-cols-7 gap-4 mb-10 p-4 rounded-md border-b-2 border-solid border-black-50">
            <h5 className="md:text-center text-black">ID</h5>
            <h5 className="md:text-center text-black">COD. CONTRATO</h5>
            <h5 className="md:text-center text-black">CLIENTE</h5>
            <h5 className="md:text-center text-black">CELULAR</h5>
            <h5 className="md:text-center text-black">MEDIO DE INGRESO</h5>
            <h5 className="md:text-center text-black">FECHA DE CREACIÓN</h5>
            <h5 className="md:text-center text-black"></h5>
          </div>
          {filterDate().map((orden: ValuesVenta) => (
            <div
              className="grid relative grid-cols-1 md:grid-cols-7 gap-4 items-center mb-4 bg-white md:bg-gray-50 p-4 rounded-xl shadow-lg md:shadow-sm cursor-pointer"
              key={orden.id}
            >
              <div className="md:text-center">
                <h5 className="text-black  md:hidden font-bold mb-2">ID</h5>
                <p className="line-clamp-2 text-black">#{orden.id}</p>
              </div>

              <div className="md:text-center md:flex md:justify-center">
                <h5 className="md:hidden text-black font-bold mb-2">Cliente</h5>
                <p className="line-clamp-2 text-black">
                  {orden.id_contrato}
                </p>
              </div>

              <div className="md:text-center md:flex md:justify-center">
                <h5 className="md:hidden text-black font-bold mb-2">Cliente</h5>
                <p className="line-clamp-2 text-black">
                  {orden.nombres} {orden.apellidos}
                </p>
              </div>

              <div className="md:text-center md:flex md:justify-center">
                <h5 className="md:hidden text-black font-bold mb-2">Celular</h5>
                <p className="line-clamp-2 text-black">
                  {orden.celular}
                </p>
              </div>

              <div className="md:text-center md:flex md:justify-center ">
                <h5 className="md:hidden text-black font-bold mb-2">
                  Medio de ingreso
                </h5>
                <p className="line-clamp-2 text-black">
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
                    {orden.id != null && (
                      <Link
                        to={`view/${orden.id}`}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                      >
                        Ver
                      </Link>
                    )}
                  </MenuItem>
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
                    {orden.id != null && (
                      <Link
                        to={'#'}
                        onClick={() => {
                          preguntarPreventa(orden.id)
                        }}
                        className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                      >
                        Mover a ventas
                      </Link>
                    )}
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
