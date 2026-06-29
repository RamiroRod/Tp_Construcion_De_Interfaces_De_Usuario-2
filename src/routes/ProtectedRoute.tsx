import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function ProtectedRoute() {
  const { isAuthenticated, isLoadingSession } = useAuth();
  const location = useLocation();

  if (isLoadingSession) {
    return (
      <main className="container py-5 text-center">
        <div
          className="spinner-border text-primary"
          role="status"
          aria-hidden="true"
        />
        <p className="mt-3 mb-0">Cargando sesión...</p>
      </main>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default ProtectedRoute;