/* eslint-disable @typescript-eslint/naming-convention */
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
  mas,
  setOpen,
  setContenidoSeleccionado,
  TaskComponent,
  showCompleted,
  colaboradores
}: {
  tasks: any
  mas: any
  setMas: any
  setOpen: any
  setContenidoSeleccionado: any
  TaskComponent: any
  setShowCompleted: any
  showCompleted: any
  colaboradores: any
}): JSX.Element => {
  const tasksToRender = tasks.filter((task: any) => task != null)
  const filteredTasksWithoutNulls = tasksToRender.slice(0, mas)
  const firstFifteenTasks = [...filteredTasksWithoutNulls].reverse()

  const calcularPorcentaje = (checklist: any): string => {
    if (checklist) {
      const countChecked = JSON.parse(checklist).filter((item: any) => item.check).length
      return ((countChecked / JSON.parse(checklist).length) * 100).toFixed(0)
    } else {
      return 'none'
    }
  }

  const extraerNonbreUsuario = (id: any): string => {
    const result = colaboradores.find((item: any) => item.id == id)
    return result.name
  }

  // Filtramos las tareas según el estado del filtro
  const tasksToShow = showCompleted
    ? firstFifteenTasks // Mostrar todas las tareas
    : firstFifteenTasks.filter((task: any) => calcularPorcentaje(task.checklist) !== '100') // Mostrar solo las tareas con porcentaje menor al 100%
  // Agrupa las tareas por `namCreated`
  const groupedTasks = tasksToShow.reduce((acc: any, task: any) => {
    const namCreated = extraerNonbreUsuario(task.id_user) // Aplicar la función aquí
    if (!acc[namCreated]) {
      acc[namCreated] = []
    }
    const taskWithExtraHTML = (
      <div
        className="w-full block group relative cursor-pointer"
        key={task.id}
        onClick={() => {
          setOpen(true)
          setContenidoSeleccionado({
            contenido: null,
            contexto: task
          })
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
                {calcularPorcentaje(task.checklist) != null && (
                  <span
                    className={cn(
                      'absolute top-0 right-0 text-white font-medium w-5 h-5 rounded-full flex items-center justify-center',
                      calcularPorcentaje(task.checklist) == '100'
                        ? 'bg-green-500'
                        : Number(calcularPorcentaje(task.checklist)) >= 50
                          ? 'bg-yellow-500'
                          : 'bg-red-500'
                    )}
                  ></span>
                )}
                <h1 className="text-black font-bold line-clamp-1">{task.titulo}</h1>
                {TaskComponent(task.created_at)}
              </div>
              <span className="text-gray-600 text-sm mt-1 line-clamp-2">Compartido por {namCreated}</span>
            </div>
          </div>
        </div>
      </div>
    )
    acc[namCreated].push(taskWithExtraHTML)
    return acc
  }, {})

  // Ordena los grupos por el número de elementos en cada grupo, de mayor a menor
  const sortedGroupedTasks = Object.entries(groupedTasks).sort(
    ([, tasksA]: [string, any], [, tasksB]: [string, any]) => tasksB.length - tasksA.length
  )

  const columns = sortedGroupedTasks.map(([key, tasks]: any) => (
    <SwiperSlide key={key} className="flex flex-col gap-y-2 w-full">
      <h2 className="w-full text-center font-bold text-gray-600">{key}</h2>
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
