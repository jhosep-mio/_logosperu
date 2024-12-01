import { Dialog, DialogContent } from '@mui/material'
import { IoCloseCircle } from 'react-icons/io5'
import { SubirArchivo } from './SubirArchivo'
import { useState } from 'react'
import { cn } from '../../../../shared/cn'

export const ModalRenovacion = ({
  loading,
  montoPrecio,
  setMontoprecio,
  banco,
  setBanco,
  setFactura,
  factura,
  open,
  setOpen,
  archivosSubido,
  setArchivosSubido,
  nuevaFecha,
  setNuevaFecha,
  nuevoPrecio,
  setNuevoPrecio,
  agregarFecha
}: any): JSX.Element => {
  const [openArchivo, setOpenArchivo] = useState(false)

  return (
    <Dialog
      open={open.estado}
      onClose={() => setOpen({ ...open, estado: !open.estado })}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="lg"
    >
      <DialogContent>
        <div className="w-full h-full flex flex-col items-center justify-center relative">
          <IoCloseCircle
            className="absolute top-2 right-2 text-main text-2xl opacity-0 group-hover:opacity-100 transition-all cursor-pointer"
            onClick={() => setOpen({ ...open, estado: !open.estado })}
          />
          <h3 className="mb-4 text-black font-bold ">RENOVACIÓN</h3>
          <section className="w-full flex gap-3 items-center">
            <div className="w-full lg:relative ">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="email"
              >
                Fecha
              </label>
              <input
                className="h-9 w-full text-black rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                name="inicio"
                type="date"
                value={nuevaFecha}
                onChange={(e) => {
                  setNuevaFecha(e.target.value)
                }}
              />
            </div>
            <div className="w-full lg:relative ">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="email"
              >
                Precio total
              </label>
              <input
                className="h-9 w-full  text-black rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                name="precio"
                type="number"
                value={nuevoPrecio}
                onChange={(e) => {
                  setNuevoPrecio(e.target.value)
                }}
              />
            </div>
            <div className="w-full lg:relative ">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="email"
              >
                Monto cobrado
              </label>
              <input
                className="h-9 w-full  text-black rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                name="precio"
                type="number"
                value={montoPrecio}
                onChange={(e) => {
                  setMontoprecio(e.target.value)
                }}
              />
            </div>
          </section>
          <section className="w-full flex gap-3 mt-4">
            <div className="w-full lg:relative pb-5">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="email"
              >
                Comprobante
              </label>
              <select
                className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                name="factura"
                value={factura}
                onChange={(e) => {
                  setFactura(e.target.value)
                }}
                disabled={false}
              >
                <option value="">Seleccionar</option>
                <option value="Con factura">Con factura</option>
                <option value="Sin factura">Sin factura</option>
              </select>
            </div>
            <div className="w-full lg:relative pb-5">
              <label
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                htmlFor="email"
              >
                Entidad bancaria
              </label>
              <select
                className="flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed"
                name="banco"
                value={banco}
                onChange={(e) => {
                  setBanco(e.target.value)
                }}
                disabled={false}
              >
                <option value="">Seleccionar</option>
                <option value="BCP">BCP</option>
                <option value="BBVA">BBVA</option>
                <option value="YAPE">YAPE</option>
                <option value="PLIN">PLIN</option>
                <option value="XOOM">XOOM</option>
                <option value="MONEY GRAM">MONEY GRAM</option>
                <option value="WESTER UNION">WESTER UNION</option>
                <option value="PLIN">PLIN</option>
                <option value="TARJETA DE CREDITO">TARJETA DE CREDITO</option>
                <option value="MERCADO PAGO">MERCADO PAGO</option>
                <option value="OTROS">OTROS</option>
              </select>
            </div>
          </section>

          {!archivosSubido
            ? (
            <button
              className="mt-3 border-b-2 border-blue-500 hover:text-blue-500 transition-colors"
              type="button"
              onClick={() => {
                setOpenArchivo(true)
              }}
            >
              CARGAR DOCUMENTO
            </button>
              )
            : (
            <span className="mt-1 flex gap-1 items-center">
              {archivosSubido.name}{' '}
              <span
                className="text-red-500 text-2xl cursor-pointer font-bold"
                onClick={() => setArchivosSubido(null)}
              >
                x
              </span>{' '}
            </span>
              )}

          <SubirArchivo
            open={openArchivo}
            setOpen={setOpenArchivo}
            setArchivosSubido={setArchivosSubido}
            archivosSubido={archivosSubido}
          />

          <input
            type="button"
            disabled={loading}
            className={cn('px-3 py-2 mt-4 text-white rounded-md cursor-pointer hover:bg-secundario_dark transition-colors', loading ? 'bg-secundario_dark' : 'bg-secondary-150 ')}
            value={`${!loading ? 'Guardar' : 'Guardando...'}`}
            // eslint-disable-next-line @typescript-eslint/no-misused-promises
            onClick={async () => {
              await agregarFecha(open.id, open.hosting, open.orden)
            }}
          />
        </div>
      </DialogContent>
    </Dialog>
  )
}
