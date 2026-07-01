import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { getPostImageUrls } from "../services/api";
import type { FeedPost, PostImage } from "../types";

interface PostCardProps {
  post: FeedPost;
}

function PostCard({ post }: PostCardProps) {
  const [images, setImages] = useState<PostImage[]>(post.images ?? []);
  const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3001";

  useEffect(() => {
    let ignore = false;

    if (!post.images || post.images.length === 0) {
      getPostImageUrls(post.id)
        .then((result) => {
          if (!ignore) {
            setImages(result);
          }
        })
        .catch(() => {
          if (!ignore) {
            setImages([]);
          }
        });
    }

    return () => {
      ignore = true;
    };
  }, [post.id, post.images?.length ?? 0]);

  const firstImage = images[0];
  const visibleComments = post.visibleComments ?? [];

  const imageUrl = firstImage?.url
    ? (() => {
        const rawUrl = firstImage.url.trim().replace(/\\/g, "/");

        if (/^https?:\/\//i.test(rawUrl)) {
          return rawUrl;
        }

        if (rawUrl.startsWith("/")) {
          return `${apiUrl}${rawUrl}`;
        }

        return `${apiUrl}/${rawUrl}`;
      })()
    : null;

  return (
    <article className="card border-0 shadow-sm mb-4">
      {firstImage && imageUrl && (
        <img
          src={imageUrl}
          alt={`Imagen del post ${post.id}`}
          className="card-img-top post-image"
        />
      )}

      <div className="card-body">
        <div className="d-flex justify-content-between align-items-start gap-3 mb-2">
          <div>
            <h2 className="h5 text-facebook mb-1">
              {post.User?.nickName ?? "Usuario desconocido"}
            </h2>

            
          </div>

          <span className="badge bg-soft-blue text-facebook">
            {visibleComments.length} comentarios visibles
          </span>
        </div>

        <p className="card-text mt-3">{post.description}</p>

        {post.Tags && post.Tags.length > 0 && (
          <div className="d-flex flex-wrap gap-2 mb-3">
            {post.Tags.map((tag) => (
              <span className="badge bg-light text-secondary border" key={tag.id}>
                #{tag.name}
              </span>
            ))}
          </div>
        )}

        {visibleComments.length > 0 ? (
          <div className="mb-3">
            <h3 className="h6 mb-2">Comentarios</h3>
            <ul className="list-group list-group-flush">
              {visibleComments.slice(0, 3).map((comment) => (
                <li className="list-group-item px-0 py-2" key={comment.id}>
                  <strong>{comment.User?.nickName ?? "Anónimo"}:</strong>{" "}
                  <span>{comment.content}</span>
                </li>
              ))}
              {visibleComments.length > 3 && (
                <li className="list-group-item px-0 py-2 text-muted">
                  y {visibleComments.length - 3} comentario(s) más...
                </li>
              )}
            </ul>
          </div>
        ) : (
          <div className="mb-3 text-muted">No hay comentarios visibles aún.</div>
        )}

        <Link to={`/post/${post.id}`} className="btn btn-facebook btn-sm">
          Ver más
        </Link>
      </div>
    </article>
  );
}

export default PostCard;