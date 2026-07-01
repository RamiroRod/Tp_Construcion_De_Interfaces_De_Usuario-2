import { useState, type FormEvent } from "react";
import { Link, Navigate, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface LocationState {
  from?: {
    pathname?: string;
  };
}

function Login() {
  const { isAuthenticated, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const state = location.state as LocationState | null;

  const [nickName, setNickName] = useState("");
  const [password, setPassword] = useState("");
  const [wasValidated, setWasValidated] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setWasValidated(true);
    setError("");

    const form = event.currentTarget;

    if (!form.checkValidity()) {
      return;
    }

    try {
      setIsSubmitting(true);
      await login(nickName, password);
      navigate(state?.from?.pathname || "/", { replace: true });
    } catch (err) {
      const message =
        err instanceof Error ?  err.message : "No se pudo iniciar sesión.";

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
                  Iniciar sesión
                </h1>

                <p className="text-muted text-center">
                  Usá tu nickName y la contraseña fija <strong>123456</strong>.
                </p>

                {error && (
                  <div className="alert alert-danger py-2" role="alert">
                    {error}
                  </div>
                )}

                <form
                  className={wasValidated ? "was-validated" : ""}
                  onSubmit={handleSubmit}
                  noValidate
                >
                  <div className="mb-3">
                    <label className="form-label" htmlFor="nickName">
                      NickName
                    </label>

                    <input
                      className="form-control"
                      id="nickName"
                      type="text"
                      value={nickName}
                      onChange={(event) => setNickName(event.target.value)}
                      required
                      minLength={3}
                    />

                    <div className="invalid-feedback">
                      Ingresá un nickName válido.
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="form-label" htmlFor="password">
                      Contraseña
                    </label>

                    <input
                      className="form-control"
                      id="password"
                      type="password"
                      value={password}
                      onChange={(event) => setPassword(event.target.value)}
                      required
                    />

                    <div className="invalid-feedback">
                      Ingresá la contraseña.
                    </div>
                  </div>

                  <button
                    className="btn btn-facebook w-100"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? "Validando..." : "Entrar"}
                  </button>
                </form>

                <p className="text-center mt-4 mb-0 small">
                  ¿Todavía no tenes cuenta?{" "}
                  <Link to="/register">Crear usuario</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;