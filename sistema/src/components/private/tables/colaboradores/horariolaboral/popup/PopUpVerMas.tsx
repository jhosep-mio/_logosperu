import { Dialog, DialogContent } from '@mui/material'
import { cn } from '../../../../../shared/cn'

export const PopUpVerMas = ({
  recurso,
  setRecurso,
  setOpen,
  setActiveDescription,
  setOpenDiasFestivos,
  setOpenPermiso
}: any): JSX.Element => {
  function onlyName (name: string): string {
    const primerEspacioIndex = name.indexOf(' ')
    if (primerEspacioIndex !== -1) {
      return name.substring(0, primerEspacioIndex)
    } else {
      return name
    }
  }
  return (
    <Dialog
      open={recurso.estado}
      onClose={() => setRecurso({ ...recurso, estado: !recurso.estado })}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogContent>
        <div className="w-full flex flex-col gap-3">
          {recurso.recurso &&
            (recurso?.recurso).map((props: any, index: number) => (
              <div
                key={index}
                className="cursor-pointer p-2 w-full overflow-hidden relative rounded-md h-full hover:text-black/40 transition-colors outline-none duration-300 break-words flex "
                rel="noreferrer"
                onClick={() => {
                  if (
                    props?.event.modalidad == 'Presencial' ||
                    props?.event.modalidad == 'Home office'
                  ) {
                    setOpen({ estado: true, evento: props })
                    setActiveDescription(true)
                    setOpenDiasFestivos(false)
                    setRecurso({ ...recurso, estado: !recurso.estado })
                  } else if (props.event?.modalidad == 'Permisos') {
                    setOpenPermiso({
                      estado: true,
                      titulo: props?.event.title,
                      description: props?.event.detalle
                    })
                  }
                }}
              >
                <span
                  className={cn(
                    'absolute top-0 w-full h-full inset-0 block  z-[1]',
                    props?.event?.modalidad == 'Presencial'
                      ? 'bg-yellow-500'
                      : props?.event?.modalidad == 'Home office'
                        ? 'bg-green-600'
                        : props?.event?.modalidad == 'Dia festivo'
                          ? 'bg-red-500'
                          : props?.event?.modalidad == 'Vacaciones'
                            ? 'bg-[#e8e888] text-black'
                            : props?.event?.modalidad == 'Permisos'
                              ? 'bg-[#be98ce]'
                              : props?.event?.modalidad == 'Recuperación'
                                ? 'bg-[#808080]'
                                : 'bg-[#54A9DC]'
                  )}
                ></span>
                <div
                  className={cn(
                    'div_cita px-1 z-[1] h-full w-full text-white transition-colors rounded-t-md bg-transparent'
                  )}
                >
                  <span className="block lowercase first-letter:uppercase text-[12px] md:text-sm">
                    <p
                      className={cn(
                        'hidden md:block text-center w-full',
                        props?.event?.modalidad == 'Vacaciones'
                          ? 'text-black'
                          : 'text-white'
                      )}
                    >
                      {props?.event?.title}
                    </p>
                    <p className="block md:hidden">{onlyName(props?.event?.title)}</p>
                  </span>
                </div>
              </div>
            ))}
        </div>
      </DialogContent>
    </Dialog>
  )
}
