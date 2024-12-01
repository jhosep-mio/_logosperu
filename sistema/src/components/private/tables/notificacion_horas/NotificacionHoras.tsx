import { useEffect, useRef, useState } from 'react'
import { addDays, differenceInMilliseconds } from 'date-fns'
import horario from './../../../../assets/icons/horario.svg'
import { Howl } from 'howler'
import musica from './../../../../assets/sonido/notificate.mp3'

const NotificacionHoras = (): JSX.Element => {
  // Estado para manejar la visibilidad del pop-up y el mensaje
  const [mostrarPopUp, setMostrarPopUp] = useState(false)
  const [mensajePopUp, setMensajePopUp] = useState('')
  const soundRef = useRef<any | null>(null) // Referencia para controlar el sonido
  // Función para calcular el tiempo restante hasta la hora deseada
  const calcularTiempoRestante = (hora: number, minuto: number): number => {
    const ahora = new Date() // Hora actual
    const horaObjetivo = new Date() // Hora objetivo
    horaObjetivo.setHours(hora, minuto, 0, 0) // Establece la hora y minutos

    // Si la hora ya ha pasado hoy, programa para mañana
    if (ahora > horaObjetivo) {
      return differenceInMilliseconds(addDays(horaObjetivo, 1), ahora)
    }

    // Retorna el tiempo restante en milisegundos
    return differenceInMilliseconds(horaObjetivo, ahora)
  }

  useEffect(() => {
    const horasAvisos = [
      { hora: 9, minuto: 25, mensaje: 'Es hora de subir el primer estado' },
      { hora: 12, minuto: 25, mensaje: 'Es hora de subir el segundo estado' }
    ]
    horasAvisos.forEach(({ hora, minuto, mensaje }) => {
      const tiempoRestante = calcularTiempoRestante(hora, minuto)
      setTimeout(() => {
        setMensajePopUp(mensaje)
        soundRef.current = new Howl({
          src: [musica] // Ruta del archivo de sonido
        })
        soundRef.current.play()
        setMostrarPopUp(true) // Muestra el pop-up cuando llegue la hora
      }, tiempoRestante)
    })
  }, [])

  // Función para cerrar el pop-up
  const cerrarPopUp = (): void => {
    setMostrarPopUp(false)
    if (soundRef.current) {
      soundRef.current.stop()
    }
  }

  return (
    <>
      {mostrarPopUp && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[999]">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm text-center">
            <p className="text-lg text-black uppercase font-bold">{mensajePopUp}</p>
            <img src={horario} alt="" className='my-4 p-4'/>
            <button
              onClick={cerrarPopUp}
              className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  )
}

export default NotificacionHoras
