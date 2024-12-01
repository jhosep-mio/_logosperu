import { Dialog, DialogContent } from '@mui/material'
import { type Dispatch, type SetStateAction } from 'react'

const monthNames = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre'
]

export const ModalOptions = ({
  open,
  setOpen,
  selectedYear,
  years,
  handleYearChange,
  monthsOfYear,
  setSelectedYear,
  setMonthsOfYear,
  selectedMonths,
  handleMonthChange
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  selectedYear: number | null
  handleYearChange: (year: number) => void
  years: any
  monthsOfYear: number[]
  setSelectedYear: Dispatch<SetStateAction<number | null>>
  setMonthsOfYear: Dispatch<SetStateAction<number[]>>
  handleMonthChange: (selectedMonth: number) => void
  selectedMonths: number[]
}): JSX.Element => {
  // APLICAR FILTROS

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false)
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className=""
      >
        <DialogContent className="w-[400px]">
          <h2 className="text-gray-600 font-bold text-xl w-full text-center">
            Filtros
          </h2>
          <hr className="my-3" />

          <div className="grid grid-cols-1 gap-4 w-full">
            <div className="w-full">
              <div className="flex flex-col gap-0">
                <div className="w-full">
                  <h2 className="text-lg text-gray-700 mt-4 pl-1">Año</h2>
                  <div className="mt-1 flex gap-3">
                    <select
                      value={selectedYear ?? ''}
                      onChange={(e) => {
                        const year =
                          e.target.value !== ''
                            ? parseInt(e.target.value)
                            : null
                        setSelectedYear(year)
                        if (year === null) {
                          setMonthsOfYear([])
                        } else {
                          handleYearChange(year)
                        }
                      }}
                      className="w-full outline-none border rounded-md px-2 py-2 focus:outline-none"
                    >
                      <option value="">Todos</option>
                      {years.map((year: number) => (
                        <option value={year} key={year}>
                          {year}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
                {selectedYear && !Number.isNaN(selectedYear) && (
                  <div className="w-full">
                    <h2 className="text-lg text-gray-700 mt-4 pl-1">Meses</h2>
                    <div className="mt-1 grid grid-cols-3 px-2">
                      {monthsOfYear
                        .sort((a, b) => a - b)
                        .map((month) => (
                          <label
                            key={month}
                            className="flex items-center gap-2"
                          >
                            <input
                              type="checkbox"
                              value={month}
                              checked={selectedMonths.includes(month)}
                              onChange={() => {
                                handleMonthChange(month)
                              }}
                              className="form-checkbox rounded text-primary"
                            />
                            {monthNames[month - 1]}
                          </label>
                        ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}
