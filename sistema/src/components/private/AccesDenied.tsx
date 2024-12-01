import patron from './../../assets/patron.webp'
export const AccesDenied = (): JSX.Element => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-200 relative">
       <img src={patron} alt="" className='absolute w-full h-full object-cover opacity-20'/>
      <div className="bg-white p-8 rounded-lg shadow-lg text-center relative z-0">
        <h1 className="text-3xl font-bold text-red-600 mb-4">
          Acceso Denegado
        </h1>
        <p className="text-gray-700 mb-6">
          No tienes permiso para acceder a esta página.
        </p>
        <a href="/" className="text-blue-500 hover:underline">
          Volver al inicio
        </a>
      </div>
    </div>
  )
}
