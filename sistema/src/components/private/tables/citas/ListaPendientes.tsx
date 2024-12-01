import { useState, useEffect } from 'react'

import { Loading } from '../../../shared/Loading'
import { Link } from 'react-router-dom'
import { Paginacion } from '../../../shared/Paginacion'
import useAuth from '../../../../hooks/useAuth'
import {
  type errorValues,
  type ValuesPlanes,
  type pendientesValues
} from '../../../shared/schemas/Interfaces'
import { getDataToPlanes } from '../../../shared/FetchingData'
import { quitarAcentos } from '../../../shared/functions/QuitarAcerntos'
import { RiFilter2Fill, RiSettings3Fill } from 'react-icons/ri'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import Swal from 'sweetalert2'
import { AnimatePresence } from 'framer-motion'
import { AlertSucess } from '../../../shared/alerts/AlertSucess'
import { ModalOpcionesToLista } from './modal/ModalOpcionesToLista'
import { MenuButton } from '@szhsin/react-menu'
import { IoCalendarOutline } from 'react-icons/io5'
import { GeneracionVentas2 } from '../clientes/GeneracionVentas2'

interface valuesVentasTO {
  id: number
  medio_ingreso: string
  nombre_empresa: string
  plan: string
  id_contrato: string
  dni_ruc: string
  id_cliente: string
  nombre_cliente: string
  arraycontacto: string
}

export const ListaPendientes = (): JSX.Element => {
  const { setTitle } = useAuth()
  const [productos, setProductos] = useState<pendientesValues[]>([])
  const [loading, setLoading] = useState(true)
  const [planes, setplanes] = useState<ValuesPlanes[]>([])
  const [, setTotalRegistros] = useState(0)
  const [, setTotalRegistros2] = useState(0)
  const [paginaActual, setpaginaActual] = useState<number>(1)
  const [search, setSearch] = useState('')
  const [showError, setShowError] = useState<errorValues | null>(null)
  const [, setEvents] = useState<Event[]>([])
  const [cantidadRegistros] = useState(14)
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [open3, setOpen3] = useState(false)
  const [dato] = useState<valuesVentasTO>({
    id: 0,
    medio_ingreso: '',
    nombre_empresa: '',
    plan: '',
    id_contrato: '',
    dni_ruc: '',
    id_cliente: '',
    nombre_cliente: '',
    arraycontacto: ''
  })

  const getCitas = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getCita/1`, {
      headers: {
        Authorization: `Bearer ${
          token !== null && token !== '' ? `Bearer ${token}` : ''
        }`
      }
    })
    setProductos(JSON.parse(request.data.contenido))
    setTotalRegistros(JSON.parse(request.data.contenido).length)
  }

  useEffect(() => {
    setTitle('Listado de llamadas pendientes')
    Promise.all([
      getCitas(),
      getDataToPlanes('getPlanes', setplanes, setTotalRegistros2)
    ]).then(() => {
      setLoading(false)
    })
  }, [])

  const indexOfLastPost = paginaActual * cantidadRegistros
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros
  let totalPosts = productos.length
  const [eventoSelected, setEventoSelected] = useState<any | []>([])

  const filterDate = (): pendientesValues[] => {
    let filteredItems: pendientesValues[]

    if (search.length === 0) {
      filteredItems = productos.slice(indexOfFirstPost, indexOfLastPost)
    } else {
      const searchTerm = quitarAcentos(search.toLowerCase())
      const filter = productos.filter((pro) => {
        const fullName =
            `${pro.client.nombres} ${pro.client.apellidos}`.toLowerCase()
        const empresa = `${pro.client.empresa}`.toLowerCase()
        return (
          quitarAcentos(fullName).includes(searchTerm) ||
            quitarAcentos(empresa).includes(searchTerm) ||
            String(pro.client.celular).includes(searchTerm)
        )
      })

      totalPosts = filter.length
      filteredItems = filter.slice(indexOfFirstPost, indexOfLastPost)
    }
    return filteredItems.reverse()
  }

  const onSeachChange = ({
    target
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setpaginaActual(1)
    setSearch(target.value)
  }
  const token = localStorage.getItem('token')

  const handleEventClick = (event: pendientesValues): void => {
    if (event) {
      setOpen2(true)
      setEventoSelected(event)
    }
  }

  const updateCita2 = async (updatedEvents: Event[]): Promise<void> => {
    const data = new FormData()
    data.append('contenido', JSON.stringify(updatedEvents))
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(`${Global.url}/updateCitas/1`, data, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })

      if (respuesta.data.status == 'success') {
        setShowError({
          estado: 'success',
          texto: 'Evento eliminado'
        })
      } else {
        Swal.fire('Error al guardar', '', 'error')
      }
    } catch (error) {
      Swal.fire('Error', '', 'error')
    }
  }

  useEffect(() => {
    setTimeout(() => {
      if (showError != null) {
        setShowError(null)
      }
    }, 3000)
  }, [showError])

  return (
    <div className="w-full h-screen p-0 flex flex-col gap-6 relative">
      {loading
        ? <Loading />
        : (
        <>
          <div className="w-full h-full ">
            <div className="w-full flex mb-3 justify-between">
              <div>
                <Link to="/admin/citas">
                  <IoCalendarOutline
                    className="text-4xl text-main"
                    title="Calendario de citas"
                  />
                </Link>
              </div>
              <div className="flex gap-3">
                <div className="w-full md:w-[500px] flex gap-2 items-center h-fit">
                  <button className="bg-white hover:bg-gray-100 w-full md:w-full flex items-center text-black gap-2 py-2 px-4 rounded-lg hover:text-main transition-colors">
                    <RiFilter2Fill />
                    <input
                      placeholder="Buscar por cliente o celular"
                      className="bg-transparent outline-none w-full"
                      value={search}
                      onChange={onSeachChange}
                      type="search"
                    />
                  </button>
                </div>
              </div>
            </div>
            <div className="md:bg-[#fff] p-0 md:p-8 rounded-xl">
              <div className="hidden md:grid grid-cols-1 md:grid-cols-7 gap-3 mb-2 md:px-4 md:py-2 text-gray-400 border-y border-gray-300">
                <h5 className="md:text-left text-gray-700 font-medium line-clamp-1">
                  ID
                </h5>
                <h5 className="md:text-left text-gray-700 font-medium line-clamp-1 col-span-2">
                  Cliente
                </h5>
                <h5 className="md:text-left text-gray-700 font-medium line-clamp-1 md:block">
                  Celular
                </h5>
                <h5 className="md:text-left text-gray-700 font-medium line-clamp-1 ">
                  Evento
                </h5>
                <h5 className="md:text-center line-clamp-1 text-gray-700 font-medium">
                  Fecha
                </h5>
                <h5 className="md:text-center line-clamp-1"></h5>
              </div>
              {filterDate().map((orden: pendientesValues, index: number) => (
                <div
                  className={`grid grid-cols-1 md:grid-cols-7 relative gap-3 items-center mb-3 md:mb-0 ${
                    index % 2 == 0 ? 'bg-transparent' : 'bg-gray-200'
                  } md:px-4 md:py-1 rounded-xl relative shadow_class`}
                  key={index + 1}
                >
                  {/* PC */}
                  <div className="hidden md:block md:text-center">
                    <span className="text-left block text-black w-full line-clamp-1">
                      #{totalPosts - index }
                    </span>
                  </div>
                  <div className="hidden md:block md:text-center col-span-2">
                    <div className="line-clamp-1">
                      <span className="text-left block text-black w-full lowercase first-letter:uppercase">
                        {orden.client.nombres} {orden.client.apellidos}
                      </span>
                    </div>
                  </div>
                  <div className="hidden md:block md:text-center">
                    <span className="text-left block text-black w-full line-clamp-1">
                      {orden.client.celular}
                    </span>
                  </div>
                  <div className="hidden md:block md:text-center">
                    <div className="line-clamp-1">
                      <span className="text-left  text-black w-full  line-clamp-1">
                        {orden.title}
                      </span>
                    </div>
                  </div>
                  <div className="hidden md:block md:text-center">
                    <div>
                      <p className="text-black">
                        {new Date(orden.start).toLocaleString('es-PE', {
                          year: 'numeric',
                          month: 'numeric',
                          day: 'numeric',
                          timeZone: 'America/Lima' // Cambia a la zona horaria de Perú
                        })}
                      </p>
                      <p className="line-clamp-2 text-black">
                        {new Date(orden.start).toLocaleString('es-PE', {
                          hour: '2-digit',
                          minute: '2-digit',
                          timeZone: 'America/Lima' // Cambia a la zona horaria de Perú
                        })}{' '}
                        a{' '}
                        {new Date(orden.end).toLocaleString('es-PE', {
                          hour: '2-digit',
                          minute: '2-digit',
                          timeZone: 'America/Lima' // Cambia a la zona horaria de Perú
                        })}
                      </p>
                    </div>
                  </div>
                  <div className="md:text-center md:flex md:justify-center items-center absolute md:relative right-0 top-0">
                    <MenuButton
                      className="block p-2"
                      onClick={() => {
                        handleEventClick(orden)
                      }}
                    >
                      <RiSettings3Fill className="text-gray-500 text-lg" />
                    </MenuButton>
                  </div>
                </div>
              ))}
              <div className="flex flex-col md:flex-row gap-5 md:gap-0 justify-center md:justify-between content_buttons pt-3 mt-5">
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
          </div>
        </>
          )}
      <GeneracionVentas2
        open={open}
        setOpen={setOpen}
        datos={dato}
        planes={planes}
      />
      {eventoSelected && open2 && (
        <ModalOpcionesToLista
          setEvents={setEvents}
          eventoSelected={eventoSelected}
          open={open2}
          setOpen={setOpen2}
          updateCita={updateCita2}
          open3={open3}
          setOpen3={setOpen3}
          planes={planes}
        />
      )}

      <AnimatePresence>
        {showError != null && <AlertSucess showError={showError} />}
      </AnimatePresence>
    </div>
  )
}
