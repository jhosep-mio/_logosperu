import { Dialog } from '@mui/material'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export const FiltorsHosting = ({
  open,
  setOpen,
  selectedDate,
  setSelectedDate,
  selectPrecio,
  setSelectPrecio,
  selectAntiguo,
  setSelectAntiguo
}: any): JSX.Element => {
  const handleDateChange = (date: Date | null): void => {
    setSelectedDate(date)
    setOpen(false)
  }

  return (
    <Dialog
      onClose={() => setOpen(!open)}
      open={open}
      className="dialog_hositng"
    >
      <div className="w-full md:w-[400px] p-4 h-fit">
        <div className="w-full flex flex-col gap-3 relative pb-5">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="email"
          >
            FILTRO POR MESES
          </label>
          <DatePicker
            selected={selectedDate}
            onChange={handleDateChange}
            dateFormat="MM"
            showMonthYearPicker
            placeholderText="SELECCIONAR"
            className="text-black date_hosting w-full text-center select-none cursor-pointer border outline-none border-gray-400 p-1 rounded-md"
          />
        </div>
        <div className="w-full flex flex-col gap-3 relative pb-5">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="email"
          >
            FILTRO POR PRECIO
          </label>
          <select
            className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
            value={selectPrecio}
            onChange={(e) => { setSelectPrecio(e.target.value); setOpen(false); setSelectAntiguo(null) }}
          >
            {/* FB GOOGLE, VENTAS, POST VENTA, RECOMENDACION, ISNTAGRAM) */}
            <option value="">Seleccionar</option>
            <option value="MAYOR PRECIO">MAYOR PRECIO</option>
            <option value="MENOR PRECIO">MENOR PRECIO</option>
          </select>
        </div>
        <div className="w-full flex flex-col gap-3 relative">
          <label
            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            htmlFor="email"
          >
            FILTRO POR ANTIGUEDAD
          </label>
          <select
            className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
            value={selectAntiguo}
            onChange={(e) => { setSelectAntiguo(e.target.value); setOpen(false); setSelectPrecio(null) }}
          >
            {/* FB GOOGLE, VENTAS, POST VENTA, RECOMENDACION, ISNTAGRAM) */}
            <option value="">Seleccionar</option>
            <option value="MAS ANTIGUOS">MAS ANTIGUOS</option>
            <option value="MAS NUEVOS">MAS NUEVOS</option>
          </select>
        </div>
      </div>
    </Dialog>
  )
}
