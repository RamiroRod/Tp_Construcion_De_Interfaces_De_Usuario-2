import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PostCard from "../component/PostCard";
import { useAuth } from "../context/AuthContext";
import { getFeedPosts } from "../services/api";
import type { FeedPost } from "../types";

type PaletteName = "facebook" | "twitter" | "universidad";

interface PaletteConfig {
  label: string;
  primary: string;
  secondary: string;
  primaryHover: string;
  soft: string;
  page: string;
}

const PALETTES: Record<PaletteName, PaletteConfig> = {
  facebook: {
    label: "Facebook",
    primary: "#3b5998",
    secondary: "#8b9dc3",
    primaryHover: "#2f477a",
    soft: "#dfe3ee",
    page: "#f7f7f7",
  },
  twitter: {
    label: "Twitter",
    primary: "#1DA1F2",
    secondary: "#14171A",
    primaryHover: "#0d8ddb",
    soft: "#e8f5fe",
    page: "#f5f8fa",
  },
  universidad: {
    label: "Universidad",
    primary: "#5fa92c",
    secondary: "#3aa4cc",
    primaryHover: "#4d8a24",
    soft: "#e7f4df",
    page: "#f7fbf4",
  },
};

const PALETTE_STORAGE_KEY = "antiSocialNetPalette";

function getInitialPalette(): PaletteName {
  const storedPalette = localStorage.getItem(PALETTE_STORAGE_KEY);

  if (
    storedPalette === "facebook" ||
    storedPalette === "twitter" ||
    storedPalette === "universidad"
  ) {
    return storedPalette;
  }

  return "facebook";
}

function applyPalette(palette: PaletteConfig) {
  const root = document.documentElement;

  root.style.setProperty("--facebook-primary", palette.primary);
  root.style.setProperty("--facebook-secondary", palette.secondary);
  root.style.setProperty("--facebook-primary-hover", palette.primaryHover);
  root.style.setProperty("--facebook-soft", palette.soft);
  root.style.setProperty("--facebook-page", palette.page);
}

function Inicio() {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedPalette, setSelectedPalette] = useState<PaletteName>(getInitialPalette);

  useEffect(() => {
    const palette = PALETTES[selectedPalette];
    applyPalette(palette);
    localStorage.setItem(PALETTE_STORAGE_KEY, selectedPalette);
  }, [selectedPalette]);

  useEffect(() => {
    let ignore = false;

    async function loadPosts() {
      try {
        setIsLoading(true);
        setError("");

        const data = await getFeedPosts();

        if (!ignore) {
          setPosts(data);
        }
      } catch (err) {
        const message =
          err instanceof Error
            ? "Error en la base de datos: " + err.message
            : "No se pudieron cargar las publicaciones.";

        if (!ignore) {
          setError(message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    loadPosts();

    return () => {
      ignore = true;
    };
  }, [location.key]);

  const totalVisibleComments = posts.reduce(
    (total, post) => total + (post.visibleComments?.length ?? 0),
    0
  );

  const currentPalette = PALETTES[selectedPalette];

  return (
    <div className="inicio">
      <section className="hero-section py-5">
        <div className="container">
          <div className="row align-items-center g-4">
            <div className="col-12 col-lg-7">
              <span className="badge bg-white text-facebook border mb-3">
                Conectate con la comunidad
              </span>

              <h1 className="display-5 fw-bold text-facebook">
                Unahur Anti-Social Net
              </h1>

              <p className="lead mb-4">
                Un espacio para navegar publicaciones, compartir ideas y conocer
                lo que otras personas están publicando.
              </p>

              {isAuthenticated ? (
                <div className="d-flex flex-wrap gap-2 align-items-center">
                  <span className="text-muted">
                    Sesión iniciada como <strong>{user?.nickName}</strong>
                  </span>
                </div>
              ) : (
                <div className="d-flex flex-wrap gap-2">
                  <Link to="/login" className="btn btn-facebook">
                    Iniciar sesión
                  </Link>

                  <Link to="/register" className="btn btn-outline-facebook">
                    Registrarse
                  </Link>
                </div>
              )}
            </div>

            <div className="col-12 col-lg-5">
              <div className="card border-0 shadow-sm">
                <div className="card-body p-4">
                  <h2 className="h5 text-facebook fw-bold">Sobre nosotros</h2>
                  <p className="text-muted mb-0">
                    Unahur Anti-Social Net es una red social en la cual los usuarios pueden compartir
                    sus pensamientos y experiencias.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="container py-5">
        <div className="row g-4">
          <div className="col-12 col-lg-8">
            <div className="mb-4">
              <h2 className="h4 fw-bold text-facebook mb-1">
                Publicaciones recientes
              </h2>
              <p className="text-muted mb-0">
                Explorá lo último que compartió la comunidad.
              </p>
            </div>

            {isLoading && (
              <div className="card border-0 shadow-sm">
                <div className="card-body text-center py-5">
                  <div
                    className="spinner-border text-primary"
                    role="status"
                    aria-hidden="true"
                  />
                  <p className="mt-3 mb-0">Cargando publicaciones...</p>
                </div>
              </div>
            )}

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

            {!isLoading && !error && posts.length === 0 && (
              <div className="alert alert-info" role="alert">
                Todavía no hay publicaciones disponibles.
              </div>
            )}

            {!isLoading &&
              !error &&
              posts.map((post) => <PostCard key={post.id} post={post} />)}
          </div>

          <aside className="col-12 col-lg-4">
            <div className="card border-0 shadow-sm mb-4">
              <div className="card-body">
                <h2 className="h5 text-facebook fw-bold">Datos curiosos</h2>

                <div className="mb-3 text-start">
                  <label className="form-label" htmlFor="paletteSelector">
                    Paleta de colores
                  </label>
                  <select
                    id="paletteSelector"
                    className="form-select"
                    value={selectedPalette}
                    onChange={(event) =>
                      setSelectedPalette(event.target.value as PaletteName)
                    }
                  >
                    {Object.entries(PALETTES).map(([key, palette]) => (
                      <option key={key} value={key}>
                        {palette.label}
                      </option>
                    ))}
                  </select>
                </div>

                <ul className="list-group list-group-flush">
                  <li className="list-group-item px-0 d-flex justify-content-between">
                    <span>Publicaciones</span>
                    <strong>{posts.length}</strong>
                  </li>

                  <li className="list-group-item px-0 d-flex justify-content-between">
                    <span>Comentarios visibles</span>
                    <strong>{totalVisibleComments}</strong>
                  </li>

                  <li className="list-group-item px-0 d-flex justify-content-between">
                    <span>Paleta</span>
                    <strong className="palette-preview">
                      <span className="palette-swatch palette-swatch-primary" />
                      <span className="palette-swatch palette-swatch-secondary" />
                      {currentPalette.label}
                    </strong>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </div>
  );
}

export default Inicio;
