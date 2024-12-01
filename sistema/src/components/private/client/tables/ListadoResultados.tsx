/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useEffect, useState } from 'react'
// import { Link } from 'react-router-dom'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { Loading } from '../../../shared/Loading'
import { Paginacion } from '../../../shared/Paginacion'
import { Link, useNavigate } from 'react-router-dom'
import { IoCodeDownload } from 'react-icons/io5'
import Tooltip from '@mui/material/Tooltip'
import Swal from 'sweetalert2'
import { BsCheckCircle } from 'react-icons/bs'
import { TbDirectionSignFilled } from 'react-icons/tb'
import { Cards } from './cards/Cards'
import { Plataformas } from './cards/Plataformas'
import { Areas } from './cards/Areas'
import Tour from 'reactour'
import { type bannersValues } from '../../../shared/schemas/Interfaces'
import { quitarAcentos } from '../../../shared/functions/QuitarAcerntos'
import HeaderClient from '../includes/HeaderClient'
import useAuthCliente from '../../../../hooks/useAuthCliente'

export const ListadoResultados = (): JSX.Element => {
  const token = localStorage.getItem('tokenUser')
  const { auth, guia, setGuia, setLoadingComponents, setTitle, loadingComponents } = useAuthCliente()
  const [productos, setProductos] = useState<bannersValues[]>([])
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [paginaActual, setpaginaActual] = useState(1)
  const [, setloading] = useState(false)
  const [cantidadRegistros] = useState(4)
  const [colaboradores, setcolaboradores] = useState([])
  const [limite, setLimite] = useState(0)
  const [search, setSearch] = useState('')
  const getColaboradores = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getColaboradores`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setcolaboradores(request.data)
  }

  const getAllProductos = async (): Promise<void> => {
    setLoadingComponents(true)
    const request = await axios.get(`${Global.url}/getResultados/${auth.id}`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setProductos(request.data)
    setTotalRegistros(request.data.length)
    setLoadingComponents(false)
  }
  const indexOfLastPost = paginaActual * cantidadRegistros
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros
  let totalPosts = productos.length
  const navigate = useNavigate()

  const filterDate = (): bannersValues[] => {
    let filteredProductos = productos
    // ... puedes agregar otras condiciones de filtro aquí
    if (search.length > 0) {
      filteredProductos = filteredProductos.filter((pro) => {
        return (
          quitarAcentos(pro.nombre_marca.toLowerCase()).includes(
            quitarAcentos(search.toLowerCase())
          ) ||
          String(pro.id_contrato.toLowerCase()).includes(
            search.toLowerCase()
          ) ||
          quitarAcentos(pro.fecha_inicio.toLowerCase()).includes(
            quitarAcentos(search.toLowerCase())
          ) ||
          quitarAcentos(pro.fecha_fin.toLowerCase()).includes(
            quitarAcentos(search.toLowerCase())
          )
        )
      })
    }

    totalPosts = filteredProductos.length
    return filteredProductos.slice(indexOfFirstPost, indexOfLastPost)
  }

  useEffect(() => {
    setTitle('Listado de servicios')
    getColaboradores()
    getAllProductos()
    setGuia(false)
  }, [])

  const preguntar = (
    id: number,
    nombre: string,
    limitarDescarga: number,
    contrato: string
  ): void => {
    if (limitarDescarga < 1 && limite < 1) {
      Swal.fire({
        title: `Solo podra descargar 1 vez el contrato - ${contrato}?`,
        showDenyButton: true,
        confirmButtonText: 'Descargar',
        denyButtonText: 'Cancelar'
      }).then((result) => {
        if (result.isConfirmed) {
          descargarContrato(id, nombre)
        }
      })
    } else {
      Swal.fire('Ya no puede descargar este documento', '', 'warning')
    }
  }

  const descargarContrato = async (
    id: number,
    nombre: string
  ): Promise<void> => {
    setloading(true)
    try {
      const response = await axios({
        method: 'get',
        url: `${Global.url}/descargarContrato/${id ?? ''}`,
        responseType: 'blob', // Indicar que la respuesta es un blob (archivo)
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const a = document.createElement('a')
      a.href = url
      a.download = `${nombre}` // Cambiar por el nombre real del archivo
      document.body.appendChild(a)
      a.click()
      a.remove()
      const resultadoDes = await axios.get(
        `${Global.url}/actualizarLimiteContrato/${id ?? ''}`,
        {
          headers: {
            mode: 'no-cors',
            Authorization: `Bearer ${
              token !== null && token !== '' ? `Bearer ${token}` : ''
            }`
          }
        }
      )
      if (resultadoDes.data.mensaje) {
        setLimite(resultadoDes.data.mensaje)
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        Swal.fire('Relizo su unica descarga', '', 'success')
      }
    } catch (error) {
      console.error(error)
    }
    setloading(false)
  }

  useEffect(() => {
    setTotalRegistros(totalPosts)
  }, [search, productos])

  const steps = [
    {
      selector: '.first-step',
      content: 'Primero nos dirigimos al detalle del servicio'
    },
    {
      selector: '.first-step2',
      content: 'Primero nos dirigimos al detalle del servicio'
    }
  ]

  const handleClose = (): void => {
    setGuia(false)
  }

  return (
    <>
      {loadingComponents
        ? <Loading />
        : (
        <>
          <HeaderClient
            search={search}
            setSearch={setSearch}
            setpaginaActual={setpaginaActual}
          />
          <div className="flex flex-col justify-between h-[90vh] md:h-[87.5vh] text-black">
            <div className="bg-form p-4 md:py-6 md:px-10 rounded-none lg:rounded-xl mt-0 lg:mt-4">
              <div className="hidden lg:flex flex-col gap-3 mb-6 ">
                <h2 className="text-3xl font-bold">Ultimos Servicios</h2>
                <h3 className="font-bold text-base">
                  {totalRegistros} total,{' '}
                  <span className="text-gray-400 text-base">
                    servicios terminados
                  </span>{' '}
                </h3>
              </div>
              <div className="hidden md:grid grid-cols-1 md:grid-cols-6 gap-4 mb-2 md:px-4 md:py-2 text-gray-400 border-y border-gray-300">
                <h5 className="md:text-left">Nº Contrato </h5>
                <h5 className="md:text-left">Colaborador a cargo </h5>
                <h5 className="md:text-left">Empresa/Negocio</h5>
                <h5 className="md:text-left">Estado</h5>
                <h5 className="md:text-left">Fecha inicio</h5>
                <h5 className="md:text-left">Fecha fin</h5>
              </div>
              {filterDate().map((pro: bannersValues, index: number) => (
                <div
                  className="grid grid-cols-1 md:grid-cols-6 gap-3 items-center mb-3 md:mb-0 bg-transparent p-4 rounded-xl relative shadow_class"
                  key={pro.id}
                >
                  {/* MOVIL */}
                  <Link
                    to={`view-servicio/${pro.id}`}
                    className="flex flex-col gap-3 md:hidden"
                  >
                    <div className="flex md:hidden gap-4">
                      <span className="flex items-center justify-center bg-[#b3dba1] w-8 h-8 rounded-full">
                        T
                      </span>
                      <span className="flex md:justify-left items-center gap-3 font-bold">
                        {pro.id_contrato}
                      </span>
                    </div>
                    <div className="md:hidden flex justify-between gap-3">
                      <div className="text-left w-full">
                        <h5 className="md:hidden text-black font-bold mb-0 text-sm">
                          A cargo
                        </h5>
                        <span className="text-left block">
                          {JSON.parse(pro.asignacion) != null &&
                          JSON.parse(pro.asignacion).length > 0
                            ? JSON.parse(pro.asignacion).map(
                              (asignacion: any) =>
                                colaboradores
                                  .filter(
                                    (colaborador: {
                                      id: number
                                      name: string
                                    }) =>
                                    // eslint-disable-next-line eqeqeq
                                      colaborador.id == asignacion.peso
                                  )
                                  .map(
                                    (colaborador: { name: string }) =>
                                      colaborador.name
                                  )
                                  .join(' , ')
                            )
                            : 'Aun no se te asigna un diseñador'}
                        </span>
                      </div>
                      <div className="text-right w-full">
                        <h5 className="md:hidden text-black font-bold mb-0 text-sm bg">
                          Empresa/Negocio
                        </h5>
                        <span className="text-right line-clamp-1">
                          {pro.nombre_marca}
                        </span>
                      </div>
                    </div>
                    <div className="md:hidden flex justify-between gap-3">
                      <div className="md:text-center ">
                        <h5 className="md:hidden text-[#62be6d] font-bold mb-0 text-sm ">
                          Fecha de Inicio
                        </h5>
                        <span className="text-left block text-[#62be6d]">
                          {pro.fecha_inicio}
                        </span>
                      </div>
                      <div className="md:text-right ">
                        <h5 className="md:hidden text-red-500 text-right font-bold mb-0 text-sm">
                          Fecha de cierre
                        </h5>
                        <span className="text-right block text-red-500">
                          {pro.fecha_fin}
                        </span>
                      </div>
                    </div>
                  </Link>
                  {/* PC */}
                  <div className="hidden md:block md:text-left ">
                    <h5 className="md:hidden text-white font-bold mb-2">
                      Nº Contrato
                    </h5>
                    {pro.pdf_contrato
                      ? <Tooltip title="Descargar contrato">
                        <span
                          className="flex md:justify-left items-center gap-3 cursor-pointer"
                          // eslint-disable-next-line @typescript-eslint/no-misused-promises, @typescript-eslint/no-unused-expressions
                          onClick={() => {
                            preguntar(
                              pro.id_ventas,
                              `${pro.id_contrato}_${auth.name ?? ''}.pdf`,
                              pro.limitar_descarga,
                              pro.id_contrato
                            )
                          }}
                        >
                          <IoCodeDownload className="text-red-600 text-3xl cursor-pointer" />{' '}
                          {pro.id_contrato}
                        </span>
                      </Tooltip>
                      : (
                      <span className="flex md:justify-left items-center gap-3 ">
                        {pro.id_contrato}
                      </span>
                        )}
                  </div>
                  <div className="hidden md:block md:text-center ">
                    <h5 className="md:hidden text-black font-bold mb-0 text-sm">
                      A cargo
                    </h5>
                    <span className="text-left block">
                      {JSON.parse(pro.asignacion) != null &&
                      JSON.parse(pro.asignacion).length > 0
                        ? JSON.parse(pro.asignacion).map(
                          (asignacion: any, index: number) => {
                            const colaboradoresAsignados = colaboradores
                              .filter(
                                (colaborador: { id: number, name: string }) =>
                                  colaborador.id == asignacion.peso
                              )
                              .map(
                                (colaborador: { name: string }) =>
                                  colaborador.name
                              )
                            return (
                                <span key={index}>
                                  {colaboradoresAsignados.join(', ')}
                                  {index ===
                                  JSON.parse(pro.asignacion).length - 1
                                    ? ''
                                    : index ===
                                      JSON.parse(pro.asignacion).length - 2
                                      ? '  '
                                      : ' '}
                                </span>
                            )
                          }
                        )
                        : 'Aun no se te asigna un diseñador'}
                    </span>
                  </div>
                  <div className="hidden md:block md:text-center">
                    <h5 className="md:hidden text-white font-bold mb-2">
                      Nombre de empresa
                    </h5>
                    <div className="marquee-container">
                      <span className="marquee-text">{pro.nombre_marca}</span>
                    </div>
                  </div>
                  <div className="hidden md:block md:text-center">
                    <h5 className="md:hidden text-white font-bold mb-2">
                      Estado
                    </h5>
                    {pro.fecha_fin != null
                      ? <span className="text-left flex gap-2 bg-[#EDF9E7] text-[#1A5515] font-bold items-center w-fit px-2">
                    <BsCheckCircle />
                    Terminado
                  </span>
                      : <span className="text-left flex gap-2 bg-gray-300 text-gray-500 font-bold items-center w-fit px-2">
                      <BsCheckCircle />
                      En proceso
                    </span>
                    }
                  </div>
                  <div className="hidden md:block md:text-center">
                    <h5 className="md:hidden text-white font-bold mb-2 bg-gray-300">
                      Fecha Inicio
                    </h5>
                    <span className="text-left block">{pro.fecha_inicio}</span>
                  </div>
                  <div className="hidden md:block md:text-center">
                    <h5 className="md:hidden text-white font-bold mb-2">
                      Fecha Fin
                    </h5>
                    <span className="text-left block">{pro.fecha_fin}</span>
                  </div>
                  <div className="hidden md:flex md:justify-center items-center absolute right-10 top-0 bottom-0">
                    {index == 0
                      ? (
                      <>
                        <Tour
                          steps={steps}
                          isOpen={guia}
                          onRequestClose={handleClose}
                          getCurrentStep={(curr: number) => {
                            if (curr == 1) {
                              navigate(`view-servicio/${pro.id}`)
                            }
                          }}
                        />
                        <Link
                          to={`view-servicio/${pro.id}`}
                          className="rounded-lg transition-colors text-gray-300  flex items-center justify-center gap-x-4 p-2 flex-1 first-step"
                        >
                          <TbDirectionSignFilled className="text-[#202020] text-2xl" />
                        </Link>
                      </>
                        )
                      : (
                      <Link
                        to={`view-servicio/${pro.id}`}
                        className="rounded-lg transition-colors text-gray-300  flex items-center justify-center gap-x-4 p-2 flex-1"
                      >
                        <TbDirectionSignFilled className="text-[#202020] text-2xl" />
                      </Link>
                        )}
                  </div>
                </div>
              ))}

              {productos.length > 4 && (
                <div className="flex flex-col md:flex-row gap-5 md:gap-0 justify-end content_buttons items-center mt-2">
                  <Paginacion
                    totalPosts={totalPosts}
                    cantidadRegistros={cantidadRegistros}
                    paginaActual={paginaActual}
                    setpaginaActual={setpaginaActual}
                  />
                </div>
              )}
            </div>
            <section className="h-auto grid grid-cols-1 lg:grid-cols-3 mt-4 gap-x-4">
              <div className="bg-white rounded-xl p-4 h-full w-full">
                <div className="relative w-full ">
                  <Cards />
                </div>
              </div>
              <Plataformas />
              <Areas />
            </section>
          </div>
        </>
          )}
    </>
  )
}
