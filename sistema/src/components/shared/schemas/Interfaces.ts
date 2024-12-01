import { type Dispatch, type SetStateAction } from 'react'

export interface gestorTareas {
  id: number
  titulo: string
  cuerpo: string
  evento: string
  id_user: number
  created_at: string
  updated_at: string
}

export interface valuesTransaccionlist {
  id: number
  paymentId: string
  formulario: any
  tarjeta: any
  comprador: any
  status: string
  transactionAmount: string
  estado: number
}

// AVANCES DE archivo

export interface bannersValues {
  id: number
  id_ventas: number
  pdf_contrato: string
  id_contrato: string
  nombre_empresa: string
  archivos_finales: string
  imagen1: string
  limitar_descarga: number
  fecha_fin: string
  fecha_inicio: string
  propuestas: string
  asignacion: string
  created_at: string
  updated_at: string | null
  community: string
  nombre_marca: string
}

export interface comentariosValues {
  id: number
  texto: string
  fecha: string
  hora: string
  idUser: string
  user: string
  respuestas: any
}

export interface ListcotizacionValues {
  id: string
  correlativo: string
  nombres: string
  apellidos: string
  created_at: string
  precio: string
  empresa: string
  descuento: string
  cotizacion: any
}

export interface ListaContratosValues {
  id: string
  correlativo: string
  nombres: string
  apellidos: string
  id_contacto: string
  arraycontacto: string
  created_at: string
  precio: string
  empresa: string
  tiempo: string
  pdf: string
  celular: string
  email: string
  contenido: string
  medio_ingreso: string
  id_cliente: string
  dni_cliente: string
  codigo: string
  uso: number
}

export interface cotizacionValues {
  precio: string
  descuento: string
}

export interface openFiltersValues {
  estado: boolean
  fecha: string | null
}

export interface openFiltersValuesToId {
  estado: boolean
  id: string | null
  nombre: string | null
  cantidad: string | null
}

export interface documentosArchivesValues {
  id: string
  type: string
  name: string
}

export interface filtrosValuesVentas {
  estado: string[]
  ingreso: string[]
}

export interface filtrosValues {
  estado: string
  pais: string
  departamento: string
  distrito: string
  edad: string[]
  genero: string[]
  ingreso: string[]
}

export interface archivoavancesValues {
  id: string
  nombre: string
  limite: string
  fecha: string
}

export interface clasificadosValues {
  id: number
  nombre: string
  icono: string
  correo: string
  celular: string
  created_at: string
  updated_at: string
  pagina_web: string
}

export interface clasificadosRegistroValues {
  nombre: string
  correo: string
  celular: string
  icono: string
  logo: string
  instragram: string
  facebook: string
  tiktok: string
  color: string
  // BANNER
  banner1: string
  banner2: string
  // INFORMACION
  titulo1: string
  titulo2: string
  titulo3: string
  titulo4: string
  subtitulo1: string
  subtitulo2: string
  subtitulo3: string
  subtitulo4: string
  imagentitulo1: string
  imagentitulo2: string
  imagentitulo3: string
  imagentitulo4: string
  // INTERNAS
  interna1: string
  interna2: string
  interna3: string
  interna4: string
  //
  //   PRODUCTOS - SERCIVIOS
  tipoenfoque: string
  productos: arrayImagesClasificados []
  //   SEO
  imagenseo: string
  descripcionseo: string
  marcas: arrayCategoriasToPortafolio []
}

export interface usurioValues {
  id: number
  name: string
  email: string
  firma: string
  estado: number
  resumen: string
}

export interface preclientesValues {
  nombres: string
  empresa: string
  apellidos: string
  celular: string
  sexo: string
  medio_ingreso: string
}

export interface notificacionesValues {
  id: number
  id_usuario: number
  tipo: string
  id_general: string
  usuario: string
  url: string
  contenido: string
  hidden_users: string
  icono: string
  created_at: string
}

export interface ValuesBrochure {
  nombres: string
  nombre_comercial: string
  medida1: string
  medida2: string
  datoscontacto: string
  historia: string
  objetivo: string
  servicios: string
  enlace: string
  id_venta: string
}

export interface valuesFlyer {
  nombres: string
  id_venta: string
  nombre_comercial: string
  medida1: string
  medida2: string
  categoria: string
  titular: string
  descripcion: string
  enlace: string
  colores: string
}

export interface valuesComunity {
  nombres: string
  id_venta: string
  nombre_comercial: string
  historia_empresa: string
  competidores: string
  propuesta_valor: string
  objetivos_especificos: string
  clientes_ideales: string
  propuesta_producto: string
  preferencia_canal: string
  presupuesto: string
  link_recursos: string
  fechas_importantes: string
  directrises_marca: string
  elementos_visuales: string
  restricciones_legales: string
  factores_consideracion: string
}

export interface ValuesPlanes {
  id: number
  nombre: string
  codigo: string
  descripcion: string
  tipo: string
}

export interface ValuesVentasValidate {
  id: number
  medio_ingreso: string
  codigo_contrato: string
}

export interface editorValues {
  content: string
  setContent: React.Dispatch<React.SetStateAction<string>>
}

export interface ValuesActa {
  id_contrato: string
  nombres_cliente: string
  nombre_marca: string
  fecha_inicio: string
  fecha_fin: string
}

export interface VluesContrato {
  id_contrato: string
  sexo: string
  precio: number
  fecha: string
  servicio: string
  primero: string
  titulo_contrato: string
  tiempo: string
  nombres_cliente: string
  dni_cliente: string
  pdf_contrrato: string
  tipo_documento: string
}

export interface modalVentas {
  open: boolean
  setOpen: React.Dispatch<React.SetStateAction<boolean>>
  id: string
  medio: string
  nombres: string
}

export interface validateClientes {
  id: string
  medio_ingreso: string
  nombres: string
  apellidos: string
}

export interface historialValues {
  id: string
  id_cliente: string
  nombres: string
  apellidos: string
  celular: string
  duracion: string
  evento: string
  created_at: string
}

export interface ValuesVentasEdit {
  medio_ingreso: string
  nombre_empresa: string
  nombre_marca: string
  id_contrato: string
  dni_ruc: string
  observaciones: string
}

export interface ImagePreviewPropsUdpdateGeneral {
  url: string
  setUrl: React.Dispatch<React.SetStateAction<string>>
  boton: boolean
  setBoton: React.Dispatch<React.SetStateAction<boolean>>
  imagen: string
  setImagen: React.Dispatch<React.SetStateAction<ImagenState>>
  clase: string
  disabled: boolean
  carpeta: string
}

export interface ImagePreviewPropsUdpdateClasificados {
  url: string
  setUrl: React.Dispatch<React.SetStateAction<string>>
  boton: boolean
  setBoton: React.Dispatch<React.SetStateAction<boolean>>
  imagen: string | null
  setImagen: React.Dispatch<React.SetStateAction<ImagenState>>
  clase: string
  disabled: boolean
  carpeta: string
}

export interface arrayCategoriasToPortafolio {
  id: number | null
  imagen1: ImagenState
}

export interface arrayContacto {
  id: number | null
  nombres: string
  marca: string
  celular: string
  correo: string
  created_at: string
}

export interface arrayImagesClasificados {
  id: number | null
  imagenproducto: ImagenState
  titulo: string
  descripcion: string
}

export interface ValuesCategoriasPortafolio {
  id: number
  imagen1: string
  url: string
  titulo: string
}

export interface deleteValuesCategorias {
  ruta: string
  id: number | null
  token: string | null
  totalPosts: number
  cantidadRegistros: number
  paginaActual: number
  setpaginaActual: (pagina: number) => void
  rutaFetch: string
  setData: React.Dispatch<React.SetStateAction<ValuesCategoriasPortafolio[]>>
  setTotalRegistros: React.Dispatch<React.SetStateAction<number>>
}

export interface deleteValuesSubCategorias {
  ruta: string
  id: number | null
  token: string | null
  totalPosts: number
  cantidadRegistros: number
  paginaActual: number
  setpaginaActual: (pagina: number) => void
  rutaFetch: string
  setData: React.Dispatch<React.SetStateAction<ValuesSubCategoriasPortafolio[]>>
  setTotalRegistros: React.Dispatch<React.SetStateAction<number>>
}

export interface deleteItemToPortafolio {
  ruta: string
  id: number | null
  token: string | null
  totalPosts: number
  cantidadRegistros: number
  paginaActual: number
  setpaginaActual: (pagina: number) => void
  rutaFetch: string
  setData: React.Dispatch<React.SetStateAction<ValuesItemsPortafolio[]>>
  setTotalRegistros: React.Dispatch<React.SetStateAction<number>>
}

export interface ValuesSubCategoriasPortafolio {
  id: number
  titulo: string
  url: string
  categoria: string
}

export interface ValuesItemsPortafolio {
  id: number
  imagen1: string
  subcategoria: string
  titulo: string
}

export interface ValuesCategoriasPortafolioToRegister {
  imagen1: ImagenState
  titulo: string
}

export interface AddressComponent {
  long_name: string
  short_name: string
  types: string[]
}

interface respuesta {
  hora: Date
  texto: string
}

export interface valuesResumen2 {
  id: number
  texto: string
  fecha: string
  hora: string
  user: string
  userId: string
}

export interface valuesResumen {
  id: number
  texto: string
  respuesta: null | respuesta
  respuestas: valuesResumen2 []
  fecha: string
  hora: string
  user: string
  userId: string
}

export interface valuesMarca {
  nombre_marca: string
}

export interface valuesEmail {
  email: string
}

export interface GeoData {
  country: string
  department: string
  district: string
}

export interface VluesToExcel {
  id: number
  contenido: string
  nombre_empresa: string
  email: string
  asignacion: string
  fecha_inicio: string
  fecha_fin: string
  celular: string
  contrato: string
  nombres: string
  apellidos: string
  edad: string
  sexo: string
  medio_ingreso: string
  estado: string
  id_contrato: string
  created_at: string
}

export interface valuesTransaccion {
  id: number
  total_pago: string
  nombres: string
  apellidos: string
  email: string
  celular: string
  id_transaccion: string
  tipo: string
  created_at: string
}

export interface ValuesVentaToMetricas {
  id: number
  id_cliente: string
  nombre_empresa: string
  fecha_inicio: string
  observaciones: string
  comentarios: string
  fecha_alta: string
  asignacion: string
  fecha_fin: string
  resumen: string
  id_contacto: string
  arraycontacto: string
  email: string
  celular: string
  edad: string
  sexo: string
  nombre_marca: string
  medio_ingreso: string
  estado: string
  nombres: string
  apellidos: string
  id_contrato: string
  created_at: string
}

export interface ValuesVenta {
  id: number
  nombre_empresa: string
  fecha_inicio: string
  observaciones: string
  comentarios: string
  fecha_alta: string
  asignacion: string
  fecha_fin: string
  resumen: string
  id_contacto: string
  arraycontacto: string
  email: string
  celular: string
  edad: string
  sexo: string
  nombre_marca: string
  medio_ingreso: string
  estado: string
  nombres: string
  apellidos: string
  id_contrato: string
  created_at: string
}

export interface Values {
  nombres: string
  celular: string
  email: string
  base_proyecto: string
  nombre_empresa: string
  historia_empresa: string
  principales_servicios: string
  colores: string
  referencias: string
  transmitir: string
}

export interface ValuesNew {
  nombres: string
  id_venta: string
  base_proyecto: string
  nombre_empresa: string
  historia_empresa: string
  principales_servicios: string
  colores: string
  referencias: string
  transmitir: string
}

export interface RolsValues {
  id: number
  slug: string
  accesos: string
  created_at: string
  updated_at: string
}

export interface ImagenState {
  archivo: File | null
  archivoName: string
}

export interface ImagePreviewProps {
  url: string
  setUrl: React.Dispatch<React.SetStateAction<string>>
  boton: boolean
  setBoton: React.Dispatch<React.SetStateAction<boolean>>
  setImagen: React.Dispatch<React.SetStateAction<ImagenState>>
  clase: string
}

export interface ImagePreviewPropsUdpdate {
  url: string
  setUrl: React.Dispatch<React.SetStateAction<string>>
  boton: boolean
  setBoton: React.Dispatch<React.SetStateAction<boolean>>
  imagen: string
  setImagen: React.Dispatch<React.SetStateAction<ImagenState>>
  clase: string
  disabled: boolean
}

export interface deleteValues {
  ruta: string
  id: number | null
  token: string | null
  totalPosts: number
  cantidadRegistros: number
  paginaActual: number
  setpaginaActual: (pagina: number) => void
  rutaFetch: string
  setData: React.Dispatch<React.SetStateAction<interfaceListaDiseño[]>>
  setTotalRegistros: React.Dispatch<React.SetStateAction<number>>
}

export interface contenidoInteface {
  id: string
  titulo: string
  contenido: null | ContextoInterface
}

export interface DuoContent {
  contenido: contenidoInteface
  contexto: tableroInterface
}

export interface paramsModalContenido {
  idCuerpo: string
  idTarjeta: string | null
}

export interface ContextoInterface {
  id: string
  titulo: string
  contexto: string
}

export interface tableroInterface {
  id: string
  titulo: string
  contenido: null | contenidoInteface[]
}

export interface deleteValuesNew {
  ruta: string
  id: number | null
  token: string | null
  totalPosts: number
  cantidadRegistros: number
  paginaActual: number
  setpaginaActual: (pagina: number) => void
  rutaFetch: string
  setData: React.Dispatch<React.SetStateAction<interfaceListaDiseñoNew[]>>
  setTotalRegistros: React.Dispatch<React.SetStateAction<number>>
}

export interface DatabaseItem {
  id: number
  precio: number
  nombre: string
  descripcion: string
}

export interface interfaceListaDiseño {
  id: number | null
  nombres: string
  celular: number | null
  email: string
  nombre_empresa: string
  nombre_marca: string
  created_at: string
  uptated_at: string
}

export interface interfaceListaDiseñoNew {
  id: number | null
  nombres: string
  id_contrato: string
  apellidos: string
  celular: number | null
  email: string
  nombre_empresa: string
  created_at: string
  uptated_at: string
}

// PAGINACION
export interface paginacionValues {
  totalPosts: number
  cantidadRegistros: number
  paginaActual: number
  setpaginaActual: (pagina: number) => void
}

export interface avanceValues {
  contexto: string
  imagenes: arrayImagenes[]
  archivos: arrayImagenes[]
  correos: arrayCorreos[]
  asunto: string
  fecha: string
  empresa: string
  motivo: string
  contacto: string
  fechaacta: string
  conclusion: string
  firma: string
  hora: string
}

export interface errorValues {
  estado: string
  texto: string
}

export interface FinalValues {
  contexto: string
  correos: arrayCorreos[]
  asunto: string
  fecha: string
  hora: string
  firma: string
}

export interface arrayAsignacion {
  id: number | null
  peso: string
}

export interface arrayAdicionales {
  id: number | null
  elemento: string
  cantidad: number
}

export interface arrayCorreos {
  id: number | null
  correo: string
}

export interface arrayImagenes {
  id: number | null
  imagen1: ImagenState
}

export interface arrayPropuestas {
  id: number | null
  sustentacion: string
  imagen1: ImagenState
}

export interface valuesUsuario {
  name: string
}

export interface ValuesPreventa {
  nombres: string
  empresa: string
  apellidos: string
  celular: string
  sexo: string
  dni_ruc: string
  medio_ingreso: string
}

export interface userValues {
  id: string
  name: string
  email: string
  email_alter: string
  firma: string
  pass_email: string
  id_rol: number
}

export interface pendientesValues {
  title: string
  start: string
  end: string
  client: ValuesPreventa
  user: userValues
}

export interface contactoClientes {
  nombres: string
  celular: string
  correo: string
  marca: string
  dni_ruc: string
  tipo_documento: string
}

export interface ListcontactoClientes {
  id: string
  nombres: string
  celular: string
  correo: string
  marca: string
  created_at: string
}

export interface ValuesPreventaModificate {
  id: number
  nombres: string
  empresa: string
  dni_ruc: string
  apellidos: string
  email: string
  celular: string
  edad: string
  sexo: string
  medio_ingreso: string
  estado: string
  id_contrato: string
  created_at: string
  arraycontacto: string
  antiguo: string
}

export interface ValuesGenerarVenta {
  medio_ingreso: string
  plan: string
}

export interface ventasEdit {
  id_contrato: string
  nombres: string
  apellidos: string
}

export interface Ubicacion {
  lat: number
  lng: number
}

export interface propsvaluesMapa {
  setLatitud: Dispatch<SetStateAction<number | null>>
  setLongitud: Dispatch<SetStateAction<number | null>>
  setUbicacion: Dispatch<SetStateAction<Ubicacion | null>>
  latitud: number | null
  longitud: number | null
  setLoading: Dispatch<SetStateAction<boolean>>
}
