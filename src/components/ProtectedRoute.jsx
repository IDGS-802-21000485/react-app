// src/components/ProtectedRoute.jsx
import { useContext } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { AuthContext } from './AuthContext';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);
  const location = useLocation();

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Cargando...</div>;
  }

  if (!user) {
    // Redirige a login pero guarda la ubicación a la que intentaban acceder
    return <Navigate to="*" state={{ from: location }} replace />;
  }

  return children;
};

export default ProtectedRoute;