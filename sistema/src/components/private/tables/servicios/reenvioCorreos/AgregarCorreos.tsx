import { type Dispatch, type SetStateAction, useState } from 'react'
import Swal from 'sweetalert2'
import { IoAddCircle } from 'react-icons/io5'
import { type arrayCorreos } from '../../../../shared/schemas/Interfaces'

interface values {
  correos: arrayCorreos[]
  setCorreos: Dispatch<SetStateAction<arrayCorreos[]>>
}

export const AgregarCorreos = ({
  correos,
  setCorreos
}: values): JSX.Element => {
  const [correo, setCorreo] = useState('')

  const esCorreoValido = (correo: string): boolean => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return regex.test(correo)
  }

  const agregarArrayPesos = (): void => {
    if (correo && esCorreoValido(correo)) {
      setCorreos([...correos, { id: Date.now(), correo }])
      setCorreo('')
    } else {
      Swal.fire('Ingrese un correo válido', '', 'error')
    }
  }

  return (
    <div className="w-full flex md:items-center gap-y-2 border border-b-gray-400 p-2 ">
      <div className="flex-1 flex w-full flex-row items-center gap-4">
        <input placeholder="Agregar correo" className='text-black outline-none px-2 py-2 w-full' type='email' value={correo} onChange={(e) => { setCorreo(e.target.value) }}
         onKeyDown={(e) => { if (e.key == 'Enter') agregarArrayPesos() }}
        />
        <IoAddCircle onClick={() => { agregarArrayPesos() }} className='text-main text-2xl cursor-pointer'/>
      </div>
    </div>
  )
}
