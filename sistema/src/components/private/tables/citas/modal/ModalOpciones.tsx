import { Dialog, DialogContent } from '@mui/material'
import { useFormik } from 'formik'
import moment from 'moment'
import { type Dispatch, type SetStateAction } from 'react'
import {
  GoCalendar,
  GoComment,
  GoDatabase,
  GoTrash,
  GoX
} from 'react-icons/go'
import { Link } from 'react-router-dom'
import { SchemaValidarVentas } from '../../../../shared/schemas/Schemas'
import { type ValuesPlanes } from '../../../../shared/schemas/Interfaces'
import { GeneracionVentas2 } from '../../clientes/GeneracionVentas2'

export const ModalOpciones = ({
  eventoSelected,
  open,
  setOpen,
  open3,
  planes,
  setOpen3,
  setEvents,
  updateCita
}: {
  eventoSelected: any | []
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  open3: boolean
  planes: ValuesPlanes[]
  setOpen3: Dispatch<SetStateAction<boolean>>
  setEvents: Dispatch<SetStateAction<Event[]>>
  updateCita: (updatedEvents: Event[]) => Promise<void>
}): JSX.Element => {
  const generarVenta = async (): Promise<void> => {}

  const { setValues, values } = useFormik({
    initialValues: {
      id: 0,
      medio_ingreso: '',
      nombre_empresa: '',
      plan: '',
      id_contrato: '',
      dni_ruc: '',
      id_cliente: '',
      arraycontacto: '',
      nombre_cliente: ''
    },
    validationSchema: SchemaValidarVentas,
    onSubmit: generarVenta
  })

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false)
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description "
      className="modal_opciones"
    >
      <DialogContent className="shadow-2xl shadow-slate-950 w-[500px] bg-white overflow-hidden">
        <div className="w-full flex flex-col gap-4 p-2">
          <div className="flex gap-1 text-2xl text-gray-400 w-full justify-end items-center">
            <div
              className="hover:bg-gray-200 p-2 rounded-full group cursor-pointer transition-colors"
              onClick={() => {
                window.open(
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/restrict-template-expressions
                  `/admin/lista-clientes/editar/${eventoSelected?.event?.client.id}`
                )
                setOpen(false)
              }}
            >
              <GoDatabase className="group-hover:text-gray-400" />
            </div>
            <Link
              // eslint-disable-next-line @typescript-eslint/ban-ts-comment, @typescript-eslint/restrict-template-expressions
              to={`/admin/lista-clientes/resumen/${eventoSelected?.event?.client.id}`}
              className="hover:bg-gray-200 p-2 rounded-full group cursor-pointer transition-colors"
            >
              <GoComment className="group-hover:text-gray-400" />
            </Link>
            <div
              className="hover:bg-gray-200 p-2 rounded-full group cursor-pointer transition-colors"
              onClick={() => {
                setEvents((prevEvents) => {
                  const updatedEvents = prevEvents.filter(
                    (e) => e !== eventoSelected.event
                  )
                  updateCita(updatedEvents)
                  return updatedEvents
                })
                setOpen(false)
              }}
            >
              <GoTrash className="group-hover:text-gray-400" />
            </div>
            <div
              className="hover:bg-gray-200 p-1 rounded-full group cursor-pointer transition-colors"
              onClick={() => {
                setOpen(false)
              }}
            >
              <GoX className="group-hover:text-gray-400 text-3xl" />
            </div>
          </div>
          <div className="flex flex-col px-4">
            <div className="flex gap-4 items-center">
              <span className="w-3 h-3 bg-main rounded-full text-black"></span>
              <div className="flex flex-col">
                <span className="text-lg">{eventoSelected?.event?.title}</span>
                <div className="flex text-gray-500 gap-2 items-center">
                  <span className="first-letter:uppercase ">
                    {moment(eventoSelected?.event?.start).format(
                      'dddd, DD [de] MMMM'
                    )}
                  </span>
                  <span>.</span>
                  <span>
                    {moment(eventoSelected?.event?.start).format('HH:mm')}
                  </span>
                  <span>-</span>
                  <span>
                    {moment(eventoSelected?.event?.end).format('HH:mm')}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className="px-10">
            <h2 className="text-lg font-bold">Datos del cliente</h2>
            <div className="flex flex-col mt-2">
              <div className="flex flex-col gap-2">
                <p className="flex gap-3">
                  <span className="font-medium ">Celular:</span>{' '}
                  {eventoSelected?.event?.client?.celular}
                </p>
                <p className="flex gap-3">
                  <span className="font-medium ">Correo:</span>{' '}
                  {eventoSelected?.event?.client?.email}
                </p>
              </div>
            </div>
          </div>
          <div className="px-4 pt-2 pb-3">
            <div className="flex gap-3 items-center">
              <GoCalendar className="text-xl text-gray-600" />
              <span className="text-base text-gray-600">
                {eventoSelected?.event?.user?.name}
              </span>
            </div>
          </div>
          <div className='w-full flex justify-center pb-6'>
                <button
                onClick={() => {
                  setOpen3(true)
                  setValues({
                    ...values,
                    id_cliente: String(eventoSelected?.event?.client?.id),
                    medio_ingreso: eventoSelected?.event?.client?.medio_ingreso,
                    nombre_empresa: eventoSelected?.event?.client?.empresa
                      ? eventoSelected?.event?.client?.empresa
                      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                      : `${eventoSelected?.event?.client?.nombres} ${eventoSelected?.event?.client?.apellidos}`,
                    dni_ruc: `${
                      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                        eventoSelected?.event?.client?.dni_ruc != null ? eventoSelected?.event?.client?.dni_ruc : ''
                      }`
                  })
                }}
                className='w-fit mx-auto px-4 py-2 rounded-xl bg-main hover:bg-main/80 transition-colors text-white'>Generar venta</button>
          </div>
        </div>
        <GeneracionVentas2
            open={open3}
            setOpen={setOpen3}
            datos={values}
            planes={planes}
          />
      </DialogContent>
    </Dialog>
  )
}
