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
import { PlanHosting } from '../../servicios/forms/PlanHosting'
import {
  type avanceValues,
  type FinalValues
} from '../../../../shared/schemas/Interfaces'
import { ViewFinal } from '../../servicios/ViewFinal'
import { ViewAlta } from '../../servicios/modals/ViewAlta'
import { ViewAvance } from './ViewAvance'
import { ViewObsequios } from './ViewObsequios'
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

export const SeguimientoHosting = (): JSX.Element => {
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(true)
  const [hostingactivo, setHostingActivo] = useState(false)
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
  const [openAvance, setOpenAvance] = useState(false)
  const [antecedentes, setAntecedentes] = useState<any>([])
  //   const [openChat, setOpenChat] = useState(false)
  const [arrayAvances, setArrayAvances] = useState([])
  const [arrayObsequios, setArrayObsequios] = useState([])
  const [arrayAlta, setArrayAlta] = useState<any | null>(null)
  const [, setArrayFinal] = useState([])
  const [, setArrayActa] = useState([])
  const [openAlta] = useState(false)
  const [datos2, setDatos2] = useState<any | null>(null)
  const [final] = useState<FinalValues>({
    contexto: '',
    correos: [],
    asunto: '',
    fecha: '',
    hora: '',
    firma: ''
  })
  const [hosting, setHosting] = useState<any | null>(null)
  const [venta, setVenta] = useState<any | null>(null)
  const [producto, setProducto] = useState<any | null>(null)
  const [idVenta, setidVenta] = useState<any | null>(null)
  const [openFinal, setOpenFinal] = useState(false)
  const [, setopenAlta] = useState(false)
  const [colaboradores, setColaboradores] = useState([])
  const [usuarios, setUsuarios] = useState([])
  const [, setLimite] = useState(0)
  const [openAntecedente, setOpenAntecedemte] = useState({ estado: false, avance: null })

  const getUsuarios = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getUsuarios`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setColaboradores(request.data)
  }

  const getUsuarios2 = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getColaboradores`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setUsuarios(request.data)
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
  // dataUpdatedWeb

  const getOneBrief = async (): Promise<void> => {
    try {
      const request = await axios.get(`${Global.url}/getOneHost/${id ?? ''}`, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      })

      const request2 = await axios.get(`${Global.url}/getOneAntecenteHosting/${id ?? ''}`, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      })
      setProducto(request.data[0])
      setAntecedentes(request2.data)
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

      const requestVenta = await axios.get(`${Global.url}/indexWhereHosting/${id ?? ''}`, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      })
      setVenta(requestVenta.data)
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
    getUsuarios2()
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
          <PlanHosting
            venta = {venta}
            setAvance={setAvance}
            setOpenAvance={setOpenAvance}
            arrayAvances={arrayAvances}
            arrayObsequios={arrayObsequios}
            setOpenAntecedemte={setOpenAntecedemte}
            antecedentes={antecedentes}
            idVenta={idVenta}
            hostingactivo={hostingactivo}
            hosting={hosting}
            setHosting={setHosting}
            colaboradores={colaboradores}
            usuarios={usuarios}
            datos={datos}
            datos2={datos2}
            errors={errors}
            handleBlur={handleBlur}
            handleChange={handleChange}
            handleSubmit={handleSubmit}
            touched={touched}
            values={values}
            getDatos={getOneBrief}
            producto={producto}
          />
          <ViewAvance
            open={openAntecedente}
            setOpen={setOpenAntecedemte}
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
          <ViewObsequios
            open={openAvance}
            setOpen={setOpenAvance}
            avance={avance}
            getData={getOneBrief}
            datos={datos}
            arrayAvances={[]}
            setArrayAvances={setArrayAvances}
          />
        </>
      )}
    </>
  )
}
