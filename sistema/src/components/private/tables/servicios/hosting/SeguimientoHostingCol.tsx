/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Swal from 'sweetalert2'
import { useFormik } from 'formik'
import 'swiper/css'
import 'swiper/css/navigation'
import { Global } from '../../../../../helper/Global'
import { SchemaPropuestas } from '../../../../shared/schemas/Schemas'
import { Loading } from '../../../../shared/Loading'
import {
  type FinalValues,
  type avanceValues
} from '../../../../shared/schemas/Interfaces'
import { ViewFinal } from '../../servicios/ViewFinal'
import { PlanHostingCol } from '../forms/PlanHostingCol'
import { getDataVentas } from '../../../../shared/FetchingData'
import { ViewObsequios } from '../../hosting/seguimiento/ViewObsequios'
import { ViewAvance } from '../../hosting/seguimiento/ViewAvance'
// import { Chat } from './Chat'

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

export const SeguimientoHostingCol = (): JSX.Element => {
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(true)
  const [hostingactivo, setHostingActivo] = useState(false)
  const [antecedentes, setAntecedentes] = useState<any>([])
  const [openAntecedente, setOpenAntecedemte] = useState({
    estado: false,
    avance: null
  })
  const [, setPercentage] = useState(0) // Estado para almacenar el porcentaje
  const [datos] = useState<values>({
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
  const [openAvance, setOpenAvance] = useState(false)
  const [proyecto, setProyecto] = useState<any | null>(null)
  //   const [openChat, setOpenChat] = useState(false)
  const [, setOpenMail] = useState(false)
  const [, setOpenCorreoFinal] = useState(false)
  const [arrayAvances, setArrayAvances] = useState([])
  const [arrayObsequios, setArrayObsequios] = useState([])
  const [arrayAlta, setArrayAlta] = useState<any | null>(null)
  const [arrayFinal, setArrayFinal] = useState([])
  const [arrayActa, setArrayActa] = useState([])
  const [, setOpenActa] = useState(false)
  const [datos2, setDatos2] = useState<any | null>(null)
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
  const [hosting, setHosting] = useState<any | null>(null)
  const [idVenta, setidVenta] = useState<any | null>(null)
  const [openFinal, setOpenFinal] = useState(false)
  const [, setopenAlta] = useState(0)
  const [colaboradores, setColaboradores] = useState([])
  const [colaborador] = useState([])
  const [, setOpenQuestion] = useState(false)
  const [, setLimite] = useState(0)
  const [, setOpenMailFinal] = useState(false)

  const getUsuarios = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getColaboradores`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setColaboradores(request.data)
  }

  const updatePropuestas = async (): Promise<void> => {
    setLoading(true)
    const data = new FormData()
    data.append('comentarios', values.comentarios)
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
        getOneBrief()
      } else {
        Swal.fire('Error al actualizar', '', 'error')
      }
    } catch (error: unknown) {
      Swal.fire('Error', '', 'error')
    }
    setLoading(false)
  }

  const {
    handleSubmit,
    handleChange,
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

  const getOneBrief = async (): Promise<void> => {
    try {
      const request = await axios.get(`${Global.url}/getOneHost/${id ?? ''}`, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      })
      const request2 = await axios.get(
        `${Global.url}/getOneAntecenteHosting/${id ?? ''}`,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? `Bearer ${token}` : ''
            }`
          }
        }
      )
      setAntecedentes(request2.data)
      if (request.data[0].id_cliente) {
        getDataVentas(
          `indexToOneClienteCol/${request.data[0].id_cliente ?? ''}`,
          setProyecto,
          setopenAlta
        )
      }
      setDatos2({
        correlativo: request.data[0].correlativo,
        id: request.data[0].id,
        id_cliente: request.data[0].id_cliente,
        soporte: request.data[0].soporte ? JSON.parse(request.data[0].soporte) : []
      })
      setidVenta(request.data[0].id_cliente)
      if (request.data[0].hosting) {
        setHosting(JSON.parse(request.data[0].hosting))
      }
      if (request.data[0].activehosting) {
        setHostingActivo(request.data[0].activehosting)
      }
      if (request.data[0].correos) {
        setArrayAvances(JSON.parse(request.data[0].correos))
      } else {
        setArrayAvances([])
      }
      if (request.data[0].obsequios) {
        setArrayObsequios(JSON.parse(request.data[0].obsequios))
      } else {
        setArrayObsequios([])
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
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setLimite(0)
    getOneBrief()
    getUsuarios()
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

  useEffect(() => {
    if (values.fecha_fin) {
      setPercentage(100)
    } else {
      setPercentage(0)
    }
  }, [values.fecha_fin])

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <PlanHostingCol
            setOpenAntecedemte={setOpenAntecedemte}
            antecedentes={antecedentes}
            arrayActa={arrayActa}
            arrayObsequios={arrayObsequios}
            idVenta={idVenta}
            setHostingActivo={setHostingActivo}
            hostingactivo={hostingactivo}
            arrayAlta={arrayAlta}
            arrayAvances={arrayAvances}
            hosting={hosting}
            setHosting={setHosting}
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
            proyecto={proyecto}
          />
          <ViewObsequios
            open={openAvance}
            setOpen={setOpenAvance}
            avance={avance}
            getData={getOneBrief}
            datos={datos}
            arrayAvances={arrayAvances}
            setArrayAvances={setArrayAvances}
          />
          <ViewAvance open={openAntecedente} setOpen={setOpenAntecedemte} />
          <ViewFinal
            open={openFinal}
            setOpen={setOpenFinal}
            avance={final}
            datos={datos}
          />
        </>
      )}
    </>
  )
}
