import React, { useState, useEffect } from 'react'
import { IoMdCheckmark } from 'react-icons/io'

type Informacion = {
  [key: string]: string[];
};

export const InfoCapacitaciones = ({
  selectedInfo
}: {
  selectedInfo: string;
}) => {
  const [loading, setLoading] = useState(true)
  const [informaciones, setInformaciones] = useState<Informacion>({})

  useEffect(() => {
    setLoading(true) // Mostrar el efecto de carga al iniciar la carga de nuevos datos

    // Simulación de carga de datos
    const timer = setTimeout(() => {
      const infoData: Informacion = {
        facebook: [
          'Introducción explicando la estructura y objetivos de la capacitación.',
          'Explicación de los elementos de la interfaz de Facebook Ads.',
          'Panel de control.',
          'Menús y opciones principales.',
          'Herramientas de análisis y seguimiento.',
          'Identificación del objetivo del anuncio.',
          'Selección de tipo de campaña.',
          'Configuración de presupuesto y segmentación.',
          'Configuración de públicos objetivo.',
          'Revisión y publicación del anuncio en tiempo real.'
        ],
        google: [
          'Introducción explicando la estructura y objetivos de la capacitación.',
          'Explicación detallada de los elementos de la interfaz de Google Ads:',
          'Panel de control.',
          'Menús y opciones principales.',
          'Herramientas de análisis y seguimiento.',
          'Demostración en vivo de la creación de una campaña publicitaria básica.',
          'Selección de tipo de campaña.',
          'Configuración de presupuesto y segmentación.',
          'Creación de anuncios simples.',
          'Configuración de palabras clave',
          'Preguntas y respuestas para aclarar dudas durante la capacitación.'
        ],
        pasarelas: [
          'Descripción general de las pasarelas de pago.',
          'Demostración de la interfaz de usuario genérica.',
          'Guía paso a paso para crear una cuenta en una pasarela de pago.',
          'Configuración de métodos de pago.',
          'Explicación detallada sobre cómo generar un link de pago.',
          'Demostración del proceso completo de pago desde el envío del link de pago al cliente hasta la confirmación de la transacción.',
          'Explicación de los diferentes métodos de pago aceptados por las pasarelas de pago genéricas.'
        ]
        // Agrega otras capacitaciones si es necesario
      }

      setInformaciones(infoData)
      setLoading(false) // Ocultar el efecto de carga cuando se completan los datos
    }, 500)

    // Limpiar el temporizador en la limpieza del efecto
    return () => clearTimeout(timer)
  }, [selectedInfo])

  return (
    <>
      {loading
        ? (
        <p className="text-center text-3xl  w-full text-main h-[600px] rounded-xl animate-pulse bg-gray-100"></p>
          )
        : (
        <>
          <div className="flex flex-col px-6 relative py-8 rounded-xl border-2 border-white bg-white transition-all z-10">
            <h5 className="text-3xl text-center font-bold text-main mb-6">
              APRENDERÁS
            </h5>
            {informaciones[selectedInfo] &&
              informaciones[selectedInfo].map((item, index) => (
                <p
                  key={index}
                  className="text-base mb-1 flex gap-2 items-center"
                >
                  <IoMdCheckmark className="text-xl text-main w-8" />
                  {item}
                </p>
              ))}
          </div>
        </>
          )}
    </>
  )
}
