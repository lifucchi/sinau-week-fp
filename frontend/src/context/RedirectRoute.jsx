import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "./AuthContext";

const RedirectRoute = ({ children }) => {
  const { auth, loading } = useContext(AuthContext);

  // Tampilkan loading jika data autentikasi masih dimuat
  if (loading) {
    return null; // Tidak merender apa pun selama loading
  }

  // Jika pengguna sudah terautentikasi, alihkan ke dashboard

  if (auth.isAuthenticated) {
    if (auth.role === "admin") {
      return <Navigate to="/admin-dashboard" replace />;
    } else if (auth.role === "kasir") {
      return <Navigate to="/pos" replace />;
    }
  }

  // Jika belum terautentikasi, render children (halaman yang diminta)
  return children;
};

export default RedirectRoute;
