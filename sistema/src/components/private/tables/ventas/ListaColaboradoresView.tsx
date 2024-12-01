import useAuth from '../../../../hooks/useAuth'
import {
  type arrayAsignacion
} from '../../../shared/schemas/Interfaces'

interface valuesLista {
  arrayPesos: arrayAsignacion[]
  usuarios: never[]
}

export const ListaColaboradoresView = ({
  arrayPesos,
  usuarios
}: valuesLista): JSX.Element => {
  const { roles } = useAuth()

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-center gap-y-2 mb-10">
        <div className="w-full md:w-1/4">
          <p className="text-black font-bold text-xl">
            LISTA DE COLABORADORES<span className="text-red-500">*</span>
          </p>
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
            className="mx-5 md:mx-0 grid grid-cols-1 md:grid-cols-2 gap-4 items-center lg:mb-4 bg-secondary-900 p-4 rounded-xl text-white"
            key={pro.id}
          >
            <div className="md:text-center">
              <h5 className="md:hidden text-center text-white font-bold mb-2">
                Usuario
              </h5>
              <select
                    className="line-clamp-1 bg-secondary-900 border-none outline-none text-center w-full"
                    disabled
                    value={pro.peso}
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
          </div>
          ))}
      </div>

    </>
  )
}
