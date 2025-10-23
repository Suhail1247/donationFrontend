import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function RedirectIfAuth({ children }) {
  const { user } = useAuth();

  // If user is already logged in → redirect to home
  if (user) return <Navigate to="/" replace />;

  // Otherwise, allow access to login/register
  return children;
}
