import React from 'react'

export default function FormatoFecha ({ fechaISO }: { fechaISO: string }) {
  const fecha = new Date(fechaISO)
  // Ajustar a horario peruano (UTC-5)
  const horaPeruana = new Date(fecha.getTime() - 5 * 60 * 60 * 1000) // Restar 5 horas
  // Obtener horas y minutos
  const horas = horaPeruana.getUTCHours() // Usar getUTCHours para obtener la hora correcta
  const minutos = String(horaPeruana.getUTCMinutes()).padStart(2, '0') // Usar getUTCMinutes
  const horasFormateadas = horas % 12 || 12 // Convertir a formato 12 horas
  const amPm = horas >= 12 ? 'PM' : 'AM' // Determinar si es AM o PM
  // Formatear la fecha
  const opcionesFecha: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' }
  const fechaFormateada = horaPeruana.toLocaleDateString('es-PE', opcionesFecha)
  // Generar la cadena final
  const resultado = `${fechaFormateada} - ${horasFormateadas}:${minutos} ${amPm}`
  return <span>{resultado}</span>
}
