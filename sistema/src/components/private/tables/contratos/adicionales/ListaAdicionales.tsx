import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { FaChevronDown, FaChevronUp } from 'react-icons/fa6'
export const ListaAdicionales = ({
  agregarArrayPesos
}: {
  agregarArrayPesos: any
}): JSX.Element => {
  const [desplegado, setDesplegado] = useState<string | null>(null)

  return (
    <div className="flex flex-col gap-1 mt-3">
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Animación de Logo(s)')
        }}
      >
        Animación de Logo
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Animación de Personaje(s)')
        }}
      >
        Animación de Personaje
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Asesoria en creación de Redes Sociales')
        }}
      >
        Asesoria en creación de Redes Sociales
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Administracion de dominio .com')
        }}
      >
        Administracion de dominio .com
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Administracion de dominio .pe')
        }}
      >
        Administracion de dominio .pe
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Actualizacion de logo')
        }}
      >
        Actualizacion de logo
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Capacitación de Tiktok Ads - 45 minutos')
        }}
      >
        Capacitación de Tiktok Ads - 45 minutos
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Capacitación facebook ads (plan basico)')
        }}
      >
        Capacitación facebook ads (plan basico)
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Capacitación facebook ads (plan intermedio)')
        }}
      >
        Capacitación facebook ads (plan intermedio)
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Capacitación facebook ads (plan full)')
        }}
      >
        Capacitación facebook ads (plan full)
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Capacitación google ads (plan basico)')
        }}
      >
        Capacitación google ads (plan basico)
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Capacitación google ads (plan intermedio)')
        }}
      >
        Capacitación google ads (plan intermedio)
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Capacitación google ads (plan full)')
        }}
      >
        Capacitación google ads (plan full)
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Capacitación en redes Sociales (plan basico)')
        }}
      >
        Capacitación en redes Sociales (plan basico)
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Capacitación en redes Sociales (plan avanzado)')
        }}
      >
        Capacitación en redes Sociales (plan avanzado)
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Creacion de Reel 10s')
        }}
      >
        Creacion de Reel 10s
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Creacion de Reel 20s')
        }}
      >
        Creacion de Reel 20s
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Creacion de Reel 30s')
        }}
      >
        Creacion de Reel 30s
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Desarrollo de Manual de Marca(s) Cobre')
        }}
      >
        Desarrollo de Manual de Marca Cobre
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Desarrollo de Manual de Marca(s) Silver')
        }}
      >
        Desarrollo de Manual de Marca Silver
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Diseño de pieza(s) grafica(s)')
        }}
      >
        Diseño de pieza grafica
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Diseño de gorra(s)')
        }}
      >
        Diseño de gorra
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Diseño de logo 1 propuesta')
        }}
      >
        Diseño de logo 1 propuesta
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Diseño de logo 2 propuestas')
        }}
      >
        Diseño de logo 2 propuestas
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Diseño de Firma(s) de correo(s)')
        }}
      >
        Diseño de Firma de correo
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Diseño de Packing(s)')
        }}
      >
        Diseño de Packing
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Diseño de Portada(s)')
        }}
      >
        Diseño de Portada
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Diseño de Perfil(es)')
        }}
      >
        Diseño de Perfil
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Diseño de Tarjeta(s) de presentación')
        }}
      >
        Diseño de Tarjeta de presentación
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Diseño de Hoja(s) membretada(s)')
        }}
      >
        Diseño de Hoja membretada
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Diseño de Flyer(s)')
        }}
      >
        Diseño de Flyer
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Diseño de Brochure 04 caras')
        }}
      >
        Diseño de Brochure 04 caras
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Diseño de Brochure 06 caras')
        }}
      >
        Diseño de Brochure 06 caras
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Diseño de Brochure 08 caras')
        }}
      >
        Diseño de Brochure 08 caras
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Diseño de Catalogo 04 caras')
        }}
      >
        Diseño de Catalogo 04 caras
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Diseño de Catalogo 06 caras')
        }}
      >
        Diseño de Catalogo 06 caras
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Diseño de Catalogo 08 caras')
        }}
      >
        Diseño de Catalogo 08 caras
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Diseño de Fotocheck(s)')
        }}
      >
        Diseño de Fotocheck
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Diseño de uniforme(s)')
        }}
      >
        Diseño de uniforme
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Diseño de Etiqueta(s)')
        }}
      >
        Diseño de Etiqueta
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Diseño de Montaje(s)')
        }}
      >
        Diseño de Montaje
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Diseño de Personaje(s)')
        }}
      >
        Diseño de Personaje
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Diseño de Letrero(s)')
        }}
      >
        Diseño de Letrero
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Diseño de Sticker(s)')
        }}
      >
        Diseño de sticker
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Diseño de Banner(s)')
        }}
      >
        Diseño de Banner
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Diseño de Volante(s)')
        }}
      >
        Diseño de Volante
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Diseño de Sobre(s)')
        }}
      >
        Diseño de Sobre
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Diseño de Folder(s)')
        }}
      >
        Diseño de Folder
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Diseño de Bolsa(s)')
        }}
      >
        Diseño de Bolsa
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Diseño de Calendario(s)')
        }}
      >
        Diseño de Calendario
      </p>
      <div
        className="flex justify-between items-center bg-white hover:bg-gray-300 transition-all px-2 cursor-pointer"
        onClick={() => {
          if (desplegado == 'Merchandising') {
            setDesplegado(null)
          } else {
            setDesplegado('Merchandising')
          }
        }}
      >
        <span>Diseño de Merchandising</span>
        {desplegado ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      <AnimatePresence>
        {desplegado == 'Merchandising' && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0
            }}
            animate={{
              opacity: 1,
              height: '100%'
            }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut'
            }}
            className="mb-2 pl-4"
          >
            <p
              className="hover:bg-gray-300 transition-colors px-2 cursor-pointer"
              onClick={() => {
                agregarArrayPesos('Diseño de tazas y tomatodos')
              }}
            >
              Diseño de tazas y tomatodos
            </p>
            <p
              className="hover:bg-gray-300 transition-colors px-2 cursor-pointer"
              onClick={() => agregarArrayPesos('Diseño de lapiceros')}
            >
              Diseño de lapiceros
            </p>
            <p
              className="hover:bg-gray-300 transition-colors px-2 cursor-pointer"
              onClick={() =>
                agregarArrayPesos('Diseño de tarjeta de presentación')
              }
            >
              Diseño de tarjeta de presentación
            </p>
            <p
              className="hover:bg-gray-300 transition-colors px-2 cursor-pointer"
              onClick={() =>
                agregarArrayPesos('Diseño de Polos Cuello redondo')
              }
            >
              Diseño de Polos Cuello redondo
            </p>
            <p
              className="hover:bg-gray-300 transition-colors px-2 cursor-pointer"
              onClick={() =>
                agregarArrayPesos('Diseño de Polos Cuello camisero')
              }
            >
              Diseño de Polos Cuello camisero
            </p>
            <p
              className="hover:bg-gray-300 transition-colors px-2 cursor-pointer"
              onClick={() => agregarArrayPesos('Diseño de camisas')}
            >
              Diseño de camisas
            </p>
            <p
              className="hover:bg-gray-300 transition-colors px-2 cursor-pointer"
              onClick={() => agregarArrayPesos('Diseño de chalecos')}
            >
              Diseño de chalecos
            </p>
          </motion.div>
        )}
      </AnimatePresence>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Desarrollo de interna web Informativa')
        }}
      >
        Desarrollo de interna web Informativa
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Desarrollo de interna web Administrable')
        }}
      >
        Desarrollo de interna web Administrable
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Fotográfico retoque')
        }}
      >
        Fotográfico retoque
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Fotográfico sesión')
        }}
      >
        Fotográfico sesión
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos(
            'Mantenimiento o actualización web (Textos, Imagenes, Google maps , teléfono y dirección)'
          )
        }}
      >
        Mantenimiento o actualización web (Textos, Imagenes, Google maps ,
        teléfono y dirección)
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Reenvio de archivos finales')
        }}
      >
        Reenvio de archivos finales
      </p>
      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Revisión de servicios de terceros')
        }}
      >
        Revisión de servicios de terceros
      </p>

      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Plantillas de PPT')
        }}
      >
        Plantillas de PPT
      </p>
      <div
        className="flex justify-between items-center bg-white hover:bg-gray-300 transition-all px-2 cursor-pointer"
        onClick={() => {
          if (desplegado == 'servicioterceros') {
            setDesplegado(null)
          } else {
            setDesplegado('servicioterceros')
          }
        }}
      >
        <span>Servicio de Impresión - Diversos (terceros)</span>
        {desplegado ? <FaChevronUp /> : <FaChevronDown />}
      </div>
      <AnimatePresence>
        {desplegado == 'servicioterceros' && (
          <motion.div
            initial={{
              opacity: 0,
              height: 0
            }}
            animate={{
              opacity: 1,
              height: '100%'
            }}
            transition={{
              duration: 0.3,
              ease: 'easeInOut'
            }}
            className="mb-2 pl-4"
          >
            <p
              className="hover:bg-gray-300 transition-colors px-2 cursor-pointer"
              onClick={() => {
                const cantidad = prompt(
                  "Ingrese la cantidad para 'Impresión de tomatodos'"
                )
                if (cantidad) {
                  agregarArrayPesos(
                    'Impresión de tomatodos',
                    parseInt(cantidad) || undefined
                  )
                }
              }}
            >
              Impresión de tomatodos
            </p>
            <p
              className="hover:bg-gray-300 transition-colors px-2 cursor-pointer"
              onClick={() => {
                const cantidad = prompt(
                  "Ingrese la cantidad para 'Impresión de lapiceros'"
                )
                if (cantidad) {
                  agregarArrayPesos(
                    'Impresión de lapiceros',
                    parseInt(cantidad) || undefined
                  )
                }
              }}
            >
              Impresión de lapiceros
            </p>
            <p
              className="hover:bg-gray-300 transition-colors px-2 cursor-pointer"
              onClick={() => {
                const cantidad = prompt(
                  "Ingrese la cantidad para 'Impresión de tarjeta de presentación'"
                )
                if (cantidad) {
                  agregarArrayPesos(
                    'Impresión de tarjeta de presentación',
                    parseInt(cantidad) || undefined
                  )
                }
              }}
            >
              Impresión de tarjeta de presentación - 1 millar
            </p>
            <p
              className="hover:bg-gray-300 transition-colors px-2 cursor-pointer"
              onClick={() => {
                const cantidad = prompt(
                  "Ingrese la cantidad para 'Impresión de Tazas'"
                )
                if (cantidad) {
                  agregarArrayPesos(
                    'Impresión de Tazas',
                    parseInt(cantidad) || undefined
                  )
                }
              }}
            >
              Impresión de Tazas
            </p>
            <p
              className="hover:bg-gray-300 transition-colors px-2 cursor-pointer"
              onClick={() => {
                const cantidad = prompt(
                  "Ingrese la cantidad para 'Confección de Polos Cuello redondo'"
                )
                if (cantidad) {
                  agregarArrayPesos(
                    'Confección de Polos Cuello redondo',
                    parseInt(cantidad) || undefined
                  )
                }
              }}
            >
              Confección de Polos Cuello redondo
            </p>
            <p
              className="hover:bg-gray-300 transition-colors px-2 cursor-pointer"
              onClick={() => {
                const cantidad = prompt(
                  "Ingrese la cantidad para 'Confección de Polos Cuello camisero'"
                )
                if (cantidad) {
                  agregarArrayPesos(
                    'Confección de Polos Cuello camisero',
                    parseInt(cantidad) || undefined
                  )
                }
              }}
            >
              Confección de Polos Cuello camisero
            </p>
            <p
              className="hover:bg-gray-300 transition-colors px-2 cursor-pointer"
              onClick={() => {
                const cantidad = prompt(
                  "Ingrese la cantidad para 'Confección de camisas'"
                )
                if (cantidad) {
                  agregarArrayPesos(
                    'Confección de camisas',
                    parseInt(cantidad) || undefined
                  )
                }
              }}
            >
              Confección de camisas
            </p>
            <p
              className="hover:bg-gray-300 transition-colors px-2 cursor-pointer"
              onClick={() => {
                const cantidad = prompt(
                  "Ingrese la cantidad para 'Confección de chalecos'"
                )
                if (cantidad) {
                  agregarArrayPesos(
                    'Confección de chalecos',
                    parseInt(cantidad) || undefined
                  )
                }
              }}
            >
              Confección de chalecos
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <p
        className="bg-white hover:bg-gray-300 transition-colors px-2 cursor-pointer"
        onClick={() => {
          agregarArrayPesos('Vectorización de logo(s)')
        }}
      >
        Vectorización de logo
      </p>
    </div>
  )
}
