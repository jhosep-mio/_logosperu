import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { type editorValues } from '../../../../../shared/schemas/Interfaces'

const EditorComunnity = ({ content, setContent }: editorValues): JSX.Element => {
  const handleContentChange = (value: string): void => {
    setContent(value) // Actualiza el estado de la aplicación con el contenido procesado
  }

  return (
    <ReactQuill theme="snow" value={content} onChange={handleContentChange}
    modules={{
      toolbar: {
        container: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ list: 'ordered' }, { list: 'bullet' }], // Agrega las opciones de viñetas y numeración
          ['clean'],
          [{ align: [] }],
          [{ background: [] }],
          [{ color: [] }]
        ]
      }
    }}
    />
  )
}

export default EditorComunnity
