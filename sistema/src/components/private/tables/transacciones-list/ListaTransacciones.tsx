/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { RiEyeLine } from 'react-icons/ri'
import { Loading } from '../../../shared/Loading'
import { Paginacion } from '../../../shared/Paginacion'

export const ListaTransacciones = (): JSX.Element => {
  const token = localStorage.getItem('token')
  const [productos, setProductos] = useState([])
  const { setTitle } = useAuth()
  const [loadingComponents, setLoadingComponents] = useState(true)
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [paginaActual, setpaginaActual] = useState(1)
  const [cantidadRegistros] = useState(10)

  const getTransacciones = async (): Promise<void> => {
    try {
      setLoadingComponents(true)
      const { data } = await axios.get(`${Global.url}/checkout/findAll`, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })
      setProductos(data.message)
      setTotalRegistros(data.message.length)
    } catch (error) {
      console.log(error)
    } finally {
      setLoadingComponents(false)
    }
  }

  const indexOfLastPost = paginaActual * cantidadRegistros
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros
  const totalPosts = productos.length

  const filterDate = (): never[] => {
    return productos.slice(indexOfFirstPost, indexOfLastPost)
  }

  useEffect(() => {
    setTitle('Listado de Transacciones')
    getTransacciones()
  }, [])

  return (
    <>
      {loadingComponents
        ? (
        <Loading />
          )
        : (
        <div className="bg-white p-8 rounded-xl mt-4 text-black">
          <div className="hidden md:grid grid-cols-1 md:grid-cols-5 gap-4 mb-10 p-4 text-black">
            <h5 className="md:text-center">ID</h5>
            <h5 className="md:text-center">Cliente</h5>
            <h5 className="md:text-center">Id Transacción</h5>
            <h5 className="md:text-center">Estado</h5>
            <h5 className="md:text-center">Ver</h5>
          </div>
          {filterDate().map((pro: any) => (
            <div
              className="grid grid-cols-1 md:grid-cols-5 text-black gap-4 items-center mb-4 bg-[#E5E7EB] p-4 rounded-xl"
              key={pro.id}
            >
              <div className="md:text-center">
                <h5 className="md:hidden text-black font-bold mb-2">ID</h5>
                <span>#{pro.id}</span>
              </div>
              <div className="md:text-center">
                <h5 className="md:hidden text-black font-bold mb-2">Cliente</h5>
                <span>
                  {JSON.parse(pro.detalle_form).nombres}{' '}
                  {JSON.parse(pro.detalle_form).apellidos}
                </span>
              </div>

              <div className="md:text-center">
                <h5 className="md:hidden text-black font-bold mb-2">
                  Id Transacción
                </h5>
                <span>{pro.paymentId}</span>
              </div>

              <div className="md:text-center">
                <h5 className="md:hidden text-black font-bold mb-2">Estado</h5>
                {pro.estado == 0
                  ? (
                  <span className="bg-green-500 py-2 px-3 text-black  rounded-md">
                    PENDIENTE
                  </span>
                    )
                  : pro.estado == 1
                    ? (
                  <span className="bg-main py-2 px-3 text-black  rounded-md">
                    TERMINADO
                  </span>
                      )
                    : (
                        ''
                      )}
              </div>

              <div className="md:text-center md:flex md:justify-center">
                <h5 className="md:hidden text-black font-bold mb-2">VER</h5>
                <Link to={`viewTransaccion/${pro.id}`}>
                  <RiEyeLine className="text-2xl text-whtie" />
                </Link>
              </div>
            </div>
          ))}

          <div className="flex flex-col md:flex-row gap-5 md:gap-0 justify-between content_buttons ">
            <p className="text-md ml-1"> {totalRegistros} Registros </p>
            <Paginacion
              totalPosts={totalPosts}
              cantidadRegistros={cantidadRegistros}
              paginaActual={paginaActual}
              setpaginaActual={setpaginaActual}
            />
          </div>
        </div>
          )}
    </>
  )
}
