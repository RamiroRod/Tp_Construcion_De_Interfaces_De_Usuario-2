import { Link, useNavigate } from "react-router-dom";
import { useState, type ChangeEvent, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { createPost } from "../services/api";

function CrearPublicacion() {
  const { user } = useAuth();
  const [description, setDescription] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) {
      setImages([]);
      setImagePreviews([]);
      return;
    }

    const selectedFiles = Array.from(files);
    const previews = selectedFiles.map((file) => URL.createObjectURL(file));
    setImages(selectedFiles);
    setImagePreviews(previews);
  };

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
        description,
        UserId: user.id,
        images,
        imageUrls,
      });
      navigate("/mis-publicaciones");
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
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
                    Ingresá una descripción válida.
                  </div>
                </div>

                <div className="mb-4">
                  <label className="form-label" htmlFor="images">
                    Imágenes
                  </label>
                  <input
                    id="images"
                    className="form-control"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageChange}
                  />
                  <div className="form-text">
                    Podés seleccionar varias imágenes para la publicación.
                  </div>
                </div>

                {imagePreviews.length > 0 && (
                  <div className="mb-4">
                    <div className="row g-3">
                      {imagePreviews.map((src, index) => (
                        <div className="col-6 col-md-4" key={index}>
                          <div className="card border-0 shadow-sm">
                            <img
                              src={src}
                              alt={`Preview ${index + 1}`}
                              className="card-img-top img-fluid"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

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
                          key={index}
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
