// src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = () => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    // Puedes mostrar un spinner aquí si lo deseas
    return <div>Cargando...</div>;
  }

  // Si no hay usuario, redirige a la página de login.
  // Si hay usuario, muestra la página solicitada (a través de <Outlet />).
  return user ? <Outlet /> : <Navigate to="/Login" replace />;
};

export default ProtectedRoute;