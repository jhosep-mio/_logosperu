import { LiaUser } from 'react-icons/lia'
import { FaFacebookF } from 'react-icons/fa6'
import { SiGoogleads } from 'react-icons/si'
import { MdOutlinePayment } from 'react-icons/md'
import { IoIosTimer } from 'react-icons/io'
import { CiCalendarDate } from 'react-icons/ci'
interface valuesCapacitacion {
  subtitulo: string
  titulo: string
  icono: string
  color: string
}

export const CardCapacitacion = ({ subtitulo, titulo, icono, color }: valuesCapacitacion): JSX.Element => {
  return (
    <div className={'bg-white rounded-xl flex flex-col justify-center  px-4 py-4 shadow-md border-b-[3px] rounded-b-none'} style={{ borderColor: ` ${color}` }}>
        <div className="flex items-center gap-2">
            <span className="block p-1 rounded-full border " style={{ borderColor: ` ${color}` }}>
                {(icono.toLocaleLowerCase()).includes('google') && (<SiGoogleads className={'text-2xl '} style={{ color: `${color}` }}/>)}
                {icono === 'facebook' && (<FaFacebookF className={'text-2xl '} style={{ color: `${color}` }}/>)}
                {icono === 'pagos' && (<MdOutlinePayment className={'text-2xl '} style={{ color: `${color}` }}/>)}
                {icono === 'duracion' && (<IoIosTimer className={'text-2xl '} style={{ color: `${color}` }}/>)}
                {icono === 'user' && (<LiaUser className={'text-2xl '} style={{ color: `${color}` }}/>)}
                {icono === 'fecha' && (<CiCalendarDate className={'text-2xl '} style={{ color: `${color}` }}/>)}
            </span>
            <h5 className='text-[#303030] text-lg'>{subtitulo}</h5>
        </div>
        <div className="flex items-center justify-center py-5">
            <h5 className='text-xl text-[#202020] font-medium'>{titulo}</h5>
        </div>
    </div>
  )
}
