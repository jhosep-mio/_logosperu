import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { type editorValues } from '../../../shared/schemas/Interfaces'

const ViewEditarTexto = ({ content }: editorValues): JSX.Element => {
  return (
    <ReactQuill theme="snow" value={content} className='content_editor text-black no-interaction ' />
  )
}

export default ViewEditarTexto
