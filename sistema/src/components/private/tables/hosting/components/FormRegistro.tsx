/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { SchemaValidarHosting } from '../../../../shared/schemas/Schemas'
import { cn } from '../../../../shared/cn'
import { Errors2 } from '../../../../shared/Errors2'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import Suggestion from '../seguimiento/Suggestion'
import SuggestionCelular from '../seguimiento/SuggestionCelular'

export const FormRegistro = ({
  clientes,
  setclienteSeleccionado,
  clienteSeleccionado
}: {
  clientes: any
  setclienteSeleccionado: any
  clienteSeleccionado: any
}): JSX.Element => {
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem('token')
  const navigate = useNavigate()
  const [nuevaFecha, setNuevaFecha] = useState<string>('')
  const [nuevoPrecio, setNuevoPrecio] = useState('')

  const SaveContrato = async (values: any): Promise<void> => {
    if (
      (!values.nombres ||
        !values.apellidos ||
        !values.marca ||
        !values.celular ||
        !values.email)
    ) {
      toast.warning('Complete todos los datos')
      return
    }
    setLoading(true)
    const data = new FormData()
    data.append('hosting', JSON.stringify(values))
    data.append('id_venta', 'null')
    data.append('id_cliente', clienteSeleccionado || null)
    try {
      const respuesta = await axios.post(
        `${Global.url}/guardarDatosHosting`,
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
        toast.success('Registro exitoso')
        navigate('/admin/hosting')
      } else {
        toast.error('Error al registrar')
      }
    } catch (error: any) {
      console.log(error)
      toast.error('Error al registrar')
    } finally {
      setLoading(false)
    }
  }

  const agregarFecha = async (nuevoPrecio: number): Promise<void> => {
    if (nuevaFecha && nuevoPrecio) {
      // Actualizar el estado localmente
      const updatedFechas = values.fechas
        ? [...values.fechas, { fecha: nuevaFecha, precio: nuevoPrecio }]
        : [{ fecha: nuevaFecha, precio: nuevoPrecio }]
      // @ts-expect-error
      setValues({ ...values, fechas: updatedFechas })
      setNuevaFecha('')
      setNuevoPrecio('')
    } else {
      toast.error('Error al agregar fecha o precio')
    }
  }

  const {
    handleSubmit,
    handleChange,
    errors,
    setValues,
    isSubmitting,
    values,
    touched,
    handleBlur
  } = useFormik({
    initialValues: {
      tiposervicio: '',
      dominio: '',
      pdominio: '',
      phosting: '',
      fechas: [],
      tieneDominio: false,
      plan: '',
      inicio: '',
      usuario: '',
      password: '',
      montoC: '',
      montoP: '',
      gratis: false,
      nombres: '',
      apellidos: '',
      celular: '',
      email: '',
      marca: ''
    },
    validationSchema: SchemaValidarHosting,
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
    console.log(errors)
  }, [touched, errors, isSubmitting])

  return (
    <>
      <div
        className={cn(
          ' bg-white  transition-all rounded-md flex flex-col items-center justify-center  relative duration-300 w-full '
        )}
      >
        <form
          className="w-full flex flex-col bg-white rounded-md relative md:p-4 overflow-y-auto h-[90vh]"
          onSubmit={handleSubmit}
        >
          <div className="flex w-full h-full flex-col">
            <div className="w-full h-full md:w-fit mx-auto flex flex-col text-white">
              <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-end gap-0 lg:gap-x-5 lg:gap-y-0">
                    <div className="w-full flex flex-col lg:flex-row gap-3 lg:gap-5 mt-3 lg:mt-0">
                      <div className="w-full relative pb-0 md:pb-5">
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="email"
                        >
                          Nombres
                        </label>
                        <Suggestion
                          value={values.nombres}
                          onChange={async (newValue: any) =>
                            await setValues((prevValues) => ({
                              ...prevValues,
                              nombres: newValue
                            }))
                          }
                          clientes={clientes}
                          setValues={setValues}
                          setclienteSeleccionado={setclienteSeleccionado}
                        />
                        <Errors2
                          errors={errors.nombres}
                          touched={touched.nombres}
                        />
                      </div>
                      <div className="w-full relative pb-0 md:pb-5">
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="email"
                        >
                          Apellidos
                        </label>
                        <input
                          className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                          name="apellidos"
                          value={values.apellidos}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <Errors2
                          errors={errors.apellidos}
                          touched={touched.apellidos}
                        />
                      </div>
                    </div>
                    <div className="w-full flex flex-col lg:flex-row gap-3 lg:gap-5 mt-3 lg:mt-0">
                      <div className="w-full relative pb-0 md:pb-5">
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="email"
                        >
                          Correo
                        </label>
                        <input
                          className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                          name="email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <Errors2
                          errors={errors.email}
                          touched={touched.email}
                        />
                      </div>

                      <div className="w-full relative pb-0 md:pb-5">
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="email"
                        >
                          Celular
                        </label>
                        <SuggestionCelular
                          value={values.celular}
                          onChange={async (newValue: any) =>
                            await setValues((prevValues) => ({
                              ...prevValues,
                              celular: newValue
                            }))
                          }
                          clientes={clientes}
                          setValues={setValues}
                          setclienteSeleccionado={setclienteSeleccionado}
                        />
                        <Errors2
                          errors={errors.celular}
                          touched={touched.celular}
                        />
                      </div>

                    </div>
                  {/* </>
                )} */}

                <div className="w-full flex flex-col lg:flex-row gap-3 lg:gap-5 mt-3 lg:mt-0">
                  {/* {proyectoSeleccionado == 'Nuevo' && (
                    <> */}
                      <div className="w-full relative pb-0 md:pb-5">
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="email"
                        >
                          Marca
                        </label>
                        <input
                          className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                          name="marca"
                          value={values.marca}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <Errors2
                          errors={errors.marca}
                          touched={touched.marca}
                        />
                      </div>
                    {/* </>
                  )} */}
                </div>

                <div className="w-full flex flex-col lg:flex-row gap-0 lg:gap-5 mt-3 lg:mt-0">
                  <div className="w-full relative pb-5 ">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="email"
                    >
                      Servicios
                    </label>
                    <select
                      className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                      name="tiposervicio"
                      value={values.tiposervicio}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      {/* FB GOOGLE, VENTAS, POST VENTA, RECOMENDACION, ISNTAGRAM) */}
                      <option value="">Seleccionar</option>
                      <option value="Hosting">Hosting</option>
                      <option value="Dominio">Dominio</option>
                      <option value="Hosting + Dominio">
                        Hosting + Dominio
                      </option>
                    </select>
                    <Errors2
                      errors={errors.tiposervicio}
                      touched={touched.tiposervicio}
                    />
                  </div>
                  <div className="w-full relative pb-0 md:pb-5">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="email"
                    >
                      Nombre dominio
                    </label>
                    <input
                      className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                      name="dominio"
                      value={values.dominio}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Errors2
                      errors={errors.dominio}
                      touched={touched.dominio}
                    />
                  </div>
                </div>

                {values.tiposervicio == 'Hosting' ||
                values.tiposervicio == 'Hosting + Dominio' ? (
                  <div className="w-full flex items-center flex-col lg:flex-row gap-0 lg:gap-5 mt-3 lg:mt-0">
                    <div className="w-full relative pb-5 ">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                      >
                        Proovedor hosting
                      </label>
                      <select
                        className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                        name="phosting"
                        value={values.phosting}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        {/* FB GOOGLE, VENTAS, POST VENTA, RECOMENDACION, ISNTAGRAM) */}
                        <option value="">Seleccionar</option>
                        <option value="BlueHost">BlueHost</option>
                        <option value="Hostgator">Hostgator</option>
                        <option value="A2 Hosting">A2 Hosting</option>
                        <option value="Yachay">Yachay</option>
                        <option className="text-black" value="Reselhost">
                          Reselhost
                        </option>
                      </select>
                      <Errors2
                        errors={errors.phosting}
                        touched={touched.phosting}
                      />
                    </div>
                    <div className="w-full flex justify-between lg:flex-row gap-3 lg:gap-5 mt-3 lg:mt-0">
                      <div className="w-full gap-4 flex justify-end items-center relative ">
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="dominio"
                        >
                          ¿Hosting gratis 1 año?
                        </label>
                        <input
                          type="checkbox"
                          name="gratis"
                          className="h-4 w-4 rounded border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                          checked={values.gratis}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                      </div>
                    </div>
                  </div>
                    ) : null}

                {values.tiposervicio == 'Dominio' ||
                values.tiposervicio == 'Hosting + Dominio' ? (
                  <div className="w-full relative pb-5 ">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="email"
                    >
                      Proovedor dominio
                    </label>
                    <select
                      className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                      name="pdominio"
                      value={values.pdominio}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      {/* FB GOOGLE, VENTAS, POST VENTA, RECOMENDACION, ISNTAGRAM) */}
                      <option value="">Seleccionar</option>
                      <option value="GoDaddy">GoDaddy</option>
                      <option value="Punto pe">Punto pe</option>
                    </select>
                    <Errors2
                      errors={errors.pdominio}
                      touched={touched.pdominio}
                    />
                  </div>
                    ) : null}

                <div className="w-full flex flex-col lg:flex-row gap-0 lg:gap-5 mt-3 lg:mt-0">
                  {values.tiposervicio == 'Hosting' ||
                  values.tiposervicio == 'Hosting + Dominio' ? (
                    <div className="w-full relative pb-5 ">
                      <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                      >
                        Plan contratado
                      </label>
                      <select
                        className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                        name="plan"
                        value={values.plan}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      >
                        {/* FB GOOGLE, VENTAS, POST VENTA, RECOMENDACION, ISNTAGRAM) */}
                        <option value="">Seleccionar</option>
                        <option value="400 MB">400 MB</option>
                        <option value="1000 MB">1000 MB</option>
                        <option value="3000 MB">3000 MB</option>
                        <option value="10000 MB sin CPANEL">
                          10000 MB sin CPANEL
                        </option>
                        <option value="10000 MB con CPANEL">
                          10000 MB con CPANEL
                        </option>
                        <option value="Ilimitado sin CPANEL">
                          Ilimitado sin CPANEL
                        </option>
                        <option value="Ilimitado con CPANEL">
                          Ilimitado con CPANEL
                        </option>
                      </select>
                      <Errors2 errors={errors.plan} touched={touched.plan} />
                    </div>
                      ) : null}

                  <div className="w-full relative pb-5 ">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="email"
                    >
                      Fecha de inicio
                    </label>
                    <input
                      className="h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                      name="inicio"
                      type="date"
                      value={values.inicio}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Errors2 errors={errors.inicio} touched={touched.inicio} />
                  </div>
                </div>

                {values.tiposervicio == 'Hosting' ||
                  values.tiposervicio == 'Hosting + Dominio'
                  ? <div className="w-full flex flex-col lg:flex-row gap-0 lg:gap-5 mt-3 lg:mt-0">
                    <div className="w-full relative pb-5 ">
                        <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                        >
                        Usuario
                        </label>
                        <input
                        className="h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                        name="usuario"
                        type="text"
                        value={values.usuario}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        />
                        <Errors2
                        errors={errors.usuario}
                        touched={touched.usuario}
                        />
                    </div>
                    <div className="w-full relative pb-5 ">
                        <label
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                        >
                        Contraseña
                        </label>
                        <input
                        className="h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                        name="password"
                        value={values.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        />
                        <Errors2
                        errors={errors.password}
                        touched={touched.password}
                        />
                    </div>
                    </div> : null
                  }

                <div className="w-full flex flex-col lg:flex-row gap-0 lg:gap-5 mt-3 lg:mt-0">
                  <div className="w-full relative pb-5 ">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="email"
                    >
                      Monto a Cobrar
                    </label>
                    <input
                      className="h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                      name="montoC"
                      type="text"
                      value={values.montoC}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Errors2 errors={errors.montoC} touched={touched.montoC} />
                  </div>
                  <div className="w-full relative pb-5 ">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="email"
                    >
                      Monto a Pagar
                    </label>
                    <input
                      className="h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                      name="montoP"
                      value={values.montoP}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Errors2 errors={errors.montoP} touched={touched.montoP} />
                  </div>
                </div>

                <div className="w-full h-full flex gap-4 items-center justify-center relative">
                  <div className="flex flex-col w-full">
                    <input
                      className="h-9 w-full text-black rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                      name="inicio"
                      type="date"
                      value={nuevaFecha}
                      onChange={(e) => {
                        setNuevaFecha(e.target.value)
                      }}
                    />
                    <input
                      className="h-9 w-full mt-3 text-black rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                      name="precio"
                      type="number"
                      placeholder="Precio"
                      value={nuevoPrecio}
                      onChange={(e) => {
                        setNuevoPrecio(e.target.value)
                      }}
                    />
                  </div>
                  <input
                    type="button"
                    className="bg-main px-3 py-1  text-white rounded-md cursor-pointer"
                    value="Agregar"
                    onClick={async () => {
                      await agregarFecha(Number(nuevoPrecio))
                    }}
                  />
                </div>

                <div className="w-full mt-4 grid grid-cols-3 gap-4">
                  {(values.fechas).map((fechaData: any, index) => (
                    <div key={index} className="bg-gray-200 px-2 py-1 rounded-xl">
                      <p className="font-medium">Fecha: {fechaData.fecha}</p>
                      <p className="font-medium">Precio: {fechaData.precio}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
          <div className="w-full md:w-fit mx-auto h-fit flexjustify-center items-center gap-3 rounded-md text-black ">
            <div className="flex w-fit gap-3 rounded-md text-black ">
              {!loading ? (
                <input
                  type="submit"
                  className="bg-secondary-150 px-3 py-2 text-white rounded-md cursor-pointer"
                  value="Registrar hosting"
                />
              ) : (
                <input
                  type="button"
                  disabled
                  className="bg-secondary-150/70 px-3 py-2 text-white rounded-md cursor-pointer"
                  value="Cargando..."
                />
              )}
            </div>
          </div>
        </form>
      </div>
    </>
  )
}
