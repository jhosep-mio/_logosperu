'use client'
import CountUp from 'react-countup'
import { InView } from 'react-intersection-observer'

export const Contador = ({ numero } : {numero: number}) => {
  return (
    <InView>
      {({ inView, ref }) => (
        <span ref={ref}>{inView && <CountUp end={numero} />} </span>
      )}
    </InView>
  )
}
