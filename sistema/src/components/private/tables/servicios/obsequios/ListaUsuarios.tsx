import { RiDeleteBin6Line } from 'react-icons/ri'
import { type Dispatch, type SetStateAction, useState } from 'react'
import { IoAddCircle, IoCloseCircle } from 'react-icons/io5'
import { type arrayCorreos, type arrayAsignacion } from '../../../../shared/schemas/Interfaces'
import useAuth from '../../../../../hooks/useAuth'
import { v4 as uuidv4 } from 'uuid'

interface valuesInterface {
  arrayPesos: arrayAsignacion[]
  usuarios: never[]
  setarrayPesos: Dispatch<SetStateAction<arrayAsignacion[]>>
  setCorreos: Dispatch<SetStateAction<arrayCorreos[]>>
  correos: arrayCorreos[]
}

interface valueUsuarios {
  id: number
  id_rol: number
  name: string
  email: string
  genero: string
}

export const ListaUsuarios = ({
  arrayPesos,
  usuarios,
  setarrayPesos,
  setCorreos,
  correos
}: valuesInterface): JSX.Element => {
  const [agregar, setAgregar] = useState(false)
  const { roles } = useAuth()

  const agregarCorreo = (correo: string): void => {
    setCorreos([...correos, { id: uuidv4(), correo }])
  }

  const eliminarArray = (id: number | null): void => {
    // Obtener el usuario que se va a eliminar
    const usuarioEliminado = arrayPesos.find((peso) => peso.id === id)
    if (!usuarioEliminado) return // Salir si no se encuentra el usuario
    // Filtrar el array de pesos para eliminar el usuario
    const nuevoArrayPesos = arrayPesos.filter((peso) => peso.id !== id)
    setarrayPesos(nuevoArrayPesos)
    // Filtrar el array de correos para eliminar solo el correo asociado al usuario eliminado
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-expect-error
    const correosActualizados = correos.filter((correo) => correo.correo !== usuarioEliminado.email)
    setCorreos(correosActualizados)
  }

  const agregarArrayPesos = (peso: any, nombre: string, email: string, genero: string): void => {
    if (peso) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      setarrayPesos([...arrayPesos, { id: Date.now(), peso, nombre, email, genero }])
      agregarCorreo(email)
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
    <div className="bg-secondary-100 py-0 rounded-xl mb-4 mt-0 w-full">
      {!agregar
        ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-1 gap-4 py-2 text-black relative">
            <h5 className="text-center font-bold text-base md:text-xl text-white">
              Colaboradores
            </h5>
            <h5
              className="text-main absolute top-2 right-1 text-3xl cursor-pointer"
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
                className="mx-5 md:mx-0 grid grid-cols-2 gap-2 md:gap-4 items-center mb-4 bg-transparent py-1 rounded-xl text-white"
                key={pro.id}
              >
                <div className="md:text-center">
                  <h5 className="md:hidden text-center text-white font-bold mb-2">
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
                                <option value={String(user.id)} key={user.id} className='text-black'>
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
          <section className='bg-transparent rounded-xl'>
            {usuarios
              .filter(
                (usuario: valueUsuarios) =>
                  usuario.id != 1 &&
                  !arrayPesos.some(
                    (pesoObj: { peso: string }) =>
                      pesoObj.peso == String(usuario.id)
                  ) &&
                  usuario.id_rol != 99
              )
              .map((usuario: valueUsuarios, index: number) => (
                <p
                  key={index}
                  className="text-white text-center block w-full cursor-pointer py-2 hover:text-main transition-colors"
                  onClick={() => {
                    agregarArrayPesos(String(usuario.id), usuario.name, usuario.email, usuario.genero)
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
