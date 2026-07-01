import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import PostCard from "../component/PostCard";
import { useAuth } from "../context/AuthContext";
import { getFeedPosts } from "../services/api";
import type { FeedPost } from "../types";

function Inicio() {
  const { isAuthenticated, user } = useAuth();

  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

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
            ? err.message
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
  }, []);

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

                <ul className="list-group list-group-flush">
                  <li className="list-group-item px-0 d-flex justify-content-between">
                    <span>Publicaciones</span>
                    <strong>{posts.length}</strong>
                  </li>

                  <li className="list-group-item px-0 d-flex justify-content-between">
                    <span>Comentarios visibles</span>
                    <strong>
                      {posts.reduce(
                        (total, post) =>
                          total + (post.visibleComments?.length ?? 0),
                        0
                      )}
                    </strong>
                  </li>

                  <li className="list-group-item px-0 d-flex justify-content-between">
                    <span>Paleta</span>
                    <strong>Facebook</strong>
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