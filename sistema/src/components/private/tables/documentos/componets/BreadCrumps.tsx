import { emphasize, styled } from '@mui/material/styles'
import Breadcrumbs from '@mui/material/Breadcrumbs'
import { type Dispatch, type SetStateAction } from 'react'
import Chip from '@mui/material/Chip'
import { FaHome } from 'react-icons/fa'
interface Folder {
  id: string
  name: string
}

export const BreadCrumps = ({ currentPath, setCurrentPath }: { currentPath: Folder[] | null, setCurrentPath: Dispatch<SetStateAction<Folder[] | null>> }): JSX.Element => {
  const StyledBreadcrumb = styled(Chip)(({ theme }) => {
    const backgroundColor =
          theme.palette.mode === 'light'
            ? theme.palette.grey[100]
            : theme.palette.grey[800]
    return {
      backgroundColor,
      height: theme.spacing(3),
      color: theme.palette.text.primary,
      fontWeight: theme.typography.fontWeightRegular,
      '&:hover, &:focus': {
        backgroundColor: emphasize(backgroundColor, 0.06)
      },
      '&:active': {
        boxShadow: theme.shadows[1],
        backgroundColor: emphasize(backgroundColor, 0.12)
      }
    }
  }) as typeof Chip // TypeScript only: need a type cast here because https://github.com/Microsoft/TypeScript/issues/26591
  const handleFolderClick = (folderId: string, folderName: string): void => {
    if (folderId === null && folderName === null) {
      setCurrentPath(null) // Si se hace clic en "Home", se establece currentPath a null
    } else if (!currentPath || currentPath.length === 0) {
      setCurrentPath([{ id: folderId, name: folderName }])
    } else {
      // Encuentra el índice de la carpeta seleccionada en currentPath
      const selectedIndex = currentPath.findIndex(folder => folder.id === folderId)
      if (selectedIndex !== -1) {
        // Si la carpeta ya está en currentPath, elimina todos los elementos después de la carpeta seleccionada
        const newPath = currentPath.slice(0, selectedIndex + 1)
        setCurrentPath(newPath)
      } else {
        // Si la carpeta no está en currentPath, agrégala al final
        setCurrentPath([...currentPath, { id: folderId, name: folderName }])
      }
    }
  }

  return (
    <Breadcrumbs aria-label="breadcrumb" className='mt-4'>
      <StyledBreadcrumb
        component="a"
        label="Home"
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-expect-error
        onClick={() => { handleFolderClick(null, null) }}
        icon={<FaHome fontSize="small" />}
      />
      {currentPath?.map((folder: any) => (
        <span key={folder.id}>
        <StyledBreadcrumb component="a" onClick={() => { handleFolderClick(folder.id, folder.name) }} label={folder.name} />
        </span>
      ))}

    </Breadcrumbs>
  )
}
