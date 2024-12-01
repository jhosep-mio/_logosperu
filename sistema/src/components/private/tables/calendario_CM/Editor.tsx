import { useRef } from 'react'
import JoditEditor from 'jodit-react'
import { type editorValues } from '../../../shared/schemas/Interfaces'

const Editor = ({ content, setContent }: editorValues): JSX.Element => {
  const editor = useRef(null)
  const config = {
    buttons: ['eraser'] // Mostrar solo el botón de limpiar texto
  }

  return (
        <JoditEditor
            className='w-full mt-4'
            ref={editor}
            value={content}
            config={config}
            // tabIndex={1}
            onBlur={newContent => { setContent(newContent) }}
           // @ts-expect-error: Explanation for disabling TypeScript for this line
            onChange={(newContent) => {}}
        />
  )
}

export default Editor
