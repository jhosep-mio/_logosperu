/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/naming-convention */
import { useFormik } from 'formik'
import { useState } from 'react'
import { SchemaCupon } from '../../../../shared/schemas/Schemas'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import { toast } from 'sonner'
import { Errors2 } from '../../../../shared/Errors2'
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '../../../../../shadcnui/ui/Dialog'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'

export const RegistroCupones = ({ id_cliente }: any): any => {
  const [Loading, setLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const GenerarCupon = async (): Promise<void> => {
    if (!id_cliente) return
    if (values.descuento <= 0) {
      toast.warning('El descuento debe ser mayor a 0')
      return
    }
    setLoading(true)
    const data = new FormData()
    data.append('id_cliente', id_cliente)
    data.append('descuento', String(values.descuento))
    data.append('fecha', String(values.fecha))
    try {
      const response = await axios.post(`${Global.url}/cuponesWebs/store`, data, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      if (response.data.status === 'success') {
        const codigoGenerado: any = response.data.codigo
        Swal.fire({
          title: `Cupón: ${codigoGenerado ?? ''}`,
          icon: 'success',
          confirmButtonText: 'Aceptar'
        })
        navigate('/admin/lista-cupones')
        setIsOpen(false)
      } else {
        toast.error('Error al generar cupón')
      }
      resetForm()
    } catch (error: unknown) {
      console.log(error)
      toast.error('Error al generar cupón')
    } finally {
      setLoading(false)
    }
  }
  const { handleSubmit, handleChange, errors, values, touched, handleBlur, resetForm } = useFormik({
    initialValues: {
      descuento: 0,
      fecha: ''
    },
    validationSchema: SchemaCupon,
    onSubmit: GenerarCupon
  })

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger className="rounded-lg transition-colors text-gray-300 hover:bg-secondary-900 flex justify-center items-center gap-x-4 p-2 flex-1">
        Crear cupón
      </DialogTrigger>
      <DialogContent className="bg-white">
        <DialogTitle className="text-center w-full block text-black font-bold">GENERAR CUPÓN</DialogTitle>
        <DialogDescription>
          <form className="flex flex-col bg-white rounded-md relative p-4 text-black" onSubmit={handleSubmit}>
            <div className="w-full relative pb-5">
              <label className="text-sm font-medium leading-none" htmlFor="descuento">
                Descuento
              </label>
              <input
                className="flex h-9 w-full rounded-md border border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm"
                name="descuento"
                type="number"
                value={values.descuento}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors2 errors={errors.descuento} touched={touched.descuento} />
            </div>
            <div className="w-full relative pb-5">
              <label className="text-sm font-medium leading-none" htmlFor="fecha">
                Fecha
              </label>
              <input
                className="flex h-9 w-full rounded-md border border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm"
                name="fecha"
                type="date"
                value={values.fecha}
                onChange={handleChange}
                onBlur={handleBlur}
              />
              <Errors2 errors={errors.fecha} touched={touched.fecha} />
            </div>
            <div className="h-fit flex w-full justify-end items-center gap-3 rounded-md text-black">
              {!Loading
                ? (
                <input
                  type="submit"
                  className="bg-secondary-150 hover:bg-secondary-150/70 px-3 py-2 text-white rounded-md cursor-pointer"
                  value="Generar Cupón"
                />
                  )
                : (
                <input type="button" disabled className="bg-secondary-150/70 px-3 py-2 text-white rounded-md cursor-pointer" value="Cargando..." />
                  )}
            </div>
          </form>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}
