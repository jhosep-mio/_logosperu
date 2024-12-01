import { RiDeleteBin6Line } from 'react-icons/ri'
import { type arrayAsignacion } from '../../../shared/schemas/Interfaces'
import { type Dispatch, type SetStateAction, useState } from 'react'
import { IoAddCircle, IoCloseCircle } from 'react-icons/io5'
import useAuth from '../../../../hooks/useAuth'

interface valuesInterface {
  arrayPesos: arrayAsignacion[]
  usuarios: never[]
  setarrayPesos: Dispatch<SetStateAction<arrayAsignacion[]>>
}

interface valueUsuarios {
  id: number
  id_rol: number
  name: string
}

export const ListaUsuarios = ({
  arrayPesos,
  usuarios,
  setarrayPesos
}: valuesInterface): JSX.Element => {
  const [agregar, setAgregar] = useState(false)
  const { roles } = useAuth()

  const eliminarArray = (id: number | null): void => {
    const nuevoArray = arrayPesos.filter((peso) => peso.id !== id)
    setarrayPesos(nuevoArray)
  }

  const agregarArrayPesos = (peso: any): void => {
    if (peso) {
      setarrayPesos([...arrayPesos, { id: Date.now(), peso }])
    }
    setAgregar(false)
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
    <div className="bg-secondary-100 py-4 md:p-2 rounded-xl mb-4 mt-4">
      {!agregar
        ? (
        <>
          <div className="hidden md:grid grid-cols-1 md:grid-cols-1 gap-4 py-2 text-black relative">
            <h5 className="md:text-center font-bold text-xl text-white">
              Usuarios
            </h5>
            <h5
              className="text-main absolute top-1 right-1 text-4xl cursor-pointer"
              onClick={() => {
                setAgregar(true)
              }}
            >
              <IoAddCircle />
            </h5>
          </div>
          {arrayPesos
            .filter((peso: arrayAsignacion) => peso.id != null)
            .map((pro: arrayAsignacion) => (
              <div
                className="mx-5 md:mx-0 grid grid-cols-1 md:grid-cols-2 gap-4 items-center mb-4 bg-white p-4 rounded-xl text-black"
                key={pro.id}
              >
                <div className="md:text-center">
                  <h5 className="md:hidden text-center text-black font-bold mb-2">
                    Usuario
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
                                <option value={String(user.id)} key={user.id}>
                                  {user.name}
                                </option>
                              )
                          )
                      )
                    )}
                  </select>
                </div>
                <div className="md:text-center flex flex-col items-center justify-center">
                  <h5 className="md:hidden text-black text-center font-bold mb-2">
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
        </>
          )
        : (
        <>
          <div className="hidden md:grid grid-cols-1 md:grid-cols-1 gap-4 py-2 text-black relative">
            <h5 className="md:text-center font-bold text-xl text-white">
              Listado
            </h5>
            <h5
              className="text-main absolute top-1 right-1 text-4xl cursor-pointer"
              onClick={() => {
                setAgregar(false)
              }}
            >
              <IoCloseCircle />
            </h5>
          </div>
          <section className='bg-white rounded-xl'>
            {usuarios
              .filter(
                (usuario: valueUsuarios) =>
                  usuario.id !== 1 &&
                  !arrayPesos.some(
                    (pesoObj: { peso: string }) =>
                      pesoObj.peso == String(usuario.id)
                  )
              )
              .map((usuario: valueUsuarios, index: number) => (
                <p
                  key={index}
                  className="text-black text-center block w-full cursor-pointer py-2 hover:text-main transition-colors"
                  onClick={() => {
                    agregarArrayPesos(String(usuario.id))
                  }}
                >
                  {usuario.name}
                </p>
              ))}
          </section>
        </>
          )}
    </div>
  )
}
