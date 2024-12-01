
interface inputs {
  name: string
  type: string
  value: string | number | readonly string[] | undefined
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onBlur: (event: React.ChangeEvent<HTMLInputElement>) => void
  disabled: boolean
}

export const InputsBriefs = (props: inputs): JSX.Element => {
  return (
    <input
      className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pr-4 h-16 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all text-black"
      type={props.type}
      name={props.name}
      disabled={props.disabled}
      value={props.value}
      onChange={props.onChange}
      onBlur={props.onBlur}
    />
  )
}
