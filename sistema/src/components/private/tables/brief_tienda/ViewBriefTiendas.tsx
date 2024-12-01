import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import { Loading } from '../../../shared/Loading'
import { TitleBriefs } from '../../../shared/TitleBriefs'
import { InputsBriefs } from '../../../shared/InputsBriefs'
import { useFormik } from 'formik'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { Errors } from '../../../shared/Errors'
import { SchemaBriefComunity } from '../../../shared/schemas/Schemas'
import { logo } from '../../../shared/Images'
import { RiEyeLine, RiNotification4Line } from 'react-icons/ri'
import { ViewCliente } from '../../../shared/modals/ViewCliente'
import { type RolsValues } from '../../../shared/schemas/Interfaces'
import { LoadingSmall } from '../../../shared/LoadingSmall'
import html2canvas from 'html2canvas'
import Swal from 'sweetalert2'

export const ViewBriefTiendas = (): JSX.Element => {
  const { setTitle, roles, auth } = useAuth()
  const { id } = useParams()
  const token = localStorage.getItem('token')
  const [loading, setLoading] = useState(true)
  const [captureRef, setCaptureRef] = useState<HTMLDivElement | null>(null)
  const [loadingCorreo, setLoadingCorreo] = useState(false)
  const [imagen1, setImagen1] = useState('')
  const [open, setOpen] = useState(false)

  const handleClickOpen = (): void => {
    setOpen(true)
  }

  const handleClose = (): void => {
    setOpen(false)
  }

  const saveBrief = async (): Promise<void> => {}

  const getFlyer = async (): Promise<void> => {
    const request = await axios.get(
      `${Global.url}/oneBriefTiendas/${id ?? ''}`,
      {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
        }
      }
    )
    setValues({
      ...values,
      nombres:
        String(request.data[0].nombres) +
        ' ' +
        String(request.data[0].apellidos),
      email: request.data[0].email,
      id_venta: request.data[0].id_venta,
      id_contrato: request.data[0].id_contrato,
      id_cliente: request.data[0].id_cliente,
      información_empresa: request.data[0].información_empresa,
      redes_sociales: request.data[0].redes_sociales,
      imagenes_para_web: request.data[0].imagenes_para_web,
      pasarela: request.data[0].pasarela,
      internas: request.data[0].internas,
      informacion_contacto: request.data[0].informacion_contacto,
      correos: request.data[0].correos,
      ubicacion: request.data[0].ubicacion,
      informacion_adicional: request.data[0].informacion_adicional,
      internas_administrables: request.data[0].internas_administrables
    })
    if (request.data[0].logo_referencia) {
      setImagen1(request.data[0].logo_referencia)
    }

    setLoading(false)
  }

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    touched,
    handleBlur,
    setValues
  } = useFormik({
    initialValues: {
      nombres: '',
      email: '',
      id_venta: '',
      id_contrato: '',
      id_cliente: '',
      información_empresa: '',
      redes_sociales: '',
      imagenes_para_web: '',
      pasarela: '',
      internas: '',
      informacion_contacto: '',
      correos: '',
      ubicacion: '',
      informacion_adicional: '',
      internas_administrables: ''
    },
    validationSchema: SchemaBriefComunity,
    onSubmit: saveBrief
  })

  useEffect(() => {
    setTitle('BRIEF - TIENDA VIRTUAL')
    getFlyer()
  }, [])

  const enviarCorreo = async (): Promise<void> => {
    setLoadingCorreo(true)
    const captureOptions = {
      useCORS: true // Permitir imágenes de origen cruzado
    }
    if (captureRef !== null) {
      const canvas = await html2canvas(captureRef, captureOptions)
      const imageBase64 = canvas.toDataURL('image/png')
      const byteCharacters = atob(imageBase64.split(',')[1]) // Obtener los caracteres de bytes de la cadena base64
      const byteArrays = []

      for (let offset = 0; offset < byteCharacters.length; offset += 512) {
        const slice = byteCharacters.slice(offset, offset + 512) // Obtener una porción de 512 caracteres
        const byteNumbers = new Array(slice.length)

        for (let i = 0; i < slice.length; i++) {
          byteNumbers[i] = slice.charCodeAt(i)
        }

        const byteArray = new Uint8Array(byteNumbers)
        byteArrays.push(byteArray)
      }

      const file = new File(byteArrays, 'captura.png', { type: 'image/png' }) // Crear un objeto de archivo a partir de los bytes
      const dataCoreo = new FormData()
      dataCoreo.append('nombres', values.nombres)
      dataCoreo.append('email', values.email)
      dataCoreo.append('captura', file)
      const imagenes = []
      if (imagenes.length === 0) {
        imagenes.push('No subio ninguna imagen de referencia')
      }
      dataCoreo.append('images', JSON.stringify(imagenes))
      try {
        const respuestaCorreo = await axios.post(
          `${Global.url}/enviarCorreo`,
          dataCoreo
        )
        if (respuestaCorreo.data.status == 'success') {
          Swal.fire(
            'Se envio una copia de las respuestas a los correos',
            '',
            'success'
          )
        }
      } catch (error) {
        console.log(error)
        Swal.fire('Error', '', 'error')
      }
    }
    setLoadingCorreo(false)
  }

  return (
    <>
      <div className="">
        {loading
          ? (
          <Loading />
            )
          : (
          <div className="card" ref={setCaptureRef}>
            <form
              className="flex flex-col bg-white rounded-md mt-4 p-4 md:p-10 relative"
              onSubmit={handleSubmit}
            >
              <img
                src={logo}
                alt=""
                className="mx-auto w-[50%] px-4 md:px-0 md:w-48"
              />

              {roles.map(
                (role: RolsValues): React.ReactNode =>
                  auth.id_rol == role.id &&
                  JSON.parse(role.accesos).map(
                    (route: { peso: string }) =>
                      route.peso == 'superusuario' && (
                        <>
                          {!loadingCorreo
                            ? (
                            <RiNotification4Line
                              className="absolute right-0 top-0 text-4xl text-main m-4 cursor-pointer"
                              onClick={enviarCorreo}
                            />
                              )
                            : (
                            <LoadingSmall />
                              )}
                        </>
                      )
                  )
              )}

              <div className="flex w-full mt-5 md:mt-5 flex-col">
                <div className="w-full flex flex-col text-white">
                  <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-end gap-2 lg:gap-5">
                    <div className="w-full flex flex-col md:flex-row gap-2 lg:gap-5">
                      <div className="w-full md:w-3/4">
                        <TitleBriefs titulo="Cliente" />
                        <input
                          className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all text-center"
                          name="nombres"
                          type="text"
                          value={values.nombres}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          disabled={true}
                        />

                        <Errors
                          errors={errors.id_venta}
                          touched={touched.id_venta}
                        />
                      </div>
                      <div className="w-full md:w-1/4 flex items-center justify-center">
                        <button
                          type="button"
                          className="w-fit px-10 bg-main py-2 text-white rounded-lg"
                          onClick={() => {
                            handleClickOpen()
                          }}
                        >
                          <RiEyeLine />
                        </button>
                      </div>
                    </div>
                  </div>
                  <ViewCliente
                    handleClose={handleClose}
                    open={open}
                    id={values.id_cliente}
                    id_contrato={values.id_contrato}
                  />

                  <label className="bg-secondary-150 px-4 text-white py-2 w-fit rounded-t-md mb-5 md:ml-3">
                    Informacion de la empresa{' '}
                  </label>
                  <div className="mb-3 md:mb-8 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-start gap-5 lg:gap-8 text-justify md:text-left">
                    <div className="w-full relative">
                      <TitleBriefs
                        titulo="1. ¿Cuenta con información relacionada a su empresa ejemplo
                    (servicios, nosotros, visión, misión, etc.)? ¿Si tiene una
                    página web quiere que utilicemos la información de esta?"
                      />
                      <InputsBriefs
                        name="información_empresa"
                        type="text"
                        value={values.información_empresa}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={true}
                      />
                      <Errors
                        errors={errors.información_empresa}
                        touched={touched.información_empresa}
                      />
                    </div>

                    <div className="w-full relative">
                      <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                        2. Adjuntar logo (Opcional)
                      </p>
                      {imagen1 && (
                        <img
                          className="img-thumbnail"
                          id={'img-preview1'}
                          src={`${Global.urlImages}/brief_tiendas/${imagen1}`}
                          alt="imagen1"
                        />
                      )}
                    </div>

                    <div className="w-full relative">
                      <TitleBriefs
                        titulo="3. ¿Su empresa cuenta con redes sociales? Ej: Facebook,
                    Instagram, etc. Agregar enlace"
                      />
                      <textarea
                        className="border placeholder-gray-400 focus:outline-none
                                            focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                            border-gray-300 rounded-md resize-none"
                        name="redes_sociales"
                        rows={5}
                        disabled
                        value={values.redes_sociales}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Errors
                        errors={errors.redes_sociales}
                        touched={touched.redes_sociales}
                      />
                    </div>

                    <div className="w-full relative">
                      <TitleBriefs
                        titulo=" 4. ¿Dispone de fotos e imágenes para su página web si es así
                    enviarnos por los siguientes medios (Drive, Dropbox,
                    WhatsApp), si no cuenta con imágenes propias para su web
                    darnos autorización para colocar imágenes de Google en su
                    web?"
                      />
                      <InputsBriefs
                        name="imagenes_para_web"
                        type="text"
                        value={values.imagenes_para_web}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={true}
                      />
                      <Errors
                        errors={errors.imagenes_para_web}
                        touched={touched.imagenes_para_web}
                      />
                    </div>

                    <div className="w-full relative">
                      <p
                        className="bg-white pt-0 pr-2 pb-0 lg:pl-2 -mt-3 mr-0 mb-0 ml-1 lg:ml-2 font-medium text-gray-600
                                            lg:absolute"
                      >
                        5. Indicar que internas tendrá su página web ejemplo
                        (Servicios, Nosotros, Galería, Cliente, Contacto, etc.)
                        La cantidad de internas es{' '}
                        <strong>según el contrato</strong> *
                      </p>
                      <textarea
                        className="border placeholder-gray-400 focus:outline-none
                                            focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                            border-gray-300 rounded-md resize-none"
                        name="internas"
                        rows={5}
                        disabled
                        value={values.internas}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Errors
                        errors={errors.internas}
                        touched={touched.internas}
                      />
                    </div>

                    <div className="w-full relative">
                      <p
                        className="bg-white pt-0 pr-2 pb-0 lg:pl-2 -mt-3 mr-0 mb-0 ml-1 lg:ml-2 font-medium text-gray-600
                                            lg:absolute"
                      >
                        6.. ¿Qué internas de las elegidas en la pregunta
                        anterior desea administrar? (Podrá modificar, eliminar y
                        añadir el contenido de las internas).
                      </p>
                      <textarea
                        className="border placeholder-gray-400 focus:outline-none
                                            focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                            border-gray-300 rounded-md resize-none"
                        name="internas_administrables"
                        rows={5}
                        disabled
                        value={values.internas_administrables}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Errors
                        errors={errors.internas_administrables}
                        touched={touched.internas_administrables}
                      />
                    </div>

                    <div className="w-full relative">
                      <p
                        className="bg-white pt-0 pr-2 pb-0 lg:pl-2 -mt-3 mr-0 mb-0 ml-1 lg:ml-2 font-medium text-gray-600
                                            lg:absolute"
                      >
                        6. ¿Que pasarela de pago desea integrar?
                      </p>
                      <textarea
                        className="border placeholder-gray-400 focus:outline-none
                                            focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                            border-gray-300 rounded-md resize-none"
                        name="pasarela"
                        rows={5}
                        disabled
                        value={values.pasarela}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Errors
                        errors={errors.pasarela}
                        touched={touched.pasarela}
                      />
                    </div>

                    <div className="w-full relative">
                      <p
                        className="bg-white pt-0 pr-2 pb-0 lg:pl-2 -mt-3 mr-0 mb-0 ml-1 lg:ml-2 font-medium text-gray-600
                                            lg:absolute"
                      >
                        8. Cuenta con información de contacto (WhatsApp,
                        teléfono, celular, dirección). Irán en la sección de
                        contacto y datos en su Web, si en caso es para WhatsApp,
                        se redirecciona desde la Web al número de WhatsApp como
                        un mensaje para cotizar etc.
                      </p>
                      <textarea
                        className="border placeholder-gray-400 focus:outline-none
                                            focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                            border-gray-300 rounded-md resize-none"
                        name="informacion_contacto"
                        rows={5}
                        disabled
                        value={values.informacion_contacto}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Errors
                        errors={errors.informacion_contacto}
                        touched={touched.informacion_contacto}
                      />
                    </div>

                    <div className="w-full relative">
                      <p
                        className="bg-white pt-0 pr-2 pb-0 lg:pl-2 -mt-3 mr-0 mb-0 ml-1 lg:ml-2 font-medium text-gray-600
                                            lg:absolute"
                      >
                        9. ¿Qué correos se crearán en su hosting: ejemplo
                        (ventas@midominio.com, gerencia@midominio.com)?, si es
                        posible con la contraseña que desea en cada correo
                        corporativo,{' '}
                        <strong>
                          {' '}
                          la cantidad de correos corporativos es según el
                          contrato
                        </strong>
                      </p>
                      <textarea
                        className="border placeholder-gray-400 focus:outline-none
                                            focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                            border-gray-300 rounded-md resize-none"
                        name="correos"
                        rows={5}
                        disabled
                        value={values.correos}
                        onChange={handleChange}
                        onBlur={handleBlur}
                      />
                      <Errors
                        errors={errors.correos}
                        touched={touched.correos}
                      />
                    </div>

                    <div className="w-full relative">
                      <p
                        className="bg-white pt-0 pr-2 pb-0 lg:pl-2 -mt-3 mr-0 mb-0 ml-1 lg:ml-2 font-medium text-gray-600
                                            lg:absolute"
                      >
                        10. ¿Su Página Web contara con Google Maps? (Si la
                        respuesta es SI por favor enviarnos una captura del
                        punto exacto de su Empresa). Si es posible las
                        coordenadas de la ubicación, acelerará el desarrollo de
                        la maquetación en la sección.
                      </p>
                      <InputsBriefs
                        name="ubicacion"
                        type="text"
                        value={values.ubicacion}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={true}
                      />
                      <Errors
                        errors={errors.ubicacion}
                        touched={touched.ubicacion}
                      />
                    </div>

                    <div className="w-full relative">
                      <p
                        className="bg-white pt-0 pr-2 pb-0 lg:pl-2 -mt-3 mr-0 mb-0 ml-1 lg:ml-2 font-medium text-gray-600
                                            lg:absolute"
                      >
                        11. Información adicional
                      </p>
                      <InputsBriefs
                        name="informacion_adicional"
                        type="text"
                        value={values.informacion_adicional}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        disabled={true}
                      />
                      <Errors
                        errors={errors.informacion_adicional}
                        touched={touched.informacion_adicional}
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex w-full justify-end gap-3 rounded-md text-black mt-5">
                <Link
                  to="/admin/lista-briefs-comunity"
                  className="bg-red-600 px-3 py-2 rounded-md text-white cursor-pointer"
                >
                  Regresar
                </Link>
              </div>
            </form>
          </div>
            )}
      </div>
    </>
  )
}
