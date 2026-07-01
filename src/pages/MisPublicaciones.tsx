import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import PostCard from "../component/PostCard";
import { useAuth } from "../context/AuthContext";
import { getFeedPosts } from "../services/api";
import type { FeedPost } from "../types";

function MisPublicaciones() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [posts, setPosts] = useState<FeedPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    async function loadMyPosts() {
      try {
        setIsLoading(true);
        setError("");

        const feedPosts = await getFeedPosts();
        if (ignore) return;

        setPosts(
          feedPosts.filter((post) => (post.UserId ?? post.userId) === user?.id)
        );
      } catch (err) {
        if (ignore) return;
        setError(
          err instanceof Error
            ? "Error en la base de datos: " + err.message
            : "No se pudieron cargar tus publicaciones."
        );
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    if (isAuthenticated) {
      loadMyPosts();
    } else {
      setIsLoading(false);
      setPosts([]);
    }

    return () => {
      ignore = true;
    };
  }, [isAuthenticated, user, location.key, location.state]);

  return (
    <section className="container py-5">
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4 d-flex flex-column flex-md-row justify-content-between gap-3 align-items-start">
          <div>
            <h1 className="h3 text-facebook fw-bold">Mis publicaciones</h1>
            <p className="text-muted mb-0">
              Aquí podrás ver las publicaciones que hayas creado.
            </p>
          </div>

          <Link to="/crear-publicacion" className="btn btn-facebook align-self-start">
            Crear publicación
          </Link>
        </div>
      </div>

      {!isAuthenticated ? (
        <div className="alert alert-info" role="alert">
          Tenés que iniciar sesión para ver tus publicaciones.
        </div>
      ) : isLoading ? (
        <div className="card border-0 shadow-sm">
          <div className="card-body text-center py-5">
            <div className="spinner-border text-primary" role="status" aria-hidden="true" />
            <p className="mt-3 mb-0">Cargando tus publicaciones...</p>
          </div>
        </div>
      ) : error ? (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      ) : posts.length === 0 ? (
        <div className="alert alert-info" role="alert">
          No tenés publicaciones aún.
        </div>
      ) : (
        posts.map((post) => <PostCard key={post.id} post={post} />)
      )}
    </section>
  );
}

export default MisPublicaciones;
