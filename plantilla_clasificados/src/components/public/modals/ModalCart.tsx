import * as React from 'react'
import Dialog from '@mui/material/Dialog'
import Slide from '@mui/material/Slide'
import { type TransitionProps } from '@mui/material/transitions'
import { IoCloseCircle } from 'react-icons/io5'
import { Global } from '../../../helper/Global'
import { RemoveItemCart } from '../carrito/RemoveItemCart'
import useAuth from '../../../hooks/useAuth'
import { Total } from '../carrito/Total'

const Transition = React.forwardRef(function Transition (
  props: TransitionProps & {
    children: React.ReactElement<any, any>
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="up" ref={ref} {...props} />
})

export interface SimpleDialogProps {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
}

export const ModalCart = ({
  open,
  setOpen
}: SimpleDialogProps): JSX.Element => {
  const handleClose = (): void => {
    setOpen(false)
  }
  const { cart } = useAuth()

  function calculateTotal (): string {
    let total = 0
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i]
      if (item.precio !== null && item.cantidad) {
        const subtotal = item.precio * item.cantidad
        total += subtotal
      }
    }
    return total.toFixed(2) // Redondeamos a dos decimales
  }

  const exportToWhatsApp = (): void => {
    // Crear el mensaje con los productos del carrito
    const productList = cart
      // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
      .map((item) => `- ${item.nombre} x${item.cantidad} - S/. ${item.precio}`)
      .join('\n')

    // Crear el mensaje completo con título, subtitulo, listado y total
    const message = `¡Hola! Te envío la cotización de mi carrito de compras:\n\n${productList}\n\nTotal: S/. ${calculateTotal()}`
    // Reemplazar '1234567890' con tu número de teléfono
    const phoneNumber = '+51960613700'
    // Crear la URL de WhatsApp con el mensaje prellenado y tu número de teléfono
    const whatsappURL = `whatsapp://send?phone=${phoneNumber}&text=${encodeURIComponent(
      message
    )}`

    window.open(whatsappURL, '_blank')
  }

  return (
    <div className="carrito_modal">
      <Dialog
        open={open}
        TransitionComponent={Transition}
        keepMounted
        fullScreen
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
        className="w-full md:w-[400px] right-0 quitar_ss"
      >
        <section className="w-full h-screen ">
          <div className="w-full lg:right-0 h-full transition-all z-50">
            {/* Orders */}
            <div className=" text-gray-700 flex flex-col h-full bg-[#262837]">
              <div className="border-t-[3px] border-paleta-500 px-4 py-4 shadow-sm relative h-fit">
                <IoCloseCircle
                  className="absolute right-2 top-0 bottom-0 my-auto p-1 box-content text-gray-700 rounded-full text-2xl cursor-pointer hover:text-gray-600 transition-colors"
                  onClick={() => {
                    setOpen(false)
                  }}
                />
                <h1 className="text-2xl text-center text-white">Mi carrito</h1>
              </div>
              {/* Car */}
              <div className="bg-gray-200 ">
                <div className="grid grid-cols-8 py-3 px-6">
                  <h5 className="col-span-3 text-sm text-left">Producto</h5>
                  <h5 className="col-span-2 text-sm text-center">Cantidad</h5>
                  <h5 className="col-span-2 text-sm text-center">Precio</h5>
                  <h5 className="col-span-1 text-sm text-center"></h5>
                </div>
                {/* Products */}
                <div className="overflow-y-auto controlar_alto px-4 ">
                  {/* Product */}
                  {cart.length > 0
                    ? (
                        cart.map((car) => (
                      <>
                        <div
                          className="bg-white p-4 rounded-md mb-4"
                          key={car.id}
                        >
                          <div className="grid grid-cols-8">
                            <div className="col-span-3 flex items-center gap-5">
                              <img
                                src={`${Global.urlImages}/productos/${car.imagen1}`}
                                className="w-10 h-10 object-cover"
                                alt="Carrito"
                              />
                              <div>
                                <h5 className="text-sm line-clamp-2 overflow-hidden">
                                  {car.nombre}
                                </h5>
                                <p className="text-xs text-gray-500">
                                  {car.categoria}
                                </p>
                              </div>
                            </div>
                            <div className="w-full col-span-2 h-full">
                              <span className="text-center w-full h-full text-sm flex items-center justify-center">
                                {car.cantidad}
                              </span>
                            </div>
                            <div className="w-full col-span-2 h-full">
                              <span className="text-center w-full text-sm h-full flex items-center justify-center">
                                S/. {car.precio}
                              </span>
                            </div>
                            <button>
                              <RemoveItemCart producto={car} />
                            </button>
                            <div className="flex justify-center items-center" />
                          </div>
                        </div>
                      </>
                        ))
                      )
                    : (
                    <div className="w-full h-full flex items-center justify-center">
                      <p className="w-full text-center text-xl">
                        Aun no tienes productos en el carrito.
                      </p>
                    </div>
                      )}
                </div>
              </div>
              <div className="bg-white w-full h-fit p-4">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-gray-700">Total</span>
                  <Total />
                </div>
                <div>
                  <button
                    onClick={() => {
                      exportToWhatsApp()
                    }}
                    className="bg-paleta-500 text-white w-full py-2 px-4 rounded-lg"
                  >
                    Enviar cotización
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </Dialog>
    </div>
  )
}
