interface Errores {
  errors: string | undefined
  touched: boolean | undefined
}

export const Errors = (props: Errores): JSX.Element => {
  return (
    <p className="text-[16px] font-light p-0 m-0 mt-0 pl-2 text-red-500">
      {props.errors !== null &&
        props.errors !== undefined &&
        props.errors !== '' &&
        props.touched !== null &&
        props.touched !== undefined &&
        props.touched && <span className="text-main">{props.errors}</span>}
    </p>
  )
}
