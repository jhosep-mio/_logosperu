/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { IoMdCloseCircle } from 'react-icons/io'
import { cn } from '../../../../../shared/cn'
import { useState, useEffect } from 'react'
import { useFormik } from 'formik'
import { SchemaValidarHosting } from '../../../../../shared/schemas/Schemas'
import { Errors2 } from '../../../../../shared/Errors2'
import { toast } from 'sonner'

export const ModalHosting = ({
  open,
  setOpen,
  hosting,
  updateHosting,
  loading,
  idVenta
}: {
  open: any
  setOpen: any
  hosting: any | null
  getDatos: any
  updateHosting: any
  loading: any
  idVenta: any
}): JSX.Element => {
  const SaveContrato = async (): Promise<void> => {
    updateHosting(values)
  }

  const [correos, setCorreos] = useState<any | null>(null)
  const [constraseña, setConstraseña] = useState<any | null>(null)

  const {
    handleSubmit,
    handleChange,
    setValues,
    errors,
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
      tieneDominio: false,
      plan: '',
      inicio: '',
      usuario: '',
      password: '',
      montoC: '',
      montoP: '',
      ganancia: '',
      gratis: false,
      nombres: '',
      apellidos: '',
      celular: '',
      email: '',
      marca: '',
      fechas: '',
      arrayCorreos: []
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
  }, [touched, errors, isSubmitting])

  const handleFormSubmit = async (): Promise<void> => {
    try {
      // eslint-disable-next-line @typescript-eslint/await-thenable, @typescript-eslint/no-confusing-void-expression
      await handleSubmit() // Llama a la función de envío del formulario
    } catch (error) {
      console.error('Error al enviar los datos:', error)
    }
  }

  useEffect(() => {
    if (hosting) {
      setValues({
        ...values,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        tiposervicio: hosting.tiposervicio,
        dominio: hosting?.dominio,
        gratis: hosting?.gratis,
        nombres: hosting.nombres,
        apellidos: hosting.apellidos,
        celular: hosting.celular,
        email: hosting.email,
        marca: hosting.marca,
        pdominio: hosting?.pdominio,
        phosting: hosting?.phosting,
        tieneDominio: hosting?.tieneDominio,
        plan: hosting?.plan,
        inicio: hosting?.inicio,
        usuario: hosting?.usuario,
        password: hosting?.password,
        montoC: hosting?.montoC,
        montoP: hosting?.montoP,
        fechas: hosting?.fechas,
        arrayCorreos: hosting?.arrayCorreos
      })
    }
  }, [hosting])

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
    <>
      <div
        className={cn(
          ' bg-white shadow_hosting_grafico transition-all rounded-md  relative duration-300',
          open ? 'w-[30%] p-4' : 'w-0 p-0 overflow-hidden'
        )}
      >
        <IoMdCloseCircle
          className="absolute top-2 right-2 text-2xl text-red-500 hover:text-main_dark transition-colors cursor-pointer"
          onClick={() => setOpen(!open)}
        />
        <h2 className="w-full text-center text-black text-xl font-bold uppercase">
          Edicion
        </h2>

        <form
          className="flex flex-col bg-white rounded-md relative p-4 overflow-y-auto  h-[90vh]"
          onSubmit={(e) => {
            e.preventDefault()
          }} // Evita el envío predeterminado del formulario
        >
          <div className="flex w-full flex-col">
            <div className="w-full flex flex-col text-white">
              <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-end gap-0 lg:gap-x-5 lg:gap-y-0">
                {!idVenta && (
                  <>
                    <div className="w-full flex flex-col lg:flex-row gap-3 lg:gap-5 mt-3 lg:mt-0">
                      <div className="w-full relative pb-0 md:pb-5">
                        <label
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          htmlFor="email"
                        >
                          Nombres
                        </label>
                        <input
                          className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                          name="apellidos"
                          value={values.apellidos}
                          onChange={handleChange}
                          onBlur={handleBlur}
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
                        <input
                          className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                          name="celular"
                          value={values.celular}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        <Errors2
                          errors={errors.celular}
                          touched={touched.celular}
                        />
                      </div>
                    </div>
                  </>
                )}

                <div className="w-full flex flex-col lg:flex-row gap-3 lg:gap-5 mt-3 lg:mt-0">
                  {!idVenta && (
                    <>
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
                    </>
                  )}
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

                <div className="w-full flex flex-col lg:flex-row gap-0 lg:gap-5 mt-3 lg:mt-0">
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
                </div>

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

                <div className="w-full h-full col-span-2 flex gap-4 items-center justify-center relative">
                  <div className="flex flex-col w-full">
                    <input
                      className="h-9 w-full text-black rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                      name="correos"
                      type="email"
                      placeholder="Correo"
                      value={correos}
                      onChange={(e) => {
                        setCorreos(e.target.value)
                      }}
                    />
                    <input
                      className="h-9 w-full mt-3 text-black rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
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
                    className="bg-main px-3 py-1  text-black rounded-md cursor-pointer"
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
            </div>
          </div>

          <div className="h-fit flex w-full justify-end items-center gap-3 rounded-md text-black ">
            <div className="flex w-fit gap-3 rounded-md text-black ">
              {!loading ? (
                <input
                  type="button"
                  className="bg-secondary-150 px-3 py-2 text-white rounded-md cursor-pointer"
                  value="Grabar"
                  onClick={handleFormSubmit} // Llama a la función para enviar el formulario
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
