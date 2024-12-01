import moment from 'moment'
import 'moment/locale/es'
import { type Dispatch, type SetStateAction } from 'react'

moment.locale('es')
moment.updateLocale('es', null) // Limpiar configuraciones previas

export const OnlyCalendario = ({
  events,
  setSelectedItem,
  setOpen
}: {
  events: Event[]
  setSelectedItem: Dispatch<SetStateAction<Event>>
  setOpen: Dispatch<SetStateAction<boolean>>
}): JSX.Element => {
  const eventos = [...events]

  return (
    <div className="bg-white rounded-xl w-full h-full ">
      {eventos.reverse().map((event: any, index) => {
        const startDate = new Date(event.start)
        const formattedDate = moment(startDate).format('YYYY-MM-DD')
        return (
          <div key={index} className="border-b border-gray-200 py-2 px-4 cursor-pointer" onClick={() => { if (event.tipo != 'inicio') { setSelectedItem(event); setOpen(true) } }}>
            <p className="text-lg font-semibold text-gray-600">
              {formattedDate}
            </p>
            <p className="text-gray-600 lowercase first-letter:uppercase">{event?.title}</p>
          </div>
        )
      })}
    </div>
  )
}
