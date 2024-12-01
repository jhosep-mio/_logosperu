/* eslint-disable @typescript-eslint/ban-ts-comment */
import { useState, useEffect } from 'react'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { type editorValues } from '../schemas/Interfaces'

const EditorPdfAltas = ({ content, setContent }: editorValues): JSX.Element => {
  const [editorContent, setEditorContent] = useState(content)

  useEffect(() => {
    setEditorContent(content)
  }, [content])

  const handleContentChange = (value: string): void => {
    // Procesa el contenido antes de actualizar el estado
    const processedContent = processContent(value)
    setEditorContent(processedContent)
    setContent(processedContent) // Actualiza el estado de la aplicación con el contenido procesado
  }

  const processContent = (content: string): string => {
    // Reemplazar el emoji ✅
    let processedContent = content.replace(/✅/g, '&#10003;')
    processedContent = processedContent.replace(/💰/g, '&#10003')
    // Aquí puedes realizar cualquier otro procesamiento necesario en el contenido antes de enviarlo
    return processedContent
  }

  return (
    <ReactQuill
      theme="snow"
      value={editorContent}
      onChange={handleContentChange}
      // @ts-expect-error
      spellCheck={true}
      modules={{
        toolbar: {
          container: [
            ['bold', 'italic', 'underline', 'strike'],
            [{ list: 'ordered' }, { list: 'bullet' }], // Agrega las opciones de viñetas y numeración
            ['clean'],
            ['link'], // Agrega la opción de insertar enlaces
            [{ align: [] }],
            [{ background: [] }],
            [{ color: [] }],
            [{ size: ['small', false, 'large', 'huge'] }] // Opciones de tamaño de letra
          ]
        }
      }}
    />
  )
}

export default EditorPdfAltas
