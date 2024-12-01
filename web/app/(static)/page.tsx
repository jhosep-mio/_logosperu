import { generateMetadata } from '@/public/components/seo/SeoList'
import { Count } from '@/public/components/web/home/nosotros/Count'
import { Question } from '@/public/components/web/home/nosotros/Question'
import { PlanesPage } from '@/public/components/web/home/planes/PlanesPage'
import { Portafolio } from '@/public/components/web/home/portafolio/Portafolio'
import { Redes } from '@/public/components/web/home/Redes'
import { Main } from '@/public/components/web/home/slides/Main'
import { SwiperMarcas } from '@/public/components/web/home/slides/SwiperMarcas'
import { Footer } from '@/public/components/web/structure/Footer'
import { Header } from '@/public/components/web/structure/Header'
import Images from '@/public/components/web/structure/home/Images'

export const metadata = generateMetadata()

export default function Home () {
  return (
    <section className="relative z-10">
      <Header />
      <Redes />
      <section className="degraded_main bannerMain relative h-[510px] overflow-hidden md:h-[720px] lg:h-screen">
        <div className="relative z-[1] flex h-full flex-col justify-between overflow-hidden pb-10 pt-[12vh] lg:px-20 lg:pb-0 lg:pl-0 lg:pr-0 lg:pt-[16vh] xl:px-28 xl:pl-5 xl:pr-5 2xl:flex-row 2xl:px-36 2xl:pr-0">
          <Main />
          <Images />
        </div>
      </section>
      <section className="fondo--nosotros bg-[#EDEDED] px-0 xl:px-20">
        <div className="flex flex-col justify-between xl:flex-row">
          <div className="w-full overflow-x-hidden px-4 py-16 md:px-16 lg:py-32 xl:w-2/3">
            <Question />
            <p className="px-0 text-justify text-base font-[400] text-azul_serio md:px-5 lg:px-10 lg:text-xl">
              Somos una agencia digital comprometida. En Logos Perú, ofrecemos
              soluciones integrales, gestiones personalizadas y asesoramientos
              especializados. Nuestro enfoque incluye capacitaciones continuas,
              aliados estratégicos, soporte constante y seguimiento detallado
              para garantizar beneficios tangibles para tu proyecto.
            </p>
            <picture className="nosotros--logo-azul">
              <img
                src="/assets/images/logos/logo_azul.webp"
                alt="Logos Perú"
                className="mx-auto mt-14 block w-[70%] object-contain lg:w-[380px]"
              />
            </picture>
          </div>
          <Count />
        </div>
      </section>
      <SwiperMarcas />
      <PlanesPage />
      <Portafolio />
      <Footer />
    </section>
  )
}
