import React from 'react'
import useAuth from '../../../hooks/useAuth'
// import Swal from 'sweetalert2'
import { BsFillTrashFill } from 'react-icons/bs'
import { type carrito } from '../../shared/interface'

interface ComponentProps {
  producto: carrito
}

export const RemoveItemCart: React.FC<ComponentProps> = ({
  producto
}): JSX.Element => {
  const { cart, setCart, setShowError } = useAuth()

  function removeItemFromCart (producto: carrito): void {
    const updatedItems = cart.filter(
      (item) => item.id !== producto.id || item.nombre !== producto.nombre
    )
    setCart(updatedItems)
    setShowError({
      estado: 'success',
      texto: 'Producto eliminado'
    })
    localStorage.setItem('cart', JSON.stringify(updatedItems))
  }
  return (
    <button
      type="button"
      data-toggle="tooltip"
      title=""
      className="btn crt-dlete1"
      data-original-title="Eliminar"
      onClick={() => { removeItemFromCart(producto) }}
    >
      <BsFillTrashFill className='text-red-600'/>
    </button>
  )
}
