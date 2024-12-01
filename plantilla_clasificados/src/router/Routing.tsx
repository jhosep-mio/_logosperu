import { Routes, Route, BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../context/AuthProvider'
import Home from '../components/public/Home'
import { PublicLayout } from '../components/public/PublicLayout'
// import { Blog } from '../components/public/Blog'

export const Routing = (): JSX.Element => {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<PublicLayout />}>
            <Route path='/:id' element={<Home />} />
            {/* <Route path='producto/:id' element={<VistaProducto />} /> */}
            {/* <Route path='blog/:id' element={<Blog />} /> */}
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}
