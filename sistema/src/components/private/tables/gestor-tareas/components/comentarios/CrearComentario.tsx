/* eslint-disable @typescript-eslint/no-misused-promises */
import { useState } from 'react'
import { toast } from 'sonner'
import useAuth from '../../../../../../hooks/useAuth'
import { defaultPerfil } from '../../../../../shared/Images'

interface valuesProps {
  guardarComentarios: any
}

export const CrearComentario = ({
  guardarComentarios
}: valuesProps): JSX.Element => {
  const { auth } = useAuth()
  const [mostrarInput, setMostrarInput] = useState(false)
  const [texto, setTexto] = useState('')
  const [loading, setLoading] = useState(false)

  const obtenerFecha = (): string => {
    const fecha = new Date()
    return `${fecha.getDate()}/${fecha.getMonth() + 1}/${fecha.getFullYear()}`
  }

  const obtenerHora = (): string => {
    const fecha = new Date()
    return `${fecha.getHours()}:${fecha
      .getMinutes()
      .toString()
      .padStart(2, '0')}`
  }

  const agregarResumen = async (): Promise<void> => {
    if (texto) {
      setLoading(true)
      const nuevoResumen = {
        id: Date.now(),
        texto,
        fecha: obtenerFecha(),
        hora: obtenerHora(),
        user: auth.name,
        idUser: auth.id,
        respuestas: ''
      }
      guardarComentarios(nuevoResumen)
      setTexto('')
      setLoading(false)
      setMostrarInput(false)
    } else {
      toast.warning('Ingrese su comentario')
    }
  }

  return (
    <div className="w-full bg-white p-2 rounded-xl mb-0">
      <p
        className="w-full h-12 rounded-xl bg-primary border border-gray-400 p-2 text-gray-600 flex items-center gap-4 cursor-pointer"
        onClick={() => { setMostrarInput(true) }}
      >
        <img
          src={defaultPerfil}
          alt="Perfil"
          className="w-10 h-10 object-contain rounded-full"
        />
        <span className="block w-full">Escribe tu aporte o pregunta</span>
      </p>

      {/* Input para el comentario */}
      {mostrarInput && (
        <div className="mt-4 bg-gray-100 p-4 rounded-lg shadow">
          <textarea
            placeholder="Escribir comentario"
            className="w-full border p-2 rounded-lg mb-2 resize-none text-black"
            rows={3}
            value={texto}
            onChange={(e) => { setTexto(e.target.value) }}
          />
          <div className="flex justify-end gap-2">
            <button
              className="px-4 py-2 text-black bg-gray-300 rounded-md hover:bg-gray-400"
              onClick={() => { setMostrarInput(false) }}
              disabled={loading}
            >
              Cancelar
            </button>
            <button
              className="px-4 py-2 bg-main text-white rounded-md hover:bg-main_dark"
              onClick={async () => { await agregarResumen() }}
              disabled={loading}
            >
              {loading ? 'Enviando...' : 'Enviar'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
