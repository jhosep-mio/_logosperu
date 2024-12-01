/* eslint-disable @typescript-eslint/prefer-ts-expect-error */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable multiline-ternary */
import { useState } from 'react'
import { RiSettings3Fill } from 'react-icons/ri'
import {
  type arrayContacto,
  type ValuesVentaToMetricas
} from '../../../../../shared/schemas/Interfaces'
import {
  limpiarCadena,
  quitarAcentos
} from '../../../../../shared/functions/QuitarAcerntos'
import { Paginacion } from '../../../../../shared/Paginacion'
import { Link } from 'react-router-dom'
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu'
import { Loading } from '../../../../../shared/Loading'

export const ListaVentas = ({
  productos,
  open,
  colaboradores
}: {
  productos: any[]
  open: any
  colaboradores: any
}): JSX.Element => {
  const [paginaActual, setpaginaActual] = useState<number>(1)
  const [search] = useState('')
  const [cantidadRegistros] = useState(15)
  const indexOfLastPost = paginaActual * cantidadRegistros
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros
  let totalPosts = productos.length

  const filterDate = (): ValuesVentaToMetricas[] => {
    let filteredProductos = productos
    const searchTerm = quitarAcentos(search.toLowerCase())
    if (search.length > 0) {
      filteredProductos = filteredProductos.filter((pro: any) => {
        const fullName = `${pro.nombres} ${pro.apellidos}`.toLowerCase()
        const empresa = `${pro.nombre_marca}`.toLowerCase()
        return (
          quitarAcentos(pro.nombre_empresa).includes(searchTerm) ||
          quitarAcentos(empresa).includes(searchTerm) ||
          quitarAcentos(fullName).includes(searchTerm) ||
          String(pro.id).includes(searchTerm) ||
          String(pro.id_contrato).includes(searchTerm)
        )
      })
    }
    totalPosts = filteredProductos.length
    return filteredProductos.slice(indexOfFirstPost, indexOfLastPost)
  }

  return (
    <>
      <div className="md:bg-[#fff] p-0  rounded-xl w-full">
        {open.estado ? (
          <>
            <div
              className={
                'bg-main/90 rounded-t-md text-white hidden md:grid pr-10 lg:pr-4 items-cente grid_teplate_ventas_pendientes gap-4 mb-2 md:px-4 md:py-2  border-y border-gray-300'
              }
            >
              <h5 className="md:text-left line-clamp-1 col-span-1">Cont.</h5>
              {open.precios == 'si' && (
                <h5 className="md:text-left line-clamp-1 col-span-2 ">
                  Precio
                </h5>
              )}
              {open.precios == 'pendiente' && (
                <h5 className="md:text-left line-clamp-1 col-span-2 ">
                  Saldo Pend.
                </h5>
              )}
              <h5 className="md:text-left line-clamp-1 col-span-2 ">Plan</h5>
              <h5 className="md:text-left line-clamp-1 col-span-2">
                Colaborador
              </h5>
              <h5 className="md:text-center col-span-2">Marca</h5>
              <h5 className="md:text-center line-clamp-1 col-span-2">
                Medio de ingreso
              </h5>
              <h5 className="md:text-center col-span-2">Estado</h5>
              <h5 className="text-center w-full flex gap-2 justify-center items-center col-span-2 line-clamp-1">
                F. Inicio
              </h5>
              <h5 className="text-center w-full flex gap-2 justify-center items-center col-span-2 line-clamp-1">
                F. Final
              </h5>
            </div>
            {filterDate().map((orden: ValuesVentaToMetricas, index: number) => (
              <div
                className={`grid grid_teplate_ventas_pendientes 
                md:pr-10 lg:pr-4 relative gap-3 items-center mb-3 md:mb-0 ${
                  index % 2 == 0 ? 'bg-transparent' : 'bg-gray-200'
                } md:px-2 md:py-2 rounded-xl relative shadow_class`}
                        key={orden.id}
              >
                <div
                  // to={`view-servicio/${orden.id}`}
                  className="flex flex-col gap-3 md:hidden bg-form p-4 rounded-xl"
                >
                  <div className="flex justify-between">
                    <div className="flex md:hidden gap-4 items-center">
                      {orden.estado == '1' ? (
                        <span className="flex items-center justify-center bg-red-400 text-red-600  w-8 h-8 rounded-full">
                          A
                        </span>
                      ) : orden.fecha_fin != null ? (
                        <span className="flex items-center justify-center bg-[#b3dba1] text-green-700 w-8 h-8 rounded-full">
                          T
                        </span>
                      ) : !orden.fecha_inicio && !orden.fecha_alta ? (
                        <span className="flex items-center justify-center bg-yellow-300 text-yellow-600 w-8 h-8 rounded-full">
                          C
                        </span>
                      ) : (
                        <span className="flex items-center justify-center bg-gray-300 text-gray-500 w-8 h-8 rounded-full">
                          P
                        </span>
                      )}
                      <span className="flex md:justify-left items-center gap-3 font-bold text-black">
                        {limpiarCadena(orden.id_contrato)}
                      </span>
                    </div>
                    <div className="md:text-right pr-0">
                      <h5 className="md:hidden text-gray-500 text-right font-bold mb-0 text-sm">
                        Fecha de alta
                      </h5>
                      <span className="text-right block text-gray-500">
                        {orden.fecha_alta}
                      </span>
                    </div>
                  </div>
                  <div className="md:hidden flex justify-between gap-3">
                    <div className="md:text-center ">
                      <h5 className="md:hidden text-black font-bold mb-0 text-sm">
                        Cliente
                      </h5>
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
                                  className="text-left w-full text-black line-clamp-1"
                                >
                                  {contacto.nombres}
                                </span>
                              ))}
                        </>
                      ) : (
                        <span className="text-left w-full text-black line-clamp-1">
                          {orden.nombres} {orden.apellidos}
                        </span>
                      )}
                    </div>
                    <div className="md:text-right ">
                      <h5 className="md:hidden text-black font-bold mb-0 text-sm bg text-right">
                        Marca
                      </h5>
                      <span className="text-right w-full text-black line-clamp-1">
                        {orden.nombre_marca
                          ? orden.nombre_marca
                          : 'No registrado'}
                      </span>
                    </div>
                  </div>
                  <div className="md:hidden flex justify-between gap-3">
                    <div className="md:text-center ">
                      <h5 className="md:hidden text-black font-bold mb-0 text-sm">
                        Plan
                      </h5>
                      {/* <span className="text-left w-full text-black line-clamp-1">
                    {planes.map((plan) =>
                    orden.id_contrato.split('_')[0] == plan.codigo
                        ? plan.nombre
                        : ''
                    )}
                </span> */}
                    </div>
                  </div>
                </div>
                {/* PC */}
                <div className="hidden md:block md:text-center col-span-1">
                  <span className="text-left block text-black w-full line-clamp-1">
                    {limpiarCadena(orden.id_contrato)}
                  </span>
                </div>
                {open.precios == 'si' &&
                  <div className="hidden md:block md:text-center col-span-2 relative h-full">
                    <span className="text-left text-red-500 line-clamp-1 transition-all hover:w-[200%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                      S/ {// @ts-expect-error
                      orden?.contrato?.precio}
                    </span>
                  </div>
                }
                {// @ts-ignore
                open.precios == 'pendiente' && orden?.comprobante &&
                  <div className="hidden md:block md:text-center col-span-2 relative h-full">
                    <span className="text-left text-red-500 line-clamp-1 transition-all hover:w-[200%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                      S/ {// @ts-expect-error
                      JSON.parse(orden?.comprobante)?.pendiente}
                    </span>
                  </div>
                }
                <div className="hidden md:block md:text-center col-span-2 relative h-full">
                  <span className="text-left text-black line-clamp-1 transition-all hover:w-[200%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                    {// @ts-expect-error
                    orden.nombre_plan}
                  </span>
                </div>

                <div className="hidden md:block md:text-center col-span-2 relative h-full">
                  <span className="text-left text-black line-clamp-1 transition-all hover:w-[200%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                    {orden?.asignacion && JSON.parse(orden?.asignacion)?.map((asignacion: any) =>
                      colaboradores
                        .filter(
                          (colaborador: { id: number, name: string }) =>
                            colaborador.id == asignacion.peso
                        )
                        .map(
                          (colaborador: { name: string }) => colaborador.name
                        )
                        .join(', ')
                    )}
                  </span>
                </div>

                <div className="hidden md:block md:text-center col-span-2 relative h-full">
                  <span className="text-center text-black line-clamp-1 transition-all hover:w-[200%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                    {orden.nombre_marca ? orden.nombre_marca : 'No registrado'}
                  </span>
                </div>
                <div className="hidden md:block md:text-center col-span-2">
                  <span className="text-center block text-black">
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
                <div
                   className={`hidden w-fit mx-auto lg:flex gap-2 lg:px-2 items-center justify-center col-span-2 lg:text-center ${
                    orden.estado == '1'
                      ? 'bg-red-600 text-white'
                      : orden.fecha_fin != null
                      ? 'bg-[#1A5515] text-white'
                       // @ts-expect-error
                       : orden.community_activo == 'false'
                      ? 'bg-yellow-500 text-white'
                      : !orden.fecha_inicio && !orden.fecha_alta
                      ? 'bg-yellow-500 text-white'
                      : 'bg-gray-300 text-gray-500'
                  }`}
                >
                  {orden.estado == '1' ? (
                    <>
                      {/* <BsCheckCircle className="hidden lg:block" /> */}
                      <span className="text-center bg-red-600 text-white font-bold w-fit line-clamp-1">
                        Abandono
                      </span>
                    </>
                  ) : orden.fecha_fin != null ? (
                    <>
                      {/* <BsCheckCircle className="hidden lg:block" /> */}
                      <span className="text-center bg-[#1A5515] text-white font-bold w-fit line-clamp-1">
                        Finalizado
                      </span>
                    </>
                  ) // @ts-expect-error
                    : orden.community_activo == 'false' ? (
                    <>
                      {/* <BsCheckCircle className="hidden lg:block" /> */}
                      <span className="text-center  text-white font-bold w-fit line-clamp-1">
                        Deshabilitado
                      </span>
                    </>
                    ) : !orden.fecha_inicio && !orden.fecha_alta ? (
                    <>
                      {/* <BsGraphUp className="hidden lg:block" /> */}
                      <span className="text-center gap-2 font-bold px-2 line-clamp-1 ">
                        En cola
                      </span>
                    </>
                    ) : (
                    <>
                      {/* <BsGraphUp className="hidden lg:block" /> */}
                      <span className="text-center gap-2 font-bold w-fit line-clamp-1">
                        En proceso
                      </span>
                    </>
                    )}
                </div>
                {/* <div className="hidden md:block md:text-center col-span-2">
                <span className="text-cener block text-black">
                {orden.fecha_alta}
                </span>
            </div> */}
                <div className="hidden md:block md:text-center col-span-2">
                  <span className="text-cener block text-black">
                    {orden.fecha_inicio}
                  </span>
                </div>
                <div className="hidden md:block md:text-center col-span-2">
                  <span className="text-center block text-black">
                    {orden.fecha_fin}
                  </span>
                </div>
                <div className="md:text-center md:flex md:justify-center items-center absolute right-0 top-0 bottom-0 my-auto">
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
                          to={`/admin/lista-ventas/view/${orden.id}`}
                          target="_blank"
                          className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                        >
                          Ver
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem className="p-0 hover:bg-transparent">
                      {orden.id != null && (
                        <Link
                          to={`/admin/lista-ventas/editar/${orden.id}`}
                          target="_blank"
                          className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                        >
                          Editar
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem className="p-0 hover:bg-transparent">
                      {orden.id != null && (
                        <Link
                          to={`/admin/lista-servicios/avances/${orden.id}`}
                          target="_blank"
                          className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                        >
                          Seguimiento
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem className="p-0 hover:bg-transparent">
                      {orden.id != null && (
                        <Link
                          to={`/admin/seguimiento/${orden.id}`}
                          target="_blank"
                          className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                        >
                          Reporte
                        </Link>
                      )}
                    </MenuItem>
                    <MenuItem className="p-0 hover:bg-transparent">
                      {orden.id != null && (
                        <Link
                          target="_blank"
                          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions, @typescript-eslint/ban-ts-comment
                          to={`/admin/lista-clientes/editar/${orden.id_cliente}`}
                          className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                        >
                          Datos de cliente
                        </Link>
                      )}
                    </MenuItem>
                  </Menu>
                </div>
              </div>
            ))}
            <div className="flex flex-col md:flex-row gap-5 md:gap-0 justify-center md:justify-between content_buttons pt-3 mt-5">
              <span className="bg-yellow-400 text-black font-bold h-fit px-2 rounded-md">
                Registros: {totalPosts}
              </span>
              <Paginacion
                totalPosts={totalPosts}
                cantidadRegistros={cantidadRegistros}
                paginaActual={paginaActual}
                setpaginaActual={setpaginaActual}
              />
            </div>
          </>
        ) : (
          <section className="min-h-[400px]">
            <Loading />
          </section>
        )}
      </div>
    </>
  )
}
