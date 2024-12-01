/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable multiline-ternary */
import { useState, useEffect } from 'react'
import { toast } from 'sonner'

export const ModalEdicion = ({
  setOpen,
  setProyectoSeleccionado,
  proyectoSeleccionado,
  Event,
  actualizarHorariLaboral
}: {
  setOpen: any
  setProyectoSeleccionado: any
  proyectoSeleccionado: any
  Event: any
  actualizarHorariLaboral: any
}): JSX.Element => {
  const [horaInicio, setHoraInicio] = useState(
    proyectoSeleccionado.actividad.horaInicio
  )
  const [horaFin, setHoraFin] = useState(
    proyectoSeleccionado.actividad.horaFin
  )
  const [texto, setTexto] = useState(
    proyectoSeleccionado.actividad.descripcion
  )

  const actualizarContenido = (): void => {
    if (horaFin && horaInicio && texto.length > 2) {
      if (Event.id) {
        let updatedDetalle = { ...Event.detalle }
        if (!updatedDetalle) {
          updatedDetalle = { horas: {} }
        }
        const horaKey = proyectoSeleccionado.hora
        const actividades = updatedDetalle[horaKey] || []
        const actividadIndex = actividades.findIndex(
          (actividad: any) => actividad.id == proyectoSeleccionado.actividad.id
        )
        if (actividadIndex !== -1) {
          actividades[actividadIndex] = {
            ...actividades[actividadIndex],
            descripcion: texto,
            horaInicio,
            horaFin
          }
        }
        updatedDetalle[horaKey] = actividades
        actualizarHorariLaboral({ ...Event, detalle: updatedDetalle })
        setOpen(false)
        setTexto('')
        setProyectoSeleccionado({ hora: null, actividad: null })
      }
    } else {
      toast.warning('Debe seleccionar hora de inicio y fin')
    }
  }

  useEffect(() => {
    const textarea = document.getElementById('tuTextArea')
    if (textarea) {
      textarea.style.height = 'inherit'
      textarea.style.height = `${textarea.scrollHeight}px`
    }
  }, [texto]) // Vuelve a ajustar la altura si el contenido cambia

  const handleTextChange = (e: any): void => {
    setTexto(e.target.value)
    e.target.style.height = 'inherit'
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    e.target.style.height = `${e.target.scrollHeight}px` // Ajusta la altura
  }

  return (
    <section className="absolute z-[999] inset-0 bg-gray-200 py-2">
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="flex flex-col gap-2 w-[400px]">
          <h2 className="text-xl font-bold text-center">Editar contenido</h2>
          <label htmlFor="horaInicio">Hora de inicio: {horaInicio}</label>
          <select
            id="minutos"
            value={horaInicio.split(':')[1]} // Obtener solo los minutos de la hora seleccionada
            onChange={(e) => {
              const newMinutes = e.target.value
              setHoraInicio(`${proyectoSeleccionado.hora}:${newMinutes}`) // Mantener la hora '10' y solo actualizar los minutos
            }}
          >
            <option value="">Seleccionar</option>
            {[...Array(60).keys()]
              .filter((minute) => minute % 5 === 0 || minute === 59)
              .map((minute) => (
                <option
                  key={minute}
                  value={minute < 10 ? '0' + minute : minute}
                >
                  {minute < 10 ? '0' + minute : minute}
                </option>
              ))}
          </select>
          <label htmlFor="horaFin" className="mt-4">
            Hora de fin: {horaFin}
          </label>
          <select
            id="minutos"
            value={horaFin.split(':')[1]} // Obtener solo los minutos de la hora seleccionada
            onChange={(e) => {
              const newMinutes = e.target.value
              setHoraFin(`${proyectoSeleccionado.hora}:${newMinutes}`) // Mantener la hora '10' y solo actualizar los minutos
            }}
          >
            <option value="">Seleccionar</option>
            {[...Array(60).keys()]
              .filter((minute) => minute % 5 === 0 || minute === 59)
              .map((minute) => (
                <option
                  key={minute}
                  value={minute < 10 ? '0' + minute : minute}
                >
                  {minute < 10 ? '0' + minute : minute}
                </option>
              ))}
          </select>
          <label htmlFor="horaFin" className="mt-4">
            Detallar actividad
          </label>
          <textarea
            placeholder="Escribir resumen"
            className="w-full h-full outline-none p-2 resize-none overflow-hidden text-black"
            id="tuTextArea"
            rows={1}
            value={texto}
            onChange={handleTextChange}
          ></textarea>
          <button
            className="bg-green-600 py-2 rounded-md text-white mt-3"
            onClick={() => {
              actualizarContenido()
            }}
          >
            Editar Actividad
          </button>
          <button
            onClick={() => {
              setOpen(false)
              setProyectoSeleccionado({ hora: null, proyecto: null })
              setTexto('')
            }}
          >
            Cancelar
          </button>
        </div>
      </div>
    </section>
  )
}
