/* eslint-disable multiline-ternary */
import {
  type ValuesVenta
} from '../../../shared/schemas/Interfaces'
import { Loading } from '../../../shared/Loading'
import { cn } from '../../../shared/cn'
import { FormRegistro } from './components/FormRegistro'
import { useState, useEffect } from 'react'
import { getDataVentas } from '../../../shared/FetchingData'
import { Link } from 'react-router-dom'

export const CrearHosting = (): JSX.Element => {
  const [productos, setProductos] = useState<ValuesVenta[]>([])
  const [, setTotalRegistros] = useState(0)
  const [loading, setLoading] = useState(true)

  const [clienteSeleccionado, setclienteSeleccionado] = useState<any | null>(null)

  useEffect(() => {
    Promise.all([
      getDataVentas('getClientes', setProductos, setTotalRegistros)
    ]).then(() => {
      setLoading(false)
    })
  }, [])

  return (
    <section className='p-4 w-full bg-white min-h-screen'>
      <Link to='/admin/hosting' className='bg-main w-fit rounded-md block md:absolute md:top-2 md:right-2 px-2 md:px-4 py-1 md:py-2 text-white text-sm md:text-base mb-3 md:mb-0'>Regresar</Link>
      <h1 className='text-center w-full text-black font-bold  text-2xl uppercase underline md:mb-6'>REGISTRO DE HOSTING</h1>
      <div className={cn('w-full ')}>
        {loading
          ? <Loading />
          : <FormRegistro clientes={productos} setclienteSeleccionado={setclienteSeleccionado} clienteSeleccionado={clienteSeleccionado}/>}
      </div>
    </section>
  )
}
