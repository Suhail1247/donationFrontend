import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function RedirectIfAuth({ children }) {
  const { user, loading } = useAuth();

  if (loading) return null; // ✅ wait until auth is resolved

  if (user) return <Navigate to="/" replace />;

  return children;
}
