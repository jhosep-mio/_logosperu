import { type ChangeEvent, type MouseEvent } from 'react'
import { FaTimes, FaImage } from 'react-icons/fa'
import { type ImagePreviewPropsUdpdate } from '../../../../shared/schemas/Interfaces'
import { Global } from '../../../../../helper/Global'

export const ImageUpdate = ({ url, setUrl, boton, setBoton, imagen, setImagen, clase, disabled }: ImagePreviewPropsUdpdate): JSX.Element => {
  const imagen1Function = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files
    if ((files != null) && files.length > 0) {
      const url = URL.createObjectURL(files[0])
      const imgPreview = document.getElementById(
        `img-preview${clase}`
      ) as HTMLImageElement
      const iconImage = document.getElementById(`icon-image${clase}`)

      if (imgPreview !== null && iconImage !== null) {
        imgPreview.src = url
        imgPreview.classList.remove('d-none')
        iconImage.classList.add('d-none')
      }

      setUrl(files[0].name)
      setBoton(true)

      setImagen({
        archivo: files[0],
        archivoName: `${Date.now()}_${files[0].name}`
      })
    }
  }

  const deleteImg = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault()
    setBoton(false)

    const imgPreview = document.getElementById(
      `img-preview${clase}`
    ) as HTMLImageElement
    const iconImage = document.getElementById(`icon-image${clase}`)
    const imagen = document.getElementById(
      `imagen${clase}`
    ) as HTMLInputElement

    if (imgPreview !== null && (iconImage != null) && imagen !== null) {
      iconImage.classList.remove('d-none')
      imgPreview.classList.add('d-none')
      imagen.value = ''
    }
  }

  return (
    <div className="w-full border p-4 text-black">
      <label
        htmlFor={`imagen${clase}`}
        id={`icon-image${clase}`}
        className="btn btn-primary col-md-12 btn-openImage cursor-pointer "
      >
        <FaImage className="icon-preimage lactme" />
      </label>
      {boton
        ? (
        <span
          id="icon-cerrar"
          className="flex justify-center items-center text-white rounded-md mb-5 gap-2"
        >
          <p className="w-full line-clamp-1 text-center text-black">
            {'' + url}
          </p>
          <button
            className="btn btn-danger mb-0 flex items-center justify-center text-red-500"
            onClick={deleteImg}
          >
            <FaTimes className="w-full" />
          </button>
        </span>
          )
        : (
            ''
          )}

      <input
        accept="image/*"
        id={`imagen${clase}`}
        className="d-none"
        type="file"
        name={`imagen${clase}`}
        onChange={imagen1Function}
        disabled={disabled}
      />
      {imagen !== null
        ? (
        <img
          className="img-thumbnail"
          id={`img-preview${clase}`}
          src={`${Global.urlImages}/firmas/${imagen}`}
        />
          )
        : (
        <img
          className="img-thumbnail d-none cursor-pointer"
          id={`img-preview${clase}`}
          alt="img"
        />
          )}
    </div>
  )
}
