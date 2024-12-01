/* eslint-disable react/prop-types */
import { Table } from 'react-bootstrap'
import {
  type valuesResumen,
  type ValuesPlanes,
  type VluesToExcel
} from '../schemas/Interfaces'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'
import { useEffect, useState } from 'react'
import { getDataToPlanes } from '../FetchingData'
import axios from 'axios'
import { Global } from '../../../helper/Global'
import { IoCalendarOutline } from 'react-icons/io5'

import Dialog from '@mui/material/Dialog'
import DialogContent from '@mui/material/DialogContent'

// import { date } from 'yup'
interface ExcelGeneratorProps {
  dataFromDatabase: VluesToExcel[]
}
// eslint-disable-next-line react/prop-types
export const GeneradorExcelFechas: React.FC<ExcelGeneratorProps> = ({
  dataFromDatabase
}) => {
  const handleDownloadClick = (): void => {
    // Aquí podrías agregar lógica adicional antes de activar la descarga si es necesario
    const button = document.getElementById('table-xls-button buttton2')
    if (button != null) {
      button.click()
    }
    // Simula el clic en el botón de descarga
  }
  const [planes, setplanes] = useState<ValuesPlanes[]>([])
  const [, setTotalRegistros] = useState(0)
  const [open, setOpen] = useState(false)
  const [colaboradores, setcolaboradores] = useState([])
  const token = localStorage.getItem('token')

  const [fechaInicio, setFechaInicio] = useState<undefined | string>(undefined)
  const [fechaFin, setFechaFin] = useState<undefined | string>(undefined)

  const handleClose = (): void => {
    setOpen(false)
  }

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

  const parseLocalDate = (dateString: string): Date => {
    const [year, month, day] = dateString.split('-').map(Number)
    return new Date(year, month - 1, day)
  }

  const renderDateRangeHeaders = (): JSX.Element[] => {
    const headers = []

    // Verificar si la fecha de inicio está definida
    if (fechaInicio && fechaFin) {
      let currentDate = parseLocalDate(fechaInicio)
      const endDate = parseLocalDate(fechaFin)
      // Asegúrate también de que la fecha de fin esté definida y sea válida
      if (fechaFin && currentDate <= endDate) {
        while (currentDate <= endDate) {
          headers.push(
            <th scope="col" style={{ width: '300px', padding: '0 10px' }}>
              {currentDate.toLocaleDateString('es-ES', {
                day: 'numeric',
                month: 'numeric',
                year: 'numeric'
              })}
            </th>
          )
          currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1))
        }
      }
    }

    return headers
  }

  const generarFechas = (): string[] => {
    const fechas = []
    // Verificar si la fecha de inicio está definida
    if (fechaInicio && fechaFin) {
      let currentDate = parseLocalDate(fechaInicio)
      const endDate = parseLocalDate(fechaFin)
      // Asegúrate también de que la fecha de fin esté definida y sea válida
      if (fechaFin && currentDate <= endDate) {
        while (currentDate <= endDate) {
          fechas.push(currentDate.toLocaleDateString('es-ES', {
            day: 'numeric',
            month: 'numeric',
            year: 'numeric'
          })
          )
          currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1))
        }
      }
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
      {fechaInicio && fechaFin &&
      <Table
        id="productos3"
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
            {renderDateRangeHeaders()}
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
        }
      <div className="w-fit relative">
        <IoCalendarOutline
          className="text-green-700 text-2xl lg:text-3xl cursor-pointer absolute inset-0"
          //   onClick={handleDownloadClick}
          onClick={() => {
            setOpen(true)
          }}
        />

        <Dialog
          open={open}
          onClose={handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogContent>
            <section className="w-[500px]">
              <h2 className="text-2xl text-black font-bold w-full text-center">
                COLOCAR RANGO DE FECHAS
              </h2>
              <div className="w-full flex gap-10 mt-10 justify-between items-center">
                <div className="w-full flex flex-col gap-4">
                  <label
                    htmlFor=""
                    className="text-xl mb-4 text-green-600 text-center font-bold"
                  >
                    Fecha de Inicio
                  </label>
                  <input
                    type="date"
                    id="fechaInicio"
                    name="fechaInicio"
                    value={fechaInicio}
                    onChange={(e) => { setFechaInicio(e.target.value) }}
                    className="w-full text-xl outline-none"
                  />
                </div>
                <div className="w-full flex flex-col gap-4">
                  <label
                    htmlFor=""
                    className="text-xl mb-4 text-red-600 text-center font-bold"
                  >
                    Fecha Final
                  </label>
                  <input
                    type="date"
                    id="fechaFin"
                    value={fechaFin}
                    onChange={(e) => { setFechaFin(e.target.value) }}
                    name="fechaFin"
                    className="w-full text-xl outline-none"
                  />
                </div>
              </div>
              <div className="w-full flex items-center justify-center mt-10">
                <button className="px-4 py-2 text-white bg-green-600 font-bold text-xl rounded-lg" onClick={handleDownloadClick}>
                  Generar
                </button>
              </div>
            </section>
          </DialogContent>
        </Dialog>

        <ReactHTMLTableToExcel
          id="table-xls-button buttton2"
          className="download text-transparent select-none"
          table="productos3"
          filename="Reporte de seguimiento"
          sheet="sheet1"
          buttonText="des"
        />
      </div>
    </>
  )
}
