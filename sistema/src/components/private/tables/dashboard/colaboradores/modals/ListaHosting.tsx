/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu'
import { FaAngleDown } from 'react-icons/fa6'
import { motion, AnimatePresence } from 'framer-motion'
import { addHours, format } from 'date-fns'
import { RiSettings3Fill } from 'react-icons/ri'
import {
  type arrayContacto,
  type ValuesVenta
} from '../../../../../shared/schemas/Interfaces'
import { cn } from '../../../../../shared/cn'
import { Loading } from '../../../../../shared/Loading'
import {
  limpiarCadena,
  quitarAcentos
} from '../../../../../shared/functions/QuitarAcerntos'
// import { GeneradorExcel } from '../../../../shared/EXCEL/GeneradorExcel'
interface Filters {
  estado?: number | null
  enCola?: boolean | null
  fechaFin?: boolean | null
  activeFilter: null
  sinFechaFinYNo1: boolean | null
}

export const ListaHosting = ({ productos }: any): JSX.Element => {
  //   FILTROS
  const currentDate = new Date()
  const [selectedDate] = useState<Date | null>(currentDate)
  const [selectPrecio] = useState<string | null>(null)
  const [selectAntiguo] = useState<string | null>(null)
  const [loading] = useState(false)
  const [openList, setOpenList] = useState({ id: null, estado: false })
  const [search] = useState('')
  const [filters] = useState<Filters>({
    estado: null,
    fechaFin: null,
    enCola: null,
    activeFilter: null,
    sinFechaFinYNo1: null
  })

  let totalPosts = 0

  const filterDate = (): ValuesVenta[] => {
    let filteredProductos = productos

    if (filters.activeFilter == 'estado' && filters.estado !== null) {
      filteredProductos = filteredProductos.filter(
        (pro: any) => pro.estado == String(filters.estado)
      )
    } else if (
      filters.activeFilter == 'fechaFin' &&
      filters.fechaFin !== null
    ) {
      filteredProductos = filteredProductos.filter(
        (pro: any) =>
          pro.fecha_fin !== null && pro.fecha_fin !== '' && pro.estado != '1'
      )
    } else if (
      filters.activeFilter == 'sinFechaFinYNo1' &&
      filters.sinFechaFinYNo1 !== null
    ) {
      filteredProductos = filteredProductos.filter(
        (pro: any) =>
          (pro.fecha_fin == null || pro.fecha_fin == '') &&
          pro.fecha_inicio &&
          pro.estado != '1'
      )
    }
    // FILTROS ESPECIFICOS
    // if (selectedDate) {
    //   filteredProductos = filteredProductos.filter((pro: any) => {
    //     const startDate = new Date(parseISO(JSON.parse(pro.hosting).inicio))
    //     return startDate.getMonth() === selectedDate.getMonth()
    //   })
    // }

    if (selectPrecio && selectPrecio == 'MAYOR PRECIO') {
      filteredProductos = filteredProductos.sort((a: any, b: any) => {
        const precioA = parseFloat(JSON.parse(a.hosting).montoC)
        const precioB = parseFloat(JSON.parse(b.hosting).montoC)
        return precioB - precioA // Orden de mayor a menor precio
      })
    } else if (selectPrecio && selectPrecio == 'MENOR PRECIO') {
      filteredProductos = filteredProductos.sort((a: any, b: any) => {
        const precioA = parseFloat(JSON.parse(a.hosting).montoC)
        const precioB = parseFloat(JSON.parse(b.hosting).montoC)
        return precioA - precioB // Orden de menor a mayor precio
      })
    } else {
      filteredProductos = filteredProductos.sort((a: any, b: any) => {
        const correlativoA = limpiarCadena(a.correlativo)
        const correlativoB = limpiarCadena(b.correlativo)
        return correlativoB.localeCompare(correlativoA) // Ordenar alfabéticamente descendente
      })
    }

    if (selectAntiguo === 'MAS ANTIGUOS') {
      // Ordenar por fecha de inicio de hosting de más antiguo a más nuevo
      filteredProductos = filteredProductos.sort((a: any, b: any) => {
        const dateA = new Date(JSON.parse(a.hosting).inicio)
        const dateB = new Date(JSON.parse(b.hosting).inicio)
        return dateA.getTime() - dateB.getTime()
      })
    } else if (selectAntiguo === 'MAS NUEVOS') {
      // Ordenar por fecha de inicio de hosting de más nuevo a más antiguo
      filteredProductos = filteredProductos.sort((a: any, b: any) => {
        const dateA = new Date(JSON.parse(a.hosting).inicio)
        const dateB = new Date(JSON.parse(b.hosting).inicio)
        return dateB.getTime() - dateA.getTime()
      })
    }

    const searchTerm = quitarAcentos(search)
    // ... puedes agregar otras condiciones de filtro aquí
    if (search.length > 0) {
      filteredProductos = filteredProductos.filter((pro: any) => {
        const hosting = JSON.parse(pro.hosting)
        const fullName =
          `${hosting.nombres} ${hosting.apellidos}`.toLowerCase()
        const fullEmpresa = hosting?.marca && `${hosting.marca}`.toLowerCase()
        return (
          quitarAcentos(fullEmpresa).includes(searchTerm) ||
          quitarAcentos(fullName).includes(searchTerm)
          //   String(pro.id).includes(searchTerm)
        )
      })
    }
    totalPosts = filteredProductos.length
    return filteredProductos
  }

  const monthNames = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ]

  const getMonthName = (date: Date): string => {
    return monthNames[date?.getMonth()]
  }
  let totalCobrar = 0
  let totalPagar = 0

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
      <section className="px-6 py-4 w-full">
        {loading ? (
          <Loading />
        ) : (
          <div className="lg:bg-[#fff] lg:px-4 lg:py-4 lg:pt-2 rounded-xl w-full">
            <div
              className={
                'hidden lg:grid pr-10 lg:pr-4 items-center grid-cols-19 gap-4 mb-2 lg:px-4 lg:py-2 text-gray-800 rounded-xl mt-3 bg-gray-100'
              }
            >
              <h5 className="lg:text-left line-clamp-1 col-span-1"></h5>
              <h5 className="lg:text-left line-clamp-1 col-span-1">ID</h5>
              <h5 className="lg:text-left line-clamp-1 col-span-2 ">Cliente</h5>
              <h5 className="lg:text-left col-span-2">Dominio</h5>
              <h5 className="lg:text-center col-span-2">Estado</h5>
              <h5 className="lg:text-center line-clamp-1 col-span-2">
                Servicio
              </h5>
              <h5 className="lg:text-center col-span-2 line-clamp-1">
                Plan contratado
              </h5>
              <h5 className="lg:text-center col-span-2 line-clamp-1">
                Fecha de Inicio
              </h5>
              <h5 className="lg:text-center ">M.Cobrar</h5>
              <h5 className="lg:text-center ">M.Pagar</h5>
              <h5 className="lg:text-center ">Ganancia</h5>
              <h5 className="lg:text-center ">Renovación</h5>
              <h5 className="lg:text-center"></h5>
            </div>
            {filterDate().map((orden: any, index: number) => {
              const hosting = JSON.parse(orden.hosting)
                ? JSON.parse(orden.hosting)
                : []
              if (orden.activehosting == '1') {
                if (hosting?.montoC) {
                  totalCobrar += Number(hosting.montoC)
                }
                if (hosting?.montoP) {
                  totalPagar += Number(hosting.montoP)
                }
              }
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
                                target="_blank"
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
                                    target="_blank"
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
                                    target="_blank"
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
                                    target="_blank"
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
                                    target="_blank"
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
                    className={`grid grid-cols-19 transition-all lg:pr-4 relative gap-3 items-center mb-3 lg:mb-0 ${
                      index % 2 == 0 ? 'bg-transparent' : 'bg-transparent'
                    } lg:px-4 lg:py-3 rounded-xl relative shadow_class`}
                    key={orden.id}
                  >
                    <div className="hidden lg:block lg:text-center col-span-1">
                      <span className="text-center block text-black w-full line-clamp-1 cursor-pointer">
                        <FaAngleDown
                          className="text-gray-600 mx-auto"
                          onClick={() => {
                            if (orden.id == openList.id) {
                              setOpenList({
                                id: orden.id,
                                estado: !openList.estado
                              })
                            } else {
                              setOpenList({
                                id: orden.id,
                                estado: true
                              })
                            }
                          }}
                        />
                      </span>
                    </div>
                    <div className="hidden lg:block lg:text-center col-span-1">
                      <span className="text-left block text-black w-full line-clamp-1">
                        {orden.correlativo
                          ? limpiarCadena(orden.correlativo)
                          : ''}
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
                      <span className="text-cener block text-black">
                        {/* {hosting.inicio} */}
                        {format(
                          addHours(new Date(hosting.inicio), +5),
                          'dd/MM/yyyy'
                        )}
                      </span>
                    </div>
                    <div className="hidden lg:block lg:text-center ">
                      {hosting?.montoC ? (
                        <span className="text-cener block text-black ">
                          S/ {hosting?.montoC}
                        </span>
                      ) : (
                        <span className="text-cener block text-black">
                          No registrado
                        </span>
                      )}
                    </div>
                    <div className="hidden lg:block lg:text-center ">
                      {hosting?.montoP ? (
                        <span className="text-cener block text-black ">
                          S/ {hosting?.montoP}
                        </span>
                      ) : (
                        <span className="text-cener block text-black">
                          No registrado
                        </span>
                      )}
                    </div>
                    <div className="hidden lg:block lg:text-center ">
                      {hosting?.montoC && hosting?.montoP ? (
                        <span className="text-cener block text-black font-bold">
                          S/ {hosting?.montoC - hosting?.montoP}
                        </span>
                      ) : (
                        <span className="text-cener block text-black">
                          No registrado
                        </span>
                      )}
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
                              target='_blank'
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
                                    target='_blank'
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
                                  target='_blank'
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
                                  target='_blank'
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
                                  target='_blank'
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
                  <AnimatePresence>
                    {openList.estado && openList.id == orden.id && (
                      <motion.div
                        initial={{
                          translateY: '-100%',
                          opacity: 0
                        }}
                        animate={{
                          translateY: '0%',
                          opacity: 100
                        }}
                        exit={{ translateY: '-50%', opacity: 0 }}
                        className="w-full"
                      >
                        <div
                          className={
                            'hidden lg:grid font-medium items-center grid-cols-19 mb-2  text-gray-800 mt-3'
                          }
                        >
                          <h5 className="lg:text-left line-clamp-1 col-span-1"></h5>
                          <h5 className="lg:text-left line-clamp-1 col-span-2  border-b border-gray-300 lg:py-2 px-2">
                            P. Hosting
                          </h5>
                          <h5 className="lg:text-left line-clamp-1 col-span-2 border-b border-gray-300 lg:py-2 px-2 ">
                            P. Dominio
                          </h5>
                          <h5 className="lg:text-left col-span-2 border-b border-gray-300 lg:py-2 px-2">
                            Usuario
                          </h5>
                          <h5 className="lg:text-left col-span-2 border-b border-gray-300 lg:py-2 px-2">
                            Contraseña
                          </h5>
                          <h5 className="lg:text-left col-span-2 border-b border-gray-300 lg:py-2 px-2">
                            Marca
                          </h5>
                          <h5 className="lg:text-left col-span-2 border-b border-gray-300 lg:py-2 px-2">
                            Celular
                          </h5>
                          <h5 className="lg:text-left col-span-2 border-b border-gray-300 lg:py-2 px-2">
                            Correo
                          </h5>
                          <h5 className="lg:text-left line-clamp-1 col-span-2 border-b border-gray-300 lg:py-2 px-2">
                            Estado Proyecto
                          </h5>
                          <h5 className="lg:text-left col-span-2"></h5>
                        </div>
                        <div
                          className={`grid grid-cols-19 lg:pr-4 relative gap-3 items-center mb-3 lg:mb-0 ${
                            index % 2 == 0 ? 'bg-transparent' : 'bg-transparent'
                          } lg:px-4 lg:pb-4 lg:pt-1 rounded-xl relative shadow_class`}
                          key={orden.id}
                        >
                          <div className="hidden lg:block lg:text-center col-span-1"></div>
                          <div className="hidden lg:block lg:text-center col-span-2">
                            <span className="text-left block text-black w-full line-clamp-1">
                              {hosting?.tiposervicio == 'Hosting' ||
                              hosting?.tiposervicio == 'Hosting + Dominio'
                                ? hosting?.phosting
                                : 'No registrado'}
                            </span>
                          </div>
                          <div className="hidden lg:block lg:text-center col-span-2">
                            <span className="text-left block text-black w-full line-clamp-1">
                              {hosting?.tiposervicio == 'Dominio' ||
                              hosting?.tiposervicio == 'Hosting + Dominio'
                                ? hosting?.pdominio
                                : 'No registrado'}
                            </span>
                          </div>
                          <div className="hidden lg:block lg:text-center col-span-2">
                            <span className="text-left block text-black w-full line-clamp-1">
                              {hosting?.usuario
                                ? hosting?.usuario
                                : 'No registrado'}
                            </span>
                          </div>
                          <div className="hidden lg:block lg:text-center col-span-2">
                            <span className="text-left block text-black w-full line-clamp-1">
                              {hosting?.password
                                ? hosting?.password
                                : 'No registrado'}
                            </span>
                          </div>
                          <div className="hidden lg:block lg:text-center col-span-2">
                            <span className="text-left  text-black w-full line-clamp-1">
                              {orden?.nombre_marca
                                ? orden?.nombre_marca
                                : hosting?.marca
                                  ? hosting?.marca
                                  : 'No registrado'}
                            </span>
                          </div>
                          <div className="hidden lg:block lg:text-center col-span-2">
                            <span className="text-left block text-black w-full line-clamp-1">
                              {orden?.celular ?? hosting?.celular ?? ''}
                            </span>
                          </div>
                          <div className="hidden lg:block lg:text-center col-span-2">
                            <span className="text-left block text-black w-full line-clamp-1">
                              {orden?.email ?? hosting.email ?? ''}
                            </span>
                          </div>
                          <div className="hidden lg:block lg:text-center col-span-2">
                            {orden.estado == '1' ? (
                              <>
                                {/* <BsCheckCircle className="hidden lg:block" /> */}
                                <span className="text-center bg-red-600 text-white font-bold w-fit px-4 mx-auto rounded-md line-clamp-1">
                                  Abandono
                                </span>
                              </>
                            ) : orden.fecha_fin != null ? (
                              <>
                                {/* <BsCheckCircle className="hidden lg:block" /> */}
                                <span className="text-center bg-[#1A5515] text-white font-bold w-fit px-4 mx-auto rounded-md line-clamp-1">
                                  Finalizado
                                </span>
                              </>
                            ) : !orden.fecha_inicio && !orden.fecha_alta ? (
                              <>
                                {/* <BsGraphUp className="hidden lg:block" /> */}
                                <span className="text-center gap-2 font-bold px-2 line-clamp-1 text-gray-500">
                                  Sin proyecto
                                </span>
                              </>
                            ) : (
                              <>
                                {/* <BsGraphUp className="hidden lg:block" /> */}
                                <span className="text-center gap-2 font-bold w-fit px-4 mx-auto rounded-md line-clamp-1">
                                  En proceso
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </>
              )
            })}
            <div className="grid border-t border-gray-300 items-center grid-cols-19 gap-6 lg:gap-0  content_buttons pt-2 mt-3">
              <span className="col-span-12 text-black text-center">
                Pago general del mes de{' '}
                {selectedDate && getMonthName(selectedDate).toUpperCase()}{' '}
              </span>
              <span className="col-span-2"></span>
              <div className="hidden lg:block lg:text-center ">
                <span className="text-cener block text-black font-bold">
                  S/ {totalCobrar}
                </span>
              </div>
              <div className="hidden lg:block lg:text-center ">
                <span className="text-cener block text-black font-bold">
                  S/ {totalPagar}
                </span>
              </div>
              <div className="hidden lg:block lg:text-center ">
                <span className="text-cener block text-red-700 font-bold">
                  S/ {totalCobrar - totalPagar}
                </span>
              </div>
            </div>
            <div className="grid border-t border-gray-300  items-center grid-cols-3 gap-6 lg:gap-0  content_buttons pt-2 mt-3">
              <p className="text-md ml-1 w-fit text-black font-bold bg-yellow-400">
                {totalPosts} Registros
              </p>
            </div>
          </div>
        )}
      </section>
    </>
  )
}
