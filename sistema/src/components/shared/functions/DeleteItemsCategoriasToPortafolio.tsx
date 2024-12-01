import axios from 'axios'
import Swal, { type SweetAlertResult } from 'sweetalert2'
import { Global } from '../../../helper/Global'
import {
  type deleteValuesSubCategorias,
  type deleteValuesCategorias,
  type deleteItemToPortafolio
} from '../schemas/Interfaces'
import {
  getDataCategoriasToPortafolio,
  getDataItemToPortafolio,
  getDataSubCategoriasToPortafolio
} from '../FetchingData'

export const DeleteItemsCategoriasToPortafolio = ({
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
}: deleteValuesCategorias): void => {
  Swal.fire({
    title: `¿Estas seguro de eliminar al registro N° ${id ?? ''}?`,
    showDenyButton: true,
    confirmButtonText: 'Eliminar',
    denyButtonText: 'Cancelar'
  }).then(async (result: SweetAlertResult) => {
    if (result.isConfirmed) {
      try {
        const resultado = await axios.delete(
          `${Global.url}/${ruta}/${id ?? ''}`,
          {
            headers: {
              Authorization: `Bearer ${
                token !== null && token !== '' ? token : ''
              }`
            }
          }
        )

        if (resultado.data.status == 'success') {
          Swal.fire('Registro eliminado correctamente', '', 'success')
          Promise.all([
            getDataCategoriasToPortafolio(
              rutaFetch,
              setData,
              setTotalRegistros
            )
          ]).then(() => {
            const ultimoRegistroEnPaginaActual =
              paginaActual * cantidadRegistros
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

export const DeleteItemsSubCategoriasToPortafolio = ({
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
}: deleteValuesSubCategorias): void => {
  Swal.fire({
    title: `¿Estas seguro de eliminar al registro N° ${id ?? ''}?`,
    showDenyButton: true,
    confirmButtonText: 'Eliminar',
    denyButtonText: 'Cancelar'
  }).then(async (result: SweetAlertResult) => {
    if (result.isConfirmed) {
      try {
        const resultado = await axios.delete(
          `${Global.url}/${ruta}/${id ?? ''}`,
          {
            headers: {
              Authorization: `Bearer ${
                token !== null && token !== '' ? token : ''
              }`
            }
          }
        )

        if (resultado.data.status == 'success') {
          Swal.fire('Registro eliminado correctamente', '', 'success')
          Promise.all([
            getDataSubCategoriasToPortafolio(
              rutaFetch,
              setData,
              setTotalRegistros
            )
          ]).then(() => {
            const ultimoRegistroEnPaginaActual =
              paginaActual * cantidadRegistros
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

export const DeleteItemsToPortafolio = ({
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
}: deleteItemToPortafolio): void => {
  Swal.fire({
    title: `¿Estas seguro de eliminar al registro N° ${id ?? ''}?`,
    showDenyButton: true,
    confirmButtonText: 'Eliminar',
    denyButtonText: 'Cancelar'
  }).then(async (result: SweetAlertResult) => {
    if (result.isConfirmed) {
      try {
        const resultado = await axios.delete(
          `${Global.url}/${ruta}/${id ?? ''}`,
          {
            headers: {
              Authorization: `Bearer ${
                token !== null && token !== '' ? token : ''
              }`
            }
          }
        )

        if (resultado.data.status == 'success') {
          Swal.fire('Registro eliminado correctamente', '', 'success')
          Promise.all([
            getDataItemToPortafolio(rutaFetch, setData, setTotalRegistros)
          ]).then(() => {
            const ultimoRegistroEnPaginaActual =
              paginaActual * cantidadRegistros
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
