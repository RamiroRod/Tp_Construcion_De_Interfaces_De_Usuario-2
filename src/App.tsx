
import { Route, Routes } from 'react-router-dom'
import './App.css'
import NavBar from './component/navBar'
import Inicio from './pages/inicio'
import Footer from './component/Footer'
import Login from './pages/Login'
import Register from './pages/Register'
import PostPendiente from './pages/PostPendiente'

function App() {
  return (
    <>
      <NavBar />

      <main className="main-content">
        <Routes>
          <Route path="/" element={<Inicio />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* ruta para el post pendiente */}
          <Route path="/post/:id" element={<PostPendiente />} />
        </Routes>
      </main>

      <Footer />
    </>
  );
}

export default App;