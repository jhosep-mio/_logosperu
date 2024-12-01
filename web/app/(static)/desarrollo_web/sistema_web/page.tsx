/* eslint-disable @next/next/no-img-element */
import { Header } from '@/public/components/web/structure/Header'
import { Selector } from './componentes/Selector'
import { Footer } from '@/public/components/web/structure/Footer'
import { ButtonCotizacion } from './componentes/ButtonCotizacion'
import { TextCotizacion } from './componentes/TextCotizacion'
import Link from 'next/link'
import { TextLeft } from '../../seo/animation/TextLeft'
export const metadata = {
  title: 'Desarrollo de sistemas web - Logos Perú',
  description:
    'Creamos diseño de Logotipos creativos y profesionales para su empresa o negocio en Perú, diferénciate, brindamos la mejor propuesta de diseño de logo que mostrará la identidad corporativa de su marca.',
  msvalidate: 'A01D8EBEAA551809606CCFFE234E6DF5',
  alternate: {
    canonical: 'https://logosperu.com.pe/diseno-logotipo'
  },
  generator: 'Microsoft FrontPage 4.0',
  dcLanguage: 'SPANISH',
  distribution: 'all',
  vw96ObjectType: 'Homepage',
  resourceType: 'Homepage',
  revisit: '1 days',
  robots: 'index,follow',
  pragma: 'no-cache',
  cacheControl: 'no-cache',
  fbAppId: '129856497709093',
  fbAdmins: '129856497709093',
  articlePublisher: 'https://www.facebook.com/DLogosPeru/',
  ogType: 'article',
  httpEquiv: {
    'content-type': 'text/html; charset=UTF-8',
    'content-language': 'es'
  },
  icons: {
    icon: '/assets/images/logos/logo.webp'
  },
  keywords: [
    'Agencia de Marketing Digital',
    'Agencia de diseño',
    'diseño de paginas web',
    'diseño grafico',
    'carritos de compras',
    'hosting',
    'venta de hosting',
    'dominios',
    'dominio .com',
    'dominio .pe',
    'dominio .com.pe',
    'tiendas virtuales',
    'web administrables',
    'posionamiento seo',
    'posicionamiento sem',
    'google adwords',
    'produccion audiovisual',
    'videos institucionales',
    'videos corporativos',
    'videos para empresas',
    'papelería',
    'brochures',
    'catalogo',
    'hojas menbretadas',
    'logos peru',
    'logos perú diseño de logotipos',
    'logos perú diseño de logos',
    'diseño de logotipos logos perú',
    'diseño de logos logos perú',
    'logos peru home',
    'home logos peru',
    'logotipos creativos',
    'logos creativos',
    'logos de diseño',
    'diseño de logotipos para empresas',
    'diseno de logotipos',
    'diseño de logotipos peru',
    'diseño de Logotipos',
    'logos',
    'logo',
    'logotipos',
    'crear logo',
    'servicios de logos',
    'Diseño Gráfico',
    'logo design',
    'make a logo',
    'design a logo',
    'how to design a logo',
    'diseño grafico',
    'diseño',
    'logotipo',
    'logos de empresas',
    'diseño web',
    'creador de logos',
    'como hacer un logo',
    'diseño de logos',
    'logotipos de empresas',
    'crear logo online',
    'imagen corporativa',
    'identidad corporativa',
    'logos para empresas',
    'diseñar logos',
    'crear logotipo',
    'logos online',
    'como diseñar un logo',
    'crear tu logo',
    'hacer logos online',
    'paginas para crear logos',
    'crear logos para empresa',
    'paginas para hacer logos',
    'logo empresa',
    'logotipos diseño',
    'empresas de diseño grafico',
    'logotipos de marcas',
    'diseño de marca',
    'diseño corporativo',
    'diseño grafico de logos',
    'creador de logos para empresas',
    'logotipos para empresas',
    'logos corporativos',
    'como hacer un logo de una empresa',
    'que es diseño de logotipos',
    'crear logotipos',
    'brochure',
    'flyers',
    'diseño de logo',
    'logos de diseñadores',
    'logos de eventos',
    'modelos de logos',
    'logos de dj',
    'logos para polos',
    'Crear logo gratis',
    'como crear logos gratis',
    'logo gratis',
    'crear logos gratis para empresas',
    'hacer logos gratis',
    'crea tu logo',
    'editor de logos',
    'logos de bancos',
    'los mejores logos',
    'logo definicion',
    'freelogos',
    'logos gratis',
    'logos crear',
    'que es el logotipo',
    'logos de marcas',
    'tipos de logos',
    'crear logos gratis',
    'logo free',
    'logos para restaurantes',
    'diseño online',
    'logotipos peru',
    'logos perú',
    'logos de peru',
    'logos del peru',
    'logos en peru',
    'logotipos de peru',
    'logotipos del peru',
    'logotipos en peru',
    'logos perú agencia de marketing digital',
    'agencia de marketing digital logos perú',
    'logos perú diseño web',
    'logos perú desarrollo web',
    'logos peru diseño web',
    'diseño web logos peru',
    'logos peru desarrollo web',
    'desarrollo web logos peru',
    'diseño y desarrollo web',
    'desarrollo web y diseño web',
    'diseño y desarrollo para paginas web',
    'desarrollo y diseño web para paginas web',
    'diseñpo web profesional',
    'diseño web peru',
    'empresas de diseño web',
    'tipos de diseño web',
    'tipos de desarrollo web',
    'desarrollo web profesional',
    'desarrollo web en peru',
    'diseño y desarrollo web en lima peru',
    'desarrollo y diseño web en lima peru',
    'diseño web para empresas',
    'desarrollo web para empresas',
    'diseño y desarrollo de paginas web para empresas',
    'desarrollo y diseño de paginas web para empresas',
    'diseño web responsive',
    'entornos de desarrollo web',
    'entornos de diseño web',
    'paginas de diseño web',
    'páginas de desarrollo web',
    'aplicaciones de desarrollo web',
    'aplicaciones de diseño web',
    'desarrollo y diseño de sitios web',
    'diseño y desarrollo de sitios web',
    'logos peru diseño grafico',
    'logos perú diseño gráfico',
    'diseño grafico',
    'diseño gráfico',
    'servico de diseño grafico',
    'servicio de diseño gráfico',
    'identidad corporativa',
    'flyer',
    'flyers',
    'tarjetas de presentacion',
    'hojas menbretadas',
    'volantes',
    'banners',
    'brochure',
    'manual de logotipo',
    'diseño de etiquetas',
    'tarjetas de presentación',
    'elementos graficos',
    'papeleria corporativa',
    'diseño grafico logos peru',
    'diseño gráfico logos perú',
    'proyectos graficos digitales',
    'medios digitales',
    'diseño grafico para redes sociales',
    'diseño grafico marcas',
    'marketing diseño grafico',
    'diseño grafico creativo',
    'diseño grafico profesional',
    'servico de diseño grafico en perú',
    'servico de diseño grafico en peru',
    'servicio de diseño grafico peru',
    'servicio de diseño grafico perú',
    'servicios de marketing digital',
    'marketing digital servicios',
    'agencia de marketing digital peru',
    'agencia de marketing digital perú',
    'servicios de marketing digital en peru',
    'servicios de marketing digital en perú',
    'posicionamiento web en google',
    'posicionamiento sem',
    'servicio de marketing digital comunity manager',
    'posicionamiento web con google ads',
    'posicionamiento web con google adwords',
    'posicionamiento web con facebook ads',
    'servicio digital comunity manager',
    'servicios de marketing y publicidad',
    'servicios que ofrece una agencia de marketing digital',
    'agencia digital',
    'agencias de marketing digital en perú',
    'cuales son los servicios de marketing digital',
    'listado de servicio de marketing digital',
    'que es servicio de marketing digital',
    'servicios de marketing digital precios',
    'propuesta de servicios de marketing digital',
    'servicio audiovisual',
    'servicios audiovisiales',
    'logos perú audiovisual',
    'audiovisual logos perú',
    'servicios audivisuales en perú',
    'servicios audivisuales en peru',
    'servicios audiovisuales para empresas',
    'produccion audiovisual',
    'videos corporativos',
    'videos institucionales',
    'videos animados',
    'videos promocionales',
    'videos corporativos animados',
    'videos corporativos grabados',
    'videos grabados',
    'videos publicitarios animados',
    'videos publicitarios grabados',
    'video promocionales grabados',
    'videos promicionales animados',
    'sesiones fotograficas y retoque',
    'sesion fotografica promacional',
    'sesion fotografica corporativa'
  ],
  authors: [{ name: 'Logos Perú' }],
  openGraph: {
    title: 'Diseño de Logotipos - Logos Perú',
    description:
      'Creamos diseño de Logotipos creativos y profesionales para su empresa o negocio en Perú, diferénciate, brindamos la mejor propuesta de diseño de logo que mostrará la identidad corporativa de su marca.',
    url: 'https://logosperu.com.pe/diseno-logotipo',
    site_name: 'Logos Perú',
    type: 'website',
    images: [
      {
        url: 'https://logosperu.com/public/img/seo/PORTADA_WEB_DISEÑO_LOGOTIPO.png'
      }
    ]
  },
  twitter: {
    site: '@DLogosPeru',
    title: 'Diseño de Logotipos - Logos Perú',
    description:
      'Creamos diseño de Logotipos creativos y profesionales para su empresa o negocio en Perú, diferénciate, brindamos la mejor propuesta de diseño de logo que mostrará la identidad corporativa de su marca.',
    creator: '@DLogosPeru',
    image:
      'https://logosperu.com/public/img/seo/PORTADA_WEB_DISEÑO_LOGOTIPO.png'
  }
}

export default async function SistemaWeb () {
  return (
    <>
      <Header />
      <section className=" lg:h-screen px-5 sm:px-8 md:px-12 lg:px-20 w-full pt-[128px] z-10 before:-z-10 bg-[url(/assets/images/servicios/sistema/fondo.webp)] bg-cover relative before:absolute before:w-full before:h-full before:top-0 before:left-0 before:bg-black before:opacity-50">
        <div className="w-full max-w-[1440px] altura_header mx-auto h-full">
          <div className="w-full h-full pb-8 lg:pb-0 flex gap-6 flex-col lg:flex-row items-center">
            <div className="w-full flex flex-col justify-center h-full lg:w-2/3">
              <h1 className="text-white text-4xl sm:text-5xl text-center lg:text-left lg:text-6xl xl:text-7xl font_allRound mb-8">
                <span className="text-main">
                  DESARROLLO <br />
                </span>
                DE SISTEMAS <span className="text-main">WEB</span>
              </h1>
              <p className="text-white text-[15px] sm:text-base text-center lg:text-left lg:text-xl leading-7 lg:pr-28">
                Un sistema web mejora la gestión y control de una empresa.
                Diseñamos sistemas personalizados que integran todas las áreas y
                ofrecen niveles de usuario para una gestión completa.
                Contáctanos para desarrollar una solución única para tu empresa.
              </p>

              <ButtonCotizacion className='bg-main mx-auto lg:mx-0 rounded-lg px-12 py-2 text-base md:text-xl font-bold text-nigga mt-12 w-fit'/>
            </div>
            <div className="w-full h-full lg:w-1/3">
              <Selector />
            </div>
          </div>
        </div>
      </section>
      <section className=" bg-white relative z-10 before:absolute before:w-full before:h-full before:top-0 before:left-0 before:bg-[url(/assets/images/servicios/diseno_grafico/huellas.png)] espejoBefore before:-z-10 before:bg-cover before:bg-top before:opacity-20">
        <div className="w-full flex flex-col lg:flex-row lg:gap-10">
          <div className="w-full lg:w-1/2 px-8 sm:px-12 md:px-20 lg:pl-40 py-20 lg:py-28">
            <h5 className="uppercase text-4xl lg:text-5xl font_allRound font-bold mb-8">
              FACIL DE <span className="text-main">USAR</span>
            </h5>
            <p className="text-base lg:text-2xl pr-12">
              Diseñamos sistemas web sencillos de usar que permiten una
              implementación inmediata en tu empresa con un sencillo
              introductorio de uso.
            </p>
            <TextCotizacion/>
          </div>
          <div className="w-full lg:w-1/2 overflow-hidden">
            <TextLeft direction="right" duracion={0.4} time={0}>
              <div className="w-full rounded-l-full overflow-hidden shadow-lg border-4 border-transparent hover:border-main border-r-0 transition-all">
                <img
                  src="/assets/images/servicios/sistema/item1.webp"
                  alt=""
                  className="w-full block h-[350px] md:h-[500px]  object-cover"
                />
              </div>
            </TextLeft>
          </div>
        </div>
      </section>
      <section className=" bg-white relative z-10 before:absolute before:w-full before:h-full before:top-0 before:left-0 before:bg-[url(/assets/images/servicios/diseno_grafico/huellas.png)]  before:-z-10 before:bg-cover before:bg-top before:opacity-20">
        <div className="w-full flex flex-col-reverse lg:flex-row lg:gap-10">
          <div className="w-full lg:w-1/2 overflow-hidden">
            <TextLeft direction="left" duracion={0.4} time={0}>
              <div className="w-full rounded-r-full overflow-hidden shadow-lg border-4 border-transparent hover:border-main border-l-0 transition-all">
                <img
                  src="/assets/images/servicios/sistema/item2.webp"
                  alt=""
                  className="w-full block h-[350px] md:h-[500px] object-cover"
                />
              </div>
            </TextLeft>
          </div>
          <div className="w-full lg:w-1/2 px-8 sm:px-12 md:px-20 lg:pl-40 py-20 lg:py-28">
            <h5 className="uppercase text-4xl lg:text-5xl font_allRound font-bold mb-8">
             RENDI<span className="text-main">MIENTO</span>
            </h5>
            <p className="text-base lg:text-2xl ">
            Tu sistema web estara pensado para tener un buen redimiento a la hora de interactuar entre modulos.
            </p>
            <TextCotizacion/>

          </div>
        </div>
      </section>
      <section className=" bg-white relative z-10 before:absolute before:w-full before:h-full before:top-0 before:left-0 before:bg-[url(/assets/images/servicios/diseno_grafico/huellas.png)] espejoBefore before:-z-10 before:bg-cover before:bg-top before:opacity-20">
        <div className="w-full flex flex-col lg:flex-row lg:gap-10">
          <div className="w-full lg:w-1/2 px-8 sm:px-12 md:px-20 lg:pl-40 py-20 lg:py-28">
            <h5 className="uppercase text-4xl lg:text-5xl font_allRound font-bold mb-8">
            PERSONA<span className="text-main">LIZADO</span>
            </h5>
            <p className="text-base lg:text-2xl pr-12">
            Tu sistema web estará adaptado a ti y a tu negocio, desarrollado para cubrir sus necesidades reales.
            </p>
            <TextCotizacion/>

          </div>
          <div className="w-full lg:w-1/2 overflow-hidden">
            <TextLeft direction="right" duracion={0.4} time={0}>
              <div className="w-full rounded-l-full overflow-hidden shadow-lg border-4 border-transparent hover:border-main border-r-0 transition-all">
                <img
                  src="/assets/images/servicios/sistema/item3.webp"
                  alt=""
                  className="w-full block h-[350px] md:h-[500px] object-cover"
                />
              </div>
            </TextLeft>
          </div>
        </div>
      </section>
      <section className=" bg-white relative z-10 before:absolute before:w-full before:h-full before:top-0 before:left-0 before:bg-[url(/assets/images/servicios/diseno_grafico/huellas.png)]  before:-z-10 before:bg-cover before:bg-top before:opacity-20">
        <div className="w-full flex flex-col-reverse lg:flex-row lg:gap-10">
          <div className="w-full lg:w-1/2 overflow-hidden">
            <TextLeft direction="left" duracion={0.4} time={0}>
              <div className="w-full rounded-r-full overflow-hidden shadow-lg border-4 border-transparent hover:border-main border-l-0 transition-all">
                <img
                  src="/assets/images/servicios/sistema/item4.webp"
                  alt=""
                  className="w-full block h-[350px] md:h-[500px] object-cover"
                />
              </div>
            </TextLeft>
          </div>
          <div className="w-full lg:w-1/2 px-8 sm:px-12 md:px-20 lg:pl-40 py-20 lg:py-28">
            <h5 className="uppercase text-4xl lg:text-5xl font_allRound font-bold mb-8">
              RESPON<span className="text-main">SIVE</span>
            </h5>
            <p className="text-base lg:text-2xl">
            Tu sistema web sera accesible desde cualquier dispositivo móvil y estara integrado con los dispositivos tecnológicos con los que operas.
            </p>
            <TextCotizacion/>

          </div>
        </div>
      </section>
      <section className='bg-white py-20 px-5'>
        <div className="w-full  grid grid-cols1 md:grid-cols-2 lg:grid-cols-2 max-w-7xl mx-auto gap-5">
            <Link href='/portafolio/desarrollo_web/rda' className="flex h-[650px] rounded-[1.2rem] overflow-hidden shadow-xl px-6 py-8 bg-[url(/assets/images/portafolio/web.webp)] transition-all bg-cover hover:bg-zoom1  bg-center z-10 relative before:absolute before:w-full before:h-full before:top-0 before:left-0 before:bg-black before:opacity-50 before:-z-10">
                <div className="flex flex-col justify-between">
                    <img src="https://rda.pe/assets/icon_morado-bdbb41ee.png" alt="" width={80} />
                    <h5 className='text-white text-2xl font-bold'>Radiología Dental Avanzanda</h5>
                </div>
            </Link>
            <Link href={'/portafolio/desarrollo_web/medicina_academica'} className="flex h-[650px] rounded-[1.2rem] overflow-hidden shadow-xl px-6 py-8 bg-[url(/assets/images/portafolio/desarrollo_web/medicina_academica/porta.webp)] transition-all bg-cover hover:bg-zoom1  bg-center z-10 relative before:absolute before:w-full before:h-full before:top-0 before:left-0 before:bg-black before:opacity-50 before:-z-10">
                <div className="flex flex-col justify-between">
                    <img src="/assets/images/portafolio/desarrollo_web/medicina_academica/ico.webp" alt="" width={80} />
                    <h5 className='text-white text-2xl font-bold'>Medicina Académica</h5>
                </div>
            </Link>

        </div>
      </section>

      <Footer />
      {/* <section className='descrip_logotipo pt-60 h-fit '>
          <div className='container w-full h-full flex items-center  max-w-[1200px] mx-auto justify-between'>
            <div className=''>
              <div className='col-lg-12 flex flex-col justify-start'>
                <h1 className='text-white text-left'>DESARROLLO DE SISTEMAS WEB</h1>
                <div className='flex'>
                  <hr className='hr_first' />
                  <hr className='hr_second' />
                </div>
                <div className='cont_descrip_logotipo'>
                  <p className='text-left '>
                    Un sistema web soluciona los problemas de gestión y control de las operaciones de una empresa, es por eso que el desarrollo digital de la empresa es importante, diseña hoy un sistema web a medida de las necesidades de su empresa. Controle cada área y departamento desde una sola plataforma, brinde le niveles de usuarios a sus colaboradores para una gestión integral, invitanos a conocer tu empresa hoy para desarrollar una herramienta única y a su medida.
                  </p>
                </div>
                <button className='bg-gradient-to-r bont_baloo from-primary to-secondary w-fit px-10 py-3 rounded-xl text-white font_bold text-3xl'>Solicitar cotización</button>
              </div>
            </div>
            <div className='shadow_comunity2 h-full w-[50%]'>
              <img
                src='/sistemaweb/ICONO.png'
                alt='Diseño Grafico'
                className='mx-aut w-full h-[460px] object-contain px-16'
              />
            </div>
          </div>
        </section>

        <section className='py-6 bg-gradient-to-r from-[#c4607a] to-[#846dbb] relative '>
          <div className='container max-w-[1200px] mx-auto'>
            <div>
              <h2 className='text-6xl  font-extrabold font_baloo text-center text-white'>
                ¿CUÁLES SERÁN LAS CARACTERÍSTICAS DE TU SISTEMA WEB?
              </h2>
            </div>
          </div>
          <span className='absolute top-full left-20 bg-white w-32 h-20 clyppy_poligon' />
        </section>

        <section className='bg-[url(https://sistemasperuweb.com/img/web/servicios-de-paginas-web.jpg)] bg-cover bg-no-repeat font_baloo'>
          <div className='w-full grid grid-cols-3 justify-center p-10 max-w-[1450px] mx-auto'>
            <div className='w-full h-full flex flex-col justify-center px-8'>
              <img
                src='/sistemaweb/facil.png' alt='' className='w-64 h-64 object-contain mx-auto filter-green'
              />
              <h2 className='text-white font-bold text-center text-4xl'>FACIL DE USAR</h2>
              <p className='text-[1.7rem] text-white text-center'>Diseñamos sistemas web sencillos de usar que permiten una implementación inmediata en tu empresa con un sencillo introductorio de uso.</p>
            </div>
            <div className='w-full h-full flex flex-col justify-center px-8'>
              <img src='/sistemaweb/rendimiento.png' alt='' className='w-64 h-64 object-contain mx-auto' />
              <h2 className='text-white font-bold text-center text-4xl'>RENDIMIENTO</h2>
              <p className='text-[1.7rem] text-white text-center'>Tu sistema web estara pensado para tener un buen redimiento a la hora de interactuar entre modulos.</p>
            </div>
            <div className='w-full h-full flex flex-col justify-center px-8'>
              <img src='/sistemaweb/personalizado.png' alt='' className='w-64 h-64 object-contain mx-auto' />
              <h2 className='text-white font-bold text-center text-4xl'>PERSONALIZADO</h2>
              <p className='text-[1.7rem] text-white text-center'>Tu sistema web estará adaptado a ti y a tu negocio, desarrollado para cubrir sus necesidades reales.</p>
            </div>
            <div className='w-full h-full flex flex-col justify-center px-8'>
              <img src='/sistemaweb/responsive.png' alt='' className='w-64 h-64 object-contain mx-auto' />
              <h2 className='text-white font-bold text-center text-4xl'>RESPONSIVE</h2>
              <p className='text-[1.7rem] text-white text-center'>Tu sistema web sera accesible desde cualquier dispositivo móvil y estara integrado con los dispositivos tecnológicos con los que operas.</p>
            </div>
            <div className='w-full h-full flex flex-col justify-center px-8'>
              <img src='/sistemaweb/escalabilidad.png' alt='' className='w-64 h-64 object-contain mx-auto' />
              <h2 className='text-white font-bold text-center text-4xl'>ESCALABILIDAD</h2>
              <p className='text-[1.7rem] text-white text-center'>Su sistema esta orientado a la escalabilidad de las necesidades de su empresa disponible para la expansión en función al crecimiento de sus necesidades.</p>
            </div>
            <div className='w-full h-full flex flex-col justify-center px-8'>
              <img src='/sistemaweb/integracion_teconologica.png' alt='' className='w-64 h-64 object-contain mx-auto' />
              <h2 className='text-white font-bold text-center text-4xl'>INTEGRACIÓN TECNOLÓGICA</h2>
              <p className='text-[1.7rem] text-white text-center'>Ya sea la trazabilidad de productos o seguimiento por GPS, tenemos la capacidad de integrar tu sistema con diferentes tecnologias.</p>
            </div>
          </div>
        </section>

        <section className='py-10 bg-[#F9F8FF] mt-20'>
          <div className='container max-w-[1200px] mx-auto overflow-hidden'>
            <div>
              <h2 className='text-5xl lg:text-7xl font-extrabold font_baloo text-center text-secondary'>
                NUESTRO PROCESO
              </h2>
            </div>
          </div>
        </section>

        <div className='max-w-[1200px] mx-auto font_baloo my-32'>
          <div className='w-full grid grid-cols-3 gap-10'>
            <div className='flex flex-col w-full border-2 p-6 border-primary rounded-3xl relative'>
              <span className='absolute w-fit px-16 py-3 bg-secondary -top-8 left-0 right-0 mx-auto rounded-2xl text-center text-white font-bold text-4xl'>01</span>
              <img src='https://sistemasperuweb.com/img/sistemas/presupuesto.jpg' alt='' className='w-92  object-contain mx-auto' />
              <h2 className='text-primary font-boloo text-[2.7rem] text-center mt-0'>Proyectos a presupuesto cerrado</h2>
              <p className='text-3xl text-center mt-6'>Se define y detalla el alcance del proyecto en la propuesta comercial, estableciendo el costo, el tiempo de entrega y la modalidad de pago.</p>
            </div>
            <div className='flex flex-col w-full border-2 p-6 border-primary rounded-3xl relative'>
              <span className='absolute w-fit px-16 py-3 bg-secondary -top-8 left-0 right-0 mx-auto rounded-2xl text-center text-white font-bold text-4xl'>01</span>
              <img src='https://sistemasperuweb.com/img/sistemas/desarrollo.jpg' alt='' className='w-92  object-contain mx-auto' />
              <h2 className='text-primary font-boloo text-[2.7rem] text-center mt-0'>Horas de desarrollo</h2>
              <p className='text-3xl text-center mt-6'>Se analizan las horas que requiere el/los proyectos y se avanza según las prioridades definidas por el cliente, llevando un detallado informe sobre las tareas realizadas.</p>
            </div>
            <div className='flex flex-col w-full border-2 p-6 border-primary rounded-3xl relative'>
              <span className='absolute w-fit px-16 py-3 bg-secondary -top-8 left-0 right-0 mx-auto rounded-2xl text-center text-white font-bold text-4xl'>01</span>
              <img src='https://sistemasperuweb.com/img/sistemas/recursos.jpg' alt='' className='w-92  object-contain mx-auto' />
              <h2 className='text-primary font-boloo text-[2.7rem] text-center mt-0'>Contratación de recursos</h2>
              <p className='text-3xl text-center mt-6'>Se definen la cantidad y perfil de los recursos (analísta, programador, diseñador, team leader, etc.) y se definen objetivos (método scrum).</p>
            </div>
          </div>
        </div> */}
    </>
  )
}
