import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { user, initialLoading } = useAuth();
  const location = useLocation();

  if (initialLoading) {
    return (
      <div style={{ padding: "20px", textAlign: "center" }}>
        Loading...
      </div>
    );
  }

  // Not logged in at all → go to auth page
  if (!user) {
    return <Navigate to="/" replace />;
  }

  // ✅ No more profile completeness logic here
  // The only job: block unauthenticated users

  console.log("ProtectedRoute user =", user);
  console.log("location.pathname =", location.pathname);

  return children;
}
