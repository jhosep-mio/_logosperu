/* eslint-disable @typescript-eslint/restrict-template-expressions */
type Acentos = Record<string, string>

export const calcularTiempoTrabajadoActividades = (actividades: any[]): number => {
  let tiempoTrabajado = 0
  actividades.forEach((actividad: any) => {
    if (actividad.horaInicio && actividad.horaFin) {
      const horaInicio = new Date(`2024-03-18 ${actividad.horaInicio}`)
      const horaFin = new Date(`2024-03-18 ${actividad.horaFin}`)

      if (!isNaN(horaInicio.getTime()) && !isNaN(horaFin.getTime())) {
        let diffMs = horaFin.getTime() - horaInicio.getTime()

        // Ajustar el tiempo si los minutos terminan en _:59
        if (actividad.horaFin.endsWith(':59')) {
          diffMs += 60000 // Sumar un minuto en milisegundos
        }

        tiempoTrabajado += diffMs
      }
    }
  })

  // Convertir el tiempo a horas y minutos
  const horas = Math.floor(tiempoTrabajado / (1000 * 60 * 60))
  const minutos = Math.floor(
    (tiempoTrabajado % (1000 * 60 * 60)) / (1000 * 60)
  )

  // Puedes devolver el tiempo en el formato que necesites, como un objeto { horas, minutos }
  // o simplemente la cantidad total de minutos, dependiendo de tus necesidades
  return horas * 60 + minutos
}

export function calcularTiempoInvertidoEnProyecto (
  colaborador: any[],
  proyectoId: number
): number {
  let tiempoTotal = 0
  colaborador.forEach((col) => {
    if (col?.horario_laboral && JSON.parse(col.horario_laboral).length > 0) {
      JSON.parse(col.horario_laboral).forEach((horario: any) => {
        // Verificar dentro de detalle si hay entradas relacionadas al proyecto
        if (horario.detalle) {
          Object.values(horario.detalle).forEach((arrayDetalle: any): any => {
            arrayDetalle.forEach((detalleItem: any) => {
              if (
                detalleItem.proyecto &&
                  detalleItem.proyecto.id == proyectoId
              ) {
                const horaInicio = new Date(
                    `2024-03-18 ${detalleItem.horaInicio}`
                )
                const horaFin = new Date(`2024-03-18 ${detalleItem.horaFin}`)
                if (
                  !isNaN(horaInicio.getTime()) &&
                    !isNaN(horaFin.getTime())
                ) {
                  let diffMs = horaFin.getTime() - horaInicio.getTime()
                  // Ajustar el tiempo si los minutos terminan en _:59
                  if (detalleItem.horaFin.endsWith(':59')) {
                    diffMs += 60000 // Sumar un minuto en milisegundos
                  }
                  tiempoTotal += diffMs
                }
              }
            })
          })
        }
      })
    }
  })
  // Convertir el tiempo a horas y minutos
  const horas = Math.floor(tiempoTotal / (1000 * 60 * 60))
  const minutos = Math.floor((tiempoTotal % (1000 * 60 * 60)) / (1000 * 60))
  return horas * 60 + minutos
}

export function quitarAcentos (cadena: string): string {
  const acentos: Acentos = {
    á: 'a',
    é: 'e',
    í: 'i',
    ó: 'o',
    ú: 'u',
    Á: 'A',
    É: 'E',
    Í: 'I',
    Ó: 'O',
    Ú: 'U'
  }
  return cadena
    .toLowerCase()
    .replace(/\s/g, '')
    .split('')
    .map((letra) => acentos[letra] || letra)
    .join('')
    .toString()
}

export const formatDate = (date: Date): string | null => {
  try {
    const day = date.getDate().toString().padStart(2, '0')
    const month = (date.getMonth() + 1).toString().padStart(2, '0')
    const year = date.getFullYear()
    return `${day}/${month}/${year}`
  } catch (error) {
    console.error('Error al formatear la fecha', error)
    return null
  }
}

export const convertirFecha = (fecha: string): Date => {
  const [dia, mes, ano] = fecha.split('/').map(Number)
  return new Date(ano, mes - 1, dia)
}

export const formatAPIdate = (apiDate: string): string => {
  const months = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ]

  // Dividiendo la fecha basada en "/"
  const [day, month, year] = apiDate.split('/')

  // Creando un nuevo objeto de fecha
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-expect-error
  const date = new Date(year, month - 1, day)

  // Construyendo la cadena de fecha formateada
  const formatted = `${date.getDate()} de ${months[date.getMonth()]} del ${date.getFullYear()}`

  return formatted
}

// LIMPIAR CODGIOS DE CONTRATOS
export function limpiarCadena (cadena: string): string {
  const matches = cadena.match(/_(\d+)_/)
  if (matches && matches.length >= 2) {
    return matches[1]
  } else {
    return '--'
  }
}

export function limpiarNombreArchivo (uniqueFileName: string): string {
  const parts = uniqueFileName.split('_')
  // Si hay al menos dos partes (UUID y nombre de archivo), devuelve la segunda parte
  return parts.length >= 2 ? parts.slice(1).join('_') : uniqueFileName
}

export const formatFileSize = (size: number): string => {
  if (size < 1024) return `${size} B`
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`
  if (size < 1024 * 1024 * 1024) return `${(size / (1024 * 1024)).toFixed(1)} MB`
  return `${(size / (1024 * 1024 * 1024)).toFixed(1)} GB`
}
