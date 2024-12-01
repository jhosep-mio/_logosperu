import { IoTimeOutline } from 'react-icons/io5'
import { TbMessage2Check } from 'react-icons/tb'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../../../../hooks/useAuth'

const ListadoNoti = ({
  tasks,
  mas,
  setOpenModalShared,
  colaboradores
}: {
  tasks: any
  mas: any
  setMas: any
  setOpenModalShared: any
  colaboradores: any
}): JSX.Element => {
  const navigate = useNavigate()

  const { setGestorCompartido } = useAuth()

  const extraerNonbreUsuario = (id: any): string => {
    const result = colaboradores.find((item: any) => item.id == id)
    return result?.name ?? ''
  }

  const filteredTasks = tasks
    ?.filter((task: any) => task.fecha != null)
    .map((task: any) => {
      const taskDeadline = new Date(JSON.parse(task?.fecha))
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
      const formattedDate = new Date(JSON.parse(task?.fecha)).toLocaleString()

      // Aquí devuelves el JSX representando la tarea procesada y filtrada
      return (
        <div
          className="w-full block group relative cursor-pointer"
          key={task.id}
          onClick={() => {
            const result = {
              open: true,
              contenido: null,
              contexto: task
            }
            setOpenModalShared(false)
            setGestorCompartido(JSON.stringify(result))
            if (window.location.pathname !== '/admin/gestor-tareas/compartidos') {
              navigate('/admin/gestor-tareas/compartidos', {
                state: { update: Date.now() } // Pasar un estado que cambie
              })
            }
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
                  <h1 className="text-black font-bold line-clamp-1">{task.titulo}</h1>
                  <div className="flex items-center gap-2 mt-0">
                    <IoTimeOutline /> {formattedDate}
                  </div>
                  {notificationMessage.estado == 'pendiente'
                    ? (
                    <span className="text-orange-400 ml-0 text-xs">{notificationMessage.texto}</span>
                      )
                    : (
                    <span className="text-red-500 ml-0 text-xs">{notificationMessage.texto}</span>
                      )}
                </div>
                <span className="text-gray-600 text-sm mt-1 line-clamp-2">Creado por {extraerNonbreUsuario(task.id_user)}</span>
              </div>
            </div>
          </div>
        </div>
      )
    })
  const filteredTasksWithoutNulls = filteredTasks.reverse().filter((task: any) => task !== null)
  const firstFifteenTasks = filteredTasksWithoutNulls.slice(0, mas)

  return <>{firstFifteenTasks}</>
}

export default ListadoNoti
