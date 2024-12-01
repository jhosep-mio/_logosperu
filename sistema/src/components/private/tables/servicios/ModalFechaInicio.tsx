import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import axios from 'axios'
import { type Dispatch, type SetStateAction, useState } from 'react'
import Calendar from 'react-calendar'
import { Global } from '../../../../helper/Global'
import Swal from 'sweetalert2'
import { formatDate } from '../../../shared/functions/QuitarAcerntos'
import useAuth from '../../../../hooks/useAuth'
import { getDataVentas } from '../../../shared/FetchingData'
import { type ValuesVenta } from '../../../shared/schemas/Interfaces'
type ValuePiece = Date | null
type Value = ValuePiece | [ValuePiece, ValuePiece]

interface values {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  setDateInicio: Dispatch<SetStateAction<Value>>
  dateInicio: Value
  id: number
  setProductos: Dispatch<SetStateAction<ValuesVenta[]>>
}

export const ModalFechaInicio = ({
  open,
  setOpen,
  setDateInicio,
  dateInicio,
  id,
  setProductos
}: values): JSX.Element => {
  const handleClose = (): void => {
    setOpen(false)
  }

  const { auth } = useAuth()
  const [loading, setLoading] = useState(false)
  const [, setTotalRegistros] = useState(0)

  const actualizar = async (): Promise<void> => {
    if (dateInicio) {
      setLoading(true)
      const token = localStorage.getItem('token')
      const data = new FormData()
      // @ts-expect-error-error
      data.append('fecha_inicio', dateInicio ? formatDate(dateInicio) : null)
      data.append('_method', 'PUT')

      try {
        const respuesta = await axios.post(
          `${Global.url}/updateIncio/${id ?? ''}`,
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
          Swal.fire(
            'Se agrego correctamente la fecha de inicio',
            '',
            'success'
          )
          setOpen(false)
          setDateInicio(null)
          getDataVentas(
            `indexToColaboradores/${auth.id}`,
            setProductos,
            setTotalRegistros
          )
        } else {
          Swal.fire('Error', '', 'error')
        }
      } catch (error) {
        Swal.fire('Error', '', 'error')
        console.log(error)
      }
      setLoading(false)
    } else {
      Swal.fire('Debe seleccionar un fecha', '', 'warning')
    }
  }

  const obtenerFechaActualPeru = (): Date => {
    const offset = -5
    const ahora = new Date()
    const horaActualPeru = ahora.getUTCHours() + offset
    ahora.setUTCHours(horaActualPeru)
    return ahora
  }
  // Inicializa dateInicio con la fecha actual en la zona horaria de Perú
  if (dateInicio == null) {
    dateInicio = obtenerFechaActualPeru()
  }

  // Función para determinar si una fecha está habilitada o deshabilitada en el calendario
  const estaFechaHabilitada = ({ date }: any): boolean => {
    const hoy = obtenerFechaActualPeru()

    // Si la fecha es el día actual, el día anterior o el día siguiente, habilitarla
    const esDiaActual = date.getDate() === hoy.getDate()
    const esDiaAnterior = date.getDate() === hoy.getDate() - 1
    const esDiaSiguiente = date.getDate() === hoy.getDate() + 1

    return !(esDiaActual || esDiaAnterior || esDiaSiguiente)
  }

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="dialog_fecha_inicio"
    >
      <DialogTitle id="alert-dialog-title" className="text-center w-full">
        {'FECHA DE INICIO'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText
          id="alert-dialog-description"
          className="min-h-[200px]"
        >
          <>
            <Calendar
              onChange={(value) => {
                if (value && value instanceof Date) {
                  setDateInicio(
                    new Date(value.toISOString().split('T')[0] + 'T00:00:00')
                  )
                }
              }}
              value={dateInicio ?? null}
              tileDisabled={estaFechaHabilitada} // Configura tileDisabled con la función
              className="w-full px-10 shadow-md shadow-green-500 p-4"
            />
          </>
        </DialogContentText>
      </DialogContent>
      <DialogActions className="flex items-center">
        <button
          className="bg-gray-600 text-white font-bold text-sm px-3 py-2 rounded-xl"
          onClick={handleClose}
        >
          CERRAR
        </button>
        {!loading
          ? (
          <button
            className="bg-green-600 text-white font-bold text-sm px-3 py-2 rounded-xl"
            onClick={() => {
              actualizar()
            }}
          >
            GUARDAR
          </button>
            )
          : (
          <button className="bg-green-900 text-white font-bold text-sm px-3 py-2 rounded-xl">
            GUARDAR
          </button>
            )}
      </DialogActions>
    </Dialog>
  )
}
