import { Table } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import {
  getDataToPlanes,
  getDataVentas
} from '../../../../shared/FetchingData'
import {
  type valuesResumen,
  type ValuesPlanes,
  type ValuesVenta
} from '../../../../shared/schemas/Interfaces'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'
import { IoCalendarOutline } from 'react-icons/io5'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import { Link, useParams } from 'react-router-dom'
import useAuth from '../../../../../hooks/useAuth'
import { FaSignal, FaSquareArrowUpRight } from 'react-icons/fa6'
import { Loading } from '../../../../shared/Loading'
import { Pagination, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { GoArrowRight, GoArrowLeft } from 'react-icons/go'
export const TableStatusToColaborador = (): JSX.Element => {
  const [loading, setLoading] = useState(true)
  const [, setTotalRegistros] = useState(0)
  const [productos, setProductos] = useState<ValuesVenta[]>([])
  const [open, setOpen] = useState(false)
  const { id } = useParams()
  const { setTitle } = useAuth()

  const handleClose = (): void => {
    setOpen(false)
  }

  useEffect(() => {
    Promise.all([
      getDataToPlanes('getPlanes', setplanes, setTotalRegistros),
      getColaboradores(),
      getDataVentas(
        `indexToColaboradores/${id ?? ''}`,
        setProductos,
        setTotalRegistros
      )
    ]).then(() => {
      setLoading(false)
    })
  }, [])

  const ordenarPorFecha = (a: valuesResumen, b: valuesResumen): number => {
    const fechaA = a.fecha.split('/').reverse().join('-')
    const fechaB = b.fecha.split('/').reverse().join('-')

    return new Date(fechaA).getTime() - new Date(fechaB).getTime()
  }

  const [planes, setplanes] = useState<ValuesPlanes[]>([])
  const [colaboradores, setcolaboradores] = useState([])
  const token = localStorage.getItem('token')
  const [fechaInicio, setFechaInicio] = useState<undefined | string>(undefined)
  const [fechaFin, setFechaFin] = useState<undefined | string>(undefined)

  const getColaboradores = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getColaboradores`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setcolaboradores(request.data)
    request.data.forEach((colaborador: { id: string, name: string }) => {
      if (colaborador.id == id ?? '') {
        setTitle(`REPORTE - ${colaborador.name.toUpperCase()}`)
      }
    })
  }
  // Función que genera los <th> con las fechas de hoy y los dos días anteriores.
  const renderDateHeaders = (): JSX.Element[] => {
    const headers = []
    const today = new Date()
    let daysAdded: number = 0

    // eslint-disable-next-line no-unmodified-loop-condition
    for (let i = 1; daysAdded < 3; i++) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      if (date.getDay() !== 0) {
        daysAdded++
        headers.unshift(
          <th scope="col" style={{ width: '300px', padding: '0 10px' }}>
            {date.toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'numeric',
              year: 'numeric'
            })}
          </th>
        )
      }
    }

    return headers
  }

  const generarFechas = (): string[] => {
    if (fechaInicio && fechaFin) {
      const fechas = []
      // Verificar si la fecha de inicio está definida
      if (fechaInicio && fechaFin) {
        let currentDate = parseLocalDate(fechaInicio)
        const endDate = parseLocalDate(fechaFin)
        // Asegúrate también de que la fecha de fin esté definida y sea válida
        if (fechaFin && currentDate <= endDate) {
          while (currentDate <= endDate) {
            fechas.push(
              currentDate.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric'
              })
            )
            currentDate = new Date(
              currentDate.setDate(currentDate.getDate() + 1)
            )
          }
        }
      }
      return fechas
    } else {
      const fechas = []
      const hoy = new Date()
      let daysAdded: number = 0
      // eslint-disable-next-line no-unmodified-loop-condition
      for (let i = 1; daysAdded < 3; i++) {
        const fecha = new Date(hoy)
        fecha.setDate(hoy.getDate() - i)
        if (fecha.getDay() !== 0) {
          daysAdded++
          fechas.unshift(
            fecha.toLocaleDateString('es-ES', {
              day: 'numeric',
              month: 'numeric',
              year: 'numeric'
            })
          )
        }
      }

      return fechas
    }
  }

  const renderComentarios = (producto: any, fechas: any): JSX.Element => {
    return fechas.map((fecha: any, index: number) => {
      const comentarioEnFecha = producto.resumen
        ? JSON.parse(producto.resumen).find(
          (comentario: valuesResumen) => (comentario.fecha === fecha && comentario.userId != '8' && comentario.userId != '99')
        )
        : null
      return (
        <td key={index} style={{ verticalAlign: 'top', padding: '5px 10px' }}>
          {comentarioEnFecha ? comentarioEnFecha.texto.toUpperCase() : ''}
        </td>
      )
    })
  }

  const tieneComentariosEnFechas = (producto: any, fechas: any): boolean => {
    if (!producto.resumen) {
      return false
    }
    const comentarios = JSON.parse(producto.resumen)
    return comentarios.some((comentario: valuesResumen) =>
      fechas.includes(comentario.fecha)
    )
  }

  const parseLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  const renderDateRangeHeaders = (): JSX.Element[] => {
    const headers = []

    // Verificar si la fecha de inicio está definida
    if (fechaInicio && fechaFin) {
      let currentDate = parseLocalDate(fechaInicio)
      const endDate = parseLocalDate(fechaFin)
      // Asegúrate también de que la fecha de fin esté definida y sea válida
      if (fechaFin && currentDate <= endDate) {
        while (currentDate <= endDate) {
          headers.push(
            <th scope="col" style={{ width: '300px', padding: '0 10px' }}>
              {currentDate.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric'
              })}
            </th>
          )
          currentDate = new Date(
            currentDate.setDate(currentDate.getDate() + 1)
          )
        }
      }
    }

    return headers
  }

  const obtenerComentarioMasReciente = (resumen: valuesResumen[]): any => {
    if (resumen.length > 0) {
      // Ordena todos los comentarios por fecha
      const resumenOrdenado = [...resumen].sort(ordenarPorFecha)
      // Devuelve el último comentario subido
      return resumenOrdenado[resumenOrdenado.length - 1] // El comentario más reciente en general
    } else {
      return null // No hay comentarios en el resumen
    }
  }

  const renderRespuesta = (producto: string): JSX.Element => {
    let comentarioReciente = null
    const resumenes = JSON.parse(producto)
    // Si hay resúmenes disponibles, busca el más reciente
    if (producto) {
      const comentarioRecienteHoy = obtenerComentarioMasReciente(resumenes)
      if (comentarioRecienteHoy?.respuestas) {
        // Filtra las respuestas que no tienen idUser igual a 8
        const respuestasFiltradas = comentarioRecienteHoy.respuestas.filter(
          (respuesta: any) => (respuesta.userId == 1)
        )
        // Ordena las respuestas filtradas y selecciona la más reciente
        if (respuestasFiltradas.length > 0) {
          comentarioReciente = {
            ...comentarioRecienteHoy,
            respuestas: [respuestasFiltradas[0]]
          }
        }
      }
    }
    // Verifica que comentarioReciente y comentarioReciente.respuesta existan
    const textoRespuesta = comentarioReciente?.respuestas[0]?.texto
    return (
      <td
        style={{
          verticalAlign: 'top',
          padding: '5px 10px',
          background: '#FFFF00',
          borderTop: '1px solid gray'
        }}
      >
        {textoRespuesta ? textoRespuesta.toUpperCase() : ''}
      </td>
    )
  }

  const renderComentariosToColaborador = (
    producto: any,
    fechas: any
  ): JSX.Element => {
    return fechas.map((fecha: any, index: number) => {
      const comentarioEnFecha = producto.resumen
        ? JSON.parse(producto.resumen).find(
          (comentario: valuesResumen) => (comentario.fecha === fecha && comentario.userId != '8' && comentario.userId != '99')
        )
        : null
      return (
        <div key={index} className="px-3 pb-4 rounded-xl bg-white">
          <p className="text-center w-fit mx-auto text-white bg-green-600 m-3 px-4 rounded-xl ">
            {fecha}
          </p>
          <p className="text-black lowercase first-letter:uppercase">
            {comentarioEnFecha
              ? comentarioEnFecha.texto
              : 'No hubo comentarios para este día'}
          </p>
        </div>
      )
    })
  }

  return (
    <>
      {!loading
        ? <>
      <div className="flex gap-10 mb-6">
        <ReactHTMLTableToExcel
          id="table-xls-button buttton1"
          className="bg-green-600 px-4 py-1 rounded-xl ml-4 w-fit"
          table="productos2"
          filename="Reporte de seguimiento"
          sheet="sheet1"
          buttonText="Descargar"
        />
        <IoCalendarOutline
          className="text-green-700 text-2xl lg:text-3xl cursor-pointer"
          onClick={() => {
            setOpen(true)
          }}
        />

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <section className="w-[500px]">
              <h2 className="text-2xl text-black font-bold w-full text-center">
                COLOCAR RANGO DE FECHAS
              </h2>
              <div className="w-full flex gap-10 mt-10 justify-between items-center">
                <div className="w-full flex flex-col gap-4">
                  <label
                    htmlFor=""
                    className="text-xl mb-4 text-green-600 text-center font-bold"
                  >
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    id="fechaInicio"
                    name="fechaInicio"
                    value={fechaInicio}
                    onChange={(e) => {
                      setFechaInicio(e.target.value)
                    }}
                    className="w-full text-xl outline-none"
                  />
                </div>
                <div className="w-full flex flex-col gap-4">
                  <label
                    htmlFor=""
                    className="text-xl mb-4 text-red-600 text-center font-bold"
                  >
                    Fecha Final
                  </label>
                  <input
                    type="date"
                    id="fechaFin"
                    value={fechaFin}
                    onChange={(e) => {
                      setFechaFin(e.target.value)
                    }}
                    name="fechaFin"
                    className="w-full text-xl outline-none"
                  />
                </div>
              </div>
              <div className="w-full flex items-center justify-center mt-10">
                <button
                  className="px-4 py-2 text-white bg-green-600 font-bold text-xl rounded-lg"
                  onClick={handleClose}
                >
                  Cerrar
                </button>
              </div>
            </section>
          </DialogContent>
        </Dialog>
      </div>

      <div className="swiper-button-prev3 fixed left-2 lg:left-[15%] top-[65%] md:top-[54%] lg:top-[61%] transform -translate-y-1/2 z-[999] w-[40px] h-[40px] flex items-center justify-center border-2 border-main text-3xl rounded-full cursor-pointer transition-all hover:scale-105 hover:border-dashed text-main">
        <GoArrowLeft />
      </div>
      <div className="swiper-button-next3 fixed right-2 lg:right-6 top-[65%] md:top-[54%] lg:top-[61%] transform -translate-y-1/2 z-[999] w-[40px] h-[40px] flex items-center justify-center border-2 border-main text-3xl rounded-full cursor-pointer transition-all hover:scale-105 hover:border-dashed text-main">
        <GoArrowRight />
      </div>

        <section className='w-full'>
            <Swiper
                pagination={{
                  type: 'progressbar'
                }}
                navigation={{
                  nextEl: '.swiper-button-next3',
                  prevEl: '.swiper-button-prev3'
                }}
                slidesPerView={3}
                spaceBetween={20}
                breakpoints={{
                  0: {
                    slidesPerView: 1,
                    spaceBetween: 20
                  },
                  640: {
                    slidesPerView: 2,
                    spaceBetween: 20
                  },
                  768: {
                    slidesPerView: 2,
                    spaceBetween: 40
                  },
                  1024: {
                    slidesPerView: 3,
                    spaceBetween: 50
                  }
                }}
                modules={[Pagination, Navigation]}
                className="mySwiper w-full"
            >
                {productos
                  .filter((producto) =>
                    tieneComentariosEnFechas(producto, generarFechas())
                  )
                  .map((producto) => {
                    const fechas = generarFechas()
                    return (
                    <SwiperSlide key={producto.id} className='pt-4'>
                        <section className="flex flex-col gap-6">
                            <div
                            // to={`view-servicio/${orden.id}`}
                            className="flex flex-col gap-3 bg-form p-4 rounded-xl w-full"
                            >
                            <div className="flex justify-between">
                                <div className="flex  gap-4 items-center">
                                {producto.estado == '1'
                                  ? (
                                    <span className="flex items-center justify-center bg-red-400 text-red-600  w-8 h-8 rounded-full">
                                    A
                                    </span>
                                    )
                                  : producto.fecha_fin != null
                                    ? (
                                    <span className="flex items-center justify-center bg-[#b3dba1] text-green-700 w-8 h-8 rounded-full">
                                    T
                                    </span>
                                      )
                                    : !producto.fecha_inicio && !producto.fecha_alta
                                        ? (
                                    <span className="flex items-center justify-center bg-yellow-300 text-yellow-600 w-8 h-8 rounded-full">
                                    C
                                    </span>
                                          )
                                        : (
                                    <span className="flex items-center justify-center bg-gray-300 text-gray-500 w-8 h-8 rounded-full">
                                    P
                                    </span>
                                          )}
                                <span className="flex md:justify-left items-center gap-3 font-bold text-black">
                                    {producto.id_contrato}
                                </span>
                                </div>
                                <div className="md:text-right pr-0">
                                <h5 className=" text-gray-500 text-right font-bold mb-0 text-sm">
                                    Fecha de alta
                                </h5>
                                <span className="text-right block text-gray-500">
                                    {producto.fecha_alta}
                                </span>
                                </div>
                            </div>
                            <div className=" flex justify-between gap-3">
                                <Link
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-expect-error
                                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                                to={`/admin/lista-clientes/editar/${producto.id_cliente}`}
                                className="md:text-center group"
                                title="VER CLIENTE"
                                >
                                <h5 className=" text-black font-bold mb-0 text-sm text-left group-hover:text-main transition-colors">
                                    Cliente
                                </h5>
                                <span className="text-left w-full text-black line-clamp-1 group-hover:text-main transition-colors">
                                    {producto.nombres} {producto.apellidos}
                                </span>
                                </Link>
                                <Link
                                to={`/admin/lista-servicios/avances/${producto.id}`}
                                className="md:text-right flex items-center justify-center text-black text-2xl hover:text-main transition-colors"
                                title="VER SEGUIMIENTO"
                                >
                                <FaSquareArrowUpRight />
                                </Link>
                            </div>
                            <div className=" flex justify-between gap-3">
                                <div className="md:text-center ">
                                <h5 className=" text-black font-bold mb-0 text-sm text-left">
                                    Empresa
                                </h5>
                                <span className="text-left w-full text-black line-clamp-1">
                                    {producto.nombre_empresa}
                                </span>
                                </div>
                                <div className="md:text-right ">
                                <h5 className=" text-black font-bold mb-0 text-sm bg text-right">
                                    Marca
                                </h5>
                                <span className="text-right w-full text-black line-clamp-1">
                                    {producto.nombre_marca
                                      ? producto.nombre_marca
                                      : 'No registrado'}
                                </span>
                                </div>
                            </div>
                            <div className=" flex justify-between gap-3">
                                <div className="md:text-center ">
                                <h5 className=" text-black font-bold mb-0 text-sm text-left">
                                    Telefono
                                </h5>
                                <span className="text-left w-full text-black line-clamp-1">
                                    {producto.celular}
                                </span>
                                </div>
                                <div className="text-right overflow-hidden">
                                <h5 className=" text-black font-bold mb-0 text-sm bg text-right">
                                    Correo
                                </h5>
                                <p className=" w-full text-black line-clamp-1" >
                                    {producto.email}
                                </p>
                                </div>
                            </div>
                            <div className=" flex justify-between gap-3">
                                <div className="md:text-center ">
                                <h5 className=" text-black font-bold mb-0 text-sm text-left">
                                    Plan
                                </h5>
                                <span className="text-left w-full text-black line-clamp-1">
                                    {planes.map((plan) =>
                                      producto.id_contrato.split('_')[0] == plan.codigo
                                        ? plan.nombre
                                        : ''
                                    )}
                                </span>
                                </div>
                                <div className="md:text-right ">
                                <h5 className=" text-black font-bold mb-0 text-sm bg text-right">
                                    Colaborador
                                </h5>
                                <span className="text-right w-full text-black line-clamp-1">
                                    {JSON.parse(producto.asignacion)?.map(
                                      (asignacion: any) =>
                                        colaboradores
                                          .filter(
                                            (colaborador: { id: number, name: string }) =>
                                              colaborador.id == asignacion.peso
                                          )
                                          .map(
                                            (colaborador: { name: string }) =>
                                              colaborador.name
                                          )
                                          .join(', ')
                                    )}
                                </span>
                                </div>
                            </div>
                            <div className=" flex justify-between gap-3">
                                <div className="md:text-center ">
                                <h5 className=" text-[#62be6d] font-bold mb-0 text-sm ">
                                    Fecha de Inicio
                                </h5>
                                <span className="text-left block text-[#62be6d]">
                                    {producto.fecha_inicio}
                                </span>
                                </div>
                                {producto.fecha_fin && (
                                <div className="md:text-right ">
                                    <h5 className=" text-red-500 text-right font-bold mb-0 text-sm">
                                    Fecha de cierre
                                    </h5>
                                    <span className="text-right block text-red-500">
                                    {producto.fecha_fin}
                                    </span>
                                </div>
                                )}
                            </div>
                            </div>
                            <div className="w-full flex flex-col gap-4">
                            <Link to={`/admin/seguimiento/${producto.id}`} className="text-black hover:text-main transition-colors w-fit mx-auto uppercase font-bold text-center flex gap-2 justify-center items-center" title='Detalle'>
                            <FaSignal/> Reporte
                            </Link>
                            <div className="w-full flex flex-col gap-4">
                                {renderComentariosToColaborador(producto, fechas)}
                            </div>
                            </div>
                        </section>
                    </SwiperSlide>
                    )
                  })}
            </Swiper>
        </section>

      {/* <section className="w-auto flex gap-10">

      </section> */}

      <Table
        id="productos2"
        className="table align-middle table-hover display w-full text-black"
        style={{ marginTop: '30px', width: 'auto', display: 'none' }}
      >
        <thead
          className="table-light"
          style={{ background: '#2F75B5', color: 'white' }}
        >
          <tr>
            <th
              scope="col"
              style={{
                width: '120px',
                padding: '0 10px',
                borderRight: '1px solid gray'
              }}
            >
              COD. CONTRATO
            </th>
            <th scope="col" style={{ width: '120px', padding: '0 10px' }}>
              CLIENTE
            </th>
            <th scope="col" style={{ width: '130px', padding: '0 10px' }}>
              EMPRESA/NOMBRE
            </th>
            <th scope="col" style={{ width: '130px', padding: '0 10px' }}>
              TELEFONO
            </th>
            <th scope="col" style={{ width: '80px', padding: '0 10px' }}>
              CORREO
            </th>
            <th scope="col" style={{ width: '130px', padding: '0 10px' }}>
              TIPO SERVICIO
            </th>
            <th scope="col" style={{ width: '100px', padding: '0 10px' }}>
              PLAN
            </th>
            <th scope="col" style={{ width: '130px', padding: '0 10px' }}>
              DESCRIPCIÓN
            </th>
            <th scope="col" style={{ width: '100px', padding: '0 10px' }}>
              ENCARGADO
            </th>
            <th scope="col" style={{ width: '80px', padding: '0 10px' }}>
              FECHA ALTA
            </th>
            <th scope="col" style={{ width: '80px', padding: '0 10px' }}>
              FECHA INICIO
            </th>
            <th scope="col" style={{ width: '80px', padding: '0 10px' }}>
              FECHA FINAL
            </th>
            <th scope="col" style={{ width: '100px', padding: '0 10px' }}>
              ESTADO
            </th>
            {fechaInicio && fechaFin
              ? renderDateRangeHeaders()
              : renderDateHeaders()}
            <th scope="col" style={{ width: '100px', padding: '0 10px' }}>
              OBSERVACIÓNES
            </th>
          </tr>
        </thead>
        <tbody id="tableBody">
          <>
            {productos
              .filter((producto) =>
                tieneComentariosEnFechas(producto, generarFechas())
              )
              .map((clinica, index) => {
                const fechas = generarFechas()
                return (
                  <tr
                    key={clinica.id}
                    style={index % 2 == 0 ? { background: '#D9D9D9' } : {}}
                  >
                    <td
                      className=""
                      style={{
                        textAlign: 'left',
                        verticalAlign: 'middle',
                        borderRight: '1px solid gray',
                        padding: '0 10px'
                      }}
                    >
                      {clinica.id_contrato}
                    </td>
                    <td
                      className=""
                      style={{
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        padding: '0 10px'
                      }}
                    >
                      {clinica.nombres} {clinica.apellidos}
                    </td>
                    <td
                      className=""
                      style={{
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        padding: '0 10px'
                      }}
                    >
                      {clinica.nombre_empresa}
                    </td>
                    <td
                      className=""
                      style={{
                        textAlign: 'left',
                        verticalAlign: 'middle',
                        padding: '0 10px'
                      }}
                    >
                      {clinica.celular}
                    </td>
                    <td
                      className=""
                      style={{
                        textAlign: 'left',
                        verticalAlign: 'middle',
                        width: '80px',
                        wordBreak: 'break-all',
                        color: '#008cff',
                        textDecoration: 'underline',
                        padding: '0 10px'
                      }}
                    >
                      {clinica.email}
                    </td>
                    <td
                      className=""
                      style={{
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        display: 'flex',
                        alignItems: 'center',
                        height: '190px',
                        width: '140px',
                        padding: '0 10px'
                      }}
                    >
                      {planes.map((plan) =>
                        clinica.id_contrato.split('_')[0] == plan.codigo
                          ? plan.tipo
                          : ''
                      )}
                    </td>
                    <td
                      className=""
                      style={{
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        padding: '0 10px'
                      }}
                    >
                      {planes.map((plan) =>
                        clinica.id_contrato.split('_')[0] == plan.codigo
                          ? plan.nombre
                          : ''
                      )}
                    </td>
                    <td
                      className=""
                      style={{
                        textAlign: 'justify',
                        verticalAlign: 'middle',
                        padding: '0 10px'
                      }}
                    >
                      {clinica.observaciones
                        ? clinica.observaciones
                        : planes.map((plan) =>
                          clinica.id_contrato.split('_')[0] == plan.codigo
                            ? plan.descripcion
                            : ''
                        )}
                    </td>
                    <td
                      className=""
                      style={{
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        padding: '0 10px'
                      }}
                    >
                      {JSON.parse(clinica.asignacion) != null &&
                      JSON.parse(clinica.asignacion).length > 0
                        ? JSON.parse(clinica.asignacion).map(
                          (asignacion: any) =>
                            colaboradores
                              .filter(
                                (colaborador: { id: number, name: string }) =>
                                // eslint-disable-next-line eqeqeq
                                  colaborador.id == asignacion.peso
                              )
                              .map(
                                (colaborador: { name: string }) =>
                                  colaborador.name
                              )
                              .join(', ')
                        )
                        : 'Aun no se te asigna un diseñador'}
                    </td>
                    <td
                      className=""
                      style={{
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        padding: '0 10px'
                      }}
                    >
                      {clinica.fecha_alta}
                    </td>
                    <td
                      className=""
                      style={{
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '190px',
                        width: '140px',
                        padding: '0 10px'
                      }}
                    >
                      {clinica.fecha_inicio}
                    </td>
                    <td
                      className=""
                      style={{
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        width: '140px',
                        padding: '0 10px'
                      }}
                    >
                      {clinica.fecha_fin}
                    </td>
                    <td
                      className=""
                      style={{
                        textAlign: 'justify',
                        verticalAlign: 'middle',
                        padding: '0 10px'
                      }}
                    >
                      {clinica.estado == '1'
                        ? 'Abandono'
                        : clinica.fecha_fin != null
                          ? 'Finalizado'
                          : 'En proceso'}
                    </td>
                    {renderComentarios(clinica, fechas)}
                    {renderRespuesta(clinica.resumen)}
                  </tr>
                )
              })}
          </>
        </tbody>
      </Table>
      </>
        : <Loading/>
    }
    </>
  )
}
