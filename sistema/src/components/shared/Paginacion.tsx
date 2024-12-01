import { useState, useEffect } from 'react'
import Pagination from '@mui/material/Pagination'
import { type paginacionValues } from './schemas/Interfaces'

export const Paginacion = ({
  totalPosts,
  cantidadRegistros,
  paginaActual,
  setpaginaActual
}: paginacionValues): JSX.Element => {
  const [numPaginas, setNumPaginas] = useState(0)
  const [inputPage, setInputPage] = useState<number | string>(paginaActual)
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const inputValue = parseInt(e.target.value, 10)
    setInputPage(isNaN(inputValue) ? '' : inputValue)
  }

  const handleInputKeyDown = (
    e: any
  ): void => {
    if (e.key === 'Enter' && e.target.value > 0 && e.target.value <= numPaginas) {
      e.preventDefault()
      handleInputBlur()
    }
  }

  const handleInputBlur = (): void => {
    // Validar y actualizar la página actual
    const newPage = inputPage !== '' ? Math.min(numPaginas, Math.max(1, Number(inputPage))) : NaN
    if (!isNaN(newPage)) {
      setpaginaActual(newPage)
      setInputPage(newPage)
    } else {
      // Manejar el caso en que el valor ingresado no sea válido
      // Puedes mostrar un mensaje de error o realizar alguna acción específica
      console.error('El valor ingresado no es válido')
      setInputPage(paginaActual)
    }

    // Desenfocar el campo de entrada
    const inputElement = document.getElementById('pageNumberInput')
    if (inputElement) {
      inputElement.blur()
    }
  }

  return (
    <>
      <div className="flex flex-col md:flex-row gap-2 items-center justify-center mb-2">
        <input
          type="text"
          id="pageNumberInput"
          className="bg-gray-500 w-14 text-center rounded-lg px-1"
          value={inputPage}
          onChange={handleInputChange}
          onKeyDown={handleInputKeyDown}
        />
        <Pagination
          count={numPaginas}
          page={paginaActual}
          onChange={handleChange}
          className="text-gray-300 flex justify-center"
          color="standard"
        />
      </div>
    </>
  )
}
