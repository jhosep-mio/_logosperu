import { useRef } from 'react'
import JoditEditor from 'jodit-react'
import { type editorValues } from '../../../../shared/schemas/Interfaces'

const Editor = ({ content, setContent }: editorValues): JSX.Element => {
  const editor = useRef(null)

  return (
        <JoditEditor
            className='w-full jodect_editor_cotizacion'
            ref={editor}
            value={content}
            // tabIndex={1}
            onBlur={newContent => { setContent(newContent) }}
           // @ts-expect-error: Explanation for disabling TypeScript for this line
            onChange={(newContent) => {}}
            config={{
              // @ts-expect-error: Explanation for disabling TypeScript for this line
              removeButtons: 'font,fontsize,image,link,format,file',
              placeholder: 'Detalla la cotización...'
            }}
        />
  )
}

export default Editor
