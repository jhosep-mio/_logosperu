import React, { useState, type Dispatch, type SetStateAction } from 'react'
import Swal from 'sweetalert2'
import { RiDeleteBin6Line } from 'react-icons/ri'
import { RViewer, RViewerTrigger } from 'react-viewerjs'
import {
  type ImagenState,
  type arrayCategoriasToPortafolio
} from '../../../../shared/schemas/Interfaces'
import { Global } from '../../../../../helper/Global'
import { TitleBriefs } from '../../../../shared/TitleBriefs'
import { ImagenProductoUpload } from './ImagenProductoUpload'
import axios from 'axios'

export const AgregarMarca = ({
  arrayPesos,
  setarrayPesos,
  setOpen,
  open,
  imagenproducto,
  setImagenproducto
}: {
  open: boolean
  arrayPesos: arrayCategoriasToPortafolio[]
  setarrayPesos: Dispatch<SetStateAction<arrayCategoriasToPortafolio[]>>
  setOpen: Dispatch<SetStateAction<boolean>>
  imagenproducto: ImagenState
  setImagenproducto: Dispatch<SetStateAction<ImagenState>>
}): JSX.Element => {
  const token = localStorage.getItem('token')
  const [botonproducto, setBotonproducto] = useState(false)
  const [urlproducto, setUrlproducto] = useState('')

  const agregarArrayPesos = (e: React.MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault()
    if (imagenproducto.archivo) {
      setarrayPesos([...arrayPesos, { id: Date.now(), imagen1: imagenproducto }])
      setImagenproducto({
        archivo: null,
        archivoName: ''
      })
      deleteImg('producto')
      setOpen(false)
      setBotonproducto(false)
    } else {
      Swal.fire('Complete todos los campos', '', 'error')
    }
  }

  const deleteImg = (clase: string): void => {
    const imgPreview = document.getElementById(`img-preview${clase}`) as HTMLImageElement
    const videoPreview = document.getElementById(`video-preview${clase}`) as HTMLVideoElement
    const iconImage = document.getElementById(`icon-image${clase}`)
    const imagen = document.getElementById(`imagen${clase}`) as HTMLInputElement
    if (imgPreview !== null && videoPreview !== null && iconImage !== null && imagen !== null) {
      iconImage.classList.remove('d-none')
      imgPreview.classList.add('d-none')
      videoPreview.classList.add('d-none')
      imagen.value = ''
    }
  }

  const eliminarImagen = async (nombre: string): Promise<void> => {
    await axios.delete(
        `${Global.url}/eliminarImagenMarca/${nombre ?? ''}`, {
          headers: {
            Authorization: `Bearer ${
              token !== null && token !== '' ? token : ''
            }`
          }
        }
    )
  }

  const eliminarArray = async (id: number | null, nombre: string): Promise<void> => {
    const nuevoArray = arrayPesos.filter((peso) => peso.id !== id)
    setarrayPesos(nuevoArray)
    await eliminarImagen(nombre)
  }

  return (
    <form className="bg-white w-full rounded-xl px-4">
      {open &&
        <>
            <div className="w-full flex flex-col md:flex-row md:items-center gap-y-2 mb-10">
                <div className="w-full flex justify-center items-center flex-col md:flex-row gap-2 lg:gap-5">
                <div className="w-full lg:w-2/6">
                    <TitleBriefs titulo="Imagen " />
                    <ImagenProductoUpload
                    url={urlproducto}
                    setUrl={setUrlproducto}
                    boton={botonproducto}
                    setBoton={setBotonproducto}
                    setImagen={setImagenproducto}
                    clase="producto"
                    />
                </div>
                <div className="w-full  md:w-1/6">
                    <button
                    className="w-full bg-main text-white hover:bg-primary justify-center flex items-center gap-2 py-2 px-4 rounded-lg transition-colors"
                    onClick={agregarArrayPesos}
                    >
                    Agregar
                    </button>
                </div>
                </div>
            </div>
        </>
      }

      <div className="bg-gray-100 py-4 md:p-8 rounded-xl mb-10">
        <div className="hidden md:grid grid-cols-1 md:grid-cols-2 items-center justify-center gap-4 mb-5 p-4 text-black">
          <h5 className="md:text-center">Imagen</h5>
          <h5 className="md:text-center">Eliminar</h5>
        </div>
        {arrayPesos.map((pro: arrayCategoriasToPortafolio) => (
          <div
            className="mx-5 md:mx-0 grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-4 items-center mb-4 bg-white p-4 rounded-xl text-black"
            key={pro.id}
          >
            <div className="md:text-center">
              <h5 className="md:hidden text-center text-black font-bold mb-2">
                Iamgen
              </h5>
              {pro.imagen1.archivo != null &&
              pro.imagen1.archivo.size > 0
                ? (
                <RViewer
                  imageUrls={`${URL.createObjectURL(
                    pro.imagen1.archivo
                  )}`}
                >
                  <RViewerTrigger>
                    <img
                      src={`${URL.createObjectURL(pro.imagen1.archivo)}`}
                      className="w-20 h-20 md:m-auto object-contain cursor-pointer mx-auto"
                    />
                  </RViewerTrigger>
                </RViewer>
                  )
                : (
                    pro.imagen1.archivo && (
                  <div className="w-full">
                    <img
                      src={`${Global.urlImages}/clasificados/marcas/${pro.imagen1.archivoName}`}
                      alt=""
                      className="w-20 h-20 md:m-auto object-contain"
                    />
                  </div>
                    )
                  )}
            </div>
            <div className="md:text-center flex flex-col items-center justify-center">
              <RiDeleteBin6Line
                className="cursor-pointer text-center"
                onClick={() => {
                  eliminarArray(pro.id, pro.imagen1.archivoName)
                }}
              />
            </div>
          </div>
        ))}
      </div>
    </form>
  )
}
