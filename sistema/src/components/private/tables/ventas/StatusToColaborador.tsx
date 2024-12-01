import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import { Loading } from '../../../shared/Loading'
import { IoEnterOutline } from 'react-icons/io5'
import { TableStatusToColaborador2 } from './status/TableStatusToColaborador2'
export const StatusToColaborador = (): JSX.Element => {
  const { setTitle } = useAuth()
  const [loading] = useState(false)

  useEffect(() => {
    setTitle('METRICAS - PREVENTA')
  }, [])

  return (
    <>
      <div className="w-full h-auto ">
        {loading
          ? (
          <Loading />
            )
          : (
          <div className="card w-full h-full ">
            <form className="flex flex-col bg-[#E0E3E8]  w-fit h-full min-h-screen">
              <Link
                to="/admin/lista-ventas"
                className="cursor-pointer absolute right-2 top-2 text-white bg-red-500 p-2 flex items-center justify-center rounded-lg"
              >
                <IoEnterOutline className="text-2xl ml-[-2px]"/>
              </Link>
              <div className="flex w-fit mt-5 md:mt-5 flex-col">
                <div className="w-fit flex flex-col text-white">
                    <TableStatusToColaborador2 />
                </div>
              </div>
            </form>
          </div>
            )}
      </div>
    </>
  )
}
