/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable multiline-ternary */
import { useEffect, useState } from 'react'
import { RiSettings3Fill } from 'react-icons/ri'
import { Link } from 'react-router-dom'
import { addHours, format } from 'date-fns'
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu'
import {
  limpiarCadena
} from '../../../../shared/functions/QuitarAcerntos'
import { type arrayContacto } from '../../../../shared/schemas/Interfaces'
import { cn } from '../../../../shared/cn'
import { Paginacion } from '../../../../shared/Paginacion'

export const ListaHostingM = ({
  open,
  productos
}: {
  open: any
  productos: any
}): JSX.Element => {
  const [, setTotalRegistros] = useState(0)
  const [paginaActual, setpaginaActual] = useState<number>(1)
  const [search] = useState('')
  const [cantidadRegistros] = useState(13)

  const indexOfLastPost = paginaActual * cantidadRegistros
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros
  let totalPosts = productos.length

  const filterDate = (): any => {
    const filteredProductos = productos
    totalPosts = filteredProductos.length
    return filteredProductos.slice(indexOfFirstPost, indexOfLastPost)
  }

  useEffect(() => {
    setTotalRegistros(totalPosts)
  }, [search, open])

  const ultimaFecha = (fechas: any): boolean => {
    let ultimaFecha = null
    // Sort the dates in ascending order by year
    if (fechas && fechas.length > 0) {
      fechas.sort((a: any, b: any) => {
        return (
          new Date(a.fecha).getFullYear() - new Date(b.fecha).getFullYear()
        )
      })
      ultimaFecha = fechas[fechas.length - 1] // Obtener la última fecha del array
    }
    if (ultimaFecha) {
      const anoUltimaFecha = parseInt(ultimaFecha.fecha.split('-')[0])
      const anoActual = new Date().getFullYear()
      if (anoUltimaFecha == anoActual) {
        return true
      } else {
        return false
      }
    }
    return false
  }

  return (
    <>
      <div className="md:bg-[#fff] p-0 rounded-lg">
        <div
          className={
            'hidden lg:grid pr-10 lg:pr-4 items-center grid-cols-15 gap-4 mb-2 lg:px-4 lg:py-2 text-gray-800 rounded-xl mt-3 bg-gray-100'
          }
        >
          <h5 className="lg:text-left line-clamp-1 col-span-1">ID</h5>
          <h5 className="lg:text-left line-clamp-1 col-span-2 ">Cliente</h5>
          <h5 className="lg:text-left col-span-2">Dominio</h5>
          <h5 className="lg:text-center col-span-2">Estado</h5>
          <h5 className="lg:text-center line-clamp-1 col-span-2">Servicio</h5>
          <h5 className="lg:text-center col-span-2 line-clamp-1">
            Plan contratado
          </h5>
          <h5 className="lg:text-center col-span-2 line-clamp-1">
            Fecha de Inicio
          </h5>
          <h5 className="lg:text-center ">Renovación</h5>
          <h5 className="lg:text-center"></h5>
        </div>
        {filterDate().map((orden: any, index: number) => {
          const hosting = JSON.parse(orden.hosting)
            ? JSON.parse(orden.hosting)
            : []
          return (
            <>
              <div
                // to={`view-servicio/${orden.id}`}
                className="flex flex-col gap-3 lg:hidden bg-form p-4 rounded-xl"
              >
                <div className="flex justify-between">
                  <div className="flex lg:hidden gap-4 items-center">
                    {orden.activehosting == '0' ? (
                      <span className="flex items-center justify-center bg-red-400 text-red-600  w-8 h-8 rounded-full">
                        I
                      </span>
                    ) : (
                      <span className="flex items-center justify-center bg-[#b3dba1] text-green-700 w-8 h-8 rounded-full">
                        A
                      </span>
                    )}
                    <span className="flex lg:justify-left items-center gap-3 font-bold text-black">
                      {orden.correlativo
                        ? limpiarCadena(orden.correlativo)
                        : ''}
                    </span>
                  </div>
                  <div className="lg:text-right pr-0">
                    <h5 className="lg:hidden text-gray-500 text-right font-bold mb-0 text-sm">
                      Fecha de inicio
                    </h5>
                    <span className="text-right block text-gray-500">
                      {format(
                        addHours(new Date(hosting.inicio), +5),
                        'dd/MM/yyyy'
                      )}
                    </span>
                  </div>
                </div>
                <div className="lg:hidden flex justify-between gap-3">
                  <div className="lg:text-center ">
                    <h5 className="lg:hidden text-black font-bold mb-0 text-sm">
                      Dominio
                    </h5>
                    {hosting?.dominio ? (
                      <Link
                        to={`https://${hosting?.dominio}`}
                        target="_blank"
                        className="text-left lowercase text-blue-500 hover:underline font-semibold line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10"
                      >
                        {hosting?.dominio}
                      </Link>
                    ) : (
                      <span className="text-left text-gray-500 font-semibold line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                        {'No registrado'}
                      </span>
                    )}
                  </div>
                  <div className="lg:text-right ">
                    <h5 className="lg:hidden text-black font-bold mb-0 text-sm bg text-right">
                      Renovación
                    </h5>
                    <span
                      className={cn(
                        'text-white text-center block rounded-md',
                        ultimaFecha(hosting?.fechas)
                          ? 'bg-green-500'
                          : 'bg-red-400'
                      )}
                    >
                      {ultimaFecha(hosting?.fechas) ? 'Si' : 'NO'}
                    </span>
                  </div>
                </div>
                <div className="lg:hidden flex items-center justify-between gap-3">
                  <div className="lg:text-center ">
                    <h5 className="lg:hidden text-black font-bold mb-0 text-sm">
                      Cliente
                    </h5>
                    <span className="text-left text-gray-500 font-semibold line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                      {orden.nombres ?? hosting.nombres}{' '}
                      {orden.apellidos ?? hosting.apellidos}
                    </span>
                  </div>
                  <div className="block lg:text-center">
                    <Menu
                      menuButton={
                        <MenuButton className="">
                          <RiSettings3Fill className="text-gray-500 text-lg" />
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
                            to={`/admin/hosting/avances/${orden.id}`}
                            className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                          >
                            Seguimiento
                          </Link>
                        )}
                      </MenuItem>
                      {orden.id_cliente && (
                        <>
                          <MenuItem className="p-0 hover:bg-transparent">
                            {orden.id != null && (
                              <Link
                                to={`/admin/lista-clientes/ver/${orden.id_cliente}`}
                                className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                              >
                                Ver
                              </Link>
                            )}
                          </MenuItem>
                          <MenuItem className="p-0 hover:bg-transparent">
                            {orden.id != null && (
                              <Link
                                to={`/admin/lista-clientes/editar/${orden.id_cliente}`}
                                className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                              >
                                Editar
                              </Link>
                            )}
                          </MenuItem>
                          <MenuItem className="p-0 hover:bg-transparent">
                            {orden.id != null && (
                              <Link
                                to={`/admin/seguimiento/${orden.id_cliente}`}
                                className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                              >
                                Reporte
                              </Link>
                            )}
                          </MenuItem>
                          <MenuItem className="p-0 hover:bg-transparent">
                            {orden.id != null && (
                              <Link
                                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/ban-ts-comment
                                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                to={`/admin/lista-clientes/editar/${orden.id_cliente}`}
                                className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                              >
                                Datos de cliente
                              </Link>
                            )}
                          </MenuItem>
                        </>
                      )}
                    </Menu>
                  </div>
                </div>
                <div className="lg:hidden flex justify-between gap-3">
                  <div className="lg:text-center ">
                    <h5 className="lg:hidden text-black font-bold mb-0 text-sm">
                      Servicio
                    </h5>
                    <span className="text-left text-gray-500 font-semibold line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                      {hosting?.tiposervicio}
                    </span>
                  </div>
                  <div className="lg:text-right ">
                    <h5 className="lg:hidden text-black font-bold mb-0 text-sm bg text-right">
                      Monto a C.
                    </h5>
                    <span className="text-center text-red-500 font-bold line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                      S/.{hosting?.montoC}
                    </span>
                  </div>
                </div>
              </div>
              {/* PC */}
              <div
                className={`grid grid-cols-15 transition-all lg:pr-4 relative gap-3 items-center mb-3 lg:mb-0 ${
                  index % 2 == 0 ? 'bg-transparent' : 'bg-transparent'
                } lg:px-4 lg:py-3 rounded-xl relative shadow_class`}
                key={orden.id}
              >
                <div className="hidden lg:block lg:text-center col-span-1">
                  <span className="text-left block text-black w-full line-clamp-1">
                    {orden.correlativo ? limpiarCadena(orden.correlativo) : ''}
                  </span>
                </div>
                <div className="hidden lg:block lg:text-center col-span-2 relative h-6">
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
                              className="text-left text-black font-semibold line-clamp-1  transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10"
                            >
                              {contacto.nombres}
                            </span>
                          ))}
                    </>
                  ) : (
                    <span className="text-left text-black font-semibold line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                      {orden.nombres ?? hosting.nombres}{' '}
                      {orden.apellidos ?? hosting.apellidos}
                    </span>
                  )}
                </div>
                <div className="hidden lg:block lg:text-center col-span-2 relative h-full">
                  {hosting?.dominio ? (
                    <Link
                      to={`https://${hosting?.dominio}`}
                      target="_blank"
                      className="text-left lowercase text-blue-500 hover:underline font-semibold line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10"
                    >
                      {hosting?.dominio}
                    </Link>
                  ) : (
                    <span className="text-left text-gray-500 font-semibold line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                      {'No registrado'}
                    </span>
                  )}
                </div>
                <div
                  className={`hidden w-20 rounded-xl mx-auto lg:flex gap-2 lg:px-2 items-center justify-center col-span-2 lg:text-center ${
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
                <div className="hidden lg:block lg:text-center col-span-2 line-clamp-1 relative h-full">
                  <span className="text-left text-black  transition-all line-clamp-1  w-full h-full z-10 ">
                    {hosting?.tiposervicio}
                  </span>
                </div>
                <div className="hidden lg:block lg:text-center col-span-2">
                  <span className="text-left  text-black line-clamp-1">
                    {hosting?.tiposervicio == 'Hosting' ||
                    hosting?.tiposervicio == 'Hosting + Dominio'
                      ? hosting?.plan
                      : 'No registrado'}
                  </span>
                </div>
                <div className="hidden lg:block lg:text-center col-span-2">
                  <span className="text-left block text-black">
                    {format(
                      addHours(new Date(hosting.inicio), +5),
                      'dd/MM/yyyy'
                    )}
                  </span>
                </div>
                <div className="hidden lg:block lg:text-center ">
                  <span
                    className={cn(
                      'text-white block rounded-md',
                      ultimaFecha(hosting?.fechas)
                        ? 'bg-green-400'
                        : 'bg-red-400'
                    )}
                  >
                    {ultimaFecha(hosting?.fechas) ? 'Si' : 'NO'}
                  </span>
                </div>
                <div className="hidden lg:block lg:text-center">
                  <Menu
                    menuButton={
                      <MenuButton className="">
                        <RiSettings3Fill className="text-gray-500 text-lg" />
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
                          to={`/admin/hosting/avances/${orden.id}`}
                          className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                        >
                          Seguimiento
                        </Link>
                      )}
                    </MenuItem>
                    {orden.id_cliente && (
                      <>
                        <MenuItem className="p-0 hover:bg-transparent">
                          {orden.id != null && (
                            <Link
                              to={`/admin/lista-clientes/ver/${orden.id_cliente}`}
                              className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                            >
                              Ver
                            </Link>
                          )}
                        </MenuItem>
                        <MenuItem className="p-0 hover:bg-transparent">
                          {orden.id != null && (
                            <Link
                              to={`/admin/lista-clientes/editar/${orden.id_cliente}`}
                              className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                            >
                              Editar
                            </Link>
                          )}
                        </MenuItem>
                        <MenuItem className="p-0 hover:bg-transparent">
                          {orden.id != null && (
                            <Link
                              to={`/admin/seguimiento/${orden.id_cliente}`}
                              className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                            >
                              Reporte
                            </Link>
                          )}
                        </MenuItem>
                        <MenuItem className="p-0 hover:bg-transparent">
                          {orden.id != null && (
                            <Link
                              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/ban-ts-comment
                              // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                              to={`/admin/lista-clientes/editar/${orden.id_cliente}`}
                              className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                            >
                              Datos de cliente
                            </Link>
                          )}
                        </MenuItem>
                      </>
                    )}
                  </Menu>
                </div>
              </div>
            </>
          )
        })}
        <div className="flex flex-col md:flex-row gap-5 md:gap-0 justify-center md:justify-between content_buttons pt-3 mt-5">
            <p className="text-md ml-1 text-main font-bold">
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
    </>
  )
}
