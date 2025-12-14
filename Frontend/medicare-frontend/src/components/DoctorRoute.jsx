import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function DoctorRoute({ children }) {
  const { user, isAuthenticated } = useAuth();

  console.log("DoctorRoute check:", isAuthenticated, user?.role);

  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  if (user?.role !== "doctor") {
    return <Navigate to="/home" replace />;
  }

  return children;
}
