import { useState, type FormEvent } from "react";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Register() {
  const { isAuthenticated, register } = useAuth();
  const navigate = useNavigate();

  const [nickName, setNickName] = useState("");
  const [email, setEmail] = useState("");
  const [wasValidated, setWasValidated] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setWasValidated(true);
    setError("");
    setSuccess("");

    const form = event.currentTarget;

    if (!form.checkValidity()) {
      return;
    }

    try {
      setIsSubmitting(true);

      await register({
        nickName,
        email,
      });

      setSuccess("Usuario creado correctamente. Ya podés iniciar sesión.");
      window.setTimeout(() => navigate("/login"), 900);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "No se pudo crear el usuario.";

      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="auth-page py-5">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-12 col-md-8 col-lg-5">
            <div className="card border-0 shadow-sm">
              <div className="card-body p-4 p-md-5">
                <h1 className="h3 text-facebook fw-bold text-center">
                  Crear usuario
                </h1>

                <p className="text-muted text-center">
                  Completá los datos para sumarte a Anti-Social Net.
                </p>

                {error && (
                  <div className="alert alert-danger py-2" role="alert">
                    {error}
                  </div>
                )}

                {success && (
                  <div className="alert alert-success py-2" role="alert">
                    {success}
                  </div>
                )}

                <form
                  className={wasValidated ? "was-validated" : ""}
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <div className="mb-3">
                    <label className="form-label" htmlFor="registerNickName">
                      NickName
                    </label>

                    <input
                      className="form-control"
                      id="registerNickName"
                      type="text"
                      value={nickName}
                      onChange={(event) => setNickName(event.target.value)}
                      required
                      minLength={3}
                    />

                    <div className="invalid-feedback">
                      Ingresá un nickName de al menos 3 caracteres.
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label" htmlFor="email">
                      Email
                    </label>

                    <input
                      className="form-control"
                      id="email"
                      type="email"
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      required
                    />

                    <div className="invalid-feedback">
                      Ingresá un email válido.
                    </div>
                  </div>

                  <button
                    className="btn btn-facebook w-100"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Creando..." : "Registrarse"}
                  </button>
                </form>

                <p className="text-center mt-4 mb-0 small">
                  ¿Ya tenés cuenta? <Link to="/login">Iniciar sesión</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Register;