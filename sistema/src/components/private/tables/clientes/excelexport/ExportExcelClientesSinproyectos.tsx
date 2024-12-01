import { Table } from 'react-bootstrap'
import { type ValuesPreventaModificate } from '../../../../shared/schemas/Interfaces'
import ReactHTMLTableToExcel from 'react-html-table-to-excel'
import { useEffect, useState } from 'react'
export const ExportExcelClientesSinproyectos = (): JSX.Element => {
  const [estado, setEstado] = useState(false)

  const productos: ValuesPreventaModificate[] = JSON.parse(localStorage.getItem('TableCliente') ?? '')

  useEffect(() => {
    const downloadButton = document.getElementById('table-xls-button')
    if (downloadButton && !estado) {
      downloadButton.click()
      localStorage.removeItem('TableCliente')
      setEstado(true)
      window.close()
    }
  }, [])

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
                ID
                </th>
                <th scope="col" style={{ width: '120px', padding: '0 10px' }}>
                NOMBRES
                </th>
                <th scope="col" style={{ width: '130px', padding: '0 10px' }}>
                APELLIDOS
                </th>
                <th scope="col" style={{ width: '130px', padding: '0 10px' }}>
                EMPRESA
                </th>
                <th scope="col" style={{ width: '80px', padding: '0 10px' }}>
                DNI / RUC
                </th>
                <th scope="col" style={{ width: '130px', padding: '0 10px' }}>
                CELULAR
                </th>
                <th scope="col" style={{ width: '100px', padding: '0 10px' }}>
                CORREO
                </th>
                <th scope="col" style={{ width: '130px', padding: '0 10px' }}>
                EDAD
                </th>
                <th scope="col" style={{ width: '100px', padding: '0 10px' }}>
                GENERO
                </th>
                <th scope="col" style={{ width: '80px', padding: '0 10px' }}>
                MEDIO DE INGRESO
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
                        {clinica.id}
                        </td>
                        <td
                        className=""
                        style={{
                          textAlign: 'center',
                          verticalAlign: 'middle',
                          padding: '0 10px'
                        }}
                        >
                        {clinica.nombres}
                        </td>
                        <td
                        className=""
                        style={{
                          textAlign: 'center',
                          verticalAlign: 'middle',
                          padding: '0 10px'
                        }}
                        >
                        {clinica.apellidos}
                        </td>
                        <td
                        className=""
                        style={{
                          textAlign: 'left',
                          verticalAlign: 'middle',
                          padding: '0 10px'
                        }}
                        >
                        {clinica.empresa}
                        </td>
                        <td
                        className=""
                        style={{
                          textAlign: 'left',
                          verticalAlign: 'middle',
                          width: '80px',
                          wordBreak: 'break-all',
                          padding: '0 10px'
                        }}
                        >
                        {clinica.dni_ruc}
                        </td>
                        <td
                        className=""
                        style={{
                          textAlign: 'center',
                          verticalAlign: 'middle',
                          display: 'flex',
                          alignItems: 'center',
                          width: '140px',
                          padding: '0 10px'
                        }}
                        >
                            {clinica.celular}
                        </td>
                        <td
                        className=""
                        style={{
                          textAlign: 'center',
                          verticalAlign: 'middle',
                          padding: '0 10px'
                        }}
                        >
                            {clinica.email}
                        </td>
                        <td
                        className=""
                        style={{
                          textAlign: 'justify',
                          verticalAlign: 'middle',
                          padding: '0 10px'
                        }}
                        >
                            {clinica.edad}
                        </td>
                        <td
                        className=""
                        style={{
                          textAlign: 'center',
                          verticalAlign: 'middle',
                          padding: '0 10px'
                        }}
                        >
                            {clinica.sexo}
                        </td>
                        <td
                        className=""
                        style={{
                          textAlign: 'center',
                          verticalAlign: 'middle',
                          padding: '0 10px'
                        }}
                        >
                            {clinica.medio_ingreso == '0'
                              ? 'Facebook'
                              : clinica.medio_ingreso == '1'
                                ? 'Google'
                                : clinica.medio_ingreso == '5'
                                  ? 'Instagram'
                                  : clinica.medio_ingreso == '2'
                                    ? 'Ventas'
                                    : clinica.medio_ingreso == '3'
                                      ? 'Post Venta'
                                      : clinica.medio_ingreso == '4'
                                        ? 'Whatsapp'
                                        : clinica.medio_ingreso == '6'
                                          ? 'Recomendación'
                                          : clinica.medio_ingreso == '7'
                                            ? 'Logos'
                                            : ''}
                        </td>
                        <td
                        className=""
                        style={{
                          textAlign: 'center',
                          verticalAlign: 'middle',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          width: '140px',
                          padding: '0 10px'
                        }}
                        >
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
                        </td>
                        <td
                        className=""
                        style={{ textAlign: 'justify', verticalAlign: 'middle', padding: '0 10px' }}
                        >

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
