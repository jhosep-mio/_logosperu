// import Dialog from '@mui/material/Dialog'
// import DialogContent from '@mui/material/DialogContent'
// import { Dispatch, SetStateAction } from 'react'
// import { IoCloseCircleOutline } from 'react-icons/io5'
// import { LuBadgeCheck, LuBadgeX, LuChevronRight } from 'react-icons/lu'

// interface valuesProps {
//   open: boolean;
//   setOpen: Dispatch<SetStateAction<boolean>>;
//   selected: number;
// }

// export const Modals = ({ open, setOpen, selected }: valuesProps) => {
//   const handleClose = () => {
//     setOpen(false)
//   }

//   const RedirigirWsp = (seleccion: number): void => {
//     const numero = '+51987038024' // Reemplaza con el número de teléfono en formato internacional sin el signo + o 00.
//     let mensaje = '' // Tu mensaje.
//     if (seleccion == 3) {
//       mensaje =
//         'Hola, estoy interesado(a) en obtener más información sobre el Plan de Logotipo Standart.'
//     } else if (seleccion == 4) {
//       mensaje =
//         'Hola, estoy interesado(a) en obtener más información sobre el Plan de Logotipo Creativo.'
//     } else if (seleccion == 5) {
//       mensaje =
//         'Hola, estoy interesado(a) en obtener más información sobre el Plan de Logotipo Profesional.'
//     }
//     // Codificar el mensaje para URL
//     const mensajeCodificado = encodeURIComponent(mensaje)
//     // Construir la URL completa
//     const urlWhatsApp = `https://wa.me/${numero}?text=${mensajeCodificado}`
//     // Abrir la nueva pestaña con la URL
//     window.open(urlWhatsApp, '_blank')
//   }

//   return (
//     <Dialog
//       open={open}
//       onClose={handleClose}
//       aria-labelledby="alert-dialog-title"
//       aria-describedby="alert-dialog-description"
//       className="modal_planes_logos"
//     >
//       <DialogContent>
//         {selected == 1
//           ? (
//           <div className="w-full border-2 bg-gray-100 border-gray-500/30 py-8 px-10 rounded-3xl lg:-mr-5 relative">
//             <div className="mb-8 text-center space-y-3">
//               <h4 className="text-secondary/90 text-4xl">PLAN STANDART</h4>
//               <h1 className="text-primary text-7xl font-extrabold transition-all">
//                 S/ 339.00
//               </h1>
//               <p className="text-gray-500 border-b w-fit mx-auto">Pago unico</p>
//             </div>
//             <ul className="space-y-3 mb-8">
//               <li className="flex items-center gap-4 font-medium">
//                 <LuBadgeCheck size={20} className="text-2xl text-secondary" />
//                 <span className="text-2xl w-full flex-1">
//                   Brief o Cuestionario de la empresa. (Se realizará un Análisis
//                   previo antes de la construcción del Logotipo)
//                 </span>
//               </li>
//               <li className="flex items-center gap-4 font-medium">
//                 <LuBadgeCheck size={20} className="text-2xl text-secondary" />
//                 <span className="text-2xl w-full flex-1">
//                   (03) Propuestas de logo - Hasta 3 cambios del logo escogido.
//                 </span>
//               </li>
//               <li className="flex items-center gap-4 font-medium">
//                 <LuBadgeCheck size={20} className="text-2xl text-secondary" />
//                 <span className="text-2xl w-full flex-1">
//                   Análisis del Brief o cuestionario técnico para la construcción
//                   del Logotipo.
//                 </span>
//               </li>
//               <li className="flex items-center gap-4">
//                 <LuBadgeCheck size={20} className="text-2xl text-secondary" />
//                 <span className="text-2xl w-full flex-1">
//                   Coordinación directa, con el cliente para el desarrollo del
//                   Brief o cuestionario.
//                 </span>
//               </li>
//               <li className="flex items-center gap-4">
//                 <LuBadgeCheck size={20} className="text-2xl text-secondary" />
//                 <span className="text-2xl w-full flex-1">
//                   Entrega de editables: <strong>AI + JPG + PNG + PDF</strong>.
//                 </span>
//               </li>
//               <li className="flex flex-col items-center gap-4 py-8">
//                 <span className="text-[1.6rem] w-full flex-1 font-bold">
//                   IDENTIDAD VISUAL
//                 </span>
//                 <ul className="w-full pl-10 space-y-3 ">
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       01 Diseño de Tarjeta de Presentación
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       01 Diseño de Hoja membretada
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       01 Diseño de Portada para Facebook
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       01 Diseño de Perfil para Facebook - Instagram - Whatsapp -
//                       TikTok
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       Asesoria en creación de redes sociales
//                     </span>
//                   </li>
//                 </ul>
//               </li>
//               <li className="flex items-center gap-4 ">
//                 <LuBadgeCheck size={20} className="text-2xl text-secondary" />
//                 <span className="text-2xl w-full flex-1">
//                   Entrega de editables: <strong>AI + JPG + PNG + PDF</strong>.
//                 </span>
//               </li>

//               <li className="flex items-center gap-4">
//                 <LuBadgeCheck size={20} className="text-2xl text-secondary" />
//                 <span className="text-2xl w-full flex-1">
//                   Amplia Experiencia de trabajos a Distancia. (Fuera de Lima)
//                 </span>
//               </li>
//               <li className="flex items-center gap-4">
//                 <LuBadgeCheck size={20} className="text-2xl text-secondary" />
//                 <span className="text-2xl w-full flex-1">
//                   Tiempo de entrega : 03 días Hábiles.
//                 </span>
//               </li>
//               <li className="flex items-center gap-4">
//                 <LuBadgeCheck size={20} className="text-2xl text-secondary" />
//                 <span className="text-2xl w-full flex-1">
//                   Forma de Trabajo : Bajo Contrato.
//                 </span>
//               </li>
//               <li className="flex items-center gap-4 ">
//                 <LuBadgeX size={20} className="text-2xl text-secondary" />
//                 <span className="text-2xl w-full flex-1">
//                   Nuestros costos NO incluyen IGV.
//                 </span>
//               </li>
//             </ul>
//             <button
//               type="button"
//               onClick={() => RedirigirWsp(3)}
//               className="w-full border-2 border-secondary py-4 rounded-full my-5 hover:bg-secondary hover:text-white transition-colors duration-300"
//             >
//               Comprar
//             </button>
//             <span
//               className="absolute top-6 right-6 text-5xl cursor-pointer text-primary"
//               onClick={handleClose}
//             >
//               <IoCloseCircleOutline />
//             </span>
//           </div>
//             )
//           : selected == 2
//             ? (
//           <div className="w-full border-2 bg-gray-100 border-gray-500/30 py-8 px-10 rounded-3xl lg:-mr-5 relative">
//             <div className="mb-8 text-center space-y-3">
//               <h4 className="text-secondary/90 text-4xl">PLAN CREATIVO</h4>
//               <h1 className="text-primary text-7xl font-extrabold transition-all">
//                 S/ 579.00
//               </h1>
//               <p className="text-gray-500 border-b w-fit mx-auto">Pago unico</p>
//             </div>
//             <ul className="space-y-5 mb-8">
//               <li className="flex items-center gap-4 font-medium">
//                 <LuBadgeCheck size={20} className="text-2xl text-secondary" />
//                 <span className="text-2xl w-full flex-1">
//                   Recibirás (04) propuesta Creativas de diseño de logo
//                   sustentadas.
//                 </span>
//               </li>
//               <li className="flex items-center gap-4 font-medium">
//                 <LuBadgeCheck size={20} className="text-2xl text-secondary" />
//                 <span className="text-2xl w-full flex-1">
//                   Envío de brief o cuestionario por Mail – WhatsApp.
//                 </span>
//               </li>
//               <li className="flex items-center gap-4 font-medium">
//                 <LuBadgeCheck size={20} className="text-2xl text-secondary" />
//                 <span className="text-2xl w-full flex-1">
//                   Análisis del Brief o cuestionario técnico para la construcción
//                   del Logotipo.
//                 </span>
//               </li>
//               <li className="flex items-center gap-4">
//                 <LuBadgeCheck size={20} className="text-2xl text-secondary" />
//                 <span className="text-2xl w-full flex-1">
//                   Coordinación directa, con el cliente para el desarrollo del
//                   Brief o cuestionario.
//                 </span>
//               </li>
//               <li className="flex flex-col items-center gap-4 py-4">
//                 <span className="text-[1.6rem] w-full flex-1 font-bold">
//                   Entregables
//                 </span>
//                 <ul className="w-full pl-10 space-y-3 ">
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       Adobe Ilustrator: Programa original de diseño y donde se
//                       elabora las propuestas del logo.
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       PDF: Lo podrá abrir en cualquier programa de Adobe o Corel
//                       Draw.
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       JPG: Imagen (con fondo blanco)
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       PNG: Transparencia (sin fondo)
//                     </span>
//                   </li>
//                 </ul>
//               </li>
//               <li className="flex flex-col items-center gap-4 py-4">
//                 <span className="text-[1.6rem] w-full flex-1 font-bold">
//                   Manual de uso - Diseño de logo
//                 </span>
//                 <ul className="w-full pl-10 space-y-3 ">
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       Definición de Colores corporativos.
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       Composición y Construcción del Logo.
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       Normas para el buen uso del Diseño Logo.
//                     </span>
//                   </li>
//                 </ul>
//               </li>
//               <li className="flex flex-col items-center gap-4 py-4">
//                 <span className="text-[1.6rem] w-full flex-1 font-bold">
//                   Diseño de brochure
//                 </span>
//                 <ul className="w-full pl-10 space-y-3 ">
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       01 Diseño de brochure de hasta 2 hojas (4 caras)
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       Hasta 02 Modificaciones
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 pt-3">
//                     <span className="text-2xl w-full flex-1 font-bold">
//                       Formato de entrega:
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       PDF: Formato de impresión o digital
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       JPG: Imagen. Medidas: según indique el cliente
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       Adobe Ilustrator.
//                     </span>
//                   </li>
//                 </ul>
//               </li>
//               <li className="flex flex-col items-center gap-4 py-4">
//                 <span className="text-[1.6rem] w-full flex-1 font-bold">
//                   Identidad Visual
//                 </span>
//                 <ul className="w-full pl-10 space-y-3 ">
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       01 Diseño de Hoja membretada
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       01 Diseño de Tarjeta de Presentación (1 Nombre)
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       01 Diseño de Firma para correo (1 Nombre)
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       01 Diseño de Flyer Digital PARA POST (cliente nos remite
//                       sus tema)
//                     </span>
//                   </li>
//                 </ul>
//               </li>
//               <li className="flex items-center gap-4">
//                 <LuBadgeCheck size={20} className="text-2xl text-secondary" />
//                 <span className="text-2xl w-full flex-1">
//                   Tiempo de entrega : 04 días Hábiles.
//                 </span>
//               </li>
//               <li className="flex items-center gap-4">
//                 <LuBadgeCheck size={20} className="text-2xl text-secondary" />
//                 <span className="text-2xl w-full flex-1">
//                   Forma de Trabajo : Bajo Contrato.
//                 </span>
//               </li>
//               <li className="flex items-center gap-4 ">
//                 <LuBadgeX size={20} className="text-2xl text-secondary" />
//                 <span className="text-2xl w-full flex-1">
//                   Nuestros costos NO incluyen IGV.
//                 </span>
//               </li>
//             </ul>
//             <button
//               type="button"
//               onClick={() => RedirigirWsp(4)}
//               className="w-full border-2 border-secondary py-4 rounded-full my-5 hover:bg-secondary hover:text-white transition-colors duration-300"
//             >
//               Comprar
//             </button>
//             <span
//               className="absolute top-6 right-6 text-5xl cursor-pointer text-primary"
//               onClick={handleClose}
//             >
//               <IoCloseCircleOutline />
//             </span>
//           </div>
//               )
//             : selected == 3
//               ? (
//           <div className="w-full border-2 bg-gray-100 border-gray-500/30 py-8 px-10 rounded-3xl lg:-mr-5 relative">
//             <div className="mb-8 text-center space-y-3">
//               <h4 className="font-semibold text-pink-500 text-3xl" />
//               <h1 className="text-5xl font-extrabold" />
//               <p className="text-gray-500">Pago unico</p>
//             </div>
//             <div className="mb-8 text-center space-y-3">
//               <h4 className="text-secondary/90 text-4xl">PLAN PROFESIONAL</h4>
//               <h1 className="text-primary text-7xl font-extrabold transition-all">
//                 S/ 1290.00
//               </h1>
//               <p className="text-gray-500 border-b w-fit mx-auto">Pago unico</p>
//             </div>
//             <ul className="space-y-5 mb-8">
//               <li className="flex items-center gap-4 font-medium">
//                 <LuBadgeCheck size={20} className="text-2xl text-secondary" />
//                 <span className="text-2xl w-full flex-1">
//                   Recibirás (05) propuesta Creativas de diseño de logo
//                   sustentadas.
//                 </span>
//               </li>
//               <li className="flex items-center gap-4 font-medium">
//                 <LuBadgeCheck size={20} className="text-2xl text-secondary" />
//                 <span className="text-2xl w-full flex-1">
//                   Hasta 03 Modificaciones
//                 </span>
//               </li>
//               <li className="flex items-center gap-4 font-medium">
//                 <LuBadgeCheck size={20} className="text-2xl text-secondary" />
//                 <span className="text-2xl w-full flex-1">
//                   Envío de brief o cuestionario por mail – WhatsApp.
//                 </span>
//               </li>
//               <li className="flex items-center gap-4">
//                 <LuBadgeCheck size={20} className="text-2xl text-secondary" />
//                 <span className="text-2xl w-full flex-1">
//                   Coordinación directa, con el cliente para el desarrollo del
//                   Brief o cuestionario.
//                 </span>
//               </li>
//               <li className="flex flex-col items-center gap-4 py-4">
//                 <span className="text-[1.6rem] w-full flex-1 font-bold">
//                   Entregables
//                 </span>
//                 <ul className="w-full pl-10 space-y-3 ">
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       Adobe Ilustrator: Programa original de diseño y donde se
//                       elabora las propuestas del logo.
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       PDF: Lo podrá abrir en cualquier programa de Adobe o Corel
//                       Draw.
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       JPG: Imagen (con fondo blanco)
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       PNG: Transparencia (sin fondo)
//                     </span>
//                   </li>
//                 </ul>
//               </li>
//               <li className="flex flex-col items-center gap-4 py-4">
//                 <span className="text-[1.6rem] w-full flex-1 font-bold">
//                   Manual de uso - Diseño de logo
//                 </span>
//                 <ul className="w-full pl-10 space-y-3 ">
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       Definición de Colores corporativos.
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       Composición y Construcción del Logo.
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       Normas para el buen uso del Diseño Logo.
//                     </span>
//                   </li>
//                 </ul>
//               </li>
//               <li className="flex flex-col items-center gap-4 py-4">
//                 <span className="text-[1.6rem] w-full flex-1 font-bold">
//                   Diseño de brochure: Digital - Impreso
//                 </span>
//                 <ul className="w-full pl-10 space-y-3 ">
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       01 Diseño de brochure de hasta 3 hojas (6 caras)
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       Hasta 02 Modificaciones
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 pt-3">
//                     <span className="text-2xl w-full flex-1 font-bold">
//                       Formato de entrega:
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       PDF: Formato de impresión o digital
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       JPG: Imagen. Medidas: según indique el cliente
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       Adobe Ilustrator.
//                     </span>
//                   </li>
//                 </ul>
//               </li>
//               <li className="flex flex-col items-center gap-4 py-4">
//                 <span className="text-[1.6rem] w-full flex-1 font-bold">
//                   Identidad Visual. (01 Propuesta cada una)
//                 </span>
//                 <ul className="w-full pl-10 space-y-3 ">
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       01 Diseño de Hoja membretada
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       01 Diseño de Folder
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       01 Diseño Sobre
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       01 Diseño de Tarjeta de Presentación (Max. 02 Nombres)
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       01 Diseño de Firma para correo (Max. 02 Nombres)
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       01 Diseño de Banner o Letrero Publicitario
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       01 Diseño de Fotocheck (Max. 05 Nombres)
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       01 Diseño de Uniforme (Polo - Camisa - Gorro - Chaleco)
//                     </span>
//                   </li>
//                 </ul>
//               </li>
//               <li className="flex flex-col items-center gap-4 py-4">
//                 <span className="text-[1.6rem] w-full flex-1 font-bold">
//                   Redes Sociales
//                 </span>
//                 <ul className="w-full pl-10 space-y-3 ">
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       01 Diseño de portada Facebook - WSP Bussines
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       01 Diseño de Perfil (Fan Page - WSP - Instagram - Tiktok)
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       02 Diseños de Flyers o Post - cliente nos remite los temas
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       Asesoria en creación de Redes (Opcional)
//                     </span>
//                   </li>
//                 </ul>
//               </li>
//               <li className="flex flex-col items-center gap-4 py-4">
//                 <span className="text-[1.6rem] w-full flex-1 font-bold">
//                   Impresion de tarjeta de Presentación
//                 </span>
//                 <ul className="w-full pl-10 space-y-3 ">
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       1 millar x 1 nombre.
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       Tamaño: 9 x 5.5 cm.
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       Material: Papel couché de 250gr. Mate o brillante (a
//                       elección del cliente).
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       Envío Lima: Gratis
//                     </span>
//                   </li>
//                   <li className="flex items-center gap-4 ">
//                     <LuChevronRight
//                       size={20}
//                       className="text-2xl text-secondary"
//                     />
//                     <span className="text-2xl w-full flex-1">
//                       Envío Provincia: Servicio de COLLECT
//                     </span>
//                   </li>
//                 </ul>
//               </li>
//               <li className="flex items-center gap-4">
//                 <LuBadgeCheck size={20} className="text-2xl text-secondary" />
//                 <span className="text-2xl w-full flex-1">
//                   Tiempo de entrega : 07 días Hábiles.
//                 </span>
//               </li>
//               <li className="flex items-center gap-4">
//                 <LuBadgeCheck size={20} className="text-2xl text-secondary" />
//                 <span className="text-2xl w-full flex-1">
//                   Forma de Trabajo : Bajo Contrato.
//                 </span>
//               </li>
//               <li className="flex items-center gap-4 ">
//                 <LuBadgeX size={20} className="text-2xl text-secondary" />
//                 <span className="text-2xl w-full flex-1">
//                   Nuestros costos NO incluyen IGV.
//                 </span>
//               </li>
//             </ul>
//             <button
//               type="button"
//               onClick={() => RedirigirWsp(5)}
//               className="w-full border-2 border-secondary py-4 rounded-full my-5 hover:bg-secondary hover:text-white transition-colors duration-300"
//             >
//               Comprar
//             </button>
//             <span
//               className="absolute top-6 right-6 text-5xl cursor-pointer text-primary"
//               onClick={handleClose}
//             >
//               <IoCloseCircleOutline />
//             </span>
//           </div>
//                 )
//               : null}
//       </DialogContent>
//     </Dialog>
//   )
// }
