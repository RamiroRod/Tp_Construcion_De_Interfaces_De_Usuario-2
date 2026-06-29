
import { Route, Routes } from 'react-router-dom'
import './App.css'
import NavBar from './component/navBar'
import Inicio from './pages/inicio'
import Footer from './component/Footer'
import Login from './pages/Login'
import Register from './pages/Register'
import PostPendiente from './pages/PostPendiente'
import MisPublicaciones from './pages/MisPublicaciones'
import CrearPublicacion from './pages/CrearPublicacion'

function App() {
  return (
    <>
      <NavBar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/mis-publicaciones" element={<MisPublicaciones />} />
          <Route path="/crear-publicacion" element={<CrearPublicacion />} />

          {/* ruta para el post pendiente */}
          <Route path="/post/:id" element={<PostPendiente />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;