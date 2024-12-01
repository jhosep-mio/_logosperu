import { FaHeadphonesSimple } from 'react-icons/fa6'
import facebook from './../../../assets/redes/facebook.png'
import instagram from './../../../assets/redes/instagram.png'
import tiktok from './../../../assets/redes/tik-tok.png'
import { Link } from 'react-router-dom'
import { GiHamburgerMenu } from 'react-icons/gi'
import { motion, AnimatePresence } from 'framer-motion'
import { useEffect, useState } from 'react'
import { ModalCart } from '../modals/ModalCart'
import { AlertSucess } from '../../shared/alerts/AlertSucess'
import useAuth from '../../../hooks/useAuth'
import { Global } from '../../../helper/Global'
import axios from 'axios'
import { type paginaValues, type ConfiguracionValues } from '../../shared/interface'

export const Header = ({ datos }: { datos: paginaValues | null, id: string | undefined }): JSX.Element => {
  const { showError, setShowError } = useAuth()
  const [open, setOpen] = useState(false)
  const [openCart, setOpenCart] = useState(false)
  const [data, setData] = useState<ConfiguracionValues | null>(null)
  const getInfo = async (): Promise<void> => {
    try {
      const request = await axios.get(`${Global.url}/oneConfi/1`)
      setData(request.data)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    window.scrollTo(0, 0)
    Promise.all([getInfo()]).then(() => {})
  }, [])

  useEffect(() => {
    setTimeout(() => {
      if (showError != null) {
        setShowError(null)
      }
    }, 3000)
  }, [showError])

  return (
    <>
      <header className="w-full bg-white fixed top-0 left-0 right-0 md:relative shadow-sm md:shadow-none z-40">
        <nav className="w-full flex items-center py-3 px-4 md:px-10 border-b border-gray-300">
          <div className="w-[30%] hidden md:flex items-center h-full gap-3">
            <FaHeadphonesSimple className="h-full my-auto text-dynamic text-3xl"/>
            <div className="flex flex-col">
              <span className="text-sm text-gray-600">LLAMANOS</span>
              <a
                href={`tel:+51${datos?.configuracion.celular ?? ''}`}
                className="font-bold text-base"
              >
                +51 {datos?.configuracion.celular}
              </a>
            </div>
          </div>
          <div className="w-[30%] flex md:hidden items-center h-full gap-3">
            <GiHamburgerMenu
              className="h-full my-auto  text-3xl"
              onClick={() => {
                setOpen(!open)
              }}
            />
          </div>
          <div className="w-full ">
            <Link to="/">
                {datos?.configuracion?.logo &&
                <img
                    src={`${Global.urlproduccionImagen}/clasificados/${datos?.configuracion?.logo ?? ''}`}
                    alt=""
                    className="w-full h-[50px] md:h-[71px] object-contain"
                />
                }
            </Link>
          </div>
          <div className="w-[30%] flex gap-3 items-center justify-end">
            <div className="flex gap-3 ">
                <Link target="_blank" to={datos?.configuracion.facebook ?? ''}>
                <img
                    src={facebook}
                    className="w-5 h-5 md:w-6 md:h-6 object-contain hover:scale-105"
                />
                </Link>
                <Link target="_blank" to={datos?.configuracion.instragram ?? ''}>
                <img
                    src={instagram}
                    className="w-5 h-5 md:w-6 md:h-6 object-contain hover:scale-105"
                />
                </Link>
                <Link target="_blank" to={datos?.configuracion.tiktok ?? ''}>
                <img
                    src={tiktok}
                    className="w-5 h-5 md:w-6 md:h-6 object-contain hover:scale-105"
                />
                </Link>
            </div>
          </div>
        </nav>
        <div className="w-full hidden md:block">
          <ul className="flex gap-5 md:gap-10 justify-center py-4 w-full ">
            {datos?.internas?.interna1 &&
                <a
                href='#productos'
                className={'hover:hover:text-dynamic transition-colors text-sm md:text-base'}
                >
                {datos?.internas?.interna1}
                </a>
            }
             {datos?.internas?.interna2 &&
            <a
             href='#marcas'
              className="hover:text-dynamic transition-colors text-sm md:text-base"
            >
              {datos?.internas?.interna2}
            </a>}
            {datos?.internas?.interna3 &&
            <a
              href='#nosotros'
              className="hover:text-dynamic transition-colors text-sm md:text-base"
            >
              {datos?.internas?.interna3}
            </a>}
            {datos?.internas?.interna4 &&
            <a
              href='#contacto'
              className="hover:text-dynamic transition-colors text-sm md:text-base"
            >
              {datos?.internas?.interna4}
            </a>}
          </ul>
        </div>
        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, left: '-100%' }}
              animate={{ opacity: 1, left: '0%' }}
              exit={{ opacity: 0, left: '-100%' }}
              className="bg-gray-100 shadow-md w-full  absolute top-full z-10 left-0 right-0 md:hidden"
            >
              <ul className="flex flex-col gap-5 md:gap-10 px-4 justify-center py-4 w-full border-b border-b-gray-300">
              {datos?.internas?.interna1 &&
                <a
                  href={'#categorias'}
                  onClick={() => { setOpen(false) }}
                  className="hover:text-dynamic transition-colors text-base"
                >
                  {datos?.internas?.interna1}
                </a>}
                {datos?.internas?.interna2 &&
                <a
                 href={'#productos'}
                  onClick={() => { setOpen(false) }}
                  className="hover:text-dynamic transition-colors text-base"
                >
                  {datos?.internas?.interna2}
                </a>}
                {datos?.internas?.interna3 &&
                <a
                  href={'#contacto'}
                  onClick={() => { setOpen(false) }}
                  className="hover:text-dynamic transition-colors text-base"
                >
                  {datos?.internas?.interna3}
                </a>}
                {datos?.internas?.interna4 &&
                <a
                  href={'#marcas '}
                  onClick={() => { setOpen(false) }}
                  className="hover:text-dynamic transition-colors text-base"
                >
                    {datos?.internas?.interna4}
                </a>}

              </ul>
              <div className="flex items-center">
                <div className="w-full flex items-center h-full gap-3 p-4">
                  <FaHeadphonesSimple className="h-full my-auto text-dynamic text-2xl" />
                  <div className="flex flex-col">
                    <span className="text-xs text-gray-600">LLAMANOS</span>
                    <a
                      href={`tel:+51${data?.celular1 ?? ''}`}
                      className="font-bold text-sm"
                    >
                      +51 {data?.celular1}
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <ModalCart open={openCart} setOpen={setOpenCart} />
      </header>
      <AnimatePresence>
        {showError != null && <AlertSucess showError={showError} />}
      </AnimatePresence>
    </>
  )
}
