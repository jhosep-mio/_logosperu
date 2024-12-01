/* eslint-disable @typescript-eslint/no-confusing-void-expression */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useState } from 'react'
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from '../../components/Card'
import { Modal } from 'react-bootstrap'

const InfiniteScrollModal = ({ totalData, clientes, isOpen, setIsOpen }: { totalData: any, clientes: any, isOpen: boolean, setIsOpen: (open: boolean) => void }): JSX.Element => {
  // Filtrar solo los correos que tienen al menos un enlace abierto
  const filteredEmails = totalData
    ?.flatMap((campana: any) => campana.abiertos ? JSON.parse(campana.abiertos) : [])
    .filter((correo: any) => correo.clicks?.length > 0) || []

  const [expandedIndex, setExpandedIndex] = useState<any | null>(null)

  const toggleAccordion = (correo: number): void => {
    setExpandedIndex(expandedIndex == correo ? null : correo)
  }

  return (
    <Modal show={isOpen} onHide={() => { setIsOpen(false) }}>
      <Card className='h-screen'>
        <CardHeader className='h-[60px] w-full relative'>
          <CardTitle className='text-black text-center w-full'>Registros con Enlaces Abiertos</CardTitle>
          <button type='button' className='bg-main rounded-md hover:bg-main_dark text-black text-center absolute top-0 right-0 px-4 py-1'
          onClick={() => setIsOpen(false)}
          >Regresar</button>
        </CardHeader>
        <CardContent className="h-[calc(100vh-60px)] overflow-y-auto">
          <div className="grid grid-cols-2 gap-4">
            {filteredEmails
              .sort((a: any, b: any) => (b.clicks?.length || 0) - (a.clicks?.length || 0))
              .filter((correo: any) => correo.email != 'ventas@hostbacon.lat' && correo.email != 'jamiom@ucvvirtual.edu.pe' && correo.email != 'jhmio2002@gmail.com')
              .map((correo: any, index: any) => (
              <div className="flex items-center cursor-pointer" key={index}
                 onClick={() => { toggleAccordion(correo) }}
              >
                <span className="relative flex shrink-0 overflow-hidden rounded-full h-9 w-9">
                  {clientes
                    .filter((cliente: any) => cliente.email === correo.email)
                    .map((cliente: any, idx: number) => (
                      <img
                        key={idx}
                        className="aspect-square h-full w-full"
                        alt="Avatar"
                        src={
                          cliente.sexo === 'mujer'
                            ? 'https://ui.shadcn.com/avatars/01.png'
                            : 'https://ui.shadcn.com/avatars/02.png'
                        }
                      />
                    ))}
                </span>
                <div className="ml-4 space-y-1 text-black">
                  <p className="text-sm font-medium leading-none">
                    {clientes
                      .filter((cliente: any) => cliente.email === correo.email)
                      .map((cliente: any) => `${cliente.nombres} ${cliente.apellidos}`)}
                  </p>
                  <p className="text-sm text-muted-foreground">{correo.email}</p>
                </div>
                <div className="ml-auto font-medium text-green-700">
                  + {correo.clicks ? correo.clicks.length : 0}
                </div>
              </div>
              ))}
          </div>
        </CardContent>
      </Card>
      {expandedIndex && (
            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]">
              <div className="px-4 py-2 bg-gray-50">
                <h3 className="text-sm font-semibold text-gray-800 mb-2">
                  Enlaces visitados:
                </h3>
                <ul>
                  {expandedIndex.clicks.map(
                    (click: any, clickIndex: number) => (
                      <li key={clickIndex} className="mb-1">
                        <a
                          href={click.link}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {click.link}
                        </a>
                        <p className="text-xs text-gray-500">
                          Clickeado el:{' '}
                          {new Date(click.fechaHora).toLocaleString()}
                        </p>
                      </li>
                    )
                  )}
                </ul>
                <button
                  onClick={() => {
                    setExpandedIndex(null)
                  }}
                  className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-700"
                >
                  Cerrar
                </button>
              </div>
            </div>
      )}
    </Modal>
  )
}

export default InfiniteScrollModal
