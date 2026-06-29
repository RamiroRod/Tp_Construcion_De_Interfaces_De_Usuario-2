import { Link } from "react-router-dom";
import type { FeedPost } from "../types";

interface PostCardProps {
  post: FeedPost;
}

function PostCard({ post }: PostCardProps) {
  const firstImage = post.images[0];
  const apiUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3001";
  const imageUrl = firstImage
    ? firstImage.url.startsWith("http")
      ? firstImage.url
      : `${apiUrl}${firstImage.url}`
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

            {post.createdAt && (
              <small className="text-muted">
                {new Date(post.createdAt).toLocaleDateString("es-AR")}
              </small>
            )}
          </div>

          <span className="badge bg-soft-blue text-facebook">
            {post.visibleComments.length} comentarios visibles
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

        <Link to={`/post/${post.id}`} className="btn btn-facebook btn-sm">
          Ver más
        </Link>
      </div>
    </article>
  );
}

export default PostCard;