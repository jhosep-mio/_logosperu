import React, { useEffect, useState } from 'react'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, Navigation, Pagination } from 'swiper'
import 'swiper/css/grid'
import 'swiper/css'
import 'swiper/css/pagination'
import 'swiper/css/navigation'
import { Global } from '../../helper/Global'
import axios from 'axios'
import Loading from './Loading'
import {
  type productosValuesPagina,
  type paginaValues,
  type ValuesCategoriasPortafolio
} from '../shared/interface'
import { Helmet, HelmetProvider } from 'react-helmet-async'
import { Header } from './estructura/Header'
import { useParams } from 'react-router-dom'
import { Footer } from './estructura/Footer'

const Home = (): JSX.Element => {
  const [data, setData] = useState<paginaValues | null>(null)
  const { id } = useParams()
  const [loadingComponents, setLoadingComponents] = useState(true)

  const getAllData = async (
    ruta: string,
    setDatos: React.Dispatch<React.SetStateAction<paginaValues | null>>
  ): Promise<void> => {
    try {
      const request = await axios.get(`${Global.urlproduccion}/${ruta}`)
      setDatos(JSON.parse(request.data.pagina_web))
      //   console.log(JSON.parse(request.data.pagina_web))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    Promise.all([getAllData(`oneWeb/${id ?? ''}`, setData)]).then(() => {
      setLoadingComponents(false)
    })
  }, [])

  const color = data?.configuracion?.color ?? '#000' // Color por defecto si no hay configuración

  const handleWhatsAppClick = (tipo: string, nombre: string): void => {
    const message = `Hola, estoy interesado en el ${
      tipo == 'productos' ? 'producto' : 'servicio'
    } ${nombre}`
    const url = `https://wa.me/+51${
      data?.configuracion?.celular ?? ''
    }?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <HelmetProvider>
      {loadingComponents
        ? <Loading />
        : (
        <section
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-expect-error
          style={{ '--color-dynamic': color }}
        >
          <Helmet>
            <title>{data?.configuracion.nombre}</title>
            <link
              rel="shortcut icon"
              href={`${Global.urlproduccionImagen}/clasificados/${
                data?.configuracion?.icono ?? ''
              }`}
              type="image/png"
            />
            {data?.banner?.banner1 && (
              <>
                <meta
                  property="og:image"
                  content={`${Global.urlproduccionImagen}/clasificados/${
                    data?.banner?.banner1 ?? ''
                  }`}
                />
              </>
            )}
          </Helmet>
          <Header datos={data} id={id} />
          <section className="pt-[75px] md:pt-0">
            <div className="bg-[#F2F2F0] h-fit w-full  flex flex-col md:flex-row justify-end">
              <Swiper
                className="w-full h-full"
                modules={[Autoplay, Navigation]}
                autoplay={{
                  delay: 3000,
                  disableOnInteraction: false
                }}
                loop={true}
              >
                {data?.banner?.banner1 && (
                  <SwiperSlide>
                    <img
                      src={`${Global.urlproduccionImagen}/clasificados/${
                        data?.banner?.banner1 ?? ''
                      }`}
                      alt=""
                      className="w-full h-full object-cover block"
                    />
                  </SwiperSlide>
                )}
                {data?.banner?.banner2 && (
                  <SwiperSlide>
                    <img
                      src={`${Global.urlproduccionImagen}/clasificados/${
                        data?.banner?.banner2 ?? ''
                      }`}
                      alt=""
                      className="w-full h-full object-cover block"
                    />
                  </SwiperSlide>
                )}
              </Swiper>
            </div>
          </section>
          <section className="p-4 md:p-8 border-b border-gray-300">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-0">
              {data?.informacion?.imagentitulo1 && (
                <div className="flex gap-3 items-start md:items-center justify-start md:justify-center">
                  <img
                    src={`${Global.urlproduccionImagen}/clasificados/${
                      data?.informacion?.imagentitulo1 ?? ''
                    }`}
                    alt=""
                    className="object-contain block h-[48px] w-[48px]"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm md:text-base text-black font-bold uppercase">
                      {data?.informacion.titulo1}
                    </span>
                    <span className="text-xs md:text-base">
                      {data?.informacion.subtitulo1}
                    </span>
                  </div>
                </div>
              )}
              {data?.informacion?.imagentitulo2 && (
                <div className="flex gap-3 items-start md:items-center justify-start md:justify-center">
                  <img
                    src={`${Global.urlproduccionImagen}/clasificados/${
                      data?.informacion?.imagentitulo2 ?? ''
                    }`}
                    alt=""
                    className="object-contain block h-[48px] w-[48px]"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm md:text-base text-black font-bold uppercase">
                      {data?.informacion.titulo2}
                    </span>
                    <span className="text-xs md:text-base">
                      {data?.informacion.subtitulo2}
                    </span>
                  </div>
                </div>
              )}
              {data?.informacion?.imagentitulo3 && (
                <div className="flex gap-3 items-start md:items-center justify-start md:justify-center">
                  <img
                    src={`${Global.urlproduccionImagen}/clasificados/${
                      data?.informacion?.imagentitulo3 ?? ''
                    }`}
                    alt=""
                    className="object-contain block h-[48px] w-[48px]"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm md:text-base text-black font-bold uppercase">
                      {data?.informacion.titulo3}
                    </span>
                    <span className="text-xs md:text-base">
                      {data?.informacion.subtitulo3}
                    </span>
                  </div>
                </div>
              )}
              {data?.informacion?.imagentitulo4 && (
                <div className="flex gap-3 items-start md:items-center justify-start md:justify-center">
                  <img
                    src={`${Global.urlproduccionImagen}/clasificados/${
                      data?.informacion?.imagentitulo4 ?? ''
                    }`}
                    alt=""
                    className="object-contain block h-[48px] w-[48px]"
                  />
                  <div className="flex flex-col">
                    <span className="text-sm md:text-base text-black font-bold uppercase">
                      {data?.informacion.titulo4}
                    </span>
                    <span className="text-xs md:text-base">
                      {data?.informacion.subtitulo4}
                    </span>
                  </div>
                </div>
              )}
            </div>
          </section>
          {/* PRODUCTOS */}
          {data?.productos?.tipoenfoque == 'productos'
            ? <section
              className="md:py-10 w-full px-4 md:px-8 mt-16"
              id="productos"
            >
              <div className="flex flex-col justify-center items-center gap-2 md:gap-3">
                <h2 className="font-bold text-3xl md:text-4xl w-full text-center">
                  Nuestros productos
                </h2>
                <span className="bg-dynamic w-20 h-1 mt-2 rounded-2xl"></span>
                <div className="w-full px-0 md:px-12 relative ">
                  <div className="swiper-button-prev"></div>
                  <div className="swiper-button-next"></div>
                  <Swiper
                    breakpoints={{
                      0: {
                        slidesPerView: 2
                      },
                      1024: {
                        slidesPerView: 5,
                        spaceBetween: 0
                      }
                    }}
                    navigation={{
                      nextEl: '.swiper-button-next',
                      prevEl: '.swiper-button-prev'
                    }}
                    modules={[Navigation, Autoplay]}
                    autoplay={{
                      delay: 3000,
                      reverseDirection: false
                    }}
                    loop
                    className="h-full w-full "
                  >
                    {JSON.parse(data?.productos?.productos ?? '').map(
                      (producto: productosValuesPagina) => (
                        <SwiperSlide
                          key={producto.id}
                          className="w-full border border-gray-300 px-4 py-6"
                        >
                          <div className="">
                            <div className="w-full h-full flex flex-col items-center justify-between">
                              <img
                                src={`${Global.urlproduccionImagen}/clasificados/productos/${producto.imagenproducto.archivoName}`}
                                alt=""
                                className="w-full h-[150px] md:h-[200px] object-contain"
                              />
                              <div className="flex w-full h-[120px] flex-col justify-between items-center mt-4">
                                <div className="flex flex-col gap-1 items-center">
                                  <h3 className="font-bold text-lg line-clamp-1">
                                    {producto.titulo}
                                  </h3>
                                </div>
                                <button
                                  className="w-full gap-2 bg-dynamic hover:opacity-80 transition-opacity px-2 md:px-6 py-2 md:py-3 rounded-md text-white text-sm md:text-base flex items-center justify-center"
                                  onClick={() => {
                                    handleWhatsAppClick(
                                      data?.productos?.tipoenfoque,
                                      producto.titulo
                                    )
                                  }}
                                >
                                  Comprar
                                </button>
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      )
                    )}
                  </Swiper>
                  <Swiper
                    breakpoints={{
                      0: {
                        slidesPerView: 2
                      },
                      1024: {
                        slidesPerView: 5,
                        spaceBetween: 0
                      }
                    }}
                    navigation={{
                      nextEl: '.swiper-button-next',
                      prevEl: '.swiper-button-prev'
                    }}
                    modules={[Navigation, Autoplay]}
                    autoplay={{
                      delay: 3000,
                      reverseDirection: true
                    }}
                    loop
                    className="h-full w-full  md:pt-0"
                  >
                    {JSON.parse(data?.productos?.productos ?? '')
                      .reverse()
                      .map((producto: productosValuesPagina) => (
                        <SwiperSlide
                          key={producto.id}
                          className="w-full border border-gray-300 px-4 py-6"
                        >
                          <div className="">
                            <div className="w-full h-full flex flex-col items-center justify-between">
                              <img
                                src={`${Global.urlproduccionImagen}/clasificados/productos/${producto.imagenproducto.archivoName}`}
                                alt=""
                                className="w-full h-[150px] md:h-[200px] object-contain"
                              />
                              <div className="flex w-full h-[120px] flex-col justify-between items-center mt-4">
                                <div className="flex flex-col gap-1 items-center">
                                  <h3 className="font-bold text-lg line-clamp-1">
                                    {producto.titulo}
                                  </h3>
                                </div>
                                <button
                                  className="w-full gap-2 bg-dynamic hover:opacity-80 transition-opacity px-2 md:px-6 py-2 md:py-3 rounded-md text-white text-sm md:text-base flex items-center justify-center"
                                  onClick={() => {
                                    handleWhatsAppClick(
                                      data?.productos?.tipoenfoque,
                                      producto.titulo
                                    )
                                  }}
                                >
                                  Comprar
                                </button>
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      ))}
                  </Swiper>
                </div>
              </div>
            </section>
          // SERVICIOS
            : data?.productos?.tipoenfoque == 'servicios'
              ? <section className="py-12 w-full px-4 md:px-8 "
              id="productos"
              >
              <div className="flex flex-col justify-center items-center gap-2 md:gap-3">
                <h2 className="font-bold text-3xl md:text-4xl w-full text-center">
                  Nuestros servicios
                </h2>
                {/* <span className="text-gray-700">Productos increibles</span> */}
                <span className="bg-dynamic w-20 h-1 mt-2 rounded-2xl"></span>
                <div className="w-full">
                  <Swiper
                    breakpoints={{
                      0: {
                        slidesPerView: 1
                      },
                      1024: {
                        slidesPerView: 2,
                        spaceBetween: 40
                      },
                      1300: {
                        slidesPerView: 3,
                        spaceBetween: 30
                      }
                    }}
                    pagination={{
                      dynamicBullets: true
                    }}
                    modules={[Pagination, Autoplay]}
                    autoplay={{
                      delay: 3000
                    }}
                    loop
                    className="h-full w-full pt-6 pb-12"
                  >
                    {JSON.parse(data?.productos?.productos ?? '').map(
                      (producto: productosValuesPagina) => (
                        <SwiperSlide
                          key={producto.id}
                          className="w-full h-[350px] md:h-[300px]"
                        >
                          <div className="w-full h-full flex items-center gap-6 border-2 rounded-md border-dynamic px-4 py-6">
                            <div className="w-1/2 h-full">
                              <img
                                src={`${Global.urlproduccionImagen}/clasificados/productos/${producto.imagenproducto.archivoName}`}
                                alt=""
                                className="w-full h-full my-auto object-contain"
                              />
                            </div>
                            <div className="h-full w-1/2">
                              <div className="w-full h-full flex flex-col gap-0 justify-between">
                                <h3 className="font-bold text-lg line-clamp-1">
                                  {producto.titulo}
                                </h3>
                                <div className="pt-4 justify-between ">
                                  <div
                                    className="text-gray-700 line-clamp-6"
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        JSON.parse(producto?.descripcion) ?? ''
                                    }}
                                  ></div>
                                </div>
                                <button
                                  type="button"
                                  className="rounded-2xl bg-dynamic hover:bg-dynamic/80 transition-colors px-6 text-white mt-4 text-sm py-2 w-fit"
                                  onClick={() => {
                                    handleWhatsAppClick(
                                      data?.productos?.tipoenfoque,
                                      producto.titulo
                                    )
                                  }}
                                >
                                  Cotizar
                                </button>
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      )
                    )}
                  </Swiper>
                  <Swiper
                    breakpoints={{
                      0: {
                        slidesPerView: 1
                      },
                      1024: {
                        slidesPerView: 2,
                        spaceBetween: 40
                      },
                      1300: {
                        slidesPerView: 3,
                        spaceBetween: 30
                      }
                    }}
                    pagination={{
                      dynamicBullets: true
                    }}
                    modules={[Pagination, Autoplay]}
                    autoplay={{
                      delay: 3000
                    }}
                    loop
                    className="h-full w-full pt-6 pb-12"
                  >
                    {JSON.parse(data?.productos?.productos ?? '').reverse().map(
                      (producto: productosValuesPagina) => (
                        <SwiperSlide
                          key={producto.id}
                          className="w-full h-[350px] md:h-[300px]"
                        >
                          <div className="w-full h-full flex items-center gap-6 border-2 rounded-md border-dynamic px-4 py-6">
                            <div className="w-1/2 h-full">
                              <img
                                src={`${Global.urlproduccionImagen}/clasificados/productos/${producto.imagenproducto.archivoName}`}
                                alt=""
                                className="w-full h-full my-auto object-contain"
                              />
                            </div>
                            <div className="h-full w-1/2">
                              <div className="w-full h-full flex flex-col gap-0 justify-between">
                                <h3 className="font-bold text-lg line-clamp-1">
                                  {producto.titulo}
                                </h3>
                                <div className="pt-4 justify-between ">
                                  <div
                                    className="text-gray-700 line-clamp-6"
                                    dangerouslySetInnerHTML={{
                                      __html:
                                        JSON.parse(producto?.descripcion) ?? ''
                                    }}
                                  ></div>
                                </div>
                                <button
                                  type="button"
                                  className="rounded-2xl bg-dynamic hover:bg-dynamic/80 transition-colors px-6 text-white mt-4 text-sm py-2 w-fit"
                                >
                                  Cotizar
                                </button>
                              </div>
                            </div>
                          </div>
                        </SwiperSlide>
                      )
                    )}
                  </Swiper>
                </div>
              </div>
            </section>
              : null}

          <section id='nosotros' style={{ backgroundImage: `url(${Global.urlproduccionImagen}/clasificados/${data?.seo?.imagenseo ?? ''})` }} className='bg-fixed bg-no-repeat bg-cover relative before:w-full before:h-full before:bg-black before:opacity-50 before:absolute'>
            <div className=" h-[450px] md:h-[550px] w-full flex justify-end relative px-4 md:px-0 mt-10 md:mt-0">
              <div className="w-1/2 h-full absolute inset-0">
              </div>
              <div className="w-full md:w-1/2 mx-auto h-full flex justify-center items-center flex-col gap-4 z-10">
                <span className="font-bold text-3xl md:text-5xl text-center uppercase text-white">
                  BIENVENIDOS A {data?.configuracion?.nombre}
                </span>
                <span className="font-medium text-md text-brown-50 text-center">
                  {data?.seo?.descripcionseo}
                </span>
                <a
                  href="#contacto"
                  className="bg-dynamic text-sm md:text-base hover:bg-dynamic/80 transition-colors px-4 md:px-6 py-2 md:py-3 rounded-lg text-white"
                >
                  Contactanos
                </a>
              </div>
              <div className="w-1/2 h-full hidden md:block absolute right-0 top-0 bottom-0">
              </div>
            </div>
          </section>
          {data?.marcas && JSON.parse(data?.marcas ?? '').length > 0 &&
          <section className="w-full relative mb-40" id='marcas'>
            <div className="w-[85%] mx-auto absolute right-0 left-0 -top-20 bg-white p-4 border border-gray-300 rounded-lg">
              <Swiper
                breakpoints={{
                  0: {
                    slidesPerView: 2
                  },
                  1024: {
                    slidesPerView: 5,
                    spaceBetween: 40
                  }
                }}
                pagination={true}
                modules={[Pagination, Autoplay]}
                autoplay={{
                  delay: 3000
                }}
                loop
                className="h-full w-full md:pt-6 pb-4 md:pb-12"
              >
                {JSON.parse(data?.marcas ?? '').map((marca: ValuesCategoriasPortafolio) => (
                  <SwiperSlide key={marca.id} className="w-full h-full">
                    <div className="w-full">
                      <img
                        src={`${Global.urlproduccionImagen}/clasificados/marcas/${marca.imagen1.archivoName ?? ''}`}
                        alt=""
                        className="w-full h-[100px] object-contain mx-auto filter grayscale"
                      />
                    </div>
                  </SwiperSlide>
                ))}
              </Swiper>
            </div>
          </section>
          }

          <Footer data={data}/>
        </section>
          )}
    </HelmetProvider>
  )
}

export default Home
