import { useEffect, useState, type FormEvent } from "react";
import { Link, useParams } from "react-router-dom";
import {
  getPostById,
  getPostImages,
  getVisibleComments,
  createComment,
} from "../services/api";
import { useAuth } from "../context/AuthContext";
import type { Post, PostImage, Comment } from "../types";

function PostPendiente() {
  const { id } = useParams();
  const postId = Number(id);
  const { user } = useAuth();

  const [post, setPost] = useState<Post | null>(null);
  const [images, setImages] = useState<PostImage[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);

  const [nuevoComentario, setNuevoComentario] = useState("");
  const [enviando, setEnviando] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function cargarTodo() {
      try {
        const [datosPost, datosImagenes, datosComentarios] =
          await Promise.all([
            getPostById(postId),
            getPostImages(postId),
            getVisibleComments(postId),
          ]);
        setPost(datosPost);
        setImages(datosImagenes);
        setComments(datosComentarios);
      } catch (err) {
        console.error(err);
      }
    }
    cargarTodo();
  }, [postId]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!nuevoComentario.trim()) {
      setError("El comentario no puede estar vacío");
      return;
    }

    if (!user) {
      setError("Tenés que iniciar sesión para comentar");
      return;
    }

    setEnviando(true);
    setError("");
    try {
      const comentarioCreado = await createComment({
        PostId: postId,
        UserId: user.id,
        content: nuevoComentario,
      });
      setComments((prev) => [...prev, comentarioCreado]);
      setNuevoComentario("");
    } catch (err) {
      setError("No se pudo enviar el comentario. Intentá de nuevo.");
      console.error(err);
    } finally {
      setEnviando(false);
    }
  }

  if (!post) {
    return (
      <section className="container py-5">
        <p className="text-muted">Cargando publicación...</p>
      </section>
    );
  }

  return (
    <section className="container py-5">
      <div className="card border-0 shadow-sm mb-4">
        <div className="card-body p-4">
          <h1 className="h3 text-facebook fw-bold">Detalle de publicación</h1>

          <p className="text-muted">{post.description}</p>

          {post.Tags && post.Tags.length > 0 && (
            <div className="mb-3">
              {post.Tags.map((tag) => (
                <span key={tag.id} className="badge bg-secondary me-1">
                  {tag.name}
                </span>
              ))}
            </div>
          )}

          {images.length > 0 && (
            <div className="row g-2 mb-3">
              {images.map((img) => (
                <div className="col-6 col-md-4" key={img.id}>
                  <img
                    src={img.url}
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
          <h2 className="h5 fw-bold mb-3">Comentarios</h2>

          {comments.length === 0 && (
            <p className="text-muted">Todavía no hay comentarios.</p>
          )}

          <ul className="list-unstyled">
            {comments.map((comment) => (
              <li key={comment.id} className="border-bottom py-2">
                <strong>{comment.User?.nickName ?? "Usuario"}</strong>:{" "}
                {comment.content}
              </li>
            ))}
          </ul>

          <form onSubmit={handleSubmit} className="mt-3">
            <div className="mb-2">
              <textarea
                className="form-control"
                placeholder="Escribí un comentario..."
                value={nuevoComentario}
                onChange={(e) => setNuevoComentario(e.target.value)}
                rows={3}
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