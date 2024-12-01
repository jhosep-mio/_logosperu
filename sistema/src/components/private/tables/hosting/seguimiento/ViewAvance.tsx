/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/no-misused-promises */
import { IoMdCloseCircle } from 'react-icons/io'
import { useFormik } from 'formik'
import { useEffect, useState } from 'react'
import { SchemaValidarAntecedenteHosting } from '../../../../shared/schemas/Schemas'
import { Dialog, DialogContent } from '@mui/material'
import { toast } from 'sonner'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'

export const ViewAvance = ({
  open,
  setOpen
}: {
  open: any
  setOpen: any
}): JSX.Element => {
  const [, setLoading] = useState(false)
  const { id } = useParams()

  const SaveContrato = async (dato: any): Promise<void> => {
    setLoading(true)
    const token = localStorage.getItem('token')
    const data = new FormData()
    data.append('id_hosting', id ?? '')
    data.append('p1', dato.p1)
    data.append('p2', dato.p1)
    data.append('p3', dato.p1)
    data.append('p4', dato.p1)
    data.append('p5', dato.p1)
    data.append('p6', dato.p1)
    try {
      const respuesta = await axios.post(
        `${Global.url}/registroAntecedente`,
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
        toast.success('Atecendente agregado')
        setOpen(false)
      } else {
        toast.error('Error al agregar')
      }
    } catch (error) {
      console.log(error)
      toast.error('Error al agregar')
    } finally {
      setLoading(false)
    }
  }

  const {
    setValues,
    handleChange,
    errors,
    isSubmitting,
    values,
    touched,
    handleBlur
  } = useFormik({
    initialValues: {
      p1: '',
      p2: '',
      p3: '',
      p4: '',
      p5: '',
      p6: ''
    },
    validationSchema: SchemaValidarAntecedenteHosting,
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
    if (open.antecedente) {
      console.log(open)
      setValues({
        ...values,
        p1: (open.antecedente).p1,
        p2: (open.antecedente).p2,
        p3: (open.antecedente).p3,
        p4: (open.antecedente).p4,
        p5: (open.antecedente).p5,
        p6: (open.antecedente).p6
      })
    }
  }, [open])

  return (
    <Dialog
      open={open.estado}
      onClose={() => setOpen({ ...open, estado: false })}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="lg"
    >
      <DialogContent>
        <IoMdCloseCircle
          className="absolute top-2 right-2 text-2xl text-red-500 hover:text-main_dark transition-colors cursor-pointer"
          onClick={() => setOpen(!open)}
        />
        <h2 className="w-full text-center text-black text-xl font-bold uppercase">
          ANTECENDENTE
        </h2>

        <form
          className="flex flex-col bg-white rounded-md relative p-4"
        >
          <div className="flex w-full flex-col">
            <div className="w-full flex flex-col text-white">
              <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-end gap-0 lg:gap-x-5 lg:gap-y-0">
                <div className="w-full flex flex-col lg:flex-row gap-0 lg:gap-5 mt-3 lg:mt-0">
                  <div className="w-full relative pb-5 ">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="email"
                    >
                      ¿Cuál era el proveedor de hosting antes de la migración?
                    </label>
                    <input
                      className="h-9 w-full rounded-md border border-input cursor-not-allowed border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                      name="p1"
                      type="text"
                      value={values.p1}
                      onChange={handleChange}
                      disabled
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="w-full relative pb-5 ">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="email"
                    >
                      ¿A qué proveedor de hosting se migró?
                    </label>
                    <input
                      className="h-9 w-full rounded-md border border-input cursor-not-allowed border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                      name="p2"
                      value={values.p2}
                      onChange={handleChange}
                      disabled
                      onBlur={handleBlur}
                    />
                  </div>
                </div>

                <div className="w-full flex flex-col lg:flex-row gap-0 lg:gap-5 mt-3 lg:mt-0">
                  <div className="w-full relative pb-5 ">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="email"
                    >
                      ¿En qué fecha se realizó la migración?
                    </label>
                    <input
                      className="h-9 w-full rounded-md border border-input cursor-not-allowed border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                      name="p3"
                      type="text"
                      value={values.p3}
                      onChange={handleChange}
                      disabled
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="w-full relative pb-5 ">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="email"
                    >
                      ¿Hubo inconvenientes durante la migración?
                    </label>
                    <select
                      className="flex h-9 w-full rounded-md border border-input cursor-not-allowed border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                      name="p4"
                      value={values.p4}
                      onChange={handleChange}
                      disabled
                      onBlur={handleBlur}
                    >
                      <option value="">Seleccionar</option>
                      <option value="SI">SI</option>
                      <option value="NO">NO</option>
                    </select>
                  </div>
                </div>

                <div className="w-full flex flex-col gap-0  mt-3 lg:mt-0">
                  <div className="w-full relative pb-5">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="email"
                    >
                      ¿Cuál es el estado actual del sitio web después de la
                      migración?
                    </label>
                    <input
                      className="h-9 w-full rounded-md border border-input cursor-not-allowed border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                      name="p5"
                      type="text"
                      value={values.p5}
                      onChange={handleChange}
                      disabled
                      onBlur={handleBlur}
                    />
                  </div>
                  <div className="w-full relative pb-5 ">
                    <label
                      className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="email"
                    >
                      Comentarios adicionales
                    </label>
                    <textarea
                      className="min-h-9 w-full rounded-md border border-input cursor-not-allowed border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                      name="p6"
                      rows={4}
                      value={values.p6}
                      onChange={handleChange}
                      disabled
                      onBlur={handleBlur}
                    ></textarea>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* <div className="h-fit flex w-full justify-center items-center gap-3 rounded-md text-black ">
            <div className="flex w-fit gap-3 rounded-md text-black ">
                <input
                  type="button"
                  onClick={() => setOpen({ ...open, estado: false })}
                  className="bg-main_dark px-3 py-2 text-white rounded-md cursor-pointer"
                  value="Cerrar"
                />
            </div>
          </div> */}
        </form>
      </DialogContent>
    </Dialog>
  )
}
