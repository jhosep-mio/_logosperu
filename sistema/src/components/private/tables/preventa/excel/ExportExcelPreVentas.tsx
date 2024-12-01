import { Table } from 'react-bootstrap'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'
import { useEffect, useState } from 'react'
import { type ValuesPlanes, type ValuesVenta } from '../../../../shared/schemas/Interfaces'
import { getDataToPlanes } from '../../../../shared/FetchingData'
export const ExportExcelPreVentas = (): JSX.Element => {
  const [estado, setEstado] = useState(false)
  const productos: ValuesVenta[] = JSON.parse(localStorage.getItem('TableCliente') ?? '')
  const [planes, setplanes] = useState<ValuesPlanes[]>([])
  const [, setTotalRegistros] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([
      getDataToPlanes('getPlanes', setplanes, setTotalRegistros)
    ]).then(() => {
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (!loading) {
      const downloadButton = document.getElementById('table-xls-button')
      if (downloadButton && !estado) {
        downloadButton.click()
        localStorage.removeItem('TableCliente')
        setEstado(true)
        window.close()
      }
    }
  }, [loading])

  return (
    <>
        <Table
            id="productos2"
            className=" align-middle table-hover display w-full text-black hidden"
            style={{ marginTop: '30px', width: 'auto' }}
        >
            <thead className="table-light" style={{ background: '#2F75B5', color: 'white' }}>
            <tr>
            <th
              scope="col"
              style={{
                width: '120px',
                padding: '0 10px',
                borderRight: '1px solid gray'
              }}
            >
              COD. CONTRATO
            </th>
            <th scope="col" style={{ width: '120px', padding: '0 10px' }}>
              CLIENTE
            </th>
            <th scope="col" style={{ width: '130px', padding: '0 10px' }}>
              EMPRESA/NOMBRE
            </th>
            <th scope="col" style={{ width: '130px', padding: '0 10px' }}>
              TELEFONO
            </th>
            <th scope="col" style={{ width: '80px', padding: '0 10px' }}>
              CORREO
            </th>
            <th scope="col" style={{ width: '130px', padding: '0 10px' }}>
              TIPO SERVICIO
            </th>
            <th scope="col" style={{ width: '100px', padding: '0 10px' }}>
              PLAN
            </th>
            <th scope="col" style={{ width: '130px', padding: '0 10px' }}>
              DESCRIPCIÓN
            </th>
            <th scope="col" style={{ width: '80px', padding: '0 10px' }}>
              FECHA ALTA
            </th>
            <th scope="col" style={{ width: '80px', padding: '0 10px' }}>
              FECHA INICIO
            </th>
            <th scope="col" style={{ width: '80px', padding: '0 10px' }}>
              FECHA FINAL
            </th>
            <th scope="col" style={{ width: '100px', padding: '0 10px' }}>
              ESTADO
            </th>
          </tr>
            </thead>
            <tbody id="tableBody">
          <>
            {productos.map((clinica, index) => {
              return (
                  <tr
                    key={clinica.id}
                    style={index % 2 == 0 ? { background: '#D9D9D9' } : {}}
                  >
                    <td
                      className=""
                      style={{
                        textAlign: 'left',
                        verticalAlign: 'middle',
                        borderRight: '1px solid gray',
                        padding: '0 10px'
                      }}
                    >
                      {clinica.id_contrato}
                    </td>
                    <td
                      className=""
                      style={{
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        padding: '0 10px'
                      }}
                    >
                      {clinica.nombres} {clinica.apellidos}
                    </td>
                    <td
                      className=""
                      style={{
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        padding: '0 10px'
                      }}
                    >
                      {clinica.nombre_empresa}
                    </td>
                    <td
                      className=""
                      style={{
                        textAlign: 'left',
                        verticalAlign: 'middle',
                        padding: '0 10px'
                      }}
                    >
                      {clinica.celular}
                    </td>
                    <td
                      className=""
                      style={{
                        textAlign: 'left',
                        verticalAlign: 'middle',
                        width: '80px',
                        wordBreak: 'break-all',
                        color: '#008cff',
                        textDecoration: 'underline',
                        padding: '0 10px'
                      }}
                    >
                      {clinica.email}
                    </td>
                    <td
                      className=""
                      style={{
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        display: 'flex',
                        alignItems: 'center',
                        height: '190px',
                        width: '140px',
                        padding: '0 10px'
                      }}
                    >
                      {planes.map((plan) =>
                        clinica.id_contrato.split('_')[0] == plan.codigo
                          ? plan.tipo
                          : ''
                      )}
                    </td>
                    <td
                      className=""
                      style={{
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        padding: '0 10px'
                      }}
                    >
                      {planes.map((plan) =>
                        clinica.id_contrato.split('_')[0] == plan.codigo
                          ? plan.nombre
                          : ''
                      )}
                    </td>
                    <td
                      className=""
                      style={{
                        textAlign: 'justify',
                        verticalAlign: 'middle',
                        padding: '0 10px'
                      }}
                    >
                      {
                      clinica.observaciones
                        ? clinica.observaciones
                        : planes.map((plan) =>
                          clinica.id_contrato.split('_')[0] == plan.codigo
                            ? plan.descripcion
                            : ''
                        )
                      }
                    </td>
                    <td
                      className=""
                      style={{
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        padding: '0 10px'
                      }}
                    >
                      {clinica.fecha_alta}
                    </td>
                    <td
                      className=""
                      style={{
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        height: '190px',
                        width: '140px',
                        padding: '0 10px'
                      }}
                    >
                      {clinica.fecha_inicio}
                    </td>
                    <td
                      className=""
                      style={{
                        textAlign: 'center',
                        verticalAlign: 'middle',
                        width: '140px',
                        padding: '0 10px'
                      }}
                    >
                      {clinica.fecha_fin}
                    </td>
                    <td
                      className=""
                      style={{ textAlign: 'justify', verticalAlign: 'middle', padding: '0 10px' }}
                    >
                      PREVENTA
                    </td>
                  </tr>
              )
            })}
          </>
        </tbody>
        </Table>
        <ReactHTMLTableToExcel
          id="table-xls-button"
          className="bg-green-600 px-4 py-1 rounded-xl ml-4 w-fit mt-10 hidden"
          table="productos2"
          filename="Reporte de clintes sin proyectos"
          sheet="sheet1"
          buttonText="Descargar"
        />
    </>
  )
}
