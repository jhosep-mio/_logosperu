/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import { IoIosSearch } from 'react-icons/io'
import { motion, AnimatePresence } from 'framer-motion'
import { addHours, format } from 'date-fns'
import Slide from '@mui/material/Slide'
import { Dialog } from '@mui/material'
import 'swiper/css'
import 'swiper/css/pagination'
import { type TransitionProps } from '@mui/material/transitions'
import { type arrayContacto, type ValuesVenta } from '../../../../../shared/schemas/Interfaces'
import { Global } from '../../../../../../helper/Global'
import { cn } from '../../../../../shared/cn'
import { Loading } from '../../../../../shared/Loading'
import { limpiarCadena, quitarAcentos } from '../../../../../shared/functions/QuitarAcerntos'

const Transition = React.forwardRef(function Transition (
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export const ListaHosting = ({ open, setOpen, dataUpdatedWeb, SaveContrato2 }: any): JSX.Element => {
  //   FILTROS
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(false)
  const [openList] = useState({ id: null, estado: false })
  const [productos, setProductos] = useState<ValuesVenta[]>([])
  const [search, setSearch] = useState('')

  const getDataVentas2 = async (ruta: string, setDatos: any): Promise<void> => {
    const request = await axios.get(`${Global.url}/${ruta}`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setDatos(request.data)
  }

  useEffect(() => {
    Promise.all([
      getDataVentas2('indexLista', setProductos)
    ]).then(() => {
      setLoading(false)
    })
  }, [])

  let totalPosts = 0

  const filterDate = (): ValuesVenta[] => {
    let filteredProductos = productos

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

  const onSeachChange = ({
    target
  }: React.ChangeEvent<HTMLInputElement>): void => {
    // setpaginaActual(1)
    setSearch(target.value)
  }

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

  const handleClick = (id: any): void => {
    const updatedData = {
      ...dataUpdatedWeb,
      id_hosting: id
    }
    SaveContrato2(updatedData)
  }

  return (
    <Dialog
      open={open}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => setOpen(false)}
      aria-describedby="alert-dialog-slide-description"
      className="moda_registro"
      maxWidth={'lg'}
    >
      <section className="px-6 py-4">
        <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center gap-2 pb-2">
          <h1 className="font-bold text-lg lg:text-3xl text-black">Hosting</h1>
        </div>
        <div className="flex mt-2 lg:mt-4 flex-col lg:flex-row items-center justify-between gap-y-4 mb-0 lg:mb-5 gap-2">
          <div className="w-full flex flex-col justify-between lg:flex-row gap-2 items-center h-fit">
            <button className="bg-white hover:bg-gray-100 w-full lg:w-[400px] flex items-center text-black gap-2 py-1 lg:py-2 px-4 rounded-lg hover:text-main transition-colors">
              <IoIosSearch className="text-xl" />
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
        {loading ? (
          <Loading />
        ) : (
          <div className="lg:bg-[#fff] lg:px-4 lg:py-4 lg:pt-2 rounded-xl min-h-[600px]">
            <div
              className={
                'hidden lg:grid pr-10 lg:pr-4 items-center grid-cols-11 gap-4 mb-2 lg:px-4 lg:py-2 text-gray-800 rounded-xl mt-3 bg-gray-100'
              }
            >
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
                      onClick = { () => { handleClick(orden.id) } }
                    className={`grid grid-cols-11 transition-all lg:pr-4 hover:bg-gray-200 cursor-pointer relative gap-3 items-center mb-3 lg:mb-0 ${
                      index % 2 == 0 ? 'bg-transparent' : 'bg-transparent'
                    } lg:px-4 lg:py-3 rounded-xl relative shadow_class`}
                    key={orden.id}
                  >
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
                        <p
                          className="text-left lowercase text-blue-500 hover:underline font-semibold line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-full z-10"
                        >
                          {hosting?.dominio}
                        </p>
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
                            'hidden lg:grid font-medium items-center grid-cols-17 mb-2  text-gray-800 mt-3'
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
                          className={`grid grid-cols-17 lg:pr-4 relative gap-3 items-center mb-3 lg:mb-0 ${
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
            <div className="grid border-t border-gray-300  items-center grid-cols-3 gap-6 lg:gap-0  content_buttons pt-2 mt-3">
              <p className="text-md ml-1 w-fit text-black font-bold bg-yellow-400">
                {totalPosts} Registros
              </p>
            </div>
          </div>
        )}
      </section>
      </Dialog>
  )
}
