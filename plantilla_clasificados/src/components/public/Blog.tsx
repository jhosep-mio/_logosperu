import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { type blogsValues } from '../shared/interface'
import { Global } from '../../helper/Global'
import axios from 'axios'
import SwiperBlogs from './blogs/SwiperBlogs'
import Loading from './Loading'

export const Blog = (): JSX.Element => {
  const { id } = useParams()
  const [blog, setblog] = useState<blogsValues | null>(null)
  const [loadingComponents, setLoadingComponents] = useState(true)
  const [blogs, setblogs] = useState([])

  const getData = async (
    ruta: string,
    setDatos: React.Dispatch<React.SetStateAction<never[]>>
  ): Promise<void> => {
    try {
      const request = await axios.get(`${Global.url}/${ruta}`)
      setDatos(request.data)
    } catch (error) {
      console.log(error)
    }
  }

  const getOneProducto = async (): Promise<void> => {
    setLoadingComponents(true)
    const request = await axios.get(`${Global.url}/oneBlog/${id ?? ''}`)
    setblog(request.data[0])
    console.log(request.data[0])

    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    setLoadingComponents(false)
  }

  useEffect(() => {
    if (id) {
      window.scrollTo(0, 0)
      getOneProducto()
    }
  }, [id])

  useEffect(() => {
    window.scrollTo(0, 0)
    Promise.all([
      getData('allBlogs', setblogs)
    ]).then(() => {
    })
  }, [])

  return (
    <>
      {loadingComponents && <Loading/>}
      <section className="bg-gray-200 w-full min-h-screen pt-[80px] md:pt-0 px-4">
        <div className="max-w-[1300px] mx-auto px10 py-20 flex flex-col">
          <h1 className="text-center w-full text-xl md:text-3xl font-medium">
            {blog?.titulo}
          </h1>
          <div className="w-full mt-10 bg-white flex flex-col">
            <img
              src={`${Global.urlImages}/blogs/${blog?.imagen1 ?? ''}`}
              alt=""
              className="w-full h-[250px] md:h-[500px] object-cover"
            />
            <div
              className="text-justify text-lg mt-5 text-gray-600 p-4"
              dangerouslySetInnerHTML={{
                __html: blog?.caracteristicas ?? ''
              }}
            ></div>
          </div>
          <div className='mt-16 '>
            <h2 className='text-3xl'>Otros blogs</h2>
            <SwiperBlogs blogs={blogs}/>
          </div>
        </div>
      </section>
    </>
  )
}
