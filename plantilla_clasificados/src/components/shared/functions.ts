export const capitalizeFirstLetter = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

function eliminarTildes (texto: string): string {
  return texto.normalize('NFD').replace(/[\u0300-\u036f]/g, '')
}

export function formatearURL (nombre: string): string {
  // Eliminar espacios al principio y al final del nombre
  let url = nombre.trim()
  // Convertir todo el string a minúsculas
  url = url.toLowerCase()
  // Reemplazar los espacios por guiones
  url = url.replace(/ /g, '-')
  // Eliminar tildes
  url = eliminarTildes(url)
  // Reemplazar caracteres especiales por sus equivalentes URL seguros
  url = url.replace(/[^a-zA-Z0-9-]/g, '')
  // Retornar la URL formateada
  return url
}
