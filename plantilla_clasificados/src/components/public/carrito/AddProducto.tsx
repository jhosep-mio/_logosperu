import React from 'react'
import useAuth from '../../../hooks/useAuth'
import { type productosValues } from '../../shared/interface'

interface ComponentProps {
  producto: productosValues
  contador: number
  precioFinal: number
  setContador: React.Dispatch<React.SetStateAction<number>>
}

export const AddProducto: React.FC<ComponentProps> = ({
  producto,
  contador,
  setContador,
  precioFinal
}): JSX.Element => {
  const { cart, setCart, setShowError } = useAuth()
  function addProduct (product: productosValues, cantidad: number): void {
    const itemIndex = cart.findIndex(
      (item: any) => item.id === product.id && item.nombre === product.nombre
    )
    if (itemIndex === -1) {
      // No existe un elemento coincidente en el carrito, agregar uno nuevo
      setCart([
        ...cart,
        {
          id: product.id,
          nombre: product.nombre,
          cantidad,
          precio: precioFinal,
          imagen1: product.imagen1,
          categoria: product.categoria
        }
      ])
      localStorage.setItem(
        'cart',
        JSON.stringify([
          ...cart,
          {
            id: product.id,
            nombre: product.nombre,
            cantidad,
            precio: precioFinal,
            imagen1: product.imagen1,
            categoria: product.categoria
          }
        ])
      )
      setShowError({
        estado: 'success',
        texto: `${product.nombre} agregado`
      })
    } else {
      // Ya existe un elemento en el carrito con el mismo id y nombre, actualizar la cantidad
      const updatedItems = [...cart]
      if (cantidad != null) {
        updatedItems[itemIndex].cantidad =
          (updatedItems[itemIndex].cantidad ?? 0) + cantidad
      }
      setCart(updatedItems)
      setShowError({
        estado: 'success',
        texto: `Se agrego mas unidades a ${product.nombre}`
      })
      setContador(1)
      localStorage.setItem('cart', JSON.stringify(updatedItems))
    }
  }
  return (
    <>
      <button
        className="w-full gap-2 bg-paleta-500 hover:bg-paleta-500/80 transition-colors px-6 py-3 rounded-md text-white flex items-center justify-center"
        onClick={(e) => {
          e.preventDefault()
          addProduct(producto, contador)
        }}
      >
        Agregar al carrito
      </button>
    </>
  )
}
