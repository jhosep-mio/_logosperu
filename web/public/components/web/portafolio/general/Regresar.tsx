import Link from 'next/link'
import { FaAngleLeft } from 'react-icons/fa6'
export const Regresar = () => {
  return (
    <Link
    href="/portafolio"
    target="_blank"
    className="fixed z-[999] flex  items-center justify-center gap-2 bottom-3 md:bottom-6 left-4 w-[47px] h-[47px] lg:h-fit lg:w-fit  md:left-6 bg-yellow-400 text-azul_serio font-light px-2 lg:px-6 py-2 rounded-full uppercase transition-all hover:bg-main shadow font_Archivo_bold"
    rel="noreferrer"
  >
    <FaAngleLeft className="text-2xl lg:text-xl" />{' '}
    <span className="hidden md:block"> Ver portafolio</span>
  </Link>
  )
}
