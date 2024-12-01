/* eslint-disable @typescript-eslint/restrict-template-expressions */
import { useState } from 'react'
import { RiFilter2Fill } from 'react-icons/ri'
import { Paginacion } from '../../../../shared/Paginacion'
import { quitarAcentos } from '../../../../shared/functions/QuitarAcerntos'
import { AiFillDelete } from 'react-icons/ai'
import { IoEyeSharp } from 'react-icons/io5'

export const ListaVacaciones = ({
  vacaciones,
  permisos,
  updateVacaciones,
  updatePermisos,
  setOpen,
  recuperacion,
  updateRecuperacion
}: {
  vacaciones: any
  permisos: any
  updateVacaciones: (updatedEvents: Event[]) => Promise<void>
  updatePermisos: (updatedEvents: Event[]) => Promise<void>
  setOpen: any
  recuperacion: any
  updateRecuperacion: (updatedEvents: Event[]) => Promise<void>
}): JSX.Element => {
  const [paginaActual, setpaginaActual] = useState<number>(1)
  const [search, setSearch] = useState('')
  const [cantidadRegistros] = useState(14)
  const indexOfLastPost = paginaActual * cantidadRegistros
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros
  let totalPosts = vacaciones.length

  const filterDate = (): any => {
    let filteredItems: any
    let combinedList: any[] = []
    // Concatenar los arrays festivos y permisos
    combinedList = vacaciones.concat(permisos)
    if (search.length === 0) {
      filteredItems = combinedList.slice(indexOfFirstPost, indexOfLastPost)
    } else {
      const searchTerm = quitarAcentos(search.toLowerCase())
      const filter = combinedList.filter((pro: any) => {
        const fullName = `${pro.title}`.toLowerCase()
        return quitarAcentos(fullName).includes(searchTerm)
      })

      totalPosts = filter.length
      filteredItems = filter.slice(indexOfFirstPost, indexOfLastPost)
    }
    return filteredItems.reverse()
  }

  const onSeachChange = ({
    target
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setpaginaActual(1)
    setSearch(target.value)
  }

  function formatearFecha (fechaIso: string): string {
    // Convertir la fecha ISO a un objeto Date
    const fecha = new Date(fechaIso)

    // Obtener los componentes de la fecha (día, mes, año)
    const dia = fecha.getDate().toString().padStart(2, '0') // PadStart para asegurar que tenga 2 dígitos
    const mes = (fecha.getMonth() + 1).toString().padStart(2, '0') // Sumar 1 porque los meses son indexados desde 0
    const año = fecha.getFullYear()

    // Formatear la fecha en el formato deseado "dd-mm-yyyy"
    const fechaFormateada = `${dia}-${mes}-${año}`

    return fechaFormateada
  }

  const eliminarVacaciones = (id: string): void => {
    const updatedEvents = vacaciones.filter((evento: any) => evento.id != id)
    updateVacaciones(updatedEvents)
  }

  //   const handleEditarVacaciones = (id: string): void => {
  //     const nuevoTitulo = prompt('Ingrese el nuevo título:')
  //     if (nuevoTitulo) {
  //       const updatedEvents = vacaciones.map((evento: any) =>
  //         evento.id == id ? { ...evento, title: nuevoTitulo } : evento
  //       )
  //       updateVacaciones(updatedEvents)
  //     }
  //   }

  const eliminarPermisos = (id: string): void => {
    const updatedEvents = permisos.filter((evento: any) => evento.id != id)
    const updatedEventsRecu = recuperacion.filter((evento: any) => evento.idEvent != id)
    updatePermisos(updatedEvents)
    updateRecuperacion(updatedEventsRecu)
  }
  //   const handleEditarPermisos = (id: string): void => {
  //     const nuevoTitulo = prompt('Ingrese el nuevo título:')
  //     if (nuevoTitulo) {
  //       const updatedEvents = permisos.map((evento: any) =>
  //         evento.id == id ? { ...evento, title: nuevoTitulo } : evento
  //       )
  //       updatePermisos(updatedEvents)
  //     }
  //   }

  return (
    <div className="w-full  p-0 flex flex-col gap-6 relative">
      <div className="w-full h-full ">
        <div className="w-full flex mb-3 justify-between">
          <div className="flex gap-3 w-full mx-2">
            <div className="w-full flex gap-2 items-center h-fit">
              <button className="bg-white hover:bg-gray-100 w-full md:w-full flex items-center text-black gap-2 py-2 px-4 rounded-lg hover:text-main transition-colors">
                <RiFilter2Fill />
                <input
                  placeholder="Buscar por nombre"
                  className="bg-transparent outline-none w-full"
                  value={search}
                  onChange={onSeachChange}
                  type="search"
                />
              </button>
            </div>
          </div>
        </div>

        <div className="bg-[#fff] p-8 rounded-xl mt-3">
          <h2 className="mt-2 w-full text-center uppercase mb-8 text-main font-bold text-2xl">
            Vacaciones / Permisos
          </h2>

          <div className="flex flex-row border-y border-gray-300 md:flex-col md:border-none">
            <div className="w-1/2 md:w-full grid grid-cols-1 md:grid-cols-8 gap-3 mb-2 md:px-4 md:py-2 text-gray-400 border-none md:border-y border-gray-300">
              <h5 className="md:text-left text-gray-700 font-medium line-clamp-1">
                ID
              </h5>
              <h5 className="md:text-left text-gray-700 font-medium line-clamp-1 col-span-2">
                Nombre
              </h5>
              <h5 className="md:text-left text-gray-700 font-medium line-clamp-1 col-span-2">
                F. Inicio
              </h5>
              <h5 className="md:text-left text-gray-700 font-medium line-clamp-1 col-span-2">
                F. Fin
              </h5>
              <h5 className="md:text-center line-clamp-1"></h5>
            </div>
            {filterDate().map((orden: any, index: number) => (
              <>
                <div
                  className={`w-1/2 md:w-full grid grid-cols-1 md:grid-cols-8 relative gap-3 items-center mb-3 md:mb-0 ${
                    index % 2 == 0 ? 'bg-transparent' : 'bg-gray-200'
                  } md:px-4 md:py-1 rounded-xl relative shadow_class`}
                  key={index + 1}
                >
                  {/* PC */}
                  <div className=" md:block md:text-center">
                    <span className="text-left block text-black w-full line-clamp-1">
                      #{index + 1}
                    </span>
                  </div>
                  <div className=" md:block md:text-center col-span-2">
                    <div className="line-clamp-1">
                      <span className="text-left block text-black w-full lowercase first-letter:uppercase ">
                        {orden.title}
                      </span>
                    </div>
                  </div>
                  <div className=" md:block md:text-center  col-span-2">
                    <span className="text-left block text-black w-full line-clamp-1">
                      {formatearFecha(orden?.start)}
                    </span>
                  </div>
                  <div className=" md:block md:text-center  col-span-2">
                    <span className="text-left block text-black w-full line-clamp-1">
                      {formatearFecha(orden?.end)}
                    </span>
                  </div>
                  <div className=" flex gap-3 md:text-center ">
                    <IoEyeSharp
                      className="text-green-600 hover:text-green-800 text-lg transition-colors cursor-pointer"
                      onClick={() => {
                        setOpen({
                          estado: true,
                          titulo: orden?.title,
                          description: orden?.detalle
                        })
                      }}
                    />
                    {orden.modalidad === 'Vacaciones'
                      ? (
                      <>
                        {/* <AiFillEdit
                          className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                          onClick={() => {
                            handleEditarVacaciones(orden.id)
                          }}
                        /> */}
                        <AiFillDelete
                          className="text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                          onClick={() => {
                            eliminarVacaciones(orden.id)
                          }}
                        />
                      </>
                        )
                      : (
                      <>
                        {/* <AiFillEdit
                          className="text-blue-600 hover:text-blue-800 transition-colors cursor-pointer"
                          onClick={() => {
                            handleEditarPermisos(orden.id)
                          }}
                        /> */}
                        <AiFillDelete
                          className="text-red-600 hover:text-red-800 transition-colors cursor-pointer"
                          onClick={() => {
                            eliminarPermisos(orden.id)
                          }}
                        />
                      </>
                        )}
                  </div>
                </div>
                {recuperacion.filter((recu: any) => recu.idEvent == orden.id).map((recu: any, index2: number) => (
                  <div
                    className={'grid grid-cols-1 md:grid-cols-8 mt-0  gap-3 items-center mb-3 md:px-4 bg-green-200 rounded-xl relative shadow_class'}
                    key={index2 + 1}
                  >
                    {/* PC */}
                    <div className="hidden md:block md:text-center">

                    </div>
                    <div className="hidden md:block md:text-center col-span-2">
                      <div className="line-clamp-1">
                        <span className="text-left block text-black w-full lowercase first-letter:uppercase ">
                          {recu.title}
                        </span>
                      </div>
                    </div>
                    <div className="hidden md:block md:text-center  col-span-2">
                      <span className="text-left block text-black w-full line-clamp-1">
                        {formatearFecha(recu?.start)}
                      </span>
                    </div>
                    <div className="hidden md:block md:text-center  col-span-2">
                      <span className="text-left block text-black w-full line-clamp-1">
                        {formatearFecha(recu?.end)}
                      </span>
                    </div>
                  </div>
                ))}
              </>
            ))}

          </div>
          <div className="flex flex-col md:flex-row gap-5 md:gap-0 justify-center md:justify-between content_buttons pt-3 mt-5">
            <p className="text-md ml-1 text-black">{totalPosts} Registros</p>
            <Paginacion
              totalPosts={totalPosts}
              cantidadRegistros={cantidadRegistros}
              paginaActual={paginaActual}
              setpaginaActual={setpaginaActual}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
