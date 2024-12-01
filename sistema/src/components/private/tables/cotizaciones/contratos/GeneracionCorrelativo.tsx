/* eslint-disable @typescript-eslint/explicit-function-return-type */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import React, {
  type Dispatch,
  type SetStateAction,
  useEffect,
  useState
} from 'react'
import { Link } from 'react-router-dom'
import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slide from '@mui/material/Slide'
import { type TransitionProps } from '@mui/material/transitions'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import {
  type ListcotizacionValues,
  type ValuesPlanes,
  type arrayContacto
} from '../../../../shared/schemas/Interfaces'
import { useFormik } from 'formik'
import { SchemaValidarVentas } from '../../../../shared/schemas/Schemas'
import { LoadingSmall } from '../../../../shared/LoadingSmall'
import { TitleBriefs } from '../../../../shared/TitleBriefs'
import { Errors } from '../../../../shared/Errors'
import { ModalContratos } from './ModalContratos'
import { Loading } from '../../../../shared/Loading'
import { toast } from 'sonner'

const Transition = React.forwardRef(function Transition (
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

interface valuesVentasTO {
  id: number
  nombres: string
  apellidos: string
  medio_ingreso: string
  nombre_empresa: string
  empresa: string
  plan: string
  id_contrato: string
  dni_ruc: string
  id_cliente: string
  nombre_cliente: string
  arraycontacto: string
}

interface valuesInterface {
  open: boolean
  datos: valuesVentasTO
  planes: ValuesPlanes[]
  setOpen: Dispatch<SetStateAction<boolean>>
  getCotizaciones: any
  setIdContrato: Dispatch<SetStateAction<string | null>>
  selectedItem: ListcotizacionValues | null
  setSelectedItem: Dispatch<SetStateAction<ListcotizacionValues | null>>
}

export const GeneracionCorrelativo = ({
  open,
  datos,
  planes,
  setOpen,
  setSelectedItem
}: valuesInterface): JSX.Element => {
  const token = localStorage.getItem('token')
  const [loadingValidacion, seLoadingValidation] = useState(false)
  const [abrirPlan, setAbrirPlan] = useState(false)
  const [arrayContacto, setarrayConacto] = useState<arrayContacto[]>([])
  const [loading, setLoading] = useState(false)
  const [, setpersonContact] = useState<string | null>(null)
  const [, setDuplicateCode] = useState<boolean>(false)
  const limpiar = (): void => {
    resetForm()
  }
  const [pdfUrl, setPdfUrl] = useState<any | null>(null)

  const generarVenta = async (): Promise<void> => {

  }
  const handleClose = (): void => {
    setOpen(false)
    setSelectedItem(null)
    setPdfUrl(null)
    resetForm()
    setAbrirPlan(false)
  }

  const generarCodigo = async (plan: string): Promise<string | null> => {
    seLoadingValidation(true)
    setDuplicateCode(false)
    try {
      const data = new FormData()
      data.append('plan', plan)
      const request = await axios.post(`${Global.url}/generarCodigoToContrato`, data, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })

      if (request.data.status == 'success') {
        return request.data.codigo
      } else {
        return null
      }
    } catch (error) {
      console.log(error)
      return null
    } finally {
      seLoadingValidation(false)
    }
  }

  const sumarPreciosTotales = (adicionales: any): string => {
    let total = 0
    adicionales.forEach((item: any) => {
      total += parseFloat(item.total)
    })
    return total.toFixed(2)
  }

  const {
    handleSubmit,
    handleChange,
    setValues,
    resetForm,
    errors,
    values,
    touched,
    handleBlur
  } = useFormik({
    initialValues: {
      id: 0,
      medio_ingreso: '',
      nombre_empresa: '',
      plan: '',
      id_contrato: '',
      dni_ruc: '',
      id_cliente: '',
      nombre_cliente: '',
      cotizacion: ''
    },
    validationSchema: SchemaValidarVentas,
    onSubmit: generarVenta
  })

  useEffect(() => {
    async function fetchData () {
      if (open) {
        try {
          // @ts-expect-error
          const cotizacion = datos?.cotizacion ? JSON.parse(datos?.cotizacion) : ''
          const GenerateCodigo = await generarCodigo(cotizacion.correlativo_simple)
          let totalfinal: any = 0
          const totalAdicional = cotizacion.adicionales
            ? sumarPreciosTotales(cotizacion.adicionales)
            : 0
          totalfinal = ((Number(totalAdicional) + Number(cotizacion.precio)) - cotizacion.descuento).toFixed(2)
          setValues({
            ...values,
            id: datos?.id,
            medio_ingreso: datos?.medio_ingreso,
            nombre_empresa: cotizacion.nombre_empresa,
            plan: datos?.plan,
            id_contrato: GenerateCodigo ?? '',
            dni_ruc: datos?.dni_ruc,
            nombre_cliente: `${datos?.nombres} ${datos?.apellidos}`,
            id_cliente: datos?.id_cliente,
            // @ts-expect-error
            descripcion: datos?.descripcion,
            precio: totalfinal ?? 0,
            cotizacion
          })
          setarrayConacto(
            datos?.arraycontacto ? JSON.parse(datos?.arraycontacto) : []
          )
        } catch (error) {
          console.error('Error fetching data: ', error)
        }
      }
    }

    fetchData()
  }, [open, datos])

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        maxWidth={pdfUrl ? 'xl' : 'md'}
        aria-describedby="alert-dialog-slide-description"
        className="w-screen p-0 m-0"
      >
        <section className={`grid ${pdfUrl ? 'grid-cols-2' : 'grid-cols-1'}  gap-10`}>
            {values.id_contrato
              ? <ModalContratos personContact={''} datos={values} setPdfUrl={setPdfUrl} pdfUrl={pdfUrl} setLoading={setLoading} loading={loading}/>
              : <div className='w-full'>
                <DialogTitle className="text-center">{'Generar venta'}</DialogTitle>
                <DialogContent className="w-full md:w-96 max-h-[500px] p-0">
                <DialogContentText
                    id="alert-dialog-slide-description"
                    className="w-full p-0 m-0"
                >
                    {loadingValidacion
                      ? <LoadingSmall />
                      : (
                    <form
                        className="flex flex-col gap-5 w-full"
                        onSubmit={handleSubmit}
                    >
                        {!abrirPlan
                          ? <>
                            <div className="w-full  lg:relative pt-5">
                            <TitleBriefs titulo=" Nombres/Empresa" />
                            <select
                                className="border placeholder-gray-400 max-w-full focus:outline-none overflow-hidden
                                                focus:border-black w-full pr-4 h-12 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                border-gray-300 rounded-md transition-all outline-none"
                                name="nombre_empresa"
                                value={values.nombre_empresa}
                                onChange={(e) => {
                                  if (arrayContacto && arrayContacto.length > 0) {
                                    const selectedContact = arrayContacto.find(
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-expect-error
                                      (contacto: ListcontactoClientes) =>
                                        contacto.nombres === e.target.value
                                    )
                                    setpersonContact(
                                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                    // @ts-expect-error
                                      selectedContact ? selectedContact.id : null
                                    )
                                  }
                                  handleChange(e)
                                }}
                                onBlur={handleBlur}
                                disabled={false}
                            >
                                <option value=''>
                                    ----SELECCIONAR ----
                                </option>
                                {datos?.empresa && (
                                <option value={datos?.empresa}>
                                    {datos?.empresa}
                                </option>
                                )}
                                {values?.nombre_cliente && (
                                <option value={values?.nombre_cliente}>
                                    {values?.nombre_cliente}
                                </option>
                                )}
                                {arrayContacto &&
                                arrayContacto.length > 0 &&
                                arrayContacto.map(
                                // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                                // @ts-expect-error
                                  (contacto: ListcontactoClientes) => (
                                    <option
                                        value={contacto.nombres}
                                        key={contacto.id}
                                    >
                                        {contacto.nombres} - {contacto.marca}
                                    </option>
                                  )
                                )}
                            </select>
                            <Errors
                                errors={errors.nombre_empresa}
                                touched={touched.nombre_empresa}
                            />
                            </div>
                            <div className="w-full  lg:relative mt-2">
                            <TitleBriefs titulo="Medio de ingreso" />
                            <select
                                className="border placeholder-gray-400 focus:outline-none
                                                                                focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                                                border-gray-300 rounded-md transition-all"
                                name="medio_ingreso"
                                value={values.medio_ingreso}
                                onChange={handleChange}
                                onBlur={handleBlur}
                            >
                                {/* FB GOOGLE, VENTAS, POST VENTA, RECOMENDACION, ISNTAGRAM) */}
                                <option value="">Seleccionar</option>
                                <option value="0">Facebook</option>
                                <option value="4">Whatsapp</option>
                                <option value="1">Google</option>
                                <option value="5">Instagram</option>
                                {/* <option value="2">Ventas</option> */}
                                <option value="3">Post Venta</option>
                                <option value="6">Recomendación</option>
                                <option value="7">Logos</option>
                            </select>
                            <Errors
                                errors={errors.medio_ingreso}
                                touched={touched.medio_ingreso}
                            />
                            </div>
                            <div className="w-full  lg:relative mt-2">
                            <TitleBriefs titulo=" DNI/RUC (Opcional)" />
                            <input
                                className="border placeholder-gray-400 focus:outline-none
                                                focus:border-black w-full pr-4 h-12 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                border-gray-300 rounded-md transition-all"
                                name="dni_ruc"
                                type="text"
                                value={values.dni_ruc}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                disabled={false}
                            />
                            <Errors
                                errors={errors.dni_ruc}
                                touched={touched.dni_ruc}
                            />
                            </div>
                            <div className="w-full  lg:relative mt-2">
                            <TitleBriefs titulo="Plan" />
                            <button
                                className="border placeholder-gray-400 focus:outline-none
                                                                                focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                                                border-gray-300 rounded-md transition-all"
                                onClick={() => {
                                  if (values.medio_ingreso && values.nombre_empresa && values.dni_ruc) {
                                    setAbrirPlan(true)
                                  } else {
                                    toast.warning('Complete todos los datos')
                                  }
                                }}
                            >
                                {values.plan ? values.plan : 'Seleccionar'}
                            </button>
                            {/* <Errors errors={errors.plan} touched={touched.plan} /> */}
                            </div>
                        </>
                          : (
                        <div className="w-full lg:relative mt-2 ">
                            <TitleBriefs titulo="Seleecionar plan" />
                            <div className="grid grid-cols-1 md:grid-cols-1 gap-2 items-center mb-0 p-4 cursor-pointer">
                            {planes.map((plan) => (
                                <p
                                key={plan.id}
                                className="line-clamp-2 text-black text-center w-full border-2 py-1 rounded-xl"
                                onClick={() => {
                                  generarCodigo(plan.codigo)
                                }}
                                >
                                {plan.nombre}
                                </p>
                            ))}
                            </div>
                        </div>
                            )}
                        <div className="flex w-full justify-end gap-3 rounded-md text-black ">
                        <Link
                            to="#"
                            className="bg-red-600 px-3 py-2 rounded-md text-white cursor-pointer"
                            onClick={() => {
                              handleClose()
                              limpiar()
                              setAbrirPlan(false)
                            }}
                        >
                            Cancelar
                        </Link>
                        </div>
                    </form>
                        )}
                </DialogContentText>
                </DialogContent>
            </div>
            }
            <div className='w-full h-full relative'>
                {loading && pdfUrl
                  ? <Loading />
                  : !loading && pdfUrl && <>
                    <iframe
                    src={pdfUrl}
                    title="PDF Viewer"
                    className="w-full h-full border-none"
                    />
                </>
                }
            </div>
        </section>
      </Dialog>

    </>
  )
}
