/* eslint-disable multiline-ternary */
import { useState } from 'react'
import { FaSave } from 'react-icons/fa'
import { MdOutlineEdit } from 'react-icons/md'
import { IoCloseSharp } from 'react-icons/io5'
import useAuth from '../../../../../../hooks/useAuth'
import { type comentariosValues } from '../../../../../shared/schemas/Interfaces'
import { defaultPerfil } from '../../../../../shared/Images'

export const ListaComentarios = ({
  comentarios,
  editarComentario
}: {
  comentarios: comentariosValues[]
  editarComentario: any
}): JSX.Element => {
  const [textoEditado, setTextoEditado] = useState('')
  const { auth } = useAuth()
  const [idComentarioAEditar, setIdComentarioAEditar] = useState<number | null>(
    null
  )
  const [modoEdicion, setModoEdicion] = useState(false)

  const comentariosOriginales = [...comentarios]

  return (
    <div className="w-full bg-white p-4 rounded-xl h-auto  overflow-y-auto">
      <h3 className="uppercase text-black/80 text-xl w-full border-b-2 font-bold text-center pb-2 border-black/80 mb-6">
        Comentarios
        <span className="text-secondary-10">({comentarios?.length})</span>
      </h3>
      {comentarios?.length > 0 ? (
        comentariosOriginales
          .reverse()
          .map((comentario: comentariosValues, index: number) => (
            <div
              className="w-full bg-gray-100 shadow-md p-2 rounded-xl mb-4 relative"
              key={index}
            >
              {modoEdicion &&
              idComentarioAEditar === comentario.id &&
              auth.id == comentario.idUser &&
              comentario.respuestas == 0 ? (
                <span className="absolute top-2 right-2">
                  <div className="flex gap-2">
                    <IoCloseSharp
                      className="text-main hover:text-main_dark transition-colors text-2xl cursor-pointer"
                      onClick={() => {
                        setModoEdicion(false)
                        setTextoEditado('')
                        setIdComentarioAEditar(null)
                      }}
                    />
                    <FaSave
                      onClick={() => {
                        editarComentario(comentario.id, textoEditado)
                        setModoEdicion(false)
                        setTextoEditado('')
                        setIdComentarioAEditar(null)
                      }}
                      className="text-main hover:text-main_dark transition-colors text-2xl cursor-pointer"
                    />
                  </div>
                </span>
                  ) : (
                    auth.id == comentario.idUser &&
                comentario.respuestas == 0 && (
                  <span
                    className="absolute top-2 right-2"
                    onClick={() => {
                      setModoEdicion(true)
                      setTextoEditado(comentario.texto)
                      setIdComentarioAEditar(comentario.id)
                    }}
                  >
                    <MdOutlineEdit className="text-main text-2xl hover:text-main_dark transition-colors cursor-pointer" />
                  </span>
                    )
                  )}

              <div className="flex flex-col gap-4">
                <div className="flex gap-4 items-center">
                  <div>
                    <img
                      src={defaultPerfil}
                      alt=""
                      className="w-14 h-14 border border-gray-100 object-contain rounded-full"
                    />
                  </div>
                  <div className="flex flex-col gap-0">
                    <span className="text-lg font-medium text-black/80">
                      {comentario.user}
                    </span>
                    <span className="text-gray-600 ">
                      {comentario.fecha} - {comentario.hora}
                    </span>
                  </div>
                </div>
                <div className="px-4">
                  {modoEdicion && idComentarioAEditar === comentario.id ? (
                    <textarea
                      value={textoEditado}
                      onChange={(e) => {
                        setTextoEditado(e.target.value)
                      }}
                      className="text-lg text-black/70 rounded-md outline-none break-words w-full"
                    />
                  ) : (
                    <p className="text-lg text-black/70 break-words">{comentario.texto}</p>
                  )}
                </div>
              </div>
              {comentario.respuestas?.length > 0 && (
                <div className="flex flex-col mt-2">
                  {comentario.respuestas.map(
                    (respuesta: comentariosValues, index: number) => (
                      <div
                        key={index}
                        className="flex flex-col gap-4 pl-14 relative py-4
                  after:absolute after:left-6 after:top-10 after:bottom-0 after:bg-main after:h-[2px] after:w-6
                  before:absolute before:left-6 before:top-0 before:bottom-0 before:bg-main before:h-full before:w-[2px]
                  "
                      >
                        <div className="flex gap-4 items-center">
                          <div>
                            <img
                              src={defaultPerfil}
                              alt=""
                              className="w-12 h-12 object-contain rounded-full"
                            />
                          </div>
                          <div className="flex flex-col gap-0 relative">
                            <span className="text-lg font-medium">
                              {respuesta.user}
                            </span>
                            <span className="text-gray-600 ">
                              {respuesta.fecha} {respuesta.hora}
                            </span>
                          </div>
                        </div>
                        <div className="px-4">
                          <p className="text-lg break-words">
                            {respuesta.texto}
                          </p>
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          ))
      ) : (
        <span className="block w-full text-center">No hay comentarios</span>
      )}
    </div>
  )
}
