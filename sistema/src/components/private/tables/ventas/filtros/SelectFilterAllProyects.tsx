interface valuesSelectFilter {
  area: any
  setArea: any
  handleChangeArea: any
}
const SelectFilterAllProyects = ({ handleChangeArea }: valuesSelectFilter): JSX.Element => {
  return (
    <div>

        <select name="" id=""
            onChange={handleChangeArea}
            className=" border border-[#fff] text-[#1653D1] font-medium placeholder-gray-400 outline-none focus:outline-none
        focus:border-[#1653D1] w-full px-4 py-2 pl-2  mr-0 mb-0 ml-0 text-base block bg-white
        rounded-xl transition-all"
        >
            <option className="text-[#252525]" value={'Todos'}>Selec. servicio</option>
                <option className="text-[#252525]" value="landing">Landing Page</option>
                <option className="text-[#252525]" value="sistema">Sistemas web</option>
                <option className="text-[#252525]" value="tienda">Tienda Virtual</option>
                <option className="text-[#252525]" value="informativa">Web Informativa</option>
                <option className="text-[#252525]" value="administrable">Web Administrable</option>
                <option className="text-[#252525]" value="dgrafico">Diseño Gráfico</option>
                <option className="text-[#252525]" value="community">Community Manager</option>
                <option className="text-[#252525]" value="capacitacion">Capacitaciones</option>
        </select>
  </div>
  )
}

export default SelectFilterAllProyects
