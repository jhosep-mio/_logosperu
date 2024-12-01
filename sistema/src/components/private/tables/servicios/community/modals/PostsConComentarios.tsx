import { Dialog } from '@mui/material'

export const PostsConComentarios = ({ open, setOpen }: any): JSX.Element => {
  return (
    <Dialog
      open={open}
      onClose={() => {
        setOpen(false)
      }}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      className=""
      maxWidth={'lg'}
    >

    </Dialog>
  )
}
