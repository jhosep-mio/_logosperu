import axios from 'axios'
import { type Dispatch, type SetStateAction } from 'react'
import { Global } from '../../helper/Global'
import { type interfaceListaDiseñoNew, type ValuesPreventaModificate, type interfaceListaDiseño, type ValuesVenta, type VluesToExcel, type ValuesCategoriasPortafolio, type ValuesSubCategoriasPortafolio, type ValuesItemsPortafolio, type ValuesPlanes, type notificacionesValues, type usurioValues, type clasificadosValues, type valuesTransaccion, type ValuesVentaToMetricas, type ListcotizacionValues } from './schemas/Interfaces'

const token = localStorage.getItem('token')

export const getDataVentasToMetricas = async (ruta: string, setDatos: Dispatch<SetStateAction<ValuesVentaToMetricas[]>>, setTotalRegistros: Dispatch<SetStateAction<number>>): Promise<void> => {
  const request = await axios.get(`${Global.url}/${ruta}`, {
    headers: {
      Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
    }
  })
  setDatos(request.data)
  setTotalRegistros(request.data.length)
}

// CLASIFICADOS

export const getClasificados = async (ruta: string, setDatos: Dispatch<SetStateAction<clasificadosValues[]>>, setTotalRegistros: Dispatch<SetStateAction<number>>): Promise<void> => {
  const request = await axios.get(`${Global.url}/${ruta}`, {
    headers: {
      Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
    }
  })
  setDatos(request.data)
  setTotalRegistros(request.data.length)
}

export const getClientes = async (ruta: string, setDatos: Dispatch<SetStateAction<ValuesPreventaModificate[]>>): Promise<void> => {
  const request = await axios.get(`${Global.url}/${ruta}`, {
    headers: {
      Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
    }
  })
  setDatos(request.data)
}

export const getColaboradresList = async (ruta: string, setDatos: Dispatch<SetStateAction<usurioValues[]>>, setTotalRegistros: Dispatch<SetStateAction<number>>): Promise<void> => {
  const request = await axios.get(`${Global.url}/${ruta}`, {
    headers: {
      Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
    }
  })
  setDatos(request.data)
  setTotalRegistros(request.data.length)
}

export const getColaboradores = async (ruta: string, setDatos: Dispatch<SetStateAction<notificacionesValues[]>>, setTotalRegistros: Dispatch<SetStateAction<number>>): Promise<void> => {
  const request = await axios.get(`${Global.url}/${ruta}`, {
    headers: {
      Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
    }
  })
  setDatos(request.data)
  setTotalRegistros(request.data.length)
}

export const getVentas = async (ruta: string, setDatos: Dispatch<SetStateAction<notificacionesValues[]>>, setTotalRegistros: Dispatch<SetStateAction<number>>): Promise<void> => {
  const request = await axios.get(`${Global.url}/${ruta}`, {
    headers: {
      Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
    }
  })
  setDatos(request.data)
  setTotalRegistros(request.data.length)
}

export const getData = async (ruta: string, setDatos: Dispatch<SetStateAction<interfaceListaDiseño[]>>, setTotalRegistros: Dispatch<SetStateAction<number>>): Promise<void> => {
  const request = await axios.get(`${Global.url}/${ruta}`, {
    headers: {
      Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
    }
  })
  setDatos(request.data)
  setTotalRegistros(request.data.length)
}

export const getDataNew = async (ruta: string, setDatos: Dispatch<SetStateAction<interfaceListaDiseñoNew[]>>, setTotalRegistros: Dispatch<SetStateAction<number>>): Promise<void> => {
  const request = await axios.get(`${Global.url}/${ruta}`, {
    headers: {
      Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
    }
  })
  setDatos(request.data)
  setTotalRegistros(request.data.length)
}

export const getData2 = async (ruta: string, setDatos: Dispatch<SetStateAction<ValuesPreventaModificate[]>>, setTotalRegistros: Dispatch<SetStateAction<number>>): Promise<void> => {
  const request = await axios.get(`${Global.url}/${ruta}`, {
    headers: {
      Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
    }
  })
  setDatos(request.data)
  setTotalRegistros(request.data.length)
}

export const getDataClientesMetricas = async (ruta: string, setDatos: Dispatch<SetStateAction<ValuesPreventaModificate[]>>, setDepartamentos: Dispatch<SetStateAction<Record<string, Record<string, number>>>>, setDistritos: Dispatch<SetStateAction<Record<string, Record<string, Record<string, number>>>>>, setPaises: Dispatch<SetStateAction<Record<string, number>>>
  , setTotalRegistros: Dispatch<SetStateAction<number>>): Promise<void> => {
  const request = await axios.get(`${Global.url}/${ruta}`, {
    headers: {
      Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
    }
  })
  setDatos(request.data)
  const countByCountry: Record<string, number> = {}
  const countByCountryAndDepartment: Record<string, Record<string, number>> = {}
  const countByCountryDepartmentAndDistrict: Record<string, Record<string, Record<string, number>>> = {}

  request.data.forEach((cliente: { metricas: string }) => {
    const clienteObj = JSON.parse(cliente.metricas)
    if (!clienteObj) {
      return
    }
    const country = clienteObj.country
    const department = clienteObj.department
    const district = clienteObj.district

    // Incrementa el contador de países
    if (country) {
      if (countByCountry[country]) {
        countByCountry[country]++
      } else {
        countByCountry[country] = 1
      }
    }

    // Incrementa el contador de departamentos
    if (country && department) {
      if (!countByCountryAndDepartment[country]) {
        countByCountryAndDepartment[country] = {}
      }
      if (countByCountryAndDepartment[country][department]) {
        countByCountryAndDepartment[country][department]++
      } else {
        countByCountryAndDepartment[country][department] = 1
      }
    }

    // Incrementa el contador de distritos
    if (country && department && district) {
      if (!countByCountryDepartmentAndDistrict[country]) {
        countByCountryDepartmentAndDistrict[country] = {}
      }
      if (!countByCountryDepartmentAndDistrict[country][department]) {
        countByCountryDepartmentAndDistrict[country][department] = {}
      }
      if (countByCountryDepartmentAndDistrict[country][department][district]) {
        countByCountryDepartmentAndDistrict[country][department][district]++
      } else {
        countByCountryDepartmentAndDistrict[country][department][district] = 1
      }
    }
  })

  // Actualiza los estados con los datos recopilados
  setPaises(countByCountry)
  setDepartamentos(countByCountryAndDepartment)
  setDistritos(countByCountryDepartmentAndDistrict)
  setTotalRegistros(request.data.length)
}

export const getDataTransacciones = async (ruta: string, setDatos: Dispatch<SetStateAction<valuesTransaccion[]>>, setTotalRegistros: Dispatch<SetStateAction<number>>): Promise<void> => {
  const request = await axios.get(`${Global.url}/${ruta}`, {
    headers: {
      Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
    }
  })
  setDatos(request.data)
  setTotalRegistros(request.data.length)
}

export const getDataVentas = async (ruta: string, setDatos: Dispatch<SetStateAction<ValuesVenta[]>>, setTotalRegistros: Dispatch<SetStateAction<number>>): Promise<void> => {
  const request = await axios.get(`${Global.url}/${ruta}`, {
    headers: {
      Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
    }
  })
  setDatos(request.data)
  setTotalRegistros(request.data.length)
}

export const getCotizaciones = async (ruta: string, setDatos: Dispatch<SetStateAction<ListcotizacionValues[]>>, setTotalRegistros: Dispatch<SetStateAction<number>>): Promise<void> => {
  const request = await axios.get(`${Global.url}/${ruta}`, {
    headers: {
      Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
    }
  })
  setDatos(request.data)
  setTotalRegistros(request.data.length)
}

export const getDataBuscar = async (ruta: string, setDatos: Dispatch<SetStateAction<interfaceListaDiseño[]>>, setTotalRegistros: Dispatch<SetStateAction<number>>, buscar: string): Promise<void> => {
  const data = new FormData()
  data.append('buscar', buscar)
  const request = await axios.post(`${Global.url}/${ruta}`, data, {
    headers: {
      Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
    }
  })
  setDatos(request.data)
  setTotalRegistros(request.data.length)
}

export const getDataBuscarNew = async (ruta: string, setDatos: Dispatch<SetStateAction<interfaceListaDiseñoNew[]>>, setTotalRegistros: Dispatch<SetStateAction<number>>, buscar: string): Promise<void> => {
  const data = new FormData()
  data.append('buscar', buscar)
  const request = await axios.post(`${Global.url}/${ruta}`, data, {
    headers: {
      Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
    }
  })
  setDatos(request.data)
  setTotalRegistros(request.data.length)
}

export const getSearchData = async (ruta: string, setDatos: Dispatch<SetStateAction<ValuesPreventaModificate[]>>, setTotalRegistros: Dispatch<SetStateAction<number>>, buscar: string): Promise<void> => {
  const data = new FormData()
  data.append('buscar', buscar)
  const request = await axios.post(`${Global.url}/${ruta}`, data, {
    headers: {
      Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
    }
  })
  setDatos(request.data)
  setTotalRegistros(request.data.length)
}

export const getDatas = async (ruta: string, setDatos: Dispatch<SetStateAction<never[]>>, setTotalRegistros: Dispatch<SetStateAction<number>>): Promise<void> => {
  const request = await axios.get(`${Global.url}/${ruta}`, {
    headers: {
      Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
    }
  })
  setDatos(request.data)
  setTotalRegistros(request.data.length)
}

export const getOneData = async (ruta: string, setDatos: Dispatch<SetStateAction<never[]>>): Promise<void> => {
  const request = await axios.get(`${Global.url}/${ruta}}`)
  setDatos(request.data)
}

export const getDataToExcel = async (ruta: string, setDatos: Dispatch<SetStateAction<VluesToExcel[]>>, setTotalRegistros: Dispatch<SetStateAction<number>>): Promise<void> => {
  const request = await axios.get(`${Global.url}/${ruta}`, {
    headers: {
      Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
    }
  })
  setDatos(request.data)
  setTotalRegistros(request.data.length)
}

export const getDataCategoriasToPortafolio = async (ruta: string, setDatos: Dispatch<SetStateAction<ValuesCategoriasPortafolio[]>>, setTotalRegistros: Dispatch<SetStateAction<number>>): Promise<void> => {
  const request = await axios.get(`${Global.url}/${ruta}`, {
    headers: {
      Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
    }
  })
  setDatos(request.data)
  setTotalRegistros(request.data.length)
}

export const getDataSubCategoriasToPortafolio = async (ruta: string, setDatos: Dispatch<SetStateAction<ValuesSubCategoriasPortafolio[]>>, setTotalRegistros: Dispatch<SetStateAction<number>>): Promise<void> => {
  const request = await axios.get(`${Global.url}/${ruta}`, {
    headers: {
      Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
    }
  })
  setDatos(request.data)
  setTotalRegistros(request.data.length)
}

export const getDataItemToPortafolio = async (ruta: string, setDatos: Dispatch<SetStateAction<ValuesItemsPortafolio[]>>, setTotalRegistros: Dispatch<SetStateAction<number>>): Promise<void> => {
  const request = await axios.get(`${Global.url}/${ruta}`, {
    headers: {
      Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
    }
  })
  setDatos(request.data)
  setTotalRegistros(request.data.length)
}

export const getDataToPlanes = async (ruta: string, setDatos: Dispatch<SetStateAction<ValuesPlanes[]>>, setTotalRegistros: Dispatch<SetStateAction<number>>): Promise<void> => {
  const request = await axios.get(`${Global.url}/${ruta}`, {
    headers: {
      Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
    }
  })
  setDatos(request.data)
  setTotalRegistros(request.data.length)
}
