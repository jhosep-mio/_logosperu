/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import { RiFilter2Fill, RiSettings3Fill } from 'react-icons/ri'
import { Loading } from '../../../shared/Loading'
import { type arrayContacto, type ListaContratosValues } from '../../../shared/schemas/Interfaces'
import { Paginacion } from '../../../shared/Paginacion'
import { Menu, MenuButton, MenuItem } from '@szhsin/react-menu'
import { v4 as uuidv4 } from 'uuid'
import { limpiarCadena, quitarAcentos } from '../../../shared/functions/QuitarAcerntos'
import { Global } from '../../../../helper/Global'
import axios from 'axios'
import { BsFileEarmarkPdfFill } from 'react-icons/bs'
import { GenerarAlta } from './alta/GenerarAlta'
import { cn } from '../../../shared/cn'
import Swal, { type SweetAlertResult } from 'sweetalert2'
import { convertirNumeroALetras } from '../../../shared/functions/GenerarTextoEnLetras'
import { toast } from 'sonner'
import { IoReceipt } from 'react-icons/io5'
import { parse } from 'date-fns'

export const ListaContratos = (): JSX.Element => {
  const { setTitle } = useAuth()
  const [productos, setProductos] = useState<ListaContratosValues[]>([])
  const [producto, setProducto] = useState<ListaContratosValues | null>(null)
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(true)
  const [open, setOpen] = useState(false)
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [paginaActual, setpaginaActual] = useState<number>(1)
  const [search, setSearch] = useState('')
  const [cantidadRegistros] = useState(12)
  const [usuarios, setUsuarios] = useState<never[]>([])
  const { auth } = useAuth()

  const getCotizaciones = async (): Promise<void> => {
    try {
      const requestFinal = await axios.get(`${Global.url}/getAllContratos`, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      const request = await axios.get(`${Global.url}/getVentas`, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      const ventas = request.data
      // Aquí haces la comparación para cada cotización
      const cotizacionesConVentas = requestFinal.data.map((cotizacion: ListaContratosValues) => {
        // Verificar si existe una venta con el mismo id_contrato que el correlativo de la cotización
        const venta = ventas.find((venta: any) => venta.id_contrato == cotizacion.correlativo)
        // Add a new field to the cotización indicating if it has a sale and include the comprobante
        // Añadir un nuevo campo a la cotización indicando si tiene venta o no
        return {
          ...cotizacion,
          tieneVenta: !!venta,
          comprobante: venta ? venta.comprobante : null,
          id_ventas: venta ? venta.id : null,
          comprobanteadicional: venta ? venta.comprobanteadicional : null,
          comprobanteadicionalgratis: venta ? venta.comprobanteadicionalgratis : null
        }
      })
      // Actualizar el estado con las cotizaciones que ahora incluyen la información sobre si tienen venta
      setProductos(cotizacionesConVentas)
      setTotalRegistros(cotizacionesConVentas.length)
    } catch (error) {
      console.error('Error al obtener las ventas:', error)
    }
  }

  const getUsuarios = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getUsuarios`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setUsuarios(request.data)
  }

  useEffect(() => {
    setTitle('Listado de contratos')
    Promise.all([getCotizaciones(), getUsuarios()]).then(() => {
      setLoading(false)
    })
  }, [])

  const indexOfLastPost = paginaActual * cantidadRegistros
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros
  let totalPosts = productos.length

  const filterDate = (): ListaContratosValues[] => {
    let filteredProductos = productos
    const searchTerm = quitarAcentos(search)
    // ... puedes agregar otras condiciones de filtro aquí
    if (search.length > 0) {
      filteredProductos = filteredProductos.filter((pro) => {
        const fullName = `${pro.nombres} ${pro.apellidos}`.toLowerCase()
        const empresa = `${pro.empresa}`.toLowerCase()
        return (
          quitarAcentos(empresa).includes(searchTerm) ||
          quitarAcentos(fullName).includes(searchTerm) ||
          String(pro.id).includes(searchTerm) ||
          String(pro.correlativo).includes(searchTerm)
        )
      })
    }

    totalPosts = filteredProductos.length
    return filteredProductos.slice(indexOfFirstPost, indexOfLastPost)
  }

  useEffect(() => {
    setTotalRegistros(totalPosts)
  }, [search])

  const onSeachChange = ({ target }: React.ChangeEvent<HTMLInputElement>): void => {
    setpaginaActual(1)
    setSearch(target.value)
  }

  const formatearFecha = (fechaStr: string): string => {
    const fecha = new Date(fechaStr)
    if (isNaN(fecha.getTime())) {
      return 'Fecha inválida'
    }
    const opcionesFormato: any = {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }
    return new Intl.DateTimeFormat('es-ES', opcionesFormato).format(fecha)
  }

  const DeleteItemsNew = ({ ruta, id, token }: any): void => {
    Swal.fire({
      title: `¿Estas seguro de eliminar al registro N° ${id ?? ''}?`,
      showDenyButton: true,
      confirmButtonText: 'Eliminar',
      denyButtonText: 'Cancelar'
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        try {
          const resultado = await axios.delete(`${Global.url}/${ruta}/${id ?? ''}`, {
            headers: {
              Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
            }
          })

          if (resultado.data.status == 'success') {
            Swal.fire('Registro eliminado correctamente', '', 'success')
            getCotizaciones()
          } else {
            Swal.fire('Error al eliminar el registro', '', 'error')
          }
        } catch (error) {
          Swal.fire('Error al eliminar el registro', '', 'error')
          console.log(error)
        }
      }
    })
  }

  const preguntar = (id: number | null): void => {
    DeleteItemsNew({
      ruta: 'deleteContrato',
      id,
      token
    })
  }

  const obtenerFechaHora = (): { fecha: string, hora: string } => {
    const ahora = new Date()
    const opcionesFecha = { year: 'numeric', month: '2-digit', day: '2-digit' }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const fecha = ahora.toLocaleDateString('es-PE', opcionesFecha)
    const opcionesHora = { hour: '2-digit', minute: '2-digit' }
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const hora = ahora.toLocaleTimeString('es-PE', opcionesHora)
    return { fecha, hora }
  }

  function obtenerDigitosAntesDeGuionBajo (cadena: string): string {
    const posicionGuionBajo = cadena.indexOf('_')
    if (posicionGuionBajo !== -1) {
      return cadena.substring(0, posicionGuionBajo)
    } else {
      return ''
    }
  }

  const generarComprobante = async (orden: any): Promise<void> => {
    const confirmar = await Swal.fire({
      title: '¿Está seguro?',
      text: '¿Desea actualizar el comprobante de pago?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, generar',
      cancelButtonText: 'Cancelar'
    })

    if (confirmar.isConfirmed) {
      setLoading(true)
      const data = new FormData()
      if (orden.id_contacto && orden.arraycontacto && JSON.parse(orden.arraycontacto).length > 0) {
        const contactosArray = JSON.parse(orden.arraycontacto)
        const contactoSeleccionado = contactosArray.find((contacto: any) => String(contacto.id ?? '') == orden.id_contacto)
        if (contactoSeleccionado) {
          const { nombres, marca } = contactoSeleccionado
          data.append('nombre_contacto', nombres)
          data.append('empresa', marca)
        } else {
          data.append('nombre_contacto', '')
          if (orden.empresa != `${orden.nombres} ${orden.apellidos}`) {
            data.append('empresa', orden.empresa)
          } else {
            data.append('empresa', '')
          }
        }
      } else {
        data.append('nombre_contacto', '')
        if (orden.empresa != `${orden.nombres} ${orden.apellidos}`) {
          data.append('empresa', orden.empresa)
        } else {
          data.append('empresa', '')
        }
      }
      data.append('adicionales', orden?.adicionales)
      data.append('email', orden?.email)
      data.append('email_alter', auth.email_alter)
      data.append('firma', auth.firma)
      data.append('password', auth.pass_email)
      data.append('nombres', `${orden.nombres} ${orden.apellidos}`)
      data.append('dni', `${orden.dni_ruc}`)
      data.append('email_cliente', `${orden.email}`)
      data.append('title', limpiarCadena(orden?.correlativo ?? ''))
      data.append('precio', `${orden.precio}`)
      data.append('precio_letras', `${convertirNumeroALetras(orden.precio).toLowerCase()}`)
      data.append('correlativo', orden.correlativo)
      data.append('contrato', obtenerDigitosAntesDeGuionBajo(orden.correlativo))
      const { fecha } = obtenerFechaHora()
      data.append('fecha_inicio', fecha)
      data.append(
        'contexto',
        `<strong>Estimado/a ${orden.nombres} ${orden.apellidos},</strong><p><br></p><p>Nos complace informarle que hemos recibido el pago completo de su <strong>saldo pendiente</strong>. Agradecemos su pronta atención y cumplimiento.</p><p><br></p><p>Adjunto a este correo encontrará el <strong>comprobante de pago</strong> correspondiente. Este documento confirma el pago de la totalidad de su servicio.</p>`
      )

      const values = JSON.parse(orden.comprobante)
      let preciofinal = 0
      let igvfinal = 0
      if (values.factura == 'Con factura') {
        igvfinal = Number(orden?.precio) * 0.18
      } else {
        igvfinal = 0
      }
      preciofinal = Number(orden?.precio) + igvfinal
      preciofinal = Number(preciofinal.toFixed(2))
      data.append('pendiente', '0')
      if (Number(preciofinal) - Number(values.montoCobrado) > 0) {
        data.append('pendiente_antes', (Number(preciofinal) - Number(values.montoCobrado)).toFixed(2))
        // ts-ignore
        data.append('pendiente_antes_letras', `${convertirNumeroALetras(Number(preciofinal) - Number(values.montoCobrado)).toLocaleLowerCase()}`)
      } else {
        // @ts-expect-error
        data.append('pendiente_antes', 0)
      }
      const comprobante = {
        ...JSON.parse(orden.comprobante),
        pdf2: `${orden.nombres} ${orden.apellidos}`,
        montoCobrado2: preciofinal,
        pendiente: 0
      }
      data.append('comprobante', JSON.stringify(comprobante))
      data.append('banco', values.banco)
      data.append('factura', values.factura)
      data.append('montoCobrado', Number(preciofinal).toFixed(2))
      data.append('montoCobrado_letra', convertirNumeroALetras(Number(preciofinal)).toLocaleLowerCase())
      if (values.factura == 'Sin factura') {
        data.append('estado', `${values.banco ? `${values.banco}` : ''}/sf/ok`.toLocaleUpperCase())
      } else if (values.factura == 'Con factura') {
        data.append('estado', `${values.banco ? `${values.banco}` : ''}/cf/ok`.toLocaleUpperCase())
      }

      try {
        const respuesta = await axios.post(`${Global.url}/ActualizarComprobante/${orden.id_ventas ?? ''}`, data, {
          headers: {
            Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
          }
        })
        console.log(respuesta)
        if (respuesta.data) {
          toast.success('Comprobante enviado')
          getCotizaciones()
        } else {
          Swal.fire('Error al actualizar', '', 'error')
        }
      } catch (error: unknown) {
        Swal.fire('Error', '', 'error')
        console.log(error)
      }
      setLoading(false)
    }
  }

  const actualizarPrecioAdicional = async (orden: any, comprobanteadicional: any): Promise<void> => {
    let archivo: any = null
    const confirmar = await Swal.fire({
      title: '¿Está seguro?',
      html: `
      <p>¿Desea actualizar el comprobante de pago?</p>
      <input type="file" id="fileInput" class="swal2-input text-sm cursor-pointer " style="width: auto;"/>
    `,
      text: '¿Desea actualizar el comprobante de pago  - adicional?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Sí, generar',
      cancelButtonText: 'Cancelar',
      preConfirm: () => {
        const fileInput = (Swal.getPopup() as HTMLElement).querySelector('#fileInput') as HTMLInputElement
        archivo = fileInput?.files?.[0] ?? null
        return archivo
      }
    })

    if (confirmar.isConfirmed) {
      setLoading(true)
      const idUnico = uuidv4()
      const data = new FormData()
      if (orden.id_contacto && orden.arraycontacto && JSON.parse(orden.arraycontacto).length > 0) {
        const contactosArray = JSON.parse(orden.arraycontacto)
        const contactoSeleccionado = contactosArray.find((contacto: any) => String(contacto.id ?? '') == orden.id_contacto)
        if (contactoSeleccionado) {
          const { nombres, marca } = contactoSeleccionado
          data.append('nombre_contacto', nombres)
          data.append('empresa', marca)
        } else {
          data.append('nombre_contacto', '')
          if (orden.empresa != `${orden.nombres} ${orden.apellidos}`) {
            data.append('empresa', orden.empresa)
          } else {
            data.append('empresa', '')
          }
        }
      } else {
        data.append('nombre_contacto', '')
        if (orden.empresa != `${orden.nombres} ${orden.apellidos}`) {
          data.append('empresa', orden.empresa)
        } else {
          data.append('empresa', '')
        }
      }

      data.append('adicionales', JSON.stringify(comprobanteadicional.arrayAdicionales))
      data.append('email', orden?.email)
      data.append('email_alter', auth.email_alter)
      data.append('firma', auth.firma)
      data.append('password', auth.pass_email)
      data.append('nombres', `${orden.nombres} ${orden.apellidos}`)
      data.append('dni', `${orden.dni_ruc}`)
      data.append('email_cliente', `${orden.email}`)
      data.append('title', limpiarCadena(orden?.correlativo ?? ''))
      data.append('images2', archivo)
      data.append('images3', archivo)
      data.append('precio', `${comprobanteadicional?.precio}`)
      data.append('precio_letras', `${convertirNumeroALetras(comprobanteadicional?.precio).toLowerCase()}`)
      data.append('correlativo', orden.correlativo)
      data.append('contrato', obtenerDigitosAntesDeGuionBajo(orden.correlativo))
      const { fecha } = obtenerFechaHora()
      data.append('fecha_inicio', fecha)
      data.append(
        'contexto',
        `<strong>Estimado/a ${orden.nombres} ${orden.apellidos},</strong><p><br></p><p>Nos complace informarle que hemos recibido el pago completo de su <strong>saldo pendiente</strong>. Agradecemos su pronta atención y cumplimiento.</p><p><br></p><p>Adjunto a este correo encontrará el <strong>comprobante de pago</strong> correspondiente. Este documento confirma el pago de la totalidad de su servicio.</p>`
      )

      let preciofinal = 0
      let igvfinal = 0
      if (comprobanteadicional.factura == 'Con factura') {
        igvfinal = Number(comprobanteadicional?.precio) * 0.18
      } else {
        igvfinal = 0
      }
      preciofinal = Number(comprobanteadicional?.precio) + igvfinal
      preciofinal = Number(preciofinal.toFixed(2))
      data.append('pendiente', '0')
      if (Number(preciofinal) - Number(comprobanteadicional.montoCobrado) > 0) {
        data.append('pendiente_antes', (Number(preciofinal) - Number(comprobanteadicional.montoCobrado)).toFixed(2))
        // ts-ignore
        data.append(
          'pendiente_antes_letras',
          `${convertirNumeroALetras(Number(preciofinal) - Number(comprobanteadicional.montoCobrado)).toLocaleLowerCase()}`
        )
      } else {
        // @ts-expect-error
        data.append('pendiente_antes', 0)
      }
      data.append('idUnico', idUnico)
      const comprobantesArray = orden.comprobanteadicional ? JSON.parse(orden.comprobanteadicional) : []

      const comprobantesArrayActualizado = comprobantesArray.map((comprobante: any) => {
        if (comprobante.id == comprobanteadicional.id) {
          return {
            ...comprobante,
            pdf2: `${idUnico}_COMPROBANTE DE PAGO - ${orden.nombres} ${orden.apellidos}`,
            montoCobrado2: preciofinal,
            archivo_factura2: archivo && archivo?.name ? `${idUnico}_${archivo?.name}` : '',
            pendiente: 0
          }
        }
        return comprobante
      })

      data.append('comprobanteadicional', JSON.stringify(comprobantesArrayActualizado))
      data.append('banco', comprobanteadicional.banco)
      data.append('factura', comprobanteadicional.factura)
      data.append('montoCobrado', Number(preciofinal).toFixed(2))
      data.append('montoCobrado_letra', convertirNumeroALetras(Number(preciofinal)).toLocaleLowerCase())
      if (comprobanteadicional.factura == 'Sin factura') {
        data.append('estado', `${comprobanteadicional.banco ? `${comprobanteadicional.banco}` : ''}/sf/ok`.toLocaleUpperCase())
      } else if (comprobanteadicional.factura == 'Con factura') {
        data.append('estado', `${comprobanteadicional.banco ? `${comprobanteadicional.banco}` : ''}/cf/ok`.toLocaleUpperCase())
      }

      try {
        const respuesta = await axios.post(`${Global.url}/ActualizarComprobanteAdicional/${orden.id_ventas ?? ''}`, data, {
          headers: {
            Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
          }
        })
        if (respuesta.data) {
          toast.success('Comprobante enviado')
          getCotizaciones()
        } else {
          Swal.fire('Error al actualizar', '', 'error')
        }
      } catch (error: unknown) {
        Swal.fire('Error', '', 'error')
        console.log(error)
      }
      setLoading(false)
    }
  }

  const parseCustomDate = (dateString: any): any => {
    try {
      const parsedDate = parse(dateString, 'dd/MM/yyyy, hh:mm a', new Date())
      return parsedDate
    } catch (error) {
      console.error('Error parsing date:', error)
      return null // Devuelve null en caso de error para identificar el problema
    }
  }

  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-between gap-y-4 mb-3 lg:mb-5 gap-2">
        <div className="w-full lg:w-fit flex flex-col lg:flex-row gap-2 items-center h-fit">
          <button className="bg-white hover:bg-gray-100 w-full lg:w-fit flex items-center text-black gap-2 py-2 px-4 rounded-lg hover:text-main transition-colors">
            <RiFilter2Fill />
            <input placeholder="Buscar ..." className="bg-transparent outline-none" value={search} onChange={onSeachChange} type="search" />
          </button>
        </div>
      </div>
      {loading ? (
        <Loading />
      ) : (
        <div className="lg:bg-[#fff] lg:px-8 lg:py-6 rounded-xl">
          <div className={'hidden lg:grid pr-10 lg:pr-4 items-center grid_cols_15 gap-4 mb-2 lg:px-4 lg:py-2 text-gray-400 border-y border-gray-300'}>
            <h5 className="lg:text-left line-clamp-1 col-span-1 ">COD</h5>
            <h5 className="lg:text-left col-span-1">Precio</h5>
            <h5 className="lg:text-left col-span-1">SP</h5>
            <h5 className="lg:text-left col-span-1">C. BRIEF</h5>
            <h5 className="lg:text-left line-clamp-1 col-span-2 ">Cliente</h5>
            <h5 className="lg:text-left col-span-2">Empresa</h5>
            <h5 className="lg:text-center col-span-1">Tiempo </h5>
            <h5 className="lg:text-center col-span-1">PDF</h5>
            <h5 className="lg:text-center col-span-1">Alta</h5>
            <h5 className="lg:text-center col-span-2">Fecha de creacion</h5>
          </div>
          {filterDate().map((orden: ListaContratosValues, index: number) => (
            <>
              <div
                className={`grid grid-cols-1 grid_cols_15  lg:pr-4 relative gap-3 items-center mb-3 lg:mb-0 ${
                  index % 2 == 0 ? 'bg-transparent' : 'bg-gray-200'
                } lg:px-4 lg:py-3 rounded-xl relative shadow_class`}
                key={orden.id}
              >
                <div
                  // to={`view-servicio/${orden.id}`}
                  className="flex flex-col gap-3 lg:hidden bg-form p-4 rounded-xl"
                >
                  <div className="lg:hidden flex justify-between gap-3">
                    <div className="lg:text-center ">
                      <h5 className="lg:hidden text-black font-bold mb-0 text-sm">Correlativo</h5>
                      <span className="text-black">{limpiarCadena(orden.correlativo)}</span>
                    </div>
                    <div className="lg:text-right ">
                      <h5 className="lg:hidden text-black font-bold mb-0 text-sm bg text-right">Precio</h5>
                      <span className="text-right w-full text-black line-clamp-1">S./ {orden.precio}</span>
                    </div>
                  </div>
                  <div className="lg:hidden flex justify-between gap-3">
                    <div className="lg:text-left">
                      <h5 className="lg:hidden text-black font-bold mb-0 text-sm bg text-left">Codigo</h5>
                      <span className={cn('text-left block  w-fit px-2 rounded-md text-white', orden.uso == 0 ? 'bg-green-600' : 'bg-red-600')}>
                        {orden.codigo}
                      </span>
                    </div>
                    <div className="lg:text-right ">
                      <h5 className="lg:hidden text-black font-bold mb-0 text-sm bg text-right">Cliente</h5>
                      {/* <span className="text-right w-full text-black line-clamp-1">
                        {orden.nombres} {orden.apellidos}
                        </span> */}
                      {orden.id_contacto ? (
                        <>
                          {orden.arraycontacto &&
                            JSON.parse(orden.arraycontacto).length > 0 &&
                            JSON.parse(orden.arraycontacto)
                              .filter((contacto: arrayContacto) => String(contacto.id ?? '') == orden.id_contacto)
                              .map((contacto: arrayContacto) => (
                                <span key={contacto.id} className="text-left w-full text-black line-clamp-1">
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
                  <div className="lg:hidden flex justify-between gap-3">
                    <div className="lg:text-left">
                      <h5 className="lg:hidden text-black font-bold mb-0 text-sm bg text-left">Empresa</h5>
                      <span className="text-left w-full text-black line-clamp-1">{orden.empresa}</span>
                    </div>
                    <div className="lg:text-right ">
                      <h5 className="lg:hidden text-black font-bold mb-0 text-sm bg text-right">Tiempo</h5>
                      <span className="text-right w-full text-black line-clamp-1">{orden.tiempo} días</span>
                    </div>
                  </div>
                  <div className="lg:hidden flex justify-between gap-3">
                    <div className="lg:text-left">
                      <h5 className="lg:hidden text-black font-bold mb-0 text-sm bg text-left">PDF</h5>
                      <Link target="_blank" to={`${Global.urlImages}/contratos/${orden.pdf ?? ''}`} className="text-center block text-black">
                        <BsFileEarmarkPdfFill className="mx-auto text-3xl text-main hover:text-main_dark transition-colors cursor-pointer" />
                      </Link>
                    </div>
                    <div className="lg:text-right ">
                      <h5 className="lg:hidden text-black font-bold mb-0 text-sm bg text-right">Fecha</h5>
                      <span className="text-right w-full text-black line-clamp-1">{formatearFecha(orden.created_at)}</span>
                    </div>
                  </div>
                  <div className="lg:hidden flex justify-between gap-3">
                    <div className="block lg:text-left w-full">
                      <h5 className="lg:hidden text-black font-bold mb-0 text-sm bg text-center">Alta</h5>
                      <span
                        className={cn(
                          'text-center w-full text-white line-clamp-1 rounded-lg', // @ts-expect-error
                          orden.tieneVenta ? 'bg-green-600' : 'bg-red-600'
                        )}
                      >
                        {
                          // @ts-expect-error
                          orden.tieneVenta ? 'SI' : 'NO'
                        }
                      </span>
                    </div>
                    <div className="block lg:text-left w-full">
                      <h5 className="lg:hidden text-black font-bold mb-0 text-sm bg text-right">SP</h5>
                      <span className="text-right w-full text-black line-clamp-1 rounded-lg">
                        {
                          // @ts-expect-error
                          orden.tipo.toLowerCase() == 'sin costo' ? (
                            <span className="text-orange-500 font-bold">Sin costo</span>
                          ) : (
                            // @ts-expect-error
                            orden.comprobante &&
                            // @ts-expect-error
                            orden.comprobante != null && (
                              <>
                                {(() => {
                                  try {
                                    const comprobante = JSON.parse(
                                      // @ts-expect-error
                                      orden.comprobante
                                    )
                                    if (comprobante.pendiente <= 0) {
                                      return <span className="text-green-700 font-bold">OK</span>
                                    } else {
                                      return (
                                        <button
                                          type="button"
                                          onClick={async () => {
                                            await generarComprobante(orden)
                                          }}
                                          className="text-red-700 font-bold hover:bg-red-200 transition-colors px-1  rounded-md"
                                        >
                                          S/{comprobante.pendiente}
                                        </button>
                                      )
                                    }
                                  } catch (error) {
                                    console.error('Invalid JSON in orden.comprobante:', error)
                                    return <span className="text-red-700 font-bold">Invalid Data</span>
                                  }
                                })()}
                              </>
                            )
                          )
                        }
                      </span>
                    </div>
                  </div>
                </div>
                {
                  // @ts-expect-error
                  orden.comprobanteadicional &&
                    // @ts-expect-error
                    JSON.parse(orden.comprobanteadicional).length > 0 && (
                      <>
                        {
                          // @ts-expect-error
                          JSON.parse(orden.comprobanteadicional).map((adicional: any) => (
                            <div
                              key={adicional.id}
                              // to={`view-servicio/${orden.id}`}
                              className="flex flex-col gap-3 lg:hidden bg-form p-4 rounded-xl"
                            >
                              <div className="lg:hidden flex justify-between gap-3">
                                <div className="lg:text-center ">
                                  <h5 className="lg:hidden text-black font-bold mb-0 text-sm">Correlativo</h5>
                                  <span className="text-black">Adicional - {limpiarCadena(orden.correlativo)}</span>
                                </div>
                                <div className="lg:text-right ">
                                  <h5 className="lg:hidden text-black font-bold mb-0 text-sm bg text-right">Precio</h5>
                                  <span className="text-right w-full text-black line-clamp-1">S/ {adicional.precio}</span>
                                </div>
                              </div>
                              <div className="lg:hidden flex justify-between gap-3">
                                <div className="lg:text-left">
                                  <h5 className="lg:hidden text-black font-bold mb-0 text-sm bg text-left">Codigo</h5>
                                  <span
                                    className={cn(
                                      'text-left block  w-fit px-2 rounded-md text-white',
                                      orden.uso == 0 ? 'bg-green-600' : 'bg-red-600'
                                    )}
                                  >
                                    {orden.codigo}
                                  </span>
                                </div>
                                <div className="lg:text-right ">
                                  <h5 className="lg:hidden text-black font-bold mb-0 text-sm bg text-right">Cliente</h5>
                                  {/* <span className="text-right w-full text-black line-clamp-1">
                        {orden.nombres} {orden.apellidos}
                        </span> */}
                                  {orden.id_contacto ? (
                                    <>
                                      {orden.arraycontacto &&
                                        JSON.parse(orden.arraycontacto).length > 0 &&
                                        JSON.parse(orden.arraycontacto)
                                          .filter((contacto: arrayContacto) => String(contacto.id ?? '') == orden.id_contacto)
                                          .map((contacto: arrayContacto) => (
                                            <span key={contacto.id} className="text-left w-full text-black line-clamp-1">
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
                              <div className="lg:hidden flex justify-between gap-3">
                                <div className="lg:text-left">
                                  <h5 className="lg:hidden text-black font-bold mb-0 text-sm bg text-left">Empresa</h5>
                                  <span className="text-left w-full text-black line-clamp-1">{orden.empresa}</span>
                                </div>
                              </div>
                              <div className="lg:hidden flex justify-between gap-3">
                                <div className="lg:text-left">
                                  <h5 className="lg:hidden text-black font-bold mb-0 text-sm bg text-left">Comprobante</h5>
                                  <Link
                                    target="_blank"
                                    to={`${Global.urlImages}/comprobantes/${adicional.pdf ?? ''}`}
                                    className="text-center block text-black"
                                  >
                                    <IoReceipt className="text-3xl text-gray-500 hover:text-gray-800 transition-colors cursor-pointer" />
                                  </Link>
                                </div>
                                <div className="lg:text-right ">
                                  <h5 className="lg:hidden text-black font-bold mb-0 text-sm bg text-right">Fecha</h5>
                                  <span className="text-right w-full text-black line-clamp-1">{adicional.fecha}</span>
                                </div>
                              </div>
                              <div className="lg:hidden flex justify-between gap-3">
                                <div className="block lg:text-left w-full">
                                  <h5 className="lg:hidden text-black font-bold mb-0 text-sm bg text-center">Alta</h5>
                                  <span
                                    className={cn(
                                      'text-center w-full text-white line-clamp-1 rounded-lg', // @ts-expect-error
                                      orden.tieneVenta ? 'bg-green-600' : 'bg-red-600'
                                    )}
                                  >
                                    {
                                      // @ts-expect-error
                                      orden.tieneVenta ? 'SI' : 'NO'
                                    }
                                  </span>
                                </div>
                                <div className="block lg:text-left w-full">
                                  <h5 className="lg:hidden text-black font-bold mb-0 text-sm bg text-right">SP</h5>
                                  <span className="text-right w-full text-black line-clamp-1 rounded-lg">
                                    {(() => {
                                      try {
                                        if (adicional.pendiente <= 0) {
                                          return <span className="text-green-700 font-bold">OK</span>
                                        } else {
                                          return (
                                            <button
                                              type="button"
                                              onClick={async () => {
                                                await actualizarPrecioAdicional(orden, adicional)
                                              }}
                                              className="text-red-700 font-bold hover:bg-red-200 transition-colors px-1  rounded-md"
                                            >
                                              S/
                                              {adicional.pendiente}
                                            </button>
                                          )
                                        }
                                      } catch (error) {
                                        console.error('Invalid JSON in orden.comprobante:', error)
                                        return <span className="text-red-700 font-bold">Invalid Data</span>
                                      }
                                    })()}
                                  </span>
                                </div>
                              </div>
                            </div>
                          ))
                        }
                      </>
                  )
                }

                {/* PC */}
                <div className="hidden lg:block lg:text-center col-span-1">
                  <span className="text-left block text-black w-full line-clamp-1">{limpiarCadena(orden.correlativo)}</span>
                </div>
                <div className="hidden lg:flex items-center lg:text-center relative h-full group">
                  <span className="text-left text-black line-clamp-1 transition-all group-hover:w-[150%] group-hover:bg-white group-hover:absolute group-hover:inset-0 w-full h-full z-10">
                    S/{orden.precio}
                  </span>
                </div>
                <div className="hidden lg:flex items-center lg:text-center relative h-full group">
                  <span className="text-left text-black line-clamp-1 transition-all group-hover:w-[150%] group-hover:bg-white group-hover:absolute group-hover:inset-0 w-full h-full z-10">
                    {
                      // @ts-expect-error
                      orden.tipo.toLowerCase() == 'sin costo' ? (
                        <span className="text-orange-500 font-bold">Sin costo</span>
                      ) : (
                        // @ts-expect-error
                        orden.comprobante &&
                        // @ts-expect-error
                        orden.comprobante != null && (
                          <>
                            {(() => {
                              try {
                                const comprobante = JSON.parse(
                                  // @ts-expect-error
                                  orden.comprobante
                                )
                                if (comprobante.pendiente <= 0) {
                                  return <span className="text-green-700 font-bold">OK</span>
                                } else {
                                  return (
                                    <button
                                      type="button"
                                      onClick={async () => {
                                        await generarComprobante(orden)
                                      }}
                                      className="text-red-700 font-bold hover:bg-red-200 transition-colors px-1  rounded-md"
                                    >
                                      S/{comprobante.pendiente}
                                    </button>
                                  )
                                }
                              } catch (error) {
                                console.error('Invalid JSON in orden.comprobante:', error)
                                return <span className="text-red-700 font-bold">Invalid Data</span>
                              }
                            })()}
                          </>
                        )
                      )
                    }
                  </span>
                </div>
                <div className="hidden lg:block lg:text-left col-span-1">
                  <span className={cn('text-left block  w-fit px-2 rounded-md text-white', orden.uso == 0 ? 'bg-green-600' : 'bg-red-600')}>
                    {orden.codigo}
                  </span>
                </div>
                <div className="hidden lg:block lg:text-center col-span-2 relative h-full">
                  {orden.id_contacto ? (
                    <>
                      {orden.arraycontacto &&
                        JSON.parse(orden.arraycontacto).length > 0 &&
                        JSON.parse(orden.arraycontacto)
                          .filter((contacto: arrayContacto) => String(contacto.id ?? '') == orden.id_contacto)
                          .map((contacto: arrayContacto) => (
                            <span
                              key={contacto.id}
                              className="text-left text-black line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-fit z-10"
                            >
                              {contacto.nombres}
                            </span>
                          ))}
                    </>
                  ) : (
                    <span className="text-left text-black line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-fit z-10">
                      {orden.nombres} {orden.apellidos}
                    </span>
                  )}
                </div>
                <div className="hidden lg:block lg:text-center col-span-2 relative h-full">
                  {orden.id_contacto ? (
                    <>
                      {orden.arraycontacto &&
                        JSON.parse(orden.arraycontacto).length > 0 &&
                        JSON.parse(orden.arraycontacto)
                          .filter((contacto: arrayContacto) => String(contacto.id ?? '') == orden.id_contacto)
                          .map((contacto: arrayContacto) => (
                            <span
                              key={contacto.id}
                              className="text-left text-black line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-fit z-10"
                            >
                              {contacto.marca}
                            </span>
                          ))}
                    </>
                  ) : (
                    <span className="text-left text-black line-clamp-1 transition-all  hover:bg-white hover:absolute hover:w-[150%] hover:inset-0 w-full h-fit z-10">
                      {orden.empresa}
                    </span>
                  )}
                </div>
                <div className="hidden lg:block lg:text-center col-span-1">
                  <span className="text-center  text-black line-clamp-1">{orden.tiempo} días</span>
                </div>
                <div className="hidden lg:block lg:text-center col-span-1">
                  <Link target="_blank" to={`${Global.urlImages}/contratos/${orden.pdf ?? ''}`} className="text-center block text-black">
                    <BsFileEarmarkPdfFill className="mx-auto text-3xl text-main hover:text-main_dark transition-colors cursor-pointer" />
                  </Link>
                </div>
                <div className="hidden lg:block lg:text-center ">
                  <span
                    className={cn(
                      'text-center block text-white rounded-lg',
                      // @ts-expect-error
                      orden.tieneVenta ? 'bg-green-600' : 'bg-red-600'
                    )}
                  >
                    {
                      // @ts-expect-error
                      orden.tieneVenta ? 'SI' : 'NO'
                    }
                  </span>
                </div>
                <div className="hidden lg:flex items-center col-span-2 lg:text-center relative h-full group w-[80%]">
                  <span className="text-center text-black line-clamp-1 hover:text-left transition-all group-hover:w-[150%] group-hover:bg-white group-hover:absolute group-hover:inset-0 w-full h-full z-10">
                    {formatearFecha(orden.created_at)}
                  </span>
                </div>
                <div className="lg:text-center lg:flex lg:justify-center items-center absolute right-0 top-0 bottom-0 my-auto">
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
                        <button
                          type="button"
                          onClick={() => {
                            setOpen(true)
                            setProducto(orden)
                          }}
                          className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                        >
                          Generar alta
                        </button>
                      )}
                    </MenuItem>

                    {/* <MenuItem className="p-0 hover:bg-transparent">
                        {orden.id != null && (
                        <button
                            type="button"
                            onClick={() => {
                            generarComprobante2(orden)
                            }}
                            className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                        >
                            Generar Comprobante
                        </button>
                        )}
                    </MenuItem> */}

                    <MenuItem className="p-0 hover:bg-transparent">
                      {
                        // @ts-expect-error
                        orden.comprobante &&
                          // @ts-expect-error
                          orden.comprobante != null &&
                          (() => {
                            try {
                              // @ts-expect-error
                              const comprobante = JSON.parse(orden.comprobante)
                              return (
                                <a
                                  target="_blank"
                                  href={`https://api.logosperu.com.pe/public/comprobantes/${comprobante.pdf}`}
                                  type="button"
                                  className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                                  rel="noreferrer"
                                >
                                  Ver comprobante
                                </a>
                              )
                            } catch (error) {
                              console.error('Invalid JSON in orden.comprobante:', error)
                              return <span className="text-red-700 font-bold">Invalid Data</span>
                            }
                          })()
                      }
                    </MenuItem>

                    {
                      // @ts-expect-error
                      orden.comprobante &&
                        // @ts-expect-error
                        orden.comprobante != null &&
                        (() => {
                          try {
                            // @ts-expect-error
                            const comprobante = JSON.parse(orden.comprobante)
                            if (comprobante.pdf2) {
                              return (
                                <MenuItem className="p-0 hover:bg-transparent">
                                  <a
                                    target="_blank"
                                    href={`https://api.logosperu.com.pe/public/comprobantes2/COMPROBANTE DE PAGO - ${comprobante.pdf2}.pdf`}
                                    type="button"
                                    className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                                    rel="noreferrer"
                                  >
                                    Ver comprobante 2
                                  </a>
                                </MenuItem>
                              )
                            }
                          } catch (error) {
                            console.error('Invalid JSON in orden.comprobante:', error)
                            return <span className="text-red-700 font-bold">Invalid Data</span>
                          }
                        })()
                    }
                    {
                      // @ts-expect-error
                      !orden.tieneVenta && (
                        <MenuItem className="p-0 hover:bg-transparent">
                          <button
                            type="button"
                            onClick={() => {
                              preguntar(Number(orden.id))
                            }}
                            className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                          >
                            Eliminar contrato
                          </button>
                        </MenuItem>
                      )
                    }
                  </Menu>
                </div>
              </div>

              <div className="w-full">
                {
                  // @ts-expect-error
                  (orden.comprobanteadicional ||
                    // @ts-expect-error
                    orden.comprobanteadicionalgratis) &&
                    // @ts-expect-error
                    (JSON.parse(orden.comprobanteadicional).length > 0 ||
                      // @ts-expect-error
                      JSON.parse(orden.comprobanteadicionalgratis).length > 0) && (
                      <>
                        {[
                          // @ts-expect-error
                          ...(JSON.parse(orden.comprobanteadicional) ?? []),
                          // @ts-expect-error
                          ...(JSON.parse(orden.comprobanteadicionalgratis) ?? [])
                        ]
                          .sort((a, b) => {
                            const dateA = parseCustomDate(a.fecha)
                            const dateB = parseCustomDate(b.fecha)
                            return dateB - dateA // Ordenar de más reciente a más antiguo
                          })
                          .map((adicional: any) => (
                            <div className="w-full" key={adicional.id}>
                              <div
                                className={`grid grid-cols-1 grid_cols_15  lg:pr-4 relative gap-3 items-center mb-3 lg:mb-0 ${
                                  index % 2 == 0 ? 'bg-transparent' : 'bg-gray-200'
                                } lg:px-4 lg:py-3 rounded-xl relative shadow_class`}
                                key={orden.id}
                              >
                                <div className="hidden lg:block lg:text-center col-span-1 relative h-full">
                                  <span className="text-left text-black block line-clamp-1 transition-all  w-full h-full z-10 relative">
                                    <p className="absolute h-1/2 w-[3px] bg-gray-300 ml-4 "></p>
                                    <p className="bg-gray-300 absolute w-full h-[3px] bottom-0 top-0 my-auto left-4"></p>
                                  </span>
                                </div>
                                <div className="hidden lg:block lg:text-center col-span-1 relative h-full">
                                  <span className="text-left text-black line-clamp-1 transition-all  w-full h-full z-10">
                                    S/ {Number(adicional.precio).toFixed(2)}
                                  </span>
                                </div>
                                <div className="hidden lg:block lg:text-center col-span-1 relative h-full">
                                  <span className="text-left text-black line-clamp-1 transition-all group-hover:w-[150%] group-hover:bg-white group-hover:absolute group-hover:inset-0 w-full h-full z-10">
                                    {adicional?.tipo == 'sin costo' ? (
                                      <span className="text-orange-500 font-bold">Sin costo</span>
                                    ) : (
                                      <>
                                        {(() => {
                                          try {
                                            if (adicional.pendiente <= 0) {
                                              return <span className="text-green-700 font-bold">OK</span>
                                            } else {
                                              return (
                                                <button
                                                  type="button"
                                                  onClick={async () => {
                                                    await actualizarPrecioAdicional(orden, adicional)
                                                  }}
                                                  className="text-red-700 font-bold hover:bg-red-200 transition-colors px-1  rounded-md"
                                                >
                                                  S/
                                                  {adicional.pendiente}
                                                </button>
                                              )
                                            }
                                          } catch (error) {
                                            console.error('Invalid JSON in orden.comprobante:', error)
                                            return <span className="text-red-700 font-bold">Invalid Data</span>
                                          }
                                        })()}
                                      </>
                                    )}
                                  </span>
                                </div>
                                <div className="hidden lg:block lg:text-center col-span-1 relative h-full">
                                  <span
                                    className={cn(
                                      'text-left block  w-fit px-2 rounded-md text-white',
                                      orden.uso == 0 ? 'bg-green-600' : 'bg-red-600'
                                    )}
                                  >
                                    {orden.codigo}
                                  </span>
                                </div>
                                <div className="hidden lg:block lg:text-center col-span-2 relative h-full">
                                  {orden.id_contacto ? (
                                    <>
                                      {orden.arraycontacto &&
                                        JSON.parse(orden.arraycontacto).length > 0 &&
                                        JSON.parse(orden.arraycontacto)
                                          .filter((contacto: arrayContacto) => String(contacto.id ?? '') == orden.id_contacto)
                                          .map((contacto: arrayContacto) => (
                                            <span
                                              key={contacto.id}
                                              className="text-left text-black line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-fit z-10"
                                            >
                                              {contacto.nombres}
                                            </span>
                                          ))}
                                    </>
                                  ) : (
                                    <span className="text-left text-black line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-fit z-10">
                                      {orden.nombres} {orden.apellidos}
                                    </span>
                                  )}
                                </div>
                                <div className="hidden lg:block lg:text-center col-span-2 relative h-full">
                                  {orden.id_contacto ? (
                                    <>
                                      {orden.arraycontacto &&
                                        JSON.parse(orden.arraycontacto).length > 0 &&
                                        JSON.parse(orden.arraycontacto)
                                          .filter((contacto: arrayContacto) => String(contacto.id ?? '') == orden.id_contacto)
                                          .map((contacto: arrayContacto) => (
                                            <span
                                              key={contacto.id}
                                              className="text-left text-black line-clamp-1 transition-all hover:w-[150%] hover:bg-white hover:absolute hover:inset-0 w-full h-fit z-10"
                                            >
                                              {contacto.marca}
                                            </span>
                                          ))}
                                    </>
                                  ) : (
                                    <span className="text-left text-black line-clamp-1 transition-all  hover:bg-white hover:absolute hover:w-[150%] hover:inset-0 w-full h-fit z-10">
                                      {orden.empresa}
                                    </span>
                                  )}
                                </div>
                                <div className="hidden lg:block lg:text-center col-span-1">
                                  <span className="text-center  text-black line-clamp-1">---</span>
                                </div>
                                <div className="hidden lg:block lg:text-center col-span-1">
                                  {adicional.pdf ? (
                                    <Link
                                      target="_blank"
                                      to={`${Global.urlImages}/comprobantes/${adicional.pdf ?? ''}`}
                                      className="text-center block text-black"
                                    >
                                      <IoReceipt className="mx-auto text-3xl text-gray-500 hover:text-gray-800 transition-colors cursor-pointer" />
                                    </Link>
                                  ) : (
                                    <span className="text-black">---</span>
                                  )}
                                </div>
                                <div className="hidden lg:block lg:text-center ">
                                  <span
                                    className={cn(
                                      'text-center block text-white rounded-lg',
                                      // @ts-expect-error
                                      orden.tieneVenta ? 'bg-green-600' : 'bg-red-600'
                                    )}
                                  >
                                    {
                                      // @ts-expect-error
                                      orden.tieneVenta ? 'SI' : 'NO'
                                    }
                                  </span>
                                </div>
                                <div className="hidden lg:flex items-center col-span-2 lg:text-center relative h-full group w-[80%] ">
                                  <span className="text-center  text-black line-clamp-1 w-full">{adicional.fecha}</span>
                                </div>
                                <div className="lg:text-center lg:flex lg:justify-center items-center absolute right-0 top-0 bottom-0 my-auto">
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
                                    {adicional.pdf && (
                                      <MenuItem className="p-0 hover:bg-transparent">
                                        <a
                                          target="_blank"
                                          href={`https://api.logosperu.com.pe/public/comprobantes/${adicional.pdf}`}
                                          type="button"
                                          className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                                          rel="noreferrer"
                                        >
                                          comprobante
                                        </a>
                                      </MenuItem>
                                    )}
                                    {adicional.archivo_factura && (
                                      <MenuItem className="p-0 hover:bg-transparent">
                                        <a
                                          target="_blank"
                                          href={`https://api.logosperu.com.pe/public/avances/${adicional.archivo_factura}`}
                                          type="button"
                                          className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                                          rel="noreferrer"
                                        >
                                          Factura
                                        </a>
                                      </MenuItem>
                                    )}

                                    {adicional.pdf2 && (
                                      <MenuItem className="p-0 hover:bg-transparent">
                                        <a
                                          target="_blank"
                                          href={`https://api.logosperu.com.pe/public/comprobantes2/${adicional.pdf2}.pdf`}
                                          type="button"
                                          className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                                          rel="noreferrer"
                                        >
                                          Comprobante Final
                                        </a>
                                      </MenuItem>
                                    )}
                                    {adicional.archivo_factura2 && (
                                      <MenuItem className="p-0 hover:bg-transparent">
                                        <a
                                          target="_blank"
                                          href={`https://api.logosperu.com.pe/public/avances/${adicional.archivo_factura2}`}
                                          type="button"
                                          className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex items-center justify-center gap-x-4 p-2 flex-1"
                                          rel="noreferrer"
                                        >
                                          Factura Final
                                        </a>
                                      </MenuItem>
                                    )}
                                  </Menu>
                                </div>
                              </div>
                            </div>
                          ))}
                      </>
                  )
                }
              </div>
            </>
          ))}
          <GenerarAlta datos={producto} open={open} setOpen={setOpen} usuarios={usuarios} />
          <div className="flex flex-col lg:flex-row gap-6 lg:gap-0 justify-center lg:justify-between content_buttons pt-3 mt-5">
            <p className="text-md ml-1 text-black text-center">{totalRegistros} Registros</p>
            <Paginacion totalPosts={totalPosts} cantidadRegistros={cantidadRegistros} paginaActual={paginaActual} setpaginaActual={setpaginaActual} />
          </div>
        </div>
      )}
    </>
  )
}
