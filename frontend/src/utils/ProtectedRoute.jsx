import { Navigate } from "react-router-dom";

/**
 * allowedRoles: string[] — if provided, user.role must be in this list.
 * If not logged in → redirect to /
 * If wrong role → redirect to the correct dashboard for their role
 */
function ProtectedRoute({ children, allowedRoles }) {
  const raw = localStorage.getItem("user");

  if (!raw) {
    // Not logged in at all
    return <Navigate to="/" replace />;
  }

  if (allowedRoles && allowedRoles.length > 0) {
    let parsed;
    try { parsed = JSON.parse(raw); } catch { return <Navigate to="/" replace />; }

    if (!allowedRoles.includes(parsed.role)) {
      // Wrong role — send them to their correct destination
      if (parsed.role === "ADMIN") return <Navigate to="/admin/dashboard" replace />;
      return <Navigate to="/dashboard" replace />;
    }
  }

  return children;
}

export default ProtectedRoute;
