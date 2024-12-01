import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import { Loading } from '../../../shared/Loading'
import LinesChart from '../../../shared/metricas/LinesChart'
import { IoEnterOutline } from 'react-icons/io5'
export const Metricas = (): JSX.Element => {
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
            <form className="flex flex-col bg-[#E0E3E8]  w-full h-full min-h-screen">
              <Link
                to="/admin/lista-ventas"
                className="cursor-pointer absolute right-2 top-2 text-white bg-red-500 p-2 flex items-center justify-center rounded-lg"
              >
                <IoEnterOutline className="text-2xl ml-[-2px]"/>
              </Link>
              <div className="flex w-full mt-5 md:mt-5 flex-col">
                <div className="w-full flex flex-col text-white">
                  <div>
                    <LinesChart />
                  </div>
                </div>
              </div>
            </form>
          </div>
            )}
      </div>
    </>
  )
}
