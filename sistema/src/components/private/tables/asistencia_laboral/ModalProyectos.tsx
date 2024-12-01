/* eslint-disable array-callback-return */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react'
import useAuth from '../../../../hooks/useAuth'
import { RiFilter2Fill } from 'react-icons/ri'
import { Loading } from '../../../shared/Loading'
import {
  type ValuesVenta,
  type arrayContacto
} from '../../../shared/schemas/Interfaces'
import { Paginacion } from '../../../shared/Paginacion'
import { getDataVentas } from '../../../shared/FetchingData'
import {
  limpiarCadena,
  quitarAcentos
} from '../../../shared/functions/QuitarAcerntos'
import { FaRegWindowClose } from 'react-icons/fa'
import { v4 as uuidv4 } from 'uuid'
import { toast } from 'sonner'
import SelectFilter from '../ventas/filtros/SelectFilter'
import { MdLabelOutline } from 'react-icons/md'
import { FaAngleDown } from 'react-icons/fa6'
import { cn } from '../../../shared/cn'
import { AnimatePresence, motion } from 'framer-motion'

interface Filters {
  estado?: number | null
  fechaFin?: boolean | null
  activeFilter: string | null
  sinFechaFinYNo1: boolean | null
  deshabilitado: boolean | null
}

export const ModalProyectos = ({
  setOpen,
  setProyectoSeleccionado,
  proyectoSeleccionado,
  Event,
  actualizarHorariLaboral
}: {
  setOpen: any
  setProyectoSeleccionado: any
  proyectoSeleccionado: any
  Event: any
  actualizarHorariLaboral: any
}): JSX.Element => {
  const { auth } = useAuth()
  const [productos, setProductos] = useState<ValuesVenta[]>([])
  const [hosting, setHosting] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [, setTotalRegistros] = useState(0)
  const [horaInicio, setHoraInicio] = useState('')
  const [horaFin, setHoraFin] = useState('')
  const [paginaActual, setpaginaActual] = useState<number>(1)
  const [search, setSearch] = useState('')
  const [texto, setTexto] = useState('')
  const [antiguos, setAntiguos] = useState(false)
  const [cantidadRegistros] = useState(12)
  const [filters, setFilters] = useState<Filters>({
    estado: null,
    fechaFin: null,
    activeFilter: 'sinFechaFinYNo1',
    sinFechaFinYNo1: true,
    deshabilitado: null
  })
  const [openEstado, setOpenEstado] = useState(false)
  const [area, setArea] = useState('Todos')
  const [tipo, setTipo] = useState('Todos')
  const handleChangeArea = (event: any): void => {
    setArea(event.target.value)
  }

  useEffect(() => {
    getDataVentas(
      'indexHostingToColaboradores',
      setHosting,
      setTotalRegistros
    )
  }, [])

  useEffect(() => {
    setLoading(true)
    if (!antiguos) {
      Promise.all([
        getDataVentas(
            `indexToColaboradores/${auth.id}`,
            setProductos,
            setTotalRegistros
        )
      ]).then(() => {
        setLoading(false)
      })
    } else {
      Promise.all([
        getDataVentas(
          'indexAllVentas',
          setProductos,
          setTotalRegistros
        )
      ]).then(() => {
        setLoading(false)
      })
    }
  }, [antiguos])

  const indexOfLastPost = paginaActual * cantidadRegistros
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros
  let totalPosts = productos.length

  const filterDate = (): ValuesVenta[] => {
    let filteredProductos = productos

    if (tipo == 'Hosting') {
      filteredProductos = hosting
    } else {
      filteredProductos = productos

      if (filters.activeFilter == 'estado' && filters.estado !== null) {
        filteredProductos = filteredProductos.filter(
          (pro) => pro.estado == String(filters.estado)
        )
      } else if (
        filters.activeFilter == 'fechaFin' &&
              filters.fechaFin !== null
      ) {
        filteredProductos = filteredProductos.filter(
          (pro) =>
            pro.fecha_fin !== null && pro.fecha_fin !== '' && pro.estado != '1'
        )
      } else if (filters.activeFilter == 'deshabilitado') {
        filteredProductos = filteredProductos.filter(
          // @ts-expect-error
          (pro) => pro.community_activo == 'false' && pro.fecha_fin == null
        )
      } else if (
        filters.activeFilter == 'sinFechaFinYNo1' &&
              filters.sinFechaFinYNo1 !== null
      ) {
        filteredProductos = filteredProductos.filter(
          (pro) =>
            (pro.fecha_fin == null || pro.fecha_fin == '') &&
                  pro.fecha_inicio &&
                  pro.estado != '1' &&
                  // @ts-expect-error
                  pro.community_activo != 'false'
        )
      }

      if (area != 'Todos') {
        filteredProductos = filteredProductos.filter(
          (pro) =>
          // @ts-expect-error
            ((pro.categoria_plan) == (area))
        )
      }

      if (tipo == 'Clientes') {
        filteredProductos = filteredProductos.filter(
          (pro: any) => ((pro.id_preventa) != 2298)
        )
      } else if (tipo == 'Agencia') {
        filteredProductos = filteredProductos.filter(
          (pro: any) => ((pro.id_preventa) == 2298)
        )
      }
    }
    if (search.length > 0) {
      filteredProductos = filteredProductos.filter((pro) => {
        return (
          quitarAcentos(pro?.nombre_empresa?.toLowerCase()).includes(
            quitarAcentos(search.toLowerCase())
          ) ||
          String(pro.id).includes(search) ||
          String(pro.id_contrato.toLowerCase()).includes(search.toLowerCase())
        )
      })
    }
    totalPosts = filteredProductos.length
    return filteredProductos.slice(indexOfFirstPost, indexOfLastPost)
  }

  useEffect(() => {
    setTotalRegistros(totalPosts)
  }, [search, filters, productos])

  const onSeachChange = ({
    target
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setpaginaActual(1)
    setSearch(target.value)
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const toggleFilter = (
    type: 'estado' | 'fechaFin' | 'sinFechaFinYNo1' | 'enCola' | 'deshabilitado',
    value: number | boolean
  ) => {
    setFilters((prev) => {
      if (prev.activeFilter === type) {
        if (type === 'fechaFin') {
          // Si desactivas el filtro fechaFin, desactiva el filtro enCola y activa automáticamente el filtro sinFechaFinYNo1
          return {
            ...prev,
            fechaFin: null,
            sinFechaFinYNo1: true,
            enCola: null,
            activeFilter: 'sinFechaFinYNo1'
          }
        } else if (type === 'enCola') {
          // Si desactivas el filtro enCola, activa automáticamente el filtro sinFechaFinYNo1
          return {
            ...prev,
            fechaFin: null,
            sinFechaFinYNo1: true,
            enCola: null,
            activeFilter: 'sinFechaFinYNo1'
          }
        } else {
          // Desactiva el filtro si ya estaba activo
          return { ...prev, [type]: null, activeFilter: null }
        }
      }
      // Activa el filtro seleccionado y desactiva los demás
      return {
        estado: null,
        fechaFin: null,
        enCola: null,
        sinFechaFinYNo1: null,
        deshabilitado: null,
        [type]: value,
        activeFilter: type
      }
    })
    setpaginaActual(1)
  }

  const actualizarContenido = (): void => {
    if (horaInicio && texto.length > 2) {
      let updatedDetalle = { ...Event.detalle }
      if (!updatedDetalle) {
        updatedDetalle = { horas: {} }
      }
      const horaInicioSplit = horaInicio.split(':')
      const horaFinSplit = horaFin.split(':')
      // Convertir las horas a números enteros
      const horaInicioNum = parseInt(horaInicioSplit[0], 10)
      const minutoInicioNum = parseInt(horaInicioSplit[1], 10)
      const horaFinNum = parseInt(horaFinSplit[0], 10)
      const minutoFinNum = parseInt(horaFinSplit[1], 10)

      // Calcular la cantidad de horas en el rango de tiempo
      const duracionHoras = horaFinNum - horaInicioNum + 1

      // Crear réplicas de la actividad para cada hora dentro del rango de tiempo
      for (let i = 0; i < duracionHoras; i++) {
        const horaKey = `${horaInicioNum + i}`
        // Obtener las actividades para la hora actual o crear un nuevo array
        const actividades = updatedDetalle[horaKey] || []
        // Calcular los minutos de inicio y fin para la actividad actual
        // Agregar ceros a la izquierda si los minutos tienen un solo dígito
        const minutoInicio =
          i === 0 ? String(minutoInicioNum).padStart(2, '0') : '00'
        const minutoFin =
          i === duracionHoras - 1
            ? String(minutoFinNum).padStart(2, '0')
            : '59'
        // Agregar la nueva actividad al array de actividades
        actividades.push({
          id: uuidv4(),
          horaInicio: `${horaInicioNum + i}:${minutoInicio}`,
          horaFin: `${horaInicioNum + i}:${minutoFin}`,
          proyecto: {
            id: proyectoSeleccionado.proyecto.id,
            nombre: proyectoSeleccionado.proyecto.nombre_marca,
            contrato: proyectoSeleccionado.proyecto.id_contrato,
            nombreCliente: `${proyectoSeleccionado.proyecto.nombres} ${proyectoSeleccionado.proyecto.apellidos}`
          },
          descripcion: texto
        })

        // Actualizar las actividades en el detalle
        updatedDetalle[horaKey] = actividades
      }
      actualizarHorariLaboral({ ...Event, detalle: updatedDetalle })
      setOpen(false)
      setTexto('')
      setProyectoSeleccionado({ hora: null, proyecto: null })
    } else {
      toast.warning('Debe seleccionar hora de inicio y fin')
    }
  }

  const handleTextChange = (e: any): void => {
    setTexto(e.target.value)
    e.target.style.height = 'inherit'
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    e.target.style.height = `${e.target.scrollHeight}px` // Ajusta la altura
  }

  useEffect(() => {
    if (proyectoSeleccionado.hora) {
      const horaFormatted = String(proyectoSeleccionado.hora).padStart(2, '0')
      setHoraInicio(`${horaFormatted}:00`)
      setHoraFin(`${horaFormatted}:`)
    }
  }, [proyectoSeleccionado])

  return (
    <section className="absolute z-[999] inset-0 bg-gray-200 py-2">
      {proyectoSeleccionado.proyecto == null ? (
        <>
          <div className="flex flex-row items-center justify-between gap-y-4 mb-3 md:mb-5 gap-2">
            <div className="flex flex-col md:flex-row gap-2 items-center h-fit">
              <button className="bg-white ml-2 hover:bg-gray-100 w-full md:w-fit flex items-center text-black gap-2 py-2 px-4 rounded-lg hover:text-main transition-colors">
                <RiFilter2Fill />
                <input
                  placeholder="Buscar ..."
                  className="bg-transparent outline-none"
                  value={search}
                  onChange={onSeachChange}
                  type="search"
                />
              </button>
              <div className="select_areas ">
                    <SelectFilter area={area} setArea={setArea} handleChangeArea={handleChangeArea}/>
              </div>
              <div className="select_areas ">
                    <select name="" id=""
                        value={tipo}
                        onChange={(e) => { setTipo(e.target.value) }}
                        className=" border border-[#fff] text-[#1653D1] font-medium placeholder-gray-400 outline-none focus:outline-none
                    focus:border-[#1653D1] w-full px-4 py-2 pl-2  mr-0 mb-0 ml-0 text-base block bg-white
                    rounded-xl transition-all"
                    >
                        <option className="text-[#252525]" value={'Todos'}>Todos</option>
                        <option className="text-[#252525]" value="Clientes">Clientes</option>
                        <option className="text-[#252525]" value="Agencia">Agencia</option>
                        <option className="text-[#252525]" value="Hosting">Hosting</option>
                    </select>
              </div>
              <div className="select_areas ">
                    <button className={cn(' text-white rounded-md py-2 px-2 transition-colors', !antiguos ? 'bg-main hover:bg-main_dark ' : 'bg-red-600 hover:bg-red-800')}
                        onClick={() => { setAntiguos(!antiguos) }}
                    >Antiguos</button>
              </div>
            </div>
            <div className="p-3 flex gap-4 items-center">
            <div className="flex flex-col-reverse gap-3 relative">
            <AnimatePresence>
              {openEstado && (
                <motion.div
                  className="flex flex-col gap-2 h-28 bg-white rounded-xl z-10 absolute mt-3 top-full inset-0"
                >
                  <button
                    className={`  px-2 md:px-4 text-sm md:text-base py-1 lg:py- rounded-xl line-clamp-1 font-bold ${
                      filters.activeFilter == 'sinFechaFinYNo1'
                        ? 'border border-transparent bg-gray-400 text-white'
                        : 'border border-gray-400 text-black'
                    }`}
                    onClick={() => {
                      toggleFilter('sinFechaFinYNo1', true)
                    }}
                  >
                    En proceso
                  </button>
                  <button
                    className={` px-2 md:px-4 text-sm md:text-base py-1 lg:py- rounded-xl line-clamp-1 font-bold ${
                      filters.activeFilter == 'fechaFin'
                        ? 'border border-transparent bg-green-600 text-white '
                        : 'border border-gray-400 bg-transparent text-black '
                    }`}
                    onClick={() => {
                      toggleFilter('fechaFin', true)
                    }}
                  >
                    Finalizados
                  </button>
                  <button
                    className={` border px-2 md:px-4 py-1 lg:py- rounded-xl line-clamp-1 font-bold ${
                      filters.activeFilter == 'deshabilitado'
                        ? 'bg-yellow-500 text-white '
                        : 'bg-transparent border-gray-400 text-black bg-white'
                    }`}
                    onClick={() => {
                      toggleFilter('deshabilitado', true)
                    }}
                  >
                    Deshabilitados
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
            <div
              className="flex gap-2 z-20 cursor-pointer text-black items-center h-9 bg-white border border-secundario rounded-xl px-4 py-1"
              onClick={() => {
                setOpenEstado(!openEstado)
              }}
            >
              <MdLabelOutline className="text-xl font-semibold text-secundario" />
              <span className="font-semibold ">Estado</span>
              <FaAngleDown
                className={cn(
                  'text-xs mt-1 ml-2 text-secundario transition-all',
                  openEstado ? 'rotate-90' : ''
                )}
              />
            </div>
            {/* DESPLEGABLE */}
            </div>
              <FaRegWindowClose
                className="text-2xl text-red-500 cursor-pointer hover:text-main_dark transition-colors"
                onClick={() => setOpen(false)}
              />
            </div>
          </div>
          {loading ? (
            <Loading />
          ) : (
            <div className="md:bg-[#fff] md:p-8 rounded-xl">
              <div
                className={`hidden md:grid md:pr-10 lg:pr-4 grid-cols-1 md:grid-cols-4 ${
                  !filters.sinFechaFinYNo1 ? 'lg:grid-cols-4' : 'lg:grid-cols-4'
                } gap-4 mb-2 md:px-4 md:py-2 text-gray-400 border-y border-gray-300`}
              >
                <h5 className="md:text-left line-clamp-1">Contrato</h5>
                <h5 className="md:text-left line-clamp-1 md:hidden lg:block">
                  Cliente
                </h5>
                <h5 className="md:text-left line-clamp-1 md:col-span-2 lg:col-span-1">
                  Marca
                </h5>
                <h5 className="md:text-center">Estado</h5>
              </div>
              {filterDate().map((orden: ValuesVenta, index: number) => (
                <div
                  className={`grid grid-cols-1 md:grid-cols-4 hover:bg-gray-400 transition-colors cursor-pointer ${
                    !filters.sinFechaFinYNo1
                      ? 'lg:grid-cols-4'
                      : 'lg:grid-cols-4'
                  } md:pr-10 lg:pr-4 relative gap-3 items-center mb-3 md:mb-3 ${
                    index % 2 == 0 ? 'bg-transparent' : 'bg-gray-200'
                  } md:px-4 md:py-2 rounded-xl relative shadow_class`}
                  onClick={() =>
                    setProyectoSeleccionado({
                      ...proyectoSeleccionado,
                      // @ts-expect-error
                      proyecto: tipo != 'Hosting' ? orden : orden.venta
                    })
                  }
                  key={orden.id}
                >
                  <div
                    // to={`view-servicio/${orden.id}`}
                    className="flex flex-col gap-3 md:hidden bg-form p-4 rounded-xl"
                  >
                    <div className="flex md:hidden gap-4">
                      {orden.estado == '1' ? (
                        <span className="flex items-center justify-center bg-red-400 text-red-600  w-8 h-8 rounded-full">
                          A
                        </span>
                      ) : orden.fecha_fin != null ? (
                        <span className="flex items-center justify-center bg-[#b3dba1] text-green-700 w-8 h-8 rounded-full">
                          T
                        </span>
                      ) : (
                        <span className="flex items-center justify-center bg-gray-300 text-gray-500 w-8 h-8 rounded-full">
                          P
                        </span>
                      )}
                      <span className="flex md:justify-left items-center gap-3 font-bold text-black">
                        {// @ts-expect-error
                        limpiarCadena(tipo != 'Hosting' ? orden.id_contrato : orden.correlativo)}
                      </span>
                    </div>
                    <div className="md:hidden flex justify-between gap-3">
                      <div className="md:text-center ">
                        <h5 className="md:hidden text-black font-bold mb-0 text-sm">
                          Empresa
                        </h5>

                        <span className="text-left w-full text-black line-clamp-1">
                           {// @ts-expect-error
                            tipo != 'Hosting' ? orden.nombre_marca : JSON.parse(orden.hosting).marca}
                        </span>
                      </div>
                      <div className="md:text-right ">
                        <h5 className="md:hidden text-black font-bold mb-0 text-sm bg text-right">
                          Cliente
                        </h5>
                        {orden.id_contacto ? (
                          <>
                            {orden.arraycontacto &&
                              JSON.parse(orden.arraycontacto).length > 0 &&
                              JSON.parse(orden.arraycontacto)
                                .filter(
                                  (contacto: arrayContacto) =>
                                    String(contacto.id ?? '') ==
                                    orden.id_contacto
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
                    </div>
                    <div className="md:hidden flex justify-between gap-3">
                      <div className="md:text-center ">
                        <h5 className="md:hidden text-[#62be6d] font-bold mb-0 text-sm ">
                          Fecha de Alta
                        </h5>
                        <span className="text-left block text-[#62be6d]">
                          {orden.fecha_alta}
                        </span>
                      </div>
                      <div className="md:text-center ">
                        <h5 className="md:hidden text-[#62be6d] font-bold mb-0 text-sm ">
                          Fecha de Inicio
                        </h5>
                        <span className="text-left block text-[#62be6d]">
                          {orden.fecha_inicio}
                        </span>
                      </div>
                      {!filters.sinFechaFinYNo1 && (
                        <div className="md:text-right ">
                          <h5 className="md:hidden text-red-500 text-right font-bold mb-0 text-sm">
                            Fecha de cierre
                          </h5>
                          <span className="text-right block text-red-500">
                            {orden.fecha_fin}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                  {/* PC */}
                  <div className="hidden md:block md:text-center">
                    <span className="text-left block text-black w-full line-clamp-1">
                        {// @ts-expect-error
                        limpiarCadena(tipo != 'Hosting' ? orden.id_contrato : orden.correlativo)}
                    </span>
                  </div>
                  <div className="hidden md:block md:text-center col-span-1 relative h-full">
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
                                className="text-left text-black line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10"
                              >
                                {contacto.nombres}
                              </span>
                            ))}
                      </>
                    ) : (
                      <span className="text-left text-black line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10">
                        {orden.nombres} {orden.apellidos}
                      </span>
                    )}
                  </div>
                  <div className="hidden md:block md:text-center md:col-span-2 lg:col-span-1">
                    <span className="text-left text-black line-clamp-1 w-full">
                      {// @ts-expect-error
                      tipo != 'Hosting' ? orden.nombre_marca : JSON.parse(orden.hosting).marca}
                    </span>
                  </div>

                  <div
                    className={`hidden w-fit mx-auto md:flex gap-2 px-2 items-center justify-center md:text-center ${
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
                    ) : !orden.fecha_inicio && !orden.fecha_alta ? (
                      <>
                        {/* <BsGraphUp className="hidden lg:block" /> */}
                        <span className="text-center gap-2 font-bold px-2 line-clamp-1 ">
                          En cola
                        </span>
                      </>
                    )
                    // @ts-expect-error
                      : orden.community_activo == 'false' ? (
                        <>
                          {/* <BsCheckCircle className="hidden lg:block" /> */}
                          <span className="text-center  text-white font-bold w-fit line-clamp-1">
                            Deshabilitado
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
                </div>
              ))}

              <div className="flex flex-col md:flex-row gap-5 md:gap-0 justify-center md:justify-between content_buttons pt-3">
                <p className="text-md ml-1 text-black">
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
          )}
        </>
      ) : (
        <div className="w-full h-full flex flex-col justify-center items-center">
          <div className="w-[400px flex flex-col gap-2">
            <h2 className="text-xl font-bold text-center">
              Selecciona el rango de minutos : {proyectoSeleccionado.hora}
            </h2>
            <label htmlFor="horaInicioHour">Hora de inicio: {horaInicio}</label>
            <div className="flex gap-3 w-full">
              {Event.timeRanges.map((timeRange: any, index: number) => {
                const currentHour = new Date().getHours()
                const firstHour = new Date(timeRange.start).getHours()
                let lastHour = currentHour
                if (timeRange.end) {
                  lastHour = new Date(timeRange.end).getHours()
                }
                const hoursInRange = Array.from(
                  { length: lastHour - firstHour + 1 },
                  (_, i) => i + firstHour
                )

                const isCurrentRange = firstHour <= currentHour && currentHour <= lastHour

                if (isCurrentRange) {
                  return (
                      <select
                        key={index}
                        value={horaInicio.split(':')[0]} // Obtener solo la hora de la hora seleccionada
                        onChange={(e) => {
                          const newHour = e.target.value
                          setHoraInicio(
                            `${newHour}:${horaInicio.split(':')[1]}` // Mantener los minutos y solo actualizar la hora
                          )
                        }}
                      >
                        <option value="">Seleccionar</option>
                        {hoursInRange.map((hour) => (
                          <option key={hour} value={hour < 10 ? '0' + hour : hour}>
                            {hour < 10 ? '0' + hour : hour}
                          </option>
                        ))}
                      </select>
                  )
                }
              })}
              <select
                id="minutos"
                className="w-full"
                value={horaInicio.split(':')[1]} // Obtener solo los minutos de la hora seleccionada
                onChange={(e) => {
                  const newMinutes = e.target.value
                  setHoraInicio(`${horaInicio.split(':')[0]}:${newMinutes}`) // Mantener la hora y solo actualizar los minutos
                }}
              >
                <option value="">Seleccionar</option>
                {[...Array(60).keys()]
                  .filter((minute) => minute % 5 === 0 || minute === 59)
                  .map((minute) => (
                    <option
                      key={minute}
                      value={minute < 10 ? '0' + minute : minute}
                    >
                      {minute < 10 ? '0' + minute : minute}
                    </option>
                  ))}
              </select>
            </div>

            <label htmlFor="horaFin" className="mt-4">
              Hora de fin: {horaFin}
            </label>
            <div className="flex gap-3 w-full">
              {Event.timeRanges.map((timeRange: any, index: number) => {
                const currentHour = new Date().getHours()
                const firstHour = new Date(timeRange.start).getHours()
                let lastHour = currentHour
                if (timeRange.end) {
                  lastHour = new Date(timeRange.end).getHours()
                }
                const hoursInRange = Array.from(
                  { length: lastHour - firstHour + 1 },
                  (_, i) => i + firstHour
                )
                const isCurrentRange = firstHour <= currentHour && currentHour <= lastHour

                if (isCurrentRange) {
                  return (
                      <select
                        key={index}
                        id="horaInicioHour"
                        value={horaFin.split(':')[0]} // Obtener solo la hora de la hora seleccionada
                        onChange={(e) => {
                          const newHour = e.target.value
                          setHoraFin(
                            `${newHour}:${horaFin.split(':')[1]}` // Mantener los minutos y solo actualizar la hora
                          )
                        }}
                      >
                        <option value="">Seleccionar</option>
                        {hoursInRange.map((hour) => (
                          <option key={hour} value={hour < 10 ? '0' + hour : hour}>
                            {hour < 10 ? '0' + hour : hour}
                          </option>
                        ))}
                      </select>
                  )
                }
              })}
              <select
                id="minutos"
                className="w-full"
                value={horaFin.split(':')[1]} // Obtener solo los minutos de la hora seleccionada
                onChange={(e) => {
                  const newMinutes = e.target.value
                  setHoraFin(`${horaFin.split(':')[0]}:${newMinutes}`) // Mantener la hora y solo actualizar los minutos
                }}
              >
                <option value="">Seleccionar</option>
                {[...Array(60).keys()]
                  .filter((minute) => minute % 5 === 0 || minute === 59)
                  .map((minute) => (
                    <option
                      key={minute}
                      value={minute < 10 ? '0' + minute : minute}
                    >
                      {minute < 10 ? '0' + minute : minute}
                    </option>
                  ))}
              </select>
            </div>
            <label htmlFor="horaFin" className="mt-4">
              Detallar actividad
            </label>
            <textarea
              placeholder="Escribir resumen"
              className="w-full h-full outline-none p-2 resize-none overflow-hidden text-black"
              id="tuTextArea"
              rows={1}
              value={texto}
              onChange={handleTextChange}
            ></textarea>
            <button
              className="bg-green-600 py-2 rounded-md text-white mt-3"
              onClick={() => {
                actualizarContenido()
              }}
            >
              Agregar Actividad
            </button>
            <button
              onClick={() => {
                setOpen(false)
                setProyectoSeleccionado({ hora: null, proyecto: null })
                setTexto('')
              }}
            >
              Cancelar
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
