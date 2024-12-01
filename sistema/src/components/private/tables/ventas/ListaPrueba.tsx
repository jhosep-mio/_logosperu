import { useEffect, useState } from 'react'
import useAuth from '../../../../hooks/useAuth'
import { Loading } from '../../../shared/Loading'
import { type VluesToExcel } from '../../../shared/schemas/Interfaces'
import { getDataToExcel } from '../../../shared/FetchingData'
import { RiFileExcel2Fill } from 'react-icons/ri'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'
import { Table } from 'react-bootstrap'

export const ListaPrueba = (): JSX.Element => {
  const { setTitle } = useAuth()
  const [productos, setProductos] = useState<VluesToExcel[]>([])
  const [loading, setLoading] = useState(true)
  const [, setTotalRegistros] = useState(0)

  useEffect(() => {
    setTitle('Listado de ventas')
    Promise.all([
      getDataToExcel('getVentas', setProductos, setTotalRegistros)
    ]).then(() => {
      setLoading(false)
    })
  }, [])

  return (
    <>
      <div className="content_excel">
        <RiFileExcel2Fill style={{ color: 'white' }} />
        <ReactHTMLTableToExcel
          id="table-xls-button"
          className="download"
          table="productos2"
          filename="Reporte de egresos"
          sheet="sheet1"
          buttonText="Excel"
        />
      </div>
      {loading
        ? (
        <Loading />
          )
        : (
        <Table
          id="productos2"
          className="table align-middle table-hover display w-full text-black"
          style={{ marginTop: '30px', width: 'auto' }}
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
              <th scope="col" style={{ width: '70px', padding: '0 10px' }}>
                ID
              </th>
              <th scope="col" style={{ width: '130px', padding: '0 10px' }}>
                COD. CONTRATO
              </th>
              <th scope="col" style={{ width: '200px', padding: '0 10px' }}>
                CLIENTE
              </th>
              <th scope="col" style={{ width: '200px', padding: '0 10px' }}>
                EMPRESA/NOMBRE
              </th>
              <th scope="col" style={{ width: '300px', padding: '0 10px' }}>
                SERVICIO
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
                    <td className="" style={{ textAlign: 'center' }}>
                      {clinica.id}
                    </td>
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
                      style={{ textAlign: 'justify', verticalAlign: 'middle' }}
                    >
                      {clinica.id_contrato.split('_')[0] == 'LP69'
                        ? '1 PROPUESTA DE LOGO -DISEÑO DE LOGO BASICO'
                        : clinica.id_contrato.split('_')[0] == 'LP69AM'
                          ? '1 PROPUESTA DE LOGO + 2 PIEZAS GRAFICAS -DISEÑO LOGO BASICO'
                          : clinica.id_contrato.split('_')[0] == 'LP69AM2'
                            ? '1 PROPUESTA DE LOGO + 3 PIEZAS GRAFICAS + ASESORIA FANPAGE - DISEÑO LOGO BASICO'
                            : clinica.id_contrato.split('_')[0] == 'LPEXC'
                              ? '2 PROPUESTA DE LOGO -DISEÑO LOGO BASICO'
                              : clinica.id_contrato.split('_')[0] == 'LPEXCAM'
                                ? '2 PROPUESTA DE LOGO + 2 PIEZAS GRAFICAS - DISEÑO LOGO BASICO'
                                : clinica.id_contrato.split('_')[0] == 'LPEXCAM2'
                                  ? '2 PROPUESTA DE LOGO + 3 PIEZAS GRAFICAS + ASESORIA FANPAGE - DISEÑO LOGO BASICO'
                                  : clinica.id_contrato.split('_')[0]
                            }
                    </td>
                  </tr>
                )
              })}
            </>
          </tbody>
        </Table>
          )}
    </>
  )
}
