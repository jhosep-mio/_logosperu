/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState } from 'react'
import { DateRangePicker } from 'react-date-range'
import 'react-date-range/dist/styles.css'
import 'react-date-range/dist/theme/default.css'
import { es } from 'date-fns/locale'
import { v4 as uuidv4 } from 'uuid'
import useAuth from '../../../../../hooks/useAuth'
import { ListaVacaciones } from './ListaVacaciones'
import { toast } from 'sonner'
import { Global } from '../../../../../helper/Global'
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { DetallePermiso } from '../modals/DetallePermiso'

const Vacaciones = ({
  vacacionesEvents,
  permisos,
  setPermisos,
  getHorarioLaboral,
  setOpen,
  recuperacion
}: {
  setVacacionesEvents: any
  vacacionesEvents: Event[]
  permisos: any
  setPermisos: any
  setOpen: any
  getHorarioLaboral: any
  setrecuperacion: any
  recuperacion: any
}): JSX.Element => {
  const [selectionRange, setSelectionRange] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  })

  const [selectionRange2, setSelectionRange2] = useState({
    startDate: new Date(),
    endDate: new Date(),
    key: 'selection'
  })
  const [modalidad, setModalidad] = useState('Vacaciones') // Estado para la selección de vacaciones o permisos
  const [description, setDescription] = useState('')
  const { auth } = useAuth()
  const token = localStorage.getItem('token')
  const { id } = useParams()
  const [openPermiso, setOpenPermiso] = useState<any>({
    estado: false,
    titulo: '',
    description: ''
  })

  const handleSelect = (ranges: any): void => {
    setSelectionRange(ranges.selection)
  }

  const handleSelect2 = (ranges: any): void => {
    setSelectionRange2(ranges.selection)
  }

  const updateVacaciones = async (updatedEvents: Event[]): Promise<void> => {
    const data = new FormData()
    data.append('vacaciones', JSON.stringify(updatedEvents))
    data.append('_method', 'PUT')
    try {
      const request = await axios.post(
        `${Global.url}/updateVacaciones/${id ?? ''}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      if (request.data.status == 'success') {
        toast.success('Horario actualizado')
        getHorarioLaboral()
      }
    } catch (error) {
      toast.errror('error al guardar')
    }
  }

  const updatePermisos = async (updatedEvents: Event[]): Promise<void> => {
    const data = new FormData()
    data.append('permisos', JSON.stringify(updatedEvents))
    data.append('_method', 'PUT')
    try {
      const request = await axios.post(
        `${Global.url}/updatePermisos/${id ?? ''}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      if (request.data.status == 'success') {
        toast.success('Horario actualizado')
        getHorarioLaboral()
      }
    } catch (error) {
      toast.errror('error al guardar')
    }
  }

  const updateRecuperacion = async (updatedEvents: Event[], contexto: any): Promise<void> => {
    const data = new FormData()
    data.append('id_recuperacion', contexto.id)
    data.append('contexto', JSON.stringify(contexto))
    data.append('recuperacion', JSON.stringify(updatedEvents))
    data.append('_method', 'PUT')
    try {
      const request = await axios.post(
        `${Global.url}/updateRecuperacion/${id ?? ''}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      if (request.data.status == 'success') {
        toast.success('Registro creado')
        getHorarioLaboral()
      }
    } catch (error) {
      console.log(error)
      toast.error('error al guardar')
    }
  }

  const handleVacationSelect = (): void => {
    if (description.length > 5) {
      const { startDate, endDate } = selectionRange
      const adjustedEndDate = new Date(endDate)
      adjustedEndDate.setHours(23, 59, 59, 999) // Establecer la hora a las 23:59:59.999
      const idUnico = uuidv4()
      const newEvent = {
        id: idUnico,
        modalidad, // Utiliza el estado modalidad
        user: { name: auth.name, id: auth.id },
        title: modalidad, // Utiliza el estado modalidad
        timeRanges: null,
        start: startDate,
        end: adjustedEndDate, // Utilizar la fecha ajustada para end
        detalle: description
      }
      if (modalidad === 'Vacaciones') {
        const updatedEvents: any = [...vacacionesEvents, newEvent]
        updateVacaciones(updatedEvents)
        setOpen(false)
      } else if (selectionRange2 && modalidad === 'Permisos') {
        const updatedEvents: any = [...permisos, newEvent]
        const { startDate: startDate2, endDate: endDate2 } = selectionRange2
        const adjustedEndDate2 = new Date(endDate2)
        adjustedEndDate2.setHours(23, 59, 59, 999) // Establecer la hora a las 23:59:59.999
        const newEvent2 = {
          id: uuidv4(),
          idEvent: idUnico,
          modalidad: 'Recuperación', // Utiliza el estado modalidad
          user: { name: auth.name, id: auth.id },
          title: 'Recuperación', // Utiliza el estado modalidad
          timeRanges: null,
          start: startDate2,
          end: endDate2, // Utilizar la fecha ajustada para end
          colaborador: id,
          detalle: description
        }
        const updatedEventsRec: any = [...recuperacion, newEvent2]
        setPermisos(updatedEvents)
        updatePermisos(updatedEvents)
        updateRecuperacion(updatedEventsRec, newEvent2)
      } else {
        toast.warning('Por favor seleccione los dias de Recuperación')
      }
      setModalidad('Vacaciones')
      setSelectionRange({
        startDate: new Date(),
        endDate: new Date(),
        key: 'selection'
      })
      setDescription('')
    } else {
      toast.warning('Por favor digite una descripción')
    }
  }

  return (
    <section className="grid grid-cols-1 xl:grid-cols-2 px-2 py-8 md:p-8 gap-4">
      <div className="text-black flex flex-col justify-center gap-4 bg-white py-8 rounded-xl">
        <div className="flex flex-col md:flex-row justify-between px-6 items-center">
          <h3 className="text-left w-full text-black font-bold text-base ">
            Selecciona el tipo y rango de fechas:
          </h3>
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 mt-4 md:mt-0 w-fit  mx-auto px-4 py-1 rounded-md text-white font-bold">
            <label className="flex gap-2 bg-[#4e7dbb] px-4 py-1 rounded-lg">
              <input
                type="radio"
                value="Vacaciones"
                checked={modalidad === 'Vacaciones'}
                onChange={() => {
                  setModalidad('Vacaciones')
                }}
              />
              Vacaciones
            </label>
            <label className="flex gap-2 bg-[#4e7dbb] px-4 py-1 rounded-lg">
              <input
                type="radio"
                value="Permisos"
                checked={modalidad === 'Permisos'}
                onChange={() => {
                  setModalidad('Permisos')
                }}
              />
              Permisos
            </label>
          </div>

        </div>
        <div className="px-6 relative">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="email"
          >
            Descripción
          </label>
          <textarea
            className="flex h-16 w-full max-h-[200px] rounded-md border border-input border-gray-400 bg-white px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
            name="asunto"
            value={description}
            onChange={(e) => {
              setDescription(e.target.value)
            }}
            disabled={false}
            rows={2}
          ></textarea>
        </div>

        <div className={`flex  ${modalidad == 'Permisos' ? 'flex-col lg:flex-row  xl:flex-col' : 'flex-col'}`}>
          <div className={`px-6 relative flex flex-col mt-6 ${modalidad == 'Permisos' ? 'w-full lg:w-1/2 xl:w-full' : ''}`}>
            <label
              className="text-2xl text-center mb-6 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              htmlFor="email"
            >
              {modalidad}
            </label>
            <DateRangePicker
              ranges={[selectionRange]}
              onChange={handleSelect}
              className=""
              locale={es}
            />
          </div>

          {modalidad == 'Permisos' &&
              <div className={`px-6 relative flex flex-col mt-6 ${modalidad == 'Permisos' ? 'w-full lg:w-1/2 xl:w-full' : ''}`}>
              <label
                  className="text-2xl text-center mb-6 font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  htmlFor="email"
              >
                  Recuperación
              </label>
              <DateRangePicker
                  ranges={[selectionRange2]}
                  onChange={handleSelect2}
                  className="xl:w-full"
                  locale={es}
              />
              </div>
          }

        </div>
        <button
          onClick={handleVacationSelect}
          className="bg-[#4E9BFF] w-fit mx-auto px-4 py-1 text-white rounded-md hover:bg-[#4e7dbb] transition-colors"
        >
          Seleccionar {modalidad}
        </button>
      </div>
      <ListaVacaciones
        vacaciones={vacacionesEvents}
        permisos={permisos}
        updateVacaciones={updateVacaciones}
        updatePermisos={updatePermisos}
        // @ts-expect-error
        updateRecuperacion={updateRecuperacion}
        setOpen={setOpenPermiso}
        recuperacion={recuperacion}
      />
      <DetallePermiso open={openPermiso} setOpen={setOpenPermiso} />
    </section>
  )
}

export default Vacaciones
