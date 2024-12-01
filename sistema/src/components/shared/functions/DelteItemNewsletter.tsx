/* eslint-disable @typescript-eslint/restrict-template-expressions */
import axios from 'axios'
import Swal, { type SweetAlertResult } from 'sweetalert2'
import { Global } from '../../../helper/Global'
import {
  type deleteValuesSubCategorias,
  type deleteItemToPortafolio
} from '../schemas/Interfaces'
import {
  getDataCategoriasToPortafolio,
  getDataItemToPortafolio,
  getDataSubCategoriasToPortafolio
} from '../FetchingData'
import { DeleteObjectCommand, S3Client } from '@aws-sdk/client-s3'

const deleteImagen = async (imagenNueva1: string): Promise<void> => {
  const file = imagenNueva1
  if (!file) {
    return
  }
  const token = localStorage.getItem('token')
  const formData = new FormData()
  formData.append('file_name', file)
  try {
    const { data } = await axios.post(
          `${Global.url}/generateGeneral`,
          formData,
          {
            headers: {
              'Content-Type': 'multipart/form-data',
              Authorization: `Bearer ${
                token !== null && token !== '' ? token : ''
              }`
            }
          }
    )
    const s3Client = new S3Client({
      region: data.region,
      credentials: {
        accessKeyId: data.publickey,
        secretAccessKey: data.secretKey
      }
    })
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: 'mysistemalogosperu', // Cambia esto por tu nombre de bucket
        Key: `articulos/${imagenNueva1}`
      })
    )
  } catch (error: any) {
    console.log(error)
  }
}

export const DelteItemNewsletter = ({
  ruta,
  id,
  token,
  totalPosts,
  cantidadRegistros,
  paginaActual,
  setpaginaActual,
  rutaFetch,
  setData,
  setTotalRegistros,
  imagen
}: any): void => {
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
            ),
            deleteImagen(imagen)
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
