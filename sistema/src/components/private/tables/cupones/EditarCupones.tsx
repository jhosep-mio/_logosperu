/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/naming-convention */
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'sonner'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { SchemaCupon } from '../../../shared/schemas/Schemas'
import { Global } from '../../../../helper/Global'
import { Errors2 } from '../../../shared/Errors2'
import useAuth from '../../../../hooks/useAuth'
import { Loading } from '../../../shared/Loading'

export const EditarCupones = (): any => {
  const [loading, setLoading] = useState(true)
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const { setTitle } = useAuth()
  const navigate = useNavigate()
  const actualizarCupon = async (): Promise<void> => {
    if (values.estado != '0') {
      toast.warning('El cupón ya fue utilizado')
      return
    }
    if (values.descuento <= 0) {
      toast.warning('El descuento debe ser mayor a 0')
      return
    }
    setLoading(true)
    const data = new FormData()
    data.append('descuento', String(values.descuento))
    data.append('fecha', String(values.fecha))
    data.append('_method', 'PUT')
    try {
      const response = await axios.post(`${Global.url}/cuponesWebs/update/${id ?? ''}`, data, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      if (response.data.status === 'success') {
        navigate('/admin/lista-cupones')
        toast.success('Cupón actualizado correctamente')
      } else {
        toast.error('Error al actualizar cupón')
      }
    } catch (error: unknown) {
      console.log(error)
      toast.error('Error al actualizar cupón')
    } finally {
      setLoading(false)
    }
  }
  const { handleSubmit, handleChange, errors, values, touched, handleBlur, setValues } = useFormik({
    initialValues: {
      id_cliente: '',
      nombre_cliente: '',
      estado: '',
      descuento: 0,
      fecha: ''
    },
    validationSchema: SchemaCupon,
    onSubmit: actualizarCupon
  })

  const getCupon = async (): Promise<void> => {
    try {
      const response = await axios.get(`${Global.url}/cuponesWebs/getOne/${id ?? ''}`, {
        headers: {
          Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
        }
      })
      setValues({
        id_cliente: response.data.id_cliente,
        descuento: response.data.descuento,
        fecha: response.data.fecha,
        nombre_cliente: `${response.data.nombres} ${response.data.apellidos}`,
        estado: response.data.estado
      })
      console.log(response.data.fecha)
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    setTitle('Editar Cupón')
    getCupon()
  }, [])
  return (
    <>
      {!loading
        ? (
        <form className="flex flex-col bg-white rounded-md relative p-4 text-black mt-6" onSubmit={handleSubmit}>
          <div className="w-full relative pb-5">
            <label className="text-sm font-medium leading-none" htmlFor="descuento">
              Cliente
            </label>
            <input
              className="flex h-9 w-full rounded-md border border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm"
              name="nombre_cliente"
              disabled
              type="text"
              value={values.nombre_cliente}
              onChange={handleChange}
              onBlur={handleBlur}
            />
          </div>
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
            <Link to="/admin/lista-cupones" className="bg-red-500 hover:bg-red-500/70 px-3 py-2 text-white rounded-md cursor-pointer">
              Regresar
            </Link>
            {!loading
              ? (
              <input
                type="submit"
                className="bg-secondary-150 hover:bg-secondary-150/70 px-3 py-2 text-white rounded-md cursor-pointer"
                value="Actualizar Cupón"
              />
                )
              : (
              <input type="button" disabled className="bg-secondary-150/70 px-3 py-2 text-white rounded-md cursor-pointer" value="Cargando..." />
                )}
          </div>
        </form>
          )
        : (
        <Loading />
          )}
    </>
  )
}
