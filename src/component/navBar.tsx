import { useState } from "react";
import { Link } from "react-router-dom";

function NavBar() {
    const [menuOpen, setMenuOpen] = useState(false);
  return (
     <nav className="navbar navbar-expand-lg sticky-top google-navbar">
      <div className="container-fluid px-4">
        <Link className="navbar-brand d-flex align-items-center gap-2 text-decoration-none" to="/">
          <span className="google-logo-dot">F</span>
            <span className="g-blue">Faccebok</span> 
        </Link>

          <button className={`navbar-toggler border-0`} onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">
          {menuOpen ? "✕" : "☰"}
        </button>

        <div className={`collapse navbar-collapse `} id="navbarSupportedContent">
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1 mb-2 mb-lg-0">
            
          </ul>

          <div className="d-flex align-items-center gap-2 ms-lg-3 mt-2 mt-lg-0 flex-wrap">
            <button className="theme-toggle" title="Cambiar tema">
            
            </button>
            <Link to="/tienda" className="btn-google">Ver Publicaciones</Link>
          </div>
        </div>
      </div>
      <div className="google-color-bar"><span /><span /><span /><span /></div>
    </nav>
  );
}

export default NavBar;