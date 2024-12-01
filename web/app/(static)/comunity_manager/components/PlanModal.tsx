'use client'

import { Dialog, DialogContent } from '@mui/material'
// import { ButtonPlan } from './ButtonPlan'

const plans: any = {
  'Plan Golden': {
    items: [
      'Investigación digital',
      'Análisis de Marketing Digital - DOCUMENTACIÓN - Linea Gráfica',
      {
        title: '9 Publicaciones por semana <strong>(Lunes a Sábado)</strong>',
        subitems: [
          'Dividido: <strong>05 DISEÑO DE FLYER O POST / 04 DESARROLLO DE REEL</strong> Máx. 10 segundos',
          '(EFECTOS Y MUSICALIZACIÓN - CON LOCUCIÓN EN OFF) - <strong>Entregable Cronograma</strong>'
        ]
      },
      'Diseño de Flyer o Post - Incluye (Retoque Fotográfico) - Entregable cronograma.',
      'RESPUESTAS O COMENTARIOS a Potenciales (clientes o seguidores) MSN META BUSSINESS',
      '01 Diseño de Perfil (Facebook - Instagram - Tiktok)',
      '01 Diseño de Portada para Facebook - WSP Bussines X MES',
      'Indexación de fan page al wsp Bussiness',
      'Desarrollo de respuestas automáticas - Fan Page',
      'Desarrollo de campañas interactivas - Web - Redes',
      {
        title: 'Capacitación de campaña pagada (Facebook - Instagram) ADS',
        subitems: [
          'Incluye documentación e interacción con la red social. Listo para pagar',
          '<strong>IMPORTANTE: </strong>Inversión de publicidad pagada esta cargo del cliente.'
        ]
      },
      'Asesoría en creación de redes (Facebook - Instagram - TIKTOK)',
      'Reporte de métricas - Quincenal'
    ]
  },
  'Plan Silver': {
    items: [
      'Investigación digital',
      'Análisis de Marketing Digital - DOCUMENTACIÓN - Linea Gráfica',
      {
        title: '6 Publicaciones por semana <strong>(Lunes a Sábado)</strong>',
        subitems: [
          'Dividido: <strong>03 DISEÑO DE FLYER O POST / 03 DESARROLLO DE REEL</strong> Máx. 10 segundos',
          '(EFECTOS Y MUSICALIZACIÓN - CON LOCUCIÓN EN OFF) - <strong>Entregable Cronograma</strong>'
        ]
      },
      'RESPUESTAS O COMENTARIOS a Potenciales (clientes o seguidores) MSN META BUSSINESS',
      '01 Diseño de Perfil (Facebook - Instagram - Tiktok)',
      '01 Diseño de Portada para Facebook - WSP Bussines X MES',
      'Indexación de fan page al wsp Bussiness',
      'Desarrollo de respuestas automáticas - Fan Page',
      'Asesoría en creación de redes (Facebook - Instagram - TIKTOK)',
      'Reporte de métricas - Quincenal'
    ]
  }
}

export const PlanModal = ({
  open,
  setOpen,
  plan
}: {
  open: any;
  setOpen: any;
  plan: string;
}) => {
  const selectedPlan = plans[plan]

  return (
    <Dialog
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      maxWidth="lg"
      className="swiper_planes_logo_modal"
    >
      <DialogContent className="w-full " onClick={(e) => e.stopPropagation()}>
        <div className="flex  flex-col justify-between border-2 border-main px-4 md:px-8 py-8 bg-white z-10 rounded-[1.5rem] transition-all duration-300 hover:scale-105 relative before:absolute before:w-full before:h-full before:top-0 before:left-0 before:bg-[url(/assets/images/servicios/planes/patron.webp)] before:opacity-15 before:bg-contain before:-z-10">
          <div className="flex flex-col">
            <h5 className="text-3xl text-center font-bold mb-6">
              PLAN <span className="text-main"> {plan.toUpperCase()}</span>
            </h5>
            {selectedPlan && (
              <ul className="text-[16px] flex flex-col gap-2 list-disc pl-6 list-disc-main">
                {selectedPlan.items.map((item: any, index: any) =>
                  typeof item === 'string'
                    ? (
                    <li
                      key={index}
                      dangerouslySetInnerHTML={{ __html: item }}
                    />
                      )
                    : (
                    <li key={index} className="font-semibold rounded-lg mb-2">
                      <span dangerouslySetInnerHTML={{ __html: item.title }} />
                      {item.subitems && (
                        <ul className="">
                          {item.subitems.map((subitem: any, subindex: any) => (
                            <li
                              key={subindex}
                              dangerouslySetInnerHTML={{ __html: subitem }}
                            />
                          ))}
                        </ul>
                      )}
                    </li>
                      )
                )}
              </ul>
            )}
          </div>
          {/* <ButtonPlan plan={plan} /> */}
        </div>
      </DialogContent>
    </Dialog>
  )
}
