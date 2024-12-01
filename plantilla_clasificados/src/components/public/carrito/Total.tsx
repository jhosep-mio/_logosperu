import useAuth from '../../../hooks/useAuth'

export const Total = (): JSX.Element => {
  const { cart } = useAuth()
  function calculateTotal (): string {
    let total = 0
    for (let i = 0; i < cart.length; i++) {
      const item = cart[i]
      if (item.precio !== null && item.cantidad) {
        const subtotal = item.precio * item.cantidad
        total += subtotal
      }
    }
    return total.toFixed(2) // Redondeamos a dos decimales
  }

  return <span className="">S/. {calculateTotal()}</span>
}
