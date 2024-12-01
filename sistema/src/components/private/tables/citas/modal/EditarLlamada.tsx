import { useEffect, useState } from 'react'
import { useFormik } from 'formik'
import Swal from 'sweetalert2'
import axios from 'axios'
import useAuth from '../../../../../hooks/useAuth'
import {
  type ValuesPreventaModificate,
  type historialValues
} from '../../../../shared/schemas/Interfaces'
import { Global } from '../../../../../helper/Global'
import { SchemaLlamadas } from '../../../../shared/schemas/Schemas'
import { Loading } from '../../../../shared/Loading'
import { logo } from '../../../../shared/Images'
import { TitleBriefs } from '../../../../shared/TitleBriefs'
import { Errors } from '../../../../shared/Errors'
import { Dialog, DialogContent } from '@mui/material'
import { type Dispatch, type SetStateAction } from 'react'
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import es from 'date-fns/locale/es'
import { getData2 } from '../../../../shared/FetchingData'

export const EditarLlamada = ({
  open,
  id,
  setSelectectId,
  setOpen,
  setProductos,
  setTotal
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  setProductos: Dispatch<SetStateAction<ValuesPreventaModificate[]>>
  setSelectectId: Dispatch<SetStateAction<number>>
  setTotal: Dispatch<SetStateAction<number>>
  id: number
}): JSX.Element => {
  const { setTitle } = useAuth()
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(false)
  registerLocale('es', es)
  setDefaultLocale('es')

  const getOneBrief = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/showhistorial/${id ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      }
    )
    setValues({
      ...values,
      id: request.data.id,
      id_cliente: request.data.id_cliente,
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      nombres: `${request.data.nombres} ${request.data.apellidos}`,
      apellidos: request.data.apellidos,
      celular: request.data.celular,
      duracion: request.data.duracion,
      evento: request.data.evento,
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      created_at: new Date(request.data.created_at) // Parsea la cadena a un objeto de fecha
    })
    setLoading(false)
  }

  const savePreventa = async (values: historialValues): Promise<void> => {
    setLoading(true)
    const token = localStorage.getItem('token')
    const data = new FormData()
    data.append('id_cliente', values.id_cliente)
    data.append('evento', values.evento)
    const created = new Date(values.created_at)
    const offset = created.getTimezoneOffset()
    const correctedDate = new Date(created.getTime() - offset * 60 * 1000)
    data.append('created_at', correctedDate.toISOString())
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(`${Global.url}/updateHistorial/${id ?? ''}`, data, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })
      if (respuesta.data.status == 'success') {
        setSelectectId(0)
        resetForm()
        getData2('getHistorial', setProductos, setTotal)
        // resetForm()
        setOpen(false)
        Swal.fire('Actualizado correctamente', '', 'success')
      } else {
        Swal.fire('Error al agregar el registro', '', 'error')
      }
    } catch (error) {
      Swal.fire('Error al agregar el registro', '', 'error')
      setLoading(true)
    }
    setLoading(false)
  }

  const {
    handleSubmit,
    handleChange,
    errors,
    setValues,
    values,
    resetForm,
    touched,
    handleBlur,
    isSubmitting
  } = useFormik({
    initialValues: {
      id: '',
      id_cliente: '',
      nombres: '',
      apellidos: '',
      celular: '',
      duracion: '',
      evento: '',
      created_at: ''
    },
    validationSchema: SchemaLlamadas,
    onSubmit: savePreventa
  })

  useEffect(() => {
    setTitle('Editar cliente')
  }, [])

  useEffect(() => {
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

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false)
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description "
      className="modal_opciones2"
    >
      <DialogContent className="shadow-2xl shadow-slate-950 w-[700px] bg-white overflow-hidden">
        <>
          <div className="">
            {loading
              ? (
              <Loading />
                )
              : (
              <div className="card">
                <form
                  className="flex flex-col bg-white rounded-md mt-4 p-4 md:p-10 relative"
                  onSubmit={handleSubmit}
                >
                  <img
                    src={logo}
                    alt=""
                    className="mx-auto w-[50%] px-4 md:px-0 md:w-48"
                  />

                  <div className="flex w-full mt-5 md:mt-5 flex-col">
                    <div className="w-full flex flex-col text-white">
                      <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-end gap-2 lg:gap-5">
                        <div className="w-full flex flex-col md:flex-row gap-2 lg:gap-5">
                          <div className="w-full md:w-full">
                            <TitleBriefs titulo="Cliente" />
                            <input
                              className="border placeholder-gray-400 focus:outline-none
                                                        focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                        border-gray-300 rounded-md transition-all text-center"
                              name="nombres"
                              type="text"
                              value={values.nombres}
                              disabled={true}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-end gap-2 lg:gap-5">
                        <div className="w-full flex flex-col gap-3 md:flex-row">
                          <div className="w-full md:w-full relative h-fit">
                            <TitleBriefs titulo="Tipo de Evento" />
                            <input
                              className="border placeholder-gray-400 focus:outline-none
                                                        focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                        border-gray-300 rounded-md transition-all"
                              name="evento"
                              type="text"
                              value={values.evento}
                              disabled={false}
                              onChange={(e) => {
                                handleChange(e)
                              }}
                              onBlur={(e) => {
                                handleBlur(e)
                              }}
                            />
                            <Errors
                              errors={errors.evento}
                              touched={touched.evento}
                            />
                          </div>
                        </div>
                      </div>
                      <div className="w-full md:w-full relative h-fit px-3 mt-3">
                        <TitleBriefs titulo="Fecha y Hora" />
                            <DatePicker
                            selected={values.created_at}
                            onChange={async (date: any) =>
                              await setValues({ ...values, created_at: date })
                            }
                            showTimeSelect
                            locale="es" // Añade la localización en español
                            timeFormat="HH:mm"
                            dateFormat="MMMM d, yyyy h:mm aa"
                            className="border placeholder-gray-400 focus:outline-none text-black focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white border-gray-300 rounded-md transition-all"
                            />
                        <Errors
                          errors={errors.created_at}
                          touched={touched.created_at}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex w-full justify-end gap-3 rounded-md text-black mt-5">
                    <button
                      type='button'
                      onClick={(e) => { e.preventDefault(); setOpen(false) }}
                      className="bg-red-600 px-3 py-2 rounded-md text-white cursor-pointer"
                    >
                      Cancelar
                    </button>
                    <input
                      type="submit"
                      className="bg-secondary-150 px-3 py-2 text-white rounded-md cursor-pointer"
                      value="Registrar"
                    />
                  </div>
                </form>
              </div>
                )}
          </div>
        </>
      </DialogContent>
    </Dialog>
  )
}
