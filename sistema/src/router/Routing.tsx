import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { Login } from '../components/public/Login'
import { AuthProvider } from '../context/AuthProvider'
import { PrivateLayout } from '../components/private/PrivateLayout'
import { ListaPreventa } from '../components/private/tables/preventa/ListaPreventa'
import { Metricas } from '../components/private/tables/ventas/Metricas'
import { ListaVentas } from '../components/private/tables/ventas/ListaVentas'
import { EditarVentas } from '../components/private/tables/ventas/EditarVentas'
import { ListaClientes } from '../components/private/tables/clientes/ListaClientes'
import { RegistrarCliente } from '../components/private/tables/clientes/RegistrarCliente'
import { EditarCliente } from '../components/private/tables/clientes/EditarCliente'
import { GenerarContrato } from '../components/private/tables/ventas/GenerarContrato'
import { ListaPrueba } from '../components/private/tables/ventas/ListaPrueba'
import { ListaCategoriasPortafolio } from '../components/private/tables/portafolio/categorias/ListaCategoriasPortafolio'
import { RegistrarCategoriasToPortafolio } from '../components/private/tables/portafolio/categorias/RegistrarCategoriasToPortafolio'
import { EditarCategoriasToPortafolio } from '../components/private/tables/portafolio/categorias/EditarCategoriasToPortafolio'
import { ListaSubCategoriasPortafolio } from '../components/private/tables/portafolio/subcategorias/ListaSubCategoriasPortafolio'
import { RegistrarSubcategoriaToPortafolio } from '../components/private/tables/portafolio/subcategorias/RegistrarSubcategoriaToPortafolio'
import { ListaItemsPortafolio } from '../components/private/tables/portafolio/items-portafolio/ListaItemsPortafolio'
import { RegistraItemToPortafolio } from '../components/private/tables/portafolio/items-portafolio/RegistraItemToPortafolio'
import { EditarItemsToPortafolio } from '../components/private/tables/portafolio/items-portafolio/EditarItemsToPortafolio'
import { EditarSubCategoriasToPortafolio } from '../components/private/tables/portafolio/subcategorias/EditarSubCategoriasToPortafolio'
import { ListaPlanes } from '../components/private/tables/planes/ListaPlanes'
import { RegistrarPlan } from '../components/private/tables/planes/RegistrarPlan'
import { EditarPlan } from '../components/private/tables/planes/EditarPlan'
import { ViewVenta } from '../components/private/tables/ventas/ViewVenta'
import { ListadoBrochure } from '../components/private/tables/briefs_brochure/ListadoBrochure'
import { RegistrarBriefBrochure } from '../components/private/tables/briefs_brochure/RegistrarBriefBrochure'
import { EditarBriefBrochure } from '../components/private/tables/briefs_brochure/EditarBriefBrochure'
import { ViewBriefBrochure } from '../components/private/tables/briefs_brochure/ViewBriefBrochure'
import { AsginacionBriefBrochure } from '../components/private/tables/briefs_brochure/AsginacionBriefBrochure'
import { ListadoFlyers } from '../components/private/tables/briefs_flyer/ListadoFlyers'
import { RegistrarBriefFlyer } from '../components/private/tables/briefs_flyer/RegistrarBriefFlyer'
import { EditarBriefFlyer } from '../components/private/tables/briefs_flyer/EditarBriefFlyer'
import { ViewBriefFlyer } from '../components/private/tables/briefs_flyer/ViewBriefFlyer'
import { AsignacionFlyer } from '../components/private/tables/briefs_flyer/AsignacionFlyer'
import { ListadoComunity } from '../components/private/tables/brief_comunity/ListadoComunity'
import { RegistrarBriegComunity } from '../components/private/tables/brief_comunity/RegistrarBriegComunity'
import { EditarBriefComunity } from '../components/private/tables/brief_comunity/EditarBriefComunity'
import { ViewBriefComunity } from '../components/private/tables/brief_comunity/ViewBriefComunity'
import { AsignacionComunity } from '../components/private/tables/brief_comunity/AsignacionComunity'
import { ListaServicios } from '../components/private/tables/servicios/ListaServicios'
import { ViewServicio } from '../components/private/tables/servicios/ViewServicio'
import { Avances } from '../components/private/tables/servicios/Avances'
import { Avances2 } from '../components/private/tables/servicios/Avances2'
import { ViewPreventa } from '../components/private/tables/preventa/ViewPreventa'
import { Status } from '../components/private/tables/ventas/Status'
import { EditarPreventa } from '../components/private/tables/preventa/EditarPreventa'
import { ListaVentasVencidos } from '../components/private/tables/ventas/vencidos/ListaVentasVencidos'
import { ListaVentasPorColaborador } from '../components/private/tables/ventas/ListaVentasPorColaborador'
import { StatusPorColaborador } from '../components/private/tables/ventas/colaboradores/StatusPorColaborador'
import { VistaSeguimiento } from '../components/private/tables/ventas/seguimiento/VistaSeguimiento'
import { ListaColaboradores } from '../components/private/tables/colaboradores/ListaColaboradores'
import { ReportePorColaborador } from '../components/private/tables/colaboradores/ReportePorColaborador'
import { StatusToColaborador } from '../components/private/tables/ventas/StatusToColaborador'
import { ListaProyectosAgencia } from '../components/private/tables/ventas/ListaProyectosAgencia'
import { GestordeCitas } from '../components/private/tables/citas/GestordeCitas'
import { ComentariosClientes } from '../components/private/tables/citas/comentarios/ComentariosClientes'
import { HistorialLlamadas } from '../components/private/tables/citas/HistorialLlamadas'
import { ListaHistorial } from '../components/private/tables/citas/ListaHistorial'
import { ListaPendientes } from '../components/private/tables/citas/ListaPendientes'
import { Preclientes } from '../components/private/tables/pre_clientes/Preclientes'
import { RegistroPreClientes } from '../components/private/tables/pre_clientes/RegistroPreClientes'
import { EditarPreCliente } from '../components/private/tables/pre_clientes/EditarPreCliente'
import { MetricasVencidos } from '../components/private/tables/ventas/vencidos/MetricasVencidos'
import { ListaClasificados } from '../components/private/tables/clasificados/ListaClasificados'
import { RegistrarClasificados } from '../components/private/tables/clasificados/RegistrarClasificados'
import { EditarClasificados } from '../components/private/tables/clasificados/EditarClasificados'
import { ListaClientesColaboradores } from '../components/private/tables/clientes-colaboradores/ListaClientesColaboradores'
// import { ListaTransacciones } from '../components/private/tables/transacciones/ListaTransacciones'
import { VerCliente } from '../components/private/tables/clientes/VerCliente'
import { IndexGestor } from '../components/private/tables/gestor-tareas/IndexGestor'
import { IndexCalendario } from '../components/private/tables/gestor-tareas/IndexCalendario'
import { IndexCompartidos } from '../components/private/tables/gestor-tareas/IndexCompartidos'
import { ExportExcelClientes } from '../components/private/tables/clientes/excelexport/ExportExcelClientes'
import { ListadoClientesSInProyectos } from '../components/private/tables/clientes/sinproyectos/ListadoClientesSInProyectos'
import { ExportExcelClientesSinproyectos } from '../components/private/tables/clientes/excelexport/ExportExcelClientesSinproyectos'
import { ExportExcelPreVentas } from '../components/private/tables/preventa/excel/ExportExcelPreVentas'
import { ViewCm } from '../components/private/tables/calendario_CM/ViewCm'
import { MetricasClientes } from '../components/private/tables/dashboard/clientes/MetricasClientes'
import { LayoutDashboard } from '../components/private/tables/dashboard/LayoutDashboard'
import { MetricasVentas } from '../components/private/tables/dashboard/ventas/MetricasVentas'
import { IndexCalendarioCm } from '../components/private/tables/calendario_CM/IndexCalendarioCm'
import { MetricasCm } from '../components/private/tables/calendario_CM/MetricasCm'
import { IndexDocumentos } from '../components/private/tables/documentos/IndexDocumentos'
import { IndexGestorColaborador } from '../components/private/tables/gestor-colaborador/IndexGestorColaborador'
import { IndexCalendarioColaborador } from '../components/private/tables/gestor-colaborador/IndexCalendarioColaborador'
import { VistaTareaColaborador } from '../components/private/tables/gestor-colaborador/VistaTareaColaborador'
import { ListaCotizaciones } from '../components/private/tables/cotizaciones/ListaCotizaciones'
import { EditarCotizacion } from '../components/private/tables/cotizaciones/EditarCotizacion'
import { ViewCotizacion } from '../components/private/tables/cotizaciones/ViewCotizacion'
import { ListaContratos } from '../components/private/tables/contratos/ListaContratos'
import { EditarContrato } from '../components/private/tables/contratos/EditarContrato'
import { ViewContrato } from '../components/private/tables/contratos/ViewContrato'
import { ListaVentasToOneCliente } from '../components/private/tables/ventas/ListaVentasToOneCliente'
import { ListaVentasGrafico } from '../components/private/tables/ventas/disenografico/ListaVentasGrafico'
import { IndexCalendarioLaboral } from '../components/private/tables/asistencia_laboral/Calendario/IndexCalendarioLaboral'
import { IndexCalendarioLaboralColaborador } from '../components/private/tables/colaboradores/horariolaboral/IndexCalendarioLaboralColaborador'
import { HorarioMensual } from '../components/private/tables/colaboradores/horariolaboral/HorarioMensual'
import { Reporte } from '../components/private/tables/colaboradores/horariolaboral/Reporte'
import { IndexHosting } from '../components/private/tables/hosting/IndexHosting'
import { CrearHosting } from '../components/private/tables/hosting/CrearHosting'
import { SeguimientoHosting } from '../components/private/tables/hosting/seguimiento/SeguimientoHosting'
import { ListaClientesConProyectos } from '../components/private/tables/clientes/ListaClientesConProyectos'
import { IndexCalendarioLaboralColaboradorUser } from '../components/private/tables/colaboradores/horariolaboral/IndexCalendarioLaboralColaboradorUser'
import { ListaServicios2 } from '../components/private/tables/servicios/ListaServicios2'
import { ReporteHosting } from '../components/private/tables/hosting/components/ReporteHosting'
import { ListaCapacitaciones } from '../components/private/tables/capacitaciones/ListaCapacitaciones'
import { AvanceCapacitaciones } from '../components/private/tables/capacitaciones/AvanceCapacitaciones'
import { ListaHosting } from '../components/private/tables/servicios/hosting/ListaHosting'
import { SeguimientoHostingCol } from '../components/private/tables/servicios/hosting/SeguimientoHostingCol'
import { PrivateLayoutClients } from '../components/private/PrivateLayoutClients'
import { ListadoResultados } from '../components/private/client/tables/ListadoResultados'
import { ViewResultados } from '../components/private/client/tables/ViewResultados'
import { AuthProviderCliente } from '../context/AuthProviderCliente'
import { ListaCommunity } from '../components/private/tables/community/ListaCommunity'
import { ListaDesarrolloWeb } from '../components/private/tables/desarrollo_web/ListaDesarrolloWeb'
import { Autenticate } from '../components/public/Autenticate'
import { IndexCitasReuniones } from '../components/private/tables/citas_reuniones/IndexCitasReuniones'
import { ListaSoporteHosting } from '../components/private/tables/soporte_hosting/ListaSoporteHosting'
import { IndexCitasReuniones2 } from '../components/private/tables/citas_reuniones/IndexCitasReuniones2'
import { MetricasCommunity } from '../components/private/tables/dashboard/community_clientes/MetricasCommunity'
import { MetricasDesarrollo } from '../components/private/tables/dashboard/desarrollo/MetricasDesarrollo'
import { EditarColaborador } from '../components/private/tables/colaboradores/edicion/EditarColaborador'
import { RegisterColaborador } from '../components/private/tables/colaboradores/registro/RegisterColaborador'
import { MetricasColaboradores } from '../components/private/tables/dashboard/colaboradores/MetricasColaboradores'
import { ResultExterno } from '../components/private/tables/dashboard/colaboradores/ResultExterno'
import { ListaTransacciones } from '../components/private/tables/transacciones-list/ListaTransacciones'
import { EditarTransaccion } from '../components/private/tables/transacciones-list/EditarTransaccion'
import { MetricasClienteCM } from '../components/private/tables/servicios/community/metricasToCliente/MetricasClienteCM'
import { ListadoInformativas } from '../components/private/tables/brief_informativa/ListadoInformativas'
import { ViewBriefInformativa } from '../components/private/tables/brief_informativa/ViewBriefInformativa'
import { ListadoAdministrable } from '../components/private/tables/brief_administrable/ListadoAdministrable'
import { ViewBriefAdministrables } from '../components/private/tables/brief_administrable/ViewBriefAdministrables'
import { ListadoLandingPage } from '../components/private/tables/brief_landing/ListadoLandingPage'
import { ViewBriefLanding } from '../components/private/tables/brief_landing/ViewBriefLanding'
import { ListadoTienda } from '../components/private/tables/brief_tienda/ListadoTienda'
import { ViewBriefTiendas } from '../components/private/tables/brief_tienda/ViewBriefTiendas'
import { ListaCarrito } from '../components/private/tables/carrito-compras/ListaCarrito'
import { ListaBriefDiseño } from '../components/private/tables/briefs_diseno/ListaBriefDiseno'
import { RegistrarBriefDiseño } from '../components/private/tables/briefs_diseno/RegistrarBriefDiseno'
import { EditarBrief } from '../components/private/tables/briefs_diseno/EditarBrief'
import { ViewBriefDiseño } from '../components/private/tables/briefs_diseno/ViewBriefDiseno'
import { AsignacionDiseño } from '../components/private/tables/briefs_diseno/AsignacionDiseno'
import { ListaBriefDiseñoNew } from '../components/private/tables/briefs_diseno_new/ListaBriefDisenoNew'
import { RegistrarBriefDiseñoNew } from '../components/private/tables/briefs_diseno_new/RegistrarBriefDisenoNew'
import { EditarBriefNew } from '../components/private/tables/briefs_diseno_new/EditarBriefNew'
import { ViewBriefDiseñoNew } from '../components/private/tables/briefs_diseno_new/ViewBriefDisenoNew'
import { AsignacionDiseñoNew } from '../components/private/tables/briefs_diseno_new/AsignacionDisenoNew'
import { Propuestas } from '../components/private/tables/briefs_diseno_new/Propuestas'
import { IndexBackupHosting } from '../components/private/tables/backup-hosting/IndexBackupHosting'
import { ListaCategoriasNewsletter } from '../components/private/tables/newsletter/categorias/ListaCategoriasNewsletter'
import { CreatCategoriaNewsletter } from '../components/private/tables/newsletter/categorias/CreatCategoriaNewsletter'
import { EditarCategoriaNewsletter } from '../components/private/tables/newsletter/categorias/EditarCategoriaNewsletter'
import { ListarArticulosNesletter } from '../components/private/tables/newsletter/articulos/ListarArticulosNesletter'
import { CreatArticulosNewsletter } from '../components/private/tables/newsletter/articulos/CreatArticulosNewsletter'
import { EditarArticuloNewsletter } from '../components/private/tables/newsletter/articulos/EditarArticuloNewsletter'
import { ListaMailsNewsletter } from '../components/private/tables/newsletter/mails/ListaMailsNewsletter'
import { ResultadosMails } from '../components/private/tables/newsletter/mails/ResultadosMails'
import { ResultExternoToHosting } from '../components/private/tables/dashboard/colaboradores/ResultExternoToHosting'
import { ResultadosMailsGeneral } from '../components/private/tables/newsletter/mails/ResultadosMailsGeneral'
import { ViewOneGestor } from '../components/private/tables/gestor-tareas/view-gestor/ViewOneGestor'
import { VistaTarea } from '../components/private/tables/BACKUP-gestor-tareas/VistaTarea'
import { IndexCompartidosAntiguos } from '../components/private/tables/BACKUP-gestor-tareas/IndexCompartidosAntiguos'
import { ListaCupones } from '../components/private/tables/cupones/ListaCupones'
import { EditarCupones } from '../components/private/tables/cupones/EditarCupones'

export const Routing = (): JSX.Element => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AuthProviderCliente>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/auth" element={<Autenticate />} />
          </Routes>
        </AuthProviderCliente>
      </AuthProvider>
      <AuthProvider>
        <Routes>
          {/* PRIVADO */}
          <Route path="admin" element={<PrivateLayout />}>
            {/* CITAS REUNIONES */}
            <Route path="lista-cupones" element={<ListaCupones />} />
            <Route path="lista-cupones/editar/:id" element={<EditarCupones />} />
            {/* MAILS */}
            <Route path="newsletter/mails" element={<ListaMailsNewsletter />} />
            <Route path="newsletter/mails/reporte" element={<ResultadosMailsGeneral />} />
            <Route path="newsletter/mails/resultados/:id" element={<ResultadosMails />} />
            {/* NEWSLETTER */}
            <Route path="newsletter/categorias" element={<ListaCategoriasNewsletter />} />
            <Route path="newsletter/categorias/agregar" element={<CreatCategoriaNewsletter />} />
            <Route path="newsletter/categorias/editar/:id" element={<EditarCategoriaNewsletter />} />

            <Route path="newsletter/articulos" element={<ListarArticulosNesletter />} />
            <Route path="newsletter/articulos/agregar" element={<CreatArticulosNewsletter />} />
            <Route path="newsletter/articulos/editar/:id" element={<EditarArticuloNewsletter />} />

            {/* backup */}
            <Route path="backup" element={<IndexBackupHosting />} />
            {/* COMMUNITY */}
            <Route path="carrito-list" element={<ListaCarrito />} />
            <Route path="lista-community" element={<ListaCommunity />} />
            <Route path="lista-community/metricas" element={<MetricasCommunity />} />
            <Route path="lista-desarrollo_web" element={<ListaDesarrolloWeb />} />
            <Route path="lista-desarrollo_web/metricas" element={<MetricasDesarrollo />} />

            {/* INFORMATIVAS */}
            <Route path="lista-briefs-informativas" element={<ListadoInformativas />} />
            <Route path="lista-briefs-informativas/view/:id" element={<ViewBriefInformativa />} />

            {/* ADMINISTRABLES */}
            <Route path="lista-briefs-administrables" element={<ListadoAdministrable />} />
            <Route path="lista-briefs-administrables/view/:id" element={<ViewBriefAdministrables />} />

            {/* LANDING */}
            <Route path="lista-briefs-landing" element={<ListadoLandingPage />} />
            <Route path="lista-briefs-landing/view/:id" element={<ViewBriefLanding />} />

            {/* TIENDA */}
            <Route path="lista-briefs-tienda" element={<ListadoTienda />} />
            <Route path="lista-briefs-tienda/view/:id" element={<ViewBriefTiendas />} />

            <Route path="hosting" element={<IndexHosting />} />
            <Route path="lista-hosting" element={<ListaHosting />} />
            <Route path="soporte-hosting" element={<ListaSoporteHosting />} />
            <Route path="lista-hosting/avances/:id" element={<SeguimientoHostingCol />} />
            <Route path="hosting/registro" element={<CrearHosting />} />
            <Route path="hosting/avances/:id" element={<SeguimientoHosting />} />
            <Route path="hosting/reporte" element={<ReporteHosting />} />
            <Route path="capacitaciones" element={<ListaCapacitaciones />} />
            <Route path="capacitaciones/avances/:id" element={<AvanceCapacitaciones />} />
            {/* CONTRATOS */}
            <Route path="lista-contratos" element={<ListaContratos />} />
            <Route path="lista-contratos/editar/:id" element={<EditarContrato />} />
            <Route path="lista-contratos/view/:id" element={<ViewContrato />} />
            {/* COTIZACIONES */}
            <Route path="lista-cotizaciones" element={<ListaCotizaciones />} />
            <Route path="lista-cotizaciones/editar/:id" element={<EditarCotizacion />} />
            <Route path="lista-cotizaciones/view/:id" element={<ViewCotizacion />} />
            {/* GESTOR DE TAREAS */}
            <Route path="gestor-tareas" element={<IndexGestor />} />
            <Route path="gestor-tareas/citas-reuniones" element={<IndexCitasReuniones />} />
            <Route path="gestor-tareas/citas-reuniones/:id" element={<IndexCitasReuniones2 />} />
            <Route path="gestor-tareas/calendario" element={<IndexCalendario />} />
            <Route path="gestor-tareas/compartidos" element={<IndexCompartidos />} />
            <Route path="gestor-tareas/compartidos-antiguos" element={<IndexCompartidosAntiguos />} />
            <Route path="gestor-tareas/:idAuth/view/:idTablero/image/:index" element={<VistaTarea />} />
            <Route path="gestor-tareas/findOne/:idTablero/image/:index" element={<ViewOneGestor />} />
            {/* PLANES */}
            <Route index element={<IndexCompartidos />} />
            <Route path="lista-planes" element={<ListaPlanes />} />
            <Route path="lista-planes/agregar" element={<RegistrarPlan />} />
            <Route path="lista-planes/editar/:id" element={<EditarPlan />} />
            {/* COLABORADORES */}
            <Route path="colaboradores" element={<ListaColaboradores />} />
            <Route path="colaboradores/horario-laboral" element={<IndexCalendarioLaboral />} />
            <Route path="colaboradores/horario-laboral/:id" element={<IndexCalendarioLaboralColaborador />} />
            <Route path="colaboradores/horario-laboral-user" element={<IndexCalendarioLaboralColaboradorUser />} />
            <Route path="colaboradores/horario-mensual/:id" element={<HorarioMensual />} />
            <Route path="colaboradores/horario-reporte/:id" element={<Reporte />} />
            <Route path="colaboradores/agregar" element={<RegisterColaborador />} />
            <Route path="colaboradores/editar/:id" element={<EditarColaborador />} />
            <Route path="colaboradores/reporte/:id" element={<ReportePorColaborador />} />
            <Route path="colaboradores/gestor_tareas/:idCol/:nameCol" element={<IndexGestorColaborador />} />
            <Route path="colaboradores/gestor_tareas/:idCol/:nameCol/calendario" element={<IndexCalendarioColaborador />} />
            <Route path="colaboradores/gestor_tareas/:idCol/:nameCol/:idAuth/view/:idTablero/image/:index" element={<VistaTareaColaborador />} />
            {/* DISEÑO */}
            <Route path="lista-briefs-diseños" element={<ListaBriefDiseño />} />
            <Route path="lista-briefs-diseños/agregar" element={<RegistrarBriefDiseño />} />
            <Route path="lista-briefs-diseños/editar/:id" element={<EditarBrief />} />
            <Route path="lista-briefs-diseños/view/:id" element={<ViewBriefDiseño />} />
            <Route path="lista-briefs-diseños/asignar/:id" element={<AsignacionDiseño />} />
            {/* CLIENTES */}
            <Route path="lista-clientes" element={<ListaClientes />} />
            <Route path="lista-clientes/proyectos/:id" element={<ListaVentasToOneCliente />} />
            <Route path="lista-clientes/conproyectos" element={<ListaClientesConProyectos />} />
            <Route path="lista-pre-clientes" element={<Preclientes />} />
            <Route path="lista-pre-clientes/agregar" element={<RegistroPreClientes />} />
            <Route path="lista-pre-clientes/editar/:id" element={<EditarPreCliente />} />
            <Route path="lista-historial" element={<ListaHistorial />} />
            <Route path="llamadas-pendientes" element={<ListaPendientes />} />
            <Route path="lista-clientes/agregar" element={<RegistrarCliente />} />
            <Route path="lista-clientes/editar/:id" element={<EditarCliente />} />
            <Route path="lista-clientes/ver/:id" element={<VerCliente />} />
            <Route path="lista-clientes/resumen/:id" element={<ComentariosClientes />} />
            <Route path="lista-preventa" element={<ListaPreventa />} />
            <Route path="lista-preventa/view/:id" element={<ViewPreventa />} />
            <Route path="lista-preventa/editar/:id" element={<EditarPreventa />} />
            <Route path="lista-preventa/sinproyectos" element={<ListadoClientesSInProyectos />} />
            {/* VENTAS */}
            <Route path="lista-ventas" element={<ListaVentas />} />
            <Route path="lista-ventas/categoria/:texto" element={<ListaVentasGrafico />} />
            <Route path="lista-ventas-agencia" element={<ListaProyectosAgencia />} />
            <Route path="lista-ventas/view/:id" element={<ViewVenta />} />
            <Route path="lista-ventas/editar/:id" element={<EditarVentas />} />
            {/* <Route path="lista-ventas/acta-aceptacion/:id" element={<ActaAceptacion />} /> */}
            <Route path="lista-ventas/generarContrato/:id" element={<GenerarContrato />} />
            <Route path="lista-prueba" element={<ListaPrueba />} />
            {/* VENTAS VENCIDOS */}
            <Route path="lista-ventas-vencidos" element={<ListaVentasVencidos />} />
            {/* LISTA VENTAS POR COLABORADOR */}
            <Route path="lista-ventas/:id" element={<ListaVentasPorColaborador />} />
            <Route path="lista-ventas/:id/status" element={<StatusPorColaborador />} />
            <Route path="lista-ventas/status-colabordador/:id" element={<StatusToColaborador />} />
            <Route path="seguimiento/:id" element={<VistaSeguimiento />} />
            {/* SERVICIOS */}
            <Route path="lista-servicios" element={<ListaServicios />} />
            <Route path="lista-servicios-agencia" element={<ListaServicios2 />} />
            <Route path="lista-servicios/view/:id" element={<ViewServicio />} />
            <Route path="lista-servicios/avances/:id" element={<Avances />} />
            <Route path="lista-servicios/avances/metricas-cm/:id" element={<MetricasClienteCM />} />
            <Route path="lista-servicios/avances2/:id" element={<Avances2 />} />
            <Route path="clientes" element={<ListaClientesColaboradores />} />
            <Route path="clientes/resumen/:id" element={<ComentariosClientes />} />
            {/* TRANSACCIONES */}
            {/* <Route path="transacciones" element={<ListaTransacciones />} /> */}
            <Route path="transacciones-list" element={<ListaTransacciones />} />
            <Route path="transacciones-list/viewTransaccion/:id" element={<EditarTransaccion />} />

            {/* DISEÑO NEW */}
            <Route path="lista-briefs-diseños-new" element={<ListaBriefDiseñoNew />} />
            <Route path="lista-briefs-diseños-new/agregar" element={<RegistrarBriefDiseñoNew />} />
            <Route path="lista-briefs-diseños-new/editar/:id" element={<EditarBriefNew />} />
            <Route path="lista-briefs-diseños-new/view/:id" element={<ViewBriefDiseñoNew />} />
            <Route path="lista-briefs-diseños-new/asignar/:id" element={<AsignacionDiseñoNew />} />
            <Route path="lista-briefs-diseños-new/propuestas/:id" element={<Propuestas />} />
            {/* CLASIFICADOS */}
            <Route path="lista-clasificados" element={<ListaClasificados />} />
            <Route path="lista-clasificados/registro" element={<RegistrarClasificados />} />
            <Route path="lista-clasificados/editar/:id" element={<EditarClasificados />} />
            {/* comunity */}
            <Route path="lista-briefs-comunity" element={<ListadoComunity />} />
            <Route path="lista-briefs-comunity/agregar" element={<RegistrarBriegComunity />} />
            <Route path="lista-briefs-comunity/editar/:id" element={<EditarBriefComunity />} />
            <Route path="lista-briefs-comunity/view/:id" element={<ViewBriefComunity />} />
            <Route path="lista-briefs-comunity/asignar/:id" element={<AsignacionComunity />} />
            {/* BROCHURE */}
            <Route path="lista-briefs-brochure" element={<ListadoBrochure />} />
            <Route path="lista-briefs-brochure/agregar" element={<RegistrarBriefBrochure />} />
            <Route path="lista-briefs-brochure/editar/:id" element={<EditarBriefBrochure />} />
            <Route path="lista-briefs-brochure/view/:id" element={<ViewBriefBrochure />} />
            <Route path="lista-briefs-brochure/asignar/:id" element={<AsginacionBriefBrochure />} />
            {/* FLYER */}
            <Route path="lista-briefs-flyer" element={<ListadoFlyers />} />
            <Route path="lista-briefs-flyer/agregar" element={<RegistrarBriefFlyer />} />
            <Route path="lista-briefs-flyer/editar/:id" element={<EditarBriefFlyer />} />
            <Route path="lista-briefs-flyer/view/:id" element={<ViewBriefFlyer />} />
            <Route path="lista-briefs-flyer/asignar/:id" element={<AsignacionFlyer />} />
            {/* CATEGORIAS */}
            <Route path="categorias-portafolio" element={<ListaCategoriasPortafolio />} />
            <Route path="categorias-portafolio/agregar" element={<RegistrarCategoriasToPortafolio />} />
            <Route path="categorias-portafolio/editar/:id" element={<EditarCategoriasToPortafolio />} />
            {/* CATEGORIAS */}
            <Route path="subcategorias-portafolio" element={<ListaSubCategoriasPortafolio />} />
            <Route path="subcategorias-portafolio/agregar" element={<RegistrarSubcategoriaToPortafolio />} />
            <Route path="subcategorias-portafolio/editar/:id" element={<EditarSubCategoriasToPortafolio />} />
            {/* CATEGORIAS */}
            <Route path="items-portafolio" element={<ListaItemsPortafolio />} />
            <Route path="items-portafolio/agregar" element={<RegistraItemToPortafolio />} />
            <Route path="items-portafolio/editar/:id" element={<EditarItemsToPortafolio />} />

            {/* LISTADO CM */}
            <Route path="listadocm" element={<IndexCalendarioCm />} />
            <Route path="listadocm/view/:id" element={<ViewCm />} />
            <Route path="listadocm/admin/listadocm/metricas" element={<ViewCm />} />
            {/* <Route path="listadocm/view/:id/calendario/:idContenido" element={<CalendarioView />} /> */}

            {/* DOCUMENTOS */}
            <Route path="documentos" element={<IndexDocumentos />} />
          </Route>
          <Route path="admin/lista-ventas/metricas" element={<Metricas />} />
          <Route path="admin/lista-ventas-vencidos/metricas" element={<MetricasVencidos />} />
          <Route path="admin/lista-ventas/status" element={<Status />} />
          <Route path="admin/citas" element={<GestordeCitas />} />
          <Route path="admin/historialllamadas" element={<HistorialLlamadas />} />
          <Route path="admin/lista-clientes/status" element={<ExportExcelClientes />} />
          <Route path="admin/lista-preventa/sinproyectos/status" element={<ExportExcelClientesSinproyectos />} />
          <Route path="admin/lista-preventa/status" element={<ExportExcelPreVentas />} />
          {/* METRICAS CLIENTES */}
          <Route path="admin/dashboard" element={<LayoutDashboard />}>
            <Route index element={<MetricasClientes />} />
            <Route path="clientes" element={<MetricasClientes />} />
            <Route path="ventas" element={<MetricasVentas />} />
            <Route path="community" element={<MetricasCm />} />
            <Route path="community-manager" element={<MetricasCommunity />} />
            <Route path="colaboradores" element={<MetricasColaboradores />} />
            <Route path="colaboradores-result" element={<ResultExterno />} />
            <Route path="colaboradores-result-hosting" element={<ResultExternoToHosting />} />
          </Route>
        </Routes>
      </AuthProvider>
      <AuthProviderCliente>
        <Routes>
          <Route path="cliente" element={<PrivateLayoutClients />}>
            <Route index element={<ListadoResultados />} />
            <Route path="view-servicio/:id" element={<ViewResultados />} />
          </Route>
        </Routes>
      </AuthProviderCliente>
    </BrowserRouter>
  )
}
