/* eslint-disable @typescript-eslint/no-misused-promises */
import { IoMdCloseCircle } from 'react-icons/io'
import { cn } from '../../../../../shared/cn'
import { useFormik } from 'formik'
import { SchemaValidarCapacitacion } from '../../../../../shared/schemas/Schemas'
import { Errors2 } from '../../../../../shared/Errors2'
import { useEffect } from 'react'

export const ModalAds = ({
  open,
  setOpen,
  capacitacion,
  updateCapacitacion,
  loading
}: {
  open: any
  setOpen: any
  capacitacion: any | null
  getDatos: any
  updateCapacitacion: any
  loading: any
}): JSX.Element => {
  const SaveCapacitacion = async (): Promise<void> => {
    updateCapacitacion(values)
  }

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
      colaborador: '',
      tipo_capacitacion: '',
      duracion: '',
      fecha_capacitacion: ''
    },
    validationSchema: SchemaValidarCapacitacion,
    onSubmit: SaveCapacitacion
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
    if (capacitacion) {
      setValues({
        ...values,
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        colaborador: capacitacion?.colaborador,
        duracion: capacitacion?.duracion,
        fecha_capacitacion: capacitacion?.fecha_capacitacion,
        tipo_capacitacion: capacitacion?.tipo_capacitacion
      })
    }
  }, [capacitacion])

  return (
    <>
      <div
        className={cn(
          ' bg-white shadow_hosting_grafico transition-all rounded-md  absolute h-full right-0 lg:relative duration-300',
          open ? 'w-[90%] lg:w-[30%] p-4' : 'w-0 p-0 overflow-hidden'
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
          className="flex flex-col bg-white rounded-md relative p-4"
          onSubmit={(e) => { e.preventDefault() }} // Evita el envío predeterminado del formulario
        >
          <div className="flex w-full flex-col">
            <div className="w-full flex flex-col text-white">
              <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-end gap-0 lg:gap-x-5 lg:gap-y-0">
                <div className="w-full flex flex-col lg:flex-row gap-3 lg:gap-5 mt-3 lg:mt-0">
                  <div className="w-full relative pb-0 md:pb-5">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="email"
                    >
                      Colaborador
                    </label>
                    <input
                      className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                      name="colaborador"
                      value={values.colaborador}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Errors2
                      errors={errors.colaborador}
                      touched={touched.colaborador}
                    />
                  </div>
                </div>

                <div className="w-full flex flex-col lg:flex-row gap-0 lg:gap-5 mt-3 lg:mt-0">
                  <div className="w-full relative pb-5 ">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="email"
                    >
                      Tipo de capacitación
                    </label>
                    <select
                      className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                      name="tipo_capacitacion"
                      value={values.tipo_capacitacion}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      {/* FB GOOGLE, VENTAS, POST VENTA, RECOMENDACION, ISNTAGRAM) */}
                      <option value="">Seleccionar</option>
                      <option value="Google Ads">Google Ads</option>
                      <option value="Facebook Ads">Facebook Ads</option>
                      <option value="Pasarela de pago">Pasarela de pago</option>
                    </select>
                    <Errors2
                      errors={errors.tipo_capacitacion}
                      touched={touched.tipo_capacitacion}
                    />
                  </div>

                </div>

                <div className="w-full flex flex-col lg:flex-row gap-0 lg:gap-5 mt-3 lg:mt-0">
                  <div className="w-full relative pb-5 ">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="email"
                    >
                      Duración
                    </label>
                    <select
                      className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                      name="duracion"
                      value={values.duracion}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    >
                      {/* FB GOOGLE, VENTAS, POST VENTA, RECOMENDACION, ISNTAGRAM) */}
                      <option value="">Seleccionar</option>
                      <option value="Plan Emprendimiento">Plan Emprendimiento</option>
                      <option value="Plan Intermedio">Plan Intermedio</option>
                      <option value="Plan full">Plan full</option>
                    </select>
                    <Errors2 errors={errors.duracion} touched={touched.duracion} />
                  </div>
                  <div className="w-full relative pb-5 ">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="email"
                    >
                      Fecha de capacitación
                    </label>
                    <input
                      className="h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                      name="fecha_capacitacion"
                      type='date'
                      value={values.fecha_capacitacion}
                      onChange={handleChange}
                      onBlur={handleBlur}
                    />
                    <Errors2
                      errors={errors.fecha_capacitacion}
                      touched={touched.fecha_capacitacion}
                    />
                  </div>
                </div>

              </div>
            </div>
          </div>

          <div className="h-fit flex w-full justify-end items-center gap-3 rounded-md text-black ">
            <div className="flex w-fit gap-3 rounded-md text-black ">
              {!loading
                ? (
                <input
                  type="button"
                  className="bg-secondary-150 px-3 py-2 text-white rounded-md cursor-pointer"
                  value="Grabar"
                  onClick={handleFormSubmit} // Llama a la función para enviar el formulario
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
          </div>
        </form>
      </div>
    </>
  )
}
