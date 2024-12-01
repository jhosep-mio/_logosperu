/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import Swal, { type SweetAlertResult } from 'sweetalert2'
import { useFormik } from 'formik'
import { BsChatRightText } from 'react-icons/bs'
import { useAnimation } from 'framer-motion'
import 'react-datepicker/dist/react-datepicker.css'
import {
  type valuesResumen,
  type FinalValues,
  type arrayCorreos,
  type avanceValues,
  type ValuesPlanes
} from '../../../shared/schemas/Interfaces'
// import { Chat } from './Chat'
import useAuth from '../../../../hooks/useAuth'
import { Global } from '../../../../helper/Global'
import { SchemaPropuestas } from '../../../shared/schemas/Schemas'
import { Loading } from '../../../shared/Loading'
import { ModalObsequios } from '../servicios/obsequios/ModalObsequios'
import { RegistroMail } from '../servicios/RegistroMail'
import { RegistroMarca } from '../servicios/RegistroMarca'
import { ModalDescripcion2 } from '../servicios/community/ModalDescripcion2'
import { ModalQuestion } from '../servicios/modals/ModalQuestion'
import { ModalActaEstado } from '../servicios/modals/ModalActaEstado'
import { ModalRegistro } from '../servicios/ModalRegistro'
import { ModalFeErratas } from '../servicios/modals/ModalFeErratas'
import { ModalaAvisonNotificacion } from '../servicios/avisoNotificacion/ModalaAvisonNotificacion'
import { ModalActaAceptacion } from '../servicios/actaAceptacion/ModalActaAceptacion'
import { ViewAvance } from '../servicios/ViewAvance'
import { ViewFinal } from '../servicios/ViewFinal'
import { ViewAlta } from '../servicios/modals/ViewAlta'
import { ModalCorreoFinal2 } from '../servicios/ModalCorreoFinal2'
import { RegistroEmail2 } from '../servicios/RegistroEmail2'
import { ViewActa } from '../servicios/ViewActa'
import { PlanAdsCapaCitaciones } from '../servicios/forms/PlanAdsCapaCitaciones'

interface Dataweb {
  dominio: string
  domain_temp: string
  cant_correos: string
  porcentaje_proyecto: string
  procesos: Proceso[]
  domain_owner: string
  hosting_owner: string
}

interface Proceso {
  nombre: string
  fecha: string
  icono: string
}
interface valuesDatos {
  idCliente: string
  nombres: string
  email: string
  marca: string
  celular: string
  id_contrato: string
  comentarios: string
}

interface values {
  nombres: string
  email: string
  correo: string
  celular: string
  fecha: string
  hora_acta: string
  nombre_marca: string
  archivos: string
  id_contrato: string
  fecha_fin: string
  fecha_inicio: string
  observaciones: string
  comunnity: string
}

export const AvanceCapacitaciones = (): JSX.Element => {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const { setTitle, auth } = useAuth()
  const [loading, setLoading] = useState(true)
  const [, setHostingActivo] = useState(false)
  const [plan, setplan] = useState<ValuesPlanes | null>(null)
  const [open, setOpen] = useState(false)
  const [openCorreoActa, setOpenCorreoActa] = useState(false)
  const [openFeErratas, setOpenFeErratas] = useState(false)
  const [openAvisoNotificacion, setOpenAvisoNotificacion] = useState(false)
  const [openActaAceptacion, setOpenActaAceptacion] = useState(false)
  const [openQuestion, setOpenQuestion] = useState(false)
  const [openObsequio, setOpenObsequio] = useState(false)
  const [openModal, setOpenModal] = useState(false)
  const [selectIDCLIENTE, setSelectIDCLIENTE] = useState(0)
  const [selectedItem] = useState<Event | null>(null)
  const [percentage, setPercentage] = useState(0) // Estado para almacenar el porcentaje
  const [datos, setDatos] = useState<values>({
    nombres: '',
    email: '',
    correo: '',
    celular: '',
    fecha: '',
    hora_acta: '',
    nombre_marca: '',
    archivos: '',
    id_contrato: '',
    fecha_fin: '',
    fecha_inicio: '',
    observaciones: '',
    comunnity: ''
  })
  //   const [openChat, setOpenChat] = useState(false)
  const [openMail, setOpenMail] = useState(false)
  const [, setUsuarios] = useState<never[]>([])
  const [openCorreoFinal, setOpenCorreoFinal] = useState(false)
  const [capacitacion, setCapacitacion] = useState<any | null>(null)
  const [arrayAvances, setArrayAvances] = useState([])
  const [arrayAlta, setArrayAlta] = useState<any | null>(null)
  const [arrayFinal, setArrayFinal] = useState([])
  const [arrayActa, setArrayActa] = useState([])
  const [openActa, setOpenActa] = useState(false)
  const [datos2, setDatos2] = useState<valuesDatos | null>(null)
  const [pdfName, setpdfName] = useState<string | undefined>('')
  const [avance, setAvance] = useState<avanceValues>({
    contexto: '',
    imagenes: [],
    archivos: [],
    correos: [],
    asunto: '',
    conclusion: '',
    contacto: '',
    empresa: '',
    fechaacta: '',
    firma: '',
    motivo: '',
    fecha: '',
    hora: ''
  })
  const [final, setfinal] = useState<FinalValues>({
    contexto: '',
    correos: [],
    asunto: '',
    fecha: '',
    hora: '',
    firma: ''
  })
  const [fechaCreacion, setFechaCreacion] = useState<Date | null>(null)
  const [openAvance, setOpenAvance] = useState(false)
  const [, setHosting] = useState<any | null>(null)
  const [openFinal, setOpenFinal] = useState(false)
  const [openAlta, setopenAlta] = useState(false)
  const [openMarca, setOpenMarca] = useState(false)
  const [correos, setCorreos] = useState<arrayCorreos[]>([])
  const [, setResumen] = useState<valuesResumen[]>([])
  const [colaboradores, setColaboradores] = useState([])
  const [colaborador, setColaborador] = useState([])
  const [limite, setLimite] = useState(0)
  const [openMailFinal, setOpenMailFinal] = useState(false)
  const [validateBrief, seValidateBrief] = useState<boolean | null>(null)
  const [, setEvents] = useState<Event[]>([])
  const [, setBrief] = useState<any | null>(null)
  const [communityActivo, setCommunityActivo] = useState('true')

  const updatePropuestas = async (): Promise<void> => {
    setLoading(true)
    const data = new FormData()
    data.append('comentarios', values.comentarios)
    data.append('data_web', JSON.stringify(dataWeb))

    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/updatePropuestas/${id ?? ''}`,
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
        Swal.fire('Actualización exitosa', '', 'success')
        getOneBrief2()
      } else {
        Swal.fire('Error al actualizar', '', 'error')
      }
    } catch (error: unknown) {
      Swal.fire('Error', '', 'error')
    }
    setLoading(false)
  }

  const parseFecha = (fechaString: string): Date => {
    const [dia, mes, ano] = fechaString.split('/')
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    return new Date(ano, mes - 1, dia)
  }

  const {
    handleSubmit,
    handleChange,
    setValues,
    errors,
    values,
    touched,
    handleBlur,
    isSubmitting
  } = useFormik({
    initialValues: {
      link_final: '',
      fecha_fin: '',
      comentarios: '',
      propuestas: '',
      archivos_avances: ''
    },
    validationSchema: SchemaPropuestas,
    onSubmit: updatePropuestas
  })
  // dataUpdatedWeb
  const [dataUpdatedWeb, setDataUpdatedWeb] = useState<Dataweb>({
    cant_correos: '',
    domain_temp: '',
    dominio: '',
    porcentaje_proyecto: '',
    procesos: [],
    domain_owner: '',
    hosting_owner: ''
  })

  const getOneBrief = async (): Promise<void> => {
    try {
      const request = await axios.get(`${Global.url}/getVenta/${id ?? ''}`, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      })
      const codContr: string = request.data[0].id_contrato.split('_')[0]
      const requestPlan = await axios.get(
        `${Global.url}/onePlanToNombre/${codContr ?? ''}`,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? `Bearer ${token}` : ''
            }`
          }
        }
      )

      setplan(requestPlan.data[0])
      if (request.data[0].contrato) {
        setBrief({
          codigo: request.data[0].contrato.codigo,
          uso: request.data[0].contrato.uso
        })
      } else {
        setBrief({ codigo: request.data[0].codigo, uso: request.data[0].uso })
      }

      if (request.data[0].hosting) {
        setHosting(JSON.parse(request.data[0].hosting))
      }
      if (request.data[0].community_activo) {
        setCommunityActivo(request.data[0].community_activo)
      }
      if (request.data[0].activehosting) {
        setHostingActivo(request.data[0].activehosting)
      }
      if (request.data[0].capacitacion) {
        setCapacitacion(JSON.parse(request.data[0].capacitacion))
      }
      if (requestPlan.data[0].tipo?.includes('Diseño Logotipo')) {
        const respuesta = await axios.get(
          `${Global.url}/oneBriefDiseñoNewToSeguimiento/${id ?? ''}`,
          {
            headers: {
              Authorization: `Bearer ${
                token !== null && token !== '' ? `Bearer ${token}` : ''
              }`
            }
          }
        )
        if (respuesta.data[0]) {
          seValidateBrief(true)
        } else {
          seValidateBrief(false)
        }
      } else if (codContr == 'LPBRO') {
        const respuesta = await axios.get(
          `${Global.url}/oneBriefBrochureToSeguimiento/${id ?? ''}`,
          {
            headers: {
              Authorization: `Bearer ${
                token !== null && token !== '' ? `Bearer ${token}` : ''
              }`
            }
          }
        )
        if (respuesta.data[0]) {
          seValidateBrief(true)
        } else {
          seValidateBrief(false)
        }
      } else if (codContr == 'LPFLYER') {
        const respuesta = await axios.get(
          `${Global.url}/oneBriefFlyerToSeguimiento/${id ?? ''}`,
          {
            headers: {
              Authorization: `Bearer ${
                token !== null && token !== '' ? `Bearer ${token}` : ''
              }`
            }
          }
        )
        if (respuesta.data[0]) {
          seValidateBrief(true)
        } else {
          seValidateBrief(false)
        }
      } else {
        seValidateBrief(null)
      }
      //   setplanes(requestPlan.data[0])
      if (request.data[0].limitar_archivos) {
        setLimite(request.data[0].limitar_archivos)
      }
      setValues({
        ...values,
        comentarios: request.data[0].comentarios,
        link_final: request.data[0].archivos_finales,
        propuestas: request.data[0].propuestas,
        fecha_fin: request.data[0].fecha_fin,
        archivos_avances: request.data[0].archivos_avances
      })

      setDatos2({
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        nombres: `${request.data[0].nombres} ${request.data[0].apellidos}`,
        idCliente: request.data[0].id_cliente,
        celular: request.data[0].celular,
        email: request.data[0].email,
        marca: request.data[0].nombre_marca,
        id_contrato: request.data[0].id_contrato,
        comentarios: request.data[0].comentarios
      })
      if (request.data[0].data_web) {
        setDataUpdatedWeb(JSON.parse(request.data[0].data_web))
      }

      setpdfName(request.data[0].propuestas)
      setColaborador(
        request.data[0].asignacion ? JSON.parse(request.data[0].asignacion) : []
      )
      if (request.data[0].array_avances) {
        setArrayAvances(JSON.parse(request.data[0].array_avances))
      } else {
        setArrayAvances([])
      }
      if (request.data[0].array_final) {
        setArrayFinal(JSON.parse(request.data[0].array_final))
      } else {
        setArrayFinal([])
      }
      if (request.data[0].contenido) {
        setArrayAlta(JSON.parse(request.data[0].contenido))
      }
      if (request.data[0].acta_aceptacion) {
        setArrayActa(JSON.parse(request.data[0].acta_aceptacion))
      } else {
        setArrayActa([])
      }
      if (request.data[0].resumen) {
        setResumen(JSON.parse(request.data[0].resumen))
      } else {
        setResumen([])
      }

      if (request.data[0].fecha_fin) {
        setFechaCreacion(parseFecha(request.data[0].fecha_fin))
      }
      setTitle(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `${request.data[0].nombres} ${request.data[0].apellidos} - ${
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          request.data[0].nombre_marca
            ? request.data[0].nombre_marca
            : 'No registrado'
        }`
      )
      setSelectIDCLIENTE(request.data[0].id_cliente)
      setDatos((prevDatos) => ({
        ...prevDatos,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        nombres: `${request.data[0].nombres} ${request.data[0].apellidos}`,
        nombre_empresa_final: request.data[0].nombre_empresa,
        empresa: request.data[0].nombre_empresa,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        correo: `${request.data[0].email}`,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        email: `${request.data[0].email}`,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        celular: `${request.data[0].celular}`,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        fecha: `${request.data[0].array_final}`,
        hora_acta: `${
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          request.data[0].hora_acta ? request.data[0].hora_acta : ''
        }`,
        nombre_marca: `${
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          request.data[0].nombre_marca ? request.data[0].nombre_marca : ''
        }`,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        archivos: `${request.data[0].acta_aceptacion}`,
        id_contrato: request.data[0].id_contrato,
        fecha_fin: request.data[0].fecha_fin,
        fecha_inicio: request.data[0].fecha_inicio,
        observaciones: request.data[0].observaciones,
        brief:
          request.data[0]?.uso == 1
            ? 1
            : request.data[0].contrato?.uso == 1
              ? 1
              : 0,
        comunnity: request.data[0].community
          ? JSON.parse(request.data[0].community)
          : [],
        aprobacion: request.data[0].aprobacion
          ? JSON.parse(request.data[0].aprobacion)
          : [],
        tienehosting: request.data[0].hosting_id,
        fecha_adicional: request.data[0].fecha_adicional
          ? request.data[0].fecha_adicional
          : null,
        solicitud_manual: request.data[0].solicitud_manual,
        nombre_plan: request.data[0].nombre_plan
      }))
      setEvents(
        request.data[0].community ? JSON.parse(request.data[0].community) : []
      )

      if (request.data[0].email && request.data[0].email != null) {
        setCorreos([
          ...correos,
          { id: Date.now(), correo: request.data[0].email }
        ])
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  const getOneBrief2 = async (): Promise<void> => {
    setLoading(true)
    try {
      const request = await axios.get(`${Global.url}/getVenta/${id ?? ''}`, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      })
      setValues({
        ...values,
        comentarios: request.data[0].comentarios,
        link_final: request.data[0].archivos_finales,
        propuestas: request.data[0].propuestas,
        fecha_fin: request.data[0].fecha_fin,
        archivos_avances: request.data[0].archivos_avances
      })
      if (request.data[0].data_web) {
        setDataUpdatedWeb(JSON.parse(request.data[0].data_web))
      }
      if (request.data[0].community_activo) {
        setCommunityActivo(request.data[0].community_activo)
      }
    } catch (error) {}
    setLoading(false)
  }

  const getColaboradores = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getColaboradores`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setColaboradores(request.data)
  }

  const getUsuarios = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getUsuariosToMatrix`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setUsuarios(request.data)
  }

  useEffect(() => {
    getColaboradores()
    getUsuarios()
  }, [])

  useEffect(() => {
    setLimite(0)
    getOneBrief()
  }, [id])

  useEffect(() => {
    if (errors && isSubmitting) {
      const firstErrorKey = Object.keys(errors)[0]
      const firstErrorElement = document.getElementsByName(firstErrorKey)[0]
      if (firstErrorElement) {
        firstErrorElement.focus()
      }
    }
  }, [touched, errors, isSubmitting])

  const mostrarAlerta = (): void => {
    Swal.fire({
      title: 'Aun no cuenta con una marca registrada',
      showDenyButton: true,
      confirmButtonText: 'Registrar marca',
      denyButtonText: 'Cancelar'
    }).then(async (result: SweetAlertResult) => {
      if (result.isConfirmed) {
        setOpenMarca(true)
      }
    })
  }

  useEffect(() => {
    if (values.fecha_fin) {
      setPercentage(100)
    } else {
      setPercentage(0)
    }
  }, [values.fecha_fin])

  const fillAnimation = useAnimation()

  useEffect(() => {
    const circumference = 2 * Math.PI * 50 // Circunferencia del círculo
    let progress = (circumference * percentage) / 100 // Longitud del borde de progreso

    // Ajuste para asegurarse de que el borde se extienda completamente alrededor del círculo
    progress = Math.min(progress, circumference)

    fillAnimation.start({
      strokeDasharray: `${progress} ${circumference}`,
      transition: {
        duration: 1,
        type: 'spring',
        stiffness: 100
      }
    })
  }, [percentage, fillAnimation])

  const [procesosRegistrados, setProcesosRegistrados] = useState<Proceso[]>([])

  const [domainTemp, setDomainTemp] = useState('')
  const [domain, setDomain] = useState('Sin dominio')
  const [cantCorreos] = useState('3 correos corporativos')
  const [domainOwner, setDomainOwner] = useState('')
  const [hostingOwner, setHostingOwner] = useState('')

  const dataWeb = {
    dominio: domain,
    domain_temp: domainTemp,
    cant_correos: cantCorreos,
    porcentaje_proyecto: percentage,
    procesos: procesosRegistrados,
    domain_owner: domainOwner,
    hosting_owner: hostingOwner
  }

  useEffect(() => {
    setPercentage(Number(dataUpdatedWeb.porcentaje_proyecto))
    setDomain(
      dataUpdatedWeb.dominio === '' ? 'Sin dominio' : dataUpdatedWeb.dominio
    )
    setDomainTemp(dataUpdatedWeb.domain_temp)
    setProcesosRegistrados(dataUpdatedWeb.procesos)
    setDomainOwner(dataUpdatedWeb.domain_owner)
    setHostingOwner(dataUpdatedWeb.hosting_owner)
  }, [dataUpdatedWeb])

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          {/* {auth.id_rol == 99 && (
            <div className="flex flex-col lg:flex-row gap-3 items-center mb-2 justify-between relative z-[2] w-fit min-w-[600px]">
              <div className="flex gap-3 items-center justify-between lg:justify-start w-full">
                <div
                  className="flex gap-3 bg-main px-3 py-1 rounded-md cursor-pointer hover:bg-main_dark"
                  onClick={() => {
                    setOpenObsequio(!openObsequio)
                  }}
                >
                  <span className="text-white">Adicionales</span>
                  <BsFillGiftFill className="text-2xl  rounded-lg text-white  transition-colors cursor-pointer" />
                </div>
                <div className="w-fit  relative z-[11]">
                  <div
                    className="w-full  px-3 py-1 items-center rounded-md bg-green-600 hover:bg-green-700 transition-colors cursor-pointer flex gap-3"
                    onClick={() => {
                      setMostrarSelector(!mostrarSelector)
                    }}
                  >
                    <span className="text-white">Reenviar archivos</span>
                    <AiTwotoneCalendar className="text-2xl  text-white transition-colors " />
                  </div>
                  {mostrarSelector && (
                    <div className="absolute top-full w-fit shadow-md flex flex-col bg-white p-4 rounded-md mt-2 left-0 right-0 z-[11]">
                      <DatePicker
                        selected={fechaSeleccionada}
                        onChange={handleFechaSeleccionada}
                        dateFormat="dd/MM/yyyy"
                        className="text-black border px-3 py-1 border-gray-300 rounded-md"
                      />
                      <button
                        disabled={loadingReenvio}
                        className="bg-secondary-150 px-2 py-1 w-fit rounded-md text-white mt-3"
                        type="button"
                        onClick={async () => {
                          await reenviarArchivos()
                        }}
                      >
                        Guardar
                      </button>
                    </div>
                  )}
                </div>
                {
                  // @ts-expect-error
                  datos?.fecha_adicional && (
                    <div className="flex gap-3 items-center bg-white rounded-md px-2 py-1">
                      <span className="text-black h-full flex items-center">
                        {
                          // @ts-expect-error
                          format(new Date(datos?.fecha_adicional), 'dd/MM/yyyy')
                        }
                      </span>
                      <AiFillCloseCircle
                        className="text-2xl text-main cursor-pointer"
                        onClick={async () => {
                          if (!loadingReenvio) {
                            await reenviarArchivos2()
                          }
                        }}
                      />
                    </div>
                  )
                }
                {datos?.fecha_fin == null && (
                  <div
                    className="flex gap-3 bg-secundario px-3 py-1 rounded-md cursor-pointer hover:bg-secundario_dark transition-colors"
                    onClick={() => {
                      retiroAdministradorCM()
                    }}
                  >
                    <span className="text-white">Finalizar servicio</span>
                  </div>
                )}
              </div>
              {datos?.fecha_fin == null && (
              <div className="w-full flex justify-end">
                  <ButtonHabilitate
                    communityActivo={communityActivo}
                    datos={datos}
                    id={id}
                    setLoading={setLoading}
                    token={token}
                    getOneBrief={getOneBrief}
                    plan={plan}
                  />
              </div>
              )}
            </div>
          )} */}
          <PlanAdsCapaCitaciones
            openObsequio={openObsequio}
            setOpenObsequio={setOpenObsequio}
            arrayActa={arrayActa}
            arrayAlta={arrayAlta}
            arrayAvances={arrayAvances}
            getOneBrief={getOneBrief}
            communityActivo={communityActivo}
            capacitacion={capacitacion}
            setCapacitacion={setCapacitacion}
            arrayFinal={arrayFinal}
            colaborador={colaborador}
            colaboradores={colaboradores}
            datos={datos}
            datos2={datos2}
            errors={errors}
            handleBlur={handleBlur}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            setAvance={setAvance}
            setOpenActa={setOpenActa}
            setOpenAvance={setOpenAvance}
            setOpenCorreoFinal={setOpenCorreoFinal}
            setOpenFinal={setOpenFinal}
            setOpenMail={setOpenMail}
            setOpenMailFinal={setOpenMailFinal}
            setOpenQuestion={setOpenQuestion}
            setfinal={setfinal}
            setopenAlta={setopenAlta}
            touched={touched}
            values={values}
            getDatos={getOneBrief}
            pdfName={pdfName}
            fechaCreacion={fechaCreacion}
            limite={limite}
            plan={plan}
            validateBrief={validateBrief}
          />

          <ModalQuestion
            open={openQuestion}
            setOpen={setOpenQuestion}
            arrayAvances={arrayAvances}
            openCorreo={setOpen}
            setOpenCorreoActa={setOpenCorreoActa}
            setOpenAvisoNotificacion={setOpenAvisoNotificacion}
            setOpenFeErratas={setOpenFeErratas}
            values={values}
            setOpenActaAceptacion={setOpenActaAceptacion}
          />
          <ModalActaEstado
            open={openCorreoActa}
            setOpen={setOpenCorreoActa}
            idVenta={id}
            getOneBrief={getOneBrief}
            datos={datos}
            correos={correos}
            setCorreos={setCorreos}
          />
          <ModalRegistro
            open={open}
            setOpen={setOpen}
            idVenta={id}
            getOneBrief={getOneBrief}
            datos={datos}
            correos={correos}
            setCorreos={setCorreos}
          />

          <ModalFeErratas
            open={openFeErratas}
            setOpen={setOpenFeErratas}
            arrayAvances={arrayAvances}
            idVenta={id}
            getOneBrief={getOneBrief}
            datos={datos}
            correos={correos}
            setCorreos={setCorreos}
          />

          <ModalaAvisonNotificacion
            open={openAvisoNotificacion}
            setOpen={setOpenAvisoNotificacion}
            idVenta={id}
            getOneBrief={getOneBrief}
            datos={datos}
            correos={correos}
            setCorreos={setCorreos}
          />

          <ModalActaAceptacion
            open={openActaAceptacion}
            setOpen={setOpenActaAceptacion}
            idVenta={id}
            getOneBrief={getOneBrief}
            datos={datos}
            correos={correos}
            setCorreos={setCorreos}
          />

          <ViewAvance
            open={openAvance}
            setOpen={setOpenAvance}
            avance={avance}
            getData={getOneBrief}
            datos={datos}
            arrayAvances={arrayAvances}
            setArrayAvances={setArrayAvances}
          />
          <ViewFinal
            open={openFinal}
            setOpen={setOpenFinal}
            avance={final}
            datos={datos}
          />

          <ViewAlta
            open={openAlta}
            setOpen={setopenAlta}
            avance={arrayAlta}
            datos={datos}
          />

          <ModalCorreoFinal2
            open={openCorreoFinal}
            setOpen={setOpenCorreoFinal}
            correos={correos}
            setCorreos={setCorreos}
            idVenta={id}
            datos={datos2}
            getOneBrief={getOneBrief}
          />

          <RegistroEmail2
            open={openMailFinal}
            setOpen={setOpenMailFinal}
            id={datos2?.idCliente}
            getOneBrief={getOneBrief}
          />
          {datos.hora_acta && (
            <ViewActa open={openActa} setOpen={setOpenActa} datos={datos} />
          )}
          <button
            type="button"
            className="bg-green-700 rounded-full p-4 fixed right-6 bottom-6 z-50"
            onClick={() => {
              if (datos.nombre_marca.length > 0 || auth.id_rol == 99) {
                navigate(`/admin/seguimiento/${id ?? ''}`)
              } else {
                mostrarAlerta()
              }
            }}
          >
            <BsChatRightText className="text-white text-3xl" />
          </button>
        </>
      )}

      <ModalDescripcion2
        eventSelected={selectedItem}
        open={openModal}
        setOpen={setOpenModal}
      />
      <RegistroMarca
        open={openMarca}
        setOpen={setOpenMarca}
        id={id}
        getOneBrief={getOneBrief}
      />
      <RegistroMail
        open={openMail}
        setOpen={setOpenMail}
        id={selectIDCLIENTE}
        getOneBrief={getOneBrief}
      />
      <ModalObsequios
        open={openObsequio}
        setOpen={setOpenObsequio}
        // @ts-expect-error
        datos={datos}
        getClientes={getOneBrief}
        usuarios={colaboradores}
      />
    </>
  )
}
