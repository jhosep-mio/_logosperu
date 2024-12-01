import { useState } from 'react'
import { MdOutlineKeyboardDoubleArrowRight } from 'react-icons/md'
import { disenologo, disenotarjeta, reel, web } from '../../../../shared/Images'

export const Cards = (): JSX.Element => {
  const [activeCard, setActiveCard] = useState(0)

  const handleNextCard = (): void => {
    setActiveCard((prevCard) => (prevCard + 1) % 4) // 4 representa el número total de tarjetas
  }

  const cardStyles = [
    'z-10 h-full w-96',
    'translate-x-[10%] z-[9] h-[250px]',
    'translate-x-[20%] z-[8] h-[240px]',
    'translate-x-[30%] z-0 h-[230px]'
  ]

  const cardBackgroundColors = ['#EFF3F4', '#BBC3C9', '#8D9AA1', '#5A6971']

  return (
    <div className="relative w-full h-[260px] overflow-hidden">
      {[...Array(4).keys()].map((_, index) => {
        const styleIndex = (index + activeCard) % 4
        return (
          <div
            key={index}
            className={`${cardStyles[styleIndex]} absolute inset-0 my-auto`}
          >
            <div
              style={{ background: cardBackgroundColors[styleIndex] }}
              className="rounded-lg shadow-md relative w-[260px] h-full p-2"
            >
              {index === 0
                ? (
                <>
                 <img src={web} alt="" className='object-contain w-full h-full'/>
                </>
                  )
                : index === 1
                  ? <img src={disenotarjeta} alt="" className='object-contain w-full h-full'/>
                  : index === 2
                    ? <img src={reel} alt="" className='object-contain w-full h-full'/>
                    : index === 3
                      ? <img src={disenologo} alt="" className='object-contain w-full h-full'/>
                      : null}
            </div>
          </div>
        )
      })}
      <button
        onClick={handleNextCard}
        className="absolute top-0 bottom-0 my-auto right-4  z-10 text-xl bg-white w-9 h-9 rounded-full flex items-center justify-center"
      >
        <MdOutlineKeyboardDoubleArrowRight />
      </button>
    </div>
  )
}
