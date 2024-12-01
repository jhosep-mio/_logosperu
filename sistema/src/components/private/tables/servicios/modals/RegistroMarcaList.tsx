import {
  type Dispatch,
  type SetStateAction,
  forwardRef,
  type ReactElement,
  type Ref,
  useState,
  useEffect
} from 'react'

import Dialog from '@mui/material/Dialog'
import Slide from '@mui/material/Slide'
import { type TransitionProps } from '@mui/material/transitions'
import { AnimatePresence } from 'framer-motion'
import { type ValuesVenta, type errorValues, type valuesMarca } from '../../../../shared/schemas/Interfaces'
import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import { useFormik } from 'formik'
import { SchemaMarca } from '../../../../shared/schemas/Schemas'
import { TitleBriefs } from '../../../../shared/TitleBriefs'
import { InputsBriefs } from '../../../../shared/InputsBriefs'
import { Errors } from '../../../../shared/Errors'
import { AlertSucess } from '../../../../shared/alerts/AlertSucess'
import { getDataVentas } from '../../../../shared/FetchingData'
import useAuth from '../../../../../hooks/useAuth'

interface values {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  id: number
  setProductos: Dispatch<SetStateAction<ValuesVenta[]>>
  setTotalRegistros: Dispatch<SetStateAction<number>>
}

const Transition = forwardRef(function Transition (
  props: TransitionProps & {
    children: ReactElement<any, any>
  },
  ref: Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />
})

export const RegistroMarcaList = ({ open, setOpen, id, setProductos, setTotalRegistros }: values): JSX.Element => {
  const handleClose = (): void => {
    setOpen(false)
  }
  const [loading, setLoading] = useState(false)
  const [showError, setShowError] = useState<errorValues | null>(null)
  const token = localStorage.getItem('token')
  const { auth } = useAuth()

  const saveMarca = async (values: valuesMarca): Promise<void> => {
    setLoading(true)
    const data = new FormData()
    data.append('nombre_marca', values.nombre_marca)
    data.append('_method', 'PUT')

    try {
      const respuesta = await axios.post(
        `${Global.url}/updateMarca/${id ?? ''}`,
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
        getDataVentas(
            `indexToColaboradores3/${auth.id}`,
            setProductos,
            setTotalRegistros
        )
        setShowError({ estado: 'success', texto: 'Marca registrada correctamente' })
        setOpen(false)
      } else {
        setShowError({ estado: 'error', texto: 'Error al registrar marca' })
        setLoading(true)
      }
    } catch (error) {
      setShowError({ estado: 'error', texto: 'Error al registrar marca' })
      console.log(error)
      setLoading(true)
    }
  }

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    touched,
    handleBlur,
    isSubmitting
  } = useFormik({
    initialValues: {
      nombre_marca: ''
    },
    validationSchema: SchemaMarca,
    onSubmit: saveMarca
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
    setTimeout(() => {
      if (showError != null) {
        setShowError(null)
      }
    }, 3000)
  }, [showError])

  return (
    <>
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-4 w-[400px]">
          <div className='flex flex-col'>
            <TitleBriefs titulo="Nombre de la marca" />
            <InputsBriefs
              name="nombre_marca"
              type="text"
              value={values.nombre_marca}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={false}
            />
            <Errors
              errors={errors.nombre_marca}
              touched={touched.nombre_marca}
            />
          </div>
          <div className='w-full flex justify-center items-center'>
            {!loading
              ? <input type="submit" value='Registrar' className='bg-red-500 hover:bg-red-700 px-4 py-2 rounded-xl text-center text-white font-bold cursor-pointer'/>
              : <input type="button" value='Registrar' className='bg-red-800 px-4 py-2 rounded-xl text-center text-white font-bold'/>
            }
          </div>
        </form>
      </Dialog>
      <AnimatePresence>
        {showError != null && <AlertSucess showError={showError} />}
      </AnimatePresence>
    </>
  )
}
