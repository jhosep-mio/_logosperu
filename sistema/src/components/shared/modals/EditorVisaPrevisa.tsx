import { useState, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { type editorValues } from '../schemas/Interfaces'

const EditorVisaPrevisa = ({ content }: editorValues): JSX.Element => {
  const [editorContent, setEditorContent] = useState(content)

  useEffect(() => {
    setEditorContent(content)
  }, [content])

  return (
    <ReactQuill theme="" value={editorContent}
    readOnly={true} // Deshabilita la edición
    modules={{
      toolbar: false // Elimina la barra de herramientas
    }}
    />
  )
}

export default EditorVisaPrevisa
