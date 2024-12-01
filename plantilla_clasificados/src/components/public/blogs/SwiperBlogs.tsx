import { Swiper, SwiperSlide } from 'swiper/react'
import 'swiper/css'
import { type blogsValues } from '../../shared/interface'
import { Autoplay, Pagination } from 'swiper'
import 'swiper/css/pagination'
import { Global } from '../../../helper/Global'
import { Link } from 'react-router-dom'
import { formatearURL } from '../../shared/functions'

const SwiperBlogs = ({ blogs }: { blogs: blogsValues[] }): JSX.Element => {
  return (
    <Swiper
      breakpoints={{
        0: {
          slidesPerView: 1,
          spaceBetween: 20
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 40
        }
      }}
      pagination={true}
      modules={[Pagination, Autoplay]}
      autoplay={{
        delay: 3000
      }}
      loop
      className="h-full w-full pt-6 pb-12"
    >
      {blogs.map((blog: blogsValues) => (
        <SwiperSlide key={blog.id} className="w-full h-full">
          <div className="flex w-full flex-col">
            <img
              src={`${Global.urlImages}/blogs/${blog.imagen1}`}
              alt=""
              className="w-full h-[250px] object-cover"
            />
            <h3 className="font-bold mt-6 text-base">{blog.titulo}</h3>
            <div
              className="line-clamp-2 text-justify mt-5 text-gray-700"
              dangerouslySetInnerHTML={{
                __html: blog?.caracteristicas ?? ''
              }}
            ></div>
            <Link
              to={`/blog/${blog.id}-${formatearURL(blog.titulo)}`}
              className="text-paleta-500 mt-4 hover:text-paleta-500/80 transition-colors underline"
            >
              Ver más
            </Link>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  )
}

export default SwiperBlogs
