/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useEffect, useState } from 'react'
import useAuth from '../../../../hooks/useAuth'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { Loading } from '../../../shared/Loading'
import { Paginacion } from '../../../shared/Paginacion'
import { format } from 'date-fns'
import { es } from 'date-fns/locale' // Importar el locale español si lo necesitas
import Bowser from 'bowser'

export const ListaCarrito = (): JSX.Element => {
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
      const { data } = await axios.get(`${Global.url}/carrito/findAll`, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })
      setProductos(data)
      setTotalRegistros(data.length)
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
          <div className="hidden md:grid grid-cols-1 md:grid-cols-6 gap-4 mb-10 p-4 text-black">
            <h5 className="md:text-center">ID</h5>
            <h5 className="md:text-center">IP</h5>
            <h5 className="md:text-center">Servicio</h5>
            <h5 className="md:text-center">Plan</h5>
            <h5 className="md:text-center">Dispositvo</h5>
            <h5 className="md:text-center">Fecha</h5>
          </div>
          {filterDate().map((pro: any) => {
            const browser = Bowser.getParser(pro.user_agent)

            // Extraer información
            const browserName = browser.getBrowserName() // Ej: Chrome
            const browserVersion = browser.getBrowserVersion() // Ej: 128.0.0.0
            const osName = browser.getOSName() // Ej: Mac OS
            const deviceType = browser.getPlatformType() // Ej: desktop
            return (
              <div
                className="grid grid-cols-1 md:grid-cols-6 text-black gap-4 items-center mb-4 bg-[#E5E7EB] p-4 rounded-xl"
                key={pro.id}
              >
                <div className="md:text-center">
                  <h5 className="md:hidden text-black font-bold mb-2">ID</h5>
                  <span>#{pro.id}</span>
                </div>
                <div className="md:text-center">
                  <h5 className="md:hidden text-black font-bold mb-2">IP</h5>
                  <span>{pro.ip}</span>
                </div>

                <div className="md:text-center">
                  <h5 className="md:hidden text-black font-bold mb-2">
                    Servicio
                  </h5>
                  <span>{pro.servicio}</span>
                </div>

                <div className="md:text-center">
                  <h5 className="md:hidden text-black font-bold mb-2">Plan</h5>
                  <span>{pro.plan}</span>
                </div>

                <div className="md:text-center md:flex md:justify-center">
                  <h5 className="md:hidden text-black font-bold mb-2">
                    Dispostivo
                  </h5>
                  <span>{`${browserName} v${browserVersion} en ${osName} (${deviceType})`}</span>
                </div>

                <div className="md:text-center md:flex md:justify-center">
                  <h5 className="md:hidden text-black font-bold mb-2">Fecha</h5>
                  <span>
                    {format(
                      new Date(pro.created_at),
                      "dd 'de' MMMM 'de' yyyy, hh:mm a",
                      { locale: es }
                    )}
                  </span>
                </div>
              </div>
            )
          })}

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
