
import { Route, Routes } from 'react-router-dom'
import './App.css'
import NavBar from './component/navBar'
import Inicio from './pages/inicio'
import Footer from './component/Footer'

function App() {

  return (
    <>
        <NavBar  />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Inicio />} />

          </Routes>
        </main>
        <Footer />

    </>
  )
}

export default App
