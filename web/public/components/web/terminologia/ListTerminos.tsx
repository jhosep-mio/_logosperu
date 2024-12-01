'use client'
import React, { useEffect, useState } from 'react'

import { CardTerminos } from '@/public/components/web/terminologia/CardTerminos'
// Import Swiper React components
import { Swiper, SwiperSlide } from 'swiper/react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/grid'
import 'swiper/css/pagination'
import { BsArrowRight } from 'react-icons/bs'
// import required modules
import { Grid, Pagination } from 'swiper/modules'
export const ListTerminos = ({ texto }: { texto: string }) => {
  const terminos = [
    // {
    //   title: 'Landing page',
    //   content:
    //     'Una landing page (página de inicio) es la página web a la que se dirige a un usuario de Internet después de hacer clic en un hipervínculo (ya sea que ese enlace sea una publicidad, un enlace en un correo electrónico o boletín, un botón de llamada a la acción.'
    // },
    // {
    //   title: 'Pasarela de pagos',
    //   content:
    //     'Son servicios de pago que normalmente se prestan a cambio de una cuota adicional, y que procesan tarjetas bancarias online por medio de una página de e-commerce, o en persona por medio de un datáfono.'
    // },
    // {
    //   title: 'Brief de desarrollo web',
    //   content:
    //     'El briefing de diseño web es una herramienta clave para iniciar o mejorar un proyecto en línea. Este documento debe incluir información relevante y necesaria para que la agencia de marketing digital pueda trabajar en el proyecto y hacerlo realidad.'
    // },
    // {
    //   title: 'Hosting',
    //   content:
    //     'Alojamiento web, es un servicio donde podrás alojar todos los contenidos necesarios (textos, imágenes, bases de datos, emails…) para que tu web y correo sea accesible por cualquier usuario en internet en cualquier momento.'
    // },
    // {
    //   title: 'Ecommmerce',
    //   content:
    //     'Comercio electrónico, es cualquier proceso de compra, venta de productos o prestación de servicios que se produce utilizando Internet y donde los cobros y pagos se gestionan de forma electrónica.'
    // },
    // {
    //   title: 'Dominio .com',
    //   content:
    //     "Es una extensión de dominio de nivel superior (TLD, por sus siglas en inglés) que se utiliza para sitios web comerciales. 'com' significa 'comercial' y es una de las extensiones de dominio más populares en todo el mundo."
    // },
    // {
    //   title: 'Dominio .pe',
    //   content:
    //     'Pertenecen a Perú y cuentan con una gran popularidad en el país, debido a que son utilizados por gran parte de las empresas locales y administraciones.'
    // },
    // {
    //   title: 'SEO',
    //   content:
    //     "Es la sigla para Search Engine Optimization, que significa 'optimización para motores de búsqueda'."
    // },
    // {
    //   title: 'Alta en Google',
    //   content:
    //     'Agregar un nuevo sitio al índice del buscador, para que éste lo considere cada vez que explore la web en busca de resultados para las búsquedas que realizan los usuarios. Es decir, estar indexado es el primer paso para que un sitio web se pueda posicionar en Google.'
    // },
    // {
    //   title: 'Correos corporativos',
    //   content:
    //     'Es una dirección de correo electrónico como cualquier otra y que generalmente puede contener el nombre comercial de una empresa.'
    // },
    {
      title: 'Brief',
      content:
        'Es un documento donde el cliente brinda información sobre su empresa dando a conocer sus metas, público objetivo, cuál es su competencia o cualquier otra información relevante con la finalidad de enfocar eficientemente el proyecto.'
    },
    {
      title: 'Flyers',
      content:
        'Volante publicitario con una o más páginas que sirve para difundir, promocionar o vender productos y servicios. Los puedes entregar en mano, compartir en redes sociales, enviar por email, buzonear o colocar en expositores para que los usuarios los retiren a su antojo.'
    },
    {
      title: 'Sustentación de propuesta',
      content:
        'Es un resumen de lo más importante del proyecto realizado, por tanto, solo debe ocuparse de detalles cuando el jurado lo requiera a través de preguntas. En el contenido de la presentación debe reinar el equilibrio: no puede faltar nada importante ni incluir especificaciones innecesarias.'
    },
    {
      title: 'Dashboard',
      content:
        'Es una herramienta de gestión de la información que monitoriza, analiza y muestra de manera visual los indicadores clave de desempeño (KPI), métricas y datos fundamentales para hacer un seguimiento del estado de una empresa, un departamento, una campaña o un proceso específico.'
    },
    {
      title: 'Métrica',
      content:
        'Es una ecuación que utiliza resultados de reglas de datos, conjuntos de reglas u otras métricas (es decir, estadísticas) como variables numéricas en la ecuación. Puede crear una métrica utilizando reglas de datos existentes, conjuntos de reglas y resultados de estadísticas de métricas.'
    },
    {
      title: 'Community Manager',
      content:
        'Realiza una variedad de funciones. A continuación, te presentamos las más relevantes: Creación de contenido: Debe ser capaz de crear contenido atractivo y relevante para la marca y para la audiencia. Esto incluye publicaciones en redes sociales, blogs, boletines informativos y más.'
    },
    {
      title: 'Brief',
      content:
        'Es un documento donde el cliente brinda información sobre su empresa dando a conocer sus metas, público objetivo, cuál es su competencia o cualquier otra información relevante con la finalidad de enfocar eficientemente el proyecto.'
    },
    {
      title: 'Flyers',
      content:
        'Volante publicitario con una o más páginas que sirve para difundir, promocionar o vender productos y servicios. Los puedes entregar en mano, compartir en redes sociales, enviar por email, buzonear o colocar en expositores para que los usuarios los retiren a su antojo.'
    },
    {
      title: 'Sustentación de propuesta',
      content:
        'Es un resumen de lo más importante del proyecto realizado, por tanto, solo debe ocuparse de detalles cuando el jurado lo requiera a través de preguntas. En el contenido de la presentación debe reinar el equilibrio: no puede faltar nada importante ni incluir especificaciones innecesarias.'
    }
  ]

  useEffect(() => {
    // Verifica que haya datos y un ID válido
    if (terminos.length > 0 && texto) {
      // Encuentra el producto con el ID específico
      const termino = terminos.find(
        (termino) => termino.title.toLowerCase() === texto
      )

      // Si el producto con el ID existe, navega a la sección correspondiente
      if (termino) {
        // Puedes cambiar 'sectionId' por el identificador real de la sección
        const sectionId = `${texto}`

        terminos.forEach((termino) => {
          const otherSectionId = `${termino.title}`
          const otherSectionElement = document.getElementById(otherSectionId)

          if (otherSectionElement) {
            otherSectionElement.style.border = 'none'
          }
        })

        const sectionElement = document.getElementById(sectionId)

        if (sectionElement) {
          // Realiza el scroll a esa sección
          sectionElement.scrollIntoView({ behavior: 'smooth' })

          // Agrega un borde al elemento específico
          sectionElement.classList.add('terminoSeleccionado')
        }

        // Si la sección existe, realiza el scroll a esa sección
        if (sectionElement) {
          sectionElement.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }
  }, [texto])

  const [modalContent, setModalContent] = useState({ title: '', content: '' })
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleCardClick = (title: string, content: string) => {
    setModalContent({ title, content })
    setIsModalOpen(true)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const handleClickOutsideModal = (event: any): void => {
    if (event.target.classList.contains('modalTermino')) {
      setIsModalOpen(false)
    }
  }

  return (
    <section className=" bg-white fondoTerminologia px-5 pb-8">

      <div className="flex gap-8 px-20  mt-16">

        <div className="w-full mx-auto flex gap-10">
          <div className="flex bg-main leftTerminos h-auto px-6 py-12 items-center relative before:absolute after:absolute after:bg-main after:border-t-8 after:border-main after:bottom-0 after:top-0 after:my-auto after:left-full  before:top-24 before:bottom-24 before:border-t-8 before:border-b-8 before:border-main before:left-full">
            <h2 className="text-ori text-4xl font-[800] uppercase text-[#252525]">
              Diseño gráfico
            </h2>
          </div>
          <Swiper
            slidesPerView={3}
            grid={{
              rows: 3,
              fill: 'row'
            }}
            spaceBetween={30}
            pagination={{
              clickable: true
            }}
            modules={[Grid, Pagination]}
            className="px-12 swp_terminos"
          >
            {terminos.map((termino, index) => (
              <SwiperSlide key={index} className="h-full">
                <CardTerminos
                  title={termino.title}
                  key={index}
                  selected={termino.title === texto}
                  onClick={() =>
                    handleCardClick(termino.title, termino.content)
                  }
                >
                  {termino.content}
                </CardTerminos>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
      <div className="px-20 py-12 flex justify-end">
        <button
          type="button"
          className="bg-main rounded-full shadow-xl px-10 py-3 text-2xl font-semibold flex items-center gap-2 transition-all hover:gap-3 hover:scale-[1.05]"
        >
          Desarrollo web <BsArrowRight className="font-bold text-2xl" />
        </button>
      </div>
      {isModalOpen && (
        <div
          onClick={() => {
            handleClickOutsideModal(event)
          }}
          className="modalTermino fixed top-0 left-0 bg-black/50 flex items-center justify-center h-screen z-[999] w-full"
        >
          <div className="bg-white max-w-[550px] w-full rounded-xl overflow-hidden">
            <h2 className="font_Archivo_bold text-2xl flex justify-between  px-4 py-2 bg-main text-nigga">
              {modalContent.title}{' '}
              <button onClick={closeModal} type="button" className="text-base">
                Cerrar
              </button>
            </h2>
            <p className="font_Archivo text-justify text-lg px-8 py-2">
              {modalContent.content}
            </p>
          </div>
        </div>
      )}

      {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-8 ">
        <div className="flex flex-col fondoCards rounded-xl border-2 border-main overflow-hidden bg-white">
                        <h5 className="font_Archivo_bold text-xl bg-main px-4 py-2 text-[#303030]">Landing page</h5>
                        <p className="font_Archivo text-justify px-4 py-2">Una landing page (página de inicio) es la página web a la que se dirige a un usuario de Internet después de hacer clic en un hipervínculo (ya sea que ese enlace sea una publicidad, un enlace en un correo electrónico o boletín, un botón de llamada a la acción.</p>
                    </div>

        {terminos.map((termino, index) => (
          <CardTerminos
            title={termino.title}
            key={index}
            selected={termino.title === texto}
            onClick={() => handleCardClick(termino)}
          >
            {termino.content}
          </CardTerminos>
        ))}
      </div> */}
    </section>
  )
}
