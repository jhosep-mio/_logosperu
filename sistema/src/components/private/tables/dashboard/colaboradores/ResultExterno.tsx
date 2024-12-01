import { DialogTitle } from '@mui/material'
import { IoMdCloseCircle } from 'react-icons/io'
import { icono } from '../../../../shared/Images'
import { ListaVentas } from './modals/ListaVentas'

export const ResultExterno = (): JSX.Element => {
  let estadoFinalString = ''
  let i = 0
  while (true) {
    const chunk = localStorage.getItem(`metricasColaboradores_chunk_${i}`)
    if (chunk == null || chunk.trim() == '') break
    estadoFinalString += chunk
    i++
  }
  let estadoFinal = null
  try {
    estadoFinal = JSON.parse(estadoFinalString)
    console.log(estadoFinal)
  } catch (e) {
    console.error('Error parsing JSON:', e)
    estadoFinal = null
  }
  const open = estadoFinal || null
  return (
    <div className="modal_citas_clientes99 w-full fixed h-full flex items-center inset-0 bg-white ">
      {estadoFinal && (
        <>
          <IoMdCloseCircle
            className="absolute top-2 right-2 text-4xl text-red-600 cursor-pointer"
          />
          <div className="  items-center h-fit">
            <DialogTitle className="w-full">
              <div className={'w-full flex justify-center  items-center'}>
                <img
                  src={icono}
                  alt=""
                  className="w-fit h-[60px] object-contain"
                />
              </div>
            </DialogTitle>
            <div className='w-full'>
                <ListaVentas
                    productos={open?.ventas}
                    open={open}
                    colaboradores={open?.filteredColaboradores}
                />
            </div>
          </div>
        </>
      )}
    </div>
  )
}
