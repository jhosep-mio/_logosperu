import { type ChangeEvent, type MouseEvent } from 'react'
import { FaTimes, FaImage } from 'react-icons/fa'
import { type ImagePreviewProps } from '../../../../shared/schemas/Interfaces'

export const ImagenProductoUpload = ({ url, setUrl, boton, setBoton, setImagen, clase }: ImagePreviewProps): JSX.Element => {
  const imagen1Function = (event: ChangeEvent<HTMLInputElement>): void => {
    const files = event.target.files
    if (files != null && files.length > 0) {
      const file = files[0]
      const isImage = file.type.includes('image')
      const url = URL.createObjectURL(file)

      const imgPreview = document.getElementById(`img-preview${clase}`) as HTMLImageElement
      const videoPreview = document.getElementById(`video-preview${clase}`) as HTMLVideoElement
      const iconImage = document.getElementById(`icon-image${clase}`)

      if (imgPreview !== null && videoPreview !== null && iconImage !== null) {
        if (isImage) {
          imgPreview.src = url
          imgPreview.classList.remove('d-none')
          videoPreview.classList.add('d-none')
        } else {
          videoPreview.src = url
          videoPreview.classList.remove('d-none')
          imgPreview.classList.add('d-none')
        }
        iconImage.classList.add('d-none')
      }

      setUrl(file.name)
      setBoton(true)

      setImagen({
        archivo: file,
        archivoName: `${Date.now()}_${file.name}`
      })
    }
  }

  const deleteImg = (e: MouseEvent<HTMLButtonElement>): void => {
    e.preventDefault()
    setBoton(false)

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

  return (
    <div className="w-full border p-4">
      <label
        htmlFor={`imagen${clase}`}
        id={`icon-image${clase}`}
        className="btn btn-primary col-md-12 btn-openImage cursor-pointer text-black"
      >
        <FaImage className="icon-preimage" />
      </label>
      {boton
        ? (
        <span
          id="icon-cerrar"
          className="flex justify-center items-center text-white rounded-md mb-5 gap-2"
        >
          <button
            className="btn btn-danger mb-0 flex items-center justify-center text-red-600"
            onClick={deleteImg}
          >
            <FaTimes className="w-full" />
          </button>
          <p className="text-black line-clamp-1">{'' + url}</p>
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
      />
      <img className="img-thumbnail d-none" id={`img-preview${clase}`} alt="img" />
      <video className="img-thumbnail d-none mx-auto max-h-[120px]" id={`video-preview${clase}`} muted autoPlay loop />
    </div>
  )
}
