import { useParams } from 'react-router-dom'
import useAuth from '../../../../../hooks/useAuth'

interface valuesSelectFilter {
  area: any
  setArea: any
  handleChangeArea: any
}
const SelectFilter = ({ handleChangeArea }: valuesSelectFilter): JSX.Element => {
  const { auth } = useAuth()
  const { id } = useParams()
  return (
    <div>

        <select name="" id=""
            onChange={handleChangeArea}
            className=" border border-[#fff] text-[#1653D1] font-medium placeholder-gray-400 outline-none focus:outline-none
        focus:border-[#1653D1] w-full px-4 py-2 pl-2  mr-0 mb-0 ml-0 text-base block bg-white
        rounded-xl transition-all"
        >
            <option className="text-[#252525]" value={'Todos'}>Selec. Servicio</option>

            {(auth.id == '3' || auth.id == '9') || (id == '3' || id == '9')
              ? <>
                <option className="text-[#252525]" value="landing">Landing Page</option>
                <option className="text-[#252525]" value="sistema">Sistemas web</option>
                <option className="text-[#252525]" value="tienda">Tienda Virtual</option>
                <option className="text-[#252525]" value="informativa">Web Informativa</option>
                <option className="text-[#252525]" value="administrable">Web Administrable</option>
                <option className="text-[#252525]" value="capacitacion">Capacitaciones</option>
            </>
              : <>
                <option className="text-[#252525]" value="dgrafico">Diseño Gráfico</option>
                <option className="text-[#252525]" value="community">Community Manager</option>
                <option className="text-[#252525]" value="capacitacion">Capacitaciones</option>
          </>}

        </select>

  </div>
  )
}

export default SelectFilter
