import React, {
  useState,
  type Dispatch,
  type SetStateAction
} from 'react'
import useAuth from '../../../../hooks/useAuth'
import Swal from 'sweetalert2'
import { RiDeleteBin6Line } from 'react-icons/ri'
import {
  type arrayAsignacion,
  type RolsValues
} from '../../../shared/schemas/Interfaces'

interface valuesLista {
  arrayPesos: arrayAsignacion[]
  setarrayPesos: Dispatch<SetStateAction<arrayAsignacion[]>>
  usuarios: never[]
}

interface valueUsuarios {
  id: number
  id_rol: number
  name: string
}

export const ListaColaboradores = ({
  arrayPesos,
  setarrayPesos,
  usuarios
}: valuesLista): JSX.Element => {
  const { roles } = useAuth()
  const [peso, setPeso] = useState('')
  const agregarArrayPesos = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault()
    if (peso) {
      setarrayPesos([...arrayPesos, { id: Date.now(), peso }])
      setPeso('')
    } else {
      Swal.fire('Complete todos los campos', '', 'error')
    }
  }

  const eliminarArray = (id: number | null): void => {
    const nuevoArray = arrayPesos.filter((peso) => peso.id !== id)
    setarrayPesos(nuevoArray)
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

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-10">
        <div className="w-full md:w-1/4">
          <p className="text-black font-bold text-xl">
            LISTA DE COLABORADORES<span className="text-red-500">*</span>
          </p>
        </div>
        <div className="flex-1 flex flex-col  md:flex-row items-center gap-4">
          <div className="w-full">
            <select
              className="w-full py-2 px-4 outline-none rounded-lg bg-secondary-100 text-white"
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
                    usuarios
                      .filter(
                        (usuario: valueUsuarios) =>
                          !arrayPesos.some(
                            (pesoObj: { peso: string }) =>
                              pesoObj.peso == String(usuario.id)
                          )
                      )
                      .map(
                        (user: { id: number, id_rol: number, name: string }) =>
                          (user.id_rol == role.id || user.id == 8 || user.id == 1) && (
                          <option value={String(user.id)} key={user.id}>
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

      <div className="bg-secondary-100 py-4 md:p-8 rounded-xl mb-10 w-full lg:w-1/2 mx-auto">
        <div className="hidden md:grid grid-cols-1 md:grid-cols-1 gap-4 mb-5 p-4 text-white">
          <h5 className="md:text-center font-bold text-2xl">Colaborador a cargo</h5>
        </div>
        {arrayPesos
          .filter((peso: arrayAsignacion) => peso.id != null)
          .map((pro: arrayAsignacion) => (
          <div
            className="mx-5 md:mx-0 grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-4 bg-secondary-900 p-4 rounded-xl text-white"
            key={pro.id}
          >
            <div className="md:text-center">
              <h5 className="md:hidden text-center text-white font-bold mb-2">
                Usuario
              </h5>
              <select
                    className="line-clamp-1 bg-secondary-900 border-none outline-none text-center w-full"
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
                              (user.id_rol == role.id || user.id == 8 || user.id == 1) && (
                                <option value={user.id} key={user.id}>
                                  {user.name}
                                </option>
                              )
                          )
                      )
                    )}
                  </select>
            </div>
            <div className="md:text-center flex flex-col items-center justify-center">
              <h5 className="md:hidden text-white text-center font-bold mb-2">
                Eliminar
              </h5>
              <RiDeleteBin6Line
                className="cursor-pointer text-center"
                onClick={() => {
                  eliminarArray(pro.id)
                }}
              />
            </div>
          </div>
          ))}
      </div>

    </>
  )
}
