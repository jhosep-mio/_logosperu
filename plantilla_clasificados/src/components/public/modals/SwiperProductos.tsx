// import { Swiper, SwiperSlide } from 'swiper/react'
// import 'swiper/css'
// import { Autoplay } from 'swiper'
// import { type productosValues } from '../../shared/interface'
// import CardProducto from './CardProducto'
// interface SwiperProductosProps {
//   productos: productosValues[]
//   alreves: boolean
//   directionChange: boolean
//   slides: number
// }
// const SwiperProductos = ({
//   productos,
//   alreves,
//   directionChange,
//   slides
// }: SwiperProductosProps): JSX.Element => {
//   productos = alreves ? productos.slice().reverse() : productos
//   return (
//     <>
//       <Swiper
//         slidesPerView={slides}
//         slidesPerGroup={3}
//         className="w-full py-4"
//         // spaceBetween={10}
//         loop={true}
//         modules={[Autoplay]}
//         autoplay={{
//           delay: 4000,
//           disableOnInteraction: false,
//           reverseDirection: directionChange,
//           pauseOnMouseEnter: true
//         }}
//         breakpoints={{
//           0: {
//             slidesPerView: 1
//           },
//           540: {
//             slidesPerView: 2
//           },
//           720: {
//             slidesPerView: 3
//           },
//           960: {
//             slidesPerView: 4
//           },
//           1140: {
//             slidesPerView: slides
//           }
//         }}
//       >
//         {productos?.map((producto, index) => (
//           <SwiperSlide key={index} className='w-full  border border-gray-300 px-4 py-6'>
//             <CardProducto producto={producto} />
//           </SwiperSlide>
//         ))}
//       </Swiper>
//     </>
//   )
// }

// export default SwiperProductos
