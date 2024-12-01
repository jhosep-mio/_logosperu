/* eslint-disable @typescript-eslint/prefer-optional-chain */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect } from 'react'
import 'moment/locale/es'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import { type DuoContent, type errorValues } from '../../../shared/schemas/Interfaces'
import { Loading } from '../../../shared/Loading'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { AnimatePresence } from 'framer-motion'
import { AlertSucess } from '../../../shared/alerts/AlertSucess'
import { useNavigate } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import { ModalCompartido } from './components/compartidos/ModalCompartido'
import ListadoCompartidos from './components/compartidos/ListadoCompartidos'
import { cn } from '../../../shared/cn'
import { HeaderGestor } from './components/HeaderGestor'

export const IndexCompartidos = (): JSX.Element => {
  const currentPath = window.location.pathname
  const navigate = useNavigate()
  if (currentPath != '/admin/gestor-tareas/compartidos') {
    navigate('/admin/gestor-tareas/compartidos')
  }
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(true)
  const { auth, gestorCompartido } = useAuth()
  const [tasks, setTasks] = useState([])
  const [showError, setShowError] = useState<errorValues | null>(null)
  const [open, setOpen] = useState(false)
  const [colaboradores, setColaboradores] = useState<never[]>([])
  const [mas, setMas] = useState('24')
  const [contenidoSeleccionado, setContenidoSeleccionado] = useState<DuoContent | null>(null)

  const getColaboradores = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/indexAllToGestor`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? token : ''}`
      }
    })
    setColaboradores(request.data)
  }

  const getContenidoCompartido = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/gestorContenido/findByMiembros/${auth.id}`, {
      headers: {
        Authorization: `Bearer ${token !== null && token !== '' ? `Bearer ${token}` : ''}`
      }
    })
    setTasks(request.data)
  }

  useEffect(() => {
    Promise.all([getColaboradores(), getContenidoCompartido()]).then(() => {
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    console.log(gestorCompartido)
    if (gestorCompartido) {
      setOpen(true)
      setContenidoSeleccionado({
        // @ts-expect-error
        contenido: null,
        contexto: JSON.parse(gestorCompartido).contexto
      })
    }
  }, [gestorCompartido])

  useEffect(() => {
    setTimeout(() => {
      if (showError != null) {
        setShowError(null)
      }
    }, 3000)
  }, [showError])

  const TaskComponent = (date: string): JSX.Element => {
    const fecha = new Date(date)
    const dia = fecha.getDate()
    const mes = fecha.getMonth() + 1
    const anio = fecha.getFullYear()
    const fechaFormateada = `${dia}/${mes}/${anio}`
    return (
      <div>
        <p className="text-sm text-gray-500">{fechaFormateada}</p>
      </div>
    )
  }

  const [showCompleted, setShowCompleted] = useState(false)

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-between gap-3 items-center border-b border-gray-300  py-1 md:py-0 lg:h-[10vh] mx-1 md:px-8">
        <div className="w-full flex gap-3 items-center">
          <div className="w-12 md:w-14 h-10 md:h-14 rounded-md bg-gradient-to-r from-cyan-500 to-blue-400 flex justify-center text-black text-base md:text-2xl items-center font-extrabold">
            {auth.name.trim() !== '' ? auth.name.charAt(0).toUpperCase() : ''}
          </div>
          <div className="flex flex-col justify-center">
            <h1 className="text-black font-bold text-sm md:text-lg">Espacio de trabajo de {auth.name.toUpperCase()}</h1>
            <div className="flex gap-2 justify-start">
              <span className="text-gray-600 text-sm">Logos Perú</span>
            </div>
          </div>
        </div>
        <div className="w-full flex lg:justify-end gap-3">
          <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl">
            <span className="bg-red-500 w-4 h-4 lg:w-6 lg:h-6 block rounded-full"></span>
            <span className="flex text-black font-medium"> {'< 50%'} </span>
          </div>
          <div className="flex items-center gap-2  bg-white px-2 py-1 rounded-xl">
            <span className="bg-yellow-500 w-4 h-4 lg:w-6 lg:h-6 block rounded-full"></span>
            <span className="flex text-black font-medium"> {'> 50%'} </span>
          </div>
          <div className="flex items-center gap-2  bg-white px-2 py-1 rounded-xl">
            <span className="bg-green-500 w-4 h-4 lg:w-6 lg:h-6 block rounded-full"></span>
            <span className="flex text-black font-medium"> {'100%'} </span>
          </div>
        </div>
      </div>
      <section className="w-full h-[90vh] px-4 lg:p-6 relative">
        <div className="w-full flex flex-col-reverse gap-2 py-3 lg:py-0 p-6 md:gap-0 items-center md:flex-row justify-between">
          <HeaderGestor />
          <button
            type="button"
            onClick={() => {
              setShowCompleted(!showCompleted)
            }}
            className={cn(
              'flex items-center bg-green-700 hover:bg-green-800 border-2 px-4 rounded-md gap-3 text-base md:text-lg font-semibold text-white transition-colors cursor-pointer',
              showCompleted ? ' border-red-600' : 'border-transparent'
            )}
          >
            <span className="hidden lg:block">Todos</span>
          </button>
        </div>
        {loading ? (
          <Loading />
        ) : (
          <>
            <div className="w-full   p-0 lg:px-6 lg:pt-6 overflow-y-auto bg-[#E9E8E8] z-[9]">
              <div className="w-auto">
                <ListadoCompartidos
                  mas={mas}
                  setMas={setMas}
                  tasks={tasks}
                  setOpen={setOpen}
                  TaskComponent={TaskComponent}
                  setContenidoSeleccionado={setContenidoSeleccionado}
                  setShowCompleted={setShowCompleted}
                  showCompleted={showCompleted}
                  colaboradores={colaboradores}
                />
              </div>
            </div>
          </>
        )}
        <span
          className="block w-full text-center mt-2 font-semibold text-blue-500 hover:underline transition-all cursor-pointer"
          onClick={() => {
            setMas(mas == '24' ? '100' : '24')
          }}
        >
          {mas == '24' ? 'Ver mas' : 'Ver menos'}
        </span>
        <ModalCompartido
          colaboradores={colaboradores}
          open={open}
          setOpen={setOpen}
          contenidoSeleccionado={contenidoSeleccionado}
          getTareas={getContenidoCompartido}
        />
        <AnimatePresence>{showError != null && <AlertSucess showError={showError} />}</AnimatePresence>
      </section>
    </>
  )
}
