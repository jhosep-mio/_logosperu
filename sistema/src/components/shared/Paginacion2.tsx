import { useState, useEffect } from 'react'
import Pagination from '@mui/material/Pagination'
import { type paginacionValues } from './schemas/Interfaces'

export const Paginacion2 = ({
  totalPosts,
  cantidadRegistros,
  paginaActual,
  setpaginaActual
}: paginacionValues): JSX.Element => {
  const [numPaginas, setNumPaginas] = useState(0)
  const [, setInputPage] = useState<number | string>(paginaActual)
  useEffect(() => {
    const calcularNumPaginas = Math.ceil(totalPosts / cantidadRegistros)
    setNumPaginas(calcularNumPaginas)
  }, [totalPosts, cantidadRegistros])

  const handleChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ): void => {
    event.preventDefault()
    setpaginaActual(value)
    setInputPage(value)
  }

  return (
    <>
      <div className="flex gap-3 w-full justify-center">
        <Pagination
          count={numPaginas}
          page={paginaActual}
          onChange={handleChange}
          className="text-gray-300 flex justify-center paginacion2"
          color="standard"
        />
      </div>
    </>
  )
}
