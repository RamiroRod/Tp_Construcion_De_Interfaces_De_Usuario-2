import { useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { createPost, getTags } from "../services/api";
import type { Tag } from "../types";

function CrearPublicacion() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [description, setDescription] = useState("");
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [tags, setTags] = useState<Tag[]>([]);
  const [selectedTagIds, setSelectedTagIds] = useState<number[]>([]);

  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [tagError, setTagError] = useState("");
  const [isLoadingTags, setIsLoadingTags] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadTags() {
      try {
        setIsLoadingTags(true);
        setTagError("");
        const data = await getTags();

        if (!ignore) {
          setTags(data);
        }
      } catch (err) {
        if (!ignore) {
          const message =
            err instanceof Error
              ? err.message
              : "No se pudieron cargar las etiquetas.";
          setTagError(message);
        }
      } finally {
        if (!ignore) {
          setIsLoadingTags(false);
        }
      }
    }

    loadTags();

    return () => {
      ignore = true;
    };
  }, []);

  const handleImageUrlChange = (event: ChangeEvent<HTMLInputElement>) => {
    setImageUrlInput(event.target.value);
  };

  const addImageUrl = () => {
    const url = imageUrlInput.trim();
    if (!url) return;

    if (!/^https?:\/\//i.test(url)) {
      setError("Ingresá una URL válida que comience con http:// o https://");
      return;
    }

    setImageUrls((current) => [...current, url]);
    setImageUrlInput("");
    setError("");
  };

  const removeImageUrl = (index: number) => {
    setImageUrls((current) => current.filter((_, idx) => idx !== index));
  };

  const toggleTag = (tagId: number) => {
    setSelectedTagIds((current) =>
      current.includes(tagId)
        ? current.filter((id) => id !== tagId)
        : [...current, tagId]
    );
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    setError("");

    if (!user) {
      setError("Debes iniciar sesión para crear una publicación.");
      return;
    }

    const form = event.currentTarget;

    if (!form.checkValidity()) {
      return;
    }

    try {
      setIsSubmitting(true);

      await createPost({
        description: description.trim(),
        userId: user.id,
        tagIds: selectedTagIds,
        imageUrls,
      });

      navigate("/mis-publicaciones", { state: { refreshAt: Date.now() } });
    } catch (err) {
      const message =
        err instanceof Error
          ? "Error en la base de datos: " + err.message
          : "No se pudo crear la publicación.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-lg-8">
          <div className="card border-0 shadow-sm">
            <div className="card-body p-4">
              <h1 className="h3 text-facebook fw-bold">Crear publicación</h1>

              <form
                className={submitted ? "was-validated" : ""}
                onSubmit={handleSubmit}
                noValidate
              >
                <div className="mb-4">
                  <label className="form-label" htmlFor="description">
                    Descripción
                  </label>
                  <textarea
                    id="description"
                    className="form-control"
                    rows={5}
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    required
                    minLength={10}
                  />
                  <div className="invalid-feedback">
                    Ingresá una descripción válida de al menos 10 caracteres.
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label">Etiquetas</label>

                  {isLoadingTags ? (
                    <p className="text-muted mb-0">Cargando etiquetas...</p>
                  ) : tagError ? (
                    <div className="alert alert-warning mb-0" role="alert">
                      {tagError}
                    </div>
                  ) : tags.length === 0 ? (
                    <div className="alert alert-warning mb-0" role="alert">
                      La API no devolvió etiquetas. Revisá que <code>GET /tags</code> tenga datos cargados.
                    </div>
                  ) : (
                    <div className="d-flex flex-wrap gap-3">
                      {tags.map((tag) => (
                        <div className="form-check" key={tag.id}>
                          <input
                            className="form-check-input"
                            type="checkbox"
                            id={`tag-${tag.id}`}
                            checked={selectedTagIds.includes(tag.id)}
                            onChange={() => toggleTag(tag.id)}
                          />
                          <label className="form-check-label" htmlFor={`tag-${tag.id}`}>
                            {tag.name}
                          </label>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="mb-4">
                  <label className="form-label" htmlFor="imageUrl">
                    URL de imagen
                  </label>
                  <div className="input-group">
                    <input
                      id="imageUrl"
                      className="form-control"
                      type="url"
                      value={imageUrlInput}
                      onChange={handleImageUrlChange}
                      placeholder="https://example.com/imagen.jpg"
                    />
                    <button
                      type="button"
                      className="btn btn-outline-facebook"
                      onClick={addImageUrl}
                    >
                      Agregar URL
                    </button>
                  </div>
                  <div className="form-text">
                    También podés agregar imágenes usando URLs públicas.
                  </div>
                </div>

                {imageUrls.length > 0 && (
                  <div className="mb-4">
                    <div className="d-flex flex-column gap-2">
                      {imageUrls.map((url, index) => (
                        <div
                          key={url}
                          className="d-flex align-items-center justify-content-between bg-light rounded p-2"
                        >
                          <span className="text-truncate" style={{ maxWidth: "85%" }}>
                            {url}
                          </span>
                          <button
                            type="button"
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removeImageUrl(index)}
                          >
                            Eliminar
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <button
                  className="btn btn-facebook"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Publicando..." : "Publicar"}
                </button>
              </form>

              {error && (
                <div className="alert alert-danger mt-4" role="alert">
                  {error}
                </div>
              )}

              <p className="text-muted mt-4 mb-0">
                <Link to="/mis-publicaciones">Volver a mis publicaciones</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default CrearPublicacion;
