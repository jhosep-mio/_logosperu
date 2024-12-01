import { IoTimeOutline } from 'react-icons/io5'
import { TbMessage2Check } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../../../../hooks/useAuth'

const ListadoNoti = ({
  tasks,
  allTareas,
  mas,
  setOpenModalShared
}: {
  tasks: any
  allTareas: any
  mas: any
  setMas: any
  setOpenModalShared: any
}): JSX.Element => {
  const navigate = useNavigate()
  const { setGestorCompartido } = useAuth()
  const filteredTasks = tasks?.map((task: any) => {
    const idTask = JSON.parse(task.task).idTablero
    const idContenido = JSON.parse(task.task).idTarjeta
    const namCreated = JSON.parse(task.task).authName
    const idCreated = JSON.parse(task.task).authId
    let tareasFiltradas: any = {}
    let contenidoPrincipal: any = {}
    let gestorTareas: any = []
    allTareas.forEach((objeto: any) => {
      if (objeto) {
        gestorTareas = JSON.parse(objeto.gestor_tareas)
        gestorTareas.forEach((tarea: any) => {
          if (tarea.id === idTask) {
            tarea?.contenido?.forEach((contenido: any) => {
              contenido?.contenido?.forEach((contenidoFinal: any) => {
                if (contenidoFinal.id == idContenido) {
                  tareasFiltradas = contenidoFinal
                  contenidoPrincipal = contenido
                }
              })
            })
          }
        })
      }
    })
    if (!tareasFiltradas?.contexto?.fecha) {
      return null // Si la tarea no pasa el filtro, devolver null para no incluirla en la lista final
    }
    const taskDeadline = new Date(tareasFiltradas?.contexto?.fecha)
    const currentDate = new Date()
    const timeDifference = taskDeadline.getTime() - currentDate.getTime()
    const hoursDifference = timeDifference / (1000 * 60 * 60)
    // Prepare notification message
    let notificationMessage = { estado: '', texto: '' }
    if (hoursDifference <= 0) {
      notificationMessage = {
        estado: 'vencio',
        texto: 'La tarea vencio'
      }
    } else if (hoursDifference <= 1) {
      notificationMessage = {
        estado: 'pendiente',
        texto: 'La tarea vence en menos de 1 hora.'
      }
    }
    const formattedDate = new Date(
      tareasFiltradas?.contexto?.fecha
    ).toLocaleString()

    // Aquí devuelves el JSX representando la tarea procesada y filtrada
    return (
      <div
        className="w-full block group relative cursor-pointer"
        key={task.id}
        onClick={() => {
          const result = {
            open: true,
            contenidoPrincipal,
            tareasFiltradas,
            gestorTareas,
            idCreated,
            idTask
          }
          setOpenModalShared(false)
          setGestorCompartido(JSON.stringify(result))
          navigate('/admin/gestor-tareas/compartidos')
        }}
      >
        <div className="flex flex-col w-full">
          <div className="bg-white group-hover:bg-[#e6e6e642] transition-colors w-full p-3 flex h-[130px] border_inner2 rounded-lg">
            <div className="w-[40px] h-1/2 flex gap-2">
              <span className="flex p-2 rounded-lg">
                <TbMessage2Check className="text-2xl text-main/80" />
              </span>
            </div>
            <div className="w-full h-full px-2 flex flex-col justify-between">
              <div>
                <h1 className="text-black font-bold line-clamp-1">
                  {tareasFiltradas.titulo}
                </h1>
                <div className="flex items-center gap-2 mt-0">
                  <IoTimeOutline /> {formattedDate}
                </div>
                {notificationMessage.estado == 'pendiente'
                  ? (
                  <span className="text-orange-400 ml-0 text-xs">
                    {notificationMessage.texto}
                  </span>
                    )
                  : (
                  <span className="text-red-500 ml-0 text-xs">
                    {notificationMessage.texto}
                  </span>
                    )}
              </div>
              <span className="text-gray-600 text-sm mt-1 line-clamp-2">
                Creado por {namCreated}
              </span>
            </div>
          </div>
        </div>
      </div>
    )
  })
  const filteredTasksWithoutNulls = filteredTasks
    .reverse()
    .filter((task: any) => task !== null)
  const firstFifteenTasks = filteredTasksWithoutNulls.slice(0, mas)

  return <>{firstFifteenTasks}</>
}

export default ListadoNoti
