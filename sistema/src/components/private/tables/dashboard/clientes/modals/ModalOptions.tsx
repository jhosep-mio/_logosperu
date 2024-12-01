import { Dialog, DialogContent } from '@mui/material'
import { type Dispatch, type SetStateAction } from 'react'
import { LuFolderClock, LuFolderCheck } from 'react-icons/lu'
import { type filtrosValues } from '../../../../../shared/schemas/Interfaces'

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
  filtroSeleccionado,
  setFiltroSeleccionado,
  paises,
  selectedYear,
  years,
  handleYearChange,
  monthsOfYear,
  setSelectedYear,
  setMonthsOfYear,
  selectedMonths,
  handleMonthChange,
  departamentos,
  distritos
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  filtroSeleccionado: filtrosValues | null
  setFiltroSeleccionado: Dispatch<SetStateAction<filtrosValues | null>>
  selectedYear: number | null
  paises: Record<string, number>
  handleYearChange: (year: number) => void
  years: any
  monthsOfYear: number[]
  setSelectedYear: Dispatch<SetStateAction<number | null>>
  setMonthsOfYear: Dispatch<SetStateAction<number[]>>
  handleMonthChange: (selectedMonth: number) => void
  selectedMonths: number[]
  departamentos: Record<string, Record<string, number>>
  distritos: Record<string, Record<string, Record<string, number>>>
}): JSX.Element => {
  // APLICAR FILTROS
  const handleFiltroEstado = (filtro: string): void => {
    setFiltroSeleccionado((prev: any) => {
      if (prev?.estado === filtro) {
        return { ...prev, estado: null } // Desactiva el filtro si ya estaba activo
      } else {
        return { ...prev, estado: filtro } // Activa el filtro seleccionado y desactiva los demás
      }
    })
  }

  const handleFiltroPais = (e: any): void => {
    setFiltroSeleccionado((prev: any) => {
      if (prev?.pais === e.target.value) {
        return { ...prev, pais: null }
      } else {
        return { ...prev, pais: e.target.value }
      }
    })
  }

  const handleFiltroDepartamento = (e: any): void => {
    setFiltroSeleccionado((prev: any) => {
      if (prev?.departamento == e.target.value) {
        return { ...prev, departamento: null }
      } else {
        return { ...prev, departamento: e.target.value }
      }
    })
  }

  const handleFiltroDistrito = (e: any): void => {
    const distritoSeleccionado = e.target.value
    setFiltroSeleccionado((prev: any) => ({
      ...prev,
      distrito: distritoSeleccionado === '' ? null : distritoSeleccionado
    }))
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={() => {
          setOpen(false)
        }}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
        className="modal_options_metricas"
      >
        <DialogContent className="w-full">
          <h2 className="text-gray-600 font-bold text-xl w-full text-center">
            Filtros
          </h2>
          <hr className="my-3" />

          <div className="grid grid-cols-2 gap-4">
            <div className="w-full">
              <h2 className="text-lg text-gray-700 mt-4 pl-1">Estado</h2>
              <div className="mt-1 flex gap-3">
                <div
                  className={`border  rounded-lg p-3 w-1/2 flex flex-col gap-2 cursor-pointer ${
                    filtroSeleccionado?.estado == '0'
                      ? 'border-secundario/80'
                      : 'border-gray-300'
                  } hover:border-secundario/80 transition-colors group`}
                  onClick={() => {
                    handleFiltroEstado('0')
                  }}
                >
                  <LuFolderCheck
                    className={`text-2xl ${
                      filtroSeleccionado?.estado == '0'
                        ? 'text-secundario/80'
                        : 'text-gray-500'
                    }  group-hover:text-secundario/80 transition-colors`}
                  />
                  <span
                    className={`text-lg ${
                      filtroSeleccionado?.estado == '0'
                        ? 'text-secundario'
                        : 'text-gray-600'
                    } group-hover:text-secundario transition-colors`}
                  >
                    Nuevos
                  </span>
                </div>
                <div
                  className={`border  rounded-lg p-3 w-1/2 flex flex-col gap-2 cursor-pointer ${
                    filtroSeleccionado?.estado == '1'
                      ? 'border-secundario/80'
                      : 'border-gray-300'
                  } hover:border-secundario/80 transition-colors group`}
                  onClick={() => {
                    handleFiltroEstado('1')
                  }}
                >
                  <LuFolderClock
                    className={`text-2xl ${
                      filtroSeleccionado?.estado == '1'
                        ? 'text-secundario/80'
                        : 'text-gray-500'
                    }  group-hover:text-secundario/80 transition-colors`}
                  />
                  <span
                    className={`text-lg ${
                      filtroSeleccionado?.estado == '1'
                        ? 'text-secundario'
                        : 'text-gray-600'
                    } group-hover:text-secundario transition-colors`}
                  >
                    Antiguos
                  </span>
                </div>
              </div>
              <h2 className="text-lg text-gray-700 mt-4 pl-1">Pais</h2>
              <div className="mt-1 flex gap-3">
                <select
                  name=""
                  id=""
                  value={filtroSeleccionado?.pais}
                  onChange={(e) => {
                    handleFiltroPais(e)
                  }}
                  className={`w-full outline-none border rounded-md ${
                    filtroSeleccionado?.pais
                      ? 'border-secundario'
                      : 'border-gray-300'
                  } px-2 py-2 focus:outline-none`}
                >
                  <option value="">Todos</option>
                  {paises
                    ? (
                        Object.keys(paises).map((nombre, index) => (
                      <option value={nombre} key={index}>
                        {nombre}
                      </option>
                        ))
                      )
                    : (
                    <option value="">Cargando...</option>
                      )}
                </select>
              </div>
              {filtroSeleccionado?.pais && (
                <>
                  <h2 className="text-lg text-gray-700 mt-4 pl-1">Ciudad</h2>
                  <div className="mt-1 flex gap-3">
                    <select
                      name=""
                      id=""
                      value={filtroSeleccionado?.departamento}
                      onChange={(e) => {
                        handleFiltroDepartamento(e)
                      }}
                      className={`w-full outline-none border rounded-md ${
                        filtroSeleccionado?.departamento
                          ? 'border-secundario'
                          : 'border-gray-300'
                      } px-2 py-2 focus:outline-none`}
                    >
                      <option value="">Todos</option>
                      {filtroSeleccionado?.pais &&
                        departamentos[filtroSeleccionado.pais] &&
                        Object.keys(departamentos[filtroSeleccionado.pais]).map(
                          (nombre, index) => (
                            <option value={nombre} key={index}>
                              {nombre}
                            </option>
                          )
                        )}
                    </select>
                  </div>
                </>
              )}
              {filtroSeleccionado?.departamento && (
                <>
                  <h2 className="text-lg text-gray-700 mt-4 pl-1">Distrito</h2>
                  <div className="mt-1 flex gap-3">
                    <select
                      name=""
                      id=""
                      value={filtroSeleccionado?.distrito}
                      onChange={(e) => {
                        handleFiltroDistrito(e)
                      }}
                      className={`w-full outline-none border rounded-md ${
                        filtroSeleccionado?.distrito
                          ? 'border-secundario'
                          : 'border-gray-300'
                      } px-2 py-2 focus:outline-none`}
                    >
                      <option value="">Todos</option>
                      {filtroSeleccionado?.departamento &&
                        filtroSeleccionado?.pais &&
                        distritos[filtroSeleccionado.pais] &&
                        distritos[filtroSeleccionado.pais][
                          filtroSeleccionado.departamento
                        ] &&
                        Object.keys(
                          distritos[filtroSeleccionado.pais][
                            filtroSeleccionado.departamento
                          ]
                        ).map((nombre, index) => (
                          <option value={nombre} key={index}>
                            {nombre}
                          </option>
                        ))}
                    </select>
                  </div>
                </>
              )}
            </div>
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
                      {years.map((year: any) => (
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
