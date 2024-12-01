import axios from 'axios'
import { Global } from '../../../../../helper/Global'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { type ValuesVenta, type valuesResumen } from '../../../../shared/schemas/Interfaces'
import { ModalWhatsapp } from './ModalWhatsapp'
import useAuth from '../../../../../hooks/useAuth'
import { BsArrowLeftSquareFill } from 'react-icons/bs'

export const VistaSeguimiento = (): JSX.Element => {
  const { id } = useParams()
  const { setTitle } = useAuth()
  const token = localStorage.getItem('token')
  const [proyecto, setProyecto] = useState<ValuesVenta | null>(null)
  const [resumen, setResumen] = useState<valuesResumen[]>([])

  const getOneBrief = async (): Promise<void> => {
    try {
      const request = await axios.get(`${Global.url}/getVenta/${id ?? ''}`, {
        headers: {
          Authorization: `Bearer ${
                token !== null && token !== '' ? `Bearer ${token}` : ''
              }`
        }
      })
      setTitle(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `REPORTE / ${request.data[0].nombres} ${request.data[0].apellidos} - ${
          // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
          request.data[0].nombre_marca
            ? (request.data[0].nombre_marca).toUpperCase()
            : 'No registrado'
        }`
      )
      setProyecto(request.data[0])
      if (request.data[0].resumen) {
        setResumen(JSON.parse(request.data[0].resumen))
      } else {
        setResumen([])
      }
    } catch (error) {}
  }

  useEffect(() => {
    getOneBrief()
  }, [])

  useEffect(() => {
    getOneBrief()
  }, [id])

  return (
    <section className='w-full h-full relative'>
       <span className='fixed w-fit md:top-[9%] lg:top-[11%] text-3xl z-20 right-4 text-red-500 cursor-pointer'
       onClick={() => { window.history.back() }}
       ><BsArrowLeftSquareFill/></span>
      <ModalWhatsapp getOneBrief={getOneBrief} id={id} setResumen={setResumen} resumen={resumen} proyecto={proyecto}/>
    </section>
  )
}
