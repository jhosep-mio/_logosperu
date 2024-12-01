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
import { AlertSucess } from '../../../shared/alerts/AlertSucess'
import { AnimatePresence } from 'framer-motion'
import {
  type valuesEmail,
  type errorValues
} from '../../../shared/schemas/Interfaces'
import { useFormik } from 'formik'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { SchemaEmail } from '../../../shared/schemas/Schemas'
import { TitleBriefs } from '../../../shared/TitleBriefs'
import { InputsBriefs } from '../../../shared/InputsBriefs'
import { Errors } from '../../../shared/Errors'

interface values {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  id: string | undefined
  getOneBrief: () => Promise<void>
}

const Transition = forwardRef(function Transition (
  props: TransitionProps & {
    children: ReactElement<any, any>
  },
  ref: Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />
})

export const RegistroEmail2 = ({ open, setOpen, id, getOneBrief }: values): JSX.Element => {
  const handleClose = (): void => {
    setOpen(false)
  }
  const [loading, setLoading] = useState(false)
  const [showError, setShowError] = useState<errorValues | null>(null)
  const token = localStorage.getItem('token')

  const saveMarca = async (values: valuesEmail): Promise<void> => {
    setLoading(true)
    const data = new FormData()
    data.append('email', values.email)
    data.append('_method', 'PUT')

    try {
      const respuesta = await axios.post(
        `${Global.url}/updateEmail/${id ?? ''}`,
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
        getOneBrief()
        setShowError({ estado: 'success', texto: 'Email registrado correctamente' })
        setOpen(false)
      } else {
        setShowError({ estado: 'error', texto: 'Error al registrar email' })
        setLoading(true)
      }
    } catch (error) {
      setShowError({ estado: 'error', texto: 'Error al registrar email' })
      // console.log(error.request.response);
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
      email: ''
    },
    validationSchema: SchemaEmail,
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
            <TitleBriefs titulo="Email para el cliente" />
            <InputsBriefs
              name="email"
              type="text"
              value={values.email}
              onChange={handleChange}
              onBlur={handleBlur}
              disabled={false}
            />
            <Errors
              errors={errors.email}
              touched={touched.email}
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
