import { useRef, type Dispatch, type SetStateAction, useState, useEffect, useCallback } from 'react'
import DatePicker, { registerLocale, setDefaultLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import es from 'date-fns/locale/es'
import { FaRegCalendarCheck } from 'react-icons/fa'
import { TbClockHour5 } from 'react-icons/tb'

registerLocale('es', es)
setDefaultLocale('es')

export const ModalFecha = ({ startDate, setStartDate, addNotifiacte, UpdatesharedTasksFecha, idShared }: { startDate: Date | null, setStartDate: Dispatch<SetStateAction<Date | null>>, addNotifiacte: (date: Date) => void, UpdatesharedTasksFecha: (date: Date | null) => Promise<void>, idShared: string | null }): JSX.Element => {
  const [isCalendarOpen, setIsCalendarOpen] = useState(false)
  const datePickerRef = useRef(null)

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsCalendarOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleDateChange = (date: Date): void => {
    setStartDate(date)
    addNotifiacte(date)
    UpdatesharedTasksFecha(date)
  }

  const openCalendar = (): void => {
    if (datePickerRef.current !== null) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      datePickerRef.current.setOpen(true)
      setIsCalendarOpen(true)
    }
  }

  const closeCalendar = useCallback(() => {
    setIsCalendarOpen(false)
  }, [])

  return (
    <div className="datapciker_modal w-full">
      <div className="relative">
        {idShared
          ? <>
                <div
                className="flex items-center justify-center w-fit mx-auto"
                onClick={openCalendar}
                >
                {startDate != null
                  ? <>
                     { !isCalendarOpen &&
                     <>
                        <div className="w-1/2 flex justify-center gap-0 items-center">
                            <FaRegCalendarCheck className="w-10" />
                            <span className="flex-1 w-fit bg-transparent outline-none p-0">
                            {startDate?.toLocaleDateString()}
                            </span>
                        </div>
                        <div className="w-1/2 flex justify-center gap-0 items-center">
                            <TbClockHour5 className="w-10" />
                            <span className="flex-1 w-fit bg-transparent text-left outline-none p-0">
                            {startDate?.toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit'
                            })}
                            </span>
                        </div>
                     </>}
                </>
                  : <span className='text-gray-500 text-sm'>Registrar fecha</span>
                }
                </div>

                <DatePicker
                ref={datePickerRef}
                selected={startDate}
                onChange={handleDateChange}
                onClickOutside={closeCalendar}
                onCalendarClose={closeCalendar}
                minDate={new Date()}
                showTimeSelect
                locale="es"
                timeFormat="HH:mm"
                dateFormat="MMMM d, yyyy h:mm aa"
                minTime={new Date().setHours(9, 0)}
                maxTime={new Date().setHours(18, 0)}
                className={`w-full text-center ${!isCalendarOpen ? 'hidden' : ''}`}
                />
            </>
          : <span className='text-gray-500 text-sm'>Debe colocar la tarjeta en modo publico</span>
        }
      </div>
    </div>
  )
}
