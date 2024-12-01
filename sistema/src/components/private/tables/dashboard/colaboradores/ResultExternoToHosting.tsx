import { DialogTitle } from '@mui/material'
import { icono } from '../../../../shared/Images'
import { ListaHosting } from './modals/ListaHosting'

export const ResultExternoToHosting = (): JSX.Element => {
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
        <div className="  items-center h-full w-full">
          <DialogTitle className="w-full">
            <div className={'w-full flex justify-center  items-center'}>
              <img
                src={icono}
                alt=""
                className="w-fit h-[60px] object-contain"
              />
            </div>
          </DialogTitle>
          <div className="w-full h-[90vh] overflow-y-auto">
            <ListaHosting productos={open?.ventas} open={open} />
          </div>
        </div>
      )}
    </div>
  )
}
