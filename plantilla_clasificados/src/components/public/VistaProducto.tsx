// import { FreeMode, Thumbs, Autoplay } from 'swiper'
// import { useEffect, useState } from 'react'
// import { Swiper, SwiperSlide } from 'swiper/react'
// import 'swiper/css'
// import 'swiper/css/free-mode'
// import 'swiper/css/navigation'
// import 'swiper/css/thumbs'
// import { type SwiperOptions } from 'swiper/types'
// import { Global } from '../../helper/Global'
// import { FaMinus, FaPlus } from 'react-icons/fa6'
// import { AddProducto } from './carrito/AddProducto'
// import { type productosValues } from '../shared/interface'
// import axios from 'axios'
// import { useParams } from 'react-router-dom'
// import SwiperProductos from './modals/SwiperProductos'
// import Loading from './Loading'

// export const VistaProducto = (): JSX.Element => {
//   const { id } = useParams()
//   const [thumbsSwiper, setThumbsSwiper] = useState<
//   SwiperOptions | null | undefined
//   >(null)
//   const [cantidad, setCantidad] = useState(1)
//   const [inputCantidad, setInputCantidad] = useState('1')
//   const [loadingComponents, setLoadingComponents] = useState(true)
//   const handleInputChange = (event: any): void => {
//     const nuevoValor = event.target.value.replace(/\D/, '')
//     const nuevaCantidad = Math.max(parseInt(nuevoValor, 10) || 1, 1)

//     setInputCantidad(nuevaCantidad.toString())
//     setCantidad(nuevaCantidad)
//   }
//   const [producto, setProducto] = useState<productosValues>({
//     id: 0,
//     imagen1: '',
//     imagen2: '',
//     imagen3: '',
//     subcategoria: '',
//     marca: '',
//     id_marca: '',
//     caracteristicas: '',
//     categoria: '',
//     codigo: '',
//     nombre: '',
//     especificaciones: '',
//     id_categoria: 0,
//     id_subcategoria: '',
//     precio: 0
//   })
//   const [productos, setProductos] = useState([])
//   const aumentar = (): void => {
//     setCantidad(cantidad + 1)
//     setInputCantidad((cantidad + 1).toString())
//   }

//   const disminuir = (): void => {
//     if (cantidad > 1) {
//       setCantidad(cantidad - 1)
//       setInputCantidad((cantidad - 1).toString())
//     }
//   }

//   const getOneProducto = async (): Promise<void> => {
//     setLoadingComponents(true)
//     const request = await axios.get(`${Global.url}/oneProducto/${id ?? ''}`)
//     setProducto(request.data[0])
//     // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
//     setLoadingComponents(false)
//   }

//   useEffect(() => {
//     if (id) {
//       window.scrollTo(0, 0)
//       getOneProducto()
//     }
//   }, [id])

//   const getData = async (
//     ruta: string,
//     setDatos: React.Dispatch<React.SetStateAction<never[]>>
//   ): Promise<void> => {
//     try {
//       const request = await axios.get(`${Global.url}/${ruta}`)
//       setDatos(request.data)
//     } catch (error) {
//       console.log(error)
//     }
//   }

//   useEffect(() => {
//     window.scrollTo(0, 0)
//     Promise.all([getData('allProductos', setProductos)]).then(() => {})
//   }, [])

//   return (
//     <>
//       {loadingComponents && <Loading />}
//       <section className="relative max-w-[1450px] mx-auto pt-[80px] md:pt-0">
//         <div className="w-full flex flex-col px-4 md:px-12 pt-4 py-12 xs:pt-12">
//           <div className="w-full flex flex-col lg:flex-row">
//             <div className="w-full lg:w-1/2">
//               <div className="flex flex-col md:flex-row-reverse gap-4 md:gap-1">
//                 <Swiper
//                   // style={swiperStyles}
//                   loop={true}
//                   spaceBetween={10}
//                   autoplay={{
//                     delay: 7000,
//                     disableOnInteraction: false
//                   }}
//                   // </div>eslint-disable-next-line @typescript-eslint/ban-ts-comment
//                   // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//                   // @ts-expect-error
//                   thumbs={{ swiper: thumbsSwiper }}
//                   modules={[FreeMode, Thumbs, Autoplay]}
//                   className="w-full relative h-[500px]"
//                 >
//                   <SwiperSlide>
//                     <button
//                       type="button"
//                       className="flex items-center justify-center w-full h-full"
//                     >
//                       <img
//                         src={`${Global.urlImages}/productos/${
//                           producto?.imagen1 ?? ''
//                         }`}
//                         className="w-full h-full object-contain"
//                       />
//                     </button>
//                   </SwiperSlide>
//                   {producto?.imagen2 && (
//                     <SwiperSlide>
//                       <button
//                         type="button"
//                         className="flex items-center justify-center w-full h-full"
//                       >
//                         <img
//                           src={`${Global.urlImages}/productos/${
//                             producto?.imagen2 ?? ''
//                           }`}
//                           className="w-full h-full object-contain"
//                         />
//                       </button>
//                     </SwiperSlide>
//                   )}
//                   {producto?.imagen3 && (
//                     <SwiperSlide>
//                       <button
//                         type="button"
//                         className="flex items-center justify-center w-full h-full"
//                       >
//                         <img
//                           src={`${Global.urlImages}/productos/${
//                             producto?.imagen3 ?? ''
//                           }`}
//                           className="w-full h-full object-contain"
//                         />
//                       </button>
//                     </SwiperSlide>
//                   )}
//                 </Swiper>
//                 <div className="w-full md:w-[20%] h-[60px] md:h-full flex justify-center items-center">
//                   <Swiper
//                     // eslint-disable-next-line @typescript-eslint/ban-ts-comment
//                     // @ts-expect-error
//                     onSwiper={setThumbsSwiper}
//                     loop={true}
//                     spaceBetween={10}
//                     slidesPerView={3}
//                     freeMode={true}
//                     direction="vertical"
//                     autoplay={{
//                       delay: 7000,
//                       disableOnInteraction: false
//                     }}
//                     watchSlidesProgress={true}
//                     modules={[FreeMode, Thumbs, Autoplay]}
//                     className="w-full md:h-[500px] mx-auto"
//                     breakpoints={{
//                       0: {
//                         direction: 'horizontal',
//                         slidesPerView: 3
//                       },
//                       576: {
//                         direction: 'horizontal',
//                         slidesPerView: 3
//                       },
//                       768: {
//                         direction: 'horizontal',
//                         slidesPerView: 3
//                       },
//                       960: {
//                         direction: 'vertical'
//                       },
//                       1200: {}
//                     }}
//                   >
//                     <SwiperSlide className="h-full flex items-center justify-center border border-gray-300">
//                       <img
//                         src={`${Global.urlImages}/productos/${
//                           producto?.imagen1 ?? ''
//                         }`}
//                         className="cursor-pointer object-contain block h-[90%]"
//                         loading="lazy"
//                         decoding="async"
//                       />
//                     </SwiperSlide>
//                     {producto?.imagen2 && (
//                       <SwiperSlide className="h-full flex items-center justify-center border border-gray-300">
//                         <img
//                           src={`${Global.urlImages}/productos/${
//                             producto?.imagen2 ?? ''
//                           }`}
//                           className="cursor-pointer object-contain block h-[90%]"
//                           loading="lazy"
//                           decoding="async"
//                         />
//                       </SwiperSlide>
//                     )}
//                     {producto?.imagen3 && (
//                       <SwiperSlide className="h-full flex items-center justify-center border border-gray-300">
//                         <img
//                           src={`${Global.urlImages}/productos/${
//                             producto?.imagen3 ?? ''
//                           }`}
//                           className="cursor-pointer object-contain block h-[90%]"
//                           loading="lazy"
//                           decoding="async"
//                         />
//                       </SwiperSlide>
//                     )}
//                   </Swiper>
//                 </div>
//               </div>
//             </div>
//             <div className="w-full lg:w-1/2 px-0 py-10 md:px-12 mt-10 lg:mt-0">
//               <h1 className="text-2xl md:text-4xl text-secondary mb-2">
//                 {producto?.nombre}
//               </h1>
//               <div className="flex flex-col mb-4 xs:mb-0 xs:flex-row md:flex-row lg:flex-row  gap-1 justify-between">
//                 <div className="flex flex-col">
//                   <p className="text-gray-700 text-sm font-semibold mb-6">
//                     COD:{' '}
//                     <span className="text-alternative">#{producto?.id}</span>
//                   </p>
//                 </div>
//               </div>
//               <div
//                 className="text-gray-700 mb-10"
//                 dangerouslySetInnerHTML={{
//                   __html: producto?.caracteristicas ?? ''
//                 }}
//               ></div>
//               <div className="flex flex-col lg:flex-row gap-2 justify-between mb-10">
//                 <div className="w-full lg:w-1/2 flex gap-0 ">
//                   <button
//                     onClick={disminuir}
//                     className="flex items-center justify-center bg-paleta-500 text-center text-white px-4 py-2 rounded-sm  transition-all active:scale-90 hover:bg-secondary"
//                   >
//                     <FaMinus />
//                   </button>
//                   <input
//                     type="text"
//                     value={inputCantidad}
//                     onChange={handleInputChange}
//                     placeholder="Introduce la cantidad"
//                     className="text-center border-y border-gray-300 out"
//                   />
//                   <button
//                     onClick={aumentar}
//                     className="flex items-center justify-center bg-paleta-500 text-center text-white px-4 py-2 rounded-sm transition-all active:scale-90 hover:bg-secondary"
//                   >
//                     <FaPlus />
//                   </button>
//                 </div>
//               </div>

//               <AddProducto
//                 producto={producto}
//                 contador={cantidad}
//                 setContador={setCantidad}
//                 precioFinal={0}
//               />
//             </div>
//           </div>

//           <div className="w-full flex flex-col mt-20">
//             <h2 className="text-4xl text-secondary w-full text-center px-4 mb-8">
//               Otros productos
//             </h2>
//             <SwiperProductos
//               productos={productos}
//               directionChange={false}
//               alreves={false}
//               slides={5}
//             />
//           </div>
//         </div>
//       </section>
//     </>
//   )
// }
