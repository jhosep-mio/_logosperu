/* eslint-disable @typescript-eslint/ban-ts-comment */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable multiline-ternary */
import {
  FaArrowUpRightDots,
  FaFacebookF,
  FaInstagram,
  FaRegImages,
  FaRegLightbulb,
  FaTiktok,
  FaWhatsapp
} from 'react-icons/fa6'
import { IoDocumentTextOutline, IoMailUnreadOutline } from 'react-icons/io5'
import { logo } from '../../../../../shared/Images'
import { useState, useEffect } from 'react'
import { ModalEdicion } from './ModalEdicion'
import { GiStarsStack } from 'react-icons/gi'
import { Loading } from '../../../../../shared/Loading'
import axios from 'axios'
import { Global } from '../../../../../../helper/Global'
import { toast } from 'sonner'
import { useParams } from 'react-router-dom'
// @ts-expect-error
import html2pdf from 'html2pdf.js'
import icono from '../../../../../../assets/logo/icono.webp'
import { FiMapPin } from 'react-icons/fi'

export const MetricasClienteCM = (): JSX.Element => {
  const { id } = useParams()
  const [loading, setLoading] = useState(true)
  const currentYear = new Date().getFullYear()
  const currentMonthIndex = new Date().getMonth() + 1

  const [selectedMonth, setSelectedMonth] = useState(currentMonthIndex)
  const [selectedYear, setSelectedYear] = useState(currentYear)
  const [open, setOpen] = useState(false)
  const [datos, setDatos] = useState<any>(null)
  const [loadingCanva, setLoadingCanva] = useState(false)

  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ]

  const years = []
  const startYear = 2023
  const endYear = new Date().getFullYear()

  for (let year = endYear; year >= startYear; year--) {
    years.push(year)
  }

  const handleMonthChange = (e: any): void => {
    setSelectedMonth(e.target.value)
  }

  const handleYearChange = (e: any): void => {
    setSelectedYear(e.target.value)
  }

  const getInformacion = async (): Promise<void> => {
    const token = localStorage.getItem('token')
    setLoading(true)
    setDatos(null)
    try {
      const request = await axios.get(
        `${Global.url}/getDatarMetricaComunnity/${id ?? ''}`,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )
      const allData = request.data.data
      const filteredData = allData.filter(
        (item: any) => item.mes == selectedMonth && item.year == selectedYear
      )
      console.log(filteredData)
      if (filteredData.length > 0) {
        setDatos({
          id: filteredData[0].id,
          marca: filteredData[0].marca,
          datos: JSON.parse(filteredData[0].arraycontenido)
        })
      }
    } catch (error) {
      console.log(error)
      toast.warning('No hay información para esta fecha')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getInformacion()
  }, [id, selectedMonth, selectedYear])

  const removePrefixBeforeUnderscore = (fileName: string): string => {
    const underscoreIndex = fileName.indexOf('_')
    if (underscoreIndex !== -1) {
      return fileName.substring(underscoreIndex + 1)
    }
    return fileName
  }

  const handleDownloadPDF = (): void => {
    setLoadingCanva(true)
    const element = document.getElementById('contenido-html')
    const opt = {
      margin: 0,
      filename: `INFORME_${datos?.marca}.pdf`, // Asegúrate de que el nombre sea único y válido
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: {
        scale: 2,
        logging: true,
        dpi: 192,
        letterRendering: true,
        useCORS: true
      },
      jsPDF: { unit: 'in', format: 'a4', orientation: 'landscape' } // Orientación horizontal
    }
    html2pdf()
      .from(element)
      .set(opt)
      .toPdf()
      .get('pdf')
      .then((pdf: any) => {
        pdf.save(opt.filename) // Guarda el PDF
        setLoadingCanva(false) // Setea a false después de guardar el PDF
      })
      .catch(() => {
        setLoadingCanva(false) // También maneja errores si ocurre alguno
      })
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="w-full mt-4 text-black/80 flex-col flex ">
            <div className="w-full flex gap-3 mb-4 justify-between">
              <div className="flex gap-3 w-fit">
                <select
                  className="p-2 border rounded"
                  value={selectedMonth}
                  onChange={handleMonthChange}
                >
                  <option value="">Seleccionar Mes</option>
                  {months.map((month, index) => (
                    <option key={index} value={index + 1}>
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  className="p-2 border rounded"
                  value={selectedYear}
                  onChange={handleYearChange}
                >
                  <option value="">Seleccionar Año</option>
                  {years.map((year, index) => (
                    <option key={index} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <button
                  onClick={() => {
                    handleDownloadPDF()
                  }}
                  type="button"
                  className="bg-main h-full px-4 rounded-md text-white font-bold"
                >
                  Descargar PDF
                </button>
              </div>
              <div>
                <button
                  onClick={() => {
                    setOpen(!open)
                  }}
                  type="button"
                  className="bg-main h-full px-4 rounded-md text-white font-bold"
                >
                  Editar
                </button>
              </div>
            </div>
            <section className="w-full">
              <div className="bg-[#18223C] w-full h-[350px] lg:min-h-[794px] flex flex-col items-center gap-10 lg:gap-20 justify-between py-10 lg:py-20 ">
                <img src={logo} alt="" className="w-[100px] lg:w-[200px]" />
                <h1 className="uppercase text-center text-main text-lg lg:text-6xl font-bold">
                    INFORME DE <br /> <span className='text-[#F5CA32]'>{datos?.marca}</span>
                </h1>
                <p className="uppercase text-center text-black text-sm lg:text-2xl font-normal w-fit lg:w-[400px] shadow_community bg-white p-3 rounded-md">
                  {datos?.datos?.fecha_texto}
                </p>
              </div>

              <div className="bg-white overflow-x-auto relative w-full min-h-[350px] lg:min-h-[794px] flex flex-col items-center mt-10 px-4 lg:px-10 pt-4 pb-10 lg:py-10 ">
                <img src={icono} alt="" className='absolute inset-0 w-[340px] h-[340px] object-contain m-auto opacity-10'/>
                <div className="w-full flex items-center gap-2 lg:gap-4 mb-6 lg:mb-0">
                  <div className="bg-white border-black border rounded-md text-black shadow w-fit p-2 text-base lg:text-3xl">
                    <IoDocumentTextOutline />
                  </div>
                  <div className="w-full border-b border-black flex flex-col lg:flex-row lg:flex justify-between py-2 gap-2 lg:gap-4">
                    <h1 className="uppercase  font-semibold  text-black  text-sm lg:text-2xl ">
                      Resumen
                    </h1>
                    <p className="text-xs lg:text-base">
                      Seguidores, Impresiones, interacciones y publicaciones
                    </p>
                  </div>
                </div>
                <div className="hidden w-full lg:w-full lg:grid grid-cols-5 lg:grid-cols-9 mt-10">
                  <div className="w-full text-sm  bg-yellow-400 text-black font-bold lg:text-lg border border-black p-2">
                    <p>Canal</p>
                  </div>
                  <div className="w-full text-sm  lg:col-span-2 bg-yellow-400 text-black font-bold lg:text-lg border border-black p-2">
                    <p>Seguidores</p>
                  </div>
                  <div className="w-full text-sm  lg:col-span-2 bg-yellow-400 text-black font-bold lg:text-lg border border-black p-2">
                    <p>Impresiónes</p>
                  </div>
                  <div className="w-full text-sm  lg:col-span-2 bg-yellow-400 text-black font-bold lg:text-lg border border-black p-2">
                    <p>Interacciones</p>
                  </div>
                  <div className="w-full text-sm  lg:col-span-2 bg-yellow-400 text-black font-bold lg:text-lg border border-black p-2">
                    <p>N° Publicaciones</p>
                  </div>
                </div>

                <div className="w-full  lg:w-full grid grid-cols-1  lg:grid-cols-9">
                  <div className="w-full text-sm bg-yellow-400 text-black lg:text-lg border border-black p-2">
                    <p>Instagram</p>
                  </div>
                  {datos?.datos?.instagramPerfil?.seguidores ? (
                    <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2">
                      <p className="font-bold lg:hidden">Seguidores</p>
                      <p>{datos?.datos?.instagramPerfil?.seguidores}</p>
                    </div>
                  ) : <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2"> </div>}
                  {datos?.datos?.instagramPerfil?.impresiones ? (
                    <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2">
                      <p className="font-bold lg:hidden">Impresiónes</p>
                      <p>{datos?.datos?.instagramPerfil?.impresiones}</p>
                    </div>
                  ) : <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2"></div> }
                  {datos?.datos?.instagramPosts?.interacciones ||
                    datos?.datos?.instagramReels?.interacciones ? (
                      <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2">
                        <p className="font-bold lg:hidden">Interacciones</p>
                        <p>
                          {Number(datos?.datos?.instagramPosts?.interacciones) +
                            Number(datos?.datos?.instagramReels?.interacciones)}
                        </p>
                      </div>
                      ) : <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2"></div> }
                  {datos?.datos?.instagramPosts?.publicaciones ||
                    datos?.datos?.instagramReels?.reels ? (
                      <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2">
                        <p className="font-bold lg:hidden">N° Publicaciones</p>
                        <p>
                          {Number(datos?.datos?.instagramPosts?.publicaciones) +
                            Number(datos?.datos?.instagramReels?.reels)}
                        </p>
                      </div>
                      ) : <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2"></div> }
                </div>

                <div className="w-full  lg:w-full grid grid-cols-1  lg:grid-cols-9">
                  <div className="w-full text-sm bg-yellow-400 text-black lg:text-lg border border-black p-2">
                    <p>Facebook</p>
                  </div>
                  {datos?.datos?.facebookCrecimiento?.seguidores ? (
                    <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2">
                      <p className="font-bold lg:hidden">Seguidores</p>
                      <p>{datos?.datos?.facebookCrecimiento?.seguidores}</p>
                    </div>
                  ) : <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2"></div> }
                  {datos?.datos?.facebookCrecimiento?.impresiones ? (
                    <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2">
                      <p className="font-bold lg:hidden">Impresiónes</p>
                      <p>{datos?.datos?.facebookCrecimiento?.impresiones}</p>
                    </div>
                  ) : <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2"></div> }
                  {datos?.datos?.facebookPublicaciones?.interacciones ||
                    datos?.datos?.facebookReels?.interacciones ? (
                      <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2">
                        <p className="font-bold lg:hidden">Interacciones</p>
                        <p>
                          {Number(
                            datos?.datos?.facebookPublicaciones?.interacciones
                          ) +
                            Number(datos?.datos?.facebookReels?.interacciones)}
                        </p>
                      </div>
                      ) : <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2"></div> }
                  {datos?.datos?.facebookPublicaciones?.publicaciones ||
                    datos?.datos?.facebookReels?.reels ? (
                      <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2">
                        <p className="font-bold lg:hidden">N° Publicaciones</p>
                        <p>
                          {Number(
                            datos?.datos?.facebookPublicaciones.publicaciones
                          ) + Number(datos?.datos?.facebookReels?.reels)}
                        </p>
                      </div>
                      ) : <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2"></div> }
                </div>

                {datos?.datos?.tiktokComunidad?.seguidores || datos?.datos?.tiktokVideos?.visualizaciones || datos?.datos?.tiktokVideos?.interacciones || datos?.datos?.tiktokVideos?.vídeos
                  ? <div className="w-full  lg:w-full grid grid-cols-1  lg:grid-cols-9">
                    <div className="w-full text-sm bg-yellow-400 text-black lg:text-lg border border-black p-2">
                        <p>TikTok</p>
                    </div>
                    {datos?.datos?.tiktokComunidad?.seguidores ? (
                        <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2">
                        <p className="font-bold lg:hidden">Seguidores</p>
                        <p>{datos?.datos?.tiktokComunidad?.seguidores}</p>
                        </div>
                    ) : <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2"></div>}
                    {datos?.datos?.tiktokVideos?.visualizaciones ? (
                        <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2">
                        <p className="font-bold lg:hidden">Impresiónes</p>
                        <p>{datos?.datos?.tiktokVideos?.visualizaciones}</p>
                        </div>
                    ) : <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2"></div>}
                    {datos?.datos?.tiktokVideos?.interacciones ? (
                        <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2">
                        <p className="font-bold lg:hidden">Interacciones </p>
                        <p>{Number(datos?.datos?.tiktokVideos?.interacciones)}</p>
                        </div>
                    ) : <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2"></div>}
                    {datos?.datos?.tiktokVideos?.vídeos ? (
                        <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2">
                        <p className="font-bold lg:hidden">N° Publicaciones</p>
                        <p>{Number(datos?.datos?.tiktokVideos.vídeos)}</p>
                        </div>
                    ) : <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2"></div>}
                    </div> : null
                }

                <div className="w-full  flex flex-col absolute bottom-4 px-4 gap-4 lg:px-10 text-sm lg:text-base opacity-40">
                    <div className='grid grid-cols-3'>
                        <div className='w-full flex gap-3 items-center justify-center text-xl'>
                            <IoMailUnreadOutline className='text-3xl'/>
                            <span>ventas@logosperu.com</span>
                        </div>
                        <div className='w-full flex gap-3 items-center text-xl justify-center'>
                            <FiMapPin className='text-3xl'/>
                            <span>Jr. Tauro 883 Urb. Mercurio - Los olivos</span>
                        </div>
                        <div className='w-full flex gap-3 items-center text-xl justify-center'>
                            <FaWhatsapp className='text-3xl'/>
                            <span>Área de ventas (+51) 987 038 024</span>
                        </div>
                    </div>
                    <div className='flex gap-10 items-center'>
                        <span className='block w-[30%] bg-main h-2 rounded-lg'></span>
                        <span className='block w-[70%] bg-main h-2 rounded-lg'></span>
                    </div>
                </div>
            </div>

              {/* TOP 3 PUBLICACIONES */}
              <div className="bg-white relative w-full  flex flex-col items-center mt-10 min-h-[350px] lg:min-h-[794px] px-4 lg:px-10 p-4 pb-10 lg:py-10 ">
                <img src={icono} alt="" className='absolute inset-0 w-[340px] h-[340px] object-contain m-auto opacity-10'/>

                <div className="w-full flex items-center gap-2 lg:gap-4 mb-2 lg:mb-0">
                  <div className="bg-white border-black border rounded-md text-black shadow w-fit p-2 text-base lg:text-3xl">
                    <FaRegImages />
                  </div>
                  <div className="w-full border-b border-black flex flex-col lg:flex-row lg:flex justify-between py-2 gap-2 lg:gap-4">
                    <h1 className="uppercase  font-semibold  text-black  text-sm lg:text-2xl ">
                      TOP 3 PUBLICACIONES{' '}
                    </h1>
                    <p className="text-xs lg:text-base">Segun impresiones</p>
                  </div>
                </div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4 lg:mt-10">
                  {datos?.datos?.contenido.map((item: any, index: number) => (
                    <div className="w-full flex flex-col" key={index}>
                      <div className="shadow_hosting shadow_community overflow-hidden w-fit bg-[#3c70a6] rounded-2xl  flex flex-col space-y-5 ">
                        <div className="flex gap-3 items-center">
                          <div className="flex flex-col w-full">
                            <div className="flex gap-3 items-center text-white w-full">
                              {item.imagen ? (
                                <img
                                  src={`https://api.logosperu.com.pe/public/archivos_metricascm/${removePrefixBeforeUnderscore(
                                    item?.imagen.name
                                  )}`}
                                  alt=""
                                  className="w-[200px] lg:w-[350px] h-[200px] lg:h-[350px] object-cover"
                                />
                              ) : null }
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-full mt-3 flex flex-col gap-0 p-4">
                        <p className="uppercase font-bold text-black text-lg lg:text-2xl">
                          {item?.redSocial}
                        </p>
                        <p className="uppercase font-bold text-black text-sm lg:text-lg mt-3">
                          {item?.texto1}
                          {/* <span className="font-normal">137</span> */}
                        </p>
                        <p className="uppercase font-bold text-gray-500 text-xs lg:text-base">
                          {item?.fecha}
                        </p>
                        <p className="uppercase font-bold text-gray-700 mt-3 text-xs lg:text-base">
                          {item?.texto}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="w-full  flex flex-col absolute bottom-4 px-4 gap-4 lg:px-10 text-sm lg:text-base opacity-40">
                    <div className='grid grid-cols-3'>
                        <div className='w-full flex gap-3 items-center justify-center text-xl'>
                            <IoMailUnreadOutline className='text-3xl'/>
                            <span>ventas@logosperu.com</span>
                        </div>
                        <div className='w-full flex gap-3 items-center text-xl justify-center'>
                            <FiMapPin className='text-3xl'/>
                            <span>Jr. Tauro 883 Urb. Mercurio - Los olivos</span>
                        </div>
                        <div className='w-full flex gap-3 items-center text-xl justify-center'>
                            <FaWhatsapp className='text-3xl'/>
                            <span>Área de ventas (+51) 987 038 024</span>
                        </div>
                    </div>
                    <div className='flex gap-10 items-center'>
                        <span className='block w-[30%] bg-main h-2 rounded-lg'></span>
                        <span className='block w-[70%] bg-main h-2 rounded-lg'></span>
                    </div>
                </div>
              </div>
              {/* FACEBOOK */}

              <div className="bg-white relative w-full  flex flex-col items-center mt-10 min-h-[350px] lg:min-h-[794px] px-4 lg:px-10 pt-4 pb-10 lg:py-10 ">
                <img src={icono} alt="" className='absolute inset-0 w-[340px] h-[340px] object-contain m-auto opacity-10'/>

                <div className="w-full flex items-center gap-4 ">
                  <div className="bg-white border-black border rounded-md text-black shadow w-fit p-2 text-lg lg:text-3xl">
                    <FaFacebookF />
                  </div>
                  <div className="w-full border-b border-black flex justify-between py-2 gap-4">
                    <h1 className="uppercase  font-semibold  text-black  text-base lg:text-2xl ">
                      Facebook
                    </h1>
                    {/* <p>Segun impresiones</p> */}
                  </div>
                </div>
                <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-10 px-4 lg:gap-20 my-10">
                  <div className="w-full flex flex-col">
                    <div className="shadow_hosting shadow_community overflow-hidden w-full bg-white rounded-2xl border border-gray-300 flex flex-col space-y-5 ">
                      <div className="flex gap-3 lg:gap-5 items-center">
                        <div className="flex flex-col w-full">
                          <div className="flex flex-col gap-0 p-6 text-black w-full">
                            <h2 className="uppercase font-bold text-lg lg:text-2xl">
                              CRECIMIENTO
                            </h2>
                            {datos?.datos?.facebookCrecimiento?.megusta ? (
                              <div className="flex flex-col mt-4 lg:mt-10">
                                <p className="font-bold text-base lg:text-xl">
                                  Me gustas
                                </p>
                                <p>
                                  {datos?.datos?.facebookCrecimiento?.megusta}
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 lg:mt-10"> </div>}
                            {datos?.datos?.facebookCrecimiento?.seguidores ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Seguidores
                                </p>
                                <p>
                                  {
                                    datos?.datos?.facebookCrecimiento
                                      ?.seguidores
                                  }
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "></div> }
                            {datos?.datos?.facebookCrecimiento?.impresiones ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Impresiones
                                </p>
                                <p>
                                  {
                                    datos?.datos?.facebookCrecimiento
                                      ?.impresiones
                                  }
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "> </div>}
                            {datos?.datos?.facebookCrecimiento?.visitas ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Visitas a la pagina
                                </p>
                                <p>
                                  {datos?.datos?.facebookCrecimiento?.visitas}
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "></div> }
                            {datos?.datos?.facebookCrecimiento
                              ?.publicaciones ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Publicaciones
                                </p>
                                <p>
                                  {
                                    datos?.datos?.facebookCrecimiento
                                      ?.publicaciones
                                  }
                                </p>
                              </div>
                                ) : <div className="flex flex-col mt-4 "></div> }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-col h-full">
                    <div className="h-full shadow_hosting shadow_community overflow-hidden w-full bg-white rounded-2xl border border-gray-300 flex flex-col space-y-5 ">
                      <div className="flex gap-3 lg:gap-5 items-center">
                        <div className="flex flex-col w-full">
                          <div className="flex flex-col gap-0 p-6 text-black w-full">
                            <h2 className="uppercase font-bold text-lg lg:text-2xl">
                              PUBLICACIONES
                            </h2>
                            {datos?.datos?.facebookPublicaciones
                              ?.interacciones ? (
                              <div className="flex flex-col mt-4 lg:mt-10">
                                <p className="font-bold text-base lg:text-xl">
                                  Interacciones
                                </p>
                                <p>
                                  {
                                    datos?.datos?.facebookPublicaciones
                                      ?.interacciones
                                  }
                                </p>
                              </div>
                                ) : <div className="flex flex-col mt-4 lg:mt-10"></div>}
                            {datos?.datos?.facebookPublicaciones?.alcance ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Alcance
                                </p>
                                <p>
                                  {datos?.datos?.facebookPublicaciones?.alcance}
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "></div>}
                            {datos?.datos?.facebookPublicaciones
                              ?.impresiones ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Impresiones
                                </p>
                                <p>
                                  {
                                    datos?.datos?.facebookPublicaciones
                                      ?.impresiones
                                  }
                                </p>
                              </div>
                                ) : <div className="flex flex-col mt-4 "></div>}
                            {datos?.datos?.facebookPublicaciones
                              ?.publicaciones ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Publicaciones
                                </p>
                                <p>
                                  {
                                    datos?.datos?.facebookPublicaciones
                                      ?.publicaciones
                                  }
                                </p>
                              </div>
                                ) : <div className="flex flex-col mt-4 "></div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {datos?.datos?.facebookReels?.interacciones || datos?.datos?.facebookReels?.alcance || datos?.datos?.facebookReels?.visualizaciones || datos?.datos?.facebookReels?.reels
                    ? <div className="w-full flex flex-col h-full">
                    <div className="h-full shadow_hosting shadow_community overflow-hidden w-full bg-white rounded-2xl border border-gray-300 flex flex-col space-y-5 ">
                      <div className="flex gap-3 lg:gap-5 items-center">
                        <div className="flex flex-col w-full">
                          <div className="flex flex-col gap-0 p-6 text-black w-full">
                            <h2 className="uppercase font-bold text-lg lg:text-2xl">
                              REELS
                            </h2>
                            {datos?.datos?.facebookReels?.interacciones ? (
                              <div className="flex flex-col mt-4 lg:mt-10">
                                <p className="font-bold text-base lg:text-xl">
                                  Interacciones
                                </p>
                                <p>
                                  {datos?.datos?.facebookReels?.interacciones}
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 lg:mt-10"> </div> }
                            {datos?.datos?.facebookReels?.alcance ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Alcance
                                </p>
                                <p>{datos?.datos?.facebookReels?.alcance}</p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "></div> }
                            {datos?.datos?.facebookReels?.visualizaciones ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Visualizaciones
                                </p>
                                <p>
                                  {datos?.datos?.facebookReels?.visualizaciones}
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "></div> }
                            {datos?.datos?.facebookReels?.reels ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Reels
                                </p>
                                <p>{datos?.datos?.facebookReels?.reels}</p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "></div> }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> : null }
                </div>
                <div className="w-full  flex flex-col absolute bottom-4 px-4 gap-4 lg:px-10 text-sm lg:text-base opacity-40">
                    <div className='grid grid-cols-3'>
                        <div className='w-full flex gap-3 items-center justify-center text-xl'>
                            <IoMailUnreadOutline className='text-3xl'/>
                            <span>ventas@logosperu.com</span>
                        </div>
                        <div className='w-full flex gap-3 items-center text-xl justify-center'>
                            <FiMapPin className='text-3xl'/>
                            <span>Jr. Tauro 883 Urb. Mercurio - Los olivos</span>
                        </div>
                        <div className='w-full flex gap-3 items-center text-xl justify-center'>
                            <FaWhatsapp className='text-3xl'/>
                            <span>Área de ventas (+51) 987 038 024</span>
                        </div>
                    </div>
                    <div className='flex gap-10 items-center'>
                        <span className='block w-[30%] bg-main h-2 rounded-lg'></span>
                        <span className='block w-[70%] bg-main h-2 rounded-lg'></span>
                    </div>
                </div>
              </div>
              {/* INSTAGRAM */}
              <div className="bg-white relative w-full  flex flex-col items-center mt-10 px-4 min-h-[350px] lg:min-h-[794px] lg:px-10 pt-4 pb-10 lg:py-10 ">
                 <img src={icono} alt="" className='absolute inset-0 w-[340px] h-[340px] object-contain m-auto opacity-10'/>

                <div className="w-full flex items-center gap-4 ">
                  <div className="bg-white border-black border rounded-md text-black shadow w-fit p-2 text-lg lg:text-3xl">
                    <FaInstagram />
                  </div>
                  <div className="w-full border-b border-black flex justify-between py-2 gap-4">
                    <h1 className="uppercase  font-semibold  text-black  text-base lg:text-2xl ">
                      INSTAGRAM
                    </h1>
                  </div>
                </div>
                <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-10 px-4 lg:gap-20 my-10">
                  <div className="h-full w-full flex flex-col">
                    <div className="h-full shadow_hosting shadow_community overflow-hidden w-full bg-white rounded-2xl border border-gray-300 flex flex-col space-y-5 ">
                      <div className="flex gap-3 lg:gap-5 items-center">
                        <div className="flex flex-col w-full">
                          <div className="flex flex-col gap-0 p-6 text-black w-full">
                            <h2 className="uppercase font-bold text-lg lg:text-2xl">
                              Perfil
                            </h2>
                            {datos?.datos?.instagramPerfil?.alcance ? (
                              <div className="flex flex-col mt-4 lg:mt-10">
                                <p className="font-bold text-base lg:text-xl">
                                  Alcance
                                </p>
                                <p>{datos?.datos?.instagramPerfil?.alcance}</p>
                              </div>
                            ) : <div className="flex flex-col mt-4 lg:mt-10"> </div>}
                            {datos?.datos?.instagramPerfil?.visitaperfil ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Visitas al Perfil
                                </p>
                                <p>
                                  {datos?.datos?.instagramPerfil?.visitaperfil}
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "></div> }
                            {datos?.datos?.instagramPerfil?.publicaciones ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Publicaciones
                                </p>
                                <p>
                                  {datos?.datos?.instagramPerfil?.publicaciones}
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "></div> }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-col h-full">
                    <div className="h-full shadow_hosting shadow_community overflow-hidden w-full bg-white rounded-2xl border border-gray-300 flex flex-col space-y-5 ">
                      <div className="flex gap-3 lg:gap-5 items-center">
                        <div className="flex flex-col w-full">
                          <div className="flex flex-col gap-0 p-6 text-black w-full">
                            <h2 className="uppercase font-bold text-lg lg:text-2xl">
                              POSTS
                            </h2>
                            {datos?.datos?.instagramPosts?.interacciones ? (
                              <div className="flex flex-col mt-4 lg:mt-10">
                                <p className="font-bold text-base lg:text-xl">
                                  Interacciones
                                </p>
                                <p>
                                  {datos?.datos?.instagramPosts?.interacciones}
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 lg:mt-10"> </div>}
                            {datos?.datos?.instagramPosts?.alcance ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Alcance
                                </p>
                                <p>{datos?.datos?.instagramPosts?.alcance}</p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "></div> }
                            {datos?.datos?.instagramPosts?.publicaciones ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Publicaciones
                                </p>
                                <p>
                                  {datos?.datos?.instagramPosts?.publicaciones}
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "> </div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {datos?.datos?.instagramReels?.interacciones || datos?.datos?.instagramReels?.alcance || datos?.datos?.instagramReels?.reels
                    ? <div className="w-full flex flex-col h-full">
                    <div className="h-full shadow_hosting shadow_community overflow-hidden w-full bg-white rounded-2xl border border-gray-300 flex flex-col space-y-5 ">
                      <div className="flex gap-3 lg:gap-5 items-center">
                        <div className="flex flex-col w-full">
                          <div className="flex flex-col gap-0 p-6 text-black w-full">
                            <h2 className="uppercase font-bold text-lg lg:text-2xl">
                              REELS
                            </h2>
                            {datos?.datos?.instagramReels?.interacciones ? (
                              <div className="flex flex-col mt-4 lg:mt-10">
                                <p className="font-bold text-base lg:text-xl">
                                  Interacciones
                                </p>
                                <p>
                                  {datos?.datos?.instagramReels?.interacciones}
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 lg:mt-10"></div> }
                            {datos?.datos?.instagramReels?.alcance ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Alcance
                                </p>
                                <p>{datos?.datos?.instagramReels?.alcance}</p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "> </div>}
                            {datos?.datos?.instagramReels?.reels ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Reels
                                </p>
                                <p>{datos?.datos?.instagramReels?.reels}</p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "> </div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> : null }
                </div>
                <div className="w-full  flex flex-col absolute bottom-4 px-4 gap-4 lg:px-10 text-sm lg:text-base opacity-40">
                    <div className='grid grid-cols-3'>
                        <div className='w-full flex gap-3 items-center justify-center text-xl'>
                            <IoMailUnreadOutline className='text-3xl'/>
                            <span>ventas@logosperu.com</span>
                        </div>
                        <div className='w-full flex gap-3 items-center text-xl justify-center'>
                            <FiMapPin className='text-3xl'/>
                            <span>Jr. Tauro 883 Urb. Mercurio - Los olivos</span>
                        </div>
                        <div className='w-full flex gap-3 items-center text-xl justify-center'>
                            <FaWhatsapp className='text-3xl'/>
                            <span>Área de ventas (+51) 987 038 024</span>
                        </div>
                    </div>
                    <div className='flex gap-10 items-center'>
                        <span className='block w-[30%] bg-main h-2 rounded-lg'></span>
                        <span className='block w-[70%] bg-main h-2 rounded-lg'></span>
                    </div>
                </div>
              </div>
              {/* TIKTOK */}
              {datos?.datos?.tiktokComunidad?.seguidores || datos?.datos?.tiktokComunidad?.videos
                ? <div className="bg-white relative w-full  flex flex-col items-center mt-10 px-4 min-h-[350px] lg:min-h-[794px] lg:px-10 pt-4 pb-10 lg:py-10 ">
                <img src={icono} alt="" className='absolute inset-0 w-[340px] h-[340px] object-contain m-auto opacity-10'/>

                <div className="w-full flex items-center gap-4 ">
                  <div className="bg-white border-black border rounded-md text-black shadow w-fit p-2 text-lg lg:text-3xl">
                    <FaTiktok />
                  </div>
                  <div className="w-full border-b border-black flex justify-between py-2 gap-4">
                    <h1 className="uppercase  font-semibold  text-black  text-base lg:text-2xl ">
                      TIK TOK
                    </h1>
                    {/* <p>Segun impresiones</p> */}
                  </div>
                </div>
                <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-10 px-4 lg:gap-10 my-10">
                  <div className="w-full h-full flex flex-col">
                    <div className="shadow_hosting h-full shadow_community overflow-hidden w-full bg-white rounded-2xl border border-gray-300 flex flex-col space-y-5 ">
                      <div className="flex gap-3 lg:gap-5 items-center">
                        <div className="flex flex-col w-full">
                          <div className="flex flex-col gap-0 p-6 text-black w-full">
                            <h2 className="uppercase font-bold text-lg lg:text-2xl">
                              CRECIMIENTO
                            </h2>
                            {datos?.datos?.tiktokComunidad?.seguidores ? (
                              <div className="flex flex-col mt-4 lg:mt-10">
                                <p className="font-bold text-base lg:text-xl">
                                  Seguidores
                                </p>
                                <p>
                                  {datos?.datos?.tiktokComunidad?.seguidores}
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 lg:mt-10"></div> }
                            {datos?.datos?.tiktokComunidad?.videos ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Videos
                                </p>
                                <p>{datos?.datos?.tiktokComunidad?.videos}</p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "></div> }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-col h-full">
                    <div className="h-full shadow_hosting shadow_community overflow-hidden w-full bg-white rounded-2xl border border-gray-300 flex flex-col space-y-5 ">
                      <div className="flex gap-3 lg:gap-5 items-center">
                        <div className="flex flex-col w-full">
                          <div className="flex flex-col gap-0 p-6 text-black w-full">
                            <h2 className="uppercase font-bold text-lg lg:text-2xl">
                              PUBLICACIONES
                            </h2>
                            {datos?.datos?.tiktokPerfil?.visitas ? (
                              <div className="flex flex-col mt-4 lg:mt-10">
                                <p className="font-bold text-base lg:text-xl">
                                  Visitas
                                </p>
                                <p>{datos?.datos?.tiktokPerfil?.visitas}</p>
                              </div>
                            ) : <div className="flex flex-col mt-4 lg:mt-10"></div> }
                            {datos?.datos?.tiktokPerfil?.videos ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Videos
                                </p>
                                <p>{datos?.datos?.tiktokPerfil?.videos}</p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "></div> }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-col h-full">
                    <div className="h-full shadow_hosting shadow_community overflow-hidden w-full bg-white rounded-2xl border border-gray-300 flex flex-col space-y-5 ">
                      <div className="flex gap-3 lg:gap-5 items-center">
                        <div className="flex flex-col w-full">
                          <div className="flex flex-col gap-0 p-6 text-black w-full">
                            <h2 className="uppercase font-bold text-lg lg:text-2xl">
                              VIDEOS
                            </h2>
                            {datos?.datos?.tiktokVideos?.interacciones ? (
                              <div className="flex flex-col mt-4 lg:mt-10">
                                <p className="font-bold text-base lg:text-xl">
                                  Interacciones
                                </p>
                                <p>
                                  {datos?.datos?.tiktokVideos?.interacciones}
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 lg:mt-10"></div> }
                            {datos?.datos?.tiktokVideos?.alcance ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Alcance
                                </p>
                                <p>{datos?.datos?.tiktokVideos?.alcance}</p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "> </div>}
                            {datos?.datos?.tiktokVideos?.visualizaciones ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Visualizaciones
                                </p>
                                <p>
                                  {datos?.datos?.tiktokVideos?.visualizaciones}
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "> </div>}
                            {datos?.datos?.tiktokVideos?.vídeos ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  vídeos
                                </p>
                                <p>{datos?.datos?.tiktokVideos?.vídeos}</p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "></div> }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-col h-full">
                    <div className="h-full shadow_hosting shadow_community overflow-hidden w-full bg-white rounded-2xl border border-gray-300 flex flex-col space-y-5 ">
                      <div className="flex gap-3 lg:gap-5 items-center">
                        <div className="flex flex-col w-full">
                          <div className="flex flex-col gap-0 p-6 text-black w-full">
                            <h2 className="uppercase font-bold text-lg lg:text-2xl">
                              INTERACCIONES
                            </h2>
                            {datos?.datos?.tiktokInteracciones?.megusta ? (
                              <div className="flex flex-col mt-4 lg:mt-10">
                                <p className="font-bold text-base lg:text-xl">
                                  Me gusta
                                </p>
                                <p>
                                  {datos?.datos?.tiktokInteracciones?.megusta}
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 lg:mt-10"></div> }
                            {datos?.datos?.tiktokInteracciones?.comentarios ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Comentarios
                                </p>
                                <p>
                                  {
                                    datos?.datos?.tiktokInteracciones
                                      ?.comentarios
                                  }
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "></div> }
                            {datos?.datos?.tiktokInteracciones?.compartidos ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Compartidos
                                </p>
                                <p>
                                  {
                                    datos?.datos?.tiktokInteracciones
                                      ?.compartidos
                                  }
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "> </div>}
                            {datos?.datos?.tiktokInteracciones?.vídeos ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Vídeos
                                </p>
                                <p>
                                  {datos?.datos?.tiktokInteracciones?.vídeos}
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "></div> }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full  flex flex-col absolute bottom-4 px-4 gap-4 lg:px-10 text-sm lg:text-base opacity-40">
                    <div className='grid grid-cols-3'>
                        <div className='w-full flex gap-3 items-center justify-center text-xl'>
                            <IoMailUnreadOutline className='text-3xl'/>
                            <span>ventas@logosperu.com</span>
                        </div>
                        <div className='w-full flex gap-3 items-center text-xl justify-center'>
                            <FiMapPin className='text-3xl'/>
                            <span>Jr. Tauro 883 Urb. Mercurio - Los olivos</span>
                        </div>
                        <div className='w-full flex gap-3 items-center text-xl justify-center'>
                            <FaWhatsapp className='text-3xl'/>
                            <span>Área de ventas (+51) 987 038 024</span>
                        </div>
                    </div>
                    <div className='flex gap-10 items-center'>
                        <span className='block w-[30%] bg-main h-2 rounded-lg'></span>
                        <span className='block w-[70%] bg-main h-2 rounded-lg'></span>
                    </div>
                </div>
              </div> : null }

              <div className="bg-white relative w-full  flex flex-col items-center mt-10 px-10 min-h-[350px] lg:min-h-[794px] py-10 rounded-md">
                 <img src={icono} alt="" className='absolute inset-0 w-[340px] h-[340px] object-contain m-auto opacity-10'/>

                <div className="w-full flex items-center gap-4 ">
                  <div className="bg-white border-black border rounded-md text-black shadow w-fit p-2 text-3xl">
                    <GiStarsStack />
                  </div>
                  <div className="w-full border-b border-black flex justify-between py-2 gap-4">
                    <h1 className="uppercase  font-semibold  text-black  text-2xl ">
                      LO MAS DESTACADO
                    </h1>
                  </div>
                </div>
                <div className="w-full grid grid-cols-1 gap-10 my-10">
                  {datos?.datos?.arrayDestacados?.map(
                    (destacado: any, index: number) => (
                      <div className="w-full flex flex-col" key={index}>
                        <div className="shadow_hosting shadow_community overflow-hidden w-full bg-white rounded-2xl border border-gray-300 flex flex-col space-y-5 ">
                          <div className="flex gap-5 items-center">
                            <div className="flex flex-col w-full p-6 min-h-[100px]">
                              <p>{destacado}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div className="w-full  flex flex-col absolute bottom-4 px-4 gap-4 lg:px-10 text-sm lg:text-base opacity-40">
                    <div className='grid grid-cols-3'>
                        <div className='w-full flex gap-3 items-center justify-center text-xl'>
                            <IoMailUnreadOutline className='text-3xl'/>
                            <span>ventas@logosperu.com</span>
                        </div>
                        <div className='w-full flex gap-3 items-center text-xl justify-center'>
                            <FiMapPin className='text-3xl'/>
                            <span>Jr. Tauro 883 Urb. Mercurio - Los olivos</span>
                        </div>
                        <div className='w-full flex gap-3 items-center text-xl justify-center'>
                            <FaWhatsapp className='text-3xl'/>
                            <span>Área de ventas (+51) 987 038 024</span>
                        </div>
                    </div>
                    <div className='flex gap-10 items-center'>
                        <span className='block w-[30%] bg-main h-2 rounded-lg'></span>
                        <span className='block w-[70%] bg-main h-2 rounded-lg'></span>
                    </div>
                </div>
              </div>

              <div className="bg-white relative w-full  flex flex-col items-center mt-10 px-10 min-h-[350px] lg:min-h-[794px] py-10 rounded-md">
              <img src={icono} alt="" className='absolute inset-0 w-[340px] h-[340px] object-contain m-auto opacity-10'/>

                <div className="w-full flex items-center gap-4 ">
                  <div className="bg-white border-black border rounded-md text-black shadow w-fit p-2 text-3xl">
                    <FaRegLightbulb />
                  </div>
                  <div className="w-full border-b border-black flex justify-between py-2 gap-4">
                    <h1 className="uppercase  font-semibold  text-black  text-2xl ">
                      Aprendizajes
                    </h1>
                  </div>
                </div>
                <div className="w-full grid grid-cols-1 gap-10 my-10">
                  {datos?.datos?.aprendizajes?.map(
                    (destacado: any, index: number) => (
                      <div className="w-full flex flex-col" key={index}>
                        <div className="shadow_hosting shadow_community overflow-hidden w-full bg-white rounded-2xl border border-gray-300 flex flex-col space-y-5 ">
                          <div className="flex gap-5 items-center">
                            <div className="flex flex-col w-full p-6 min-h-[100px]">
                              <p>{destacado}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div className="w-full  flex flex-col absolute bottom-4 px-4 gap-4 lg:px-10 text-sm lg:text-base opacity-40">
                    <div className='grid grid-cols-3'>
                        <div className='w-full flex gap-3 items-center justify-center text-xl'>
                            <IoMailUnreadOutline className='text-3xl'/>
                            <span>ventas@logosperu.com</span>
                        </div>
                        <div className='w-full flex gap-3 items-center text-xl justify-center'>
                            <FiMapPin className='text-3xl'/>
                            <span>Jr. Tauro 883 Urb. Mercurio - Los olivos</span>
                        </div>
                        <div className='w-full flex gap-3 items-center text-xl justify-center'>
                            <FaWhatsapp className='text-3xl'/>
                            <span>Área de ventas (+51) 987 038 024</span>
                        </div>
                    </div>
                    <div className='flex gap-10 items-center'>
                        <span className='block w-[30%] bg-main h-2 rounded-lg'></span>
                        <span className='block w-[70%] bg-main h-2 rounded-lg'></span>
                    </div>
                </div>
              </div>

              <div className="bg-white relative w-full  flex flex-col items-center mt-10 px-10 min-h-[350px] lg:min-h-[794px] py-10 rounded-md">
              <img src={icono} alt="" className='absolute inset-0 w-[340px] h-[340px] object-contain m-auto opacity-10'/>

                <div className="w-full flex items-center gap-4 ">
                  <div className="bg-white border-black border rounded-md text-black shadow w-fit p-2 text-3xl">
                    <FaArrowUpRightDots />
                  </div>
                  <div className="w-full border-b border-black flex justify-between py-2 gap-4">
                    <h1 className="uppercase  font-semibold  text-black  text-2xl ">
                      Retos
                    </h1>
                    {/* <p>Segun impresiones</p> */}
                  </div>
                </div>
                <div className="w-full grid grid-cols-1 gap-10 my-10">
                  {datos?.datos?.retos?.map((destacado: any, index: number) => (
                    <div className="w-full flex flex-col" key={index}>
                      <div className="shadow_hosting shadow_community overflow-hidden w-full bg-white rounded-2xl border border-gray-300 flex flex-col space-y-5 ">
                        <div className="flex gap-5 items-center">
                          <div className="flex flex-col w-full p-6 min-h-[100px]">
                            <p>{destacado}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="w-full  flex flex-col absolute bottom-4 px-4 gap-4 lg:px-10 text-sm lg:text-base opacity-40">
                    <div className='grid grid-cols-3'>
                        <div className='w-full flex gap-3 items-center justify-center text-xl'>
                            <IoMailUnreadOutline className='text-3xl'/>
                            <span>ventas@logosperu.com</span>
                        </div>
                        <div className='w-full flex gap-3 items-center text-xl justify-center'>
                            <FiMapPin className='text-3xl'/>
                            <span>Jr. Tauro 883 Urb. Mercurio - Los olivos</span>
                        </div>
                        <div className='w-full flex gap-3 items-center text-xl justify-center'>
                            <FaWhatsapp className='text-3xl'/>
                            <span>Área de ventas (+51) 987 038 024</span>
                        </div>
                    </div>
                    <div className='flex gap-10 items-center'>
                        <span className='block w-[30%] bg-main h-2 rounded-lg'></span>
                        <span className='block w-[70%] bg-main h-2 rounded-lg'></span>
                    </div>
                </div>
              </div>

              <div className="bg-[#18223C] relative w-full min-h-[350px] lg:min-h-[794px] flex flex-col items-centerjustify-between mt-10 py-20 rounded-md">
                <img
                  src={logo}
                  alt=""
                  className="w-full h-[300px] m-auto object-contain p-20"
                />
                <div className="w-full flex justify-between text-white absolute bottom-2 px-4">
                  <p className="">#logosperu</p>
                  <a
                    target="_blank"
                    href="https://logosperu.com.pe"
                    className="text-white"
                    rel="noreferrer"
                  >
                    www.logosperu.com.pe
                  </a>
                </div>
              </div>
            </section>

            <section
              className={`w-full ${loadingCanva ? 'block' : 'hidden'}`}
              id="contenido-html"
            >
              <div className="bg-[#18223C] w-full h-[350px] lg:min-h-[794px] flex flex-col items-center gap-10 lg:gap-20 justify-between lg:py-20 ">
                <img src={logo} alt="" className="w-[100px] lg:w-[200px]" />
                <h1 className="uppercase text-center text-main text-lg lg:text-6xl font-bold">
                  INFORME DE <br /> <span className='text-[#F5CA32]'>{datos?.marca}</span>
                </h1>
                <p className="uppercase text-center text-black text-sm lg:text-2xl font-normal w-fit lg:w-[400px] shadow_community bg-white px-3 pb-5 flex items-center justify-center rounded-md">
                    {datos?.datos?.fecha_texto}
                </p>
              </div>

              <div className="bg-white overflow-x-auto relative w-full min-h-[350px] py-10 lg:min-h-[794px] flex flex-col items-center  px-4 lg:px-10 ">
                <img src={icono} alt="" className='absolute inset-0 w-[340px] h-[340px] object-contain m-auto opacity-10'/>
                <div className="w-full flex items-center gap-2 lg:gap-4 mb-6 lg:mb-0">
                  <div className="bg-white border-black border rounded-md text-black shadow w-fit p-2 text-base lg:text-3xl">
                    <IoDocumentTextOutline />
                  </div>
                  <div className="w-full border-b border-black flex flex-col lg:flex-row lg:flex justify-between py-2 gap-2 lg:gap-4">
                    <h1 className="uppercase  font-semibold  text-black  text-sm lg:text-2xl ">
                      Resumen
                    </h1>
                    <p className="text-xs lg:text-base">
                      Seguidores, Impresiones, interacciones y publicaciones
                    </p>
                  </div>
                </div>
                <div className="hidden w-full lg:w-full lg:grid grid-cols-5 lg:grid-cols-9 mt-10">
                  <div className="w-full text-sm  bg-yellow-400 text-black font-bold lg:text-lg border border-black p-2">
                    <p>Canal</p>
                  </div>
                  <div className="w-full text-sm  lg:col-span-2 bg-yellow-400 text-black font-bold lg:text-lg border border-black p-2">
                    <p>Seguidores</p>
                  </div>
                  <div className="w-full text-sm  lg:col-span-2 bg-yellow-400 text-black font-bold lg:text-lg border border-black p-2">
                    <p>Impresiónes</p>
                  </div>
                  <div className="w-full text-sm  lg:col-span-2 bg-yellow-400 text-black font-bold lg:text-lg border border-black p-2">
                    <p>Interacciones</p>
                  </div>
                  <div className="w-full text-sm  lg:col-span-2 bg-yellow-400 text-black font-bold lg:text-lg border border-black p-2">
                    <p>N° Publicaciones</p>
                  </div>
                </div>

                <div className="w-full  lg:w-full grid grid-cols-1  lg:grid-cols-9">
                  <div className="w-full text-sm bg-yellow-400 text-black lg:text-lg border border-black p-2">
                    <p>Instagram</p>
                  </div>
                  {datos?.datos?.instagramPerfil?.seguidores ? (
                    <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2">
                      <p className="font-bold lg:hidden">Seguidores</p>
                      <p>{datos?.datos?.instagramPerfil?.seguidores}</p>
                    </div>
                  ) : <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2"> </div>}
                  {datos?.datos?.instagramPerfil?.impresiones ? (
                    <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2">
                      <p className="font-bold lg:hidden">Impresiónes</p>
                      <p>{datos?.datos?.instagramPerfil?.impresiones}</p>
                    </div>
                  ) : <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2"> </div>}
                  {datos?.datos?.instagramPosts?.interacciones ||
                    datos?.datos?.instagramReels?.interacciones ? (
                      <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2">
                        <p className="font-bold lg:hidden">Interacciones</p>
                        <p>
                          {Number(datos?.datos?.instagramPosts?.interacciones) +
                            Number(datos?.datos?.instagramReels?.interacciones)}
                        </p>
                      </div>
                      ) : <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2"> </div>}
                  {datos?.datos?.instagramPosts?.publicaciones ||
                    datos?.datos?.instagramReels?.reels ? (
                      <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2">
                        <p className="font-bold lg:hidden">N° Publicaciones</p>
                        <p>
                          {Number(datos?.datos?.instagramPosts.publicaciones) +
                            Number(datos?.datos?.instagramReels?.reels)}
                        </p>
                      </div>
                      ) : <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2"> </div>}
                </div>
                <div className="w-full  lg:w-full grid grid-cols-1  lg:grid-cols-9">
                  <div className="w-full text-sm bg-yellow-400 text-black lg:text-lg border border-black p-2">
                    <p>Facebook</p>
                  </div>
                  {datos?.datos?.facebookCrecimiento?.seguidores ? (
                    <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2">
                      <p className="font-bold lg:hidden">Seguidores</p>
                      <p>{datos?.datos?.facebookCrecimiento?.seguidores}</p>
                    </div>
                  ) : <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2"> </div> }
                  {datos?.datos?.facebookCrecimiento?.impresiones ? (
                    <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2">
                      <p className="font-bold lg:hidden">Impresiónes</p>
                      <p>{datos?.datos?.facebookCrecimiento?.impresiones}</p>
                    </div>
                  ) : <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2"> </div> }
                  {datos?.datos?.facebookPublicaciones?.interacciones ||
                    datos?.datos?.facebookReels?.interacciones ? (
                      <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2">
                        <p className="font-bold lg:hidden">Interacciones</p>
                        <p>
                          {Number(
                            datos?.datos?.facebookPublicaciones?.interacciones
                          ) +
                            Number(datos?.datos?.facebookReels?.interacciones)}
                        </p>
                      </div>
                      ) : <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2"> </div> }
                  {datos?.datos?.facebookPublicaciones?.publicaciones ||
                    datos?.datos?.facebookReels?.reels ? (
                      <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2">
                        <p className="font-bold lg:hidden">N° Publicaciones</p>
                        <p>
                          {Number(
                            datos?.datos?.facebookPublicaciones.publicaciones
                          ) + Number(datos?.datos?.facebookReels?.reels)}
                        </p>
                      </div>
                      ) : <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2"> </div> }
                </div>
                {datos?.datos?.tiktokComunidad?.seguidores || datos?.datos?.tiktokVideos?.visualizaciones || datos?.datos?.tiktokVideos?.interacciones || datos?.datos?.tiktokVideos?.vídeos
                  ? <div className="w-full  lg:w-full grid grid-cols-1  lg:grid-cols-9">
                  <div className="w-full text-sm bg-yellow-400 text-black lg:text-lg border border-black p-2">
                    <p>TikTok</p>
                  </div>
                  {datos?.datos?.tiktokComunidad?.seguidores ? (
                    <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2">
                      <p className="font-bold lg:hidden">Seguidores</p>
                      <p>{datos?.datos?.tiktokComunidad?.seguidores}</p>
                    </div>
                  ) : <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2"> </div> }
                  {datos?.datos?.tiktokVideos?.visualizaciones ? (
                    <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2">
                      <p className="font-bold lg:hidden">Impresiónes</p>
                      <p>{datos?.datos?.tiktokVideos?.visualizaciones}</p>
                    </div>
                  ) : <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2"> </div> }
                  {datos?.datos?.tiktokVideos?.interacciones ? (
                    <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2">
                      <p className="font-bold lg:hidden">Interacciones </p>
                      <p>{Number(datos?.datos?.tiktokVideos?.interacciones)}</p>
                    </div>
                  ) : <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2"> </div> }
                  {datos?.datos?.tiktokVideos?.vídeos ? (
                    <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2">
                      <p className="font-bold lg:hidden">N° Publicaciones</p>
                      <p>{Number(datos?.datos?.tiktokVideos.vídeos)}</p>
                    </div>
                  ) : <div className="w-full text-sm lg:col-span-2  text-black lg:text-lg border border-black p-2"> </div> }
                </div> : null }

                <div className="w-full flex justify-between absolute bottom-2 px-4 text-sm lg:text-base">
                  <p className="">#logosperu</p>
                  <a
                    target="_blank"
                    href="https://logosperu.com.pe"
                    className=""
                    rel="noreferrer"
                  >
                    www.logosperu.com.pe
                  </a>
                </div>
              </div>

              {/* TOP 3 PUBLICACIONES */}
              <div className="bg-white relative w-full  flex flex-col items-center min-h-[350px] py-10 lg:min-h-[794px] px-4 lg:px-10 p-4">
                <img src={icono} alt="" className='absolute inset-0 w-[340px] h-[340px] object-contain m-auto opacity-10'/>

                <div className="w-full flex items-center gap-2 lg:gap-4 mb-2 lg:mb-0">
                  <div className="bg-white border-black border rounded-md text-black shadow w-fit p-2 text-base lg:text-3xl">
                    <FaRegImages />
                  </div>
                  <div className="w-full border-b border-black flex flex-col lg:flex-row lg:flex justify-between py-2 gap-2 lg:gap-4">
                    <h1 className="uppercase  font-semibold  text-black  text-sm lg:text-2xl ">
                      TOP 3 PUBLICACIONES{' '}
                    </h1>
                    <p className="text-xs lg:text-base">Segun impresiones</p>
                  </div>
                </div>

                <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-4 mt-4 lg:mt-10">
                  {datos?.datos?.contenido.map((item: any, index: number) => (
                    <div className="w-full flex flex-col" key={index}>
                      <div className="shadow_hosting shadow_community overflow-hidden w-fit bg-[#3c70a6] rounded-2xl  flex flex-col space-y-5 ">
                        <div className="flex gap-3 items-center">
                          <div className="flex flex-col w-full">
                            <div className="flex gap-3 items-center text-white w-full">
                              {item.imagen ? (
                                <img
                                  src={`https://api.logosperu.com.pe/public/archivos_metricascm/${removePrefixBeforeUnderscore(
                                    item?.imagen.name
                                  )}`}
                                  alt=""
                                  className="w-[200px] lg:w-[350px] h-[200px] lg:h-[350px] object-cover"
                                />
                              ) : null }
                            </div>
                          </div>
                        </div>
                      </div>
                      <div className="w-full mt-3 flex flex-col gap-0 p-4">
                        <p className="uppercase font-bold text-black text-lg lg:text-2xl">
                          {item?.redSocial}
                        </p>
                        <p className="uppercase font-bold text-black text-sm lg:text-lg mt-3">
                          {item?.texto1}
                          {/* <span className="font-normal">137</span> */}
                        </p>
                        <p className="uppercase font-bold text-gray-500 text-xs lg:text-base">
                          {item?.fecha}
                        </p>
                        <p className="uppercase font-bold text-gray-700 mt-3 text-xs lg:text-base">
                          {item?.texto}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="w-full  flex flex-col absolute bottom-4 px-4 gap-4 lg:px-10 text-sm lg:text-base opacity-40">
                    <div className='grid grid-cols-3'>
                        <div className='w-full flex gap-3 items-center justify-center text-xl'>
                            <IoMailUnreadOutline className='text-3xl'/>
                            <span>ventas@logosperu.com</span>
                        </div>
                        <div className='w-full flex gap-3 items-center text-xl justify-center'>
                            <FiMapPin className='text-3xl'/>
                            <span>Jr. Tauro 883 Urb. Mercurio - Los olivos</span>
                        </div>
                        <div className='w-full flex gap-3 items-center text-xl justify-center'>
                            <FaWhatsapp className='text-3xl'/>
                            <span>Área de ventas (+51) 987 038 024</span>
                        </div>
                    </div>
                    <div className='flex gap-10 items-center'>
                        <span className='block w-[30%] bg-main h-2 rounded-lg'></span>
                        <span className='block w-[70%] bg-main h-2 rounded-lg'></span>
                    </div>
                </div>
              </div>
              {/* FACEBOOK */}
              <div className="bg-white relative w-full  flex flex-col items-center min-h-[350px] py-10 lg:min-h-[794px] px-4 lg:px-10 ">
                <img src={icono} alt="" className='absolute inset-0 w-[340px] h-[340px] object-contain m-auto opacity-10'/>

                <div className="w-full flex items-center gap-4 ">
                  <div className="bg-white border-black border rounded-md text-black shadow w-fit p-2 text-lg lg:text-3xl">
                    <FaFacebookF />
                  </div>
                  <div className="w-full border-b border-black flex justify-between py-2 gap-4">
                    <h1 className="uppercase  font-semibold  text-black  text-base lg:text-2xl ">
                      Facebook
                    </h1>
                    {/* <p>Segun impresiones</p> */}
                  </div>
                </div>
                <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-10 px-4 lg:gap-10 my-10">
                  <div className="w-full flex flex-col">
                    <div className="shadow_hosting shadow_community overflow-hidden w-full bg-white rounded-2xl border border-gray-300 flex flex-col space-y-5 ">
                      <div className="flex gap-3 lg:gap-5 items-center">
                        <div className="flex flex-col w-full">
                          <div className="flex flex-col gap-0 p-6 text-black w-full">
                            <h2 className="uppercase font-bold text-lg lg:text-2xl">
                              CRECIMIENTO
                            </h2>
                            {datos?.datos?.facebookCrecimiento?.megusta ? (
                              <div className="flex flex-col mt-4 lg:mt-10">
                                <p className="font-bold text-base lg:text-xl">
                                  Me gustas
                                </p>
                                <p>
                                  {datos?.datos?.facebookCrecimiento?.megusta}
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 lg:mt-10"> </div>}
                            {datos?.datos?.facebookCrecimiento?.seguidores ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Seguidores
                                </p>
                                <p>
                                  {
                                    datos?.datos?.facebookCrecimiento
                                      ?.seguidores
                                  }
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "></div> }
                            {datos?.datos?.facebookCrecimiento?.impresiones ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Impresiones
                                </p>
                                <p>
                                  {
                                    datos?.datos?.facebookCrecimiento
                                      ?.impresiones
                                  }
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "></div> }
                            {datos?.datos?.facebookCrecimiento?.visitas ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Visitas a la pagina
                                </p>
                                <p>
                                  {datos?.datos?.facebookCrecimiento?.visitas}
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "></div> }
                            {datos?.datos?.facebookCrecimiento
                              ?.publicaciones ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Publicaciones
                                </p>
                                <p>
                                  {
                                    datos?.datos?.facebookCrecimiento
                                      ?.publicaciones
                                  }
                                </p>
                              </div>
                                ) : <div className="flex flex-col mt-4 "> </div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-col h-full">
                    <div className="h-full shadow_hosting shadow_community overflow-hidden w-full bg-white rounded-2xl border border-gray-300 flex flex-col space-y-5 ">
                      <div className="flex gap-3 lg:gap-5 items-center">
                        <div className="flex flex-col w-full">
                          <div className="flex flex-col gap-0 p-6 text-black w-full">
                            <h2 className="uppercase font-bold text-lg lg:text-2xl">
                              PUBLICACIONES
                            </h2>
                            {datos?.datos?.facebookPublicaciones
                              ?.interacciones ? (
                              <div className="flex flex-col mt-4 lg:mt-10">
                                <p className="font-bold text-base lg:text-xl">
                                  Interacciones
                                </p>
                                <p>
                                  {
                                    datos?.datos?.facebookPublicaciones
                                      ?.interacciones
                                  }
                                </p>
                              </div>
                                ) : <div className="flex flex-col mt-4 lg:mt-10"></div> }
                            {datos?.datos?.facebookPublicaciones?.alcance ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Alcance
                                </p>
                                <p>
                                  {datos?.datos?.facebookPublicaciones?.alcance}
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "></div> }
                            {datos?.datos?.facebookPublicaciones
                              ?.impresiones ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Impresiones
                                </p>
                                <p>
                                  {
                                    datos?.datos?.facebookPublicaciones
                                      ?.impresiones
                                  }
                                </p>
                              </div>
                                ) : <div className="flex flex-col mt-4 "></div> }
                            {datos?.datos?.facebookPublicaciones
                              ?.publicaciones ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Publicaciones
                                </p>
                                <p>
                                  {
                                    datos?.datos?.facebookPublicaciones
                                      ?.publicaciones
                                  }
                                </p>
                              </div>
                                ) : <div className="flex flex-col mt-4 "> </div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {datos?.datos?.facebookReels?.interacciones || datos?.datos?.facebookReels?.alcance || datos?.datos?.facebookReels?.visualizaciones || datos?.datos?.facebookReels?.reels
                    ? <div className="w-full flex flex-col h-full">
                    <div className="h-full shadow_hosting shadow_community overflow-hidden w-full bg-white rounded-2xl border border-gray-300 flex flex-col space-y-5 ">
                      <div className="flex gap-3 lg:gap-5 items-center">
                        <div className="flex flex-col w-full">
                          <div className="flex flex-col gap-0 p-6 text-black w-full">
                            <h2 className="uppercase font-bold text-lg lg:text-2xl">
                              REELS
                            </h2>
                            {datos?.datos?.facebookReels?.interacciones ? (
                              <div className="flex flex-col mt-4 lg:mt-10">
                                <p className="font-bold text-base lg:text-xl">
                                  Interacciones
                                </p>
                                <p>
                                  {datos?.datos?.facebookReels?.interacciones}
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 lg:mt-10"> </div>}
                            {datos?.datos?.facebookReels?.alcance ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Alcance
                                </p>
                                <p>{datos?.datos?.facebookReels?.alcance}</p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "> </div>}
                            {datos?.datos?.facebookReels?.visualizaciones ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Visualizaciones
                                </p>
                                <p>
                                  {datos?.datos?.facebookReels?.visualizaciones}
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "></div> }
                            {datos?.datos?.facebookReels?.reels ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Reels
                                </p>
                                <p>{datos?.datos?.facebookReels?.reels}</p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "></div> }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> : null }
                </div>
                <div className="w-full  flex flex-col absolute bottom-4 px-4 gap-4 lg:px-10 text-sm lg:text-base opacity-40">
                    <div className='grid grid-cols-3'>
                        <div className='w-full flex gap-3 items-center justify-center text-xl'>
                            <IoMailUnreadOutline className='text-3xl'/>
                            <span>ventas@logosperu.com</span>
                        </div>
                        <div className='w-full flex gap-3 items-center text-xl justify-center'>
                            <FiMapPin className='text-3xl'/>
                            <span>Jr. Tauro 883 Urb. Mercurio - Los olivos</span>
                        </div>
                        <div className='w-full flex gap-3 items-center text-xl justify-center'>
                            <FaWhatsapp className='text-3xl'/>
                            <span>Área de ventas (+51) 987 038 024</span>
                        </div>
                    </div>
                    <div className='flex gap-10 items-center'>
                        <span className='block w-[30%] bg-main h-2 rounded-lg'></span>
                        <span className='block w-[70%] bg-main h-2 rounded-lg'></span>
                    </div>
                </div>
              </div>
              {/* INSTAGRAM */}
              <div className="bg-white relative w-full  flex flex-col items-center px-4 min-h-[350px] py-10 lg:min-h-[794px] lg:px-10 ">
                <img src={icono} alt="" className='absolute inset-0 w-[340px] h-[340px] object-contain m-auto opacity-10'/>

                <div className="w-full flex items-center gap-4 ">
                  <div className="bg-white border-black border rounded-md text-black shadow w-fit p-2 text-lg lg:text-3xl">
                    <FaInstagram />
                  </div>
                  <div className="w-full border-b border-black flex justify-between py-2 gap-4">
                    <h1 className="uppercase  font-semibold  text-black  text-base lg:text-2xl ">
                      INSTAGRAM
                    </h1>
                  </div>
                </div>
                <div className="w-full grid grid-cols-1 lg:grid-cols-3 gap-10 px-4 lg:gap-10 my-10">
                  <div className="h-full w-full flex flex-col">
                    <div className="h-full shadow_hosting shadow_community overflow-hidden w-full bg-white rounded-2xl border border-gray-300 flex flex-col space-y-5 ">
                      <div className="flex gap-3 lg:gap-5 items-center">
                        <div className="flex flex-col w-full">
                          <div className="flex flex-col gap-0 p-6 text-black w-full">
                            <h2 className="uppercase font-bold text-lg lg:text-2xl">
                              Perfil
                            </h2>
                            {datos?.datos?.instagramPerfil?.alcance ? (
                              <div className="flex flex-col mt-4 lg:mt-10">
                                <p className="font-bold text-base lg:text-xl">
                                  Alcance
                                </p>
                                <p>{datos?.datos?.instagramPerfil?.alcance}</p>
                              </div>
                            ) : <div className="flex flex-col mt-4 lg:mt-10"></div> }
                            {datos?.datos?.instagramPerfil?.visitaperfil ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Visitas al Perfil
                                </p>
                                <p>
                                  {datos?.datos?.instagramPerfil?.visitaperfil}
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "> </div>}
                            {datos?.datos?.instagramPerfil?.publicaciones ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Publicaciones
                                </p>
                                <p>
                                  {datos?.datos?.instagramPerfil?.publicaciones}
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "> </div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-col h-full">
                    <div className="h-full shadow_hosting shadow_community overflow-hidden w-full bg-white rounded-2xl border border-gray-300 flex flex-col space-y-5 ">
                      <div className="flex gap-3 lg:gap-5 items-center">
                        <div className="flex flex-col w-full">
                          <div className="flex flex-col gap-0 p-6 text-black w-full">
                            <h2 className="uppercase font-bold text-lg lg:text-2xl">
                              POSTS
                            </h2>
                            {datos?.datos?.instagramPosts?.interacciones ? (
                              <div className="flex flex-col mt-4 lg:mt-10">
                                <p className="font-bold text-base lg:text-xl">
                                  Interacciones
                                </p>
                                <p>
                                  {datos?.datos?.instagramPosts?.interacciones}
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 lg:mt-10"> </div>}
                            {datos?.datos?.instagramPosts?.alcance ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Alcance
                                </p>
                                <p>{datos?.datos?.instagramPosts?.alcance}</p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "> </div> }
                            {datos?.datos?.instagramPosts?.publicaciones ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Publicaciones
                                </p>
                                <p>
                                  {datos?.datos?.instagramPosts?.publicaciones}
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "> </div> }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {datos?.datos?.instagramReels?.interacciones || datos?.datos?.instagramReels?.alcance || datos?.datos?.instagramReels?.reels
                    ? <div className="w-full flex flex-col h-full">
                    <div className="h-full shadow_hosting shadow_community overflow-hidden w-full bg-white rounded-2xl border border-gray-300 flex flex-col space-y-5 ">
                      <div className="flex gap-3 lg:gap-5 items-center">
                        <div className="flex flex-col w-full">
                          <div className="flex flex-col gap-0 p-6 text-black w-full">
                            <h2 className="uppercase font-bold text-lg lg:text-2xl">
                              REELS
                            </h2>
                            {datos?.datos?.instagramReels?.interacciones ? (
                              <div className="flex flex-col mt-4 lg:mt-10">
                                <p className="font-bold text-base lg:text-xl">
                                  Interacciones
                                </p>
                                <p>
                                  {datos?.datos?.instagramReels?.interacciones}
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 lg:mt-10"> </div>}
                            {datos?.datos?.instagramReels?.alcance ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Alcance
                                </p>
                                <p>{datos?.datos?.instagramReels?.alcance}</p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "> </div> }
                            {datos?.datos?.instagramReels?.reels ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Reels
                                </p>
                                <p>{datos?.datos?.instagramReels?.reels}</p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "> </div> }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div> : null }
                </div>
                <div className="w-full  flex flex-col absolute bottom-4 px-4 gap-4 lg:px-10 text-sm lg:text-base opacity-40">
                    <div className='grid grid-cols-3'>
                        <div className='w-full flex gap-3 items-center justify-center text-xl'>
                            <IoMailUnreadOutline className='text-3xl'/>
                            <span>ventas@logosperu.com</span>
                        </div>
                        <div className='w-full flex gap-3 items-center text-xl justify-center'>
                            <FiMapPin className='text-3xl'/>
                            <span>Jr. Tauro 883 Urb. Mercurio - Los olivos</span>
                        </div>
                        <div className='w-full flex gap-3 items-center text-xl justify-center'>
                            <FaWhatsapp className='text-3xl'/>
                            <span>Área de ventas (+51) 987 038 024</span>
                        </div>
                    </div>
                    <div className='flex gap-10 items-center'>
                        <span className='block w-[30%] bg-main h-2 rounded-lg'></span>
                        <span className='block w-[70%] bg-main h-2 rounded-lg'></span>
                    </div>
                </div>
              </div>
              {/* TIKTOK */}
              {datos?.datos?.tiktokComunidad?.seguidores || datos?.datos?.tiktokComunidad?.videos

                ? <div className="bg-white relative w-full  flex flex-col items-center px-4 min-h-[350px] py-10 lg:min-h-[794px] lg:px-10 ">
                <img src={icono} alt="" className='absolute inset-0 w-[340px] h-[340px] object-contain m-auto opacity-10'/>

                <div className="w-full flex items-center gap-4 ">
                  <div className="bg-white border-black border rounded-md text-black shadow w-fit p-2 text-lg lg:text-3xl">
                    <FaTiktok />
                  </div>
                  <div className="w-full border-b border-black flex justify-between py-2 gap-4">
                    <h1 className="uppercase  font-semibold  text-black  text-base lg:text-2xl ">
                      TIK TOK
                    </h1>
                    {/* <p>Segun impresiones</p> */}
                  </div>
                </div>
                <div className="w-full grid grid-cols-1 lg:grid-cols-4 gap-10 px-4 lg:gap-5 my-10">
                  <div className="w-full h-full flex flex-col">
                    <div className="shadow_hosting h-full shadow_community overflow-hidden w-full bg-white rounded-2xl border border-gray-300 flex flex-col space-y-5 ">
                      <div className="flex gap-3 lg:gap-5 items-center">
                        <div className="flex flex-col w-full">
                          <div className="flex flex-col gap-0 p-6 text-black w-full">
                            <h2 className="uppercase font-bold text-lg lg:text-2xl">
                              CRECIMIENTO
                            </h2>
                            {datos?.datos?.tiktokComunidad?.seguidores ? (
                              <div className="flex flex-col mt-4 lg:mt-10">
                                <p className="font-bold text-base lg:text-xl">
                                  Seguidores
                                </p>
                                <p>
                                  {datos?.datos?.tiktokComunidad?.seguidores}
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 lg:mt-10"> </div>}
                            {datos?.datos?.tiktokComunidad?.videos ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Videos
                                </p>
                                <p>{datos?.datos?.tiktokComunidad?.videos}</p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "></div> }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-col h-full">
                    <div className="h-full shadow_hosting shadow_community overflow-hidden w-full bg-white rounded-2xl border border-gray-300 flex flex-col space-y-5 ">
                      <div className="flex gap-3 lg:gap-5 items-center">
                        <div className="flex flex-col w-full">
                          <div className="flex flex-col gap-0 p-6 text-black w-full">
                            <h2 className="uppercase font-bold text-lg lg:text-2xl">
                              PUBLICACIONES
                            </h2>
                            {datos?.datos?.tiktokPerfil?.visitas ? (
                              <div className="flex flex-col mt-4 lg:mt-10">
                                <p className="font-bold text-base lg:text-xl">
                                  Visitas
                                </p>
                                <p>{datos?.datos?.tiktokPerfil?.visitas}</p>
                              </div>
                            ) : <div className="flex flex-col mt-4 lg:mt-10"> </div>}
                            {datos?.datos?.tiktokPerfil?.videos ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Videos
                                </p>
                                <p>{datos?.datos?.tiktokPerfil?.videos}</p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "></div> }
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-col h-full">
                    <div className="h-full shadow_hosting shadow_community overflow-hidden w-full bg-white rounded-2xl border border-gray-300 flex flex-col space-y-5 ">
                      <div className="flex gap-3 lg:gap-5 items-center">
                        <div className="flex flex-col w-full">
                          <div className="flex flex-col gap-0 p-6 text-black w-full">
                            <h2 className="uppercase font-bold text-lg lg:text-2xl">
                              VIDEOS
                            </h2>
                            {datos?.datos?.tiktokVideos?.interacciones ? (
                              <div className="flex flex-col mt-4 lg:mt-10">
                                <p className="font-bold text-base lg:text-xl">
                                  Interacciones
                                </p>
                                <p>
                                  {datos?.datos?.tiktokVideos?.interacciones}
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 lg:mt-10"> </div>}
                            {datos?.datos?.tiktokVideos?.alcance ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Alcance
                                </p>
                                <p>{datos?.datos?.tiktokVideos?.alcance}</p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "> </div>}
                            {datos?.datos?.tiktokVideos?.visualizaciones ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Visualizaciones
                                </p>
                                <p>
                                  {datos?.datos?.tiktokVideos?.visualizaciones}
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "> </div>}
                            {datos?.datos?.tiktokVideos?.vídeos ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  vídeos
                                </p>
                                <p>{datos?.datos?.tiktokVideos?.vídeos}</p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "> </div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="w-full flex flex-col h-full">
                    <div className="h-full shadow_hosting shadow_community overflow-hidden w-full bg-white rounded-2xl border border-gray-300 flex flex-col space-y-5 ">
                      <div className="flex gap-3 lg:gap-5 items-center">
                        <div className="flex flex-col w-full">
                          <div className="flex flex-col gap-0 p-6 text-black w-full">
                            <h2 className="uppercase font-bold text-lg lg:text-2xl">
                              INTERACCIONES
                            </h2>
                            {datos?.datos?.tiktokInteracciones?.megusta ? (
                              <div className="flex flex-col mt-4 lg:mt-10">
                                <p className="font-bold text-base lg:text-xl">
                                  Me gusta
                                </p>
                                <p>
                                  {datos?.datos?.tiktokInteracciones?.megusta}
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 lg:mt-10"> </div>}
                            {datos?.datos?.tiktokInteracciones?.comentarios ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Comentarios
                                </p>
                                <p>
                                  {
                                    datos?.datos?.tiktokInteracciones
                                      ?.comentarios
                                  }
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "></div>}
                            {datos?.datos?.tiktokInteracciones?.compartidos ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Compartidos
                                </p>
                                <p>
                                  {
                                    datos?.datos?.tiktokInteracciones
                                      ?.compartidos
                                  }
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "> </div>}
                            {datos?.datos?.tiktokInteracciones?.vídeos ? (
                              <div className="flex flex-col mt-4 ">
                                <p className="font-bold text-base lg:text-xl">
                                  Vídeos
                                </p>
                                <p>
                                  {datos?.datos?.tiktokInteracciones?.vídeos}
                                </p>
                              </div>
                            ) : <div className="flex flex-col mt-4 "> </div>}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full  flex flex-col absolute bottom-4 px-4 gap-4 lg:px-10 text-sm lg:text-base opacity-40">
                    <div className='grid grid-cols-3'>
                        <div className='w-full flex gap-3 items-center justify-center text-xl'>
                            <IoMailUnreadOutline className='text-3xl'/>
                            <span>ventas@logosperu.com</span>
                        </div>
                        <div className='w-full flex gap-3 items-center text-xl justify-center'>
                            <FiMapPin className='text-3xl'/>
                            <span>Jr. Tauro 883 Urb. Mercurio - Los olivos</span>
                        </div>
                        <div className='w-full flex gap-3 items-center text-xl justify-center'>
                            <FaWhatsapp className='text-3xl'/>
                            <span>Área de ventas (+51) 987 038 024</span>
                        </div>
                    </div>
                    <div className='flex gap-10 items-center'>
                        <span className='block w-[30%] bg-main h-2 rounded-lg'></span>
                        <span className='block w-[70%] bg-main h-2 rounded-lg'></span>
                    </div>
                </div>
              </div> : null }

              <div className="bg-white relative w-full  flex flex-col items-center px-10 min-h-[350px] py-10 lg:min-h-[794px] rounded-md">
                <img src={icono} alt="" className='absolute inset-0 w-[340px] h-[340px] object-contain m-auto opacity-10'/>

                <div className="w-full flex items-center gap-4 ">
                  <div className="bg-white border-black border rounded-md text-black shadow w-fit p-2 text-3xl">
                    <GiStarsStack />
                  </div>
                  <div className="w-full border-b border-black flex justify-between py-2 gap-4">
                    <h1 className="uppercase  font-semibold  text-black  text-2xl ">
                      LO MAS DESTACADO
                    </h1>
                  </div>
                </div>
                <div className="w-full grid grid-cols-1 gap-10 my-10">
                  {datos?.datos?.arrayDestacados?.map(
                    (destacado: any, index: number) => (
                      <div className="w-full flex flex-col" key={index}>
                        <div className="shadow_hosting shadow_community overflow-hidden w-full bg-white rounded-2xl border border-gray-500 flex flex-col space-y-5 ">
                          <div className="flex gap-5 items-center">
                            <div className="flex flex-col w-full p-6 min-h-[100px] text-black">
                              <p>{destacado}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div className="w-full  flex flex-col absolute bottom-4 px-4 gap-4 lg:px-10 text-sm lg:text-base opacity-40">
                    <div className='grid grid-cols-3'>
                        <div className='w-full flex gap-3 items-center justify-center text-xl'>
                            <IoMailUnreadOutline className='text-3xl'/>
                            <span>ventas@logosperu.com</span>
                        </div>
                        <div className='w-full flex gap-3 items-center text-xl justify-center'>
                            <FiMapPin className='text-3xl'/>
                            <span>Jr. Tauro 883 Urb. Mercurio - Los olivos</span>
                        </div>
                        <div className='w-full flex gap-3 items-center text-xl justify-center'>
                            <FaWhatsapp className='text-3xl'/>
                            <span>Área de ventas (+51) 987 038 024</span>
                        </div>
                    </div>
                    <div className='flex gap-10 items-center'>
                        <span className='block w-[30%] bg-main h-2 rounded-lg'></span>
                        <span className='block w-[70%] bg-main h-2 rounded-lg'></span>
                    </div>
                </div>
              </div>

              <div className="bg-white relative w-full  flex flex-col items-center px-10 min-h-[350px] py-10 lg:min-h-[794px] rounded-md">
                <img src={icono} alt="" className='absolute inset-0 w-[340px] h-[340px] object-contain m-auto opacity-10'/>

                <div className="w-full flex items-center gap-4 ">
                  <div className="bg-white border-black border rounded-md text-black shadow w-fit p-2 text-3xl">
                    <FaRegLightbulb />
                  </div>
                  <div className="w-full border-b border-black flex justify-between py-2 gap-4">
                    <h1 className="uppercase  font-semibold  text-black  text-2xl ">
                      Aprendizajes
                    </h1>
                  </div>
                </div>
                <div className="w-full grid grid-cols-1 gap-10 my-10">
                  {datos?.datos?.aprendizajes?.map(
                    (destacado: any, index: number) => (
                      <div className="w-full flex flex-col" key={index}>
                        <div className="shadow_hosting shadow_community overflow-hidden w-full bg-white rounded-2xl border border-gray-500 flex flex-col space-y-5 ">
                          <div className="flex gap-5 items-center">
                            <div className="flex flex-col w-full p-6 min-h-[100px] text-gray-500">
                              <p>{destacado}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
                <div className="w-full  flex flex-col absolute bottom-4 px-4 gap-4 lg:px-10 text-sm lg:text-base opacity-40">
                    <div className='grid grid-cols-3'>
                        <div className='w-full flex gap-3 items-center justify-center text-xl'>
                            <IoMailUnreadOutline className='text-3xl'/>
                            <span>ventas@logosperu.com</span>
                        </div>
                        <div className='w-full flex gap-3 items-center text-xl justify-center'>
                            <FiMapPin className='text-3xl'/>
                            <span>Jr. Tauro 883 Urb. Mercurio - Los olivos</span>
                        </div>
                        <div className='w-full flex gap-3 items-center text-xl justify-center'>
                            <FaWhatsapp className='text-3xl'/>
                            <span>Área de ventas (+51) 987 038 024</span>
                        </div>
                    </div>
                    <div className='flex gap-10 items-center'>
                        <span className='block w-[30%] bg-main h-2 rounded-lg'></span>
                        <span className='block w-[70%] bg-main h-2 rounded-lg'></span>
                    </div>
                </div>
              </div>

              <div className="bg-white relative w-full  flex flex-col items-center px-10 min-h-[350px] py-10 lg:min-h-[794px] rounded-md">
                <img src={icono} alt="" className='absolute inset-0 w-[340px] h-[340px] object-contain m-auto opacity-10'/>

                <div className="w-full flex items-center gap-4 ">
                  <div className="bg-white border-black border rounded-md text-black shadow w-fit p-2 text-3xl">
                    <FaArrowUpRightDots />
                  </div>
                  <div className="w-full border-b border-black flex justify-between py-2 gap-4">
                    <h1 className="uppercase  font-semibold  text-black  text-2xl ">
                      Retos
                    </h1>
                    {/* <p>Segun impresiones</p> */}
                  </div>
                </div>
                <div className="w-full grid grid-cols-1 gap-10 my-10">
                  {datos?.datos?.retos?.map((destacado: any, index: number) => (
                    <div className="w-full flex flex-col" key={index}>
                      <div className="shadow_hosting shadow_community overflow-hidden w-full bg-white rounded-2xl border border-gray-500 flex flex-col space-y-5 ">
                        <div className="flex gap-5 items-center">
                          <div className="flex flex-col w-full p-6 min-h-[100px] text-gray-500">
                            <p>{destacado}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#18223C] relative w-full min-h-[350px] lg:min-h-[794px] flex flex-col items-centerjustify-between py-20 ">

                <img
                  src={logo}
                  alt=""
                  className="w-[500px] h-[400px] m-auto object-contain p-20"
                />
                <div className="w-full flex justify-between text-white absolute bottom-2 px-4">
                  <p className="">#logosperu</p>
                  <a
                    target="_blank"
                    href="https://logosperu.com.pe"
                    className="text-white"
                    rel="noreferrer"
                  >
                    www.logosperu.com.pe
                  </a>
                </div>
              </div>
            </section>
          </div>
          <ModalEdicion
            open={open}
            setOpen={setOpen}
            datos={datos}
            selectedMonth={selectedMonth}
            selectedYear={selectedYear}
            getInformacion={getInformacion}
          />
        </>
      )}
    </>
  )
}
