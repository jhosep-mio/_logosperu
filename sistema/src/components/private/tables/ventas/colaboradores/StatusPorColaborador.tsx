import { useState } from 'react'
import { Loading } from '../../../../shared/Loading'
import { TableStatusToColaborador } from './TableStatusToColaborador'
export const StatusPorColaborador = (): JSX.Element => {
  const [loading] = useState(false)

  return (
    <>
      <div className="w-full h-auto ">
        {loading
          ? (
          <Loading />
            )
          : (
          <div className="card w-full h-full ">
            <form className="flex flex-col w-full h-full min-h-screen">
              <div className="flex w-full mt-5 md:mt-5 flex-col">
                <div className="w-full flex flex-col text-white">
                    <TableStatusToColaborador/>
                </div>
              </div>
            </form>
          </div>
            )}
      </div>
    </>
  )
}
