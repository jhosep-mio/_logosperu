const PdfTemplate = ({
  correlativo,
  codigo
}: {
  correlativo: string
  codigo: string
  nombres_cliente: string
  email: string
  celular: string
  dni_ruc: string
  fecha: string
  descripcion: string
  total: string
  preciotexto: string
}): JSX.Element => {
  return (
    <html lang="en">
      <head>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>{correlativo}</title>
        <style>
          {`
            @page {
              size: A4;
              margin: 4.5cm 1.3cm 3.5cm 1.3cm;
            }
            /* Estilos CSS aquí */
          `}
        </style>
      </head>
      <body>
        <div id="header">
          <img
            src="ruta/a/header_cotizacion.jpg"
            alt=""
            className="img_principal"
          />
        </div>
        <div className="codContra">
          <span className="font_title">COTIZACIÓN</span> {codigo}
        </div>
        <div id="footer">
          <div className="div_img">
            <a href="mailto:ventas@logosperu.com">
              <img
                src="ruta/a/footer_cotizacion.jpg"
                alt=""
                className="img_footer"
              />
            </a>
          </div>
        </div>
        <div id="marca_agua">
          <img src="ruta/a/marcaagua.png" alt="" className="imagen_agua" />
        </div>
        <section className="section_contenido">
          <table
            style={{ width: '100%', borderCollapse: 'collapse' }}
            className="grid_top"
          >
            {/* Contenido de la sección */}
          </table>
        </section>
        <section>
          <table
            style={{
              width: '100%',
              borderCollapse: 'collapse',
              backgroundColor: '#F2F2F2'
            }}
            className="grid_top_second"
          >
            {/* Contenido de la sección */}
          </table>
        </section>
        <section className="section_contenido">
          <div
            style={{
              width: '100%',
              border: '1px solid #4A55A0',
              padding: 0,
              margin: 0
            }}
          >
            {/* Contenido de la sección */}
          </div>
        </section>
      </body>
    </html>
  )
}

export default PdfTemplate
