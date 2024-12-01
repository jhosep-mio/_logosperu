/* eslint-disable @typescript-eslint/ban-ts-comment */
import { TbMessage2Check } from 'react-icons/tb'
import { cn } from '../../../../../shared/cn'
import { Pagination, Navigation } from 'swiper/modules'
import { Swiper, SwiperSlide } from 'swiper/react'
// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
const ListadoCompartidos = ({
  tasks,
  allTareas,
  mas,
  setOpen,
  setContenidoSeleccionado,
  setEvents,
  setIdCompartido,
  setIdTable,
  calcularPorcentaje,
  TaskComponent,
  showCompleted
}: {
  tasks: any
  allTareas: any
  mas: any
  setMas: any
  setOpen: any
  setContenidoSeleccionado: any
  setEvents: any
  setIdCompartido: any
  setIdTable: any
  calcularPorcentaje: any
  TaskComponent: any
  setShowCompleted: any
  showCompleted: any
}): JSX.Element => {
  const filteredTasks = tasks?.map((task: any) => {
    const idTask = JSON.parse(task.task).idTablero
    const idContenido = JSON.parse(task.task).idTarjeta
    const namCreated = JSON.parse(task.task).authName
    const idCreated = JSON.parse(task.task).authId
    let tareasFiltradas: any = {}
    let contenidoPrincipal: any = {}
    let gestorTareas: any = []
    let porcentaje: string | null = null
    allTareas.forEach((objeto: any) => {
      if (objeto) {
        JSON.parse(objeto.gestor_tareas).forEach((tarea: any) => {
          if (tarea.id === idTask) {
            tarea?.contenido?.forEach((contenido: any) => {
              contenido?.contenido?.forEach((contenidoFinal: any) => {
                if (contenidoFinal.id == idContenido) {
                  gestorTareas = JSON.parse(objeto.gestor_tareas)
                  contenidoPrincipal = contenido
                  porcentaje =
                    (contenidoFinal?.contexto?.checklist).length > 0
                      ? calcularPorcentaje(contenidoFinal?.contexto?.checklist)
                      : null
                  tareasFiltradas = contenidoFinal
                }
              })
            })
          }
        })
      }
    })
    return {
      taskComponent: (
        <div
          className="w-full block group relative cursor-pointer"
          key={task.id}
          onClick={() => {
            setOpen(true)
            setContenidoSeleccionado({
              contexto: contenidoPrincipal,
              contenido: tareasFiltradas
            })
            setEvents(gestorTareas)
            setIdCompartido(idCreated)
            setIdTable(idTask)
          }}
        >
          <div className="flex flex-col w-full">
            <div className="bg-white group-hover:bg-[#e6e6e642] transition-colors w-full p-3 flex h-[110px] border_inner2 rounded-lg">
              <div className="w-[40px] h-1/2 flex gap-2">
                <span className="flex p-2 rounded-lg">
                  <TbMessage2Check className="text-2xl text-main/80" />
                </span>
              </div>
              <div className="w-full h-full px-2 flex flex-col justify-between">
                <div className="relative">
                  {porcentaje != null && (
                    <span
                      className={cn(
                        'absolute top-0 right-0 text-white font-medium w-5 h-5 rounded-full flex items-center justify-center',
                        porcentaje == '100'
                          ? 'bg-green-500'
                          : porcentaje > 50
                            ? 'bg-yellow-500'
                            : 'bg-red-500'
                      )}
                    ></span>
                  )}
                  <h1 className="text-black font-bold line-clamp-1">
                    {tareasFiltradas.titulo}
                  </h1>
                  {TaskComponent(task.created_at)}
                </div>
                <span className="text-gray-600 text-sm mt-1 line-clamp-2">
                  Compartido por {namCreated}
                </span>
              </div>
            </div>
          </div>
        </div>
      ),
      namCreated,
      porcentaje
    }
  })

  const filteredTasksWithoutNulls = filteredTasks.reverse().filter((task: any) => task !== null)
  const firstFifteenTasks = filteredTasksWithoutNulls.slice(0, mas)

  // Filtramos las tareas según el estado del filtro
  const tasksToShow = showCompleted
    ? firstFifteenTasks // Mostrar todas las tareas
    : firstFifteenTasks.filter((task: any) => task.porcentaje !== '100') // Mostrar solo las tareas con porcentaje menor al 100%

  // Agrupa las tareas por `namCreated`
  const groupedTasks = tasksToShow.reduce((acc: any, { taskComponent, namCreated }: any) => {
    if (!acc[namCreated]) {
      acc[namCreated] = []
    }
    acc[namCreated].push(taskComponent)
    return acc
  }, {})

  // Ordena los grupos por el número de elementos en cada grupo, de mayor a menor
  const sortedGroupedTasks = Object.entries(groupedTasks).sort(
    ([, tasksA]: [string, any], [, tasksB]: [string, any]) => tasksB.length - tasksA.length
  )

  // Divide las tareas en columnas
  // Divide las tareas en columnas
  const columns = sortedGroupedTasks.map(([key, tasks]: any) => (
    <SwiperSlide key={key} className="flex flex-col gap-y-2 w-full">
      <h2 className='w-full text-center font-bold text-gray-600'>{key}</h2>
      {tasks}
    </SwiperSlide>
  ))

  return (
    <section className="w-full">
      <Swiper
        pagination={{
          type: 'progressbar'
        }}
        navigation={{
          nextEl: '.swiper-button-next3',
          prevEl: '.swiper-button-prev3'
        }}
        slidesPerView={4}
        spaceBetween={20}
        breakpoints={{
          0: {
            slidesPerView: 1,
            spaceBetween: 20
          },
          640: {
            slidesPerView: 2,
            spaceBetween: 20
          },
          768: {
            slidesPerView: 2,
            spaceBetween: 30
          },
          1024: {
            slidesPerView: 4,
            spaceBetween: 30
          }
        }}
        modules={[Pagination, Navigation]}
        className="mySwiper w-full swiper_gestortareas"
      >
        {columns}
      </Swiper>
    </section>

  )
}

export default ListadoCompartidos
