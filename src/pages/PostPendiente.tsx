import { Link, useParams } from "react-router-dom";

function PostPendiente() {
  const { id } = useParams();

  return (
    <section className="container py-5">
      <div className="card border-0 shadow-sm">
        <div className="card-body p-4">
          <h1 className="h3 text-facebook fw-bold">
            Detalle de publicación pendiente
          </h1>

          <p className="text-muted">
            pendiente {id}
          </p>

          <Link to="/" className="btn btn-facebook">
            Volver al inicio
          </Link>
        </div>
      </div>
    </section>
  );
}

export default PostPendiente;