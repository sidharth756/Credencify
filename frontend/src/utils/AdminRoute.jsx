import { Navigate } from "react-router-dom";

function AdminRoute({ children }) {
  const adminUser = localStorage.getItem("adminUser");

  if (!adminUser) {
    // Render nothing — Mods.jsx handles its own login gate
    return children;
  }

  try {
    const parsed = JSON.parse(adminUser);
    if (parsed.role !== "ADMIN") {
      localStorage.removeItem("adminUser");
      return children;
    }
  } catch {
    localStorage.removeItem("adminUser");
    return children;
  }

  return children;
}

export default AdminRoute;
