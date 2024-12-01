/* eslint-disable @next/next/no-img-element */
import { FaAngleDown } from 'react-icons/fa6'
import { FiDownload } from 'react-icons/fi'
import Link from 'next/link'
import { getServerSideProps } from '../@querys/GetData'
import { AnuncioCelBottom } from './AnuncioCelBottom'
import { Header } from './Header'

export default async function MainNewsLetter () {
  const categorias = await getServerSideProps(
    'newsletter/getAllCategoriasPublic'
  )

  return (
    <>
      <Header />
      <section className="bg-gray-100 flex pt-[80px] lg:pt-[110px] relative ">
        <img
          src="https://ticsyformacion.com/wp-content/uploads/2016/02/tipos-de-anuncios-publicitarios-infografia.png"
          alt=""
          className="w-[130px] 2xl:w-[190px] h-full object-cover sticky left-0 top-[110px] z-[10] hidden lg:block"
        />
        <section className="w-full grid grid-cols-1 lg:grid-cols-8 flex-1 relative bg-white">
          <img
            src="https://blucactus.es/wp-content/uploads/2022/03/Blucactus-7-consejos-esenciales-sobre-redes-sociales-portada.jpg"
            alt=""
            className="md:h-[100px] h-[60px] w-full object-cover lg:hidden"
          />
          <div className="w-fulll col-span-1 border-r-2 border-gris h-full p-8 2xl:p-10 hidden lg:block">
            <h2 className="text-3xl border-b-2 border-b-gray-500 w-fit font-ysobel_regular">
              Todos
            </h2>
            <div className="mt-6 font-ysobel_regular flex flex-col gap-3 text-gray-600">
              {categorias?.map((categoria: any) => (
                <Link
                  href={`/${categoria.url}`}
                  key={categoria.url}
                  className="lowercase first-letter:uppercase"
                >
                  {categoria.titulo}
                </Link>
              ))}
            </div>
          </div>
          <div className="px-0 py-4 lg:p-8 2xl:p-10 w-full col-span-5 lg:border-r-2 border-gris">
            <div className="w-full flex justify-between items-center px-4 lg:px-0">
              <h3 className="font-SpartanMedium text-gray-600 text-lg lg:text-xl">
                Thursday
              </h3>
              <button className="flex items-center gap-2 font-SpartanMedium text-gray-600 text-xs border-2 border-gray-600 px-4 py-1 rounded-full">
                New <FaAngleDown className="text-sm text-gray-600" />
              </button>
            </div>
            <div className="mt-4 mb-4 px-4 lg:px-0">
              <h2 className="text-3xl lg:text-5xl font-ysobel_regular tracking-wider">
                February 12
              </h2>
            </div>
            <img
              src="https://www.movilzona.es/app/uploads-movilzona.es/2021/02/modo-oscuro.png"
              alt=""
              className="h-[300px] lg:h-[450px] object-cover w-full"
            />
            <div className="flex items-center mt-4 px-4 lg:px-0">
              <div className="w-full flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-gray-600 rounded-full h-10 w-10"></div>
                  <h3 className="font-SpartanMedium">Robert Fox</h3>
                </div>
                <div className="flex gap-4">
                  <FiDownload className="rotate-180 text-gray-600 text-xl" />
                  <FiDownload className=" text-gray-600 text-xl" />
                </div>
              </div>
            </div>
            <div className="flex gap-4 text-gray-600 mt-4 text-xs px-4 lg:px-0">
              12:20 AM - 12 min read -{' '}
              <span className="text-blue-600 Tech">Teach</span>
            </div>
            <h2 className="text-black text-3xl lg:text-4xl mt-4 font-semibold px-4 lg:px-0">
              How to create a mobile beanking app in 2023-2024: Key features,
              teach stack, and common pitfalls
            </h2>
            <div className="mt-4 text-gray-600 px-4 lg:px-0 text-justify lg:text-start">
              <p className="">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Veritatis animi, nam mollitia saepe hic quas, culpa quos nobis
                doloribus odit omnis, fugiat eos perferendis cumque ducimus
                voluptatibus quod libero enim.
              </p>
              <p className="">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Veritatis animi, nam mollitia saepe hic quas, culpa quos nobis
                doloribus odit omnis, fugiat eos perferendis cumque ducimus
                voluptatibus quod libero enim.
              </p>
              <p className="">
                Lorem ipsum dolor sit amet consectetur adipisicing elit.
                Veritatis animi, nam mollitia saepe hic quas, culpa quos nobis
                doloribus odit omnis, fugiat eos perferendis cumque ducimus
                voluptatibus quod libero enim.
              </p>
            </div>
            <div className="px-4 lg:px-0">
              <button className="mt-6 border-2 w-full py-2 px-4 rounded-full border-[#8c8c8c] hover:bg-[#8c8c8c] transition-colors hover:text-white">
                Read all
              </button>
            </div>
            <span className="block h-[1px] lg:h-[2px] bg-[#8c8c8c] my-6 lg:my-10 "></span>
            <div className="flex flex-col lg:flex-row w-full gap-6 lg:gap-8 2xl:p-10 my-6 lg:mt-10">
              <div className="flex w-full lg:w-1/2 flex-col text-xs">
                <div className="text-xs text-gray-600 px-4 lg:px-0">
                  12:20 AM - 12 min read -{' '}
                  <span className="text-blue-600 Tech">Teach</span>
                  <h3 className="text-black font-semibold text-lg">
                    Top ways data management services cant increse your
                    bussiness efficency
                  </h3>
                </div>
                <img
                  src="https://www.movilzona.es/app/uploads-movilzona.es/2021/02/modo-oscuro.png"
                  alt=""
                  className="h-full object-cover w-full mt-4"
                />
              </div>
              <div className="flex w-full lg:w-1/2 flex-col gap-6 lg:gap-8 2xl:p-10 px-4 lg:px-0">
                <div className="text-xs text-gray-600">
                  12:20 AM - 12 min read -{' '}
                  <span className="text-blue-600 Tech">Teach</span>
                  <h3 className="text-black font-semibold text-lg">
                    Top ways data management services cant increse your
                    bussiness efficency
                  </h3>
                </div>
                <div className="text-xs text-gray-600">
                  12:20 AM - 12 min read -{' '}
                  <span className="text-blue-600 Tech">Teach</span>
                  <h3 className="text-black font-semibold text-lg">
                    Top ways data management services cant increse your
                    bussiness efficency
                  </h3>
                </div>
                <div className="text-xs text-gray-600">
                  12:20 AM - 12 min read -{' '}
                  <span className="text-blue-600 Tech">Teach</span>
                  <h3 className="text-black font-semibold text-lg">
                    Top ways data management services cant increse your
                    bussiness efficency
                  </h3>
                </div>
              </div>
            </div>
            <span className="block h-[1px] lg:h-[2px] bg-[#8c8c8c] my-6 lg:my-10"></span>
            <div className="flex w-full mt-6 lg:mt-10 justify-between items-center lg:items-start text-xs px-4 lg:px-0">
              <div className="text-xs text-gray-600 w-2/3 lg:w-1/2">
                12:20 AM - 12 min read -{' '}
                <span className="text-blue-600 Tech">Teach</span>
                <h3 className="text-black font-semibold text-lg">
                  Top ways data management services cant increse your bussiness
                  efficency
                </h3>
              </div>
              <img
                src="https://www.movilzona.es/app/uploads-movilzona.es/2021/02/modo-oscuro.png"
                alt=""
                className="h-[70px] object-cover object-center w-fit "
              />
            </div>
            <span className="block h-[1px] lg:h-[2px] bg-[#8c8c8c] my-6 lg:my-10 "></span>
            <section className="">
              <img
                src="https://www.movilzona.es/app/uploads-movilzona.es/2021/02/modo-oscuro.png"
                alt=""
                className="h-[300px] lg:h-[450px] object-cover w-full"
              />
              <div className="flex items-center mt-4 px-4 lg:px-0">
                <div className="w-full flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="bg-gray-600 rounded-full h-10 w-10"></div>
                    <h3 className="font-SpartanMedium">Robert Fox</h3>
                  </div>
                  <div className="flex gap-4">
                    <FiDownload className="rotate-180 text-gray-600 text-xl" />
                    <FiDownload className=" text-gray-600 text-xl" />
                  </div>
                </div>
              </div>
              <div className="flex gap-4 text-gray-600 mt-4 text-xs px-4 lg:px-0">
                12:20 AM - 12 min read -{' '}
                <span className="text-blue-600 Tech">Teach</span>
              </div>
              <h2 className="text-black text-3xl lg:text-4xl mt-4 font-semibold px-4 lg:px-0">
                How to create a mobile beanking app in 2023-2024: Key features,
                teach stack, and common pitfalls
              </h2>
              <div className="mt-4 text-gray-600 px-4 lg:px-0 text-justify lg:text-start">
                <p className="">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Veritatis animi, nam mollitia saepe hic quas, culpa quos nobis
                  doloribus odit omnis, fugiat eos perferendis cumque ducimus
                  voluptatibus quod libero enim.
                </p>
                <p className="">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Veritatis animi, nam mollitia saepe hic quas, culpa quos nobis
                  doloribus odit omnis, fugiat eos perferendis cumque ducimus
                  voluptatibus quod libero enim.
                </p>
                <p className="">
                  Lorem ipsum dolor sit amet consectetur adipisicing elit.
                  Veritatis animi, nam mollitia saepe hic quas, culpa quos nobis
                  doloribus odit omnis, fugiat eos perferendis cumque ducimus
                  voluptatibus quod libero enim.
                </p>
              </div>
              <div className="px-4 lg:px-0">
                <button className="mt-6 border-2 w-full py-2 px-4 rounded-full border-[#8c8c8c] hover:bg-[#8c8c8c] transition-colors hover:text-white">
                  Read all
                </button>
              </div>
            </section>
          </div>
          <div className="col-span-2 p-8 2xl:p-10 hidden lg:block">
            <div className="w-full flex justify-between items-center">
              <h3 className="font-SpartanMedium text-gray-600 text-xl">
                Treading
              </h3>
              <button className="flex items-center gap-2 font-SpartanMedium text-gray-600 text-xs border-2 border-gray-600 px-4 py-1 rounded-full">
                View all
              </button>
            </div>
            <div className="flex w-full flex-col gap-2 mt-10">
              <h3 className="text-black font-semibold text-lg leading-5">
                Top ways data management services cant increse your bussiness
                efficency
              </h3>
              <p className="text-xs text-gray-600">12:20 AM - 12 min read </p>
            </div>
            <span className="block h-[2px] bg-[#8c8c8c] my-6"></span>
            <div className="flex w-full flex-col gap-2 ">
              <h3 className="text-black font-semibold text-lg leading-5">
                Top ways data management services cant increse your bussiness
                efficency
              </h3>
              <p className="text-xs text-gray-600">12:20 AM - 12 min read </p>
            </div>
            <span className="block h-[2px] bg-[#8c8c8c] my-6"></span>
            <div className="flex w-full flex-col gap-2 ">
              <h3 className="text-black font-semibold text-lg leading-5">
                Top ways data management services cant increse your bussiness
                efficency
              </h3>
              <p className="text-xs text-gray-600">12:20 AM - 12 min read </p>
            </div>
            {/* <span className="block h-[2px] my-6"></span> */}
            <img
              src="https://scontent.flim38-1.fna.fbcdn.net/v/t39.30808-6/458360139_912616284220182_8113388558231195582_n.jpg?_nc_cat=100&ccb=1-7&_nc_sid=127cfc&_nc_ohc=x3LhA67Vf3oQ7kNvgFl9ABY&_nc_ht=scontent.flim38-1.fna&_nc_gid=AnKEm9FrInd_lXzPL-I3c-h&oh=00_AYDFlb6Hp3mKQ8RkcxJMWgY-tKgNGIOEcY68DPNZ7vIEow&oe=6704D7DA"
              alt=""
              className="mt-6"
            />
            <div className="w-full flex justify-between items-center mt-4">
              <h3 className="font-SpartanMedium text-gray-600 text-xl">
                Others articles
              </h3>
            </div>
            <div className="flex w-full flex-col gap-2 mt-4">
              <h3 className="text-black font-semibold text-lg leading-5">
                Top ways data management services cant increse your bussiness
                efficency
              </h3>
              <p className="text-xs text-gray-600">12:20 AM - 12 min read </p>
            </div>
            <span className="block h-[2px] bg-[#8c8c8c] my-6"></span>
            <div className="flex w-full flex-col gap-2 ">
              <h3 className="text-black font-semibold text-lg leading-5">
                Top ways data management services cant increse your bussiness
                efficency
              </h3>
              <p className="text-xs text-gray-600">12:20 AM - 12 min read </p>
            </div>
            <span className="block h-[2px] bg-[#8c8c8c] my-6"></span>
            <div className="flex w-full flex-col gap-2 ">
              <h3 className="text-black font-semibold text-lg leading-5">
                Top ways data management services cant increse your bussiness
                efficency
              </h3>
              <p className="text-xs text-gray-600">12:20 AM - 12 min read </p>
            </div>
          </div>
          <AnuncioCelBottom />
        </section>
        <img
          src="https://ticsyformacion.com/wp-content/uploads/2016/02/tipos-de-anuncios-publicitarios-infografia.png"
          alt=""
          className="w-[130px] 2xl:w-[190px] h-fit object-contain sticky right-0 top-[110px] z-[10] hidden lg:block"
        />
      </section>
    </>
  )
}
