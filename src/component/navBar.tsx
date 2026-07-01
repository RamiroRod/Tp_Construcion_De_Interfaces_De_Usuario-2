import { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function NavBar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    setMenuOpen(false);
  };

  return (
    <nav className="navbar navbar-expand-lg sticky-top google-navbar">
      <div className="container-fluid px-4">
        <Link
          className="navbar-brand d-flex align-items-center gap-2 text-decoration-none"
          to="/"
          onClick={() => setMenuOpen(false)}
        >
          <span className="google-logo-dot">A</span>
          <span className="g-blue">Anti-Social Net</span>
        </Link>

        <button
          className="navbar-toggler border-0"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Abrir menú"
          type="button"
        >
          {menuOpen ? "✕" : "☰"}
        </button>

        <div
          className={`collapse navbar-collapse ${menuOpen ? "show" : ""}`}
          id="navbarSupportedContent"
        >
          <ul className="navbar-nav ms-auto align-items-lg-center gap-lg-1 mb-2 mb-lg-0">
            <li className="nav-item">
              <NavLink
                className="nav-link"
                to="/"
                onClick={() => setMenuOpen(false)}
              >
                Inicio
              </NavLink>
            </li>

            {isAuthenticated ? (
              <>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/mis-publicaciones"
                    onClick={() => setMenuOpen(false)}
                  >
                    Mis publicaciones
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/crear-publicacion"
                    onClick={() => setMenuOpen(false)}
                  >
                    Hacer publicación
                  </NavLink>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/login"
                    onClick={() => setMenuOpen(false)}
                  >
                    Iniciar sesión
                  </NavLink>
                </li>

                <li className="nav-item">
                  <NavLink
                    className="nav-link"
                    to="/register"
                    onClick={() => setMenuOpen(false)}
                  >
                    Registrarse
                  </NavLink>
                </li>
              </>
            )}
          </ul>

          <div className="d-flex align-items-center gap-2 ms-lg-3 mt-2 mt-lg-0 flex-wrap">
            {isAuthenticated ? (
              <>
                <span className="badge bg-light text-facebook">
                  {user?.nickName}
                </span>
                <button
                  className="btn btn-outline-light btn-sm"
                  type="button"
                  onClick={handleLogout}
                >
                  Cerrar sesión
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="btn-google"
                onClick={() => setMenuOpen(false)}
              >
                Empezar a chatear
              </Link>
            )}
          </div>
        </div>
      </div>

      <div className="google-color-bar">
        <span />
        <span />
        <span />
        <span />
      </div>
    </nav>
  );
}

export default NavBar;