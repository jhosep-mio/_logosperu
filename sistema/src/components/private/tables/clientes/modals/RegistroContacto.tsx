/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { Dialog, DialogContent } from '@mui/material'
import { type Dispatch, type SetStateAction, useState, useEffect } from 'react'
import {
  type arrayContacto,
  type contactoClientes
} from '../../../../shared/schemas/Interfaces'
import { useFormik } from 'formik'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import useAuth from '../../../../../hooks/useAuth'
import { SchemaContactoClientes } from '../../../../shared/schemas/Schemas'
import { Errors } from '../../../../shared/Errors'
import { v4 as uuidv4 } from 'uuid'
import { TitleBriefs } from '../../../../shared/TitleBriefs'

export const RegistroContacto = ({
  open,
  setOpen,
  id,
  arrayContacto,
  setarrayConacto,
  getOneBrief,
  datos
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  id: string | undefined
  arrayContacto: arrayContacto[]
  setarrayConacto: Dispatch<SetStateAction<arrayContacto[]>>
  getOneBrief: () => Promise<void>
  datos: any
}): JSX.Element => {
  const [loading, setLoading] = useState(false)
  const { setShowError } = useAuth()
  const token = localStorage.getItem('token')

  const savePreventa = async (values: contactoClientes): Promise<void> => {
    // Create a copy of the existing array
    const updatedArray = [...arrayContacto]
    // Add the new contact to the copy
    const newContact = {
      id: uuidv4(),
      nombres: values.nombres,
      celular: values.celular,
      correo: values.correo,
      marca: values.marca,
      dni_ruc: values.dni_ruc,
      tipo_documento: values.tipo_documento,
      created_at: new Date().toISOString()
    }
    updatedArray.push(newContact)
    // Update the state with the new array
    setarrayConacto(updatedArray)
    const data = new FormData()
    data.append('arraycontacto', JSON.stringify(updatedArray))
    data.append('_method', 'PUT')

    try {
      const respuesta = await axios.post(
        `${Global.url}/updateContacto/${id ?? ''}`,
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
        setShowError({
          estado: 'success',
          texto: 'Contacto guardado'
        })
        getOneBrief()
        resetForm()
        setOpen(false)
      } else {
        setShowError({
          estado: 'warning',
          texto: 'Error al guardar contacto'
        })
      }
    } catch (error) {
      console.log(error)
      setShowError({
        estado: 'error',
        texto: 'Error al guardar contacto'
      })
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
    isSubmitting,
    setValues,
    resetForm
  } = useFormik({
    initialValues: {
      nombres: '',
      celular: '',
      correo: '',
      marca: '',
      dni_ruc: '',
      tipo_documento: ''
    },
    validationSchema: SchemaContactoClientes,
    onSubmit: savePreventa
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

  useEffect(() => {
    setValues({
      ...values,
      nombres: `${datos.nombres} ${datos.apellidos}`,
      celular: datos.celular,
      correo: datos.email,
      marca: '',
      dni_ruc: '',
      tipo_documento: ''
    })
  }, [])

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false)
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className=""
      maxWidth="xl"
    >
      <DialogContent className="w-[700px]">
        <form className="mt-8 w-full" onSubmit={handleSubmit}>
          <div className="mb-4 w-full flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full">
              <TitleBriefs titulo="Nombres" />
              <input
                type="text"
                autoComplete="off"
                className="w-full py-3 px-4 rounded-xl outline-none bg-transparent border border-gray-300 text-gray-500 group"
                placeholder="Nombres"
                name="nombres"
                value={values.nombres}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={false}
              />
              <Errors errors={errors.nombres} touched={touched.nombres} />
            </div>
            <div className="relative w-full">
              <TitleBriefs titulo="Marca / Empresa" />
              <input
                type="text"
                autoComplete="off"
                className="w-full py-3 px-4 rounded-xl outline-none bg-transparent border border-gray-300 text-gray-500 group"
                placeholder="Marca"
                name="marca"
                value={values.marca}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={false}
              />
              <Errors errors={errors.marca} touched={touched.marca} />
            </div>
          </div>
          <div className="mb-4 w-full flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full">
              <TitleBriefs titulo="Celular" />
              <input
                type="text"
                autoComplete="off"
                className="w-full py-3 px-4 rounded-xl outline-none bg-transparent border border-gray-300 text-gray-500 group"
                placeholder="Celular"
                name="celular"
                value={values.celular}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={false}
              />
              <Errors errors={errors.celular} touched={touched.celular} />
            </div>
            <div className="relative w-full">
              <TitleBriefs titulo="Correo" />
              <input
                type="text"
                autoComplete="off"
                className="w-full py-3 px-4 rounded-xl outline-none bg-transparent border border-gray-300 text-gray-500 group"
                placeholder="Correo"
                name="correo"
                value={values.correo}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={false}
              />
              <Errors errors={errors.correo} touched={touched.correo} />
            </div>
          </div>
          <div className="mb-4 w-full flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative w-full">
              <TitleBriefs titulo="Tipo de documento" />
              <select
                  className="w-full py-3 px-4 rounded-xl outline-none bg-transparent border border-gray-300 text-gray-500 group"
                  name="tipo_documento"
                  value={values.tipo_documento}
                  onChange={handleChange}
                  onBlur={handleBlur}
                >
                  {/* FB GOOGLE, VENTAS, POST VENTA, RECOMENDACION, ISNTAGRAM) */}
                  <option value="">Seleccionar</option>
                  <option value="DNI">DNI</option>
                  <option value="RUC">RUC</option>
                </select>
                <Errors
                  errors={errors.tipo_documento}
                  touched={touched.tipo_documento}
                />
            </div>
            <div className="relative w-full">
              <TitleBriefs titulo="Numero de documento" />
              <input
                type="text"
                autoComplete="off"
                className="w-full py-3 px-4 rounded-xl outline-none bg-transparent border border-gray-300 text-gray-500 group"
                placeholder="DNI / RUC"
                name="dni_ruc"
                value={values.dni_ruc}
                onChange={handleChange}
                onBlur={handleBlur}
                disabled={false}
              />
              <Errors errors={errors.dni_ruc} touched={touched.dni_ruc} />
            </div>
          </div>
          <div className="-full mt-10">
            {!loading
              ? (
              <button
                type="submit"
                className="bg-main text-white w-full py-3 px-4 rounded-full hover:bg-main_dark transition-colors"
              >
                Registrar contacto
              </button>
                )
              : (
              <button
                type="button"
                className="bg-main_dark text-white w-full py-3 px-4 rounded-full hover:bg-main_dark transition-colors"
              >
                Validando...
              </button>
                )}
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
