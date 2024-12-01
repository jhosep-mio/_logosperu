/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { Dialog } from '@mui/material'
import { AiFillCloseCircle } from 'react-icons/ai'
import { useFormik } from 'formik'
import { validationSchemaCm } from '../../../../../shared/schemas/Schemas'
import { Errors } from '../../../../../shared/Errors'
import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import { Global } from '../../../../../../helper/Global'
import { toast } from 'sonner'
import { v4 as uuidv4 } from 'uuid'

export const ModalEdicion = ({
  open,
  setOpen,
  datos,
  selectedMonth,
  selectedYear,
  getInformacion
}: any): JSX.Element => {
  const months = [
    'Enero',
    'Febrero',
    'Marzo',
    'Abril',
    'Mayo',
    'Junio',
    'Julio',
    'Agosto',
    'Septiembre',
    'Octubre',
    'Noviembre',
    'Diciembre'
  ]
  const [loading, setLoading] = useState(false)
  const { id } = useParams()

  const enviarInformacion = async (values: any): Promise<void> => {
    const token = localStorage.getItem('token')
    setLoading(true)
    if (datos != null) {
      const data = new FormData()
      data.append('id_venta', id ?? '')
      data.append('arraycontenido', JSON.stringify(values))
      data.append('mes', selectedMonth)
      data.append('year', selectedYear)
      data.append('_method', 'PUT')
      if (values.contenido) {
        values.contenido.forEach((item: any) => {
          if (item.imagen && item.imagen.file instanceof File) {
            // Asegúrate de que item.imagen.file es un objeto File
            data.append('imagenes[]', item.imagen.file, item.imagen.name)
          }
        })
      }
      try {
        const respuestaCorreo = await axios.post(
          `${Global.url}/updateMetricaComunnity/${datos?.id ?? ''}`,
          data,
          {
            headers: {
              Authorization: `Bearer ${
                token !== null && token !== '' ? `Bearer ${token}` : ''
              }`
            }
          }
        )
        if (respuestaCorreo.data.status == 'success') {
          toast.success('Información registrada')
          getInformacion()
          setOpen(false)
        } else {
          toast.warning('Ya existe información para este mes y año')
        }
      } catch (error) {
        console.log(error)
        toast.error('Error al enviar información')
      } finally {
        setLoading(false)
      }
    } else {
      const data = new FormData()
      data.append('id_venta', id ?? '')
      data.append('arraycontenido', JSON.stringify(values))
      data.append('mes', selectedMonth)
      data.append('year', selectedYear)
      if (values.contenido) {
        values.contenido.forEach((item: any) => {
          if (item.imagen && item.imagen.file instanceof File) {
            // Asegúrate de que item.imagen.file es un objeto File
            data.append('imagenes[]', item.imagen.file, item.imagen.name)
          }
        })
      }
      try {
        const respuestaCorreo = await axios.post(
          `${Global.url}/registerMetricaComunnity`,
          data,
          {
            headers: {
              Authorization: `Bearer ${
                token !== null && token !== '' ? `Bearer ${token}` : ''
              }`
            }
          }
        )
        if (respuestaCorreo.data.status == 'success') {
          toast.success('Información registrada')
          getInformacion()
          setOpen(false)
        } else {
          toast.warning('Ya existe información para este mes y año')
        }
      } catch (error) {
        console.log(error)
        toast.error('Error al enviar información')
      } finally {
        setLoading(false)
      }
    }
  }

  const handleDelete = async (): Promise<void> => {
    const token = localStorage.getItem('token')
    const confirmed = window.confirm(
      '¿Estás seguro de que deseas eliminar este registro?'
    )
    if (!confirmed) return

    setLoading(true)

    try {
      const response = await axios.delete(
        `${Global.url}/deleterMetricaComunnity/${datos?.id ?? ''}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      )

      if (response.data.status === 'success') {
        toast.success('Registro eliminado con éxito')
        getInformacion()
        setOpen(false)
      } else {
        toast.error('No se pudo eliminar el registro')
      }
    } catch (error) {
      console.error('Error eliminando el registro:', error)
      toast.error('No se pudo eliminar el registro')
    } finally {
      setLoading(false)
    }
  }

  const {
    handleSubmit,
    handleChange,
    errors,
    values,
    touched,
    handleBlur,
    setValues
    // isSubmitting
  } = useFormik({
    initialValues: {
      fecha_texto: '',
      facebookCrecimiento: {
        megusta: '',
        seguidores: '',
        impresiones: '',
        visitas: '',
        publicaciones: ''
      },
      facebookPublicaciones: {
        interacciones: '',
        alcance: '',
        impresiones: '',
        publicaciones: ''
      },
      facebookReels: {
        interacciones: '',
        alcance: '',
        visualizaciones: '',
        reels: ''
      },
      instagramPerfil: {
        alcance: '',
        visitaperfil: '',
        publicaciones: '',
        seguidores: '',
        impresiones: ''
      },
      instagramPosts: {
        interacciones: '',
        alcance: '',
        publicaciones: ''
      },
      instagramReels: {
        interacciones: '',
        alcance: '',
        reels: ''
      },
      tiktokComunidad: {
        seguidores: '',
        videos: ''
      },
      tiktokPerfil: {
        visitas: '',
        videos: ''
      },
      tiktokVideos: {
        interacciones: '',
        alcance: '',
        visualizaciones: '',
        vídeos: ''
      },
      tiktokInteracciones: {
        megusta: '',
        comentarios: '',
        compartidos: '',
        vídeos: ''
      },
      arrayDestacados: [],
      aprendizajes: [],
      retos: [],
      contenido: []
    },
    validationSchema: validationSchemaCm,
    onSubmit: enviarInformacion
  })

  const years = []
  const startYear = 2023
  const endYear = new Date().getFullYear()

  for (let year = endYear; year >= startYear; year--) {
    years.push(year)
  }

  useEffect(() => {
    if (datos != null) {
      setValues(datos.datos)
    }
  }, [id, datos, selectedMonth, selectedYear])

  const handleFileChange = (event: any, index: number): any => {
    const file = event.currentTarget.files
      ? event.currentTarget.files[0]
      : null
    if (file) {
      const uniqueName = `${uuidv4()}${file.name.substring(
        file.name.lastIndexOf('.')
      )}`
      const newContent = [...values.contenido]
      // @ts-expect-error
      newContent[index] = {
        // @ts-expect-error
        ...newContent[index],
        imagen: {
          file,
          name: uniqueName
        }
      }
      setValues({ ...values, contenido: newContent })
    }
  }

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(!open)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="dialog_comentarios"
      maxWidth="xl"
    >
      <AiFillCloseCircle
        className="absolute top-2 right-2 text-black text-xl z-10 cursor-pointer"
        onClick={() => setOpen(false)}
      />
      <section className="flex flex-col gap-10 lg:w-full relative p-6">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="w-full grid gap-10 grid-cols-2 mt-4">
            <p className="p-2 border rounded">{months[selectedMonth - 1]}</p>
            <div className="flex items-center ">
              <label className="w-full">Año:</label>
              <p className="p-2 border rounded w-full">{selectedYear}</p>
            </div>
            <div className="relative col-span-2">
              <input
                type="text"
                placeholder="Fecha en texto"
                name="fecha_texto"
                value={values.fecha_texto || ''}
                onChange={handleChange}
                onBlur={handleBlur}
                className="p-2 border rounded w-full"
              />
              <Errors
                errors={errors.fecha_texto}
                touched={touched.fecha_texto}
              />
            </div>

            <div className="w-full">
              <h3 className="font-bold text-xl uppercase text-center text-main">
                Facebook
              </h3>
              <h4 className="text-md font-bold mt-4">Crecimiento</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Me gusta"
                    name="facebookCrecimiento.megusta"
                    value={values.facebookCrecimiento.megusta || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.facebookCrecimiento?.megusta}
                    touched={touched.facebookCrecimiento?.megusta}
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Seguidores"
                    name="facebookCrecimiento.seguidores"
                    value={values.facebookCrecimiento.seguidores || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.facebookCrecimiento?.seguidores}
                    touched={touched.facebookCrecimiento?.seguidores}
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Impresiones"
                    name="facebookCrecimiento.impresiones"
                    value={values.facebookCrecimiento.impresiones || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.facebookCrecimiento?.impresiones}
                    touched={touched.facebookCrecimiento?.impresiones}
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Visitas"
                    name="facebookCrecimiento.visitas"
                    value={values.facebookCrecimiento.visitas || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.facebookCrecimiento?.visitas}
                    touched={touched.facebookCrecimiento?.visitas}
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Publicaciones"
                    name="facebookCrecimiento.publicaciones"
                    value={values.facebookCrecimiento.publicaciones || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.facebookCrecimiento?.publicaciones}
                    touched={touched.facebookCrecimiento?.publicaciones}
                  />
                </div>
              </div>
              <h4 className="text-md font-bold mt-4">Publicaciones</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Interacciones"
                    name="facebookPublicaciones.interacciones"
                    value={values.facebookPublicaciones.interacciones || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.facebookPublicaciones?.interacciones}
                    touched={touched.facebookPublicaciones?.interacciones}
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Alcance"
                    name="facebookPublicaciones.alcance"
                    value={values.facebookPublicaciones.alcance || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.facebookPublicaciones?.alcance}
                    touched={touched.facebookPublicaciones?.alcance}
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Impresiones"
                    name="facebookPublicaciones.impresiones"
                    value={values.facebookPublicaciones.impresiones || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.facebookPublicaciones?.impresiones}
                    touched={touched.facebookPublicaciones?.impresiones}
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Publicaciones"
                    name="facebookPublicaciones.publicaciones"
                    value={values.facebookPublicaciones.publicaciones || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.facebookPublicaciones?.publicaciones}
                    touched={touched.facebookPublicaciones?.publicaciones}
                  />
                </div>
              </div>
              <h4 className="text-md font-bold mt-4">Reels</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Interacciones"
                    name="facebookReels.interacciones"
                    value={values.facebookReels.interacciones || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.facebookReels?.interacciones}
                    touched={touched.facebookReels?.interacciones}
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Alcance"
                    name="facebookReels.alcance"
                    value={values.facebookReels.alcance || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.facebookReels?.alcance}
                    touched={touched.facebookReels?.alcance}
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Visualizaciones"
                    name="facebookReels.visualizaciones"
                    value={values.facebookReels.visualizaciones || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.facebookReels?.visualizaciones}
                    touched={touched.facebookReels?.visualizaciones}
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Reels"
                    name="facebookReels.reels"
                    value={values.facebookReels.reels || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.facebookReels?.reels}
                    touched={touched.facebookReels?.reels}
                  />
                </div>
              </div>
            </div>
            <div className="w-full">
              <h3 className="font-bold text-xl uppercase text-center text-main">
                INSTAGRAM
              </h3>
              <h4 className="text-md font-bold mt-4">Perfil</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Seguidores"
                    name="instagramPerfil.seguidores"
                    value={values.instagramPerfil.seguidores || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.instagramPerfil?.seguidores}
                    touched={touched.instagramPerfil?.seguidores}
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Total impresiones"
                    name="instagramPerfil.impresiones"
                    value={values.instagramPerfil.impresiones || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.instagramPerfil?.impresiones}
                    touched={touched.instagramPerfil?.impresiones}
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Alcance"
                    name="instagramPerfil.alcance"
                    value={values.instagramPerfil.alcance || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.instagramPerfil?.alcance}
                    touched={touched.instagramPerfil?.alcance}
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Visitas al perfil"
                    name="instagramPerfil.visitaperfil"
                    value={values.instagramPerfil.visitaperfil || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.instagramPerfil?.visitaperfil}
                    touched={touched.instagramPerfil?.visitaperfil}
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="N° de publicaciones"
                    name="instagramPerfil.publicaciones"
                    value={values.instagramPerfil.publicaciones || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.instagramPerfil?.publicaciones}
                    touched={touched.instagramPerfil?.publicaciones}
                  />
                </div>
              </div>
              <h4 className="text-md font-bold mt-4">Posts</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Interacciones"
                    name="instagramPosts.interacciones"
                    value={values.instagramPosts.interacciones || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.instagramPosts?.interacciones}
                    touched={touched.instagramPosts?.interacciones}
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Alcance"
                    name="instagramPosts.alcance"
                    value={values.instagramPosts.alcance || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.instagramPosts?.alcance}
                    touched={touched.instagramPosts?.alcance}
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Publicaciones"
                    name="instagramPosts.publicaciones"
                    value={values.instagramPosts.publicaciones || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.instagramPosts?.publicaciones}
                    touched={touched.instagramPosts?.publicaciones}
                  />
                </div>
              </div>
              <h4 className="text-md font-bold mt-4">Reels</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Interacciones"
                    name="instagramReels.interacciones"
                    value={values.instagramReels.interacciones || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.instagramReels?.interacciones}
                    touched={touched.instagramReels?.interacciones}
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Alcance"
                    name="instagramReels.alcance"
                    value={values.instagramReels.alcance || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.instagramReels?.alcance}
                    touched={touched.instagramReels?.alcance}
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Reels"
                    name="instagramReels.reels"
                    value={values.instagramReels.reels || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.instagramReels?.reels}
                    touched={touched.instagramReels?.reels}
                  />
                </div>
              </div>
            </div>
            <div className="w-full">
              <h3 className="font-bold text-xl uppercase text-center text-main">
                TIKTOK
              </h3>
              <h4 className="text-md font-bold mt-4">Comunidad</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Seguidores"
                    name="tiktokComunidad.seguidores"
                    value={values.tiktokComunidad.seguidores || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.tiktokComunidad?.seguidores}
                    touched={touched.tiktokComunidad?.seguidores}
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Videos"
                    name="tiktokComunidad.videos"
                    value={values.tiktokComunidad.videos || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.tiktokComunidad?.videos}
                    touched={touched.tiktokComunidad?.videos}
                  />
                </div>
              </div>
              <h4 className="text-md font-bold mt-4">Perfil</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Visitas"
                    name="tiktokPerfil.visitas"
                    value={values.tiktokPerfil.visitas || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.tiktokPerfil?.visitas}
                    touched={touched.tiktokPerfil?.visitas}
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Videos"
                    name="tiktokPerfil.videos"
                    value={values.tiktokPerfil.videos || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.tiktokPerfil?.videos}
                    touched={touched.tiktokPerfil?.videos}
                  />
                </div>
              </div>
              <h4 className="text-md font-bold mt-4">Videos</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Interacciones"
                    name="tiktokVideos.interacciones"
                    value={values.tiktokVideos.interacciones || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.tiktokVideos?.interacciones}
                    touched={touched.tiktokVideos?.interacciones}
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Alcance"
                    name="tiktokVideos.alcance"
                    value={values.tiktokVideos.alcance || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.tiktokVideos?.alcance}
                    touched={touched.tiktokVideos?.alcance}
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Visualizaciones"
                    name="tiktokVideos.visualizaciones"
                    value={values.tiktokVideos.visualizaciones || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.tiktokVideos?.visualizaciones}
                    touched={touched.tiktokVideos?.visualizaciones}
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Vídeos"
                    name="tiktokVideos.vídeos"
                    value={values.tiktokVideos.vídeos || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.tiktokVideos?.vídeos}
                    touched={touched.tiktokVideos?.vídeos}
                  />
                </div>
              </div>
              <h4 className="text-md font-bold mt-4">Interacciones</h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Me gusta"
                    name="tiktokInteracciones.megusta"
                    value={values.tiktokInteracciones.megusta || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.tiktokInteracciones?.megusta}
                    touched={touched.tiktokInteracciones?.megusta}
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Comentarios"
                    name="tiktokInteracciones.comentarios"
                    value={values.tiktokInteracciones.comentarios || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.tiktokInteracciones?.comentarios}
                    touched={touched.tiktokInteracciones?.comentarios}
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Compartidos"
                    name="tiktokInteracciones.compartidos"
                    value={values.tiktokInteracciones.compartidos || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.tiktokInteracciones?.compartidos}
                    touched={touched.tiktokInteracciones?.compartidos}
                  />
                </div>
                <div className="relative">
                  <input
                    type="number"
                    placeholder="Vídeos"
                    name="tiktokInteracciones.vídeos"
                    value={values.tiktokInteracciones.vídeos || ''}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="p-2 border rounded"
                  />
                  <Errors
                    errors={errors.tiktokInteracciones?.vídeos}
                    touched={touched.tiktokInteracciones?.vídeos}
                  />
                </div>
              </div>
            </div>
            {/* ULTIMO */}
            <div className="w-full">
              <h3 className="font-bold text-xl uppercase text-center text-main">
                LO MAS DESTACADO
              </h3>
              <div className="grid gap-2 mt-10">
                {values.arrayDestacados.map((text, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder={`Destacado ${index + 1}`}
                      name={`arrayDestacados.${index}`}
                      value={text}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="p-2 border rounded flex-grow"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newContent = [...values.arrayDestacados]
                        newContent.splice(index, 1)
                        setValues({ ...values, arrayDestacados: newContent })
                      }}
                      className="text-red-500"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setValues({
                    ...values,
                    // @ts-expect-error
                    arrayDestacados: [...values.arrayDestacados, '']
                  })
                }}
                className="p-2 bg-blue-500 text-white rounded"
              >
                Agregar Destacado
              </button>
            </div>
            <div className="w-full">
              <h3 className="font-bold text-xl uppercase text-center text-main">
                Aprendizajes
              </h3>
              <div className="grid gap-2 mt-4">
                {values.aprendizajes.map((text, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder={`Aprendizaje ${index + 1}`}
                      name={`aprendizajes.${index}`}
                      value={text}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="p-2 border rounded flex-grow"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newContent = [...values.aprendizajes]
                        newContent.splice(index, 1)
                        setValues({ ...values, aprendizajes: newContent })
                      }}
                      className="text-red-500"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setValues({
                    ...values,
                    // @ts-expect-error
                    aprendizajes: [...values.aprendizajes, '']
                  })
                }}
                className="p-2 bg-blue-500 text-white rounded"
              >
                Agregar Aprendizaje
              </button>
            </div>
            <div className="w-full">
              <h3 className="font-bold text-xl uppercase text-center text-main">
                Retos
              </h3>
              <div className="grid gap-2 mt-4">
                {values.retos.map((text, index) => (
                  <div key={index} className="flex items-center space-x-2 mb-2">
                    <input
                      type="text"
                      placeholder={`Reto ${index + 1}`}
                      name={`retos.${index}`}
                      value={text}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      className="p-2 border rounded flex-grow"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        const newContent = [...values.retos]
                        newContent.splice(index, 1)
                        setValues({ ...values, retos: newContent })
                      }}
                      className="text-red-500"
                    >
                      X
                    </button>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setValues({
                    ...values,
                    // @ts-expect-error
                    retos: [...values.retos, '']
                  })
                }}
                className="p-2 bg-blue-500 text-white rounded"
              >
                Agregar Reto
              </button>
            </div>
            {/* IMAGENES */}
            <div className="w-full col-span-2">
              <h3 className="font-bold text-xl uppercase text-center text-main mt-0">
                Contenido
              </h3>
              <div className="w-full grid grid-cols-2 gap-10">
                {values.contenido.map((item: any, index) => (
                  <div key={index} className="mb-4">
                    <div className="flex flex-col space-y-4">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(event) => handleFileChange(event, index)}
                        className="p-2 border rounded"
                      />
                      {item.imagen && (
                        <img
                          src={`https://api.logosperu.com.pe/public/archivos_metricascm/${item?.imagen.name}`}
                          alt="preview"
                          className="w-32 h-32 object-cover"
                        />
                      )}
                      <input
                        type="text"
                        placeholder="Red Social"
                        value={item.redSocial}
                        onChange={(e) => {
                          const newContent = [...values.contenido]
                          // @ts-expect-error
                          newContent[index] = {
                            // @ts-expect-error
                            ...newContent[index],
                            redSocial: e.target.value
                          }
                          setValues({ ...values, contenido: newContent })
                        }}
                        className="p-2 border rounded"
                      />
                      <input
                        placeholder="Texto"
                        value={item.texto1}
                        type="text"
                        onChange={(e) => {
                          const newContent = [...values.contenido]
                          // @ts-expect-error
                          newContent[index] = {
                            // @ts-expect-error
                            ...newContent[index],
                            texto1: e.target.value
                          }
                          setValues({ ...values, contenido: newContent })
                        }}
                        className="p-2 border rounded"
                      />
                      <input
                        type="date"
                        placeholder="Fecha"
                        value={item.fecha}
                        onChange={(e) => {
                          const newContent = [...values.contenido]
                          // @ts-expect-error
                          newContent[index] = {
                            // @ts-expect-error
                            ...newContent[index],
                            fecha: e.target.value
                          }
                          setValues({ ...values, contenido: newContent })
                        }}
                        className="p-2 border rounded"
                      />
                      <textarea
                        placeholder="Texto"
                        value={item.texto}
                        onChange={(e) => {
                          const newContent = [...values.contenido]
                          // @ts-expect-error
                          newContent[index] = {
                            // @ts-expect-error
                            ...newContent[index],
                            texto: e.target.value
                          }
                          setValues({ ...values, contenido: newContent })
                        }}
                        className="p-2 border rounded"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          const newContent = [...values.contenido]
                          newContent.splice(index, 1)
                          setValues({ ...values, contenido: newContent })
                        }}
                        className="text-white bg-red-500"
                      >
                        Eliminar
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setValues({
                    ...values,
                    contenido: [
                      // @ts-expect-error
                      ...values.contenido,
                      // @ts-expect-error1
                      { imagen: null, redSocial: '', fecha: '', texto: '' }
                    ]
                  })
                }}
                className="p-2 bg-blue-500 text-white rounded"
              >
                Agregar Contenido
              </button>
            </div>
          </div>
          <div className="flex flex-col">
            <button
              type={!loading ? 'submit' : 'button'}
              disabled={loading}
              className="mt-6 p-2 bg-main text-white rounded cols-span-2 flex text-center font-bold   justify-center"
            >
              {!loading ? 'Enviar' : 'Validando...'}
            </button>
            {datos?.id && (
              <button
                type="button"
                // eslint-disable-next-line @typescript-eslint/no-misused-promises
                onClick={async () => {
                  if (!loading) {
                    await handleDelete()
                  }
                }}
                className="mt-6 p-2 bg-red-500 text-white rounded cols-span-2 w-full flex  font-bold  text-center justify-center"
              >
                {!loading ? 'Eliminar' : 'Validando...'}
              </button>
            )}
          </div>
        </form>
      </section>
    </Dialog>
  )
}
