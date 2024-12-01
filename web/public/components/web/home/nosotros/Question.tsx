'use client'
import { InView } from 'react-intersection-observer'

export const Question = () => {
  return (
    <InView>
      {({ inView, ref }) => (
        <h2
          ref={ref}
          className={`mb-12 px-6 text-3xl 2xl:text-6xl text-center mx-auto xl:mx-0 xl:text-left uppercase font-bold text-azul_serio relative title--nosotros ${
            inView ? 'title-animate--nosotros' : ''
          }`}
        >
          ¿Por qué elegirnos?
        </h2>
      )}
    </InView>
  )
}
