/* eslint-disable react/prop-types */
import { Table } from 'react-bootstrap'
import {
  type valuesResumen,
  type ValuesPlanes,
  type VluesToExcel
} from '../schemas/Interfaces'
import { RiFileExcel2Fill } from 'react-icons/ri'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'
import { useEffect, useState } from 'react'
import { getDataToPlanes } from '../FetchingData'
import axios from 'axios'
import { Global } from '../../../helper/Global'
// import { date } from 'yup'
interface ExcelGeneratorProps {
  dataFromDatabase: VluesToExcel[]
}
// eslint-disable-next-line react/prop-types
export const GeneradorExcel: React.FC<ExcelGeneratorProps> = ({
  dataFromDatabase
}) => {
  const handleDownloadClick = (): void => {
    // Aquí podrías agregar lógica adicional antes de activar la descarga si es necesario
    const button = document.getElementById('buttton1')
    if (button != null) {
      button.click()
    }
    // Simula el clic en el botón de descarga
  }
  const [planes, setplanes] = useState<ValuesPlanes[]>([])
  const [, setTotalRegistros] = useState(0)
  const [colaboradores, setcolaboradores] = useState([])
  const token = localStorage.getItem('token')

  const getColaboradores = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getColaboradores`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setcolaboradores(request.data)
  }

  useEffect(() => {
    Promise.all([
      getDataToPlanes('getPlanes', setplanes, setTotalRegistros),
      getColaboradores()
    ]).then(() => {})
  }, [])

  // Función que genera los <th> con las fechas de hoy y los dos días anteriores.
  const renderDateHeaders = (): JSX.Element[] => {
    const headers = []
    const today = new Date()

    for (let i = 3; i >= 1; i--) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      headers.push(
        <th scope="col" style={{ width: '300px', padding: '0 10px' }}>
          {date.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
          })}
        </th>
      )
    }

    return headers
  }

  const generarFechas = (): string[] => {
    const fechas = []
    const hoy = new Date()

    for (let i = 3; i >= 1; i--) {
      const fecha = new Date(hoy)
      fecha.setDate(hoy.getDate() - i)
      fechas.push(
        fecha.toLocaleDateString('es-ES', {
          day: 'numeric',
          month: 'numeric',
          year: 'numeric'
        })
      )
    }

    return fechas
  }

  const renderComentarios = (producto: any, fechas: any): JSX.Element => {
    return fechas.map((fecha: any, index: number) => {
      const comentarioEnFecha = producto.resumen
        ? JSON.parse(producto.resumen).find(
          (comentario: valuesResumen) => comentario.fecha === fecha
        )
        : null
      return (
        <td key={index}>
          {comentarioEnFecha ? comentarioEnFecha.texto.toUpperCase() : ''}
        </td>
      )
    })
  }

  const tieneComentariosEnFechas = (producto: any, fechas: any): boolean => {
    if (!producto.resumen) {
      return false
    }
    const comentarios = JSON.parse(producto.resumen)
    return comentarios.some((comentario: valuesResumen) =>
      fechas.includes(comentario.fecha)
    )
  }

  return (
    <>
      <Table
        id="productos2"
        className="table align-middle table-hover display w-full text-black"
        style={{ marginTop: '30px', width: 'auto', display: 'none' }}
      >
        <thead className="table-light">
          <tr>
            <th
              scope="col"
              className="text-center"
              colSpan={4}
              style={{ background: '#375623', color: 'white' }}
            >
              DATOS DEL CLIENTE
            </th>
            <th
              scope="col"
              className="text-center"
              colSpan={1}
              style={{ background: '#203764', color: 'white' }}
            >
              DATOS DEL SERVICIO{' '}
            </th>
          </tr>
        </thead>
        <thead className="table-light">
          <tr>
            <th scope="col" style={{ width: '120px', padding: '0 10px' }}>
              COD. CONTRATO
            </th>
            <th scope="col" style={{ width: '130px', padding: '0 10px' }}>
              CLIENTE
            </th>
            <th scope="col" style={{ width: '130px', padding: '0 10px' }}>
              EMPRESA/NOMBRE
            </th>
            <th scope="col" style={{ width: '130px', padding: '0 10px' }}>
              TELEFONO
            </th>
            <th scope="col" style={{ width: '130px', padding: '0 10px' }}>
              CORREO
            </th>
            <th scope="col" style={{ width: '130px', padding: '0 10px' }}>
              TIPO DE SERVICIO
            </th>
            <th scope="col" style={{ width: '300px', padding: '0 10px' }}>
              DESCRIPCIÓN
            </th>
            <th scope="col" style={{ width: '130px', padding: '0 10px' }}>
              ENCARGADO
            </th>
            <th scope="col" style={{ width: '130px', padding: '0 10px' }}>
              FECHA INICIO
            </th>
            <th scope="col" style={{ width: '130px', padding: '0 10px' }}>
              FECHA FINAL
            </th>
            <th scope="col" style={{ width: '130px', padding: '0 10px' }}>
              ESTADO
            </th>
            {renderDateHeaders()}
          </tr>
        </thead>
        <tbody id="tableBody">
          <>
            {dataFromDatabase
              .filter((producto) =>
                tieneComentariosEnFechas(producto, generarFechas())
              )
              .map((clinica, index) => {
                const fechas = generarFechas()
                return (
                  <tr
                    key={clinica.id}
                    style={index % 2 == 0 ? { background: '#D9D9D9' } : {}}
                  >
                    <td
                      className=""
                      style={{ textAlign: 'left', verticalAlign: 'middle' }}
                    >
                      {clinica.id_contrato}
                    </td>
                    <td
                      className=""
                      style={{ textAlign: 'left', verticalAlign: 'middle' }}
                    >
                      {clinica.nombres} {clinica.apellidos}
                    </td>
                    <td
                      className=""
                      style={{ textAlign: 'left', verticalAlign: 'middle' }}
                    >
                      {clinica.nombre_empresa}
                    </td>
                    <td
                      className=""
                      style={{ textAlign: 'left', verticalAlign: 'middle' }}
                    >
                      {clinica.celular}
                    </td>
                    <td
                      className=""
                      style={{ textAlign: 'left', verticalAlign: 'middle' }}
                    >
                      {clinica.email}
                    </td>
                    <td
                      className=""
                      style={{ textAlign: 'justify', verticalAlign: 'middle' }}
                    >
                      {planes.map((plan) =>
                        clinica.id_contrato.split('_')[0] == plan.codigo
                          ? plan.tipo
                          : ''
                      )}
                    </td>
                    <td
                      className=""
                      style={{ textAlign: 'justify', verticalAlign: 'middle' }}
                    >
                      {planes.map((plan) =>
                        clinica.id_contrato.split('_')[0] == plan.codigo
                          ? plan.descripcion
                          : ''
                      )}
                    </td>
                    <td
                      className=""
                      style={{ textAlign: 'justify', verticalAlign: 'middle' }}
                    >
                      {JSON.parse(clinica.asignacion) != null &&
                      JSON.parse(clinica.asignacion).length > 0
                        ? JSON.parse(clinica.asignacion).map(
                          (asignacion: any) =>
                            colaboradores
                              .filter(
                                (colaborador: { id: number, name: string }) =>
                                // eslint-disable-next-line eqeqeq
                                  colaborador.id == asignacion.peso
                              )
                              .map(
                                (colaborador: { name: string }) =>
                                  colaborador.name
                              )
                              .join(', ')
                        )
                        : 'Aun no se te asigna un diseñador'}
                    </td>
                    <td
                      className=""
                      style={{ textAlign: 'justify', verticalAlign: 'middle' }}
                    >
                      {clinica.fecha_inicio}
                    </td>
                    <td
                      className=""
                      style={{ textAlign: 'justify', verticalAlign: 'middle' }}
                    >
                      {clinica.fecha_fin}
                    </td>
                    <td
                      className=""
                      style={{ textAlign: 'justify', verticalAlign: 'middle' }}
                    >
                      {clinica.estado == '1'
                        ? 'Abandono'
                        : clinica.fecha_fin != null
                          ? 'Finalizado'
                          : 'En proceso'}
                    </td>
                    {renderComentarios(clinica, fechas)}
                  </tr>
                )
              })}
          </>
        </tbody>
      </Table>
      <div className="w-fit relative">
        <RiFileExcel2Fill
          className="text-green-700 text-2xl lg:text-3xl cursor-pointer absolute inset-0"
          onClick={handleDownloadClick}
        />
        <ReactHTMLTableToExcel
          id="table-xls-button buttton1"
          className="download text-transparent select-none"
          table="productos2"
          filename="Reporte de seguimiento"
          sheet="sheet1"
          buttonText="des"
        />
      </div>
    </>
  )
}
