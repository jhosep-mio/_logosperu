import axios from 'axios'
import Swal, { type SweetAlertResult } from 'sweetalert2'
import { Global } from '../../helper/Global'
import { type deleteValuesNew } from './schemas/Interfaces'
import { getDataNew } from './FetchingData'

export const DeleteItemsNew = ({
  ruta,
  id,
  token,
  totalPosts,
  cantidadRegistros,
  paginaActual,
  setpaginaActual,
  rutaFetch,
  setData,
  setTotalRegistros
}: deleteValuesNew): void => {
  Swal.fire({
    title: `¿Estas seguro de eliminar al registro N° ${id ?? ''}?`,
    showDenyButton: true,
    confirmButtonText: 'Eliminar',
    denyButtonText: 'Cancelar'
  }).then(async (result: SweetAlertResult) => {
    if (result.isConfirmed) {
      try {
        const resultado = await axios.delete(`${Global.url}/${ruta}/${id ?? ''}`, {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        })

        if (resultado.data.status == 'success') {
          Swal.fire('Registro eliminado correctamente', '', 'success')
          Promise.all([
            getDataNew(rutaFetch, setData, setTotalRegistros)
          ]).then(() => {
            const ultimoRegistroEnPaginaActual = paginaActual * cantidadRegistros
            if (ultimoRegistroEnPaginaActual > totalPosts && paginaActual > 1) {
              setpaginaActual(paginaActual - 1)
            }
          })
        } else {
          Swal.fire('Error al eliminar el registro', '', 'error')
        }
      } catch (error) {
        Swal.fire('Error al eliminar el registro', '', 'error')
        console.log(error)
      }
    }
  })
}
