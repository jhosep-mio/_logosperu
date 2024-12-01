import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { type editorValues } from '../../../shared/schemas/Interfaces'

const EditorContexto = ({ content, setContent }: editorValues): JSX.Element => {
  return (
    <>
    <ReactQuill theme="snow" value={content} onChange={setContent} className='content_editor2 bg-white text-black'/>

    </>
  )
}

export default EditorContexto
