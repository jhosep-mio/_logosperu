interface Errores {
    errors: string | undefined
    touched: boolean | undefined
  }

export const Errors = (props: Errores) => {
  return (
        <p className="text-sm text-red-500 p-0 m-0 mt-1 pl-2">{props.errors !== null && props.errors !== undefined && props.errors !== '' &&
         props.touched !== null && props.touched !== undefined && props.touched && <span className="text-red-500">{props.errors}</span>}</p>
  )
}
