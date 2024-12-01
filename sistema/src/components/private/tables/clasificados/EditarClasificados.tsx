import { useEffect, useState, type SyntheticEvent } from 'react'
import { Link, useParams } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import { Loading } from '../../../shared/Loading'
import { TitleBriefs } from '../../../shared/TitleBriefs'
import { useFormik } from 'formik'
import Swal from 'sweetalert2'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { Errors } from '../../../shared/Errors'
import {
  type arrayImagesClasificados,
  type ImagenState,
  type clasificadosRegistroValues,
  type arrayCategoriasToPortafolio
} from '../../../shared/schemas/Interfaces'
import { SchemaClasificado } from '../../../shared/schemas/Schemas'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import { CgArrowsExpandRight } from 'react-icons/cg'
import { ImageUpdateClasificados } from '../../../shared/imagenes-videos/ImageUpdateClasificados'
import { AgregarProductos } from './components/AgregarProductos'
import { AgregarMarca } from './components/AgregarMarca'

export const EditarClasificados = (): JSX.Element => {
  const { setTitle } = useAuth()
  const [loading, setLoading] = useState(false)
  const token = localStorage.getItem('token')
  const [open, setOpen] = useState(false)
  const [open2, setOpen2] = useState(false)
  const [expanded, setExpanded] = useState<string | false>(false)
  const { id } = useParams()
  const [imagen1, setImagen1] = useState(null)
  const [boton1, setBoton1] = useState(false)
  const [url1, setUrl1] = useState('')
  const [arrayPesos, setarrayPesos] = useState<arrayImagesClasificados[]>([])
  const [arrayMarcas, setarrayMarcas] = useState<arrayCategoriasToPortafolio[]>([])
  const [imagenNueva1, SetImagenNueva1] = useState<ImagenState>({
    archivo: null,
    archivoName: ''
  })
  const [imagen2, setImagen2] = useState(null)
  const [boton2, setBoton2] = useState(false)
  const [url2, setUrl2] = useState('')
  const [imagenNueva2, SetImagenNueva2] = useState<ImagenState>({
    archivo: null,
    archivoName: ''
  })
  const [imagenbanner1, setImagenbanner1] = useState(null)
  const [botonbanner1, setBotonbanner1] = useState(false)
  const [urlbanner1, setUrlbanner1] = useState('')
  const [imagenNuevabanner1, SetImagenNuevabanner1] = useState<ImagenState>({
    archivo: null,
    archivoName: ''
  })
  const [imagenbanner2, setImagenbanner2] = useState(null)
  const [botonbanner2, setBotonbanner2] = useState(false)
  const [urlbanner2, setUrlbanner2] = useState('')
  const [imagenNuevabanner2, SetImagenNuevabanner2] = useState<ImagenState>({
    archivo: null,
    archivoName: ''
  })

  // INFORMACION
  const [imagentitulo1, setImagentitulo1] = useState(null)
  const [botontitulo1, setBotontitulo1] = useState(false)
  const [urltitulo1, setUrltitulo1] = useState('')
  const [imagenNuevatitulo1, SetImagenNuevatitulo1] = useState<ImagenState>({
    archivo: null,
    archivoName: ''
  })

  const [imagentitulo2, setImagentitulo2] = useState(null)
  const [botontitulo2, setBotontitulo2] = useState(false)
  const [urltitulo2, setUrltitulo2] = useState('')
  const [imagenNuevatitulo2, SetImagenNuevatitulo2] = useState<ImagenState>({
    archivo: null,
    archivoName: ''
  })

  const [imagentitulo3, setImagentitulo3] = useState(null)
  const [botontitulo3, setBotontitulo3] = useState(false)
  const [urltitulo3, setUrltitulo3] = useState('')
  const [imagenNuevatitulo3, SetImagenNuevatitulo3] = useState<ImagenState>({
    archivo: null,
    archivoName: ''
  })

  const [imagentitulo4, setImagentitulo4] = useState(null)
  const [botontitulo4, setBotontitulo4] = useState(false)
  const [urltitulo4, setUrltitulo4] = useState('')
  const [imagenNuevatitulo4, SetImagenNuevatitulo4] = useState<ImagenState>({
    archivo: null,
    archivoName: ''
  })

  const [imagenseo, setImagenseo] = useState(null)
  const [botonseo, setBotonseo] = useState(false)
  const [urlseo, setUrlseo] = useState('')
  const [imagenNuevaseo, SetImagenNuevaseo] = useState<ImagenState>({
    archivo: null,
    archivoName: ''
  })

  const [imagenproducto, setImagenproducto] = useState<ImagenState>({
    archivo: null,
    archivoName: ''
  })

  const [imagenmarca, setImagenmarca] = useState<ImagenState>({
    archivo: null,
    archivoName: ''
  })

  const handleChange2 = (panel: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
    setExpanded(isExpanded ? panel : false)
  }

  const getClasificado = async (): Promise<void> => {
    const request = await axios.get(`${Global.url}/oneWeb/${id ?? ''}`, {
      headers: {
        Authorization: `Bearer ${
          token !== null && token !== '' ? `Bearer ${token}` : ''
        }`
      }
    })
    const data = JSON.parse(request.data.pagina_web)
    const arrayproducto = JSON.parse(request.data.pagina_web).productos?.productos ? (JSON.parse(JSON.parse(request.data.pagina_web).productos?.productos)) : []
    const arraymarcasTwo = JSON.parse(request.data?.pagina_web).marcas ? (JSON.parse(JSON.parse(request.data?.pagina_web).marcas)) : []
    setValues({
      ...values,
      nombre: data?.configuracion?.nombre,
      correo: data?.configuracion?.correo,
      celular: data?.configuracion?.celular,
      logo: data?.configuracion?.logo,
      icono: data?.configuracion?.icono,
      instragram: data?.configuracion?.instragram,
      facebook: data?.configuracion?.facebook,
      tiktok: data?.configuracion?.tiktok,
      color: data?.configuracion?.color,
      // INTERNAS
      interna1: data?.internas?.interna1,
      interna2: data?.internas?.interna2,
      interna3: data?.internas?.interna3,
      interna4: data?.internas?.interna4,
      //   BANNERS
      banner1: data?.banner?.banner1,
      banner2: data?.banner?.banner2,
      //   INFORMACION
      titulo1: data?.informacion?.titulo1,
      titulo2: data?.informacion?.titulo2,
      titulo3: data?.informacion?.titulo3,
      titulo4: data?.informacion?.titulo4,
      subtitulo1: data?.informacion?.subtitulo1,
      subtitulo2: data?.informacion?.subtitulo2,
      subtitulo3: data?.informacion?.subtitulo3,
      subtitulo4: data?.informacion?.subtitulo4,
      imagentitulo1: data?.informacion?.imagentitulo1,
      imagentitulo2: data?.informacion?.imagentitulo1,
      imagentitulo3: data?.informacion?.imagentitulo1,
      imagentitulo4: data?.informacion?.imagentitulo1,
      // PRODUCTOS
      tipoenfoque: data?.productos?.tipoenfoque,
      productos: arrayproducto ?? '',
      // SEO
      imagenseo: data?.seo?.imagenseo,
      descripcionseo: data?.seo?.descripcionseo,
      marcas: arraymarcasTwo ?? ''
    })
    if (arrayproducto) {
      setarrayPesos(arrayproducto)
    }
    if (arraymarcasTwo) {
      setarrayMarcas(arraymarcasTwo)
    }

    if (data.configuracion.logo) {
      setImagen1(data.configuracion.logo)
    }
    if (data.configuracion.icono) {
      setImagen2(data.configuracion.icono)
    }
    if (data.banner.banner1) {
      setImagenbanner1(data.banner.banner1)
    }
    if (data.banner.banner2) {
      setImagenbanner2(data.banner.banner2)
    }
    if (data.informacion.imagentitulo1) {
      setImagentitulo1(data.informacion.imagentitulo1)
    }
    if (data.informacion.imagentitulo2) {
      setImagentitulo2(data.informacion.imagentitulo2)
    }
    if (data.informacion.imagentitulo3) {
      setImagentitulo3(data.informacion.imagentitulo3)
    }
    if (data.informacion.imagentitulo4) {
      setImagentitulo4(data.informacion.imagentitulo4)
    }
    if (data.seo.imagenseo) {
      setImagenseo(data.seo.imagenseo)
    }
    setLoading(false)
  }

  const savePreventa = async (
    values: clasificadosRegistroValues
  ): Promise<void> => {
    setLoading(true)
    const token = localStorage.getItem('token')
    const paginaWeb = {
      configuracion: {
        nombre: values.nombre,
        correo: values.correo,
        celular: values.celular,
        logo: imagen1,
        icono: imagen2,
        instragram: values.instragram,
        facebook: values.facebook,
        tiktok: values.tiktok,
        color: values.color
      },
      internas: {
        interna1: values.interna1,
        interna2: values.interna2,
        interna3: values.interna3,
        interna4: values.interna4
      },
      banner: {
        banner1: imagenbanner1,
        banner2: imagenbanner2
      },
      informacion: {
        titulo1: values.titulo1,
        titulo2: values.titulo2,
        titulo3: values.titulo3,
        titulo4: values.titulo4,
        subtitulo1: values.subtitulo1,
        subtitulo2: values.subtitulo2,
        subtitulo3: values.subtitulo3,
        subtitulo4: values.subtitulo4,
        imagentitulo1,
        imagentitulo2,
        imagentitulo3,
        imagentitulo4
      },
      productos: {
        tipoenfoque: values.tipoenfoque,
        productos: JSON.stringify(arrayPesos)
      },
      seo: {
        imagenseo,
        descripcionseo: values.descripcionseo
      },
      marcas: JSON.stringify(arrayMarcas)
    }
    const data = new FormData()
    data.append('pagina_web', JSON.stringify(paginaWeb))
    data.append('_method', 'PUT')
    if (imagenNueva1.archivo != null) {
      data.append('logo', imagenNueva1.archivo)
    }
    if (imagenNueva2.archivo != null) {
      data.append('icono', imagenNueva2.archivo)
    }
    if (imagenNuevabanner1.archivo != null) {
      data.append('banner1', imagenNuevabanner1.archivo)
    }
    if (imagenNuevabanner2.archivo != null) {
      data.append('banner2', imagenNuevabanner2.archivo)
    }
    if (imagenNuevatitulo1.archivo != null) {
      data.append('imagentitulo1', imagenNuevatitulo1.archivo)
    }
    if (imagenNuevatitulo2.archivo != null) {
      data.append('imagentitulo2', imagenNuevatitulo2.archivo)
    }
    if (imagenNuevatitulo3.archivo != null) {
      data.append('imagentitulo3', imagenNuevatitulo3.archivo)
    }
    if (imagenNuevatitulo4.archivo != null) {
      data.append('imagentitulo4', imagenNuevatitulo4.archivo)
    }
    if (imagenNuevaseo.archivo != null) {
      data.append('imagenseo', imagenNuevaseo.archivo)
    }
    arrayPesos.forEach((image1, index1) => {
      if (image1.imagenproducto.archivo) {
        data.append(`images1[${index1}]`, image1.imagenproducto.archivo)
        data.append(`names1[${index1}]`, image1.imagenproducto.archivoName)
      }
    })
    arrayMarcas.forEach((image1, index1) => {
      if (image1.imagen1.archivo) {
        data.append(`imagesmarca1[${index1}]`, image1.imagen1.archivo)
        data.append(`namesmarca1[${index1}]`, image1.imagen1.archivoName)
      }
    })
    try {
      const respuesta = await axios.post(
        `${Global.url}/updateClasificado/${id ?? ''}`,
        data,
        {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
      )

      if (respuesta.data.status == 'success') {
        Swal.fire('Actualizado correctamente', '', 'success')
        getClasificado()
      } else {
        Swal.fire('Error al editar el registro', '', 'error')
        setLoading(false)
      }
    } catch (error) {
      console.log(error)
      Swal.fire('Error al editar el registro', '', 'error')
      setLoading(false)
    }
  }

  const {
    handleSubmit,
    handleChange,
    setValues,
    errors,
    values,
    touched,
    handleBlur,
    isSubmitting
  } = useFormik({
    initialValues: {
      nombre: '',
      correo: '',
      celular: '',
      logo: '',
      icono: '',
      instragram: '',
      facebook: '',
      tiktok: '',
      color: '',
      banner1: '',
      banner2: '',
      titulo1: '',
      titulo2: '',
      titulo3: '',
      titulo4: '',
      subtitulo1: '',
      subtitulo2: '',
      subtitulo3: '',
      subtitulo4: '',
      imagentitulo1: '',
      imagentitulo2: '',
      imagentitulo3: '',
      imagentitulo4: '',
      interna1: 'Productos',
      interna2: '',
      interna3: '',
      interna4: '',
      tipoenfoque: '',
      productos: [],
      imagenseo: '',
      descripcionseo: '',
      marcas: []
    },
    validationSchema: SchemaClasificado,
    onSubmit: savePreventa
  })

  useEffect(() => {
    setTitle('EDITAR CLASIFICADO')
    getClasificado()
  }, [])

  useEffect(() => {
    if (errors && isSubmitting) {
      const firstErrorKey = Object.keys(errors)[0]
      const firstErrorElement = document.getElementsByName(firstErrorKey)[0]
      if (firstErrorElement) {
        firstErrorElement.focus()
      }
    }
  }, [touched, errors, isSubmitting])

  return (
    <>
      <div className="">
        {loading
          ? (
          <Loading />
            )
          : (
          <div className="card">
            <form
              className="flex flex-col rounded-md relative"
              onSubmit={handleSubmit}
            >
              <div className="flex w-full  flex-col">
                <div className="w-full flex flex-col text-white">
                  <div className="mb-3 md:mb-0 w-full rounded-md rounded-tl-none  text-black flex flex-col items-end ">
                    <Accordion
                      expanded={expanded === 'panel1'}
                      onChange={handleChange2('panel1')}
                      className="w-full"
                    >
                      <AccordionSummary
                        expandIcon={<CgArrowsExpandRight />}
                        aria-controls="panel1bh-content"
                        id="panel1bh-header"
                      >
                        <h2 className="font-bold text-base uppercase">
                          Configuracón general
                        </h2>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div className="w-full flex flex-col gap-3 md:flex-row p-4">
                          <div className="w-full md:w-full relative h-fit">
                            <TitleBriefs titulo=" Nombre de la empresa/marca" />
                            <input
                              className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                              name="nombre"
                              type="text"
                              autoComplete="off"
                              value={values.nombre}
                              disabled={false}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <Errors
                              errors={errors.nombre}
                              touched={touched.nombre}
                            />
                          </div>
                          <div className="w-full md:w-full relative h-fit">
                            <TitleBriefs titulo=" Correo" />
                            <input
                              className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                              name="correo"
                              type="text"
                              value={values.correo}
                              disabled={false}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <Errors
                              errors={errors.correo}
                              touched={touched.correo}
                            />
                          </div>
                          <div className="w-full md:w-full relative h-fit">
                            <TitleBriefs titulo=" Celular" />
                            <input
                              className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                              name="celular"
                              type="text"
                              value={values.celular}
                              disabled={false}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <Errors
                              errors={errors.celular}
                              touched={touched.celular}
                            />
                          </div>
                          <div className="w-full md:w-full relative h-fit">
                            <TitleBriefs titulo=" Color principal" />
                            <div className='flex gap-0'>
                                <input
                                className="border placeholder-gray-400 focus:outline-none
                                                        focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                        border-gray-300 rounded-md transition-all"
                                name="color"
                                type="text"
                                value={values.color}
                                disabled={false}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                />
                                <Errors
                                errors={errors.color}
                                touched={touched.color}
                                />
                                <input
                                className="border placeholder-gray-400 focus:outline-none
                                                        focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                        border-gray-300 rounded-md transition-all"
                                name="color"
                                type="color"
                                value={values.color}
                                disabled={false}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                />
                            </div>
                            <Errors
                              errors={errors.color}
                              touched={touched.color}
                            />
                          </div>
                        </div>
                        <div className="w-full flex flex-col gap-3 md:flex-row p-4">
                          <div className="w-full md:w-full relative h-fit">
                            <TitleBriefs titulo="Link Facebook" />
                            <input
                              className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                              name="facebook"
                              type="text"
                              value={values.facebook}
                              disabled={false}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <Errors
                              errors={errors.facebook}
                              touched={touched.facebook}
                            />
                          </div>
                          <div className="w-full md:w-full relative h-fit">
                            <TitleBriefs titulo="Link Instagram" />
                            <input
                              className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                              name="instragram"
                              type="text"
                              autoComplete="off"
                              value={values.instragram}
                              disabled={false}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <Errors
                              errors={errors.instragram}
                              touched={touched.instragram}
                            />
                          </div>
                          <div className="w-full md:w-full relative h-fit">
                            <TitleBriefs titulo="Link Tik Tok" />
                            <input
                              className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                              name="tiktok"
                              type="text"
                              value={values.tiktok}
                              disabled={false}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <Errors
                              errors={errors.tiktok}
                              touched={touched.tiktok}
                            />
                          </div>
                        </div>
                        <div className="w-full flex flex-col gap-3 md:flex-row p-4">
                          <div className="w-full md:w-full relative h-fit">
                            <div className="w-full relative">
                              <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                                Adjuntar logo
                              </p>
                              <ImageUpdateClasificados
                                carpeta="clasificados"
                                url={url1}
                                setUrl={setUrl1}
                                boton={boton1}
                                setBoton={setBoton1}
                                imagen={imagen1}
                                setImagen={SetImagenNueva1}
                                clase="1"
                                disabled={false}
                              />
                            </div>
                          </div>
                          <div className="w-full md:w-full relative h-fit">
                            <div className="w-full relative">
                              <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                                Adjuntar icono
                              </p>
                              <ImageUpdateClasificados
                                carpeta="clasificados"
                                url={url2}
                                setUrl={setUrl2}
                                boton={boton2}
                                setBoton={setBoton2}
                                imagen={imagen2}
                                setImagen={SetImagenNueva2}
                                clase="2"
                                disabled={false}
                              />
                            </div>
                          </div>
                        </div>
                      </AccordionDetails>
                    </Accordion>
                    <Accordion
                      expanded={expanded === 'panel4'}
                      onChange={handleChange2('panel4')}
                      className="w-full"
                    >
                      <AccordionSummary
                        expandIcon={<CgArrowsExpandRight />}
                        aria-controls="panel4bh-content"
                        id="panel4bh-header"
                      >
                        <h2 className="font-bold text-base uppercase">
                          INTERNAS
                        </h2>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div className="w-full flex flex-col gap-3 md:flex-row p-4">
                          <div className="w-full md:w-full relative h-fit">
                            <TitleBriefs titulo="Interna 1" />
                            <input
                              className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                              name="interna1"
                              type="text"
                              autoComplete="off"
                              value={values.interna1}
                              disabled={false}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <Errors
                              errors={errors.interna1}
                              touched={touched.interna1}
                            />
                          </div>
                          <div className="w-full md:w-full relative h-fit">
                            <TitleBriefs titulo="Interna 2" />
                            <input
                              className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                              name="interna2"
                              type="text"
                              value={values.interna2}
                              disabled={false}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <Errors
                              errors={errors.interna2}
                              touched={touched.interna2}
                            />
                          </div>
                          <div className="w-full md:w-full relative h-fit">
                            <TitleBriefs titulo="Interna 3" />
                            <input
                              className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                              name="interna3"
                              type="text"
                              value={values.interna3}
                              disabled={false}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <Errors
                              errors={errors.interna3}
                              touched={touched.interna3}
                            />
                          </div>
                          <div className="w-full md:w-full relative h-fit">
                            <TitleBriefs titulo="Interna 4" />
                            <div className='flex gap-0'>
                                <input
                                className="border placeholder-gray-400 focus:outline-none
                                                        focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                        border-gray-300 rounded-md transition-all"
                                name="interna4"
                                type="text"
                                value={values.interna4}
                                disabled={false}
                                onChange={handleChange}
                                onBlur={handleBlur}
                                />
                                <Errors
                                errors={errors.interna4}
                                touched={touched.interna4}
                                />
                            </div>
                            <Errors
                              errors={errors.interna4}
                              touched={touched.interna4}
                            />
                          </div>
                        </div>
                      </AccordionDetails>
                    </Accordion>
                    <Accordion
                      expanded={expanded === 'panel2'}
                      onChange={handleChange2('panel2')}
                      className="w-full"
                    >
                      <AccordionSummary
                        expandIcon={<CgArrowsExpandRight />}
                        aria-controls="panel2bh-content"
                        id="panel2bh-header"
                      >
                        <h2 className="font-bold text-base uppercase">
                          BANNERS
                        </h2>
                        <p className='pl-4'>Medidas: 1920px X 650px </p>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div className="w-full flex flex-col gap-3 md:flex-row p-4">
                          <div className="w-full md:w-full relative h-fit">
                            <div className="w-full relative">
                              <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                                Banner 1
                              </p>
                              <ImageUpdateClasificados
                                carpeta="clasificados"
                                url={urlbanner1}
                                setUrl={setUrlbanner1}
                                boton={botonbanner1}
                                setBoton={setBotonbanner1}
                                imagen={imagenbanner1}
                                setImagen={SetImagenNuevabanner1}
                                clase="banner1"
                                disabled={false}
                              />
                            </div>
                          </div>
                          <div className="w-full md:w-full relative h-fit">
                            <div className="w-full relative">
                              <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                                Banner2
                              </p>
                              <ImageUpdateClasificados
                                carpeta="clasificados"
                                url={urlbanner2}
                                setUrl={setUrlbanner2}
                                boton={botonbanner2}
                                setBoton={setBotonbanner2}
                                imagen={imagenbanner2}
                                setImagen={SetImagenNuevabanner2}
                                clase="banner2"
                                disabled={false}
                              />
                            </div>
                          </div>
                        </div>
                      </AccordionDetails>
                    </Accordion>
                    <Accordion
                      expanded={expanded === 'panel3'}
                      onChange={handleChange2('panel3')}
                      className="w-full"
                    >
                      <AccordionSummary
                        expandIcon={<CgArrowsExpandRight />}
                        aria-controls="panel3bh-content"
                        id="panel3bh-header"
                      >
                        <h2 className="font-bold text-base uppercase">
                          INFORMACION
                        </h2>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div className="w-full flex flex-col gap-3 md:flex-row px-4 py-2">
                          <div className="w-full md:w-full relative h-fit">
                            <TitleBriefs titulo="Titulo 1" />
                            <input
                              className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                              name="titulo1"
                              type="text"
                              autoComplete="off"
                              value={values.titulo1}
                              disabled={false}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <Errors
                              errors={errors.titulo1}
                              touched={touched.titulo1}
                            />
                          </div>
                          <div className="w-full md:w-full relative h-fit">
                            <TitleBriefs titulo="Titulo 2" />
                            <input
                              className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                              name="titulo2"
                              type="text"
                              value={values.titulo2}
                              disabled={false}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <Errors
                              errors={errors.titulo2}
                              touched={touched.titulo2}
                            />
                          </div>
                          <div className="w-full md:w-full relative h-fit">
                            <TitleBriefs titulo="Titulo 3" />
                            <input
                              className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                              name="titulo3"
                              type="text"
                              value={values.titulo3}
                              disabled={false}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <Errors
                              errors={errors.titulo3}
                              touched={touched.titulo3}
                            />
                          </div>
                          <div className="w-full md:w-full relative h-fit">
                            <TitleBriefs titulo="Titulo 4" />
                            <input
                              className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                              name="titulo4"
                              type="text"
                              value={values.titulo4}
                              disabled={false}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <Errors
                              errors={errors.titulo4}
                              touched={touched.titulo4}
                            />
                          </div>
                        </div>
                        <div className="w-full flex flex-col gap-3 md:flex-row px-4 py-2">
                          <div className="w-full md:w-full relative h-fit">
                            <TitleBriefs titulo="SubTitulo 1" />
                            <input
                              className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                              name="subtitulo1"
                              type="text"
                              autoComplete="off"
                              value={values.subtitulo1}
                              disabled={false}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <Errors
                              errors={errors.subtitulo1}
                              touched={touched.subtitulo1}
                            />
                          </div>
                          <div className="w-full md:w-full relative h-fit">
                            <TitleBriefs titulo="SubTitulo 2" />
                            <input
                              className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                              name="subtitulo2"
                              type="text"
                              value={values.subtitulo2}
                              disabled={false}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <Errors
                              errors={errors.subtitulo2}
                              touched={touched.subtitulo2}
                            />
                          </div>
                          <div className="w-full md:w-full relative h-fit">
                            <TitleBriefs titulo="SubTitulo 3" />
                            <input
                              className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                              name="subtitulo3"
                              type="text"
                              value={values.subtitulo3}
                              disabled={false}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <Errors
                              errors={errors.subtitulo3}
                              touched={touched.subtitulo3}
                            />
                          </div>
                          <div className="w-full md:w-full relative h-fit">
                            <TitleBriefs titulo="SubTitulo 4" />
                            <input
                              className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                              name="subtitulo4"
                              type="text"
                              value={values.subtitulo4}
                              disabled={false}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            />
                            <Errors
                              errors={errors.subtitulo4}
                              touched={touched.subtitulo4}
                            />
                          </div>
                        </div>
                        <div className="w-full flex flex-col gap-3 md:flex-row px-4 py-2">
                          <div className="w-full md:w-full relative h-fit">
                            <div className="w-full relative">
                              <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                                Icono 1
                              </p>
                              <ImageUpdateClasificados
                                carpeta="clasificados"
                                url={urltitulo1}
                                setUrl={setUrltitulo1}
                                boton={botontitulo1}
                                setBoton={setBotontitulo1}
                                imagen={imagentitulo1}
                                setImagen={SetImagenNuevatitulo1}
                                clase="titulo1"
                                disabled={false}
                              />
                            </div>
                          </div>
                          <div className="w-full md:w-full relative h-fit">
                            <div className="w-full relative">
                              <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                                Icono2
                              </p>
                              <ImageUpdateClasificados
                                carpeta="clasificados"
                                url={urltitulo2}
                                setUrl={setUrltitulo2}
                                boton={botontitulo2}
                                setBoton={setBotontitulo2}
                                imagen={imagentitulo2}
                                setImagen={SetImagenNuevatitulo2}
                                clase="titulo2"
                                disabled={false}
                              />
                            </div>
                          </div>
                          <div className="w-full md:w-full relative h-fit">
                            <div className="w-full relative">
                              <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                                Icono 3
                              </p>
                              <ImageUpdateClasificados
                                carpeta="clasificados"
                                url={urltitulo3}
                                setUrl={setUrltitulo3}
                                boton={botontitulo3}
                                setBoton={setBotontitulo3}
                                imagen={imagentitulo3}
                                setImagen={SetImagenNuevatitulo3}
                                clase="titulo3"
                                disabled={false}
                              />
                            </div>
                          </div>
                          <div className="w-full md:w-full relative h-fit">
                            <div className="w-full relative">
                              <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                                Icono 4
                              </p>
                              <ImageUpdateClasificados
                                carpeta="clasificados"
                                url={urltitulo4}
                                setUrl={setUrltitulo4}
                                boton={botontitulo4}
                                setBoton={setBotontitulo4}
                                imagen={imagentitulo4}
                                setImagen={SetImagenNuevatitulo4}
                                clase="titulo4"
                                disabled={false}
                              />
                            </div>
                          </div>
                        </div>
                      </AccordionDetails>
                    </Accordion>
                    <Accordion
                      expanded={expanded === 'panel5'}
                      onChange={handleChange2('panel5')}
                      className="w-full"
                    >
                      <AccordionSummary
                        expandIcon={<CgArrowsExpandRight />}
                        aria-controls="panel5bh-content"
                        id="panel5bh-header"
                      >
                        <h2 className="font-bold text-base uppercase">
                          PRODUCTOS O SERVICIOS
                        </h2>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div className="w-full flex gap-3 justify-between items-center px-4 py-2">
                          <div className="w-full md:w-full relative h-fit">
                            <TitleBriefs titulo="Tipo de sección" />
                            <select
                              className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-1/3 mx-auto pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                              name="tipoenfoque"
                              autoComplete="off"
                              value={values.tipoenfoque}
                              disabled={false}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            >
                                <option value="">Seleccionar</option>
                                <option value="productos">Productos</option>
                                <option value="servicios">Servicios</option>
                            </select>
                            <Errors
                              errors={errors.tipoenfoque}
                              touched={touched.tipoenfoque}
                            />
                          </div>
                          <button
                          type='button'
                          className='bg-main px-4 py-2 text-white rounded-md'
                          onClick={() => { setOpen(!open) }}
                          >Agregar</button>
                        </div>
                          {values.tipoenfoque &&
                            <AgregarProductos arrayPesos={arrayPesos} setarrayPesos={setarrayPesos} open={open} setOpen={setOpen} imagenproducto={imagenproducto} setImagenproducto={setImagenproducto} />
                          }
                      </AccordionDetails>
                    </Accordion>
                    <Accordion
                      expanded={expanded === 'panel6'}
                      onChange={handleChange2('panel6')}
                      className="w-full"
                    >
                      <AccordionSummary
                        expandIcon={<CgArrowsExpandRight />}
                        aria-controls="panel6bh-content"
                        id="panel6bh-header"
                      >
                        <h2 className="font-bold text-base uppercase">
                          Descripción e imagen - SEO
                        </h2>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div className="w-full grid grid-cols-2 gap-3 md:flex-row p-4">
                          <div className="w-full md:w-full relative h-fit">
                            <div className="w-full relative">
                              <p className="bg-white pt-0 pr-2 pb-0 pl-2 -mt-3 mr-0 mb-0 ml-2 font-medium text-gray-600 absolute">
                                Imagen
                              </p>
                              <ImageUpdateClasificados
                                carpeta="clasificados"
                                url={urlseo}
                                setUrl={setUrlseo}
                                boton={botonseo}
                                setBoton={setBotonseo}
                                imagen={imagenseo}
                                setImagen={SetImagenNuevaseo}
                                clase="seo"
                                disabled={false}
                              />
                            </div>
                          </div>
                          <div className="w-full md:w-full relative h-full">
                            <TitleBriefs titulo="Descripción de la empresa" />
                            <textarea
                              className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-full pl-4 pt-4 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                              name="descripcionseo"
                              value={values.descripcionseo}
                              disabled={false}
                              onChange={handleChange}
                              onBlur={handleBlur}
                            ></textarea>
                            <Errors
                              errors={errors.descripcionseo}
                              touched={touched.descripcionseo}
                            />
                          </div>
                        </div>
                      </AccordionDetails>
                    </Accordion>
                    <Accordion
                      expanded={expanded === 'panel7'}
                      onChange={handleChange2('panel7')}
                      className="w-full"
                    >
                      <AccordionSummary
                        expandIcon={<CgArrowsExpandRight />}
                        aria-controls="panel7bh-content"
                        id="panel7bh-header"
                      >
                        <h2 className="font-bold text-base uppercase">
                          MARCAS
                        </h2>
                      </AccordionSummary>
                      <AccordionDetails>
                        <div className="w-full flex gap-3 justify-between items-center px-4 py-2">
                          <button
                          type='button'
                          className='bg-main px-4 py-2 text-white rounded-md'
                          onClick={() => { setOpen2(!open2) }}
                          >Agregar</button>
                        </div>
                        <AgregarMarca arrayPesos={arrayMarcas} setarrayPesos={setarrayMarcas} open={open2} setOpen={setOpen2} imagenproducto={imagenmarca} setImagenproducto={setImagenmarca} />
                      </AccordionDetails>
                    </Accordion>
                  </div>
                </div>
              </div>

              <div className="flex w-full justify-end gap-3 rounded-md text-black mt-5">
                <Link
                  to="/admin/lista-clasificados"
                  className="bg-red-600 px-3 py-2 rounded-md text-white cursor-pointer"
                >
                  Regresar
                </Link>
                <input
                  type="submit"
                  className="bg-secondary-150 px-3 py-2 text-white rounded-md cursor-pointer"
                  value="Grabar"
                />
              </div>
            </form>
          </div>
            )}
      </div>
    </>
  )
}
