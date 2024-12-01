export interface carrito {
  id: number | null
  nombre: string
  cantidad: number | null
  precio: number
  imagen1: string
  categoria: string
}

interface configuracion {
  nombre: string
  correo: string
  celular: string
  icono: string
  logo: string
  instragram: string
  facebook: string
  tiktok: string
  color: string
}

interface internasPagina {
  interna1: string
  interna2: string
  interna3: string
  interna4: string
}

interface bannerPagina {
  banner1: string
  banner2: string
}

interface informacionPagina {
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
}

export interface ImagenState {
  archivo: File | null
  archivoName: string
}

export interface productosValuesPagina {
  id: number | null
  imagenproducto: ImagenState
  titulo: string
  descripcion: string
}

interface productoPagina {
  tipoenfoque: string
  productos: string | undefined
}

interface seoPagina {
  imagenseo: string
  descripcionseo: string | undefined
}

export interface ValuesCategoriasPortafolio {
  id: number | null
  imagen1: ImagenState
}

export interface paginaValues {
  id: number | null
  configuracion: configuracion
  internas: internasPagina
  banner: bannerPagina
  informacion: informacionPagina
  productos: productoPagina
  seo: seoPagina
  marcas: string | undefined
}

export interface productosValues {
  id: number
  nombre: string
  imagen1: string
  imagen2: string
  imagen3: string
  id_marca: string
  marca: string
  categoria: string
  id_subcategoria: string
  id_categoria: number
  subcategoria: string
  codigo: string
  caracteristicas: string
  especificaciones: string
  precio: number
}

export interface errorValues {
  estado: string
  texto: string
}

export interface categoriasValues {
  id: number
  nombre: string
  imagen1: string
  icono: string
}

export interface bannerValues {
  id: number
  imagen1: string
}

export interface marcasValues {
  id: number
  imagen1: string
  nombre: string
}

export interface blogsValues {
  id: number
  imagen1: string
  titulo: string
  caracteristicas: string
}

export interface ConfiguracionValues {
  id: number | null
  celular1: string
  celular2: string
  correo1: string
  correo2: string
  direccion1: string
  direccion2: string
  direccion3: string
  facebook: string
  instagram: string
  youtube: string
  linkedin: string
  tiktok: string
  whatsapp: string
  horario: string
}
