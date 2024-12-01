import { BsPerson } from 'react-icons/bs'

import { type valuesResumen } from '../../../../shared/schemas/Interfaces'
import { chat } from '../../../../shared/Images'
import { fechaFormateada } from '../../../../shared/functions/GenerarTextoEnLetras'

export const ListadoComentariosColaboradores = ({
  resumenOrdenado
}: {
  resumenOrdenado: valuesResumen[]
}): JSX.Element => {
  return (
    <>
      {resumenOrdenado.length > 0
        ? (
            resumenOrdenado.map((resu: valuesResumen, index: number) => (
          <>
            <div className="flex flex-col gap-2" key={index}>
              <div className="w-full flex justify-center">
                <span className="bg-gray-300 px-4 rounded-xl text-black">
                  {resu.fecha}
                </span>
              </div>
              <div className="relative">
                <div
                  className="text-justify bg-white p-4 rounded-l-xl relative w-[93%] ml-3
                    before:bg-white before:absolute before:left-[99%] before:h-full before:w-[7%] before:top-0 before:bottom-0
                        clip_chat lowercase first-letter:uppercase text-base
                    "
                >
                  <span className="w-full flex justify-start uppercase items-center gap-3 mb-3 font-bold">
                    <BsPerson className="bg-[#F1F1F1] text-3xl rounded-full p-1" />{' '}
                    {resu.user}
                  </span>
                  <p>{resu.texto}</p>
                  <span className="w-full flex justify-end text-gray-400">
                    {resu.hora}
                  </span>
                </div>
              </div>

              {resu?.respuesta?.texto && (
                <>
                  <div
                    className=" text-justify bg-green-300 relative w-[89%] ml-8
                          before:bg-green-300 before:absolute before:right-[99%] before:h-full before:w-[7%] before:top-0 before:bottom-0
                              clip_chat2  text-base py-2"
                  >
                    <span className="w-full flex justify-start uppercase items-center gap-3 mb-3 font-bold">
                      <BsPerson className="bg-[#F1F1F1] text-3xl rounded-full p-1" />{' '}
                      Administración
                    </span>
                    <p className="w-full h-fit pl-4 pr-14 outline-none placeholder:text-black/60 py-4 resize-none overflow-hidden bg-green-300 text-black">
                      {resu.respuesta?.texto}
                    </p>
                    <span className="w-full block text-right px-2">
                      {fechaFormateada(resu.respuesta.hora)}
                    </span>
                  </div>
                </>
              )}
            </div>
          </>
            ))
          )
        : (
        <div className="w-full flex flex-col gap-4">
          <p className="text-gray-500 text-center text-xl">
            No tiene comentarios para este proyecto
          </p>
          <img src={chat} alt="" className="w-52 object-contain mx-auto" />
        </div>
          )}
    </>
  )
}
