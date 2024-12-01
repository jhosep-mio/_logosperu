import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useEffect, useState } from 'react'
import { LoadingSmall } from '../LoadingSmall'
import axios from 'axios'
import { Global } from '../../../helper/Global'
import { TitleBriefs } from '../TitleBriefs'

export const ViewCliente = ({
  handleClose,
  open,
  id,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  id_contrato
}: any): JSX.Element => {
  const [loading, setLoading] = useState(true)
  const [productos, setProductos] = useState({ id_contrato: '', nombres: '', apellidos: '', celular: '', email: '', edad: '', sexo: '' })
  const token = localStorage.getItem('token')

  useEffect(() => {
    Promise.all([getOneBrief()]).then(() => {
      setLoading(false)
    })
  }, [])

  const getOneBrief = async (): Promise<void> => {
    // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
    const request = await axios.get(`${Global.url}/getOnePreventa/${id}`, {
      headers: {
        Authorization: `Bearer ${
            token !== null && token !== '' ? `Bearer ${token}` : ''
          }`
      }
    })
    setProductos(request.data)
  }

  return (
    <div>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="text-center w-full bg-main text-white">
          {'INFORMACION DEL CLIENTE'}
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            className="min-h-[250px]"
          >
            <>
              {loading
                ? (
                <LoadingSmall />
                  )
                : (
                <div className="flex w-full mt-5 md:mt-5 flex-col">
                  <div className="w-full flex flex-col text-white">
                    <div className="mb-3 md:mb-0 w-full bg-form rounded-md rounded-tl-none md:p-3 text-black flex flex-col items-end gap-3 lg:gap-5">
                    <div className="w-full flex flex-col gap-3 md:flex-row">
                        <div className="w-full md:w-full lg:relative">
                          <TitleBriefs titulo="Codigo de contrato" />
                          <input
                            className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all text-center"
                            type="text"
                            disabled
                            value={id_contrato}
                          />
                        </div>
                      </div>
                      <div className="w-full flex flex-col gap-3 md:flex-row">
                        <div className="w-full md:w-full lg:relative">
                          <TitleBriefs titulo=" Nombres" />
                          <input
                            className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                            type="text"
                            disabled
                            value={productos.nombres}
                          />
                        </div>
                        <div className="w-full md:w-full lg:relative">
                          <TitleBriefs titulo="Apellidos" />
                          <input
                            className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                            type="text"
                            disabled
                            value={productos.apellidos}
                          />
                        </div>
                      </div>
                      <div className="w-full flex flex-col gap-3 md:flex-row">
                        <div className="w-full md:w-full lg:relative">
                          <TitleBriefs titulo="Celular" />
                          <input
                            className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                            type="text"
                            disabled
                            value={productos.celular}
                          />
                        </div>
                        <div className="w-full md:w-full lg:relative">
                          <TitleBriefs titulo="Email" />
                          <input
                            className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                            type="text"
                            disabled
                            value={productos.email}
                          />
                        </div>
                      </div>
                      <div className="w-full flex flex-col gap-3 md:flex-row">
                        <div className="w-full md:w-full lg:relative">
                          <TitleBriefs titulo="Sexo" />
                          <input
                            className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                            type="text"
                            disabled
                            value={productos.sexo}
                          />
                        </div>
                        <div className="w-full md:w-full lg:relative">
                          <TitleBriefs titulo="Edad" />
                          <input
                            className="border placeholder-gray-400 focus:outline-none
                                                      focus:border-black w-full pt-4 pr-4 pb-4 pl-4 mt-2 mr-0 mb-0 ml-0 text-base block bg-white
                                                      border-gray-300 rounded-md transition-all"
                            type="text"
                            disabled
                            value={productos.edad}
                          />
                        </div>
                      </div>
                    </div>
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
