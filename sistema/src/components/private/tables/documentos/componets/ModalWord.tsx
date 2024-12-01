import { Dialog, DialogContent } from '@mui/material'
import { type Dispatch, type SetStateAction } from 'react'
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer'

export const ModalWord = ({
  open,
  setOpen,
  documento
}: {
  open: boolean
  setOpen: Dispatch<SetStateAction<boolean>>
  documento: any | null
}): JSX.Element => {
  function obtenerExtension (nombreArchivo: string): string | undefined {
    if (nombreArchivo) {
      const partes = nombreArchivo.split('.')
      const extension = partes[partes.length - 1]
      return extension.toLowerCase()
    }
  }

  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false)
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className="modal_options_metricas"
    >
      <DialogContent className="w-full">
        {/* Renderizar el componente DocViewer si hay datos del documento */}
          <DocViewer
            documents={[
              {
                // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
                uri: `https://api.logosperu.com.pe/public/gestorArchivos/${documento ?? ''}`,
                fileType: obtenerExtension(documento),
                fileName: documento
              }
            ]}
            pluginRenderers={DocViewerRenderers}
            style={{ height: 1000 }}
          />
      </DialogContent>
    </Dialog>
  )
}
