/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Dialog } from '@mui/material'
import Slide from '@mui/material/Slide'
import React, { useEffect, useState } from 'react'
import { v4 as uuidv4 } from 'uuid'
import { type TransitionProps } from '@mui/material/transitions'
import { useFormik } from 'formik'
import { SchemaSoporteHosting } from '../../../shared/schemas/Schemas'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { toast } from 'sonner'
import { Errors2 } from '../../../shared/Errors2'
import useAuth from '../../../../hooks/useAuth'
import Swal from 'sweetalert2'
const Transition = React.forwardRef(function Transition (
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})
export const ModalRegistro = ({ open, setOpen, getSoporteHosting }: any): JSX.Element => {
  const [loading, setLoading] = useState(false)
  const { auth } = useAuth()

  const registrarReporte = async (values: any): Promise<void> => {
    setLoading(true)
    const token = localStorage.getItem('token')
    const data = new FormData()
    const peruTime = new Date().toLocaleString('es-PE', { timeZone: 'America/Lima' })
    const soporte = {
      id: uuidv4(),
      id_user: auth.id,
      colaborador: auth.name,
      horas: values.horas,
      contexto: values.contexto,
      fecha: peruTime
    }
    data.append('soporte', soporte ? JSON.stringify(soporte) : '')
    data.append('email', open.email ?? 'desarrollo4@logosperu.com')
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(`${Global.url}/registerSoporte/${open.id ?? ''}`, data, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })
      if (respuesta.data.status == 'success') {
        resetForm()
        getSoporteHosting()
        setOpen(false)
        toast.success('Soporte registrado correctamente')
        const enviarNotificacion = async (): Promise<void> => {
          const data = new FormData()
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          const pathName = `/admin/lista-hosting/avances/${open.id ?? ''}`
          data.append('id_usuario', auth.id)
          data.append('id_venta', String(open.id))
          data.append('nombre', auth.name)
          data.append('icono', 'correo')
          data.append('hidden_users', '[]')
          data.append('url', pathName)
          data.append(
            'contenido',
            `Ha realizado soporte para el proyecto ${
              open?.nombre_empresa ?? ''
            }  (${open?.nombre_cliente ?? ''})`
          )
          try {
            await axios.post(`${Global.url}/nuevaNotificacionHosting`, data, {
              headers: {
                Authorization: `Bearer ${
                  token !== null && token !== '' ? token : ''
                }`
              }
            })
          } catch (error: unknown) {
            console.log(error)
            Swal.fire('Error al subir', '', 'error')
          }
        }
        enviarNotificacion()
      }
    } catch (error) {
      console.log(error)
      toast.error('Error al guardar los datos')
    } finally {
      setLoading(false)
    }
  }

  const {
    handleSubmit,
    handleChange,
    errors,
    resetForm,
    values,
    touched,
    handleBlur,
    isSubmitting
  } = useFormik({
    initialValues: {
      horas: '',
      contexto: ''
    },
    validationSchema: SchemaSoporteHosting,
    onSubmit: registrarReporte
  })

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
      open={open?.estado}
      TransitionComponent={Transition}
      keepMounted
      onClose={() => setOpen({ estado: false, id: null })}
      aria-describedby="alert-dialog-slide-description"
      className="moda_registro"
      maxWidth={'md'}
    >
      <form action="" onSubmit={handleSubmit} className="bg-white w-full p-6">
        <h2 className='text-black font-bold w-full text-center mb-4 text-lg'>REGISTRAR SOPORTE</h2>
        <div className="w-full  relative pb-5">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="email"
          >
            Tiempo trabajado (En minutos)
          </label>
          <input
            className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
            name="horas"
            type="number"
            step="0.01"
            value={values.horas}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={false}
          />
          <Errors2 errors={errors.horas} touched={touched.horas} />
        </div>
        <div className="w-full  relative pb-5">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="email"
          >
            Detalle del soporte realizado
          </label>
          <textarea
            className="flex w-full resize-none h-[70px] rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
            name="contexto"
            value={values.contexto}
            onChange={handleChange}
            onBlur={handleBlur}
            disabled={false}
          ></textarea>
          <Errors2 errors={errors.contexto} touched={touched.contexto} />
        </div>
        <div className='w-full flex justify-center'>
            {!loading
              ? (
                <input
                type="submit"
                className="bg-secondary-150 px-3 py-2 text-white rounded-md cursor-pointer"
                value="Guardar"
                />
                )
              : (
                <input
                type="button"
                disabled
                className="bg-secondary-150/70 px-3 py-2 text-white rounded-md cursor-pointer"
                value="Cargando..."
                />
                )}
        </div>
      </form>
    </Dialog>
  )
}
