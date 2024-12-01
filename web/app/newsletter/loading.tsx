export default function Loading () {
  return (
    <section className="flex pt-24 relative  max-w-[1700px] mx-auto">
      <div className="skeleton w-[130px] 2xl:w-[190px] h-full top-24 hidden lg:block" />
      <section className="w-full grid grid-cols-1 lg:grid-cols-8 flex-1 relative bg-white">
        <div className="w-full col-span-1 border-r-2 border-gris h-full p-8 2xl:p-10 hidden lg:block">
          <div className="skeleton text-3xl w-full border-b-2 border-b-gray-500 font-ysobel_regular" />
          <div className="mt-6 font-ysobel_regular flex flex-col gap-3 text-gray-600">
            <div className="skeleton w-full h-4" />
            <div className="skeleton w-full h-4" />
            <div className="skeleton w-full h-4" />
            <div className="skeleton w-full h-4" />
          </div>
        </div>
        <div className="px-0 py-4 lg:p-8 2xl:p-10 w-full col-span-5 lg:border-r-2 border-gris">
          <div className="w-full flex justify-between items-center px-4 lg:px-0">
            <div className="skeleton w-36 h-5" />
            <div className="skeleton w-20 h-7 rounded-full" />
          </div>
          <div className="mt-4 mb-4 px-4 lg:px-0">
            <div className="skeleton w-52 lg:w-72 h-8 lg:h-12 rounded-full" />
          </div>
          <div className="h-[300px] lg:h-[450px] w-full relative bg-[#E4E4E4]">
            <div className="skeleton h-[300px] lg:h-[450px] object-cover w-full absolute inset-0" />
          </div>
          <div className="flex items-center mt-4 px-4 lg:px-0">
            <div className="w-full flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className="skeleton rounded-full h-10 w-10" />
                <div className="skeleton rounded-full w-20 h-4" />
              </div>
            </div>
          </div>
          <div className="flex gap-4 text-gray-600 mt-4 text-xs px-4 lg:px-0">
            <div className="skeleton rounded-full w-52 h-4" />
          </div>
          <div className="px-4 lg:px-0">
            <div className="skeleton rounded-full w-full h-10 mt-4" />
            <div className="skeleton rounded-full w-full h-10 mt-1" />
          </div>
          <div className="mt-4 text-gray-600 px-4 lg:px-0 text-justify lg:text-start">
            <div className="skeleton w-full h-4" />
            <div className="skeleton w-full h-4" />
            <div className="skeleton w-full h-4" />
            <div className="skeleton w-full h-4" />
            <div className="skeleton w-full h-4" />
          </div>
          <div className="px-4 lg:px-0">
            <div className="skeleton mt-6 border-2 w-full py-5 px-4 rounded-full" />
          </div>
          <span className="block h-[1px] lg:h-[2px] bg-[#8c8c8c] my-6 lg:mt-10"></span>
        </div>
        <div className="col-span-2 p-8 2xl:p-10 hidden lg:block">
          <div className="w-full flex justify-between items-center h-6">
            <div className="skeleton w-1/3 h-full" />
            <div className="skeleton font-SpartanMedium text-gray-600 text-xs px-4 rounded-full w-20 h-full" />
          </div>
          <div className="flex w-full flex-col mt-10">
            <div className="skeleton w-full h-5" />
            <div className="skeleton w-full h-5" />
            <div className="skeleton w-full h-5" />
            <div className="skeleton text-xs w-32 mt-1" />
          </div>
          <span className="block h-[2px] bg-[#8c8c8c] my-6"></span>
          <div className="flex w-full flex-col mt-10">
            <div className="skeleton w-full h-5" />
            <div className="skeleton w-full h-5" />
            <div className="skeleton w-full h-5" />
            <div className="skeleton text-xs w-32 mt-1" />
          </div>
          <span className="block h-[2px] bg-[#8c8c8c] my-6"></span>
          <div className="flex w-full flex-col mt-10">
            <div className="skeleton w-full h-5" />
            <div className="skeleton w-full h-5" />
            <div className="skeleton w-full h-5" />
            <div className="skeleton text-xs w-32 mt-1" />
          </div>
          <span className="block h-[2px] bg-[#8c8c8c] my-6"></span>
          <div className="flex w-full flex-col mt-10">
            <div className="skeleton w-full h-5" />
            <div className="skeleton w-full h-5" />
            <div className="skeleton w-full h-5" />
            <div className="skeleton text-xs w-32 mt-1" />
          </div>
        </div>
      </section>
      <div className="skeleton w-[130px] 2xl:w-[190px] h-fit object-contain top-24 hidden lg:block" />
    </section>
  )
}
