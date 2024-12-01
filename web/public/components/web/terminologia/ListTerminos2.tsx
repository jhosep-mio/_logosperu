"use client";
import React, { useState } from "react";

import { CardTerminos } from "@/public/components/web/terminologia/CardTerminos";
// Import Swiper React components
import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/grid";
import "swiper/css/pagination";
import { BsArrowRight } from "react-icons/bs";
// import required modules
import { Grid, Pagination } from "swiper/modules";
export const ListTerminos2 = ({ area }: { area: string }) => {
  const terminosDesarrollo = [
    {
      title: "Landing page",
      content:
        "Una landing page (página de inicio) es la página web a la que se dirige a un usuario de Internet después de hacer clic en un hipervínculo (ya sea que ese enlace sea una publicidad, un enlace en un correo electrónico o boletín, un botón de llamada a la acción.",
    },
    {
      title: "Pasarela de pagos",
      content:
        "Son servicios de pago que normalmente se prestan a cambio de una cuota adicional, y que procesan tarjetas bancarias online por medio de una página de e-commerce, o en persona por medio de un datáfono.",
    },
    {
      title: "Brief de desarrollo web",
      content:
        "El briefing de diseño web es una herramienta clave para iniciar o mejorar un proyecto en línea. Este documento debe incluir información relevante y necesaria para que la agencia de marketing digital pueda trabajar en el proyecto y hacerlo realidad.",
    },
    {
      title: "Hosting",
      content:
        "Alojamiento web, es un servicio donde podrás alojar todos los contenidos necesarios (textos, imágenes, bases de datos, emails…) para que tu web y correo sea accesible por cualquier usuario en internet en cualquier momento.",
    },
    {
      title: "Ecommmerce",
      content:
        "Comercio electrónico, es cualquier proceso de compra, venta de productos o prestación de servicios que se produce utilizando Internet y donde los cobros y pagos se gestionan de forma electrónica.",
    },
    {
      title: "Dominio .com",
      content:
        "Es una extensión de dominio de nivel superior (TLD, por sus siglas en inglés) que se utiliza para sitios web comerciales. 'com' significa 'comercial' y es una de las extensiones de dominio más populares en todo el mundo.",
    },
    {
      title: "Dominio .pe",
      content:
        "Pertenecen a Perú y cuentan con una gran popularidad en el país, debido a que son utilizados por gran parte de las empresas locales y administraciones.",
    },
    {
      title: "SEO",
      content:
        "Es la sigla para Search Engine Optimization, que significa 'optimización para motores de búsqueda'.",
    },
    {
      title: "Alta en Google",
      content:
        "Agregar un nuevo sitio al índice del buscador, para que éste lo considere cada vez que explore la web en busca de resultados para las búsquedas que realizan los usuarios. Es decir, estar indexado es el primer paso para que un sitio web se pueda posicionar en Google.",
    },
    {
      title: "Correos corporativos",
      content:
        "Es una dirección de correo electrónico como cualquier otra y que generalmente puede contener el nombre comercial de una empresa.",
    },
  ];

  const terminosDiseno = [
    {
      title: "Brief",
      content:
        "Es un documento donde el cliente brinda información sobre su empresa dando a conocer sus metas, público objetivo, cuál es su competencia o cualquier otra información relevante con la finalidad de enfocar eficientemente el proyecto.",
    },
    {
      title: "Flyers",
      content:
        "Volante publicitario con una o más páginas que sirve para difundir, promocionar o vender productos y servicios. Los puedes entregar en mano, compartir en redes sociales, enviar por email, buzonear o colocar en expositores para que los usuarios los retiren a su antojo.",
    },
    {
      title: "Sustentación de propuesta",
      content:
        "Es un resumen de lo más importante del proyecto realizado, por tanto, solo debe ocuparse de detalles cuando el jurado lo requiera a través de preguntas. En el contenido de la presentación debe reinar el equilibrio: no puede faltar nada importante ni incluir especificaciones innecesarias.",
    },
    {
      title: "Dashboard",
      content:
        "Es una herramienta de gestión de la información que monitoriza, analiza y muestra de manera visual los indicadores clave de desempeño (KPI), métricas y datos fundamentales para hacer un seguimiento del estado de una empresa, un departamento, una campaña o un proceso específico.",
    },
    {
      title: "Métrica",
      content:
        "Es una ecuación que utiliza resultados de reglas de datos, conjuntos de reglas u otras métricas (es decir, estadísticas) como variables numéricas en la ecuación. Puede crear una métrica utilizando reglas de datos existentes, conjuntos de reglas y resultados de estadísticas de métricas.",
    },
    {
      title: "Community Manager",
      content:
        "Realiza una variedad de funciones. A continuación, te presentamos las más relevantes: Creación de contenido: Debe ser capaz de crear contenido atractivo y relevante para la marca y para la audiencia. Esto incluye publicaciones en redes sociales, blogs, boletines informativos y más.",
    },
    {
        title: "Branding",
        content:
          "El proceso de crear y gestionar la identidad de una marca, incluyendo su nombre, logo, mensaje y otros elementos visuales y emocionales que la diferencian y la hacen reconocible para los consumidores.",
      },
      {
        title: "Brochure",
        content:
          "Un folleto informativo o publicitario, generalmente en formato impreso, que presenta información sobre productos, servicios o eventos de una empresa u organización de manera atractiva y concisa.",
      },
      {
        title: "Reel",
        content:
          "Un video corto, a menudo utilizado en plataformas de redes sociales como Instagram o TikTok, que muestra contenido creativo, entretenido o informativo en un formato de clips breves para captar la atención de la audiencia rápidamente.",
      },
    
  ];

  const terminosCapacitaciones = [
    {
      title: "Google Ads",
      content:
        "Es el programa de publicidad en línea de Google. A través de Google Ads, puedes crear anuncios en línea para llegar a las personas exactamente cuando están interesadas en los productos o servicios que ofreces.",
    },
    {
      title: "Facebook Ads",
      content:
        "Es la plataforma publicitaria de la red social Facebook. Su objetivo es promocionar productos y servicios mediante publicaciones o anuncios de texto, imagen o vídeo. Es ampliamente utilizado debido a su gran audiencia y posibilidades de segmentación.",
    },
    {
      title: "Palabras clave",
      content:
        "Son términos de búsqueda utilizados para optimizar una web o contenido. Representan lo que las personas buscan en motores de búsqueda y son fundamentales para estrategias de marketing y SEO.",
    },
    {
      title: "Google Trends",
      content:
        "Es una herramienta gratuita de Google que muestra gráficos sobre la frecuencia con la que se buscan palabras, frases o temas en un período de tiempo determinado. Ayuda a comprender tendencias y picos de búsqueda.",
    },
    {
      title: "Presupuesto",
      content:
        "En economía, se refiere a la cantidad de dinero necesaria para cubrir gastos relacionados con un proyecto. Es una estimación anticipada del coste para lograr un objetivo específico.",
    },
    {
      title: "Puja",
      content:
        "En publicidad en línea, la puja es la cantidad máxima que un anunciante está dispuesto a pagar por un clic en su anuncio. Es relevante en plataformas como Google Ads y Facebook Ads.",
    },
    {
      title: "Google Analytics",
      content:
        "Es una herramienta de análisis web que permite rastrear y medir el tráfico de un sitio web. Proporciona datos sobre visitantes, comportamiento y conversiones.",
    },
    {
      title: "CPP (Costo por Clic)",
      content:
        "Es el importe que se paga por cada clic en un anuncio. Es una métrica importante en campañas de publicidad en línea.",
    },
    {
      title: "Dashboard",
      content:
        "Es un panel de control visual que muestra datos e indicadores clave de un sistema o proceso. En marketing, se utiliza para monitorear métricas y tomar decisiones informadas",
    },
  ];

  const terminosHosting = [
    {
        "title": "Almacenamiento web",
        "content": "Espacio en disco que se asigna para guardar archivos de un sitio web."
    },
    {
        "title": "Ancho de banda",
        "content": "La cantidad de datos que pueden ser transmitidos a través de una conexión en un período de tiempo dado."
    },
    {
        "title": "DNS (Domain Name System)",
        "content": "Sistema que traduce nombres de dominio legibles por humanos en direcciones IP comprensibles por las computadoras."
    },
    {
        "title": "Transferencia de dominio",
        "content": "Proceso de cambiar la administración de un nombre de dominio de un registrador a otro."
    },
    {
        "title": "SSL (Secure Sockets Layer)",
        "content": "Protocolo de seguridad que cifra la comunicación entre un navegador web y un servidor web para proteger la integridad y confidencialidad de los datos transmitidos."
    },
    {
        "title": "Renovación de dominio",
        "content": "Extensión del registro de un nombre de dominio después de que expira su período inicial."
    },
    {
        "title": "Subdominio",
        "content": "Parte de un dominio que precede al nombre de dominio principal y que generalmente se usa para organizar contenido dentro de un sitio web."
    },
    {
        "title": "Soporte técnico",
        "content": "Servicio proporcionado para ayudar a los usuarios a resolver problemas técnicos relacionados con sus correos corporativos."
    },
    {
        "title": "Hosting",
        "content": "Servicio que proporciona espacio en servidores de internet para almacenar y hacer accesibles sitios web."
    }
  ]

  const terminosCommunity = [
    {
        "title": "Brief",
        "content": "Documento que resume los objetivos, estrategias y detalles clave de una campaña publicitaria o proyecto creativo."
    },
    {
        "title": "Hashtag",
        "content": "Palabra o frase precedida por el símbolo # utilizada en redes sociales para categorizar y facilitar la búsqueda de contenido relacionado."
    },
    {
        "title": "Facebook ads",
        "content": "Plataforma de publicidad en Facebook que permite a las empresas crear anuncios dirigidos a audiencias específicas basadas en demografía, intereses y comportamiento."
    },
    {
        "title": "Meta business",
        "content": "Plataforma de gestión de cuentas publicitarias y activos de marketing en Facebook y otras aplicaciones de Meta, como Instagram y Messenger."
    },
    {
        "title": "Métricas",
        "content": "Datos y estadísticas utilizados para medir el rendimiento de campañas y publicaciones en redes sociales, como alcance, impresiones, clics y conversiones."
    },
    {
        "title": "Post",
        "content": "Publicación de contenido en una plataforma de redes sociales, que puede incluir texto, imágenes, videos o enlaces."
    },
    {
        "title": "Followers",
        "content": "Usuarios que eligen suscribirse a las actualizaciones de una cuenta en redes sociales, recibiendo su contenido regularmente."
    },
    {
        "title": "Plan de contenido",
        "content": "Estrategia organizada para la creación y publicación de contenido en redes sociales, detallando tipos de contenido, calendario de publicaciones y objetivos."
    },
    {
        "title": "Copy",
        "content": "Texto persuasivo y atractivo utilizado en publicidad y marketing para captar la atención y motivar a la audiencia a realizar una acción específica."
    }
  ]

  let terminos;
  let title;
  if (area === "diseno") {
    terminos = terminosDiseno;
    title = "Diseño gráfico";
  }

  if (area === "desarrollo") {
    terminos = terminosDesarrollo;
    title = "Desarrollo web";
  }
  if (area === "community") {
    terminos = terminosCommunity;
    title = "Community Manager";
  }

  if (area === "hosting") {
    terminos = terminosHosting;
    title = "Hosting y dominio";
  }

  if (area === "capacitaciones") {
    terminos = terminosCapacitaciones;
    title = "Capacitaciones";
  }

  const [modalContent, setModalContent] = useState({ title: "", content: "" });
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCardClick = (title: string, content: string) => {
    setModalContent({ title, content });
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleClickOutsideModal = (event: any): void => {
    if (event.target.classList.contains("modalTermino")) {
      setIsModalOpen(false);
    }
  };

  return (
    <section className=" bg-white fondoTerminologia px-5 lg:px-5 pb-8">
      <div className="flex gap-3 lg:gap-8 px-0 lg:px-10 xl:px-20 mt-6 lg:mt-16">
        <div className="w-full mx-auto flex gap-10">
          <div className="hidden lg:flex bg-main leftTerminos h-auto px-6 py-12 items-center relative before:absolute after:absolute after:bg-main after:border-t-8 after:border-main after:bottom-0 after:top-0 after:my-auto after:left-full  before:top-24 before:bottom-24 before:border-t-8 before:border-b-8 before:border-main before:left-full">
            <h2 className="text-ori text-4xl font-[800] uppercase text-[#252525]">
              {title}
            </h2>
          </div>
          <Swiper
            slidesPerView={3}
            grid={{
              rows: 3,
              fill: "row",
            }}
            spaceBetween={30}
            pagination={{
              clickable: true,
            }}
            breakpoints={{
              0: {
                grid: {
                  rows: 3,
                  fill: "row",
                },
                slidesPerView: 1,
                spaceBetween: 10,
              },
              576: {
                grid: {
                  rows: 3,
                  fill: "row",
                },
                slidesPerView: 2,
                spaceBetween: 10,
              },
              768: {
                grid: {
                  rows: 3,
                  fill: "row",
                },
                slidesPerView: 2,
                spaceBetween: 10,
              },
              992: {
                grid: {
                  rows: 3,
                  fill: "row",
                },
                slidesPerView: 3,
                spaceBetween: 10,
              },
              1200: {
                grid: {
                  rows: 3,
                  fill: "row",
                },
                slidesPerView: 3,
              },
            }}
            modules={[Grid, Pagination]}
            className="px-12 swp_terminos pb-4"
          >
            {terminos?.map((termino, index) => (
              <SwiperSlide key={index} className="h-full">
                <CardTerminos
                  title={termino.title}
                  key={index}
                  selected={false}
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
            handleClickOutsideModal(event);
          }}
          className="modalTermino fixed top-0 left-0 bg-black/50 flex items-center justify-center h-screen z-[999] w-full"
        >
          <div className="bg-white max-w-[550px] w-[90%] lg:w-full rounded-xl overflow-hidden">
            <h2 className="font_Archivo_bold text-2xl flex justify-between  px-4 py-2 bg-main text-nigga">
              {modalContent.title}{" "}
              <button onClick={closeModal} type="button" className="text-base">
                Cerrar
              </button>
            </h2>
            <p className="font_Archivo text-justify text-lg px-4 lg:px-8 py-2">
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
  );
};
