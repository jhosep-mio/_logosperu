import { FloatingWhatsApp } from 'react-floating-whatsapp'
import { FaPhoneSquareAlt } from 'react-icons/fa'
import { useState } from 'react'
import { Global } from '../../../helper/Global'
import axios from 'axios'
import {
  type productosValuesPagina,
  type paginaValues
} from '../../shared/interface'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import useAuth from '../../../hooks/useAuth'
import { Errors } from '../../shared/Errors'
import { ImMail } from 'react-icons/im'
import { Link } from 'react-router-dom'
import facebook from './../../../assets/redes/facebook.png'
import instagram from './../../../assets/redes/instagram.png'
import tiktok from './../../../assets/redes/tik-tok.png'

const SchemaContacto = Yup.object().shape({
  nombres: Yup.string()
    .required('Este campo es requerido')
    .min(3, 'Debe tener como minimo 3 digitos'),
  celular: Yup.string()
    .required('Este campo es requerido')
    .min(9, 'Debe tener como minimo 9 digitos'),
  email: Yup.string()
    .required('Este campo es requerido')
    .email('Introduce un email válido'),
  mensaje: Yup.string()
    .required('Este campo es requerido')
    .min(5, 'Debe tener como minimo 5 digitos')
})

export const Footer = ({
  data
}: {
  data: paginaValues | null
}): JSX.Element => {
  const { setShowError } = useAuth()
  const [loadingCorreo, setLoadingCorreo] = useState<boolean>(false)
  const logo = `${Global.urlproduccionImagen}/clasificados/${
    data?.configuracion?.logo ?? ''
  }`
  const empresa = data?.configuracion?.nombre
  const correo = data?.configuracion?.correo

  const enviarCorreo = async (): Promise<void> => {
    setLoadingCorreo(true)
    const data = new FormData()
    data.append('nombres', values.nombres)
    data.append('apellidos', values.apellidos)
    data.append('email', values.email)
    data.append('celular', values.celular)
    data.append('mensaje', values.mensaje)
    data.append('logo', logo)
    data.append('empresa', empresa ?? '')
    data.append('correo', correo ?? '')
    try {
      const respuesta = await axios.post(`${Global.urlproduccion}/enviarCorreoClasificados`, data)

      if (respuesta.data.status === 'success') {
        setShowError({
          estado: 'success',
          texto: 'Correo enviado'
        })
        resetForm()
      } else {
        setShowError({
          estado: 'error',
          texto: 'Error al enviar el correo'
        })
      }
    } catch (error) {
      console.log(error)
      setShowError({
        estado: 'error',
        texto: 'Error al enviar el correo'
      })
    }
    setLoadingCorreo(false)
  }

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    touched,
    handleBlur,
    resetForm
  } = useFormik({
    initialValues: {
      nombres: '',
      celular: '',
      apellidos: '',
      email: '',
      asunto: '',
      mensaje: ''
    },
    validationSchema: SchemaContacto,
    onSubmit: enviarCorreo
  })

  const handleWhatsAppClick = (tipo: string | undefined, nombre: string): void => {
    const message = `Hola, estoy interesado en el ${
      tipo == 'productos' ? 'producto' : 'servicio'
    } ${nombre}`
    const url = `https://wa.me/+51${
      data?.configuracion?.celular ?? ''
    }?text=${encodeURIComponent(message)}`
    window.open(url, '_blank')
  }

  return (
    <>
      <footer className="w-full mt-10" id="contacto">
        <div className="w-full grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 border border-gray-300">
          <div className="w-full px-4 md:px-8 py-6 md:py-12">
            <Link
              to="/"
              className="w-full h-full flex justify-center items-center"
            >
              {data?.configuracion?.logo && (
                <img
                  src={`${Global.urlproduccionImagen}/clasificados/${
                    data?.configuracion?.logo ?? ''
                  }`}
                  alt=""
                  className="w-full h-full max-h-[150px] object-contain p-4"
                />
              )}
            </Link>
          </div>
          <div className="w-full px-4 md:px-8 py-6 md:py-12">
            <h3 className="uppercase font-bold">{data?.internas?.interna1}</h3>
            <div className="pt-8 text-gray-700 flex flex-col gap-2 ">
              {data?.productos?.productos && JSON.parse(data?.productos?.productos ?? '')
                .slice(0, 4)
                .map((producto: productosValuesPagina) => (
                  <span
                    onClick={() => {
                      handleWhatsAppClick(
                        data?.productos?.tipoenfoque,
                        producto.titulo
                      )
                    }}
                    key={producto.id}
                    className="hover:text-paleta-500 transition-colors cursor-pointer line-clamp-1"
                  >
                    {producto.titulo}
                  </span>
                ))}
            </div>
          </div>
          <div className="w-full px-4 md:px-8 py-6 md:py-12 col-span-2 md:col-span-1">
            <h3 className="uppercase font-bold">Información</h3>
            <ul className="mt-6 flex flex-col gap-6">
              <li className="flex gap-3 items-center">
                <FaPhoneSquareAlt className="text-2xl text-gray-700" />
                <div className="flex flex-col">
                  <a
                    className=" text-gray-700"
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    href={`tel:+51${data?.configuracion?.celular}`}
                  >
                    +51 {data?.configuracion?.celular}
                  </a>
                </div>
              </li>
              <li className="flex gap-3 items-center">
                <ImMail className="text-2xl text-gray-700" />
                <div className="flex flex-col">
                  <a
                    className=" text-gray-700"
                    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                    href={`mailto:${data?.configuracion?.correo}`}
                  >
                    {data?.configuracion?.correo}
                  </a>
                </div>
              </li>
              <li className="flex gap-3 items-center">
                <div className="flex gap-3 ">
                  <Link target="_blank" to={data?.configuracion.facebook ?? ''}>
                    <img
                      src={facebook}
                      className="w-5 h-5 md:w-6 md:h-6 object-contain hover:scale-105"
                    />
                  </Link>
                  <Link
                    target="_blank"
                    to={data?.configuracion.instragram ?? ''}
                  >
                    <img
                      src={instagram}
                      className="w-5 h-5 md:w-6 md:h-6 object-contain hover:scale-105"
                    />
                  </Link>
                  <Link target="_blank" to={data?.configuracion.tiktok ?? ''}>
                    <img
                      src={tiktok}
                      className="w-5 h-5 md:w-6 md:h-6 object-contain hover:scale-105"
                    />
                  </Link>
                </div>
              </li>
            </ul>
          </div>
          <form
            action=""
            onSubmit={handleSubmit}
            className="w-full px-4 md:px-8 py-6 md:py-12 col-span-2 md:col-span-3 lg:col-span-2 bg-gray-300"
          >
            <h3 className="uppercase font-bold underline">Contactanos</h3>
            <div className="mt-8 ">
              <div className="flex flex-col gap-5">
                <div className="flex gap-3">
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Nombres"
                      name="nombres"
                      value={values.nombres}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="off"
                      className="w-full p-2 bg-white text-gray-700 placeholder:text-gray-400 rounded-lg outline-none"
                    />
                    <Errors errors={errors.nombres} touched={touched.nombres} />
                  </div>
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Correo electronico"
                      value={values.email}
                      name="email"
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="w-full p-2 bg-white text-gray-700 placeholder:text-gray-400 rounded-lg outline-none"
                    />
                    <Errors errors={errors.email} touched={touched.email} />
                  </div>
                  <div className="relative w-full">
                    <input
                      type="text"
                      placeholder="Numero de celular"
                      name="celular"
                      value={values.celular}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="off"
                      className="w-full p-2 bg-white text-gray-700 placeholder:text-gray-400 rounded-lg outline-none"
                    />
                    <Errors errors={errors.celular} touched={touched.celular} />
                  </div>
                </div>
                <div className="flex gap-3">
                  <div className=" w-full relative">
                    <input
                      type="text"
                      placeholder="Mensaje"
                      name="mensaje"
                      value={values.mensaje}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      autoComplete="off"
                      className="w-full p-2 bg-white text-gray-700 placeholder:text-gray-400 rounded-lg outline-none"
                    />
                    <Errors errors={errors.mensaje} touched={touched.mensaje} />
                  </div>
                  {!loadingCorreo
                    ? (
                    <button
                      type="submit"
                      className="bg-paleta-500 w-fit h-fit px-5 py-1 md:py-2 text-white"
                    >
                      Enviar
                    </button>
                      )
                    : (
                    <button
                      type="button"
                      disabled
                      className="bg-paleta-500/80 px-5 py-1 md:py-2 text-white"
                    >
                      Enviando...
                    </button>
                      )}
                </div>
              </div>
            </div>
          </form>
        </div>
        <div className="h-[70px] bg-[#252525] w-full flex items-center justify-center">
          <p className="w-full text-xs px-2 lg:text-base text-center text-gray-400">
            © Copyright 2024 - Todos los derechos reservados Design by
            <a href="https://logosperu.com.pe/" target='_blank' rel="noreferrer" className='underline'> Logos Perú</a> - Agencia de Diseño Gráfico & Desarrollo Web
          </p>
        </div>
      </footer>

      <FloatingWhatsApp
        phoneNumber={`+51${data?.configuracion?.celular ?? ''}`}
        accountName={data?.configuracion?.nombre ?? ''}
        statusMessage="En linea"
        placeholder="Envianos un mensaje"
        chatMessage="Hola un gusto! 🤝, Como podemos ayudarte?"
        avatar={`${Global.urlproduccionImagen}/clasificados/${data?.configuracion?.icono ?? ''}`}
        allowEsc
        allowClickAway
        notification
        notificationSound
      />
    </>
  )
}
