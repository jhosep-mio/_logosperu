import axios from 'axios'
import { useParams } from 'react-router-dom'
import { useState, useEffect } from 'react'
import { BsArrowLeftSquareFill } from 'react-icons/bs'
import useAuth from '../../../../hooks/useAuth'
import { type ValuesVenta, type valuesResumen } from '../../../shared/schemas/Interfaces'
import { Global } from '../../../../helper/Global'
import { ModalWhatsappColaboradores } from './ModalWhatsappColaboradores'

export const ReportePorColaborador = (): JSX.Element => {
  const { id } = useParams()
  const { setTitle } = useAuth()
  const token = localStorage.getItem('token')
  const [proyecto, setProyecto] = useState<ValuesVenta | null>(null)
  const [resumen, setResumen] = useState<valuesResumen[]>([])

  const getOneBrief = async (): Promise<void> => {
    try {
      const request = await axios.get(`${Global.url}/indexShow/${id ?? ''}`, {
        headers: {
          Authorization: `Bearer ${
                token !== null && token !== '' ? `Bearer ${token}` : ''
              }`
        }
      })
      setTitle(
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        `REPORTE GENERAL - ${request.data[0].name}`
      )
      setProyecto(request.data[0])
      if (request.data[0].resumen_adicional) {
        setResumen(JSON.parse(request.data[0].resumen_adicional))
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
      <ModalWhatsappColaboradores getOneBrief={getOneBrief} id={id} setResumen={setResumen} resumen={resumen} proyecto={proyecto}/>
    </section>
  )
}
