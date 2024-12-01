import { facebook, instagram, youtube } from '../../../../shared/Images'

export const Plataformas = (): JSX.Element => {
  return (
    <div className="bg-white rounded-xl px-4 py-2 lg:p-4 h-full w-full">
      <div>
        <h2 className="text-black text-lg lg:text-xl mb-2 lg:mb-4 font-bold px-3 lg:px-0">Plataformas</h2>
        <div className="flex flex-col gap-1 lg:gap-3 items-center justify-center">
          <a href='https://www.instagram.com/dlogosperu/' target='_blank' className="w-full h-full flex justify-between hover:bg-gray-100 p-2 rounded-lg transition-colors" rel="noreferrer">
            <section className="flex gap-2">
              <img
                src={instagram}
                className="w-10 lg:w-12 h-10 lg:h-12 bg-[#F4F2FC] rounded-full px-0 lg:p-2 object-contain"
              />
              <div className="flex flex-col justify-center lg:justify-between">
                <h2 className="font-bold text-black text-sm lg:text-base">@dlogosperu</h2>
                <span className="text-xs lg:text-sm">Instagram</span>
              </div>
            </section>
            <div className="flex flex-col justify-center">
              <p className="text-base lg:text-lg font-bold">+ 400</p>
              <span className="text-xs lg:text-sm">Seguidores</span>
            </div>
          </a>
          <a href='https://www.facebook.com/DLogosPeru/' target='_blank' className="w-full h-full flex justify-between hover:bg-gray-100 p-2 rounded-lg transition-colors" rel="noreferrer">
            <section className="flex gap-2">
              <img
                src={facebook}
                className="w-10 lg:w-12 h-10 lg:h-12 bg-[#F4F2FC] rounded-full px-1 lg:p-2 object-contain"
              />
                 <div className="flex flex-col justify-center lg:justify-between">
                <h2 className="font-bold text-black text-sm lg:text-base">@DLogosPeru</h2>
                <span className="text-xs lg:text-sm">Facebook</span>
              </div>
            </section>
            <div className="flex flex-col">
              <p className="text-base lg:text-lg font-bold">+ 8000</p>
              <span className="text-xs lg:text-sm">Seguidores</span>
            </div>
          </a>
          <a href='https://www.youtube.com/channel/UCPXxUSJAk5VaWGEaRmgFeew' target='_blank' className="w-full h-full flex justify-between hover:bg-gray-100 p-2 rounded-lg transition-colors" rel="noreferrer">
            <section className="flex gap-2">
              <img
                src={youtube}
                className="w-10 lg:w-12 h-10 lg:h-12 bg-[#F4F2FC] rounded-full px-0 lg:p-2 object-contain"
              />
                 <div className="flex flex-col justify-center lg:justify-between">
                <h2 className="font-bold text-black text-sm lg:text-base">@logosperu476</h2>
                <span className="text-xs lg:text-sm">Youtube</span>
              </div>
            </section>
            <div className="flex flex-col">
              <p className="text-base lg:text-lg font-bold">+ 40</p>
              <span className="text-xs lg:text-sm">Videos</span>
            </div>
          </a>
        </div>
      </div>
    </div>
  )
}
