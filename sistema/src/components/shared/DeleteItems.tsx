import axios from 'axios'
import Swal, { type SweetAlertResult } from 'sweetalert2'
import { Global } from '../../helper/Global'
import { type deleteValues } from './schemas/Interfaces'
import { getData } from './FetchingData'

export const DeleteItems = ({
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
}: deleteValues): void => {
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
            getData(rutaFetch, setData, setTotalRegistros)
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
