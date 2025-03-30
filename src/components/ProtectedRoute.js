import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
  const user = JSON.parse(localStorage.getItem("user")); // Recupera el usuario

  return user ? children || <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;
