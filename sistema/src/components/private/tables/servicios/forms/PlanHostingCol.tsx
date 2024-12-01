/* eslint-disable react/jsx-key */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable multiline-ternary */
/* eslint-disable @typescript-eslint/no-misused-promises */
/* eslint-disable @typescript-eslint/ban-ts-comment */
import { MdOutlineStorage } from 'react-icons/md'
import { useState } from 'react'
import { cn } from '../../../../shared/cn'
import { Loading } from '../../../../shared/Loading'
import { SwiperAvances } from '../../hosting/seguimiento/SwiperAvances'
import { Link } from 'react-router-dom'
import { SoporteHosting } from './modals/SoporteHosting'
import { ModalViewSoporteHosting } from './modals/ModalViewSoporteHosting'

export const PlanHostingCol = ({
  setOpenAntecedemte,
  arrayObsequios,
  antecedentes,
  hosting,
  setAvance,
  setOpenAvance,
  proyecto,
  datos2,
  colaboradores
}: {
  setOpenAntecedemte: any
  antecedentes: any
  proyecto: any
  arrayObsequios: any
  handleSubmit: any
  colaborador: never[]
  colaboradores: never[]
  values: any
  datos2: any
  hosting: any | null
  setOpenCorreoFinal: any
  setOpenMailFinal: any
  datos: any
  setOpenQuestion: any
  setOpenMail: any
  arrayAlta: any
  arrayAvances: any
  setAvance: any
  setOpenAvance: any
  setOpenFinal: any
  arrayFinal: any
  setfinal: any
  setOpenActa: any
  arrayActa: any
  setopenAlta: any
  handleBlur: any
  handleChange: any
  errors: any
  touched: any
  getDatos: any
  setHosting: any
  hostingactivo: any
  setHostingActivo: any
  idVenta: any
}): JSX.Element => {
  const [openVista, setOpenVista] = useState({ estado: false, datos: null })
  const [loading] = useState(false)

  return (
    <div
      className={cn(
        'fixed inset-0 lg:w-[86%] lg:ml-[14%] h-full bg-white flex gap-10 '
      )}
    >
      <div
        className={cn(
          'h-full transition-all duration-300 overflow-y-auto p-4 lg:p-8 w-full lg:w-[100%]'
        )}
      >
        <section className="w-full flex flex-col lg:flex-row justify-between lg:items-center group">
          <div className="w-fit flex gap-2 lg:gap-4 items-center">
            <div className="w-full flex flex-col">
              <h2 className="font-bold text-2xl text-black">Hosting Web</h2>
              <span className="text-gray-500 lg:mt-3">Detalles</span>
            </div>
          </div>
        </section>
        {hosting && !loading ? (
          <>
            <section
              className={cn(
                'grid w-full mt-6 grid-cols-1 lg:grid-cols-2 gap-4 2xl:gap-6'
              )}
            >
              <section className="w-full grid grid-cols-1 lg:grid-cols-3 gap-2 lg:gap-6 ">
                <div className="w-full shadow_hosting bg-[#3c70a6] rounded-2xl p-6 flex flex-col space-y-5">
                  <div className="flex gap-3 items-center text-white w-full">
                    <MdOutlineStorage className="text-4xl bg-white rounded-full p-2 text-[#3c70a6]" />
                    <div className="font-medium text-xl">Espacio</div>
                  </div>
                  <div className="flex h-full gap-3 items-center">
                    <div className="flex flex-col w-full">
                      <div className="flex gap-3 items-center justify-center text-white w-full">
                        <div className="text-lg text-center">
                          {hosting?.tiposervicio == 'Hosting' ||
                          hosting?.tiposervicio == 'Hosting + Dominio'
                            ? hosting?.plan
                            : 'No registrado'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full shadow_hosting bg-[#3c70a6] rounded-2xl p-6 flex flex-col space-y-5">
                  <div className="flex gap-3 items-center text-white w-full">
                    <MdOutlineStorage className="text-4xl bg-white rounded-full p-2 text-[#3c70a6]" />
                    <div className="font-medium text-xl">Hosting</div>
                  </div>
                  <div className="flex gap-3  h-full items-center">
                    <div className="flex flex-col w-full">
                      <div className="flex gap-3 items-center justify-center text-white w-full">
                        <div className="text-lg">
                          {hosting?.tiposervicio == 'Hosting' ||
                          hosting?.tiposervicio == 'Hosting + Dominio'
                            ? hosting?.phosting
                            : 'No registrado'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="w-full shadow_hosting bg-[#3c70a6] rounded-2xl p-6 flex flex-col space-y-5">
                  <div className="flex gap-3 items-center text-white w-full">
                    <MdOutlineStorage className="text-4xl bg-white rounded-full p-2 text-[#3c70a6]" />
                    <div className="font-medium text-xl">Dominio</div>
                  </div>
                  <div className="flex h-full   gap-3 items-center">
                    <div className="flex flex-col w-full">
                      <div className="flex gap-3 items-center justify-center text-white w-full">
                        <div className="text-lg">
                          {hosting?.tiposervicio == 'Dominio' ||
                          hosting?.tiposervicio == 'Hosting + Dominio'
                            ? hosting?.pdominio
                            : 'No registrado'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section className="w-full grid grid-cols1 lg:grid-cols-2 gap-6">
                <div className="w-full shadow_hosting bg-[#3c70a6] rounded-2xl p-6 flex flex-col space-y-5">
                  <div className="flex justify-between text-white w-full">
                    <div className="font-bold text-xl uppercase">Hosting</div>
                  </div>
                  <div className="flex gap-3 h-full justify-center flex-col">
                    <span className="text-white font-bold">
                      Estado:{' '}
                      <span className="text-green-400 text-lg font-medium">
                        Vigente
                      </span>
                    </span>
                    <span className="text-white font-bold">
                      F. Inicio:{' '}
                      <span className="text-yellow-500 font-medium">
                        {hosting?.inicio}
                      </span>
                    </span>
                  </div>
                </div>
                <div className="w-full shadow_hosting bg-[#3c70a6]  rounded-2xl p-6 flex flex-col space-y-5">
                  <div className="flex justify-between text-white w-full">
                    <div className="font-bold uppercase text-xl">
                      DATOS DE CLIENTE
                    </div>
                  </div>
                  <div className="flex gap-3 flex-col">
                    <span className="text-yellow-500 font-bold ">
                      Nombres:{' '}
                      <span className="text-white">
                        {hosting?.nombres} {hosting?.apellidos}
                      </span>
                    </span>
                    <span className="text-yellow-500 font-bold ">
                      Celular:{' '}
                      <span className="text-white">{hosting?.celular}</span>
                    </span>
                    <span className="text-yellow-500 font-bold">
                      Email:{' '}
                      <span className="lowercase text-white">
                        {hosting?.email}
                      </span>
                    </span>
                  </div>
                </div>
              </section>
            </section>
          </>
        ) : (
          hosting &&
          loading && (
            <div className="w-full h-full min-h-[400px] relative">
              <Loading />
            </div>
          )
        )}
        {datos2.soporte && datos2.soporte.length > 0 && (
            <SoporteHosting datos2={datos2} setOpenVista={setOpenVista}/>
        )}
        <div className="bg-white  rounded-xl mt-6">
          <div className="w-full flex flex-col justify-start md:items-start gap-y-2 relative">
            <div className="w-full flex justify-between">
              <div className="flex flex-col gap-2 mb-3 ">
                <h2 className="text-xl lg:text-2xl font-bold text-black">
                  Seguimiento del proyecto
                </h2>
                <h3 className="font-bold text-base">
                  <span className="text-gray-400 text-sm lg:text-base">
                    Correos recibidos
                  </span>{' '}
                </h3>
              </div>
              {proyecto && (
                <Link
                  to={`/admin/lista-servicios/avances/${proyecto.id ?? ''}`}
                  className="bg-main rounded-xl px-4 py-2 h-fit my-auto text-white font-medium hover:bg-main_dark transition-colors"
                >
                  Ir al seguimiento
                </Link>
              )}
            </div>
            <section className="w-full quitar_padding_bottom">
              <SwiperAvances
                antecedentes={antecedentes}
                setOpenAntecedemte={setOpenAntecedemte}
                arrayObsequios={arrayObsequios}
                setAvance={setAvance}
                setOpen={setOpenAvance}
                arrayAvances={[]}
              />
            </section>
          </div>
        </div>
      </div>

      <ModalViewSoporteHosting open={openVista} setOpen={setOpenVista} colaboradores={colaboradores}/>
    </div>
  )
}
