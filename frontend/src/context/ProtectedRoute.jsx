import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { auth, loading } = useContext(AuthContext);

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!auth.isAuthenticated) {
    return <Navigate to="/login" />;
  }
  if (allowedRoles && !allowedRoles.map((role) => role.toLowerCase()).includes(auth.role?.toLowerCase())) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
