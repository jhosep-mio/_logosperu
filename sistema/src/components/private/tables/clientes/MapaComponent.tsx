import {
  useEffect,
  useState,
  type KeyboardEvent
} from 'react'
import { type propsvaluesMapa } from '../../../shared/schemas/Interfaces'

const mapComponent = ({ setLatitud, setLongitud, setUbicacion, latitud, longitud, setLoading }: propsvaluesMapa): JSX.Element => {
  const [map, setmap] = useState<google.maps.Map | null>(null)
  const [marker, setmarker] = useState<google.maps.Marker | null>(null)

  useEffect(() => {
    setLoading(true)
    const cargarmap = (): void => {
      const mapa = new window.google.maps.Map(
        document.getElementById('map') as HTMLElement,
        {
          center: { lat: latitud != null ? latitud : -12.046373, lng: longitud != null ? longitud : -77.042754 },
          zoom: 12
        }
      )

      const marcador = new window.google.maps.Marker({
        map: mapa,
        position: mapa.getCenter(),
        draggable: true
      })

      setmap(mapa)
      setmarker(marcador)

      // Manejar el evento de arrastrar y soltar el marker
      marker?.addListener('dragend', () => {
        const lat = marker?.getPosition()?.lat()
        const lng = marker?.getPosition()?.lng()
        if (lat !== undefined && lng !== undefined) {
          setUbicacion({ lat, lng })
          setLatitud(lat)
          setLongitud(lng)
        }
      })

      // Agregar el buscador de ubicación
      const input = document.getElementById(
        'ubicacion-input'
      ) as HTMLInputElement
      const autocomplete = new window.google.maps.places.Autocomplete(input)

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace()

        if (!place.geometry?.location) {
          return
        }

        const { lat, lng } = place.geometry.location
        mapa.setCenter({ lat: Number(lat), lng: Number(lng) })
        marcador.setPosition({ lat: Number(lat), lng: Number(lng) })
        setUbicacion({ lat: Number(lat), lng: Number(lng) })
        setLatitud(lat)
        setLongitud(lng)
      })
    }

    if (window?.google?.maps) {
      cargarmap()
    } else {
      const script = document.createElement('script')
      script.src = script.src =
        'https://maps.googleapis.com/maps/api/js?key=AIzaSyCQnmO2O0RPVFuzisXOA402_ZSbwLtSU5Q&libraries=places'
      script.onload = cargarmap
      document.head.appendChild(script)
    }
    setLoading(false)
    return () => {
      // No es necesario limpiar el script en este caso
    }
  }, [])

  const buscarUbicacion = (): void => {
    const input = document.getElementById(
      'ubicacion-input'
    ) as HTMLInputElement

    if (!input.value) {
      return
    }

    const geocoder = new window.google.maps.Geocoder()

    geocoder.geocode({ address: input.value }, (results, status) => {
      if (status == 'OK' && results[0]) {
        const lat = results[0].geometry.location.lat()
        const lng = results[0].geometry.location.lng()

        if (!isNaN(lat) && !isNaN(lng) && map !== null && marker !== null) {
          map.setCenter({ lat, lng })
          marker.setPosition({ lat, lng })
          setUbicacion({ lat, lng })
          setLatitud(lat)
          setLongitud(lng)
        }
      }
    })
  }

  useEffect(() => {
    if (marker) {
      // Manejar el evento de arrastrar y soltar el marcador
      const handleDragEnd = (): void => {
        const lat = marker.getPosition()?.lat()
        const lng = marker.getPosition()?.lng()
        if (lat !== undefined && lng !== undefined) {
          setUbicacion({ lat, lng })
          setLatitud(lat)
          setLongitud(lng)
        }
      }

      marker.addListener('dragend', handleDragEnd)

      return () => {
        window.google.maps.event.clearListeners(marker, 'dragend')
      }
    }
  }, [marker, setUbicacion, setLatitud, setLongitud])

  const handleKeyPress = (event: KeyboardEvent<HTMLInputElement>): void => {
    if (event.key == 'Enter') {
      event.preventDefault() // Evitar la recarga de la página
    }
  }

  return (
    <div className="w-full lg:p-3 mt-3">
      <p className="bg-white pt-0 pr-2 pb-0  -mt-3 mr-0 mb-0 ml-1 font-medium text-gray-600">
        Ubicación
      </p>
      <div className="w-full flex justify-between mt-3 gap-3">
        <input
          id="ubicacion-input"
          type="text"
          placeholder="Buscar ubicación..."
          onChange={buscarUbicacion}
          onKeyDown={handleKeyPress}
          className="border-2 w-full px-3 py-2 text-black rounded-md outline-none"
        />
        <button
          type="button"
          onClick={buscarUbicacion}
          className="w-fit px-4 bg-main text-white rounded-md"
        >
          Buscar
        </button>
      </div>
      <div
        id="map"
        style={{ width: '100%', height: '400px' }}
        className="mt-3"
      />
    </div>
  )
}

export default mapComponent
