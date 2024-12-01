interface valuesSelectFilter {
  selectColaborador: any
  setSelectColaborador: any
  usuarios: any
}
const SelectFilterAllColaborador = ({ selectColaborador, setSelectColaborador, usuarios }: valuesSelectFilter): JSX.Element => {
  return (
    <div>

        <select name="" id=""
            value={selectColaborador}
            onChange={(e) => setSelectColaborador(e.target.value)}
            className=" border border-[#fff] text-[#1653D1] font-medium placeholder-gray-400 outline-none focus:outline-none
        focus:border-[#1653D1] w-full px-4 py-2 pl-2  mr-0 mb-0 ml-0 text-base block bg-white
        rounded-xl transition-all"
        >
                <option className="text-[#252525]" value={'Todos'}>Selec. Colaborador</option>
                {usuarios.filter((user: any) => user.id_rol != '99').map((user: any) => (
                    <option key={user.id} className="text-[#252525]" value={user.id}>{user.name}</option>
                ))}
        </select>
  </div>
  )
}

export default SelectFilterAllColaborador
