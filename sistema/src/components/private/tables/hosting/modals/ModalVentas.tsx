/* eslint-disable @typescript-eslint/restrict-template-expressions */
import {
  Dialog,
  DialogContent,
  DialogTitle,
  Paper,
  type PaperProps
} from '@mui/material'
import Draggable from 'react-draggable'
import { icono } from '../../../../shared/Images'
import { ListaHostingM } from './ListaHostingM'
import { useEffect, useState } from 'react'

function PaperComponent (props: PaperProps): any {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
      defaultPosition={{ x: 0, y: 0 }} // Posición inicial
    >
      <Paper {...props} />
    </Draggable>
  )
}

export const ModalVentas = ({
  open,
  setOpen,
  hostings
}: {
  hostings: any
  open: any
  setOpen: any
}): JSX.Element => {
  const [totalMontosCobrar, setTotalMontosCobrar] = useState(0)
  const [totalMontosPagar, setTotalMontosPagar] = useState(0)
  const [, setTotalHosting] = useState(0)
  const [, setTotalDominio] = useState(0)
  const [, setTotalDominioHosting] = useState(0)

  useEffect(() => {
    if (open?.estado) {
      let totalMontosCobrar = 0 // Inicializa el total como 0
      let totalMontosPagar = 0 // Inicializa el total como 0
      let totalPorHosting = 0 // Inicializa el total como 0
      let totalPorDominio = 0 // Inicializa el total como 0
      let totalPorHostingDominio = 0 // Inicializa el total como 0
      const renewalsByClient: any = {}
      hostings.forEach((orden: any) => {
        const hosting = JSON.parse(orden.hosting) || {} // Si hosting es null o undefined, usa un objeto vacío
        if (hosting?.montoC) {
          totalMontosCobrar += Number(hosting.montoC) // Suma el montoC si existe y es un número válido
        }

        if (hosting?.montoP) {
          totalMontosPagar += Number(hosting.montoP) // Suma el montoC si existe y es un número válido
        }

        if (hosting?.tiposervicio == 'Hosting') {
          totalPorHosting += Number(hosting?.montoC) // Suma el montoC si existe y es un número válido
        }
        if (hosting?.tiposervicio == 'Dominio') {
          totalPorDominio += Number(hosting?.montoC) // Suma el montoC si existe y es un número válido
        }
        if (hosting?.tiposervicio == 'Hosting + Dominio') {
          totalPorHostingDominio += Number(hosting?.montoC) // Suma el montoC si existe y es un número válido
        }

        const renewals = hosting?.fechas?.length || 0 // Obtener el número de renovaciones
        const clientName = `${hosting?.nombres ?? ''} ${
          hosting?.apellidos ?? ''
        }` // Concatenar nombres y apellidos del cliente
        renewalsByClient[orden.id] = {
          nombreCompleto: clientName,
          renovaciones: renewals,
          dominio: hosting?.dominio
        }
      })
      //   const renewalsArray: any = Object.entries(renewalsByClient).map(([idHosting, renewals]) => ({ idHosting, renewals }))
      //   setClientes(renewalsArray)
      setTotalMontosCobrar(totalMontosCobrar)
      setTotalMontosPagar(totalMontosPagar)
      setTotalHosting(totalPorHosting)
      setTotalDominio(totalPorDominio)
      setTotalDominioHosting(totalPorHostingDominio)
    }
  }, [open])

  return (
    <Dialog
      open={open.estado}
      onClose={() => {
        setOpen({ estado: false, fecha: null })
      }}
      //   aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="dialog_metricas_hosting"
      PaperComponent={PaperComponent}
      aria-labelledby="draggable-dialog-title "
    >
      <section className="w-full h-full flex gap-4">
        <div className="bg-white rounded-lg">
          <DialogTitle
            style={{ cursor: 'move' }}
            id="draggable-dialog-title"
            className="w-full"
          >
            <div className={'w-full flex justify-center items-center'}>
              <img
                src={icono}
                alt=""
                className="w-fit h-[60px] object-contain"
              />
            </div>
          </DialogTitle>
          <DialogContent>
            <ListaHostingM open={open} productos={hostings} />
          </DialogContent>
        </div>
        <div className="w-fit min-w-[430px]">
          <section className="grid grid-cols-1 w-full gap-3 ">
            <div className="w-full h-full bg-white px-0 py-2 md:p-4 rounded-lg shadow-md">
              <div className="flex justify-between px-4">
                <h1 className="w-full text-left text-gray-600 font-bold text-base md:text-xl ">
                  Renovación Anual
                </h1>
              </div>
              <section className="w-full p-4 pt-5">
                <div className="w-full flex items-center gap-2 relative pb-5">
                  <label
                    className="text-sm md:text-base w-[230px]  text-gray-600  leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="email"
                  >
                    Ventas totales anuales:
                  </label>
                  <p className="text-sm md:text-base text-black font-bold">
                    {totalMontosCobrar.toLocaleString('es-PE', {
                      style: 'currency',
                      currency: 'PEN' // Moneda peruana
                    })}
                  </p>
                </div>
                <div className="w-full flex items-center gap-2 relative pb-5">
                  <label
                    className="text-sm md:text-base w-[230px]  text-gray-600   leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    htmlFor="email"
                  >
                    Pago total de Dominios y Hostings:
                  </label>
                  <p className="text-sm md:text-base text-black font-bold">
                    {totalMontosPagar.toLocaleString('es-PE', {
                      style: 'currency',
                      currency: 'PEN' // Moneda peruana
                    })}
                  </p>
                </div>
                {open?.fecha == null && (
                  <div className="w-full flex items-center gap-2 relative pb-5">
                    <label
                      className="text-sm md:text-base w-[230px]  text-gray-600   leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      htmlFor="email"
                    >
                      Pago anual BlueHosting:
                    </label>
                    <p className="text-sm md:text-base text-black font-bold">
                      {(924).toLocaleString('es-PE', {
                        style: 'currency',
                        currency: 'PEN' // Moneda peruana
                      })}{' '}
                      (77)
                    </p>
                  </div>
                )}
                <span className="border-b border-gray-300 w-full h-2 block mb-3"></span>
                <div className="w-full flex items-center gap-2 relative pb-3">
                    {open?.fecha == null
                      ? <>
                    <label
                        className="text-sm md:text-base w-[230px]  text-gray-600   leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                    >
                        Total ganancia Anual:
                    </label>
                    <p className="text-main font-bold">
                      {(
                        totalMontosCobrar -
                        (totalMontosPagar + 924)
                      ).toLocaleString('es-PE', {
                        style: 'currency',
                        currency: 'PEN' // Moneda peruana
                      })}
                    </p>
                    </>
                      : <>
                      <label
                            className="text-sm md:text-base w-[230px]  text-gray-600   leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            htmlFor="email"
                        >
                            Ganancia total:
                        </label>
                        <p className="text-main font-bold">
                        {(
                          totalMontosCobrar -
                            (totalMontosPagar)
                        ).toLocaleString('es-PE', {
                          style: 'currency',
                          currency: 'PEN' // Moneda peruana
                        })}
                        </p>
                      </>
                  }
                </div>
                {open?.fecha == null &&
                    <div className="w-full flex items-center gap-2 relative ">
                    <label
                        className="text-sm md:text-base w-[230px]  text-gray-600   leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        htmlFor="email"
                    >
                        Total ganancia Mensual:
                    </label>
                    <p className="text-main font-bold">
                        {(
                          (totalMontosCobrar - (totalMontosPagar + 924)) /
                        12
                        ).toLocaleString('es-PE', {
                          style: 'currency',
                          currency: 'PEN' // Moneda peruana
                        })}
                    </p>
                    </div>
                }
              </section>
            </div>
            <button
              onClick={() => setOpen({ estado: false, fecha: null })}
              className="w-full py-2 px-4 bg-red-600 hover:bg-red-700 transition-colors text-white text-xl rounded-md"
            >
              Cerrar ventana
            </button>
          </section>
        </div>
      </section>
    </Dialog>
  )
}
