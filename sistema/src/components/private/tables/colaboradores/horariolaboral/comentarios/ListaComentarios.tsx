/* eslint-disable multiline-ternary */
import { useState, type Dispatch, type SetStateAction } from 'react'
import { FaSave } from 'react-icons/fa'
import { MdOutlineEdit } from 'react-icons/md'
import { IoCloseSharp } from 'react-icons/io5'
import { toast } from 'sonner'
import useAuth from '../../../../../../hooks/useAuth'
import { type comentariosValues } from '../../../../../shared/schemas/Interfaces'
import { defaultPerfil } from '../../../../../shared/Images'
import { Dialog, DialogContent } from '@mui/material'
import { CrearComentario } from './CrearComentario'
import { Loading } from '../../../../../shared/Loading'
import axios from 'axios'
import { Global } from '../../../../../../helper/Global'
import { useParams } from 'react-router-dom'

export const ListaComentarios = ({
  loading,
  comentarios,
  setComentarios,
  openLista,
  setOpenLista,
  guardarComentarios,
  getComentarios,
  setLoading,
  open
}: {
  loading: boolean
  openLista: boolean
  comentarios: comentariosValues[]
  setComentarios: Dispatch<SetStateAction<comentariosValues[]>>
  setOpenLista: Dispatch<SetStateAction<boolean>>
  setIdComentario: Dispatch<SetStateAction<string | null>>
  setTexto: Dispatch<SetStateAction<string | null>>
  guardarComentarios: any
  getComentarios: any
  setLoading: any
  open: any
}): JSX.Element => {
  const token = localStorage.getItem('token')
  const [textoEditado, setTextoEditado] = useState('')
  const { auth } = useAuth()
  const [idComentarioAEditar, setIdComentarioAEditar] = useState<number | null>(
    null
  )
  const { id } = useParams()
  const [modoEdicion, setModoEdicion] = useState(false)
  const handleEditarComentario = async (): Promise<void> => {
    if (textoEditado && textoEditado.length > 0) {
      setLoading(true)
      const comentarioEditado = comentarios.find(
        (comentario) => comentario.id === idComentarioAEditar
      )
      if (comentarioEditado) {
        const comentarioActualizado = {
          id: comentarioEditado.id,
          texto: textoEditado,
          fecha: comentarioEditado.fecha,
          hora: comentarioEditado.hora,
          user: comentarioEditado.user,
          idUser: comentarioEditado.idUser,
          respuestas: comentarioEditado.respuestas
        }
        const data = new FormData()
        data.append('id_user', id ?? auth.id)
        data.append('id_horario', open.evento.event.id)
        data.append('comentarios', JSON.stringify(comentarioActualizado))
        try {
          const respuesta = await axios.post(
              `${Global.url}/actualizarComentariosHorario`,
              data,
              {
                headers: {
                  Authorization: `Bearer ${
                  token !== null && token !== '' ? token : ''
                  }`
                }
              }
          )
          if (respuesta.data.status == 'success') {
            toast.success('Comentario actualizado')
            getComentarios()
            setModoEdicion(false)
            setTextoEditado('')
            setIdComentarioAEditar(null)
          }
        } catch (error) {
          console.log(error)
        } finally {
          setLoading(false)
        }
      } else {
        toast.error('No se encontró el comentario a editar')
      }
    } else {
      toast.warning('Ingrese su comentario')
    }
  }

  const comentariosOriginales = [...comentarios]

  return (
    <Dialog
      open={openLista}
      onClose={() => { setOpenLista(!openLista) } }
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent className='w-[600px] relative min-h-[300px]'>
        <CrearComentario guardarComentarios={guardarComentarios} setComentarios={setComentarios}/>
        {!loading
          ? <div className="w-full bg-white p-4 rounded-xl h-auto  overflow-y-auto">
          <h3 className="uppercase text-secondary-70 text-xl w-full border-b-2 font-bold text-center pb-2 border-secondary-70 mb-6">
            Comentarios
            <span className="text-secondary-10">({comentarios.length})</span>
          </h3>
          {comentarios.length > 0 ? (
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
                    <span
                      className="absolute top-2 right-2"
                    >
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
                          handleEditarComentario()
                        }}
                        className="text-main hover:text-main_dark transition-colors text-2xl cursor-pointer" />
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
                        <span className="text-lg font-medium">
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
                          className="text-lg rounded-md outline-none break-words w-full"
                        />
                      ) : (
                        <p className="text-lg break-words">
                          {comentario.texto}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              ))
          ) : (
            <span className="block w-full text-center">No hay comentarios</span>
          )}
        </div>
          : <Loading/>}
      </DialogContent>
    </Dialog>
  )
}
