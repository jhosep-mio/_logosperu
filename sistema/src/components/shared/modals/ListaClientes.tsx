import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useEffect, useState } from 'react'
import { type ValuesPreventaModificate } from '../schemas/Interfaces'
import { getData2 } from '../FetchingData'
import { Paginacion } from '../Paginacion'
import { RiFilter2Fill } from 'react-icons/ri'
import { LoadingSmall } from '../LoadingSmall'
import { quitarAcentos } from '../functions/QuitarAcerntos'

export const ListaClientes = ({
  handleClose,
  open,
  setValues,
  values
}: any): JSX.Element => {
  const [loading, setLoading] = useState(true)
  const [totalRegistros, setTotalRegistros] = useState(0)
  const [paginaActual, setpaginaActual] = useState<number>(1)
  const [search, setSearch] = useState('')
  const [cantidadRegistros] = useState(4)
  const [productos, setProductos] = useState<ValuesPreventaModificate[]>([])

  const indexOfLastPost = paginaActual * cantidadRegistros
  const indexOfFirstPost = indexOfLastPost - cantidadRegistros
  let totalPosts = productos.length

  const filterDate = (): ValuesPreventaModificate[] => {
    if (search.length === 0) {
      const producto = productos.slice(indexOfFirstPost, indexOfLastPost)
      return producto
    }

    const filter = productos.filter((pro) => {
      const fullName = `${pro.nombres} ${pro.apellidos}`.toLowerCase()
      const searchTerm = quitarAcentos(search.toLowerCase())
      return (
        quitarAcentos(fullName).includes(searchTerm) ||
        String(pro.celular).includes(search) ||
        String(pro.id_contrato.toLowerCase()).includes(search.toLowerCase())
      )
    })

    totalPosts = filter.length
    return filter.slice(indexOfFirstPost, indexOfLastPost)
  }

  useEffect(() => {
    setTotalRegistros(totalPosts)
  }, [search])

  const onSeachChange = ({
    target
  }: React.ChangeEvent<HTMLInputElement>): void => {
    setpaginaActual(1)
    setSearch(target.value)
  }

  useEffect(() => {
    Promise.all([
      getData2('indexToVentas', setProductos, setTotalRegistros)
    ]).then(() => {
      setLoading(false)
    })
  }, [])

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="text-center w-full">
          {'LISTADO DE CLIENTES'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            className="min-h-[400px]"
          >
            <>
              <div className="w-full flex flex-col md:flex-row md:items-center md:justify-between gap-y-4 mb-5 min-w-[500px]">
                <div className="flex gap-2 items-center justify-center h-fit w-full flex-col md:flex-row">
                  <button className="bg-gray-300 hover:bg-gray-300 w-full md:w-fit flex items-center text-black gap-2 py-2 px-4 rounded-lg hover:text-main transition-colors">
                    <RiFilter2Fill />
                    <input
                      placeholder="Buscar ..."
                      className="bg-transparent outline-none"
                      value={search}
                      onChange={onSeachChange}
                      type="search"
                    />
                  </button>
                </div>
              </div>
              {loading
                ? (
                <LoadingSmall />
                  )
                : (
                <div className="bg-[#fff] px-2 rounded-xl">
                  <div className="hidden md:grid grid-cols-1 md:grid-cols-3 gap-4 mb-10 p-4 rounded-md border-b-2 border-solid border-black-50">
                    <h5 className="md:text-center text-black">Contrato</h5>
                    <h5 className="md:text-center text-black">Cliente</h5>
                    <h5 className="md:text-center text-black">Celular</h5>
                  </div>
                  {filterDate().map((orden: ValuesPreventaModificate) => (
                    <div
                      className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center mb-4 bg-gray-50 p-4 rounded-xl shadow-sm cursor-pointer"
                      key={orden.id}
                      onClick={() => {
                        setValues({
                          ...values,
                          id_venta: orden.id,
                          nombres: `${orden.nombres} ${orden.apellidos}`
                        }); handleClose()
                      }}
                    >
                      <div className="md:text-center">
                        <h5 className="text-black  md:hidden font-bold mb-2">
                          Contrato
                        </h5>
                        <p className="line-clamp-2 text-black">{orden.id_contrato}</p>
                      </div>
                      <div className="md:text-center md:flex md:justify-center">
                        <h5 className="md:hidden text-black font-bold mb-2">
                          Cliente
                        </h5>
                        <p className="line-clamp-2 text-black">
                          {orden.nombres} {orden.apellidos}
                        </p>
                      </div>
                      <div className="md:text-center md:flex md:justify-center ">
                        <h5 className="md:hidden text-black font-bold mb-2">
                          Celular
                        </h5>
                        <p className="line-clamp-2 text-black">
                          {orden.celular}
                        </p>
                      </div>
                    </div>
                  ))}

                  <div className="flex flex-col md:flex-row gap-5 md:gap-0 justify-center md:justify-between content_buttons pt-3">
                    <p className="text-md ml-1 text-black">
                      {totalRegistros} Registros
                    </p>
                    <Paginacion
                      totalPosts={totalPosts}
                      cantidadRegistros={cantidadRegistros}
                      paginaActual={paginaActual}
                      setpaginaActual={setpaginaActual}
                    />
                  </div>
                </div>
                  )}
            </>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>CERRAR</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}
