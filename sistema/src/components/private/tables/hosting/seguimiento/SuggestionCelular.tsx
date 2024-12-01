/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable @typescript-eslint/no-confusing-void-expression */
import { useState } from 'react'
import Autosuggest from 'react-autosuggest'

const SuggestionCelular = ({ value, onChange, clientes, setValues, setclienteSeleccionado }: any): JSX.Element => {
  const [suggestions, setSuggestions] = useState([])

  const getSuggestions = (inputValue: any): any => {
    const inputValueLowerCase = inputValue.trim().toLowerCase()
    if (inputValueLowerCase.length < 2) {
      return [] // No hay suficientes caracteres para sugerencias
    }
    const filteredSuggestions = clientes.filter((cliente: any) =>
      (cliente.celular).includes(inputValueLowerCase)
    )
    return filteredSuggestions
  }

  const onSuggestionsFetchRequested = ({ value }: any): void => {
    setSuggestions(getSuggestions(value))
  }

  const onSuggestionsClearRequested = (): void => {
    setSuggestions([])
  }

  const onSuggestionSelected = (_: any, { suggestionValue }: any): void => {
    setValues((prevValues: any) => ({
      ...prevValues,
      nombres: suggestionValue.nombres ? suggestionValue.nombres : '',
      apellidos: suggestionValue.apellidos ? suggestionValue.apellidos : '',
      email: suggestionValue.email ? suggestionValue.email : '',
      celular: suggestionValue.celular ? suggestionValue.celular : '',
      marca: suggestionValue.empresa ? suggestionValue.empresa : ''
    }))
    setclienteSeleccionado(suggestionValue.id)
  }

  const inputProps = {
    placeholder: 'Ingrese un celular',
    value,
    className: 'flex h-9 w-full rounded-md border border-input border-gray-400 bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed',
    name: 'celular',
    onChange: (_: any, { newValue }: any) => onChange(newValue)
  }

  return (
    <Autosuggest
      suggestions={suggestions}
      onSuggestionsFetchRequested={onSuggestionsFetchRequested}
      onSuggestionsClearRequested={onSuggestionsClearRequested}
      onSuggestionSelected={onSuggestionSelected}
      getSuggestionValue={(suggestion: any) => suggestion} // Use a unique identifier from the suggestion object
      renderSuggestion={(suggestion: any) => (
        <div className="suggestion-item mt-1 text-gray-600">
          <span className="suggestion-name">{`${suggestion.nombres} ${suggestion.apellidos}`}</span>
        </div>
      )}
      inputProps={inputProps}
    />
  )
}

export default SuggestionCelular
