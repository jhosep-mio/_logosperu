/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { CiPen, CiViewTimeline, CiSquareCheck } from 'react-icons/ci'
import Swal, { type SweetAlertResult } from 'sweetalert2'
import { ArchivosFinales } from '../ArchivosFinales'
import { SwiperAvances } from '../SwiperAvances'
import { Errors } from '../../../../shared/Errors'
import { motion } from 'framer-motion'
import { PiCalendarLight, PiCalendarCheckLight } from 'react-icons/pi'
import { BsFiletypePdf } from 'react-icons/bs'
import { Fragment, useState, useEffect } from 'react'
import { IoExtensionPuzzleOutline } from 'react-icons/io5'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import { toast } from 'sonner'
import { format } from 'date-fns'
import useAuth from '../../../../../hooks/useAuth'
interface Proceso {
  titulo: string
  fecha: string
  icono: string
}

interface Datadiseno {
  propuestas: boolean
  fecha_propuestas: string
  envio_informacion: boolean
  fecha_informacion: string
}

export const PlanLogotipo = ({
  handleSubmit,
  piezasGraficas,
  updateStructuraDiseno,
  updatePiezas,
  dataUpdatedDiseno,
  id,
  plan,
  pdfName,
  fechaCreacion,
  limite,
  values,
  getOneBrief,
  datos,
  datos2,
  setOpenCorreoFinal,
  setOpenMailFinal,
  setOpenQuestion,
  setOpenMail,
  arrayAlta,
  arrayAvances,
  setAvance,
  setOpenAvance,
  setOpenFinal,
  arrayFinal,
  setfinal,
  setOpenActa,
  arrayActa,
  setopenAlta,
  handleBlur,
  handleChange,
  errors,
  touched,
  validateBrief,
  colaborador,
  colaboradores,
  setLoading,
  brief
}: any): JSX.Element => {
  // Caso para Plan Piezas Gráficas
  let cantPiezas = 1 // Valor predeterminado
  // const cantPiezas = datos.observaciones ? JSON.parse(datos.observaciones)[0].cantidad : 0
  function esJSON (cadena: string): boolean {
    try {
      JSON.parse(cadena)
      return true
    } catch (error) {
      return false
    }
  }
  if (esJSON(datos?.observaciones)) {
    const observacionesArray = JSON.parse(datos?.observaciones)
    if (Array.isArray(observacionesArray) && observacionesArray.length > 0) {
      cantPiezas = observacionesArray[0].cantidad || 1
    }
  }
  //   const cantPiezas = datos?.observaciones && (JSON.parse(datos.observaciones)).length > 0 ? JSON.parse(datos.observaciones)[0].cantidad : 1
  const piezasInitial = piezasGraficas && piezasGraficas.length > 0
    ? JSON.parse(piezasGraficas)
    : () => {
        const initialPiezas: any = {}
        for (let i = 1; i <= cantPiezas; i++) {
          initialPiezas[i] = { completado: false }
        }
        return initialPiezas
      }

  const [piezas, setPiezas] = useState(piezasInitial)

  const [percentage, setPercentage] = useState(0)

  const pathLength = percentage / 100
  const token = localStorage.getItem('token')

  function formatearFecha (fecha: string): string {
    // Dividir la cadena de fecha en día, mes y año
    if (!fecha) {
      return '--'
    }
    const partes = fecha.split('/')
    const dia = parseInt(partes[0])
    const mes = parseInt(partes[1]) - 1 // Restar 1 al mes para evitar desfase
    const anio = parseInt(partes[2])
    // Crear un objeto de fecha utilizando el método estático Date.UTC()
    const fechaObj = new Date(Date.UTC(anio, mes, dia))

    // Verificar si la fecha es válida
    if (isNaN(fechaObj.getTime())) {
      return 'Fecha inválida'
    }

    // Array con los nombres de los meses
    const meses: string[] = [
      'Ene',
      'Feb',
      'Mar',
      'Abr',
      'May',
      'Jun',
      'Jul',
      'Ago',
      'Sep',
      'Oct',
      'Nov',
      'Dic'
    ]

    // Obtener el día y el mes
    const diaFormateado: number = fechaObj.getUTCDate() // Obtener día UTC
    const mesFormateado: string = meses[fechaObj.getUTCMonth()] // Obtener mes UTC

    // Crear la cadena HTML con los datos
    const resultado: string = `<span>${diaFormateado}</span><br/>
                                <span>${mesFormateado}</span>`

    return resultado
  }

  const procesosAntiguos: Proceso[] = [
    {
      titulo: 'Brief completado',
      fecha: datos.fecha_fin,
      icono: 'br'
    },
    {
      titulo: `${datos.id_contrato.includes('LPBRO') ? 'Avance del brochure' : 'Sustentación de propuestas'}`,
      fecha: datos.fecha_fin,
      icono: 'pdf'
    },
    {
      titulo: 'Proyecto finalizado',
      fecha: datos.fecha_fin,
      icono: 'fin'
    }
  ]

  const procesosManualMarca: Proceso[] = [
    {
      titulo: 'Solicitud de información',
      fecha: datos.fecha_fin,
      icono: 'br'
    },
    {
      titulo: 'Avance de propuesta',
      fecha: datos.fecha_fin,
      icono: 'pdf'
    },
    {
      titulo: 'Proyecto finalizado',
      fecha: datos.fecha_fin,
      icono: 'fin'
    }
  ]

  const procesosAntiguosPG: Proceso[] = [
    {
      titulo: 'Piezas completadas',
      fecha: datos.fecha_fin,
      icono: 'pdf'
    },
    {
      titulo: 'Proyecto finalizado',
      fecha: datos.fecha_fin,
      icono: 'fin'
    }
  ]

  const procesosPiezas: Proceso[] = [
    {
      titulo: 'Completar piezas',
      fecha: datos.fecha_fin,
      icono: 'pdf'
    },
    {
      titulo: 'Proyecto finalizado',
      fecha: datos.fecha_fin,
      icono: 'fin'
    }
  ]

  const procesosFlyersAntiguos: Proceso[] = [
    {
      titulo: 'Brief Completado',
      fecha: datos.fecha_fin,
      icono: 'br'
    },

    {
      titulo: 'Proyecto finalizado',
      fecha: datos.fecha_fin,
      icono: 'fin'
    }
  ]

  const procesosFlyers: Proceso[] = [
    {
      titulo: 'Brief',
      fecha: datos.fecha_fin,
      icono: 'br'
    },

    {
      titulo: 'Proyecto finalizado',
      fecha: datos.fecha_fin,
      icono: 'fin'
    }
  ]

  function compararFechas (fecha1: string): boolean {
    if (fecha1 === '' || fecha1 === undefined || fecha1 === null) {
      return false
    }
    const date1 = new Date(fecha1.split('/').reverse().join('/'))
    const date2 = new Date('2024-04-23') // Formato 'YYYY-MM-DD'

    return date1 >= date2
  }

  const [sendPropuestas] = useState(false)
  const [informacionRecopilada, setInformacionRecopilada] = useState(false)
  const [dataDiseno, setDataDiseno] = useState<Datadiseno>({
    fecha_propuestas: '',
    propuestas: false,
    envio_informacion: false,
    fecha_informacion: ''
  })

  useEffect(() => {
    setDataDiseno(prevDataDiseno => ({
      ...prevDataDiseno,
      fecha_propuestas: sendPropuestas ? new Date().toString() : '',
      fecha_informacion: informacionRecopilada ? new Date().toString() : '',
      propuestas: !sendPropuestas ? dataUpdatedDiseno.propuestas : sendPropuestas,
      envio_informacion: !informacionRecopilada ? dataUpdatedDiseno.envio_informacion : informacionRecopilada
    }))
  }, [sendPropuestas, informacionRecopilada])

  useEffect(() => {
    if (sendPropuestas || informacionRecopilada) {
      updateStructuraDiseno(dataDiseno)
    }
  }, [dataDiseno])

  let sumaPorcentaje = 0 // Variable para almacenar la suma del porcentaje
  const [piezasCompletadasText, setPiezasCompletadasText] = useState('')
  const [
    piezasCompletadas
    , setPiezasCompletadas] = useState(0)

  useEffect(() => {
    if (datos) {
      if (datos.id_contrato.includes('LPFL')) {
        if (datos.fecha_fin && datos.brief !== 1) sumaPorcentaje += 100
        if (datos.brief === 1) sumaPorcentaje = datos.fecha_fin ? 100 : 50
      } else if (datos.id_contrato.includes('LPPG')) {
        if (datos.fecha_fin && datos.fecha_fin === 0) sumaPorcentaje += 50
        if (datos.fecha_fin && datos.fecha_fin !== 0) sumaPorcentaje = 100
      } else if (datos.id_contrato.includes('LPBRO')) {
        if (datos.fecha_fin) {
          sumaPorcentaje += 100
        } else {
          if (datos.brief === 1) sumaPorcentaje += 33
          if (dataUpdatedDiseno.envio_informacion) sumaPorcentaje += 50
          sumaPorcentaje += datos.brief === 1 ? 33 : 0
        }
      } else {
        sumaPorcentaje += datos.brief === 1 ? 33 : 0
        sumaPorcentaje += datos.fecha_fin ? 34 : 0
      }
      if (pdfName) {
        sumaPorcentaje += 33 // Sumar 33 si pdfName está definido
      }
      if (dataUpdatedDiseno.envio_informacion) {
        sumaPorcentaje += 33
      }
      if (dataUpdatedDiseno.propuestas) {
        sumaPorcentaje += 33
      }
      if (datos?.solicitud_manual) {
        sumaPorcentaje += 33
      }

      const totalPiezas = Object.keys(piezas).length // Obtener la cantidad total de piezas
      const totalCompletados: any = Object.values(piezas).reduce((total: any, pieza: any) => {
        if (pieza.completado) {
          return Number(total) + 1
        }
        return total
      }, 0)
      setPiezasCompletadas(totalCompletados)
      const porcentajePorPieza = Math.round(50 / totalPiezas) // Porcentaje que representa cada pieza
      if (totalCompletados === totalPiezas) {
        setPiezasCompletadasText('Completados')
      }
      const porcentajeCompletado = totalCompletados * porcentajePorPieza
      setPercentage(Math.round(sumaPorcentaje + porcentajeCompletado))
    }
  }, [datos, pdfName, dataUpdatedDiseno, piezas])

  const handleClick = (indice: any): void => {
    if (datos.estado_proyecto !== 0) {
      toast.error('No se puede realizar esta acción')
      return
    }
    // Cambiar el estado de la pieza con el índice dado
    setPiezas((prevState: any) => {
      const updatedPiezasArray = {
        ...prevState,
        [indice]: {
          ...prevState[indice],
          completado: !prevState[indice].completado // Cambiar el estado completado
        }
      }
      updatePiezas(updatedPiezasArray)
      const totalPiezas = Object.keys(updatedPiezasArray).length // Obtener la cantidad total de piezas
      const totalCompletados: any = Object.values(updatedPiezasArray).reduce((total: any, pieza: any) => {
        if (pieza.completado) {
          return Number(total) + 1
        }
        return total
      }, 0)
      setPiezasCompletadas(totalCompletados)
      const porcentajePorPieza = Math.round(50 / totalPiezas) // Porcentaje que representa cada pieza
      if (totalCompletados === totalPiezas) {
        setPiezasCompletadasText('Completados')
      }
      const porcentajeCompletado = totalCompletados * porcentajePorPieza
      setPercentage(Math.round(sumaPorcentaje + porcentajeCompletado))
      return updatedPiezasArray
    })
  }

  useEffect(() => {
    console.log('PIEZAS COMPLETADAS: ', piezasCompletadas)
  }, [piezasCompletadas])

  const formaterFechaInicio = (fechaFinString: string): Date => {
    const partesFecha = fechaFinString.split('/') // Separar día, mes y año
    const dia = partesFecha[0]
    const mes = partesFecha[1]
    const año = partesFecha[2]

    // Crear objeto Date con el formato 'mm/dd/yyyy'
    const fechaFin = new Date(`${mes}/${dia}/${año}`)
    return fechaFin
  }
  const { auth } = useAuth()

  const enviarSolcitudMarca = async (): Promise<void> => {
    if (datos?.nombre_marca) {
      setLoading(true)
      const data = new FormData()
      const fecha = new Date() // Obtener la fecha actual
      const fechaFormateada = format(fecha, 'dd/MM/yyyy')
      data.append('solicitud_manual', fechaFormateada)
      data.append('nombres', datos?.nombres)
      data.append('marca', datos?.nombre_marca)
      data.append('firma', auth.firma)
      data.append('email', datos?.email)
      data.append('email2', auth.email)
      data.append('_method', 'PUT')
      try {
        const respuesta = await axios.post(
                    `${Global.url}/solicitudManualMarca/${id ?? ''}`,
                    data,
                    {
                      headers: {
                        Authorization: `Bearer ${
                          token !== null && token !== '' ? token : ''
                        }`
                      }
                    }
        )
        if (respuesta.data.status == 'success') {
          toast.success('SOLICITUD ENVIADA')
          getOneBrief()
        }
      } catch (error: unknown) {
        toast.error('ERROR')
        console.log(error)
      }
      setLoading(false)
    } else {
      toast.warning('No existe una marca registrada')
    }
  }

  const habilitarCodigo = async (): Promise<void> => {
    const confirmacion = await Swal.fire({
      title: '¿Estás seguro?',
      text: '¿Deseas habilitar el código?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, habilitar',
      cancelButtonText: 'Cancelar'
    })

    if (confirmacion.isConfirmed) {
      setLoading(true)
      const data = new FormData()
      data.append('uso', '0')
      data.append('_method', 'PUT')
      try {
        const respuesta = await axios.post(
                    `${Global.url}/habilitarCodigo/${brief.id ?? ''}`,
                    data,
                    {
                      headers: {
                        Authorization: `Bearer ${
                          token !== null && token !== '' ? token : ''
                        }`
                      }
                    }
        )
        if (respuesta.data.status == 'success') {
          toast.success('CODIGO HABILITADO')
          getOneBrief()
        }
      } catch (error: unknown) {
        toast.error('ERROR')
        console.log(error)
      }
      setLoading(false)
    }
  }

  useEffect(() => {
    console.log('PIEZAS: ', piezas)
  }, [])

  return (
    <>
      <form className="mt-5" onSubmit={handleSubmit}>
        <div className="flex flex-wrap lg:flex-row gap-4 justify-between">
          <div className="bg-white flex flex-col w-full lg:max-w-[48%] xl:max-w-[40%]  rounded-2xl p-4 border border-gray-300 transition-colors hover:border-secundario/50">
            <div className="flex items-center justify-between gap-24 pb-4 border-b border-gray-300">
              <div className="flex gap-2 items-center">
                <CiPen className="text-secundario text-2xl flex flex-none" />
                <p className="text-[#252525] lowercase first-letter:uppercase">
                  {datos.nombre_marca}
                </p>
              </div>
              {!values.fecha_fin && (
                <div className="p-0 ">
                  {id != null && values.fecha_fin == null && (
                    <button
                      type="button"
                      onClick={() => {
                        if (datos2?.email && datos2?.comentarios) {
                          setOpenCorreoFinal(true)
                        } else if (!datos2?.comentarios) {
                          Swal.fire(
                            'Debe colocar sus comentarios generales',
                            '',
                            'warning'
                          )
                        } else {
                          Swal.fire({
                            title: 'EL cliente no tiene un email registrado',
                            showDenyButton: true,
                            confirmButtonText: 'Registrar email',
                            denyButtonText: 'Cancelar'
                          }).then(async (result: SweetAlertResult) => {
                            if (result.isConfirmed) {
                              setOpenMailFinal(true)
                            }
                          })
                        }
                      }}
                      className="text-sm text-center w-full  text-white font-normal flex items-center justify-center gap-x-4 p-2 px-4 flex-1 bg-secundario border border-secundario hover:bg-white hover:text-secundario  rounded-lg transition-all active:scale-90"
                    >
                      Finalizar
                    </button>
                  )}
                </div>
              )}
            </div>
            <div className="flex py-16 px-4 items-center justify-center border-b border-gray-300">
              <h5 className="typografy_plan text-secundario text-4xl text-center">
                {datos.id_contrato.includes('LP69') && (
                  datos.id_contrato.slice(4, 6) === 'AM' ? 'Plan 69 a medida' : 'Plan 69'
                )}
                {datos.id_contrato.includes('LP79') && 'Plan 79'}
                {datos.id_contrato.includes('LP89') && 'Plan 89'}
                {datos.id_contrato.includes('LPPG') && 'Plan Piezas Gráficas'}
                {datos.id_contrato.includes('LPFL') && 'Flyer'}
                {datos.id_contrato.includes('LPEXC') && 'Plan Excepcional'}
                {datos.id_contrato.includes('LPB') && (
                  datos.id_contrato.slice(2, 5) === 'BRO' ? 'Plan Brochure' : 'Plan Básico'
                )}
                {((datos.id_contrato).toUpperCase()).includes('LPMANUAL') && 'Diseño de Manual de Marca'}
              </h5>
            </div>
            <div className="flex py-4 px-4 text-[#252525]">
              <p className="font-semibold flex items-center flex-wrap gap-4 w-full justify-between px-4">
                Colaborador a cargo:{' '}
                <span className="font-normal block p-1 px-4 bg-secundario/20 rounded-full">
                  {colaborador?.map((asignacion: any, index: number) => {
                    const assignedCollaborators = colaboradores
                      .filter(
                        (colaborador: { id: number, name: string }) =>
                          colaborador.id == asignacion.peso
                      )
                      .map((colaborador: { name: string }) => colaborador.name)
                    return (
                      <Fragment key={index}>
                        {assignedCollaborators && (
                          <span>{assignedCollaborators}</span>
                        )}
                        {index < colaborador.length - 1}
                      </Fragment>
                    )
                  })}
                </span>
              </p>
            </div>
            <div className="flex py-4 px-4 pt-0 text-[#252525]">
              <p className="font-semibold text-left flex items-center flex-wrap gap-2 w-full justify-between px-4">
                Cliente:{' '}
                <span className="font-normal block p-1 px-4 rounded-full">
                  {datos.nombres}
                </span>
              </p>
            </div>
            <div className="flex py-4 px-4 pt-0 text-[#252525]">
              <p className="font-semibold flex text-left items-center flex-wrap gap-2 w-full justify-between px-4">
                Contrato:{' '}
                <span className="font-normal block p-1 px-4 rounded-full">
                  {datos.id_contrato}
                </span>
              </p>
            </div>
            <div className="flex py-4 px-4 pt-0 text-[#252525]">
              <p className="font-semibold flex text-left items-center flex-wrap gap-2 w-full justify-between px-4">
                C. Brief:{' '}
                <button
                type='button'
                disabled = {brief.uso == 0}
                onClick={
                    async () => { await habilitarCodigo() }
                }
                className={` text-white font-bold block p-1 px-4 rounded-full ${brief.uso == 0
                        ? 'bg-green-600 '
                        : 'bg-red-600'}`}>
                  {brief.codigo}
                </button>
              </p>
            </div>
          </div>
          <div className="bg-white w-full  lg:max-w-[48%] xl:max-w-[33%]  rounded-2xl p-4 px-5 md:px-8 effect_neu_porcentaje_dise flex flex-col justify-center">
            <div className="flex justify-center">
              <h5 className="text-2xl tex-center pb-4 text-secundario font-semibold my-6">
                Procesos completados
              </h5>
            </div>
            <div className="flex flex-col gap-3 relative z-10">
              <div className="absolute -z-10 w-[78%] h-[80%] inset-0 m-auto bg-transparente border-2 border-gray-300 "></div>
              {compararFechas(datos.fecha_fin) && datos.id_contrato.includes('LPPG') && piezasCompletadas > 0
                ? procesosAntiguosPG.map((proceso: Proceso) => (
                    <>
                      <div className="bg-secundario prue w-full flex flex-col items-center py-2 px-2 rounded-2xl border border-gray-300 relative">
                        <div className="w-full flex justify-between items-center rounded-full px-3 md:px-4 py-1 ">
                          <div className="flex gap-2 items-center text-base md:text-lg text-white">
                            <span className="prue_circulo bg-white rounded-full p-2 flex items-center justify-center">
                              {proceso.icono === 'br' && (
                                <CiViewTimeline className="text-secundario text-3xl" />
                              )}
                              {proceso.icono === 'pdf' && (
                                <BsFiletypePdf className="text-secundario text-3xl" />
                              )}
                              {proceso.icono === 'fin' && (
                                <CiSquareCheck className="text-secundario text-3xl" />
                              )}
                            </span>
                            <span className="flex flex-col">
                              <p className="">{proceso.titulo}</p>
                            </span>
                          </div>
                          <div className="flex">
                            <span className="text-base text-[#fff]">
                              {proceso.fecha}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                ))
                : compararFechas(datos.fecha_fin) && datos.id_contrato.includes('LPFL')
                  ? procesosFlyersAntiguos.map((proceso: Proceso) => (
                    <>
                      <div className="bg-secundario prue w-full flex flex-col items-center py-2 px-2 rounded-2xl border border-gray-300 relative">
                        <div className="w-full flex justify-between items-center rounded-full px-3 md:px-4 py-1 ">
                          <div className="flex gap-2 items-center text-base md:text-lg text-white">
                            <span className="prue_circulo bg-white rounded-full p-2 flex items-center justify-center">
                              {proceso.icono === 'br' && (
                                <CiViewTimeline className="text-secundario text-3xl" />
                              )}
                              {proceso.icono === 'pdf' && (
                                <BsFiletypePdf className="text-secundario text-3xl" />
                              )}
                              {proceso.icono === 'fin' && (
                                <CiSquareCheck className="text-secundario text-3xl" />
                              )}
                            </span>
                            <span className="flex flex-col">
                              <p className="">{proceso.titulo}</p>
                            </span>
                          </div>
                          <div className="flex">
                            <span className="text-base text-[#fff]">
                              {proceso.fecha}
                            </span>
                          </div>
                        </div>
                      </div>
                    </>
                  ))
                  : compararFechas(datos.fecha_fin) && piezasCompletadas > 0
                    ? procesosAntiguos.map((proceso: Proceso) => (
                  <>
                    <div className="bg-secundario prue w-full flex flex-col items-center py-2 px-2 rounded-2xl border border-gray-300 relative">
                      <div className="w-full flex justify-between items-center rounded-full px-3 md:px-4 py-1 ">
                        <div className="flex gap-2 items-center text-base md:text-lg text-white">
                          <span className="prue_circulo bg-white rounded-full p-2 flex items-center justify-center">
                            {proceso.icono === 'br' && (
                              <CiViewTimeline className="text-secundario text-3xl" />
                            )}
                            {proceso.icono === 'pdf' && (
                              <BsFiletypePdf className="text-secundario text-3xl" />
                            )}
                            {proceso.icono === 'fin' && (
                              <CiSquareCheck className="text-secundario text-3xl" />
                            )}
                          </span>
                          <span className="flex flex-col">
                            <p className="">{proceso.titulo}</p>
                          </span>
                        </div>
                        <div className="flex">
                          <span className="text-base text-[#fff]">
                            {proceso.fecha}
                          </span>
                        </div>
                      </div>
                    </div>
                  </>
                    ))
                    : (
                  <>
                      {datos.id_contrato.includes('LPPG')
                        ? (
                            procesosPiezas.map((proceso: Proceso, index: number) => (
                              <div key={index} className={`overflow-hidden card_piezas ${(dataUpdatedDiseno.propuestas && index === 1) || (datos.fecha_fin && index === 2) ? 'prue' : ''} bg-white w-full flex flex-col items-center py-2 px-2 rounded-2xl border border-gray-300 relative ${index === 0 ? 'py-4' : ''} ${(piezasCompletadasText === 'Completados' && index === 0 ? 'border-secundario' : '')}`}>
                                {index === 0 && (
                                  <div className="cant_propuestas flex px-6 py-3 gap-2">
                                      {Object.keys(piezas).map((pieza, index) => (
                                        <div key={index} className="flex flex-col items-center justify-center">
                                            <button onClick={() => { handleClick(index + 1) }} type="button" className={`shadow  rounded-full p-2 flex items-center justify-center ${piezas[index + 1].completado ? 'bg-secundario text-white' : 'bg-white text-secundario'}`}><IoExtensionPuzzleOutline className=" text-3xl"/></button>
                                            <p className="text-[#202020]">{pieza}°</p>
                                          </div>
                                      ))}
                                  </div>

                                )}
                                <div className="w-full flex justify-between items-center rounded-full px-3 md:px-4 py-1 ">
                                  <div className={`flex gap-2 items-center text-base md:text-lg ${(dataUpdatedDiseno.propuestas && index === 1) || (dataUpdatedDiseno.envio_informacion && index === 0) ? 'text-white' : 'text-[#252525]'}`}>
                                    <span className="prue_circulo bg-white rounded-full p-2 flex items-center justify-center">
                                      {proceso.icono === 'br' && (
                                        <CiViewTimeline className="text-secundario text-3xl" />
                                      )}
                                      {proceso.icono === 'pdf' && (
                                        <BsFiletypePdf className="text-secundario text-3xl" />
                                      )}
                                      {proceso.icono === 'fin' && (
                                        <CiSquareCheck className="text-secundario text-3xl" />
                                      )}
                                    </span>
                                    <span className="flex flex-col">
                                      <p className={`text-base ${(dataUpdatedDiseno.propuestas && index === 1) || (dataUpdatedDiseno.envio_informacion && index === 0) || (datos.fecha_fin && index === 2) ? 'text-white' : 'text-[#252525]'} `}>{proceso.titulo}</p>
                                    </span>

                                  </div>
                                  <div className={'flex relative ctn_confirmacion '}>

                                    <span className={`text-base ${(dataUpdatedDiseno.propuestas && index === 1) || (dataUpdatedDiseno.envio_informacion && index === 0) || (datos.fecha_fin && index === 2) ? 'text-white' : 'text-[#252525]'} `}>
                                      {index === 0 && (
                                        piezasCompletadasText
                                      )}

                                       {index === 1 && (
                                         datos.fecha_fin ? datos.fecha_fin : '--'
                                       )}

                                    </span>

                                    {!dataUpdatedDiseno.envio_informacion && index === 0 && (
                                      <button type="button" onClick={() => { setInformacionRecopilada(true) }} className="w-[90px] h-full absolute right-0 top-0 bottom-0 my-auto bg-secundario px-4 py-0 text-white rounded-md">Enviado</button>
                                    )}

                                  </div>
                                </div>
                              </div>
                            ))
                          )
                        : (
                            datos.id_contrato.includes('LPFL')
                              ? (
                                  procesosFlyers.map((proceso: Proceso, index: number) => (
                                <div key={index} className={`${(datos.brief && index === 0) || (datos.fecha_fin && index === 1) ? 'prue' : ''} bg-white w-full flex flex-col items-center py-2 px-2 rounded-2xl border border-gray-300 relative`}>
                                  <div className="w-full flex justify-between items-center rounded-full px-3 md:px-4 py-1 ">
                                    <div className={`flex gap-2 items-center text-base md:text-lg ${(datos.brief && index === 0) ? 'text-white' : 'text-[#252525]'}`}>
                                      <span className="prue_circulo bg-white rounded-full p-2 flex items-center justify-center">
                                        {proceso.icono === 'br' && (
                                          <CiViewTimeline className="text-secundario text-3xl" />
                                        )}

                                        {proceso.icono === 'fin' && (
                                          <CiSquareCheck className="text-secundario text-3xl" />
                                        )}
                                      </span>
                                      <span className="flex flex-col">
                                        <p className={`text-base ${(datos.brief && index === 0) || (datos.fecha_fin && index === 1) ? 'text-white' : 'text-[#252525]'} `}>{proceso.titulo}</p>
                                      </span>
                                    </div>
                                    <div className="flex relative ctn_confirmacion">
                                      <span className={`text-base ${(datos.brief && index === 0) || (datos.fecha_fin && index === 1) ? 'text-white' : 'text-[#252525]'} `}>
                                         {index === 1 && (
                                           datos.fecha_fin ? datos.fecha_fin : '--'
                                         )}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                  ))
                                )
                              : ((datos.id_contrato).toUpperCase()).includes('LPMANUAL')
                                  ? procesosManualMarca.map((proceso: Proceso, index: number) => (
                                <div key={index} className={`${(pdfName && index === 1) || (datos?.solicitud_manual != null && index === 0) || (datos.fecha_fin && index === 2) ? 'prue' : ''} bg-white w-full flex flex-col items-center py-2 px-2 rounded-2xl border border-gray-300 relative`}>
                                  <div className="group w-full flex justify-between items-center rounded-full px-3 md:px-4 py-1 ">
                                    <div className={`flex gap-2 items-center text-base md:text-lg ${(pdfName && index === 1) || (datos.fecha_fin && index === 2) || (datos?.solicitud_manual != null && index === 0) ? 'text-white' : 'text-[#252525]'}`}>
                                      <span className="prue_circulo bg-white rounded-full p-2 flex items-center justify-center">
                                        {proceso.icono === 'br' && (
                                          <CiViewTimeline className="text-secundario text-3xl" />
                                        )}
                                        {proceso.icono === 'pdf' && (
                                          <BsFiletypePdf className="text-secundario text-3xl" />
                                        )}
                                        {proceso.icono === 'fin' && (
                                          <CiSquareCheck className="text-secundario text-3xl" />
                                        )}

                                      </span>
                                      <span className="flex flex-col">
                                        <p className="">{proceso.titulo}</p>
                                      </span>
                                    </div>
                                    <div className="flex relative ctn_confirmacion">
                                      <span className={`text-base ${(pdfName && index === 1) || (datos.fecha_fin) || (datos?.solicitud_manual != null && index == 0) ? 'text-white' : 'text-[#252525]'} `}>
                                        {index === 2 && datos.fecha_fin && ((datos.fecha_fin))}
                                        {datos?.solicitud_manual != null && index == 0 ? datos?.solicitud_manual : ''}
                                      </span>
                                    </div>
                                    {datos?.solicitud_manual == null && index == 0 &&
                                     <button type="button" onClick={() => { enviarSolcitudMarca() }} className="group-hover:opacity-100 opacity-0 transition-all hover:bg-secundario hover:text-white w-[90px] h-full right-0 top-0 bottom-0 my-auto bg-transparent border border-secundario text-secundario px-4 py-0  rounded-md">Enviar</button> }
                                  </div>
                                </div>
                                  ))
                                  : procesosAntiguos.map((proceso: Proceso, index: number) => (
                            <div key={index} className={`${(pdfName && index === 1) || (datos.brief == 1 && index === 0) || (datos.fecha_fin && index === 2) ? 'prue' : ''} bg-white w-full flex flex-col items-center py-2 px-2 rounded-2xl border border-gray-300 relative`}>
                              <div className="w-full flex justify-between items-center rounded-full px-3 md:px-4 py-1 ">
                                <div className={`flex gap-2 items-center text-base md:text-lg ${(pdfName && index === 1) || (datos.brief == 1 && index === 0) || (datos.fecha_fin && index === 2) ? 'text-white' : 'text-[#252525]'}`}>
                                  <span className="prue_circulo bg-white rounded-full p-2 flex items-center justify-center">
                                    {proceso.icono === 'br' && (
                                      <CiViewTimeline className="text-secundario text-3xl" />
                                    )}
                                    {proceso.icono === 'pdf' && (
                                      <BsFiletypePdf className="text-secundario text-3xl" />
                                    )}
                                    {proceso.icono === 'fin' && (
                                      <CiSquareCheck className="text-secundario text-3xl" />
                                    )}

                                  </span>
                                  <span className="flex flex-col">
                                    <p className="">{proceso.titulo}</p>
                                  </span>
                                </div>
                                <div className="flex relative ctn_confirmacion">
                                  <span className={`text-base ${(pdfName && index === 1) || (datos.brief == 1 && index === 0) || (datos.fecha_fin) ? 'text-white' : 'text-[#252525]'} `}>
                                    {index === 2 && datos.fecha_fin && ((datos.fecha_fin))}
                                  </span>
                                </div>
                                   {/* {((datos.id_contrato).toUpperCase()).includes('LPMANUAL') &&
                                     <button type="button" onClick={() => { setInformacionRecopilada(true) }} className="w-[90px] h-full right-0 top-0 bottom-0 my-auto bg-secundario px-4 py-0 text-white rounded-md">Enviado</button>
                                   } */}
                              </div>
                            </div>
                                  ))
                          )}
                    </>
                      )}
            </div>
          </div>
          <div className=" flex flex-col gap-4 w-full xl:max-w-[23%]  ">
            <div className="flex h-1/2 bg-white effect_neu_porcentaje_dise flex-col rounded-2xl p-4 pt-6 pb-0  border-gray-300">
              <p className="text-center text-secundario font-semibold text-xl mb-4">
                Porcentaje del proyecto
              </p>
              <div className="min-w-[246px] rounded-xl flex px-6 py-8 pb-0 pt-0 flex-col justify-center items-center">
                <div className="w-60 h-40 relative overflow-visible">
                  <div className="absolute w-full h-full">
                    <svg
                      viewBox="25 35 150 100"
                      width="100%"
                      height="auto"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M 50,100
           A 50,50 0 0,1 150,100"
                        fill="none"
                        stroke="#ddd"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                    </svg>
                  </div>
                  <div className="relative z-10">
                    <svg
                      viewBox="25 35 150 100"
                      width="100%"
                      height="auto"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      {datos?.fecha_fin && formaterFechaInicio(datos?.fecha_fin) <= new Date('2024-04-22 T00:00:00-05:00')
                        ? <motion.path
                        d="M 150,100 A 50,50 0 0,0 50,100"
                        fill="none"
                        stroke="#4E54C8"
                        strokeWidth="8"
                        strokeLinecap="round"
                      />
                        : <motion.path
                        d="M 150,100 A 50,50 0 0,0 50,100"
                        fill="none"
                        stroke="#4E54C8"
                        strokeWidth="8"
                        strokeLinecap="round"
                        initial={{ pathLength: 0, pathOffset: 1 }}
                        animate={{ pathLength, pathOffset: 1 - pathLength }}
                        transition={{ duration: 1 }}
                      />}
                    </svg>
                  </div>

                  <div className="absolute inset-0 flex justify-center items-center text-lg font-bold text-gray-800">
                    {
                    datos?.fecha_fin && formaterFechaInicio(datos?.fecha_fin) <= new Date('2024-04-22T00:00:00-05:00')
                      ? <span>100%</span>
                      : <span>{percentage}%</span>
                    }
                  </div>
                </div>
              </div>
            </div>
            <div className="flex h-1/2 justify-center effect_neu_porcentaje_dise  flex-col gap-4 rounded-2xl p-4 ">
              <div className="flex items-center justify-between">
                <p className="text-[#252525] text-lg flex gap-2 items-center">
                  <PiCalendarLight className="text-2xl text-secundario" />
                  Fecha de inicio
                </p>
                <div className="flex flex-col bg_date_inicio_diseno rounded-lg w-[65px] h-[60px] text-white items-center font-medium justify-center text-center">
                  <div
                    className=""
                    dangerouslySetInnerHTML={{
                      __html: formatearFecha(datos.fecha_inicio)
                    }}
                  ></div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-[#252525] text-lg flex gap-2 items-center">
                  <PiCalendarCheckLight className="text-2xl text-secundario" />
                  Fecha final
                </p>
                <div className="flex flex-col bg_date_final_diseno rounded-lg w-[65px] h-[60px] text-white items-center font-medium justify-center text-center">
                  <div
                    className=""
                    dangerouslySetInnerHTML={{
                      __html: formatearFecha(datos.fecha_fin)
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl mt-6">
          <ArchivosFinales
            datos={datos}
            getOneBrief={getOneBrief}
            values={values}
            pdfName={pdfName}
            setpdfName={pdfName}
            fechaCreacion={fechaCreacion}
            limite={limite}
            plan={plan}
            validateBrief={validateBrief}
          />
        </div>

        <div className="bg-white p-4 rounded-xl mt-6">
          <div className="w-full flex flex-col justify-start md:items-start gap-y-2 relative">
            <div className="flex flex-col gap-2 mb-3 ">
              <h2 className="text-xl lg:text-2xl font-bold text-black">
                Seguimiento del proyecto
              </h2>
            </div>
            <span
              className="w-fit px-4 py-2 bg-main text-white font-semibold rounded-xl absolute right-2 flex gap-2 items-center cursor-pointer transition-all active:scale-90"
              onClick={() => {
                if (
                  datos.correo &&
                  datos.correo != 'null' &&
                  datos.correo != null
                ) {
                  setOpenQuestion(true)
                } else {
                  Swal.fire({
                    title: 'EL cliente no tiene un email registrado',
                    showDenyButton: true,
                    confirmButtonText: 'Registrar email',
                    denyButtonText: 'Cancelar'
                  }).then(async (result: SweetAlertResult) => {
                    if (result.isConfirmed) {
                      setOpenMail(true)
                    }
                  })
                }
              }}
            >
              Agregar avance
            </span>
            <section className="w-full pt-6">
              <SwiperAvances
                arrayAlta={arrayAlta}
                arrayAvances={arrayAvances}
                setAvance={setAvance}
                setOpen={setOpenAvance}
                setOpenFinal={setOpenFinal}
                arrayFinal={arrayFinal}
                setFinal={setfinal}
                setOpenActa={setOpenActa}
                arrayActa={arrayActa}
                datos={datos}
                setOpenAlta={setopenAlta}
              />
            </section>
          </div>
        </div>

        <div className="bg-white p-4 rounded-xl mt-6">
            <div className="flex justify-between gap-2 mb-4">
                <div className="flex gap-2 w-full justify-end">
                    <input
                        type="submit"
                        className="bg-main_2-200 text-white hover:bg-primary flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
                        value="Grabar comentario"
                    />
                </div>
            </div>
            <div className='text-black mb-4'>
                <label
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="email"
                >
                    PUNTUACION DEL CLIENTE
                </label>
                    <select
                    className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                    name='puntuacion'
                    value={values.puntuacion}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    disabled={false}
                >
                    <option value="">Seleccionar</option>
                        <option value="1">1</option>
                        <option value="2">2</option>
                        <option value="3">3</option>
                        <option value="4">4</option>
                        <option value="5">5</option>
                        <option value="6">6</option>
                        <option value="7">7</option>
                        <option value="8">8</option>
                        <option value="9">9</option>
                        <option value="10">10</option>
                    </select>
                <Errors
                    errors={errors.puntuacion}
                    touched={touched.puntuacion}
                />
            </div>
            <label
                className="text-sm text-black font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="email"
            >
                COMENTARIO GENERAL
            </label>
            <div className="w-full flex justify-center items-center flex-col md:flex-row gap-2 lg:gap-5">
                <div className="w-full">
                    <textarea
                        cols={30}
                        rows={10}
                        className="border placeholder-gray-400 focus:outline-none
                                                                focus:border-black w-full  pr-4 h-24 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                                border-gray-300 rounded-md transition-all text-black"
                        name="comentarios"
                        value={values.comentarios}
                        onChange={handleChange}
                        onBlur={handleBlur}
                    ></textarea>

                    <Errors
                        errors={errors.comentarios}
                        touched={touched.comentarios}
                    />
                </div>
            </div>
        </div>
      </form>
    </>
  )
}
