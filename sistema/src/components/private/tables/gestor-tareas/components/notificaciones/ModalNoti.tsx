import 'moment/locale/es'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import useAuth from '../../../../../../hooks/useAuth'
import { Dialog, DialogContent } from '@mui/material'
import Swal from 'sweetalert2'
import { useEffect, useState } from 'react'
import musica from './../../../../../../assets/sonido/notificate.mp3'
import { Howl } from 'howler'
import ListadoNoti from './ListadoNoti'
import axios from 'axios'
import { Global } from '../../../../../../helper/Global'

export const ModalNoti = (): JSX.Element => {
  const { openModalShared, setOpenModalShared, tasks } = useAuth()
  const [isTaskNotified, setIsTaskNotified] = useState(false)
  const [isTaskNotified2, setIsTaskNotified2] = useState(false)
  const [mas, setMas] = useState('15')
  const [colaboradores, setColaboradores] = useState<never[]>([])
  const token = localStorage.getItem('token')
  const getColaboradores = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/indexAllToGestor`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setColaboradores(request.data)
  }
  const showNotification = (): void => {
    const sound = new Howl({
      src: [musica]
    })
    sound.play()
    Swal.fire({
      icon: 'success',
      title: 'Es hora de la tarea',
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Revisar'
    }).then((result) => {
      if (result.isConfirmed) {
        setOpenModalShared(true)
        sound.stop()
      }
    })
  }
  const isSameMinute = (date1: Date, date2: Date): boolean => {
    return (
      date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate() &&
      date1.getHours() === date2.getHours() &&
      date1.getMinutes() === date2.getMinutes()
    )
  }
  useEffect(() => {
    if (isTaskNotified) return // Evita ejecutar si ya se notificó.
    const notifyTasks = tasks
      ?.filter((task: any) => task.fecha) // Solo tareas con fecha válida.
      .map((task: any) => {
        const taskDeadline = new Date(JSON.parse(task.fecha))
        const currentDate = new Date()
        const timeDifference = taskDeadline.getTime() - currentDate.getTime()
        const hoursDifference = timeDifference / (1000 * 60 * 60)

        if (hoursDifference <= 0) {
          return { estado: 'vencio', texto: 'La tarea venció' }
        } else if (hoursDifference <= 1) {
          return {
            estado: 'pendiente',
            texto: 'La tarea vence en menos de 1 hora.'
          }
        }
        return null
      })
      .filter((notification) => notification?.estado == 'pendiente') // Solo tareas pendientes.

    if (notifyTasks?.length > 0) {
      Swal.fire({
        icon: 'warning',
        title: 'Tareas por vencer',
        confirmButtonColor: '#3085d6',
        confirmButtonText: 'Revisar'
      }).then((result) => {
        if (result.isConfirmed) {
          setOpenModalShared(true)
        }
      })
      setIsTaskNotified(true) // Marca como notificado.
    }
  }, [tasks, isTaskNotified, setOpenModalShared])

  useEffect(() => {
    if (!tasks || isTaskNotified2) return
    const checkTasks = (): any => {
      const currentDate = new Date()

      tasks.forEach((task: any) => {
        if (!task?.fecha) return

        const taskDeadline = new Date(JSON.parse(task.fecha))
        const oneHourBeforeDeadline = new Date(taskDeadline.getTime() - 60 * 60 * 1000)

        if (isSameMinute(taskDeadline, currentDate)) {
          showNotification()
          setIsTaskNotified2(true)
        } else if (isSameMinute(oneHourBeforeDeadline, currentDate)) {
          setIsTaskNotified2(true)
          Swal.fire({
            icon: 'success',
            title: 'Tareas por vencer',
            confirmButtonColor: '#3085d6',
            confirmButtonText: 'Revisar'
          }).then((result) => {
            if (result.isConfirmed) {
              setOpenModalShared(true)
            }
          })
        }
      })
    }
    const interval = setInterval(() => {
      checkTasks()
    }, 10000)
    return () => {
      clearInterval(interval)
    }
  }, [tasks, isTaskNotified2])

  useEffect(() => {
    if (openModalShared) {
      getColaboradores()
    }
  }, [openModalShared])

  return (
    <Dialog
      open={openModalShared}
      scroll={'body'}
      onClose={() => {
        setOpenModalShared(false)
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="modal_citas_clientes2"
    >
      <DialogContent className="w-full min-h-[600px] bg-[#F1F2F4] relative overflow-hidden">
        <span className="absolute top-2 right-2 text-2xl text-main">X</span>
        <div className="flex gap-3 items-center border-b border-gray-300 py-1 pb-4">
          <div className="flex flex-col justify-center">
            <h1 className="text-black font-bold text-sm md:text-lg">Notificaciones</h1>
            <div className="flex gap-2 justify-start">
              <span className="text-gray-600 text-sm">Logos Perú</span>
            </div>
          </div>
        </div>
        <section className="w-full p-0 relative">
          <div className="w-full h-full pt-4">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <ListadoNoti tasks={tasks} mas={mas} setMas={setMas} setOpenModalShared={setOpenModalShared} colaboradores={colaboradores} />
            </div>
            <span
              className="block w-full text-center mt-4 font-semibold text-blue-500 hover:underline transition-all cursor-pointer"
              onClick={() => {
                setMas(mas == '15' ? '100' : '15')
              }}
            >
              {mas == '15' ? 'Ver mas' : 'Ver menos'}
            </span>
          </div>
        </section>
      </DialogContent>
    </Dialog>
  )
}
