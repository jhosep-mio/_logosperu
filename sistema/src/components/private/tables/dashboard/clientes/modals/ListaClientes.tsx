import React, { useEffect, useState } from 'react'
import { RiFilter2Fill } from 'react-icons/ri'
import { type openFiltersValues, type ValuesPreventaModificate } from '../../../../../shared/schemas/Interfaces'
import { quitarAcentos } from '../../../../../shared/functions/QuitarAcerntos'
import { Paginacion } from '../../../../../shared/Paginacion'
import { Link } from 'react-router-dom'
import { format } from 'date-fns'

export const ListaClientes = ({
  productos,
  open
}: {
  productos: ValuesPreventaModificate[]
  open: openFiltersValues
}): JSX.Element => {
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [paginaActual, setpaginaActual] = useState<number>(1)
  const [search, setSearch] = useState('')
  const [cantidadRegistros] = useState(14)

  const indexOfLastPost = paginaActual * cantidadRegistros
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros
  let totalPosts = productos.length

  const filterDate = (): ValuesPreventaModificate[] => {
    let filteredProductos = productos
    const searchTerm = quitarAcentos(search.toLowerCase())

    if (open.fecha) {
      filteredProductos = filteredProductos.filter((pro) => {
        const createdForm = format(new Date(pro.created_at), 'yyyy-MM')
        return createdForm.slice(0, 7) === open.fecha
      })
    }
    if (search.length > 0) {
      filteredProductos = filteredProductos.filter((pro) => {
        const fullName = `${pro.nombres} ${pro.apellidos}`.toLowerCase()
        const empresa = `${pro.empresa}`.toLowerCase()
        return (
          quitarAcentos(fullName).includes(searchTerm) ||
          quitarAcentos(empresa).includes(searchTerm) ||
          String(pro.id).includes(searchTerm) ||
          String(pro.celular).includes(searchTerm)
        )
      })
    }

    totalPosts = filteredProductos.length
    return filteredProductos.slice(indexOfFirstPost, indexOfLastPost)
  }

  useEffect(() => {
    setTotalRegistros(totalPosts)
  }, [search, open])

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
        <div className="w-full  flex gap-2 items-center h-fit">
          <button className="bg-gray-200 w-fit flex items-center text-black gap-2 py-2 px-4 rounded-lg hover:text-main transition-colors">
            <RiFilter2Fill />
            <input
              placeholder="Buscar ..."
              className="bg-transparent outline-none"
              value={search}
              onChange={onSeachChange}
              type="search"
            />
          </button>
          <h1 className='text-xl text-right w-full font-bold pl-4'>LISTADO DE CLIENTES</h1>
        </div>
      </div>
      <div className="md:bg-[#fff] p-0  rounded-xl">
        <div className="hidden md:grid grid-cols-1 md:grid-cols-8 gap-3 mb-2 md:px-4 md:py-2 text-gray-400 border-y border-gray-300">
          <h5 className="md:text-left line-clamp-1">ID</h5>
          <h5 className="md:text-left line-clamp-1 col-span-2">Cliente</h5>
          <h5 className="md:text-left line-clamp-1 ">Empresa</h5>
          <h5 className="md:text-left line-clamp-1 md:block">Celular</h5>
          <h5 className="md:text-left line-clamp-1 w-full">DNI/RUC</h5>
          <h5 className="md:text-left line-clamp-1 w-full">Medio de ingreso</h5>
          <h5 className="md:text-left line-clamp-1 w-full">Fecha</h5>
        </div>
        {filterDate().map((orden: ValuesPreventaModificate, index: number) => (
          <Link
           to={`/admin/lista-clientes/editar/${orden.id}`}
           target='_blank'
            className={`grid grid-cols-1 hover:bg-gray-400 transition-colors cursor-pointer md:grid-cols-8 relative gap-3 items-center mb-3 md:mb-0 ${
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
                    {new Date(orden.created_at).toLocaleDateString(undefined, {
                      year: 'numeric',
                      month: '2-digit',
                      day: '2-digit'
                    })}{' '}
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
            <div className="hidden md:block md:text-center  relative h-full">
                <span className="text-left text-black line-clamp-1 transition-all hover:w-[200%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                  {orden.empresa}
                </span>
            </div>
            <div className="hidden md:block md:text-center">
              <span className="text-left block text-black w-full line-clamp-1">
                {orden.celular}
              </span>
            </div>
            <div className="hidden md:block md:text-center">
              <span className="text-left block text-black w-full line-clamp-1">
                {orden.dni_ruc}
              </span>
            </div>
            <div className="hidden md:block md:text-center">
              <span className="text-left block text-black w-full line-clamp-1">
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
              </span>
            </div>
            <div className="hidden md:block md:text-center">
              <span className="text-left block text-black w-full line-clamp-1">
              {new Date(orden.created_at).toLocaleDateString(undefined, {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
              })}{' '}
              </span>
            </div>
          </Link>
        ))}
        <div className="flex flex-col md:flex-row gap-5 md:gap-0 justify-center md:justify-between content_buttons pt-3 mt-5">
          <p className="text-md ml-1 text-black">{totalRegistros} Registros</p>
          <Paginacion
            totalPosts={totalPosts}
            cantidadRegistros={cantidadRegistros}
            paginaActual={paginaActual}
            setpaginaActual={setpaginaActual}
          />
        </div>
      </div>
    </>
  )
}
