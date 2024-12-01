/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import axios from 'axios'
import { useState, useEffect } from 'react'
import { Global } from '../../../../../helper/Global'
import { useFormik } from 'formik'
import { SchemaValidateDesarrolloWeb } from '../../../../shared/schemas/Schemas'
import { Errors2 } from '../../../../shared/Errors2'
import { useParams } from 'react-router-dom'
import Swal from 'sweetalert2'
import { toast } from 'sonner'
export const ModalEditDesarrolloWeb = ({
  getOneBrief,
  open,
  setOpen,
  dataUpdatedWeb,
  datos
}: any): JSX.Element => {
  const [loading, setLoading] = useState(false)
  const { id } = useParams()
  const [correos, setCorreos] = useState<any | null>(null)
  const [constraseña, setConstraseña] = useState<any | null>(null)

  const SaveContrato = async (values: any): Promise<void> => {
    setLoading(true)
    const token = localStorage.getItem('token')
    const data = new FormData()
    data.append('data_web', JSON.stringify(values))
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/updateDataWeb/${id ?? ''}`,
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
        setOpen(false)
      } else {
        Swal.fire('Error al actualizar', '', 'error')
      }
    } catch (error: unknown) {
      Swal.fire('Error', '', 'error')
    } finally {
      setLoading(false)
    }
  }

  const {
    handleSubmit,
    handleChange,
    errors,
    isSubmitting,
    setValues,
    values,
    touched,
    handleBlur
  } = useFormik({
    initialValues: {
      dominio: '',
      domain_temp: '',
      cant_correos: '',
      domain_owner: '',
      hosting_owner: '',
      porcentaje_proyecto: '',
      internas: '',
      modulos: '',
      php: '',
      react: '',
      procesos: [],
      arrayCorreos: [],
      soporte: '',
      pasarela: '',
      id_hosting: ''
    },
    validationSchema: SchemaValidateDesarrolloWeb,
    onSubmit: SaveContrato
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
    if (open) {
      setValues({
        ...values,
        dominio: dataUpdatedWeb?.dominio,
        domain_temp: dataUpdatedWeb?.domain_temp,
        cant_correos: dataUpdatedWeb?.cant_correos,
        domain_owner: dataUpdatedWeb?.domain_owner,
        hosting_owner: dataUpdatedWeb?.hosting_owner,
        porcentaje_proyecto: dataUpdatedWeb?.porcentaje_proyecto,
        internas: dataUpdatedWeb?.internas,
        modulos: dataUpdatedWeb?.modulos,
        php: dataUpdatedWeb?.php,
        react: dataUpdatedWeb?.react,
        procesos: dataUpdatedWeb?.procesos,
        arrayCorreos: dataUpdatedWeb?.arrayCorreos ?? [],
        soporte: dataUpdatedWeb?.soporte ?? '',
        pasarela: dataUpdatedWeb?.pasarela ?? '',
        id_hosting: dataUpdatedWeb?.id_hosting ?? ''
      })
    }
  }, [open])

  const agregarFecha = async (): Promise<void> => {
    if (correos && constraseña) {
      // Actualizar el estado localmente
      const updatedFechas = values.arrayCorreos
        ? [...values.arrayCorreos, { correo: correos, contraseña: constraseña }]
        : [{ correo: correos, contraseña: constraseña }]
      // @ts-expect-error
      setValues({ ...values, arrayCorreos: updatedFechas })
      setCorreos('')
      setConstraseña('')
    } else {
      toast.error('Error al agregar fecha o precio')
    }
  }

  const eliminarCorreo = (index: number): any => {
    const updatedFechas = values.arrayCorreos.filter((_, i) => i !== index)
    setValues({ ...values, arrayCorreos: updatedFechas })
  }

  return (
    <div className="w-[30%] fixed right-0 z-[999] top-0 bottom-0 bg-secondary-100 shadow-sm shadow-black  rounded-md">
      <span
        className="absolute right-2 top-2 cursor-pointer text-white bg-red-600 rounded-full p-1 w-[25px] h-[25px] flex items-center justify-center text-sm"
        onClick={() => setOpen(false)}
      >
        X
      </span>
      <div className="py-6 px-4">
        <h2 className="w-full text-white text-center uppercase text-xl underline">
          EDICION{' '}
        </h2>
        <form
          className="flex flex-col bg-transparent rounded-md relative w-full"
          onSubmit={handleSubmit}
        >
          <div className="flex w-full flex-col">
            <div className="w-full flex flex-col text-white">
              <div className="mb-3 md:mb-0 w-full  rounded-md rounded-tl-none md:p-3 whiteflex flex-col items-end gap-0 lg:gap-x-5 lg:gap-y-0">
                {datos?.id_contrato.split('_')[0].includes('LPACTW') ||
                  datos?.id_contrato.split('_')[0].includes('LPACTWE')
                  ? (
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-0 lg:gap-3 mt-3 lg:mt-0">
                    <div className="w-full relative">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                      >
                        Nombre de dominio Principal
                      </label>
                      <input
                        className="h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                        name="dominio"
                        type="text"
                        value={values.dominio}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Errors2
                        errors={errors.dominio}
                        touched={touched.dominio}
                      />
                    </div>
                    <div className="w-full relative">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                      >
                        Hosting
                      </label>
                      <select
                        className="h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                        name="hosting_owner"
                        value={values.hosting_owner}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option className="text-black" value="">
                          Seleccionar
                        </option>
                        <option className="text-black" value="A2 Hosting">
                          A2 Hosting
                        </option>
                        <option className="text-black" value="BlueHosting">
                          BlueHosting
                        </option>
                        <option className="text-black" value="Reselhost">
                          Reselhost
                        </option>
                        <option className="text-black" value="Yachay">
                          Yachay
                        </option>
                        <option
                          className="text-black"
                          value="Hosting del cliente"
                        >
                          Hosting del cliente
                        </option>
                      </select>
                      <Errors2
                        errors={errors.hosting_owner}
                        touched={touched.hosting_owner}
                      />
                    </div>
                    <div className="w-full relative">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                      >
                        Alojamiento Dominio
                      </label>
                      <select
                        className="h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                        name="domain_owner"
                        value={values.domain_owner}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option className="text-black" value="">
                          Seleccionar
                        </option>
                        <option className="text-black" value="Godaddy">
                          Godaddy
                        </option>
                        <option className="text-black" value="Punto Pe">
                          Punto Pe
                        </option>
                        <option
                          className="text-black"
                          value="Dominio del cliente"
                        >
                          Dominio del cliente
                        </option>
                      </select>
                      <Errors2
                        errors={errors.domain_owner}
                        touched={touched.domain_owner}
                      />
                    </div>
                    <div className="w-full relative">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                      >
                        Porcentaje de proyecto (%)
                      </label>
                      <input
                        className="h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                        name="porcentaje_proyecto"
                        type="number"
                        value={values.porcentaje_proyecto}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Errors2
                        errors={errors.porcentaje_proyecto}
                        touched={touched.porcentaje_proyecto}
                      />
                    </div>
                    <div className="w-full relative">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                      >
                        Version de PHP
                      </label>
                      <select
                        className="h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                        name="php"
                        value={values.php}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option className="text-black" value="">
                          Seleccionar
                        </option>
                        <option className="text-black" value="5.6">
                          5.6
                        </option>
                        <option className="text-black" value="7.4">
                          7.4
                        </option>
                        <option className="text-black" value="8">
                          8
                        </option>
                        <option className="text-black" value="8.1">
                          8.1
                        </option>
                        <option className="text-black" value="8.2">
                          8.2
                        </option>
                        <option className="text-black" value="8.3">
                          8.3
                        </option>
                      </select>
                      <Errors2 errors={errors.php} touched={touched.php} />
                    </div>
                    <div className="w-full relative">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                      >
                        Version de REACT
                      </label>
                      <select
                        className="h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                        name="react"
                        value={values.react}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option className="text-black" value="">
                          Seleccionar
                        </option>
                        <option className="text-black" value="16">
                          16
                        </option>
                        <option className="text-black" value="17">
                          17
                        </option>
                        <option className="text-black" value="18">
                          18
                        </option>
                        <option className="text-black" value="Sin uso">
                          Sin uso
                        </option>
                      </select>
                      <Errors2 errors={errors.react} touched={touched.react} />
                    </div>
                  </div>
                    )
                  : datos?.id_contrato.split('_')[0] == 'LPCONC' ||
                  datos?.id_contrato.split('_')[0] == 'LPMGDOM'
                    ? (
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-0 lg:gap-3 mt-3 lg:mt-0">
                    <div className="w-full relative">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                      >
                        Nombre de dominio Principal
                      </label>
                      <input
                        className="h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                        name="dominio"
                        type="text"
                        value={values.dominio}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Errors2
                        errors={errors.dominio}
                        touched={touched.dominio}
                      />
                    </div>
                    <div className="w-full relative">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                      >
                        Hosting
                      </label>
                      <select
                        className="h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                        name="hosting_owner"
                        value={values.hosting_owner}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option className="text-black" value="">
                          Seleccionar
                        </option>
                        <option className="text-black" value="A2 Hosting">
                          A2 Hosting
                        </option>
                        <option className="text-black" value="BlueHosting">
                          BlueHosting
                        </option>
                        <option className="text-black" value="Reselhost">
                          Reselhost
                        </option>
                        <option className="text-black" value="Yachay">
                          Yachay
                        </option>
                        <option
                          className="text-black"
                          value="Hosting del cliente"
                        >
                          Hosting del cliente
                        </option>
                      </select>
                      <Errors2
                        errors={errors.hosting_owner}
                        touched={touched.hosting_owner}
                      />
                    </div>
                    <div className="w-full relative">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                      >
                        Alojamiento Dominio
                      </label>
                      <select
                        className="h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                        name="domain_owner"
                        value={values.domain_owner}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option className="text-black" value="">
                          Seleccionar
                        </option>
                        <option className="text-black" value="Godaddy">
                          Godaddy
                        </option>
                        <option className="text-black" value="Punto Pe">
                          Punto Pe
                        </option>
                        <option
                          className="text-black"
                          value="Dominio del cliente"
                        >
                          Dominio del cliente
                        </option>
                      </select>
                      <Errors2
                        errors={errors.domain_owner}
                        touched={touched.domain_owner}
                      />
                    </div>
                    {datos?.id_contrato.split('_')[0] == 'LPCONC' && (
                      <>
                        <div className="w-full relative">
                          <label
                            className="text-sm font-medium line-clamp-1 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="email"
                          >
                            Cantidad de correos
                          </label>
                          <input
                            className="h-9 w-full rounded-md border border-input mt-2 border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                            name="cant_correos"
                            type="number"
                            value={values.cant_correos}
                            onChange={handleChange}
                            onBlur={handleBlur}
                          />
                          <Errors2
                            errors={errors.cant_correos}
                            touched={touched.cant_correos}
                          />
                        </div>
                        <div className="w-full h-full col-span-2 flex gap-4 items-center justify-center relative">
                          <div className="flex flex-col w-full">
                            <input
                              className="h-9 w-full text-white rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                              name="correos"
                              type="email"
                              placeholder="Correo"
                              value={correos}
                              onChange={(e) => {
                                setCorreos(e.target.value)
                              }}
                            />
                            <input
                              className="h-9 w-full mt-3 text-white rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                              type="text"
                              placeholder="Contraseña"
                              value={constraseña}
                              onChange={(e) => {
                                setConstraseña(e.target.value)
                              }}
                            />
                          </div>
                          <input
                            type="button"
                            className="bg-main px-3 py-1  text-white rounded-md cursor-pointer"
                            value="Agregar"
                            onClick={async () => {
                              await agregarFecha()
                            }}
                          />
                        </div>
                      </>
                    )}
                    <div className="w-full col-span-2 mt-4 grid grid-cols-2 gap-4">
                      {values?.arrayCorreos &&
                        values?.arrayCorreos?.length > 0 &&
                        (values?.arrayCorreos).map((fechaData: any, index) => (
                          <div
                            key={index}
                            className="bg-transparent border w-full px-2 py-1 rounded-xl overflow-hidden relative"
                          >
                            <p
                              className="absolute top-1 right-2 text-red-500 hover:text-red-700 cursor-pointer"
                              onClick={() => eliminarCorreo(index)}
                            >
                              {' '}
                              X
                            </p>
                            <p className="font-medium w-full flex gap-2">
                              Email:{' '}
                              <span className="font-normal">
                                {fechaData.correo}
                              </span>
                            </p>
                            <p className="font-medium w-full flex gap-2">
                              Pass:{' '}
                              <span className="font-normal">
                                {fechaData.contraseña}
                              </span>
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                      )
                    : (
                  <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-0 lg:gap-3 mt-3 lg:mt-0">
                    <div className="w-full relative">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                      >
                        Nombre de dominio Temporal
                      </label>
                      <input
                        className="h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                        name="domain_temp"
                        type="text"
                        value={values.domain_temp}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Errors2
                        errors={errors.domain_temp}
                        touched={touched.domain_temp}
                      />
                    </div>
                    <div className="w-full relative">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                      >
                        Nombre de dominio Principal
                      </label>
                      <input
                        className="h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                        name="dominio"
                        type="text"
                        value={values.dominio}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Errors2
                        errors={errors.dominio}
                        touched={touched.dominio}
                      />
                    </div>
                    <div className="w-full relative">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                      >
                        Hosting
                      </label>
                      <select
                        className="h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                        name="hosting_owner"
                        value={values.hosting_owner}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option className="text-black" value="">
                          Seleccionar
                        </option>
                        <option className="text-black" value="A2 Hosting">
                          A2 Hosting
                        </option>
                        <option className="text-black" value="BlueHosting">
                          BlueHosting
                        </option>
                        <option className="text-black" value="Reselhost">
                          Reselhost
                        </option>
                        <option className="text-black" value="Yachay">
                          Yachay
                        </option>
                        <option
                          className="text-black"
                          value="Hosting del cliente"
                        >
                          Hosting del cliente
                        </option>
                      </select>
                      <Errors2
                        errors={errors.hosting_owner}
                        touched={touched.hosting_owner}
                      />
                    </div>
                    <div className="w-full relative">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                      >
                        Alojamiento Dominio
                      </label>
                      <select
                        className="h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                        name="domain_owner"
                        value={values.domain_owner}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option className="text-black" value="">
                          Seleccionar
                        </option>
                        <option className="text-black" value="Godaddy">
                          Godaddy
                        </option>
                        <option className="text-black" value="Punto Pe">
                          Punto Pe
                        </option>
                        <option
                          className="text-black"
                          value="Dominio del cliente"
                        >
                          Dominio del cliente
                        </option>
                      </select>
                      <Errors2
                        errors={errors.domain_owner}
                        touched={touched.domain_owner}
                      />
                    </div>
                    <div className="w-full relative">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                      >
                        Cantidad de correos corporativos
                      </label>
                      <input
                        className="h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                        name="cant_correos"
                        type="number"
                        value={values.cant_correos}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Errors2
                        errors={errors.cant_correos}
                        touched={touched.cant_correos}
                      />
                    </div>
                    <div className="w-full relative">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                      >
                        Cantidad de internas
                      </label>
                      <input
                        className="h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                        name="internas"
                        type="number"
                        value={values.internas}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Errors2
                        errors={errors.internas}
                        touched={touched.internas}
                      />
                    </div>
                    <div className="w-full relative">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                      >
                        Porcentaje de proyecto (%)
                      </label>
                      <input
                        className="h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                        name="porcentaje_proyecto"
                        type="number"
                        value={values.porcentaje_proyecto}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Errors2
                        errors={errors.porcentaje_proyecto}
                        touched={touched.porcentaje_proyecto}
                      />
                    </div>
                    {(datos.categoria_plan == 'administrable' ||
                      datos.categoria_plan == 'tienda') && (
                      <div className="w-full relative">
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="email"
                        >
                          Cant. Modulos Administrables
                        </label>
                        <input
                          className="h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                          name="modulos"
                          type="text"
                          value={values.modulos}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <Errors2
                          errors={errors.modulos}
                          touched={touched.modulos}
                        />
                      </div>
                    )}
                    {datos?.categoria_plan == 'tienda' && (
                      <div className="w-full relative">
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="email"
                        >
                          Pasarela de pago
                        </label>
                        <select
                          className="h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                          name="pasarela"
                          value={values.pasarela}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        >
                          <option className="text-black" value="">
                            Seleccionar
                          </option>
                          <option className="text-black" value="Mercado pago">
                            Mercado pago
                          </option>
                          <option className="text-black" value="Culqui">
                            Culqui
                          </option>
                          <option className="text-black" value="Izi Pay">
                            Izi Pay
                          </option>
                          <option className="text-black" value="Stripe">
                            Stripe
                          </option>
                          <option className="text-black" value="Sin uso">
                            Sin uso
                          </option>
                        </select>
                        <Errors2
                          errors={errors.pasarela}
                          touched={touched.pasarela}
                        />
                      </div>
                    )}
                    <div className="w-full relative">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                      >
                        Version de PHP
                      </label>
                      <select
                        className="h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                        name="php"
                        value={values.php}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option className="text-black" value="">
                          Seleccionar
                        </option>
                        <option className="text-black" value="5.6">
                          5.6
                        </option>
                        <option className="text-black" value="7.4">
                          7.4
                        </option>
                        <option className="text-black" value="8">
                          8
                        </option>
                        <option className="text-black" value="8.1">
                          8.1
                        </option>
                        <option className="text-black" value="8.2">
                          8.2
                        </option>
                        <option className="text-black" value="8.3">
                          8.3
                        </option>
                      </select>
                      <Errors2 errors={errors.php} touched={touched.php} />
                    </div>
                    <div className="w-full relative">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                      >
                        Version de REACT
                      </label>
                      <select
                        className="h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                        name="react"
                        value={values.react}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        <option className="text-black" value="">
                          Seleccionar
                        </option>
                        <option className="text-black" value="16">
                          16
                        </option>
                        <option className="text-black" value="17">
                          17
                        </option>
                        <option className="text-black" value="18">
                          18
                        </option>
                        <option className="text-black" value="Sin uso">
                          Sin uso
                        </option>
                      </select>
                      <Errors2 errors={errors.react} touched={touched.react} />
                    </div>
                    <div className="w-full relative">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                      >
                        Soporte tecnico (en meses)
                      </label>
                      <input
                        className="h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                        name="soporte"
                        type="number"
                        value={values.soporte}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Errors2
                        errors={errors.soporte}
                        touched={touched.soporte}
                      />
                    </div>
                    <div className="w-full h-full col-span-2 flex gap-4 items-center justify-center relative">
                      <div className="flex flex-col w-full">
                        <input
                          className="h-9 w-full text-white rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                          name="correos"
                          type="email"
                          placeholder="Correo"
                          value={correos}
                          onChange={(e) => {
                            setCorreos(e.target.value)
                          }}
                        />
                        <input
                          className="h-9 w-full mt-3 text-white rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                          type="text"
                          placeholder="Contraseña"
                          value={constraseña}
                          onChange={(e) => {
                            setConstraseña(e.target.value)
                          }}
                        />
                      </div>
                      <input
                        type="button"
                        className="bg-main px-3 py-1  text-white rounded-md cursor-pointer"
                        value="Agregar"
                        onClick={async () => {
                          await agregarFecha()
                        }}
                      />
                    </div>
                    <div className="w-full col-span-2 mt-4 grid grid-cols-2 gap-4">
                      {values?.arrayCorreos &&
                        values?.arrayCorreos?.length > 0 &&
                        (values?.arrayCorreos).map((fechaData: any, index) => (
                          <div
                            key={index}
                            className="bg-transparent border w-full px-2 py-1 rounded-xl overflow-hidden relative"
                          >
                            <p
                              className="absolute top-1 right-2 text-red-500 hover:text-red-700 cursor-pointer"
                              onClick={() => eliminarCorreo(index)}
                            >
                              {' '}
                              X
                            </p>
                            <p className="font-medium w-full flex gap-2">
                              Email:{' '}
                              <span className="font-normal">
                                {fechaData.correo}
                              </span>
                            </p>
                            <p className="font-medium w-full flex gap-2">
                              Pass:{' '}
                              <span className="font-normal">
                                {fechaData.contraseña}
                              </span>
                            </p>
                          </div>
                        ))}
                    </div>
                  </div>
                      )}
              </div>
            </div>
          </div>

          <div className="h-fit flex w-full justify-center items-center gap-3 mt-5 rounded-md text-black ">
            <div className="flex w-fit gap-3 rounded-md text-black ">
              {!loading
                ? (
                <input
                  type="submit"
                  onClick={() => {
                    console.log('hola')
                  }}
                  className="bg-main hover:bg-main_dark transition-colors px-3 py-2 text-white rounded-md cursor-pointer"
                  value="ACTUALIZAR"
                />
                  )
                : (
                <input
                  type="button"
                  disabled
                  className="bg-main_dark px-3 py-2 text-white rounded-md cursor-pointer"
                  value="Cargando..."
                />
                  )}
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
