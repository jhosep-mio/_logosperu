import { useEffect, useState, type SyntheticEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import useAuth from '../../../../hooks/useAuth'
import { Loading } from '../../../shared/Loading'
import { TitleBriefs } from '../../../shared/TitleBriefs'
import { useFormik } from 'formik'
import Swal from 'sweetalert2'
import axios from 'axios'
import { Global } from '../../../../helper/Global'
import { Errors } from '../../../shared/Errors'
import { type clasificadosRegistroValues } from '../../../shared/schemas/Interfaces'
import { SchemaClasificado } from '../../../shared/schemas/Schemas'
import Accordion from '@mui/material/Accordion'
import AccordionDetails from '@mui/material/AccordionDetails'
import AccordionSummary from '@mui/material/AccordionSummary'
import { CgArrowsExpandRight } from 'react-icons/cg'

export const RegistrarClasificados = (): JSX.Element => {
  const { setTitle } = useAuth()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const [expanded, setExpanded] = useState<string | false>(false)

  const handleChange2 =
    (panel: string) => (_event: SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false)
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
        logo: null,
        icono: null,
        instragram: null,
        facebook: null,
        tiktok: null,
        color: null
      },
      banner: {
        banner1: null,
        banner2: null
      }
    }
    const data = new FormData()
    data.append('pagina_web', JSON.stringify(paginaWeb))
    try {
      const respuesta = await axios.post(`${Global.url}/saveClasificado`, data, {
        headers: {
          Authorization: `Bearer ${
            token !== null && token !== '' ? token : ''
          }`
        }
      })

      if (respuesta.data.status == 'success') {
        Swal.fire('Agreado correctamente', '', 'success')
        navigate('/admin/lista-clasificados')
      } else {
        Swal.fire('Error al agregar el registro', '', 'error')
        setLoading(true)
      }
    } catch (error) {
      Swal.fire('Error al agregar el registro', '', 'error')
      setLoading(true)
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
    setTitle('REGISTRAR CLASIFICADO')
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
              className="flex flex-col rounded-md mt-4 relative"
              onSubmit={handleSubmit}
            >
              <div className="flex w-full mt-5 md:mt-5 flex-col">
                <div className="w-full flex flex-col text-white">
                  <div className="mb-3 md:mb-0 w-full rounded-md rounded-tl-none  text-black flex flex-col items-end gap-2 lg:gap-5">
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
                        <h2 className='font-bold text-base uppercase'>
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
                        </div>
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
                  Cancelar
                </Link>
                <input
                  type="submit"
                  className="bg-secondary-150 px-3 py-2 text-white rounded-md cursor-pointer"
                  value="Registrar"
                />
              </div>
            </form>
          </div>
            )}
      </div>
    </>
  )
}
