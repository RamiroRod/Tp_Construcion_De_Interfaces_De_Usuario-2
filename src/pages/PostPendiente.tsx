import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import {
  createComment,
  getPostById,
  getPostImages,
  getVisibleComments,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { Comment, Post, PostImage } from "../types";

function PostPendiente() {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);
  const { user } = useAuth();
  const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

  const [post, setPost] = useState<Post | null>(null);
  const [images, setImages] = useState<PostImage[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  const getImageSrc = (url: string) => {
    const cleanUrl = url.trim().replace(/\\/g, "/");

    if (/^https?:\/\//i.test(cleanUrl)) {
      return cleanUrl;
    }

    if (cleanUrl.startsWith("/")) {
      return `${apiUrl}${cleanUrl}`;
    }

    return `${apiUrl}/${cleanUrl}`;
  };

  useEffect(() => {
    let ignore = false;

    async function cargarTodo() {
      if (!Number.isFinite(postId)) {
        setError("El id de la publicación no es válido.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setError("");

        const [datosPost, datosImagenes, datosComentarios] = await Promise.all([
          getPostById(postId),
          getPostImages(postId),
          getVisibleComments(postId),
        ]);

        if (!ignore) {
          setPost(datosPost);
          setImages(datosImagenes);
          setComments(datosComentarios);
        }
      } catch (err) {
        if (!ignore) {
          const message =
            err instanceof Error
              ? "Error en la base de datos: " + err.message
              : "No se pudo cargar la publicación.";
          setError(message);
        }
      } finally {
        if (!ignore) {
          setIsLoading(false);
        }
      }
    }

    cargarTodo();

    return () => {
      ignore = true;
    };
  }, [postId]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const content = nuevoComentario.trim();

    if (!content) {
      setError("El comentario no puede estar vacío.");
      return;
    }

    if (!user) {
      setError("Tenés que iniciar sesión para comentar.");
      return;
    }

    try {
      setEnviando(true);
      setError("");

      await createComment({
        postId,
        userId: user.id,
        content,
      });

      const comentariosActualizados = await getVisibleComments(postId);
      setComments(comentariosActualizados);
      setNuevoComentario("");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "No se pudo enviar el comentario. Intentá de nuevo.";
      setError(message);
    } finally {
      setEnviando(false);
    }
  }

  if (isLoading) {
    return (
      <section className="container py-5">
        <p className="text-muted">Cargando publicación...</p>
      </section>
    );
  }

  if (!post) {
    return (
      <section className="container py-5">
        <div className="alert alert-danger" role="alert">
          {error || "No se encontró la publicación."}
        </div>
        <Link to="/" className="btn btn-facebook">
          Volver al inicio
        </Link>
      </section>
    );
  }

  const tags = post.Tags ?? post.tags ?? [];

  return (
    <section className="container py-5">
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h1 className="h3 text-facebook fw-bold">Detalle de publicación</h1>

          <p className="text-muted mb-3">{post.description}</p>

          {tags.length > 0 && (
            <div className="mb-3 d-flex flex-wrap gap-2">
              {tags.map((tag) => (
                <span key={tag.id} className="badge bg-light text-secondary border">
                  #{tag.name}
                </span>
              ))}
            </div>
          )}

          {images.length > 0 && (
            <div className="row g-2 mb-3">
              {images.map((image) => (
                <div className="col-6 col-md-4" key={image.id}>
                  <img
                    src={getImageSrc(image.url)}
                    alt="Imagen de la publicación"
                    className="img-fluid rounded"
                  />
                </div>
              ))}
            </div>
          )}

          <Link to="/" className="btn btn-facebook">
            Volver al inicio
          </Link>
        </div>
      </div>

      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h2 className="h5 fw-bold mb-3">
            Comentarios visibles ({comments.length})
          </h2>

          {comments.length === 0 ? (
            <p className="text-muted">Todavía no hay comentarios.</p>
          ) : (
            <ul className="list-unstyled">
              {comments.map((comment) => (
                <li key={comment.id} className="border-bottom py-2">
                  <strong>
                    {comment.User?.nickName ?? comment.user?.nickName ?? "Usuario"}
                  </strong>
                  : {comment.content}
                </li>
              ))}
            </ul>
          )}

          <form onSubmit={handleSubmit} className="mt-3">
            <div className="mb-2">
              <label className="form-label" htmlFor="nuevoComentario">
                Nuevo comentario
              </label>
              <textarea
                id="nuevoComentario"
                className="form-control"
                placeholder="Escribí un comentario..."
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                rows={3}
                required
              />
            </div>

            {error && <p className="text-danger small">{error}</p>}

            <button
              type="submit"
              className="btn btn-facebook"
              disabled={enviando}
            >
              {enviando ? "Enviando..." : "Comentar"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}

export default PostPendiente;
