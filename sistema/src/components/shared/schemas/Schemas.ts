import * as Yup from 'yup'
import { startOfDay } from 'date-fns'

export const SchemaCupon = Yup.object().shape({
  descuento: Yup.number().min(1, 'El descuento debe ser mayor a 0').required('El descuento es requerido'),
  fecha: Yup.date().min(startOfDay(new Date()), 'La fecha no puede ser en días anteriores').required('La fecha es requerida')
})

export const validationSchemaCm = Yup.object().shape({
  facebookCrecimiento: Yup.object({
    megusta: Yup.number().required('Requerido'),
    seguidores: Yup.number().required('Requerido'),
    impresiones: Yup.number().required('Requerido'),
    visitas: Yup.number().required('Requerido'),
    publicaciones: Yup.number().required('Requerido')
  }),
  facebookPublicaciones: Yup.object({
    interacciones: Yup.number().required('Requerido'),
    alcance: Yup.number().required('Requerido'),
    impresiones: Yup.number().required('Requerido'),
    publicaciones: Yup.number().required('Requerido')
  }),
  facebookReels: Yup.object({
    interacciones: Yup.number().required('Requerido'),
    alcance: Yup.number().required('Requerido'),
    visualizaciones: Yup.number().required('Requerido'),
    reels: Yup.number().required('Requerido')
  }),
  instagramPerfil: Yup.object({
    alcance: Yup.number().required('Requerido'),
    visitaperfil: Yup.number().required('Requerido'),
    publicaciones: Yup.number().required('Requerido'),
    seguidores: Yup.number().required('Requerido'),
    impresiones: Yup.number().required('Requerido')
  }),
  instagramPosts: Yup.object({
    interacciones: Yup.number().required('Requerido'),
    alcance: Yup.number().required('Requerido'),
    publicaciones: Yup.number().required('Requerido')
  }),
  instagramReels: Yup.object({
    interacciones: Yup.number().required('Requerido'),
    alcance: Yup.number().required('Requerido'),
    reels: Yup.number().required('Requerido')
  }),
  tiktokComunidad: Yup.object({
    seguidores: Yup.number().required('Requerido'),
    videos: Yup.number().required('Requerido')
  }),
  tiktokPerfil: Yup.object({
    visitas: Yup.number().required('Requerido'),
    videos: Yup.number().required('Requerido')
  }),
  tiktokVideos: Yup.object({
    interacciones: Yup.number().required('Requerido'),
    alcance: Yup.number().required('Requerido'),
    visualizaciones: Yup.number().required('Requerido'),
    vídeos: Yup.number().required('Requerido')
  }),
  tiktokInteracciones: Yup.object({
    megusta: Yup.number().required('Requerido'),
    comentarios: Yup.number().required('Requerido'),
    compartidos: Yup.number().required('Requerido'),
    vídeos: Yup.number().required('Requerido')
  }),
  arrayDestacados: Yup.array().of(Yup.string().nullable()).notRequired(),
  aprendizajes: Yup.array().of(Yup.string().nullable()).notRequired(),
  retos: Yup.array().of(Yup.string().nullable()).notRequired(),
  fecha_texto: Yup.string().required('Requerido'),
  contenido: Yup.array().of(
    Yup.object({
      imagen: Yup.mixed().required('Imagen es requerida'),
      redSocial: Yup.string().required('Red Social es requerida'),
      fecha: Yup.date().required('Fecha es requerida'),
      texto: Yup.string().required('Texto es requerido')
    })
  )
})

export const SchemaSoporteHosting = Yup.object().shape({
  contexto: Yup.string().required('Este campo es requerido').min(1),
  horas: Yup.string().required('Este campo es requerido').min(1)
})

export const SchemaTransacciones = Yup.object().shape({
  estado: Yup.number().required('El campo es requerido')
})

// CLASIFICADOS
export const SchemaValidateCita = Yup.object().shape({
  asunto: Yup.string().required('El asunto es requerido'),
  dateinicio: Yup.string().required('La fecha de inicio es requerido'),
  timeinicio: Yup.string().required('La hora de inicio es requerido'),
  datefinal: Yup.string().required('La fecha de finalizacion es requerido'),
  timefinal: Yup.string().required('La hora de finalizacion es requerido'),
  cuerpo: Yup.string().required('El cuerpo es requerido')
})

export const SchemaValidateDesarrolloWeb = Yup.object().shape({
  domain_temp: Yup.string().nullable()
})

export const SchemaCotizacion = Yup.object().shape({
  precio: Yup.string().required('Este campo es requerido'),
  descuento: Yup.string().nullable(),
  tipo: Yup.string().required('Este campo es requerido'),
  autorizado: Yup.string().nullable()
})

export const SchemaClasificado = Yup.object().shape({
  nombre: Yup.string().required('Este campo es requerido'),
  celular: Yup.string().required('Este campo es requerido'),
  correo: Yup.string().required('Este campo es requerido').email('Digite un correo valido')
})

export const SchemaBriefFlyer = Yup.object().shape({
  nombres: Yup.string().nullable(),
  id_venta: Yup.string().required('Este campo es requerido').min(1),
  nombre_comercial: Yup.string().required('Este campo es requerido').min(3, 'El campo debe tener al menos 3 caracteres'),
  medida1: Yup.string().nullable(),
  medida2: Yup.string().nullable(),
  categoria: Yup.string().required('Este campo es requerido'),
  titular: Yup.string().required('Este campo es requerido'),
  descripcion: Yup.string().required('Este campo es requerido'),
  enlace: Yup.string().required('Este campo es requerido'),
  colores: Yup.string().required('Este campo es requerido')
})

export const SchemaBriefComunity = Yup.object().shape({
  nombres: Yup.string().nullable(),
  id_venta: Yup.string().required('Este campo es requerido').min(1),
  nombre_comercial: Yup.string().required('Este campo es requerido').min(3, 'El campo debe tener al menos 3 caracteres'),
  historia_empresa: Yup.string().required('Este campo es requerido').min(1),
  competidores: Yup.string().required('Este campo es requerido').min(1),
  propuesta_valor: Yup.string().required('Este campo es requerido').min(1),
  objetivos_especificos: Yup.string().required('Este campo es requerido').min(1),
  clientes_ideales: Yup.string().required('Este campo es requerido').min(1),
  propuesta_producto: Yup.string().required('Este campo es requerido').min(1),
  preferencia_canal: Yup.string().required('Este campo es requerido').min(1),
  presupuesto: Yup.string().required('Este campo es requerido').min(1),
  link_recursos: Yup.string().required('Este campo es requerido').min(1),
  fechas_importantes: Yup.string().required('Este campo es requerido').min(1),
  directrises_marca: Yup.string().required('Este campo es requerido').min(1),
  elementos_visuales: Yup.string().required('Este campo es requerido').min(1),
  restricciones_legales: Yup.string().required('Este campo es requerido').min(1),
  factores_consideracion: Yup.string().required('Este campo es requerido').min(1)
})

export const SchemaNewCampana = Yup.object().shape({
  nombres: Yup.string().required('Este campo es requerido').min(5, 'Minimo 5 digitos')
})

export const SchemaGenerarActa = Yup.object().shape({
  nombres: Yup.string().nullable()
})

export const SchemaMarca = Yup.object().shape({
  nombre_marca: Yup.string().required('Este campo es requerido').min(1)
})
export const SchemaEmail = Yup.object().shape({
  email: Yup.string().email('Registre en email valido').required('Este campo es requerido').min(1)
})

export const SchemaBriefBrochure = Yup.object().shape({
  nombres: Yup.string().nullable(),
  id_venta: Yup.string().required('Este campo es requerido').min(1),
  nombre_comercial: Yup.string().required('Este campo es requerido').min(3, 'El campo debe tener al menos 3 caracteres'),
  medida1: Yup.string().nullable(),
  medida2: Yup.string().nullable(),
  datoscontacto: Yup.string().required('Este campo es requerido'),
  historia: Yup.string().required('Este campo es requerido'),
  objetivo: Yup.string().required('Este campo es requerido'),
  servicios: Yup.string().required('Este campo es requerido'),
  enlace: Yup.string().required('Este campo es requerido')
})

export const SchemaPlanes = Yup.object().shape({
  nombre: Yup.string().required('Este campo es requerido'),
  codigo: Yup.string().required('Este campo es requerido'),
  descripcion: Yup.string().required('Este campo es requerido')
})

export const SchemaValidarAlta = Yup.object().shape({
  nombre_cliente: Yup.string().required('Este campo es requerido'),
  id_contrato: Yup.string(),
  fecha_inicio: Yup.string().required('Este campo es requerido'),
  asunto: Yup.string().required('Este campo es requerido')
})

export const SchemaValidarAntecedenteHosting = Yup.object().shape({
  p1: Yup.string().required('Este campo es requerido'),
  p2: Yup.string().required('Este campo es requerido'),
  p3: Yup.string().required('Este campo es requerido'),
  p4: Yup.string().required('Este campo es requerido'),
  p5: Yup.string().required('Este campo es requerido'),
  p6: Yup.string()
})

export const SchemaValidarHosting = Yup.object().shape({
  dominio: Yup.string().required('Este campo es requerido'),
  tiposervicio: Yup.string().required('Este campo es requerido'),
  inicio: Yup.string().required('Este campo es requerido'),
  montoC: Yup.string().required('Este campo es requerido'),
  montoP: Yup.string().required('Este campo es requerido')
})

export const SchemaValidarCapacitacion = Yup.object().shape({
  colaborador: Yup.string().required('Este campo es requerido'),
  tipo_capacitacion: Yup.string().required('Este campo es requerido'),
  duracion: Yup.string().required('Este campo es requerido'),
  fecha_capacitacion: Yup.string().required('Este campo es requerido')
})

export const SchemaValidarVentas = Yup.object().shape({
  nombre_empresa: Yup.string().required('Este campo es requerido'),
  id_cliente: Yup.string().required('Este campo es requerido')
})

export const SchemaValidarObsequio = Yup.object().shape({
  nombre_empresa: Yup.string().required('Este campo es requerido'),
  tipo: Yup.string().required('Este campo es requerido'),
  asunto: Yup.string().required('Este campo es requerido')
})

export const SchemaContrato = Yup.object().shape({
  dni_cliente: Yup.string().required('Este campo es requerido'),
  tipo_documento: Yup.string().required('Este campo es requerido'),
  tiempo: Yup.string().required('Este campo es requerido'),
  precio: Yup.string().required('Este campo es requerido'),
  fecha: Yup.string().required('Este campo es requerido')
})

export const SchemaPropuestas = Yup.object().shape({
  comentarios: Yup.string().required('Este campo es requerido'),
  puntuacion: Yup.string().required('Este campo es requerido')
})

export const SchemaEditarVentas = Yup.object().shape({
  nombre_empresa: Yup.string(),
  medio_ingreso: Yup.string(),
  dni_ruc: Yup.string().nullable(),
  id_contrato: Yup.string(),
  nombres: Yup.string(),
  apellidos: Yup.string()
})

export const SchemaBrief = Yup.object().shape({
  nombres: Yup.string().required('Este campo es requerido').min(1),
  email: Yup.string().email('Email invalido').required('Este campo es requerido'),
  celular: Yup.string().required('Este campo es requerido').min(9, 'El numero debe tener 9 digitos').max(9, 'El numero debe tener 9 digitos'),
  base_proyecto: Yup.string().required('Este campo es requerido'),
  nombre_empresa: Yup.string().required('Este campo es requerido').min(3, 'El campo debe tener al menos 3 caracteres'),
  principales_servicios: Yup.string().required('Este campo es requerido').min(3, 'El campo debe tener al menos 3 caracteres'),
  referencias: Yup.string().required('Este campo es requerido'),
  transmitir: Yup.string().required('Este campo es requerido').min(3, 'El campo debe tener al menos 3 caracteres')
})

export const SchemaBriefNew = Yup.object().shape({
  nombres: Yup.string().nullable(),
  id_venta: Yup.string().required('Este campo es requerido').min(1),
  base_proyecto: Yup.string().required('Este campo es requerido'),
  nombre_empresa: Yup.string().required('Este campo es requerido').min(3, 'El campo debe tener al menos 3 caracteres'),
  principales_servicios: Yup.string().required('Este campo es requerido').min(3, 'El campo debe tener al menos 3 caracteres'),
  referencias: Yup.string().required('Este campo es requerido'),
  transmitir: Yup.string().required('Este campo es requerido').min(3, 'El campo debe tener al menos 3 caracteres')
})

export const SchemaRegistroCategoriaNewsletter = Yup.object().shape({
  titulo: Yup.string().required('Este campo es requerido')
})

export const SchemaRegistroArticuloNewsletter = Yup.object().shape({
  titulo: Yup.string().required('Este campo es requerido'),
  id_categoria: Yup.string().required('Este campo es requerido'),
  autor: Yup.string().required('Este campo es requerido')
})

export const SchemaCategoriasToPortafolio = Yup.object().shape({
  titulo: Yup.string().required('Este campo es requerido'),
  url: Yup.string().required('Este campo es requerido')
})

export const SchemaSubCategoriasToPortafolio = Yup.object().shape({
  titulo: Yup.string().required('Este campo es requerido'),
  idCategoria: Yup.string().required('Este campo es requerido'),
  url: Yup.string().required('Este campo es requerido')
})

export const SchemaItemsToPortafolio = Yup.object().shape({
  titulo: Yup.string().required('Este campo es requerido'),
  idSubcategoria: Yup.string().required('Este campo es requerido')
})

export const SchemaLlamadas = Yup.object().shape({
  evento: Yup.string().required('Este campo es requerido').min(1),
  id_cliente: Yup.string().required('Este campo es requerido').min(1)
})

export const SchemePreClientes = Yup.object().shape({
  nombres: Yup.string().required('Este campo es requerido').min(1),
  apellidos: Yup.string().required('Este campo es requerido').min(1)
})

export const ShemaUsuarios = Yup.object().shape({
  name: Yup.string().required('El nombre es obligatorio').min(3),
  genero: Yup.string().required('El genero es obligatorio').min(1),
  id_rol: Yup.string().required('El rol es obligatorio').min(1),
  email: Yup.string().required('El correo en uso es obligatorio').email('Digite un email valido para correo en uso'),
  estado: Yup.string().required('El campo estado es obligatorio').min(1)
})

export const ShemaUsuariosRegister = Yup.object().shape({
  name: Yup.string().required('El nombre es obligatorio').min(3),
  genero: Yup.string().required('El genero es obligatorio').min(1),
  id_rol: Yup.string().required('El rol es obligatorio').min(1),
  email: Yup.string().required('El correo en uso es obligatorio').email('Digite un email valido para correo en uso'),
  estado: Yup.string().required('El campo estado es obligatorio').min(1),
  password: Yup.string().required('El campo contraseña es obligatorio').min(5, 'La contraseña debe tener al menos 5 caracteres')
})

export const SchemePreventas = Yup.object().shape({
  nombres: Yup.string().required('Este campo es requerido').min(1),
  empresa: Yup.string().required('Este campo es requerido').min(1),
  apellidos: Yup.string().required('Este campo es requerido').min(1),
  celular: Yup.string().nullable().min(7, 'El numero debe ser mayor a 6 digitos').max(12, 'El numero debe ser menor a 12 digitos'),
  sexo: Yup.string().nullable(),
  medio_ingreso: Yup.string().nullable()
})

export const SchemaContactoClientes = Yup.object().shape({
  nombres: Yup.string().required('Este campo es requerido').min(1),
  correo: Yup.string().required('Este campo es requerido').email('Email invalido'),
  celular: Yup.string().required('Este campo es requerido').min(7, 'El numero debe tener al menos 7 digitos'),
  marca: Yup.string().required('Este campo es requerido').min(1),
  tipo_documento: Yup.string().required('Este campo es requerido').min(1)
})

export const SchemeVentas = Yup.object().shape({
  id: Yup.number().required('Este campo es requerido'),
  nombres: Yup.string().required('Este campo es requerido').min(1),
  empresa: Yup.string().required('Este campo es requerido').min(1),
  apellidos: Yup.string().required('Este campo es requerido').min(1),
  email: Yup.string().required('Este campo es requerido').email('Email invalido'),
  celular: Yup.string().required('Este campo es requerido').min(7, 'El numero debe tener al menos 7 digitos'),
  edad: Yup.string().nullable(),
  sexo: Yup.string().nullable(),
  medio_ingreso: Yup.string().required('Este campo es requerido')
})

export const SchemeVentasNew = Yup.object().shape({
  id_contrato: Yup.string().required('Este campo es requerido'),
  nombres: Yup.string(),
  apellidos: Yup.string()
})
