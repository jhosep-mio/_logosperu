import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import { Loading } from '../../../shared/Loading'
import LinesChart from '../../../shared/metricas/LinesChart'
export const Metricas = (): JSX.Element => {
  const { setTitle } = useAuth()
  const [loading] = useState(false)

  useEffect(() => {
    setTitle('METRICAS - PREVENTA')
  }, [])

  return (
    <>
      <div className="">
        {loading
          ? (
          <Loading />
            )
          : (
          <div className="card">
            <form className="flex flex-col bg-white rounded-md mt-4 p-4 md:p-10">
              <div className="flex w-full mt-5 md:mt-5 flex-col">
                <div className="w-full flex flex-col text-white">
                  <div>
                    <LinesChart />
                  </div>
                </div>
              </div>
              <div className="flex w-full justify-end gap-3 rounded-md text-black mt-5">
                <Link
                  to="/admin/lista-ventas"
                  className="bg-red-600 px-3 py-2 rounded-md text-white cursor-pointer"
                >
                  Regresar
                </Link>
              </div>
            </form>
          </div>
            )}
      </div>
    </>
  )
}
