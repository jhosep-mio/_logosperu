import {
  useEffect,
  useState
} from 'react'
import { type propsvaluesMapa } from '../../../../shared/schemas/Interfaces'

const MapaComponentView = ({ setLatitud, setLongitud, setUbicacion, latitud, longitud, setLoading }: propsvaluesMapa): JSX.Element => {
  const [, setmap] = useState<google.maps.Map | null>(null)
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
        draggable: false
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

  return (
    <div className="w-full lg:p-3 mt-3">
      <div
        id="map"
        style={{ width: '100%', height: '400px' }}
        className="mt-3"
      />
    </div>
  )
}

export default MapaComponentView
