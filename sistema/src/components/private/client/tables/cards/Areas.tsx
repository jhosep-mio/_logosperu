import { disenador, programador, vendedor } from '../../../../shared/Images'

export const Areas = (): JSX.Element => {
  return (
    <div className="bg-white rounded-xl px-4 pt-2 pb-7 lg:p-4 h-full w-full">
      <div>
        <h2 className="text-black text-lg lg:text-xl mb-2 lg:mb-4 font-bold px-3 lg:px-0">Áreas</h2>
        <div className="flex flex-col gap-1 lg:gap-3 items-center justify-center">
          <a href='https://api.whatsapp.com/send/?phone=%2B51987038024&text&type=phone_number&app_absent=0' target='_blank' className="w-full h-full flex justify-between hover:bg-gray-100 p-2 rounded-lg transition-colors" rel="noreferrer">
            <section className="flex gap-2">
              <img
                src={vendedor}
                className="w-10 lg:w-12 h-10 lg:h-12 bg-[#F4F2FC] rounded-full px-1 lg:p-2 object-contain"
              />
               <div className="flex flex-col justify-center lg:justify-between">
                <h2 className="font-bold text-black text-sm lg:text-base">Ventas</h2>
                <span className="text-xs lg:text-sm">+51 987 038 024</span>
              </div>
            </section>
          </a>
          <a href='https://api.whatsapp.com/send/?phone=%2B51982408652&text&type=phone_number&app_absent=0' target='_blank' className="w-full h-full flex justify-between hover:bg-gray-100 p-2 rounded-lg transition-colors" rel="noreferrer">
            <section className="flex gap-2">
              <img
                src={programador}
                className="w-10 lg:w-12 h-10 lg:h-12 bg-[#F4F2FC] rounded-full px-1 lg:p-2 object-contain"
              />
               <div className="flex flex-col justify-center lg:justify-between">
                <h2 className="font-bold text-black text-sm lg:text-base">Desarrollo Web</h2>
                <span className="text-xs lg:text-sm">+51 982 408 652</span>
              </div>
            </section>
            <div className="flex flex-col">
            <p className="text-sm lg:text-lg font-bold">09:00 - 18:00</p>
              <span className="text-xs lg:text-sm">Horario</span>
            </div>
          </a>
          <a href='https://api.whatsapp.com/send/?phone=%2B51982364064&text&type=phone_number&app_absent=0' target='_blank' className="w-full h-full flex justify-between hover:bg-gray-100 p-2 rounded-lg transition-colors" rel="noreferrer">
            <section className="flex gap-2">
              <img
                src={disenador}
                className="w-10 lg:w-12 h-10 lg:h-12 bg-[#F4F2FC] rounded-full px-1 lg:p-2 object-contain"
              />
               <div className="flex flex-col justify-center lg:justify-between">
                <h2 className="font-bold text-black text-sm lg:text-base">Dsieño Grafico</h2>
                <span className="text-xs lg:text-sm">+51 982 364 064</span>
              </div>
            </section>
            <div className="flex flex-col">
            <p className="text-sm lg:text-lg font-bold">09:00 - 18:00</p>
              <span className="text-xs lg:text-sm">Horario</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
