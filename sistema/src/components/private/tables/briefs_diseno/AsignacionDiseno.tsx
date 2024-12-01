import React, { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import Swal from 'sweetalert2'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { Loading } from '../../../shared/Loading'
import {
  type arrayAsignacion,
  type RolsValues
} from '../../../shared/schemas/Interfaces'

export const AsignacionDiseño = (): JSX.Element => {
  const { id } = useParams()
  const navigate = useNavigate()
  const token = localStorage.getItem('token')
  const { setTitle, roles } = useAuth()
  const [loading, setLoading] = useState(true)

  const [peso, setPeso] = useState('')
  const [usuarios, setUsuarios] = useState([])
  const [arrayPesos, setarrayPesos] = useState<arrayAsignacion[]>([
    { id: null, peso: '' }
  ])

  const agregarArrayPesos = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault()
    if (peso) {
      setarrayPesos([...arrayPesos, { id: Date.now(), peso }])
      setPeso('')
    } else {
      Swal.fire('Complete todos los campos', '', 'error')
    }
  }

  const getOneRol = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/oneBriefDiseño/${id ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      }
    )
    if (request.data.asignacion) {
      setarrayPesos(JSON.parse(request.data.asignacion))
    } else {
      // Asignar un valor predeterminado en caso de JSON vacío
      setarrayPesos([])
    }
  }

  const getUsuarios = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/getUsuarios`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setUsuarios(request.data)
  }

  const eliminarArray = (id: number | null): void => {
    const nuevoArray = arrayPesos.filter((peso) => peso.id !== id)
    setarrayPesos(nuevoArray)
  }

  const updateRol = async (): Promise<void> => {
    setLoading(true)
    const data = new FormData()

    data.append('asignacion', JSON.stringify(arrayPesos))
    data.append('_method', 'PUT')
    try {
      const respuesta = await axios.post(
        `${Global.url}/asignacionDiseño/${id ?? ''}`,
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
        Swal.fire('Actualizado correctamente', '', 'success')
        navigate('/admin/lista-briefs-diseños')
      } else {
        Swal.fire('Error al actualizar', '', 'error')
      }
    } catch (error: unknown) {
      Swal.fire('Error', '', 'error')
    }
    setLoading(false)
  }

  const handleInputChange = (
    e: React.ChangeEvent<HTMLSelectElement>,
    id: number | null,
    fieldName: string
  ): void => {
    let value = e.target.value
    if (fieldName == 'estado') {
      value = String(parseInt(value, 10)) // Convertir el valor a una cadena
    }

    const updatedArray = arrayPesos.map((pro: arrayAsignacion) => {
      if (pro.id == id) {
        return { ...pro, [fieldName]: value }
      }
      return pro
    })
    setarrayPesos(updatedArray)
  }

  useEffect(() => {
    setTitle('Asignacion de diseñadores')
    Promise.all([
      getUsuarios(),
      getOneRol()
    ]).then(() => {
      setLoading(false)
    })
  }, [])

  return (
    <>
      {loading
        ? (
        <Loading />
          )
        : (
        <form
          className="bg-white p-8 rounded-xl mt-5"
          onSubmit={() => { void updateRol() }}
        >
          <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-10">
            <div className="w-full md:w-1/4">
              <p className="text-black">
                USUARIOS<span className="text-red-500">*</span>
              </p>
            </div>
            <div className="flex-1 flex flex-col  md:flex-row items-center gap-4">
              <div className="w-full">
                <select
                  className="w-full py-2 px-4 outline-none rounded-lg bg-main_2-250 text-black"
                  value={peso}
                  onChange={(e) => {
                    setPeso(e.target.value)
                  }}
                >
                  <option value="">Seleccionar</option>
                  {roles.map((role: RolsValues) =>
                    JSON.parse(role.accesos).map(
                      (route: { peso: string }) =>
                        route.peso !== 'superusuario' &&
                        usuarios.map(
                          (user: {
                            id: number
                            id_rol: number
                            name: string
                          }) =>
                            user.id_rol == role.id && (
                              <option value={user.id} key={user.id}>
                                {user.name}
                              </option>
                            )
                        )
                    )
                  )}
                </select>
              </div>
              <div className="w-full  md:w-52">
                <button
                  className="w-full bg-main text-white hover:bg-primary justify-center flex items-center gap-2 py-2 px-4 rounded-lg transition-colors"
                  onClick={agregarArrayPesos}
                >
                  Agregar
                </button>
              </div>
            </div>
          </div>

          <div className="bg-main_2-250 py-4 md:p-8 rounded-xl mb-10">
            <div className="hidden md:grid grid-cols-1 md:grid-cols-2 gap-4 mb-5 p-4 text-black">
              <h5 className="md:text-center">Usuarios</h5>
              <h5 className="md:text-center">Eliminar</h5>
            </div>
            {arrayPesos.map((pro: arrayAsignacion) => (
              <div
                className="mx-5 md:mx-0 grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-4 bg-white p-4 rounded-xl text-black"
                key={pro.id}
              >
                <div className="md:text-center">
                  <h5 className="md:hidden text-white font-bold mb-2">
                    Usuarios
                  </h5>
                  <select
                    className="line-clamp-1 bg-transparent border-none outline-none text-center w-full"
                    value={pro.peso}
                    onChange={(e) => {
                      handleInputChange(e, pro.id, 'peso')
                    }}
                  >
                    {roles.map((role) =>
                      JSON.parse(role.accesos).map(
                        (route: { peso: string }) =>
                          route.peso !== 'superusuario' &&
                          usuarios.map(
                            (user: {
                              id: number
                              id_rol: number
                              name: string
                            }) =>
                              user.id_rol == role.id && (
                                <option value={user.id} key={user.id}>
                                  {user.name}
                                </option>
                              )
                          )
                      )
                    )}
                  </select>
                </div>
                <div className="md:text-center md:flex md:justify-center">
                  <h5 className="md:hidden text-white font-bold mb-2">
                    Eliminar
                  </h5>
                  <RiDeleteBin6Line
                    className="cursor-pointer"
                    onClick={() => {
                      eliminarArray(pro.id)
                    }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex gap-2 w-full justify-end">
            <input type="hidden" name="oculto" value="1" />
            <Link
              to="/admin/lista-briefs-diseños"
              className="bg-red-500 px-4 py-2 rounded-md text-white"
            >
              Cancelar
            </Link>
            <input
              type="submit"
              className="bg-main_2-200 text-white hover:bg-primary flex items-center gap-2 py-2 px-4 rounded-lg transition-colors cursor-pointer"
              value="Grabar"
            />
          </div>
        </form>
          )}
    </>
  )
}
